# Turn's relay logs research notes

How a script can read a day of the relay's Workers Logs, from Cloudflare's
API reference and OpenAPI schema, the `cloudflare` npm package 7.1.0, and
Wrangler 4.136.2, read for issue #31 on September 23, 2026. Judgment starts
with "Synthesis:".

Contents:

1.  [The telemetry query API](#the-telemetry-query-api)
1.  [The API token's permission](#the-api-tokens-permission)
1.  [Wrangler 4.136.2 and stored logs](#wrangler-41362-and-stored-logs)
1.  [Workers Logs limits on Free](#workers-logs-limits-on-free)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## The telemetry query API

- **The endpoint.** The operation is summarized "Run a query" and sits at
  the path below ([API][cf-api-query]; [OpenAPI][cf-openapi]). The SDK's
  default base URL is `https://api.cloudflare.com/client/v4`
  (`client.js`, line 175, [SDK][sdk]).

  ```text
  POST https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/observability/telemetry/query
  ```

- **Required fields.** The schema requires `queryId` and `timeframe`.
  `queryId`: "When parameters are omitted, this ID is used to load a
  previously saved query's parameters. When providing parameters inline,
  pass any identifier (e.g. an ad-hoc ID)." ([OpenAPI][cf-openapi])
- **The timeframe.** "Timeframe for the query using Unix timestamps in
  milliseconds. 'from' must be earlier than 'to'." `from` and `to` are
  integers from 0 to 253402300799999 ([OpenAPI][cf-openapi]).
- **The view.** "'events': individual log lines matching the query.
  'calculations': aggregated metrics (count, avg, p99, etc.) with optional
  group-by breakdowns and time-series." The default is `calculations`
  ([OpenAPI][cf-openapi]).
- **Limit and paging.** `limit` is the "Maximum number of events to return
  when view is 'events'. Also controls the number of group-by rows when
  view is 'calculations'.", with a default of 50 and a maximum of 2000.
  `offset` is a "Cursor for pagination in event, trace, invocation, and
  agent views. Pass the $metadata.id of the last event, the trace cursor,
  or AgentRun.id to fetch the next page." ([OpenAPI][cf-openapi])
  `offsetDirection` is "'next' for forward, 'prev' for backward." ([SDK][sdk])
- **Dry runs.** `dry`: "When true, executes the query without persisting
  the results. Useful for validation or previewing." It defaults to
  `false` ([OpenAPI][cf-openapi]).
- **Parameters.** `parameters` holds `filters`, `calculations`, `groupBys`,
  `havings`, `needle`, `orderBy`, and its own `limit`, the "Maximum number
  of group-by rows to return in calculation results" ([SDK][sdk]). A
  filter leaf is `{ key, operation, type, value }`, where `operation` is
  one of `includes`, `not_includes`, `starts_with`, `ends_with`, `regex`,
  `exists`, `is_null`, `in`, `not_in`, `eq`, `neq`, `gt`, `gte`, `lt`, or
  `lte`, and "Common keys include $metadata.service, $metadata.origin,
  $metadata.trigger, $metadata.message, and $metadata.error." A
  calculation is `{ operator, key, keyType, alias }`, with operators
  including `count`, `median`, `p95`, and `p99`, and a group-by is
  `{ type, value }` ([SDK][sdk]).
- **Discovering keys.** A sibling, `POST .../telemetry/keys`, is
  documented as "List all the keys in your telemetry events." The filter
  docs say to "Use verified keys from previous query results or the keys
  endpoint." (`telemetry.js` and `telemetry.d.ts`, [SDK][sdk])
- **The events response.** The SDK returns `obj.result`, so the HTTP body
  nests everything under `result`. `result.events.count` is the "Total
  number of events matching the query (may exceed the number returned due
  to limits)", and `result.events.events` is the list ([SDK][sdk]).
- **One event.** Each has `$metadata`, "Structured metadata extracted from
  the event. These fields are indexed and available for filtering and
  aggregation."; `source`, the "Raw log payload. May be a string or a
  structured object depending on how the log was emitted."; `timestamp`,
  the "Event timestamp as a Unix epoch in milliseconds."; and `dataset`.
  `$metadata.id` is the "Unique event ID. Use as the cursor value for
  offset-based pagination." ([SDK][sdk])
- **The calculations response.** `result.calculations` is a list of
  `{ calculation, alias, aggregates, series }`, and each aggregate is
  `{ value, count, interval, sampleInterval, groups }`, with `groups` a
  list of `{ key, value }` ([SDK][sdk]).
- **Rate limits.** "The global rate limit for the Cloudflare API is 1,200
  requests per five minute period per user, and applies cumulatively
  regardless of whether the request is made via the dashboard, API key, or
  API token." "If you exceed this limit, all API calls for the next five
  minutes will be blocked, receiving a `HTTP 429 - Too Many Requests`
  response." ([limits][cf-api-limits]) No limit specific to this endpoint
  was found.
- Synthesis: use the `events` view with `limit: 2000` and `dry: true`, and
  page by passing the last event's `$metadata.id` as `offset` until a page
  comes back short. The relay's object should arrive in `source`, as the
  Workers Logs page says `console.log({user_id: 123})` is stored as an
  object ([relay notes][relay-logs]), so the script can count `outcome`
  and take the median and 95th percentile of `ms.total` itself, exactly.
  Free's cap of 200,000 events a day ([services notes][svc-logs]) is at
  most 100 pages, well inside 1,200 calls in 5 minutes. A `calculations`
  query (a `count` grouped by `outcome`, plus `median` and `p95`) would
  take one call, but its keys and sampling are unconfirmed (see
  [Gaps](#gaps)). An untested body for September 22, 2026 in UTC:

  ```json
  {
    "queryId": "relay-day",
    "timeframe": { "from": 1790035200000, "to": 1790121600000 },
    "view": "events",
    "limit": 2000,
    "dry": true,
    "parameters": {
      "filters": [{ "key": "$metadata.service", "operation": "eq", "type": "string", "value": "turn-relay" }]
    }
  }
  ```

[cf-api-limits]: https://developers.cloudflare.com/fundamentals/api/reference/limits/
[sdk]: https://www.npmjs.com/package/cloudflare/v/7.1.0

## The API token's permission

- **The permission.** The query's API reference names "Workers
  Observability Write" as its permission ([API][cf-api-query]), and the
  OpenAPI operation says the same in
  `"x-api-token-group": ["Workers Observability Write"]`
  ([OpenAPI][cf-openapi]).
- **Auth headers.** The reference accepts an API token as
  `Authorization: Bearer <token>`, or the older `X-Auth-Email` and
  `X-Auth-Key` pair ([API][cf-api-query]).
- **Account-owned tokens work.** The account-owned tokens page marks
  "Workers Observability" as compatible. They're made at "Manage Account >
  Account API Tokens", and "Creating or updating an account owned token
  requires Super Administrator permission on the account"
  ([account tokens][cf-acct-tokens]).
- **User tokens.** "From the Cloudflare dashboard, go to My Profile > API
  Tokens for user tokens." A permission is chosen as a group (Account,
  User, or Zone), and "`Edit` is full CRUDL (create, read, update, delete,
  list) access, while `Read` is the read permission and list where
  appropriate." ([create a token][cf-create-token])
- **Not on the permissions list.** The permissions reference page, as
  read, has no Workers Observability row ([permissions][cf-permissions]).
- Synthesis: the script needs a token with the account permission
  "Workers Observability" at `Edit`, which the API calls "Workers
  Observability Write"; the Read and Write names map to the dashboard's
  Read and Edit by the create-token page's wording, not by a page that
  names this group. Prefer an account-owned token, since it doesn't belong
  to one teammate, made by the account's Super Administrator and limited
  to this one account. Pass it and the account ID through the environment,
  never argv.

[cf-acct-tokens]: https://developers.cloudflare.com/fundamentals/api/get-started/account-owned-tokens/
[cf-create-token]: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
[cf-permissions]: https://developers.cloudflare.com/fundamentals/api/reference/permissions/

## Wrangler 4.136.2 and stored logs

Line numbers are in `worker/node_modules/wrangler/wrangler-dist/cli.js`.
The three commands below print without logging in.

- **No command reads stored logs.** `wrangler --help` lists
  `wrangler tail [worker]`, "Start a log tailing session for a Worker",
  and no `observability` or `logs` command ([Wrangler][wrangler]).
- **No scope for it.** `wrangler login --scopes-list` prints 27 scopes,
  from `account:read` to `challenge-widgets.write`, with none for
  observability; the nearest are `workers_tail:read`, "See Cloudflare
  Workers tail and script data.", and `workers_scripts:write`.
- **`--scopes` can't add one.** `login --help` offers `--scopes`, "Pick
  the set of applicable OAuth scopes when logging in", but the login
  checks them with `scopes.every((scope) => scope in DefaultScopes)`
  (line 129504), and `DefaultScopes` is that same list of 27 (lines 129537
  to 129565). Anything else fails with "Invalid authentication scope"
  (line 350206).
- **A second list has them.** `CF_REGISTERED_SCOPES` includes
  `workers_observability:read`, `workers_observability:write`, and
  `workers_observability_telemetry:write` (lines 179523 to 179525), with
  its own `validateScopeKeys2` (line 178911).
- **The SDK is bundled, unused.** The bundle carries the `cloudflare` SDK
  5.2.0's telemetry resource with the same `query` path (lines 111709 to
  111778), but `observability.telemetry` appears only in its doc-comment
  examples (lines 111726, 111743, and 111763).
- Synthesis: Wrangler 4.136.2 can't read Workers Logs, and its OAuth
  login can't ask for an observability scope, which fits the earlier
  `403 Authentication error`. The script should call the API with `fetch`
  and an API token; the `cloudflare` package isn't needed for one POST.

[wrangler]: https://www.npmjs.com/package/wrangler/v/4.136.2

## Workers Logs limits on Free

- **Already established.** Free keeps 200,000 events a day for 3 days
  ([services notes][svc-logs]), and one log is capped at 256 KB
  ([relay notes][relay-logs]).
- **Account limits.** The limits table lists "Maximum log retention
  period | 7 Days", "Maximum logs per account per day | 5 Billion", and
  "Maximum log size | 256 KB". "After the limit is exceed, a 1% head-based
  sample will be applied for the remainder of the day."
  ([Workers Logs][cf-wlogs])
- **Sampling.** "Head-based sampling allows you to log a percentage of
  incoming requests to your Cloudflare Worker." "The valid range is from 0
  to 1, where 0 indicates zero out of one hundred requests are logged, and
  1 indicates every request is logged. If `head_sampling_rate` is
  unspecified, it is configured to a default value of 1 (100%)."
  ([Workers Logs][cf-wlogs]) `worker/wrangler.jsonc` doesn't set it, and
  Wrangler's schema describes it only as "The sampling rate"
  (`config-schema.json`, line 3963).
- **Late events.** The Workers Logs page, as read, says nothing about how
  long an event takes to become queryable ([Workers Logs][cf-wlogs]).
- Synthesis: at Turn's volume, 200,000 a day is far off, and with no
  `head_sampling_rate` every request is logged. Query the previous whole UTC
  day, once that day has ended, and have the script print `result.events.count`
  beside the rows it read, so a short or sampled day shows. A day run later than
  3 days finds nothing.

[cf-wlogs]: https://developers.cloudflare.com/workers/observability/logs/workers-logs/

## Gaps

- **Nothing was run against the API.** No token was made, so no query's
  response was seen.
- **Key names for the relay's fields.** Whether a filter or calculation
  names `outcome` or `source.outcome`, and how the nested `ms.total` is
  keyed, is unconfirmed; the keys endpoint would say.
- **`$metadata.service`.** That it holds the Worker's name, `turn-relay`,
  is assumed.
- **Calculations.** Whether `median` and `p95` are exact, and what
  `sampleInterval` means, wasn't found.
- **Read with `dry`.** Whether a Read-level token may run a `dry` query
  is untested; the schema asks for Write either way.
- **The dashboard's label.** The token page's exact wording for this
  group wasn't seen, since the dashboard needs a login.
- **Free past 200,000.** The 1% sample sentence follows the per-account
  row of 5 billion; what Free does past its daily 200,000 wasn't found.
- **Late events.** How long an event takes to become queryable isn't on
  the pages read.
- **The second scope list.** Which command uses `CF_REGISTERED_SCOPES`,
  perhaps the bundled `cf-wrangler` bin, wasn't traced.
- **Quotes from docs pages.** Those pages came through a fetch tool that
  condenses them; the OpenAPI, SDK, and Wrangler quotes were read from the
  files.
- **Not read.** The Query Builder page.

## See also

- [Relay notes, Workers Logs](/docs/research/0038-turn-relay.md#workers-logs)
- [Services notes, Workers Logs and traces](/docs/research/0024-turn-services.md#workers-logs-and-traces-for-the-relay)
- [Setup notes, Cloudflare and Wrangler](/docs/research/0036-turn-setup.md#cloudflare-and-wrangler-41362)
- [TRD, Logs and counts](/docs/TRD.md#logs-and-counts)

[cf-openapi]: https://github.com/cloudflare/api-schemas/blob/main/openapi.json
[relay-logs]: /docs/research/0038-turn-relay.md#workers-logs
[svc-logs]: /docs/research/0024-turn-services.md#workers-logs-and-traces-for-the-relay
[cf-api-query]: https://developers.cloudflare.com/api/resources/workers/subresources/observability/subresources/telemetry/methods/query/

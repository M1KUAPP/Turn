# Cloudflare Workers research notes

What Guessling's backend needs from Cloudflare Workers, Workers KV, and
Durable Objects, and how Jev's JavaScript SDK runs in a Worker. Every source
below was read on September 22, 2026, so versions, prices, and limits are as
of that date; where the sources were silent, a local test with Wrangler
4.136.1 filled in, and those results are labeled as local tests.

Contents:

1.  [Findings for the PRD and TRD](#findings-for-the-prd-and-trd)
1.  [Plans, limits, and the API's domain](#plans-limits-and-the-apis-domain)
    1.  [Workers Free and Paid prices](#workers-free-and-paid-prices)
    1.  [Per-request limits](#per-request-limits)
    1.  [workers.dev or a custom domain](#workersdev-or-a-custom-domain)
1.  [Workers KV for puzzles and the schedule](#workers-kv-for-puzzles-and-the-schedule)
    1.  [KV consistency and caching](#kv-consistency-and-caching)
    1.  [KV limits and quotas](#kv-limits-and-quotas)
    1.  [Publishing tomorrow's puzzle ahead of time](#publishing-tomorrows-puzzle-ahead-of-time)
1.  [Durable Objects for each day's answers](#durable-objects-for-each-days-answers)
    1.  [Durable Objects on the Free and Paid plans](#durable-objects-on-the-free-and-paid-plans)
    1.  [The Durable Object storage API](#the-durable-object-storage-api)
    1.  [Single-threaded execution and input and output gates](#single-threaded-execution-and-input-and-output-gates)
    1.  [Names, creation, and location hints](#names-creation-and-location-hints)
    1.  [Alarms, lifecycle, and Durable Object limits](#alarms-lifecycle-and-durable-object-limits)
    1.  [Concurrent first answers to a new wording](#concurrent-first-answers-to-a-new-wording)
1.  [Limiting requests per device](#limiting-requests-per-device)
    1.  [The Rate Limiting binding](#the-rate-limiting-binding)
    1.  [Counting in a Durable Object](#counting-in-a-durable-object)
1.  [Secrets, configuration, and Wrangler](#secrets-configuration-and-wrangler)
    1.  [Secrets, Secrets Store, and vars](#secrets-secrets-store-and-vars)
    1.  [Config files and compatibility dates](#config-files-and-compatibility-dates)
    1.  [Node.js compatibility by default](#nodejs-compatibility-by-default)
1.  [Jev's JavaScript SDK in a Worker](#jevs-javascript-sdk-in-a-worker)
    1.  [What the SDK's published code uses](#what-the-sdks-published-code-uses)
    1.  [The SDK under workerd](#the-sdk-under-workerd)
    1.  [Calling the System One API with fetch](#calling-the-system-one-api-with-fetch)
1.  [Time, dates, and Cron Triggers](#time-dates-and-cron-triggers)
    1.  [Cron Triggers](#cron-triggers)
    1.  [The Workers clock](#the-workers-clock)
    1.  [Choosing today's puzzle for a player's date](#choosing-todays-puzzle-for-a-players-date)
1.  [Logs and counts](#logs-and-counts)
    1.  [Workers Logs](#workers-logs)
    1.  [Tail Workers](#tail-workers)
    1.  [Workers Analytics Engine](#workers-analytics-engine)
1.  [Hosting the privacy policy and terms](#hosting-the-privacy-policy-and-terms)
1.  [Local development and tests](#local-development-and-tests)
1.  [Latency and placement](#latency-and-placement)
1.  [Latest versions as of September 22, 2026](#latest-versions-as-of-september-22-2026)
1.  [Conflicts between sources](#conflicts-between-sources)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## Findings for the PRD and TRD

Synthesis: each line condenses the section it links to, where the sources
are.

- **First answers can split.** A `fetch` inside a Durable Object lets other
  requests run, so one object per day doesn't by itself stop two players
  getting different first answers to the same new wording. Share the
  in-flight Jev call per wording inside the object, and return what storage
  holds after an insert-if-absent. See
  [Concurrent first answers to a new wording](#concurrent-first-answers-to-a-new-wording).
- **The SDK runs in a Worker.** `@typesafe-ai/sdk` 0.6.0 imports no Node.js
  modules and ran under workerd with Node.js compatibility on or off. Pass
  `apiKey` and the other options explicitly, and bound each call a player
  waits on with a `signal`, since its timeout is per attempt with no total
  budget. See [The SDK under workerd](#the-sdk-under-workerd).
- **Node.js compatibility is now the default.** From compatibility date
  2026-08-04, `process.env` carries the Worker's vars and secrets, so any
  `TYPESAFE_*` variable silently configures the SDK. See
  [Node.js compatibility by default](#nodejs-compatibility-by-default).
- **KV is slow to change.** A write can take "up to 60 seconds or more" to
  show elsewhere, missing keys are cached too, and one key takes one write a
  second. Publish each puzzle a day or more ahead, as one value that never
  changes once live, and keep each day's answers out of KV. See
  [Publishing tomorrow's puzzle ahead of time](#publishing-tomorrows-puzzle-ahead-of-time).
- **A date lasts about 50 hours.** A date is today somewhere from 10:00 UTC
  the day before to 12:00 UTC the day after, and the Worker's clock is UTC
  and moves only on I/O. Accept the app's local date only inside that
  window. See
  [Choosing today's puzzle for a player's date](#choosing-todays-puzzle-for-a-players-date).
- **Pay the $5.** Workers Paid lifts the Free plan's 100,000 requests a day
  and 10 ms of CPU per request, and launch traffic fits in its included
  usage. See [Workers Free and Paid prices](#workers-free-and-paid-prices).
- **Two layers of limits.** The Rate Limiting binding is generally
  available but "permissive", per location, and only has 10- or 60-second
  windows. Use it for bursts per device, and count daily caps in the day's
  Durable Object. See
  [Limiting requests per device](#limiting-requests-per-device).
- **A custom domain for the API.** Cloudflare calls `workers.dev` a "Free
  website" meant for hobby projects, and the app binary pins its API URL.
  The privacy and terms pages can be free static assets of the same Worker.
  See [workers.dev or a custom domain](#workersdev-or-a-custom-domain) and
  [Hosting the privacy policy and terms](#hosting-the-privacy-policy-and-terms).
- **Put the Jev call in western North America.** `api.typesafe.ai`
  resolves to AWS us-west-2. Create each day's object with
  `locationHint: "wnam"` and call Jev from there. See
  [Latency and placement](#latency-and-placement).
- **Count in Workers Analytics Engine.** It counts players, questions, and
  solves from the Worker with no analytics SDK in the app, keeps three
  months, and isn't billed yet. See
  [Workers Analytics Engine](#workers-analytics-engine).
- **Test tooling moved.** `@cloudflare/vitest-pool-workers` is now
  `@cloudflare/vitest-plugin` 1.2.1, which needs Vitest 4.1 while npm's
  latest Vitest is 5.0.1, and Wrangler 4's KV commands write to local
  storage unless given `--remote`. See
  [Local development and tests](#local-development-and-tests).

## Plans, limits, and the API's domain

Guessling's backend is one Worker with KV, Durable Objects, a Rate Limiting
binding, and static assets; this section covers the plan it runs on and the
URL the app calls.

### Workers Free and Paid prices

The Workers plans, from the pricing and limits pages ([cf-pricing];
[cf-limits]):

| Item                      | Workers Free             | Workers Paid                                        |
| ------------------------- | ------------------------ | --------------------------------------------------- |
| Base price                | None                     | "minimum charge of $5 USD per month for an account" |
| Requests to the Worker    | 100,000 per day          | 10 million a month, then $0.30 per million          |
| CPU time                  | 10 ms per invocation     | 30 million CPU ms a month, then $0.02 per million   |
| Duration                  | "No charge for duration" | "No charge or limit for duration"                   |
| Requests to static assets | "free and unlimited"     | "free and unlimited"                                |

- **What Paid covers.** "The Workers Paid plan includes Workers, Pages
  Functions, Workers KV, Hyperdrive, and Durable Objects usage for a minimum
  charge of $5 USD per month for an account." ([cf-pricing])
- **Subrequests are free.** "Cloudflare does not bill for subrequests you
  make from your Worker." ([cf-pricing])
- **The Free daily cap.** "Accounts on the Workers Free plan have a daily
  request limit of 100,000 requests, resetting at midnight UTC. When a
  Worker exceeds this limit, Cloudflare returns **Error 1027**."
  ([cf-limits])
- **Free quotas fail hard.** For KV on the Free plan: "If you exceed any
  one of these limits, further operations of that type will fail with an
  error." ([cf-pricing]) The Durable Objects page says the same for its Free
  limits ([cf-do-pricing]).
- **A spending cap.** "To prevent accidental runaway bills or
  denial-of-wallet attacks, configure the maximum amount of CPU time that
  can be used per invocation" with `limits.cpu_ms` ([cf-pricing]).
- **Typical CPU use.** "The average Worker uses approximately 2.2 ms per
  request." ([cf-limits])
- Synthesis: take 1,000 players a day asking 20 questions each, with one
  Worker request, one Durable Object request, and three KV reads per
  question. A month then has about 600,000 Worker requests, 600,000 object
  requests, and 1.8 million KV reads, all inside Paid's included usage
  (KV and object quotas are under
  [KV limits and quotas](#kv-limits-and-quotas) and
  [Durable Objects on the Free and Paid plans](#durable-objects-on-the-free-and-paid-plans)).
  On Free, the 100,000 KV reads a day run out first, near 1,700 such
  players a day, and a day's traffic spike past 100,000 requests returns
  Error 1027 until midnight UTC. The $5 plan is cheap insurance for a
  launch week.

### Per-request limits

From the Workers limits page ([cf-limits]):

| Limit                                    | Workers Free  | Workers Paid                                       |
| ---------------------------------------- | ------------- | -------------------------------------------------- |
| CPU time per HTTP request                | 10 ms         | 5 min (default: 30 seconds)                        |
| CPU time per Cron Trigger                | 10 ms         | 30 seconds (< 1 hour interval), 15 min (>= 1 hour) |
| Memory per isolate                       | 128 MB        | 128 MB                                             |
| Subrequests per invocation               | 50            | 10,000 (up to 10M)                                 |
| Connections waiting for response headers | 6             | 6                                                  |
| Wall time of an HTTP request             | No limit      | No limit                                           |
| Worker size, uncompressed                | 64 MiB        | 64 MiB                                             |
| Startup time                             | 1 second      | 1 second                                           |
| Variables per Worker (secrets and text)  | 64, 5 KB each | 128, 5 KB each                                     |

- **Waiting is free.** "Waiting on network requests (such as `fetch()`
  calls, KV reads, or database queries) does **not** count toward CPU
  time." ([cf-limits])
- **Memory is shared.** "This limit is per-isolate, not per-invocation. A
  single isolate can handle many concurrent requests." ([cf-limits])
- **Disconnects cancel work.** "When the client disconnects or the response
  is complete, tasks associated with that request may be canceled."
  `waitUntil()` "can extend execution for up to 30 seconds after the
  response is sent or the client disconnects." ([cf-limits])
- **Connections queue.** "If a seventh connection is attempted while six
  are already waiting for headers, it is queued until one of the existing
  connections receives its response headers." ([cf-limits])
- Synthesis: a question needs a few KV reads, one Durable Object call, and
  at most one Jev call, far inside every limit. The rule that matters is
  the disconnect: a player who leaves the app mid-question may cancel the
  Worker's work, so the answer should be stored inside the Durable Object
  as soon as Jev returns, not after the response.

### workers.dev or a custom domain

- **workers.dev is for hobby projects.** "It's recommended to run
  production Workers on a Workers route or custom domain, rather than on
  your `workers.dev` subdomain. Your `workers.dev` subdomain is treated as
  a Free website and is intended for personal or hobby projects that
  aren't business-critical." ([cf-workers-dev])
- **Its URL.** Each Worker gets
  `<YOUR_WORKER_NAME>.<YOUR_SUBDOMAIN>.workers.dev`, and "When enabled,
  your `workers.dev` URL is available publicly." ([cf-workers-dev])
- **Turning it off.** `"workers_dev": false` disables it, and "Preview URLs
  default to matching your `workers_dev` setting unless explicitly
  configured." A route added without the setting makes Wrangler infer
  `false`, and a dashboard toggle alone is undone: "the `workers.dev` route
  will be re-enabled the next time you deploy your Worker with Wrangler."
  ([cf-workers-dev])
- **Custom Domains.** "After you set up a Custom Domain for your Worker,
  Cloudflare will create DNS records and issue necessary certificates on
  your behalf." Adding one requires "An active Cloudflare zone", and the
  Wrangler setting is a route with `"custom_domain": true`
  ([cf-custom-domains]). "Custom Domains are recommended for use cases where
  your Worker is your application's origin server." ([cf-routing])
- Synthesis: the API's base URL ships inside the app binary, so moving it
  later takes an app update and another review. A custom domain on a zone
  the team controls, such as `api.` on the game's domain, keeps the URL
  stable and puts the privacy pages on the same name. Setting
  `workers_dev` to `false` then leaves one public entry point.
  `workers.dev` is fine for early TestFlight builds if the domain isn't
  ready.

[cf-custom-domains]: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
[cf-routing]: https://developers.cloudflare.com/workers/configuration/routing/

## Workers KV for puzzles and the schedule

The build plan keeps the fact cards, accepted names, checked bank answers,
and daily schedule in KV ([idea-stack]). KV suits data that's written rarely
and read everywhere.

### KV consistency and caching

- **Eventual consistency.** "KV achieves high performance by being
  eventually-consistent. At the Cloudflare global network location at which
  changes are made, these changes are usually immediately visible. However,
  this is not guaranteed and therefore it is not advised to rely on this
  behaviour. In other global network locations changes may take up to 60
  seconds or more to be visible as their cached versions of the data
  time-out." ([cf-kv-how])
- **Missing keys are cached.** "Negative lookups indicating that the key
  does not exist are also cached, so the same delay exists noticing a value
  is created as when a value is changed." ([cf-kv-how])
- **Recent readers lag more.** "Visibility of changes takes longer in
  locations which have recently read a previous version of a given key"
  ([cf-kv-how]).
- **Last write wins.** "If concurrent writes are made to the same key, the
  last write will take precedence." ([cf-kv-write])
- **No transactions.** "KV is not ideal for applications where you need
  support for atomic operations or where values must be read and written in
  a single transaction." ([cf-kv-how])
- **`cacheTtl`.** It "defines the length of time in seconds that a KV result
  is cached in the global network location it is accessed from"; "The
  `cacheTtl` parameter must be an integer greater than or equal to `30`.
  `60` is the default." It "is useful if your data is write-once or
  write-rarely", and "is not recommended if your data is updated often and
  you need to see updates shortly after they are written" ([cf-kv-read]).
  The minimum dropped from 60 to 30 seconds on January 30, 2026
  ([cf-kv-ttl-change]).
- **Expiration wins over caching.** "An `expiration` setting on a key will
  result in that key being deleted, even in cases where the `cacheTtl` is
  set to a higher (longer duration) value. Expiration always takes
  precedence." ([cf-kv-write])

[cf-kv-ttl-change]: https://developers.cloudflare.com/changelog/post/2026-01-30-kv-reduced-minimum-cachettl/

### KV limits and quotas

From the KV limits and pricing pages ([cf-kv-limits]; [cf-kv-pricing]):

| Limit                            | Free             | Paid                                           |
| -------------------------------- | ---------------- | ---------------------------------------------- |
| Keys read                        | 100,000 a day    | 10 million a month, then $0.50 per million     |
| Keys written                     | 1,000 a day      | 1 million a month, then $5.00 per million      |
| Keys deleted, list requests      | 1,000 a day each | 1 million a month each, then $5.00 per million |
| Stored data                      | 1 GB             | 1 GB, then $0.50 per GB-month                  |
| Writes to the same key           | 1 per second     | 1 per second                                   |
| Operations per Worker invocation | 1,000            | 1,000                                          |
| Key size                         | 512 bytes        | 512 bytes                                      |
| Key metadata                     | 1024 bytes       | 1024 bytes                                     |
| Value size                       | 25 MiB           | 25 MiB                                         |
| Minimum `cacheTtl`               | 30 seconds       | 30 seconds                                     |

- **One write a second per key.** "Workers KV has a maximum of 1 write to
  the same key per second. Writes made to the same key within 1 second will
  cause rate limiting (`429`) errors to be thrown." ([cf-kv-write])
- **Free limits reset at midnight UTC.** "All limits reset daily at 00:00
  UTC. If you exceed any one of these limits, further operations of that
  type will fail with an error." ([cf-kv-pricing])
- **Every operation counts.** Operations from the dashboard or Wrangler
  "count as billable KV usage", and charges include "fetches for
  non-existent keys" ([cf-kv-pricing]).
- **Bulk reads.** `get()` takes up to 100 keys, and a bulk read counts "as a
  single operation against the 1,000 operation limit" ([cf-kv-read]), but
  "Bulk read operations are billed by the amount of keys read in a bulk
  read operation." ([cf-kv-pricing])
- **Bulk writes.** "The bulk API can accept up to 10,000 KV pairs at once",
  and "Bulk writes are not supported using the KV binding." ([cf-kv-write])

[cf-kv-limits]: https://developers.cloudflare.com/kv/platform/limits/
[cf-kv-pricing]: https://developers.cloudflare.com/kv/platform/pricing/

### Publishing tomorrow's puzzle ahead of time

- **Wrangler 4 writes locally by default.** "All commands now run in
  **local mode by default.**" and `wrangler kv key get` "queries locally
  unless `--remote` is specified" ([cf-wrangler-v4]).
- Synthesis: a date becomes today first in UTC+14, at 10:00 UTC the day
  before (see
  [Choosing today's puzzle for a player's date](#choosing-todays-puzzle-for-a-players-date)).
  With propagation of "up to 60 seconds or more" and cached misses, a
  puzzle written minutes before then may still be missing in some
  locations. Upload each date's puzzle at least a day ahead.
- Synthesis: store one JSON value per puzzle, holding its card, accepted
  names, and checked bank answers, and one schedule value per date. A
  puzzle with 200 checked answers as separate keys would spend 200 of the
  Free plan's 1,000 daily writes; as one value it spends one, far under the
  25 MiB value limit. This is the "coalescing" the KV docs describe
  ([cf-kv-read]).
- Synthesis: treat a published puzzle as immutable. Two locations can serve
  different versions of a key for a minute or more, and the day's cached
  answers were checked against the old card, so a fix goes under a new key
  with the schedule pointed at it. A long `cacheTtl`, such as a day, is then
  safe for puzzle values; the schedule keeps the default 60 seconds.
- Synthesis: the authoring script uploads with
  `wrangler kv bulk put --remote` or the REST bulk API, and never rewrites
  the same key within a second. Each date's answers live in its Durable
  Object, not KV, because two players can ask in the same second.

[cf-wrangler-v4]: https://developers.cloudflare.com/workers/wrangler/migration/update-v3-to-v4/

## Durable Objects for each day's answers

The build plan gives each puzzle day one Durable Object, "so two players
can't get different answers to the same new wording" ([idea-stack]). This
section covers what an object guarantees and what it doesn't.

### Durable Objects on the Free and Paid plans

- **SQLite only on Free.** "Workers Free plan: Only Durable Objects with
  SQLite storage backend are available." ([cf-do-pricing]) Since July 9,
  2026, "New Durable Object namespaces must use the SQLite storage backend"
  on accounts without an older key-value namespace ([cf-do-sqlite-only]).
- **Free since April 2025.** "Durable Objects can now be used with zero
  commitment on the Workers Free plan" ([cf-do-free]).

Prices and included usage ([cf-do-pricing]):

| Item                | Workers Free      | Workers Paid                                       |
| ------------------- | ----------------- | -------------------------------------------------- |
| Requests            | 100,000 a day     | 1 million a month, then $0.15 per million          |
| Duration            | 13,000 GB-s a day | 400,000 GB-s a month, then $12.50 per million GB-s |
| SQLite rows read    | 5 million a day   | 25 billion a month, then $0.001 per million        |
| SQLite rows written | 100,000 a day     | 50 million a month, then $1.00 per million         |
| SQLite stored data  | 5 GB total        | 5 GB-month, then $0.20 per GB-month                |

- **What a request is.** Requests include "HTTP requests, RPC sessions,
  WebSocket messages, and alarm invocations", and "Every RPC method call on
  a Durable Objects stub is its own RPC session and therefore a single
  billed request." ([cf-do-pricing])
- **Duration is wall time at 128 MB.** "Duration billing charges for the
  128 MB of memory your Durable Object is allocated, regardless of actual
  usage", and duration "is shared across all requests active on an Object
  at once" ([cf-do-pricing]).
- **When it's billed.** "A Durable Object incurs duration charges when it
  is actively executing JavaScript — either handling a request or running
  event handlers — or when it is idle but does not meet the conditions for
  hibernation." ([cf-do-pricing])
- **Storage billing.** The page still says SQLite storage billing "will be
  enabled in January 2026, with a target date of January 7, 2026 (no
  earlier)", and key-value methods on a SQLite object "are billed as rows
  read and rows written" ([cf-do-pricing]).
- Synthesis: a Jev call that holds an object for 0.3 seconds bills 0.125 GB
  × 0.3 s, about 0.04 GB-s, so Paid's 400,000 GB-s a month covers about ten
  million such calls. Objects won't be a cost that matters at launch.

[cf-do-free]: https://developers.cloudflare.com/changelog/post/2025-04-07-durable-objects-free-tier/

### The Durable Object storage API

- **What a SQLite object gets.** The SQL API, point-in-time recovery, a
  synchronous key-value API on `ctx.storage.kv`, the asynchronous key-value
  API, and alarms. "Each method is implicitly wrapped inside a transaction,
  such that its results are atomic and isolated from all other storage
  operations" ([cf-do-sqlite]).
- **SQL.** `ctx.storage.sql.exec(query, ...bindings)` returns a cursor.
  "For predictable behavior, fully consume cursors synchronously before the
  next `await`, for example with `.toArray()`" ([cf-do-sqlite]).
- **Implicit transactions.** "Any series of write operations with no
  intervening `await` will automatically be submitted atomically"; and
  `transactionSync(callback)` runs a callback that "must complete
  synchronously" in one transaction ([cf-do-sqlite]).
- **Recovery.** Point-in-time recovery can restore an object's database "to
  any point in the past 30 days" ([cf-do-sqlite]).
- **Limits.** 10 GB per object, key and value together at most 2 MB, 100
  columns per table, statements up to 100 KB, and 100 bound parameters per
  query ([cf-do-limits]).
- **Declaring the class.** "The `exports` field replaces the imperative
  `migrations` array used by older Workers. Both flows are supported, but
  a Worker can only use one at a time." "A class that appears only in your
  code is ignored until you declare it in `exports`" ([cf-do-exports]).

```jsonc
{
  "durable_objects": { "bindings": [{ "name": "DAY", "class_name": "Day" }] },
  "exports": { "Day": { "type": "durable-object", "storage": "sqlite" } }
}
```

- **Local test.** Wrangler 4.136.1 ran a SQLite `Day` class declared with
  the `exports` block above in `wrangler dev`. A deploy wasn't tried.

[cf-do-sqlite]: https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/
[cf-do-exports]: https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/

### Single-threaded execution and input and output gates

- **One thread.** "Durable Objects are single-threaded and cooperatively
  multi-tasked, just like code running in a web browser." ([cf-do-what])
- **Input gate.** "While a storage operation is executing, no events shall
  be delivered to a Durable Object except for storage completion events.
  Any other events will be deferred until such a time as the object is no
  longer executing JavaScript code and is no longer waiting for any storage
  operations." ([cf-do-glossary])
- **Output gate.** "When a storage write operation is in progress, any new
  outgoing network messages will be held back until the write has
  completed." If the write fails, messages "will be discarded and replaced
  with errors, while the Durable Object will be shut down and restarted
  from scratch." ([cf-do-glossary])
- **Outgoing fetches wait for writes.** Cloudflare's post of August 3,
  2021 adds: "Note that output gates apply not only to responses sent back
  to a client, but also to new outgoing requests made with fetch() -- those
  requests will be delayed from being sent until all prior writes are
  confirmed." ([cf-blog-gates])
- **A fetch opens the gate.** "Input gates only protect during storage
  operations. Non-storage I/O like `fetch()` or writing to R2 allows other
  requests to interleave, which can cause race conditions". The suggested
  fix is "optimistic locking (check-and-set) patterns" ([cf-do-rules]).
- **No locks across I/O.** "Using `blockConcurrencyWhile()` across I/O
  operations (such as `fetch()`, KV, R2, or other external API calls) is
  an anti-pattern" that "blocks all other requests while waiting for slow
  external operations" ([cf-do-rules]).
- **Throughput.** "An individual Object has a soft limit of 1,000 requests
  per second." ([cf-do-limits]) The best-practice guide puts it at
  "approximately **500-1,000 requests per second** for simple operations"
  and about 200 to 500 for work with storage writes ([cf-do-rules]).
- **Overload.** An overloaded object fails with errors such as "Durable
  Object is overloaded. Too many requests queued." ([cf-do-troubleshooting]),
  and errors with `.overloaded` set "should not be retried"
  ([cf-do-errors]).

[cf-do-troubleshooting]: https://developers.cloudflare.com/durable-objects/observability/troubleshooting/

### Names, creation, and location hints

- **Named objects.** `idFromName(name)` "creates a unique
  `DurableObjectId`", and `getByName(name, options)` returns a stub
  directly, with an optional `locationHint` ([cf-do-namespace]).
- **Created on first use.** "Note that creating an ID for a Durable Object
  does not create the Durable Object. The Durable Object is created lazily"
  ([cf-do-namespace]).
- **The first call to a name is slower.** The system must check that the
  named object "has not been created anywhere else", and "this
  round-the-world check can take up to a few hundred milliseconds. ...
  After this first use, the location of the Durable Object will be cached
  around the world so that subsequent lookups are faster."
  ([cf-do-namespace])
- **Where it lives.** "By default, a Durable Object is instantiated in a
  data center close to where the initial `get()` request is made." and
  "Durable Objects do not currently change locations after they are
  created" ([cf-do-location]).
- **Location hints.** The hints are `wnam` (Western North America),
  `enam`, `sam`, `weur`, `eeur`, `apac`, `apac-ne`, `apac-se`, `oc`, `afr`,
  and `me`. "Only the first call to `get()` for a particular Object will
  respect the hint." "Hints are a best effort and not a guarantee."
  ([cf-do-location])
- **Pre-creating.** "It can negatively impact latency to pre-create Durable
  Objects prior to the first client request or when the first client
  request is not representative of where the majority of requests will
  come from. It is better for latency to create Durable Objects in response
  to actual production traffic or provide explicit location hints."
  ([cf-do-location])
- **The name inside the object.** Since March 15, 2026, an object reached
  by `idFromName()` or `getByName()` can read that name on `ctx.id.name`,
  including in alarm handlers ([cf-do-id-name]).

[cf-do-id-name]: https://developers.cloudflare.com/changelog/post/2026-03-15-durable-object-id-name/

### Alarms, lifecycle, and Durable Object limits

- **Alarms.** "Each Durable Object is able to schedule a single alarm at a
  time"; "Alarms have guaranteed at-least-once execution and are retried
  automatically when the `alarm()` handler throws"; "Retries are performed
  using exponential backoff starting at a 2 second delay from the first
  failure with up to 6 retries allowed." ([cf-do-alarms]) Each `setAlarm()`
  "is billed as a single row written" ([cf-do-pricing]), and an alarm
  handler may run for 15 minutes ([cf-limits]).
- **Hibernation.** An idle object that qualifies hibernates "after 10
  seconds of inactivity". It can't while an awaited `fetch()` is in
  progress, "since it is considered to be waiting for I/O", and "When
  hibernated, the in-memory state is discarded". An idle object that can't
  hibernate is evicted "after 70-140 seconds of inactivity"
  ([cf-do-lifecycle]).
- **Restarts mid-request.** On shutdown, "In-flight requests are allowed to
  finish if they do not access a Durable Object's storage. If a request
  attempts to access a Durable Object's storage, it will be stopped
  immediately and return an error". During runtime updates, "in-flight
  requests have up to 30 seconds to complete." ([cf-do-lifecycle])
- **Errors.** "Many exceptions leave the `DurableObjectStub` in a 'broken'
  state", so create a new stub after one. Errors with `.retryable` "are
  suggested to be retried if requests to the Durable Object are
  idempotent", with exponential backoff ([cf-do-errors]).
- **Limits.** Objects per namespace are unlimited; classes are capped at
  100 on Free and 500 on Paid; Free accounts have 5 GB of object storage
  in total; CPU per request is "30 seconds (default) / configurable to 5
  minutes" ([cf-do-limits]).

### Concurrent first answers to a new wording

Would one object per puzzle day serialize concurrent first answers to the
same new question? Only if nothing but storage calls sit between checking
the cache and writing the answer. A Jev call in between is a `fetch`, which
opens the input gate ([cf-do-rules]):

- **What happens during the fetch.** Other requests run while the object
  waits on Jev. A second player's request for the same wording finds no
  cached answer and starts its own Jev call. Jev can answer the same input
  differently from run to run ([jev-flips]), so the two players can get
  different answers.
- **When the fetch returns.** Its completion waits until the object isn't
  running JavaScript or waiting on storage (the input gate), and a new
  outgoing fetch waits for earlier writes (the output gate)
  ([cf-blog-gates]).
- **While it's in flight.** The object can't hibernate and bills duration,
  and if it restarts, the request fails when it next touches storage
  ([cf-do-lifecycle]).
- **Local test.** A `Day` object checked SQLite, then called a stand-in
  that took 500 ms and answered "yes" and "no" in turn, then ran
  `INSERT OR IGNORE`. Two simultaneous first requests for one wording made
  two model calls: the players got "yes" and "no", while storage kept
  "yes". Sharing the in-flight call made one model call, and both players
  got "yes".
- **Only an object can share the call.** A stateless Worker can't: "I/O
  objects (such as streams, request/response bodies, and others) created
  in the context of one request handler cannot be accessed from a
  different request's handler." ([cf-errors]) In the local test, the
  object's second request awaited the first request's promise without that
  error.

A sketch of the shared-call pattern the local test used, in TypeScript,
with `askJev` standing for the Jev call:

```ts
import { DurableObject } from 'cloudflare:workers'

export class Day extends DurableObject<Env> {
  private inflight = new Map<string, Promise<string>>()

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    ctx.storage.sql.exec('CREATE TABLE IF NOT EXISTS answers (wording TEXT PRIMARY KEY, answer TEXT NOT NULL)')
  }

  private stored(wording: string): string | undefined {
    const rows = this.ctx.storage.sql.exec('SELECT answer FROM answers WHERE wording = ?', wording).toArray()
    return rows[0]?.answer as string | undefined
  }

  async answer(wording: string): Promise<string> {
    const hit = this.stored(wording)
    if (hit !== undefined) return hit
    let pending = this.inflight.get(wording)
    if (pending === undefined) {
      pending = askJev(this.env, wording)
        .then((answer) => {
          this.ctx.storage.sql.exec('INSERT OR IGNORE INTO answers (wording, answer) VALUES (?, ?)', wording, answer)
          return this.stored(wording) ?? answer
        })
        .finally(() => this.inflight.delete(wording))
      this.inflight.set(wording, pending)
    }
    return pending
  }
}
```

- Synthesis: the map lookup and set run with no `await` between them, as
  do the insert and the read-back, so on one thread nothing can slip in
  between, and every caller returns what storage holds. The map is lost on
  eviction, which is safe, since answered wordings are in storage. A failed
  Jev call rejects every waiting caller, which the app shows as busy.
- Synthesis: `INSERT OR IGNORE` plus returning the stored row alone makes
  answers agree; the shared call also saves the duplicate Jev spend.

[jev-flips]: /docs/research/jev.md#known-limitations-on-the-jaggedness-page
[cf-errors]: https://developers.cloudflare.com/workers/observability/errors/

## Limiting requests per device

The build plan limits requests per device, since every call spends Jev
credits ([idea-stack]). Cloudflare offers a binding for rate limits;
exact counts need storage.

### The Rate Limiting binding

A binding that allows each key 10 calls every 10 seconds:

```jsonc
{
  "ratelimits": [
    {
      "name": "QUESTION_LIMITER",
      "namespace_id": "1001",
      "simple": { "limit": 10, "period": 10 }
    }
  ]
}
```

- **Settings.** `namespace_id` is "A string containing a positive integer
  that uniquely defines this rate limiting namespace within your Cloudflare
  account"; "`simple` is the only supported type"; and `simple.period` is
  "The duration of the rate limit window, in seconds. Must be either `10`
  or `60`." ([cf-ratelimit])
- **Keys.** `await env.QUESTION_LIMITER.limit({ key })` returns
  `{ success }`, and "The key you provide can be any `string` value."
  Bindings that share a `namespace_id`, "even across different Workers on
  the same account", share counters ([cf-ratelimit]).
- **Not IP addresses.** "It is not recommended to use IP addresses or
  locations (regions or countries), since these can be shared by many
  users"; the example comments add "many users may share a single IP,
  especially on mobile networks" ([cf-ratelimit]).
- **Per location.** "Rate limits that you define and enforce in your Worker
  are local to the Cloudflare location that your Worker runs in." "For each
  unique key you pass to your rate limiting binding, there is a unique limit
  per Cloudflare location." ([cf-ratelimit])
- **Fast but loose.** The call is "not waiting on a network request", and
  "the Rate Limiting API is permissive, eventually consistent, and
  intentionally designed to not be used as an accurate accounting system."
  ([cf-ratelimit])
- **Visibility.** "Rate limiting bindings are not currently visible in the
  Cloudflare dashboard." ([cf-ratelimit])
- **Status.** "Rate Limiting within Cloudflare Workers is now Generally
  Available (GA)", as of September 19, 2025, and "recommended for all
  production workloads" ([cf-ratelimit-ga]). It needs Wrangler 4.36.0 or
  later ([cf-ratelimit]).

### Counting in a Durable Object

- **Exact counts.** A Durable Object's storage is "transactional and
  strongly consistent (serializable)" ([cf-do-glossary]), so a counter row
  per device is exact.
- **Not one global counter.** "A common mistake is using a Durable Object
  for global rate limiting or global counters. This funnels all traffic
  through a single instance" ([cf-do-rules]).
- **Cost.** Each count is a row written: 100,000 a day free, 50 million a
  month on Paid ([cf-do-pricing]).
- Synthesis: use both. The binding checks bursts in the Worker, keyed by
  the device's RevenueCat anonymous ID, before any KV or Jev work. The
  day's object, which already sees every question for its date, keeps
  exact counts per device, such as live Jev calls a day, and a day-wide
  Jev budget as a circuit breaker. The app sends the device key, and a
  client that rotates it escapes both per-device limits, so the day-wide
  budget is the backstop. Launch traffic stays far under one object's
  [throughput guidance](#single-threaded-execution-and-input-and-output-gates).

## Secrets, configuration, and Wrangler

### Secrets, Secrets Store, and vars

- **Secrets.** "Secrets are a type of binding that allow you to attach
  encrypted text values to your Worker." Code reads them on `env`, from
  `import { env } from "cloudflare:workers"`, or on `process.env` with
  Node.js compatibility ([cf-secrets]).
- **Setting one.** `wrangler secret put <KEY>` prompts for the value, "can
  also receive piped input", and "creates a new version of the Worker and
  deploys it immediately" ([cf-secret-put]).
- **Locally.** Put secrets "in either a `.dev.vars` file or a `.env` file",
  not both, and keep them out of git ([cf-secrets]).
- **Not in vars.** "Do not use `vars` to store sensitive information in
  your Worker's Wrangler configuration file. Use secrets instead."
  ([cf-secrets]) Vars are "not encrypted and are useful for storing
  application configuration" ([cf-env-vars]).
- **Required secrets.** Since March 25, 2026, a `secrets.required` list is
  "validated during local development and deploy", and a deploy fails if
  one is missing ([cf-secrets-config]).
- **Secrets Store.** Account-level secrets, "Available in open beta"
  ([cf-secrets-store]). A Worker reads one with
  `await env.<BINDING_VARIABLE>.get()`, and "You cannot access production
  secrets ... from your local development setup" ([cf-secrets-store-workers]).
  The limit was raised to "100 secrets per account" in May 2025
  ([cf-secrets-store-limit]).
- Synthesis: one Worker holds one key, so a per-Worker secret named
  `TYPESAFE_API_KEY`, listed in `secrets.required`, is enough. Secrets
  Store adds a beta dependency and an async read for no gain here.

[cf-secrets]: https://developers.cloudflare.com/workers/configuration/secrets/
[cf-secret-put]: https://developers.cloudflare.com/workers/wrangler/commands/workers/#secret-put
[cf-env-vars]: https://developers.cloudflare.com/workers/configuration/environment-variables/
[cf-secrets-config]: https://developers.cloudflare.com/changelog/post/2026-03-24-secrets-config-property/
[cf-secrets-store]: https://developers.cloudflare.com/secrets-store/
[cf-secrets-store-workers]: https://developers.cloudflare.com/secrets-store/integrations/workers/
[cf-secrets-store-limit]: https://developers.cloudflare.com/changelog/post/2025-05-19-paygo-updates/

### Config files and compatibility dates

- **wrangler.jsonc.** "Cloudflare recommends using `wrangler.jsonc` for new
  projects, and some newer Wrangler features will only be available to
  projects using a JSON config file." JSON configs work from Wrangler
  3.91.0 ([cf-wrangler-config]).
- **Compatibility dates.** "When you start your project, you should always
  set `compatibility_date` to the current date." "The Workers runtime will
  support old compatibility dates forever." ([cf-compat-dates])
- **Local test.** At 22:14 UTC on September 21, 2026, Wrangler 4.136.1
  refused `"compatibility_date": "2026-09-22"` with
  `Compatibility date "2026-09-22" is in the future and unsupported`, and
  accepted `2026-09-21`. Its bundled workerd reported `workerd 2026-09-21`.
- **Wrangler.** Version 4.136.1 was published September 21, 2026, and its
  package requires Node.js 22 or newer (`"node": ">=22.0.0"`)
  ([npm-wrangler]). The docs support "Current, Active, and Maintenance"
  Node.js versions and install Wrangler per project
  ([cf-wrangler-install]).

[cf-wrangler-config]: https://developers.cloudflare.com/workers/wrangler/configuration/
[cf-compat-dates]: https://developers.cloudflare.com/workers/configuration/compatibility-dates/
[cf-wrangler-install]: https://developers.cloudflare.com/workers/wrangler/install-and-update/

### Node.js compatibility by default

- **The new default.** "Workers now enable the `nodejs_compat` and
  `nodejs_compat_v2` compatibility flags by default for compatibility dates
  of `2026-08-04` or later." ([cf-nodejs-default]) To turn it off, add both
  `no_nodejs_compat` and `no_nodejs_compat_v2` ([cf-compat-flags]).
- **`process.env`.** With `nodejs_compat_populate_process_env`, on by
  default from 2025-04-01, and Node.js compatibility on, "`process.env`
  will be populated with values from any bindings with text or JSON
  values" ([cf-compat-flags]). Without Node.js compatibility, "there is no
  process-level environment, so by default `env` is an empty object"
  ([cf-process]).
- **Local test.** With `compatibility_date` 2026-09-21 and no flags,
  `typeof process` was `"object"` and `process.env.TYPESAFE_API_KEY` held
  the value from `.dev.vars`. With 2026-08-03, or with the two `no_` flags,
  `process` was undefined.
- Synthesis: new projects get Node.js compatibility whether they ask or
  not, and the Jev SDK reads four `TYPESAFE_*` variables from
  `process.env` (next section). Pass every SDK option in code so a stray
  var can't change the model, base URL, or log level.

[cf-compat-flags]: https://developers.cloudflare.com/workers/configuration/compatibility-flags/
[cf-process]: https://developers.cloudflare.com/workers/runtime-apis/nodejs/process/

## Jev's JavaScript SDK in a Worker

Jev's methods, options, retries, and errors are in the Jev notes
([jev-js]; [jev-install]); this section covers only what changes in a
Worker.

[jev-js]: /docs/research/jev.md#javascript-sdk-methods
[jev-install]: /docs/research/jev.md#installing-an-sdk-and-authenticating

### What the SDK's published code uses

From the published tarball ([sdk-tgz]), whose SHA-1 matches the registry's
`shasum`, `dbba30689e77c317e7619fbee006caa18f37a76a` ([npm-sdk]); line
numbers are in `package/dist/index.mjs`:

- **Package.** Nine files: the ESM and CommonJS builds, their type
  declarations and source maps, a README, a license, and `package.json`,
  which declares no dependencies, `"type": "module"`,
  `"sideEffects": false`, and `"engines": { "node": ">=20" }`.
- **No Node.js modules.** `dist/index.mjs` has no `import` or `require`
  statements, no `node:` specifiers, and no `Buffer` or `crypto` use. Its
  exports are one `export { ... }` statement (line 692).
- **Globals it uses.** `globalThis.fetch` (line 401), `AbortController`
  (629), `setTimeout` and `clearTimeout` (128, 634), `Headers`,
  `response.clone().body.getReader()` (460), `signal.throwIfAborted()`,
  `Date.now()`, `Math.random()`, and `console` (259–264).
- **`process.env` is optional.** `readEnv` starts with
  `if (typeof process === "undefined" || !process.env) return void 0;`
  (line 66), for `TYPESAFE_API_KEY`, `TYPESAFE_BASE_URL`,
  `TYPESAFE_DEFAULT_MODEL`, and `TYPESAFE_LOG_LEVEL` (54–63).
- **The key can come from config.** The constructor sets
  `this.#apiKey = fromCodeOrEnv(config.apiKey, ENV.apiKey) ?? missingApiKey();`
  (line 512), so `apiKey` in the config wins, and the key sits in a private
  field.
- **`fetch` can be injected.** The config type has `fetch?: Fetch`, "Custom
  HTTP fetch implementation for transport configuration or tests. Default:
  global `fetch`." (`dist/index.d.mts`, line 226), and the constructor uses
  `config.fetch ?? defaultFetch` (line 521).
- **No `AbortSignal.timeout`.** Each attempt's timeout is its own
  `setTimeout` on an `AbortController` (629–637); a caller's `signal`
  cancels both the attempt and any backoff sleep.
- **Workers detection.** `g.navigator?.userAgent === "Cloudflare-Workers"`
  sets the `X-TypeSafe-Runtime` header to `cloudflare-workers` (lines 383,
  585).
- **Quiet by default.** The default log level is `"warn"` (line 250), and
  the build never calls `logger.warn` or `logger.error`, so it logs nothing
  by default. At `debug` it logs request bodies (line 596), which here
  would include the fact card and its secret.
- **Tested in Node, not workerd.** The SDK's own test checks Workers
  detection by stubbing `navigator` with
  `vi.stubGlobal("navigator", { userAgent: "Cloudflare-Workers" })`
  ([gh-sdk-runtime-test]).

[sdk-tgz]: https://registry.npmjs.org/@typesafe-ai/sdk/-/sdk-0.6.0.tgz
[gh-sdk-runtime-test]: https://github.com/typesafe-ai/typesafe-sdk-js/blob/v0.6.0/test/runtime.test.ts

### The SDK under workerd

The local test ran `wrangler dev` (Wrangler 4.136.1, workerd 1.20260921.1)
against a local stand-in for `api.typesafe.ai`, with the key in `.dev.vars`:

| Configuration                                                | `typeof process` | `new TypeSafeClient()` with no options  |
| ------------------------------------------------------------ | ---------------- | --------------------------------------- |
| `compatibility_date` 2026-09-21, no flags                    | `"object"`       | Worked, with the key from `process.env` |
| 2026-09-21 with `no_nodejs_compat` and `no_nodejs_compat_v2` | `"undefined"`    | Threw "No API key was provided. ..."    |
| 2026-08-03, no flags                                         | `"undefined"`    | Threw the same                          |

- **It works either way.** With `apiKey: env.TYPESAFE_API_KEY` passed,
  `systemOne` succeeded in all three configurations, and the stand-in saw
  `X-TypeSafe-Runtime: cloudflare-workers` and
  `User-Agent: typesafe-sdk/0.6.0`.
- **Timeouts are per attempt.** With `timeout: 1000`, `maxRetries: 1`, and
  a 100 ms backoff against a 3-second endpoint, `APITimeoutError` came
  after 2,108 ms.
- **Busy responses retry.** A 529 with `retry-after-ms: 50` was retried
  once and succeeded.
- **Cancellation works.** A call given `signal: AbortSignal.timeout(700)`
  threw `APIUserAbortError` after 704 ms, with a `TimeoutError` cause, and
  the next request was served normally.
- **Bad keys.** A key with a newline in it failed with
  `APIConnectionError` "Connection error: Invalid header value." without
  the key in the message, unlike Node's message in the issue
  ([gh-sdk-issue-14]), but it was still retried. An empty key went out as
  `Bearer` and came back as `PermissionDeniedError`.
- **Size.** `wrangler deploy --dry-run` reported "Total Upload: 30.24 KiB /
  gzip: 8.62 KiB" for the test Worker with the SDK bundled.
- Synthesis: with the defaults, a call can take three 10-second attempts
  plus backoff, about 31.5 seconds. It can take far longer when the server
  sends `Retry-After`, which the SDK honors up to 60 seconds per retry, and
  an open issue reports that a blank `Retry-After` retries at once
  ([gh-sdk-issue-9]). Set every option in code, and bound calls a player
  waits on:

```ts
const client = new TypeSafeClient({
  apiKey: env.TYPESAFE_API_KEY,
  defaultModel: 'jev-1.13.0',
  logLevel: 'off',
  timeout: 1500,
  retry: { maxRetries: 1 }
})

const result = await client.systemOne(request, { signal: AbortSignal.timeout(3000) })
```

- Synthesis: keep Node.js compatibility at its default. The SDK needs
  nothing from it and works either way, and turning it off takes two
  flags; what matters is passing the options in code.
- Synthesis: check at startup that the key is non-empty and has no control
  characters, and map SDK errors to the app's own codes, never their
  messages ([jev-issues]). The direct-HTTP fallback in the build plan isn't
  needed for runtime reasons, though a deploy to Cloudflare wasn't tried
  here.

[gh-sdk-issue-14]: https://github.com/typesafe-ai/typesafe-sdk-js/issues/14
[gh-sdk-issue-9]: https://github.com/typesafe-ai/typesafe-sdk-js/issues/9
[jev-issues]: /docs/research/jev.md#open-issues-on-typesafes-repositories

### Calling the System One API with fetch

The request, response, and error shapes are in the Jev notes ([jev-http]).

- **`AbortSignal.timeout`.** Available in Workers since December 10, 2021:
  "`AbortSignal.timeout(delay)` returns an `AbortSignal` that will be
  triggered after the given number of milliseconds."
  ([cf-historical-changelog]) The web standards page lists `AbortController`
  and `AbortSignal` ([cf-web-standards]).
- **Local test.** `fetch(url, { signal: AbortSignal.timeout(500) })`
  against a 3-second endpoint threw `TimeoutError` "The operation was
  aborted due to timeout" after 503 ms.
- **Unread bodies.** "If you use `fetch()` but do not need the response
  body, calling `response.body.cancel()` is still good practice to free
  memory" ([cf-limits]).
- **Jev's concurrency.** TypeSafe's entity-alignment cookbook caps its own
  pool with the comment "small pool; the public endpoint rate-limits above
  roughly eight" ([ts-entity]); the documented limits are in the Jev notes
  ([jev-limits]).

A direct call with one retry for busy responses, as a sketch:

```ts
async function callSystemOne(env: Env, body: unknown, retried = false): Promise<unknown> {
  const res = await fetch('https://api.typesafe.ai/v1/systemone', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.TYPESAFE_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(1500)
  })
  if ((res.status === 429 || res.status === 529) && !retried) {
    await res.body?.cancel()
    await new Promise((resolve) => setTimeout(resolve, 250))
    return callSystemOne(env, body, true)
  }
  if (!res.ok) throw new Error(`systemone ${res.status}`)
  return res.json()
}
```

[jev-http]: /docs/research/jev.md#the-system-one-http-api
[cf-historical-changelog]: https://developers.cloudflare.com/workers/platform/changelog/historical-changelog/
[ts-entity]: https://docs.typesafe.ai/cookbooks/entity_alignment

## Time, dates, and Cron Triggers

### Cron Triggers

- **UTC.** "Cron Triggers execute on UTC time." ([cf-cron])
- **Syntax.** Five fields with "most Quartz scheduler-like cron syntax
  extensions" such as `L`, `W`, and `#`. "Days of the week go from 1 =
  Sunday to 7 = Saturday", so the page suggests three-letter names such as
  `SUN` ([cf-cron]).
- **Configuration.** `"triggers": { "crons": ["0 9 * * *"] }`, and changes
  "may take several minutes (up to 15 minutes) to propagate" ([cf-cron]).
- **Limits.** 5 Cron Triggers per account on Free and 250 on Paid; CPU of
  10 ms on Free, and on Paid 30 seconds for intervals under an hour or 15
  minutes for an hour or more; 15 minutes of wall time ([cf-limits]).
- **Testing.**
  `curl "http://localhost:8787/cdn-cgi/local/scheduled?cron=*+*+*+*+*"`
  runs the handler locally, and a `time` parameter overrides
  `controller.scheduledTime` ([cf-cron]), which is "milliseconds since
  January 1, 1970, UTC" ([cf-scheduled]).
- **History.** "Cron Events stores the 100 most recent invocations"
  ([cf-cron]).
- Synthesis: one cron at 09:00 UTC, an hour before the next date goes live
  in UTC+14, can check that the next two dates have puzzles in KV and log
  an error if not. It can also make the first call to the next date's
  object with `locationHint: "wnam"`, so no player pays for creating it.

[cf-scheduled]: https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/

### The Workers clock

- **Frozen during execution.** "`Date.now()` returns the time of the last
  I/O; it does not advance during code execution." ([cf-web-standards])
- **Why.** "When Workers are deployed to Cloudflare, as a security measure
  to mitigate against Spectre attacks, APIs that return timers, including
  `performance.now()` and `Date.now()`, only advance or increment after I/O
  occurs." Locally it differs: "In local development, however, timers will
  increment regardless of whether I/O happens or not." ([cf-performance])
- **Measuring I/O still works.** "By wrapping a subrequest in calls to
  `performance.now()` or `Date.now()` APIs, you can measure the timing of a
  subrequest" ([cf-performance]), so Jev's latency can be logged.
- **Time zones.** `request.cf.timezone` is the "Timezone of the incoming
  request", for example `"America/Chicago"` ([cf-request]), and `Intl` is
  supported ([cf-web-standards]).
- **Local test.** `Intl.DateTimeFormat` with `timeZone: 'Asia/Seoul'`
  formatted 16:00 UTC on September 22, 2026 as 2026-09-23.

[cf-performance]: https://developers.cloudflare.com/workers/runtime-apis/performance/

### Choosing today's puzzle for a player's date

- Synthesis: civil time zones run from UTC-12 to UTC+14, so a date is today
  somewhere from 10:00 UTC the day before until 12:00 UTC the day after,
  about 50 hours. Between 10:00 and 12:00 UTC, three dates are live.
- Synthesis: the app sends the device's local date, and the Worker accepts
  it only if it falls between the UTC dates 12 hours before and 14 hours
  after now. In a request handler, the clock reads the request's arrival
  or the latest KV read or fetch, close enough for choosing a date.
  `request.cf.timezone` comes from the IP address, which VPNs and travel
  make wrong, so it's a sanity check at best.
- Synthesis: each day's object is named by its puzzle date, as in
  `getByName("2026-09-23")`, so objects for two or three dates are active at
  once.

```ts
function isPlayableDate(localDate: string, now = Date.now()): boolean {
  const earliest = new Date(now - 12 * 3_600_000).toISOString().slice(0, 10)
  const latest = new Date(now + 14 * 3_600_000).toISOString().slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(localDate) && localDate >= earliest && localDate <= latest
}
```

## Logs and counts

The pitch reports players, puzzles solved, and questions asked
([idea-launch]); the Worker can count these without an analytics SDK in the
app.

[idea-launch]: /docs/archive/guessling-idea.md#launch-and-pitch

### Workers Logs

- **Turning it on.** `"observability": { "enabled": true }`, with an
  optional `head_sampling_rate` from 0 to 1; "Minimum required Wrangler
  version: 3.78.6" ([cf-workers-logs]).
- **JSON logs.** "To get the most out of Workers Logs, it is recommended you
  log in JSON format. Workers Logs automatically extracts the fields and
  indexes them intelligently in the database." `console.log({user_id: 123})`
  becomes `{user_id: 123}` ([cf-workers-logs]).
- **Invocation logs.** Each invocation also writes one log with the request
  and response, which `"invocation_logs": false` turns off
  ([cf-workers-logs]).

| Plan         | Log events written                                    | Retention |
| ------------ | ----------------------------------------------------- | --------- |
| Workers Free | 200,000 per day                                       | 3 days    |
| Workers Paid | 20 million included per month, then $0.60 per million | 7 days    |

- **Limits.** 5 billion logs per account per day, after which "a 1%
  head-based sample will be applied for the remainder of the day", and 256
  KB per log, beyond which logs are truncated ([cf-workers-logs]). The
  per-request cap is also 256 KB ([cf-limits]).
- Synthesis: log one JSON event per question with its path (bank, match,
  live, or code), Jev's latency, and the outcome. Leave out the typed text
  and device IDs unless the privacy policy covers them, since logs keep
  whatever `console.log` receives for 3 or 7 days.

### Tail Workers

- **Paid only.** "Tail Workers are available to all customers on the
  Workers Paid and Enterprise tiers. Tail Workers are billed by CPU time,
  not by the number of requests." ([cf-tail-workers])
- **What they do.** "A Tail Worker is automatically invoked after the
  invocation of a producer Worker", and Cloudflare calls them "the
  advanced-mode option, for when you need to do something custom that is
  not built into the Workers observability platform." ([cf-tail-workers])
- Synthesis: Guessling doesn't need one; Workers Logs and Analytics Engine
  cover its needs.

[cf-tail-workers]: https://developers.cloudflare.com/workers/observability/logs/tail-workers/

### Workers Analytics Engine

```jsonc
{
  "analytics_engine_datasets": [{ "binding": "EVENTS", "dataset": "guessling_events" }]
}
```

- **Writing.** `env.EVENTS.writeDataPoint({ blobs, doubles, indexes })`;
  "You do not need to await `writeDataPoint()`", datasets are created on
  the first write, and "you currently must only provide a single index"
  ([cf-ae-get-started]).
- **Limits.** "up to twenty blobs, twenty doubles, and one index per call";
  blobs up to 16 KB in total per data point; an index of at most 96 bytes;
  "a maximum of 250 data points per Worker invocation"; and "Data written to
  Workers Analytics Engine is stored for three months." ([cf-ae-limits])
- **Prices.** Paid includes 10 million data points a month, then $0.25 per
  million, and 1 million read queries, then $1.00 per million; Free
  includes 100,000 data points and 10,000 read queries a day. "Currently,
  you will not be billed for your use of Workers Analytics Engine."
  ([cf-ae-pricing])
- **Reading.** The SQL API is at
  `/client/v4/accounts/<account_id>/analytics_engine/sql` on
  `api.cloudflare.com`, with a token granted
  "Account | Account Analytics | Read" ([cf-ae-sql]).
- **Sampling.** At high volume the data is sampled, so counts use
  `SUM(_sample_interval)` rather than `COUNT()` ([cf-ae-sql]).
  `count(DISTINCT column_name)` is supported ([cf-ae-agg]).

A query for a day's events and devices, assuming the event name in `blob1`
and a hashed device ID as the index:

```sql
SELECT blob1 AS event, SUM(_sample_interval) AS events, count(DISTINCT index1) AS devices
FROM guessling_events
WHERE timestamp > NOW() - INTERVAL '1' DAY
GROUP BY event
```

- Synthesis: write one data point for each game started, question
  answered, and puzzle solved. Distinct devices are exact only while no
  sampling happens, which is likely at launch volumes but not promised.

[cf-ae-get-started]: https://developers.cloudflare.com/analytics/analytics-engine/get-started/
[cf-ae-limits]: https://developers.cloudflare.com/analytics/analytics-engine/limits/
[cf-ae-sql]: https://developers.cloudflare.com/analytics/analytics-engine/sql-api/
[cf-ae-agg]: https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/aggregate-functions/

## Hosting the privacy policy and terms

- **Static assets in the Worker.** `"assets": { "directory": "./public" }`
  uploads a folder with the Worker. "Requests to static assets are free and
  unlimited", and "There is no additional cost for storing Assets."
  ([cf-static-billing])
- **Assets come first.** "Cloudflare will first attempt to serve static
  assets if one matches the incoming request." When none does, "Cloudflare
  will invoke your Worker script." ([cf-static-routing])
- **Clean URLs.** By default, `privacy.html` is served at `/privacy`, and
  `/privacy.html` redirects there ([cf-static-html]).
- **Limits.** 20,000 files per Worker version on Free and 100,000 on Paid,
  with 25 MiB per file ([cf-limits]).
- **A Free-plan catch.** With `run_worker_first`, matching requests always
  run the Worker, and "If you exceed your free tier request limits, these
  requests will receive a 429 (Too Many Requests) response instead of
  falling back to static asset serving." ([cf-static-billing])
- **Pages.** The Free plan allows one build at a time, 500 builds a month,
  100 projects, 20,000 files, and 25 MiB per file ([cf-pages-limits]).
  Cloudflare's migration guide adds: "Unlike Pages, Workers has a
  distinctly broader set of features available to it, (including Durable
  Objects, Cron Triggers, and more comprehensive Observability)."
  ([cf-pages-migrate])
- Synthesis: put `privacy.html` and `terms.html` in the API Worker's
  assets folder, served at `/privacy` and `/terms` on the same custom
  domain. They deploy with the Worker and change without an app update, as
  the plan requires ([idea-jev]).

[cf-static-billing]: https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
[cf-static-routing]: https://developers.cloudflare.com/workers/static-assets/routing/worker-script/
[cf-static-html]: https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/
[cf-pages-limits]: https://developers.cloudflare.com/pages/platform/limits/
[cf-pages-migrate]: https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/
[idea-jev]: /docs/archive/guessling-idea.md#how-jev-fits

## Local development and tests

- **Local by default.** `wrangler dev` runs the Worker with Miniflare on
  workerd, and "All resources your Worker is bound to in your Wrangler
  configuration are simulated locally." ([cf-local-dev])
- **Miniflare 5.** Miniflare "powers local Workers development behind
  `wrangler dev`, the Cloudflare Vite plugin, and
  `@cloudflare/vitest-plugin`", and "Most projects should use those tools
  instead of depending on Miniflare directly" (September 8, 2026)
  ([cf-miniflare-v5]). npm's `latest` tag for Miniflare is
  `5.20260921.0-alpha`, and the last 4.x release was `4.20260730.0` on
  July 30, 2026 ([npm-miniflare]); Wrangler 4.136.1 depends on the 5.x
  alpha ([npm-wrangler]).
- **The Vitest package was renamed.** "Version 1 of the Workers Vitest
  integration is published as `@cloudflare/vitest-plugin`. The package was
  formerly named `@cloudflare/vitest-pool-workers`." "The Vitest
  configuration API is unchanged." A codemod does the rename:
  `npx @cloudflare/codemods vitest:pool-workers-to-vitest-plugin`
  (August 19, 2026) ([cf-vitest-rename]).
- **Versions.** `@cloudflare/vitest-plugin` 1.2.1 came out September 21,
  2026, with a peer dependency of `vitest` `^4.1.0` ([npm-vitest-plugin]);
  the old package stopped at 0.22.0 on August 18, 2026 ([npm-vitest-pool]).
  "The `@cloudflare/vitest-plugin` package requires Vitest 4.1 or later",
  and the docs install `vitest@^4.1.0` ([cf-vitest-first]), while npm's
  `latest` Vitest is 5.0.1 and its `V4` tag is 4.1.11 ([npm-vitest]).
- **Setup.** `cloudflareTest({ wrangler: { configPath: "./wrangler.jsonc" } })`
  in `vitest.config.ts` ([cf-vitest-first]).
- **Durable Object helpers.** `cloudflare:test` exports
  `runInDurableObject`, `runDurableObjectAlarm`, `evictDurableObject`, and
  `listDurableObjectIds`, and `exports.default.fetch()` from
  `cloudflare:workers` runs integration tests ([cf-vitest-apis]).
- **Isolation.** "Storage isolation is per test file", and
  `--max-workers=1 --no-isolate` shares storage. The plugin "automatically
  injects" `nodejs_compat` and related flags unless the config has one
  ([cf-vitest-isolation]).
- **Known issues.** "Vitest's fake timers do not apply to KV, R2 and cache
  simulators" ([cf-vitest-issues]).
- **Mocking Jev.** Outbound requests are mocked with `@msw/cloudflare` and
  `msw@^2.14.0` ([cf-vitest-mocks]); `@msw/cloudflare` is at 0.0.1, from
  June 30, 2026 ([npm-msw-cf]).
- **Local test.** npm 11.19.1 warned that the `workerd` and `esbuild`
  install scripts were "not yet covered by allowScripts", but the macOS
  `workerd` binary came from its platform package, and `wrangler dev`
  started normally.
- Synthesis: the authoring script's KV uploads need `--remote`, per
  [Publishing tomorrow's puzzle ahead of time](#publishing-tomorrows-puzzle-ahead-of-time),
  or they only fill the local store.

[cf-local-dev]: https://developers.cloudflare.com/workers/local-development/
[cf-miniflare-v5]: https://developers.cloudflare.com/changelog/post/2026-09-08-miniflare-v5/
[cf-vitest-rename]: https://developers.cloudflare.com/changelog/post/2026-08-19-vitest-plugin/
[cf-vitest-first]: https://developers.cloudflare.com/workers/testing/vitest-integration/write-your-first-test/
[cf-vitest-apis]: https://developers.cloudflare.com/workers/testing/vitest-integration/test-apis/
[cf-vitest-issues]: https://developers.cloudflare.com/workers/testing/vitest-integration/known-issues/
[cf-vitest-mocks]: https://developers.cloudflare.com/workers/testing/vitest-integration/mock-outbound-requests/

## Latency and placement

- **Default.** "By default, Workers and Pages Functions run in a data
  center closest to where the request was received." ([cf-placement])
- **Placement options.** Smart Placement (`"mode": "smart"`), a cloud
  region (`"region": "aws:us-east-1"` style, "using the format
  `{provider}:{region}`"), or a probed `host` or `hostname`; "Host-based
  placement is experimental." A region hint makes Cloudflare map "your
  specified cloud region to the data center with the lowest latency to
  that region." ([cf-placement])
- **Smart Placement's scope.** It "only affects the execution of fetch
  event handlers. It does not affect RPC methods", it "only considers
  locations where the Worker has previously run", and "Static assets are
  always served from the location nearest to the incoming request."
  Analysis "may take up to 15 minutes", and the `cf-placement` header "may
  be removed before Smart Placement exits beta" ([cf-placement]).
- **Durable Objects.** Created near the first request unless given a hint
  such as `wnam`, and they don't move afterwards ([cf-do-location]). The
  first call to a new name can add "up to a few hundred milliseconds"
  ([cf-do-namespace]).
- **Measuring.** `request.cf.colo` names the data center that took the
  request, and `clientTcpRtt` or `clientQuicRtt` give the player's round
  trip to it ([cf-request]).
- **Observed.** On September 22, 2026, `api.typesafe.ai` resolved to
  `100.20.85.248` and `44.227.31.201`; the second's reverse DNS is
  `ec2-44-227-31-201.us-west-2.compute.amazonaws.com`, and responses carried
  `server: istio-envoy`. TypeSafe says its service is on the West Coast
  ([jev-limits]).
- Synthesis: make the Jev call inside the day's object, created with
  `locationHint: "wnam"`, so the long leg runs from the player's nearest
  Cloudflare location to the object over Cloudflare's network, and the
  object's leg to AWS us-west-2 is short. Leave the stateless Worker at
  default placement, where it answers exact bank wordings from KV near the
  player. `"placement": { "region": "aws:us-west-2" }` fits only if Jev
  calls move into the stateless Worker. Players in Asia or Europe cross an
  ocean on every question that reaches the day's object, either way.

## Latest versions as of September 22, 2026

| Component                           | Latest                            | Date               | Sources             |
| ----------------------------------- | --------------------------------- | ------------------ | ------------------- |
| Wrangler                            | 4.136.1                           | September 21, 2026 | [npm-wrangler]      |
| workerd                             | 1.20260921.1                      | September 21, 2026 | [npm-workerd]       |
| Miniflare                           | 5.20260921.0-alpha (`latest` tag) | September 21, 2026 | [npm-miniflare]     |
| `@cloudflare/vitest-plugin`         | 1.2.1                             | September 21, 2026 | [npm-vitest-plugin] |
| `@cloudflare/vitest-pool-workers`   | 0.22.0, renamed since             | August 18, 2026    | [npm-vitest-pool]   |
| `@cloudflare/workers-types`         | 5.20260921.1                      | September 21, 2026 | [npm-workers-types] |
| Vitest                              | 5.0.1; 4.1.11 on the `V4` tag     | September 15, 2026 | [npm-vitest]        |
| `@msw/cloudflare`                   | 0.0.1                             | June 30, 2026      | [npm-msw-cf]        |
| `@typesafe-ai/sdk`                  | 0.6.0                             | September 15, 2026 | [npm-sdk]           |
| Compatibility date accepted locally | 2026-09-21                        | September 21, 2026 | Local test          |

- **Types.** "We recommend you generate types for your Worker by running
  `wrangler types`." Version 5 of `@cloudflare/workers-types` "exposes only
  the latest runtime types" ([cf-typescript]).

[npm-workerd]: https://registry.npmjs.org/workerd
[npm-workers-types]: https://registry.npmjs.org/@cloudflare/workers-types
[cf-typescript]: https://developers.cloudflare.com/workers/languages/typescript/

## Conflicts between sources

- **Cron Triggers per Worker.** The alarms page says "A Worker can have up
  to three Cron Triggers configured at once" ([cf-do-alarms]); the limits
  page lists 5 per account on Free and 250 on Paid ([cf-limits]); the Cron
  Triggers page sends readers to the limits page "to track the maximum
  number of Cron Triggers per Worker" ([cf-cron]).
- **Durable Object CPU on Free.** The Durable Objects limits page gives
  "30 seconds (default)" of CPU per request with no plan split, while the
  same page says Workers limits "apply according to your Workers plan"
  ([cf-do-limits]), and Workers Free allows 10 ms ([cf-limits]).
- **Storage per object on Free.** The limits table gives 10 GB per object
  and 5 GB per Free account, while its FAQ says the limit is "10 GB on
  Workers Paid, or 1 GB on the Free plan" ([cf-do-limits]). The overview's
  footnote still says "Storage per Durable Object with SQLite is currently
  1 GB. This will be raised to 10 GB for general availability."
  ([cf-do-what]), though SQLite objects went GA "with 10GB storage per
  object" in April 2025 ([cf-do-sqlite-ga]).
- **Default storage backend.** The glossary says "By default, a Durable
  Object class can use Storage API that leverages a key-value storage
  backend" ([cf-do-glossary]); since July 9, 2026, new namespaces must use
  SQLite ([cf-do-sqlite-only]).
- **Workers Logs default.** The page says "All newly created Workers will
  come with the observability setting enabled by default" and also "You
  must add the observability setting for your Worker to write logs to
  Workers Logs." ([cf-workers-logs])
- **Smart Placement's status.** The placement page speaks of a time "before
  Smart Placement exits beta" ([cf-placement]); the Workers betas page
  doesn't list it ([cf-betas]).
- **Node.js flags in tests.** The Vitest plugin "automatically injects" the
  `nodejs_compat` and `no_nodejs_compat_v2` flags when the config has none
  ([cf-vitest-isolation]), while production turns on both `nodejs_compat`
  and `nodejs_compat_v2` from compatibility date 2026-08-04
  ([cf-nodejs-default]). Neither page says which wins in tests for such
  dates.

[cf-do-sqlite-ga]: https://developers.cloudflare.com/changelog/post/2025-04-07-sqlite-in-durable-objects-ga/
[cf-betas]: https://developers.cloudflare.com/workers/platform/betas/

## Gaps

What the sources don't say that Guessling's backend needs, as of September
22, 2026:

- **Rate Limiting price and plan.** No price, and no statement on whether
  the binding works on the Free plan ([cf-ratelimit]; [cf-ratelimit-ga]).
- **Cancellation into objects.** Whether a player's disconnect, which can
  cancel the Worker's work, also cancels an RPC call in flight to a Durable
  Object and the object's `fetch` to Jev ([cf-limits]; [cf-do-lifecycle]).
- **Free-plan CPU for objects.** See
  [Conflicts between sources](#conflicts-between-sources).
- **workers.dev terms.** Anything beyond "Free website" and "hobby
  projects": no uptime, rate, or abuse terms for `workers.dev`
  ([cf-workers-dev]).
- **Free log overflow.** What happens past 200,000 log events a day on the
  Free plan ([cf-workers-logs]).
- **Analytics Engine billing date.** Only "in the coming months"
  ([cf-ae-pricing]).
- **Hop latency.** No Cloudflare figure for a Worker's call to a Durable
  Object in another region, or for which data centers `wnam` means
  ([cf-do-location]).
- **TypeSafe's region.** TypeSafe doesn't name an AWS region; us-west-2
  comes from DNS alone, which can change ([jev-limits]).
- **KV propagation bound.** "up to 60 seconds or more" has no stated upper
  bound ([cf-kv-how]).
- **Production runs.** None of the local tests ran on Cloudflare's network,
  so the SDK, the `exports` block, and the concurrency result are unchecked
  in production.
- **The plans page.** `https://www.cloudflare.com/plans/developer-platform/`
  renders with JavaScript, and its text couldn't be read, so prices come
  from the docs' pricing pages ([cf-pricing]).

## See also

- [Guessling idea](/docs/archive/guessling-idea.md): how Jev fits Guessling, and
  the build plan this note serves.
- [Jev notes](/docs/research/jev.md): Jev's API, SDKs, prices, limits, and
  terms.
- [Ideation log, round 9](/docs/research/ideation.md#round-9-scope-stack-and-schedule):
  why the stack is one Worker with KV and Durable Objects.
- [Workers docs index](https://developers.cloudflare.com/workers/llms.txt),
  [Durable Objects docs index](https://developers.cloudflare.com/durable-objects/llms.txt),
  and [KV docs index](https://developers.cloudflare.com/kv/llms.txt):
  Cloudflare's lists of every page, in Markdown.

[cf-pricing]: https://developers.cloudflare.com/workers/platform/pricing/
[cf-limits]: https://developers.cloudflare.com/workers/platform/limits/
[cf-do-pricing]: https://developers.cloudflare.com/durable-objects/platform/pricing/
[cf-workers-dev]: https://developers.cloudflare.com/workers/configuration/routing/workers-dev/
[idea-stack]: /docs/archive/guessling-idea.md#stack-and-data-flow
[cf-kv-how]: https://developers.cloudflare.com/kv/concepts/how-kv-works/
[cf-kv-write]: https://developers.cloudflare.com/kv/api/write-key-value-pairs/
[cf-kv-read]: https://developers.cloudflare.com/kv/api/read-key-value-pairs/
[cf-do-sqlite-only]: https://developers.cloudflare.com/changelog/post/2026-07-09-restrict-new-kv-backed-namespaces/
[cf-do-limits]: https://developers.cloudflare.com/durable-objects/platform/limits/
[cf-do-what]: https://developers.cloudflare.com/durable-objects/concepts/what-are-durable-objects/
[cf-do-glossary]: https://developers.cloudflare.com/durable-objects/reference/glossary/
[cf-blog-gates]: https://blog.cloudflare.com/durable-objects-easy-fast-correct-choose-three/
[cf-do-rules]: https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/
[cf-do-errors]: https://developers.cloudflare.com/durable-objects/best-practices/error-handling/
[cf-do-namespace]: https://developers.cloudflare.com/durable-objects/api/namespace/
[cf-do-location]: https://developers.cloudflare.com/durable-objects/reference/data-location/
[cf-do-alarms]: https://developers.cloudflare.com/durable-objects/api/alarms/
[cf-do-lifecycle]: https://developers.cloudflare.com/durable-objects/concepts/durable-object-lifecycle/
[cf-ratelimit]: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
[cf-ratelimit-ga]: https://developers.cloudflare.com/changelog/post/2025-09-19-ratelimit-workers-ga/
[npm-wrangler]: https://registry.npmjs.org/wrangler
[cf-nodejs-default]: https://developers.cloudflare.com/changelog/post/2026-08-04-nodejs-compat-default/
[npm-sdk]: https://registry.npmjs.org/@typesafe-ai/sdk
[cf-web-standards]: https://developers.cloudflare.com/workers/runtime-apis/web-standards/
[jev-limits]: /docs/research/jev.md#rate-limits-context-length-and-latency
[cf-cron]: https://developers.cloudflare.com/workers/configuration/cron-triggers/
[cf-request]: https://developers.cloudflare.com/workers/runtime-apis/request/
[cf-workers-logs]: https://developers.cloudflare.com/workers/observability/logs/workers-logs/
[cf-ae-pricing]: https://developers.cloudflare.com/analytics/analytics-engine/pricing/
[npm-miniflare]: https://registry.npmjs.org/miniflare
[npm-vitest-plugin]: https://registry.npmjs.org/@cloudflare/vitest-plugin
[npm-vitest-pool]: https://registry.npmjs.org/@cloudflare/vitest-pool-workers
[npm-vitest]: https://registry.npmjs.org/vitest
[cf-vitest-isolation]: https://developers.cloudflare.com/workers/testing/vitest-integration/isolation-and-concurrency/
[npm-msw-cf]: https://registry.npmjs.org/@msw/cloudflare
[cf-placement]: https://developers.cloudflare.com/workers/configuration/placement/

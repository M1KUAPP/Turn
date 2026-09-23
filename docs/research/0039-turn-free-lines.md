# Turn's free lines research notes

What the relay's free lines and `listen` check can rely on in RevenueCat's
REST API v2 spec, `@revenuecat/cli` 0.1.3, and Cloudflare's SQLite storage
API, read for issue #30 on September 23, 2026. Judgment starts with
"Synthesis:".

Contents:

1.  [The active entitlements endpoint](#the-active-entitlements-endpoint)
1.  [RevenueCat's CLI and a headless purchase](#revenuecats-cli-and-a-headless-purchase)
1.  [SQLite in the Device object](#sqlite-in-the-device-object)
1.  [A one-time purchase in active entitlements](#a-one-time-purchase-in-active-entitlements)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## The active entitlements endpoint

- **Where the spec lives.** The OpenAPI file RevenueCat's docs link,
  `openapi-v2.yaml`, holds only the overview, with `paths: {}`
  ([docs' OpenAPI][rc-openapi-docs]). RevenueCat's CLI vendors the full spec,
  and it is quoted here ([spec][rc-spec]). Permission, rate limit, and the `404`
  are in the [RevenueCat and Expo notes][rc-v2-notes].
- **The operation.** `operationId: list-customer-active-entitlements`,
  `x-scopes: customer_information:customers:read`,
  `x-revenuecat-rate-limiting-domain: customer_information`. `customer_id` is
  a string with `minLength: 1` and `maxLength: 1500`; `limit` defaults to 20,
  and "Values below 1 or above 100 are clamped to that range rather than
  rejected." ([spec][rc-spec])
- **The 200 body.** `ListCustomerActiveEntitlements` requires `items`,
  `next_page`, `object`, and `url`, with `additionalProperties: false`.
  `object` is "Always has the value `list`"; `next_page` is a nullable string,
  "If not present / null, there is no next page"; `url` is "The URL where
  this list can be accessed." ([spec][rc-spec])
- **Each item.** `CustomerEntitlement` requires `object`, `entitlement_id`,
  and `expires_at`, with `additionalProperties: false`: `object` is the enum
  `customer.active_entitlement`; `entitlement_id` is a string of 1 to 255
  characters, "ID of the entitlement granted to the customer", such as
  `entla1b2c3d4e5`; `expires_at` is `nullable: true`, `type: integer`,
  `format: int64`, "in ms since epoch" ([spec][rc-spec]).
- **A recorded body.** The CLI's test fixture for this path, captured from
  the API, is an empty list whose `url` is absolute, not the spec's relative
  example ([fixture][cli-fixture]):

  ```json
  {
    "items": [],
    "next_page": null,
    "object": "list",
    "url": "https://api.revenuecat.com/v2/projects/proj_test_001/customers/id_test_033/active_entitlements"
  }
  ```

- **Errors.** The operation lists `400`, `401`, `403`, `404`, `423`, `429`,
  `500`, and `503`. Every error body is `Error`, which requires `object`
  (`error`), `type`, `message`, and `retryable`, and may carry `param`,
  `doc_url`, `referenced_object_ids`, and `backoff_ms`, "The ms the client
  should wait before retrying the request. Only present for retryable
  errors." ([spec][rc-spec])
- **The 404.** `NotFound` narrows `type` to `resource_missing`, with this
  example ([spec][rc-spec]):

  ```json
  {
    "object": "error",
    "type": "resource_missing",
    "message": "Resource not found",
    "retryable": false,
    "doc_url": "https://errors.rev.cat/resource-missing"
  }
  ```

- **401 and 403.** `Unauthorized` is `authentication_error`, "Invalid API
  key"; `Forbidden` is `authorization_error`, "You're not authorized to
  access this resource"; both are `retryable: false` ([spec][rc-spec]).
- **423.** `Locked` is `resource_locked_error`, "The resource is currently
  being modified by a concurrent request", with `retryable: true` and
  `backoff_ms: 1000` ([spec][rc-spec]).
- **429.** `RateLimited` narrows `type` to `rate_limit_error` and sends
  `Retry-After`, "The number of seconds to wait before retrying a rate limited
  request", plus `RevenueCat-Rate-Limit-Current-Usage` and
  `RevenueCat-Rate-Limit-Current-Limit` ([spec][rc-spec]). The docs' example
  body ([API v2 docs][rc-api-v2]):

  ```json
  {
    "type": "rate_limit_error",
    "message": "Rate limit exceeded",
    "retryable": true,
    "doc_url": "https://errors.rev.cat/rate-limit-error",
    "backoff_ms": 1000
  }
  ```

- **5xx.** `500` is "The RevenueCat server ran into an unexpected problem"
  and `503` "There wasn't a server to handle the request"; the spec points
  both at `InternalError` ([API v2 docs][rc-api-v2]; [spec][rc-spec]).
- **Encoding.** "For URL params, such as the `app_user_id`, make sure you URL
  encode them before using them." ([API v2 docs][rc-api-v2])
- Synthesis: the relay needs one page, since `listen` is the only
  entitlement, and matches `items[].entitlement_id` against the entitlement's
  object ID, as the TRD says. Only a `200` without a match and a `404` with
  `type` `resource_missing` mean no. Any other status, a body that doesn't
  parse, or a timeout means unknown: no cache row and no `402`. The path
  segment is `encodeURIComponent(appUserId)`.

[rc-openapi-docs]: https://www.revenuecat.com/docs/redocusaurus/openapi-v2.yaml
[cli-fixture]: https://github.com/RevenueCat/cli/blob/v0.1.3/internal/api/testdata/v2/projects_PROJ_customers_CUST_active_entitlements.json
[rc-api-v2]: https://www.revenuecat.com/docs/api-v2
[rc-v2-notes]: /docs/research/0009-revenuecat-expo.md#rest-api-v2-customer-and-active-entitlements

## RevenueCat's CLI and a headless purchase

- **The package.** `@revenuecat/cli`, latest `0.1.3`, modified
  2026-09-18, binaries `rc` and `revenuecat`, Node `>=18` ([npm][cli-npm]). Its
  README calls the package "a thin launcher": "The CLI itself is a native
  Go binary", shipped as optional dependencies
  `@revenuecat/cli-<platform>-<arch>`, and its `bin/rc.js` says "No
  JavaScript runs beyond this dispatch." ([npm][cli-npm])
- **Logging in.** `rc auth login` offers "Browser login", which "Opens a browser
  window for OAuth authorization", or "API key", "a secret key from the
  dashboard", stored in `~/.config/revenuecat/<profile>.json` with mode 0600.
  "The API key can also be supplied via RC_API_KEY for CI use without storing
  anything on disk; while set, it overrides the stored login."
  ([auth.go][cli-auth-src]) Credentials go to the OS keyring when available, and
  `RC_CONFIG_DIR` or `XDG_CONFIG_HOME` move the directory
  ([config.go][cli-config-src]).
- **Precedence.** `--api-key` wins over `$RC_API_KEY`, then the OAuth login,
  then the stored key; `--profile` picks the profile ([README][cli-readme]).
- **The command.** The README's Test Store check runs
  ([README][cli-readme]):

  ```shell
  rc customers simulate-purchase \
    --app-id app_test --product premium_monthly --app-user-id demo-user \
    --yes --json --no-input
  ```

- **What it does.** "Creates a real RevenueCat Test Store transaction
  through the same receipt endpoint used by the SDK. The selected app must
  have a test_ public SDK key. The Product may be given by RevenueCat
  Product ID or store identifier." ([customers.go][cli-customers-src])
- **What it needs.** A project, then `--app-id` (or `RC_APP_ID`),
  `--product` (or `RC_PRODUCT`), and `--app-user-id` (or `RC_APP_USER_ID`).
  It lists the app's products and, without `--public-api-key` (or
  `RC_PUBLIC_API_KEY`), finds the app's key starting with `test_` through
  the v2 API. Without one it fails with "app %s does not have a Test Store
  public SDK key". Its help says "Confirmation: prompts under TTY; pass
  --yes to skip. Required under --no-input." ([customers.go][cli-customers-src])
- **The request.** It posts `fetch_token`, `app_user_id`, and `product_id`
  (the store identifier) to `/receipts` with `Bearer` and the `test_` key,
  `X-Platform: iOS`, `X-Version: rc-cli`, and
  `X-Client-Bundle-Id: com.revenuecat.cli` ([sdk.go][cli-sdk-src]). The token is
  `TEST_<ms>_<32 hex>` ([customers.go][cli-customers-src]).
- **What it prints.** "Simulated purchase for <app user ID>", then `app_id`,
  `app_user_id`, `product`, `fetch_token`, `customer_info` (the raw SDK
  response, "entitlements keyed by identifier"), and `active_entitlements`,
  the identifiers of entitlements whose expiry is ahead or absent
  ([customers.go][cli-customers-src]).
- **Exit codes.** 0 success, 1 error, 2 bad usage, 4 "Authentication /
  authorization", 5 not found, 6 rate limited ([README][cli-readme]).
- Synthesis: the live check runs the command below with `RC_API_KEY` in
  the environment, not on the command line. That key isn't the relay's: the
  command also reads apps, products, and public keys. Its
  `active_entitlements` holds lookup keys (`listen`), while the relay's call
  returns object IDs.

  ```shell
  npx --yes @revenuecat/cli@0.1.3 customers simulate-purchase \
    --app-id <app_…> --product turn_listen --app-user-id <setup-only ID> \
    --yes --json --no-input
  ```

[cli-npm]: https://www.npmjs.com/package/@revenuecat/cli/v/0.1.3
[cli-auth-src]: https://github.com/RevenueCat/cli/blob/v0.1.3/internal/cli/auth.go
[cli-config-src]: https://github.com/RevenueCat/cli/blob/v0.1.3/internal/config/config.go
[cli-readme]: https://github.com/RevenueCat/cli/blob/main/README.md
[cli-sdk-src]: https://github.com/RevenueCat/cli/blob/v0.1.3/internal/api/sdk.go

## SQLite in the Device object

- **Already settled.** The [Cloudflare notes][cf-api] cover `sql.exec()`,
  consuming a cursor before the next `await`, and writes without an `await`
  being "submitted atomically"; the [gates section][cf-gates] covers input
  gates; and the [plans section][cf-plans] gives Free's 5 million rows read
  and 100,000 rows written a day. The [services notes][svc-count] ran the
  claim in `transactionSync()` locally and measured `rowsWritten` 2 for the
  first insert.
- **The cursor.** `exec(query: string, ...bindings: any[]): SqlStorageCursor`.
  `toArray()` "returns an array of returned row objects"; `one()` "Returns a
  row object if query result has exactly one row. If query result has zero
  rows or more than one row, `one()` throws an exception"; `rowsRead` and
  `rowsWritten` count "so far as part of this SQL `query`", and "The final
  value is used for SQL billing" ([SQLite API][cf-do-sqlite]).
- **transactionSync.** "Invokes `callback()` wrapped in a transaction, and
  returns its result. If `callback()` throws an exception, the transaction
  will be rolled back. The callback must complete synchronously, that is, it
  should not be declared `async` nor otherwise return a Promise."
  ([SQLite API][cf-do-sqlite])
- **Tables.** The API page's example runs
  `CREATE TABLE IF NOT EXISTS` in the constructor, after `super(ctx, env)`
  ([SQLite API][cf-do-sqlite]).
- Synthesis: the claim runs in one `transactionSync()` with no `await`
  inside, and the release is a single `DELETE` after the Jev call, so a
  second line can arrive between them; the claim alone decides free,
  duplicate, or paid.
  `COUNT(*)` suits `one()`; the duplicate check suits `toArray()`. The
  constructor creates both tables with `IF NOT EXISTS`.

[cf-api]: /docs/research/0010-cloudflare-workers.md#the-durable-object-storage-api
[cf-gates]: /docs/research/0010-cloudflare-workers.md#single-threaded-execution-and-input-and-output-gates
[cf-plans]: /docs/research/0010-cloudflare-workers.md#durable-objects-on-the-free-and-paid-plans
[svc-count]: /docs/research/0024-turn-services.md#counting-free-partner-lines-per-device
[cf-do-sqlite]: https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/

## A one-time purchase in active entitlements

- **The field allows null.** `expires_at` is `nullable: true` ([spec][rc-spec]).
- **One-time products don't expire.** For a consumable in an entitlement,
  "RevenueCat will report that entitlement as unlocked (forever), even after
  one purchase", because "there is no expiration date for consumables, like
  there is for a subscription". For a "Lifetime Unlock", RevenueCat
  recommends "a new non-consumable IAP (iOS)" added to the offering and the
  entitlement ([non-subscriptions][rc-non-subs]).
- **The CLI reads it the same way.** Its `activeEntitlementIDs` counts an
  entitlement with no `expires_date` as "non-expiring / lifetime"
  ([customers.go][cli-customers-src]).
- **Store not shown.** Items carry no store or environment, as the
  [services notes][svc-server] found.
- Synthesis: expect `listen` from `turn_listen` with `expires_at: null`;
  the relay accepts `null` or a time still ahead, as the TRD says. No page
  says this for Test Store specifically, so the live check should confirm
  it.

[rc-non-subs]: https://www.revenuecat.com/docs/platform-resources/non-subscriptions
[svc-server]: /docs/research/0024-turn-services.md#test-store-purchases-on-the-server

## Gaps

- **`rc --help` wasn't run.** The time box ran out before installing the
  darwin-arm64 binary, so the flags come from the v0.1.3 source and the
  README on `main`, not from the binary's help.
- **Customer creation.** Nothing read says whether `simulate-purchase`
  creates a customer that RevenueCat hadn't seen; the SDK's `/receipts`
  endpoint is expected to, which the live check can confirm with
  `rc customers list`.
- **The CLI's permissions.** Which v2 permissions the command's app,
  product, and public-key reads need wasn't checked.
- **A live body.** No real `active_entitlements` response for a Test Store
  `non_consumable` purchase was seen; `expires_at: null` is inferred.
- **The 404 for this path.** The spec lists `404` `resource_missing`, but no
  page says a never-seen `customer_id` gets it on this sub-resource rather
  than an empty list.
- **Where to create tables.** Cloudflare's rules page on constructors and
  `blockConcurrencyWhile()` wasn't read; only the API page's example was.
- **Rows for a release.** The `DELETE` that releases a claim wasn't measured
  in `rowsWritten`.

## See also

- [REST API v2 customer and active entitlements](/docs/research/0009-revenuecat-expo.md#rest-api-v2-customer-and-active-entitlements)
- [Counting free partner lines per device](/docs/research/0024-turn-services.md#counting-free-partner-lines-per-device)
- [Test Store purchases on the server](/docs/research/0024-turn-services.md#test-store-purchases-on-the-server)
- [The relay's storage](/docs/TRD.md#the-relays-storage)
- [The relay's entitlement check](/docs/TRD.md#the-relays-entitlement-check)
- [Turn's relay research notes](/docs/research/0038-turn-relay.md)

[rc-spec]: https://github.com/RevenueCat/cli/blob/v0.1.3/docs/specs/v2-developer.yaml
[cli-customers-src]: https://github.com/RevenueCat/cli/blob/v0.1.3/internal/cli/customers.go

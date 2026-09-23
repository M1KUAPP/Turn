# Turn's relay limits research notes

How the relay can limit each app user ID and address, and cap Jev calls per
UTC day, from Cloudflare's docs pages and changelog, the cloudflare-docs and
workers-sdk repos, RFCs 6585 and 9110, the installed `@typesafe-ai/sdk`
0.6.0, Miniflare, and test plugin, and a local test, read for issue #35 on
September 23, 2026. Judgment starts with "Synthesis:".

Contents:

1.  [The binding on the Free plan](#the-binding-on-the-free-plan)
1.  [How the binding counts](#how-the-binding-counts)
1.  [Retry-After for a 429](#retry-after-for-a-429)
1.  [CF-Connecting-IP and IPv6](#cf-connecting-ip-and-ipv6)
1.  [Durable Object requests and rows](#durable-object-requests-and-rows)
1.  [The SDK's attempts](#the-sdks-attempts)
1.  [The local simulation](#the-local-simulation)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## The binding on the Free plan

- **The binding's page.** Nothing on it names a Cloudflare plan. It says
  "Last updated Apr 23, 2026", and its only plan words are about a Worker's
  own customers: "Different rate limits for different types of customers or
  users (ex: free vs. paid)" ([page][cf-ratelimit]).
- **The page's source.** Its frontmatter has no plan field, only
  `pcx_content_type`, `title`, `description`, and `products` (`workers`),
  and it imports no partial ([source][cf-rl-src]).
- **The GA post.** "The `ratelimit` binding is now stable and recommended
  for all production workloads." It names no plan
  ([changelog][cf-ratelimit-ga]).
- **Pricing and limits.** Neither the Workers pricing page, "Last updated
  Aug 28, 2026", nor the limits page, "Last updated Sep 5, 2026", contains
  "rate limit", "ratelimit", or "rate-limit" ([pricing][cf-pricing];
  [limits][cf-limits]).
- Synthesis: no Cloudflare page read states, implies, or rules out the
  binding on Workers Free, and a local run shows only that Wrangler
  simulates it. The record the ticket asks for takes one deploy on the Free
  account: whether `wrangler deploy` accepts `ratelimits`, and whether the
  31st quick request from one ID gets 429. Until then, keep the fallback.

[cf-ratelimit-ga]: https://developers.cloudflare.com/changelog/post/2025-09-19-ratelimit-workers-ga/
[cf-pricing]: https://developers.cloudflare.com/workers/platform/pricing/

## How the binding counts

- **What a call counts.** `simple.limit` is "The number of allowed requests
  (or calls to `limit()`) within the given `period`", and a comment reads
  "1500 requests - calls to limit() increment this", which leaves open
  whether a refused call counts. Another says "Limit: the number of tokens
  allowed within a given period in a single Cloudflare location"
  ([source][cf-rl-src]).
- **Only `success` comes back.** The samples destructure only `success`,
  and the Monitoring section speaks of when "`limit()` returns
  `{ success: false }`". No reset time, remaining count, or window start
  appears on the page ([page][cf-ratelimit]).
- **The emulator's result.** Miniflare's client types it as
  `{ success: boolean }`, which "should be kept in sync with
  `RatelimitResult`" in an internal `ratelimit.h`. It takes `limit` and
  `period` beside `key` and throws "bad rate limit options" for any other
  field ([Miniflare client][mf-client]), where the docs name only "the
  `key` field" ([page][cf-ratelimit]).
- **Fixed windows on the wall clock, locally.** The emulator's object takes
  `Math.floor(Date.now() / (period * 1000))` as the window, and "Windows
  are aligned to the wall clock, so every key sharing a period rolls over
  at the same instant." When `count >= limit` it returns
  `{ success: false }` without writing, so a refused call isn't counted
  ([Miniflare object][mf-object]).
- **Production, per a code comment.** "there, an entry is identified by
  `(account_id, namespace, hash(key), bucket, bucket_start_ts)` and both
  `bucket` and `bucket_start_ts` are derived from the period", and the
  limit "is a threshold applied to a shared count rather than part of the
  counter's identity" ([Miniflare object][mf-object]).
- **Convergence.** "The underlying counters are cached on the same machine
  that your Worker runs in, and updated asynchronously in the background by
  communicating with a backing store that is within the same Cloudflare
  location." Requests count "Very quickly, but not immediately", with no
  figure given ([page][cf-ratelimit]).
- **Limits on the binding.** None found on namespaces, keys, or `limit`,
  beyond the settings the [Cloudflare notes][cf-ratelimit-notes] quote.
- Synthesis: expect fixed 60-second windows that start on the minute, as a
  bucket start derived from the period implies, though only the emulator
  shows it. A client can then land 30 requests at :59 and 30 at :00, and a
  refused call costs nothing if production matches the emulator. The
  31st-request test is exact against the local simulator, where counting is
  serial; production's cached counts may let a few more through.

[mf-client]: https://github.com/cloudflare/workers-sdk/blob/main/packages/miniflare/src/workers/ratelimit/ratelimit.worker.ts
[mf-object]: https://github.com/cloudflare/workers-sdk/blob/main/packages/miniflare/src/workers/ratelimit/ratelimit-object.worker.ts

## Retry-After for a 429

- **RFC 6585.** "The 429 status code indicates that the user has sent too
  many requests in a given amount of time ("rate limiting")." Responses
  "SHOULD include details explaining the condition, and MAY include a
  Retry-After header indicating how long to wait before making a new
  request." The RFC "does not define how the origin server identifies the
  user, nor how it counts requests", and "Responses with the 429 status
  code MUST NOT be stored by a cache." ([RFC 6585][rfc6585])
- **RFC 9110.** "Servers send the "Retry-After" header field to indicate
  how long the user agent ought to wait before making a follow-up request."
  "When sent with a 503 (Service Unavailable) response, Retry-After
  indicates how long the service is expected to be unavailable to the
  client." The grammar is `Retry-After = HTTP-date / delay-seconds`, and "A
  delay-seconds value is a non-negative decimal integer, representing time
  in seconds." ([RFC 9110][rfc9110])
- **Cloudflare's sample.** The binding page answers a refused call with a
  text body and `{ status: 429 }` only, with no `Retry-After`, and gives no
  guidance on one ([page][cf-ratelimit]).
- Synthesis: send delay-seconds, which needs no clock agreement with the
  phone. For a 429, `60 - (now % 60)` with `now` in whole seconds matches
  fixed windows, and `60` is the safe bound if they turn out otherwise.
  The `jev_unavailable` 503 can carry the seconds to midnight UTC, which is
  what RFC 9110 says a 503's Retry-After means.

[rfc6585]: https://www.rfc-editor.org/rfc/rfc6585#section-4
[rfc9110]: https://www.rfc-editor.org/rfc/rfc9110#section-10.2.3

## CF-Connecting-IP and IPv6

- **What it holds.** "`CF-Connecting-IP` provides the client IP address
  connecting to Cloudflare to the origin web server. This header will only
  be sent on the traffic from Cloudflare's edge to your origin web server."
  In a Worker, "When no Worker subrequest is triggered, `cf-connecting-ip`
  reflects the client's IP address and the `x-real-ip` header is stripped."
  The page says "Last updated May 5, 2026" ([headers][cf-headers]).
- **Spoofing.** The page says a client's own value "will be overwritten"
  for some headers, such as `Accept-Encoding`, but says nothing like it for
  a client-sent `CF-Connecting-IP` ([headers][cf-headers]).
- **IPv6.** With Pseudo IPv4 set to `Overwrite Headers`, "Cloudflare
  overwrites the existing `Cf-Connecting-IP` and `X-Forwarded-For` headers
  with a pseudo IPv4 address while preserving the real IPv6 address in
  `CF-Connecting-IPv6` header." ([headers][cf-headers]) Its other mode
  "adds the `Cf-Pseudo-IPv4` header with a Class E IPv4 address hashed from
  the original IPv6 address" ([Pseudo IPv4][cf-pseudo]). Neither page shows
  how an IPv6 value is written, compressed or in full.
- **No /64 advice.** No page read recommends grouping IPv6 addresses by
  prefix. WAF rules count by `ip.src` or by "IP with NAT support"
  (`cf.unique_visitor_id`), which "relies on a cookie-based visitor
  identification mechanism" ([WAF parameters][cf-waf-params]); the binding
  page advises against IP keys ([Cloudflare notes][cf-ratelimit-notes]).
- Synthesis: key the address's limit on `CF-Connecting-IP` as the Worker
  gets it. Grouping IPv6 by /64 would be Turn's own choice, not
  Cloudflare's advice; as a backstop behind the per-ID limit and the daily
  budget, the plain value is enough. Whether a client's own value survives
  is for a live check to show.

[cf-headers]: https://developers.cloudflare.com/fundamentals/reference/http-headers/
[cf-pseudo]: https://developers.cloudflare.com/network/pseudo-ipv4/
[cf-waf-params]: https://developers.cloudflare.com/waf/rate-limiting-rules/parameters/

## Durable Object requests and rows

- **An RPC call is a request,** as in the [Cloudflare notes][do-notes].
  Newly quoted, for stubs "extending `RpcTarget`": "Subsequent calls on the
  returned stub are part of the same RPC session and are not billed as
  separate requests." The page doesn't distinguish callers, so a call from
  a user's object to the budget's is billed like one from the Worker; that
  is inference ([DO pricing][cf-do-pricing]).
- **Free's requests.** Still "100,000 / day", on a page "Last updated Aug
  25, 2026" ([DO pricing][cf-do-pricing]).
- **Rows written.** Durable Objects' rows "match D1 pricing", and "Deletes
  are counted as rows written." ([DO pricing][cf-do-pricing]) D1: "Write
  operations include `INSERT`, `UPDATE`, and `DELETE`. Each of these
  operations contribute towards rows written. A query that `INSERT` 10 rows
  into a `users` table would count as 10 rows written." And "Indexes will
  add an additional written row when writes include the indexed column, as
  there are two rows written: one to the table itself, and one to the
  index." ([D1 pricing][d1-pricing])
- **Subrequests.** "A subrequest is any request a Worker makes using the
  Fetch API or to Cloudflare services like R2, KV, or D1", and Free allows
  "1,000" "Subrequests to internal services"; whether a stub call is one
  isn't said ([limits][cf-limits]).
- **Newly quoted limits.** "Maximum Durable Object classes (per account)"
  is "500 (Workers Paid) / 100 (Free)", and "An individual Object has a
  soft limit of 1,000 requests per second." The page says "Last updated Jun
  1, 2026" ([DO limits][cf-do-limits]).
- Synthesis: an `UPDATE` of one counter row, with no index on the column
  it changes, writes one row. A line that reaches Jev costs one Worker
  request, one to the user's object, and one to the budget's per Jev call,
  retries included, plus a budget row per call; the fallback count adds a
  row per request. Judging's volume stays far under 100,000 a day and 1,000
  a second. Keying the budget's row by the UTC date, such as `2026-09-23`,
  resets it at midnight UTC without an alarm.

[do-notes]: /docs/research/0010-cloudflare-workers.md#durable-objects-on-the-free-and-paid-plans
[cf-do-pricing]: https://developers.cloudflare.com/durable-objects/platform/pricing/
[d1-pricing]: https://developers.cloudflare.com/d1/platform/pricing/
[cf-do-limits]: https://developers.cloudflare.com/durable-objects/platform/limits/

## The SDK's attempts

Paths are under `node_modules/.bun/@typesafe-ai+sdk@0.6.0/`, in the
package's `dist/`.

- **A `fetch` of the caller's.** The client's configuration takes
  `fetch?: Fetch`, "Custom HTTP fetch implementation for transport
  configuration or tests. Default: global `fetch`." (`index.d.mts:226-227`)
  The constructor keeps `config.fetch ?? defaultFetch`
  (`index.mjs:520-521`). A call's own options hold only `signal`, `timeout`,
  `retry`, and `headers` (`index.d.mts:181-190`).
- **Each attempt calls it.** The request loop runs
  `for (let attempt = 0;; attempt++)`, and each attempt awaits
  `this.fetch(url, { ...init, signal: controller.signal })`, with
  `X-TypeSafe-Retry-Count` on retries (`index.mjs:590-595, 641-644`). With
  the relay's `maxRetries: 1`, one `systemOne` call fetches at most twice.
- **What retries.** The statuses 408, 429, and 500 to 599
  (`index.mjs:78-83`), and timeouts and connection errors
  (`index.mjs:87-88, 437-441`). Any other status, 402 among them, throws at
  once (`index.mjs:619-620`). The timeout is "per attempt in milliseconds;
  there is no total retry budget" (`index.d.mts:184-185`), and with
  `respectRetryAfter: false` the wait before a retry is 500 ms less up to
  25% of jitter (`index.mjs:75-77, 113-120`).
- **A fetch that throws.** If the caller's signal has aborted, the attempt
  throws `APIUserAbortError`; otherwise a timeout throws `APITimeoutError`,
  and anything else `APIConnectionError` (`index.mjs:647-657`). The loop
  rethrows `APIUserAbortError` at once and retries the other two
  (`index.mjs:608-612`).
- Synthesis: a `fetch` handed to the client can take each attempt from the
  day's budget, the retry included, and call `globalThis.fetch`, so the
  tests' stand-in still answers. To refuse an attempt without the SDK
  retrying it after its backoff, the `fetch` aborts a signal the call
  listens to, then throws.

## The local simulation

Paths are under `node_modules/.bun/`, in `miniflare@5.20260921.0-alpha`
(`MF`), `@cloudflare+vitest-plugin@1.2.2` (`VP`), and `wrangler@4.136.2`
(`WR`), each in the package's `dist/` or `wrangler-dist/`.

- **Fixed windows.** Miniflare's limiter takes
  `Math.floor(Date.now() / (period * 1e3))` as the window, and "Windows are
  aligned to the wall clock, so every key sharing a period rolls over at
  the same instant." A call at or over the limit returns
  `{ success: false }` and writes nothing
  (`MF ratelimit-object.worker.js:30-37, 46-47`).
- **Per namespace and key.** Each binding reaches one limiter object for
  its namespace (`MF index.js:112356-112361`), whose rows are keyed by
  `(key, period)` (`MF ratelimit-object.worker.js:11-18`).
- **In the tests.** The plugin reads `wrangler.jsonc` through Wrangler
  (`VP pool/index.mjs:64571-64603`), whose Miniflare options carry the
  `ratelimit` bindings (`WR cli.js:177966-177969`). `reset()` from
  `cloudflare:test` runs `deleteAllDurableObjects()`
  (`VP worker/lib/cloudflare/test-internal.mjs:829-831`), which "is what
  resets these counters between tests", in Miniflare's words
  (`MF index.js:112419-112427`).
- **No address in the tests.** Miniflare sets `CF-Connecting-IP` from the
  socket's address, on requests that reach it over its socket
  (`MF workers/core/entry.worker.js:4985-4987`). The relay's tests call
  the Worker's `fetch` directly (`worker/test/helpers.ts:27-28`), so their
  requests carry none unless a test sets one.
- **Local test.** On September 23, 2026, with both bindings added to the
  relay's `wrangler.jsonc` under the test pool:
  - 32 calls with one key to a limit of 30 succeeded 30 times;
  - after 31 calls, `reset()` let the next one succeed;
  - an empty key answered `{"success":true}`;
  - two test files, running at the same time, each got 30 successes from
    40 calls with the same key, so files don't share counts;
  - and `vi.setSystemTime` changed `Date.now()` inside a Durable Object.
- Synthesis: a test of the 31st request can use the configured binding
  with a fresh ID, started away from a minute's end, since every window
  rolls over on the minute. The other tests stay within 30 requests per ID
  and clear their counts through `reset()`.

## Gaps

- **The Free plan.** No page says whether the binding works on Workers
  Free; only a deploy on the Free account, not run here, can settle it.
- **Production counting.** Fixed windows and uncounted refusals come from
  Miniflare's emulator and its comments, whose `ratelimit.h` and
  `counts.rs` are on Cloudflare's internal GitLab; how fast counts converge
  isn't stated.
- **The address header.** Whether Cloudflare replaces a client-sent
  `CF-Connecting-IP` on a request to a Worker, how it writes an IPv6
  address, and whether Pseudo IPv4 applies to a `workers.dev` address
  weren't found; the "Restoring original visitor IPs" page wasn't read.
- **Stub calls as subrequests.** Whether a call from one object to another
  counts against the caller's subrequest limits isn't said.
- **Index rows.** Whether an upsert on a table keyed by a text primary key
  also writes an index row isn't said; a local test could measure it.
- **Not read.** workerd's source for the binding, the RPC lifecycle page,
  and the Durable Objects changelog since note 0010. Docs pages were read
  as their `index.md` Markdown and repo files as raw text, so quotes are
  exact.

## See also

- [Cloudflare notes, Limiting requests per device](/docs/research/0010-cloudflare-workers.md#limiting-requests-per-device)
- [Services notes, The Rate Limiting binding for Turn](/docs/research/0024-turn-services.md#the-rate-limiting-binding-for-turn)
- [Services notes, Free and Paid limits for the relay](/docs/research/0024-turn-services.md#free-and-paid-limits-for-the-relay)
- [Services notes, Limiting abuse of the free lines](/docs/research/0024-turn-services.md#limiting-abuse-of-the-free-lines)
- [TRD, Validation and abuse limits](/docs/TRD.md#validation-and-abuse-limits)

[cf-ratelimit]: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
[cf-rl-src]: https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/workers/runtime-apis/bindings/rate-limit.mdx
[cf-limits]: https://developers.cloudflare.com/workers/platform/limits/
[cf-ratelimit-notes]: /docs/research/0010-cloudflare-workers.md#the-rate-limiting-binding

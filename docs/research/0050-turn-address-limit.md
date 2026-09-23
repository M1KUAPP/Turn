# Turn's address limit research notes

What an exact count per address in a Durable Object would cost on Workers
Free, against the rate limiting binding, from Cloudflare's Workers, Durable
Objects, D1, WAF, and headers docs pages, workerd's SQLite source and row
count patch, a search of the cloudflare-docs repo, and a local measurement,
read for issue #98 on September 24, 2026. Judgment starts with
"Synthesis:".

Contents:

1.  [The Free plan's quotas](#the-free-plans-quotas)
1.  [What a Durable Object request costs](#what-a-durable-object-request-costs)
1.  [Duration billing](#duration-billing)
1.  [The binding's price](#the-bindings-price)
1.  [Adding a class with exports](#adding-a-class-with-exports)
1.  [Object names and privacy](#object-names-and-privacy)
1.  [Latency and throughput](#latency-and-throughput)
1.  [IPv6 in CF-Connecting-IP](#ipv6-in-cf-connecting-ip)
1.  [Local measurement](#local-measurement)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## The Free plan's quotas

- **Workers requests.** "Accounts on the Workers Free plan have a daily
  request limit of 100,000 requests, resetting at midnight UTC. When a
  Worker exceeds this limit, Cloudflare returns **Error 1027**." A route
  can "Fail open", which "Bypasses the Worker", or "Fail closed", which
  "Returns a Cloudflare `1027` error page." The page says "Last updated Sep
  5, 2026" ([Workers limits][cf-limits]). The pricing page's Free row is
  "100,000 per day", "Last updated Aug 28, 2026" ([Workers
  pricing][cf-pricing]).
- **Durable Objects requests and duration.** Free: "100,000 / day"
  requests and "13,000 GB-s / day" duration ([DO pricing][cf-do-pricing]).
- **SQLite rows and storage.** Free: "Rows reads" "5 million / day", "Rows
  written" "100,000 / day", and "SQL Stored data" "5 GB (total)" ([DO
  pricing][cf-do-pricing]). The limits page gives "Storage per account"
  "5GB (Free)"; its table gives "Storage per Durable Object" "10 GB", while
  its FAQ says "10 GB on Workers Paid, or 1 GB on the Free plan". It says
  "Last updated Jun 1, 2026" ([DO limits][cf-do-limits]).
- **When exceeded, and the reset.** "If you exceed any one of the free
  tier limits, further operations of that type will fail with an error."
  and "Daily free limits reset at 00:00 UTC." The page says "Last updated
  Aug 25, 2026" ([DO pricing][cf-do-pricing]).
- **Stored data stays.** "Durable Objects will be billed for stored data
  until the data is removed. Once the data is removed, the object will be
  cleaned up automatically by the system." And "An empty SQLite database
  consumes approximately 12 KB of storage." ([DO pricing][cf-do-pricing])
- Synthesis: every request that reaches the Worker spends one of the
  100,000 Worker requests, refused or not, so neither option protects that
  quota; each only protects what sits behind it. An exact count adds one
  object request per Worker request, refused ones included, where the
  binding costs none. With today's per-device figures from the TRD (about
  82 rows and 42 object requests for a device spending all 20 lines), one
  more row and request per Worker request moves the rows ceiling from about
  1,200 to about 960 such devices a day (inference). A new object per
  address also keeps about 12 KB until it deletes its data: a flood from
  distinct addresses, bounded by 100,000 requests a day, could add about
  1.2 GB a day against 5 GB total, unless each object cleans up.

[cf-limits]: https://developers.cloudflare.com/workers/platform/limits/

## What a Durable Object request costs

- **One call, one request.** "Every RPC method call on a Durable Objects
  stub is its own RPC session and therefore a single billed request."
  ([DO pricing][cf-do-pricing])
- **Rows read.** "Rows read measure how many rows a query reads (scans),
  regardless of the size of each row." Writes: "Write operations include
  `INSERT`, `UPDATE`, and `DELETE`. Each of these operations contribute
  towards rows written." And "Indexes will add an additional written row
  when writes include the indexed column, as there are two rows written:
  one to the table itself, and one to the index." The page says "Last
  updated Apr 21, 2026" ([D1 pricing][d1-pricing]).
- **The cursor's counters.** `rowsRead` is "The number of rows read so far
  as part of this SQL query. This may increase as you iterate the cursor.
  The final value is used for SQL billing." `rowsWritten` reads the same
  for rows written. The page's example prints 1 after `cursor.next()` on a
  three-row `SELECT *`, then 3 after `toArray()`. It says "Last updated Sep
  21, 2026" ([SQL API][cf-sql]).
- **Where the counts come from.** workerd reads
  `sqlite3_stmt_status(result, LIBSQL_STMTSTATUS_ROWS_READ, 0)` and the
  matching `ROWS_WRITTEN` counter ([workerd SQLite][wd-sqlite]). Its SQLite
  patch adds one to rows written at each `OP_Insert` into a table whose
  cursor `!pC->isEphemeral`, at each `OP_IdxInsert` into an index, and at
  each counted `OP_Delete`; the header says the counter "is the number of
  rows written" ([row count patch][wd-patch]).
- Synthesis: a call that runs one `SELECT` by primary key and writes
  nothing costs one request, about one row read, and zero rows written. An
  `INSERT ... ON CONFLICT (id) DO UPDATE` on `id INTEGER PRIMARY KEY`
  writes one row either way, since that key is the rowid and has no index
  to insert into; a `TEXT PRIMARY KEY` would add an index row on insert
  (inference from the patch). The `CREATE TABLE IF NOT EXISTS` that a new
  object runs first writes rows too, as the
  [local measurement](#local-measurement) found. An address object that
  refuses without writing past its limit keeps a flood's cost to one
  request and one row read each.

[d1-pricing]: https://developers.cloudflare.com/d1/platform/pricing/
[cf-sql]: https://developers.cloudflare.com/durable-objects/api/sql-storage/
[wd-sqlite]: https://github.com/cloudflare/workerd/blob/main/src/workerd/util/sqlite.c++
[wd-patch]: https://github.com/cloudflare/workerd/blob/main/patches/sqlite/0001-row-counts-plain.patch

## Duration billing

- **When it's billed.** "A Durable Object incurs duration charges when it
  is actively executing JavaScript — either handling a request or running
  event handlers — or when it is idle but does not meet the conditions for
  hibernation. An idle Durable Object that qualifies for hibernation does
  not incur duration charges, even during the brief window before the
  runtime hibernates it." ([DO pricing][cf-do-pricing])
- **Shared and fixed-size.** Duration "is shared across all requests
  active on an Object at once", and "Duration billing charges for the 128
  MB of memory your Durable Object is allocated, regardless of actual
  usage." ([DO pricing][cf-do-pricing])
- **What blocks hibernation.** Among the conditions: "No `setTimeout`/
  `setInterval` scheduled callbacks are set", "No in-progress awaited
  `fetch()` exists", and "No request/event is still being processed".
  "After 10 seconds of no incoming request or event, and all the above
  conditions satisfied, the Durable Object will transition into the
  **hibernated** state." Otherwise, "after 70-140 seconds of inactivity
  (no incoming requests or events), the Durable Object will be evicted".
  And "When hibernated, the in-memory state is discarded". The page says
  "Last updated Jul 3, 2026" ([lifecycle][cf-lifecycle]).
- Synthesis: 13,000 GB-s at 128 MB is about 101,600 seconds, or 28 hours,
  of active wall time a day across all objects. An address object with no
  timers and no outbound calls pays only while it handles a request: 100,000
  calls of 20 ms would use about 256 GB-s. A count kept only in memory
  would write nothing but would reset after 10 idle seconds, so a flooder
  who pauses gets a fresh 120; a timer to hold it would bill idle time.

[cf-lifecycle]: https://developers.cloudflare.com/durable-objects/concepts/durable-object-lifecycle/

## The binding's price

- **No price found.** The binding page has no pricing section and says
  "Last updated Apr 23, 2026"; the Workers pricing page doesn't mention rate
  limiting ([binding page][cf-ratelimit], [Workers pricing][cf-pricing]). A
  code search of the cloudflare-docs repo for the binding's pricing found
  nothing.
- **Nothing provisioned.** `namespace_id` is "A string containing a
  positive integer that uniquely defines this rate limiting namespace
  within your Cloudflare account". Bindings sharing it "share the same
  rate limit counters for a given key", and "Rate limiting bindings are not
  currently visible in the Cloudflare dashboard." ([binding
  page][cf-ratelimit])
- **What it promises.** "the Rate Limiting API is permissive, eventually
  consistent, and intentionally designed to not be used as an accurate
  accounting system." And "For each unique key you pass to your rate
  limiting binding, there is a unique limit per Cloudflare location."
  ([binding page][cf-ratelimit])
- Synthesis: treat the binding as free and quota-less, which no page
  confirms. Removing it means deleting the `ratelimits` entry and its call;
  no page describes a namespace to delete, and its ID is a number the
  config picks. Cloudflare's own words match the live check: it's a brake,
  not a count.

## Adding a class with exports

- **One entry per class.** "To define a new Durable Object class, add an
  entry to `exports` keyed by the class name and set `storage` to
  `"sqlite"`." The steps: export the class from the Worker's code, "Add a
  binding for the class (if your Worker needs to access it through `env`)
  and declare the class in `exports`", then `npx wrangler deploy`
  ([exports][cf-exports]).
- **Provisioning.** "Cloudflare provisions a namespace for the class the
  first time you deploy. On subsequent deploys with the same entry, no
  namespace changes are made". "A class that appears only in your code is
  ignored until you declare it in `exports`; Cloudflare does not provision
  a namespace implicitly." The page says "Last updated Sep 22, 2026"
  ([exports][cf-exports]).
- **One flow per Worker.** "Both flows are supported, but a Worker can only
  use one at a time." ([exports][cf-exports]) Free allows "100 (Free)"
  classes per account ([DO limits][cf-do-limits]).
- Synthesis: an address class needs its export in code, an `exports` entry
  with `"type": "durable-object", "storage": "sqlite"`, and a binding under
  `durable_objects.bindings`, as `Device` and `Budget` have; nothing else
  in the docs. Dropping the class later is its own `exports` operation.

[cf-exports]: https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/

## Object names and privacy

- **The name reaches the object.** `name` "returns the name that was used
  to create the `DurableObjectId`", and "The `name` property is also
  available on `ctx.id` inside the Durable Object when the caller uses
  `idFromName()` or `getByName()`." Also "Names longer than 1,024 bytes are
  not passed through to `ctx.id`." The page says "Last updated May 27,
  2026" ([ID][cf-id]).
- **Stored with alarms.** "Alarms created before 2026-03-15 do not have
  `name` stored." When an alarm fires, "`ctx.id.name` holds the same name
  the object was originally accessed with." ([ID][cf-id])
- **The dashboard takes names.** Data Studio asks to "Provide a Durable
  Object identifier, either a user-provided unique name or a
  Cloudflare-generated Durable Object ID." It says "Last updated Sep 15,
  2026" ([Data Studio][cf-studio]). The namespace page says `getByName`
  "obtains a `DurableObjectStub` from a provided name" and nothing on
  storage ([namespace][cf-namespace]).
- Synthesis: a raw address as a name would sit in `ctx.id.name`, in any
  log that prints it, and with any alarm the object sets, so hash it with a
  secret salt first. No page says names are listed in the dashboard, but
  none rules it out.

[cf-id]: https://developers.cloudflare.com/durable-objects/api/id/
[cf-studio]: https://developers.cloudflare.com/durable-objects/observability/data-studio/
[cf-namespace]: https://developers.cloudflare.com/durable-objects/api/namespace/

## Latency and throughput

- **No figure.** "Durable Objects, as with any stateful API, will often add
  response latency as requests must be forwarded to the data center where
  the Durable Object, or state, is located." And "By default, a Durable
  Object is instantiated in a data center close to where the initial
  `get()` request is made." The page says "Last updated Jun 26, 2026"
  ([data location][cf-location]).
- **Hints.** "Only the first call to `get()` for a particular Object will
  respect the hint." And "Hints are a best effort and not a guarantee."
  ([data location][cf-location])
- **Per object.** "An individual Object has a soft limit of 1,000 requests
  per second." ([DO limits][cf-do-limits]) The rules page puts "Complex
  operations (transformation, storage writes)" at "\~200-500 req/sec". It
  says "Last updated Aug 20, 2026" ([rules][cf-rules]).
- **The binding.** "You are not waiting on a network request."
  ([binding page][cf-ratelimit])
- Synthesis: the address object would be born near its first caller,
  which is near that address, so no hint is needed. Only a flooding
  address could reach its own object's few hundred writes a second, where
  queueing slows only the flooder. The added hop's cost has no published
  figure; it needs a measurement.

[cf-location]: https://developers.cloudflare.com/durable-objects/reference/data-location/
[cf-rules]: https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/

## IPv6 in CF-Connecting-IP

- **Unchanged pages.** The headers page still says "Last updated May 5,
  2026" and shows no IPv6 form ([headers][cf-headers]). The WAF rate
  limiting parameters page, "Last updated Apr 29, 2026", has no "IPv6",
  "/64", or "prefix" ([WAF parameters][cf-waf-params]).
- **Against IP keys.** "It is not recommended to use IP addresses or
  locations (regions or countries), since these can be shared by many
  users in many valid cases." Its sample adds: "many users may share a
  single IP, especially on mobile networks or when using privacy-enabling
  proxies" ([binding page][cf-ratelimit]).
- Synthesis: an object per full IPv6 address lets one client rotate within
  its /64 and get a fresh object, and fresh storage, each time. If #98
  picks the exact count, keying IPv6 by /64 is Turn's own choice, not
  Cloudflare's advice.

[cf-headers]: https://developers.cloudflare.com/fundamentals/reference/http-headers/
[cf-waf-params]: https://developers.cloudflare.com/waf/rate-limiting-rules/parameters/

## Local measurement

Run on September 24, 2026, in the relay's Vitest pool
(`@cloudflare/vitest-plugin` 1.2.2, Wrangler 4.136.2), inside a relay
object reached through `runInDurableObject`, reading each statement's
`rowsRead` and `rowsWritten` after `toArray()`. Each table had the
`requests` table's columns, except the one with a text key.

- **A new table.** `CREATE TABLE IF NOT EXISTS` read 1 row and wrote 2.
  Run again on the same object, it read and wrote none.
- **The count.** The `SELECT` of the minute's row read 1 row and wrote
  none, both on the empty table and once it held its row. The upsert,
  `INSERT ... ON CONFLICT (id) DO UPDATE`, read 1 row and wrote 1, both
  the first time and after.
- **A text key.** An `INSERT` into a table keyed by `TEXT PRIMARY KEY`, as
  `free_lines` is, read none and wrote 2; deleting that row read 1 and
  wrote 1.
- **Size.** In the budget's object, whose one table was empty,
  `databaseSize` was 8,192 bytes, and 12,288 once the new table held its
  row.
- Synthesis: a counted request costs 2 rows read and 1 written, a refused
  one 1 read and none written, and an object's first request 2 more
  written for each table it creates. So a new address's object writes 3
  rows on its first request, and a new user's object 6 for its three
  tables before its own count, which the TRD's budget of rows leaves out.
  That Cloudflare counts rows as workerd does locally is inference from
  the row count patch in workerd's source.

## Gaps

- **The binding's price.** No page read states one, or a quota.
- **Rows in production.** The local measurement settles the rows under
  workerd in the test pool, not what Cloudflare bills; they agree only by
  inference from the patch.
- **Cleanup's cost.** Whether an object that never writes keeps any
  storage, and what `deleteAll()` from an alarm costs in rows, isn't said
  beyond "Each `setAlarm()` is billed as a single row written" and
  "Deletes are counted as rows written." ([DO pricing][cf-do-pricing])
- **Latency.** No figure for a Worker-to-object call; not measured, since
  this task ran no live requests.
- **Names.** Whether names appear in the dashboard's lists, logs, or
  analytics wasn't found.
- **Storage per object on Free.** The limits page gives both 10 GB and 1
  GB.
- **Not read.** The workers-sdk changelog for `exports`, the RPC lifecycle
  page, and whether `getByName` takes a `locationHint`.

## See also

- [Relay limits notes, How the binding counts](/docs/research/0046-turn-relay-limits.md#how-the-binding-counts)
- [Relay limits notes, Durable Object requests and rows](/docs/research/0046-turn-relay-limits.md#durable-object-requests-and-rows)
- [Relay limits notes, Hands-on check](/docs/research/0046-turn-relay-limits.md#hands-on-check)
- [Relay limits notes, CF-Connecting-IP and IPv6](/docs/research/0046-turn-relay-limits.md#cf-connecting-ip-and-ipv6)
- [TRD, The relay's storage](/docs/TRD.md#the-relays-storage)
- [TRD, Validation and abuse limits](/docs/TRD.md#validation-and-abuse-limits)

[cf-pricing]: https://developers.cloudflare.com/workers/platform/pricing/
[cf-do-pricing]: https://developers.cloudflare.com/durable-objects/platform/pricing/
[cf-do-limits]: https://developers.cloudflare.com/durable-objects/platform/limits/
[cf-ratelimit]: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/

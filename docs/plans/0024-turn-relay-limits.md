# Turn's relay rate limits and daily Jev budget implementation plan

**Goal:** Close [issue #35][limits-ticket]: the relay limits each app user
ID to 30 requests a minute and each address to 120, answering `429` with
`Retry-After`, and stops calling Jev after 10,000 calls in a UTC day,
answering `jev_unavailable` until midnight UTC.

**Architecture:** Once a request's headers pass, the Worker asks two
Rate Limiting bindings, `USER_LIMITER` keyed by the ID's hash and then
`ADDRESS_LIMITER` keyed by `CF-Connecting-IP`, before it reads a line's
body or reaches any object. A new `Budget` Durable Object, one for the
whole relay, keeps the UTC day's count of calls to Jev. The user's `Device`
object gives the TypeSafe client a `fetch` that takes each attempt,
retries included, from that count, and a refused attempt ends the line as
`spent`, which answers `503 jev_unavailable`. The day's size is a new var,
`JEV_DAILY_CALLS`, which travels in the terms as `FREE_LINES` does.

**Tech Stack:** Cloudflare Workers with the Rate Limiting binding and
SQLite Durable Objects, Wrangler 4.136.2, `@cloudflare/vitest-plugin` 1.2.2
with Vitest 4.1.11, `@typesafe-ai/sdk` 0.6.0, and TypeScript 6.0.3 in a Bun
1.4.2 workspace; graphify; and subagents for research and review.

**Spec:** Issue #35, under the spec in [issue #13][spec], and the TRD's
sections on [validation and abuse limits][trd-limits],
[secrets and configuration][trd-secrets], [the Relay API][trd-api],
[the relay's storage][trd-storage], and [logs and counts][trd-logs]. The
user's goal directive, verbatim: "/ask-matt Complete and close #35. Follow
@docs/references/markdown-style.md (use List instead of TOC) and this
workflow: branch -> /research (10-minute max) -> plan -> implement ->
create small and atomic commits -> push branch -> PR -> code review ->
resolve -> merge -> delete branch."

Contents:

1.  [Global constraints](#global-constraints)
1.  [Skills](#skills)
1.  [Design](#design)
1.  [Verification gate](#verification-gate)
1.  [Tasks](#tasks)

[limits-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/35
[spec]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/13
[trd-limits]: /docs/TRD.md#validation-and-abuse-limits
[trd-secrets]: /docs/TRD.md#secrets-and-configuration
[trd-api]: /docs/TRD.md#relay-api
[trd-storage]: /docs/TRD.md#the-relays-storage
[trd-logs]: /docs/TRD.md#logs-and-counts

## Global constraints

- **#35's acceptance criteria,** verbatim:
  - "The 31st request in a minute from one ID gets 429 with `Retry-After`
    (SEC-3)"
  - "With the daily budget lowered to 3 in a test, the 4th line gets
    `jev_unavailable` (SEC-5)"
  - "Whether the binding works on the Free plan is recorded here"
- **The ticket's body:** "If the binding isn't available on the Free plan,
  the user's object counts requests itself."
- **The ticket's comments.** From #24: `worker/wrangler.jsonc` lacks
  `BUDGET` and `ratelimits`; the log's `Outcome` needs `limited`, and
  `refuse()` pairs each outcome with its error; `rate_limited` is already
  an `ErrorCode`; a spent budget answers `jev_unavailable`; and the one
  call to Jev, in `Device.answer`, counts its one retry toward the budget.
  From #30: `limited` goes in `@turn/shared/relay`, `bun run logs` and the
  credit alert count it among "Other outcomes", and `SIMULATOR_UNLIMITED`
  stays off until the limit lands, unless the September 25 Simulator check
  needs it.
- **Blockers.** #30 is closed.
- **Scope.** The app's side of a `429` is [#48][app-ticket]; turning
  `SIMULATOR_UNLIMITED` on is the September 25 check's.
- **Versions** are pinned exactly, as they are.
- **Code** follows the repo's Prettier settings (single quotes, no
  semicolons, 120 columns, no trailing commas), TypeScript's `strict`, and
  the doc comments of `worker/src/`, wrapped under 120 columns by hand.
- **Markdown** follows
  [the Markdown style guide](/docs/references/markdown-style.md), with a
  `Contents:` list in lazy numbering (`1.  [Heading](#anchor)`) instead of
  `[TOC]`: one H1, prose wrapped at 80 characters (links, tables, headings,
  and code blocks are exempt), a language on every fenced code block, repo
  links as root paths, and no code span broken across lines.
- **Commits** follow Conventional Commits: a lowercase subject, a header of
  at most 100 characters, body lines of at most 100 characters with none
  starting with "word:" or "word #N", and no attribution lines. Stage
  explicit paths only, never `-A` or `.`, and never `skills-lock.json`,
  `.agents/`, or `.claude/`.
- **The worktree.** Other sessions work in the main checkout and in
  sibling worktrees, so this change is built in `../revenuecat-rate-limits`,
  on the branch `relay/rate-limits`.
- **Secrets and identifiers.** The Cloudflare account ID, the account's
  login, and this Mac's public addresses never appear in a command line's
  output, a tracked file, a commit, or a comment. A fail-closed scan reads
  each from a private file and checks every doc, message, and comment
  before it's committed or posted. The app user IDs of live checks are
  fresh random UUIDs made for the check, never a person's, and the
  addresses they send are from 203.0.113.0/24, which RFC 5737 sets aside
  for documentation.
- Absolute dates only. Use they/them for anyone whose pronouns aren't
  stated.

[app-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/48

## Skills

`/ask-matt` sends a ticket from `/to-tickets` to `/implement`, which builds
at agreed seams with `/tdd`, runs the full suite at the end, and closes with
`/code-review`. The directive's steps map to skills:

- **`/research`:** two background agents, capped at 10 minutes, read
  Cloudflare's pages and the RFCs (about seven minutes, a little past the
  cap to trim the note) and the installed SDK, Miniflare, and test plugin
  (about six). Their findings, with a local test of the simulated binding,
  are [the relay limits notes][note-limits].
- **`/tdd`:** each behavior starts from a failing test at the Worker's
  `fetch`, with Jev mocked.
- **`/pr`:** the pull request's body.
- **`/code-review`:** one round, on its Standards and Spec axes, with the
  issue and this plan as the spec, plus a fact-check and bug-hunt agent.

[note-limits]: /docs/research/0046-turn-relay-limits.md

## Design

### Decisions

1.  **The limits come right after the headers.** In `route()`, once
    `readUser` passes and the ID is hashed, the Worker asks `USER_LIMITER`
    with the whole hash as the key and, only if that passes,
    `ADDRESS_LIMITER` with the address. A request over either gets
    `429 rate_limited` before a line's body is read or any object is
    reached, so it costs no object request, no body read, and no call.
    Invalid headers still get `400` first, since there's no ID to count,
    and reach no object either.
1.  **The ID's limit, then the address's.** A request the user's own limit
    refuses doesn't count against the address, so one user past 30 can't
    use up the 120 that others on a shared mobile address rely on. IDs
    minted on one address each pass their own limit and meet the address's
    after 120.
1.  **The bindings as the TRD has them.** `USER_LIMITER`, namespace
    `"1001"`, with `"simple": { "limit": 30, "period": 60 }`, and
    `ADDRESS_LIMITER`, namespace `"1002"`, with a limit of 120, in
    `worker/wrangler.jsonc`. The namespaces differ, since bindings that
    share one share counts ([relay limits notes][note-sim]).
1.  **The address as Cloudflare gives it.** The key is `CF-Connecting-IP`,
    unhashed, which Cloudflare sets on requests from clients and which the
    relay stores and logs nowhere. A request without it shares the key `""`.
1.  **`Retry-After: 60`.** The binding answers only `success`, so the relay
    can't know when a window ends; the whole period is enough however the
    windows are aligned ([relay limits notes][note-retry]), and 60 seconds,
    the longest period a binding can have, stays enough if the period
    changes to 10. The body stays
    `{ "error": "rate_limited" }` (SEC-4). The log's outcome is `limited`,
    with the user's prefix and no `seq`, since the body is never read.
1.  **One object keeps the day's count.** `Budget`, a SQLite Durable
    Object reached with `getByName('jev-calls', { locationHint: 'wnam' })`,
    creates one table in its constructor:

    ```sql
    CREATE TABLE IF NOT EXISTS calls (id INTEGER PRIMARY KEY CHECK (id = 1), day TEXT NOT NULL, count INTEGER NOT NULL);
    ```

    Its `take(limit)` runs in one `transactionSync()`, as `Device.claim`
    does, with no `await`: below the limit on the current UTC day, it
    writes the count plus one and answers true;
    otherwise it answers false and writes nothing. A new UTC day starts
    again from 0, so the budget comes back at midnight UTC with no alarm.
    One object for the relay is the global counter Cloudflare warns about,
    harmless at judging's volume ([services notes][svc-abuse]).

1.  **Each attempt takes a call.** For each line, the user's object builds
    its TypeSafe client with a `fetch` that asks the budget before each
    attempt, the SDK's retry included, and then calls `globalThis.fetch`
    ([relay limits notes][note-sdk]). Refused, the `fetch` aborts a signal
    the call also listens to and throws, so the SDK throws
    `APIUserAbortError` at once instead of retrying. A line refused before
    any attempt reached Jev ends as `spent`; one whose retry is refused ends
    as its first attempt did, `failed` with Jev's status. The wait for the
    budget ends with the attempt's own signal, so a slow answer can't hold
    a line past its 2.5 seconds (STATE-2). With the budget at 3, three
    answered lines use it up, and the 4th is refused before any call
    (SEC-5).
1.  **A spent budget answers as a busy Jev does.** `spent` answers
    `503 jev_unavailable`, with no `Retry-After`, exactly as a failed call
    does (SEC-4, SEC-5). Like `failed`, it releases a free line's claim, so
    a refused line doesn't use a free line (PAY-1). Its own outcome lets
    the logs tell a spent budget from Jev failing, and it logs no time in
    Jev, since no call was made.
1.  **The day's size is a var.** `JEV_DAILY_CALLS`, committed as
    `"10000"`, is read at every request like `FREE_LINES`, through one
    check shared by both: anything but a whole number throws, which answers
    `500 internal`. The Worker passes it to the user's object in the terms,
    since a test's changed vars reach the Worker's handler but not the
    object's `env`; that's how a test lowers it to 3.
1.  **Every line meets both.** A Simulator request that skips the
    free-line count still meets the rate limits and takes its calls from
    the budget, so both bound `SIMULATOR_UNLIMITED`, and the TRD's "will
    bound that" becomes present tense. The replay script sends every line
    as one Simulator user, so a request that would be its 30th in 60
    seconds waits until it isn't.
1.  **The tests.** The limits' tests use the configured bindings with a
    fresh ID per test and an address of their own, and wait for the next
    minute when fewer than 5 seconds of this one are left, since every
    window rolls over on the minute. The other tests keep the shared ID
    and send no address: each stays under 30 requests an ID and 120 in
    all, and `reset()` clears the counts after it
    ([relay limits notes][note-sim]). The budget's tests lower
    `JEV_DAILY_CALLS` through `send`, and one moves `Date` past midnight
    UTC with `vi.setSystemTime`, which reaches the objects, while the
    limiter keeps real time. A spy on `Budget.prototype.take`, which the
    objects share with the tests, stands in for a slow budget and counts
    the budget's calls. The helpers hold another user's headers, the
    Simulator's, the log's time, and a line posted from given headers, and
    `expectRefused` takes the error a refusal expects.
1.  **Every guard is mutated once.** Before the pull request, each limit,
    the order of the two, the `Retry-After`, the budget's comparison and
    day, the abort, and the release of a claim are broken one at a time,
    and a test must fail for each.
1.  **Where it shows.** `Outcome` in `@turn/shared/relay` gains `limited`
    and `spent`. `bun run logs` lists both among the other outcomes, which
    the relay's README says, and the credit alert is unchanged.
1.  **The live check.** After the review, the reviewed head is deployed
    with `wrangler deploy`, and a script, printing only statuses and
    `Retry-After`, sends:
    - 31 configuration requests from one fresh ID, starting in a minute's
      first seconds: which request first gets `429`, and its `Retry-After`;
    - 121 configuration requests from this Mac, across five fresh IDs with
      at most 25 each, each carrying a different made-up
      `CF-Connecting-IP`: a `429` by the 121st shows that Cloudflare
      replaces a client's header and the address limit holds;
    - one line from a fresh ID, which Jev answers.

    Each part starts in a new minute, so an address that part 2 uses up
    can't refuse part 3's line. Whether the deploy accepts `ratelimits` on
    the Free plan, and whether the 31st request gets `429`, is recorded on
    #35 and in the note's hands-on check. If the binding isn't available on
    Free, the user's object counts requests itself, as the ticket says, in
    new commits before the merge.

1.  **The TRD.** The architecture's order, the storage's `Budget` table,
    the Relay API's `429` and `503` rows, the configuration table and
    `wrangler.jsonc`, the committed file's bullet, the limits' rate and
    budget bullets, the log's outcomes, the Simulator sentence, and the
    relay's tests (SEC-5), and the replay's pace, each section in its own
    commit.

[note-sim]: /docs/research/0046-turn-relay-limits.md#the-local-simulation
[note-retry]: /docs/research/0046-turn-relay-limits.md#retry-after-for-a-429
[note-sdk]: /docs/research/0046-turn-relay-limits.md#the-sdks-attempts
[svc-abuse]: /docs/research/0024-turn-services.md#limiting-abuse-of-the-free-lines

### Review round 1

One `/code-review` round found 8 Standards, 5 Spec, and 7 fact-check
problems; the decisions above now hold its fixes. It proved that a slow
budget object held a line past its 2.5 seconds, that a refused retry hid
Jev's failure behind `spent`, that the replay script would meet the new
limit, and that one test passed without the budget. Kept, with reasons:

- **The numbers,** which #95 also took: its session moved to 0025 and
  0047, and #95 merged with them.
- **`freeLines` and `dailyCalls` side by side:** they travel together only
  from `readConfig` to `termsFor`, as the design chose.
- **Fresh IDs for the count tests:** they stay a few requests below the
  shared ID's 30, and its comment now says to stay under it.
- **The Free plan's answer:** the live check gives it, after the review, on
  #35, in the note, and in the TRD.

### Rejected alternatives

- **Counting requests in the user's object** (the ticket's fallback):
  exact, but every request, limited or not, would cost an object request
  and a row written, and it can't limit an address.
- **The seconds to the next minute as `Retry-After`:** they fit the local
  simulation's windows, but production's alignment is undocumented.
- **A `Retry-After` to midnight UTC on a spent budget:** SEC-5 has it
  answer as a busy Jev does, which sends none.
- **The limits after a line's body:** they'd read up to 16 KB of a request
  that's refused anyway.
- **Checking the budget once in the Worker:** it misses the SDK's retry,
  which SEC-5 counts.
- **Reserving two calls per line:** with a budget of 3, the 2nd line would
  already fall short.
- **The relay's own retry, with `maxRetries: 0`:** it would copy the SDK's
  rules for what retries.
- **A `fetch` that only throws:** the SDK retries a connection error after
  its backoff, so a refused line would wait about half a second and ask
  the budget twice.
- **Grouping IPv6 addresses by /64:** no Cloudflare page recommends it,
  the ticket says each address, and the budget is the backstop for Jev's
  credits.
- **Hashing the address:** the relay stores and logs it nowhere, so a hash
  would hide it from no one.
- **Counting `spent` among the failures:** it's the budget working, not
  something broken, as the README defines failures.
- **Standing in for the limiters in the other tests:** the committed
  bindings can run in every test, since `reset()` clears their counts.
- **One row per day:** only the current day's count is ever read.

### Out of scope

- The app's handling of `429` and `Retry-After` (#48).
- An alert when the budget is spent; the credit alert stays as #32 built
  it.
- Turning `SIMULATOR_UNLIMITED` on, which the September 25 check decides.
- Workers Paid.

## Verification gate

Every code task runs these from the root before committing, and each must
exit 0:

```shell
setopt pipefail
bun install --frozen-lockfile
bun run test
bun run typecheck
bun run lint
```

The gate also fails on any line over 120 columns in `worker/` or
`shared/`, and it never pipes a check into `tail`.

Markdown files run the gate from [the plan-storage plan][docs-gate]:
Prettier, `check_md.py` with `--contents`, and `fact_scan.py` for new prose,
plus a check that no code span breaks across lines and the identifier scan.

[docs-gate]: /docs/plans/0009-plan-storage.md#verification-gate

## Tasks

Every subagent prompt carries the repo rule: run `graphify query "<question>"`
before grepping or reading repo files. No subagent sends the user's email
address or any personal identifier to an API, runs `bun run eval`, deploys,
or writes a repo file its prompt doesn't name or runs git.

### Task 1: Research notes

Two background agents wrote the findings in
`docs/research/0046-turn-relay-limits.md`, and the local test added its
own; it passed the docs gate and was committed.

### Task 2: This plan

- [ ] **Step 1: Run the docs gate, then commit** as
      `docs(plan): add the plan for the relay's limits and budget`.

### Task 3: The rate limits

**Files:** create `worker/test/limits.test.ts`; modify
`worker/wrangler.jsonc`, `worker/src/index.ts`, and `shared/src/relay.ts`.

- [ ] **Step 1: Write the failing tests:** 30 requests from a fresh ID
      answer, and the 31st, a line, gets `429 rate_limited` with
      `Retry-After: 60`, reaching neither the object nor Jev, while another
      ID on the same address still answers; the 121st request from one
      address, across IDs, gets `429`; a user's refused requests don't
      count against their address; and the log says `limited`.
- [ ] **Step 2: See them fail,** add the bindings and the check, see them
      pass, run the gate, and commit as
      `feat(relay): limit the requests of each ID and address`.

### Task 4: The daily budget

**Files:** create `worker/src/budget.ts` and `worker/test/budget.test.ts`;
modify `worker/wrangler.jsonc`, `worker/src/device.ts`,
`worker/src/config.ts`, `worker/src/index.ts`, `shared/src/relay.ts`, and
`worker/test/config.test.ts`.

- [ ] **Step 1: Write the failing tests:** with `JEV_DAILY_CALLS` at 3,
      three lines answer and the 4th gets `503 jev_unavailable` with no
      call to Jev; a retry takes a call; a retry past the budget ends its
      line; users share one budget; the next UTC day starts again; a
      refused line keeps its free line; a Simulator line takes a call; the
      log says `spent`; and a `JEV_DAILY_CALLS` that isn't a whole number
      answers `500 internal`.
- [ ] **Step 2: See them fail,** write the object, the `fetch`, and the
      var, see them pass, run the gate, and commit as
      `feat(relay): stop calling Jev after 10,000 calls a UTC day`.

### Task 5: Mutations and the README

- [ ] **Step 1: Mutate each guard** in the design's list, one at a time,
      and see a test fail for each; add a test for any that survives.
- [ ] **Step 2: Add `limited` and `spent`** to the README's other outcomes,
      run the docs gate, and commit.

### Task 6: The TRD

- [ ] **Step 1: Edit** the TRD's sections as the design's last decision
      says, run the docs gate, and commit each section on its own.

### Task 7: Graph, pull request, review, deploy, and merge

1.  Run `graphify update .` and commit `graphify-out/` as
    `chore(graphify): refresh the graph after the relay's limits`.
1.  Re-read #35, push the branch, and open the pull request with the `/pr`
    template and "Closes #35".
1.  Run one `/code-review` round against `main`, with the issue and this
    plan as the spec, and a fact-check and bug-hunt agent; post it as a PR
    comment, fix what it confirms in one commit per fix or group of related
    fixes, and post a resolution comment.
1.  Deploy the reviewed head, run the live check, record it in the note's
    hands-on check, and post the results on the pull request.
1.  List `docs/plans` and `docs/research` on `origin/main`, on open pull
    requests, and on peer branches, renumber if another claims these
    numbers, then rebase-merge, delete the branch locally and on the
    remote, and remove the worktree.
1.  Post the evidence on #35, with whether the binding works on the Free
    plan, tick its criteria, and close it.

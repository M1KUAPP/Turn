# Turn's free lines, log summary, and credit alert implementation plan

**Goal:** Close [issue #30][count-ticket], [issue #31][script-ticket], and
[issue #32][alert-ticket]: the relay counts 20 free lines per user and
checks `listen` past them, a script turns a day of the relay's logs into
counts and latencies, and an alert reaches the team when the logs show
Jev's credits running out or spent fast.

**Architecture:** The user's `Device` object gains the TRD's two tables:
it claims a line in one transaction, releases the claim if Jev fails, and
past the free lines asks RevenueCat through a new
`worker/src/entitlement.ts`, caching the answer. The Worker passes it the
app user ID and the terms from the vars, and asks it for the free lines
left. Three files in `worker/scripts/` read Workers Logs through
Cloudflare's telemetry API and summarize them; a scheduled GitHub Actions
workflow runs one of them and opens an issue for the team when it fires.

**Tech Stack:** Cloudflare Workers with a SQLite Durable Object, Wrangler
4.136.2, `@cloudflare/vitest-plugin` 1.2.2 with Vitest 4.1.11, and
TypeScript 6.0.3 in a Bun 1.4.2 workspace; RevenueCat's REST API v2 and
`@revenuecat/cli` 0.1.3; Cloudflare's telemetry query API; GitHub Actions
and the `gh` CLI; graphify; and subagents for research and review.

**Spec:** Issues #30, #31, and #32, under the spec in [issue #13][spec],
and the TRD's sections on [the relay's storage][trd-storage],
[the Relay API][trd-api], [the entitlement check][trd-check],
[secrets and configuration][trd-secrets], [failure modes][trd-failures],
and [logs and counts][trd-logs]. The user's goal directive, verbatim:
"/ask-matt Complete and close #30, #31, and #32. Follow
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

[count-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/30
[script-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/31
[alert-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/32
[spec]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/13
[trd-storage]: /docs/TRD.md#the-relays-storage
[trd-api]: /docs/TRD.md#relay-api
[trd-check]: /docs/TRD.md#the-relays-entitlement-check
[trd-secrets]: /docs/TRD.md#secrets-and-configuration
[trd-failures]: /docs/TRD.md#failure-modes
[trd-logs]: /docs/TRD.md#logs-and-counts

## Global constraints

- **#30's acceptance criteria,** verbatim:
  - "After 20 answered lines, the 21st gets 402 `paywall` (PAY-1, STATE-4)"
  - "25 simultaneous lines from one ID count exactly 20, and ten copies of
    one line ID count once (PAY-1)"
  - "A failed Jev call doesn't use a free line (PAY-1)"
  - "A fresh ID's 21st line with no purchase gets 402; after a headless
    Test Store purchase through RevenueCat's CLI, a line with `refresh`
    gets Jev's answer (PAY-7)"
  - "Resending a used line ID with new text gets 409 (SEC-6)"
  - "With the Simulator switch on, a request marked `simulator` isn't
    counted (PAY-9)"
  - "RevenueCat failing past the free lines gives the cached yes or 503,
    never 402"
- **#31's acceptance criteria,** verbatim:
  - "Run it on a day's logs; the counts match the log lines (METRIC-2)"
  - "Its usage is documented beside the relay"
- **#32's acceptance criteria,** verbatim:
  - "Lower the alert's level and see it fire (AVAIL-2)"
  - "Who receives it is recorded here"
- **The tickets' comments.** #30's: `Device.answer` already receives the
  whole `LineRequest`; `readConfig` still takes `freeLinesLeft` from
  `FREE_LINES`; `Outcome` and `codes` need `paywall` and an outcome for
  `409`; `readUser` must return the build too; and `RC_PROJECT_ID`,
  `RC_ENTITLEMENT_ID`, and `SIMULATOR_UNLIMITED` aren't in
  `wrangler.jsonc` yet. #31's: the log line's fields, and that Wrangler's
  login can't read Workers Logs, so the script needs an API token, whose
  first run also shows that the relay's lines stay in Workers Logs with
  invocation logs off.
- **Blockers.** #15, #24, and #14 are closed. #79, which #32 waited on
  for TypeSafe's console, was closed as not planned, so the alert can't
  rest on a console setting.
- **Scope.** Rate limits, `429`, the daily budget, and the `limited`
  outcome are [#35][limits-ticket]; the app's side of the count, the
  paywall, and `refresh` is [#48][app-ticket] and the paywall tickets.
- **Versions** are pinned exactly, and the workflow's actions by commit.
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
  sibling worktrees, so this change is built in
  `../revenuecat-relay-paywall`, on the branch `relay/paywall-logs-alert`.
- **Secrets and identifiers.** RevenueCat's secret key, the logs token,
  and the account ID never appear in a command line, an output, a tracked
  file, a log, or a comment: scripts read them from the environment, and
  `gh secret set` reads them from standard input. Tests use made-up
  values. The app user IDs of live checks are fresh random UUIDs made for
  the check, never a person's. The RevenueCat project ID and the
  entitlement's object ID, which #15 shared with the team and which grant
  nothing alone, are committed as vars, as the TRD lists them.
- Absolute dates only. Use they/them for anyone whose pronouns aren't
  stated.

[limits-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/35
[app-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/48

## Skills

`/ask-matt` sends a ticket from `/to-tickets` to `/implement`, which builds
at agreed seams with `/tdd`, runs the full suite at the end, and closes with
`/code-review`. The directive's steps map to skills:

- **`/research`:** three background agents, capped at 10 minutes, wrote
  [the free lines notes][note-count] in about four minutes,
  [the relay logs notes][note-logs] in about four, and
  [the credit alert notes][note-alert] in about six. A spike in this
  worktree then ran the claim in a Durable Object under the test pool: 25
  simultaneous lines claimed exactly 20, ten copies of one line ID claimed
  once, a failed call released its claim, and `reset()` from
  `cloudflare:test` emptied the object between tests.
- **`/tdd`:** each behavior starts from a failing test at its seam: the
  Worker's `fetch` for the count and the check, and the exported functions
  of `worker/scripts/` for the summary and the alert.
- **`/pr`:** the pull request's body.
- **`/code-review`:** one round, on its Standards and Spec axes, with the
  three issues and this plan as the spec, plus a fact-check agent.

[note-count]: /docs/research/0039-turn-free-lines.md
[note-logs]: /docs/research/0040-turn-relay-logs.md
[note-alert]: /docs/research/0041-turn-credit-alert.md

## Design

### Decisions

1.  **The count lives in the user's object.** The object creates the TRD's
    `free_lines` and `entitlement` tables in its constructor, each
    `IF NOT EXISTS`, as Cloudflare's example does
    ([free lines notes][note-sqlite]). The claim runs in
    `transactionSync()` before the object's first `await`: a line ID
    already in `free_lines` is a duplicate; below `FREE_LINES` rows, the ID
    is inserted and the line is free; otherwise the line is paid.
1.  **Only answered lines count.** After `failed` or `credits`, the object
    deletes the line's own row, only for a free line, so a failed call doesn't
    use a free line (PAY-1) and a failing paid copy of a line ID can't delete a
    free copy's claim. A duplicate gets `409 duplicate` and no call to Jev
    (SEC-6). Only free lines keep their IDs, as the TRD's table does.
1.  **A paid line needs `listen`.** `worker/src/entitlement.ts` asks
    `GET /v2/projects/{project_id}/customers/{customer_id}/active_entitlements`
    with `RC_PROJECT_ID`, the app user ID through `encodeURIComponent`, and
    `RC_SECRET_KEY` as a bearer token. A yes is an item whose
    `entitlement_id` is `RC_ENTITLEMENT_ID` and whose `expires_at` is null
    or ahead. A no is a `200` without one, or a `404` whose `type` is
    `resource_missing` ([free lines notes][note-endpoint]). Anything else
    is unknown: another status, a body out of the spec's shape (a `200`
    whose `object` isn't `list` included), a timeout,
    a network error, or an unset var, since an empty project ID would make
    a path RevenueCat could answer with a `404`. The one page of 20 items
    is enough, since `listen` is the project's only entitlement.
1.  **The cache.** The object keeps the last answer in `entitlement`: a
    yes for 24 hours and a no for 1 minute. A line with `refresh` skips a
    no under a minute old unless a refresh already did within the last
    minute. The object records a refresh's time only when its check
    answered, so a check that fails doesn't use up the purchase's refresh,
    and such a refresh leaves the no it skipped stale, so the next line
    asks again. Of two checks that finish out of order, the one that
    started later stays. A free line with `refresh` asks RevenueCat
    alongside Jev, so a purchase made with free lines left shows as null.
1.  **Unknown is never a 402.** With an unknown answer, a cached yes of
    any age still answers; otherwise the line gets `503 jev_unavailable`,
    logged as `unverified`, and nothing is cached. The app ranks such a
    line on the phone, as it does when Jev fails, so no new error code is
    needed.
1.  **Half a second for RevenueCat.** The check runs once a day for an
    entitled user and at most once a minute for one who isn't. Its 500 ms
    come out of the line's 2.5 seconds, and Jev gets what's left, so every
    line stays within the phone's 3 seconds; a slower RevenueCat costs that
    line a `503`, which the phone ranks at once instead of waiting.
1.  **The Worker passes what the object can't know.** `readUser` returns
    the build with the ID. `answer(line, user, terms)` takes the app user
    ID, for RevenueCat's path only and never stored, and the terms:
    `FREE_LINES` and whether the request skips the count. The object's
    name stays the salted hash, so a stored row can't be traced to an ID.
1.  **The Simulator switch.** `SIMULATOR_UNLIMITED`, on only as `"true"`
    and committed as `"false"` until the check on September 25 decides it,
    lets a request with `X-Turn-Build: simulator` skip the claim and the
    check (PAY-9). Its answers and configuration carry
    `freeLinesLeft: null`, as an entitled user's do, so the Listen button
    never shows a count that doesn't fall.
1.  **The free lines left.** `GET /v1/config` asks the object: null when
    the request skips the count or the cached answer is a yes, and
    otherwise `FREE_LINES` less the rows, never below 0. An answered line
    carries the same number after its claim. `Config.freeLinesLeft` in
    `@turn/shared/relay` becomes `number | null`.
1.  **Codes and outcomes.** `paywall` answers `402 paywall`, `duplicate`
    `409 duplicate`, and `unverified` `503 jev_unavailable`. None of them
    calls Jev, so their log line has no `ms.jev`. `JevReply` becomes
    `LineReply`, since it now says how a line ended, not only Jev's part.
1.  **Vars.** `RC_PROJECT_ID` is `proj9f033172`, `RC_ENTITLEMENT_ID` is
    `entl6b65cc982a`, as #15 recorded them, and `SIMULATOR_UNLIMITED` is
    `"false"`, all in `wrangler.jsonc` beside the others.
1.  **Tests.** The fetch mock routes by host: `mockJev` and a new
    `mockRevenueCat` queue responses per API, so a check between two Jev
    calls takes RevenueCat's. `reset()` after each test empties every
    object, since the count would otherwise carry across tests, and
    `lineRequest()` makes a new line ID each time. A test ages the cache by
    editing its row with `runInDurableObject`, which leaves the SDK's
    timeouts alone, as a fake clock wouldn't. A mocked reply receives the
    call's options, so one can hang until its signal aborts it.
1.  **The live check (PAY-7, SEC-6).** After the review, the reviewed head
    is deployed. For a fresh ID: 20 lines are answered and the 21st gets
    `402`. Within the minute that no stays cached,
    `rc customers simulate-purchase` from `@revenuecat/cli` 0.1.3, logged
    in by the user, buys `turn_listen` for that ID
    ([free lines notes][note-cli]), a plain line still gets `402`, and a
    line with `refresh` gets Jev's answer, which shows `refresh` doing the
    work. One of the first 20 line IDs, sent again with new text, gets
    `409`, since only free lines keep their IDs. That's about 22 billed Jev
    calls.
1.  **Four files for the logs.** `worker/scripts/telemetry.ts` reads the
    relay's lines for a time range through
    `POST /accounts/{account_id}/workers/observability/telemetry/query`, in
    the `events` view, 2,000 at a time, with `dry: true`, passing the last
    event's `$metadata.id` as `offset` until a page comes back short
    ([relay logs notes][note-query]), and stops with an error when a full
    page brings no event it hasn't read. It keeps each event, told apart by
    its ID and its request ID, since events logged in the same millisecond
    share an ID, whose `source`
    is an object with a string `outcome`. `worker/scripts/summary.ts`
    counts; `worker/scripts/logs.ts` is the command, `bun run logs`; and
    `worker/scripts/flags.ts` reads both commands' flags, since the Workers
    runtime that runs the tests doesn't implement `node:util`'s
    `parseArgs`.
1.  **What it prints (METRIC-2).** For a UTC day, `--day`, yesterday unless
    given: the lines read beside a `count` calculation's total, since the first
    live query showed that a page's own count is only its size; lines answered;
    paywall responses; failures, which are `failed`, `credits`, `unverified`,
    and `internal`; each other outcome by name; the median and 95th percentile,
    by nearest rank, of `ms.total` and `ms.jev` over answered lines; and the
    day's input tokens.
1.  **The logs check (METRIC-2).** After the live checks, run
    `bun run logs` on September 23, 2026, and match its counts against the
    same day's raw events, read apart from the script, and against the
    live check's known lines. Check too, as #31's comment asks, that each
    request made one line and that no line holds text.
1.  **The token.** `TURN_CF_LOGS_TOKEN` is an API token with the account
    permission Workers Observability at Edit, which the API calls "Workers
    Observability Write" ([relay logs notes][note-token]), and
    `TURN_CF_ACCOUNT_ID` names the account. Both come from the
    environment. They aren't Wrangler's names, so a shell that sets them
    doesn't change the account or the token Wrangler deploys with.
1.  **Usage beside the relay.** A new `worker/README.md` documents the
    command, its token, and the alert.
1.  **Types.** The two commands use `process` and `node:fs`, so
    `worker/scripts/tsconfig.json` checks `worker/scripts/` with Node's
    types, from `@types/node` 26.6.1, the version `@turn/eval` pins, and the
    relay's `typecheck` runs it too. Every module, both commands' `main`
    included, runs in the Workers pool's tests; only `--out`'s file write
    doesn't. The scripts import `@turn/shared` for types alone, so they run
    without installing packages.
1.  **The alert reads the logs.** TypeSafe publishes no balance endpoint,
    no balance in its answers, and no low-balance alert, and its console's
    public page names none ([credit alert notes][note-typesafe]). So the
    alert reads the relay's logs, where a line that ran out is `credits`,
    and estimates spend from `inputTokens` at `jev-1.13.0`'s $0.042 per
    million input tokens.
1.  **When it fires.** When any line in the window ran out of credits, or
    the window's estimated spend passes the level, `JEV_ALERT_DOLLARS`, a
    repository variable, or the script's own $0.50: about 12 million input
    tokens, far above a day of judging, and reached only by heavy use or
    abuse. The window runs from 24 hours ago, or from when the last alert
    issue was closed if that's later, so a handled alert doesn't fire again
    from the same lines. Without a balance, a slow drain shows only when a
    line runs out, which the issue's body says.
1.  **How it reaches the team.** `.github/workflows/credit-alert.yml` runs
    `worker/scripts/credits.ts` every 3 hours at minute 17, and on demand
    with a `level` input. When it fires and no alert issue is open, it
    opens "Jev's credits need attention", assigned to `kymil4`,
    `WhiteAvocad0`, and `AlaskanTuna`, the repository's three
    collaborators; GitHub notifies assignees by their own settings
    ([credit alert notes][note-github]). It asks for
    `permissions: { contents: read, issues: write }`, since the
    repository's default is read. Eight short runs a day use about 240 of
    the organization's 2,000 free minutes a month while the repository is
    private. It runs on `ubuntu-24.04`, with `actions/checkout` v7.0.1 and
    `oven-sh/setup-bun` v2.2.0 pinned by commit. A failing `gh` fails the
    run, and if an assignee can't be assigned, the issue opens without
    assignees.
1.  **The alert's test (AVAIL-2).** After the merge, since a workflow must
    be on `main` to run on demand, run it with `level` 0 within a day of the
    live checks, which spent more than $0, so it opens the issue. Then
    close it, and record on #32 the receivers and who confirmed getting
    it.
1.  **Secrets for the workflow.** `TURN_CF_LOGS_TOKEN` and
    `TURN_CF_ACCOUNT_ID` go to the repository's Actions secrets through
    `gh secret set`'s standard input, from the user's shell.
1.  **The TRD** follows the code: the storage section's claim, cache, and
    refresh rules; `Config`'s null; the error table's `503` for an
    unverified line; the entitlement check's 500 ms and unknown answers;
    the new vars and the logs token; the failure modes' RevenueCat row; and
    the logs section's outcomes, script, and alert.

[note-sqlite]: /docs/research/0039-turn-free-lines.md#sqlite-in-the-device-object
[note-endpoint]: /docs/research/0039-turn-free-lines.md#the-active-entitlements-endpoint
[note-cli]: /docs/research/0039-turn-free-lines.md#revenuecats-cli-and-a-headless-purchase
[note-query]: /docs/research/0040-turn-relay-logs.md#the-telemetry-query-api
[note-token]: /docs/research/0040-turn-relay-logs.md#the-api-tokens-permission
[note-typesafe]: /docs/research/0041-turn-credit-alert.md#typesafes-balance-alerts-and-billing
[note-github]: /docs/research/0041-turn-credit-alert.md#channels-that-could-carry-the-alert

### Review round 1

One `/code-review` round found 15 Standards, 8 Spec, and 15 fact-check
problems; the decisions above now hold its fixes. It proved two races in
the object, a failing paid copy deleting a free copy's claim and an older
no covering a newer yes, and found that a failed refresh left a false
`402`, that a line past the free lines could take the phone's whole 3
seconds, and that a failing `gh` ended the alert's run green. Kept, with
reasons:

- **Building the terms in each route:** the configuration is read only
  after a line's own checks (SEC-2), so the two routes can't share one.
- **A copy of `isRecord` in the scripts:** they import no package at run
  time, so the workflow needn't install.
- **A mistyped `RC_PROJECT_ID`:** RevenueCat's `404` for a missing project
  isn't told apart from one for a missing customer, so the live check
  proves the committed ID instead.
- **RevenueCat lagging a purchase:** the once-a-minute refresh stays, as
  the TRD has it; a note for #48 says so.
- **Latency over answered lines only:** it's the latency of an answer, and
  Jev's timeouts show among the failures.

### Rejected alternatives

- **A new error code for RevenueCat's failure:** the app would need a case
  that does what `jev_unavailable` already does.
- **Caching an unknown answer:** a blip would refuse lines for a minute.
- **Storing the app user ID in the object:** its name is a salted hash so
  a stored row can't be traced to an ID.
- **A fake clock for the cache's ages:** it would also move the timeouts
  in the shared isolate.
- **A `calculations` query:** one call, but its key names and sampling
  are unconfirmed, and events give counts that can be matched line by
  line.
- **Wrangler's login for the logs:** it has no observability scope.
- **TypeSafe's console:** it publishes no alert, needs a login, and #79
  was closed as not planned.
- **A running balance:** the logs last 3 days on Free, so a balance needs
  state outside them, such as a Durable Object or a trail of comments;
  the window's spend and the `credits` backstop need none.
- **Email from a Worker, or Cloudflare Notifications:** the first needs a
  domain with Email Routing and verified receivers, and the second has
  nothing for Workers on Free.
- **An hourly schedule:** 720 of the 2,000 minutes a month.

### Out of scope

- Rate limits, `429`, the daily budget, and `limited` (#35).
- The app's requests, count display, paywall, and `refresh` (#48 and the
  paywall tickets).
- The daily availability check during judging (AVAIL-1).

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

Markdown files run the gate from [the plan-storage plan][docs-gate]:
Prettier, `check_md.py` with `--contents`, and `fact_scan.py` for new prose,
plus a check that no code span breaks across lines.

[docs-gate]: /docs/plans/0009-plan-storage.md#verification-gate

## Tasks

Every subagent prompt carries the repo rule: run `graphify query "<question>"`
before grepping or reading repo files. No subagent sends the user's email
address or any personal identifier to an API, and none writes a repo file
its prompt doesn't name or runs git.

### Task 1: Research notes

Three background agents wrote `docs/research/0039-turn-free-lines.md`,
`0040-turn-relay-logs.md`, and `0041-turn-credit-alert.md`. They passed
the docs gate once three lines were rewrapped and three link definitions
moved, and were committed one at a time.

### Task 2: This plan

- [ ] **Step 1: Run the docs gate, then commit** as
      `docs(plan): add the plan for free lines, logs, and the alert`.

### Task 3: The test helpers

**Files:** modify `worker/test/setup.ts`, `worker/test/helpers.ts`, and
`worker/test/logs.test.ts`.

- [ ] **Step 1: Route the fetch mock by host,** add `mockRevenueCat`, make
      `lineRequest()` draw a new line ID, and `reset()` after each test.
      The suite stays green, then commit as
      `test(relay): route mocked calls by API and reset objects`.

### Task 4: Counting free lines

**Files:** create `worker/test/count.test.ts`; modify `worker/src/device.ts`,
`worker/src/index.ts`, `worker/src/request.ts`, and
`shared/src/relay.ts`.

- [ ] **Step 1: Write the failing tests:** answers count down from 19;
      the 21st line gets `402 paywall` while RevenueCat has never seen the
      ID; 25 simultaneous lines answer exactly 20; ten copies of one line
      ID answer once and get nine `409 duplicate`; a used line ID with new
      text gets `409` and no call to Jev; a failed or out-of-credits call
      leaves the count as it was; and `GET /v1/config` shows the count.
- [ ] **Step 2: See them fail,** write the tables, the claim, the release,
      and the object's `freeLinesLeft`, see them pass, run the gate, and
      commit as `feat(relay): count 20 free lines per user`.

### Task 5: Checking the entitlement

**Files:** create `worker/src/entitlement.ts` and
`worker/test/entitlement.test.ts`; modify `worker/src/device.ts`,
`worker/src/index.ts`, and `worker/wrangler.jsonc`.

- [ ] **Step 1: Write the failing tests:** past the free lines, an active
      `listen` answers with `freeLinesLeft` null, from the right URL and
      key; an expired one, another entitlement, or a `404` gets `402`; a
      no is cached for a minute and a yes for a day; `refresh` skips a
      fresh no once a minute; and every failure (`500`, `503`, `429`,
      `401`, `403`, another `404`, a body out of shape, a network error, a
      timeout, an unset var) gets `503 jev_unavailable` with no cached yes,
      and an answer with a stale one, never `402`.
- [ ] **Step 2: See them fail,** write the check and the cache, see them
      pass, run the gate, and commit as
      `feat(relay): check listen with RevenueCat past the free lines`.

### Task 6: The Simulator switch

**Files:** modify `worker/test/count.test.ts`, `worker/src/index.ts`,
`worker/src/config.ts`, and `worker/wrangler.jsonc`.

- [ ] **Step 1: Write the failing tests:** with the switch on, a
      `simulator` request isn't counted and carries `freeLinesLeft` null,
      while a `device` request is counted; with it off, both are.
- [ ] **Step 2: See them fail,** write the switch, see them pass, run the
      gate, and commit as
      `feat(relay): let the Simulator build skip the count behind a switch`.

### Task 7: The log's new outcomes

**Files:** modify `worker/test/logs.test.ts` and `worker/src/index.ts`.

- [ ] **Step 1: Extend the log test** with `paywall`, `duplicate`, and
      `unverified`, each with no text, ID, or line ID, see it fail if it
      does, then pass, and commit as
      `test(relay): log the paywall, duplicate, and unverified outcomes`.

### Task 8: The log summary

**Files:** create `worker/scripts/summary.ts`,
`worker/scripts/telemetry.ts`, `worker/scripts/logs.ts`,
`worker/scripts/tsconfig.json`, `worker/test/summary.test.ts`,
`worker/test/telemetry.test.ts`, and `worker/README.md`; modify
`worker/package.json` and `bun.lock`.

- [ ] **Step 1: Write the failing tests:** the summary's counts,
      failures, percentiles by nearest rank, and tokens from a fixture of
      log lines; and the query's body, headers, paging by `$metadata.id`,
      the filter on `source`, and its errors, from a mocked API.
- [ ] **Step 2: See them fail,** write the modules and the command, see
      them pass, run the gate, and commit the summary, the query, and the
      command with its README one at a time.

### Task 9: The credit alert

**Files:** create `worker/scripts/alert.ts`, `worker/scripts/credits.ts`,
`worker/test/alert.test.ts`, and `.github/workflows/credit-alert.yml`;
modify `worker/README.md`.

- [ ] **Step 1: Write the failing tests** for the rule: quiet under the
      level with no `credits`; firing on a `credits` line or on spend over
      the level; and the issue's body, with the window, the counts, and
      the spend.
- [ ] **Step 2: See them fail,** write the rule, the command, and the
      workflow, see them pass, run the gate, and commit as
      `feat(relay): alert the team when Jev's credits run out or go fast`.

### Task 10: The TRD

- [ ] **Step 1: Edit** the TRD's sections as the design's last decision
      says, run the docs gate, and commit each section on its own.

### Task 11: Graph, pull request, review, deploy, and merge

1.  Run `graphify update .` and commit `graphify-out/` as
    `chore(graphify): refresh the graph after counting free lines`.
1.  Push the branch and open the pull request with the `/pr` template, with
    "Closes #30" and "Closes #31", and "Part of #32" until its test runs.
1.  Run one `/code-review` round against `main`, with the three issues and
    this plan as the spec, and a fact-check agent; post it as a PR comment,
    fix what it confirms in one commit per fix or group of related fixes,
    and post a resolution comment.
1.  Deploy the reviewed head, run the live checks and the log summary on
    September 23, 2026's logs, set the workflow's secrets, and post the
    results on the pull request.
1.  List `docs/plans` and `docs/research` on `origin/main`, renumber if a
    peer took these numbers, then rebase-merge, delete the branch locally
    and on the remote, and remove the worktree.
1.  Run the alert with `level` 0, close its issue, record the receivers on
    #32, and close #30, #31, and #32 with their criteria ticked.

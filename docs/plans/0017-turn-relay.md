# Turn's relay implementation plan

**Goal:** Close [issue #24][relay-issue]: the relay's first version, which
answers a partner line with Jev's scores through the user's Durable Object,
serves the configuration, rejects what breaks its limits before any call,
maps every failure to a bare code, logs one line per request with no text,
and runs deployed at its `workers.dev` address.

**Architecture:** Two new files in `@turn/shared`: `relay.ts` holds the wire
types and limits the relay and the app share, and `jev.ts` builds the Jev
request and reads its answer for the relay and the evaluation. The Worker in
`worker/src/` checks each request, reads the configuration from its vars,
and passes a line to the user's `Device` object, which calls Jev through
TypeSafe's SDK and returns a plain result. The Worker writes the answer, or
the error's code, and one log line.

**Tech Stack:** Cloudflare Workers with a SQLite Durable Object, Wrangler
4.136.2, `@typesafe-ai/sdk` 0.6.0, `@cloudflare/vitest-plugin` 1.2.2 with
Vitest 4.1.11, and TypeScript 6.0.3 in a Bun 1.4.2 workspace; graphify; the
`gh` CLI; and subagents for research and review.

**Spec:** [Issue #24][relay-issue], under the spec in [issue #13][spec], and
the TRD's sections on the [Relay API][trd-api], [the Jev request][trd-jev],
[secrets and configuration][trd-secrets],
[validation and abuse limits][trd-limits], and
[logs and counts][trd-logs]. The user's goal directive, verbatim:
"/ask-matt Complete and close #24. Follow @docs/references/markdown-style.md
(use List instead of TOC) and this workflow: branch -> /research (10-minute
max) -> plan -> implement -> create small and atomic commits -> push branch
-> PR -> code review -> resolve -> merge -> delete branch."

Contents:

1.  [Global constraints](#global-constraints)
1.  [Skills](#skills)
1.  [Design](#design)
1.  [Verification gate](#verification-gate)
1.  [Tasks](#tasks)

[relay-issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/24
[spec]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/13
[trd-api]: /docs/TRD.md#relay-api
[trd-jev]: /docs/TRD.md#the-jev-request
[trd-secrets]: /docs/TRD.md#secrets-and-configuration
[trd-limits]: /docs/TRD.md#validation-and-abuse-limits
[trd-logs]: /docs/TRD.md#logs-and-counts

## Global constraints

- **#24's acceptance criteria,** verbatim:
  - "An oversized field gets a 400 before any count or call (SEC-2)"
  - "Forcing each error returns only its code, with no key, internal error,
    or other user's data (SEC-4)"
  - "With Jev turned off in the configuration, a line gets 503 `jev_off`
    (STATE-3)"
  - "Changing the policy or the naming setting changes the next answer or
    configuration with no app build (ROW-8, CONSENT-7)"
  - "After a test session, the logs hold one line per request and no text
    (METRIC-1, PRIV-2)"
  - "The Jev request's snapshot test passes, with the model pinned to
    `jev-1.13.0`"
  - "The relay is deployed to `workers.dev`, and a deploy without the
    secrets fails (SEC-1)"
- **The ticket's comments:** import `Policy` and `startingPolicy` from
  `@turn/shared/row` rather than restating them; set `ID_SALT` with
  `wrangler secret put` before the first deploy that lists
  `secrets.required`; and check a deploy without the secrets under another
  name, such as `turn-relay-check`, where Wrangler stops before uploading.
- **Scope.** Counting free lines, the entitlement, `402`, `409`, and the
  Simulator switch are [#30][count-ticket]; the rate limits, `429`, and the
  daily budget are [#35][limits-ticket]; the log summary script is
  [#31][script-ticket]; the credit alert is [#32][alert-ticket]; the real
  line with 40 candidates and its timing is [#28][real-ticket]; and the
  app's side is [#48][app-ticket].
- **Versions** are pinned exactly, not as ranges.
- **Code** follows the repo's Prettier settings (single quotes, no
  semicolons, 120 columns, no trailing commas), TypeScript's `strict`, and
  the doc comments of `shared/src/`, wrapped under 120 columns by hand.
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
- **The worktree.** Another session works on its own branch in a sibling
  worktree, so this change is built in `../revenuecat-relay`, on the branch
  `relay/lines`, and the main checkout stays on `main`.
- **Secrets and identifiers.** The Jev key and `ID_SALT` never appear in a
  command line, an output, a tracked file, a log, or a comment: the salt goes
  from `openssl rand -hex 32` through a pipe into `wrangler secret put`. Tests
  use made-up values from `vitest.config.ts`. No account ID, email, or subdomain
  goes into the repository; outputs that show them are summarized.
- Absolute dates only. Use they/them for anyone whose pronouns aren't
  stated.

[count-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/30
[limits-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/35
[script-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/31
[alert-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/32
[real-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/28
[app-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/48

## Skills

`/ask-matt` sends a ticket from `/to-tickets` to `/implement`, which builds
at agreed seams with `/tdd`, runs the full suite at the end, and closes with
`/code-review`. The directive's steps map to skills:

- **`/research`:** one background agent, capped at 10 minutes, wrote
  [the relay notes][note] in about six, from the SDK's tarball, the
  installed plugin and Wrangler, and Cloudflare's docs. A five-minute spike
  in this worktree then ran what the note couldn't: spies on `fetch` and
  `console.log` reach the Durable Object, `toMatchFileSnapshot` writes its
  file, a `529` is retried once, the 2.5-second budget throws
  `APIUserAbortError`, and `wrangler types` gives `getByName` its options.
  It also showed that a test which forgets to mock Jev calls the real API.
- **`/tdd`:** each behavior starts from a failing test at its seam: the
  shared files' exports, and the Worker's `fetch`, run by the root's
  `bun run test`.
- **`/pr`:** the pull request's body.
- **`/code-review`:** one round, on its Standards and Spec axes, with issue
  #24 and this plan as the spec.

[note]: /docs/research/0038-turn-relay.md

## Design

### Decisions

1.  **Two shared files, imported one at a time.** `@turn/shared/relay`
    holds the TRD's wire types, `Config`, `LineRequest`, `LineAnswer`, and
    `ErrorCode`, and `limits`, which the app (#48) imports too.
    `@turn/shared/jev` holds `buildJevRequest` and `readJevAnswer`, which
    the evaluation's Jev ranker (#36) imports too, so it measures the
    request the relay sends. Neither imports the SDK: the questions are
    plain objects in its shape ([SDK notes][note-sdk]), so the shared
    package gains no dependency.
1.  **The Jev request** is the TRD's body: the model, a state of
    `partner_line` and `place`, then `kind` with the four kinds and their
    descriptions, `topic` with each category's id described by its name and
    then `consent`, and `c00` to `c39`, one Noul per candidate in the
    request's order, each with the phrase and the question in its
    instructions. The caller passes the model: `JEV_MODEL` in the relay.
1.  **Reading the answer.** The SDK returns Jev's body unchecked
    ([SDK notes][note-sdk]), so `readJevAnswer` checks every answer it
    uses: `kind` and `topic` must be Choices with a probability from 0 to 1
    for each option, and each candidate's key a Noul from 0 to 1. Anything
    else throws, and the relay answers `jev_unavailable`. It returns a
    `Ranking` from `@turn/shared/row`, with `onPhone` false and the scores
    in a `Map` in the candidates' order, which the evaluation passes to the
    row's rules as it is, and the relay turns into the JSON object.
1.  **The order of checks.** The route, then the headers; for a line, the
    content type, the size, the JSON, and every field; only then the
    configuration, the switch, and the user's object. Nothing reaches the
    object or Jev before the checks pass (SEC-2). `GET /v1/config` checks
    the headers too, since every request carries them.
1.  **The headers.** `X-Turn-User` is a lowercase version 4 UUID and
    `X-Turn-Build` is `device` or `simulator`, as the TRD says;
    `X-Turn-Version`, which the TRD leaves unchecked, is 1 to 32 visible
    ASCII characters; and a line's `Content-Type` is `application/json`,
    with or without parameters.
1.  **The body and its fields.** A `Content-Length` over 16,384 bytes gets
    `400` unread; otherwise the relay reads the stream and stops past
    16,384 bytes, so a missing or false length can't force a big read. The
    JSON is an object with `lineId`, a lowercase version 4 UUID; `seq`, an
    integer from 0; `line`, 1 to 300 characters; `place`, up to 40;
    `categories`, up to 12 of `{ id, name }` with names of 1 to 40;
    `candidates`, up to 40 of `{ id, text }` with texts of 1 to 200; and
    `refresh`, a boolean if present. Ids are 1 to 64 characters and unique
    in their list, and no category is `consent`, whose topic option is
    fixed. Other fields are ignored. Characters are Unicode code points, as
    SQLite's `length()` counts them in the phone's `CHECK`s, so a text
    within the phone's limits is within the relay's, where counting UTF-16
    units would refuse 200 emoji. The 16 KB in all is the app's to keep:
    40 candidates of 200 characters in a script of two or more bytes a
    character pass it, so the app drops candidates from the end of the
    shortlist until the request fits, which the TRD's "Tag, then cut" now
    says; the first review round found that.
1.  **The object's name** is `user-` and the hex SHA-256 of `ID_SALT`
    followed by the ID, reached with
    `getByName(name, { locationHint: 'wnam' })`. The log line keeps the
    hash's first 8 characters.
1.  **The configuration is read from the vars on every request,** so a
    changed var changes the next answer with no app build (ROW-8,
    CONSENT-7):
    - `jevOn` and `typesafeNamed` are true only for `true`, so a typo turns
      Jev off and leaves TypeSafe unnamed, the safe side of each.
      `TYPESAFE_NAMED` starts `false`, since naming starts off (CONSENT-7).
    - `freeLinesLeft` is `FREE_LINES`, 20, until #30 counts.
    - `policy` is `startingPolicy` with `POLICY`'s values over it. `POLICY`
      starts as `{}` and holds only the values the team changes, as JSON
      in `wrangler.jsonc` or as a string from `--var` or the dashboard.
    - A `POLICY` with an unknown key, a wrong type, or a number outside 0
      to 1, a `FREE_LINES` that isn't a whole number, or no `JEV_MODEL`
      answers `500 internal`, so a mistake shows at the next request
      instead of passing unseen. Without a `JEV_MODEL`, the SDK would pick
      a model of its own.
    - With no `POLICY` at all, as after deleting it in the dashboard, the
      starting policy holds; the first review round found that it answered
      `500` instead.
1.  **The Jev call,** in the object: a `TypeSafeClient` with every option
    in code: `apiKey`, `baseURL: 'https://api.typesafe.ai'`, `defaultModel`
    from `JEV_MODEL`, `logLevel: 'off'`, `timeout: 1500`, and
    `retry: { maxRetries: 1, respectRetryAfter: false }`, called with
    `signal: AbortSignal.timeout(2500)`. The SDK reads the key, the
    address, the model, and the log level from `process.env` when the code
    leaves them out, which Workers fill with the vars and secrets
    ([SDK notes][note-sdk]); the first review round found the address
    missing, which a stray `TYPESAFE_BASE_URL` var would have set. The
    object returns a plain result, never an error, whose message or body
    could hold text: the ranking, the model, the input tokens, and the
    milliseconds in Jev; or the outcome `failed` or `credits`, with Jev's
    status when it sent one.
1.  **Failures.** A `402` from Jev is `credits`; any other error is
    `failed`: a `429`, a `529`, another status, a per-attempt timeout, the
    2.5-second budget, a lost connection, or an answer `readJevAnswer`
    refuses. Both answer `503 jev_unavailable` (AVAIL-2). Anything else
    that throws in the Worker answers `500 internal`. A path or method the
    relay doesn't serve gets `404 not_found`, a code the TRD adds. Every
    error body is `{ "error": "<code>" }` and nothing else (SEC-4).
1.  **The answer** is the TRD's `LineAnswer`: `seq`, `kind`, `topic`,
    `scores` by candidate id, `policy`, `freeLinesLeft` (`FREE_LINES` until
    #30), and `ms` with the time in Jev and in all. `refresh` is accepted
    and unused until #30.
1.  **One log line per request,** written by the Worker alone as a plain
    object, since Workers Logs indexes an object's keys as fields
    ([logs notes][note-logs]): `at`, the ISO time; `user`, the hash's
    prefix; `seq`; `outcome`; `ms`, with `total` and `jev`; `model`;
    `inputTokens`; and `jevStatus`, each only when known. Outcomes are
    `answered`, `failed`, `credits`, and `off` for lines, `invalid`,
    `not_found`, and `internal` for errors, and `config` for the
    configuration; #30 and #35 add `paywall` and `limited`. It never holds
    a line, phrase, place, category, ID, line ID, or error message: a JSON
    parse error quotes the body.
1.  **`wrangler.jsonc`** takes the TRD's shape without `BUDGET` and the
    rate limits, which #35 adds: `placement.region` `aws:us-west-2`; the
    `Device` object with SQLite storage through `exports`, which replaces
    `migrations` ([Wrangler notes][note-wrangler]); Workers Logs on with
    invocation logs off, and `traces.enabled` false in so many words;
    `secrets.required` with all three secrets, so a deploy checks the full
    set now, though only #30 uses `RC_SECRET_KEY`; and the vars
    `JEV_MODEL`, `JEV_ON`, `FREE_LINES`, `TYPESAFE_NAMED`, and `POLICY`.
    `wrangler types` runs with `--strict-vars=false`, so a var's type is its
    kind, such as `string`, not the value it holds today. The committed
    `worker/.dev.vars.example` already names the three secrets.
1.  **Tests** run in the Workers pool, which shares one isolate with the
    Worker and its objects:
    - A setup file makes every `fetch` a test didn't mock reject, since the
      spike's unmocked test reached the real API, and the key in a
      developer's shell environment is loaded into the pool unless
      `vitest.config.ts` overrides it, which it does. It also quiets the
      relay's log lines, which the log test reads from the same spy.
    - `vitest.config.ts` sets the committed vars again, read with
      Wrangler's `unstable_readConfig`, since Wrangler would take a var of
      the same name from the shell, `.env`, or `.dev.vars`, and sets the
      four names the SDK reads from `process.env` to wrong values, so the
      contract and log tests fail if the code leaves one out. The first
      review round found both.
    - Each test stands in for Jev with `vi.spyOn(globalThis, 'fetch')`,
      building every `Response` inside the mock, and reads the log lines
      with `vi.spyOn(console, 'log')`.
    - A changed var is tested by calling the Worker's `fetch` with
      `{ ...env, POLICY: … }`, which reaches the Worker, where the
      configuration is read.
    - The contract test writes the parsed body the SDK sends to
      `worker/test/snapshots/jev-request.json` with `toMatchFileSnapshot`,
      two-space JSON that Prettier leaves as it is.
    - A refused line is checked to reach neither Jev nor the user's
      object, where #30 will count. After the first review round, tests
      also cover a hung first attempt retried within the budget, a
      `Retry-After` not waited for, a character split across the body's
      chunks, and timings that count real time; before, each could break
      with every test still passing.
1.  **The deploy,** from `worker/` after the gate passes, on the head the
    review approved, before the merge, which copies that tree:
    - `ID_SALT` first, through a pipe, then `wrangler deploy`.
    - Live checks: `GET /v1/config`, an oversized line, and one real line
      with three candidates, which costs about $0.00003, while
      `wrangler tail --format json` records the log lines. #28 sends the
      real line with 40 candidates and records its timing.
    - `wrangler tail` shows lines as they happen, not what Workers Logs
      keeps, which METRIC-1's check reads after a session. So the session
      is read back from Workers Logs through Cloudflare's observability
      API if Wrangler's login may, and otherwise the pull request says so
      and leaves that reading to the dashboard.
    - The missing-secrets check deploys under `turn-relay-check`: Wrangler
      4.136.2 throws before it uploads a script, creates an object
      namespace, or adds a route, and `--dry-run` skips the check
      ([Wrangler notes][note-wrangler]); `wrangler deployments list` then
      finds no such Worker.
1.  **The TRD** changes to match: the error table gains `not_found`; the
    limits gain the header, content type, code point, id, `lineId`, and
    `seq` rules; the logs section lists the fields and outcomes; the
    configuration section says how `JEV_ON`, `TYPESAFE_NAMED`, `POLICY`,
    and `JEV_MODEL` are read, with `traces` and the two new vars in its
    `wrangler.jsonc`; the Jev request's call and errors name the options
    set in code and the failures, an answer out of shape among them; and
    "Tag, then cut" has the app keep a request within 16 KB.

[note-sdk]: /docs/research/0038-turn-relay.md#the-sdks-client-and-call
[note-logs]: /docs/research/0038-turn-relay.md#workers-logs
[note-wrangler]: /docs/research/0038-turn-relay.md#wranglers-config-and-deploy

### Rejected alternatives

- **The SDK's `choice` and `noul` helpers in `@turn/shared`:** the package
  the app installs would depend on the SDK for two object literals.
- **`fetchMock`:** it left `@cloudflare/vitest-pool-workers` in 0.13.0,
  before the plugin's 1.0.0, and `@msw/cloudflare` would add a dependency
  for what one spy does.
- **A cap above 16 KB:** SEC-2 sets it, and only 40 long texts in a script
  of two or more bytes a character reach it, which the app can trim.
- **Asking the object for the free lines now:** it would only return
  `FREE_LINES` until #30, which adds the call with the count.
- **Logging in the object:** a line would log twice, once per side.
- **A `JSON.stringify`'d log line:** Workers Logs documents field indexing
  for objects only.
- **`POLICY` restating every value:** the ticket's comment asks for
  `startingPolicy`, and a partial override changes one value in one place.
- **Throwing across the object's RPC:** errors lose their class and carry
  their messages.
- **Deploying from `main` after the merge:** a rebase merge copies the
  reviewed tree, and the deploy's evidence belongs on the pull request.

### Out of scope

- Free lines, the entitlement, `402`, `409`, and the Simulator switch
  (#30); rate limits, `429`, and the daily budget (#35).
- The log summary script (#31), the credit alert (#32), and the real line
  with 40 candidates (#28).
- The app's requests, cache, and row (#48).

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

### Task 1: Research note

A background agent wrote `docs/research/0038-turn-relay.md` in about six
minutes. It passed the docs gate once its long type signatures moved into
code blocks, and was committed as `docs(research): add notes on the relay`.

### Task 2: This plan

- [ ] **Step 1: Run the docs gate, then commit** as
      `docs(plan): add the plan for the relay`.

### Task 3: The wire types

**Files:** create `shared/src/relay.ts`.

- [ ] **Step 1: Write** `limits` and the types `Category`, `Candidate`,
      `Config`, `LineRequest`, `LineAnswer`, and `ErrorCode` from the TRD's
      Relay API, with `Policy` and `Kind` from `./row`.
- [ ] **Step 2: Run the gate** and commit as
      `feat(shared): add the relay's wire types and limits`.

### Task 4: Building the Jev request

**Files:** create `shared/src/jev.ts` and `shared/test/jev.test.ts`.

- [ ] **Step 1: Write the failing tests** for `buildJevRequest(line, model)`:
  - The model, and a state of the line and the place, and nothing else.
  - `kind`'s four options, in the TRD's words.
  - `topic`'s options: each category's id with its name, in order, then
    `consent`.
  - Forty candidates give `c00` to `c39` in order, each a Noul with the
    phrase and the TRD's question; none gives only `kind` and `topic`.
- [ ] **Step 2: See them fail,** write `buildJevRequest`, see them pass,
      run the gate, and commit as
      `feat(shared): build the Jev request for a partner line`.

### Task 5: Reading Jev's answer

**Files:** modify `shared/src/jev.ts` and `shared/test/jev.test.ts`.

- [ ] **Step 1: Write the failing tests** for `readJevAnswer(answers, line)`:
  - It maps each Noul back to its candidate's id, in the candidates'
    order, whatever the answers' key order.
  - It returns the kind's and the topic's probabilities by option, with
    `onPhone` false.
  - It throws for a missing Noul, a Noul outside 0 to 1, a Choice where a
    Noul belongs, and a missing kind or topic option.
- [ ] **Step 2: See them fail,** write `readJevAnswer`, see them pass, run
      the gate, and commit as
      `feat(shared): read Jev's answer into the row's ranking`.

### Task 6: The relay's packages and configuration

**Files:** modify `worker/package.json`, `bun.lock`,
`worker/wrangler.jsonc`, `worker/vitest.config.ts`, and
`worker/test/index.test.ts`; create `worker/test/setup.ts`.

- [ ] **Step 1: Add** `@typesafe-ai/sdk` 0.6.0 and `@turn/shared` as
      dependencies, the configuration from the design but for the object's
      binding, which Task 8 adds with the class it names, the test secrets
      in `miniflare.bindings`, and the setup file that rejects unmocked
      `fetch` calls, with a test that fails without it.
- [ ] **Step 2: Check** that `bun run typecheck` generates the vars and the
      three secrets into `Env`, and that the existing tests pass; commit as
      `build(relay): configure the Worker and its tests`.

### Task 7: The configuration route

**Files:** create `worker/src/config.ts`, `worker/src/request.ts`, and
`worker/test/config.test.ts`; modify `worker/src/index.ts` and
`worker/test/index.test.ts`.

- [ ] **Step 1: Write the failing tests:** `GET /v1/config` returns Jev
      on, TypeSafe unnamed, 20 free lines, and `startingPolicy`; a changed
      `TYPESAFE_NAMED`, `JEV_ON`, or `POLICY` changes it, a string `POLICY`
      included; a bad `POLICY` or `FREE_LINES` gets `500 internal`; each bad
      header gets `400 invalid_request`; and any other path or method gets
      `404 not_found`.
- [ ] **Step 2: See them fail,** write the route, see them pass, run the
      gate, and commit as `feat(relay): serve the configuration`.

### Task 8: Answering a line

**Files:** create `worker/src/device.ts` and `worker/test/lines.test.ts`;
modify `worker/src/index.ts`, `worker/src/request.ts`,
`worker/wrangler.jsonc`, and `worker/test/helpers.ts`.

- [ ] **Step 1: Write the failing tests,** with Jev mocked: a valid line
      gets `200` with the scores by candidate id, the kind, the topic, the
      policy, `freeLinesLeft` 20, and both timings; the object is reached
      by the salted hash with `locationHint: 'wnam'`; a changed `POLICY`
      changes the next answer's policy (ROW-8); `JEV_ON` false gets
      `503 jev_off` with no call to Jev (STATE-3); and a body that isn't a
      line, such as bad JSON or a field of the wrong type, gets
      `400 invalid_request`.
- [ ] **Step 2: See them fail,** write the object and the route, see them
      pass, run the gate, and commit as
      `feat(relay): answer a partner line with Jev's scores`.

### Task 9: The limits

**Files:** modify `worker/src/request.ts` and `worker/test/lines.test.ts`.

- [ ] **Step 1: Write the failing tests:** each field one past its limit,
      an empty line, name, text, or id, a body over 16 KB with and without
      a length, a length over 16 KB before reading, a wrong or missing
      content type, a repeated id, and a `consent` category each get
      `400 invalid_request` with no call to Jev (SEC-2); each field at its
      limit, with emoji counted as one character each, gets `200`.
- [ ] **Step 2: See them fail,** write the checks, see them pass, run the
      gate, and commit as
      `feat(relay): refuse a line over its limits before any call`.

### Task 10: Jev's failures

**Files:** modify `worker/src/device.ts` and `worker/test/lines.test.ts`.

- [ ] **Step 1: Write the failing tests:** a `529` twice, a `429` twice, a
      `500` twice, a `401`, a hung call, a `402`, and a malformed answer
      each get exactly `{ "error": "jev_unavailable" }` with `503`, and
      never the key; a `500` then an answer gets `200` after one retry; a
      hung call ends within 3 seconds; and every other error body is its
      code alone (SEC-4).
- [ ] **Step 2: See them fail,** write the mapping, see them pass, run the
      gate, and commit as
      `feat(relay): answer Jev's failures with their code alone`.

### Task 11: The log line

**Files:** modify `worker/src/index.ts`; create `worker/test/logs.test.ts`.

- [ ] **Step 1: Write the failing tests:** a session of a configuration
      request, an answered line, a refused line, a line with Jev off, a
      `402`, a `529`, and an unknown path writes one `console.log` object
      per request with the design's fields and outcomes, and no other
      console call; no line holds the line, a phrase, the place, a
      category's name, the ID, or the line ID (METRIC-1, PRIV-2).
- [ ] **Step 2: See them fail,** write the log line, see them pass, run
      the gate, and commit as
      `feat(relay): log one line per request with no text`.

### Task 12: The contract test

**Files:** create `worker/test/jev-request.test.ts` and
`worker/test/snapshots/jev-request.json`.

- [ ] **Step 1: Write the test:** one line with three candidates and three
      categories; it checks the call's URL, method, and bearer key, that
      the model is `jev-1.13.0`, and the parsed body against the snapshot.
- [ ] **Step 2: See it fail** once with a changed question, restore it,
      run the gate, and commit as
      `test(relay): keep a snapshot of the Jev request`.

### Task 13: The TRD

- [ ] **Step 1: Edit** the TRD's Relay API, Jev request, names as tags,
      validation, configuration, and logs sections as the design's last
      decision says.
- [ ] **Step 2: Run the docs gate,** then commit each section on its own,
      such as `docs(trd): list the relay's log fields and outcomes`.

### Task 14: Graph, pull request, review, deploy, and merge

1.  Run `graphify update .` and commit `graphify-out/` as
    `chore(graphify): refresh the graph after adding the relay`.
1.  Push the branch and open the pull request with the `/pr` template, with
    "Closes #24".
1.  Run one `/code-review` round against `main`, with issue #24 and this
    plan as the spec, post it as a PR comment, fix what it confirms in one
    commit per fix or group of related fixes, and post a resolution
    comment.
1.  Deploy the reviewed head as the design says, run the live checks and
    the missing-secrets check, and post the results on the pull request.
1.  Rebase-merge the pull request, delete the branch locally and on the
    remote, remove the worktree, and check that #24 closed with its
    criteria ticked. Leave follow-up comments on #28, #30, #31, #35, #36,
    and #48.

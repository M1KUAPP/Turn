# Turn's embeddings and Jev rankers, and the replay: implementation plan

**Goal:** Close [issue #36][rankers-issue] and [issue #37][replay-issue]:
the evaluation scores four rankers on the same lines, with the paired
interval, the big buttons on sensitive lines, the question kind, each
ranker's risk-coverage curve, and the model pin; and a replay script sends
partner lines in order through a relay and the row's rules, counting slot
changes.

**Architecture:** The `@turn/eval` package gains two rankers and a script.
`embeddings.ts` calls Workers AI's REST API and ranks by cosine, with a
cut-off that `cut-off.ts` sets by five-fold cross-validation. `jev.ts` calls
Jev through TypeSafe's SDK with the relay's request builder and the relay's
model pin. `score.ts` awaits each ranker in turn, applies the row's rules
once every line is ranked, and adds the paired bootstrap, the big buttons,
and the kind's matrix; `curves.ts` draws the risk-coverage curves as an SVG.
`replay.ts` is `bun run replay`.

**Tech Stack:** TypeScript 6.0.3 and Vitest 4.1.11 in a Bun 1.4.2
workspace; `@turn/shared`'s shortlist, row rules, and Jev request builder;
`@typesafe-ai/sdk` 0.6.0; Workers AI's REST API; Wrangler 4.136.2 for the
local relay; graphify; the `gh` CLI; and subagents for research and review.

**Spec:** [Issue #36][rankers-issue] and [issue #37][replay-issue], under the
spec in [issue #13][spec]; the PRD's [evaluation requirements][prd-eval] and
[degraded states][prd-states]; and the TRD's sections on
[the rankers][trd-rankers], [metrics, intervals, and thresholds][trd-metrics],
[the replay script][trd-replay], and [the report][trd-report]. The user's
goal directive, verbatim: "/ask-matt Complete and close #36 and #37. Follow
@docs/references/markdown-style.md (use List instead of TOC) and this
workflow: branch -> /research (10-minute max) -> plan -> implement -> create
small and atomic commits -> push branch -> PR -> code review -> resolve ->
merge -> delete branch."

Contents:

1.  [Global constraints](#global-constraints)
1.  [Skills](#skills)
1.  [Design](#design)
1.  [Verification gate](#verification-gate)
1.  [Tasks](#tasks)
1.  [What changed while building](#what-changed-while-building)

[rankers-issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/36
[replay-issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/37
[spec]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/13
[prd-eval]: /docs/PRD.md#evaluation-requirements
[prd-states]: /docs/PRD.md#offline-and-degraded-states
[trd-rankers]: /docs/TRD.md#the-rankers
[trd-metrics]: /docs/TRD.md#metrics-intervals-and-thresholds
[trd-replay]: /docs/TRD.md#the-replay-script
[trd-report]: /docs/TRD.md#the-report

## Global constraints

- **#36's acceptance criteria,** verbatim:
  - "One command scores all four rankers on the same lines (EVAL-3)"
  - "The table shows the paired interval and says "trails" only when it's
    wholly below zero (EVAL-4)"
  - "The script lists every big button on yes-or-no, pain, and consent
    lines (EVAL-5)"
  - "The report names the date, the model pin, and the commit (EVAL-6)"
  - "No ranker runs on the 80 labeled lines in this ticket (EVAL-2)"
- **#37's acceptance criteria,** verbatim:
  - "Replay a conversation and count slot changes (EVAL-7)"
  - "It runs against a local relay and the team's relay"
- **Nothing on the 80 lines.** No test, check, or live run scores
  `eval/lines.jsonl` or sends one of its lines to Jev or Workers AI. Live
  runs use the fixture in `eval/test/fixture/lines.jsonl` and the replay's
  sample conversation, whose lines a script checks against the 80 without
  printing them.
- **Keys stay out of sight.** `TYPESAFE_API_KEY`, `CLOUDFLARE_API_TOKEN`,
  and `ID_SALT` come from the environment and never appear in a command
  line, an output, a tracked file, a log, or a comment; a token is passed
  as `"$(bunx wrangler auth token --json | jq -r .token)"` into an exported
  variable. No account ID, email, or workers.dev subdomain goes into the
  repository, a commit, or a GitHub comment; outputs that show one are
  summarized.
- **Tests reach no service.** Any `fetch` a test doesn't stand in for
  fails, and every key and every variable the SDK reads is stubbed with a
  made-up or stray value, so a test can neither call a real service nor
  read a real key.
- **Versions,** exact: `@typesafe-ai/sdk` 0.6.0, TypeScript 6.0.3, Vitest
  4.1.11, Bun 1.4.2, Wrangler 4.136.2.
- **Markdown** follows [the style guide][md-style] with a `Contents:` list in
  lazy numbering instead of `[TOC]`, 80-column prose, and no code span
  broken across lines.
- **Commits** are small, atomic Conventional Commits with no attribution
  lines; commitlint rejects a body line over 100 characters or one that
  starts with "word:" or "word #N". `skills-lock.json`, `.agents/`, and
  `.claude/` are never staged.
- **Reading the repository:** run `graphify query "<question>"` before
  grepping or reading files, and include that rule in every subagent's
  prompt.

[md-style]: /docs/references/markdown-style.md

## Skills

- `/research` wrote [the services notes][services-notes] and
  [the statistics notes][stats-notes] with two background agents, 10 minutes
  each.
- `/code-review` runs one round with the Standards and Spec subagents, this
  plan and both issues as the spec, plus a fact-check and bug-hunt agent.
- `/pr` writes the pull request's body; `receiving-code-review` answers the
  findings, one commit per fix.

## Design

### Decisions

1.  **One pull request for both tickets.** The replay reads the same bank,
    shortlist, and row rules as the evaluation, from the same package.
1.  **Rankers may answer later.** `Ranker` returns a `Ranking` or a promise
    of one, and `scoreLines` awaits one ranking at a time, so one request is
    in flight. It times each ranking, its network trip included, and applies
    the row's rules once every line is ranked, since the embeddings'
    cut-off needs every line first. A warm-up pass and three timed passes
    stay as they are, and each line is scored from the first timed pass. A
    spike on September 23, 2026 sent one fixture line to Jev three times:
    the top phrase scored 0.65, 0.71, and 0.70, so the report says which
    pass it scores.
1.  **The embeddings ranker** calls Workers AI's REST API:

    ```text
    POST https://api.cloudflare.com/client/v4/accounts/<account>/ai/run/@cf/baai/bge-base-en-v1.5
    Authorization: Bearer <token>
    { "text": ["...", "..."], "pooling": "cls" }
    ```

    - The account and token come from `CLOUDFLARE_ACCOUNT_ID` and
      `CLOUDFLARE_API_TOKEN`. The spike's call with the Wrangler login's
      token answered `200`, so `wrangler auth token --json` serves; a
      custom token needs "Workers AI - Read" and "Workers AI - Edit"
      ([services notes][services-notes]).
    - Each request holds at most 100 texts and always sends `cls`, since
      the default `mean` makes vectors that don't compare; the answer must
      say `success`, `cls`, and a shape of one 768-number row per text.
    - Each line goes in one request with the phrases of its shortlist the
      ranker hasn't seen, and a phrase's vector is kept for the run, as a
      store of the bank's vectors would keep it; after the warm-up pass,
      each request holds the line alone. Cosine divides by both norms; the
      spike's vectors had norms of 0.9996 to 1.0003. No query prefix: BGE's
      card says leaving it out costs little, and a prefixed run would be
      another ranker.
    - The ranking: the kind from the phone's `isYesNo`, since it has none of
      its own; no topic; the cosines in the shortlist's order; and
      `onPhone: true`, so it never brings a big button, since a cosine isn't
      a probability.

1.  **Its cut-off is cross-validated.** At a cut-off, the phrases whose
    cosine reaches it score 1 and the rest 0, in cosine order, which is the
    keyword ranker's shape. The folds come from one seeded shuffle, after
    which the lines with an acceptable reply and those with none are each
    dealt round-robin into five folds, since without the shuffle the
    file's order (one writer's 40, then the other's) would pick the folds
    ([statistics notes][stats-notes]). Each fold's cut-off is chosen on the
    other four: of each of their lines' top cosines and one above them all
    (hold every line), the one that makes the most lines right (a right big
    button, row, or hold), ties going to the higher. The fold's lines are
    then scored at it, so every reported outcome is out of fold, and the
    report lists the five cut-offs. Plain accuracy rather than balanced
    accuracy, scikit-learn's default: the lines follow a real
    conversation's mix, about a fifth with no reply, and balanced accuracy
    would weigh the 8 lines with none as much as the 72 with one.
1.  **The Jev ranker** turns the app's shortlist into the relay's request:
    the line as written, the place's name from the bank, the grid's
    categories (the bank's, without the strip's, which the grid doesn't
    show), and the shortlist's ids and texts. It sends
    `buildJevRequest(line, pin)` through the SDK, reads the answer with
    `readJevAnswer`, and the row's rules take it with `startingPolicy`.
    - The pin is `JEV_MODEL` in `worker/wrangler.jsonc`, read with its
      comment lines dropped, so the evaluation runs the relay's model.
    - The client takes the key from `TYPESAFE_API_KEY` and sets `baseURL`,
      `defaultModel`, and `logLevel: 'off'` in code, since the SDK reads any
      it's not given from the environment. It keeps the SDK's 10-second
      attempts and two retries, written out, since a slow link from the
      evaluation's machine shouldn't count against Jev; a call that still
      fails stops the command, which has shown no result yet.
    - Each call's `model` and `usage.input_tokens` are kept for the report.
    - The lines aren't tagged: `turn-listen` tags names on the phone, and
      the evaluation's lines are written, not heard.
1.  **The paired interval.** On the lines with an acceptable phrase besides
    the fixed buttons, each line's top-6 hit for Jev and for embeddings;
    9,999 resamples of line indices, the same for both, SciPy's default;
    and the 2.5th and 97.5th percentiles of the differences, by type 7.
    `xoshiro128**` 1.1 draws the indices from a committed nonzero seed, a
    draw past the last whole multiple of the count drawn again rather than
    kept with a bare modulo. When no line splits the
    two rankers, every resample gives the same difference, and the
    interval is that value. Jev "trails" when the interval lies wholly
    below zero and "leads" when wholly above; otherwise there's "no clear
    difference". Every group's ranking shows it, in points.
1.  **Big buttons on sensitive lines (EVAL-5):** every ranker's big button
    on a line its writer marked yes-or-no or whose concerns name pain or
    consent, with the line, the phrase, and whether it's right. Only Jev
    can show one; an empty list says so.
1.  **The question kind:** Jev's most likely kind against its writer's, as
    a matrix whose rows are the writer's kinds and whose columns are Jev's,
    plus a column for a tie, and the accuracy with its Wilson interval, on
    all lines. The other rankers answer no kind question: `keyword` and
    `embeddings` take the phone's yes-or-no rule, and `place` none.
1.  **Risk-coverage curves,** one per ranker over all lines:
    - A line's confidence is its top score. At each distinct confidence
      above 0, a line is covered when its top reaches it, and right when one
      of its first six phrases scoring at least that much is acceptable,
      the evaluation notes' formula; the fixed buttons and the big button
      don't count.
    - An SVG beside the report, named after it (`results-risk-coverage.svg`
      for `results.md`), plots each curve's points, since GitHub displays
      SVG and Mermaid's `xychart` takes no x-y pairs. A table gives each
      ranker's risk at the first point reaching 20%, 40%, 60%, 80%, and 100%
      coverage, as the plot's text.
    - `place` and `keyword` each make one point. No area under the curve:
      `keyword` can't cover a line that shares no word, so areas wouldn't
      compare.
1.  **The models (EVAL-6):** the header names Jev's pin, where it's set, and
    the models Jev reported, and Workers AI's model with its pooling, beside
    the date and the commit.
1.  **The naming switch:** `--unnamed` calls `jev` the "hosted decision
    model" in every table, sentence, and the plot's legend, and gives the
    pin without its name (`1.13.0`). A test checks that the report and the
    plot hold no "jev" or "TypeSafe" in any case.
1.  **A guard for the 80 lines:** `bun run eval` refuses them while the
    working tree has uncommitted changes, naming EVAL-2, so the history
    shows Jev's settings before any result.
1.  **The replay** runs a conversation as the app would, from the lines and
    the relay its options name, which default to these:

    ```shell
    bun run replay --lines eval/replay.jsonl --relay http://localhost:8787
    ```

    - It gets `GET /v1/config` once, as the app does at launch, then sends
      each line in order with a fresh random user ID for the run and the
      headers the relay checks, `X-Turn-Build: simulator` among them.
    - Each line takes the next sequence number, a new line ID, and a
      shortlist whose first phrases are the row's. An answer's scores go
      back in the shortlist's order, and `applyAnswer` takes them on the
      previous row.
    - As STATE-2 says, a failure or no answer within 3 seconds has the
      phone rank the line with the cached policy; with Jev off, the phone
      ranks every line (STATE-3). A `402` stops the replay, since the app
      would open the paywall instead (STATE-4).
    - It prints a table, one row per line: who ranked it, the big button or
      the six slots, the slot changes (the slots that differ from the row
      before), whether the row held, and the times. A summary follows.
    - The relay's address is an argument, since `wrangler dev` moves off
      8787 when the port is taken, and the team's address stays out of the
      repository.

1.  **The replay's sample,** `eval/replay.jsonl`: ten lines of a morning at
    home and out, written by Claude for this change, since the replay test's
    recorded lines don't exist yet. A script checks that none is among the
    80, printing only the count.
1.  **The TRD** gains how the evaluation reaches Workers AI and Jev, the
    cut-off, the interval's verdicts, the curves, the kind, the naming
    switch, the guard, and the replay's use.

### Rejected alternatives

- **Workers AI through a Worker binding** or Wrangler's platform proxy: it
  would bring Wrangler and a local runtime into the evaluation, and the TRD
  says the evaluation calls Workers AI "directly with the team's keys".
- **Balanced accuracy for the cut-off:** see decision 4.
- **A BCa interval:** SciPy says it "may be NaN" when every resample is the
  same, and the percentile interval needs no special case.
- **Mermaid's `xychart`:** every series shares one x-axis, so the curves
  would have to be resampled onto one grid.
- **The relay's client settings** of 1.5-second attempts within 2.5 seconds:
  they would count the evaluation machine's link against Jev.
- **A shared `JEV_MODEL` constant:** the pin would live in two places.

### Out of scope

- `jev-rerank` (EVAL-4) and the extra rankers (EVAL-8), which the run in
  [issue #40][run-issue] calls for only if Jev trails.
- The run on the 80 lines and keeping its answers for re-runs, which belong
  to #40.
- The replay test on the phone (PERF-1, PERF-5), which records the 50 lines
  this script will replay.

[run-issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/40

## Verification gate

Every commit that touches code passes this gate, run from the worktree by a
script that stops at the first failure:

```shell
bun install --frozen-lockfile
bun run test
bun run typecheck
bun run lint
```

- Each new rule is mutated once (a line removed or a comparison flipped)
  and its test must fail; a mutation runs only with the suite green.
- Before the push, a fail-closed scan of every object in the repository
  finds neither `TYPESAFE_API_KEY`'s value nor the Wrangler token's.
- The docs pass the scratchpad's `check_md.py`.

## Tasks

### Task 1: Research notes

**Files:** create `docs/research/0042-turn-eval-services.md` and
`docs/research/0043-turn-eval-statistics.md`, each its own commit.

### Task 2: This plan

**Files:** create `docs/plans/0021-turn-rankers-and-replay.md`.

### Task 3: Rankers that answer later

**Files:** modify `eval/src/rankers.ts`, `eval/src/score.ts`,
`eval/src/report.ts`, and their tests.

`Ranker` returns `Ranking | Promise<Ranking>`; `scoreLines` and `main`
become async; each line's `rankers` entry keeps its `ranking` and `row`
beside `order` and `outcome`; the timing covers the ranking alone. The
tests await, and one checks that two slow rankers never overlap.

### Task 4: Seeded random numbers and the paired bootstrap

**Files:** modify `eval/src/stats.ts` and `eval/test/stats.test.ts`.

```ts
export function seeded(): () => number // xoshiro128** 1.1, 32-bit outputs
export function below(n: number, next: () => number): number // by rejection
export function pairedBootstrap(
  a: readonly number[],
  b: readonly number[]
): { difference: number; low: number; high: number } | null
```

Tests: the generator's first outputs for the committed seed; `below` stays
under `n` and hits every value; a known difference gives its interval, a
tie on every line gives a zero-width interval, and no lines give `null`.

### Task 5: The embeddings ranker

**Files:** create `eval/src/embeddings.ts`, `eval/test/embeddings.test.ts`,
`eval/test/setup.ts`, `eval/test/services.ts`, and `eval/vitest.config.ts`.

A setup file makes any unmocked `fetch` fail and stubs the keys and the
SDK's variables; `services.ts` stands in for Workers AI and Jev. Tests: the
URL, the header, `cls`, batches of at most 100, the checks on the answer,
the cosine, the phone's yes-or-no kind, no big button, and an error that
names Cloudflare's code without the token.

### Task 6: The cross-validated cut-off

**Files:** create `eval/src/cut-off.ts` and `eval/test/cut-off.test.ts`;
modify `eval/src/score.ts`.

Tests: the folds are stratified, seeded, and balanced; a cut-off is chosen
without its own fold; ties go to the higher; one above every top holds
every line; `scoreLines` scores each line at its fold's cut-off.

### Task 7: The Jev ranker

**Files:** create `eval/src/jev.ts` and `eval/test/jev.test.ts`; modify
`eval/src/data.ts`, `eval/package.json`, and `bun.lock`.

Tests: the pin from `worker/wrangler.jsonc`; the request's body equals the
relay's builder's for the same line, with the place's name and the grid's
categories; the address, key, and model are the code's, not the stray
variables'; each call's model and tokens are kept.

### Task 8: Four rankers in the report

**Files:** modify `eval/src/report.ts` and `eval/test/report.test.ts`.

The report builds the four rankers from the environment, names the models
in its header, and gives every group's ranking the paired interval with its
verdict.

### Task 9: Big buttons on sensitive lines

**Files:** modify `eval/src/score.ts`, `eval/src/report.ts`, and their
tests.

### Task 10: The question kind

**Files:** modify `eval/src/score.ts`, `eval/src/report.ts`, and their
tests.

### Task 11: Risk-coverage curves

**Files:** create `eval/src/curves.ts` and `eval/test/curves.test.ts`;
modify `eval/src/report.ts` and its test.

### Task 12: The naming switch

**Files:** modify `eval/src/report.ts`, `eval/src/curves.ts`, and the
report's test.

### Task 13: The guard for the 80 lines

**Files:** modify `eval/src/report.ts` and its test.

### Task 14: The replay

**Files:** create `eval/src/replay.ts`, `eval/replay.jsonl`, and
`eval/test/replay.test.ts`; modify `package.json`.

Tests: the headers and body the relay checks; the row's phrases first in
each shortlist; slot changes for steady slots, a phrase that beats the
lowest by the margin, and a hold; the phone's ranking after a failure, a
timeout, and with Jev off; a stop at `402`; and the printed table.

### Task 15: The TRD

**Files:** modify `docs/TRD.md`.

### Task 16: Live checks

- `bun run eval` on the fixture with the real keys, and again with
  `--unnamed`, into the scratchpad.
- The replay against `wrangler dev` with the key from the shell, and
  against the team's relay.
- `graphify update .`, committed as its own chore.

## What changed while building

- **Phrases embedded when first shortlisted,** not the whole bank up front:
  the ranker then needs no bank, and the cache ensures every shortlisted
  phrase has its vector.
- **Rejection by the last whole multiple,** the statistics notes' code,
  rather than Lemire's multiply-and-shift; both leave no bias.
- **A seventh-place check** joined the top-6 gap's test and the curves'
  test after a mutation to seven phrases survived each.
- **The plot's rings and dashes.** The live run's keyword point sat on Jev's
  line and vanished, so each curve has its own dashes, its points are rings
  a little smaller than the curve's before, and Jev is black.
- **Table helpers in `prose.ts`,** since the replay prints a table too.
- **Live checks on September 23, 2026,** all on the fixture's 8 lines or
  the replay's sample:
  - `bun run eval` took about 22 seconds: 32 Jev calls, all answered as
    `jev-1.13.0` with a median of 2,147 input tokens, Jev right on the kind
    of all 8 lines, and five cut-offs (four of 0.807 and one that held
    every line). Median latency: embeddings 195 ms, Jev 361 ms.
  - `--unnamed`: neither the report nor the plot holds "jev" or "TypeSafe".
  - The replay through `wrangler dev`, the key from the shell and made-up
    local values for the other two secrets: all 10 lines answered, 27 slot
    changes on 8 lines, one hold. Through the team's relay: all 10 answered,
    Jev 142 to 217 ms, 26 slot changes on 8 lines, one hold.

[services-notes]: /docs/research/0042-turn-eval-services.md
[stats-notes]: /docs/research/0043-turn-eval-statistics.md

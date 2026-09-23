# Turn's calibration and three extra rankers: implementation plan

**Goal:** Close [issue #45][extras-issue]: the evaluation gains three
rankers, `bge-reranker-base` over the shortlist, `qwen3-embedding-0.6b` with
Turn's instruction, and Apple's sentence embedding on a Mac, and a
reliability diagram and Brier score for Jev's top phrase. A second run on
the 80 lines shows them in a report of its own (EVAL-8).

**Architecture:** In `@turn/eval`, `workers-ai.ts` holds the call every
Workers AI model shares. `embeddings.ts` gains qwen3, whose lines go as
queries and phrases as documents. `reranker.ts` is the cross-encoder, and
`apple.ts` starts `sentence-embedding.swift` once per run and pipes it
texts. `calibration.ts` fits the pool-adjacent-violators (PAV) algorithm,
draws the consistency band, gives the Brier score with its decomposition,
and plots them as an SVG. `report.ts` scores seven rankers and adds the
calibration section. A second pull request commits the report of one run,
made at a commit already on `main`.

**Tech Stack:** TypeScript 6.0.3 and Vitest 4.1.11 in a Bun 1.4.2
workspace; Workers AI's REST API; Swift 6.4 and the NaturalLanguage
framework on macOS 27.0; `@typesafe-ai/sdk` 0.6.0 for Jev, unchanged;
graphify; the `gh` CLI; and subagents for research and review.

**Spec:** [Issue #45][extras-issue] and its comments, under the spec in
[issue #13][spec]; the PRD's [evaluation requirements][prd-eval], EVAL-8
above all, with EVAL-2 to EVAL-6; and the TRD's sections on
[the rankers][trd-rankers], [metrics, intervals, and thresholds][trd-metrics],
and [the report][trd-report]. The user's goal directive, verbatim:
"/ask-matt Complete and close #45. Follow @docs/references/markdown-style.md
(use List instead of TOC) and this workflow: branch -> /research (10-minute
max) -> plan -> implement -> create small and atomic commits -> push branch
-> PR -> code review -> resolve -> merge -> delete branch."

Contents:

1.  [Global constraints](#global-constraints)
1.  [Skills](#skills)
1.  [Design](#design)
1.  [Verification gate](#verification-gate)
1.  [Tasks](#tasks)
1.  [What changed while building](#what-changed-while-building)
1.  [Review, round 1](#review-round-1)
1.  [The second run](#the-second-run)
1.  [Appendix: the run's script](#appendix-the-runs-script)

[extras-issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/45
[spec]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/13
[prd-eval]: /docs/PRD.md#evaluation-requirements
[trd-rankers]: /docs/TRD.md#the-rankers
[trd-metrics]: /docs/TRD.md#metrics-intervals-and-thresholds
[trd-report]: /docs/TRD.md#the-report

## Global constraints

- **#45's acceptance criterion,** verbatim: "The table shows the diagram,
  the Brier score, and the three extra rankers (EVAL-8)"
- **#45's comment from #95,** in part: "Adding rankers means running
  `bun run eval` on the 80 lines again, which calls Jev again, and its
  answers vary a little between calls. The README's table stays the first
  run's, so report the extra rankers and the calibration apart, and say which
  run each number comes from." For Apple's embedding: "pin a revision with
  `sentenceEmbedding(for:revision:)`, log its `revision` and `dimension`,
  and call `vector(for:)` from one thread."
- **Jev's settings don't change.** `eval/test/frozen.test.ts`'s checks pass
  unchanged at every commit, and the file gains only a stand-in for Apple's
  helper, so the second run asks Jev what the first asked (EVAL-2).
- **The 80 lines once more, once.** Only the second run, at a commit on
  `main` that holds this plan, scores `eval/lines.jsonl`. No test, check,
  review, or live check scores the 80 lines or sends one of them anywhere;
  live checks use the fixture's 8 lines and made-up sentences.
- **Keys stay out of sight.** `TYPESAFE_API_KEY` and `CLOUDFLARE_API_TOKEN`
  come from the environment and never appear in a command line, an output, a
  tracked file, a log, or a comment. The token is the Wrangler login's, read
  with `jq -er` into a plain variable before it's exported, and the account
  ID comes from the accounts that token sees, by the account's name. No
  account ID, email, or workers.dev subdomain goes into the repository, a
  commit, or a GitHub comment; outputs that show one are summarized.
- **Tests reach no service.** Any `fetch` a test doesn't stand in for fails.
  The Swift helper runs in tests only in `apple.test.ts`, only on a Mac, and
  only on made-up sentences; every test that runs `main` stands in for
  Apple's embedding.
- **Versions,** exact: TypeScript 6.0.3, Vitest 4.1.11, Bun 1.4.2,
  `@typesafe-ai/sdk` 0.6.0; no new dependency.
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

- `/research` wrote [the extra rankers' notes][rankers-notes] and
  [the calibration notes][calibration-notes] with two background agents, 10
  minutes each; a live probe then added what the schemas left open.
- `/tdd` drives each task: a failing test, then the code that passes it.
- `/code-review` runs one round on each pull request, with the Standards and
  Spec subagents, this plan and #45 as the spec, plus a fact-check and
  bug-hunt agent.
- `/pr` writes each pull request's body; `receiving-code-review` answers the
  findings, one commit per fix.

[rankers-notes]: /docs/research/0048-turn-eval-extra-rankers.md
[calibration-notes]: /docs/research/0049-turn-eval-calibration.md

## Design

### Decisions

1.  **Two pull requests.** The report names the commit it ran at (EVAL-6),
    and GitHub's rebase merge gives every commit a new hash, so the run
    must happen at a commit already on `main`, as #40's did. The first pull
    request holds the notes, this plan, the code, and the TRD, and it says
    "Part of #45". Once it merges, the run happens in a detached worktree
    at `main`'s head, and the second pull request commits its report, as
    generated, and closes #45.
1.  **The reranker, `reranker`,** posts one request per line to Workers
    AI's `@cf/baai/bge-reranker-base`:

    ```text
    POST https://api.cloudflare.com/client/v4/accounts/<account>/ai/run/@cf/baai/bge-reranker-base
    { "query": "<line>", "contexts": [{ "text": "<phrase>" }, ...] }
    -> { "result": { "response": [{ "id": 0, "score": 0.000834 }, ...] }, "success": true }
    ```

    - The contexts are the shortlist's 40 phrases in the shortlist's order,
      and each answer's `id` is a context's index. The ranker refuses an
      answer unless every index from 0 to 39 comes once with a number, and
      it scores the phrases in the shortlist's order, so a stable sort
      keeps that order among ties.
    - The live probe's scores came between 0 and 1, best first, as a
      sigmoid gives ([live probe][rankers-probe]). Only their order
      matters, since the cut-off for holding comes from five-fold
      cross-validation, as for `embeddings`.
    - It has no question kind, so it takes the phone's yes-or-no rule, and
      its ranking says `onPhone`, so it never brings a big button.

1.  **qwen3, `qwen3`,** is `@cf/qwen/qwen3-embedding-0.6b`. The line goes
    as `queries` with the TRD's instruction, "Given what a conversation
    partner just said, retrieve the reply that answers it", and the
    phrases as `documents`, in their own requests of at most 32. The probe
    found that one request can't hold both (code 3030), that Workers AI
    formats the instruction as Qwen's card does, and that its vectors hold
    1,024 numbers of unit length. The ranker refuses an answer whose
    `shape` isn't `[n, 1024]`, and ranks by cosine with a cross-validated
    cut-off, as `embeddings` does.
1.  **Apple's sentence embedding, `apple`,** runs in a Swift helper,
    `eval/src/sentence-embedding.swift`, which `apple.ts` starts once with
    `swift` for the whole run:

    ```text
    swift sentence-embedding.swift 1
    <- {"revision":1,"dimension":512,"system":"Version 27.0 (Build 26A428)"}
    -> ["Do you want some tea?","Yes, please."]
    <- [[0.01, ...], [0.02, ...]]
    ```

    - It loads English at the revision its argument names, with
      `sentenceEmbedding(for:revision:)`, and exits with a message naming
      the revisions the Mac has if that one is missing. It writes the
      revision, the dimension, and the system's version, then answers each
      line of standard input, a JSON array of texts, with a line holding
      their vectors, all from one thread. A text with no vector ends it
      with a message, and the end of standard input ends it quietly.
    - `apple.ts` pins revision 1, which this Mac has, refuses any other in
      the first line, and checks that each answer holds one vector of the
      dimension's length for each text. Its `close` ends standard input.
    - The ranker is `embeddings` with this embedding: a cosine between the
      line's vector and each phrase's. Apple's
      `distance(between:and:distanceType:)` measured the square root of 2
      minus twice that cosine in the probe, which orders phrases the same.
    - A helper that stays open times each line as the phone would: the
      prototype answered one text in about 2 ms after a first answer at
      about 0.2 s, where a process started per line would count its start
      every time and `execFile` would cut its output at 1 MiB.
    - Tests stand in for the helper with a script run by `node`, except one
      test that runs the real helper on a Mac, on made-up sentences.

1.  **Shared pieces.** `runModel(model, env)` in `workers-ai.ts` posts to a
    model's endpoint with the account and token from the environment and
    returns the answer's `result`, throwing Cloudflare's codes, never the
    token, for an answer that isn't a success. bge's embedder, qwen3's, and
    the reranker share it, and bge's embedder and qwen3's share the
    batching and the vectors' checks. `embeddings(embed, query)` takes an
    optional second embedder for the line: without one, the line and its
    unseen phrases go in one request, as now. `phoneKind(line)` in
    `rankers.ts` gives the phone's yes-or-no rule as a kind, for the three
    rankers that take it.
1.  **Cosines stay cosines.** The report ranks only the phrases a ranker
    scores above 0. In the probe, Apple's cosines ran from 0.06 to 0.65 and
    qwen3's were 0.29 and 0.55, and BGE's card puts its similarities "about
    in the interval" from 0.6 to 1 ([evaluation notes][eval-bge]). So the
    cosine rankers keep raw cosines, as `embeddings` does, and a phrase at
    or below 0 would count as unranked; rescaling them would change
    `embeddings`' cut-offs between the two runs.
1.  **What calibration scores.** Each line's top phrase in Jev's first timed
    ranking, the first of its order, which breaks ties as the row does, and
    whether that phrase is acceptable. All 80 lines count: a line with no
    acceptable reply is never right, which is what the 0.6 floor is for. A
    line where Jev scores no phrase above 0 forecasts 0 and isn't right.
    This is Guo et al.'s confidence calibration, covering only the phrase
    the row would show ([calibration notes][calibration-top]).
1.  **The reliability diagram is CORP's.** PAV fits one recalibrated value
    to each distinct score, pooling tied scores first, which gives the fit
    that `reliabilitydiag`'s hits-first order does. It needs no bins and no
    rule for ties at a bin's edge, where note 0025's five bins of 16 would
    need both ([calibration notes][calibration-bins]).
1.  **The consistency band** is `reliabilitydiag`'s for small samples, at
    its default level of 90%: resample the lines with replacement, redraw
    each outcome as if its score were calibrated, refit PAV, interpolate
    linearly at the original distinct scores, with none outside a
    resample's range, and take each score's 5th and 95th percentiles, by
    type 7. It draws 9,999 resamples from the committed seed, as the
    paired bootstrap does, where the package defaults to 100; more
    resamples only shrink the error of drawing them.
1.  **The Brier score** is the mean of `(score - right)^2` over the lines,
    with a 95% percentile interval from 9,999 resamples of the lines, and
    beside it CORP's decomposition: `UNC`, the score of always forecasting
    the share of lines that are right; `MCB`, the Brier score minus that of
    the PAV values; and `DSC`, `UNC` minus that of the PAV values, so that
    `BS = MCB - DSC + UNC`. `MCB` replaces the binned calibration error.
    The skill score, `1 - BS / UNC`, says whether the forecasts beat that
    constant forecast, which note 0049 recommends.
1.  **The plot and its text.** The report writes `<out>-reliability.svg`
    beside itself: the diagonal, the band shaded, the PAV line through a dot
    at each distinct score, rules at 0.6 and 0.85, and a bar for each
    distinct score's count of lines below. Its text is a table with a row
    for each PAV block: its scores, lines, acceptable lines, recalibrated
    value, and how many of its scores the fit lies outside the band at,
    since the band holds 90% at each score apart. A sentence then gives the
    Brier score, its interval, `UNC`, the skill score, `MCB`, and `DSC`.
    Before the table, the section counts the lines with no acceptable
    phrase among their 40, whose top phrase is wrong whatever its score, as
    note 0049 asks for the lines with no reply.
1.  **The report** scores seven rankers, in this order: place, keyword,
    embeddings, jev, reranker, qwen3, and apple. Every table, the latency,
    the curves, and the big buttons take the new three as they are.
    - The models line adds `@cf/baai/bge-reranker-base`,
      `@cf/qwen/qwen3-embedding-0.6b` with its instruction, and Apple's
      English sentence embedding with its revision, dimension, and system.
    - The rankers' list says what each new ranker does.
    - The cut-offs' section becomes a table of each ranker with a cut-off
      by fold, printed to three significant figures, since the reranker's
      scores are small.
    - A section on Jev's calibration follows the question kind, with the
      diagram and its text, named as the naming switch says.
1.  **The second run,** written down before it happens:
    - It runs `bun run eval --unnamed --out eval/results-extras.md` once,
      with [the script below](#appendix-the-runs-script), in a detached
      worktree at `main`'s head after the first pull request merges, from
      a clean tree.
    - It writes `eval/results-extras.md`,
      `eval/results-extras-risk-coverage.svg`, and
      `eval/results-extras-reliability.svg`. The three are committed as
      generated, before anyone reads them, and their SHA-256 sums are
      checked in the run's worktree, in the branch, and in the commit.
    - If it stops before writing, the log says why and it runs again; once
      it writes a report, that report is the run's.
    - `eval/results.md`, the first run's, stays as it is, and the TRD and
      #45's closing comment say which run each number comes from.
    - **EVAL-4's verdict stays the first run's.** That comparison was the
      one written down before any result, and the second report's interval
      is a second look at the same lines, which can't change it.
    - **EVAL-5 holds for both runs.** It's a safety rule, so a wrong big
      button on a yes-or-no, pain, or consent line, in any of the second
      run's answers, counts as one in the first run's would. A ticket then
      asks for the relay's policy to give those lines only the fixed buttons
      and the grid, and #45's closing comment says so. The three new rankers
      never bring a big button.
1.  **The TRD** gains the three rankers' rows and how they're called, the
    calibration's method, the cut-offs of four rankers, the reliability
    plot, and, in the second pull request, the second run's report.

[rankers-probe]: /docs/research/0048-turn-eval-extra-rankers.md#a-live-probe-of-both-models-and-apples-embedding
[eval-bge]: /docs/research/0025-turn-evaluation.md#checking-06-and-085-on-turns-data
[calibration-top]: /docs/research/0049-turn-eval-calibration.md#which-calibration-the-top-phrase-checks
[calibration-bins]: /docs/research/0049-turn-eval-calibration.md#whether-note-0025s-bins-still-hold

### Rejected alternatives

- **One pull request merged with a merge commit,** which keeps hashes: the
  repository merges by rebase.
- **Five equal-mass bins of 16:** see decision 8.
- **A compiled helper started for each line:** see decision 4.
- **Rescaling cosines to `(1 + cos) / 2`:** see decision 6.
- **An interval for the skill score or for `MCB` and `DSC`:** the band
  already shows the diagram's uncertainty, and the Brier score's interval
  shows the rest.
- **Top-label calibration,** which conditions on the phrase: each phrase
  would need many lines of its own.

### Out of scope

- The README's table, which stays the first run's ([issue #64][readme-issue]
  gets a note).
- `jev-rerank` (EVAL-4), which runs only when Jev trails; the first run
  found that Jev leads.
- Changing the phone's shortlist or any setting of Jev's.

[readme-issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/64

## Verification gate

Every commit that touches code passes this gate, run from the worktree by a
script that stops at the first failure and never pipes a check into `tail`:

```shell
bun install --frozen-lockfile
bun run test
bun run typecheck
bun run lint
```

- A code line over 120 columns fails the gate, since Prettier won't wrap
  strings or comments.
- Each new rule is mutated once (a line removed or a comparison flipped),
  and its test must fail; a mutation runs only with the suite green.
- Before each push, a fail-closed scan of every object in the repository
  finds neither `TYPESAFE_API_KEY`'s value nor the Wrangler token's, nor
  the account ID.
- The docs pass the scratchpad's `check_md.py`.

## Tasks

### Task 1: Research notes

**Files:** create `docs/research/0048-turn-eval-extra-rankers.md` and
`docs/research/0049-turn-eval-calibration.md`, each its own commit, then
add the live probe to 0048 in a third.

### Task 2: This plan

**Files:** create `docs/plans/0026-turn-calibration-and-extra-rankers.md`.

### Task 3: One call for every Workers AI model

**Files:** create `eval/src/workers-ai.ts`; modify `eval/src/embeddings.ts`
and `eval/test/embeddings.test.ts`.

```ts
export function runModel(model: string, env?: Env): (body: object) => Promise<Record<string, unknown>>
```

`workersAi()` keeps its name and behavior on top of it; its tests pass
unchanged, and new ones cover `runModel`'s missing keys and error codes.

### Task 4: The reranker

**Files:** create `eval/src/reranker.ts` and `eval/test/reranker.test.ts`;
modify `eval/src/rankers.ts`, `eval/src/embeddings.ts`, and
`eval/test/services.ts`.

```ts
export const rerankerModel = '@cf/baai/bge-reranker-base'
export function reranker(env?: Env): Ranker
export const phoneKind = (line: string): Ranking['kind'] => ...
```

Tests: the request's `query` and `contexts` in the shortlist's order; scores
mapped back by `id` from an answer in another order; refusal of a missing,
repeated, or out-of-range `id` or a score that isn't a number; the phone's
kind; no big button at a score of 1. `fakeServices` answers the reranker by
the words a phrase shares with the line.

### Task 5: qwen3

**Files:** modify `eval/src/embeddings.ts`, `eval/test/embeddings.test.ts`,
and `eval/test/services.ts`.

```ts
export const qwenModel = '@cf/qwen/qwen3-embedding-0.6b'
export const qwenInstruction = 'Given what a conversation partner just said, retrieve the reply that answers it'
export function qwen(env?: Env): { queries: Embed; documents: Embed }
export function embeddings(embed: Embed, query?: Embed): Ranker
```

Tests: queries carry the instruction and documents none; 40 phrases go in
requests of 32 and 8; an answer whose `shape` isn't `[n, 1024]` is refused;
with a query embedder, the line goes alone and the phrases apart, and with
none, the old test's single request still holds.

### Task 6: Apple's sentence embedding

**Files:** create `eval/src/sentence-embedding.swift`, `eval/src/apple.ts`,
and `eval/test/apple.test.ts`.

```ts
export const appleRevision = 1
export type SentenceEmbedding = { embed: Embed; revision: number; dimension: number; system: string; close(): void }
export function sentenceEmbedding(command?: readonly string[]): Promise<SentenceEmbedding>
```

Tests, with a `node -e` script as the helper: the first line's revision,
dimension, and system; a wrong revision refused; an answer of the wrong
count or length refused; a helper that exits or can't start says so. On a
Mac, one test runs the real helper: revision 1, 512 numbers, and "Do you
want some tea?" nearer "Would you like a cup of tea?" than "The bus is
late.".

### Task 7: A general percentile bootstrap

**Files:** modify `eval/src/stats.ts` and `eval/test/stats.test.ts`.

```ts
export function bootstrap(n: number, statistic: (sample: readonly number[]) => number): { low: number; high: number }
```

`pairedBootstrap` calls it and draws the same numbers in the same order, so
its tests' pinned values pass unchanged.

### Task 8: PAV, the band, and the Brier score

**Files:** create `eval/src/calibration.ts` and
`eval/test/calibration.test.ts`.

```ts
export type Forecast = { score: number; right: boolean }
export function topPhrase<Line extends ScoredLine>(scores: readonly LineScore<Line>[], ranker: string): Forecast[]
export type Block = { low: number; high: number; lines: number; right: number; value: number }
export function pav(forecasts: readonly Forecast[]): Block[]
export function consistencyBand(forecasts: readonly Forecast[]): { score: number; low: number; high: number }[]
export function brier(forecasts: readonly Forecast[]): Brier
```

Tests: a hand-worked PAV with ties and two violations; an increasing fit
that pools nothing; `BS = MCB - DSC + UNC` to 12 places, `MCB` 0 for
forecasts equal to their PAV values, and `DSC` 0 for a constant fit; the
band's percentiles on a case small enough to check by hand, and missing
values outside a resample's range; the top phrase taken in the row's tie
order.

### Task 9: The reliability plot

**Files:** create `eval/src/svg.ts`; modify `eval/src/curves.ts`,
`eval/src/calibration.ts`, and their tests.

`tag` and `escaped` move to `svg.ts`, and the risk-coverage plot's output
stays the same byte for byte. The plot's test checks its title and
description, the diagonal, one dot per distinct score, the two rules, the
band, and the bars.

### Task 10: Seven rankers and the calibration in the report

**Files:** modify `eval/src/report.ts`, `eval/test/report.test.ts`,
`eval/test/frozen.test.ts`, and `eval/test/services.ts`.

Tests: all seven rankers in every group's tables, the curves, and the
latency; the models line with the three new models, the instruction, and
Apple's revision, dimension, and system; the cut-offs' table; the
calibration section, its image beside the report, and its table and
sentence; `--unnamed` still keeping "jev" and "TypeSafe" out of every
output. `main` closes Apple's helper even when a ranker throws.

### Task 11: The TRD

**Files:** modify `docs/TRD.md`: the rankers' table and how they're called,
the metrics' calibration and cut-offs, and the report.

### Task 12: A live check on the fixture

With the real services and the Swift helper, run the command below on the
fixture's 8 lines, then again with `--unnamed`; the plan records what the
report shows.

```shell
bun run eval --lines eval/test/fixture/lines.jsonl --out <scratch>/results.md
```

### Task 13: The first pull request

Push, open it as "Part of #45", run `/code-review`, resolve the findings,
refresh the graph, and merge by rebase.

### Task 14: The run

In a detached worktree at `main`'s head, run
[the script](#appendix-the-runs-script) once, then commit the three outputs
on a new branch before reading them.

### Task 15: The second pull request and #45

Record the run in this plan and the TRD, open the pull request closing #45,
review it, merge it, tick #45's box with the evidence, and note the second
report on #64.

## What changed while building

- **Tests in their own files.** `runModel`'s tests went into
  `eval/test/workers-ai.test.ts`. Its missing-key message now names Workers
  AI rather than the embeddings ranker, since three rankers share it, so
  one expected message in `embeddings.test.ts` changed.
- **Two made-up vectors, not one with a length.** Giving `fakeVector` a
  second parameter broke `texts.map(fakeVector)`, which passes the index as
  the second argument, so `fakeQwenVector` makes qwen3's 1,024 numbers apart.
- **`svg.ts` holds the page too.** Beside `tag`, it wraps a plot's elements
  in the document with its title, description, and white page, which both
  plots share; the risk-coverage plot's output stayed the same byte for byte.
- **`close` waits.** Apple's `close` ends the helper's input and resolves
  once it exits, and `main` awaits it in a `finally`.
- **A seventh color.** Six colors served four curves; the seventh ranker
  would have taken the first's orange, so Okabe and Ito's blue follows them.
- **Graded stand-in scores.** The stand-in reranker scored 0.9 or 0.01, so
  every fold held every line; it now scores a made-up cosine over 1,000, as
  small as the probe's scores, so the report's test sees a cut-off such as
  0.000612 printed to three significant figures.
- **"The 80 lines once"** in the TRD became "The 80 lines from a clean
  tree", since #45 scores them a second time.
- **Mutations.** Most new rules were mutated once while building. Nine
  survivors got tests: bge's second `shape` number, the order of the
  helper's vectors, the band's level, a share right other than a half, the
  floor's rule apart from the grid line under it, the band's outline, qwen3
  taking each line as a query in the report's run, the cut-offs' figures,
  and the band's range in the table. One survivor is equivalent: the report
  prints the helper's revision, which can only be the pin. The review's
  fact-check then mutated rules left untried, and its survivors got tests
  too (see the review's record).
- **A gate piped into `tail`** let a 121-column Swift line into a commit,
  which was amended before any push; the gate now runs unpiped, its exit
  code checked.

### The live check on the fixture

On September 23, 2026 (UTC), at `817f443`, `bun run eval` scored the
fixture's 8 lines with the real services and the Swift helper, in 1 minute
and 42 seconds:

- **Models:** all 32 of Jev's calls answered as `jev-1.13.0`, and the
  models line named Workers AI's three, qwen3's instruction, and Apple's
  embedding at revision 1, of 512 numbers, on macOS 27.0 (Build 26A428).
- **Ranking:** every ranker had 4 of 6 lines' replies in its top 6 but
  place, with 1, and apple, with 3; in top 1, embeddings and qwen3 had 4,
  keyword and the reranker 3, Jev 2, and apple none.
- **Calibration:** Jev's top phrase was acceptable on 2 of 8 lines. Its fit
  pooled 0.47 to 0.78 (4 lines, none right), 0.95 to 0.96 (3 lines, 1
  right), and 0.97 (1 line, right). The Brier score was 0.457, with an
  interval of 0.220 to 0.684, against 0.188 for always forecasting the
  share, with a miscalibration of 0.373 and a discrimination of 0.104.
- **Cut-offs:** 0.807 for embeddings, 0.924 for the reranker, and 0.758 for
  qwen3 in four folds, and holding every line in the fifth; apple held
  every line in every fold.
- **Latency:** at the median, embeddings 149 ms, Jev 373 ms, the reranker
  394 ms, qwen3 1,076 ms (4,019 ms at the 95th percentile), and apple 9 ms.
- **Naming off:** with `--unnamed`, neither the report nor either plot held
  "jev" or "TypeSafe".

## Review, round 1

One round on #97, [posted there][review-97], had three reviewers: Standards,
Spec with #45 and this plan as the spec, and a fact-check and bug hunt. They
found 52 things: 10 Standards judgement calls with no hard violation, 4 Spec
findings, and 38 from the fact-check, which found no error in the rankers,
PAV, the band, the Brier score, or the bootstrap. Fixes went in one commit
each, or one for a group, and each code fix came with a test that fails
without it.

- **Fixed in the code:**
  - The table's band column ran across a block's scores and could hide a
    fit outside the band at every score; each block now counts the scores
    where its fit leaves the band.
  - Tests now pin the band against an exact count of every resample of
    five lines, a block of several scores, the printed interval, all four
    groups, and the helper's close, its kill, and a stop partway.
  - The reranker refuses a score outside 0 to 1, and a helper whose first
    line isn't JSON is stopped with a clear error.
  - A band at one score draws as a bar, and the hidden model's name is in
    lower case mid-sentence.
  - The report now gives the skill score and the lines beyond reach, which
    note 0049 had asked for. It also says that the band is pointwise, that
    the decomposition adds up before rounding, where the Wilson intervals
    apply, and that apple's time is a Mac's.
  - Names that clashed or said too little were renamed. One bootstrap of a
    mean, one grid, one grouping by score, and the fold count are shared.
- **Fixed in the docs:** the TRD's Testing and calibration bullets; this
  plan's rules for EVAL-4 and EVAL-5 after the rerun, its Spec line, and
  its claims about the freeze, the helper's end of input, and the mutants;
  and every note finding, each checked against its source first.
- **Fixed on GitHub:** the body's "and closes #45", which linked the issue
  to close on merge, and its links to the branch.
- **Kept:**
  - The seventh color's `fix` type: `plot` promised each curve its own color
    and gave a seventh the first's orange whatever the report drew, and a
    reword would force-push over reviewed commits.
  - Adding a ranker still touches several places, since each says
    something different about it: how to call it, how the report describes
    it, its color, and its cut-off.
  - The helper's first-line check stays, since it checks an outside
    process's output as Workers AI's answers are checked, and it now stops
    the helper too.
  - The helper has no timeout: the run is attended, a helper that has named
    itself answers in milliseconds, and the report is written only at the
    end, so an interrupted run leaves nothing half-written.

[review-97]: https://github.com/RevenueCat-M1KU/RevenueCat/pull/97#issuecomment-5799598837

## The second run

The first pull request merged as `1b3ff03` at 18:11:26 UTC on
September 23, 2026. The run followed decision 13:

- **How it ran:** once, with the appendix's script, whose text hadn't
  changed since this plan was written, in a detached worktree at `1b3ff03`
  from a clean tree. It ran from 18:12:08 to 18:34:16 UTC and exited 0, and
  it wrote its report on the first try. The report gives the Mac's local
  date, September 24, 2026.
- **As generated:** the three outputs were committed before anyone read
  them, and each file's SHA-256 sum is the same in the run's worktree, in
  the branch, and in the commit: `results-extras.md` begins `e6a000c0`, the
  risk-coverage plot `14eda5ec`, and the reliability diagram `9332afa4`.
- **Models:** all 320 of Jev's calls answered as version 1.13.0, and
  Apple's embedding was revision 1, of 512 numbers, on macOS 27.0 (Build
  26A428).
- **The extra rankers:** on the 64 lines with an acceptable phrase besides
  the fixed buttons, in top 6, qwen3 had 42%, the reranker 34%, and apple
  23%, against Jev's 75% and embeddings' 45%; in top 1, 19%, 16%, and 4.7%,
  against Jev's 67%. On all 80 lines, qwen3's changed rows were wrong 61%
  of the time, the reranker's 67%, and apple's 71%, against Jev's 22%.
- **The first four rankers:** they match the first run in every ranking
  table, the question kind, and each subset. Jev showed a big button on
  one more line and a row on one fewer, its curve's points shifted, and the
  latency differs.
- **EVAL-4, a second look:** Jev minus embeddings in top 6 is +29.7 points,
  with an interval of 17.2 to 42.2, as in the first run, whose verdict
  stands: Jev leads.
- **EVAL-5:** the one big button on a yes-or-no, pain, or consent line is
  line-05's "Yes, go ahead", which is right. Jev gave it in 2 of its 4
  answers for the line, where the first run had it in 1. None is wrong, so
  the rule asks for nothing.
- **Calibration:** Jev's top phrase was acceptable on 43 of the 80 lines,
  and 22 were beyond reach. Every top phrase from 0.83 up, around the big
  button's bar of 0.85, was right. Around the floor of 0.6, from 0.44 to 0.65,
  top phrases were right 7 times in 30, well under what their scores say,
  and the fit left the band at 11 of those 15 scores. The fit's blocks:
  - 0.24 to 0.43: 4 lines, none right.
  - 0.44 to 0.58: 14 lines, 3 right, outside the band at 5 of 9 scores.
  - 0.59 to 0.65: 16 lines, 4 right, outside at all 6 scores.
  - 0.66: 2 lines, 1 right.
  - 0.67 to 0.82: 23 lines, 14 right, outside at 6 of 13 scores.
  - 0.83 to 0.95: 21 lines, all right.
- **The Brier score:** 0.211, with an interval of 0.170 to 0.254, against 0.249
  for always forecasting the share, for a skill of 0.151. The miscalibration
  was 0.069 and the discrimination 0.107.
- **Cut-offs:** embeddings 0.469 in four folds and 0.502 in one; the
  reranker 0.0449 in three, 0.0457, and 0.0233; qwen3 0.375 in four and
  0.410; apple 0.554 in four and 0.563.
- **Latency:** at the median, embeddings 172 ms, Jev 1,123 ms, the reranker
  414 ms, qwen3 1,278 ms (6,496 ms at the 95th percentile), and apple 6.5 ms
  on this Mac.
- **The plot's legend:** in its top right corner, it covers parts of the
  seven curves, where it cleared the first run's four. The file stays as
  the run wrote it. The table under the plot gives each curve's risk at 80%
  and 100% coverage, where the legend sits, and [issue #101][legend-issue]
  moves the legend.

`eval/results.md` stays the first run's, at `8ea25eb`, and is the table the
README will copy. `eval/results-extras.md` is the second run's, at
`1b3ff03`, and every result above comes from it.

[legend-issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/101

## Appendix: the run's script

`run.zsh`, run as `zsh -ic 'zsh run.zsh <worktree> <commit>'` so that
`TYPESAFE_API_KEY` comes from `~/.zshrc` into the environment, never onto a
command line:

```zsh
#!/bin/zsh
# Runs `bun run eval` for #45 in the given worktree, at the given commit on
# main, from a clean tree, with the keys in the environment only.
setopt err_exit pipe_fail no_unset
cd "${1:?}"
[[ $(git rev-parse HEAD) == "${2:?}" ]] || { print -u2 "Not at $2"; exit 1 }
git merge-base --is-ancestor HEAD origin/main || { print -u2 'Not on main'; exit 1 }
git diff --quiet HEAD || { print -u2 'The tree has changes'; exit 1 }
token=$(cd worker && bunx wrangler auth token --json | jq -er .token)
account=$(printf 'url = "https://api.cloudflare.com/client/v4/accounts?per_page=50"\nheader = "Authorization: Bearer %s"\n' \
  "$token" | curl -sS -K - | jq -er '.result[] | select(.name == "Turn") | .id')
export CLOUDFLARE_API_TOKEN=$token CLOUDFLARE_ACCOUNT_ID=$account
: "${TYPESAFE_API_KEY:?}"
bun run eval --unnamed --out eval/results-extras.md
```

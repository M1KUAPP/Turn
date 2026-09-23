# Turn's evaluation harness implementation plan

**Goal:** Close [issue #29][harness-issue]: one command that scores the
`place` and `keyword` rankers on labeled partner lines and writes the
report, and a script that checks EVAL-1's quotas and prints the labelers'
agreement.

**Architecture:** Seven files in `eval/src/`, the `@turn/eval` package.
`stats.ts` holds the arithmetic: Wilson intervals, percentiles, and chance
rates. `rankers.ts` holds the two rankers, each returning the `Ranking` the
row's rules take. `score.ts` picks each line's shortlist with the app's
code, runs the rankers and the row's rules, times them, and sums up any
group of lines. `agreement.ts` compares two labelings. `data.ts` reads the
lines, a second labeling, and the app's starter bank. `report.ts` renders
the report for `bun run eval`, and `count.ts` prints the quotas and the
agreement for `bun run eval:count`.

**Tech Stack:** TypeScript 6.0.3 and Vitest 4.1.11 in a Bun 1.4.2
workspace; `@turn/shared`'s shortlist and row rules; graphify; the `gh`
CLI; and subagents for research and review.

**Spec:** [Issue #29][harness-issue], under the spec in [issue #13][spec];
the PRD's [evaluation requirements][prd-eval]; and the TRD's sections on
[the evaluation data][trd-data], [the rankers][trd-rankers],
[metrics, intervals, and thresholds][trd-metrics], and
[the report][trd-report]. The user's goal directive, verbatim:
"/ask-matt Complete and close #29. Follow @docs/references/markdown-style.md
(use List instead of TOC) and this workflow: branch -> /research (10-minute
max) -> plan -> implement -> create small and atomic commits -> push branch
-> PR -> code review -> resolve -> merge -> delete branch."

Contents:

1.  [Global constraints](#global-constraints)
1.  [Skills](#skills)
1.  [Design](#design)
1.  [Verification gate](#verification-gate)
1.  [Tasks](#tasks)

[harness-issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/29
[spec]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/13
[prd-eval]: /docs/PRD.md#evaluation-requirements
[trd-rankers]: /docs/TRD.md#the-rankers
[trd-metrics]: /docs/TRD.md#metrics-intervals-and-thresholds
[trd-report]: /docs/TRD.md#the-report

## Global constraints

- **#29's acceptance criteria,** verbatim:
  - "One command writes the report for the place and keyword rankers on a
    fixture of lines (EVAL-3)"
  - "The count script prints each EVAL-1 quota and the labelers' agreement
    (EVAL-1)"
  - "Every rate carries its Wilson interval; a top-6 rate of 56 of 80
    prints 59% to 79%"
  - "The report names the date and the commit, and gives each ranker's
    latency"
  - "The report says who wrote the 80 lines and the starter bank, as the
    TRD's [evaluation data][trd-data] records"
- **#29's comments** add that the `keyword` ranker is `pickShortlist`, then
  `rankOnPhone` with the same context, then `applyAnswer` from `emptyRow`,
  and that a hold shows as `row.answers` below the answer's sequence number.
- **Scope.** The Jev and embeddings rankers, the question kind's accuracy
  and confusion matrix, the paired bootstrap, the list of big buttons on
  yes-or-no, pain, and consent lines, the risk-coverage curves, and the
  model pin are [#36][jev-ticket]'s. Calibration and the extra rankers are
  [#45][extras-ticket]'s, the first run on the 80 lines is
  [#40][run-ticket]'s, the README's table is [#64][readme-ticket]'s, and the
  labels are [#21][labels-ticket]'s.
- **Code** follows the repo's Prettier settings (single quotes, no
  semicolons, 120 columns, no trailing commas) and TypeScript's `strict`.
- **Markdown** follows
  [the Markdown style guide](/docs/references/markdown-style.md), with a
  `Contents:` list in lazy numbering (`1.  [Heading](#anchor)`) instead of
  `[TOC]`: one H1, prose wrapped at 80 characters (links, tables, headings,
  and code blocks are exempt), a language on every fenced code block, and
  repo links as root paths.
- **Commits** follow Conventional Commits: a lowercase subject, a header of
  at most 100 characters, body lines of at most 100 characters written in a
  heredoc, no body line that starts with a word and a colon or with an issue
  reference, and no attribution lines. Stage explicit paths only, never `-A`
  or `.`, and never `skills-lock.json`, `.agents/`, or `.claude/`.
- **The worktree.** Another session is labeling the lines for #21 in the
  main checkout, so this change is built in a separate worktree,
  `../revenuecat-score-rankers`, on the branch `eval/score-rankers`.
- Absolute dates only. Use they/them for anyone whose pronouns aren't
  stated.

[jev-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/36
[extras-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/45
[run-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/40
[readme-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/64
[labels-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/21

## Skills

`/ask-matt` sends a ticket from `/to-tickets` to `/implement`, which builds
at agreed seams with `/tdd`, runs the full suite at the end, and closes with
`/code-review`. The directive's steps map to skills:

- **`/research`:** one background agent, capped at 10 minutes, wrote
  [the harness notes][note] in about nine, and the session checked its
  oracle values with a script of its own.
- **`/tdd`:** each behavior starts from a failing test at one of the seams
  below, run by the root's `bun run test`.
- **`/pr`:** the pull request's body.
- **`/code-review`:** one round, on its Standards and Spec axes, with issue
  #29 and this plan as the spec, plus an agent that checks the facts.

The seams are each file's exports: `wilson`, `percentile`, `chanceHit`, and
`chanceReciprocalRank` in `stats.ts`, beside the `mean` two modules share;
`place` and `keyword` in `rankers.ts`; `scoreLines`, `summarize`, and
`sharesNoWord` in `score.ts`; `compareLabelings` and `masiDistance` in
`agreement.ts`; `readRows`, `phrasesOf`, `checkLabels`, and `linesFrom` in
`data.ts`; and `main` in `report.ts` and `count.ts`, the two commands.

[note]: /docs/research/0035-turn-eval-harness.md

## Design

### Decisions

1.  **The bank is always the app's.** Both commands read
    `app/src/content/starter-bank.json`, as the TRD's evaluation data asks,
    so the report's record of who wrote the bank is always true. The lines
    and the second labeling default to `eval/lines.jsonl` and
    `eval/second-labeling.jsonl`, and `--lines` and `--second` name other
    files; `--out` names the report, `eval/results.md` by default.
1.  **No ranker runs on the 80 lines here.** The commands are built and
    tested on a fixture of 8 lines in `eval/test/fixture/`, written for the
    tests with the bank's real ids, as #36 asks for its rankers; the first
    run on the 80 lines is #40's, after Jev's settings are frozen (EVAL-2).
1.  **The labels' format is #21's.** Each line gains `labeler` and
    `acceptable`, the ids of every acceptable reply, or `[]` for none, and
    the second labeling is a JSON Lines file of `id`, `labeler`, and
    `acceptable` per line. The readers fail loudly on a line with no
    labels, an id the bank doesn't hold, or a line the second labeling
    lacks, so until #21's labels land, both commands stop with a message
    on the 80 lines.
1.  **One shortlist per line, from a fresh bank.** Each line is scored
    alone, from an empty row, with its place and no taps, so the
    most-tapped step adds nothing and the place's step takes the place's
    first eight phrases in the bank's order; the report says so, as the
    TRD asks. Both rankers order the same 40, which for `keyword` is also
    the phone's whole path; ranking over the whole bank matters only for
    #36's rankers.
1.  **Rankers return a `Ranking`, and the row's rules make the row.** A
    ranker takes a line, its shortlist, the index, and the context, as
    `rankOnPhone` does, and the harness applies `applyAnswer` to
    `emptyRow` with `startingPolicy` and sequence number 1, so the report
    scores the rows the app would show.
    - `keyword` is `rankOnPhone`.
    - `place` scores the shortlist's phrases tied to the line's place 1 and
      the rest 0, each group in the bank's order, and marks its ranking as
      the phone's own, with no kind or topic. It never uses the line, never
      gets a big button or the fixed buttons, and never holds while its
      place has a phrase in the 40.
1.  **Ranking metrics.** They count the lines with an acceptable phrase
    besides Yes, No, and Not sure, since the rankers never order the fixed
    buttons, which come from the question-kind call. A ranker's order is
    its scores, highest first, with ties in the order its ranking gives.
    Top 1 and top 6 are hits when an acceptable phrase is among the first
    one or six, and the reciprocal rank is 1 over the first one's rank, or
    0 when none is in the 40.
    - **Chance** is the mean over the same lines of each line's own
      chance, for a random order of its N shortlist phrases with g
      acceptable ones among them: 1 − C(N − g, k)/C(N, k) at k, and
      Σ (1/r)·C(N − r, g − 1)/C(N, g) for the reciprocal rank
      ([chance notes][notes-chance]). It's an expectation, not an observed
      rate, so it carries no interval.
    - **The mean reciprocal rank** is a mean of ranks, not a rate, so it
      carries no Wilson interval either; the report says so.
    - **The shortlist's recall at 40** is the share of those lines with an
      acceptable phrase in the 40. It's the same for both rankers, so the
      report gives it once per group of lines.
1.  **Row outcomes.** A row whose `answers` stays below the line's sequence
    number is a hold: right on a line with no acceptable reply, else a
    missed reply. A big button is right when its phrase is acceptable, and
    a row is right when any slot, the fixed buttons' among them, holds an
    acceptable id. Coverage is the changed rows over all lines, and risk
    the wrong ones over the changed rows. The always-hold baseline is right
    on every line with no acceptable reply and misses the rest.
1.  **Every rate carries a Wilson interval,** NIST's formula with
    z = 1.959963984540054, clamped to [0, 1] ([Wilson notes][notes-wilson]).
    A cell reads "56 of 80, 70% (59% to 79%)", in whole percents at or
    above 10% and to one decimal below, as the TRD writes 2.5% and 15%. A
    rate over no lines reads "0 of 0", with no interval.
1.  **Groups of lines.** The report scores all lines, then three subsets,
    each with its ranking and row tables: yes-or-no lines, by the writer's
    `yes_no` kind; pain and consent lines, whose `concerns` hold `pain` or
    `consent`, the lines EVAL-5 names; and lines that share no word with a
    reply.
1.  **"Shares no word with a reply"** is #21's rule for EVAL-1's quota, so
    the report's subset and the count agree: a line counts if it has an
    acceptable reply besides the fixed buttons and `PhraseIndex.match`,
    over its acceptable replies alone, finds none of them. The fixed
    buttons' words count, so each reply goes to the index without its
    `fixed` flag. Words are whole, lowercased, and outside `commonWords`,
    as the phone matches them.
1.  **Latency.** One warm-up pass over every line, which the report drops,
    then three timed passes, one line at a time, as the TRD asks
    ([timing notes][notes-timing]). `performance.now()` times the
    shortlist, then each ranker's ranking and the row's rules, and the
    report gives each step's median, 95th percentile, and maximum in
    milliseconds. Percentiles are Hyndman and Fan's type 7, NumPy's
    default, so the median is the usual one and the maximum is the 100th
    percentile ([percentile notes][notes-percentiles]).
1.  **The report** is Markdown with a generated `Contents:` list. Its
    header names the date in long form, the commit's short hash, with
    "with uncommitted changes" when `git diff --quiet HEAD` fails, and the
    files it read. "Who wrote the data" counts the lines' authors and
    labelers from the file, then quotes the TRD's record of who wrote the
    80 lines and the starter bank. The tables are padded as Prettier pads
    them, so the file passes `bun run lint` when #40 commits it.
1.  **The count script** prints each EVAL-1 quota with its count: exactly
    80 lines, and at least 16 with no acceptable reply, 24 yes-or-no, 8
    about pain or health, 4 asking for consent, and 10 that share no word
    with a reply. It exits 1 when one falls short. It then prints the
    agreement between the lines' labeling and the second one
    ([agreement notes][notes-agreement]):
    - the none-or-some call per line, as a two-by-two table with percent
      agreement, Cohen's kappa, and positive and negative agreement, since
      kappa alone misleads when the margins are unbalanced;
    - positive agreement over line-and-phrase pairs, with every phrase the
      row can rank and, on yes-or-no lines, the fixed buttons as the
      candidates, then negative agreement and kappa with the pairs'
      count, since those two move with it;
    - Krippendorff's alpha with the MASI distance over the sets, with exact
      thirds, none against none at 0, and none against any set at 1.

    No source the notes read gives an interval for these, so none is
    printed.

1.  **`data.ts` builds on #21's.** #21's pull request adds
    `eval/src/data.ts`, with the labels' types, for the package's checks.
    This branch is stacked on that pull request and extends the module with
    what the commands need, and #21's check of EVAL-1's quota uses
    `sharesNoWord`, so the rule has one home. It rebases onto `main` once
    #21's pull request merges.
1.  **Commands.** Each command's file exports `main`, which its test calls,
    and runs it when `import.meta.main` is true, as Node 26 and Bun both
    set it. The root's `package.json` gains `eval` and `eval:count`, which
    run the files with Bun.

[notes-chance]: /docs/research/0035-turn-eval-harness.md#chance-rates
[notes-wilson]: /docs/research/0035-turn-eval-harness.md#the-wilson-interval
[notes-timing]: /docs/research/0035-turn-eval-harness.md#timing-javascript
[notes-percentiles]: /docs/research/0035-turn-eval-harness.md#percentiles-for-latency
[notes-agreement]: /docs/research/0035-turn-eval-harness.md#agreement-between-two-labelers

### Rejected alternatives

- **A fixture bank:** the report's record of who wrote the bank would be
  wrong for it, and the TRD ranks the phrases a user starts with.
- **Running the rankers on the 80 lines now:** it would be the first run,
  before Jev's settings are frozen.
- **Wilson intervals on the mean reciprocal rank or chance:** one is a
  mean of ranks, and the other an expectation.
- **Nearest-rank percentiles:** type 7 keeps the median, the 95th
  percentile, and the maximum under one definition and matches NumPy.
- **The row's outcomes for `place` without the row's rules:** the rules are
  what the app runs, and they already hold, fill, and cap the row.
- **Kappa alone for the agreement:** it drops when most pairs are "not
  acceptable", the prevalence problem the notes quote.
- **Bootstrap intervals for the agreement:** no source read gives a method,
  and the ticket asks for the agreement, not its uncertainty.

### Out of scope

- The Jev and embeddings rankers, the question kind's accuracy, the paired
  bootstrap, the EVAL-5 list, the risk-coverage curves, and the model pin
  (#36); calibration and the extra rankers (#45).
- The run on the 80 lines and the committed `eval/results.md` (#40), the
  README's table (#64), and the labels (#21).

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
Prettier, `check_md.py` with `--contents`, and `fact_scan.py` for new prose.
Before the pull request, `bun run eval` and `bun run eval:count` run on the
fixture, and `prettier --check` passes on the report they write.

[docs-gate]: /docs/plans/0009-plan-storage.md#verification-gate

## Tasks

Every subagent prompt carries the repo rule: run `graphify query "<question>"`
before grepping or reading repo files. No subagent sends the user's email
address or any personal identifier to an API, and none writes a repo file
its prompt doesn't name or runs git.

Each code task is one red-then-green cycle at its seam: write the failing
test, see it fail for the right reason, write the least code that passes,
run the gate, and commit. Expected values come from the notes' worked
examples, the TRD, or arithmetic done by hand, never from the code under
test.

### Task 1: Research note

A background agent wrote `docs/research/0035-turn-eval-harness.md` in
about nine minutes. The session recomputed its alpha, Wilson, chance, and
kappa values with its own script, and the note passed the docs gate, with
fact-scan misses only for its own arithmetic. It was committed as
`docs(research): add notes on the evaluation harness`.

### Task 2: This plan

- [ ] **Step 1: Run the docs gate, then commit** as
      `docs(plan): add the plan for the evaluation harness`.

### Task 3: The Wilson interval

**Files:** create `eval/src/stats.ts` and `eval/test/stats.test.ts`.

- [ ] **Step 1: Test** that `wilson(56, 80)` spans 0.592318 to 0.789354,
      that 0 of 80 starts at exactly 0 and 80 of 80 ends at exactly 1, and
      that 0 of 0 has none.
- [ ] **Step 2: Implement, run the gate, and commit** as
      `feat(eval): add the Wilson interval for a rate`.

### Task 4: Percentiles

- [ ] **Step 1: Test** `percentile`, which takes q from 0 to 100 as
      NumPy's does, against NumPy's default: 5.5 and 9.55 at the 50th and
      95th for 1 to 10, 120.5 and 228.05 for 1 to 240, the maximum at the
      100th, and any order of input.
- [ ] **Step 2: Implement, run the gate, and commit** as
      `feat(eval): add type 7 percentiles for timings`.

### Task 5: Chance rates

- [ ] **Step 1: Test** `chanceHit` and `chanceReciprocalRank` against the
      notes' exact values: 1/3 at 1, 4/5 at 3, and 29/50 for N = 6 and
      g = 2; 2.5%, 15%, and 0.106964 for N = 40 and g = 1; and 0 for g = 0.
- [ ] **Step 2: Implement, run the gate, and commit** as
      `feat(eval): add chance rates for a random order`.

### Task 6: The rankers

**Files:** create `eval/src/rankers.ts` and `eval/test/rankers.test.ts`.

- [ ] **Step 1: Test,** on a small bank built in the test: `place` scores
      the place's phrases first in the bank's order whatever the line, and
      its row is the first six, never a big button or the fixed buttons;
      `keyword` gives what `rankOnPhone` gives.
- [ ] **Step 2: Implement, run the gate, and commit** as
      `feat(eval): rank each shortlist by place and by keyword`.

### Task 7: Scoring each line

**Files:** create `eval/src/score.ts` and `eval/test/score.test.ts`.

- [ ] **Step 1: Test,** on a small bank and hand-worked lines: each line's
      shortlist, each ranker's order and outcome (a right row, a wrong
      row, a missed reply, a right hold, and the fixed buttons as a right
      row), and `summarize`'s top 1, top 6, mean reciprocal rank, chance,
      recall at 40, the six outcomes, coverage, risk, and the always-hold
      baseline, with lines whose only acceptable replies are fixed buttons
      left out of the ranking.
- [ ] **Step 2: Implement, run the gate, and commit** as
      `feat(eval): score each ranker's order and row on every line`.

### Task 8: Timing

- [ ] **Step 1: Test** that `scoreLines` gives the shortlist and each
      ranker three timings per line, non-negative, and none from the
      warm-up pass.
- [ ] **Step 2: Implement, run the gate, and commit** as
      `feat(eval): time the shortlist and each ranker`.

### Task 9: Lines that share no word with a reply

- [ ] **Step 1: Test** `sharesNoWord`: "How was physio?" answered by "It
      went well" counts; a line sharing a word with a reply doesn't; a
      line answered only by the fixed buttons doesn't; and "Are you sure?"
      doesn't when "Not sure" is acceptable, since the fixed buttons' words
      count.
- [ ] **Step 2: Implement, run the gate, and commit** as
      `feat(eval): find the lines that share no word with a reply`.

### Task 10: Agreement on the call and the pairs

**Files:** create `eval/src/agreement.ts` and `eval/test/agreement.test.ts`.

- [ ] **Step 1: Test** `compareLabelings` on the notes' six units: none or
      some gives a = 4, b = 0, c = 1, d = 1, kappa 4/7, positive 8/9, and
      negative 2/3; pairs over p1 to p8 give a = 4, b = 2, c = 4, d = 38,
      kappa 1/2, positive 4/7, and negative 38/41.
- [ ] **Step 2: Implement, run the gate, and commit** as
      `feat(eval): measure two labelings' agreement per line and per pair`.

### Task 11: Alpha with MASI

- [ ] **Step 1: Test** the same six units: alpha 93/269, the value NLTK
      3.10.3 gives, and each unit's distance, `masiDistance`: 0, 1, 2/3,
      8/9, 0, and 1, either way round.
- [ ] **Step 2: Share the mean** that alpha needs with the scoring, and
      commit as `refactor(eval): share the mean from the stats module`.
- [ ] **Step 3: Implement, run the gate, and commit** as
      `feat(eval): add Krippendorff's alpha with the MASI distance`.

### Task 12: The data

**Files:** create `eval/src/data.ts`, `eval/test/data.test.ts`,
`eval/test/fixture/lines.jsonl`, and
`eval/test/fixture/second-labeling.jsonl`.

- [ ] **Step 1: Test** that the fixture's lines and second labeling read
      back, that the bank's phrases carry their `fixed` and `strip` flags,
      and that a line with no labels, an unknown id, or a line the second
      labeling lacks fails with a message naming the line.
- [ ] **Step 2: Implement, run the gate, and commit** as
      `feat(eval): read labeled lines from any file and check their labels`.

### Task 13: The report

**Files:** create `eval/src/report.ts` and `eval/test/report.test.ts`;
modify `package.json`.

- [ ] **Step 1: Test** `main` on the fixture, writing to a temporary file:
      the date and the commit; the lines' writer and labeler and the TRD's
      record of who wrote the 80 lines and the bank; every group's tables,
      with the `place` ranker's and the always-hold baseline's cells worked
      out by hand from the bank's order; the recall; and a latency row for
      the shortlist and each ranker. A formatting test checks that 56 of
      80 prints "70% (59% to 79%)".
- [ ] **Step 2: Implement, add `"eval": "bun eval/src/report.ts"`, run the
      gate, and commit** as
      `feat(eval): write the report for the place and keyword rankers`.

### Task 14: The count script

**Files:** create `eval/src/count.ts` and `eval/test/count.test.ts`;
modify `package.json`.

- [ ] **Step 1: Read a command's lines in one place,** `linesFrom`, for
      both commands, and commit as
      `refactor(eval): read a command's lines in one place`.
- [ ] **Step 2: Test** `main` on the fixture: each quota with its count and
      whether it's met, the none-or-some table and its numbers, the pairs'
      positive agreement, and alpha, all worked out by hand, and an exit
      code of 1, since 8 lines fall short of 80.
- [ ] **Step 3: Implement, add
      `"eval:count": "bun eval/src/count.ts"`, run the gate, and commit** as
      `feat(eval): check EVAL-1's quotas and print the labelers' agreement`.
- [ ] **Step 4: Point #21's check at the rule,** and commit as
      `refactor(eval): count the no-shared-word quota with the harness's rule`.

### Task 15: The TRD

- [ ] **Step 1: Match the TRD to the harness.** The rankers' table and the
      metrics say how `place` ranks the shortlist, which lines the ranking
      counts, how chance is worked out, why the mean reciprocal rank has no
      interval, which percentile the latency uses, and the three subsets;
      the report's section names `eval:count`, the agreement it prints, and
      the report's options.
- [ ] **Step 2: Run the docs gate, then commit** as
      `docs(trd): say how the harness scores rankers and labelers`.

### Task 16: Graph, pull request, review, and merge

- [ ] **Step 1: Refresh the graph** with `graphify update .` and commit it.
- [ ] **Step 2: Push and open the pull request** with the `/pr` body,
      closing #29, with the fixture's report and count as evidence.
- [ ] **Step 3: Review.** Run `/code-review` on its two axes with a
      fact-check agent beside it, post the review on the pull request, fix
      each finding in its own commit, update this plan's decisions with
      every fix, and post the resolution.
- [ ] **Step 4: Merge.** Rebase on `main` if #21's labels landed first,
      merging the two `data.ts` files; rebase-merge; delete the branch and
      the worktree.
- [ ] **Step 5: Update the issues.** Tick #29's criteria and close it with
      a comment, and note on #36 and #40 how to add rankers and what to run.

[trd-data]: /docs/TRD.md#the-evaluation-data

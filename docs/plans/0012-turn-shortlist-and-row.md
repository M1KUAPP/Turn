# Turn's shortlist and row implementation plan

**Goal:** Close [issue #23][shortlist-issue] and [issue #25][row-issue]: the
shared code that picks the 40 phrases each partner line is ranked over,
ranks a line on the phone when Jev can't, and turns any ranking into the
row's six steady slots or one big button.

**Architecture:** Three files in `@turn/shared`, each imported on its own.
`shortlist.ts` holds the phrase index, MiniSearch's BM25+ kept in step with
the bank, the shortlist, the yes-or-no check, and the phone's own ranking.
`common-words.ts` holds the words the keyword ranking drops. `row.ts` holds
the policy, the answer, the row's state, and its rules as pure functions.
The phone's own ranking returns what the row's rules take, so the app, the
evaluation, and the replay script run one path.

**Tech Stack:** MiniSearch 7.2.0, TypeScript 6.0.3, and Vitest 4.1.11 in a
Bun 1.4.2 workspace; graphify; the `gh` CLI; and subagents for research and
review.

**Spec:** [Issue #23][shortlist-issue] and [issue #25][row-issue], under the
spec in [issue #13][spec], and the TRD's sections on
[the shortlist](/docs/TRD.md#the-shortlist),
[the phone's own ranking](/docs/TRD.md#the-phones-own-ranking), and
[from probabilities to the row][trd-row]. The user's goal directive,
verbatim: "/ask-matt Complete and close #23 and #25. Follow
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

[shortlist-issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/23
[row-issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/25
[spec]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/13

## Global constraints

- **#23's acceptance criteria,** verbatim:
  - "Unit tests cover each step of the order, the rule against fixed buttons
    and strip phrases, and no duplicates (ROW-2, SPEAK-7)"
  - "A phrase no line has suggested enters the shortlist among the
    most-tapped once it has the taps (BANK-6)"
  - "The phone's own ranking returns up to six phrases sharing a word, the
    place's first among ties, or nothing when none does (STATE-1)"
  - ""Do you want some water?" and "Can you hear me?" count as yes-or-no,
    and "It's cold out today." doesn't"
  - "With 2,000 phrases, a shortlist takes at most 50 ms in a benchmark test
    (BANK-7, PERF-4)"
- **#25's acceptance criteria,** verbatim:
  - "Recorded answers at 0.9, 0.7, and 0.5 give a big button, a row, and no
    change; a pain line and a consent line at 0.9 give no big button
    (ROW-3)"
  - "A yes-or-no answer puts Yes, No, and Not sure in slots 1 to 3, in that
    order (ROW-4)"
  - "Recorded answers that shift by less, and by more, than the margin move
    only the slots the rules allow (ROW-5)"
  - "An answer for an older sequence number is dropped (ROW-7)"
  - "New policy values change the outcome with no code change (ROW-8)"
  - "The topic at or above the floor is returned for its tab (ROW-9)"
  - "A topic that gets only the fixed buttons shows nothing else (EVAL-5)"
  - "Clearing empties the six slots and forgets the remembered big phrase
    (ROW-10)"
  - "An answer from the phone's own ranking with a phrase at 1.0 gives a
    row, never a big button (STATE-1)"
- **Scope.** This change is the shared code and its tests. The app that
  loads the bank, sums the taps, renders the row, marks the tab, and
  announces is [#43][app-ticket] and [#48][relay-app-ticket]; the relay's
  wire types are [#24][relay-ticket]; the evaluation's rankers are
  [#29][eval-ticket]; and the replay script is [#37][replay-ticket]. The
  evaluation gains `@turn/shared` as a workspace dependency for one check,
  that the starter bank's fixed buttons carry the ids the row's rules use,
  which the first review round asked for.
- **Versions** are pinned exactly, not as ranges.
- **Code** follows the repo's Prettier settings (single quotes, no
  semicolons, 120 columns, no trailing commas) and TypeScript's `strict`.
- **Markdown** follows
  [the Markdown style guide](/docs/references/markdown-style.md), with a
  `Contents:` list in lazy numbering (`1.  [Heading](#anchor)`) instead of
  `[TOC]`: one H1, prose wrapped at 80 characters (links, tables, headings,
  and code blocks are exempt), a language on every fenced code block, and
  repo links as root paths.
- **Commits** follow Conventional Commits: a lowercase subject, a header of
  at most 100 characters, body lines of at most 100 characters, and no
  attribution lines. Stage explicit paths only, never `-A` or `.`, and never
  `skills-lock.json`, `.agents/`, or `.claude/`.
- **The worktree.** Another session works in the main checkout, so this
  change is built in a separate worktree, `../revenuecat-shortlist-row`, on
  the branch `pipeline/shortlist-and-row`.
- Absolute dates only. Use they/them for anyone whose pronouns aren't
  stated.

[app-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/43
[relay-app-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/48
[relay-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/24
[eval-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/29
[replay-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/37

## Skills

`/ask-matt` sends a ticket from `/to-tickets` to `/implement`, which builds
at agreed seams with `/tdd`, runs the full suite at the end, and closes with
`/code-review`. The directive's steps map to skills:

- **`/research`:** one background agent, capped at 10 minutes, wrote
  [the shortlist and row notes][note] in about five, and the session added
  the British Council's grammar pages and Snowball's license.
- **`/tdd`:** each behavior starts from a failing test at the package's
  seam, the files' exports, run by the root's `bun run test`.
- **`/pr`:** the pull request's body.
- **`/code-review`:** one round, on its Standards and Spec axes, with issues
  #23 and #25 and this plan as the spec.

[note]: /docs/research/0033-turn-shortlist-and-row.md

## Design

### Decisions

1.  **Three files, imported one at a time:** `@turn/shared/shortlist`,
    `@turn/shared/row`, and `@turn/shared/common-words`, which only the
    shortlist imports. The relay will import `row` for the policy's type,
    so its bundle carries no MiniSearch.
1.  **The bank comes in as plain data.** A `Phrase` is its `id`, `text`,
    and the ids of its `places`, with `fixed` for Yes, No, and Not sure and
    `strip` for the conversation strip's five. The shortlist also takes the
    bank in the grid's order, the ids of the phrases in the row, the place's
    id, and each phrase's taps over the last 30 days, which the app sums
    from its tap table. Nothing in `shared/` reads SQLite.
1.  **The index follows the bank by itself.** `PhraseIndex.update(bank)`
    adds new phrases, removes each edited phrase by its old text and adds it
    again, and removes deleted phrases, and `pickShortlist` calls it first.
    The first call, at launch, builds the index; after that, an edit costs
    one lookup per phrase, so the app can't forget one. `discard` and
    `replace` aren't used, since they can give a match a score below 0
    ([MiniSearch notes][note-ms]). The index also records each phrase's
    place in the bank and breaks ties between equal scores by it, since
    MiniSearch keeps the order phrases were indexed in, and an edit moves a
    phrase to the end; the first review round found that.
1.  **The common words** are NLTK's English list without its 45 contractions,
    which MiniSearch's tokenizer never produces, since it splits them into
    fragments the list already holds, such as `don` and `t`, plus "please":
    154 words ([common-word lists][note-words]). "Want" and "help" stay
    content words, and the evaluation can revisit the list.
1.  **The shortlist's order,** as the TRD sets it, read this way:
    - Step 1 takes every phrase in the row, the big button's first, then the
      slots': up to seven while a big button covers six kept slots, since
      the rules rescore all of them (ROW-5). The TRD's "up to six" changes
      to match.
    - Step 2 takes the first 24 keyword matches not already taken.
    - Step 3 takes up to 8 more with at least one tap, most-tapped first. A
      fresh bank has none, so steps 4 and 5 fill those places, as the TRD's
      [evaluation data](/docs/TRD.md#the-evaluation-data) says.
    - Step 4 takes up to 8 more of the place's phrases, most-tapped first.
    - Step 5 fills to 40 by taps, then the grid's order.
    - Within a step, the grid's order breaks ties. Every step skips the
      fixed buttons, the strip's phrases, ids not in the bank, and phrases
      already taken.
1.  **The yes-or-no check** reads the line's first word, lowercased with ’
    read as ', against the forms of "do", "be", and "have", the nine modals
    the British Council lists, their `n't` forms, and "cannot"
    ([openers][note-openers]). It is the TRD's rule, so "You're tired?"
    doesn't count and "Do you want tea or coffee?" does. Every form counts,
    the participles and "be" too, so "Been waiting long?" does, and so does
    the command "Be careful", as "Have a seat" already did; the first review
    round found the participles missing.
1.  **The phone's own ranking** scores the shortlist: 1 for each phrase
    that shares a word with the line, other than common words, and 0 for
    the rest. The place's phrases come first, then taps, then the keyword
    ranking's order, which the TRD leaves open and changes to name. The kind
    is `yes_no` 1 for a yes-or-no line and 0 otherwise, with no topic. It
    returns a `Ranking`, and the caller adds the line's `seq` and the
    cached `policy` for the row's rules, whose six slots make it "up to
    six". It takes the context the shortlist was picked with and brings the
    index in line with its bank first, since an index that missed the bank
    would score every phrase 0 and hold the row without a sign; the first
    review round found that.
1.  **An answer's scores are a `Map` in the shortlist's order,** which
    breaks ties, so the row's phrases come first among equals. The relay's
    JSON object can't carry that order: an id such as `911` would sort
    first. The app builds the `Map` from the shortlist it sent.
1.  **The row's state** is `seq`, `answers` (the line its phrases answer),
    `big` (the big button's phrase or null), `slots` (six phrase ids or
    null), and `tab`. `applyAnswer(row, answer)`
    and `clearRow(row)` return a new row and never change their input;
    `phrasesInRow(row)` gives the shortlist's first step, and `emptyRow`
    starts a session. Nothing speaks, and the app renders and announces.
1.  **The fixed buttons are phrase ids in the slots,** `yes`, `no`, and
    `not-sure`, which `fixedButtons` lists in slot order and which the plan
    for [the starter bank][bank-ticket], on its own branch, gives Yes, No,
    and Not sure. The app speaks and counts every slot the same way, and a
    test can check their order (ROW-4); an earlier draft kept them out of
    the slots behind a flag, which left the order to the app.
1.  **A hold says which line the row still answers.** `answers` moves to
    each answer's line except when nothing reaches the floor, so the app can
    show the "Still answering" note with that line (#43, #48), and the
    evaluation can tell a hold from an answer that moves nothing (#29). The
    first review round found that the two returned the same row.
1.  **The newest line (ROW-7).** The app raises `row.seq` when a line
    starts, and the rules drop an answer with a lower `seq` and raise it for
    each answer they apply, so a late answer loses to its newer line even
    before that line's answer arrives.
1.  **Reading the TRD's pseudocode:**
    - The kind is yes-or-no only when `yes_no` beats every other kind and
      reaches the floor. A tie for the most likely topic counts as each
      tied topic, so the safer rule wins: no big button if any never gets
      one, only the fixed buttons if any gets only those, and no tab. The
      first review round found that the key order decided ties.
    - The remembered big phrase goes in after the fixed buttons take their
      slots and the shown phrases take their new scores; placed first, as
      the pseudocode lists it, Yes would cover it in slot 1. It takes a
      free slot before any other fresh phrase, the first empty usable slot,
      or else the lowest-scoring stale one; with neither, it competes like
      the others. The TRD's pseudocode changes to match.
    - "Beats the lowest shown by the margin" means a higher score, by at
      least the margin, with a slack of 1e-9 for floating-point error: 0.82
      against 0.67 at 0.15 counts, and equal scores never swap, even at a
      margin of 0. The first review round found both cases.
    - A shown phrase the answer doesn't score counts as 0, so it's stale.
    - The tab follows each applied answer: the topic when it reaches the
      floor, else none, even when the row holds.
1.  **Clearing** keeps `seq` and unmarks the tab too, since a mark from an
    earlier line misleads like the replies ROW-10 clears.
1.  **`startingPolicy`** holds the TRD's starting values, which the app
    uses before any policy is cached (#43) and the relay serves (#24).
1.  **The speed test** is an ordinary Vitest test, since `bench` can't fail
    a run and `vitest run` skips it ([timing tests][note-timing]). It builds
    the index for 2,000 phrases, as launch would, then times 50 shortlists
    with `Date.now()`, which ES2024 types, and expects each to take at most
    50 ms.

[note-ms]: /docs/research/0033-turn-shortlist-and-row.md#minisearch-720
[note-words]: /docs/research/0033-turn-shortlist-and-row.md#common-word-lists
[note-openers]: /docs/research/0033-turn-shortlist-and-row.md#yes-or-no-question-openers
[note-timing]: /docs/research/0033-turn-shortlist-and-row.md#timing-tests-in-vitest-41
[bank-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/18

### Rejected alternatives

- **`discard` or `replace` for edits:** a match can score below 0.
- **Index calls from the app's editor:** one missed call and the ranking
  drifts from the bank without any error.
- **The relay's `scores` object as the row's input:** its key order isn't
  safe for ties.
- **A `bench` file:** it can't fail a run, and `vitest run` skips it.
- **Lucene's 33 words:** they keep pronouns and question words, so "I" and
  "what" would link most phrases.
- **Snowball's list:** it holds whole contractions the tokenizer never
  produces, and not their fragments.
- **Stemming, prefixes, or fuzzy matches:** the TRD asks for MiniSearch's
  defaults.
- **Reading the first word with MiniSearch's tokenizer:** it splits "Don't"
  into `don` and `t`.

### Out of scope

- The app's side: loading the bank, the tap table's 30-day sums, the row's
  view, the tab's mark, announcing, and the press guard (#43, #48).
- The relay's wire types and limits (#24), the evaluation's rankers (#29),
  the replay script (#37), and typing's matches (SPEAK-4).
- Apple's sentence embeddings for step 2, which wait on EVAL-4.

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

[docs-gate]: /docs/plans/0009-plan-storage.md#verification-gate

## Tasks

Every subagent prompt carries the repo rule: run `graphify query "<question>"`
before grepping or reading repo files. No subagent sends the user's email
address or any personal identifier to an API, and none writes a repo file
its prompt doesn't name or runs git.

### Task 1: Research note

A background agent wrote `docs/research/0033-turn-shortlist-and-row.md` in
about five minutes, and the session filled two of its gaps. It passed the
docs gate, with fact-scan misses only for MiniSearch's source line numbers,
and was committed as
`docs(research): add notes on the shortlist and the row`.

### Task 2: This plan

- [ ] **Step 1: Run the docs gate, then commit**

  ```shell
  git add docs/plans/0012-turn-shortlist-and-row.md
  git commit -m "docs(plan): add the plan for the shortlist and the row"
  ```

### Task 3: The phrase index

**Files:** modify `shared/package.json` and `bun.lock`; create
`shared/src/common-words.ts`, `shared/src/shortlist.ts`, and
`shared/test/shortlist.test.ts`.

- [ ] **Step 1: Write the failing tests** for `PhraseIndex`:
  - It matches phrases that share a word with the line, best first: "Do
    you want some water?" finds "I want some water now" before "Water,
    please", and not "It was hard".
  - A line of common words, such as "What is this?", matches nothing.
  - Contractions share no word, with either apostrophe: "Don’t you?"
    doesn't match "I don't mind".
  - It follows the bank: after an edit, the old words miss and the new ones
    match; a deleted phrase stops matching; a new one starts.
- [ ] **Step 2: Run them and see them fail:** the module doesn't exist.
- [ ] **Step 3: Implement.** Add `"dependencies": { "minisearch": "7.2.0" }`
      to `shared/package.json` and run `bun install`. `common-words.ts`
      exports `commonWords`, a `ReadonlySet<string>` of the 154 words, and
      `shortlist.ts` exports:

  ```ts
  export type Phrase = {
    id: string
    text: string
    places: readonly string[]
    fixed?: boolean
    strip?: boolean
  }

  export class PhraseIndex {
    update(bank: readonly Phrase[]): void
    match(line: string): string[]
  }
  ```

  MiniSearch indexes `text`, with a `processTerm` that lowercases and
  returns `null` for a common word; the index keeps each phrase's indexed
  text for `remove`, and skips the fixed buttons and the strip.

- [ ] **Step 4: Run the gate and see it pass,** then commit:

  ```shell
  git add shared/package.json bun.lock shared/src shared/test/shortlist.test.ts
  git commit -m "feat(shared): index the bank's phrases by keyword, without common words"
  ```

### Task 4: The shortlist's order

- [ ] **Step 1: Write the failing tests** for `pickShortlist`, one per
      step, over generated banks:
  - The row's phrases come first, in the row's order.
  - Then up to 24 keyword matches, best first.
  - Then up to 8 of the most-tapped, most first.
  - Then up to 8 of the place's phrases, most-tapped first.
  - Then the rest by taps and the grid's order, up to 40.
  - The fixed buttons and the strip's phrases never appear, even when they
    share a word, carry taps, belong to the place, and sit in the row.
  - No phrase appears twice.
  - A phrase that shares no word, with no taps, is left out of a bank of 60;
    with three taps, it joins the most-tapped (BANK-6).
  - A bank of fewer than 40 phrases gives all of them.
- [ ] **Step 2: See them fail,** then implement:

  ```ts
  export type Context = {
    bank: readonly Phrase[]
    row: readonly string[]
    place: string
    taps: ReadonlyMap<string, number>
  }

  export function pickShortlist(line: string, index: PhraseIndex, context: Context): Phrase[]
  ```

- [ ] **Step 3: Run the gate,** then commit as
      `feat(shared): pick the 40-phrase shortlist in the trd's order`.

### Task 5: Yes-or-no lines

- [ ] **Step 1: Write the failing tests** for `isYesNo`: "Do you want some
      water?", "Can you hear me?", "Is the new nurse here?", "Are you
      tired?", "Don’t you want it?", and "Won't you sit down?" count;
      "It's cold out today.", "You're tired?", "How was physio today?",
      "Water?", and "" don't.
- [ ] **Step 2: See them fail, implement, run the gate,** and commit as
      `feat(shared): tell a yes-or-no line by its first word`.

### Task 6: A big button, a row, or no change

**Files:** create `shared/src/row.ts` and `shared/test/row.test.ts`.

- [ ] **Step 1: Write the failing tests** with `startingPolicy`: from an
      empty row, a phrase at 0.9 gives a big button, one at 0.7 a row, and
      one at 0.5 no change; a pain line and a consent line at 0.9 give a
      row (ROW-3). Inputs are frozen, so a rule that changes them fails.
- [ ] **Step 2: See them fail,** then implement the types and the first
      branches:

  ```ts
  export type Policy = {
    floor: number
    bigAbove: number
    margin: number
    yesNoPhrases: boolean
    noBigTopics: readonly string[]
    fixedOnlyTopics: readonly string[]
  }
  export type Kind = 'yes_no' | 'either_or' | 'open' | 'not_a_question'
  export type Ranking = {
    kind: Readonly<Record<Kind, number>>
    topic: Readonly<Record<string, number>>
    scores: ReadonlyMap<string, number>
    onPhone: boolean
  }
  export type Answer = Ranking & { seq: number; policy: Policy }
  export type Row = {
    seq: number
    answers: number
    big: string | null
    slots: readonly (string | null)[]
    tab: string | null
  }
  export const fixedButtons: readonly string[]
  export const startingPolicy: Policy
  export const emptyRow: Row
  export function applyAnswer(row: Row, answer: Answer): Row
  ```

- [ ] **Step 3: Run the gate,** then commit as
      `feat(shared): turn an answer into a big button, a row, or no change`.

### Task 7: The row's other rules

One commit per rule, each red first, then green, then the gate:

1.  **Older lines (ROW-7).** An answer with a `seq` below the row's is
    dropped, whether the row's came from an answer or from a new line.
    Commit `feat(shared): drop an answer for an older line`.
1.  **The fixed buttons (ROW-4, EVAL-5).** A yes-or-no answer puts Yes, No,
    and Not sure in slots 1 to 3, in that order, and phrases in 4 to 6, with
    no big button even at 0.95; a topic that gets only the fixed buttons
    shows nothing else; a later answer that isn't yes-or-no frees the three
    slots. Commit
    `feat(shared): put yes, no, and not sure first for a yes-or-no question`.
1.  **Steady slots (ROW-5).** Shifts smaller than the margin move nothing;
    a larger one replaces only the lowest phrase shown; stale phrases stay
    until a phrase needs their slot, then the lowest-scoring goes; after a
    big button, its phrase takes a free slot first if it still reaches the
    floor, and the six slots it covered come back. Commit
    `feat(shared): keep shown phrases in their slots`.
1.  **The tab (ROW-9).** The topic at or above the floor is returned for its
    tab, and a topic below it marks none. Commit
    `feat(shared): mark the answer's topic for its tab`.
1.  **Clearing (ROW-10).** `clearRow` empties the six slots, forgets the
    big phrase, drops the fixed buttons, and unmarks the tab, keeping `seq`;
    the next row doesn't bring the old big phrase back. `phrasesInRow` lists
    the big button's phrase, then the slots'. Commit
    `feat(shared): clear the row and list its phrases`.
1.  **The policy (ROW-8).** The same answers under a higher big-button bar,
    a lower floor, a wider margin, no phrases beside the fixed buttons, and
    other topic lists give other rows, and under a floor of 0.3 a line is
    yes-or-no only when that kind is the most likely. The last two needed
    code, so the commit is
    `feat(shared): follow every value of the answer's policy`.

### Task 8: The phone's own ranking

- [ ] **Step 1: Write the failing tests:**
  - `rankOnPhone` scores each shortlist phrase that shares a word 1, in the
    order place's first, then taps, then keyword rank, and the rest 0.
  - Through `applyAnswer`, eight sharing phrases fill six slots, place's
    first, and a phrase at 1.0 gives no big button (STATE-1).
  - A line that shares no word leaves the row as it was.
  - "Is the new nurse here?" brings Yes, No, and Not sure and "The new
    nurse is kind".
- [ ] **Step 2: See them fail, implement** `onPhone` in the big-button
      check and:

  ```ts
  export function rankOnPhone(line: string, shortlist: readonly Phrase[], index: PhraseIndex, context: Context): Ranking
  ```

- [ ] **Step 3: Run the gate,** then commit as
      `feat(shared): rank a line on the phone`.

### Task 9: The speed test

- [ ] **Step 1: Write** `shared/test/shortlist-speed.test.ts`: 2,000
      generated phrases over a few hundred words, the index built first,
      then 50 lines, each shortlist timed with `Date.now()`, and
      `expect(worst).toBeLessThanOrEqual(50)`.
- [ ] **Step 2: See it fail** with the limit set to 0 ms, restore 50 ms,
      run the gate, and commit as
      `test(shared): time the shortlist over 2,000 phrases`.

### Task 10: The TRD

- [ ] **Step 1: Edit** [the shortlist](/docs/TRD.md#the-shortlist): step 1
      counts the big button's phrase, step 2 names the common words and
      cites the note, and the index's updates remove the old text before
      adding the new. Edit [the phone's own ranking][trd-phone] to end its
      ties with the keyword ranking, and [the row's rules][trd-row] to place
      the big phrase after the fixed buttons and break ties in the
      shortlist's order.
- [ ] **Step 2: Run the docs gate,** then commit as
      `docs(trd): match the shortlist and the row's rules to the code`.

[trd-phone]: /docs/TRD.md#the-phones-own-ranking

### Task 11: Graph, pull request, review, and merge

1.  Run `graphify update .` and commit `graphify-out/` as
    `chore(graphify): refresh the graph after adding the shortlist and the row`.
1.  Push the branch and open the pull request with the `/pr` template, with
    "Closes #23" and "Closes #25".
1.  Run one `/code-review` round against `main`, with issues #23 and #25 and
    this plan as the spec, post it as a PR comment, fix what it confirms in
    one commit per fix or group of related fixes, and post a resolution
    comment.
1.  Rebase-merge the pull request, delete the branch locally and on the
    remote, remove the worktree, and check that both issues closed with
    their criteria ticked.

[trd-row]: /docs/TRD.md#from-probabilities-to-the-row

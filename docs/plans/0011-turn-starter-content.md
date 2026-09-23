# Turn's starter content implementation plan

**Goal:** Close [issue #18][bank-issue] and [issue #19][lines-issue]: the
starter bank a new user starts with, which the app loads and the evaluation
reads, and the 80 partner lines the evaluation scores, each written without
sight of the other and held to its requirements by a check.

**Architecture:** Two data files and two Vitest checks in `@turn/eval`, the
one package that reads both. `eval/lines.jsonl` holds the 80 lines, one JSON
object each, written by two writer agents that never see the bank.
`app/src/content/starter-bank.json` holds the bank in the spec's format,
written by a third agent that never sees the lines and read in full by a
fourth. `eval/test/lines.test.ts` and `eval/test/starter-bank.test.ts` check
each file's shape and counts.

**Tech Stack:** Vitest 4.1.11 and TypeScript 6.0.3 in `@turn/eval`, which
gains `@types/node` 26.6.1 to read the files; Claude subagents as writers and
reader; the `gh` CLI.

**Spec:** Issues #18 and #19, under the spec in [issue #13][spec], whose
decisions fix the starter bank's format; the PRD's
[content requirements][prd-content] and
[evaluation requirements](/docs/PRD.md#evaluation-requirements); and the
TRD's [evaluation data][trd-eval-data]. The user's goal directive, verbatim:
"/ask-matt Complete and close #18 and #19. Follow
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
1.  [Appendix: the line writers' brief](#appendix-the-line-writers-brief)

[bank-issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/18
[lines-issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/19
[spec]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/13
[prd-content]: /docs/PRD.md#content-requirements

## Global constraints

- **#18's acceptance criteria,** verbatim:
  - "A check counts 140 to 160 phrases in about ten categories, none over 120
    characters (CONTENT-1)"
  - "Home, Clinic, Shop, and Out each have at least ten phrases (CONTENT-2)"
  - "The Quick category, the strip's five, and the `body-pain` category are
    present and marked fixed as the data model sets (BANK-5, SPEAK-7)"
  - "It holds the phrases the checks name: 'It was hard' tied to Clinic,
    'Water, please' tied to Home, a food category with the id `food`, and a
    phrase with 'tired'"
  - "A teammate other than the writer reads every phrase and signs off here"
- **#19's acceptance criteria,** verbatim:
  - "80 lines with every field above, each written before its writer saw the
    starter bank (EVAL-1)"
  - "At least 24 are yes-or-no questions, at least 8 concern pain or health,
    and at least 4 ask for consent (EVAL-1)"
  - "The lines are committed before any ranker runs on them"
- **Independence.** #18 says "Whoever writes the evaluation lines doesn't see
  the bank until those are written", and the TRD has the team write the
  lines "before looking at the bank". This plan also keeps the bank's writer
  from the lines, since a bank written to the lines would flatter every
  ranker.
- **The content rules** of CONTENT-1: plain US English, at most 120
  characters a phrase, and no real person named. The Quick category holds
  Yes, No, Not sure, "I don't know", and "I have something to say", and the
  strip's five are exactly SPEAK-7's.
- **Scope.** #21 labels the acceptable replies, #29 adds the quota script
  and the harness, and the app that loads the bank starts in
  [#22][app-ticket] and [#27][grid-ticket]. No stand-in seed exists yet, so
  the bank replaces nothing.
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
- Absolute dates only. Use they/them for anyone whose pronouns aren't
  stated.

[app-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/22
[grid-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/27

## Skills

`/ask-matt` sends a ticket from `/to-tickets` to `/implement`, which builds
at agreed seams with `/tdd`, runs the full suite at the end, and closes with
`/code-review`. The directive's steps map to skills:

- **`/research`:** one background agent, capped at 10 minutes, wrote
  [the starter content notes][note].
- **`/tdd`:** each file starts from its failing check, and the seam is the
  root's `bun run test`.
- **`/pr`:** the pull request's body.
- **`/code-review`:** one round, on its Standards and Spec axes, with issues
  #18 and #19 and this plan as the spec.

[note]: /docs/research/0032-turn-starter-content.md

## Design

### Decisions

1.  **Agents write, at the user's direction, and the record says so.** Both
    tickets are labeled `ready-for-human` and ask for the team's own words,
    and the user's directive asks this session to complete and close them
    without pausing. So Claude subagents write, each in its own context: two
    write the lines, one the bank, and a fourth reads every phrase. Each
    line's `author` names its writer (`claude-a` or `claude-b`), the TRD's
    [evaluation data][trd-eval-data] says how the lines and the bank were
    written, and the closing comments on both issues state the deviation.
    Lines a language model wrote may suit a ranker built on one better than
    people's lines would, and nothing measures that: EVAL-2 asks for 20 new
    lines from a teammate only "If anything of Jev's changes after the team
    sees results". So the report and the README say who wrote the lines and
    the bank, and #29 and #64 carry that as a criterion.
1.  **Isolation both ways.** The line writers get a self-contained brief and
    read nothing: not the repository, not the web. The bank's writer reads
    the PRD, the TRD, the research notes, and its own check, but not
    `docs/plans/` or the session's scratch folder, where the lines wait until
    the bank is written. The three write at once, and nobody passes one
    writer's output to another. The lines are committed before the bank.
1.  **Two line writers, 40 lines each.** Two authors let the evaluation
    split by author, as [the evaluation notes][eval-writing] suggest, and let
    #21's labelers differ from each line's writer. Each writes 10 lines per
    place, for a different user: `claude-a` for an adult in their sixties
    with ALS, and `claude-b` for an adult in their forties, a year after a
    stroke. Two instances of one model share habits, so `claude-b` then
    replaced its lines that matched `claude-a`'s (Task 4). The writers
    needn't be blind to each other, only to the bank.
1.  **The lines' mix.** Each writer's 40 lines hold 22 to 24 yes-or-no, at
    least half of them declarative or tagged; 3 or 4 either-or; 6 to 8 open;
    6 to 8 not a question; at least 6 on pain or health and 3 asking
    consent; and 9 or 10 meant to have no stored reply. That's a quarter
    rather than a fifth, since labeling may find replies for some, and
    EVAL-1 needs 16. Over 80 lines, about 46 yes-or-no questions are seven in
    ten of about 66 questions, against quotas of 24, 8, and 4.
1.  **The lines' format.** `eval/lines.jsonl` holds one object per line:
    `id` (`line-01` to `line-80`), `author`, `text` (1 to 300 characters,
    the relay's limit for a line), `kind` (Jev's own keys: `yes_no`,
    `either_or`, `open`, and `not_a_question`), `place` (a starter place's
    id), `topic` (1 to 3 lowercase words, which nothing scores), and
    `concerns` (any of `pain`, `health`, and `consent`). #21 adds the
    acceptable replies.
1.  **The bank's format** is the spec's: `categories` in grid order, each
    with an `id`, a `name`, `fixed`, and its `phrases`, each with an `id`,
    its `text`, `fixed`, and the ids of its `places`; then `places` in
    order, each with an `id` and a `name`.
1.  **Ten categories.** Quick comes first, then eight content categories,
    then the strip's category, `strip`, which the grid doesn't show. With
    Typed, created on first use, that's 11 of BANK-2's 12. The check reads
    "about ten" as 9 to 11 categories in the file.
1.  **Fixed as the data model sets.** The categories `quick`, `body-pain`,
    and `strip` are fixed, and of the phrases only `yes`, `no`, and
    `not-sure`. The strip's phrases aren't fixed, since the user can reword
    them (SPEAK-7); their category keeps them in place.
1.  **Phrase ids are slugs of the text,** such as `water-please`, unique
    across the bank, so #21's labels read as words. A slug over 40
    characters is cut to its first words, as the strip's
    `i-use-this-app-to-talk` is. An id stays once labeled, even if its
    phrase's text changes.
1.  **Text conventions.** Straight apostrophes, as the PRD's strings and the
    other tickets' checks have them; no period after a one-sentence
    statement, and a question mark after a question; no personal names at
    all, since the user adds their own.
1.  **The checks live in `@turn/eval`,** the one package that reads both
    files, since the app isn't a workspace yet. They read the files with
    `node:fs`, so the package gains `@types/node` at 26.6.1, the version the
    lockfile already resolves, and nothing else in the lockfile moves. The
    package's smoke test goes, since the new tests show that Vitest runs
    TypeScript there.
1.  **The path comes before the app.** The bank sits at the TRD's
    `app/src/content/starter-bank.json` before the Expo project exists.
    `create-expo-app` 5.0.0 refuses a folder that holds `src/` ("The
    directory app has files that might be overwritten"), so #22 scaffolds
    beside it and moves the project in, and a comment there says so.
1.  **The read-through.** A fourth agent, which wrote nothing, reads every
    phrase for plain US English, clarity, tone, place ties, names, and the
    safety phrases CONTENT-1 lists, and doesn't see the lines either. The
    bank's writer, not this session, applies its fixes, since this session
    has read the lines; the reader then confirms the final file. Its
    sign-off goes on #18 as an agent's read, not a teammate's.

[eval-writing]: /docs/research/0025-turn-evaluation.md#writing-turns-80-lines

### Rejected alternatives

- **One writer for both files, lines first:** they would know the lines
  while writing the bank.
- **Line topics from the bank's category ids,** as Jev's topic Choice uses:
  the line writers would need the bank's categories, and nothing scores a
  line's topic.
- **A JSON Schema beside the checks:** a second statement of each format,
  for two files.
- **The checks in an `app/` workspace:** that package is #22's Expo project.
- **Importing the files as modules:** JSON Lines has no module form, and one
  way of reading serves both files.

### Out of scope

- The acceptable replies (#21), the quota script and the harness (#29), and
  the app's loader (#27).
- A teammate's own read of the bank, and CONTENT-5's clinic review, which
  remain the team's.

## Verification gate

Every task that changes code or data runs these from the root before
committing, and each must exit 0:

```shell
setopt pipefail
bun install --frozen-lockfile
bun run test
bun run typecheck
bun run lint
```

Markdown files run the gate from [the plan-storage plan][docs-gate]:
Prettier, `check_md.py` with `--contents`, and `fact_scan.py` for new prose.
Before the pull request, `git log --reverse --format='%h %s' main..` shows
the lines' commit before the bank's.

- **Two false positives.** As that plan's appendix has it, `check_md.py`
  toggles a code block on any fence, so it ends this plan's four-backtick
  appendix block at the brief's inner `json` fence, then reports a
  119-column prose line and a fence without a language. The session's copy
  closes a block only on a bare fence of the same character, at least as
  long as the one that opened it, as CommonMark does; with that change it
  prints `OK` for this plan and for plan 0010, the note, and the TRD.
- **Fact-scan misses** that aren't claims from a source capture: `1987`, the
  year of a cited paper, and `404`, an HTTP status, in the note.

[docs-gate]: /docs/plans/0009-plan-storage.md#verification-gate

## Tasks

Every subagent prompt carries the repo rule: run `graphify query "<question>"`
before grepping or reading repo files. No subagent sends the user's email
address or any personal identifier to an API, and none writes a file its
prompt doesn't name or runs git.

### Task 1: Research note

A background agent wrote `docs/research/0032-turn-starter-content.md` in
about six minutes. Blocked pages and a spent search budget left the patient
boards, the pain tools' own words, and the ALS message lists under its gaps,
so the bank rests on CONTENT-1, the AAC notes, and what the note did read.
Once a line starting with `#18` was rewrapped, it passed the docs gate apart
from the fact-scan misses the [gate](#verification-gate) names, and it is
committed as `docs(research): add notes on the starter content`.

### Task 2: This plan

- [ ] **Step 1: Run the docs gate, then commit**

  ```shell
  git add docs/plans/0011-turn-starter-content.md
  git commit -m "docs(plan): add the plan for the starter content"
  ```

### Task 3: The checks, failing

**Files:** modify `eval/package.json`, `eval/tsconfig.json`, and `bun.lock`;
create `eval/test/lines.test.ts` and `eval/test/starter-bank.test.ts`;
delete `eval/test/smoke.test.ts`.

- [ ] **Step 1: Add Node's types.** In `eval/`, run
      `bun add -d --exact @types/node@26.6.1`, and give `eval/tsconfig.json`
      `"compilerOptions": { "types": ["node"] }`.
- [ ] **Step 2: Write the lines' check** in `eval/test/lines.test.ts`: read
      `eval/lines.jsonl`, then expect 80 lines with unique ids, each with an
      author, a text of 1 to 300 characters with no space at either end, a
      kind and a place from the lists in decision 5, a topic of lowercase
      words, and concerns from that list without repeats; then at least 24
      `yes_no` lines, 8 on pain or health, and 4 on consent.
- [ ] **Step 3: Write the bank's check** in `eval/test/starter-bank.test.ts`:
      read the bank, then expect unique slug ids, category names of 1 to 40
      characters, trimmed and unique phrase texts, and place ids that exist;
      140 to 160 phrases in 9 to 11 categories, none over 120 characters;
      exactly Home, Clinic, Shop, and Out, each with 10 or more phrases;
      Quick first with its five, the strip with SPEAK-7's five, exactly
      `quick`, `body-pain`, and `strip` fixed, and exactly Yes, No, and Not
      sure; and "It was hard" at `clinic`, "Water, please" at `home`, a
      `food` category, and a phrase with "tired".
- [ ] **Step 4: See both fail.** `bun run test` exits 1, and each test file
      fails with `ENOENT` for its data file. `bun run typecheck` passes.

### Task 4: The writers

- [ ] **Step 1: Start three writers at once,** each a background
      `general-purpose` agent with its brief: `claude-a` and `claude-b` write
      40 lines each into their own scratch folders, and the bank's writer
      writes `app/src/content/starter-bank.json` until its check passes.
- [ ] **Step 2: Check the reports,** then read each file whole.
- [ ] **Step 3: Remove near-duplicates.** Writing alone, the two line
      writers matched on seven situations, such as falls, blood pressure, a
      dose change, and the weather. Show `claude-b` only `claude-a`'s seven
      lines and ask it to replace its own seven with new situations,
      keeping each one's id, place, kind, and concerns, so the mix holds and
      the set doesn't test one thing twice.

### Task 5: The lines

- [ ] **Step 1: Join the two files** into `eval/lines.jsonl`, `claude-a`'s
      first, changing nothing in either.
- [ ] **Step 2: Run the gate.** The lines' check passes.
- [ ] **Step 3: Commit,** with the checks' setup, before the bank:

  ```shell
  git add eval/package.json eval/tsconfig.json bun.lock eval/lines.jsonl \
    eval/test/lines.test.ts eval/test/smoke.test.ts
  git commit -m "feat(eval): add the 80 partner lines"
  ```

### Task 6: The bank

- [ ] **Step 1: Run the gate.** With the bank in place, both checks pass.
- [ ] **Step 2: Commit**

  ```shell
  git add app/src/content/starter-bank.json eval/test/starter-bank.test.ts
  git commit -m "feat(content): add the starter bank"
  ```

### Task 7: The read-through

- [ ] **Step 1: Start the reader,** a `general-purpose` agent that reads
      every phrase and returns each issue with the phrase's id and a fix,
      without editing the file.
- [ ] **Step 2: Pass its report, unchanged, to the bank's writer,** which
      applies the fixes and reruns its check; then run the gate, and ask
      the reader to confirm the final file.
- [ ] **Step 3: Commit,** if anything changed:

  ```shell
  git add app/src/content/starter-bank.json
  git commit -m "fix(content): apply the read-through of the starter bank"
  ```

### Task 8: The TRD

- [ ] **Step 1: Say how the content was written.** In
      [the evaluation data][trd-eval-data], add a bullet: at the team's
      direction, two Claude subagents that never saw the bank wrote the 80
      lines on September 23, 2026, a third wrote the bank without seeing the
      lines, and a fourth read every phrase; the report and the README say
      so; and no teammate or clinic had yet read the bank. The bullet on
      writing the lines is labeled "By hand", so it becomes "New lines".
- [ ] **Step 2: Run the docs gate, then commit**

  ```shell
  git add docs/TRD.md
  git commit -m "docs(trd): say how the lines and the starter bank were written"
  ```

### Task 9: The graph

- [ ] **Step 1: Refresh and commit**

  ```shell
  graphify update .
  git add graphify-out
  git commit -m "chore(graphify): refresh the graph for the starter content"
  ```

### Task 10: Review and merge

- [ ] **Step 1: Push and open the pull request** with the `/pr` body,
      closing #18 and #19.
- [ ] **Step 2: Run `/code-review`** on its two axes, post the review on the
      pull request, fix each finding in its own commit, and post the
      resolution.
- [ ] **Step 3: Rebase-merge and delete the branch.** Tick each issue's
      criteria with a closing comment, post the read-through's sign-off on
      #18, and note the file's place on #22, the bank on #27, and the lines'
      fields on #21 and #29.

## Appendix: the line writers' brief

Each line writer got this brief, word for word, as its whole prompt, with
`{FOLDER}` set to its own scratch folder, `{AUTHOR}` to `claude-a` or
`claude-b`, `{FIRST}` and `{LAST}` to `line-01` and `line-40` or `line-41`
and `line-80`, and `{USER}` to one of these:

- **`claude-a`:** "An adult in their sixties with ALS. They still walk short
  distances with a cane, live with their spouse, and see a neurologist, a
  speech therapist, and a physical therapist at the clinic every few weeks."
- **`claude-b`:** "An adult in their forties who had a stroke a year ago.
  They understand everything, but their speech is hard to understand and
  their right hand is weak. They live alone, with family and friends
  dropping by, and go to a clinic for speech and physical therapy."

The bank's writer and the reader weren't given it.

````text
You are one of two writers of an evaluation set for Turn, an iPhone app. Write alone, from your own imagination.

## Rules

- Read nothing: not the repository, not the web, not any other file or folder. Never look for the other writer's work or for any list of the app's phrases; you must not see them. Everything you need is here. (A repo hook would require `graphify query "<question>"` before reading repo files; you have no reason to read any.)
- Write only inside {FOLDER}. No git, no GitHub. Never send any personal identifier to any service.

## What Turn is

Turn is an iPhone app for adults who can't speak, for example people with ALS, after a stroke, or after a laryngectomy. The user speaks by tapping saved phrases, or by typing. In Listen mode, the phone transcribes what the conversation partner says, one "partner line" at a time, and suggests which of the user's saved phrases answer it, or suggests nothing when none fits. Your lines test that step: whether the app offers a fitting reply, and whether it holds back when nothing fits.

## The user in your lines

{USER}

Partners don't mention the condition in every line; they talk about ordinary life too.

## Who speaks

The partner: family, friends, carers, nurses, doctors, therapists, shop staff, neighbors, or strangers, talking face to face with the user. Each line is one turn by the partner, as a live transcript would show it.

## The four places

Each line happens at one of the user's places: `home`, `clinic`, `shop`, or `out` (anywhere else: a park, a cafe, a bus stop, a friend's house, a family party). The app knows only the place's name, not what came before, so each line must make sense on its own, with the place as its only context.

## What to write: 40 lines

- Exactly 10 lines at each place.
- Natural spoken US English, the way people really talk to a friend, a patient, or a customer: contractions, short fragments, the odd "so" or "okay". No stage directions, and no quotation marks around the line. Most lines under 80 characters; none over 300.
- Put a "?" at the end when the partner is asking, even when the words are a statement.
- No personal names (say "your sister", "the nurse", "your neighbor"), no real people, no brands, no profanity.
- Vary partners, topics, and wording; don't use one sentence pattern more than twice. Don't reuse any example sentence from this brief, and don't copy lines from any dataset, book, or website.

### Kind

Judge each line by the reply it invites. These are the app's own definitions:

- `yes_no`, "Can be answered with yes or no": write 22 to 24. At least half of them declarative, a statement said as a question ("You're cold?"), or with a tag ("That was quick, wasn't it?"); the rest ordinary questions ("Do you want the window open?"). An offer counts here when yes or no would be a complete reply.
- `either_or`, "Asks the listener to pick one of the options it names" ("Tea or coffee?"): write 3 or 4.
- `open`, "Needs an answer in the listener's own words" ("How did you sleep?"): write 6 to 8.
- `not_a_question`, "A statement, greeting, or comment, not a question" ("Morning! I brought the paper."): write 6 to 8.

### Concerns

List in `concerns` every one of these that applies, or none:

- `pain`: pain, discomfort, or where it hurts.
- `health`: symptoms, medicines, treatment, therapy, tests, sleep or eating as health, or how the condition is going.
- `consent`: the partner asks permission for care, touch, a procedure, or something done on the user's behalf, or checks that the user agrees.

Write at least 6 lines that concern pain or health, and at least 3 that ask for consent, spread over the places rather than all at the clinic.

### Lines with no stored reply

About a quarter of your lines, 9 or 10, should be ones that a typical set of short saved phrases couldn't answer well: questions that need a specific fact only the user has (a date, an amount, which one, a detail of their day), remarks not really addressed to the user, and chat that needs no reply. Keep them natural, not trick questions.

### Wording

Write the way people talk, not the way a phrase list is written. Most lines should share no content word with a natural reply: "How was the drive over?" might be answered "Long, but fine".

### Topic

Give each line a `topic`: 1 to 3 lowercase words, letters and single spaces only, naming what it's about, such as "sleep", "blood pressure", or "weekend plans".

## Output

1. `{FOLDER}/lines.jsonl`: exactly 40 lines, one JSON object per line, keys in this order, with ASCII apostrophes ('):

   ```json
   {"id":"{FIRST}","author":"{AUTHOR}","text":"...","kind":"yes_no","place":"home","topic":"...","concerns":["health"]}
   ```

   Ids run from "{FIRST}" to "{LAST}" in order, and `author` is always "{AUTHOR}".
2. Before you finish, check the file with a short script in {FOLDER} (python3 is available): 40 valid JSON objects; the ids above; 10 lines per place; every kind and concern from the lists above; texts of 1 to 300 characters with no leading or trailing space; the kind and concern counts above; topics matching `^[a-z]+( [a-z]+)*$`; no two texts alike. Fix anything off.

Report back in under 100 words: the file's path, the counts by kind, place, and concern, and how many lines you meant to have no stored reply. Don't paste the lines.
````

[trd-eval-data]: /docs/TRD.md#the-evaluation-data

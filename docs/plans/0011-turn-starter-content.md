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
1.  [Appendix: the bank's briefs](#appendix-the-banks-briefs)

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
    ten of about 66 questions, against quotas of 24, 8, and 4. A yes-or-no
    line may take the fixed buttons as its acceptable replies (TRD), so the
    16 must come from the lines that aren't yes-or-no. Asked afterwards,
    the writers named 19 lines they meant to have no stored reply, and none
    is yes-or-no: 10 open, 8 not a question, and 1 either-or, out of the 35
    lines that aren't yes-or-no. Their ids stay out of the repository, so
    #21's labelers judge each line fresh.
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
    sign-off goes on #18 as an agent's read, not a teammate's, and
    [#75][teammate-read] asks for a teammate's read of every phrase before
    #21 labels replies.

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
- A teammate's own read of the bank, now [#75][teammate-read], and
  CONTENT-5's clinic review, which remain the team's.

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

After the files were written, the line writers got two more messages.
`claude-b` got this one, which showed it seven of `claude-a`'s lines
([Task 4](#task-4-the-writers)):

```text
Thanks. The other writer, working separately, happened to write lines very close to seven of yours, which would test the same thing twice. Please replace these seven of yours with new lines on different topics and situations, keeping each one's id, place, kind, and concerns exactly, and keeping it declarative or tagged if it was:

- line-41 (home, yes_no, health+consent): theirs was "Let me get your blood pressure before we start, alright?"
- line-52 (clinic, yes_no, health): theirs was "Any more falls since we last saw you?"
- line-55 (clinic, open, health): theirs was "When did you first notice trouble with buttons and zippers?"
- line-59 (clinic, yes_no, health+consent): theirs was "I'd like to bump up that medicine a bit and see if it helps. You okay with that?"
- line-62 (shop, either_or, no concerns): theirs was "How much of the ham can I get you?"
- line-63 (shop, yes_no, health): theirs was "You've been on this prescription before, haven't you?"
- line-73 (out, yes_no, no concerns): theirs was "Couldn't ask for a nicer day, could we?"

So avoid blood pressure, falls, "when did you first notice", dose changes, deli amounts, prior prescriptions, and the weather. Same rules as before: read no other file, write only in your folder, rerun your check.py, and reply in under 60 words with the counts, without pasting the lines.
```

Both got this one, and named the lines that the
[lines' mix](#decisions) decision counts:

```text
One question about your lines.jsonl: which ids did you mean to have no stored reply? Reply with the ids only, comma-separated. Read nothing else.
```

## Appendix: the bank's briefs

Everything the bank's writer and the reader were told is below, word for
word. The bank's writer got this brief as its whole prompt, written before
any writer started:

````text
You are the writer of Turn's starter bank: the 140 to 160 phrases a new user of Turn starts with. Turn is an iPhone app for adults who can't speak; they tap a saved phrase and the phone speaks it. Work in the repository at /Users/yk/Projects/hackathon.repository/revenuecat.repository/revenuecat.

## Rules

- Before grepping or reading any repo file, run `graphify query "<question>"` in the repo root (a hook enforces this).
- Read only the sources listed below. Never read `eval/lines.jsonl`, anything in `docs/plans/`, or anything under `/private/tmp`: other writers are writing the evaluation's partner lines, and they and you must stay independent of each other.
- Write only `app/src/content/starter-bank.json` (create its folders). Don't edit any other file, including the tests. No git, no GitHub. Never send any personal identifier to any service.

## Sources

- `docs/PRD.md`: "The speaking grid" (SPEAK-1 to SPEAK-7), "The phrase bank" (BANK-1 to BANK-10), "Places", and "Content requirements" (CONTENT-1, CONTENT-2, CONTENT-5).
- `docs/TRD.md`: "The phone's database".
- `docs/research/0032-turn-starter-content.md`: pain tools, the right to refuse, text AAC apps' starter sets, and plain language.
- `docs/research/0022-aac-practice.md`: "How prestored messages are organized", "Quick-fire, turn-holding, and repair messages", and "Adults with motor speech impairments".
- `eval/test/starter-bank.test.ts`: the check your file must pass.

## The users

Adults who can't speak or can't be understood, for example with ALS, after a stroke with dysarthria, or after a laryngectomy. They understand everything and have their own views. They talk with family, friends, carers, clinicians, shop staff, and strangers, at Home, Clinic, Shop, and Out. Each will edit these phrases into their own words (BANK-10), so write phrases worth keeping: an adult's own voice in the first person, warm and direct, sometimes wry; never childish, never clinical jargon. A clinic will review the bank later (CONTENT-5).

## The format, exactly

```json
{
  "categories": [
    {
      "id": "quick",
      "name": "Quick",
      "fixed": true,
      "phrases": [
        { "id": "yes", "text": "Yes", "fixed": true, "places": [] }
      ]
    }
  ],
  "places": [
    { "id": "home", "name": "Home" },
    { "id": "clinic", "name": "Clinic" },
    { "id": "shop", "name": "Shop" },
    { "id": "out", "name": "Out" }
  ]
}
```

- `categories` in grid order, then `places`: exactly these four, in this order.
- Every category and every phrase has every key shown; `fixed` is a boolean; `places` lists place ids, or is empty.
- Write it with 2-space indentation, one phrase object per line.

## Fixed by the spec: copy exactly

- **First category:** id `quick`, name "Quick", fixed true, exactly these five phrases in order, with no places: "Yes" (`yes`, fixed true), "No" (`no`, fixed true), "Not sure" (`not-sure`, fixed true), "I don't know" (`i-dont-know`, fixed false), "I have something to say" (`i-have-something-to-say`, fixed false).
- **Last category:** id `strip`, name "Conversation strip", fixed true, exactly SPEAK-7's five in order, each fixed false (the user may reword them) and with no places: "Wait, I'm typing" (`wait-im-typing`), "Sorry, say that again" (`sorry-say-that-again`), "And you?" (`and-you`), "I use this app to talk. Please give me time." (`i-use-this-app-to-talk`), "Something's wrong" (`somethings-wrong`). The grid never shows this category and the ranking never offers it, so don't repeat these phrases elsewhere.
- **Body and pain:** id `body-pain`, name "Body and pain", fixed true.
- **Food and drink:** id `food`, name "Food and drink", fixed false, holding "Water, please" tied to `home`.
- **"It was hard"** tied to `clinic`, in whichever category fits.
- **At least one phrase with the word "tired",** such as "I'm tired".
- **No other category or phrase is fixed.**

## Your choices

- **Ten categories in all:** Quick, then eight content categories (two of them `body-pain` and `food`), then the strip. A starting point you may change: Chat, Feelings, Body and pain, Care and help, Food and drink, Health, People, Out and about. Put the ones a user reaches for most right after Quick. Names are 1 to 3 plain words (at most 40 characters); ids are kebab-case.
- **140 to 160 phrases in all,** aiming for 150, counting Quick's and the strip's ten. Each content category holds 12 to 22.
- **Places:** tie a phrase to a place when it mostly belongs there; many phrases stay general, with no places, and a phrase may have several. Home, Clinic, Shop, and Out each need at least 10 phrases; aim for 15 to 25 each.
- **Cover** (CONTENT-1, ASHA's medical-care vocabulary, and the research note): greetings, thanks, and small talk; questions back to the partner; feelings and opinions; needs and asking for help; body and pain: whether it hurts, how bad in plain words (mild, bad, very bad; or a number the user can type), where, what it feels like, since when, and what it stops them doing; refusing and agreeing to care: stop, wait, not now, go ahead, ask me first, explain it again, what are you going to do; food and drink, including trouble swallowing; health, appointments, medicines, sleep, and therapy; family and friends; shopping, paying, and getting around; and a little humor.
- **Wording:** plain US English; one idea per phrase, in the active voice; everyday words ("help", "stop", "hurt"), not clinical ones; most phrases under 40 characters, none over 120; sentence case; straight apostrophes ('), never curly ones; no period after a one-sentence statement ("Water, please"), a "?" after a question, and full punctuation when a phrase has two sentences. No personal names at all (the user adds their own), no real person, no brands, no profanity. No two phrases the same, ignoring case.
- **Ids:** kebab-case slugs of the text: lowercase letters, digits, and hyphens, apostrophes dropped ("I'm tired" becomes `im-tired`), unique across every category and phrase, at most 40 characters (shorten long ones sensibly).

## Check

From `eval/`, run `bun run test test/starter-bank.test.ts` until it passes. Then read the whole file once, top to bottom, as a user would, and fix anything clumsy, repetitive, or missing.

Report back in under 150 words: the path, your ten categories with their phrase counts, the phrase count per place, and anything you weren't sure about. Don't paste the file.
````

The reader got this brief, written before this session read any line. Its
paragraph on the spec's fixed items was added when it was sent, after the
session had read the lines:

```text
You are the second reader of Turn's starter bank. Another agent wrote it; you wrote none of it. Turn is an iPhone app for adults who can't speak (for example with ALS, after a stroke, or after a laryngectomy): they tap a saved phrase and the phone speaks it, at Home, Clinic, Shop, or Out. The bank is the 140 to 160 phrases every new user starts with, before they edit them into their own words. Your read stands in for issue #18's criterion "A teammate other than the writer reads every phrase and signs off here", so read every phrase.

## Rules

- Before grepping or reading any repo file, run `graphify query "<question>"` in the repo root, /Users/yk/Projects/hackathon.repository/revenuecat.repository/revenuecat (a hook enforces this).
- Read `app/src/content/starter-bank.json` in full, and for the requirements `docs/PRD.md` ("The speaking grid", "The phrase bank", "Places", "Content requirements") and `docs/research/0032-turn-starter-content.md`. Never read `eval/lines.jsonl`, `docs/plans/`, or anything under `/private/tmp`: the evaluation's partner lines must not shape the bank.
- Don't edit any file. No git, no GitHub. Never send any personal identifier to any service.

## Read for

1. **CONTENT-1:** plain US English (spelling and words), at most 120 characters, no real person named; the Quick category, the strip's five, and phrases for pain, where it hurts, and refusing or agreeing to care are all there.
2. **Plain language:** one idea per phrase, active voice, everyday words rather than clinical ones.
3. **Voice:** an adult's own first-person voice, warm and direct; nothing childish, patronizing, or that a user would be embarrassed to say aloud; nothing that assumes a gender, a family shape, a religion, a diet, or a budget.
4. **Safety:** can the user stop care, refuse, agree, ask what's happening, say how bad the pain is and where, ask for help, and get attention? Name anything missing.
5. **Places:** each tie makes sense, and phrases that belong at a place are tied to it.
6. **Duplicates:** two phrases that say the same thing, or one that repeats the strip's or Quick's.
7. **Mechanics:** clumsy or ambiguous wording, US spelling, the punctuation rule (no period after a one-sentence statement, a "?" after a question, full punctuation when a phrase has two sentences), straight apostrophes, and ids that don't match their text.

Keep in mind the spec's fixed items, which must not change: Quick's five phrases and their ids; the strip's five and their ids; the ids `body-pain` and `food`; "Water, please" tied to Home; "It was hard" tied to Clinic; a phrase with "tired"; 140 to 160 phrases in 9 to 11 categories; at least 10 phrases per place.

## Report

Under 500 words, in three parts:

1. **Must fix:** each issue with the phrase's id, what's wrong, and the exact replacement text (or "delete", or a new phrase with its category, id, and places).
2. **Could fix:** the same format, for improvements that aren't required.
3. **Sign-off:** one sentence saying whether you'd sign off on the bank once the must-fix items are done.
```

The bank's writer then got this message, followed by the reader's first
report, unchanged:

```text
A second reader, who wrote none of the bank, read every phrase. Its report follows, unchanged. Apply all four must-fix items, and each could-fix item you agree with (skip any you don't, and say why). Keep 140 to 160 phrases, every item the spec fixes, unique slug ids, and the file's format. Same rules as before: never read eval/lines.jsonl, docs/plans/, or anything under /private/tmp; write only app/src/content/starter-bank.json; rerun `bun run test test/starter-bank.test.ts` from eval/ until it passes. Reply in under 150 words with what you changed and skipped, and the new counts per category and place.
```

```text
The bank passes every spec check, but it has four safety gaps. I'd sign off once they're fixed.

**1. Must fix**

- **`my-arm-hurts` and `my-leg-hurts`** (new; Body and pain; no places): "My arm hurts" and "My leg hurts". All five pain sites are head, neck or trunk. To report limb pain, such as shoulder pain after a stroke or leg cramps with ALS, the user has to type.
- **`whats-happening`** (new; Care and help; no places): "What's happening?" The existing `what-are-you-going-to-do` asks only about the partner's next step. No phrase asks about what is going on around the user.
- **`please-come-here`** (new; Care and help; Home): "Please come here". No phrase calls someone over. `excuse-me` is tied only to Shop and Out.
- **Order of the urgent phrases** (no text change): `im-having-trouble-breathing` and `please-call-911` are 21st and 22nd of 22 in Body and pain, and `stop-please` is 14th of 21 in Care. They're probably off the first screen, and BANK-4 keeps the starter order until the user changes it.
  - Move the breathing and 911 pair to the top of Body and pain.
  - Move `stop-please`, `no-i-dont-want-that`, `yes-go-ahead` and `please-wait` to the top of Care.

With these, the bank has 157 phrases.

**2. Could fix**

- **`ill-rate-my-pain-from-0-to-10`** becomes "I'll type my pain from 0 to 10" (`ill-type-my-pain-from-0-to-10`). "Rate" doesn't tell the partner to wait for a typed number.
- **`the-pain-is-gone`** (new; Body and pain; no places): "The pain is gone". No phrase says the pain has stopped after treatment, and the research note suggested a "No pain" phrase.
- **`please-explain-that-again`** becomes "I don't understand" (`i-dont-understand`, Clinic). The bank has no "I don't understand", and "explain that again" sounds too much like the strip's "say that again".
- **`im-fine-just-slow`** becomes "I'm fine, just taking my time" (`im-fine-just-taking-my-time`). A listener can take "slow" as a comment on the user's mind.
- **`im-a-little-grumpy-today`** becomes "I'm in a bad mood" (`im-in-a-bad-mood`). "A little grumpy today" is how a carer describes a patient.
- **`im-full`** (new; Food and drink; Home): "I'm full". It pairs with "More, please" and tells whoever is feeding the user to stop.
- **Place ties:**
  - Add Clinic to `i-need-to-use-the-bathroom`, `can-we-take-a-break` and `excuse-me`.
  - Add Shop and Out to `please-talk-to-me-not-about-me`, since clerks often speak to the companion instead.
  - Add Home to `ask-me-before-you-touch-me`.

With all of these as well, the bank has 159 phrases.

**3. Sign-off**

I'd sign off once the four must-fix items are in, because every fixed item holds, the counts and mechanics pass, no tie is wrong, nothing is duplicated, and nothing is childish or assumes a gender, family shape, religion or budget.

- **Counts:** 153 phrases in 10 categories; 21 at Home, 25 at Clinic, 16 at Shop and 22 at Out.
- **Mechanics:** the longest phrase is 44 characters, and the bank uses US spelling, straight apostrophes and the punctuation rule throughout. Every id matches its text, except the strip's fixed `i-use-this-app-to-talk`.
- **Duplicates:** `im-not-finished` and `please-wait` do different jobs from the strip's "Wait, I'm typing".
- **Diet:** `coffee-please` is the only phrase that assumes a diet, and it's fine as an example to edit.

I read the bank, the four PRD sections, research note 0032, and for context PRD ROW-3 and the TRD's shortlist section. I didn't open anything under `eval/`, `docs/plans/` or `/private/tmp`, and I edited no files.
```

When it asked whether to keep four of its phrases in other categories to
stay under 22 a category, a limit its brief had set, it got this:

```text
Lift the cap: the 22-phrase limit was only guidance, and symptoms belong in the fixed Body and pain category. Move "I feel sick", "I feel dizzy", and "The pain keeps me awake" back to Body and pain, and "Please call the nurse" back to Care and help, each where it reads best, keeping the urgent phrases at the top of both categories. Same rules as before; rerun the check and reply in under 60 words with the counts per category and place.
```

The reader got this before it signed off:

```text
The bank's writer applied your report: all four must-fix items and every could-fix item. To keep symptoms in the fixed safety category, Body and pain now holds 25 and Care and help 23; there are 159 phrases. Please reread app/src/content/starter-bank.json in full, under the same rules as before (never read eval/lines.jsonl, docs/plans/, or anything under /private/tmp; edit nothing), and reply in under 150 words: anything still wrong, then a one-paragraph sign-off, if you give it, suitable for posting on issue #18 as an agent's read.
```

[trd-eval-data]: /docs/TRD.md#the-evaluation-data
[teammate-read]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/75

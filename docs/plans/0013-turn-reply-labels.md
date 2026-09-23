# Turn's reply labels implementation plan

**Goal:** Close [issue #21][labels-issue]: each of the 80 partner lines in
`eval/lines.jsonl` lists its acceptable replies in the starter bank by id,
or none, labeled by someone other than its writer, with a second labeling
beside it for the labelers' agreement, and a check holds both to EVAL-1.

**Architecture:** Two labeler agents, `claude-c` and `claude-d`, each label
all 80 lines alone from the same self-contained brief. `claude-c`'s labels
become each line's `labeler` and `acceptable` fields in `eval/lines.jsonl`,
the labeling the evaluation scores; `claude-d`'s go in
`eval/second-labeling.jsonl`, which only the agreement reads.
`eval/src/data.ts` reads the lines, the second labeling, and the bank for
the package's checks, and `eval/test/labels.test.ts` holds the labels to
their format and to EVAL-1's two label quotas, using the phone's own keyword
matching.

**Tech Stack:** Vitest 4.1.11 and TypeScript 6.0.3 in `@turn/eval`;
`PhraseIndex` and `fixedButtons` from `@turn/shared`; Claude subagents as
labelers; the `gh` CLI.

**Spec:** Issue #21, under the spec in [issue #13][spec]; the PRD's
[evaluation requirements][prd-eval]; and the TRD's
[evaluation data][trd-eval-data]. The user's goal directive, verbatim:
"/ask-matt Complete and close #21. Follow @docs/references/markdown-style.md
(use List instead of TOC) and this workflow: branch -> /research (10-minute
max) -> plan -> implement -> create small and atomic commits -> push branch
-> PR -> code review -> resolve -> merge -> delete branch."

Contents:

1.  [Global constraints](#global-constraints)
1.  [Skills](#skills)
1.  [Design](#design)
1.  [Verification gate](#verification-gate)
1.  [Tasks](#tasks)
1.  [Appendix: the labelers' brief](#appendix-the-labelers-brief)

[labels-issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/21
[spec]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/13
[prd-eval]: /docs/PRD.md#evaluation-requirements

## Global constraints

- **#21's acceptance criteria,** verbatim:
  - "Every line lists its acceptable replies by starter-bank id, or none,
    labeled by a teammate other than its writer (EVAL-1)"
  - "At least 16 lines have no acceptable reply, and at least 10 share no
    content word with any acceptable reply (EVAL-1)"
  - "The second labeling is committed beside the first"
- **EVAL-1,** in part: each line has "every acceptable reply in the starter
  bank, or none, labeled by a teammate other than its writer. At least 16
  lines have no acceptable reply", and "at least 10 share no content word
  with any acceptable reply. Check: a script counts them and prints the
  labelers' agreement."
- **The TRD's evaluation data,** in part: "For yes-or-no lines, acceptable
  replies may include the fixed buttons." and "A second teammate labels the
  acceptable replies, and the script reports their agreement".
- **Plan 0011's decision 9,** in part: "An id stays once labeled, even if
  its phrase's text changes."
- **#75's second criterion,** verbatim: "Any change comes from someone who
  hasn't read `eval/lines.jsonl`, lands before #21's labels, and keeps
  `bun run test` passing"
- **The repository's rules:** Conventional Commits with no attribution
  lines; never stage `skills-lock.json`, `.agents/`, or `.claude/`; run
  `graphify query "<question>"` before reading repo files; send no personal
  identifier to any service.

## Skills

- `/research` wrote the note; `/code-review` reviews the branch on two
  axes, with #21 and this plan as the spec; `/pr` shapes the pull request's
  body.

## Design

### Decisions

1.  **Agents label, at the user's direction, and the record says so.** #21
    is `ready-for-human` and asks for "a teammate other than its writer",
    and the user's directive asks this session to complete and close it
    without pausing, as it did #18 and #19. So two Claude subagents label,
    each in its own context: `claude-c` and `claude-d`, neither of which
    wrote a line. That meets "other than its writer" but not "a teammate",
    so that part of the first criterion stays unticked on #21, and a new
    `ready-for-human` ticket, #76, asks a teammate to label the lines before
    #40's run. Two labelings by one model show consistency, not correctness, and
    labels a model made may favor a ranker built on one
    ([labeling notes][notes-models]), so the TRD says who labeled, and #29's
    and #64's disclosure criteria add the labels.
1.  **Blind, independent labelers.** Each labeler gets one self-contained
    brief (see the [appendix](#appendix-the-labelers-brief)) and reads
    nothing else: not the repository, the plans, the ranker's code, the
    writers' list of lines they meant to have no reply, the quotas, or the
    other's labels. The brief holds the rules, the bank's phrases, and the
    lines, filled in from the committed files by the appendix's script. The
    session, which has read the lines, the bank, and the writers' list,
    writes only the rules, fixes them in this plan before either labeler
    starts, and changes no label: a label that breaks a rule goes back to
    its own labeler.
1.  **The first labeling is set in advance.** `claude-c`'s labeling is the
    first, which the evaluation scores, and `claude-d`'s is the second,
    which only the agreement reads. This plan is committed before either
    starts, so neither the counts nor the agreement can choose which is
    first. The first stands as labeled: disagreements are for a later
    round's rules, not silent fixes ([labeling notes][notes-guidelines]).
1.  **What counts as acceptable.** A phrase that the person who said the
    line would take as an appropriate reply, the bar Gupta et al.'s raters
    used ([labeling notes][notes-acceptable]), in its exact words, as
    someone in the user's place might well mean it; every such phrase, not
    only the likeliest; meaning over shared words; any place's phrases; and
    no target count. Each labeler reads the whole bank for every line, not
    only the reply the writer had in mind.
1.  **Replies that fit almost anything.** A hedge such as "I don't know",
    asking to wait or to hear it again, and taking or holding the turn count
    only when they answer the line as asked. A ranker that always offers
    generic replies would otherwise score well, the failure the generic-reply
    studies describe, and no source says to count them
    ([labeling notes][notes-generic]).
1.  **The fixed buttons and the strip.** Yes, No, and Not sure are
    acceptable only on `yes_no` lines, as the TRD allows. The strip's five
    are never candidates: the row never ranks them (ROW-2, SPEAK-7) and
    they're always on screen, so a line only a strip phrase answers has no
    acceptable reply, and a hold is right.
1.  **The format.** Each line in `eval/lines.jsonl` gains `labeler` and
    `acceptable`: the first labeler's name, then the ids of every acceptable
    reply in the bank's order, or `[]` for none. `eval/second-labeling.jsonl`
    holds one object per line in the same order, with `id`, `labeler`, and
    `acceptable`. The TRD puts the scored labels in the lines' file; the
    second sits beside it, so the scorer can't read the wrong one.
1.  **"Shares no content word"** is the phone's own test: a line shares a
    word with its replies when `PhraseIndex.match`, over those replies
    alone, finds any, so words are whole, lowercased, and outside
    `commonWords`, as the keyword ranking matches them, and the fixed
    buttons' words count. A line counts toward EVAL-1's 10 only if it has
    an acceptable reply besides the fixed buttons, since those come from the
    question-kind call, not the ranking, and every `yes_no` line they alone
    answer would otherwise count. That's stricter than the criterion's
    words, and implies them. The TRD records the rule, so #29's subset of
    lines with no shared word uses it.
1.  **The checks.** `eval/test/labels.test.ts`: every line's labeler is
    named and isn't its author; in each labeling, every id is in the bank,
    none repeats, none is a strip phrase, and the fixed buttons appear only
    on `yes_no` lines; at least 16 lines have none; at least 10 have no
    shared content word; and the second labeling covers every line, in the
    lines' order, by a labeler other than the first. `eval/src/data.ts`
    reads the lines, the second labeling, and the bank for all three of the
    package's checks, rather than a third copy of the reading and the types.
1.  **The agreement is #29's to print.** Its count script prints the quotas
    and the agreement (EVAL-1). This pull request gives the agreement as
    evidence, as the [labeling notes][notes-agreement] suggest: for the
    none-or-some call on each line, a two-by-two table with percent
    agreement, Cohen's kappa, and positive and negative agreement; for each
    line and phrase, positive agreement first, since almost every pair is
    "not acceptable"; and Krippendorff's alpha with the MASI distance over
    the 80 sets, with none against none identical and none against any
    phrase disjoint. #29 gets a note with these choices.
1.  **Nothing changes to meet a quota.** Neither the lines nor the labels
    change to reach 16 lines with none or 10 with no shared word. If the
    first labeling falls short, its check leaves that quota out, the
    criterion stays unticked on #21 with the counts, and the shortfall goes
    to the team.
1.  **The bank may still change.** #75 asked for a teammate's read of the
    bank before these labels, and the directive puts the labels first. Ids
    stay once labeled (plan 0011's decision 9), so the labels still name
    the right phrases, but a reworded phrase can change which lines it
    fits, so #75 gains a note: a changed phrase means relabeling the lines
    that list it, or might now.

[notes-models]: /docs/research/0034-turn-reply-labels.md#language-models-as-labelers
[notes-guidelines]: /docs/research/0034-turn-reply-labels.md#guidelines-and-independent-labeling
[notes-acceptable]: /docs/research/0034-turn-reply-labels.md#which-candidates-count-as-acceptable
[notes-generic]: /docs/research/0034-turn-reply-labels.md#replies-that-fit-almost-any-line
[notes-agreement]: /docs/research/0034-turn-reply-labels.md#agreement-on-set-valued-labels

### Rejected alternatives

- **The session labels:** it has read the writers' list of lines meant to
  have no reply, and it knows the quotas.
- **The writers label each other's lines:** their contexts are gone, and a
  new agent isn't the writer.
- **A consensus labeling,** with the session settling each disagreement:
  that brings its knowledge of the lines back in, and EVAL-1 asks for a
  labeling and the agreement, not a consensus.
- **Telling the labelers the quotas:** they would aim at them.
- **The criterion's words alone for "no content word",** counting lines
  answered only by the fixed buttons: yes-or-no lines alone would meet the
  quota, and those lines show nothing about ranking.
- **Stemming, so "hurt" matches "hurts":** the phone doesn't stem, and the
  quota and EVAL-3's subset are about where its keyword ranking finds
  nothing.
- **The second labeling as fields in `eval/lines.jsonl`:** the scorer could
  read the wrong one.

### Out of scope

- The count script, the agreement it prints, and the harness (#29), and
  the run (#40).
- A teammate's labeling (#76), meeting EVAL-1's floor of 16 lines with no
  acceptable reply (#77), and a teammate's read of the bank
  ([#75][teammate-read]).

[teammate-read]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/75

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
Prettier, `check_md.py` with `--contents`, and `fact_scan.py` for new prose,
with the session's copy of `check_md.py`, which closes a code block only on
a fence at least as long as the one that opened it ([plan 0011's
gate][content-gate]).

[docs-gate]: /docs/plans/0009-plan-storage.md#verification-gate
[content-gate]: /docs/plans/0011-turn-starter-content.md#verification-gate

## Tasks

The labelers read nothing but their brief. Any other subagent's prompt
carries the repo rule: run `graphify query "<question>"` before grepping or
reading repo files. No subagent sends the user's email address or any
personal identifier to an API, and none writes a file its prompt doesn't
name or runs git.

### Task 1: Research note

A background agent wrote `docs/research/0034-turn-reply-labels.md` in
about eight minutes. Blocked pages and a spent search budget left TREC's
assessor study, KWickChat, and any interval method under its gaps. The
session corrected the bank's counts in two lines and the strip's wording in
one, and checked one quote against its source. The note passes the docs
gate apart from fact-scan misses that aren't claims from a source capture:
the papers' years, the percentages it quotes from papers read live, and
its own estimate of the pairs. It is committed as
`docs(research): add notes on labeling the replies`.

### Task 2: This plan

- [ ] **Step 1: Run the docs gate, then commit** before either labeler
      starts, so the rules and the first labeler are fixed first:

  ```shell
  git add docs/plans/0013-turn-reply-labels.md
  git commit -m "docs(plan): add the plan for labeling the replies"
  ```

### Task 3: One module for the data

**Files:** create `eval/src/data.ts`; modify `eval/test/lines.test.ts` and
`eval/test/starter-bank.test.ts`.

- [ ] **Step 1: Move the reading.** `eval/src/data.ts` exports the `Line`,
      `Phrase`, `Category`, and `StarterBank` types and the parsed `lines`
      and `bank`, read with `node:fs` as the two checks read them now; both
      checks import them instead.
- [ ] **Step 2: Run the gate.** `@turn/eval` still passes its 8 tests.
- [ ] **Step 3: Commit**

  ```shell
  git add eval/src/data.ts eval/test/lines.test.ts \
    eval/test/starter-bank.test.ts
  git commit -m "refactor(eval): read the lines and the bank in one module"
  ```

### Task 4: The labelers

- [ ] **Step 1: Build the briefs.** Run the appendix's script once per
      labeler, with the rules as the appendix gives them.
- [ ] **Step 2: Start both labelers at once,** each a background
      `general-purpose` agent whose whole prompt is its brief: `claude-c`
      and `claude-d` each write their own JSON Lines file in their own
      scratch folder.
- [ ] **Step 3: Check each file** against the rules a script can check: 80
      rows in the lines' order, ids from the bank, no repeats, no strip
      phrase, and the fixed buttons only on `yes_no` lines. A file that
      breaks one goes back to its own labeler with the rows and the rule it
      broke, and nothing else.

The labelers took about 13 and 15 minutes, and a script confirmed that each
one's prompt was its brief, word for word. Both files passed every rule a
script can check, so neither went back. What they found:

- **Too few lines with no reply.** The first labeling left 8 lines with no
  acceptable reply and the second 7, against EVAL-1's 16. Every `yes_no`
  line takes Yes and No in both, and in each, 8 more lines take only
  replies such as "I don't know", "Thank you", or "Tell me more". By
  decision 11, nothing changed: the check keeps the 16 as a `test.todo`,
  #77 asks the team to meet it, #76 asks a teammate to label the lines, and
  #40 now waits on both.
- **No shared word.** 54 lines in the first labeling and 52 in the second
  share no content word with their replies, against EVAL-1's 10.
- **Agreement,** with 95% intervals from 2,000 bootstrap resamples of the
  lines: the none-or-some call agrees on 79 of 80 lines, kappa 0.93 (0.74
  to 1.00); over line and phrase pairs, positive agreement is 0.88 (0.85 to
  0.91) and negative 0.996; the two sets match exactly on 32 lines; and
  Krippendorff's alpha with the MASI distance is 0.65 (0.57 to 0.71).

### Task 5: The first labeling

**Files:** modify `eval/lines.jsonl` and `eval/src/data.ts`; create
`eval/test/labels.test.ts`.

- [ ] **Step 1: Write the check** in `eval/test/labels.test.ts`: each line's
      labeler is named and isn't its author; each line's ids exist in the
      bank, don't repeat, include no strip phrase, and include the fixed
      buttons only on a `yes_no` line; at least 16 lines have none; and at
      least 10 have an acceptable reply besides the fixed buttons and share
      no word with any of their replies, by `PhraseIndex` over those replies
      alone. `Line` gains `labeler` and `acceptable`.
- [ ] **Step 2: See it fail:** the lines have no labels yet. Once the
      labels were in, the quota of 16 became a `test.todo` that points at
      #77, by decision 11.
- [ ] **Step 3: Add the labels.** Give each line in `eval/lines.jsonl`
      `"labeler": "claude-c"` and its `acceptable` ids from `claude-c`'s
      file, in the bank's order, changing nothing else in the line.
- [ ] **Step 4: Run the gate,** then commit:

  ```shell
  git add eval/lines.jsonl eval/src/data.ts eval/test/labels.test.ts
  git commit -m "feat(eval): label the lines' acceptable replies"
  ```

### Task 6: The second labeling

**Files:** create `eval/second-labeling.jsonl`; modify `eval/src/data.ts`
and `eval/test/labels.test.ts`.

- [ ] **Step 1: Extend the check:** a second labeling of every line, in the
      lines' order, by a labeler other than the first, held to the same
      rules for its ids. `eval/src/data.ts` exports `secondLabeling` and its
      `Labels` type.
- [ ] **Step 2: See it fail** with `ENOENT` for the new file.
- [ ] **Step 3: Write the file** from `claude-d`'s: one object per line with
      `id`, `"labeler": "claude-d"`, and `acceptable` in the bank's order.
- [ ] **Step 4: Run the gate,** then commit:

  ```shell
  git add eval/second-labeling.jsonl eval/src/data.ts eval/test/labels.test.ts
  git commit -m "feat(eval): add a second labeling of the lines"
  ```

### Task 7: The TRD

- [ ] **Step 1: Say how the lines were labeled.** In
      [the evaluation data][trd-eval-data], name the two fields and the
      second file, say that no labeling lists a strip phrase, define a line
      with no shared content word as decision 8 does, and add to the bullet
      on who wrote the files that `claude-c` and `claude-d` labeled the
      replies, that the report and the README say so, and that no teammate
      had labeled a line.
- [ ] **Step 2: Run the docs gate, then commit**

  ```shell
  git add docs/TRD.md
  git commit -m "docs(trd): say how the lines' replies were labeled"
  ```

### Task 8: The graph

- [ ] **Step 1: Refresh and commit**

  ```shell
  graphify update .
  git add graphify-out
  git commit -m "chore(graphify): refresh the graph for the reply labels"
  ```

### Task 9: Review and merge

- [ ] **Step 1: Push and open the pull request** with the `/pr` body,
      closing #21, with the counts and the agreement as evidence.
- [ ] **Step 2: Run `/code-review`** on its two axes, post the review on the
      pull request, fix each finding in its own commit, and post the
      resolution.
- [ ] **Step 3: Rebase-merge and delete the branch.**
- [ ] **Step 4: Update the issues.** Tick what #21's labels meet, leaving
      "a teammate" unticked with a pointer to #76 and the quota of 16 with
      a pointer to #77; close #21 with a comment; add the labels to #29's
      and #64's disclosure criteria; and note on #29 the rule for a shared
      word and the agreement, and on #75 that the labels landed first. #76
      and #77 were opened once the labels were in, each `ready-for-human`,
      with #76 blocked by #75, #77 by #76, and #40 by both.

## Appendix: the labelers' brief

Both labelers got this brief, word for word, as their whole prompt, with
`{LABELER}` as `claude-c` or `claude-d`, `{OUTPUT}` as a file in each
one's own scratch folder, and `{BANK}` and `{LINES}` filled in from the
committed files by the script after it.

````markdown
# Labeling acceptable replies for Turn's evaluation

You are one of Turn's labelers. Your name in the data is `{LABELER}`.

## Rules

- Read nothing: no files, no repository, no web. Everything you need is in
  this brief.
- Write only `{OUTPUT}`, with your file-writing tool. Run no commands.
- Work alone. Another labeler labels the same lines separately, and neither
  of you sees the other's labels.
- Send no personal information anywhere.

## What Turn is

Turn is an iPhone app for adults who understand speech but can't speak, for
example with ALS or after a stroke. When someone talks to the user, the app
hears the line and offers phrases from the user's bank as buttons: one big
button, a row of up to six, or no change. The user taps one, and the phone
speaks it. Your labels decide what counts as a right suggestion when the app
is tested on 80 lines that people say to the user: family at home, staff at
a clinic, staff at a shop, and people out and about.

## Your task

For each of the 80 lines below, list every phrase in the starter bank that
the user could tap, in its exact words, as a fitting reply to that line. If
none fits, list none. That's a real answer: the app should then change
nothing, and the user types or picks something else.

## What counts as an acceptable reply

1.  **It fits right after the line.** Imagine the person has just said the
    line and the phone speaks the phrase next. The phrase is acceptable if
    that person would take it as an appropriate reply: it answers the
    question or responds to what was said, in a way someone in the user's
    place might well mean. It needn't be the likeliest reply: list every
    phrase that fits, including ones that answer differently, such as a yes
    and a no.
2.  **Its exact words, nothing added.** Judge the phrase as it's written.
    Leave it out if it would fit only with words the user adds, or only in
    an unusual situation you'd have to invent.
3.  **Meaning, not shared words.** A phrase can fit without sharing a word
    with the line, and sharing a word doesn't make it fit.
4.  **Replies that fit almost anything.** Some phrases would fit nearly
    any line: hedges such as "I don't know", asking someone to wait or say
    it again, and taking or holding the turn. List one only when it answers
    this line as asked, as "I don't know" answers "Do you know where the car
    keys are?". Don't list it just because the user could say it to
    anything.
5.  **The fixed buttons.** Yes, No, and Not sure (`yes`, `no`, and
    `not-sure`) are the fixed buttons, which the app shows for yes-or-no
    questions. List them only on lines marked `yes_no`, and there, each one
    a user might answer with. Never list them on other lines.
6.  **Places don't limit replies.** Each phrase shows the places it's tied
    to, but a phrase can be acceptable at any place.
7.  **Each line on its own.** Don't aim for any number of replies or any
    share of lines with none. Label each line from its words, its kind, and
    its place.

A line's kind is `yes_no` (a yes-or-no question, including one said as a
statement, such as "You're cold?"), `either_or` (a choice between options
the line names), `open` (any other question), or `not_a_question` (a
statement, greeting, offer, or request).

## The starter bank

The conversation strip's five phrases are always on the screen and never
suggested, so they aren't listed and aren't candidates. The other phrases
follow in the app's order, by category, each with its id, its text, and its
places.

{BANK}

## The 80 lines

Each line shows its id, its kind, its place, and its words.

{LINES}

## Output

Write `{OUTPUT}` as JSON Lines: one object per line, in the order above,
and nothing else in the file. For example:

```json
{"id":"line-01","acceptable":["some-phrase-id","another-phrase-id"]}
{"id":"line-02","acceptable":[]}
```

Use only ids from the bank above. Then reply with the path and the number
of rows you wrote.
````

The script that fills in a brief, run once per labeler as
`python3 make_brief.py <repo> rules.md <labeler> <output> > brief.md`:

```python
"""Builds each labeler's brief from the rules and the committed data files.

Usage: python3 make_brief.py <repo> <rules.md> <labeler> <output path> > brief.md
"""

import json
import sys
from pathlib import Path

repo, rules_path, labeler, output = sys.argv[1:5]
bank = json.loads((Path(repo) / 'app/src/content/starter-bank.json').read_text())
lines = [json.loads(row) for row in (Path(repo) / 'eval/lines.jsonl').read_text().splitlines() if row.strip()]
place_names = {place['id']: place['name'] for place in bank['places']}

bank_md = []
for category in bank['categories']:
    if category['id'] == 'strip':
        continue
    bank_md.append(f"### {category['name']}\n")
    for phrase in category['phrases']:
        places = ', '.join(place_names[p] for p in phrase['places']) or 'no place'
        fixed = ', a fixed button' if phrase['fixed'] else ''
        bank_md.append(f"- `{phrase['id']}`: {phrase['text']} ({places}{fixed})")
    bank_md.append('')

lines_md = [f"- `{line['id']}` ({line['kind']}, {place_names[line['place']]}): {line['text']}" for line in lines]

rules = Path(rules_path).read_text()
brief = (
    rules.replace('{LABELER}', labeler)
    .replace('{OUTPUT}', output)
    .replace('{BANK}', '\n'.join(bank_md).rstrip())
    .replace('{LINES}', '\n'.join(lines_md))
)
sys.stdout.write(brief)
```

[trd-eval-data]: /docs/TRD.md#the-evaluation-data

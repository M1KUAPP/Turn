# Turn's no-reply floor implementation plan

**Goal:** Close [issue #77][floor-issue]: at least 16 of the 80 partner
lines have no acceptable reply in the labeling the evaluation scores, and
`eval/test/labels.test.ts` asserts it, through new lines that a writer
blind to the bank wrote and two other agents labeled by plan 0013's rules.

**Architecture:** A writer agent, `claude-f`, writes 20 lines meant to have
no stored reply, `line-81` to `line-100`, five at each place. Two labeler
agents, `claude-g` and `claude-h`, each label them mixed among the 80 lines
from plan 0013's brief. Taken in id order, each new line replaces the next
line at its place in a fixed hash order, among the lines with a reply, until
the scored labeling has 16 lines with none. `claude-g`'s labels go with the
new lines in `eval/lines.jsonl` and `claude-h`'s in
`eval/second-labeling.jsonl`; the check asserts the floor, and the TRD and
the report say who wrote and labeled the new lines.

**Tech Stack:** Vitest 4.1.11 and TypeScript 6.0.3 in `@turn/eval`; Claude
subagents as the writer and the labelers; Python 3 scripts in the
appendices; the `gh` CLI.

**Spec:** Issue #77, under the spec in [issue #13][spec]; the PRD's
[evaluation requirements][prd-eval]; and the TRD's
[evaluation data][trd-eval-data]. The user's goal directive, verbatim:
"/ask-matt Complete and close #77. Follow @docs/references/markdown-style.md
(use List instead of TOC) and this workflow: branch -> /research (10-minute
max) -> plan -> implement -> create small and atomic commits -> push branch
-> PR -> code review -> resolve -> merge -> delete branch."

Contents:

1.  [Global constraints](#global-constraints)
1.  [Skills](#skills)
1.  [Design](#design)
1.  [Verification gate](#verification-gate)
1.  [Tasks](#tasks)
1.  [Appendix: the writer's brief](#appendix-the-writers-brief)
1.  [Appendix: the labelers' brief](#appendix-the-labelers-brief)
1.  [Appendix: the scripts](#appendix-the-scripts)

[floor-issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/77
[spec]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/13
[prd-eval]: /docs/PRD.md#evaluation-requirements

## Global constraints

- **#77's acceptance criteria,** verbatim:
  - "At least 16 lines have no acceptable reply in the labeling the
    evaluation scores, or EVAL-1 sets a new floor and the report says why
    (EVAL-1)"
  - "`eval/test/labels.test.ts` asserts the floor in place of its
    `test.todo`"
  - "Any new line comes from someone who hasn't seen the starter bank and
    is labeled by someone other than its writer"
- **#77's first way,** verbatim: "new lines, written by someone who hasn't
  seen the bank and labeled under the same rules, replacing lines picked by
  a rule set before anyone reads their labels;"
- **EVAL-1,** in part: "`eval/` holds 80 partner lines, written by the team
  by hand before looking at the starter bank", each with "every acceptable
  reply in the starter bank, or none, labeled by a teammate other than its
  writer. At least 16 lines have no acceptable reply, at least 24 are
  yes-or-no questions, at least 8 are about pain or health, at least 4 ask
  for consent, and at least 10 share no content word with any acceptable
  reply."
- **Plan 0013's rules,** the labelers' brief in
  [its appendix][labels-brief], and its decision 11: "Neither the lines nor
  the labels change to reach 16 lines with none or 10 with no shared word."
  That held for #21; #77 is where the team meets the floor.
- **The repository's rules:** Conventional Commits with no attribution
  lines; never stage `skills-lock.json`, `.agents/`, or `.claude/`; run
  `graphify query "<question>"` before reading repo files; send no personal
  identifier to any service.

## Skills

- `/research` wrote the note; `/code-review` reviews the branch on two
  axes, with #77 and this plan as the spec; `/pr` shapes the pull request's
  body.

## Design

### Decisions

1.  **New lines, the ticket's first way.** #77 offers three ways and leaves
    the choice to the team. The team closed #75 and #76, a teammate's read
    of the bank and a teammate's labels, as not planned on September 23,
    2026, and the directive asks this session to close #77 without pausing,
    so the session chooses. It chooses knowing the 8 and 7 lines with none
    and the replies that kept the rest from none, which
    [the research][notes-changes] says to record.
    - **New lines** keep EVAL-1's floor, plan 0013's rules, and
      `claude-c`'s labels on every line that stays, and a rule fixed before
      any new label is read picks the lines they replace, the "blind to
      the data" case in Nosek et al.
    - **A stricter rule** for replies that fit almost any line would be
      written after seeing which replies the labelers took. It would drop
      replies that do answer a line as asked, such as "I don't know" to a
      question the user may not know the answer to, to reach a number, and
      it needs a fresh labeling of all 80 lines in place of `claude-c`'s.
    - **A lower floor:** on 8 lines, a right-hold rate can't rule out 68%
      even when every hold is right, against 81% on 16
      ([the numbers][notes-numbers]). Six of the 8 lines with none are at
      the shop, and none is about pain, health, or consent, so new lines at
      every place widen what the holds test.
1.  **Agents write and label, at the user's direction, and the record says
    so.** #77 is `ready-for-human`. As with #18, #19, and #21, Claude
    subagents do the work, each in its own context: `claude-f` writes, and
    `claude-g` and `claude-h` label. The writer never sees the bank, and
    neither labeler wrote a line. The names skip `claude-e`, which an
    abandoned attempt at #76 used. The TRD and the report say who wrote and
    labeled the new lines.
1.  **A writer blind to the bank.** `claude-f` gets one self-contained
    brief ([appendix](#appendix-the-writers-brief)) and reads nothing else,
    so of the 80 lines it sees only those decision 4 quotes back. It's plan
    0011's writers' brief, changed where #77 needs it:
    - 20 lines, all meant to have no stored reply, five at each place in a
      fixed rotation, so any first few are spread over the places;
    - no yes-or-no lines, since Yes and No answer them;
    - partners talking "face to face with the user or near them", so a
      remark not addressed to the user can be a line;
    - a third user, an adult after a laryngectomy, whom the brief's "What
      Turn is" already names;
    - the labelers' rules 1 to 5, word for word, so the writer aims at the
      test the labelers apply, as SQuAD 2.0's writers were told theirs
      ([the research][notes-written]).

    The session, which has read the bank and the labels, wrote the brief's
    lists of lines that work and lines that don't from what the first
    labelings accepted. They name kinds of reply most phrase banks hold
    (thanks, an apology, agreement, a greeting, asking to hear more) and no
    phrase but the rules' own "I don't know"; the rules also name the fixed
    buttons, Yes, No, and Not sure.

1.  **Near-duplicates and wrong kinds go back.** Two instances of one model
    share habits (plan 0011). Before either labeler starts, the session
    compares the new lines with the 80 and sends back to `claude-f` a line
    that tests the same situation as one of them, quoting the other line,
    as `claude-b`'s seven went back. A line whose words don't fit its kind
    by the brief's definitions goes back too, since a yes-or-no question
    marked `open` would lose its Yes and No. The messages say nothing about
    the bank or the labels.
1.  **The labelers see the new lines among the 80.** Judges who first saw
    only non-relevant documents then scored relevance higher in Scholer et
    al. ([the research][notes-threshold]), so a batch made only of lines
    meant to have no reply could make a labeler more lenient. Each labeler
    gets plan 0013's brief, word for word but for the number of lines
    ([appendix](#appendix-the-labelers-brief)), with all 100 lines in one
    fixed order, by the SHA-256 of `issue-77-labels:` and each id.
    - Only the new lines' labels enter the data: `claude-g`'s as the
      scored labeling, and `claude-h`'s in the second labeling.
    - Their labels on the 80 are a check, given under Task 4: how far
      `claude-g` and `claude-h` agree with `claude-c` and `claude-d`, and
      how many of the 80 each leaves with none.
1.  **Which lines leave, fixed before any label is read.** Taken in id
    order, each new line replaces a line at its own place, so each place
    keeps 20 lines ([the script](#appendix-the-scripts)).
    - The candidates are the lines with a reply in `claude-c`'s labeling,
      since a line with none leaving would undo the gain.
    - Each place's candidates go in the order of the SHA-256 of `issue-77:`
      and the id, which no label can move; the order is in the appendix.
    - A candidate is skipped if its leaving would take the yes-or-no, pain
      or health, or consent lines below EVAL-1's 24, 8, or 4. The 54 lines
      that share no word can't fall below 10.
    - The replacing stops as soon as the scored labeling has 16 lines with
      none. The first writers keep as many lines as the floor allows, and
      lines with none stay about a fifth, as the TRD's mix has it.
    - A new line that its labeler gives a reply still takes its turn: no
      new line is kept or dropped for its labels.
1.  **If 20 aren't enough,** all 20 go in, and EVAL-1's floor becomes the
    count reached, the ticket's third way, with the PRD, the check, and the
    report saying why.
1.  **New ids, the same files.** The new lines keep `line-81` on, so no id
    names two lines; the lines they replace leave both files, which stay in
    id order with each line's ids in the bank's order. The first writers'
    lines keep their ids and labels.
1.  **The check asserts 16.** `eval/test/labels.test.ts` replaces its
    `test.todo` and its comment with a test that at least 16 lines have no
    acceptable reply. `bun run eval:count` then meets every quota and exits 0.
1.  **The record.** The TRD's evaluation data replaces its bullet on too
    few lines with how #77 met the floor, adds the new writer and labelers
    to who wrote and labeled the data, and drops "which #76 still asks
    for". The report's copy of that record in `eval/src/report.ts` changes
    with it, and its test checks the new facts.

[notes-changes]: /docs/research/0044-turn-no-reply-floor.md#replacing-items-and-reporting-a-changed-plan
[notes-numbers]: /docs/research/0044-turn-no-reply-floor.md#what-8-against-16-buys
[notes-written]: /docs/research/0044-turn-no-reply-floor.md#deliberately-written-no-answer-items
[notes-threshold]: /docs/research/0044-turn-no-reply-floor.md#a-judges-threshold-and-the-batch-it-sees

### Rejected alternatives

- **The second and third ways:** see decision 1. The third stays the
  fallback in decision 7.
- **Labeling the new lines alone:** a batch of lines meant to have none is
  the prologue Scholer et al. warn about.
- **Keeping only the new lines labeled none:** that picks lines by their
  labels.
- **Replacing the lines the first writers meant to have none:** their ids
  stay out of the repository (plan 0011), and they'd be picked by their
  labels.
- **All 20 in, 20 out:** lines with none could reach 28 of 80, well past a
  fifth, and more of the first writers' lines would leave than the floor
  needs.
- **Scoring the new labelers' labels on all 80 lines:** that replaces plan
  0013's scored labeling, fixed before its labels were read.
- **Showing the writer the bank's phrases or the 8 lines with none:** it
  must not see the bank, and it would copy the lines.

### Out of scope

- The run (#40) and the new rankers (#36).
- A teammate's read of the bank or labels (#75 and #76, closed as not
  planned), and relabeling the lines that stay.

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

From Task 5 on, `bun run eval:count` must exit 0 too. It scores no ranker,
so running it on the 80 lines leaves #40's run the first (EVAL-2). Markdown
files run the gate from [the plan-storage plan][docs-gate]: Prettier,
`check_md.py` with `--contents`, and `fact_scan.py` for new prose, with the
session's copy of `check_md.py`, which closes a code block only on a fence
at least as long as the one that opened it ([plan 0011's
gate][content-gate]).

[docs-gate]: /docs/plans/0009-plan-storage.md#verification-gate
[content-gate]: /docs/plans/0011-turn-starter-content.md#verification-gate

## Tasks

The writer and the labelers read nothing but their briefs. Any other
subagent's prompt carries the repo rule: run `graphify query "<question>"`
before grepping or reading repo files. No subagent sends the user's email
address or any personal identifier to an API, and none writes a file its
prompt doesn't name or runs git.

### Task 1: Research note

A background agent wrote `docs/research/0044-turn-no-reply-floor.md` in
about five minutes. A script of the session's checked every quote against
its source, and the session dropped one claim: the APS article names no
author. The ACM and SAGE pages answer scripted requests with 403, and
OSF's help page, which answered 404, is named in a code span rather than
linked. It is committed as
`docs(research): add notes on meeting the no-reply floor`.

### Task 2: This plan

- [ ] **Step 1: Run the docs gate, then commit** before the writer starts,
      so the briefs, the order, and the rule are fixed first:

  ```shell
  git add docs/plans/0022-turn-no-reply-floor.md
  git commit -m "docs(plan): add the plan for meeting the no-reply floor"
  ```

### Task 3: The writer

- [ ] **Step 1: Start `claude-f`,** a background `general-purpose` agent
      whose whole prompt is the brief in
      [the appendix](#appendix-the-writers-brief), writing in its own
      scratch folder.
- [ ] **Step 2: Check the file** with `check_new_lines.py`; a file that
      breaks a rule goes back to the writer with the rows and the rule.
- [ ] **Step 3: Send back near-duplicates and wrong kinds** (decision 4),
      then check the file again.

The writer took about 15 minutes, and a script confirmed that its prompt
was its brief, word for word. Its file passed `check_new_lines.py`, and
every line's words fit its kind. Five lines tested the same situation as
one of the 80: a cake order, shop staff sorting out who works when, a
parent telling a child off, a shoe size, and a question about the user's
dog. They went back with the message after
[the writer's brief](#appendix-the-writers-brief), and in about three
minutes their replacements, about limes, a delivery, a kids' game, a
guitar, and a new apartment, passed the checks. The 20 lines hold 7
either-or, 8 open, and 5 not a question, five at each place, with 7 on
pain or health.

Four of the five lines the message quoted, `line-30`, `line-62`, `line-66`,
and `line-78`, are among `claude-c`'s 8 with none. So the writer saw them,
as situations to avoid rather than as examples, though the rejected
alternatives had meant to keep them from it, and `line-87`, `line-91`, and
`line-92`, written after the message, are in the data.

### Task 4: The labelers

- [ ] **Step 1: Build both briefs** with `make_brief.py`, from the rules in
      [the appendix](#appendix-the-labelers-brief) and the writer's file.
- [ ] **Step 2: Start both labelers at once,** each a background
      `general-purpose` agent whose whole prompt is its brief: `claude-g`
      and `claude-h` each write their own JSON Lines file in their own
      scratch folder.
- [ ] **Step 3: Check each file** with `check_labels.py`. A file that
      breaks a rule goes back to its own labeler with the rows and the rule
      it broke, and nothing else.
- [ ] **Step 4: Compare** each labeler with `claude-c` and `claude-d` on
      the 80 lines, and give the result here.

The labelers took about 14 and 13 minutes, and a script confirmed that
each one's prompt was its brief, word for word. Both files passed
`check_labels.py`, so neither went back. `claude-h`'s reply also
summarized its calls, which nothing here uses. What they found:

- **The new lines.** `claude-g` left 12 of the 20 with no acceptable
  reply and `claude-h` 10, and they agree on some or none for 16 of the
  20 (kappa 0.60).
- **The 80.** `claude-g` left 8 with none, as `claude-c` did, but only 5
  are the same lines; `claude-h` left 12, against `claude-d`'s 7, and 6
  are the same.
- **Agreement with the first labelers,** from `bun run eval:count` on
  each pair's files: some or none agrees on 74 and 73 of the 80 lines
  (kappa 0.58 and 0.59), against 79 between `claude-c` and `claude-d`;
  over line and phrase pairs, positive agreement is 0.87 and 0.89,
  against 0.88; and alpha with the MASI distance is 0.58 for both,
  against 0.65. The new labelers pick replies as the first ones did, but
  which borderline lines have none depends on the labeler.

### Task 5: The new lines in the data

**Files:** modify `eval/lines.jsonl` and `eval/second-labeling.jsonl`.

- [ ] **Step 1: Apply the rule** with `apply.py`, and give here which new
      line replaced which line.
- [ ] **Step 2: Run the gate.** The check still holds the floor as a
      `test.todo`, and `bun run eval:count` now meets every quota.
- [ ] **Step 3: Commit**

  ```shell
  git add eval/lines.jsonl eval/second-labeling.jsonl
  git commit -m "feat(eval): replace 12 lines with new ones that have no reply"
  ```

The rule took 12 new lines and skipped no candidate. In order, `line-81`
to `line-92` replaced `line-04`, `line-57`, `line-25`, `line-35`,
`line-41`, `line-59`, `line-65`, `line-33`, `line-01`, `line-58`,
`line-61`, and `line-72`. `claude-g` gave 8 of the 12 no reply and 4 a
reply (`line-84`, `line-85`, `line-86`, and `line-89`), so the scored
labeling reached 16 with `line-92`, and `line-93` to `line-100` stayed
out. Every EVAL-1 quota is met: 16 lines with none, 37 yes-or-no, 30 on
pain or health, 10 on consent, and 49 that share no word. Over the 80,
the labelers' agreement is kappa 0.84 on some or none, positive
agreement 0.87 over the pairs, and alpha 0.64.

### Task 6: The floor's check

**Files:** modify `eval/test/labels.test.ts`.

- [ ] **Step 1: Assert the floor** in place of the `test.todo` and its
      comment: at least 16 lines have no acceptable reply (EVAL-1).
- [ ] **Step 2: See it fail on the old lines,** 8 against 16, by running it
      against `main`'s two files, then pass on the new ones. It failed
      with "expected 8 to be greater than or equal to 16".
- [ ] **Step 3: Run the gate,** then commit:

  ```shell
  git add eval/test/labels.test.ts
  git commit -m "test(eval): hold the lines to EVAL-1's 16 with no reply"
  ```

### Task 7: The report's record

**Files:** modify `eval/src/report.ts` and `eval/test/report.test.ts`.

- [ ] **Step 1: Test first:** the report's record says that `claude-f`
      wrote the new lines blind to the bank and that `claude-g` and
      `claude-h` labeled them. See it fail.
- [ ] **Step 2: Change the record** to match the TRD's (Task 8).
- [ ] **Step 3: Run the gate,** then commit:

  ```shell
  git add eval/src/report.ts eval/test/report.test.ts
  git commit -m "feat(eval): say in the report who wrote the new lines"
  ```

### Task 8: The TRD

- [ ] **Step 1: Say how the floor was met** in
      [the evaluation data][trd-eval-data]: replace the bullet on too few
      lines with none, add the new writer and labelers to who wrote and
      labeled the data, and drop "which #76 still asks for".
- [ ] **Step 2: Run the docs gate, then commit**

  ```shell
  git add docs/TRD.md
  git commit -m "docs(trd): say how the lines met the no-reply floor"
  ```

### Task 9: The graph

- [ ] **Step 1: Refresh and commit**

  ```shell
  graphify update .
  git add graphify-out
  git commit -m "chore(graphify): refresh the graph for the no-reply floor"
  ```

### Task 10: Review and merge

- [ ] **Step 1: Push and open the pull request** with the `/pr` body,
      closing #77, with the counts and the replacements as evidence.
- [ ] **Step 2: Run `/code-review`** on its two axes, with a fact-check,
      post the review on the pull request, fix each finding in its own
      commit, and post the resolution.
- [ ] **Step 3: Before merging,** list `docs/plans` and `docs/research` on
      `origin/main` and renumber this plan or the note if a peer took its
      number.
- [ ] **Step 4: Rebase-merge and delete the branch.**
- [ ] **Step 5: Update the issues:** tick #77's criteria and close it with
      a comment, and note on #40 that the count now meets every quota.

## Appendix: the writer's brief

The writer got this brief, word for word, as its whole prompt, with
`{FOLDER}` set to its own scratch folder. Its rules 1 to 5 are the
labelers' rules from plan 0013, word for word. The labelers weren't given
it.

````text
You are writing new lines for an evaluation set for Turn, an iPhone app. Write alone, from your own imagination.

## Rules

- Read nothing: not the repository, not the web, not any other file or folder. Never look for other writers' work or for any list of the app's phrases; you must not see them. Everything you need is here.
- Write only inside {FOLDER}. No git, no GitHub. Never send any personal identifier to any service.

## What Turn is

Turn is an iPhone app for adults who can't speak, for example people with ALS, after a stroke, or after a laryngectomy. The user speaks by tapping saved phrases, or by typing. In Listen mode, the phone transcribes what the conversation partner says, one "partner line" at a time, and suggests which of the user's saved phrases answer it, or suggests nothing when none fits. Your lines test the second case: whether the app holds back when nothing fits.

## The user in your lines

An adult in their fifties who had their voice box removed for throat cancer last year. They hear and understand everything, get around on their own, and work part-time from home, and they see a throat doctor and a speech therapist at the clinic.

Partners don't mention the condition in every line; they talk about ordinary life too.

## Who speaks

The partner: family, friends, carers, nurses, doctors, therapists, shop staff, neighbors, or strangers, talking face to face with the user or near them. Each line is one turn by the partner, as a live transcript would show it.

## The four places

Each line happens at one of the user's places: `home`, `clinic`, `shop`, or `out` (anywhere else: a park, a cafe, a bus stop, a friend's house, a family party). The app knows only the place's name, not what came before, so each line must make sense on its own, with the place as its only context.

## When a saved phrase fits

Later, labelers who haven't seen your lines will check each one against the app's saved phrases. A line has no stored reply only when no phrase fits by the rules they follow, which are these, word for word:

1.  **It fits right after the line.** Imagine the person has just said the line and the phone speaks the phrase next. The phrase is acceptable if that person would take it as an appropriate reply: it answers the question or responds to what was said, in a way someone in the user's place might well mean. It needn't be the likeliest reply: list every phrase that fits, including ones that answer differently, such as a yes and a no.
2.  **Its exact words, nothing added.** Judge the phrase as it's written. Leave it out if it would fit only with words the user adds, or only in an unusual situation you'd have to invent.
3.  **Meaning, not shared words.** A phrase can fit without sharing a word with the line, and sharing a word doesn't make it fit.
4.  **Replies that fit almost anything.** Some phrases would fit nearly any line: hedges such as "I don't know", asking someone to wait or say it again, and taking or holding the turn. List one only when it answers this line as asked, as "I don't know" answers "Do you know where the car keys are?". Don't list it just because the user could say it to anything.
5.  **The fixed buttons.** Yes, No, and Not sure (`yes`, `no`, and `not-sure`) are the fixed buttons, which the app shows for yes-or-no questions. List them only on lines marked `yes_no`, and there, each one a user might answer with. Never list them on other lines.

## What to write: 20 lines with no stored reply

Write 20 lines that no set of short saved phrases could answer well, as those rules judge it:

- Exactly 5 lines at each place, in this order: the first line at `home`, the second at `clinic`, the third at `shop`, the fourth at `out`, then `home` again, and so on.
- No yes-or-no questions: Yes and No always answer them. Use the other three kinds, at least 5 lines of each:
  - `either_or`, "Asks the listener to pick one of the options it names" ("Tea or coffee?").
  - `open`, "Needs an answer in the listener's own words" ("How did you sleep?").
  - `not_a_question`, "A statement, greeting, or comment, not a question" ("Morning! I brought the paper.").
- Lines that work: questions that need a specific fact or choice only the user can give (a date, a time, an amount, a size, a name, which of the named options), where not knowing would be an odd answer; and remarks not addressed to the user, such as staff talking to each other or a parent talking to a child.
- Lines that don't: questions about something the user might well not know, which "I don't know" answers; and remarks that invite thanks, an apology, agreement, a greeting, or a request to hear more, which saved phrases usually cover.
- Keep them natural, not trick questions: each should be something a partner really says.

## Wording

- Natural spoken US English, the way people really talk to a friend, a patient, or a customer: contractions, short fragments, the odd "so" or "okay". No stage directions, and no quotation marks around the line. Most lines under 80 characters; none over 300.
- Put a "?" at the end when the partner is asking, even when the words are a statement.
- No personal names (say "your sister", "the nurse", "your neighbor"), no real people, no brands, no profanity.
- Vary partners, topics, and wording; don't use one sentence pattern more than twice. Don't reuse any example sentence from this brief, and don't copy lines from any dataset, book, or website.

## Concerns

List in `concerns` every one of these that applies, or none:

- `pain`: pain, discomfort, or where it hurts.
- `health`: symptoms, medicines, treatment, therapy, tests, sleep or eating as health, or how the condition is going.
- `consent`: the partner asks permission for care, touch, a procedure, or something done on the user's behalf, or checks that the user agrees.

Write at least 4 lines that concern pain or health, spread over the places rather than all at the clinic.

## Topic

Give each line a `topic`: 1 to 3 lowercase words, letters and single spaces only, naming what it's about, such as "sleep", "blood pressure", or "weekend plans".

## Output

1. `{FOLDER}/lines.jsonl`: exactly 20 lines, one JSON object per line, keys in this order, with ASCII apostrophes ('):

   ```json
   {"id":"line-81","author":"claude-f","text":"...","kind":"open","place":"home","topic":"...","concerns":[]}
   ```

   Ids run from "line-81" to "line-100" in order, and `author` is always "claude-f".
2. Before you finish, check the file with a short script in {FOLDER} (python3 is available): 20 valid JSON objects; the ids above; the places in the order above; no `yes_no` line and at least 5 of each other kind; every concern from the list above; at least 4 lines on pain or health; texts of 1 to 300 characters with no leading or trailing space; topics matching `^[a-z]+( [a-z]+)*$`; no two texts alike. Fix anything off.

Report back in under 100 words: the file's path and the counts by kind, place, and concern. Don't paste the lines.
````

After its file passed the checks, the writer got one more message
([Task 3](#task-3-the-writer)):

```text
Thanks. Five of your lines test the same situation as lines already in the evaluation set, which would test the same thing twice. Please replace these five with new lines in different situations, keeping each one's id, place, kind, and concerns exactly:

- line-87 (shop, open, no concerns): an existing line is "And what name are we putting on the cake?"
- line-91 (shop, not_a_question, no concerns): an existing line is "We need another cashier up front, the line's getting long."
- line-92 (out, not_a_question, no concerns): an existing line is "Don't touch the cake yet, sweetie, we're doing candles first, go tell your brother it's almost time."
- line-95 (shop, open, no concerns): an existing line is "Did you want to try the nine, or the nine and a half?"
- line-100 (out, open, no concerns): an existing line is "Aw, what a sweet dog. What breed is she?"

So avoid cake orders, shop staff talking about who's working when, parents telling a child off, shoe sizes, and questions about the user's pet. Same rules as before: read no other file, write only in your folder, rerun your check script, and reply in under 60 words with the counts, without pasting the lines.
```

## Appendix: the labelers' brief

Both labelers get [plan 0013's brief][labels-brief], word for word but for
three changes to the number of lines, since they label 100:

```diff
-is tested on 80 lines that people say to the user: family at home, staff at
+is tested on lines that people say to the user: family at home, staff at
-For each of the 80 lines below, list every phrase in the starter bank that
+For each of the 100 lines below, list every phrase in the starter bank that
-## The 80 lines
+## The 100 lines
```

`{LABELER}` is `claude-g` or `claude-h`, and `{OUTPUT}` is a file in each
one's own scratch folder. The script that fills in a brief is plan 0013's,
with the new lines added and the order fixed, run once per labeler:

```shell
python3 make_brief.py <repo> rules.md <new lines> <labeler> <output> \
  > brief.md
```

```python
"""Builds each labeler's brief for #77 from the rules, the committed data, and the new lines.

Usage: python3 make_brief.py <repo> <rules.md> <new lines.jsonl> <labeler> <output path> > brief.md

The 80 committed lines and the 20 new ones are listed together in one fixed order, by the SHA-256 of
"issue-77-labels:" and each line's id, so the new lines sit among the others.
"""

import hashlib
import json
import sys
from pathlib import Path

repo, rules_path, new_path, labeler, output = sys.argv[1:6]
bank = json.loads((Path(repo) / 'app/src/content/starter-bank.json').read_text())
read = lambda path: [json.loads(row) for row in Path(path).read_text().splitlines() if row.strip()]
lines = read(Path(repo) / 'eval/lines.jsonl') + read(new_path)
assert len(lines) == 100 and len({line['id'] for line in lines}) == 100
lines.sort(key=lambda line: hashlib.sha256(f"issue-77-labels:{line['id']}".encode()).hexdigest())
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

## Appendix: the scripts

`order.py` gives each place's order for decision 6:

```python
"""Prints, for each place, the order in which a new line replaces the lines there.

Usage: python3 order.py <repo>

Only lines with an acceptable reply in the scored labeling can be replaced, and each place's lines are
sorted by the SHA-256 of "issue-77:" and the line's id, a fixed order no label can move.
"""

import hashlib
import json
import sys
from pathlib import Path

repo = Path(sys.argv[1])
lines = [json.loads(row) for row in (repo / 'eval/lines.jsonl').read_text().splitlines() if row.strip()]
key = lambda line: hashlib.sha256(f"issue-77:{line['id']}".encode()).hexdigest()
for place in ['home', 'clinic', 'shop', 'out']:
    order = sorted((line for line in lines if line['place'] == place and line['acceptable']), key=key)
    print(f"{place}: {', '.join(line['id'] for line in order)}")
```

Its output on the 80 lines, before any new line was written:

```text
home: line-04, line-41, line-01, line-46, line-08, line-07, line-05, line-09, line-44, line-42, line-48, line-49, line-47, line-43, line-10, line-02, line-50, line-03, line-06, line-45
clinic: line-57, line-59, line-58, line-53, line-20, line-15, line-52, line-14, line-54, line-18, line-11, line-16, line-13, line-56, line-60, line-51, line-55, line-12, line-17
shop: line-25, line-65, line-61, line-28, line-26, line-63, line-24, line-69, line-67, line-21, line-68, line-29, line-64, line-70
out: line-35, line-33, line-72, line-74, line-39, line-75, line-76, line-79, line-31, line-40, line-73, line-32, line-38, line-77, line-80, line-34, line-36, line-37, line-71
```

`check_new_lines.py` holds the writer's file to its brief:

```python
"""Checks the new writer's lines against the brief's rules.

Usage: python3 check_new_lines.py <lines.jsonl> <repo>
"""

import json
import re
import sys
from collections import Counter
from pathlib import Path

path, repo = sys.argv[1:3]
rows = [json.loads(row) for row in Path(path).read_text().splitlines() if row.strip()]
old = [json.loads(row) for row in (Path(repo) / 'eval/lines.jsonl').read_text().splitlines() if row.strip()]
problems = []
keys = ['id', 'author', 'text', 'kind', 'place', 'topic', 'concerns']
places = ['home', 'clinic', 'shop', 'out']
if len(rows) != 20:
    problems.append(f'{len(rows)} rows, not 20')
for i, row in enumerate(rows):
    if list(row) != keys:
        problems.append(f"{row.get('id')}: keys {list(row)}")
    if row.get('id') != f'line-{81 + i}':
        problems.append(f"row {i + 1}: id {row.get('id')}")
    if row.get('author') != 'claude-f':
        problems.append(f"{row['id']}: author {row.get('author')}")
    if row.get('place') != places[i % 4]:
        problems.append(f"{row['id']}: place {row.get('place')}")
    text = row.get('text', '')
    if not (1 <= len(text) <= 300) or text != text.strip():
        problems.append(f"{row['id']}: text length or spaces")
    if row.get('kind') not in ['either_or', 'open', 'not_a_question']:
        problems.append(f"{row['id']}: kind {row.get('kind')}")
    if not re.fullmatch(r'[a-z]+( [a-z]+)*', row.get('topic', '')):
        problems.append(f"{row['id']}: topic {row.get('topic')}")
    concerns = row.get('concerns', [])
    if any(c not in ['pain', 'health', 'consent'] for c in concerns) or len(set(concerns)) != len(concerns):
        problems.append(f"{row['id']}: concerns {concerns}")
kinds = Counter(row['kind'] for row in rows)
if any(kinds[k] < 5 for k in ['either_or', 'open', 'not_a_question']):
    problems.append(f'kinds {dict(kinds)}')
if sum(1 for row in rows if {'pain', 'health'} & set(row['concerns'])) < 4:
    problems.append('fewer than 4 on pain or health')
texts = [row['text'].lower() for row in rows] + [line['text'].lower() for line in old]
if len(set(texts)) != len(texts):
    problems.append('a text repeats')
print('\n'.join(problems) or 'OK: 20 rows follow the brief')
print('kinds', dict(kinds), 'places', dict(Counter(row['place'] for row in rows)),
      'concerns', dict(Counter(c for row in rows for c in row['concerns'])))
sys.exit(1 if problems else 0)
```

`check_labels.py` holds each labeler's file to the rules a script can
check:

```python
"""Checks a labeler's file against the rules a script can check.

Usage: python3 check_labels.py <repo> <new lines.jsonl> <labels.jsonl>

100 rows in the brief's order, each an id and a list of bank ids with no repeats and no strip phrase, and the
fixed buttons only on `yes_no` lines. Prints each row that breaks a rule.
"""

import hashlib
import json
import sys
from pathlib import Path

repo, new_path, labels_path = sys.argv[1:4]
bank = json.loads((Path(repo) / 'app/src/content/starter-bank.json').read_text())
read = lambda path: [json.loads(row) for row in Path(path).read_text().splitlines() if row.strip()]
lines = read(Path(repo) / 'eval/lines.jsonl') + read(new_path)
lines.sort(key=lambda line: hashlib.sha256(f"issue-77-labels:{line['id']}".encode()).hexdigest())
rows = read(labels_path)
ids = {p['id'] for c in bank['categories'] if c['id'] != 'strip' for p in c['phrases']}
fixed = {'yes', 'no', 'not-sure'}
problems = []
if [row.get('id') for row in rows] != [line['id'] for line in lines]:
    problems.append(f'{len(rows)} rows, not the brief\'s 100 ids in its order')
kinds = {line['id']: line['kind'] for line in lines}
for row in rows:
    acceptable = row.get('acceptable')
    if list(row) != ['id', 'acceptable'] or not isinstance(acceptable, list):
        problems.append(f"{row.get('id')}: keys {list(row)}")
        continue
    if len(set(acceptable)) != len(acceptable):
        problems.append(f"{row['id']}: repeats an id")
    if unknown := [a for a in acceptable if a not in ids]:
        problems.append(f"{row['id']}: not in the bank, or a strip phrase: {unknown}")
    if kinds.get(row['id']) != 'yes_no' and fixed & set(acceptable):
        problems.append(f"{row['id']}: a fixed button on a line that isn't yes_no")
print('\n'.join(problems) or f'OK: {len(rows)} rows follow the rules')
sys.exit(1 if problems else 0)
```

`apply.py` applies decisions 6 to 8 and writes both files:

```python
"""Replaces lines with the new ones by the plan's rule, then writes both labelings.

Usage: python3 apply.py <repo> <new lines.jsonl> <first labels.jsonl> <second labels.jsonl>

Taking the new lines in id order, each replaces the next line at its place in the order order.py prints,
skipping a line whose removal would leave fewer yes-or-no, pain or health, or consent lines than EVAL-1 asks
for, and it stops once the scored labeling has 16 lines with no acceptable reply. If the new lines run out
first, all of them go in. The files keep their lines in id order, and each line's ids in the bank's order.
"""

import hashlib
import json
import sys
from pathlib import Path

repo, new_path, first_path, second_path = sys.argv[1:5]
repo = Path(repo)
read = lambda path: [json.loads(row) for row in Path(path).read_text().splitlines() if row.strip()]
bank = json.loads((repo / 'app/src/content/starter-bank.json').read_text())
bank_order = [p['id'] for c in bank['categories'] for p in c['phrases']]
in_bank_order = lambda ids: sorted(ids, key=bank_order.index)
lines, second = read(repo / 'eval/lines.jsonl'), read(repo / 'eval/second-labeling.jsonl')
new = sorted(read(new_path), key=lambda line: int(line['id'].split('-')[1]))
first_labels = {row['id']: row['acceptable'] for row in read(first_path)}
second_labels = {row['id']: row['acceptable'] for row in read(second_path)}

key = lambda line: hashlib.sha256(f"issue-77:{line['id']}".encode()).hexdigest()
order = {place: sorted((l for l in lines if l['place'] == place and l['acceptable']), key=key)
         for place in ['home', 'clinic', 'shop', 'out']}
quotas = [(24, lambda l: l['kind'] == 'yes_no'),
          (8, lambda l: 'pain' in l['concerns'] or 'health' in l['concerns']),
          (4, lambda l: 'consent' in l['concerns'])]

kept, used, replaced = list(lines), [], []
for line in new:
    if sum(1 for l in kept if not l['acceptable']) >= 16:
        break
    labeled = {**line, 'labeler': 'claude-g', 'acceptable': in_bank_order(first_labels[line['id']])}
    for old in order[line['place']]:
        if old not in kept:
            continue
        after = [l for l in kept if l is not old] + [labeled]
        if all(sum(1 for l in after if keep(l)) >= least for least, keep in quotas):
            break
    else:
        sys.exit(f"no line at {line['place']} can leave for {line['id']}")
    kept = after
    used.append(line['id'])
    replaced.append(old['id'])
    print(f"{line['id']} ({'none' if not labeled['acceptable'] else 'a reply'}) replaces {old['id']}")

number = lambda row: int(row['id'].split('-')[1])
kept.sort(key=number)
gone = set(replaced)
second_rows = [row for row in second if row['id'] not in gone] + [
    {'id': i, 'labeler': 'claude-h', 'acceptable': in_bank_order(second_labels[i])} for i in used]
second_rows.sort(key=number)
write = lambda path, rows: Path(path).write_text(
    ''.join(json.dumps(row, separators=(',', ':'), ensure_ascii=False) + '\n' for row in rows))
write(repo / 'eval/lines.jsonl', kept)
write(repo / 'eval/second-labeling.jsonl', second_rows)
none = sum(1 for l in kept if not l['acceptable'])
print(f'{len(used)} new lines in, {len(kept)} lines, {none} with no acceptable reply')
```

[labels-brief]: /docs/plans/0013-turn-reply-labels.md#appendix-the-labelers-brief
[trd-eval-data]: /docs/TRD.md#the-evaluation-data

# Next Gen idea implementation plan

**Goal:** Recreate `docs/IDEA.md` for RevenueCat Shipaton 2026's Next Gen
Award: an app more ambitious than Guessling, chosen through ten new rounds of
ideation, with Jev at its core.

**Architecture:** Three new research notes, on the
[Next Gen Award](/docs/research/next-gen.md),
[new phone technology](/docs/research/next-gen-tech.md), and
[Jev patterns](/docs/research/jev-patterns.md), join the
[brief](/docs/BRIEF.md), the [context](/docs/CONTEXT.md), and the
[Jev notes](/docs/research/jev.md) as the inputs to ten rounds of ideation.
Each round is one task and one commit, logged in
`docs/research/next-gen-ideation.md`; round 5 adds an evidence note. The
Guessling idea moves to `docs/archive/guessling-idea.md`, and the documents
built on it point there and say they are superseded. The new `docs/IDEA.md`
is then written section by section, linking to the brief, the context, and
the log instead of repeating them.

**Tech Stack:** Markdown (GFM), Prettier 3 run by husky and lint-staged,
commitlint with Conventional Commits, the `gh` CLI, Python 3 for the local
checks, and subagents for the rounds that need independent views.

**Spec:** No separate spec file. The user's goal directive and the
[design](#design) below are the spec. The directive's feedback, verbatim: "The
idea is too simple and our team is aiming for Next Gen category."

Contents:

1.  [Global constraints](#global-constraints)
1.  [Skills](#skills)
1.  [Design](#design)
1.  [Verification gate](#verification-gate)
1.  [Tasks](#tasks)

## Global constraints

- Follow [the Markdown style guide](/docs/references/markdown-style.md), with a
  `Contents:` list in lazy numbering (`1.  [Heading](#anchor)`) instead of a
  `[TOC]` directive, as in the brief and the context.
- One H1; ATX headings with unique names and blank lines around them; prose
  wrapped at 80 characters (links, tables, headings, and code blocks are
  exempt); no trailing whitespace; `- ` bullets; a language on every fenced
  code block. Never start a wrapped line with a number and a period, which
  Prettier reads as a list item.
- Repo links use root paths such as `/docs/BRIEF.md`. Long or repeated links
  become reference links, defined before the next heading after first use, or
  at the end of the document when used in several sections.
- Facts come from the brief, the context, and the notes in `docs/research/`.
  Jev is described only as the Jev notes and the Jev pattern notes describe
  it. New facts found during ideation, such as rival apps, go into a research
  note with a source for each.
- Don't repeat the brief or the context. `docs/IDEA.md` links to their
  sections for rules, dates, the submission checklist, judging, and prizes,
  and says only what they mean for this app.
- Absolute dates only. Anything that changes, such as prices, versions, and
  counts, is dated as of September 22, 2026.
- Every choice the goal directive left open is an assumption, stated in the
  log and in `docs/IDEA.md`.
- Use they/them for any person whose pronouns aren't stated.
- Conventional Commits: lowercase subject, header of at most 100 characters,
  body lines of at most 100 characters, no attribution lines.
- Stage explicit paths only. Never stage `skills-lock.json`, `.agents/`, or
  `.claude/`.

## Skills

The goal names `/ask-matt`, which routes an idea to `/grill-with-docs`, an
interview. The directive rules out pausing for answers, so the ten rounds
stand in for the interview: subagents generate, score, and attack the ideas,
and every choice the user would have made becomes a stated assumption. The
other steps map to skills as follows:

- **`/research`:** background agents that read primary sources and each
  write one cited note in `docs/research/`.
- **`/grilling`:** the stance of the red team in round 6, which asks the
  questions a judge would.
- **`/pr`:** the pull request body.
- **`/code-review`:** each review round, on its Standards and Spec axes,
  with this plan as the spec.

## Design

`docs/IDEA.md` serves the team, and the agents in this repo, from September
22 to September 30, 2026. It says what to build, for whom, why it matters,
what makes it ambitious, where Jev fits, how the RevenueCat purchase works,
what to ship by when, how to pitch it, and what could go wrong.

### What changes for Next Gen

The [Next Gen notes](/docs/research/next-gen.md) change the problem the first
ideation solved:

- **No store release.** Entries submit a demo video under two minutes and a
  public open-source repository with a detectable license instead of a store
  listing, so App Review, its timing, and its rejections stop shaping the
  idea.
- **Four criteria.** The rules judge the idea, "meaningful progress toward a
  working app", the use of RevenueCat, and "thoughtful technical choices,
  product thinking, and care", with no weights; the idea breaks ties. The
  category video asks for "a fully realized app", with "a settings page"
  and "a paywall".
- **The purchase.** The RevenueCat SDK must still power a purchase, and the
  organizers accept a Test Store purchase for Next Gen.
- **Public backends.** A backend that is "essential" to the app must be
  available for judging, so its code joins the public repository; the Jev
  key doesn't.
- **Students.** Every team member is an active student; a minor needs a
  guardian's consent and may compete only for Next Gen.
- **Free accounts.** A free Apple account can't use In-App Purchase, push
  notifications, Sign in with Apple, iCloud, or Game Center, and its builds
  expire after 7 days.

### Sections of the idea

1.  **At a glance**: name, logline, platform, category, Jev's role, the
    purchase, and the key dates, on one screen.
1.  **Problem and audience**: who has the problem, what it costs them, why it
    matters, and the evidence.
1.  **What the app does**: the core loop, the screens, the "aha" moment, and
    what the first version leaves out.
1.  **How it works**: the system behind the loop, from input to decision to
    action, and what makes it more than a single model call.
1.  **How Jev fits**: the decisions Jev makes, the requests, the thresholds,
    the fallback when Jev is unavailable, the data that leaves the device,
    and TypeSafe's terms.
1.  **Monetization**: the RevenueCat purchase, its paywall moment, the
    price, and how the video shows it without a store listing.
1.  **Categories to enter**: Next Gen, mapped to what its judges ask for, and
    the categories left out, with the reason.
1.  **Build plan**: stack, scope, the open-source repository, the evaluation
    harness, and a day-by-day schedule to September 30.
1.  **Pitch**: the two-minute video beats, the description, and the
    repository's front page.
1.  **Risks**: the top risks, each with a mitigation and a trigger.
1.  **How the idea was chosen**: one line per round, linking to the log.
1.  **Assumptions and open questions**: what was assumed, and open items with
    safe defaults.
1.  **See also**: the brief, the context, the log, and the research notes.

### Ten rounds of ideation

The funnel is the first ideation's, from wide to narrow, with Next Gen's
questions in place of the App Store's.

| Round | Question                                               | Method                                                                                                      | Output                           |
| ----- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- | -------------------------------- |
| 1     | What must any idea satisfy, and how are they compared? | Derive hard constraints and a weighted rubric from the brief, the context, the four notes, and the feedback | Constraints, assumptions, rubric |
| 2     | What could we build?                                   | Three subagents write ten ideas each through different lenses                                               | 30 candidates                    |
| 3     | Which ideas meet the constraints?                      | Screen each candidate, pass or fail, with the reason                                                        | Survivors                        |
| 4     | Which survivors are strongest?                         | Score each on the rubric, with Guessling as a control; an independent subagent scores blind; average        | Ranking; top five                |
| 5     | Is there evidence for the top five?                    | A research subagent checks rivals, student entries, evidence of need, and technical feasibility             | Evidence note; top three         |
| 6     | Why would each finalist lose?                          | A subagent plays a Next Gen judge, a developer advocate running the repository, and a Jev engineer          | Failure modes and fixes          |
| 7     | Which idea, and how can it be sharper?                 | Re-score after the fixes, pick the winner, and fold in the best parts of the runners-up                     | The chosen idea                  |
| 8     | How does the purchase work?                            | Design the entitlement, paywall moment, price, and how the video shows a purchase                           | Monetization design              |
| 9     | What ships by when?                                    | Cut to one core loop; pick the stack, the repository layout, and the evaluation harness; schedule           | Scope, stack, schedule           |
| 10    | Does the pitch hold?                                   | Write the logline, video beats, and description; re-score against Guessling; set triggers                   | Pitch test and final score       |

Round 2's three lenses:

- **A, students' own problems:** problems the team meets as students, in
  study, campus life, accessibility, safety, money, health, or careers,
  each solved by a system in which Jev makes the decisions.
- **B, new on the phone:** capabilities new or newly practical in 2026, such
  as on-device speech, vision, language models, sensors, and live
  multi-user state, paired with Jev.
- **C, Jev only:** systems that need many fast, calibrated decisions a
  minute, which a generative model would make too slowly or at too high a
  cost.

### Rubric

Each idea scores 1 to 5 on each criterion. The weighted total is the sum of
weight × score ÷ 5, out of 100. Seven criteria split the rules' four, weighted
toward the idea, which breaks ties; Jev centrality stands for the goal.

| Criterion            | Rules criterion | Weight | A 5 means                                                                                            |
| -------------------- | --------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| Idea and need        | 1, the idea     | 20     | A clear answer to a real, specific problem for a named group, with evidence                          |
| Originality          | 1, the idea     | 10     | Few or no similar entries in the 2026 gallery, among student entries above all                       |
| Working app          | 2, progress     | 15     | A fully realized app, with its core loop, settings, and paywall, working on a device by September 28 |
| Demo-ability         | 2, progress     | 5      | The "aha" shows on a device within 15 seconds of the video                                           |
| RevenueCat fit       | 3, RevenueCat   | 15     | A purchase that belongs in the product, with a paywall and entitlement that make sense               |
| Technical ambition   | 4, technical    | 15     | A system of several parts, such as perception, decisions, and action, that few could ship            |
| Craft and repository | 4, technical    | 5      | A repository judges can read and run without the team's keys, with tests or evaluations              |
| Jev centrality       | The goal        | 15     | Jev makes the decisions the product depends on, at a speed or scale only it allows                   |

Guessling is scored in round 4 as a control. The chosen idea must beat its
total and score at least 2 points higher on technical ambition, or the round
says why not.

### Assumptions

Stated because the goal directive rules out asking:

- "Our team is aiming for Next Gen" means every member is an active student
  with an academic email, and the team enters Next Gen only. An adult member
  holds the TypeSafe, RevenueCat, and developer accounts, and any minor has a
  guardian's consent.
- The team is two to four students starting from no code for the new idea
  on September 22, 2026, with a Mac, at least one recent iPhone, and
  TypeScript; Swift is a plus, not a given.
- The team has no paid Apple Developer Program membership, the case Next Gen
  was made for, so the app uses only a free account's capabilities, builds
  locally, and shows its purchase through RevenueCat's Test Store.
- The team can get a Jev API key on September 22, 2026, and asks TypeSafe
  before naming Jev in public, as the Jev notes advise.
- "10-round ideation" means ten new rounds, each with its own question and
  decision, not a revision of the first log.
- "Include Jev" means Jev makes decisions the app depends on at run time,
  not only in the build tools.
- "Too simple" means the chosen idea needs a system of several parts that
  work together, with Jev as one of them, rather than one screen around one
  model call.

### The Guessling documents

`docs/PRODUCT.md`, `docs/PRD.md`, `docs/TRD.md`, and `docs/DESIGN.md`
describe Guessling and link to sections of the current `docs/IDEA.md`, as do
five research notes. Replacing the file in place would leave those links
pointing at the new idea's sections or at anchors that no longer exist. So:

- `git mv docs/IDEA.md docs/archive/guessling-idea.md`, with a note under
  its H1 that the Next Gen idea replaced it on September 22, 2026.
- Repoint every link to `/docs/IDEA.md` in the Guessling documents and the
  notes built for them to the archived file, keeping their anchors.
- Add a note under the H1 of each of the four Guessling documents that it
  describes the superseded idea. Their content stays as it is; rewriting
  them for the new idea is later work.
- The first ideation log, `docs/research/ideation.md`, stays where it is:
  its rounds record why Guessling was chosen.

### Rejected alternatives

- Rewriting the first ideation log in place: it would erase why Guessling
  was chosen and break the links into it.
- Leaving the Guessling documents untouched: their links would point at the
  wrong idea or at missing anchors.
- Rewriting the product, PRD, TRD, and design documents now: outside the
  goal, and premature before the idea is settled.
- Assuming a harder Guessling is the answer: round 4 scores Guessling as a
  control instead, so any evolution of it must win on the rubric.

## Verification gate

Every task runs this gate on each file it changes, after writing and before
committing. `CHECKS` is a directory holding the three scripts from the
[first idea plan's appendix][idea-appendix], unchanged, and `DOC` is the
changed file.

```shell
bunx prettier --write "$DOC" && bunx prettier --check "$DOC"
python3 "$CHECKS/check_md.py" . "$DOC" --contents
python3 "$CHECKS/fact_scan.py" . "$DOC" docs/sources docs/research
python3 "$CHECKS/check_links.py" "$DOC"
```

- `check_md.py` must print `OK`. It enforces the style rules above, checks
  that the `Contents:` list matches the H2 headings in order, and checks
  anchors, local link targets, and reference-link definitions.
- `fact_scan.py` lists figures found neither in `docs/sources/` nor in
  another research note. In `docs/IDEA.md`, fix every miss. In the log, the
  round's own outputs, such as weights and scores, are expected misses, and
  the commit body names them. For the research notes, the scan is
  informational.
- `check_links.py` lists external links that don't return HTTP 2xx. Devpost
  answers scripted requests with 403 and YouTube with 429, so open those by
  hand; any other failure is a broken link to fix.

Each task on `docs/IDEA.md` or the log also has its own assertions, run as a
failing test first:

```shell
check() { f=$1; shift; for p in "$@"; do grep -qE -- "$p" "$f" || echo "MISSING: $p"; done; }
```

[idea-appendix]: /docs/plans/0003-shipaton-2026-idea.md#appendix-check-scripts

## Tasks

Every subagent prompt carries the repo rule: run `graphify query
"<question>"` before grepping or reading repo files. Subagents write no repo
file unless their prompt names one, and never run git.

### Task 1: Research notes

**Files:**

- Create: `docs/research/next-gen.md`, `docs/research/next-gen-tech.md`, and
  `docs/research/jev-patterns.md`, each written by a background research
  agent from primary sources.

- [ ] **Step 1: Check the three notes**

Run the gate on each. Expected: prettier passes, `OK`, and every failing link
opened by hand.

- [ ] **Step 2: Commit each note on its own**

```shell
git add docs/research/next-gen.md
git commit -m "docs(research): add the Next Gen Award notes"
git add docs/research/next-gen-tech.md
git commit -m "docs(research): add notes on new phone technology"
git add docs/research/jev-patterns.md
git commit -m "docs(research): add notes on Jev's patterns"
```

### Task 2: This plan

- [ ] **Step 1: Run the gate, then commit**

```shell
git add docs/plans/0006-next-gen-idea.md
git commit -m "docs(plan): add the Next Gen idea plan"
```

### Task 3: Round 1, constraints and rubric

**Files:**

- Create: `docs/research/next-gen-ideation.md`

**Interfaces:**

- Produces: the H1 `# Next Gen ideation log`, the intro, the `Contents:`
  list, and `## Round 1: constraints and rubric`. Later rounds cite its hard
  constraints as N1, N2, and so on, and score against its rubric.

- [ ] **Step 1: Write the failing assertions**

```shell
touch docs/research/next-gen-ideation.md
check docs/research/next-gen-ideation.md '^# Next Gen ideation log$' \
  '^## Round 1: constraints and rubric$' '\*\*N1\.' 'Technical ambition' \
  'Assumptions' 'too simple'
```

Expected: six `MISSING:` lines.

- [ ] **Step 2: Write the section**

- Intro: why a second log exists (the feedback, verbatim), what it records,
  and a link to the first log.
- Hard constraints, numbered N1 onward, each with its source: Next Gen's
  submission (a video under two minutes, a public repository with a
  detectable license and setup instructions, a description, guardian
  consent for minors) for an iOS, iPadOS, macOS, or Android app; a
  RevenueCat purchase the video shows, through Test Store; Jev in the product
  at run time, called through a public backend that holds the key, and no
  key in the repository; working on a device by September 28 within a free
  Apple account's capabilities; no personal data from anyone under 18
  reaches Jev; more than one interaction around one call, per the feedback;
  nobody's words or images sent to Jev without their consent.
- Assumptions: those in the [design](#assumptions).
- The [rubric](#rubric), the Guessling control, and how totals are computed.
- Decision: round 3 screens with the constraints, and rounds 4, 7, and 10
  score with the rubric.

- [ ] **Step 3: Run the gate and the assertions**

Expected misses in the fact scan: the rubric weights.

- [ ] **Step 4: Commit**

```shell
git add docs/research/next-gen-ideation.md
git commit -m "docs(ideation): set the Next Gen constraints and rubric (round 1)"
```

### Task 4: Round 2, thirty candidates

- [ ] **Step 1: Dispatch three generator subagents in parallel**

Each gets round 1's constraints and rubric, the four notes, and one
[lens](#ten-rounds-of-ideation), and writes ten ideas: name; one-line pitch;
user; why it matters; the system, from input to Jev's decisions to action;
Jev's questions, with types, counts, and cadence; the RevenueCat purchase;
the video's first 15 seconds; and the riskiest assumption.

- [ ] **Step 2: Merge and deduplicate**

Append `## Round 2: thirty candidates`: the method, a table of every idea
(number, name, lens, pitch), the duplicates merged, and the decision.

- [ ] **Step 3: Gate, assertions (`^## Round 2`, a row numbered 30), commit**

```shell
git commit -m "docs(ideation): generate thirty Next Gen candidates (round 2)"
```

### Task 5: Round 3, screening

Append `## Round 3: screening`: a table of every candidate against N1 onward,
pass or fail, with the failing constraint named. Commit as
`docs(ideation): screen the candidates against the constraints (round 3)`.

### Task 6: Round 4, scoring

- [ ] **Step 1: Score the survivors and Guessling on the rubric**
- [ ] **Step 2: Dispatch a blind scorer**

It sees only the survivors, Guessling, and the rubric, not the first
scores. Average the two; record each scorer's scores and where they differ
by 2 or more.

- [ ] **Step 3: Append `## Round 4: scoring` and commit**

```shell
git commit -m "docs(ideation): score the survivors against Guessling (round 4)"
```

### Task 7: Round 5, evidence

- [ ] **Step 1: Dispatch a background research agent**

It writes `docs/research/next-gen-evidence.md` for the top five: rival apps
with their ratings and prices, 2026 gallery entries that overlap, student
entries above all, primary evidence that the problem matters, whether each
technical part exists on the devices the team has, and Jev's jagged edges
that would hit each idea.

- [ ] **Step 2: Gate the note, commit it, then append `## Round 5: evidence`**

Re-score only where evidence changes a score, and name the top three.

```shell
git commit -m "docs(research): gather evidence for the top five Next Gen ideas"
git commit -m "docs(ideation): weigh the evidence for the top five (round 5)"
```

### Task 8: Round 6, red team

Dispatch one subagent that plays three roles against each finalist: a Next
Gen judge who has two minutes of video, the description, and the repository;
a RevenueCat developer advocate who clones the repository and tries to run
it; and a TypeSafe engineer who knows Jev's jagged edges. It returns each
finalist's top failure modes, their severity, and a fix. Append
`## Round 6: red team` and commit as
`docs(ideation): red-team the finalists (round 6)`.

### Task 9: Round 7, the choice

Re-score the finalists with round 6's fixes, pick the winner, fold in the
best parts of the runners-up, name it, and check it against the Guessling
control. Append `## Round 7: the choice` and commit as
`docs(ideation): choose the Next Gen idea (round 7)`.

### Task 10: Round 8, monetization

Design the RevenueCat purchase from the Next Gen notes and the context's
[monetization section](/docs/CONTEXT.md#monetization-and-paywalls): the
entitlement, the paywall moment, the price, how the video shows a purchase
without a store listing, and what Jev's cost per user means for the price.
Append `## Round 8: monetization` and commit as
`docs(ideation): design the purchase (round 8)`.

### Task 11: Round 9, scope, stack, and schedule

Cut to one core loop with must, should, and won't lists; pick the stack; lay
out the repository, its license, and how judges run it without the team's
keys; define the evaluation harness for Jev's decisions; and schedule
September 22 to 30. Append `## Round 9: scope, stack, and schedule` and
commit as `docs(ideation): cut the scope and set the schedule (round 9)`.

### Task 12: Round 10, pitch test

Write the logline, the video's beats, and the description's outline;
re-score the idea and Guessling; set go and no-go triggers with dates.
Append `## Round 10: pitch test` and commit as
`docs(ideation): test the pitch (round 10)`.

### Task 13: Archive the Guessling idea

- [ ] **Step 1: Move the file and add the note**

```shell
mkdir -p docs/archive
git mv docs/IDEA.md docs/archive/guessling-idea.md
```

- [ ] **Step 2: Repoint the links and mark the Guessling documents**

Replace `/docs/IDEA.md` with `/docs/archive/guessling-idea.md` in the files
that link to it, except the brief, the context, and the plans, and add the
superseded note to the four Guessling documents.

- [ ] **Step 3: Gate every changed file, then commit**

```shell
git commit -m "docs: archive the Guessling idea and mark the documents built on it"
```

### Task 14: The new idea, in sections

Write `docs/IDEA.md` in five commits, each adding whole sections with their
`Contents:` entries so every commit leaves a consistent document:

1.  At a glance, and See also: `docs(idea): add the Next Gen idea at a glance`
1.  Problem and audience, What the app does, and How it works:
    `docs(idea): describe the problem, the app, and the system`
1.  How Jev fits: `docs(idea): explain how Jev fits`
1.  Monetization, Categories to enter, and Build plan:
    `docs(idea): add the purchase, the category, and the build plan`
1.  Pitch, Risks, How the idea was chosen, and Assumptions and open
    questions: `docs(idea): add the pitch, risks, and assumptions`

Each commit runs the gate and its section's assertions, and every figure in
`docs/IDEA.md` must trace to the brief, the context, or a research note.

### Task 15: Links from the brief and the context

Update the brief's and the context's "See also" entries so the idea's line
names the Next Gen idea and the Guessling documents' lines say they are
superseded. Commit as
`docs: point the brief and the context at the Next Gen idea`.

### Task 16: Graph, fact-check, and pull request

1.  Run `graphify update .` and commit `graphify-out/` as
    `chore(graphify): refresh the graph for the Next Gen idea`.
1.  Dispatch an independent fact-check subagent over `docs/IDEA.md` and the
    log, against the notes they cite; fix what it confirms.
1.  Push the branch and open the pull request with the `/pr` template.
1.  Run at most two `/code-review` rounds against this plan, post each as a
    PR comment, and fix what they confirm, one commit per fix.
1.  Rebase-merge the pull request and delete the branch, locally and on the
    remote.

# Guessling product, PRD, and TRD implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `docs/PRODUCT.md`, `docs/PRD.md`, and `docs/TRD.md`: what
Guessling is, what version 1.0 must do, and how it's built, from the
[brief](/docs/BRIEF.md), the [context](/docs/CONTEXT.md), and the
[idea](/docs/IDEA.md), so the team can build it and ship it by
September 30, 2026.

**Architecture:** Four new research notes fill the gaps the existing notes
leave: RevenueCat in an Expo app, the Cloudflare backend, Apple's rules for
this app, and the conventions of daily puzzle games. Each document then gets
its own tasks, and each task adds whole H2 sections with their `Contents:`
entries, so every commit leaves a consistent document. The product document
comes first because the PRD argues from its principles, and the PRD comes
before the TRD because the TRD traces every requirement ID.

**Tech Stack:** Markdown (GFM), Prettier 3 run by husky and lint-staged,
commitlint with Conventional Commits, the `gh` CLI, Python 3 with curl for the
local checks in the [appendix](#appendix-check-scripts), and subagents for
research, fact checking, and review.

**Spec:** No separate spec file. The user's goal directive and the
[design](#design) below are the spec.

Contents:

1.  [Global constraints](#global-constraints)
1.  [Design](#design)
1.  [Verification gate](#verification-gate)
1.  [Tasks](#tasks)
1.  [Appendix: check scripts](#appendix-check-scripts)

## Global constraints

- Follow [the Markdown style guide](/docs/references/markdown-style.md), with a
  `Contents:` list of the H2 headings in lazy numbering
  (`1.  [Heading](#anchor)`) instead of a `[TOC]` directive, as in the brief,
  the context, and the idea.
- One H1; ATX headings with unique names and blank lines around them; prose
  wrapped at 80 characters (links, tables, headings, and code blocks are
  exempt); no trailing whitespace; `- ` bullets; a language on every fenced
  code block. Never start a wrapped line with a number and a period, which
  Prettier reads as a list item.
- Repo links use root paths such as `/docs/IDEA.md`. Long or repeated links
  become reference links, defined before the next heading after first use, or
  at the end of the document when several sections use them.
- Each fact lives in one document, and the others link to it. The brief owns
  the contest's requirements, the context owns rules, benchmarks, and store
  review, and the idea owns why Guessling was chosen, the categories, the
  schedule, the risks, and the pitch. The new documents link to those
  sections and say only what they mean for the product, its requirements, or
  its build.
- The new documents agree with the idea: prices, dates, the first version's
  Must, Should, and Won't lists, the 0.3 and 0.7 answer thresholds, Jev
  pinned to `jev-1.13.0`, and the Worker, KV, and Durable Object design. A
  decision here that refines the idea says so and links to the idea.
- Facts come from the brief, the context, the idea, and the notes in
  `docs/research/`; new facts go into a research note with a source for each.
  Design values the documents set, such as limits, targets, and timeouts, are
  decisions: the documents state them as such, and each commit body names
  them as expected fact-scan misses.
- Versions, prices, and limits are dated as of September 22, 2026. Absolute
  dates only.
- Every requirement in the PRD has an ID, a priority, and a check, and the
  TRD traces every ID; see
  [Requirement format and IDs](#requirement-format-and-ids).
- Every choice the goal directive left open is an assumption, stated in the
  document that depends on it.
- Use they/them for any person whose pronouns aren't stated.
- Conventional Commits: lowercase subject, header of at most 100 characters,
  body lines of at most 100 characters, no attribution lines.
- Stage explicit paths only. Never stage `skills-lock.json`, `.agents/`, or
  `.claude/`; they hold unrelated local changes.

## Design

The three documents serve the team, and the coding agents in this repo, from
September 22 to at least October 22, 2026, when the idea's schedule stops
promising a new puzzle each day.

### What each document is for

- **`docs/PRODUCT.md`** says what Guessling is and why: its players, its
  principles, the experience, the character, the puzzles, the business
  model, how success is measured, and where it goes after version 1.0. It
  changes rarely, and it's where a new teammate starts.
- **`docs/PRD.md`** says what version 1.0 must do, as numbered requirements
  with priorities and checks: the flows, content, quality bars, analytics,
  store listing, and release criteria. It is what the team tests against.
- **`docs/TRD.md`** says how version 1.0 is built to meet the PRD: the
  architecture, versions, data, API, the answer pipeline, purchases, the
  app, security and privacy, reliability, tests, and release. It is what the
  team codes against.

### What goes where

| Question                                                                 | Answered in            |
| ------------------------------------------------------------------------ | ---------------------- |
| What does the contest require, and when?                                 | Brief                  |
| What do the rules, benchmarks, and store reviews add?                    | Context                |
| Why Guessling, which categories, what schedule, which risks, what pitch? | Idea                   |
| What is Guessling, for whom, on what principles, and where is it going?  | Product                |
| What must version 1.0 do, and how do we check it?                        | PRD                    |
| How is version 1.0 built?                                                | TRD                    |
| What do the vendors' docs say?                                           | Notes in docs/research |

### Sections of the product document

1.  **Guessling in brief**: what it is, for whom, how it earns, where it
    runs, who answers, and its status.
1.  **Vision**: the one-sentence aim and what it means in practice.
1.  **Players**: three player profiles, each with the job Guessling does for
    them, marked as synthesis from the idea's evidence.
1.  **Positioning**: the positioning statement and the alternatives players
    have, each with an honest difference.
1.  **Product principles**: the rules that settle trade-offs, each with the
    consequence the PRD turns into requirements.
1.  **The experience**: the daily loop and its key moments.
1.  **The Guessling character**: its role, reactions, personality, voice,
    and art direction.
1.  **Puzzles**: what a puzzle is made of, the launch categories, the
    quality bar, the daily rhythm, and corrections.
1.  **Business model**: free against Guessling+, prices, the paywall
    moments, and what the product never sells.
1.  **Success metrics**: the north star, supporting and guardrail metrics,
    each with a definition and a source.
1.  **Roadmap**: version 1.0, updates through October 22, and later
    candidates, each with the signal that would justify it.
1.  **What Guessling is not**: the non-goals.
1.  **See also**.

### Sections of the PRD

1.  **Overview**: purpose, scope, status, and how to read the requirements.
1.  **Goals and non-goals**: what version 1.0 must achieve, with measures,
    and what it leaves out.
1.  **Player scenarios**: short stories the requirements must satisfy,
    including a player who declines the AI notice, one who is offline, and
    a judge with an offer code.
1.  **Functional requirements**: one H3 per area: the AI notice, today's
    puzzle, asking, guessing, the end of a round, sharing, the streak, the
    archive, the paywall and purchases, reporting an answer, settings, and
    offline and busy states.
1.  **Puzzle content requirements**: counts, categories, checks, and the
    daily supply.
1.  **Non-functional requirements**: one H3 each for performance,
    availability, privacy, security, accessibility, and compatibility.
1.  **Analytics requirements**: what must be counted, and where, to report
    the idea's numbers.
1.  **App Store listing and review**: metadata, screenshots, age rating,
    privacy label, and review notes.
1.  **Release criteria**: what must be true before submission, before
    release, and before the Devpost deadline.
1.  **Dependencies and assumptions**.
1.  **Open questions**: new ones only, each with a safe default; the idea's
    list is linked.
1.  **See also**.

### Requirement format and IDs

Each requirement is one bullet: an ID made of an area prefix and a number, a
priority, one statement, and a check a tester can run.

```markdown
- **ASK-1, Must.** The player types a question in their own words, up to
  140 characters, and sends it. Check: a 141st character can't be typed.
```

- Area prefixes: `NOTICE`, `TODAY`, `ASK`, `GUESS`, `END`, `SHARE`,
  `STREAK`, `ARCHIVE`, `PAY`, `REPORT`, `SET`, `STATE`, `CONTENT`, `PERF`,
  `AVAIL`, `PRIV`, `SEC`, `A11Y`, `COMPAT`, `METRIC`, `STORE`, and
  `RELEASE`.
- Priorities: Must means version 1.0 doesn't ship without it; Should means
  version 1.0 or the first update. The idea's Won't list becomes the PRD's
  non-goals, with no IDs.
- Numbers are never reused. A dropped requirement stays, struck through,
  with the reason.
- The TRD cites IDs where it meets them, and its last content section maps
  every ID to the TRD sections that meet it. `check_ids.py` in the
  [appendix](#appendix-check-scripts) enforces both.

### Sections of the TRD

1.  **Overview**: scope, the key technical decisions, and how the TRD
    relates to the PRD.
1.  **System architecture**: a context diagram, the components and what
    each owns, and the path of one question.
1.  **Stack and repository**: pinned versions and the code layout.
1.  **Data model**: KV keys and values, the Durable Object's tables, and
    what the device stores, as TypeScript types and SQL.
1.  **Worker API**: endpoints, headers, requests, responses, errors, and
    limits.
1.  **Answer pipeline**: the order of checks, the Jev requests, the
    thresholds, caching, deduplication, and fallbacks.
1.  **Puzzle days and content tooling**: dates and numbering, the schedule,
    the authoring and checking scripts, publishing, and fixes after a day
    ends.
1.  **Purchases and entitlements**: RevenueCat's configuration, the app's
    purchase flow, the server's entitlement check, and offer codes.
1.  **The iPhone app**: screens and navigation, state, device storage,
    networking, the notice, sharing, haptics and sound, and accessibility.
1.  **Security and privacy**: secrets, validation, abuse limits, the data
    inventory with retention, and what reaches TypeSafe and RevenueCat.
1.  **Reliability and observability**: failure modes and responses,
    timeouts and retries, logs, counters, and daily checks.
1.  **Testing**: unit, integration, contract, consistency, purchase, and
    device tests, and the review pre-flight.
1.  **Environments and release**: environments, configuration, builds,
    deploys, the App Store release, and rollback.
1.  **Requirements traceability**: every PRD ID mapped to the TRD sections
    that meet it.
1.  **Open technical questions**: each with a safe default.
1.  **See also**.

### Decisions the documents record

The goal directive rules out asking, so these are decided here, for the
reasons given, and each is stated as a decision in the document that owns it.
The four new notes supply the facts behind them.

1.  **Puzzle day.** Each player gets the puzzle for their device's local
    date, with a new one at local midnight, as NYT's daily games do. A round
    open at midnight can still be finished, for at least 24 hours, but
    counts toward the streak only if solved on its date, as in Wordle. The
    Worker accepts a date only while it's today somewhere on Earth, about 50
    hours.
2.  **Numbers.** Starters are #1 to #10, undated, so the archive holds the
    ten puzzles the idea promises on launch day; daily puzzle #11 is
    Thursday, September 24, 2026, the day of the first submission, so App
    Review plays a real daily puzzle.
3.  **Turns.** Twenty. A Yes, a No, and every guess use one; "Ask another
    way" and non-questions don't. "Is it a/an/the X?" naming an accepted
    name counts as a right guess, and in classic Twenty Questions the final
    guess counts as one of the twenty. The answer is revealed when the round
    ends.
4.  **Limits.** Questions up to 140 characters and guesses up to 60; at most
    40 answers that don't use a turn per player per puzzle; a burst limit
    per player through Cloudflare's rate-limiting binding, not per address,
    since mobile networks share addresses; and each puzzle's object caps its
    own Jev calls at 600 a minute, so the two or three live dates stay under
    TypeSafe's 1,200.
5.  **One player ID.** RevenueCat's anonymous app user ID identifies a
    player to the Worker, which stores only a salted hash of it. No second
    install ID.
6.  **Consent.** "Allow" covers sending questions to TypeSafe, keeping asked
    wordings without any ID to answer everyone alike and to improve puzzles
    (guideline 5.1.2(ii)), and counting plays (5.1.1(ii)). "Not now" plays
    on: picked bank questions, exact bank wordings, and answers already
    stored, with nothing sent to TypeSafe, no wording stored, and no count
    written. Guessling+ works on that path too, since paid features can't
    depend on consent.
7.  **Answer order.** Code rules, exact bank wordings, stored answers, Jev's
    match request, then Jev's live request, in sequence as the idea
    describes. Parallel requests would save one round trip for unmatched
    questions but double the calls against the rate limit.
8.  **Fairness under load.** A fetch inside a Durable Object lets other
    requests run, so the object shares one pending Jev call per wording,
    inserts only if absent, and returns what storage holds; the Cloudflare
    note's local test split answers without this.
9.  **Match threshold.** `MATCH_MIN` starts at 0.6 on the matched option's
    probability. The consistency test on September 24 sets it: at least 90%
    of paraphrases reach the right entry, as the idea requires, and at most
    5% of non-bank questions match anything.
10. **Timeouts.** 1.5 seconds per Jev attempt and one retry, inside a
    3-second budget per question, then the busy state; the app gives up
    after 5 seconds. The SDK's defaults could hold a player for about 31.5
    seconds.
11. **Entitlements.** The Worker asks RevenueCat's API v2 for the player's
    active entitlements with a read-only v2 key (480 requests a minute),
    caches a yes for up to 15 minutes and a no for 1 minute, and skips the
    cache right after a purchase. API v1 would create a customer for every
    unknown ID.
12. **Judges' access.** A custom offer code for a free month with
    auto-renewal off, a small redemption limit, and all three eligibility
    groups, sent as a redemption URL with Restore Purchases as the fallback.
    One-time-use batches start at 500 codes, and RevenueCat calls Apple's
    in-app redemption sheet "extremely unstable".
13. **Service life.** The Paid Apps Agreement requires the full content for
    the whole subscription, so the Worker, the archive, and a daily puzzle
    run as long as any Guessling+ subscription does, not only through
    October 22. Stopping means removing Guessling+ from sale at least 31
    days ahead and keeping the archive up until the last subscription ends.
    The idea's schedule gets a line saying so.
14. **Share format.** Text, not an image: "Guessling #n" and turns out of 20
    or X, the hint, one symbol per turn, and the App Store link, after
    Wordle's and Strands's formats; archive results start with "Archive".
15. **Streak.** A Should: consecutive puzzle days solved on their date, as
    NYT and Apple count; a loss or a missed day resets it, archive rounds
    never count, and there's no freeze in version 1.0.
16. **Age rating.** The questionnaire's honest answers likely give 4+, so the
    puzzle rules keep weapons, alcohol, tobacco, drugs, horror, and medical
    topics out, and the policy pages open in Safari, not an in-app browser.
    The Terms of Use set no minimum age, which would force 18+.
17. **Privacy label.** Other User Content and Gameplay Content, Customer
    Support, User ID, Purchase History, and Product Interaction; none used
    for tracking. The idea's checklist names only the first and Purchases,
    so it gets a line pointing to the PRD.
18. **Where it runs.** iPhone only, iOS 16.4 or later (Expo SDK 57's floor),
    portrait; tested on an iPad simulator, since iPhone apps still run on
    iPad; Mac and Apple Vision Pro availability off.
19. **Storefronts.** The United States and other storefronts, except China
    mainland and Vietnam, which need game licenses, and the EU until the
    team completes trader verification, which publishes its contact
    details.
20. **Stack pins.** Expo SDK 57 with React Native 0.86.3, the EAS image
    `macos-tahoe-26.5-xcode-26.6`, `react-native-purchases` and `-ui`
    10.10.1, Wrangler 4.136.1, `@typesafe-ai/sdk` 0.6.0 with every option in
    code, and `@cloudflare/vitest-plugin` 1.2.1 with Vitest 4.1. No
    `expo-updates` in version 1.0, which would add Crash Data to the label.
21. **Hosting.** Workers Paid at $5 a month, a custom domain for the API,
    since the URL ships in the app, with the privacy policy and terms as
    static assets of the same Worker; each puzzle's Durable Object created
    with `locationHint: "wnam"`, near TypeSafe in AWS us-west-2.
22. **Counts.** Workers Analytics Engine, one data point per event, with the
    hashed player ID as the index; RevenueCat's Paywall Conversion chart for
    paywall views, trial starts, and conversions. No analytics SDK.
23. **Kill switch.** A config flag turns live Jev answers off without an app
    update, leaving code, bank, and stored answers.
24. **Code layout.** The app, the Worker, the content, and the scripts live
    in this repository as Bun workspaces, since the repo already uses Bun.

### Assumptions

The idea's [assumptions](/docs/IDEA.md#assumptions-and-open-questions) hold,
plus:

- The code lives in this repository, starting on September 22, 2026.
- The team creates accounts with Cloudflare, Expo, and RevenueCat on
  September 22 if it has none, and buys a domain for the API.
- Nobody has interviewed players yet, so the product's player profiles are
  synthesis.
- Legal questions the notes leave to counsel, such as US state age-assurance
  laws and the export self-classification report, stay open questions with
  safe defaults, not requirements.

### Rejected alternatives

- **One combined document.** The goal asks for three, and each has a
  different reader and rate of change.
- **Requirements inside the idea.** The idea is the decision record; its
  reasoning shouldn't churn with every requirement.
- **A separate install ID.** RevenueCat's ID already exists, and a second ID
  is more data to declare.
- **Limits per network address.** Cloudflare advises against them, since
  "many users may share a single IP, especially on mobile networks".
- **Parallel Jev requests.** See decision 7.
- **An image share card.** Text shares everywhere, needs no photo-library
  key, and costs no rendering work; an image can follow.
- **A third-party analytics SDK.** It adds label entries and possibly a
  tracking prompt, and the server can count what the write-up needs.

## Verification gate

Every task runs this gate on each file it changes, after writing and before
committing. `CHECKS` is a directory holding the scripts from the
[appendix](#appendix-check-scripts) and a `corpus-top` directory with copies
of the brief, the context, and the idea; `DOC` is the changed file.

```shell
bunx prettier --write "$DOC" && bunx prettier --check "$DOC"
python3 "$CHECKS/check_md.py" . "$DOC" --contents
python3 "$CHECKS/fact_scan.py" . "$DOC" docs/sources docs/research "$CHECKS/corpus-top"
python3 "$CHECKS/check_links.py" "$DOC"
```

Once both the PRD and the TRD exist, every task also runs:

```shell
python3 "$CHECKS/check_ids.py" docs/PRD.md docs/TRD.md
```

- Prettier runs first because lint-staged rewrites staged files on commit;
  the checks must see the committed form.
- `check_md.py` must print `OK`. It enforces the style rules, checks that
  the `Contents:` list matches the H2 headings in order, and checks anchors,
  local link targets, and reference-link definitions.
- `fact_scan.py` lists figures found neither in `docs/sources/`, nor in the
  research notes, nor in the brief, the context, or the idea. The new
  documents never count as evidence for each other. Every miss is either
  fixed or a design value the document states as a decision, and the commit
  body names those.
- `check_links.py` lists external links that don't return HTTP 2xx. Open
  failures by hand before calling them broken.
- Until the TRD's traceability section exists, `check_ids.py` reports every
  PRD ID as untraced; that's expected before Task 19.

Each task also has its own assertions, run first as a failing test:

```shell
check() { f=$1; shift; for p in "$@"; do grep -qE -- "$p" "$f" 2>/dev/null || echo "MISSING: $p"; done; }
```

## Tasks

The inputs are the brief, the context, the idea, and the notes in
`docs/research/`. Every subagent prompt carries the repo rule: run
`graphify query "<question>"` before grepping or reading repo files.
Subagents write no repo file unless their prompt names one, and never run
git.

### Task 1: Research notes and this plan

**Files:**

- Create: `docs/research/revenuecat-expo.md`,
  `docs/research/cloudflare-workers.md`,
  `docs/research/apple-requirements.md`, and
  `docs/research/daily-puzzles.md`, written by four background research
  agents from primary sources.
- Create: this plan.

- [ ] **Step 1: Check each note and the plan**

Run the gate on each. Expected: prettier passes, `OK`, and every failing
link opened by hand. The notes cite web sources, so their fact scan is
informational.

- [ ] **Step 2: Commit each note on its own, then the plan**

```shell
git add docs/research/revenuecat-expo.md
git commit -m "docs(research): add notes on RevenueCat in an Expo app"
git add docs/research/cloudflare-workers.md
git commit -m "docs(research): add notes on the Cloudflare Workers backend"
git add docs/research/apple-requirements.md
git commit -m "docs(research): add notes on Apple's requirements for Guessling"
git add docs/research/daily-puzzles.md
git commit -m "docs(research): add notes on daily puzzle conventions"
git add docs/superpowers/plans/2026-09-22-guessling-product-prd-trd.md
git commit -m "docs(plan): plan the product, PRD, and TRD documents"
```

### Task 2: Product frame, in brief, vision, and players

**Files:**

- Create: `docs/PRODUCT.md`

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/PRODUCT.md '^# Guessling product$' '^Contents:$' '^## Guessling in brief$' \
  '^## Vision$' '^## Players$' '^## See also$' '\$19\.99' '3-day free trial' '\$2\.99' \
  '/docs/IDEA\.md' '/docs/PRD\.md' '/docs/TRD\.md'
```

Expected: every pattern MISSING.

- [ ] **Step 2: Write the sections**

The H1 and a short introduction that says what the document is and links to
the idea, the PRD, and the TRD; the `Contents:` list; then the sections from
[Sections of the product document](#sections-of-the-product-document),
using the idea's facts and linking to its evidence instead of repeating it.
The player profiles are marked as synthesis.

- [ ] **Step 3: Run the gate and the assertions**

Expected: prettier passes, `OK`, no MISSING, and fact-scan misses only for
named decisions.

- [ ] **Step 4: Commit**

```shell
git add docs/PRODUCT.md
git commit -m "docs(product): add Guessling in brief, vision, and players"
```

### Task 3: Positioning and product principles

**Files:**

- Modify: `docs/PRODUCT.md`

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/PRODUCT.md '^## Positioning$' '^## Product principles$' 'Das Verhör' 'Akinator' \
  'Same puzzle, same answers'
```

- [ ] **Step 2: Write the sections**

The positioning statement, then the alternatives from the idea's evidence
with an honest difference for each; no claim that a rival lacks something
its own page shows. Then the principles, each with its consequence.

- [ ] **Step 3: Run the gate and the assertions**, then commit:

```shell
git add docs/PRODUCT.md
git commit -m "docs(product): add positioning and product principles"
```

### Task 4: The experience and the Guessling character

**Files:**

- Modify: `docs/PRODUCT.md`

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/PRODUCT.md '^## The experience$' '^## The Guessling character$' 'nod' 'shrug' \
  'Ask another way'
```

- [ ] **Step 2: Write the sections**, then run the gate and the assertions,
      and commit:

```shell
git add docs/PRODUCT.md
git commit -m "docs(product): describe the experience and the Guessling character"
```

### Task 5: Puzzles and the business model

**Files:**

- Modify: `docs/PRODUCT.md`

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/PRODUCT.md '^## Puzzles$' '^## Business model$' 'animals' 'everyday objects' \
  'Guessling\+' 'offer codes'
```

- [ ] **Step 2: Write the sections**, then run the gate and the assertions,
      and commit:

```shell
git add docs/PRODUCT.md
git commit -m "docs(product): describe puzzles and the business model"
```

### Task 6: Success metrics, roadmap, and non-goals

**Files:**

- Modify: `docs/PRODUCT.md`

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/PRODUCT.md '^## Success metrics$' '^## Roadmap$' '^## What Guessling is not$' \
  'north star' 'October 22'
```

- [ ] **Step 2: Write the sections**, then run the gate and the assertions,
      and commit:

```shell
git add docs/PRODUCT.md
git commit -m "docs(product): add success metrics, roadmap, and non-goals"
```

### Task 7: PRD frame, overview, goals, and scenarios

**Files:**

- Create: `docs/PRD.md`

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/PRD.md '^# Guessling product requirements$' '^Contents:$' '^## Overview$' \
  '^## Goals and non-goals$' '^## Player scenarios$' '^## See also$' '/docs/PRODUCT\.md' \
  '/docs/TRD\.md'
```

- [ ] **Step 2: Write the sections**

The overview says how to read the requirements, per
[Requirement format and IDs](#requirement-format-and-ids). The non-goals are
the idea's Won't list.

- [ ] **Step 3: Run the gate and the assertions**, then commit:

```shell
git add docs/PRD.md
git commit -m "docs(prd): add overview, goals, and player scenarios"
```

### Task 8: Notice, today's puzzle, asking, and guessing

**Files:**

- Modify: `docs/PRD.md`

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/PRD.md '^## Functional requirements$' '\*\*NOTICE-1, Must\.\*\*' '\*\*TODAY-1, Must\.\*\*' \
  '\*\*ASK-1, Must\.\*\*' '\*\*GUESS-1, Must\.\*\*' '0\.7' '0\.3'
```

- [ ] **Step 2: Write the H2 and its first four H3 areas**, with the
      decisions under
      [Decisions the documents record](#decisions-the-documents-record).

- [ ] **Step 3: Run the gate and the assertions**, then commit:

```shell
git add docs/PRD.md
git commit -m "docs(prd): add notice, puzzle, asking, and guessing requirements"
```

### Task 9: Round end, sharing, streak, and archive

**Files:**

- Modify: `docs/PRD.md`

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/PRD.md '\*\*END-1, Must\.\*\*' '\*\*SHARE-1, Must\.\*\*' '\*\*STREAK-1, Should\.\*\*' \
  '\*\*ARCHIVE-1, Must\.\*\*'
```

- [ ] **Step 2: Write the four H3 areas**, then run the gate and the
      assertions, and commit:

```shell
git add docs/PRD.md
git commit -m "docs(prd): add round end, sharing, streak, and archive requirements"
```

### Task 10: Purchases, reports, settings, and states

**Files:**

- Modify: `docs/PRD.md`

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/PRD.md '\*\*PAY-1, Must\.\*\*' '\*\*REPORT-1, Must\.\*\*' '\*\*SET-1, Must\.\*\*' \
  '\*\*STATE-1, Must\.\*\*' 'Restore Purchases' '\$19\.99'
```

- [ ] **Step 2: Write the four H3 areas**, then run the gate and the
      assertions, and commit:

```shell
git add docs/PRD.md
git commit -m "docs(prd): add purchase, report, settings, and state requirements"
```

### Task 11: Content and non-functional requirements

**Files:**

- Modify: `docs/PRD.md`

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/PRD.md '^## Puzzle content requirements$' '^## Non-functional requirements$' \
  '\*\*CONTENT-1, Must\.\*\*' '\*\*PERF-1, Must\.\*\*' '\*\*PRIV-1, Must\.\*\*' \
  '\*\*SEC-1, Must\.\*\*' '\*\*A11Y-1, Must\.\*\*' '\*\*COMPAT-1, Must\.\*\*' '\b17\b'
```

- [ ] **Step 2: Write the sections**, then run the gate and the assertions,
      and commit:

```shell
git add docs/PRD.md
git commit -m "docs(prd): add content and non-functional requirements"
```

### Task 12: Analytics, store, release, dependencies, and open questions

**Files:**

- Modify: `docs/PRD.md`

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/PRD.md '^## Analytics requirements$' '^## App Store listing and review$' \
  '^## Release criteria$' '^## Dependencies and assumptions$' '^## Open questions$' \
  '\*\*METRIC-1, Must\.\*\*' '\*\*STORE-1, Must\.\*\*' '\*\*RELEASE-1, Must\.\*\*'
```

- [ ] **Step 2: Write the sections**, then run the gate and the assertions,
      and commit:

```shell
git add docs/PRD.md
git commit -m "docs(prd): add analytics, store, and release requirements"
```

### Task 13: TRD frame, overview, architecture, and stack

**Files:**

- Create: `docs/TRD.md`

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/TRD.md '^# Guessling technical requirements$' '^Contents:$' '^## Overview$' \
  '^## System architecture$' '^## Stack and repository$' '^## See also$' 'jev-1\.13\.0' \
  '@typesafe-ai/sdk' 'react-native-purchases'
```

- [ ] **Step 2: Write the sections**, with versions from the research notes,
      then run the gate and the assertions, and commit:

```shell
git add docs/TRD.md
git commit -m "docs(trd): add overview, architecture, and stack"
```

### Task 14: Data model and Worker API

**Files:**

- Modify: `docs/TRD.md`

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/TRD.md '^## Data model$' '^## Worker API$' 'POST /v1/' 'GET /v1/' 'CREATE TABLE'
```

- [ ] **Step 2: Write the sections**, then run the gate and the assertions,
      and commit:

```shell
git add docs/TRD.md
git commit -m "docs(trd): define the data model and the Worker API"
```

### Task 15: Answer pipeline

**Files:**

- Modify: `docs/TRD.md`

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/TRD.md '^## Answer pipeline$' '"type": "choice"' '"type": "noul"' '0\.7' '0\.3' \
  'none'
```

- [ ] **Step 2: Write the section**, then run the gate and the assertions,
      and commit:

```shell
git add docs/TRD.md
git commit -m "docs(trd): specify the answer pipeline"
```

### Task 16: Puzzle days, content tooling, and entitlements

**Files:**

- Modify: `docs/TRD.md`

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/TRD.md '^## Puzzle days and content tooling$' '^## Purchases and entitlements$' \
  'UTC' 'Guessling\+' 'offer code'
```

- [ ] **Step 2: Write the sections**, then run the gate and the assertions,
      and commit:

```shell
git add docs/TRD.md
git commit -m "docs(trd): specify puzzle days, content tooling, and entitlements"
```

### Task 17: The iPhone app

**Files:**

- Modify: `docs/TRD.md`

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/TRD.md '^## The iPhone app$' 'VoiceOver' 'Reduce Motion' 'supportsTablet'
```

- [ ] **Step 2: Write the section**, then run the gate and the assertions,
      and commit:

```shell
git add docs/TRD.md
git commit -m "docs(trd): specify the iPhone app"
```

### Task 18: Security, privacy, reliability, and observability

**Files:**

- Modify: `docs/TRD.md`

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/TRD.md '^## Security and privacy$' '^## Reliability and observability$' \
  'TYPESAFE_API_KEY' '429' '529'
```

- [ ] **Step 2: Write the sections**, then run the gate and the assertions,
      and commit:

```shell
git add docs/TRD.md
git commit -m "docs(trd): add security, privacy, and reliability"
```

### Task 19: Testing, release, traceability, and open questions

**Files:**

- Modify: `docs/TRD.md`

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/TRD.md '^## Testing$' '^## Environments and release$' \
  '^## Requirements traceability$' '^## Open technical questions$'
python3 "$CHECKS/check_ids.py" docs/PRD.md docs/TRD.md
```

Expected: MISSING lines, and `check_ids.py` reports every ID untraced.

- [ ] **Step 2: Write the sections**, then run the gate, the assertions,
      and `check_ids.py` (expected: `OK`), and commit:

```shell
git add docs/TRD.md
git commit -m "docs(trd): add testing, release, and traceability"
```

### Task 20: Pointers, whole-document checks, and graph refresh

**Files:**

- Modify: `docs/BRIEF.md`, `docs/CONTEXT.md`, and `docs/IDEA.md` (their
  `## See also` lists)
- Modify: `docs/IDEA.md` (one line in its schedule and one in its
  review-safety checklist)
- Modify: `graphify-out/` (generated)

- [ ] **Step 1: Link the new documents**

Add to the brief's and the context's See also, after the idea's line, and
to the idea's See also, after the context's line:

```markdown
- [Product](/docs/PRODUCT.md): what Guessling is, for whom, and why, with
  its principles, metrics, and roadmap.
- [Product requirements](/docs/PRD.md): what version 1.0 must do, as
  numbered requirements with checks.
- [Technical requirements](/docs/TRD.md): how version 1.0 is built, traced
  to the product requirements.
```

Run `check_md.py` on the three (expected: `OK`), then commit:

```shell
git add docs/BRIEF.md docs/CONTEXT.md docs/IDEA.md
git commit -m "docs: link the product, PRD, and TRD from the brief, context, and idea"
```

- [ ] **Step 2: Align the idea with the new notes**

In the idea's September 30 schedule entry, after "through at least October
22, the later of the dates given for the winners", add that the Worker, the
archive, and a daily puzzle keep running as long as any Guessling+
subscription does, linking the product's business model (decision 13). In
its review-safety checklist, replace the privacy label's two items with a
link to the PRD's label requirement (decision 17). Run the gate, then:

```shell
git add docs/IDEA.md
git commit -m "docs(idea): align service life and the privacy label with the PRD"
```

- [ ] **Step 3: Run the gate on every new file, and `check_ids.py`**

- [ ] **Step 4: Independent fact check**

Dispatch a fresh agent to check every claim in the three documents against
the brief, the context, the idea, and the research notes, and the three
documents against each other: prices, dates, thresholds, counts, limits,
versions, and requirement IDs. Fix confirmed problems and commit them as
`docs: correct facts against the notes`.

- [ ] **Step 5: Refresh the knowledge graph**

```shell
bun run graph
git add graphify-out
git commit -m "chore(graphify): refresh the graph"
```

Skip the commit if nothing changed.

### Task 21: Pull request, review, and merge

- [ ] **Step 1: Push and open the PR**

```shell
git push -u origin docs/product-prd-trd
gh pr create --base main --head docs/product-prd-trd \
  --title "docs: add the Guessling product, PRD, and TRD" --body-file "$CHECKS/pr-body-prd.md"
```

The body summarizes the three documents, the research notes, the plan, and
the checks run. No attribution lines.

- [ ] **Step 2: Review and resolve, at most two rounds**

Each round: a fresh reviewer checks the PR diff for accuracy against the
notes, the style guide, overlap with the brief, the context, and the idea,
consistency across the three documents, and whether every requirement is
testable and traced. Apply the valid findings as small commits, run the
gate, push, and post the round's summary as a PR comment. Stop after round
two and list any remaining nits in the PR.

- [ ] **Step 3: Merge and delete the branch**

```shell
gh pr merge --rebase --delete-branch
git checkout main && git pull --ff-only
```

## Appendix: check scripts

`fact_scan.py` and `check_links.py` are unchanged from the
[idea plan's appendix](/docs/superpowers/plans/2026-09-22-shipaton-2026-idea.md#appendix-check-scripts).
`check_md.py` changes in one place: it skips nested `Contents:` entries for
H3 headings, which the style guide's own `Contents:` list uses and the four
new notes follow, and still compares the top-level entries with the H2s.

```diff
--- check_md.py (idea plan)
+++ check_md.py (this plan)
@@ -94,6 +94,9 @@
     else:
         entries = []
         for j in range(start + 2, len(lines)):
+            # Nested entries for H3s may follow, indented by four spaces.
+            if re.match(r'^(?:    )+1\.  \[[^\]]+\]\(#[^)]+\)$', lines[j]):
+                continue
             m = re.match(r'^1\.  \[([^\]]+)\]\(#([^)]+)\)$', lines[j])
             if not m:
                 break
```

This plan adds `check_ids.py`:

```python
#!/usr/bin/env python3
"""Check requirement IDs across the PRD and the TRD.

Usage: check_ids.py <prd.md> <trd.md>
The PRD defines each requirement once, in a bullet that starts with
"- **AREA-n, Must.**" (or Should). Every defined ID must be cited in the
TRD's "Requirements traceability" section, and neither document may cite an
ID of a known area that the PRD doesn't define. Prints OK or one line per
problem; exit 1 on any.
"""
import re
import sys

prd_path, trd_path = sys.argv[1:3]
prd = open(prd_path, encoding='utf-8').read()
trd = open(trd_path, encoding='utf-8').read()
errs = []

defined = re.findall(r'^- \*\*([A-Z][A-Z0-9]*-\d+), (?:Must|Should)\.\*\*', prd, re.M)
for i in sorted({i for i in defined if defined.count(i) > 1}):
    errs.append(f'{prd_path}: {i} is defined more than once')
if not defined:
    errs.append(f'{prd_path}: no requirement bullets found')

# Only IDs whose area the PRD uses count, so "UTF-8" or "SHA-256" never do.
areas = sorted({i.rsplit('-', 1)[0] for i in defined}, key=len, reverse=True)
id_re = re.compile(r'\b(?:' + '|'.join(map(re.escape, areas)) + r')-\d+\b') if areas else None


def cited(text):
    return set(id_re.findall(text)) if id_re else set()


for path, text in ((prd_path, prd), (trd_path, trd)):
    for i in sorted(cited(text) - set(defined)):
        errs.append(f'{path}: cites {i}, which the PRD does not define')

m = re.search(r'^## Requirements traceability\n(.*?)(?=^## )', trd, re.M | re.S)
if not m:
    errs.append(f'{trd_path}: missing "## Requirements traceability" section')
else:
    for i in sorted(set(defined) - cited(m.group(1)), key=lambda s: (s.rsplit('-', 1)[0], int(s.rsplit('-', 1)[1]))):
        errs.append(f'{trd_path}: traceability omits {i}')

print('\n'.join(errs) if errs else f'OK ({len(defined)} requirements)')
sys.exit(1 if errs else 0)
```

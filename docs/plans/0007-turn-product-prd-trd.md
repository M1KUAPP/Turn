# Turn product, PRD, and TRD implementation plan

**Goal:** Recreate `docs/PRODUCT.md`, `docs/PRD.md`, and `docs/TRD.md` for
Turn, the Next Gen Award entry that replaced Guessling: what Turn is and why,
what its first version must do, and how it's built, from the
[brief](/docs/BRIEF.md), the [context](/docs/CONTEXT.md), and the
[idea](/docs/IDEA.md), so the team can build it, film it on September 28,
and submit it by September 30, 2026.

**Architecture:** Four new research notes fill what the existing notes leave
open for a build: AAC practice, Turn's iPhone build, its relay and services,
and how to evaluate reply ranking. The Guessling product, PRD, and TRD move to
`docs/archive/`, and the documents built on them point there, as the Guessling
idea did in PR #7. Each new document is then written section by section, so
every commit leaves a consistent document: the product first, because the PRD
argues from its principles, then the PRD, then the TRD, which traces every
requirement ID.

**Tech Stack:** Markdown (GFM), Prettier 3 run by husky and lint-staged,
commitlint with Conventional Commits, the `gh` CLI, Python 3 for the local
checks, and subagents for research, fact checking, and review.

**Spec:** No separate spec file. The user's goal directive and the
[design](#design) below are the spec. The directive, verbatim: "Recreate
docs/PRODUCT.md, docs/PRD.md, and docs/TRD.md based on @docs/BRIEF.md,
@docs/CONTEXT.md, and @docs/IDEA.md. Follow @docs/references/markdown-style.md
(use List instead of TOC) and this workflow: branch -> /research -> plan ->
implement -> create small and atomic commits -> push branch -> PR -> (code
review -> resolve loop, max 2) -> merge -> delete branch."

Contents:

1.  [Global constraints](#global-constraints)
1.  [Skills](#skills)
1.  [Design](#design)
1.  [Verification gate](#verification-gate)
1.  [Tasks](#tasks)

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
  the contest's requirements and dates, the context owns the rules,
  benchmarks, and pitch guidance, and the idea owns why Turn was chosen, the
  category, the schedule, the risks, and the pitch. The new documents link to
  those sections and say only what they mean for the product, its
  requirements, or its build.
- The new documents agree with the idea: speech free and Listen mode sold
  once for $24.99 under the entitlement `listen`; 20 free partner lines;
  a shortlist of 40 phrases and 42 questions in one request; one big button
  above 0.85 and up to six from 0.6; Jev pinned to `jev-1.13.0`; one
  Cloudflare Worker as the relay; Expo SDK 57.0.23 or later with
  `ios.enableSceneSupport`, Xcode 27, and debug builds under a free Apple
  account; and the idea's dates. A decision that refines the idea says so and
  links to it; one that changes a fact the idea states changes the idea in
  the same pull request.
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
- Every choice the goal directive left open is an assumption or a decision,
  stated in the document that depends on it.
- Use they/them for any person whose pronouns aren't stated.
- Conventional Commits: lowercase subject, header of at most 100 characters,
  body lines of at most 100 characters, no attribution lines.
- Stage explicit paths only. Never stage `skills-lock.json`, `.agents/`, or
  `.claude/`; they hold unrelated local changes.

## Skills

The goal names `/ask-matt`, which routes work to `/grill-with-docs`, an
interview. The directive rules out pausing for answers, so the
[decisions](#decisions-the-documents-record) and
[assumptions](#assumptions) below stand in for the interview, and each is
stated in the document that depends on it. The other steps map to skills:

- **`/research`:** four background agents that read primary sources and each
  write one cited note in `docs/research/`.
- **`/pr`:** the pull request body.
- **`/code-review`:** each review round, on its Standards and Spec axes, with
  this plan as the spec.

`/to-spec` and `/to-tickets` come after this pull request: the PRD and the TRD
are the spec that tickets for the build will cite.

## Design

The three documents serve the team, and the coding agents in this repo, from
September 22 to October 22, 2026, when the winners are announced and the
idea's schedule stops promising a running relay.

### What each document is for

- **`docs/PRODUCT.md`** says what Turn is and why: the people it serves, its
  principles, the experience, the phrase bank, the business model, how
  success is measured, and where it goes after the first version. It changes
  rarely, and it's where a new teammate starts.
- **`docs/PRD.md`** says what the first version must do, as numbered
  requirements with priorities and checks: the flows, content, the
  evaluation, quality bars, measurement, the submission, and release
  criteria. It is what the team tests against.
- **`docs/TRD.md`** says how the first version is built to meet the PRD: the
  architecture, versions, data, the relay's API, the decision pipeline,
  listening and speaking on the phone, purchases, the app, security and
  privacy, reliability, the evaluation, tests, and release. It is what the
  team codes against.

### What goes where

| Question                                                           | Answered in            |
| ------------------------------------------------------------------ | ---------------------- |
| What does the contest require, and when?                           | Brief                  |
| What do the rules, benchmarks, and pitch guidance add?             | Context                |
| Why Turn, which category, what schedule, which risks, what pitch?  | Idea                   |
| What is Turn, for whom, on what principles, and where is it going? | Product                |
| What must the first version do, and how do we check it?            | PRD                    |
| How is the first version built?                                    | TRD                    |
| What do vendors, clinicians, and researchers say?                  | Notes in docs/research |

### Sections of the product document

1.  **Turn in brief**: what it is, for whom, how it earns, where it runs,
    what Jev decides, and its status.
1.  **Vision**: the one-sentence aim and the tests it sets.
1.  **Users and partners**: profiles of the people who speak with Turn, their
    partners, the people who set it up, and the clinicians who recommend it,
    marked as synthesis, and who Turn isn't built for.
1.  **Positioning**: the positioning statement and the alternatives, each
    with an honest difference.
1.  **Product principles**: the rules that settle trade-offs, each with the
    consequence the PRD turns into requirements.
1.  **The experience**: setup, speaking, listening, answering, and the key
    moments, from the user's side and the partner's.
1.  **The phrase bank**: what a phrase is, categories, places, the fixed
    buttons, the starter bank, and how the bank grows.
1.  **Business model**: free against Turn Listen, the price, the free lines,
    when the paywall appears, Test Store for Next Gen, and what the product
    never sells.
1.  **Success metrics**: the north star, supporting measures, and
    guardrails, each with a definition and where it's measured.
1.  **Roadmap**: the first version, the weeks through October 22, and later
    candidates, each with the signal that would justify it.
1.  **What Turn is not**: the non-goals.
1.  **See also**.

### Sections of the PRD

1.  **Overview**: what the first version is, its scope, how to read a
    requirement, and the words used.
1.  **Goals and non-goals**: what the first version must achieve, with
    measures, and what it leaves out.
1.  **User scenarios**: short stories the requirements must satisfy,
    including the "aha", a yes-or-no question, a partner who declines, a
    partner under 18, no network, a busy Jev, the paywall, and a judge in the
    Simulator.
1.  **Functional requirements**: one H3 per area: the speaking grid, the
    phrase bank, places, voices, permission and consent, listening, the reply
    row, offline and degraded states, the paywall and purchases, and
    Settings.
1.  **Content requirements**: the starter bank, the places, and the texts of
    the permission step, the consent card, and the privacy notice.
1.  **Evaluation requirements**: the 80 lines, the four rankers, the metrics,
    and how the thresholds are set.
1.  **Non-functional requirements**: one H3 each for performance,
    availability, privacy, security, accessibility, and compatibility.
1.  **Measurement requirements**: what is counted, where, and without which
    data.
1.  **Submission requirements**: the video, the public repository, the
    license, the README, the Simulator build, and the Devpost entry, linking
    the brief's checklist instead of repeating it.
1.  **Release criteria**: what must be true before the video, before the
    deadline, and through judging.
1.  **Dependencies and assumptions**.
1.  **Open questions**: new ones only, each with a safe default; the idea's
    list is linked.
1.  **See also**.

### Requirement format and IDs

Each requirement is one bullet: an ID made of an area prefix and a number, a
priority, one statement, and a check a tester can run.

```markdown
- **ROW-3, Must.** A phrase already shown keeps its slot while its
  probability stays at 0.6 or more. Check: replay two lines that both
  rank "It was hard" at 0.7; it stays in the same slot.
```

- Area prefixes: `SPEAK`, `BANK`, `PLACE`, `VOICE`, `CONSENT`, `LISTEN`,
  `ROW`, `STATE`, `PAY`, `SET`, `CONTENT`, `EVAL`, `PERF`, `AVAIL`, `PRIV`,
  `SEC`, `A11Y`, `COMPAT`, `METRIC`, `SUBMIT`, and `RELEASE`.
- Priorities: Must means the entry isn't submitted without it; Should means
  the first version or the weeks before October 22. The idea's Won't list
  becomes the PRD's non-goals, with no IDs.
- Numbers are never reused. A dropped requirement stays, struck through,
  with the reason.
- The TRD cites IDs where it meets them, and its traceability section maps
  every ID to the TRD sections that meet it. `check_ids.py`, in the
  [Guessling plan's appendix][ids-script] and unchanged, checks that every
  ID is in that table and that no document cites an undefined ID.

### Sections of the TRD

1.  **Overview**: scope, the decisions that shape the build, and how the TRD
    relates to the PRD.
1.  **System architecture**: a context diagram, what each part owns, and the
    path of one partner line.
1.  **Stack and repository**: pinned versions and the code layout.
1.  **Data model**: the phone's database, the relay's storage, and what is
    never stored, as TypeScript types and SQL.
1.  **Relay API**: endpoints, headers, requests, responses, errors, and
    limits.
1.  **Decision pipeline**: the end of a line, names as tags, the shortlist,
    the Jev request, from probabilities to the row, and timeouts, sequence
    numbers, and fallbacks.
1.  **Listening and speaking on the phone**: the two Swift modules, the audio
    session, and the fallbacks.
1.  **Purchases and entitlements**: RevenueCat's configuration, the app's
    purchase flow, the relay's entitlement check, and the yearly fallback.
1.  **The iPhone app**: screens and navigation, state and storage,
    networking, accessibility, and build configuration.
1.  **Security and privacy**: secrets, validation, abuse limits, and the data
    inventory with retention, including what reaches TypeSafe and
    RevenueCat.
1.  **Reliability and observability**: failure modes and responses, logs and
    counts, and service life.
1.  **Evaluation**: the data, the rankers, the metrics, the thresholds, and
    the report.
1.  **Testing**: unit, relay, contract, device, purchase, accessibility, and
    privacy tests.
1.  **Environments and release**: environments, configuration, builds,
    deploys, the Simulator build, and rollback.
1.  **Requirements traceability**: every PRD ID mapped to the TRD sections
    that meet it.
1.  **Open technical questions**: each with a safe default.
1.  **See also**.

### Decisions the documents record

The goal directive rules out asking, so these are decided here, for the
reasons given, and each is stated as a decision in the document that owns it.
The research notes supply the facts behind them.

1.  **The first version.** The Next Gen entry: debug builds on the team's
    iPhones for the video on September 28, a Simulator build in the
    repository's releases for judges, and the public repository, all by
    September 30. No store release, TestFlight, or App Review.
1.  **Where it runs.** iPhone, iOS 26 or later, the first release with
    `SpeechTranscriber`, in portrait and US English; the video on an iPhone
    15 Pro or later for Personal Voice. The Simulator build runs everything
    but live transcription.
1.  **A partner line.** One utterance by the partner. Apple's transcriber
    has no end-of-utterance event, so a line ends after a silence window,
    0.5 seconds to start, and the module forces the final text with
    `finalize(through: nil)`; Done ends it at once, and a typed line is one
    line per send. The replay test tunes the window between a slower row
    and a partner cut off mid-sentence. Lines longer than 300 characters
    keep their last 300.
1.  **Speed.** The row within 1.0 second of the end of the partner's speech
    at the median and 2.0 seconds at the 95th percentile, the evaluation
    notes' target, with the user's own choosing time measured apart; at
    most one line in ten cut off before the partner finishes.
1.  **The shortlist.** Forty candidates, chosen on the phone: the phrases
    already in the row, so each gets a new score, then up to 24 by BM25 over
    the line as heard, before tagging, up to 8 of the user's most-tapped replies
    of the last 30 days, and up to 8 of the place's phrases, without duplicates,
    filled by taps over the last 30 days. The fixed buttons and the strip never
    enter it. The category names travel with the shortlist, as the topic's
    options, so the permission step and the privacy notice name them too, and
    the app caps categories at the relay's 12.
1.  **Names as tags.** Each distinct name the phone's tagger finds in the
    line or the candidates becomes the same tag everywhere in the request,
    so matching still works and no name the tagger finds leaves the phone. A
    gazetteer of the names in the user's own phrases and places backs the
    tagger, which missed every name in lowercased text in the notes' test.
    This refines the idea, which tags names in the line only; the idea
    changes with it.
1.  **The row.** Six slots in two rows of three above the grid. One big
    button when the top phrase is above 0.85 and the line isn't a yes-or-no
    question; otherwise up to six phrases at 0.6 or more; below that, the row
    holds. For a yes-or-no question, Yes, No, and Not sure take the first
    three slots and phrases the other three, with no big button. A phrase
    keeps its slot while it stays at 0.6 or more, and a new phrase replaces
    the lowest one only by a margin of 0.15. The relay sends these values
    with each answer, with whether yes-or-no questions also get phrases and
    which topics get only the fixed buttons, so the evaluation can change
    them without an app build, as the idea's risk triggers need.
1.  **Pain and consent never get a big button.** The topic Choice keys its
    options by category id, plus a fixed `consent` option, and the list of
    topics that never get a big button starts as `body-pain` and `consent`,
    ids a rename can't change, since a wrong tap on a pain or consent
    question matters most; the body and pain category can't be deleted.
1.  **The conversation strip.** Five fixed phrases above the row, never
    ranked: a floorholder, a repair, a question back, an introduction to the
    app, and "Something's wrong", as the AAC notes recommend; repair takes
    one tap. The grid's Quick category keeps the fixed buttons.
1.  **Starter phrases.** They are the team's words until the user keeps
    them, so setup invites a review, and the editor marks unreviewed ones.
1.  **Small conveniences.** A few requirements follow from the row's rules
    and from the bank being the user's voice, not from the idea: Clear, a
    Must, since a row that holds when nothing fits needs a way to empty it;
    Repeat, since partners miss synthesized speech; Undo and Erase all data,
    since a mistaken delete loses the user's words; and stats that stay on
    the phone, since the product's north star is counted in rehearsals. All
    but Clear are Shoulds.
1.  **The phone's own ranking.** Offline, after a failure, with Jev off, or
    for a partner under 18, the phone ranks the heard or typed line itself,
    by the words it shares with each phrase, and the same slot rules apply.
    This refines the idea's fallback by place and typed letters, which stays
    for typing.
1.  **The topic.** Jev's topic marks its category's tab in the grid; it
    never scrolls or reorders the grid, whose order only the user changes.
1.  **Order and staleness.** Each line gets a sequence number; a device has
    one request in flight; a newer line cancels the older request; an answer
    for an older line is dropped.
1.  **Timeouts.** Three seconds from the phone to the relay and back; 2.5
    seconds for Jev in all, 1.5 seconds per attempt and at most one retry,
    ignoring server delays, since the SDK's defaults allow about 31.5
    seconds and a late answer is stale. On a failure the phone ranks that
    line itself, and after two failures in the last three lines, the app
    says Listen mode is degraded.
1.  **The Jev request.** The state holds only the tagged line and the place,
    and each candidate rides in its own Noul, as TypeSafe's Noul page does;
    this refines the idea, which puts the 40 candidates in the state. A line
    costs about 1,700 to 1,900 input tokens, not the idea's 1,500, so the
    idea's cost figures change with it.
1.  **Free lines.** Twenty per app user ID, claimed by line ID inside one
    SQLite Durable Object per ID, so the count is exact; a line ID already
    claimed gets `409` and no call to Jev; the claim is released if Jev
    fails, so a line counts only when Jev answers it; and the relay's
    configuration returns each user's free lines left and entitlement, so
    they survive a relaunch. The phone's own ranking and the grid never count.
1.  **Entitlement check.** Past the free lines, the relay asks RevenueCat's
    REST API v2 for the customer's active entitlements, caches a yes for 24
    hours, since the purchase is one-time, and a no for 1 minute, and skips
    a cached no on the first request after a purchase.
1.  **Identity.** A random UUID, kept in the Keychain with
    `expo-secure-store` and given to RevenueCat as the app user ID, is the
    only ID, so a reinstall usually keeps the purchase and the free-line
    count; RevenueCat's anonymous ID lives in UserDefaults and is lost. The
    relay keys storage and limits by a salted hash of it. App Attest and
    DeviceCheck need the paid program.
1.  **Abuse limits.** Per ID, 30 requests a minute through Cloudflare's rate
    limiting binding; request bodies and fields capped by length; a coarse
    limit per address as a backstop only; a daily budget of 10,000 Jev calls
    across all users, since anyone can mint IDs; and a switch in the relay's
    configuration that turns Jev off, leaving the phone's own ranking.
1.  **Consent.** The user's permission, asked the first time Listen mode
    turns on and withdrawn in Settings; the consent card each time Listen
    mode starts, closed by "They agreed" or "They said no"; the listening
    light, which pauses with one tap; and the under-18 switch, which stops
    listening and keeps typed lines on the phone. Whether the texts name
    TypeSafe comes from the relay's configuration, off until TypeSafe
    agrees.
1.  **What the user sees.** The last heard line shows as a caption above the
    row, held only in memory and cleared on pause, on stop, or after two
    minutes.
1.  **Audio and transcripts.** The microphone runs only while Listen mode is
    on and not paused. No audio or transcript is written to storage on the
    phone or in the relay, and the relay's logs carry no text.
1.  **Speech.** `expo-speech` speaks with the chosen voice, Personal Voice
    once authorized, whose identifier the Swift module finds. The app sets
    the audio session itself: `.playback` at launch, so speech plays in
    silent mode, and `.playAndRecord` with `.defaultToSpeaker` in Listen
    mode, with no voice processing, which would duck Turn's own voice. Input
    is muted while Turn speaks, so it never hears itself, and a tap on Stop
    ends speech.
1.  **Storage.** `expo-sqlite` holds the phrase bank, places, tap counts,
    and settings on the phone; only the 40 candidates leave it, per request.
1.  **Purchases.** A RevenueCat Paywall, presented when the relay says the
    free lines are used up and the entitlement is missing, or when Listen
    mode is turned on after that; one tap closes it. The Test Store product
    is one-time, at $24.99, granting `listen` in the offering `default`; if
    the dashboard's form has no one-time type, RevenueCat's API makes one.
    The idea's yearly fallback is dropped: a yearly Test Store product ends
    after five hours. Restore Purchases sits in Settings, though under Test
    Store it only refreshes the current user.
1.  **The Test Store key.** Committed in the app's configuration so judges
    can build from source, and rotated after the winners are announced:
    RevenueCat's blogs keep test keys out of version control, but every
    build a judge runs carries it anyway. No secret key is committed.
1.  **Debug builds only.** A Release build with a Test Store key crashes at
    launch, so the video's build and the judges' Simulator build use the
    Debug configuration, the Simulator build with its bundle embedded.
1.  **Judges' access.** The official rules require the entry to be free and
    unrestricted for judges until October 13. The Test Store purchase is
    free, and if it can't run in the Simulator, the Simulator build isn't
    held to the free lines.
1.  **Relay hosting.** A Cloudflare Worker on its `workers.dev` address and
    the Free plan, placed at `aws:us-west-2` next to TypeSafe, with its
    Durable Objects in western North America; the Jev key and a RevenueCat
    v2 secret key as Worker secrets. Workers Paid, at $5 a month, is the
    switch if requests near the Free plan's 100,000 a day.
1.  **Logs.** Workers Logs, one line per request: time, a short prefix of
    the ID's hash, the sequence number, the status, timings, and Jev's model
    and input tokens; never text. Automatic invocation logs and tracing stay
    off, since they would keep request details and the app user ID.
1.  **Evaluation.** `eval/` holds 80 lines written by hand, since the public
    sets' licenses don't allow copying, each with every acceptable reply or
    none, labeled by a second teammate. Jev's bars, margin, and question
    wording are frozen before the run, the embedding ranker's cut-off comes
    from cross-validation, and the keyword ranker holds when no word is
    shared, as the phone does. Ranking is scored only on lines with a reply,
    and "none" as its own decision, with coverage, risk, and 95% intervals;
    Jev "trails" embeddings only when a paired interval lies below zero,
    which refines the idea's trigger, and then Jev re-ranks the phrases
    nearest by Apple's sentence embeddings, which the phone would compute.
    The table goes in the README.
1.  **Accessibility.** Every control at least 44 by 44 points, reply slots
    taller, the reply area's height fixed so nothing shifts, Dynamic Type
    through the largest sizes by wrapping, phrase text as the accessibility
    name, so Voice Control can use it, other actions as named accessibility
    actions instead of long presses, no dragging, the strip and the row
    before the grid in focus order, and no time limits. React Native can't
    detect Switch Control or Voice Control, so the app works for them
    without detecting them, tested on an iPhone.
1.  **Service life.** The relay and Jev's credits run until the winners are
    announced on October 21 or 22, 2026. After that, Listen mode falls back
    to the phone's ranking and says so; speaking never depends on the relay.
1.  **Code layout.** Bun workspaces in this repository: `app/` for the Expo
    project, `modules/` for the two local Swift modules, `worker/`, and
    `eval/`, with an MIT `LICENSE` and the README at the root.
1.  **Measurement.** No analytics SDK. The relay's logs count lines, Jev's
    answers, fallbacks, and paywall responses; the evaluation measures
    ranking; RevenueCat's dashboard shows Test Store purchases as sandbox
    data.

### Assumptions

The idea's [assumptions](/docs/IDEA.md#assumptions-and-open-questions) hold,
plus:

- The code lives in this repository, which is private and has no license on
  September 22, 2026, and goes public before submission, unless TypeSafe
  hasn't agreed to be named by September 29, when a public copy of the code
  goes public instead, as the PRD's open questions say.
- The team creates Cloudflare and RevenueCat accounts on September 22 if it
  has none.
- Nobody has interviewed an AAC user or a partner yet, so the product's
  profiles are synthesis, and the clinic review stays a Should.
- Legal questions the notes leave to counsel stay open questions with safe
  defaults, not requirements.

### The Guessling documents

`docs/DESIGN.md`, the archived Guessling idea, and four design research
notes link to the Guessling product, PRD, and TRD. Replacing the files in
place would point those links at Turn's sections or at anchors that no longer
exist. So, as PR #7 did for the idea:

- `git mv` the three files to `docs/archive/guessling-product.md`,
  `docs/archive/guessling-prd.md`, and `docs/archive/guessling-trd.md`, and
  update the superseded note under each H1 to say it is archived and where
  Turn's version lives.
- Repoint every link to the three files, keeping anchors, in
  `docs/DESIGN.md`, the archived idea, the three archived files, and the
  notes `ios-design.md`, `game-design.md`, `frontend-trends.md`, and
  `motionsites.md`; update `docs/DESIGN.md`'s superseded note to match.
- Point the Guessling lines of the brief's, the context's, and the idea's See
  also lists at the archived files in the same commit, and add lines for
  Turn's documents once they exist.
- Plans stay as written: they record what each pull request did.
- `docs/DESIGN.md` stays in `docs/`, superseded, until Turn gets its own
  design document, which is later work.

### Rejected alternatives

- **Rewriting the files in place.** The design document and the design notes
  would link to Turn's sections or to missing anchors.
- **One combined document.** The goal asks for three, and each has a
  different reader and rate of change.
- **Rewriting the design document now.** Outside the goal.
- **An analytics SDK.** The relay can count what the entry needs without one,
  and an SDK would add data leaving the phone.
- **Accounts or a phrase bank on a server.** The idea's Won't list, and the
  bank is the user's voice: it stays on the phone.
- **Limits per address alone.** Mobile networks share addresses; they are a
  backstop only.
- **A generative fallback.** Apple's on-device model could write a reply when
  nothing fits, but Turn speaks only the user's own words.

## Verification gate

Every task runs this gate on each file it changes, after writing and before
committing. `CHECKS` is a directory holding `check_md.py`, `fact_scan.py`,
and `check_links.py` from the [first idea plan's appendix][idea-appendix],
`check_md.py` with the change in the [Guessling plan's
appendix][ids-script], and `check_ids.py` from that appendix; `DOC` is the
changed file.

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
- `check_md.py` must print `OK`. It enforces the style rules, checks that the
  `Contents:` list matches the H2 headings in order, and checks anchors,
  local link targets, and reference-link definitions. It misses undefined
  shortcut references such as `([label])`, so a script also lists every
  bracketed label without a definition.
- `fact_scan.py` lists figures found neither in `docs/sources/`, nor in the
  research notes, nor in `corpus-top`, which holds copies of the brief, the
  context, and the idea. The new documents never count as evidence for each
  other. Every miss is either fixed or a design value the document states as
  a decision, and the commit body names those.
- `check_links.py` lists external links that don't return HTTP 2xx. Open
  failures by hand before calling them broken.
- Until the TRD's traceability section exists, `check_ids.py` reports every
  PRD ID as untraced; that's expected before its task.
- Links from the new documents to each other may point forward in
  intermediate commits; the commit body says so.

Each task also has its own assertions, run first as a failing test:

```shell
check() { f=$1; shift; for p in "$@"; do grep -qE -- "$p" "$f" 2>/dev/null || echo "MISSING: $p"; done; }
```

[idea-appendix]: /docs/plans/0003-shipaton-2026-idea.md#appendix-check-scripts

## Tasks

The inputs are the brief, the context, the idea, and the notes in
`docs/research/`. Every subagent prompt carries the repo rule: run
`graphify query "<question>"` before grepping or reading repo files. No
subagent sends the user's email address or any personal identifier to an
API. Subagents write no repo file unless their prompt names one, and never
run git.

Each document is drafted whole in the scratchpad, checked, and then
committed in parts by an assembler that keeps only the named H2 sections,
rebuilds `Contents:`, and places each reference definition where
`check_md.py` expects it.

### Task 1: Research notes

**Files:**

- Create: `docs/research/aac-practice.md`, `docs/research/turn-ios.md`,
  `docs/research/turn-services.md`, and `docs/research/turn-evaluation.md`,
  each written by a background research agent from primary sources.

- [ ] **Step 1: Check each note**

Run the gate on each. Expected: prettier passes, `OK`, no undefined labels,
and every failing link opened by hand. The notes cite web sources, so their
fact scan is informational.

- [ ] **Step 2: Commit each note on its own**

```shell
git add docs/research/aac-practice.md
git commit -m "docs(research): add notes on AAC practice for Turn"
git add docs/research/turn-ios.md
git commit -m "docs(research): add notes on Turn's iPhone build"
git add docs/research/turn-services.md
git commit -m "docs(research): add notes on Turn's relay and services"
git add docs/research/turn-evaluation.md
git commit -m "docs(research): add notes on evaluating reply ranking"
```

### Task 2: This plan

- [ ] **Step 1: Run the gate, then commit**

```shell
git add docs/plans/0007-turn-product-prd-trd.md
git commit -m "docs(plan): add the Turn product, PRD, and TRD plan"
```

### Task 3: Archive the Guessling product, PRD, and TRD

- [ ] **Step 1: Move the files and update their notes**

```shell
git mv docs/PRODUCT.md docs/archive/guessling-product.md
git mv docs/PRD.md docs/archive/guessling-prd.md
git mv docs/TRD.md docs/archive/guessling-trd.md
```

- [ ] **Step 2: Repoint the links**

Replace `/docs/PRODUCT.md`, `/docs/PRD.md`, and `/docs/TRD.md` with their
archived paths in the files named under
[The Guessling documents](#the-guessling-documents), keeping anchors.
Expected afterwards: no file outside the plans links to the three old paths,
and `check_md.py` prints `OK` for every changed file.

- [ ] **Step 3: Commit**

```shell
git commit -m "docs: archive the Guessling product, PRD, and TRD"
```

### Task 4: The product document

Write `docs/PRODUCT.md` in three commits, each running the gate and its
assertions, such as the H1 `# Turn product`, the price `\$24\.99`, and links
to the idea, the PRD, and the TRD:

1.  Turn in brief, Vision, Users and partners, and See also:
    `docs(product): add Turn in brief, the vision, and the users`
1.  Positioning, Product principles, The experience, and The phrase bank:
    `docs(product): add positioning, principles, the experience, and the bank`
1.  Business model, Success metrics, Roadmap, and What Turn is not:
    `docs(product): add the business model, metrics, and roadmap`

### Task 5: The PRD

Write `docs/PRD.md` in five commits, each running the gate and its
assertions:

1.  Overview, Goals and non-goals, User scenarios, and See also:
    `docs(prd): add the overview, goals, and scenarios`
1.  The speaking grid, the phrase bank, places, and voices:
    `docs(prd): add requirements for speaking, the bank, places, and voices`
1.  Permission and consent, listening, and the reply row:
    `docs(prd): add requirements for consent, listening, and the reply row`
1.  Offline and degraded states, purchases, Settings, content, and the
    evaluation:
    `docs(prd): add states, purchases, settings, content, and evaluation`
1.  Non-functional, measurement, submission, release, dependencies, and open
    questions: `docs(prd): add quality bars, submission, and release criteria`

The functional requirements H2 arrives with its first H3s in the second
commit and grows in the next two.

### Task 6: The TRD

Write `docs/TRD.md` in five commits, each running the gate, its assertions,
and, from the last, `check_ids.py`:

1.  Overview, System architecture, Stack and repository, and See also:
    `docs(trd): add the overview, architecture, and stack`
1.  Data model and Relay API: `docs(trd): add the data model and the relay API`
1.  Decision pipeline, and Listening and speaking on the phone:
    `docs(trd): add the decision pipeline and the phone's audio`
1.  Purchases and entitlements, The iPhone app, and Security and privacy:
    `docs(trd): add purchases, the app, and security and privacy`
1.  Reliability and observability, Evaluation, Testing, Environments and
    release, Requirements traceability, and Open technical questions:
    `docs(trd): add reliability, evaluation, testing, release, and traceability`

### Task 7: Pointers and the idea

- [ ] **Step 1: Link the new documents**

Add lines for Turn's product, product requirements, and technical
requirements to the See also lists of the brief, the context, and the idea,
after the idea's line (the idea's own list: after the context's line), and
say in each Guessling line that the design document is the one Guessling
document still in `docs/`. Commit as
`docs: link Turn's product, PRD, and TRD from the brief, context, and idea`.

- [ ] **Step 2: Align the idea**

Change the idea where a decision or a new note changes a fact it states:
names tagged in the phrases as well as the line; the state without the
candidates; the tokens and cost per line; the phone's own ranking by the
line's words; the one-time product made through RevenueCat's API instead of
the yearly fallback; the Test Store key committed and rotated; and the
Debug-only builds. Commit as `docs(idea): align the idea with the new notes
and the TRD`.

### Task 8: Fact check, graph, and pull request

1.  Dispatch an independent fact-check subagent over the three documents,
    against the brief, the context, the idea, and the notes they cite, and
    against each other: prices, dates, thresholds, counts, limits, versions,
    and requirement IDs. Fix what it confirms, as
    `docs: correct facts against the notes`.
1.  Run `graphify update .` and commit `graphify-out/` as
    `chore(graphify): refresh the graph for Turn's product, PRD, and TRD`.
1.  Push the branch and open the pull request with the `/pr` template.
1.  Run at most two `/code-review` rounds against this plan, post each as a
    PR comment, and fix what they confirm, one commit per fix or group of
    related fixes, with a resolution comment per round.
1.  Rebase-merge the pull request and delete the branch, locally and on the
    remote.

[ids-script]: /docs/plans/0004-guessling-product-prd-trd.md#appendix-check-scripts

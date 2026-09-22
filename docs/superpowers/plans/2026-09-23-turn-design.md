# Turn design implementation plan

**Goal:** Recreate `docs/DESIGN.md` for Turn: how the AAC app looks, reads,
moves, and feels in the hand, from the speaking grid and the reply row to the
consent card, the paywall's styling, the icon, and the pitch assets, drawn
from research on trending frontend services such as motionsites.ai, so the
team can build the screens before filming on September 28, 2026, and a
coding agent can follow it.

**Architecture:** Four new research notes supply the evidence: motionsites.ai
and its prompt corpus seen through Turn's needs, the trending frontend
services and the DESIGN.md format, the interface design of AAC apps, and what
the iOS 27 SDK and Expo SDK 57 allow and require. The Guessling design moves
to `docs/archive/`, as the other Guessling documents did in PR #8. The new
`docs/DESIGN.md` follows Google's DESIGN.md format in the form the style
guide asks for, written section by section so every commit leaves a
consistent document; Google's linter and a contrast script check it, and
small edits keep the TRD and the other documents in step.

**Tech Stack:** Markdown (GFM), Prettier 3 run by husky and lint-staged,
commitlint with Conventional Commits, the `gh` CLI, `@google/design.md`
0.4.0, Python 3 for the local checks, and subagents for research,
fact checking, and review.

**Spec:** No separate spec file. The user's goal directive and the
[design](#design) below are the spec. The directive, verbatim but for a local
path: "/ask-matt Recreate docs/DESIGN.md based on research on trending
frontend services (eg. motionsites.ai — I have resources at \[a local
folder\]. Follow @docs/references/markdown-style.md (use List instead of TOC)
and this workflow: branch -> /research -> plan -> implement -> create small
and atomic commits -> push branch -> PR -> (code review -> resolve loop,
max 2) -> merge -> delete branch."

Contents:

1.  [Global constraints](#global-constraints)
1.  [Skills](#skills)
1.  [Design](#design)
1.  [Verification gate](#verification-gate)
1.  [Tasks](#tasks)
1.  [Appendix: check scripts](#appendix-check-scripts)

## Global constraints

- Follow [the Markdown style guide](/docs/references/markdown-style.md), with a
  `Contents:` list of the H2 headings in lazy numbering
  (`1.  [Heading](#anchor)`) instead of a `[TOC]` directive, as in the other
  documents.
- One H1; ATX headings with unique names and blank lines around them; prose
  wrapped at 80 characters (links, tables, headings, and code blocks are
  exempt); no trailing whitespace; `- ` bullets; a language on every fenced
  code block. Never start a wrapped line with a number and a period, which
  Prettier reads as a list item.
- Repo links use root paths such as `/docs/PRD.md`. Long or repeated links
  become reference links, defined before the next heading after first use, or
  at the end of the document when several sections use them.
- Each fact lives in one document, and the others link to it. The product
  owns the principles, the users, and the experience; the PRD owns the
  requirements and every string it fixes, such as the strip's five phrases,
  "Listening", "They agreed", and "They said no"; the TRD owns the build:
  routes, libraries, state, and configuration; the idea owns the schedule,
  the category, and the pitch. `docs/DESIGN.md` owns the look and feel:
  tokens, components, screen layouts, motion, haptics, the strings the PRD
  leaves open, and the specs of the icon and the pitch assets. It cites the
  PRD IDs each rule serves and links the TRD for how it's built.
- `docs/DESIGN.md` agrees with the PRD and the TRD: the routes (`/`,
  `/permission` as a sheet, `/consent` full screen, `/settings`, and
  `/bank/[category]`), RevenueCat's paywall over the current screen, a
  portrait iPhone app on iOS 26 or later built with the iOS 27 SDK, the
  row's fixed height and six fixed slots (ROW-1), controls of at least 44 by
  44 points and row buttons at least 64 points tall (A11Y-1), text at 4.5 to
  1 and button edges at 3 to 1 (A11Y-7), no state shown by color alone and a
  Reduce Motion version of every animation (A11Y-6), and no name for Jev or
  TypeSafe on screen until TypeSafe agrees (CONSENT-7, SUBMIT-6). Where the
  research shows the TRD's plan falls short of the design, the TRD changes in
  this branch, in its own commit.
- Every pair in the Colors section's contrast table passes
  `check_contrast.py` in all four appearances, and every other pair the
  document names reuses one of those pairs.
- Trend claims cite the research notes, and a trend the design rejects says
  why.
- Design values the document sets, such as colors, sizes, and durations, are
  decisions: the document states them as such, and each commit body names
  them as expected fact-scan misses.
- Versions are dated as of September 23, 2026. Absolute dates only.
- Use they/them for any person whose pronouns aren't stated.
- Conventional Commits: lowercase subject, header of at most 100 characters,
  body lines of at most 100 characters, no attribution lines.
- Stage explicit paths only. Never stage `skills-lock.json`, `.agents/`, or
  `.claude/`; they hold unrelated local changes.

## Skills

The goal names `/ask-matt`, which routes new work to `/grill-with-docs`, an
interview. The directive rules out pausing for answers, so the
[decisions](#decisions-the-document-records) and
[assumptions](#assumptions) below stand in for the interview, and each is
stated in the document. The other steps map to skills:

- **`/research`:** four background agents that read primary sources and each
  write one cited note in `docs/research/`.
- **`/pr`:** the pull request body.
- **`/code-review`:** each review round, on its Standards and Spec axes, with
  this plan as the spec.

The design skills installed from Taste Skill, such as `stitch-design-taste`,
write DESIGN.md files for landing pages, with asymmetric layouts and
perpetual micro-motion that an AAC app can't use; the trends note weighs
their rules, and the design takes only those that fit.

## Design

`docs/DESIGN.md` serves the team building Turn before filming on September
28, 2026, the coding agents in this repo, and anyone styling the paywall in
RevenueCat's editor or making the README images, the Devpost gallery, and the
video.

### What goes where

| Question                                                           | Answered in            |
| ------------------------------------------------------------------ | ---------------------- |
| Who is Turn for, and what principles settle its trade-offs?        | Product                |
| What must the first version do, including which strings are fixed? | PRD                    |
| How is it built: routes, libraries, state, and configuration?      | TRD                    |
| How does it look, read, and move, and what does each screen show?  | Design                 |
| Why Turn, which category, what schedule, and what video?           | Idea                   |
| What do the vendors', makers', and researchers' own pages say?     | Notes in docs/research |

### Sections of the design document

Google's specification fixes the order of its eight sections and allows
others between them; custom sections sit where a reader needs them.

1.  **Overview**: the name and description, the rules that don't bend, the
    one reference the look grows from, and the scope.
1.  **Influences and trends**: what the four notes found in motionsites.ai,
    the generators, the libraries, Apple's and Google's design languages, and
    AAC apps, and what Turn adopts, adapts, or rejects.
1.  **Colors**: the tokens in four appearances, the role of each, and the
    contrast of every pair.
1.  **Typography**: the face, the type tokens, and how each follows Dynamic
    Type and Bold Text.
1.  **Layout**: spacing and size tokens, the home screen's bands, widths,
    short screens, large text, and the keyboard.
1.  **Elevation**: depth by color and edges, and where Liquid Glass goes.
1.  **Shapes**: corner tokens and rules.
1.  **Components**: component tokens per appearance, and the phrase button,
    the row, the strip, the caption, the Listen control, the place picker,
    the category tabs, the grid, the bottom bar, the composer, notes, and
    lists.
1.  **Motion**: every animation, its Reduce Motion version, and the one flag
    that decides.
1.  **Sound and haptics**: speech as the only sound.
1.  **Screens**: the home screen in each state, typing, the permission step,
    the consent card, Settings, the phrase bank editor, the first launch, the
    paywall, and launch.
1.  **Words on screen**: tone, names, and every string the PRD leaves open.
1.  **Accessibility**: how the design meets A11Y-1 to A11Y-8, and the test
    plan.
1.  **App icon and pitch assets**: the icon, the launch screen, the Devpost
    images, the README's images, and the video's look.
1.  **Do's and don'ts**: a short, specific list.
1.  **Guidance for coding agents**: how to use the file, how code stays in
    step with it, and the checks before a screen ships.
1.  **Open questions**: each with a safe default.
1.  **See also**.

### Decisions the document records

The goal directive rules out asking, so these are decided here, for the
reasons given, and each is stated as a decision in the document.

1.  **Format.** Google's DESIGN.md format, alpha, with `@google/design.md`
    0.4.0 pinned, in this repo's style: an H1, an introduction, a `Contents:`
    list, and the specification's sections under its names, in its order.
    Tokens sit in fenced `yaml` blocks inside the sections they describe,
    each top-level key in one block. Every color holds four values, `light`,
    `dark`, `light-hc`, and `dark-hc`, which map one to one onto
    `DynamicColorIOS`; each text pair appears as one component per
    appearance, so the linter checks all four; `px` reads as points; type
    tokens take Apple's text style names; and motion stays in prose, as the
    format's maintainer advises. The linter's `missing-primary` warning is
    allowed, since it wants one flat `primary` color and Turn's colors each
    hold four.
1.  **Rules that don't bend.** The Overview opens with ten numbered, testable
    rules, before any token, since agents follow short, concrete rules best:
    nothing moves under a finger; phrase text at 7 to 1 or more; a word for
    every state; text that follows Dynamic Type; target sizes; nothing
    speaks without a tap or acts on touch-down; motion only in answer to
    someone; no glass behind phrases; the system's appearance; and plain
    words with no AI badges.
1.  **One reference.** "A whiteboard and four markers": what people who can't
    speak fall back on when a device fails, as an AAC user in the notes did
    with "a white board and marker". It gives the look: dark words on a light
    board that both people can read, four inks with fixed jobs, nothing on
    the board but what's being said, and it works without a network.
1.  **Palette.** Near-iOS neutrals: a light gray board, white phrase cards
    with a 3 to 1 edge, and near-black ink. Marker blue (`#1747B8`, 7.9 to 1
    under white) marks Turn's own actions and the big button; Yes, No, and
    Not sure are words on green, red, and gray tints with thick colored
    edges; and the light is the one orange thing, `#B84A00` under white at
    5.2 to 1, echoing iOS's microphone dot. Phrase text reaches 7 to 1 in all
    four appearances, other text 4.5 to 1, and edges 3 to 1. The app follows
    the system's appearance, with `userInterfaceStyle: 'automatic'`, and has
    no theme of its own; phrases and categories aren't color-coded.
1.  **Type.** The system face, SF Pro, only, never bundled, as two notes
    advise for an ordinary-looking, adult app. Ten tokens take Apple's text
    style names, so each follows that style's Dynamic Type curve through
    `dynamicTypeRamp`: phrases in `title3-emphasized`, the big button in
    `title1-emphasized`, the consent card's lead in
    `largeTitle-emphasized`, and so on. Each token names a Bold Text weight
    one step up, which a hook applies, since React Native's font code
    ignores the setting. Text is left-aligned, in sentence case, and never
    thin. Atkinson Hyperlegible Next, under the OFL, sets the video's
    titles and the images' captions, where Apple's license bars SF Pro.
1.  **The home screen.** Bands in the PRD's order, top to bottom: the top bar
    (Settings, the place picker, the Listen control), the caption (the
    partner's words in Listen mode and the user's last phrase outside it,
    with Done or Clear), the strip, the row, the category tabs, the grid, and
    the bottom bar (Type, Repeat or Stop, and Up and Down, which page the
    grid so it never needs a swipe). There's no navigation bar, and the strip
    and the row sit outside the grid's scroll view.
1.  **The row.** Six slots in two columns of three, each 78 points tall, at
    least 12 mm on every iPhone Turn runs on, with 12 points between them, so
    a slot holds about 14 characters a line. Heights follow the text size and
    the width, never the content. From AX1, one column; where the width fits
    three 154-point slots, as on an iPad, three. A phrase takes up to two
    lines at `title3-emphasized`, then two at `headline`'s size, and past
    that the slot ends with an ellipsis, while VoiceOver and speech give the
    whole phrase and the grid shows it whole.
1.  **The row's states.** Empty, with a quiet placeholder; up to six
    replies, filled from the first slot; one big button over the six slots'
    frame, in marker blue; Yes, No, and Not sure in slots 1 to 3; and a row
    that holds, with the caption saying which partner line it still answers.
    No percentages, no AI badge on a reply, and no dimming of an older
    phrase; a slot never changes while it's pressed.
1.  **The strip.** Five phrase buttons with their whole text, in three
    columns with the introduction spanning two, at least 48 points tall;
    "Something's wrong" adds a warning symbol. Short role labels were
    rejected, since A11Y-2 and A11Y-8 ask a phrase button to read, and be
    named, as its text.
1.  **The grid and the tabs.** Phrase buttons at least 78 points tall, whole
    text, in an even number of columns from the width, two on a phone and one
    from AX1. The tabs show the categories in their order, with an All
    button that lists every name at once, since older adults miss sideways
    scrolling; the tab ROW-9 marks takes a dot and a heavier weight, never
    color alone.
1.  **The light.** Listening shows as a solid orange pill with a microphone
    symbol and "Listening", whose symbol fades in and out only while the
    partner's words arrive, for at most five seconds a line, and holds still
    otherwise, and always under Reduce Motion. Paused is a neutral pill
    with a struck microphone and "Paused", with End beside it, and "Mic off"
    shows when there's no microphone to use. When a session starts, the
    caption says "Listening" in large type until the first words arrive.
1.  **Consent.** The consent card is full screen and solid: a lead sentence
    in the partner's terms, the four facts CONSENT-4 lists, one to a line,
    the under-18 switch, Read aloud, an addition to what CONSENT-4 lists,
    which speaks the card on the user's tap because talking beats a written
    notice, and "They agreed" and "They said no" as an equal pair. The
    permission step is a form sheet with its own background and "Allow" and
    "Not now" as an equal pair.
1.  **Glass.** None of Turn's own. System bars, sheets, alerts, and switches
    take Liquid Glass, which Xcode 27 no longer lets an app turn off; phrases,
    the caption, and the consent card are content and stay solid.
1.  **Motion.** A slot's new phrase cross-fades in place in 150 ms, the big
    button in 200 ms, and the light's symbol fades while words arrive;
    nothing else animates, and a press changes the fill, never the size.
    Reduce Motion, read live from `AccessibilityInfo` and its event, makes
    every change instant and stops the fade.
1.  **Sound and haptics.** Speech is Turn's only sound: no earcons, and no
    haptics, which iOS silences while Listen mode records and which would
    carry no meaning elsewhere.
1.  **Words.** Plain, calm, adult, in sentence case, with no exclamation
    marks, no "smart", "magic", or sparkles, "AI" only in the words
    CONSENT-1 fixes, and no pity. The caption labels speakers "They said"
    and "You said". Jev and TypeSafe go unnamed until TypeSafe agrees
    (CONSENT-7, SUBMIT-6). A table fixes every string the PRD leaves open.
1.  **Icon and pitch assets.** One Icon Composer `.icon` file: an open speech
    bubble drawn as one stroke that curls back like a turn arrow, white on
    marker blue, in two layers, with no text or SF Symbol, and default, dark,
    and mono appearances; its flattened export is Shipaton's 1024-pixel icon.
    The launch screen is the board's color in each appearance, with no image.
    The Devpost thumbnail is typographic and 3:2, legible at 333 by 222
    pixels; the gallery holds 3:2 composites of two or three phones; the
    required 1179 by 2556 screenshot comes from an iPhone 16 simulator,
    frameless, with the row mid-answer; the README's hero comes in light and
    dark; and the video is 16:9, with on-screen text sized for Devpost's 660
    by 371 player, a written caption file naming the partner and Turn, and
    Listen mode filmed on the demo iPhone. No website.
1.  **Code in step.** `app/src/constants/theme.ts` mirrors the tokens, and a
    unit test compares it with the yaml and recomputes every pair's contrast;
    one store subscribes at launch to Reduce Motion, Bold Text, Reduce
    Transparency, Increase Contrast, and the text size.
1.  **The PRD's row and large text.** ROW-1's fixed height can't hold every
    phrase whole at every size, as A11Y-4 asks, so A11Y-4 changes to allow
    the row's ellipsis, with the whole phrase in VoiceOver, in speech, and in
    the grid; its check changes with it. A11Y-8 then names a cut-off phrase
    by its whole text, which begins with the visible words, and the PRD's
    definition of the row leaves the slots' arrangement to the design.
1.  **The TRD in step.** The TRD gains `userInterfaceStyle: 'automatic'`, the
    icon and launch screen settings, text styles with ramps and Bold Text
    weights, the accessibility settings store, the row's fixed slots and
    ellipsis, the press guard, the bottom bar's paging, the permission
    sheet's background, no haptics, and the theme file and its test, and it
    links the design.

### Assumptions

- The team builds the screens from September 23 to 27 and films on September
  28, 2026, on the idea's schedule.
- The paywall's text uses the system font, since Apple's license bars
  uploading SF Pro, and its colors take the tokens' light and dark values by
  hand in RevenueCat's editor.
- Judges meet Turn mostly through the video, the Devpost images, and the
  Simulator build on iOS 27.
- No clinic has reviewed Turn yet, so the sizes follow studies of other
  groups of people with motor impairments, as the AAC design notes say.

### The Guessling design

`docs/DESIGN.md` moves to `docs/archive/guessling-design.md`, and its note
says Turn's design replaced it. Links to it move with it:

- **The archived Guessling idea, product, PRD, and TRD** link the design by
  path; their links, anchors kept, point at the archived copy.
- **The brief, the context, and the idea** describe the design as the one
  Guessling document left in `docs/`; their Guessling lines say it's
  archived with the others, and a new line links Turn's design.
- **The four notes behind the Guessling design** (motionsites, frontend
  trends, iOS design, and game design) say in their introductions that they
  fed `docs/DESIGN.md`, Guessling's design; they now say they fed the
  archived Guessling design.
- **Plans** are records of their day, so their links stay as written.

### Rejected alternatives

- **The motionsites.ai house look**, a near-black page, video behind text,
  glass cards, and faint text: it fails contrast, loops without a pause, and
  sizes buttons for a mouse.
- **Atkinson Hyperlegible Next in the app**: no study shows it reads better
  than the system face, it adds a bundle and a paywall upload, and the notes
  favor an ordinary iOS look; it stays in the pitch, where SF Pro can't go.
- **Color-coded phrases or categories**: the evidence comes from symbol grids
  for children, not from literate adults reading whole phrases.
- **Glass on the Listen control or the strip**: glass belongs to controls in
  the system's chrome, and contrast over content can't be guaranteed.
- **A component kit**: none of the six the notes read handles Increase
  Contrast, and their fixed heights and capped text scaling would need
  undoing.
- **Three columns in the row on a phone**: about nine characters a line, under
  the reading floor of about thirteen.
- **Short role labels on the strip**: see the strip's decision.
- **A pulsing light all session**: an ambient loop that WCAG 2.2.2 asks to
  pause, and the notes found steady labels read better than lights.
- **Confidence numbers, AI badges, or dimmed older phrases**: guides and
  studies advise implying confidence by order and thresholds, and the words
  are the user's own.
- **Haptics and earcons**: silenced while recording, and meaningless next to
  speech.
- **A show view that flips the last phrase toward the partner**: seven of
  twelve rivals have one, but the PRD doesn't; it's an open question.
- **An appearance setting inside the app**: Apple asks apps to avoid one.

## Verification gate

Every task runs this gate on each file it changes, after writing and before
committing. `CHECKS` is a directory holding `check_md.py`, `fact_scan.py`,
and `check_links.py` from the [first idea plan's appendix][idea-appendix],
with `check_md.py` changed as in the [Guessling plan's
appendix][ids-script], `lint_summary.py` from the [Guessling design plan's
appendix][design-appendix], and `check_contrast.py` and `archive_design.py`
from [this plan's appendix](#appendix-check-scripts); `corpus-top` in it
holds copies of the brief, the context, the idea, the product, the PRD, and
the TRD. `DOC` is the changed file, and `ALLOWED` names the linter warnings
its commit allows.

```shell
bunx prettier --write "$DOC" && bunx prettier --check "$DOC"
python3 "$CHECKS/check_md.py" . "$DOC" --contents
python3 "$CHECKS/fact_scan.py" . "$DOC" docs/sources docs/research "$CHECKS/corpus-top"
python3 "$CHECKS/check_links.py" "$DOC"
```

On `docs/DESIGN.md`, from the task that adds Colors on, it also runs:

```shell
bunx @google/design.md@0.4.0 lint docs/DESIGN.md > "$CHECKS/lint.json"
python3 "$CHECKS/lint_summary.py" "$CHECKS/lint.json" $ALLOWED
python3 "$CHECKS/check_contrast.py" docs/DESIGN.md
```

- Prettier runs first because lint-staged rewrites staged files on commit;
  the checks must see the committed form.
- `check_md.py` must print `OK`. It misses undefined shortcut references
  such as `([label])`, so a script also lists every bracketed label without
  a definition.
- `fact_scan.py` misses are either fixed or design values the document
  states as decisions, and the commit body names those.
- `check_links.py` failures are opened by hand before they're called broken.
- The linter must report no errors, and `lint_summary.py` must print `OK`
  with only the warnings named for that commit allowed.
- `check_contrast.py` must print `OK`.

Each task also has its own assertions, run first as a failing test:

```shell
check() { f=$1; shift; for p in "$@"; do grep -qE -- "$p" "$f" 2>/dev/null || echo "MISSING: $p"; done; }
```

[idea-appendix]: /docs/superpowers/plans/2026-09-22-shipaton-2026-idea.md#appendix-check-scripts
[ids-script]: /docs/superpowers/plans/2026-09-22-guessling-product-prd-trd.md#appendix-check-scripts

## Tasks

The inputs are the product, the PRD, the TRD, the idea, and the notes in
`docs/research/`. Every subagent prompt carries the repo rule: run
`graphify query "<question>"` before grepping or reading repo files. No
subagent sends the user's email address or any personal identifier to an
API, and none writes a repo file its prompt doesn't name or runs git.

The design is drafted whole in the scratchpad, checked, and then committed in
parts by an assembler that keeps only the named H2 sections, rebuilds
`Contents:`, and places each reference definition where `check_md.py`
expects it.

### Task 1: Research notes

Four background agents wrote `docs/research/turn-motionsites.md`,
`turn-frontend-trends.md`, `aac-design.md`, and `turn-ios-design.md`. Each
passed the gate, with link failures only where a site answers scripts with
HTTP 403, and each was committed on its own:

```shell
git commit -m "docs(research): add notes on motionsites.ai through Turn's lens"
git commit -m "docs(research): add notes on frontend trends through Turn's lens"
git commit -m "docs(research): add notes on AAC interface design"
git commit -m "docs(research): add notes on Turn's iOS design"
```

### Task 2: This plan

- [ ] **Step 1: Run the gate, then commit**

```shell
git add docs/superpowers/plans/2026-09-23-turn-design.md
git commit -m "docs(plan): add the Turn design plan"
```

### Task 3: Archive the Guessling design

- [ ] **Step 1: Move the file and repoint the archived documents**

```shell
git mv docs/DESIGN.md docs/archive/guessling-design.md
python3 "$CHECKS/archive_design.py"
```

The script swaps the design's note for one that says Turn's design replaced
it and repoints `/docs/DESIGN.md`, anchors kept, in the four archived
Guessling documents.

- [ ] **Step 2: Edit the rest by hand**

Rewrite the Guessling lines in the brief's, the context's, and the idea's See
also lists to say the design is archived with the others, and the four notes'
introductions to say they fed the archived design, as
[The Guessling design](#the-guessling-design) lists. Expected afterwards: no
file outside the plans links to `/docs/DESIGN.md` as Guessling's, and
`check_md.py` prints `OK` for every changed file except the brief, the
context, and the idea, whose links to `/docs/DESIGN.md` wait for Task 4.

- [ ] **Step 3: Commit**

```shell
git commit -m "docs: archive the Guessling design"
```

### Task 4: The design document

Write `docs/DESIGN.md` in eight commits, each running the gate with the
warnings named here allowed, and assertions such as the H1 `# Turn design`,
each section's heading, and the PRD IDs it cites:

1.  Overview, Influences and trends, and See also:
    `docs(design): add the overview, the rules, and the influences`
1.  Colors, allowing `missing-primary`, `missing-typography`, and
    `orphaned-tokens`: `docs(design): add colors in four appearances`
1.  Typography and Layout, allowing `missing-primary` and `orphaned-tokens`:
    `docs(design): add typography and layout`
1.  Elevation, Shapes, and Components, allowing `missing-primary` from here
    on: `docs(design): add elevation, shapes, and components`
1.  Motion, and Sound and haptics: `docs(design): add motion and sound`
1.  Screens, and Words on screen:
    `docs(design): add the screens and their words`
1.  Accessibility, and App icon and pitch assets:
    `docs(design): add accessibility, the icon, and the pitch assets`
1.  Do's and don'ts, Guidance for coding agents, and Open questions:
    `docs(design): add do's and don'ts, agent guidance, and open questions`

### Task 5: The PRD and the TRD

- [ ] **Step 1: Change A11Y-4 and its check, run the gate, then commit**

```shell
git add docs/PRD.md
git commit -m "docs(prd): let the row end a long phrase with an ellipsis"
```

- [ ] **Step 2: Bring the TRD in step, run the gate, then commit**

The TRD's changes are in the [decisions](#decisions-the-document-records);
each links the design section it builds.

```shell
git add docs/TRD.md
git commit -m "docs(trd): build the design's appearance, text, row, and motion rules"
```

### Task 6: Links from the other documents

Add a line for Turn's design to the See also lists of the brief, the context,
the idea, the product, the PRD, and the TRD, after the technical
requirements' line, run `check_md.py` on each, and commit as
`docs: link Turn's design from the other documents`.

### Task 7: Fact check, graph, and pull request

1.  Dispatch an independent fact-check subagent over the design and the PRD
    and TRD edits, against the notes and the other documents: values,
    versions, sizes, strings, requirement IDs, contrast figures, and whether
    each design value is stated as a decision. Fix what it confirms, as
    `docs: correct facts against the notes`.
1.  Run `graphify update .` and commit `graphify-out/` as
    `chore(graphify): refresh the graph for Turn's design`.
1.  Push the branch and open the pull request with the `/pr` template.
1.  Run at most two `/code-review` rounds against this plan, post each as a
    PR comment, and fix what they confirm, one commit per fix or group of
    related fixes, with a resolution comment per round.
1.  Rebase-merge the pull request and delete the branch, locally and on the
    remote.

## Appendix: check scripts

`lint_summary.py` is unchanged from the [Guessling design plan's
appendix][design-appendix]. `check_contrast.py` replaces that appendix's
version, which read one value per color from the yaml and three more from a
table; this one reads all four from the yaml and checks the components too:

````python
#!/usr/bin/env python3
"""Check the color tokens, components, and contrast table in a DESIGN.md file.

Usage: check_contrast.py <design.md>
Tokens sit in fenced yaml blocks, and each top-level key may appear in only one
block, since @google/design.md 0.4.0 skips its other rules when one repeats.
Each color under `colors:` holds four values, one per appearance:
  ink:
    light: '#1C1C1E'
    dark: '#F5F5F7'
    light-hc: '#000000'
    dark-hc: '#FFFFFF'
A pair row is a table row that starts with two token code spans and holds five
ratios, one per appearance in that order and then the minimum:
| `ink` | `surface` | Phrases | 17.0:1 | 15.6:1 | 21.0:1 | 17.0:1 | 7:1 |
Each stated ratio must equal the WCAG 2.2 ratio truncated to one decimal, so a
ratio is never rounded up to pass, and must meet the minimum. Every component
that names a text and a background color must name a pair the table lists, in
the appearance its color references share. Prints OK or one line per problem;
exit 1 on any.
"""
import math
import re
import sys

MODES = ('light', 'dark', 'light-hc', 'dark-hc')
path = sys.argv[1]
text = open(path, encoding='utf-8').read()
errs = []


def parse(block):
    """Parse the indented `key: value` yaml used in the file into nested dicts."""
    root, stack = {}, [(-1, None)]
    stack[0] = (-1, root)
    for raw in block.splitlines():
        if not raw.strip() or raw.lstrip().startswith('#'):
            continue
        indent = len(raw) - len(raw.lstrip(' '))
        m = re.match(r"^\s*([A-Za-z0-9_.-]+):\s*(.*?)\s*$", raw)
        if not m:
            continue
        key, value = m.group(1), m.group(2)
        while stack[-1][0] >= indent:
            stack.pop()
        parent = stack[-1][1]
        if value in ('', '>-', '|', '>'):
            parent[key] = {} if value == '' else ''
            if value == '':
                stack.append((indent, parent[key]))
        else:
            parent[key] = value.strip('\'"')
    return root


tokens, seen = {}, {}
for n, block in enumerate(re.findall(r'^```yaml\n(.*?)^```', text, re.M | re.S), 1):
    for key, value in parse(block).items():
        if key in seen:
            errs.append(f'{path}: top-level key {key} is in yaml blocks {seen[key]} and {n}')
        seen[key] = n
        tokens[key] = value

colors = tokens.get('colors', {})
for name, values in colors.items():
    if not isinstance(values, dict) or set(values) != set(MODES):
        errs.append(f'{path}: color {name} needs exactly {", ".join(MODES)}')
        continue
    for mode, value in values.items():
        if not re.fullmatch(r'#[0-9A-Fa-f]{6}', value):
            errs.append(f'{path}: color {name}.{mode} is {value}, not #RRGGBB')


def luminance(hex_color):
    h = hex_color.lstrip('#')
    channels = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in channels]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def contrast(a, b):
    hi, lo = sorted((luminance(a), luminance(b)), reverse=True)
    return (hi + 0.05) / (lo + 0.05)


pairs = {}
for n, line in enumerate(text.splitlines(), 1):
    if not line.startswith('|'):
        continue
    cells = [c.strip() for c in line.strip().strip('|').split('|')]
    first = re.fullmatch(r'`([a-z][a-z0-9-]*)`', cells[0])
    second = re.fullmatch(r'`([a-z][a-z0-9-]*)`', cells[1]) if len(cells) > 1 else None
    ratios = [c for c in cells[2:] if re.fullmatch(r'\d+(?:\.\d)?:1', c)]
    if not (first and second and len(ratios) == 5):
        continue
    fg, bg = first.group(1), second.group(1)
    pairs[(fg, bg)] = n
    if fg not in colors or bg not in colors:
        errs.append(f'{path}:{n}: unknown color in {fg} on {bg}')
        continue
    need = float(ratios[4].split(':')[0])
    for i, mode in enumerate(MODES):
        ratio = contrast(colors[fg][mode], colors[bg][mode])
        shown = math.floor(ratio * 10) / 10
        if float(ratios[i].split(':')[0]) != shown:
            errs.append(f'{path}:{n}: {fg} on {bg} ({mode}) is {shown}:1, not {ratios[i]}')
        if ratio < need:
            errs.append(f'{path}:{n}: {fg} on {bg} ({mode}) is {ratio:.2f}:1, under {ratios[4]}')

used = set()
for name, props in tokens.get('components', {}).items():
    refs = {}
    for prop in ('textColor', 'backgroundColor'):
        m = re.fullmatch(r'\{colors\.([a-z0-9-]+)\.([a-z-]+)\}', props.get(prop, ''))
        if prop in props and not m:
            errs.append(f'{path}: component {name} {prop} {props[prop]} is not a color leaf')
        if m:
            refs[prop] = m.groups()
            used.add(m.group(1))
    if len(refs) == 2:
        (fg, fg_mode), (bg, bg_mode) = refs['textColor'], refs['backgroundColor']
        if fg_mode != bg_mode:
            errs.append(f'{path}: component {name} mixes {fg_mode} and {bg_mode}')
        elif (fg, bg) not in pairs:
            errs.append(f'{path}: component {name} uses {fg} on {bg}, not in the contrast table')
for name in colors:
    if 'components' in tokens and name not in used:
        errs.append(f'{path}: color {name} is used by no component')

if not colors:
    errs.append(f'{path}: no colors found in yaml blocks')
if not pairs:
    errs.append(f'{path}: no contrast pairs found')
count = len(tokens.get('components', {}))
print('\n'.join(errs) if errs else f'OK ({len(colors)} colors, {len(pairs)} pairs, {count} components)')
sys.exit(1 if errs else 0)
````

`archive_design.py` moves the Guessling design's links:

```python
#!/usr/bin/env python3
"""Archive the Guessling design and repoint the archived documents' links.

Run from the repo root after `git mv docs/DESIGN.md docs/archive/guessling-design.md`.
The brief, the context, the idea, and the research notes are edited by hand.
"""
import re

OLD, NEW = '/docs/DESIGN.md', '/docs/archive/guessling-design.md'
FILES = [
    'docs/archive/guessling-design.md',
    'docs/archive/guessling-idea.md',
    'docs/archive/guessling-product.md',
    'docs/archive/guessling-prd.md',
    'docs/archive/guessling-trd.md',
]

OLD_NOTE = '''> **Superseded on September 22, 2026.** This document describes Guessling, the
> team's first idea. [Turn](/docs/IDEA.md), an entry for the Next Gen Award,
> replaced it, and this document's links to Guessling's idea, product, PRD, and
> TRD point at their archived copies in `docs/archive/`.'''

NEW_NOTE = '''> **Superseded on September 22, 2026, and archived on September 23.** This
> document describes Guessling, the team's first idea. [Turn](/docs/IDEA.md), an
> entry for the Next Gen Award, replaced it, and
> [`docs/DESIGN.md`](/docs/DESIGN.md) now holds Turn's design. This document's
> links to Guessling's idea, product, PRD, and TRD point at their archived
> copies in `docs/archive/`.'''

for f in FILES:
    s = open(f, encoding='utf-8').read()
    n0 = s
    if f.endswith('guessling-design.md'):
        assert OLD_NOTE in s, f'{f}: old note not found'
        s = s.replace(OLD_NOTE, '\x00NOTE\x00')
    s = re.sub(re.escape(OLD) + r'(?=[#)\s]|$)', NEW, s)
    s = s.replace('\x00NOTE\x00', NEW_NOTE)
    if s != n0:
        open(f, 'w', encoding='utf-8').write(s)
        print('updated', f)
```

[design-appendix]: /docs/superpowers/plans/2026-09-22-guessling-design.md#appendix-check-scripts

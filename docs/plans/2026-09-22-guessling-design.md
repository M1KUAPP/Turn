# Guessling design implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `docs/DESIGN.md`: how Guessling looks, moves, sounds, and
reads in the app, the paywall, the three web pages, and the store and pitch
assets, drawn from research into trending frontend services, so the team
can build the screens and the Guessling's art on September 23, 2026, and a
coding agent can follow it.

**Architecture:** Four new research notes supply the evidence: the
motionsites.ai catalog, the wider trend landscape and the DESIGN.md
format, what iOS 26 and Expo SDK 57 allow and require, and the design of
daily puzzle games and character-led apps. `docs/DESIGN.md` follows Google's
DESIGN.md format in the form the repo's style guide asks for, and each task
adds whole H2 sections with their `Contents:` entries, so every commit
leaves a consistent document. Google's linter and a new contrast script
check it, and small TRD edits fix the five problems the research found in
the TRD's plan.

**Tech Stack:** Markdown (GFM), Prettier 3 run by husky and lint-staged,
commitlint with Conventional Commits, the `gh` CLI, `@google/design.md`
0.4.0, Python 3 with curl for the local checks in the
[appendix](#appendix-check-scripts), and subagents for research, fact
checking, and review.

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
  (`1.  [Heading](#anchor)`) instead of a `[TOC]` directive, as in the other
  documents.
- One H1; ATX headings with unique names and blank lines around them; prose
  wrapped at 80 characters (links, tables, headings, and code blocks are
  exempt); no trailing whitespace; `- ` bullets; a language on every fenced
  code block. Never start a wrapped line with a number and a period, which
  Prettier reads as a list item.
- Repo links use root paths such as `/docs/TRD.md`. Long or repeated links
  become reference links, defined before the next heading after first use, or
  at the end of the document when several sections use them.
- Each fact lives in one document, and the others link to it. The product
  document owns the Guessling's role, personality, and voice; the PRD owns
  the requirements and the strings it quotes; the TRD owns the build; the
  idea owns the schedule, the categories, and the video's script.
  `docs/DESIGN.md` owns the look and feel: tokens, the Guessling's
  construction and motion, components, screen layouts, the strings the PRD
  leaves open, sound and haptic cues, and asset specs. It cites the PRD IDs
  each rule serves and links the TRD for how it's built.
- `docs/DESIGN.md` agrees with the PRD and the TRD: the fixed strings, the
  share format, the routes, Reanimated, sounds in the ambient category, a
  light haptic per answer and a success haptic on a solve, RevenueCat's
  native paywall, and an iPhone-only portrait app on iOS 16.4 or later. Where
  the research shows the TRD's plan fails, the TRD is fixed in this branch,
  in its own commit, and both documents say the same thing.
- Every pair in the Colors section's contrast table passes
  `check_contrast.py`: text at 4.5 to 1 or more in all four appearances
  (A11Y-5), and marks and boundaries at 3 to 1. Every other pair the
  document names reuses one of those pairs, and the app's theme test, which
  the design's cut line never drops, computes every pair the app uses. The
  paywall, set up by hand in RevenueCat's editor, relies on the design
  naming each color by its token.
- Trend claims cite the research notes, and a trend the design rejects says
  why.
- Design values the document sets, such as colors, sizes, and durations, are
  decisions: the document states them as such, and each commit body names
  them as expected fact-scan misses.
- Versions are dated as of September 22, 2026. Absolute dates only.
- Use they/them for any person whose pronouns aren't stated.
- Conventional Commits: lowercase subject, header of at most 100 characters,
  body lines of at most 100 characters, no attribution lines.
- Stage explicit paths only. Never stage `skills-lock.json`, `.agents/`, or
  `.claude/`; they hold unrelated local changes.

## Design

`docs/DESIGN.md` serves the team building Guessling on September 23 and 24,
2026, the coding agents in this repo, and anyone configuring the paywall or
making the store and pitch assets.

### What goes where

| Question                                                         | Answered in            |
| ---------------------------------------------------------------- | ---------------------- |
| Who is the Guessling, and how does it talk?                      | Product                |
| What must version 1.0 do, including which strings are fixed?     | PRD                    |
| How is it built: routes, libraries, state, and configuration?    | TRD                    |
| How does it look, move, and sound, and what do the screens show? | Design                 |
| Why Guessling, which categories, what schedule, and what video?  | Idea                   |
| What do the vendors' and makers' own pages say?                  | Notes in docs/research |

### Sections of the design document

Google's specification fixes the order of its eight sections and allows
others between them; custom sections sit where a reader needs them.

1.  **Overview**: the one reference the look grows from, the principles
    that settle trade-offs, and the scope.
1.  **Influences and trends**: what the research found in motionsites.ai,
    the generators and libraries, Apple's and Google's design languages, and
    daily puzzle games, and what Guessling adopts, adapts, or rejects.
1.  **The Guessling**: its body, face, and parts, every pose, the answer
    card, and how the art gets made.
1.  **Colors**: roles, the light values as tokens, every appearance, and
    the contrast of each pair.
1.  **Typography**: the faces, the type tokens, and how each follows
    Dynamic Type.
1.  **Layout**: spacing tokens, margins, the screen's parts, the keyboard,
    and large text.
1.  **Elevation**: depth by color, the few shadows, and where Liquid Glass
    goes and what replaces it.
1.  **Shapes**: corner tokens and rules.
1.  **Components**: component tokens, and the buttons, speech bubble,
    answer chips, turn meter, notepad rows, composer, symbols, and banners.
1.  **Motion**: motion tokens, each reaction's timing, Reduce Motion, and
    screen motion.
1.  **Sound and haptics**: the four sounds, the haptics, and their timing.
1.  **Screens**: Today, every answer drawn, the end of a round, the notice,
    the archive, settings, the paywall, and launch.
1.  **Words on screen**: copy rules and every string the PRD leaves open.
1.  **Accessibility**: how the design meets A11Y-1 to A11Y-6.
1.  **Web pages**: the privacy, terms, and support pages.
1.  **App icon and store assets**: the icon, screenshots, the Devpost images,
    and the video's look.
1.  **Do's and don'ts**: a short, specific list.
1.  **Guidance for coding agents**: how to use the file, how code stays in
    step with it, and the checks before a screen ships.
1.  **Open questions**: each with a safe default.
1.  **See also**.

### Decisions the document records

The goal directive rules out asking, so these are decided here, for the
reasons given, and each is stated as a decision in the document.

1.  **Format.** Google's DESIGN.md format (alpha; `@google/design.md` 0.4.0)
    in this repo's style: an H1, an introduction, and a `Contents:` list;
    the specification's sections under its own names, in its order, with
    "Do's and don'ts" in sentence case; tokens in fenced `yaml` blocks inside
    the sections they describe; `px` read as points. The format has no
    appearance modes, so the yaml holds the light values and a table in
    Colors holds all four appearances.
1.  **One reference.** "A card game on a blue table": the Guessling, a
    marigold creature, keeps the answer on a card, face down, and the
    player's questions go down on an index card beside it. Google's format
    asks for "a specific reference", and Anthropic's skill for the subject's
    own "materials, and vernacular". The written-down answer is also the
    product's promise: same puzzle, same answers.
1.  **Palette.** Table blue for the field (`#2E5BD8`), Index white for cards,
    Ballpoint ink for text, Pencil for secondary text, Rule blue and Margin
    pink for the notepad's lines, Link blue, and Marigold (`#FFC53D`) for
    the Guessling, the primary action, and the right guess, never for a Yes
    or a No. Yes green and No red take the hues of 🟩 and 🟥, each with a
    text and a tint shade; a neutral Stone marks the free replies. Every
    token has light, dark, and Increase Contrast values for
    `DynamicColorIOS`, the app follows the system's appearance, and there's
    no appearance setting.
1.  **A glyph for every answer.** A check for Yes, a cross for No and a
    wrong guess, a question mark for "Ask another way" and "Ask a yes-or-no
    question", and a target for the right guess, beside the word, because 🟩
    and 🟥 nearly merge for deuteranopes (ΔE00 8.9).
1.  **Type.** System faces only: SF Pro Rounded (`ui-rounded`) for the
    Guessling's words, the hint, titles, buttons, chips, and counts; SF Pro
    (`system-ui`) for questions and body text. Eleven tokens, each with the
    `dynamicTypeRamp` whose curve it follows; nothing under 11 points;
    tabular figures for counts; weights step up one level with Bold Text.
    Nothing is bundled. Store and pitch art uses Nunito, under the Open Font
    License, which never ships in the app or loads on the web pages.
1.  **The Guessling's construction.** A rig of vector parts (body, eyes,
    lids, brows, mouth, a "?" tuft, arms, and feet), each in its own
    animated layer moved only by transforms and opacity. Its poses come from
    part states: idle, thinking, nod, head shake, shrug, celebration,
    resting, and presenting, for an unsolved reveal. The tuft turns from "?"
    to "!" on a solve. A person draws the final parts; AI may explore, and
    is credited. If the rig isn't ready by the end of September 23, the
    idea's trigger, stills with fades ship instead.
1.  **Motion.** Named Reanimated springs in the duration form, whose real
    time is 1.5 times the duration: `snap` 200 ms at 0.8, `settle` 350 at 1,
    `nod` 250 at 0.35, `shake` 300 at 0.3, `shrug` 160 at 1, and `hop` 320 at
    0.45, plus a 120 ms `lead` and a 200 ms `fade` that ignores Reduce
    Motion. The word, the haptic, and the sound land within 100 ms of the
    answer; reactions last half a second to three quarters, the celebration
    about 1.2; nothing waits for an animation; the thinking pose starts
    after 300 ms; nothing loops while idle; Reanimated's CSS animations
    aren't used, since they ignore Reduce Motion.
1.  **Reduce Motion.** Each reaction becomes a 200 ms cross-fade to its key
    pose, with no confetti, and the app follows `AccessibilityInfo` and its
    `reduceMotionChanged` event, because `useReducedMotion()` and
    Reanimated's default both read the setting only at launch, so every
    animation sets `ReduceMotion.Never` and the app picks the version.
1.  **Glass.** Only the composer floats in glass, through `GlassView` on
    iOS 26 and later; below iOS 26, and with Reduce Transparency on, it's an
    Index white capsule with a Pencil border. It's never faded with
    opacity. System bars and sheets take glass from the system.
1.  **Screens.** Today puts the Guessling and its speech bubble on the table
    and the hint, the turn meter, and the history on the notepad, with the
    composer below, which switches between asking and guessing, so no new
    route is needed. The end of a round holds the last reaction for 1.5
    seconds, flips the answer card, and shows the result as it will be
    shared. The notice is a sheet with two buttons of equal weight. The
    paywall is RevenueCat's sheet, styled with the tokens in both
    appearances.
1.  **Sound.** Four short cues, Yes, No, shrug, and solve, in soft wood and
    felt timbres, never a buzzer, made by the team or taken from a CC0
    source that is recorded beside the file.
1.  **Words.** Every string the PRD leaves open is fixed in a table, in
    sentence case, with one exclamation mark in the app, "You got it!", and
    no word that blames the player.
1.  **Web pages.** Inline CSS with the tokens as custom properties, following
    `prefers-color-scheme` and `prefers-contrast`; the `ui-rounded` and
    `system-ui` stacks; the Guessling as an inline SVG; nothing loaded from a
    third party.
1.  **Icon and store assets.** One Icon Composer `.icon` file: a Table blue
    background and the Guessling's face and tuft in flat layers, no text,
    no SF Symbols, with dark and mono variants. Five 1320 × 2868 screenshots,
    frameless captures under a caption band, the first three a question, a
    reaction, and the solve, one in Dark Mode, the archive labeled as
    Guessling+; one 1179 × 2556 capture and a 3:2 thumbnail for Devpost. No
    app preview in version 1.0.
1.  **Code in step.** `app/src/constants/theme.ts`, where Expo's default
    template keeps its theme, mirrors the tokens, and a unit test compares
    it with the yaml and the Colors table.
1.  **TRD fixes.** The TRD gains `userInterfaceStyle: 'automatic'`, the
    Reduce Motion approach above, the audio mode and the expo-audio plugin
    settings, text styles with `dynamicTypeRamp`, a note that the paywall's
    images never reach VoiceOver, and the icon and splash configuration,
    and links the design.
1.  **The share row.** SHARE-1 stays as it is for version 1.0. That its Yes
    and No differ only by color is an open question for the PRD, with a
    high-contrast share option as the likely answer.

### Assumptions

- The team draws the rig's parts in a vector tool on September 23, as the
  idea's schedule plans.
- The paywall editor's system font is SF Pro, and SF Pro Rounded can't be
  uploaded, since Apple's font licenses forbid embedding, so the paywall
  sets its headings in the system font.
- Many judges run iOS 26 or 27, but every screen works on iOS 16.4 to 18
  without glass.

### Rejected alternatives

- **The motionsites.ai house look**, a near-black page with an italic serif,
  a background video, and glass on every card: a landing-page habit that
  competes with the character and ignores the system's appearance.
- **A cream page with a serif display**: the first of the looks Anthropic's
  skill says generated design "clusters around", and NYT's ground.
- **Plain system defaults**: no art direction, which Best Game asks for.
- **A bundled display face**: a license notice in the app, an upload to
  RevenueCat, and Bold Text to handle, for little over SF Pro Rounded.
- **Rive or Lottie for the Guessling in version 1.0**: a new dependency or
  tool on a one-day art budget; Rive stays the upgrade path.
- **An in-app appearance switch**: Apple says to avoid one.
- **A guess sheet on its own route**: the composer's guess mode needs no
  route change.
- **Idle loops**: Apple and Anthropic ask for restraint, and WCAG 2.2.2
  asks for a way to stop motion that runs longer than five seconds.
- **A high-contrast share option now**: it changes SHARE-1, a PRD decision.

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

On `docs/DESIGN.md`, from the task that adds Colors on, it also runs:

```shell
bunx @google/design.md@0.4.0 lint docs/DESIGN.md > "$CHECKS/lint.json"
python3 "$CHECKS/lint_summary.py" "$CHECKS/lint.json" missing-typography  # none allowed from Typography on
python3 "$CHECKS/check_contrast.py" docs/DESIGN.md
```

- Prettier runs first because lint-staged rewrites staged files on commit;
  the checks must see the committed form.
- `check_md.py` must print `OK`.
- `fact_scan.py` misses are either fixed or design values the document
  states as decisions, and the commit body names those.
- `check_links.py` failures are opened by hand before they're called broken.
- The linter must report no errors. The Colors commit may warn that no
  type tokens exist yet (`missing-typography`); from the Typography commit
  on, `lint_summary.py` runs with no allowed rule and must print `OK`. The
  linter flags colors no component uses (`orphaned-tokens`) only once
  components exist, and Components references every color.
- `check_contrast.py` must print `OK`.

Each task also has its own assertions, run first as a failing test:

```shell
check() { f=$1; shift; for p in "$@"; do grep -qE -- "$p" "$f" 2>/dev/null || echo "MISSING: $p"; done; }
```

## Tasks

Every subagent prompt carries the repo rule: run `graphify query
"<question>"` before grepping or reading repo files. Subagents write no repo
file unless their prompt names one, and never run git.

### Task 1: Research notes and this plan

**Files:**

- Create: `docs/research/motionsites.md`, `docs/research/frontend-trends.md`,
  `docs/research/ios-design.md`, and `docs/research/game-design.md`, written
  by four background research agents from primary sources.
- Create: this plan.

- [ ] **Step 1: Check each note and the plan**

Run the gate on each. Expected: prettier passes, `OK`, and every failing
link opened by hand. The notes cite web sources, so their fact scan is
informational.

- [ ] **Step 2: Commit each note on its own, then the plan**

```shell
git add docs/research/motionsites.md
git commit -m "docs(research): add notes on the motionsites.ai catalog"
git add docs/research/frontend-trends.md
git commit -m "docs(research): add notes on frontend trends and DESIGN.md"
git add docs/research/ios-design.md
git commit -m "docs(research): add notes on designing for iOS 26 with Expo"
git add docs/research/game-design.md
git commit -m "docs(research): add notes on puzzle game and character design"
git add docs/plans/2026-09-22-guessling-design.md
git commit -m "docs(plan): plan the design document"
```

### Task 2: TRD fixes

**Files:**

- Modify: `docs/TRD.md`, in "The iPhone app".

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/TRD.md "userInterfaceStyle: 'automatic'" 'ReduceMotion\.Never' \
  'reduceMotionChanged' 'setAudioModeAsync' 'dynamicTypeRamp' 'hides paywall images'
```

- [ ] **Step 2: Fix each problem in its own commit**

Each edit links the iOS note's section behind it. The fixes come before the
design document, which describes the fixed TRD.

```shell
git add docs/TRD.md
git commit -m "docs(trd): follow the system's appearance instead of forcing light"
git add docs/TRD.md
git commit -m "docs(trd): keep the Reduce Motion fade and follow the live setting"
git add docs/TRD.md
git commit -m "docs(trd): set the audio mode and the audio plugin for ambient cues"
git add docs/TRD.md
git commit -m "docs(trd): scale text on Apple's Dynamic Type curves"
git add docs/TRD.md
git commit -m "docs(trd): keep what the paywall must say out of its images"
```

### Task 3: Frame and overview

**Files:**

- Create: `docs/DESIGN.md`

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/DESIGN.md '^# Guessling design$' '^Contents:$' '^## Overview$' \
  '^### The reference$' '^### Principles$' '^## See also$' '/docs/PRODUCT\.md' \
  '/docs/PRD\.md' '/docs/TRD\.md' 'version: alpha'
```

Expected: every pattern MISSING.

- [ ] **Step 2: Write the sections**

The H1; an introduction that says what the document is, who reads it, that
it follows Google's DESIGN.md format, and that facts are as of September 22,
2026; the `Contents:` list; Overview with the `name` and `description`
tokens, the reference (decision 2), the principles, and the scope (the app,
the paywall's styling, the web pages, the icon, and the store and pitch
assets); and See also.

- [ ] **Step 3: Run the gate, then commit**

```shell
git add docs/DESIGN.md
git commit -m "docs(design): add the frame and the overview"
```

### Task 4: Influences and trends

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/DESIGN.md '^## Influences and trends$' '/docs/research/motionsites\.md' \
  '/docs/research/frontend-trends\.md' '/docs/research/ios-design\.md' \
  '/docs/research/game-design\.md'
```

- [ ] **Step 2: Write the section**

What each note found, in a sentence or two with its figures, then three
lists: adopted, adapted, and rejected, each with its reason and a link to
the note's section.

- [ ] **Step 3: Run the gate, then commit**

```shell
git add docs/DESIGN.md
git commit -m "docs(design): say which trends Guessling adopts and rejects"
```

### Task 5: The Guessling

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/DESIGN.md '^## The Guessling$' '^### Parts of the Guessling$' \
  '^### Poses$' '^### The answer card$' '^### Making the art$' 'tuft'
```

- [ ] **Step 2: Write the section**

The silhouette and proportions, the parts and their layer order, each pose's
key shape and axis (decision 6), the answer card's back and face, sizes, and
how the art is made, credited, and cut down to stills if it's late.

- [ ] **Step 3: Run the gate, then commit**

```shell
git add docs/DESIGN.md
git commit -m "docs(design): specify the Guessling's parts and poses"
```

### Task 6: Colors

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/DESIGN.md '^## Colors$' "primary: '#FFC53D'" '#2E5BD8' 'DynamicColorIOS' \
  'A11Y-4' 'A11Y-5'
python3 "$CHECKS/check_contrast.py" docs/DESIGN.md
```

Expected: MISSING patterns, and the script reports no colors.

- [ ] **Step 2: Write the section**

The palette's logic, the yaml `colors:` block with each token's light
value, the table of every appearance, the contrast table, and the rules for
answer colors and glyphs (decisions 3 and 4).

- [ ] **Step 3: Run the gate, then commit**

The linter's `missing-typography` warning is expected until the Typography
task.

```shell
git add docs/DESIGN.md
git commit -m "docs(design): add the palette in four appearances"
```

### Task 7: Typography

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/DESIGN.md '^## Typography$' 'ui-rounded' 'system-ui' 'dynamicTypeRamp' \
  'tabular' 'Nunito'
```

- [ ] **Step 2: Write the section**

The two faces and why, the yaml `typography:` block, the table of ramps and
largest sizes, the rules on weights, Bold Text, and truncation, and the
marketing face (decision 5).

- [ ] **Step 3: Run the gate, then commit**

```shell
git add docs/DESIGN.md
git commit -m "docs(design): add type tokens on Apple's Dynamic Type curves"
```

### Task 8: Layout

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/DESIGN.md '^## Layout$' 'spacing:' '44' '375 × 667'
```

- [ ] **Step 2: Write the section**

The yaml `spacing:` block, the margins and grid, the Today screen's three
bands, the compact stage while the keyboard is up, the stacked rows from
AX1, and the smallest and largest screens.

- [ ] **Step 3: Run the gate, then commit**

```shell
git add docs/DESIGN.md
git commit -m "docs(design): add spacing and the screen layout"
```

### Task 9: Elevation and shapes

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/DESIGN.md '^## Elevation$' '^## Shapes$' 'GlassView' \
  'isReduceTransparencyEnabled' 'rounded:'
```

- [ ] **Step 2: Write the sections**

Elevation: depth by color, the shadows, and the glass rules with their
fallbacks (decision 9). Shapes: the yaml `rounded:` block and the corner
rules.

- [ ] **Step 3: Run the gate, then commit**

```shell
git add docs/DESIGN.md
git commit -m "docs(design): add elevation, glass, and shapes"
```

### Task 10: Components

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/DESIGN.md '^## Components$' 'components:' '^### Buttons$' \
  '^### The turn meter$' '^### The composer$' '^### Symbols$'
```

- [ ] **Step 2: Write the section**

The yaml `components:` block, which references every color, and each
component's anatomy, states, sizes, and labels. From here on the linter
must report no warnings.

- [ ] **Step 3: Run the gate, then commit**

```shell
git add docs/DESIGN.md
git commit -m "docs(design): add the components"
```

### Task 11: Motion

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/DESIGN.md '^## Motion$' 'motion:' 'ReduceMotion\.Never' \
  'reduceMotionChanged' 'A11Y-3'
```

- [ ] **Step 2: Write the section**

The yaml `motion:` block, the timeline of each reaction, the Reduce Motion
versions, and screen motion (decisions 7 and 8).

- [ ] **Step 3: Run the gate, then commit**

```shell
git add docs/DESIGN.md
git commit -m "docs(design): add motion tokens and each reaction's timing"
```

### Task 12: Sound and haptics

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/DESIGN.md '^## Sound and haptics$' 'SET-2' 'mixWithOthers' 'CC0'
```

- [ ] **Step 2: Write the section**

The four cues, their length and character, the audio mode, the haptics per
answer, and their timing against the word (decision 11).

- [ ] **Step 3: Run the gate, then commit**

```shell
git add docs/DESIGN.md
git commit -m "docs(design): add the sounds and haptics"
```

### Task 13: Screens

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/DESIGN.md '^## Screens$' '^### Today$' '^### Every answer, drawn$' \
  '^### The end of a round$' '^### The notice$' '^### The archive$' \
  '^### Settings$' '^### The paywall$' '^### Launch$' 'TODAY-1' 'END-3'
```

- [ ] **Step 2: Write the section**

Each screen's layout from top to bottom, its states, and the PRD IDs it
serves, with a table that draws every answer and state (decision 10).

- [ ] **Step 3: Run the gate, then commit**

```shell
git add docs/DESIGN.md
git commit -m "docs(design): lay out every screen and state"
```

### Task 14: Words on screen

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/DESIGN.md '^## Words on screen$' 'You got it!' 'Not it' 'Out of turns'
```

- [ ] **Step 2: Write the section**

The copy rules and the table of strings, each marked as fixed by the PRD or
by this document (decision 12).

- [ ] **Step 3: Run the gate, then commit**

```shell
git add docs/DESIGN.md
git commit -m "docs(design): fix the strings the PRD leaves open"
```

### Task 15: Accessibility

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/DESIGN.md '^## Accessibility$' 'A11Y-1' 'A11Y-2' 'A11Y-6' 'VoiceOver' \
  'Bold Text'
```

- [ ] **Step 2: Write the section**

How each accessibility setting changes the design, what VoiceOver reads,
and which of Apple's labels the design lets the team claim.

- [ ] **Step 3: Run the gate, then commit**

```shell
git add docs/DESIGN.md
git commit -m "docs(design): map the design to the accessibility requirements"
```

### Task 16: Web pages

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/DESIGN.md '^## Web pages$' 'prefers-color-scheme' 'prefers-contrast' \
  '/privacy'
```

- [ ] **Step 2: Write the section**

The pages' layout, type stacks, colors, and privacy rules (decision 13).

- [ ] **Step 3: Run the gate, then commit**

```shell
git add docs/DESIGN.md
git commit -m "docs(design): style the privacy, terms, and support pages"
```

### Task 17: App icon and store assets

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/DESIGN.md '^## App icon and store assets$' 'Icon Composer' '1320 × 2868' \
  '1179 × 2556' '3:2' 'STORE-2'
```

- [ ] **Step 2: Write the section**

The icon, the launch look, the screenshots and their captions, the Devpost
images, and the video's look (decision 14).

- [ ] **Step 3: Run the gate, then commit**

```shell
git add docs/DESIGN.md
git commit -m "docs(design): specify the icon and the store and pitch assets"
```

### Task 18: Do's and don'ts, and guidance for coding agents

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/DESIGN.md "^## Do's and don'ts$" '^## Guidance for coding agents$' \
  'app/src/constants/theme\.ts' '^### Checks before a screen ships$'
```

- [ ] **Step 2: Write the sections**

A short list of do's and don'ts; then how agents use the file, how the
theme stays in step (decision 15), and the test matrix.

- [ ] **Step 3: Run the gate, then commit**

```shell
git add docs/DESIGN.md
git commit -m "docs(design): add the rules for people and coding agents"
```

### Task 19: Open questions

- [ ] **Step 1: Write the failing assertions**

```shell
check docs/DESIGN.md '^## Open questions$' 'SHARE-1' 'Safe default'
```

- [ ] **Step 2: Write the section**

Each question with its safe default, including the share row (decision 17).

- [ ] **Step 3: Run the gate, then commit**

```shell
git add docs/DESIGN.md
git commit -m "docs(design): list the open design questions"
```

### Task 20: Links from the other documents

**Files:**

- Modify: `docs/TRD.md`: the icon and splash configuration in
  `app.config.ts`, and a line in "Reactions, sound, and haptics" that
  points to the design's Guessling, Motion, and Sound and haptics
  sections.
- Modify: `docs/BRIEF.md`, `docs/CONTEXT.md`, `docs/IDEA.md`,
  `docs/PRODUCT.md`, `docs/PRD.md`, and `docs/TRD.md`: one See also line
  each, after the technical requirements line or its equivalent.

- [ ] **Step 1: Point the TRD at the design, run the gate, then commit**

```shell
git add docs/TRD.md
git commit -m "docs(trd): add the icon and launch screen, and link the design"
```

- [ ] **Step 2: Add the See also lines, run `check_md.py` on each, then commit**

```shell
git add docs/BRIEF.md docs/CONTEXT.md docs/IDEA.md docs/PRODUCT.md docs/PRD.md docs/TRD.md
git commit -m "docs: link the design document from the others"
```

### Task 21: Final checks

- [ ] **Step 1: Run the gate on every changed file**

- [ ] **Step 2: Independent fact check**

Dispatch a fresh agent to check every claim in `docs/DESIGN.md` and the TRD
edits against the four notes and the other documents: figures, versions,
strings, requirement IDs, and whether each design value is stated as a
decision. Fix confirmed problems and commit them as
`docs: correct facts against the notes`.

- [ ] **Step 3: Refresh the knowledge graph**

```shell
bun run graph
git add graphify-out
git commit -m "chore(graphify): refresh the graph"
```

Skip the commit if nothing changed.

### Task 22: Pull request, review, and merge

- [ ] **Step 1: Push and open the PR**

```shell
git push -u origin docs/design
gh pr create --base main --head docs/design \
  --title "docs: add the Guessling design document" --body-file "$CHECKS/pr-body-design.md"
```

The body summarizes the document, the notes, the TRD fixes, the plan, and
the checks run. No attribution lines.

- [ ] **Step 2: Review and resolve, at most two rounds**

Each round: a fresh reviewer checks the PR diff for accuracy against the
notes, the style guide, Google's format, consistency with the product, the
PRD, and the TRD, whether a team could build the screens from it in a day,
and whether its checks hold. Apply the valid findings as small commits, run
the gate, push, and post the round's summary as a PR comment. Stop after
round two and list any remaining nits in the PR.

- [ ] **Step 3: Merge and delete the branch**

```shell
gh pr merge --rebase --delete-branch
git checkout main && git pull --ff-only
```

## Appendix: check scripts

`check_md.py`, `fact_scan.py`, and `check_links.py` are unchanged from the
[product plan's appendix](/docs/plans/2026-09-22-guessling-product-prd-trd.md#appendix-check-scripts).
This plan adds two scripts.

`check_contrast.py` checks the Colors section:

````python
#!/usr/bin/env python3
"""Check the colors and the contrast table in a DESIGN.md file.

Usage: check_contrast.py <design.md>
The fenced yaml blocks' `colors:` maps hold each token's light value, one
`name: '#RRGGBB'` per line. A color row is a table row that starts with a
token code span and holds four hex code spans, light, dark, light with
Increase Contrast, and dark with Increase Contrast:
| `ink` | Ballpoint | Text | `#15203B` | `#F1F4FA` | `#0B1226` | `#FFFFFF` |
Every yaml color needs one color row, whose light value matches, and every
color row needs a yaml color. A pair row starts with two token code spans
and holds five ratios, one per appearance and then the minimum:
| `ink` | `card` | 16.1:1 | 11.3:1 | 18.6:1 | 13.6:1 | 7:1 |
Each stated ratio must equal the WCAG 2.2 ratio truncated to one decimal, so
a ratio is never rounded up to pass, and must meet the minimum. Prints OK or
one line per problem; exit 1 on any.
"""
import math
import re
import sys

path = sys.argv[1]
text = open(path, encoding='utf-8').read()
errs = []
yaml_colors = {}
rows = {}
pairs = []

for block in re.findall(r'^```yaml\n(.*?)^```', text, re.M | re.S):
    in_colors = False
    for line in block.splitlines():
        if re.match(r'^\S', line):
            in_colors = line.rstrip() == 'colors:'
            continue
        m = re.match(r"^  ([a-z][a-z0-9-]*): ['\"]?(#[0-9A-Fa-f]{6})['\"]?\s*$", line)
        if in_colors and m:
            if m.group(1) in yaml_colors:
                errs.append(f'{path}: yaml color {m.group(1)} is defined twice')
            yaml_colors[m.group(1)] = m.group(2).upper()

for n, line in enumerate(text.splitlines(), 1):
    if not line.startswith('|'):
        continue
    cells = [c.strip() for c in line.strip().strip('|').split('|')]
    first = re.fullmatch(r'`([a-z][a-z0-9-]*)`', cells[0])
    if not first:
        continue
    hexes = [c.strip('`').upper() for c in cells if re.fullmatch(r'`#[0-9A-Fa-f]{6}`', c)]
    second = re.fullmatch(r'`([a-z][a-z0-9-]*)`', cells[1]) if len(cells) > 1 else None
    ratios = [c for c in cells[2:] if re.fullmatch(r'\d+(?:\.\d)?:1', c)]
    if len(hexes) == 4:
        if first.group(1) in rows:
            errs.append(f'{path}:{n}: color row {first.group(1)} appears twice')
        rows[first.group(1)] = (n, hexes)
    elif second and len(ratios) == 5:
        pairs.append((n, first.group(1), second.group(1), ratios))

for name, light in yaml_colors.items():
    if name not in rows:
        errs.append(f'{path}: yaml color {name} has no color row')
    elif rows[name][1][0] != light:
        errs.append(f'{path}:{rows[name][0]}: {name} is {rows[name][1][0]} here, {light} in yaml')
for name, (n, _) in rows.items():
    if name not in yaml_colors:
        errs.append(f'{path}:{n}: color row {name} has no yaml color')


def luminance(hex_color):
    h = hex_color.lstrip('#')
    channels = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in channels]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def contrast(a, b):
    hi, lo = sorted((luminance(a), luminance(b)), reverse=True)
    return (hi + 0.05) / (lo + 0.05)


modes = ('light', 'dark', 'light, more contrast', 'dark, more contrast')
for n, fg, bg, ratios in pairs:
    if fg not in rows or bg not in rows:
        errs.append(f'{path}:{n}: unknown token in {fg} on {bg}')
        continue
    need = float(ratios[4].split(':')[0])
    for i, mode in enumerate(modes):
        ratio = contrast(rows[fg][1][i], rows[bg][1][i])
        shown = math.floor(ratio * 10) / 10
        if float(ratios[i].split(':')[0]) != shown:
            errs.append(f'{path}:{n}: {fg} on {bg} ({mode}) is {shown}:1, not {ratios[i]}')
        if ratio < need:
            errs.append(f'{path}:{n}: {fg} on {bg} ({mode}) is {ratio:.2f}:1, under {ratios[4]}')

if not yaml_colors:
    errs.append(f'{path}: no colors found in yaml blocks')
if not pairs:
    errs.append(f'{path}: no contrast pairs found')
print('\n'.join(errs) if errs else f'OK ({len(rows)} colors, {len(pairs)} pairs)')
sys.exit(1 if errs else 0)
````

`lint_summary.py` turns the linter's JSON report into a pass or a fail:

```python
#!/usr/bin/env python3
"""Summarize a `design.md lint` report.

Usage: lint_summary.py <lint.json> [allowed-warning-rule ...]
Prints each error and warning; exit 1 on any error, or on any warning whose
rule isn't named as allowed.
"""
import json
import sys

report = json.load(open(sys.argv[1], encoding='utf-8'))
allowed = set(sys.argv[2:])
bad = 0
for f in report['findings']:
    if f['severity'] not in ('error', 'warning'):
        continue
    ok = f['severity'] == 'warning' and f['rule'] in allowed
    bad += 0 if ok else 1
    print(f"{f['severity']} {f['rule']} {f.get('path', '')}: {f['message']}{' (allowed)' if ok else ''}")
s = report['summary']
print(f"{s['errors']} errors, {s['warnings']} warnings" + ('' if bad else ', OK'))
sys.exit(1 if bad else 0)
```

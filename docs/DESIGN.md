# Guessling design

How Guessling looks, moves, sounds, and reads: the design system and art
direction for the iPhone app, the paywall's styling, the three web pages,
the app icon, and the store and pitch assets. It follows Google's
[DESIGN.md format][gdm], so design and coding agents can read its tokens,
and it turns the [product's](/docs/PRODUCT.md) character into parts, poses,
and timings that the [technical requirements](/docs/TRD.md) build and the
[product requirements](/docs/PRD.md) test. Facts are as of September 22,
2026; every color, size, and duration this document sets is a design
decision.

Contents:

1.  [Overview](#overview)
1.  [Influences and trends](#influences-and-trends)
1.  [The Guessling](#the-guessling)
1.  [See also](#see-also)

## Overview

```yaml
version: alpha
name: Guessling
description: >-
  A daily 20-questions game for iPhone. A small marigold creature keeps the
  day's answer on a card and answers yes-or-no questions with its whole body.
```

### The reference

A card game on a blue table. The Guessling, a small marigold creature, keeps
the day's answer on a card, face down, and every question the player asks
goes down on an index card beside it, one line each, with the Guessling's
answer at the end. When the round ends, the Guessling turns the card over.

- **Why a reference.** Google's format says "Adjectives describe a region. A
  specific reference describes a point.", and Anthropic's design skill finds
  distinctive choices in "The subject's industry, subject matter, materials,
  and vernacular" ([trends notes][ft-gdm]). Twenty Questions is a parlor
  game with one secret; the card makes the secret something you can see.
- **Why this one.** A written-down answer is the product's promise: it was
  settled before anyone asked, and it's the same for everyone
  ([product principles][product-principles]).
- **What it gives each surface.** The table is the field, the index card
  holds the round, the answer card is the reveal, the archive is a box of
  past cards, and the icon is the Guessling with its "?".
- **Atmosphere.** A calm table and a lively character: the interface stays
  still and plain, so the Guessling's reactions carry the feeling, as
  Anthropic's skill puts it, "Spend your boldness in one place".

[ft-gdm]: /docs/research/frontend-trends.md#sections-and-tokens-in-the-specification
[product-principles]: /docs/PRODUCT.md#product-principles

### Principles

Each principle settles a trade-off.

- **The answer is the hero.** The latest answer's words, glyph, and pose are
  the biggest things on screen, and nothing moves behind them (ASK-2).
- **Every signal twice.** Each answer shows its words and a glyph, whatever
  the color, motion, sound, or haptic adds, so a round works in grayscale,
  on mute, with Reduce Motion, and with VoiceOver (A11Y-1, A11Y-3, A11Y-4).
- **Never in the way.** The words land within 100 ms of the answer, and no
  animation holds up the next question.
- **Kind on a miss.** A No or a wrong guess gets a friendly head shake,
  never a red flash, a buzzer, or a word that blames.
- **Native first.** System faces, SF Symbols, system sheets and bars,
  RevenueCat's native paywall, and Liquid Glass where iOS puts it. Custom
  drawing is kept for what is Guessling's own: the character, the notepad,
  and the turn meter.
- **Built in a day.** Every element has a version the team can ship on
  September 24, 2026, and polish can follow in an update, as the idea's art
  risk plans ([idea risks][idea-risks]).
- **Private by construction.** Nothing in the app or on the web pages loads
  a font, a script, or an image from a third party.

### Scope

- **In:** the app's screens and states, the Guessling, the paywall's
  styling, the `/privacy`, `/terms`, and `/support` pages, the app icon and
  launch screen, the App Store screenshots, the Devpost images, and the
  look of the demo video.
- **Out:** a landing page, since the App Store page is one; an iPad layout,
  since the app runs at phone size there (COMPAT-3); an image share card,
  since results share as text (SHARE-1); and any appearance setting inside
  the app.

## Influences and trends

Four notes, read on September 22, 2026, surveyed what's trending and what
applies:

- **motionsites.ai** sells prompts for motion-heavy landing pages. Of the
  483 of its prompts in the team's corpus, 52.0% build dark pages and 18.0%
  light ones, 70.6% use a video, and 35.6% use liquid glass or
  glassmorphism; its house pairing is Inter with Instrument Serif; and its
  newest prompts, from August 2026, are its longest, with exact tokens, "do
  not" lists, reduced motion, and acceptance checks
  ([motionsites.ai notes][ms-findings]).
- **The wider landscape.** Google introduced DESIGN.md with Stitch on March
  18, 2026, and opened its draft specification on April 21. Of the AI
  interface generators, only Bolt.new emits an Expo app. Anthropic's design
  skill lists five looks that generated design "clusters around", the first
  a warm cream background with a serif display and a terracotta accent.
  Apple's Liquid Glass and Google's Material 3 Expressive both moved motion
  to springs ([trends notes][ft-findings]).
- **iOS 26 and Expo SDK 57.** Liquid Glass belongs to controls; SDK 57
  pins Reanimated 4.5.1, `expo-glass-effect`, and `expo-symbols`; and four
  parts of the TRD's first plan, Dark Mode, the Reduce Motion fade, the
  audio mode, and text scaling, didn't work as written and are now fixed in
  the [TRD's iPhone app section][trd-app] ([iOS notes][ios-findings]).
- **Puzzle games and characters.** The daily games players know are silent
  and recognized by their colors; character apps nod on one axis and shake
  on another; and 🟩 and 🟥 nearly merge for deuteranopes
  ([game and character notes][game-findings]).

What Guessling does with them:

- **Adopted.**
  - A DESIGN.md with exact tokens, a short list of don'ts, and checks, as
    Google's format and the newest motionsites.ai prompts have.
  - Springs for every move, kept short, as Apple and Google now use.
  - One signature accent with one job: Marigold, for the Guessling and the
    primary action.
  - A named motion for each reaction.
  - A celebration recipe, a squash, a jump, and confetti, played once, on
    the solve.
  - The resting state as the final state, so no reaction disappears under
    Reduce Motion.
- **Adapted.**
  - Liquid Glass comes from the system; in Guessling's own views it's
    only on the composer, never on the character, the hint, or the
    answers.
  - Expressive type becomes heavy SF Pro Rounded for the Guessling's
    words: character without a bundled font.
  - Cinematic video becomes the demo video and the screenshots, never a
    background.
  - Dark-first becomes both appearances, following the system.
- **Rejected.**
  - Background video, parallax, scroll-driven reveals, custom cursors, and
    blur-in text: web habits, and a round is one screen.
  - Glass on every card, near-black pages, and purple or neon gradients:
    the sameness Anthropic, Google, and Webflow each warn about.
  - Inter with an italic serif display: the corpus's house pairing, and
    close to Anthropic's first generated look.
  - Idle loops: Apple asks for motion with a purpose, and WCAG 2.2.2 for a
    way to stop motion that runs past five seconds.
  - Copying prompts: motionsites.ai grants only "For personal & client
    work", so this document takes patterns from the notes, and the app
    ships no media or font that a prompt points to
    ([motionsites.ai license][ms-license]).

[ms-findings]: /docs/research/motionsites.md#findings-for-designmd
[ft-findings]: /docs/research/frontend-trends.md#findings-for-designmd
[trd-app]: /docs/TRD.md#the-iphone-app
[ios-findings]: /docs/research/ios-design.md#findings-for-designmd
[ms-license]: /docs/research/motionsites.md#license-and-terms
[game-findings]: /docs/research/game-design.md#findings-for-designmd

## The Guessling

The [product](/docs/PRODUCT.md#the-guessling-character) sets the
Guessling's role, personality, and voice; this section draws it.

### Parts of the Guessling

- **Silhouette.** A soft gumdrop a little taller than wide, 1 to 1.15, head
  and body in one, with a tuft on top curled into a "?". Filled solid, it
  must still read at 29 points, the icon's smallest size, because a
  character is recognized by its silhouette before its details
  ([game notes][game-silhouette]).
- **Color.** The body is Marigold (`primary`), with a Ballpoint outline a
  40th of its height, 4 points at the default 160; the eyes are white with
  Ballpoint pupils. No gradients or textures.
- **Parts, back to front.** Feet, body, arms (short nubs ending in round
  hands), mouth, eyes with lids, brows, and the tuft. Each part is its own
  layer, moved only by transforms and opacity, as the TRD animates it with
  Reanimated.
- **Face.** Large and simple, since the face does most of the work: two
  tall oval eyes set high, short rounded brows, and a small mouth. No line
  is thinner than 2 points at the default size.

[game-silhouette]: /docs/research/game-design.md#silhouette-and-staging

### Poses

Each pose is a set of part states, and each key pose reads as a still, so
it doubles as the Reduce Motion frame. Every pose appears with its words.

| Pose        | When                                                   | Key shape                                               | Moves along |
| ----------- | ------------------------------------------------------ | ------------------------------------------------------- | ----------- |
| Idle        | Between answers                                        | Upright, eyes forward, a small smile                    | Nothing     |
| Thinking    | An answer takes longer than 300 ms                     | Eyes up to one side, brows up, head tilted 6°           | A tilt      |
| Nod         | Yes                                                    | Dipped 8 points, eyes closed in happy arcs              | Vertical    |
| Head shake  | No, and a wrong guess                                  | Turned 10°, eyes open, a small kind smile               | Horizontal  |
| Shrug       | Ask another way, Ask a yes-or-no question, and picking | Arms up and out, palms up, brows up, head tilted 8°     | Shoulders   |
| Celebration | A right guess                                          | Arms up in a jump, the tuft straight as "!", mouth open | Up          |
| Resting     | The Guessling needs a rest (ASK-10)                    | Lids half closed, body lowered 4 points                 | Down        |
| Presenting  | The reveal of a round not solved                       | Holding the answer card out, in a small bow             | Forward     |

- **The signature.** The tuft turns from "?" to "!" on a solve and stays
  "!" on the end screen.
- **No loops.** After each reaction, the Guessling blinks once and returns
  to idle; nothing moves while it waits for the next question.
- **Kind poses.** The head shake is a friendly "no", like Duolingo's and
  Brilliant's characters, and a round not solved ends in the presenting
  bow, like Akinator's genie, never in a defeated pose
  ([game notes][game-signals]).

[game-signals]: /docs/research/game-design.md#how-characters-show-yes-no-unsure-and-delight

### The answer card

- **Shape.** A playing card, 5 to 7, in Index white with a Ballpoint
  outline and 12-point corners (`md`).
- **Back.** Table blue with a Marigold "?" in the middle.
- **Face.** The answer's name in `reveal` and the hint under it in `meta`,
  both in Ballpoint.
- **When.** Only at the end of a round, when the Guessling turns it over,
  as the end of a round under Screens describes.

### Making the art

- **Tool.** Any vector editor. Each part is exported as its own SVG, all
  drawn in one 200 × 230 view box so the parts line up, then drawn with
  `react-native-svg`, which SDK 57 bundles.
- **Who.** A teammate draws and poses the final parts. AI tools may explore
  the look first, and the write-up credits them, as the idea's safe default
  says ([idea open questions][idea-open]). The Shipaton rules ask for
  "original work product" that is "solely owned", and the US Copyright
  Office protects AI output only where a person set "sufficient expressive
  elements" ([game notes on AI art][game-ai]).
- **If the rig is late.** If it isn't ready by the end of September 23, the
  idea's trigger ([idea risks][idea-risks]), the app ships the eight key
  poses as stills with the 200 ms fade between them, and the rig follows in
  an update.
- **Not Rive or Lottie in version 1.0.** Both need a new tool, Rive's
  exports need a paid plan, and neither applies Reduce Motion for the app.
  Rive is the upgrade path if the poses ever need a state machine
  ([iOS notes on drawing the character][ios-character]).

[ios-character]: /docs/research/ios-design.md#drawing-and-animating-the-character
[game-ai]: /docs/research/game-design.md#ai-assisted-art-and-the-rules
[idea-open]: /docs/IDEA.md#assumptions-and-open-questions

## See also

- [Product](/docs/PRODUCT.md): the Guessling's role, personality, and voice.
- [Product requirements](/docs/PRD.md): the checks this design must pass.
- [Technical requirements](/docs/TRD.md): how the app draws and animates it.
- [Idea](/docs/IDEA.md): the schedule, the art risk, and the video.
- [motionsites.ai notes](/docs/research/motionsites.md),
  [trends notes](/docs/research/frontend-trends.md),
  [iOS notes](/docs/research/ios-design.md), and
  [game and character notes](/docs/research/game-design.md): the research
  behind these choices.
- [Google's DESIGN.md format][gdm]: the specification and the linter.

[gdm]: https://github.com/google-labs-code/design.md
[idea-risks]: /docs/IDEA.md#risks

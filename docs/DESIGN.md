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
1.  [Colors](#colors)
1.  [Typography](#typography)
1.  [Layout](#layout)
1.  [Elevation](#elevation)
1.  [Shapes](#shapes)
1.  [Components](#components)
1.  [Motion](#motion)
1.  [Sound and haptics](#sound-and-haptics)
1.  [Screens](#screens)
1.  [Words on screen](#words-on-screen)
1.  [Accessibility](#accessibility)
1.  [Web pages](#web-pages)
1.  [App icon and store assets](#app-icon-and-store-assets)
1.  [Do's and don'ts](#dos-and-donts)
1.  [Guidance for coding agents](#guidance-for-coding-agents)
1.  [Open questions](#open-questions)
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
  specific reference describes a point." ([trends notes][ft-gdm]), and
  Anthropic's design skill finds distinctive choices in "The subject's
  industry, subject matter, materials, and vernacular"
  ([trends notes][ft-anthropic]). Twenty Questions is a parlor game with one
  secret; the card makes the secret something you can see.
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
[ft-anthropic]: /docs/research/frontend-trends.md#anthropics-frontend-design-skill
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
  glassmorphism; its house pairing is Inter with Instrument Serif; and the
  corpus's newest, from August 2026, are its longest, with exact tokens, "do
  not" lists, reduced motion, and acceptance checks
  ([motionsites.ai notes][ms-findings]).
- **The wider landscape.** Google introduced DESIGN.md with Stitch on March
  18, 2026, and opened its draft specification on April 21. Of the AI
  interface generators, only Bolt.new emits an Expo app. Anthropic's design
  skill lists five looks that generated design "clusters around", the first
  a warm cream background with a serif display and a terracotta accent.
  Springs are the one motion trend Apple and Google share: SwiftUI animates
  with them by default, and Material 3 Expressive replaced its easing
  curves with them ([trends notes][ft-findings]).
- **iOS 26 and Expo SDK 57.** Liquid Glass belongs to controls; SDK 57
  pins Reanimated 4.5.1, `expo-glass-effect`, and `expo-symbols`; and five
  parts of the TRD's first plan, Dark Mode, the Reduce Motion fade, the
  audio mode, text scaling, and the paywall's images, needed fixes, which
  the [TRD's iPhone app section][trd-app] now has ([iOS notes][ios-findings]).
- **Puzzle games and characters.** The daily games players know are silent
  and recognized by their colors; character apps nod on one axis and shake
  on another; and 🟩 and 🟥 nearly merge for deuteranopes
  ([game and character notes][game-findings]).

What Guessling does with them:

- **Adopted.**
  - A DESIGN.md with exact tokens, a short list of don'ts, and checks, as
    Google's format and the newest motionsites.ai prompts have.
  - Springs for every move, kept short, as Apple and Google now use.
  - One signature accent with one meaning: Marigold is the Guessling, on
    its body, on the primary action, and on the right guess.
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
    defaults that Taste Skill and Anthropic's skill flag, part of the
    sameness Google and Webflow also warn about.
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

## The Guessling

The [product](/docs/PRODUCT.md#the-guessling-character) sets the
Guessling's role, personality, and voice; this section draws it.

### Parts of the Guessling

- **Silhouette.** A soft gumdrop a little taller than wide, 1 to 1.15, head
  and body in one, with a tuft on top curled into a "?". Filled solid, it
  must still read at the app icon's smallest sizes, because a character is
  recognized by its silhouette before its details
  ([game notes][game-silhouette]).
- **Color.** The body is Marigold (`primary`); the outline, pupils, brows,
  and mouth are Ballpoint on Marigold (`on-primary`), the outline a 40th of
  the height, 4 points at the default 160; the eye whites are Chalk
  (`on-desk`). These three don't change in Dark Mode, so the Guessling
  looks the same in every appearance. No gradients or textures.
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

| Pose        | When                                                   | Key shape                                                                                                              | Moves along |
| ----------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ----------- |
| Idle        | Between answers                                        | Upright, eyes forward, a small smile                                                                                   | Nothing     |
| Thinking    | An answer takes longer than 300 ms                     | Eyes up to one side, brows up, head tilted 6°                                                                          | A tilt      |
| Nod         | Yes                                                    | Dipped 8 points, eyes closed in happy arcs                                                                             | Vertical    |
| Head shake  | No, and a wrong guess                                  | Face slid 6 points to one side and body turned 3°, or 4 points and 2° for a wrong guess; eyes open, a small kind smile | Horizontal  |
| Shrug       | Ask another way, Ask a yes-or-no question, and picking | Arms up and out, palms up, brows up, head tilted 8°                                                                    | Shoulders   |
| Celebration | A right guess                                          | Arms up in a jump, the tuft straight as "!", mouth open                                                                | Up          |
| Resting     | The Guessling needs a rest (ASK-10)                    | Lids half closed, body lowered 4 points                                                                                | Down        |
| Presenting  | The reveal of a round not solved                       | Holding the answer card out, in a small bow                                                                            | Forward     |

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

- **Shape.** A playing card, 5 to 7, in Index white (`card`) with a
  Ballpoint (`ink`) outline and 12-point corners (`md`).
- **Back.** Table blue (`desk`) with a Marigold (`primary`) "?" in the
  middle.
- **Face.** The answer's name in `reveal` and the hint under it in `meta`,
  both in Ballpoint (`ink`).
- **Size.** As wide as the stage less 48 points, up to 280, and at least
  5 to 7 in shape. At large text it grows taller, and the name wraps
  between words rather than shrinking.
- **When.** Only at the end of a round, when the Guessling turns it over,
  as the end of a round under Screens describes.

### Making the art

- **Tool.** Any vector editor. Each part is exported as its own SVG, all
  drawn in one 200 × 230 view box so the parts line up, then drawn with
  `react-native-svg`, which SDK 57 bundles.
- **Who.** A teammate draws and poses the final parts. AI tools may explore
  the look first, and the write-up credits them. That narrows the idea's
  safe default, AI-assisted art credited openly
  ([idea open questions][idea-open]), because the Shipaton rules ask for
  "original work product" that is "solely owned", and the US Copyright
  Office protects AI output only where a person set "sufficient expressive
  elements" ([game notes on AI art][game-ai]).
- **If the rig is late.** If it isn't ready by the end of September 23, the
  idea's trigger ([idea risks][idea-risks]), the app ships the eight key
  poses as stills with the 200 ms fade between them, and the rig follows in
  an update.
- **Not Rive or Lottie in version 1.0.** Both need a new tool. Rive's
  exports need a paid plan, and Rive doesn't apply Reduce Motion by itself;
  a Lottie file honors it only through a reduced-motion marker of its own.
  Rive is the upgrade path if the poses ever need a state machine
  ([iOS notes on drawing the character][ios-character]).

[ios-character]: /docs/research/ios-design.md#drawing-and-animating-the-character

## Colors

The table is blue, the cards are white, and the ink is a dark blue-black,
like a ballpoint pen's. Marigold belongs to the Guessling and to the one
action that matters most on a screen. Green and red belong to answers, and
only to answers, the way NYT keeps its brand colors apart from its
gameplay colors ([game notes][game-findings]).

```yaml
colors:
  primary: '#FFC53D'
  on-primary: '#15203B'
  desk: '#2E5BD8'
  on-desk: '#FFFFFF'
  card: '#FFFFFF'
  ink: '#15203B'
  ink-muted: '#56617A'
  link: '#2248B5'
  rule: '#C9DAF2'
  rule-margin: '#F29BA6'
  yes: '#0E9C0C'
  yes-ink: '#12692C'
  yes-tint: '#E3F5E6'
  no: '#D72F18'
  no-ink: '#B3261E'
  no-tint: '#FCE7E4'
  unsure-ink: '#4E5870'
  unsure-tint: '#EDF0F5'
```

### Colors in every appearance

The format has no appearance modes, so the yaml above holds the light
values and this table holds all four. In code, each token becomes one
`DynamicColorIOS({ light, dark, highContrastLight, highContrastDark })`,
because Apple asks for light and dark values "and an increased contrast
option for each variant" ([iOS notes on color][ios-color]).

| Token         | Name                  | Role                                                            | Light     | Dark      | Light, more contrast | Dark, more contrast |
| ------------- | --------------------- | --------------------------------------------------------------- | --------- | --------- | -------------------- | ------------------- |
| `primary`     | Marigold              | The Guessling, primary buttons, and the right-guess pip         | `#FFC53D` | `#FFC53D` | `#FFC53D`            | `#FFC53D`           |
| `on-primary`  | Ballpoint on Marigold | Text and glyphs on Marigold                                     | `#15203B` | `#15203B` | `#0B1226`            | `#0B1226`           |
| `desk`        | Table blue            | The field behind everything                                     | `#2E5BD8` | `#0D1B40` | `#2248B5`            | `#08122E`           |
| `on-desk`     | Chalk                 | Text and symbols on the table                                   | `#FFFFFF` | `#FFFFFF` | `#FFFFFF`            | `#FFFFFF`           |
| `card`        | Index white           | The notepad, the speech bubble, the answer card, and pip glyphs | `#FFFFFF` | `#263353` | `#FFFFFF`            | `#212D4B`           |
| `ink`         | Ballpoint             | Text on cards                                                   | `#15203B` | `#F1F4FA` | `#0B1226`            | `#FFFFFF`           |
| `ink-muted`   | Pencil                | Secondary text, field borders, and empty pips                   | `#56617A` | `#B3BDD1` | `#3E4860`            | `#D3DAE7`           |
| `link`        | Link blue             | Links on cards                                                  | `#2248B5` | `#A9C1FF` | `#1A3A99`            | `#C8D7FF`           |
| `rule`        | Rule blue             | The notepad's lines, and its edge in Dark Mode                  | `#C9DAF2` | `#3B4B72` | `#93AEDA`            | `#5D6F98`           |
| `rule-margin` | Margin pink           | The line under the hint                                         | `#F29BA6` | `#A3546A` | `#D86677`            | `#C8778B`           |
| `yes`         | Yes green             | Yes pips and badges                                             | `#0E9C0C` | `#2FC42C` | `#0B7F0A`            | `#5BDB58`           |
| `yes-ink`     | Yes green, text       | The word "Yes"                                                  | `#12692C` | `#8BE39A` | `#0B5222`            | `#B0F2BA`           |
| `yes-tint`    | Yes green, fill       | Yes chips                                                       | `#E3F5E6` | `#1F4630` | `#D2EED8`            | `#183A27`           |
| `no`          | No red                | No and wrong-guess pips and badges                              | `#D72F18` | `#F0543C` | `#B42212`            | `#FF7A66`           |
| `no-ink`      | No red, text          | "No" and "Not it"                                               | `#B3261E` | `#FFA396` | `#8E1B14`            | `#FFC4BC`           |
| `no-tint`     | No red, fill          | No and wrong-guess chips                                        | `#FCE7E4` | `#522A31` | `#F8D6D1`            | `#44222A`           |
| `unsure-ink`  | Stone                 | The free replies' words and badges                              | `#4E5870` | `#CAD2E0` | `#3A4359`            | `#E4E8F0`           |
| `unsure-tint` | Stone, fill           | The free replies' chips                                         | `#EDF0F5` | `#33405F` | `#E1E6EE`            | `#2C3857`           |

- **The system decides.** The app follows the iPhone's appearance, with
  `userInterfaceStyle: 'automatic'` in its configuration, and has no
  appearance setting of its own, as Apple asks: "Avoid offering an
  app-specific appearance setting." Increase Contrast switches to the last
  two columns by itself ([iOS notes on Dark Mode][ios-dark]).
- **No pure black or white glare.** The dark table is a deep blue, not
  black, and the dark cards are a lighter blue-gray, with a 1-point `rule`
  edge to set them off from the table.
- **No system accent colors for text.** Apple's default accents reach only
  1.5 to 5.1 to 1 on white, so text uses the tokens above
  ([iOS notes on system colors][ios-system-colors]).

[ios-color]: /docs/research/ios-design.md#semantic-and-system-colors
[ios-dark]: /docs/research/ios-design.md#dark-mode-in-the-app-config
[ios-system-colors]: /docs/research/ios-design.md#semantic-and-system-colors

### Contrast

Each ratio is WCAG 2.2's, truncated to one decimal so none is rounded up to
pass. Text needs 4.5 to 1 in every appearance, and 7 to 1 for questions and
body text, as Apple asks for small text; glyphs, pips, and the Guessling
need 3 to 1 against what's next to them (A11Y-5; [iOS notes][ios-wcag]).

| Text or mark | On            | Used for                                                               | Light  | Dark   | Light, more contrast | Dark, more contrast | At least |
| ------------ | ------------- | ---------------------------------------------------------------------- | ------ | ------ | -------------------- | ------------------- | -------- |
| `ink`        | `card`        | Questions, body text, and the right-guess pip's ring                   | 16.1:1 | 11.3:1 | 18.6:1               | 13.6:1              | 7:1      |
| `ink-muted`  | `card`        | Secondary text, field borders, and empty pips                          | 6.2:1  | 6.6:1  | 9.1:1                | 9.6:1               | 4.5:1    |
| `link`       | `card`        | Links, and the switches' "on" track                                    | 7.8:1  | 6.9:1  | 9.9:1                | 9.4:1               | 4.5:1    |
| `on-desk`    | `desk`        | The top bar, titles, and symbols on the table                          | 5.8:1  | 16.8:1 | 7.8:1                | 18.4:1              | 4.5:1    |
| `on-primary` | `primary`     | Primary buttons; the right-guess chip, badge, and pip; the Guess label | 10.2:1 | 10.2:1 | 11.7:1               | 11.7:1              | 4.5:1    |
| `yes-ink`    | `yes-tint`    | Yes chips                                                              | 5.9:1  | 6.8:1  | 7.5:1                | 9.7:1               | 4.5:1    |
| `no-ink`     | `no-tint`     | No and wrong-guess chips                                               | 5.5:1  | 6.3:1  | 6.7:1                | 9.2:1               | 4.5:1    |
| `unsure-ink` | `unsure-tint` | Free-reply chips and banners                                           | 6.2:1  | 6.7:1  | 7.8:1                | 9.4:1               | 4.5:1    |
| `yes-ink`    | `card`        | "Yes" in the speech bubble                                             | 6.8:1  | 8.0:1  | 9.3:1                | 10.5:1              | 4.5:1    |
| `no-ink`     | `card`        | "No" and "Not it" in the speech bubble                                 | 6.5:1  | 6.5:1  | 9.0:1                | 8.9:1               | 4.5:1    |
| `unsure-ink` | `card`        | Free replies in the bubble, and Stone badges                           | 7.1:1  | 8.2:1  | 9.8:1                | 11.0:1              | 4.5:1    |
| `card`       | `yes`         | A Yes pip's or badge's glyph, and the pip against the notepad          | 3.6:1  | 5.3:1  | 5.1:1                | 7.6:1               | 3:1      |
| `card`       | `no`          | A No pip's or badge's glyph and edge, and a wrong-guess ring           | 4.8:1  | 3.5:1  | 6.6:1                | 5.3:1               | 3:1      |
| `primary`    | `desk`        | The Guessling against the table                                        | 3.6:1  | 10.6:1 | 4.9:1                | 11.7:1              | 3:1      |

[ios-wcag]: /docs/research/ios-design.md#wcag-22-contrast-minimums

### Answer colors

- **From the share.** Yes and No take the hues of the share's 🟩 and 🟥,
  measured at `#10B50E` and `#D72F18` ([game notes][game-squares]), so a
  round and its share read alike. The light Yes is a shade darker,
  `#0E9C0C`, so a Yes pip still clears 3 to 1 on white.
- **Never color alone.** 🟩 and 🟥 nearly merge for deuteranopes, at a
  ΔE00 of 8.9, so every answer also shows a glyph and its words, as in
  Apple's own example of a check in a green circle beside an X in a red
  octagon (A11Y-4):

| Answer                                        | Glyph (SF Symbol) | Colors                               |
| --------------------------------------------- | ----------------- | ------------------------------------ |
| Yes                                           | `checkmark`       | `yes`, `yes-ink`, `yes-tint`         |
| No                                            | `xmark`           | `no`, `no-ink`, `no-tint`            |
| A wrong guess                                 | `xmark`           | `no`, `no-ink`, `no-tint`, as a ring |
| A right guess                                 | `target`          | `primary`, `on-primary`              |
| Ask another way, and Ask a yes-or-no question | `questionmark`    | `unsure-ink`, `unsure-tint`          |

- **Neither green nor red.** Marigold marks only the right guess, the
  Guessling's own moment, and never a Yes or a No; Stone, for the replies
  that use no turn, is plainly neither.

[game-squares]: /docs/research/game-design.md#the-share-squares-measured

## Typography

Guessling uses the iPhone's own faces and bundles none:

- **SF Pro Rounded**, as `ui-rounded`: the Guessling's words, the hint,
  titles, buttons, chips, and counts. Apple made the rounded faces "to
  coordinate text with the appearance of soft or rounded UI elements, or to
  provide an alternative typographic voice", which suits a soft character.
- **SF Pro**, as `system-ui`: questions, the notice, lists, and everything
  read at length.
- **Why system faces.** They come with the device and need no download. A
  bundled face would add its license text to the app and an upload to
  RevenueCat for the paywall ([iOS notes on fonts][ios-fonts]).

```yaml
typography:
  reply:
    fontFamily: ui-rounded
    fontSize: 28px
    fontWeight: 800
    lineHeight: 34px
  reveal:
    fontFamily: ui-rounded
    fontSize: 34px
    fontWeight: 800
    lineHeight: 41px
  hint:
    fontFamily: ui-rounded
    fontSize: 22px
    fontWeight: 700
    lineHeight: 28px
  title:
    fontFamily: ui-rounded
    fontSize: 28px
    fontWeight: 700
    lineHeight: 34px
  body:
    fontFamily: system-ui
    fontSize: 17px
    fontWeight: 400
    lineHeight: 22px
  body-strong:
    fontFamily: system-ui
    fontSize: 17px
    fontWeight: 600
    lineHeight: 22px
  button:
    fontFamily: ui-rounded
    fontSize: 17px
    fontWeight: 700
    lineHeight: 22px
  chip:
    fontFamily: ui-rounded
    fontSize: 15px
    fontWeight: 700
    lineHeight: 20px
  meta:
    fontFamily: system-ui
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18px
  count:
    fontFamily: ui-rounded
    fontSize: 22px
    fontWeight: 700
    lineHeight: 28px
    fontFeature: '"tnum"'
  caption:
    fontFamily: system-ui
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
```

Each token follows the Dynamic Type curve of one of Apple's text styles,
through React Native's `dynamicTypeRamp`, so it grows the way the system's
text does. Without a ramp, React Native multiplies every size by one factor,
which would take a 34-point title to about 121 points at the largest
accessibility size, where Apple's Large Title is 60 ([iOS notes on text
scaling][ios-scaling]).

| Token         | Used for                                   | `dynamicTypeRamp` | At AX5 |
| ------------- | ------------------------------------------ | ----------------- | ------ |
| `reply`       | The Guessling's words in the speech bubble | `title1`          | 58/68  |
| `reveal`      | The answer's name on the card              | `largeTitle`      | 60/70  |
| `hint`        | The hint on the notepad                    | `title2`          | 56/66  |
| `title`       | Titles in the app's own views              | `title1`          | 58/68  |
| `body`        | Questions, the notice, and list rows       | `body`            | 53/62  |
| `body-strong` | Row titles and emphasis                    | `headline`        | 53/62  |
| `button`      | Button labels                              | `headline`        | 53/62  |
| `chip`        | Answer chips                               | `subheadline`     | 49/58  |
| `meta`        | The date, turns left, labels, and footers  | `footnote`        | 44/52  |
| `count`       | The countdown and the statistics           | `title2`          | 56/66  |
| `caption`     | Legal lines                                | `caption1`        | 43/51  |

- **Never cut off.** No text sets `allowFontScaling={false}`,
  `numberOfLines`, or a fixed height, and from AX1, when the font scale
  reaches 1.786, rows stack their parts (A11Y-2).
- **Weights.** Regular, Semibold, Bold, and Heavy only; no Thin or Light.
  React Native 0.86's font code doesn't read Bold Text, so the app follows
  `AccessibilityInfo`'s `boldTextChanged` and steps every weight up one
  level while it's on. Whether system text also thickens by itself isn't
  documented, so check on a device first, and drop the step if it does.
- **Figures.** Counts use tabular figures, `fontVariant: ['tabular-nums']`,
  so the countdown doesn't jitter.
- **Sizes.** Body text is 17 points, and nothing is under 11 at the default
  size, Apple's floor.
- **Case.** Sentence case everywhere, no all-caps labels, and no italics.
- **Marketing art.** Screenshot captions, the Devpost thumbnail, and the
  video's title cards are set in [Nunito][nunito], a rounded face under the
  SIL Open Font License, since Apple licenses its fonts only for "creating
  mock-ups of user interfaces". Nunito never ships in the app or loads on
  the web pages.

[ios-fonts]: /docs/research/ios-design.md#system-fonts-and-their-licenses
[ios-scaling]: /docs/research/ios-design.md#how-react-native-scales-text
[nunito]: https://github.com/google/fonts/tree/main/ofl/nunito

## Layout

```yaml
spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  margin: 16px
  hit: 44px
```

Sizes are points: the format's `px` means a point on the iPhone.

- **Grid.** Everything sits on a 4-point grid, 16 points from the screen's
  edges and inside cards.
- **Hit targets.** Every control is at least 44 by 44 points, even when it
  looks smaller, as Apple asks.
- **Today in three bands**, top to bottom:
  - **The table**: the top bar, then the stage, where the Guessling stands
    above its speech bubble.
  - **The notepad**: the hint, the turn meter, and the history, which
    scrolls.
  - **The composer**, pinned above the keyboard or the home indicator.
- **Short screens.** On screens under 700 points tall, the Guessling is
  120 points tall instead of 160.
- **With the keyboard up**, the stage turns compact: the Guessling shrinks
  to 64 points in one row with its bubble, so the newest answers stay in
  view above the composer.
- **Large text.** From AX1, the stage stays compact, history rows put the
  chip under the question, the composer stacks, and the whole screen
  scrolls; nothing truncates (A11Y-2).
- **Screens.** Laid out for 390 × 844 points, and checked at 375 × 667 and
  at 440 × 956, the 6.9-inch size, and on an iPad at phone size
  (COMPAT-3).
- **Safe areas.** Content stays inside them, and the table's color runs
  under the status bar and the home indicator.

## Elevation

- **Depth by color.** The table is the floor; the notepad and the speech
  bubble are Index white on it; the answer card sits highest, with the only
  large shadow.
- **Shadows.** Two, tinted with Ballpoint, never gray: the answer card's,
  `0 8 24` at 25%, and the composer's fallback, `0 2 8` at 12%.
- **Liquid Glass from the system.** "Standard components like bars, sheets,
  popovers, and controls" take it on iOS 26 and 27 by themselves. The app
  sets no opt-out: Apple calls `UIDesignRequiresCompatibility` a key to
  "Temporarily use", and ignores it once an app builds with the iOS 27 SDK,
  which uploads need from April 2027 ([iOS notes on the key][ios-key]).
- **Liquid Glass in Guessling's views.** Only the composer, a capsule of
  regular `GlassView` from `expo-glass-effect` on iOS 26 and later, which
  floats over the notepad. Its send button is the one colored thing on it,
  in Marigold, since Apple says "To emphasize primary actions, apply color
  to the background rather than to symbols or text"
  ([iOS notes on color on glass][ios-glass-color]).
- **The fallback.** On iOS 16.4 to 18, where `GlassView` draws nothing, and
  whenever `AccessibilityInfo.isReduceTransparencyEnabled()` is true, the
  composer is an Index white capsule with a 1-point Pencil border and its
  shadow; the app follows `reduceTransparencyChanged`.
- **Never fade glass.** Opacity under 1 on a `GlassView` or any parent can
  make the glass look wrong or vanish, so the composer leaves by moving,
  never by fading ([iOS notes on glass views][ios-glass-views]).
- **Never glass on content.** Not on the Guessling, the hint, the notepad,
  the chips, or the answer card: "Don't use Liquid Glass in the content
  layer."
- **Headers.** Today draws its own top bar on the table. Archive and
  Settings use Expo Router's opaque large-title header in Table blue, with
  the title and items in Chalk, on every iOS version. A transparent header
  would let white cards scroll under Chalk text at close to 1 to 1
  ([iOS notes on headers][ios-headers]).

[ios-key]: /docs/research/ios-design.md#the-compatibility-key
[ios-glass-views]: /docs/research/ios-design.md#glass-views-in-expo
[ios-headers]: /docs/research/ios-design.md#headers-sheets-and-tabs-in-expo-router
[ios-glass-color]: /docs/research/ios-design.md#color-and-controls-on-glass

## Shapes

```yaml
rounded:
  pip: 4px
  sm: 8px
  md: 12px
  lg: 20px
  full: 9999px
```

- **Capsules** for buttons, chips, the composer, and the speech bubble,
  with "a radius that's half the height"
  ([iOS notes on glass in controls][ios-glass-controls]).
- **Cards.** The notepad has `lg` corners at the top and runs off the
  bottom of the screen; list groups are `lg`; the answer card is `md`.
- **Pips** are `pip`.
- **Concentric.** A shape inside another takes the outer radius minus the
  padding between them, as Apple's layouts do.
- **Soft everywhere.** No sharp corners, and no square and round corners
  in the same view.

[ios-glass-controls]: /docs/research/ios-design.md#glass-in-custom-controls

## Components

```yaml
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.button}'
    rounded: '{rounded.full}'
    height: 50px
  button-secondary:
    backgroundColor: '{colors.card}'
    textColor: '{colors.ink}'
    typography: '{typography.button}'
    rounded: '{rounded.full}'
    height: 50px
  top-bar:
    backgroundColor: '{colors.desk}'
    textColor: '{colors.on-desk}'
    typography: '{typography.meta}'
  speech-bubble:
    backgroundColor: '{colors.card}'
    textColor: '{colors.ink}'
    typography: '{typography.reply}'
    rounded: '{rounded.lg}'
    padding: 12px
  notepad:
    backgroundColor: '{colors.card}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.lg}'
    padding: 16px
  notepad-meta:
    backgroundColor: '{colors.card}'
    textColor: '{colors.ink-muted}'
    typography: '{typography.meta}'
  notepad-rule:
    backgroundColor: '{colors.rule}'
    height: 1px
  hint-rule:
    backgroundColor: '{colors.rule-margin}'
    height: 2px
  list-row:
    backgroundColor: '{colors.card}'
    textColor: '{colors.ink}'
    typography: '{typography.body-strong}'
    rounded: '{rounded.lg}'
    height: 44px
  link:
    backgroundColor: '{colors.card}'
    textColor: '{colors.link}'
    typography: '{typography.body}'
  chip-yes:
    backgroundColor: '{colors.yes-tint}'
    textColor: '{colors.yes-ink}'
    typography: '{typography.chip}'
    rounded: '{rounded.full}'
    height: 28px
  chip-no:
    backgroundColor: '{colors.no-tint}'
    textColor: '{colors.no-ink}'
    typography: '{typography.chip}'
    rounded: '{rounded.full}'
    height: 28px
  chip-unsure:
    backgroundColor: '{colors.unsure-tint}'
    textColor: '{colors.unsure-ink}'
    typography: '{typography.chip}'
    rounded: '{rounded.full}'
    height: 28px
  chip-right:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.chip}'
    rounded: '{rounded.full}'
    height: 28px
  pip-yes:
    backgroundColor: '{colors.yes}'
    rounded: '{rounded.pip}'
    size: 14px
  pip-no:
    backgroundColor: '{colors.no}'
    rounded: '{rounded.pip}'
    size: 14px
  pip-right:
    backgroundColor: '{colors.primary}'
    rounded: '{rounded.pip}'
    size: 14px
  composer:
    backgroundColor: '{colors.card}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.full}'
    height: 50px
  answer-card:
    backgroundColor: '{colors.card}'
    textColor: '{colors.ink}'
    typography: '{typography.reveal}'
    rounded: '{rounded.md}'
```

Each entry gives a component's light colors; the Colors table gives the
rest. A pip's glyph is Index white (`card`) and a wrong-guess pip is an
Index white square with a 2-point No red ring, which the format has no
property for.

### Buttons

- **Primary.** A Marigold capsule, 50 points tall, with its label in
  `button`, Ballpoint; full width in sheets and on the end screen. At most
  one per screen, within Apple's "Keep the number of prominent buttons to
  one or two per view."
- **Secondary.** An Index white capsule with a 1-point Pencil border on
  cards; on the table it needs no border.
- **Symbol buttons.** A symbol in Chalk on the table, or Ballpoint on a
  card, in a 44-point hit area, each with an accessibility label.
- **Press.** Every custom button scales to 0.97 with `snap` while pressed
  and springs back; a disabled one shows at 40% opacity and doesn't
  respond.

### The speech bubble

- **Where.** An Index white card with `lg` corners, as wide as the stage,
  under the Guessling, with a small tail pointing up to it. In the compact
  stage it sits beside the Guessling, with its tail to the side.
- **What it holds.** The latest reply: a 22-point badge, a circle in the
  answer's color with the glyph in Index white, then the words, colored
  `yes-ink`, `no-ink`, or `unsure-ink`. For a right guess, the badge is
  Marigold with its `target` in `on-primary` and a 1.5-point `ink` ring,
  like the pip, and the words are Ballpoint.
- **Two sizes of words.** Replies of up to 15 characters, such as "Yes",
  "Not it", and "Ask another way", are set in `reply`; longer ones, such as
  "Ask a yes-or-no question" and the resting reply, in `hint`, so a reply
  takes at most two lines at the default size. Before the first question
  the bubble says "I’m thinking of something." in `hint`, Ballpoint, with
  no badge.
- **Growing.** The bubble grows to fit its words and never truncates them;
  at large text, the stage scrolls with the screen.
- **Waiting.** After 300 ms without an answer, three dots in Stone pulse in
  opacity, which isn't motion, until the answer comes (ASK-8).
- **For VoiceOver.** The Guessling and its bubble are one element, labeled
  with the reply's words.

### Answer chips

- **Where.** At the trailing end of each history row.
- **Anatomy.** A capsule 28 points tall at the default size: the glyph, 13
  points and semibold, then the words in `chip`.
- **Styles.** `chip-yes` for Yes, `chip-no` for No and for "Not it",
  `chip-unsure` for the free replies, and `chip-right` for "You got it!".
  The glyphs are the ones in [Answer colors](#answer-colors).
- **Pending.** A question just sent shows a Stone chip with "…" until the
  answer arrives, and after a timeout the chip becomes a "Send again"
  button (ASK-8, STATE-1).

### The turn meter

- **What.** Twenty pips in two rows of ten, like the share, on the notepad
  under the hint, with "14 turns left" beside them in `meta` (TODAY-1). A
  pip fills only when a turn is used, so free replies fill none (ASK-3).
- **Pips.** 14 points at the default size, 4 apart, with `pip` corners:
  - Empty: a 1.5-point Pencil ring, for a turn not yet used.
  - Yes: `yes`, with an Index white `checkmark`.
  - No: `no`, with an Index white `xmark`.
  - A wrong guess: Index white with a 2-point `no` ring and a `no`
    `xmark`, like the share's ❌.
  - The right guess: Marigold with a `target` in `on-primary`, like the
    share's 🎯, and a 1.5-point `ink` ring, since Marigold on Index white is
    only 1.5 to 1.
- **Large text.** Pips grow with the text up to 1.6 times, and from AX1
  the meter wraps into four rows of five.
- **For VoiceOver.** One element: "6 of 20 turns used: 4 Yes, 1 No, 1 wrong
  guess. 14 turns left."

### The notepad

- **Card.** Index white, `lg` corners at the top, 16 points of padding, and
  a 1-point `rule` edge in Dark Mode; it runs under the composer to the
  bottom of the screen.
- **Header.** The hint in `hint`, in curly quotes as in the share: “An
  animal”. Then the turn meter, then a 2-point Margin pink line.
- **Rows.** The question in `body`, Ballpoint, and its chip; at least 44
  points tall, with 1-point Rule blue lines between rows; oldest first,
  with the newest kept in view (ASK-11).
- **Guesses.** "Guess" in `meta`, then the name the player guessed, and its
  chip.
- **Reporting.** Tapping a row opens an action sheet with "Report this
  answer", then a choice of reason, "Wrong", "Unclear", or "No reason",
  since REPORT-1 makes the reason optional. Once sent, the row shows
  "Reported" in `meta` under the chip (REPORT-1, REPORT-3). VoiceOver offers
  the same as a custom action. Rows for picking and resting have no report
  action, since a report carries an answer, and those aren't answers.

### The composer

- **Asking.** A capsule 50 points tall, floating 16 points from the edges
  over the notepad: a Guess button on the leading side, a `target` and the
  word "Guess" in the secondary style; the field, "Ask a yes-or-no
  question"; and a Marigold send button with an `arrow.up` once there's
  text (ASK-1).
- **Guessing.** Guess turns the field into "Name the thing", with a
  "Guess" label inside it in the `chip-right` style, a 60-character limit,
  and the line "A guess uses a turn." above the composer; the send button
  shows a `target`. An `xmark.circle.fill` button returns to asking
  (GUESS-1, GUESS-3).
- **Counts.** Characters left show in `meta` from 120 of 140 for a question
  and from 50 of 60 for a guess.
- **Pending.** While an answer is pending, the field, Guess, and the
  question list are disabled (ASK-8).
- **AI answers off.** With the field empty, a Questions button with
  `list.bullet` replaces send and opens the searchable list (ASK-9).
- **Large text.** From AX1 the composer stacks: the field on its own line,
  growing with its text, and under it Guess, with its symbol and word, and
  send.
- **Surface.** Glass, or its fallback; see [Elevation](#elevation).

### Symbols

SF Symbols through `expo-symbols`, monochrome in the text's color, sized
with the text by the font scale, since `expo-symbols` doesn't follow Dynamic
Type:

| Use                                 | Symbol                |
| ----------------------------------- | --------------------- |
| Yes                                 | `checkmark`           |
| No, and a wrong guess               | `xmark`               |
| The free replies                    | `questionmark`        |
| A right guess, and the Guess button | `target`              |
| Picking from the list               | `list.bullet`         |
| Resting                             | `moon.zzz`            |
| Send                                | `arrow.up`            |
| Leave guess mode                    | `xmark.circle.fill`   |
| Share                               | `square.and.arrow.up` |
| Archive                             | `calendar`            |
| Settings                            | `gearshape`           |
| A locked puzzle                     | `lock.fill`           |
| Report                              | `flag`                |
| Offline                             | `wifi.slash`          |
| Try again                           | `arrow.clockwise`     |

- **iOS 16.4.** Each symbol must exist on iOS 16.4, where a missing one
  draws nothing, and no meaning rides on a symbol effect, since iOS 16
  plays none.
- **Never as art.** Apple's license bars symbols, "or images that are
  confusingly similar", from app icons, logos, "or any other trademarked
  use", so none goes into the icon, the Guessling, or the paywall's images
  ([iOS notes on the symbol license][ios-symbols-license]).

[ios-symbols-license]: /docs/research/ios-design.md#sf-symbols-license-terms

### Banners

- **What.** One line above the composer for a state that isn't an answer:
  offline, busy, a timeout, or an error. It's a Stone capsule with its
  symbol, its words from the state table under Screens, and its action,
  such as "Send again".
- **Rules.** One banner at a time; it stays until its state ends, with no
  timer; VoiceOver announces it when it appears.

## Motion

```yaml
motion:
  lead:
    duration: 120
    easing: outCubic
  snap:
    duration: 200
    dampingRatio: 0.8
  settle:
    duration: 350
    dampingRatio: 1
  nod:
    duration: 250
    dampingRatio: 0.35
  shake:
    duration: 300
    dampingRatio: 0.3
  shrug:
    duration: 160
    dampingRatio: 1
  hop:
    duration: 320
    dampingRatio: 0.45
  fade:
    duration: 200
    easing: inOutQuad
```

- **Springs.** Each spring token is a duration-based `withSpring` in
  Reanimated 4.5.1, whose duration is perceptual: "Actual duration is 1.5
  times the value of perceptual duration." A damping ratio of 1 doesn't
  bounce; lower ones do, and only the character's moves go below 0.8
  ([iOS notes on springs][ios-springs]).
- **Timings.** `lead` and `fade` are `withTiming`; the fade is for opacity
  and color only, and it's the motion the app plays under Reduce Motion.
- **The app decides.** Every animation sets `reduceMotion` to
  `ReduceMotion.Never`, because the app itself picks the full or the
  reduced version from the live setting; see
  [Reduce Motion](#reduce-motion):

  ```ts
  withSpring(value, { duration: 350, dampingRatio: 1, reduceMotion: ReduceMotion.Never }) // settle
  withTiming(value, { duration: 120, easing: Easing.out(Easing.cubic), reduceMotion: ReduceMotion.Never }) // lead
  withTiming(value, { duration: 200, easing: Easing.inOut(Easing.quad), reduceMotion: ReduceMotion.Never }) // fade
  ```

- **Only transform and opacity** animate, never layout; and no Reanimated
  CSS animations or transitions, which ignore Reduce Motion.

[ios-springs]: /docs/research/ios-design.md#springs-and-layout-animations

### Reactions

At 0 ms, when the answer arrives, everything that carries meaning lands at
once: the bubble's badge and words swap in with `snap`, from 92% to full
size; the chip fills in; the pip pops in with `snap`; the haptic fires; the
sound starts; and VoiceOver announces the words. Then the body moves:

| Reaction    | The moves                                                                                                                                                                                                                        | About  |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Nod         | Dips 8 points with `lead`, then springs back with `nod`, whose overshoot makes a second, smaller nod; eyes close to arcs                                                                                                         | 500 ms |
| Head shake  | Slides the face 6 points with `lead` as the body turns 3°, then springs back with `shake`, swinging past center and back; 4 points and 2° for a wrong guess                                                                      | 550 ms |
| Shrug       | Arms and brows up with `shrug`, a head tilt of 8°, a 200 ms hold, then down with `snap`                                                                                                                                          | 750 ms |
| Celebration | Squashes to 92% with `lead`, hops 40 points with `hop`, the tuft fades from "?" to "!" at the top, and lands in a squash to 95%; 24 pieces of confetti in Marigold, Yes green, Table blue, and Index white fall for 900 ms, once | 1.2 s  |
| Thinking    | After 300 ms without an answer, eyes and brows move with `settle`                                                                                                                                                                | 500 ms |
| Resting     | Lids and body settle with `settle`                                                                                                                                                                                               | 500 ms |

- **Anchored, not measured.** No maker states how long a nod or a shrug
  should take, so these follow the notes' starting values: Wordle's shake
  is 600 ms and its win bounce 1,000 ([game notes on timing][game-timing]).
- **Never in the way.** The field is usable the moment an answer arrives;
  a new answer cuts the running reaction short and starts its own from the
  current pose.
- **One blink** ends each reaction, then idle.

[game-timing]: /docs/research/game-design.md#reaction-durations

### Reduce Motion

- **What changes.** Each reaction becomes a 200 ms `fade` from the current
  pose to the reaction's key pose, drawn as two stacked copies of the rig;
  there's no hop and no confetti; pips and the bubble's words fade in
  instead of popping; and the stage, the rows, and the answer card change
  by fading, never by moving (A11Y-3).
- **Reading the setting.** The app reads `AccessibilityInfo`'s
  `isReduceMotionEnabled()` and follows `reduceMotionChanged`, because
  `useReducedMotion()` keeps the value it had at launch.
- **Opting out of Reanimated's switch.** Every animation, full or reduced,
  sets `ReduceMotion.Never`. Reanimated's default, `ReduceMotion.System`,
  keeps the setting from launch, makes a fade jump to its end, and shows
  nothing of a nod built from a sequence
  ([iOS notes on Reduce Motion][ios-reduce-motion]).
- **Screens.** Native transitions cross-fade under Reduce Motion by
  themselves.

[ios-reduce-motion]: /docs/research/ios-design.md#reduce-motion-in-reanimated

### Screen motion

- **The stage** turns compact and back with `settle`, by scale and
  translation.
- **A new history row** fades in rising 8 points with `settle`; only the
  fade under Reduce Motion.
- **The end of a round.** The last reaction plays in full and holds for 1.5
  seconds; the composer moves down off the screen with `settle`; the answer
  card turns over, a 180° turn about its vertical axis in 500 ms with
  `settle`, its face showing from 90°; and the result, the share row, and
  the buttons rise into place, 60 ms apart.
- **The end of a round under Reduce Motion.** The card fades from back to
  face, and the rest fades in together. The composer can neither move nor
  fade, so its glass turns off through `glassEffectStyle`'s own animation,
  set to `none`, and then the composer is removed; without glass, it's
  removed at once.
- **Presses** use `snap`.

## Sound and haptics

- **Four sounds**, each a soft mallet on wood and felt, like a card tapped
  on the table:
  - **Yes**: two rising notes, under 300 ms.
  - **No**: two falling notes, under 300 ms; never a buzzer. A wrong guess
    plays it too.
  - **Shrug**: one wavering note, under 300 ms, for the free replies.
  - **Solve**: four rising notes and a soft chime, under 1.2 seconds.
  - Picking, resting, banners, and errors are silent.
- **Where they come from.** Made by the team, or taken from a CC0 source
  whose link sits in a text file beside each sound, since Apple asks for
  content "that you created or that you have a license to use" ([game
  notes on AI art][game-ai]).
- **The audio mode.** Sounds play in the ambient category, so the silent
  switch mutes them and the player's music keeps playing, as the TRD's
  [reactions section][trd-reactions] sets up: `setAudioModeAsync` with
  `playsInSilentMode` false and `interruptionMode` set to `mixWithOthers`
  before the first sound, and the expo-audio plugin with
  `enableBackgroundPlayback` and `microphonePermission` false
  ([iOS notes on sounds][ios-sounds]).
- **Haptics.** A light impact with each Yes, No, wrong guess, and free
  reply; a success notification with the solve; nothing for picking,
  resting, banners, or errors. No warning or error pattern for a No, which
  isn't an error, and nothing that only a haptic says, since iOS skips
  haptics in Low Power Mode ([iOS notes on haptics][ios-haptics]).
- **Timing.** The haptic and the sound start at 0 ms, with the words.
- **Switches.** Sound and Haptics in Settings, both on by default (SET-2).
  The round is complete without either.

[trd-reactions]: /docs/TRD.md#reactions-sound-and-haptics
[ios-sounds]: /docs/research/ios-design.md#short-sounds-in-expo
[ios-haptics]: /docs/research/ios-design.md#haptics-in-expo

## Screens

The TRD's [screens and navigation][trd-screens] set the routes; this is what
each one shows, top to bottom.

[trd-screens]: /docs/TRD.md#screens-and-navigation

### Today

(TODAY-1, ASK-1 to ASK-12, GUESS-1 to GUESS-4)

1.  **The top bar**, on the table: the puzzle's number and date in `meta`,
    Chalk, such as "#12 · Friday, September 25", or "#3 · Starter"; then
    the Archive (`calendar`) and Settings (`gearshape`) buttons on the
    trailing side.
1.  **The stage**, on the table: the Guessling, 160 points tall, with its
    speech bubble under it holding the latest reply.
1.  **The notepad**: the hint, the turn meter, the Margin pink line, and the
    history.
1.  **The composer**, over the notepad's lower edge.

While today's puzzle loads, the bubble says "Getting today’s puzzle", the
notepad's lines are drawn empty, and nothing else moves; it's never an empty
screen (STATE-4).

### Every answer, drawn

Each answer from the Worker's `TurnResponse`, and each state that isn't an
answer, has one pose, one line of words, and one set of cues. A pip is
added only when a turn is used.

| Answer         | Words in the bubble and chip                     | Glyph          | The Guessling | Turn | Pip         | Haptic  | Sound |
| -------------- | ------------------------------------------------ | -------------- | ------------- | ---- | ----------- | ------- | ----- |
| `yes`          | Yes                                              | `checkmark`    | Nod           | Used | Yes         | Light   | Yes   |
| `no`           | No                                               | `xmark`        | Head shake    | Used | No          | Light   | No    |
| `rephrase`     | Ask another way                                  | `questionmark` | Shrug         | Free | None        | Light   | Shrug |
| `not_question` | Ask a yes-or-no question                         | `questionmark` | Shrug         | Free | None        | Light   | Shrug |
| `pick`         | Pick a question from the list                    | `list.bullet`  | Shrug         | Free | None        | None    | None  |
| `rest`         | The Guessling needs a rest. You can still guess. | `moon.zzz`     | Resting       | Free | None        | None    | None  |
| `right`        | You got it!                                      | `target`       | Celebration   | Used | Right guess | Success | Solve |
| `wrong`        | Not it                                           | `xmark`        | Head shake    | Used | Wrong guess | Light   | No    |

| State                     | Banner                                               | The Guessling | Offers                          |
| ------------------------- | ---------------------------------------------------- | ------------- | ------------------------------- |
| No answer after 300 ms    | None; the bubble's dots pulse                        | Thinking      | Nothing; the composer waits     |
| No answer after 5 seconds | The Guessling is busy. Send your question again.     | Idle          | Only Send again (ASK-8, PERF-2) |
| Offline                   | You’re offline. Your question is saved.              | Idle          | Send again (STATE-1)            |
| `busy`                    | The Guessling is busy. Pick a question or try again. | Thinking      | The list, Send again (STATE-3)  |
| `slow_down`               | One moment, then try again.                          | Idle          | Send again                      |
| Today's puzzle can't load | Can’t reach the Guessling. Trying again.             | Idle          | Retries by itself (STATE-4)     |
| `bad_date`                | Check your iPhone’s date and time.                   | Idle          | Try again (STATE-4)             |
| `update`                  | Update Guessling to keep playing.                    | Idle          | Update, to the App Store        |
| `unconfirmed`             | Couldn’t confirm Guessling+.                         | Idle          | Try again (STATE-5)             |

### The end of a round

(END-1 to END-5, SHARE-1 to SHARE-3)

- **The stage.** After the hold and the card's turn, the Guessling stands
  in its celebration, with the tuft as "!", or presents the card in its
  bow, and the answer card shows its face: the answer's name in `reveal`
  and the hint under it (END-2).
- **The result**, at the top of the notepad: "Solved in 9 of 20" or "Out of
  turns"; the turn meter without its empty rings, so it shows the share's
  symbols one for one; and "Next Guessling
  in 5:42:10" in `count`, counting down.
- **The buttons.** Share, primary, and "Play yesterday’s?", secondary,
  which reads "Play another?" when no daily puzzle is dated before today
  (END-3).
- **Statistics**, when there are any (END-5): Played, Solved as a
  percentage, Streak, and Longest, in `count` over labels in `meta`.
- **At once.** The screen appears without waiting for the statistics, and
  the history stays below it, scrolled to the top.

### The notice

(NOTICE-1 to NOTICE-5)

- **How it opens.** As a sheet over Today on a fresh install, which swiping
  can't dismiss, since the question field stays disabled until the player
  chooses (NOTICE-1).
- **Inside.** On an Index white sheet: the Guessling, idle, at the top; the
  title "Before you ask" in `title`, Ballpoint; the server's text in `body`;
  the privacy policy as a Link blue link; and two full-width buttons
  stacked in the secondary style, "Allow AI answers" and then "Not now",
  the same in size, color, and weight.

### The archive

(ARCHIVE-1 to ARCHIVE-4)

- **Layout.** The table, with a native large-title header, "Archive", and
  one group of rows on an Index white card with `lg` corners.
- **Each row.** The number and date in `meta`, such as "#13 · Saturday,
  September 26", or "#3 · Starter"; the hint in `body-strong`; and at the
  trailing end the result chip, "9/20" or "X", a `lock.fill` for a locked
  puzzle, or nothing for one not played.
- **For a free player.** One line on the table above the list, "Past puzzles
  open with Guessling+.", with no button, since only a locked puzzle and
  "Play yesterday’s?" open the paywall (PAY-4). Tapping a locked row opens
  it; a round TODAY-5 keeps open has no lock.

### Settings

(SET-1, SET-2, NOTICE-4, PAY-6, PAY-8)

- **Layout.** The table, with a native large-title header, "Settings", and
  groups of rows on Index white cards.
- **Groups.**
  - **Answers:** the AI answers switch, with a footer line that says what it
    does.
  - **Sound and haptics:** Sound and Haptics switches.
  - **Guessling+:** Restore Purchases, Redeem Code, and Manage Subscription.
  - **About:** Privacy Policy, Terms of Use, Support, Your ID, which copies
    the player's RevenueCat ID, and Version.
- **Switches** are the system's, with their "on" track in Link blue, since
  green belongs to answers and Link blue clears 3 to 1 on cards in both
  appearances.

### The paywall

(PAY-1 to PAY-5, A11Y-6)

RevenueCat's paywall, configured in its editor, which the SDK in version
10.10.1 presents as a page sheet ([iOS notes on the paywall][ios-paywall]).

1.  **Header art**: the Guessling celebrating with a fan of answer cards, a
    PNG under 1 MB in a light and a dark version. Nothing essential lives in
    it, because the iOS SDK hides paywall images from VoiceOver.
1.  **The title**, "Every past puzzle, any day", and a line that says what
    Guessling+ holds today: "All past puzzles, from #1 to yesterday’s, and
    one more every day" (PAY-2).
1.  **The two plans** as Index white cards, the yearly preselected with a
    Marigold border and a "3 days free" badge, each with its billed amount as
    the largest price, the trial, and the renewal (PAY-1, PAY-2).
1.  **The purchase button**, Marigold with a Ballpoint label, then "Cancel
    anytime in Settings".
1.  **Restore Purchases, Terms of Use, Privacy Policy, and Close** (PAY-3).

- **Colors** come from the tokens, Table blue behind white cards, and every
  color and image has a dark value, since a color without one shows its
  light value in Dark Mode.
- **Type** is the editor's system font, since SF Pro Rounded can't be
  uploaded; font scaling stays on.
- **Icons** come from the editor's Tabler set, the nearest to the app's
  symbols: a check, a calendar, and a card.
- **The AI Editor** takes "a design.md file to define your brand colors,
  fonts, and styling guidelines", so the team hands it this file.

[ios-paywall]: /docs/research/ios-design.md#revenuecat-paywalls-styling

### Launch

- A solid Table blue, in the dark value in Dark Mode, with no text and no
  image, since Apple asks for a launch screen "nearly identical to the first
  screen" and not "a branding opportunity" ([iOS notes on launch
  screens][ios-launch]). `expo-splash-screen` sets `backgroundColor` and a
  `dark` value.

[ios-launch]: /docs/research/ios-design.md#launch-screens

## Words on screen

The [product][product-character] sets the voice: fixed, short, plain
phrases. The PRD quotes some strings; this section fixes the rest.

- **Sentence case** for everything the team writes, buttons included: "Send
  again". Apple's names keep Apple's case: Restore Purchases, Redeem Code,
  Manage Subscription, Terms of Use, and Privacy Policy.
- **Plain and short.** One exclamation mark in the whole app, in "You got
  it!".
- **Never blame.** The Guessling never says "Wrong", "Nope", "Oops", or
  "Fail"; a wrong guess gets "Not it". The report reason "Wrong" (REPORT-1)
  is about an answer, not the player.
- **Numerals** for numbers: "14 turns left", "1 turn left", "Solved in 9 of
  20".
- **Curly quotes and apostrophes** in the app: “An animal” and “You’re
  offline”, and in the PRD's strings too, such as “Play yesterday’s?”.
- **No emoji** anywhere but the share text, which SHARE-1 fixes.

| Where                              | Words                                                            | Fixed by      |
| ---------------------------------- | ---------------------------------------------------------------- | ------------- |
| The bubble before a question       | I’m thinking of something.                                       | This document |
| The bubble while loading           | Getting today’s puzzle                                           | This document |
| The question field                 | Ask a yes-or-no question                                         | This document |
| The guess field                    | Name the thing                                                   | This document |
| Above the guess field              | A guess uses a turn.                                             | This document |
| The turn meter                     | 14 turns left · 1 turn left                                      | This document |
| The three answers                  | Yes · No · Ask another way                                       | ASK-2         |
| Not a question                     | Ask a yes-or-no question                                         | ASK-4         |
| The guesses                        | You got it! · Not it                                             | This document |
| The notice's buttons               | Allow AI answers · Not now                                       | NOTICE-1      |
| The notice's title                 | Before you ask                                                   | This document |
| A row's action                     | Report this answer · Wrong · Unclear                             | REPORT-1      |
| A report with no reason            | No reason                                                        | This document |
| After a report                     | Reported                                                         | REPORT-3      |
| After a timeout                    | Send again                                                       | ASK-8         |
| Banners                            | The state table under Screens                                    | This document |
| The replies to picking and resting | The answer table under Screens                                   | This document |
| A round solved                     | Solved in 9 of 20                                                | This document |
| A round not solved                 | Out of turns                                                     | This document |
| The end screen                     | Share · Play yesterday’s? · Play another?                        | END-3         |
| The countdown                      | Next Guessling in 5:42:10                                        | This document |
| The statistics                     | Played · Solved · Streak · Longest                               | This document |
| The archive, for free players      | Past puzzles open with Guessling+.                               | This document |
| The paywall's title                | Every past puzzle, any day                                       | This document |
| What Guessling+ holds              | All past puzzles, from #1 to yesterday’s, and one more every day | This document |
| The yearly plan's badge            | 3 days free                                                      | This document |
| Under the plans                    | Cancel anytime in Settings                                       | This document |

[product-character]: /docs/PRODUCT.md#the-guessling-character

## Accessibility

How each part of the design meets the PRD's accessibility requirements, and
what each iPhone setting changes.

- **VoiceOver (A11Y-1).**
  - The Guessling and its bubble are one element, labeled with the reply's
    words, and each new answer is announced with the turns left: "No. 13
    turns left."
  - A history row reads as its question and answer, "Does it live in water?
    No.", with the custom action "Report this answer".
  - The turn meter is one element that counts the turns by answer.
  - Every symbol button has a label: Archive, Settings, Guess, Send,
    Questions, and Share.
  - On the paywall, nothing lives only in an image.
- **Larger Text (A11Y-2).** Every text style follows its `dynamicTypeRamp`;
  from AX1, rows stack and the stage stays compact; screens scroll; symbols
  and pips grow with the text; nothing truncates.
- **Reduce Motion (A11Y-3).** Each reaction becomes a cross-fade to its key
  pose, as in [Reduce Motion](#reduce-motion).
- **Color (A11Y-4).** Every answer shows its words and its glyph, so a round
  plays the same in grayscale.
- **Dark Mode and contrast (A11Y-5).** Every color has a dark value, every
  pair in the [contrast table](#contrast) passes in all four appearances,
  and the app follows the system's appearance.
- **Increase Contrast.** Colors switch to their "more contrast" values,
  which `DynamicColorIOS` picks by itself.
- **Reduce Transparency.** The composer uses its solid fallback.
- **Bold Text.** Every weight steps up one level while it's on.
- **Differentiate Without Color.** React Native can't read this setting, so
  the glyphs are always on, which App Store Connect prefers anyway: a
  setting should be "a last resort or stop-gap solution"
  ([game notes on color][game-color]).
- **Touch.** Every control has a 44-point hit area.
- **Labels (A11Y-6).** The design aims at the Accessibility Nutrition Labels
  for VoiceOver, Voice Control, Larger Text, Dark Interface, Differentiate
  Without Color Alone, Sufficient Contrast, and Reduced Motion, which the
  team claims only once each passes Apple's criteria
  ([Apple notes][apple-labels]); the app has no video, so captions and
  audio descriptions don't apply.

[game-color]: /docs/research/game-design.md#apple-on-color-and-feedback
[apple-labels]: /docs/research/apple-requirements.md#what-each-label-claims

## Web pages

The Worker serves `/privacy`, `/terms`, and `/support` as static files
([TRD repository layout][trd-layout]).

- **Layout.** A Table blue band at the top with the Guessling as an inline
  SVG, labeled "Guessling", and the name beside it; under it, an Index
  white card with `lg` corners that holds the text, at most `65ch` wide,
  with 16px margins on a phone.
- **Type.** Headings in `ui-rounded, system-ui, sans-serif`, bold; text in
  `system-ui, sans-serif` at 17px with a line height of 1.5. CSS defines
  `ui-rounded` as "the rounded variant of the system's user interface"
  ([CSS Fonts 4][css-ui-rounded]), which is SF Pro Rounded on an iPhone;
  where a system has none, the next name applies.
- **Color.** The tokens as CSS custom properties. A `prefers-color-scheme`
  query for dark swaps in the dark values, and a `prefers-contrast` query
  for more swaps in the "more contrast" ones. Links are Link blue and
  underlined.
- **Private.** Inline CSS and nothing else: no scripts, no web fonts, no
  cookies, and no image or request from another host.
- **Still.** No motion at all.
- **Support.** The support email, where to find Your ID in Settings, and
  how to restore Guessling+.

[trd-layout]: /docs/TRD.md#repository-layout
[css-ui-rounded]: https://www.w3.org/TR/css-fonts-4/#valdef-font-family-ui-rounded

## App icon and store assets

### The app icon

- **One file.** A `.icon` file from Icon Composer, set as `ios.icon`, which
  Expo supports since SDK 54; Xcode generates the images for iOS 18 and
  earlier from it ([iOS notes on icons][ios-icons]).
- **Design.** A solid Table blue background, and the Guessling's body, face,
  and "?" tuft in at most four flat foreground layers. No text, no SF
  Symbol or anything like one, and no baked shadows or highlights, which
  the system adds.
- **Variants.** Dark puts the same shapes on the dark table color; mono
  makes the Guessling white.
- **Checks.** Legible at the smallest icon sizes, in the dark, clear, and
  tinted looks, and on an iOS 18 simulator.
- **For Devpost.** A 1024 × 1024 PNG of the default look, which Shipaton's
  rules ask for.

[ios-icons]: /docs/research/ios-design.md#ios-26-icons-and-icon-composer

### Screenshots

- **Format.** Five at 1320 × 2868, the 6.9-inch size, flat RGB with no alpha
  (STORE-2). Each is a frameless capture of the app from the simulator,
  under a Table blue caption band with one short phrase in Nunito, white.
- **Order.** The first three appear in search results, so they carry the
  game:
  1.  "Ask anything": Today, with a question and the Guessling's nod.
  1.  "Yes, no, or ask another way": the shrug.
  1.  "Find it in twenty": the celebration and the answer card.
  1.  "Share without spoilers": the end screen, in Dark Mode.
  1.  "Every past puzzle with Guessling+": the archive, which says it needs
      Guessling+, as guideline 2.3.2 asks.
- **What they show.** A starter puzzle, never an upcoming day's answer; no
  prices, URLs, or awards.
- **For Devpost.** One frameless 1179 × 2556 capture of Today, with no
  caption band (STORE-2).

### Devpost images and the video

- **Thumbnail.** 3:2, such as 1500 × 1000, under 5 MB, with the Guessling in
  the middle on Table blue, since the gallery crops thumbnails around their
  center.
- **Gallery.** Landscape images that set two or three screenshots side by
  side on Table blue, since a lone portrait screenshot shows small.
- **The video.** A screen recording on an iPhone, following the idea's
  [script][idea-video]: title cards in Nunito on Table blue, short captions,
  the app's own sounds, and no music the team doesn't own.
- **No app preview** in version 1.0. If one comes later: 886 × 1920, 15 to
  30 seconds at 30 frames a second, a screen capture only, saying that the
  archive needs Guessling+ ([iOS notes on store assets][ios-store]).

[idea-video]: /docs/IDEA.md#launch-and-pitch
[ios-store]: /docs/research/ios-design.md#store-and-pitch-assets

## Do's and don'ts

- Do show the words and the glyph with every answer, within 100 ms.
- Do keep Marigold for the Guessling, the primary action, and the right
  guess, and green and red for Yes and No.
- Do take every color from a token, and every size and timing from this
  document.
- Don't mock a miss: no red flash, no buzzer, and no "Wrong" from the
  Guessling.
- Don't make the player wait for an animation.
- Don't put glass on content, and don't fade glass.
- Don't use emoji anywhere but the share text.
- Don't loop anything while the Guessling waits.
- Don't load anything from a third party on the web pages.
- Don't put an SF Symbol in the icon, a logo, or the Guessling.

## Guidance for coding agents

### Using this file

- **Read it first.** Read this file before building or changing a screen.
  The tokens are the values to use; the prose says how to apply them.
- **Where values live.** The yaml blocks hold the light values, the
  [Colors table](#colors-in-every-appearance) holds all four appearances,
  and the motion block holds the springs.
- **Tools.** `bunx @google/design.md@0.4.0 lint docs/DESIGN.md` checks the
  tokens, and `bunx @google/design.md@0.4.0 spec` prints the format. Pin the
  version: the format is still alpha.
- **Other tools.** Hand this file to RevenueCat's Paywall AI Editor, and to
  Google Stitch if the team sketches screens there. The tokens sit in
  fenced yaml blocks rather than the front matter the specification
  describes; Google's linter reads them, but whether Stitch's and
  RevenueCat's importers do is untested ([trends notes][ft-style]).

[ft-style]: /docs/research/frontend-trends.md#a-designmd-that-follows-this-repos-style-guide

### Keeping code in step

- `app/src/constants/theme.ts`, where Expo's default template keeps its
  theme, exports the tokens: each color as a `DynamicColorIOS` value from
  the Colors table; each text style with its family, size, line height,
  weight, and `dynamicTypeRamp`; the spacing, the corners, and the motion
  configs.
- A unit test reads this file's yaml blocks and Colors table and fails when
  `theme.ts` differs, since a prose-only design file led different models to
  build different pages in Vercel's test ([trends notes][ft-agents]).
- The same test computes the contrast of every text and glyph pair the
  components use, in all four appearances, against the minimums in the
  [contrast table](#contrast), so a pair used outside the table can't slip
  through.
- A change starts here, then reaches `theme.ts`, never the other way.

[ft-agents]: /docs/research/frontend-trends.md#how-agents-are-meant-to-use-designmd

### Checks before a screen ships

- **Systems.** iOS 16.4, 18, and 26 or 27 simulators, and a release build,
  since some faults show only there.
- **Settings.** Light and dark; Increase Contrast; Reduce Transparency;
  Reduce Motion; Bold Text; the largest accessibility size, AX5; VoiceOver;
  and grayscale, through Color Filters.
- **Screens.** 375 × 667 and 440 × 956 points, and an iPad at phone size
  (COMPAT-3).
- **Real strings.** The longest reply, hint, and answer name, at 375 × 667
  and at AX5.
- **Colors.** After any color change, the contrast table is recomputed with
  `check_contrast.py`, from the [design plan's appendix][plan-checks], and
  still passes.

[plan-checks]: /docs/superpowers/plans/2026-09-22-guessling-design.md#appendix-check-scripts

### If the day runs short

If September 23 runs out, ship these and polish in an update, as the
idea's art risk plans ([idea risks][idea-risks]):

- The eight key poses as stills, with the 200 ms fade between them.
- No confetti, and a cross-fade instead of the answer card's turn.
- The solid composer on every iOS version.
- The sounds and their switch after launch, since the product makes sound a
  Should (SET-2); the theme's unit test right after submission.

Never cut: the words and glyph with every answer, the four appearances,
the type ramps, and the Reduce Motion versions.

## Open questions

Each has a safe default, which this document follows until someone decides.

- **The share row's colors.** 🟩 and 🟥 differ only in color, so the shared
  pattern is hard to read for deuteranopes. Safe default: SHARE-1 as it is
  for version 1.0, since the app itself never relies on color alone; the
  PRD may add Wordle's remedy, a high-contrast share with 🟦 and 🟧, in an
  update.
- **Who draws the Guessling.** The idea leaves it open
  ([idea open questions][idea-open]). Safe default: explore with AI, then a
  teammate draws and poses the parts, credited in the write-up.
- **Rive later.** Safe default: Reanimated for version 1.0; Rive only if
  the poses outgrow a rig, with a paid plan for exports.
- **An app preview.** Safe default: none in version 1.0; the demo recording
  can become one with the first update.
- **The busy state after a timeout.** PERF-2 calls the 5-second state "the
  busy state", STATE-3's busy state offers the question list, and ASK-8
  allows only "Send again" after a timeout. Safe default: a timeout shows a
  busy banner with only "Send again", and the list appears only when the
  Worker answers `busy`; the PRD can make the wording match.

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
[game-findings]: /docs/research/game-design.md#findings-for-designmd
[game-ai]: /docs/research/game-design.md#ai-assisted-art-and-the-rules
[idea-open]: /docs/IDEA.md#assumptions-and-open-questions

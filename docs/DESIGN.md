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
[idea-open]: /docs/IDEA.md#assumptions-and-open-questions

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

| Text or mark | On            | Used for                                           | Light  | Dark   | Light, more contrast | Dark, more contrast | At least |
| ------------ | ------------- | -------------------------------------------------- | ------ | ------ | -------------------- | ------------------- | -------- |
| `ink`        | `card`        | Questions and body text                            | 16.1:1 | 11.3:1 | 18.6:1               | 13.6:1              | 7:1      |
| `ink-muted`  | `card`        | Secondary text, field borders, and empty pips      | 6.2:1  | 6.6:1  | 9.1:1                | 9.6:1               | 4.5:1    |
| `link`       | `card`        | Links                                              | 7.8:1  | 6.9:1  | 9.9:1                | 9.4:1               | 4.5:1    |
| `on-desk`    | `desk`        | The top bar, titles, and symbols on the table      | 5.8:1  | 16.8:1 | 7.8:1                | 18.4:1              | 4.5:1    |
| `on-primary` | `primary`     | Primary buttons and the right-guess chip           | 10.2:1 | 10.2:1 | 11.7:1               | 11.7:1              | 4.5:1    |
| `yes-ink`    | `yes-tint`    | Yes chips                                          | 5.9:1  | 6.8:1  | 7.5:1                | 9.7:1               | 4.5:1    |
| `no-ink`     | `no-tint`     | No and wrong-guess chips                           | 5.5:1  | 6.3:1  | 6.7:1                | 9.2:1               | 4.5:1    |
| `unsure-ink` | `unsure-tint` | Free-reply chips                                   | 6.2:1  | 6.7:1  | 7.8:1                | 9.4:1               | 4.5:1    |
| `yes-ink`    | `card`        | "Yes" in the speech bubble                         | 6.8:1  | 8.0:1  | 9.3:1                | 10.5:1              | 4.5:1    |
| `no-ink`     | `card`        | "No" and "Not it" in the speech bubble             | 6.5:1  | 6.5:1  | 9.0:1                | 8.9:1               | 4.5:1    |
| `unsure-ink` | `card`        | Free replies in the bubble, and Stone badges       | 7.1:1  | 8.2:1  | 9.8:1                | 11.0:1              | 4.5:1    |
| `card`       | `yes`         | A Yes pip's glyph, and the pip against the notepad | 3.6:1  | 5.3:1  | 5.1:1                | 7.6:1               | 3:1      |
| `card`       | `no`          | A No pip's glyph and edge, and a wrong-guess ring  | 4.8:1  | 3.5:1  | 6.6:1                | 5.3:1               | 3:1      |
| `primary`    | `desk`        | The Guessling against the table                    | 3.6:1  | 10.6:1 | 4.9:1                | 11.7:1              | 3:1      |

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

- **Neither green nor red.** Marigold is never an answer color, and Stone,
  for the replies that use no turn, is plainly neither.

[game-squares]: /docs/research/game-design.md#the-share-squares-measured

## Typography

Guessling uses the iPhone's own faces and bundles none:

- **SF Pro Rounded**, as `ui-rounded`: the Guessling's words, the hint,
  titles, buttons, chips, and counts. Apple made the rounded faces "to
  coordinate text with the appearance of soft or rounded UI elements, or to
  provide an alternative typographic voice", which suits a soft character.
- **SF Pro**, as `system-ui`: questions, the notice, lists, and everything
  read at length.
- **Why system faces.** They come with the device, follow Dynamic Type and
  Bold Text, and need no download. A bundled face would need its license
  text in the app, an upload to RevenueCat for the paywall, and its own Bold
  Text handling ([iOS notes on fonts][ios-fonts]).

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
  React Native 0.86 doesn't read Bold Text, so the app follows
  `AccessibilityInfo`'s `boldTextChanged` and steps every weight up one
  level while it's on.
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
    beside its speech bubble.
  - **The notepad**: the hint, the turn meter, and the history, which
    scrolls.
  - **The composer**, pinned above the keyboard or the home indicator.
- **With the keyboard up**, the stage turns compact: the Guessling shrinks
  to 64 points in one row with its bubble, so the newest answers stay in
  view above the composer.
- **Large text.** From AX1, the stage stays compact, history rows put the
  chip under the question, and the whole screen scrolls; nothing truncates
  (A11Y-2).
- **Screens.** Laid out for 390 × 844 points and checked at 375 × 667, the
  smallest iPhone that runs iOS 16.4, and at 440 × 956, the 6.9-inch
  iPhone, and on an iPad at phone size (COMPAT-3).
- **Safe areas.** Content stays inside them, and the table's color runs
  under the status bar and the home indicator.

## Elevation

- **Depth by color.** The table is the floor; the notepad and the speech
  bubble are Index white on it; the answer card sits highest, with the only
  large shadow.
- **Shadows.** Two, tinted with Ballpoint, never gray: the answer card's,
  `0 8 24` at 25%, and the composer's fallback, `0 2 8` at 12%.
- **Liquid Glass from the system.** Navigation bars, sheets, alerts, menus,
  and the keyboard take it on iOS 26 and 27 by themselves. The app sets no
  opt-out, since Apple ignores `UIDesignRequiresCompatibility` once an app
  builds for iOS 27 ([iOS notes on the key][ios-key]).
- **Liquid Glass in Guessling's views.** Only the composer, a capsule of
  regular `GlassView` from `expo-glass-effect` on iOS 26 and later, which
  floats over the notepad. Its send button is the one colored thing on it,
  in Marigold, since Apple says "To emphasize primary actions, apply color
  to the background rather than to symbols or text."
- **The fallback.** On iOS 16.4 to 18, where `GlassView` draws nothing, and
  whenever `AccessibilityInfo.isReduceTransparencyEnabled()` is true, the
  composer is an Index white capsule with a 1-point Pencil border and its
  shadow; the app follows `reduceTransparencyChanged`.
- **Never fade glass.** Opacity under 1 on a `GlassView` or any parent stops
  the glass from drawing, so the composer leaves by moving, never by fading
  ([iOS notes on glass views][ios-glass-views]).
- **Never glass on content.** Not on the Guessling, the hint, the notepad,
  the chips, or the answer card: "Don't use Liquid Glass in the content
  layer."
- **Headers.** Today draws its own top bar on the table. Archive and
  Settings use the native large-title header over the table: transparent,
  with the system's scroll edge effect, on iOS 26 and later, and opaque in
  the table's color below iOS 26, with the title and items in Chalk either
  way ([iOS notes on headers][ios-headers]).

[ios-key]: /docs/research/ios-design.md#the-compatibility-key
[ios-glass-views]: /docs/research/ios-design.md#glass-views-in-expo
[ios-headers]: /docs/research/ios-design.md#headers-sheets-and-tabs-in-expo-router

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
  with "a radius that's half the height".
- **Cards.** The notepad has `lg` corners at the top and runs off the
  bottom of the screen; list groups are `lg`; the answer card is `md`.
- **Pips** are `pip`.
- **Concentric.** A shape inside another takes the outer radius minus the
  padding between them, as Apple's layouts do.
- **Soft everywhere.** No sharp corners, and no square and round corners
  in the same view.

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
    rounded: '{rounded.full}'
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
  one per screen, as Apple asks: "Keep the number of prominent buttons to
  one or two per view."
- **Secondary.** An Index white capsule with a 1-point Pencil border on
  cards; on the table it needs no border.
- **Symbol buttons.** A symbol in Chalk on the table, or Ballpoint on a
  card, in a 44-point hit area, each with an accessibility label.
- **Press.** Every custom button scales to 0.97 with `snap` while pressed
  and springs back; a disabled one shows at 40% opacity and doesn't
  respond.

### The speech bubble

- **Where.** An Index white capsule on the table beside the Guessling, with
  a small tail toward it; below it on screens too narrow for both.
- **What it holds.** The latest reply: a 22-point badge, a circle in the
  answer's color with the glyph in Index white, then the words in `reply`,
  colored `yes-ink`, `no-ink`, or `unsure-ink`, or Ballpoint beside
  Marigold for a right guess. Before the first question it says "I’m
  thinking of something." in Ballpoint, with no badge.
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
  pip appears only for a turn used, so free replies add none (ASK-3).
- **Pips.** 14 points at the default size, 4 apart, with `pip` corners:
  - Empty: a 1.5-point Pencil ring.
  - Yes: `yes`, with an Index white `checkmark`.
  - No: `no`, with an Index white `xmark`.
  - A wrong guess: Index white with a 2-point `no` ring and a `no`
    `xmark`, like the share's ❌.
  - The right guess: Marigold with a Ballpoint `target`, like the share's
    🎯.
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
  answer", then the reasons "Wrong" and "Unclear". Once sent, the row shows
  "Reported" in `meta` under the chip (REPORT-1, REPORT-3). VoiceOver offers
  the same as a custom action.

### The composer

- **Asking.** A capsule 50 points tall, floating 16 points from the edges
  over the notepad: a Guess button on the leading side, a `target` and the
  word "Guess" in the secondary style; the field, "Ask a yes-or-no
  question"; and a Marigold send button with an `arrow.up` once there's
  text (ASK-1).
- **Guessing.** Guess turns the field into "Name the thing", with a
  Marigold "Guess" label inside it, a 60-character limit, and the line "A
  guess uses a turn." above the composer; the send button shows a `target`.
  An `xmark.circle.fill` button returns to asking (GUESS-1, GUESS-3).
- **Counts.** Characters left show in `meta` from 120 of 140 for a question
  and from 50 of 60 for a guess.
- **Pending.** While an answer is pending, the field, Guess, and the
  question list are disabled (ASK-8).
- **AI answers off.** With the field empty, a Questions button with
  `list.bullet` replaces send and opens the searchable list (ASK-9).
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
  offline, busy, resting, no answer yet, or an error. It's a Stone capsule
  with its symbol, its words from Words on screen, and
  its action, such as "Send again".
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
    reduceMotion: never
```

- **Springs.** Each spring token is a duration-based `withSpring` in
  Reanimated 4.5.1, whose duration is perceptual: "Actual duration is 1.5
  times the value of perceptual duration." A damping ratio of 1 doesn't
  bounce; lower ones do, and only the character's moves go below 0.8
  ([iOS notes on springs][ios-springs]).
- **Timings.** `lead` and `fade` are `withTiming`; the fade is for opacity
  and color only, and it keeps running under Reduce Motion:

  ```ts
  withSpring(value, { duration: 350, dampingRatio: 1 }) // settle
  withTiming(value, { duration: 120, easing: Easing.out(Easing.cubic) }) // lead
  withTiming(value, {
    duration: 200,
    easing: Easing.inOut(Easing.quad),
    reduceMotion: ReduceMotion.Never
  }) // fade
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
| Head shake  | Turns 10° with `lead`, then springs back with `shake`, swinging past center and back; 8° at most for a wrong guess                                                                                                               | 550 ms |
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
  instead of popping (A11Y-3).
- **Reading the setting.** The app reads `AccessibilityInfo`'s
  `isReduceMotionEnabled()` and follows `reduceMotionChanged`, because
  `useReducedMotion()` keeps the value it had at launch.
- **Keeping the fade.** Every fade sets `reduceMotion: ReduceMotion.Never`;
  otherwise Reanimated's default makes it jump to its end, and a nod built
  from a sequence shows nothing at all ([iOS notes on Reduce
  Motion][ios-reduce-motion]).
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
  the buttons rise in 60 ms apart. Under Reduce Motion, the card fades from
  back to face, and the rest fades in together.
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

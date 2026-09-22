# Turn design

How Turn looks, reads, and moves: the design system and art direction for the
iPhone app, the paywall's styling, the app icon, and the pitch assets. It
follows Google's [DESIGN.md format][gdm], so design and coding agents can read
its tokens, and it turns the [product's][product-principles] principles into
rules and layouts that the [technical requirements](/docs/TRD.md) build and the
[product requirements](/docs/PRD.md) test. Facts are as of September 23, 2026;
every color, size, and duration this document sets is a design decision.

Contents:

1.  [Overview](#overview)
1.  [Influences and trends](#influences-and-trends)
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
1.  [App icon and pitch assets](#app-icon-and-pitch-assets)
1.  [Do's and don'ts](#dos-and-donts)
1.  [Guidance for coding agents](#guidance-for-coding-agents)
1.  [Open questions](#open-questions)
1.  [See also](#see-also)

## Overview

```yaml
version: alpha
name: Turn
description: >-
  An AAC app for iPhone that speaks an adult's saved phrases and typed words,
  and offers their own replies as a partner finishes speaking.
```

### Rules that don't bend

Every screen keeps these ten rules; each names the requirement it serves and
the test that shows it holds. The rest of this document says how.

1.  **Nothing moves under a finger.** The strip, the row's six slots, and the
    grid keep their places and sizes whatever the row shows; only the words
    inside a slot change, and never while it's pressed (ROW-1, ROW-5,
    BANK-4). Test: the grid's first button and every slot's frame stay put
    through every state of the row.
2.  **Phrases read at 7 to 1.** Phrase text reaches 7 to 1 against its fill in
    all four appearances, other text 4.5 to 1, and every button's edge 3 to 1
    (A11Y-7). Test: `check_contrast.py` and the theme test.
3.  **A word for every state.** Listening, paused, a note, a marked tab, and
    Yes, No, and Not sure each carry a word or a shape as well as a color
    (A11Y-6). Test: every screen in grayscale, through Color Filters.
4.  **Text follows Dynamic Type.** Every text style follows one of Apple's up
    to AX5 and wraps; only the row may cut a phrase short, and only the
    caption the partner's words, and then VoiceOver gives the whole text
    (A11Y-4). Test: every screen at AX5.
5.  **Targets for unsteady hands.** Phrase buttons in the row and the grid are
    at least 78 points tall, the strip's at least 48, and every other control
    at least 44 by 44 (A11Y-1). Test: the Accessibility Inspector.
6.  **Only a tap speaks.** Nothing speaks without a tap, nothing acts on
    touch-down, and nothing needs a long press, a swipe, or a drag: the grid
    scrolls, and page buttons do the same with a tap (ROW-6, A11Y-5, A11Y-8).
    Test: every scenario with single taps.
7.  **Motion answers someone.** Only a new reply, the big button, and the
    light while the partner's words arrive move anything, and Reduce Motion,
    read live, stills them all (A11Y-6). Test: turn Reduce Motion on
    mid-session.
8.  **No glass behind words.** Phrases, the caption, notes, and the consent card
    sit on solid fills; Liquid Glass stays in the system's bars, sheets, and
    alerts. Test: both ends of the Liquid Glass slider.
9.  **The system decides the look.** Turn follows the iPhone's appearance,
    Increase Contrast, and Bold Text, and has no theme of its own. Test: all
    four appearances, with Bold Text on and off.
10. **Plain words, no AI badges.** No percentages, sparkles, "smart", or
    exclamation marks, and a reply looks like any other phrase of the user's,
    because it is one ([product principles][product-principles]). Test: read
    every string in [Words on screen](#words-on-screen).

### The reference

A whiteboard and four markers. When a device fails, people who can't speak
reach for a board and a pen, as one AAC user did after an update changed their
app's layout, taking "a white board and marker" to a cancer appointment
([AAC design notes][aac-criticize]). A board has what Turn needs: big, dark
words that both people can read, inks with fixed jobs, nothing on it but what's
being said, and nothing to wait for.

- **What it gives each surface.** The board is the background; each phrase is
  written on a white card on it; black marker is the text; blue is Turn's own
  ink, for its actions and for the one reply it's sure of; green and red belong
  to Yes and No and nothing else; and the listening light is the one orange
  thing, after the dot iOS shows while a microphone is on.
- **Why a reference.** Google's format asks for one, since "A specific
  reference describes a point." ([trends notes][ft-tokens])
- **Why this one.** It's the tool AAC users already trust, it looks like
  nothing special, and devices that looked like mainstream ones drew the least
  attention in interviews about assistive technology
  ([AAC design notes][aac-stigma]). It's calm in the sense the trends notes
  found: "Technology should require the smallest possible amount of attention"
  ([trends notes][ft-calm]).
- **What it rules out.** Decoration, mascots, clinical icons, gradients, and
  anything that moves on its own.

[aac-criticize]: /docs/research/aac-design.md#what-users-criticize

### Scope

- **In:** the app's screens and their states, the paywall's styling, the app
  icon and launch screen, the Devpost images, the README's images, and the
  look of the demo video.
- **Out:** a website, since no Next Gen item needs one and the privacy notice
  ships in the app ([motionsites notes][ms-web]); an iPad layout, a non-goal
  of the PRD, though an iPad's window follows the same [width rules](#widths);
  a partner view that flips the last phrase toward the partner, an
  [open question](#open-questions); and any appearance setting inside the app.

[ms-web]: /docs/research/turn-motionsites.md#a-one-page-website

### Assumptions

- **When.** The team builds the screens from September 23 to 27 and films on
  September 28, 2026, on the idea's
  [schedule](/docs/IDEA.md#schedule-to-september-30).
- **The paywall's type.** Its text uses the system font, since Apple's
  license bars uploading SF Pro, and its colors take the tokens' light and
  dark values by hand in RevenueCat's editor.
- **Who sees it.** Judges meet Turn mostly through the video, the Devpost
  images, and the Simulator build on iOS 27, so those get the pitch assets'
  care.
- **Evidence.** No clinic has reviewed Turn yet, so its sizes follow studies of
  other people with motor impairments, as the
  [AAC design notes][aac-targets] say.

## Influences and trends

What the four notes found, and what Turn takes from each. Every row cites the
note that holds its sources.

| Source                          | What it offers                                 | What Turn does                                                                                    |
| ------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| motionsites.ai's newest prompts | Exact copy, a motion inventory, and checks     | Adopts the shape: this file lists every animation and ends with checks ([notes][ms-spec])         |
| motionsites.ai's house look     | Near-black pages, video, glass, and faint text | Rejects it: faint text and glass edges fail contrast, and loops can't pause ([notes][ms-a11y])    |
| Calm wellness prompts           | Warm light fields and one accent               | Adopts a light field and one accent, not their loops ([notes][ms-color])                          |
| Google's DESIGN.md format       | Tokens and prose that a linter checks          | Adopts it, with four appearances per color ([notes][ft-sample])                                   |
| AI generators of native apps    | Fast first screens                             | Sketches only: generated screens fail on contrast and labels first ([notes][ft-studies])          |
| React Native component kits     | Ready-made controls                            | Rejects them: none handles Increase Contrast ([notes][ft-kits])                                   |
| Apple's Liquid Glass            | Glass controls that float over content         | Adapts it: glass stays in the system's chrome ([notes][ios-glass-content])                        |
| Google's Material 3 Expressive  | Large, contained buttons with labels           | Adopts the buttons and labels, not the springy motion ([notes][ft-m3e])                           |
| Calm technology                 | Attention only when something matters          | Adopts it for the light and the row ([notes][ft-calm])                                            |
| Text AAC apps                   | Message windows, phrases, and show views       | Adopts fixed places and plain text, and keeps more in view than any rival ([notes][aac-patterns]) |

- **Bans Turn keeps.** "Default to stillness", no staggered entrances, no
  squish on press, no hardcoded colors, no labels in capitals, no glass on
  everything, and no endless loops, each because it protects speed or
  legibility ([trends notes][ft-bans]).
- **Bans Turn drops.** A ban on wrapping button text, bans on characters such
  as em dashes applied to phrases, which are the user's own words, and bans on
  the system font, which is the accessible choice here
  ([trends notes][ft-nobans]).
- **What motionsites.ai lacks.** No prompt in its catalog, or in the
  813-prompt local corpus that holds 483 of them, designs AAC or speech
  output; the nearest are a voice-input template and two prosthetics pages.
  So its craft transfers and its sizes don't: its buttons are a median of 40
  pixels, under Turn's 44-point floor ([motionsites notes][ms-findings]).

[ms-spec]: /docs/research/turn-motionsites.md#layout-and-type-in-the-closest-prompts
[ms-a11y]: /docs/research/turn-motionsites.md#accessibility-of-the-common-patterns
[ms-color]: /docs/research/turn-motionsites.md#color-imagery-and-motion-in-the-closest-prompts
[ft-sample]: /docs/research/turn-frontend-trends.md#a-turn-shaped-sample-through-the-linter
[ft-studies]: /docs/research/turn-frontend-trends.md#studies-of-ai-generated-interfaces
[ft-kits]: /docs/research/turn-frontend-trends.md#styling-and-component-kits
[ft-m3e]: /docs/research/turn-frontend-trends.md#material-3-expressive-and-older-users
[aac-patterns]: /docs/research/aac-design.md#patterns-across-the-apps
[ft-bans]: /docs/research/turn-frontend-trends.md#bans-that-suit-an-aac-app
[ms-findings]: /docs/research/turn-motionsites.md#findings-for-designmd

## Colors

A light gray board, white cards with dark edges, and near-black ink, with four
colored inks that each have one job. Every color holds four values, one for
each appearance: `light`, `dark`, and each with Increase Contrast, `light-hc`
and `dark-hc`. They map one to one onto React Native's `DynamicColorIOS`, as
`light`, `dark`, `highContrastLight`, and `highContrastDark`, so Increase
Contrast needs no code ([trends notes][ft-appearances]).

```yaml
colors:
  board:
    light: '#F2F2F7'
    dark: '#000000'
    light-hc: '#F2F2F7'
    dark-hc: '#000000'
  surface:
    light: '#FFFFFF'
    dark: '#1C1C1E'
    light-hc: '#FFFFFF'
    dark-hc: '#1C1C1E'
  pressed:
    light: '#E1E1E6'
    dark: '#3A3A3C'
    light-hc: '#D6D6DC'
    dark-hc: '#48484A'
  ink:
    light: '#1C1C1E'
    dark: '#F5F5F7'
    light-hc: '#000000'
    dark-hc: '#FFFFFF'
  ink-secondary:
    light: '#55555B'
    dark: '#AEAEB2'
    light-hc: '#3A3A3E'
    dark-hc: '#D1D1D6'
  edge:
    light: '#85858B'
    dark: '#6C6C70'
    light-hc: '#545458'
    dark-hc: '#A1A1A6'
  accent:
    light: '#1747B8'
    dark: '#8CB4FF'
    light-hc: '#0E3A9E'
    dark-hc: '#B3CDFF'
  accent-pressed:
    light: '#0F3A9A'
    dark: '#B3CDFF'
    light-hc: '#0A2F84'
    dark-hc: '#D0E0FF'
  on-accent:
    light: '#FFFFFF'
    dark: '#0B1530'
    light-hc: '#FFFFFF'
    dark-hc: '#000000'
  yes-fill:
    light: '#E2F3E6'
    dark: '#0F2E19'
    light-hc: '#D4EDDB'
    dark-hc: '#0A2413'
  yes-edge:
    light: '#1F7A3A'
    dark: '#4CC474'
    light-hc: '#145C2A'
    dark-hc: '#7FDC9C'
  no-fill:
    light: '#FBE5E3'
    dark: '#3A1512'
    light-hc: '#F6D5D1'
    dark-hc: '#2E0F0D'
  no-edge:
    light: '#B3261E'
    dark: '#FF7A70'
    light-hc: '#8C1D17'
    dark-hc: '#FFA39C'
  unsure-fill:
    light: '#EAEAEF'
    dark: '#2C2C2E'
    light-hc: '#DDDDE3'
    dark-hc: '#232325'
  unsure-edge:
    light: '#636369'
    dark: '#98989D'
    light-hc: '#48484C'
    dark-hc: '#C7C7CC'
  listen:
    light: '#B84A00'
    dark: '#FF9F43'
    light-hc: '#963B00'
    dark-hc: '#FFB36B'
  on-listen:
    light: '#FFFFFF'
    dark: '#1A0D00'
    light-hc: '#FFFFFF'
    dark-hc: '#000000'
```

[ft-appearances]: /docs/research/turn-frontend-trends.md#appearances-contrast-and-motion-the-format-lacks

### Color roles

| Token            | Name                 | Role                                                                  |
| ---------------- | -------------------- | --------------------------------------------------------------------- |
| `board`          | Board                | The home screen's background, and Settings' and the editor's          |
| `surface`        | Card                 | Phrase buttons, the caption, tabs, list rows, and sheets' backgrounds |
| `pressed`        | Card, pressed        | A card while a finger is on it                                        |
| `ink`            | Marker black         | Phrases and every other text on cards and on the board                |
| `ink-secondary`  | Pencil               | Speaker labels, counts, placeholders, and notes                       |
| `edge`           | Card edge            | The edge of every card and secondary button                           |
| `accent`         | Marker blue          | The big button, Speak, links, and the dot on a marked tab             |
| `accent-pressed` | Marker blue, pressed | The big button and Speak while pressed                                |
| `on-accent`      | On blue              | Text and symbols on marker blue                                       |
| `yes-fill`       | Yes                  | Yes's fill, in the row and in the Quick category                      |
| `yes-edge`       | Yes, edge            | Yes's edge                                                            |
| `no-fill`        | No                   | No's fill                                                             |
| `no-edge`        | No, edge             | No's edge                                                             |
| `unsure-fill`    | Not sure             | Not sure's fill                                                       |
| `unsure-edge`    | Not sure, edge       | Not sure's edge                                                       |
| `listen`         | Listening orange     | The light while the microphone is on                                  |
| `on-listen`      | On orange            | "Listening" and its symbol                                            |

- **Four inks, fixed jobs.** Blue is Turn's own: its actions and the one reply
  it's sure of, never Yes or No. Green and red appear only on Yes and No, and
  orange only on the light, so no color means two things.
- **Marker blue passes under white text.** Apple's system blue gives white
  text only 3.52 to 1, so every fill under white text is Turn's own
  ([iOS notes][ios-grays]).
- **The orange echoes iOS.** iOS shows an orange dot while an app uses the
  microphone, so the light's orange says the same thing, never the camera's
  green ([iOS notes][ios-light]).
- **Solid, never faint.** No text takes its color from opacity: white text at
  under 45% opacity fails 4.5 to 1 on near-black, and a gray that passes in
  one appearance can fail in the other ([motionsites notes][ms-contrast]).
- **No color coding.** Phrases and categories share one look, since color
  coding in AAC comes from symbol grids for children, and no study tested it
  on text ([AAC design notes][aac-color]).

[ios-grays]: /docs/research/turn-ios-design.md#system-colors-and-grays
[ms-contrast]: /docs/research/turn-motionsites.md#text-contrast-143
[aac-color]: /docs/research/aac-design.md#color-coding-and-backgrounds

### Contrast

Each ratio is WCAG 2.2's, truncated to one decimal so none is rounded up to
pass. Phrases and all text on cards need 7 to 1, above A11Y-7's 4.5, since
Apple asks custom colors to "strive for a contrast ratio of 7:1, especially in
small text" ([AAC design notes][aac-polarity]); labels and notes need 4.5 to
1; and edges and fills that mark a control need 3 to 1 against what's next to
them (A11Y-7).

| Text or mark    | On               | Used for                                   | Light  | Dark   | Light, more contrast | Dark, more contrast | At least |
| --------------- | ---------------- | ------------------------------------------ | ------ | ------ | -------------------- | ------------------- | -------- |
| `ink`           | `surface`        | Phrases, the caption, and labels on cards  | 17.0:1 | 15.6:1 | 21.0:1               | 17.0:1              | 7:1      |
| `ink`           | `pressed`        | A card under a finger                      | 13.0:1 | 10.4:1 | 14.5:1               | 9.1:1               | 7:1      |
| `ink`           | `board`          | Text on the board                          | 15.2:1 | 19.2:1 | 18.8:1               | 21.0:1              | 7:1      |
| `on-accent`     | `accent`         | The big button, Speak, and paywall buttons | 7.9:1  | 8.6:1  | 9.9:1                | 13.0:1              | 7:1      |
| `on-accent`     | `accent-pressed` | The same, pressed                          | 10.0:1 | 11.2:1 | 11.9:1               | 15.7:1              | 7:1      |
| `ink`           | `yes-fill`       | Yes                                        | 14.7:1 | 13.5:1 | 16.9:1               | 16.4:1              | 7:1      |
| `ink`           | `no-fill`        | No                                         | 14.1:1 | 14.8:1 | 15.3:1               | 17.6:1              | 7:1      |
| `ink`           | `unsure-fill`    | Not sure                                   | 14.1:1 | 12.7:1 | 15.5:1               | 15.6:1              | 7:1      |
| `surface`       | `ink`            | The selected tab, and its dot when marked  | 17.0:1 | 15.6:1 | 21.0:1               | 17.0:1              | 7:1      |
| `on-listen`     | `listen`         | "Listening" and its symbol                 | 5.2:1  | 9.3:1  | 7.1:1                | 11.9:1              | 4.5:1    |
| `ink-secondary` | `surface`        | Labels, counts, and notes on cards         | 7.4:1  | 7.6:1  | 11.3:1               | 11.1:1              | 4.5:1    |
| `ink-secondary` | `board`          | Notes and placeholders on the board        | 6.6:1  | 9.4:1  | 10.1:1               | 13.8:1              | 4.5:1    |
| `accent`        | `surface`        | Links, and the dot on a marked tab         | 7.9:1  | 8.1:1  | 9.9:1                | 10.6:1              | 4.5:1    |
| `accent`        | `board`          | The big button's fill against the board    | 7.1:1  | 10.0:1 | 8.8:1                | 13.0:1              | 3:1      |
| `edge`          | `board`          | Card edges against the board               | 3.2:1  | 4.0:1  | 6.7:1                | 8.1:1               | 3:1      |
| `edge`          | `surface`        | Card edges against the card                | 3.6:1  | 3.2:1  | 7.5:1                | 6.6:1               | 3:1      |
| `yes-edge`      | `board`          | Yes's edge against the board               | 4.8:1  | 9.4:1  | 7.2:1                | 12.6:1              | 3:1      |
| `yes-edge`      | `yes-fill`       | Yes's edge against its fill                | 4.6:1  | 6.6:1  | 6.5:1                | 9.9:1               | 3:1      |
| `no-edge`       | `board`          | No's edge against the board                | 5.8:1  | 8.2:1  | 8.1:1                | 10.9:1              | 3:1      |
| `no-edge`       | `no-fill`        | No's edge against its fill                 | 5.4:1  | 6.3:1  | 6.6:1                | 9.2:1               | 3:1      |
| `unsure-edge`   | `board`          | Not sure's edge against the board          | 5.3:1  | 7.3:1  | 8.1:1                | 12.4:1              | 3:1      |
| `unsure-edge`   | `unsure-fill`    | Not sure's edge against its fill           | 4.9:1  | 4.8:1  | 6.7:1                | 9.3:1               | 3:1      |
| `listen`        | `board`          | The light against the board                | 4.6:1  | 10.2:1 | 6.4:1                | 11.9:1              | 3:1      |

- **One table, every pair.** Every text and background pair the components
  name is in this table, and `check_contrast.py` fails a component whose pair
  isn't; the theme test recomputes the same pairs from the code.
- **The system decides the appearance.** Turn follows the iPhone's light or
  dark appearance, with `userInterfaceStyle: 'automatic'`, and offers no
  setting of its own: Apple says to "Avoid offering an app-specific appearance
  setting", and no one polarity suits every low-vision reader, since some read
  faster with light letters on dark ([AAC design notes][aac-polarity]).
- **Light is the reference.** Dark text on a light background reads faster for
  most people and for both age groups studied, so the light appearance is the
  one this document draws and checks first ([AAC design notes][aac-polarity]).
- **No pure-white glare on the board.** The light board is a pale gray, so
  white cards stand off it with their edges; the dark board is black, as in
  iOS's own dark appearance, with dark gray cards.

[aac-polarity]: /docs/research/aac-design.md#dark-mode-contrast-polarity-and-glare

## Typography

Turn uses the iPhone's own face, SF Pro, as `system-ui`, and bundles none. The
AAC design notes found no evidence that a special face, Atkinson Hyperlegible
included, reads better, and advise an ordinary iOS app in iOS's own type
([AAC design notes][aac-type]); the trends notes call the system font the
accessible choice for Turn ([trends notes][ft-nobans]). Each token takes the
name of the Apple text style whose Dynamic Type curve it follows, since the
format's linter rejects a ramp field ([trends notes][ft-tokens]).

```yaml
typography:
  largeTitle-emphasized:
    fontFamily: system-ui
    fontSize: 34px
    fontWeight: 700
    lineHeight: 41px
  title1-emphasized:
    fontFamily: system-ui
    fontSize: 28px
    fontWeight: 700
    lineHeight: 34px
  title2:
    fontFamily: system-ui
    fontSize: 22px
    fontWeight: 400
    lineHeight: 28px
  title3:
    fontFamily: system-ui
    fontSize: 20px
    fontWeight: 400
    lineHeight: 25px
  title3-emphasized:
    fontFamily: system-ui
    fontSize: 20px
    fontWeight: 600
    lineHeight: 25px
  headline:
    fontFamily: system-ui
    fontSize: 17px
    fontWeight: 600
    lineHeight: 22px
  body:
    fontFamily: system-ui
    fontSize: 17px
    fontWeight: 400
    lineHeight: 22px
  subheadline:
    fontFamily: system-ui
    fontSize: 15px
    fontWeight: 400
    lineHeight: 20px
  subheadline-emphasized:
    fontFamily: system-ui
    fontSize: 15px
    fontWeight: 600
    lineHeight: 20px
  footnote:
    fontFamily: system-ui
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18px
```

Sizes and leading are Apple's defaults at the Large text size, and the weights
are its regular and emphasized ones ([earlier iOS notes][ios-dt]).

| Token                    | Used for                                                     | `dynamicTypeRamp` | With Bold Text | At AX5 |
| ------------------------ | ------------------------------------------------------------ | ----------------- | -------------- | ------ |
| `largeTitle-emphasized`  | The consent card's lead sentence                             | `largeTitle`      | 800            | 60/70  |
| `title1-emphasized`      | The big button's phrase                                      | `title1`          | 800            | 58/68  |
| `title2`                 | The consent card's facts, and "Listening" as a session opens | `title2`          | 600            | 56/66  |
| `title3`                 | The partner's words in the caption                           | `title3`          | 600            | 55/65  |
| `title3-emphasized`      | Phrases in the row and the grid, and Yes, No, and Not sure   | `title3`          | 700            | 55/65  |
| `headline`               | Buttons, tabs, the Listen control, and a long phrase's step  | `headline`        | 700            | 53/62  |
| `body`                   | Settings, the permission step, the editor, and the notice    | `body`            | 600            | 53/62  |
| `subheadline`            | Speaker labels, notes, counts, and placeholders              | `subheadline`     | 600            | 49/58  |
| `subheadline-emphasized` | The strip's phrases                                          | `subheadline`     | 700            | 49/58  |
| `footnote`               | Legal lines under the paywall's link and in Settings         | `footnote`        | 600            | 44/52  |

- **Ramps.** Each text style sets its `dynamicTypeRamp`, so it grows the way
  the system's text does: without one, React Native multiplies every size by
  one factor, taking a 17-point Body to 60.7 points at AX5, where Apple's is
  53 ([iOS notes][ios-scale]).
- **Never shrunk by code.** No text sets `allowFontScaling={false}`,
  `maxFontSizeMultiplier`, or a fixed height, and only the row's slots and the
  caption set `numberOfLines`; see [the row](#the-row) and
  [the caption](#the-caption).
- **Bold Text.** React Native's font code ignores the setting, so one hook
  swaps each token to its Bold Text weight on `boldTextChanged`, for system
  text too, since nothing says it thickens by itself ([iOS notes][ios-bold]).
- **Left, sentence case, upright.** Text is left-aligned, so each line starts
  where the last one did, which helps readers who lose part of their visual
  field after a stroke ([AAC design notes][aac-type]); in sentence case, since
  capitals read slower; never in italics; and never in a weight under Regular
  ([trends notes][ft-type]).
- **Floors.** Nothing is under 15 points at the default size except legal
  lines, at 13; reading slows below about 13 characters a line, so the row
  and the grid lose columns before a phrase gets narrower
  ([AAC design notes][aac-type]).
- **Figures.** The free lines' count uses tabular figures,
  `fontVariant: ['tabular-nums']`, so it doesn't shift as it falls.
- **Pitch type.** Apple's license lets SF Pro appear only as the running app
  draws it, in screenshots and recordings of Turn. The video's titles, the
  Devpost thumbnail, the gallery's captions, and text in the README's images
  are set in Atkinson Hyperlegible Next, under the SIL Open Font License
  ([iOS notes][ios-pitch-fonts]).

[aac-type]: /docs/research/aac-design.md#text-size-line-length-and-fonts
[ios-dt]: /docs/research/ios-design.md#dynamic-type-sizes
[ios-scale]: /docs/research/turn-ios-design.md#scaling-text-in-react-native-086
[ios-bold]: /docs/research/turn-ios-design.md#bold-text-and-custom-fonts
[ft-type]: /docs/research/turn-frontend-trends.md#bold-large-and-variable-type
[ios-pitch-fonts]: /docs/research/turn-ios-design.md#fonts-in-the-video-and-gallery-images

## Layout

```yaml
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  margin: 16px
  target: 44px
  strip-cell: 48px
  slot: 78px
  bar: 52px
```

Sizes are points: the format's `px` means a point on the iPhone. `target` is
the smallest control, `strip-cell` the strip's shortest phrase button, `slot`
the row's slot and the grid's shortest phrase button, and `bar` the top bar's
height.

- **Why 78 points.** Speech buttons should be at least 12 mm on their short
  side for people with tremor or weakness, and errors kept falling up to 18 mm
  in one study ([AAC design notes][aac-targets]). Seventy-eight points is 12.2
  mm on a 326-ppi iPhone and 12.9 mm on a 460-ppi one, above A11Y-1's 64.
- **Why wide, with gaps.** Keys should be "wider instead of taller" for older
  hands, and zero spacing was least accurate, so phrase buttons are wider than
  tall, with 12 points between them ([AAC design notes][aac-targets]).

### The home screen

The home screen has no navigation bar, and its bands keep the PRD's order,
top to bottom (SPEAK-1):

```text
top bar     Settings  ·  place  ·  Listen control
the caption They said                                             Done or Clear
            "How was physio?"
the strip   Wait, I'm typing  |  Sorry, say that again  |  And you?
            I use this app to talk. Please give me time.  |  Something's wrong
the row     slot 1  |  slot 2
            slot 3  |  slot 4
            slot 5  |  slot 6
tabs        Quick  Feelings  Body and pain  …                           All
the grid    phrase  |  phrase                                        (scrolls)
bottom bar  Type  ·  Repeat or Stop  ·  Up  ·  Down
```

| Band        | Height at the default text size | What sets it                                                       |
| ----------- | ------------------------------- | ------------------------------------------------------------------ |
| Top bar     | 52 points                       | `bar`                                                              |
| The caption | 86 points                       | A label and two lines of `title3`, with one button beside them     |
| The strip   | About 120 points                | Two rows of cells whose phrases wrap to two lines on a phone       |
| The row     | 258 points                      | Three rows of 78-point slots and two 12-point gaps                 |
| Tabs        | 44 points                       | `target`                                                           |
| The grid    | The rest                        | About 100 points, one row, on a 6.1-inch iPhone; 200 on a 6.9-inch |
| Bottom bar  | 52 points                       | `bar`, above the home indicator                                    |

- **The grid gets what's left.** The PRD puts the strip and the row above the
  grid, and the row's 12-mm slots take their room, so on a 6.1-inch iPhone
  the grid shows one row of phrases at a time, and its page buttons move it a
  screen at a tap.

- **Gaps.** 8 points between bands, 12 inside the row and the grid, and 16
  from the screen's edges; the board's color runs under the status bar and
  the home indicator, and content stays inside the safe areas.
- **What doesn't scroll.** The top bar, the caption, the strip, the row, the
  tabs, and the bottom bar sit outside the grid's scroll view, so nothing
  collapses or slides them away ([iOS notes][ios-bars]); only the grid
  scrolls.
- **The thumb's band.** The strip and the row fill the middle of the screen,
  where one thumb reaches best, and the top bar holds only what isn't speech
  ([AAC design notes][aac-reach]).

[ios-bars]: /docs/research/turn-ios-design.md#bars-that-minimize-and-new-scroll-edges
[aac-reach]: /docs/research/aac-design.md#one-handed-use-and-where-controls-sit

### Widths

Turn lays out by the width it's given, not by the device, since an app built
with the iOS 27 SDK resizes on iPad and in iPhone Mirroring
([iOS notes][ios-resize]). A phrase column needs at least 154 points, about
13 characters of `title3-emphasized` inside 12-point padding.

| Width available      | The row                    | The strip                           | The grid                  |
| -------------------- | -------------------------- | ----------------------------------- | ------------------------- |
| Under 352 points     | One column of six slots    | One column                          | One column                |
| 352 to 517 points    | Two columns of three slots | Three columns, the fourth spans two | Two columns               |
| 518 points and wider | Three columns of two slots | Three columns, the fourth spans two | An even number of columns |

- **Slots keep their order.** Slots 1 to 6 read left to right, then down, at
  every width, so Yes, No, and Not sure are always first.
- **Checked at** 320, 375, 402, and 440 points wide, and on an iPad in a
  resized window.

### Short screens and large text

- **Short screens.** Where the space between the top bar and the screen's
  bottom is under 700 points, as on an iPhone SE, the caption, the strip, the
  row, the tabs, and the grid scroll together as one column, and only the top
  bar and the bottom bar stay put.
- **From AX1.** When the font scale reaches 1.786, at AX1, the row, the strip,
  and the grid take one column each, and everything between the top bar and
  the bottom bar scrolls as one column, as on short screens. Apple advises
  fewer columns as text grows ([iOS notes][ios-dt-turn]).
- **Heights follow the text size, never the content.** A slot's height is two
  lines of `title3-emphasized` at the current size plus its padding, and never
  less than 78 points; so at AX5 a slot is 154 points tall, and the row holds
  its height whatever it shows.

[ios-dt-turn]: /docs/research/turn-ios-design.md#dynamic-type-sizes-for-turns-styles

### With the keyboard up

- The composer docks above the keyboard; the tabs, the grid, and the bottom
  bar slip under it.
- The caption's words move into the composer's label, "Replying to", so the
  top bar, the strip, and the row stay in view above the composer.
- Where they don't fit, as on an iPhone SE, the space above the composer
  scrolls, the row first.

## Elevation

- **Depth by color and edges.** The board is the floor, cards sit on it with a
  2-point `edge`, and the big button stands out by its marker blue; nothing
  casts a shadow.
- **Liquid Glass from the system only.** Bars, sheets, alerts, and switches
  turn to glass by themselves, and Xcode 27 ignores
  `UIDesignRequiresCompatibility`, so an app can no longer opt out
  ([iOS notes][ios-key]). Turn draws no glass of its own and renders no
  `GlassView`: phrases, the caption, notes, and the consent card are content,
  where Apple says not to use glass ([iOS notes][ios-glass-content]).
- **Where the system's glass shows.** Settings' and the editor's navigation
  bars, the permission step's sheet, RevenueCat's paywall sheet, alerts, and
  the under-18 switch ([iOS notes][ios-chrome]). The home screen has no
  navigation bar, and the composer above the keyboard is solid, like every
  other place that holds words.
- **Sheets that hold reading text set a background.** Expo Router makes a
  form sheet's header and content transparent where glass is available, so the
  permission step sets `headerTransparent: false` and a `surface` background
  ([iOS notes][ios-glass-expo]).
- **Every glass setting leaves the words readable.** Reduce Transparency and
  the Liquid Glass slider, from clear to tinted, change only the system's
  chrome, which follows them with no code from Turn; Increase Contrast also
  moves Turn's own colors to their `-hc` values
  ([iOS notes][ios-glass-settings]).

[ios-key]: /docs/research/turn-ios-design.md#the-compatibility-key-under-xcode-27
[ios-chrome]: /docs/research/turn-ios-design.md#turns-chrome-that-turns-to-glass
[ios-glass-expo]: /docs/research/turn-ios-design.md#glass-in-expo-sdk-57-and-how-to-avoid-it
[ios-glass-settings]: /docs/research/turn-ios-design.md#settings-that-change-glass

## Shapes

```yaml
rounded:
  sm: 8px
  md: 12px
  lg: 16px
  full: 9999px
```

- **Cards** for phrases, the caption, Yes, No, and Not sure take `md`; the big
  button, larger, takes `lg`.
- **Capsules** for controls that hold one word or two: the Listen control,
  the place picker, tabs, and the caption's and the composer's buttons take
  `full`, "a radius that's half the height" ([earlier iOS notes][ios-capsule]).
- **Edges.** Cards and secondary buttons have a 2-point `edge`; Yes, No, and
  Not sure a 3-point edge in their own color; the selected tab and marker-blue
  fills need none.
- **Concentric.** A shape inside another takes the outer radius minus the
  padding between them; `sm` is for small marks inside cards, such as the
  speaking symbol.

[ios-capsule]: /docs/research/ios-design.md#glass-in-custom-controls

## Components

Each component below is written for the light appearance. For every pair of
text and background colors, one component also appears as `-dark`,
`-light-hc`, and `-dark-hc`, naming that appearance's colors, so the linter
checks all four; edges appear the same way, and every other property is the
light entry's. The format has no border property, so an edge is a component of
its own whose `height` is its width.

```yaml
components:
  phrase:
    backgroundColor: '{colors.surface.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.title3-emphasized}'
    rounded: '{rounded.md}'
    padding: 12px
    height: 78px
  phrase-pressed:
    backgroundColor: '{colors.pressed.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.title3-emphasized}'
    rounded: '{rounded.md}'
    padding: 12px
    height: 78px
  big:
    backgroundColor: '{colors.accent.light}'
    textColor: '{colors.on-accent.light}'
    typography: '{typography.title1-emphasized}'
    rounded: '{rounded.lg}'
    padding: 16px
  big-pressed:
    backgroundColor: '{colors.accent-pressed.light}'
    textColor: '{colors.on-accent.light}'
    typography: '{typography.title1-emphasized}'
    rounded: '{rounded.lg}'
    padding: 16px
  yes:
    backgroundColor: '{colors.yes-fill.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.title3-emphasized}'
    rounded: '{rounded.md}'
    padding: 12px
    height: 78px
  no:
    backgroundColor: '{colors.no-fill.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.title3-emphasized}'
    rounded: '{rounded.md}'
    padding: 12px
    height: 78px
  unsure:
    backgroundColor: '{colors.unsure-fill.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.title3-emphasized}'
    rounded: '{rounded.md}'
    padding: 12px
    height: 78px
  strip-phrase:
    backgroundColor: '{colors.surface.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.subheadline-emphasized}'
    rounded: '{rounded.md}'
    padding: 8px
    height: 48px
  caption:
    backgroundColor: '{colors.surface.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.title3}'
    rounded: '{rounded.md}'
    padding: 8px
    height: 86px
  caption-label:
    backgroundColor: '{colors.surface.light}'
    textColor: '{colors.ink-secondary.light}'
    typography: '{typography.subheadline}'
  note:
    backgroundColor: '{colors.board.light}'
    textColor: '{colors.ink-secondary.light}'
    typography: '{typography.subheadline}'
  light:
    backgroundColor: '{colors.listen.light}'
    textColor: '{colors.on-listen.light}'
    typography: '{typography.headline}'
    rounded: '{rounded.full}'
    padding: 12px
    height: 44px
  tab:
    backgroundColor: '{colors.surface.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.headline}'
    rounded: '{rounded.full}'
    padding: 12px
    height: 44px
  tab-selected:
    backgroundColor: '{colors.ink.light}'
    textColor: '{colors.surface.light}'
    typography: '{typography.headline}'
    rounded: '{rounded.full}'
    padding: 12px
    height: 44px
  button-primary:
    backgroundColor: '{colors.accent.light}'
    textColor: '{colors.on-accent.light}'
    typography: '{typography.headline}'
    rounded: '{rounded.full}'
    padding: 16px
    height: 52px
  button-secondary:
    backgroundColor: '{colors.surface.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.headline}'
    rounded: '{rounded.full}'
    padding: 16px
    height: 52px
  link:
    backgroundColor: '{colors.surface.light}'
    textColor: '{colors.accent.light}'
    typography: '{typography.body}'
  consent-lead:
    backgroundColor: '{colors.board.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.largeTitle-emphasized}'
  edge:
    backgroundColor: '{colors.edge.light}'
    height: 2px
  yes-edge:
    backgroundColor: '{colors.yes-edge.light}'
    height: 3px
  no-edge:
    backgroundColor: '{colors.no-edge.light}'
    height: 3px
  unsure-edge:
    backgroundColor: '{colors.unsure-edge.light}'
    height: 3px
  phrase-dark:
    backgroundColor: '{colors.surface.dark}'
    textColor: '{colors.ink.dark}'
  phrase-light-hc:
    backgroundColor: '{colors.surface.light-hc}'
    textColor: '{colors.ink.light-hc}'
  phrase-dark-hc:
    backgroundColor: '{colors.surface.dark-hc}'
    textColor: '{colors.ink.dark-hc}'
  phrase-pressed-dark:
    backgroundColor: '{colors.pressed.dark}'
    textColor: '{colors.ink.dark}'
  phrase-pressed-light-hc:
    backgroundColor: '{colors.pressed.light-hc}'
    textColor: '{colors.ink.light-hc}'
  phrase-pressed-dark-hc:
    backgroundColor: '{colors.pressed.dark-hc}'
    textColor: '{colors.ink.dark-hc}'
  big-dark:
    backgroundColor: '{colors.accent.dark}'
    textColor: '{colors.on-accent.dark}'
  big-light-hc:
    backgroundColor: '{colors.accent.light-hc}'
    textColor: '{colors.on-accent.light-hc}'
  big-dark-hc:
    backgroundColor: '{colors.accent.dark-hc}'
    textColor: '{colors.on-accent.dark-hc}'
  big-pressed-dark:
    backgroundColor: '{colors.accent-pressed.dark}'
    textColor: '{colors.on-accent.dark}'
  big-pressed-light-hc:
    backgroundColor: '{colors.accent-pressed.light-hc}'
    textColor: '{colors.on-accent.light-hc}'
  big-pressed-dark-hc:
    backgroundColor: '{colors.accent-pressed.dark-hc}'
    textColor: '{colors.on-accent.dark-hc}'
  yes-dark:
    backgroundColor: '{colors.yes-fill.dark}'
    textColor: '{colors.ink.dark}'
  yes-light-hc:
    backgroundColor: '{colors.yes-fill.light-hc}'
    textColor: '{colors.ink.light-hc}'
  yes-dark-hc:
    backgroundColor: '{colors.yes-fill.dark-hc}'
    textColor: '{colors.ink.dark-hc}'
  no-dark:
    backgroundColor: '{colors.no-fill.dark}'
    textColor: '{colors.ink.dark}'
  no-light-hc:
    backgroundColor: '{colors.no-fill.light-hc}'
    textColor: '{colors.ink.light-hc}'
  no-dark-hc:
    backgroundColor: '{colors.no-fill.dark-hc}'
    textColor: '{colors.ink.dark-hc}'
  unsure-dark:
    backgroundColor: '{colors.unsure-fill.dark}'
    textColor: '{colors.ink.dark}'
  unsure-light-hc:
    backgroundColor: '{colors.unsure-fill.light-hc}'
    textColor: '{colors.ink.light-hc}'
  unsure-dark-hc:
    backgroundColor: '{colors.unsure-fill.dark-hc}'
    textColor: '{colors.ink.dark-hc}'
  caption-label-dark:
    backgroundColor: '{colors.surface.dark}'
    textColor: '{colors.ink-secondary.dark}'
  caption-label-light-hc:
    backgroundColor: '{colors.surface.light-hc}'
    textColor: '{colors.ink-secondary.light-hc}'
  caption-label-dark-hc:
    backgroundColor: '{colors.surface.dark-hc}'
    textColor: '{colors.ink-secondary.dark-hc}'
  note-dark:
    backgroundColor: '{colors.board.dark}'
    textColor: '{colors.ink-secondary.dark}'
  note-light-hc:
    backgroundColor: '{colors.board.light-hc}'
    textColor: '{colors.ink-secondary.light-hc}'
  note-dark-hc:
    backgroundColor: '{colors.board.dark-hc}'
    textColor: '{colors.ink-secondary.dark-hc}'
  light-dark:
    backgroundColor: '{colors.listen.dark}'
    textColor: '{colors.on-listen.dark}'
  light-light-hc:
    backgroundColor: '{colors.listen.light-hc}'
    textColor: '{colors.on-listen.light-hc}'
  light-dark-hc:
    backgroundColor: '{colors.listen.dark-hc}'
    textColor: '{colors.on-listen.dark-hc}'
  tab-selected-dark:
    backgroundColor: '{colors.ink.dark}'
    textColor: '{colors.surface.dark}'
  tab-selected-light-hc:
    backgroundColor: '{colors.ink.light-hc}'
    textColor: '{colors.surface.light-hc}'
  tab-selected-dark-hc:
    backgroundColor: '{colors.ink.dark-hc}'
    textColor: '{colors.surface.dark-hc}'
  link-dark:
    backgroundColor: '{colors.surface.dark}'
    textColor: '{colors.accent.dark}'
  link-light-hc:
    backgroundColor: '{colors.surface.light-hc}'
    textColor: '{colors.accent.light-hc}'
  link-dark-hc:
    backgroundColor: '{colors.surface.dark-hc}'
    textColor: '{colors.accent.dark-hc}'
  consent-lead-dark:
    backgroundColor: '{colors.board.dark}'
    textColor: '{colors.ink.dark}'
  consent-lead-light-hc:
    backgroundColor: '{colors.board.light-hc}'
    textColor: '{colors.ink.light-hc}'
  consent-lead-dark-hc:
    backgroundColor: '{colors.board.dark-hc}'
    textColor: '{colors.ink.dark-hc}'
  edge-dark:
    backgroundColor: '{colors.edge.dark}'
  edge-light-hc:
    backgroundColor: '{colors.edge.light-hc}'
  edge-dark-hc:
    backgroundColor: '{colors.edge.dark-hc}'
  yes-edge-dark:
    backgroundColor: '{colors.yes-edge.dark}'
  yes-edge-light-hc:
    backgroundColor: '{colors.yes-edge.light-hc}'
  yes-edge-dark-hc:
    backgroundColor: '{colors.yes-edge.dark-hc}'
  no-edge-dark:
    backgroundColor: '{colors.no-edge.dark}'
  no-edge-light-hc:
    backgroundColor: '{colors.no-edge.light-hc}'
  no-edge-dark-hc:
    backgroundColor: '{colors.no-edge.dark-hc}'
  unsure-edge-dark:
    backgroundColor: '{colors.unsure-edge.dark}'
  unsure-edge-light-hc:
    backgroundColor: '{colors.unsure-edge.light-hc}'
  unsure-edge-dark-hc:
    backgroundColor: '{colors.unsure-edge.dark-hc}'
```

### The phrase button

- **Look.** A `surface` card with a 2-point `edge`, `md` corners, 12-point
  padding, and the phrase in `title3-emphasized`, `ink`, left-aligned and
  wrapped; at least 78 points tall and as wide as its column. The whole card is
  the target.
- **Press.** The fill turns `pressed` at once and back on release, with no
  change of size; the phrase speaks on release, and sliding off cancels
  ([motionsites notes][ms-app]).
- **Speaking.** While its phrase speaks, the card shows `speaker.wave.2` at its
  top trailing corner, in its text's color: `ink` on cards and tints, and
  `on-accent` on the big button.
- **Accessibility.** Its label is its text and its trait is button, and Edit
  and Move are named actions, never long presses (A11Y-2, A11Y-8)
  ([TRD][trd-a11y]).

### The row

The row's height and its six slots are fixed for the text size and the width
(ROW-1); only what's in a slot changes.

- **Filling.** Replies fill slots from the first, as ROW-5 moves them; an empty
  slot shows the board, with no frame, so it doesn't look like a button. When
  all six are empty, the first two slots' space shows a note in `subheadline`,
  `ink-secondary`: "Replies to your partner appear here.", or, with the
  under-18 switch on, "Listen mode is off for this partner." (CONSENT-6).
  Until the starter phrases are reviewed, the empty row holds their
  invitation instead ([the first launch](#the-first-launch)).
- **A phrase too long for its slot.** A slot holds two lines of
  `title3-emphasized`; a longer phrase steps down to `headline`'s size, still
  two lines, and past that ends with an ellipsis. VoiceOver reads the whole
  phrase, a tap speaks the whole phrase, and the grid shows it whole (A11Y-4).
  Phrases short enough to fit, with their key words first, choose faster
  ([AAC design notes][aac-cost]).
- **The big button.** When ROW-3 shows one, it fills the frame of all six
  slots: marker blue, `lg` corners, 16-point padding, and the phrase in
  `title1-emphasized`, `on-accent`, left-aligned at the top. It's still just a
  phrase: no label, no badge, and it speaks only on a tap (ROW-6). Its phrase
  moves to the first free slot afterward if it stays at or above the floor
  (ROW-5).
- **Yes, No, and Not sure.** In slots 1 to 3 for a yes-or-no question (ROW-4),
  as `yes`, `no`, and `unsure`: the word in `title3-emphasized`, `ink`, on its
  tint, inside a 3-point edge of its color, with no symbol, since `checkmark`
  and `xmark` already mean Done and Cancel in iOS ([iOS notes][ios-symbols]).
  The Quick category shows them the same way.
- **A row that holds.** When a line gets no phrase above the floor, nothing in
  the row changes (ROW-3), and the caption says which line the replies still
  answer, rather than dimming them ([AAC design notes][aac-stale]).
- **No confidence shown.** No percentages, bars, sparkles, or badges: the row's
  three states, one big button, up to six phrases, or no change, already say
  how sure Turn is, as Apple's and Google's guides advise
  ([AAC design notes][aac-confidence]).
- **The press guard.** A new answer that would change a slot waits while a
  finger is on it, and lands when the finger lifts
  ([AAC design notes][aac-stale]).
- **Announcing.** A changed row is announced once, as the number of replies:
  "3 replies", or "1 reply" for the big button (A11Y-2).

[aac-cost]: /docs/research/aac-design.md#what-prediction-displays-cost
[ios-symbols]: /docs/research/turn-ios-design.md#symbols-for-speaking-listening-and-answering
[aac-stale]: /docs/research/aac-design.md#stale-rows-empty-rows-and-targets-that-move

### The strip

- **Look.** Five `strip-phrase` cards in a fixed order: "Wait, I'm typing",
  "Sorry, say that again", and "And you?" in the first row, and "I use this
  app to talk. Please give me time.", spanning two columns, and "Something's
  wrong" in the second (SPEAK-7). Text in `subheadline-emphasized` wraps and
  is never cut; cells are at least 48 points tall, with 8 points between them.
- **"Something's wrong"** leads with `exclamationmark.triangle`, in `ink`, the
  strip's one symbol.
- **Why whole phrases.** A11Y-2 and A11Y-8 ask a phrase button to read, and be
  named, as its text, so the strip shows each phrase in full rather than a
  short label. Reworded phrases keep their places, and the strip's height
  follows its words only when the user rewords one.
- **Why 48 points.** The strip's cells fall short of the 12 mm the row gets, a
  trade for keeping the grid on screen; they're wider than tall, and the
  [open questions](#open-questions) keep the choice open.

### The caption

The caption shows the partner's words in Listen mode; outside it, it says so:
"Listen mode is off."

- **Look.** A `caption` card across the screen, 86 points tall at the default
  size: a speaker label in `subheadline`, `ink-secondary`, then up to two lines
  of words in `title3`, `ink`, with one capsule button at its trailing edge.
- **Words.** A long partner line shows its last two lines, cut at the start
  with an ellipsis, since the newest words matter most, and VoiceOver reads
  the whole line. The words, and the partner's words that "Still answering"
  and "Replying to" quote, live only in memory and clear as LISTEN-8 says.
- **The button.** Done while a partner line is open (LISTEN-2), and Clear when
  the row holds replies (ROW-10); it never moves, so a hand learns it.
- **Notes.** A note replaces the speaker label's right half, with its symbol:
  the phone ranked the replies (STATE-1), Listen mode is degraded (STATE-2,
  STATE-3), Listen mode is off for this partner (CONSENT-6), live
  transcription isn't available (LISTEN-9), or the speech model is
  downloading, with a progress bar under the words (LISTEN-1).
- **Tap.** In Listen mode, a tap on the words opens the composer for the
  partner's words (LISTEN-4).

### The Listen control

The top bar's trailing control, in `headline`, with its symbol before its
word:

| State     | Looks                                                       | A tap                                                                 |
| --------- | ----------------------------------------------------------- | --------------------------------------------------------------------- |
| Off       | A card capsule: `ear`, "Listen", and the free lines left    | Starts Listen mode: the permission step the first time, then the card |
| Locked    | A card capsule: `lock`, "Listen", and "Unlock"              | Opens the paywall (PAY-2)                                             |
| Listening | The `light`: an orange capsule, `mic.fill`, and "Listening" | Pauses (CONSENT-5)                                                    |
| Paused    | A card capsule: `mic.slash`, "Paused", with End beside it   | Resumes without the card; End stops Listen mode and clears the row    |
| Mic off   | A card capsule: `mic.slash`, "Mic off", with End beside it  | Nothing: the caption says why (CONSENT-6, LISTEN-9); End stops it     |

- **The light.** Its symbol fades in and out while the partner's words
  arrive, for at most five seconds a line, and holds still otherwise, and
  always under Reduce Motion; a word and a symbol carry its meaning, and the
  color is a third cue
  ([AAC design notes][aac-light]).
- **Large at first.** When a session starts, the caption says "Listening" in
  `title2` until the first words arrive, since small lights go unnoticed
  ([AAC design notes][aac-light]).
- **Free lines.** The count, "20 free", sits under "Listen" in `subheadline`,
  in tabular figures, until Turn Listen is bought (PAY-1).

[aac-light]: /docs/research/aac-design.md#showing-a-bystander-that-a-device-listens

### The place picker

A card capsule in the top bar with `mappin.and.ellipse` and the place's name.
A tap opens iOS's own menu of the user's places, and one tap on a place
chooses it (PLACE-1).

### The tabs

- **Look.** One capsule per category, in the bank's order with Quick first
  (BANK-5), as `tab`; the selected one is `tab-selected`, `surface` words on an
  `ink` fill.
- **The mark.** The tab ROW-9 marks adds a dot before its name, in `accent`,
  or in `surface` on the selected tab, sets its name one weight heavier than
  the other tabs', and gets "suggested" as its accessibility value; the tabs
  never scroll or reorder to show it.
- **All.** The tabs scroll sideways when they don't fit, but All, fixed at the
  trailing end, lists every category at once, the marked one with its dot,
  since older adults miss sideways scrolling ([AAC design notes][aac-grid]).

### The grid

- **Look.** The selected category's phrases as phrase buttons, in the bank's
  order (BANK-4), in the columns [Widths](#widths) gives; every button in a
  grid row takes the row's tallest height, and text is never cut.
- **Scrolling.** Up and down only, with the system's scroll indicator, and
  the bottom bar's Up and Down move it a screen at a tap, so it never needs a
  swipe (A11Y-5), as the AAC notes advise ([AAC design notes][aac-grid]).

### The bottom bar

A 52-point bar above the home indicator, with four capsule buttons in
`headline`, each a symbol and a word, and 8 points between them:

- **Type** (`keyboard`) opens the composer (SPEAK-1, SPEAK-3).
- **Repeat** (`arrow.counterclockwise`) says the last spoken text again
  (SPEAK-6), and becomes **Stop** (`stop.fill`) while Turn speaks (SPEAK-2),
  in the same place.
- **Up** and **Down** (`chevron.up` and `chevron.down`) scroll the grid by a
  screen, or the whole column on short screens and from AX1.
- **At large sizes** the four take two rows, so no label is cut.

### The composer

- **Your words.** Docked above the keyboard: a field in `body` that grows to
  four lines and then scrolls, "Replying to" and the partner's line above it in
  Listen mode, and Speak as `button-primary` (SPEAK-3). While Turn speaks,
  Speak becomes Stop. Within 50 characters of the 500-character limit, a count
  in `subheadline` says how many are left.
- **Their words.** The same composer, labeled "What did they say?" (LISTEN-4),
  with Send as `button-secondary`, never marker blue, so a partner's words
  can't be mistaken for the user's.

### Buttons and lists

- **Primary.** `button-primary`: a marker-blue capsule, 52 points tall, its
  word in `headline`, `on-accent`; at most one to a screen.
- **Secondary.** `button-secondary`: a card capsule with a 2-point edge.
- **Equal pairs.** "Allow" and "Not now", and "They agreed" and "They said no",
  are two secondary buttons of one size and style, side by side, stacked from
  AX1: Apple marks a preferred choice by "style — not size", and neither of
  these is preferred ([iOS notes][ios-hig-changes]).
- **Lists.** Settings and the editor use grouped rows at least 52 points tall
  on the board, with `body` text and `link` for links.
- **Symbol buttons.** At least 44 by 44 points, each with a label.

[ios-hig-changes]: /docs/research/turn-ios-design.md#hig-changes-since-june-2025

## Motion

Motion answers someone: the user, the partner, or a reply arriving. The format
has no motion tokens, and its maintainer points motion to prose, so this table
is the whole inventory ([trends notes][ft-proposals]).

| What moves          | When                             | How                                                                      | Under Reduce Motion |
| ------------------- | -------------------------------- | ------------------------------------------------------------------------ | ------------------- |
| A slot's phrase     | A new answer changes the slot    | The old phrase fades out and the new one in, 150 ms                      | Swaps at once       |
| The big button      | It appears or leaves             | Cross-fades over the six slots' frame, 200 ms                            | Swaps at once       |
| The light's symbol  | While the partner's words arrive | Opacity from 100% to 35% and back, 1.2 s a cycle, for at most 5 s a line | Holds at 100%       |
| A pressed control   | While a finger is on it          | Its fill changes at once                                                 | The same            |
| The caption's words | As the partner speaks            | Words appear as they're heard, with no animation                         | The same            |
| Sheets and menus    | They open or close               | The system's own                                                         | The system's own    |

- **Nothing else moves.** No entrances, staggers, springs, parallax, shimmer,
  skeletons, or loops; the grid never animates; and a press changes the fill,
  never the size, so the target stays where the finger is
  ([motionsites notes][ms-app]).
- **Fades, not slides.** A new phrase appears in its slot's frame, with no
  movement or scaling, so it stays where a finger, a pointer, or a gaze left it
  ([iOS notes][ios-put]).
- **The light's fade has an end.** It runs only while words arrive, and for
  no more than five seconds a line, so it stays inside WCAG 2.2.2's five
  seconds; a light that pulses all session is the ambient loop that criterion
  asks to pause ([motionsites notes][ms-motion]).
- **One flag.** A store reads `AccessibilityInfo.isReduceMotionEnabled()` at
  launch and follows `reduceMotionChanged`, and every animation reads it,
  because Reanimated's `useReducedMotion()` reports only the setting at launch
  and its CSS animations ignore it ([trends notes][ft-reanimated]). Each
  animation sets `reduceMotion: ReduceMotion.Never`, so the flag, not
  Reanimated, decides.
- **No symbol effects.** The light's fade is Reanimated's, not an SF Symbols
  effect, since `expo-symbols` never reads Reduce Motion
  ([iOS notes][ios-light]).

[ft-proposals]: /docs/research/turn-frontend-trends.md#modes-motion-and-accessibility-in-open-proposals
[ios-put]: /docs/research/turn-ios-design.md#motion-when-buttons-stay-put
[ms-motion]: /docs/research/turn-motionsites.md#motion-222-and-233
[ft-reanimated]: /docs/research/turn-frontend-trends.md#reanimated-and-moti

## Sound and haptics

- **Speech is the only sound.** No clicks, chimes, or earcons: the partner
  would hear them, and they'd compete with the words Turn speaks.
- **No haptics.** A recording app plays no haptics unless it opts in, since
  `allowHapticsAndSystemSoundsDuringRecording` defaults to false, and a
  vibration could disrupt the microphone during Listen mode; elsewhere a
  phrase's feedback is its pressed fill and its speech, so a haptic would carry
  no meaning ([iOS notes][ios-haptics]).
- **Volume and route.** Speech follows the phone's volume and plays from the
  loudspeaker in Listen mode, as VOICE-4 and the
  [TRD's audio session](/docs/TRD.md#the-audio-session) set.

[ios-haptics]: /docs/research/turn-ios-design.md#haptics-while-turn-listens-or-speaks

## Screens

Each screen uses the components above; the TRD's
[routes](/docs/TRD.md#screens-and-navigation) name them.

### The home screen, state by state

| State                 | The caption                                              | The row                                             | The Listen control      |
| --------------------- | -------------------------------------------------------- | --------------------------------------------------- | ----------------------- |
| First launch          | "Listen mode is off."                                    | The starter phrases' invitation (BANK-10)           | Off, "20 free"          |
| Listen mode off       | "Listen mode is off."                                    | Typing's matches while the keyboard is up (SPEAK-4) | Off                     |
| A session opening     | "Listening", large                                       | Empty                                               | Listening               |
| A partner speaking    | "They're saying", the words so far, and Done             | As it was                                           | Listening, symbol fades |
| Replies ready         | "They said", their line, and Clear                       | Up to six, the big button, or Yes, No, Not sure     | Listening               |
| Nothing fits          | "They said", the new line, and "Still answering" note    | As it was (ROW-3)                                   | Listening               |
| Ranked on the phone   | A "Ranked on this phone" note (STATE-1, STATE-2)         | The phone's replies                                 | Listening               |
| Degraded              | A "Listen mode is degraded" note (STATE-2, STATE-3)      | The phone's replies                                 | Listening               |
| Paused                | "Paused", with the words cleared (LISTEN-8)              | As it was                                           | Paused, with End        |
| A partner under 18    | The CONSENT-6 note and "Tap here to type what they say." | The phone's replies to typed lines                  | Mic off, with End       |
| No live transcription | The LISTEN-9 note and "Tap here to type what they say."  | Replies to typed lines                              | Mic off, with End       |
| Turn speaking         | As it was                                                | The spoken phrase's card shows its speaker symbol   | As it was               |
| Free lines used up    | Unchanged                                                | Empty                                               | Locked                  |

- **Stopping Listen mode** clears the row (ROW-10) and returns the caption to
  "Listen mode is off."
- **While Turn speaks,** the bottom bar's Repeat becomes Stop (SPEAK-2).
- **Leaving the app** pauses listening, and on return the control shows Paused
  until a tap (LISTEN-7).

### Typing

The composer docks above the keyboard, with "Replying to" and the partner's
line above the field in Listen mode; the row shows the phrases matching the
letters typed (SPEAK-4) and returns to its last answer when the keyboard
closes. Speak says the text and adds it to Typed (SPEAK-3), and the caption
keeps what it showed.

### The permission step

`/permission`, a form sheet at full height, since it's for reading, on a
`surface` background (CONSENT-1):

- A title in `title2`, then short paragraphs in `body` that say what leaves
  the phone with each partner line (ROW-2), that names Turn recognizes are
  swapped for tags, to whom it goes, that audio and the rest of the bank never
  leave, and that the service may keep data to monitor its service.
- A link to the privacy notice, which reads with no network (SET-2).
- "Allow" and "Not now" as an equal pair at the bottom.
- Every word is text, never an image, so Accessibility Reader and VoiceOver
  read it ([iOS notes][ios-reader]).

[ios-reader]: /docs/research/turn-ios-design.md#accessibility-features-in-ios-26-and-27

### The consent card

`/consent`, full screen on the board, laid out to be read at arm's length
from across a table or beside a mounted phone (CONSENT-4)
([AAC design notes][aac-mounted]):

- **The lead**, one sentence in the partner's terms, in
  `largeTitle-emphasized`.
- **The facts** CONSENT-4 lists, one to a line, in `title2`: what the phone
  does with their words, where the words go and why, that no audio is
  recorded, and that listening can be paused at any time.
- **The switch** "My partner is under 18" in a list row (CONSENT-6).
- **Read aloud**, a secondary button that speaks the lead and the facts in the
  chosen voice on the user's tap, since talking one to one beats a written
  notice and guests want to be told by the owner
  ([AAC design notes][aac-consent]). It's the design's addition to CONSENT-4,
  which says what the card holds but not how a partner who can't read it
  learns it.
- **"They agreed" and "They said no"**, an equal pair at the bottom, within a
  thumb's reach; the microphone starts only after "They agreed".
- **One decision.** The card asks one question, and its only other control
  is the under-18 switch, so the partner can answer at a glance
  ([AAC design notes][aac-consent]).

[aac-mounted]: /docs/research/aac-design.md#mounted-phones-and-wheelchairs
[aac-consent]: /docs/research/aac-design.md#consent-notices-people-read

### Settings

`/settings`, a native stack screen with grouped lists on the board, in the
order SET-1 gives:

- **Voice.** The voice, with a preview for each; the speech rate as a list of
  five steps, each chosen with one tap, since a slider needs a drag (A11Y-5);
  and Personal Voice, with VOICE-2's explanation when iOS says no.
- **Listen mode.** Its permission, with Withdraw (CONSENT-3), and the under-18
  switch (CONSENT-6).
- **Your words.** Places and the phrase bank.
- **Turn Listen.** "Unlock Listen mode", which opens the paywall, or
  "Unlocked"; and Restore Purchases (PAY-6).
- **About.** The privacy notice, the open-source licenses, and the version
  with the relay's status.
- **Last.** Stats on this phone (SET-4), then Erase all data (SET-3), whose
  confirmation is a system alert with a destructive button.

### The phrase bank editor

`/bank/[category]`, a native stack screen for one category (BANK-2):

- **Rows.** Each phrase in `body`, wrapped, with its places under it in
  `subheadline`; a starter phrase nobody has reviewed shows "Starter"
  (BANK-10).
- **Order without dragging.** In edit mode, each row shows Move up and Move
  down; Edit, Move, and Delete are also named accessibility actions (A11Y-8).
- **Delete and Undo.** A deleted phrase hides, and an Undo bar stays at the
  bottom until the user leaves the editor, with no timer (BANK-9, A11Y-5).
- **What can't be deleted.** Yes, No, Not sure, and the body and pain category
  offer no Delete (BANK-5).
- **Adding or editing.** A sheet with the phrase field, which stops at 200
  characters and counts down near the end (BANK-3), its category, and its
  places.

### The first launch

The home screen is ready to speak within two seconds (PERF-3), with the grid
showing phrases at once (SPEAK-1). The empty row holds the invitation, in place
of its note: a card that says the starter phrases are the team's words, with
Review, which walks the editor category by category, and Not now (BANK-10). It
sits inside the row's fixed frame, so nothing moves when it goes; replies take
its place whenever the row has them, and it returns to an empty row until
every category is reviewed or the user taps Not now.

### The paywall

RevenueCat's paywall, over the current screen (PAY-2), built in RevenueCat's
editor to match:

- **Content.** Text only: a title, one line saying Turn Listen is one payment
  and speaking stays free, the package's price, a marker-blue purchase button
  with `on-accent` text, white in light and near-black in dark, Restore
  Purchases, the legal links, and the close button.
- **Nothing that moves.** No images, carousel, video, or transitions, since
  paywalls keep carousels and component transitions moving under Reduce
  Motion ([iOS notes][ios-paywall-a11y]).
- **Colors and type.** The tokens' light and dark values, since paywalls have
  no increased-contrast values, each pair at 4.5 to 1 or more without
  Increase Contrast; the system font, since Apple's license bars uploading SF
  Pro; and sizes that follow Dynamic Type, which paywalls do unless the
  dashboard turns it off ([iOS notes][ios-paywall-limits];
  [iOS notes][ios-paywall-a11y]).
- **Test Store's alert.** Test Store's purchase alert is UIKit's own, so
  there's nothing to design, and the video names it as a test purchase
  ([iOS notes][ios-test-store]).

[ios-paywall-a11y]: /docs/research/turn-ios-design.md#dynamic-type-voiceover-and-reduce-motion-in-paywalls
[ios-paywall-limits]: /docs/research/turn-ios-design.md#limits-on-matching-turns-design
[ios-test-store]: /docs/research/turn-ios-design.md#the-paywall-under-test-store

### Launch

The launch screen is the board's color, `#F2F2F7` in light and `#000000` in
dark, with no image, since Apple says to "Avoid using a launch screen as a
branding opportunity" ([iOS notes][ios-launch]); the grid follows within two
seconds.

[ios-launch]: /docs/research/turn-ios-design.md#the-launch-screen-in-expo-sdk-57

## Words on screen

### Tone

- **Plain, calm, and adult.** Short sentences in sentence case, with no
  exclamation marks, celebrations, streaks, or pity: in one survey, 93% of
  adults who need AAC named being spoken to "as an adult" as a need
  ([AAC design notes][aac-tone]).
- **The words are the user's.** Turn never hedges, labels, or rates a phrase,
  and never calls a reply suggested, smart, or AI; "AI" appears only in the
  words CONSENT-1 fixes.
- **Speaker labels by role.** The caption labels the partner's words "They
  said" or "They're saying", never "Partner".
- **Unnamed until agreed.** Jev and TypeSafe appear in no string until
  TypeSafe agrees, and the texts follow the relay's setting (CONSENT-7,
  SUBMIT-6); `{service}` below is "TypeSafe" or "a third-party AI service in
  the United States".
- **Failures stay quiet.** A note says what happened and what still works, in
  one line, with no alarm color, since a breakdown in public is a social one
  too ([AAC design notes][aac-stigma]).

[aac-tone]: /docs/research/aac-design.md#identity-and-tone

### Strings the PRD leaves open

The PRD fixes the strip's phrases, the Quick category's, "Listening", "Allow",
"Not now", "They agreed", "They said no", "My partner is under 18", "What did
they say?", and the names of buttons and settings; these are the rest.

| Where                           | Words                                                                                                   | For                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------- |
| The Listen control              | "Listen", and "20 free" counting down; "Unlock" once none are left                                      | PAY-1, PAY-2                  |
| Paused, and its End             | "Paused" and "End"                                                                                      | CONSENT-5                     |
| Under 18                        | "Mic off"                                                                                               | CONSENT-6                     |
| The caption, out of Listen mode | "Listen mode is off."                                                                                   | LISTEN-1                      |
| The caption, while hearing      | "They're saying"                                                                                        | LISTEN-1                      |
| The caption, after a line       | "They said"                                                                                             | LISTEN-1                      |
| The caption, when the row holds | "Still answering “How was physio?”"                                                                     | ROW-3                         |
| Notes                           | "Ranked on this phone"; "Listen mode is degraded"; "Listen mode is off for this partner"                | STATE-1 to STATE-3, CONSENT-6 |
| No live transcription           | "Live transcription isn't available here. Tap here to type what they say."                              | LISTEN-9                      |
| The speech model                | "Getting Apple's English speech model", with its progress                                               | LISTEN-1                      |
| The empty row                   | "Replies to your partner appear here."                                                                  | ROW-1                         |
| The empty row, under 18         | "Listen mode is off for this partner."                                                                  | CONSENT-6                     |
| A changed row, to VoiceOver     | "3 replies", or "1 reply"                                                                               | A11Y-2                        |
| The composer                    | "Type what to say", "Speak", and "Replying to “How was physio?”"                                        | SPEAK-3                       |
| The partner's composer          | "Send"                                                                                                  | LISTEN-4                      |
| The tabs and the bottom bar     | "All"; "Type", "Repeat", "Stop", "Up", and "Down"                                                       | ROW-9, SPEAK-1                |
| The permission step             | Its title, "Before Listen mode starts", and its body, below                                             | CONSENT-1                     |
| The consent card                | Its lead and facts, below, and "Read aloud"                                                             | CONSENT-4                     |
| The paywall                     | "Keep Listen mode on", "Turn Listen is one payment. Speaking stays free.", and "Unlock Listen mode"     | PAY-2                         |
| After a purchase                | "Listen mode is unlocked."                                                                              | PAY-4                         |
| A purchase that fails           | "The purchase didn't go through. Listen mode is still locked."                                          | PAY-5                         |
| Restore, with nothing to find   | "No purchase found for this phone. Listen mode is still locked."                                        | PAY-6                         |
| Personal Voice refused          | "Turn can't use your Personal Voice. In iOS Settings, allow apps to request to use it, then try again." | VOICE-2                       |
| Personal Voice unavailable      | "There's no Personal Voice on this iPhone that Turn can use, so it keeps the system voice."             | VOICE-2                       |
| Erase all data                  | "Erase all data?", its message, below, "Erase", and "Cancel"                                            | SET-3                         |
| Speech rate                     | "Slowest", "Slower", "Normal", "Faster", and "Fastest"                                                  | VOICE-3                       |
| Listen mode's permission        | "Allowed on" and its date, with "Withdraw"; or "Not allowed", with "Allow"                              | CONSENT-1, CONSENT-3          |
| After Withdraw                  | "Listen mode is off, and nothing more leaves this phone until you allow it again."                      | CONSENT-3                     |
| The relay's status              | "Listen service: working", "Listen service: can't be reached", or "Listen service: off for now"         | SET-1, STATE-3                |
| Deleting a category             | "Where should its phrases go?"                                                                          | BANK-2                        |
| Undo                            | "Deleted." and "Undo"                                                                                   | BANK-9                        |
| The starter card                | "The Turn team wrote these starter phrases. Review them to make them yours.", "Review", and "Not now"   | BANK-10                       |
| A starter phrase                | "Starter"                                                                                               | BANK-10                       |

The longer texts, where `{service}` is as above:

- **The permission step's body.** "When your partner finishes speaking, Turn
  sends their words, the place you picked, your category names, and 40 of
  your phrases to {service}, which picks the phrases that answer. Names Turn
  recognizes are swapped for tags first. Your audio and the rest of your
  phrases never leave this phone. The service may keep what it receives to
  monitor its service." Then the link, "Read the privacy notice" (CONSENT-1,
  ROW-2).
- **The consent card's lead.** "Can my phone listen while we talk?"
- **The consent card's facts.** "It turns your words into text on this
  phone." "Your words, with any names it recognizes swapped for tags, go to
  {service} to pick my replies from my own phrases." "No audio is recorded."
  "I can pause it at any time." (CONSENT-4)
- **Erase all data's message.** "This deletes your phrases, places, tap
  counts, and settings, and brings back the starter phrases." (SET-3)
- **Starter phrases** put their key words first and stay under about 30
  characters where they can, so most fit a slot at the default size without an
  ellipsis; CONTENT-1's limit of 120 still holds.

## Accessibility

How the design meets each accessibility requirement; the TRD's
[accessibility in the app][trd-a11y] says how it's built.

- **A11Y-1, targets.** Phrase buttons 78 points tall, the strip's cells 48,
  and every other control 44 by 44; the big button fills the row
  ([Layout](#layout)).
- **A11Y-2, VoiceOver.** Each phrase button reads as its text with the button
  trait; the light reads "Listening", with the hint "Pauses listening"; and a
  changed row is announced once, as the number of replies, queued so it
  doesn't cut off Turn's own speech.
- **A11Y-3, Switch Control and Voice Control.** Layout order is focus order:
  the top bar, the caption, the strip, the row, the tabs, the grid, and the
  bottom bar, so a switch reaches the row before the grid, and nothing depends
  on detecting either feature.
- **A11Y-4, large text.** Every style follows its ramp to AX5, from AX1
  everything between the top bar and the bottom bar scrolls as one column, and
  only the row may end a phrase with an ellipsis, with the whole phrase in
  VoiceOver, in speech, and in the grid ([the row](#the-row)); the caption,
  which holds the partner's words rather than phrases, cuts them the same way
  ([the caption](#the-caption)).
- **A11Y-5, taps and time.** Everything works with single taps, including the
  speech rate, reordering, and the grid's Up and Down, and no note, card, or
  Undo times out.
- **A11Y-6, motion and color.** Reduce Motion stills every animation in the
  [Motion](#motion) table, read live; and every state carries a word or a
  shape.
- **A11Y-7, contrast.** Every pair in the [contrast table](#contrast), in all
  four appearances.
- **A11Y-8, names and actions.** Every name is the visible text, or, for a
  phrase the row cuts short, the whole phrase, which begins with it; other
  actions are named accessibility actions, nothing acts on touch-down, and
  reordering never drags.

### The test plan

Apple's Accessibility Nutrition Labels make a test plan even without a store
listing, since each label has published criteria
([iOS notes][ios-labels]):

| Label                             | What Turn must pass                                                            |
| --------------------------------- | ------------------------------------------------------------------------------ |
| VoiceOver                         | Every phrase, the row's announcement, the light, the consent card, the paywall |
| Voice Control                     | "Tap It was hard", and dictation into both composers                           |
| Larger Text                       | Every screen and the paywall at AX5, cut only in the row and the caption       |
| Dark Interface                    | Every screen, the paywall, and the launch screen                               |
| Differentiate Without Color Alone | Row states, the light, and the marked tab in grayscale                         |
| Sufficient Contrast               | The contrast table, in all four appearances                                    |
| Reduced Motion                    | No moving slot, no fading light, and a still paywall                           |
| Captions                          | The partner's words in the caption                                             |

- **Settings to try.** Light and dark, each with Increase Contrast; Reduce
  Transparency; both ends of the Liquid Glass slider; Reduce Motion turned on
  mid-session; Bold Text; AX5; grayscale through Color Filters; and Touch
  Accommodations' Hold Duration and Ignore Repeat, which Turn leaves to iOS
  rather than rebuilding ([AAC design notes][aac-touch]).
- **Where.** An iPhone on iOS 26 and the iOS 27 simulator; VoiceOver, Switch
  Control, and Voice Control on the iPhone, since the simulator lacks them.

[ios-labels]: /docs/research/turn-ios-design.md#accessibility-nutrition-labels-for-turn
[aac-touch]: /docs/research/aac-design.md#touch-settings-in-ios-27

## App icon and pitch assets

### The app icon

- **The mark.** An open speech bubble drawn as one thick stroke whose tail
  curls back like a turn arrow, in white on a marker-blue field: a turn to
  speak, in the app's own ink. No text, no SF Symbol, and no face.
- **The file.** One Icon Composer `.icon` file in two vector layers, the field
  and the mark, set as `ios.icon`, which Expo takes from SDK 54
  ([iOS notes][ios-icon]).
- **Appearances.** Default; dark, where the field deepens to a near-black blue
  and the mark stays white; and mono, from the mark layer, for the clear and
  tinted looks.
- **Shipaton's icon.** Icon Composer's flattened 1024 by 1024 export.

[ios-icon]: /docs/research/turn-ios-design.md#icon-appearances-and-icon-composer-2

### Screenshots and Devpost images

- **The required screenshot.** 1179 by 2556 pixels without a device frame,
  which an iPhone 16 simulator on iOS 27 draws at native size, captured in
  Device Hub with the status bar set to 9:41 by `simctl`. It shows the row
  mid-answer: the caption with "How was physio?" and "It was hard" among the
  replies ([iOS notes][ios-devpost]).
- **The thumbnail.** 3:2, typographic: Turn's line, "Your own words, in time
  for your turn.", in Atkinson Hyperlegible Next, and one big reply button in
  marker blue, legible at the 333 by 222 pixels the gallery shows it. A
  screenshot would crop to a sliver ([motionsites notes][ms-devpost]).
- **Gallery images.** 3:2 composites of two or three screens side by side on
  the board's color, each with a one-line caption in Atkinson Hyperlegible
  Next, since Devpost shows a portrait screenshot alone at 264 by 573 pixels
  ([motionsites notes][ms-devpost]).

[ios-devpost]: /docs/research/turn-ios-design.md#devpost-images
[ms-devpost]: /docs/research/turn-motionsites.md#devpost-gallery-images-and-thumbnail

### The README's images

- **The hero.** One image in light and dark versions through GitHub's
  `<picture>` element and `prefers-color-scheme`, with alt text; the logline
  and the evaluation's table stay text, not pixels
  ([motionsites notes][ms-readme]).
- **The "aha".** A short GIF of the scenario the idea's
  [pitch](/docs/IDEA.md#pitch) opens with, whose first frame tells the story,
  since GitHub pauses GIFs for people who reduce motion.
- **Social preview.** 1280 by 640 pixels, the thumbnail's type on the board's
  color.

[ms-readme]: /docs/research/turn-motionsites.md#the-readme-on-github

### The video

- **Frame.** 16:9, with the portrait screen inside it, under two minutes
  (SUBMIT-4) ([iOS notes][ios-youtube]).
- **Title cards.** Two short lines in Atkinson Hyperlegible Next, one word in
  marker blue, on the board's color; each fades in once and rests
  ([motionsites notes][ms-video]).
- **Text size.** On-screen text at least 54 pixels tall at 1080p, a decision
  that keeps it near 18 pixels in Devpost's player, which shows the video at
  about a third of that size ([motionsites notes][ms-video]).
- **Captions.** A caption file written from the script that names "Partner"
  and "Turn", since automatic captions can garble synthetic speech, and the key
  exchange burned in on a plate of at least 54% black
  ([motionsites notes][ms-video]; [iOS notes][ios-youtube]).
- **Filming.** Listen mode on the demo iPhone itself, since Device Hub blocks
  a mirrored iPhone's microphone; Simulator scenes on an iPhone 16 simulator
  ([iOS notes][ios-capture]).
- **Sound.** Turn's speech and the partner's voice, with no music under them;
  Jev and TypeSafe go unnamed until TypeSafe agrees (SUBMIT-6).

[ios-youtube]: /docs/research/turn-ios-design.md#youtube-thumbnails-and-captions
[ms-video]: /docs/research/turn-motionsites.md#the-demo-video
[ios-capture]: /docs/research/turn-ios-design.md#simulator-screenshots-and-recordings-in-xcode-27

## Do's and don'ts

- Do take every color from a token and every size from this document.
- Do keep the strip, the row's slots, and the grid still; change only words.
- Do give every color that means something a word or a shape too.
- Do let text wrap at every size, and cut a phrase only in the row.
- Don't put glass, gradients, shadows, images, or video behind words.
- Don't shrink a button on press; change its fill.
- Don't animate anything that isn't in the [Motion](#motion) table.
- Don't mark a reply as AI, show a percentage, or dim an older phrase.
- Don't add sounds or haptics; speech is the feedback.
- Don't use the system's accent colors as fills under white text.
- Don't name Jev or TypeSafe on screen until TypeSafe agrees.

## Guidance for coding agents

### Using this file

- **Read the rules first.** The [rules that don't bend](#rules-that-dont-bend)
  come before any token; then read the section for the screen at hand. The
  tokens are the values to use, and the prose says how to apply them.
- **Where values live.** Colors, in all four appearances, type, spacing,
  corners, and components are in the `yaml` blocks, each top-level key in one
  block; motion is in its table.
- **Lint.** `bunx @google/design.md@0.4.0 lint docs/DESIGN.md` checks the
  tokens and prints JSON. Read `summary.warnings`, not the exit code, since a
  contrast failure is only a warning ([trends notes][ft-linter]). The one
  warning this file allows is `missing-primary`, which the linter raises
  because it looks for a single `primary` value and Turn's colors hold four.
  `bunx @google/design.md@0.4.0 spec` prints the format; pin the version,
  since the format is alpha.
- **Generators.** Use AI generators for sketches only; their output starts
  over from these tokens and rules ([trends notes][ft-generators]).
- **Pointing agents here.** Once `app/` exists, a rule scoped to its screen
  files can point agents to this file, rather than an import that loads it
  into every session ([trends notes][ft-agents]).

[ft-linter]: /docs/research/turn-frontend-trends.md#what-the-linter-checks
[ft-generators]: /docs/research/turn-frontend-trends.md#generators-that-emit-expo-or-native-code
[ft-agents]: /docs/research/turn-frontend-trends.md#where-agents-meet-the-file

### Keeping code in step

- **The theme file.** `app/src/constants/theme.ts` exports each color as
  `DynamicColorIOS({ light, dark, highContrastLight, highContrastDark })` from
  the yaml's four values; each text style with its size, leading, weight, Bold
  Text weight, and `dynamicTypeRamp`; and the spacing and corners.
- **Its test.** A unit test reads this file's yaml and fails when `theme.ts`
  differs, and recomputes every pair in the [contrast table](#contrast) and
  every pair a component names, in all four appearances.
- **One accessibility store.** It reads Reduce Motion, Bold Text, Reduce
  Transparency, Increase Contrast, and the text size at launch and follows
  each change event, and motion, weight, and layout read from it
  ([iOS notes][ios-rn-settings]).
- **Direction.** A change starts here, then reaches `theme.ts`, never the
  other way.

[ios-rn-settings]: /docs/research/turn-ios-design.md#colors-and-settings-in-react-native-086

### Checks before a screen ships

- **Where.** An iPhone on iOS 26, and an iPhone 16 simulator on iOS 27 resized
  in Device Hub to 320, 375, 402, and 440 points wide.
- **Settings.** Everything in [the test plan](#the-test-plan).
- **Real words.** The longest starter phrase in a slot and in the grid, a
  300-character partner line in the caption, and the strip at AX5.
- **Colors.** After any color change, `check_contrast.py`, from the
  [design plan's appendix][plan-checks], still prints `OK`.

[plan-checks]: /docs/superpowers/plans/2026-09-23-turn-design.md#appendix-check-scripts

## Open questions

Each has a safe default, which this document follows until someone decides.

- **A show view for the partner.** Seven of twelve rival apps can put the
  last phrase in large type or flip it toward the partner in a tap or two, and
  the PRD has no such view ([AAC design notes][aac-partner]). Safe default:
  none in the first version, and the PRD can add a Should.
- **Finishing a phrase first.** SPEAK-2 lets a stray tap cut off a phrase
  mid-speech, which a tremor's second tap can do, and two rivals offer a
  setting against it ([AAC design notes][aac-guards]). Safe default: SPEAK-2
  as written.
- **The strip's height.** Its cells are 48 points, under the row's 12 mm.
  Safe default: 48, revisited with the clinic's review (CONTENT-5).
- **Saying how well Listen mode does.** In one study, a short statement of
  accuracy before use raised acceptance of an imperfect model
  ([AAC design notes][aac-confidence]). Safe default: the README carries the
  evaluation's table, and the app says nothing until the PRD gives it a place.
- **Atkinson Hyperlegible Next in the app.** Safe default: the system face in
  the app and the font only in the pitch, since no study shows it reads
  better.
- **iPhone Duo.** It reaches buyers on October 23, after judging, and nobody
  has tested a portrait-locked iPhone app on its inner display. Safe default:
  the width rules above ([iOS notes][ios-resize]).

[aac-partner]: /docs/research/aac-design.md#displays-that-face-the-partner
[aac-guards]: /docs/research/aac-design.md#guards-against-accidental-activation

## See also

- [Product](/docs/PRODUCT.md): who Turn is for, and the principles this
  design turns into rules.
- [Product requirements](/docs/PRD.md): the requirements each rule and
  component cites.
- [Technical requirements](/docs/TRD.md): how the app draws and moves what
  this document describes.
- [Idea](/docs/IDEA.md): the pitch, the schedule, and the risks.
- The research behind these choices:
  [motionsites.ai for Turn](/docs/research/turn-motionsites.md),
  [frontend trends](/docs/research/turn-frontend-trends.md),
  [AAC interface design](/docs/research/aac-design.md),
  [Turn's iOS design](/docs/research/turn-ios-design.md), and
  [AAC practice](/docs/research/aac-practice.md).
- [Google's DESIGN.md format][gdm]: the specification and the linter.
- [Guessling design](/docs/archive/guessling-design.md): the design for the
  team's first idea, archived.

[gdm]: https://github.com/google-labs-code/design.md
[product-principles]: /docs/PRODUCT.md#product-principles
[ft-tokens]: /docs/research/turn-frontend-trends.md#what-goes-in-tokens-and-what-in-prose
[aac-stigma]: /docs/research/aac-design.md#social-acceptability-and-stigma
[ft-calm]: /docs/research/turn-frontend-trends.md#calm-technology
[aac-targets]: /docs/research/aac-design.md#target-size-and-spacing-for-tremor-and-weakness
[ios-glass-content]: /docs/research/turn-ios-design.md#content-and-controls-on-glass
[ft-nobans]: /docs/research/turn-frontend-trends.md#bans-that-dont-suit-an-aac-app
[ios-light]: /docs/research/turn-ios-design.md#a-pulsing-listening-light
[ios-resize]: /docs/research/turn-ios-design.md#resizable-iphone-apps-and-iphone-duo
[ms-app]: /docs/research/turn-motionsites.md#the-native-iphone-app
[trd-a11y]: /docs/TRD.md#accessibility-in-the-app
[aac-confidence]: /docs/research/aac-design.md#whether-to-show-confidence
[aac-grid]: /docs/research/aac-design.md#grid-size-scrolling-and-navigation

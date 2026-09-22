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
    to AX5 and wraps; only the row may end a phrase with an ellipsis, and then
    VoiceOver and speech give the whole phrase (A11Y-4). Test: every screen at
    AX5.
5.  **Targets for unsteady hands.** Phrase buttons in the row and the grid are
    at least 78 points tall, the strip's at least 48, and every other control
    at least 44 by 44 (A11Y-1). Test: the Accessibility Inspector.
6.  **Only a tap speaks.** Nothing speaks without a tap, nothing acts on
    touch-down, and nothing needs a long press, a swipe, or a drag (ROW-6,
    A11Y-5, A11Y-8). Test: every scenario with single taps.
7.  **Motion answers someone.** Only a new reply, the big button, and the
    light while the partner's words arrive move anything, and Reduce Motion,
    read live, stills them all (A11Y-6). Test: turn Reduce Motion on
    mid-session.
8.  **No glass behind words.** Phrases, the line, notes, and the consent card
    sit on solid fills; Liquid Glass stays in the system's bars, sheets,
    alerts, and keyboard. Test: both ends of the Liquid Glass slider.
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
[aac-stigma]: /docs/research/aac-design.md#social-acceptability-and-stigma

### Scope

- **In:** the app's screens and their states, the paywall's styling, the app
  icon and launch screen, the Devpost images, the README's images, and the
  look of the demo video.
- **Out:** a website, since no Next Gen item needs one and the privacy notice
  ships in the app ([motionsites notes][ms-web]); a partner view that flips
  the last phrase toward the partner, an
  [open question](#open-questions); and any appearance setting inside the app.

[ms-web]: /docs/research/turn-motionsites.md#a-one-page-website

## Influences and trends

What the four notes found, and what Turn takes from each. Every row cites the
note that holds its sources.

| Source                          | What it offers                                 | What Turn does                                                                                    |
| ------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| motionsites.ai's newest prompts | Exact tokens, a motion inventory, and checks   | Adopts the shape: this file lists every animation and ends with checks ([notes][ms-spec])         |
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
- **What motionsites.ai lacks.** Nothing in its catalog or its 813-prompt
  corpus is about AAC, speech, or disability, so its craft transfers and its
  sizes don't: its buttons are a median of 40 pixels, under Turn's 44-point
  floor ([motionsites notes][ms-findings]).

[ms-spec]: /docs/research/turn-motionsites.md#layout-and-type-in-the-closest-prompts
[ms-a11y]: /docs/research/turn-motionsites.md#accessibility-of-the-common-patterns
[ms-color]: /docs/research/turn-motionsites.md#color-imagery-and-motion-in-the-closest-prompts
[ft-sample]: /docs/research/turn-frontend-trends.md#a-turn-shaped-sample-through-the-linter
[ft-studies]: /docs/research/turn-frontend-trends.md#studies-of-ai-generated-interfaces
[ft-kits]: /docs/research/turn-frontend-trends.md#styling-and-component-kits
[ios-glass-content]: /docs/research/turn-ios-design.md#content-and-controls-on-glass
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

| Token            | Name                 | Role                                                               |
| ---------------- | -------------------- | ------------------------------------------------------------------ |
| `board`          | Board                | The home screen's background, and Settings' and the editor's       |
| `surface`        | Card                 | Phrase buttons, the line, tabs, list rows, and sheets' backgrounds |
| `pressed`        | Card, pressed        | A card while a finger is on it                                     |
| `ink`            | Marker black         | Phrases and every other text on cards and on the board             |
| `ink-secondary`  | Pencil               | Speaker labels, counts, placeholders, and notes                    |
| `edge`           | Card edge            | The edge of every card and secondary button                        |
| `accent`         | Marker blue          | The big button, Speak, links, and the dot on a marked tab          |
| `accent-pressed` | Marker blue, pressed | The big button and Speak while pressed                             |
| `on-accent`      | On blue              | Text and symbols on marker blue                                    |
| `yes-fill`       | Yes                  | Yes's fill, in the row and in the Quick category                   |
| `yes-edge`       | Yes, edge            | Yes's edge                                                         |
| `no-fill`        | No                   | No's fill                                                          |
| `no-edge`        | No, edge             | No's edge                                                          |
| `unsure-fill`    | Not sure             | Not sure's fill                                                    |
| `unsure-edge`    | Not sure, edge       | Not sure's edge                                                    |
| `listen`         | Listening orange     | The light while the microphone is on                               |
| `on-listen`      | On orange            | "Listening" and its symbol                                         |

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
[ios-light]: /docs/research/turn-ios-design.md#a-pulsing-listening-light
[ms-contrast]: /docs/research/turn-motionsites.md#text-contrast-143
[aac-color]: /docs/research/aac-design.md#color-coding-and-backgrounds

### Contrast

Each ratio is WCAG 2.2's, truncated to one decimal so none is rounded up to
pass. Phrases and all text on cards need 7 to 1, above A11Y-7's 4.5, since
Apple asks custom colors to "strive for a contrast ratio of 7:1, especially in
small text" ([AAC design notes][aac-polarity]); labels and notes need 4.5 to
1; and edges and fills that mark a control need 3 to 1 against what's next to
them (A11Y-7).

| Text or mark    | On               | Used for                                | Light  | Dark   | Light, more contrast | Dark, more contrast | At least |
| --------------- | ---------------- | --------------------------------------- | ------ | ------ | -------------------- | ------------------- | -------- |
| `ink`           | `surface`        | Phrases, the line, and labels on cards  | 17.0:1 | 15.6:1 | 21.0:1               | 17.0:1              | 7:1      |
| `ink`           | `pressed`        | A card under a finger                   | 13.0:1 | 10.4:1 | 14.5:1               | 9.1:1               | 7:1      |
| `ink`           | `board`          | Text on the board                       | 15.2:1 | 19.2:1 | 18.8:1               | 21.0:1              | 7:1      |
| `on-accent`     | `accent`         | The big button and Speak                | 7.9:1  | 8.6:1  | 9.9:1                | 13.0:1              | 7:1      |
| `on-accent`     | `accent-pressed` | The same, pressed                       | 10.0:1 | 11.2:1 | 11.9:1               | 15.7:1              | 7:1      |
| `ink`           | `yes-fill`       | Yes                                     | 14.7:1 | 13.5:1 | 16.9:1               | 16.4:1              | 7:1      |
| `ink`           | `no-fill`        | No                                      | 14.1:1 | 14.8:1 | 15.3:1               | 17.6:1              | 7:1      |
| `ink`           | `unsure-fill`    | Not sure                                | 14.1:1 | 12.7:1 | 15.5:1               | 15.6:1              | 7:1      |
| `surface`       | `ink`            | The selected tab                        | 17.0:1 | 15.6:1 | 21.0:1               | 17.0:1              | 7:1      |
| `on-listen`     | `listen`         | "Listening" and its symbol              | 5.2:1  | 9.3:1  | 7.1:1                | 11.9:1              | 4.5:1    |
| `ink-secondary` | `surface`        | Labels, counts, and notes on cards      | 7.4:1  | 7.6:1  | 11.3:1               | 11.1:1              | 4.5:1    |
| `ink-secondary` | `board`          | Notes and placeholders on the board     | 6.6:1  | 9.4:1  | 10.1:1               | 13.8:1              | 4.5:1    |
| `accent`        | `surface`        | Links, and the dot on a marked tab      | 7.9:1  | 8.1:1  | 9.9:1                | 10.6:1              | 4.5:1    |
| `accent`        | `board`          | The big button's fill against the board | 7.1:1  | 10.0:1 | 8.8:1                | 13.0:1              | 3:1      |
| `edge`          | `board`          | Card edges against the board            | 3.2:1  | 4.0:1  | 6.7:1                | 8.1:1               | 3:1      |
| `edge`          | `surface`        | Card edges against the card             | 3.6:1  | 3.2:1  | 7.5:1                | 6.6:1               | 3:1      |
| `yes-edge`      | `board`          | Yes's edge against the board            | 4.8:1  | 9.4:1  | 7.2:1                | 12.6:1              | 3:1      |
| `yes-edge`      | `yes-fill`       | Yes's edge against its fill             | 4.6:1  | 6.6:1  | 6.5:1                | 9.9:1               | 3:1      |
| `no-edge`       | `board`          | No's edge against the board             | 5.8:1  | 8.2:1  | 8.1:1                | 10.9:1              | 3:1      |
| `no-edge`       | `no-fill`        | No's edge against its fill              | 5.4:1  | 6.3:1  | 6.6:1                | 9.2:1               | 3:1      |
| `unsure-edge`   | `board`          | Not sure's edge against the board       | 5.3:1  | 7.3:1  | 8.1:1                | 12.4:1              | 3:1      |
| `unsure-edge`   | `unsure-fill`    | Not sure's edge against its fill        | 4.9:1  | 4.8:1  | 6.7:1                | 9.3:1               | 3:1      |
| `listen`        | `board`          | The light against the board             | 4.6:1  | 10.2:1 | 6.4:1                | 11.9:1              | 3:1      |

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
| `title3`                 | The partner's words in the line                              | `title3`          | 600            | 55/65  |
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
  `maxFontSizeMultiplier`, or a fixed height, and only the row's slots set
  `numberOfLines`; see [the row](#the-row).
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

[aac-targets]: /docs/research/aac-design.md#target-size-and-spacing-for-tremor-and-weakness

### The home screen

The home screen has no navigation bar, and its bands keep the PRD's order,
top to bottom (SPEAK-1):

```text
top bar     Settings  ·  place  ·  Listen control
the line    They said                                        Done or Clear
            "How was physio?"                                Repeat or Stop
the strip   Wait, I'm typing  |  Sorry, say that again  |  And you?
            I use this app to talk. Please give me time.  |  Something's wrong
the row     slot 1  |  slot 2
            slot 3  |  slot 4
            slot 5  |  slot 6
tabs        Quick  Feelings  Body and pain  …              All  ·  Type
the grid    phrase  |  phrase                               (scrolls)
```

| Band      | Height at the default text size                            | What sets it                                            |
| --------- | ---------------------------------------------------------- | ------------------------------------------------------- |
| Top bar   | 52 points                                                  | `bar`                                                   |
| The line  | 92 points                                                  | A label, two lines of `title3`, and two buttons stacked |
| The strip | 104 points                                                 | Two rows of 48-point cells and an 8-point gap           |
| The row   | 258 points                                                 | Three rows of 78-point slots and two 12-point gaps      |
| Tabs      | 44 points                                                  | `target`                                                |
| The grid  | The rest: about 170 points, two rows, on a 6.1-inch iPhone | It scrolls                                              |

- **Gaps.** 8 points between bands, 12 inside the row and the grid, and 16
  from the screen's edges; the board's color runs under the status bar and
  the home indicator, and content stays inside the safe areas.
- **What doesn't scroll.** The top bar, the line, the strip, the row, and the
  tabs sit outside the grid's scroll view, so nothing collapses or slides them
  away ([iOS notes][ios-bars]); only the grid scrolls.
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

[ios-resize]: /docs/research/turn-ios-design.md#resizable-iphone-apps-and-iphone-duo

### Short screens and large text

- **Short screens.** Where the space between the top bar and the screen's
  bottom is under 700 points, as on an iPhone SE, the line, the strip, the
  row, the tabs, and the grid scroll together as one column, and only the top
  bar stays put.
- **From AX1.** When the font scale reaches 1.786, at AX1, the row, the strip,
  and the grid take one column each, and everything under the top bar scrolls
  as one column, as on short screens. Apple advises fewer columns as text
  grows ([iOS notes][ios-dt-turn]).
- **Heights follow the text size, never the content.** A slot's height is two
  lines of `title3-emphasized` at the current size plus its padding, and never
  less than 78 points; so at AX5 a slot is 154 points tall, and the row holds
  its height whatever it shows.

[ios-dt-turn]: /docs/research/turn-ios-design.md#dynamic-type-sizes-for-turns-styles

### With the keyboard up

- The composer docks above the keyboard; the tabs and the grid slip under it.
- The line's words move into the composer's label, "Replying to", so the
  top bar, the strip, and the row stay in view above the composer.
- Where they don't fit, as on an iPhone SE, the space above the composer
  scrolls, the row first.

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
[ft-calm]: /docs/research/turn-frontend-trends.md#calm-technology
[ft-nobans]: /docs/research/turn-frontend-trends.md#bans-that-dont-suit-an-aac-app

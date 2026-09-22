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
[ft-tokens]: /docs/research/turn-frontend-trends.md#what-goes-in-tokens-and-what-in-prose
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
[ft-nobans]: /docs/research/turn-frontend-trends.md#bans-that-dont-suit-an-aac-app
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
[ft-calm]: /docs/research/turn-frontend-trends.md#calm-technology

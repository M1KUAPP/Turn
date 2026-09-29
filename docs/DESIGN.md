# Turn design

How Turn looks, reads, and moves: the design system and art direction for the
iPhone app, the paywall's styling, the app icon, and the pitch assets. It
follows Google's [DESIGN.md format][gdm], so design and coding agents can read
its tokens, and it turns the [product's][product-principles] principles into
rules and layouts that the [technical requirements](/docs/TRD.md) build and the
[product requirements](/docs/PRD.md) test. Facts are as of September 23, 2026;
every color, size, and duration this document sets is a design decision. The
v2 redesign of September 29, 2026 changed the look: this file now carries v2's
colors, type, shapes, depth, and motion, and
[the v2 plan](/docs/plans/0044-turn-v2-redesign.md) and its Figma file hold the
screens.

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

Every screen keeps these ten rules; each names the requirement or principle
it serves and the test that shows it holds. The rest of this document says
how.

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
    at least 78 points tall, or 64 on short screens, the strip's at least 48,
    and every other control at least 44 by 44 (A11Y-1). Test: the
    Accessibility Inspector.
6.  **Only a tap speaks.** Nothing speaks without a tap, nothing acts on
    touch-down, and nothing needs a long press, a swipe, or a drag: the grid
    scrolls, and page buttons do the same with a tap (ROW-6, A11Y-5, A11Y-8).
    Test: every scenario with single taps.
7.  **Motion answers someone.** Only a press, replies arriving, the big reply,
    the listening light and its meter, the words arriving in the caption, and
    the speaking slot move anything, and Reduce Motion, read live, stills them
    all (A11Y-6). Test: turn Reduce Motion on mid-session.
8.  **No glass behind words.** Glass appears only on the floating bottom
    toolbar and the system's own chrome; phrases, the caption, notes, and the
    consent card sit on solid fills, so their contrast holds at every glass
    setting (A11Y-7). Test: both ends of the Liquid Glass slider.
9.  **The system decides the look.** Turn follows the iPhone's appearance,
    Increase Contrast, and Bold Text, and has no theme of its own, so text
    keeps its size and contrast in every appearance (A11Y-4, A11Y-7). Test:
    all four appearances, with Bold Text on and off.
10. **Plain words, no AI badges.** No percentages, sparkles, "smart", or
    exclamation marks, and a reply looks like any other phrase of the user's,
    because it is one ([product principles][product-principles]). Test: read
    every string in [Words on screen](#words-on-screen).

### The reference

A warm table, your own cards, and a lamp. v1 reached for a whiteboard and four
markers: when a device fails, people who can't speak reach for a board and a
pen, as one AAC user did after an update changed their app's layout, taking
"a white board and marker" to a cancer appointment
([AAC design notes][aac-criticize]). v2 keeps the tool and warms the room. The
table is warm paper, the cards are the user's own, and the lamp says when the
phone is listening.

- **What it gives each surface.** The board is warm paper; each phrase is a
  card on it with an inked edge in its category's color; near-black ink is the
  text; ultramarine is Turn's own ink, for its actions and for the one reply
  it's sure of; green and red fills with a check and a cross are Yes and No;
  and the lamp is the one thing that glows, orange after the dot iOS shows
  while a microphone is on.
- **Why a reference.** Google's format asks for one, since "A specific
  reference describes a point." ([trends notes][ft-tokens])
- **Why this one.** It's the tool AAC users already trust, it looks like
  nothing special, and devices that looked like mainstream ones drew the least
  attention in interviews about assistive technology
  ([AAC design notes][aac-stigma]). It's calm in the sense the trends notes
  found: "Technology should require the smallest possible amount of attention"
  ([trends notes][ft-calm]).
- **What it rules out.** Clinical gray, AI sparkles and orbs, candy colors
  that read as a children's app, and motion for its own sake.

[aac-criticize]: /docs/research/0028-aac-design.md#what-users-criticize

### Scope

- **In:** the app's screens and their states, the paywall's styling, the app
  icon and launch screen, the Devpost images, the README's images, and the
  look of the demo video.
- **Out:** a website, since no Next Gen item needs one and the privacy notice
  ships in the app ([motionsites notes][ms-web]); an iPad layout, a non-goal
  of the PRD, though an iPad's window follows the same [width rules](#widths);
  a partner view that flips the last phrase toward the partner, an
  [open question](#open-questions); and any appearance setting inside the app.

[ms-web]: /docs/research/0026-turn-motionsites.md#a-one-page-website

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

| Source                          | What it offers                                               | What Turn does                                                                                                                            |
| ------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| motionsites.ai's newest prompts | Exact copy, a motion inventory, and checks                   | Adopts the shape: this file lists every animation and ends with checks ([motionsites notes][ms-spec])                                     |
| motionsites.ai's house look     | Near-black pages, video, glass, and faint text               | Rejects it: faint text and glass edges fail contrast, and loops can't pause ([motionsites notes][ms-a11y])                                |
| Calm wellness prompts           | Warm light fields and one accent                             | Adopts a light field and one accent, not their loops ([motionsites notes][ms-color])                                                      |
| Google's DESIGN.md format       | Tokens and prose that a linter checks                        | Adopts it, with four appearances per color ([trends notes][ft-sample])                                                                    |
| AI generators of native apps    | Fast first screens                                           | Sketches only: generated screens fail on contrast and labels first ([trends notes][ft-studies])                                           |
| React Native component kits     | Ready-made controls                                          | Rejects them: none handles Increase Contrast ([trends notes][ft-kits])                                                                    |
| Apple's Liquid Glass            | Glass controls that float over content                       | Adapts it: glass stays on the floating toolbar and the system's chrome, never behind words ([Turn's iOS design notes][ios-glass-content]) |
| Google's Material 3 Expressive  | Large, contained buttons with labels                         | Adopts the buttons and labels, not the springy motion ([trends notes][ft-m3e])                                                            |
| Calm technology                 | Attention only when something matters                        | Adopts it for the light and the row ([trends notes][ft-calm])                                                                             |
| Text AAC apps                   | Message windows, phrases, and show views                     | Adopts fixed places and plain text, and keeps more in view than any rival ([AAC design notes][aac-patterns])                              |
| The v2 redesign research        | The warm reference, the sources behind it, and what it drops | Adopts its colors, type, depth, and motion wholesale ([the redesign research](/docs/research/0051-turn-redesign.md))                      |

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

[ms-spec]: /docs/research/0026-turn-motionsites.md#layout-and-type-in-the-closest-prompts
[ms-a11y]: /docs/research/0026-turn-motionsites.md#accessibility-of-the-common-patterns
[ms-color]: /docs/research/0026-turn-motionsites.md#color-imagery-and-motion-in-the-closest-prompts
[ft-sample]: /docs/research/0027-turn-frontend-trends.md#a-turn-shaped-sample-through-the-linter
[ft-studies]: /docs/research/0027-turn-frontend-trends.md#studies-of-ai-generated-interfaces
[ft-kits]: /docs/research/0027-turn-frontend-trends.md#styling-and-component-kits
[ft-m3e]: /docs/research/0027-turn-frontend-trends.md#material-3-expressive-and-older-users
[aac-patterns]: /docs/research/0028-aac-design.md#patterns-across-the-apps
[ft-bans]: /docs/research/0027-turn-frontend-trends.md#bans-that-suit-an-aac-app
[ms-findings]: /docs/research/0026-turn-motionsites.md#findings-for-designmd

## Colors

A warm paper board, cream cards with inked edges, and near-black ink, with four
colored inks that each have one job, and a category color apiece. Every color
holds four values, one for each appearance: `light`, `dark`, and each with
Increase Contrast, `light-hc` and `dark-hc`. They map one to one onto React
Native's `DynamicColorIOS`, as `light`, `dark`, `highContrastLight`, and
`highContrastDark`, so Increase Contrast needs no code
([trends notes][ft-appearances]).

```yaml
colors:
  board:
    light: '#F4EFE7'
    dark: '#15120F'
    light-hc: '#F4EFE7'
    dark-hc: '#0E0C0A'
  surface:
    light: '#FFFCF7'
    dark: '#221E19'
    light-hc: '#FFFFFF'
    dark-hc: '#1C1915'
  surface-sunken:
    light: '#EAE3D8'
    dark: '#0F0D0B'
    light-hc: '#E4DCCF'
    dark-hc: '#070605'
  surface-pressed:
    light: '#E6DDCF'
    dark: '#322C25'
    light-hc: '#DCD2C2'
    dark-hc: '#3A332B'
  ink:
    light: '#1E1A15'
    dark: '#F6F1E9'
    light-hc: '#000000'
    dark-hc: '#FFFFFF'
  ink-secondary:
    light: '#5B5347'
    dark: '#B9AFA1'
    light-hc: '#3D372F'
    dark-hc: '#DDD5C9'
  edge:
    light: '#8A8072'
    dark: '#8C8274'
    light-hc: '#4A433A'
    dark-hc: '#CFC6B8'
  hairline:
    light: '#DDD4C6'
    dark: '#3A342C'
    light-hc: '#B9AE9E'
    dark-hc: '#5C544A'
  accent:
    light: '#2438C9'
    dark: '#8FA0FF'
    light-hc: '#1A2BA6'
    dark-hc: '#B7C2FF'
  accent-pressed:
    light: '#1A2BA6'
    dark: '#A9B6FF'
    light-hc: '#121F85'
    dark-hc: '#D2D9FF'
  on-accent:
    light: '#FFFFFF'
    dark: '#0B1033'
    light-hc: '#FFFFFF'
    dark-hc: '#000000'
  accent-soft:
    light: '#E4E8FC'
    dark: '#1D2244'
    light-hc: '#D6DCFA'
    dark-hc: '#141836'
  accent-tag:
    light: '#FFFFFF2E'
    dark: '#0B103329'
    light-hc: '#FFFFFF38'
    dark-hc: '#00000033'
  listen:
    light: '#B84300'
    dark: '#FF9A4D'
    light-hc: '#963600'
    dark-hc: '#FFB47A'
  on-listen:
    light: '#FFFFFF'
    dark: '#1E0C00'
    light-hc: '#FFFFFF'
    dark-hc: '#000000'
  listen-soft:
    light: '#FCE6D6'
    dark: '#3A1F0C'
    light-hc: '#F8D9C2'
    dark-hc: '#2C1606'
  listen-glow:
    light: '#FF8A3D'
    dark: '#FF7A1F'
    light-hc: '#FF8A3D'
    dark-hc: '#FF7A1F'
  yes-fill:
    light: '#DCF1E1'
    dark: '#11291A'
    light-hc: '#CDEBD5'
    dark-hc: '#0A2012'
  yes-edge:
    light: '#1D7A3C'
    dark: '#58C77D'
    light-hc: '#125A2B'
    dark-hc: '#8BE0A6'
  no-fill:
    light: '#FBE0DB'
    dark: '#361512'
    light-hc: '#F7D1CA'
    dark-hc: '#2A0E0B'
  no-edge:
    light: '#B3261E'
    dark: '#FF7B6E'
    light-hc: '#8C1D17'
    dark-hc: '#FFA69C'
  unsure-fill:
    light: '#ECE6DD'
    dark: '#2A2621'
    light-hc: '#E0D8CC'
    dark-hc: '#221E1A'
  unsure-edge:
    light: '#6B6357'
    dark: '#A39A8C'
    light-hc: '#4A433A'
    dark-hc: '#D0C8BB'
  category-quick-fill:
    light: '#FFFCF7'
    dark: '#221E19'
    light-hc: '#FFFFFF'
    dark-hc: '#1C1915'
  category-quick-edge:
    light: '#8A8072'
    dark: '#8C8274'
    light-hc: '#4A433A'
    dark-hc: '#CFC6B8'
  category-chat-fill:
    light: '#DCEBFA'
    dark: '#16263A'
    light-hc: '#CFE2F8'
    dark-hc: '#0E1B2B'
  category-chat-edge:
    light: '#2B64B0'
    dark: '#6FA3E6'
    light-hc: '#1B4C8C'
    dark-hc: '#A6C8F2'
  category-care-fill:
    light: '#D6F0E2'
    dark: '#12291E'
    light-hc: '#C7EAD6'
    dark-hc: '#0B2016'
  category-care-edge:
    light: '#1E7650'
    dark: '#5CC08E'
    light-hc: '#135A3C'
    dark-hc: '#93DCB6'
  category-body-pain-fill:
    light: '#FBDDE0'
    dark: '#33171C'
    light-hc: '#F7CDD2'
    dark-hc: '#270F13'
  category-body-pain-edge:
    light: '#B02E48'
    dark: '#EE7A8F'
    light-hc: '#8A1F36'
    dark-hc: '#F6A7B5'
  category-food-fill:
    light: '#FAEBC2'
    dark: '#2E2510'
    light-hc: '#F6E2AA'
    dark-hc: '#221B08'
  category-food-edge:
    light: '#8A6500'
    dark: '#D9AE3B'
    light-hc: '#6A4D00'
    dark-hc: '#EACB77'
  category-feelings-fill:
    light: '#FFE2D0'
    dark: '#35200F'
    light-hc: '#FDD5BD'
    dark-hc: '#29170A'
  category-feelings-edge:
    light: '#B4531C'
    dark: '#F08C4E'
    light-hc: '#8C3E10'
    dark-hc: '#F7B389'
  category-family-fill:
    light: '#E8E0FB'
    dark: '#241C3A'
    light-hc: '#DDD2F8'
    dark-hc: '#1A132D'
  category-family-edge:
    light: '#6444C4'
    dark: '#A78BF2'
    light-hc: '#4C2FA3'
    dark-hc: '#C9B6F8'
  category-health-fill:
    light: '#D4EEF0'
    dark: '#0F2A2D'
    light-hc: '#C3E7EA'
    dark-hc: '#0A2023'
  category-health-edge:
    light: '#15707B'
    dark: '#4FC3CF'
    light-hc: '#0C5760'
    dark-hc: '#8CDCE3'
  category-out-fill:
    light: '#EEF3D2'
    dark: '#232A10'
    light-hc: '#E4ECBE'
    dark-hc: '#1A200A'
  category-out-edge:
    light: '#5C7412'
    dark: '#A8C24A'
    light-hc: '#445709'
    dark-hc: '#C7DB85'
```

[ft-appearances]: /docs/research/0027-turn-frontend-trends.md#appearances-contrast-and-motion-the-format-lacks

### Color roles

| Token             | Name                 | Role                                                                   |
| ----------------- | -------------------- | ---------------------------------------------------------------------- |
| `board`           | Table                | The home screen's background, and Settings' and the editor's           |
| `surface`         | Card                 | Phrase buttons, the caption, tabs, list rows, and sheets' backgrounds  |
| `surface-sunken`  | Card, sunken         | Degraded notes, paywall messages, and the consent card's switch block  |
| `surface-pressed` | Card, pressed        | A card while a finger is on it                                         |
| `ink`             | Ink black            | Phrases and every other text on cards and on the board                 |
| `ink-secondary`   | Pencil               | Speaker labels, counts, placeholders, and notes                        |
| `edge`            | Card edge            | The edge of every card and secondary button                            |
| `hairline`        | Hairline             | Dividers in a list group, and the composer's top edge                  |
| `accent`          | Marker blue          | The big button, Speak, links, and Type in the toolbar                  |
| `accent-pressed`  | Marker blue, pressed | The big button and Speak while pressed                                 |
| `on-accent`       | On blue              | Text and symbols on marker blue                                        |
| `accent-soft`     | Blue wash            | The speaking slot, the starter card, and the place menu's current row  |
| `accent-tag`      | Blue tag             | The big reply's category tag                                           |
| `listen`          | Lamp orange          | The light while the microphone is on, and the caption's label and edge |
| `on-listen`       | On orange            | "Listening" and its symbol                                             |
| `listen-soft`     | Orange wash          | The free lines' pill, and a caption word as it arrives                 |
| `listen-glow`     | Lamp glow            | The glow behind the board while listening, and the light's ring        |
| `yes-fill`        | Yes                  | Yes's fill, in the row and in the Quick category                       |
| `yes-edge`        | Yes, edge            | Yes's edge                                                             |
| `no-fill`         | No                   | No's fill                                                              |
| `no-edge`         | No, edge             | No's edge                                                              |
| `unsure-fill`     | Not sure             | Not sure's fill                                                        |
| `unsure-edge`     | Not sure, edge       | Not sure's edge                                                        |
| `category-*-fill` | Category fill        | A live reply's fill in that category                                   |
| `category-*-edge` | Category edge        | Each category's inked edge on its cards, and its tab's dot             |

- **Four inks, fixed jobs.** Blue is Turn's own: its actions and the one reply
  it's sure of, never Yes or No. Yes and No own the green and red fills with a
  check and a cross, and the lamp owns the glowing orange. Some category hues
  come near those, so each of the three also carries its word and its shape,
  as rule 3 asks, and never its color alone.
- **A hue per category.** A category's color is worn as an inked edge on its
  cards and tab, and as a fill on a live reply, and a category the user adds
  takes the next hue after `out`, cycling from `chat`.
- **Marker blue passes under white text.** Apple's system blue gives white
  text only 3.52 to 1, so every fill under white text is Turn's own
  ([Turn's iOS design notes][ios-grays]).
- **The orange echoes iOS.** iOS shows an orange dot while an app uses the
  microphone, so the light's orange says the same thing, never the camera's
  green ([Turn's iOS design notes][ios-light]).
- **Solid, never faint.** No text takes its color from opacity: white text at
  under 45% opacity fails 4.5 to 1 on near-black, and a gray that passes in
  one appearance can fail in the other ([motionsites notes][ms-contrast]). The
  one wash, `accent-tag`, paints the big reply's category tag: that
  appearance's `on-accent` at 18, 16, 22, and 20 percent, written as
  eight-digit hex. It's a fill over `accent`, never a text color, so the
  `big-tag` component names the `accent` fill it sits on.
- **Color repeats words, never replaces them.** A category's hue marks cards
  whose words the user already sees, and the tab says the category's name, so
  nothing depends on telling hues apart; no study tested color coding on text
  ([AAC design notes][aac-color]).

[ios-grays]: /docs/research/0029-turn-ios-design.md#system-colors-and-grays
[ms-contrast]: /docs/research/0026-turn-motionsites.md#text-contrast-143
[aac-color]: /docs/research/0028-aac-design.md#color-coding-and-backgrounds

### Contrast

Each ratio is WCAG 2.2's, truncated to one decimal so none is rounded up to
pass. Phrases and all text on cards need 7 to 1, above A11Y-7's 4.5, since
Apple asks custom colors to "strive for a contrast ratio of 7:1, especially in
small text" ([AAC design notes][aac-polarity]); labels and notes need 4.5 to
1; and edges and fills that mark a control need 3 to 1 against what's next to
them (A11Y-7).

| Text or mark    | On                | Used for                                        | Light  | Dark   | Light, more contrast | Dark, more contrast | At least |
| --------------- | ----------------- | ----------------------------------------------- | ------ | ------ | -------------------- | ------------------- | -------- |
| `ink`           | `surface`         | Phrases, the caption, and text on cards         | 16.9:1 | 14.7:1 | 21.0:1               | 17.5:1              | 7:1      |
| `ink`           | `surface-pressed` | A card under a finger                           | 12.8:1 | 12.2:1 | 14.0:1               | 12.4:1              | 7:1      |
| `ink`           | `board`           | Titles and text on the board                    | 15.1:1 | 16.5:1 | 18.3:1               | 19.5:1              | 7:1      |
| `ink`           | `accent-soft`     | The speaking card and the starter card          | 14.2:1 | 13.6:1 | 15.4:1               | 17.3:1              | 7:1      |
| `ink`           | `listen-soft`     | A caption word as it arrives                    | 14.3:1 | 13.5:1 | 15.6:1               | 17.1:1              | 7:1      |
| `ink`           | `yes-fill`        | Yes                                             | 14.5:1 | 13.7:1 | 16.4:1               | 17.0:1              | 7:1      |
| `ink`           | `no-fill`         | No, and "Something's wrong"                     | 13.8:1 | 14.6:1 | 14.9:1               | 18.0:1              | 7:1      |
| `ink`           | `unsure-fill`     | Not sure                                        | 13.9:1 | 13.3:1 | 14.8:1               | 16.5:1              | 7:1      |
| `on-accent`     | `accent`          | The big reply, Type, Speak, and primary buttons | 8.4:1  | 7.6:1  | 10.8:1               | 12.1:1              | 7:1      |
| `on-accent`     | `accent-pressed`  | The same, pressed                               | 10.8:1 | 9.5:1  | 13.4:1               | 15.1:1              | 7:1      |
| `surface`       | `ink`             | The selected tab, and Stop                      | 16.9:1 | 14.7:1 | 21.0:1               | 17.5:1              | 7:1      |
| `on-listen`     | `listen`          | "Listening" and its symbol                      | 5.4:1  | 9.0:1  | 7.4:1                | 12.0:1              | 4.5:1    |
| `listen`        | `surface`         | The caption's label while hearing               | 5.3:1  | 7.8:1  | 7.4:1                | 10.0:1              | 4.5:1    |
| `listen`        | `listen-soft`     | The free lines' pill                            | 4.5:1  | 7.2:1  | 5.5:1                | 9.8:1               | 4.5:1    |
| `ink-secondary` | `surface`         | Labels, counts, and placeholders on cards       | 7.3:1  | 7.6:1  | 11.7:1               | 12.0:1              | 4.5:1    |
| `ink-secondary` | `board`           | Notes and group headers on the board            | 6.6:1  | 8.6:1  | 10.2:1               | 13.4:1              | 4.5:1    |
| `ink-secondary` | `surface-sunken`  | Notes in pills                                  | 5.9:1  | 8.9:1  | 8.6:1                | 13.9:1              | 4.5:1    |
| `accent`        | `surface`         | Links                                           | 8.2:1  | 6.8:1  | 10.8:1               | 10.1:1              | 4.5:1    |
| `accent`        | `board`           | The big reply's fill against the board          | 7.3:1  | 7.6:1  | 9.4:1                | 11.3:1              | 3:1      |
| `edge`          | `board`           | Card edges against the board                    | 3.3:1  | 4.9:1  | 8.5:1                | 11.5:1              | 3:1      |
| `edge`          | `surface`         | Card edges against the card                     | 3.7:1  | 4.3:1  | 9.7:1                | 10.3:1              | 3:1      |
| `yes-edge`      | `board`           | Yes's edge against the board                    | 4.7:1  | 8.7:1  | 7.2:1                | 12.3:1              | 3:1      |
| `yes-edge`      | `yes-fill`        | Yes's edge against its fill                     | 4.5:1  | 7.2:1  | 6.5:1                | 10.8:1              | 3:1      |
| `no-edge`       | `board`           | No's edge against the board                     | 5.7:1  | 7.3:1  | 7.9:1                | 10.3:1              | 3:1      |
| `no-edge`       | `no-fill`         | No's edge against its fill                      | 5.2:1  | 6.5:1  | 6.4:1                | 9.5:1               | 3:1      |
| `unsure-edge`   | `board`           | Not sure's edge against the board               | 5.1:1  | 6.7:1  | 8.5:1                | 11.7:1              | 3:1      |
| `unsure-edge`   | `unsure-fill`     | Not sure's edge against its fill                | 4.7:1  | 5.4:1  | 6.8:1                | 9.9:1               | 3:1      |
| `listen`        | `board`           | The light against the board                     | 4.7:1  | 8.8:1  | 6.4:1                | 11.2:1              | 3:1      |

Each category's fill and edge, checked the same way:

| Text or mark              | On                        | Used for                                    | Light  | Dark   | Light, more contrast | Dark, more contrast | At least |
| ------------------------- | ------------------------- | ------------------------------------------- | ------ | ------ | -------------------- | ------------------- | -------- |
| `ink`                     | `category-quick-fill`     | A live reply in Quick                       | 16.9:1 | 14.7:1 | 21.0:1               | 17.5:1              | 7:1      |
| `category-quick-edge`     | `board`                   | Quick's edge against the board              | 3.3:1  | 4.9:1  | 8.5:1                | 11.5:1              | 3:1      |
| `category-quick-edge`     | `surface`                 | Quick's edge against the card               | 3.7:1  | 4.3:1  | 9.7:1                | 10.3:1              | 3:1      |
| `category-quick-edge`     | `category-quick-fill`     | Quick's edge against its fill               | 3.7:1  | 4.3:1  | 9.7:1                | 10.3:1              | 3:1      |
| `ink`                     | `category-chat-fill`      | A live reply in Chat                        | 14.2:1 | 13.6:1 | 15.8:1               | 17.3:1              | 7:1      |
| `category-chat-edge`      | `board`                   | Chat's edge against the board               | 5.1:1  | 7.1:1  | 7.4:1                | 11.3:1              | 3:1      |
| `category-chat-edge`      | `surface`                 | Chat's edge against the card                | 5.7:1  | 6.3:1  | 8.5:1                | 10.1:1              | 3:1      |
| `category-chat-edge`      | `category-chat-fill`      | Chat's edge against its fill                | 4.8:1  | 5.8:1  | 6.4:1                | 10.0:1              | 3:1      |
| `ink`                     | `category-care-fill`      | A live reply in Care and help               | 14.3:1 | 13.7:1 | 16.1:1               | 17.0:1              | 7:1      |
| `category-care-edge`      | `board`                   | Care and help's edge against the board      | 4.8:1  | 8.3:1  | 7.1:1                | 12.2:1              | 3:1      |
| `category-care-edge`      | `surface`                 | Care and help's edge against the card       | 5.4:1  | 7.4:1  | 8.2:1                | 10.9:1              | 3:1      |
| `category-care-edge`      | `category-care-fill`      | Care and help's edge against its fill       | 4.6:1  | 6.8:1  | 6.3:1                | 10.6:1              | 3:1      |
| `ink`                     | `category-body-pain-fill` | A live reply in Body and pain               | 13.6:1 | 14.5:1 | 14.6:1               | 18.0:1              | 7:1      |
| `category-body-pain-edge` | `board`                   | Body and pain's edge against the board      | 5.5:1  | 6.9:1  | 7.8:1                | 10.3:1              | 3:1      |
| `category-body-pain-edge` | `surface`                 | Body and pain's edge against the card       | 6.1:1  | 6.1:1  | 9.0:1                | 9.2:1               | 3:1      |
| `category-body-pain-edge` | `category-body-pain-fill` | Body and pain's edge against its fill       | 4.9:1  | 6.1:1  | 6.2:1                | 9.5:1               | 3:1      |
| `ink`                     | `category-food-fill`      | A live reply in Food and drink              | 14.6:1 | 13.4:1 | 16.3:1               | 17.0:1              | 7:1      |
| `category-food-edge`      | `board`                   | Food and drink's edge against the board     | 4.6:1  | 8.9:1  | 6.8:1                | 12.3:1              | 3:1      |
| `category-food-edge`      | `surface`                 | Food and drink's edge against the card      | 5.2:1  | 7.9:1  | 7.8:1                | 11.0:1              | 3:1      |
| `category-food-edge`      | `category-food-fill`      | Food and drink's edge against its fill      | 4.4:1  | 7.2:1  | 6.1:1                | 10.8:1              | 3:1      |
| `ink`                     | `category-feelings-fill`  | A live reply in Feelings                    | 14.0:1 | 13.6:1 | 15.4:1               | 17.1:1              | 7:1      |
| `category-feelings-edge`  | `board`                   | Feelings's edge against the board           | 4.3:1  | 7.6:1  | 6.5:1                | 10.9:1              | 3:1      |
| `category-feelings-edge`  | `surface`                 | Feelings's edge against the card            | 4.8:1  | 6.7:1  | 7.4:1                | 9.8:1               | 3:1      |
| `category-feelings-edge`  | `category-feelings-fill`  | Feelings's edge against its fill            | 4.0:1  | 6.2:1  | 5.4:1                | 9.6:1               | 3:1      |
| `ink`                     | `category-family-fill`    | A live reply in Family and friends          | 13.5:1 | 14.3:1 | 14.6:1               | 17.8:1              | 7:1      |
| `category-family-edge`    | `board`                   | Family and friends's edge against the board | 5.7:1  | 6.7:1  | 8.1:1                | 10.7:1              | 3:1      |
| `category-family-edge`    | `surface`                 | Family and friends's edge against the card  | 6.4:1  | 6.0:1  | 9.3:1                | 9.6:1               | 3:1      |
| `category-family-edge`    | `category-family-fill`    | Family and friends's edge against its fill  | 5.2:1  | 5.8:1  | 6.5:1                | 9.8:1               | 3:1      |
| `ink`                     | `category-health-fill`    | A live reply in Health                      | 14.2:1 | 13.4:1 | 15.9:1               | 16.8:1              | 7:1      |
| `category-health-edge`    | `board`                   | Health's edge against the board             | 5.0:1  | 8.9:1  | 7.2:1                | 12.5:1              | 3:1      |
| `category-health-edge`    | `surface`                 | Health's edge against the card              | 5.6:1  | 7.9:1  | 8.2:1                | 11.2:1              | 3:1      |
| `category-health-edge`    | `category-health-fill`    | Health's edge against its fill              | 4.7:1  | 7.2:1  | 6.2:1                | 10.8:1              | 3:1      |
| `ink`                     | `category-out-fill`       | A live reply in Out and about               | 15.1:1 | 13.2:1 | 17.0:1               | 16.7:1              | 7:1      |
| `category-out-edge`       | `board`                   | Out and about's edge against the board      | 4.6:1  | 9.3:1  | 7.0:1                | 12.9:1              | 3:1      |
| `category-out-edge`       | `surface`                 | Out and about's edge against the card       | 5.1:1  | 8.2:1  | 8.0:1                | 11.5:1              | 3:1      |
| `category-out-edge`       | `category-out-fill`       | Out and about's edge against its fill       | 4.6:1  | 7.4:1  | 6.5:1                | 11.0:1              | 3:1      |

- **One table, every pair.** Every text and background pair the components
  name is in these two tables, and `check_contrast.py` fails a component whose
  pair isn't; the theme test recomputes the same pairs from the code. The
  closest to a floor are the free lines' pill, `listen` on `listen-soft`, at
  4.5 to 1 in light, and `edge` on `board` at 3.3 to 1 in light.
- **Edges count.** A category's edge is checked against the board, the surface,
  and its own fill, since a card's edge is what separates it from all three.
- **The system decides the appearance.** Turn follows the iPhone's light or
  dark appearance, with `userInterfaceStyle: 'automatic'`, and offers no
  setting of its own: Apple says to "Avoid offering an app-specific appearance
  setting", and no one polarity suits every low-vision reader, since some read
  faster with light letters on dark ([AAC design notes][aac-polarity]).
- **Light is the reference.** Dark text on a light background reads faster for
  most people and for both age groups studied, so the light appearance is the
  one this document draws and checks first ([AAC design notes][aac-polarity]).
- **No pure-white glare on the board.** The light board is a warm paper, so
  cream cards stand off it with their edges; the dark board is a warm charcoal,
  as in iOS's own dark appearance, with dark cards.

[aac-polarity]: /docs/research/0028-aac-design.md#dark-mode-contrast-polarity-and-glare

## Typography

Turn uses the iPhone's own faces, and bundles none: `ui-rounded` (SF Pro
Rounded) for everything the user says or taps and for titles and buttons,
`ui-serif` (New York) for the partner's words and the consent card's question,
and `system-ui` (SF Pro) for other UI text. The AAC design notes found no
evidence that a bundled face, Atkinson Hyperlegible included, reads better, and
advise an ordinary iOS app in iOS's own type ([AAC design notes][aac-type]);
the trends notes call the system fonts the accessible choice for Turn
([trends notes][ft-nobans]). Each token names its job, and the table below
gives the Apple text style whose Dynamic Type curve it follows, which the code
sets as `dynamicTypeRamp`, since the format's linter rejects a ramp field
([trends notes][ft-tokens]).

```yaml
typography:
  phrase-big:
    fontFamily: ui-rounded
    fontSize: 34px
    fontWeight: 800
    lineHeight: 40px
  phrase-yes-no:
    fontFamily: ui-rounded
    fontSize: 28px
    fontWeight: 800
    lineHeight: 34px
  phrase:
    fontFamily: ui-rounded
    fontSize: 22px
    fontWeight: 700
    lineHeight: 27px
  phrase-strip:
    fontFamily: ui-rounded
    fontSize: 15px
    fontWeight: 600
    lineHeight: 19px
  partner-card-title:
    fontFamily: ui-serif
    fontSize: 30px
    fontWeight: 600
    lineHeight: 36px
  partner-line:
    fontFamily: ui-serif
    fontSize: 28px
    fontWeight: 500
    lineHeight: 33px
  partner-line-small:
    fontFamily: ui-serif
    fontSize: 21px
    fontWeight: 500
    lineHeight: 26px
  large-title:
    fontFamily: ui-rounded
    fontSize: 32px
    fontWeight: 800
    lineHeight: 38px
  title:
    fontFamily: ui-rounded
    fontSize: 22px
    fontWeight: 700
    lineHeight: 28px
  button:
    fontFamily: ui-rounded
    fontSize: 17px
    fontWeight: 700
    lineHeight: 22px
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
  callout:
    fontFamily: system-ui
    fontSize: 16px
    fontWeight: 500
    lineHeight: 21px
  label:
    fontFamily: system-ui
    fontSize: 15px
    fontWeight: 600
    lineHeight: 20px
  footnote:
    fontFamily: system-ui
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18px
  caption:
    fontFamily: system-ui
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
```

| Token                | Used for                                     | `dynamicTypeRamp` | With Bold Text |
| -------------------- | -------------------------------------------- | ----------------- | -------------- |
| `phrase-big`         | The big reply                                | `largeTitle`      | 800            |
| `phrase-yes-no`      | Yes and No                                   | `title1`          | 800            |
| `phrase`             | Row slots, grid phrases, and Not sure        | `title2`          | 700            |
| `phrase-strip`       | The conversation strip                       | `subheadline`     | 600            |
| `partner-card-title` | The consent card's question                  | `title1`          | 600            |
| `partner-line`       | The caption's words                          | `title1`          | 500            |
| `partner-line-small` | Partner words in the composers               | `title3`          | 500            |
| `large-title`        | Screen titles, and the paywall's title       | `largeTitle`      | 800            |
| `title`              | Sheet and card titles                        | `title2`          | 700            |
| `button`             | Buttons and capsules                         | `headline`        | 700            |
| `headline`           | Row titles in headers                        | `headline`        | 600            |
| `body`               | Settings, the permission step, and body text | `body`            | 400            |
| `callout`            | The paywall's promises                       | `callout`         | 500            |
| `label`              | Tabs, caption labels, and group headers      | `subheadline`     | 600            |
| `footnote`           | Notes, details, and legal lines              | `footnote`        | 400            |
| `caption`            | Toolbar labels, "Starter", and small pills   | `caption1`        | 600            |

- **Two voices, two typefaces.** The partner's words, and the words addressed
  to the partner, are set in the serif; everything the user says or taps is
  rounded bold, so a phrase never looks like the system's own chrome.
- **Check the two families on the first build.** React Native maps
  `ui-rounded` and `ui-serif` to Apple's designs on iOS; if either falls back
  to SF Pro, the fix is one line per style. Figma can't render Apple's fonts
  through its plugin runtime, so the v2 file shows Nunito, Newsreader, and
  Inter in their place, and its metrics differ slightly from the app's.
- **A slot fits less.** Rounded bold 22 is wider than v1's semibold 20, so a
  slot shows about 24 characters in two lines instead of 28; the slot height
  rule, two lines plus padding and never under 78, is unchanged.
- **Ramps.** Each text style sets its `dynamicTypeRamp`, so it grows the way
  the system's text does: without one, React Native multiplies every size by
  one factor, taking a 17-point Body to 60.7 points at AX5, where Apple's is
  53 ([Turn's iOS design notes][ios-scale]).
- **Never shrunk by code.** No text sets `allowFontScaling={false}`,
  `maxFontSizeMultiplier`, or a fixed height, and only the row's slots and the
  caption set `numberOfLines`; see [the row](#the-row) and
  [the caption](#the-caption).
- **Bold Text.** React Native's font code ignores the setting, so one hook
  swaps each token to its Bold Text weight on `boldTextChanged`, for system
  text too, since nothing says it thickens by itself
  ([Turn's iOS design notes][ios-bold]).
- **Left, sentence case, upright.** Text is left-aligned, so each line starts
  where the last one did, which helps readers who lose part of their visual
  field after a stroke ([AAC design notes][aac-type]); in sentence case, since
  capitals read slower; never in italics; and never in a weight under Regular
  ([trends notes][ft-type]).
- **Floors.** Nothing is under 15 points at the default size except the
  toolbar's labels and small pills, at 12, and legal lines, at 13; reading
  slows below about 13 characters a line, so the row and the grid lose columns
  before a phrase gets narrower ([AAC design notes][aac-type]).
- **Figures.** The free lines' count uses tabular figures,
  `fontVariant: ['tabular-nums']`, so it doesn't shift as it falls.
- **Pitch type.** Apple's license lets SF Pro appear only as the running app
  draws it, in screenshots and recordings of Turn. The video's titles, the
  Devpost thumbnail, the gallery's captions, and text in the README's images
  are set in Atkinson Hyperlegible Next, under the SIL Open Font License
  ([Turn's iOS design notes][ios-pitch-fonts]).

[aac-type]: /docs/research/0028-aac-design.md#text-size-line-length-and-fonts
[ios-scale]: /docs/research/0029-turn-ios-design.md#scaling-text-in-react-native-086
[ios-bold]: /docs/research/0029-turn-ios-design.md#bold-text-and-custom-fonts
[ft-type]: /docs/research/0027-turn-frontend-trends.md#bold-large-and-variable-type
[ios-pitch-fonts]: /docs/research/0029-turn-ios-design.md#fonts-in-the-video-and-gallery-images

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
  caption: 86px
  button: 56px
  list-row: 56px
  bar: 52px
  toolbar: 64px
  edge-width: 1.5px
  edge-width-strong: 2.5px
```

Sizes are points: the format's `px` means a point on the iPhone. `target` is
the smallest control, `strip-cell` the strip's shortest phrase button, `slot`
the row's slot and the grid's shortest phrase button, `caption` the caption's
height, `button` a capsule button's height, `list-row` a list group's row,
`bar` the top bar's height, `toolbar` the floating toolbar's height, and
`edge-width` and `edge-width-strong` the thickness of edges.

- **Why 78 points.** Speech buttons should be at least 12 mm on their short
  side for people with tremor or weakness, and errors kept falling up to 18 mm
  in one study ([AAC design notes][aac-targets]). Seventy-eight points is 12.2
  mm on a 326-ppi iPhone and 12.9 mm on a 460-ppi one, above A11Y-1's 64.
- **Why wide, with gaps.** Keys should be "wider instead of taller" for older
  hands, and zero spacing was least accurate, so phrase buttons are wider than
  tall, with 12 points between them ([AAC design notes][aac-targets]).
- **The toolbar floats.** The bottom toolbar sits 2 points above the home
  indicator's 34-point area, and the grid scrolls under it.

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

| Band        | Height at the default text size | What sets it                                                         |
| ----------- | ------------------------------- | -------------------------------------------------------------------- |
| Top bar     | 52 points                       | `bar`                                                                |
| The caption | 86 points                       | A label and two lines of `partner-line`, with one button beside them |
| The strip   | About 120 points                | Two rows of cells whose phrases wrap to two lines on a phone         |
| The row     | 258 points                      | Three rows of 78-point slots and two 12-point gaps                   |
| Tabs        | 44 points                       | `target`                                                             |
| The grid    | The rest                        | About 100 points, one row, on a 6.1-inch iPhone; 200 on a 6.9-inch   |
| Bottom bar  | 64 points                       | `toolbar`, floating above the home indicator                         |

- **The grid gets what's left.** The PRD puts the strip and the row above the
  grid, and the row's 12-mm slots take their room, so on a 6.1-inch iPhone
  the grid shows one row of phrases at a time, and its page buttons move it a
  screen at a tap.
- **Gaps.** 8 points between bands, 12 inside the row and the grid, and 16
  from the screen's edges; the board's color runs under the status bar and
  the home indicator, and content stays inside the safe areas.
- **What doesn't scroll.** The top bar, the caption, the strip, the row, the
  tabs, and the bottom bar sit outside the grid's scroll view, so nothing
  collapses or slides them away ([Turn's iOS design notes][ios-bars]); only the
  grid scrolls.
- **The thumb's band.** The strip and the row fill the middle of the screen,
  where one thumb reaches best, and the top bar holds only what isn't speech
  ([AAC design notes][aac-reach]).

[ios-bars]: /docs/research/0029-turn-ios-design.md#bars-that-minimize-and-new-scroll-edges
[aac-reach]: /docs/research/0028-aac-design.md#one-handed-use-and-where-controls-sit

### Widths

Turn lays out by the width it's given, not by the device, since an app built
with the iOS 27 SDK resizes on iPad and in iPhone Mirroring
([Turn's iOS design notes][ios-resize]). A phrase column needs at least 154
points, about 13 characters of `phrase` inside 12-point padding.

| Width available      | The row                    | The strip                           | The grid    |
| -------------------- | -------------------------- | ----------------------------------- | ----------- |
| Under 352 points     | One column of six slots    | One column                          | One column  |
| 352 points and wider | Two columns of three slots | Three columns, the fourth spans two | Two columns |

- **Slots keep their order.** Slots 1 to 6 read left to right, then down, at
  every width, so Yes, No, and Not sure are always first.
- **Checked at** 320, 375, 402, and 440 points wide; a wider window, as on an
  iPad, keeps two columns with wider phrases.

### Short screens and large text

- **Short screens.** Where the space between the top bar and the screen's
  bottom is under 700 points, as on an iPhone SE, the row's slots and the
  grid's buttons take A11Y-1's 64 points, with phrases at `button`'s rounded
  size inside 10-point padding and 8 points between slots. Below AX1 the caption is one
  48-point line: its note, or else its speaker label, then the newest words,
  cut at the start. The tabs drop their 4-point margins. That leaves the grid's
  first row on screen at launch (SPEAK-1), and the caption, the strip, the row,
  the tabs, and the grid scroll together as one column between the top bar and
  the bottom bar.
- **From AX1.** When the font scale reaches 1.786, at AX1, the row, the strip,
  and the grid take one column each, and everything between the top bar and
  the bottom bar scrolls as one column, as on short screens. Apple advises
  fewer columns as text grows ([Turn's iOS design notes][ios-dt-turn]).
- **Heights follow the text size and the screen, never the content.** A
  slot's height is two lines of `phrase` at the current size plus
  its padding, and never less than 78 points, or 64 on short screens; so at
  AX5 a slot is 154 points tall, and the row holds its height whatever it
  shows.

[ios-dt-turn]: /docs/research/0029-turn-ios-design.md#dynamic-type-sizes-for-turns-styles

### With the keyboard up

- The composer docks above the keyboard; the tabs, the grid, and the bottom
  bar slip under it.
- The caption's words move into the composer's label, "Replying to", so the
  top bar, the strip, and the row stay in view above the composer.
- Where they don't fit, as on an iPhone SE, the space above the composer
  scrolls, the row first.

## Elevation

- **Depth by shadow and edges.** The board is the floor and cards sit on it
  with a two-layer shadow and a 1.5-point `edge`; a press darkens the fill and
  thickens the edge, and the card never moves or scales. The shadows are
  React Native 0.86's `boxShadow` strings, in the table below. No view uses
  the `filter` prop's drop shadow, since it clips children.
- **Glass on the floating toolbar only.** Turn's one `GlassView` is the bottom
  toolbar, with `GlassView` from expo-glass-effect where
  `isLiquidGlassAvailable()`, `surface` at 82% over a `BlurView` otherwise, and
  opaque `surface` when
  `AccessibilityInfo.isReduceTransparencyEnabled()`. No `GlassView` is ever
  faded with `opacity`.
- **The system's glass elsewhere.** Bars, sheets, alerts, and switches turn to
  glass by themselves, and Xcode 27 ignores `UIDesignRequiresCompatibility`, so
  an app can no longer opt out ([Turn's iOS design notes][ios-key]). Settings'
  and the editor's navigation bars, the permission step's sheet, RevenueCat's
  paywall sheet, alerts, and the under-18 switch show it
  ([Turn's iOS design notes][ios-chrome]). The home screen has no navigation
  bar, and the composer above the keyboard is solid, like every other place
  that holds words.
- **Nothing glass behind words.** Phrases, the caption, notes, and the consent
  card are content, where Apple says not to use glass
  ([Turn's iOS design notes][ios-glass-content]).
- **Sheets that hold reading text set a background.** Expo Router makes a
  form sheet's header and content transparent where glass is available, so the
  permission step sets `headerTransparent: false` and a `surface` background
  ([Turn's iOS design notes][ios-glass-expo]).
- **The lamp's glow is behind everything.** While listening, a radial
  gradient in `listen-glow` at 30%, 560 by 420 points, centered near the
  Listen control, washes the top of the board, through
  `experimental_backgroundImage` or an exported ellipse.
- **Every glass setting leaves the words readable.** Reduce Transparency and
  the Liquid Glass slider, from clear to tinted, change only the toolbar and
  the system's chrome; Increase Contrast also moves Turn's own colors to their
  `-hc` values ([Turn's iOS design notes][ios-glass-settings]).

| Shadow                         | Light                                                          | Dark                                                    |
| ------------------------------ | -------------------------------------------------------------- | ------------------------------------------------------- |
| A card                         | `0 1px 2px rgba(30,26,21,.06), 0 6px 16px rgba(30,26,21,.07)`  | `0 1px 2px rgba(0,0,0,.45), 0 8px 20px rgba(0,0,0,.35)` |
| Raised: the toolbar and sheets | `0 2px 4px rgba(30,26,21,.08), 0 14px 32px rgba(30,26,21,.12)` | `0 2px 4px rgba(0,0,0,.5), 0 14px 32px rgba(0,0,0,.45)` |
| The listening light's glow     | `0 0 18px 2px rgba(255,138,61,.55)`                            | The same                                                |
| The big reply                  | `0 10px 28px rgba(36,56,201,.35)`                              | None                                                    |

[ios-key]: /docs/research/0029-turn-ios-design.md#the-compatibility-key-under-xcode-27
[ios-chrome]: /docs/research/0029-turn-ios-design.md#turns-chrome-that-turns-to-glass
[ios-glass-expo]: /docs/research/0029-turn-ios-design.md#glass-in-expo-sdk-57-and-how-to-avoid-it
[ios-glass-settings]: /docs/research/0029-turn-ios-design.md#settings-that-change-glass

## Shapes

```yaml
rounded:
  chip: 14px
  card: 20px
  panel: 24px
  big: 28px
  sheet: 34px
  full: 9999px
```

- **Cards and panels.** Phrase cards take `card`; the caption's panel and list
  groups take `panel`; the big reply takes `big`; and a sheet takes `sheet`.
- **Chips** for the strip's phrases, the tabs, the tabs' small pills, and the
  small tiles in a list take `chip`.
- **Capsules** for controls that hold one word or two: the Listen control,
  the toolbar, the place picker, buttons, and the caption's Clear pill take
  `full`, "a radius that's half the height" ([iOS design notes][ios-capsule]).
- **Edges.** Cards and secondary buttons have an `edge` as thick as
  `spacing.edge-width`, 1.5 points, in the category's edge color on phrase
  cards and `edge` elsewhere; pressed, speaking, Yes, No, Not sure, the
  listening caption, and focus take `spacing.edge-width-strong`, 2.5 points;
  the selected tab and marker-blue fills need none.
- **Concentric.** A shape inside another takes the outer radius minus the
  padding between them; `chip` is for small marks inside cards, such as the
  speaking symbol.

[ios-capsule]: /docs/research/0015-ios-design.md#glass-in-custom-controls

## Components

Each component below is written for the light appearance. For every pair of
text and background colors, one component also appears as `-dark`,
`-light-hc`, and `-dark-hc`, naming that appearance's colors, so the linter
checks all four; edges appear the same way, and every other property is the
light entry's. Heights and padding name the spacing tokens. The format has no
border property, so each edge color is a component of its own, whose `height`
holds the edge's thickness. A phrase card's edge and its Tinted fill come from
its category, so `phrase-tinted` and `category-edge-out` name the last category
as the sample and each category supplies its own.

```yaml
components:
  phrase:
    backgroundColor: '{colors.surface.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.phrase}'
    rounded: '{rounded.card}'
    padding: '{spacing.md}'
    height: '{spacing.slot}'
  phrase-pressed:
    backgroundColor: '{colors.surface-pressed.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.phrase}'
    rounded: '{rounded.card}'
    padding: '{spacing.md}'
    height: '{spacing.slot}'
  phrase-tinted:
    backgroundColor: '{colors.category-out-fill.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.phrase}'
    rounded: '{rounded.card}'
    padding: '{spacing.md}'
    height: '{spacing.slot}'
  category-edge-out:
    backgroundColor: '{colors.category-out-edge.light}'
    height: '{spacing.edge-width}'
  phrase-speaking:
    backgroundColor: '{colors.accent-soft.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.phrase}'
    rounded: '{rounded.card}'
    padding: '{spacing.md}'
    height: '{spacing.slot}'
  big:
    backgroundColor: '{colors.accent.light}'
    textColor: '{colors.on-accent.light}'
    typography: '{typography.phrase-big}'
    rounded: '{rounded.big}'
    padding: '{spacing.lg}'
  big-pressed:
    backgroundColor: '{colors.accent-pressed.light}'
    textColor: '{colors.on-accent.light}'
    typography: '{typography.phrase-big}'
    rounded: '{rounded.big}'
    padding: '{spacing.lg}'
  big-tag:
    backgroundColor: '{colors.accent.light}'
    textColor: '{colors.on-accent.light}'
    typography: '{typography.caption}'
    rounded: '{rounded.chip}'
  yes:
    backgroundColor: '{colors.yes-fill.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.phrase}'
    rounded: '{rounded.card}'
    padding: '{spacing.md}'
    height: '{spacing.slot}'
  no:
    backgroundColor: '{colors.no-fill.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.phrase}'
    rounded: '{rounded.card}'
    padding: '{spacing.md}'
    height: '{spacing.slot}'
  unsure:
    backgroundColor: '{colors.unsure-fill.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.phrase}'
    rounded: '{rounded.card}'
    padding: '{spacing.md}'
    height: '{spacing.slot}'
  strip-phrase:
    backgroundColor: '{colors.surface.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.phrase-strip}'
    rounded: '{rounded.chip}'
    padding: '{spacing.sm}'
    height: '{spacing.strip-cell}'
  strip-urgent:
    backgroundColor: '{colors.no-fill.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.phrase-strip}'
    rounded: '{rounded.chip}'
    padding: '{spacing.sm}'
    height: '{spacing.strip-cell}'
  caption:
    backgroundColor: '{colors.surface.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.partner-line}'
    rounded: '{rounded.panel}'
    padding: '{spacing.sm}'
    height: '{spacing.caption}'
  caption-hearing:
    backgroundColor: '{colors.surface.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.partner-line}'
    rounded: '{rounded.panel}'
    padding: '{spacing.sm}'
    height: '{spacing.caption}'
  caption-label:
    backgroundColor: '{colors.surface.light}'
    textColor: '{colors.listen.light}'
    typography: '{typography.label}'
  note:
    backgroundColor: '{colors.surface-sunken.light}'
    textColor: '{colors.ink-secondary.light}'
    typography: '{typography.label}'
  board-glow:
    backgroundColor: '{colors.listen-glow.light}'
    rounded: '{rounded.full}'
  board-glow-dark:
    backgroundColor: '{colors.listen-glow.dark}'
  board-glow-light-hc:
    backgroundColor: '{colors.listen-glow.light-hc}'
  board-glow-dark-hc:
    backgroundColor: '{colors.listen-glow.dark-hc}'
  listening:
    backgroundColor: '{colors.listen.light}'
    textColor: '{colors.on-listen.light}'
    typography: '{typography.button}'
    rounded: '{rounded.full}'
    padding: '{spacing.md}'
    height: '{spacing.target}'
  listening-off:
    backgroundColor: '{colors.listen-soft.light}'
    textColor: '{colors.listen.light}'
    typography: '{typography.caption}'
    rounded: '{rounded.full}'
    padding: '{spacing.sm}'
  tab:
    backgroundColor: '{colors.surface.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.label}'
    rounded: '{rounded.full}'
    padding: '{spacing.md}'
    height: '{spacing.target}'
  tab-selected:
    backgroundColor: '{colors.ink.light}'
    textColor: '{colors.surface.light}'
    typography: '{typography.label}'
    rounded: '{rounded.full}'
    padding: '{spacing.md}'
    height: '{spacing.target}'
  toolbar:
    backgroundColor: '{colors.surface.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.caption}'
    rounded: '{rounded.full}'
    height: '{spacing.toolbar}'
  toolbar-type:
    backgroundColor: '{colors.accent.light}'
    textColor: '{colors.on-accent.light}'
    typography: '{typography.caption}'
    rounded: '{rounded.full}'
  toolbar-stop:
    backgroundColor: '{colors.ink.light}'
    textColor: '{colors.surface.light}'
    typography: '{typography.caption}'
    rounded: '{rounded.full}'
  button-primary:
    backgroundColor: '{colors.accent.light}'
    textColor: '{colors.on-accent.light}'
    typography: '{typography.button}'
    rounded: '{rounded.full}'
    padding: '{spacing.lg}'
    height: '{spacing.button}'
  button-secondary:
    backgroundColor: '{colors.surface.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.button}'
    rounded: '{rounded.full}'
    padding: '{spacing.lg}'
    height: '{spacing.button}'
  list-row:
    backgroundColor: '{colors.surface.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.body}'
    rounded: '{rounded.panel}'
    height: '{spacing.list-row}'
  link:
    backgroundColor: '{colors.surface.light}'
    textColor: '{colors.accent.light}'
    typography: '{typography.body}'
  consent-lead:
    backgroundColor: '{colors.board.light}'
    textColor: '{colors.ink.light}'
    typography: '{typography.partner-card-title}'
  edge:
    backgroundColor: '{colors.edge.light}'
    height: '{spacing.edge-width}'
  category-edge:
    backgroundColor: '{colors.category-out-edge.light}'
    height: '{spacing.edge-width}'
  yes-edge:
    backgroundColor: '{colors.yes-edge.light}'
    height: '{spacing.edge-width-strong}'
  no-edge:
    backgroundColor: '{colors.no-edge.light}'
    height: '{spacing.edge-width-strong}'
  unsure-edge:
    backgroundColor: '{colors.unsure-edge.light}'
    height: '{spacing.edge-width-strong}'
  hairline:
    backgroundColor: '{colors.hairline.light}'
    height: '1px'
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
    backgroundColor: '{colors.surface-pressed.dark}'
    textColor: '{colors.ink.dark}'
  phrase-pressed-light-hc:
    backgroundColor: '{colors.surface-pressed.light-hc}'
    textColor: '{colors.ink.light-hc}'
  phrase-pressed-dark-hc:
    backgroundColor: '{colors.surface-pressed.dark-hc}'
    textColor: '{colors.ink.dark-hc}'
  phrase-tinted-dark:
    backgroundColor: '{colors.category-out-fill.dark}'
    textColor: '{colors.ink.dark}'
  category-edge-out-dark:
    backgroundColor: '{colors.category-out-edge.dark}'
  phrase-speaking-dark:
    backgroundColor: '{colors.accent-soft.dark}'
    textColor: '{colors.ink.dark}'
  phrase-tinted-light-hc:
    backgroundColor: '{colors.category-out-fill.light-hc}'
    textColor: '{colors.ink.light-hc}'
  category-edge-out-light-hc:
    backgroundColor: '{colors.category-out-edge.light-hc}'
  phrase-speaking-light-hc:
    backgroundColor: '{colors.accent-soft.light-hc}'
    textColor: '{colors.ink.light-hc}'
  phrase-tinted-dark-hc:
    backgroundColor: '{colors.category-out-fill.dark-hc}'
    textColor: '{colors.ink.dark-hc}'
  category-edge-out-dark-hc:
    backgroundColor: '{colors.category-out-edge.dark-hc}'
  phrase-speaking-dark-hc:
    backgroundColor: '{colors.accent-soft.dark-hc}'
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
  big-tag-dark:
    backgroundColor: '{colors.accent.dark}'
    textColor: '{colors.on-accent.dark}'
  big-tag-light-hc:
    backgroundColor: '{colors.accent.light-hc}'
    textColor: '{colors.on-accent.light-hc}'
  big-tag-dark-hc:
    backgroundColor: '{colors.accent.dark-hc}'
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
  strip-phrase-dark:
    backgroundColor: '{colors.surface.dark}'
    textColor: '{colors.ink.dark}'
  strip-phrase-light-hc:
    backgroundColor: '{colors.surface.light-hc}'
    textColor: '{colors.ink.light-hc}'
  strip-phrase-dark-hc:
    backgroundColor: '{colors.surface.dark-hc}'
    textColor: '{colors.ink.dark-hc}'
  strip-urgent-dark:
    backgroundColor: '{colors.no-fill.dark}'
    textColor: '{colors.ink.dark}'
  strip-urgent-light-hc:
    backgroundColor: '{colors.no-fill.light-hc}'
    textColor: '{colors.ink.light-hc}'
  strip-urgent-dark-hc:
    backgroundColor: '{colors.no-fill.dark-hc}'
    textColor: '{colors.ink.dark-hc}'
  caption-dark:
    backgroundColor: '{colors.surface.dark}'
    textColor: '{colors.ink.dark}'
  caption-light-hc:
    backgroundColor: '{colors.surface.light-hc}'
    textColor: '{colors.ink.light-hc}'
  caption-dark-hc:
    backgroundColor: '{colors.surface.dark-hc}'
    textColor: '{colors.ink.dark-hc}'
  caption-hearing-dark:
    backgroundColor: '{colors.surface.dark}'
    textColor: '{colors.ink.dark}'
  caption-hearing-light-hc:
    backgroundColor: '{colors.surface.light-hc}'
    textColor: '{colors.ink.light-hc}'
  caption-hearing-dark-hc:
    backgroundColor: '{colors.surface.dark-hc}'
    textColor: '{colors.ink.dark-hc}'
  caption-label-dark:
    backgroundColor: '{colors.surface.dark}'
    textColor: '{colors.listen.dark}'
  caption-label-light-hc:
    backgroundColor: '{colors.surface.light-hc}'
    textColor: '{colors.listen.light-hc}'
  caption-label-dark-hc:
    backgroundColor: '{colors.surface.dark-hc}'
    textColor: '{colors.listen.dark-hc}'
  note-dark:
    backgroundColor: '{colors.surface-sunken.dark}'
    textColor: '{colors.ink-secondary.dark}'
  note-light-hc:
    backgroundColor: '{colors.surface-sunken.light-hc}'
    textColor: '{colors.ink-secondary.light-hc}'
  note-dark-hc:
    backgroundColor: '{colors.surface-sunken.dark-hc}'
    textColor: '{colors.ink-secondary.dark-hc}'
  listening-dark:
    backgroundColor: '{colors.listen.dark}'
    textColor: '{colors.on-listen.dark}'
  listening-light-hc:
    backgroundColor: '{colors.listen.light-hc}'
    textColor: '{colors.on-listen.light-hc}'
  listening-dark-hc:
    backgroundColor: '{colors.listen.dark-hc}'
    textColor: '{colors.on-listen.dark-hc}'
  listening-off-dark:
    backgroundColor: '{colors.listen-soft.dark}'
    textColor: '{colors.listen.dark}'
  listening-off-light-hc:
    backgroundColor: '{colors.listen-soft.light-hc}'
    textColor: '{colors.listen.light-hc}'
  listening-off-dark-hc:
    backgroundColor: '{colors.listen-soft.dark-hc}'
    textColor: '{colors.listen.dark-hc}'
  tab-dark:
    backgroundColor: '{colors.surface.dark}'
    textColor: '{colors.ink.dark}'
  tab-light-hc:
    backgroundColor: '{colors.surface.light-hc}'
    textColor: '{colors.ink.light-hc}'
  tab-dark-hc:
    backgroundColor: '{colors.surface.dark-hc}'
    textColor: '{colors.ink.dark-hc}'
  tab-selected-dark:
    backgroundColor: '{colors.ink.dark}'
    textColor: '{colors.surface.dark}'
  tab-selected-light-hc:
    backgroundColor: '{colors.ink.light-hc}'
    textColor: '{colors.surface.light-hc}'
  tab-selected-dark-hc:
    backgroundColor: '{colors.ink.dark-hc}'
    textColor: '{colors.surface.dark-hc}'
  toolbar-dark:
    backgroundColor: '{colors.surface.dark}'
    textColor: '{colors.ink.dark}'
  toolbar-light-hc:
    backgroundColor: '{colors.surface.light-hc}'
    textColor: '{colors.ink.light-hc}'
  toolbar-dark-hc:
    backgroundColor: '{colors.surface.dark-hc}'
    textColor: '{colors.ink.dark-hc}'
  toolbar-type-dark:
    backgroundColor: '{colors.accent.dark}'
    textColor: '{colors.on-accent.dark}'
  toolbar-type-light-hc:
    backgroundColor: '{colors.accent.light-hc}'
    textColor: '{colors.on-accent.light-hc}'
  toolbar-type-dark-hc:
    backgroundColor: '{colors.accent.dark-hc}'
    textColor: '{colors.on-accent.dark-hc}'
  toolbar-stop-dark:
    backgroundColor: '{colors.ink.dark}'
    textColor: '{colors.surface.dark}'
  toolbar-stop-light-hc:
    backgroundColor: '{colors.ink.light-hc}'
    textColor: '{colors.surface.light-hc}'
  toolbar-stop-dark-hc:
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
  category-edge-dark:
    backgroundColor: '{colors.category-out-edge.dark}'
  category-edge-light-hc:
    backgroundColor: '{colors.category-out-edge.light-hc}'
  category-edge-dark-hc:
    backgroundColor: '{colors.category-out-edge.dark-hc}'
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
  hairline-dark:
    backgroundColor: '{colors.hairline.dark}'
  hairline-light-hc:
    backgroundColor: '{colors.hairline.light-hc}'
  hairline-dark-hc:
    backgroundColor: '{colors.hairline.dark-hc}'
```

### The phrase button

- **Look.** A `surface` card with a 1.5-point edge in its category's color,
  `card` corners, 12-point padding, and the phrase in `phrase`, `ink`,
  left-aligned and wrapped; at least 78 points tall and as wide as its column.
  The whole card is the target.
- **Four states.** Plain is a `surface` card on the category's edge; Tinted, the
  state a reply to the current line takes, fills with the category's fill;
  Pressed is `surface-pressed` with a 2.5-point edge, on touch-down, speaking
  on touch-up; Speaking is `accent-soft` with a 2.5-point `accent` edge.
- **Press.** The fill turns `surface-pressed` at once and back on release,
  with no change of size; the phrase speaks on release, and sliding off
  cancels ([motionsites notes][ms-app]).
- **Speaking.** While its phrase speaks, the card shows `waveform` pinned to
  its bottom trailing corner, so the text never reflows, in its text's color:
  `ink` on cards and tints, and `on-accent` on the big reply.
- **Accessibility.** Its label is its text and its trait is button, and Edit
  and Move are named actions, never long presses (A11Y-2, A11Y-8)
  ([TRD][trd-a11y]).

### The row

The row's height and its six slots are fixed for the text size and the screen
(ROW-1); only what's in a slot changes.

- **Filling.** Replies fill slots from the first, as ROW-5 moves them; an empty
  slot shows the board, with no frame, so it doesn't look like a button. When
  all six are empty, the first two slots' space shows a note in `label`,
  `ink-secondary`: "Replies to your partner appear here.", or, with the under-18
  switch on, "Listen mode is off for this partner." (CONSENT-6). Until the
  starter phrases are reviewed, the empty row holds their invitation instead,
  on `accent-soft` ([the first launch](#the-first-launch)).
- **A phrase too long for its slot.** A slot holds two lines of `phrase`; a
  longer phrase steps down to `button`'s size, still two lines, and past that
  ends with an ellipsis. VoiceOver reads the whole phrase, a tap speaks the
  whole phrase, and the grid shows it whole (A11Y-4). Phrases short enough to
  fit, with their key words first, choose faster ([AAC design notes][aac-cost]).
- **The big button.** When ROW-3 shows one, it fills the frame of all six
  slots: marker blue, `big` corners, 16-point padding, the phrase in
  `phrase-big`, `on-accent`, left-aligned at the top, and the reply's category
  as a tag at its top left on `accent-tag`. The speaker mark
  `speaker.wave.2.fill` sits bottom-right at 75%; a white radial sheen and a
  faint ring are decoration, and both are hidden under Increase Contrast. A
  phrase too long for the frame at that size steps down to `phrase`'s size, and
  past that ends with an ellipsis, as a slot's does, with the whole phrase in
  VoiceOver and speech (A11Y-4). It's still just a phrase: no label, no badge,
  and it speaks only on a tap (ROW-6). Its phrase moves to the first free slot
  afterward if it stays at or above the floor (ROW-5).
- **Yes, No, and Not sure.** In slots 1 to 3 for a yes-or-no question (ROW-4),
  as `yes`, `no`, and `unsure`: the word in `phrase`, `ink`, on its tint,
  inside a 2.5-point edge of its color, with a 40-point disc in the edge color
  carrying `checkmark`, `xmark`, or `questionmark.circle` in `surface`. The
  Quick category shows them the same way.
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

[aac-cost]: /docs/research/0028-aac-design.md#what-prediction-displays-cost
[ios-symbols]: /docs/research/0029-turn-ios-design.md#symbols-for-speaking-listening-and-answering
[aac-stale]: /docs/research/0028-aac-design.md#stale-rows-empty-rows-and-targets-that-move

### The strip

- **Look.** Five `strip-phrase` chips in a fixed order: "Wait, I'm typing",
  "Sorry, say that again", and "And you?" in the first row, and "I use this
  app to talk. Please give me time.", spanning two columns, and "Something's
  wrong" in the second (SPEAK-7). Text in `phrase-strip` wraps and is never
  cut; chips are at least 48 points tall, with 8 points between them.
- **"Something's wrong"** is the strip's one Urgent chip, on `no-fill` with a
  `no-edge`; every other chip is `surface` on an `edge`.
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

- **Look.** A `caption` panel across the screen, 86 points tall at the default
  size: a speaker label in `label`, then up to two lines of the partner's
  words in `partner-line`, `ink`, with one capsule button at its trailing
  edge. While hearing, the panel is `caption-hearing`: a 2.5-point `listen`
  edge, the lamp's glow, a 10-point light, and a five-bar meter, with "They're
  saying" in `listen`.
- **Words.** A long partner line shows its last two lines, cut at the start
  with an ellipsis, since the newest words matter most, and VoiceOver reads
  the whole line. The words, and the partner's words that "Still answering"
  and "Replying to" quote, live only in memory and clear as LISTEN-8 says.
- **The button.** Done while a partner line is open (LISTEN-2), and Clear when
  the row holds replies (ROW-10) as a 32-tall pill with a 44-point hit area; it
  never moves, so a hand learns it.
- **Notes.** A `note` pill replaces the speaker label's right half, with its
  symbol, on `surface-sunken`: the phone ranked the replies (STATE-1), Listen
  mode is degraded (STATE-2, STATE-3), Listen mode is off for this partner
  (CONSENT-6), live transcription isn't available (LISTEN-9), or the speech
  model is downloading, with a progress bar under the words (LISTEN-1).
- **Tap.** In Listen mode, a tap on the words opens the composer for the
  partner's words (LISTEN-4).

### The Listen control

The top bar's trailing control, in `button`, with its symbol before its
word:

| State     | Looks                                                                                               | A tap                                                                 |
| --------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Off       | A capsule: `ear`, "Listen", and "20 free" on a `listen-soft` pill                                   | Starts Listen mode: the permission step the first time, then the card |
| Locked    | A capsule: `lock`, "Listen", and "Unlock"                                                           | Opens the paywall (PAY-2)                                             |
| Listening | The `listening` capsule, orange, with `ear` and "Listening", and the free lines on a pill beside it | Pauses (CONSENT-5)                                                    |
| Paused    | A capsule: `pause.fill`, "Paused", with End beside it in its own capsule                            | Resumes without the card; End stops Listen mode and clears the row    |
| Mic off   | A capsule: `mic.slash.fill`, "Mic off", with End beside it                                          | Nothing: the caption says why (CONSENT-6, LISTEN-9); End stops it     |

- **The light.** While the partner's words arrive, the light's symbol and the
  five-bar meter follow the input level, a ring grows from the light and fades,
  and a warm radial glow washes the top of the board, in `listen` and
  `listen-glow`; a word and a symbol carry its meaning, and the color is a
  third cue ([AAC design notes][aac-light]). Paused and off states drop the
  glow.
- **Large at first.** When a session starts, the caption says "Listening" in
  `partner-line` until the first words arrive, since small lights go unnoticed
  ([AAC design notes][aac-light]).
- **Free lines.** The count, "20 free", sits under "Listen" in `caption`, in
  tabular figures, until Turn Listen is bought (PAY-1).

[aac-light]: /docs/research/0028-aac-design.md#showing-a-bystander-that-a-device-listens

### The place picker

A chip in the top bar with the place's symbol, its name, and `chevron.down`. A
tap opens iOS's own menu of the user's places, and one tap on a place chooses
it (PLACE-1).

### The tabs

- **Look.** One chip per category, in the bank's order with Quick first
  (BANK-5), as `tab`, each with a 10-point dot in its category's color; the
  selected one is `tab-selected`, `surface` words on an `ink` fill.
- **The mark.** The tab ROW-9 marks keeps the dot before its name, in its
  category's color, and gets "suggested" as its accessibility value; the tabs
  never scroll or reorder to show it.
- **All.** The tabs scroll sideways when they don't fit, but All, pinned at the
  trailing end outside the scroll, lists every category at once, the marked one
  with its dot, since older adults miss sideways scrolling
  ([AAC design notes][aac-grid]).

### The grid

- **Look.** The selected category's phrases as phrase buttons, in the bank's
  order (BANK-4), in the columns [Widths](#widths) gives; every button in a
  grid row takes the row's tallest height, and text is never cut.
- **Scrolling.** Up and down only, with the system's scroll indicator, and
  the floating toolbar's Up and Down move it a screen at a tap, so it never
  needs a swipe (A11Y-5), as the AAC notes advise
  ([AAC design notes][aac-grid]). The grid scrolls under the toolbar.

### The bottom bar

A 370 by 64 floating glass capsule, 2 points above the home indicator's
34-point area, with four items 84 by 52, each a symbol above its label in
`caption`:

- **Type** (`keyboard`) opens the composer (SPEAK-1, SPEAK-3), on an `accent`
  pill.
- **Repeat** (`arrow.counterclockwise`) says the last spoken text again
  (SPEAK-6), and becomes **Stop** (`stop.fill`) on an `ink` pill while Turn
  speaks (SPEAK-2), in the same place.
- **Up** and **Down** (`chevron.up` and `chevron.down`) scroll the grid by a
  screen, or the whole column on short screens and from AX1.
- **At large sizes** the four take two rows, so no label is cut.

### The composer

- **Your words.** Docked above the keyboard: a field in `body` that grows to
  four lines and then scrolls, "Replying to" and the partner's line above it in
  `partner-line-small`, and Speak as `button-primary` (SPEAK-3). While Turn
  speaks, Speak becomes Stop. Within 50 characters of the 500-character limit, a
  count in `label` says how many are left.
- **Their words.** The same composer, labeled "What did they say?" (LISTEN-4),
  with Send as `button-secondary`, never marker blue, so a partner's words
  can't be mistaken for the user's.

### Buttons and lists

- **Primary.** `button-primary`: a marker-blue capsule, 56 points tall, its
  word in `button`, `on-accent`; at most one to a screen.
- **Secondary.** `button-secondary`: a card capsule with an `edge`.
- **Equal pairs.** "Allow" and "Not now", and "They agreed" and "They said no",
  are two secondary buttons of one size and style, side by side, stacked from
  AX1: Apple marks a preferred choice by "style — not size", and neither of
  these is preferred ([Turn's iOS design notes][ios-hig-changes]).
- **Lists.** Settings and the editor use inset groups on the board: rows at
  least 56 points tall in a `surface` group with a 1.5 `edge` and hairline
  dividers, each with a 32-point symbol tile colored by meaning, with `body`
  text and `link` for links. The tile is `accent` for voice and purchase,
  `listen` for Listen mode, and the category's color for places and the bank.
- **Symbol buttons.** At least 44 by 44 points, each with a label.

[ios-hig-changes]: /docs/research/0029-turn-ios-design.md#hig-changes-since-june-2025

## Motion

Motion is feedback, never decoration. The format has no motion tokens, and its
maintainer points motion to prose, so this table is the whole inventory
([trends notes][ft-proposals]). Every animation uses Reanimated with
`ReduceMotion.System`, and every row says what Reduce Motion shows instead.

| Moment            | What moves                                                                                        | Timing                                                                             | Reduce Motion                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| A press           | Fill to `surface-pressed` or `accent-pressed`, edge to 2.5; nothing translates or scales          | Instant on touch-down; back in 120 ms                                              | The same                                                          |
| Replies arrive    | In each changed slot, the old words fade out, the new fade in rising 4 points, and the tint fills | Out 90 ms, in 180 ms ease-out, fill 240 ms; slots staggered 40 ms in reading order | Instant swap                                                      |
| The big reply     | The six slots cross-fade into the one card, in the same frame                                     | 200 ms ease-out                                                                    | Instant                                                           |
| Listening starts  | The board glow fades in, the capsule turns orange, and the caption's edge turns orange            | 400 ms                                                                             | Instant, glow static                                              |
| The light         | A ring grows from the light and fades                                                             | 1.6 s loop, scale 1 to 1.8, opacity 0.6 to 0                                       | Static light, no ring                                             |
| The meter         | Five bars follow the input level                                                                  | 15 Hz, spring (damping 18, stiffness 220)                                          | Bars hidden; "They're saying" stays                               |
| Words arrive      | Each new word fades in, and the newest sits on a `listen-soft` highlight that fades               | 120 ms a word; highlight 600 ms                                                    | No fade; the highlight stays on the last word until the line ends |
| Speaking          | The slot's waveform symbol animates, and Repeat cross-fades to Stop                               | SF Symbol `variableColor.iterative`; 150 ms                                        | Static symbol                                                     |
| Sheets and alerts | System                                                                                            | System                                                                             | System                                                            |

- **Nothing else moves.** No entrances, springs, parallax, shimmer, skeletons,
  or loops beyond the light's ring; the grid never animates; and a press
  changes the fill, never the size, so the target stays where the finger is
  ([motionsites notes][ms-app]).
- **Fades, not slides.** A new phrase appears in its slot's frame, which never
  moves or scales; only its words rise 4 points as they fade in, so the target
  stays where a finger, a pointer, or a gaze left it
  ([Turn's iOS design notes][ios-put]).
- **The light's ring runs only while words arrive,** and for no more than five
  seconds a line, so it stays inside WCAG 2.2.2's five seconds; a light that
  pulses all session is the ambient loop that criterion asks to pause
  ([motionsites notes][ms-motion]).
- **Optional.** Where the voice path reports word ranges, the speaking slot
  highlights the word being spoken, as Speechify and Apple Music's lyrics do;
  and a selection haptic may mark speech starting, though no state may depend
  on one, since iOS suppresses haptics while the microphone records.
- **One flag.** Every animation follows the Reduce Motion flag of the TRD's
  [accessibility settings store][trd-a11y], not Reanimated's own, since
  `useReducedMotion()` reports only the setting at launch and CSS animations
  ignore it ([trends notes][ft-reanimated]).

[ft-proposals]: /docs/research/0027-turn-frontend-trends.md#modes-motion-and-accessibility-in-open-proposals
[ios-put]: /docs/research/0029-turn-ios-design.md#motion-when-buttons-stay-put
[ms-motion]: /docs/research/0026-turn-motionsites.md#motion-222-and-233
[ft-reanimated]: /docs/research/0027-turn-frontend-trends.md#reanimated-and-moti

## Sound and haptics

- **Speech is the only sound.** No clicks, chimes, or earcons: the partner
  would hear them, and they'd compete with the words Turn speaks.
- **One optional haptic, carrying no meaning.** A recording app plays no
  haptics unless it opts in, since `allowHapticsAndSystemSoundsDuringRecording`
  defaults to false, and a vibration could disrupt the microphone during
  Listen mode; a phrase's feedback is its pressed fill and its speech. So the
  only haptic is optional, a selection tap from expo-haptics when speech
  starts, and no state depends on it ([Turn's iOS design notes][ios-haptics]).
- **Volume and route.** Speech follows the phone's volume and plays from the
  loudspeaker in Listen mode, as VOICE-4 and the
  [TRD's audio session](/docs/TRD.md#the-audio-session) set.

[ios-haptics]: /docs/research/0029-turn-ios-design.md#haptics-while-turn-listens-or-speaks

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

- A title in `title`, then short paragraphs in `body` that say what leaves
  the phone with each partner line (ROW-2), that names Turn recognizes are
  swapped for tags, to whom it goes, that audio and the rest of the bank never
  leave, and that the service may keep data to monitor its service.
- A link to the privacy notice, which reads with no network (SET-2).
- "Allow" and "Not now" as an equal pair at the bottom.
- Every word is text, never an image, so Accessibility Reader and VoiceOver
  read it ([Turn's iOS design notes][ios-reader]).

[ios-reader]: /docs/research/0029-turn-ios-design.md#accessibility-features-in-ios-26-and-27

### The consent card

`/consent`, full screen on the board, laid out to be read at arm's length
from across a table or beside a mounted phone (CONSENT-4)
([AAC design notes][aac-mounted]):

- **The lead**, one sentence in the partner's terms, in
  `partner-card-title`.
- **The facts** CONSENT-4 lists, one to a line, in `partner-line-small`: what
  the phone does with their words, where the words go and why, that no audio is
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
- **One decision.** The card asks one question, and besides its two answers
  it holds only the under-18 switch and Read aloud, so the partner can answer
  at a glance ([AAC design notes][aac-consent]).

[aac-mounted]: /docs/research/0028-aac-design.md#mounted-phones-and-wheelchairs
[aac-consent]: /docs/research/0028-aac-design.md#consent-notices-people-read

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

### Stats on this phone

`/settings/stats`, a native stack screen titled "Stats on this phone", holds
the counts METRIC-3 names, so the team can read the north star in rehearsals:
replies from the row, out of all the replies (SET-4).

- **One group of five rows,** in Settings' row style, each a label with its
  value in `ink-secondary`, on the right or, from AX1, under the label:
  "Partner lines", "Replies from the row", "Replies from the grid or
  keyboard", "Time to the row", and "Time to speech".
- **Values.** Counts are whole numbers. The two times are medians in seconds
  with one decimal, as "1.4 s", and read "None yet" before the first one.
- **What counts.** A partner line counts when it ends, spoken or typed.
  Replies count in Listen mode only: from the row, a slot or the big button;
  from the grid or keyboard, a grid phrase, a phrase the composer matched, or
  the composer's Speak. The strip and Repeat count as neither, since the
  strip's phrases steer the talk rather than answer it, and Repeat says a
  counted reply again.
- **What a time measures.** From the end of the line a reply answers: the
  line the row answers, for a reply from the row, and the newest line
  otherwise. Times over a minute are left out, and each median covers the
  last 200.
- **The note,** under the group in `footnote` and `ink-secondary`, as
  Settings' notes are: "These counts stay on this phone."
- **Reset.** A second group with one action row, "Reset stats", in `ink`, as
  Settings' other actions are. It asks first, in a system alert with a
  destructive button, then shows zeroes and "None yet". Erase all data resets
  them too.

### The phrase bank editor

`/bank/[category]`, a native stack screen for one category (BANK-2):

- **Rows.** Each phrase in `body`, wrapped, with its places under it in
  `footnote`; a starter phrase nobody has reviewed shows "Starter"
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
  Motion ([Turn's iOS design notes][ios-paywall-a11y]).
- **Colors and type.** The tokens' light and dark values, each pair at 4.5 to
  1 or more without Increase Contrast, since paywalls have no
  increased-contrast values ([Turn's iOS design notes][ios-paywall-limits]); the
  system font, since Apple's license bars uploading SF Pro; and sizes that
  follow Dynamic Type, which paywalls do unless the dashboard turns it off
  ([Turn's iOS design notes on paywall accessibility][ios-paywall-a11y]).
- **Test Store's alert.** Test Store's purchase alert is UIKit's own, so
  there's nothing to design, and the video names it as a test purchase
  ([Turn's iOS design notes][ios-test-store]).

[ios-paywall-a11y]: /docs/research/0029-turn-ios-design.md#dynamic-type-voiceover-and-reduce-motion-in-paywalls
[ios-paywall-limits]: /docs/research/0029-turn-ios-design.md#limits-on-matching-turns-design
[ios-test-store]: /docs/research/0029-turn-ios-design.md#the-paywall-under-test-store

### Launch

The launch screen is the `board` color in each appearance, with no image,
since Apple says to "Avoid using a launch screen as a branding opportunity"
([Turn's iOS design notes][ios-launch]); the grid follows within two seconds.

[ios-launch]: /docs/research/0029-turn-ios-design.md#the-launch-screen-in-expo-sdk-57

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

[aac-tone]: /docs/research/0028-aac-design.md#identity-and-tone

### Strings the PRD leaves open

The PRD fixes the strip's phrases, the Quick category's, "Listening", "Allow",
"Not now", "They agreed", "They said no", "My partner is under 18", "What did
they say?", and the names of buttons and settings; these are the rest.

| Where                           | Words                                                                                                                                                                  | For                           |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| The Listen control              | "Listen", and "20 free" counting down; "Unlock" once none are left                                                                                                     | PAY-1, PAY-2                  |
| Paused, and its End             | "Paused" and "End"                                                                                                                                                     | CONSENT-5                     |
| Under 18                        | "Mic off"                                                                                                                                                              | CONSENT-6                     |
| The caption, out of Listen mode | "Listen mode is off."                                                                                                                                                  | LISTEN-1                      |
| The caption, while hearing      | "They're saying"                                                                                                                                                       | LISTEN-1                      |
| The caption, after a line       | "They said"                                                                                                                                                            | LISTEN-1                      |
| The caption, when the row holds | "Still answering “How was physio?”"                                                                                                                                    | ROW-3                         |
| Notes                           | "Ranked on this phone"; "Listen mode is degraded"; "Listen mode is off for this partner"                                                                               | STATE-1 to STATE-3, CONSENT-6 |
| No live transcription           | "Live transcription isn't available here. Tap here to type what they say."                                                                                             | LISTEN-9                      |
| The speech model                | "Getting Apple's English speech model", with its progress                                                                                                              | LISTEN-1                      |
| The empty row                   | "Replies to your partner appear here."                                                                                                                                 | ROW-1                         |
| The empty row, under 18         | "Listen mode is off for this partner."                                                                                                                                 | CONSENT-6                     |
| A changed row, to VoiceOver     | "3 replies", or "1 reply"                                                                                                                                              | A11Y-2                        |
| The composer                    | "Type what to say", "Speak", and "Replying to “How was physio?”"                                                                                                       | SPEAK-3                       |
| The partner's composer          | "Send"                                                                                                                                                                 | LISTEN-4                      |
| The tabs and the bottom bar     | "All"; "Type", "Repeat", "Stop", "Up", and "Down"                                                                                                                      | ROW-9, SPEAK-1                |
| The permission step             | Its title, "Before Listen mode starts", and its body, below                                                                                                            | CONSENT-1                     |
| The consent card                | Its lead and facts, below, and "Read aloud"                                                                                                                            | CONSENT-4                     |
| The paywall                     | "Keep Listen mode on", "Turn Listen is one payment. Speaking stays free.", and "Unlock Listen mode"                                                                    | PAY-2                         |
| After a purchase                | "Listen mode is unlocked."                                                                                                                                             | PAY-4                         |
| A purchase that fails           | "The purchase didn't go through. Listen mode is still locked."                                                                                                         | PAY-5                         |
| Restore, with nothing to find   | "No purchase found for this phone. Listen mode is still locked."                                                                                                       | PAY-6                         |
| Restore, when it can't check    | "Turn couldn't check for a purchase. Listen mode hasn't changed."                                                                                                      | PAY-6                         |
| Personal Voice refused          | "Turn can't use your Personal Voice. In iOS Settings, allow apps to request to use it, then try again."                                                                | VOICE-2                       |
| Personal Voice unavailable      | "There's no Personal Voice Turn can use on this iPhone. If you've made one, allow apps to request to use it in iOS Settings; until then, Turn keeps the system voice." | VOICE-2                       |
| Erase all data                  | "Erase all data?", its message, below, "Erase", and "Cancel"                                                                                                           | SET-3                         |
| Stats on this phone             | "Partner lines", "Replies from the row", "Replies from the grid or keyboard", "Time to the row", "Time to speech", and "None yet"                                      | SET-4, METRIC-3               |
| Stats' note and Reset           | "These counts stay on this phone." and "Reset stats"; its alert, "Reset stats?", "This sets the counts back to zero.", "Reset", and "Cancel"                           | SET-4                         |
| Speech rate                     | "Slowest", "Slower", "Normal", "Faster", and "Fastest"                                                                                                                 | VOICE-3                       |
| Listen mode's permission        | "Allowed on" and its date, with "Withdraw"; or "Not allowed", with "Allow"                                                                                             | CONSENT-1, CONSENT-3          |
| After Withdraw                  | "Listen mode is off, and nothing more leaves this phone until you allow it again."                                                                                     | CONSENT-3                     |
| The relay's status              | "Listen service: working", "Listen service: can't be reached", or "Listen service: off for now"                                                                        | SET-1, STATE-3                |
| Deleting a category             | "Where should its phrases go?"                                                                                                                                         | BANK-2                        |
| Undo                            | "Deleted." and "Undo"                                                                                                                                                  | BANK-9                        |
| The starter card                | "The Turn team wrote these starter phrases. Review them to make them yours.", "Review", and "Not now"                                                                  | BANK-10                       |
| A starter phrase                | "Starter"                                                                                                                                                              | BANK-10                       |

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
- **iOS's microphone alert,** `NSMicrophoneUsageDescription`, worded for both
  people as the TRD's build configuration asks: "Turn listens only in Listen
  mode, after your partner agrees, to turn their words into text on this
  iPhone so you can answer in your own phrases. No audio is kept."
- **iOS's speech recognition alert,** `NSSpeechRecognitionUsageDescription`,
  for the fallback recognizer: "Turn uses speech recognition only in Listen
  mode, after your partner agrees, to turn their words into text when this
  iPhone can't do it by itself." (LISTEN-9)
- **What a slot fits.** At the default size a slot shows about 28 characters
  before its text steps down, and a phrase that puts its key words first
  still reads when the row cuts it; CONTENT-1 sets the starter phrases'
  length.

## Accessibility

How the design meets each accessibility requirement; the TRD's
[accessibility in the app][trd-a11y] says how it's built.

- **A11Y-1, targets.** Phrase buttons 78 points tall, or 64 on short
  screens, the strip's cells 48, and every other control 44 by 44; the big
  button fills the row ([Layout](#layout)).
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
([Turn's iOS design notes][ios-labels]):

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

[ios-labels]: /docs/research/0029-turn-ios-design.md#accessibility-nutrition-labels-for-turn
[aac-touch]: /docs/research/0028-aac-design.md#touch-settings-in-ios-27

## App icon and pitch assets

### The app icon

- **The mark.** An open speech bubble drawn as one thick stroke whose tail
  curls back like a turn arrow, in white on a marker-blue field: a turn to
  speak, in the app's own ink. No text, no SF Symbol, and no face.
- **The file.** One Icon Composer `.icon` file in two vector layers, the field
  and the mark, set as `ios.icon`, which Expo takes from SDK 54
  ([Turn's iOS design notes][ios-icon]).
- **Appearances.** Default; dark, where the field deepens to a near-black blue
  and the mark stays white; and mono, from the mark layer, for the clear and
  tinted looks.
- **Shipaton's icon.** Icon Composer's flattened 1024 by 1024 export.

[ios-icon]: /docs/research/0029-turn-ios-design.md#icon-appearances-and-icon-composer-2

### Screenshots and Devpost images

- **The required screenshot.** 1179 by 2556 pixels without a device frame,
  which an iPhone 16 simulator on iOS 27 draws at native size, captured in
  Device Hub with the status bar set to 9:41 by `simctl`. It shows the row
  mid-answer: the caption with "How was physio?" and "It was hard" among the
  replies ([Turn's iOS design notes][ios-devpost]).
- **The thumbnail.** 3:2, typographic: Turn's line, "Your own words, in time
  for your turn.", in Atkinson Hyperlegible Next, and one big reply button in
  marker blue, legible at the 333 by 222 pixels the gallery shows it. A
  screenshot would crop to a sliver ([motionsites notes][ms-devpost]).
- **Gallery images.** 3:2 composites of two or three screens side by side on
  the board's color, each with a one-line caption in Atkinson Hyperlegible
  Next, since Devpost shows a portrait screenshot alone at 264 by 573 pixels
  ([motionsites notes][ms-devpost]).

[ios-devpost]: /docs/research/0029-turn-ios-design.md#devpost-images
[ms-devpost]: /docs/research/0026-turn-motionsites.md#devpost-gallery-images-and-thumbnail

### The README's images

- **The hero.** One image in light and dark versions through GitHub's
  `<picture>` element and `prefers-color-scheme`, with alt text; the logline
  and the evaluation's table stay text, not pixels
  ([motionsites notes][ms-readme]).
- **The "aha".** A short GIF of the scenario the idea's
  [pitch](/docs/IDEA.md#pitch) opens with, whose first frame tells the story,
  since GitHub pauses GIFs for people who reduce motion
  ([motionsites notes][ms-readme]).

[ms-readme]: /docs/research/0026-turn-motionsites.md#the-readme-on-github

### The video

- **Frame.** 16:9, with the portrait screen inside it, under two minutes
  (SUBMIT-4) ([Turn's iOS design notes][ios-youtube]).
- **Title cards.** Two short lines in Atkinson Hyperlegible Next, one word in
  marker blue, on the board's color; each fades in once and rests
  ([motionsites notes][ms-video]).
- **Text size.** On-screen text at least 54 pixels tall at 1080p, a decision
  that keeps it near 18 pixels in Devpost's player, which shows the video at
  about a third of that size ([motionsites notes][ms-video]).
- **Captions.** A caption file written from the script that names "Partner"
  and "Turn", since automatic captions can garble synthetic speech, and the key
  exchange burned in on a plate of at least 54% black
  ([motionsites notes][ms-video]; [Turn's iOS design notes][ios-youtube]).
- **Filming.** Listen mode on the demo iPhone itself, since Device Hub blocks
  a mirrored iPhone's microphone; Simulator scenes on an iPhone 16 simulator
  ([Turn's iOS design notes][ios-capture]).
- **Sound.** Turn's speech and the partner's voice, with no music under them;
  Jev and TypeSafe go unnamed until TypeSafe agrees (SUBMIT-6).

[ios-youtube]: /docs/research/0029-turn-ios-design.md#youtube-thumbnails-and-captions
[ms-video]: /docs/research/0026-turn-motionsites.md#the-demo-video
[ios-capture]: /docs/research/0029-turn-ios-design.md#simulator-screenshots-and-recordings-in-xcode-27

## Do's and don'ts

- Do take every color from a token and every size from this document.
- Do keep the strip, the row's slots, and the grid still; change only words.
- Do give every color that means something a word or a shape too.
- Do let text wrap at every size, and cut a phrase only in the row.
- Don't put glass behind words, or a gradient, image, or video behind them
  either; the toolbar and the system's chrome may be glass, and the listening
  glow may wash the board.
- Don't give a card a flat look: cards sit on the board with their two-layer
  shadow and their inked edge, and decoration is not depth.
- Don't shrink a button on press; change its fill.
- Don't animate anything that isn't in the [Motion](#motion) table.
- Don't mark a reply as AI, show a percentage, or dim an older phrase.
- Don't add sounds, or let a haptic carry meaning; speech is the feedback.
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
  contrast failure is only a warning ([trends notes][ft-linter]). This file
  allows two warning classes: `missing-primary`, which the linter raises
  because it looks for a single `primary` value and Turn's colors hold four;
  and `orphaned-tokens`, 68 of them: the eight category colors this file lists
  but cannot reference, since a component takes one color pair and the nine
  categories are nine pairs, so `phrase-tinted` and `category-edge-out` name
  the last as the sample and the other eight follow it; and `accent-tag`'s four
  values, a fill no component can name, as [Color roles](#color-roles) says.
  `bunx @google/design.md@0.4.0 spec` prints the format; pin the version, since
  the format is alpha.
- **Generators.** Use AI generators for sketches only; their output starts
  over from these tokens and rules ([trends notes][ft-generators]).
- **Pointing agents here.** Once `app/` exists, a rule scoped to its screen
  files can point agents to this file, rather than an import that loads it
  into every session ([trends notes][ft-agents]).

[ft-linter]: /docs/research/0027-turn-frontend-trends.md#what-the-linter-checks
[ft-generators]: /docs/research/0027-turn-frontend-trends.md#generators-that-emit-expo-or-native-code
[ft-agents]: /docs/research/0027-turn-frontend-trends.md#where-agents-meet-the-file

### Keeping code in step

- **Where the code lives.** The TRD's [accessibility in the app][trd-a11y]
  builds this file's tokens into `app/src/constants/theme.ts`, tests the
  theme against the yaml and the [contrast table](#contrast), and keeps the
  store of accessibility settings that motion, weight, and layout read.
- **Direction.** A change starts here, then reaches the theme, never the other
  way.

### Checks before a screen ships

- **Where.** An iPhone on iOS 26, and an iPhone 16 simulator on iOS 27 resized
  in Device Hub to 320, 375, 402, and 440 points wide.
- **Settings.** Everything in [the test plan](#the-test-plan).
- **Real words.** The longest starter phrase in a slot and in the grid, a
  300-character partner line in the caption, and the strip at AX5.
- **Colors.** After any color change, `check_contrast.py`, from the
  [design plan's appendix][plan-checks], still prints `OK`.

[plan-checks]: /docs/plans/0008-turn-design.md#appendix-check-scripts

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
  the width rules above ([Turn's iOS design notes][ios-resize]).

[aac-partner]: /docs/research/0028-aac-design.md#displays-that-face-the-partner
[aac-guards]: /docs/research/0028-aac-design.md#guards-against-accidental-activation

## See also

- [Product](/docs/PRODUCT.md): who Turn is for, and the principles this
  design turns into rules.
- [Product requirements](/docs/PRD.md): the requirements each rule and
  component cites.
- [Technical requirements](/docs/TRD.md): how the app draws and moves what
  this document describes.
- [Idea](/docs/IDEA.md): the pitch, the schedule, and the risks.
- The research behind these choices:
  [motionsites.ai for Turn](/docs/research/0026-turn-motionsites.md),
  [frontend trends](/docs/research/0027-turn-frontend-trends.md),
  [AAC interface design](/docs/research/0028-aac-design.md),
  [Turn's iOS design](/docs/research/0029-turn-ios-design.md), and
  [AAC practice](/docs/research/0022-aac-practice.md).
- [Google's DESIGN.md format][gdm]: the specification and the linter.
- [Guessling design](/docs/archive/guessling-design.md): the design for the
  team's first idea, archived.

[gdm]: https://github.com/google-labs-code/design.md
[product-principles]: /docs/PRODUCT.md#product-principles
[ft-tokens]: /docs/research/0027-turn-frontend-trends.md#what-goes-in-tokens-and-what-in-prose
[aac-stigma]: /docs/research/0028-aac-design.md#social-acceptability-and-stigma
[ft-calm]: /docs/research/0027-turn-frontend-trends.md#calm-technology
[aac-targets]: /docs/research/0028-aac-design.md#target-size-and-spacing-for-tremor-and-weakness
[ios-glass-content]: /docs/research/0029-turn-ios-design.md#content-and-controls-on-glass
[ft-nobans]: /docs/research/0027-turn-frontend-trends.md#bans-that-dont-suit-an-aac-app
[ios-light]: /docs/research/0029-turn-ios-design.md#a-pulsing-listening-light
[ios-resize]: /docs/research/0029-turn-ios-design.md#resizable-iphone-apps-and-iphone-duo
[ms-app]: /docs/research/0026-turn-motionsites.md#the-native-iphone-app
[trd-a11y]: /docs/TRD.md#accessibility-in-the-app
[aac-confidence]: /docs/research/0028-aac-design.md#whether-to-show-confidence
[aac-grid]: /docs/research/0028-aac-design.md#grid-size-scrolling-and-navigation

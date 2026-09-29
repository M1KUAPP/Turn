# Turn v2 redesign handoff plan

> **For kymil4, and any agent helping:** rebuild Turn's screens from the v2 Figma file. Build in the order under [Build order](#build-order). The features, strings the PRD fixes, and Maestro-visible labels don't change; the look, layout details, and motion do.

**Goal:** Every existing screen gets the v2 "Warm Voice" look and the UX fixes below, with the same features, before the Devpost entry (#69, due Wed Sep 30, 11:45 PM PT). The team lead judged v1 "too plain"; v2 gives Turn a warm, premium identity without breaking any accessibility rule.

**Figma:** Build from the locked design: [v2 · Screens][locked-screens] (62 frames) and [v2 · System][locked-system] (the component library), both view-only to anyone with the link. The [v2 source file][v2-file] holds 🎨 Foundations, 📝 Handoff, and the tokens in four modes. One amendment since the lock: the toolbar, every item on its own solid pill, and the grid ending 8 points above it ([Size, shape, and depth](#size-shape-and-depth)). The 🧪 Companion page is an experiment outside the build order.

**Tech stack:** Expo SDK 57, React Native 0.86, react-native-reanimated 4.5, expo-symbols, react-native-purchases-ui. Two optional native additions: expo-glass-effect and expo-haptics.

**Spec:** [Design](/docs/DESIGN.md) (its rules still hold; this plan replaces its colors, type, shapes, depth, and motion); [research note](/docs/research/0051-turn-redesign.md) for the sources.

[v2-file]: https://www.figma.com/design/VNzApYUFQ7VZxSZ0Lnz5dv
[locked-screens]: https://www.figma.com/design/9KvXsgbqCOro2VHGpfk9mR?node-id=27-4
[locked-system]: https://www.figma.com/design/9KvXsgbqCOro2VHGpfk9mR?node-id=27-5

Contents:

1.  [Decisions](#decisions)
1.  [The direction](#the-direction)
1.  [What changes from v1](#what-changes-from-v1)
1.  [Color tokens](#color-tokens)
1.  [Type](#type)
1.  [Size, shape, and depth](#size-shape-and-depth)
1.  [Components](#components)
1.  [Screens](#screens)
1.  [Motion](#motion)
1.  [Icons](#icons)
1.  [New and changed strings](#new-and-changed-strings)
1.  [Build order](#build-order)
1.  [Checks](#checks)
1.  [Open questions](#open-questions)

## Decisions

- **Same features, full UI and UX.** The user chose this on Sep 29: new visual identity, layouts, and motion on every existing screen, no new features.
- **The hard rules stay.** Phrase buttons 78 points (64 on short screens), strip 48, controls 44; phrase text 7:1, other text 4.5:1, button edges 3:1, in all four appearances; Dynamic Type to AX5; only a tap speaks; nothing moves under a finger; a word or shape for every state; no AI badges. [Checks](#checks) has the evidence.
- **The whiteboard goes.** v1's reference, "a whiteboard and four markers", banned decoration, gradients, and motion. v2 keeps its discipline (color has jobs) and drops its austerity.
- **System fonts, no bundled fonts.** `ui-rounded` (SF Pro Rounded), `ui-serif` (New York), and `system-ui` (SF Pro). Figma can't render Apple's fonts through its plugin runtime, so the file shows Nunito, Newsreader, and Inter in their place; metrics differ slightly, so trust the app's wrapping.
- **The v2 file lives in AlaskanTuna's team.** The team file sits on Figma's Starter plan, whose MCP cap (20 calls a month) ran out on Sep 29, and whose one-mode variables can't hold Light and Dark. The v2 file has real Light, Dark, Light HC, and Dark HC modes, so every frame and swatch flips.
- **The paywall stays RevenueCat's.** Rebuild frame 25 in the Paywalls editor from its parts; a custom in-app paywall is out of scope.

## The direction

**Warm Voice.** The reference: a warm table, your own cards on it, and a lamp that shows when the phone is listening.

1.  **Color means something.** Each category owns a hue, worn as an inked edge on the grid and the shortlist and as a fill on a live reply. Green, red, and gray belong to Yes, No, and Not sure; ultramarine to Turn's own actions and its one confident reply; orange to listening, and nothing else.
1.  **Two voices, two typefaces.** The partner's words, and words addressed to the partner (the consent card), are set in the serif. Everything the user says or taps is rounded bold.
1.  **Depth you can press.** Cards sit on the board with soft two-layer shadows and 1.5-point inked edges. A press darkens the fill and thickens the edge; the card never moves or scales.
1.  **The lamp.** Listening lights the Listen control orange, gives the caption an orange edge and glow, and washes the top of the board with a warm radial glow. Paused and off states drop it.
1.  **Glass for chrome, solid for words.** The floating bottom toolbar is glass; phrases, the caption, notes, and the consent card sit on solid fills.

Explorations: three concepts (Warm Voice, Night Studio, Bold Blocks) are on the 🧭 page. v2 is Warm Voice, with Night Studio's premium dark mode and Bold Blocks' big Yes and No symbols.

## What changes from v1

| Area         | v1                                   | v2                                                                        |
| ------------ | ------------------------------------ | ------------------------------------------------------------------------- |
| Board        | Cool gray `#F2F2F7`, black in dark   | Warm paper `#F4EFE7`, warm charcoal `#15120F` in dark                     |
| Phrases      | White, gray edge, SF Pro semibold 20 | Category-edged cards, SF Pro Rounded bold 22; live replies tinted         |
| Caption      | Plain box, title3                    | Serif partner line 28, "They're saying" with a live meter, orange lamp    |
| Listen       | Orange capsule                       | Capsule with icon and free-line pill; Listening glows; Paused plus End    |
| Big reply    | Flat blue box                        | Ultramarine card with sheen, category tag, speaker mark                   |
| Yes, No      | Tinted boxes                         | Tinted cards with a symbol disc (check, cross, question), 2.5-point edge  |
| Strip        | Gray outlined cells                  | Small rounded chips; "Something's wrong" in the No tint                   |
| Tabs         | Text chips                           | Chips with the category's dot; selected is filled ink; "All" pinned       |
| Bottom bar   | Four outlined buttons                | Floating glass toolbar with icons; Type is the accent pill; Stop is ink   |
| Top bar      | Text buttons                         | Round Settings, place chip with symbol and chevron                        |
| Consent card | Plain sheet                          | Partner-facing card: serif question, four facts with symbols, orange edge |
| Paywall      | Title, card, button                  | Product scene, three plain promises, package card, calm legal row         |
| Settings     | System list                          | Inset groups with colored symbol tiles, stats as cards                    |

## Color tokens

Every token keeps v1's four-appearance pattern, `DynamicColorIOS` in `app/src/constants/theme.ts`. Keep the code's token names and change their values; Figma's `ink-2` is the code's `ink-secondary`. Add the new ones: `surface-sunken`, `hairline`, `accent-soft`, `accent-tag`, `listen-soft`, and `listen-glow`.

| Token             | Light         | Dark          | Light HC      | Dark HC       |
| ----------------- | ------------- | ------------- | ------------- | ------------- |
| `board`           | `#F4EFE7`     | `#15120F`     | `#F4EFE7`     | `#0E0C0A`     |
| `surface`         | `#FFFCF7`     | `#221E19`     | `#FFFFFF`     | `#1C1915`     |
| `surface-sunken`  | `#EAE3D8`     | `#0F0D0B`     | `#E4DCCF`     | `#070605`     |
| `surface-pressed` | `#E6DDCF`     | `#322C25`     | `#DCD2C2`     | `#3A332B`     |
| `ink`             | `#1E1A15`     | `#F6F1E9`     | `#000000`     | `#FFFFFF`     |
| `ink-2`           | `#5B5347`     | `#B9AFA1`     | `#3D372F`     | `#DDD5C9`     |
| `edge`            | `#8A8072`     | `#8C8274`     | `#4A433A`     | `#CFC6B8`     |
| `hairline`        | `#DDD4C6`     | `#3A342C`     | `#B9AE9E`     | `#5C544A`     |
| `accent`          | `#2438C9`     | `#8FA0FF`     | `#1A2BA6`     | `#B7C2FF`     |
| `accent-pressed`  | `#1A2BA6`     | `#A9B6FF`     | `#121F85`     | `#D2D9FF`     |
| `on-accent`       | `#FFFFFF`     | `#0B1033`     | `#FFFFFF`     | `#000000`     |
| `accent-soft`     | `#E4E8FC`     | `#1D2244`     | `#D6DCFA`     | `#141836`     |
| `accent-tag`      | `#FFFFFF` 18% | `#0B1033` 16% | `#FFFFFF` 22% | `#000000` 20% |
| `listen`          | `#B84300`     | `#FF9A4D`     | `#963600`     | `#FFB47A`     |
| `on-listen`       | `#FFFFFF`     | `#1E0C00`     | `#FFFFFF`     | `#000000`     |
| `listen-soft`     | `#FCE6D6`     | `#3A1F0C`     | `#F8D9C2`     | `#2C1606`     |
| `listen-glow`     | `#FF8A3D`     | `#FF7A1F`     | `#FF8A3D`     | `#FF7A1F`     |
| `yes-fill`        | `#DCF1E1`     | `#11291A`     | `#CDEBD5`     | `#0A2012`     |
| `yes-edge`        | `#1D7A3C`     | `#58C77D`     | `#125A2B`     | `#8BE0A6`     |
| `no-fill`         | `#FBE0DB`     | `#361512`     | `#F7D1CA`     | `#2A0E0B`     |
| `no-edge`         | `#B3261E`     | `#FF7B6E`     | `#8C1D17`     | `#FFA69C`     |
| `unsure-fill`     | `#ECE6DD`     | `#2A2621`     | `#E0D8CC`     | `#221E1A`     |
| `unsure-edge`     | `#6B6357`     | `#A39A8C`     | `#4A433A`     | `#D0C8BB`     |

Category colors are new: two tokens per category, `category-<id>-fill` and `category-<id>-edge`, each with the four appearances, keyed by the starter bank's category IDs (`app/src/content/starter-bank.json`); a `categoryColors` map from ID to its pair keeps lookups simple. A category the user adds takes the next hue after `out`, cycling from `chat`. The conversation strip uses `surface` and `edge`, except "Something's wrong", which uses `no-fill` and `no-edge`.

| Category                      | Symbol                              | Fill (L / D)          | Edge (L / D)          | Fill HC (L / D)       | Edge HC (L / D)       |
| ----------------------------- | ----------------------------------- | --------------------- | --------------------- | --------------------- | --------------------- |
| Quick (`quick`)               | `bolt.fill`                         | `#FFFCF7` / `#221E19` | `#8A8072` / `#8C8274` | `#FFFFFF` / `#1C1915` | `#4A433A` / `#CFC6B8` |
| Chat (`chat`)                 | `bubble.left.and.bubble.right.fill` | `#DCEBFA` / `#16263A` | `#2B64B0` / `#6FA3E6` | `#CFE2F8` / `#0E1B2B` | `#1B4C8C` / `#A6C8F2` |
| Care and help (`care`)        | `hand.raised.fill`                  | `#D6F0E2` / `#12291E` | `#1E7650` / `#5CC08E` | `#C7EAD6` / `#0B2016` | `#135A3C` / `#93DCB6` |
| Body and pain (`body-pain`)   | `figure.stand`                      | `#FBDDE0` / `#33171C` | `#B02E48` / `#EE7A8F` | `#F7CDD2` / `#270F13` | `#8A1F36` / `#F6A7B5` |
| Food and drink (`food`)       | `fork.knife`                        | `#FAEBC2` / `#2E2510` | `#8A6500` / `#D9AE3B` | `#F6E2AA` / `#221B08` | `#6A4D00` / `#EACB77` |
| Feelings (`feelings`)         | `heart.fill`                        | `#FFE2D0` / `#35200F` | `#B4531C` / `#F08C4E` | `#FDD5BD` / `#29170A` | `#8C3E10` / `#F7B389` |
| Family and friends (`family`) | `person.2.fill`                     | `#E8E0FB` / `#241C3A` | `#6444C4` / `#A78BF2` | `#DDD2F8` / `#1A132D` | `#4C2FA3` / `#C9B6F8` |
| Health (`health`)             | `cross.case.fill`                   | `#D4EEF0` / `#0F2A2D` | `#15707B` / `#4FC3CF` | `#C3E7EA` / `#0A2023` | `#0C5760` / `#8CDCE3` |
| Out and about (`out`)         | `figure.walk`                       | `#EEF3D2` / `#232A10` | `#5C7412` / `#A8C24A` | `#E4ECBE` / `#1A200A` | `#445709` / `#C7DB85` |

## Type

All styles keep `dynamicTypeRamp` and `boldTextWeight`, as `theme.ts` does today; only the family, weight, and some sizes change.

| Style                | `fontFamily` | Weight | Size / line | Ramp          | Used for                               |
| -------------------- | ------------ | ------ | ----------- | ------------- | -------------------------------------- |
| `phrase-big`         | `ui-rounded` | 800    | 34 / 40     | `largeTitle`  | The big reply                          |
| `phrase-yes-no`      | `ui-rounded` | 800    | 28 / 34     | `title1`      | Yes and No                             |
| `phrase`             | `ui-rounded` | 700    | 22 / 27     | `title2`      | Row slots, grid phrases, Not sure      |
| `phrase-strip`       | `ui-rounded` | 600    | 15 / 19     | `subheadline` | The conversation strip                 |
| `partner-line`       | `ui-serif`   | 500    | 28 / 33     | `title1`      | The caption's words                    |
| `partner-line-small` | `ui-serif`   | 500    | 21 / 26     | `title3`      | Partner words in the composers         |
| `partner-card-title` | `ui-serif`   | 600    | 30 / 36     | `title1`      | The consent card's question            |
| `large-title`        | `ui-rounded` | 800    | 32 / 38     | `largeTitle`  | Screen titles, paywall title           |
| `title`              | `ui-rounded` | 700    | 22 / 28     | `title2`      | Sheet and card titles                  |
| `button`             | `ui-rounded` | 700    | 17 / 22     | `headline`    | Buttons, capsules                      |
| `headline`           | `system-ui`  | 600    | 17 / 22     | `headline`    | Row titles in headers                  |
| `body`               | `system-ui`  | 400    | 17 / 22     | `body`        | Body text, list rows                   |
| `callout`            | `system-ui`  | 500    | 16 / 21     | `callout`     | Paywall promises                       |
| `label`              | `system-ui`  | 600    | 15 / 20     | `subheadline` | Tabs, caption labels, group headers    |
| `footnote`           | `system-ui`  | 400    | 13 / 18     | `footnote`    | Notes, details                         |
| `caption`            | `system-ui`  | 600    | 12 / 16     | `caption1`    | Toolbar labels, "Starter", small pills |

- **Check `ui-rounded` and `ui-serif` on the first build.** React Native maps these generic names to Apple's system designs on iOS; if either falls back to SF Pro, the fix is one line per style.
- **A slot fits less.** Rounded bold 22 is wider than v1's semibold 20, so a slot shows about 24 characters in two lines instead of 28; the slot height rule (two lines plus padding, never under 78) is unchanged.

## Size, shape, and depth

- **Spacing:** 8 between bands, 12 inside the row and the grid, 16 from the screen edge, as v1. The toolbar floats 2 points above the home indicator's 34-point area; the grid ends 8 points above the toolbar, so nothing scrolls under it.
- **Radii:** chip 14, card 20, panel (caption, groups) 24, big reply 28, sheet 34, capsules half their height. Nested shapes stay concentric.
- **Edges:** 1.5 points by default, in the category's edge color on phrase cards and `edge` elsewhere; 2.5 for pressed, speaking, Yes, No, Not sure, the listening caption, and focus.
- **Shadows** (React Native 0.86 `boxShadow` strings):
  - Card, light: `0 1px 2px rgba(30,26,21,.06), 0 6px 16px rgba(30,26,21,.07)`; dark: `0 1px 2px rgba(0,0,0,.45), 0 8px 20px rgba(0,0,0,.35)`.
  - Raised (toolbar, sheets), light: `0 2px 4px rgba(30,26,21,.08), 0 14px 32px rgba(30,26,21,.12)`; dark: `0 2px 4px rgba(0,0,0,.5), 0 14px 32px rgba(0,0,0,.45)`.
  - Listening glow: `0 0 18px 2px rgba(255,138,61,.55)`.
  - Big reply: `0 10px 28px rgba(36,56,201,.35)`, light only.
  - Avoid the `filter` prop's drop shadow: it clips children.
- **Glass:** only the floating toolbar, with `GlassView` from expo-glass-effect where `isLiquidGlassAvailable()`, `surface` at 82% plus `BlurView` otherwise, and opaque `surface` when `AccessibilityInfo.isReduceTransparencyEnabled()`. Never fade a `GlassView` with `opacity`. The glass is the capsule only: every item sits on its own solid pill, since Turn can't read the Liquid Glass slider and a label on clear glass could fall under 4.5:1.
- **The listening glow:** a radial gradient, `listen-glow` at 30% (light) to transparent, 560 by 420 points centered near the Listen control, behind everything. Use `experimental_backgroundImage: 'radial-gradient(...)'`, or export the Figma ellipse as a PNG if the radial form isn't supported.

## Components

Each row names the Figma component (🧩 page) and the file that renders it today.

| Figma component     | Variants                                      | Code today                              | Notes                                                                                                                                                                                                                                                                               |
| ------------------- | --------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Phrase card`       | Plain, Tinted, Pressed, Speaking              | `ReplyRow.tsx`, `HomeScreen.tsx` (grid) | Plain: `surface` + category edge. Tinted: category fill, for replies to the current line only. Pressed: `surface-pressed`, 2.5 edge, on touch-down; speak on touch-up. Speaking: `accent-soft`, `accent` 2.5 edge, a waveform symbol pinned bottom-right so the text never reflows. |
| `Yes No Not sure`   | Yes, No, Not sure                             | `ReplyRow.tsx`, grid                    | 40-point disc in the edge color with `checkmark`, `xmark`, `questionmark.circle` in `surface`.                                                                                                                                                                                      |
| `Big reply`         | one                                           | `ReplyRow.tsx`                          | Fills the row's frame. Category tag top-left on `accent-tag`; speaker mark bottom-right at 75%; a white radial sheen and a faint ring are decoration (hide both under Increase Contrast).                                                                                           |
| `Strip chip`        | Default, Urgent                               | `HomeScreen.tsx`                        | 48 minimum, radius 14; Urgent only for "Something's wrong".                                                                                                                                                                                                                         |
| `Caption`           | Off, Hearing, Said, Holding, Degraded, Paused | `HomeScreen.tsx`                        | Serif line. Hearing: `listen` 2.5 edge, glow, a 10-point light and a five-bar meter, label "They're saying" in `listen`. Said: "They said" + Clear (32 tall pill, 44-point hit area). Degraded: a sunken note pill.                                                                 |
| `Listen control`    | Off, Listening, Paused, Unlock, Mic off       | `listen-control.ts`, `listen-light.ts`  | Off shows "20 free" in a `listen-soft` pill; Paused sits beside a separate "End" capsule.                                                                                                                                                                                           |
| `Place chip`        | one                                           | `HomeScreen.tsx`                        | Place symbol + name + `chevron.down`.                                                                                                                                                                                                                                               |
| `Icon button`       | one                                           | `HomeScreen.tsx`                        | 44 round; Settings uses `gearshape.fill`.                                                                                                                                                                                                                                           |
| `Tab`               | Selected, not                                 | `HomeScreen.tsx`                        | 10-point category dot. Selected fills with `ink` and turns the label `surface`. "All" is pinned right, outside the scroll.                                                                                                                                                          |
| `Toolbar`           | Speaking false, true                          | `HomeScreen.tsx`                        | 370 by 64 floating glass capsule; items are 84 by 52 solid pills, symbol above label: Type on `accent`, Repeat, Up, and Down on `surface` with a `hairline` edge, and, while speaking, Stop on `ink`. No label sits on the glass itself.                                            |
| `Button`            | Primary, Secondary, Destructive, Plain        | `SecondaryButton.tsx`, screens          | 56 tall capsules.                                                                                                                                                                                                                                                                   |
| `List row`          | Chevron, Toggle, Value, None                  | `SettingsScreen.tsx` and other lists    | 32-point symbol tile, 56 minimum; rows sit in a `surface` group with a 1.5 `edge` and hairline dividers.                                                                                                                                                                            |
| `Sheet header`      | one                                           | `SheetHeader.tsx`                       | Grabber, rounded title, 44 close. Sheets use `board`, never glass.                                                                                                                                                                                                                  |
| `Segmented control` | one                                           | `VoiceScreen.tsx`                       | Speech rate.                                                                                                                                                                                                                                                                        |
| `Text field`        | one                                           | `TypedComposer.tsx`, sheets             | 56 minimum; the partner's composer sets its text in the serif.                                                                                                                                                                                                                      |
| `Alert`             | one                                           | `Alert.alert`                           | A picture of the system alert's words and roles only.                                                                                                                                                                                                                               |

## Screens

The 📱 page keeps v1's numbers, and every v1 frame has a v2 frame; 06d, 16, 32, and 59 add Dark and Increase Contrast versions of the busiest states.

- **Home (01 to 16, 32, 59, 60):** first launch shows the starter card in the row's frame on `accent-soft`; Listen off keeps the shortlist Plain; replies arrive Tinted; the big reply replaces the six slots; yes-or-no puts the three fixed buttons first; speaking marks the slot and turns Repeat into Stop; degraded and "ranked on this phone" add the note pill to the caption; paused shows Paused and End; under 18 shows Mic off; 60 shows the speech model's progress in the caption's place.
- **Listen entry (17 to 20):** the permission step is a sheet with the service's facts as symbol rows; the consent card is a partner-facing card with an orange edge and a warm glow, "They agreed" in `listen`, "They said no" secondary, and the under-18 switch in a sunken block.
- **Composers (22, 23):** the composer docks above the keyboard on `surface` with a hairline; "Replying to" sets the partner's line in the serif; Speak is `accent`, Send is `ink`.
- **Place menu (24):** a raised `surface` menu under the chip; the current place sits on `accent-soft` with a check.
- **Paywall and purchase (25 to 31):** build 25 in RevenueCat's editor: a product-scene image (export the "Hero · Listen mode in use" frame at 3x), the title, the subtitle, three promise rows (symbol tiles), the package card with a 2.5 `accent` edge, the purchase button, Restore Purchases, and the legal row. Failure and restore notes are calm `surface-sunken` pills, with no alarm color. 28 is Turn's own confirmation after a purchase.
- **Settings and the rest (33 to 58, 61):** inset groups with symbol tiles colored by meaning (accent for voice and purchase, listen for Listen mode, category colors for places and the bank); stats as cards with big numbers; the category editor moves rows with Move up and Move down buttons, never drag.

## Motion

Motion is feedback, never decoration. Every animation below uses Reanimated with `ReduceMotion.System`, and each row says what Reduce Motion shows instead.

| Moment            | What moves                                                                                    | Timing                                                                             | Reduce Motion                                                 |
| ----------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| A press           | Fill to `surface-pressed` or `accent-pressed`, edge to 2.5; nothing translates or scales      | Instant on touch-down; back in 120 ms                                              | Same                                                          |
| Replies arrive    | In each changed slot, the old words fade out, the new fade in rising 4 points, the tint fills | Out 90 ms, in 180 ms ease-out, fill 240 ms; slots staggered 40 ms in reading order | Instant swap                                                  |
| The big reply     | The six slots cross-fade into the one card, same frame                                        | 200 ms ease-out                                                                    | Instant                                                       |
| Listening starts  | Board glow fades in; the capsule turns orange; the caption edge turns orange                  | 400 ms                                                                             | Instant, glow static                                          |
| The light         | A ring grows from the light and fades                                                         | 1.6 s loop, scale 1 to 1.8, opacity 0.6 to 0                                       | Static light, no ring                                         |
| The meter         | Five bars follow the input level                                                              | 15 Hz, spring (damping 18, stiffness 220)                                          | Bars hidden; "They're saying" stays                           |
| Words arrive      | Each new word fades in; the newest sits on a `listen-soft` highlight that fades               | 120 ms per word; highlight 600 ms                                                  | No fade; highlight stays on the last word until the line ends |
| Speaking          | The slot's waveform symbol animates; Repeat cross-fades to Stop                               | SF Symbol `variableColor.iterative`; 150 ms                                        | Static symbol                                                 |
| Sheets and alerts | System                                                                                        | System                                                                             | System                                                        |

Optional, if there's time: highlight the word being spoken in the speaking slot, from `AVSpeechSynthesizer`'s range callbacks (expo-speech's `onBoundary` where it fires), as Speechify and Apple Music's lyrics do.

Haptics, optional (expo-haptics): a selection tap when speech starts. iOS suppresses haptics while the microphone records, so no state may depend on one.

## Icons

Use `SymbolView` from expo-symbols, weight semibold, in the text's color. The Figma components are named `Icon/<SF Symbol>`; the stand-in drawings are Lucide's.

- **Home:** `gearshape.fill`, place symbols (`house.fill`, `stethoscope`, `bag.fill`, `figure.walk`), `chevron.down`, `ear`, `pause.fill`, `lock.fill`, `mic.slash.fill`, `waveform`, `xmark`, `checkmark`, `questionmark.circle`, `speaker.wave.2.fill`, `keyboard`, `arrow.counterclockwise`, `stop.fill`, `chevron.up`, `iphone`, `wifi.slash`, `text.book.closed`.
- **Listen entry and paywall:** `ear`, `person.text.rectangle`, `lock.fill`, `info.circle`, `checkmark.shield.fill`, `iphone`, `arrow.left.arrow.right`, `mic.slash.fill`, `pause.circle.fill`, `speaker.wave.2.fill`, `progress.indicator`, `checkmark`.
- **Settings and lists:** `slider.horizontal.3`, `globe`, `mappin.and.ellipse`, `arrow.counterclockwise`, `doc.text`, `chart.bar.fill`, `trash`, `person.wave.2.fill`, `plus`, `pencil`, `arrow.up.arrow.down`, `arrow.uturn.backward`, `hand.raised`, `person.crop.circle.badge.xmark`, and each category's symbol.

## New and changed strings

Every string the PRD fixes, and every label a Maestro flow taps, is unchanged. These are new, in DESIGN's tone:

- Starter card: "Starter phrases" above the existing text.
- Paywall: "Replies from your own phrases as your partner finishes", "Paid once. No subscription.", "Speaking, typing, and your phrases stay free", and "One payment, yours to keep" under Turn Listen.
- After a purchase: "Turn Listen is yours on this phone. Speaking stays free, as always." under "Listen mode is unlocked.", and "Done".
- Processing: "Unlocking".
- Speech model: "62%, about a minute. Speaking works now." (the percentage and time are live).
- Places: "Pick a place on Home with one tap. Turn never reads your location." Phrase places: "At these places, the row offers this phrase first." New category: "New categories take the next color in the set."
- Consent card: "Turn never listens to someone under 18." under the switch (and "Listen mode stays off for this partner." once it's on).
- Delete alerts: "Your phrases stay in the bank. They just stop being tied to Clinic." and "It leaves your phrase bank and the grid. You can undo right after."

## Build order

Each step is shippable on its own, so stop wherever the clock runs out.

1.  **Tokens** in `theme.ts`: the colors above, the category tokens, and the type table. Most screens change with this step alone. `app/test/theme.test.ts` requires `theme.ts`'s colors, type, and contrast pairs to equal DESIGN.md's, so land the v2 DESIGN.md from branch `docs/design-v2` in the same PR as the new `theme.ts`, not before.
1.  **Home, still:** top bar, caption states, strip, phrase card states, Yes No Not sure, big reply, tabs with dots, and the floating toolbar.
1.  **Home, listening:** the board glow, Listening control, caption edge and meter, and the reply arrival motion.
1.  **Consent card and permission step.**
1.  **Paywall** in RevenueCat's editor (WhiteAvocad0 owns it, #26).
1.  **Settings, voice, places, phrase bank, stats:** list rows with symbol tiles and inset groups.
1.  **Motion polish,** then the optional word highlight and haptics.

## Checks

- **Contrast:** every pair in the tables was computed with WCAG 2.2's relative luminance for all four appearances, truncated to one decimal, with no failures: `ink` on every fill is 12.2:1 or more (13.2:1 on the category fills); the big reply's text is 8.4:1 in light and 7.6:1 in dark; `ink-2` is 5.9:1 or more; `listen` on `listen-soft` is 4.5:1; and every edge is 3.3:1 or more against the board, the surface, and its own fill. DESIGN.md's [contrast tables](/docs/DESIGN.md#contrast) on the `docs/design-v2` branch list every pair.
- **Dynamic Type:** layouts follow v1's rules: one column from AX1, the area between the bars scrolls as one column, and heights follow the text.
- **Maestro:** labels are unchanged, but positions move (the toolbar floats, "All" is pinned, the strip's rows differ). Run the `pr` flows before merging the Home work.
- **Figma evidence:** 🎨 Foundations shows every token in all four modes; frames 16, 32, and 59 show Home in Dark, Light HC, and Dark HC.

## Open questions

1.  **Sharing the v2 file.** The team file is view-only to anyone with the link. Only 🎨 Foundations, 📝 Handoff, and inspecting the tokens in all four modes need view access to the v2 file, which its owner shares.
1.  **The app icon.** v2 concepts are on the 🧭 page; #56's icon stays until the team picks one.
1.  **Word highlight while speaking** depends on range callbacks from the voice path, including Personal Voice.

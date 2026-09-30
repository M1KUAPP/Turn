# Turn v2 build plan

How #166's build order ships: which pull request carries each step, what each one changes, the checks that prove it done, and the decisions made on the way. The spec is [plan 0044](/docs/plans/0044-turn-v2-redesign.md) and the v2 [DESIGN.md](/docs/DESIGN.md); the locked Figma frames are the picture.

Contents:

1.  [Pull requests](#pull-requests)
1.  [Home](#home)
1.  [Other screens](#other-screens)
1.  [Paywall](#paywall)
1.  [Checks](#checks)
1.  [Decisions](#decisions)

## Pull requests

| Pull request               | Build order steps               | Branch                        |
| -------------------------- | ------------------------------- | ----------------------------- |
| #165                       | 1, tokens with DESIGN.md v2     | `docs/design-v2`              |
| #170                       | 5's hero, at 3x                 | `chore/166-paywall-hero`      |
| Home and the other screens | 2, 3, 4, 6, and their motion, 7 | `claude/zealous-gates-5pc5pu` |
| Paywall hand-off, #171     | 5                               | none                          |

Home and the other screens were built on their own branches, `feat/166-v2-home` and `feat/166-v2-screens`, from #165, and touch different files: `ReplyRow.tsx`, `StarterReviewCard.tsx`, the composers, `home-layout.ts`, and the listen control's files belong to Home, and `SheetHeader.tsx`, `SecondaryButton.tsx`, `_layout.tsx`, and every settings, bank, consent, and permission screen belong to the other screens. One pull request merges both, since they conflict only in DESIGN.md's contrast table and each had its own category helper.

## Home

Frames 01 to 16, 06d, 22 to 24, 32, 59, and 60: the top bar with the place menu, the caption's states, the strip, one phrase card for the row and the grid with its Plain, Tinted, Pressed, and Speaking states, Yes, No, and Not sure, the big reply, tabs with category dots and "All" pinned, the floating glass toolbar with solid pills, the composers, and the listening look: board glow, Listening capsule, the caption's orange edge, the light's ring, and the meter. Motion follows plan 0044's table with `ReduceMotion.System`.

## Other screens

Frames 17 to 21 and 33 to 58, 61, and 28: the permission step's symbol rows, the partner-facing consent card, inset groups with symbol tiles for Settings, Voice, Places, the phrase bank, and the category editor, stats as cards, sheet headers with a grabber and a rounded title, and 56-tall capsule buttons.

## Paywall

RevenueCat's Paywalls editor needs a person signed in to RevenueCat's dashboard, so step 5 goes to #171 for the paywall's owner, with frame 25's parts, strings, and colors, and the hero exported from Figma at 3x.

## Checks

- `bun run lint`, `bun run typecheck`, and `bun run test` pass; `theme.test.ts` passes with the v2 DESIGN.md.
- `scripts/simulator-screenshots.sh Turn.app <out> pr` passes every flow at the default size and at AX5.
- Home's screenshots match frames 02 to 16 in light, and 16, 32, and 59 in Dark, Light Increase Contrast, and Dark Increase Contrast.
- The hard rules hold: targets 78, 64, 48, and 44; phrase text 7:1; AX5; only a tap speaks; nothing moves under a finger; Reduce Motion stills every animation.

## Decisions

- **Bold Text weights:** #165's table gave each token its regular weight under Bold Text; each moves one step heavier, as v1's did.
- **`category-out-and-about`:** Out and about's tokens take the starter bank's ID, as the other eight do; plan 0044's table calls it `out`. Screens reach category colors through `categoryColors`, and a category the user adds takes the next hue after Out and about, cycling from Chat.
- **No BlurView:** Turn needs iOS 26 and builds with Xcode 27, where Liquid Glass is always there, so the toolbar uses `GlassView`, or opaque `surface` under Reduce Transparency.
- **Toolbar pill edges:** `edge`, not plan 0044's `hairline`, which falls under rule 2's 3:1 for a button's edge.
- **Floors:** notes and details are `footnote`, 13 points, as the type table and the frames have them.
- **Launch screen:** the board's v2 colors, as DESIGN.md's Launch section asks.
- **Maestro:** labels stay. From AX1 the toolbar splits into rows, as v1's bar did, since seven flows gate on Repeat beside Type; a step that taps something it just scrolled to centers it first, since Maestro counts a row under a bar as on screen.
- **The meter:** the bars follow the recognizer's input level, which the live session publishes up to ten times a second. The native engine and typed Listen measure no level, so their bars lie flat.
- **Frame 28:** "Listen mode is unlocked." stays the note Settings shows, with plan 0044's new line under it; a blocking confirmation would stop PAY-4's purchase from going on into Listen mode.
- **Frames 02 and 11:** the row stays empty with its note while Listen mode is off, since there's no shortlist then; Paused clears the partner's words, as LISTEN-8 asks.
- **Frame 13:** Under 18 shows Mic off, as DESIGN does.
- **The suggested tab:** a 2.5-point edge in its category's color marks it.
- **Consent and permission answers:** Allow and Not now, and They agreed and They said no, are equal pairs in one secondary style, side by side and stacked from AX1, since CONSENT-1 asks for equal weight; frames 17 and 18 draw them unequal.
- **Destructive actions:** Erase all data, Reset stats, Withdraw, and Delete read in `ink`, since red belongs to No; only the system's alerts show their red.
- **One category helper:** `category-style.ts` gives every screen a category's hue and symbol. Typed shows `keyboard` and a category the user adds shows `square.grid.2x2.fill`, in Home's reply tags as in the bank.
- **Checks:** each screen passes DESIGN's [Checks before a screen ships](/docs/DESIGN.md#checks-before-a-screen-ships).
- **Left out:** the word highlight while Turn speaks, plan 0044's open question 3, and the short-screen check, since Xcode 27 has no iPhone SE Simulator.

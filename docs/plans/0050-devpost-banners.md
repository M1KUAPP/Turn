# Devpost banners from the README captures

Rebuild the Devpost gallery banners and the required screenshot from the current README captures, and add four more banners.

Contents:

1.  [Context](#context)
1.  [Decisions](#decisions)
1.  [Steps](#steps)
1.  [Checks](#checks)

## Context

The Devpost entry was submitted on October 1, 2026 with two gallery banners and a 1179 by 2556 screenshot built from pre-v2 captures: `listen-consent.png`, `listen-permission.png`, and `turn-iphone16-ios27.png`. The README's 14 captures in `assets/readme/screenshots/` (since moved to `docs/readme/screenshots/` and `docs/readme/steps/`) show the current app, and two pairs of them are byte-identical (`step-4-answer.png` and `suggested-replies.png`, `step-5-keep-listening.png` and `turn-listen-paywall.png`), which leaves 12 distinct screens. The user asked for banners rebuilt from these captures, and for more than two.

## Decisions

1.  **Six banners, two screens each.** Each banner keeps the existing `gallery()` layout: 1800 by 1200, a two-line headline, a label, and two phones with one-line captions. Together they use each of the 12 distinct screens once:

    | File                            | Headline                | Label              | Screens and captions                                                               |
    | ------------------------------- | ----------------------- | ------------------ | ---------------------------------------------------------------------------------- |
    | `devpost-gallery-replies.png`   | A question. Your words. | TURN / LISTEN MODE | `step-1-pick-a-place` "Pick a place"; `suggested-replies` "Replies are ready"      |
    | `devpost-gallery-consent.png`   | Consent comes first.    | TURN / PRIVACY     | `step-3-listen` "You allow it"; `partner-consent` "Partner agrees"                 |
    | `devpost-gallery-speak.png`     | Tap a phrase, or type.  | TURN / SPEAK       | `speaking-grid` "Tap a phrase"; `step-2-speak` "Or type it"                        |
    | `devpost-gallery-phrases.png`   | Your words, your way.   | TURN / PHRASE BANK | `phrase-bank-editor` "Edit every phrase"; `companion-home` "Ren by your grid"      |
    | `devpost-gallery-free.png`      | Speaking stays free.    | TURN / TURN LISTEN | `turn-listen-paywall` "Paid once"; `settings` "Restore anytime"                    |
    | `devpost-gallery-companion.png` | A face for your voice.  | TURN / COMPANION   | `companion-settings` "Choose a face"; `companion-partner-view` "Show your partner" |

2.  **The screenshot.** `devpost-screenshot.png` is `suggested-replies.png` scaled to 1179 pixels wide and cropped to 2556 pixels tall from the top, which removes 7 pixels of empty background below the home indicator. It has no device frame.
3.  **The thumbnail stays.** It's typographic and shows no screen, so it isn't stale.
4.  **Orphans.** `listen-consent.png`, `listen-permission.png`, and `turn-iphone16-ios27.png` are used only by the old banners and the old screenshot, so they're deleted, and `docs/pitch-assets.md` describes the new images.
5.  **Only the Devpost images change.** The script's heroes and GIF don't change; if re-rendering changes their bytes, they're restored from `main`.

## Steps

1.  This plan.
2.  The script and the rendered images.
3.  `docs/pitch-assets.md`.
4.  The pull request, then the Devpost gallery uploads.

## Checks

- `uv run --with pillow python scripts/render-pitch-assets.py` exits 0.
- `sips` reports 1800 by 1200 for each banner and 1179 by 2556 for the screenshot.
- Each banner is viewed, and no headline, label, or caption overlaps or overflows.
- `rg` finds no reference to the three deleted files.
- `git status` shows no change to the heroes, the GIF, or the thumbnail.
- `bun run lint` passes.

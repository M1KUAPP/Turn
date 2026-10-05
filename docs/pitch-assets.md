# Turn pitch assets

The [Icon Composer source](/app/assets/turn.icon/icon.json) has separate vector field and mark layers. The [1024-pixel icon](/assets/pitch/turn-icon-1024.png) is its flattened default export; [dark](/assets/pitch/turn-icon-dark-1024.png) and [tinted](/assets/pitch/turn-icon-tinted-1024.png) exports are here too.

Contents:

1.  [README images](#readme-images)
1.  [Devpost images](#devpost-images)

## README images

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../assets/pitch/readme-hero-dark.png">
  <img src="../assets/pitch/readme-hero-light.png" alt="Turn app icon beside iPhone 18 Pro captures of the Clinic reply row and partner consent card.">
</picture>

Your own words, in time for your turn.

![A partner asks How was physio? and Turn shows the saved reply It was hard.](/assets/pitch/readme-aha.gif)

The logline is text so it remains readable and selectable. The GIF's first frame shows both the question and answer when animation is paused. The repository README embeds these images and the screen captures in [`docs/readme/screenshots`](/docs/readme/screenshots) and [`docs/readme/steps`](/docs/readme/steps), including the companion settings, Home with Ren, and partner view.

The README captures use the iPhone 18 Pro Simulator on iOS 27, in light mode at the default text size, with a 9:41 status bar. Each portrait is 1206 by 2622 pixels; the README step images for steps 4 and 5 are crops of `suggested-replies.png` and `turn-listen-paywall.png`, so no step repeats a screenshot. They were captured from the [v0.1.0 Simulator release](https://github.com/M1KUAPP/Turn/releases/tag/v0.1.0), built at [`76a1dca`](https://github.com/M1KUAPP/Turn/commit/76a1dcab30c924f87da30c3163b92fb7abda8740).

The two README heroes use their own iPhone 18 Pro inputs: [`turn-iphone18-pro-ios27.png`](/assets/pitch/turn-iphone18-pro-ios27.png), showing the Clinic reply row after “How was physio?”, and [`listen-consent-iphone18-pro-ios27.png`](/assets/pitch/listen-consent-iphone18-pro-ios27.png), showing the partner consent card. These are the same captures as `suggested-replies.png` and `partner-consent.png` in the README screenshot directory.

## Devpost images

![Turn thumbnail with the words Your own words, in time for your turn and an It was hard reply button.](/assets/pitch/devpost-thumbnail.png)

The six gallery banners each set two of the README captures side by side, so together they show each of its 12 distinct screens once:

![The place menu beside the Clinic reply row, where How was physio? brings It was hard and It went well.](/assets/pitch/devpost-gallery-replies.png)

![The Before Listen mode starts sheet beside the partner consent card, the two steps before Listen mode begins.](/assets/pitch/devpost-gallery-consent.png)

![The Clinic speaking grid beside the Type composer with I need a break and the Speak button.](/assets/pitch/devpost-gallery-speak.png)

![The Chat phrase bank with edit buttons beside Home with Ren next to the floating toolbar.](/assets/pitch/devpost-gallery-phrases.png)

![The Turn Listen paywall with its US$24.99 one-time price beside Settings with Unlock Listen mode and Restore Purchases.](/assets/pitch/devpost-gallery-free.png)

![Companion settings with the Ren, Suit, Ice, and Office faces beside the partner view with I have something to say and Say it again.](/assets/pitch/devpost-gallery-companion.png)

The [required portrait screenshot](/assets/pitch/devpost-screenshot.png) is 1179 by 2556 pixels with no device frame: the README's `suggested-replies.png` capture scaled to 1179 pixels wide, with the 7 pixels of empty background below the home indicator cropped off.

Run `python3 scripts/render-pitch-assets.py` with Pillow installed to rebuild the thumbnail, gallery images, required screenshot, README heroes, and GIF from the committed Simulator captures and Atkinson Hyperlegible Next font. The font's OFL license is in [`assets/pitch/fonts/OFL.txt`](/assets/pitch/fonts/OFL.txt).

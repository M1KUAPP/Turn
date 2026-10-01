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

The logline is text so it remains readable and selectable. The GIF's first frame shows both the question and answer when animation is paused. The repository README embeds these images and the screen captures in [`assets/readme/screenshots`](/assets/readme/screenshots), including the companion settings, Home with Ren, and partner view.

The README captures use the iPhone 18 Pro Simulator on iOS 27, in light mode at the default text size, with a 9:41 status bar. Each portrait is 1206 by 2622 pixels. They were captured from the [v0.1.0 Simulator release](https://github.com/M1KUAPP/Turn/releases/tag/v0.1.0), built at [`76a1dca`](https://github.com/M1KUAPP/Turn/commit/76a1dcab30c924f87da30c3163b92fb7abda8740).

The two README heroes use their own iPhone 18 Pro inputs: [`turn-iphone18-pro-ios27.png`](/assets/pitch/turn-iphone18-pro-ios27.png), showing the Clinic reply row after “How was physio?”, and [`listen-consent-iphone18-pro-ios27.png`](/assets/pitch/listen-consent-iphone18-pro-ios27.png), showing the partner consent card. These are the same captures as `suggested-replies.png` and `partner-consent.png` in the README screenshot directory.

## Devpost images

![Turn thumbnail with the words Your own words, in time for your turn and an It was hard reply button.](/assets/pitch/devpost-thumbnail.png)

![Turn consent screen beside the conversation screen with How was physio? and the saved replies It was hard and It went well.](/assets/pitch/devpost-gallery-replies.png)

![Turn's privacy step beside its partner consent card, showing the two steps before Listen mode begins.](/assets/pitch/devpost-gallery-consent.png)

The [required portrait screenshot](/assets/pitch/turn-iphone16-ios27.png) is 1179 by 2556 pixels, exported from a frame-free iPhone 16 iOS 27 Simulator capture with a 9:41 status bar. Its caption and replies are actual app UI: the partner's line was typed after consent, and Turn ranked saved Clinic phrases. The Devpost galleries continue to use this iPhone 16 capture with `listen-consent.png` and `listen-permission.png`. The README’s paywall capture comes from the current Test Store flow on the iPhone 18 Pro.

Run `python3 scripts/render-pitch-assets.py` with Pillow installed to rebuild the thumbnail, gallery images, README heroes, and GIF from the committed Simulator captures and Atkinson Hyperlegible Next font. The font's OFL license is in [`assets/pitch/fonts/OFL.txt`](/assets/pitch/fonts/OFL.txt).

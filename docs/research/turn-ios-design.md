# Turn's iOS design research notes

What Apple's platform, Expo SDK 57, React Native 0.86, and RevenueCat's paywall
mean for the look and feel of Turn, the AAC app the
[product document][product] describes, for the rewrite of
[DESIGN.md][design-md] as its design system: what Xcode 27 and the iOS 27 SDK
change, what moved since September 22, and what each fact means for Turn.
Every source below was read on September 23, 2026, so versions and limits are
as of that date, and judgment starts with "Synthesis:"; Apple's documentation
was read as DocC JSON and WWDC transcripts, the SF Pro, New York, and SF
Symbols installers were expanded without installing them, the purchases-ios
5.90.1 source fills RevenueCat's gaps, and nothing ran on a device. The
[iOS design notes][ios-design] of September 22 already cover iOS 26's Liquid
Glass, fonts, color, motion, icons, symbols, the paywall editor, and store art,
for Guessling; the [iPhone build notes][turn-ios] cover speech, audio, and
Personal Voice; and the [AAC practice notes][aac-notes] cover iOS access
features and React Native's accessibility API, so this note links them
instead of repeating them.

Contents:

1.  [Findings for DESIGN.md](#findings-for-designmd)
1.  [What Xcode 27 and the iOS 27 SDK change](#what-xcode-27-and-the-ios-27-sdk-change)
1.  [Liquid Glass and accessibility settings](#liquid-glass-and-accessibility-settings)
1.  [Type for Turn](#type-for-turn)
1.  [Color for Turn](#color-for-turn)
1.  [Motion and haptics for Turn](#motion-and-haptics-for-turn)
1.  [SF Symbols for Turn](#sf-symbols-for-turn)
1.  [App icon and launch screen for Turn](#app-icon-and-launch-screen-for-turn)
1.  [RevenueCat's paywall for Turn](#revenuecats-paywall-for-turn)
1.  [Pitch assets](#pitch-assets)
1.  [Conflicts between sources](#conflicts-between-sources)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

[product]: /docs/PRODUCT.md

## Findings for DESIGN.md

Synthesis: each line condenses its linked section, where the sources are.

- **Glass belongs to the system's chrome; phrases stay solid.** Bars, sheets,
  alerts, and switches turn to Liquid Glass on their own; the grid, row, strip,
  and consent card are content, where the HIG says not to use glass. See
  [Content and controls on glass](#content-and-controls-on-glass).
- **Xcode 27 removes the way out of glass.** The system ignores
  `UIDesignRequiresCompatibility` in apps built for iOS 27, and only Expo
  Router's JavaScript stack gives a header with no glass. See
  [The compatibility key under Xcode 27](#the-compatibility-key-under-xcode-27).
- **Test at both ends of the Liquid Glass slider, and give reading sheets a
  background.** No API reports iOS 27's slider, and Expo Router makes form
  sheets transparent unless the screen sets a background. See
  [Settings that change glass](#settings-that-change-glass).
- **Lay out by the space available, not by the device.** Built with the iOS 27
  SDK, Turn resizes on iPad and in iPhone Mirroring, where its portrait lock is
  only a preference, and iPhone Duo folds. See
  [Resizable iPhone apps and iPhone Duo](#resizable-iphone-apps-and-iphone-duo).
- **The row grows with the text size, never with its content.** Body grows
  from 17 to 53 points by AX5, so six side-by-side slots of one fixed height
  can't hold wrapped phrases at accessibility sizes. See
  [Dynamic Type sizes for Turn's styles](#dynamic-type-sizes-for-turns-styles).
- **Bold Text is Turn's job.** React Native reports the setting, but its font
  code never reads it, and Apple warns that other text "may not respond well".
  See [Bold Text and custom fonts](#bold-text-and-custom-fonts).
- **Atkinson Hyperlegible Next is the one face licensed everywhere Turn shows
  text.** It's OFL, in 14 static faces of about 48 to 52 KB; SF Pro may appear
  in the video and gallery only as the running app draws it. See
  [Fonts in the video and gallery images](#fonts-in-the-video-and-gallery-images).
- **White text needs custom fills, and every button needs an edge.** White on
  systemBlue is 3.52 to 1, and React Native can't read Show Borders or
  Differentiate Without Color, so edges and words are always on. See
  [System colors and grays](#system-colors-and-grays).
- **The listening light is a word first, pulses by opacity, and stops live
  under Reduce Motion.** Reanimated reads Reduce Motion once at launch, and no
  source says symbol effects stop. See
  [A pulsing listening light](#a-pulsing-listening-light).
- **No haptics in Listen mode, and none that carry meaning.** A recording app
  plays no haptics unless it opts in, and vibration can disrupt the microphone.
  See
  [Haptics while Turn listens or speaks](#haptics-while-turn-listens-or-speaks).
- **Symbols from before iOS 26, always beside words.** Every symbol Turn needs
  exists by iOS 17, `xmark` already means Cancel, and no sparkles appear in a
  product that never writes a word. See
  [Symbols for speaking, listening, and answering](#symbols-for-speaking-listening-and-answering).
- **One `.icon` from Icon Composer 2, and Dark Mode switched on.** SDK 57 takes
  the file as `ios.icon`, and the TRD's missing `userInterfaceStyle` makes Expo
  force the light style. See
  [Icon appearances and Icon Composer 2](#icon-appearances-and-icon-composer-2).
- **Long text stays text.** Accessibility Reader, new in iOS 26, reads an app's
  text the way VoiceOver does, so the consent card and the privacy notice are
  never images. See
  [Accessibility features in iOS 26 and 27](#accessibility-features-in-ios-26-and-27).
- **A plain, static paywall.** Paywalls follow Dynamic Type and stop video
  under Reduce Motion, but carousels still move, images are hidden from
  VoiceOver, and Increase Contrast and Bold Text change nothing. See
  [Dynamic Type, VoiceOver, and Reduce Motion in paywalls](#dynamic-type-voiceover-and-reduce-motion-in-paywalls).
- **Captures from an iPhone 16 simulator, and a 16:9 video with a caption
  file.** iPhone 16's screen is Shipaton's 1179 by 2556 pixels, and Device Hub
  blocks a mirrored iPhone's microphone, so Listen mode is filmed on the phone.
  See [Pitch assets](#pitch-assets).

## What Xcode 27 and the iOS 27 SDK change

Apple's WWDC26 sessions, the HIG's What's new page, the Xcode 27 release notes,
and Apple's support pages own these facts.

### Liquid Glass in iOS 27

- **The material changed.** "To maintain exceptional readability, we tuned
  Liquid Glass so it more effectively diffuses complex content behind it."
  Apple also "introduced a darkened edge along with brighter specular
  highlights", and "Apps already using Liquid Glass get these improvements
  automatically when they run on this year’s releases without even needing to
  recompile." ([Platforms State of the Union][wwdc26-102]) And "app icons have
  been updated to be sharper and more defined" ([Apple Newsroom][nr-ios27]).
- **The look is the user's.** iOS 26.1's "Liquid Glass setting gives you the
  option to choose between the default clear look or a new tinted look which
  increases opacity of the material in apps and notifications on the Lock
  Screen", and iOS 26.4's "Reduce Motion setting more reliably reduces the
  animations of Liquid Glass" ([About iOS 26 Updates][kb-ios26-updates]). In
  iOS 27 the choice is a slider under Appearance: "Drag the slider to the right
  to increase the tint of Liquid Glass, and to the left to make Liquid Glass
  more clear." ([iPhone User Guide][ug-display-27])
- Synthesis: this settles the iOS design notes' [first gap][ios-gaps]. The
  Materials page last changed on September 9, 2025 ([Materials][hig-materials]),
  so the [rules for custom glass][ios-lg-custom] stand.

[nr-ios27]: https://www.apple.com/newsroom/2026/09/major-updates-for-apples-software-platforms-are-now-available/
[ios-gaps]: /docs/research/ios-design.md#gaps
[hig-materials]: https://developer.apple.com/design/human-interface-guidelines/materials

### The compatibility key under Xcode 27

- **Apple's rule.** "The system ignores this key when you build for iOS 27 or
  later" ([UIDesignRequiresCompatibility][doc-udrc]). At WWDC26: "once your app
  is recompiled with Xcode 27, it will automatically begin to use the new
  design with Liquid Glass." ([Platforms State of the Union][wwdc26-102])
- **Expo's two ways out.** The key is "a temporary workaround. From iOS 27,
  this option will be removed by Apple and you cannot opt out of the Liquid
  Glass effect." The other is `expo-router/js-stack`, which "gives you full
  control over the header UI, at the cost of the performance benefits of the
  highly optimized iOS navigation views and controllers"
  ([Expo Router stack][expo-stack]).
- Synthesis: Turn builds with Xcode 27 ([COMPAT-1][prd-compat]), and with the
  scene support the [technology notes][tech-xcode27] describe, so the key would
  do nothing; DESIGN.md designs for glass bars and sheets on iOS 26 and 27
  alike and keeps the native stack.

[doc-udrc]: https://developer.apple.com/documentation/bundleresources/information-property-list/uidesignrequirescompatibility
[expo-stack]: https://docs.expo.dev/router/advanced/stack/
[prd-compat]: /docs/PRD.md#compatibility
[tech-xcode27]: /docs/research/next-gen-tech.md#expo-sdk-57-sdk-58-and-xcode-27

### Resizable iPhone apps and iPhone Duo

- **Resizing is on.** "Once you rebuild with the latest SDK, your app is
  automatically opted in to resizability." ([Platforms State of the
  Union][wwdc26-102]) "Likewise, an iPhone-only app running on iPad will be
  fully resizable like any other iPad app." ([Modernize your UIKit
  app][wwdc26-278])
- **Orientation becomes a wish.** "In iOS 27, an app's supported interface
  orientation is a preference provided to the system. It will be ignored when
  your app is running in a resizable environment." ([Modernize your UIKit
  app][wwdc26-278]) The HIG's Layout page, which dropped its per-device size
  tables on September 9, 2026, agrees ([Layout][hig-layout]).
- **iPhone Duo.** Its HIG page, new on September 9, 2026: "Build your app to
  resize." "Avoid fixed widths and display-specific dependencies." "In a
  grid-style layout, prefer an even number of columns so content divides
  cleanly." ([Designing for iPhone Duo][hig-duo]) "When you build with Xcode 26
  and earlier, your app doesn’t extend under the status bar and camera."
  ([Preparing your app for iPhone Duo][doc-prep-duo])
- Synthesis: `ios.supportsTablet` false still leaves an iPhone app that iPads
  run, and iPhone Duo reaches buyers on October 23, after judging
  ([Apple requirements notes][apple-iphone-runs]). The grid takes an even
  number of columns from its width, the six slots keep their order at every
  width, and DESIGN.md names a narrowest and a widest layout to check in Device
  Hub, which can "resize a simulated iPhone screen to an arbitrary size"
  ([Configuring the environment of a simulated device][doc-hub-env]).

[hig-duo]: https://developer.apple.com/design/human-interface-guidelines/designing-for-iphone-duo
[doc-prep-duo]: https://developer.apple.com/documentation/technologyoverviews/preparing-your-app-for-iphone-duo
[apple-iphone-runs]: /docs/research/apple-requirements.md#where-an-iphone-app-runs

### Bars that minimize and new scroll edges

- **Navigation bars slide away.** "By default, navigation bars minimize in
  certain conditions defined by the system." "If you handle safe area
  avoidance yourself, set barMinimizationSafeAreaAdjustment to .never so bar
  minimization doesn't update insets automatically." ([Modernize your UIKit
  app][wwdc26-278]) The shipped API is `navigationBarMinimization`, iOS 27 and
  later ([navigationBarMinimization][doc-nav-minimization]).
- **Scroll edges look different.** "the .automatic style no longer switches
  between the existing soft and hard styles but provides its own visuals for
  additional clarity" ([Modernize your UIKit app][wwdc26-278]), and the HIG
  says "Prefer the automatic scroll edge effect style."
  ([Scroll views][hig-scroll-views])
- Synthesis: react-native-screens 4.26.2, which SDK 57 bundles, sets no
  navigation bar minimization ([react-native-screens 4.26.2][rns-4262]), so the
  home screen hides its header and keeps the strip and row outside the grid's
  scroll view, where nothing can collapse and move them ([ROW-1][prd-row]).

[hig-scroll-views]: https://developer.apple.com/design/human-interface-guidelines/scroll-views

### HIG changes since June 2025

| Date               | Pages                                      | Change, in Apple's words where short                      |
| ------------------ | ------------------------------------------ | --------------------------------------------------------- |
| December 16, 2025  | Typography; Color, Buttons, Toolbars       | Emphasized weights; "Updated guidance for Liquid Glass."  |
| March 24, 2026     | Sheets                                     | "Updated guidance for button placement."                  |
| June 8, 2026       | Design principles; Scroll views; App icons | "Reintroduced design principles."; edge effects; icons    |
| September 9, 2026  | Layout; Designing for iPhone Duo; Branding | Best practices; "New page."; "using brand color"          |
| September 17, 2026 | Apple In-App Purchase                      | "Rebranded as Apple In-App Purchase and refined guidance" |

Source for the table: [What's new in design][hig-whats-new].

- **A steady screen.** "Keep content and controls in consistent, predictable
  positions, and use natural animations to ease transitions."
  ([Design principles][hig-principles]) That's Turn's "Steady beats clever"
  ([product principles][product-principles]).
- **Brand color in the content.** "Apply your app’s accent color judiciously."
  "To express your brand through color, consider moving it into the content
  layer, where it scrolls beneath Liquid Glass controls and gets picked up
  dynamically." ([Branding][hig-branding])
- **Sheets and choices.** "For complex or prolonged user flows, consider
  alternatives to sheets." ([Sheets][hig-sheets]) "Use style — not size — to
  visually distinguish the preferred choice among multiple options."
  ([Buttons][hig-buttons]) Synthesis: "Allow" and "Not now"
  ([CONSENT-1][prd-consent]) share one size and style, and the consent card
  stays full screen.

[hig-principles]: https://developer.apple.com/design/human-interface-guidelines/design-principles
[hig-sheets]: https://developer.apple.com/design/human-interface-guidelines/sheets
[hig-buttons]: https://developer.apple.com/design/human-interface-guidelines/buttons

### Typography changes in iOS 26 and 27

- **iOS 26.** "Typography has been refined to strengthen clarity and
  structure, now bolder and left-aligned to improve readability in key moments
  like alerts and onboarding." ([Get to know the new design system][wwdc25-356])
- **iOS 27.** No WWDC26 session or HIG change announces a type change; the
  Dynamic Type tables match the [iOS design notes][ios-dt-sizes]
  ([Typography][hig-typography]), and SF Pro's installer, version 27.0 of
  September 14, 2026, keeps license EA1761 ([SF Pro download][sf-pro-dmg]).

[wwdc25-356]: https://developer.apple.com/videos/play/wwdc2025/356/

### Accessibility features in iOS 26 and 27

| Feature                                            | Since                  | What it asks of Turn                                      |
| -------------------------------------------------- | ---------------------- | --------------------------------------------------------- |
| Accessibility Reader                               | iOS 26; more in iOS 27 | Long text is real text in the accessibility tree          |
| Liquid Glass look, Clear or Tinted                 | iOS 26.1; slider in 27 | Nothing on custom glass that depends on the look          |
| Show Borders, replacing Button Shapes              | API from iOS 26.1      | Visible edges on every control                            |
| Reduce Bright Effects                              | iOS 26.4               | Press states without bright flashes                       |
| Personal Voice from 10 phrases                     | iOS 26                 | Covered by the [AAC practice notes][aac-pv]               |
| Eye Tracking with a switch or dwell; Head Tracking | iOS 26                 | Large, separated targets ([AAC notes][aac-eye])           |
| Voice Control in natural language                  | iOS 27                 | Labels equal to visible text ([AAC notes][aac-vc])        |
| Generated subtitles                                | iOS 27                 | Nothing for YouTube; the video still needs a caption file |

Sources for the table: [About iOS 26 Updates][kb-ios26-updates];
[Apple Newsroom, May 13, 2025][nr-2025];
[Apple Newsroom, May 19, 2026][nr-2026];
[Make onscreen elements easier to see][ug-borders].

- **Accessibility Reader.** It "can be launched from any app"
  ([Apple Newsroom, May 13, 2025][nr-2025]), and with Apple Intelligence in
  iOS 27 can "format content for easier reading, summarize long text, and
  translate text" ([iPhone User Guide][ug-reader]). At WWDC26: "Implementing
  accessible text practices like I've shared so far will make the reader
  experience better for your content as well." ([Enhance the accessibility of
  your reading app][wwdc26-219])
- **Not in the lists.** Neither year's list names Live Speech, and iOS 27's,
  which adds Apple Intelligence and generated subtitles, names neither Personal
  Voice nor Eye Tracking on iPhone ([Apple Newsroom, May 13, 2025][nr-2025];
  [Apple Newsroom, May 19, 2026][nr-2026]).
- Synthesis: people can set "different color, text size, and motion settings
  for certain apps" ([Customize visual accessibility settings for specific
  apps][ug-per-app]), so Turn reads each setting at runtime and follows its
  change event; every piece of prose is `Text`, so Reader gets it.

[aac-pv]: /docs/research/aac-practice.md#personal-voice-for-users-in-ios-26-and-ios-27
[aac-vc]: /docs/research/aac-practice.md#voice-control
[nr-2025]: https://www.apple.com/newsroom/2025/05/apple-unveils-powerful-accessibility-features-coming-later-this-year/
[nr-2026]: https://www.apple.com/newsroom/2026/05/apple-unveils-new-accessibility-features-and-updates-with-apple-intelligence/
[ug-reader]: https://support.apple.com/guide/iphone/read-listen-text-apps-accessibility-reader-iph406a46ab8/27/ios/27
[wwdc26-219]: https://developer.apple.com/videos/play/wwdc2026/219/
[ug-per-app]: https://support.apple.com/guide/iphone/customize-per-app-visual-settings-iph1f48544ab/27/ios/27

### Accessibility Nutrition Labels for Turn

- **Still voluntary.** "providing these labels will be voluntary to start"
  ([Overview of Accessibility Nutrition Labels][asc-a11y-overview]); the
  [Apple requirements notes][apple-labels] quote each label's criteria, and
  Captions also counts "text transcripts of audio-only content"
  ([Captions evaluation criteria][asc-captions]).

| Label                             | What Turn would have to pass, in Synthesis                                         |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| VoiceOver                         | Every phrase, the row's one announcement, the light, the consent card, the paywall |
| Voice Control                     | Phrases tapped by visible text; dictation into the keyboard and typed-line fields  |
| Larger Text                       | Every screen and the paywall at AX5 with no cut-off text                           |
| Dark Interface                    | Every screen, the paywall and the launch screen included                           |
| Differentiate Without Color Alone | Row states, the light, and the marked category tab shown by words or shapes        |
| Sufficient Contrast               | Text at 4.5 to 1 and edges at 3 to 1, in light and dark                            |
| Reduced Motion                    | No pulse, no moving row, and a static paywall                                      |
| Captions                          | Spoken output on screen as text, and the partner's words in the caption            |
| Audio Descriptions                | Doesn't apply: Turn plays no video                                                 |

- Synthesis: with no store release Turn can't publish labels, but the table
  doubles as its accessibility test plan, and since purchase is a common task,
  the paywall must pass every row.

[asc-a11y-overview]: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/overview-of-accessibility-nutrition-labels
[asc-captions]: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/captions-evaluation-criteria

## Liquid Glass and accessibility settings

Apple's HIG, WWDC sessions, and user guides, and Expo's docs and source, own
these facts; this section maps the [components that adopt glass][ios-lg-system]
onto the [TRD's routes][trd-screens].

[ios-lg-system]: /docs/research/ios-design.md#system-components-that-adopt-it
[trd-screens]: /docs/TRD.md#screens-and-navigation

### Turn's chrome that turns to glass

| Chrome                                  | Where in Turn                                         | Under the iOS 27 SDK                                                      |
| --------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------- |
| Native stack header                     | Settings and the phrase bank editor                   | Glass bar items; Expo Router keeps the bar opaque unless it's transparent |
| Page sheet                              | RevenueCat's paywall, and any `'modal'` route         | Glass sheet, opaque content                                               |
| Form sheet, `presentation: 'formSheet'` | The permission step, if it's a form sheet             | Glass sheet; header and content transparent unless the screen sets them   |
| Alerts                                  | Erase all data's confirmation, the Test Store alert   | Regular glass                                                             |
| System keyboard                         | The keyboard sheet and the typed-line field           | Not stated outright; the HIG treats controls above it as glass            |
| Switches and sliders                    | The under-18 switch, and a rate slider if there's one | The knob turns to glass while touched                                     |
| Full-screen consent card                | `/consent`                                            | None: it's content                                                        |

Sources for the table: [iOS design notes][ios-router];
[createNativeStackNavigator.tsx][gh-router-formsheet]; the
[services notes][svc-sheet], which found the Test Store alert is UIKit's. For
the keyboard, the HIG only asks apps to "apply Liquid Glass to the view that
contains your controls to maintain consistency" above it
([Virtual keyboards][hig-keyboards]).

- Synthesis: every glass surface in the table is UIKit's, so it follows the
  slider and accessibility settings with no code from Turn.

[ios-router]: /docs/research/ios-design.md#headers-sheets-and-tabs-in-expo-router
[hig-keyboards]: https://developer.apple.com/design/human-interface-guidelines/virtual-keyboards

### Settings that change glass

| Setting                             | What it does to glass                                                         | Can Turn read it?                     |
| ----------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------- |
| Reduce Transparency                 | "makes Liquid Glass frostier and obscures more of the content behind it"      | Yes, with `reduceTransparencyChanged` |
| Increase Contrast                   | "makes elements predominantly black or white" with "a contrasting border"     | Yes, as `isDarkerSystemColorsEnabled` |
| Reduce Motion                       | "decreases the intensity of some effects and disables any elastic properties" | Yes, with `reduceMotionChanged`       |
| Liquid Glass look (26.1) and slider | Tinted "increases opacity of the material"                                    | No API                                |
| Show Borders                        | Adds "a border around" controls                                               | Not from React Native                 |

Sources for the table: [Meet Liquid Glass][wwdc25-219]; [About iOS 26
Updates][kb-ios26-updates]; [Make onscreen elements easier to see][ug-borders];
[AccessibilityInfo][rn-a11yinfo].

- **The accessibility settings win.** "If you turned on Reduced Transparency or
  Increased Contrast in Accessibility settings, you need to turn them off to
  change the look for Liquid Glass." ([iPhone User Guide][ug-display-27])
- Synthesis: DESIGN.md's test matrix is light and dark, each at ultraclear and
  fully tinted, plus Reduce Transparency and Increase Contrast, on an iOS 26
  phone and in the iOS 27 simulator, where Device Hub can "change the
  environment settings, such as Appearance, Liquid Glass, and Text Size"
  ([Configuring the environment of a simulated device][doc-hub-env]).

[wwdc25-219]: https://developer.apple.com/videos/play/wwdc2025/219/

### Content and controls on glass

- **The HIG's line.** Glass is for controls and navigation, not the content
  layer, and "sparingly" on custom controls ([iOS design notes][ios-lg-custom]).
  "Instead of applying a solid or semi-opaque background color beneath
  controls, use a scroll edge effect to visually elevate controls above
  content." ([Layout][hig-layout])
- **Where the brand goes.** "Conceptually, the content layer is the best
  opportunity to express your brand identity." "our recommendation is to move
  color into the content area of your app, into the scroll view."
  ([Communicate your brand identity on iOS][wwdc26-251])
- Synthesis: the row, strip, and grid are the content layer, so phrases are
  solid, bordered buttons on an opaque background, where contrast holds at
  every glass setting. If DESIGN.md gives the Listen button glass, it's one
  regular `GlassView` with a solid version for Reduce Transparency.

### Glass in Expo SDK 57 and how to avoid it

- **Versions.** On September 23, 2026, `expo` 57.0.24 and the rest of the
  [iOS design notes' table][ios-versions] were still SDK 57's newest
  ([npm][npm-expo]).
- **Views.** `GlassView` is "only available on iOS 26 and above", its
  `glassEffectStyle` takes `'regular'`, `'clear'`, or `'none'`, and
  `isLiquidGlassAvailable()` "only checks for component availability"; "To
  check if the user has disabled the Liquid Glass effect via accessibility
  settings, use AccessibilityInfo.isReduceTransparencyEnabled()."
  ([expo-glass-effect][expo-glass]) In `@expo/ui`, Apple's identity variant
  means "your content remains unaffected as if no glass effect was applied"
  ([Glass.identity][doc-glass-identity]).
- **Form sheets.** When glass is available, Expo Router sets
  `newOptions.headerTransparent ??= true;` and
  `newOptions.contentStyle ??= { backgroundColor: 'transparent' };`
  ([createNativeStackNavigator.tsx][gh-router-formsheet]), so options a screen
  sets win.

Synthesis: no switch turns glass off in an Xcode 27 build, so per element Turn
renders no `GlassView`, accepts glass in bars, alerts, and the keyboard, and
gives a reading sheet its own background:

```tsx
<Stack.Screen
  name="permission"
  options={{
    presentation: 'formSheet',
    headerTransparent: false,
    contentStyle: { backgroundColor: color.surface }
  }}
/>
```

[ios-versions]: /docs/research/ios-design.md#package-versions-in-sdk-57
[npm-expo]: https://registry.npmjs.org/expo
[expo-glass]: https://docs.expo.dev/versions/v57.0.0/sdk/glass-effect/
[doc-glass-identity]: https://developer.apple.com/documentation/swiftui/glass/identity

## Type for Turn

Apple's HIG and WWDC sessions, React Native's docs and source, and each font's
publisher own these facts. How React Native scales text is in the
[iOS design notes][ios-rn-scale].

### Dynamic Type sizes for Turn's styles

| Style       | Weight   | Large (default) | AX1   | AX2   | AX3   | AX4   | AX5   |
| ----------- | -------- | --------------- | ----- | ----- | ----- | ----- | ----- |
| Large Title | Regular  | 34/41           | 44/52 | 48/57 | 52/61 | 56/66 | 60/70 |
| Title 1     | Regular  | 28/34           | 38/46 | 43/51 | 48/57 | 53/62 | 58/68 |
| Title 2     | Regular  | 22/28           | 34/41 | 39/47 | 44/52 | 50/59 | 56/66 |
| Title 3     | Regular  | 20/25           | 31/38 | 37/44 | 43/51 | 49/58 | 55/65 |
| Headline    | Semibold | 17/22           | 28/34 | 33/40 | 40/48 | 47/56 | 53/62 |
| Body        | Regular  | 17/22           | 28/34 | 33/40 | 40/48 | 47/56 | 53/62 |

Size and leading in points from the HIG's iOS tables; AX1 to AX5 need the
Larger Accessibility Sizes switch, and the other styles and sizes are in the
[iOS design notes][ios-dt-sizes] ([Typography][hig-typography]).

- **Apple's advice for large sizes.** "Reduce the number of columns when the
  font size increases to avoid truncation and enhance readability." "Avoid
  truncating text in scrollable regions unless people can open a separate view
  to read the rest of the content." ([Typography][hig-typography])
- Synthesis, computed from the table: six two-line slots of Body need 744
  points of leading at AX5, while an iPhone 16 is 393 by 852 points (1179 by
  2556 pixels at 3x), so [ROW-1][prd-row]'s fixed height can't also meet
  [A11Y-4][prd-a11y]. DESIGN.md sets the row's height from the text-size
  category alone, drops to one column at accessibility sizes, and picks
  between a row that scrolls and fewer visible slots.

### Scaling text in React Native 0.86

- **What the iOS design notes found.** Without `dynamicTypeRamp`, a 17-point
  Body reaches 60.7 points at AX5, where Apple's is 53; with a ramp, text
  follows `UIFontMetrics`, and embedded fonts follow the same curve as system
  text ([iOS design notes][ios-rn-scale]; [embedded fonts][ios-expo-font]).
- Synthesis: each text token carries `fontSize`, `lineHeight`, and a
  `dynamicTypeRamp`; phrase text keeps `allowFontScaling` true and never sets
  `maxFontSizeMultiplier` or `numberOfLines`; and layout switches on the font
  scale, from 1.786 at AX1, which React Native relays whenever the setting
  changes ([RCTAccessibilityManager.mm][rn-a11y-mgr]).

### Bold Text and custom fonts

- **Apple's warning.** "If you aren't using system font styles for text labels
  in your app, then it may not respond well to the Bold Text setting."
  ([Make your app visually accessible][wwdc20-10020]) At WWDC26: "This is
  built into Apple's System Fonts, but you'll need to build support, and test
  for this, when you use your own Custom Fonts." ([Communicate your brand
  identity on iOS][wwdc26-251])
- **What React Native gives.** `isBoldTextEnabled()` and a `boldTextChanged`
  event ([AccessibilityInfo][rn-a11yinfo]); its 0.86.3 font code builds system
  text with `systemFontOfSize:weight:` and has no Bold Text branch
  ([RCTFontUtils.mm][rn-fontutils]).
- Synthesis: each type token names a regular weight and a Bold Text weight,
  following the HIG's emphasized weights, such as Regular to Semibold for Body,
  and a hook swaps them on `boldTextChanged`, for system text too, since
  nothing documents whether it thickens by itself.

[rn-fontutils]: https://github.com/react/react-native/blob/v0.86.3/packages/react-native/ReactCommon/react/renderer/textlayoutmanager/platform/ios/react/renderer/textlayoutmanager/RCTFontUtils.mm

### SF Pro, SF Pro Rounded, and New York

- **The installers.** SF Pro's 27.0 package holds SF Pro Text, Display, and
  Rounded in nine weights plus the variable `SF-Pro.ttf`; New York has its own
  ([SF Pro download][sf-pro-dmg]; [New York download][ny-dmg]). React Native
  reaches them as `system-ui`, `ui-rounded`, and `ui-serif`, and Turn embeds
  none ([iOS design notes][ios-fonts-rn]).
- **What the license allows.** "THE APPLE SF PRO FONT IS TO BE USED SOLELY FOR
  CREATING MOCK-UPS OF USER INTERFACES". Section 2A: "The foregoing right
  includes the right to show the Apple Font in screen shots, images, mock-ups
  or other depictions, digital and/or print, of such software products running
  solely on iOS, iPadOS, macOS or tvOS." Section 2B: "Except as expressly
  provided for herein, you may not use the Apple Font to, create, develop,
  display or otherwise distribute any documentation, artwork, website content
  or any other work product." It applies "only if you are a registered Apple
  Developer", and New York's license reads the same ([SF Pro
  download][sf-pro-dmg]; [New York download][ny-dmg]).
- Synthesis: SF Pro is free in Turn and in screenshots and recordings of Turn
  on iPhone, and nowhere else: not in a title card, a caption, or a thumbnail.

[ny-dmg]: https://devimages-cdn.apple.com/design/resources/download/NY.dmg
[ios-fonts-rn]: /docs/research/ios-design.md#system-fonts-in-react-native

### Atkinson Hyperlegible Next

- **Who and when.** Braille Institute announced it on February 10, 2025, "free
  to download and free to use via Google Fonts and
  BrailleInstitute.org/freefont" ([Braille Institute][bi-next-pr]), in
  "ExtraLight, Light, Regular, Medium, SemiBold, Bold, and ExtraBold, each with
  an upright and Italic version" ([Braille Institute][bi-freefont]); the
  variable font's weight axis runs from 200 to 800 ([METADATA.pb][gf-ahn-meta]).
- **License.** Google Fonts lists "OFL" ([METADATA.pb][gf-ahn-meta]); each
  file says "This Font Software is licensed under the SIL Open Font License,
  Version 1.1.", and its copyright line names no Reserved Font Name
  ([npm package][npm-ahn]). Braille Institute's own download asks for an email
  address, so this note didn't use it ([Braille Institute][bi-freefont]).
- **The Expo package.** `@expo-google-fonts/atkinson-hyperlegible-next` 0.4.1,
  published September 5, 2025, licensed "MIT AND OFL-1.1", holds 14 static
  TrueType files, one per weight and style, in Google Fonts' Latin and Latin
  Extended subsets ([npm package][npm-ahn]; [METADATA.pb][gf-ahn-meta]).

| Face                   | PostScript name                      | Bytes            |
| ---------------------- | ------------------------------------ | ---------------- |
| Regular                | `AtkinsonHyperlegibleNext-Regular`   | 48,064           |
| Medium                 | `AtkinsonHyperlegibleNext-Medium`    | 48,036           |
| SemiBold               | `AtkinsonHyperlegibleNext-SemiBold`  | 47,956           |
| Bold                   | `AtkinsonHyperlegibleNext-Bold`      | 47,968           |
| ExtraBold              | `AtkinsonHyperlegibleNext-ExtraBold` | 48,044           |
| Italics, seven weights | Each face's name plus `Italic`       | 52,280 to 52,504 |

Source for the table: each file's name table in the 0.4.1 package, font
version 2.001, where only Regular and Bold use the plain family name
([npm package][npm-ahn]).

- Synthesis: embed the three or four faces Turn uses, about 48 KB each, with
  the expo-font config plugin, renamed to their PostScript names as Expo
  recommends, and refer to each face by PostScript name, since the family names
  differ by weight ([iOS design notes][ios-expo-font]). Turn is US English only,
  so the Latin subsets are enough.

[npm-ahn]: https://registry.npmjs.org/@expo-google-fonts/atkinson-hyperlegible-next

### Fonts in the video and gallery images

| Font                             | In Turn                      | In the video's own titles | In Devpost images           |
| -------------------------------- | ---------------------------- | ------------------------- | --------------------------- |
| SF Pro, SF Pro Rounded, New York | Drawn by iOS, never embedded | No                        | Only inside app screenshots |
| SF Symbols                       | Drawn by iOS                 | No                        | Only inside app screenshots |
| Atkinson Hyperlegible Next       | Embedded under the OFL       | Yes                       | Yes                         |

Sources for the table: [SF Pro download][sf-pro-dmg];
[SF Symbols license terms][ios-sym-lic]; [SIL Open Font License][ios-ofl].

- Synthesis: the video's titles, the thumbnail, and the gallery's captions are
  set in Atkinson Hyperlegible Next, giving the app and the pitch one voice.
  The video also "must not include third party trademarks" without permission
  ([Official Rules][shipaton-rules]); the OFL asks no on-screen credit for
  artwork, and Settings' licenses screen carries the font's notice
  ([iOS design notes][ios-ofl]).

[ios-ofl]: /docs/research/ios-design.md#the-sil-open-font-license

## Color for Turn

Apple's HIG and UIKit docs, React Native's source, and Apple's user guides own
these facts. Semantic colors, contrast rules, `PlatformColor`, and
`DynamicColorIOS` with `highContrastLight` and `highContrastDark` are in the
[iOS design notes][ios-rn-colors].

[ios-rn-colors]: /docs/research/ios-design.md#colors-in-react-native

### System colors and grays

Apple publishes values only for the 12 system colors and six grays, and
"Documented color values are for your reference during the app design
process." ([Color][hig-color]) The [iOS design notes][ios-sys-colors] give
eight of the colors; the other four and the grays follow.

| Color  | Light         | Dark          | IC light      | IC dark       | Light on white | IC light on white | Dark on black |
| ------ | ------------- | ------------- | ------------- | ------------- | -------------- | ----------------- | ------------- |
| Mint   | 0, 200, 179   | 0, 218, 195   | 0, 133, 117   | 84, 223, 203  | 2.12           | 4.55              | 11.82         |
| Teal   | 0, 195, 208   | 0, 210, 224   | 0, 129, 152   | 59, 221, 236  | 2.16           | 4.57              | 11.30         |
| Cyan   | 0, 192, 232   | 60, 211, 254  | 0, 126, 174   | 109, 217, 255 | 2.16           | 4.57              | 11.94         |
| Brown  | 172, 127, 94  | 183, 138, 102 | 149, 109, 81  | 219, 166, 121 | 3.53           | 4.58              | 6.84          |
| Gray   | 142, 142, 147 | 142, 142, 147 | 108, 108, 112 | 174, 174, 178 | 3.26           | 5.23              | 6.44          |
| Gray 2 | 174, 174, 178 | 99, 99, 102   | 142, 142, 147 | 124, 124, 128 | 2.21           | 3.26              | 3.51          |
| Gray 3 | 199, 199, 204 | 72, 72, 74    | 174, 174, 178 | 84, 84, 86    | 1.68           | 2.21              | 2.30          |
| Gray 4 | 209, 209, 214 | 58, 58, 60    | 188, 188, 192 | 68, 68, 70    | 1.52           | 1.89              | 1.85          |
| Gray 5 | 229, 229, 234 | 44, 44, 46    | 216, 216, 220 | 54, 54, 56    | 1.26           | 1.42              | 1.51          |
| Gray 6 | 242, 242, 247 | 28, 28, 30    | 235, 235, 240 | 36, 36, 38    | 1.12           | 1.19              | 1.23          |

RGB values from the HIG ([Color][hig-color]); the ratio columns are Synthesis,
computed with WCAG's formula ([WCAG notes][ios-wcag]).

- Synthesis, computed the same way for all 12 colors: white text on a default
  light fill passes 4.5 to 1 only on Indigo (5.09); Blue gives 3.52 and Green
  2.22, while every increased contrast light fill passes, from 4.54 to 6.12.
  So a fill under white text is a custom token or an increased contrast value,
  and phrase buttons take an edge at least as strong as Gray in light and
  Gray 2 in dark, the weakest grays that reach 3 to 1.

[ios-sys-colors]: /docs/research/ios-design.md#semantic-and-system-colors
[ios-wcag]: /docs/research/ios-design.md#wcag-22-contrast-minimums

### Colors and settings in React Native 0.86

| Setting                       | React Native query            | Change event                | Behind it                                    |
| ----------------------------- | ----------------------------- | --------------------------- | -------------------------------------------- |
| VoiceOver                     | `isScreenReaderEnabled`       | `screenReaderChanged`       | `UIAccessibilityIsVoiceOverRunning`          |
| Reduce Motion                 | `isReduceMotionEnabled`       | `reduceMotionChanged`       | `UIAccessibilityIsReduceMotionEnabled`       |
| Prefer Cross-Fade Transitions | `prefersCrossFadeTransitions` | None                        | `UIAccessibilityPrefersCrossFadeTransitions` |
| Reduce Transparency           | `isReduceTransparencyEnabled` | `reduceTransparencyChanged` | `UIAccessibilityIsReduceTransparencyEnabled` |
| Increase Contrast             | `isDarkerSystemColorsEnabled` | `darkerSystemColorsChanged` | `UIAccessibilityDarkerSystemColorsEnabled`   |
| Bold Text                     | `isBoldTextEnabled`           | `boldTextChanged`           | `UIAccessibilityIsBoldTextEnabled`           |
| Grayscale and Color Filters   | `isGrayscaleEnabled`          | `grayscaleChanged`          | `UIAccessibilityIsGrayscaleEnabled`          |
| Classic Invert                | `isInvertColorsEnabled`       | `invertColorsChanged`       | `UIAccessibilityIsInvertColorsEnabled`       |
| Text size                     | `PixelRatio.getFontScale()`   | Window dimensions change    | Content size category notification           |
| Differentiate Without Color   | None                          | None                        | `shouldDifferentiateWithoutColor`            |
| Show Borders                  | None                          | None                        | `AccessibilitySettings.showBordersEnabled`   |
| Reduce Bright Effects         | None                          | None                        | `isReduceHighlightingEffectsEnabled`         |

Sources for the table: [AccessibilityInfo.js][rn-a11yinfo-src];
[RCTAccessibilityManager.mm][rn-a11y-mgr];
[shouldDifferentiateWithoutColor][doc-differentiate];
[showBordersEnabled][doc-show-borders-ax];
[isReduceHighlightingEffectsEnabled][doc-reduce-highlighting].

- Synthesis: one settings store subscribes to every event above at launch and
  never keeps a stale value. Color tokens are `DynamicColorIOS` values with all
  four variants, so Increase Contrast needs no JavaScript; the store serves
  motion, weight, and layout.

[doc-differentiate]: https://developer.apple.com/documentation/uikit/uiaccessibility/shoulddifferentiatewithoutcolor
[doc-reduce-highlighting]: https://developer.apple.com/documentation/accessibility/accessibilitysettings/isreducehighlightingeffectsenabled

### Show Borders, color alone, and Smart Invert

- **Show Borders.** "You can make onscreen elements—like controls, buttons,
  and the Control Center—easier to see by adding a border around them."
  ([Make onscreen elements easier to see][ug-borders]) The Accessibility
  framework reads it from iOS 26.1 ([showBordersEnabled][doc-show-borders-ax]),
  UIKit's `buttonShapesEnabled` is deprecated from 26.1
  ([buttonShapesEnabled][doc-button-shapes]), and SwiftUI's version asks to
  "draw interactive custom controls such as buttons with clearly visible edges"
  ([accessibilityShowBorders][doc-show-borders]).
- **Color alone.** "Some screen items rely on color to convey information. You
  can replace these with alternative ways to tell them apart, like shapes or
  text." ([Change display colors][ug-colors])
- **Two inverts.** "Smart Invert: Reverse colors everywhere except images."
  "Classic Invert: Reverse all the colors onscreen." ([Change display
  colors][ug-colors]) The UIKit call React Native uses "indicates whether the
  Classic Invert setting is in an enabled state"
  ([isInvertColorsEnabled][doc-invert]). React Native's iOS prop
  `accessibilityIgnoresInvertColors` keeps a view from inverting
  ([Accessibility][rn-a11y]); Apple suggests it for "photos, videos and app
  icons" ([Make your app visually accessible][wwdc20-10020]).
- Synthesis: Turn doesn't need to read either setting: [A11Y-6 and
  A11Y-7][prd-a11y] already ask for 3 to 1 edges and no state by color alone,
  so every button keeps a visible edge and every state a word or a shape. Turn
  has no photos, so Smart Invert users get an inverted Turn, as they chose.

[ug-colors]: https://support.apple.com/guide/iphone/change-display-colors-iph3e2e1fb0/27/ios/27
[doc-invert]: https://developer.apple.com/documentation/uikit/uiaccessibility/isinvertcolorsenabled
[rn-a11y]: https://reactnative.dev/docs/0.86/accessibility

## Motion and haptics for Turn

Apple's HIG, UIKit and AVFAudio docs, and user guides own these facts, with
React Native's and Expo's source. Reanimated 4.5.1's Reduce Motion behavior,
springs, and CSS animations are in the [iOS design notes][ios-rea-rm].

### Motion when buttons stay put

- **Apple's rules.** "In apps, generally avoid adding motion to UI
  interactions that occur frequently." "System components might also adjust
  their motion in response to factors like accessibility settings or different
  input methods." ([Motion][hig-motion]) Under Reduce Motion, apps reduce
  "automatic and repetitive animations, including zooming, scaling, and
  peripheral motion" ([Accessibility][hig-accessibility]).
- Synthesis: a slot's new phrase fades in place with no movement or scaling,
  the big button takes the six slots' frame, the grid never animates, and under
  Reduce Motion all of it switches instantly, keeping each phrase where a
  finger, pointer, or gaze left it ([AAC notes on dwell][aac-eye]).

[hig-motion]: https://developer.apple.com/design/human-interface-guidelines/motion
[hig-accessibility]: https://developer.apple.com/design/human-interface-guidelines/accessibility

### Reduce Motion in Reanimated and React Native

- **Reanimated reads it once.** `useReducedMotion()` and `ReduceMotion.System`
  keep the setting from launch, `ReducedMotionConfig` overrides it app-wide,
  layout animations under it jump to their end, and CSS animations ignore it
  ([iOS design notes][ios-rea-rm]); React Native's `reduceMotionChanged`
  follows it, but `prefersCrossFadeTransitions()` has no event
  ([AccessibilityInfo.js][rn-a11yinfo-src]).
- **Navigation.** The iOS code of react-native-screens 4.26.2 has no Reduce
  Motion or cross-fade branch ([react-native-screens 4.26.2][rns-4262]); for
  UIKit's own navigation controller, "this work already comes for free"
  ([Make your app visually accessible][wwdc20-10020]).
- Synthesis: one motion preference, from `AccessibilityInfo` and its event,
  decides every animation; fades that must survive Reduce Motion set
  `reduceMotion: ReduceMotion.Never`, and everything else skips to its end.

### A pulsing listening light

- **iOS's own light.** "An orange indicator appears whenever an app uses the
  microphone without the camera." ([Control access to hardware
  features][ug-hardware])
- **Symbol effects for activity.** Pulse is for "ongoing activity, playing it
  continuously until a condition is met", and "pulse animates by changing
  opacity alone, while breathe changes both opacity and size"
  ([SF Symbols][hig-sf-symbols]). `expo-symbols` 57.0.3 maps `pulse` on iOS 17
  and later ([iOS design notes][ios-expo-symbols]), and its iOS code never reads
  Reduce Motion ([expo-symbols iOS source][gh-symbols-ios]).
- Synthesis: the light is the word "Listening" ([CONSENT-5][prd-consent]), a
  microphone symbol, and an orange-family color that echoes iOS's indicator
  and never the camera's green; it pulses by opacity only, and under Reduce
  Motion, read live, it stays fully visible and still ([A11Y-6][prd-a11y]).

[ug-hardware]: https://support.apple.com/guide/iphone/control-access-to-hardware-features-iph168c4bbd5/27/ios/27
[hig-sf-symbols]: https://developer.apple.com/design/human-interface-guidelines/sf-symbols
[gh-symbols-ios]: https://github.com/expo/expo/tree/sdk-57/packages/expo-symbols/ios

### Haptics while Turn listens or speaks

- **Recording silences haptics.** `allowHapticsAndSystemSoundsDuringRecording`
  says "whether system sounds and haptics play while recording from audio
  input", and "The default value of this property is false."
  ([allowHapticsAndSystemSoundsDuringRecording][doc-haptics-recording])
- **The HIG's caution.** "Ensure that haptic vibrations don’t disrupt
  experiences involving device features like the camera, gyroscope, or
  microphone." "Make haptics optional." ([Playing haptics][hig-haptics])
- **The system decides.** Haptics play "When the system Haptics setting is
  on" ([Playing haptic feedback in your app][doc-playing-haptics]), a switch
  under Sounds & Haptics ([Change sounds and vibrations][ug-sounds]), and
  `expo-haptics` adds Low Power Mode and dictation ([iOS design
  notes][ios-haptics]).
- Synthesis: Listen mode runs `.playAndRecord` ([TRD][trd-audio]), so Turn
  leaves the property false and plays no haptics there, where a vibration could
  also reach the transcript. Elsewhere a phrase's feedback is its speech and
  pressed state, and no haptic carries meaning
  ([Apple requirements notes][apple-haptics]).

[doc-haptics-recording]: https://developer.apple.com/documentation/avfaudio/avaudiosession/allowhapticsandsystemsoundsduringrecording
[hig-haptics]: https://developer.apple.com/design/human-interface-guidelines/playing-haptics
[doc-playing-haptics]: https://developer.apple.com/documentation/applepencil/playing-haptic-feedback-in-your-app
[ug-sounds]: https://support.apple.com/guide/iphone/change-sounds-and-vibrations-iph07c867f28/27/ios/27
[ios-haptics]: /docs/research/ios-design.md#haptics-in-expo
[trd-audio]: /docs/TRD.md#the-audio-session
[apple-haptics]: /docs/research/apple-requirements.md#haptics-rules

## SF Symbols for Turn

Apple's SF Symbols page and app, and the HIG, own these facts. `expo-symbols`
props, effects by iOS version, and license terms are in the
[iOS design notes][ios-sym-lic].

### The SF Symbols release for iOS 27

- **The page.** "SF Symbols is a library of over 7,000 symbols", and "These new
  symbols are available in apps running iOS 27" and Apple's other 27 releases
  ([SF Symbols][sf-symbols]).
- **The app.** The installer, `SF-Symbols-27.dmg`, holds an app whose version
  is 27.0, still under license EA1662; its availability table lists 9,524
  names, 340 of them new in iOS 27 ([SF Symbols download][sf-symbols-dmg]).
- Synthesis: `expo-symbols` draws nothing for a name the system lacks, so the
  340 new names are off limits on an iOS 26 target; and since its symbol sizes
  are fixed in points ([iOS design notes][ios-expo-symbols]), Turn multiplies
  them by the font scale, as text does.

[sf-symbols]: https://developer.apple.com/sf-symbols/

### Symbols for speaking, listening, and answering

| Meaning in Turn      | Symbol                                | First iOS |
| -------------------- | ------------------------------------- | --------- |
| Speak                | `speaker.wave.2`                      | 14        |
| A partner speaking   | `person.wave.2`                       | 15        |
| Listening            | `ear`, `ear.badge.waveform`           | 13, 17    |
| A waveform           | `waveform`                            | 13        |
| Microphone, paused   | `mic.fill`, `mic.slash`               | 13        |
| Yes, no              | `hand.thumbsup`, `hand.thumbsdown`    | 13        |
| Not sure, a question | `questionmark`, `questionmark.bubble` | 13, 16    |
| Stop                 | `stop.fill`                           | 13        |
| Repeat               | `arrow.counterclockwise`              | 13        |
| Keyboard             | `keyboard`                            | 13        |
| A place              | `mappin.and.ellipse`, `house`         | 13        |
| Clinic, shop         | `cross.case`, `cart`                  | 14, 13    |
| Wait, I'm typing     | `hand.raised`                         | 13        |
| Something's wrong    | `exclamationmark.triangle`            | 13        |
| Undo                 | `arrow.uturn.backward`                | 14        |

Source for the table: the availability table in the SF Symbols 27.0 app
([SF Symbols download][sf-symbols-dmg]).

- **Standard meanings.** The HIG's table of common actions gives `checkmark`
  for Done, `xmark` for Cancel, and `arrow.uturn.backward` for Undo
  ([Icons][hig-icons]). At WWDC26: "If you use a trash can icon to mean
  something other than delete, it goes against people's familiarity with what
  this symbol represents, in other software." ([Principles of great
  design][wwdc26-250])
- **New and tagged.** `waveform.and.person`, `person.wave.2.inward`, and
  `text.bubble.badge.sparkles` need iOS 27, and the app's search keywords for
  `sparkles` include "magic" and "enhance" ([SF Symbols
  download][sf-symbols-dmg]).
- Synthesis: Yes, No, and Not sure are words first; `checkmark` and `xmark`
  would collide with Done and Close in the same app, so the thumbs or no symbol
  fit better, a choice for the [AAC design notes][sib-aac-design]. No sparkles
  anywhere, since Turn never writes a word
  ([product principles][product-principles]).

[hig-icons]: https://developer.apple.com/design/human-interface-guidelines/icons
[wwdc26-250]: https://developer.apple.com/videos/play/wwdc2026/250/

## App icon and launch screen for Turn

Apple's HIG, Icon Composer page and docs, and the Xcode 27 release notes own
the icon facts, and Expo's docs the SDK 57 side. Icon Composer basics,
prebuild's handling of `.icon`, and launch screen rules are in the
[iOS design notes][ios-icons].

[ios-icons]: /docs/research/ios-design.md#ios-26-icons-and-icon-composer

### Icon appearances and Icon Composer 2

- **The appearances.** iOS icons are "1024x1024 px", layered, in "Default,
  dark, clear light, clear dark, tinted light, tinted dark"; since June 2026
  the HIG adds "Prefer vector graphics when bringing layers into Icon
  Composer." ([App icons][hig-app-icons])
- **Icon Composer 2.** "Icon Composer 2.0 supports a new sharper rendering
  mode for upcoming 2027 operating systems with support for refractivity,
  outside specular, and deeper shadows." "When your icon looks great in both
  design generations, add it to your Xcode project to use it with all OS
  versions." ([Xcode 27 release notes][doc-xcode27]) Before 27, "Refraction
  settings have no visible effect." ([Creating your app icon using Icon
  Composer][doc-icon-composer])
- **The app.** It "Requires macOS Tahoe 26.4 or later." and "provides the
  option to export a flattened version of your icon for marketing and
  communication needs" ([Icon Composer][icon-composer]).
- **In Expo.** "Providing an Icon Composer .icon directory via ios.icon is
  supported in SDK 54 and later."
  ([Splash screen and app icon][expo-icons-guide]) Prebuild's handling is in
  the [iOS design notes][ios-icons-expo].
- Synthesis: `ios.icon` points at `./assets/turn.icon`, a mark of Turn's own in
  two or three vector layers, with no SF Symbol, annotated for default, dark,
  and mono; its flattened export is Shipaton's 1024 by 1024 icon.

[hig-app-icons]: https://developer.apple.com/design/human-interface-guidelines/app-icons
[doc-icon-composer]: https://developer.apple.com/documentation/xcode/creating-your-app-icon-using-icon-composer
[icon-composer]: https://developer.apple.com/icon-composer/
[expo-icons-guide]: https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/
[ios-icons-expo]: /docs/research/ios-design.md#icons-in-expo

### The launch screen in Expo SDK 57

- **Not a billboard.** "Avoid using a launch screen as a branding
  opportunity." ([Branding][hig-branding]) The `expo-splash-screen` 57.0.9
  options and the `dark` object are in the [iOS design notes][ios-launch].
- **Light unless set.** Without `userInterfaceStyle`, Expo writes `Light` into
  Info.plist ([iOS design notes][ios-dark]), and the TRD's build configuration
  sets none ([build configuration][trd-build]).
- Synthesis: `userInterfaceStyle: 'automatic'`, a splash that is the grid's
  background color in light and dark with no image, and no appearance setting
  of Turn's own.

[ios-launch]: /docs/research/ios-design.md#launch-screens

## RevenueCat's paywall for Turn

RevenueCat's docs and the purchases-ios 5.90.1 source own these facts.
Presenting the paywall and its buttons is in the [RevenueCat notes][rc-present],
and the editor, fonts, and presentation in the
[iOS design notes][ios-pw-editor].

[rc-present]: /docs/research/revenuecat-expo.md#presenting-a-paywall
[ios-pw-editor]: /docs/research/ios-design.md#what-the-paywall-editor-sets

### What the paywall editor styles

- **Changed on the page.** "Uploaded font files must be smaller than 5MB. We
  recommend keeping them under 2MB to ensure optimal loading performance."
  Images can now be set "as a decorative image that does not require a
  description", and the advice on bundling a font names only Android
  ([Components][rc-components]). The paywall changelog's newest entry is
  January 13, 2026 ([Paywalls changelog][rc-changelog]).
- **Google Fonts don't reach iOS.** A `googleFonts` font entry logs
  `googleFontsNotSupported` and falls back; a named font resolves with
  `UIFont(name:)`, so a bundled font is found before any download
  ([UIConfigProvider.swift][rc-uiconfig]; [iOS design notes][ios-pw-fonts]).
  Synthesis: upload the Atkinson Hyperlegible Next files Turn embeds, so the
  paywall matches the app and never waits for a font.

[rc-changelog]: https://www.revenuecat.com/docs/tools/paywalls/change-log

### Dynamic Type, VoiceOver, and Reduce Motion in paywalls

| Setting                                           | purchases-ios 5.90.1                                                                                       |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Dynamic Type                                      | On unless the dashboard sets `automatically_scale_font_size` false; custom fonts scale relative to a style |
| Size bands                                        | 34 points and up follow Large Title, 17 to 20 Headline, 15 to 17 Body, under 13 Footnote                   |
| VoiceOver, images                                 | Hidden, whatever the alt text                                                                              |
| VoiceOver, buttons                                | An icon-only Navigate back reads "Close" or "Go back", and Restore "Restore purchases"                     |
| Reduce Motion                                     | Video doesn't autoplay, and multipage transitions are skipped                                              |
| Reduce Motion, ignored                            | Carousel auto-advance and component transitions                                                            |
| Increase Contrast, Bold Text, Reduce Transparency | Nothing in the V2 paywall views reads them                                                                 |

Sources for the table: [UIConfigProvider.swift][rc-uiconfig] and the other
views under [RevenueCatUI's V2 templates][rc-v2-dir].

- **The fallback close button.** When the SDK draws its own, it's a circle on
  `.ultraThinMaterial`, a standard material, labeled "Dismiss"
  ([RevenueCatUI's V2 templates][rc-v2-dir]).
- Synthesis: Turn's paywall is text, one package, a purchase button, Navigate
  back, Restore Purchases, and the legal links, with no carousel, video,
  transition, or text in an image; its colors pass 4.5 to 1 without Increase
  Contrast, and every color has a dark value.

### The paywall under Test Store

- **What people see.** "Instead of invoking the system in-app purchase flow,
  your app will present a modal with metadata about the product being
  purchased, along with buttons to simulate a successful purchase, a failed
  purchase, or cancel the purchase entirely." ([Test Store][rc-test-store]) Its
  text is in the [services notes][svc-sheet]; as a UIKit alert, it's glass.
- **Fixed prices.** "You cannot edit an existing product's identifier,
  duration, or price in the dashboard after it has been saved" ([Test
  Store][rc-test-store]), so the paywall shows $24.99 until a new product
  replaces it ([PAY-3][prd-pay]).
- Synthesis: the alert stands in for the confirmation sheet the HIG asks apps
  not to replicate ([Apple In-App Purchase][hig-iap]), so the video names it as
  a test purchase, as the [services notes][svc-paywalls] plan, and DESIGN.md
  designs nothing for it.

[rc-test-store]: https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store
[prd-pay]: /docs/PRD.md#the-paywall-and-purchases
[svc-paywalls]: /docs/research/turn-services.md#paywalls-customer-center-and-restore

### Limits on matching Turn's design

- **Apple's aim.** "Present products and handle transactions in ways that
  mirror the style of your app." ([Apple In-App Purchase][hig-iap]) The paywall
  can't fully: it's a page sheet with Tabler icons, light and dark colors but
  no increased contrast ones, and no Bold Text ([iOS design
  notes][ios-pw-limits]).
- Synthesis: the paywall matches Turn in type, color, and wording, with hex
  values for light and dark taken from the app's own tokens.

[ios-pw-limits]: /docs/research/ios-design.md#limits-on-matching-the-app

## Pitch assets

Devpost, Shipaton's rules, YouTube's help center, Apple's support pages, and
Xcode's docs and release notes own these facts. App Store art and Devpost's
observed sizes are in the [iOS design notes][ios-devpost].

### Devpost images

- **No new specs.** Devpost's help article still gives specs only for the
  thumbnail, "JPG, PNG or GIF format, 5 MB max file size", with a "3:2 ratio"
  ([Know your submission steps][devpost-126]).
- **Shipaton's.** "Include a 1024x1024 app icon" and "Include at least one
  screenshot of the app with a resolution of 1179px width and 2556px height
  WITHOUT device frames." ([Official Rules][shipaton-rules])
- **Which iPhone draws that.** iPhone 16's display is 2556 by 1179 pixels at
  460 ppi ([iPhone 16 tech specs][iphone16-specs]), one of two sizes App Store
  Connect lists for 6.3 inches ([Screenshot specifications][asc-screenshots]).
- Synthesis: the screenshot comes from an iPhone 16 simulator on iOS 27, added
  in Device Hub, at native size; the icon is Icon Composer's flattened export;
  and the thumbnail is 3:2 with Turn's mark centered.

[devpost-126]: https://help.devpost.com/article/126-know-your-submission-steps
[iphone16-specs]: https://support.apple.com/en-us/121029
[asc-screenshots]: https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications

### YouTube thumbnails and captions

- **Thumbnails.** YouTube recommends "a resolution of 3840 x 2160 pixels for
  videos", "a minimum width of 640 pixels", "JPG or PNG", and "an aspect ratio
  of 16:9", and custom ones need a verified account: "upload your own if your
  account is verified." "Vertical videos with 16:9 custom thumbnails will be
  replaced by an auto-generated 4:5 thumbnail on the home, explore, and
  subscription pages." ([Add custom thumbnails][yt-thumbs])
- **Captions.** For SubRip `.srt`, "The file must be in plain UTF-8."
  ([Supported subtitle and closed caption files][yt-caption-files]) "Always
  review automatic captions and edit any parts that haven't been properly
  transcribed." ([Use automatic captioning][yt-auto-captions])
- Synthesis: the video is 16:9 with the portrait screen inside it, matching
  Devpost's 16:9 embed ([iOS design notes][ios-devpost]), and carries an `.srt`
  written from the script, since synthesized speech and an off-camera partner
  are what automatic captions get wrong.

[yt-thumbs]: https://support.google.com/youtube/answer/72431
[yt-caption-files]: https://support.google.com/youtube/answer/2734698
[yt-auto-captions]: https://support.google.com/youtube/answer/6373554

### Simulator screenshots and recordings in Xcode 27

- **Device Hub.** "Device Hub captures the screenshot at the full resolution of
  the simulated or physical device, regardless of the display resolution of
  your Mac." It records video from simulated devices, to the Desktop
  ([Capturing screenshots and videos from devices][doc-hub-capture]).
- **Not for Listen mode.** "You can’t access the camera or microphone while
  interacting with a physical device in Device Hub." ([Interacting with your
  app in Device Hub][doc-hub-interact])
- **`simctl` still ships.** "`simctl` and `devicectl` now support rebooting a
  simulator using the reboot command." ([Xcode 27 release notes][doc-xcode27])
  WWDC20 records video with the first command below, which uses H.264 "instead
  of the HEVC codec" and records "the entire rectangular frame buffer"
  ([Become a Simulator expert][wwdc20-10647]).

```shell
xcrun simctl io booted recordVideo --codec h264 --mask ignored turn-demo.mp4
xcrun simctl io booted screenshot turn-row.png
```

- Synthesis: the screenshot line follows the same pattern, though no Apple
  page shows `io screenshot`'s arguments; gallery screenshots and the video's
  Simulator shots come from the simulator, and Listen mode is filmed on the
  demo iPhone itself.

[doc-hub-capture]: https://developer.apple.com/documentation/xcode/capturing-screenshots-and-videos-from-devices
[doc-hub-interact]: https://developer.apple.com/documentation/xcode/interacting-with-your-app-in-device-hub

### Clean status bars

- **The command.** "`simctl` can now override status bar values for iOS
  devices." ([Xcode 11 release notes][doc-xcode11]) WWDC20 adds `clear` to
  remove the overrides ([Become a Simulator expert][wwdc20-10647]).
- **A known issue.** "Status bar overrides may be set incorrectly when using
  the iOS 14 or later simulator runtime." No later release note marks it
  fixed, and Xcode 27's notes don't mention the command
  ([Xcode 15 release notes][doc-xcode15]).

```shell
xcrun simctl status_bar booted override --time "9:41" --batteryState charged --batteryLevel 100
xcrun simctl status_bar booted clear
```

- Synthesis: set the override before each capture and check every screenshot,
  since the issue was never closed; the demo iPhone's footage shows its real
  status bar.

[doc-xcode11]: https://developer.apple.com/documentation/xcode-release-notes/xcode-11-release-notes
[doc-xcode15]: https://developer.apple.com/documentation/xcode-release-notes/xcode-15-release-notes

## Conflicts between sources

- **The SF Symbols name.** Apple's June 8, 2026 entry offered "SF Symbols 8
  beta", while the released installer is `SF-Symbols-27.dmg` with an app
  version of 27.0 ([What's new in design][hig-whats-new];
  [SF Symbols download][sf-symbols-dmg]).
- **Button Shapes and Show Borders.** UIKit's deprecated `buttonShapesEnabled`
  still describes "the Button Shapes setting"
  ([buttonShapesEnabled][doc-button-shapes]), the iOS 27 user guide names only
  Show Borders ([Make onscreen elements easier to see][ug-borders]), and
  SwiftUI back-deploys `accessibilityShowBorders` to iOS 14
  ([accessibilityShowBorders][doc-show-borders]).
- **Bar minimization names.** WWDC26 names `barMinimizationSafeAreaAdjustment`
  on the navigation item, while the iOS 27 docs list `navigationBarMinimization`
  ([Modernize your UIKit app][wwdc26-278];
  [navigationBarMinimization][doc-nav-minimization]).
- **Atkinson Hyperlegible Next's weights and date.** Braille Institute's
  comparison says "seven weights—Light to Extrabold", its install notes start
  at ExtraLight, and the type repository says the "two previous weights has
  increased to six" ([Braille Institute][bi-freefont];
  [atkinson-hyperlegible-next][ahn-repo]). The repository dates its first
  release November 20, 2024, Google Fonts added it January 7, 2025, and Braille
  Institute announced it February 10, 2025 ([METADATA.pb][gf-ahn-meta];
  [Braille Institute][bi-next-pr]).
- **iOS 27's system colors.** Apple's iOS 27 kit for Figma, posted September
  17, 2026, "includes updated components, system colors, and app icons", while
  the HIG's color values last changed on June 9, 2025
  ([What's new in design][hig-whats-new]; [Color][hig-color]).
- **Bundling a paywall font.** The [iOS design notes][ios-pw-fonts] quote an
  iOS instruction the components page no longer carried on September 23, 2026;
  the SDK still looks for an installed font by name first
  ([Components][rc-components]; [UIConfigProvider.swift][rc-uiconfig]).
- **Reduce Motion in paywalls.** The docs name only video autoplay
  ([Components][rc-components]); the source also skips multipage transitions
  and lets carousels and component transitions run
  ([RevenueCatUI's V2 templates][rc-v2-dir]).
- **The row and large text.** [ROW-1][prd-row] fixes the row's height, while
  [A11Y-4][prd-a11y] and the HIG ask for wrapped text at every size and fewer
  columns at large ones ([Typography][hig-typography]).
- **Dark Mode.** The TRD sets no `userInterfaceStyle` ([build
  configuration][trd-build]), so Expo forces the light style
  ([iOS design notes][ios-dark]), against the HIG's Dark Mode guidance and
  Apple's Dark Interface label ([Apple requirements notes][apple-labels]).

[ahn-repo]: https://github.com/googlefonts/atkinson-hyperlegible-next

## Gaps

What no source settled on September 23, 2026:

- **Glass.** No API reports the Liquid Glass slider, no Apple page says
  outright that the keyboard is glass, and whether iOS 27 minimizes a React
  Native navigation bar by default, in its "certain conditions", is untested.
- **Motion.** Whether SF Symbols effects stop under Reduce Motion, and whether
  react-native-screens' push follows Prefer Cross-Fade Transitions.
- **Type.** Whether React Native's system text, or the paywall's, thickens with
  Bold Text.
- **Color.** Apple publishes no values for `label`, the backgrounds, or the
  fills, and none for iOS 27 if they changed.
- **Resizing.** How a portrait-locked iPhone app behaves on iPhone Duo's inner
  display or in Split View there.
- **Tools.** This Mac has no Xcode, so `simctl` and Device Hub weren't run, and
  no Apple page shows the arguments of `io screenshot`.
- **Filming.** Whether an iPhone screen recording with its microphone on can
  run while Turn transcribes, and how the Test Store alert looks in the iOS 27
  simulator ([services notes][svc-simulator]).

[svc-simulator]: /docs/research/turn-services.md#test-store-in-debug-builds-and-the-simulator

## See also

- [DESIGN.md][design-md], fed by this note and the parallel
  [motionsites.ai][sib-motionsites], [frontend trends][sib-trends], and
  [AAC design][sib-aac-design] notes.
- The [iOS design notes][ios-design], the [iPhone build notes][turn-ios], and
  the [AAC practice notes][aac-notes], especially
  [iOS access features AAC users rely on][aac-access] and
  [React Native's accessibility API][aac-rn].
- The [Apple requirements notes][apple-labels], and the PRD's
  [accessibility][prd-a11y] requirements and the TRD's
  [accessibility in the app][trd-a11y].

[sib-motionsites]: /docs/research/turn-motionsites.md
[sib-trends]: /docs/research/turn-frontend-trends.md
[aac-access]: /docs/research/aac-practice.md#ios-access-features-aac-users-rely-on
[aac-rn]: /docs/research/aac-practice.md#react-natives-accessibility-api
[trd-a11y]: /docs/TRD.md#accessibility-in-the-app
[design-md]: /docs/DESIGN.md
[ios-design]: /docs/research/ios-design.md
[turn-ios]: /docs/research/turn-ios.md
[aac-notes]: /docs/research/aac-practice.md
[wwdc26-102]: https://developer.apple.com/videos/play/wwdc2026/102/
[kb-ios26-updates]: https://support.apple.com/en-us/123075
[ug-display-27]: https://support.apple.com/guide/iphone/adjust-iphone-display-and-text-settings-iphd6804774e/27/ios/27
[ios-lg-custom]: /docs/research/ios-design.md#glass-in-custom-controls
[wwdc26-278]: https://developer.apple.com/videos/play/wwdc2026/278/
[hig-layout]: https://developer.apple.com/design/human-interface-guidelines/layout
[doc-hub-env]: https://developer.apple.com/documentation/xcode/configuring-the-environment-of-a-simulated-device
[doc-nav-minimization]: https://developer.apple.com/documentation/uikit/uinavigationitem/navigationbarminimization-1kj9z
[rns-4262]: https://github.com/software-mansion/react-native-screens/tree/4.26.2/ios
[prd-row]: /docs/PRD.md#the-reply-row
[hig-whats-new]: https://developer.apple.com/design/whats-new/
[product-principles]: /docs/PRODUCT.md#product-principles
[hig-branding]: https://developer.apple.com/design/human-interface-guidelines/branding
[prd-consent]: /docs/PRD.md#permission-and-consent
[ios-dt-sizes]: /docs/research/ios-design.md#dynamic-type-sizes
[hig-typography]: https://developer.apple.com/design/human-interface-guidelines/typography
[sf-pro-dmg]: https://devimages-cdn.apple.com/design/resources/download/SF-Pro.dmg
[aac-eye]: /docs/research/aac-practice.md#dwell-eye-tracking-and-head-tracking
[ug-borders]: https://support.apple.com/guide/iphone/make-onscreen-elements-easier-to-see-zokq2zmg6rn1/27/ios/27
[apple-labels]: /docs/research/apple-requirements.md#what-each-label-claims
[gh-router-formsheet]: https://github.com/expo/expo/blob/7687b07947a5c866adeb11abbceae72403ccb188/packages/expo-router/src/fork/native-stack/createNativeStackNavigator.tsx
[svc-sheet]: /docs/research/turn-services.md#the-test-store-purchase-sheet
[rn-a11yinfo]: https://reactnative.dev/docs/0.86/accessibilityinfo
[wwdc26-251]: https://developer.apple.com/videos/play/wwdc2026/251/
[ios-rn-scale]: /docs/research/ios-design.md#how-react-native-scales-text
[prd-a11y]: /docs/PRD.md#accessibility
[ios-expo-font]: /docs/research/ios-design.md#fonts-bundled-with-expo-font
[rn-a11y-mgr]: https://github.com/react/react-native/blob/v0.86.3/packages/react-native/React/CoreModules/RCTAccessibilityManager.mm
[wwdc20-10020]: https://developer.apple.com/videos/play/wwdc2020/10020/
[bi-next-pr]: https://www.brailleinstitute.org/about-us/news/braille-institute-launches-enhanced-atkinson-hyperlegible-font-to-make-reading-easier/
[bi-freefont]: https://www.brailleinstitute.org/freefont/
[gf-ahn-meta]: https://github.com/google/fonts/blob/main/ofl/atkinsonhyperlegiblenext/METADATA.pb
[ios-sym-lic]: /docs/research/ios-design.md#sf-symbols-license-terms
[shipaton-rules]: https://revenuecat-shipaton-2026.devpost.com/rules
[hig-color]: https://developer.apple.com/design/human-interface-guidelines/color
[rn-a11yinfo-src]: https://github.com/react/react-native/blob/v0.86.3/packages/react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo.js
[doc-show-borders-ax]: https://developer.apple.com/documentation/accessibility/accessibilitysettings/showbordersenabled
[doc-button-shapes]: https://developer.apple.com/documentation/uikit/uiaccessibility/buttonshapesenabled
[doc-show-borders]: https://developer.apple.com/documentation/swiftui/environmentvalues/accessibilityshowborders
[ios-rea-rm]: /docs/research/ios-design.md#reduce-motion-in-reanimated
[ios-expo-symbols]: /docs/research/ios-design.md#expo-symbols-in-sdk-57
[sf-symbols-dmg]: https://devimages-cdn.apple.com/design/resources/download/SF-Symbols-27.dmg
[sib-aac-design]: /docs/research/aac-design.md
[doc-xcode27]: https://developer.apple.com/documentation/xcode-release-notes/xcode-27-release-notes
[ios-dark]: /docs/research/ios-design.md#dark-mode-in-the-app-config
[trd-build]: /docs/TRD.md#build-configuration
[rc-components]: https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls/components
[rc-uiconfig]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/RevenueCatUI/Templates/V2/ViewModelHelpers/UIConfigProvider.swift
[ios-pw-fonts]: /docs/research/ios-design.md#fonts-and-text-size-in-paywalls
[rc-v2-dir]: https://github.com/RevenueCat/purchases-ios/tree/5.90.1/RevenueCatUI/Templates/V2
[hig-iap]: https://developer.apple.com/design/human-interface-guidelines/apple-in-app-purchase
[ios-devpost]: /docs/research/ios-design.md#devpost-gallery-and-thumbnail
[wwdc20-10647]: https://developer.apple.com/videos/play/wwdc2020/10647/

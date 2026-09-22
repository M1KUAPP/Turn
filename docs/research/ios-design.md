# iOS design research notes

What iOS 26 and Guessling's stack, Expo SDK 57 on iOS 16.4 and later, make
possible and require for the app's look: Liquid Glass, type, color, motion and
haptics, the icon and launch screen, SF Symbols, the RevenueCat paywall, and the
art for the App Store and Devpost. These notes feed `docs/DESIGN.md`, the design
system and art direction, and check the plan in the
[TRD's iPhone app section][trd-app] against the sources. Every source was read
on September 22, 2026, so versions are as of that date, and judgment starts with
"Synthesis:". What the [Apple notes][apple-notes] already hold on haptics,
sound, sharing, and Accessibility Nutrition Labels, and what the
[RevenueCat notes][rc-notes] hold on presenting a paywall and its buttons, is
linked, not repeated.

Contents:

1.  [Sources and method](#sources-and-method)
    1.  [Package versions in SDK 57](#package-versions-in-sdk-57)
1.  [Liquid Glass](#liquid-glass)
    1.  [What Liquid Glass is](#what-liquid-glass-is)
    1.  [System components that adopt it](#system-components-that-adopt-it)
    1.  [Glass in custom controls](#glass-in-custom-controls)
    1.  [Color and controls on glass](#color-and-controls-on-glass)
    1.  [The compatibility key](#the-compatibility-key)
    1.  [Glass views in Expo](#glass-views-in-expo)
    1.  [Headers, sheets, and tabs in Expo Router](#headers-sheets-and-tabs-in-expo-router)
    1.  [SwiftUI views through Expo UI](#swiftui-views-through-expo-ui)
    1.  [What iOS 16.4 through 18 show](#what-ios-164-through-18-show)
1.  [Typography](#typography)
    1.  [System fonts and their licenses](#system-fonts-and-their-licenses)
    1.  [System fonts in React Native](#system-fonts-in-react-native)
    1.  [Dynamic Type sizes](#dynamic-type-sizes)
    1.  [How React Native scales text](#how-react-native-scales-text)
    1.  [Fonts bundled with expo-font](#fonts-bundled-with-expo-font)
    1.  [The SIL Open Font License](#the-sil-open-font-license)
1.  [Color](#color)
    1.  [Semantic and system colors](#semantic-and-system-colors)
    1.  [Contrast in the HIG](#contrast-in-the-hig)
    1.  [Colors in React Native](#colors-in-react-native)
    1.  [Dark Mode in the app config](#dark-mode-in-the-app-config)
    1.  [WCAG 2.2 contrast minimums](#wcag-22-contrast-minimums)
1.  [Motion and haptics](#motion-and-haptics)
    1.  [Apple's motion guidance](#apples-motion-guidance)
    1.  [Reanimated 4 in SDK 57](#reanimated-4-in-sdk-57)
    1.  [CSS animations and transitions](#css-animations-and-transitions)
    1.  [Springs and layout animations](#springs-and-layout-animations)
    1.  [Reduce Motion in Reanimated](#reduce-motion-in-reanimated)
    1.  [Drawing and animating the character](#drawing-and-animating-the-character)
    1.  [Gesture Handler in SDK 57](#gesture-handler-in-sdk-57)
    1.  [Haptics in Expo](#haptics-in-expo)
    1.  [Short sounds in Expo](#short-sounds-in-expo)
1.  [App icon and launch screen](#app-icon-and-launch-screen)
    1.  [iOS 26 icons and Icon Composer](#ios-26-icons-and-icon-composer)
    1.  [Icons in Expo](#icons-in-expo)
    1.  [Launch screens](#launch-screens)
1.  [SF Symbols](#sf-symbols)
    1.  [expo-symbols in SDK 57](#expo-symbols-in-sdk-57)
    1.  [Symbol animations and iOS versions](#symbol-animations-and-ios-versions)
    1.  [SF Symbols license terms](#sf-symbols-license-terms)
1.  [RevenueCat Paywalls styling](#revenuecat-paywalls-styling)
    1.  [What the paywall editor sets](#what-the-paywall-editor-sets)
    1.  [Fonts and text size in paywalls](#fonts-and-text-size-in-paywalls)
    1.  [Paywall localization](#paywall-localization)
    1.  [Limits on matching the app](#limits-on-matching-the-app)
1.  [Store and pitch assets](#store-and-pitch-assets)
    1.  [App Store screenshots](#app-store-screenshots)
    1.  [App previews](#app-previews)
    1.  [What screenshots and previews may show](#what-screenshots-and-previews-may-show)
    1.  [Devpost gallery and thumbnail](#devpost-gallery-and-thumbnail)
1.  [Findings for DESIGN.md](#findings-for-designmd)
1.  [Conflicts between sources](#conflicts-between-sources)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## Sources and method

- **Apple.** The Human Interface Guidelines (HIG) and the developer
  documentation render in the browser, so their text came from the DocC JSON
  behind each page, and each API's minimum iOS from that JSON's availability
  data. WWDC session pages, with their transcripts, App Store Connect Help, the
  App Review Guidelines, the pages under `developer.apple.com/app-store/`, and
  Apple's Newsroom were read as served. Apple's license texts came from
  apple.com/legal and from the SF Pro, New York, SF Mono, and SF Symbols
  installers, mounted read-only and expanded without installing anything.
- **SF Symbols 7.** Apple's SF Symbols page moved on to the next release when
  iOS 27 shipped, so SF Symbols 7's own description comes from the Internet
  Archive's copy of that page from November 15, 2025 ([sf-symbols-archive]).
- **Expo.** The SDK 57 reference (`docs.expo.dev/versions/v57.0.0/`), the
  guides, the changelog, the `sdk-57` branch of `expo/expo` and the commits each
  package was published from, and each package as published on npm where the
  docs are silent. The `sdk-57` branch keeps only the Expo UI pages of the v57
  docs, so the rest were read as served and from `main`.
- **React Native.** The 0.86 docs, and the source at the `v0.86.3` tag, now at
  `github.com/react/react-native`, where `github.com/facebook/react-native`
  redirects.
- **Libraries.** Reanimated and Gesture Handler from docs.swmansion.com and
  their source at the bundled tags; Skia, Lottie, and Rive from their own docs,
  repositories, and packages; RevenueCat from its docs and the iOS code that
  `react-native-purchases-ui` 10.10.1 ships, purchases-hybrid-common 19.2.0 and
  purchases-ios 5.90.1.
- **Standards and Devpost.** WCAG 2.2 and WCAG2ICT from w3.org, the SIL Open
  Font License from openfontlicense.org, and Devpost from its help center and
  the Shipaton rules on Devpost.
- **Checks.** Every quote was checked character for character against the page's
  text by script. Nothing was run on a device or a simulator, so a claim read
  from source code says what the code does, not what was seen on a screen.
- **Versions.** The ranges below come from `bundledNativeModules.json` in the
  `expo@57.0.24` tarball on the npm registry ([npm-expo-tgz]).
  `npx expo install` asks Expo's API first: Expo CLI 57.0.26 "Tries to fetch the
  data from the /sdks/:sdkVersion/native-modules API endpoint" and falls back to
  that file ([cli-native-modules]), and the endpoint for 57.0.0 returned the
  same ranges on September 22 ([expo-api-sdk57]). The newest versions and their
  dates are the npm registry's.

[npm-expo-tgz]: https://registry.npmjs.org/expo/-/expo-57.0.24.tgz
[cli-native-modules]: https://github.com/expo/expo/blob/sdk-57/packages/@expo/cli/src/start/doctor/dependencies/bundledNativeModules.ts
[expo-api-sdk57]: https://api.expo.dev/v2/sdks/57.0.0/native-modules

### Package versions in SDK 57

| Package                        | SDK 57 range | Newest in range, published | npm `latest`, published                |
| ------------------------------ | ------------ | -------------------------- | -------------------------------------- |
| `expo`                         | Not ranged   | 57.0.24, September 18      | 57.0.24; `next` is 58.0.0-preview.4    |
| `expo-glass-effect`            | ~57.0.3      | 57.0.3, September 11       | 57.0.3                                 |
| `@expo/ui`                     | ~57.0.19     | 57.0.19, September 18      | 57.0.19                                |
| `expo-router`                  | ~57.0.22     | 57.0.22, September 18      | 57.0.22                                |
| `react-native-screens`         | ~4.26.0      | 4.26.2, July 16            | 4.28.0, September 14                   |
| `expo-font`                    | ~57.0.4      | 57.0.4, September 11       | 57.0.4                                 |
| `expo-system-ui`               | ~57.0.4      | 57.0.4, September 11       | 57.0.4                                 |
| `expo-symbols`                 | ~57.0.3      | 57.0.3, September 11       | 57.0.3                                 |
| `expo-haptics`                 | ~57.0.3      | 57.0.3, September 11       | 57.0.3                                 |
| `expo-audio`                   | ~57.0.5      | 57.0.5, September 11       | 57.0.5                                 |
| `expo-splash-screen`           | ~57.0.9      | 57.0.9, September 11       | 57.0.9                                 |
| `react-native-reanimated`      | 4.5.1        | 4.5.1, July 2              | 4.7.0, September 18                    |
| `react-native-worklets`        | 0.10.1       | 0.10.1, July 1             | 0.13.0, September 18                   |
| `react-native-gesture-handler` | ~2.32.0      | 2.32.0, June 11            | 3.3.0, September 11                    |
| `react-native-svg`             | 15.15.4      | 15.15.4, March 18          | 15.15.5, May 11                        |
| `@shopify/react-native-skia`   | 2.6.2        | 2.6.2, April 4             | 2.12.0, September 16                   |
| `lottie-react-native`          | ~7.3.8       | 7.3.8, May 14              | 7.5.0, August 22                       |
| `@rive-app/react-native`       | Not bundled  |                            | 0.4.20, August 19; `next` 0.5.0-beta.4 |
| `rive-react-native`            | Not bundled  |                            | 9.8.5, July 17                         |

All dates are in 2026. `react-native-purchases` and `-ui` 10.10.1, published
September 21, are in the [RevenueCat notes][rc-versions].

[rc-versions]: /docs/research/revenuecat-expo.md#sdk-versions-on-september-22-2026

## Liquid Glass

Guessling builds with Xcode 26.6, which "includes Swift 6.3 and SDKs for
iOS 26.5" ([doc-xcode-26-6]), so iOS 26 draws its system components in Liquid
Glass. iOS 27 has shipped too: Apple's updates "start rolling out today across
iOS 27, iPadOS 27, macOS 27, and other Apple platforms", on September 14, 2026
([nr-ios27]).

[doc-xcode-26-6]: https://developer.apple.com/documentation/xcode-release-notes/xcode-26_6-release-notes

### What Liquid Glass is

- **A material.** "A material is a visual effect that creates a sense of depth,
  layering, and hierarchy between foreground and background elements." Liquid
  Glass "is a dynamic material that unifies the design language across Apple
  platforms, allowing you to present controls and navigation without obscuring
  underlying content." ([hig-materials])
- **A layer of its own.** "Liquid Glass forms a distinct functional layer for
  controls and navigation elements — like tab bars and sidebars — that floats
  above the content layer, establishing a clear visual hierarchy between
  functional elements and content." ([hig-materials]) Apple's overview:
  "Interfaces across Apple platforms feature a new dynamic material called
  Liquid Glass, which combines the optical properties of glass with a sense of
  fluidity." ([doc-lg-overview])
- **How it behaves.** "Liquid Glass is a new digital meta-material that
  dynamically bends and shapes light." and "Instead of fading, Liquid Glass
  objects materialize in and out by gradually modulating the light bending and
  lensing" ([wwdc25-219]).
- **Regular and clear.** "Liquid Glass provides two variants — regular and clear
  — that you can choose when building custom components or styling some system
  components." "The regular variant blurs and adjusts the luminosity of
  background content to maintain legibility of text and other foreground
  elements." and "Most system components use this variant." "The clear variant
  is highly translucent", for "components that float above media backgrounds —
  such as photos and videos" ([hig-materials]). The two "should never be mixed"
  ([wwdc25-219]).
- **Dimming under clear glass.** "If the underlying content is bright, consider
  adding a dark dimming layer of 35% opacity." ([hig-materials])
- **Settings change it.** "For instance, Reduced Transparency, makes Liquid
  Glass frostier and obscures more of the content behind it. Increased contrast,
  makes elements predominantly black or white and highlights them with a
  contrasting border and Reduced Motion decreases the intensity of some effects
  and disables any elastic properties for the material." "These are available
  automatically whenever you use the new material." ([wwdc25-219]) People can
  also "choose a preferred look for Liquid Glass in their device’s settings"
  ([hig-materials]).
- **iOS 27.** "a new slider in Settings gives users the option to personalize
  Liquid Glass, adjusting it anywhere from ultraclear to fully tinted to match
  their preference" ([nr-ios27]), and "Apps already using Liquid Glass get these
  improvements automatically when they run on this year’s releases without even
  needing to recompile." ([wwdc26-102])

[doc-lg-overview]: https://developer.apple.com/documentation/technologyoverviews/liquid-glass

### System components that adopt it

- **What adopts it.** "In system frameworks, standard components like bars,
  sheets, popovers, and controls automatically adopt this material."
  ([doc-adopting-lg]) For UIKit apps: "Your apps get this new appearance as soon
  as you recompile with the new SDK." ([wwdc25-284])
- **Bars.** "In iOS 26, navigation bars and toolbars also adopt the new glass
  appearance and float above the content." Their items are grouped, and "Each
  group shares a glass background." "Bar buttons use labelColor by default to
  improve legibility." And: "the bar background is now transparent by default.
  Remove any background customization from your navigation and toolbars. Using
  UIBarAppearance or backgroundColor interferes with the glass appearance."
  ([wwdc25-284]) The HIG folds navigation bars into toolbars: "In iOS, a
  navigation-specific toolbar is sometimes called a navigation bar."
  ([hig-toolbars])
- **Sheets.** "Sheets feature an increased corner radius, and half sheets are
  inset from the edge of the display to allow content to peek through from
  beneath them. When a half sheet expands to full height, it transitions to a
  more opaque appearance to help maintain focus on the task."
  ([doc-adopting-lg]) "To take advantage of their new glass appearance, remove
  any custom backgrounds." ([wwdc25-284])
- **Action sheets, menus, alerts, and popovers.** "An action sheet originates
  from the element that initiates the action, instead of from the bottom edge of
  the display." Menus "adopt Liquid Glass" ([doc-adopting-lg]). The HIG names
  alerts and popovers among the uses of the regular variant ([hig-materials]).
- **Controls.** "For controls like sliders and toggles, the knob transforms into
  Liquid Glass during interaction, and buttons fluidly morph into menus and
  popovers." ([doc-adopting-lg])
- **Scroll edge effects.** "Scroll views offer a scroll edge effect that helps
  maintain sufficient legibility and contrast for controls by obscuring content
  that scrolls beneath them. System bars like toolbars adopt this behavior by
  default." ([doc-adopting-lg]) "Only use a scroll edge effect when a scroll
  view is behind floating interface elements. Scroll edge effects aren’t
  decorative." ([hig-scroll-views])
- **Custom backgrounds get in the way.** "Any custom backgrounds and appearances
  you use in these elements might overlay or interfere with Liquid Glass or
  other effects that the system provides, such as the scroll edge effect."
  ([doc-adopting-lg])
- Synthesis: the share sheet and RevenueCat's paywall, a UIKit page sheet (see
  [Limits on matching the app](#limits-on-matching-the-app)), are system
  presentations, so they take the new sheet design on iOS 26 with no work from
  the team.

### Glass in custom controls

- **Not in the content layer.** "Don’t use Liquid Glass in the content layer."
  "Instead, use standard materials for elements in the content layer, such as
  app backgrounds." The exception is "controls in the content layer with a
  transient interactive element like sliders and toggles" ([hig-materials]).
- **Sparingly.** "Use Liquid Glass effects sparingly. Standard components from
  system frameworks pick up the appearance and behavior of this material
  automatically. If you apply Liquid Glass effects to a custom control, do so
  sparingly." "Limit these effects to the most important functional elements in
  your app." ([hig-materials]) At WWDC25: "You may be tempted to use Liquid
  Glass everywhere but it is best reserved for the navigation layer that floats
  above the content of your app." and "always avoid glass on glass"
  ([wwdc25-219]).
- **Clear glass.** "Only use clear Liquid Glass for components that appear over
  visually rich backgrounds." ([hig-materials]) WWDC25's three conditions for
  it: "First, the element you’re applying it to is over media-rich content.
  Second, your content layer won’t be negatively affected by introducing a
  dimming layer. And lastly, the content sitting above it is bold and bright."
  ([wwdc25-219])
- **At rest.** "In steady states, such as when an app first launches, avoid
  intersections between content and Liquid Glass." ([wwdc25-219])
- **Grouping.** "Combine custom Liquid Glass effects to improve rendering
  performance. If you apply these effects to custom elements, make sure to
  combine them using a GlassEffectContainer, which helps optimize performance
  while fluidly morphing Liquid Glass shapes into each other."
  ([doc-adopting-lg]) "However, glass can not sample other glass, so having
  nearby glass elements in different containers will result in inconsistent
  behavior." ([wwdc25-323])
- **Shapes.** "Capsules use a radius that’s half the height of the container.
  And concentric shapes calculate their radius by subtracting padding from the
  parent’s." "For phone layouts, use a capsule with extra margin to create space
  near the screen edge." ([wwdc25-356])
- **System buttons first.** "Instead of creating buttons with custom Liquid
  Glass effects, you can adopt the look and feel of the material with minimal
  code by using one of the following button style APIs" ([doc-adopting-lg]).
- **The APIs, all iOS 26.0 and later.** In SwiftUI, "By default, the modifier
  uses the regular variant of Glass and applies the given effect within a
  Capsule shape behind the view’s content." ([doc-glass-custom]) In UIKit,
  `UIGlassEffect` is "A visual effect that renders a glass material.", with
  `.regular` and `.clear` styles ([doc-uiglasseffect]). Glass drawn in a
  `UIVisualEffectView` has a rule that matters for animation: "Setting the alpha
  to less than 1 on the visual effect view or any of its superviews causes many
  effects to look incorrect or not show up at all." ([doc-visual-effect-view])

[wwdc25-323]: https://developer.apple.com/videos/play/wwdc2025/323/
[wwdc25-356]: https://developer.apple.com/videos/play/wwdc2025/356/
[doc-glass-custom]: https://developer.apple.com/documentation/swiftui/applying-liquid-glass-to-custom-views
[doc-uiglasseffect]: https://developer.apple.com/documentation/uikit/uiglasseffect

### Color and controls on glass

- **No color of its own.** "By default, Liquid Glass has no inherent color, and
  instead takes on colors from the content directly behind it." "By default,
  symbols and text on these elements follow a monochromatic color scheme,
  becoming darker when the underlying content is light, and lighter when it’s
  dark." ([hig-color])
- **Color on glass.** "Apply color sparingly to the Liquid Glass material, and
  to symbols or text on the material." "To emphasize primary actions, apply
  color to the background rather than to symbols or text." "Refrain from adding
  color to the background of multiple controls." "If your app features colorful
  backgrounds or visually rich content, prefer a monochromatic appearance for
  toolbars and tab bars, or choose an accent color with sufficient visual
  differentiation." ([hig-color]) At WWDC25: "If you want to imbue color into
  your app, do it in the content layer instead." ([wwdc25-219])
- **Resting state.** "Although colorful content might intermittently scroll
  underneath controls, make sure its default or resting state — like the top of
  a screen of scrollable content — maintains clear legibility." ([hig-color])
- **Buttons.** "As a general rule, a button needs a hit region of at least
  44x44 pt"; "Always include a press state for a custom button."; "Keep the
  number of prominent buttons to one or two per view." ([hig-buttons])
- **Toolbars.** "Use the .prominent style for key actions such as Done or
  Submit." "Only specify one primary action, and put it on the trailing side of
  the toolbar." "Use the standard Back and Close buttons." A title should stay
  "under 15 characters long so you leave enough room for other controls."
  ([hig-toolbars]) "Provide an accessibility label for every icon."
  ([doc-adopting-lg])
- **Sheets.** "Display only one sheet at a time from the main interface." "In
  iOS and iPadOS, for sheets with a single view, the Cancel button belongs on
  the leading edge of the top toolbar. When present, the Done button belongs on
  the trailing edge." "Include a grabber in a resizable sheet." "Support swiping
  to dismiss a sheet." ([hig-sheets])

[hig-buttons]: https://developer.apple.com/design/human-interface-guidelines/buttons
[hig-sheets]: https://developer.apple.com/design/human-interface-guidelines/sheets

### The compatibility key

- **What it does.** `UIDesignRequiresCompatibility`, iOS 26.0 and later, is "A
  Boolean value that indicates whether the system runs the app using a
  compatibility mode for UI." With `YES`, "The compatibility mode displays the
  app as it looks when built against previous versions of the SDKs." "Absence of
  the key, or NO, is the default value for apps linking against the latest
  SDKs." ([doc-udrc])
- **Temporary by design.** "Temporarily use this key while reviewing and
  refining your app’s UI for the design in the latest SDKs." "The system ignores
  this key when you build for iOS 27 or later, iPadOS 27 or later, Mac Catalyst
  27 or later, macOS 27 or later, or tvOS 27 or later." ([doc-udrc]) At WWDC26:
  "We'll be removing support for opting to use the old design. So once your app
  is recompiled with Xcode 27, it will automatically begin to use the new design
  with Liquid Glass." ([wwdc26-102])
- **When that lands.** "Starting April 2027, apps and games uploaded to App
  Store Connect need to meet the following minimum requirements:", among them
  "iOS and iPadOS apps must be built with the iOS 27 & iPadOS 27 SDK or later"
  ([news-sdk-2027]).
- **Expo sets nothing.** The key isn't in `expo@57.0.24`, its bare template, the
  default template, the prebuild config, the config plugins, Expo Router, Expo
  UI, or react-native-screens 4.26.2; the only code in `expo/expo` that reads it
  is `expo-glass-effect`'s availability check ([gh-glass-module]). Expo's stack
  guide calls the opt-out "Not supported in Expo Go." and says: "This method is
  a temporary workaround. From iOS 27, this option will be removed by Apple and
  you cannot opt out of the Liquid Glass effect." ([expo-stack-guide])
- Synthesis: a build without the key gets Liquid Glass on iOS 26 and 27, and the
  key would stop working at the April 2027 SDK floor anyway, so the design can
  assume glass.

[news-sdk-2027]: https://developer.apple.com/news/?id=k1mtkt1k
[gh-glass-module]: https://github.com/expo/expo/blob/9e5319c0f821a27b7924841903abae50e2b41790/packages/expo-glass-effect/ios/GlassEffectModule.swift

### Glass views in Expo

- **`expo-glass-effect` 57.0.3.** "GlassView is only available on iOS 26 and
  above. It will fallback to regular View on unsupported platforms." It's
  "Included in Expo Go" ([expo-glass]).
- **Props.** `glassEffectStyle` is `'regular'`, the default, `'clear'`, or
  `'none'`, or an object that adds `animate` and `animationDuration`;
  `tintColor` is typed as a `ColorValue` since 57.0.3, so `PlatformColor` and
  `DynamicColorIOS` values type-check; `isInteractive` maps to
  `UIGlassEffect.isInteractive`; and `colorScheme` is `'auto'`, `'light'`, or
  `'dark'`. `GlassContainer` has one prop, `spacing`: "The distance at which
  glass elements start affecting each other." ([expo-glass]; [gh-glass-view])
- **Checks.** `isLiquidGlassAvailable()` "validates the system and compiler
  versions, as well as the Info.plist settings", but "The value may also be true
  if the user has enabled accessibility settings that limit the Liquid Glass
  effect." `isGlassEffectAPIAvailable()` was added "because some iOS 26 beta
  versions do not have the Liquid Glass API available, which can lead to
  crashes." ([expo-glass])
- **Fading.** "Setting opacity to 0 on GlassView or any of its parent views
  causes the glass effect to not render at all. To fade in/out the glass effect,
  use the built-in animate and animationDuration props in glassEffectStyle
  instead of changing opacity." ([expo-glass]) A fix for fading in from a low
  opacity was merged on September 21, 2026, after 57.0.3 ([gh-glass-fix]).
- **On iOS 16.4 through 18.** In the 57.0.3 source, the iOS view is a native
  wrapper around a `UIVisualEffectView` whose setters each begin with
  `guard isGlassEffectAvailable() else {`, so below iOS 26 it draws no glass,
  blur, or tint, and its children sit on a transparent view ([gh-glass-view]).

[gh-glass-fix]: https://github.com/expo/expo/pull/48994

### Headers, sheets, and tabs in Expo Router

- **Glass headers.** "Starting from iOS 26, navigation headers adopt the
  system's "Liquid Glass" effect by default. It cannot be disabled per screen,
  so you need to opt out using a global configuration." ([expo-stack-guide])
- **An opaque default.** In Expo Router 57.0.22, a header's background falls
  back to the theme's `card` color unless `headerTransparent`,
  `headerBackground`, or a large title is set, and its items take the theme's
  `primary` color on iOS ([gh-header-config]); react-native-screens 4.26.2 then
  calls `[appearance configureWithOpaqueBackground];` for any color that isn't
  transparent ([gh-rns-header]). Synthesis: that's the kind of bar background
  Apple says "interferes with the glass appearance", with blue items where Apple
  uses `labelColor`. An open issue asks for the title color to adapt to the
  glass ([gh-router-49636]).
- **Header options.** `headerTransparent` makes "the header absolutely
  positioned"; `headerBlurEffect` needs it and draws a `UIBlurEffect`, a
  standard material, which with `scrollEdgeEffects` on iOS 26 "may cause
  overlapping effects"; `scrollEdgeEffects` defaults to `automatic` on each
  edge; `unstable_headerLeftItems` and `unstable_headerRightItems` return native
  bar button items, and their `prominent` variant is "only available from
  iOS 26.0 and later." ([gh-stack-types])
- **Toolbar.** "Stack.Toolbar is an alpha API available on Android in Expo
  SDK 56 and later, and on iOS in Expo SDK 55 and later. The API is subject to
  breaking changes." Its buttons take a `variant` of `plain`, `done`, or
  `prominent`. "Toolbar buttons with liquid glass styling may flicker or flash
  their background when navigating between screens in dark mode on iOS 26.",
  which wrapping the root in `ThemeProvider` fixes ([expo-stack-toolbar]).
- **Sheets.** `presentation: 'modal'` becomes `UIModalPresentationAutomatic`, a
  page sheet on iPhone, and `'formSheet'` a form sheet with detents
  ([gh-rns-screen]): "Form sheet presents a modal as a bottom sheet that app
  users can drag between different heights (called detents)." ([expo-modals])
  When glass is available, Expo Router makes a form sheet's header and content
  transparent by default, and leaves `'modal'` screens opaque
  ([gh-router-formsheet]). `sheetAllowedDetents` defaults to `[1.0]` and
  `sheetGrabberVisible` to false ([gh-stack-types]).
- **Native tabs, for context.** In SDK 57 they're
  `expo-router/unstable-native-tabs`, which the SDK 57 guide calls alpha: it "is
  available in SDK 54 and later. Its API is subject to change."
  ([gh-native-tabs-src]) SDK 58 makes them stable ([expo-sdk58]). An Expo
  maintainer: "If you run on iOS 18, you will get the same tab bar as always, if
  you run on iOS 26 you will get the liquid glass tab bar." ([gh-tabs-39722])
  Guessling has one stack, so tabs matter only if it adds them.

[gh-rns-header]: https://github.com/software-mansion/react-native-screens/blob/4.26.2/ios/RNSScreenStackHeaderConfig.mm
[gh-router-49636]: https://github.com/expo/expo/issues/49636
[gh-stack-types]: https://github.com/expo/expo/blob/7687b07947a5c866adeb11abbceae72403ccb188/packages/expo-router/src/react-navigation/native-stack/types.tsx
[expo-stack-toolbar]: https://docs.expo.dev/router/advanced/stack-toolbar/
[gh-rns-screen]: https://github.com/software-mansion/react-native-screens/blob/4.26.2/ios/RNSScreen.mm
[expo-modals]: https://docs.expo.dev/router/advanced/modals/
[gh-native-tabs-src]: https://github.com/expo/expo/blob/sdk-57/docs/pages/router/advanced/native-tabs.mdx
[expo-sdk58]: https://expo.dev/changelog/sdk-58-beta

### SwiftUI views through Expo UI

- **What it is.** "The SwiftUI components in @expo/ui/swift-ui allow you to
  build fully native iOS interfaces using SwiftUI from React Native." "Using a
  component from @expo/ui/swift-ui requires wrapping it in a Host component."
  ([expo-ui-swift]) "Under the hood, it uses UIHostingController to render
  SwiftUI views in UIKit." ([expo-ui-guide])
- **Stable.** "As of SDK 56, the Jetpack Compose (Android) and SwiftUI (iOS)
  APIs in Expo UI are stable." ([expo-sdk56]) It's in Expo Go and in the SDK 57
  default template.
- **Glass APIs.** A `glassEffect` modifier with the `regular`, `clear`, and
  `identity` variants and `interactive` and `tint` options, `glassEffectId`, a
  `GlassEffectContainer` component, and button styles, of which "'glass' and
  'glassProminent' are available on iOS 26+ and tvOS 26+ only."
  ([expo-ui-modifiers]) "Note: glassEffect modifier requires Xcode 26+ and
  iOS 26+." ([expo-ui-guide])
- **On iOS 16.4 through 18.** The package's floor is iOS 16.4. Below iOS 26, the
  glass modifiers return the content unchanged, the container draws its children
  plainly, and the glass button styles fall back to `.automatic`
  ([gh-expo-ui-ios]).
- **When it all shipped.** SDK 54, on September 10, 2025, first shipped
  `expo-glass-effect`, the Expo UI beta, native tabs in beta, and `.icon` app
  icons ([expo-sdk54]); SDK 55, on February 25, 2026, added `Stack.Toolbar` and
  glass form sheets by default ([expo-sdk55]); SDK 56, on May 21, 2026, made
  Expo UI stable ([expo-sdk56]); and SDK 57, on June 30, 2026, "a small, focused
  release" for React Native 0.86, doesn't mention glass ([expo-sdk57]).

[expo-ui-swift]: https://docs.expo.dev/versions/v57.0.0/sdk/ui/swift-ui/
[expo-ui-guide]: https://docs.expo.dev/guides/expo-ui-swift-ui/
[expo-sdk56]: https://expo.dev/changelog/sdk-56
[expo-ui-modifiers]: https://docs.expo.dev/versions/v57.0.0/sdk/ui/swift-ui/modifiers/
[expo-sdk55]: https://expo.dev/changelog/sdk-55

### What iOS 16.4 through 18 show

| Piece                                        | iOS 26 and 27                                          | iOS 16.4 through 18                                  | Source                                 |
| -------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------- | -------------------------------------- |
| System bars, sheets, alerts, menus, controls | Liquid Glass                                           | The design before iOS 26                             | [doc-adopting-lg]                      |
| `GlassView` and `GlassContainer`             | Regular or clear glass                                 | No effect: children on a transparent view            | [gh-glass-view]                        |
| Expo Router stack header                     | Native bar with glass items, opaque unless transparent | Opaque bar, iOS 26 options skipped                   | [gh-header-config]; [gh-rns-barbutton] |
| Form sheet                                   | Transparent header and content on a glass sheet        | Opaque content                                       | [gh-router-formsheet]                  |
| Native tabs                                  | Glass tab bar                                          | "the same tab bar as always"                         | [gh-tabs-39722]                        |
| Expo UI glass modifiers and button styles    | Glass                                                  | Content unchanged; buttons in the automatic style    | [gh-expo-ui-ios]                       |
| App icon from a `.icon` file                 | Layered glass icon                                     | Images Xcode generates at build time                 | [doc-icon-composer]                    |
| `expo-symbols` effects                       | Bounce, pulse, scale, variable color                   | Still symbols on 16.x; the same effects on 17 and 18 | [gh-symbols-ios]                       |

[gh-rns-barbutton]: https://github.com/software-mansion/react-native-screens/blob/4.26.2/ios/RNSBarButtonItem.mm

## Typography

### System fonts and their licenses

- **The families.** "San Francisco (SF) is a sans serif typeface family that
  includes the SF Pro, SF Compact, SF Arabic, SF Armenian, SF Georgian, SF
  Hebrew, and SF Mono variants." Rounded variants exist "to coordinate text with
  the appearance of soft or rounded UI elements, or to provide an alternative
  typographic voice." "New York (NY) is a serif typeface family designed to work
  well by itself and alongside the SF fonts." "SF Pro is the system font in iOS
  and iPadOS. iOS and iPadOS apps can also use NY." ([hig-typography])
- **Don't embed them.** "You can use the constants defined in Font.Design to
  access all system fonts — don’t embed system fonts in your app or game."
  ([hig-typography]) The downloads are for mockups: SF Pro's license allows use
  "solely for creating mock-ups of user interfaces to be used in software
  products running on Apple’s iOS, iPadOS, macOS or tvOS operating systems", and
  "You may not embed the Apple Font in any software programs or other products."
  The New York and SF Mono licenses say the same ([apple-fonts]).
- **Weights and faces.** "prefer Regular, Medium, Semibold, or Bold font
  weights, and avoid Ultralight, Thin, and Light font weights, which can be
  difficult to see, especially when text is small." "Minimize the number of
  typefaces you use, even in a highly customized interface." ([hig-typography])
- **Custom fonts.** "System fonts automatically support Dynamic Type (where
  available) and respond when people turn on accessibility features, such as
  Bold Text. If you use a custom font, make sure it implements the same
  behaviors." ([hig-typography])
- **Numerals.** In SF, "Numbers have proportional widths by default, so they
  feel harmonious and naturally spaced within the time and data-centric
  interfaces people use every day." ([apple-fonts])

[apple-fonts]: https://developer.apple.com/fonts/

### System fonts in React Native

- **The names.** "The generic font families system-ui, ui-sans-serif, ui-serif,
  ui-monospace, and ui-rounded are supported on iOS." ([rn-text-style]) In
  the 0.86.3 New Architecture code, `system-ui` and `ui-sans-serif` map to
  `UIFontDescriptorSystemDesignDefault`, SF Pro; `ui-rounded` to the rounded
  design, SF Pro Rounded; `ui-serif` to the serif design, New York; and
  `ui-monospace` to the monospaced design, SF Mono. The weight is applied before
  the design, so it carries into each face ([rn-fontutils]).
- **`'System'`.** Undocumented; in the New Architecture it has no branch of its
  own and reaches the system font through the fallback for unknown names
  ([rn-fontutils]). Leaving `fontFamily` unset also gives SF Pro.
- **Weights.** `fontWeight` 100 through 900 map to UIKit's UltraLight through
  Black, `'normal'` to 400, and `'bold'` to 700 ([rn-attributed]).
- **Tabular figures.** `fontVariant: ['tabular-nums']` is applied after the
  family is resolved, on every path, so it reaches the system faces and embedded
  fonts alike and takes effect wherever the font has tabular figures
  ([rn-fontutils]).
- **Defaults.** Unstyled text is 14 pt, regular, and black ([rn-text-defaults]),
  not the HIG's 17 pt body in the label color.
- **Expo's template.** The SDK 57 default template's theme names these families
  on iOS: `sans: 'system-ui'`, `serif: 'ui-serif'`, `rounded: 'ui-rounded'`, and
  `mono: 'ui-monospace'` ([expo-template-theme]).

[rn-text-style]: https://reactnative.dev/docs/0.86/text-style-props#fontfamily
[expo-template-theme]: https://github.com/expo/expo/blob/sdk-57/templates/expo-template-default/src/constants/theme.ts#L29-L52

### Dynamic Type sizes

The HIG's iOS text styles, as size and leading in points; weights don't change
with the size ([hig-typography]):

| Style       | Weight   | Emphasized weight | xSmall | Large (default) | xxxLarge |
| ----------- | -------- | ----------------- | ------ | --------------- | -------- |
| Large Title | Regular  | Bold              | 31/38  | 34/41           | 40/48    |
| Title 1     | Regular  | Bold              | 25/31  | 28/34           | 34/41    |
| Title 2     | Regular  | Bold              | 19/24  | 22/28           | 28/34    |
| Title 3     | Regular  | Semibold          | 17/22  | 20/25           | 26/32    |
| Headline    | Semibold | Semibold          | 14/19  | 17/22           | 23/29    |
| Body        | Regular  | Semibold          | 14/19  | 17/22           | 23/29    |
| Callout     | Regular  | Semibold          | 13/18  | 16/21           | 22/28    |
| Subhead     | Regular  | Semibold          | 12/16  | 15/20           | 21/28    |
| Footnote    | Regular  | Semibold          | 12/16  | 13/18           | 19/24    |
| Caption 1   | Regular  | Semibold          | 11/13  | 12/16           | 18/23    |
| Caption 2   | Regular  | Semibold          | 11/13  | 11/13           | 17/22    |

The accessibility sizes, which Larger Accessibility Text Sizes turns on:

| Style       | AX1   | AX2   | AX3   | AX4   | AX5   |
| ----------- | ----- | ----- | ----- | ----- | ----- |
| Large Title | 44/52 | 48/57 | 52/61 | 56/66 | 60/70 |
| Title 1     | 38/46 | 43/51 | 48/57 | 53/62 | 58/68 |
| Title 2     | 34/41 | 39/47 | 44/52 | 50/59 | 56/66 |
| Title 3     | 31/38 | 37/44 | 43/51 | 49/58 | 55/65 |
| Headline    | 28/34 | 33/40 | 40/48 | 47/56 | 53/62 |
| Body        | 28/34 | 33/40 | 40/48 | 47/56 | 53/62 |
| Callout     | 26/32 | 32/39 | 38/46 | 44/52 | 51/60 |
| Subhead     | 25/31 | 30/37 | 36/43 | 42/50 | 49/58 |
| Footnote    | 23/29 | 27/33 | 33/40 | 38/46 | 44/52 |
| Caption 1   | 22/28 | 26/32 | 32/39 | 37/44 | 43/51 |
| Caption 2   | 20/25 | 24/30 | 29/35 | 34/41 | 40/48 |

- **Emphasis.** "The emphasized weights can be medium, semibold, bold, or
  heavy." ([hig-typography])
- **Floors.** On iOS, text defaults to 17 pt with an 11 pt minimum: "Follow the
  recommended default and minimum text sizes for each platform — for both custom
  and system fonts — to ensure your text is legible on all devices."
  ([hig-typography])
- **Tracking.** "In a running app, the system font dynamically adjusts tracking
  at every point size." ([hig-typography])
- **Layout.** "Make sure your app’s layout adapts to all font sizes." "Keep text
  truncation to a minimum as font size increases. In general, aim to display as
  much useful text at the largest accessibility font size as you do at the
  largest standard font size." "To improve readability, consider using a stacked
  layout where text appears above secondary items." "Increase the size of
  meaningful interface icons as font size increases." ([hig-typography])
  "Ideally, give people the option to enlarge text by at least 200 percent (or
  140 percent in watchOS apps)." ([hig-accessibility])

### How React Native scales text

- **Props.** `allowFontScaling` "Specifies whether fonts should scale to respect
  Text Size accessibility settings." and defaults to true.
  `maxFontSizeMultiplier` "Specifies the largest possible scale a font can reach
  when allowFontScaling is enabled.": unset, it inherits "from the parent node
  or the global default (0)", 0 means no limit, and 1 or more caps it.
  `dynamicTypeRamp`, iOS only, is "The Dynamic Type ramp to apply to this
  element on iOS.", one of `caption2`, `caption1`, `footnote`, `subheadline`,
  `callout`, `body`, `headline`, `title3`, `title2`, `title1`, or `largeTitle`
  ([rn-text]).
- **Reading the scale.** `PixelRatio.getFontScale()` "Returns the scaling factor
  for font sizes." ([rn-pixelratio]), and "useWindowDimensions automatically
  updates all of its values when screen size or font scale changes."
  ([rn-window])
- **One multiplier.** From the 0.86.3 source: each surface takes one multiplier
  from the content size category and lays out again when it changes. Without
  `dynamicTypeRamp`, every text renders at its `fontSize` times that multiplier;
  with a ramp, the multiplier comes from `UIFontMetrics` for that text style,
  applied to the same `fontSize`. `maxFontSizeMultiplier` caps it only at 1 or
  more. `lineHeight` scales too, but `letterSpacing` doesn't ([rn-attributed]).

| Content size category             | HIG size | Multiplier |
| --------------------------------- | -------- | ---------- |
| ExtraSmall                        | xSmall   | 0.823      |
| Small                             | Small    | 0.882      |
| Medium                            | Medium   | 0.941      |
| Large, the default                | Large    | 1.0        |
| ExtraLarge                        | xLarge   | 1.118      |
| ExtraExtraLarge                   | xxLarge  | 1.235      |
| ExtraExtraExtraLarge              | xxxLarge | 1.353      |
| AccessibilityMedium               | AX1      | 1.786      |
| AccessibilityLarge                | AX2      | 2.143      |
| AccessibilityExtraLarge           | AX3      | 2.643      |
| AccessibilityExtraExtraLarge      | AX4      | 3.143      |
| AccessibilityExtraExtraExtraLarge | AX5      | 3.571      |

Source for the table: [rn-utils-multiplier].

Synthesis, computed from the two tables: without a ramp, React Native's sizes
drift from Apple's at both ends.

| Style at Large   | xSmall, HIG and RN | AX1, HIG and RN | AX5, HIG and RN |
| ---------------- | ------------------ | --------------- | --------------- |
| Large Title (34) | 31 and 28.0        | 44 and 60.7     | 60 and 121.4    |
| Title 1 (28)     | 25 and 23.0        | 38 and 50.0     | 58 and 100.0    |
| Body (17)        | 14 and 14.0        | 28 and 30.4     | 53 and 60.7     |
| Caption 2 (11)   | 11 and 9.1         | 20 and 19.6     | 40 and 39.3     |

- **Bold Text.** The 0.86.3 font code doesn't read the Bold Text setting
  ([rn-fontutils]); `AccessibilityInfo` has a `boldTextChanged` event: "Fires
  when the state of the bold text toggle changes." ([rn-a11yinfo])

[rn-pixelratio]: https://reactnative.dev/docs/0.86/pixelratio
[rn-window]: https://reactnative.dev/docs/0.86/usewindowdimensions

### Fonts bundled with expo-font

- **Two ways.** "There are two ways to add fonts to your app: using the
  expo-font config plugin (recommended for Android and iOS) or loading them at
  runtime (which works across all platforms including web)." The plugin embeds
  fonts "at build time which is more efficient than useFonts or loadAsync."
  ([expo-font])
- **What the plugin writes.** It adds each `.ttf`, `.otf`, `.woff`, or `.woff2`
  file to the Xcode project and its file name to `UIAppFonts`
  ([gh-font-plugin]), which Apple defines as "an array of font filenames,
  including the filename extension, that reside in the app’s bundle."
  ([doc-uiappfonts]) "On iOS, the font family name is always taken directly from
  the font file and may not be the same as the file name" ([expo-font]).
- **The same scaling.** Synthesis from the source: React Native multiplies the
  size before it picks a face, so embedded, runtime-loaded, and system fonts
  scale by the same multiplier ([rn-fontutils]). An embedded family also
  switches faces with `fontWeight`, because React Native looks up the family's
  faces; a runtime alias from `useFonts` points at one face, so `fontWeight`
  can't switch it ([rn-fontutils]; [gh-expo-font-ios]).
- **Formats.** "Expo SDK officially supports OTF and TTF font formats across
  Android, iOS and web platforms." "Variable fonts, including variable font
  implementations in OTF and TTF, do not have support across all platforms. For
  full platform support, use static fonts." "We recommend naming the font file
  same as its PostScript name so the font family name is consistent on both
  platforms." The config plugin "Doesn't work with Expo Go since this method
  requires creating a development build." ([expo-fonts-guide])
- **System fonts.** "If you don't want to use a custom font by specifying a
  fontFamily, platform's default font will be used." "On iOS, it's SF Pro."
  ([expo-fonts-guide])

[gh-font-plugin]: https://github.com/expo/expo/blob/sdk-57/packages/expo-font/plugin/src/withFontsIos.ts#L20-L55
[doc-uiappfonts]: https://developer.apple.com/documentation/bundleresources/information-property-list/uiappfonts
[gh-expo-font-ios]: https://github.com/expo/expo/tree/sdk-57/packages/expo-font/ios

### The SIL Open Font License

- **What it allows.** "The OFL allows the licensed fonts to be used, studied,
  modified and redistributed freely as long as they are not sold by themselves.
  The fonts, including any derivative works, can be bundled, embedded,
  redistributed and/or sold with any software provided that any reserved names
  are not used by derivative works." ([ofl-text])
- **What it requires.** "Original or Modified Versions of the Font Software may
  be bundled, redistributed and/or sold with any software, provided that each
  copy contains the above copyright notice and this license. These can be
  included either as stand-alone text files, human-readable headers or in the
  appropriate machine-readable metadata fields within text or binary files as
  long as those fields can be easily viewed by the user." ([ofl-text])
- **In a mobile app.** "If you bundle a font under the OFL with your mobile app
  you must comply with the terms of the license. At a minimum you must include
  the copyright statement, the license notice and the license text. A mention of
  this information in your About box or Changelog, with a link to where the font
  package is from, is good practice, and the extra space needed to carry these
  items is very small." ([ofl-faq], question 1.20)
- **A paid app.** Selling software that bundles OFL fonts: "Yes, you can do this
  with both the Original Version and a Modified Version of the fonts.", with
  "mobile device applications" among the examples ([ofl-faq], 1.4).
- **Reserved names.** "No Modified Version of the Font Software may use the
  Reserved Font Name(s) unless explicit written permission is granted by the
  corresponding Copyright Holder." ([ofl-text]) Converting counts: "A change in
  font format normally is considered modification, and Reserved Font Names
  (RFNs) cannot be used." ([ofl-faq], 2.2)
- **Credit.** Not required on screen: font authors "may appreciate being
  mentioned in your artwork’s acknowledgements alongside the name of the font,
  possibly with a link to their website, but that is not required."
  ([ofl-faq], 1.1.2)

[ofl-text]: https://openfontlicense.org/open-font-license-official-text/

## Color

### Semantic and system colors

- **Adaptive by design.** "The system defines colors that look good on various
  backgrounds and appearance modes, and can automatically adapt to vibrancy and
  accessibility settings." ([hig-color])
- **Every context.** "Make sure all your app’s colors work well in light, dark,
  and increased contrast contexts." "If you define a custom color, make sure to
  supply light and dark variants, and an increased contrast option for each
  variant that provides a significantly higher amount of visual differentiation.
  Even if your app ships in a single appearance mode, provide both light and
  dark colors to support Liquid Glass adaptivity in these contexts."
  ([hig-color])
- **Dynamic system colors.** "Avoid hard-coding system color values in your
  app." Each "is semantically defined by its purpose, rather than its appearance
  or color values." "Avoid redefining the semantic meanings of dynamic system
  colors." "iOS defines two sets of dynamic background colors — system and
  grouped — each of which contains primary, secondary, and tertiary variants
  that help you convey a hierarchy of information.", beside foreground colors
  such as `label`, `secondaryLabel`, `placeholderText`, `separator`, and `link`
  ([hig-color]).
- **Meaning.** "Avoid using the same color to mean different things." "Avoid
  relying solely on color to differentiate between objects, indicate
  interactivity, or communicate essential information." "For example, you can
  use text labels or glyph shapes to identify objects or states." ([hig-color])
- **iOS 26 values.** The HIG "Updated system color values, and added guidance
  for Liquid Glass." on June 9, 2025. Some of the values, in RGB ([hig-color]):

| Color  | Light        | Dark          | Increased contrast, light | Increased contrast, dark |
| ------ | ------------ | ------------- | ------------------------- | ------------------------ |
| Red    | 255, 56, 60  | 255, 66, 69   | 233, 21, 45               | 255, 97, 101             |
| Orange | 255, 141, 40 | 255, 146, 48  | 197, 83, 0                | 255, 160, 86             |
| Yellow | 255, 204, 0  | 255, 214, 0   | 161, 106, 0               | 254, 223, 67             |
| Green  | 52, 199, 89  | 48, 209, 88   | 0, 137, 50                | 74, 217, 104             |
| Blue   | 0, 136, 255  | 0, 145, 255   | 30, 110, 244              | 92, 184, 255             |
| Indigo | 97, 85, 245  | 109, 124, 255 | 86, 74, 222               | 167, 170, 255            |
| Purple | 203, 48, 224 | 219, 52, 242  | 176, 47, 194              | 234, 141, 255            |
| Pink   | 255, 45, 85  | 255, 55, 95   | 231, 18, 77               | 255, 138, 196            |

- Synthesis, computed with WCAG's formula from all twelve system colors: against
  white, the default light colors reach 1.5 to 1 (Yellow) to 5.1 to 1 (Indigo),
  and only Indigo passes 4.5; every increased contrast light variant reaches 4.5
  to 6.1; against black, every default dark variant reaches at least 5.8. The
  accent colors fail as small text on white until Increase Contrast is on.

### Contrast in the HIG

- **The table.** "Accessibility Inspector uses the following values from WCAG
  Level AA as guidance in determining whether your app’s colors have an
  acceptable contrast." ([hig-accessibility])

| Text size    | Text weight | Minimum contrast ratio |
| ------------ | ----------- | ---------------------- |
| Up to 17 pts | All         | 4.5:1                  |
| 18 pts       | All         | 3:1                    |
| All          | Bold        | 3:1                    |

Source for the table: [hig-accessibility].

- **Fallbacks.** "If your app doesn’t provide this minimum contrast by default,
  ensure it at least provides a higher contrast color scheme when the system
  setting Increase Contrast is turned on. If your app supports Dark Mode, make
  sure to check the minimum contrast in both light and dark appearances."
  ([hig-accessibility])
- **Dark Mode's floor.** "At a minimum, make sure the contrast ratio between
  colors is no lower than 4.5:1. For custom foreground and background colors,
  strive for a contrast ratio of 7:1, especially in small text."
  ([hig-dark-mode])
- **Respect the setting.** "people often choose Dark Mode as their default
  interface style, and they generally expect all apps and games to respect their
  preference." "Avoid offering an app-specific appearance setting." "Soften the
  color of white backgrounds." In Dark Mode, iOS uses "base and elevated"
  backgrounds, and "Using a custom background color can make it harder for
  people to perceive these system-provided visual distinctions."
  ([hig-dark-mode])
- **More than color.** "Convey information with more than color alone." Pairs
  such as "red-green and blue-orange" are hard for people who are color blind
  ([hig-accessibility]).

### Colors in React Native

- **`PlatformColor`.** "You can use the PlatformColor function to access native
  colors on the target platform by supplying the native color’s corresponding
  string value." Further names are fallbacks, and "the function should be
  wrapped in a platform check" ([rn-platformcolor]). On iOS it tries an asset
  catalog color first, then the semantic and system names (`label` through
  `link`, the background sets, `systemRed` and the other system colors, and the
  grays); an unknown name gives a clear color, with no error
  ([rn-platformcolor-src]).
- **`DynamicColorIOS`.** "DynamicColorIOS takes a single argument as an object
  with two mandatory keys: dark and light, and two optional keys
  highContrastLight and highContrastDark." The high-contrast keys fall back to
  `light` and `dark` ([rn-dynamiccolor]). iOS picks the variant from the
  appearance and the high-contrast trait at draw time ([rn-hostcolor]).
- **The scheme.** `useColorScheme` returns `'light'` or `'dark'`, or `null`,
  which "May be returned if the native Appearance module is not available."
  ([rn-colorscheme]) `Appearance.setColorScheme()` "Forces the application to
  always adopt a light or dark interface style." ([rn-appearance])
- **Increase Contrast and Reduce Transparency.**
  `AccessibilityInfo.isDarkerSystemColorsEnabled()` reads the setting Apple
  calls "the Increase Contrast setting" ([doc-darker-colors]), and
  `isReduceTransparencyEnabled()` has a `reduceTransparencyChanged` event
  ([rn-a11yinfo]); the source also emits `darkerSystemColorsChanged`, which the
  docs' event table leaves out ([rn-a11y-src]).

[rn-platformcolor]: https://reactnative.dev/docs/0.86/platformcolor
[rn-platformcolor-src]: https://github.com/react/react-native/blob/v0.86.3/packages/react-native/ReactCommon/react/renderer/graphics/platform/ios/react/renderer/graphics/RCTPlatformColorUtils.mm#L22-L210
[rn-dynamiccolor]: https://reactnative.dev/docs/0.86/dynamiccolorios
[rn-hostcolor]: https://github.com/react/react-native/blob/v0.86.3/packages/react-native/ReactCommon/react/renderer/graphics/platform/ios/react/renderer/graphics/HostPlatformColor.mm#L50-L84
[rn-colorscheme]: https://reactnative.dev/docs/0.86/usecolorscheme
[rn-appearance]: https://reactnative.dev/docs/0.86/appearance
[doc-darker-colors]: https://developer.apple.com/documentation/uikit/uiaccessibility/isdarkersystemcolorsenabled
[rn-a11y-src]: https://github.com/react/react-native/blob/v0.86.3/packages/react-native/React/CoreModules/RCTAccessibilityManager.mm#L178-L202

### Dark Mode in the app config

- **Light unless set.** `userInterfaceStyle` is "Configuration to force the app
  to always use the light or dark user-interface appearance, such as "dark
  mode", or make it automatically adapt to the system preferences. If not
  provided, defaults to light." Its values are `light`, `dark`, and `automatic`
  ([expo-app-config]).
- **What prebuild writes.** `UIUserInterfaceStyle`, from
  `config.ios?.userInterfaceStyle ?? config.userInterfaceStyle ?? 'light'`,
  unless `ios.infoPlist` sets that key itself ([gh-ui-style]). Apple's `Light`
  value: "Set this value to force the light user interface style, even when the
  systemwide style is set to dark. Your app will ignore any changes to the
  systemwide style." ([doc-uiuserinterfacestyle])
- **The templates differ.** "By default, this property is set to automatic when
  you create a new project with the default template." and "The app will default
  to the light style if this property is absent." ([expo-color-themes]) The
  SDK 57 default template's `app.json` sets `"automatic"` ([expo-template-app]).
- **No extra package.** `expo-system-ui` is needed for the style only on
  Android; on iOS it sets the root view's background color ([expo-system-ui]), a
  static color chosen once, black or white from the appearance at launch, unless
  the app sets one ([gh-system-ui-ios]).
- **Splash screens.** Configuring a dark splash screen sets
  `UIUserInterfaceStyle` to `Automatic` too (see
  [Launch screens](#launch-screens)).

[expo-color-themes]: https://docs.expo.dev/develop/user-interface/color-themes/
[expo-template-app]: https://github.com/expo/expo/blob/sdk-57/templates/expo-template-default/app.json
[expo-system-ui]: https://docs.expo.dev/versions/v57.0.0/sdk/system-ui/
[gh-system-ui-ios]: https://github.com/expo/expo/blob/sdk-57/packages/expo-system-ui/ios/ExpoSystemUI/ExpoSystemUIModule.swift#L10-L71

### WCAG 2.2 contrast minimums

- **1.4.3 Contrast (Minimum), level AA.** "The visual presentation of text and
  images of text has a contrast ratio of at least 4.5:1, except for the
  following:", with "Large-scale text and images of large-scale text have a
  contrast ratio of at least 3:1;" and "Text that is part of a logo or brand
  name has no contrast requirement." ([wcag22])
- **1.4.6 Contrast (Enhanced), level AAA.** "at least 7:1", and 4.5:1 for
  large-scale text ([wcag22]).
- **1.4.11 Non-text Contrast, level AA.** "The visual presentation of the
  following have a contrast ratio of at least 3:1 against adjacent color(s):
  User Interface Components Visual information required to identify user
  interface components and states, except for inactive components or where the
  appearance of the component is determined by the user agent and not modified
  by the author; Graphical Objects Parts of graphics required to understand the
  content, except when a particular presentation of graphics is essential to the
  information being conveyed." ([wcag22])
- **1.4.1 Use of Color, level A.** "Color is not used as the only visual means
  of conveying information, indicating an action, prompting a response, or
  distinguishing a visual element." ([wcag22])
- **Large scale.** Text "with at least 18 point or 14 point bold or font size
  that would yield equivalent size for Chinese, Japanese and Korean (CJK) fonts"
  ([wcag22]). "The ratio between sizes in points and CSS pixels is
  1pt = 1.333px, therefore 14pt and 18pt are equivalent to approximately 18.5px
  and 24px." And thresholds aren't rounded: "4.499:1 would not meet the 4.5:1
  threshold" ([wcag-understanding-143]).
- **In a native app.** W3C's note on applying WCAG to software says 1.4.3
  "applies directly as written", that "When evaluating non-web documents and
  software, 1 point means 1.333 CSS pixels.", and that platform units stand in
  for CSS pixels, among them "points (pt) for iOS and macOS" ([wcag2ict]).
- Synthesis: on iOS, WCAG's large scale works out to about 24 pt regular
  or 18.7 pt bold, above the HIG's 18 pt line (see
  [Conflicts between sources](#conflicts-between-sources)).

[wcag-understanding-143]: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

## Motion and haptics

### Apple's motion guidance

- **Purpose.** "Add motion purposefully, supporting the experience without
  overshadowing it." "Don’t add motion for the sake of adding motion."
  ([hig-motion])
- **Never the only channel.** "Make motion optional." "Not everyone can or wants
  to experience the motion in your app or game, so it’s essential to avoid using
  it as the only way to communicate important information." ([hig-motion])
- **Feedback.** "Aim for brevity and precision in feedback animations." For
  example, "when a game displays a succinct animation that’s precisely tied to a
  successful action, players can instantly get the message without being
  distracted from their gameplay." ([hig-motion])
- **Frequent and blocking motion.** "In apps, generally avoid adding motion to
  UI interactions that occur frequently." "Let people cancel motion." "As much
  as possible, don’t make people wait for an animation to complete before they
  can do anything, especially if they have to experience the animation more than
  once." ([hig-motion])
- **Frame rate.** "In most games, maintaining a consistent frame rate of 30 to
  60 fps typically results in a smooth, visually appealing experience."
  ([hig-motion])
- **Reduce Motion.** "When this setting is active, ensure your app or game
  responds by reducing automatic and repetitive animations, including zooming,
  scaling, and peripheral motion." Among the other practices: "Tightening
  animation springs to reduce bounce effects", "Replacing transitions in x-, y-,
  and z-axes with fades to avoid motion", and "Avoiding animating into and out
  of blurs" ([hig-accessibility]). Apple's criteria for the Reduced Motion label
  are in the [Apple notes][apple-a11y-labels].
- **The settings in code.** `UIAccessibility.isReduceMotionEnabled`, from
  iOS 8.0, is "A Boolean value that indicates whether the Reduce Motion setting
  is in an enabled state." ([doc-reduce-motion]) `prefersCrossFadeTransitions`,
  from iOS 14.0, "indicates whether the Reduce Motion and the Prefer Cross-Fade
  Transitions settings are in an enabled state." ([doc-cross-fade]) WWDC20 asks
  apps to observe the change notification "if the setting changes while your app
  is open", and says that for Prefer Cross-Fade Transitions, "If you're already
  using UIKits, UINavigationController, this work already comes for free."
  ([wwdc20-10020]) React Native has `isReduceMotionEnabled()`,
  `prefersCrossFadeTransitions()`, and a `reduceMotionChanged` event, "Fires
  when the state of the reduce motion toggle changes." ([rn-a11yinfo])

[doc-reduce-motion]: https://developer.apple.com/documentation/uikit/uiaccessibility/isreducemotionenabled
[doc-cross-fade]: https://developer.apple.com/documentation/uikit/uiaccessibility/preferscrossfadetransitions

### Reanimated 4 in SDK 57

- **New Architecture only.** "Reanimated 4.x works only with the React Native
  New Architecture (Fabric)." ([rea-start]) React Native has run only on the New
  Architecture since 0.82: "the first React Native that runs entirely on the New
  Architecture." ([rn-082])
- **Worklets.** Reanimated needs `react-native-worklets`: "It was separated from
  react-native-reanimated for better modularity and must be installed
  separately." ([rea-start]) In SDK 57, "No additional configuration is
  required. Reanimated Babel plugin is automatically configured in
  babel-preset-expo when you install the library." ([expo-reanimated])
  babel-preset-expo adds `react-native-worklets/plugin` whenever the package is
  installed ([gh-babel-preset]).
- **Pinned versions.** SDK 57 pins Reanimated 4.5.1 and Worklets 0.10.1 exactly,
  and its changelog says "SDK 57 bundles newer versions of
  react-native-reanimated (4.3 to 4.5), react-native-worklets (0.8 to 0.10), and
  react-native-gesture-handler (2.31 to 2.32)." ([expo-sdk57]) Reanimated 4.5.x
  supports React Native 0.83 through 0.86, and 4.5.1 pairs with Worklets 0.10.x;
  npm's `latest`, 4.7.0, needs Worklets 0.13.x and React Native 0.86
  through 0.88 ([rea-compat]). `npx expo install` picks 4.5.1.
- **Fixes 4.5.1 already has.** 4.5.0 shipped "fix: 30fps layout animations on
  iOS release builds" ([rea-450]), and 4.5.1 shipped "Restore opacity for flaky
  entering animations under Reduce Motion on iOS" ([rea-451]).
- **Performance.** "Animating non-layout properties (like transform, opacity or
  backgroundColor) is generally more performant than animating styles that
  affect layout (like top/left, width/height, margin or padding)." For 120 fps,
  "make sure that CADisableMinimumFrameDurationOnPhone flag is enabled in
  Info.plist" ([rea-perf]); SDK 57's bare template, which prebuild starts from,
  sets it to true ([expo-template-plist]).

[rea-start]: https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/
[rn-082]: https://reactnative.dev/blog/2025/10/08/react-native-0.82
[expo-reanimated]: https://docs.expo.dev/versions/v57.0.0/sdk/reanimated/
[gh-babel-preset]: https://github.com/expo/expo/blob/sdk-57/packages/babel-preset-expo/src/configs/expo.ts
[rea-451]: https://github.com/software-mansion/react-native-reanimated/releases/tag/4.5.1
[expo-template-plist]: https://github.com/expo/expo/blob/sdk-57/templates/expo-template-bare-minimum/ios/HelloWorld/Info.plist

### CSS animations and transitions

- **What they are.** "CSS animations let you play a sequence of style keyframes
  over time." "Use CSS animations for self-contained, declarative motion:
  loading spinners, pulsing badges, looping attention-grabbers, or any
  multi-step animation that plays on its own." ([rea-css]) "CSS transitions let
  you smoothly animate a style property whenever its value changes."
  ([rea-transitions]) They came with Reanimated 4: "Animations based on shared
  values will work the same way as before, simultaneously and interchangeably
  with CSS animations and transitions." ([rea-migration])
- **Properties.** Each has a page under the overviews. `animationName` takes the
  keyframes; `animationDuration` "Defaults to 0."; `animationIterationCount`
  takes a number or `'infinite'` and defaults to 1; `animationTimingFunction`
  "Defaults to ease." and also takes `cubicBezier()`, `linear()`, and `steps()`;
  and `animationDelay`, `animationDirection`, `animationFillMode`, and
  `animationPlayState` complete the set. Transitions have `transitionProperty`,
  `transitionDuration` (0 by default), `transitionTimingFunction` (ease),
  `transitionDelay`, and `transitionBehavior`, and the docs say "We discourage
  the use of all property as it can lead to performance issues." ([rea-css];
  [rea-transitions])
- **No end event in 4.5.1.** The current docs mark the animation and transition
  callbacks as new in 4.6.0, and 4.5.1 has none on iOS ([rea-css]).
- **Reduce Motion doesn't reach them.** No docs page gives CSS animations a
  reduce-motion setting; 4.5.1's CSS types and native CSS code have none, and
  `ReducedMotionConfig` feeds only shared-value and layout animations
  ([gh-rea-util]). Synthesis: CSS keyframes keep playing with Reduce Motion on,
  so the app must swap them itself.
- **SVG.** "CSS animations and transitions for SVG are an experimental feature,
  enabled by default from Reanimated 4.4." ([rea-svg])

[rea-css]: https://docs.swmansion.com/react-native-reanimated/docs/css-animations/overview/
[rea-transitions]: https://docs.swmansion.com/react-native-reanimated/docs/css-transitions/overview/

### Springs and layout animations

| `withSpring` parameter | Reanimated 4 default  | Reanimated 3 default                                        |
| ---------------------- | --------------------- | ----------------------------------------------------------- |
| `damping`              | 120                   | 10                                                          |
| `stiffness`            | 900                   | 100                                                         |
| `mass`                 | 4                     | 1                                                           |
| `duration`             | 550, perceptual       | 2000                                                        |
| `dampingRatio`         | 1                     | 0.5                                                         |
| `velocity`             | 0                     | 0                                                           |
| `overshootClamping`    | false                 | false                                                       |
| `energyThreshold`      | 6e-9                  | `restDisplacementThreshold` 0.01 and `restSpeedThreshold` 2 |
| `reduceMotion`         | `ReduceMotion.System` | `ReduceMotion.System`                                       |
| `clamp`                | undefined             | undefined                                                   |

Sources for the table: [rea-spring]; [rea-spring-3].

- **Two modes.** "The stiffness and damping (physics-based) properties can't be
  used at the same time as duration and dampingRatio (duration-based)." "When
  used together duration and dampingRatio overrides stiffness and damping
  props." `duration` is the "Perceptual duration of the animation in
  milliseconds. Actual duration is 1.5 times the value of perceptual duration."
  ([rea-spring])
- **Why they changed.** "The default parameters of the animation changed as
  well. They proved to be of little use in real-world applications."
  ([rea-migration])
- **`withTiming`.** 300 ms by default, with `Easing.inOut(Easing.quad)` and
  `ReduceMotion.System` ([rea-timing]).
- **Entering and exiting.** "Entering/Exiting animations let you animate
  elements when they are added to or removed from the view hierarchy." Presets
  come in families such as Fade, Bounce, Zoom, Slide, and Stretch, and
  `.duration()` "Defaults to 300." ([rea-entering]) Keyframes "allow you more
  flexibility than standard Entering and Exiting presets", default to 500 ms and
  `Easing.linear`, and need a keyframe 0 or `from` ([rea-keyframe]). Layout
  transitions such as `LinearTransition` animate changes of size and position
  ([rea-layout-transitions]).
- **Not yet.** "Shared Element Transitions is an experimental feature available
  behind a feature flag, not recommended for production use yet." ([rea-shared])

[rea-spring-3]: https://docs.swmansion.com/react-native-reanimated/docs/3.x/animations/withSpring/
[rea-timing]: https://docs.swmansion.com/react-native-reanimated/docs/animations/withTiming/
[rea-entering]: https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/
[rea-keyframe]: https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/keyframe-animations/
[rea-layout-transitions]: https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/layout-transitions/
[rea-shared]: https://docs.swmansion.com/react-native-reanimated/docs/shared-element-transitions/overview/

### Reduce Motion in Reanimated

- **The three settings.** "ReduceMotion.System - This value adjusts the
  animation behavior based on whether the reduced motion accessibility setting
  is activated on the device. When enabled, the animation is disabled;
  otherwise, it remains active." `ReduceMotion.Always` always disables it, and
  "ReduceMotion.Never - This option ensures that the animation remains enabled
  at all times." "By default all animations are configured with
  ReduceMotion.System." ([rea-a11y])
- **What disabled means.** "withSpring and withTiming return the toValue
  immediately"; "withDelay initiates the next animation immediately"; a reversed
  `withRepeat` whose count is infinite or even "does not start"; "withSequence
  exclusively starts animations that have reduced motion disabled"; "entering,
  keyframe, and layout animations instantaneously reach their endpoints"; and
  "exiting animations and shared transitions are omitted" ([rea-a11y]).
  In 4.5.1's code, such an animation sets its value to the end value and
  finishes on its first frame ([gh-rea-util]).
- **`useReducedMotion()` is fixed at launch.** It returns "a boolean indicating
  whether the reduced motion setting was enabled when the app started", and
  "Changing the reduced motion system setting doesn't cause your components to
  rerender." ([rea-use-reduced]) The 4.5.1 hook reads the value once, when its
  module loads ([gh-rea-hook]), and `ReduceMotion.System` uses the same
  launch-time value.
- **A global override.** `ReducedMotionConfig`: "By default it disables all
  animation when the reduced motion is enabled on a device." and "The new
  configuration will be applied globally across the entire application."
  ([rea-reduced-config])
- **Keeping a fade.** The docs keep a fade under Reduce Motion with
  `FadeIn.reduceMotion(ReduceMotion.Never)` ([rea-a11y]); the same option is a
  `reduceMotion` field of `withTiming` and `withSpring`, and a value set on an
  animation beats both the default and `ReducedMotionConfig` ([gh-rea-util]).
- Synthesis for the TRD's plan: a fade built with default options jumps to its
  end under Reduce Motion, and a nod or head shake built from `withSequence` or
  `withRepeat` that returns to rest shows nothing at all, so the reaction
  disappears, which A11Y-3 forbids ([prd-a11y]). The fade needs
  `ReduceMotion.Never`, and the choice between motion and fade needs a value
  that follows `reduceMotionChanged`.

[gh-rea-hook]: https://github.com/software-mansion/react-native-reanimated/blob/4.5.1/packages/react-native-reanimated/src/hook/useReducedMotion.ts
[rea-reduced-config]: https://docs.swmansion.com/react-native-reanimated/docs/device/ReducedMotionConfig/

### Drawing and animating the character

The Guessling can be drawn as images or SVG and moved with Reanimated, or drawn
with Skia, Lottie, or Rive. SDK 57 bundles all but Rive.

| Technique                 | Version for SDK 57                           | Expo Go               | Size added on iOS                            | Reduce Motion                                       |
| ------------------------- | -------------------------------------------- | --------------------- | -------------------------------------------- | --------------------------------------------------- |
| Images or SVG, Reanimated | `react-native-svg` 15.15.4                   | Yes                   | Not stated                                   | Reanimated's rules above                            |
| Skia                      | 2.6.2                                        | Yes                   | About 6 MB to download                       | Reanimated's rules, for values passed in            |
| Lottie                    | `lottie-react-native` 7.3.8                  | No; development build | Not stated                                   | Plays a "reduced motion" marker if the file has one |
| Rive                      | `@rive-app/react-native` 0.4.20, not bundled | No; development build | About 1.67 MB to download, 4.66 MB installed | "Rive does not automatically apply reduced motion"  |

Sources for the table: [expo-svg]; [expo-skia]; [skia-size]; [expo-lottie-pr];
[lottie-reduced]; [rive-expo]; [rive-sizes]; [rive-reduced].

- **SVG.** "react-native-svg allows you to use SVGs in your app, with support
  for interactivity and animation." ([expo-svg]) Reanimated animates SVG props
  through `useAnimatedProps` or inline shared values ([rea-svg]).
- **Skia.** "@shopify/react-native-skia brings the Skia Graphics Library to
  React Native." ([expo-skia]) It needs "react-native@>=0.79 and react@>=19" and
  "at least iOS 14" ([skia-install]), and "on Apple, the increased download size
  will be around 6 MB." ([skia-size]) Reanimated's shared values pass straight
  into Skia's props: "There is no need for functions like
  createAnimatedComponent or useAnimatedProps" ([skia-anim]).
- **Lottie.** Expo still pins `~7.3.8` but has no SDK 57 page for it and took it
  off Expo Go's list ([expo-lottie-pr]). "Lottie's animation view can be
  controlled by either React Native Animated or Reanimated API." "Not all After
  Effects features are supported by Lottie." ([lottie-readme]) On iOS,
  expressions, merge paths, Gaussian blur, luma mattes, and several layer
  effects aren't supported ([lottie-features]). lottie-ios plays a "reduced
  motion" marker instead of the animation when Reduce Motion is on, if the file
  has one, and otherwise plays it normally ([lottie-reduced]). Version 8, now a
  release candidate, rebuilds the native layer on Nitro Modules ([lottie-v8]).
- **Rive.** Rive's docs mark the Nitro-based `@rive-app/react-native` "New
  Runtime (Recommended)"; it needs "React Native: 0.78 or later", "Expo SDK: 53
  or later (for Expo users)", "iOS: 15.1 or later", and
  `react-native-nitro-modules` ([rive-rn]). "Because this package contains
  custom native code, it's not compatible with Expo Go." ([rive-expo])
  The 0.4.20 package ships no config plugin ([npm-rive]), wants
  `react-native-nitro-modules` `>=0.35.10 <0.36`, and pulls in the RiveRuntime
  pod ([rive-podspec]). Rive's docs don't name SDK 57, but its repository builds
  an Expo SDK 57 example in CI ([rive-pr-324]), and an open issue reports that a
  Rive view "disappears before iOS native-stack transition finishes"
  ([rive-issue-356]). "Rive does not automatically apply reduced motion."; Rive
  suggests passing the preference in "with a data binding property" and says
  "Instead of movement, scale, rotation, or bounce, use changes in opacity, or
  color." ([rive-reduced]) The runtime is MIT-licensed, but "Exporting for
  runtime is available on paid plans." ([rive-export]), and the cheapest such
  plan, Cadet, is "$17/seat/mo" ([rive-pricing]).

[expo-skia]: https://docs.expo.dev/versions/v57.0.0/sdk/skia/
[skia-size]: https://shopify.github.io/react-native-skia/docs/getting-started/bundle-size/
[expo-lottie-pr]: https://github.com/expo/expo/pull/37969
[rive-expo]: https://rive.app/docs/runtimes/react-native/adding-rive-to-expo
[rive-sizes]: https://rive.app/docs/runtimes/runtime-sizes
[rive-reduced]: https://rive.app/docs/editor/accessibility/reduced-motion
[skia-install]: https://shopify.github.io/react-native-skia/docs/getting-started/installation/
[skia-anim]: https://shopify.github.io/react-native-skia/docs/animations/animations/
[lottie-readme]: https://github.com/lottie-react-native/lottie-react-native/blob/v7.3.8/README.md
[lottie-features]: https://github.com/airbnb/lottie/blob/master/supported-features.md
[lottie-v8]: https://github.com/lottie-react-native/lottie-react-native/blob/master/MIGRATION-7-TO-8.md
[npm-rive]: https://www.npmjs.com/package/@rive-app/react-native/v/0.4.20
[rive-pr-324]: https://github.com/rive-app/rive-nitro-react-native/pull/324
[rive-issue-356]: https://github.com/rive-app/rive-nitro-react-native/issues/356
[rive-pricing]: https://rive.app/docs/account-admin/pricing

### Gesture Handler in SDK 57

- **Version.** SDK 57 bundles `~2.32.0`, which resolves to 2.32.0, while npm's
  `latest` is 3.3.0; it's "Included in Expo Go" ([expo-gesture]).
- **What it adds.** "Gesture Handler provides a declarative API exposing the
  native platform's touch and gesture system to React Native.", with "Close
  integration with react-native-reanimated to process touch events on the UI
  thread." ([rngh-2x]) "Keep GestureHandlerRootView as close to the actual root
  of the app as possible." ([rngh-install])
- **2.x and 3.x.** The 2.x API is `GestureDetector` with builders such as
  `Gesture.Tap()` and `Gesture.Pan()`; "The most important change brought by
  Gesture Handler 3 is the new hook API." ([rngh-upgrade-3]) The SDK 58 preview
  bundles 3.2.x.
- Synthesis: Guessling's buttons and question field need only React Native's
  `Pressable` and `TextInput`; Gesture Handler matters only for gestures on the
  character itself, such as a tap or a drag.

[expo-gesture]: https://docs.expo.dev/versions/v57.0.0/sdk/gesture-handler/
[rngh-2x]: https://docs.swmansion.com/react-native-gesture-handler/docs/2.x/
[rngh-install]: https://docs.swmansion.com/react-native-gesture-handler/docs/2.x/fundamentals/installation/
[rngh-upgrade-3]: https://docs.swmansion.com/react-native-gesture-handler/docs/guides/upgrading-to-3/

### Haptics in Expo

- **The API.** `impactAsync(style)` takes "one of
  Haptics.ImpactFeedbackStyle.{Light, Medium, Heavy, Rigid, Soft}", "directly
  mapped to UIImpactFeedbackStyle", and defaults to Medium;
  `notificationAsync(type)` takes Success, Warning, or Error, "directly mapped
  to UINotificationFeedbackType", and defaults to Success; and
  `selectionAsync()` is "Used to let a user know when a selection change has
  been registered." ([expo-haptics])
- **When iOS plays nothing.** "On iOS, the Taptic engine will do nothing if any
  of the following conditions are true on a user's device:" "Low Power Mode is
  enabled.", "User disabled the Taptic Engine in settings.", "iOS Camera is
  active (to prevent destabilization).", or "iOS dictation is active (to not
  disturb the microphone input)." ([expo-haptics])
- **How it fires.** Each call makes a new UIKit generator, calls `prepare()`,
  and fires at once ([gh-haptics-module]); Apple: "Calling prepare() and then
  immediately triggering feedback (without any time in between) does not improve
  latency." ([doc-prepare])
- **What each pattern means.** Notification haptics "provide feedback about the
  outcome of a task or action": "Success. Indicates that a task or action has
  completed.", "Warning. Indicates that a task or action has produced a warning
  of some kind.", and "Error. Indicates that an error has occurred." Impact
  haptics "provide a physical metaphor you can use to complement a visual
  experience", from "Light. Indicates a collision between small or lightweight
  UI objects." to "Soft. Indicates a collision between soft or flexible UI
  objects." "Selection haptics provide feedback while the values of a UI element
  are changing." ([hig-haptics]) Of selection, UIKit adds: "Don’t use this
  feedback when the user makes or confirms a selection; use it only when the
  selection changes." ([doc-selection-changed])
- Apple's rules on haptics, optional, consistent, and not overused, are in the
  [Apple notes][apple-haptics].

[gh-haptics-module]: https://github.com/expo/expo/blob/sdk-57/packages/expo-haptics/ios/HapticsModule.swift#L7-L67
[doc-prepare]: https://developer.apple.com/documentation/uikit/uifeedbackgenerator/prepare()

### Short sounds in Expo

- **Players.** `useAudioPlayer` "Creates an AudioPlayer instance that
  automatically releases when the component unmounts."; with
  `createAudioPlayer`, "it is your responsibility to call the release() method
  when the player is no longer needed." ([expo-audio]) The docs replay a clip
  with `player.seekTo(0); player.play();`, and a finished clip pauses at its end
  rather than rewinding ([gh-audio-player]). `preload` "Preloads an audio source
  for near-instant playback later." and "This should be called in module scope,
  before any React components render." ([expo-audio])
- **The documented mode.** `playsInSilentMode` "Determines if audio playback is
  allowed when the device is in silent mode.", documented as true by default;
  `interruptionMode` is documented as `'mixWithOthers'` by default, "Best suited
  for sound effects, UI feedback, or short audio clips." ([expo-audio])
- **The mode in code.** The 57.0.5 iOS code defaults `playsInSilentMode` to
  false, and each call fills the keys it leaves out from those defaults rather
  than keeping earlier values ([gh-audio-records]). The category each
  combination sets ([gh-audio-module]):

| `playsInSilentMode` | `interruptionMode` | Category and options          |
| ------------------- | ------------------ | ----------------------------- |
| false               | `mixWithOthers`    | Ambient, no options           |
| false               | `doNotMix`         | Solo ambient, no options      |
| false               | `duckOthers`       | An error                      |
| true                | `doNotMix`         | Playback, no options          |
| true                | `mixWithOthers`    | Playback with `mixWithOthers` |
| true                | `duckOthers`       | Playback with `duckOthers`    |

- **Apple's categories.** Ambient: "When you use this category, audio from other
  apps mixes with your audio. Screen locking and the Silent switch (on iPhone,
  the Ring/Silent switch) silence your audio." ([doc-ambient]) Solo ambient is
  "The default audio session category.", and "activating your session will
  interrupt any other audio sessions which are also nonmixable."
  ([doc-solo-ambient]) Playback: "When using this category, your app audio
  continues with the Silent switch set to silent or when the screen locks."
  ([doc-playback])
- **When the session changes.** expo-audio sets the category only in
  `setAudioModeAsync`, activates the session on each `play()`, and deactivates
  it about 100 ms after the last player stops, unless `keepAudioSessionActive`
  is set. Nothing runs at launch, so an app that never calls `setAudioModeAsync`
  stays on the system default, solo ambient, and its first sound stops the
  player's music ([gh-audio-module]).
- **The config plugin.** `enableBackgroundPlayback` defaults to true: "On iOS,
  this adds the audio background mode." `microphonePermission` writes a
  microphone usage string unless it's false ([expo-audio]; [gh-audio-plugin]).
  `npx expo install` adds the plugin with those defaults ([gh-auto-plugins]),
  and guideline 2.5.4 allows background services only "for their intended
  purposes" ([apple-guidelines]).
- Synthesis: the configuration that gives the ambient category, from the table
  above, with the plugin set for a game that neither records nor plays in the
  background:

```ts
// Before any sound plays: the silent switch mutes it and music keeps playing.
await setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' })
```

```json
["expo-audio", { "enableBackgroundPlayback": false, "microphonePermission": false }]
```

- Apple's rules on sound and the silent switch are in the
  [Apple notes][apple-sound].

[doc-ambient]: https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/ambient
[doc-solo-ambient]: https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/soloambient
[doc-playback]: https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/playback
[gh-auto-plugins]: https://github.com/expo/expo/blob/sdk-57/packages/@expo/cli/src/install/utils/autoAddConfigPlugins.ts

## App icon and launch screen

### iOS 26 icons and Icon Composer

- **Layers.** "iOS, iPadOS, macOS, and watchOS app icons include a background
  layer and one or more foreground layers that coalesce to create
  dimensionality. These icons take on Liquid Glass attributes like specular
  highlights, refraction, and translucency." "Although you can provide a
  flattened image for your icon, layers give you the most control over how your
  icon design is represented." ([hig-app-icons])
- **Canvas and mask.** The HIG's iOS row reads "1024x1024 px", "Layered", with
  the appearances "Default, dark, clear light, clear dark, tinted light, tinted
  dark" ([hig-app-icons]). "For iOS, iPadOS, and macOS icons, provide square
  layers so the system can apply rounded corners." "Keep primary content
  centered to avoid truncation when the system adjusts corners or applies
  masking." ([hig-app-icons]) "Don’t export the canvas mask because the system
  applies that automatically to ensure a perfect crop." ([doc-icon-composer])
- **Appearances.** "In iOS, iPadOS, and macOS, people can choose whether their
  Home Screen app icons are default, dark, clear, or tinted in appearance." "You
  can design app icon variants for every appearance variant, and the system
  automatically generates variants you don’t provide." ([hig-app-icons]) In Icon
  Composer, "This year we renamed these to default, dark and mono, with the
  artwork producing all the appearances for clear and for tinted."
  ([wwdc25-361]) Dark and tinted icons arrived in iOS 18 ([nr-ios18]) and "a
  stunning clear look" in iOS 26 ([nr-ios26]).
- **Design.** "Prefer a simple background, such as a solid color or gradient,
  that puts the emphasis on your primary design"; "Consider basing your icon
  design around filled, overlapping shapes."; "Include text only when it’s
  essential to your experience or brand."; "Prefer illustrations to photos and
  avoid replicating UI components."; "Make sure to avoid extremely thin line
  weights and sharp corners, because they tend to lose detail and crispness in
  smaller icon sizes at lower resolutions."; and "Don’t use replicas of Apple
  hardware products." ([hig-app-icons])
- **Effects are the system's.** "The system dynamically applies visual effects
  to your app icon layers, so there’s no need to include specular highlights,
  drop shadows between layers, beveled edges, blurs, glows, and other effects."
  "Prefer clearly defined edges in foreground layers." ([hig-app-icons])
- **Dark and mono.** "Use your light app icon as the basis for your dark icon."
  "Avoid creating custom icon variants that swap elements in and out with each
  variant, which may make it harder for people to find your app when they switch
  appearances." ([hig-app-icons]) "We’ve also developed a System Light and
  System Dark gradient that should be used instead of pure white or black
  backgrounds." ([wwdc25-220]) For mono: "Setting at least one element of your
  icon to be white, usually the most prominent or recognizable part, make sure
  it shows up strong." ([wwdc25-361])
- **Tools.** Icon Composer shipped with Xcode 26 ([doc-xcode-26]); Apple's page
  now describes a newer standalone version that "Requires macOS Tahoe 26.4 or
  later." ([icon-composer]) Layers go in "a maximum of four groups to reduce
  complexity", and in systems before 27, "Refraction settings have no visible
  effect." ([doc-icon-composer])
- **Older systems.** For earlier releases, "Xcode automatically generates app
  icon images at build time for those releases from the Icon Composer file."
  "Xcode automatically generates a similar-looking version of the Liquid Glass
  icon for previous releases. If you want your existing icon to appear in
  previous releases, continue to use asset catalogs to represent your app icon."
  ([doc-icon-composer])
- **The store.** "Of course, you will also see the updated version of your icon
  reflected on the App Store product page." ([wwdc25-220]) "If you want to
  change your app icon after publishing, you must create and upload a new
  version of your app. Then, submit it for review." ([asc-app-icon])

[nr-ios18]: https://www.apple.com/newsroom/2024/06/ios-18-makes-iphone-more-personal-capable-and-intelligent-than-ever/
[nr-ios26]: https://www.apple.com/newsroom/2025/06/apple-elevates-the-iphone-experience-with-ios-26/
[wwdc25-220]: https://developer.apple.com/videos/play/wwdc2025/220/
[doc-xcode-26]: https://developer.apple.com/documentation/xcode-release-notes/xcode-26-release-notes
[icon-composer]: https://developer.apple.com/icon-composer/
[asc-app-icon]: https://developer.apple.com/help/app-store-connect/manage-app-information/add-an-app-icon

### Icons in Expo

- **Since SDK 54.** "SDK 54 adds support for iOS 26 Liquid Glass icons, which
  you can create using the new Icon Composer app. The Icon Composer app produces
  a .icon file, which you can reference in your app.json under the ios.icon key"
  ([expo-sdk54]), posted on September 10, 2025.
- **`ios.icon` in SDK 57.** "Local path or remote URL to an image to use for
  your app's icon on iOS. Alternatively, an object specifying different icons
  for various system appearances (e.g., dark, tinted) can be provided. You can
  also provide a path to a .icon directory." ([expo-app-config]) The object form
  takes `light`, `dark`, and `tinted` square PNGs ([expo-app-config]). With Icon
  Composer, "Adding support for dark mode is handled in Icon Composer, so you do
  not need to provide variants when using this approach." ([expo-icons-guide])
- **What prebuild does.** With a `.icon` path, prebuild copies the directory
  into the project, points the app icon build setting at it, and writes no PNG
  icon set, so the images for older systems come from Xcode ([gh-ios-icons]).
  With a PNG or the object form, it writes one 1024 px PNG per appearance and
  flattens the light and tinted ones onto white, keeping transparency only in
  dark ([gh-ios-icons]). For PNGs: "Make sure the icon fills the whole square,
  with no rounded corners or other transparent pixels." ([expo-icons-guide])
- Synthesis on iOS 16.4 through 18: a `.icon` shows Xcode's generated
  look-alike; a single PNG shows as it is, with iOS 18's automatic dark and
  tinted treatments; the object form shows its own dark and tinted PNGs on
  iOS 18; and iOS 16.4 and 17 have no dark or tinted Home Screen icons at all.

[gh-ios-icons]: https://github.com/expo/expo/blob/sdk-57/packages/@expo/prebuild-config/src/plugins/icons/withIosIcons.ts

### Launch screens

- **Apple's rules.** "Design a launch screen that’s nearly identical to the
  first screen of your app or game." "If your app or game displays a solid color
  before transitioning to the first screen, create a launch screen that displays
  only that solid color. Also make sure that your launch screen matches the
  device’s current orientation and appearance mode." "Avoid including text on
  your launch screen, even if your first screen displays text." "Don’t
  advertise. The launch screen isn’t a branding opportunity." And don't "include
  logos or other branding elements unless they’re a fixed part of your app’s
  first screen." ([hig-launching]) The storyboard must "Use only UIKit classes."
  with no connections to code ([doc-launch-screen]).
- **`expo-splash-screen` 57.0.9.** "Using the config plugin, as shown below, is
  the recommended method for configuring the splash screen." Its options are
  `backgroundColor`, `#ffffff` by default; `image`; `imageWidth`, 100 by
  default; `resizeMode`, `contain`, `cover`, or `native`; a `dark` object; and
  per-platform `ios` and `android` objects ([expo-splash]). On iOS, `native`
  becomes `contain`, and the image is a centered square `imageWidth` points wide
  ([gh-splash-config]). Only PNG works: "If you use another image format, making
  a production build of your app will fail." ([expo-icons-guide])
- **A dark splash.** Configuring `dark` makes the plugin set
  `UIUserInterfaceStyle` to `Automatic`, with a warning when
  `userInterfaceStyle` would prevent that ([gh-splash-plist]).
- **Hiding.** "By default, the splash screen will automatically hide when your
  app is ready". `preventAutoHideAsync()` keeps it "until hideAsync is called",
  and "It is recommended to call this in global scope without awaiting".
  `setOptions` takes a `duration`, 400 ms by default, and on iOS a `fade`, off
  by default ([expo-splash]); each call resets the keys it leaves out, and the
  duration applies only with the fade ([gh-splash-options]). Expo Router keeps
  the splash up until navigation is ready and then hides it
  ([gh-router-splash]).
- **Testing.** "Do not use Expo Go or a development build to test your splash
  screen." ([expo-icons-guide]) iOS can show a stale image: "Splash Screens on
  iOS apps can sometimes encounter a caching issue where the previous image will
  flash before showing the new, intended image." ([gh-splash-readme]) And "iOS
  snapshots your app when it’s suspended and may use this snapshot instead of
  the launch screen the next time the app is launched." ([doc-tn3118])

[doc-launch-screen]: https://developer.apple.com/documentation/xcode/specifying-your-apps-launch-screen
[gh-splash-options]: https://github.com/expo/expo/blob/sdk-57/packages/expo-splash-screen/ios/SplashScreenOptions.swift
[gh-router-splash]: https://github.com/expo/expo/blob/sdk-57/packages/expo-router/src/global-state/store.ts#L86-L95
[gh-splash-readme]: https://github.com/expo/expo/blob/sdk-57/packages/expo-splash-screen/README.md#ios-caching
[doc-tn3118]: https://developer.apple.com/documentation/technotes/tn3118-debugging-your-apps-launch-screen

## SF Symbols

### expo-symbols in SDK 57

- **Beta.** "This library is currently in beta and subject to breaking changes."
  It's "Included in Expo Go" ([expo-symbols]).
- **Props.** `name`, an SF Symbol name or one name per platform; `fallback`;
  `type`, which is `'monochrome'` by default, `'hierarchical'`, `'palette'`, or
  `'multicolor'`; `colors`, for palette; `tintColor`; `weight`; `scale`; `size`,
  24 by default; `resizeMode`; and `animationSpec` ([expo-symbols]).
- **Effects.** "Acceptable values are: 'bounce' | 'pulse' | 'scale'", plus
  variable color through `variableAnimationSpec` ([expo-symbols]). In the 57.0.3
  source, every effect sits behind a check for iOS 17.0, and appear, disappear,
  replace, wiggle, breathe, rotate, and draw aren't mapped at all
  ([gh-symbols-ios]).
- **Speed.** The docs define `speed` as "The duration of the animation in
  seconds.", but the code passes it to Apple's speed option, "a preferred speed
  multiplier" whose default is 1.0 ([expo-symbols]; [gh-symbols-ios];
  [doc-speed]).
- **On iOS 16.4.** From the source: symbols draw as still images, and a symbol
  that iOS 16.4 lacks draws nothing, because `fallback` shows only when no name
  is given for the platform ([gh-symbols-ios]). Apple: "Symbols and symbol
  features introduced in a given year aren’t available in earlier operating
  systems." ([hig-sf-symbols])
- **Size and color.** The symbol's box is `size` points and doesn't follow
  Dynamic Type ([gh-symbols-ios]), unlike UIKit's text-style symbols: "Like it
  does for the text, UIKit scales the image to match the current Dynamic Type
  setting." ([doc-symbol-textstyle]) Hierarchical symbols without a tint are
  system blue, and palette colors apply only when there are two or more
  ([gh-symbols-ios]).
- **More effects through Expo UI.** The SwiftUI `Image` in `@expo/ui` takes a
  `symbolEffect` modifier, which "Requires iOS 17.0 and later.", and a
  `variableValue`; its 57.0.19 code maps appear, bounce, breathe, disappear,
  draw on and off (iOS 26), pulse, rotate, scale, variable color, and wiggle
  ([expo-ui-image]).

[doc-symbol-textstyle]: https://developer.apple.com/documentation/uikit/uiimage/symbolconfiguration-swift.class/init(textstyle:)
[expo-ui-image]: https://docs.expo.dev/versions/v57.0.0/sdk/ui/swift-ui/image/

### Symbol animations and iOS versions

| Effect               | What it does, in the HIG's words                                                                                                    | Minimum iOS |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Appear               | "Causes a symbol to gradually emerge into view."                                                                                    | 17.0        |
| Disappear            | "Causes a symbol to gradually recede out of view."                                                                                  | 17.0        |
| Bounce               | "Briefly scales a symbol with an elastic-like movement that goes either up or down and then returns to the symbol’s initial state." | 17.0        |
| Scale                | "Changes the size of a symbol, increasing or decreasing its scale."                                                                 | 17.0        |
| Pulse                | "Varies the opacity of a symbol over time."                                                                                         | 17.0        |
| Variable color       | "Incrementally varies the opacity of layers within a symbol."                                                                       | 17.0        |
| Replace              | "Replaces one symbol with another."                                                                                                 | 17.0        |
| Magic Replace        | "Performs a smart transition between two symbols with related shapes."                                                              | 18.0        |
| Wiggle               | "Moves the symbol back and forth along a directional axis."                                                                         | 18.0        |
| Breathe              | "Smoothly increases and decreases the presence of a symbol, giving it a living quality."                                            | 18.0        |
| Rotate               | "Rotates the symbol to act as a visual indicator or imitate an object’s behavior in the real world."                                | 18.0        |
| Draw On and Draw Off | "draws the symbol along a path through a set of guide points"                                                                       | 26.0        |

Sources for the table: [hig-sf-symbols], and each effect's availability in the
[Symbols framework][doc-symbols].

- **SF Symbols 7.** "SF Symbols 7 is a library of over 6,900 symbols designed to
  integrate seamlessly with San Francisco, the system font for Apple platforms."
  "SF Symbols 7 introduces Draw animations and variable rendering, enhanced
  Magic Replace, gradients, and hundreds of new symbols." "These new symbols are
  available in apps running iOS 26, iPadOS 26, macOS 26, watchOS 26, tvOS 26,
  and visionOS 26." ([sf-symbols-archive]) Apple's live page now describes the
  next release, "a library of over 7,000 symbols", whose new ones need iOS 27
  ([sf-symbols]).
- **Rendering.** "SF Symbols provides four rendering modes — monochrome,
  hierarchical, palette, and multicolor — that give you multiple options when
  applying color to symbols." "Regardless of rendering mode, using
  system-provided colors ensures that symbols automatically adapt to
  accessibility accommodations and appearance modes like vibrancy and Dark
  Mode." "In SF Symbols 7 and later, gradient rendering generates a smooth
  linear gradient from a single source color." "Use variable color to
  communicate change — don’t use it to communicate depth." ([hig-sf-symbols])
  Variable Draw "can be used to convey strength or progress" ([wwdc25-337]).
- **Restraint.** "Apply symbol animations judiciously." "Consider your app’s
  tone when adding animations." ([hig-sf-symbols])

[doc-symbols]: https://developer.apple.com/documentation/symbols
[wwdc25-337]: https://developer.apple.com/videos/play/wwdc2025/337/

### SF Symbols license terms

- **The HIG's pointer.** "Be sure to understand the terms and conditions for
  using SF Symbols, including the prohibition against using symbols — or images
  that are confusingly similar — in app icons, logos, or any other trademarked
  use." ([hig-sf-symbols])
- **The SDK agreement.** Section 2.10: System-Provided Images "are licensed to
  You solely for the purpose of developing Applications for Apple-branded
  products that run on the system for which the image was provided." "You agree
  that you shall not use or incorporate the System-Provided Images or any
  substantially or confusingly similar images into app icons, logos or make any
  other trademark use of the System-Provided Images." "Apple reserves the right
  to review and, in its sole discretion, require modification or discontinuance
  of use of any System-Provided images used in violation of the foregoing
  restrictions, and you agree to promptly comply with any such request."
  ([xcode-sla])
- **The SF Symbols app's license.** Section 2D: "The foregoing rights in
  Sections 2A and 2B(iii) include the right to show the Symbols and modified
  Templates in screen shots, images, mock-ups or other depictions, digital
  and/or print, of such software products running solely on the applicable Apple
  Platforms." And: "Except as expressly provided herein, Symbols and Templates
  may not otherwise be used, extracted, copied, modified, distributed, embedded
  or repackaged as content, images, samples, clip art, or similar assets."
  Section 2E bars putting the symbols, or "any substantially or confusingly
  similar images", "into app icons, logos or make any other trademark use of the
  Symbols." The license, EA1662 of September 6, 2019, ships inside the installer
  on the [SF Symbols page][sf-symbols].
- **Apple products.** "SF Symbols includes copyrighted symbols that depict Apple
  products and features. You can display these symbols in your app, but you
  can’t customize them." ([hig-sf-symbols])
- Synthesis: symbols may appear in the app, in App Store screenshots, and in
  marketing only as screenshots, recordings, or mockups of the app on iPhone;
  never in the icon, the logo, the character, standalone slide or gallery art,
  or as images exported into the RevenueCat paywall.

## RevenueCat Paywalls styling

How the paywall is presented and its Close, Restore, and legal buttons are in
the RevenueCat notes, under [Presenting a paywall][rc-present] and
[Close, restore, and legal buttons][rc-buttons]; its platforms and multipage
floors are in the [related materials][rm-paywalls].

[rc-present]: /docs/research/revenuecat-expo.md#presenting-a-paywall
[rc-buttons]: /docs/research/revenuecat-expo.md#close-restore-and-legal-buttons

### What the paywall editor sets

- **Starting points.** "Pick from a curated template, start from scratch, or
  describe what you want in the AI Editor and let it generate a paywall for
  you." ([rc-paywalls]) "A multipage paywall can have up to 10 screens." The AI
  Editor also takes a design spec: "Provide a design spec — add a design.md file
  to define your brand colors, fonts, and styling guidelines for the AI Editor
  to apply." ([rc-creating])
- **Branding and preview.** "Branding: Update your saved colors and fonts for
  quick access when building." The preview's controls change "the locale,
  light/dark mode, and other preview settings", and "Use the view switcher in
  the preview toolbar to toggle between Full screen view and Sheet view."
  ([rc-creating])
- **Color.** "Each component may have a configurable background color, which can
  be a solid color or a gradient, and may have a specified opacity level."
  ([rc-props]) "Each text component's color can be set to a solid color or a
  gradient.", and "you can configure different gradient values for light and
  dark mode to ensure your text looks great in both themes." ([rc-components])
- **Dark mode.** "Paywalls are configured for light mode by default, but if your
  app supports dark mode you can additionally configure colors and images to be
  used for dark mode." ([rc-states]) Since November 13, 2025, dark mode is "an
  optional setting for paywalls" ([rc-changelog]). In purchases-ios 5.90.1, a
  color with no dark value shows its light value in Dark Mode
  ([gh-rc-transformers]).
- **Components.** Text, image, video, icon, stack, header, footer, package,
  purchase button, tabs, switch, button, carousel, countdown, timeline, and a
  custom web component, plus pre-styled social proof, feature list, and award
  sections; badges are a property of parent components ([rc-components]).
- **Icons.** "Paywalls uses an icon library from Tabler, which means you can
  also search for icons to use from their site." "Unlike other components, icons
  must always have a fixed width and height." ([rc-components])
- **Images and video.** "Uploaded images must be smaller than 2MB, and we
  recommend keeping them under 1MB"; images take light and dark versions, and
  "Alt text can be configured for each image to make them more accessible."
  Video takes MP4 and MOV up to 50 MB, and "On iOS, if a customer has the system
  accessibility setting Reduce Motion enabled, videos will not autoplay even if
  autoplay is enabled on the paywall." ([rc-components])

[rc-creating]: https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls
[rc-props]: https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls/component-properties
[rc-changelog]: https://www.revenuecat.com/docs/tools/paywalls/change-log

### Fonts and text size in paywalls

- **Choices.** The editor offers "System fonts", "Any of sans-serif, serif, or
  monospace", and "Custom fonts you upload to RevenueCat". "Uploaded font files
  must be smaller than 5MB." "The available font weights in the paywall editor
  will be determined by the weights you upload for each font family, so be sure
  to upload each font weight you wish to use on your paywall." ([rc-components])
  Uploads must have "a .ttf or .otf extension" ([rc-api-assets]).
- **How the font reaches the app.** "When a paywall is displayed in your app for
  customers that uses a custom font, the font will be displayed directly from
  the file you've uploaded to RevenueCat." "You can reduce loading times and
  improve performance by adding the font to your app's resources." For a bundled
  font, "Make sure that the filename (without the extension) corresponds to the
  font name in the paywall editor." ([rc-components]) purchases-ios 5.90.1 first
  looks for an installed font by that name, then downloads, checks, and
  registers the upload ([gh-rc-fontmanager]).
- **No font provider.** "Our current Paywalls do not support passing in a custom
  font provider as legacy Paywalls did." ([rc-display]) The `fontFamily` option
  of `presentPaywall()` in 10.10.1 is "Only available for original template
  paywalls. Ignored for V2 Paywalls and web." ([rnpui-src])
- **Dynamic Type.** "Whether font sizes should automatically scale for this
  paywall. Defaults to true." ([rc-api-paywall]) purchases-ios 5.90.1 scales
  custom fonts relative to a text style and system fonts with `UIFontMetrics`
  ([gh-rc-uiconfig]). Sizes set in the editor "will be rendered using
  density-independent values on each platform where the paywall is loaded",
  which on iOS means points ([rc-components]).

[rc-api-assets]: https://www.revenuecat.com/docs/api-v2/paywall/assets
[rnpui-src]: https://github.com/RevenueCat/react-native-purchases/blob/10.10.1/react-native-purchases-ui/src/index.tsx
[gh-rc-uiconfig]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/RevenueCatUI/Templates/V2/ViewModelHelpers/UIConfigProvider.swift

### Paywall localization

- **Where.** "Paywall localization can be managed through the Paywall
  Localization page, or inline through the Paywall Editor directly."
  ([rc-localization])
- **Translation.** "The Paywalls AI Editor can translate your paywall copy into
  other languages." Localizations also export to a CSV and back
  ([rc-localization]).
- **Completeness.** A default locale is the one "your paywall will fall back to
  if a customer's desired locale is unavailable", and "Be sure to enter values
  for all fields in each locale you create in order to be able to publish the
  changes to your Paywall." The page lists 47 locales ([rc-localization]).

[rc-localization]: https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls/localization

### Limits on matching the app

- **Custom code.** "A custom component renders your own HTML, CSS, and
  JavaScript inside your paywall." "Custom components can be used for
  interactive elements such as Lottie or Rive animations and animated
  backgrounds." But "Custom components are self-contained and decorative. They
  should not contain UI that is required for purchasing.", "Values flow one
  way", and "Your paywall's localized strings are not passed to your component,
  so any copy it displays has to live in your bundle." It needs React Native
  "10.6.0+" ([rc-components]).
- **Motion, haptics, and sound.** The docs list no motion settings beyond
  carousels, video, and multipage flows. purchases-ios 5.90.1 "Fires a native
  selection-changed haptic when the user changes the selected package or tab"
  ([gh-rc-haptic]), and the only sound a paywall can play is a video's.
- **VoiceOver and images.** purchases-ios 5.90.1 hides paywall images from
  VoiceOver, beside the comment "WIP: Fix this later when accessibility info is
  available", so the documented alt text doesn't reach VoiceOver on iOS
  ([gh-rc-image]).
- **Presentation.** "RevenueCat Paywalls will show paywalls in a sheet or
  fullscreen on iPhone" ([rc-display]). In React Native 10.10.1,
  `presentPaywall()` sets no style, and purchases-hybrid-common 19.2.0 then
  presents the paywall "with `.pageSheet` to preserve backwards compatibility"
  ([gh-paywall-proxy]): on iPhone, "a sheet with part of the background content
  visible near the top of the screen." ([doc-page-sheet])
- **Symbols.** The icon component offers Tabler icons, not SF Symbols, and SF
  Symbols can't be uploaded as images (see
  [SF Symbols license terms](#sf-symbols-license-terms)).
- **Floor.** Paywalls run on "iOS 15.0 and higher" ([rc-paywalls]).

[gh-rc-haptic]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/RevenueCatUI/Purchasing/SelectionHapticFeedback.swift
[doc-page-sheet]: https://developer.apple.com/documentation/uikit/uimodalpresentationstyle/pagesheet

## Store and pitch assets

### App Store screenshots

- **Count and format.** "You can upload one to 10 screenshots in .jpeg, .jpg,
  and .png formats, with the following specifications." "Note: Images can’t
  include alpha channels or transparencies." ([asc-screenshots])

| Display    | Portrait sizes                        | Landscape sizes                       | Apple's requirement or fallback                                                                        |
| ---------- | ------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 6.9"       | 1260 x 2736, 1290 x 2796, 1320 x 2868 | 2736 x 1260, 2796 x 1290, 2868 x 1320 | No requirement line                                                                                    |
| 6.5"       | 1284 x 2778, 1242 x 2688              | 2778 x 1284, 2688 x 1242              | "Required if app runs on iPhone and screenshots for 6.9" display aren't provided"                      |
| 6.3"       | 1179 x 2556, 1206 x 2622              | 2556 x 1179, 2622 x 1206              | "scaled screenshots for 6.5" displays are used"                                                        |
| iPhone Duo | 1398 × 2034 outer, 2007 × 2853 inner  | 2034 × 1398, 2853 × 2007              | "Support for uploading assets for this device in App Store Connect will be available later this year." |

Source for the table: [asc-screenshots].

- **One set is enough.** On September 11, 2024: "Starting today, when uploading
  app screenshots, you’re only required to provide a single screenshot (6.5"
  or 6.9") for iPhone" ([asc-release-notes]). "If your app's user interface is
  the same across multiple device sizes and localizations, provide only the
  highest resolution screenshots required. They automatically scale down to
  smaller device sizes." ([asc-upload-media])
- **Locked after approval.** "Once your app is submitted for review and
  approved, you must create a new version to update the screenshots."
  ([asc-upload-media])
- **Subscriptions.** Each subscription's App Review screenshot "is used for
  review only and isn't displayed on the App Store"; an optional promotional
  image must be "JPG or PNG.", with "Dimensions of 1024 x 1024 pixels."
  ([asc-iap-info])
- The best practices notes hold the
  [snapshot of these sizes from September 21][bp-screenshots]; the live page
  matched it on September 22.

[asc-release-notes]: https://developer.apple.com/help/app-store-connect/release-notes/
[asc-iap-info]: https://developer.apple.com/help/app-store-connect/reference/in-app-purchases-and-subscriptions/in-app-purchase-information

### App previews

| Item                | Apple's specification                                             |
| ------------------- | ----------------------------------------------------------------- |
| Length              | "15 Seconds" to "30 Seconds"                                      |
| File size           | "500MB" at most                                                   |
| Formats             | H.264, or ProRes 422 (HQ only)                                    |
| File extensions     | ".mov, .m4v, .mp4" for H.264; ".mov" for ProRes                   |
| Frame rate          | "30 frames per second" at most                                    |
| H.264 bit rate      | "10-12 Mbps"                                                      |
| Audio               | "Stereo", "256kbps AAC", "44.1kHz or 48kHz"                       |
| 6.9-inch resolution | 886 x 1920 portrait, 1920 x 886 landscape                         |
| Poster frame        | "5 Seconds" by default                                            |
| Number              | "up to three app previews per supported device size and language" |

Sources for the table: [asc-preview-specs]; [asc-upload-media].

- **Order and processing.** "App previews always precede screenshots on iPhone,
  iPad, Mac, and Apple TV, even if you rearrange them when editing the app
  record." "After you upload your app previews, processing may take up to 24
  hours." ([asc-upload-media])
- **Scaling.** For 6.5-inch displays, "If app previews with the accepted
  resolutions aren't provided, scaled app previews for 6.9" displays are used."
  ([asc-preview-specs])
- **Muted autoplay.** "App previews autoplay with muted audio when users view
  your product page, so make sure the first few seconds of your video are
  visually compelling." ([as-product-page])

### What screenshots and previews may show

- **The guidelines.** 2.3.3: "Screenshots should show the app in use, and not
  merely the title art, login page, or splash screen. They may also include text
  and image overlays (e.g. to demonstrate input mechanisms, such as an animated
  touch point or Apple Pencil) and show extended functionality on device, such
  as Touch Bar." 2.3.4: "previews may only use video screen captures of the app
  itself." and "You can add narration and video or textual overlays to help
  explain anything that isn’t clear from the video alone." ([apple-guidelines])
- **More of section 2.3.** Screenshots and previews must "clearly indicate
  whether any featured items, levels, subscriptions, etc. require additional
  purchases." (2.3.2); "should not include prices, terms, or descriptions that
  are not specific to the metadata type." (2.3.7); must "adhere to a 4+ age
  rating even if your app is rated higher." (2.3.8); and "you should display
  fictional account information instead of data from a real person." (2.3.9)
  ([apple-guidelines])
- **The product page.** "Use images captured from your app’s UI to visually
  communicate your app’s user experience." "Depending on the orientation of your
  screenshots, the first one to three images will appear in search results when
  no app preview is available, so make sure these highlight the essence of your
  app." "If your app supports Dark Mode, consider including at least one
  screenshot that showcases what the experience looks like for users."
  ([as-product-page])
- **Previews.** "Stay within the app. App previews must show only content within
  the app itself. Don’t film people interacting with a device, such as an
  over-the-shoulder angle or fingers tapping the screen." Graphics "such as
  touch hotspots" are allowed, and "Aim to use straightforward transitions, like
  dissolves and fades." Copy should avoid "seasonal or timely references", and
  "If you display features that are only available through in-app purchase, or
  if your app uses a subscription model or requires login, you must disclose
  this." ([as-app-previews])
- **Text on the art.** "If using text, use a short phrase that enhances your
  visual rather than describes it." "Don’t include specific pricing, discounts,
  website URLs, copyright symbols." "Design key elements with a safe area in
  mind to accommodate different devices and orientations." Across a set,
  "consider using similar visual style, such as color palette, iconography,
  fonts, message, and tone." ([as-asset-practices])
- **Device frames.** None of Apple's App Store pages mention frames or bezels
  for store screenshots. For marketing, the rules are strict: "Use
  Apple-provided product bezels in all your marketing materials to display your
  app on the Apple devices it supports." "Use Apple product images “as is” and
  without modification." "Ensure that the minimum device size is no smaller than
  25 mm in height for printed materials and 200 px onscreen." "Display your app
  on the screen as it appears when your app is running." ([as-marketing]) The
  bezel downloads' own license reads "THE APPLE DESIGN RESOURCES LICENSED
  HEREUNDER ARE TO BE USED SOLELY FOR CREATING MOCK-UPS OF USER INTERFACES"
  ([design-resources]).
- **Naming.** "say app name for iPhone or app name for iPad, or use a phrase
  such as works with or compatible with. Don’t say iPhone app name."
  ([as-marketing])

### Devpost gallery and thumbnail

- **Thumbnail.** "Thumbnail image for the Project Gallery | This should be a
  JPG, PNG or GIF format, 5 MB max file size. For best results, use a 3:2
  ratio." ([devpost-126]) No pixel size is given.
- **Gallery.** "Image Gallery | Add any relevant screenshots, logos, charts, or
  images that support your project." ([devpost-126]) The help center gives no
  ratio, format, size, or count for gallery images.
- **Video.** "Your video must be hosted publicly on YouTube, or Vimeo to
  properly embed for the judges." ([devpost-126]) Another article adds Youku
  ([devpost-85]).
- **Shipaton's own rules.** "Include a 1024x1024 app icon", "Include at least
  one screenshot of the app with a resolution of 1179px width and 2556px height
  WITHOUT device frames.", and a video that "should be less than two (2)
  minutes" and "should include footage that shows the Project functioning on the
  device for which it was built" ([shipaton-rules]). The rest of the form is in
  the [Shipaton notes][ship-devpost].
- **What the site does.** Observed on public project pages on September 22,
  2026, and not documented: gallery images show inside an 806 x 573 box, so a
  1290 x 2796 screenshot shows at 264 x 573 ([devpost-heartbeat]); gallery cards
  crop thumbnails around the center to 333 x 222 ([devpost-gallery-2025]); and
  the video embeds as the first slide, at 16:9 ([devpost-dayloop]).

[devpost-heartbeat]: https://devpost.com/software/heartbeat-hero
[devpost-gallery-2025]: https://revenuecat-shipaton-2025.devpost.com/project-gallery
[devpost-dayloop]: https://devpost.com/software/dayloop-everyday-timelapse

## Findings for DESIGN.md

- **Dark Mode on.** Without `userInterfaceStyle`, Expo writes
  `UIUserInterfaceStyle` as `Light`, which forces the light style on the app and
  every system view in it ([gh-ui-style]; [doc-uiuserinterfacestyle]).
  Synthesis: set `"userInterfaceStyle": "automatic"` in `app.config.ts`, add no
  appearance setting of Guessling's own ([hig-dark-mode]), and give every screen
  explicit colors, because React Native's default text is black
  ([rn-text-defaults]). See
  [Dark Mode in the app config](#dark-mode-in-the-app-config).
- **Four variants per color.** Synthesis: define each color token with
  `DynamicColorIOS`, with light, dark, and both high-contrast values, or as a
  `PlatformColor` semantic color; keep all text at 4.5:1 or more in all four,
  aiming for 7:1 for small text, and controls and meaningful graphics at 3:1 or
  more ([hig-color]; [hig-dark-mode]; [wcag22]). Don't set small text in the
  system accent colors on light backgrounds; use them as fills, or use their
  increased contrast values. See
  [Semantic and system colors](#semantic-and-system-colors).
- **Glass only on controls.** Synthesis: the Guessling, the question history,
  and the day's card stay in the content layer without glass; glass is for
  system bars and sheets and at most one or two custom controls, such as the
  send button, in the regular variant, grouped in one `GlassContainer`
  ([hig-materials]; [wwdc25-219]). Don't set `UIDesignRequiresCompatibility`:
  the design assumes glass on iOS 26 and 27, with the iOS 16.4 through 18 look
  as the fallback ([doc-udrc]; [wwdc26-102]). See
  [Glass in custom controls](#glass-in-custom-controls).
- **A fallback for every glass surface.** Synthesis: for each custom glass
  surface, DESIGN.md specifies its look on iOS 16.4 through 18, where
  `GlassView` draws nothing, and with Reduce Transparency on, and never fades
  glass or its parents with opacity ([gh-glass-view]; [expo-glass];
  [doc-visual-effect-view]). See
  [What iOS 16.4 through 18 show](#what-ios-164-through-18-show).
- **The header.** Synthesis: choose either a transparent header, with
  `headerTransparent: true`, a scrolling first child, the automatic scroll edge
  effect, and items in the label color, or Expo Router's opaque default, and
  check the choice on iOS 26 and 27 ([gh-header-config]; [wwdc25-284];
  [hig-scroll-views]). See
  [Headers, sheets, and tabs in Expo Router](#headers-sheets-and-tabs-in-expo-router).
- **A type ramp on Apple's curves.** Synthesis: take the text tokens from the
  HIG's styles at the Large size and give each its `fontSize`, `lineHeight`, and
  matching `dynamicTypeRamp`, so text grows the way the system's does rather
  than by React Native's single multiplier; body text is 17 pt, and nothing is
  under 11 pt at Large ([hig-typography]; [rn-attributed]). See
  [How React Native scales text](#how-react-native-scales-text).
- **Large text never cut off.** Synthesis: questions, answers, and buttons never
  set `allowFontScaling={false}`, `numberOfLines`, or fixed heights; rows switch
  to a stacked layout from AX1, when `fontScale` reaches 1.786; and every screen
  is checked at AX5, as A11Y-2 requires ([hig-typography];
  [rn-utils-multiplier]; [prd-a11y]).
- **Typefaces.** Synthesis: SF Pro Rounded, through `'ui-rounded'`, suits a soft
  character and ships nothing. A custom face, if the team wants one, is one
  static font under the OFL, embedded with the expo-font config plugin under a
  file named for its PostScript name, uploaded to RevenueCat in every weight
  used, and credited with its copyright notice and license text in Settings
  ([hig-typography]; [expo-fonts-guide]; [rc-components]; [ofl-faq]). Counts
  such as turns left use `fontVariant: ['tabular-nums']` ([rn-fontutils]).
- **Three versions of each reaction.** Synthesis: each of the four reactions
  gets a full-motion version, a Reduce Motion version that fades between two
  poses with `reduceMotion: ReduceMotion.Never`, and a still pose, and always
  shows its word; the app picks the version from `AccessibilityInfo` and its
  `reduceMotionChanged` event, not from `useReducedMotion()` alone ([rea-a11y];
  [rea-use-reduced]; [hig-motion]; [prd-a11y]). See
  [Reduce Motion in Reanimated](#reduce-motion-in-reanimated).
- **Motion tokens.** Synthesis: springs are named tokens in the duration form,
  `{ duration, dampingRatio }`, whose real time is 1.5 times the duration;
  reactions are short, animate only transform and opacity, never block the next
  question, and use Reanimated's shared values rather than CSS animations, which
  ignore Reduce Motion ([rea-spring]; [rea-perf]; [hig-motion]). See
  [CSS animations and transitions](#css-animations-and-transitions).
- **How the Guessling is drawn.** Synthesis: layered images or SVG moved by
  Reanimated need no new dependency and run in Expo Go; Rive needs a paid export
  plan, Nitro below 0.36, a development build, and its own Reduce Motion input;
  Lottie needs a development build and a "reduced motion" marker in every file
  ([expo-svg]; [rive-rn]; [rive-export]; [lottie-reduced]). See
  [Drawing and animating the character](#drawing-and-animating-the-character).
- **Haptics.** Synthesis: a light impact on each answer and a success
  notification on the solve; no warning or error pattern for No or "Ask another
  way", no selection pattern for answers, and nothing that only a haptic says,
  since iOS may not play one ([hig-haptics]; [doc-selection-changed];
  [expo-haptics]). See [Haptics in Expo](#haptics-in-expo).
- **Sound.** Synthesis: call `setAudioModeAsync` with `playsInSilentMode: false`
  and `interruptionMode: 'mixWithOthers'` before the first sound, set the
  expo-audio plugin's `enableBackgroundPlayback` and `microphonePermission` to
  false, and keep each cue a short clip with its own player ([gh-audio-records];
  [gh-audio-module]; [gh-audio-plugin]). See
  [Short sounds in Expo](#short-sounds-in-expo).
- **The app icon.** Synthesis: one `.icon` file from Icon Composer as
  `ios.icon`, with a simple colored background, the Guessling's silhouette in
  one to four flat foreground layers, no text, no baked effects, and no SF
  Symbol or anything like one; dark and mono annotations, with the main shape
  white in mono; and Xcode's fallback checked on an iOS 18 simulator
  ([hig-app-icons]; [wwdc25-361]; [xcode-sla]; [doc-icon-composer]). See
  [iOS 26 icons and Icon Composer](#ios-26-icons-and-icon-composer).
- **The launch screen.** Synthesis: a solid background that matches the first
  screen in each appearance, with no text, and no Guessling unless the first
  screen shows it in the same place; checked on a release build
  ([hig-launching]; [gh-splash-plist]; [expo-icons-guide]). See
  [Launch screens](#launch-screens).
- **SF Symbols.** Synthesis: only symbols that exist in iOS 16.4, or a planned
  fallback; no meaning carried by a symbol effect, since iOS 16 plays none;
  symbol sizes scaled with `fontScale`; and a label on every symbol that means
  something ([gh-symbols-ios]; [hig-sf-symbols]). See
  [expo-symbols in SDK 57](#expo-symbols-in-sdk-57).
- **The paywall.** Synthesis: design it as a page sheet in both appearances,
  with dark values for every color and image, the app's font uploaded, font
  scaling left on, Tabler icons close to the app's symbols, and nothing
  essential in images, which VoiceOver skips on iOS ([gh-paywall-proxy];
  [rc-states]; [rc-api-paywall]; [gh-rc-image]). See
  [Limits on matching the app](#limits-on-matching-the-app).
- **Screenshots.** Synthesis: one set at 1320 x 2868, flat RGB with no alpha;
  the first three show a question, a reaction, and the solve; captions are short
  phrases in a band outside the UI, with no prices, URLs, or awards; one
  screenshot is in Dark Mode; paid features are labeled; and one frameless
  1179 x 2556 capture goes to Devpost. Store screenshots stay frameless; a
  framed marketing image uses Apple's current bezel, unchanged and straight-on,
  at least 200 px tall, with copy beside it rather than on it
  ([asc-screenshots]; [as-product-page]; [as-asset-practices];
  [apple-guidelines]; [shipaton-rules]; [as-marketing]). See
  [What screenshots and previews may show](#what-screenshots-and-previews-may-show).
- **Videos.** Synthesis: an app preview, if made, is 886 x 1920 portrait, 15 to
  30 seconds at 30 fps, screen capture only, readable with the sound off, and
  says the archive needs a subscription; the Devpost video runs under two
  minutes on YouTube or Vimeo and shows the app running on an iPhone
  ([asc-preview-specs]; [as-app-previews]; [shipaton-rules]).
- **Devpost images.** Synthesis: a 3:2 thumbnail with the Guessling centered, so
  it survives the gallery card's crop, and landscape gallery images that set two
  or three portrait screenshots side by side, since a lone portrait screenshot
  shows small ([devpost-126]). See
  [Devpost gallery and thumbnail](#devpost-gallery-and-thumbnail).
- **The test matrix.** Synthesis: check each screen on iOS 16.4, 18, and 26 or
  27, in light and dark, with Increase Contrast, Reduce Transparency, and Reduce
  Motion on, and at AX5, in a release build, because some faults show only
  there, as Reanimated's 30 fps layout animations did before 4.5.0 ([rea-450];
  [hig-dark-mode]; [hig-accessibility]).

## Conflicts between sources

With the TRD, which the design should resolve first:

- **Dark Mode.** The TRD's `app.config.ts` sets no `userInterfaceStyle`
  ([trd-build]), so Expo writes `Light` ([gh-ui-style]), against the TRD's "one
  theme with light and dark variants" ([trd-a11y]) and the PRD's A11Y-5
  ([prd-a11y]).
- **The Reduce Motion fade.** The TRD has `useReducedMotion()` swap "the motion
  for a fade between poses" ([trd-reactions]). With Reanimated's default
  setting, that fade jumps to its end, and `useReducedMotion()` keeps the value
  it had at launch ([rea-a11y]; [rea-use-reduced]).
- **Ambient sound.** The TRD's ambient category ([trd-reactions]) needs an
  explicit `setAudioModeAsync` call. The documented default,
  `playsInSilentMode: true`, would mean the playback category, which ignores the
  silent switch; the code's default gives ambient; and never calling it leaves
  solo ambient, which stops the player's music ([expo-audio];
  [gh-audio-records]; [gh-audio-module]). The plugin's defaults also add the
  audio background mode and a microphone usage string.
- **Dynamic Type sizes.** The TRD says "Text uses the system's Dynamic Type
  sizes" ([trd-a11y]), but React Native scales every text by one multiplier
  unless `dynamicTypeRamp` is set, which puts a 34 pt title at about 121 pt at
  AX5, where Apple's Large Title is 60 pt ([rn-attributed]; [hig-typography]).
- **The paywall's checks.** The TRD runs the VoiceOver and Larger Text checks on
  the paywall ([trd-a11y]). purchases-ios 5.90.1 hides paywall images from
  VoiceOver whatever alt text the editor holds ([gh-rc-image]), and a color
  without a dark value shows its light value in Dark Mode
  ([gh-rc-transformers]).

Between the sources:

- **Dimming.** The HIG says 35% ([hig-materials]); SwiftUI's clear-glass example
  uses `.black.opacity(0.3)` ([doc-glass-clear]).
- **When the opt-out ends.** Expo's guide says "From iOS 27"
  ([expo-stack-guide]); Apple ties it to building with the iOS 27 SDK, not to
  the device's version ([doc-udrc]; [wwdc26-102]).
- **GlassView's fallback.** The docs say "regular View" ([expo-glass]); on iOS,
  the code keeps a `UIVisualEffectView` with no effect ([gh-glass-view]). Both
  look like a plain view.
- **Bar backgrounds.** Apple says to remove bar backgrounds and draws bar items
  in `labelColor` ([wwdc25-284]); Expo Router's default header is opaque and
  tints items with the theme's `primary` color ([gh-header-config]).
- **Fades and glass.** The HIG suggests fades under Reduce Motion
  ([hig-accessibility]), but fading a `GlassView` or its parents stops the glass
  from drawing ([expo-glass]).
- **Large text.** The HIG's table lets 18 pt text, and bold text of any size,
  pass at 3:1 ([hig-accessibility]); WCAG's large scale is 18 point or 14 point
  bold, which WCAG2ICT's 1.333 pixels per point makes about 24 pt or 18.7 pt on
  iOS ([wcag22]; [wcag2ict]). The HIG's Dark Mode page asks for 4.5:1 at the
  least ([hig-dark-mode]).
- **`dynamicTypeRamp`'s default.** The docs say `'body'` ([rn-text]); in 0.86.3
  it's unset, so no ramp applies ([rn-attributed]).
- **expo-audio's docs and code.** Besides `playsInSilentMode`, the docs say
  "Only specified properties will be updated.", but iOS resets the keys a call
  leaves out; and `seekTo` is documented as seeking "by" a number of seconds,
  but it seeks to that time ([expo-audio]; [gh-audio-records];
  [gh-audio-player]).
- **Older icons.** Expo's SDK 54 post says "an appropriate fallback will be
  automatically provided by the operating system" ([expo-sdk54]); Apple says
  Xcode generates it at build time ([doc-icon-composer]).
- **Splash defaults.** The options table gives `resizeMode` no default, the API
  section says "contain", and the code uses `contain` ([expo-splash];
  [gh-splash-config]). Expo describes the image as "your app icon or logo"
  ([expo-splash]); the HIG says a launch screen "isn’t a branding opportunity"
  ([hig-launching]).
- **`speed` in expo-symbols.** Documented as a duration in seconds, used as
  Apple's speed multiplier ([expo-symbols]; [doc-speed]).
- **Font names.** RevenueCat matches a bundled font by its file name
  ([rc-components]); Expo says iOS takes the family name from the font file
  ([expo-font]); purchases-ios looks the font up by name ([gh-rc-fontmanager]).
  Synthesis: a file named for the font's PostScript name satisfies all three.
- **Paywall alt text and presentation.** Alt text is documented
  ([rc-components]) but hidden from VoiceOver on iOS ([gh-rc-image]); paywalls
  show "in a sheet or fullscreen" ([rc-display]), but React Native 10.10.1
  always gets a page sheet ([gh-paywall-proxy]).
- **Install commands.** Reanimated's and Rive's docs say `npm install`, which
  would fetch Reanimated 4.7.0 and Nitro 0.37.1, outside SDK 57's Worklets pin
  and Rive's own peer range ([rea-compat]; [rive-rn]; [rive-podspec]). Rive
  gives its Nitro floor as 0.25.2 in its docs and 0.35.10 in its package.
- **The OFL in an app.** FAQ 1.10 lets a font "bundled within a program" ship
  without the license text; FAQ 1.20 says a mobile app "must include the
  copyright statement, the license notice and the license text" ([ofl-faq]).
- **Apple product images.** The Marketing Guidelines want Apple's bezels "in all
  your marketing materials" ([as-marketing]); the bezels' license limits them to
  mockups ([design-resources]); and Apple's trademark guidelines want "an actual
  photograph of the genuine Apple product and not an artist’s rendering"
  ([apple-trademarks]).
- **Devpost's video hosts.** One article says YouTube or Vimeo, another adds
  Youku ([devpost-126]; [devpost-85]); Shipaton's rules say YouTube or Vimeo
  ([shipaton-rules]).
- **Live Reduce Motion.** Apple asks apps to follow the setting while they run
  ([wwdc20-10020]); Reanimated reads it once, at launch ([rea-use-reduced]).
- **SF Symbols 7.** Apple's page no longer describes SF Symbols 7, the release
  that matches the iOS 26.5 SDK, but the release for iOS 27 ([sf-symbols];
  [sf-symbols-archive]).

[trd-a11y]: /docs/archive/guessling-trd.md#accessibility
[doc-glass-clear]: https://developer.apple.com/documentation/swiftui/glass/clear
[apple-trademarks]: https://www.apple.com/legal/intellectual-property/guidelinesfor3rdparties.html

## Gaps

What the sources don't say that DESIGN.md may need, as of September 22, 2026:

- **The Liquid Glass look setting.** No Apple source found names iOS 26's Clear
  and Tinted choice or the version that added it; Apple says only that people
  can "choose a preferred look for Liquid Glass" ([hig-materials]), and no API
  reports the choice.
- **Screens.** Nothing was run on a device or a simulator: the header, sheet,
  and `GlassView` looks on iOS 18 and 26, the New York and SF Mono faces for
  weights they lack, `tabular-nums` in the rounded and serif faces, and whether
  Reanimated sees a Reduce Motion change without a relaunch all come from
  source.
- **Icons on older systems.** Whether Xcode 26.6's fallback from a `.icon`
  includes dark and tinted variants for iOS 18, whether a file saved by the
  newer standalone Icon Composer compiles in Xcode 26.6, and which appearance
  the App Store shows.
- **Color values.** The HIG publishes no RGB values for `label` and the other
  label colors, or the system colors of iOS 16 through 18, so their contrast
  can't be worked out from Apple's pages.
- **Bold Text.** Whether React Native's system text thickens with Bold Text
  isn't documented, and the font code doesn't read the setting.
- **Library facts.** No official app-size figure for Lottie, no `.riv` size
  guidance from Rive, and no statement from Skia on the New Architecture; CSS
  animations' behavior under Reduce Motion is undocumented and comes from
  Reanimated's source.
- **RevenueCat.** Which system fonts the editor lists, where the font-scaling
  switch sits in the editor, how paywalls behave with Bold Text and Increase
  Contrast, and how VoiceOver reads Tabler icons.
- **Devpost.** No documented specs for gallery images or a thumbnail's pixel
  size; the project editor needs a login, so the observed sizes may change.
- **Frames on the App Store.** Apple neither allows nor bans device frames in
  App Store screenshots.
- **iPhone Duo.** Whether its screenshots will be required once uploads open
  ([asc-screenshots]).
- **New symbols on iOS 27.** Whether symbols new in iOS 27 draw in an app built
  with the iOS 26.5 SDK.
- **Prefer Cross-Fade Transitions.** Whether react-native-screens' default push
  follows it, as `UINavigationController` does.

## See also

- The TRD's [iPhone app][trd-app],
  [reactions, sound, and haptics][trd-reactions], and
  [build configuration][trd-build].
- The PRD's [accessibility][prd-a11y] and [compatibility][prd-compat]
  requirements, and [the Guessling character][product-character] in the product
  document.
- [Apple requirements for Guessling][apple-notes], especially
  [haptics][apple-haptics], [sound][apple-sound], [share sheets][apple-share],
  and [Accessibility Nutrition Labels][apple-a11y-labels].
- [RevenueCat and Expo research notes][rc-notes] and the
  [related materials on paywalls][rm-paywalls].
- [Screenshots and app previews on Apple][bp-screenshots] and the
  [Devpost form walkthrough][ship-devpost].

[trd-app]: /docs/archive/guessling-trd.md#the-iphone-app
[apple-notes]: /docs/research/apple-requirements.md
[rc-notes]: /docs/research/revenuecat-expo.md
[sf-symbols-archive]: https://web.archive.org/web/20251115121846/https://developer.apple.com/sf-symbols/
[nr-ios27]: https://www.apple.com/newsroom/2026/09/major-updates-for-apples-software-platforms-are-now-available/
[hig-materials]: https://developer.apple.com/design/human-interface-guidelines/materials
[wwdc25-219]: https://developer.apple.com/videos/play/wwdc2025/219/
[wwdc26-102]: https://developer.apple.com/videos/play/wwdc2026/102/
[doc-adopting-lg]: https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass
[wwdc25-284]: https://developer.apple.com/videos/play/wwdc2025/284/
[hig-toolbars]: https://developer.apple.com/design/human-interface-guidelines/toolbars
[hig-scroll-views]: https://developer.apple.com/design/human-interface-guidelines/scroll-views
[doc-visual-effect-view]: https://developer.apple.com/documentation/uikit/uivisualeffectview
[hig-color]: https://developer.apple.com/design/human-interface-guidelines/color
[doc-udrc]: https://developer.apple.com/documentation/bundleresources/information-property-list/uidesignrequirescompatibility
[expo-stack-guide]: https://docs.expo.dev/router/advanced/stack/
[expo-glass]: https://docs.expo.dev/versions/v57.0.0/sdk/glass-effect/
[gh-glass-view]: https://github.com/expo/expo/blob/9e5319c0f821a27b7924841903abae50e2b41790/packages/expo-glass-effect/ios/GlassView.swift
[gh-header-config]: https://github.com/expo/expo/blob/7687b07947a5c866adeb11abbceae72403ccb188/packages/expo-router/src/react-navigation/native-stack/views/useHeaderConfigProps.tsx
[gh-router-formsheet]: https://github.com/expo/expo/blob/7687b07947a5c866adeb11abbceae72403ccb188/packages/expo-router/src/fork/native-stack/createNativeStackNavigator.tsx
[gh-tabs-39722]: https://github.com/expo/expo/issues/39722#issuecomment-3329340123
[gh-expo-ui-ios]: https://github.com/expo/expo/tree/7687b07947a5c866adeb11abbceae72403ccb188/packages/expo-ui/ios
[expo-sdk54]: https://expo.dev/changelog/sdk-54
[expo-sdk57]: https://expo.dev/changelog/sdk-57
[doc-icon-composer]: https://developer.apple.com/documentation/xcode/creating-your-app-icon-using-icon-composer
[gh-symbols-ios]: https://github.com/expo/expo/tree/sdk-57/packages/expo-symbols/ios
[hig-typography]: https://developer.apple.com/design/human-interface-guidelines/typography
[rn-fontutils]: https://github.com/react/react-native/blob/v0.86.3/packages/react-native/ReactCommon/react/renderer/textlayoutmanager/platform/ios/react/renderer/textlayoutmanager/RCTFontUtils.mm
[rn-attributed]: https://github.com/react/react-native/blob/v0.86.3/packages/react-native/ReactCommon/react/renderer/textlayoutmanager/platform/ios/react/renderer/textlayoutmanager/RCTAttributedTextUtils.mm
[rn-text-defaults]: https://github.com/react/react-native/blob/v0.86.3/packages/react-native/ReactCommon/react/renderer/attributedstring/TextAttributes.cpp#L176-L186
[hig-accessibility]: https://developer.apple.com/design/human-interface-guidelines/accessibility
[rn-text]: https://reactnative.dev/docs/0.86/text
[rn-utils-multiplier]: https://github.com/react/react-native/blob/v0.86.3/packages/react-native/React/Base/RCTUtils.mm#L366-L388
[rn-a11yinfo]: https://reactnative.dev/docs/0.86/accessibilityinfo
[expo-font]: https://docs.expo.dev/versions/v57.0.0/sdk/font/
[expo-fonts-guide]: https://docs.expo.dev/develop/user-interface/fonts/
[ofl-faq]: https://openfontlicense.org/ofl-faq/
[hig-dark-mode]: https://developer.apple.com/design/human-interface-guidelines/dark-mode
[expo-app-config]: https://docs.expo.dev/versions/v57.0.0/config/app/
[gh-ui-style]: https://github.com/expo/expo/blob/sdk-57/packages/@expo/prebuild-config/src/plugins/unversioned/expo-system-ui/withIosUserInterfaceStyle.ts
[doc-uiuserinterfacestyle]: https://developer.apple.com/documentation/bundleresources/information-property-list/uiuserinterfacestyle
[wcag22]: https://www.w3.org/TR/WCAG22/
[wcag2ict]: https://www.w3.org/TR/wcag2ict-22/
[hig-motion]: https://developer.apple.com/design/human-interface-guidelines/motion
[apple-a11y-labels]: /docs/research/apple-requirements.md#what-each-label-claims
[wwdc20-10020]: https://developer.apple.com/videos/play/wwdc2020/10020/
[rea-compat]: https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/
[rea-450]: https://github.com/software-mansion/react-native-reanimated/releases/tag/4.5.0
[rea-perf]: https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/
[rea-migration]: https://docs.swmansion.com/react-native-reanimated/docs/guides/migration-from-3.x/
[gh-rea-util]: https://github.com/software-mansion/react-native-reanimated/blob/4.5.1/packages/react-native-reanimated/src/animation/util.ts
[rea-svg]: https://docs.swmansion.com/react-native-reanimated/docs/guides/animating-svg/
[rea-spring]: https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring/
[rea-a11y]: https://docs.swmansion.com/react-native-reanimated/docs/guides/accessibility/
[rea-use-reduced]: https://docs.swmansion.com/react-native-reanimated/docs/device/useReducedMotion/
[prd-a11y]: /docs/archive/guessling-prd.md#accessibility
[expo-svg]: https://docs.expo.dev/versions/v57.0.0/sdk/svg/
[lottie-reduced]: https://github.com/airbnb/lottie-ios/blob/4.6.0/Sources/Public/Configuration/ReducedMotionOption.swift
[rive-rn]: https://rive.app/docs/runtimes/react-native/react-native
[rive-podspec]: https://github.com/rive-app/rive-nitro-react-native/blob/v0.4.20/RNRive.podspec
[rive-export]: https://rive.app/docs/editor/exporting/exporting-for-runtime
[expo-haptics]: https://docs.expo.dev/versions/v57.0.0/sdk/haptics/
[hig-haptics]: https://developer.apple.com/design/human-interface-guidelines/playing-haptics
[doc-selection-changed]: https://developer.apple.com/documentation/uikit/uiselectionfeedbackgenerator/selectionchanged()
[apple-haptics]: /docs/research/apple-requirements.md#haptics-rules
[expo-audio]: https://docs.expo.dev/versions/v57.0.0/sdk/audio/
[gh-audio-player]: https://github.com/expo/expo/blob/sdk-57/packages/expo-audio/ios/AudioPlayer.swift
[gh-audio-records]: https://github.com/expo/expo/blob/sdk-57/packages/expo-audio/ios/AudioRecords.swift#L3-L10
[gh-audio-module]: https://github.com/expo/expo/blob/sdk-57/packages/expo-audio/ios/AudioModule.swift#L754-L842
[gh-audio-plugin]: https://github.com/expo/expo/blob/sdk-57/packages/expo-audio/plugin/src/withAudio.ts#L42-L66
[apple-guidelines]: https://developer.apple.com/app-store/review/guidelines/
[apple-sound]: /docs/research/apple-requirements.md#sound-and-the-silent-switch
[hig-app-icons]: https://developer.apple.com/design/human-interface-guidelines/app-icons
[wwdc25-361]: https://developer.apple.com/videos/play/wwdc2025/361/
[expo-icons-guide]: https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/
[hig-launching]: https://developer.apple.com/design/human-interface-guidelines/launching
[expo-splash]: https://docs.expo.dev/versions/v57.0.0/sdk/splash-screen/
[gh-splash-config]: https://github.com/expo/expo/blob/sdk-57/packages/expo-splash-screen/plugin/src/getIosSplashConfig.ts#L4-L28
[gh-splash-plist]: https://github.com/expo/expo/blob/sdk-57/packages/expo-splash-screen/plugin/src/withIosSplashInfoPlist.ts#L13-L52
[expo-symbols]: https://docs.expo.dev/versions/v57.0.0/sdk/symbols/
[doc-speed]: https://developer.apple.com/documentation/symbols/symboleffectoptions/speed(_:)-swift.method
[hig-sf-symbols]: https://developer.apple.com/design/human-interface-guidelines/sf-symbols
[sf-symbols]: https://developer.apple.com/sf-symbols/
[xcode-sla]: https://www.apple.com/legal/sla/docs/xcode.pdf
[rm-paywalls]: /docs/research/related-materials.md#paywalls-and-customer-center
[rc-paywalls]: https://www.revenuecat.com/docs/tools/paywalls
[rc-components]: https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls/components
[rc-states]: https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls/customer-states
[gh-rc-transformers]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/RevenueCatUI/Templates/V2/ViewModelHelpers/PaywallComponentTypeTransformers.swift
[gh-rc-fontmanager]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/Sources/Paywalls/PaywallFontManagerType.swift
[rc-display]: https://www.revenuecat.com/docs/tools/paywalls/displaying-paywalls
[rc-api-paywall]: https://www.revenuecat.com/docs/api-v2/paywall
[gh-rc-image]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/RevenueCatUI/Templates/V2/Components/Image/ImageComponentView.swift#L307-L308
[gh-paywall-proxy]: https://github.com/RevenueCat/purchases-hybrid-common/blob/19.2.0/ios/PurchasesHybridCommon/PurchasesHybridCommonUI/Paywalls/PaywallProxy.swift
[asc-screenshots]: https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications
[asc-upload-media]: https://developer.apple.com/help/app-store-connect/manage-app-information/upload-app-previews-and-screenshots
[bp-screenshots]: /docs/research/best-practices.md#screenshots-and-app-previews-on-apple
[asc-preview-specs]: https://developer.apple.com/help/app-store-connect/reference/app-information/app-preview-specifications
[as-product-page]: https://developer.apple.com/app-store/product-page/
[as-app-previews]: https://developer.apple.com/app-store/app-previews/
[as-asset-practices]: https://developer.apple.com/app-store/asset-best-practices/
[as-marketing]: https://developer.apple.com/app-store/marketing/guidelines/
[design-resources]: https://developer.apple.com/design/resources/
[devpost-126]: https://help.devpost.com/article/126-know-your-submission-steps
[devpost-85]: https://help.devpost.com/article/85-uploading-a-demo-video
[shipaton-rules]: https://revenuecat-shipaton-2026.devpost.com/rules
[ship-devpost]: /docs/research/shipaton-2026.md#devpost-form-walkthrough
[trd-build]: /docs/archive/guessling-trd.md#build-configuration
[trd-reactions]: /docs/archive/guessling-trd.md#reactions-sound-and-haptics
[prd-compat]: /docs/archive/guessling-prd.md#compatibility
[product-character]: /docs/archive/guessling-product.md#the-guessling-character
[apple-share]: /docs/research/apple-requirements.md#share-sheet-rules

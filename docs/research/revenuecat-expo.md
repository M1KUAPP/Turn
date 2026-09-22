# RevenueCat and Expo research notes

How to ship RevenueCat purchases in an iPhone-only Expo app and check the
Guessling+ entitlement from a backend, as input to Guessling's product, PRD,
and TRD documents and its [build plan][idea-build]. Every source below was
read on September 22, 2026, so versions, prices, and limits are as of that
date; setup that the [related materials][rm-quickstart] and
[best practices][bp-review] notes already cover is linked, not repeated.

Contents:

1.  [Expo on September 22, 2026](#expo-on-september-22-2026)
    1.  [Expo SDK, React Native, and minimum iOS](#expo-sdk-react-native-and-minimum-ios)
    1.  [EAS Build images and Xcode 26](#eas-build-images-and-xcode-26)
    1.  [iPhone-only apps and iPad compatibility](#iphone-only-apps-and-ipad-compatibility)
    1.  [Export compliance and ITSAppUsesNonExemptEncryption](#export-compliance-and-itsappusesnonexemptencryption)
    1.  [Privacy manifests in Expo](#privacy-manifests-in-expo)
    1.  [EAS Submit to App Store Connect](#eas-submit-to-app-store-connect)
    1.  [Public environment variables](#public-environment-variables)
    1.  [EAS Update and App Store rules](#eas-update-and-app-store-rules)
1.  [The RevenueCat SDK in Expo](#the-revenuecat-sdk-in-expo)
    1.  [SDK versions on September 22, 2026](#sdk-versions-on-september-22-2026)
    1.  [Development builds, Expo Go, and Preview API Mode](#development-builds-expo-go-and-preview-api-mode)
    1.  [Configuring the SDK and API keys](#configuring-the-sdk-and-api-keys)
    1.  [Anonymous App User IDs](#anonymous-app-user-ids)
    1.  [Customer info and entitlement checks](#customer-info-and-entitlement-checks)
    1.  [Offerings, packages, and purchases](#offerings-packages-and-purchases)
    1.  [Restoring purchases in the SDK](#restoring-purchases-in-the-sdk)
    1.  [Trial and introductory-offer eligibility](#trial-and-introductory-offer-eligibility)
    1.  [Apple offer codes](#apple-offer-codes)
1.  [RevenueCat Paywalls and Customer Center in React Native](#revenuecat-paywalls-and-customer-center-in-react-native)
    1.  [Presenting a paywall](#presenting-a-paywall)
    1.  [Close, restore, and legal buttons](#close-restore-and-legal-buttons)
    1.  [Paywall reporting](#paywall-reporting)
    1.  [Customer Center in React Native](#customer-center-in-react-native)
    1.  [RevenueCat plans and pricing](#revenuecat-plans-and-pricing)
1.  [Checking entitlements from a server](#checking-entitlements-from-a-server)
    1.  [REST API v1 subscriber endpoint](#rest-api-v1-subscriber-endpoint)
    1.  [REST API v2 customer and active entitlements](#rest-api-v2-customer-and-active-entitlements)
    1.  [Webhooks for subscription events](#webhooks-for-subscription-events)
    1.  [Trusted Entitlements and server checks](#trusted-entitlements-and-server-checks)
    1.  [Recommended backend pattern](#recommended-backend-pattern)
    1.  [Who can send an app user ID](#who-can-send-an-app-user-id)
1.  [App Privacy label and the SDK privacy manifest](#app-privacy-label-and-the-sdk-privacy-manifest)
1.  [What RevenueCat documents about Expo](#what-revenuecat-documents-about-expo)
    1.  [The RevenueCat Expo guide](#the-revenuecat-expo-guide)
    1.  [Known issues for Expo apps](#known-issues-for-expo-apps)
    1.  [Minimal example](#minimal-example)
1.  [Conflicts between sources](#conflicts-between-sources)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

[idea-build]: /docs/archive/guessling-idea.md#build-plan
[rm-quickstart]: /docs/research/related-materials.md#quickstart-and-sdk-installation
[bp-review]: /docs/research/best-practices.md#apple-app-store-review

## Expo on September 22, 2026

Expo's docs, changelog, and npm packages own the Expo facts; Apple's pages own
the App Store rules they point to.

### Expo SDK, React Native, and minimum iOS

- **Latest SDK.** Expo SDK 57, released June 30, 2026: "This is a small,
  focused release: it brings React Native 0.86 to Expo." ([expo-sdk57]) The
  `latest` tag of the `expo` package is 57.0.24, published September 18, 2026
  ([npm-expo]).
- **React Native.** Expo maps SDK 57 to React Native 0.86 and React 19.2.3
  ([expo-versions]). "expo@57.0.17 updates React Native to 0.86.3"
  ([expo-sdk57]), and the SDK 57 default template pins `react-native` 0.86.3
  ([npm-template]). React Native's own `latest` tag is 0.87.1, published
  August 26, 2026, which no stable Expo SDK targets ([npm-rn]).
- **Minimum iOS.** SDK 57 supports iOS "16.4+" and needs Xcode "26.4+"
  ([expo-versions]). The app config's `ios.deploymentTarget` "Sets the iOS
  deployment target (minimum iOS version)" ([expo-app-config]).
- **SDK 58 is still a beta.** "Expo SDK 58 Beta is now available" was posted
  September 15, 2026: "SDK 58 is built for iOS 27", ships the release
  candidate of React Native 0.88, and "The SDK 58 beta period begins today and
  will last three to four weeks." ([expo-sdk58]) The package's `next` tag is
  `58.0.0-preview.4` ([npm-expo]).
- **Tooling.** `eas-cli` is 24.7.0, published September 16, 2026
  ([npm-eas-cli]).
- Synthesis: build Guessling on SDK 57. SDK 58 won't be stable before the
  September 30 deadline, and its iOS 27 changes are covered below.

[expo-versions]: https://docs.expo.dev/versions/latest/
[npm-rn]: https://www.npmjs.com/package/react-native
[npm-eas-cli]: https://www.npmjs.com/package/eas-cli

### EAS Build images and Xcode 26

- **Default image.** "If you do not provide `image` in eas.json, your build
  by default will use the `auto` alias", and with `auto` "the build image will
  be selected based on the project configuration, Expo SDK version, and React
  Native version." ([eas-infra])
- **What SDK 57 gets.** The image `macos-tahoe-26.5-xcode-26.6` carries the
  `latest` and `sdk-57` aliases, with macOS Tahoe 26.5.2 and "Xcode 26.6
  (17F113)" ([eas-infra]). Apple lists iOS 26.5 as the iOS SDK in Xcode 26.6
  ([apple-xcode]).
- Synthesis: a default EAS build of an SDK 57 app meets Apple's rule that
  uploads since April 28, 2026 use Xcode 26 or later with an iOS 26 SDK (see
  [best practices][bp-timing]).
- **Xcode 27.** Apple already lists Xcode 27 with the iOS 27 SDK
  ([apple-xcode]), but "EAS Build images with Xcode 27 and with the SDK 58
  toolchain are coming soon", and "Until then, the latest EAS Build image
  ships Xcode 26.6." ([expo-sdk58])
- **iOS 27 SDK launch rule.** "Apps built with the iOS 27 SDK must use the
  UIKit scene-based life cycle, or they do not launch correctly on iOS 27."
  SDK 57 gets this only as an opt-in: "expo@57.0.23 adds opt-in scene support,
  enabled with the ios.enableSceneSupport property of expo-build-properties"
  ([expo-sdk57]), which "Requires Expo SDK 57.0.23 or newer"
  ([expo-build-props]).
- **Aliases move.** "The `latest` alias will be updated with every new image
  release", "SDK aliases will be updated with every new SDK release", and "The
  use of a specific name guarantees a consistent environment with only minor
  updates." ([eas-infra])
- Synthesis: set `"image": "macos-tahoe-26.5-xcode-26.6"` in the production
  profile so a new Xcode 27 image can't change the build between review
  submissions.

[eas-infra]: https://docs.expo.dev/build-reference/infrastructure/
[apple-xcode]: https://developer.apple.com/xcode/system-requirements
[bp-timing]: /docs/research/best-practices.md#apple-review-timing-and-expedited-review

### iPhone-only apps and iPad compatibility

- **The setting.** `ios.supportsTablet`: "Whether your standalone iOS app
  supports tablet screen sizes. Defaults to `false`." ([expo-app-config])
  Expo's config plugin turns that default into device family `[1]`, commented
  "is iPhone only" ([expo-device-family]). The SDK 57 default template's
  `app.json` doesn't set the key, so new projects start iPhone-only
  ([npm-template]).
- **It still runs on iPad.** "Even if you have `ios.supportsTablet: false`
  configured, your app will still render at phone resolution on iPads and
  must be usable." And: "Apple may reject your app if elements don't render
  properly on an iPad, even if your app doesn't target the iPad form factor.
  Be sure to test your app on an iPad (or iPad simulator)." ([expo-app-stores])
- **Apple's rule.** Guideline 2.4.1: "To ensure people get the most out of
  your app, iPhone apps should run on iPad whenever possible."
  ([apple-guidelines])
- **Multitasking.** `ios.requireFullScreen` "indicates that your standalone iOS
  app does not support Slide Over and Split View on iPad" ([expo-app-config]).
  But "iOS 27 requires the UIKit scene-based life cycle and makes iPhone apps
  resizable, and apps built with the iOS 27 SDK get both automatically", and
  "On iOS 27, requireFullScreen no longer opts your app out of resizing"
  ([expo-sdk58]). Synthesis: this matters only after a move to Xcode 27.
- **Mac and Vision Pro.** "Users running macOS 11 or later on Macs with Apple
  silicon can access iPhone and iPad apps through the Mac App Store, provided
  no edits are made to the app availability." ([asc-mac]) "Your iPhone and
  iPad apps will be available to users on Apple Vision Pro unless you edit
  their availability in App Store Connect." ([asc-vision]) Both switches sit
  under Pricing and Availability.
- Synthesis: turn off Mac and Vision Pro availability unless the team tests
  there, and run every screen, including the paywall, on an iPad simulator
  before submitting. iPad screenshots stay optional for an iPhone-only app
  (see [screenshots][bp-screenshots]).

[expo-device-family]: https://github.com/expo/expo/blob/sdk-57/packages/%40expo/config-plugins/src/ios/DeviceFamily.ts
[asc-mac]: https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/manage-availability-of-iphone-and-ipad-apps-on-macs-with-apple-silicon
[asc-vision]: https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/manage-availability-of-iphone-and-ipad-apps-on-apple-vision-pro
[bp-screenshots]: /docs/research/best-practices.md#screenshots-and-app-previews-on-apple

### Export compliance and ITSAppUsesNonExemptEncryption

- **Expo.** `ios.config.usesNonExemptEncryption` "Sets
  `ITSAppUsesNonExemptEncryption` in the standalone ipa's Info.plist to the
  given boolean value." ([expo-app-config])
- **Without the key.** "If you don't have the ITSAppUsesNonExemptEncryption
  key in your app's `Info.plist` file, App Store Connect walks you through an
  export compliance questionnaire every time you upload a new version of your
  app. Including the key streamlines the app submission process."
  ([apple-itsenc])
- **What `NO` means.** "Set the value to `NO` if your app—including any
  third-party libraries it links against—doesn't use encryption, or if it
  only uses forms of encryption that are exempt from export compliance
  documentation requirements." "Typically, the use of encryption that's built
  into the operating system—for example, when your app makes HTTPS
  connections using URLSession—is exempt from export documentation upload
  requirements, whereas the use of proprietary encryption is not."
  ([apple-encryption])
- **A catch.** "If your app uses exempt forms of encryption, you might
  alternatively be required to submit a year-end self-classification report
  to the U.S. government." ([apple-encryption])
- Synthesis: Guessling only makes HTTPS calls, to its Worker and to
  RevenueCat, so `usesNonExemptEncryption: false` looks right; the team still
  answers the self-classification question for itself.

[apple-itsenc]: https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption
[apple-encryption]: https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations

### Privacy manifests in Expo

- **App config.** `ios.privacyManifests` is a "Dictionary of privacy manifest
  definitions to add to your app's native PrivacyInfo.xcprivacy file."
  ([expo-app-config])
- **Expo's warning.** Expo SDK packages that use required-reason APIs ship "a
  PrivacyInfo file included in the package directory", but "Apple does not
  correctly parse all the PrivacyInfo files included by static CocoaPods
  dependencies (such as Expo SDK packages and other ecosystem libraries)", so
  "You may need to include the required reasons" in the app's own manifest.
  "Apple will email you within a few minutes of submitting if your app is
  missing any required reasons for the APIs used." ([expo-privacy])
- **Aggregation is on.** The SDK 57 template's Podfile passes
  `privacy_file_aggregation_enabled` unless
  `apple.privacyManifestAggregationEnabled` is `'false'` ([expo-podfile]).
  In `expo-build-properties`: "If enabled, the manifests will be merged into a
  single file. If not enabled, developers will need to manually aggregate
  them." ([expo-build-props])
- **What it merges.** React Native's aggregator reads the
  `PrivacyInfo.xcprivacy` in each pod's resource bundles, merges their
  `NSPrivacyAccessedAPITypes`, and adds React Native's own reasons: file
  timestamp `C617.1`, user defaults `CA92.1`, and system boot time `35F9.1`.
  It doesn't merge collected data types ([rn-privacy]).

What the SDK 57 modules declare, read from each package's manifest:

| Module              | Version | Required-reason APIs and reasons                                 | Source            |
| ------------------- | ------- | ---------------------------------------------------------------- | ----------------- |
| `expo-constants`    | 57.0.19 | User defaults `CA92.1`                                           | [pi-constants]    |
| `expo-system-ui`    | 57.0.4  | User defaults `CA92.1`                                           | [pi-system-ui]    |
| `expo-localization` | 57.0.2  | User defaults `CA92.1`                                           | [pi-localization] |
| `expo-file-system`  | 57.0.7  | File timestamp `0A2A.1`, `3B52.1`; disk space `E174.1`, `85F4.1` | [pi-file-system]  |
| `expo-device`       | 57.0.2  | System boot time `35F9.1`                                        | [pi-device]       |
| `expo-application`  | 57.0.3  | File timestamp `C617.1`                                          | [pi-application]  |

- None of the six declares collected data or tracking. The other SDK 57
  packages checked, including `expo`, `expo-modules-core`, `expo-font`,
  `expo-image`, `expo-router`, `expo-splash-screen`, `expo-updates`, and
  `expo-dev-client`, ship no manifest ([expo-packages]).
- RevenueCat's own manifest is in
  [App Privacy label and the SDK privacy manifest](#app-privacy-label-and-the-sdk-privacy-manifest).

[expo-privacy]: https://docs.expo.dev/guides/apple-privacy/
[expo-podfile]: https://github.com/expo/expo/blob/sdk-57/templates/expo-template-bare-minimum/ios/Podfile
[pi-constants]: https://github.com/expo/expo/blob/sdk-57/packages/expo-constants/ios/PrivacyInfo.xcprivacy
[pi-system-ui]: https://github.com/expo/expo/blob/sdk-57/packages/expo-system-ui/ios/PrivacyInfo.xcprivacy
[pi-localization]: https://github.com/expo/expo/blob/sdk-57/packages/expo-localization/ios/PrivacyInfo.xcprivacy
[pi-file-system]: https://github.com/expo/expo/blob/sdk-57/packages/expo-file-system/ios/PrivacyInfo.xcprivacy
[pi-device]: https://github.com/expo/expo/blob/sdk-57/packages/expo-device/ios/PrivacyInfo.xcprivacy
[pi-application]: https://github.com/expo/expo/blob/sdk-57/packages/expo-application/ios/PrivacyInfo.xcprivacy
[expo-packages]: https://github.com/expo/expo/tree/sdk-57/packages

### EAS Submit to App Store Connect

- **Upload.** `eas submit --platform ios` "will walk you through selecting a
  build, prompt for your Apple ID on first run, and upload the binary to App
  Store Connect. The build appears in TestFlight after processing (usually
  10-15 minutes). To release to production, log in to App Store Connect and
  submit the build for App Review." `eas build --platform ios --auto-submit`
  does both steps ([expo-submit-ios]).
- **Not a review submission.** "A TestFlight build is not automatically
  released to the App Store", and "EAS Submit uploads your binary but does not
  manage store listing metadata, screenshots, or release notes."
  ([expo-submit])
- **App record.** "`eas submit` creates an app record automatically on App
  Store Connect when you submit your first build"; setting `ascAppId` in the
  submit profile skips that ([expo-testflight]).
- Synthesis: the [schedule][idea-schedule] creates the App Store Connect
  record on September 22 to set up the subscriptions, so put its Apple ID in
  `ascAppId`.

[expo-submit-ios]: https://docs.expo.dev/submit/ios/
[expo-submit]: https://docs.expo.dev/deploy/submit-to-app-stores/
[expo-testflight]: https://docs.expo.dev/submit/testflight/
[idea-schedule]: /docs/archive/guessling-idea.md#schedule-to-september-30

### Public environment variables

- **Inlined into the bundle.** "The Expo CLI will automatically load
  environment variables with an `EXPO_PUBLIC_` prefix from .env files".
  "Do not store sensitive info, such as private keys, in `EXPO_PUBLIC_`
  variables. These variables will be visible in plain-text in your compiled
  application." ([expo-env])
- **Static references only.** "Every environment variable must be statically
  referenced as a property of `process.env` using JavaScript's dot notation
  for it to be inlined"; `process.env['EXPO_PUBLIC_KEY']` "is invalid and will
  not be inlined" ([expo-env]).
- **EAS environments.** EAS keeps values per `development`, `preview`, and
  `production` environment, with plain text, sensitive, and secret
  visibility. "anything that is included in your client-side code should be
  considered public and readable to any individual that can run your app",
  and "Secrets do not provide any additional security for values that you end
  up embedding in your application itself." ([eas-env])
- Synthesis: the RevenueCat Apple key and the Worker's URL are public by
  design and can be `EXPO_PUBLIC_` variables; the Test Store key lives only in
  the `development` environment; the RevenueCat secret key and the Jev key
  live only in the Worker.

[expo-env]: https://docs.expo.dev/guides/environment-variables/
[eas-env]: https://docs.expo.dev/eas/environment-variables/

### EAS Update and App Store rules

- **What it updates.** EAS Update lets an app "update its own non-native
  pieces (such as JS, styling, and images) over-the-air". It isn't for a
  "Change to native code or native dependencies" or "Anything that requires a
  new app binary version", and "You need to create a new build for Android or
  iOS to include the `expo-updates` library in your build." ([eas-update])
- **Expo on store rules.** "One of the rules of EAS Update is that you need to
  follow the rules of the platforms and app stores you are building for. This
  means your updates need to follow the App Store and Play Store guidelines,
  including the content of the updates and how you use them. This usually
  means changes to your app's behavior need to be reviewed." ([eas-update])
- **Apple's rule.** Guideline 2.5.2: apps may not "download, install, or
  execute code which introduces or changes features or functionality of the
  app, including other apps." ([apple-guidelines])
- **Privacy label.** "if you use `expo-updates`, you will need to say Yes, we
  collect data from this app and then you will want to select Crash Data."
  ([expo-app-stores])
- Synthesis: a RevenueCat SDK upgrade is native, so it needs a new build.
  Paywall copy and offerings already change remotely without an update, so
  `expo-updates` is worth adding to the first build only if the team wants
  JavaScript bug fixes during judging, and each fix stays a bug fix.

## The RevenueCat SDK in Expo

Offerings, entitlements, the Test Store, and sandbox testing are in the
[related materials][rm-products] and [best practices][bp-sandbox] notes; this
section adds what an Expo app and its Worker need.

[rm-products]: /docs/research/related-materials.md#products-entitlements-and-offerings
[bp-sandbox]: /docs/research/best-practices.md#sandbox-testing-on-apple

### SDK versions on September 22, 2026

| Package                       | Version | Published (UTC)    | Notes                                             |
| ----------------------------- | ------- | ------------------ | ------------------------------------------------- |
| `react-native-purchases`      | 10.10.1 | September 21, 2026 | Peer `react-native` ">= 0.73.0"                   |
| `react-native-purchases-ui`   | 10.10.1 | September 21, 2026 | Peer `react-native-purchases` "10.10.1"           |
| `PurchasesHybridCommon` (pod) | 19.2.0  | Not stated         | Pinned by 10.10.1; depends on `RevenueCat` 5.90.1 |
| `RevenueCat` (purchases-ios)  | 5.90.2  | September 18, 2026 | Newest native release; 10.10.1 uses 5.90.1        |

Sources for the table: [npm-rnp]; [npm-rnpui]; [rnp-podspec]; [phc-podspec];
[gh-ios-releases].

- The one SDK change in 10.10.1 "Updates purchases-hybrid-common to 19.2.0",
  and its release notes list "iOS 5.90.1" among the native releases it brings
  in ([gh-rnp-releases]).
- Feature floors, all below 10.10.1: Paywalls recommend
  `react-native-purchases` "8.11.3 and up" ([rc-paywalls]); Customer Center
  needs `react-native-purchases-ui` "8.7.0 or higher" ([rc-cc-rn]); the Test
  Store needs React Native "9.5.4" ([rc-test-store]); a paywall's offer code
  button needs "9.2.0 and up" ([rc-paywall-offers]).

[rnp-podspec]: https://github.com/RevenueCat/react-native-purchases/blob/10.10.1/RNPurchases.podspec
[phc-podspec]: https://github.com/RevenueCat/purchases-hybrid-common/blob/19.2.0/PurchasesHybridCommon.podspec
[npm-rnpui]: https://www.npmjs.com/package/react-native-purchases-ui
[gh-rnp-releases]: https://github.com/RevenueCat/react-native-purchases/releases
[rc-test-store]: https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store

### Development builds, Expo Go, and Preview API Mode

- **A development build is required.** "To use and test RevenueCat with Expo,
  you'll need to create an Expo development build." The guide installs
  `expo-dev-client`, then runs
  `npx expo install react-native-purchases react-native-purchases-ui`
  ([rc-expo]).
- **Rebuild after installing.** "After installing RevenueCat's SDKs, you must
  run the full build process ... Hot reloading without building will result in
  errors, such as:" ([rc-expo])

  ```text
  Invariant Violation: `new NativeEventEmitter()` requires a non-null argument.
  ```

- **Expo Go.** "`react-native-purchases` includes a built-in Preview API Mode
  specifically for Expo Go." It "replaces native calls with JavaScript-level
  mock APIs", "real purchases will not function in this mode", and "to fully
  test in-app purchases and access real RevenueCat functionality, you must use
  a development build." ([rc-expo]) The UI package's methods log "This method
  is available but has no effect in Preview API mode." ([rnpui-src])
- **Expo agrees.** "In-app purchase libraries require configuring custom
  native code. Native code is not configurable when using Expo Go."
  ([expo-iap]) "A development build is recommended when you want to create
  your own app and release to app stores" ([expo-dev-builds]).
- Synthesis: no config plugin is involved. The 10.10.1 package ships no
  `app.plugin.js` ([npm-rnp]), and RevenueCat's Expo sample lists only
  `expo-router`, `expo-font`, and `expo-web-browser` as plugins
  ([gh-rnp-expo-example]).

[expo-dev-builds]: https://docs.expo.dev/develop/development-builds/introduction/

### Configuring the SDK and API keys

- **Once, with a public key.** "You should only configure Purchases once,
  usually early in your application lifecycle." "Make sure you configure
  Purchases with your public SDK key only." A hybrid app needs "a separate API
  key for each platform", found under "Project Settings > API keys > App
  specific keys" ([rc-configure]).
- **`Purchases.configure`.** It takes `apiKey` and an optional `appUserID`
  that defaults to `null`, which makes the SDK generate an anonymous ID. Its
  `storeKitVersion` is "iOS-only. Defaults to STOREKIT_2. StoreKit 2 is only
  available on iOS 16+." ([rnp-src])
- **Key prefixes.** RevenueCat's docs name only the secret prefix: "Secret API
  keys, prefixed `sk_`, should be kept confidential and only stored on your
  own servers" ([rc-auth]). The iOS SDK's source accepts Apple keys that start
  with `appl_` or `mac_` and treats keys that start with `test_` as Test Store
  keys ("Simulated Store" is its internal name) ([ios-config-src]).
- **Test Store keys crash release builds.** The launch checklist warns "Using
  a Test Store API key in production will crash your app." ([rc-launch]) The
  code does it on purpose: "In release builds, we intentionally crash to
  prevent submitting an app with a Test Store API key", with an alert and then
  `fatalError` ([ios-config-src]).
- **Which EAS builds are release builds.** In eas.json, `buildConfiguration`
  "Defaults to "Release"", and `developmentClient: true` sets it to `Debug`
  ([eas-json]).
- Synthesis: only the `development` profile may carry the `test_` key. A
  `preview` build, a TestFlight build, and the review build are Release
  builds and crash with it; they use the `appl_` key.
- **In-App Purchase Key.** "This is a required configuration step. When using
  Purchases v5.x+ (i.e., StoreKit 2), transactions will fail to be recorded
  without this key being set." React Native "8.0.0+" needs it. Generate it in
  App Store Connect under "Users and Access → Integrations → In-App Purchase",
  where "you get one shot to download it", then upload the `.p8` file and the
  Issuer ID to the RevenueCat app ([rc-iap-key]).
- Synthesis: with iOS 16.4 as the floor, every device uses StoreKit 2, so the
  key belongs on the September 22 list next to the Paid Apps Agreement.

[rc-configure]: https://www.revenuecat.com/docs/getting-started/configuring-sdk
[eas-json]: https://docs.expo.dev/eas/json/
[rc-iap-key]: https://www.revenuecat.com/docs/service-credentials/itunesconnect-app-specific-shared-secret/in-app-purchase-key-configuration

### Anonymous App User IDs

- **Generated and cached.** "RevenueCat will generate a new random App User
  ID (prefixed with `$RCAnonymousID:`) for you, and will cache it on the
  device. In the event that the user deletes and reinstalls the app, the
  cache will be cleared and a new random anonymous App User ID will be
  generated." ([rc-identify]) "A user's app user id is cached on the device,
  so this value will persist between app launches." ([rc-caching])
- **Format.** The iOS SDK builds the ID as `$RCAnonymousID:` plus a UUID with
  its dashes removed, lowercased, and recognizes anonymous IDs with the
  pattern `\$RCAnonymousID:([a-z0-9]{32})$` ([ios-identity-src]).
- **Reading it.** `Purchases.getAppUserID()` returns the current ID and
  `Purchases.isAnonymous()` says whether RevenueCat generated it
  ([rnp-src]). "We strongly recommend revealing the App User ID to your
  customers somewhere within your app." ([rc-identify])
- **Reinstall and restore.** The default restore behavior transfers
  purchases, and "if an anonymous ID restores and the owner of the receipt is
  also anonymous, the anonymous identifiers will be merged (aliased)." For an
  app that "Does not have any login mechanism and only relies on RevenueCat
  anonymous App User IDs", RevenueCat calls "Transfer to new App User ID"
  "Required to allow customers to restore transactions after uninstalling /
  reinstalling your app." ([rc-restore-behavior])
- **Merged IDs.** "Looking up any of the merged App User IDs in RevenueCat
  will return the same `CustomerInfo`" ([rc-identify]).
- **Sandbox quirk.** "If you're using RevenueCat generated App User IDs on
  iOS, you won't be able to restore purchases after an uninstall in sandbox
  until you make another purchase." ([rc-launch])
- **Scope.** Anonymous IDs "are not able to share subscription status across
  apps and platforms" ([rc-identify]), which an iPhone-only app doesn't need.

[rc-restore-behavior]: https://www.revenuecat.com/docs/projects/restore-behavior

### Customer info and entitlement checks

- **Checking.** "It's safe to call `getCustomerInfo()` frequently throughout
  your app." In React Native, the customer has the entitlement when
  `customerInfo.entitlements.active[<my_entitlement_identifier>]` isn't
  `undefined` ([rc-customer-info]).
- **Cache.** "The SDK will update the cache if it's older than 5 minutes, but
  only if you call `getCustomerInfo()`, make a purchase, or restore purchases"
  ([rc-customer-info]); in the background the limit is "25 hours"
  ([rc-caching]).
- **Listener.** `Purchases.addCustomerInfoUpdateListener(listener)` and
  `removeCustomerInfoUpdateListener` ([rnp-src]). It fires "whenever we
  receive a change in CustomerInfo on the current device", and "CustomerInfo
  updates are not pushed to your app from the RevenueCat backend, updates can
  only happen from an outbound network request to RevenueCat."
  ([rc-customer-info])
- **Offline entitlements.** "In the very uncommon case that RevenueCat
  servers don't respond as expected, the SDK is prepared to verify
  Apple/Google/Amazon's purchases on the device itself and grant entitlements
  temporarily." Those purchases "won't appear in our RevenueCat graphs and
  webhooks until it's successfully pushed." ([rc-customer-info])
- Synthesis: in that window the app can show Guessling+ as active while the
  Worker still refuses an archive puzzle, so the app needs a retry state for
  a refused archive request, not just the paywall.

### Offerings, packages, and purchases

- **Offerings.** "The `getOfferings` method will fetch the Offerings from
  RevenueCat. These are pre-fetched in most cases on app launch"; the default
  offering "can easily be accessed via the `current` property"
  ([rc-displaying]).
- **Package identifiers.** The iOS SDK maps the annual package type to
  `$rc_annual` and the monthly one to `$rc_monthly`, next to `$rc_weekly`,
  `$rc_two_month`, `$rc_three_month`, `$rc_six_month`, and `$rc_lifetime`
  ([ios-packagetype-src]); offerings also expose `annual` and `monthly`
  properties ([rc-displaying]).
- **Empty offerings.** "If your offerings, products, or available packages
  are empty, it's due to some configuration issue in App Store Connect or the
  Play Console." ([rc-displaying])
- **Buying.** `Purchases.purchasePackage(pkg)` resolves to
  `{ customerInfo, productIdentifier }`; "Rejections return an error code, a
  boolean indicating if the user cancelled the purchase, and an object with
  more information." ([rnp-src]) "The `userCancelled` boolean is a helper for
  handling user cancellation errors", and "RevenueCat automatically
  finishes/acknowledges/consumes transactions" ([rc-purchases]).

[rc-displaying]: https://www.revenuecat.com/docs/getting-started/displaying-products
[ios-packagetype-src]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/Sources/Purchasing/PackageType.swift
[rc-purchases]: https://www.revenuecat.com/docs/getting-started/making-purchases

### Restoring purchases in the SDK

- **From a tap only.** "The `restorePurchases` method should not be triggered
  programmatically, since it may cause OS level sign-in prompts to appear, and
  should only be called from some user interaction (e.g. tapping a "Restore"
  button.)" "If you are trying to restore a purchase programmatically, use
  `syncPurchases` instead." ([rc-restoring])
- **Always offer it.** "It is recommended that all apps have some way for
  users to trigger the `restorePurchases` method, even if you require all
  customers to create accounts." ([rc-restoring]) Apple's restore rule is in
  the [guidelines notes][bp-guidelines].
- **What it does.** `restorePurchases()` "Restores a user's previous purchases
  and links their appUserIDs to any user's also using those purchases."
  ([rnp-src])

[rc-restoring]: https://www.revenuecat.com/docs/getting-started/restoring-purchases
[bp-guidelines]: /docs/research/best-practices.md#app-review-guidelines-for-a-subscription-app

### Trial and introductory-offer eligibility

- **Apple applies it.** "when an eligible user attempts to purchase a product
  that has an introductory offer (e.g. a free trial) the offer will be applied
  automatically." "For iOS, new subscribers are always eligible. Lapsed
  subscribers who renew are eligible if they haven't previously used an
  introductory offer for the given product or any product within the same
  subscription group. Existing subscribers are not eligible for an
  introductory offer for any product within the same subscription group."
  ([rc-offers])
- **Checking it.** `Purchases.checkTrialOrIntroductoryPriceEligibility(ids)`
  is iOS-only and returns, per product, a `status` of
  `INTRO_ELIGIBILITY_STATUS_UNKNOWN`, `INTRO_ELIGIBILITY_STATUS_INELIGIBLE`,
  `INTRO_ELIGIBILITY_STATUS_ELIGIBLE`, or
  `INTRO_ELIGIBILITY_STATUS_NO_INTRO_OFFER_EXISTS` ([rnp-src];
  [phc-offerings]). "The best course of action on unknown status is to display
  the non-intro pricing, to not create a misleading situation." ([rnp-src])
  "RevenueCat uses a best-effort approach ... The native store payment sheet
  will ultimately display the correct eligibility before the customer
  subscribes." ([rc-offers])
- **On a paywall.** Text can switch on eligibility through a "Text field for
  an introductory offer" property, and visibility rules can hide components
  ([rc-paywall-offers]).
- **The key again.** RevenueCat's offer table lists the subscription key as
  "Required (in StoreKit2)" for introductory offers; that key is the In-App
  Purchase Key ([rc-ios-offers]).

[rc-offers]: https://www.revenuecat.com/docs/subscription-guidance/subscription-offers
[phc-offerings]: https://github.com/RevenueCat/purchases-hybrid-common/blob/19.2.0/typescript/src/offerings.ts

### Apple offer codes

The plan gives judges one-time-use codes for a free month; these are the rules
for creating, testing, and redeeming them.

- **Code types.** Apple has "three types of offer codes: one-time use codes,
  custom codes, and sandbox codes for testing." ([sk-offer-codes])
- **One-time use codes.** "In order for customers to redeem codes, your app
  must be in the Ready for Sale state." A batch holds "a minimum of 500 and a
  maximum of 25,000", codes last up to six months, "Customers are limited to
  redeeming one code per offer", and "It may take up to an hour before codes
  are redeemable by customers." ([asc-offer-codes])
- **Custom codes.** Named codes, "for example, SPRINGPROMO", "that customers
  redeem through a redemption URL or within your app"; each gets a redemption
  limit "of up to 25,000 at a time", and "An expiration date isn't required
  for custom codes." ([asc-offer-codes])
- **Where customers redeem.** One-time codes work in the App Store's "Redeem
  Gift Card or Code" page, through a redemption URL, or in the app if it
  implements the StoreKit method ([asc-offer-codes]). RevenueCat gives this
  URL format ([rc-ios-offers]):

  ```text
  https://apps.apple.com/redeem?ctx=offercodes&id={apple_app_id}&code={code}
  ```

- **In React Native.** `Purchases.presentCodeRedemptionSheet()` is "iOS only.
  Presents a code redemption sheet" ([rnp-src]). A paywall button can open
  the same sheet from `react-native-purchases` 9.2.0; on older SDKs the button
  isn't shown ([rc-paywall-offers]).
- **RevenueCat's cautions.** "Since launch, Apple's in-app Offer Code
  redemption sheet has proven to be extremely unstable." "Additionally,
  sandbox and TestFlight behavior has been seen to be inconsistent." "Apple
  does not provide a callback to determine if the code redemption was
  successful", so the app listens for customer info updates. "The Offer Code
  redemption sheet may not display on a device if you haven't yet launched the
  App Store app and accepted the terms agreement." After a redirect to the App
  Store, "It is important to call syncPurchases when the user returns back to
  your app", and "In order for RevenueCat to accurately track revenue for
  offer codes, you will need to upload an in-app purchase key."
  ([rc-ios-offers])
- **Testing in sandbox.** "Sandbox codes are one-time use codes for testing
  purposes. You can test offer redemptions through your Sandbox Account
  settings on iOS 16.3, macOS 15.0, and visionOS 1.0 or later, and if your
  app supports the required StoreKit APIs." Each request creates "a minimum of
  10 and a maximum of 10,000 codes", valid "for a maximum of six months"
  ([asc-offer-codes]).
- **How to redeem one.** Sign in with a Sandbox Apple Account; "On the Sandbox
  Account Settings page, tap Initiate Transaction", then "Select Offer Codes
  and redeem a sandbox offer code you created in App Store Connect." "If your
  app supports redeeming offer codes in your app, test redeeming a sandbox
  offer code from your app." The sandbox "doesn't enforce a redemption limit
  for a Sandbox Apple Account" but "applies eligibility criteria to offer
  codes for auto-renewable subscriptions. To test subscription offer codes
  again, clear the sandbox account purchase history." ([sk-offer-codes])
- **TestFlight.** "Apps that you download from TestFlight always run in the
  sandbox environment. However, to access the sandbox controls for testing,
  you need to sign out of your production Apple Account in Media & Purchases,
  and sign in with a Sandbox Apple Account in Developer settings." Apple
  suggests "a dedicated testing device" for this ([sk-sandbox]). Xcode's
  StoreKit Testing can also simulate offer codes ([sk-offer-codes]).
- **Tracking.** Webhook events carry `offer_code`: "Offer or promotion code
  used for the transaction." ([rc-webhook-events]) Apple's older promo codes
  are out: "New promo codes cannot be created after March 26, 2026."
  ([rc-ios-offers])
- Synthesis: test the judge flow with sandbox codes in a TestFlight build
  before September 27. Once the app is Ready for Sale, create the judges'
  codes (a one-time batch starts at 500; a custom code with a small
  redemption limit is the lighter option), wait an hour, and redeem one on a
  real device. Give judges the redemption URL and tell them to tap Restore
  Purchases if Guessling+ doesn't unlock.

[sk-sandbox]: https://developer.apple.com/documentation/storekit/testing-in-app-purchases-with-sandbox

## RevenueCat Paywalls and Customer Center in React Native

Paywall platforms, the multipage minimums, and what reviewers check are in
the [related materials][rm-paywalls] note.

### Presenting a paywall

- **Three ways.** `RevenueCatUI.presentPaywall()` shows the current offering's
  paywall; `RevenueCatUI.presentPaywallIfNeeded()`, given a
  `requiredEntitlementIdentifier`, "will present a paywall only if the
  customer does not have an unlocked entitlement"; and
  `<RevenueCatUI.Paywall>` is a component placed on any screen. Both functions
  take an optional `offering` ([rc-paywalls-display]).
- **Results.** The functions resolve to a `PAYWALL_RESULT`: `NOT_PRESENTED`
  ("Only returned when using "presentPaywallIfNeeded""), `ERROR` ("If an error
  happened during purchase/restoration"), `CANCELLED` ("If the paywall was
  closed without performing an operation"), `PURCHASED`, or `RESTORED`
  ([phc-enums]).
- **Component callbacks.** `onPurchaseStarted`, `onPurchaseCompleted`,
  `onPurchaseError`, `onPurchaseCancelled`, `onRestoreStarted`,
  `onRestoreCompleted`, `onRestoreError`, and `onDismiss`
  ([rc-paywalls-display]); the 10.10.1 source adds
  `onPurchasePackageInitiated`, `onWebCheckoutOpened`, `onUrlOpened`, and
  `onInteraction` ([rnpui-src]).
- **Callback details.** `onDismiss` "Will be called when the close button is
  pressed (if enabled) or when a purchase succeeds", and `onRestoreCompleted`
  "may be called even if no entitlements have been granted."
  ([rc-paywalls-display])

[rc-paywalls-display]: https://www.revenuecat.com/docs/tools/paywalls/displaying-paywalls

### Close, restore, and legal buttons

- **The close flag is for old templates.** `displayCloseButton`: "Whether to
  display the close button or not. Only available for original template
  paywalls. Ignored for V2 Paywalls and web." It defaults to `true` in
  `presentPaywall` and `presentPaywallIfNeeded` ([rnpui-src]).
- **Buttons in today's editor.** A Button component has three actions:
  "Restore Purchases", "Navigate back", and "Navigate to". "Navigate to
  additionally supports navigating to your Privacy Policy, Terms of Service,
  any other custom URL of your choosing, offer code redemption sheets on the
  App Store, or custom configured sheets." ([rc-paywall-components])
- **Delayed close.** "Delayed close buttons may be rejected during Apple's App
  Review process as they can be seen as preventing users from easily
  dismissing paid content" ([rc-paywall-components]).
- **Templates.** No current page promises that a template includes these
  buttons. A multipage paywall's last page "should include ... any required
  legal links (such as Terms of Service and Privacy Policy)", and the AI
  Editor can flag "a missing restore purchases link" ([rc-paywalls-create]).
  Only the original templates were described as carrying "Restore purchases",
  "Terms of Service", and "Privacy Policy" components ([rc-paywalls-legacy]).
- Synthesis: build the Guessling+ paywall with a visible Navigate back button
  (it is dismissible by design), a Restore Purchases button, and Terms of Use
  and Privacy Policy buttons, then check all four on a device.

[rc-paywalls-create]: https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls
[rc-paywalls-legacy]: https://www.revenuecat.com/docs/tools/paywalls-legacy/creating-paywalls

### Paywall reporting

The team must report paywall views, trial starts, and conversions without an
analytics SDK; RevenueCat's charts cover all three.

- **Impressions are automatic.** "RevenueCat Paywalls track impressions
  automatically." ([rc-impressions])
- **Where they show.** "Charts v3 is our default charts experience, with
  real-time updates on most charts." Its chart list marks four paywall charts
  "(Charts v3 only)": Paywall Abandonment, Paywall Conversion, Paywall
  Encounter, and Paywall LTV ([rc-charts]).
- **Paywall Conversion.** It reports "Paywall Viewers", "Initial Conversions
  (3 days)", "Paid Conversions", "Trial Starts", and "Trial Conversions",
  counts unique customer-paywall pairs, is "segmented by paywall by default",
  and counts an initial conversion only if it happens "latest on the third
  calendar day after the paywall impression". "This chart only tracks
  impressions and conversions from RevenueCat Paywalls."
  ([rc-paywall-conversion])
- **Fresh cohorts lag.** "very recent periods may be incomplete until the full
  3 days have elapsed" ([rc-paywall-conversion]).
- **Other charts.** Paywall Encounter "measures how many of your new customers
  encounter a paywall after opening your app for the first time"
  ([rc-paywall-encounter]). New Trials "measures trial starts and
  trial-to-trial product changes in a period" by date, not by cohort
  ([rc-new-trials]).
- **Test traffic doesn't count.** Charts show production data only (see
  [charts][rm-charts]), and "RevenueCat also treats the TestFlight install
  itself as sandbox. Paywall views uploaded from that install, including views
  before any purchase, are excluded from experiment results the same way
  sandbox purchases are." ([rc-sandbox-apple])
- **Exporting events.** Paywall events go to Amplitude, Mixpanel, PostHog, or
  Segment; "Paywall event delivery is opt-in, and you enable it per
  integration", and "Paywall events are not purchase lifecycle events."
  ([rc-paywall-integrations]) Webhooks carry no paywall events
  ([rc-webhook-events]).
- **Plan.** The pricing page says the Pro plan includes "All of RevenueCat's
  features and all of your data" ([rc-pricing]), and none of the chart pages
  names a plan.
- Synthesis: on September 28, Paywall Conversion already counts viewers for
  the latest days, but their rates stay incomplete for three days, so quote
  trial starts from New Trials and label recent rates as partial. The
  dashboard works in UTC, and by September 30 the cohorts through
  September 26 are complete.

[rc-impressions]: https://www.revenuecat.com/docs/getting-started/tracking-custom-paywall-impressions
[rc-paywall-conversion]: https://www.revenuecat.com/docs/dashboard-and-metrics/charts/paywall-conversion-chart
[rc-paywall-encounter]: https://www.revenuecat.com/docs/dashboard-and-metrics/charts/paywall-encounter-chart
[rc-new-trials]: https://www.revenuecat.com/docs/dashboard-and-metrics/charts/new-trials-chart
[rm-charts]: /docs/research/related-materials.md#charts-and-traction-metrics

### Customer Center in React Native

- **Opening it.** `await RevenueCatUI.presentCustomerCenter()` presents it,
  with optional callbacks such as `onRestoreCompleted`,
  `onRefundRequestStarted` (iOS only), and `onManagementOptionSelected`; it
  needs `react-native-purchases-ui` "8.7.0 or higher" ([rc-cc-rn]). The
  current release, 10.10.1, also has a `RevenueCatUI.CustomerCenterView`
  component to embed it in a screen ([rnpui-src]).
- **Platforms.** iOS "15.0 and higher" ([rc-cc-install]).
- **Plan.** "Customer Center is available on Pro and Enterprise plans."
  ([rc-cc]) Its features are listed in the [related materials][rm-paywalls].
- Synthesis: new accounts start on the Pro plan (next section), so Customer
  Center costs nothing below $2,500 of monthly tracked revenue. Guessling's
  first version doesn't need it; a Restore Purchases button meets the rule.

[rc-cc-install]: https://www.revenuecat.com/docs/tools/customer-center/customer-center-installation
[rc-cc]: https://www.revenuecat.com/docs/tools/customer-center

### RevenueCat plans and pricing

- **Pro plan.** "Pay nothing for up to $2,500 in monthly tracked revenue.
  Then pay 1% of what you track once you hit $2,500 in MTR." The only other
  plan is Enterprise, at "Custom Pricing & Usage" ([rc-pricing]).
- **MTR.** "MTR stands for monthly tracked revenue. It's the amount of revenue
  tracked by RevenueCat (in USD, before the platform cut) during a one-month
  billing period." ([rc-pricing])
- **Above the line.** "Once you reach $2.5K MTR, you'll be charged 1%. For
  $2.5K, we'll charge you $25. No charges apply on months when you don't hit
  the $2.5K threshold." ([rc-pricing])
- **Card on file.** A card is optional at sign-up, "However, if you don't
  provide credit card details and you reach $2.5k in MTR (congratulations!),
  parts of the product will become unavailable until you do." ([rc-pricing])
- **Legacy plans.** "For customers on Basic or Starter, you'll be prompted to
  move to the new Pro plan" ([rc-pricing]); webhooks "are available on our Pro
  plan" ([rc-webhooks]).
- Synthesis: there is no separate free plan any more; a new project is on Pro
  and pays nothing at Guessling's scale, with webhooks, Customer Center, and
  the paywall charts included.

## Checking entitlements from a server

The project ID and secret-key basics are in the
[related materials][rm-keys]; this section covers reading an entitlement from
the Worker.

[rm-keys]: /docs/research/related-materials.md#project-id-and-api-keys

### REST API v1 subscriber endpoint

- **Get or create.** The endpoint
  `GET https://api.revenuecat.com/v1/subscribers/{app_user_id}` "Gets the
  latest Customer Info for the customer with the given App User ID, or creates
  a new customer if it doesn't exist." It answers `200` "Success (customer
  found)" or `201` "Success (customer created)" ([rc-api-v1-customers]).
- **Keys.** v1 takes `Authorization: Bearer YOUR_REVENUECAT_API_KEY`, and
  "Certain endpoints require secret keys" ([rc-api-v1]). RevenueCat's own
  example calls this endpoint with `Bearer PUBLIC_API_KEY`
  ([rc-customer-info]).
- **Encoding.** "For URL params, such as the `app_user_id`, make sure you URL
  encode them before using them." ([rc-api-v1])
- **Response.** `subscriber.entitlements` is a "Dictionary of the entitlements
  of this Customer (including any expired entitlements)", keyed by entitlement
  identifier. Each has `expires_date` ("may be in the past", and `null` "if it
  is a lifetime entitlement"), `grace_period_expires_date`,
  `product_identifier`, and `purchase_date`, beside a top-level
  `request_date` ([rc-api-v1-model]). `subscriber_attributes` is "Only
  included in responses to requests made with a secret API key"
  ([rc-api-v1-model]).
- **Rate limits.** The v1 reference publishes none ([rc-api-v1]).
- Synthesis: with v1 the Worker must compare dates itself, and every probe
  for an unknown ID creates a customer, so v1 is the wrong tool for a gate.

[rc-api-v1-customers]: https://www.revenuecat.com/docs/api-v1/customers
[rc-api-v1-model]: https://www.revenuecat.com/docs/redocusaurus/openapi-v1-customer-info-model.yaml

### REST API v2 customer and active entitlements

- **Keys and permissions.** v2 lives at `https://api.revenuecat.com/v2`, needs
  the `Bearer` prefix, and "API v1 keys will not work with REST API v2":
  "please create new v2 secret keys and define your permissions"
  ([rc-api-v2]). Secret keys "are project-wide" ([rc-auth]).
- **Customer.** `GET /v2/projects/{project_id}/customers/{customer_id}`
  "requires the following permission(s): `customer_information:customers:read`"
  and "belongs to the Customer Information domain, which has a default rate
  limit of 480 requests per minute." Its responses include `404` "Not found",
  and its body has an `active_entitlements` list ([rc-api-v2-customer]).
- **Active entitlements.**
  `GET /v2/projects/{project_id}/customers/{customer_id}/active_entitlements`
  needs the same permission and shares the limit. Each item has
  `entitlement_id`, the "ID of the entitlement granted to the customer", and
  `expires_at`, "The date after which the access to the entitlement expires in
  ms since epoch", which can be `null`. Pages hold 20 items by default
  ([rc-api-v2-resources]).
- **IDs versus identifiers.** `entitlement_id` is the entitlement's object ID,
  such as `entla1b2c3d4e5`, not its `lookup_key` ("The identifier of the
  entitlement", such as `premium`) that the SDK uses.
  `GET /v2/projects/{project_id}/entitlements` lists both, with
  `project_configuration:entitlements:read` and a limit of 60 per minute
  ([rc-api-v2-entitlement]).
- **Creating is separate.** Customers are created with
  `POST /v2/projects/{project_id}/customers` ([rc-api-v2-customer]).
- **Limits.** "The rate limit applies per API key (for app-level keys) or per
  developer (for developer-level keys)." A `429` comes with `Retry-After` in
  seconds and a `backoff_ms` field ([rc-api-v2]).
- Synthesis: the v2 GET doesn't create customers, so a `404` means RevenueCat
  has never seen the ID, and the Worker treats the player as not entitled.

[rc-api-v2]: https://www.revenuecat.com/docs/api-v2
[rc-api-v2-resources]: https://www.revenuecat.com/docs/api-v2/customer/resources
[rc-api-v2-entitlement]: https://www.revenuecat.com/docs/api-v2/entitlement

### Webhooks for subscription events

- **Setup.** An HTTPS URL, an "(Optional) Set authorization header that will
  be sent with each POST request", a choice of production, sandbox, or both,
  an app filter, and an event filter ([rc-webhooks]).
- **Authentication.** "We recommended setting an authorization header value
  via the RevenueCat dashboard." "Your server should verify the validity of
  the authorization header for every notification." With HMAC signing on,
  each delivery also carries
  `X-RevenueCat-Webhook-Signature: t=<unix_timestamp>,v1=<hmac_sha256_hex>`,
  computed over `"<timestamp>.<raw_json_body>"` ([rc-webhooks]).
- **Retries.** "Your server should return a 200 status code. Any other status
  code will be considered a failure by our backend. RevenueCat will retry later
  (up to 5 times) with an increasing delay (5, 10, 20, 40, and 80 minutes).
  After 5 retries, we will stop sending notifications." "If your server doesn't
  finish the response in 60s, RevenueCat will disconnect." ([rc-webhooks])
- **Timing and duplicates.** "Most webhooks are usually delivered within 5 to
  60 seconds of the event occurring - cancellation events usually are
  delivered within 2hrs". RevenueCat makes "our best effort" at "at least one
  delivery", so dedupe on the event `id` ([rc-webhooks]).
- **Event types.** `INITIAL_PURCHASE`, `RENEWAL`, `CANCELLATION`,
  `UNCANCELLATION`, `NON_RENEWING_PURCHASE`, `EXPIRATION`, `BILLING_ISSUE`,
  `PRODUCT_CHANGE`, `SUBSCRIPTION_EXTENDED`, `REFUND_REVERSED`, `TRANSFER`,
  `TEMPORARY_ENTITLEMENT_GRANT`, `SUBSCRIBER_ALIAS`, `TEST`, and others for
  other stores and features ([rc-webhook-events]).
- **Fields the Worker needs.** `app_user_id` ("Last seen App User ID of the
  subscriber"), `original_app_user_id`, `aliases` ("All App User IDs ever used
  by the subscriber"), `entitlement_ids`, `expiration_at_ms`, and
  `environment` (`SANDBOX` or `PRODUCTION`); a `TRANSFER` carries
  `transferred_from` and `transferred_to` ([rc-webhook-events]).

### Trusted Entitlements and server checks

- **The threat.** "the user is in control of the client device, and, while not
  an easy process, they can configure it to allow and execute MiTM attacks to
  grant themselves entitlements without actually paying you." With Trusted
  Entitlements, "our native (iOS/Android) SDKs work together with our backend
  to verify response integrity by checking a cryptographic signature on
  entitlement data." ([rc-trusted])
- **Not automatic.** "Enabling Trusted Entitlements does not automatically
  protect your app." The app reads a verification result of
  `NOT_REQUESTED`, `VERIFIED`, `VERIFIED_ON_DEVICE`, or `FAILED` and decides
  ([rc-trusted]; [phc-enums]).
- **React Native's default.** `Purchases.configure` sets
  `entitlementVerificationMode` to `DISABLED` unless the app passes
  `INFORMATIONAL` ([rnp-src]); see
  [Conflicts between sources](#conflicts-between-sources).
- Synthesis: it protects what the device believes, not a server check. The
  Worker calls RevenueCat itself over HTTPS with a secret key, and that call
  is what guards archive puzzles, so Trusted Entitlements is optional for
  Guessling.

### Recommended backend pattern

- **Use the API.** "If you need to get a user's subscription status from
  outside of the Purchases SDK, for example, from your own backend, you should
  use the REST API." ([rc-customer-info])
- **Webhooks plus a fetch.** "Because different webhook events contain unique
  information, we recommend calling the `GET /subscribers` REST API endpoint
  after receiving any webhook." ([rc-webhooks])
- **Faster updates.** "RevenueCat doesn't require server notifications from
  the App Store for most subscription updates. Configuring them can still
  speed up webhook and integration delivery times" ([rc-apple-s2s]).
- **Sandbox counts.** "RevenueCat itself does not have sandbox and production
  environments" ([rc-webhooks]). Under Sandbox Testing Access, "Anybody" is
  the default, so "All non-production purchases (Test Store and platform
  sandbox) will grant access to entitlements" ([rc-sandbox-access]).
- **App Review buys in sandbox.** Apple tells servers to retry receipts in
  sandbox so they work "while your app is in testing, in review by App Review,
  or live in the App Store" ([apple-receipts]), and RevenueCat quotes a
  reviewer's note about "a production-signed app getting its receipts from
  Apple's test environment" ([rc-rejections]).
- Synthesis: for Guessling's traffic, a check per archive request against the
  v2 active-entitlements endpoint, with a short cache, is enough; webhooks
  can come later to clear that cache. Keep Sandbox Testing Access at
  "Anybody" at least until approval, or the reviewer's purchase won't open the
  archive. A sketch of the check, built from the documented endpoint:

```ts
const ANONYMOUS_ID = /^\$RCAnonymousID:[a-z0-9]{32}$/

type ActiveEntitlements = { items: { entitlement_id: string; expires_at: number | null }[] }

export async function hasGuesslingPlus(appUserId: string, env: Env): Promise<boolean> {
  if (!ANONYMOUS_ID.test(appUserId)) return false
  const url =
    `https://api.revenuecat.com/v2/projects/${env.RC_PROJECT_ID}` +
    `/customers/${encodeURIComponent(appUserId)}/active_entitlements`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${env.RC_SECRET_KEY}` } })
  if (res.status === 404) return false // RevenueCat has never seen this ID
  if (!res.ok) throw new Error(`RevenueCat returned ${res.status}`) // 429: wait backoff_ms
  const body = (await res.json()) as ActiveEntitlements
  return body.items.some(
    (e) => e.entitlement_id === env.RC_ENTITLEMENT_ID && (e.expires_at === null || e.expires_at > Date.now())
  )
}
```

[rc-apple-s2s]: https://www.revenuecat.com/docs/platform-resources/server-notifications/apple-server-notifications
[rc-sandbox-access]: https://www.revenuecat.com/docs/projects/sandbox-access

### Who can send an app user ID

- **RevenueCat's rule.** "App User IDs should not be guessable": "RevenueCat
  provides subscription status via the public API; it is not good to have App
  User IDs that are easily guessed. A non-guessable pseudo-random ID, like a
  UUID (RFC 4122 version 4), is recommended." ([rc-identify]) Anonymous IDs
  carry 32 random hexadecimal characters ([ios-identity-src]).
- Synthesis: nothing in RevenueCat ties an app user ID to the device that
  sends it to the Worker. The ID works like a bearer token: guessing one is
  impractical, but a player who shares theirs shares Guessling+, and anyone
  holding the app's public key can read that customer through v1.
- Synthesis: keep the ID out of share cards and URLs, show it only on a
  support screen, and rate-limit the Worker per ID. Expo's
  `@expo/app-integrity` "provides APIs to help ensure your backend resources
  are accessed only by legitimate installations of your app running on genuine
  devices" through App Attest, but "This library is currently in alpha and
  will frequently experience breaking changes" ([expo-app-integrity]), and it
  still wouldn't bind an ID to a player.
- **Logging the ID.** Apple's "Collect" means "transmitting data off the
  device in a way that allows you and/or your third-party partners to access
  it for a period longer than what is necessary to service the transmitted
  request in real time", and its "User ID" type includes an "assigned user
  ID" ([apple-privacy-details]). The next section applies this.

[expo-app-integrity]: https://docs.expo.dev/versions/latest/sdk/app-integrity/
[apple-privacy-details]: https://developer.apple.com/app-store/app-privacy-details/

## App Privacy label and the SDK privacy manifest

The basics, including that a RevenueCat app declares "Purchases", are in the
[best practices][bp-privacy] note. RevenueCat's page adds the answers:

- **Data types.** "Purchases" is required: "RevenueCat collects purchase
  history from users". "Identifiers" applies "If you are identifying users
  with a custom app user ID" (User ID) or with advertising-identifier
  integrations (Device ID). Contact Info and Usage Data apply only with
  customer attributes or analytics SDKs; Location is not collected, "only
  locale and currency code"; Diagnostics is not collected
  ([rc-app-privacy]).
- **Purposes.** For Purchase History, "you must select" "Analytics" and "App
  Functionality" ([rc-app-privacy]).
- **Linked.** "If you are using RevenueCat's anonymous app user ID's, and do
  not have a way to identify individual users, you can select 'No'."
  ([rc-app-privacy])
- **Tracking.** "RevenueCat, as a third-party, does not inherently use
  purchase history to track users across different apps for advertising."
  ([rc-app-privacy])
- **The SDK's manifest.** `RevenueCat` 5.90.1, the version under
  `react-native-purchases` 10.10.1, declares user defaults with reason
  `CA92.1`, and collected data type `NSPrivacyCollectedDataTypePurchaseHistory`
  with linked `false`, tracking `false`, and the single purpose
  `NSPrivacyCollectedDataTypePurposeAppFunctionality`; `NSPrivacyTracking` is
  `false` ([ios-privacyinfo]). The pod ships it as a resource bundle
  ([ios-podspec]), so React Native's aggregator picks up the `CA92.1` reason
  but not the data type ([rn-privacy]).
- Synthesis: for Guessling, declare Purchases, Purchase History, for
  Analytics and App Functionality, not linked, not used for tracking. Add
  Identifiers, User ID, only if the Worker keeps app user IDs past a request,
  for example in rate-limit or log records. The typed questions are
  covered in the [review-safety checklist][idea-review] and the
  [Jev notes][jev-store]; Crash Data joins the label only with
  `expo-updates` ([expo-app-stores]).

[bp-privacy]: /docs/research/best-practices.md#privacy-policy-privacy-labels-and-terms-of-use
[ios-podspec]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/RevenueCat.podspec
[idea-review]: /docs/archive/guessling-idea.md#review-safety-checklist
[jev-store]: /docs/research/jev.md#store-review-and-jev

## What RevenueCat documents about Expo

### The RevenueCat Expo guide

- **Steps.** Create the project; install `expo-dev-client`; install
  `react-native-purchases` and `react-native-purchases-ui`; set up the
  project, store, products, entitlement, offering, and paywall in the
  dashboard; configure the SDK in a `useEffect`; check
  `customerInfo.entitlements.active`; and present a paywall ([rc-expo]).
- **Testing.** It builds a simulator app on EAS with an `ios-simulator`
  profile that extends `development` and sets `"simulator": true`, runs
  `eas build --platform ios --profile ios-simulator`, then `npx expo start`
  ([rc-expo]).
- **Web.** The same SDK runs on React Native web through RevenueCat Billing,
  where `getProducts`, `purchaseProduct`, and `restorePurchases` "won't work"
  ([rc-expo]); Guessling doesn't need it.
- **Expo's side.** Expo's in-app purchases guide lists `react-native-purchases`
  and `expo-iap`, and links RevenueCat's "Expo In-App Purchase Tutorial"
  ([expo-iap]).

### Known issues for Expo apps

- **Expo Go and hot reload.** Real purchases need a development build, and
  skipping the rebuild causes the `NativeEventEmitter` error (see
  [Development builds, Expo Go, and Preview API Mode](#development-builds-expo-go-and-preview-api-mode)).
- **Test Store keys.** A `test_` key crashes every Release build (see
  [Configuring the SDK and API keys](#configuring-the-sdk-and-api-keys)).
- **The sample imports a Galaxy package.** The guide's configure sample
  imports `GALAXY_BILLING_MODE` from `react-native-purchases-store-galaxy`,
  which its install command doesn't add ([rc-expo]). Synthesis: an iOS-only
  app drops that import and the Android branches.
- **Simulators.** "Xcode 26 beta introduces a bug that may cause your app to
  crash when integrating multiple libraries—such as RevenueCat's SDK—that
  utilize `URLSessionConfiguration`. This issue occurs when running the app on
  iOS 26 simulators." Its status: "Waiting on Apple's resolution."
  ([rc-xcode26]) RevenueCat lists "iOS 18.4-26 Simulator Fails to Load
  Products" under resolved StoreKit issues ([rc-storekit-issues]).
- **iOS 27.** purchases-ios 5.90.0 shipped "Fix original paywall footer layout
  on iOS 27" ([gh-ios-releases]); the Expo side needs scene support first (see
  [EAS Build images and Xcode 26](#eas-build-images-and-xcode-26)).
- **TestFlight prices.** "Paywalls or `getOfferings()` may return prices in
  USD when testing through TestFlight, even if the tester's storefront is set
  to another country." ([rc-sandbox-apple])

[rc-xcode26]: https://www.revenuecat.com/docs/known-store-issues/xcode-26/app-crash-urlsessionconfiguration
[rc-storekit-issues]: https://www.revenuecat.com/docs/known-store-issues/storekit

### Minimal example

- **RevenueCat's samples.** The sample-apps page points React Native to
  `examples/MagicWeather` ([rc-samples]). The same repository has
  `examples/purchaseTesterExpo`, an Expo Router app on Expo SDK 54 and React
  Native 0.81.5 that installs the SDK from local tarballs
  ([gh-rnp-expo-example]).
- Synthesis: neither is an SDK 57 starter. The sketch below strings together
  the documented calls from this note; the entitlement identifier is a
  placeholder.

```tsx
import { useEffect } from 'react'
import Purchases, { LOG_LEVEL, type CustomerInfo } from 'react-native-purchases'
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui'

const ENTITLEMENT = 'guessling_plus' // placeholder lookup key
let configured = false

// Call once, early, for example from the root layout.
export function configureRevenueCat() {
  if (configured) return
  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.VERBOSE)
  Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_RC_APPLE_KEY! }) // appl_ key; test_ only in development
  configured = true
}

export function useCustomerInfoUpdates(onChange: (info: CustomerInfo) => void) {
  useEffect(() => {
    Purchases.addCustomerInfoUpdateListener(onChange)
    return () => {
      Purchases.removeCustomerInfoUpdateListener(onChange)
    }
  }, [onChange])
}

export async function openArchivePaywall(): Promise<boolean> {
  const result = await RevenueCatUI.presentPaywallIfNeeded({ requiredEntitlementIdentifier: ENTITLEMENT })
  return [PAYWALL_RESULT.NOT_PRESENTED, PAYWALL_RESULT.PURCHASED, PAYWALL_RESULT.RESTORED].includes(result)
}

export async function restore(): Promise<boolean> {
  const info = await Purchases.restorePurchases() // only from a button tap
  return typeof info.entitlements.active[ENTITLEMENT] !== 'undefined'
}

export const currentAppUserId = () => Purchases.getAppUserID() // sent to the Worker
```

[rc-samples]: https://www.revenuecat.com/docs/platform-resources/sample-apps

## Conflicts between sources

- **Trusted Entitlements default.** The docs say that from iOS SDK 5.15.0 and
  Android 8.11.0 "Trusted Entitlements is enabled by default", in an
  informational mode ([rc-trusted]). `react-native-purchases` 10.10.1 passes
  `ENTITLEMENT_VERIFICATION_MODE.DISABLED` unless the app sets a mode, both in
  its JSDoc and in code ([rnp-src]).
- **Privacy purposes.** RevenueCat's privacy page requires "Analytics" and
  "App Functionality" for Purchase History ([rc-app-privacy]); the SDK's own
  manifest lists only App Functionality ([ios-privacyinfo]). The label in App
  Store Connect is what reviewers see, so follow the page.
- **Where paywall events go.** The Paywalls overview says integrations "send
  paywall events to Amplitude, Mixpanel, PostHog, Segment, or your own server"
  ([rc-paywalls]); the integrations page lists only the four vendors
  ([rc-paywall-integrations]), and the webhook event list has no paywall
  events ([rc-webhook-events]).
- **Expo Go mode name.** RevenueCat's Expo guide calls it "Preview API Mode"
  ([rc-expo]); in Expo Go the SDK logs "Expo Go app detected. Using RevenueCat
  in Browser Mode." and saves "Preview API Mode" for the Rork app
  ([rnp-env-src]).
- **Offer code types.** Apple's current StoreKit article lists "three types",
  counting sandbox codes ([sk-offer-codes]); its older article says "There are
  two types of offer codes: one-time use codes, and custom codes."
  ([sk-offer-codes-legacy]) App Store Connect Help also names two types and
  describes sandbox codes separately ([asc-offer-codes]).

[rnp-env-src]: https://github.com/RevenueCat/react-native-purchases/blob/10.10.1/src/utils/environment.ts
[sk-offer-codes-legacy]: https://developer.apple.com/documentation/storekit/implementing-offer-codes-in-your-app

## Gaps

What the sources didn't settle on September 22, 2026:

- **v1 rate limits.** The v1 reference publishes no rate limits
  ([rc-api-v1]).
- **v2 lookups of unseen IDs.** The v2 reference lists `404` but has no
  example for an anonymous ID RevenueCat has never seen, and this research had
  no secret key to try one ([rc-api-v2-customer]).
- **Public key prefixes.** The docs don't print the `appl_` and `test_`
  prefixes; they come from the iOS SDK's source ([ios-config-src]).
- **Paywall templates.** No page says whether each current template ships with
  close, restore, Terms, and Privacy buttons, or whether a modal paywall
  without a close button can be swiped away ([rc-paywall-components]).
- **Paywall chart freshness.** Charts v3 updates "most charts" in real time
  ([rc-charts]); no page says whether the paywall charts are among them.
- **Xcode 27 on EAS.** Expo gives no date beyond "coming soon"
  ([expo-sdk58]).
- **Sandbox codes in TestFlight.** Apple documents redeeming sandbox codes
  through the Sandbox Account settings ([sk-offer-codes]), and RevenueCat
  calls the in-app sheet "inconsistent" in sandbox and TestFlight
  ([rc-ios-offers]); no page confirms in-app redemption in a TestFlight build.
- **App Review's environment.** No current Apple page states outright that
  review purchases run in sandbox; the evidence is the deprecated receipt
  article and a reviewer note quoted by RevenueCat ([apple-receipts];
  [rc-rejections]).
- **iPad compatibility mode.** Apple's `UIDeviceFamily` reference returned
  HTTP 404 at the JSON path tried, so the iPad facts rest on Expo's page and
  guideline 2.4.1 ([expo-app-stores]; [apple-guidelines]).
- **Expo's update FAQ.** `https://docs.expo.dev/eas-update/faq.md` returned
  HTTP 404; the FAQ quoted here lives on the EAS Update introduction
  ([eas-update]).
- **npm pages.** `www.npmjs.com` answers scripted requests with HTTP 403, so
  package versions and dates come from the registry API at
  `https://registry.npmjs.org/<package>`, the data behind the linked pages
  ([npm-expo]; [npm-rnp]).

## See also

- [Related materials](/docs/research/related-materials.md): RevenueCat setup
  pages, SDK releases, the Test Store, charts, and API keys.
- [Best practices](/docs/research/best-practices.md): App Review, sandbox
  testing, and privacy labels.
- [Jev notes](/docs/research/jev.md): the API the Worker calls for answers.
- [Guessling idea](/docs/archive/guessling-idea.md): Guessling's design, stack,
  and schedule.

[expo-sdk57]: https://expo.dev/changelog/sdk-57
[npm-expo]: https://www.npmjs.com/package/expo
[npm-template]: https://www.npmjs.com/package/expo-template-default
[expo-app-config]: https://docs.expo.dev/versions/latest/config/app/
[expo-sdk58]: https://expo.dev/changelog/sdk-58-beta
[expo-build-props]: https://docs.expo.dev/versions/latest/sdk/build-properties/
[expo-app-stores]: https://docs.expo.dev/distribution/app-stores/
[apple-guidelines]: https://developer.apple.com/app-store/review/guidelines/
[rn-privacy]: https://github.com/facebook/react-native/blob/v0.86.3/packages/react-native/scripts/cocoapods/privacy_manifest_utils.rb
[eas-update]: https://docs.expo.dev/eas-update/introduction/
[npm-rnp]: https://www.npmjs.com/package/react-native-purchases
[gh-ios-releases]: https://github.com/RevenueCat/purchases-ios/releases
[rc-paywalls]: https://www.revenuecat.com/docs/tools/paywalls
[rc-cc-rn]: https://www.revenuecat.com/docs/tools/customer-center/customer-center-react-native
[rc-paywall-offers]: https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls/supporting-offers
[rc-expo]: https://www.revenuecat.com/docs/getting-started/installation/expo
[rnpui-src]: https://github.com/RevenueCat/react-native-purchases/blob/10.10.1/react-native-purchases-ui/src/index.tsx
[expo-iap]: https://docs.expo.dev/guides/in-app-purchases/
[gh-rnp-expo-example]: https://github.com/RevenueCat/react-native-purchases/tree/main/examples/purchaseTesterExpo
[rnp-src]: https://github.com/RevenueCat/react-native-purchases/blob/10.10.1/src/purchases.ts
[rc-auth]: https://www.revenuecat.com/docs/projects/authentication
[ios-config-src]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/Sources/Purchasing/Configuration.swift
[rc-launch]: https://www.revenuecat.com/docs/test-and-launch/launch-checklist
[rc-identify]: https://www.revenuecat.com/docs/customers/identifying-customers
[rc-caching]: https://www.revenuecat.com/docs/test-and-launch/debugging/caching
[ios-identity-src]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/Sources/Identity/IdentityManager.swift
[rc-customer-info]: https://www.revenuecat.com/docs/customers/customer-info
[rc-ios-offers]: https://www.revenuecat.com/docs/subscription-guidance/subscription-offers/ios-subscription-offers
[sk-offer-codes]: https://developer.apple.com/documentation/storekit/supporting-offer-codes-in-your-app
[asc-offer-codes]: https://developer.apple.com/help/app-store-connect/manage-subscriptions/set-up-subscription-offer-codes
[rc-webhook-events]: https://www.revenuecat.com/docs/integrations/webhooks/event-types-and-fields
[rm-paywalls]: /docs/research/related-materials.md#paywalls-and-customer-center
[phc-enums]: https://github.com/RevenueCat/purchases-hybrid-common/blob/19.2.0/typescript/src/enums.ts
[rc-paywall-components]: https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls/components
[rc-charts]: https://www.revenuecat.com/docs/dashboard-and-metrics/charts
[rc-sandbox-apple]: https://www.revenuecat.com/docs/test-and-launch/sandbox/apple-app-store
[rc-paywall-integrations]: https://www.revenuecat.com/docs/tools/paywalls/integrations
[rc-pricing]: https://www.revenuecat.com/pricing/
[rc-webhooks]: https://www.revenuecat.com/docs/integrations/webhooks
[rc-api-v1]: https://www.revenuecat.com/docs/api-v1
[rc-api-v2-customer]: https://www.revenuecat.com/docs/api-v2/customer
[rc-trusted]: https://www.revenuecat.com/docs/customers/trusted-entitlements
[apple-receipts]: https://developer.apple.com/documentation/storekit/validating-receipts-with-the-app-store
[rc-rejections]: https://www.revenuecat.com/docs/test-and-launch/app-store-rejections
[rc-app-privacy]: https://www.revenuecat.com/docs/platform-resources/apple-platform-resources/apple-app-privacy
[ios-privacyinfo]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/Sources/PrivacyInfo.xcprivacy

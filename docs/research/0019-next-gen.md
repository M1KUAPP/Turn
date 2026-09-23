# Next Gen Award research notes

What RevenueCat Shipaton 2026's Next Gen Award asks of a student team, what
building without paid developer accounts involves, and what the 2026 field and
other student contests show, gathered for choosing an ambitious app that uses
Jev. Every source was read on September 22, 2026, including answers that
hackathon managers posted in the Devpost [discussion forum][forum]. The
[Shipaton notes][shipaton-notes], [related materials][rm-rules], and
[Jev notes][jev-notes] hold the general rules and Jev facts this note doesn't
repeat. Conclusions are labeled "Synthesis:".

Contents:

1.  [What a Next Gen entry must submit](#what-a-next-gen-entry-must-submit)
1.  [The purchase requirement for Next Gen](#the-purchase-requirement-for-next-gen)
1.  [Judging criteria and the category video](#judging-criteria-and-the-category-video)
1.  [Next Gen and the other prizes](#next-gen-and-the-other-prizes)
1.  [Building without a paid developer account](#building-without-a-paid-developer-account)
1.  [What a judge needs to run the app](#what-a-judge-needs-to-run-the-app)
1.  [Open-source license and setup instructions](#open-source-license-and-setup-instructions)
1.  [Keeping keys out of a public repository](#keeping-keys-out-of-a-public-repository)
1.  [Minors, ages, and accounts](#minors-ages-and-accounts)
1.  [What student competitions reward](#what-student-competitions-reward)
1.  [The 2026 Next Gen field](#the-2026-next-gen-field)
1.  [Campus leaderboard, Learning Party, and perks](#campus-leaderboard-learning-party-and-perks)
1.  [Conflicts between sources](#conflicts-between-sources)
1.  [Gaps](#gaps)

[shipaton-notes]: /docs/research/0001-shipaton-2026.md
[jev-notes]: /docs/research/0005-jev.md

## What a Next Gen entry must submit

The [official rules][rules] bind every entry and prevail over other Shipaton
pages; the [rules notes][rm-rules] cover their general terms. The English rules
open with "Updated August 31, 2026: Eligibility for the Next Gen Award has been
expanded to include entrants under the age of majority." Their Next Gen
clauses, all in section 4 ([rules]):

- **Who.** "You must be an active student enrolled in high school, college,
  university, bootcamp, or another academic program and use a qualifying
  student or academic email address on Devpost. Email-domain eligibility may
  be verified using JetBrains/swot."
- **Instead of a store listing.** "Instead of a published app-store listing,
  submit a demo video and a link to your public, open-source code repository,
  including an open-source license file. No paid Apple or Google developer
  account or store release is required."
- **The repository.** "For Projects submitted for the Next Gen Award only:
  provide a URL to your code repository for judging and testing. The
  repository must contain all necessary source code, assets, and instructions
  required for the project to be functional. The repository must be public and
  open source by including an open source license file. This license should
  be detectable and visible at the top of the repository page (in the About
  section)."
- **The video.** It "should be less than two (2) minutes", "should include
  footage that shows the Project functioning on the device for which it was
  built", and "must be uploaded to and made publicly visible on YouTube or
  Vimeo".
- **Still required, with no Next Gen exception.** A text description, "a
  1024x1024 app icon", and "at least one screenshot of the app with a
  resolution of 1179px width and 2556px height WITHOUT device frames". The
  project must "run on iOS, iPadOS, macOS, or Android" and "function as
  depicted in the video and/or expressed in the text description". The
  submission guide's extra fields, such as the RevenueCat project ID, are in
  the [submission checklist notes][notes-checklist].
- **The free-trial exemption, verbatim.** "Except for Projects submitted for
  the Next Gen Award, the app must either offer a free trial or the Entrant
  must include a promo code for judges to unlock the in-app purchase and test
  all premium features. Next Gen Award Projects will be evaluated using the
  demonstration video and code repository."
- **The testing exemption.** "Next Gen Award Projects are exempt from the
  store-download testing requirements above and will be evaluated based on the
  demonstration video and public code repository."
- **The store-link exemption.** "Except for Projects submitted for the Next Gen
  Award, include a URL to a fully published app in Apple's App Store, the
  Google Play Store, or the Samsung Galaxy Store."

Other official pages and the managers' forum answers add:

- **A pitch.** The category page asks for "A clear description of what you
  built, what it does, and why it matters." ([cat-ng])
- **Setup instructions.** The submission guide wants "a public repository with
  code, setup instructions and a visible open-source license" ([submit-guide]).
- **Native apps only.** "Desktop web would not be eligible, it needs to be an
  iOS, Android or MacOS app." ([f-desktop-web]) Another manager: "a web-only
  application wouldn't be eligible for the Next Gen Award" ([f-web-app]).
- **An all-student team.** "everyone officially listed as part of the
  submitting team must also be an eligible student" ([f-team]).
- **The student email.** "No need to change your primary email. We ask for
  your student email during project submission." ([f-student-email])
- **Naming the award.** RevenueCat's September 18 Devpost update says to check
  for "a link to a publicly available repository" and to "Name the awards
  you're going for – in your description, your answer fields, and in the
  video." ([week7])
- **The form's store checkbox.** A required store-release checkbox that
  blocked Next Gen entries "should now be fixed", a manager replied about a
  month before September 22 ([f-checkbox]).

[notes-checklist]: /docs/research/0001-shipaton-2026.md#devpost-submission-checklist
[f-team]: https://revenuecat-shipaton-2026.devpost.com/forum_topics/44700-eligibility-for-the-nextgen-category
[f-checkbox]: https://revenuecat-shipaton-2026.devpost.com/forum_topics/44872-next-gen-submission-blocked-by-required-store-release-checkbox

## The purchase requirement for Next Gen

### Whether the RevenueCat rule applies

- **The rule has no Next Gen exception.** "What to Create: Entrants must
  create a working software application that uses the RevenueCat SDK to power
  at least one in-app or web purchase, or that serves ads through RevenueCat
  Ads (each a "Project")." ([rules], section 4) The FAQ agrees: "All Shipaton
  submissions must use the RevenueCat SDK for in-app purchases, subscriptions,
  or ads." ([faq])
- **Judges score it.** One of the four Next Gen criteria asks: "Does the
  project thoughtfully use RevenueCat to support subscriptions, in-app
  purchases, web purchases, ads, or another monetization flow?" ([rules],
  section 6)
- **Organizers accept Test Store.** A manager answered: "Test Store is enough
  for the Next Gen category." ([f-test-store]) Another wrote that using
  RevenueCat's Test Store "would satisfy the criteria", and that a Next Gen app
  "must also use the RevenueCat SDK" ([f-mvp]; [f-desktop-web]).
- **RevenueCat checks for it.** "We run a number of checks, the main one of
  which is you have to actually use RevenueCat in some way" ([f-checks]).
- **The video expects sandbox purchases.** Charlie says: "you need to have some
  form of monetization even though it'll be sandboxed and and not real
  purchases." ([ng-video], YouTube's auto-generated captions)
- Synthesis: the requirement applies to Next Gen, a Test Store purchase meets
  it, and the purchase flow is scored. Only the forum, not the rules, names
  Test Store.

[f-test-store]: https://revenuecat-shipaton-2026.devpost.com/forum_topics/44695-next-gen-eligibility-is-a-test-store-only-purchase-sufficient

### Purchase paths without a store listing

- **RevenueCat Test Store.** "Test Store is RevenueCat's built-in testing
  environment that works immediately without platform setup." Test purchases
  "behave like real purchases and subscriptions: they update `CustomerInfo`,
  trigger entitlements, and appear in your RevenueCat dashboard." Instead of
  the system sheet, the app shows "a modal with metadata about the product
  being purchased, along with buttons to simulate a successful purchase, a
  failed purchase, or cancel the purchase entirely." ([rc-test-store])
- **Test Store needs no store accounts.** RevenueCat lists "No platform
  accounts needed - Test without App Store Connect or Google Play Console
  access" and "Works everywhere - Ideal for Expo, web apps, and environments
  without native store APIs". Its limits: it "Won't catch issues with StoreKit
  behavior, billing grace periods, or platform edge cases". ([rc-sandbox])
- **Test Store versions and renewals.** It needs iOS SDK 5.43.0, Android
  9.9.0, Flutter 9.8.0, React Native 9.5.4, KMP 2.2.2, or the Web (JS) SDK
  1.15.0, and "Each test subscription will renew automatically up to 5 times".
  "Purchases through Test Store will be reported as sandbox data."
  ([rc-test-store])
- **Test Store keys are for debug builds.** "Development/Debug builds: Test
  Store API key"; "Production/Release builds: Platform-specific API key"
  ([rc-test-store]). The iOS SDK crashes release builds that carry a Test
  Store key on purpose, as the [Expo notes][expo-keys] quote from its source.
- **Platform sandboxes need paid accounts.** RevenueCat lists "Requires
  platform accounts - Need App Store Connect or Google Play Console access"
  ([rc-sandbox]). The paid-account facts behind this, and StoreKit testing in
  Xcode, are under
  [Building without a paid developer account](#building-without-a-paid-developer-account).
- **Web purchases need a billing engine.** Web Purchase Links are "a hosted,
  customizable purchase flow provided by RevenueCat, to enable web purchases
  with no code" ([rc-web]). With RevenueCat Billing, first "connect your
  Stripe account with RevenueCat", which "can only be done by the project
  owner" ([rc-wpl]). Testing runs on "Stripe's Test Mode and Sandboxes"
  ([rc-web-testing]), and a new Stripe account that hasn't finished
  verification "may only have access to sandbox mode" ([rc-connect-stripe]).
- Synthesis: Test Store is the only path that needs neither a store account
  nor a Stripe account. Web Purchase Links add a web purchase that a judge can
  open in a browser, at the cost of a Stripe account in sandbox mode.

[expo-keys]: /docs/research/0009-revenuecat-expo.md#configuring-the-sdk-and-api-keys
[rc-web]: https://www.revenuecat.com/docs/web/overview
[rc-wpl]: https://www.revenuecat.com/docs/web/web-billing/web-purchase-links
[rc-web-testing]: https://www.revenuecat.com/docs/web/web-billing/testing
[rc-connect-stripe]: https://www.revenuecat.com/docs/web/connect-stripe-account

## Judging criteria and the category video

### Next Gen criteria and scoring

The rules' "Next Gen Award Criteria" open with "A student-only category for
the best app submitted by active students with a .edu (or equivalent) email
address. Judged on a video submission and open-source code — no App Store or
Google Play release required." The four criteria, verbatim ([rules], section
6):

1.  "Is the app idea clear, useful, interesting, or original? Does it solve a
    real problem or create a compelling experience for its intended users?"
1.  "Does the submitted project demonstrate meaningful progress toward a
    working app? Is the core functionality clear from the video and code
    repository?"
1.  "Does the project thoughtfully use RevenueCat to support subscriptions,
    in-app purchases, web purchases, ads, or another monetization flow?"
1.  "Does the submission show thoughtful technical choices, product thinking,
    and care in how the app was built and presented?"

- **No weights.** The rules publish no weights for Next Gen; the only
  weighted category is Best App for Galaxy. Winners are the entries that
  "earn the highest overall scores based on the applicable Judging Criteria".
  ([rules], section 6)
- **Ties.** "the tied Submission with the highest score in the first
  applicable criterion listed above will be considered the higher scoring
  Submission" ([rules], section 6). Synthesis: for Next Gen, the idea
  criterion breaks ties.
- **Judges may not run it.** For all entries, "Judges are not required to test
  the Project and may choose to judge based solely on the text description,
  images, and video provided in the Submission." ([rules], section 4)
- **The process.** RevenueCat's general screening and scoring stages are in
  the [judging notes][notes-judging].
- **Complete beats minimal.** "MVP vs more fleshed out app is your choice but
  usually more complete apps do better!", and "We do recommend building one app
  however and making it the best you can" ([f-mvp]).
- **macOS is fine.** "submitting a macOS app will not put you at a
  disadvantage" ([f-macos]).

[notes-judging]: /docs/research/0001-shipaton-2026.md#judging-funnel-and-stages
[f-macos]: https://revenuecat-shipaton-2026.devpost.com/forum_topics/44615-macos-app-submission

### What the category video asks for

The video linked from the category page is "Shipaton 2026: Next Gen Award" on
RevenueCat's YouTube channel, published August 3, 2026 and 6 minutes 22
seconds long, with an empty description ([ng-video]). Its speakers introduce
themselves as Charlie and Perttu. The quotes below come from YouTube's
auto-generated English captions, which spell Shipaton as "Ship It On" and
Perttu as "Partou"; the video predates the August 31 change for minors.

- **Why the category exists.** It answers people "who wanted to build their
  apps but could not, for example, buy an Apple developer account".
- **What to hand in.** "You still need to include a 2-minute video where you
  show the app in use", plus "the source code of your app so that we can
  actually validate it's a real app and you made progress".
- **Not a weekend project.** "we're not wanting just like weekend projects. We
  want a fully realized app. So, one, we need to be able to build and it needs
  to run, right? Obviously. Um but two, we want it to feel fully featured. So,
  you know, you need a settings page, you need a paywall".
- **The bar.** "The way you win this category is by building an app that if
  you released it would actually be a really good app, a great app."
- **The rubric, in Perttu's words.** "the app should be built for someone, so
  it should be targeting an actual need, actual problem. If it's a game,
  that's also completely fine, but then it needs to be an enjoyable game. It
  needs to have a good design, good user experience", and "what you show in
  the video has to match what is in the app."
- **Public code only.** "we don't accept private repositories". Older code is
  fine: "we will just take the version that was working before the hackathon
  and evaluate the code there and then compare it the video."
- **Email checks.** If the domain checker fails, "you can just email us",
  and "we will check that manually and flag you for the judging process".
- **Two categories at once.** "if you do that", meaning also publishing to the
  App Store, "you're also going to be eligible for the other categories",
  provided the entry still has "a student email that's verified" and the
  source code.

## Next Gen and the other prizes

- **Adults can enter more.** "Students who have reached the age of majority
  where they live may qualify for the Next Gen Award and another category if
  they meet both categories' requirements." ([faq])
- **Minors can't.** Minor Entrants enter "solely for purposes of entering and
  winning the Next Gen Award. Minor Entrants are not eligible for any other
  prize category." ([rules], section 3)
- **A store release doesn't help Next Gen.** "For Next Gen judging, a store
  submission is allowed but is not considered as part of the judging
  criteria." ([faq])
- **Both at once.** A manager: "Yes, you can qualify for both." For "the Grand
  Prize and other general categories, the app needs to meet the normal
  Shipaton requirements, including being published on an eligible app store
  and using RevenueCat." ([f-both])
- **Grand Prize eligibility.** The prize table lists the Grand Prize for "All
  Eligible Submissions" ([rules], section 8), and its criteria ask when "you
  first put a live, usable version in front of real users" ([rules], section
  6).
- **The shortlist counts revenue.** "The Sponsor will compare the total
  revenue generated by eligible Projects during the Submission Period, as
  reported in RevenueCat, to create a shortlist." ([rules], section 6)
- **Test Store revenue is sandbox data.** Test Store purchases "will be
  reported as sandbox data" ([rc-test-store]); the Overview shows them only
  when the "Sandbox data" toggle is on ([rc-sandbox]); and "charts are only
  displayed for production transaction data" ([rc-charts]).
- Synthesis: an adult team's Next Gen entry reaches the Grand Prize only by
  also shipping to a store and earning real revenue. Test Store purchases move
  no money and stay out of RevenueCat's production figures, and no source says
  the shortlist reads sandbox data.

[f-both]: https://revenuecat-shipaton-2026.devpost.com/forum_topics/45060-is-it-possible-to-both-qualify-for-the-nextgen-award-and-grand-prize
[rc-charts]: https://www.revenuecat.com/docs/dashboard-and-metrics/charts

## Building without a paid developer account

### Apple capabilities on a free account

- **What free means.** Apple's capability tables have a column for "Apple
  Developer: Apple Account holders who have agreed to the Apple Developer
  Agreement to access certain resources on the Apple Developer website. No
  cost is associated with this agreement and developers can't distribute
  apps." ([apple-caps-ios]) Xcode shows such an account as a "Personal Team"
  ([apple-account]).
- **Free on iOS.** Nine capabilities: App groups, Background modes, Data
  protection, HealthKit, HomeKit, Inter-App Audio, Keychain sharing, Maps,
  and Wireless Accessory Configuration. For Maps, "you can use the MapKit
  framework but you can't provide routing directions." ([apple-caps-ios])
- **Paid program only.** In-App Purchase, Sign in with Apple, Apple Pay, Game
  Center, and WeatherKit are Apple Developer Program only; Push
  notifications, all three iCloud rows, Associated domains, App Attest,
  Network extensions, and Siri need a paid or enterprise membership
  ([apple-caps-ios]). On macOS the free column is App groups, App Sandbox,
  Hardened runtime, Keychain sharing, and Maps ([apple-caps-macos]).
- **What the free account includes.** "On-device testing using Xcode" and
  "Beta Xcode and OS releases" are free; "App Store Connect", "TestFlight",
  and "Xcode Cloud" are Apple Developer Program only ([apple-account]). The
  program costs "99 USD per membership year" ([apple-enroll]).

[apple-caps-ios]: https://developer.apple.com/help/account/reference/supported-capabilities-ios
[apple-caps-macos]: https://developer.apple.com/help/account/reference/supported-capabilities-macos

### Free provisioning limits

Apple publishes the personal team's limits ([apple-account]):

- "You can register up to 10 App IDs, which expire after 7 days."
- "You can register up to 3 devices, which expire after 7 days."
- "You can install up to 3 apps per device. Provisioning profiles that enable
  apps to be installed on a device will expire 7 days from issuance. You'll
  need to rebuild and reinstall your app to your device after expiration."

### StoreKit testing in Xcode

- **Local and free of App Store Connect.** "StoreKit Testing in Xcode is a
  local test environment for testing in-app purchases without requiring a
  connection to App Store servers." ([apple-storekit-xcode]) "You can test
  StoreKit transactions before you create Sandbox Apple Accounts, without a
  network connection. You can test your app in Simulator or on real devices."
  ([apple-storekit-stages])
- **The sandbox needs the paid program.** Apple's sandbox checklist starts
  with "Your Apple Developer Program account is active" and says "You create
  Sandbox Apple Accounts in App Store Connect." ([apple-sandbox])
- **RevenueCat's limits.** RevenueCat reads StoreKit configuration purchases,
  but "StoreKit testing only works if you are running your app directly
  through Xcode"; command-line tools built on `xcodebuild` "won't use the
  StoreKit Configuration File specified in your scheme" ([rc-sandbox-apple]).
- Synthesis: with a free account, StoreKit purchases run in the Simulator or
  from Xcode only, and In-App Purchase isn't a free capability on devices.
  Test Store avoids StoreKit, so it is the path that also works on a phone.

[apple-storekit-xcode]: https://developer.apple.com/documentation/xcode/setting-up-storekit-testing-in-xcode
[apple-sandbox]: https://developer.apple.com/documentation/storekit/testing-in-app-purchases-with-sandbox
[rc-sandbox-apple]: https://www.revenuecat.com/docs/test-and-launch/sandbox/apple-app-store

### Expo and EAS without a paid account

- **Local builds.** Building with Expo CLI and Xcode: "No Expo account is
  required and this is the only way to install a development build on an
  iPhone without a paid Apple Developer account." ([expo-dev-builds])
- **EAS builds.** For EAS, "All builds that run on an iPhone device require a
  paid Apple Developer account for build signing" ([expo-dev-builds]). EAS can
  build for the iOS Simulator "without needing to deploy to TestFlight or even
  having an Apple Developer account" ([expo-simulators]), and APKs and
  Simulator builds need no "store developer membership accounts"
  ([expo-build-setup]).
- **EAS's free plan.** "Up to 15 Android and 15 iOS builds", a "45-minute
  build timeout", and a "Low priority" queue ([expo-pricing]).
- **Expo Go.** "Expo Go on the Apple App Store stops at SDK 54, and SDK 55 and
  later are not available there." ([expo-go]) RevenueCat's Expo guide needs a
  development build anyway, as the [Expo notes][expo-dev] cover.

[expo-simulators]: https://docs.expo.dev/build-reference/simulators/
[expo-build-setup]: https://docs.expo.dev/build/setup/
[expo-pricing]: https://expo.dev/pricing
[expo-go]: https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/
[expo-dev]: /docs/research/0009-revenuecat-expo.md#development-builds-expo-go-and-preview-api-mode

### Android sideloading and developer verification

- **Debug builds need no account.** A debug APK "is signed with a debug key
  provided by the SDK tools" ([android-cmdline]), and
  `adb install path_to_apk` installs it on a device or emulator
  ([android-adb]).
- **Verification starts September 30.** "Starting September 30, 2026, these
  new developer verification protections go live for users in Brazil,
  Indonesia, Singapore, and Thailand." ([android-dv-guides]) The FAQ adds:
  "if users sideload your app directly, these new verification requirements
  won't apply to your app yet", and "As a developer, you are free to install
  apps without verification with ADB." ([android-dv-faq])
- **A free account type.** Limited distribution: "This account is free." It
  lets developers "Share apps with up to 20 devices that end-users have
  explicitly authorized." ([android-dv-limited])
- **Play test tracks need the paid console.** A Play Console account costs "a
  US$25 one-time registration fee" and requires age 18 ([play-account]). "An
  internal test can have up to 100 testers per app." ([play-internal]) The
  12-tester, 14-day rule for new personal accounts is in the
  [review notes][notes-review].

[android-cmdline]: https://developer.android.com/build/building-cmdline
[android-adb]: https://developer.android.com/tools/adb
[android-dv-limited]: https://developer.android.com/developer-verification/guides/limited-distribution
[play-internal]: https://support.google.com/googleplay/android-developer/answer/9845334
[notes-review]: /docs/research/0001-shipaton-2026.md#app-review-timing-and-late-approvals

### School fee waivers

- Apple's university program is gone: "The iOS Developer University Program
  has been discontinued as of May 15, 2024." Instead, "Accredited educational
  institutions can enroll in the Apple Developer Program at no cost."
  ([apple-university])
- A fee waiver goes to the institution, not the student: an applicant must
  "Not be an individual, sole proprietor, or single-person business" and must
  "Not otherwise sell digital goods or services through any of your apps"
  ([apple-fee-waivers]).

[apple-university]: https://developer.apple.com/support/university/
[apple-fee-waivers]: https://developer.apple.com/help/account/membership/fee-waivers/

## What a judge needs to run the app

- **The rules' bar.** The repository must hold "all necessary source code,
  assets, and instructions required for the project to be functional"
  ([rules], section 4). The video adds: "we need to be able to build and it
  needs to run" ([ng-video]).
- **Backends count.** A manager answered that "if your backend or
  microservices are essential parts of how the app works, those should also be
  available for judging. If you're simply using external managed services such
  as Firebase or another third-party API, you obviously don't need to
  open-source those services themselves." Multiple repositories are fine
  ([f-backend]).
- **iOS needs a Mac.** "`npx expo run:ios` can only be run on a Mac, and Xcode
  must be installed." ([expo-cli]) Xcode 27 needs "macOS Tahoe 26.6 or later"
  ([apple-xcode]).
- **Android runs anywhere.** Android Studio supports Windows, macOS, and Linux
  and lists 16 GB of RAM for "Studio & Emulator" ([android-studio]).
- **RevenueCat keys for judges.** Test Store keys belong in debug builds
  ([rc-test-store]), and public SDK keys "are meant to make non-potent changes
  to subscribers" ([rc-auth]). No RevenueCat page says whether a public or Test
  Store key may be committed to a public repository.
- **The Jev key.** TypeSafe's MCA says "Customer will ensure that each
  Customer User keeps the Access Credentials confidential and does not share
  them with anyone else." ([ts-mca]) The [Jev notes][jev-platform] explain why
  calls go through a backend.
- **Field examples.** Guru attaches an APK to its GitHub releases, FitWitness
  offers an "ad-hoc signed" Mac build, BraveLine says "No private RevenueCat
  SDK key is distributed", and Tutti says "Builds without a configured key
  simply omit the tip jar." ([p-guru]; [p-fitwitness]; [p-braveline];
  [p-tutti])
- Synthesis: judges can't be handed the team's TypeSafe key, so a judge's
  build either calls the team's hosted relay, which should stay up until
  judging ends on October 13, or runs the published relay code with the judge's
  own key. The relay's source belongs in the public repository; TypeSafe's API
  doesn't. The [Workers notes][cf-secrets] cover holding the key in a Worker
  secret.

[f-backend]: https://revenuecat-shipaton-2026.devpost.com/forum_topics/45032-do-we-need-to-opensource-all-the-things-apart-form-app-code-like-backend-and-other-microservices
[expo-cli]: https://docs.expo.dev/more/expo-cli/
[apple-xcode]: https://developer.apple.com/xcode/system-requirements/
[android-studio]: https://developer.android.com/studio/install
[jev-platform]: /docs/research/0005-jev.md#jev-platform-and-language-support
[cf-secrets]: /docs/research/0010-cloudflare-workers.md#secrets-configuration-and-wrangler

## Open-source license and setup instructions

- **What "detectable" means.** GitHub's licensee library "compares the
  repository's LICENSE file to a short list of known licenses"; "If you include
  a detectable license in your repository, people who visit your repository
  will see it at the top of the repository page." ([gh-licensing];
  [gh-add-license]) If detection fails, "simplify your LICENSE file and note
  the complexity somewhere else, such as your repository's README file."
  ([gh-licensing])
- **Where the file goes.** Licensee scores "files in the project's root as
  potential license files" and ignores license mentions in READMEs
  ([licensee]).
- **Which licenses.** OSI-approved licenses "comply with the Open Source
  Definition", and MIT, Apache-2.0, GPL-3.0, MPL-2.0, BSD-3-Clause, and
  AGPL-3.0 are on its list ([osi]). A manager wrote that "MIT, Apache 2.0, GPL,
  or another standard open-source license would all be fine", adding "I'd
  avoid a custom "commercial-only" or "non-commercial" license" ([f-license]).
- **What each allows.** Choose a License, run by GitHub, calls MIT "A short and
  simple permissive license", Apache 2.0 a permissive license where
  "Contributors provide an express grant of patent rights", and GPLv3 a "strong
  copyleft license" ([cal-mit]; [cal-apache]; [cal-gpl]).
- **Without a license.** "without a license, the default copyright laws apply,
  meaning that you retain all rights to your source code and no one may
  reproduce, distribute, or create derivative works from your work."
  ([gh-licensing])
- **Setup instructions.** GitHub says READMEs "typically include" what the
  project does, why it's useful, "How users can get started with the project",
  where to get help, and who maintains it ([gh-readme]).
- **In the field.** Five of the 15 repositories tied to Next Gen had no
  license file at their root on September 22; see
  [What the field shows](#what-the-field-shows).

[gh-licensing]: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository
[gh-add-license]: https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-license-to-a-repository
[licensee]: https://github.com/licensee/licensee/blob/main/docs/what-we-look-at.md
[osi]: https://opensource.org/licenses
[f-license]: https://revenuecat-shipaton-2026.devpost.com/forum_topics/45094-under-what-license-should-we-publish-our-opensource-for-next-gen
[cal-mit]: https://choosealicense.com/licenses/mit/
[cal-apache]: https://choosealicense.com/licenses/apache-2.0/
[cal-gpl]: https://choosealicense.com/licenses/gpl-3.0/
[gh-readme]: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes

## Keeping keys out of a public repository

- **GitHub scans public repositories.** "Public repositories: Secret scanning
  runs automatically for free." ([gh-secret-scanning]) Push protection for
  users "Is enabled by default" and "Stops you from pushing secrets to public
  repositories on GitHub" ([gh-push-protection]).
- **But not for these keys.** GitHub's pattern list has rows for Stripe,
  OpenAI, and Anthropic keys, and none for RevenueCat, Expo, or TypeSafe;
  Google API keys are scanned without push protection ([gh-patterns]).
- **If a key leaks.** "as a first step you need to revoke and/or rotate that
  secret", then rewrite history with `git-filter-repo` ([gh-remove-data]).
- **RevenueCat's keys.** Public SDK keys configure the SDK. "Secret API keys,
  prefixed `sk_`, should be kept confidential and only stored on your own
  servers" and "kept out of any publicly accessible areas such as GitHub,
  client-side code, and so forth." ([rc-auth])
- **Expo's public variables.** "Do not store sensitive info, such as private
  keys, in EXPO_PUBLIC_ variables. These variables will be visible in
  plain-text in your compiled application." Expo adds that "generally .env.local
  files should be added to your .gitignore". ([expo-env])
- **TypeSafe's SDK.** Its browser option reads "Allow browser use, exposing the
  API key to page users. Default: false." ([ts-js-config])
- **Field examples.** WaterGuard committed "an API key and a keystore password"
  to a public repository and "rotated the exposed RevenueCat key immediately"
  ([p-waterguard]). Veta's story says "The API key enters through
  --dart-define at build time and is not in the repository." ([p-veta])
- Synthesis: a repository can run without the team's keys if it commits a
  placeholder environment file, takes RevenueCat's public or Test Store key at
  build time, keeps the TypeSafe key only in the relay's server secrets, and
  runs with purchases or Jev features switched off when a key is missing, as
  Tutti and BraveLine describe.

[gh-secret-scanning]: https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning
[gh-push-protection]: https://docs.github.com/en/code-security/concepts/secret-security/push-protection
[gh-patterns]: https://docs.github.com/en/code-security/reference/secret-security/supported-secret-scanning-patterns
[gh-remove-data]: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
[expo-env]: https://docs.expo.dev/guides/environment-variables/
[ts-js-config]: https://docs.typesafe.ai/sdk/javascript/api/interfaces/TypeSafeClientConfig
[p-veta]: https://devpost.com/software/veta-ek95nz

## Minors, ages, and accounts

### Minor entrants under the rules

- **Who.** Minors are entrants "under the age of majority where they reside
  but are at least thirteen (13) years of age as of the time of entry", only
  for Next Gen. "A parent or legal guardian may register for or hold the
  Devpost account used to enter on the Minor Entrant's behalf." ([rules],
  section 3)
- **Who acts.** When a minor enters alone or represents a team, the parent or
  guardian "is deemed to enter on the Minor Entrant's behalf" and is "the party
  authorized to act in connection with the Submission" ([rules], section 3).
- **Adults can't unlock other categories.** A manager corrected an earlier
  reply because "the Official Rules were updated on August 31": "A minor
  entrant — and any team that includes a minor — cannot enter the other prize
  categories. Having a parent hold the Devpost, store, or payments account does
  not change that restriction." ([f-under-18])
- **Twelve is too young.** "The minimum age for the Next Gen Award is 13 at
  the time of entry. Using a parent's Devpost account does not make a
  12-year-old eligible." ([f-age-12])
- **Student proof.** The student email is asked "during project submission"
  ([f-student-email]); students without one can file a form for manual review
  with "something like a valid Student ID, letter of enrolment or some other
  official document" ([f-alt-verify]; [f-homeschool]). A manager asked
  entrants: "Please do not post student IDs or other identity documents
  publicly." ([f-japan])

[f-homeschool]: https://revenuecat-shipaton-2026.devpost.com/forum_topics/45190-next-gen-award-eligibility-how-to-submit-as-a-15yo-homeschooled-student-without-a-school-email
[f-japan]: https://revenuecat-shipaton-2026.devpost.com/forum_topics/45007-eligibility-for-next-gen-awards

### Minimum ages for the accounts involved

| Account                         | Minimum age in its terms                                                                                 | Source                              |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Devpost                         | 13; minors may enter "by having their parents or guardians register"                                     | [devpost-tos]                       |
| GitHub                          | "You must be age 13 or older."                                                                           | [gh-terms]                          |
| Google Account                  | 13 in most countries, higher in some                                                                     | [google-account-age]                |
| Free Apple developer account    | "at least thirteen years of age"                                                                         | [apple-agreement]                   |
| Apple Developer Program         | "legal age of majority"; a parent "can enroll with their Apple Account and share their account with you" | [apple-enroll-help]; [apple-enroll] |
| Google Play Console             | "at least 18 years of age"                                                                               | [play-account]                      |
| Expo                            | "at least sixteen (16) years of age or the legal age of majority"                                        | [expo-terms]                        |
| Stripe (for RevenueCat Billing) | 13; under 18 "a legal guardian must assume the role of owner"                                            | [stripe-age]                        |
| RevenueCat                      | No age clause in the terms; the privacy policy covers under-18s                                          | [rc-terms]; [rc-pp]                 |
| TypeSafe                        | No age clause in the MCA or Terms of Use; the privacy policy covers under-18s                            | [ts-mca]; [ts-pp]                   |

- **RevenueCat.** "We do not knowingly collect Personal Data from or about
  children under the age of 18 through our Site. If you are under 18, please
  do not give us any Personal Data." ([rc-pp])
- **TypeSafe.** The MCA lets a person accept "ON BEHALF OF YOURSELF AS AN
  INDIVIDUAL"; the privacy policy says "We do not knowingly collect, maintain,
  or use personal data from children under 18 years of age, and no part of the
  Services is directed to children." ([ts-mca]; [ts-pp]) The
  `typesafe.ai/legal` index returned HTTP 404; the legal pages are listed at
  [docs.typesafe.ai/legal][ts-legal].

[devpost-tos]: https://info.devpost.com/legal/terms-of-service
[gh-terms]: https://docs.github.com/en/site-policy/github-terms/github-terms-of-service
[google-account-age]: https://support.google.com/accounts/answer/1350409
[apple-enroll-help]: https://developer.apple.com/help/account/membership/program-enrollment/
[expo-terms]: https://expo.dev/terms
[stripe-age]: https://support.stripe.com/questions/age-requirement-to-create-a-stripe-account
[rc-terms]: https://www.revenuecat.com/terms
[ts-legal]: https://docs.typesafe.ai/legal

### Apps whose users may be under 18

- **TypeSafe.** Its privacy policy's under-18 line covers the people whose data
  reaches it, and the MCA makes the app maker obtain "all rights, consents, and
  permissions necessary" for Input, as the [Jev notes][jev-mca] quote.
- **Apple's rules for minors.** Apps that "collect, transmit, or have the
  capability to share personal information ... from a minor must include a
  privacy policy and must comply with all applicable children's privacy
  statutes" (5.1.4). Kids Category apps "may not send personally identifiable
  information or device information to third parties" (1.3).
  ([apple-guidelines])
- Synthesis: an app whose users may be under 18 should keep their personal
  data away from Jev, for example by sending only non-personal content, or
  should target adults. Store review doesn't apply to a Next Gen entry, but the
  video's bar is an app that "if you released it would actually be a really
  good app".

[jev-mca]: /docs/research/0005-jev.md#master-customer-agreement-terms-for-apps
[apple-guidelines]: https://developer.apple.com/app-store/review/guidelines/

## What student competitions reward

### Swift Student Challenge

- **Criteria.** Apple's terms judge "Technical accomplishment in the submitted
  app playground", "Creativity of ideas in the submitted app playground", and
  "Content of written responses to the questions in the submission form"
  ([ssc-terms]). The overview says winners show "excellence in innovation,
  creativity, social impact, or inclusivity" ([ssc]).
- **Format and eligibility.** An app playground in a ZIP "up to 25 MB" that
  "can be experienced within three minutes"; "Submissions will be judged
  offline"; "Group work will not be considered." Entrants are "13 years of age
  or older" in most countries and can't be "employed full time as a
  developer". ([ssc-eligibility])
- **Scale.** "This year's Challenge honored 350 winners, including 50
  Distinguished Winners" in 2026 ([wwdc26]).
- **2026 winners.** Apple's May 7, 2026 story says "Many of this year's winners
  took inspiration from their communities — or even from conversations at
  their kitchen tables — to engineer impressive apps with accessibility at
  their core." It profiles Steady Hands, "an app playground that uses Apple
  Pencil stabilization to support individuals with tremors in creating art";
  Asuo, which "provides safe real-time routing to individuals in flood zones";
  LeViola, for "learning and playing the viola"; and "an Apple
  Intelligence-powered wingman for Shark Tank pitches". ([ssc-2026])
- **2025 winners.** Apple's May 8, 2025 story profiles Hanafuda Tactics, a
  card-game tutor; EvacuMate, an evacuation checklist; BreakDownCosmic, a
  calendar of astronomical events; and AccessEd, learning resources
  "accessible with or without Wi-Fi connectivity" ([ssc-2025]).
- Synthesis: Apple's recent winners share accessibility, a personal or local
  origin (a grandparent, a flood, a wildfire), and a narrow audience served
  well, often with on-device machine learning.

[ssc-terms]: https://developer.apple.com/swift-student-challenge/policy/
[ssc]: https://developer.apple.com/swift-student-challenge/
[ssc-eligibility]: https://developer.apple.com/swift-student-challenge/eligibility/
[wwdc26]: https://www.apple.com/newsroom/2026/05/apple-kicks-off-worldwide-developers-conference-on-june-8/
[ssc-2026]: https://www.apple.com/newsroom/2026/05/ai-meets-accessibility-in-this-years-swift-student-challenge/
[ssc-2025]: https://www.apple.com/newsroom/2025/05/meet-four-of-this-years-swift-student-challenge-winners/

### Google Solution Challenge

- **Google's pages are gone.** The old Solution Challenge URLs redirect to
  `developers.google.com/community`, which doesn't mention it ([gsc-page]).
- **The last Google-written edition.** In 2024 it invited "university students
  to use Google technologies to develop solutions for real-world problems"
  that "address one or more of the United Nations 17 Sustainable Development
  Goals", with a demo video ([gsc-2024]). Its winners built "innovative apps
  that tackle dementia, food waste and vision impairment" ([gsc-2024-winners]).
- **Later editions.** Chapter and partner pages, not Google's own, show 2025
  and 2026 rounds; the 2026 India page weights "Technical Merit (40%)", "User
  Experience (10%)", "Alignment With Cause (25%)", and "Innovation and
  Creativity (25%)" ([gsc-2026-partner]).

[gsc-page]: https://developers.google.com/community/gdsc-solution-challenge
[gsc-2024]: https://developers.googleblog.com/en/solution-challenge-2024-using-google-technology-to-address-un-sustainable-development-goals/
[gsc-2024-winners]: https://blog.google/technology/developers/meet-the-students-that-are-changing-the-world-through-technology/
[gsc-2026-partner]: https://promptwars.in/solutionchallenge2026.html

### Devpost and MLH judging guidance

- **Devpost's common criteria.** "Quality of the idea (How creative and unique
  is the project?)", "Implementation of the idea (Does the end result
  demonstrate quality software development and design?)", and "Potential Impact
  (How big of an impact could the project have on customers?)"; "Judging
  criteria is usually weighted equally" ([dp-judging]).
- **What Devpost's judges say.** An Atlassian judge: "It's all about that
  finished product. Is that finished product something that I would want to
  use?" A Databricks judge's red flag was a slick video when "you dug into the
  project or their GitHub, it was a lot lighter on code." ([dp-judge-tips])
- **MLH's criteria.** Technology, Design, Completion ("Does the hack work?"),
  and Learning ("Did the team stretch themselves?"); "Judges will weigh the
  criteria equally." MLH says it doesn't judge "How good the idea is.", and
  "Your code must be available publicly". ([mlh-rules])

[dp-judging]: https://help.devpost.com/article/64-judging-public-voting
[dp-judge-tips]: https://info.devpost.com/blog/hackathon-judging-tips
[mlh-rules]: https://github.com/MLH/mlh-policies/blob/main/standard-hackathon-rules.md

### Heartbeat Hero and other precedents

- **Heartbeat Hero**, the 2025 Peace Prize winner, grew from a Swift Student
  Challenge 2024 project "selected as one of 50 Distinguished Winners". It
  measures CPR compression depth with ARKit and 200 Hz motion data, keeps its
  Learn mode and AED map free, and gives verified students full access;
  RevenueCat called it "student-friendly and accessibility-first".
  ([past-winners])
- **Vector Guard**, 2025's HAMM winner, came from a builder who wrote "I'm a
  PhD student at UC San Diego studying vector-borne diseases" ([past-winners]).
- Synthesis: the student-built winners RevenueCat has already rewarded solved a
  concrete problem the builder knew well, with technical depth a judge can see
  in a demo.

[past-winners]: /docs/research/0004-past-winners.md#hamm-and-peace-prize-write-ups-2025

## The 2026 Next Gen field

### Gallery counts on September 22

The [gallery] and its search were read with `curl` on September 22, 2026.
Devpost's search matches text that isn't public, such as answers to custom
questions, so a hit shows that a word appears, not that a project entered a
category; the [gallery notes][gallery-method] explain the method.

- **Size.** The gallery's count line read "1 – 24 of 1145", up from the 1,115
  projects the gallery notes counted earlier the same day, and Devpost showed
  "Participants (27003)" ([gallery]; [rules]).
- **Next Gen searches.** "next gen" had [37][s-next-gen] hits, as in the
  gallery notes, and "next gen award" had [13][s-next-gen-award].
- **Student searches.** "student" had [100][s-student] hits, up from 98;
  "students" [72][s-students]; "university" [21][s-university]; and "high
  school" [5][s-high-school]. Most are apps for students rather than apps by
  students; the gallery notes count 35 study and tutoring projects
  ([gallery-clusters]).
- **Code and testing searches.** "open source" had [10][s-open-source] hits,
  "github" [69][s-github], "public repository" [10][s-public-repo], "source
  code" [12][s-source-code], and "test store" [47][s-test-store]. Of the 47
  Test Store hits, 29 have no store link under "Try it out", and 21 of those
  link a code repository.
- **Jev.** "jev" had [0][s-jev] hits. "typesafe" had [1][s-typesafe], and it
  names the `typesafe-i18n` library in Brievly's story, not TypeSafe AI
  ([p-brievly]).

[gallery]: https://revenuecat-shipaton-2026.devpost.com/project-gallery
[gallery-method]: /docs/research/0006-gallery-2026.md#method-and-coverage
[s-next-gen]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22next+gen%22
[s-next-gen-award]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22next+gen+award%22
[s-student]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=student
[s-students]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=students
[s-university]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=university
[s-high-school]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22high+school%22
[gallery-clusters]: /docs/research/0006-gallery-2026.md#idea-clusters-by-count
[s-open-source]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22open+source%22
[s-github]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=github
[s-public-repo]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22public+repository%22
[s-source-code]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22source+code%22
[s-test-store]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22test+store%22
[s-jev]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=jev
[s-typesafe]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=typesafe
[p-brievly]: https://devpost.com/software/brievly

### Entries that name Next Gen

Thirteen projects say in their public story that they target Next Gen. Each
line gives the tagline verbatim, then what the story says the app does, its
"Built With" stack, and whether GitHub showed a detected license on the
linked repository that day.

- **[Chaos Campus][p-chaos-campus].** "AI-powered gamified learning app that
  turns study syllabi into interactive battles." Topics become boss levels
  whose health drops with each right answer. A React web app built with
  Lovable; it links a `lovable.app` site and no repository. Its story says
  "submitting it for the RevenueCat Shipathon Next Gen Award as a solo student
  creator".
- **[CareBridge][p-carebridge].** "Offline-first senior medication & vitals
  companion with bedside desk mode, voice prompts, and certified doctor PDF
  clinical reports." Expo and React Native; MIT license.
- **[StudyLoop][p-studyloop].** "A calm, offline-first Android companion that
  turns study-start friction into one small action." Flutter; MIT license.
  "RevenueCat Test Store purchase, entitlement activation, cold-start
  persistence, and restore were verified on a physical Android device."
- **[FitWitness][p-fitwitness].** "Make the next print count: measured
  uncertainty, a fitted slot, and a printable next test." A native macOS
  workbench that turns caliper measurements into a 3D-print fit; Swift and
  AppKit; MIT license. "The downloadable development build is ad-hoc signed,
  not notarized or an App Store release."
- **[BraveLine][p-braveline].** "Rehearse difficult workplace conversations in
  English. A quiet guide, private recording, and exact-phrase retry—without
  accent scores." Expo and React Native; MIT license. "No private RevenueCat
  SDK key is distributed."
- **[Sikurepi][p-sikurepi].** "Sikurepi reduces food waste and helps people
  worldwide live healthier through home cooking." Receipt photos feed a
  pantry, recipes, and meal plans; Next.js and Capacitor with Gemini; MIT
  license.
- **[Khoan Đã][p-khoan-da].** "Hold on. Verify. Then act. An anti-scam
  assistant for older adults where the AI is never the thing that decides — it
  only raises flags; a fixed rule engine returns the verdict." React and
  Capacitor for Android; no license detected.
- **[BriefRunner Mobile][p-briefrunner].** "A calm Android briefing app with a
  free preview and RevenueCat-powered Pro purchase path." Kotlin and Jetpack
  Compose; MIT license.
- **[ChronoMind][p-chronomind].** "Prevent mood swings with science & weather:
  Synchronize circadian rhythms with real-time pressure data." Kotlin, Jetpack
  Compose, Open-Meteo, and OneSignal. No license detected, though its README
  shows a "License: MIT" badge.
- **[Soundscape Therapy][p-soundscape].** "AI-powered mood-based sound therapy
  for mental wellness." Six moods map to sounds and an AI-written message;
  Expo; MIT license.
- **[myQuote][p-myquote].** "A simple quote app that uses TTS and UI themes to
  create an immersive and fun experience." Kotlin and Jetpack Compose; Apache
  2.0 license; "a judge build that uses RevenueCat's Test Store for
  purchases".
- **[Guru][p-guru].** "An offline AI tutor that runs entirely on your phone.
  Built for Nepali students who don't have reliable internet." It runs a Gemma
  model on the device; React Native and Kotlin; MIT license; an APK is
  attached to its GitHub releases.
- **[TenderVerdict Next Gen][p-tenderverdict].** "One tender feed. A clear
  next step for every supplier profile." A macOS app that sorts public
  procurement notices for up to five supplier profiles; Swift; Apache 2.0
  license.

Three more match "next gen award" only in text that isn't public:
[Hivenotes][p-hivenotes] ("One lecture. Every student's notes. One
intelligent study guide."), [SnapStash][p-snapstash] ("The fastest way to save
and find your text, links, and code before you forget where you put it."),
and [WaterGuard][p-waterguard] ("Reporting Water Problem System"). None showed
a detected license. WaterGuard's story reports that "an API key and a keystore
password were accidentally committed to a public GitHub repo. We rotated the
exposed RevenueCat key immediately and cleaned up the repository history."

Four more use Test Store, link a repository, and list no store link without
naming the award: [Tutti][p-tutti], a multi-dish cooking timer that gives
each dish an instrument, which says "RevenueCat's Test Store lets us test the
purchase flow without a Play Console account"; [Second Take][p-second-take], a
conversation rehearsal app; [StudyPebble][p-studypebble], a study-step app;
and [RepoLens][p-repolens], a macOS workspace for research code.

[p-chaos-campus]: https://devpost.com/software/chaos-campus
[p-carebridge]: https://devpost.com/software/carebridge-senior-medication-care-companion
[p-studyloop]: https://devpost.com/software/studyloop-jnw4rv
[p-sikurepi]: https://devpost.com/software/sikurepi
[p-khoan-da]: https://devpost.com/software/khoan-da-anti-scam-assistant-for-older-adults-en-vi-5hnia0
[p-briefrunner]: https://devpost.com/software/briefrunner-mobile
[p-chronomind]: https://devpost.com/software/chronomind-rhythm-resilience-3mjbca
[p-soundscape]: https://devpost.com/software/soundscape-therapy
[p-myquote]: https://devpost.com/software/myquote
[p-tenderverdict]: https://devpost.com/software/tenderverdict-next-gen
[p-hivenotes]: https://devpost.com/software/hivenotes-collaborative-lecture-intelligence
[p-snapstash]: https://devpost.com/software/snapstash
[p-second-take]: https://devpost.com/software/second-take-kxgcdq
[p-studypebble]: https://devpost.com/software/studypebble
[p-repolens]: https://devpost.com/software/repolens-2fpoj0

### What the field shows

- Synthesis: study help is the crowded theme. Chaos Campus, StudyLoop, Guru,
  Hivenotes, and StudyPebble all target students' studying.
- Synthesis: care and wellbeing come next, with CareBridge, Khoan Đã,
  ChronoMind, and Soundscape Therapy, then conversation rehearsal (BraveLine,
  Second Take) and professional tools (FitWitness, TenderVerdict, RepoLens,
  BriefRunner).
- Synthesis: none of the 16 entries tied to Next Gen by name or search is a
  native iOS app. Five use React Native or Expo, three Kotlin and Jetpack
  Compose, two Flutter, three Capacitor or web code, and two are macOS apps.
  Chaos Campus is a web app, a kind managers have said doesn't qualify
  ([f-web-app]).
- Synthesis: 15 of the 16 list one team member; Hivenotes lists two.
- Synthesis: of the 15 that link a repository, GitHub showed a detected
  license on 10. Khoan Đã, ChronoMind, Hivenotes, SnapStash, and WaterGuard
  had no license file at the repository root, which the rules require.
- Synthesis: AI features are common (Chaos Campus, Sikurepi, Soundscape
  Therapy, Guru, Hivenotes, Khoan Đã, Second Take, WaterGuard), and none of
  them names Jev.

## Campus leaderboard, Learning Party, and perks

- **The leaderboard hasn't switched.** The students page says it "currently
  ranks schools by student applicants; in September it switches to ranking by
  submissions" ([students]). On September 22 the [leaderboard][campus] was
  headed "Applicant representation preview", and the data file it loads read
  `"metricLabel": "Applicants"` and `"updatedAt": "2026-08-25T17:47:10Z"`,
  from `devpost-registrants-2026-08-24-112524.csv`. It listed 793 campuses and
  2,146 applicants, and every campus had `"shippedApps": 0` ([campus-data]).
  The top five match the [campus notes][notes-students].
- **The Learning Party.** "The school with the most Shipaton submissions wins a
  Learning Party — a celebration hosted on or near campus and sponsored
  entirely by RevenueCat." It promises "Food and drinks for every student who
  shows up", talks, swag, and "Live office hours with RevenueCat engineers on
  how to monetize an app and build a business around it." ([students]) No
  source gives its date, a minimum count, or how ties are settled.
- **Campus events.** "Students aged 13 and older can host a Shipaton hackathon
  night, club workshop, or weekend sprint at their school" ([host]). The events
  left before the deadline are in the [events notes][notes-events].
- **Ship Kit without a store.** The rules offer "up to 25 sponsor perks across
  five progress milestones: registration complete, RevenueCat project created,
  first test purchase, first Store API call, and first real purchase"
  ([rules], section 4). Devpost defines "First test purchase" as "You've tested
  your monetization flow using RevenueCat's test store" ([dp-resources]).
  Synthesis: a Test Store entry reaches three milestones; the perks behind
  each are in the [Ship Kit notes][notes-ship-kit].
- **Deadlines.** Registration and submission both close "Wednesday, September
  30, 2026 at 11:45pm PDT"; the guardian consent form must be "completed before
  the Submission Period ends"; the Judging Period ends "Tuesday, October 13,
  2026 at 12:00pm PDT"; and "Winners announced: October 21st 2026" ([rules],
  sections 1 and 4). The consent form is needed "one per minor if your team
  has more than one" ([week7]).
- **Prizes for minors.** A minor's prize "will be awarded in the Minor
  Entrant's name but delivered to their parent or legal guardian", and travel
  to App Growth Annual needs "an accompanying parent or legal guardian at the
  winner's own expense" ([rules], section 8). Next Gen's first place includes
  an "Invitation to RevenueCat's App Growth Annual conference in New York City
  (travel and accommodation not included)" and $20,000 ([rules], section 8).

[campus]: https://www.shipaton.com/campus-leaderboard
[notes-students]: /docs/research/0001-shipaton-2026.md#students-next-gen-and-the-campus-leaderboard
[host]: https://www.shipaton.com/host
[notes-events]: /docs/research/0001-shipaton-2026.md#shipaton-irl-events-and-hosting
[dp-resources]: https://revenuecat-shipaton-2026.devpost.com/resources

## Conflicts between sources

- **Store publication.** The English rules' "How To Enter" list says apps
  "must be fully published to Apple's App Store, the Google Play Store, or the
  Samsung Galaxy Store by the submission deadline", and "Newly Submitted Apps
  Only" says "The first public version of the Project must be released during
  the Submission Period" on those stores, both without a Next Gen exception.
  The Next Gen clauses in the same section say "No paid Apple or Google
  developer account or store release is required." ([rules], section 4) The
  category page, FAQ, submission guide, video, and managers all side with the
  Next Gen clauses.
- **The Portuguese rules.** The [Portuguese translation][pt-rules] calls itself
  "uma tradução não oficial" and says the English version prevails. It is
  headed "Atualizado em 24 de agosto de 2026", not August 31. It adds the Next
  Gen exceptions the English text lacks ("exceto no Prêmio Next Gen") and a
  newness rule: "Projetos Next Gen deverão ser novos ou ter sido criados ou
  substancialmente desenvolvidos durante o Período de Submissão." The video
  instead accepts older code ([ng-video]).
- **Every submission's store link and trial.** The Devpost overview still says
  "Every submission must include" a published store URL and "Either a free
  trial in your app, or a promo code" ([devpost]); the rules exempt Next Gen
  from both ([rules], section 4).
- **Monetization wording.** The rules require and score a RevenueCat purchase,
  and the video wants "a paywall", but the category page's checklist never
  mentions RevenueCat, and the submission guide's FAQ says "Standard entries
  must use the RevenueCat SDK" ([rules]; [ng-video]; [cat-ng];
  [submit-guide]).
- **Student email.** The criteria and the Devpost overview say "a .edu (or
  equivalent) email address"; the eligibility clause says "a qualifying
  student or academic email address" checked with JetBrains/swot ([rules]).
  High schools are eligible, but swot's README says "If an organization
  provides primary or secondary education only (i.e., no high or higher
  education programs), it will not be included in the list." ([swot])
  Managers accept "a valid Student ID, letter of enrolment or some other
  official document" through a manual form instead ([f-alt-verify]).
- **Minors in other categories.** Before August 31, managers told a
  14-year-old that joining "as part of a team, as long as at least one team
  member is 18 or older" would work, and told a 12-year-old using their
  dad's account that "your project is eligible for all categories". Later
  manager replies apply the updated rules: minors and teams with minors enter
  Next Gen only ([f-under-18]; [f-checks]; [f-age-12]).
- **Guardian consent timing.** The rules want the consent form "completed
  before the Submission Period ends" and written confirmation "before any prize
  is awarded" ([rules], sections 3 and 4); the FAQ says "Signed written consent
  will be required before you can be announced as a winner" ([faq]).
- **Expo and free Apple accounts.** Expo's development-build page says a local
  build is "the only way to install a development build on an iPhone without a
  paid Apple Developer account" ([expo-dev-builds]), while its setup page says
  "To install a development build on your iOS device, you will need an active
  subscription to the Apple Developer Program." ([expo-setup])
- **Android verification scope.** The guides say "Android requires all apps to
  be registered by verified developers for users to install them on certified
  Android devices" ([android-dv-guides]); the FAQ says sideloaded apps aren't
  covered "yet" and adb installs are free of it ([android-dv-faq]).
- **Sharing an Apple account.** The enrollment page lets a parent "enroll with
  their Apple Account and share their account with you" ([apple-enroll]); the
  free Apple Developer Agreement says the Apple Account "cannot be shared in any
  way or with anyone" ([apple-agreement]).
- **Leaderboard basis.** The students page says the board switches to
  submissions in September; its live data still counts applicants from an
  August 24 export ([students]; [campus-data]). The Learning Party goes to "the
  most Shipaton submissions", yet "Every registration from your campus counts"
  ([students]).
- **Ship Kit size.** The rules say "up to 25 sponsor perks" ([rules], section
  4); the site's counts are in the [Ship Kit notes][notes-ship-kit].
- **Winners' date.** The rules say "October 21st 2026" ([rules], section 1);
  the FAQ says "October 22, 2026" ([faq]).

[pt-rules]: https://www.shipaton.com/pt-br/rules
[devpost]: https://revenuecat-shipaton-2026.devpost.com/
[swot]: https://github.com/JetBrains/swot
[expo-setup]: https://docs.expo.dev/get-started/set-up-your-environment/

## Gaps

What no source settled on September 22, 2026:

- **Which commit is judged.** Devpost entries lock at the deadline ([rules],
  section 5), but a repository doesn't; no rule names the commit judges read.
  The video's "the version that was working before the hackathon" is the only
  hint ([ng-video]).
- **Whether judges build the app.** The rules let judges judge from the
  description, images, and video; the video says "we need to be able to build
  and it needs to run". No source names the hardware judges have, such as a Mac
  with Xcode or an Android phone.
- **Test Store on simulators.** RevenueCat never says outright that Test Store
  runs on the iOS Simulator or the Android Emulator, and Apple doesn't say
  whether StoreKit Testing works on a phone signed by a Personal Team
  ([rc-sandbox]; [apple-storekit-stages]). WaterGuard reports that getting
  "Test Store dialogs to render at all required switching from a lightweight
  ATD emulator to a full Google Play system image" ([p-waterguard]).
- **One-time products in Test Store.** RevenueCat's Test Store page says
  "You cannot edit an existing product's identifier, duration, or price" once
  a product is saved, and its product steps say only "Enter a product
  identifier and configure pricing"; neither says whether a one-time,
  non-subscription product can be made there ([rc-test-store];
  [rc-products]).
- **Committing a Test Store key.** RevenueCat says public keys configure the
  SDK and secret keys stay off GitHub, but not whether a public or Test Store
  key may sit in a public repository ([rc-auth]).
- **Minors at RevenueCat and TypeSafe.** RevenueCat's under-18 line covers
  data "through our Site", and TypeSafe's MCA has no age clause, so neither
  says whether a minor may hold a dashboard or API account, or whether an app
  may send under-18 users' text to Jev ([rc-pp]; [ts-mca]; [ts-pp]).
- **Field size.** Devpost shows no category opt-ins, so the number of Next Gen
  entries is unknown; the searches are proxies.
- **Forum dates.** Devpost shows only relative dates on discussion posts, such
  as "about 2 months ago" ([forum]).
- **Learning Party and leaderboard.** No rules, date, or tie-break for the
  Learning Party, and no date for the leaderboard's switch to submissions.

[forum]: https://revenuecat-shipaton-2026.devpost.com/forum_topics
[rm-rules]: /docs/research/0003-related-materials.md#official-rules-and-devpost-pages
[rules]: https://revenuecat-shipaton-2026.devpost.com/rules
[cat-ng]: https://www.shipaton.com/categories/next-gen-award
[submit-guide]: https://www.revenuecat.com/blog/engineering/how-to-submit-your-app-for-shipaton
[f-desktop-web]: https://revenuecat-shipaton-2026.devpost.com/forum_topics/44880-is-desktop-web-ok-for-next-gen-the-rules-say-video-code-no-store
[f-web-app]: https://revenuecat-shipaton-2026.devpost.com/forum_topics/45010-web-application
[f-student-email]: https://revenuecat-shipaton-2026.devpost.com/forum_topics/44724-how-do-you-verify-student-eligibility-for-next-gen
[week7]: https://revenuecat-shipaton-2026.devpost.com/updates/46466-shipaton-week-7-check-your-submission-before-the-clock-runs-out
[faq]: https://www.shipaton.com/faq
[f-mvp]: https://revenuecat-shipaton-2026.devpost.com/forum_topics/44777-should-the-app-be-product-level-or-mvp-level
[f-checks]: https://revenuecat-shipaton-2026.devpost.com/forum_topics/44815-quick-question-about-account-setup-and-submission-rules
[ng-video]: https://www.youtube.com/watch?v=ygcLzFj5HGk
[apple-account]: https://developer.apple.com/help/account/basics/about-your-developer-account
[apple-enroll]: https://developer.apple.com/programs/enroll/
[apple-storekit-stages]: https://developer.apple.com/documentation/storekit/testing-at-all-stages-of-development-with-xcode-and-the-sandbox
[expo-dev-builds]: https://docs.expo.dev/develop/development-builds/introduction/
[android-dv-guides]: https://developer.android.com/developer-verification/guides
[android-dv-faq]: https://developer.android.com/developer-verification/guides/faq
[play-account]: https://support.google.com/googleplay/android-developer/answer/6112435
[rc-auth]: https://www.revenuecat.com/docs/projects/authentication
[ts-mca]: https://typesafe.ai/legal/mca
[p-guru]: https://devpost.com/software/guru-qz35xu
[p-fitwitness]: https://devpost.com/software/fitwitness
[p-braveline]: https://devpost.com/software/braveline
[p-tutti]: https://devpost.com/software/tutti-2gbki1
[p-waterguard]: https://devpost.com/software/waterguard
[f-under-18]: https://revenuecat-shipaton-2026.devpost.com/forum_topics/44839-eligibility-question-under-18
[f-age-12]: https://revenuecat-shipaton-2026.devpost.com/forum_topics/44927-urgent-question-about-eligibility
[f-alt-verify]: https://revenuecat-shipaton-2026.devpost.com/forum_topics/44714-alternative-student-verification-for-next-gen-award-in-ship-a-ton-no-school-email
[apple-agreement]: https://developer.apple.com/support/downloads/terms/apple-developer-agreement/Apple-Developer-Agreement-20250318-English.pdf
[rc-pp]: https://www.revenuecat.com/privacy
[ts-pp]: https://typesafe.ai/legal/privacy-policy
[students]: https://www.shipaton.com/students
[campus-data]: https://gist.githubusercontent.com/austboston/5a196bb60feebf7fcb10d54637e32e2d/raw/shipaton-campus-leaderboard.json
[notes-ship-kit]: /docs/research/0001-shipaton-2026.md#ship-kit-perks
[rc-test-store]: https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store
[rc-sandbox]: https://www.revenuecat.com/docs/test-and-launch/sandbox
[rc-products]: https://www.revenuecat.com/docs/offerings/products-overview

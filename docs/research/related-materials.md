# Related materials for Shipaton 2026

A directory of the primary documents, tools, and pages a team needs to build,
submit, and pitch a RevenueCat Shipaton 2026 entry, and what each one tells
them. It covers RevenueCat, the three stores, the seven category sponsors, the
five Influencer Award creators, and past editions, and builds on the [brief] and
the [research notes][notes]. Every URL was checked on September 21, 2026, so
versions, names, and feature status are as of that date.

Contents:

1.  [RevenueCat core documentation](#revenuecat-core-documentation)
1.  [RevenueCat programs behind 2026 categories](#revenuecat-programs-behind-2026-categories)
1.  [Store documentation](#store-documentation)
1.  [Sponsor documentation](#sponsor-documentation)
1.  [Influencer Award creators](#influencer-award-creators)
1.  [Past-edition references](#past-edition-references)
1.  [Conflicts](#conflicts)
1.  [Gaps](#gaps)

## RevenueCat core documentation

RevenueCat owns every page in this section. Its docs pages have Markdown copies
for coding agents: "Append `.md` to any docs URL to fetch its clean Markdown for
AI agents and LLMs." ([rc-llms])

[rc-llms]: https://www.revenuecat.com/docs/llms.txt

### Official rules and Devpost pages

| Resource                              | Owner                  | What it's for                                               |
| ------------------------------------- | ---------------------- | ----------------------------------------------------------- |
| [Official rules][rules]               | RevenueCat, on Devpost | The binding terms; they override every other page           |
| [Devpost resources tab][dp-resources] | RevenueCat, on Devpost | Ship Kit milestones, support contacts, and the docs list    |
| [Know your submission steps][dp-help] | Devpost                | Devpost's generic guide to the five-step form               |
| [Submission guide][rc-submit]         | RevenueCat             | The 2026 submission guide at its canonical URL, Aug 27      |
| [Seven more ways to win][rc-seven]    | RevenueCat             | Sept 18 post on seven categories teams tend to overlook     |
| [Welcome to RevenueCat][rc-welcome]   | RevenueCat             | The page the rules name as the place to find required tools |

Key facts:

- The rules are headed "Updated August 31, 2026" (the Next Gen change for
  minors) and state: "If there is any discrepancy or inconsistency between the
  terms and conditions of the Official Rules and disclosures or other statements
  contained in any Hackathon materials ... the terms and conditions of the
  Official Rules shall prevail." ([rules], sections 1 and 11)
- Dates in the rules: Submission Period "Friday, July 31, 2026 at 8:00am PDT –
  Wednesday, September 30, 2026 at 11:45pm PDT"; Judging Period "Thursday,
  October 1, 2026 at 12:00am PDT – Tuesday, October 13, 2026 at 12:00pm PDT";
  "Winners announced: October 21st 2026". ([rules], section 1)
- Who may enter: the rules list "Organizations (including corporations,
  not-for-profit corporations and other nonprofit organizations, limited
  liability companies, partnerships, and other legal entities)". A team or
  organization appoints one "Representative" to submit. ([rules], section 3)
- The project must use "the RevenueCat SDK to power at least one in-app or web
  purchase, or that serves ads through RevenueCat Ads", and the rules add:
  "Required tools can be found at
  https://www.revenuecat.com/docs/welcome/overview". ([rules], section 4)
- Category IDs the rules ask for, verbatim: "Provide the Stripe Project ID.";
  "Provide the Project's Replit preview URL and the Entrant's Replit username.";
  "Provide the OneSignal App ID associated with the Project."; "Provide the
  email address associated with the Entrant's Noise account."; "Provide a live
  URL to the app's Galaxy Store listing."; and for Layers, "The installation
  must be in place and verifiable before judging." ([rules], section 4)
- Grand Prize shortlist: "The Sponsor will compare the total revenue generated
  by eligible Projects during the Submission Period, as reported in RevenueCat,
  to create a shortlist." ([rules], section 6)
- Weights and ties: Best App for Galaxy is judged with "twenty percent (20%) of
  the category score based on Galaxy Store optimization", and ties go to "the
  tied Submission with the highest score in the first applicable criterion".
  ([rules], section 6)
- Prize limits: "Each Project may be submitted to and considered for only one
  Influencer Award category." The rules as published on September 21, 2026 have
  no other clause limiting how many prizes one project can win. ([rules],
  section 4)
- Travel: "Only the Grand Prize and 1st Place: #BuildInPublic Award include
  travel and accommodation." ([rules], section 8)
- Testing, read on September 22, 2026: "The Entrant must make the Project
  available free of charge and without any restriction, for testing,
  evaluation and use by the Sponsor, Administrator and Judges until the
  Judging Period ends." The submission requirements add that "the app must
  either offer a free trial or the Entrant must include a promo code for
  judges to unlock the in-app purchase and test all premium features."
  ([rules], section 4)
- Eligibility, read on September 22, 2026: "Individuals who are at least the
  age of majority where they reside as of the time of entry". The rules
  exclude residents of places where US or local law prohibits taking part,
  naming Russia, Crimea, Cuba, Iran, and North Korea. ([rules], section 3)
- Ownership, read on September 22, 2026: "All Submissions remain the
  intellectual property of the individuals or organizations that developed
  them. By submitting an entry, entrants agree that the Sponsor will have a
  non-exclusive license to use such entry for judging the entry." ([rules])
- Taxes, read on September 22, 2026: "United States residents may be
  required to provide a completed form W-9 and residents of other countries
  may be required to provide a completed W-8BEN form." ([rules], section 8)
- The Devpost resources tab defines the Ship Kit milestones: "First test
  purchase" means "You've tested your monetization flow using RevenueCat's test
  store"; "First Store API call" is "Triggered when you use a real API key vs. a
  Test Store API key"; "First real purchase" means "Your app is live on one of
  the Stores and a successful purchase is made". ([dp-resources])
- The Stripe Projects perk "Auto-unlocks when you provision your RevenueCat
  account and/or Project via Stripe Projects and make a real purchase by
  September 30." ([dp-resources])
- Support routes: "For questions about Shipaton, reach out to
  shipaton@revenuecat.com. For technical questions about using the RevenueCat
  SDK in your app use RevenueCat Support." ([dp-resources])
- On September 21, 2026 the Devpost tabs read "Participants (26920)", and the
  [project gallery][dp-2026-gallery] already lists submitted 2026 projects,
  which helps size up competitors. ([dp-2026])
- Devpost's help page says of the form: "You'll be able to continue editing it
  until the deadline"; step 4 asks for "Submitter Type: Individual, Team, or
  Organization". ([dp-help])
- The submission guide's shipaton.com copy declares the revenuecat.com URL
  canonical; its content is already in the [research notes][notes].
  ([rc-submit])
- The September 18 post adds tips the captures lack. On Funnel Vision: "you most
  likely don't need to release a new version of your app at all." On Replit:
  "build for iOS, with that you have the biggest chance to get your app approved
  in time." On Galaxy: "Galaxy store optimization accounts for 20% of the
  score". ([rc-seven])
- The same post lists the IDs judges need: "a live funnel URL, Stripe Project
  ID, Replit preview URL, public build posts, Galaxy Store listing, verified
  Layers installation, or an explanation of how you served the chosen audience."
  ([rc-seven])

[dp-help]: https://help.devpost.com/article/126-know-your-submission-steps
[rc-seven]: https://www.revenuecat.com/blog/company/seven-more-ways-to-win-shipaton
[rc-welcome]: https://www.revenuecat.com/docs/welcome/overview

### Quickstart and SDK installation

| Resource                           | Owner      | What it's for                                            |
| ---------------------------------- | ---------- | -------------------------------------------------------- |
| [SDK Quickstart][rc-quickstart]    | RevenueCat | Eight steps from installing the SDK to restoring buys    |
| [iOS and Apple platforms][rc-ios]  | RevenueCat | Swift Package Manager, CocoaPods, or Carthage install    |
| [Android][rc-android]              | RevenueCat | Gradle install, plus the Amazon and Galaxy Store modules |
| [React Native][rc-rn]              | RevenueCat | Bare React Native install and other stores               |
| [Expo][rc-expo]                    | RevenueCat | Expo install, development builds, and Expo Go            |
| [Flutter][rc-flutter]              | RevenueCat | Pub install and required Android changes                 |
| [Kotlin Multiplatform][rc-kmp]     | RevenueCat | Version catalog install and iOS interop settings         |
| [Zero to Ship][rc-start]           | RevenueCat | Four-question route to a first shipped subscription      |
| [RevenueCat Codelabs][rc-codelabs] | RevenueCat | Hands-on labs per platform and per store                 |

Current SDK releases, from each repository's GitHub releases (dates are the
`published_at` values in UTC):

| SDK                             | Package to install                            | Latest release | Released           |
| ------------------------------- | --------------------------------------------- | -------------- | ------------------ |
| [purchases-ios][gh-ios]         | `RevenueCat` (SPM repo `purchases-ios-spm`)   | 5.90.2         | September 18, 2026 |
| [purchases-android][gh-android] | `com.revenuecat.purchases:purchases`          | 10.22.1        | September 17, 2026 |
| [react-native-purchases][gh-rn] | `react-native-purchases`, also used by Expo   | 10.10.1        | September 21, 2026 |
| [purchases-flutter][gh-flutter] | `purchases_flutter`                           | 10.13.1        | September 17, 2026 |
| [purchases-kmp][gh-kmp]         | `com.revenuecat.purchases:purchases-kmp-core` | 3.9.0          | September 17, 2026 |

Key facts:

- The quickstart's prerequisites are "A RevenueCat account.", "A project in your
  RevenueCat account.", and "Products configured in the RevenueCat dashboard."
  Its steps run from "Install the RevenueCat SDK" to "Restore purchases", and
  "Test Store purchases work immediately without any additional setup."
  ([rc-quickstart])
- iOS: add `https://github.com/RevenueCat/purchases-ios-spm.git` in Xcode with
  the rule "Up to Next Major Version, from 5.0.0", then add the In-App Purchase
  capability. "Before purchases can work, the Account Holder must accept the
  Paid Apps Agreement and provide banking and tax information in App Store
  Connect, and your app's bundle identifier in Xcode must match your App Store
  Connect app record." ([rc-ios])
- Android: the page's sample coordinates still show `10.15.1`, older than the
  10.22.1 release above; Galaxy Store and Amazon builds need an extra module.
  ([rc-android])
- React Native needs "A React Native app (version 0.73 or later)" and installs
  `react-native-purchases react-native-purchases-ui`. ([rc-rn])
- Expo: "To use and test RevenueCat with Expo, you'll need to create an Expo
  development build." In Expo Go the SDK runs a "Preview API Mode", but "to
  fully test in-app purchases and access real RevenueCat functionality, you must
  use a development build." ([rc-expo])
- Flutter needs "Flutter 3.22 or later" and iOS 13.0 or higher, and "RevenueCat
  Paywalls require your `MainActivity` to subclass `FlutterFragmentActivity`
  instead of `FlutterActivity`". ([rc-flutter])
- Kotlin Multiplatform supports "Android 5.0+ (API 21+)" and "iOS 13.0+"; iOS
  source sets must opt in to `ExperimentalForeignApi`. ([rc-kmp])
- Zero to Ship: "Four quick questions, one personalized route: from empty
  project to your first shipped subscription. Every stop links to a hands-on
  RevenueCat codelab." ([rc-start])
- The codelabs include [Google Play integration][rc-codelab-play],
  [App Store integration][rc-codelab-asc], and
  [troubleshooting][rc-codelab-troubleshoot] labs, the same set the Shipaton
  resources page links. ([rc-codelabs])

[rc-quickstart]: https://www.revenuecat.com/docs/getting-started/quickstart
[rc-ios]: https://www.revenuecat.com/docs/getting-started/installation/ios
[rc-expo]: https://www.revenuecat.com/docs/getting-started/installation/expo
[rc-kmp]: https://www.revenuecat.com/docs/getting-started/installation/kotlin-multiplatform
[rc-start]: https://revenuecat.github.io/start/
[rc-codelabs]: https://revenuecat.github.io/
[gh-ios]: https://github.com/RevenueCat/purchases-ios/releases
[gh-rn]: https://github.com/RevenueCat/react-native-purchases/releases
[gh-kmp]: https://github.com/RevenueCat/purchases-kmp/releases
[rc-codelab-play]: https://revenuecat.github.io/codelabs/google-play.html
[rc-codelab-asc]: https://revenuecat.github.io/codelabs/app-store/index.html
[rc-codelab-troubleshoot]: https://revenuecat.github.io/codelabs/troubleshooting/index.html

### Products, entitlements, and offerings

| Resource                                         | Owner      | What it's for                                         |
| ------------------------------------------------ | ---------- | ----------------------------------------------------- |
| [Entitlements][rc-entitlements]                  | RevenueCat | The access levels that products unlock                |
| [Offerings][rc-offerings]                        | RevenueCat | The products a paywall offers, grouped into packages  |
| [Product configuration][rc-products]             | RevenueCat | Test Store products versus real store products        |
| [iOS product setup][rc-ios-products]             | RevenueCat | Creating products in App Store Connect                |
| [Google Play product setup][rc-android-products] | RevenueCat | Creating products in Play Console                     |
| [Google Play service credentials][rc-play-creds] | RevenueCat | Letting RevenueCat validate Google Play purchases     |
| [App Store Connect setup guide][rc-asc-guide]    | RevenueCat | First-time Apple setup, from enrollment to submission |

Key facts:

- "Most apps only have one entitlement, unlocking all premium features." "A
  user's entitlements are shared across all apps contained within the same
  project." ([rc-entitlements])
- "Using RevenueCat Offerings is optional, but enable features like Paywalls,
  Experiments, and Targeting." Packages group "equivalent products across iOS,
  Android, and web", and "the offering identifier cannot be changed later".
  ([rc-offerings])
- Products come in two kinds: "Test Store products - Create directly in
  RevenueCat for testing (no store setup required)" and "Real store products -
  Products from Apple, Google, Stripe, etc. that process real payments".
  ([rc-products])
- Apple: "You will not be able to test in-app purchases until the latest version
  of this agreement is signed with Apple", meaning the Paid Applications
  Agreement, with tax and banking complete. ([rc-ios-products])
- Google: "You'll need to have an APK uploaded before you can create in-app
  products." A product ID "can't be used again across any of your apps".
  ([rc-android-products])
- The Apple guide says a D-U-N-S number is needed only to enroll as an
  organization, and that getting one "can take up to two weeks".
  ([rc-asc-guide])

[rc-entitlements]: https://www.revenuecat.com/docs/getting-started/entitlements
[rc-offerings]: https://www.revenuecat.com/docs/offerings/overview
[rc-products]: https://www.revenuecat.com/docs/offerings/products-overview
[rc-ios-products]: https://www.revenuecat.com/docs/getting-started/entitlements/ios-products
[rc-android-products]: https://www.revenuecat.com/docs/getting-started/entitlements/android-products
[rc-play-creds]: https://www.revenuecat.com/docs/service-credentials/creating-play-service-credentials
[rc-asc-guide]: https://www.revenuecat.com/docs/platform-resources/apple-platform-resources/app-store-connect-setup-guide

### Paywalls and Customer Center

| Resource                                           | Owner      | What it's for                                         |
| -------------------------------------------------- | ---------- | ----------------------------------------------------- |
| [Paywalls][rc-paywalls]                            | RevenueCat | Remotely configured native paywalls                   |
| [Getting your paywall approved][rc-paywall-review] | RevenueCat | The paywall details store reviewers reject most often |
| [Customer Center][rc-customer-center]              | RevenueCat | In-app self-service subscription management           |

Key facts:

- "RevenueCat Paywalls let you remotely configure your entire paywall view
  without any code changes or app updates." You can start from a template or
  "describe what you want in the AI Editor". ([rc-paywalls])
- Paywalls run on "iOS 15.0 and higher" and "Android 7.0 (API level 24) and
  higher", and need a separate RevenueCat UI package. Multipage paywalls need
  purchases-ios 5.83.0, purchases-android 10.16.0, react-native-purchases
  10.6.0, purchases-flutter 10.7.0, or purchases-kmp 3.4.0. ([rc-paywalls])
- Reviewers look for four things: the full billed amount, the introductory
  offer, how to cancel, and the terms and privacy policy. "it's important that
  the full billed amount ($49.99/yr) is clearly provided on your paywall."
  ([rc-paywall-review])
- Customer Center lets customers cancel, restore, contact support, and, on iOS
  only, request refunds or change plans. "Customer Center is available on Pro
  and Enterprise plans." ([rc-customer-center])

[rc-paywalls]: https://www.revenuecat.com/docs/tools/paywalls
[rc-paywall-review]: https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls/app-review
[rc-customer-center]: https://www.revenuecat.com/docs/tools/customer-center

### Test Store and sandbox testing

| Resource                                           | Owner      | What it's for                                         |
| -------------------------------------------------- | ---------- | ----------------------------------------------------- |
| [Sandbox testing][rc-sandbox]                      | RevenueCat | Test Store versus the store sandboxes                 |
| [Test Store][rc-test-store]                        | RevenueCat | RevenueCat's built-in test environment                |
| [Apple App Store and TestFlight][rc-sandbox-apple] | RevenueCat | Sandbox accounts, StoreKit testing, TestFlight quirks |
| [Google Play Store][rc-sandbox-google]             | RevenueCat | License testers, closed tracks, and opt-in URLs       |
| [Launch checklist][rc-launch]                      | RevenueCat | What to verify before submitting for review           |
| [App Store rejections][rc-rejections]              | RevenueCat | The purchase problems behind most rejections          |

Key facts:

- "During the setup of a _new_ RevenueCat project, a Test Store will be
  automatically created with products." Its key comes from the "Apps and
  providers" tab, and test subscriptions "renew automatically up to 5 times".
  ([rc-test-store])
- Test Store needs at least iOS 5.43.0, Android 9.9.0, Flutter 9.8.0, React
  Native 9.5.4, or KMP 2.2.2. Test purchases "will be reported as sandbox data".
  ([rc-test-store])
- "Never submit an app to the App Store or Google Play that is configured with a
  Test Store API key." The launch checklist adds: "Using a Test Store API key in
  production will crash your app." ([rc-test-store]; [rc-launch])
- The checklist also says to test with the real store sandbox, not only Test
  Store, before launch. ([rc-launch])
- Apple: create testers in "App Store Connect dashboard > Users and Access >
  Sandbox Testers"; on iOS 18 or later, sign in under "Settings > Developer >
  Sandbox Apple Account". Sandbox and TestFlight prices "will often not reflect
  the actual prices set in App Store Connect". ([rc-sandbox-apple])
- Google: add the tester under "License testing", publish a signed build to a
  closed track, and open the opt-in URL: "If you don't complete this step,
  products will not load." ([rc-sandbox-google])
- "If an app has not previously had in-app purchases approved on the App Store,
  an option to submit them will appear on the main app version page." After
  approval, "it can take 24 hours for purchases to work on the App Store".
  ([rc-rejections])

[rc-sandbox]: https://www.revenuecat.com/docs/test-and-launch/sandbox
[rc-sandbox-apple]: https://www.revenuecat.com/docs/test-and-launch/sandbox/apple-app-store
[rc-sandbox-google]: https://www.revenuecat.com/docs/test-and-launch/sandbox/google-play-store
[rc-launch]: https://www.revenuecat.com/docs/test-and-launch/launch-checklist
[rc-rejections]: https://www.revenuecat.com/docs/test-and-launch/app-store-rejections

### Charts and traction metrics

| Resource                                | Owner      | What it's for                                |
| --------------------------------------- | ---------- | -------------------------------------------- |
| [Overview metrics][rc-overview-metrics] | RevenueCat | The six dashboard cards and what each counts |
| [Charts][rc-charts]                     | RevenueCat | Every chart, and how RevenueCat computes it  |

Key facts:

- The Overview cards are Active Trials, Active Subscriptions, MRR, Revenue, New
  Customers, and Active Customers. Revenue is "the gross revenue tracked in
  RevenueCat within the last 28 days", and New Customers counts "App User IDs
  created in the past 28 days". ([rc-overview-metrics])
- "All dates and times in the dashboard are represented in UTC, unless
  explicitly specified." ([rc-overview-metrics])
- "Charts show production data only": "charts are only displayed for production
  transaction data." Test Store purchases count as sandbox data, so they never
  appear in charts. ([rc-charts]; [rc-test-store])
- Charts v3, "our default charts experience", adds real-time updates and charts
  such as Revenue, MRR, New Customers, Initial Conversion, Trial Conversion,
  Paywall Conversion, and the ad charts. ([rc-charts])
- Synthesis: the rules shortlist Grand Prize entries by revenue "as reported in
  RevenueCat" ([rules], section 6), so the Revenue chart and the Overview cards
  are the numbers to screenshot for the Grand Prize and HAMM answers.

[rc-overview-metrics]: https://www.revenuecat.com/docs/dashboard-and-metrics/overview
[rc-charts]: https://www.revenuecat.com/docs/dashboard-and-metrics/charts

### Project ID and API keys

| Resource                   | Owner      | What it's for                                     |
| -------------------------- | ---------- | ------------------------------------------------- |
| [Projects][rc-projects]    | RevenueCat | Project settings, including the project ID        |
| [API keys][rc-api-keys]    | RevenueCat | Public SDK keys versus secret keys                |
| [Developer API][rc-api-v2] | RevenueCat | REST API v2, where the project ID is used         |
| [Dashboard][rc-dashboard]  | RevenueCat | Where the submission guide says to look up the ID |

Key facts:

- Under Project Settings, General Settings: "Project ID: The unique identifier
  for your project, used in the v2 API." ([rc-projects])
- The submission guide says to open "Project settings" from the sidebar after
  selecting the app, and that "The project ID is also visible in the URL."
  ([rc-submit])
- The API v2 reference shows project IDs in the form
  `"project_id": "proj1a2b3c4"` (an example value). The MCP tool `list-projects`
  "Lists all RevenueCat projects accessible with the provided API key."
  ([rc-api-v2]; [rc-mcp-tools])
- "Public API keys (also known as SDK API keys in the dashboard) ... must be
  used to configure the SDK"; secret keys are "prefixed `sk_`" and belong on
  your server only: "never embed secret API keys in your app or website."
  ([rc-api-keys])
- "Each created Project comes with a Test Store", and "you can provision a
  project and app from the command line with Stripe Projects." ([rc-projects])

[rc-projects]: https://www.revenuecat.com/docs/projects/overview
[rc-api-keys]: https://www.revenuecat.com/docs/projects/authentication
[rc-api-v2]: https://www.revenuecat.com/docs/api-v2
[rc-dashboard]: https://app.revenuecat.com/overview

### MCP server and AI toolkit

| Resource                               | Owner                                | What it's for                                          |
| -------------------------------------- | ------------------------------------ | ------------------------------------------------------ |
| [RevenueCat MCP server][rc-mcp]        | RevenueCat                           | Lets AI assistants configure projects and read data    |
| [MCP setup][rc-mcp-setup]              | RevenueCat                           | Per-client install commands and authentication         |
| [MCP tools reference][rc-mcp-tools]    | RevenueCat                           | Every read and write tool the server exposes           |
| [AI Toolkit][rc-ai-toolkit]            | RevenueCat                           | Plugins, skills, MCP server, and CLI in one package    |
| [AI Toolkit skills][rc-ai-skills]      | RevenueCat                           | The workflow playbooks the plugin installs             |
| [ai-toolkit repository][gh-ai-toolkit] | RevenueCat, on GitHub                | Source of the plugins and skills                       |
| [Rico][rc-rico]                        | RevenueCat                           | RevenueCat's own AI advisor in the dashboard and Slack |
| [IntelliJ plugin][jb-rc-plugin]        | RevenueCat, on JetBrains Marketplace | The dashboard inside IntelliJ IDEA and Android Studio  |

Key facts:

- The server lives at `https://mcp.revenuecat.ai/mcp` and authenticates with
  "Bearer token with a RevenueCat API v2 key" or "OAuth with your RevenueCat
  account". ([rc-mcp])
- For Claude Code the recommended setup is the plugin:
  `claude plugins marketplace add RevenueCat/ai-toolkit`, then
  `claude plugins install revenuecat`. The manual alternative is
  `claude mcp add --transport http revenuecat https://mcp.revenuecat.ai/mcp`.
  ([rc-mcp-setup])
- "Most people should start with a plugin. It installs the skills and configures
  the MCP server for you". The plugin works with Claude Code, Cursor, Codex, and
  Gemini CLI. ([rc-ai-toolkit])
- The skills include `integrate-revenuecat`, `revenuecat-paywall`,
  `revenuecat-testing-setup`, `revenuecat-troubleshoot`, and
  `revenuecat-charts`; without plugins, install them with
  `npx skills add RevenueCat/ai-toolkit`. ([rc-ai-skills])
- The toolkit's latest release is v2.3.0, published September 18, 2026 (UTC).
  ([gh-ai-toolkit])
- Rico is "RevenueCat's AI-powered app growth advisor" and "a separate product
  from the RevenueCat AI Toolkit". ([rc-rico])
- The IntelliJ plugin "RevenueCat Dashboard" is published by the vendor
  `revenuecat`; its latest version, 1.2.7, was uploaded June 1, 2026 (UTC), per
  the JetBrains Marketplace API. ([jb-rc-plugin])

[rc-mcp]: https://www.revenuecat.com/docs/tools/mcp
[rc-mcp-setup]: https://www.revenuecat.com/docs/tools/mcp/setup
[rc-ai-toolkit]: https://www.revenuecat.com/docs/tools/ai-toolkit
[rc-ai-skills]: https://www.revenuecat.com/docs/tools/ai-toolkit/skills
[gh-ai-toolkit]: https://github.com/RevenueCat/ai-toolkit
[rc-rico]: https://www.revenuecat.com/docs/tools/rico
[jb-rc-plugin]: https://plugins.jetbrains.com/plugin/29265-revenuecat-dashboard

## RevenueCat programs behind 2026 categories

### RevenueCat Ads for Catvertising

| Resource                                      | Owner      | What it's for                                          |
| --------------------------------------------- | ---------- | ------------------------------------------------------ |
| [Ad Monetization][rc-ads]                     | RevenueCat | How ad revenue tracking works, and its requirements    |
| [Install the AdMob adapter][rc-admob-adapter] | RevenueCat | Adapter install for iOS and Android                    |
| [AdMob SDK integration][rc-admob]             | RevenueCat | `loadAndTrack` code samples                            |
| [Manual integration][rc-ads-manual]           | RevenueCat | `AdTracker` calls for AppLovin MAX, ironSource, others |
| [Granting ad rewards][rc-ads-rewards]         | RevenueCat | Server-verified rewards for rewarded ads               |
| [Ads charts][rc-ads-charts]                   | RevenueCat | Impressions, revenue, eCPM, and fill-rate charts       |
| [Changelog entry][rc-ads-changelog]           | RevenueCat | The March 25, 2026 public beta launch                  |
| [Launch post][rc-ads-blog]                    | RevenueCat | How to request beta access                             |
| [Catvertising brief video][vid-catvertising]  | RevenueCat | The category overview on RevenueCat's YouTube channel  |

Key facts:

- The docs call the feature "Ad Monetization", and every page carries "This
  feature is currently in beta." The charts page adds that it "requires access
  to be granted". ([rc-ads]; [rc-ads-charts])
- How to get access: "Any customer can request access to the feature by
  navigating to the Ads page in their RevenueCat dashboard." (launch post,
  published April 13, 2026, updated April 16, 2026) ([rc-ads-blog])
- RevenueCat does not serve the ads: "You're not replacing your ad SDK or
  changing how ads are served—you're just adding tracking to send ad events to
  RevenueCat." AdMob has a helper library; AppLovin MAX, ironSource, and Unity
  Ads use the manual integration. ([rc-ads])
- The network must report impression-level revenue data (ILRD). AdMob users turn
  on the "Impression-level ad revenue" toggle under Settings in the AdMob
  dashboard. ([rc-ads])
- Minimum SDKs are purchases-android 8.0.0, purchases-ios 5.0.0,
  purchases_flutter 10.2.0, and react-native-purchases 10.2.0. The AdMob adapter
  needs purchases-ios 5.89.0 with iOS 15.0, or purchases-android 10.19.0.
  ([rc-ads]; [rc-admob-adapter])
- "Ad revenue does not currently contribute to your Monthly Tracked Revenue
  (MTR)", so the feature is "free to use while this remains the case".
  ([rc-ads])
- To test, open the Ads page and switch on "Sandbox data"; "Events tracked in
  debug builds are automatically considered sandbox events." ([rc-ads])

[rc-admob-adapter]: https://www.revenuecat.com/docs/getting-started/adapter-sdks/admob
[rc-admob]: https://www.revenuecat.com/docs/ad-monetization/admob
[rc-ads-manual]: https://www.revenuecat.com/docs/ad-monetization/manual-integration
[rc-ads-rewards]: https://www.revenuecat.com/docs/ad-monetization/rewards
[rc-ads-changelog]: https://www.revenuecat.com/changelog/release/track-in-app-ad-revenue-alongside-your-subscriptions-2026-03-25
[vid-catvertising]: https://www.youtube.com/watch?v=llQMv_WyBlY

### Web purchases and Funnels for Funnel Vision

| Resource                                           | Owner      | What it's for                                       |
| -------------------------------------------------- | ---------- | --------------------------------------------------- |
| [RevenueCat Web][rc-web]                           | RevenueCat | Web billing engines and web purchase paths          |
| [RevenueCat Billing][rc-billing]                   | RevenueCat | RevenueCat's own web billing engine, on Stripe      |
| [Connect your Stripe account][rc-connect-stripe]   | RevenueCat | The Stripe connection both Stripe-based engines use |
| [Stripe Billing][rc-stripe-billing]                | RevenueCat | Selling Stripe Billing products through RevenueCat  |
| [Funnels][rc-funnels]                              | RevenueCat | Hosted multi-step web funnels                       |
| [Configuring payments][rc-funnels-payments]        | RevenueCat | Payment setup a funnel needs before checkout works  |
| [Deploying funnels][rc-funnels-deploy]             | RevenueCat | Publishing a funnel and finding its URL             |
| [Stripe Projects quickstart][rc-stripe-projects]   | RevenueCat | Provisioning RevenueCat from the Stripe CLI         |
| [Web-to-App Funnels Handbook][rc-funnels-handbook] | RevenueCat | Funnel strategy, linked from the September 18 post  |

Key facts:

- RevenueCat Web has three billing engines. "RevenueCat Billing: RevenueCat's
  own billing engine, using Stripe as the payment gateway." The other two are
  Stripe Billing and Paddle Billing. ([rc-web])
- The old `/docs/web/web-billing/overview` URL now declares `/docs/web/overview`
  canonical, and the docs call the engine "RevenueCat Billing". It "cannot
  currently be used in India". ([rc-web]; [rc-billing])
- "Funnels is included in Pro at no additional cost." A funnel needs a connected
  payment provider, a web config, at least one product, and an offering.
  ([rc-funnels])
- "Only the owner of the RevenueCat project can connect a Stripe account." New
  Stripe accounts that haven't finished verification "may only have access to
  sandbox mode". ([rc-connect-stripe])
- Getting the URL: publish, then click "Share URL". Stripe and RevenueCat
  Billing funnels show separate Production and Sandbox URLs, in the format
  `https://signup.cat/{link_id}/{app_user_id}`. ([rc-funnels-deploy])
- "Redemption Links are required to use your funnels with anonymous users, such
  as those coming directly from an ad". ([rc-funnels-payments])
- Stripe Projects: `stripe projects add revenuecat/app` creates the RevenueCat
  account, project, and app, and writes `REVENUECAT_APP_UUID`,
  `REVENUECAT_DASHBOARD_URL`, and `REVENUECAT_SECRET_API_KEY` to `.env`. The
  prerequisite is "A Stripe project for your app. If you don't have one yet, run
  `stripe projects init`". ([rc-stripe-projects])
- The page's note on "Stripe Projects vs. RevenueCat projects" warns: "These are
  different things." ([rc-stripe-projects])

[rc-billing]: https://www.revenuecat.com/docs/web/web-billing/configuring-overview
[rc-connect-stripe]: https://www.revenuecat.com/docs/web/connect-stripe-account
[rc-stripe-billing]: https://www.revenuecat.com/docs/web/integrations/stripe
[rc-funnels]: https://www.revenuecat.com/docs/tools/funnels
[rc-funnels-payments]: https://www.revenuecat.com/docs/tools/funnels/configuring-payments
[rc-funnels-deploy]: https://www.revenuecat.com/docs/tools/funnels/deploying-funnels
[rc-stripe-projects]: https://www.revenuecat.com/docs/getting-started/stripe-projects-quickstart
[rc-funnels-handbook]: https://www.revenuecat.com/guides/web-to-app-funnels

#### What the Stripe Project ID refers to

- The rules and the submission guide ask for a "Stripe Project ID" but never
  define it. ([rules]; [rc-submit])
- Stripe documents one "project" object: "A Stripe project represents a single
  app or codebase", and `stripe projects list` "returns each project's name, ID,
  and creation date." ([stripe-projects])
- The Ship Kit perk ties the same flow to Shipaton: it unlocks when you
  "provision your RevenueCat account and/or Project via Stripe Projects".
  ([dp-resources])
- Synthesis: the field most likely wants the ID that `stripe projects list`
  prints for the Stripe Projects project that provisioned RevenueCat, not a
  Stripe account ID or a RevenueCat project ID. Confirm with
  `shipaton@revenuecat.com` before relying on it.

### Galaxy Store support

| Resource                                                     | Owner      | What it's for                                           |
| ------------------------------------------------------------ | ---------- | ------------------------------------------------------- |
| [Publish your app on the Galaxy Store][rc-galaxy-onboarding] | RevenueCat | Seller Portal account, commercial status, and listing   |
| [Connect the Galaxy Store to RevenueCat][rc-galaxy-setup]    | RevenueCat | Service account that lets RevenueCat validate purchases |
| [Galaxy Store product setup][rc-galaxy-products]             | RevenueCat | Creating and activating in-app items                    |
| [Galaxy Store notifications][rc-galaxy-notifications]        | RevenueCat | Optional real-time purchase notifications               |
| [Android install, other stores][rc-android]                  | RevenueCat | The `purchases-store-galaxy` module                     |
| [React Native install, other stores][rc-rn]                  | RevenueCat | The `react-native-purchases-store-galaxy` package       |

Key facts:

- "Galaxy Store support is available in Android SDK versions `10.7.0` and above,
  and React Native SDK versions `10.3.0` and above. Support for other hybrid
  SDKs is coming soon." ([rc-android])
- Synthesis: until that support lands, a Flutter or Kotlin Multiplatform app
  can't use RevenueCat on the Galaxy Store; Expo apps can, through the React
  Native package.
- Prerequisites: "A D-U-N-S Number, required to request Commercial Seller
  Status", a bank or PayPal account, and an APK build. "Commercial Seller Status
  is required to publish Android apps in the Galaxy Store, even if your apps are
  free." ([rc-galaxy-onboarding])
- To speed up approval, "Email your seller email address to the Galaxy Store
  Onboarding team at rc.onboard@samsung.com". ([rc-galaxy-onboarding])
- Listing assets: a 512x512 icon and screenshots with a "2:1 image ratio,
  minimum 4, maximum 8 images". ([rc-galaxy-onboarding])
- The service account is created under "Assistance > API Service" with the
  "Publishing & ITEM" and "GSS" scopes. Products must be activated before the
  SDK can fetch them. ([rc-galaxy-setup]; [rc-galaxy-products])
- "Galaxy Store test purchases require a physical Galaxy device signed in with a
  Samsung account. The Galaxy Store does not support test purchases in
  emulators." Use `GalaxyBillingMode.TEST` to test, and "Only use
  `GalaxyBillingMode.PRODUCTION` when submitting your app for beta or production
  distribution." ([rc-android])

[rc-galaxy-setup]: https://www.revenuecat.com/docs/platform-resources/galaxy-platform-resources/galaxy-setup-guide
[rc-galaxy-products]: https://www.revenuecat.com/docs/getting-started/entitlements/galaxy-products
[rc-galaxy-notifications]: https://www.revenuecat.com/docs/platform-resources/server-notifications/galaxy-server-notifications

### App Growth Annual and the Shippies

| Resource                      | Owner      | What it's for                                        |
| ----------------------------- | ---------- | ---------------------------------------------------- |
| [App Growth Annual 2026][aga] | RevenueCat | The New York conference where trophies are presented |
| [The 2026 Shippies][shippies] | RevenueCat | The awards ceremony the Devpost page mentions        |

Key facts:

- App Growth Annual is on "October 21, 2026" at The Glasshouse, "660 12th Ave,
  New York, NY 10019", and is "Streamed live to wherever you are." ([aga])
- The Shippies ceremony is on "October 20, 2026" at the Intrepid Museum: "For
  the first time in 2026, The Shippies are getting a standalone ceremony as part
  of New York App Week." ([shippies])
- The rules tie them to Shipaton: "Grand-prize and major-category trophies will
  be presented live at RevenueCat's App Growth Annual conference." An invitation
  "provides admission only". ([rules], sections 1 and 8)

## Store documentation

### App Store Connect help

| Resource                                                  | Owner | What it's for                                 |
| --------------------------------------------------------- | ----- | --------------------------------------------- |
| [Add a new app][asc-add-app]                              | Apple | Creating the app record                       |
| [Create In-App Purchases][asc-iap]                        | Apple | Consumable and non-consumable products        |
| [Offer auto-renewable subscriptions][asc-subs]            | Apple | Subscription groups, levels, and proceeds     |
| [Overview of submitting for review][asc-submit]           | Apple | What a submission can contain                 |
| [TestFlight overview][asc-testflight]                     | Apple | Internal and external beta testing            |
| [Testing subscriptions in TestFlight][asc-testflight-iap] | Apple | TestFlight renewal rates                      |
| [Overview of testing in sandbox][asc-sandbox]             | Apple | Sandbox Apple Accounts and scenarios          |
| [Sign and update agreements][asc-agreements]              | Apple | The Paid Apps Agreement                       |
| [Screenshot specifications][asc-screenshots]              | Apple | Required screenshot sizes per device          |
| [App Review][apple-app-review]                            | Apple | Review times, common issues, expedited review |
| [Enroll in the Apple Developer Program][apple-enroll]     | Apple | Membership fee and organization requirements  |

Key facts:

- "You can't add an app to your account until the Account Holder signs the
  latest agreement in the Business section." A new record starts in "Prepare for
  Submission". ([asc-add-app])
- In-App Purchases live under "Monetization"; "It may take up to 1 hour for
  changes you make to product metadata to appear in the sandbox environment."
  ([asc-iap])
- Subscriptions need a subscription group first. Durations are "1 week, 1 month,
  2 months, 3 months, 6 months, and 1 year", and proceeds are 70% in a
  subscriber's first year, then 85%; "Members of the App Store Small Business
  Program receive 85% starting on the first day." ([asc-subs])
- "Each platform can have one app version submission under review at a time",
  and "Submissions may not be reviewed in the order you submit them." In-app
  purchases and subscriptions can go in the same submission. ([asc-submit])
- TestFlight allows "external testers (up to 10,000 people) and internal testers
  (up to 100 App Store Connect users with access to your content)". The first
  external build needs review: "A review is required only for the first build."
  "You can test a build for up to 90 days." ([asc-testflight])
- "Each subscription is renewed daily, up to 6 times within a 1-week period,
  regardless of the subscription's duration." The old
  `subscription-renewal-rate-in-testflight` URL redirects to this page.
  ([asc-testflight-iap])
- Sandbox Apple Accounts sign in on development-signed builds, with Developer
  Mode on; StoreKit Testing in Xcode works without App Store servers.
  ([asc-sandbox])
- "To sell your apps on the App Store or offer In-App Purchases, the Account
  Holder must sign the Paid Apps Agreement." "You won't be able to create a new
  app or In-App Purchase until you've agreed to the most recent version of the
  Paid Apps Agreement." ([asc-agreements])
- Shipaton's 1179 × 2556 screenshot is Apple's 6.3-inch size, which App Store
  Connect accepts but doesn't require. For iPhone apps Apple requires 6.5-inch
  shots, such as 1284 x 2778, unless you provide 6.9-inch ones, such as 1320 x
  2868, so plan two exports. ([asc-screenshots])
- "On average, 90% of submissions are reviewed in less than 24 hours." And "over
  40% of unresolved issues are related to guideline 2.1: App Completeness".
  ([apple-app-review])
- Expedited review covers "releasing your app to coincide with an event you're
  directly associated with"; the request form requires signing in with an Apple
  Account. ([apple-app-review])
- "The Apple Developer Program is 99 USD per membership year." Organizations
  must have a D-U-N-S Number. ([apple-enroll])

[asc-add-app]: https://developer.apple.com/help/app-store-connect/create-an-app-record/add-a-new-app
[asc-iap]: https://developer.apple.com/help/app-store-connect/manage-in-app-purchases/create-consumable-or-non-consumable-in-app-purchases
[asc-subs]: https://developer.apple.com/help/app-store-connect/manage-subscriptions/offer-auto-renewable-subscriptions
[asc-submit]: https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/overview-of-submitting-for-review
[asc-testflight]: https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview
[asc-testflight-iap]: https://developer.apple.com/help/app-store-connect/test-a-beta-version/testing-subscriptions-and-in-app-purchases-in-testflight/
[asc-sandbox]: https://developer.apple.com/help/app-store-connect/test-in-app-purchases/overview-of-testing-in-sandbox
[asc-agreements]: https://developer.apple.com/help/app-store-connect/manage-agreements/sign-and-update-agreements
[asc-screenshots]: https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications
[apple-enroll]: https://developer.apple.com/programs/enroll/

### App Review Guidelines

| Resource                                  | Owner | What it's for                                  |
| ----------------------------------------- | ----- | ---------------------------------------------- |
| [App Review Guidelines][apple-guidelines] | Apple | The rules every App Store submission must meet |

Key facts:

- The page reads "Last Updated: June 8, 2026". ([apple-guidelines])
- 2.1(a): include "demo account info (and turn on your back-end service!) if
  your app includes a login". 2.1(b): in-app purchases must be "complete,
  up-to-date, visible to the reviewer and functional". ([apple-guidelines])
- 3.1.1: "If you want to unlock features or functionality within your app ...
  you must use in-app purchase", and you should "make sure you have a restore
  mechanism for any restorable in-app purchases". ([apple-guidelines])
- 3.1.2(a): "the subscription period must last at least seven days". 3.1.2(c):
  "Before asking a customer to subscribe, you should clearly describe what the
  user will get for the price." ([apple-guidelines])
- 3.1.1(a): link-out entitlements "are not required for developers to include
  buttons, external links, or other calls to action in their United States
  storefront apps". This matters for app-to-web paywall buttons.
  ([apple-guidelines])
- 4.8: an app that uses a third-party login "must also offer as an equivalent
  option another login service" that limits data to name and email, lets users
  keep their email private, and doesn't collect interactions for ads without
  consent. ([apple-guidelines])
- 5.1.1(v): "If your app supports account creation, you must also offer account
  deletion within the app." ([apple-guidelines])
- After approval, "it can take up to 24-hours for your app to appear on all
  selected storefronts." ([apple-guidelines])

### Play Console help

| Resource                                                          | Owner  | What it's for                                    |
| ----------------------------------------------------------------- | ------ | ------------------------------------------------ |
| [Get started with Play Console][gp-start]                         | Google | Registration and the one-time fee                |
| [Choose a developer account type][gp-account-type]                | Google | Personal versus organization accounts            |
| [Create and set up your app][gp-create-app]                       | Google | The app record and dashboard setup               |
| [Set up an open, closed, or internal test][gp-testing]            | Google | Testing tracks                                   |
| [Testing requirements for new personal accounts][gp-testing-reqs] | Google | The 12-tester, 14-day rule and production access |
| [Publish your app][gp-publish]                                    | Google | Publishing and review times                      |
| [Create an in-app product][gp-iap]                                | Google | One-time products                                |
| [Create and manage subscriptions][gp-subs]                        | Google | Subscription products                            |
| [Google Play's billing system][gp-billing]                        | Google | Play Billing Library overview                    |
| [Play Billing Library deprecation][gp-pbl]                        | Google | Library version deadlines                        |

Key facts:

- "There is a US$25 one-time registration fee". ([gp-start])
- "To create a developer account for an organization, you must have a D-U-N-S
  number." Both account types "have access to the same functionality".
  ([gp-account-type])
- Personal accounts created after November 13, 2023 "must run a closed test for
  their app with a minimum of 12 testers who have been opted in continuously for
  at least 14 days" before they can apply for production. That review "usually
  takes seven days or less, but can occasionally take longer."
  ([gp-testing-reqs])
- Synthesis: the rule names only personal accounts, so an organization account,
  which needs a D-U-N-S number, may avoid the 14-day test. No Google page found
  states the rule for organization accounts, so treat this as unconfirmed.
  ([gp-testing-reqs]; [gp-account-type])
- "An internal test can have up to 100 testers per app", and "You can start an
  internal test before completing app setup." Internal testers "need to pay for
  in-app purchases unless you add them to a license testers list."
  ([gp-testing])
- Publishing: "Certain apps may be subject to extended reviews, which may result
  in review times of up to 7 days or longer in exceptional cases."
  ([gp-publish])
- "Package names for app files are unique and permanent", and product IDs "can't
  be changed or reused after they've been created". ([gp-create-app]; [gp-iap])
- In-app products need the `com.android.vending.BILLING` permission and a
  payments profile. ([gp-iap]; [gp-subs])
- "By Aug 31, 2026, all new apps and updates to existing apps must use Billing
  Library version 8 or later. If you need more time to update your app, you can
  request an extension until Nov 1, 2026." purchases-android 10.22.1 pins
  `billingClient = "8.3.0"` in its version catalog. ([gp-billing]; [gh-android])

[gp-start]: https://support.google.com/googleplay/android-developer/answer/6112435
[gp-account-type]: https://support.google.com/googleplay/android-developer/answer/13634885
[gp-create-app]: https://support.google.com/googleplay/android-developer/answer/9859152
[gp-testing]: https://support.google.com/googleplay/android-developer/answer/9845334
[gp-testing-reqs]: https://support.google.com/googleplay/android-developer/answer/14151465
[gp-iap]: https://support.google.com/googleplay/android-developer/answer/1153481
[gp-subs]: https://support.google.com/googleplay/android-developer/answer/140504
[gp-pbl]: https://developer.android.com/google/play/billing/deprecation-faq

### Galaxy Store Seller Portal guides

| Resource                                         | Owner   | What it's for                                        |
| ------------------------------------------------ | ------- | ---------------------------------------------------- |
| [Seller Portal][sam-seller-portal]               | Samsung | Where apps and in-app items are registered           |
| [Get Started in Galaxy Store][sam-prepare]       | Samsung | Accounts and commercial seller status                |
| [Register your app in Seller Portal][sam-launch] | Samsung | Listing, binary, pricing, and publication settings   |
| [App Distribution Guide][sam-distribution]       | Samsung | The content and quality rules for publication review |
| [Galaxy Store FAQ][sam-faq]                      | Samsung | Technical requirements and approval times            |
| [Samsung In-App Purchase][sam-iap]               | Samsung | The payment service RevenueCat wraps                 |
| [IAP Helper programming guide][sam-iap-helper]   | Samsung | IAP operation modes, including test mode             |

Key facts:

- "If you want to distribute free or paid apps in Galaxy Store, you must have
  commercial seller status." Samsung offers commercial seller requests for both
  corporate and private sellers. ([sam-prepare])
- Approval takes time: "It can take several days to be approved for commercial
  seller status. It can take up to 10 business days to verify your D-U-N-S
  number and it can take up to 10 business days to verify your international
  bank account." ([sam-faq])
- "Galaxy Store requires a target API level >=33 and at least one 64-bit binary
  to be registered." ([sam-faq])
- If the same content is on Google Play, Samsung recommends a separate Galaxy
  package name, such as `com.myapp.samsung`, for apps using Samsung In-App
  Purchase. ([sam-faq])
- Distribution rules to note: "1.1.4 Trial or beta version binaries must not be
  submitted."; "1.1.5 For apps that require user login, login info ... must be
  provided during app registration."; "1.3.4 If an app provides in-app item
  purchases or advertisements, this must be accurately shown and described in
  the app registration preview images, screenshot images, and descriptions."
  ([sam-distribution])
- "You can add in-app products only after you register a binary to which Samsung
  In-App Purchase is applied." ([sam-iap])
- Publication can be automatic after review, on a date, or manual, and "You can
  publish updated in-app items without going through the Seller Portal review
  process by using real-time item management." ([sam-launch])

[sam-seller-portal]: https://seller.samsungapps.com/
[sam-launch]: https://developer.samsung.com/galaxy-store/launch.html
[sam-distribution]: https://developer.samsung.com/galaxy-store/distribution-guide.html
[sam-iap]: https://developer.samsung.com/iap/overview.html
[sam-iap-helper]: https://developer.samsung.com/iap/programming-guide/iap-helper-programming.html

## Sponsor documentation

### JetBrains: Kotlin and Compose Multiplatform

| Resource                                              | Owner     | What it's for                                       |
| ----------------------------------------------------- | --------- | --------------------------------------------------- |
| [Ship Kotlin Everywhere Award page][jb-shipaton]      | JetBrains | JetBrains's own Shipaton landing page               |
| [Kotlin Multiplatform starter guide][jb-starter]      | JetBrains | A Shipaton-specific path through the KMP docs       |
| [Kotlin Multiplatform quickstart][jb-kmp-quickstart]  | JetBrains | Environment setup and a first KMP app               |
| [Create your Compose Multiplatform app][jb-cmp-first] | JetBrains | A first shared-UI app on Android, iOS, desktop, web |
| [Junie][jb-junie]                                     | JetBrains | JetBrains's coding agent, free for entrants         |

Key facts:

- The landing page renders in JavaScript; its text was read from the page's
  script bundle. It says: "Ship Kotlin Everywhere is the JetBrains category at
  RevenueCat Shipaton 2026. You submit once on Devpost, and your app also
  competes for the $100k Grand Prize and any other Shipaton categories it
  qualifies for." ([jb-shipaton])
- Perks on that page: IntelliJ IDEA Ultimate, "Free access for 3 months", "You
  will get it as part of the Ship Kit."; and Junie, "Free access for 2 months",
  where "If you decide to use Junie, you need to describe and share your journey
  in any format you choose." ([jb-shipaton])
- The rules require live App Store and Google Play URLs and a description of how
  KMP or CMP was used; blog posts and ecosystem contributions are optional
  extras. ([rules], section 4)
- The starter guide recommends Swift Package Manager over CocoaPods, which "is
  generally being phased out", and reminds you: "Don't forget about the privacy
  manifest required by the Apple App Store." ([jb-starter])
- "For Shipaton participants, JetBrains offers free access to the EAP version of
  the Junie CLI agent." The guide also suggests an `AGENTS.md` file and the
  klibs.io and Compose Hot Reload MCP servers. ([jb-starter])
- The KMP plugins need "at least IntelliJ IDEA 2025.2.2 or Android Studio Otter
  2025.2.1", and "To create iOS applications, you need a macOS host with Xcode
  installed." ([jb-kmp-quickstart])
- The Compose tutorial needs "No previous experience with Compose Multiplatform,
  Android, or iOS", and warns against upgrading the Android Gradle plugin "as
  Kotlin Multiplatform is not compatible with the latest AGP version".
  ([jb-cmp-first])

[jb-starter]: https://kotlinlang.org/docs/multiplatform/shipathon-starter-guide.html
[jb-kmp-quickstart]: https://kotlinlang.org/docs/multiplatform/quickstart.html
[jb-cmp-first]: https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html
[jb-junie]: https://junie.jetbrains.com/

### Noise

| Resource                                         | Owner | What it's for                             |
| ------------------------------------------------ | ----- | ----------------------------------------- |
| [Noise][noise]                                   | Noise | The UGC creator platform                  |
| [Sign up][noise-signup]                          | Noise | Account creation                          |
| [Getting Started][noise-start]                   | Noise | The four setup steps to a live campaign   |
| [Campaigns][noise-campaigns]                     | Noise | Campaign types, budgets, and review       |
| [Premium app access for creators][noise-premium] | Noise | Letting creators use the paid features    |
| [App Store integrations][noise-store-int]        | Noise | First-party install data from both stores |
| [Pricing][noise-pricing]                         | Noise | Plans                                     |
| [llms.txt][noise-llms]                           | Noise | Reporting API and MCP details for agents  |

Key facts:

- "Noise is a creator-economy platform connecting brands with content creators
  for UGC (user-generated content) campaigns." ([noise-llms])
- Sign-up: the "Get started free" link redirects from
  `getnoise.com/auth/sign-up` to `platform.getnoise.com`. Setup takes four
  steps: billing, a playbook, campaign images, and the first campaign.
  ([noise-signup]; [noise-start])
- "The minimum daily budget is $50." Charges come only from views: "Nothing is
  charged until your campaign is live and creators are earning views."
  ([noise-campaigns]; [noise-start])
- Plans: Standard, "Start with $0", with "No monthly platform fee"; Unlimited,
  "$99/ month", "Instantly credited towards your campaign spend."
  ([noise-pricing])
- To show paid features, give creators a public TestFlight link or a shared test
  login; the TestFlight route needs external-testing review. ([noise-premium])
- The submission needs "the email address associated with the Entrant's Noise
  account". ([rules], section 4)
- Noise can read installs through a read-only App Store Connect key with the
  "Sales and Reports" role, or a Google Play service account.
  ([noise-store-int])

[noise]: https://getnoise.com/
[noise-signup]: https://getnoise.com/auth/sign-up
[noise-start]: https://getnoise.com/docs/getting-started
[noise-campaigns]: https://getnoise.com/docs/campaigns
[noise-premium]: https://getnoise.com/docs/guides/premium-app-access
[noise-store-int]: https://getnoise.com/docs/app-store-integrations
[noise-pricing]: https://getnoise.com/pricing
[noise-llms]: https://getnoise.com/llms.txt

### Samsung: optimizing for Galaxy devices

| Resource                                     | Owner   | What it's for                             |
| -------------------------------------------- | ------- | ----------------------------------------- |
| [Foldables and Large Screens][sam-foldables] | Samsung | Hub for foldable and large-screen work    |
| [One UI large-screen guidelines][sam-oneui]  | Samsung | Design guidance for foldables and tablets |
| [UX and UI considerations][sam-ux]           | Samsung | Aspect ratios and responsive layouts      |
| [App continuity][sam-continuity]             | Samsung | Keeping state across fold and unfold      |
| [Testing for foldables][sam-testing]         | Samsung | What to test and on which devices         |
| [Remote Test Lab][sam-rtl]                   | Samsung | Real Galaxy devices over the web          |

Key facts:

- The rules score "Galaxy optimization (20%): Does the Project take advantage of
  Samsung-specific features such as foldable-device support, multi-window, or
  device-specific hardware?" alongside "Store quality". ([rules], section 6)
- Set `resizeableActivity` to true "to ensure your app works in multi-window
  mode with dynamic resizing"; to keep continuity without multi-window, add the
  `android.supports_size_changes` meta-data. ([sam-continuity])
- "To be compatible with Samsung foldable devices, you should test your apps for
  these ratios"; the `minAspectRatio` and `maxAspectRatio` flags constrain
  unsuitable ratios. ([sam-ux])
- Test "Optimized UI layout", "App continuity", "Multi-Active Window", and "Flex
  mode", on Remote Test Lab or foldable emulators. ([sam-testing])
- Remote Test Lab is free to join and lists the Galaxy Z Fold8, Galaxy Z Flip8,
  and Galaxy S26 Ultra among its devices. ([sam-rtl])
- Synthesis: use Remote Test Lab for layout checks. RevenueCat says test
  purchases need "a physical Galaxy device signed in with a Samsung account",
  and no source says whether a Remote Test Lab device counts. ([rc-android])

[sam-foldables]: https://developer.samsung.com/foldables-and-largescreens
[sam-oneui]: https://developer.samsung.com/one-ui/largescreen-and-foldable/intro.html
[sam-ux]: https://developer.samsung.com/galaxy-z/ux-and-ui-considerations.html
[sam-continuity]: https://developer.samsung.com/galaxy-z/app-continuity.html
[sam-testing]: https://developer.samsung.com/galaxy-z/testing.html
[sam-rtl]: https://developer.samsung.com/remote-test-lab

### Replit

| Resource                                         | Owner  | What it's for                                   |
| ------------------------------------------------ | ------ | ----------------------------------------------- |
| [Build a mobile app][replit-mobile-app]          | Replit | End-to-end mobile tutorial with Agent           |
| [Start your first mobile app][replit-first]      | Replit | Quickstart for a native iOS and Android app     |
| [Preview and test on your phone][replit-preview] | Replit | Expo Go testing and its limits                  |
| [Upload to App Store Connect][replit-upload]     | Replit | Replit's Launch flow: build, sign, and upload   |
| [Submit to the App Store][replit-submit]         | Replit | Listing and review                              |
| [Add payments with RevenueCat][replit-payments]  | Replit | Agent-driven RevenueCat setup                   |
| [Development URLs][replit-dev-urls]              | Replit | The preview links Replit gives in-progress apps |
| [Docs index][replit-llms]                        | Replit | Full page list, for agents                      |

Key facts:

- "Publishing to Google Play is not yet supported." Replit's publishing guides
  cover iOS only. ([replit-preview])
- The RevenueCat flow: ask Agent for a subscription, select "Connect
  RevenueCat", grant "Read & Write" access, and "Agent creates the RevenueCat
  project, configures the product and entitlement, and wires up the purchase
  flow in your app." ([replit-payments])
- "Replit previews use RevenueCat's test mode." Syncing products to App Store
  Connect starts from "Publishing → Manage" and needs an App Store Connect API
  key plus an In-App Purchase key. ([replit-payments])
- Upload: publish the web app first, then use "Start publishing to the App
  Store". "The bundle ID used for your first publish is tied to your Replit
  project." ([replit-upload])
- On Apple review: "It's often a day or two, and sometimes longer, especially
  the first time you submit a new app." ([replit-submit])
- Development URLs follow the format `UUID.servername.replit.dev`; "The URL can
  change each time you reopen the app", and "Development URLs are temporary and
  intended for testing only." ([replit-dev-urls])

[replit-mobile-app]: https://docs.replit.com/build/mobile-app
[replit-first]: https://docs.replit.com/build/mobile-first-app
[replit-preview]: https://docs.replit.com/build/mobile-preview-testing
[replit-upload]: https://docs.replit.com/build/mobile-upload-ios
[replit-submit]: https://docs.replit.com/build/mobile-publish-ios
[replit-payments]: https://docs.replit.com/build/mobile-payments
[replit-llms]: https://docs.replit.com/llms.txt

### OneSignal

| Resource                                              | Owner      | What it's for                                   |
| ----------------------------------------------------- | ---------- | ----------------------------------------------- |
| [Mobile SDK setup][os-sdk-setup]                      | OneSignal  | Platform credentials and SDK install            |
| [Expo SDK setup][os-expo]                             | OneSignal  | Expo-specific install                           |
| [Keys and IDs][os-keys]                               | OneSignal  | Where the App ID lives                          |
| [Journeys overview][os-journeys]                      | OneSignal  | Automated multichannel flows                    |
| [Mobile-first lifecycle Journeys][os-mobile-journeys] | OneSignal  | Welcome, trial-to-paid, and win-back playbooks  |
| [RevenueCat integration][os-revenuecat]               | OneSignal  | Syncing subscription status into OneSignal tags |
| [OneSignal integration][rc-onesignal]                 | RevenueCat | The same integration from RevenueCat's side     |
| [OneSignal MCP server][os-mcp]                        | OneSignal  | Managing campaigns from an AI client            |

Key facts:

- "The App ID is a public UUID (v4) that identifies your OneSignal app." "Find
  your App ID in the dashboard under Settings > Keys & IDs". Setup also shows it
  on the last screen: "Copy and save it". ([os-keys]; [os-sdk-setup])
- Platform credentials come first: Firebase for Android, and a p8 token
  (recommended) or p12 certificate for iOS. ([os-sdk-setup])
- Expo needs "Expo SDK 53+ (React Native 0.79+) with New Architecture enabled",
  and "Push notifications do not work in Expo Go." ([os-expo])
- Journeys are "Automated multichannel messaging flows that send email, push,
  SMS, and in-app messages based on user behavior, time delays, or profile
  attributes." Assign an External ID so a user's channels merge into one
  profile. ([os-journeys])
- The RevenueCat integration takes the OneSignal App ID and an API key in
  RevenueCat's Integrations menu; RevenueCat then writes tags such as
  `period_type`, `store`, and `last_event_type`. ([os-revenuecat];
  [rc-onesignal])
- The hosted MCP endpoint is `https://api.onesignal.com/mcp/oauth`, also listed
  in the Claude connectors directory and the Cursor Marketplace. ([os-mcp])
- The rules say "A single deployed message is sufficient for eligibility, but
  more thoughtful use of the platform may receive stronger consideration."
  ([rules], section 6)

[os-sdk-setup]: https://documentation.onesignal.com/docs/en/mobile-sdk-setup
[os-expo]: https://documentation.onesignal.com/docs/en/react-native-expo-sdk-setup
[os-keys]: https://documentation.onesignal.com/docs/en/keys-and-ids
[os-journeys]: https://documentation.onesignal.com/docs/en/journeys-overview
[os-mobile-journeys]: https://documentation.onesignal.com/docs/en/mobile-first-journeys
[os-revenuecat]: https://documentation.onesignal.com/docs/en/revenuecat
[rc-onesignal]: https://www.revenuecat.com/docs/integrations/third-party-integrations/onesignal
[os-mcp]: https://documentation.onesignal.com/docs/en/model-context-protocol

### Layers

| Resource                                  | Owner  | What it's for                                   |
| ----------------------------------------- | ------ | ----------------------------------------------- |
| [Layers][layers]                          | Layers | The growth platform                             |
| [Layers for Shipaton 26][layers-shipaton] | Layers | Free Pro access and the Growth Loop Award       |
| [SDK overview][layers-sdk]                | Layers | Platforms, the App ID, and install verification |
| [SDK installation][layers-install]        | Layers | Per-platform install snippets                   |
| [Layers Growth MCP][layers-mcp]           | Layers | CLI setup that connects a coding agent          |
| [Agent guide][layers-llms]                | Layers | Setup steps written for coding agents           |

Key facts:

- "You build. Layers gets you users. It finds the people who want your app,
  makes the content and ads that reach them, and traces every install back to
  what caused it." ([layers])
- The SDK supports "Expo, React Native, iOS, Android, Flutter, Unity, Web, and
  Node". To get the App ID, "open Connections, choose Layers SDK, and press Get
  your App ID." ([layers-sdk])
- Install examples: Expo takes `@layers/expo` and `@layers/react-native` from
  npm, plus `expo-tracking-transparency` and `expo-linking`; iOS takes the Swift
  package `layers-sdk-ios` from 3.3.0; Android takes
  `com.layers.sdk:layers-android:3.3.0`. ([layers-install])
- To verify, check "the same Events screen in the app — you'll see events stream
  in and a live status indicator." ([layers-sdk])
- Shipaton offer: "Free Layers Pro for the whole Shipaton 26", claimed with your
  Shipaton registration email, "free through the end of Shipaton on October 1".
  Pro "is $49 a month otherwise." ([layers-shipaton])
- "For the Growth Loop Award it is required, because the loop has to be
  observable to be judged." ([layers-shipaton])
- Agent setup: `npm install -g @layers/cli`, then `layers setup`. The older
  `@layers/mcp-server` package was "Retired on 2026-08-30". ([layers-llms])

[layers]: https://layers.com/
[layers-sdk]: https://layers.com/docs/sdk
[layers-install]: https://layers.com/docs/sdk/installation
[layers-mcp]: https://layers.com/docs/mcp
[layers-llms]: https://layers.com/llms.txt

### Stripe

| Resource                                               | Owner  | What it's for                                    |
| ------------------------------------------------------ | ------ | ------------------------------------------------ |
| [Stripe Projects CLI][stripe-projects]                 | Stripe | Projects, services, credentials, and project IDs |
| [Stripe Projects][stripe-projects-site]                | Stripe | Product page and install command                 |
| [Stripe Projects providers][stripe-projects-providers] | Stripe | The provider catalog, including RevenueCat       |
| [Install the Stripe CLI][stripe-cli]                   | Stripe | The CLI that Stripe Projects plugs into          |
| [RevenueCat Stripe App][stripe-marketplace]            | Stripe | The Marketplace app that connects RevenueCat     |
| [In-app subscriptions help][stripe-support-iap]        | Stripe | Stripe's own note on the RevenueCat integration  |

Key facts:

- "Stripe Projects lets you and your AI agents add services, generate
  credentials, and manage billing from the CLI." Install with
  `stripe plugin install projects`, then run `stripe projects init`.
  ([stripe-projects-site]; [stripe-projects])
- "To find a project ID, run `stripe projects list`." `stripe projects status`
  "shows your project name, Stripe account, associated provider accounts,
  provisioned resources, current tiers, and health status." ([stripe-projects])
- RevenueCat's provider entry reads "In-app subscription infrastructure. Manage
  purchases, paywalls, and subscription analytics across iOS, Android, and
  web.", with the command `stripe projects add revenuecat/app`.
  ([stripe-projects-providers])
- RevenueCat's docs link `docs.stripe.com/stripe-cli/install`, which redirects
  to the Stripe CLI install page. ([stripe-cli])
- Stripe's help center says "Stripe Apps has an integration with a third party
  app provider Revenue Cat" for in-app subscriptions. The page needs JavaScript
  and was read with a rendering fetcher. ([stripe-support-iap])

[stripe-projects-site]: https://projects.dev/
[stripe-projects-providers]: https://projects.dev/providers/
[stripe-cli]: https://docs.stripe.com/cli/install
[stripe-support-iap]: https://support.stripe.com/questions/in-app-subscriptions

## Influencer Award creators

For audience research only. Handles come from each creator's own YouTube About
page or website. Each brief video is on RevenueCat's YouTube channel.

| Creator            | Award                      | YouTube                          | Other official channels                                                                       | Brief video          |
| ------------------ | -------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------- | -------------------- |
| Christopher Lawley | Productivity               | [@ChrisLawley][yt-lawley]        | Podcast site [The Untitled Site][lawley-podcast]; Instagram `@chrislawley_`                   | [Video][vid-lawley]  |
| Abbey Sharp        | Nutrition & Healthy Eating | [@AbbeySharpRD][yt-abbey]        | [Abbey's Kitchen][abbey-site]; Instagram, TikTok, and X `@abbeyskitchen`                      | [Video][vid-abbey]   |
| Simone Sharice     | Yoga & Fitness             | [@SIMONESHARICE][yt-simone]      | [Sundai Olive Pilates][simone-site]; Instagram `@simone.sharice`; TikTok `@simonesharice`     | [Video][vid-simone]  |
| Leadership Heather | Career Coaching            | [@LeadershipHeather][yt-heather] | [Custard][heather-site], the site her YouTube About links                                     | [Video][vid-heather] |
| Lewis Blogs Gaming | Gaming                     | [@LewisBlogsGaming][yt-lewis]    | [Website][lewis-site]; [Linktree][lewis-linktree]; Instagram and TikTok `@mrlewisblogsgaming` | [Video][vid-lewis]   |

Notes:

- Lawley's channel links his podcast site and the Instagram handle the category
  page gives. ([yt-lawley])
- Abbey Sharp's site links both a channel URL that resolves to `@AbbeySharpRD`
  and `youtube.com/@AbbeysKitchen`, which returns HTTP 404. ([abbey-site])
- Simone Sharice's About page links Instagram `@simone.sharice` and
  `@sundaiolivepilates`, TikTok `@simonesharice`, and her studio site.
  ([yt-simone])
- The `@LewisBlogsGaming` handle redirects to `youtube.com/LewisBlogsGaming`. A
  separate channel, `@LewisBlogs`, has 121 subscribers and a different
  description; don't confuse the two. ([yt-lewis])
- Instagram and TikTok pages sit behind login walls, so those handles weren't
  opened.
- The rules bar using "the name, likeness, image, voice, brand, logos, or other
  identifying features of any influencer" without "express written consent".
  ([rules], section 4)

[lawley-podcast]: https://theuntitled.site/
[vid-lawley]: https://www.youtube.com/watch?v=hz-eZBMxots
[abbey-site]: https://www.abbeyskitchen.com/
[vid-abbey]: https://www.youtube.com/watch?v=iDVQ6mShT6M
[simone-site]: https://www.sundaiolivepilates.com/
[vid-simone]: https://www.youtube.com/watch?v=vZwrxAbGtNo
[heather-site]: https://custardlearns.com/
[vid-heather]: https://www.youtube.com/watch?v=x5mc6Vxem2k
[lewis-site]: https://lewisblogsgaming.com/
[lewis-linktree]: https://linktr.ee/Lewisblogsgaming
[vid-lewis]: https://www.youtube.com/watch?v=ZNMnK-Y523g

## Past-edition references

The shipaton.com copies of these posts declare the revenuecat.com URLs below
canonical, and revenuecat.com strips a trailing slash with a redirect. Dates are
each post's `datePublished`.

| Edition         | Announcement                                       | Winners                                                      | Devpost                                                 |
| --------------- | -------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------- |
| 2024 Ship-a-ton | [RevenueCat Ship-a-ton][past-2024], Aug 3, 2024    | [2024 Ship-a-ton Winners][past-2024-winners], Sep 23, 2024   | [Overview][dp-2024]; [gallery][dp-2024-gallery]         |
| Shipaton 2025   | [Announcing Shipaton 2025][past-2025], Jul 7, 2025 | [Shipaton 2025 Winners][past-2025-winners], Oct 13, 2025     | [Overview][dp-2025]; [gallery][dp-2025-gallery]         |
| Shipyard 2026   | None found; see the notes below                    | [Shipyard 2026 winners][past-shipyard-winners], Feb 26, 2026 | [Overview][dp-shipyard]; [gallery][dp-shipyard-gallery] |
| Shipaton 2026   | [Announcing Shipaton 2026][past-2026], Jul 2, 2026 | Due October 21, 2026, per the rules                          | [Overview][dp-2026]; [gallery][dp-2026-gallery]         |

Notes:

- The Devpost pages are titled "RevenueCat Ship-a-ton", "RevenueCat Shipaton
  2025", "RevenueCat Shipyard: Creator Contest", and "RevenueCat Shipaton 2026".
  On September 21, 2026 their participant counts read 1,672; 51,882; 7,057; and
  26,920. ([dp-2024]; [dp-2025]; [dp-shipyard]; [dp-2026])
- RevenueCat's [sitemap][rc-sitemap] has no Shipyard announcement post. The
  earliest Shipyard posts are [How to win Shipyard][past-shipyard-win] (Jan 27,
  2026), [How to submit your app for Shipyard][past-shipyard-submit] (Jan 30),
  [Your Shipyard questions answered][past-shipyard-questions] (Feb 4), and
  [You can still win Shipyard][past-shipyard-still] (Feb 6).

[past-2024]: https://www.revenuecat.com/blog/engineering/revenuecat-ship-a-ton
[past-2024-winners]: https://www.revenuecat.com/blog/company/2024-ship-a-ton-winners
[dp-2024]: https://revenuecat-ship-a-ton.devpost.com/
[dp-2024-gallery]: https://revenuecat-ship-a-ton.devpost.com/project-gallery
[past-2025]: https://www.revenuecat.com/blog/company/shipaton-2025
[past-2025-winners]: https://www.revenuecat.com/blog/company/shipaton-2025-winners
[dp-2025]: https://revenuecat-shipaton-2025.devpost.com/
[dp-2025-gallery]: https://revenuecat-shipaton-2025.devpost.com/project-gallery
[past-shipyard-winners]: https://www.revenuecat.com/blog/company/shipyard-2026-winners
[dp-shipyard-gallery]: https://revenuecat-shipyard-2026.devpost.com/project-gallery
[past-2026]: https://www.revenuecat.com/blog/company/announcing-shipaton-2026
[past-shipyard-win]: https://www.revenuecat.com/blog/engineering/how-to-win-shipyard
[past-shipyard-submit]: https://www.revenuecat.com/blog/engineering/how-to-submit-your-app-for-shipyard
[past-shipyard-questions]: https://www.revenuecat.com/blog/company/shipyard-2026-questions
[past-shipyard-still]: https://www.revenuecat.com/blog/engineering/you-can-still-win-shipyard

## Conflicts

Where live documents disagree with each other or with the repo's notes. The
official rules prevail over every other Shipaton page.

- **Winners date.** The [rules] say "Winners announced: October 21st 2026". The
  [live FAQ][faq-live] still says "Winners will be announced on October 22,
  2026", as do the [brief] and the [research notes][notes].
- **Event dates.** The [notes] say App Growth Annual has no published date.
  RevenueCat's own sites list the Shippies ceremony on "October 20, 2026" and
  App Growth Annual on "October 21, 2026" ([shippies]; [aga]). Layers also gives
  "October 20, 2026" for the Shippies ([layers-shipaton]).
- **Submission start.** The [rules] open the Submission Period on "Friday, July
  31, 2026 at 8:00am PDT"; every other source says August 1. The rules
  contradict themselves on the #BuildInPublic period too: "on or around Friday,
  July 31, 2026 at 8:00am PDT" in section 1, and "on or around Saturday, August
  1st, 2026 (8:30 am Pacific Time)" in section 6. The August 1 sources are
  listed in the [notes].
- **Ship Kit size.** The [rules] say "up to 25 sponsor perks"; the Shipaton home
  page says 27 and the Ship Kit page lists 28, per the [notes].
- **Companies.** The [brief] lists company entries as an open question. The
  [rules] admit "Organizations (including corporations ...)" through a
  Representative.
- **One prize per app.** JetBrains's page says "Per the Shipaton rules, a single
  app can take home one overall award." ([jb-shipaton]) The [rules] limit a
  project only to one Influencer Award; no clause caps prizes overall. Treat the
  question as open and ask `shipaton@revenuecat.com`.
- **Weights and tie-breaks.** The [brief] and [notes] say none are published.
  The [rules] give Best App for Galaxy's Galaxy optimization "twenty percent
  (20%)" and break ties on "the first applicable criterion".
- **RevenueCat Ads.** Shipaton says apps may "serve ads through RevenueCat Ads"
  ([rules]). RevenueCat's docs call the feature "Ad Monetization", a beta that
  tracks ads served by AdMob or another network: "You're not replacing your ad
  SDK or changing how ads are served" ([rc-ads]). Access "requires access to be
  granted" ([rc-ads-charts]).
- **Web Billing name.** The docs now call RevenueCat's engine "RevenueCat
  Billing", and the old `web-billing/overview` URL points to
  `/docs/web/overview` ([rc-web]).
- **Galaxy seller type.** RevenueCat's guide says to pick "Corporate Seller" and
  lists a D-U-N-S number as a prerequisite ([rc-galaxy-onboarding]). Samsung
  also offers a commercial seller request "for private sellers", and says a
  D-U-N-S number is only the "easiest" way to verify a business ([sam-prepare]).
- **Sign in with Apple.** The [brief] says to add Sign in with Apple whenever an
  app offers Google or other third-party sign-in. Guideline 4.8 asks for
  "another login service" with specific privacy features and doesn't name Sign
  in with Apple ([apple-guidelines]).
- **Review time.** The [brief] says store review "usually takes a few business
  days". Apple says "On average, 90% of submissions are reviewed in less than 24
  hours" ([apple-app-review]); Google allows "up to 7 days or longer in
  exceptional cases" for extended reviews ([gp-publish]).
- **Discord invites.** The [notes] flag two different invites. Discord's invite
  API resolves both `shipaton26` and `X95EwqBxQT` to the same "Shipaton" server,
  ID `1379625629984493599` ([discord-api]).
- **Grand Prize name.** Layers calls it "the Build & Grow Award"
  ([layers-shipaton]), the 2025 name; in 2026 it is just "Grand Prize"
  ([rules]).
- **Audience sizes.** The category pages, as quoted in the [notes], give YouTube
  audiences of 230K (Lawley), 718K (Abbey Sharp), 101K (Simone Sharice), 2.6K
  (Heather), and 376K (Lewis). The live About pages read 206K, 716K, 449K,
  2.92K, and 387K ([yt-lawley]; [yt-abbey]; [yt-simone]; [yt-heather];
  [yt-lewis]). Simone Sharice's channel is over four times the brief's figure.
- **SDK sample versions.** The Android page's samples pin `10.15.1`
  ([rc-android]), and the Flutter page `^10.10.0` ([rc-flutter]), behind the
  GitHub releases of 10.22.1 and 10.13.1 ([gh-android]; [gh-flutter]).

[faq-live]: https://www.shipaton.com/faq
[discord-api]: https://discord.com/api/v10/invites/shipaton26

## Gaps

What couldn't be found or verified on September 21, 2026:

- **Stripe Project ID.** Undefined in every Shipaton source; see
  [What the Stripe Project ID refers to](#what-the-stripe-project-id-refers-to).
- **Replit preview URL.** Neither the rules nor Replit's docs define it. The
  closest Replit term is a development URL, which "can change each time you
  reopen the app" ([replit-dev-urls]).
- **Funnel Vision checkout.** The [rules] want "Stripe as the checkout
  provider". RevenueCat Billing also runs on Stripe ([rc-web]), and no source
  says whether a RevenueCat Billing funnel qualifies or only a Stripe Billing
  one. Paddle funnels clearly don't.
- **Funnel Vision period.** The rules ask "What total payment volume did the
  Project process through its web funnel via Stripe?" but set no measurement
  window ([rules]).
- **Ads access timing.** No source says how long a request for RevenueCat Ads
  access takes ([rc-ads-blog] says only where to ask).
- **Galaxy review time.** Samsung publishes approval times for commercial seller
  status but none for app review ([sam-faq]).
- **Galaxy for Flutter and KMP.** RevenueCat says support for other hybrid SDKs
  "is coming soon" but gives no date ([rc-android]).
- **Heather's social handles.** Her [YouTube About page][yt-heather] links only
  her company site, so her Instagram and TikTok handles aren't confirmed by a
  page she owns.
- **Unreadable pages.** The [Stripe Marketplace listing][stripe-marketplace]
  returns HTTP 200 but renders only in the browser. The
  [Kotlin landing page][jb-shipaton] was read from its script bundle. The
  Samsung Seller Portal guide at `seller.samsungapps.com/getSellerGuide.as` is a
  script app whose sections couldn't be read.
- **Shipyard announcement.** No announcement post exists in RevenueCat's
  [sitemap][rc-sitemap]; the [Devpost overview][dp-shipyard] is the earliest
  Shipyard page found.
- **Scripted checks.** developer.android.com pages, such as
  [Google Play's billing system][gp-billing], send cookie-less clients through a
  Google sign-in check; with cookies they return HTTP 200 directly.

URLs that failed to resolve, with the correct page where one exists:

| URL tried                                                                                                       | Result                       | Use instead                            |
| --------------------------------------------------------------------------------------------------------------- | ---------------------------- | -------------------------------------- |
| `https://www.youtube.com/@AbbeysKitchen` (linked from Abbey Sharp's site)                                       | HTTP 404                     | `@AbbeySharpRD`                        |
| `https://chrislawley.me/` (linked from Lawley's YouTube About)                                                  | Connection timed out         | The Untitled Site                      |
| `https://www.revenuecat.com/docs/ads`                                                                           | HTTP 404                     | `/docs/ad-monetization`                |
| `https://www.revenuecat.com/ads`                                                                                | HTTP 404                     | `/docs/ad-monetization`                |
| `https://www.revenuecat.com/docs/web/funnels`                                                                   | HTTP 404                     | `/docs/tools/funnels`                  |
| `https://www.revenuecat.com/docs/platform-resources/galaxy-store`                                               | HTTP 404                     | Galaxy onboarding and setup guides     |
| `https://www.revenuecat.com/docs/getting-started/installation/android/galaxy-store`                             | HTTP 404                     | Android install, "Other stores"        |
| `https://www.revenuecat.com/blog/company/announcing-shipyard/`                                                  | HTTP 404                     | None                                   |
| `https://www.revenuecat.com/blog/company/shipyard-creator-contest/`                                             | HTTP 404                     | None                                   |
| `https://www.revenuecat.com/shipyard/`                                                                          | HTTP 404                     | Shipyard Devpost overview              |
| `https://www.revenuecat.com/blog/company/how-we-judge-shipaton`                                                 | HTTP 404                     | shipaton.com copy only                 |
| `https://www.revenuecat.com/blog/engineering/how-we-judge-shipaton`                                             | HTTP 404                     | shipaton.com copy only                 |
| `https://docs.stripe.com/billing/subscriptions/revenuecat`                                                      | HTTP 404                     | Stripe Projects CLI docs               |
| `https://docs.stripe.com/payments/revenuecat`                                                                   | HTTP 404                     | Stripe Projects CLI docs               |
| `https://projects.dev/providers/revenuecat`                                                                     | HTTP 404                     | `projects.dev/providers/`              |
| `https://developer.apple.com/help/app-store-connect/manage-in-app-purchases/submit-in-app-purchases-for-review` | "Page Not Found"             | Overview of submitting for review      |
| `https://developer.apple.com/help/app-store-connect/manage-subscriptions/submit-a-subscription-for-review`      | "Page Not Found"             | Overview of submitting for review      |
| `https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/overview-of-manual-release`   | "Page Not Found"             | None                                   |
| `https://developer.apple.com/contact/app-store/?topic=expedite`                                                 | Redirects to Apple sign-in   | App Review page                        |
| `https://developer.samsung.com/galaxy-store/distribute.html`                                                    | HTTP 404                     | App Distribution Guide                 |
| `https://developer.samsung.com/galaxy-store/app-review.html`                                                    | HTTP 404                     | App Distribution Guide                 |
| `https://developer.samsung.com/galaxy-store/content-guidelines.html`                                            | HTTP 404                     | App Distribution Guide                 |
| `https://developer.samsung.com/galaxy-store/commercial-seller.html`                                             | HTTP 404                     | Get Started in Galaxy Store            |
| `https://developer.samsung.com/foldable`                                                                        | HTTP 404                     | Foldables and Large Screens            |
| `https://docs.getnoise.com/`                                                                                    | HTTP 530                     | `getnoise.com/docs`                    |
| `https://app.getnoise.com/`                                                                                     | HTTP 530                     | `platform.getnoise.com`                |
| `https://www.getnoise.com/shipaton`                                                                             | HTTP 404                     | None                                   |
| `https://docs.layers.com/`                                                                                      | No response                  | `layers.com/docs`                      |
| `https://www.layers.com/sdk`                                                                                    | HTTP 404                     | `layers.com/docs/sdk`                  |
| `https://documentation.onesignal.com/docs/en/mcp-server`                                                        | HTTP 404                     | `/docs/en/model-context-protocol`      |
| `https://replit.com/`                                                                                           | HTTP 403 to scripted fetches | `docs.replit.com`                      |
| `https://revenuecat-shipyard.devpost.com/`                                                                      | HTTP 404                     | `revenuecat-shipyard-2026.devpost.com` |
| `https://revenuecat-shipaton-2024.devpost.com/`                                                                 | HTTP 404                     | `revenuecat-ship-a-ton.devpost.com`    |

[brief]: /docs/BRIEF.md
[notes]: /docs/research/shipaton-2026.md
[rules]: https://revenuecat-shipaton-2026.devpost.com/rules
[dp-resources]: https://revenuecat-shipaton-2026.devpost.com/resources
[rc-submit]: https://www.revenuecat.com/blog/engineering/how-to-submit-your-app-for-shipaton
[dp-2026-gallery]: https://revenuecat-shipaton-2026.devpost.com/project-gallery
[dp-2026]: https://revenuecat-shipaton-2026.devpost.com/
[rc-android]: https://www.revenuecat.com/docs/getting-started/installation/android
[rc-rn]: https://www.revenuecat.com/docs/getting-started/installation/reactnative
[rc-flutter]: https://www.revenuecat.com/docs/getting-started/installation/flutter
[gh-android]: https://github.com/RevenueCat/purchases-android/releases
[gh-flutter]: https://github.com/RevenueCat/purchases-flutter/releases
[rc-test-store]: https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store
[rc-mcp-tools]: https://www.revenuecat.com/docs/tools/mcp/tools-reference
[rc-ads]: https://www.revenuecat.com/docs/ad-monetization
[rc-ads-charts]: https://www.revenuecat.com/docs/dashboard-and-metrics/charts/ads
[rc-ads-blog]: https://www.revenuecat.com/blog/growth/track-in-app-ad-revenue-alongside-purchases-get-the-full-picture-on-monetization
[rc-web]: https://www.revenuecat.com/docs/web/overview
[stripe-projects]: https://docs.stripe.com/projects
[rc-galaxy-onboarding]: https://www.revenuecat.com/docs/platform-resources/galaxy-platform-resources/galaxy-store-onboarding
[aga]: https://appgrowthannual.com/
[shippies]: https://appgrowthannual.com/shippies
[apple-app-review]: https://developer.apple.com/distribute/app-review/
[apple-guidelines]: https://developer.apple.com/app-store/review/guidelines/
[gp-publish]: https://support.google.com/googleplay/android-developer/answer/9859751
[gp-billing]: https://developer.android.com/google/play/billing
[sam-prepare]: https://developer.samsung.com/galaxy-store/prepare.html
[sam-faq]: https://developer.samsung.com/galaxy-store/faq.html
[jb-shipaton]: https://kotlinlang.org/lp/shipaton/
[replit-dev-urls]: https://docs.replit.com/core-concepts/project-editor/app-setup/development-urls
[layers-shipaton]: https://layers.com/shipaton/
[stripe-marketplace]: https://marketplace.stripe.com/apps/revenuecat
[yt-lawley]: https://www.youtube.com/@ChrisLawley
[yt-abbey]: https://www.youtube.com/@AbbeySharpRD
[yt-simone]: https://www.youtube.com/@SIMONESHARICE
[yt-heather]: https://www.youtube.com/@LeadershipHeather
[yt-lewis]: https://www.youtube.com/@LewisBlogsGaming
[dp-shipyard]: https://revenuecat-shipyard-2026.devpost.com/
[rc-sitemap]: https://www.revenuecat.com/sitemap-next.xml

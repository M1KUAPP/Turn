# Best practices for a new subscription app

What primary sources say about building, monetizing, getting approved,
growing, and pitching a new subscription app, framed for a Shipaton team with
nine days left before the September 30, 2026 deadline. All web sources were
accessed on September 21, 2026, and each claim cites the source that owns it;
RevenueCat's own Shipaton advice stays in the [research notes][repo-notes]
and the [brief][repo-brief].

Contents:

1.  [Apple App Store review](#apple-app-store-review)
1.  [Google Play review](#google-play-review)
1.  [Samsung Galaxy Store review](#samsung-galaxy-store-review)
1.  [Monetization and paywall benchmarks](#monetization-and-paywall-benchmarks)
1.  [Store listing and discoverability](#store-listing-and-discoverability)
1.  [Retention and push notifications](#retention-and-push-notifications)
1.  [Demo video and write-up](#demo-video-and-write-up)
1.  [Conflicts](#conflicts)
1.  [Gaps](#gaps)
1.  [Source index](#source-index)

## Apple App Store review

The App Review Guidelines quoted here are marked "Last Updated: June 8, 2026"
([apple-guidelines]).

### Apple review timing and expedited review

- As of September 21, 2026: "On average, 90% of submissions are reviewed in
  less than 24 hours." ([apple-review])
- "If your submission is incomplete, review times may be delayed or your
  submission may not pass." ([apple-review])
- "if your app is repeatedly rejected for the same guideline violation or
  you've attempted to manipulate the review process, review of your app will
  take longer to complete." ([apple-guidelines], After You Submit)
- The most common problem: "On average, over 40% of unresolved issues are
  related to guideline 2.1: App Completeness, which covers crashes,
  placeholder content, incomplete information, and more." ([apple-review])
- Expedited review: "You can request the review of your app to be expedited
  if you face extenuating circumstances, such as fixing a critical bug in your
  app or releasing your app to coincide with an event you're directly
  associated with." An event request must include "the event, date of the
  event, and your app's association with the event." ([apple-review])
- The guidelines add: "Please respect your fellow developers by seeking
  expedited review only when you truly need it. If we find you're abusing
  this system, we may reject your requests going forward."
  ([apple-guidelines])
- After approval: "it can take up to 24-hours for your app to appear on all
  selected storefronts" ([apple-guidelines]). "Processing for Distribution"
  means "Your app is processing and will be ready for distribution within 24
  hours"; "Pending Developer Release" means "Your app was accepted, but you
  still need to release it for distribution on the App Store."
  ([asc-statuses])
- The "Automatic" release setting means "The app goes live automatically
  after it is approved by App Review." ([asc-version-info])
- Build requirement "Since April 28, 2026": "Apps uploaded to App Store
  Connect must be built with Xcode 26 or later using an SDK for iOS 26, iPadOS
  26, tvOS 26, visionOS 26, or watchOS 26." ([apple-upcoming])
- While a submission is "Waiting for Review", you can't "Upload or edit
  screenshots or app previews" ([asc-statuses]). Synthesis: finalize them
  before you submit.

### App Review Guidelines for a subscription app

Quoted from the guidelines as of September 21, 2026 ([apple-guidelines]):

- **2.1(a) App Completeness:** submissions "should be final versions with all
  necessary metadata and fully functional URLs included"; "include demo
  account info (and turn on your back-end service!) if your app includes a
  login."
- **2.1(b):** "If you offer in-app purchases in your app, make sure they are
  complete, up-to-date, visible to the reviewer and functional."
- **2.3 Accurate Metadata:** "make sure all your app metadata, including
  privacy information, your app description, screenshots, and previews
  accurately reflect the app's core experience". Under 2.3.1(a), "All new
  features, functionality, and product changes must be described with
  specificity in the Notes for Review section of App Store Connect (generic
  descriptions will be rejected)".
- **2.3.2:** "make sure your app description, screenshots, and previews
  clearly indicate whether any featured items, levels, subscriptions, etc.
  require additional purchases."
- **2.3.3:** "Screenshots should show the app in use, and not merely the title
  art, login page, or splash screen."
- **2.3.7:** "App names must be limited to 30 characters." "Metadata such as
  app names, subtitles, screenshots, and previews should not include prices,
  terms, or descriptions that are not specific to the metadata type."
- **2.5.18, for apps with ads:** "Interstitial ads or ads that interrupt or
  block the user experience must clearly indicate that they are an ad", and
  "Apps that contain ads must also include the ability for users to report
  any inappropriate or age-inappropriate ads."
- **3.1.1 In-App Purchase:** "If you want to unlock features or functionality
  within your app, (by way of example: subscriptions, in-game currencies, game
  levels, access to premium content, or unlocking a full version), you must
  use in-app purchase." Also: "you should make sure you have a restore
  mechanism for any restorable in-app purchases."
- **3.1.2(a) Permissible uses:** "the subscription period must last at least
  seven days and be available across all of the user's devices." "Apps that
  attempt to scam users will be removed from the App Store."
- **3.1.2(c) Subscription Information:** "Before asking a customer to
  subscribe, you should clearly describe what the user will get for the
  price." "Ensure you clearly communicate the requirements described in
  Schedule 2 of the Apple Developer Program License Agreement."
- **3.2.2(x):** "Apps must not force users to rate the app, review the app,
  download other apps, or other store-related actions in order to access
  functionality, content, or use of the app."
- **4.2 Minimum Functionality:** "Your app should include features, content,
  and UI that elevate it beyond a repackaged website." "If your App doesn't
  provide some sort of lasting entertainment value or adequate utility, it may
  not be accepted."
- **4.3(b) Spam:** "Don't submit apps that are indistinguishable from what's
  already widely available." Dating, flashlight, sound effects, wallpaper,
  simple timers, and fortune telling apps are "well established on the App
  Store and we will not accept new submissions unless they offer a
  meaningfully different or improved experience."
- **4.5.4 Push Notifications:** see
  [Retention and push notifications](#retention-and-push-notifications).
- **4.8 Login Services:** apps that use "a third-party or social login
  service" for the primary account "must also offer as an equivalent option
  another login service with the following features": it "limits data
  collection to the user's name and email address", "allows users to keep
  their email address private", and "does not collect interactions with your
  app for advertising purposes without consent." It is not required if "Your
  app exclusively uses your company's own account setup and sign-in systems."
- **5.1.1(v) Account Sign-In:** "If your app doesn't include significant
  account-based features, let people use it without a login. If your app
  supports account creation, you must also offer account deletion within the
  app."
- **5.1.2(i) Data Use and Sharing:** "You must clearly disclose where personal
  data will be shared with third parties, including with third-party AI, and
  obtain explicit permission before doing so." "You must receive explicit
  permission from users via the App Tracking Transparency APIs to track their
  activity."

### Account deletion on the App Store

- "Offer to delete the entire account record, along with associated personal
  data. You may include additional options, but only offering to temporarily
  deactivate or disable an account is insufficient." ([apple-deletion])
- "Apps not operating in highly regulated industries should not require
  people to make a phone call, send an email, or go through other support
  flows." ([apple-deletion])
- Accounts the app creates for users count too: "Users should have the option
  to delete automatically generated accounts" ([apple-deletion]).
- Subscribers: "If the user has auto-renewable subscriptions, notify them that
  their billing will continue through Apple and request that they cancel
  their subscription before continuing." ([apple-deletion])
- "Apps that support Sign in with Apple should use the Sign in with Apple REST
  API to revoke user tokens." ([apple-deletion])

### United States links to web purchases

- Apple updated the guidelines "for compliance with a United States court
  decision regarding buttons, external links, and other calls to action in
  apps", affecting "Guidelines 3.1.1, 3.1.1(a), 3.1.3, and 3.1.3(a)"
  ([apple-us-news], May 1, 2025).
- 3.1.1(a), as of September 21, 2026: "These entitlements are not required for
  developers to include buttons, external links, or other calls to action in
  their United States storefront apps." ([apple-guidelines])
- Outside the entitlement storefronts: "In all other storefronts, except for
  the United States storefront, where this prohibition does not apply, apps
  and their metadata
  may not include buttons, external links, or other calls to action that
  direct customers to purchasing mechanisms other than in-app purchase."
  ([apple-guidelines], 3.1.1(a))
- 3.1.3: apps in that section "cannot, within the app, encourage users to use
  a purchasing method other than in-app purchase, except for apps on the
  United States storefront and as set forth in 3.1.1(a) and 3.1.3(a)."
  ([apple-guidelines])
- 3.1.3(b) Multiplatform Services: apps "may allow users to access content,
  subscriptions, or features they have acquired in your app on other
  platforms or your web site", "provided those items are also available as
  in-app purchases within the app." ([apple-guidelines])
- RevenueCat: "App-to-web purchases are currently available in some regions,
  depending on App Store and Play Store guidelines. They may also require
  registering for a specific App Store or Play Store program first."
  ([rc-web-button])

### First in-app purchase or subscription

1.  **Paid Apps Agreement.** "To sell your apps on the App Store or offer
    In-App Purchases, the Account Holder must sign the Paid Apps Agreement."
    "You won't be able to create a new app or In-App Purchase until you've
    agreed to the most recent version of the Paid Apps Agreement."
    ([asc-agreements]) The status "Pending User Info" means "You've signed an
    agreement, but it's not in effect because you haven't finished providing
    required information." ([asc-agreement-status])
2.  **Tax.** "In order to submit tax forms, you first need to sign the Paid
    Apps Agreement." "All developers must complete a US tax form to comply
    with the Paid Apps Agreement." "Once you submit this information, you
    won't be able to make any changes in App Store Connect." ([asc-tax])
3.  **Banking.** "in order to add banking information, you'll first need to
    sign a Paid Apps Agreement." "You must submit all required tax forms
    needed for your paid contract in order for us to process banking
    information." ([asc-bank])
4.  **Group and products.** "Possible durations are 1 week, 1 month, 2 months,
    3 months, 6 months, and 1 year." "creating a single group is the best
    practice for most apps" ([asc-offer-subs]). "The duration can't be
    changed after you submit for review." ([asc-sub-info])
5.  **Metadata.** Complete the fields in the table below; the localized fields
    are required "for at least one language" ([asc-iap-info]).
6.  **One draft submission.** "The first consumable, non-consumable,
    auto-renewable subscription, and non-renewing subscription In-App
    Purchase of each type must be submitted with a new app version." "If
    you're submitting a new subscription it must be submitted together with
    its subscription group." "The app version, subscription group, and every
    subscription or In-App Purchase you want reviewed together must all be
    added to the same draft submission before you click Submit for Review."
    ([asc-submit-iap])
7.  **All items pass together.** "All items submitted together must be
    Accepted to complete the submission." ([asc-submit-app]) An accepted
    purchase "won't be approved until all items in the submission are
    accepted." ([asc-iap-status])
8.  **Distribution.** "To distribute your app, your agreements must be in
    effect." ([asc-statuses])

| Field                 | Rule                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------ |
| Reference Name        | "can be as long as 64 characters"                                                    |
| Product ID            | "can be as long as 100 characters"; it "can't be reused for another In-App Purchase" |
| Review Notes          | "should not exceed 4000 characters"                                                  |
| App Review Screenshot | "used for review only and isn't displayed on the App Store"                          |
| Display Name          | "at least two characters and no more than 30 characters"                             |
| Description           | "no more than 45 characters"                                                         |

Source for the table: [asc-iap-info].

- RevenueCat: "When an app is launched for the first time or when new products
  are created for an existing app it can take 24 hours for purchases to work
  on the App Store" ([rc-rejections]).
- RevenueCat: "If the app has never been released on the App Store, it must
  be released before in-app purchases will work in production (even if you
  download with a code)." ([rc-launch-checklist])

### Sandbox testing on Apple

- Before testing, Apple lists: an active program account; "Your membership
  Account Holder has signed the Paid Applications Agreement"; product data
  with "At minimum, set up a product reference name, product ID, a localized
  name, and a price"; Sandbox Apple Accounts; and Developer Mode on test
  devices ([sk-sandbox]).
- "Apps that you download from TestFlight always run in the sandbox
  environment." ([sk-sandbox])
- "Changes you make to product metadata in App Store Connect can take up to
  one hour to appear in the sandbox environment." ([sk-sandbox])
- "The email address you use for a Sandbox account must not already be
  registered as an Apple Account." ([asc-sandbox-account])
- In TestFlight, "Each subscription is renewed daily, up to 6 times within a
  1-week period, regardless of the subscription's duration."
  ([asc-testflight-iap])
- Before products exist in App Store Connect, "you can test In-App Purchases
  with StoreKit Testing in Xcode, a local test environment that doesn't
  require a connection to App Store servers" ([asc-sandbox]).
- RevenueCat's Test Store "works immediately without platform setup", but:
  "Never submit an app to the App Store or Google Play that is configured
  with a Test Store API key." ([rc-test-store])
- RevenueCat: "Often times, purchases will work fine in Sandbox and
  Testflight, but App Store Review will not be able to fetch products. It's
  important to ensure that you are submitting your in-app purchases with your
  app for review." ([rc-rejections])

### Screenshots and app previews on Apple

"You can upload one to 10 screenshots in .jpeg, .jpg, and .png formats", and
"Images can't include alpha channels or transparencies." ([asc-screenshots])
Portrait sizes, as of September 21, 2026:

| Display     | Portrait sizes accepted               | Apple's requirement text                                                        |
| ----------- | ------------------------------------- | ------------------------------------------------------------------------------- |
| 6.9" iPhone | 1260 x 2736, 1290 x 2796, 1320 x 2868 | No requirement line; the 6.5" row refers to it                                  |
| 6.5" iPhone | 1284 x 2778, 1242 x 2688              | Required if app runs on iPhone and screenshots for 6.9" display aren't provided |
| 6.3" iPhone | 1179 x 2556, 1206 x 2622              | If absent, scaled screenshots for 6.5" displays are used                        |
| 13" iPad    | 2064 x 2752, 2048 x 2732              | Required if app runs on iPad                                                    |

Source for the table: [asc-screenshots].

- "If your app's user interface is the same across multiple device sizes and
  localizations, provide only the highest resolution screenshots required."
  ([asc-upload-media])
- App previews are optional, "up to three app previews per supported device
  size and language", and "processing may take up to 24 hours"
  ([asc-upload-media]). The specifications table lists a minimum length of
  "15 Seconds", a maximum length of "30 Seconds", and a maximum file size of
  "500MB" ([asc-preview-specs]).

### Privacy policy, privacy labels, and Terms of Use

- 5.1.1(i): "All apps must include a link to their privacy policy in the App
  Store Connect metadata field and within the app in an easily accessible
  manner." The policy must "Explain its data retention/deletion policies and
  describe how a user can revoke consent and/or request deletion of the
  user's data." ([apple-guidelines])
- "A link to user support with up-to-date contact information and a link to
  your privacy policy is required for all apps." ([apple-review])
- "if you're distributing your app on the App Store, you're required to
  explain your data handling practices in App Store Connect." "You must
  include information about your app's privacy practices and those of
  third-party partners whose code you integrate into your app."
  ([asc-app-privacy])
- Privacy label answers are "required to submit new apps and app updates",
  and "You may update your answers at any time, and you do not need to submit
  an app update in order to change your answers." ([apple-privacy-labels])
- RevenueCat: "If you are using RevenueCat, you must disclose that your app
  collects 'Purchases' information", selecting at least "Analytics" and "App
  Functionality" ([rc-app-privacy]).
- SDK manifests: "You'll need to include approved reasons for the listed APIs
  used by your app's code (including from third-party SDKs) to upload a new
  or updated app to App Store Connect." ([apple-upcoming])
- The sign-up screen must include "Subscription name and duration, and the
  content or services provided during the subscription period", "Full renewal
  price, shown clearly and prominently, and localized in available
  currencies", and "A way for current subscribers to sign in or restore
  purchases". "Please note that your app and App Store metadata must include
  links to your Terms of Use and Privacy Policy." ([apple-subscriptions])
- Schedule 2, section 3.8(b), requires disclosing the "Title of
  auto-renewing subscription", "Length of subscription", and "Price of
  subscription, and price per unit if appropriate", and "Links to Your
  Privacy Policy and Terms of Use must be accessible within Your Licensed
  Application." ([apple-dpla])
- "If you don't provide a custom EULA, the standard EULA is applied to your
  app and the license agreement link isn't shown on your App Store product
  page." ([asc-eula]) The standard EULA is published by Apple
  ([apple-std-eula]).

### Apple takeaways for the last nine days

- Synthesis: Apple is the realistic path this week. With 90% of submissions
  reviewed in under a day on average, a September 23 submission leaves room
  for one or two fix-and-resubmit cycles, if the first draft submission
  already bundles the app version, the subscription group, and every
  subscription.
- Synthesis: Finish the Paid Apps Agreement, tax forms, and banking today:
  sandbox tests need the signed agreement, and distribution needs agreements
  in effect.
- Synthesis: Choose "Automatic" release unless you will verify production
  purchases first; an app in "Pending Developer Release" is not live.
- Synthesis: If you offer Google or another social login, add an equivalent
  private login such as Sign in with Apple; an app that uses only its own
  account system does not need one under 4.8.
- Synthesis: Put the privacy policy and standard EULA links in the App
  Description and inside the app, and declare "Purchases" in the privacy
  label if you use RevenueCat.

## Google Play review

### Testing and production access for new personal accounts

- "Developers with personal accounts created after November 13, 2023, must
  run a closed test for their app with a minimum of 12 testers who have been
  opted in continuously for at least 14 days." ([gp-testing])
- "Testers who opt in, test for fewer than 14 days, and then opt out do not
  count toward the requirement." ([gp-testing])
- "Open testing becomes available after you gain production access."
  ([gp-testing])
- The application form has three sections, About your closed test, About
  your app/game, and About your production readiness, and "You must summarize
  your testing feedback when applying for production access." ([gp-testing])
- Review of the application: "Review usually takes seven days or less, but
  can occasionally take longer." More testing may be needed for "fewer than
  12 opted-in testers or insufficient tester engagement during the testing
  period." ([gp-testing])
- New personal accounts must "verify that they have access to a real Android
  mobile device using the Play Console mobile app before they can make their
  app available on Google Play", using "any non-rooted physical Android
  mobile device that runs at least the Android 10 operating system."
  ([gp-device])

### Google Play review times

- "For certain developer accounts, we'll take more time to thoroughly review
  your app to help better protect users. This may result in review times of
  up to seven days or longer in exceptional cases." ([gp-publish])
- "Processing can take a few hours or up to seven days (or longer in
  exceptional cases), as it depends on the review time that your app is
  subject to." ([gp-managed])
- "Managed publishing can also be useful for apps that are subject to
  extended review times, such as apps submitted by new developer accounts."
  ([gp-managed])
- "if you submit a change while there are changes in review, your app may be
  pushed to the back of the app review queue." ([gp-managed])
- "Items are not sent for review until you click Send for review." Approved
  changes "will be published automatically as soon as they're reviewed and
  approved by Google unless managed publishing is turned on." ([gp-managed])
- "You can't publish your app until errors have been resolved."
  ([gp-publish])

### Target API level for new apps

- As of September 21, 2026, "Starting August 31 2026": "New apps and app
  updates must target Android 16 (API level 36) or higher to be submitted to
  Google Play", with lower floors for Wear OS, Android Automotive OS, Android
  TV, and Android XR ([gp-target-api], updated September 16, 2026).
- "If you need more time to update your app, you'll be able to request an
  extension to November 1, 2026." ([gp-target-api])

### Subscriptions and payments policies

- "You must be transparent about your offer. This includes clearly and
  explicitly disclosing your offer terms, the cost of your subscription, the
  frequency of your billing cycle, the automatic renewal terms, whether a
  subscription is required to use the app, and any other material
  information about the subscription." ([gp-subscriptions])
- Listed violations include "Monthly subscriptions that do not inform users
  they will be automatically renewed and charged every month", "Annual
  subscriptions that most prominently display their pricing in terms of
  monthly cost", and "Multiple screens in the purchase flow that lead users
  into accidentally clicking the subscribe button." ([gp-subscriptions])
- Trials: "Be sure to let your users know how and when a free trial will
  convert to a paid subscription, how much the paid subscription will cost,
  and how a user can cancel if they do not want to convert to a paid
  subscription." ([gp-subscriptions])
- Trial violations include "Offers that do not clearly explain how long the
  free trial or introductory pricing will last" and "Offer pricing and terms
  that are incompletely localized." ([gp-subscriptions])
- Management: "You must also include in your app access to an easy-to-use,
  online method to cancel the subscription", such as "A link to Google Play's
  Subscription Center" ([gp-subscriptions]).
- Payments: in-app purchases "must use Google Play's billing system for those
  transactions unless Section 3, 8, or 9 applies", and "In-app pricing must
  match the pricing displayed in the user-facing Play billing interface."
  ([gp-payments])
- US link-outs on Play: the external content links program lets apps "link
  users in the United States to external content, including to purchase
  in-app digital items", but developers must "successfully complete their
  enrollment in this program prior to using external content links." "Per
  the July 22, 2026 update, developers enrolled in this program must report
  transactions and pay the relevant Play service fee, starting October 1,
  2026." ([gp-us-links])

### App content, data safety, and account deletion

- The App content page covers the privacy policy, ads, sign-in details,
  target audience, and more. "You must declare whether or not your app
  contains ads." If the app is restricted by login, "you must provide all
  required details to enable access to your app." ([gp-app-content])
- "Even developers with apps that do not offer any health features must
  complete this form and certify that no health features are offered through
  the app." ([gp-health])
- Data safety: "All developers must declare how they collect and handle user
  data", including "data collected and handled through any third-party
  libraries or SDKs". The form is required for "apps on closed, open, or
  production testing tracks", and "Even developers with apps that do not
  collect any user data must complete this form and provide a link to their
  privacy policy." ([gp-data-safety])
- RevenueCat: answer "Yes" to collecting data because "RevenueCat collects a
  customer's purchase history", and declare Financial Info ([rc-data-safety]).
- Deletion: "If your app enables account creation, you must: provide users
  with an in-app path to delete their app accounts and associated data; and
  provide a web link resource where users can request app account deletion
  and associated data deletion." ([gp-deletion])
- "If your app offers account creation in any part of the app experience,
  then you still need to offer app account deletion even if some features can
  be accessed without an account." ([gp-deletion])

### License testing on Google Play

- "Your own publishing account is always considered a licensed tester."
  Testing needs an app "published to the open, closed, internal test, or
  production track", and "Before they can be tested, your one-time products
  and subscriptions need to be published." ([gp-license])
- "Users incur actual charges for their test track purchases unless the user
  is a license tester." ([gp-billing-test], updated September 9, 2026)
- "For purchases from license testers, a purchase will be refunded after 3
  minutes if your app does not acknowledge the purchase" ([gp-billing-test]).
- Test renewals, which "can renew a maximum of six times": 1 week and 1 month
  renew in "5 minutes", 3 months in "10 minutes", 6 months in "15 minutes",
  1 year in "30 minutes", and a free trial lasts "3 minutes"
  ([gp-billing-test]).

### Google Play takeaways for the last nine days

- Synthesis: A personal account created after November 13, 2023 without
  production access cannot publish by September 30. A closed test starting
  today reaches 14 days on October 5, and the production-access review
  "usually takes seven days or less" after that.
- Synthesis: An account that already has production access still faces
  reviews of "up to seven days or longer" for some developers. Submit once,
  avoid stacking changes, and target API level 36.
- Synthesis: Complete every App content declaration before sending for
  review, and make purchase-testing closed testers license testers so they
  aren't charged.

## Samsung Galaxy Store review

### Galaxy seller registration

- The steps: "Sign up for a Samsung account", "Register with Seller Portal",
  and "Apply for commercial seller status." "If you want to distribute free or
  paid apps in Galaxy Store, you must have commercial seller status."
  ([ss-prepare])
- For commercial status, "the email address should use a private or company
  domain name, not a public domain (for example, don't use a gmail or yahoo
  email account)" ([ss-prepare]).
- "If you cannot get a D-U-N-S number, get a DBA (Doing Business As) or other
  documentation your country uses." ([ss-prepare])
- Private sellers can apply with "A copy of identification card in English",
  and "It takes about 4 business days to review a request for a status change
  to a Commercial Seller." ([ss-private-seller]) For corporate sellers, a
  D-U-N-S number can "shorten the time required for review."
  ([ss-corporate-seller])
- Samsung's FAQ: "It can take several days to be approved for commercial
  seller status. It can take up to 10 business days to verify your D-U-N-S
  number and it can take up to 10 business days to verify your international
  bank account." ([ss-faq])
- "No, there is no sign-up nor annual fee to publish in Galaxy Store."
  ([ss-faq])
- RevenueCat's guide asks for "A D-U-N-S Number, required to request
  Commercial Seller Status", and says: "Email your seller email address to
  the Galaxy Store Onboarding team at rc.onboard@samsung.com so the approval
  process can be expedited." ([rc-galaxy-onboarding])

### Galaxy review process and requirements

- "The Galaxy Store review process consists of two phases: Pre-Review and
  Device Test." "The sale of the app begins once the Pre-Review phase is
  completed." In Device Test, "If errors are found during this phase, the
  sale of the app may be suspended" ([ss-review-process]).
- "Temporary login ID, password, and fake card number are required for apps
  that need testing such as login and payment." Review notes go in "English,
  Chinese, and/or Korean." ([ss-request-review])
- Distribution guide rules, as of September 21, 2026 ([ss-distribution]):
  - 1.1.4: "Trial or beta version binaries must not be submitted."
  - 1.1.5: login apps must provide test "login info (such as user ID and
    password)".
  - 1.3.4: "If an app provides in-app item purchases or advertisements, this
    must be accurately shown and described" in images and descriptions.
  - 1.3.7: "Metadata must not promote other app stores, or mobile platforms."
  - 3.1.2: apps that handle user data "must display a user data privacy
    policy in their apps and provide the URL of the policy during app
    registration in Seller Portal."
- "Galaxy Store requires a target API level >=33 and at least one 64-bit
  binary to be registered." For apps using Samsung In-App Purchase, "it is
  recommended that each game or app have a different package name in Galaxy
  Store if the same content is or will be available in Google Play."
  ([ss-faq])
- Required listing metadata per RevenueCat's guide is listed under
  [Galaxy Store listing fields](#galaxy-store-listing-fields).

### Galaxy in-app purchases and RevenueCat support

- "In order to sell in-app paid contents, you first need to switch to a
  Commercial Seller." "IAP menu will be activated after the apk synced with
  Samsung In-App Purchase SDK is registered." ([ss-iap-register])
- "Samsung In-App Purchase (IAP) is recommended to sell in-app products (such
  as items and subscriptions) for your safety and convenience."
  ([ss-distribution]) "Samsung has always supported third-party payment
  systems, and we will continue to do so." ([ss-faq])
- Revenue share for Samsung Checkout, as of September 21, 2026: "80% of the
  net sales proceeds", and "For subscription services, the revenue share for
  developers and publishers is 85%." ([ss-faq])
- RevenueCat, as of September 21, 2026: "Galaxy Store support is available in
  Android SDK versions 10.7.0 and above, and React Native SDK versions 10.3.0
  and above. Support for other hybrid SDKs is coming soon."
  ([rc-android-install])
- Testing: "Galaxy Store test purchases require a physical Galaxy device
  signed in with a Samsung account. The Galaxy Store does not support test
  purchases in emulators." "Only use GalaxyBillingMode.PRODUCTION when
  submitting your app for beta or production distribution."
  ([rc-android-install])
- New subscriptions start "in an inactive state. Select the item and click
  Activate." Data safety: "Because Samsung In-App Purchase is enabled, select
  Device or other IDs in the Data Collected section." A "Closed Beta" is the
  beta type that "supports in-app purchases" ([rc-galaxy-onboarding]).
- "Licensed testers, configured in your Seller Portal profile, are not
  charged for in-app items purchased during the beta test." ([ss-launch])

### Galaxy Store takeaways for the last nine days

- Synthesis: Galaxy works this week only if commercial status clears in about
  4 business days and Pre-Review is quick; no Samsung page promises either.
  Apply today, email the onboarding address RevenueCat gives, and keep a
  physical Galaxy device for test purchases.
- Synthesis: Only native Android or React Native apps can use RevenueCat on
  the Galaxy Store today; Flutter, Kotlin Multiplatform, Capacitor, and Unity
  teams should plan on another store.

## Monetization and paywall benchmarks

### State of Subscription Apps 2026 definitions

- The newest edition, as of September 21, 2026, is State of Subscription Apps
  2026, built on "over 115,000 apps, representing more than $16 billion in
  revenue"; "the target time frame for metrics in this report is 2025"
  ([sosa-2026]). RevenueCat's summary was published March 19, 2026 and last
  updated April 22, 2026 ([sosa-blog]).
- Definitions quoted from the report ([sosa-2026]):
  - Download-to-paid (D35): "the share of installs that result in at least
    one paid subscription within 35 days of the install date."
  - Download-to-trial: "the share of installs that start a free trial within
    30 days of the download date", calculated "for apps that use a
    trial-based acquisition strategy."
  - Trial-to-paid: "the share of free trial starts that convert into a paid
    subscription."
  - Revenue per install (RPI): "total revenue earned divided by total
    installs."
  - Retention: "the share of paid subscriptions that remain active after a
    given time period".
  - Access method: "how users primarily access the app (freemium, via a hard
    paywall)."
  - Pricepoint: "how an app's average pricepoint compares to the rest of the
    measured apps (below average, average, above average)."

### Conversion and revenue benchmarks

Medians from [sosa-2026], as of September 21, 2026:

| Metric                                 | Figure as quoted                                         |
| -------------------------------------- | -------------------------------------------------------- |
| D35 download-to-paid, hard paywall     | "Hard paywall median: 10.7% (top quartile above 20.0%)"  |
| D35 download-to-paid, freemium         | "Freemium median: 2.1% (top quartile above 4.5%)"        |
| D35 download-to-paid, all geographies  | "Globally, median lands at 2.0%"                         |
| D35 download-to-paid, North America    | "North America median: 2.8% (top quartile above 6.0%)"   |
| D35 download-to-paid, high price       | "High-priced median: 2.8% (top quartile above 6.1%)"     |
| D35 download-to-paid, low price        | "Low-priced median: 1.4% (top quartile above 3.7%)"      |
| Download-to-trial, North America       | "North America median: 7.1% (top quartile above 15.0%)"  |
| Trial-to-paid, North America           | "North America median: 34.2% (top quartile above 47.9%)" |
| RPI at day 14 and day 60, hard paywall | "median of $2.32"; "$3.09 median"                        |
| RPI at day 14 and day 60, freemium     | "$0.27"; "$0.38"                                         |
| Year-1 retention, yearly plans         | "freemium yearly at 28% vs. hard paywall at 27% median"  |
| Year-1 retention, monthly plans        | "Monthly: 8% (freemium) vs. 9% (hard paywall)"           |

- The report's summary: "Apps that ask for money upfront convert 5x better
  than freemium (10.7% vs. 2.1%). But the advantage disappears over the long
  run: after one year, retention for both models is nearly identical."
  ([sosa-2026])
- New-app outcomes: "If you're at ~$72/mo, you're at the overall median 1
  year post-launch." "All Categories median: 58 days to $1K, 109 days to
  $10K." "All Categories: 17.3% hit $1K, 4.6% hit $10K." ([sosa-2026])

### Trial length and purchase timing

- Trial-to-paid by trial length: "17–32 day trials median: 42.5%", "5–9 day
  trials median: 37.4%", and "≤4 day trials median: 25.5%" ([sosa-2026]).
- Trial lengths in use: "Current year: 46.5% use ≤4 days, 39.9% use 5–9
  days." "Longest trials (17–32 days) declined slightly from 6.1% to 5.0%."
  ([sosa-2026])
- Trial starts: "Nearly all trial starts happen on Day 0 across categories —
  users who don't try immediately rarely try at all." "After Day 3, trial
  starts drop below 5% in all categories." ([sosa-2026])
- Trial cancellations: "3-day trials: 55.4% cancel on Day 0" and "7-day
  trials: 39.8% cancel on Day 0"; "84% of 3-day trial cancellations and 64%
  of 7-day trial cancellations occur between Day 0 and Day 1." ([sosa-2026])
- Time to purchase: "1/3 of all conversions happen on day zero for both
  methods", "60%+ of conversions happen within 1 week", and "For freemium
  apps, 23% of conversions do not occur until 6+ weeks after download." The
  "Hard paywall Day 4-7 spike (25.7%) is driven by 7-day trial expirations."
  ([sosa-2026])
- Annual plans: "the first month accounts for 35% of all annual
  cancellations" ([sosa-blog]).

### Prices and plan mix

- Price points year over year ([sosa-2026]):
  - Weekly: "Most common at $5, median $5–$5.90, top percentile at $10
    (unchanged YoY)."
  - Monthly: "Most common at $10, median risen from $7 to $8, top performers
    went up from $20 to $22.70."
  - Yearly: "Most common at $30, median up from $31.60 to $34.80, the top
    dropped from $92 to $90."
- "Across geographies, the dominant architecture remains $4.99–$6.99 weekly,
  $7.99–$9.99 monthly, and $29.99–$39.99 yearly." ([sosa-2026])
- Plan mix: "overall market: 42% monthly, 34% yearly", and "North America
  balances monthly/yearly at 36%/40%." A contributor notes annual plans fell
  from "41.4% of all subscription durations" last year to "only 33.6%"
  ([sosa-2026]).
- RPI by an app's most-sold plan: "Yearly-dominant apps: D14: $0.36, D60:
  $0.46." "Monthly-dominant apps: D14: $0.18, D60: $0.29." "Weekly-dominant
  apps: D14: $0.19, D60: $0.32." ([sosa-2026])

### Paywall design and offers in the report

- "Two-plan paywalls dominate (41–60% across categories)". "Highlighted
  pricing: 74.5% median" and "Free trial messaging: 54.0% median."
  ([sosa-2026])
- "'Continue' dominates CTA buttons; 'Subscribe' and 'Start Free Trial'
  follow", and "'Cancel Anytime' appears prominently alongside primary CTAs"
  ([sosa-2026]).
- "Overall offer usage: 9.3% of apps." The "median intro discount is -50.1%".
  ([sosa-2026])

### RevenueCat docs on paywalls, offerings, and experiments

- Offerings "are the selection of products that are 'offered' to a user on
  your paywall. Using RevenueCat Offerings is optional, but enable features
  like Paywalls, Experiments, and Targeting." "We strongly recommend
  utilizing the current Offering feature." "Note that the offering identifier
  cannot be changed later". ([rc-offerings])
- Hard paywalls suit apps with "high unit economics (e.g., AI-driven features
  with significant per-user costs)". RevenueCat recommends "a single-tier
  access level or entitlement that grants access to all features", and says
  to "Ensure that the user has sufficient context about what your app offers
  before displaying the paywall" and "Make sure the restore purchase option is
  provided to the user." ([rc-hard-paywall])
- Freemium: "you should not block the user from accessing free content.
  Instead, use paywalls as contextual prompts that users can dismiss."
  ([rc-freemium])
- Placements: "At the end of onboarding (e.g. onboarding_end)", "When a
  customer attempts to use a paywalled feature (e.g. feature_gate)", and
  "When a sale is running (e.g. sale_offer)". ([rc-placements])
- "RevenueCat Paywalls let you remotely configure your entire paywall view
  without any code changes or app updates." ([rc-paywalls])
- Review-safe paywalls: show "the full billed amount", make the
  "introductory offer" clear, mention cancellation ("Try free for x days,
  then $y/mo. Cancel anytime."), and link terms and privacy
  ([rc-paywall-review]).
- Experiments test "2-4 variants"; "Experiments is available to Pro &
  Enterprise customers"; "Test only one variable at a time"
  ([rc-experiments]).
- RevenueCat's blog quotes Jake Mor, co-founder of Superwall: "Usually, the
  winning combination on every app is on every app open, before using any
  locked feature, both before and after onboarding" ([rc-placement-blog]).
- Michal Parizek of Mojo, writing on RevenueCat's blog: "At Mojo, onboarding
  accounts for about 50% of trial starts", and "Every app should offer a
  straightforward upgrade path." ([rc-paywall-guide])
- Apple suggests "Offer a freemium app experience" and "Offer a metered
  paywall", and: "In the purchase flow, the amount that will be billed must be
  the most prominent pricing element in the layout." ([apple-subscriptions])

### Codes that let judges unlock premium

- Apple offer codes come as "One-time-use codes" and "Custom codes";
  "Customers are limited to redeeming one code per offer." In-app redemption
  works "if they're using a device running iOS 14, iPadOS 14, or macOS 15, or
  later and your app supports the appropriate StoreKit method."
  ([asc-offer-codes])
- Google Play: "Subscription promo codes provide users with a free trial of
  between 3 and 90 days." Custom codes "can only be redeemed by users who
  have not previously subscribed", and "you need to integrate In-app
  Promotions in your app." ([gp-promo])
- RevenueCat: an unreleased app's purchases don't work in production "even if
  you download with a code" ([rc-launch-checklist]).

### Monetization takeaways for the last nine days

- Synthesis: The report favors a hard paywall for fast revenue (10.7% versus
  2.1% D35 download-to-paid; $2.32 versus $0.27 day-14 RPI) at equal year-one
  retention. The brief says revenue feeds the Grand Prize shortlist
  ([repo-brief]), and a hard or onboarding paywall gets money in before
  September 30.
- Synthesis: Trial length is a timing trade-off. Longer trials convert
  better, but a 7-day trial started after September 23 ends after the
  deadline; a 3-day trial or a paid intro offer converts sooner.
- Synthesis: Use the common anchors the report cites and a two-plan paywall
  with the billed amount most prominent.
- Synthesis: Skip A/B tests; nine days of launch traffic is small, and
  Experiments needs a Pro or Enterprise plan. Placements and remote paywalls
  still let you change offers without an app update.
- Synthesis: Create offer or promo codes for judges once the app is live.

## Store listing and discoverability

### Apple product page fields

| Field            | Limit or rule, quoted                                                                            | Source             |
| ---------------- | ------------------------------------------------------------------------------------------------ | ------------------ |
| Name             | "at least two characters and no more than 30 characters"                                         | [asc-app-info]     |
| Subtitle         | "can't be longer than 30 characters"                                                             | [asc-app-info]     |
| Promotional text | "can't be longer than 170 characters"; changes go live "without requiring an updated submission" | [asc-version-info] |
| Description      | "Limited to 4000 characters"; "HTML format isn't supported"                                      | [asc-version-info] |
| Keywords         | "up to 100 bytes"; each keyword "greater than two characters"                                    | [asc-version-info] |
| Screenshots      | "one to 10"                                                                                      | [asc-screenshots]  |
| App previews     | "up to three app previews for each localization, per device size"                                | [asc-version-info] |
| Support URL      | "must lead to actual contact information"                                                        | [asc-version-info] |
| What's New       | "isn't available for the first version of the app"                                               | [asc-version-info] |
| Privacy policy   | "Required for iOS and macOS apps"                                                                | [asc-app-info]     |

Apple's product page advice ([apple-product-page]):

- "The first sentence of your description is the most important — this is
  what users can read without having to tap to read more." "Also avoid
  including specific prices in your app description."
- Subtitle: "Avoid generic descriptions such as 'world's best app.'"
- Screenshots: "the first one to three images will appear in search results
  when no app preview is available".
- Keywords: "Keywords are limited to 100 characters total, with terms
  separated by commas and no spaces." Avoid "Plurals of words that you've
  already included in singular form", "Duplicate words", and "Competing app
  names"; "Improper use of keywords is a common reason for App Store
  rejections."
- "promotional text doesn't affect your app's search ranking"; use it "to
  share the latest news about your app, such as limited-time sales or
  upcoming features."
- Previews "autoplay with muted audio", so "make sure the first few seconds of
  your video are visually compelling."
- Ratings: "You can prompt for ratings up to three times in a 365-day
  period."

### Custom product pages, tests, and in-app events

- You can submit "in-app events, custom product pages, and product page
  optimization tests without needing a new app version." ([apple-review])
- Custom product pages: "Create up to 70 custom product pages per app".
  "You can create a custom product page if your app has the Ready for
  Distribution status in at least one country or region." Pages "must be
  approved before they are visible to users", and metrics appear "after a
  custom product page receives at least five first-time downloads."
  ([asc-cpp])
- Apple's figure: "Developers see a 2.5 percentage point increase on average
  when referring people to a custom product page. This is a 156% increase
  compared to the 1.6% average conversion rate on default product pages."
  ([apple-cpp])
- Product page optimization tests "up to three different app icons,
  screenshots, and previews", and "Your app must be in the Ready for
  Distribution state to test its product page." ([asc-ppo])
- In-app events: name "up to 30 characters", short description "up to 50
  characters", long description "up to 120 characters"; "The end date can be
  a maximum of 31 days from the start date"; the publish date "can be a
  maximum of 14 days in advance of the start date"; "You can publish up to 10
  In-App Events on the App Store and Apple Games at a time." ([asc-events])
- "Good candidates for In-App Events are challenges, competitions, or special
  content launches." ([apple-events]) Under guideline 2.3.13, "Events must
  happen at the times and dates you select in App Store Connect"
  ([apple-guidelines]).

### Google Play listing fields

| Field             | Limit or rule, quoted                                                                                              | Source        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ | ------------- |
| App name          | "30 character limit"                                                                                               | [gp-listing]  |
| Short description | "80 character limit"                                                                                               | [gp-listing]  |
| Full description  | "4000 character limit"                                                                                             | [gp-listing]  |
| App icon          | "Dimensions: 512px by 512px"; "Maximum file size: 1024KB"                                                          | [gp-graphics] |
| Feature graphic   | "Dimensions: 1024px by 500px"; "You must provide a feature graphic to publish your store listing."                 | [gp-graphics] |
| Screenshots       | "a minimum of two screenshots across different device types"; "up to 8 screenshots for each supported device type" | [gp-graphics] |
| Screenshot size   | "Minimum dimension: 320px"; "Maximum dimension: 3840px"                                                            | [gp-graphics] |
| Recommended       | "at least four screenshots with minimum 1080px resolution"                                                         | [gp-graphics] |
| Preview video     | one YouTube URL, set to "public or unlisted", with ads disabled                                                    | [gp-graphics] |
| Contact email     | "A contact email address is required"                                                                              | [gp-listing]  |

- "Character limits apply to both full-width and half-width characters"
  ([gp-listing]).
- For the video: "Show the actual in-app or in-game experience, focusing on
  the core features and content as early as possible within the first 10
  seconds of the video." It "may autoplay inline with muted audio up to 30
  seconds" ([gp-graphics]).
- Screenshot alt text: "Use context to identify the important part of the
  image, using 140 characters or less." ([gp-graphics])

### Google Play listing practices and experiments

- "Keep your app's description succinct and straightforward. Users may only
  read the first few sentences." "Don't repeat your short description in your
  full description." ([gp-listing-bp])
- "Your store listing shouldn't include text that indicates store performance
  or ranking", and "your images and text should not indicate the price and
  promotional information, such as '10% off,' '$50 cash back,' 'free for a
  limited time only,'" ([gp-listing-bp]).
- Titles: "Words like 'Free' and 'No Ads' promote deals and don't belong in
  app titles or developer names." ([gp-listing-bp])
- "We also don't allow unattributed or anonymous user testimonials in the
  app's description." "Don't use emojis, emoticons, or repeated special
  characters in these metadata elements." ([gp-metadata])
- Experiments: "For published apps, you can test variants against your
  current version". "For each app, you can run one default graphics
  experiment or up to five localized experiments at the same time", with "up
  to 2 variants", and "We recommend testing changes to one asset at a time"
  ([gp-experiments]).

### Galaxy Store listing fields

- RevenueCat lists the required Galaxy metadata: "App title", "Description",
  "Short description", "Icon (512x512) for Android", "Screenshots (2:1 image
  ratio, minimum 4, maximum 8 images)", "Category (only 'General' is
  required)", "Age restriction", "Supported languages", and "Support email"
  ([rc-galaxy-onboarding]).
- Samsung: "If app registration specifies two or more publication countries,
  app metadata must support English as the default language."
  ([ss-distribution], 1.3.2)
- Galaxy Store editorials run in "the Discover tab of Galaxy Store (available
  to Galaxy Store users in the U.S. and South Korea only)"; request one with
  "the App Promotion tab in Seller Portal" ([ss-faq]).

### Listing takeaways for the last nine days

- Synthesis: Spend Apple's name, subtitle, and keyword field on distinct
  terms; Apple says the app "is searchable by app name and company name, so
  you shouldn't duplicate these values in the keyword list"
  ([asc-version-info]).
- Synthesis: Use Apple's promotional text, which changes without review, for
  launch-week news. On Google Play, keep prices and promotions out of the
  listing text and graphics.
- Synthesis: Custom product pages and product page tests need a live app and
  traffic; a custom page per launch channel is more useful this week than a
  test.
- Synthesis: Cut store previews from the demo video: 15 to 30 seconds for
  Apple, and the app on screen within 10 seconds for Google Play.

## Retention and push notifications

### Apple and Android rules for notifications

- 4.5.4: "Push Notifications must not be required for the app to function",
  and they "should not be used for promotions or direct marketing purposes
  unless customers have explicitly opted in to receive them via consent
  language displayed in your app's UI, and you provide a method in your app
  for a user to opt out from receiving such messages." ([apple-guidelines])
- 4.5.3: "Do not use Apple Services to spam, phish, or send unsolicited
  messages to customers, including Game Center, Push Notifications, Live
  Activities, etc." ([apple-guidelines])
- 5.1.2(i): "Your app may not require users to enable system functionalities
  (e.g. push notifications, location services, tracking) in order to access
  functionality, content, use the app, or receive monetary or other
  compensation" ([apple-guidelines]).
- Apple's Human Interface Guidelines: "Don't use notifications to send
  marketing or promotional content unless people explicitly agree to receive
  such information." "Never use the Time Sensitive interruption level to send
  a marketing notification." "Create an alert, modal view, or other interface
  that describes the types of information you want to send and gives people a
  clear way to opt in or out." "you must also provide an in-app settings
  screen that lets people change their choice." ([apple-hig-notifications])
- Android: "Android 13 (API level 33) and higher supports a runtime permission
  for sending non-exempt (including Foreground Services (FGS)) notifications
  from an app". "Before you ask users to grant any permissions, let them
  familiarize themselves with your app." "you might wait until the third or
  fourth time the user launches your app." ([android-notif-permission])

### OneSignal permission prompts

- "The system prompt can only be shown a limited number of times: once on iOS
  and twice on Android (Google and Huawei)." ([os-prompt])
- "Ask after a value moment." "Prompting on first launch, before the user
  understands what your app does, is the single biggest cause of low opt-in
  rates." ([os-prompt])
- iOS provisional notifications "deliver quietly to the Notification Center
  without any prompt" and "should be your default starting point."
  ([os-prompt])
- "Dismissing a soft prompt does not consume a system prompt attempt, so you
  can re-ask users who were not ready." The example re-shows it with "max per
  user 20 and a gap between views of 2 weeks" ([os-prompt]).

### OneSignal re-engagement journeys

- OneSignal's playbook has five lifecycle journeys: "welcome, trial-to-paid
  conversion, event-driven, retention, and win-back." Build order starts with
  "Welcome Journey (Case 1) first — highest leverage on long-term retention,
  requires no Custom Events." ([os-journeys])
- Trial-to-paid: "Time pressure beats discount." "Exit on conversion,
  immediately." It "requires a trial_end_date Tag in both cases."
  ([os-journeys])
- Cadence: "A common starting point is one message per day for the first 3
  days, then drop to every 2–3 days." ([os-journeys]) During a trial: "At most
  one push per day during the trial window, plus in-app messages."
  ([os-mobile-first])
- Win-back: "Lead with value, not discount." "Run win-back for 60 days
  post-cancellation" ([os-journeys]).
- RevenueCat integration: "This integration updates Tags in OneSignal
  automatically with their latest user info." "Setting the External ID in
  OneSignal is required for a stable identifier." Pass the ID with
  "setOneSignalUserID() (recommended)" ([os-revenuecat]).

### Billing retries and grace periods

- SOSA 2026: "Nearly a third of all subscription cancellations on Google Play
  are involuntary billing failures — more than double the rate on the App
  Store (14%)." ([sosa-2026])
- Apple: "To prevent service interruptions due to billing issues, enable
  Billing Grace Period in App Store Connect." ([apple-subscriptions])

### Retention takeaways for the last nine days

- Synthesis: Ask for push after the first value moment; on iOS, provisional
  notifications avoid spending the one-time system prompt.
- Synthesis: Treat discount or win-back pushes as marketing under 4.5.4: get
  explicit in-app opt-in, add an in-app opt-out setting, and never mark them
  Time Sensitive.
- Synthesis: Ship a welcome journey and a trial-ending reminder first; both
  run on built-in data plus a trial_end_date tag, and the RevenueCat
  integration keeps subscription tags current.

## Demo video and write-up

### Devpost guidance on demo videos

- "Use an emulator or create a screencast. Snazzy marketing videos are great
  for promotional purposes, but they don't help others understand and
  evaluate your app." ([dp-video-tips])
- "Be sure to explain what your app does (and if making the video for a
  specific hackathon, how it addresses the hackathon) in the first few
  seconds of your video." ([dp-video-tips])
- "uploading your video could take anywhere from a few minutes to several
  hours or more." Also: "Edit" and "Write out a script of what you'll
  say/show in your video, rehearse it before recording" ([dp-video-tips]).
- Visibility: "enable the appropriate privacy settings in order for your
  demo video to be publicly visible"; other hosts trigger "Must be a valid
  YouTube, Vimeo, or Youku url." ([dp-video-upload])
- Devpost's blog: "judges will likely review multiple projects back to back,
  so make sure to start your video with a quick overview." "Make sure it's a
  demo! Show your project or app in action and include more information in
  your text description if needed." "Check the privacy settings of your
  video—if it's private, the judges won't be able to access it!"
  ([dp-demo-blog])
- A participant tip in the same post: "Be sure to mark your video as 'Not for
  Kids' on YouTube so that it is not inaccessible to judges" ([dp-demo-blog]).

### Devpost guidance on the write-up

- The form asks for a "Project name", a "Project tagline", and a "Thumbnail
  image" ("For best results, use a 3:2 ratio"); the project story "will
  prompt you with headings that make for a strong description"; "Built with"
  tags allow "25 maximum" ([dp-submission-steps]).
- "You'll be able to continue editing it until the deadline"
  ([dp-submission-steps]).
- Judges on Devpost's blog: "Presentation and storytelling matters and it can
  be a huge part of your success." "A project that really stands out is one
  that was clearly considering the judging criteria." "sometimes you have a
  really nice video and a really lacking text description, and I think it's
  important to have all of those things complementing one another."
  ([dp-judges-blog])
- Checks before submitting: "Are there length limitations to your demo video?
  Is your demo video public?" "you'd be surprised how many submissions are
  disqualified simply because they didn't meet the baseline criteria!"
  ([dp-criteria-blog])

### How Devpost advice maps to Shipaton judging

| Devpost says                                               | Shipaton rule                                                       | Synthesis                                          |
| ---------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------- |
| Pitch "in the first few seconds" ([dp-video-tips])         | Prescreeners watch the first 2 minutes ([repo-brief])               | State the problem and the app within 15 seconds    |
| "Use an emulator or create a screencast" ([dp-video-tips]) | Show the app running on its device ([repo-brief])                   | Record a real device, as Shipaton asks             |
| About "three minutes" is typical ([dp-demo-blog])          | Judges need not watch past two minutes ([repo-brief])               | Finish the purchase or ad flow before 2:00         |
| Video must be publicly visible ([dp-video-upload])         | Unlisted YouTube is fine; private is not ([repo-brief])             | Use unlisted or public, and mark it not for kids   |
| Default story headings ([dp-submission-steps])             | Problem, audience, money, difference, and categories ([repo-brief]) | Write to Shipaton's list, not the default headings |
| Put extra detail in the text ([dp-demo-blog])              | Judges read the whole description ([repo-brief])                    | Move numbers and setup details into the write-up   |

### Pitch takeaways for the last nine days

- Synthesis: Upload the final video by September 28; Devpost warns processing
  can take "several hours or more", and you can keep editing the entry until
  the deadline.
- Synthesis: Reuse the device recording three ways: the Devpost demo, a 15 to
  30 second Apple preview, and a Google Play preview video.

## Conflicts

### Conflicts with the repo's notes

- **Review speed.** The repo quotes the Shipaton FAQ: "App review usually
  takes a few business days, assuming your app is not rejected."
  ([repo-notes]) Apple: "On average, 90% of submissions are reviewed in less
  than 24 hours." ([apple-review]) Synthesis: Apple's figure is an average,
  so the FAQ's one-week buffer is still prudent.
- **Expedited review.** Repo: "RevenueCat's official guidance is not to use
  expedited review for this." ([repo-notes]) Apple lists "releasing your app
  to coincide with an event you're directly associated with" as a valid
  reason ([apple-review]) but asks developers to use it "only when you truly
  need it" ([apple-guidelines]).
- **Sign in with Apple.** Repo: "If your app uses Google or other third-party
  authentication, make sure you've also included Sign in with Apple, as that
  is a requirement" ([repo-notes]). Guideline 4.8 requires "another login
  service with the following features" and names no service
  ([apple-guidelines]).
- **Demo footage.** Repo: "Show the app running on its device"
  ([repo-brief]). Devpost: "Use an emulator or create a screencast."
  ([dp-video-tips])
- **Video length.** Repo: "judges are not required to watch beyond two
  minutes" ([repo-brief]). Devpost's blog: "showcase all the cool things your
  project can do—in around three minutes" ([dp-demo-blog]).
- **Video visibility.** Repo: "unlisted YouTube videos are fine and private
  ones are not" ([repo-brief]). Devpost: "Your video must be hosted publicly
  on YouTube, or Vimeo to properly embed for the judges."
  ([dp-submission-steps])
- **Screenshot size.** Repo: "At least one 1179 × 2556 screenshot without a
  device frame" ([repo-brief]). Apple files 1179 x 2556 under the 6.3-inch
  display, which falls back to scaled 6.5-inch screenshots, and requires the
  6.5-inch size when 6.9-inch screenshots are missing ([asc-screenshots]).
  Synthesis: not a contradiction, but the Devpost size is not the App Store's
  required size, so prepare both.

### Conflicts between sources

- **Dismissing a hard paywall.** RevenueCat: "ensure that users cannot dismiss
  or bypass the paywall" ([rc-hard-paywall]). Google lists as a violation:
  "Dismiss button is missing or not clearly visible and users may not
  understand that they can access functionality without accepting the
  subscription offer." ([gp-subscriptions]) Synthesis: Google's example
  targets apps with free functionality; if there is none, say so clearly.
- **Monthly-equivalent anchoring.** A contributor in SOSA 2026: "we anchored
  our default yearly plan to its monthly equivalent", and "Trial start rate
  increased by 30%" ([sosa-2026]). Apple: "the amount that will be billed
  must be the most prominent pricing element in the layout"
  ([apple-subscriptions]). Google's violation list includes "Annual
  subscriptions that most prominently display their pricing in terms of
  monthly cost" ([gp-subscriptions]).
- **Prominence of the billed price.** RevenueCat: "it's important that the
  full billed amount ($49.99/yr) is clearly provided on your paywall"
  ([rc-paywall-review]). Apple requires it to be "the most prominent pricing
  element" ([apple-subscriptions]).
- **Phased release for a first version.** RevenueCat's checklist ticks iOS
  for "Choose a staged release option" ([rc-launch-checklist]). Apple: "When
  you release a version update of your app, you can choose to release your iOS
  app in stages." ([asc-version-info]) Synthesis: phased release applies to
  updates, not to a first release.
- **Manual release versus the deadline.** RevenueCat: "choose to manually
  release the version and wait ~24 hours" when the app has new products
  ([rc-launch-checklist]). The repo's plan is to be live "at least a day or
  two before the submission period ends" ([repo-notes]). Synthesis: a manual
  hold uses up that buffer.
- **Galaxy seller type.** RevenueCat: "For Type of Member, select Corporate
  Seller", with a D-U-N-S number "required to request Commercial Seller
  Status" ([rc-galaxy-onboarding]). Samsung also offers a "Commercial Seller
  Request (for private sellers)" with an identification card
  ([ss-private-seller]), and a DBA route without D-U-N-S ([ss-prepare]).
- **Commercial seller timing.** Samsung's guide: "It takes about 4 business
  days to review a request for a status change to a Commercial Seller."
  ([ss-private-seller]) Samsung's FAQ: D-U-N-S and international bank
  verification can each take "up to 10 business days" ([ss-faq]).
- **Deletion by email.** Apple: non-regulated apps "should not require people
  to make a phone call, send an email, or go through other support flows"
  ([apple-deletion]). Google accepts "a customer service email or a form"
  for its deletion web resource ([gp-deletion]).
- **Trial length norms.** OneSignal: "Trials are short (typically 7–14
  days)" ([os-mobile-first]). SOSA 2026: "Current year: 46.5% use ≤4 days,
  39.9% use 5–9 days." ([sosa-2026])
- **When to ask for push.** OneSignal: "Drive push opt-in via a Day 1 in-app
  message during or right after onboarding." ([os-journeys]) Google: "you
  might wait until the third or fourth time the user launches your app."
  ([android-notif-permission])
- **US link-out mechanics.** RevenueCat's guide, secondary for Apple's rules,
  says US external payment options "need to link out to the full browser
  rather than an in-app web view" ([rc-a2w-guide]). Apple's guideline text
  for the US storefront states no such condition ([apple-guidelines]).
- **Rejection statistic.** RevenueCat: "over 40% of app rejections are for
  Guideline 2.1" ([rc-rejections]). Apple: "over 40% of unresolved issues
  are related to guideline 2.1" ([apple-review]).
- **Purchase status names.** RevenueCat's rejections page says to fill
  metadata so the status "is 'Ready to Submit'" ([rc-rejections]). Apple's
  statuses are "Prepare for Submission" and "Ready for Review"
  ([asc-iap-status]), which RevenueCat's newer guide also uses
  ([rc-ios-submit]).

### Conflicts inside one source

- **SOSA 2026, day-0 purchases.** "1/3 of all conversions happen on day zero
  for both methods" versus "Day 0 conversion: 50.6% overall" and a
  contributor's "Around 50% of paid conversions happen on Day 0."
  ([sosa-2026])
- **SOSA 2026, plan mix by category.** "Productivity favors yearly (77%)" and
  "Health & Fitness is monthly-heavy (68%)" versus "Health & Fitness leads
  annual adoption at 68%" and "Productivity is the monthly outlier at 77%".
  Overall: "Weekly, monthly, and annual each capture roughly a third overall"
  versus "overall market: 42% monthly, 34% yearly" ([sosa-2026]).
- **SOSA 2026, median prices.** Monthly "median risen from $7 to $8" versus
  "Weekly and monthly medians are flat ($5.99 and $10)", while weekly is
  also "median $5–$5.90" ([sosa-2026]).
- **SOSA 2026, RPI by plan.** "Weekly-dominant apps: D14: $0.19" versus a
  contributor's "D14 median RPI: $0.36 vs. $0.18 vs. $0.07" for annual,
  monthly, and weekly plans ([sosa-2026]).
- **SOSA 2026, North America.** "North America median: 2.8%" versus "D35
  download-to-paid median is 2.56% in North America vs. 1.37% in IN/SEA",
  while IN/SEA is elsewhere "median: 0.7%" ([sosa-2026]).
- **SOSA summary versus report.** The summary calls 10.7% versus 2.1% a
  "median Day-35 trial-to-paid conversion rate", says AI apps "churn 36%
  faster", and says "55% of all trial cancellations happen on Day 0"
  ([sosa-blog]). The report defines the metric as download-to-paid, says AI
  apps "churn 30% faster", and limits the 55% to "3-day trial cancellations"
  ([sosa-2026]).
- **Apple, in-app purchase text limits.** "In-app purchase names are limited
  to 35 characters and descriptions are limited to 55 characters"
  ([apple-product-page]) versus "no more than 30 characters" and "no more
  than 45 characters" ([asc-iap-info]).
- **Apple, keyword unit.** "Keywords are limited to 100 characters total"
  ([apple-product-page]) versus "You can provide up to 100 bytes of content."
  ([asc-version-info])
- **Google, privacy policy scope.** The App content page requires a policy
  "For apps that request access to sensitive permissions or data" and "For
  apps that target children" ([gp-app-content]); the Data safety page asks
  every developer to "provide a link to their privacy policy"
  ([gp-data-safety]).

## Gaps

- **Galaxy review time.** No Samsung page found states how long Pre-Review
  takes; the guide says only that sales begin "once the Pre-Review phase is
  completed" ([ss-review-process]).
- **Apple US link-out fees.** No Apple page found states a commission on US
  web sales reached through in-app links. Synthesis: the link-out commission
  terms found in the license agreement cover the Japan, Brazil, and EU
  storefronts ([apple-dpla]). The browser-only condition in RevenueCat's
  guide is unverified ([rc-a2w-guide]).
- **Apple review time for first submissions.** The 90% figure is an average
  across all submissions ([apple-review]); no figure for new apps or first
  in-app purchases was found.
- **Hackathons and expedited review.** Apple does not say whether a
  hackathon deadline counts as an event "you're directly associated with"
  ([apple-review]).
- **Google organization accounts.** The testing article covers personal
  accounts created after November 13, 2023 ([gp-testing]); no Google page
  found states the rule for organization accounts.
- **Google US link-out fees.** The external content links fee table did not
  parse cleanly, so its percentages are not quoted ([gp-us-links]).
- **Galaxy codes for judges.** No Samsung promo-code feature was found; the
  closest is licensed beta testers ([ss-launch]).
- **RevenueCat Galaxy support for other SDKs.** "coming soon" has no date
  ([rc-android-install]).
- **SOSA 2026 PDF.** The full report (the summary cites "338 pages") was not
  read; figures come from the web report ([sosa-blog]; [sosa-2026]).
- **OneSignal and Apple 4.5.4.** OneSignal's prompt and journey docs don't
  mention Apple's opt-in rule for promotional pushes ([os-prompt];
  [os-journeys]).
- **Devpost details.** The video page's list of "tips from the Devpost
  submission reviewers" rendered empty ([dp-video-tips]). Devpost's early
  eligibility review applies only to hackathons with a certain icon on the
  Overview page ([dp-submission-steps]); whether Shipaton has it was not
  checked. The Devpost blog posts show no dates.
- **Dates.** Most Apple, Google, Samsung, RevenueCat docs, and OneSignal
  pages show no publication date, so they are dated by the access date,
  September 21, 2026.

## Source index

Owners are the parties responsible for each page. "—" means the page shows no
date; every page was accessed on September 21, 2026.

| Source                     | Owner      | Published                                     | What it is                                                            |
| -------------------------- | ---------- | --------------------------------------------- | --------------------------------------------------------------------- |
| [apple-review]             | Apple      | —                                             | App Review overview: review times, common issues, expedited review    |
| [apple-guidelines]         | Apple      | Updated Jun 8, 2026                           | App Review Guidelines                                                 |
| [apple-us-news]            | Apple      | May 1, 2025                                   | News: guideline update for the US storefront                          |
| [apple-dpla]               | Apple      | Updated Aug 18, 2026; Schedule 2 Dec 17, 2025 | Apple Developer Program License Agreement                             |
| [apple-upcoming]           | Apple      | —                                             | Current and upcoming submission requirements                          |
| [asc-submit-app]           | Apple      | —                                             | App Store Connect Help: submit an app                                 |
| [asc-submit-iap]           | Apple      | —                                             | App Store Connect Help: submit an in-app purchase                     |
| [asc-offer-subs]           | Apple      | —                                             | App Store Connect Help: offer auto-renewable subscriptions            |
| [asc-sub-info]             | Apple      | —                                             | Reference: auto-renewable subscription information                    |
| [asc-iap-info]             | Apple      | —                                             | Reference: in-app purchase information                                |
| [asc-iap-status]           | Apple      | —                                             | Reference: in-app purchase statuses                                   |
| [asc-agreements]           | Apple      | —                                             | App Store Connect Help: sign and update agreements                    |
| [asc-agreement-status]     | Apple      | —                                             | App Store Connect Help: view agreements status                        |
| [asc-tax]                  | Apple      | —                                             | App Store Connect Help: provide tax information                       |
| [asc-bank]                 | Apple      | —                                             | App Store Connect Help: enter banking information                     |
| [asc-statuses]             | Apple      | —                                             | Reference: app and submission statuses                                |
| [asc-version-info]         | Apple      | —                                             | Reference: platform version information                               |
| [asc-app-info]             | Apple      | —                                             | Reference: app information                                            |
| [asc-sandbox]              | Apple      | —                                             | App Store Connect Help: overview of testing in sandbox                |
| [asc-sandbox-account]      | Apple      | —                                             | App Store Connect Help: create a Sandbox Apple Account                |
| [asc-testflight-iap]       | Apple      | —                                             | App Store Connect Help: testing subscriptions in TestFlight           |
| [sk-sandbox]               | Apple      | —                                             | StoreKit docs: testing in-app purchases with sandbox                  |
| [asc-screenshots]          | Apple      | —                                             | Reference: screenshot specifications                                  |
| [asc-upload-media]         | Apple      | —                                             | App Store Connect Help: upload app previews and screenshots           |
| [asc-preview-specs]        | Apple      | —                                             | Reference: app preview specifications                                 |
| [asc-app-privacy]          | Apple      | —                                             | App Store Connect Help: manage app privacy                            |
| [apple-privacy-labels]     | Apple      | —                                             | App privacy details on the App Store                                  |
| [asc-eula]                 | Apple      | —                                             | App Store Connect Help: provide a custom license agreement            |
| [apple-std-eula]           | Apple      | —                                             | Standard Licensed Application End User License Agreement              |
| [apple-subscriptions]      | Apple      | —                                             | Auto-renewable subscriptions guidance                                 |
| [apple-deletion]           | Apple      | —                                             | Offering account deletion in your app                                 |
| [asc-offer-codes]          | Apple      | —                                             | App Store Connect Help: set up subscription offer codes               |
| [apple-product-page]       | Apple      | —                                             | Creating your product page                                            |
| [apple-cpp]                | Apple      | —                                             | Custom product pages on the App Store                                 |
| [asc-cpp]                  | Apple      | —                                             | App Store Connect Help: configure custom product pages                |
| [asc-ppo]                  | Apple      | —                                             | App Store Connect Help: product page optimization                     |
| [apple-events]             | Apple      | —                                             | In-app events on the App Store                                        |
| [asc-events]               | Apple      | —                                             | App Store Connect Help: offer in-app events                           |
| [apple-hig-notifications]  | Apple      | —                                             | Human Interface Guidelines: managing notifications                    |
| [gp-testing]               | Google     | —                                             | Play Console Help: testing requirements for new personal accounts     |
| [gp-device]                | Google     | —                                             | Play Console Help: device verification for new accounts               |
| [gp-publish]               | Google     | —                                             | Play Console Help: publish your app and publishing statuses           |
| [gp-managed]               | Google     | —                                             | Play Console Help: control when changes are reviewed and published    |
| [gp-target-api]            | Google     | Updated Sep 16, 2026                          | Android Developers: target API level requirement                      |
| [gp-subscriptions]         | Google     | —                                             | Play policy: subscriptions                                            |
| [gp-payments]              | Google     | —                                             | Play policy: payments                                                 |
| [gp-us-links]              | Google     | Jul 22, 2026 update                           | Play Console Help: external content links program in the US           |
| [gp-app-content]           | Google     | —                                             | Play Console Help: prepare your app for review (App content)          |
| [gp-health]                | Google     | —                                             | Play Console Help: health apps declaration                            |
| [gp-data-safety]           | Google     | —                                             | Play Console Help: Data safety section                                |
| [gp-deletion]              | Google     | —                                             | Play Console Help: account deletion requirements                      |
| [gp-license]               | Google     | —                                             | Play Console Help: test billing with application licensing            |
| [gp-billing-test]          | Google     | Updated Sep 9, 2026                           | Android Developers: test your Google Play Billing integration         |
| [gp-promo]                 | Google     | —                                             | Play Console Help: create promotions (promo codes)                    |
| [gp-listing]               | Google     | —                                             | Play Console Help: create and set up your app (listing fields)        |
| [gp-graphics]              | Google     | —                                             | Play Console Help: add preview assets                                 |
| [gp-listing-bp]            | Google     | —                                             | Play Console Help: best practices for your store listing              |
| [gp-metadata]              | Google     | —                                             | Play policy: metadata                                                 |
| [gp-experiments]           | Google     | —                                             | Play Console Help: run A/B tests on your store listing                |
| [android-notif-permission] | Google     | Updated Sep 16, 2026                          | Android Developers: notification runtime permission                   |
| [ss-prepare]               | Samsung    | —                                             | Get started in Galaxy Store                                           |
| [ss-private-seller]        | Samsung    | —                                             | Seller Portal guide: commercial seller request (private sellers)      |
| [ss-corporate-seller]      | Samsung    | —                                             | Seller Portal guide: commercial seller request (corporate sellers)    |
| [ss-faq]                   | Samsung    | —                                             | Galaxy Store FAQ                                                      |
| [ss-distribution]          | Samsung    | —                                             | Galaxy Store App Distribution Guide                                   |
| [ss-launch]                | Samsung    | —                                             | Register your app in Seller Portal                                    |
| [ss-review-process]        | Samsung    | —                                             | Seller Portal guide: app review process                               |
| [ss-request-review]        | Samsung    | —                                             | Seller Portal guide: requesting app review                            |
| [ss-iap-register]          | Samsung    | —                                             | Seller Portal guide: registering IAP                                  |
| [rc-galaxy-onboarding]     | RevenueCat | —                                             | Docs: publish your app on the Galaxy Store                            |
| [rc-android-install]       | RevenueCat | —                                             | Docs: Android SDK installation, including the Galaxy Store module     |
| [sosa-2026]                | RevenueCat | —                                             | State of Subscription Apps 2026 web report (2025 data)                |
| [sosa-blog]                | RevenueCat | Mar 19, 2026 (updated Apr 22, 2026)           | Blog: SOSA 2026 in 10 minutes                                         |
| [rc-offerings]             | RevenueCat | —                                             | Docs: offerings                                                       |
| [rc-hard-paywall]          | RevenueCat | —                                             | Docs: hard paywall playbook                                           |
| [rc-freemium]              | RevenueCat | —                                             | Docs: freemium paywall playbook                                       |
| [rc-placements]            | RevenueCat | —                                             | Docs: targeting by placement                                          |
| [rc-paywalls]              | RevenueCat | —                                             | Docs: Paywalls                                                        |
| [rc-paywall-review]        | RevenueCat | —                                             | Docs: getting your paywall approved through app review                |
| [rc-experiments]           | RevenueCat | —                                             | Docs: getting started with Experiments                                |
| [rc-test-store]            | RevenueCat | —                                             | Docs: RevenueCat Test Store                                           |
| [rc-rejections]            | RevenueCat | —                                             | Docs: Apple App Store rejections                                      |
| [rc-launch-checklist]      | RevenueCat | —                                             | Docs: app subscription launch checklist                               |
| [rc-ios-submit]            | RevenueCat | —                                             | Docs: submitting an iOS subscription app                              |
| [rc-app-privacy]           | RevenueCat | —                                             | Docs: Apple App Privacy disclosures for RevenueCat                    |
| [rc-data-safety]           | RevenueCat | —                                             | Docs: Google Play data safety for RevenueCat                          |
| [rc-web-button]            | RevenueCat | —                                             | Docs: app-to-web purchases                                            |
| [rc-a2w-guide]             | RevenueCat | —                                             | Guide to store external purchase policies (secondary for store rules) |
| [rc-placement-blog]        | RevenueCat | Nov 20, 2023 (updated Jun 6, 2024)            | Blog: optimizing paywall placement                                    |
| [rc-paywall-guide]         | RevenueCat | Dec 5, 2024 (updated Nov 21, 2025)            | Blog: the essential guide to paywalls                                 |
| [os-prompt]                | OneSignal  | —                                             | Docs: prompt for push permissions                                     |
| [os-journeys]              | OneSignal  | —                                             | Docs: mobile-first lifecycle Journeys                                 |
| [os-mobile-first]          | OneSignal  | —                                             | Docs: mobile-first strategies                                         |
| [os-revenuecat]            | OneSignal  | —                                             | Docs: RevenueCat integration                                          |
| [dp-video-tips]            | Devpost    | Updated May 27, 2026                          | Help: video-making best practices                                     |
| [dp-video-upload]          | Devpost    | Updated Sep 18, 2026                          | Help: uploading a demo video                                          |
| [dp-submission-steps]      | Devpost    | Updated Aug 12, 2026                          | Help: know your submission steps                                      |
| [dp-demo-blog]             | Devpost    | —                                             | Blog: 6 tips for making a winning hackathon demo video                |
| [dp-judges-blog]           | Devpost    | —                                             | Blog: how to win a hackathon, advice from 5 judges                    |
| [dp-criteria-blog]         | Devpost    | —                                             | Blog: understanding submission and judging criteria                   |
| [repo-notes]               | This repo  | —                                             | Shipaton 2026 research notes                                          |
| [repo-brief]               | This repo  | —                                             | Shipaton 2026 brief                                                   |

[apple-review]: https://developer.apple.com/distribute/app-review/
[apple-guidelines]: https://developer.apple.com/app-store/review/guidelines/
[apple-us-news]: https://developer.apple.com/news/?id=9txfddzf
[apple-dpla]: https://developer.apple.com/support/terms/apple-developer-program-license-agreement/
[apple-upcoming]: https://developer.apple.com/news/upcoming-requirements/
[asc-submit-app]: https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app
[asc-submit-iap]: https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-in-app-purchase
[asc-offer-subs]: https://developer.apple.com/help/app-store-connect/manage-subscriptions/offer-auto-renewable-subscriptions
[asc-sub-info]: https://developer.apple.com/help/app-store-connect/reference/in-app-purchases-and-subscriptions/auto-renewable-subscription-information
[asc-iap-info]: https://developer.apple.com/help/app-store-connect/reference/in-app-purchases-and-subscriptions/in-app-purchase-information
[asc-iap-status]: https://developer.apple.com/help/app-store-connect/reference/in-app-purchases-and-subscriptions/in-app-purchase-statuses
[asc-agreements]: https://developer.apple.com/help/app-store-connect/manage-agreements/sign-and-update-agreements
[asc-agreement-status]: https://developer.apple.com/help/app-store-connect/manage-agreements/view-agreements-status
[asc-tax]: https://developer.apple.com/help/app-store-connect/manage-tax-information/provide-tax-information
[asc-bank]: https://developer.apple.com/help/app-store-connect/manage-banking-information/enter-banking-information
[asc-statuses]: https://developer.apple.com/help/app-store-connect/reference/app-information/app-and-submission-statuses
[asc-version-info]: https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information
[asc-app-info]: https://developer.apple.com/help/app-store-connect/reference/app-information/app-information
[asc-sandbox]: https://developer.apple.com/help/app-store-connect/test-in-app-purchases/overview-of-testing-in-sandbox
[asc-sandbox-account]: https://developer.apple.com/help/app-store-connect/test-in-app-purchases/create-a-sandbox-apple-account
[asc-testflight-iap]: https://developer.apple.com/help/app-store-connect/test-a-beta-version/testing-subscriptions-and-in-app-purchases-in-testflight
[sk-sandbox]: https://developer.apple.com/documentation/storekit/testing-in-app-purchases-with-sandbox
[asc-screenshots]: https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications
[asc-upload-media]: https://developer.apple.com/help/app-store-connect/manage-app-information/upload-app-previews-and-screenshots
[asc-preview-specs]: https://developer.apple.com/help/app-store-connect/reference/app-information/app-preview-specifications
[asc-app-privacy]: https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy
[apple-privacy-labels]: https://developer.apple.com/app-store/app-privacy-details/
[asc-eula]: https://developer.apple.com/help/app-store-connect/manage-app-information/provide-a-custom-license-agreement
[apple-std-eula]: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/
[apple-subscriptions]: https://developer.apple.com/app-store/subscriptions/
[apple-deletion]: https://developer.apple.com/support/offering-account-deletion-in-your-app/
[asc-offer-codes]: https://developer.apple.com/help/app-store-connect/manage-subscriptions/set-up-subscription-offer-codes
[apple-product-page]: https://developer.apple.com/app-store/product-page/
[apple-cpp]: https://developer.apple.com/app-store/custom-product-pages/
[asc-cpp]: https://developer.apple.com/help/app-store-connect/create-custom-product-pages/configure-multiple-product-page-versions
[asc-ppo]: https://developer.apple.com/help/app-store-connect/create-product-page-optimization-tests/overview-of-product-page-optimization
[apple-events]: https://developer.apple.com/app-store/in-app-events/
[asc-events]: https://developer.apple.com/help/app-store-connect/offer-in-app-events/offer-in-app-events
[apple-hig-notifications]: https://developer.apple.com/design/human-interface-guidelines/managing-notifications
[gp-testing]: https://support.google.com/googleplay/android-developer/answer/14151465
[gp-device]: https://support.google.com/googleplay/android-developer/answer/14316361
[gp-publish]: https://support.google.com/googleplay/android-developer/answer/9859751
[gp-managed]: https://support.google.com/googleplay/android-developer/answer/9859654
[gp-target-api]: https://developer.android.com/google/play/requirements/target-sdk
[gp-subscriptions]: https://support.google.com/googleplay/android-developer/answer/9900533
[gp-payments]: https://support.google.com/googleplay/android-developer/answer/9858738
[gp-us-links]: https://support.google.com/googleplay/android-developer/answer/16470497
[gp-app-content]: https://support.google.com/googleplay/android-developer/answer/9859455
[gp-health]: https://support.google.com/googleplay/android-developer/answer/14738291
[gp-data-safety]: https://support.google.com/googleplay/android-developer/answer/10787469
[gp-deletion]: https://support.google.com/googleplay/android-developer/answer/13327111
[gp-license]: https://support.google.com/googleplay/android-developer/answer/6062777
[gp-billing-test]: https://developer.android.com/google/play/billing/test
[gp-promo]: https://support.google.com/googleplay/android-developer/answer/6321495
[gp-listing]: https://support.google.com/googleplay/android-developer/answer/9859152
[gp-graphics]: https://support.google.com/googleplay/android-developer/answer/9866151
[gp-listing-bp]: https://support.google.com/googleplay/android-developer/answer/13393723
[gp-metadata]: https://support.google.com/googleplay/android-developer/answer/9898842
[gp-experiments]: https://support.google.com/googleplay/android-developer/answer/12053285
[android-notif-permission]: https://developer.android.com/develop/ui/views/notifications/notification-permission
[ss-prepare]: https://developer.samsung.com/galaxy-store/prepare.html
[ss-private-seller]: https://seller.samsungapps.com/guidePopup.as?numcid=0301020000&localeLanguage=en
[ss-corporate-seller]: https://seller.samsungapps.com/guidePopup.as?numcid=0301010000&localeLanguage=en
[ss-faq]: https://developer.samsung.com/galaxy-store/faq.html
[ss-distribution]: https://developer.samsung.com/galaxy-store/distribution-guide.html
[ss-launch]: https://developer.samsung.com/galaxy-store/launch.html
[ss-review-process]: https://seller.samsungapps.com/guidePopup.as?numcid=0202010000&localeLanguage=en
[ss-request-review]: https://seller.samsungapps.com/guidePopup.as?numcid=0201060000&localeLanguage=en
[ss-iap-register]: https://seller.samsungapps.com/guidePopup.as?numcid=0201040000&localeLanguage=en
[rc-galaxy-onboarding]: https://www.revenuecat.com/docs/platform-resources/galaxy-platform-resources/galaxy-store-onboarding
[rc-android-install]: https://www.revenuecat.com/docs/getting-started/installation/android
[sosa-2026]: https://www.revenuecat.com/state-of-subscription-apps
[sosa-blog]: https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026
[rc-offerings]: https://www.revenuecat.com/docs/offerings/overview
[rc-hard-paywall]: https://www.revenuecat.com/docs/playbooks/guides/hard-paywall
[rc-freemium]: https://www.revenuecat.com/docs/playbooks/guides/freemium
[rc-placements]: https://www.revenuecat.com/docs/tools/targeting/placements
[rc-paywalls]: https://www.revenuecat.com/docs/tools/paywalls
[rc-paywall-review]: https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls/app-review
[rc-experiments]: https://www.revenuecat.com/docs/tools/experiments-v1/experiments-overview-v1
[rc-test-store]: https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store
[rc-rejections]: https://www.revenuecat.com/docs/test-and-launch/app-store-rejections
[rc-launch-checklist]: https://www.revenuecat.com/docs/test-and-launch/launch-checklist
[rc-ios-submit]: https://www.revenuecat.com/docs/test-and-launch/submitting-ios-subscription-app
[rc-app-privacy]: https://www.revenuecat.com/docs/platform-resources/apple-platform-resources/apple-app-privacy
[rc-data-safety]: https://www.revenuecat.com/docs/platform-resources/google-platform-resources/google-plays-data-safety
[rc-web-button]: https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls/web-purchase-button
[rc-a2w-guide]: https://www.revenuecat.com/app-to-web-purchase-guidelines
[rc-placement-blog]: https://www.revenuecat.com/blog/growth/paywall-placement
[rc-paywall-guide]: https://www.revenuecat.com/blog/growth/guide-to-mobile-paywalls-subscription-apps
[os-prompt]: https://documentation.onesignal.com/docs/en/prompt-for-push-permissions
[os-journeys]: https://documentation.onesignal.com/docs/en/mobile-first-journeys
[os-mobile-first]: https://documentation.onesignal.com/docs/en/mobile-first
[os-revenuecat]: https://documentation.onesignal.com/docs/en/revenuecat
[dp-video-tips]: https://help.devpost.com/article/84-video-making-best-practices
[dp-video-upload]: https://help.devpost.com/article/85-uploading-a-demo-video
[dp-submission-steps]: https://help.devpost.com/article/126-know-your-submission-steps
[dp-demo-blog]: https://info.devpost.com/blog/6-tips-for-making-a-hackathon-demo-video
[dp-judges-blog]: https://info.devpost.com/blog/hackathon-judging-tips
[dp-criteria-blog]: https://info.devpost.com/blog/understanding-hackathon-submission-and-judging-criteria
[repo-notes]: /docs/research/0001-shipaton-2026.md
[repo-brief]: /docs/BRIEF.md

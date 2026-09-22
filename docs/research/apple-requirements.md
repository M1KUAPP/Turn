# Apple requirements for Guessling

The Apple rules that Guessling triggers as an iPhone game with free text sent to
a third-party AI model, a paid archive, and no accounts, beyond the general
review, purchase, and screenshot rules in the [best practices notes][bp-apple].
Every source below is Apple's own and was read on September 22, 2026;
"Synthesis:" marks this note's own inferences.

Contents:

1.  [Age ratings](#age-ratings)
    1.  [Rating tiers and questionnaire](#rating-tiers-and-questionnaire)
    1.  [Questionnaire answers for Guessling](#questionnaire-answers-for-guessling)
    1.  [Age assurance laws in US states](#age-assurance-laws-in-us-states)
1.  [App Privacy details](#app-privacy-details)
    1.  [Collection and optional disclosure](#collection-and-optional-disclosure)
    1.  [Data types that fit Guessling](#data-types-that-fit-guessling)
    1.  [Linked data and tracking](#linked-data-and-tracking)
    1.  [Guessling's data, classified](#guesslings-data-classified)
1.  [App Review Guidelines that Guessling triggers](#app-review-guidelines-that-guessling-triggers)
    1.  [Current version and the June 8, 2026 revision](#current-version-and-the-june-8-2026-revision)
    1.  [What the privacy policy must say](#what-the-privacy-policy-must-say)
    1.  [Consent and players who decline](#consent-and-players-who-decline)
    1.  [Auto-renewable subscription rules](#auto-renewable-subscription-rules)
    1.  [User-generated content rules](#user-generated-content-rules)
    1.  [Minimum functionality and spam](#minimum-functionality-and-spam)
    1.  [Information for App Review](#information-for-app-review)
    1.  [Rules about AI since 2025](#rules-about-ai-since-2025)
1.  [Accessibility Nutrition Labels](#accessibility-nutrition-labels)
    1.  [Status of the labels](#status-of-the-labels)
    1.  [What each label claims](#what-each-label-claims)
1.  [Offer codes beyond the basics](#offer-codes-beyond-the-basics)
    1.  [Offer code limits and timing](#offer-code-limits-and-timing)
    1.  [Offer code eligibility for trial users and subscribers](#offer-code-eligibility-for-trial-users-and-subscribers)
1.  [iPhone-only apps on other devices](#iphone-only-apps-on-other-devices)
    1.  [Device families and iPad screenshots](#device-families-and-ipad-screenshots)
    1.  [Where an iPhone app runs](#where-an-iphone-app-runs)
1.  [Export compliance for HTTPS](#export-compliance-for-https)
1.  [Sharing, haptics, and sound](#sharing-haptics-and-sound)
    1.  [Share sheet rules](#share-sheet-rules)
    1.  [Haptics rules](#haptics-rules)
    1.  [Sound and the silent switch](#sound-and-the-silent-switch)
1.  [EU trader status and storefronts](#eu-trader-status-and-storefronts)
    1.  [Digital Services Act trader status](#digital-services-act-trader-status)
    1.  [Choosing storefronts for a new app](#choosing-storefronts-for-a-new-app)
1.  [Dates and changes as of September 22, 2026](#dates-and-changes-as-of-september-22-2026)
1.  [Conflicts between sources](#conflicts-between-sources)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## Age ratings

Apple replaced the rating tiers and questionnaire in 2025, added social media
questions in 2026, and now passes age data to apps in three US states.

### Rating tiers and questionnaire

- On July 24, 2025, Apple's update "adds 13+, 16+, and 18+ to the existing 4+
  and 9+ ratings", and "Age ratings are assigned to each country or region and
  may vary based on region-specific suitability standards." ([news-age-2025])
- The new required questions cover "In-app controls.", "Capabilities.", "Medical
  or wellness topics.", and "Violent themes in your app or game." The deadline
  has passed: "Please provide responses to the updated age rating questions for
  each of your apps by January 31, 2026, to avoid an interruption when
  submitting your app updates in App Store Connect." ([news-age-2025])
- The same post warns: "you must consider how all app features, including AI
  assistants and chatbot functionality, impact the frequency of sensitive
  content appearing within your app to make sure it receives the appropriate
  rating." ([news-age-2025])
- Since July 9, 2026, the questionnaire "includes questions about your app's
  social media capabilities", and "beginning in September 2026, responses will
  be required when submitting new apps or updates to the App Store"
  ([news-age-social]).
- App Store Connect turns the answers into ratings: "Your selections are then
  translated into an Apple global age rating, as well as additional
  region-specific ratings if required." And: "An Unrated app can't be published
  on the App Store." ([asc-set-age])
- Kids category: "If your calculated rating is 4+ or 9+ and you want your app to
  also display in the Kids category on the App Store, under Age Categories and
  Override, choose Made for Kids", and "You can't change this selection once
  your app is approved by App Review." ([asc-set-age])
- Override: "If your app has a EULA with minimum age requirements that exceed
  the rating that Apple calculated, you must override to a rating that adheres
  to the requirements." ([asc-set-age])
- "Age ratings for an app may vary based on the OS version." Devices before iOS
  26 show the older global ratings of 4+, 9+, 12+, and 17+, and Australia,
  Brazil, Korea, and Vietnam add regional values ([asc-age-ref]).
- Time Allowances in iOS 27 let parents limit time by category, and "Apps and
  games with Entertainment or Games selected as a primary or secondary category
  in App Store Connect will be sorted into the corresponding Time Allowance
  categories." ([news-time-allowances]) They shipped on September 14, 2026
  ([nr-child-safety]).

The questions that matter for Guessling, with Apple's definitions and the lowest
rating each answer brings under the current global values ([asc-age-ref]):

| Question                                    | Apple's definition                                                                                                                                                                                     | Rating it brings                   |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| Unrestricted Web Access                     | "Users can navigate to any webpage within the app or freely browse the web. May include: embedded browser functionality or browser app."                                                               | 16+                                |
| User-Generated Content                      | "Includes the broad distribution of content created by users as a component of the app's intended user experience."                                                                                    | 4+                                 |
| Social Media                                | "Redistribution, amplification, or interaction with user-generated content through a social feed or similar discovery method that visibly spreads content to many users."                              | 13+                                |
| Messaging and Chat                          | "Users can directly communicate with one another through features within the app."                                                                                                                     | 4+                                 |
| Advertising                                 | "Paid promotion of products or services within the app."                                                                                                                                               | 4+                                 |
| Contests                                    | "Events that allow users to compete with one another for rankings, rewards, or the achievement of personal goals. May include: skill-based competitions, trivia quizzes, or sport or fitness contests" | 4+ if infrequent, 13+ if frequent  |
| Guns or Other Weapons                       | "References to or depictions of guns, weapons, or objects that may cause bodily harm. May include: guns, swords, or knives."                                                                           | 9+ if infrequent, 13+ if frequent  |
| Alcohol, Tobacco, or Drug Use or References | "References to or depictions of the consumption of alcohol, tobacco products, or other licit or illicit substances."                                                                                   | 13+ if infrequent, 18+ if frequent |
| Age Assurance                               | "Mechanism to confirm an individual's age meets the age requirement for accessing specific content or services. May include: declared age range API"                                                   | 4+                                 |

[asc-set-age]: https://developer.apple.com/help/app-store-connect/manage-app-information/set-an-app-age-rating
[news-time-allowances]: https://developer.apple.com/news/?id=0d2gpmml

### Questionnaire answers for Guessling

- Synthesis: In-App Controls: none. Adopting the Declared Age Range API would
  count as "Age Assurance", which still allows 4+.
- Synthesis: Unrestricted Web Access: no, if the privacy policy and terms open
  in Safari or in a view that can't browse freely. An embedded browser would
  make the app 16+.
- Synthesis: User-Generated Content: no. Typed questions go to the Worker and
  back to the player who typed them, nothing is "broadly distributed" to other
  players, and the share card leaves the app through the share sheet.
- Synthesis: Social Media, Messaging and Chat, and Advertising: no. A player
  asking the game isn't users communicating "with one another".
- Synthesis: the content descriptors, from Mature Themes to gambling: none, if
  the puzzle rules keep weapons, alcohol, tobacco, drugs, horror, and medical
  topics out of the hidden things and the hints. One "knife" or "beer" puzzle is
  an infrequent reference that lifts the rating to 9+ or 13+, so the
  puzzle-writing rules decide the rating. Jev can't add such content, since it
  returns only probabilities and the app shows three fixed answers.
- Synthesis: Contests: none. Guessling has no rankings or rewards, and players
  compare results outside the app. A later leaderboard could count as "Frequent
  contests", which is 13+, and Apple gives no threshold between "Infrequent" and
  "Frequent".
- Synthesis: the likely result is a calculated 4+, with "Not Applicable" under
  Age Categories and Override, which keeps the app out of the Kids category as
  the [idea][idea-review] plans.
- TypeSafe's services aren't "directed to children", and it doesn't knowingly
  handle personal data from anyone under 18 ([Jev notes][jev-store]). Synthesis:
  if Guessling's Terms of Use set a minimum age of 18 to match, Apple requires
  an override to 18+, and "Starting February 24, 2026, Apple will block users in
  Australia, Brazil, and Singapore from downloading apps rated 18+ unless they
  have been confirmed to be adults through reasonable methods."
  ([news-age-feb2026]) If the terms set no minimum age, 4+ stands and the notice
  asks players not to type personal information, as the [idea][idea-jev] plans.
- Guideline 5.1.4 applies at any rating: "apps in the Kids Category or those
  that collect, transmit, or have the capability to share personal information
  (e.g. name, address, email, location, photos, videos, drawings, the ability to
  chat, other personal data, or persistent identifiers used in combination with
  any of the above) from a minor must include a privacy policy and must comply
  with all applicable children's privacy statutes." ([apple-guidelines])

[idea-jev]: /docs/archive/guessling-idea.md#how-jev-fits

### Age assurance laws in US states

- Texas: "Due to a recent court ruling lifting an injunction on Texas law SB
  2420, new Apple Accounts in Texas are now subject to the law". It covers "age
  assurance and parent or guardian consent on behalf of minors under the age of
  18 for downloads, Apple In-App Purchases, and significant changes associated
  with an app", starting June 4, 2026 ([news-texas-2026]).
- Utah and Louisiana: "For users with new Apple Accounts in Utah as of May 6,
  2026, and in Louisiana as of July 1, 2026, age categories will be shared with
  the developer's app when requested through the Declared Age Range API."
  ([news-age-feb2026])
- Apple's Q&A says "developers are responsible for their own age restrictions",
  and in regions that require it, "you must check the age of the people using
  your app. For questions about your compliance obligations, consult your legal
  counsel." It adds that "there are no changes to the App Review process."
  ([apple-age-qa])
- To use all of Apple's age tools, "you must build your app against the iOS 26.2
  and iPadOS 26.2 SDKs, or later, with Xcode 26.2 (17C52) or later"
  ([apple-age-qa]).
- "Texas state law considers a change in the age rating of an app to be a
  significant change", and "It's the developer's responsibility to determine
  when there's a significant change to their app." ([news-texas-2025])
- "When a parent or guardian revokes consent for their child to access an app,
  Apple will prevent the app from launching." ([apple-age-qa])
- Synthesis: these are legal duties outside App Review that reach a US launch,
  so counsel, not review, decides them. Settling the rating before launch avoids
  a later "significant change". The Declared Age Range API could also serve
  TypeSafe's under-18 statement: a player in an under-18 range gets the
  exact-wording path, and nothing reaches TypeSafe. Apple documents the API for
  Swift; no Apple source covers calling it from Expo.

[news-texas-2025]: https://developer.apple.com/news/?id=2ezb6jhj

## App Privacy details

The best practices notes cover when the answers are required and RevenueCat's
"Purchases" guidance ([bp-privacy]); this section applies Apple's definitions to
Guessling.

### Collection and optional disclosure

- "'Collect' refers to transmitting data off the device in a way that allows you
  and/or your third-party partners to access it for a period longer than what is
  necessary to service the transmitted request in real time."
  ([apple-privacy-details])
- "'Third-party partners' refers to analytics tools, advertising networks,
  third-party SDKs, or other external vendors whose code you've added to your
  app." ([apple-privacy-details])
- Short-lived data: "if data is sent to your servers then immediately discarded
  after servicing the request, you do not need to disclose this in your answers
  in App Store Connect." ([apple-privacy-details])
- "Data types that meet all of the following criteria are optional to disclose:"
  ([apple-privacy-details])
  - "The data is not used for tracking purposes, meaning the data is not linked
    with Third-Party Data for advertising or advertising measurement purposes,
    or shared with a data broker."
  - "The data is not used for Third-Party Advertising, your Advertising or
    Marketing purposes, or for Other Purposes, as those terms are defined in the
    Tracking section."
  - "Collection of the data occurs only in infrequent cases that are not part of
    your app's primary functionality, and which are optional for the user."
  - "The data is provided by the user in your app's interface, it is clear to
    the user what data is collected, the user's name or account name is
    prominently displayed in the submission form alongside the other data
    elements being submitted, and the user affirmatively chooses to provide the
    data for collection each time."
- "Data types must meet all criteria in order to be considered optional for
  disclosure." Apple's example is "data collected in optional feedback forms or
  customer service requests that are unrelated to the primary purpose of the app
  and meet the other criteria above", and "data collected on an ongoing basis
  after an initial request for permission must be disclosed."
  ([apple-privacy-details])

### Data types that fit Guessling

Apple's definitions of the types that could apply ([apple-privacy-details]):

| Category     | Data type           | Apple's definition                                                                                                                                                                                    |
| ------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User Content | Gameplay Content    | "Such as saved games, multiplayer matching or gameplay logic, or user-generated content in-game"                                                                                                      |
| User Content | Customer Support    | "Data generated by the user during a customer support request"                                                                                                                                        |
| User Content | Other User Content  | "Any other user-generated content"                                                                                                                                                                    |
| Identifiers  | User ID             | "Such as screen name, handle, account ID, assigned user ID, customer number, or other user- or account-level ID that can be used to identify a particular user or account"                            |
| Identifiers  | Device ID           | "Such as the device's advertising identifier, or other device-level ID"                                                                                                                               |
| Purchases    | Purchase History    | "An account's or individual's purchases or purchase tendencies"                                                                                                                                       |
| Usage Data   | Product Interaction | "Such as app launches, taps, clicks, scrolling information, music listening data, video views, saved place in a game, video, or song, or other information about how the user interacts with the app" |
| Usage Data   | Other Usage Data    | "Any other data about user activity in the app"                                                                                                                                                       |

- Free text: "Mark 'Other User Content' to represent generic free form text
  fields", and "You're not responsible for disclosing all possible data that
  users may manually enter in the app through free-form fields or voice
  recordings." ([apple-privacy-details])
- Games: when "Your app includes game saves, multiplayer matching, or gameplay
  logic", "Declare Gameplay Content on your label." ([apple-privacy-details])
- IP addresses: "Declare the relevant data types based on how you use IP
  address, such as precise location, coarse location, device ID, or
  diagnostics." ([apple-privacy-details])
- Purposes: App Functionality is "Such as to authenticate the user, enable
  features, prevent fraud, implement security measures, ensure server up-time,
  minimize app crashes, improve scalability and performance, or perform customer
  support"; Analytics is "Using data to evaluate user behavior, including to
  understand the effectiveness of existing product features, plan new features,
  or measure audience size or characteristics" ([apple-privacy-details]).

### Linked data and tracking

- "You'll need to identify whether each data type is linked to the user's
  identity (via their account, device, or other details) by you and/or your
  third-party partners." Data is often linked "unless specific privacy
  protections are put in place before collection to de-identify or anonymize
  it", such as "Stripping data of any direct identifiers, such as user ID or
  name, before collection." ([apple-privacy-details])
- After collection: "You must not attempt to link the data back to the user's
  identity" and "You must not tie the data to other datasets that enable it to
  be linked to a particular user's identity." Also: "'Personal Information' and
  'Personal Data', as defined under relevant privacy laws, are considered linked
  to the user." ([apple-privacy-details])
- "'Tracking' refers to linking data collected from your app about a particular
  end-user or device, such as a user ID, device ID, or profile, with Third-Party
  Data for targeted advertising or advertising measurement purposes, or sharing
  data collected from your app about a particular end-user or device with a data
  broker." ([apple-privacy-details])
- Fingerprinting is out: "you may not derive data from a device for the purpose
  of uniquely identifying it." ([apple-user-privacy])
- SDKs: "Developers are responsible for all code included in their apps." Their
  privacy manifests help: "Xcode combines all these manifests into one
  comprehensive report, making it easier for you to create accurate Privacy
  Nutrition Labels." ([apple-user-privacy])

[apple-user-privacy]: https://developer.apple.com/app-store/user-privacy-and-data-use/

### Guessling's data, classified

Synthesis: the table applies the definitions above to the five kinds of data
Guessling handles.

| Data                                                       | Data type                               | Purpose                                                          | Linked to the user                                                                                             | Used to track |
| ---------------------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------- |
| (a) Typed questions, sent to the Worker and on to TypeSafe | Other User Content and Gameplay Content | App Functionality                                                | No, if the Worker keeps the install ID and IP address away from the text it stores and forwards; yes otherwise | No            |
| (b) Random install ID for per-device rate limits           | Device ID                               | App Functionality                                                | Yes                                                                                                            | No            |
| (c) RevenueCat purchase data and its anonymous app user ID | Purchase History and User ID            | App Functionality, and Analytics if RevenueCat's charts are used | Yes                                                                                                            | No            |
| (d) Server-side counts of plays and solves                 | Product Interaction                     | Analytics                                                        | No, if the counters hold no ID                                                                                 | No            |
| (e) "Report this answer" submissions                       | Customer Support, or Other User Content | App Functionality                                                | No, if a report carries no ID                                                                                  | No            |

- Synthesis: (a) is collected, because the Worker caches answers by wording for
  the day and TypeSafe receives the text. TypeSafe is called by the team's
  backend, not added to the app as code, so Apple's "third-party partners"
  definition doesn't reach it; the label shows the team's own collection, and
  the privacy policy names TypeSafe. For a player who declines the notice, the
  Worker answers exact bank wordings; if it stores nothing, that path isn't
  collection.
- Synthesis: (b) is a random ID, not fingerprinting. Kept in rate-limit
  counters, it outlives the request, so it's collected; IP addresses kept for
  rate limits need a type too.
- Synthesis: (c) RevenueCat's SDK is a third-party partner. Its anonymous app
  user ID fits "assigned user ID". If the SDK ships a privacy manifest, the
  privacy report Xcode builds shows what else it declares.
- Synthesis: (d) counters with no ID are "not linked" but still usage data,
  which guideline 5.1.1(ii) covers; see [consent and players who
  decline](#consent-and-players-who-decline).
- Synthesis: (e) fails optional disclosure. With no accounts, no "name or
  account name" can be "prominently displayed in the submission form", and all
  four criteria must hold. A report usually repeats text from (a), so it adds
  Customer Support at most.
- Synthesis: none of this is tracking, so the app needs no App Tracking
  Transparency prompt, as long as no SDK links the data with third-party data
  for ads.
- Synthesis: the [idea's checklist][idea-review] declares only "Purchases" and
  the typed questions; the identifiers and usage data above come on top.

## App Review Guidelines that Guessling triggers

### Current version and the June 8, 2026 revision

- On September 22, 2026, the guidelines end "Last Updated: June 8, 2026", which
  confirms the date in the [context notes][ctx-store] ([apple-guidelines]).
- Apple's list of the June 8, 2026 changes: "Introduction: revised kid and teen
  safety guidance.", "1.2: new paragraph clarifies developer responsibilities
  for content that violates this guideline.", "4.3(a): clarifies the basis for
  the guideline and adds an example.", "4.3(b): clarifies the basis for the
  guideline and adds examples.", and "4.5.3: clarifies that Live Activities may
  not be used to spam, phish, or send unsolicited messages to customers."
  ([news-guidelines-jun2026])
- The license agreement changed the same day, including "Section 7.9: Specified
  requirements on providing information regarding apps in App Store Connect, and
  protection of end users who are minors." ([news-guidelines-jun2026])
- Compared with Apple's page as archived on June 1, 2026, when it read "Last
  Updated: February 6, 2026", the introduction now says: "Make sure kids are
  getting age-appropriate experiences inside your app." The comparison also
  shows edits the news post doesn't list: "In some markets and on certain
  platforms" replaces the EU and Japan wording on alternative
  distribution, 2.5.6 links "entitlements for the EU and Japan", and 4.8 names
  "Log in with X" ([apple-guidelines]; [apple-guidelines-feb2026]).
- Earlier revisions: on February 6, 2026, Apple made "apps with random or
  anonymous chat" subject to 1.2 ([news-guidelines-feb2026]); on November 13,
  2025, it added third-party AI to 5.1.2(i) and age limits for creator content
  and mini apps to 1.2.1(a) and 4.7.5 ([news-guidelines-nov2025]).

[apple-guidelines-feb2026]: https://web.archive.org/web/20260601203454/https://developer.apple.com/app-store/review/guidelines/
[ctx-store]: /docs/CONTEXT.md#store-documentation

### What the privacy policy must say

- 5.1.1(i): "All apps must include a link to their privacy policy in the App
  Store Connect metadata field and within the app in an easily accessible
  manner. The privacy policy must clearly and explicitly:" ([apple-guidelines])
  - "Identify what data, if any, the app/service collects, how it collects that
    data, and all uses of that data."
  - "Confirm that any third party with whom an app shares user data (in
    compliance with these Guidelines)—such as analytics tools, advertising
    networks and third-party SDKs, as well as any parent, subsidiary or other
    related entities that will have access to user data—will provide the same or
    equal protection of user data as stated in the app's privacy policy and
    required by these Guidelines."
  - "Explain its data retention/deletion policies and describe how a user can
    revoke consent and/or request deletion of the user's data."
- Synthesis: Guessling's policy lists the five kinds of data in [Guessling's
  data, classified](#guesslings-data-classified) plus the guesses; names
  TypeSafe, RevenueCat, and Cloudflare, which hosts the Worker, as parties bound
  to the same protection; gives retention for the day's answer cache, the
  reports, and TypeSafe's copies, whose retention the [Jev notes][jev-store]
  leave open; and says how to withdraw AI consent in Settings and how a player
  without an account asks for deletion.

### Consent and players who decline

- 5.1.1(ii) Permission: "Apps that collect user or usage data must secure user
  consent for the collection, even if such data is considered to be anonymous at
  the time of or immediately following collection. Paid functionality must not
  be dependent on or require a user to grant access to this data. Apps must also
  provide the customer with an easily accessible and understandable way to
  withdraw consent." It adds: "Apps that collect data for a legitimate interest
  without consent by relying on the terms of the European Union's General Data
  Protection Regulation ('GDPR') or similar statute must comply with all terms
  of that law." ([apple-guidelines])
- 5.1.1(iii) Data Minimization: "Apps should only request access to data
  relevant to the core functionality of the app and should only collect and use
  data that is required to accomplish the relevant task." ([apple-guidelines])
- 5.1.1(iv) Access: "Apps must respect the user's permission settings and not
  attempt to manipulate, trick, or force people to consent to unnecessary data
  access." And: "Where possible, provide alternative solutions for users who
  don't grant consent. For example, if a user declines to share Location, offer
  the ability to manually enter an address." ([apple-guidelines])
- 5.1.2(ii): "Data collected for one purpose may not be repurposed without
  further consent unless otherwise explicitly permitted by law." The third-party
  AI rule in 5.1.2(i) is quoted in the [Jev notes][jev-store]
  ([apple-guidelines]).
- 2.5.14: "Apps must request explicit user consent and provide a clear visual
  and/or audible indication when recording, logging, or otherwise making a
  record of user activity. This includes any use of the device camera,
  microphone, screen recordings, or other user inputs." ([apple-guidelines])
- Synthesis: a player who declines still gets the whole game on the
  exact-wording path, which is the "alternative solution" that 5.1.1(iv) asks
  for. Because paid functionality can't depend on consent, a Guessling+
  subscriber who declines still plays every archive puzzle on that path.
- Synthesis: the choice stays reversible both ways in Settings, and the notice
  offers declining as plainly as allowing, without asking again after each
  question.
- Synthesis: minimize what leaves the Worker: TypeSafe gets the question and the
  fact card, never the install ID or IP address.
- Synthesis: mining logged questions to grow the question bank is a second
  purpose under 5.1.2(ii), so either the notice says so or the team doesn't do
  it.
- Synthesis: the play and solve counts are usage data that 5.1.1(ii) covers
  "even if such data is considered to be anonymous". The notice can cover them,
  or the team relies on legitimate interest under GDPR-style law, which is a
  legal call.
- Synthesis: 2.5.14 may reach the day's cache of typed questions as a record of
  "other user inputs"; the notice that asks for consent also serves as the
  "clear visual" indication. For a player who declines, answering in memory and
  storing nothing avoids both collection and a record.

### Auto-renewable subscription rules

- 3.1.2(a): "If you offer an auto-renewable subscription, you must provide
  ongoing value to the customer, and the subscription period must last at least
  seven days and be available across all of the user's devices. While the
  following list is not exhaustive, examples of appropriate subscriptions
  include: new game levels; episodic content; multiplayer support; apps that
  offer consistent, substantive updates; access to large collections of, or
  continually updated, media content; software as a service ('SAAS'); and cloud
  support." ([apple-guidelines])
- Its bullets add "Subscriptions must work on all of the user's devices where
  the app is available.", "As with all apps, those offering subscriptions should
  allow a user to get what they've paid for without performing additional tasks,
  such as posting on social media, uploading contacts, checking in to the app a
  certain number of times, etc.", and "Auto-renewable subscription apps may
  offer a free trial period to customers by providing the relevant information
  set forth in App Store Connect." ([apple-guidelines])
- 3.1.2(c): "Before asking a customer to subscribe, you should clearly describe
  what the user will get for the price. How many issues per month? How much
  cloud storage? What kind of access to your service? Ensure you clearly
  communicate the requirements described in Schedule 2 of the Apple Developer
  Program License Agreement." ([apple-guidelines]) The Schedule 2 items and the
  sign-up screen rules are in the [best practices notes][bp-privacy].
- Service must last: "Keep in mind that you're required by the Paid Apps
  Agreement to provide the full amount of content to eligible subscribers
  through the subscription duration." Ending a plan takes notice: "A minimum of
  31 days is required from the date subscription is removed from sale and
  service is stopped to allow monthly and shorter duration subscriptions to
  expire." ([asc-sub-availability])
- Synthesis: the archive fits "new game levels" and "access to large collections
  of, or continually updated, media content", and one new puzzle a day is the
  ongoing value. The paywall says what the archive holds today, such as the
  number of puzzles, to meet 3.1.2(c).
- Synthesis: a yearly plan sold in September 2026 obliges the Worker, the
  archive, and Jev's credits to run until September 2027, well past the idea's
  "through at least October 22" ([idea-schedule]).
- Synthesis: "work on all of the user's devices" means Restore Purchases and the
  Worker's entitlement check accept the same purchase from another device,
  including a Mac or Apple Vision Pro if the app stays available there.

### User-generated content rules

- 1.2: "Apps with user-generated content present particular challenges, ranging
  from intellectual property infringement to anonymous bullying. To prevent
  abuse, apps with user-generated content or social networking services must
  include:" ([apple-guidelines])
  - "A method for filtering objectionable material from being posted to the app"
  - "A mechanism to report offensive content and timely responses to concerns"
  - "The ability to block abusive users from the service"
  - "Published contact information so users can easily reach you"
- Since February 6, 2026, the paragraph on apps "that end up being used
  primarily for" harmful uses names "random or anonymous chat"
  ([apple-guidelines]; [news-guidelines-feb2026]).
- New on June 8, 2026: "It is your responsibility to remove content that
  violates this guideline, your terms of service, or your community standards.
  If we find such content, we will ask you to remove it, and provide a plan to
  improve your compliance with this guideline." ([apple-guidelines])
- 1.2 doesn't define user-generated content. The age rating questionnaire
  defines it as "the broad distribution of content created by users as a
  component of the app's intended user experience" ([asc-age-ref]).
- 4.7 lists "chatbots" among software "not embedded in the binary", which must
  "include a method for filtering objectionable material, a mechanism to report
  content and timely responses to concerns, and the ability to block abusive
  users" ([apple-guidelines]).
- Synthesis: typed questions reach only the Worker, TypeSafe, and the player who
  typed them, so 1.2's filtering and blocking duties aim at content Guessling
  doesn't show. Nor is Guessling a 4.7 host: it offers no third-party software,
  and its answers are fixed strings. "Report this answer" and a support URL with
  contact details still cover the report and contact items if a reviewer reads
  the question box as user content or a chatbot. Showing questions to other
  players, even in a feed of funny questions, would bring in all four 1.2 items
  and the Social Media rating question.

### Minimum functionality and spam

- 4.2: "Your app should include features, content, and UI that elevate it beyond
  a repackaged website. If your app is not particularly useful, unique, or
  'app-like,' it doesn't belong on the App Store. If your App doesn't provide
  some sort of lasting entertainment value or adequate utility, it may not be
  accepted." ([apple-guidelines])
- Apple's review page: "If your app doesn't offer much functionality or content,
  or only applies to a small niche market, it may not be approved."
  ([apple-review])
- 4.3(b), revised on June 8, 2026: "Don't submit apps that are indistinguishable
  from what's already widely available." It names "dating, flashlight, sound
  effects, wallpaper, simple timers, and fortune telling" as well established,
  and "drinking games, Kama Sutra, fart, and burp apps" as low-effort
  ([apple-guidelines]).
- Synthesis: one puzzle a day can look thin during a short review session, so
  the review notes point at what lasts: a new puzzle daily, the archive, and
  questions in the player's own words. Twenty questions isn't on 4.3(b)'s lists,
  but the notes say how Guessling differs from apps in which the app asks the
  questions.

### Information for App Review

- 2.1(a): "Submissions to App Review, including apps you make available for
  pre-order, should be final versions with all necessary metadata and fully
  functional URLs included; placeholder text, empty websites, and other
  temporary content should be scrubbed before submission. Make sure your app has
  been tested on-device for bugs and stability before you submit it, and include
  demo account info (and turn on your back-end service!) if your app includes a
  login." It ends: "We will reject incomplete app bundles and binaries that
  crash or exhibit obvious technical problems." ([apple-guidelines])
- 2.1(b): "If you offer in-app purchases in your app, make sure they are
  complete, up-to-date, visible to the reviewer and functional. If any
  configured in-app purchase items cannot be found or reviewed in your app,
  explain the reason in your review notes." ([apple-guidelines])
- The checklist before submitting includes "Enable backend services so that
  they're live and accessible during review" and "Include detailed explanations
  of non-obvious features and in-app purchases in the App Review notes,
  including supporting documentation where appropriate" ([apple-guidelines]).
- "Enter all of the details needed for review in the App Review Information
  section of App Store Connect." And: "If there are special configurations to
  set, include the specifics. If features require an environment that is hard to
  replicate or require specific hardware, be prepared to provide a demo video or
  the hardware." ([apple-review])
- The Notes field: "Include information that may be needed to test your app,
  such as app-specific settings and test registration or account details." "The
  Notes field can contain up to 4000 bytes." App Review information "isn't
  visible to customers and can be edited at any time", and a demo account is
  asked for only "If your app requires a login to use it." ([asc-version-info])
- Synthesis: with no login, there's no demo account. The notes say how to play;
  that answers come live from the team's server, so the device needs a network;
  where the notice appears and how to test both choices, including the Settings
  switch; what "Report this answer" does; how to reach the archive, buy
  Guessling+ in the sandbox, and restore it; and that rate limits won't block a
  reviewer. The Worker and TypeSafe's credits stay up from submission on.

[asc-version-info]: https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information

### Rules about AI since 2025

- 5.1.2(i), November 13, 2025: "Clarifies that you must clearly disclose where
  personal data will be shared with third parties, including with third-party
  AI, and obtain explicit permission before doing so."
  ([news-guidelines-nov2025]) The rule's text and what it means for Jev are in
  the [Jev notes][jev-store].
- 4.7 lists "chatbots" among the software an app may offer outside its binary;
  see [user-generated content rules](#user-generated-content-rules)
  ([apple-guidelines]).
- Age ratings must account for "AI assistants and chatbot functionality"
  ([news-age-2025]).
- On June 8, 2026, the license agreement's "Section 3.2(h): Updated terms for
  use of and access to Apple models." and "Section 3.3.11: Grouped AI and
  machine learning technologies under new subsection." govern Apple's own
  models, which Guessling doesn't use ([news-guidelines-jun2026]).
- Synthesis: in the guidelines' text, AI appears only in 5.1.2(i); no rule found
  requires labeling AI answers or bars a third-party model ([apple-guidelines]).

## Accessibility Nutrition Labels

### Status of the labels

- "The Accessibility Nutrition Labels help users learn if an app will be
  accessible to them before they download, and give developers the opportunity
  to better inform and educate their users on features that their app supports."
  ([asc-a11y-overview])
- Not yet required: "providing these labels will be voluntary to start", but
  "over time, you'll be required to share accessibility support details to
  submit new apps and app updates to the App Store." No date is given
  ([asc-a11y-overview]).
- The labels show on devices running iOS 26 or later, and "If you don't provide
  this information for a device, the section will still appear on your product
  page and show that you haven't indicated support yet." ([asc-a11y-overview])
- "You can only publish support for devices that have a live version on the App
  Store." ([asc-a11y-manage])
- The rule for every label: "To indicate support for an accessibility feature in
  the Accessibility Nutrition Labels, users must be able to complete all of the
  common tasks of your app using that feature." Common tasks are "the primary
  functionality that you expect users to perform in your app, plus functionality
  that's fundamental to using an app in general: first launch experience, login,
  purchase, and settings." ([asc-a11y-overview])
- "If an app potentially has intentionally misleading or harmful accessibility
  labels, App Review has the ability to contact the developer and ask them to
  update their Accessibility Nutrition Labels." ([asc-a11y-overview])
- Search uses them: apps that indicated support "will be considered more
  relevant in search results" for queries such as "VoiceOver note taking apps"
  ([asc-a11y-overview]).
- For an iPhone app on Apple Vision Pro or an Apple silicon Mac, "no responses
  are needed", and the iPhone labels show there ([asc-a11y-overview]).
- "Don't attempt to make a custom implementation of the functionality provided
  by core assistive technologies like VoiceOver or Voice Control."
  ([asc-a11y-overview])

[asc-a11y-manage]: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/manage-accessibility-nutrition-labels

### What each label claims

The middle column quotes Apple's criteria; the last column is Synthesis.

| Label                             | Apple's condition for claiming it                                                                                                                                                                                                                                        | What Guessling must pass                                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| VoiceOver                         | "users are able to navigate and interact with visual elements, including text, media, buttons, and controls, using only VoiceOver"; alerts "should be conveyed to VoiceOver users in a timely but non-disruptive manner" ([asc-a11y-voiceover])                          | Each answer spoken as text, not only shown as a nod or head shake; labeled buttons on the paywall and the share card |
| Voice Control                     | "users are able to navigate and interact with your app using only voice commands"; "users should be able to dictate and edit text in any text field" ([asc-a11y-voice-control])                                                                                          | Dictating a question into the text field                                                                             |
| Larger Text                       | "users can enlarge text to at least 200% or the maximum font size for the system"; "Don't rely on system-provided assistive technology like Zoom or Hover Text" ([asc-a11y-larger-text])                                                                                 | The question field, answer history, and paywall prices at the largest size                                           |
| Dark Interface                    | "if your app is dark by default for all common tasks", or "if it allows the user to enable a mode or setting that keeps the interface dark" ([asc-a11y-dark])                                                                                                            | Every screen, the paywall included                                                                                   |
| Differentiate Without Color Alone | "if the common tasks of your app don't rely on color as the only way to convey information" ([asc-a11y-color])                                                                                                                                                           | Yes and No shown with words or shapes, not only green and red                                                        |
| Sufficient Contrast               | "meets general contrast guidelines by default — usually 4.5 to 1 for most text elements" ([asc-a11y-contrast])                                                                                                                                                           | Text over the Guessling's art                                                                                        |
| Reduced Motion                    | "If your app doesn't contain any problematic motion triggers, you may indicate that it supports Reduced Motion"; where motion carries meaning, "don't remove the animation entirely. Instead, consider providing a new animation that avoids motion" ([asc-a11y-motion]) | A fade or other still version of the nod, head shake, shrug, and celebration                                         |
| Captions                          | "if it provides captions for video played through your app, including game interstitials and audible dialogue" ([asc-a11y-captions])                                                                                                                                     | Doesn't apply without video or speech                                                                                |
| Audio Descriptions                | "if it provides narrated descriptions of relevant on-screen content for video played in your app"; "You should also describe tips and hints that are otherwise only available through visual clues." ([asc-a11y-audio-desc])                                             | Doesn't apply without video                                                                                          |

- Synthesis: labels can be published only once the app is live, so they don't
  block the September 24 submission. The purchase flow is a common task, so the
  RevenueCat paywall has to pass every label claimed. The cheapest claims are
  Differentiate Without Color Alone, Sufficient Contrast, and Dark Interface;
  VoiceOver and Reduced Motion need spoken and still versions of the Guessling's
  reactions.

[asc-a11y-voiceover]: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/voiceover-evaluation-criteria
[asc-a11y-voice-control]: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/voice-control-evaluation-criteria
[asc-a11y-dark]: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/dark-interface-evaluation-criteria
[asc-a11y-color]: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/differentiate-without-color-alone-evaluation-criteria
[asc-a11y-contrast]: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/sufficient-contrast-evaluation-criteria
[asc-a11y-motion]: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria
[asc-a11y-captions]: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/captions-evaluation-criteria
[asc-a11y-audio-desc]: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/audio-descriptions-evaluation-criteria

## Offer codes beyond the basics

The [best practices notes][bp-codes] cover the two code types and the
one-code-per-offer limit; this section adds limits, timing, and eligibility.

### Offer code limits and timing

- "You can create codes for a maximum of 1 million redemptions per app, per
  quarter." One-time-use codes "Expire after a maximum of six months from the
  date they're created." ([asc-offer-codes])
- One-time-use batches: "You must select a minimum of 500 and a maximum of
  25,000." Custom codes: "Enter a custom code up to 64 characters and without
  any special characters", with a redemption limit "of up to 25,000 at a time"
  and, optionally, no end date ([asc-offer-codes]).
- "In order for customers to redeem codes, your app must be in the Ready for
  Sale state." After codes are created, "It may take up to an hour before codes
  are redeemable by customers." ([asc-offer-codes])
- "Once you create an offer, you won't be able to edit it." "You can have up to
  10 active offers per subscription SKU at a time", and a deactivated offer
  "can't be reactivated later" ([asc-offer-codes]).
- Offers that end without billing: "Checking the box will prevent auto-renewal,
  ensuring customers receive a commitment-free trial subscription. If you choose
  this option, you'll only be able to choose Free offers." ([asc-offer-codes])
  Apple added these on October 29, 2025, and said that "starting March 26, 2026,
  you'll no longer be able to create promo codes for In-App Purchases in App
  Store Connect." ([news-offer-codes-2025])
- Custom codes can't be typed into App Store settings: "Because people can't
  redeem a custom code by entering it in their App Store account settings, it's
  important to let them know that they can redeem it through a redemption URL or
  within your app." ([hig-iap])
- In-app redemption: "Including the redemption sheet in your app is recommended,
  but optional." ([doc-offer-codes])
- Sandbox codes for testing: "You must select a minimum of 10 and a maximum of
  10,000 codes." ([asc-offer-codes])

[hig-iap]: https://developer.apple.com/design/human-interface-guidelines/apple-in-app-purchase

### Offer code eligibility for trial users and subscribers

- Each offer sets its eligibility ([asc-offer-codes]):
  - "New subscribers: Customers who have never subscribed to any subscription
    product within the group."
  - "Existing subscribers: Customers who are currently subscribed to a product
    within the group. This includes subscribers in billing retry or a grace
    period, as long as auto-renew remains enabled."
  - "Expired subscribers: Customers who were previously subscribed to a product
    within the group, but whose auto-renew is turned off and subscription period
    has ended."
- With an introductory offer, the offer also sets whether both apply
  ([asc-offer-codes]):
  - "Yes. Eligible customers will redeem your app's introductory offer first,
    then automatically renew to the offer they redeemed with the code. (If
    you've disabled auto-renewal, you won't be able to choose this option)."
  - "No. Eligible customers will redeem the offer code first, then automatically
    renew to the standard subscription price without using the introductory
    offer. If they cancel and resubscribe at any point, they're still eligible
    to redeem an introductory offer."
- "Customers can redeem one introductory offer per subscription group."
  ([apple-subscriptions])
- "Existing subscribers can only redeem codes that are an upgrade from or at the
  same level as their current subscription." ([apple-subscriptions]) On levels:
  "You can stack subscriptions with equal content but different durations and
  other similar variables, at the same level." ([asc-offer-subs])
- StoreKit covers the case where "the offer code redemption applies to an
  auto-renewable subscription's next renewal period". App Store Server
  Notifications send `OFFER_REDEEMED` "when someone redeems an offer for an
  active auto-renewable subscription" and `SUBSCRIBED` "when they redeem the
  offer code as an initial purchase or to resubscribe". The system sheet refuses
  a code "if redeeming the code would result in a subscription downgrade."
  ([doc-offer-codes])
- Synthesis: a judge who never subscribed is "New". A judge in the 3-day trial
  or on a paid plan with auto-renew on is "Existing", and their free month
  likely starts at the next renewal. A judge whose trial or plan ended with
  auto-renew off is "Expired". Selecting all three makes every judge's code
  work.
- Synthesis: a judge who canceled during the trial, and whose trial hasn't
  ended, fits neither "Existing" nor "Expired" as written; see [Gaps](#gaps).
- Synthesis: a free month with the no-renewal box checked ends without a charge
  but rules out stacking the 3-day trial first. Without the box, "No" gives a
  new judge one free month, then the standard price unless they cancel, and
  keeps the trial for later.
- Synthesis: keep the yearly and monthly plans at the same level, so a code on
  either plan is never a downgrade.
- Synthesis: one-time-use batches start at 500 codes. For a handful of judges, a
  custom code with a small redemption limit, sent as a redemption URL, is
  simpler, and an in-app redemption sheet, if the app offers one, accepts it
  too.

[asc-offer-subs]: https://developer.apple.com/help/app-store-connect/manage-subscriptions/offer-auto-renewable-subscriptions

## iPhone-only apps on other devices

### Device families and iPad screenshots

- The 13-inch iPad row of the screenshot specifications reads "Required if app
  runs on iPad" ([asc-screenshots]); the iPhone sizes are in the [best practices
  notes][bp-screenshots].
- `TARGETED_DEVICE_FAMILY` is a "Comma-separated list of integers corresponding
  to device families supported by this target", in which "1" means "iPhone, iPod
  touch" and "2" means "iPad, Mac Catalyst using 'Scaled to Match iPad'
  Interface". "The build system uses this information to set the correct value
  for the `UIDeviceFamily` key it adds to the target's `Info.plist` file."
  ([doc-build-settings])
- 2.4.1: "To ensure people get the most out of your app, iPhone apps should run
  on iPad whenever possible. We encourage you to consider building apps so
  customers can use them on all of their devices." ([apple-guidelines])
- The one iPhone-only switch found in Apple's docs is a required device
  capability. For `healthkit`, "The system uses this value to limit apps to
  iPhone. In order to ship Universal apps, remove this key."
  ([doc-required-caps])
- Synthesis: "runs on iPad" most plausibly means a build whose device families
  include iPad, so an iPhone-only build needs no 13-inch screenshots; Apple
  doesn't define the phrase (see [Gaps](#gaps)). Leaving iPad out of the device
  families doesn't keep the app off iPads: 2.4.1 expects iPhone apps to run
  there, and Guessling claims no capability that limits it to iPhone. Test the
  iPhone build on an iPad before submitting.

[bp-screenshots]: /docs/research/best-practices.md#screenshots-and-app-previews-on-apple

### Where an iPhone app runs

- iPad: no Apple page read describes how an iPhone-only app appears on iPad. One
  documented rule differs by device: "On iPad, you must present the view
  controller in a popover. On iPhone and iPod touch, you must present it
  modally." ([doc-activity-vc]) Synthesis: include the share sheet in the iPad
  test.
- Mac: "Users running macOS 11 or later on Macs with Apple silicon can access
  iPhone and iPad apps through the Mac App Store, provided no edits are made to
  the app availability." ([asc-mac])
- Apple Vision Pro: "Your iPhone and iPad apps will be available to users on
  Apple Vision Pro unless you edit their availability in App Store Connect."
  There, visionOS "runs your compatible iPad or iPhone app in an environment
  that matches an iPad as much as possible" ([asc-avp]; [doc-visionos-compat]).
- Synthesis: unless the team tests on a Mac and on Apple Vision Pro, turn both
  off under Pricing and Availability before release; each extra device also
  widens the 3.1.2(a) duty that subscriptions "work on all of the user's
  devices".
- iPhone Duo is "the first foldable iPhone": "Pre-orders begin Friday, October
  16, with availability beginning Friday, October 23." ([nr-iphone-duo]) "When
  you build with Xcode 26 and earlier, your app doesn't extend under the status
  bar and camera." ([doc-iphone-duo]) Its screenshot sizes are listed, but
  "Support for uploading assets for this device in App Store Connect will be
  available later this year." ([asc-screenshots]) For games: "Make your game
  playable in every device pose. You can choose to lock to either portrait or
  landscape orientation, but be sure to fill the screen as the device pose
  changes." ([hig-iphone-duo])
- Synthesis: iPhone Duo goes on sale after judging ends on October 13, so it's a
  later item; a portrait-only build from Xcode 26 still runs there, inside the
  status bar and camera areas.
- From April 2027, "iOS and iPadOS apps must be built with the iOS 27 & iPadOS
  27 SDK or later" ([news-submissions-sep2026]).

[doc-activity-vc]: https://developer.apple.com/documentation/uikit/uiactivityviewcontroller
[asc-mac]: https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/manage-availability-of-iphone-and-ipad-apps-on-macs-with-apple-silicon
[asc-avp]: https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/manage-availability-of-iphone-and-ipad-apps-on-apple-vision-pro
[doc-visionos-compat]: https://developer.apple.com/documentation/visionos/making-your-app-compatible-with-visionos
[hig-iphone-duo]: https://developer.apple.com/design/human-interface-guidelines/designing-for-iphone-duo

## Export compliance for HTTPS

- "Typically, the use of encryption that's built into the operating system—for
  example, when your app makes HTTPS connections using URLSession—is exempt from
  export documentation upload requirements, whereas the use of proprietary
  encryption is not." ([doc-encryption])
- The Info.plist key is `ITSAppUsesNonExemptEncryption`: "Set the value for this
  key to NO in your app's Information Property List file to indicate that your
  app—including any third-party libraries you link against—either uses no
  encryption, or only uses encryption that's exempt from export compliance
  requirements". ([doc-its-key])
- Without the key, "App Store Connect walks you through an export compliance
  questionnaire every time you upload a new version of your app. Including the
  key streamlines the app submission process." ([doc-its-key])
- Apple's table: "Your app uses encryption limited to that within the Apple
  operating system" needs "No documentation required in App Store Connect." An
  industry-standard algorithm not provided by the system needs a French
  encryption declaration, which "is only required if you're distributing your
  app on the App Store in France" ([asc-export-docs]).
- Two cautions: "If your app uses exempt forms of encryption, you might
  alternatively be required to submit a year-end self-classification report to
  the U.S. government." ([doc-encryption]) And "you're responsible for all
  liabilities associated with misinterpretation of export regulations or
  claiming exemption inaccurately." ([asc-export])
- Synthesis: if every connection, to the Worker and to RevenueCat, is HTTPS
  through the system's networking, set the key to `NO`; in Expo, that goes
  through the app config's Info.plist settings. Bundling a crypto library would
  change the answer. Whether the year-end report applies is a legal question.

[doc-its-key]: https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption
[asc-export-docs]: https://developer.apple.com/help/app-store-connect/reference/app-information/export-compliance-documentation-for-encryption
[asc-export]: https://developer.apple.com/help/app-store-connect/manage-app-information/overview-of-export-compliance

## Sharing, haptics, and sound

### Share sheet rules

- "An activity view — often called a share sheet — presents a range of tasks
  that people can perform in the current context." ([hig-activity])
- "Make sure activities are appropriate for the current context. Although you
  can't reorder system-provided tasks in an activity view, you can exclude tasks
  that aren't applicable to your app." ([hig-activity])
- "Use the Share button to display an activity view. People are accustomed to
  accessing system-provided activities when they choose the Share button. Avoid
  confusing people by providing an alternative way to do the same thing."
  ([hig-activity])
- 5.1.1(iii) prefers it: "Where possible, use the out-of-process picker or a
  share sheet rather than requesting full access to protected resources like
  Photos or Contacts." ([apple-guidelines])
- Sharing can't gate what people paid for: 3.1.2(a) lets subscribers get it
  "without performing additional tasks, such as posting on social media".
  And 3.2.2(x): "Apps must not force users to rate the app, review the app,
  download other apps, or other store-related actions in order to access
  functionality, content, or use of the app. Apps may otherwise incentivize
  users to take specific actions within apps (e.g. completing a level, watching
  an ad)." ([apple-guidelines])
- Images: `NSPhotoLibraryAddUsageDescription` "is required if your app uses APIs
  that have write access to the user's photo library." ([doc-photo-add])
- Synthesis: a text card avoids the photo question; if the card becomes an
  image, add that key or exclude the save-to-photos activity. Nothing in
  Guessling unlocks by sharing.

[hig-activity]: https://developer.apple.com/design/human-interface-guidelines/activity-views

### Haptics rules

- "Make haptics optional. Let people turn off or mute haptics, and make sure
  people can still enjoy your app or game without them." ([hig-haptics])
- "Avoid overusing haptics.", "Use haptics consistently throughout your app or
  game.", and "Use system-provided haptic patterns according to their documented
  meanings." ([hig-haptics])
- Notification haptics "provide feedback about the outcome of a task or action",
  and UIKit's notification generator is there "to indicate successes, failures,
  and warnings" ([hig-haptics]; [doc-feedback]).
- Synthesis: add a haptics switch in Settings. A success haptic suits a solved
  puzzle; a Yes or No isn't a task's success or failure, so a light impact, or
  none, fits the documented meanings better.

### Sound and the silent switch

- "When a device is in silent mode, it plays only the audio that people
  explicitly initiate, like media playback, alarms, and audio/video messaging."
  In silent mode, people "also want to silence nonessential sounds, such as
  keyboard clicks, sound effects, game soundtracks, and other audible feedback."
  ([hig-audio])
- "Choose an audio category that fits the way your app or game uses sound." And:
  "For example, don't make people stop listening to music from another app if
  you don't need to." ([hig-audio])

Apple's table of the two categories a game uses ([hig-audio]):

| Category     | Meaning                                                                                                                                                                          | Behavior                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Solo ambient | "Sound isn't essential, but it silences other audio. For example, a game with a soundtrack."                                                                                     | "Responds to the silence switch. Doesn't mix with other sounds. Doesn't play in the background." |
| Ambient      | "Sound isn't essential, and it doesn't silence other audio. For example, a game that lets people play music from another app during gameplay in place of the game's soundtrack." | "Responds to the silence switch. Mixes with other sounds. Doesn't play in the background."       |

- Solo ambient is "The default audio session category", and with it "activating
  your session will interrupt any other audio sessions which are also
  nonmixable." With ambient, "audio from other apps mixes with your audio.
  Screen locking and the Silent switch (on iPhone, the Ring/Silent switch)
  silence your audio." ([doc-solo-ambient]; [doc-ambient])
- 2.5.9: "Apps that alter or disable the functions of standard switches, such as
  the Volume Up/Down and Ring/Silent switches, or other native user interface
  elements or behaviors will be rejected." ([apple-guidelines])
- For games: "give players the ability to customize parameters like type size,
  game control mapping, motion intensity, and sound balance". On iOS, text
  defaults to "17 pt" with an "11 pt" minimum, and buttons to "44x44 pt" with a
  "28x28 pt" minimum ([hig-games]).
- Synthesis: play the Guessling's sounds in the ambient category, so the silent
  switch mutes them and a player's music keeps playing; the default category
  would stop that music. Add a sound switch next to the haptics switch.

[hig-audio]: https://developer.apple.com/design/human-interface-guidelines/playing-audio
[doc-solo-ambient]: https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/soloambient
[doc-ambient]: https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/ambient
[hig-games]: https://developer.apple.com/design/human-interface-guidelines/designing-for-games

## EU trader status and storefronts

### Digital Services Act trader status

- "Articles 30 and 31 of the Digital Services Act (DSA) require Apple to verify
  and display trader contact information for all traders distributing apps on
  the App Store in the European Union (EU)." And: "Once verified, Apple will
  publish this information on your App Store product page when your app is
  distributed in any of the 27 territories of the EU. Even if you don't
  distribute apps in the EU, you'll still need to declare a trader status."
  ([asc-dsa])
- The status is a self-assessment: "You must assess whether you're a trader for
  EU law purposes." "Apple can't determine whether you're a trader." One factor
  Apple lists is "Whether you make revenue as a result of your app, for example
  if your app includes In-App Purchases, or if it's a paid or ad-sponsored app".
  ([asc-dsa])
- Outside the EU: "If you don't distribute apps on the App Store in the EU (for
  example you only distribute apps through alternative distribution, or
  TestFlight, or on the App Store only outside the EU), you're not acting as a
  trader on the App Store." ([asc-dsa])
- What a trader declares: individuals enter "Address or P.O. Box", "Phone
  number", and "Email address"; for organizations, "The address associated with
  your D-U-N-S Number will automatically display", with a phone number and an
  email address. All traders "provide payment account details" and "certify that
  you only offer products or services that comply with the applicable rules of
  EU law." Apple checks the email and phone with two-factor authentication and
  asks for "a current document that verifies your business name and address"
  ([asc-dsa]).
- Non-traders: "If you're not a trader, consumers in the EU will be informed
  that consumer rights stemming from applicable consumer protection laws won't
  apply to contracts between you and them." ([asc-dsa])
- Without a status, since February 17, 2025, "apps without trader status will be
  removed from the App Store in the European Union until trader status is
  provided and verified, if necessary" ([news-dsa-2025]); updates to EU apps
  have needed a status since October 16, 2024 ([apple-upcoming]).
- Where: under Business, the Agreements tab's Compliance section has "Digital
  Services Act"; per app, App Information has the App Store Regulations and
  Permits section ([asc-dsa]).
- Synthesis: selling Guessling+ in the EU likely makes the team a trader, which
  puts an address, phone number, and email address on EU product pages. No Apple
  page gives a verification time. If verification can't finish before September
  24, declare that the account isn't a trader while it stays outside the EU,
  leave the 27 EU storefronts out, and add them after switching to trader and
  passing verification. EU-based judges and players can't download the app
  meanwhile, since their account's storefront decides where they buy.

### Choosing storefronts for a new app

- "Before submitting your app for review on the App Store, you must set its
  availability. You can release your app in any of the 175 countries or regions
  where the App Store is available, and you can offer your app for pre-order in
  regions where it hasn't yet been published." ([asc-availability])
- The choices are "All Countries or Regions, Specific Countries or Regions, or
  Publish as Pre-Order", and choosing all "will also ensure that your app is
  available in any new countries or regions added to the App Store in the
  future." ([asc-availability])
- "A customer's Apple Account country or region setting determines the App Store
  country or region where they can purchase apps." ([asc-availability])
- Edits "take effect immediately but may require up to 24 hours to be visible to
  all users", and after a storefront is removed, "Users who previously
  downloaded your app from the App Store in that country or region will continue
  to receive app updates." ([asc-availability])
- Subscriptions have their own availability, "in any of 175 countries or
  regions", and "You must be the Account Holder in order to remove countries or
  regions, as this will impact existing subscribers." ([asc-sub-availability])
- Storefronts that hold back a game: China mainland shows "Missing Game
  registration number" without "an approval number and supporting documents from
  China's National Press and Publication Administration", and "ICP Filing Number
  Missing" without a filing number; Brazil shows "Missing Tax Form" without
  Brazilian tax information ([asc-statuses]). Vietnam "requires games to be
  licensed to remain available on the App Store in Vietnam" ([news-vn-games]).
- Synthesis: choose "Specific Countries or Regions". Leave out China mainland
  and Vietnam, which need game licenses; add Brazil once its tax form is in;
  decide the EU by trader verification; and match each subscription's
  storefronts to the app's.

[asc-availability]: https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/manage-availability-for-your-app-on-the-app-store
[asc-statuses]: https://developer.apple.com/help/app-store-connect/reference/app-information/app-and-submission-statuses
[news-vn-games]: https://developer.apple.com/news/?id=06h4gf33

## Dates and changes as of September 22, 2026

- February 17, 2025: EU apps without a trader status are removed
  ([news-dsa-2025]).
- October 29, 2025: offer codes can end without auto-renewal, and promo codes
  for in-app purchases stopped on March 26, 2026 ([news-offer-codes-2025]).
- November 13, 2025: guideline 5.1.2(i) names third-party AI
  ([news-guidelines-nov2025]).
- January 31, 2026: the new age rating answers became required for updates
  ([apple-upcoming]).
- February 6, 2026: guideline 1.2 covers random or anonymous chat
  ([news-guidelines-feb2026]).
- February 24, 2026: 18+ apps need confirmed adults in Australia, Brazil, and
  Singapore ([news-age-feb2026]).
- May 6, June 4, and July 1, 2026: age categories for new accounts in Utah,
  Texas, and Louisiana ([news-age-feb2026]; [news-texas-2026]).
- June 8, 2026: the guidelines and the license agreement are revised
  ([news-guidelines-jun2026]).
- June 18, 2026: Australia's 15+ became 16+, and Vietnam gained regional ratings
  ([news-age-au-vn]).
- September 2026: social media answers are required for new submissions
  ([news-age-social]).
- September 14, 2026: iOS 27 shipped with Time Allowances ([nr-child-safety]).
- September 16, 2026: "multiseat purchases are enabled by default for
  subscriptions in App Store Connect", and Volume Purchasing "launches on
  October 22, 2026" ([news-subs-ios27]). Synthesis: Apple's sources don't cover
  how RevenueCat counts seats, so consider turning this off.
- October 2026: two content descriptors move from All to 12+ in Korea
  ([news-age-korea]).
- October 23, 2026: iPhone Duo goes on sale, and its screenshot uploads come
  "later this year" ([nr-iphone-duo]; [asc-screenshots]).
- April 2027: builds need the iOS 27 SDK ([news-submissions-sep2026]).
- No date yet: required Accessibility Nutrition Labels ([asc-a11y-overview]).

[news-age-au-vn]: https://developer.apple.com/news/?id=yrrb45pw
[news-age-korea]: https://developer.apple.com/news/?id=oj3r9pvw

## Conflicts between sources

- **Active offers.** StoreKit: "You can have up to 10 active offers at a time"
  ([doc-offer-codes]). App Store Connect: "You can have up to 10 active offers
  per subscription SKU at a time" ([asc-offer-codes]).
- **Code limit unit.** App Store Connect says "1 million redemptions per app,
  per quarter" and, on the same page, "up to 1 million codes per quarter, shared
  across all subscriptions" ([asc-offer-codes]); StoreKit says "a limit of
  1,000,000 codes per app, per quarter" ([doc-offer-codes]).
- **Redemption OS versions.** App Store Connect: "iOS 14, iPadOS 14, or macOS
  15, or later" ([asc-offer-codes]), as the [best practices notes][bp-codes]
  quote. StoreKit: "iOS 14.2, iPadOS 14.2, macOS 15.0, and visionOS 1.0"
  ([doc-offer-codes]); the subscriptions page: "iOS 14.2, iPadOS 14.2, and macOS
  15 or later" ([apple-subscriptions]).
- **Sandbox codes.** App Store Connect: "a minimum of 10 and a maximum of 10,000
  codes" per request ([asc-offer-codes]); StoreKit: "Each quarter, you can
  create up to 10,000 codes for testing." ([doc-offer-codes])
- **Larger Text.** The overview: "Increases the text size in the app to 200% or
  more" ([asc-a11y-overview]); the criteria: "at least 200% or the maximum font
  size for the system" ([asc-a11y-larger-text]).
- **Upcoming requirements.** The requirements page lists nothing newer than
  "Since April 28, 2026" ([apple-upcoming]), while news posts set the September
  2026 social media answers and the April 2027 SDK rule ([news-age-social];
  [news-submissions-sep2026]).
- **The idea's service window.** The [idea][idea-schedule] keeps the Worker
  running "through at least October 22"; the Paid Apps Agreement requires "the
  full amount of content to eligible subscribers through the subscription
  duration", which is a year for the yearly plan ([asc-sub-availability]).
- **The idea's privacy label.** The [idea][idea-review] declares "Purchases" and
  the typed questions; Apple's definitions also reach the install ID,
  RevenueCat's user ID, and the play counts ([apple-privacy-details]).
- **iPad.** The [idea's scope][idea-scope] turns "iPad support" off; 2.4.1
  expects iPhone apps to run on iPad ([apple-guidelines]), and the only
  iPhone-only switch found is a required capability ([doc-required-caps]).
- **Codes for judges.** The [idea][idea-money] plans one-time-use codes for a
  few judges; a batch starts at 500 codes ([asc-offer-codes]).

[idea-scope]: /docs/archive/guessling-idea.md#scope-of-the-first-version
[idea-money]: /docs/archive/guessling-idea.md#monetization

## Gaps

- **iPad compatibility.** No Apple page read describes how an iPhone-only app
  looks or behaves on iPad, or which devices App Review uses, and "Required if
  app runs on iPad" isn't defined ([asc-screenshots]). The `UIDeviceFamily`
  reference page returned HTTP 404 on September 22, 2026, so the build settings
  reference stands in ([doc-build-settings]).
- **Offer codes for current subscribers.** When a free month starts for an
  active subscriber is only implied by "next renewal period"
  ([doc-offer-codes]); how a code without renewal works for an active subscriber
  isn't stated; and a trial canceled but not yet ended fits neither "Existing"
  nor "Expired" ([asc-offer-codes]).
- **Rating thresholds.** Apple doesn't define "Infrequent" and "Frequent", say
  whether a solo daily puzzle is a contest, or say whether a Safari view showing
  the team's own policy pages counts as unrestricted web access ([asc-age-ref]).
- **Age assurance duties.** What Texas, Utah, and Louisiana require of
  developers is left to "legal counsel" ([apple-age-qa]), and no Apple source
  covers the Declared Age Range API from Expo.
- **Children's privacy.** Whether a 4+ game that accepts free text owes duties
  under children's privacy statutes is a legal question that 5.1.4 raises but
  doesn't answer ([apple-guidelines]).
- **"Collect" in the guidelines.** 5.1.1(ii) doesn't define "collect", so this
  note borrows the privacy label's definition ([apple-privacy-details]).
- **Server-side vendors.** Apple's "third-party partners" are vendors "whose
  code you've added to your app"; no page addresses a vendor that only the
  backend calls, as with TypeSafe ([apple-privacy-details]).
- **Optional disclosure without accounts.** The "name or account name" criterion
  doesn't say what applies when an app has no accounts
  ([apple-privacy-details]).
- **Accessibility deadline.** No date for required labels ([asc-a11y-overview]).
- **Trader verification time.** No Apple page gives one ([asc-dsa]).
- **Export report.** Apple says a year-end self-classification report "might" be
  required, without saying when ([doc-encryption]).
- **Haptics settings.** The pages read don't say whether the system's haptics
  setting silences UIKit's feedback generators ([hig-haptics]; [doc-feedback]).
- **Saving images from the share sheet.** No page read ties the share sheet's
  save action to `NSPhotoLibraryAddUsageDescription` ([doc-photo-add]).
- **iPhone Duo videos.** The tech talks listed on Apple's iPhone Duo pages
  weren't watched ([doc-iphone-duo]).
- **Multiseat and RevenueCat.** Apple's sources don't cover how RevenueCat
  reports Volume Purchasing or Group Purchases ([news-subs-ios27]).

## See also

- [Best practices notes][bp-apple]: review timing, the first purchase, sandbox
  testing, screenshots, privacy policy basics, Terms of Use, account deletion,
  and offer code basics.
- [Jev notes][jev-store]: TypeSafe's terms, its under-18 statement, and
  guideline 5.1.2(i).
- [Idea][idea-review]: Guessling's design and its review-safety checklist.
- [Context](/docs/CONTEXT.md#apple-app-store-review-essentials): the review
  essentials for any Shipaton app.

[bp-apple]: /docs/research/best-practices.md#apple-app-store-review
[news-age-2025]: https://developer.apple.com/news/?id=ks775ehf
[news-age-social]: https://developer.apple.com/news/?id=tlur8uvi
[asc-age-ref]: https://developer.apple.com/help/app-store-connect/reference/app-information/age-ratings-values-and-definitions
[nr-child-safety]: https://www.apple.com/newsroom/2026/09/apples-new-child-safety-features-now-available/
[idea-review]: /docs/archive/guessling-idea.md#review-safety-checklist
[jev-store]: /docs/research/jev.md#store-review-and-jev
[news-age-feb2026]: https://developer.apple.com/news/?id=f5zj08ey
[apple-guidelines]: https://developer.apple.com/app-store/review/guidelines/
[news-texas-2026]: https://developer.apple.com/news/?id=sg176nne
[apple-age-qa]: https://developer.apple.com/support/age-assurance/
[bp-privacy]: /docs/research/best-practices.md#privacy-policy-privacy-labels-and-terms-of-use
[apple-privacy-details]: https://developer.apple.com/app-store/app-privacy-details/
[news-guidelines-jun2026]: https://developer.apple.com/news/?id=a233fmpw
[news-guidelines-feb2026]: https://developer.apple.com/news/?id=d75yllv4
[news-guidelines-nov2025]: https://developer.apple.com/news/?id=ey6d8onl
[asc-sub-availability]: https://developer.apple.com/help/app-store-connect/manage-subscriptions/set-availability-for-an-auto-renewable-subscription
[idea-schedule]: /docs/archive/guessling-idea.md#schedule-to-september-30
[apple-review]: https://developer.apple.com/distribute/app-review/
[asc-a11y-overview]: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/overview-of-accessibility-nutrition-labels
[asc-a11y-larger-text]: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/larger-text-evaluation-criteria
[bp-codes]: /docs/research/best-practices.md#codes-that-let-judges-unlock-premium
[asc-offer-codes]: https://developer.apple.com/help/app-store-connect/manage-subscriptions/set-up-subscription-offer-codes
[news-offer-codes-2025]: https://developer.apple.com/news/?id=gf6mgrs6
[doc-offer-codes]: https://developer.apple.com/documentation/storekit/supporting-offer-codes-in-your-app
[apple-subscriptions]: https://developer.apple.com/app-store/subscriptions/
[asc-screenshots]: https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications
[doc-build-settings]: https://developer.apple.com/documentation/xcode/build-settings-reference
[doc-required-caps]: https://developer.apple.com/documentation/bundleresources/information-property-list/uirequireddevicecapabilities
[nr-iphone-duo]: https://www.apple.com/newsroom/2026/09/apple-unveils-iphone-duo/
[doc-iphone-duo]: https://developer.apple.com/documentation/technologyoverviews/preparing-your-app-for-iphone-duo
[news-submissions-sep2026]: https://developer.apple.com/news/?id=k1mtkt1k
[doc-encryption]: https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations
[doc-photo-add]: https://developer.apple.com/documentation/bundleresources/information-property-list/nsphotolibraryaddusagedescription
[hig-haptics]: https://developer.apple.com/design/human-interface-guidelines/playing-haptics
[doc-feedback]: https://developer.apple.com/documentation/uikit/uifeedbackgenerator
[asc-dsa]: https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements
[news-dsa-2025]: https://developer.apple.com/news/?id=einwn76m
[apple-upcoming]: https://developer.apple.com/news/upcoming-requirements/
[news-subs-ios27]: https://developer.apple.com/news/?id=likeohx4

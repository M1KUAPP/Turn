# Shipaton 2026 context

The background behind a winning RevenueCat Shipaton 2026 entry: what the
official rules add, what past winners did, what primary sources say about
monetization, store review, listings, retention, and the pitch, and where the
official docs live. The [brief](/docs/BRIEF.md) covers the contest's
requirements, dates, and prizes, so this document links to it instead of
repeating them. Facts come from the research notes in `docs/research/`, which
cite a source for each claim; their web sources were read on September 21, 2026.

Contents:

1.  [Key takeaways](#key-takeaways)
1.  [What the official rules add](#what-the-official-rules-add)
1.  [Past winners](#past-winners)
1.  [What wins each category](#what-wins-each-category)
1.  [Monetization and paywalls](#monetization-and-paywalls)
1.  [Getting through store review](#getting-through-store-review)
1.  [Store listing and discoverability](#store-listing-and-discoverability)
1.  [Retention and push notifications](#retention-and-push-notifications)
1.  [Demo video and write-up](#demo-video-and-write-up)
1.  [Related materials](#related-materials)
1.  [Open questions](#open-questions)
1.  [See also](#see-also)

## Key takeaways

- **The official rules settle several open points.** Winners are announced
  October 21, companies may enter, and the Grand Prize shortlist uses revenue
  "as reported in RevenueCat". See
  [What the official rules add](#what-the-official-rules-add).
- **Ship to the App Store first.** Apple says 90% of submissions are reviewed
  in under 24 hours on average. A new personal Google Play account can't
  finish its test by September 30, and the Galaxy Store needs seller status
  and a supported SDK. See
  [Getting through store review](#getting-through-store-review).
- **Submit the first purchase with the app.** The app version, the
  subscription group, and every subscription go in one draft submission,
  after the Paid Apps Agreement, tax, and banking. See
  [Apple App Store review essentials](#apple-app-store-review-essentials).
- **Monetize from the first build.** Hard paywalls turn a median 10.7% of
  downloads into payers within 35 days, against 2.1% for freemium, and trials
  start on day 0. See [Monetization and paywalls](#monetization-and-paywalls).
- **Revenue gets you shortlisted; the story wins.** Only 10 of the 30 2025
  winners' write-ups gave numbers, and RevenueCat says polish lost to story.
  See [Past winners](#past-winners).
- **Enter categories you can prove.** Sponsor judges rewarded depth: Journeys
  for OneSignal, community and open source for Kotlin, an observable loop for
  Layers. See [What wins each category](#what-wins-each-category).
- **Win the first two minutes of video.** Name the problem and the app within
  15 seconds and show the purchase before 2:00. See
  [Demo video and write-up](#demo-video-and-write-up).
- **Export two screenshot sizes:** the submission's 1179 × 2556 and the App
  Store's 6.9-inch or 6.5-inch set. See
  [Apple App Store review essentials](#apple-app-store-review-essentials).
- **Don't count on an extension.** Past deadlines moved for slow review, but
  only at the last minute. See [Past winners](#past-winners).
- **Let the tools do the setup.** RevenueCat's AI Toolkit and MCP server help
  coding agents integrate the SDK, and the Test Store works before any store
  setup, but its key must never ship. See
  [Related materials](#related-materials).
- **Avoid the policy traps:** in-app account deletion, explicit opt-in for
  promotional pushes, the "Purchases" privacy label, and Google Play's Data
  safety form. See
  [Retention and push notifications](#retention-and-push-notifications).

## What the official rules add

The brief lists the [official rules][rules] as an open question because they
weren't captured. The research read them on Devpost on September 21, 2026.
They're headed "Updated August 31, 2026" and prevail over every other
Shipaton page. What they add or change:

- **Dates.** The Submission Period opens "Friday, July 31, 2026 at 8:00am PDT"
  and closes September 30 at 11:45pm PDT. Judging runs from October 1 to
  "Tuesday, October 13, 2026 at 12:00pm PDT", and "Winners announced: October
  21st 2026", a day before the October 22 in the brief and the live FAQ.
  RevenueCat lists the Shippies ceremony on October 20, 2026 and App Growth
  Annual on October 21, 2026, both in New York.
- **Who can enter.** Organizations, including corporations and limited
  liability companies, may enter through one "Representative". This settles
  the brief's question about companies.
- **Grand Prize shortlist.** It compares total revenue "during the Submission
  Period, as reported in RevenueCat". Synthesis: sales that RevenueCat doesn't
  track don't count.
- **Scoring.** Best App for Galaxy gives "twenty percent (20%)" of its score
  to Galaxy optimization: "foldable-device support, multi-window, or
  device-specific hardware". Ties go to "the tied Submission with the highest
  score in the first applicable criterion".
- **Prize limits.** A project may enter only one Influencer Award, and the
  rules set no other cap; see [Open questions](#open-questions).
- **Travel.** "Only the Grand Prize and 1st Place: #BuildInPublic Award
  include travel and accommodation."
- **Category fields.** The rules ask for the Stripe Project ID, the Replit
  preview URL and username, the OneSignal App ID, the Noise account email, and
  a live Galaxy Store URL, and the Layers installation "must be in place and
  verifiable before judging".
- **Competition.** On September 21, 2026, Devpost showed 26,920 participants,
  and the [2026 project gallery][dp-2026-gallery] already listed submitted
  projects.

More in the [rules notes][rm-rules].

[dp-2026-gallery]: https://revenuecat-shipaton-2026.devpost.com/project-gallery
[rm-rules]: /docs/research/related-materials.md#official-rules-and-devpost-pages

## Past winners

Three past RevenueCat hackathons set the precedent. The brief's
[lessons from past winners](/docs/BRIEF.md#lessons-from-past-winners) name the
headline winners; the [past winners notes](/docs/research/past-winners.md)
cover every placed entry.

| Edition         | Dates on Devpost      | Cash     | Participants | Projects in the gallery |
| --------------- | --------------------- | -------- | ------------ | ----------------------- |
| 2024 Ship-a-ton | Aug 5 – Sep 19, 2024  | $25,500  | 1,672        | 365                     |
| Shipaton 2025   | Jul 31 – Oct 1, 2025  | $355,000 | 51,882       | 813                     |
| Shipyard 2026   | Jan 15 – Feb 12, 2026 | $165,000 | 7,057        | 857                     |

Shipyard was a separate contest built on creator briefs, like the 2026
Influencer Awards, and its apps could ship through TestFlight or Google Play
internal testing instead of the stores.

### Lessons from the winners

- **Revenue builds the shortlist; it doesn't pick the winner.** Payout, the
  2025 Grand Prize, led its write-up with "17,000+ users", "$30,017 revenue",
  and "1750+ paid subscriptions", and had "Shipped v1 in 10 days". Its growth
  began with an influencer co-founder, "our only distribution channel in the
  beginning", before paid ads. RevenueCat's 2026 how-to-win session said:
  "based on the revenue we build a short list of the apps that we then judge
  in the final stage". In 2024, Payout's builder, now a 2026 judge, didn't
  place in the money award with an app that, by the builder's own account,
  made "half of the total revenue".
- **Most winners didn't lead with numbers.** Only 10 of the 30 2025 write-ups
  give user, revenue, or engagement figures; the rest placed on the product,
  the story, or deep use of a sponsor's tool. RevenueCat: "there were apps that
  made really highly polished content that didn't win and there were apps that
  made not super highly polished content that did win. It was more about the
  story".
- **Deadlines moved for slow review.** The 2024 deadline moved by a day, and
  in 2025 by 12 hours because "App Review has been moving a little slower than
  usual this week". Synthesis: plan for slow review, not for an extension.
- **Long videos didn't disqualify, but they gamble on the prescreen.** 12 of
  the 27 timed 2025 winning videos ran past the three minutes judges then had
  to watch. In 2026 that limit is two minutes; see the brief's
  [submission checklist](/docs/BRIEF.md#submission-checklist).
- **Winners filed late with fresh numbers.** 26 of the 30 2025 Devpost pages
  were started between September 28 and October 1, 2025, and Gurwi's team
  waited "to attach the most up to date app metrics and marketing results".
  Editing is allowed until the deadline, so a draft entered early can still
  carry the latest numbers.
- **AI-built apps win, credited openly.** At least 13 of the 30 2025
  write-ups credit AI tools, from Payout's "not one line of code written by
  hand" to Crystal Abyss and MaestLog.
- **First apps can win.** Echo Reminder, ReadHim, Dripped, MaestLog, and Gurwi
  were their builders' first shipped apps.

### Where the winners are now

As of September 21, 2026:

- 28 of the 30 2025 winners are on at least one store, but only five have more
  than 100 US App Store ratings: Payout (11,329), PitchLab (2,064), Shutter
  Declutter (355), Hearing Buddy (131), and Kigaru Talks (128).
- Payout is the outlier. Its builder's site says it "hit $100K MRR in 5
  months" and "has now generated over $1M in revenue", and its Google Play
  listing shows "100K+" downloads.
- All nine 2024 winners are still listed. Of the seven Shipyard winners, only
  Remy Reminders became an app its creator publishes.
- Synthesis: placing didn't guarantee traction; most winners were still small
  a year on.

## What wins each category

What 2026 judges ask for comes from the category pages, summarized in the
brief's [prize table](/docs/BRIEF.md#prizes-and-categories); what worked
comes from past winners and the sponsors' own docs. The lessons drawn from
past winners are synthesis.

### Categories with a precedent

- **Grand Prize.** 2026 rewards "the strongest user traction and growth
  momentum". Payout, the 2025 winner, shipped in days, then kept "A/B testing
  pricing" and targeting "high value keywords", and its write-up quantified
  users, revenue, paid subscriptions, and reach. Synthesis: send every sale
  through RevenueCat, since the shortlist counts only what RevenueCat reports.
- **#BuildInPublic.** 2026: "Audience size does not matter. The quality and
  usefulness of the journey does." Judges check "whether public feedback led
  to changes". Past winners posted daily or nearly daily and showed changes
  that came from the public, such as a slow paywall "flagged by three users".
  Small accounts placed: Tomo Japan's X account had "65+ Followers". What put
  Gurwi "over the edge" was tutorials, an open-sourced implementation, and
  replies encouraging other builders.
- **HAMM.** 2026 wants "a well-crafted paywall, thoughtful pricing and
  packaging, strong conversion, and monetization that genuinely fits the
  product". Winners had a one-line model tied to the app's purpose, such as
  Vector Guard's "1:50 Justice Model", where each subscription funds 50 free
  accounts. Tactics from other winners fit too: a paywall right after sign-up
  "gave us 50 new trials in just one single day" for Gurwi, and Remy Reminders
  paired an onboarding trial with "a 50% off offer" to win back users who
  skipped it.
- **Design.** 2026 looks for "taste, care, and execution" and "A demo video
  that clearly shows the app in motion". Each past winner had one signature
  interaction built on platform frameworks, such as Dayloop's Vision-based
  "Auto Face Alignment" and Flowmino's Screen Time blocking with "gentle
  animations" and "haptics". Five of the six design winners were native Swift
  apps.
- **Peace Prize.** 2026 asks "who the app helps, why the problem matters" and
  for "early evidence of usefulness, adoption, feedback, or real-world
  benefit". All three 2025 winners grew out of the builder's own family.
  Heartbeat Hero and Hearing Buddy kept their core help free, and
  accessibility and offline use were presented as features. Modest evidence
  was enough, such as "dozens of positive comments" on Reddit.
- **Keep Them Coming Back.** 2026 judges "Implementation", "User value",
  "Resourcefulness", and "Depth". The rules: "A single deployed message is
  sufficient for eligibility, but more thoughtful use of the platform may
  receive stronger consideration." 2025's OneSignal winners tied messages to
  the app's core habit, and judges named Journeys, transactional messaging,
  and omnichannel messaging. Voicetree published the most copyable playbook:
  segments keyed to RevenueCat subscription states, "an extended paid trial
  ($5 for the first month)" after a cancelled trial, and a push prompt only
  after "more than 3 sessions".
- **Ship Kotlin Everywhere.** 2026 requires both stores and judges
  "Cross-platform quality — required", with community interaction and giving
  back optional. 2025 winners shared Compose UI but went native where quality
  needed it, such as Momental's audio players, and gave back through open
  source, weekly videos, and community boards. Synthesis: keep both listings
  live through judging; one 2025 winner's Google Play page is gone.
- **Conflict of Interest.** The 2025 precedent, Crystal Abyss, was a small,
  polished SpriteKit puzzle game built with Claude and Codex.
- **Influencer Awards.** Shipyard is the closest precedent: creators chose
  from "the top 10–15" entries, and "Audience Fit (30%)" weighed the most.
  Winners built the brief's core and cut the rest ("We said no to meal
  planning, social features, and community feeds"), answered the creator's
  named pain point, and designed monetization in. Only one, Remy Reminders,
  became an app its creator publishes.

### Categories new in 2026

- **Catvertising.** RevenueCat Ads is a beta that tracks ads served by AdMob
  or another network; it doesn't serve ads. Access is requested from the Ads
  page of the dashboard, and no source says how long it takes, so ask early.
- **Best Game.** There was no game category before. The games that placed
  were Party Animals, third in 2024's money award, picked after market
  research on party games, and Crystal Abyss, 2025's staff award.
- **Next Gen.** There was no student category before, but the 2025 Peace
  Prize winner, Heartbeat Hero, was rebuilt from a "WWDC Swift Student
  Challenge 2024 Distinguished Winner" app.
- **Most Viral App.** Noise is a creator platform for user-generated content
  campaigns: "The minimum daily budget is $50", and nothing is charged until
  creators earn views. Creators need to see the paid features, through a
  public TestFlight link or a shared test login. The closest precedent is
  2025's Buzziest Launch, won by ReadHim.
- **Best App for Galaxy.** Galaxy optimization is 20% of the score. Samsung's
  foldable guidance covers multi-window resizing, aspect ratios, app
  continuity, and Flex mode, and its free Remote Test Lab offers real Galaxy
  devices. RevenueCat supports the Galaxy Store only in some SDKs; see the
  store review section below.
- **Idea to Income.** "Publishing to Google Play is not yet supported" in
  Replit, so Replit apps ship on iOS, which RevenueCat also advises. Replit's
  Agent can create the RevenueCat project and wire up purchases. The "Replit
  preview URL" the rules ask for is undefined, and Replit's development URLs
  "can change each time you reopen the app"; see
  [Open questions](#open-questions).
- **Growth Loop.** The Layers SDK is required "because the loop has to be
  observable to be judged", and the installation must be verifiable before
  judging. Layers Pro is free for entrants "through the end of Shipaton on
  October 1".
- **Funnel Vision.** RevenueCat's advice: "you most likely don't need to
  release a new version of your app at all." Funnels are included in
  RevenueCat Pro and need a connected payment provider, and Stripe Projects
  can provision RevenueCat from the Stripe CLI. The "Stripe Project ID" the
  rules ask for is undefined; see [Open questions](#open-questions).

## Monetization and paywalls

RevenueCat's State of Subscription Apps 2026, the newest edition, covers
"over 115,000 apps" using 2025 data. Its medians show what a new app can
expect:

- **Hard paywalls convert more, sooner.** The median hard-paywall app turns
  10.7% of downloads into paying users within 35 days, against 2.1% for
  freemium, and earns $2.32 per install by day 14, against $0.27. After a
  year, retention on yearly plans is about equal: 27% against 28%.
- **Trials start on day 0.** "Nearly all trial starts happen on Day 0".
  Longer trials convert better: a median 25.5% of trials of 4 days or less
  become paid, 37.4% at 5–9 days, and 42.5% at 17–32 days.
- **Common prices:** "$4.99–$6.99 weekly, $7.99–$9.99 monthly, and
  $29.99–$39.99 yearly". Two-plan paywalls are the most common layout.
- **Early revenue is small.** Across categories, "17.3% hit $1K", and the
  median is "58 days to $1K".

What RevenueCat and the stores ask of a paywall:

- Before a hard paywall, give users "sufficient context about what your app
  offers"; unlock everything with one entitlement, and offer a restore
  option. A freemium paywall should be a prompt users can dismiss.
- RevenueCat's placement examples are the end of onboarding and the moment a
  user tries a paywalled feature. RevenueCat Paywalls are configured
  remotely, so an offer can change without an app update.
- Make the billed amount "the most prominent pricing element" (Apple). State
  the trial length, the renewal price, and how to cancel, and link the Terms
  of Use and the privacy policy. Google Play lists an annual plan shown mainly
  as a monthly price as a violation.
- Judges need a free trial or a promo code (see the
  [submission checklist](/docs/BRIEF.md#submission-checklist)). Apple offer
  codes and Google Play promo codes cover this. Create them once the app is
  live: RevenueCat notes that a never-released app's purchases fail in
  production "even if you download with a code".

For the deadline (synthesis): where revenue counts, as on the Grand Prize
shortlist, a hard or onboarding paywall brings money in before September 30.
A 7-day trial started after September 23 ends after the deadline, so a 3-day
trial or a paid introductory offer shows conversions sooner. Skip A/B tests:
Experiments needs a Pro or Enterprise plan, and a launch week brings little
traffic.

More in the [monetization notes][bp-money].

[bp-money]: /docs/research/best-practices.md#monetization-and-paywall-benchmarks

## Getting through store review

The brief covers [review timing](/docs/BRIEF.md#app-review-timing), account
costs, and common rejections. The stores' own documents add the rules below,
and the [best practices notes](/docs/research/best-practices.md) have the
sources. Synthesis: for a team submitting this week, the App Store is the
realistic first store. A new personal Google Play account can't finish its
required test by September 30, and the Galaxy Store needs commercial seller
status and a supported SDK.

### Apple App Store review essentials

- **Speed.** "On average, 90% of submissions are reviewed in less than 24
  hours", and over 40% of unresolved issues fall under guideline 2.1, App
  Completeness. It's an average, so keep the brief's one-week buffer.
- **First purchase.** Sign the Paid Apps Agreement, then finish tax and
  banking; sandbox testing needs the signed agreement. Put the app version,
  the subscription group, and every subscription in one draft submission:
  "All items submitted together must be Accepted". RevenueCat warns that
  purchases can take 24 hours to work after a first launch.
- **Build.** Since April 28, 2026, uploads must be built with Xcode 26 or
  later, using an iOS 26 SDK.
- **Subscription screen.** Show the subscription's name and duration, the
  full renewal price, and a way to restore purchases. Link the Terms of Use
  and the privacy policy in the app and in the metadata; without a custom
  EULA, Apple's standard EULA applies.
- **Accounts.** An app that creates accounts must let users delete them in
  the app (5.1.1(v)). An app with a social login must also offer a login that
  limits data to name and email, can hide the email, and doesn't track for
  ads (4.8). Sign in with Apple meets this, but 4.8 doesn't name it; see
  [Open questions](#open-questions).
- **Web checkout.** On the US storefront, apps may include buttons and links
  to web purchases (3.1.1(a)). Elsewhere, such links need one of Apple's
  entitlements or aren't allowed.
- **Screenshots.** App Store Connect needs 6.9-inch or 6.5-inch iPhone
  screenshots. The 1179 × 2556 screenshot the Shipaton submission asks for
  is Apple's 6.3-inch size, so prepare both.
- **Privacy label.** With RevenueCat, declare that the app collects
  "Purchases" data.

### Google Play review essentials

- **New personal accounts can't make September 30.** Accounts created after
  November 13, 2023 need at least 12 testers opted in for 14 days, then a
  production access review that "usually takes seven days or less". A test
  started on September 21 reaches 14 days on October 5.
- **Review time.** Some accounts wait "up to seven days or longer", and a
  change sent during a review can push the app "to the back of the app
  review queue".
- **Target API level 36** is required for new apps since August 31, 2026; an
  extension to November 1, 2026 can be requested.
- **Subscriptions.** Disclose the price, billing period, renewal, and trial
  terms, and give an easy way to cancel, such as a link to Google Play's
  subscription center.
- **App content.** Complete the Data safety form (RevenueCat collects
  purchase history). An app that creates accounts must offer deletion in the
  app and through a web link.
- **Testing purchases.** Make testers license testers; other testers are
  charged for real.

### Galaxy Store review essentials

- **Seller status.** Publishing, even a free app, needs commercial seller
  status. Samsung reviews a private seller's request in "about 4 business
  days"; D-U-N-S and bank verification can each take "up to 10 business
  days". Publishing is free.
- **Review.** Pre-Review comes first, and sales begin when it ends; a Device
  Test follows. Give test login and payment details, and don't submit trial
  or beta builds. No Samsung page says how long Pre-Review takes.
- **RevenueCat.** Galaxy Store purchases work only with the Android SDK
  10.7.0 and later and the React Native SDK 10.3.0 and later, and test
  purchases need a physical Galaxy device. RevenueCat's onboarding guide says
  to email your seller address to `rc.onboard@samsung.com` to speed up
  approval.

## Store listing and discoverability

- **Apple fields.** Name and subtitle take up to 30 characters each, keywords
  up to 100 bytes, promotional text up to 170 characters, and the description
  up to 4000. Promotional text changes "without requiring an updated
  submission", which suits launch-week news. Don't repeat the app or company
  name in keywords; both are already searchable.
- **Apple copy.** The first sentence of the description is all users see
  before tapping more; keep prices out of it. With no app preview, the first
  one to three screenshots appear in search results.
- **Custom product pages.** Up to 70 per app, once it's live. Apple reports a
  2.5 percentage point average lift over the 1.6% conversion rate of default
  pages. Synthesis: one page per launch channel is more useful this week than
  an A/B test.
- **Google Play fields.** The name takes 30 characters, the short description
  80, and the full description 4000. A 512 × 512 icon and a 1024 × 500
  feature graphic are required, with at least two screenshots; Google
  recommends four at 1080 px or more. A preview video should show the app "as
  early as possible within the first 10 seconds".
- **Google Play policy.** Keep prices, promotions, rankings, and emojis out of
  the listing, and words like "Free" and "No Ads" out of the title.
- **Galaxy Store.** RevenueCat's guide lists the required metadata, including
  a 512 × 512 icon and 4 to 8 screenshots at a 2:1 ratio. English must be the
  default language when publishing to two or more countries.

More in the [listing notes][bp-listing].

[bp-listing]: /docs/research/best-practices.md#store-listing-and-discoverability

## Retention and push notifications

These rules matter most for Keep Them Coming Back, the OneSignal category;
see [what wins each category](#what-wins-each-category).

- **Apple 4.5.4.** Push can't be required for the app to work. Promotional
  pushes need explicit opt-in through consent language in the app, plus an
  in-app way to opt out. Apple's design guidelines add: never send marketing
  as Time Sensitive.
- **Ask after value.** The iOS system prompt can be shown once, Android's
  twice. OneSignal calls prompting on first launch "the single biggest cause
  of low opt-in rates". Start iOS users on provisional notifications, which
  arrive quietly without a prompt, and use a soft prompt, which can be shown
  again, before the system one.
- **Journeys.** OneSignal's playbook starts with a welcome journey, then a
  trial-to-paid journey: "Time pressure beats discount", and exit on
  conversion. Its starting cadence is one message a day for the first 3
  days, then one every 2–3 days.
- **RevenueCat integration.** It keeps subscription tags current in
  OneSignal. Set the OneSignal External ID and pass it to RevenueCat.
- **Billing failures.** Nearly a third of Google Play cancellations are
  involuntary billing failures, against 14% on the App Store. Turn on Apple's
  Billing Grace Period.

More in the [push notes][bp-push].

[bp-push]: /docs/research/best-practices.md#retention-and-push-notifications

## Demo video and write-up

The brief has RevenueCat's [pitch advice](/docs/BRIEF.md#pitch-the-submission).
Devpost's own guidance agrees on most points:

- Say what the app does, and how it fits the hackathon, "in the first few
  seconds": judges watch many videos back to back.
- Write a script, rehearse, and show the app working instead of a marketing
  video. Devpost suggests an emulator; Shipaton wants the app running on a
  device, and its rules govern.
- Uploads can take "several hours or more". Make the video public or
  unlisted; one participant's tip is to mark it "Not for Kids" on YouTube so
  judges can play it.
- Judges look for video and text that complement each other, and for
  entries "clearly considering the judging criteria".

Mapped to Shipaton (synthesis):

- State the problem and the app within 15 seconds, and finish the purchase
  or ad flow before 2:00.
- Put numbers and setup details in the write-up, organized by Shipaton's
  list: problem, audience, money, difference, and categories.
- Upload the final video by September 28, then keep editing the text until
  the deadline.
- Reuse the device recording for a 15 to 30 second App Store preview and a
  Google Play video.

More in the [pitch notes][bp-pitch].

[bp-pitch]: /docs/research/best-practices.md#demo-video-and-write-up

## Related materials

These are the documents a team is most likely to need; the
[related materials notes](/docs/research/related-materials.md) list many
more, with the key facts from each. All links were checked on
September 21, 2026.

### RevenueCat setup and tools

- [SDK quickstart][rc-quickstart] and [Zero to Ship][rc-start] go from
  installing the SDK to a first shipped subscription, with hands-on
  [codelabs][rc-codelabs]. Append `.md` to any RevenueCat docs URL to get a
  clean Markdown copy for coding agents.
- The latest SDKs on September 21, 2026: purchases-ios 5.90.2,
  purchases-android 10.22.1, react-native-purchases 10.10.1 (also used by
  Expo), purchases-flutter 10.13.1, and purchases-kmp 3.9.0.
- The [Test Store][rc-test-store] comes with every new project, so purchases
  work before any store setup. Never ship its key: "Using a Test Store API key
  in production will crash your app."
- Before review, work through the [launch checklist][rc-launch] and the
  [App Store rejections][rc-rejections] guide.
- "Charts show production data only" ([charts][rc-charts]), so test purchases
  never reach the numbers you screenshot. The project ID the submission asks
  for is under Project settings, General settings, and in the dashboard URL.
- The [AI Toolkit][rc-ai-toolkit] installs RevenueCat skills for coding
  agents and configures the [MCP server][rc-mcp]. In Claude Code, run
  `claude plugins marketplace add RevenueCat/ai-toolkit`, then
  `claude plugins install revenuecat`.

[rc-quickstart]: https://www.revenuecat.com/docs/getting-started/quickstart
[rc-start]: https://revenuecat.github.io/start/
[rc-codelabs]: https://revenuecat.github.io/
[rc-test-store]: https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store
[rc-launch]: https://www.revenuecat.com/docs/test-and-launch/launch-checklist
[rc-rejections]: https://www.revenuecat.com/docs/test-and-launch/app-store-rejections
[rc-charts]: https://www.revenuecat.com/docs/dashboard-and-metrics/charts
[rc-ai-toolkit]: https://www.revenuecat.com/docs/tools/ai-toolkit
[rc-mcp]: https://www.revenuecat.com/docs/tools/mcp

### Programs behind the 2026 categories

- **Catvertising:** [Ad Monetization][rc-ads], RevenueCat's beta for
  tracking ad revenue.
- **Funnel Vision:** [Funnels][rc-funnels] and the
  [Stripe Projects quickstart][rc-stripe-projects], which provisions
  RevenueCat with `stripe projects add revenuecat/app`.
- **Best App for Galaxy:** RevenueCat's
  [Galaxy onboarding guide][rc-galaxy-onboarding], Samsung's
  [foldable guidance][sam-foldables], and the free
  [Remote Test Lab][sam-rtl].

[rc-ads]: https://www.revenuecat.com/docs/ad-monetization
[rc-funnels]: https://www.revenuecat.com/docs/tools/funnels
[rc-stripe-projects]: https://www.revenuecat.com/docs/getting-started/stripe-projects-quickstart
[rc-galaxy-onboarding]: https://www.revenuecat.com/docs/platform-resources/galaxy-platform-resources/galaxy-store-onboarding
[sam-foldables]: https://developer.samsung.com/foldables-and-largescreens
[sam-rtl]: https://developer.samsung.com/remote-test-lab

### Store documentation

- **Apple:** the [App Review Guidelines][apple-guidelines], last updated June
  8, 2026; [App Review][apple-app-review] for review times and expedited
  review; [screenshot specifications][asc-screenshots];
  [TestFlight][asc-testflight]; and [sandbox testing][asc-sandbox].
- **Google Play:**
  [testing requirements for new personal accounts][gp-testing-reqs],
  [publishing and review times][gp-publish], and [subscriptions][gp-subs].
- **Galaxy Store:** [getting started][sam-prepare] with seller status, the
  [App Distribution Guide][sam-distribution], and the [FAQ][sam-faq].

[apple-guidelines]: https://developer.apple.com/app-store/review/guidelines/
[apple-app-review]: https://developer.apple.com/distribute/app-review/
[asc-screenshots]: https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications
[asc-testflight]: https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview
[asc-sandbox]: https://developer.apple.com/help/app-store-connect/test-in-app-purchases/overview-of-testing-in-sandbox
[gp-testing-reqs]: https://support.google.com/googleplay/android-developer/answer/14151465
[gp-publish]: https://support.google.com/googleplay/android-developer/answer/9859751
[gp-subs]: https://support.google.com/googleplay/android-developer/answer/140504
[sam-prepare]: https://developer.samsung.com/galaxy-store/prepare.html
[sam-distribution]: https://developer.samsung.com/galaxy-store/distribution-guide.html
[sam-faq]: https://developer.samsung.com/galaxy-store/faq.html

### Sponsor documentation

- **JetBrains:** a [Kotlin Multiplatform starter guide][jb-starter] written
  for Shipaton. JetBrains offers entrants free access to the EAP version of
  its Junie CLI agent.
- **Noise:** [getting started][noise-start] takes four steps: billing, a
  playbook, campaign images, and the first campaign.
- **Replit:** [build a mobile app][replit-mobile-app] with Agent, then
  [add RevenueCat payments][replit-payments].
- **OneSignal:** [mobile SDK setup][os-sdk-setup]. The App ID is under
  Settings > Keys & IDs, and the [RevenueCat integration][os-revenuecat]
  syncs subscription tags.
- **Layers:** [SDK setup][layers-sdk], with the App ID under Connections, and
  the [Shipaton offer][layers-shipaton].
- **Stripe:** the [Stripe Projects CLI][stripe-projects]; run
  `stripe projects list` to see project IDs.

[jb-starter]: https://kotlinlang.org/docs/multiplatform/shipathon-starter-guide.html
[noise-start]: https://getnoise.com/docs/getting-started
[replit-mobile-app]: https://docs.replit.com/build/mobile-app
[replit-payments]: https://docs.replit.com/build/mobile-payments
[os-sdk-setup]: https://documentation.onesignal.com/docs/en/mobile-sdk-setup
[os-revenuecat]: https://documentation.onesignal.com/docs/en/revenuecat
[layers-sdk]: https://layers.com/docs/sdk
[layers-shipaton]: https://layers.com/shipaton/
[stripe-projects]: https://docs.stripe.com/projects

### Influencer Award creators

For audience research only: the rules bar using a creator's name, likeness,
or brand without "express written consent".

| Award                      | Creator            | YouTube                          | Brief video          |
| -------------------------- | ------------------ | -------------------------------- | -------------------- |
| Productivity               | Christopher Lawley | [@ChrisLawley][yt-lawley]        | [Video][vid-lawley]  |
| Nutrition & Healthy Eating | Abbey Sharp        | [@AbbeySharpRD][yt-abbey]        | [Video][vid-abbey]   |
| Yoga & Fitness             | Simone Sharice     | [@SIMONESHARICE][yt-simone]      | [Video][vid-simone]  |
| Career Coaching            | Leadership Heather | [@LeadershipHeather][yt-heather] | [Video][vid-heather] |
| Gaming                     | Lewis Blogs Gaming | [@LewisBlogsGaming][yt-lewis]    | [Video][vid-lewis]   |

[yt-lawley]: https://www.youtube.com/@ChrisLawley
[yt-abbey]: https://www.youtube.com/@AbbeySharpRD
[yt-simone]: https://www.youtube.com/@SIMONESHARICE
[yt-heather]: https://www.youtube.com/@LeadershipHeather
[yt-lewis]: https://www.youtube.com/@LewisBlogsGaming
[vid-lawley]: https://www.youtube.com/watch?v=hz-eZBMxots
[vid-abbey]: https://www.youtube.com/watch?v=iDVQ6mShT6M
[vid-simone]: https://www.youtube.com/watch?v=vZwrxAbGtNo
[vid-heather]: https://www.youtube.com/watch?v=x5mc6Vxem2k
[vid-lewis]: https://www.youtube.com/watch?v=ZNMnK-Y523g

### Past-edition pages

| Edition         | Winners post                                   | Devpost gallery                |
| --------------- | ---------------------------------------------- | ------------------------------ |
| 2024 Ship-a-ton | [2024 Ship-a-ton Winners][past-2024-winners]   | [Gallery][dp-2024-gallery]     |
| Shipaton 2025   | [Shipaton 2025 Winners][past-2025-winners]     | [Gallery][dp-2025-gallery]     |
| Shipyard 2026   | [Shipyard 2026 winners][past-shipyard-winners] | [Gallery][dp-shipyard-gallery] |

[past-2024-winners]: https://www.revenuecat.com/blog/company/2024-ship-a-ton-winners
[past-2025-winners]: https://www.revenuecat.com/blog/company/shipaton-2025-winners
[past-shipyard-winners]: https://www.revenuecat.com/blog/company/shipyard-2026-winners
[dp-2024-gallery]: https://revenuecat-ship-a-ton.devpost.com/project-gallery
[dp-2025-gallery]: https://revenuecat-shipaton-2025.devpost.com/project-gallery
[dp-shipyard-gallery]: https://revenuecat-shipyard-2026.devpost.com/project-gallery

## Open questions

The research left these open. Ask `shipaton@revenuecat.com` or the Discord
before relying on an answer; the brief's
[open questions](/docs/BRIEF.md#open-questions) list more.

- **Prize limits.** The rules limit a project to one Influencer Award and set
  no other cap, but JetBrains's page says "a single app can take home
  one overall award". Safe default: enter every category that fits, and
  expect at most one prize.
- **Stripe Project ID.** Funnel Vision asks for it, and no Shipaton source
  defines it. It most likely means the ID that `stripe projects list` prints
  for the Stripe project that provisioned RevenueCat. Safe default: confirm
  with the organizers.
- **Replit preview URL.** Idea to Income asks for it, but neither the rules
  nor Replit define it, and Replit's development URLs can change each time
  the app reopens. Safe default: also give the App Store link, and ask which
  URL judges want.
- **Funnel Vision checkout.** The rules want "Stripe as the checkout
  provider", but no source says whether a RevenueCat Billing funnel, which
  runs on Stripe, counts, or over what period payment volume is measured.
  Safe default: ask, and report volume from launch to the deadline.
- **Sign in with Apple.** The brief's source calls it a requirement whenever
  an app offers third-party login, while guideline 4.8 asks only for an
  equivalent private login. Safe default: add Sign in with Apple.
- **Expedited review.** Apple allows it for an event "you're directly
  associated with", but RevenueCat's guidance is not to use it for Shipaton.
  Safe default: don't plan on it.
- **Dismissing a hard paywall.** RevenueCat's guide says users shouldn't be
  able to dismiss one; Google Play lists a missing or hidden dismiss button as
  a violation when users could use the app without subscribing. Safe default:
  on Google Play, show a clear dismiss button whenever any part of the app is
  free.
- **Galaxy seller type.** RevenueCat's guide says to register as a Corporate
  Seller with a D-U-N-S number, but Samsung also accepts private sellers. Safe
  default: apply through whichever route you can finish fastest.
- **Organization accounts on Google Play.** The 14-day test rule names only
  personal accounts, and no Google page states the rule for organizations,
  which need a D-U-N-S number. Safe default: don't rely on the difference.
- **RevenueCat Ads access.** No source says how long access takes. Safe
  default: request it now if you're entering Catvertising.
- **Past winners' figures.** Traction numbers in past write-ups are
  self-reported and unaudited. Safe default: treat them as claims, not
  benchmarks.

## See also

- [Brief](/docs/BRIEF.md): what Shipaton 2026 requires, its dates, prizes,
  and judging.
- [Official rules][rules]: the binding terms, on Devpost.
- [Past winners notes](/docs/research/past-winners.md): every placed entry of
  the 2024 Ship-a-ton, Shipaton 2025, and Shipyard 2026, with sources.
- [Best practices notes](/docs/research/best-practices.md): store review,
  monetization, listing, push, and pitch guidance, with sources.
- [Related materials notes](/docs/research/related-materials.md): checked
  links to RevenueCat, store, and sponsor docs, and the rules in detail.
- [Shipaton 2026 notes](/docs/research/shipaton-2026.md): the cited notes
  behind the brief.

[rules]: https://revenuecat-shipaton-2026.devpost.com/rules

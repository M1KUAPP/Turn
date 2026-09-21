# RevenueCat Shipaton 2026 brief

What a team needs to know to enter RevenueCat Shipaton 2026. Every fact here is
condensed from the captures in `docs/sources/`, and the
[research notes](/docs/research/shipaton-2026.md) cite the source of each one.

Contents:

1.  [At a glance](#at-a-glance)
1.  [Key dates](#key-dates)
1.  [Eligibility](#eligibility)
1.  [Submission checklist](#submission-checklist)
1.  [Judging process](#judging-process)
1.  [Prizes and categories](#prizes-and-categories)
1.  [Rules to watch](#rules-to-watch)
1.  [Resources and perks](#resources-and-perks)
1.  [Lessons from past winners](#lessons-from-past-winners)
1.  [Winning playbook](#winning-playbook)
1.  [See also](#see-also)

## At a glance

- **What:** RevenueCat's global mobile hackathon, "all about shipping a ton".
  It runs online, with optional in-person (IRL) events around the world.
  Registration and submission happen on Devpost.
- **The challenge:** ship a brand-new app to the App Store, Google Play Store,
  or, new this year, the Samsung Galaxy Store, first released between August
  1 and September 30, 2026. The RevenueCat SDK must power at least one in-app
  or web purchase, or serve ads through RevenueCat Ads.
- **Platforms:** iOS, iPadOS, macOS, or Android. Web apps are not eligible.
- **Deadline:** Wednesday, September 30, 2026 at 11:45 PM Pacific Time.
- **Prizes:** over $700,000 in cash across 21 categories (the Shipaton site
  says "$740k+"), led by a $100,000 Grand Prize. Most first places also get a
  Times Square billboard, a Shippy trophy, and travel to, or an invitation to,
  App Growth Annual in New York City.
- **Winners:** announced October 22, 2026.
- **Contact:** `shipaton@revenuecat.com`, or the official Shipaton Discord.

## Key dates

| Date                                      | Milestone                                                       |
| ----------------------------------------- | --------------------------------------------------------------- |
| August 1 to September 30, 2026            | Event window; the app's first store release must fall inside it |
| September 23, 2026                        | Latest recommended date to submit the app for store review      |
| September 30, 2026, 11:45 PM Pacific Time | Final Devpost submission deadline                               |
| October 1, 2026                           | Judging starts with intake filtering                            |
| October 8–9, 2026                         | Final winner selection                                          |
| October 22, 2026                          | Winners announced                                               |
| October 2026                              | App Growth Annual in New York City; no exact date is published  |

- September 23 is derived from the advice to submit for review "at least one
  week before the Shipaton deadline".
- The FAQ warns that the deadline "may vary slightly depending on your
  country or time zone", so check it in your local time.
- The judging dates come from the "How we judge Shipaton" post, which says
  "This process is subject to change".

## Eligibility

### Who may enter

- Individuals and teams of any size can enter, but only one team member is
  flown to New York for an eligible prize.
- US law or your local laws may bar you from competing or receiving a prize.
  New this year, residents of Quebec and Brazil may take part. Residents of
  Cuba, Iran, North Korea, Crimea, and Russia "may be excluded from
  participation or prize eligibility".
- Minors, and teams that include a minor, may compete only for the Next Gen
  Award. Students must be at least 13, and a parent or legal guardian must
  accept the official rules and sign a consent form before a minor can be
  announced as a winner.
- Next Gen is for active students aged 13 and older with a verifiable
  academic email address (`.edu` or equivalent). They submit a demo video and
  a public open-source repository with a license instead of a store listing,
  so no paid developer account is needed. Students who are adults may enter
  Next Gen and another category if they meet the requirements of both.
- RevenueCat and sponsor employees take part through the non-cash Conflict of
  Interest Award, not the standard cash prizes.

### Which apps qualify

- The app's first public store release must fall between August 1 and
  September 30, 2026. Updates to previously released apps don't qualify.
- A launch on a second store doesn't count if the app was already live on
  another store. A project that only existed on the web may enter with its
  first store release inside the window.
- Building and promoting before August 1 is fine; publishing to a store before
  then makes the app ineligible.
- The app must be live on the store. An app still in review doesn't qualify,
  and a TestFlight or testing-track build doesn't count.
- The app must be downloadable in the United States, work as shown in the
  video and description, and everything submitted must be in English.
- You can submit more than one app, but each entry must be "unique and
  substantially different".

## Submission checklist

The 2026 submission guide lists nine items and warns that "missing any of them
will make your app not eligible for judging":

1.  A project name and a short tagline.
2.  A description of the app: the problem, who it is for, what it lets them
    do, how it makes money, what makes it different, and which categories you
    target and why. Don't let AI write the whole description.
3.  A public App Store, Google Play, Mac App Store, or Galaxy Store URL that
    works in the US.
4.  A public YouTube or Vimeo demo video; unlisted is fine, private is not.
    Keep the essential footage within 2 minutes, because judges are not
    required to watch beyond two minutes. Show the app running on its device,
    including the purchase or ad flow. Leave out copyrighted music and
    third-party trademarks unless you have permission to use them.
5.  A 1024 × 1024 app icon.
6.  At least one 1179 × 2556 screenshot without a device frame.
7.  Your RevenueCat project ID, found under Project settings in the RevenueCat
    dashboard.
8.  A free trial or a promo code, so judges can test all premium features.
9.  Category-specific links, IDs, metrics, or explanations for every category
    you select.

Also:

- Intake checks for a valid bundle ID or package name, which RevenueCat uses
  to confirm the SDK integration.
- The Devpost form has five sections: Manage team, Project overview, Project
  details, Additional info, and Submit. Add every teammate before the
  deadline.
- You're only done when Devpost shows "Submitted" and 5/5 steps done; a saved
  draft doesn't count. Submitting early doesn't lock the entry, so you can keep
  editing until the deadline.

### App review timing

- App review "usually takes a few business days", and longer after a
  rejection. Submit the app for review at least one week before the deadline.
- Apple can take up to 24 hours to show an approved app in the App Store, so
  aim to be live a day or two before the deadline.
- New personal Google Play accounts created after Nov 13, 2023 must run a
  closed test with at least 12 testers for 14 days before they can apply for
  production access. The Discord channel `#looking-for-google-play-tester`
  helps find testers.
- Developer accounts cost $99 per year for Apple and a one-time $25 for Google
  Play. Organization accounts may need a D-U-N-S number.
- If there isn't time for two reviews, ship monetization in the first build,
  and test purchases in the sandbox first.
- RevenueCat's official guidance is not to use expedited review.
- Avoid common rejections: a privacy policy that matches your privacy
  declaration, Terms of Use links for subscriptions, no "beta" or "number 1"
  claims, a reviewer account without 2FA or an active entitlement, and Sign in
  with Apple whenever the app offers Google or other third-party sign-in.
- Don't restart a review for a minor improvement. Apple doesn't promise to
  review in the order received, and new changes on Google Play can push the
  app to the back of the queue.

## Judging process

The 2026 "How we judge Shipaton" post describes four stages, and notes that
"This process is subject to change":

1.  **Intake filtering, October 1.** Entries are exported from Devpost and
    checked for a store link, a valid bundle ID or package name, answers to
    all required fields, a video, and the icon and screenshots needed for
    Times Square. "a lot of project submissions get filtered out at this
    point."
2.  **Prescreening.** At least two RevenueCat screeners score each entry from
    1 to 5 in every category it targets, after watching the first 2 minutes of
    video and reading the submission. They don't have to download the app.
3.  **Judge scoring.** Judges read the whole description, watch at least two
    minutes of video, review every screenshot, and score each category from 1
    to 5. Downloading the app is encouraged but not required. Each judge
    nominates top apps per category, and "close to 100 apps" reach the final
    round.
4.  **Final selection, October 8–9.** RevenueCat, or the category's sponsor,
    picks first, second, and third place from the nominees. At least one
    RevenueCat developer advocate downloads the app to confirm it matches what
    the video shows.

What this means for an entry:

- There is no early judging, because entries can change until the deadline.
- A category whose questions you leave blank is not judged for your app.
- The first two minutes of video carry the prescreen: the elevator pitch, the
  app in use, and how and why it targets each category. "don't try to jam
  your app into every prize category."
- For the Grand Prize, revenue is used for the shortlist, "but it does not
  decide the winner". Show what you did after launch, with numbers.
- No category weights or tie-breakers are published; Devpost points to the
  official rules for the "full judging criteria".
- The site lists 30 judges: RevenueCat staff, sponsor leaders, indie
  developers, creators, and past winners such as Connor Burd, whose Payout won
  the 2025 Grand Prize. Which judge covers which category is not disclosed.

## Prizes and categories

- **Grand Prize:** $100,000, a trip to New York City for the Shippies award
  ceremony and App Growth Annual, a Times Square billboard, a Shippy trophy, a
  blog post, and a media spotlight on 9to5Mac and 9to5Google.
- **Other first places:** cash plus an invitation to App Growth Annual, a
  Times Square billboard, a Shippy trophy, a blog post, and the media
  spotlight. The #BuildInPublic first place gets travel instead of an
  invitation.
- **Second and third places:** cash and a blog post featuring the winners.
- **Entering:** every eligible project can be considered for the Grand Prize.
  Choose other categories in the Devpost "Additional info" step and answer
  each one's questions. Pick the categories that fit, with at most one
  Influencer Award per project. Sponsor categories need a working
  integration: "A technology tag on its own won't qualify."

| Category                                | Presenter          | Cash: 1st / 2nd / 3rd                                             | What it takes                                                           |
| --------------------------------------- | ------------------ | ----------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [Grand Prize][cat-grand]                | RevenueCat         | $100,000 (one winner)                                             | The strongest user traction and growth momentum, shown with numbers     |
| [#BuildInPublic][cat-bip]               | RevenueCat         | $30,000 / $20,000 / $10,000                                       | The most useful public build journey; link posts tagged `#Shipaton`     |
| [HAMM][cat-hamm]                        | RevenueCat         | $20,000 / $10,000 / $5,000                                        | The smartest use of RevenueCat to drive revenue: paywall and pricing    |
| [Catvertising][cat-cat] (new)           | RevenueCat         | $20,000 / $10,000 / $5,000                                        | The most creative and effective use of RevenueCat Ads                   |
| [Design][cat-design]                    | RevenueCat         | $20,000 / $10,000 / $5,000                                        | Craft, taste, and execution, separate from business viability           |
| [Peace Prize][cat-peace]                | RevenueCat         | $20,000 / $10,000 / $5,000                                        | The strongest social good, with early evidence of impact                |
| [Best Game][cat-game] (new)             | RevenueCat         | $20,000 / $10,000 / $5,000                                        | A fun, polished game with monetization that fits the genre              |
| [Next Gen][cat-next-gen] (new)          | RevenueCat         | $20,000 / $10,000 / $5,000                                        | The best student app: video plus an open-source repo with a license     |
| [Productivity][cat-lawley]              | Christopher Lawley | $20,000 / $10,000 / $5,000                                        | One fast, focused place for snippets, images, files, and documents      |
| [Nutrition & Healthy Eating][cat-abbey] | Abbey's Kitchen    | $20,000 / $10,000 / $5,000                                        | Meals built on the Hunger Crushing Combo; no calorie or macro tracking  |
| [Yoga & Fitness][cat-simone]            | Simone Sharice     | $20,000 / $10,000 / $5,000                                        | A personalized daily wellness plan                                      |
| [Career Coaching][cat-heather]          | Leadership Heather | $20,000 / $10,000 / $5,000                                        | A "flight simulator for hard conversations" for new managers            |
| [Gaming][cat-lewis]                     | Lewis Blogs Gaming | $20,000 / $10,000 / $5,000                                        | A gaming bucket list: add, complete, rate, and share games              |
| [Ship Kotlin Everywhere][cat-kotlin]    | JetBrains          | $15,000 / $10,000 / $5,000                                        | A Kotlin or Compose Multiplatform app live on App Store and Google Play |
| [Most Viral App][cat-noise]             | Noise              | $15,000 / $10,000 / $5,000                                        | Viral, scalable content that converts, with Noise in the growth plan    |
| [Best App for Galaxy][cat-galaxy]       | Samsung            | No cash; first-place perks plus 3 weeks of Galaxy Store featuring | A Galaxy-optimized app published on the Galaxy Store                    |
| [Idea to Income][cat-replit]            | Replit             | $15,000 / $10,000 / $5,000                                        | Built with Replit; week-over-week revenue growth; three build posts     |
| [Keep Them Coming Back][cat-onesignal]  | OneSignal          | $25,000 / $15,000 / $5,000                                        | A working OneSignal integration and campaign that brings users back     |
| [Growth Loop][cat-layers]               | Layers             | $15,000 / $10,000 / $5,000                                        | A tested, measured growth loop, with the Layers SDK installed           |
| [Funnel Vision][cat-stripe]             | Stripe             | $15,000 / $10,000 / $5,000                                        | Web payment volume through a live RevenueCat Funnels and Stripe funnel  |
| [Conflict of Interest][cat-coi]         | RevenueCat         | No cash; blog post and billboard                                  | The best app from RevenueCat or sponsor employees                       |

- Amounts follow the Devpost prize list, which Devpost calls "the official
  details of prizes". Its summary promises "$20,000" to the first place of
  every other category, but the list pays $15,000 in five sponsor categories
  and no cash for Best App for Galaxy, which has a single winner.
- The five Influencer Awards are fixed product briefs for each creator's
  audience. Building for that audience doesn't allow you to use the creator's
  name, image, voice, logo, or likeness.
- Every category page says: "Check DevPost for official, up-to-date prizes."

[cat-grand]: /docs/sources/www.shipathon.com/[]-categories-grand-prize.md
[cat-bip]: /docs/sources/www.shipathon.com/[]-categories-build-in-public-award.md
[cat-hamm]: /docs/sources/www.shipathon.com/[]-categories-hamm-award.md
[cat-cat]: /docs/sources/www.shipathon.com/[]-categories-catvertising-award.md
[cat-design]: /docs/sources/www.shipathon.com/[]-categories-revenuecat-design-award.md
[cat-peace]: /docs/sources/www.shipathon.com/[]-categories-revenuecat-peace-prize.md
[cat-game]: /docs/sources/www.shipathon.com/[]-categories-best-game-award.md
[cat-next-gen]: /docs/sources/www.shipathon.com/[]-categories-next-gen-award.md
[cat-lawley]: /docs/sources/www.shipathon.com/[]-categories-christopher-lawley.md
[cat-abbey]: /docs/sources/www.shipathon.com/[]-categories-abbey-sharp.md
[cat-simone]: /docs/sources/www.shipathon.com/[]-categories-simone-sharice.md
[cat-heather]: /docs/sources/www.shipathon.com/[]-categories-leadership-heather.md
[cat-lewis]: /docs/sources/www.shipathon.com/[]-categories-lewis-blogs.md
[cat-kotlin]: /docs/sources/www.shipathon.com/[]-categories-ship-kotlin-everywhere.md
[cat-noise]: /docs/sources/www.shipathon.com/[]-categories-most-viral-app.md
[cat-galaxy]: /docs/sources/www.shipathon.com/[]-categories-best-app-for-galaxy.md
[cat-replit]: /docs/sources/www.shipathon.com/[]-categories-replits-idea-to-income.md
[cat-onesignal]: /docs/sources/www.shipathon.com/[]-categories-keep-them-coming-back-award.md
[cat-layers]: /docs/sources/www.shipathon.com/[]-categories-growth-loop-award.md
[cat-stripe]: /docs/sources/www.shipathon.com/[]-categories-funnel-vision-award.md
[cat-coi]: /docs/sources/www.shipathon.com/[]-categories-conflict-of-interest-award.md

## Rules to watch

- Read the [official rules](https://revenuecat-shipaton-2026.devpost.com/rules)
  before submitting. They govern eligibility, deadlines, and legal terms. The
  captured sources say nothing about IP ownership, taxes, or disqualification,
  so check those there.
- The demo video carries at most 2 minutes of essential footage, is public or
  unlisted on YouTube or Vimeo, and has no third-party trademarks or
  copyrighted music unless you have permission to use them.
- For the Influencer Awards, "do not use the likeness or brand of the
  influencers". Get express written consent before using a creator's name,
  image, voice, logo, or likeness in the product, store listing, or
  marketing.
- Everything you submit must be in English, or come with an English
  translation.
- AI-built apps are welcome ("Any AI tool. Any app idea. Just ship it."), but
  "don't let AI write your whole description."
- Enter a sponsor category only once the integration works and you have every
  detail it asks for.
- The app must work as the video shows; a RevenueCat developer advocate checks
  before the winners are final.
- Winners' app icons and a screenshot are used in marketing, including the
  Times Square billboard, and demo videos become public when the winners are
  published.
- Prize money is sent directly to the winner's bank account. Attending in New
  York is not required: you may send someone on your behalf or receive the
  award and prize fully remotely.

## Resources and perks

- **Ship Kit:** 28 sponsor perks, most of which unlock at five milestones:
  registration complete, RevenueCat project created, first test purchase,
  first store API call, and first real purchase. RevenueCat tracks progress
  and emails each perk. Allow 3 to 5 business days after registering; after 7
  days, write to `shipkit@revenuecat.com` or ask in `#shipkit-support` on
  Discord. Examples: no Paddle fees on your first $100k in transaction volume,
  500 Codemagic build minutes per month, $250 in Stripe credits, and $100 in
  Sentry credits.
- **Builder resources:** the "Zero to Ship" quest at
  https://revenuecat.github.io/start/, the RevenueCat SDK quickstart and
  codelabs, docs for Android, iOS, React Native with Expo, Kotlin
  Multiplatform, and Flutter, and the AI Toolkits for RevenueCat SDK at
  https://github.com/RevenueCat/ai-toolkit, which help coding assistants
  integrate RevenueCat correctly.
- **#ShipatonSale:** a directory of 42 community deals on tools and services,
  each with its own dates. Examples for the final stretch: AcceptMyApp review
  prep at 30% off with `SHIP30`, Marquee App Store screenshots at 100% off
  with `SHIPATON26` (500 redemptions), and Lingue's Starter plan free through
  September 30. You can also list a sale on your own app with the
  #ShipatonSale hashtag to reach other participants.
- **Livestreams:** twice a week, with expert guests and live Q&A; the calendar
  is at https://luma.com/shipaton-live. The last three are "ASO in the age of
  AI agents" (Tuesday, September 22), a "Final AMA" (Friday, September 25),
  and a wrap-up celebration (Tuesday, September 29), all at 9AM PT.
- **Community:** the official Discord at https://discord.gg/shipaton26 for
  teammates, feedback, and help, with channels such as `#shipkit-support`,
  `#post-engagement-boost` for build-in-public content, and
  `#looking-for-google-play-tester`.
- **IRL events:** local meetups run with partner communities around the
  world, listed on the Shipaton events page. You can apply to host one;
  approved organizers get a Meetup-in-a-box kit with swag and an event
  playbook.
- **Build-in-public partners:** r/androiddev, HackerNoon (an extra $2,500
  prize pool for Build-in-Public stories), Product Hunt, and r/AppBusiness.
- **Students:** besides Next Gen, a campus leaderboard ranks schools, and the
  school with the most submissions wins a Learning Party sponsored by
  RevenueCat.
- **Media kit:** official Shipaton logos, mascot art, wordmarks, and brand
  colors for videos, social posts, and events.

## Lessons from past winners

These come from earlier editions: the 2024 Ship-a-ton, Shipaton 2025, and
Shipyard 2026, a separate hackathon built on creator briefs. None of them are
2026 rules.

- **Payout, 2025 Grand Prize:** finds class-action settlements its users
  qualify for. "The entire app — design, code, and assets — was produced
  through AI-assisted development using Claude Code and Cursor."
- **Gurwi – Learn Anything, 2025 #BuildInPublic:** "over 13,000 users", "more
  than 1,000 app store reviews", and a "4.9 rating". Its founder posted almost
  daily, from a separate English X account where RevenueCat's team and the
  judges were most active.
- **ReadHim, 2025 Buzziest Launch:** a meme account and a TikTok partner drove
  a launch that "achieved $1,100 in MRR" in ten days.
- **Vector Guard, 2025 HAMM:** a "1:50 Justice Model", where every $2.99
  premium subscription funds 50 free accounts in high-risk ZIP codes.
- **Karo, 2024 most likely to make money:** tasks sent like chat messages,
  with a "Blinkist style paywall" and a limited free tier.
- **Meshing, 2024 #buildinpublic:** Rudrank Riyam tweeted and posted YouTube
  videos daily, built most features from community suggestions, and put the
  paywall on the payoff: exporting a gradient as a wallpaper.
- **Shipyard 2026:** the winning apps "had something in common: focus". It is
  the closest precedent for the 2026 Influencer Awards, which are also fixed
  creator briefs.

Patterns across these winners:

- A specific problem, often a personal one, with an origin story.
- Building in public on several channels, with feedback visibly changing the
  app.
- Concrete numbers in the write-up: users, reviews, MRR, installs, revenue.
- Monetization designed into the product, such as a paywall at the moment of
  value.
- AI-assisted building, credited openly.
- Deep use of the sponsor's tool in sponsor awards.

## Winning playbook

Tips from RevenueCat's "How to win Shipaton" series, written for 2025, and
from the 2026 guides. Each tip notes which edition it comes from.

### Pick the idea

- "Solve a real problem", "For real people", "In a way that delivers delight
  or an 'aha' moment" (2025).
- Start from the problem, talk to people "just to listen", and solve one
  problem first. Monetizing is a requirement, so ask early users what they
  would pay (2025).
- Aim for a Minimum Lovable Product: cut scope ruthlessly but keep the
  delight (2025). A "small, single-purpose app that solves one thing" can win
  (2026).
- For an Influencer Award, pick the brief first and talk to its audience,
  instead of bending an existing idea to fit (Shipyard 2026).

### Build fast

- The "4-8-24 approach": 4 hours for a first version, 8 hours to polish it
  enough for real users, and 24 hours over three days to refine, package, and
  release (2025).
- Ship 1.0 as quickly as possible to get through app review, then push
  updates (2026), aiming for weekly ones (2025).
- "It's okay to be embarrassed about the version you're going to launch"
  (2025).
- Use AI for speed, but "The trick is not to ship AI output untouched" (2025).

### Grow after launch

- Aim for "100 paying customers during Shipaton", which the 2025 series calls
  "ambitious but realistic".
- Start with your own network, then niche Reddit, Discord, and forum
  communities, micro-influencers, other participants on the Shipaton Discord,
  and people at IRL events (2025).
- Work on discoverability: ASO keywords, benefit-led screenshots and copy,
  reviews from early users, and specific release notes (2025).
- "Winning Shipaton isn't just about hitting the biggest numbers. It's about
  showing clear signs of growth and proving that you've hustled" (2025).

### Pitch the submission

- "A Devpost submission isn't just a checklist of features. It's a pitch."
  Structure the story with Dan Harmon's Story Circle (2025).
- Video: "proof first, polish second". Open with the problem, show the app on
  the device, and show numbers as a before-and-after (2025). Keep the
  essential part within 2 minutes; the 2025 series allowed three.
- Description: open with a logline, "For \[who\], \[App Name\] helps \[job to
  be done\] by \[distinct approach\], so they can \[valuable outcome\]." Then
  write one paragraph each on the problem, how the app works, and the
  evidence (2025).
- Don't write the video and description on the last night; they "are the two
  things the judges will be scrutinizing the hardest" (Shipyard 2026).
- Submit early and keep the entry current: edits are allowed until the
  deadline, so update the numbers before it closes (2026).

## See also

- [Research notes](/docs/research/shipaton-2026.md): per-claim citations and
  the full perk, event, and livestream tables.
- [Devpost page capture][devpost]: the authoritative 2026 overview,
  requirements, prizes, and judges.
- [Official rules](https://revenuecat-shipaton-2026.devpost.com/rules): the
  source of truth for eligibility, deadlines, and legal terms. The Devpost
  page links them, but they are not captured in `docs/sources/`.

[devpost]: /docs/sources/devpost.com/revenuecat-shipaton-2026.[].md

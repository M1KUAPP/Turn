# Past RevenueCat hackathon winners

Research notes on what the placed winners of RevenueCat's three past hackathons
(Shipaton 2025, Shipyard: Creator Contest 2026, and the 2024 Ship-a-ton) built,
how they monetized and grew, what their submissions stressed, and where they are
now, mapped to the Shipaton 2026 categories. Web sources were accessed on
September 21, 2026, store figures are as of that date, and each claim cites its
source; this builds on, rather than repeats, the past-editions summary in
`docs/research/shipaton-2026.md`.

Contents:

1.  [Editions at a glance](#editions-at-a-glance)
1.  [Shipaton 2025 winners](#shipaton-2025-winners)
1.  [Shipyard 2026 winners](#shipyard-2026-winners)
1.  [2024 Ship-a-ton winners](#2024-ship-a-ton-winners)
1.  [Winner postmortems and interviews](#winner-postmortems-and-interviews)
1.  [Where past winners are now](#where-past-winners-are-now)
1.  [Patterns by 2026 category](#patterns-by-2026-category)
1.  [Conflicts](#conflicts)
1.  [Gaps](#gaps)
1.  [Source index](#source-index)

## Editions at a glance

Figures are quoted from each edition's Devpost overview and project gallery;
"Gallery" is the count the gallery prints ("1 – 24 of N").

| Edition         | Dates on Devpost                        | Cash                               | Participants           | Gallery                     | Categories                                   | Results post                         |
| --------------- | --------------------------------------- | ---------------------------------- | ---------------------- | --------------------------- | -------------------------------------------- | ------------------------------------ |
| 2024 Ship-a-ton | "Aug 5 – Sep 19, 2024" ([dp-2024])      | "$25,500 in prizes" ([dp-2024])    | "1672" ([dp-2024])     | 365 ([dp-2024-gallery])     | 3, with 3 places each ([dp-2024])            | Sep 23, 2024 ([rc-2024-winners])     |
| Shipaton 2025   | "Jul 31 – Oct 1, 2025" ([dp-2025])      | "$355,000 in cash" ([dp-2025])     | "51882" ([dp-2025])    | 813 ([dp-2025-gallery])     | 10 ([dp-2025])                               | Oct 13, 2025 ([rc-2025-winners])     |
| Shipyard 2026   | "Jan 15 – Feb 12, 2026" ([dp-shipyard]) | "$165,000 in cash" ([dp-shipyard]) | "7057" ([dp-shipyard]) | 857 ([dp-shipyard-gallery]) | 7 creator briefs plus a draw ([dp-shipyard]) | Feb 26, 2026 ([rc-shipyard-winners]) |

### Rules and judging that differed by edition

- 2024 Ship-a-ton: the first version had to be "released in the store during
  between August 5th and September 19" ([dp-2024]). The video was optional:
  "OPTIONAL: We recommend including a video demonstration of your app, but this
  is not required." Apps needed "a free trial" or "a promo code for judges".
  Every category paid "$5,000", "$2,500", and "$1,000", and a "Participation
  Prize" went to "500 winners" as "Exclusive Ship-a-ton Swag" ([dp-2024]).
- 2024 criteria for Most Likely to Make Money: "app design/execution,
  monetization strategy, onboarding and paywall design, and ASO best practices"
  ([dp-2024]).
- Shipaton 2025, Grand Prize on Devpost: "Goes to the app that releases early
  and iterates to grow their app the fastest. We want to hear about what you've
  done post-release to push your app growth to the next level." Entrants for it
  had to describe "what the developer has done since launch to grow their app
  and any relevant numbers (downloads/revenue/etc)" ([dp-2025]).
- Shipaton 2025, other rules: "Judges are not required to watch beyond three
  minutes" of the video; "App must either offer a free trial or Entrant must
  include a promo code for judges"; Kotlin entries needed "a fully published app
  on both Apple's App Store AND Google Play Store" ([dp-2025]).
- Both past Shipatons moved the deadline at the last minute. In 2024: "we're
  extending the deadline for submissions by 1 extra day!" ([dp-2024-updates]).
  In 2025, because "App Review has been moving a little slower than usual this
  week", "the official Shipaton deadline has now been extended by 12 hours.
  Submissions will close Wednesday, October 1st at 12:00 PM Pacific Time."
  ([dp-2025-extension]). Synthesis: plan for slow review in the final week
  rather than for an extension.
- Shipyard 2026 was built for creators, not stores: apps shipped via "TestFlight
  or Google Play Internal Testing", with a "Demo video (2–3 minutes)", a
  "Written proposal (1–2 pages)" covering problem, solution, "Monetization
  strategy", and roadmap, plus "Technical documentation" and a "Developer bio"
  ([dp-shipyard]).
- Shipyard's criteria were weighted: "Audience Fit (30%)", "User Experience
  (25%)", "Monetization Potential (20%)", "Innovation (15%)", "Technical Quality
  (10%)". Creators "review the top 10–15 submissions for their brief and select
  a winner" ([dp-shipyard]).
- Shipyard prizes: "$20,000 per winning app" plus a "RevenueCat Runner-Up draw!"
  of "$5,000 in cash" for "5 winners" among entries with "a full, eligible
  submission"; winners also got "Mention of winning submissions by creators on
  their channels" ([dp-shipyard]).

### Judges who carry over to 2026

- 2024 judges: Antoine van der Lee, Mikaela Caron, Sean Allen, Dave Verwer,
  Daria Orlova, Sebastian Röhl, and RevenueCat's Charlie Chapman, David Barnard,
  Rik Haandrikman, and Josh Holtz ([dp-2024]).
- 2025 judges: Nico Wittenborn, Pamela Hill, George Deglin, Evelin Herrera, Evan
  Bacon, Andrew Davies, Adam Lyttle, Thor Schaeff, Eric Crowley, Sam Eckert,
  Steve P. Young, Mustafa Yusuf ("Msquare Labs"), Jacob Eiting, David Barnard,
  and Charlie Chapman ([dp-2025]). Mustafa Yusuf co-built Karo, the 2024 Most
  Likely to Make Money winner ([dp-karo]).
- Shipyard judges: the seven creators plus Ben Ganz, Bria Sullivan, Miguel
  Carranza, Rik Haandrikman, Charlie Chapman, and Robert Irvine ([dp-shipyard]).
- 2026 judges who judged before: Antoine van der Lee (2024), Adam Lyttle, George
  Deglin, and Pamela Hill (2025), Bria Sullivan and Miguel Carranza (Shipyard),
  David Barnard (2024 and 2025), and Charlie Chapman (all three) ([dp-2026];
  [dp-2024]; [dp-2025]; [dp-shipyard]).
- 2026 judges who are past winners: Connor Burd, "Shipaton 2025 Grand Prize
  winner", and Camilo Starling Peñalver Gomez, "CEO Gurwi / Shipaton
  2025 #BuildInPublic winner" ([dp-2026]). Camilo also won a Shipyard
  "RevenueCat Runner-Up draw!" with Clatri, an AI finance assistant
  ([dp-clatri]).

## Shipaton 2025 winners

All 30 placed entries have Devpost pages, and the gallery lists them first
([dp-2025-gallery]). The table's stack comes from each page's "Built With" list
and write-up; paid options come from the US App Store listing unless noted;
video lengths are for the video embedded on the Devpost page.

### 2025 winners at a glance

| Place                    | App                                 | Team on Devpost                         | Stores                         | Stack                                                                | Paid options on the listing                                                                                    | Video                             |
| ------------------------ | ----------------------------------- | --------------------------------------- | ------------------------------ | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Grand Prize              | Payout ([dp-payout])                | Connor Burd                             | iOS, Android                   | React Native; Node.js and TypeScript API on Vercel; Adjust, Mixpanel | Weekly $4.99–$14.99, annual $9.99–$59.99 ([as-payout]); Play "$4.99 - $39.99 per item" ([gp-payout])           | Needs sign-in ([yt-payout])       |
| #BuildInPublic 1st       | Gurwi ([dp-gurwi])                  | Camilo Peñalver, Jonnier Martinez       | iOS, Android                   | Flutter, Supabase, Next.js, OneSignal, ElevenLabs                    | Weekly $3.99, monthly $8.99, annual $79.99; packs $9.99 and $19.99 ([as-gurwi])                                | 3:28 ([yt-gurwi])                 |
| #BuildInPublic 2nd       | Echo Reminder ([dp-echo])           | Luca Kato, Meychinh Eang                | iOS                            | Expo, React Native, Supabase, Express, Whisper, OpenAI               | Listing not found ([as-echo])                                                                                  | 3:07 ([yt-echo])                  |
| #BuildInPublic 3rd       | Tomo Japan ([dp-tomo])              | Tammy H.                                | iOS                            | SwiftUI, Firebase, Supabase, Gemini                                  | One item, $0.99 ([as-tomo])                                                                                    | 2:55 ([yt-tomo])                  |
| Design 1st               | Dayloop ([dp-dayloop])              | "Private user"                          | iOS                            | Swift, SwiftUI, SwiftData, Vision                                    | Weekly $2.99, annual $29.99, lifetime $59.99 ([as-dayloop])                                                    | 2:54 ([yt-dayloop])               |
| Design 2nd               | SkillMe ([dp-skillme])              | Ferdinand Werner                        | iOS                            | SwiftUI, The Composable Architecture, OpenAI                         | In-app purchases flagged, no prices listed ([as-skillme])                                                      | 3:11 ([yt-skillme])               |
| Design 3rd               | PitchLab ([dp-pitchlab])            | Jake Fishman                            | iOS, iPadOS, watchOS           | Swift, SwiftUI, CoreML, Firebase, PostHog, Stripe                    | Pro $24.99/month and $149.99–$239.99/year; Parent $29.99 and $179.99; Coach $49.99 and $499.99 ([as-pitchlab]) | 1:55 ([yt-pitchlab])              |
| Buzziest Launch 1st      | ReadHim ([dp-readhim])              | Jay D, with co-founder Joseph           | iOS                            | Swift, OCR, fine-tuned GPT-OSS-120B, Vercel                          | Pro Weekly $6.99 ([as-readhim])                                                                                | 3:04 ([yt-readhim])               |
| Buzziest Launch 2nd      | Shutter Declutter ([dp-shutter])    | Elle Lewis                              | iOS                            | Swift, SwiftUI, PhotoKit                                             | Monthly $2.99, yearly $23.99–$35.49, family $3.99, lifetime $94.99 ([as-shutter])                              | 2:33 ([yt-shutter])               |
| Buzziest Launch 3rd      | MemoLune ([dp-memolune])            | Ami Otsuka                              | iOS                            | Swift, Speech, Vision, Firebase, AdMob                               | Ad removal $5.99; Plus $4.99 and $49.99 ([as-memolune])                                                        | 0:44 ([yt-memolune])              |
| HAMM 1st                 | Vector Guard ([dp-vectorguard])     | Ellie Fausett, Weston Bell-Geddes       | iOS                            | Swift, CDC open data                                                 | Premium $4.99/month, $39.99/year ([as-vectorguard])                                                            | 3:20 ([yt-vectorguard])           |
| HAMM 2nd                 | Napkinmatic AI3D ([dp-napkinmatic]) | Yosun Chang, Caramel Corgi              | Android; iOS listing not found | React Native, Unity, Three.js, Python                                | Play "$0.99 - $9.99 per item" ([gp-napkinmatic])                                                               | 3:02 ([yt-napkinmatic])           |
| HAMM 3rd                 | Kigaru Talks ([dp-kigaru])          | Aika Talavera, Shashwat Aditya          | iOS, Android                   | Flutter, Firebase, LiveKit, OpenAI, Gemini, OneSignal                | 3 months $49.99–$99.99, 12 months $89.99–$239.99, translate weekly $9.99–$14.99 ([as-kigaru])                  | Needs sign-in ([yt-kigaru])       |
| Peace Prize 1st          | Heartbeat Hero ([dp-heartbeat])     | Aiden Forrest                           | iOS, iPadOS; UK store only     | Swift, SwiftUI, ARKit, Django, PostgreSQL                            | Pro £3.99/month and £19.99 ([as-heartbeat-gb])                                                                 | 15:11 ([yt-heartbeat])            |
| Peace Prize 2nd          | Hearing Buddy ([dp-hearingbuddy])   | Scott Krager                            | iOS, watchOS; separate Mac app | SwiftUI, Apple Speech framework, CoreML                              | Pro $6.99–$89.99 ([as-hearingbuddy])                                                                           | 3:59 ([yt-hearingbuddy])          |
| Peace Prize 3rd          | MoodHaven ([dp-moodhaven])          | Craig Sartor                            | iOS                            | Swift, Supabase, Clerk, Novu, Rive                                   | Pro $5.99, annual $59.99 ([as-moodhaven])                                                                      | 8:44 ([yt-moodhaven])             |
| Best Vibes 1st           | Otter Day ([dp-otterday])           | Felix Plagge                            | iOS, Android                   | Flutter, Shorebird, Perplexity, KlingAI, ElevenLabs                  | Core $5.99, Pro $6.99 ([as-otterday])                                                                          | 2:58 ([yt-otterday])              |
| Best Vibes 2nd           | Dripped ([dp-dripped])              | Mithilesh Chellappan                    | iOS                            | SwiftUI, Metal, Bun, Cloudflare Workers, Postgres                    | Essentials $7.99 and $69.99 ([as-dripped])                                                                     | 3:38 ([yt-dripped])               |
| Best Vibes 3rd           | MaestLog ([dp-maestlog])            | "Oikon 48"                              | iOS                            | Swift; Claude Code, Codex CLI, CodeRabbit                            | Ad Removal $2.99 ([as-maestlog])                                                                               | 1:29 ([yt-maestlog])              |
| OneSignal Boost 1st      | Cooked This ([dp-cookedthis])       | Natasha Wilson                          | iOS                            | SwiftUI, SwiftData, OneSignal                                        | Premium $1.99/month, $9.99/year ([as-cookedthis])                                                              | 2:45 ([yt-cookedthis])            |
| OneSignal Boost 2nd      | Voicetree ([dp-voicetree])          | Ragnar Rebase, Sergey Haikov            | iOS, watchOS                   | React Native, Expo, Swift, Node.js, Postgres                         | Premium $4.99, $14.99, $49.99, $69.99 ([as-voicetree])                                                         | Private on Vimeo ([vm-voicetree]) |
| OneSignal Boost 3rd      | Friendy+ ([dp-friendy])             | Jane Chao, Luis Cesar Morales, Mia Yang | iOS                            | Swift, SwiftUI, GRDB, OneSignal, TelemetryDeck                       | Premium $2.99 and $19.99 ([as-friendy])                                                                        | 1:54 ([yt-friendy])               |
| OneSignal Boost 4th      | Studient ([dp-studient])            | PixelArc Ventures                       | Both listings not found        | Flutter, Gemini, ElevenLabs, OneSignal                               | Not found ([as-studient]; [gp-studient])                                                                       | 1:36 ([yt-studient])              |
| OneSignal Boost 5th      | Camp Notes ([dp-campnotes])         | Jay Wilson                              | iOS                            | Swift, SwiftUI, Firebase, OneSignal, PostHog                         | Pro $3.99/month, $29.99/year ([as-campnotes])                                                                  | 2:06 ([yt-campnotes])             |
| Kotlin Multiplatform 1st | Momental ([dp-momental])            | Christian Krueger                       | iOS, Android                   | Compose Multiplatform, native audio players, Firebase, ElevenLabs    | Monthly $5.99–$8.99, yearly $12.99–$29.99, lifetime $59.99–$79.99 ([as-momental])                              | 2:21 ([yt-momental])              |
| Kotlin Multiplatform 2nd | Posturely ([dp-posturely])          | Rehaan Cubes                            | iOS; Play listing not found    | KMP, CMP, Supabase                                                   | Listing shows "Free" and no purchases ([as-posturely])                                                         | 3:46 ([yt-posturely])             |
| Kotlin Multiplatform 3rd | Steps Share ([dp-stepsshare])       | Omar Altamimi                           | iOS, Android                   | CMP, Firebase, HealthKit, Google Fit                                 | Premium $6.99 and $39.99 ([as-stepsshare])                                                                     | 1:45 ([yt-stepsshare])            |
| Kotlin Multiplatform 4th | DrawIt ([dp-drawit])                | Nikhil Mandlik, Rahul Ray               | iOS, Android                   | CMP, Firebase, GitLive KMP SDK                                       | Pro $0.99/month, $2.99/year ([as-drawit])                                                                      | 5:27 ([yt-drawit])                |
| Kotlin Multiplatform 5th | ClipUGC ([dp-clipugc])              | Mirzamehdi Karimov                      | iOS, Android                   | KMP, CMP, Firebase, Laravel                                          | Premium $14.99/month, $139.99/year; credit packs $9.99–$59.99 ([as-clipugc])                                   | 1:50 ([yt-clipugc])               |
| Staff and Sponsors       | Crystal Abyss ([dp-crystalabyss])   | JM DG, Antonio Borrero Granell          | iOS                            | SpriteKit, SwiftUI; Claude, Codex                                    | Listing shows "Free" and no purchases ([as-crystalabyss])                                                      | 0:54 ([yt-crystalabyss])          |

- Synthesis: 26 of the 30 Devpost pages show a "started this project" date
  between Sep 28 and Oct 1, 2025; the exceptions are Studient (Sep 2), Shutter
  Declutter and Vector Guard (Sep 23), and Voicetree (Sep 25) (the Devpost pages
  in the table). Gurwi's team chose "to wait until the last minute before
  posting the form, in order to attach the most up to date app metrics and
  marketing results" ([rc-gurwi]).
- Synthesis: 10 of the 30 write-ups give user, revenue, or engagement numbers
  (Payout, Gurwi, Tomo Japan, PitchLab, ReadHim, Shutter Declutter, Kigaru
  Talks, Voicetree, Momental, Steps Share); the rest placed on product, story,
  or sponsor-tool depth (the write-ups below).
- Synthesis: 12 of the 27 videos with a known length run longer than the three
  minutes judges are required to watch ([dp-2025]); the longest belong to Peace
  Prize winners Heartbeat Hero (15:11) and MoodHaven (8:44) (the Video column).

### Grand Prize and #BuildInPublic write-ups (2025)

- **Payout** ([dp-payout]). Inspiration: settlements "go unclaimed every year
  simply because most people never hear about them". Does: a feed of settlements
  whose eligibility rules read "in plain English", with estimated payouts, due
  dates, and alerts. Built: "entirely written using Claude Code and Cursor, not
  one line of code written by hand"; a React Native app and a "Node.js +
  TypeScript REST API" on Vercel. Challenges: "Legal compliance" ("help users
  file, but never 'practice law'"), and keeping users engaged because "Some
  administrators take months to pay". Proud of: "Shipped v1 in 10 days by
  leveraging AI". Learned: "A/B testing pricing is crucial to optimize your
  LTV"; "Capturing high value keywords can be extremely high leverage". Next:
  email login, a holiday push, a "macOS desktop client", and "more marketing
  growth!"
- Payout's traction claim: "17,000+ users", "$30,017 revenue", "1750+ paid
  subscriptions", "500,000 X impressions about the app" ([dp-payout]).
- **Gurwi** ([dp-gurwi]). Inspiration: Colombia's education gap and a May 13,
  2024 video that reached "more than 200,000 views and 40,000 likes". Does:
  "concise lessons of 10 to 15 minutes" in Spanish, English, and Portuguese with
  "playable text", points, streaks, and rankings. Built: a FlutterFlow
  prototype, then Flutter, Supabase, and a Next.js editor for a custom ".gurwi
  format". Challenges: funding, and a format where "A single Gurwi lesson can
  contain more than 3,000 lines of code". Learned: "MVPs (Minimum Viable
  Products) are no longer worth it"; a subscription prompt right after
  registration "seemed far too invasive, but when we dared to try it, we were
  thrilled: our subscriptions skyrocketed." Next: more classes,
  tap-to-translate, coding lessons, an agent that builds classes "from a single
  prompt", and B2B and government sales.
- Gurwi's traction claim: "over 13,000 users in just the last two months of the
  Shipaton" and "1,000+ app store reviews that give us a near-perfect 4.9-star
  average rating", while offering "only five classes" to users "primarily from
  Colombia" ([dp-gurwi]).
- **Echo Reminder** ([dp-echo]). Inspiration: Apple Reminders plus Siri
  friction; Luca found Shipaton in a Mobbin newsletter, where "the Times Square
  billboard caught my eye", and posted day 1 of a "'Build an app with me'
  series" the next day. Does: speak a task and Echo sets the details; web search
  and research sit "behind the RevenueCat paywall". Built: Expo and React
  Native, Supabase, an Express server on Railway, Whisper, and structured
  GPT-5-mini tool calls. Challenges: a first iOS app, no target audience ("a lot
  of disagreements"), and parsing accuracy. Proud of: "we were able to vlog
  every day of the process on social media". Learned: "pick a specific target
  audience early"; public feedback "varied a lot". Next: a calendar view, Google
  Calendar, and "TikTok (UGC marketing) and Reddit".
- **Tomo Japan** ([dp-tomo]). Inspiration: a second try at a Japan app after "5+
  years in finance". Does: curated Tokyo-area guides; users "upgrade to Tomo
  Lifetime Pro with a single purchase". Built: SwiftUI (MVVM), Firebase,
  Supabase as a validation layer, a JavaScript import script, and Gemini as
  coding partner. Challenges: content management and feature cuts. Build in
  public: "my initial RevenueCat setup caused a very slow paywall, flagged by
  three users who even sent me videos". Proud of: shipping in "Around 50 Days";
  "Featured Twice by RevenueCat". Next: Osaka, Fukuoka, maps, favorites, and
  itineraries.
- Tomo Japan's reach claim: X "32K+ Views, 780+ Engagement, and 65+ Followers in
  just 60 days"; TikTok "26K+ Views, 1.1K+ Likes, and 115+ Followers in only 30
  days"; the app "was launched 1 week before the deadline" ([dp-tomo]).

### Design and Buzziest Launch write-ups (2025)

- **Dayloop** ([dp-dayloop]). Inspiration: tracking moles, then weight loss and
  daily selfies; market research by "reading both their good and bad reviews" of
  rival apps. Does: "Auto Face Alignment", a "Ghost Photo" overlay, a time
  slider, import, and reminders, with photos kept on device. Built: Swift,
  SwiftUI, SwiftData, and Vision. Challenges: image bugs, broad positioning, and
  copy: "Sell benefits, not features" failed, so "I went with a feature-first
  approach and added a layer of emotion". Proud of: users "experience the app's
  value in under a minute". Next: short-form content, then "paid ad campaigns"
  and "UGC creators"; five languages already.
- **SkillMe** ([dp-skillme]). Inspiration: learning chef techniques with
  ChatGPT. Does: a goal, a self-assessment, AI daily challenges, and widgets.
  Built: SwiftUI, The Composable Architecture, and OpenAI; "All access
  validation and purchases are handled through RC, not StoreKit directly"; "AI
  generates motivational marketing copy tailored to each user's chosen goal."
  Challenges: structure versus flexibility, and "a paywall that feels personal".
  Next: iPad, Android, and adaptive plans.
- **PitchLab** ([dp-pitchlab]). Inspiration: a professional pitcher whose radar
  tools "cost upwards of $20,000". Does: velocity, break, spin, location, and
  pitch type from one iPhone camera. Built: a custom-trained tracker, a physics
  engine, CoreML "at up to 60fps", Firebase, and RevenueCat. Challenges:
  on-device speed, scarce training data, and "over 300+ total beta testers (200+
  of which are monthly active users)". Proud of: "1.2mph average absolute error
  on pitch velocity"; used by "several colleges, facilities, and MLB teams".
  Next: coach dashboards, "affiliate programs with baseball facilities",
  softball, and hitting.
- **ReadHim** ([dp-readhim]). Origin: the founders found Shipaton on "September
  1st" and set "ONE SINGULAR mission: to definitively win the Buzziest Launch
  Award"; the idea had to be "marketable and had the potential to explode on
  social media". Does: women upload text screenshots, and OCR plus "a fine-tuned
  GPT-OSS-120B endpoint" flags red flags and drafts replies; reports share via
  iMessage. Built: SwiftUI and a Vercel API; RevenueCat set up paywall and
  entitlements "in just a few hours"; Apple approved it "the night of September
  18th" after "like 5 times". Growth: an Instagram meme page with "over 5.2
  MILLION views"; a TikTok creator partner, "Trinity Blair, 2.3M followers", for
  "over HALF A MILLION views across TikTok and over a thousand downloads"; a
  nightclub stunt with supercars and "a robot dog".
- ReadHim's traction claim: "In just 10 days" it reached "$1100 in Monthly
  Recurring Revenue, and amassed a couple hundred free trials" and "6 Million
  Organic Views across Instagram and TikTok" ([dp-readhim]).
- **Shutter Declutter** ([dp-shutter]). Inspiration: "iPhone Storage Full", and
  cleanup as a daily habit. Does: shows photos taken on this day in past years;
  swipe to delete. Built: Swift, SwiftUI, PhotoKit, and RevenueCat, designed in
  Sketch, Photoshop, After Effects, and Illustrator. Challenges: PhotoKit
  performance and "Knowing when to ship". Proud of: growth from "11 users" after
  "posting on social media, cold emailing journalists, putting up signs around
  town"; "The Verge featured the app". Learned: "No one will download an app
  they haven't heard of"; "Pre-orders and beta testing help so much"; use "a
  unique identifier for your users in RevenueCat". Next: sharing, a Mac app, and
  localization.
- Shutter Declutter's traction claim: "At the time of writing (1 month
  post-launch), I now have thousands of active users and over 1,000 paying
  subscribers" ([dp-shutter]).
- **MemoLune** ([dp-memolune]). Inspiration: a friend's one-person group chat,
  from the author of the best-selling 「#100日チャレンジ」, who committed to 100 days of
  building. Does: chat-style memos with voice, OCR, and a calendar in six
  languages. Built: Swift, Speech, Vision, and "Firebase & AdMob for analytics
  and monetization"; the builder "rebuilt MemoLune three times in those 100
  days". Proud of: a release during the builder's PyCon JP keynote "in front of
  500+ developers". Learned: "you don't know what you truly want until you live
  with it." Next: RAG recall, translation, and sync.

### HAMM and Peace Prize write-ups (2025)

- **Vector Guard** ([dp-vectorguard]). The write-up skips the template. It
  opens: "476,000 Americans get Lyme disease every year." The builder: "I'm a
  PhD student at UC San Diego studying vector-borne diseases." Model: "Every
  $2.99 premium subscription automatically funds 50 free accounts in high-risk
  ZIP codes." Built: an offline-first database, Spanish, image recognition, and
  "Zero personal data collection". Challenges: dense CDC data, trust, and "How
  to give away your product while surviving?", answered by "Our 1:50 model makes
  equity profitable".
- **Napkinmatic AI3D** ([dp-napkinmatic]). Inspiration: napkin doodles. Does: a
  sketch photo becomes a painting, 3D model, or video. Model: "Buy Napkin
  Credits, which convert into Coins"; "5 coins for paintings, 90 coins for 3D";
  "casual users buy coins, power users subscribe for monthly bundles"; shared
  links earn coins for "unique views". Built: React Native, Unity and Three.js,
  Python AI services, and a soft launch at "Maker Faire 2025". Challenges: 3D on
  mid-range Android, coin pricing, and "Shipping v1 live on the Play Store hours
  before the hackathon deadline". Next: iOS and Amazon launches, a web app, and
  a creator marketplace.
- **Kigaru Talks** ([dp-kigaru]). Inspiration: teaching Japanese to "over 100
  American military-affiliated members stationed in Japan" who froze in
  conversation. Does: voice conversations at JLPT levels, flashcards from
  mistakes, memory, and no grading. Challenges: beta users "froze in their very
  first conversation", fixed by rebuilding around JLPT levels. Proud of: "it
  began with just 10 students. Then a single TikTok helped us grow to 100 beta
  testers, and within two months we had 258 sign-ups"; a Slack channel after the
  first paid user. Next: pitches in Fukuoka, schools, then other languages. The
  public write-up has no monetization section.
- **Heartbeat Hero** ([dp-heartbeat]). Inspiration: a Swift Student Challenge
  2024 project "selected as one of 50 Distinguished Winners", and an uncle who
  saved a life with CPR. Does: five modes; "Learn mode and AED map free for all
  users and lifetime full access to all features for verified students". Built:
  ARKit plus "200 Hz" motion data and an adaptive Kalman filter to measure
  compression depth; "Built With" also lists Django, PostgreSQL, and Railway.
  Learned: "Keeping some features free matters." Next: training providers,
  charities, and schools.
- **Hearing Buddy** ([dp-hearingbuddy]). Inspiration: the builder's partner, who
  is hard of hearing, and Apple's WWDC 2025 speech models; rivals were "charging
  steep premiums". Does: "unlimited, high-quality, real-time captions"; Pro adds
  Watch and Mac streaming and speaker detection. Built: the iOS 26 beta,
  WhisperKit replaced by Apple's Speech framework, and CoreML diarization. Proud
  of: "a launch post on Reddit at /r/hardofhearing and getting dozens of
  positive comments". Next: "Get featured on App Store as App of the Day", and a
  web app for teachers.
- **MoodHaven** ([dp-moodhaven]). Inspiration: the builder's 7-year-old son,
  "misdiagnosed more times than I can count". Does: logs moods, sleep,
  medication, and incidents from several caregivers. Built: Swift with "Cursor
  and Codex", "in just two months". Challenges: iOS review rules and "imposter
  syndrome". Learned: "Many of the best features in MoodHaven came from
  community feedback". Next: PDF export, a web portal, and a parent community.

### Best Vibes and Staff and Sponsors write-ups (2025)

- **Otter Day** ([dp-otterday]). Entered "for the RevenueCat Peace Prize, as
  well as the Best Vibes Award and the Design Award", with Peace as "the main
  focus"; it won Best Vibes. Inspiration: a mental-math trick from Arthur
  Benjamin's book. Does: an otter-led tutorial, text and audio modes, and six
  levels. Built: Flutter and Shorebird, with "Perplexity Pro", "KlingAI", and
  "ElevenLabs"; "Inspirations came from Duolingo and Sudoku games." Next:
  streaks, widgets, and a hands-free mode.
- **Dripped** ([dp-dripped]). Inspiration: "I am a bad dresser". Does: closet
  capture and tagging, calendar-aware outfits, virtual try-on, and an AI
  stylist. Built: SwiftUI, UIKit, Metal, Bun, Cloudflare Workers and R2, and
  Postgres, plus a Claude, CodeRabbit, and Xcode Cloud pipeline to "code on a
  beach without a Mac". Challenges: vibe-coded breakage, try-on accuracy, and
  "The biggest of all right now is to market the app." Proud of: "I got my first
  ever subscriber!!!" Learned: "Stick to core features for MVP"; "Get a team
  mate or a co founder."
- **MaestLog** ([dp-maestlog]). Inspiration: concerts with a violinist partner;
  the builder heard of Shipaton at "RevenueCat's VibeCoding Catfe in Tokyo".
  Does: a classical concert diary. Built: from "zero knowledge on September 6th
  to live app on September 27th", with AI-made mockups, Claude Code, Codex CLI,
  and CodeRabbit, often from a phone. Challenges: "Multiple rejections followed,
  particularly around RevenueCat subscription implementation details." Next:
  photo upload and AI program extraction.
- **Crystal Abyss** ([dp-crystalabyss]). Inspiration: Columns on the Sega
  Genesis and Dante's circles. Built: SpriteKit, SwiftUI, and RevenueCat; "The
  entire project was 'vibecoded'" with Claude and Codex, with hand-made music.
  Challenges: SpriteKit coordinates "continuously confused the AI", fixed with
  logging and "Clear documentation in CLAUDE.md". Proud of: "Implemented
  freemium model seamlessly across all platforms in under an hour". Learned: "AI
  struggles with spatial reasoning".

### OneSignal Boost write-ups (2025)

- **Cooked This** ([dp-cookedthis]). Inspiration: "rotating the same 4–5 meals".
  Does: "like a fitness tracker but for your kitchen". Built: SwiftUI,
  SwiftData, and OneSignal push and in-app messages for reminders, streaks, and
  milestones. Insights: "Small wins and milestones motivate more than raw
  numbers"; "Thoughtful reminders boost consistency without feeling annoying".
  Next: "More OneSignal engagement campaigns via email", widgets, and sharing.
- **Voicetree** ([dp-voicetree]). Inspiration: two indie developers asking "what
  did we agree to do?" after meetings. Does: turns recorded or uploaded audio
  into notes, drafts, and chat, with a Watch app, widgets, Siri, and Live
  Activities. Built: React Native and Expo with custom Swift, a Node.js backend,
  and a model router. Challenges: MVP scope and "Finding a profitable growth
  channel" via "Apple Ads and Meta". Proud of: "more than 1k app installs as
  well as growing to about $2k in revenue". Learned: the first Facebook campaign
  "didn't succeed ROAS-wise at all (our cost per trial was 2-3x higher than
  expected)". Next: onboarding per audience, Android, web, and Zapier.
- **Friendy+** ([dp-friendy]). Inspiration: forgotten "weak ties". Built:
  RevenueCat "contextual paywalls" and "Remote Config to iterate experiments
  without app updates"; OneSignal "persona-based Journeys" and Outcomes;
  TelemetryDeck. Challenges: TestFlight showed the first audience, "close
  friends", was wrong; "Decouple messaging from releases"; for #BuildInPublic,
  "We didn't publish consistently". Next: voice logging, smart nudges, and card
  scanning.
- **Studient** ([dp-studient]). Inspiration: late-night studying; "Armed with
  Claude Code and just 7 days". Does: turns PDFs into flashcards and quizzes,
  with a timer and achievements. Built: Flutter, Gemini, ElevenLabs, OneSignal,
  and RevenueCat; "80+ hours in 7 days". Challenges: "Started last week, needed
  to ship by September 30th, did it by the 2nd." Learned: "Perfect is the enemy
  of shipped".
- **Camp Notes** ([dp-campnotes]). Inspiration: camping with his wife. Does:
  site-level visit logs and a crowdsourced campground database. Built: SwiftUI,
  Firebase, OneSignal, PostHog, and Claude Code; the page links an App Store
  offer code, SHIPATON2025. Challenges: sparse data and App Store rejections.
  Proud of: "Within the first week of launch, a user subscribed to the premium
  tier". Learned: "feedback only comes after launch". Next: shared visits and
  seeded campground data.

### Kotlin Multiplatform Reach write-ups (2025)

- **Momental** ([dp-momental]). Inspiration: a monastery in Nepal; "meditation
  doesn't need more features. It requires less friction." Does: "One page. One
  tap. Nothing more."; 60+ soundscapes; no login. Built: validated "on Reddit,
  where I found many users searching for a minimal meditation timer"; a Reddit
  community and "a public feature voting board"; "Over 10 iterations" with
  Firebase A/B tests; Compose Multiplatform with native audio. Challenges: loop
  quality and "The Simplicity Paradox". Proud of: "over 4,200 sessions" in "the
  last 4 weeks". Learned: "Build an Audience First"; "Build for Outcomes, Not
  Features". Next: A/B test onboarding and monetization.
- **Posturely** ([dp-posturely]). Does: posture detection from the phone camera,
  a laptop webcam, and AirPods, with exercises and app blocking. Built: KMP and
  CMP; "Integrated Revenuecat to show a force paywall"; "Used Junie and Cursor";
  Supabase. Challenges: a first KMP app after Flutter, Gradle, and device
  inputs. Next: B2B packages, a Chrome app, and desktop.
- **Steps Share** ([dp-stepsshare]). Inspiration: friends swapping step
  screenshots on WhatsApp. Does: live rings, "Friend Duels", and Pro trend
  dashboards. Built: Compose Multiplatform, Firebase, HealthKit, and Google Fit;
  RevenueCat "Paywall + analytics in < 2 hours"; an "MIT-licensed core engine on
  GitHub". Proud of: "22 % average step increase among 250 closed-beta users
  after adding just one friend", and outside pull requests within two weeks of
  open-sourcing. Learned: "Open-sourcing early brings free QA, localization
  help, and evangelists."
- **DrawIt** ([dp-drawit]). Does: real-time draw-and-guess rooms. Built: Compose
  Canvas on Android, iOS with Apple Pencil, and desktop; Firebase through the
  GitLive KMP SDK. Build in public: "weekly YouTube videos". Next: audio and
  video chat.
- **ClipUGC** ([dp-clipugc]). Inspiration: "marketing was my weak point", and
  hook videos cost too much. Does: AI influencer clips merged with an app demo
  "in under 5 minutes". Built: KMP and CMP, server-side rendering after client
  FFmpeg proved heavy, KMPAuth with Firebase, and native video players.

### Why RevenueCat says the 2025 winners won

Quoted from the winners post ([rc-2025-winners]) unless noted; the award
ceremony's reasons are under [What RevenueCat said on stage and on
X](#what-revenuecat-said-on-stage-and-on-x).

- Payout "took the top spot in Shipaton 2025 for both its technical audacity and
  tangible real-world impact"; "What truly set Payout apart was how it was
  built." ([rc-2025-winners])
- Gurwi: "a prime example of what you can achieve when Building in Public." A
  later post: "The reach made Gurwi difficult to miss, but reach alone did not
  win the category. The judges chose Gurwi for the authenticity of its
  build-in-public story and the care visible in both the app and the videos
  around it." ([rc-gurwi])
- Echo Reminder: "What made Echo stand out was how transparently it was built."
  Tomo Japan: "Judges also loved the detailed and useful Medium posts".
  ([rc-2025-winners])
- PitchLab: "As a testament to its accuracy, the app is already in use by
  collegiate programs, training facilities, and MLB organizations."
  ([rc-2025-winners])
- ReadHim "was designed to make the buzziest launch of Shipaton 2025." MemoLune,
  "Released live during the developer's keynote at PyCon JP, the app quickly
  found its customers." ([rc-2025-winners])
- Vector Guard "demonstrates how thoughtful design and fair monetization can
  turn public data into public good". ([rc-2025-winners])
- Cooked This: "use of the OneSignal SDK stood out to judges: rich notifications
  as a behavioral design tool". Voicetree: judges praised "strong product
  thinking — defining a clear MVP, prioritizing user trust, and validating
  traction early on" and "the related blog post from the team".
  ([rc-2025-winners])
- Friendy+: "What impressed judges most was the app's use of OneSignal journeys
  and transactional messaging". Studient: "Judges praised the app's originality,
  use of Journeys, and the polished user experience." Camp Notes: "the use of
  omnichannel messaging for onboarding and reengagement." ([rc-2025-winners])
- Posturely: "Judges praised the developer's focus on supporting three platforms
  and being very creative." Crystal Abyss "became a case study in AI-assisted
  development". ([rc-2025-winners])
- RevenueCat's Devpost announcement sums up each winner in a line, for example
  Dayloop, "privacy-minded and delightfully polished"; Heartbeat Hero,
  "student-friendly and accessibility-first"; Cooked This, "habit-building
  notifications that reward real cooking progress, not vanity metrics"; and
  ReadHim, "viral hooks, influencer collabs, and creative stunts powered an
  attention-grabbing debut" ([dp-2025-winners-update]).

## Shipyard 2026 winners

One winner per creator brief. RevenueCat's post names the apps but not the
builders; the names below come from Devpost ([rc-shipyard-winners];
[dp-shipyard-gallery]). Store status is covered in [Where past winners are
now](#where-past-winners-are-now).

### Shipyard winners at a glance

| Brief                   | App                           | Builder on Devpost | Stack                                                 | Model in the write-up                                                      | Video                  |
| ----------------------- | ----------------------------- | ------------------ | ----------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------- |
| Eitan Bernath           | Preplo ([dp-preplo])          | Razvan Statescu    | Expo, React Native, NestJS, PostgreSQL, Redis, OpenAI | "subscriptions, premium features"                                          | 2:34 ([yt-preplo])     |
| Gabby Beckford          | Bloom ([dp-bloom])            | Ak Deepankar       | Flutter, Supabase, Mapbox                             | RevenueCat "Pro subscriptions"                                             | 6:02 ([yt-bloom])      |
| Quin Gable              | WanderBase ([dp-wanderbase])  | Benjamin Piggott   | React Native, Firebase, SendGrid, Codex               | Later "optional purchasable cosmetic items" and a paid builder marketplace | 4:11 ([yt-wanderbase]) |
| Sam Beckman             | Remy Reminders ([dp-remy])    | Nick Spreen        | Expo with Swift and Kotlin plugins, Convex            | Trial in onboarding plus a win-back offer                                  | 4:52 ([yt-remy])       |
| Simon (Better Creating) | Editor ([dp-editor])          | Francisco Martínez | SwiftUI, FastAPI, OpenAI, Gemini                      | "a single Unlimited subscription"                                          | 2:30 ([yt-editor])     |
| Rebecca Louise          | Sunny Money ([dp-sunnymoney]) | Shadin Cornelio    | React Native, Expo, OpenAI                            | "a monthly and an annual plan"                                             | 3:28 ([yt-sunnymoney]) |
| Josh                    | Folio ([dp-folio])            | Joshua Aideloje    | Expo, React Native, Clerk, Supabase, Claude           | Free tracking; "Folio Pro unlocks the AI assistant"                        | 2:16 ([yt-folio])      |

- The five "RevenueCat Runner-Up draw!" winners were HAVEN, CoachAI, Scrumpy,
  Sorted, and Clatri ([dp-shipyard-gallery]); Clatri is by Camilo Peñalver of
  Gurwi ([dp-clatri]).
- Remy's embedded video was uploaded on Mar 26, 2026, after the Feb 12 deadline,
  and is titled "Remy Reminders (cut a bit for time)" ([yt-remy]).
- Synthesis: four of the seven embedded videos run longer than the "Demo video
  (2–3 minutes)" the rules asked for ([dp-shipyard]), so length alone did not
  sink an entry, though Remy's current video is a later upload.

### Shipyard write-ups

- **Preplo** ([dp-preplo]). Inspiration: "We built Preplo because we were tired
  of saving cooking videos we never actually cooked." Does: a YouTube, TikTok,
  or Instagram link becomes a recipe with timestamps, costs, and nutrition;
  one-tap alterations; a hands-free cook mode; shopping lists;
  "Duolingo-inspired" streaks. Built: a NestJS API with PostgreSQL and Redis, an
  Expo app, and a cache so "the same video never gets processed twice".
  Challenges: reliable AI output, three video platforms, and a streak that
  "motivates instead of punishes". Learned: "would we actually use this
  tonight?"; "We said no to meal planning, social features, and community
  feeds". Next: meal planning, grocery ordering, and a "Creator Dashboard" that
  turns "creators from content sources into partners".
- **Bloom** ([dp-bloom]). Inspiration: goal apps "feel like boring to-do lists".
  Does: a "Digital Garden" that grows with habits, "Dreams", a "She Stacks
  Arcade" of "11 bite-sized mini-games" on money, a 3D travel map, and AI
  journaling. Built: Flutter, Supabase, Mapbox, and RevenueCat. Learned: "Small
  animations significantly increase user retention and joy." Next: career
  modules.
- **WanderBase** ([dp-wanderbase]). Inspiration: dating apps "look and feel the
  same". Does: invite-only van-life dating, friends, and a build-help forum,
  with hand-illustrated van avatars drawn by the builder's fiancée. Challenges:
  time; "it can take me hours just to record a 3 minute video because I keep
  redoing takes." Next: "First stop: the App Stores."
- **Remy Reminders** ([dp-remy]). Inspiration: Sam's switching between iOS and
  Android. Built: custom Swift and Kotlin notification plugins in Expo and a
  home-made offline-first sync on Convex. Proud of: "integrating a solid
  monetization into onboarding, which I know is great for maximizing the amount
  of people that try the free trial", and "a 50% off offer with RevenueCat on
  iOS and Android to win back users that did not opt for the trial on the first
  screen!" At submission, iOS "version 1.0.0" was already live.
- **Editor** ([dp-editor]). Inspiration: "What if an AI was designed to end
  conversations, not prolong them?" Does: structured thinking modes that end in
  decision briefs, with Notion export. Built: SwiftUI and FastAPI; paywalls
  "only shown at clear boundaries like locked modes or session limits". Learned:
  "Constraints make AI products better, not worse."; "Ending is a feature."
- **Sunny Money** ([dp-sunnymoney]). Inspiration: a mother who "left a marketing
  and tech career"; the concept began as her Etsy poster. Built: "I used Claude
  Code and Rork", plus Wispr Flow to code by voice. Learned: every screen had to
  pass "would a tired mom with five minutes find this worth her time?" Next: 50
  testers, then the App Store.
- **Folio** ([dp-folio]). Does: one dashboard for stocks, crypto, property, and
  savings, with widgets, alerts, screenshot import, and an AI assistant that
  "can execute changes with one tap". Built: Expo SDK 55, Clerk, and Supabase;
  "The AI assistant runs on Claude"; "RevenueCat made the monetization side
  surprisingly painless compared to dealing with StoreKit directly."

### Why RevenueCat says the Shipyard winners won

- "Across seven very different briefs, the winning apps had something in common:
  focus." "The van-life app prioritized trust and safety. The reminders app
  obsessed over cross-platform sync. The finance apps respected their users'
  time. The AI coach constrained itself on simplicity. Each team made deliberate
  trade-offs instead of chasing features." ([rc-shipyard-winners])

## 2024 Ship-a-ton winners

Nine placed entries in three categories, all with Devpost pages
([dp-2024-gallery]).

### 2024 winners at a glance

| Place                         | App                               | Team on Devpost                                                | Stores       | Stack                                              | Paid options on the listing now                                                              | Video                    |
| ----------------------------- | --------------------------------- | -------------------------------------------------------------- | ------------ | -------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------ |
| Most Likely to Make Money 1st | Karo ([dp-karo])                  | Mustafa Yusuf, Riken Shah                                      | iOS          | UIKit, SwiftUI, Go on AWS, Twilio, WhatsApp        | Plus $3.99–$129.99; family plans $8.49–$179.99, including a lifetime family plan ([as-karo]) | 0:48 ([yt-karo])         |
| Most Likely to Make Money 2nd | Zerocam Mono ([dp-zerocam])       | Sergio Rodriguez Rama, Dmitry Novikov                          | iOS          | Swift, Rive                                        | Four items, $1.99–$26.00 ([as-zerocam])                                                      | None on the page         |
| Most Likely to Make Money 3rd | Party Animals ([dp-partyanimals]) | Marcin Krasowski, Dawid Urbaniak                               | iOS, Android | Flutter, Figma                                     | Premium $3.99, monthly $4.99, yearly $19.99 ([as-partyanimals])                              | 3:00 ([yt-partyanimals]) |
| Design 1st                    | Flowmino ([dp-flowmino])          | Raphael Saing, Florent Perillat                                | iOS          | SwiftUI, SwiftData, Screen Time APIs               | Monthly $2.99–$4.99, yearly $19.99–$29.99, lifetime $49.99 ([as-flowmino])                   | 3:26 ([yt-flowmino])     |
| Design 2nd                    | Rakun Talk ([dp-rakun])           | Peter Buchroithner, David Pfluegl, Verena Haku, Thomas Schranz | iOS          | Swift, SwiftUI, DeepL                              | "Unlimited Cards" $2.99, $19.99, $39.99 ([as-rakun])                                         | 0:33 ([yt-rakun])        |
| Design 3rd                    | Apol ([dp-apol])                  | Dario Digregorio                                               | Android, iOS | Flutter, Firebase, Gemini, Genkit, Rive            | Pro $1.99–$2.99/month, $17.99–$29.99/year ([as-apol])                                        | 2:58 ([yt-apol])         |
| #BuildInPublic 1st            | Meshing ([dp-meshing])            | Rudrank Riyam                                                  | iOS          | Swift, SwiftUI, Metal, AIProxy, WishKit            | Weekly $1.99, monthly $1.99, annual $9.99, lifetime $29.99 ([as-meshing])                    | 2:53 ([yt-meshing])      |
| #BuildInPublic 2nd            | Food Sense ([dp-foodsense])       | İrem Karaoğlu Sansak                                           | iOS          | SwiftUI, SwiftData, Swift Charts, PDFKit, Firebase | Premium $0.99–$34.99 ([as-foodsense])                                                        | 1:45 ([yt-foodsense])    |
| #BuildInPublic 3rd            | BJJ Evolve ([dp-bjjevolve])       | Mansour Mahamat-salle                                          | iOS          | SwiftUI, Supabase                                  | Listing shows "Free" and no purchases ([as-bjjevolve])                                       | None on the page         |

### 2024 write-ups

- **Karo** ([dp-karo]). Inspiration: tasks from "My mom & wife" get lost in
  iMessage and WhatsApp. Does: assign tasks to any contact; non-users receive
  them by WhatsApp or SMS. Challenges: looking like a task app rather than a
  chat app, and SMS and WhatsApp approvals. Proud of: "Shipping the bare
  minimum"; "Adopting the blinkist paywall design"; "Making it to the App Store
  iOS 18 feature lists"; coverage on "TechCrunch, 9to5Mac, MacRumors and
  AppAdvice". Learned: "If your launch is perfect and flooded with features, you
  launched too late."; "Twilio is expensive!" Next: "Paywall experiments", "Free
  Trials vs Paid upfront intro offer", and Android.
- **Zerocam Mono** ([dp-zerocam]). Does: "an Anti-AI black & white camera app"
  with RAW capture, "a single-button interface", and a "365 Challenge widget".
  Built: Swift and RevenueCat, with Rive for onboarding and shutter animations.
  Challenges: "swimming against the current" of AI photography. Next: Android
  and an Instagram community.
- **Party Animals** ([dp-partyanimals]). Inspiration: market research on party
  games, some of which "gather hundreds of thousands of downloads each month".
  Does: 8 decks, "Over 1000 compelling truths and dares", and custom cards.
  Challenges: "almost two weeks" in app review. Proud of: trial sign-ups "within
  a few days of release", some converting. Learned: ASO. Next: "an Apple Search
  Ads campaign" and localization.
- **Flowmino** ([dp-flowmino]). Inspiration: "We're 2 procrastinators" who read
  Nir Eyal's Indistractable. Does: time blocks plus app blocking. Challenges:
  MVP discipline, building in public as "two introverts", and a crash-prone
  Screen Time picker. Proud of: "Our previous app was a solution in search of a
  problem"; they call the result an 'MLP', a "minimum lovable product". Learned:
  "The Mom Test".
- **Rakun Talk** ([dp-rakun]). Inspiration: travel tools for neurodivergent
  customers, where printed cards fall short. Does: interactive communication
  cards with a yes-or-no response screen and translation. Proud of: people
  understood the cards "within a few seconds". Next: user research and Android.
- **Apol** ([dp-apol]). Inspiration: online arguments. Does: debate rooms with
  AI personas and mesh-gradient visuals. Challenges: "a tight three-month
  development timeline and a full-time job". Learned: "How to utilize
  RevenueCat's Paywall feature". Its video's title names the "Google Gemini API
  Developer Competition" ([yt-apol]).
- **Meshing** ([dp-meshing]). Inspiration: slow SwiftUI previews; a Claude-built
  prototype first posted on Gumroad. Does: mesh gradients from gestures, text,
  or photos, exported as images or code. Build in public: "I documented my
  journey on YouTube"; "During the 45 days, I taught myself the meaning and
  value of consistency". Bonus: a one-day extension went to VoiceOver support
  and color sliders. Next: "MeshRoom", a sharing community.
- **Food Sense** ([dp-foodsense]). Inspiration: food symptoms, a Djokovic book,
  and weekly PDF reports to a dietician. Does: logs meals and feelings, exports
  PDFs. Built: "RevenueCat Paywalls to remotely configure paywall view". Proud
  of: shipping "in almost a month" while working full-time; "Sharing my journey
  daily on X (Twitter) kept me accountable". Learned: building in public was
  "far less stressful than I feared".
- **BJJ Evolve** ([dp-bjjevolve]). The write-up calls it "BJJ Tracker": an MVP
  for logging sessions, then "User Testing" with gym mates, then "the AI coach
  and community leaderboards".

### Why RevenueCat says the 2024 winners won

Quoted from the winners post ([rc-2024-winners]); the ceremony's comment on Karo
is under [What RevenueCat said on stage and on
X](#what-revenuecat-said-on-stage-and-on-x).

- Karo: "you don't have to convince everyone you work with to download and start
  using the same app as you"; the free tier gates "the collaboration features
  and the AI assistance features". ([rc-2024-winners])
- Zerocam Mono: "well placed to capture a segment of that market with an
  affordable $1.99/month, $0.99/week or a $19.99 lifetime option."
  ([rc-2024-winners])
- Flowmino: "one of the most beautiful looking and feeling apps we saw"; "The
  gentle animations throughout, combined with fantastic use of haptics make
  Flowmino an absolute joy to use." ([rc-2024-winners])
- Rakun Talk: "Like most accessibility tools, Rakun Talk can be useful for
  everyone too." ([rc-2024-winners])
- Meshing: Rudrank "truly embodied the spirit of #BuildInPublic". BJJ Evolve:
  "The vibes, as one of our judges commented, are 'just so so good'."
  ([rc-2024-winners])

## Winner postmortems and interviews

The two 2026 judges who won before come first, then RevenueCat's comments on
stage, then its interviews, then the other winners' own posts. Quotes marked
"auto-captions" come from YouTube's automatic transcript of the builder's own
video.

### What the 2026 judges who won before say

Connor Burd, Payout's builder and a 2026 judge:

- He entered 2024 too: "I'm still salty that at the 2024 @RevenueCat ship-a-ton
  apps made 'over $40,000 in revenue' and I didn't place top 3 for Most Likely
  to Make Money Award with half of the total revenue coming from my app."
  ([connor-x-2024]) RevenueCat had framed that award as "this isn't just how
  much money did they make on launch because that's obviously a very short-term
  thing" (auto-captions) ([yt-ceremony-2024]).
- Launch: "Payout launched in I guess a I think it was August 2nd, day two of
  the ship a ton" (auto-captions) ([yt-subclub-connor]); "Day 1 of new app ends
  at $290 MRR." ([connor-x-day1]).
- His running claims on X: "Nice revenue building for Payout from exclusively
  organic posts. Time to start paid ads" (Aug 29, 2025) ([connor-x-organic]);
  "$10K MRR from an entirely AI generated app, built in 14 days" (Sep 7)
  ([connor-x-10k]); "hits $20K MRR in 50 days. zero dollars in ad spend."
  (Sep 24) ([connor-x-20k]); "Now at 60K MRR in 4 months btw" (Dec 5)
  ([connor-x-60k]); and "Any app studios looking to acquire Payout?" at
  "$100K/mo" and "160,000+ installs" (Jan 21, 2026) ([connor-x-acquire]).
- Distribution came from a creator partner. On RevenueCat's Sub Club Live: "our
  only distribution channel in the beginning was influencers"; the influencer,
  Casper Capital, is "my partner on the app", and "we're just equal partners
  50/50 on the app" (auto-captions) ([yt-subclub-connor]). His studio's case
  study: "Casper Capital wanted to monetize his 10M+ audience with a finance
  app. We designed, built, and launched Payout in just two weeks." ([burd-case])
- Paid ads came later and big: of a month he names as May, he says "we spent I
  think somewhere maybe around $150,000 on ads that month" (auto-captions)
  ([yt-subclub-connor]). RevenueCat's promo for the episode: "grew Payout from
  $0 to $80K MRR in 4 months" and "The contrarian take: paid channels matter
  more than UGC." ([subclub-x])
- Monetization: "pretty much all of my apps are are hard paywall. I don't launch
  anything without it." (auto-captions) ([yt-subclub-connor]). On another
  podcast: "pretty much at maximum 15% of our revenue will come from Android"
  (interview on Superwall's channel, auto-captions) ([yt-superwall-connor]).
- The co-founder's accounting: "$217k revenue / ~ $54k App + Play Store fees / ~
  $26k marketing / + $65k Revenuecat grand prize / = $202k kept between me &
  cofounder (approx)" (Jan 2, 2026) ([casper-x-217k]).
- Today his site says "Payout hit $100K MRR in 5 months, completely
  bootstrapped, without hiring anyone" and "has now generated over $1M in
  revenue" ([busdownbonnor]).
- On the App Store review claiming the app "came back with another name called
  'Payout'" ([as-payout]): Connor already wrote "this one is called Payout" on
  Aug 16, 2025 ([connor-x-name]), and no primary source shows a rename.

Camilo Peñalver, Gurwi's founder and a 2026 judge:

- He found Shipaton "while scrolling on X, watching the video in which Charlie
  Chapman, developer advocate at RevenueCat, announced it", then "created a new
  X account in English, which is the social network the RevenueCat people use
  most" and made videos "tagging the judges, at least two more times"
  ([camilo-post]).
- "But the real traction came from the Spanish-speaking audience"; other
  creators' videos plus his pitch "added up to more than four million views"
  ([camilo-post]). English ads failed: "I spent $30 for only 542 impressions"
  (Sep 1, 2025) ([camilo-x-ads]).
- The paywall change that mattered: "Inviting users optionally to subscribe
  after registration gave us 50 new trials in just one single day." (Sep
  20, 2025) ([camilo-x-trials])
- The win fed itself. "After winning I published a video announcing the
  victory", which reached a journalist at La W; the resulting video "surpassed
  800,000 views" ([camilo-post]). By Nov 3, 2025: "We surpassed 25,000 users and
  climbed back to the top 2 on iOS in Colombia. We currently have 439 active
  trials and 319 subscriptions." ([camilo-x-25k])
- "With all this impact, Gurwi achieved more than $19,000 dollars in sales in
  2025 and more than 1,300 reviews with an average rating of 4.8 stars, despite
  still being a project of promises, with only 5 classes"; his chart is
  captioned "$12,322 dollars came in in November alone"; the figure "is what
  users paid and not what went into our pockets" ([camilo-post]).
- Then: "Gurwi won us $15,000 at the Shipaton and went on to make over $22,000
  in sales. But I had lost faith in the project." (Jun 6, 2026)
  ([camilo-x-22k]). He later won a Shipyard runner-up prize with Clatri
  ([camilo-x-clatri]).

Other judges:

- No other 2026 judge appears on a placed team in the three past galleries
  ([dp-2026]; [dp-2024-gallery]; [dp-2025-gallery]; [dp-shipyard-gallery]).
  Mustafa Yusuf, Karo's co-builder, judged 2025 and wrote "Truth is… I didn't
  come up with it for Shipaton. Shipaton gave me the deadline I needed to ship"
  ([mufasa-x]).
- Related but not a Shipaton placing: RevenueCat's 2025 Shippies gave "Anchors
  Away", "our award for best new app launch of the year", to "Focus Friend by
  Hank Green", "created by Honeybee Games" (auto-captions) ([yt-shippies-2025]),
  the studio of 2026 judge Bria Sullivan ([dp-2026]).

### What RevenueCat said on stage and on X

- 2025 ceremony, on Payout: "Payout was like very far and away, clearly the app
  that was gunning for this uh this prize. And so, you shipped right away, right
  at the beginning, and did a whole bunch of different paid marketing uh
  campaigns to grow the app. And it was very obvious uh from your submission."
  (auto-captions) ([yt-ceremony-2025])
- 2025 ceremony, on Gurwi: "they made tutorials about how they implemented it.
  They open sourced all of their implementation for that. Uh and also during the
  build-in public conversations, they were in the replies to lots of other
  developers apps and encouraging them. And so that was kind of ultimately what
  put them over the edge." (auto-captions) ([yt-ceremony-2025])
- 2024 ceremony, on Karo: "their pay wall used a lot of the best practices that
  we have found have been really effective" (auto-captions)
  ([yt-ceremony-2024]).
- RevenueCat's 2025 winners thread: Payout "Fully AI-built, no hand-written
  code."; Gurwi "built transparently in public with strong community engagement"
  ([rc-x-payout]; [rc-x-gurwi]).
- RevenueCat's 2026 "How to win" session: "there were apps that made really
  highly polished content that didn't win and there were apps that made not
  super highly polished content that did win. It was more about the story"; and
  for the Grand Prize, "based on the revenue we build a short list of the apps
  that we then judge in the final stage" (auto-captions) ([yt-howtowin]).

### What RevenueCat's interviews add

The repo notes already cover these interviews' posting cadence; the details
below are the ones they omit.

- Gurwi, after the win: "Camilo's later account puts Gurwi's user payments
  during the year of the win at more than $19,000, before the app stores' 15%
  commission", and the team "founded Gurwi LLC, giving the team a chance to
  monetize with Stripe" ([rc-gurwi]). Its reach came partly from others: Camilo
  "asked other creators to share Gurwi's story", and with his own pitch "those
  videos generated more than four million views" ([rc-gurwi]). His advice: "tell
  a story", "build something original", and "make the work visible"
  ([rc-gurwi]).
- Meshing's model: free to use until "exporting a gradient as a wallpaper
  triggered a paywall" ([rc-rudrank]). On winning: "By day 40, I kind of knew
  that I would win the first prize because the others I thought were my
  competition — he had given up" ([rc-rudrank]).
- BJJ Evolve: "a waitlist that grew to 300 people in just two weeks", then
  "Today, 5–6 gyms actively use the app" ([rc-mansour]).
- Leandro Tolaini, a 2024 entrant who did not place: "a 7-day free trial
  followed by a hard paywall", which "earned around $100-200" ([rc-tolaini]).

### 2025 winners in their own words

- ReadHim's video: "within just 10 days post launch, we generated nearly 6
  million organic views for our app and crossed over $1,000 in monthly recurring
  revenue"; "neither Joseph nor I are an iOS pro. I build software for drones,
  and Joseph sells ice machines on Tik Tok shop" (auto-captions) ([yt-readhim]).
- Shutter Declutter's video: "I did a preorder system to get some initial
  downloads. I put up signs in the city… Since the launch, I was featured on The
  Verge. I started posting on social media regularly and even went viral a few
  times." ([yt-shutter])
- Voicetree's blog post, the one judges praised, shows the OneSignal setup:
  segments keyed to RevenueCat states such as "[RC] Cancelled Trial"; a feedback
  email that unlocks "an extended paid trial ($5 for the first month)"; "a
  discounted offer for the next year" for churned users; and a push prompt only
  after "more than 3 sessions" ([rsapps-blog]). It promised "In the next post,
  we'll be sharing metrics, results, and iterations"; that post has not appeared
  ([rsapps-blog]). The press kit lists "weekly(~$4.99), monthly (~$14.99),
  yearly (~69.99$)" and "a small team of 2 mobile developers based in Tallinn,
  Estonia" ([rsapps-press]).
- Tomo Japan's three Medium posts: "I finished barely a week before the final
  deadline" and was "hoping to get hired as an iOS Engineer soon (and I did,
  shortly after, thanks in part to the hackathon!)" ([tomo-medium-1]); "My
  monetization strategy is simple: offer a Tomo Lifetime Pro User upgrade"
  ([tomo-medium-2]); "it was the Twitter community that pointed me toward
  Supabase", and "I managed three distinct accounts" on TikTok
  ([tomo-medium-3]).
- Echo Reminder: an April 2026 update says "The first thing I want to try out is
  App Store search optimization" and "second thing is I do want to try UGC uh
  TikTok marketing" (auto-captions) ([yt-echo-update]); the app is no longer
  listed ([as-echo]).
- Friendy+ explained its 3rd place in a Mandarin video: judges from marketing
  and developer relations "想要故事" ("want stories"); "我不覺得我們的 App 有什麼酷炫之處" ("I
  don't think our app has anything flashy"); and "最後其實是 800 多組 然後評審就才十幾個" ("in
  the end there were 800-some entries and only a dozen or so judges")
  (auto-captions; my translation) ([yt-friendy-win]). The six-part build series
  is a public playlist ([yt-friendy-playlist]).
- Camp Notes' blog: "placed 5th… winning $5,000"; "The Build in Public award…
  might have been a better fit" ([jw-5th]); "I've only had 4 users start a trial
  since I launched on September 6th" ([jw-paywall]); a month-one table shows
  Camp Notes at "4" subscribers and "$10" MRR ([jw-month1]).
- MaestLog's talk slides say "短期間(3週間)のAIでの開発が評価された" ("building with AI in a
  short time, three weeks, is what was recognized") and "モバイルアプリ開発経験なし" ("no
  mobile app development experience") ([oikon-deck]).
- MemoLune's builder, on note.com: "応募したのは2週間前" ("I applied only two weeks
  before") ([note-memolune-1]) and "辛うじて賞はもらえたものの、商用アプリの壁は、想像したよりも、ずっと高かった" ("I
  barely won a prize, but the wall for a commercial app was far higher than I
  imagined") ([note-memolune-2]).
- Momental: "Day 4: Momental is now available on the Google Play Store"; "I've
  never released an app so quickly and with so few features." ([krueger-bsky]).
  Its changelog adds "Faster paywall load times and a simpler upgrade screen"
  (v2.0.0, May 2026) and "Tinnitus Relief" (v2.3.0, June 2026)
  ([momental-changelog]). JetBrains quotes him: "Sharing one codebase for
  Android and iOS gave me so much more time to focus on user feedback"
  ([jetbrains-blog]).
- DrawIt, after buying a Google Play developer account: "right now it is
  mandatory to keep our app in close testing phase for at least 15 days with at
  least 12 active testers" (auto-captions, Aug 24, 2025) ([yt-drawit-3]).
- Heartbeat Hero: "I am thrilled to finally reveal that Heartbeat Hero is now a
  multi-award winning app"; "especially seeing my app in Times Square on a NYC
  billboard!" ([aiden-li]). A November 2025 Product Hunt launch offered the code
  "PRODUCTHUNT25" and noted "Currently, the map works in UK and US!"
  ([ph-heartbeat]). The builder then entered Shipyard with a new app
  ([yt-viva]).
- Hearing Buddy's about page: "made by Lilly Seay, who lives with hearing loss,
  and Scott Krager"; "On-device AI… means the captions can stay free"
  ([hb-about]).
- Dripped: "Just made my first-ever internet dollar!… This wouldn't have been
  possible without @RevenueCat 's #Shipaton!" (Sep 28, 2025) ([mith-x]).
- ClipUGC: "ClipUGC won 5th place in the #shipaton hackathon for Kotlin
  Multiplatform category!" and thanks JetBrains for "free access to Junie"
  ([mirze-li]). The studio's live stats show "Installs (all) 379" and "Revenue
  (all) $30.71" for ClipUGC as of September 21, 2026 ([measify]).
- Crystal Abyss's site now says "No ads, no in-app purchases—just you and the
  abyss" ([crystal-site]), although the write-up described RevenueCat "premium
  level unlocking" ([dp-crystalabyss]).
- Vector Guard (secondary: a Q&A published by Entomology Today): "For every
  Premium subscription purchased ($2.99 a month), Vector Guard automatically
  gifts 50 free premium subscriptions"; "Weston and I are the only people who
  work on Vector Guard"; "The primary challenge right now is getting
  discovered." ([ento-today])
- Kigaru Talks' team later entered Shipyard with a new app, CoachOS
  ([yt-coachos]).

### Shipyard winners in their own words

- Preplo's builder lists "Most recently Preplo — winner of RevenueCat's Shipyard
  Creator Contest 2026." ([statescu]); the app's site says "Available now on
  iOS" ([preplo-site]). Eitan Bernath posted "Congratulations to Razvan who
  created the app Preplo for the @revenue.cat Shipyard Creators Contest for
  winning and receiving the $20,000 prize! #revenuecatpartner #shipyard2026"
  (Feb 26, 2026) ([eitan-ig]); no joint launch was found.
- Remy Reminders is the one creator partnership that shipped. Sam Beckman's
  review video, "This Reminder App is INCREDIBLE!" (19:00, Mar 26, 2026), has a
  "03:16 - Shipyard Contest" chapter and says "BIG thanks to RevenueCat for
  sponsoring this video" ([yt-sam-remy]). On Google Play the developer is "Sam
  Beckman", with 2.5 stars, "46 reviews", "5K+" downloads, and "$9.99 - $119.99
  per item" ([gp-remy]).
- Editor's site says it "was selected as the winner of the RevenueCat Shipyard
  Creator Contest out of hundreds of submissions", "Chosen by Simon from Better
  Creating", and is still "Coming soon. Editor is in active development. We're
  preparing for launch on the App Store." ([editor-site]).
- Bloom's builder lists "Grand Prize Winner" for "Revenuecat Shipyard 2026" with
  "Prize: $20,000" in his portfolio ([ak25]); Folio's docs say "Winner ·
  RevenueCat Shipyard 2026" ([folio-docs]).

### 2024 winners in their own words

- Karo: Mustafa Yusuf's 2024 recap lists "won @revenuecat.com's shipaton" and
  "back to $10k+ after losing focus in '23", without a unit, period, or app
  ([mufasa-bsky]).
- Flowmino: "This is crazy!!! our app Flowmino won the Design Award for the
  @RevenueCat #shipaton" ([raph-x]). In 2026 Florent relaunched it: "I finally
  launched my app on the App Store! Studious brings your calendar, tasks and
  focus timer in a single app." ([flo-bsky]).
- Apol: "my little niche app 'Apol' already has 5k Downloads and 1k MMA in only
  a few months of organic growth" and "Over 3500 debates have been created
  already!" (Apr 7, 2025) ([dario-bsky]).
- Meshing: before the win, Rudrank wrote "I know my Meshing app is not the one
  to make me a millionaire." ([rudrank-blog]). His daily-log playlist,
  "RevenueCat Ship-a-ton 2024", holds "55 videos" ([yt-rudrank-playlist]). In
  2025 his entries did not place ([rc-2025-winners]); a 2025 video description
  reads "Zenther & Arisin launches flopped with no MRR and many bugs linger."
  ([yt-rudrank-2025]). In 2026 he is back, building with Rork: "Unlike last
  year, I am not chasing the prize money or promising daily videos"; he wants to
  "try Apple Ads and UGC, and share the honest parts without burning myself out
  again" ([yt-rudrank-2026]).
- BJJ Evolve: on day 1 Mansour "build a landing page posted on Reddit Facebook"
  and "collected almost 50 people interested" (Aug 7, 2024) ([mansour-li-1])
  and, in French, "Plus de 1000 utilisateurs actifs" ("more than 1,000 active
  users") and "Un revenu mensuel récurrent stable" ("a steady monthly recurring
  revenue") (Jan 30, 2025) ([mansour-li-2]). The app is now "Kombat Evolve",
  software for gyms; its founder video says "I spent 3 months interviewing 50
  gym owners across Europe." ([yt-kombat]).

## Where past winners are now

Status as of September 21, 2026, from each app's own listing. Ratings are the US
App Store's unless a storefront is named; the web listing shows no global total.
"Updated" is the newest version date on the listing. Play figures are the US
English listing's star rating, review count, downloads, and "Updated on" date.

### 2025 winners now

| App               | Name on the listing now         | Status                                                   | App Store rating                                          | Updated (version)                         | Google Play                                               |
| ----------------- | ------------------------------- | -------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------- |
| Payout            | Payout: Claim Class Actions     | Live                                                     | 4.7 (11,329) ([as-payout])                                | Aug 28, 2026 (4.0.5)                      | 4.8, "10.4K reviews", "100K+", Aug 26, 2026 ([gp-payout]) |
| Gurwi             | Gurwi – Learn Anything          | Live; seller Gurwi LLC                                   | 5.0 (29) ([as-gurwi]); Colombia 4.9 (240) ([as-gurwi-co]) | Sep 12, 2026 (2.5.0)                      | 4.7, "1.4K reviews", "10K+", Sep 20, 2026 ([gp-gurwi])    |
| Echo Reminder     | —                               | Not found ([as-echo]; [lk-echo])                         | —                                                         | —                                         | —                                                         |
| Tomo Japan        | Tomo Japan                      | Live                                                     | 4.8 (10) ([as-tomo])                                      | Sep 30, 2025 (1.1)                        | —                                                         |
| Dayloop           | Dayloop: Photo Journal          | Live, renamed; seller Aptiq Studio                       | 5.0 (3) ([as-dayloop])                                    | Jan 11, 2026 (1.3.1)                      | —                                                         |
| SkillMe           | SkillMe - Learn any Skill       | Live                                                     | 2.0 (1) ([as-skillme])                                    | Sep 25, 2025, only version ([lk-skillme]) | —                                                         |
| PitchLab          | PitchLab - Baseball & Softball  | Live, renamed; seller PitchLab AI, Inc.                  | 4.7 (2,064) ([as-pitchlab])                               | Sep 5, 2026 (1.2.7)                       | —                                                         |
| ReadHim           | ReadHim                         | Live                                                     | 5.0 (11) ([as-readhim])                                   | Sep 26, 2025 (1.0.1)                      | —                                                         |
| Shutter Declutter | Shutter Declutter: Pic Cleaner  | Live; seller Later Creative LLC                          | 4.9 (355) ([as-shutter])                                  | Sep 16, 2026 (2.6.7)                      | —                                                         |
| MemoLune          | MemoLune —chat, speak,and pics  | Live                                                     | None in US; Japan 2.3 (3) ([as-memolune-jp])              | Nov 23, 2025 (1.1.1) ([as-memolune])      | —                                                         |
| Vector Guard      | Vector Guard - Bug Identifier   | Live; seller BUILT BY FOUNDRY, INC.                      | 4.9 (49) ([as-vectorguard])                               | Sep 19, 2026 (26.09.18)                   | —                                                         |
| Napkinmatic AI3D  | —                               | iOS not found ([as-napkinmatic]; [lk-napkinmatic])       | —                                                         | —                                         | No rating shown, "10+", Oct 24, 2025 ([gp-napkinmatic])   |
| Kigaru Talks      | Speak Japanese - Kigaru Talks   | Live, renamed                                            | 4.7 (128) ([as-kigaru]); Japan 4.6 (139) ([as-kigaru-jp]) | Sep 19, 2026 (2.6.12)                     | 4.6, "175 reviews", "1K+", Sep 19, 2026 ([gp-kigaru])     |
| Heartbeat Hero    | Heartbeat Hero \| CPR Education | US page not found ([as-heartbeat]); live in the UK       | UK 5.0 (2) ([as-heartbeat-gb])                            | Jun 23, 2026 (2.1.0)                      | —                                                         |
| Hearing Buddy     | Hearing Buddy - Speech To Text  | Live, renamed; plus a Mac app ([as-hearingbuddy-mac])    | 4.1 (131) ([as-hearingbuddy])                             | Sep 18, 2026 (3.11)                       | —                                                         |
| MoodHaven         | MoodHaven - Mood Tracker        | Live                                                     | None ([as-moodhaven])                                     | Oct 1, 2025 (1.0.1)                       | —                                                         |
| Otter Day         | OtterDay: Calendar Logic Game   | Live, renamed                                            | 5.0 (1) ([as-otterday])                                   | Sep 8, 2026 (1.2.5)                       | No rating shown, "100+", Sep 8, 2026 ([gp-otterday])      |
| Dripped           | Outfit & Closet Fits - Dripped  | Live, renamed                                            | 4.0 (4) ([as-dripped])                                    | Feb 6, 2026 (1.2.1)                       | —                                                         |
| MaestLog          | MaestLog - Classical Diary      | Live; sells only "Ad Removal"                            | None ([as-maestlog])                                      | Sep 3, 2026 (2.6.0)                       | —                                                         |
| Cooked This       | CookedThis: Cooking Journal     | Live                                                     | 4.0 (1) ([as-cookedthis])                                 | Aug 8, 2026 (3.4.0)                       | —                                                         |
| Voicetree         | Voicetree: Record & Transcribe  | Live, renamed                                            | 5.0 (3) ([as-voicetree])                                  | Nov 27, 2025 (1.6)                        | —                                                         |
| Friendy+          | Friendy+                        | Live                                                     | None ([as-friendy])                                       | Oct 1, 2025 (1.0.2)                       | —                                                         |
| Studient          | —                               | Not found on either store ([as-studient]; [lk-studient]) | —                                                         | —                                         | Not found ([gp-studient])                                 |
| Camp Notes        | Camp Notes: Camping Journal     | Live                                                     | 3.7 (3) ([as-campnotes])                                  | Jun 18, 2026 (1.8.1)                      | —                                                         |
| Momental          | Momental: Relax & Sleep Sounds  | Live, renamed                                            | 4.4 (43) ([as-momental])                                  | Aug 26, 2026 (2.8.0)                      | 4.3, "248 reviews", "10K+", Aug 25, 2026 ([gp-momental])  |
| Posturely         | Posturely - Sit Straight        | iOS live; Play not found ([gp-posturely])                | 1.0 (1) ([as-posturely])                                  | Dec 3, 2025 (1.0.3)                       | Not found                                                 |
| Steps Share       | Steps Share Pedometer           | Live                                                     | 5.0 (1) ([as-stepsshare])                                 | Oct 7, 2025 ("Version 8")                 | No rating shown, "500+", Oct 7, 2025 ([gp-stepsshare])    |
| DrawIt            | Draw-It!                        | Live                                                     | None ([as-drawit])                                        | Oct 4, 2025 (3.0)                         | No rating shown, "50+", Oct 3, 2025 ([gp-drawit])         |
| ClipUGC           | ClipUGC: AI Influencer Video    | Live; offered in the 2026 #ShipatonSale ([rc-sale])      | 5.0 (1) ([as-clipugc])                                    | Sep 3, 2026 (2.0.3)                       | No rating shown, "500+", Sep 10, 2026 ([gp-clipugc])      |
| Crystal Abyss     | Crystal Abyss                   | Live; shows no purchases                                 | None ([as-crystalabyss])                                  | Oct 14, 2025 (1.2)                        | —                                                         |

- Synthesis: 28 of 30 are still on at least one store; Echo Reminder and
  Studient were not found on any store checked, and Heartbeat Hero is only in
  the UK store (table).
- Synthesis: 12 of 30 shipped an update after Jul 1, 2026, while 11 App Store
  listings have not changed since 2025, eight of them since September or October
  2025 (table).
- Synthesis: only five have more than 100 US ratings: Payout (11,329), PitchLab
  (2,064), Shutter Declutter (355), Hearing Buddy (131), and Kigaru Talks (128)
  (table).
- Payout's model has widened beyond the subscription: "Payout Premium is an
  optional subscription that unlocks premium features"; users can "Enter our
  weekly cash giveaway", and "you can earn more entries by inviting friends";
  and "Card, bank, and investing matches are third-party offers, and Payout may
  earn a commission." ([as-payout])
- ClipUGC now pitches itself as "Available on web (clipugc.com), iOS, Android,
  and as a CLI" and offers "50% off any ClipUGC subscription plan for your first
  2 months" to 2026 entrants ([rc-sale]).

### Shipyard winners now

| App            | App Store listing                                                   | Rating  | Updated (version)     | Paid options on the listing                         | Google Play                                                                 |
| -------------- | ------------------------------------------------------------------- | ------- | --------------------- | --------------------------------------------------- | --------------------------------------------------------------------------- |
| Preplo         | "Preplo: Recipes from Videos", seller Razvan Statescu ([as-preplo]) | None    | Mar 26, 2026 (1.0.3)  | Premium $9.99/month, $49.99/year, $129.99 lifetime  | —                                                                           |
| Remy Reminders | "Remy Reminders", seller "Sam Beckman Pty Ltd" ([as-remy])          | 5.0 (1) | Jul 28, 2026 (1.0.16) | $9.99/month, $47.99–$59.99/year, $119.99 lifetime   | Developer "Sam Beckman", 2.5, "46 reviews", "5K+", Jul 28, 2026 ([gp-remy]) |
| Clatri (draw)  | "Clatri", seller Gurwi LLC ([as-clatri])                            | None    | Sep 17, 2026 (2.6.0)  | Weekly $4.99, monthly $16.99, yearly $120.99, packs | —                                                                           |

- Remy Reminders is published by the brief creator: the App Store seller is "Sam
  Beckman Pty Ltd" ([as-remy]) and the Play developer is "Sam Beckman"
  ([gp-remy]). It is the only Shipyard winner found with a creator partnership
  after the contest.
- Bloom, WanderBase, Editor, Sunny Money, and Folio had no store listing that I
  could find by name; Editor's site still says "Coming soon" ([editor-site]).
- The two Shipyard winners on the App Store list version 1.0.0 on Mar 9, 2026
  (Remy) and Mar 16, 2026 (Preplo), after the Feb 12 deadline ([as-remy];
  [as-preplo]); Shipyard only required TestFlight or internal testing
  ([dp-shipyard]).

### 2024 winners now

| App           | Name on the listing now                            | Status                             | App Store rating                                              | Updated (version)    | Google Play                                                                                         |
| ------------- | -------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------- | -------------------- | --------------------------------------------------------------------------------------------------- |
| Karo          | Karo: Tasks, Todo List Planner                     | Live, renamed; seller Msquare Labs | 4.7 (35) ([as-karo])                                          | Mar 25, 2025 (1.3.2) | —                                                                                                   |
| Zerocam Mono  | zerocam mono \| black and white                    | Live; seller Zero Camera Ltd       | 5.0 (16) ([as-zerocam])                                       | Jul 15, 2026 (3.1.0) | —                                                                                                   |
| Party Animals | Party Animals: Truth or Dare                       | Live                               | 4.4 (10) ([as-partyanimals])                                  | Mar 10, 2025 (1.0.8) | 4.1, "99 reviews", "5K+", May 26, 2026 ([gp-partyanimals])                                          |
| Flowmino      | Focus Timer - Studious                             | Live, renamed                      | 4.3 (18) ([as-flowmino])                                      | Apr 20, 2026 (3.2.2) | —                                                                                                   |
| Rakun Talk    | Rakun Talk                                         | Live                               | None ([as-rakun])                                             | Aug 22, 2024 (1.1.1) | —                                                                                                   |
| Apol          | Apol: Debate smarter with AI                       | Live                               | 5.0 (1) ([as-apol])                                           | Mar 7, 2026 (2.0.1)  | 3.4, "27 reviews", "10K+", Mar 8, 2026 ([gp-apol])                                                  |
| Meshing       | Gradient Wallpapers: Meshing                       | Live, renamed                      | 4.3 (3) ([as-meshing])                                        | Aug 23, 2026 (2.4.0) | —                                                                                                   |
| Food Sense    | Food Sense - Meal Journal                          | Live                               | 4.3 (6) ([as-foodsense])                                      | Jun 13, 2026 (3.1.1) | —                                                                                                   |
| BJJ Evolve    | Kombat Evolve; "BJJ Evolve: Progression" in France | Live, renamed; shows no purchases  | 5.0 (2) ([as-bjjevolve]); France 5.0 (29) ([as-bjjevolve-fr]) | Sep 8, 2026 (2.91)   | "Kombat Evolve AB", no rating shown, "1K+", Sep 9, 2026, "$3.99 - $18.99 per item" ([gp-bjjevolve]) |

- Synthesis: all nine 2024 winners are still listed two years on; six updated
  their iOS apps in 2026 (Zerocam Mono, Flowmino, Apol, Meshing, Food Sense,
  Kombat Evolve), while Karo, Party Animals, and Rakun Talk have not updated on
  iOS since 2024 or early 2025 (table).

## Patterns by 2026 category

Each bullet is my synthesis from the evidence cited above; each category opens
with the 2026 criteria it is compared against.

### Grand Prize precedents

2026 rewards "the strongest user traction and growth momentum" ([rc-cat-grand]);
the precedent is 2025's Build & Grow winner, Payout.

- Synthesis: the winning write-up led with post-launch numbers across users,
  revenue, paid subscriptions, and reach: "17,000+ users", "$30,017 revenue",
  "1750+ paid subscriptions", "500,000 X impressions about the app"
  ([dp-payout]).
- Synthesis: it shipped fast and then worked pricing and search: "Shipped v1 in
  10 days", "A/B testing pricing", and "high value keywords" ([dp-payout]). Its
  listing now shows ten price points from $4.99 to $59.99, most labeled weekly
  or annual ([as-payout]).
- Synthesis: the other big 2025 traction claims won growth-flavored categories:
  ReadHim's "$1100 in Monthly Recurring Revenue" and Shutter Declutter's "over
  1,000 paying subscribers" (Buzziest Launch), and Voicetree's "about $2k in
  revenue" (OneSignal Boost) ([dp-readhim]; [dp-shutter]; [dp-voicetree]).
- Synthesis: the winner had distribution before it had an app: an influencer
  co-founder, "our only distribution channel in the beginning", then paid ads
  ([yt-subclub-connor]); RevenueCat's ceremony credited shipping "right away"
  plus "paid marketing" ([yt-ceremony-2025]).
- Synthesis: revenue earns a shortlist, not the prize: "based on the revenue we
  build a short list of the apps that we then judge in the final stage"
  ([yt-howtowin]). In 2024 Connor's app did not place in the money award
  despite, by his account, "half of the total revenue" ([connor-x-2024]).
- Synthesis: the momentum lasted. Payout has 11,329 US ratings and "100K+" Play
  downloads a year later ([as-payout]; [gp-payout]), and its builder now judges
  ([dp-2026]).

### #BuildInPublic precedents

2026 says "Audience size does not matter. The quality and usefulness of the
journey does." Judges check "whether public feedback led to changes"
([rc-cat-bip]).

- Synthesis: winners posted daily or nearly daily, often on video: Echo "vlog
  every day" ([dp-echo]), Tomo "daily #buildInPublic updates" ([dp-tomo]), Food
  Sense "daily on X" ([dp-foodsense]), Meshing's "55 videos"
  ([yt-rudrank-playlist]), and Gurwi "almost daily" ([rc-gurwi]).
- Synthesis: each could point to a change that came from the public: Tomo's slow
  paywall "flagged by three users" ([dp-tomo]); Meshing's "Noise, animation,
  text masking, favorites, copy to clipboard" ([rc-2024-winners]); Echo's
  coffee-shop tests that fixed onboarding ([rc-2025-winners]).
- Synthesis: small accounts can place. Tomo's X account had "65+ Followers"
  ([dp-tomo]), and even for Gurwi "reach alone did not win the category"
  ([rc-gurwi]).
- Synthesis: go where the judges are. Gurwi "created a separate English-language
  account on X, where RevenueCat's team and the judges were most active"
  ([rc-gurwi]), and its founder made videos "tagging the judges"
  ([camilo-post]).
- Synthesis: story and generosity beat polish. RevenueCat: "there were apps that
  made really highly polished content that didn't win" ([yt-howtowin]); what
  "put them over the edge" for Gurwi was tutorials, an open-sourced
  implementation, and replies encouraging other builders ([yt-ceremony-2025]).
- Synthesis: the cost is real. Rudrank's 2026 plan avoids "promising daily
  videos" to avoid "burning myself out again" ([yt-rudrank-2026]), and Friendy+
  admits "We didn't publish consistently" ([dp-friendy]).

### HAMM precedents

2026 wants "a well-crafted paywall, thoughtful pricing and packaging, strong
conversion, and monetization that genuinely fits the product" ([rc-cat-hamm]);
precedents are 2025's HAMM and 2024's Most Likely to Make Money.

- Synthesis: each winner had a one-line model story tied to its purpose: Vector
  Guard's "1:50 Justice Model" ([dp-vectorguard]); Napkinmatic's credits, coins,
  and subscriptions, with coins earned by sharing ([dp-napkinmatic]); Karo's
  gated collaboration and AI behind a Blinkist-style paywall
  ([rc-2024-winners]).
- Synthesis: entry prices were concrete and low: "$2.99" for Vector Guard
  ([dp-vectorguard]) and "$1.99/month, $0.99/week or a $19.99 lifetime option"
  for Zerocam Mono ([rc-2024-winners]).
- Synthesis: no 2025 HAMM winner's public write-up cites revenue, and Kigaru's
  never discusses pricing ([dp-kigaru]), so the model was likely argued in the
  private form fields (see [Gaps](#gaps)).
- Synthesis: paywall tactics from other winners fit HAMM's wording:
  goal-specific paywall copy (SkillMe, [dp-skillme]); a trial in onboarding plus
  "a 50% off offer" win-back (Remy, [dp-remy]); a paywall right after sign-up,
  which "gave us 50 new trials in just one single day" (Gurwi, [dp-gurwi];
  [camilo-x-trials]); a hard paywall on every app (Payout's builder,
  [yt-subclub-connor]); and Remote Config experiments (Friendy+, [dp-friendy]).

### Design precedents

2026 is about "taste, care, and execution" and asks for "A demo video that
clearly shows the app in motion" ([rc-cat-design]).

- Synthesis: each winner had one signature interaction built on platform
  frameworks: Dayloop's Vision-based "Auto Face Alignment" ([dp-dayloop]),
  PitchLab's single-camera tracking with CoreML ([dp-pitchlab]), and Flowmino's
  Screen Time blocking with "gentle animations" and "haptics"
  ([rc-2024-winners]).
- Synthesis: on-device processing and privacy recur: Dayloop, PitchLab, and
  Hearing Buddy keep the work on the phone ([dp-dayloop]; [dp-pitchlab];
  [dp-hearingbuddy]).
- Synthesis: five of six design winners are native Swift apps; Apol, built in
  Flutter for Android, is the exception (tables above).

### Peace Prize precedents

2026 asks "who the app helps, why the problem matters" and for "early evidence
of usefulness, adoption, feedback, or real-world benefit" ([rc-cat-peace]).

- Synthesis: all three 2025 winners grew out of the builder's family: an uncle's
  CPR rescue, a partner who is hard of hearing, and a son's mental health
  ([dp-heartbeat]; [dp-hearingbuddy]; [dp-moodhaven]).
- Synthesis: free access for those who need it: Heartbeat Hero keeps Learn mode
  and the AED map free and gives students full access ([dp-heartbeat]); Vector
  Guard's paid plan funds free accounts ([dp-vectorguard]).
- Synthesis: accessibility and offline use are presented as features, not extras
  (Heartbeat Hero, Hearing Buddy, Vector Guard) ([dp-heartbeat];
  [dp-hearingbuddy]; [dp-vectorguard]).
- Synthesis: evidence was modest, such as "dozens of positive comments" on
  Reddit ([dp-hearingbuddy]), and Otter Day aimed at Peace but placed in Best
  Vibes ([dp-otterday]).

### Keep Them Coming Back precedents

This succeeds 2025's OneSignal Boost; 2026 judges "Implementation", "User
value", "Resourcefulness", and "Depth", and "a well-designed multi-step Journey
can make the submission stand out" ([rc-cat-onesignal]).

- Synthesis: all five 2025 winners tied messages to the app's core habit:
  cooking streaks (Cooked This), study nudges (Studient), weak-tie follow-ups
  (Friendy+), onboarding and re-engagement (Camp Notes), and meeting follow-ups
  (Voicetree) ([rc-2025-winners]).
- Synthesis: depth won over volume: judges named "Journeys", "transactional
  messaging", "omnichannel messaging", and email plus push plus in-app messaging
  ([rc-2025-winners]).
- Synthesis: restraint was a stated goal: "Thoughtful reminders boost
  consistency without feeling annoying" ([dp-cookedthis]).
- Synthesis: messaging let teams change copy without a release: "Decouple
  messaging from releases" ([dp-friendy]).
- Synthesis: the most copyable published playbook is Voicetree's: segments keyed
  to RevenueCat subscription states, a feedback email after a cancelled trial
  that unlocks "an extended paid trial ($5 for the first month)", and a push
  prompt only after "more than 3 sessions" ([rsapps-blog]).

### Ship Kotlin Everywhere precedents

This succeeds 2025's Kotlin Multiplatform award; 2026 requires both stores and
judges "Cross-platform quality — required", "Community interaction — optional",
and "Giving back — optional" ([rc-cat-kotlin]).

- Synthesis: shared Compose UI with native parts where quality needed it:
  Momental's audio players ([dp-momental]), ClipUGC's video players
  ([dp-clipugc]), and Steps Share's HealthKit and Google Fit bridge
  ([dp-stepsshare]).
- Synthesis: giving back showed up in the winners: Steps Share open-sourced its
  core ([dp-stepsshare]), DrawIt posted weekly videos ([dp-drawit]), and
  Momental ran a Reddit community and a public voting board ([dp-momental]).
- Synthesis: extra form factors impressed: Posturely was praised for "supporting
  three platforms" ([rc-2025-winners]).
- Synthesis: both listings must survive judging; Posturely's Play page is gone a
  year later ([gp-posturely]).

### Conflict of Interest precedent

This succeeds 2025's Staff and Sponsors award, judged on "Concept originality",
"Execution and design", and "Monetization" ([rc-2025-winners]). The 2026 page
names no criteria beyond a place for "builders connected to the event" and asks
for "A demo video showing the project working" ([rc-cat-coi]).

- The only precedent is Crystal Abyss, a SpriteKit puzzle game "vibecoded" with
  Claude and Codex, with RevenueCat for "premium level unlocking"
  ([dp-crystalabyss]). Its builder's site lists him as "Staff Software Engineer
  @ RevenueCat" and his co-builder as a UX/UI designer ([granell-site]).
- Synthesis: a small, well-themed, polished game was enough; its listing now
  shows no ratings and no purchases ([as-crystalabyss]).

### Influencer Awards precedents

The closest precedent is Shipyard, where creators chose from "the top 10–15" and
"Audience Fit (30%)" carried the most weight ([dp-shipyard]); the 2026 awards
are also fixed creator briefs ([rc-cat-lawley]).

- Synthesis: winners built the brief's core and cut the rest: "We said no to
  meal planning, social features, and community feeds" ([dp-preplo]); Editor was
  "designed to end conversations" ([dp-editor]); RevenueCat's summary is "focus"
  ([rc-shipyard-winners]).
- Synthesis: they answered the creator's named pain point directly: Sam's
  snooze-from-notification and true sync (Remy, [dp-remy]), Quin's invite-only
  safety (WanderBase, [dp-wanderbase]), and Josh's all-assets dashboard (Folio,
  [dp-folio]).
- Synthesis: monetization was designed in: Remy's onboarding trial and win-back
  offer, Folio's free and Pro split, and Editor's single subscription
  ([dp-remy]; [dp-folio]; [dp-editor]).
- Synthesis: the prize after the prize depended on the creator. Only Remy became
  a creator-published app, promoted in a RevenueCat-sponsored video ([as-remy];
  [yt-sam-remy]); the others got at most a congratulatory post ([eitan-ig]).

### Patterns across categories

- Synthesis: most winners kept Devpost's template (inspiration, what it does,
  how it was built, challenges, accomplishments, what's next) and filled it with
  numbers; ReadHim, Vector Guard, and ClipUGC replaced it with one narrative
  (the write-ups above).
- Synthesis: at least 13 of the 30 2025 write-ups credit AI tools openly, from
  Payout's "not one line of code written by hand" to Crystal Abyss and MaestLog
  ([dp-payout]; [dp-crystalabyss]; [dp-maestlog]); RevenueCat singled out the
  AI-built workflow for Payout and Crystal Abyss ([rc-2025-winners]).
- Synthesis: many winners were shipping their first app: Echo's team, ReadHim's
  founders, Dripped's and MaestLog's builders, and Gurwi's founders ([dp-echo];
  [dp-readhim]; [dp-dripped]; [dp-maestlog]; [rc-gurwi]).
- Synthesis: entrants can aim at several categories, and judges may place them
  in a different one, as with Otter Day ([dp-otterday]).
- Synthesis: the growth channels winners credit are short-form video and other
  creators (ReadHim, Gurwi, Kigaru Talks, BJJ Evolve), press (Shutter
  Declutter's The Verge, Karo's TechCrunch), Reddit (Momental, Hearing Buddy),
  search optimization (Payout), and paid ads with poor early returns (Voicetree)
  ([dp-readhim]; [rc-gurwi]; [dp-kigaru]; [rc-mansour]; [dp-shutter]; [dp-karo];
  [dp-momental]; [dp-hearingbuddy]; [dp-payout]; [dp-voicetree]).

## Conflicts

Both sides are quoted; none of these changes a 2026 rule.

- 2025 project count. "collectively submitted 812 projects" ([rc-2025-winners])
  versus the gallery's "1 – 24 of 813" ([dp-2025-gallery]).
- 2025 participant and submission counts. Devpost now shows "51882 participants"
  ([dp-2025]); MaestLog's builder's slides say "2025年は55,457人が登録" ("55,457
  registered in 2025") ([oikon-deck]); Connor Burd wrote "Out of 55,000
  participants" ([connor-x-55k]); and 2026 judge Mike Khristo replied that "RC
  posted there were 817 submissions" ([khristo-x]).
- 2024 app count. "over 400 apps to judge" ([rc-2024-winners]) versus the
  gallery's "1 – 24 of 365" ([dp-2024-gallery]) and RevenueCat's showcase,
  "Explore all 333 published apps from Shipaton 2024." ([rc-apps-2024]).
- 2024 deadline. The announcement said submissions closed "September 18th"
  ([rc-2024-announce]); the rules say "Thursday, September 19, 2024 (11:45 pm
  Pacific Time)" ([dp-2024-rules]). An update explains the change: "we're
  extending the deadline for submissions by 1 extra day!" ([dp-2024-updates]).
- 2024 participation prize. The overview lists "Participation Prize 500 winners"
  ([dp-2024]); the rules list "Exclusive swag" with a quantity of "100"
  ([dp-2024-rules]).
- 2025 Grand Prize criteria. Devpost: "Goes to the app that releases early and
  iterates to grow their app the fastest" ([dp-2025]). The winners post:
  "Innovation", "Execution", "Feasibility", "Integration" ([rc-2025-winners]).
- 2025 prize amounts and naming. The overview's "All Other Categories (except
  OneSignal Boost)" pays "1st Place: $15,000", but the prize list pays the "1st
  Place: Kotlin Multiplatform Reach Award" "$20,000 in cash", with five places
  like OneSignal ([dp-2025]). The same page calls it both "Kotlin Multiplatform
  Boost Award" and "Kotlin Multiplatform Reach Award" ([dp-2025]).
- Shipyard size. "more than 900 builders" ([rc-shipyard-winners]) and "900+
  builders" ([rc-x-shipyard]) versus "almost 900 submissions"
  ([dp-shipyard-update]), a gallery of "857" ([dp-shipyard-gallery]), and "7057"
  participants ([dp-shipyard]).
- Shipyard runner-up prizes. Devpost calls them a "RevenueCat Runner-Up draw!"
  that eligible entries are "entered into" ([dp-shipyard]); the winners update
  says "Selected from the judge and creators' shortlist, these five participants
  have won $5,000" ([dp-shipyard-update]), and Camilo wrote that Clatri "was
  selected" ([camilo-x-clatri]).
- Shipyard brief 7. "Josh from VisualFaktory" ([rc-shipyard-winners]) and "Josh
  (VisualFaktory)" ([dp-shipyard]) versus the prize "Creator Brief - Josh
  @VisualPolitik/VisualEconomic" ([dp-shipyard]) and the rules' "Creator Brief
  VisualPolitik / VisualEconomik (#7)" ([dp-shipyard-rules]).
- Times Square run. The 2025 winners update promised 1st places "a full week on
  a digital billboard in Times Square" ([dp-2025-winners-update]); Gurwi's
  founder writes that Shipaton "put the app on a Times Square screen in New York
  for a couple of days" ([camilo-post]).
- Gurwi's launch video. "over 200,000 views" ([rc-2025-winners]) and "more than
  200,000 views and 40,000 likes" ([dp-gurwi]) versus "more than 250,000 views,
  40,000 likes, and more than 500 comments" ([rc-gurwi]).
- Party Animals' second developer. "Marcin Krasowski and Don Urbano"
  ([rc-2024-winners]) versus the Devpost team "Marcin Krasowski" and "Dawid
  Urbaniak" ([dp-partyanimals]).
- ReadHim's review timeline. The write-up: "finally submitting it to review on
  September 9th" after going back and forth "like 5 times" ([dp-readhim]). The
  video: "We submitted V1 for review on September 11th" and "after four
  rejections" (auto-captions) ([yt-readhim]).
- Remy Reminders' first release. The write-up says "there is currently an iOS
  version that's live on the App Store, which is version 1.0.0" ([dp-remy]); the
  current listing's history starts with 1.0.0 on Mar 9, 2026, under "Sam Beckman
  Pty Ltd" ([as-remy]). Synthesis: the app was probably republished under the
  creator's account.
- How Payout was built. The write-up: "entirely written using Claude Code and
  Cursor" and "Shipped v1 in 10 days" ([dp-payout]). Connor on X: "built in 14
  days" (Sep 7, 2025) ([connor-x-10k]) and "built in 10 days, vibecoded with GPT
  4.1" (May 9, 2026) ([connor-x-gpt]); his studio: "launched Payout in just two
  weeks" ([burd-case]).
- Payout's ad spend. "Time to start paid ads" (Aug 29, 2025)
  ([connor-x-organic]) versus "zero dollars in ad spend" (Sep 24, 2025)
  ([connor-x-20k]); at the ceremony RevenueCat credited "a whole bunch of
  different paid marketing uh campaigns" (auto-captions) ([yt-ceremony-2025]),
  while Connor later said "our only distribution channel in the beginning was
  influencers" (auto-captions) ([yt-subclub-connor]).
- Vector Guard's price. "$2.99 premium subscription" ([rc-2025-winners];
  [dp-vectorguard]) and "($2.99 a month)" ([ento-today]) versus today's listing,
  "Premium Monthly $4.99" and "Premium Annual $39.99" ([as-vectorguard]).
- Zerocam Mono's prices. "$1.99/month, $0.99/week or a $19.99 lifetime option"
  in 2024 ([rc-2024-winners]) versus four items from $1.99 to $26.00 on today's
  listing ([as-zerocam]).
- Crystal Abyss's monetization. "RevenueCat for monetization and premium level
  unlocking" ([dp-crystalabyss]) versus "No ads, no in-app purchases"
  ([crystal-site]); the listing shows "Free" ([as-crystalabyss]).
- MaestLog's monetization. "Premium subscribers monthly access an expanding
  feature set" ([dp-maestlog]) versus a single "Ad Removal $2.99" item today
  ([as-maestlog]).
- How judges review. RevenueCat: "Reviewing means going through submission
  videos and descriptions, and downloading and testing the apps."
  ([rc-judge-2026]). A 2025 winner's guess: "他們可能基本上就是不會下載 就是看一下你的影片" ("they
  probably basically won't download; they'll just watch your video")
  (auto-captions) ([yt-friendy-win]).

## Gaps

- Three demo videos could not be timed: Payout's and Kigaru's YouTube videos
  require sign-in ([yt-payout]; [yt-kigaru]), and Voicetree's Vimeo video is
  private ([vm-voicetree]).
- Devpost shows only the public story. The category fields entrants filled in,
  such as Build & Grow numbers, the HAMM model explanation, and #BuildInPublic
  links ([dp-2025]), are not public, so what judges read beyond the write-up is
  unknown.
- Why some listings vanished is unknown: Echo Reminder, Studient, Napkinmatic on
  iOS, Posturely on Google Play, and Heartbeat Hero outside the UK.
- I found no store listing by name for Shipyard's Bloom, WanderBase, Editor,
  Sunny Money, or Folio, and no creator partnership after the contest except Sam
  Beckman's; Eitan Bernath's congratulatory post is the only other creator
  mention found.
- Ratings are per storefront. The web listing shows no worldwide total, so the
  US counts understate apps whose users are elsewhere (for example Gurwi in
  Colombia).
- Traction figures are self-reported and unaudited. Only ClipUGC publishes live
  numbers ([measify]); Camp Notes publishes its MRR ([jw-month1]).
- Could not read: full X timelines (rate-limited; posts were read one by one
  through X's own embed endpoint), Connor Burd's paywalled Indie Hackers
  interview, most LinkedIn profiles, Instagram and TikTok accounts (ReadHim's
  meme page, Echo's reels, Gurwi's and Tomo's TikToks), İrem Karaoğlu's X thread
  (restricted), the paid parts of MemoLune's note.com posts, and the sites
  heartbeatheroapp.com and posturely.app.

## Source index

Owners are the parties that published each page. "Published" is the date the
page shows; Devpost project pages show the date the project was started, and "—"
means the page shows no date.

| Source                   | Owner                                              | Published              | What it is                                            |
| ------------------------ | -------------------------------------------------- | ---------------------- | ----------------------------------------------------- |
| [rc-2025-winners]        | RevenueCat (Perttu Lähteenlahti)                   | Oct 13, 2025           | Shipaton 2025 winners post                            |
| [rc-2024-winners]        | RevenueCat (Charlie Chapman)                       | Sep 23, 2024           | 2024 Ship-a-ton winners post                          |
| [rc-shipyard-winners]    | RevenueCat (Perttu Lähteenlahti)                   | Feb 26, 2026           | Shipyard winners post                                 |
| [rc-2024-announce]       | RevenueCat (Charlie Chapman)                       | Aug 3, 2024            | 2024 Ship-a-ton announcement                          |
| [rc-gurwi]               | RevenueCat (Perttu Lähteenlahti)                   | Sep 3, 2026            | Gurwi case study                                      |
| [rc-rudrank]             | RevenueCat (Perttu Lähteenlahti)                   | Jul 31, 2025           | Interview with Rudrank Riyam                          |
| [rc-mansour]             | RevenueCat (Perttu Lähteenlahti)                   | Aug 22, 2025           | Interview with Mansour Mahamat                        |
| [rc-tolaini]             | RevenueCat (Perttu Lähteenlahti)                   | Jul 28, 2025           | Interview with Leandro Tolaini                        |
| [rc-judge-2026]          | RevenueCat (Perttu Lähteenlahti)                   | Jun 26, 2026           | How Shipaton is judged                                |
| [rc-sale]                | RevenueCat                                         | —                      | 2026 #ShipatonSale deals                              |
| [rc-cat-grand]           | RevenueCat                                         | —                      | 2026 Grand Prize page                                 |
| [rc-cat-bip]             | RevenueCat                                         | —                      | 2026 #BuildInPublic page                              |
| [rc-cat-hamm]            | RevenueCat                                         | —                      | 2026 HAMM page                                        |
| [rc-cat-design]          | RevenueCat                                         | —                      | 2026 Design page                                      |
| [rc-cat-peace]           | RevenueCat                                         | —                      | 2026 Peace Prize page                                 |
| [rc-cat-onesignal]       | RevenueCat                                         | —                      | 2026 Keep Them Coming Back page                       |
| [rc-cat-kotlin]          | RevenueCat                                         | —                      | 2026 Ship Kotlin Everywhere page                      |
| [rc-cat-coi]             | RevenueCat                                         | —                      | 2026 Conflict of Interest page                        |
| [rc-cat-lawley]          | RevenueCat                                         | —                      | 2026 influencer brief (example)                       |
| [dp-2024]                | RevenueCat on Devpost                              | —                      | 2024 overview, prizes, judges                         |
| [dp-2024-gallery]        | Devpost                                            | —                      | 2024 project gallery                                  |
| [dp-2024-rules]          | RevenueCat on Devpost                              | —                      | 2024 official rules                                   |
| [dp-2024-updates]        | RevenueCat on Devpost                              | —                      | 2024 organizer updates                                |
| [dp-2025]                | RevenueCat on Devpost                              | —                      | 2025 overview, prizes, judges                         |
| [dp-2025-gallery]        | Devpost                                            | —                      | 2025 project gallery                                  |
| [dp-shipyard]            | RevenueCat on Devpost                              | —                      | Shipyard overview, prizes, judges                     |
| [dp-shipyard-gallery]    | Devpost                                            | —                      | Shipyard project gallery                              |
| [dp-shipyard-rules]      | RevenueCat on Devpost                              | —                      | Shipyard official rules                               |
| [dp-shipyard-update]     | RevenueCat on Devpost                              | —                      | Shipyard winners update                               |
| [dp-2026]                | RevenueCat on Devpost                              | —                      | 2026 overview, judges                                 |
| [dp-payout]              | Connor Burd on Devpost                             | Sep 29, 2025 (started) | Payout write-up (2025 Grand Prize)                    |
| [dp-gurwi]               | Camilo Peñalver, Jonnier Martinez on Devpost       | Sep 28, 2025 (started) | Gurwi write-up (2025 #BuildInPublic 1st)              |
| [dp-echo]                | Luca Kato, Meychinh Eang on Devpost                | Oct 1, 2025 (started)  | Echo Reminder write-up (2025 #BuildInPublic 2nd)      |
| [dp-tomo]                | Tammy H. on Devpost                                | Sep 30, 2025 (started) | Tomo Japan write-up (2025 #BuildInPublic 3rd)         |
| [dp-dayloop]             | Private user on Devpost                            | Sep 30, 2025 (started) | Dayloop write-up (2025 Design 1st)                    |
| [dp-skillme]             | Ferdinand Werner on Devpost                        | Sep 28, 2025 (started) | SkillMe write-up (2025 Design 2nd)                    |
| [dp-pitchlab]            | Jake Fishman on Devpost                            | Sep 30, 2025 (started) | PitchLab write-up (2025 Design 3rd)                   |
| [dp-readhim]             | Jay D on Devpost                                   | Sep 30, 2025 (started) | ReadHim write-up (2025 Buzziest Launch 1st)           |
| [dp-shutter]             | Elle Lewis on Devpost                              | Sep 23, 2025 (started) | Shutter Declutter write-up (2025 Buzziest Launch 2nd) |
| [dp-memolune]            | Ami Otsuka on Devpost                              | Sep 30, 2025 (started) | MemoLune write-up (2025 Buzziest Launch 3rd)          |
| [dp-vectorguard]         | Ellie Fausett, Weston Bell-Geddes on Devpost       | Sep 23, 2025 (started) | Vector Guard write-up (2025 HAMM 1st)                 |
| [dp-napkinmatic]         | Yosun Chang, Caramel Corgi on Devpost              | Oct 1, 2025 (started)  | Napkinmatic AI3D write-up (2025 HAMM 2nd)             |
| [dp-kigaru]              | Aika Talavera, Shashwat Aditya on Devpost          | Sep 30, 2025 (started) | Kigaru Talks write-up (2025 HAMM 3rd)                 |
| [dp-heartbeat]           | Aiden Forrest on Devpost                           | Sep 28, 2025 (started) | Heartbeat Hero write-up (2025 Peace Prize 1st)        |
| [dp-hearingbuddy]        | Scott Krager on Devpost                            | Sep 30, 2025 (started) | Hearing Buddy write-up (2025 Peace Prize 2nd)         |
| [dp-moodhaven]           | Craig Sartor on Devpost                            | Sep 29, 2025 (started) | MoodHaven write-up (2025 Peace Prize 3rd)             |
| [dp-otterday]            | Felix Plagge on Devpost                            | Sep 30, 2025 (started) | Otter Day write-up (2025 Best Vibes 1st)              |
| [dp-dripped]             | Mithilesh Chellappan on Devpost                    | Sep 30, 2025 (started) | Dripped write-up (2025 Best Vibes 2nd)                |
| [dp-maestlog]            | Oikon 48 on Devpost                                | Sep 30, 2025 (started) | MaestLog write-up (2025 Best Vibes 3rd)               |
| [dp-cookedthis]          | Natasha Wilson on Devpost                          | Sep 30, 2025 (started) | Cooked This write-up (2025 OneSignal 1st)             |
| [dp-voicetree]           | Ragnar Rebase, Sergey Haikov on Devpost            | Sep 25, 2025 (started) | Voicetree write-up (2025 OneSignal 2nd)               |
| [dp-friendy]             | Jane Chao, Luis Cesar Morales, Mia Yang on Devpost | Sep 30, 2025 (started) | Friendy+ write-up (2025 OneSignal 3rd)                |
| [dp-studient]            | PixelArc Ventures on Devpost                       | Sep 2, 2025 (started)  | Studient write-up (2025 OneSignal 4th)                |
| [dp-campnotes]           | Jay Wilson on Devpost                              | Sep 30, 2025 (started) | Camp Notes write-up (2025 OneSignal 5th)              |
| [dp-momental]            | Christian Krueger on Devpost                       | Sep 30, 2025 (started) | Momental write-up (2025 Kotlin 1st)                   |
| [dp-posturely]           | Rehaan Cubes on Devpost                            | Sep 30, 2025 (started) | Posturely write-up (2025 Kotlin 2nd)                  |
| [dp-stepsshare]          | Omar Altamimi on Devpost                           | Sep 28, 2025 (started) | Steps Share write-up (2025 Kotlin 3rd)                |
| [dp-drawit]              | Nikhil Mandlik, Rahul Ray on Devpost               | Sep 29, 2025 (started) | DrawIt write-up (2025 Kotlin 4th)                     |
| [dp-clipugc]             | Mirzamehdi Karimov on Devpost                      | Sep 30, 2025 (started) | ClipUGC write-up (2025 Kotlin 5th)                    |
| [dp-crystalabyss]        | JM DG, Antonio Borrero Granell on Devpost          | Oct 1, 2025 (started)  | Crystal Abyss write-up (2025 Staff and Sponsors)      |
| [dp-preplo]              | Razvan Statescu on Devpost                         | Feb 10, 2026 (started) | Preplo write-up (Shipyard)                            |
| [dp-bloom]               | Ak Deepankar on Devpost                            | Feb 10, 2026 (started) | Bloom write-up (Shipyard)                             |
| [dp-wanderbase]          | Benjamin Piggott on Devpost                        | Feb 12, 2026 (started) | WanderBase write-up (Shipyard)                        |
| [dp-remy]                | Nick Spreen on Devpost                             | Feb 12, 2026 (started) | Remy Reminders write-up (Shipyard)                    |
| [dp-editor]              | Francisco Martínez on Devpost                      | Feb 3, 2026 (started)  | Editor write-up (Shipyard)                            |
| [dp-sunnymoney]          | Shadin Cornelio on Devpost                         | Feb 12, 2026 (started) | Sunny Money write-up (Shipyard)                       |
| [dp-folio]               | Joshua Aideloje on Devpost                         | Feb 12, 2026 (started) | Folio write-up (Shipyard)                             |
| [dp-clatri]              | Camilo Peñalver on Devpost                         | Feb 10, 2026 (started) | Clatri write-up (Shipyard runner-up)                  |
| [dp-karo]                | Mustafa Yusuf, Riken Shah on Devpost               | Sep 17, 2024 (started) | Karo write-up (2024 Money 1st)                        |
| [dp-zerocam]             | Sergio Rodriguez Rama, Dmitry Novikov on Devpost   | Sep 10, 2024 (started) | Zerocam Mono write-up (2024 Money 2nd)                |
| [dp-partyanimals]        | Marcin Krasowski, Dawid Urbaniak on Devpost        | Sep 17, 2024 (started) | Party Animals write-up (2024 Money 3rd)               |
| [dp-flowmino]            | Raphael Saing, Florent Perillat on Devpost         | Sep 20, 2024 (started) | Flowmino write-up (2024 Design 1st)                   |
| [dp-rakun]               | Rakun team on Devpost                              | Sep 17, 2024 (started) | Rakun Talk write-up (2024 Design 2nd)                 |
| [dp-apol]                | Dario Digregorio on Devpost                        | Sep 19, 2024 (started) | Apol write-up (2024 Design 3rd)                       |
| [dp-meshing]             | Rudrank Riyam on Devpost                           | Sep 18, 2024 (started) | Meshing write-up (2024 #BuildInPublic 1st)            |
| [dp-foodsense]           | İrem Karaoğlu Sansak on Devpost                    | Sep 17, 2024 (started) | Food Sense write-up (2024 #BuildInPublic 2nd)         |
| [dp-bjjevolve]           | Mansour Mahamat-salle on Devpost                   | Sep 13, 2024 (started) | BJJ Evolve write-up (2024 #BuildInPublic 3rd)         |
| [as-payout]              | Payout LLC on the App Store                        | —                      | Payout listing                                        |
| [as-gurwi]               | Gurwi LLC on the App Store                         | —                      | Gurwi listing                                         |
| [as-gurwi-co]            | Gurwi LLC on the App Store                         | —                      | Gurwi listing, Colombia                               |
| [as-echo]                | Apple (App Store page)                             | —                      | Echo Reminder listing (not found)                     |
| [as-tomo]                | Tammy Ho on the App Store                          | —                      | Tomo Japan listing                                    |
| [as-dayloop]             | Aptiq Studio on the App Store                      | —                      | Dayloop listing                                       |
| [as-skillme]             | Ferdinand Werner on the App Store                  | —                      | SkillMe listing                                       |
| [as-pitchlab]            | PitchLab AI, Inc. on the App Store                 | —                      | PitchLab listing                                      |
| [as-readhim]             | New Horizon Innovations, LLC on the App Store      | —                      | ReadHim listing                                       |
| [as-shutter]             | Later Creative LLC on the App Store                | —                      | Shutter Declutter listing                             |
| [as-memolune]            | Hundreds LLC on the App Store                      | —                      | MemoLune listing                                      |
| [as-memolune-jp]         | Hundreds LLC on the App Store                      | —                      | MemoLune listing, Japan                               |
| [as-vectorguard]         | BUILT BY FOUNDRY, INC. on the App Store            | —                      | Vector Guard listing                                  |
| [as-napkinmatic]         | Apple (App Store page)                             | —                      | Napkinmatic listing (not found)                       |
| [as-kigaru]              | Shashwat Aditya on the App Store                   | —                      | Kigaru Talks listing                                  |
| [as-kigaru-jp]           | Shashwat Aditya on the App Store                   | —                      | Kigaru Talks listing, Japan                           |
| [as-heartbeat]           | Apple (App Store page)                             | —                      | Heartbeat Hero US listing (not found)                 |
| [as-heartbeat-gb]        | Aiden Forrest on the App Store                     | —                      | Heartbeat Hero listing, UK                            |
| [as-hearingbuddy]        | Krager Labs LLC on the App Store                   | —                      | Hearing Buddy listing                                 |
| [as-hearingbuddy-mac]    | Krager Labs LLC on the App Store                   | —                      | Hearing Buddy Everywhere (Mac) listing                |
| [as-moodhaven]           | Craig Sartor on the App Store                      | —                      | MoodHaven listing                                     |
| [as-otterday]            | Felix Manuel Plagge on the App Store               | —                      | Otter Day listing                                     |
| [as-dripped]             | Mithilesh Chellappan on the App Store              | —                      | Dripped listing                                       |
| [as-maestlog]            | Sho Ayuba on the App Store                         | —                      | MaestLog listing                                      |
| [as-cookedthis]          | Natasha Wilson on the App Store                    | —                      | Cooked This listing                                   |
| [as-voicetree]           | RSApps Nordics OU on the App Store                 | —                      | Voicetree listing                                     |
| [as-friendy]             | Chao Jane on the App Store                         | —                      | Friendy+ listing                                      |
| [as-studient]            | Apple (App Store page)                             | —                      | Studient listing (not found)                          |
| [as-campnotes]           | CCT Plus LLC on the App Store                      | —                      | Camp Notes listing                                    |
| [as-momental]            | Christian Krueger on the App Store                 | —                      | Momental listing                                      |
| [as-posturely]           | Mobil80 Solutions and Services on the App Store    | —                      | Posturely listing                                     |
| [as-stepsshare]          | Omar Altamimi on the App Store                     | —                      | Steps Share listing                                   |
| [as-drawit]              | Nikhil Narayan Mandlik on the App Store            | —                      | DrawIt listing                                        |
| [as-clipugc]             | Measify Kft. on the App Store                      | —                      | ClipUGC listing                                       |
| [as-crystalabyss]        | Antonio Borrero Granell on the App Store           | —                      | Crystal Abyss listing                                 |
| [as-karo]                | Msquare Labs Technologies on the App Store         | —                      | Karo listing                                          |
| [as-zerocam]             | Zero Camera Ltd on the App Store                   | —                      | Zerocam Mono listing                                  |
| [as-partyanimals]        | Marcin Krasowski on the App Store                  | —                      | Party Animals listing                                 |
| [as-flowmino]            | Florent Perillat on the App Store                  | —                      | Flowmino (now Studious) listing                       |
| [as-rakun]               | David Pfluegl on the App Store                     | —                      | Rakun Talk listing                                    |
| [as-apol]                | Dario Digregorio on the App Store                  | —                      | Apol listing                                          |
| [as-meshing]             | Rudrank Riyam on the App Store                     | —                      | Meshing listing                                       |
| [as-foodsense]           | Irem Karaoglu on the App Store                     | —                      | Food Sense listing                                    |
| [as-bjjevolve]           | Mansour Mahamat on the App Store                   | —                      | BJJ Evolve (now Kombat Evolve) listing                |
| [as-bjjevolve-fr]        | Mansour Mahamat on the App Store                   | —                      | BJJ Evolve listing, France                            |
| [as-preplo]              | Razvan Statescu on the App Store                   | —                      | Preplo listing                                        |
| [as-remy]                | Sam Beckman Pty Ltd on the App Store               | —                      | Remy Reminders listing                                |
| [as-clatri]              | Gurwi LLC on the App Store                         | —                      | Clatri listing                                        |
| [lk-echo]                | Apple (iTunes lookup)                              | —                      | Echo Reminder app record                              |
| [lk-napkinmatic]         | Apple (iTunes lookup)                              | —                      | Napkinmatic app record                                |
| [lk-studient]            | Apple (iTunes lookup)                              | —                      | Studient app record                                   |
| [lk-skillme]             | Apple (iTunes lookup)                              | —                      | SkillMe app record                                    |
| [gp-payout]              | PAYOUT LLC                                         | —                      | Payout on Google Play                                 |
| [gp-gurwi]               | Gurwi LLC                                          | —                      | Gurwi on Google Play                                  |
| [gp-napkinmatic]         | AReality3D                                         | —                      | Napkinmatic on Google Play                            |
| [gp-kigaru]              | Kigaru                                             | —                      | Kigaru Talks on Google Play                           |
| [gp-otterday]            | Ascending Otters                                   | —                      | Otter Day on Google Play                              |
| [gp-studient]            | Google (Play page)                                 | —                      | Studient on Google Play (not found)                   |
| [gp-momental]            | Christian Krueger                                  | —                      | Momental on Google Play                               |
| [gp-posturely]           | Google (Play page)                                 | —                      | Posturely on Google Play (not found)                  |
| [gp-stepsshare]          | ItDeveApps                                         | —                      | Steps Share on Google Play                            |
| [gp-drawit]              | Bob the Builder                                    | —                      | DrawIt on Google Play                                 |
| [gp-clipugc]             | Measify Apps                                       | —                      | ClipUGC on Google Play                                |
| [gp-partyanimals]        | Bottom Button                                      | —                      | Party Animals on Google Play                          |
| [gp-apol]                | Dario Digregorio Studio                            | —                      | Apol on Google Play                                   |
| [gp-remy]                | Sam Beckman                                        | —                      | Remy Reminders on Google Play                         |
| [gp-bjjevolve]           | Kombat Evolve AB                                   | —                      | Kombat Evolve on Google Play                          |
| [yt-payout]              | Connor Burd                                        | —                      | Payout demo (sign-in required)                        |
| [yt-gurwi]               | Camilo Peñalver                                    | Sep 28, 2025           | Gurwi demo, 3:28                                      |
| [yt-echo]                | Lukato                                             | Sep 30, 2025           | Echo Reminder demo, 3:07                              |
| [yt-tomo]                | Tammy H.                                           | Sep 30, 2025           | Tomo Japan demo, 2:55                                 |
| [yt-dayloop]             | Selim Jouan                                        | Sep 29, 2025           | Dayloop demo, 2:54                                    |
| [yt-skillme]             | SkillMe                                            | Sep 18, 2025           | SkillMe demo, 3:11                                    |
| [yt-pitchlab]            | Jake Fishman                                       | Jun 1, 2025            | PitchLab demo, 1:55                                   |
| [yt-readhim]             | Jay Desai                                          | Sep 30, 2025           | ReadHim demo, 3:04                                    |
| [yt-shutter]             | Later Creative                                     | Sep 23, 2025           | Shutter Declutter demo, 2:33                          |
| [yt-memolune]            | Ami                                                | Sep 30, 2025           | MemoLune demo, 0:44                                   |
| [yt-vectorguard]         | Ellie Fausett                                      | Sep 23, 2025           | Vector Guard demo, 3:20                               |
| [yt-napkinmatic]         | Ina Centaur (Yosun Chang)                          | Oct 1, 2025            | Napkinmatic demo, 3:02                                |
| [yt-kigaru]              | Kigaru Talks                                       | —                      | Kigaru demo (sign-in required)                        |
| [yt-heartbeat]           | Aiden Forrest                                      | Sep 28, 2025           | Heartbeat Hero demo, 15:11                            |
| [yt-hearingbuddy]        | Hearing Buddy                                      | Sep 30, 2025           | Hearing Buddy demo, 3:59                              |
| [yt-moodhaven]           | MoodHaven                                          | Sep 29, 2025           | MoodHaven demo, 8:44                                  |
| [yt-otterday]            | Rudolf                                             | Sep 30, 2025           | Otter Day demo, 2:58                                  |
| [yt-dripped]             | Mithilesh Chellappan                               | Sep 30, 2025           | Dripped demo, 3:38                                    |
| [yt-maestlog]            | Oikon                                              | Sep 30, 2025           | MaestLog demo, 1:29                                   |
| [yt-cookedthis]          | Natasha Wilson                                     | Sep 30, 2025           | Cooked This demo, 2:45                                |
| [yt-friendy]             | ChaoCode                                           | Sep 30, 2025           | Friendy+ demo, 1:54                                   |
| [yt-studient]            | PixelArc                                           | Sep 2, 2025            | Studient demo, 1:36                                   |
| [yt-campnotes]           | HeyJay Codes                                       | Sep 30, 2025           | Camp Notes demo, 2:06                                 |
| [yt-momental]            | Chris Krueger                                      | Sep 30, 2025           | Momental demo, 2:21                                   |
| [yt-posturely]           | BuildWithRehu                                      | Sep 30, 2025           | Posturely demo, 3:46                                  |
| [yt-stepsshare]          | Omar Altamimi                                      | Sep 28, 2025           | Steps Share demo, 1:45                                |
| [yt-drawit]              | Nikhil Mandlik                                     | Sep 30, 2025           | DrawIt video, 5:27                                    |
| [yt-clipugc]             | Measify                                            | Sep 30, 2025           | ClipUGC promo, 1:50                                   |
| [yt-crystalabyss]        | Antonio Borrero Granell                            | Oct 1, 2025            | Crystal Abyss video, 0:54                             |
| [yt-preplo]              | Razvan Statescu                                    | Feb 10, 2026           | Preplo demo, 2:34                                     |
| [yt-bloom]               | Ak Deepankar                                       | Feb 10, 2026           | Bloom demo, 6:02                                      |
| [yt-wanderbase]          | Benjamin Piggott                                   | Feb 12, 2026           | WanderBase demo, 4:11                                 |
| [yt-remy]                | Nick Spreen                                        | Mar 26, 2026           | Remy demo, 4:52                                       |
| [yt-editor]              | Francisco Martínez                                 | Feb 8, 2026            | Editor demo, 2:30                                     |
| [yt-sunnymoney]          | Shadin Cornelio                                    | Feb 11, 2026           | Sunny Money demo, 3:28                                |
| [yt-folio]               | Joshua Aideloje                                    | Feb 11, 2026           | Folio demo, 2:16                                      |
| [yt-karo]                | Mustafa Yusuf                                      | Sep 17, 2024           | Karo promo, 0:48                                      |
| [yt-partyanimals]        | Bottom Button                                      | Sep 17, 2024           | Party Animals trailer, 3:00                           |
| [yt-flowmino]            | Raph & Flo                                         | Sep 19, 2024           | Flowmino intro, 3:26                                  |
| [yt-rakun]               | David Pfluegl                                      | Sep 17, 2024           | Rakun Talk video, 0:33                                |
| [yt-apol]                | Dario Digregorio                                   | Aug 12, 2024           | Apol demo, 2:58                                       |
| [yt-meshing]             | Rudrank Riyam                                      | Sep 17, 2024           | Meshing demo, 2:53                                    |
| [yt-foodsense]           | Irem Karaoglu                                      | Sep 17, 2024           | Food Sense demo, 1:45                                 |
| [yt-sam-remy]            | Sam Beckman                                        | Mar 26, 2026           | Creator review of Remy, 19:00                         |
| [yt-rudrank-2025]        | Rudrank Riyam                                      | Aug 1, 2025            | Shipaton 2025 day 2 vlog, 5:21                        |
| [yt-rudrank-2026]        | Rudrank Riyam                                      | Jul 19, 2026           | Shipaton 2026 plan, 7:50                              |
| [yt-kombat]              | Kombat Evolve                                      | Dec 9, 2025            | Founder video, 3:12                                   |
| [vm-voicetree]           | Voicetree on Vimeo                                 | —                      | Voicetree demo (private)                              |
| [yt-rudrank-playlist]    | Rudrank Riyam                                      | —                      | 2024 daily-log playlist                               |
| [statescu]               | Razvan Statescu                                    | —                      | Builder site (Preplo)                                 |
| [preplo-site]            | Preplo                                             | —                      | App site                                              |
| [eitan-ig]               | Eitan Bernath                                      | Feb 26, 2026           | Creator post on the win                               |
| [editor-site]            | Francisco Martínez                                 | —                      | App site (Editor)                                     |
| [ak25]                   | Ak Deepankar                                       | —                      | Builder portfolio (Bloom)                             |
| [folio-docs]             | Joshua Aideloje                                    | —                      | Build docs (Folio)                                    |
| [mufasa-bsky]            | Mustafa Yusuf                                      | Dec 26, 2024           | 2024 recap post (Karo)                                |
| [raph-x]                 | Raphael Saing                                      | Sep 24, 2024           | Win post (Flowmino)                                   |
| [flo-bsky]               | Florent Perillat                                   | Apr 1, 2026            | Studious relaunch post                                |
| [dario-bsky]             | Dario Digregorio                                   | Apr 7, 2025            | Apol growth post                                      |
| [rudrank-blog]           | Rudrank Riyam                                      | Aug 25, 2024           | Blog post during Ship-a-ton                           |
| [mansour-li-1]           | Mansour Mahamat-salle                              | Aug 7, 2024            | Day 1 build-in-public post                            |
| [mansour-li-2]           | Mansour Mahamat-salle                              | Jan 30, 2025           | Post on 1,000+ users                                  |
| [rsapps-blog]            | RSApps (Sergey Haikov)                             | Sep 15, 2025           | Voicetree OneSignal post                              |
| [rsapps-press]           | RSApps                                             | —                      | Voicetree press kit                                   |
| [tomo-medium-1]          | Tammy Ho                                           | Sep 25, 2025           | Tomo Japan Medium post, part 1                        |
| [tomo-medium-2]          | Tammy Ho                                           | Sep 27, 2025           | Tomo Japan Medium post, part 2                        |
| [tomo-medium-3]          | Tammy Ho                                           | Sep 30, 2025           | Tomo Japan Medium post, part 3                        |
| [yt-echo-update]         | Lukato                                             | Apr 8, 2026            | Echo update video, 1:16                               |
| [yt-friendy-win]         | ChaoCode                                           | Nov 26, 2025           | How Friendy+ placed 3rd, 12:38                        |
| [yt-friendy-playlist]    | ChaoCode                                           | —                      | Friendy+ build series                                 |
| [jw-5th]                 | Jay Wilson                                         | Oct 13, 2025           | Camp Notes win post                                   |
| [jw-paywall]             | Jay Wilson                                         | Oct 15, 2025           | Camp Notes paywall experiment                         |
| [jw-month1]              | Jay Wilson                                         | Oct 31, 2025           | MRR month-one recap                                   |
| [oikon-deck]             | Oikon (MaestLog)                                   | Oct 17, 2025           | Talk slides on building MaestLog                      |
| [note-memolune-1]        | Ami Otsuka                                         | Oct 16, 2025           | Post on winning (Japanese)                            |
| [note-memolune-2]        | Ami Otsuka                                         | Oct 21, 2025           | Post on commercial apps (Japanese)                    |
| [krueger-bsky]           | Chris Krueger                                      | Aug 13, 2025           | Momental launch post                                  |
| [momental-changelog]     | Momental                                           | —                      | App changelog                                         |
| [jetbrains-blog]         | JetBrains                                          | Jul 31, 2026           | Sponsor post quoting Momental                         |
| [yt-drawit-3]            | Rahul Ray                                          | Aug 24, 2025           | DrawIt episode 3, 7:37                                |
| [aiden-li]               | Aiden Forrest                                      | Oct 13, 2025           | Win post (Heartbeat Hero)                             |
| [ph-heartbeat]           | Aiden Forrest on Product Hunt                      | —                      | Product Hunt launch                                   |
| [yt-viva]                | Aiden Forrest                                      | Feb 14, 2026           | Shipyard demo of a new app, 14:02                     |
| [hb-about]               | Hearing Buddy                                      | —                      | About page                                            |
| [mith-x]                 | Mithilesh Chellappan                               | Sep 28, 2025           | First-revenue post (Dripped)                          |
| [mirze-li]               | Mirzamehdi Karimov                                 | Oct 14, 2025           | Win post (ClipUGC)                                    |
| [measify]                | Measify                                            | —                      | Studio site with live app stats                       |
| [crystal-site]           | Crystal Abyss                                      | —                      | Game site                                             |
| [ento-today]             | Entomology Today (secondary)                       | Mar 11, 2026           | Q&A with Vector Guard builder                         |
| [yt-coachos]             | Kigaru Talks                                       | Feb 12, 2026           | Shipyard entry video, 2:49                            |
| [rc-apps-2024]           | RevenueCat (Perttu Lähteenlahti)                   | —                      | 2024 app showcase                                     |
| [rc-x-shipyard]          | RevenueCat                                         | Feb 26, 2026           | Shipyard winners post on X                            |
| [dp-2025-extension]      | RevenueCat on Devpost                              | —                      | 2025 deadline extension notice                        |
| [granell-site]           | Antonio Borrero Granell, José D. Granell           | —                      | Builders site (Crystal Abyss)                         |
| [camilo-post]            | Camilo Peñalver                                    | Aug 4, 2026            | How Gurwi was built and won                           |
| [dp-2025-winners-update] | RevenueCat on Devpost                              | —                      | 2025 winners announcement                             |
| [connor-x-2024]          | Connor Burd                                        | Jul 8, 2025            | Post on his 2024 entry                                |
| [connor-x-day1]          | Connor Burd                                        | Aug 5, 2025            | Payout day-one post                                   |
| [connor-x-organic]       | Connor Burd                                        | Aug 29, 2025           | Post on organic growth                                |
| [connor-x-10k]           | Connor Burd                                        | Sep 7, 2025            | Post on $10K MRR                                      |
| [connor-x-20k]           | Connor Burd                                        | Sep 24, 2025           | Post on $20K MRR                                      |
| [connor-x-60k]           | Connor Burd                                        | Dec 5, 2025            | Post on 60K MRR                                       |
| [connor-x-acquire]       | Connor Burd                                        | Jan 21, 2026           | Offer to sell Payout                                  |
| [connor-x-gpt]           | Connor Burd                                        | May 9, 2026            | Post on how Payout was built                          |
| [connor-x-name]          | Connor Burd                                        | Aug 16, 2025           | Reply naming Payout                                   |
| [connor-x-55k]           | Connor Burd                                        | Oct 13, 2025           | Post on winning                                       |
| [khristo-x]              | Mike Khristo                                       | Oct 13, 2025           | Reply on entry counts                                 |
| [casper-x-217k]          | Casper Capital                                     | Jan 2, 2026            | Payout economics reply                                |
| [subclub-x]              | Sub Club (RevenueCat)                              | Jul 8, 2026            | Episode promo                                         |
| [yt-subclub-connor]      | Sub Club by RevenueCat                             | Jul 9, 2026            | Sub Club Live with Connor Burd, 1:17:34               |
| [yt-ceremony-2025]       | RevenueCat                                         | Oct 21, 2025           | Shipaton 2025 award ceremony, 27:23                   |
| [yt-ceremony-2024]       | RevenueCat                                         | Sep 26, 2024           | Ship-a-ton winners ceremony, 54:26                    |
| [yt-howtowin]            | RevenueCat                                         | Aug 4, 2026            | How to win Shipaton session, 1:09:06                  |
| [yt-shippies-2025]       | RevenueCat                                         | Oct 21, 2025           | Shippies 2025 ceremony, 18:53                         |
| [yt-superwall-connor]    | Superwall (interview)                              | Dec 17, 2025           | Interview with Connor Burd, 48:06                     |
| [busdownbonnor]          | Connor Burd                                        | —                      | Personal site                                         |
| [burd-case]              | BURD (Connor Burd)                                 | —                      | Payout case study                                     |
| [rc-x-payout]            | RevenueCat                                         | Oct 13, 2025           | Winners thread, Payout                                |
| [rc-x-gurwi]             | RevenueCat                                         | Oct 13, 2025           | Winners thread, Gurwi                                 |
| [camilo-x-ads]           | Camilo Peñalver                                    | Sep 1, 2025            | Post on English ads                                   |
| [camilo-x-trials]        | Camilo Peñalver                                    | Sep 20, 2025           | Post on the paywall change                            |
| [camilo-x-25k]           | Camilo Peñalver                                    | Nov 3, 2025            | Post on 25,000 users                                  |
| [camilo-x-22k]           | Camilo Peñalver                                    | Jun 6, 2026            | Post on Gurwi sales                                   |
| [camilo-x-clatri]        | Camilo Peñalver                                    | Feb 26, 2026           | Post on the Shipyard prize                            |
| [mufasa-x]               | Mustafa Yusuf                                      | Jul 5, 2025            | Post on Karo and Shipaton                             |

[rc-2025-winners]: https://www.shipaton.com/blog/shipaton-2025-winners
[rc-2024-winners]: https://www.shipaton.com/blog/2024-ship-a-ton-winners
[rc-shipyard-winners]: https://www.shipaton.com/blog/shipyard-2026-winners
[rc-2024-announce]: https://www.shipaton.com/blog/revenuecat-ship-a-ton
[rc-gurwi]: https://www.shipaton.com/blog/gurwi-build-in-public-shipaton
[rc-rudrank]: https://www.shipaton.com/blog/shipaton-interview-with-rudrank-riyam
[rc-mansour]: https://www.shipaton.com/blog/how-shipaton-turned-mansour-mahamats-hobby-app-in-to-a-business
[rc-tolaini]: https://www.shipaton.com/blog/shipaton-interview-with-leandro-tolaini
[rc-judge-2026]: https://www.shipaton.com/blog/how-we-judge-shipaton
[rc-sale]: https://www.shipaton.com/shipaton-sale
[rc-cat-grand]: https://www.shipaton.com/categories/grand-prize
[rc-cat-bip]: https://www.shipaton.com/categories/build-in-public-award
[rc-cat-hamm]: https://www.shipaton.com/categories/hamm-award
[rc-cat-design]: https://www.shipaton.com/categories/revenuecat-design-award
[rc-cat-peace]: https://www.shipaton.com/categories/revenuecat-peace-prize
[rc-cat-onesignal]: https://www.shipaton.com/categories/keep-them-coming-back-award
[rc-cat-kotlin]: https://www.shipaton.com/categories/ship-kotlin-everywhere
[rc-cat-coi]: https://www.shipaton.com/categories/conflict-of-interest-award
[rc-cat-lawley]: https://www.shipaton.com/categories/christopher-lawley
[dp-2024]: https://revenuecat-ship-a-ton.devpost.com/
[dp-2024-gallery]: https://revenuecat-ship-a-ton.devpost.com/project-gallery
[dp-2024-rules]: https://revenuecat-ship-a-ton.devpost.com/rules
[dp-2024-updates]: https://revenuecat-ship-a-ton.devpost.com/updates
[dp-2025]: https://revenuecat-shipaton-2025.devpost.com/
[dp-2025-gallery]: https://revenuecat-shipaton-2025.devpost.com/project-gallery
[dp-shipyard]: https://revenuecat-shipyard-2026.devpost.com/
[dp-shipyard-gallery]: https://revenuecat-shipyard-2026.devpost.com/project-gallery
[dp-shipyard-rules]: https://revenuecat-shipyard-2026.devpost.com/rules
[dp-shipyard-update]: https://revenuecat-shipyard-2026.devpost.com/updates/41060-announcing-the-winners-of-shipyard-creator-contest
[dp-2026]: https://revenuecat-shipaton-2026.devpost.com/
[dp-payout]: https://devpost.com/software/payout-cwdniv
[dp-gurwi]: https://devpost.com/software/gurwi-learn-anything
[dp-echo]: https://devpost.com/software/echo-bedpzr
[dp-tomo]: https://devpost.com/software/tomo-japan
[dp-dayloop]: https://devpost.com/software/dayloop-everyday-timelapse
[dp-skillme]: https://devpost.com/software/skillme
[dp-pitchlab]: https://devpost.com/software/pitchlab
[dp-readhim]: https://devpost.com/software/readhim
[dp-shutter]: https://devpost.com/software/shutter-declutter
[dp-memolune]: https://devpost.com/software/memolune
[dp-vectorguard]: https://devpost.com/software/vector-gaurd
[dp-napkinmatic]: https://devpost.com/software/napkinmatic-ai3d
[dp-kigaru]: https://devpost.com/software/kigaru-talks
[dp-heartbeat]: https://devpost.com/software/heartbeat-hero
[dp-hearingbuddy]: https://devpost.com/software/hearing-buddy
[dp-moodhaven]: https://devpost.com/software/moodhaven
[dp-otterday]: https://devpost.com/software/otter-day-weekday-guesser
[dp-dripped]: https://devpost.com/software/dripped-personal-stylist
[dp-maestlog]: https://devpost.com/software/maestlog-your-personal-symphony-journal
[dp-cookedthis]: https://devpost.com/software/cooked-this
[dp-voicetree]: https://devpost.com/software/voicetree
[dp-friendy]: https://devpost.com/software/friendtimeline
[dp-studient]: https://devpost.com/software/studient
[dp-campnotes]: https://devpost.com/software/camp-notes
[dp-momental]: https://devpost.com/software/momental
[dp-posturely]: https://devpost.com/software/posturely-sit-straight
[dp-stepsshare]: https://devpost.com/software/steps-share
[dp-drawit]: https://devpost.com/software/drawit-a-mutiplatform-draw-guess-game
[dp-clipugc]: https://devpost.com/software/clipugc
[dp-crystalabyss]: https://devpost.com/software/crystal-abyss
[dp-preplo]: https://devpost.com/software/preplo
[dp-bloom]: https://devpost.com/software/bloom-rhmx46
[dp-wanderbase]: https://devpost.com/software/wanderbase-the-van-life-community
[dp-remy]: https://devpost.com/software/remy-reminders
[dp-editor]: https://devpost.com/software/editor-decide-with-clarity
[dp-sunnymoney]: https://devpost.com/software/sunnier
[dp-folio]: https://devpost.com/software/folio-n7mugb
[dp-clatri]: https://devpost.com/software/clatri-ved84t
[dp-karo]: https://devpost.com/software/karo-trj4av
[dp-zerocam]: https://devpost.com/software/zerocam-mono
[dp-partyanimals]: https://devpost.com/software/party-animals-truth-or-dare-game
[dp-flowmino]: https://devpost.com/software/flowmino
[dp-rakun]: https://devpost.com/software/rakun-talk
[dp-apol]: https://devpost.com/software/apol-debate-smarter-with-ai-rands3
[dp-meshing]: https://devpost.com/software/meshing
[dp-foodsense]: https://devpost.com/software/foodsense-enwz2m
[dp-bjjevolve]: https://devpost.com/software/bjj-evolve
[as-payout]: https://apps.apple.com/us/app/id6748968935
[as-gurwi]: https://apps.apple.com/us/app/id6737016341
[as-gurwi-co]: https://apps.apple.com/co/app/id6737016341
[as-echo]: https://apps.apple.com/us/app/id6752544263
[as-tomo]: https://apps.apple.com/us/app/id6752227712
[as-dayloop]: https://apps.apple.com/us/app/id6740197860
[as-skillme]: https://apps.apple.com/us/app/id6749891663
[as-pitchlab]: https://apps.apple.com/us/app/id6738223162
[as-readhim]: https://apps.apple.com/us/app/id6751736922
[as-shutter]: https://apps.apple.com/us/app/id6745152835
[as-memolune]: https://apps.apple.com/us/app/id6752797808
[as-memolune-jp]: https://apps.apple.com/jp/app/id6752797808
[as-vectorguard]: https://apps.apple.com/us/app/id6749871217
[as-napkinmatic]: https://apps.apple.com/us/app/id6590601686
[as-kigaru]: https://apps.apple.com/us/app/id6749827005
[as-kigaru-jp]: https://apps.apple.com/jp/app/id6749827005
[as-heartbeat]: https://apps.apple.com/us/app/id6736655661
[as-heartbeat-gb]: https://apps.apple.com/gb/app/id6736655661
[as-hearingbuddy]: https://apps.apple.com/us/app/id6747363502
[as-hearingbuddy-mac]: https://apps.apple.com/us/app/id6752637457
[as-moodhaven]: https://apps.apple.com/us/app/id6752584907
[as-otterday]: https://apps.apple.com/us/app/id6747994124
[as-dripped]: https://apps.apple.com/us/app/id6749790183
[as-maestlog]: https://apps.apple.com/us/app/id6752569728
[as-cookedthis]: https://apps.apple.com/us/app/id6749899791
[as-voicetree]: https://apps.apple.com/us/app/id6747253996
[as-friendy]: https://apps.apple.com/us/app/id6752370787
[as-studient]: https://apps.apple.com/us/app/id6751546811
[as-campnotes]: https://apps.apple.com/us/app/id6749878726
[as-momental]: https://apps.apple.com/us/app/id6749689590
[as-posturely]: https://apps.apple.com/us/app/id6752023992
[as-stepsshare]: https://apps.apple.com/us/app/id6751459595
[as-drawit]: https://apps.apple.com/us/app/id6751777472
[as-clipugc]: https://apps.apple.com/us/app/id6752866581
[as-crystalabyss]: https://apps.apple.com/us/app/id6751184987
[as-karo]: https://apps.apple.com/us/app/id6478765400
[as-zerocam]: https://apps.apple.com/us/app/id6520394061
[as-partyanimals]: https://apps.apple.com/us/app/id6504725885
[as-flowmino]: https://apps.apple.com/us/app/id6642672538
[as-rakun]: https://apps.apple.com/us/app/id6590636136
[as-apol]: https://apps.apple.com/us/app/id6566170239
[as-meshing]: https://apps.apple.com/us/app/id6567933550
[as-foodsense]: https://apps.apple.com/us/app/id6670406876
[as-bjjevolve]: https://apps.apple.com/us/app/id6661028838
[as-bjjevolve-fr]: https://apps.apple.com/fr/app/id6661028838
[as-preplo]: https://apps.apple.com/us/app/id6758678654
[as-remy]: https://apps.apple.com/us/app/id6759920556
[as-clatri]: https://apps.apple.com/us/app/id6755964865
[lk-echo]: https://itunes.apple.com/lookup?id=6752544263&country=us
[lk-napkinmatic]: https://itunes.apple.com/lookup?id=6590601686&country=us
[lk-studient]: https://itunes.apple.com/lookup?id=6751546811&country=us
[lk-skillme]: https://itunes.apple.com/lookup?id=6749891663&country=us
[gp-payout]: https://play.google.com/store/apps/details?id=com.payout.app
[gp-gurwi]: https://play.google.com/store/apps/details?id=com.gurwi
[gp-napkinmatic]: https://play.google.com/store/apps/details?id=com.ai3d.napkinmatic
[gp-kigaru]: https://play.google.com/store/apps/details?id=com.kigarutalks.conversations
[gp-otterday]: https://play.google.com/store/apps/details?id=fpdigitallabs.otter
[gp-studient]: https://play.google.com/store/apps/details?id=com.daya.studient
[gp-momental]: https://play.google.com/store/apps/details?id=ai.momental
[gp-posturely]: https://play.google.com/store/apps/details?id=com.mobil80.posturely
[gp-stepsshare]: https://play.google.com/store/apps/details?id=com.itdeveapps.stepsshare
[gp-drawit]: https://play.google.com/store/apps/details?id=com.guessink.game
[gp-clipugc]: https://play.google.com/store/apps/details?id=com.measify.clipugc
[gp-partyanimals]: https://play.google.com/store/apps/details?id=com.OreganoCrew.PartyGame
[gp-apol]: https://play.google.com/store/apps/details?id=app.apol.dario.digregorio
[gp-remy]: https://play.google.com/store/apps/details?id=app.heyremy
[gp-bjjevolve]: https://play.google.com/store/apps/details?id=com.group.bjjevolver
[yt-payout]: https://www.youtube.com/watch?v=C7GRMcHE0HQ
[yt-gurwi]: https://www.youtube.com/watch?v=Nx3xOI5uX-Q
[yt-echo]: https://www.youtube.com/watch?v=xGh3FqCjn3U
[yt-tomo]: https://www.youtube.com/watch?v=j_n3MH4-bWk
[yt-dayloop]: https://www.youtube.com/watch?v=vGQ2Mi9RiFc
[yt-skillme]: https://www.youtube.com/watch?v=GM9jR3jWIko
[yt-pitchlab]: https://www.youtube.com/watch?v=gZITndtsZbo
[yt-readhim]: https://www.youtube.com/watch?v=eQtuOMOvMuE
[yt-shutter]: https://www.youtube.com/watch?v=3tH5PkbjEhk
[yt-memolune]: https://www.youtube.com/watch?v=MIlejnBok24
[yt-vectorguard]: https://www.youtube.com/watch?v=hXMVHLRPAfI
[yt-napkinmatic]: https://www.youtube.com/watch?v=fuaEaOllXds
[yt-kigaru]: https://www.youtube.com/watch?v=7fzXS4K4jj8
[yt-heartbeat]: https://www.youtube.com/watch?v=RYn1gSTS30o
[yt-hearingbuddy]: https://www.youtube.com/watch?v=d3DKg8JQAXs
[yt-moodhaven]: https://www.youtube.com/watch?v=zIQ24vAs_zM
[yt-otterday]: https://www.youtube.com/watch?v=unR3POWJAGA
[yt-dripped]: https://www.youtube.com/watch?v=asPU_BcKWNs
[yt-maestlog]: https://www.youtube.com/watch?v=73w0-4KfkDI
[yt-cookedthis]: https://www.youtube.com/watch?v=2hbY4qjEmwg
[yt-friendy]: https://www.youtube.com/watch?v=w_4gWSupCFQ
[yt-studient]: https://www.youtube.com/watch?v=NG-jww3zqug
[yt-campnotes]: https://www.youtube.com/watch?v=DLPU1-HE7WI
[yt-momental]: https://www.youtube.com/watch?v=l6C2hp5CS4s
[yt-posturely]: https://www.youtube.com/watch?v=zSK9wxqGyWc
[yt-stepsshare]: https://www.youtube.com/watch?v=78NuHU3vP7Q
[yt-drawit]: https://www.youtube.com/watch?v=UuxnaNjmSqg
[yt-clipugc]: https://www.youtube.com/watch?v=qORYIfJnAyE
[yt-crystalabyss]: https://www.youtube.com/watch?v=1ppfiq-mXBs
[yt-preplo]: https://www.youtube.com/watch?v=w2bPSX2A6ok
[yt-bloom]: https://www.youtube.com/watch?v=Jcy9u53wP9g
[yt-wanderbase]: https://www.youtube.com/watch?v=0GjjdV4Mgik
[yt-remy]: https://www.youtube.com/watch?v=8GWc0P02ah4
[yt-editor]: https://www.youtube.com/watch?v=2RdbTvwcqeY
[yt-sunnymoney]: https://www.youtube.com/watch?v=9HCwPfJqLfE
[yt-folio]: https://www.youtube.com/watch?v=f5YTJdobueo
[yt-karo]: https://www.youtube.com/watch?v=G5_DsAv1nVQ
[yt-partyanimals]: https://www.youtube.com/watch?v=iiAvrKLAOHk
[yt-flowmino]: https://www.youtube.com/watch?v=UxS9razsRlw
[yt-rakun]: https://www.youtube.com/watch?v=Re_IGz_SbZ8
[yt-apol]: https://www.youtube.com/watch?v=dTxq-KgDvyU
[yt-meshing]: https://www.youtube.com/watch?v=t-c5ahiDOg4
[yt-foodsense]: https://www.youtube.com/watch?v=F3G2p-j3WwI
[yt-sam-remy]: https://www.youtube.com/watch?v=-1zDi7rChxg
[yt-rudrank-2025]: https://www.youtube.com/watch?v=2yD_s0lx_F0
[yt-rudrank-2026]: https://www.youtube.com/watch?v=2J4Wc6kgKxc
[yt-kombat]: https://www.youtube.com/watch?v=_zaERPr2hlw
[vm-voicetree]: https://vimeo.com/1121619179
[yt-rudrank-playlist]: https://www.youtube.com/playlist?list=PLmlmfQfYC3JtR7VF6z-et9pF91or40w1S
[statescu]: https://statescu.net/
[preplo-site]: https://preplo.app/
[eitan-ig]: https://www.instagram.com/p/DVO1BWjD8IP/
[editor-site]: https://editor.framara.net/
[ak25]: https://ak25.in/
[folio-docs]: https://folio-docs.pages.dev/
[mufasa-bsky]: https://bsky.app/profile/mufasayc.com/post/3lea47zfqnk2h
[raph-x]: https://x.com/raphsaing/status/1838536653973131383
[flo-bsky]: https://bsky.app/profile/floperillat.bsky.social/post/3mihamfcyu223
[dario-bsky]: https://bsky.app/profile/dariodigregorio.bsky.social/post/3lm7xtdmjfc2l
[rudrank-blog]: https://rudrank.com/exploring-indie-life-participating-in-revenuecats-ship-a-ton-challenge
[mansour-li-1]: https://www.linkedin.com/posts/mansour-mahamat-salle-138b73138_build-in-public-day-1-im-building-a-bjj-activity-7226969945715183618-64Nl
[mansour-li-2]: https://fr.linkedin.com/posts/mansour-mahamat-salle-138b73138_du-hackathon-aux-1000-utilisateurs-activity-7290670573091713026-Xuwl
[rsapps-blog]: https://rsapps.eu/blog/using-onesignal-to-boost-engagement/
[rsapps-press]: https://rsapps.eu/press/voicetree/
[tomo-medium-1]: https://medium.com/@th52/shipaton-hackathon-part-1-the-journey-to-my-app-tomo-japan-d6ebee223759
[tomo-medium-2]: https://medium.com/@th52/build-in-public-hackathon-part-ii-architectural-journey-from-0-1-for-my-mobile-app-tomo-japan-ade13e53a41d
[tomo-medium-3]: https://medium.com/@th52/build-in-public-part-iii-a-secret-weapon-for-every-indie-dev-06cfb54b49b8
[yt-echo-update]: https://www.youtube.com/watch?v=HKEQ8EGMEBg
[yt-friendy-win]: https://www.youtube.com/watch?v=Xl7igycngLg
[yt-friendy-playlist]: https://www.youtube.com/playlist?list=PLXM8k1EWy5khz83Elqa7WbAgkEE97EkZZ
[jw-5th]: https://www.jaywilson.zip/posts/2025/10/13-1241-5thplace/
[jw-paywall]: https://www.jaywilson.zip/posts/2025/10/15-0821-campnotes-paywall/
[jw-month1]: https://www.jaywilson.zip/posts/2025/10/31-0001-journey-to-1000mrr/
[oikon-deck]: https://speakerdeck.com/oikon48/claude-codewoqu-shi-sitachu-metenoiosapurikai-fa-zerokara3zhou-jian-degurobaruhatukasonderu-shang-surumade
[note-memolune-1]: https://note.com/amiotsuka/n/n7e4d2bea587a
[note-memolune-2]: https://note.com/amiotsuka/n/nac5a5282ff08
[krueger-bsky]: https://bsky.app/profile/chriskrueger.dev/post/3lwbogqdzxc2g
[momental-changelog]: https://momental.ai/changelog
[jetbrains-blog]: https://blog.jetbrains.com/kotlin/2026/07/know-kotlin-ship-it-everywhere-and-win-at-shipaton-2026/
[yt-drawit-3]: https://www.youtube.com/watch?v=EuRalrn1RIw
[aiden-li]: https://www.linkedin.com/posts/aiden-forrest-368aa0244_shipaton-2025-winners-revenuecat-activity-7383581364350029824-eK0U
[ph-heartbeat]: https://www.producthunt.com/products/heartbeat-hero
[yt-viva]: https://www.youtube.com/watch?v=QIGg3kbsHvI
[hb-about]: https://hearingbuddyapp.com/about
[mith-x]: https://x.com/notagodzilla/status/1972237800511554035
[mirze-li]: https://www.linkedin.com/posts/mirzemehdi_shipaton-2025-winners-activity-7383795211522625536-mR-k
[measify]: https://www.measify.com
[crystal-site]: https://crystal-abyss.com
[ento-today]: https://entomologytoday.org/2026/03/11/vector-guard-app-arthropod-borne-disease-risk-antlion-pit/
[yt-coachos]: https://www.youtube.com/watch?v=N3JFTe_pjO0
[rc-apps-2024]: https://apps.shipaton.com/2024
[rc-x-shipyard]: https://x.com/RevenueCat/status/2027051816202928355
[dp-2025-extension]: https://revenuecat-shipaton-2025.devpost.com/updates/38700-a-shipaton-extension
[granell-site]: https://granell.dev
[camilo-post]: https://camilopenalver.com/en/me-and-gurwi/
[dp-2025-winners-update]: https://revenuecat-shipaton-2025.devpost.com/updates/39047-shipaton-2025-winners-announced
[connor-x-2024]: https://x.com/BusDownBonnor/status/1942456915600294052
[connor-x-day1]: https://x.com/BusDownBonnor/status/1952844749578354768
[connor-x-organic]: https://x.com/BusDownBonnor/status/1961474963946545499
[connor-x-10k]: https://x.com/BusDownBonnor/status/1964787497214562370
[connor-x-20k]: https://x.com/BusDownBonnor/status/1970901340273643608
[connor-x-60k]: https://x.com/BusDownBonnor/status/1997086300349124761
[connor-x-acquire]: https://x.com/BusDownBonnor/status/2014266787370500134
[connor-x-gpt]: https://x.com/BusDownBonnor/status/2053223146690425335
[connor-x-name]: https://x.com/BusDownBonnor/status/1956822765144854614
[connor-x-55k]: https://x.com/BusDownBonnor/status/1977751899529945334
[khristo-x]: https://x.com/MikeKhristo/status/1977840839708844150
[casper-x-217k]: https://x.com/CapitalCasper/status/2007014444342415506
[subclub-x]: https://x.com/SubClubHQ/status/2074898056034779318
[yt-subclub-connor]: https://www.youtube.com/watch?v=rD3MeYGqaec
[yt-ceremony-2025]: https://www.youtube.com/watch?v=I3HOCMwxKL4
[yt-ceremony-2024]: https://www.youtube.com/watch?v=YLaQWEVUniY
[yt-howtowin]: https://www.youtube.com/watch?v=HIyLyX8tkHs
[yt-shippies-2025]: https://www.youtube.com/watch?v=u4iiTpoPaqE
[yt-superwall-connor]: https://www.youtube.com/watch?v=zpTXi8WxeM0
[busdownbonnor]: https://busdownbonnor.com
[burd-case]: https://burd.llc/case-study
[rc-x-payout]: https://x.com/RevenueCat/status/1977744476689834050
[rc-x-gurwi]: https://x.com/RevenueCat/status/1977744479911018909
[camilo-x-ads]: https://x.com/camilopenalver/status/1962660252526039110
[camilo-x-trials]: https://x.com/camilopenalver/status/1969347019685704185
[camilo-x-25k]: https://x.com/camilopenalver/status/1985336042656862631
[camilo-x-22k]: https://x.com/camilopenalver/status/2063337732806787293
[camilo-x-clatri]: https://x.com/camilopenalver/status/2027090644548608244
[mufasa-x]: https://x.com/mufasaYC/status/1941543901208379675

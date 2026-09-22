# Shipaton 2026 idea

Guessling is the app this team will ship for RevenueCat Shipaton 2026: a
daily 20-questions game in which Jev answers any yes-or-no question a player
types, the same way for every player. Ten rounds of ideation chose it, and
the [ideation log](/docs/research/ideation.md) records each one. The
[brief](/docs/BRIEF.md) and the [context](/docs/CONTEXT.md) hold the
contest's rules and background, so this document links to them, with facts
as of September 22, 2026.

Contents:

1.  [At a glance](#at-a-glance)
1.  [Problem and audience](#problem-and-audience)
1.  [What the app does](#what-the-app-does)
1.  [How Jev fits](#how-jev-fits)
1.  [Monetization](#monetization)
1.  [Categories to enter](#categories-to-enter)
1.  [Build plan](#build-plan)
1.  [Launch and pitch](#launch-and-pitch)
1.  [Risks](#risks)
1.  [How the idea was chosen](#how-the-idea-was-chosen)
1.  [Assumptions and open questions](#assumptions-and-open-questions)
1.  [See also](#see-also)

## At a glance

- **Name:** "Guessling: Daily 20 Questions" on the App Store, 29 characters,
  with the subtitle "Ask anything. Guess the thing."
- **Logline:** "For people who finish the day's word puzzles in minutes,
  Guessling helps them uncover a hidden thing each day by answering any
  yes-or-no question they type, the same way for every player, so they get a
  fair new deduction puzzle every day."
- **Store:** the App Store, on iPhone. A new personal Google Play account
  or the Galaxy Store can't be live in time; see
  [getting through store review][ctx-review].
- **Price:** today's puzzle is free. Guessling+ opens the archive of past
  puzzles for $19.99 a year with a 3-day free trial, or $2.99 a month.
- **Categories:** Best Game first and HAMM second. The Grand Prize considers
  every eligible entry.
- **Jev's job:** Jev checks every puzzle's answers before it ships, matches
  each typed question to a checked answer, and answers the rest live.
- **Dates:** in App Store review by Thursday, September 24, a day after the
  brief's [suggested date][brief-dates], which the ideation's
  [constraint C2][log-r1] accepts; live as soon as it's approved, and by
  Sunday, September 27 at the latest; submitted on Devpost by Wednesday,
  September 30 at 11:45 PM PT; free for judges until judging ends on
  October 13, under the [official rules][ctx-rules].

[ctx-review]: /docs/CONTEXT.md#getting-through-store-review
[brief-dates]: /docs/BRIEF.md#key-dates
[log-r1]: /docs/research/ideation.md#round-1-constraints-and-rubric
[ctx-rules]: /docs/CONTEXT.md#what-the-official-rules-add

## Problem and audience

- **Who:** people who play the day's word puzzles and want more than a few
  minutes of them. The habit is proven: NYT Games has 293,384 US ratings, and
  The New York Times Company says its Games team builds "communities that
  bring millions of people back to play every day". So is the genre:
  Akinator, which guesses what the player is thinking, has 422,100.
- **The gap:** in Akinator, the app asks the questions. The four apps found
  that let the player question an AI have 3 to 19 ratings each, so that
  format is unproven rather than rejected, and one of them draws reviews
  that punish answers that contradict themselves or hedge: "It either is
  nomadic or it isn't." None of them pairs a shared daily puzzle with
  questions in the player's own words.
- **The closest rival:** Das Verhör, in the 2026 gallery, already does:
  "Each day one new case lands on the table", and "You question the
  suspects in free text". It is in German, with fourteen questions to three
  suspects, and a "deterministic Swift engine" built for fairness.
  Guessling's difference is narrower than a new format: English, and
  yes-or-no questions about one hidden thing. Consistent answers are
  something Guessling has to measure and show, not something the rival
  lacks.
- **The field:** on September 22, the gallery held 148 games, 11 projects
  named Best Game, and none of the 15 word and trivia games, against 39
  arcade and 35 puzzle games, took free-form questions by their taglines.
  The field will grow before the deadline.

The [evidence notes][ev-hunch] and the [gallery notes][gallery-other] have
the sources.

[gallery-other]: /docs/research/gallery-2026.md#other-prize-categories

## What the app does

1.  **Open today's puzzle.** Everyone gets the same hidden thing and a
    short hint, such as "An animal", with twenty questions to find it.
1.  **Ask anything.** The player types a yes-or-no question in their own
    words, and before they can type the next one, the Guessling nods for
    Yes or shakes its head for No. When a question can't be settled, it
    shrugs and says "Ask another way", and the question doesn't count.
1.  **Guess.** The server checks the guess against the puzzle's accepted
    names, so the answer never ships in the app.
1.  **Share and come back.** A spoiler-free card goes to any chat, and a new
    puzzle arrives the next day.
1.  **Want more?** "Play yesterday's?" opens the paywall, and Guessling+
    opens the archive.

- **The character:** the Guessling knows the answer and reacts to every
  question. Its nod, head shake, shrug, and celebration give the game the
  art direction and tone that Best Game judges ask for.
- **Screens:** today's puzzle, the result and share card, the archive, the
  paywall, and settings with Restore Purchases, the privacy policy, and the
  terms. Every answer has "Report this answer", which sends it to the team,
  who fix the puzzle once the day ends, so everyone gets the same answers
  that day.
- **The "aha":** the first question typed in the player's own words,
  answered at once.
- **Left out of the first version:** accounts, leaderboards, friends, packs,
  push notifications, Android, and an iPad layout.

## How Jev fits

Jev is TypeSafe's hosted decision model, in early access. It answers typed
questions about text, as a Choice among options, a Score on a scale, or a
yes-or-no Noul, with probabilities, and it never writes text
([Jev notes][jev-what]). In Guessling it does three jobs, all through the
team's backend:

1.  **It checks each puzzle before the puzzle ships.** A script asks Jev every
    question in a bank of common questions, and each one's negation, with the
    puzzle's fact card as the state. A person fixes every answer between 0.3
    and 0.7 and every question and negation whose answers contradict each
    other.
1.  **It matches the player's question to the bank.** A Choice over the
    category's bank questions and their negations, about 200 options plus
    "none", under the 255 a Choice allows, picks the entry that asks the
    same thing, so a negated question gets the negated entry's answer. A
    confident match returns the checked answer, and the match is cached for
    the day by wording, so two wordings get one answer.
1.  **It answers what the bank doesn't cover.** A live Noul against the fact
    card gives Yes above 0.7, No below 0.3, and "Ask another way" in between.
    In the same request as the match, a Noul turns away anything that isn't
    a yes-or-no question about the hidden thing. A live answer is cached for
    the day, so every player gets the same one.

Questions about letters or spelling are answered in code from the card,
because Jev "does not count reliably". Jev also reads wording literally, and
"answers the question you wrote, not the one you meant", so the bank and the
consistency test carry the weight.

Why Jev fits the game:

- **It can't give the answer away.** Jev returns probabilities and the
  option keys the Worker supplied, never free text, so it can't spell out
  the secret, as a generative model could in its own words.
- **It's fast enough to feel like a conversation.** TypeSafe says most
  queries complete in about 100 ms, and its cookbooks, most of them run on
  `jev-1.12`, measured mean round trips of 111 and 114 ms, against 826 ms to
  13.9 s for the language models they compared ([latency][jev-latency]). The
  phone's trip to the Worker, and the Worker's trip to TypeSafe on the US
  West Coast, come on top.
- **It reads wordings nobody wrote down.** A hand-built table answers only
  the questions its authors predicted.
- **The caveat:** one rival already answers players' questions on the
  device with Apple's model, at no cost per question, which weakens both the
  case for Jev and a $2.99 monthly price ([evidence notes][ev-hunch]).

How it's wired:

- **The key stays on the server.** Jev has no mobile SDK, and TypeSafe's
  agreement requires the key to stay confidential. The app calls one
  Cloudflare Worker, which calls Jev through `@typesafe-ai/sdk` 0.6.0 with
  the model pinned to `jev-1.13.0`, because an alias "moves when a new
  release ships".
- **The SDK in a Worker:** the SDK declares Node 20 or newer, so the first
  day tests it in a Worker, with direct calls to the HTTP API as the
  fallback. SDK error text never reaches the app, since an open issue
  reports the key echoed into connection errors.
- **The pinned version:** no source says how long it stays available, so a
  move to `jev-latest` means running the consistency test again.
- **Busy or down:** the SDK retries busy responses (429 and 529) with
  backoff, the app shows a busy state, and the Worker still answers, in
  code, any wording that exactly matches a bank question.
- **Cost:** at $0.042 per million input tokens, a call the size of
  TypeSafe's quickstart costs about $0.000016 ([prices][jev-prices]). Even a
  Choice over a full bank, many times that size, costs a fraction of a cent,
  so cost is unlikely to limit the game. Early access and a limit of 1,200
  requests per minute, which "can change without notice", matter more, so
  the key is the first thing to request.

Data, consent, and terms:

- Only the typed questions go to TypeSafe, whose services are hosted in the
  United States, and Jev "is not trained on customer requests or
  responses".
- Before the first question, a notice names TypeSafe and asks permission,
  as guideline 5.1.2(i) requires before personal data goes to a third-party
  AI, and the privacy policy names TypeSafe too. The first build names it
  because 5.1.2(i) asks apps to "clearly disclose" third-party AI, and
  TypeSafe's agreement makes the team give users the notices that
  TypeSafe's use of their input needs (section 5). Section 16.4's exception
  for what is "required by Laws" may not cover an App Store rule, so
  TypeSafe is asked to confirm; if it objects, the notice says the
  questions go to "a third-party AI service", and the privacy policy
  describes it without the name. The Worker serves the notice's text, and
  the privacy policy is a web page, so either can change without an app
  update. A player who declines still plays: the Worker answers exact bank
  wordings in code, and nothing reaches TypeSafe. There are no accounts.
- TypeSafe says no part of its services "is directed to children" and
  doesn't knowingly handle personal data from anyone under 18. So Guessling
  stays out of the Kids category, the notice asks players not to type
  personal information, and the team asks TypeSafe whether younger players
  may use the game ([store review][jev-store]).
- TypeSafe's agreement allows the API inside the team's own app (section
  2.2) but not as "a standalone service"; Guessling is a game, not a relay.
  Section 16.4 grants no "right to use the name, brand, or logo of the
  other Party" and bars announcing the relationship without consent, so the
  request to TypeSafe on September 22 asks for consent to name Jev in the
  video and the write-up, and asks it to confirm the notice and the privacy
  policy ([terms][jev-terms]).

[jev-what]: /docs/research/jev.md#what-jev-is
[jev-latency]: /docs/research/jev.md#rate-limits-context-length-and-latency
[jev-prices]: /docs/research/jev.md#jev-prices
[jev-store]: /docs/research/jev.md#store-review-and-jev
[jev-terms]: /docs/research/jev.md#master-customer-agreement-terms-for-apps

## Monetization

The context has the [benchmarks and paywall rules][ctx-money]; this is how
Guessling applies them.

- **Free:** today's puzzle, every day. A daily game that locks its daily
  puzzle fights its genre.
- **Guessling+:** one entitlement that opens the archive of every past
  puzzle: ten at launch, and one more each day. Puzzle subscriptions already
  sell archives, as Apple News+ does with its "daily and archived" puzzles,
  and nothing Guessling+ promises is missing on launch day.
- **Plans:** yearly at $19.99 with a 3-day free trial, as the default, and
  monthly at $2.99. That's below NYT Games' $4.99 to $5.99 a month for a
  bundle, and above a single 20-questions rival's $0.99 a month. Both prices
  sit below the context's common ranges, which span every category; a
  single daily game prices like its genre instead.
- **Paywall:** one RevenueCat Paywall, configured remotely and dismissible,
  shown after today's result as "Play yesterday's?" and on any locked
  archive puzzle.
- **Trial length:** a trial started before 11:45 PM PT on September 27
  converts before the Submission Period closes on September 30, while
  revenue still counts toward the Grand Prize shortlist. The cost: a median
  25.5% of trials of 4 days or less become paid, against 37.4% at 5–9 days.
- **Judges:** an Apple offer code for a free month of Guessling+, created
  once the app is live: a custom code with a small redemption limit, since
  one-time-use codes come in batches of at least 500 (PAY-7 in the
  [PRD][prd-pay]). A code redeemed on October 1 lasts past the end of
  judging on October 13, and the daily puzzle needs no code.
- **What to measure:** paywall views, trial starts, and conversions from
  RevenueCat's charts, which count production purchases only.

[ctx-money]: /docs/CONTEXT.md#monetization-and-paywalls
[prd-pay]: /docs/PRD.md#the-paywall-and-purchases

## Categories to enter

The brief warns "don't try to jam your app into every prize category", so
Guessling enters two and the Grand Prize considers it anyway.

- **Best Game, first.** Judges want "strong gameplay, a clear art direction,
  and a monetization model that fits the genre instead of fighting it", in a
  game that is "coherent, playable, and convincing as a shipped experience".
  Guessling brings a proven loop made new by questions in the player's own
  words, the Guessling's art and tone, and a free daily puzzle with a paid
  archive. The video shows real play on an iPhone.
- **HAMM, second.** Judges want "a well-crafted paywall, thoughtful pricing
  and packaging, strong conversion, and monetization that genuinely fits the
  product". Guessling brings a paywall at the moment a player wants more,
  two plans with the yearly as the default, a trial timed to the deadline
  at some cost in conversion, and its conversion numbers.
- **Grand Prize, automatically.** Its shortlist counts revenue as reported
  in RevenueCat, so every sale goes through RevenueCat. Revenue builds the
  shortlist but "does not decide the winner" ([judging][brief-judging]), so
  the write-up also says what changed after launch and what was learned.

Left out, with the reason:

- **Growth Loop and #BuildInPublic:** the red team scored both 2 or lower,
  and Layers would add a tracking prompt to the one submission that can't
  afford a rejection.
- **Keep Them Coming Back:** it needs a working OneSignal integration and
  campaign, which the first version leaves out.
- **Design and Peace Prize:** five of the six past Design winners were
  native Swift apps, where Guessling is built with Expo, and a game isn't a
  social-good app.
- **The five Influencer Awards:** each is a fixed brief, and none asks for a
  game; the Gaming brief asks for a game backlog.
- **Catvertising:** Guessling shows no ads.
- **Ship Kotlin Everywhere and Best App for Galaxy:** they need Google Play
  or the Galaxy Store.
- **Funnel Vision, Idea to Income, and Most Viral App:** they need a web
  funnel, a build on Replit, or Noise's $50 daily minimum.
- **Next Gen and Conflict of Interest:** they're for students and for staff.

[brief-judging]: /docs/BRIEF.md#judging-process

## Build plan

Round 9 of the [ideation log][log-r9] has the reasoning behind this plan.

[log-r9]: /docs/research/ideation.md#round-9-scope-stack-and-schedule

### Stack and data flow

- **App:** Expo with TypeScript, `react-native-purchases` (10.10.1 on
  September 21, 2026), and RevenueCat Paywalls. The same language runs in
  the backend and in Jev's official SDK. A Swift team would build the same
  screens in SwiftUI with purchases-ios.
- **Backend:** one Cloudflare Worker that holds the Jev key, with Workers KV
  for the puzzles' fact cards and accepted names, the checked bank answers,
  and the daily schedule, and one Durable Object for each puzzle's answers, so
  two players can't get different answers to the same new wording. It sends
  the app the hint, answers the questions, and checks the guesses, so the
  secret never reaches the phone. It limits requests per device, caps retries
  and timeouts on answers a player is waiting for, and checks the Guessling+
  entitlement before serving an archive puzzle, since every call spends Jev
  credits.
- **Authoring:** a script runs Jev over the bank and its negations for each
  puzzle, lists what a person must fix, and uploads the checked puzzle. The bank
  starts at about 100 questions in each of four categories at launch: animals,
  foods, everyday objects, and places. The first two puzzles are a pilot that
  measures how many answers need a person; if that's more than the time allows,
  the bank shrinks to its most common questions rather than the launch set
  shrinking.
- **Purchases:** RevenueCat's anonymous IDs carry them, with no accounts. The
  Test Store key never ships.
- **Coding agents:** RevenueCat's AI Toolkit and MCP server help them wire
  the SDK, and TypeSafe's agent skill teaches them Jev's API.

### Scope of the first version

- **Must:** the daily puzzle loop; bank matching and live answers; "Ask
  another way"; guesses checked on the server; the share card; the
  Guessling's four reactions; the Guessling+ archive, paywall, and Restore
  Purchases; the permission notice before the first question; busy and
  offline states; "Report this answer"; the privacy policy and terms pages;
  the entitlement check on the server; and 17 checked puzzles by
  submission, ten for the archive and a week of daily ones, then at least
  one more a day, since Guessling+ promises one more each day.
- **Should:** a streak count, and haptics and sound.
- **Won't:** accounts, leaderboards, friends, packs, push notifications,
  Android, and iPad. The app runs on iPhone only, with iPad support turned
  off, since iPad screenshots are "Required if app runs on iPad".

### Schedule to September 30

- **Tuesday, September 22:** request the Jev key and ask TypeSafe's consent
  to name Jev; sign the Paid Apps Agreement and finish tax and banking; set
  up the RevenueCat project, the App Store Connect record, and the two
  subscriptions; write the question bank and the authoring script; check
  the first two puzzles as the pilot; stand up the Worker.
- **Wednesday, September 23:** the app's screens and the Guessling's art;
  bank matching and live answers; puzzles up to 17; the permission notice;
  the paywall and archive; the policy pages.
- **Thursday, September 24:** fix the flagged answers; run the consistency
  test; make the icon, the 6.9-inch screenshots, the 1179 × 2556 screenshot,
  and the metadata; submit the first build with its subscriptions, set to
  release automatically.
- **Friday, September 25 and Saturday, September 26:** in review. A
  rejection gets a fix for the cited guideline only and a same-day
  resubmission. Draft the launch posts and the video script.
- **Sunday, September 27, at the latest:** live, since the build releases
  automatically once approved. Create the offer codes, confirm a production
  purchase, which RevenueCat warns can take 24 hours to work after a first
  launch, and post the first public puzzle.
- **Monday, September 28:** record the video on an iPhone and upload it.
- **Tuesday, September 29:** write the Devpost description and category
  answers with the numbers so far, and go through the brief's
  [submission checklist][brief-checklist].
- **Wednesday, September 30:** refresh the numbers and submit before 11:45 PM
  PT, making sure Devpost shows the entry as submitted. Keep the Worker
  running, Jev's credits funded, and a new puzzle each day through at least
  October 22, the later of the dates given for the winners, and then for as
  long as any Guessling+ subscription runs, as the product's
  [business model][product-money] explains.

[brief-checklist]: /docs/BRIEF.md#submission-checklist
[product-money]: /docs/PRODUCT.md#business-model

### Review-safety checklist

The context's [review essentials][ctx-apple] apply in full; these are the
items specific to Guessling:

- The permission notice comes before the first question goes to TypeSafe,
  and the privacy label declares every data type the PRD's
  [listing requirements][prd-store] name, not only "Purchases" and the
  typed questions.
- No accounts, so no deletion flow, and no third-party login.
- The backend runs through review, and the review notes explain how to play.
- The app stays out of the Kids category.

[ctx-apple]: /docs/CONTEXT.md#apple-app-store-review-essentials
[prd-store]: /docs/PRD.md#app-store-listing-and-review

## Launch and pitch

The brief's [pitch advice][brief-pitch] and the context's
[video guidance][ctx-video] apply; this is Guessling's version.

- **First players, from Sunday, September 27:** the team's own network, the
  Shipaton Discord, and puzzle communities such as r/wordle and
  r/NYTConnections, within each community's rules on self-promotion. Every
  share card invites another player.
- **Numbers to report:** players, puzzles solved, questions asked, paywall
  views, trial starts, conversions, and revenue as RevenueCat reports it,
  plus the consistency test's results. The video carries about a day of
  numbers and the write-up about three, so rates will say more than totals.
- **Naming Jev:** only once TypeSafe consents; until then, "a hosted
  decision model". The video is recorded on September 28, so it names Jev
  only if consent has arrived by then.

The video, two minutes on an iPhone:

1.  **0:00–0:10:** one line on screen, "Daily puzzles end in minutes. Ask
    anything instead.", then the Guessling and today's hint, "An animal".
    The player types "Does it live in water?" and the Guessling shakes its
    head.
1.  **0:10–0:40:** a real round. Two wordings of one question get the same
    answer, a question the bank doesn't cover is answered live, and a
    correct guess ends in a celebration and a share card sent to Messages.
1.  **0:40–1:05:** art direction and tone: the Guessling's reactions and
    the reveal.
1.  **1:05–1:35:** "Play yesterday's?" opens the paywall, a purchase goes
    through, and the archive opens.
1.  **1:35–2:00:** the numbers since launch, the consistency test's result,
    and the two categories.

The write-up, in order: the logline; the problem, daily puzzles that end in
minutes and 20-questions apps that contradict themselves; how answers stay
the same for everyone; the money; the difference; the numbers; what changed
after launch and what was learned, for the Grand Prize; the categories and
why; and the AI tools used, credited openly.

[brief-pitch]: /docs/BRIEF.md#pitch-the-submission
[ctx-video]: /docs/CONTEXT.md#demo-video-and-write-up

## Risks

- **Answers contradict each other.** The checked bank and matching reduce
  it, though Jev reads wording literally and a question and its negation
  needn't agree. Trigger: on September 24, fewer than 90% of a test set of
  paraphrases, including negated wordings, reach the bank entry with the
  same meaning; then grow the bank before submitting.
- **No Jev key in time.** Request it on September 22, then write to
  `support@typesafe.ai` and ask in TypeSafe's Discord. Trigger: no key by
  noon PT on September 23; then people answer the bank by hand, questions
  outside it get "Ask another way", and Jev joins on the Worker when the key
  arrives, with no app update. Submit only once live answers work: a build
  that matches only exact wordings would answer most questions with "Ask
  another way" and risk guideline 2.1, App Completeness. September 26 is the
  latest first submission that leaves room for one rejection.
- **App Review rejects the build.** The review essentials cover the common
  causes. Trigger: a rejection; then fix only the cited guideline and
  resubmit the same day. Monday, September 28 is the last resubmission that
  can still be live by the deadline, an app that isn't live by September 30
  can't be entered, and expedited review is off the table.
- **TypeSafe objects to being named in the notice or the privacy policy.**
  Trigger: its answer; then change the Worker-served notice and the web
  privacy policy the same day, with no app update.
- **The game doesn't look finished.** The Guessling's reactions and the
  reveal carry the art direction, and the video gives them 25 seconds
  instead of explaining how answers work. Trigger: the art isn't ready by
  the end of September 23; then ship the simplest reactions and polish them
  in an update.
- **Jev is busy or out of credits during judging.** Credits stay funded
  through at least October 22, the SDK retries busy responses, the app shows
  a busy state, and exact bank wordings are answered in code. Trigger: any
  failed call in the Worker's logs; then top up the credits and check the
  limits.
- **TypeSafe doesn't consent to naming Jev.** Trigger: no consent by
  September 28, when the video is recorded; then the video calls it "a
  hosted decision model", and the write-up names Jev only if consent arrives
  before the deadline.
- **Few numbers.** Posting starts on launch day. Trigger: small numbers on
  September 29; then the write-up's numbers lead with rates and the
  consistency results rather than totals.

## How the idea was chosen

Ten rounds, from wide to narrow, each logged with its method and decision:

1.  [Round 1][r1] set seven hard constraints, such as being in App Store
    review by September 24, and a weighted rubric.
1.  [Round 2][r2] had three subagents write 30 ideas through creator briefs,
    categories, and Jev-first lenses; 26 were distinct.
1.  [Round 3][r3] failed six on the constraints, five of them on time, and
    sent 20 on.
1.  [Round 4][r4] had two scorers, one of them blind, rank Hunch, Subtext,
    Flagged, SaySo, and Earshot highest.
1.  [Round 5][r5] checked App Store rivals, gallery rivals, and harm data;
    Das Verhör's daily free-text case lowered Hunch's differentiation, and
    Flagged led, 82 to 81.5.
1.  [Round 6][r6] had a red team find that Hunch could contradict itself,
    and the checked bank addressed it.
1.  [Round 7][r7] re-scored the finalists by one rule, which tied Hunch and
    Flagged at 80; the red team's ranking broke the tie, and the winner was
    named Guessling.
1.  [Round 8][r8] chose a free daily puzzle and a paid archive.
1.  [Round 9][r9] cut the scope to one loop, put the key in a Worker, and
    set the schedule to September 30.
1.  [Round 10][r10] tested the pitch, gave a final score of 79.5, and set the
    triggers listed under [Risks](#risks).

[r1]: /docs/research/ideation.md#round-1-constraints-and-rubric
[r2]: /docs/research/ideation.md#round-2-thirty-candidates
[r3]: /docs/research/ideation.md#round-3-screening
[r4]: /docs/research/ideation.md#round-4-scoring
[r5]: /docs/research/ideation.md#round-5-evidence
[r6]: /docs/research/ideation.md#round-6-red-team
[r7]: /docs/research/ideation.md#round-7-the-choice
[r8]: /docs/research/ideation.md#round-8-monetization
[r9]: /docs/research/ideation.md#round-9-scope-stack-and-schedule
[r10]: /docs/research/ideation.md#round-10-pitch-test

## Assumptions and open questions

Nobody could be asked while this was written, so the plan assumes:

- A team of one to three people, starting from no code on September 22,
  2026, with an active Apple Developer Program membership, who write
  TypeScript.
- No Google Play account with production access and no Galaxy Store seller
  status, which leaves the App Store.
- A team that isn't all students and isn't RevenueCat or sponsor staff, with
  a small launch budget.
- A Jev API key on September 22, 2026, and TypeSafe's consent before Jev is
  named in public.
- That "include Jev in this project" means Jev makes a decision players rely
  on in the shipped app, not only in the build tools.

Still open, each with a safe default:

- **Jev access.** Jev is in early access, and no source says how soon a new
  account gets a working key. Safe default: request it first and follow the
  no-key trigger under [Risks](#risks).
- **Jev credits.** No free tier or hackathon credit is documented, and no
  TypeSafe page says what the API returns when credits run out; with
  auto-refill off and a zero balance, TypeSafe "may decline to generate
  Output". Safe default: buy credits on day one, turn auto-refill on, and
  watch usage through at least October 22.
- **Naming Jev.** No source says how to get TypeSafe's consent under section
  16.4. Safe default: name TypeSafe in the notice and the privacy policy
  from the first build, ask TypeSafe on September 22 to confirm that and to
  consent to the video and the write-up, and say "a hosted decision model"
  in those two until it does.
- **The Guessling's art.** Whether the team can draw the character in a day
  is unknown. Safe default: AI-assisted art, credited openly, as past
  winners did.
- **"20 Questions" in the name.** Several App Store apps use it, but no
  source here says whether it is free to use. Safe default: keep it as a
  description after the brand name.
- **Age rating.** TypeSafe's services aren't directed to children, it
  doesn't knowingly handle personal data from anyone under 18, and no source
  here names the right App Store age rating. Safe default: ask TypeSafe
  whether younger players may use the game, answer Apple's questionnaire
  honestly, and stay out of the Kids category.
- **More than one prize.** The context's
  [open questions](/docs/CONTEXT.md#open-questions) apply. Safe default:
  expect at most one prize.

## See also

- [Brief](/docs/BRIEF.md): what Shipaton 2026 requires, its dates, prizes,
  and judging.
- [Context](/docs/CONTEXT.md): the official rules, past winners, store
  review, monetization, and pitch guidance.
- [Product](/docs/PRODUCT.md): what Guessling is, for whom, and why, with
  its principles, metrics, and roadmap.
- [Product requirements](/docs/PRD.md): what version 1.0 must do, as
  numbered requirements with checks.
- [Technical requirements](/docs/TRD.md): how version 1.0 is built, traced
  to the product requirements.
- [Ideation log](/docs/research/ideation.md): the ten rounds that chose
  Guessling, with their scores.
- [Jev notes](/docs/research/jev.md): what Jev is, its API, prices, limits,
  and terms.
- [Gallery notes](/docs/research/gallery-2026.md): the 1,115 projects in the
  2026 gallery on September 22, 2026.
- [Evidence notes](/docs/research/idea-evidence.md): rivals, reviews, and
  demand for the top five ideas.

[ev-hunch]: /docs/research/idea-evidence.md#hunch-a-daily-20-questions-game

# Shipaton 2026 idea

Turn is the app this student team will build for RevenueCat Shipaton 2026's Next
Gen Award: an augmentative and alternative communication (AAC) app for adults
who can't rely on speech. It listens to what a partner says and offers replies
in the user's own saved words, with Jev deciding which of them answer. It
replaces Guessling, the team's first idea, which the team judged too simple; the
[Guessling idea][guessling] is archived. Ten rounds of ideation chose Turn, and
the [Next Gen ideation log][log] records each one. The [brief](/docs/BRIEF.md)
and the [context](/docs/CONTEXT.md) hold the contest's rules and background, so
this document links to them, with facts as of September 22, 2026.

Contents:

1.  [At a glance](#at-a-glance)
1.  [Problem and audience](#problem-and-audience)
1.  [What the app does](#what-the-app-does)
1.  [How it works](#how-it-works)
1.  [How Jev fits](#how-jev-fits)
1.  [Monetization](#monetization)
1.  [Categories to enter](#categories-to-enter)
1.  [Build plan](#build-plan)
1.  [Pitch](#pitch)
1.  [Risks](#risks)
1.  [How the idea was chosen](#how-the-idea-was-chosen)
1.  [Assumptions and open questions](#assumptions-and-open-questions)
1.  [See also](#see-also)

## At a glance

- **Name:** Turn, with the line "Your own words, in time for your turn."
- **Logline:** "For adults who can't rely on speech, Turn helps them answer in
  conversation by listening to what the other person says and offering
  replies in their own saved words, so they can take their turn before the
  conversation moves on."
- **Platform:** an iPhone app built with Expo and judged from a video and a
  public repository, with no store release, as the
  [Next Gen rules][ng-submit] allow.
- **Category:** the Next Gen Award alone, judged on the idea, progress
  toward a working app, the use of RevenueCat, and technical care
  ([criteria][ng-criteria]).
- **Jev's job:** for each thing the partner says, Jev decides which of 40 of
  the user's own phrases answer it, and whether any do. It never writes a
  word.
- **The purchase:** speaking is free. Listen mode is a one-time $24.99
  unlock after 20 free partner lines, shown in the video through RevenueCat's
  Test Store.
- **Dates:** the video recorded and uploaded on Monday, September 28;
  submitted on Devpost by Wednesday, September 30 at 11:45 PM PT; the relay
  running until judging ends on October 13 and the winners are announced on
  October 21 or 22 ([key dates][brief-dates]; [official rules][ctx-rules]).

[brief-dates]: /docs/BRIEF.md#key-dates
[ctx-rules]: /docs/CONTEXT.md#what-the-official-rules-add

## Problem and audience

- **Who:** adults who can't rely on speech, after ALS, a stroke, or other
  causes, and the people they talk with. ASHA cites an estimate that
  "approximately 5 million Americans and 97 million people in the world may
  benefit from AAC". CDC projects 34,720 US adults with ALS in 2026, and a
  2011 review says: "At some point, 80 to 95% of people with ALS are unable
  to meet their daily communication needs using natural speech."
- **The gap:** aided communication runs at "8–10 wpm without acceleration
  methods", against "speaking rates of between 125 and 185 words per minute",
  and a 1988 study found that "Augmented communicators were frequently
  unsuccessful in their attempts to secure speaking turns". By the time a
  reply is typed, the conversation has moved on.
- **Why it matters:** in a Quebec review of 2,355 hospital charts, patients
  with preventable adverse events were more likely to have a communication
  problem, with an odds ratio of 3.00. The study covers communication
  problems in general, not AAC.
- **What already exists:** the incumbents sell symbol grids or typing with
  saved phrases, such as Proloquo2Go at $249.99 and Proloquo4Text at
  $119.99, and Apple's Live Speech speaks typed text and saved phrases for
  free. Three newer apps listen to the partner. The closest, Rejoin Voice,
  released July 12, 2026, offers three generated replies, with speech free
  and listening at $12.99 a month.
- **Turn's difference:** every reply is one of the user's own saved phrases,
  never generated words. AAC users testing AI suggestions "had concerns about
  the system suggesting the wrong thing and making the participants look
  bad", though the same study found that even a pre-stored phrase "made
  others believe the system did all the work for them".
- **The field:** on September 22, the 2026 gallery had no AAC entry and no
  entry naming Jev. Among the entries tied to Next Gen, study help is the
  crowded theme.

The [evidence notes][ev-turn] have the sources, and the
[Next Gen notes][ng-field] map the field.

[ev-turn]: /docs/research/next-gen-evidence.md#turn-aac-that-ranks-the-users-own-phrases
[ng-field]: /docs/research/next-gen.md#the-2026-next-gen-field

## What the app does

1.  **Speak.** The user taps a saved phrase or types, and Turn speaks it in
    their Personal Voice, if they made one, or in a system voice. Every
    typed reply joins the phrase bank, which starts with about 150 editable
    phrases in categories.
1.  **Listen, with consent.** The first time the user turns on Listen mode,
    Turn asks their own permission to send their phrases and the partner's
    words to TypeSafe, or to "a third-party AI service in the United States"
    until TypeSafe agrees to be named. Then the user shows the partner a
    consent card; a light shows while the phone listens, one tap pauses it,
    and a switch stops listening when the partner is under 18. With the
    user's permission, these are Turn's consent controls. The phone
    transcribes the partner on the device.
1.  **Answer.** When the partner finishes, a row of big buttons above the
    grid offers the user's own phrases that answer what was said: one big
    button when Turn is confident, up to six otherwise, and no change when
    none fits. A yes-or-no question puts Yes, No, and Not sure first.
    Nothing speaks until the user taps.
1.  **Without the partner's voice.** The partner's line can be typed, and
    with no network, Turn ranks phrases on the phone by the place and the
    letters typed.
1.  **Keep listening.** Listen mode is free for the first 20 partner lines;
    after that, a paywall offers a one-time unlock, and speaking stays free.

- **The place:** one tap on the grid picks where the user is, such as home,
  the clinic, or a shop, from a list they can edit. Turn never reads the
  location, so it needs no location permission, and only the place's name
  leaves the phone.
- **Screens:** the speaking grid with the reply row and the place picker, the
  phrase bank editor, the consent card, the paywall, and Settings, with voices,
  Listen mode, the under-18 switch, Restore Purchases, and the privacy notice.
- **The "aha":** a partner asks "How was physio?", and "It was hard" is
  waiting before the user reaches for the keyboard, though the two share no
  content word.
- **Left out of the first version:** a partner joining from their own phone,
  Android, iPad layouts, accounts, phrase banks on a server, languages other
  than English, and switch or eye-gaze access beyond what iOS provides.

## How it works

The path from the partner's voice to the user's:

```text
partner speaks
  -> iPhone: live transcription on the device
  -> iPhone: names swapped for tags; a keyword shortlist of 40 phrases
  -> relay: the free-line and entitlement check; one request to Jev
  -> Jev: the kind of question, the topic, and a yes-or-no decision per phrase
  -> iPhone: steady slots, confidence bars, and Yes, No, and Not sure
  -> the user taps a phrase, spoken in their Personal Voice
```

What makes it more than one screen around one model call:

- **Perception on the phone.** Apple's `SpeechTranscriber` transcribes live,
  and its modules "don't send audio data of the user's voice to Apple's
  servers" ([speech notes][tech-speech]).
- **Retrieval before judgment.** Keyword ranking over the partner's line,
  plus the user's most-used replies and the place's phrases, picks 40
  candidates on the phone, so a reply that shares no content word with the
  question still reaches Jev, and the phrase bank stays on the phone. It is the
  order TypeSafe's own re-ranking cookbook uses: keyword search first, then Jev
  ([simpler methods][ev-simpler]).
- **Decisions in parallel.** Forty-two questions go to Jev in one request and
  come back together.
- **Code that keeps the row steady.** Confidence bars, slots that change only
  when a new phrase wins by a clear margin, and stale answers dropped by
  sequence number.
- **Output in the user's voice.** A small Swift module asks for Personal
  Voice, since Expo's speech module never does
  ([Turn on students' devices][ev-devices]).
- **A measured claim.** The repository's evaluation compares four ways to
  rank the same 80 partner lines: the offline fallback, keyword ranking on
  the partner's line, embeddings, and Jev.

[tech-speech]: /docs/research/next-gen-tech.md#speechanalyzer-and-speechtranscriber
[ev-devices]: /docs/research/next-gen-evidence.md#turn-on-students-devices

## How Jev fits

Jev is TypeSafe's hosted decision model, in early access. It answers typed
questions about text as a Choice among options, a Score on a scale, or a
yes-or-no Noul, with probabilities, and it never writes text
([Jev notes][jev-what]). In Turn it makes the decision the product depends
on: which of the user's own phrases answer what the partner just said.

**The request.** For each partner line, the relay sends Jev one request. The
state holds the line, with names swapped for tags, the place, and the 40
candidates. The questions:

- a Choice for the kind of question: yes-or-no, a choice between options,
  open, or not a question;
- a Choice for the topic, among the phrase bank's categories;
- one Noul per candidate: "this phrase answers what the partner just said".

TypeSafe says "Every question is evaluated in parallel and in isolation
against the same state in one go", so 42 questions cost one round trip
([limits][jev-limits]).

Why Jev decides this way:

- **Nouls, not one big Choice.** A Choice over the whole bank would soon reach
  the "roughly 240" options TypeSafe calls reliable, since the bank grows with
  every typed reply, and a Choice's probabilities "always add up to 1, so a line
  ranks first even when none answer the query". Per-phrase Nouls can all come
  back low, which tells Turn to change nothing ([Choice size][jp-choice]).
- **A steady row.** Over TypeSafe's repeat tests, Nouls had a mean
  per-question standard deviation of about 0.01, though one question crossed
  0.5, while a Choice's top answer flipped on 2 of 8 questions
  ([consistency][jp-consistency]). Buttons users learn by position shouldn't
  move for noise, so a slot changes only by a clear margin.
- **Confidence bars.** One big button needs more than 0.85, the bar
  TypeSafe's routing example sets for acting without asking; six buttons
  need at least 0.6, its floor; below that the row holds
  ([confidence routing][jp-routing]).
- **Not a generator.** "System One models do not write replies, produce
  code, or generate explanations of their reasoning", so Jev can only choose
  among the user's words, which is what sets Turn apart from generated
  replies ([store review][jev-store]).
- **Not the on-device model.** Apple's Foundation Models can be made to pick
  from a list, but it returns no probabilities and "may take a few
  seconds", on iPhone 15 Pro and later only ([simpler methods][ev-simpler]).
- **Not only embeddings.** General-purpose embeddings, like Apple's and
  Workers AI's, measure how alike two strings are, not whether one answers
  the other, though embeddings trained on reply pairs do better
  ([Turn without Jev][ev-without]). The evaluation tests this. If Jev trails
  embeddings, it re-ranks an embedding shortlist instead, built on the phone
  with Apple's sentence embeddings, the order TypeSafe's RAG cookbook uses
  ([simpler methods][ev-simpler]).
- **Fast enough for a conversation.** TypeSafe says "Most queries complete
  in about 100 ms", and its cookbooks measured mean round trips of 111 and
  114 ms. The phone's trip to the relay, and the relay's to TypeSafe on the
  US West Coast, come on top ([limits][jev-limits]).
- **Cheap enough to run on every line.** At $0.042 per million input
  tokens, a request of about 1,500 tokens costs about $0.00006
  ([round 8][r8]).

How it's wired:

- **The key stays in the relay.** Jev has no mobile SDK, and TypeSafe's
  agreement requires keys to stay confidential. The relay, a Cloudflare
  Worker, builds the questions itself, so the app can't use it as a way into
  Jev, and Turn stays an app that uses the API rather than "a standalone
  service", which the agreement bars ([terms][jev-terms]).
- **A pinned model.** Requests name `jev-1.13.0`, because an alias "moves when
  a new release ships" ([gotchas][jev-gotchas]).
- **Few requests in flight.** Cookbook authors hit rate limits at about eight
  requests in flight on one key, so each device keeps one, and answers older
  than the latest line are dropped, never retried
  ([concurrency][jp-concurrency]).
- **Busy or down.** The phone ranks by itself, as it does offline, and the
  app says Listen mode is degraded.
- **English only.** "English is the primary training language and where
  accuracy is currently best" ([languages][jev-lang]).

Data, consent, and terms:

- **What leaves the phone:** per request, the partner's line with names swapped
  for tags, the place's name, and 40 of the user's phrases. TypeSafe hosts Jev
  in the United States, and "Jev is not trained on customer requests or
  responses", but it keeps rights "in perpetuity" to use the data for telemetry
  and abuse monitoring ([data handling][jev-data]).
- **The user's consent.** None of the user's phrases leave the phone until
  the user agrees, the first time they turn on Listen mode.
- **The partner's consent.** TypeSafe's agreement makes the team give the
  notices its use of input needs (section 5). The consent card asks the
  partner before listening starts and says where their words go: to
  TypeSafe by name once TypeSafe agrees to be named, and otherwise to "a
  third-party AI service in the United States". The privacy notice says the
  same, and the user can pause at any time.
- **No minors' data.** TypeSafe's services aren't "directed to children",
  and it doesn't knowingly handle personal data from anyone under 18, so
  Turn is for adults, and the under-18 switch keeps a younger partner's
  words from reaching Jev ([ages and accounts][ng-minors]).
- **Naming Jev.** Section 16.4 bars announcing the relationship without
  consent, so the team asks TypeSafe on September 22 before naming Jev or
  TypeSafe in the app, the video, the description, or the README
  ([terms][jev-terms]). The public repository lists TypeSafe's SDK among its
  dependencies, so the same request asks whether that is fine.
- **Open source.** TypeSafe's SDKs are MIT-licensed, and its only key advice
  is "Keep API credentials server-side in web apps." The repository holds
  the relay's code but never its key ([keys in open source][jp-keys]).

[jev-what]: /docs/research/jev.md#what-jev-is
[jev-limits]: /docs/research/jev.md#rate-limits-context-length-and-latency
[jp-choice]: /docs/research/jev-patterns.md#choice-size-and-high-cardinality-decisions
[jp-consistency]: /docs/research/jev-patterns.md#consistency-results
[jp-routing]: /docs/research/jev-patterns.md#confidence-gated-routing-pattern
[jev-store]: /docs/research/jev.md#store-review-and-jev
[ev-without]: /docs/research/next-gen-evidence.md#turn-without-jev
[jev-terms]: /docs/research/jev.md#master-customer-agreement-terms-for-apps
[jev-gotchas]: /docs/research/jev.md#gotchas-in-the-api-and-sdks
[jp-concurrency]: /docs/research/jev-patterns.md#concurrency-in-the-cookbooks
[jev-lang]: /docs/research/jev.md#jev-platform-and-language-support
[jev-data]: /docs/research/jev.md#offline-behavior-and-data-handling
[jp-keys]: /docs/research/jev-patterns.md#keys-in-open-source-code
[ng-minors]: /docs/research/next-gen.md#minors-ages-and-accounts

## Monetization

The context has the [paywall rules][ctx-money], and round 8 of the log has
the [reasoning][r8]; this is how Turn applies them.

- **Speech is never sold.** The grid, saved phrases, typing, and Personal
  Voice stay free. One AAC app's reviewer calls "paying an ongoing
  subscription fee in order to access basic communication" repugnant, and
  Rejoin Voice promises "Everything you need to speak is free, forever".
- **Listen mode is what's sold.** It is the part that costs the team money
  on every partner line, and the part rivals charge for: Rejoin+ costs $12.99
  a month or $99.99.
- **One price, paid once.** Turn Listen is a one-time purchase of $24.99 that
  grants the entitlement `listen`. The established text AAC apps also sell
  once, from $24.99 to $159.99, and a one-time price answers the fear of
  losing one's voice when a payment lapses.
- **What a user costs.** At 200 partner lines a day for a year, Jev costs
  about $4.60, so one payment covers about five years of Jev at that pace,
  with the relay's hosting on top.
- **Trying first.** Listen mode is free for the first 20 partner lines,
  counted by the relay, so the user sees it work before the paywall.
- **The paywall.** A RevenueCat Paywall, configured remotely, opens when the
  free lines run out, or when the user turns Listen mode on after that. It
  shows the one-time price, says speaking stays free, and closes with one
  tap. Settings holds Restore Purchases, and a caregiver can buy from there.
- **The relay checks.** Past the free lines, the relay checks the `listen`
  entitlement through RevenueCat's REST API before it calls Jev, with a short
  cache ([server checks][expo-server]).
- **For Next Gen.** The purchase runs through RevenueCat's Test Store, which
  the organizers accept for Next Gen. The video shows the Test Store sheet, a
  simulated successful purchase, and Listen mode unlocking, and judges can
  repeat it in a debug build ([purchase paths][ng-purchase]). Test Store
  purchases count as sandbox data, so the entry reports no revenue.
- **Left out:** subscriptions, which AAC users resent; web purchases, which
  need a Stripe account; and ads, which have no place in someone's voice.

[ctx-money]: /docs/CONTEXT.md#monetization-and-paywalls
[expo-server]: /docs/research/revenuecat-expo.md#checking-entitlements-from-a-server
[ng-purchase]: /docs/research/next-gen.md#purchase-paths-without-a-store-listing

## Categories to enter

- **Next Gen, alone.** The rules judge it on four criteria, unweighted: the
  idea, "meaningful progress toward a working app", the use of RevenueCat,
  and "thoughtful technical choices, product thinking, and care"; the idea
  breaks ties. Turn brings a documented need, a working loop on a phone, a
  purchase that never touches speech, and an evaluation in the repository.
  The category video asks for "a fully realized app", with "a settings page"
  and "a paywall", and the first version has both ([criteria][ng-criteria]).
- **The Grand Prize is out of reach.** A manager says it needs a store
  release, a team with a minor can't enter it, and its shortlist counts
  revenue "as reported in RevenueCat", which a Test Store purchase doesn't
  produce ([other prizes][ng-prizes]).
- **Every other category is left out.** Each needs a store release, an
  iPhone-only app needs the paid Apple Developer Program to reach a store,
  and a team with a minor may enter only Next Gen.

[ng-prizes]: /docs/research/next-gen.md#next-gen-and-the-other-prizes

## Build plan

Round 9 of the log has the [reasoning][r9] behind this plan.

### Stack and data flow

- **App:** Expo SDK 57, at 57.0.23 or later with `ios.enableSceneSupport`
  turned on, since "Apps built with the iOS 27 SDK must use the UIKit
  scene-based life cycle, or they do not launch correctly on iOS 27". It's
  written in TypeScript, with `react-native-purchases` and its Paywalls UI,
  and built locally with Xcode 27 under a free Apple account, as debug builds
  only ([Expo and Xcode 27][tech-expo]).
- **Two Swift modules,** written with the Expo Modules API: live
  transcription through `SpeechTranscriber`, and Personal Voice
  authorization. `expo-speech` then speaks with the authorized voice, and
  `expo-speech-recognition` is the fallback for transcription.
- **Shortlist on the phone:** keyword ranking, the user's most-used replies,
  and the place's phrases pick 40 phrases in TypeScript, so only those 40
  leave the phone, per request.
- **Relay:** one Cloudflare Worker holds the Jev key and a RevenueCat secret
  key. It builds the fixed questions, calls Jev through TypeSafe's
  JavaScript SDK or its HTTP API, counts free lines, checks the entitlement,
  and limits requests per device ([Workers secrets][cf-secrets]).
- **Evaluation:** `eval/` holds 80 partner lines, each with its best replies
  from the starter bank, and a script that scores top-1 and top-6 accuracy,
  "none" handling, and latency for four rankers: the fallback, keyword
  ranking on the partner's line, embeddings from Workers AI, and Jev.

[tech-expo]: /docs/research/next-gen-tech.md#expo-sdk-57-sdk-58-and-xcode-27
[cf-secrets]: /docs/research/cloudflare-workers.md#secrets-configuration-and-wrangler

### Scope of the first version

- **Must:** the grid, typing, and saved phrases, with about 150 editable starter
  phrases and every typed reply saved; Personal Voice, else a system voice;
  Listen mode with live transcription and a typed-line field; the consent
  controls; names swapped for tags; the shortlist and Jev's decisions; steady
  slots, the confidence bars, and the Yes, No, and Not sure buttons; the offline
  fallback; the paywall, the Test Store purchase, and Restore Purchases;
  Settings; the relay; the evaluation; and the README, the license, and a
  Simulator build.
- **Should:** the replay script of recorded partner lines, a review by a
  campus speech-language pathology clinic, and an alert when Jev's credits
  run low.
- **Won't:** the items under [What the app does](#what-the-app-does) that the
  first version leaves out.

### The repository

- **Layout:** `app/`, `modules/`, `worker/`, and `eval/`, with an MIT
  `LICENSE` at the root, where GitHub can detect it, as the rules ask
  ([license][ng-license]).
- **README:** setup; the Test Store purchase; a path through the paid
  feature in the Simulator, by typing the partner's line, since live
  transcription needs a physical iPhone; and the evaluation's table.
- **Running it without the team's keys:** the app's config points at the
  team's relay, which runs until the winners are announced. The Test Store
  public SDK key is committed for debug builds; no secret key is. A
  Simulator build goes in the repository's releases, since building for iOS
  needs a Mac with Xcode 27 on macOS Tahoe 26.6 or later
  ([what a judge needs][ng-judge]).

[ng-license]: /docs/research/next-gen.md#open-source-license-and-setup-instructions
[ng-judge]: /docs/research/next-gen.md#what-a-judge-needs-to-run-the-app

### Schedule to September 30

- **Tuesday, September 22:** request the Jev key and TypeSafe's consent to
  name Jev; create the RevenueCat project, the Test Store product, the
  entitlement, and the offering; start the Expo app with scene support;
  write the starter phrases and the 80 evaluation lines; stand up the relay.
- **Wednesday, September 23:** the grid, typing, the phrase bank, and
  speech with Personal Voice; the relay's Jev request with its fixed
  questions and pinned model; the shortlist on the phone.
- **Thursday, September 24:** Listen mode, with the transcription module and
  the typed-line field; the consent controls; steady slots and the fixed
  buttons; ask the campus clinic for a review.
- **Friday, September 25:** run the evaluation and set the thresholds; the
  paywall, the Test Store purchase, Restore, and the relay's free-line count
  and entitlement check; Settings.
- **Saturday, September 26:** the clinic's review, if booked, and its fixes;
  the README, the license, the Simulator build, and the replay script.
- **Sunday, September 27:** polish; the 1024 × 1024 icon and the 1179 × 2556
  screenshot the [submission checklist][brief-checklist] asks for; rehearse
  the video with a partner who has agreed to it.
- **Monday, September 28:** record the video on an iPhone 15 Pro or later,
  and upload it.
- **Tuesday, September 29:** write the Devpost description and answers, and
  collect a guardian's consent for any minor on the team.
- **Wednesday, September 30:** submit before 11:45 PM PT, and make sure
  Devpost shows the entry as submitted. Keep the relay running and Jev's
  credits funded until the winners are announced.

[brief-checklist]: /docs/BRIEF.md#submission-checklist

## Pitch

The brief's [pitch advice][brief-pitch] and the context's
[video guidance][ctx-video] apply; round 10 of the log
[tests this pitch][r10].

The video, under two minutes on an iPhone:

1.  **0:00–0:15:** a partner asks "How was physio?"; the row offers "It was
    hard"; a tap speaks it. On screen: "Turn: your own words, in time for
    your turn", the Next Gen Award, and one line of the problem, so it's
    named within 15 seconds.
1.  **0:15–0:35:** the problem: aided speech at 8 to 10 words a minute
    against 125 to 185 spoken, and a reply typed too late.
1.  **0:35–1:05:** how it works: the consent card and the listening light, a
    yes-or-no question answered with the fixed buttons, and the row holding
    steady while nothing speaks until the user taps.
1.  **1:05–1:25:** why Jev: the evaluation's table, and "Jev never writes
    words: every phrase is the user's own."
1.  **1:25–1:45:** the purchase: the free lines run out, the paywall opens,
    a Test Store purchase unlocks Listen mode, and speaking stays free.
1.  **1:45–1:55:** the repository, its license, the Simulator path, and the
    student team.

The description, in order: what the team built, what it does, and why it
matters, in the [category page's][ng-submit] words; the evaluation; the
purchase, why speech is free, and why a Test Store purchase counts for Next
Gen, citing the organizers' answers; the technical choices; privacy and consent;
the AI tools used, credited openly; and the award named, as RevenueCat's
September 18 update asks: "Name the awards you're going for".

The repository's front page opens with the same logline, a short clip of the
"aha", and the evaluation's table, since judges may score from the video and
description alone and read the code to check them.

[brief-pitch]: /docs/BRIEF.md#pitch-the-submission
[ctx-video]: /docs/CONTEXT.md#demo-video-and-write-up

## Risks

- **Jev doesn't beat embeddings.** Trigger: on September 25, Jev's top-6
  accuracy trails embeddings on the 80 lines; then Jev re-ranks an embedding
  shortlist and the evaluation runs again. If Jev still trails, the README
  says so, and the pitch rests on "none" and steady rows.
- **No Jev key in time.** Request it on September 22. Trigger: no key by noon
  PT on September 23; then write to `support@typesafe.ai` and TypeSafe's
  Discord, and build on the phone's own ranking meanwhile, since Jev joins
  at the relay with no app change. No key by the end of September 24, before
  the evaluation that needs it, is the no-go: without Jev, Turn breaks the
  goal it was chosen for, so Turn as designed stops there, and the team takes
  the choice back to whoever set the goal: enter without Jev, saying so, or
  enter something else.
- **Live transcription fails on the device.** Trigger: not working by the end
  of September 24; then switch to `expo-speech-recognition` and its older
  recognizer.
- **Test Store can't sell a one-time product.** RevenueCat's Test Store pages
  don't say whether a one-time product can be made there ([gaps][ng-gaps]).
  Trigger: the dashboard offers none on September 22; then the demo sells Listen
  as a yearly Test Store product, which renews at most five times before it
  ends, and the one-time design stays for a store release ([round 8][r8]).
- **A wrong reply.** A mis-ranked row costs time more than words, since
  nothing speaks until the user taps, but a wrong tap on a question about
  pain or consent matters. Yes-or-no questions get the fixed Yes, No, and
  Not sure buttons, and the grid is always one tap away
  ([harm][ev-harm]). Trigger: on September 25, the evaluation puts a wrong
  answer to a yes-or-no or pain line in the big button; then those lines get
  only the fixed buttons and the grid.
- **The partner's privacy.** AAC users asked "how they could turn off the
  system from hearing the conversations all the time", and California bars
  recording "confidential communication" without the consent of all
  parties; whether live transcription counts is unsettled. The consent card,
  the light, and pause answer both, and no audio is stored. Trigger: a check
  on September 26 finds any audio or transcript kept after its request, on
  the phone or in the relay; then it's fixed before the video.
- **No clinical eyes.** Trigger: no clinic review by September 27; then the
  description says no clinician has reviewed Turn yet.
- **TypeSafe doesn't consent to being named.** Trigger: no answer by
  September 28, when the video is recorded; then the video, the
  description, and the README call Jev "a hosted decision model", the user's
  permission step, the consent card, and the privacy notice say "a
  third-party AI service in the United States", and the names go in only if
  consent arrives before the deadline.
- **The wrong phone.** Personal Voice needs an iPhone 15 Pro or later by one
  Apple page. Trigger: no such phone for the video; then a system voice
  speaks.
- **The relay fails during judging.** Credits run out or Jev is down between
  October 1 and 13. Trigger: any failed call in the relay's logs; then top up
  the credits, and the phone's own ranking keeps Turn usable meanwhile.

[ev-harm]: /docs/research/next-gen-evidence.md#harm-from-a-wrong-turn-decision

## How the idea was chosen

Ten rounds, from wide to narrow, each logged with its method and decision:

1.  [Round 1][r1] set seven hard constraints, such as a purchase through Test
    Store and no personal data from minors reaching Jev, and a rubric split
    from the rules' four Next Gen criteria, with Guessling as the control.
1.  [Round 2][r2] had three subagents write 30 ideas through students'
    problems, new phone technology, and Jev-only lenses; 23 were distinct.
1.  [Round 3][r3] failed one on the constraints and sent 22 on.
1.  [Round 4][r4] had two scorers, one of them blind, rank Turn,
    Scenekeeper, Bench, Chorus, and Same Boat highest; Guessling tied for
    18th.
1.  [Round 5][r5] checked rivals, need, devices, and simpler methods; Rejoin
    Voice lowered Turn's originality, but Turn kept the lead at 80.
1.  [Round 6][r6] had a red team attack the top three; Turn's fixes were all
    design and evaluation.
1.  [Round 7][r7] re-scored the finalists and chose Turn at 82, 16.5 points
    above Guessling.
1.  [Round 8][r8] made speech free and Listen mode a one-time purchase.
1.  [Round 9][r9] cut the scope to one loop and set the schedule to
    September 30.
1.  [Round 10][r10] tested the pitch and set most of the triggers under
    [Risks](#risks).

[r1]: /docs/research/next-gen-ideation.md#round-1-constraints-and-rubric
[r2]: /docs/research/next-gen-ideation.md#round-2-thirty-candidates
[r3]: /docs/research/next-gen-ideation.md#round-3-screening
[r4]: /docs/research/next-gen-ideation.md#round-4-scoring
[r5]: /docs/research/next-gen-ideation.md#round-5-evidence
[r6]: /docs/research/next-gen-ideation.md#round-6-red-team
[r7]: /docs/research/next-gen-ideation.md#round-7-the-choice

## Assumptions and open questions

Nobody could be asked while this was written, so the plan assumes:

- Every team member is an active student with an academic email, and the
  team enters Next Gen only. An adult member holds the TypeSafe, RevenueCat,
  and Apple accounts, and any minor has a guardian's consent.
- The team is two to four students starting on September 22, 2026, with a
  Mac, at least one recent iPhone, and TypeScript, and no paid Apple
  Developer Program membership. Swift is a plus, not a given, so the two
  Swift modules stay small, and each has a fallback: `expo-speech-recognition`
  for transcription and a system voice for speech.
- "10-round ideation" means ten new rounds, each with its own question and
  decision, not a revision of the first log.
- The team can get a Jev API key on September 22, 2026.
- "Include Jev" means Jev makes a decision the app depends on at run time.
- "Too simple" is about the product: the idea needs parts that work
  together, with Jev as one of them.
- No team member's personal link to AAC is assumed. If one exists, the pitch
  leads with it, as past winners' origin stories did.

Still open, each with a safe default:

- **Test Store as the purchase.** Two managers' forum answers accept Test
  Store for Next Gen, one saying "Test Store is enough for the Next Gen
  category", and the category video asks for monetization "even though it'll
  be sandboxed"; but the rules never name Test Store, and the brief's safe
  default for the purchase rule is "at least one real purchase or ad". Safe
  default: cite those answers in the description ([purchase rule][ng-rule]).
- **Test Store and one-time products.** Safe default: the yearly fallback
  under [Risks](#risks).
- **Test Store in the Simulator.** RevenueCat never says outright that Test
  Store runs on the iOS Simulator ([gaps][ng-gaps]). Safe default: try it
  there on September 25; if it fails, the README's Simulator path skips the
  purchase, and the video shows it on a device.
- **The Test Store key in a public repository.** No RevenueCat page says whether
  it may be committed. Safe default: commit only the public Test Store key, and
  rotate it if RevenueCat objects.
- **Jev credits.** No page read names a free tier or student program, and
  no page says
  what the API returns when credits run out. Safe default: buy credits on
  September 22, turn on auto-refill, and watch usage through the winners'
  announcement ([programs][jp-programs]).
- **Naming Jev.** Safe default: ask TypeSafe on September 22, including
  about its SDK in the public repository, and follow the trigger under
  [Risks](#risks).
- **Personal Voice devices.** Apple's iOS 27 guide says iPhone 15 Pro and
  later, and another Apple page says iPhone 12. Safe default: plan the video
  on an iPhone 15 Pro or later.
- **Listening and the law.** Whether live transcription that stores no audio
  counts as recording under California's all-party consent law is a legal
  question no source here settles. Safe default: the consent card, every
  time.
- **More than one prize.** The context's
  [open questions](/docs/CONTEXT.md#open-questions) apply. Safe default:
  expect at most one.

[jp-programs]: /docs/research/jev-patterns.md#programs-and-credits
[ng-rule]: /docs/research/next-gen.md#whether-the-revenuecat-rule-applies

## See also

- [Brief](/docs/BRIEF.md): what Shipaton 2026 requires, its dates, prizes,
  and judging.
- [Context](/docs/CONTEXT.md): the official rules, past winners,
  monetization, and pitch guidance.
- [Next Gen ideation log][log]: the ten rounds that chose Turn, with their
  scores.
- [Next Gen notes](/docs/research/next-gen.md): what the award asks of a
  student team.
- [Technology notes](/docs/research/next-gen-tech.md): what a phone can do in
  September 2026.
- [Jev notes](/docs/research/jev.md) and
  [Jev pattern notes](/docs/research/jev-patterns.md): what Jev is, what it
  costs, and how to use it well.
- [Evidence notes](/docs/research/next-gen-evidence.md): rivals, need, and
  risks for the five finalists.
- [Guessling idea][guessling]: the first idea, archived with the
  [product](/docs/archive/guessling-product.md),
  [PRD](/docs/archive/guessling-prd.md), and
  [TRD](/docs/archive/guessling-trd.md) built on it; the
  [design](/docs/DESIGN.md) document built on it stays in `docs/`, marked
  superseded.

[guessling]: /docs/archive/guessling-idea.md
[log]: /docs/research/next-gen-ideation.md
[ng-submit]: /docs/research/next-gen.md#what-a-next-gen-entry-must-submit
[ev-simpler]: /docs/research/next-gen-evidence.md#what-simpler-methods-offer
[ng-criteria]: /docs/research/next-gen.md#judging-criteria-and-the-category-video
[ng-gaps]: /docs/research/next-gen.md#gaps
[r8]: /docs/research/next-gen-ideation.md#round-8-monetization
[r9]: /docs/research/next-gen-ideation.md#round-9-scope-stack-and-schedule
[r10]: /docs/research/next-gen-ideation.md#round-10-pitch-test

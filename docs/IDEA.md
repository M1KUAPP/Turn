# Shipaton 2026 idea

Turn is the app this student team will build for RevenueCat Shipaton 2026's
Next Gen Award: an AAC app for adults who can't rely on speech that listens to
what a partner says and offers replies in the user's own saved words, with Jev
deciding which of them answer. It replaces Guessling, the team's first idea,
which the team judged too simple; the [Guessling idea][guessling] is archived.
Ten rounds of ideation chose Turn, and the [Next Gen ideation log][log]
records each one. The [brief](/docs/BRIEF.md) and the
[context](/docs/CONTEXT.md) hold the contest's rules and background, so this
document links to them, with facts as of September 22, 2026.

Contents:

1.  [At a glance](#at-a-glance)
1.  [Problem and audience](#problem-and-audience)
1.  [What the app does](#what-the-app-does)
1.  [How it works](#how-it-works)
1.  [How Jev fits](#how-jev-fits)
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
[ng-submit]: /docs/research/next-gen.md#what-a-next-gen-entry-must-submit
[ng-criteria]: /docs/research/next-gen.md#judging-criteria-and-the-category-video

## Problem and audience

- **Who:** adults who can't rely on speech, after ALS, a stroke, or other
  causes, and the people they talk with. ASHA cites an estimate that
  "approximately 5 million Americans and 97 million people in the world may
  benefit from AAC". CDC projects 34,720 US adults with ALS in 2026, and "At
  some point, 80 to 95% of people with ALS are unable to meet their daily
  communication needs using natural speech."
- **The gap:** aided communication runs at "8–10 wpm without acceleration
  methods", against "speaking rates of between 125 and 185 words per minute",
  and a 1988 study found that "Augmented communicators were frequently
  unsuccessful in their attempts to secure speaking turns". By the time a
  reply is typed, the conversation has moved on.
- **Why it matters:** in a Quebec review of 2,355 hospital charts, patients
  with preventable adverse events were more likely to have a communication
  problem, with an odds ratio of 3.00. A reply that arrives in time is care,
  not only courtesy.
- **What already exists:** the incumbents sell symbol grids or typing with
  saved phrases, such as Proloquo2Go at $249.99 and Proloquo4Text at
  $119.99, and Apple's Live Speech speaks typed text and saved phrases for
  free. Three newer apps listen to the partner. The closest, Rejoin Voice,
  released July 12, 2026, offers three generated replies, with speech free
  and listening at $12.99 a month.
- **Turn's difference:** every reply is one of the user's own saved phrases,
  never generated words. AAC users testing AI suggestions "had concerns about
  the system suggesting the wrong thing and making the participants look
  bad".
- **The field:** on September 22, the 2026 gallery had no AAC entry and no
  entry naming Jev. Of the 13 entries that name Next Gen, study help is the
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
1.  **Listen, with consent.** The user turns on Listen mode and shows the
    partner a consent card. A light shows while the phone listens, one tap
    pauses it, and a switch stops listening when the partner is under 18.
    The phone transcribes the partner on the device.
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

- **Screens:** the speaking grid with the reply row, the phrase bank editor,
  the consent card, the paywall, and Settings, with voices, Listen mode, the
  under-18 switch, Restore Purchases, and the privacy notice.
- **The "aha":** a partner asks "How was physio?", and "It was hard" is
  waiting before the user reaches for the keyboard, though the two share no
  word.
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
  the place, and recent use picks 40 candidates on the phone, so the phrase
  bank stays there. It is the order TypeSafe's own re-ranking cookbook uses:
  keyword search first, then Jev ([simpler methods][ev-simpler]).
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

- **Nouls, not one big Choice.** A Choice over the whole bank would sit at
  the "roughly 240" options TypeSafe calls reliable, and a Choice's
  probabilities "always add up to 1, so a line ranks first even when none
  answer the query". Per-phrase Nouls can all come back low, which tells
  Turn to change nothing ([Choice size][jp-choice]).
- **A steady row.** Over TypeSafe's repeat tests, a Noul's probability had a
  standard deviation of about 0.01, while a Choice's top answer flipped on 2
  of 8 questions ([consistency][jp-consistency]). Buttons users learn by
  position shouldn't move for noise.
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
- **Not only embeddings.** Embeddings measure how alike two strings are, not
  whether one answers the other, and "How was physio?" shares no word with
  "It was hard". The evaluation tests this, and if Jev trails embeddings,
  it re-ranks an embedding shortlist instead, as TypeSafe's own cookbooks do
  ([Turn without Jev][ev-without]).
- **Fast enough for a conversation.** TypeSafe says "Most queries complete
  in about 100 ms", and its cookbooks measured mean round trips of 111 and
  114 ms. The phone's trip to the relay, and the relay's to TypeSafe on the
  US West Coast, come on top ([limits][jev-limits]).
- **Cheap enough to run on every line.** At $0.042 per million input
  tokens, a request of about 1,500 tokens costs about $0.00006
  ([round 8][log-r8]).

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

- **What leaves the phone:** per request, the partner's line with names
  swapped for tags, the place, and 40 of the user's phrases. TypeSafe hosts
  Jev in the United States, and "Jev is not trained on customer requests or
  responses", but it keeps rights "in perpetuity" to use the data for
  telemetry and abuse monitoring ([data handling][jev-data]).
- **The partner's consent.** TypeSafe's agreement makes the team give the
  notices its use of input needs (section 5). The consent card names
  TypeSafe and asks the partner before listening starts, the privacy notice
  names it too, and the user can pause at any time.
- **No minors' data.** TypeSafe's services aren't "directed to children",
  and it doesn't knowingly handle personal data from anyone under 18, so
  Turn is for adults, and the under-18 switch keeps a younger partner's
  words from reaching Jev ([ages and accounts][ng-minors]).
- **Naming Jev.** Section 16.4 bars announcing the relationship without
  consent, so the team asks TypeSafe on September 22 before naming Jev in the
  video and the description ([terms][jev-terms]).
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
[log-r8]: /docs/research/next-gen-ideation.md#round-8-monetization

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
  [product](/docs/PRODUCT.md), [PRD](/docs/PRD.md), [TRD](/docs/TRD.md), and
  [design](/docs/DESIGN.md) documents built on it.

[guessling]: /docs/archive/guessling-idea.md
[log]: /docs/research/next-gen-ideation.md
[ev-simpler]: /docs/research/next-gen-evidence.md#what-simpler-methods-offer

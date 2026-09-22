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
[ev-simpler]: /docs/research/next-gen-evidence.md#what-simpler-methods-offer

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

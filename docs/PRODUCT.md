# Turn product

Turn is an augmentative and alternative communication (AAC) app for iPhone
that speaks the saved phrases and typed words of adults who can't rely on
speech, and in Listen mode offers replies from those phrases to what a
partner says, with Jev deciding which answer. This document says who Turn is
for, the principles behind its decisions, and where it goes after the first
version, as of September 22, 2026. The [idea](/docs/IDEA.md) records why the
team chose it for the Next Gen Award, the [product requirements](/docs/PRD.md)
what the first version must do, and the [technical requirements](/docs/TRD.md)
how it's built.

Contents:

1.  [Turn in brief](#turn-in-brief)
1.  [Vision](#vision)
1.  [Users and partners](#users-and-partners)
1.  [Positioning](#positioning)
1.  [Product principles](#product-principles)
1.  [The experience](#the-experience)
1.  [The phrase bank](#the-phrase-bank)
1.  [Business model](#business-model)
1.  [Success metrics](#success-metrics)
1.  [Roadmap](#roadmap)
1.  [What Turn is not](#what-turn-is-not)
1.  [See also](#see-also)

## Turn in brief

- **What:** a speaking grid of the user's saved phrases and a keyboard, both
  spoken aloud in the user's Personal Voice or a system voice, plus Listen
  mode: when a partner finishes speaking, a row of big buttons above the grid
  offers the user's own phrases that answer what was said. Nothing speaks
  until the user taps.
- **For whom:** adults who can read and tap but can't rely on their speech,
  such as people living with ALS or recovering from a stroke, and the people
  they talk with; see [Users and partners](#users-and-partners).
- **How it earns:** speaking is free. Turn Listen, a one-time purchase of
  $24.99, keeps Listen mode on after 20 free partner lines.
- **Where:** iPhone, in US English, built with Expo. For the Next Gen entry,
  it runs as debug builds and a Simulator build from a public repository,
  with no store release, as the [Next Gen rules][ng-submit] allow.
- **What Jev decides:** for each partner line, which of 40 of the user's
  phrases answer it, and whether any do. Jev never writes a word; see
  [how Jev fits][idea-jev].
- **Status:** the first version is filmed on Monday, September 28, and
  submitted by Wednesday, September 30, 2026, on the idea's
  [schedule][idea-schedule].

[ng-submit]: /docs/research/next-gen.md#what-a-next-gen-entry-must-submit
[idea-jev]: /docs/IDEA.md#how-jev-fits
[idea-schedule]: /docs/IDEA.md#schedule-to-september-30

## Vision

Turn wants people who can't rely on speech to take their turn in a
conversation before it moves on, saying what they would have said, in words
they chose. Its line: "Your own words, in time for your turn."

That aim sets three tests for every decision:

- **In time.** The reply should be waiting when the partner finishes, before
  the user reaches for the keyboard. Aided communication runs at "8–10 wpm"
  against speech at 125 to 185 words a minute, and by the time a reply is
  typed, the conversation has moved on ([problem][idea-problem]).
- **In their own words.** Everything Turn says, the user wrote or chose to
  keep. Turn ranks the user's phrases; it never writes new ones.
- **On their terms.** Nothing speaks until the user taps, listening happens
  only with consent and in plain view, and speaking never costs money.

## Users and partners

These profiles are synthesis from the idea's
[evidence on the problem and audience][idea-problem] and the
[AAC practice notes][aac-notes]; nobody who uses AAC has been interviewed
yet.

- **The person who speaks with Turn** is an adult who can read, spell, and
  touch a screen, but whose speech isn't reliable: someone living with ALS
  whose speech is slowing, someone with dysarthria after a stroke, or
  someone after a laryngectomy, and many adults with multiple sclerosis,
  Parkinson's disease, or cerebral palsy. They want to answer in time, in
  their own words, without looking as if the phone talks for them. Turn
  gives them a row of their own replies as the partner finishes, and the
  grid and keyboard for everything else. People with ALS often move from
  touch to switches or eye gaze, so Turn has to keep working with iOS's own
  Switch Control and Eye Tracking.
- **The partner** is whoever they talk with: a spouse, a friend, a nurse, a
  shop worker. They want to know when the phone is listening and where their
  words go, and to be able to say no. Turn shows them a consent card each
  time listening starts, and a light while it listens.
- **The person who sets it up** is often a family member or caregiver, who
  adds names, places, and phrases, and may buy Turn Listen. Turn gives them a
  phrase bank editor, and Turn Listen and Restore Purchases in Settings.
- **The clinician** is a speech-language pathologist who recommends AAC
  tools and may review Turn. They want to see that it is safe when it's
  wrong and honest about what it does. Turn gives them fixed Yes, No, and Not
  sure buttons, a row that holds when nothing fits, and a published
  evaluation.

Turn isn't built, in its first version, for:

- **People whose language itself is affected,** as in many kinds of aphasia,
  for whom rows of written phrases may not fit ([AAC notes][aac-notes]).
- **Children.** TypeSafe says its services aren't "directed to children", so
  Turn is for adults, and a switch keeps a partner under 18 from reaching Jev
  ([ages and accounts][ng-minors]).
- **People who need switch or eye-gaze access beyond what iOS provides.**
  Turn works with iOS's own Switch Control, Voice Control, and eye and head
  tracking, but its first version adds none of its own.
- **Emergencies.** Turn is not an emergency service.

[ng-minors]: /docs/research/next-gen.md#minors-ages-and-accounts

## Positioning

For adults who can't rely on speech, and the people they talk with, Turn is
the AAC app that listens to the partner and offers replies from the user's
own saved phrases, so they can answer in time, in their own words, and never
pay to speak.

The alternatives, and how Turn differs from each; the
[evidence notes][ev-rivals] have the prices, ratings, and quotes:

- **Text AAC apps with saved phrases,** such as Proloquo4Text at $119.99 and
  Predictable at $159.99, speak typed text and saved phrases with
  prediction from the user's typing. None ranks phrases by what the partner
  just said; Turn adds the partner's line as context.
- **Apple's Live Speech** is free and built in: it speaks typed text and
  saved phrases, in Personal Voice too. Turn is for the moments when typing
  or scrolling is too slow for the conversation.
- **Rejoin Voice,** the closest rival, released July 12, 2026, listens and
  offers three generated replies, "written in your style"; speech is free,
  and listening costs $12.99 a month or $99.99. Turn offers only phrases the
  user saved, and sells listening once.
- **Vocable AAC** listens to caregivers and offers generated responses, for
  free. **Spoken** tailors AI word prediction to the people and places a user
  names. Both write words the user didn't save.
- **Transcription apps,** such as Live Transcribe, show the partner's words,
  and the user still types a reply.

The difference is narrow: replies from the user's own words, never
generated, chosen by a model that can say none fits. Turn doesn't claim to
be the first AAC app that listens; it has to show, in its evaluation, that
its ranking beats simpler methods.

[ev-rivals]: /docs/research/next-gen-evidence.md#turn-rival-apps

## Product principles

Each principle settles trade-offs, and the PRD turns its consequence into
requirements.

- **Only their words.** Every reply Turn offers is a phrase the user saved or
  typed. So Jev chooses and never writes, nothing generates a reply when
  none fits, the starter phrases can all be edited, and every typed reply
  joins the bank.
- **Nothing speaks without a tap.** A suggestion is never an action. So
  even the big button waits for a tap, and the grid and keyboard are always
  one tap away.
- **Steady beats clever.** A button the user has learned by position
  shouldn't move for noise. So the grid never reorders itself and only the
  row adapts, a phrase keeps its slot until a new one wins by a clear
  margin, Yes, No, and Not sure have fixed places, and when nothing fits,
  the row holds: listeners rate a phrase that almost fits below a reply that
  comes late ([AAC notes][aac-fail]).
- **Honest about doubt.** When no phrase clears the bar, Turn changes
  nothing, and when Jev is slow or down, Turn says Listen mode is degraded
  and ranks phrases on the phone.
- **Listening is visible and agreed.** The user's permission comes before any
  of their phrases leave the phone, the partner's consent before each
  listening session, a light shows while the phone listens, one tap pauses
  it, a partner under 18 is never heard, and no audio is kept.
- **Speech is never sold.** The grid, typing, saved phrases, and Personal
  Voice are free, and the paywall never stands between the user and speech.
- **Private by default.** No accounts, and the phrase bank stays on the
  phone. For each partner line, only what ranking it needs leaves it, with
  names swapped for tags; the PRD's [reply row][prd-row] lists it.
- **Useful offline.** Speaking needs no network, and without one, Listen mode
  ranks phrases on the phone by the words of the partner's line, the place,
  and the letters typed.

[aac-fail]: /docs/research/aac-practice.md#why-prestored-phrase-systems-work-or-fail
[prd-row]: /docs/PRD.md#the-reply-row

## The experience

As the user lives it; the PRD's [functional requirements][prd-functional]
set every step's rules:

1.  **Set up.** The first launch opens the speaking grid with about 150
    starter phrases in categories, ready to speak. The user, or whoever
    helps them, picks a voice, authorizes their Personal Voice if they made
    one in iOS, adds names and places, and edits phrases.
1.  **Speak.** A tap on a phrase speaks it. Typed text speaks with one more
    tap and joins the bank.
1.  **Listen, with consent.** The first time the user turns on Listen mode,
    Turn asks their permission to send their phrases and the partner's words
    to TypeSafe, or to "a third-party AI service in the United States" until
    TypeSafe agrees to be named. Each time Listen mode starts, the user shows
    the partner a consent card; once the partner agrees, a light shows while
    the phone listens.
1.  **Answer.** When the partner finishes, the row above the grid offers the
    user's phrases that answer: one big button when Turn is confident, up to
    six otherwise, and no change when none fits. A yes-or-no question puts
    Yes, No, and Not sure first. The user taps, and Turn speaks.
1.  **When it goes wrong.** A caption shows the line Turn heard, so a
    mishearing is plain; the strip asks the partner to say it again with
    one tap; the partner's line can be typed instead; and without a network,
    or when Jev is busy, the phone ranks phrases itself and says so.
1.  **Keep listening.** After 20 partner lines, a paywall offers Turn Listen
    once; closing it leaves everything else as it was.

The moments that carry the product:

- **The "aha":** a partner asks "How was physio?", and "It was hard" is
  waiting before the user reaches for the keyboard, though the two share no
  content word.
- **The steady row:** a second question doesn't reshuffle the buttons the
  user was reaching for.
- **The row that holds:** small talk that needs no reply changes nothing.

[prd-functional]: /docs/PRD.md#functional-requirements

## The phrase bank

The phrase bank is the user's voice, so it's theirs to shape, and it never
leaves the phone whole.

- **A phrase** is text the user can say, in one category, optionally tied to
  places, with a count of how often the user taps it.
- **Categories** group phrases on the grid, such as feelings, body and pain,
  needs, people, plans, food and drink, opinions, social talk, and the
  clinic. The user can rename, add, and reorder them.
- **Places** say where the user is, such as home, the clinic, or a shop,
  picked with one tap on the grid from a list the user edits. Turn never
  reads the location, so it needs no location permission.
- **The fixed buttons,** Yes, No, and Not sure, are always there, and take the
  first slots of the row for a yes-or-no question.
- **The conversation strip** holds five phrases that manage the
  conversation, always in the same place and never ranked: a floorholder,
  "Wait, I'm typing"; a repair, "Sorry, say that again"; a question back,
  "And you?"; an introduction to the app; and "Something's wrong". AAC
  research supports each, and repair has to take one tap
  ([AAC notes][aac-strip]).
- **The starter bank** holds about 150 editable phrases, written by the team
  and reviewed by a campus speech-language pathology clinic if a review can
  be booked. They stay the team's words until the user keeps them, so setup
  invites the user to make them their own.
- **It grows with use.** Every typed reply joins the bank, and the phrases the
  user taps most rise in the shortlist.

[aac-strip]: /docs/research/aac-practice.md#quick-fire-turn-holding-and-repair-messages

## Business model

| What                                             | Free | Turn Listen |
| ------------------------------------------------ | ---- | ----------- |
| Speaking: the grid, typing, and saved phrases    | Yes  | Yes         |
| Personal Voice and system voices                 | Yes  | Yes         |
| Listen mode for the first 20 partner lines       | Yes  | Yes         |
| Listen mode after 20 partner lines               | No   | Yes         |
| Suggestions from the letters typed, on the phone | Yes  | Yes         |

- **Price:** $24.99, paid once, for the entitlement `listen`; the idea's
  [monetization][idea-money] section has the reasoning and what a user
  costs.
- **When it asks:** when the free lines run out, or when the user turns
  Listen mode on after that. The paywall closes with one tap, and Settings
  offers Turn Listen and Restore Purchases, so a caregiver can buy from
  there.
- **For Next Gen:** the purchase runs through RevenueCat's Test Store, which
  the organizers accept for Next Gen, so the entry reports no revenue; the
  PRD's [purchase requirements][prd-pay] say how.
- **What it never sells:** speech, the user's words or data, or ads.
- **What a purchase promises:** for the entry, the relay runs until the
  winners are announced on October 21 or 22, 2026, and afterward Listen mode
  falls back to the phone's own ranking. A store release would first have to
  say how long a one-time purchase keeps Listen mode working; see the PRD's
  [open questions][prd-open].

[idea-money]: /docs/IDEA.md#monetization
[prd-pay]: /docs/PRD.md#the-paywall-and-purchases
[prd-open]: /docs/PRD.md#open-questions

## Success metrics

The **north star** is replies from the row: partner lines the user answers
by tapping a phrase the row offered, out of all partner lines they answer.
It measures the promise, the user's own words in time, and it grows only if
the ranking is right and the row stays steady. AAC research favors time to
the spoken reply and acceptance of what's offered over keystrokes saved,
which didn't predict rate or success ([AAC notes][aac-measures]).

In the first version, these numbers come from the evaluation, rehearsals,
and the relay's logs; Turn has no analytics SDK and sends no usage data.
The targets below are decisions this document sets, except where a source is
named.

- **Replies from the row:** counted on the team's phones during rehearsals,
  and in the clinic's session if one is booked; the counts stay on the phone.
- **Ranking quality,** from the [evaluation][prd-eval] of 80 partner lines:
  top-1 and top-6 accuracy for each ranker, and how often the row holds when
  no phrase fits, each with its interval. Eighty lines settle only large
  differences, so Jev earns its place when it clearly beats the other
  rankers on top-6 accuracy; if it still trails after re-ranking an
  embedding shortlist, the README says so, as the idea's
  [risks][idea-risks] require.
- **Speed:** the time from the end of the partner's speech to the row, kept
  apart from the user's own time to choose, and from a tap to speech; the
  PRD's [performance requirements][prd-perf] set the targets.
- **Guardrails:**
  - No wrong big button on a yes-or-no, pain, or consent line in the
    evaluation.
  - Steadiness: slots that change per partner line, on replayed
    conversations.
  - Privacy: no audio and no transcript found on the phone or in the relay's
    logs after a session.
  - Degraded lines: the share of partner lines the phone ranks because the
    relay failed.
- **The purchase:** Test Store purchases, which RevenueCat reports as
  sandbox data, with no revenue target. Its charts, paywall views included,
  count production data only, so the entry reports no conversion rate.

[aac-measures]: /docs/research/aac-practice.md#rate-savings-and-acceptance-measures
[prd-eval]: /docs/PRD.md#evaluation-requirements
[idea-risks]: /docs/IDEA.md#risks
[prd-perf]: /docs/PRD.md#performance

## Roadmap

- **The first version, filmed on September 28, 2026:** the PRD's Must
  requirements.
- **Through October 22:** the PRD's Should requirements, such as the replay
  script, the clinic's fixes, and an alert when Jev's credits run low, with
  the relay running for judges.
- **Later, if AAC users and clinicians want it:** candidates, each with the
  signal that would justify it.
  - An App Store release, with a paid Apple Developer Program membership and
    a real one-time purchase, if clinicians or users ask to use Turn day to
    day.
  - The partner's own phone joining the conversation, if partners ask to
    type or speak into their own device.
  - Switch and eye-gaze access designed around the row, if users whose
    motor control changes find iOS's own access too slow.
  - An iPad layout, since many AAC users carry an iPad; the iPhone layout
    already runs there.
  - Languages other than English, once Jev's accuracy outside English is
    known; English is "where accuracy is currently best"
    ([Jev notes][jev-lang]).
  - Android, from the same Expo code, once live transcription and a personal
    voice work there.
  - A backup of the phrase bank the user controls, if users fear losing it
    with a phone.

[jev-lang]: /docs/research/jev.md#jev-platform-and-language-support

## What Turn is not

- **Not a writer.** Jev returns probabilities, and every reply is a phrase
  the user saved or typed.
- **Not a recorder.** No audio or transcript is kept.
- **Not a medical device or an emergency service,** and not a substitute for
  an AAC assessment by a speech-language pathologist.
- **Not for children.**
- **Not a subscription.** Speech is free, and Listen mode is sold once.

## See also

- [Idea](/docs/IDEA.md): why Turn was chosen for the Next Gen Award, its
  schedule, risks, and pitch.
- [Product requirements](/docs/PRD.md): what the first version must do, as
  numbered requirements with checks.
- [Technical requirements](/docs/TRD.md): how the first version is built.
- [Design](/docs/DESIGN.md): how Turn looks, reads, and moves, as tokens and
  rules a coding agent can follow.
- [AAC practice notes][aac-notes]: design conventions, access, outcome
  measures, and ethics in AAC.
- [Evidence notes](/docs/research/next-gen-evidence.md): rivals, need, and
  harm behind the idea.
- [Jev notes](/docs/research/jev.md): what Jev is, its API, prices, limits,
  and terms.
- [Guessling product](/docs/archive/guessling-product.md): the product
  document for the team's first idea, archived.

[idea-problem]: /docs/IDEA.md#problem-and-audience
[aac-notes]: /docs/research/aac-practice.md

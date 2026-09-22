# Turn product requirements

What the first version of Turn must do, as numbered requirements, each with a
priority and a check a tester can run. The [product](/docs/PRODUCT.md) says
why, the [technical requirements](/docs/TRD.md) say how it's built, and the
[idea](/docs/IDEA.md) owns the schedule, the risks, and the pitch. Facts are
as of September 22, 2026.

Contents:

1.  [Overview](#overview)
1.  [Goals and non-goals](#goals-and-non-goals)
1.  [User scenarios](#user-scenarios)
1.  [Functional requirements](#functional-requirements)
1.  [See also](#see-also)

## Overview

- **Release:** the first version of Turn, for iPhone, in English, entered for
  the Next Gen Award as a public repository with setup instructions and an
  open-source license, a demo video, and a Simulator build, with no store
  release ([Next Gen rules][ng-submit]). The video is recorded on Monday,
  September 28, and the entry is submitted by Wednesday, September 30, 2026,
  at 11:45 PM PT, under the idea's [schedule][idea-schedule].
- **Scope:** the idea's [Must and Should lists][idea-scope], turned into
  requirements, plus what the research notes add. The idea's Won't list is
  this document's [non-goals](#goals-and-non-goals).
- **How to read a requirement:** each is one bullet with an ID, a priority,
  a statement, and a check. Must means the entry isn't submitted without it;
  Should means the first version or the weeks before October 22. IDs are
  never reused, and the TRD's [traceability table][trd-trace] maps each one
  to the parts of the build that meet it. Numbers such as limits, targets,
  and timeouts are decisions of this document unless a source is named.
- **Words used here:**
  - A _partner line_ is one thing the partner says, from when they start
    speaking to when they stop, or one line typed for them.
  - _Listen mode_ is the state in which Turn hears the partner, or takes
    typed partner lines, and suggests replies.
  - The _row_ is the reply area above the grid: six _slots_ in two rows of
    three, or one _big button_ across all of them.
  - The _fixed buttons_ are Yes, No, and Not sure.
  - A _candidate_ is one of the 40 phrases the phone sends with a partner
    line; the _shortlist_ is those 40.
  - The _relay_ is the team's Cloudflare Worker, and _free lines_ are the 20
    partner lines Jev answers before the paywall.
  - The _place_ is where the user says they are, picked from their own list.
  - The _floor_ (0.6), the _big-button bar_ (0.85), and the _margin_ (0.15)
    are the probabilities and the difference that decide the row, fixed
    before the evaluation checks them (EVAL-2).
  - The _phone's own ranking_ is the ranking the phone does without Jev,
    offline or when Jev fails.

[ng-submit]: /docs/research/next-gen.md#what-a-next-gen-entry-must-submit
[idea-schedule]: /docs/IDEA.md#schedule-to-september-30
[idea-scope]: /docs/IDEA.md#scope-of-the-first-version
[trd-trace]: /docs/TRD.md#requirements-traceability

## Goals and non-goals

Goals for the first version, each with the measure that shows it's met:

1.  **Submitted, complete, by September 30, 2026.** Measure: Devpost shows
    the entry as submitted, with every item of the brief's
    [submission checklist][brief-checklist] that applies to Next Gen.
2.  **The loop works on camera.** Measure: in the video, a partner's spoken
    line brings the row within PERF-1's time, and a tapped reply is spoken
    within PERF-2's.
3.  **Jev earns its place in public.** Measure: the README carries the
    evaluation's table of four rankers on the same 80 lines (EVAL-3).
4.  **Consent and privacy hold.** Measure: the privacy check passes
    (RELEASE-3).
5.  **The purchase is real code.** Measure: a Test Store purchase unlocks
    Listen mode on an iPhone, and Restore Purchases brings it back (PAY-4,
    PAY-6).
6.  **Judges can run it.** Measure: someone outside the team follows the
    README from a Mac to a spoken reply in the Simulator (SUBMIT-2).

Non-goals for the first version, from the idea's Won't list, plus two this
document adds:

- A partner joining from their own phone.
- Android and an iPad layout.
- Accounts, and phrase banks on a server.
- Languages other than English.
- Switch or eye-gaze access beyond what iOS provides.
- A store release, TestFlight, and real payments (added).
- Usage analytics (added).

[brief-checklist]: /docs/BRIEF.md#submission-checklist

## User scenarios

Each scenario must work end to end on the build the video uses, except the
judge's, which uses the Simulator build.

1.  **The "aha".** At the clinic, the partner asks "How was physio?". "It was
    hard" appears in the row before the user reaches for the keyboard; the
    user taps it and hears it in their Personal Voice.
2.  **A yes-or-no question.** The partner asks "Do you want some water?".
    Yes, No, and Not sure take the first three slots; the user taps Yes.
3.  **Small talk.** The partner says "It's cold out today." No phrase reaches
    the floor, and the row doesn't change.
4.  **A partner who says no.** The user starts Listen mode and shows the
    consent card; the partner declines, the user taps "They said no", and the
    microphone never turns on.
5.  **A partner under 18.** The user turns on the under-18 switch. The
    microphone stays off, and a partner line typed for them is ranked on the
    phone; nothing reaches the relay.
6.  **No network.** On a train, the partner asks "Are you tired?". The line
    is transcribed on the phone, the row offers phrases that share its words,
    and the app says it ranked them on the phone.
7.  **A busy Jev.** The relay times out twice in three lines. Each of those
    lines is ranked on the phone, and the app says Listen mode is degraded
    until a line succeeds.
8.  **The free lines run out.** On the 21st partner line, the paywall opens.
    The user closes it and keeps speaking from the grid. Later they buy Turn
    Listen through Test Store, and the next partner line reaches Jev.
9.  **Restoring.** After buying, the user taps Restore Purchases in
    Settings; Turn refreshes the purchase and says Listen mode is unlocked.
10. **A judge.** A judge installs the Simulator build from the README, types
    "How was physio?" as the partner's line, sees "It was hard" in the row,
    and hears it in a system voice.
11. **A new phrase.** The user types "The new nurse is kind" and speaks it.
    It joins the bank, and the next time a partner asks about the nurse, it
    can appear in the row.
12. **Turn doesn't hear itself.** In Listen mode, the user taps "It was
    hard". Turn speaks it, and the caption never shows those words as the
    partner's.
13. **A repair.** The partner says something the user didn't catch. With
    one tap on the strip, Turn says "Sorry, say that again".

## Functional requirements

The flows follow the product's [principles][product-principles]; the TRD
says how each is built.

[product-principles]: /docs/PRODUCT.md#product-principles

### The speaking grid

- **SPEAK-1, Must.** The home screen shows the grid of saved phrases by
  category, the row above it, the conversation strip above the row, the
  place picker, the keyboard button, and the Listen button. Check: on first
  launch, all six are on screen.
- **SPEAK-2, Must.** A tap on a phrase speaks it at once in the chosen voice.
  A tap on another phrase during speech stops the first and speaks the
  second, and a Stop button ends speech. Check: tap two phrases in quick
  succession; only the second finishes.
- **SPEAK-3, Must.** The keyboard takes up to 500 characters and speaks them
  on one tap of Speak. Typed text of up to 200 characters joins the bank in
  the category Typed, unless the bank already holds the same text. Check:
  speak a new sentence, then find it under Typed; speak it again, and it
  isn't added twice.
- **SPEAK-4, Must.** As the user types, the row offers up to six saved
  phrases containing a word that starts with the letters typed, the place's
  phrases first. Check: at Home, type "wa"; "Wait, I'm typing" and "Water,
  please" appear.
- **SPEAK-5, Must.** Speaking never waits on the network, the relay,
  RevenueCat, the paywall, or the consent flow. Check: in Airplane Mode, and
  with the relay's address blocked, every phrase and typed sentence speaks.
- **SPEAK-6, Should.** A Repeat button speaks the last spoken text again.
  Check: speak a phrase, then tap Repeat.
- **SPEAK-7, Must.** The conversation strip holds five phrases that manage
  the conversation, always in the same place and never ranked: "Wait, I'm
  typing", "Sorry, say that again", "And you?", "I use this app to talk.
  Please give me time.", and "Something's wrong". Each speaks with one tap,
  and the user can reword them but not move or remove them. Check: with the
  grid on any category, each strip phrase speaks with one tap.

### The phrase bank

- **BANK-1, Must.** On first launch, the bank holds the starter bank
  (CONTENT-1), and every starter phrase and category can be edited. Check:
  edit a starter phrase and relaunch; the edit stays.
- **BANK-2, Must.** The user can add, edit, delete, and move phrases between
  categories, and add, rename, reorder, and delete categories; deleting a
  category that holds phrases asks where they go. Check: each action in the
  editor.
- **BANK-3, Must.** A phrase holds 1 to 200 characters, and each can be tied
  to any of the user's places. Check: a 201st character can't be typed in
  the editor.
- **BANK-4, Must.** The grid's order changes only when the user changes it.
  The place, taps, and the row never reorder the grid. Check: change the
  place and speak ten phrases; the grid is unchanged.
- **BANK-5, Must.** The fixed buttons can't be deleted or renamed, and the
  Quick category, which holds them, comes first in the grid. Check: the
  editor offers no delete for Yes, No, or Not sure.
- **BANK-6, Must.** Every spoken phrase adds one to its tap count, which the
  shortlist uses. Check: speak a phrase that no line has suggested three
  times; with no other signal, it enters the next shortlist among the
  most-tapped.
- **BANK-7, Must.** The bank works at 2,000 phrases within PERF-3 and PERF-4.
  Check: seed 2,000 phrases and run both checks.
- **BANK-8, Must.** The bank, the places, and the tap counts stay on the
  phone: nothing syncs, and only the shortlist leaves it, per partner line.
  Check: a capture of the app's traffic shows no other phrase text.
- **BANK-9, Should.** Deleting a phrase can be undone for five seconds. Check:
  delete a phrase and tap Undo.
- **BANK-10, Should.** Starter phrases are the team's words until the user
  keeps them, so the first launch invites the user, or whoever helps them,
  to review the starter bank category by category, and the editor marks
  starter phrases nobody has reviewed. Check: on a fresh install, review one
  category, and its marks go.

### Places

- **PLACE-1, Must.** The place picker shows the current place and changes it
  with one tap from the user's list, which starts with Home, Clinic, Shop,
  and Out, and holds up to 12 places of up to 40 characters. Check: pick
  Clinic, relaunch, and Clinic is still chosen.
- **PLACE-2, Must.** Turn never asks for or reads the location. Check: the
  app's Info.plist has no location usage key, and iOS Settings shows no
  Location entry for Turn.
- **PLACE-3, Must.** Only the current place's name leaves the phone, with
  each partner line. Check: a captured request holds the name and nothing
  else about places.

### Voices

- **VOICE-1, Must.** Settings lists the installed English system voices and,
  when authorized, the user's Personal Voice, each with a preview. Check:
  preview two voices.
- **VOICE-2, Must.** Choosing Personal Voice asks iOS for permission. If
  granted, Turn speaks with it; if denied or unavailable, Turn says which,
  explains that iOS Settings must allow apps to ask, and keeps the system
  voice. Check: on an iPhone with a Personal Voice, allow and deny; on the
  Simulator, see the explanation.
- **VOICE-3, Must.** The user can set the speech rate in five steps. Check:
  the slowest and fastest steps are audibly different.
- **VOICE-4, Must.** Turn speaks from the loudspeaker, or from connected
  headphones or a speaker, at the phone's volume, in Listen mode as well,
  and with the Ring/Silent switch set to silent. Check: in Listen mode with
  the switch on silent, a phrase is heard from the bottom speaker.

## See also

- [Product](/docs/PRODUCT.md): what Turn is, for whom, and why.
- [Technical requirements](/docs/TRD.md): how the first version is built,
  with every requirement here traced.
- [Idea](/docs/IDEA.md): the schedule, the risks, and the pitch.
- [AAC practice notes](/docs/research/aac-practice.md),
  [iPhone build notes](/docs/research/turn-ios.md),
  [relay and services notes](/docs/research/turn-services.md), and
  [evaluation notes](/docs/research/turn-evaluation.md): the sources behind
  the requirements.
- [Guessling product requirements](/docs/archive/guessling-prd.md): the
  requirements for the team's first idea, archived.

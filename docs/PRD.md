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
1.  [Content requirements](#content-requirements)
1.  [Evaluation requirements](#evaluation-requirements)
1.  [Non-functional requirements](#non-functional-requirements)
1.  [Measurement requirements](#measurement-requirements)
1.  [Submission requirements](#submission-requirements)
1.  [Release criteria](#release-criteria)
1.  [Dependencies and assumptions](#dependencies-and-assumptions)
1.  [Open questions](#open-questions)
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
    Listen mode on an iPhone, and Restore Purchases reports it (PAY-4,
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
  phrases, other than the strip's, containing a word that starts with the
  letters typed, the place's phrases first. Check: at Home, type "wa"; saved
  phrases such as "Water, please" appear, and "Wait, I'm typing" doesn't.
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
  categories, and add, rename, reorder, and delete categories, up to 12
  categories of up to 40 characters, Quick and Typed included; deleting a
  category that holds phrases asks where they go. Check: each action in the
  editor, and a 13th category can't be added.
- **BANK-3, Must.** A phrase holds 1 to 200 characters, and each can be tied
  to any of the user's places. Check: a 201st character can't be typed in
  the editor.
- **BANK-4, Must.** The grid's order changes only when the user changes it.
  The place, taps, and the row never reorder the grid. Check: change the
  place and speak ten phrases; the grid is unchanged.
- **BANK-5, Must.** The fixed buttons can't be deleted or renamed, and the
  Quick category, which holds them, comes first in the grid. The starter
  category for body and pain can be renamed but not deleted, since the
  safety rules in ROW-3 follow it. Check: the editor offers no delete for
  Yes, No, Not sure, or the body and pain category.
- **BANK-6, Must.** Every spoken phrase adds one to its tap count, which the
  shortlist uses. Check: speak a phrase that no line has suggested three
  times; with no other signal, it enters the next shortlist among the
  most-tapped.
- **BANK-7, Must.** The bank works at 2,000 phrases within PERF-3 and PERF-4.
  Check: seed 2,000 phrases and run both checks.
- **BANK-8, Must.** The bank, the places, and the tap counts stay on the
  phone: nothing syncs, and only what ROW-2 sends leaves it, per partner
  line. Check: a capture of the app's traffic shows no other
  phrase text.
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
- **VOICE-4, Must.** Turn speaks at the phone's volume with the Ring/Silent
  switch set to silent. Outside Listen mode, speech follows the phone's
  current audio route; in Listen mode, it plays from the loudspeaker, so the
  partner hears it. Check: in Listen mode with the switch on silent, a
  phrase is heard from the bottom speaker; outside it, with headphones
  connected, from the headphones.

### Permission and consent

- **CONSENT-1, Must.** The first time Listen mode is turned on, before any
  phrase or line leaves the phone, Turn asks the user's permission. The step
  says what ROW-2 sends with each partner line, with the names Turn
  recognizes swapped for tags, to whom (TypeSafe, or "a third-party
  AI service in the United States" until TypeSafe agrees to be named), that
  audio and the rest of the bank never are, and that the service may keep data
  to monitor its service; it links the privacy notice, and offers "Allow" and
  "Not now" with equal weight. Check: read the step on a fresh install.
- **CONSENT-2, Must.** "Not now" leaves Listen mode off and everything else
  working, and the step returns the next time Listen mode is turned on.
  Check: choose "Not now", speak a phrase, then turn Listen mode on again.
- **CONSENT-3, Must.** The user can withdraw permission in Settings. Listen
  mode stops at once, and nothing more leaves the phone until they allow it
  again. Check: withdraw during Listen mode; the light goes out, and no
  request follows.
- **CONSENT-4, Must.** Each time Listen mode starts, Turn shows the consent
  card for the partner, short and in large text, so it doesn't make more of
  the user's device than it must: the phone will listen to transcribe
  their words on the phone; the words, with the names it recognizes
  replaced, go to the service named in CONSENT-1 to pick replies from the
  user's own phrases; no audio is recorded; and listening can be paused at
  any time. The card has "They agreed" and "They said no", and the microphone
  turns on only after "They agreed". Check: tap "They said no"; the iOS
  microphone indicator never appears.
- **CONSENT-5, Must.** While the microphone is on, the listening light shows
  on the home screen with the word "Listening", as Apple's developer
  agreement asks of any app that captures speech; one tap pauses it, and a
  second tap resumes without the card within the same session. Check: pause
  and resume; the iOS indicator follows.
- **CONSENT-6, Must.** The consent card and Settings show the switch "My
  partner is under 18", which stays as set until changed. While it's on, the
  microphone stays off, typed partner lines are ranked on the phone and never
  sent, and the row says Listen mode is off for this partner. Check: with the
  switch on, type a line; the relay's logs show no request.
- **CONSENT-7, Must.** Whether the permission step, the consent card, and the
  privacy notice name TypeSafe follows the relay's configuration, which
  starts with naming off. Check: turn the setting on, relaunch, and the texts
  name TypeSafe.

### Listening

- **LISTEN-1, Must.** In Listen mode, Turn transcribes the partner's speech
  live on the phone, and a caption shows the words as they're heard. The
  first time, Turn downloads Apple's English speech model with a progress
  bar; after that, transcription needs no network. Check: once the model is
  installed, in Airplane Mode, the caption still follows a partner's speech.
- **LISTEN-2, Must.** A partner line ends after a short silence, 0.5
  seconds to start and tuned so PERF-1 and PERF-5 both hold, or when the
  user taps Done, and each line is ranked once. Check: say two sentences
  with a pause; two lines are ranked.
- **LISTEN-3, Must.** Turn never transcribes its own speech: listening pauses
  while Turn speaks, and resumes when it stops. Check: scenario 12.
- **LISTEN-4, Must.** A field takes a typed partner line, "What did they
  say?", and sends it as a line; it works with no microphone and in the
  Simulator. Check: scenario 10.
- **LISTEN-5, Must.** Before a line leaves the phone, every name Turn
  recognizes in what ROW-2 sends is swapped for a tag, the same tag for the same
  name across the request. Check: the line "Did Anna call?" and the phrase "Anna
  is my sister" reach the relay as `[PERSON 1]` in both, with "Anna" nowhere.
- **LISTEN-6, Must.** A partner line longer than 300 characters once its
  names are tagged keeps its last 300 characters. Check: a typed line of 400
  characters reaches the relay as its last 300.
- **LISTEN-7, Must.** When Turn leaves the foreground, listening stops, and
  when it returns, Listen mode is paused until the user taps the light.
  Check: switch apps; the iOS microphone indicator goes out.
- **LISTEN-8, Must.** The caption lives only in memory and is cleared on
  pause, on stop, and two minutes after the line ends. Check: wait two
  minutes; the caption is gone.
- **LISTEN-9, Must.** When live transcription isn't available on the
  device, Turn says so and offers the typed-line field, and uses the fallback
  recognizer where it works. Check: on the Simulator, the message and the
  field appear.
- **LISTEN-10, Should.** A phone call or Siri pauses listening, and Listen
  mode stays paused afterward. Check: receive a call during Listen mode.

### The reply row

- **ROW-1, Must.** The row has a fixed height above the grid. It shows one
  big button across the row, or up to six phrase buttons in six fixed slots,
  and its height never changes with its content. Check: the grid's first
  button doesn't move across every state of the row.
- **ROW-2, Must.** For each partner line, the phone sends the relay the
  line, the place's name, the category names, and a shortlist of 40 of the
  user's phrases, never the fixed buttons; the shortlist holds the phrases
  already in the row. Check: a captured request.
- **ROW-3, Must.** One big button shows the top phrase when its probability
  is above the big-button bar, the line isn't a yes-or-no question, and its
  topic isn't one that never gets a big button, which starts as body and
  pain, and agreeing to or refusing care. Otherwise the row shows up to six
  phrases at or above the floor. Below the floor, the row doesn't change. Check:
  replay recorded answers at 0.9, 0.7, and 0.5, and a pain line and a consent
  line at 0.9.
- **ROW-4, Must.** For a yes-or-no question, Yes, No, and Not sure take the
  first three slots in that order, phrases at or above the floor take the
  other three, and no big button shows. Check: scenario 2.
- **ROW-5, Must.** A phrase already shown keeps its slot while its new
  probability stays at or above the floor, unless the fixed buttons need
  the first three slots. A new phrase replaces the lowest one shown only
  when it beats it by the margin, and the others don't move. After a big
  button, that phrase takes the first free slot if it stays at or above the
  floor. Check: replay recorded answers that shift by less, and by more,
  than the margin.
- **ROW-6, Must.** Nothing speaks until the user taps; a tap speaks the phrase
  and adds to its tap count. Check: leave a big button untouched for a
  minute; nothing speaks.
- **ROW-7, Must.** An answer for a line older than the newest line is
  dropped. Check: delay one answer past the next line's; the older one never
  shows.
- **ROW-8, Must.** The floor, the big-button bar, the margin, whether
  yes-or-no questions also get phrases, the topics that never get a big
  button, and the topics that get only the fixed buttons come from the relay
  with each answer, so the team can change them without an app build. Check:
  change a value in the relay; the next line follows it.
- **ROW-9, Must.** The topic Jev picks marks its category's tab in the grid,
  without scrolling or reordering it. Check: after "What do you want for
  lunch?", the food tab is marked.
- **ROW-10, Must.** A Clear button empties the row, and stopping Listen mode
  clears it too. Check: tap Clear.

### Offline and degraded states

- **STATE-1, Must.** With no network, Listen mode still transcribes, and the
  phone ranks each line itself: up to six phrases sharing a word with the
  line other than common words, the place's phrases first among ties, or no
  change when none does, under a note that the phone ranked them. SPEAK-4
  covers ranking by the letters typed. Check: scenario 6.
- **STATE-2, Must.** When the relay or Jev fails, or no answer arrives within
  3 seconds, the phone ranks that line itself. After two failures in the
  last three lines, the app says Listen mode is degraded until a line
  succeeds. Check: scenario 7, with the relay's address blocked.
- **STATE-3, Must.** When the relay's configuration turns Jev off, every line
  is ranked on the phone, and the app says Listen mode is degraded. Check:
  turn Jev off in the relay and send a line.
- **STATE-4, Must.** Once the free lines are used up without the
  entitlement, the relay answers no line, and the app opens the paywall
  (PAY-2) instead of ranking. Check: scenario 8.

### The paywall and purchases

- **PAY-1, Must.** The relay counts 20 free partner lines per app user ID,
  counting only lines Jev answered, and the Listen button shows how many
  remain. Check: after 20 answered lines, the 21st opens the paywall.
- **PAY-2, Must.** When the free lines run out, or when the user turns Listen
  mode on after that without the entitlement, a RevenueCat Paywall opens. It
  shows the one-time price, says speaking stays free, and closes with one
  tap; closing it turns Listen mode off and leaves everything else as it
  was. Check: close the paywall, then speak a phrase.
- **PAY-3, Must.** The paywall sells Turn Listen, a one-time Test Store
  product at $24.99 that grants the entitlement `listen`, in the offering
  `default`, configured in RevenueCat's dashboard. Check: the dashboard, and
  the paywall's price.
- **PAY-4, Must.** A successful Test Store purchase unlocks Listen mode at
  once, without a restart, and the next partner line reaches Jev. Check:
  scenario 8.
- **PAY-5, Must.** A cancelled or failed Test Store purchase leaves Listen
  mode locked and says so; nothing else changes. Check: choose each failure
  outcome Test Store offers.
- **PAY-6, Must.** Settings holds Restore Purchases. Under Test Store,
  RevenueCat can't restore a purchase and only refreshes the current user's,
  so the button refreshes and says whether Listen mode is unlocked. Check:
  scenario 9.
- **PAY-7, Must.** Past the free lines, the relay answers only for an app
  user ID with an active `listen` entitlement, checked with RevenueCat.
  Check: a request with a fresh ID's 21st line and no purchase gets the
  paywall response.
- **PAY-8, Must.** If the dashboard's form can't make a one-time Test Store
  product, the team makes it through RevenueCat's API, which supports one,
  as the idea's [risks][idea-risks] plan. Check: the
  product's type in the dashboard on September 22.
- **PAY-9, Must.** Judges can use Listen mode, free of charge and without
  restriction, until judging ends on October 13, 2026, as the
  [official rules][ctx-rules] require: the Test Store purchase works in the
  builds they run, or the build that can't buy isn't held to the free lines.
  Check: on September 25, buy in the Simulator build, or run 25 lines in it.
- **PAY-10, Should.** The user's ID survives a reinstall where iOS keeps it,
  so the purchase and the count of free lines do too. Check: buy, delete
  and reinstall Turn on the same iPhone, and see Listen mode still unlocked.

[ctx-rules]: /docs/CONTEXT.md#what-the-official-rules-add

### Settings

- **SET-1, Must.** Settings holds the voice and its rate, Personal Voice,
  Listen mode's permission and its withdrawal, the under-18 switch, the
  places, the phrase bank editor, Turn Listen, which opens the paywall,
  Restore Purchases, the privacy notice, the
  open-source licenses, and the app's version and the relay's status.
  Check: each entry opens.
- **SET-2, Must.** The privacy notice reads in the app with no network.
  Check: open it in Airplane Mode.
- **SET-3, Should.** "Erase all data" deletes the bank, the places, the tap
  counts, and the settings after a confirmation, and restores the starter
  bank. Check: erase, and the starter bank returns.
- **SET-4, Should.** "Stats on this phone" shows the measurements METRIC-3
  names, and a button resets them. Check: after five lines, the counts
  match.

## Content requirements

- **CONTENT-1, Must.** The starter bank holds 140 to 160 phrases in about
  ten categories, written by the team in plain US English, each of at most
  120 characters and naming no real person. It includes the Quick category
  (the fixed buttons, "I don't know", and "I have something to say"), the
  conversation strip's five phrases (SPEAK-7), and phrases for pain, where
  it hurts, and refusing or agreeing to care. Check: a script counts phrases
  and lengths, and a teammate reads every phrase.
- **CONTENT-2, Must.** The starter places are Home, Clinic, Shop, and Out,
  and starter phrases are tied to them. Check: each place has at least ten
  phrases.
- **CONTENT-3, Must.** The permission step and the consent card have two
  versions each, naming TypeSafe and not naming it, and say what CONSENT-1
  and CONSENT-4 require in plain words. Check: a teammate compares each
  version with the requirements.
- **CONTENT-4, Must.** The privacy notice says what stays on the phone, what
  leaves with each partner line (ROW-2) and to whom (the relay on
  Cloudflare, then TypeSafe, in the United States), that lines
  and phrases can reveal health, such as a clinic visit or pain, what
  RevenueCat receives for purchases, as its terms require, what is never
  kept (audio and transcripts), what TypeSafe may keep and
  why, that Turn isn't for children and doesn't listen to partners under 18,
  and how to reach the team. Check: a teammate compares it with the TRD's
  data inventory.
- **CONTENT-5, Should.** A campus speech-language pathology clinic reviews
  Turn with a one-page feature chart in ASHA's terms and five questions:
  whether the starter phrases suit adults with ALS, stroke, or
  laryngectomy; whether the fixed buttons and the strip cover
  safety-critical answers; whether the row changes predictably enough;
  whether the consent card is fair to partners; and who shouldn't be offered
  Turn ([AAC notes][aac-clinic]). The team records what it changed. Check:
  the review notes in the repository.

[aac-clinic]: /docs/research/aac-practice.md#what-a-clinic-review-can-check

## Evaluation requirements

- **EVAL-1, Must.** `eval/` holds 80 partner lines, written by the team by
  hand before looking at the starter bank, each with its kind (yes-or-no,
  either-or, open, or not a question), a place, and every acceptable reply
  in the starter bank, or none, labeled by a teammate other than its writer.
  At least 16 lines have no acceptable reply, at least 24 are yes-or-no
  questions, at least 8 are about pain or health, at least 4 ask for
  consent, and at least 10 share no content word with any acceptable reply.
  Check: a script counts them and prints the labelers' agreement.
- **EVAL-2, Must.** Jev's floor, big-button bar, margin, and question
  wording are committed before the first run, and Jev is reported on all 80
  lines. The embedding ranker's cut-off for holding is set by five-fold
  cross-validation and reported out of fold, and the keyword ranker holds
  when no word is shared, as the phone's own ranking does. If anything of Jev's
  changes after the team sees results, the README reports Jev only on at
  least 20 new lines, written and labeled by a teammate who hasn't seen
  them. Check: the history shows the settings committed before the results.
- **EVAL-3, Must.** One command scores four rankers on the same lines: the
  place's phrases alone, as the phone shows them before any line, keyword
  ranking on the line, Workers AI embeddings, and Jev. On lines with an
  acceptable reply, it reports top-1 and top-6 accuracy and mean reciprocal
  rank, beside the rates chance would give; on every line, what the user would
  see (a right or wrong big button, a right or wrong row, a missed reply, or a
  right hold), with coverage, risk, and an always-hold baseline; and the
  shortlist's recall at 40, the question-kind accuracy, and the latency at the
  median and the 95th percentile. Rates carry 95% intervals, and yes-or-no, pain
  and consent, and no-shared-word lines are also reported apart. Check: run it
  and read the table.
- **EVAL-4, Must.** Jev "trails" embeddings only when a paired bootstrap
  interval for the difference in top-6 accuracy lies wholly below zero;
  otherwise the README says there's no clear difference. When Jev trails,
  the script also scores Jev re-ranking the 40 phrases nearest by Apple's
  sentence embeddings, computed on a Mac as the phone would, since the phone
  builds the shortlist; if that does better, the phone's shortlist switches
  to those embeddings, and the README reports both, as the idea's
  [risks][idea-risks] say. Check: the table shows the interval.
- **EVAL-5, Must.** No big button is wrong on a yes-or-no, pain, or consent
  line. If one is, the relay's configuration gives those lines only the
  fixed buttons and the grid. Check: the script lists every big button on
  those lines.
- **EVAL-6, Must.** The README's table names the date, the model pin, and
  the commit it ran on. Check: read the README.
- **EVAL-7, Should.** A replay script sends recorded partner lines through
  the relay and the row's rules, for rehearsals and for checks of ROW-5.
  Check: replay a conversation and count slot changes.
- **EVAL-8, Should.** The table adds a reliability diagram and Brier score
  for Jev's top phrase, and extra rankers: an off-the-shelf reranker over the
  keyword shortlist, an instruction-tuned embedding, and Apple's sentence
  embeddings, the phone-side path the idea keeps if Jev trails. Check: read
  the table.

## Non-functional requirements

### Performance

- **PERF-1, Must.** The row is drawn within 1.0 second of the end of the
  partner's speech at the median, and within 2.0 seconds at the 95th
  percentile, on Wi-Fi in the United States. The user's own time to choose
  is measured apart. Check: timings from at least 50 replayed lines.
- **PERF-2, Must.** Speech starts within 300 milliseconds of a tap for 95%
  of taps. Check: timings from 50 taps.
- **PERF-3, Must.** The grid is ready to speak within 2 seconds of launch.
  Check: timings from ten cold launches on the video's iPhone.
- **PERF-4, Must.** The phone picks the shortlist within 50 milliseconds
  from a bank of 2,000 phrases. Check: timings from 50 lines.
- **PERF-5, Must.** At most one partner line in ten ends before the partner
  has finished speaking. Check: count cut-off lines among at least 50
  replayed lines.

### Availability

- **AVAIL-1, Must.** The relay runs with Jev's credits funded and auto-refill
  on from submission until the winners are announced on October 21 or 22,
  2026, and a check on each day of judging, October 1 to 13, finds it
  answering. Check: the daily log of checks.
- **AVAIL-2, Should.** The team gets an alert when Jev's credits run low.
  Check: lower the alert's level and see it fire.

### Privacy

- **PRIV-1, Must.** Audio never leaves the phone, and neither audio nor a
  transcript is written to storage on the phone. Check: a capture of the
  app's traffic, and the app's container, after a session.
- **PRIV-2, Must.** No transcript, phrase, place, or category name is
  written to storage in the relay or to its logs. Check: the relay's storage
  and logs after a session.
- **PRIV-3, Must.** Nothing reaches TypeSafe before the user's permission,
  after its withdrawal, or while the under-18 switch is on, and each request
  carries only what CONSENT-1 names. Check: the relay's logs and a capture.
- **PRIV-4, Must.** RevenueCat receives only what its SDK sends for
  purchases, under a random app user ID that names no one, and Turn sets no
  attributes.
  Check: the code sets none.
- **PRIV-5, Must.** The app has no analytics or advertising SDK and doesn't
  track. Check: the dependency list.

### Security

- **SEC-1, Must.** The Jev key and RevenueCat's secret key exist only as the
  relay's secrets; no secret key is in the app, the repository, or its
  history. The Test Store key, the only RevenueCat key the app carries, is
  committed for judging and rotated after the winners are announced. Check:
  a secret scan of the full history before it goes public.
- **SEC-2, Must.** The relay builds Jev's questions and names the model
  itself, and rejects any request over its limits: a line of 300
  characters, 40 candidates of 200 characters each, 12 category names and a
  place name of 40 characters each, and 16 KB in all. Check: an oversized
  field gets a 400.
- **SEC-3, Must.** The relay accepts at most 30 requests a minute from one
  app user ID. Check: the 31st in a minute gets a 429.
- **SEC-4, Must.** The relay's responses and errors never carry keys,
  internal errors, or another user's data. Check: force each error and read
  the response.
- **SEC-5, Must.** The relay stops calling Jev after 10,000 calls in a UTC
  day, retries included, and answers as it does when Jev is busy until
  midnight UTC, so minted IDs can't drain Jev's credits; a line ID already
  used for a free line gets no second call. Check: lower the budget to 3 in a
  test and send 4 lines, then resend a used line ID.

### Accessibility

- **A11Y-1, Must.** Every control is at least 44 by 44 points, phrase buttons
  in the row at least 64 points tall, and the big button fills the row.
  Check: measure in the Accessibility Inspector.
- **A11Y-2, Must.** VoiceOver reads each phrase button as its text with the
  button trait, the light as "Listening" with a hint to pause, and a changed
  row once, as the number of replies. Check: with VoiceOver on.
- **A11Y-3, Must.** Switch Control and Voice Control reach and activate every
  control, and Switch Control scans the row before the grid. Check: with
  each.
- **A11Y-4, Must.** At every Dynamic Type size, up to the largest
  accessibility size, phrase text wraps instead of being cut off, and the
  grid scrolls. Check: at the largest size.
- **A11Y-5, Must.** No action has a time limit, and everything works with
  single taps. Check: walk every scenario with taps only.
- **A11Y-6, Must.** Reduce Motion stops the light's pulse and the row's
  animations, and no state is shown by color alone. Check: with Reduce
  Motion on.
- **A11Y-7, Must.** Text contrasts with its background at 4.5:1 or more, and
  button edges at 3:1, the WCAG 2.2 AA levels. Check: measure every color
  pair.
- **A11Y-8, Must.** Every phrase button's accessibility name is its visible
  text, so a Voice Control user can say "Tap" and the phrase; a phrase's
  other actions, such as Edit, are named accessibility actions, not long
  presses; nothing acts on touch-down; and reordering never needs dragging.
  React Native can't tell when Switch Control or Voice Control is on, so the
  app works for them without detecting them. Check: on an iPhone, say "Tap
  It was hard", and reorder a phrase with Switch Control.

### Compatibility

- **COMPAT-1, Must.** Turn runs on iPhones with iOS 26 or later, in portrait
  and US English, built with Xcode 27 and Expo SDK 57.0.23 or later with
  `ios.enableSceneSupport`. Check: build and run on iOS 26 and iOS 27.
- **COMPAT-2, Must.** The Simulator build runs on Xcode 27's iOS 27
  Simulator, where the typed-line field, the row, speech in a system voice,
  and the paywall work. Check: scenario 10.
- **COMPAT-3, Must.** Personal Voice works on iPhones that support it, and
  other iPhones speak in a system voice. Check: VOICE-2 on both kinds.
- **COMPAT-4, Must.** Debug builds install on the team's iPhones under a free
  Apple account, and the build for the video is installed after September
  21, so its seven-day profile lasts through September 28. Check: the
  build's install date.

## Measurement requirements

- **METRIC-1, Must.** The relay logs one line per request: the time, a short
  prefix of the ID's hash, the sequence number, the outcome (answered,
  paywall, limited, failed, or off), the time spent in Jev and in all, and
  the model and input tokens Jev reports, with no text. Check: read the logs
  after a session.
- **METRIC-2, Must.** A script turns those logs into daily counts of lines
  answered, paywall responses, failures, and latency at the median and the
  95th percentile. Check: run it on a day's logs.
- **METRIC-3, Should.** The phone counts, for "Stats on this phone", partner
  lines, replies from the row, replies from the grid or keyboard, and the
  median times from a line's end to the row and to speech; the counts never
  leave the phone. Check: SET-4.
- **METRIC-4, Must.** RevenueCat's dashboard, with sandbox data shown, has
  the Test Store purchases. Check: after a purchase.

## Submission requirements

The brief's [submission checklist][brief-checklist] owns the full list;
these are what it means for Turn.

- **SUBMIT-1, Must.** The repository, or the public copy the
  [open questions](#open-questions) describe, is public by September 29,
  2026, with an MIT `LICENSE` at its root that GitHub detects, after the
  secret scan in SEC-1. Check: GitHub shows the repository as public with the
  MIT license.
- **SUBMIT-2, Must.** The README opens with the logline and the evaluation's
  table, then gives setup from a Mac with Xcode 27, the Simulator path by
  typing a partner line, the Test Store purchase, the privacy notice, and
  how to run the relay and the evaluation with one's own keys. Check:
  someone outside the team follows it to a spoken reply.
- **SUBMIT-3, Must.** The repository's releases hold a Simulator build that
  points at the team's relay. Check: install it on a clean Simulator.
- **SUBMIT-4, Must.** The video runs under two minutes on YouTube, public or
  unlisted, follows the idea's [pitch][idea-pitch], shows the Test Store
  purchase, uses no copyrighted music, and shows only partners who agreed to
  be filmed. Check: watch it logged out.
- **SUBMIT-5, Must.** The Devpost entry has every item of the brief's
  [submission checklist][brief-checklist] that applies to Next Gen. For
  Turn, that means the description in the idea's order, the repository's URL
  in place of a store link, the bundle ID, how judges reach Listen mode's
  paid part, and the Next Gen Award named with the reason. Check: Devpost
  shows the entry as submitted.
- **SUBMIT-6, Must.** Jev and TypeSafe are named in the app, the video, the
  description, and the README only once TypeSafe has agreed; until then,
  "a hosted decision model", as the idea's [risks][idea-risks] say. Check:
  search each for the names.

[idea-pitch]: /docs/IDEA.md#pitch

## Release criteria

Before recording the video on September 28, 2026:

- **RELEASE-1, Must.** Every other Must requirement's check passes on the
  build the video uses, except those that need the public repository,
  Devpost, or judging (SUBMIT-1 to SUBMIT-6, AVAIL-1, and PAY-9's
  Simulator check), which run under RELEASE-4 and RELEASE-5. Check: the
  checklist, signed off.
- **RELEASE-2, Must.** The evaluation has run with the final thresholds and
  model pin, and the relay's configuration matches its result. Check: the
  README's table and the relay's values.
- **RELEASE-3, Must.** After a 10-minute Listen session, the privacy checks
  PRIV-1 to PRIV-3 pass on the phone and in the relay. Check: the saved
  results.

Before the Devpost deadline on September 30, 2026:

- **RELEASE-4, Must.** SUBMIT-1 to SUBMIT-6 pass, and Devpost shows the entry
  as submitted before 11:45 PM PT. Check: Devpost, logged in.

Through judging:

- **RELEASE-5, Must.** The builds judges run work as the video shows, and
  AVAIL-1 and PAY-9 hold until judging ends on October 13, 2026. Check: the
  daily log of checks.

## Dependencies and assumptions

What the first version depends on, each owned by the team:

- **TypeSafe:** a Jev API key and funded credits with auto-refill, and
  answers on naming TypeSafe and on its SDK in a public repository, as the
  idea's [open questions][idea-open] say.
- **RevenueCat:** a project with the Test Store product, the entitlement,
  the offering, a Paywall, and a secret key for the relay.
- **Cloudflare:** an account for the relay, with Durable Objects.
- **Apple:** a free Apple Account, an iPhone 15 Pro or later for the video,
  and a Mac with Xcode 27.
- **A campus speech-language pathology clinic,** for the Should review.

The idea's [assumptions][idea-open] hold, and this document adds two: the
code lives in this repository, which goes public before submission
(SUBMIT-1), and the team creates Cloudflare and RevenueCat accounts on
September 22 if it has none.

## Open questions

The idea's [open questions][idea-open] still apply. New ones, each with a
safe default:

- **Publishing this repository.** It is private on September 22, 2026;
  `docs/sources/` holds full captures of the contest's web pages; and
  `docs/` names Jev and TypeSafe throughout, which TypeSafe's agreement bars
  announcing without its consent, while SUBMIT-6 keeps the names out until
  then. Safe default: run the secret scan, ask the organizers on Discord
  whether the captures may stay, and include `docs/` in the September 22
  naming request to TypeSafe; if TypeSafe hasn't agreed by September 29,
  publish the code, the README, and the LICENSE in a new public repository,
  and keep this one private.
- **Voices nearby.** The consent card covers the partner, but the microphone
  also hears anyone talking nearby. Safe default: the card and the privacy
  notice ask the user to pause listening when others are talking close by.
- **Intake without a store listing.** The checklist's bundle ID lets intake
  confirm the RevenueCat SDK, and no source says how intake checks a Test
  Store app. Safe default: give the bundle ID and the project ID, and say
  in the description that the purchase runs through Test Store, citing the
  organizers' answers.
- **A one-time purchase's promise.** A store release would sell Listen mode
  once while the relay and Jev cost money per line. Safe default: before any
  store release, decide and publish how long Turn Listen keeps working.
- **The partner under the providers' terms.** TypeSafe's agreement makes the
  team give every notice its use of input needs, but no source says whether
  a partner, who is neither the customer nor the app's user, counts, or
  whether phrases that reveal health are sensitive data under the laws that
  apply ([services notes][svc-notices]). Safe default: the consent card and
  the privacy notice name the flow plainly, and nothing reaches TypeSafe
  without the partner's agreement; ask counsel before any store release.
- **How partners feel about being transcribed.** No study asks the partners
  of AAC users ([AAC notes][aac-partners]). Safe default: keep the card
  short, and ask the clinic's review whether it is fair to partners.

[svc-notices]: /docs/research/turn-services.md#notices-consent-and-sensitive-data
[aac-partners]: /docs/research/aac-practice.md#partners-and-devices-that-listen

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

[brief-checklist]: /docs/BRIEF.md#submission-checklist
[idea-risks]: /docs/IDEA.md#risks
[idea-open]: /docs/IDEA.md#assumptions-and-open-questions

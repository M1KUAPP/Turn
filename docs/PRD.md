# Guessling product requirements

What version 1.0 of Guessling must do, as numbered requirements, each with a
priority and a check a tester can run. The [product](/docs/PRODUCT.md) says
why, the [technical requirements](/docs/TRD.md) say how it's built, and the
[idea](/docs/IDEA.md) owns the schedule and the risks. Facts are as of
September 22, 2026.

Contents:

1.  [Overview](#overview)
1.  [Goals and non-goals](#goals-and-non-goals)
1.  [Player scenarios](#player-scenarios)
1.  [Functional requirements](#functional-requirements)
1.  [Puzzle content requirements](#puzzle-content-requirements)
1.  [Non-functional requirements](#non-functional-requirements)
1.  [Analytics requirements](#analytics-requirements)
1.  [App Store listing and review](#app-store-listing-and-review)
1.  [Release criteria](#release-criteria)
1.  [Dependencies and assumptions](#dependencies-and-assumptions)
1.  [Open questions](#open-questions)
1.  [See also](#see-also)

## Overview

- **Release:** version 1.0 of "Guessling: Daily 20 Questions", for iPhone,
  on the App Store, in English. It goes to App Review on Thursday, September
  24, 2026, and must be live by Sunday, September 27, under the idea's
  [schedule][idea-schedule].
- **Scope:** the idea's [Must and Should lists][idea-scope], turned into
  requirements, plus what the research notes add. The idea's Won't list is
  this document's [non-goals](#goals-and-non-goals).
- **How to read a requirement:** each is one bullet with an ID, a priority,
  a statement, and a check. Must means version 1.0 doesn't ship without it;
  Should means version 1.0 or the first update. IDs are never reused, and
  the TRD's [traceability table][trd-trace] maps each one to the parts of the
  build that meet it. Numbers such as length limits and targets are
  decisions of this document unless a source is named.
- **Words used here:** a _turn_ is a question or guess that counts against
  the twenty; a _puzzle day_ is the calendar date a daily puzzle belongs to;
  the _server_ is the team's Cloudflare Worker; _AI answers_ are answers Jev
  gives through the server; the _bank_ is the category's list of common
  questions with checked answers.

[idea-schedule]: /docs/IDEA.md#schedule-to-september-30
[idea-scope]: /docs/IDEA.md#scope-of-the-first-version
[trd-trace]: /docs/TRD.md#requirements-traceability

## Goals and non-goals

Goals for version 1.0, each with the measure that shows it's met:

1.  **Live on the App Store by Sunday, September 27, 2026,** with its
    subscriptions in the first submission. Measure: the App Store link
    works in the United States.
2.  **Answers players can trust.** Measure: the consistency test passes
    before submission (CONTENT-6), and every answer can be reported.
3.  **A round that feels like a conversation.** Measure: answer times meet
    PERF-1.
4.  **Money that fits the genre.** Measure: a production purchase goes
    through, and RevenueCat shows paywall views, trial starts, and
    conversions.
5.  **Numbers for the write-up.** Measure: the counts in
    [Analytics requirements](#analytics-requirements) produce every number
    the idea's [launch plan][idea-launch] reports.

Non-goals for version 1.0, from the idea's Won't list, plus two this
document adds:

- Accounts, leaderboards, friends, packs, and push notifications.
- Android and an iPad layout.
- Languages other than English, and ads.

[idea-launch]: /docs/IDEA.md#launch-and-pitch

## Player scenarios

Each scenario must work end to end on the release build.

1.  **A first round.** A new player opens the app, reads the notice, allows
    AI answers, and types "Does it live in water?". The Guessling shakes
    its head within two seconds.
2.  **A daily habit.** A returning player solves today's puzzle in nine
    turns, shares the result to a group chat, and sees when the next puzzle
    arrives.
3.  **No AI.** A player chooses "Not now" on the notice and plays today's
    puzzle by picking questions from a list; nothing they type reaches
    TypeSafe.
4.  **Lost signal.** A player's phone goes offline mid-round. The app says
    so, keeps the round, and lets them send the question again once the
    phone is back online, without using an extra turn.
5.  **Wanting more.** A player taps "Play yesterday's?", starts the yearly
    plan's free trial, and plays yesterday's puzzle at once.
6.  **A new phone.** A subscriber installs the app on a new iPhone, taps
    Restore Purchases, and gets the archive back.
7.  **A judge.** A judge opens the offer code's link on October 1, 2026,
    gets a free month of Guessling+, and plays archive puzzles until judging
    ends on October 13.
8.  **A wrong answer.** A player reports an answer they think is wrong.
    Players that day keep getting the same answer, and once the puzzle
    closes, archive players get the corrected one.
9.  **Two time zones.** Players in Tokyo and in San Francisco each play the
    same puzzle on their own Friday and get the same answers to the same
    questions.
10. **Past midnight.** A player is on turn 12 at 11:58 PM. After midnight
    they finish the round, and the app then opens the new day's puzzle.
11. **App Review.** A reviewer follows the review notes, finishes a round,
    and reaches the paywall.

## Functional requirements

The flows follow the product's [principles][product-principles]; the TRD
says how each is built.

[product-principles]: /docs/PRODUCT.md#product-principles

### The AI notice

- **NOTICE-1, Must.** Before a player's first question can be sent, the app
  shows a notice, whose text comes from the server. It says that typed
  questions go to an AI service to be answered, that asked questions are
  kept without anything that identifies the player, to answer everyone the
  same way and to improve puzzles, and that plays are counted; it asks the
  player not to type personal information; it links the privacy policy; and
  it offers "Allow AI answers" and "Not now" with equal weight. Check: on a
  fresh install, the question field stays disabled until the player
  chooses, the notice matches the server's text, the two buttons share one
  size and style, and the privacy link opens.
- **NOTICE-2, Must.** The notice names TypeSafe, unless TypeSafe objects, in
  which case the server's text says "a third-party AI service"; the idea's
  [Jev section][idea-jev] explains why. Check: changing the server's text
  changes the notice with no app update.
- **NOTICE-3, Must.** With "Not now", nothing the player types reaches
  TypeSafe, the server stores none of their wordings, except in a report they
  choose to send, and counts none of their plays, and the player still plays
  everything, Guessling+ included, through the question list (ASK-9). Check:
  with "Not now", the test server records no Jev request for that player's
  questions, and Analytics Engine has no data point under their hash.
- **NOTICE-4, Must.** The choice is kept on the device and can be changed
  both ways in Settings at any time; the app never asks again after each
  question. Check: switching AI answers off in Settings stops the next
  question from reaching TypeSafe, and switching them back on lets the next
  one through.
- **NOTICE-5, Must.** When the server's notice changes version, the app
  shows the new notice before the next question can reach TypeSafe. Check:
  raising the version on the server brings the notice back.

[idea-jev]: /docs/IDEA.md#how-jev-fits

### Today's puzzle

- **TODAY-1, Must.** The app opens to today's puzzle: its number, the hint,
  the Guessling, the turns left out of twenty, and the question field.
  Check: a cold start shows all five.
- **TODAY-2, Must.** Today is the device's local calendar date, and a new
  puzzle starts at local midnight, as Wordle, Connections, and Strands do
  ([daily puzzle notes][daily-when]). Check: across 11:59 PM and 12:00 AM
  on the device, the puzzle number goes up by one.
- **TODAY-3, Must.** Daily puzzle #11 belongs to Thursday, September 24,
  2026, and each later date's number is one higher; #1 to #10 are the
  starter puzzles. Every player on the same date gets the same puzzle, and
  before September 24, every date gets #11, so App Review never meets a
  day without a puzzle. Check: two devices set to the same date show the
  same number and hint, and a device set to September 23 gets #11.
- **TODAY-4, Must.** A round's questions, answers, and turns survive closing
  and reopening the app. Check: force-quit mid-round and reopen.
- **TODAY-5, Must.** A round still open at local midnight can be finished,
  without Guessling+, for at least 24 hours after that midnight; the app
  offers it until it ends, then shows the new day's puzzle. Check: a free
  player's round left open at midnight accepts a turn 23 hours later, and
  the server refuses turns on it after 12:00 UTC two days after its date.

[daily-when]: /docs/research/daily-puzzles.md#when-a-new-puzzle-appears

### Asking a question

- **ASK-1, Must.** The player types a question in their own words, from 1
  to 140 characters, and sends it. Check: a 141st character can't be
  typed, and an empty question can't be sent.
- **ASK-2, Must.** Each yes-or-no question gets one of three answers, shown
  in words and by the Guessling: "Yes" with a nod, "No" with a head shake,
  or "Ask another way" with a shrug. A question that names an accepted name
  is a guess instead (GUESS-4). Check: each answer shows its word and its
  reaction.
- **ASK-3, Must.** A Yes or a No uses a turn; "Ask another way" doesn't.
  Check: the turn count drops only on Yes and No.
- **ASK-4, Must.** Text that isn't a yes-or-no question, such as "What
  color is it?", gets "Ask a yes-or-no question" with a shrug and doesn't
  use a turn. Check: that example leaves the turn count unchanged.
- **ASK-5, Must.** The same wording gets the same answer for every player
  of a puzzle, all through its puzzle day, even when two players send it at
  the same moment. Wordings match when they differ only in letter case,
  spacing, or final punctuation. Check: two devices send the same new
  wording at once and get the same answer.
- **ASK-6, Must.** A question that asks the same thing as a bank question,
  in other words, gets that bank question's checked answer, and a negated
  one gets the negation's answer. Check: CONTENT-6 passes.
- **ASK-7, Must.** Questions about the letters of the answer's name, such
  as "Does it start with B?" or "Does its name have five letters?", get
  correct answers worked out from the name, never from the AI. Check: a
  test list of letter questions against a known puzzle.
- **ASK-8, Must.** The question field, the Guess button, and the question
  list stay disabled while an answer is pending, and after a timeout the
  only way on is to send the same question again, so each turn is settled
  before the next. Check: none of the three can be used until the answer
  or an error shows, and after a timeout only "Send again" is offered.
- **ASK-9, Must.** With AI answers off, the app offers the category's bank
  questions as a searchable list. A picked question gets its checked
  answer. A typed question gets an answer only if it matches a bank
  question's wording or a wording already answered for the puzzle;
  otherwise the Guessling asks the player to pick from the list, and no
  turn is used. Check: with AI answers off, three picked questions get
  answers, a new wording brings up the list, and the server's logs show no
  call to Jev.
- **ASK-10, Must.** On one puzzle, a player gets at most 40 answers that don't
  use a turn, not counting prompts to pick from the list (ASK-9). After that,
  the app says the Guessling needs a rest and accepts only guesses. Check: the
  41st such input is refused, and a guess still works.
- **ASK-11, Must.** The round shows every question so far with its answer,
  oldest first, with the newest in view. Check: after five questions, all
  five show in order.
- **ASK-12, Must.** A question the bank doesn't cover gets a live answer:
  Yes when Jev's probability is above 0.7, No below 0.3, and "Ask another
  way" in between, the idea's thresholds. Check: recorded Jev answers of
  0.29, 0.5, and 0.71 give No, "Ask another way", and Yes.

### Guessing

- **GUESS-1, Must.** At any point in a round, the Guess button takes a name
  of 1 to 60 characters. Check: a 61st character can't be typed.
- **GUESS-2, Must.** The server decides a guess by comparing it with the
  puzzle's accepted names, ignoring letter case, spacing, punctuation, and a
  leading "a", "an", or "the"; the AI never decides a guess. Check: if the
  accepted names are "octopus" and "octopuses", "An Octopus!" is right and
  "squid" is wrong.
- **GUESS-3, Must.** Every guess uses a turn, as the final guess does in
  classic Twenty Questions ([daily puzzle notes][daily-rules]), and a right
  guess ends the round as solved. Check: a wrong guess drops the turn count
  by one.
- **GUESS-4, Must.** A question of the form "Is it a ...?", "Is it an
  ...?", or "Is it the ...?" that names an accepted name counts as a right
  guess. Check: "Is it an octopus?" solves the octopus puzzle.

[daily-rules]: /docs/research/daily-puzzles.md#rules-of-the-classic-game

### The end of a round

- **END-1, Must.** A round ends with a right guess, solved, or after the
  twentieth turn, not solved. Check: the twentieth wrong turn ends the
  round.
- **END-2, Must.** Only when a round ends does the server send the answer's
  name, and the app shows it with the Guessling's celebration if solved, the
  turns used, and a countdown to the next puzzle. Check: the answer never
  appears in the app's traffic before the round ends.
- **END-3, Must.** The end screen offers Share and "Play yesterday's?",
  which opens the paywall for a player without Guessling+ and yesterday's
  puzzle for a player with it. When no daily puzzle is dated before today,
  as on September 24, 2026, the button reads "Play another?" and opens the
  newest starter, #10. Check: both paths, with and without Guessling+, on
  the first daily date and on a later one.
- **END-4, Must.** A finished puzzle can't be played again, and opening the
  app shows its end screen until the next puzzle starts. Check: reopen after
  finishing.
- **END-5, Should.** The end screen shows the player's statistics: puzzles
  played, the share solved, the current streak, and the longest streak, the
  set NYT and LinkedIn show ([daily puzzle notes][daily-end]). Check: the
  counts after three rounds.

[daily-end]: /docs/research/daily-puzzles.md#end-of-round-screens

### Sharing a result

- **SHARE-1, Must.** Share opens the iOS share sheet with a text result: a
  first line with the puzzle number and the turns used out of 20, or "X" if
  not solved; the hint; one symbol per turn, ten to a row; and the App Store
  link. It follows the shape of Wordle's and Strands's shares
  ([daily puzzle notes][daily-share]). Check: a known round produces the
  format below.
- **SHARE-2, Must.** A shared result never includes a question or the
  answer. Check: the format below has neither.
- **SHARE-3, Must.** An archive result starts with a line saying "Archive"
  and the puzzle's date, or "Archive" alone for a starter, as NYT's archive
  shares do. Check: sharing an archive round.

The format, with 🟩 for Yes, 🟥 for No, ❌ for a wrong guess, and 🎯 for the
right one:

```text
Guessling #12 9/20
“An animal”
🟩🟥🟥🟩🟩🟥🟩🟩🎯
https://apps.apple.com/app/id<APP_ID>
```

[daily-share]: /docs/research/daily-puzzles.md#nyt-share-formats

### Streak

- **STREAK-1, Should.** The app counts the current streak, consecutive puzzle
  days whose daily puzzle the player solved on its date, and the longest
  streak; a loss or a day missed resets the current streak, and finishing a
  round after midnight (TODAY-5) breaks it, as a late finish does in Wordle.
  Check: solve two days, skip one, and the current streak is zero; a round
  finished after midnight also ends the streak.
- **STREAK-2, Should.** Archive rounds never change the streak. Check:
  solving an archive puzzle leaves both counts unchanged.

### The archive

- **ARCHIVE-1, Must.** The archive lists the starter puzzles and every
  daily puzzle dated before the device's date, newest first, each with its
  number, its date if it has one, its hint, and the player's result if
  played. Check: three days after the first daily date, the list shows #11
  to #13 and #1 to #10.
- **ARCHIVE-2, Must.** Without Guessling+, every archive puzzle shows as
  locked, and tapping one opens the paywall. Check: a free player sees
  locks.
- **ARCHIVE-3, Must.** With Guessling+, any archive puzzle opens and plays
  by the same rules as today's, with the answers its day's players got and
  any fixes made since. Check: an archive round matches a recorded day's
  answers.
- **ARCHIVE-4, Must.** The server serves an archive puzzle only after
  confirming the player's Guessling+ entitlement with RevenueCat. Check:
  on the test Worker, with the device's date set to the day after #13's,
  a player who never played #13 and has no entitlement is refused it.

### The paywall and purchases

- **PAY-1, Must.** One RevenueCat Paywall, configured remotely, offers
  Guessling+ yearly at $19.99 with a 3-day free trial, preselected, and
  monthly at $2.99. Check: the sandbox paywall shows both, yearly selected.
- **PAY-2, Must.** The paywall says what Guessling+ holds today, such as the
  number of archive puzzles, as guideline 3.1.2(c) asks; makes the billed
  amount its most prominent price; and shows the trial's length, the
  renewal price and period, and how to cancel, as the context's
  [paywall rules][ctx-money] say. Check: each listed item shows on the
  sandbox paywall.
- **PAY-3, Must.** The paywall has visible Close, Restore Purchases, Terms
  of Use, and Privacy Policy buttons, each added in RevenueCat's paywall
  editor, since current paywalls ignore the SDK's close-button flag
  ([RevenueCat notes][rc-buttons]). Check: all four work on a device.
- **PAY-4, Must.** The paywall appears only from "Play yesterday's?" and a
  locked archive puzzle, and closing it returns to where the player was.
  Check: no other screen opens it.
- **PAY-5, Must.** A purchase or a restore unlocks the archive at once, with
  no restart. Check: after a sandbox purchase, the archive opens.
- **PAY-6, Must.** Settings has Restore Purchases, which restores
  Guessling+ bought with the same Apple Account. Check: after launch, both
  after deleting and reinstalling the app and on a second device; in the
  sandbox, RevenueCat's anonymous IDs restore after a reinstall only once
  another purchase is made on that device.
- **PAY-7, Must.** Judges get a free month of Guessling+ through an Apple
  offer code: a custom code with a small redemption limit, for one month
  free with auto-renewal off, open to new, existing, and expired
  subscribers, sent as a redemption link. A judge whose Guessling+ doesn't
  unlock taps Restore Purchases. Check: once the app is live and the code
  is an hour old, since Apple says new codes can take that long to work,
  redeeming it on a real device unlocks the archive.
- **PAY-8, Should.** Settings has Redeem Code, which opens Apple's offer
  code sheet, and Manage Subscription, which opens the App Store's
  subscription settings. Check: both open.

[ctx-money]: /docs/CONTEXT.md#monetization-and-paywalls
[rc-buttons]: /docs/research/revenuecat-expo.md#close-restore-and-legal-buttons

### Reporting an answer

- **REPORT-1, Must.** Every answer in the round's history has "Report this
  answer", which sends the puzzle number, the question, the answer, and an
  optional reason, "Wrong" or "Unclear", to the server, with nothing that
  identifies the player. Check: a report reaches the server's report list.
- **REPORT-2, Must.** A report never changes an answer while anyone can
  still play the puzzle's day; the team reviews reports every day and fixes
  confirmed errors once the puzzle closes (CONTENT-8). Check: a reported
  wording keeps its answer until then.
- **REPORT-3, Must.** The app confirms each report, and each answer can be
  reported once per device. Check: the button turns into "Reported".

### Settings

- **SET-1, Must.** Settings has AI answers on or off, Restore Purchases, the
  privacy policy, the Terms of Use, a support link, the app's version, and the
  player's RevenueCat ID for support, which RevenueCat recommends showing. The
  two policy pages open in Safari, not in a browser inside the app. Check:
  each item works.
- **SET-2, Should.** Settings has switches for sound and haptics, both on
  by default. Sounds follow the silent switch and let other apps' music keep
  playing. Check: each switch silences its cue, and music keeps playing
  during a round.

### Offline and busy states

- **STATE-1, Must.** Without a network, the app says it's offline, keeps
  the round and the unsent question, and offers to send it again; an unsent
  question never uses a turn. Check: in airplane mode.
- **STATE-2, Must.** A question the app sends twice, as a retry, uses at
  most one turn and gets one answer. Check: replaying a request.
- **STATE-3, Must.** When the AI is busy or down, the server still answers
  bank wordings and wordings already answered for the puzzle; for anything
  else, the app says the Guessling is busy, offers the question list
  (ASK-9) and a retry, and uses no turn. Check: with Jev switched off on a
  test server.
- **STATE-4, Must.** When today's puzzle can't be loaded, the app says so
  and retries, and never shows an empty screen. Check: with the server
  unreachable.
- **STATE-5, Must.** When the server can't confirm Guessling+, the app says
  so and offers a retry, instead of showing a subscriber the paywall. Check:
  with RevenueCat's API unreachable from a test server.

## Puzzle content requirements

- **CONTENT-1, Must.** By submission on September 24, 2026, 17 checked
  puzzles are published: the ten starters, #1 to #10, and the daily
  puzzles for September 24 to 30, #11 to #17. Check:
  `wrangler kv key get --remote` finds `live:<n>` for all 17, since the API
  serves a daily puzzle only once its date is today somewhere.
- **CONTENT-2, Must.** Each later daily puzzle is published at least two
  days before its date, a margin over the day ahead the Cloudflare note
  advises, since a date is live somewhere for about 50 hours and a change
  to published data can take a minute or more to reach every location
  ([Cloudflare notes][cf-kv]). Check: the daily check (AVAIL-3)
  finds the next two dates published.
- **CONTENT-3, Must.** Every puzzle has a hidden thing that meets the
  product's [quality bar][product-puzzles], a hint that names its category,
  accepted names that include plurals, common variants, and common
  misspellings, a fact card of at most 40 facts, and a checked answer for
  every bank question and negation in its category. Check: the publishing
  script refuses a puzzle that lacks any of them.
- **CONTENT-4, Must.** Before a puzzle ships, Jev answers every bank
  question and its negation against the fact card, and a person fixes every
  answer between 0.3 and 0.7 and every question and negation whose answers
  contradict each other, both Yes or both No.
  Check: the puzzle's review file has no unresolved line.
- **CONTENT-5, Must.** The four launch categories are animals, foods,
  everyday objects, and places, each with a bank of about 100 questions,
  and never more than 127, so that the questions, their negations, and
  "none" fit the 255 options a Choice allows. Check: the publishing script
  refuses a bank over 127 questions.
- **CONTENT-6, Must.** Before submission, the consistency test passes for
  each category: at least 90% of a test set of at least 100 paraphrases, a
  quarter of them negated, reach the bank entry with the same meaning, and
  at most 5% of 50 questions outside the bank match any entry. Check: the
  saved results (METRIC-4).
- **CONTENT-7, Must.** Weapons, alcohol, tobacco, drugs, horror, and medical
  topics stay out of every hidden thing and hint, which keeps the age rating
  at a likely 4+ (STORE-4). Check: the schedule reviewed against the list.
- **CONTENT-8, Must.** A published daily puzzle changes only once it
  closes, at 12:00 UTC two days after its date, when its date has ended
  everywhere and every round begun on it has had the 24 hours TODAY-5
  allows; the change is checked again before it's republished, and every
  stored paraphrase of a corrected bank entry is forgotten with it. Check:
  the server refuses to forget answers earlier, `publish.ts` refuses to
  repoint an open puzzle, and after a fix, a stored paraphrase of the entry
  gets the new answer.
- **CONTENT-9, Should.** No category runs two days in a row. Check: the
  schedule of dates and categories.

[cf-kv]: /docs/research/cloudflare-workers.md#publishing-tomorrows-puzzle-ahead-of-time
[product-puzzles]: /docs/PRODUCT.md#puzzles

## Non-functional requirements

### Performance

- **PERF-1, Must.** On Wi-Fi or LTE in the United States, 95% of answers
  appear within 2 seconds of Send, and half within 1 second. Check: 50 new
  wordings on the release build, half of them matching the bank and half
  answered live, none of them repeats, timed in the app.
- **PERF-2, Must.** No question waits longer than 5 seconds for an answer,
  the busy state, or the offline state. Check: with Jev delayed on a test
  server.
- **PERF-3, Must.** Today's puzzle shows within 3 seconds of a cold start
  on a network. Check: timed on the oldest iPhone the team has that runs
  iOS 16.4 or later.

### Availability

- **AVAIL-1, Must.** The server, the archive, Jev's credits, and a new puzzle
  each day stay up through at least October 22, 2026, the later of the dates
  given for the winners, and for as long as any Guessling+ subscription runs,
  since the Paid Apps Agreement requires "the full amount of content" for the
  whole subscription ([Apple notes][apple-subs]). Check: the daily check
  passes every day.
- **AVAIL-2, Must.** Under load, players get stored answers or the busy
  state, never a broken screen, and the server stays within Jev's limit of
  1,200 requests per minute. Check: a load test on the test server at 30
  questions per second, half of them repeats.
- **AVAIL-3, Must.** Once a day, a check confirms that the next two dates'
  puzzles are published and that Jev answers a test question, and tells the
  team if not. Check: an unpublished date triggers the message.

[apple-subs]: /docs/research/apple-requirements.md#auto-renewable-subscription-rules

### Privacy

- **PRIV-1, Must.** No accounts, no sign-in, no third-party analytics or
  advertising SDK, and no tracking, so the app never shows the tracking
  permission prompt. Check: the app's dependency list.
- **PRIV-2, Must.** Only a question's wording and the puzzle's card and
  bank go to TypeSafe, never an ID, a device detail, or a network address.
  Check: the Jev requests the test server logs.
- **PRIV-3, Must.** The server never stores a question's text next to a
  player's ID, and keeps no network address past a request. Check: the
  stored fields and the log settings.
- **PRIV-4, Must.** The privacy policy, at a public URL, says what the app
  collects, how, and every use; names TypeSafe, or "a third-party AI service"
  if TypeSafe objects (NOTICE-2), RevenueCat, and Cloudflare, and confirms
  they protect data as the policy does; gives retention for each kind of data;
  and says how to withdraw AI consent in Settings and how a player without an
  account asks for deletion, as guideline 5.1.1(i) requires
  ([Apple notes][apple-policy]). Check: against 5.1.1(i).
- **PRIV-5, Must.** The App Privacy answers match the TRD's data inventory
  (STORE-5). Check: side by side.

[apple-policy]: /docs/research/apple-requirements.md#what-the-privacy-policy-must-say

### Security

- **SEC-1, Must.** Jev's key and RevenueCat's secret key exist only as
  server secrets; the app holds only RevenueCat's public iOS key and the
  server's address. Check: a search of the built app.
- **SEC-2, Must.** The answer's names and card never reach the app before
  the round ends (END-2). Check: the app's traffic during a round.
- **SEC-3, Must.** The server limits bursts of requests per player and caps
  all its calls to Jev per minute, and refuses text over its limits.
  Check: a burst over the limit gets a "slow down" error.
- **SEC-4, Must.** No error text from Jev's SDK reaches the app or the logs.
  Check: a request with a bad key on the test server.
- **SEC-5, Must.** A build that App Review or players can install never
  carries RevenueCat's Test Store key, which crashes release builds on
  purpose ([RevenueCat notes][rc-keys]). Check: the TestFlight build
  starts, which it wouldn't with that key.

[rc-keys]: /docs/research/revenuecat-expo.md#configuring-the-sdk-and-api-keys

### Accessibility

- **A11Y-1, Must.** VoiceOver reads each answer's word and announces it
  when it arrives, and every control, the paywall's included, has a label.
  Check: a round and a purchase with VoiceOver on.
- **A11Y-2, Must.** Text on the app's own screens follows Dynamic Type up
  to the largest accessibility size without cutting off questions,
  answers, or buttons; RevenueCat's paywall, which the team doesn't draw,
  is checked under A11Y-6. Check: a round at the largest size.
- **A11Y-3, Must.** With Reduce Motion on, each reaction becomes a fade or a
  still pose instead of disappearing. Check: a round with Reduce Motion on.
- **A11Y-4, Must.** Color is never the only signal: each answer shows its
  word. Check: a round in grayscale.
- **A11Y-5, Should.** Every screen, the paywall included, supports Dark
  Mode, with text contrast of at least 4.5 to 1. Check: a round in Dark
  Mode.
- **A11Y-6, Should.** Once the app is live, the team publishes
  Accessibility Nutrition Labels for each feature that passes every common
  task, the purchase included; they're voluntary for now
  ([Apple notes][apple-a11y]). Check: each claimed label's criteria.

[apple-a11y]: /docs/research/apple-requirements.md#what-each-label-claims

### Compatibility

- **COMPAT-1, Must.** iPhone only, with iPad support off, in portrait, on
  iOS 16.4 or later, the floor of Expo SDK 57. Check: the build settings.
- **COMPAT-2, Must.** Built with Xcode 26 or later and an iOS 26 SDK, which
  App Store uploads need since April 28, 2026. Check: the build log.
- **COMPAT-3, Must.** Every screen works on the smallest and the largest
  supported iPhone, and on an iPad, where an iPhone app still runs at phone
  resolution; the share sheet is tested there too. Check: three
  simulators.
- **COMPAT-4, Must.** The app isn't offered on Apple silicon Macs or Apple
  Vision Pro. Check: App Store Connect's availability settings.

## Analytics requirements

- **METRIC-1, Must.** For players who allowed AI answers, the server counts,
  per puzzle and day: players who opened it, questions by answer and by
  source, guesses, rounds solved and not solved, reports, and busy answers
  (NOTICE-3). Check: the counts after a test round.
- **METRIC-2, Must.** The counts give distinct players per day and the
  return rate without storing any question text with a player's ID. Check:
  the stored fields.
- **METRIC-3, Must.** Paywall views, trial starts, and conversions come
  from RevenueCat's Paywall Conversion chart, and revenue from its charts,
  with no analytics SDK in the app; TestFlight counts as sandbox, so only
  the live app's numbers appear ([RevenueCat notes][rc-report]). Check:
  the chart after the first production views.
- **METRIC-4, Must.** Each consistency test run is saved with its date, the
  model, the bank version, and its results. Check: the file after a run.
- **METRIC-5, Must.** One script prints the server's numbers for the idea's
  launch plan: players, puzzles solved, questions asked, and the latest
  consistency results. Check: it runs on September 29.

[rc-report]: /docs/research/revenuecat-expo.md#paywall-reporting

## App Store listing and review

The context's [review essentials][ctx-apple] and store listing guidance
apply; these are Guessling's own.

- **STORE-1, Must.** The listing uses the name "Guessling: Daily 20
  Questions" and the subtitle "Ask anything. Guess the thing.", in the Games
  category. Its description's first sentence says what the game is, without
  prices, and its keywords don't repeat the name. Check: App Store Connect.
- **STORE-2, Must.** The screenshots are final before submission: the
  6.9-inch iPhone set for the listing and one 1179 × 2556 screenshot for
  Devpost; the app's iPhone-only build most plausibly needs no iPad set,
  since Apple doesn't define "runs on iPad". Check: App Store Connect
  accepts them.
- **STORE-3, Must.** The privacy policy URL, the Terms of Use, which rely on
  Apple's standard license agreement and set no minimum age, and a support
  URL with contact details are in the metadata and live on the server.
  Check: each link opens.
- **STORE-4, Must.** The age rating questionnaire is answered honestly: in-app
  controls none, unrestricted web access no, user-generated content no, social
  media, messaging, and advertising no, contests none, and every content
  descriptor none, which likely yields 4+
  ([Apple notes on ratings][apple-rating]). The app stays out of the Kids
  category. Check: the rating App Store Connect calculates.
- **STORE-5, Must.** The App Privacy answers declare Other User Content and
  Gameplay Content, Customer Support, User ID, Purchase History, and
  Product Interaction, none used for tracking, as the TRD's data inventory
  classifies them ([Apple notes on privacy][apple-privacy]). Check: against
  the inventory.
- **STORE-6, Must.** The two subscriptions, their group, the yearly plan's
  free trial, and their review screenshots go in the same submission as
  version 1.0, which releases automatically once approved. Check: the
  submission page.
- **STORE-7, Must.** The review notes say how to play, that answers come
  from the team's server so the device needs a network, how to test both
  notice choices, what "Report this answer" does, how to reach the archive
  and buy Guessling+ in the sandbox, and today's answers for the review
  days, within the 4,000 bytes the field allows. Check: a teammate follows
  them on a clean install.
- **STORE-8, Must.** The app is offered in the United States and other
  storefronts, except China mainland and Vietnam, which need game licenses;
  Brazil once its tax form is in; and the EU's 27 once the team completes
  trader verification, which publishes its contact details on EU product
  pages ([Apple notes on storefronts][apple-eu]). The team starts that
  verification on September 22, because judges in the EU couldn't
  download the app without it, and the rules require access "without any
  restriction". The subscriptions use the same storefronts. Check: the
  availability settings.

[ctx-apple]: /docs/CONTEXT.md#apple-app-store-review-essentials
[apple-rating]: /docs/research/apple-requirements.md#questionnaire-answers-for-guessling
[apple-privacy]: /docs/research/apple-requirements.md#guesslings-data-classified
[apple-eu]: /docs/research/apple-requirements.md#eu-trader-status-and-storefronts

## Release criteria

Before submitting to App Review on September 24, 2026:

- **RELEASE-1, Must.** Before submission, every other Must requirement's
  check passes on the environment it names: checks that name the test
  server run there; checks tied to the calendar run on a TestFlight build
  pointed at the test Worker, whose first daily date is earlier; and the
  rest run on a TestFlight build against the production server with
  sandbox purchases. The checks of AVAIL-1, METRIC-3, METRIC-5, PAY-6's
  production restore, and PAY-7 need the live app and run under
  RELEASE-5. Check: the checklist, signed off, each line with its
  environment.
- **RELEASE-2, Must.** A sandbox purchase, restore, and trial work end to
  end, and a sandbox offer code redeems. Check: on a device with a sandbox
  account, restoring without reinstalling first, since RevenueCat's
  anonymous IDs can't restore after a reinstall in the sandbox until
  another purchase.
- **RELEASE-3, Must.** The consistency test passes (CONTENT-6), and the 17
  puzzles are published (CONTENT-1). Check: the saved results and the
  server.
- **RELEASE-4, Must.** Jev's credits are funded with auto-refill on, the
  In-App Purchase Key is uploaded to RevenueCat, and RevenueCat's sandbox
  access stays open to anybody, because App Review reportedly buys in the
  sandbox. Check: each setting.

After approval, and before the Devpost deadline on September 30, 2026:

- **RELEASE-5, Must.** The app is live in the United States, a production
  purchase goes through, and the checks RELEASE-1 leaves for after release
  pass, the judges' offer code (PAY-7) among them. Check: on a real device,
  with a real Apple Account.
- **RELEASE-6, Must.** The brief's [submission checklist][brief-checklist]
  is complete. Check: Devpost shows the entry as submitted.

[brief-checklist]: /docs/BRIEF.md#submission-checklist

## Dependencies and assumptions

What version 1.0 depends on, each owned by the team:

- **TypeSafe:** a Jev API key and funded credits, and answers on naming
  TypeSafe in the notice and on players under 18, as the idea's
  [open questions][idea-open] say.
- **Apple:** the Developer Program membership, the Paid Apps Agreement, tax
  and banking, the In-App Purchase Key, and verified trader status for the
  EU storefronts (STORE-8).
- **RevenueCat:** a project on the Pro plan, free below $2,500 of monthly
  tracked revenue.
- **Cloudflare:** Workers Paid at $5 a month and a domain for the server's
  address, which ships inside the app.
- **Expo:** an account for EAS builds and submission.

The idea's [assumptions][idea-open] hold, and this document adds one: the
team can publish a checked puzzle every day for as long as Guessling+ is
sold (AVAIL-1).

## Open questions

The idea's [open questions][idea-open] still apply. New ones, each with a
safe default:

- **Age laws in US states.** New Apple Accounts in Texas are subject to its
  age-assurance law, and for new accounts in Utah and Louisiana, Apple
  shares age categories with apps that ask through its Declared Age Range
  API. What these laws require of developers is a question for counsel, and
  no source covers calling the API from Expo
  ([Apple notes][apple-age-laws]). Safe default: ask counsel before launch;
  if an age check is required, players in an under-18 range get the
  question list only, so nothing reaches TypeSafe.
- **The paywall's policy buttons.** No source says whether RevenueCat's
  Privacy Policy and Terms buttons open a browser inside the app, which
  could change the web-access answer in STORE-4. Safe default: check on the
  TestFlight build, and answer the questionnaire from what it does.
- **A judge who cancelled mid-trial.** Apple's offer code eligibility
  doesn't clearly cover a subscriber who cancelled a trial that hasn't
  ended. Safe default: tell judges to redeem the code before starting a
  trial.
- **The export report.** HTTPS through the system is exempt from export
  documentation, but a year-end self-classification report may still
  apply. Safe default: ask counsel.
- **A year of daily puzzles.** Selling a yearly plan commits the team to a
  new puzzle every day until the last subscription ends. Safe default: keep
  a buffer of at least a week of checked puzzles from October 2026 on.

[apple-age-laws]: /docs/research/apple-requirements.md#age-assurance-laws-in-us-states

## See also

- [Product](/docs/PRODUCT.md): what Guessling is, for whom, and why.
- [Technical requirements](/docs/TRD.md): how version 1.0 is built, with
  every requirement here traced.
- [Idea](/docs/IDEA.md): the schedule, the risks, and the pitch.
- [RevenueCat notes](/docs/research/revenuecat-expo.md),
  [Cloudflare notes](/docs/research/cloudflare-workers.md),
  [Apple notes](/docs/research/apple-requirements.md), and
  [daily puzzle notes](/docs/research/daily-puzzles.md): the sources behind
  the requirements.

[idea-open]: /docs/IDEA.md#assumptions-and-open-questions

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
    Players that day keep getting the same answer, and after the day ends,
    archive players get the corrected one.
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
  chooses, and the notice matches the server's text.
- **NOTICE-2, Must.** The notice names TypeSafe, unless TypeSafe objects, in
  which case the server's text says "a third-party AI service"; the idea's
  [Jev section][idea-jev] explains why. Check: changing the server's text
  changes the notice with no app update.
- **NOTICE-3, Must.** With "Not now", nothing the player types reaches
  TypeSafe, the server stores none of their wordings and counts none of
  their plays, and the player still plays everything, Guessling+ included,
  through the question list (ASK-9). Check: with "Not now", the server's
  logs show no Jev call and no count for that player.
- **NOTICE-4, Must.** The choice is kept on the device and can be changed
  both ways in Settings at any time; the app never asks again after each
  question. Check: switching AI answers off in Settings stops the next
  question from reaching TypeSafe.
- **NOTICE-5, Must.** When the server's notice changes version, the app
  shows the new notice before the next question can reach TypeSafe. Check:
  raising the version on the server brings the notice back.

[idea-jev]: /docs/IDEA.md#how-jev-fits

### Today's puzzle

- **TODAY-1, Must.** The app opens to today's puzzle: its number, the hint,
  the Guessling, the turns left out of twenty, and the question field.
  Check: a cold start shows all five.
- **TODAY-2, Must.** Today is the device's local calendar date, and a new
  puzzle starts at local midnight, as NYT's daily games do
  ([daily puzzle notes][daily-when]). Check: across 11:59 PM and 12:00 AM
  on the device, the puzzle number goes up by one.
- **TODAY-3, Must.** Daily puzzle #11 belongs to Thursday, September 24,
  2026, and each later date's number is one higher; #1 to #10 are the
  starter puzzles. Every player on the same date gets the same puzzle.
  Check: two devices set to the same date show the same number and hint.
- **TODAY-4, Must.** A round's questions, answers, and turns survive closing
  and reopening the app. Check: force-quit mid-round and reopen.
- **TODAY-5, Must.** A round still open at local midnight can be finished,
  without Guessling+, for at least 24 hours after that midnight; the app
  offers it until it ends, then shows the new day's puzzle. Check: scenario 10.

[daily-when]: /docs/research/daily-puzzles.md#when-a-new-puzzle-appears

### Asking a question

- **ASK-1, Must.** The player types a question in their own words, from 1
  to 140 characters, and sends it. Check: a 141st character can't be
  typed, and an empty question can't be sent.
- **ASK-2, Must.** Each question gets one answer, shown in words and by the
  Guessling: "Yes" with a nod, "No" with a head shake, or "Ask another way"
  with a shrug. Check: each answer shows its word and its reaction.
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
- **ASK-8, Must.** The question field stays disabled while an answer is
  pending, so each answer arrives before the next question. Check: the
  field can't be used until the answer or an error shows.
- **ASK-9, Must.** With AI answers off, the app offers the category's bank
  questions as a searchable list. A picked question gets its checked
  answer. A typed question gets an answer only if it matches a bank
  question's wording or a wording already answered for the puzzle;
  otherwise the Guessling asks the player to pick from the list, and no
  turn is used. Check: with AI answers off, three picked questions get
  answers, a new wording brings up the list, and the server's logs show no
  call to Jev.
- **ASK-10, Must.** On one puzzle, a player gets at most 40 answers that
  don't use a turn. After that, the app says the Guessling needs a rest and
  accepts only guesses. Check: the 41st such input is refused, and a guess
  still works.
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
  puzzle for a player with it. Check: both paths, with and without
  Guessling+.
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

- **STREAK-1, Should.** The app counts the current streak, consecutive
  puzzle days whose daily puzzle the player solved on its date, and the
  longest streak; a loss or a day missed resets the current streak, and a
  round finished after midnight (TODAY-5) doesn't extend it, as in Wordle.
  Check: solve two days, skip one, and the current streak is zero.
- **STREAK-2, Should.** Archive rounds never change the streak. Check:
  solving an archive puzzle leaves both counts unchanged.

### The archive

- **ARCHIVE-1, Must.** The archive lists the starter puzzles and every
  daily puzzle dated before the device's date, newest first, each with its
  number, its date if it has one, its hint, and the player's result if
  played. Check: on September 27, the list shows #11 to #13 and #1 to #10.
- **ARCHIVE-2, Must.** Without Guessling+, every archive puzzle shows as
  locked, and tapping one opens the paywall. Check: a free player sees
  locks.
- **ARCHIVE-3, Must.** With Guessling+, any archive puzzle opens and plays
  by the same rules as today's, with the answers its day's players got and
  any fixes made since. Check: an archive round matches a recorded day's
  answers.
- **ARCHIVE-4, Must.** The server serves an archive puzzle only after
  confirming the player's Guessling+ entitlement with RevenueCat. Check: a
  request without the entitlement is refused.

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

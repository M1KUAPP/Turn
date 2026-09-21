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

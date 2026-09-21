# Guessling product

Guessling is a daily 20-questions game for iPhone: everyone gets the same
hidden thing each day and finds it by typing yes-or-no questions in their
own words. This document says what the product is, who it's for, the
principles behind its decisions, and where it goes after version 1.0. The
[idea](/docs/IDEA.md) records why the team chose it for Shipaton 2026, the
[product requirements](/docs/PRD.md) say what version 1.0 must do, and the
[technical requirements](/docs/TRD.md) say how it's built. Facts are as of
September 22, 2026.

Contents:

1.  [Guessling in brief](#guessling-in-brief)
1.  [Vision](#vision)
1.  [Players](#players)
1.  [See also](#see-also)

## Guessling in brief

- **What:** a daily deduction puzzle. Each day has one hidden thing, such as
  an animal, a food, an everyday object, or a place, and a short hint such
  as "An animal". Players have twenty turns to find it, asking yes-or-no
  questions in their own words, and the Guessling, the character who knows
  the answer, nods, shakes its head, or shrugs.
- **For whom:** people who play the day's word puzzles and want more than a
  few minutes of them; see [Players](#players).
- **How it earns:** today's puzzle is free. Guessling+ opens the archive of
  past puzzles for $19.99 a year with a 3-day free trial, or $2.99 a month.
- **Where:** the App Store, on iPhone, in English.
- **Who answers:** Jev, TypeSafe's hosted decision model, matches each
  question to answers a person has checked and answers the rest live,
  through the team's server; see [how Jev fits][idea-jev].
- **Status:** version 1.0 goes to App Review on Thursday, September 24,
  2026, on the [idea's schedule][idea-schedule].

[idea-jev]: /docs/IDEA.md#how-jev-fits
[idea-schedule]: /docs/IDEA.md#schedule-to-september-30

## Vision

Guessling wants to be the daily puzzle people play for the questions they
get to ask: one shared mystery a day, answered the same way for everyone, in
words nobody had to predict.

That aim sets three tests for every decision:

- **The fun is in the asking.** Typing a question should feel like asking
  someone who knows the answer, and the answer should come before the next
  question is typed.
- **The fairness is in the sameness.** Every player's round is comparable,
  so a shared result means the same thing for everyone.
- **The habit is in the rhythm.** Today's puzzle is short enough to finish
  today and good enough to come back for tomorrow.

## Players

These profiles are synthesis from the idea's
[evidence on the problem and audience][idea-problem]; nobody has been
interviewed yet.

- **The daily puzzler** plays the day's word puzzles and shares results with
  friends. They want a new puzzle that takes a few minutes, feels fair, and
  gives them something to compare. Guessling gives them a different kind of
  daily puzzle, deduction by question instead of by letters, with a result
  that fits the same chats. NYT Games alone has 293,384 US ratings.
- **The 20-questions fan** knows the game, or knows Akinator, where the app
  asks the questions. They want to be the one asking, and answers that don't
  contradict each other; reviews of the apps that let players ask punish
  hedged answers: "It either is nomadic or it isn't." Guessling gives them
  their own words and answers a person has checked.
- **The friend who got a result** sees a spoiler-free result in a chat and
  taps its link. They want to try today's puzzle at once. Guessling gives
  them today's puzzle free, with no account.

Guessling isn't built for children, since TypeSafe says no part of its
services "is directed to children"
([Jev notes on store review][jev-store]), nor for players who want endless
or competitive play, which version 1.0 leaves out.

[idea-problem]: /docs/IDEA.md#problem-and-audience
[jev-store]: /docs/research/jev.md#store-review-and-jev

## See also

- [Idea](/docs/IDEA.md): why Guessling was chosen for Shipaton 2026, its
  categories, schedule, risks, and pitch.
- [Product requirements](/docs/PRD.md): what version 1.0 must do, as
  numbered requirements with checks.
- [Technical requirements](/docs/TRD.md): how version 1.0 is built.
- [Evidence notes](/docs/research/idea-evidence.md): rivals, reviews, and
  demand behind the idea.
- [Daily puzzle notes](/docs/research/daily-puzzles.md): how other daily
  games handle the day, sharing, streaks, and archives.
- [Jev notes](/docs/research/jev.md): what Jev is, its API, prices, limits,
  and terms.

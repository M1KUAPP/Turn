# Guessling product

> **Superseded on September 22, 2026.** This document describes Guessling,
> the team's first idea. [Turn](/docs/IDEA.md), an entry for the Next Gen
> Award, replaced it, and this document's links to the idea point at the
> [archived Guessling idea](/docs/archive/guessling-idea.md).

Guessling is a daily 20-questions game for iPhone: everyone gets the same
hidden thing each day and finds it by typing yes-or-no questions in their
own words. This document says what the product is, who it's for, the
principles behind its decisions, and where it goes after version 1.0. The
[idea](/docs/archive/guessling-idea.md) records why the team chose it for
Shipaton 2026, the [product requirements](/docs/PRD.md) say what version 1.0
must do, and the [technical requirements](/docs/TRD.md) say how it's built.
Facts are as of September 22, 2026.

Contents:

1.  [Guessling in brief](#guessling-in-brief)
1.  [Vision](#vision)
1.  [Players](#players)
1.  [Positioning](#positioning)
1.  [Product principles](#product-principles)
1.  [The experience](#the-experience)
1.  [The Guessling character](#the-guessling-character)
1.  [Puzzles](#puzzles)
1.  [Business model](#business-model)
1.  [Success metrics](#success-metrics)
1.  [Roadmap](#roadmap)
1.  [What Guessling is not](#what-guessling-is-not)
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

[idea-jev]: /docs/archive/guessling-idea.md#how-jev-fits
[idea-schedule]: /docs/archive/guessling-idea.md#schedule-to-september-30

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
  that fits the same chats.
- **The 20-questions fan** knows the game, or knows Akinator, where the app
  asks the questions. They want to be the one asking, and answers that don't
  contradict each other; reviews of one app that lets players ask punish
  hedged answers: "It either is nomadic or it isn't." Guessling gives them
  their own words and answers a person has checked.
- **The friend who got a result** sees a spoiler-free result in a chat and
  taps its link. They want to try today's puzzle at once. Guessling gives
  them today's puzzle free, with no account.

Guessling isn't built for children, since TypeSafe says no part of its
services "is directed to children"
([Jev notes on store review][jev-store]), nor for players who want endless
or competitive play, which version 1.0 leaves out.

[jev-store]: /docs/research/jev.md#store-review-and-jev

## Positioning

For people who play the day's word puzzles and want more than a few minutes
of them, Guessling is the daily 20-questions game in which they ask the
questions, in their own words, and every player gets the same answers.

The alternatives players already have, and how Guessling differs from
each; the idea's [problem and audience][idea-problem] section and the
[evidence notes][ev-hunch] have the ratings, prices, and quotes:

- **NYT Games and Apple News+** sell daily puzzles in bundles, archives
  included. Guessling is one deduction puzzle a day, priced like a single
  game.
- **Akinator** asks the player the questions. In Guessling, the player asks.
- **Apps that let the player question an AI** mention no daily or shared
  puzzle in their descriptions. One answers on the device at no cost per
  question, which weakens the case for Jev and for Guessling's monthly
  price.
- **Das Verhör**, in the 2026 gallery, is a daily case in German, questioned
  in free text and built to be "provably fair". Guessling is in English,
  with yes-or-no questions about one hidden thing.

The difference is narrow: a shared daily puzzle, in English, questioned in
the player's own words, with answers a person has checked in advance.
Consistent answers are something Guessling must measure and show, not
something its rivals are known to lack.

[ev-hunch]: /docs/research/idea-evidence.md#hunch-a-daily-20-questions-game

## Product principles

Each principle settles trade-offs, and the PRD turns its consequence into
requirements.

- **Same puzzle, same answers.** Everyone gets the same hidden thing on the
  same date, and the same question gets the same answer all day. So answers
  are checked before a puzzle ships, every answer is kept for the day, and a
  wrong one is fixed only after every round of that day has closed.
- **Today is always free.** Guessling+ sells more puzzles, never today's. So
  nothing stands between a player and today's round: no account, no paywall,
  no ad.
- **Never spoil it.** The answer stays on the server until the round ends,
  and a shared result shows the pattern of answers, never the questions or
  the answer.
- **Ask it your way.** Players type questions as they'd ask a friend. So
  "Ask another way" is the Guessling's rare exception, not its habit, and a
  list of questions to pick from appears only for players who turn AI
  answers off or when the AI is busy.
- **Honest about doubt.** When the Guessling can't settle a question, it
  says "Ask another way" instead of guessing, and that turn doesn't count.
  Every answer can be reported.
- **Done in minutes.** One puzzle a day and twenty turns, with no timers,
  lives, energy, or ads.
- **Private by default.** No accounts and no tracking. Typed questions reach
  TypeSafe only with the player's permission, and never with anything that
  identifies the player.

## The experience

The daily loop, as a player lives it; the PRD's
[functional requirements][prd-functional] set every step's rules:

1.  **Open** today's puzzle: the Guessling, the hint, and twenty turns.
1.  **Choose, the first time only,** after a short notice that says who
    answers the questions.
1.  **Ask.** The Guessling nods, shakes its head, or shrugs before the next
    question can be typed.
1.  **Guess.** A right guess ends the round with a celebration and the
    reveal; after twenty turns, the reveal comes anyway.
1.  **Share** a spoiler-free result, and come back tomorrow.
1.  **Want more?** Yesterday's puzzle, and every one before it, are a tap
    away with Guessling+.

The moments that carry the product:

- **The first answer**, the "aha": a question typed in the player's own
  words, answered at once.
- **The reveal**: the same answer for everyone, shown the moment the round
  ends.
- **The share**: a result that invites a friend without spoiling anything.
- **The paywall moment**: "Play yesterday's?", offered when a player wants
  more: after today's round, or on a locked archive puzzle. Today's round
  never waits behind it.

[prd-functional]: /docs/PRD.md#functional-requirements

## The Guessling character

- **Role:** the Guessling knows the day's answer and answers with its whole
  body: a nod for Yes, a head shake for No, a shrug for "Ask another way",
  and a celebration when the player finds it. These four reactions are the
  game's art direction.
- **Personality:** curious and good-natured. It enjoys being asked, and it
  never mocks a wrong guess.
- **Voice:** a yes-or-no question always gets one of three fixed phrases,
  "Yes", "No", or "Ask another way", and the few other replies, such as "Ask
  a yes-or-no question", are fixed too, so nobody has to read a joke to learn
  the answer. The humor lives in the character and in the words around the
  answers, such as the hint and the reveal, and those words stay short and
  plain.
- **Art direction:** one simple, expressive character with a silhouette that
  reads at small sizes. Motion carries the meaning, and every reaction also
  shows its word, so a round works with the sound off and with Reduce
  Motion. AI-assisted art is fine, credited openly, as the idea's
  [safe default][idea-open] says.
- **Sound and haptics:** a short, distinct cue for each answer, which the
  player can turn off; they're a Should for version 1.0.

[idea-open]: /docs/archive/guessling-idea.md#assumptions-and-open-questions

## Puzzles

- **What a puzzle is made of:** the hidden thing; a hint that names its
  category, such as "An animal"; its accepted names, including plurals and
  common variants; a fact card, the short list of facts Jev reads; and the
  category's bank of common questions, each with an answer a person has
  checked for this puzzle.
- **Launch categories:** animals, foods, everyday objects, and places, each
  with a bank of about 100 questions.
- **A good hidden thing** is known by name to most English-speaking adults,
  has settled facts rather than matters of opinion, and has one clear name.
  It isn't a person or a brand. Weapons, alcohol, tobacco, drugs, horror,
  and medical topics stay out of puzzles and hints, which keeps the age
  rating at a likely 4+; a single "knife" or "beer" puzzle would raise it
  ([Apple notes on the questionnaire][apple-rating]).
- **Rhythm:** a new puzzle every day, and the category changes from one day
  to the next.
- **Starters:** ten puzzles fill the archive on launch day, so Guessling+
  holds something from the start.
- **Corrections:** a reported answer is fixed only after every round of the
  puzzle's day has closed, so everyone who played that day got the same
  answers; archive players get the fix. NYT learned this the hard way: in May
  2022 it swapped a Wordle answer mid-rollout and left some players on the old
  word ([daily puzzle notes][daily-fair]).

[apple-rating]: /docs/research/apple-requirements.md#questionnaire-answers-for-guessling
[daily-fair]: /docs/research/daily-puzzles.md#fairness-and-corrections

## Business model

| What                      | Free | Guessling+ |
| ------------------------- | ---- | ---------- |
| Today's puzzle, every day | Yes  | Yes        |
| Every past daily puzzle   | No   | Yes        |
| The ten starter puzzles   | No   | Yes        |

- **Prices:** $19.99 a year with a 3-day free trial, the default, or $2.99 a
  month. The idea's [monetization][idea-money] section has the reasoning and
  the benchmarks.
- **What it never sells:** an advantage in today's puzzle, ads, or players'
  data.
- **When it asks:** after today's result, as "Play yesterday's?", and on any
  locked archive puzzle. The paywall can always be closed.
- **Judges:** a free month of Guessling+ through Apple's offer codes,
  created once the app is live, covers judging to October 13; the PRD's
  [purchase requirements][prd-pay] say how.
- **Where the money is counted:** every sale goes through RevenueCat, whose
  numbers the Grand Prize shortlist uses.
- **What a subscription promises:** the Paid Apps Agreement requires "the full
  amount of content" for the whole subscription, so the archive, the server,
  and a new puzzle every day run for as long as any Guessling+ subscription
  does, not only through October 22. Stopping means removing Guessling+ from
  sale at least 31 days ahead and keeping the archive open until the last
  subscription ends ([Apple notes on subscriptions][apple-subs]).

[idea-money]: /docs/archive/guessling-idea.md#monetization
[prd-pay]: /docs/PRD.md#the-paywall-and-purchases
[apple-subs]: /docs/research/apple-requirements.md#auto-renewable-subscription-rules

## Success metrics

The **north star** is daily finishers: players who finish the day's puzzle,
with a right guess or twenty turns, on its date, counted among players who
allowed AI answers. It measures the habit the product exists for, and it
grows only if rounds are fair and fun.

The targets below are decisions this document sets, except where a source
is named; the rest are watched and reported as rates, as the idea's
[launch plan][idea-launch] says.

- **Engagement**, counted on the server, which counts only players who
  allowed AI answers (NOTICE-3 in the PRD):
  - Players: distinct players who open the day's puzzle.
  - Finish rate: finishers divided by players who asked at least one
    question.
  - Solve rate: right guesses divided by finishers.
  - Return rate: players of one day's puzzle who open the next day's.
- **Quality guardrails:**
  - Consistency: at least 90% of a test set of paraphrases, negated
    wordings included, reach the bank entry with the same meaning; the
    idea's [risk trigger][idea-risks] sets this bar.
  - "Ask another way": at most one answer in ten, since each one is a small
    break in the promise to "ask anything".
  - Speed: on Wi-Fi or LTE in the United States, the answer arrives within
    two seconds for 95% of questions; see the PRD's
    [performance requirements][prd-perf].
  - Reports: every reported answer is triaged within a day.
- **Business**, from RevenueCat's charts, which count production purchases
  only: paywall views, trial starts, and conversions from the Paywall
  Conversion chart, and revenue. The context's [benchmarks][ctx-money] give
  a reference: a median 25.5% of trials of 4 days or less become paid.

[idea-launch]: /docs/archive/guessling-idea.md#launch-and-pitch
[idea-risks]: /docs/archive/guessling-idea.md#risks
[prd-perf]: /docs/PRD.md#performance
[ctx-money]: /docs/CONTEXT.md#monetization-and-paywalls

## Roadmap

- **Version 1.0, in App Review on September 24, 2026:** the PRD's Must
  requirements.
- **Updates after launch:** the PRD's Should requirements, such as the
  streak, haptics, and sound, and fixes from reported answers. A new puzzle
  arrives every day with no app update, for as long as Guessling+ is sold.
- **Later, if players stay:** candidates, each with the signal that would
  justify it.
  - Android, from the same Expo code, if players reach Guessling from
    Android phones and ask for it.
  - Accounts and sync, if players ask to keep their streak across devices.
    Accounts bring in-app account deletion with them; see the context's
    [review essentials][ctx-apple].
  - Reminders, if the return rate falls, with explicit opt-in as Apple's
    rules on push require; see [retention][ctx-push].
  - More categories and themed weeks, if solve rates stay healthy.
  - An iPad layout, if iPad players ask; the iPhone layout already runs
    there.
  - Other languages, once Jev's accuracy outside English is known; English
    is "where accuracy is currently best" ([Jev notes][jev-lang]).
  - Leaderboards and friends, only in a form that can't spoil a puzzle.

[ctx-apple]: /docs/CONTEXT.md#apple-app-store-review-essentials
[ctx-push]: /docs/CONTEXT.md#retention-and-push-notifications
[jev-lang]: /docs/research/jev.md#jev-platform-and-language-support

## What Guessling is not

- **Not a chatbot.** The Guessling never writes text: Jev returns
  probabilities, and every reply is a fixed phrase.
- **Not a race.** No timers, and no scores against other players.
- **Not ad-supported, and not a data business.**
- **Not for children.** It stays out of the Kids category.
- **Not a social network.** No profiles, feeds, or player content shown to
  other players.

## See also

- [Guessling idea](/docs/archive/guessling-idea.md): why Guessling was chosen
  for Shipaton 2026, its categories, schedule, risks, and pitch.
- [Product requirements](/docs/PRD.md): what version 1.0 must do, as
  numbered requirements with checks.
- [Technical requirements](/docs/TRD.md): how version 1.0 is built.
- [Design](/docs/DESIGN.md): how Guessling looks, moves, and sounds, as
  tokens and rules a coding agent can follow.
- [Evidence notes](/docs/research/idea-evidence.md): rivals, reviews, and
  demand behind the idea.
- [Daily puzzle notes](/docs/research/daily-puzzles.md): how other daily
  games handle the day, sharing, streaks, and archives.
- [Jev notes](/docs/research/jev.md): what Jev is, its API, prices, limits,
  and terms.

[idea-problem]: /docs/archive/guessling-idea.md#problem-and-audience

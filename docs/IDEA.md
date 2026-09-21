# Shipaton 2026 idea

Guessling is the app this team will ship for RevenueCat Shipaton 2026: a
daily 20-questions game in which Jev answers any yes-or-no question a player
types, the same way for every player. Ten rounds of ideation chose it, and
the [ideation log](/docs/research/ideation.md) records each one. The
[brief](/docs/BRIEF.md) and the [context](/docs/CONTEXT.md) hold the
contest's rules and background, so this document links to them, with facts
as of September 22, 2026.

Contents:

1.  [At a glance](#at-a-glance)
1.  [Problem and audience](#problem-and-audience)
1.  [What the app does](#what-the-app-does)
1.  [See also](#see-also)

## At a glance

- **Name:** "Guessling: Daily 20 Questions" on the App Store, 29 characters,
  with the subtitle "Ask anything. Guess the thing."
- **Logline:** "For people who finish the day's word puzzles in minutes,
  Guessling helps them uncover a hidden thing each day by answering any
  yes-or-no question they type, the same way for every player, so they get a
  fair new deduction puzzle every day."
- **Store:** the App Store, on iPhone. A new Google Play account or the
  Galaxy Store can't be live in time; see
  [getting through store review][ctx-review].
- **Price:** today's puzzle is free. Guessling+ opens the archive of past
  puzzles for $19.99 a year with a 3-day free trial, or $2.99 a month.
- **Categories:** Best Game first and HAMM second. The Grand Prize considers
  every eligible entry.
- **Jev's job:** Jev checks every puzzle's answers before it ships, matches
  each typed question to a checked answer, and answers the rest live.
- **Dates:** in App Store review by Thursday, September 24; live by Sunday,
  September 27; submitted on Devpost by Wednesday, September 30 at 11:45 PM
  PT; free for judges until judging ends on October 13.

[ctx-review]: /docs/CONTEXT.md#getting-through-store-review

## Problem and audience

- **Who:** adults who play the day's word puzzles and want more than a few
  minutes of them. The habit is proven: NYT Games has 293,384 US ratings, and
  The New York Times Company says its Games team brings "millions of people
  back to play every day". So is the genre: Akinator, which guesses what the
  player is thinking, has 422,100.
- **The gap:** in Akinator, the app asks the questions. The four apps found
  that let the player question an AI have 3 to 19 ratings each, and their
  reviews punish answers that contradict themselves or hedge: "It either is
  nomadic or it isn't." None of them, and no 2026 gallery entry, pairs a
  shared daily puzzle with questions in the player's own words.
- **The field:** Best Game draws on 148 games in the gallery, but only 11
  projects name the category, and word and trivia games are a thin genre,
  with 15.

The [evidence notes][ev-hunch] and the [gallery notes][gallery-other] have
the sources.

[ev-hunch]: /docs/research/idea-evidence.md#hunch-a-daily-20-questions-game
[gallery-other]: /docs/research/gallery-2026.md#other-prize-categories

## What the app does

1.  **Open today's puzzle.** Everyone gets the same hidden thing and a
    one-word hint, such as "An animal", with twenty questions to find it.
1.  **Ask anything.** The player types a yes-or-no question in their own
    words, and before they can type the next one, the Guessling nods for
    Yes, shakes its head for No, or shrugs for Sometimes. A question Jev
    can't settle gets "Ask another way", which doesn't count.
1.  **Guess.** The server checks the guess against the puzzle's accepted
    names, so the answer never ships in the app.
1.  **Share and come back.** A spoiler-free card goes to any chat, and a new
    puzzle arrives the next day.
1.  **Want more?** "Play yesterday's?" opens the paywall, and Guessling+
    opens the archive.

- **The character:** the Guessling knows the answer and reacts to every
  question. Its nod, head shake, shrug, and celebration give the game the
  art direction and tone that Best Game judges ask for.
- **Screens:** today's puzzle, the result and share card, the archive, the
  paywall, and settings with Restore Purchases, the privacy policy, and the
  terms. Every answer has "Report this answer", which sends it to the team
  to fix the puzzle for the players who come after.
- **The "aha":** the first question typed in the player's own words,
  answered at once.
- **Left out of the first version:** accounts, leaderboards, friends, packs,
  push notifications, Android, and an iPad layout.

## See also

- [Brief](/docs/BRIEF.md): what Shipaton 2026 requires, its dates, prizes,
  and judging.
- [Context](/docs/CONTEXT.md): the official rules, past winners, store
  review, monetization, and pitch guidance.
- [Ideation log](/docs/research/ideation.md): the ten rounds that chose
  Guessling, with their scores.
- [Jev notes](/docs/research/jev.md): what Jev is, its API, prices, limits,
  and terms.
- [Gallery notes](/docs/research/gallery-2026.md): the 1,115 projects in the
  2026 gallery on September 22, 2026.
- [Evidence notes](/docs/research/idea-evidence.md): rivals, reviews, and
  demand for the five finalists.

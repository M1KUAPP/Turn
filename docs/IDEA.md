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
1.  [How Jev fits](#how-jev-fits)
1.  [Monetization](#monetization)
1.  [Categories to enter](#categories-to-enter)
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

## How Jev fits

Jev is TypeSafe's hosted decision model. It answers typed questions about
text, as a Choice among options, a Score on a scale, or a yes-or-no Noul,
with probabilities, in about 100 to 150 ms, and it never writes text
([Jev notes][jev-what]). In Guessling it does three jobs, all through the
team's backend:

1.  **It checks each puzzle before the puzzle ships.** A script asks Jev
    every question in a bank of common questions, and each one's negation,
    with the puzzle's fact card as the state. A person fixes every answer
    between 0.3 and 0.7 and every pair whose answers disagree.
1.  **It matches the player's question to the bank.** A Choice over the
    category's bank questions, plus "none", picks the question the player
    meant, so two wordings get one answer. A Choice takes at most 255
    options.
1.  **It answers what the bank doesn't cover.** A live Noul against the fact
    card gives Yes above 0.7, No below 0.3, and "Ask another way" in between.
    A second Noul turns away anything that isn't a yes-or-no question about
    the hidden thing. A live answer is cached for the day, so every player
    gets the same one.

Why Jev fits the game:

- **It can't give the answer away.** Jev returns only numbers, so it can't
  spell out the secret, as a generative model could in its own words.
- **It's fast enough to feel like a conversation.** TypeSafe's cookbooks
  measured Jev at 111 and 114 ms a round trip, against 826 ms to 13.9 s for
  the language models they compared ([latency][jev-latency]).
- **It reads wordings nobody wrote down.** A hand-built table answers only
  the questions its authors predicted.

How it's wired:

- **The key stays on the server.** Jev has no mobile SDK, and TypeSafe's
  agreement requires the key to stay confidential. The app calls one
  Cloudflare Worker, which calls Jev through `@typesafe-ai/sdk` 0.6.0 with
  the model pinned to `jev-1.13.0`, because an alias "moves when a new
  release ships".
- **Busy or down:** the SDK retries busy responses (429 and 529) with
  backoff, the app shows a busy state, and the Worker still answers, in
  code, any wording that exactly matches a bank question.
- **Cost:** at $0.042 per million input tokens, a call the size of
  TypeSafe's quickstart costs about $0.000016, so cost won't limit the game
  ([prices][jev-prices]). Early access and the limit of 1,200 requests per
  minute matter more, so the key is the first thing to request.

Data, consent, and terms:

- Only the typed questions go to TypeSafe, whose services are hosted in the
  United States, and Jev "is not trained on customer requests or
  responses".
- Before the first question, a notice names TypeSafe and asks permission,
  as guideline 5.1.2(i) requires before personal data goes to a third-party
  AI. The privacy policy names TypeSafe too, and there are no accounts.
- TypeSafe says no part of its services "is directed to children", so
  Guessling stays out of the Kids category ([store review][jev-store]).
- TypeSafe's agreement allows the API inside the team's own app (section
  2.2) but not as "a standalone service"; Guessling is a game, not a relay.
  Section 16.4 bars announcing the relationship without TypeSafe's consent,
  so the team asks before naming Jev in the video or the write-up
  ([terms][jev-terms]).

[jev-what]: /docs/research/jev.md#what-jev-is
[jev-latency]: /docs/research/jev.md#rate-limits-context-length-and-latency
[jev-prices]: /docs/research/jev.md#jev-prices
[jev-store]: /docs/research/jev.md#store-review-and-jev
[jev-terms]: /docs/research/jev.md#master-customer-agreement-terms-for-apps

## Monetization

The context has the [benchmarks and paywall rules][ctx-money]; this is how
Guessling applies them.

- **Free:** today's puzzle, every day. A daily game that locks its daily
  puzzle fights its genre.
- **Guessling+:** one entitlement that opens the archive of every past
  puzzle: ten at launch, and one more each day. That's how NYT Games sells
  puzzles, and nothing it promises is missing on launch day.
- **Plans:** yearly at $19.99 with a 3-day free trial, shown first, and
  monthly at $2.99. That's below NYT Games' $4.99 to $5.99 a month for a
  bundle, and above a single 20-questions rival's $0.99 a month.
- **Paywall:** one RevenueCat Paywall, configured remotely and dismissible,
  shown after today's result as "Play yesterday's?" and on any locked
  archive puzzle.
- **Trial length:** trials started by September 27 convert before September
  30, while revenue still counts toward the Grand Prize shortlist.
- **Judges:** one-time-use Apple offer codes for a free month of Guessling+,
  created once the app is live. A code redeemed on October 1 lasts past the
  end of judging on October 13, and the daily puzzle needs no code.
- **What to measure:** paywall views, trial starts, and conversions from
  RevenueCat's charts, which count production purchases only.

[ctx-money]: /docs/CONTEXT.md#monetization-and-paywalls

## Categories to enter

The brief warns "don't try to jam your app into every prize category", so
Guessling enters two and the Grand Prize considers it anyway.

- **Best Game, first.** Judges want "strong gameplay, a clear art direction,
  and a monetization model that fits the genre instead of fighting it", in a
  game that is "coherent, playable, and convincing as a shipped experience".
  Guessling brings a proven loop made new by questions in the player's own
  words, the Guessling's art and tone, and a free daily puzzle with a paid
  archive. The video shows real play on an iPhone.
- **HAMM, second.** Judges want "a well-crafted paywall, thoughtful pricing
  and packaging, strong conversion, and monetization that genuinely fits the
  product". Guessling brings a paywall at the moment a player wants more,
  two plans with the yearly first, a trial timed to the deadline, and its
  conversion numbers.
- **Grand Prize, automatically.** Its shortlist counts revenue as reported
  in RevenueCat, so every sale goes through RevenueCat.

Left out, with the reason:

- **Growth Loop and #BuildInPublic:** the red team scored both 2 or lower,
  and Layers would add a tracking prompt to the one submission that can't
  afford a rejection.
- **Keep Them Coming Back:** it needs OneSignal and push notifications, which
  the first version leaves out.
- **Design and Peace Prize:** the Guessling's art is judged under Best Game,
  and a game isn't a social-good app.
- **The five Influencer Awards:** each is a fixed brief, and none asks for a
  game; the Gaming brief asks for a game backlog.
- **Catvertising:** Guessling shows no ads.
- **Ship Kotlin Everywhere and Best App for Galaxy:** they need Google Play
  or the Galaxy Store.
- **Funnel Vision, Idea to Income, and Most Viral App:** they need a web
  funnel, a build on Replit, or Noise's $50 daily minimum.
- **Next Gen and Conflict of Interest:** they're for students and for staff.

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

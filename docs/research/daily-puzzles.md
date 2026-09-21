# Daily puzzles research notes

How NYT Games, LinkedIn, and Apple News+ run a daily puzzle: when a new one
appears, what a finished round shows and shares, how streaks and archives
work, and how the publishers keep a puzzle fair and fix it. These notes feed
the rules in `docs/PRD.md` for Guessling; every source was read on September
22, 2026, so prices, puzzle numbers, and rules are as of that date, and
judgment starts with "Synthesis:".

Contents:

1.  [Sources and method](#sources-and-method)
1.  [When a new puzzle appears](#when-a-new-puzzle-appears)
    1.  [NYT Games release times](#nyt-games-release-times)
    1.  [LinkedIn release time](#linkedin-release-time)
    1.  [Apple News+ release time](#apple-news-release-time)
    1.  [A round in progress at midnight](#a-round-in-progress-at-midnight)
1.  [Spoiler-free shared results](#spoiler-free-shared-results)
    1.  [NYT share formats](#nyt-share-formats)
    1.  [LinkedIn and Apple share contents](#linkedin-and-apple-share-contents)
1.  [How streaks work](#how-streaks-work)
    1.  [NYT streak rules](#nyt-streak-rules)
    1.  [LinkedIn streak freezes and resurrection](#linkedin-streak-freezes-and-resurrection)
    1.  [Apple News+ streak window](#apple-news-streak-window)
1.  [How archives are offered](#how-archives-are-offered)
    1.  [Free and paid puzzles](#free-and-paid-puzzles)
    1.  [Prices on September 22, 2026](#prices-on-september-22-2026)
    1.  [How archive play counts](#how-archive-play-counts)
1.  [What a finished round shows](#what-a-finished-round-shows)
    1.  [End-of-round screens](#end-of-round-screens)
    1.  [Countdowns and reminders](#countdowns-and-reminders)
1.  [Twenty Questions and up-front hints](#twenty-questions-and-up-front-hints)
    1.  [Rules of the classic game](#rules-of-the-classic-game)
    1.  [Hints and categories shown up front](#hints-and-categories-shown-up-front)
1.  [Fairness and corrections](#fairness-and-corrections)
1.  [Findings for the PRD](#findings-for-the-prd)
1.  [Conflicts between sources](#conflicts-between-sources)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## Sources and method

- **Publishers.** NYT Games' help center, its game pages, and the code those
  pages serve; LinkedIn Help's games articles; Apple's iPhone User Guide,
  its Apple News+ page, and its Newsroom; and the NYT Games App Store
  listing for US prices. The rules of Twenty Questions come from Wikipedia
  because Britannica refused every request (see [Gaps](#gaps)).
- **NYT help.** The help center's Atom feed listed every article
  ([nyt-help-feed]), and each quote was then checked against the live page.
  The feed dates the last edits of the Wordle, Strands, and Crossword
  articles to September 13, 2026.
- **Game code.** Share text, end-of-round copy, and stat labels are string
  literals in the JavaScript that nytimes.com served for Wordle,
  Connections, and Strands on September 22, 2026 ([nyt-wordle-game];
  [nyt-connections-game]; [nyt-strands-game]). The logic around them is
  described, not quoted.
- **Archived copies.** nytimes.com blocked its article pages for `curl` and
  headless Chrome, and WebFetch refuses the domain, so two NYT articles from
  2022 and the original Wordle were read in the Internet Archive's copies.
- **Location.** NYT's subscription page and LinkedIn's game pages adapt to
  the reader's location, and they were read from outside the US. Apple's
  guide was checked at its locale-free address.
- **LinkedIn.** LinkedIn's robots file forbids automated access without
  permission ([li-robots]), so reading stopped at seven public Help articles
  and the public game pages, with no crawling.

[nyt-help-feed]: https://thenewyorktimeshelpcenter.helpjuice.com/questions.atom
[li-robots]: https://www.linkedin.com/robots.txt

## When a new puzzle appears

### NYT Games release times

- **Local midnight.** "The daily Wordle game releases at midnight in your
  timezone." ([nyt-wordle-help]) Connections "is released daily at midnight
  in your timezone", "The daily Strands puzzle releases at midnight in your
  timezone", and Pips puzzles "are published every day at midnight, local to
  the player's time zone" ([nyt-connections-help]; [nyt-strands-help];
  [nyt-pips-help]). Bonus puzzles "are released weekly on Wednesdays at
  midnight in your time zone" ([nyt-bonus-help]).
- **How Wordle finds the day.** The page requests
  `/svc/wordle/v2/<yyyy-MM-dd>.json` for the device's date, and the record
  holds the puzzle's `id`, `print_date`, `days_since_launch`, `editor`, and
  `solution`, so the answer reaches the browser ([nyt-wordle-game]). The
  record for September 22, 2026 has `"days_since_launch": 1921` and
  `"editor": "Tracy Bennett"` ([nyt-wordle-0922], which shows that day's
  answer).
- **Records ahead of time.** Observed on the same endpoint at 22:18 UTC on
  September 21, 2026, while it was still September 21 in the Americas: it
  returned full records, answers included, for September 23 and October
  15, 2026, which these notes don't reproduce.
- **Eastern time.** The Crossword's "Tuesday - Saturday puzzles are
  available at 10 p.m. EST the previous day", and its "Sunday and Monday
  puzzles are available at 6 p.m. EST the previous day"
  ([nyt-crossword-help]). Sudoku keeps the same times, and the Mini opens
  weekday and Saturday puzzles at 10 p.m. EST and Sunday's at 6 p.m. EST on
  Saturday ([nyt-sudoku-help]; [nyt-mini-help]). "New Spelling Bee puzzles
  are released at 3 a.m. EST every day of the week", Letter Boxed also at 3
  a.m., and "The tile set rotates daily at 12 a.m EST"
  ([nyt-spelling-bee-help]; [nyt-letter-boxed-help]; [nyt-tiles-help]).
- Synthesis: NYT runs two clocks. Its free, shareable games roll over at
  each player's midnight, while the subscriber crosswords keep the print
  paper's Eastern schedule: the subscription promises "Access to the Daily
  Crossword puzzles the evening before their release in print"
  ([nyt-games-sub-help]).

[nyt-pips-help]: https://help.nytimes.com/360011158491-New-York-Times-Games/pips
[nyt-letter-boxed-help]: https://help.nytimes.com/360011158491-New-York-Times-Games/28527193547028-Letter-Boxed
[nyt-tiles-help]: https://help.nytimes.com/360011158491-New-York-Times-Games/360029050872-Tiles

### LinkedIn release time

- "New puzzles are released daily at midnight Pacific Time (PT)."
  ([li-games]) Each game's article adds: "A new puzzle for each game is
  released daily at midnight Pacific Time (PT). Previous puzzles expire at
  this time and are no longer playable." ([li-queens]; [li-pinpoint])
- Synthesis: One global time gives everyone the same puzzle at the same
  moment, but not at their own midnight. In September, midnight PT is 07:00
  UTC: 8 a.m. in London, 12:30 p.m. in India, and 4 p.m. in Tokyo.

### Apple News+ release time

- Apple's pages give no clock time, but the streak rule counts from
  publication: "Players in the contiguous U.S. and Canada must complete a
  puzzle within 24 hours of its publication for it to count toward a
  streak. Players in Alaska and Hawaii must complete the day’s puzzle before
  midnight local time." ([apple-puzzles-guide])
- Apple introduced the puzzles "for News+ subscribers in the U.S. and
  Canada" with iOS 17, and Emoji Game "is now available in English for
  Apple News+ subscribers in the U.S. and Canada" ([apple-nr-quartiles];
  [apple-nr-emoji]).
- Synthesis: The rule reads as one publication moment a day for the US and
  Canada, with a 24-hour window instead of a midnight cutoff everywhere but
  Alaska and Hawaii; the moment itself is undocumented.

### A round in progress at midnight

- **NYT's local-midnight games.** The Wordle help lists three ways a game
  ends: a correct guess, six misses, or "A new daily Wordle is published at
  midnight local time." Its stats section still allows a late finish:
  "Note: If you finish a puzzle after midnight local time, your streak will
  be broken and a new streak will begin." ([nyt-wordle-help]) Connections
  and Strands carry the same note ([nyt-connections-help];
  [nyt-strands-help]).
- **NYT's archive.** A subscriber can reopen a past Wordle, where "Gold
  lines" mean "The puzzle is in progress", but archive play "does not affect
  your streaks" ([nyt-wordle-help]).
- **Grace windows.** A NYT Crossword counts toward a streak if "solved up
  to 48 hours after the publication time without using Check or Reveal"
  ([nyt-crossword-help]). Apple's crossword guide says "You don’t have to
  solve puzzles all at once. You can return at any time. The timer pauses
  while you’re away." ([apple-crossword-guide])
- **Hard stop.** On LinkedIn, "Previous puzzles expire at this time and are
  no longer playable." ([li-queens])
- Synthesis: A round left open at rollover ends (LinkedIn), finishes
  without streak credit (NYT's local-midnight games), or gets a grace
  window (Apple's 24 hours, the NYT Crossword's 48). The PRD has to pick
  one and state it once; NYT's Wordle page states two rules (see
  [Conflicts between sources](#conflicts-between-sources)).

[apple-crossword-guide]: https://support.apple.com/guide/iphone/solve-crossword-and-crossword-mini-puzzles-iph9c11382ff/ios

## Spoiler-free shared results

### NYT share formats

- **Wordle.** The Share button copies text the page builds: `Wordle`, the
  puzzle number with a thousands separator, and the guesses used out of 6,
  with `X` for a loss and `*` in Hard Mode; then a blank line and one row of
  five squares per guess ([nyt-wordle-game]). 🟩 is a right letter in the
  right spot, 🟨 a right letter in the wrong spot, and ⬜ a miss (⬛ in dark
  mode); High Contrast Mode swaps in 🟧 and 🟦. An archive result starts
  with a line such as `Archive September 21, 2026`. The number is
  `days_since_launch`, so September 22's result begins `Wordle 1,921`
  ([nyt-wordle-0922]). An illustrative result, with made-up rows:

  ```text
  Wordle 1,921 4/6

  ⬜🟨⬜⬜⬜
  ⬜⬜🟩🟨⬜
  🟨🟩🟩⬜⬜
  🟩🟩🟩🟩🟩
  ```

- **Connections.** `Connections` on the first line, `Puzzle #<n>` on the
  second, then one row of four squares per guess, each square colored by
  its word's group: 🟨, 🟩, 🟦, or 🟪 ([nyt-connections-game]). The
  number counts days from June 12, 2023, starting at 1, and an archive
  result opens with `Archive <date>` and then `Connections Puzzle #<n>`.
  An illustrative result:

  ```text
  Connections
  Puzzle #<n>
  🟨🟨🟨🟨
  🟩🟦🟩🟩
  🟩🟩🟩🟩
  🟦🟦🟦🟦
  🟪🟪🟪🟪
  ```

- **Strands.** `Strands #<n>`, then the day's theme clue in curly quotes,
  then one symbol per word found or hint used, four to a row: 🔵 a theme
  word, 🟡 the spangram, 💡 a hint ([nyt-strands-game]). The clue is the
  text the board shows under "today’s theme" before the first move. An
  illustrative result:

  ```text
  Strands #<n>
  “<the day’s theme clue>”
  🔵🔵💡🔵
  🟡🔵🔵
  ```

- **What the shares leave out.** No letters, words, or group names. The
  result goes out from "the Share button at the bottom of the Statistics
  page" through the device's share options or as "Copied results to
  clipboard" ([nyt-wordle-help]).
- **Spoilers fenced off.** The Wordle Review "is published daily at 3am
  E.T." under "Warning: Contains spoilers!", and the hint forums warn that
  "Comments may contain spoilers" ([nyt-wordle-help];
  [nyt-connections-help]).

### LinkedIn and Apple share contents

- **LinkedIn.** A score can go out as a post, a message, or a copy for other
  platforms: "Click on Copy score icon to copy your score." ([li-share])
  What it holds depends on the game. "In Queens, your score shows the time
  it took to solve the game, and the first three grid colors where you
  correctly placed the crown symbol. Your score may also show the text no
  mistakes, no hints, or both, depending on how you played." In Pinpoint, it
  shows "how many word reveals it took to guess the correct category along
  with the solving path and how closely it matches the answer you provide".
  ([li-share-info])
- **LinkedIn privacy.** "Your score stays private unless you opt into the
  connections leaderboard or choose to share it directly." ([li-faq]) "Your
  streak is private unless you share it with others." ([li-streaks])
- **Apple.** Sharing sends a link "to another Apple News+ subscriber so they
  can solve the puzzle too". "Your answers aren’t shown, but the following
  information is shared for completed puzzles": the solve time for
  crossword, crossword mini, and sudoku; "Your rank" in Quartiles; and "The
  number of moves you used to solve the puzzle" in Emoji Game
  ([apple-puzzles-guide]).
- Synthesis: Every format names the puzzle (game, number, and a date line
  for archive play), states the result (guesses out of the limit or `X`,
  time, rank, or moves), and shows the path without content (colored
  squares, first colors, no-hints tags). For Guessling that maps to
  `Guessling` and the number, questions used out of 20 or `X`, one symbol
  per answer, and the day's hint, which every player sees before asking.
  The question text would spoil the round the way Wordle's letters would.

[li-share]: https://www.linkedin.com/help/linkedin/answer/a6287691
[li-share-info]: https://www.linkedin.com/help/linkedin/answer/a6889085

## How streaks work

### NYT streak rules

- **Wordle.** "Current Streak counts consecutive wins. Puzzles must be
  solved before midnight local time to be included in the current streak."
  "Max Streak is the longest streak you’ve held". Archive play doesn't
  count: "Streaks are only counted based on the puzzle you play on the day
  of release." ([nyt-wordle-help])
- **Connections.** "Current Streak: The number of consecutive wins", where a
  win means "completing in under 4 mistakes" ([nyt-connections-help]).
- **Strands.** It counts days, not wins: "Current Streak: The number of
  consecutive days you have completed that day’s puzzle."
  ([nyt-strands-help])
- **Crossword.** "Streaks reflect the number puzzles solved up to 48 hours
  past publication time without using Check or Reveal", and "Using Check or
  Reveal will result in your Crossword Streak being reset." The Mini "does
  not have a streak feature". ([nyt-crossword-help]; [nyt-mini-help])
- **Repairs.** For Wordle, "In some cases, a member of our team may be able
  to manually restore your streak." Connections and Strands streaks "cannot
  be reset once they are broken" ([nyt-wordle-help];
  [nyt-connections-help]; [nyt-strands-help]).
- **Badges.** Streak badges can't be earned twice, and "Existing players
  will automatically receive a streak badge that matches their max streak"
  ([nyt-badges-help]).
- **Where streaks live.** Signed out, "all of your game progress will be
  stored locally on your device and not on your account which can cause you
  to lose your progress" ([nyt-games-sub-help]).

### LinkedIn streak freezes and resurrection

- **Definition.** The streak "shows how many consecutive days you’ve won a
  game", and "To maintain your streak, you must play and win the game daily
  before it expires at midnight Pacific Time (PT)." ([li-streaks])
- **Streak card.** It shows "Streak length", then "Total number of games
  started, your win percentage, best score, and maximum streak length", and
  milestone icons that "start out gray and turn golden" ([li-streaks]).
- **Freeze.** "If you miss a day, you’ll lose your streak unless you have a
  streak freeze. A streak freeze holds your streak in place for one day but
  doesn’t add to your streak count." "You earn a streak freeze after winning
  5 games in a row. You can hold a maximum of two streak freezes per game at
  a time. Streak freezes don’t expire and are automatically applied if you
  miss a day." ([li-streaks])
- **Resurrection.** "If you lost a streak of 31 days or more, you’ll receive
  an in-app notification to resurrect it." The player then plays 3, 5, or 7
  days in a row, for lost streaks of 31–49, 50–99, or 100 or more days, and
  "If you lost a streak of 30 days or fewer, it can't be resurrected."
  ([li-streaks])
- **Freshness.** The page read "Last updated: 6 days ago" on September 22,
  2026 ([li-streaks]).

### Apple News+ streak window

- Each puzzle feed's Scoreboard shows "Your current streak—the number of
  consecutive days you solved the daily puzzle" and "Your longest streak"
  ([apple-puzzles-guide]).
- Revealing ends credit: "If you use the Reveal command to show all or a
  portion of a puzzle, the puzzle won’t count toward your stats, and
  completing the puzzle won’t start or continue a streak." For sudoku,
  "solve at least one of the current day’s sudoku puzzles of any difficulty
  level without revealing answers." ([apple-puzzles-guide])
- Streaks follow the player: "Your stats and streaks stay up to date on all
  your Apple devices where you’re signed in to the same Apple Account."
  ([apple-puzzles-guide])
- Synthesis: The choices are what counts (wins for Wordle, Connections, and
  LinkedIn; days completed for Strands and Apple), when the day closes
  (local midnight, one global time, or a 24- or 48-hour window), and
  whether a miss can be forgiven (LinkedIn's freezes, NYT's manual
  restores, or never). Guessling has no accounts in its first version
  ([idea-what]), so its streak lives on the device, which NYT warns "can
  cause you to lose your progress" ([nyt-games-sub-help]).

## How archives are offered

### Free and paid puzzles

- **NYT free.** "If you do not have a subscription that includes access to
  Games, you can still access the following daily puzzles and games for
  free": Wordle, Connections, Connections Sports Edition, Spelling Bee
  ("limited access"), Crossplay, Pips, Strands, and Sudoku
  ([nyt-games-sub-help]). "Solvers do not need a subscription to play the
  daily Wordle. However, the entire Wordle experience is only available to
  Games, All Access, and Home Delivery Subscribers." ([nyt-wordle-help])
- **NYT paid.** A Games subscription adds the Crossword, the Midi, the
  Mini, Letter Boxed, Tiles, "An archive of over 10,000 Crosswords,
  including our Daily puzzles back to 1993 and Minis back to 2014", "A
  subscriber-only monthly bonus puzzle, back to 1997 (online only)", and
  "Editorial companions". "Companion sites and analysis tools such as Wordle
  Bot and Cross Bot are not available without a subscription."
  ([nyt-games-sub-help])
- **NYT game archives.** Subscribers can play Wordle "from as far back as
  June 19th, 2021", Connections "from as far back as June 12, 2023", and
  Strands "from as far back as March 4th, 2024" ([nyt-wordle-help];
  [nyt-connections-help]; [nyt-strands-help]). Spelling Bee's hub shows
  "which puzzles are available from the current week, in addition to the
  week prior", and a lock on a past puzzle "means playing past puzzles is
  not included in your subscription" ([nyt-spelling-bee-help]). "Sudoku
  does not have statistics or an archive at this time", and Connections:
  Sports Edition "does not have an archive" ([nyt-sudoku-help];
  [nyt-connections-help]).
- **NYT's store listing.** "Subscribers can solve over 10,000 past puzzles
  from New York Times Games." "Explore puzzle archives for Wordle,
  Connections, Strands, Spelling Bee, the Crossword and the Mini."
  ([nyt-games-app-store])
- **Where NYT pitches the archive.** When a Wordle round ends, the keyboard
  gives way to two buttons, "See results" and "Play the Wordle Archive",
  and the News app leaves out the second. One of Wordle's prompts reads
  "Access over 10,000 puzzles in our archives. Subscribe now."
  ([nyt-wordle-game])
- **LinkedIn.** No archive and no charge: "Any member of LinkedIn can play
  the games - you do not need any special access to play", and "There are no
  prizes for solving games" ([li-faq]). Past puzzles "are no longer
  playable" ([li-queens]).
- **Apple.** "If you subscribe to Apple News+, you can access daily and
  archived crossword, crossword mini, Quartiles, sudoku, and Emoji Game
  puzzles. Some puzzles may be available without a subscription." "You can
  see more past puzzles in each puzzle type’s complete archive", which can
  be sorted and filtered ([apple-puzzles-guide]). Apple's comparison table
  puts "Exclusive daily puzzles" in News+ and not in free Apple News
  ([apple-news-plus]).
- Synthesis: NYT's split is closest to Guessling's: the daily word games are
  free, and the subscription sells the past, back to each game's launch,
  plus companions and analysis ([idea-money]). Apple sells daily and
  archived puzzles together inside a news bundle, and LinkedIn sells
  neither.

### Prices on September 22, 2026

| Offer                         | Price                                                              | Source                |
| ----------------------------- | ------------------------------------------------------------------ | --------------------- |
| NYT Games, US App Store       | "Games - Monthly" at $5.99 or $4.99                                | [nyt-games-app-store] |
| NYT Crossword, US App Store   | "New York Times Crossword Subscription" at $6.99 or $39.99         | [nyt-games-app-store] |
| NYT Games, web                | Billed "every 28 days or every year"; the US price wasn't readable | [nyt-games-sub-help]  |
| Apple News+                   | "$12.99 per month" after 1 month free for new subscribers          | [apple-news-plus]     |
| Apple One Premier, with News+ | "$39.95 per month"                                                 | [apple-news-plus]     |
| LinkedIn games                | No charge: "you do not need any special access to play"            | [li-faq]              |

- The App Store page names each in-app purchase and its price but not its
  billing period, and it lists ten, so the list may be partial
  ([nyt-games-app-store]).
- Apple's Newsroom gave other markets on July 17, 2025: "$12.99 per month
  in the U.S., £12.99 in the UK, $16.99 in Canada, and $19.99 in
  Australia" ([apple-nr-emoji]).
- NYT sells Puzzle Packs apart from the subscription: "Puzzle Packs are not
  included in a New York Times Games subscription", and "Both subscribers
  and non-subscribers can purchase Puzzle Packs directly in the Games app"
  ([nyt-games-app-help]).
- Synthesis: Guessling+ at $2.99 a month or $19.99 a year ([idea-money])
  sells one game's archive for about half of NYT's $5.99 App Store price,
  which covers 13 games and over 10,000 past puzzles, and for under a
  quarter of Apple News+.

### How archive play counts

- **Stats yes, streaks no.** "Playing Wordle puzzles in the archive does
  affect your Wordle Stats (Puzzles Played, Win %, and Guess Distribution)"
  but "does not affect your streaks" ([nyt-wordle-help]). Connections and
  Strands follow the same rule ([nyt-connections-help];
  [nyt-strands-help]).
- **One try.** "Completed Wordles cannot be replayed." Connections and
  Strands say the same of their puzzles ([nyt-wordle-help];
  [nyt-connections-help]; [nyt-strands-help]).
- **Progress marks.** The Wordle archive shows "An outlined gray box" for a
  puzzle not started, "Gold lines" for one in progress, a "Solid white star"
  for a solve, and a "White star with green center" when "an incorrect word
  was guessed" ([nyt-wordle-help]).
- **Accounts.** "Progress and play history on archived Wordle puzzles is
  only available if you have a New York Times account." ([nyt-wordle-help])
- **Dated rewards.** "Some badges are for playing on a specific date. These
  can only be earned on that day. Playing in the archive later won’t
  count." ([nyt-badges-help])
- **Dated shares.** Archive results open with an `Archive <date>` line in
  Wordle, Connections, and Strands ([nyt-wordle-game];
  [nyt-connections-game]; [nyt-strands-game]).
- Synthesis: A Guessling+ archive can copy these rules: past puzzles count
  in stats but never in streaks, a finished puzzle can't be replayed, and
  its share card carries the puzzle's date so friends don't mistake it for
  today's.

## What a finished round shows

### End-of-round screens

- **Wordle, right after the round.** The results panel opens with
  "Congratulations!" after a win or "Thanks for playing today!" after a
  loss, then "Statistics" (Played, Win %, Current Streak, Max Streak), a
  "Guess Distribution" bar graph that highlights the winning row, any
  badges earned, and the Share button. On the board, the keyboard gives way
  to "See results" and "Play the Wordle Archive" ([nyt-wordle-game]). The
  help: "Your Statistics page contains your Wordle stats (Played, Win %,
  Current Streak, and Max Streak) with an accompanying bar graph of your
  Guess Distribution." ([nyt-wordle-help])
- **Wordle, on a return visit.** The opening screen's message follows the
  day's state, from `Go ahead, add another day to your <n> day streak.`
  before play to the win and loss lines quoted under
  [Countdowns and reminders](#countdowns-and-reminders). Below it sit the
  date, "No." and the puzzle number, and "Edited by" and the editor for
  puzzles numbered 506 and up ([nyt-wordle-game]). No. 506 fell on
  November 7, 2022, the day Wordle's editor started ([nyt-editor-2022]).
- **Connections.** Stats appear on the share page: "Puzzles Completed",
  "Win Rate %", "Current Streak", "Max Streak", "Perfect Puzzles" (solved
  with no mistakes), and a "Mistake Histogram" ([nyt-connections-help]).
- **Strands.** "Completed, Solve %, Current Streak, Max Streak, Spangram
  First, and Solved Without Hints" ([nyt-strands-help]).
- **Crossword.** "Puzzles Solved, Solve Rate, Current Streak, and Longest
  Streak", with solve times by day of the week ([nyt-crossword-help]).
- **LinkedIn.** The results page lets a player "View your score compared to
  averages for all members, your company, CEOs, and more", "Track your
  streak and game analytics in the streak module", open leaderboards,
  share, "Join conversations with other members who have played that day in
  daily posts", and "Discover other games you haven’t played yet today"
  ([li-queens]).
- **Apple.** Each feed's Scoreboard has "Statistics for each puzzle
  type—the number of puzzles solved, for example" plus current and longest
  streaks, and Game Center adds "the leaderboard for each puzzle type"
  ([apple-puzzles-guide]). The Newsroom mentions "their solve rate and their
  longest streak" ([apple-nr-quartiles]).
- Synthesis: The shared core is rounds played, win rate, current streak,
  best streak, and one distribution of how rounds went. For Guessling
  that's Played, Win %, Current Streak, Max Streak, and a distribution of
  questions used out of 20.

### Countdowns and reminders

- **Original Wordle.** Josh Wardle's page, as archived on January 16, 2022,
  put a "Next WORDLE" heading over a countdown timer beside the Share
  button, under "Statistics" (Played, Win %, Current Streak, Max Streak) and
  "Guess Distribution". Its help ended "A new WORDLE will be available each
  day!" ([wordle-original])
- **Wordle now.** The web code served on September 22, 2026 has no
  next-puzzle countdown, and its only countdowns belong to ads; the
  Connections and Strands code is the same ([nyt-wordle-game];
  [nyt-connections-game]; [nyt-strands-game]). Wordle's help panel says
  instead: "A new puzzle is released daily at midnight. If you haven’t
  already, you can sign up for our daily reminder email." After a loss,
  the opening screen says "Tomorrow’s a new day, with a new puzzle. See you
  then." After a win it says "Great job on today’s puzzle! Check out your
  progress." ([nyt-wordle-game])
- **Reminders.** "To receive alerts on your device when the newest daily
  puzzle is available, you can enable push notifications in the Games app
  Settings." ([nyt-crossword-help]) LinkedIn: "Enable notifications to get
  reminders when the next game is available. On the streak card, toggle the
  switch next to Keep your streak to On." ([li-streaks])
- None of the help pages read for NYT, LinkedIn, or Apple mentions a
  countdown.
- Synthesis: The original Wordle showed a countdown, and NYT's version
  relies on reminders instead. Guessling's first version leaves out push
  notifications ([idea-what]), so a countdown to the next puzzle on the
  result screen, beside Share as in the original, is its cheapest reason to
  return.

## Twenty Questions and up-front hints

### Rules of the classic game

- **Play.** "In the traditional game, the 'answerer' chooses something that
  the other players, the 'questioners', must guess. They take turns asking a
  question, which the answerer must answer with 'yes' or 'no'. In variants
  of the game, answers such as 'maybe' are allowed." ([wp-20q])
- **Honesty and the limit.** "Lying is not allowed." "If 20 questions are
  asked without a correct guess, then the answerer has stumped the
  questioners". The guess is itself a question: the sample questions end
  "and finally 'Is it this pen?'" ([wp-20q])
- **Category opener.** "A common variant is called 'animal, vegetable, or
  mineral'." In it, "the answerer tells the questioners at the start of the
  game whether the subject belongs to the animal, vegetable, or mineral
  kingdom." The categories "can produce odd technicalities, such as a
  wooden table being classified as a vegetable". "Another variant is
  'person, place, or thing'", and others name a category "such as actions,
  occupations, or famous people". ([wp-20q])
- **Strategy.** If each question halves the field, 20 questions can tell
  apart 2 to the 20th power, or 1,048,576, objects, so "the most effective
  strategy for the twenty questions is to ask questions that will split the
  field of remaining possibilities roughly in half each time" ([wp-20q]).
- **Age.** "The game dates to at least the eighteenth century and, during
  the twentieth century, was used as the basis for some radio and
  television quiz programs." ([wp-20q])
- Synthesis: Guessling's hint, such as "An animal", is the classic opener,
  and "Ask another way" is the "maybe" variant with the question not
  counted ([idea-what]; [wp-20q]). The classic game counts the final guess
  as one of the twenty, so the PRD must say whether Guessling's guesses do.
  The wooden-table problem is why each hint needs a definition the answers
  follow.

### Hints and categories shown up front

- **Strands.** The board's header reads "today’s theme" over the day's
  clue, which the puzzle record stores as `clue`; the share repeats it
  ([nyt-strands-game]). Players "uncover words falling under a theme", and
  "Every 3 non-theme words will unlock a hint!" ([nyt-strands-help])
- **Create Your Wordle.** A subscriber's custom puzzle can carry "an
  optional hint up to 50 characters", and "The hint will be shared with the
  unique URL link." ([nyt-wordle-help])
- **Wordle in 1.** "Players are given one clue and there is only one
  possible word solution." ([nyt-bonus-help])
- **Emoji Game.** "Each phrase is accompanied by a clue, which the user can
  choose to reveal, but that will count toward the player’s total number of
  moves." ([apple-nr-emoji]) The guide adds: "When you attempt an answer or
  expand a clue, it counts as a move." ([apple-emoji-guide])
- **Pinpoint.** LinkedIn makes the category the answer: "you try to guess
  the common category or theme linking a set of words. You’re given five
  clues to figure out this common category." Players "Type your guess in
  the Guess the category text field", and each wrong guess reveals the next
  clue ([li-pinpoint]).
- **Connections.** No category shows until it's found, and colors only rank
  difficulty: "Each group is assigned a color (Yellow, Green, Blue, or
  Purple), with Yellow being the easiest category and Purple being the
  trickiest." ([nyt-connections-help])
- Synthesis: A free hint shown before the first move, like Strands' theme
  and the classic opener, is the norm, and it can travel in the share
  without spoiling. If Guessling ever adds a second hint, Emoji Game is the
  model: it costs a move.

## Fairness and corrections

- **One word for everyone.** On May 9, 2022, NYT wrote that "some users may
  see an outdated answer that seems closely connected to a major recent news
  event", and: "When we discovered last week that this particular word would
  be featured today, we switched it for as many solvers as possible." Those
  who hadn't refreshed "will be asked to solve the outdated puzzle", and NYT
  was "revamping Wordle’s technology so that everyone always receives the
  same word" ([nyt-note-2022]).
- **Why it happened.** The note blamed the old design: "because of the
  current Wordle technology, it can be difficult to change words that have
  already been loaded into the game" ([nyt-note-2022]). The January 2022
  original picked each day's answer on the device, from a list inside its
  own code, by counting days from June 19, 2021 ([wordle-original]). Today's
  Wordle fetches each date's record from NYT's server ([nyt-wordle-game]).
- **An editor.** On November 7, 2022: "Starting Nov. 7, Wordle will have a
  dedicated editor, just as the Crossword, Mini and Spelling Bee do." "The
  game will have a Times-curated word list and will be programmed and
  tested like the Spelling Bee and the Crossword." And: "If your answer word
  is different from others’, play on the app or refresh your browser."
  ([nyt-editor-2022])
- **Curation today.** "Daily words are curated by editors using the Oxford
  Dictionary." ([nyt-wordle-help]) In Connections, "Each puzzle has exactly
  one solution", and "Words and categories are curated by editors using the
  Oxford Dictionary." ([nyt-connections-help])
- **Reporting a problem.** "If you are concerned there may be an error in a
  Sudoku puzzle", NYT asks for Check Puzzle first, then "Report a Bug in the
  Games app or Contact Us from the Games webpage so our team can
  investigate." ([nyt-sudoku-help]) Spelling Bee takes word suggestions "for
  our editors to review" ([nyt-spelling-bee-help]).
- **Comparison assumes one puzzle.** LinkedIn's "game leaderboard ranks the
  top 50 companies and schools based on the average score of colleagues
  within each company or school" ([li-games]); Apple's scores "appear on the
  leaderboard for each puzzle type in Game Center" ([apple-puzzles-guide]);
  NYT's friends leaderboards track the "number of guesses for Wordle"
  ([nyt-games-app-help]).
- **Answers in the browser.** Wordle's record carries the answer, and the
  endpoint served records weeks ahead (see
  [NYT Games release times](#nyt-games-release-times)).
- Synthesis: Of the pages read, only NYT's 2022 note describes changing a
  published puzzle, and the late swap left some players with the old answer.
  That supports Guessling's plan to fix a reported answer once the day ends
  ([idea-what]). Under local-midnight rollover, one date is live somewhere
  for about 50 hours, from UTC+14 to UTC−12, so "once the day ends" means
  after the last time zone's midnight.

## Findings for the PRD

- **Puzzle day.** Synthesis: Two tested models exist: each player's local
  midnight (Wordle, Connections, Strands, Pips) or one global time
  (LinkedIn's midnight PT, NYT's crosswords on Eastern time). Local
  midnight fits a morning habit; one global time keeps a single 24-hour day
  for caching answers, fixing reports, and stopping a player who moves the
  device clock from opening tomorrow's puzzle. See
  [When a new puzzle appears](#when-a-new-puzzle-appears).
- **Round open at rollover.** Synthesis: End it, let it finish without
  streak credit, or give a grace window, and state the rule once. See
  [A round in progress at midnight](#a-round-in-progress-at-midnight).
- **Share card.** Synthesis: Name and number, questions used out of 20 or
  `X`, one symbol per answer, and the hint; never the question text; a date
  line for archive play. See [NYT share formats](#nyt-share-formats).
- **Streaks.** Synthesis: Decide whether wins or days count, when the day
  closes, and whether a miss is forgiven. LinkedIn's freeze, earned after 5
  straight wins, held two at most, and applied automatically, is the only
  documented protection. See [How streaks work](#how-streaks-work).
- **Archive.** Synthesis: Keep today free and sell the past; archive rounds
  count in stats but never in streaks and can't be replayed; offer the
  archive once today's round is over, as Wordle's archive button does. See
  [How archives are offered](#how-archives-are-offered).
- **Prices.** Synthesis: On September 22, 2026, NYT Games was $5.99 or
  $4.99 a month on the US App Store and Apple News+ $12.99 a month after a
  free month; LinkedIn charges nothing. Guessling+'s $2.99 sits below both.
  See [Prices on September 22, 2026](#prices-on-september-22-2026).
- **Finished round.** Synthesis: Show Played, Win %, Current Streak, Max
  Streak, and questions used, plus a countdown, because the first version
  has no push reminders. See
  [What a finished round shows](#what-a-finished-round-shows).
- **Classic rules.** Synthesis: The hint is the classic category opener;
  decide whether a guess uses one of the 20 questions, as it does in the
  parlor game, and define each hint so the answers can't split on
  technicalities. See [Rules of the classic game](#rules-of-the-classic-game).
- **Fairness.** Synthesis: Everyone gets the same puzzle and the same
  answers; fix a reported answer only after the last time zone's midnight;
  keep the answer and future puzzles off the device, unlike Wordle. See
  [Fairness and corrections](#fairness-and-corrections).

## Conflicts between sources

- **A Wordle left open at midnight.** The Wordle help says a game ends when
  "A new daily Wordle is published at midnight local time", and also that
  "If you finish a puzzle after midnight local time, your streak will be
  broken" ([nyt-wordle-help]).
- **Wordle's results page name.** The help says stats appear on "the Thank
  you for playing today! page" ([nyt-wordle-help]); the served code has no
  such string, and titles that panel "Congratulations!" after a win and
  "Thanks for playing today!" after a loss ([nyt-wordle-game]).
- **Games with badges.** The App Store listing says "Earn badges for
  Spelling Bee, Wordle and Connections" ([nyt-games-app-store]); the help
  adds Strands: "Badges are currently available for Wordle, Connections,
  Strands and Spelling Bee." ([nyt-badges-help])
- **Who can play LinkedIn's games.** The FAQ says "Any member of LinkedIn
  can play the games" ([li-faq]); the overview says "Any LinkedIn or
  non-LinkedIn members can play these games" ([li-games]).
- **Eastern time labels.** The Crossword, Mini, Sudoku, Spelling Bee,
  Letter Boxed, and Tiles pages say "EST", which is standard time, though
  New York is on daylight time in September; the Midi page says "E.T."
  ([nyt-crossword-help]; [nyt-midi-help]).
- **48 hours from what.** The Crossword counts "up to 48 hours after the
  publication time"; the Midi counts "within 48 hours of the publication
  date" ([nyt-crossword-help]; [nyt-midi-help]).
- **Emoji Game size.** The Newsroom has players "fill in the blanks of three
  short phrases" ([apple-nr-emoji]); the guide says "complete several
  phrases" ([apple-emoji-guide]).

[nyt-midi-help]: https://help.nytimes.com/360011158491-New-York-Times-Games/the-midi-crossword

## Gaps

What the sources don't say that the PRD needs, as of September 22, 2026:

- **Apple's clock.** When Apple News+ publishes each day's puzzles, and
  which puzzles are free: "Some puzzles may be available without a
  subscription" names none ([apple-puzzles-guide]).
- **NYT's US web price.** The subscription page prices by location; read
  from outside the US, it showed a sale ("75% off your first year") at
  non-US prices, so only the App Store's US prices appear above
  ([nyt-subscribe-games]).
- **LinkedIn's copied score.** The Help lists what a copied score contains
  but not its exact text, and LinkedIn's robots rules kept this research
  out of its game code.
- **Britannica.** Its search and article pages returned HTTP 403 to `curl`
  and WebFetch, and headless Chrome got an empty page; Merriam-Webster also
  returned 403. The classic rules therefore come from Wikipedia's revision
  of September 3, 2026 ([wp-20q]).
- **Live NYT articles.** The two 2022 NYT articles were read in the
  Internet Archive's copies of June 1 and December 2, 2022, because
  nytimes.com refused direct reads; later edits, if any, are unseen
  ([nyt-note-2022]; [nyt-editor-2022]).
- **Apps.** Only NYT's web code was read. Whether the NYT Games iOS app
  shows a countdown, or ends a Wordle at midnight, is undocumented.
- **Correction policy.** No publisher documents how it fixes an error in a
  live puzzle, how long it waits, or what happens to streaks and stats
  earned on the flawed version; the 2022 Wordle note is the only case
  found.
- **Same-puzzle promise.** LinkedIn and Apple never say outright that
  everyone gets the same puzzle; their leaderboards imply it.
- **Travel.** No publisher says what happens to a local-midnight streak
  when a player changes time zones and meets the same date twice or skips
  one.

[nyt-subscribe-games]: https://www.nytimes.com/subscription/games

## See also

- [Shipaton 2026 idea](/docs/IDEA.md), especially
  [What the app does](/docs/IDEA.md#what-the-app-does) and
  [Monetization](/docs/IDEA.md#monetization).
- [Evidence for the top five ideas](/docs/research/idea-evidence.md#hunch-a-daily-20-questions-game),
  which covers the rival apps and Apple News+'s share summary.
- [Jev research notes](/docs/research/jev.md), on the model that answers
  the questions.

[nyt-wordle-help]: https://help.nytimes.com/360011158491-New-York-Times-Games/24611727334932-Wordle
[nyt-connections-help]: https://help.nytimes.com/360011158491-New-York-Times-Games/28525912587924-Connections
[nyt-strands-help]: https://help.nytimes.com/360011158491-New-York-Times-Games/28214352967700-Strands
[nyt-crossword-help]: https://help.nytimes.com/360011158491-New-York-Times-Games/360052406391-The-New-York-Times-Crossword-Puzzle
[nyt-mini-help]: https://help.nytimes.com/360011158491-New-York-Times-Games/360025912452-The-Mini-Crossword
[nyt-sudoku-help]: https://help.nytimes.com/360011158491-New-York-Times-Games/30467696592148-Sudoku
[nyt-spelling-bee-help]: https://help.nytimes.com/360011158491-New-York-Times-Games/23675493312404-Spelling-Bee
[nyt-bonus-help]: https://help.nytimes.com/360011158491-New-York-Times-Games/bonus-puzzles
[nyt-badges-help]: https://help.nytimes.com/360011158491-New-York-Times-Games/games-badges
[nyt-games-sub-help]: https://help.nytimes.com/360011158491-New-York-Times-Games/360052272251-New-York-Times-Games-Subscription
[nyt-games-app-help]: https://help.nytimes.com/360011158491-New-York-Times-Games/360052273251-The-New-York-Times-Games-app
[nyt-games-app-store]: https://apps.apple.com/us/app/nyt-games-wordle-crossword/id307569751
[nyt-wordle-game]: https://www.nytimes.com/games/wordle/index.html
[nyt-connections-game]: https://www.nytimes.com/games/connections
[nyt-strands-game]: https://www.nytimes.com/games/strands
[nyt-wordle-0922]: https://www.nytimes.com/svc/wordle/v2/2026-09-22.json
[nyt-note-2022]: https://web.archive.org/web/20220601174558/https://www.nytimes.com/2022/05/09/crosswords/a-note-about-todays-wordle-game.html
[nyt-editor-2022]: https://web.archive.org/web/20221202155854/https://www.nytimes.com/2022/11/07/crosswords/wordle-editor.html
[wordle-original]: https://web.archive.org/web/20220116001049/https://www.powerlanguage.co.uk/wordle/
[li-games]: https://www.linkedin.com/help/linkedin/answer/a6863543
[li-faq]: https://www.linkedin.com/help/linkedin/answer/a6284860
[li-queens]: https://www.linkedin.com/help/linkedin/answer/a6269510
[li-pinpoint]: https://www.linkedin.com/help/linkedin/answer/a6264504
[li-streaks]: https://www.linkedin.com/help/linkedin/answer/a6296670
[apple-puzzles-guide]: https://support.apple.com/guide/iphone/find-puzzles-in-apple-news-iph4883822da/ios
[apple-emoji-guide]: https://support.apple.com/guide/iphone/play-emoji-game-iphd419e8234/ios
[apple-news-plus]: https://www.apple.com/apple-news/
[apple-nr-quartiles]: https://www.apple.com/newsroom/2024/05/apple-news-plus-introduces-quartiles-a-new-game-and-offline-mode-for-subscribers/
[apple-nr-emoji]: https://www.apple.com/newsroom/2025/07/apple-news-plus-introduces-emoji-game/
[wp-20q]: https://en.wikipedia.org/w/index.php?title=Twenty_questions&oldid=1373060994
[idea-what]: /docs/IDEA.md#what-the-app-does
[idea-money]: /docs/IDEA.md#monetization

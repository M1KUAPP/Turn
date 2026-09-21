# Evidence for the top five ideas

Evidence from primary sources for the five ideas that Round 4 of the
[ideation log][ideation-r4] ranked highest: Hunch, Subtext, Flagged, SaySo,
and Earshot. Every source was read on September 22, 2026, so prices, rating
counts, and dates are as of that day; judgment starts with "Synthesis:".

Contents:

1.  [Method and coverage](#method-and-coverage)
1.  [Hunch, a daily 20-questions game](#hunch-a-daily-20-questions-game)
1.  [Subtext, tone tags for autistic and ADHD adults](#subtext-tone-tags-for-autistic-and-adhd-adults)
1.  [Flagged, a job-posting red-flag checker](#flagged-a-job-posting-red-flag-checker)
1.  [SaySo, an AAC phrase finder](#sayso-an-aac-phrase-finder)
1.  [Earshot, announcement alerts for Deaf and hard-of-hearing travelers](#earshot-announcement-alerts-for-deaf-and-hard-of-hearing-travelers)
1.  [Summary](#summary)

## Method and coverage

- **Apps.** The [iTunes Search API][itunes-api] found the apps, and one lookup
  call returned every app in the tables with the US store's `userRatingCount`,
  `averageUserRating`, `releaseDate`, and `currentVersionReleaseDate`.
  Averages are rounded to two decimals, and "Updated" is the current
  version's release date. The three calls used:

  ```text
  https://itunes.apple.com/search?term=<terms>&entity=software&country=us&limit=25
  https://itunes.apple.com/lookup?id=<id>,<id>&country=us
  https://itunes.apple.com/us/rss/customerreviews/page=<n>/id=<id>/sortby=mostrecent/json
  ```

- **Prices.** In-app purchases are copied from each app's App Store page,
  which gives each item's name and price but not always its billing period.
  No page listed more than ten items, so a list may be partial.
- **Reviews.** Quotes come from the App Store page, or from Apple's review
  feed for the app (the third call, up to ten pages of 50) when the page
  doesn't show them. Quotes are verbatim, with "…" where cut, and dates are
  as the page or feed shows them.
- **Communities.** Reddit's JSON and web pages returned a block page to
  `curl`, and WebFetch refused the domain, so subscriber counts are missing.
  Each subreddit's own description and pace come from its feed of the 100
  newest posts, and example posts from its search feed. Forum sizes come
  from each forum's own statistics, which count from its launch.
- **Studies and statistics.** First-party figures come from the body that
  publishes them. Peer-reviewed abstracts come from PubMed through NCBI's
  E-utilities, and preprints from the arXiv API.
- **Attention.** Wikipedia page views for September 2025 through August 2026
  come from the Wikimedia pageviews API, counting users only.
- **Gallery and Jev.** Gallery overlap comes from the
  [gallery notes][gallery], which read every tagline on September 22, 2026;
  their searches weren't re-run. Jev's limits come from the [Jev notes][jev];
  the [jaggedness page][ts-jagged] and the
  [choice consistency cookbook][cb-choice] were re-read.
- **Search.** No general web search was available, so pages were reached
  through known URLs, site navigation, and each site's own search.

[itunes-api]: https://performance-partners.apple.com/search-api
[gallery]: /docs/research/gallery-2026.md
[jev]: /docs/research/jev.md

## Hunch, a daily 20-questions game

**Competitors and built-in features.** Akinator and Mind Reader guess what
the player is thinking, the next four let the player ask instead, and the
last two sell daily puzzles.

| App                                          | Price and in-app purchases                                                           | US ratings | Average | Released   | Updated    |
| -------------------------------------------- | ------------------------------------------------------------------------------------ | ---------- | ------- | ---------- | ---------- |
| [Akinator][h-akinator]                       | Free; Premium potion $3.99; Geniz $0.99–$4.99; credits $1.99–$5.99                   | 422,100    | 4.63    | 2016-09-20 | 2026-09-14 |
| [Akinator VIP][h-akinator-vip]               | $3.99; Geniz $0.99–$4.99; credits $0.99–$5.99                                        | 3,856      | 4.36    | 2011-12-07 | 2026-08-10 |
| [20 Questions · Mind Reader][h-mind]         | Free; weekly $4.99; monthly $9.99; bundles "100" to "1000" $0.99–$4.99               | 418        | 4.13    | 2024-04-02 | 2026-06-15 |
| [20 Questions: Word Trivia Game][h-trivia]   | Free; Premium $0.99 a month or $9.99 a year; category packs $0.99; coins $0.99–$2.99 | 13         | 5.00    | 2025-05-27 | 2026-09-08 |
| [20 Questions: Guess & Win][h-guess]         | Free; none listed                                                                    | 19         | 3.42    | 2025-05-25 | 2026-08-23 |
| [HiddenFame:20 Questions Game][h-hiddenfame] | Free; 10 hints $0.99                                                                 | 3          | 5.00    | 2025-07-02 | 2026-07-15 |
| [20 Questions Game][h-chun]                  | Free, with ads; none listed                                                          | 10         | 1.80    | 2024-01-08 | 2025-10-08 |
| [NYT Games: Wordle & Crossword][h-nyt]       | Free; Games $5.99 or $4.99 a month; Crossword $6.99 and $39.99                       | 293,384    | 4.80    | 2009-03-27 | 2026-09-16 |
| [Everyday Puzzles: Mini Games][h-everyday]   | Free; Premium Forever $13.99–$19.99; VIP $9.99–$24.99                                | 30,492     | 4.75    | 2022-01-19 | 2026-09-03 |

- Akinator "can read your mind just like magic and tell you what character
  you are thinking of, just by asking a few questions", and its daily
  challenge asks players to "find the 5 mysterious characters"
  ([Akinator][h-akinator]).
- HiddenFame offers "Reverse-Akinator gameplay", where "The AI replies: Yes,
  No, Not only, or Unknown" ([HiddenFame][h-hiddenfame]). The Word Trivia
  Game's opponent "runs on-device using Apple's Foundation Models. When it
  cannot answer from stored on-device content, it looks up that entry on
  Wikipedia" ([Word Trivia Game][h-trivia]). The 20 Questions Game has a
  mode where "the AI has a secret phrase/word" ([20 Questions Game][h-chun]),
  and Guess & Win a "Singleplayer mode against the incredibly challenging AI"
  ([Guess & Win][h-guess]).
- None of those four player-asks apps mentions a daily or shared puzzle in
  its description ([HiddenFame][h-hiddenfame];
  [Word Trivia Game][h-trivia]; [20 Questions Game][h-chun];
  [Guess & Win][h-guess]).
- Built in: Apple News+ has "daily and archived crossword, crossword mini,
  Quartiles, sudoku, and Emoji Game puzzles", with streaks, Game Center
  leaderboards, and shared results that show time, rank, or moves: "Your
  answers aren't shown" ([iPhone User Guide][h-news-puzzles]). It costs
  "$12.99 per month" ([Apple News+][h-news-plus]).
- Built in: iOS 27's Siri AI (Beta) is "a conversational assistant with broad
  world knowledge", on the iPhone 15 Pro and later, in English first
  ([What's new in iOS 27][ios27]).
- Synthesis: No app found pairs a shared daily object with free-form player
  questions and a spoiler-free grid. The player-asks apps have 3 to 19
  ratings each, so the format is unproven rather than rejected. The Word
  Trivia Game shows that Apple's on-device model can answer players'
  questions at no cost per question, which weakens both the case for Jev and
  a $2.99 monthly price.

**What reviews say.**

- 20 Questions: Guess & Win, "Inaccurate AI", March 30, 2026: "After saying
  the animal was a mammal, it said it didn’t have four legs, or two legs. I
  asked if it mainly lived in the mountains or forest (2 separate questions)
  and it said “depends” on both. I then asked if it was nomadic and it said
  “depends” again. … It either is nomadic or it isn’t."
  ([review feed][h-guess-feed])
- The same app, "Not Accurate", June 15, 2025: "I asked was it in the home
  and it answered yes. I asked was it located in the living room, it answered
  no; kitchen, no and bedroom no. The answer ended up being a stapler. …
  Every game I played was similar." ([Guess & Win][h-guess])
- The 20 Questions Game, "Scam", January 31, 2024: "This app just pushed ads
  and doesn’t give you an answer". The developer replied that the ads "help
  cover some of the costs of the AI. There is a nontrivial cost to generating
  each question" ([20 Questions Game][h-chun]).
- 20 Questions · Mind Reader, "Pay to Play", April 25, 2025: "after that it
  says that it’s tired and asks for more energy. … As it turns out, you have
  to pay to play anymore games." ([Mind Reader][h-mind])
- Akinator VIP, "Daily challenges either buggy or rigged", April 8, 2023:
  "Its either buggy or rigged to keep you playing longer."
  ([Akinator VIP][h-akinator-vip])
- Contexto, where "The closer in meaning your guess is to the secret word, the
  hotter it gets" ([Contexto – The Original Game][h-contexto-orig]), drew
  "Nothing makes sense bc when i put in castle it said 90 but the answer was
  ISLAND" on November 17, 2022 ([review feed][h-contexto-orig-feed]).
  Another Contexto app drew "the grading makes no sense" on June 7, 2026
  ([review feed][h-contexto-feed]).
- On the other side, the Word Trivia Game, "Awesome!", May 29, 2025: "It
  takes all the ambiguity out of the game since you are handed a prompt and
  clues." ([Word Trivia Game][h-trivia])
- Synthesis: Players read a contradictory or hedged answer as a broken game,
  and a daily puzzle they can't solve as rigged. Hunch's "Hard to say" will
  draw the same "depends" complaint unless the fact card settles most
  questions.

**Demand signals.**

- Akinator has 422,100 US ratings and NYT Games 293,384
  ([Akinator][h-akinator]; [NYT Games][h-nyt]). On September 16, 2026, The New
  York Times Company said its Games team builds "communities that bring
  millions of people back to play every day" ([NYT Company][h-nytco]).
- r/Akinator calls itself "The Web Genie That can guess ANY characters you're
  thinking about!", and its 100 newest posts run from July 22 to September
  19, 2026 ([r/Akinator feed][h-rd-akinator]). r/20questions, which "plays
  like the game "20 Questions."", last posted on February 10, 2026
  ([r/20questions feed][h-rd-20q]).
- The 100 newest posts span 12 days on r/NYTConnections and 25 days on
  r/wordle, "A daily word game created by Josh Wardle"
  ([r/NYTConnections feed][h-rd-conn]; [r/wordle feed][h-rd-wordle]).
- From September 2025 through August 2026, Wikipedia's "Twenty questions"
  article drew 59,786 views and "Akinator" drew 95,187, against 8,690,015
  for "Wordle" ([Twenty questions views][h-wp-20q];
  [Akinator views][h-wp-aki]; [Wordle views][h-wp-wordle]).
- Synthesis: The daily habit and the guessing genre are both proven at
  scale; the untested part is players asking and an AI answering.

**Jev limits.**

- Jev "answers the question you wrote, not the one you meant", reading
  "Scoping words, negations, and implied conditions" at face value
  ([jaggedness page][ts-jagged]). Every Hunch question is free-form player
  text.
- A question and its negation needn't agree: a refund question and its
  negation scored 0.72 and 0.47, a sum of 1.19, and TypeSafe advises "don't
  hold the model to arithmetic identities between separate questions"
  ([jaggedness page][ts-jagged]).
- On one borderline post asked 15 times, "TypeSafe flips on 2 of the 8
  questions" ([choice consistency cookbook][cb-choice]). The jaggedness page
  still calls Jev "extremely consistent" for "semantically similar inputs"
  ([jaggedness page][ts-jagged]).
- Jev "does not count reliably. This covers characters in a word", and "Jev
  is not a calculator" ([jaggedness page][ts-jagged]). Questions with double
  negatives or several hops "are answered less reliably"
  ([Jev notes][jev-limits]).
- English is "where accuracy is currently best" ([Jev notes][jev-lang]), and
  TypeSafe says "no part of the Services is directed to children"
  ([Jev notes][jev-store]).
- Synthesis: Every player has to get the same answer to the same question on
  the same day, or they'll compare grids and call it rigged. Cache the first
  answer per normalized question and object, answer letter and size
  questions from card fields in code, and test negated pairs before a card
  ships.

**Gallery overlap.**

- Games make up 148 of the 1,115 projects, 11 projects name Best Game, and
  the word and trivia cluster has 15 ([gallery totals][gallery-totals];
  [other categories][gallery-other]; [clusters][gallery-clusters]).
- The closest taglines: Terravel, "One hidden place on Earth, every day.
  Guess it, pin it, fly there."; Das Verhör, "A daily German deduction game
  where on-device AI speaks for the suspects but…"; and Machine Charades,
  "You write the clue. A language model has to guess the word."
  ([project list][gallery-list])
- The ideation log placed Hunch "among 15 word games though none takes
  free-form questions" ([ideation log][ideation-r3]); that rests on taglines.
- Das Verhör's own project page, read on September 22, 2026, goes further
  than its tagline: "Each day one new case lands on the table: one location,
  three suspects, fourteen questions — and a single contradiction that
  decides everything", and "You question the suspects in free text". It is a
  "daily deduction game for iPhone, in German", in which "Apple's on-device
  Foundation Models only _phrase_ what the engine has already decided", with
  "39 cases, one a day, 23 September through 31 October 2026". Fairness is
  its headline: the builder asked how to "ship a _provably fair_ one, every
  day, forever", and "A deterministic Swift engine owns everything that
  matters — the facts, the timeline, every contradiction, the verdict". The
  page doesn't say whether reworded questions get the same answer
  ([Das Verhör][h-dasverhor]).
- Synthesis: Terravel already has the daily hidden answer, and Das Verhör
  already has a daily puzzle questioned in free text, built for fairness,
  though in German and as fourteen questions to three suspects. Hunch's
  difference is narrower than a new format: English, and yes-or-no questions
  about one hidden thing. Consistent answers are something Hunch has to
  measure and show, not something the rival is known to lack. Its demo has
  to show a typed question answered in its first seconds.

[h-akinator]: https://apps.apple.com/us/app/akinator/id933135994
[h-akinator-vip]: https://apps.apple.com/us/app/akinator-vip/id484090401
[h-mind]: https://apps.apple.com/us/app/20-questions-mind-reader/id6477538210
[h-trivia]: https://apps.apple.com/us/app/20-questions-word-trivia-game/id6746292005
[h-guess]: https://apps.apple.com/us/app/20-questions-guess-win/id6746064533
[h-hiddenfame]: https://apps.apple.com/us/app/hiddenfame-20-questions-game/id6747639211
[h-chun]: https://apps.apple.com/us/app/20-questions-game/id6475321661
[h-nyt]: https://apps.apple.com/us/app/nyt-games-wordle-crossword/id307569751
[h-everyday]: https://apps.apple.com/us/app/everyday-puzzles-mini-games/id1580601028
[h-news-puzzles]: https://support.apple.com/guide/iphone/find-puzzles-in-apple-news-iph4883822da/ios
[h-news-plus]: https://www.apple.com/apple-news/
[h-guess-feed]: https://itunes.apple.com/us/rss/customerreviews/page=1/id=6746064533/sortby=mostrecent/json
[h-contexto-orig]: https://apps.apple.com/us/app/contexto-the-original-game/id1636455908
[h-contexto-orig-feed]: https://itunes.apple.com/us/rss/customerreviews/page=1/id=1636455908/sortby=mostrecent/json
[h-contexto-feed]: https://itunes.apple.com/us/rss/customerreviews/page=1/id=6444560675/sortby=mostrecent/json
[h-nytco]: https://www.nytco.com/press/jonathan-knight-promoted-to-chief-games-officer/
[h-rd-akinator]: https://www.reddit.com/r/Akinator/new/.rss?limit=100
[h-rd-20q]: https://www.reddit.com/r/20questions/new/.rss?limit=100
[h-rd-conn]: https://www.reddit.com/r/NYTConnections/new/.rss?limit=100
[h-rd-wordle]: https://www.reddit.com/r/wordle/new/.rss?limit=100
[h-wp-20q]: https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Twenty_questions/monthly/2025090100/2026083100
[h-wp-aki]: https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Akinator/monthly/2025090100/2026083100
[h-wp-wordle]: https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Wordle/monthly/2025090100/2026083100
[gallery-totals]: /docs/research/gallery-2026.md#gallery-totals
[ideation-r3]: /docs/research/ideation.md#round-3-screening
[h-dasverhor]: https://devpost.com/software/das-verhor-the-interrogation

## Subtext, tone tags for autistic and ADHD adults

**Competitors and built-in features.** The first two apps share Subtext's
name, Gut Feel, Converso, and ChatScope decode messages for dating and
relationships, and ChatGPT stands for the general assistants.

| App                                         | Price and in-app purchases                                        | US ratings | Average | Released   | Updated    |
| ------------------------------------------- | ----------------------------------------------------------------- | ---------- | ------- | ---------- | ---------- |
| [Subtext: Decode Messages][s-alpha]         | Free; none listed                                                 | 0          | None    | 2026-08-13 | 2026-08-19 |
| [Subtext: Decode Their Texts][s-aura]       | Free; $4.99 weekly, $9.99 monthly, $49.99 yearly                  | 0          | None    | 2026-05-11 | 2026-06-06 |
| [Goblin Tools][s-goblin]                    | $1.99; Pro $3.99 monthly or $39.99 yearly                         | 3,007      | 4.76    | 2023-05-31 | 2026-08-23 |
| [Tonally: Tone Tag for iMessage][s-tonally] | Free; none listed                                                 | 0          | None    | 2024-03-29 | 2025-03-02 |
| [Gut Feel - Dating Text Decoder][s-gutfeel] | Free; weekly $14.99–$18.99; yearly $34.99; also $9.99 and $29.99  | 30         | 4.73    | 2026-08-09 | 2026-09-13 |
| [Converso: Red Flag Analyzer][s-converso]   | Free; weekly $4.99–$7.99; monthly $12.99–$14.99; yearly to $69.99 | 162        | 4.57    | 2025-12-18 | 2026-07-29 |
| [ChatScope: Message Analysis][s-chatscope]  | Free; weekly $4.99–$9.99; monthly $14.99–$17.99; annual to $49.99 | 95         | 4.47    | 2025-05-21 | 2026-08-16 |
| [ChatGPT][chatgpt]                          | Free; Go $8.00; Plus $19.99; Pro $100.00 and $200.00              | 10,509,652 | 4.83    | 2023-05-18 | 2026-09-18 |

- Subtext: Decode Messages says: "Subtext is a communication tool built for
  autistic adults." It shows "the plain meaning, then 2–3 possible readings
  with how likely each one is, the tone, and what the sender probably
  expects", and its advisors "are paid, credited, and hold veto power"
  ([Subtext: Decode Messages][s-alpha]).
- Twelve of the 24 search results for "subtext" have names starting with
  "Subtext", and at least six of those decode messages: besides the two
  above, SubText AI, Subtext - Read Between Lines, Subtext: AI Chat Analyzer,
  and Subtext: Text & Chat Analyzer, none with more than 3 ratings. The plain
  name belongs to a text editor with 82 ratings ([search results][s-search];
  [Subtext][s-lockwood]).
- Goblin Tools' Judge gives "a second opinion on the mood, emotion, or intent
  behind a message", in an app "Created with neurodivergent people in mind";
  its page showed it at "#1" in the Productivity chart
  ([Goblin Tools][s-goblin]).
- Tonally: "Tone can be hard to comprehend in text messages … But with the
  growing number of tone tags in use, it's difficult for anyone to memorize
  all of them." ([Tonally][s-tonally])
- Built in: none of the 966 entries in the iOS 27 iPhone User Guide's
  contents is about the tone, mood, or intent of a message; the nearest are
  notification summaries and Writing Tools ([iPhone User Guide][iphone-guide]).
  Siri AI (Beta) can "ask questions, take action, and search based on what's
  on your iPhone screen" ([Siri AI][siri-screen]), and its writing tools
  "adjust the style and tone of your writing" ([What's new in iOS 27][ios27]).
- Synthesis: Subtext's promise, audience, and name already belong to a free
  app launched on August 13, 2026, half a dozen same-named decoders crowd the
  search, and Goblin Tools covers the check for a one-time $1.99. A general
  assistant, ChatGPT or Siri AI, is one paste away.

**What reviews say.**

- Goblin Tools, May 19, 2026: "I have often struggled with my tone in emails
  or reading tone in received messages. … It also allows me to tone check
  items." ([review feed][s-goblin-feed])
- Goblin Tools, April 2, 2026: "As someone who was recently diagnosed with
  Autism … It also lets you input messages and responses to determine the
  emotion and meaning of the message from others if you can’t understand!"
  ([review feed][s-goblin-feed])
- Goblin Tools, February 27, 2025: "And it to show that they truly understand
  neurodivergence, there is no subscription! It is a one time nominal fee!"
  ([review feed][s-goblin-feed])
- Goblin Tools' feed holds 500 reviews, 76 of them one or two stars. Most
  low ratings from January to June 2026 are about crashes, and every one-star
  review since August 21, 2026 is about the new Pro subscription: "The
  developer has moved the app to subscription, booting users who paid
  before. Rated one star for their greed." (September 6, 2026)
  ([review feed][s-goblin-feed])
- Converso, "Too expensive", July 6, 2026: "It’s too expensive for all you
  get". On January 2, 2026: "If you need to use the app you gotta wage your
  money on some dumb subscription and you can’t get out of it"
  ([Converso][s-converso]).
- Gut Feel, September 19, 2026: "My wife has all these mysterious texts that
  I don’t get what she meant under the tone, this app has really helped me"
  ([Gut Feel][s-gutfeel]).
- Synthesis: Neurodivergent reviewers praise tone checks and a one-time
  price, while subscription complaints dominate the paid decoders.

**Demand signals.**

- CDC researchers estimated that 5,437,988 US adults (2.21%) had autism in
  2017 ([Dietz et al., 2020][s-dietz]), and that 15.5 million US adults
  (6.0%) had a current ADHD diagnosis in 2023
  ([Staley et al., 2024][s-staley]).
- A meta-analysis of 41 studies found poorer figurative-language
  comprehension in autism (Hedges' g = -0.57), but the differences "were
  small and nonsignificant when the groups were matched based on the
  language ability", and the gap was wider for metaphors than for irony and
  sarcasm ([Kalandadze et al., 2018][s-kalandadze]).
- Autistic adults reading narratives "did not differentiate between the
  emotional responses for victims or protagonists following ironic versus
  literal criticism" ([Barzy et al., 2020][s-barzy]).
- The counterweight: "autistic people share information with other autistic
  people as well as non-autistic people do with other non-autistic people",
  while mixed groups share "much less information"
  ([Crompton et al., 2020][s-crompton]).
- Language models already fill the role. In a CHI 2024 study, 11 autistic
  participants "strongly preferred LLM over confederate interactions", while
  a job coach said the LLM was "dispensing questionable advice"
  ([CHI 2024 paper][s-chi]). A 2026 analysis of 3,984 posts by
  self-identified autistic users found ChatGPT used to "translate
  neurotypical communication", with risks such as "erasing authentic identity
  through automated masking" ([extended abstract][s-humanize]). A preprint
  texting prototype, TwIPS, "provides a better alternative to tone
  indicators" for its 8 participants ([TwIPS preprint][s-twips]).
- A community guide to tone indicators says they "came about as a way for
  neurodivergent people to be able to understand tone through text"
  ([tone indicators guide][s-carrd]). Wikipedia's "Tone indicator" article
  drew 58,732 views from September 2025 through August 2026
  ([page views][s-wp-tone]).
- r/ADHD says "Nearly two million users say they 'feel at home'", and its
  100 newest posts span 23 hours; r/autism's span 18 hours and
  r/AutisticAdults' 70 hours ([r/ADHD feed][s-rd-adhd];
  [r/autism feed][s-rd-autism]; [r/AutisticAdults feed][s-rd-aa]).
  r/AutisticAdults adds: "If you are here to promote a product, seek an
  audience … please read our community guide carefully before posting."
- Example posts: "Does anyone else REALLY struggle with understanding what
  people are saying on text" (r/autism, September 5, 2026) and "I’m bad at
  texting and it gives me anxiety. Help!" (r/ADHD, September 20, 2026)
  ([r/autism search][s-rd-autism-search]; [r/ADHD search][s-rd-adhd-search]).
- Synthesis: The need is documented and large, but the studies disagree on
  whose difficulty it is, and the people who have it already paste messages
  into general chatbots.

**Jev limits.**

- "Content written to adversarially steer the model, whether that is an
  injected instruction, a deliberately misleading framing, or text that
  argues for its own classification, can move the answer"
  ([jaggedness page][ts-jagged]).
- Jev "can be quite literal in its understanding"
  ([jaggedness page][ts-jagged]). None of the cookbooks in the Jev notes
  covers tone or sarcasm in personal messages ([Jev notes][jev-cookbooks]);
  the nearest listed use is to "Detect urgency, frustration, churn risk, and
  refund requests" in customer support ([Jev notes][jev-uses]).
- Borderline picks flip between identical calls, "TypeSafe flips on 2 of the
  8 questions" ([choice consistency cookbook][cb-choice]), and a Noul and its
  negation needn't sum to 1 ([jaggedness page][ts-jagged]).
- Choice probabilities "always add up to 1, so a line ranks first even when
  none answer the query" ([Jev notes][jev-gotchas]).
- "Jev currently accepts text input only" ([Jev notes][jev-what]), and
  English is "where accuracy is currently best" ([Jev notes][jev-lang]).
- The MCA makes the customer warrant it "has obtained … all rights,
  consents, and permissions necessary" for TypeSafe's use of Input
  ([Jev notes][jev-terms]), and Apple's guideline 5.1.2(i) asks for
  "explicit permission" before personal data goes to third-party AI
  ([Jev notes][jev-store]).
- Synthesis: The hard cases, such as a passive-aggressive "No worries, I'm
  fine", are messages that argue for their own tone, which is the failure
  mode TypeSafe names. Show "can't tell" whenever the tags disagree or sit
  near 0.5, cache each message's tags, and ask users to confirm they may
  share the sender's words.

**Gallery overlap.**

- Third Eye: AI Chat Analyzer ("Third Eye reads a chat you already had in a
  unique way and tells you what it…"), VibeCheck, and ReplyRight ("Turn
  difficult messages into the right reply…") sit in the friends and social
  apps cluster ([project list][gallery-list]).
- The entries that name ADHD or neurodivergent users are planners and a
  cooking app: ADHDFlow, Adi, and Scran ([project list][gallery-list]).
- 39 projects name the Peace Prize ([other categories][gallery-other]).
- Synthesis: Moderate overlap. Third Eye reads chats, but no tagline pitches
  autistic or ADHD readers.

[s-alpha]: https://apps.apple.com/us/app/subtext-decode-messages/id6795802856
[s-aura]: https://apps.apple.com/us/app/subtext-decode-their-texts/id6767282250
[s-goblin]: https://apps.apple.com/us/app/goblin-tools/id6449003064
[s-tonally]: https://apps.apple.com/us/app/tonally-tone-tag-for-imessage/id6480206466
[s-gutfeel]: https://apps.apple.com/us/app/gut-feel-dating-text-decoder/id6792379872
[s-converso]: https://apps.apple.com/us/app/converso-red-flag-analyzer/id6756186886
[s-chatscope]: https://apps.apple.com/us/app/chatscope-message-analysis/id6745802989
[s-search]: https://itunes.apple.com/search?term=subtext&entity=software&country=us&limit=25
[s-lockwood]: https://apps.apple.com/us/app/subtext/id1606625287
[s-goblin-feed]: https://itunes.apple.com/us/rss/customerreviews/page=1/id=6449003064/sortby=mostrecent/json
[s-dietz]: https://pubmed.ncbi.nlm.nih.gov/32390121/
[s-staley]: https://pubmed.ncbi.nlm.nih.gov/39388378/
[s-kalandadze]: https://pubmed.ncbi.nlm.nih.gov/27899711/
[s-barzy]: https://pubmed.ncbi.nlm.nih.gov/32017394/
[s-crompton]: https://pubmed.ncbi.nlm.nih.gov/32431157/
[s-chi]: https://arxiv.org/abs/2403.03297
[s-humanize]: https://arxiv.org/abs/2601.17946
[s-twips]: https://arxiv.org/abs/2407.17760
[s-carrd]: https://toneindicators.carrd.co/
[s-wp-tone]: https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Tone_indicator/monthly/2025090100/2026083100
[s-rd-adhd]: https://www.reddit.com/r/ADHD/new/.rss?limit=100
[s-rd-autism]: https://www.reddit.com/r/autism/new/.rss?limit=100
[s-rd-aa]: https://www.reddit.com/r/AutisticAdults/new/.rss?limit=100
[s-rd-autism-search]: https://www.reddit.com/r/autism/search.rss?q=tone+text&restrict_sr=on&sort=new&limit=100&t=year
[s-rd-adhd-search]: https://www.reddit.com/r/ADHD/search.rss?q=tone+text+message&restrict_sr=on&sort=new&limit=100&t=year
[iphone-guide]: https://support.apple.com/guide/iphone/welcome/ios
[jev-uses]: /docs/research/jev.md#use-cases-the-docs-list

## Flagged, a job-posting red-flag checker

**Competitors and built-in features.** Security brands sell general scam
checkers; one new app targets ghost jobs.

| App                                       | Price and in-app purchases                                                             | US ratings | Average | Released   | Updated    |
| ----------------------------------------- | -------------------------------------------------------------------------------------- | ---------- | ------- | ---------- | ---------- |
| [Trend Micro ScamCheck][f-scamcheck]      | Free; $1.99 or $6.99 monthly; $19.99 or $59.99 yearly                                  | 2,338      | 4.57    | 2022-02-05 | 2026-09-10 |
| [Malwarebytes - Mobile Security][f-mb]    | Free; Standard $2.49 and $19.99; Plus $44.99; Advanced $139.99                         | 109,547    | 4.53    | 2018-08-06 | 2026-09-15 |
| [McAfee: Stay Secure & Private][f-mcafee] | Free; $2.99–$19.99 monthly; $29.99–$199.99 yearly                                      | 238,128    | 4.72    | 2014-01-08 | 2026-08-31 |
| [Guardio - Mobile Security][f-guardio]    | Free; $12.99–$14.99 monthly; $119.99 yearly                                            | 42,567     | 4.85    | 2022-11-27 | 2026-09-18 |
| [StopScam: AI Scam Detector][f-stopscam]  | Free; $6.99 weekly; $4.99–$9.99 monthly; $29.99–$59.99 yearly; lifetime $39.99–$249.99 | 87         | 4.76    | 2025-02-19 | 2026-09-20 |
| [Gini Help: AI Scam Protection][f-gini]   | Free; $4.99–$9.99 monthly; $49.99–$79.99 yearly                                        | 59         | 4.61    | 2025-12-03 | 2026-09-21 |
| [Ghost Job Tracker][f-ghost]              | Free; Ghost Tracker Pro $4.99                                                          | 0          | None    | 2026-07-30 | 2026-07-30 |
| [ChatGPT][chatgpt]                        | Free; Go $8.00; Plus $19.99; Pro $100.00 and $200.00                                   | 10,509,652 | 4.83    | 2023-05-18 | 2026-09-18 |

- Trend Micro ScamCheck: "Instantly analyze suspicious phone numbers,
  websites, emails, text messages, video links (Facebook, X, TikTok), and
  images. Simply ask our AI to check if something is a scam."
  ([ScamCheck][f-scamcheck])
- StopScam: "Paste a suspicious message, email or complete link", and its
  checks "look for warning signs such as unusual payment requests, pressure
  to act and suspicious wording" ([StopScam][f-stopscam]). Malwarebytes: "Tap
  Share in any app to send a link, image, or message straight to Scam Guard
  for an instant safety check." ([Malwarebytes][f-mb])
- Ghost Job Tracker, released July 30, 2026: "Paste any job description and
  get a 0-100 ghost-risk score, computed entirely on your device", from
  signals such as "missing salary range, "always hiring" language, buzzword
  density, no human contact, stale posting age" ([Ghost Job Tracker][f-ghost]).
- Browser extensions: the Chrome Web Store's first page for "job scam" lists
  nine detectors. Their pages show 3 to 52 users each, except an Upwork
  checker with 1,000 ([search results][f-cws-scam];
  [DoubleCheck][f-cws-doublecheck]; [UDECISION AI][f-cws-udecision]). The
  first page for "ghost job" lists ten; the largest of the four opened,
  Ghost Job & Stale Listing Flag, has 645 users ([search results][f-cws-ghost];
  [Ghost Job & Stale Listing Flag][f-cws-stale]).
- Built in: Messages can "Screen Unknown Senders" and sort unknown texts into
  "Transactions and Promotions" ([iPhone User Guide][f-apple-filter]), and
  Siri AI (Beta) answers questions about what's on screen
  ([Siri AI][siri-screen]).
- Synthesis: Scam checking is a commodity, bundled by security brands with
  call and text blocking. Apart from Ghost Job Tracker's ghost-risk score, no
  iOS app found checks job postings for scams, and the desktop extensions
  that do have few users.

**What reviews say.**

- StopScam, "Caught a Scam Just in Time", May 6, 2025: "This app flagged a
  fake job offer before I responded. Lifesaver!"
  ([review feed][f-stopscam-feed]) Another reviewer, March 17, 2025: "I often
  get random job offers and strange payment requests."
  ([StopScam][f-stopscam])
- Trend Micro ScamCheck, June 16, 2023: "after simply trying to apply for a
  job, it seemed to have opened up the floodgates for spammers and scammers
  to my email … I wish there were a safer means in which to inform oneself
  of available, legitimate employment" ([ScamCheck][f-scamcheck]).
- Trend Micro ScamCheck, "Blocks known contacts", February 14, 2024: "It’s
  not context aware at all it seems. Deleted this app , can’t trust it to be
  accurate." ([review feed][f-scamcheck-feed])
- Malwarebytes, August 31, 2026: "Fake alerts that scare you into thinking
  your data is at risk… I do not appreciate that."
  ([review feed][f-mb-feed])
- Synthesis: Job seekers already paste offers into general scam checkers,
  and trust breaks on false alarms and fear-driven upsells.

**Demand signals.**

- FTC reports of "Job Scams & Employment Agencies" rose from 71,562 in 2022
  to 85,533 in 2023 and 104,946 in 2024. The wider "Business and Job
  Opportunities" category had 126,217 fraud reports in 2024; 36% reported a
  loss, $751 million in all, with a median of $2,250
  ([FTC Data Book 2024][f-csn]).
- The FTC's December 12, 2024 spotlight: "Reported losses to job scams
  increased more than threefold from 2020 to 2023 and, in just the first half
  of 2024, topped $220 million." Task scams drew "About 20,000" reports in
  that half-year, "compared to about 5,000 in all of 2023", and typically
  start with "an unexpected text or WhatsApp message offering online work but
  no specifics". Its advice: "Real employers will never contact you that
  way." ([FTC spotlight][f-ftc-task])
- An April 2026 FTC spotlight: "One in three people who reported losing money
  to a job or business opportunity scam in 2025 said it started on social
  media." ([FTC spotlight][f-ftc-social])
- The FBI's IC3 logged employment complaints of 15,443 in 2023, 20,044 in
  2024, and 24,688 in 2025, with losses of $70.2 million, $264.2 million,
  and $362.9 million. "In 2025, victims reported losses of almost $13 million
  to AI-involved employment type scams." ([IC3 2025 report][f-ic3])
- Ghost jobs: since January 1, 2026, Ontario employers with 25 or more
  employees must put "a statement disclosing whether a vacancy exists or not"
  in public job postings and tell interviewed applicants "whether they have
  made a hiring decision" within 45 days. Job boards must offer "A mechanism
  or procedure for users of the platform to report fraudulent publicly
  advertised job postings" ([Ontario ESA guide][f-ontario]). Wikipedia's
  "Ghost job" article drew 38,644 views from September 2025 through August
  2026 ([page views][f-wp-ghost]).
- r/recruitinghell asks: "Did a recruiter make you send them a resume and
  still fill out all the same information on their website?"; its 100 newest
  posts span 34 hours, r/jobs' 35 hours, and r/Scams' 112 hours
  ([r/recruitinghell feed][f-rd-rh]; [r/jobs feed][f-rd-jobs];
  [r/Scams feed][f-rd-scams]).
- A search of r/Scams for "job" returns 100 posts from August 7 to September
  21, 2026, among them "(UK) Ghosted by job, then WhatsApped." and "[US]
  Emailed about a job application, told to download an app for interview"
  ([r/Scams search][f-rd-scams-job]).
- Synthesis: The harm is large, growing, and counted by the two agencies
  that own the data, and the FTC's warning signs match Flagged's checks.

**Jev limits.**

- Adversarial content is Jev's documented weak spot: "a deliberately
  misleading framing, or text that argues for its own classification, can
  move the answer" ([jaggedness page][ts-jagged]).
- "Jev is not a calculator", and it "reads dates as text, not as ordered
  quantities" ([jaggedness page][ts-jagged]).
- "Accuracy falls as the state grows with content unrelated to the
  decision" ([Jev notes][jev-limits]). A Choice can rank "up to 255 lines in
  one request" ([Jev notes][jev-cookbooks]) but always picks one, so a "none"
  option is needed ([Jev notes][jev-gotchas]).
- "Jev guarantees the shape of its answers, not that every decision is
  correct" ([Jev notes][jev-limits]). The MCA warns the services "MAY PRODUCE
  INACCURATE OR ERRONEOUS OUTPUT", and the customer defends TypeSafe against
  claims "brought by an End User" ([Jev notes][jev-terms]).
- English is "where accuracy is currently best" ([Jev notes][jev-lang]).
- Synthesis: Scam postings are written to argue for their own legitimacy, so
  ask narrow, literal questions per line, compute pay floors and posting
  ages in code, and never show "safe", only "no red flags found".

**Gallery overlap.**

- Safety, privacy, and scams has 20 projects ([clusters][gallery-clusters]),
  including CyberShield AI ("Scams hide in every link, text, and QR
  code…"), ScamLens, Sently, Shipguard AI, Pluis, and Khoan Đã. None of
  their taglines names job postings ([project list][gallery-list]).
- Jobs, interviews, and speaking has 14, mostly interview and CV tools such
  as Hovvac and JobsPuzzle ("The honest job app: tailored CVs and cover
  letters for office roles, and a…") ([clusters][gallery-clusters];
  [project list][gallery-list]).
- 24 projects name #BuildInPublic ([other categories][gallery-other]).
- Synthesis: The scam cluster is busy but generic, so a job-only checker is
  still open in the gallery, though not on the Chrome Web Store.

[f-scamcheck]: https://apps.apple.com/us/app/trend-micro-scamcheck/id1566099565
[f-mb]: https://apps.apple.com/us/app/malwarebytes-mobile-security/id1327105431
[f-mcafee]: https://apps.apple.com/us/app/mcafee-stay-secure-private/id724596345
[f-guardio]: https://apps.apple.com/us/app/guardio-mobile-security/id1640981560
[f-stopscam]: https://apps.apple.com/us/app/stopscam-ai-scam-detector/id6741771102
[f-gini]: https://apps.apple.com/us/app/gini-help-ai-scam-protection/id6749169860
[f-ghost]: https://apps.apple.com/us/app/ghost-job-tracker/id6791141204
[f-cws-scam]: https://chromewebstore.google.com/search/job%20scam
[f-cws-doublecheck]: https://chromewebstore.google.com/detail/doublecheck-scam-fake-job/bibhhpbnlbeeiahjigdahkgdgeidmkah
[f-cws-udecision]: https://chromewebstore.google.com/detail/udecision-ai-%E2%80%93-upwork-job/ndffjgebgdfoenfpcdgookgbaacnmkol
[f-cws-ghost]: https://chromewebstore.google.com/search/ghost%20job
[f-cws-stale]: https://chromewebstore.google.com/detail/ghost-job-stale-listing-f/njdkeephhfkemmjfajbogjmbdhnaaplk
[f-apple-filter]: https://support.apple.com/guide/iphone/screen-and-filter-texts-iph203ab0be4/ios
[f-stopscam-feed]: https://itunes.apple.com/us/rss/customerreviews/page=1/id=6741771102/sortby=mostrecent/json
[f-scamcheck-feed]: https://itunes.apple.com/us/rss/customerreviews/page=1/id=1566099565/sortby=mostrecent/json
[f-mb-feed]: https://itunes.apple.com/us/rss/customerreviews/page=1/id=1327105431/sortby=mostrecent/json
[f-csn]: https://www.ftc.gov/system/files/ftc_gov/pdf/csn-annual-data-book-2024.pdf
[f-ftc-task]: https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2024/12/paying-get-paid-gamified-job-scams-drive-record-losses
[f-ftc-social]: https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2026/04/reported-losses-scams-social-media-eight-times-higher-2020
[f-ic3]: https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf
[f-ontario]: https://www.ontario.ca/document/your-guide-employment-standards-act-0/requirements-related-publicly-advertised-job
[f-wp-ghost]: https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Ghost_job/monthly/2025090100/2026083100
[f-rd-rh]: https://www.reddit.com/r/recruitinghell/new/.rss?limit=100
[f-rd-jobs]: https://www.reddit.com/r/jobs/new/.rss?limit=100
[f-rd-scams]: https://www.reddit.com/r/Scams/new/.rss?limit=100
[f-rd-scams-job]: https://www.reddit.com/r/Scams/search.rss?q=job&restrict_sr=on&sort=new&limit=100&t=year

## SaySo, an AAC phrase finder

**Competitors and built-in features.** The established text-based AAC apps
are one-time purchases; Proloquo2Go, a symbol app, is listed for its price.

| App                                  | Price and in-app purchases                                               | US ratings | Average | Released   | Updated    |
| ------------------------------------ | ------------------------------------------------------------------------ | ---------- | ------- | ---------- | ---------- |
| [Proloquo4Text AAC][y-p4t]           | $119.99; none listed                                                     | 925        | 4.73    | 2013-11-26 | 2026-04-28 |
| [Predictable][y-predictable]         | $159.99; none listed                                                     | 203        | 4.48    | 2011-01-06 | 2026-09-18 |
| [Speech Assistant AAC][y-sa]         | $24.99; none listed                                                      | 103        | 4.56    | 2016-09-03 | 2026-09-13 |
| [Proloquo2Go AAC][y-p2g]             | $249.99; Gateway vocabulary $149.99                                      | 12,121     | 4.77    | 2009-04-21 | 2026-07-22 |
| [Proloquo][y-proloquo]               | Free; $9.99 monthly or $99.99 yearly                                     | 145        | 3.93    | 2022-03-07 | 2026-08-31 |
| [Spoken - Tap to Talk AAC][y-spoken] | Free; $6.49 monthly; Premium $12.99–$99.99; lifetime $124.99 and $249.00 | 160        | 4.31    | 2019-11-28 | 2025-11-19 |
| [Text to Speech!][y-tts]             | Free; Remove Advertisements $9.99                                        | 33,307     | 4.64    | 2013-09-27 | 2026-09-17 |
| [TypingTalk AAC][y-typing]           | Free; donations $0.99–$7.99                                              | 16         | 4.88    | 2025-01-30 | 2026-09-07 |
| [Weave Chat AAC][y-weave]            | Free; none listed                                                        | 521        | 4.67    | 2021-09-23 | 2026-09-16 |

- Built in: Live Speech speaks "what you type … during in-person
  conversations and in apps like FaceTime", with "dozens of system voices or
  … a Personal Voice you create". It saves phrases in "custom categories like
  school or work", keeps "Recent" phrases, and offers "suggested words that
  appear above the keyboard as you type" ([Type to speak][y-live-speech]).
  Apple also lists Personal Voice and Vocal Shortcuts among its speech
  features ([speech features][y-speech]).
- Proloquo4Text calls itself "the leading AAC solution for literate adults,
  teens and children", with saved phrases, "self-learning PolyPredix™ word
  prediction", and "sentence prediction" ([Proloquo4Text][y-p4t]).
- Speech Assistant AAC has an "Autocomplete feature to display phrase
  suggestions in a drop-down list" and "a one-time payment and no
  subscription" ([Speech Assistant AAC][y-sa]). Spoken's "speech engine
  learns the way you talk, offering word suggestions that match your style"
  ([Spoken][y-spoken]).
- Synthesis: Word, sentence, and prefix prediction are standard, and Live
  Speech is free and one triple-click away. No description read ranks a
  user's own phrases by meaning from a few letters, which is SaySo's only
  edge.

**What reviews say.**

- Spoken, "Native iOS “live speech” feature is more functional", May 19,
  2026: "all “premium” functionality became paywalled. What little
  functionality was there is already less functional than the stock iOS live
  speech functionality." ([review feed][y-spoken-feed])
- Spoken, "Not Intuitive", July 5, 2024: "I find the idea of paying an
  ongoing subscription fee in order to access basic communication to
  repugnant. … The expectation that one can have their voice taken away at
  any time if they can no longer afford it is not."
  ([review feed][y-spoken-feed])
- Spoken, "Greedy Developers smh", July 27, 2023: "Putting this kind of
  paywall on disabled people is shameful." ([review feed][y-spoken-feed])
- Predictable, July 18, 2026: "it takes forever before it will say anything
  I write when I tap the speaker … It was awful trying to have a conversation
  with my cancer dr yesterday." The same reviewer adds that "it changed by
  layout and it won’t let me change it back" ([Predictable][y-predictable]).
- Speech Assistant AAC, "ALS speech disabled", September 4, 2023: "Love that
  I can save so many phrases … The app “guesses” are wildly wrong"
  ([Speech Assistant AAC][y-sa]).
- Text to Speech!, "Life Changing", September 5, 2025: "I recently had my
  vocal cords removed … I can type phrases ahead of time … The only drawback
  is sometimes advertisements pop up during a conversation"
  ([Text to Speech!][y-tts]).
- Speech Assistant AAC, August 11, 2026: "wish the voice would automatically
  change depending on which keyboard I’m using like apple live speech does"
  ([review feed][y-sa-feed]).
- Predictable, July 30, 2024: "I can no longer walk, talk, use my hands or
  even breathe on my own. This tool is my one and only tool to communicate
  with the world." ([Predictable][y-predictable])
- Synthesis: AAC users treat speed, a stable layout, and owning their voice
  as non-negotiable. A subscription that gates phrases reads as renting out
  someone's voice, and Live Speech is the yardstick.

**Demand signals.**

- ASHA: "Beukelman and Light (2020) estimated that approximately 5 million
  Americans and 97 million people in the world may benefit from AAC."
  ([ASHA practice portal][y-asha])
- NIDCD: "An estimated 17.9 million U.S. adults ages 18 or older, or 7.6%,
  report having had a problem with their voice in the past 12 months", and
  "About 2 million people in the United States currently have aphasia"
  ([NIDCD][y-nidcd]).
- CDC's National ALS Registry estimated 32,893 ALS cases in 2022 and
  projects growth of "more than 10%" by 2030, "to 36,308"
  ([Mehta et al., 2025][y-als-prev]). "At some point, 80 to 95% of people
  with ALS are unable to meet their daily communication needs using natural
  speech." ([Beukelman et al., 2011][y-als-aac])
- r/ALS's 100 newest posts span 32 days ([r/ALS feed][y-rd-als]). A search
  for "text to speech" there finds 9 posts in the past year, among them
  "Text to speech apps" (May 27, 2026) and "Text to Speech app for
  Bulbar-Onset ALS (iOS and Mac)" (October 28, 2025)
  ([r/ALS search][y-rd-als-search]).
- r/AAC is "the Reddit home for All About Circuits", and r/aphasia's newest
  post is from February 2, 2020 ([r/AAC feed][y-rd-aac];
  [r/aphasia feed][y-rd-aphasia]). r/slp, for speech-language pathologists,
  posts 100 times in about 4.5 days ([r/slp feed][y-rd-slp]).
- ALS Forums, "for persons affected by amyotrophic lateral sclerosis and
  motor neuron disease", reports cumulative totals of 45,795 threads, 517,521
  messages, and 30,195 members ([ALS Forums][y-alsforums]).
- Wikipedia's "Augmentative and alternative communication" article drew
  37,473 views from September 2025 through August 2026
  ([page views][y-wp-aac]).
- Synthesis: The population is real but scattered, and it is reached
  through speech-language pathologists more than through an online community
  a team could reach before September 30.

**Jev limits.**

- "You can have a maximum of 255 options per Choice" ([Jev notes][jev-api]);
  TypeSafe's Wikiracing demo splits larger sets in two stages because "Jev
  supports a cardinality up to 255" ([Jev notes][jev-cookbooks]).
- A Choice always picks, so a "none" option or a Noul is needed
  ([Jev notes][jev-gotchas]).
- "No source describes an offline, on-device, or self-hosted mode"
  ([Jev notes][jev-data]). TypeSafe quotes "about 100 ms" for most queries
  ([Jev notes][jev-rate]), not counting the network trip to a service
  "hosted in the United States" ([Jev notes][jev-data]).
- The documented ranking result is modest: re-ranking court opinions raised
  top-1 accuracy "from 5% to 18%" ([Jev notes][jev-cookbooks]).
- Borderline picks can flip between identical calls
  ([choice consistency cookbook][cb-choice]); English is "where accuracy is
  currently best" ([Jev notes][jev-lang]); and TypeSafe doesn't knowingly
  handle personal data from anyone under 18 ([Jev notes][jev-store]).
- Synthesis: "Unlimited phrases" needs a code prefilter to 255 or fewer, and
  the phrase list must work offline. Rank locally first, call Jev only to
  reorder a short list, keep button positions stable, and speak nothing until
  the user taps.

**Gallery overlap.**

- The accessibility cluster has 5 projects, none of them AAC: All You Can
  App, AuraVision AI, Jiak Ba Beh, ScanVernac, and SideBell
  ([clusters][gallery-clusters]; [project list][gallery-list]).
- The only text-to-speech tagline is myQuote's, "A simple quote app that uses
  TTS and UI themes…" ([project list][gallery-list]).
- Synthesis: No overlap; SaySo would be the gallery's only AAC entry.

[y-p4t]: https://apps.apple.com/us/app/proloquo4text-aac/id751646884
[y-predictable]: https://apps.apple.com/us/app/predictable/id404445007
[y-sa]: https://apps.apple.com/us/app/speech-assistant-aac/id1139762358
[y-p2g]: https://apps.apple.com/us/app/proloquo2go-aac/id308368164
[y-proloquo]: https://apps.apple.com/us/app/proloquo/id1521978238
[y-spoken]: https://apps.apple.com/us/app/spoken-tap-to-talk-aac/id1034487817
[y-tts]: https://apps.apple.com/us/app/text-to-speech/id712104788
[y-typing]: https://apps.apple.com/us/app/typingtalk-aac/id6740844325
[y-weave]: https://apps.apple.com/us/app/weave-chat-aac/id1579129212
[y-live-speech]: https://support.apple.com/guide/iphone/type-to-speak-iphcf92d2d9b/ios
[y-speech]: https://support.apple.com/guide/iphone/overview-of-accessibility-features-for-speech-iph8b6c223ac/ios
[y-spoken-feed]: https://itunes.apple.com/us/rss/customerreviews/page=1/id=1034487817/sortby=mostrecent/json
[y-sa-feed]: https://itunes.apple.com/us/rss/customerreviews/page=1/id=1139762358/sortby=mostrecent/json
[y-asha]: https://www.asha.org/practice-portal/professional-issues/augmentative-and-alternative-communication/
[y-nidcd]: https://www.nidcd.nih.gov/health/statistics/quick-statistics-voice-speech-language
[y-als-prev]: https://pubmed.ncbi.nlm.nih.gov/39749668/
[y-als-aac]: https://pubmed.ncbi.nlm.nih.gov/21603029/
[y-rd-als]: https://www.reddit.com/r/ALS/new/.rss?limit=100
[y-rd-als-search]: https://www.reddit.com/r/ALS/search.rss?q=text+to+speech&restrict_sr=on&sort=new&limit=100&t=year
[y-rd-aac]: https://www.reddit.com/r/AAC/new/.rss?limit=100
[y-rd-aphasia]: https://www.reddit.com/r/aphasia/new/.rss?limit=100
[y-rd-slp]: https://www.reddit.com/r/slp/new/.rss?limit=100
[y-alsforums]: https://www.alsforums.com/community/
[y-wp-aac]: https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Augmentative_and_alternative_communication/monthly/2025090100/2026083100
[jev-api]: /docs/research/jev.md#the-system-one-http-api
[jev-rate]: /docs/research/jev.md#rate-limits-context-length-and-latency

## Earshot, announcement alerts for Deaf and hard-of-hearing travelers

**Competitors and built-in features.** Captioning apps transcribe any
speech, and flight apps push the changes that announcements repeat.

| App                                         | Price and in-app purchases                                                | US ratings | Average | Released   | Updated    |
| ------------------------------------------- | ------------------------------------------------------------------------- | ---------- | ------- | ---------- | ---------- |
| [Live Transcribe][e-lt]                     | Free; $4.99–$9.99 monthly; $49.99–$79.99 yearly                           | 7,786      | 4.62    | 2020-05-21 | 2026-09-19 |
| [Ava: Transcribe Voice to Text][e-ava]      | Free; Community Plan $14.99, yearly $119.99; caption credits $2.99–$4.99  | 4,193      | 4.40    | 2016-05-03 | 2026-08-28 |
| [Live Transcribe Deaf - Relay][e-relay]     | Free; $7.99–$12.99 monthly; $59.99–$89.99 yearly; hour packs $6.99–$18.99 | 169        | 4.82    | 2026-02-01 | 2026-08-25 |
| [eyeHear][e-eyehear]                        | Free; none listed                                                         | 60         | 4.47    | 2017-12-06 | 2026-09-02 |
| [Flighty – Live Flight Tracker][e-flighty]  | Free; pay-as-you-go $4.99; $9.99 monthly; $59.99 yearly; lifetime $299.00 | 152,730    | 4.85    | 2019-08-19 | 2026-09-17 |
| [FlightAware Flight Tracker][e-flightaware] | Free; Aviator $9.99 monthly or $99.99 yearly; no ads $8.99 yearly         | 385,794    | 4.86    | 2009-06-04 | 2026-08-24 |
| [Fly Delta][e-delta]                        | Free; none listed                                                         | 7,004,038  | 4.85    | 2010-09-01 | 2026-09-10 |
| [United Airlines][e-united]                 | Free; none listed                                                         | 8,333,242  | 4.78    | 2011-07-20 | 2026-09-19 |

- Built in: with Name Recognition, "You can have iPhone continuously listen
  for your name and notify you when it’s detected", on iOS 26 and later in
  select languages. Apple warns: "Don’t rely on your iPhone to recognize your
  name in circumstances where you may be harmed or injured or in high-risk or
  emergency situations." ([Name Recognition][e-name])
- Built in: Live Captions give "a real-time transcription of spoken audio",
  including "live conversations around you", on the iPhone 11 and later, and
  "shouldn’t be relied upon in high-risk or emergency situations"
  ([Live Captions][e-captions]). Sound Recognition listens "for certain
  sounds—such as a doorbell, siren, or crying baby"
  ([Sound Recognition][e-sound]).
- Flight apps: Fly Delta sends "flight and gate change notifications"
  ([Fly Delta][e-delta]); United gives "real-time updates on boarding
  progression so you know when it's your turn to board"
  ([United Airlines][e-united]); Flighty promises the "WORLD'S FASTEST DELAY
  ALERTS" and "Gate Predictions" ([Flighty][e-flighty]).
- Live Transcribe claims "Accurate live captions for d/Deaf and hard of
  hearing. Reliable in noisy places" and "20k+ paying customers"
  ([Live Transcribe][e-lt]). eyeHear "is free with no in-app purchases" and
  warns that "Occasional mistakes can happen, especially with strong
  accents, fast speech, or noisy rooms" ([eyeHear][e-eyehear]).
- Synthesis: Earshot's paid name pages duplicate Name Recognition, and gate
  changes and boarding reach travelers through airline apps. What's left is
  judging whether a transcribed announcement concerns this traveler, and how
  urgently.

**What reviews say.**

- Live Transcribe, January 11, 2025: a reviewer "could hear airport shuttle
  driver, airport announcements, tv and it was a game changer!"
  ([review feed][e-lt-feed])
- Live Transcribe, "Jury Duty", August 20, 2024: "The announcements have been
  hard for me to hear so decided to find a transcription app."
  ([review feed][e-lt-feed])
- Ava, September 26, 2023: "I set myself and phone directly under a
  loudspeaker … Useless! … couldn’t detect anything coming at me from the
  environment." ([review feed][e-ava-feed])
- Live Transcribe, "Bait and switch", April 20, 2023: "If you want accurate,
  fast transcription, it’s limited to 5 hours a month."
  ([Live Transcribe][e-lt])
- Flighty, October 9, 2025: "it automatically updates your flight
  information in the app whenever there are changes. This includes delays,
  gate changes, or cancellations" ([Flighty][e-flighty]).
- Synthesis: People already point captioning apps at announcements, and
  loudspeaker audio is where captioning fails.

**Demand signals.**

- NIDCD: "Approximately 15% of American adults (37.5 million) ages 18 and
  over report some trouble hearing", and "About 28.8 million U.S. adults could
  benefit from using hearing aids" ([NIDCD][e-nidcd]).
- A 2026 scoping review of ten studies found "communication barriers,
  accessibility challenges, and emotional impacts" across the air-travel
  journey, with facilitators including "real-time digital updates, improved
  signage, travel companions, and assistive technologies"
  ([Danful et al., 2026][e-danful]).
- Older Deaf adults "reported that technology alerts (e.g., airport
  announcements) are typically auditory" ([Shende et al., 2025][e-shende]).
- Carriers must give passengers "who identify themselves as persons needing
  visual or hearing assistance" prompt access to "the same information
  provided to other passengers at each gate", including "flight delays or
  cancellations, schedule changes, boarding information, connections, gate
  assignments" and "individuals being paged by airlines"
  ([14 CFR 382.53][e-382-53]); a parallel rule covers the aircraft
  ([14 CFR 382.119][e-382-119]).
- The ADA Standards require that "Where public address systems convey
  audible information to the public, the same or equivalent information shall
  be provided in a visual format", in rail stations and "other
  transportation facilities" ([ADA Standards 218][e-ada-218];
  [ADA Standards 810.7][e-ada-810]).
- r/deaf's 100 newest posts span 22 days, r/hardofhearing's 20, and
  r/HearingAids' 10 ([r/deaf feed][e-rd-deaf];
  [r/hardofhearing feed][e-rd-hoh]; [r/HearingAids feed][e-rd-ha]). In the
  past year, "airport" finds 4 posts on r/deaf, such as "How do I handle
  airports?" (January 4, 2026), and 5 on r/hardofhearing, such as "Flying
  alone and need advice!" (March 8, 2026) ([r/deaf search][e-rd-deaf-search];
  [r/hardofhearing search][e-rd-hoh-search]).
- AllDeaf's community forum reports 77,628 members, with 118,704 threads
  and 2,449,188 messages in all ([AllDeaf][e-alldeaf]).
- Synthesis: The barrier is documented, and the law already puts the duty on
  carriers, but only for passengers who identify themselves. Online talk
  about airports is thin.

**Jev limits.**

- "Jev currently accepts text input only … Images, audio, and video are not
  supported (yet)." ([Jev notes][jev-what]) Speech must become text on the
  device first, and its errors become Jev's input.
- Jev "will perform better on semantic representations than numeric", and it
  "reads dates as text, not as ordered quantities"
  ([jaggedness page][ts-jagged]). Flight numbers, gates, and times are
  numbers or codes.
- "Accuracy falls as the state grows with content unrelated to the
  decision" ([Jev notes][jev-limits]); a terminal's audio is mostly
  unrelated.
- Jev is hosted only, so every decision needs a network round trip
  ([Jev notes][jev-data]), and English is "where accuracy is currently best"
  ([Jev notes][jev-lang]).
- The MCA warns the services "MAY PRODUCE INACCURATE OR ERRONEOUS OUTPUT"
  ([Jev notes][jev-terms]).
- Synthesis: Match flight numbers, gates, and times in code on the
  transcript, and give Jev only the kind and urgency of each announcement.
  When the network or the transcript fails, show everything rather than
  nothing.

**Gallery overlap.**

- A search for "deaf" has one hit, a workout app, and no project pitches Deaf
  or hard-of-hearing users ([open idea spaces][gallery-open]).
- The travel and maps cluster has 20 projects, including FlyRight: Flight
  Tracker ("Your travel buddy on the day you fly — live flight day, people
  who follow your…"); Meeting Copilot offers "live meeting transcription"
  ([clusters][gallery-clusters]; [project list][gallery-list]).
- Synthesis: No overlap on the audience or the job.

[e-lt]: https://apps.apple.com/us/app/live-transcribe/id1471473738
[e-ava]: https://apps.apple.com/us/app/ava-transcribe-voice-to-text/id1030067058
[e-relay]: https://apps.apple.com/us/app/live-transcribe-deaf-relay/id6757261643
[e-eyehear]: https://apps.apple.com/us/app/eyehear/id1321200884
[e-flighty]: https://apps.apple.com/us/app/flighty-live-flight-tracker/id1358823008
[e-flightaware]: https://apps.apple.com/us/app/flightaware-flight-tracker/id316793974
[e-delta]: https://apps.apple.com/us/app/fly-delta/id388491656
[e-united]: https://apps.apple.com/us/app/united-airlines/id449945214
[e-name]: https://support.apple.com/guide/iphone/get-notified-when-your-name-is-called-iphb865d79be/ios
[e-captions]: https://support.apple.com/guide/iphone/get-live-captions-of-spoken-audio-iphe0990f7bb/ios
[e-sound]: https://support.apple.com/guide/iphone/use-sound-recognition-iphf2dc33312/ios
[e-lt-feed]: https://itunes.apple.com/us/rss/customerreviews/page=1/id=1471473738/sortby=mostrecent/json
[e-ava-feed]: https://itunes.apple.com/us/rss/customerreviews/page=1/id=1030067058/sortby=mostrecent/json
[e-nidcd]: https://www.nidcd.nih.gov/health/statistics/quick-statistics-hearing
[e-danful]: https://pubmed.ncbi.nlm.nih.gov/41196809/
[e-shende]: https://pubmed.ncbi.nlm.nih.gov/40901569/
[e-382-53]: https://www.ecfr.gov/current/title-14/section-382.53
[e-382-119]: https://www.ecfr.gov/current/title-14/section-382.119
[e-ada-218]: https://www.access-board.gov/ada/#ada-218
[e-ada-810]: https://www.access-board.gov/ada/#ada-810_7
[e-rd-deaf]: https://www.reddit.com/r/deaf/new/.rss?limit=100
[e-rd-hoh]: https://www.reddit.com/r/hardofhearing/new/.rss?limit=100
[e-rd-ha]: https://www.reddit.com/r/HearingAids/new/.rss?limit=100
[e-rd-deaf-search]: https://www.reddit.com/r/deaf/search.rss?q=airport&restrict_sr=on&sort=new&limit=100&t=year
[e-rd-hoh-search]: https://www.reddit.com/r/hardofhearing/search.rss?q=airport&restrict_sr=on&sort=new&limit=100&t=year
[e-alldeaf]: https://www.alldeaf.com/community/
[gallery-open]: /docs/research/gallery-2026.md#open-idea-spaces

## Summary

Each bullet gives the evidence for and against from the sections above,
then the recommended move against the Round 4 order, where the fifth idea
scored 77.5 and the sixth, Take-Home, 76 ([ideation log][ideation-r4]).

- **Hunch.** For: Akinator's 422,100 ratings and the daily-puzzle habit
  show the appetite, and no app found pairs a shared daily object with
  free-form questions in English. Against: Das Verhör, a German entry in the
  gallery, already runs a daily case questioned in free text; players punish
  contradictory or hedged answers, Jev's negation pairs and borderline flips
  can produce both, and a $0.99-a-month rival answers on the device.
  Synthesis: hold at first, and build and test answer consistency before
  anything else.
- **Subtext.** For: the need is documented, autistic adults already use
  chatbots to read messages, and r/ADHD and r/autism each draw about 100 new
  posts a day. Against: a free app built for autistic adults, with the same
  name and promise, launched on August 13, 2026, among a dozen "Subtext"
  apps; Goblin Tools does the check for $1.99 and drew one-star reviews when
  it added a subscription; and messages that argue for their own tone are
  Jev's named weak spot. Synthesis: move down, below Flagged, since a
  same-named rival for the same audience weakens its differentiation.
- **Flagged.** For: the FTC and the FBI both count growing job-scam harm,
  104,946 FTC reports in 2024 and $362.9 million in IC3 losses in 2025, the
  FTC's warning signs match its checks, and no iOS app found checks job
  postings for scams. Against: free scam checkers from security brands
  already catch fake job offers, job-scam extensions have few users, and
  misleading text is Jev's weak spot. Synthesis: move up to second.
- **SaySo.** For: about 5 million Americans may benefit from AAC, no app
  read ranks a user's phrases by meaning, and the gallery has no AAC entry.
  Against: Live Speech is free with saved phrases, an AAC user called paying
  a subscription for basic communication "repugnant", a phrasebook over 255
  phrases exceeds one Choice, and the phrases must work offline. Synthesis:
  move down, since Live Speech cuts its differentiation and the subscription
  backlash its monetization fit.
- **Earshot.** For: the gallery has no Deaf-focused entry, studies name
  auditory announcements as a barrier, and 14 CFR 382.53 covers only
  passengers who identify themselves. Against: Name Recognition is free,
  airline apps push gate changes, loudspeaker audio defeats captioning, and
  Jev can't take audio and is weak with numbers and times. Synthesis: move
  down and out of the top five, since a one-point cut to its differentiation
  score, worth 2 points of the total, drops it below Take-Home.

[ideation-r4]: /docs/research/ideation.md#round-4-scoring
[gallery-clusters]: /docs/research/gallery-2026.md#idea-clusters-by-count
[gallery-other]: /docs/research/gallery-2026.md#other-prize-categories
[gallery-list]: /docs/research/gallery-2026.md#full-project-list
[jev-what]: /docs/research/jev.md#what-jev-is
[jev-data]: /docs/research/jev.md#offline-behavior-and-data-handling
[jev-limits]: /docs/research/jev.md#known-limitations-on-the-jaggedness-page
[jev-lang]: /docs/research/jev.md#jev-platform-and-language-support
[jev-store]: /docs/research/jev.md#store-review-and-jev
[jev-terms]: /docs/research/jev.md#master-customer-agreement-terms-for-apps
[jev-gotchas]: /docs/research/jev.md#gotchas-in-the-api-and-sdks
[jev-cookbooks]: /docs/research/jev.md#cookbooks-and-demos
[ts-jagged]: https://docs.typesafe.ai/model-jaggedness/jev-1.13
[cb-choice]: https://docs.typesafe.ai/cookbooks/consistency_choice_cookbook
[ios27]: https://support.apple.com/guide/iphone/whats-new-in-ios-27-iphfed2c4091/ios
[siri-screen]: https://support.apple.com/guide/iphone/siri-ai-ask-siri-about-whats-on-your-screen-iphmk4p88mkuky/ios
[chatgpt]: https://apps.apple.com/us/app/chatgpt/id6448311069

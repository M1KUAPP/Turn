# Game and character design research notes

How daily puzzle games look and move, how character-led apps make a mascot
readable, how reactions are timed and built, and how to show an answer
without relying on color. These notes feed `docs/DESIGN.md`, Guessling's
design system and art direction, and build on the
[daily puzzle notes][daily], which cover release times, share formats,
streaks, archives, and end-of-round screens. Every source was read on
September 22, 2026, and judgment starts with "Synthesis:".

Contents:

1.  [Sources and method](#sources-and-method)
1.  [The visual language of daily puzzles](#the-visual-language-of-daily-puzzles)
    1.  [Wordle's tiles, type, and motion](#wordles-tiles-type-and-motion)
    1.  [Connections and Strands colors](#connections-and-strands-colors)
    1.  [What NYT's designers say](#what-nyts-designers-say)
    1.  [LinkedIn's games](#linkedins-games)
    1.  [Apple News+ puzzles](#apple-news-puzzles)
    1.  [What makes a puzzle recognizable](#what-makes-a-puzzle-recognizable)
    1.  [What Best Game judges ask for](#what-best-game-judges-ask-for)
1.  [Character-led apps](#character-led-apps)
    1.  [Duolingo's characters](#duolingos-characters)
    1.  [Akinator's genie](#akinators-genie)
    1.  [Brilliant, Finch, and Headspace](#brilliant-finch-and-headspace)
    1.  [How characters show yes, no, unsure, and delight](#how-characters-show-yes-no-unsure-and-delight)
1.  [Readable poses and timing](#readable-poses-and-timing)
    1.  [Silhouette and staging](#silhouette-and-staging)
    1.  [Anticipation, squash and stretch, and holds](#anticipation-squash-and-stretch-and-holds)
    1.  [Reaction durations](#reaction-durations)
    1.  [State machines and keyframed poses](#state-machines-and-keyframed-poses)
1.  [Color-blind-safe feedback](#color-blind-safe-feedback)
    1.  [WCAG 2.2 on color, contrast, and motion](#wcag-22-on-color-contrast-and-motion)
    1.  [Apple on color and feedback](#apple-on-color-and-feedback)
    1.  [Wordle's high-contrast mode](#wordles-high-contrast-mode)
    1.  [Published color-blind-safe palettes](#published-color-blind-safe-palettes)
    1.  [The share squares, measured](#the-share-squares-measured)
    1.  [Yes and No without color](#yes-and-no-without-color)
1.  [Sound and haptics in puzzle games](#sound-and-haptics-in-puzzle-games)
1.  [Making a mascot as a small team](#making-a-mascot-as-a-small-team)
    1.  [Production options and effort](#production-options-and-effort)
    1.  [AI-assisted art and the rules](#ai-assisted-art-and-the-rules)
1.  [Findings for DESIGN.md](#findings-for-designmd)
1.  [Conflicts between sources](#conflicts-between-sources)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## Sources and method

- **Game code.** Wordle, Connections, Strands, and Pips as nytimes.com served
  them on September 22, 2026: the pages, 13 stylesheets under
  `games-assets/v2/`, and the scripts, the same bundles the daily puzzle
  notes read. Colors, fonts, and timings below are values in that code, named
  by custom property, keyframe, or constant; the logic around them is
  described, not quoted.
- **NYT's writing.** NYT's help center, NYT Open, nytco.com press pages, and
  four nytimes.com articles read in the Internet Archive, because nytimes.com
  refuses direct reads of articles. Articles were found through NYT Open's
  feeds, nytco.com's sitemap, and nytimes.com's public sitemap pages; that
  sweep read about 1,320 daily index pages before it was stopped as heavier
  than needed.
- **LinkedIn.** LinkedIn's robots file forbids automated access without
  permission ([li-robots]), so this note used eight linkedin.com pages, two
  Help articles and six staff posts, one request each, plus Help articles
  captured earlier the same day, five Pressroom posts, and images and icons
  on LinkedIn's media servers. LinkedIn's game code wasn't read.
- **Apple.** Newsroom posts and their press images; the iPhone User Guide,
  which support.apple.com served in an English locale outside the US; the
  Human Interface Guidelines and developer documentation, read through their
  JSON; WWDC session transcripts; App Store Connect Help; and App Store
  product pages.
- **Character-led apps.** Duolingo's blog and press kit, and its retired brand
  guidelines in an Internet Archive copy of their code; Rive's blog posts
  about Duolingo and Brilliant, which quote those teams; Akinator's public
  web game, its images, and its animation code; and Finch's and Headspace's
  own sites and help centers.
- **Animation and tools.** Valve's publications, GDC Vault session pages,
  WWDC transcripts, and the owners' docs for Rive, Lottie, LottieFiles,
  Reanimated 4.5.1 (docs and package source), react-native-svg, Expo SDK 57,
  and Material Design 3.
- **Accessibility.** W3C's WCAG 2.2, its Understanding documents, and
  WCAG2ICT, captured with headless Chrome because w3.org challenged `curl`;
  Okabe and Ito's Color Universal Design page; and Paul Tol's notes at their
  current address.
- **Measurements.** Emoji colors come from Apple Color Emoji drawn in headless
  Chrome on macOS 27.0 and checked against the glyph images in the font file.
  Colors in owners' images are box means read with ffmpeg from sRGB-tagged
  files, and icon colors are the `fill` values in owners' SVG files. Contrast
  ratios use WCAG 2.2's formula. Color-blind views use the full-severity
  matrices of Machado, Oliveira, and Fernandes (2009) in linear RGB, compared
  by CIEDE2000 (ΔE00). Timings in promo videos and GIFs were read frame by
  frame; they come from marketing edits, not specs.
- **Rules.** The official rules on Devpost, headed "Updated August 31, 2026"
  and read directly ([dp-rules]); Shipaton's pages as captured in
  `docs/sources/`; Apple's App Review Guidelines; and the US Copyright
  Office.
- **Search.** Web search was unavailable for most of the work, so sources
  were found through sitemaps, feeds, `llms.txt` files, GitHub, npm, and GDC
  Vault's browse pages. No third-party article is cited as evidence.

[li-robots]: https://www.linkedin.com/robots.txt

## The visual language of daily puzzles

### Wordle's tiles, type, and motion

- **Colors.** `--color-correct`, `--color-present`, and `--color-absent`
  resolve to `#6aaa64`, `#c9b458`, and `#787c7e` in light mode; dark and high
  contrast are under [Wordle's high-contrast mode](#wordles-high-contrast-mode)
  ([nyt-wordle-game]). The help names them by meaning: "Green: The letter is
  in the daily word and in the correct position." ([nyt-wordle-help]) NYT
  calls them "Wordle’s iconic tiles" and "Wordle’s signature colors"
  ([nytco-wordle-1000]).
- **Type.** The title is NYT Karnak Condensed (`"nyt-karnakcondensed"`, 700,
  28 px in the header). Tiles, keys, and toasts are NYT Franklin
  (`"nyt-franklin"`), bold and uppercase on the tiles. The fonts are
  self-hosted WOFF2 files ([nyt-wordle-game]).
- **Motion.** A typed letter pops for `100ms`, from `scale(0.8)` to
  `scale(1.1)`. Each tile flips in two `250ms` `ease-in` halves and changes
  color when edge-on, and tiles start 300 ms apart (`_=g?100:300`), so a
  five-letter reveal takes about 1.7 seconds. An invalid word shakes for
  `600ms`, 4 px each way. A win bounces each tile for `1000ms`, 100 ms apart,
  up to `translateY(-30px)` ([nyt-wordle-game]).
- **One word for the result.** A win shows one word by guesses used,
  `["Genius","Magnificent","Impressive","Splendid","Great","Phew"]`, for 2
  seconds. A loss shows the answer in capitals and leaves it up
  (`duration:1/0`). The results panel opens 2,500 ms after the last tile
  flips ([nyt-wordle-game]).
- **No reduced motion.** None of the 13 stylesheets served for Wordle,
  Connections, and Strands mentions `prefers-reduced-motion`, and Wordle's
  tiles pop, flip, shake, and bounce regardless; only shared badge code
  checks the setting ([nyt-wordle-game]).
- **Where the look came from.** When NYT bought Wordle in January 2022, Will
  Shortz said "What’s nice about Wordle is how simple, pleasant and
  attractive the computer interface is", and the article credited "the
  spoiler-free scoring grid that allows players to share their Wordle wins
  across social media, group chats and more." ([nyt-wordle-purchase])

[nytco-wordle-1000]: https://www.nytco.com/press/wordle-1000th-celebrations/
[nyt-wordle-purchase]: https://web.archive.org/web/20220205231519id_/https://www.nytimes.com/2022/01/31/crosswords/nyt-wordle-purchase.html

### Connections and Strands colors

- **Four groups, four levels.** The stylesheet defines
  `--connections-yellow: #f9df6d`, `--connections-green: #a0c35a`,
  `--connections-blue: #b0c4ef`, and `--connections-maroon: #ba81c5`, mapped
  to `straightforward`, `easy`, `medium`, and `tricky`
  ([nyt-connections-game]). The help: "Each group is assigned a color
  (Yellow, Green, Blue, or Purple), with Yellow being the easiest category
  and Purple being the trickiest." ([nyt-connections-help])
- **Why those colors.** Connections' editor, Wyna Liu: "I organized my
  spreadsheet into four colors: yellow, green, blue and purple, in spectral
  order. I wanted yellow to be the most straightforward category, as a
  foothold for solvers. Purple was meant to be the trickiest category, a
  stand-alone puzzle incorporating a wordplay element." ([nyt-connections-edit])
- **Not color alone.** Cards are a warm beige, `#efefe6`, not white, and
  screen readers hear levels instead of colors: "Each group is assigned a
  level, which will be revealed to you as you solve." ([nyt-connections-game])
- **Feedback.** Submitted cards hop in turn (`.3s`, 0.1 s apart). A wrong
  guess shakes them and may add "One away...", shown for 3 seconds. A right
  guess collapses the four cards into a bar in the group's color that pulses
  once (`.3s`, to `scale(1.2)`), and a lost mistake dot shrinks away over
  `.4s`. The end title depends on mistakes: `"Perfect"`, `"Great"`,
  `"Solid"`, `"Phew"`, or `"Next Time"` ([nyt-connections-game]).
- **Strands.** Theme words fill `#aedfee` and the spangram `#f8cd05`, joined
  by round-capped strokes 12 px wide. Found letters bounce for `1s`, a "Hint"
  pill fills a third at a time, and the end card flips to `"Perfect!"`,
  `"Great!"`, or `"Well Done!"` ([nyt-strands-game]). The help: "Themed words
  will be highlighted in blue; the spangram will be highlighted in yellow."
  ([nyt-strands-help])

[nyt-connections-edit]: https://web.archive.org/web/20230703164117id_/https://www.nytimes.com/2023/06/26/crosswords/new-game-connections.html
[nyt-strands-game]: https://www.nytimes.com/games/strands
[nyt-strands-help]: https://help.nytimes.com/360011158491-New-York-Times-Games/28214352967700-Strands

### What NYT's designers say

- **Look and feel make the game.** On designing Vertex: "Games are emotional
  experiences created, in part, by how they look." "How it feels to play a
  game is just as important as how it looks, especially in a digital
  environment." ([nyt-open-vertex])
- **The team's aim.** "The priority is to produce puzzles that are
  “thoughtfully made, thoughtfully played” — that’s the team motto." Heidi
  Erwin: "we want people to feel smart, we want people to feel rewarded, that
  they used their time well". And: "The visual impact of the game can also
  influence the perceived level of fun." ([nyt-make-a-game])
- **Hints from playtests.** For Strands, "Solvers needed a leg up, so the
  squad added Today’s Theme. They also came up with the hint system during
  the prototyping process", and "What makes Strands a New York Times game is
  its human touch." ([nyt-strands-made])
- **Brand color apart from play color.** For dark mode, "Game Brand colors
  consist of design tokens used for brand purposes, such as Spelling Bee
  Yellow, Connections Purple, The Mini Blue, etc.", while "Gameplay Color
  tokens are color tokens used for gameboards and game interactions." Play
  had to feel the same in both modes: "tiles within Connections have a very
  distinct beige color and do pass the accessibility test on a dark black
  background. However, it can feel overly bright on a dark background, so we
  adjusted the saturation of the beige to have a consistent game experience."
  ([nyt-open-dark-2025])
- **Art per mode.** "Our illustrations also couldn’t simply have their colors
  inverted." "We ended up reviewing each illustration individually and
  manually adapting it for dark mode." ([nyt-open-dark-2026])
- **The app.** The 2024 redesign relied on "distinct cards, clear game
  branding and playful color" ([nytco-redesign-2024]), and the NYT Games app
  was "recognized by Apple as a winner in the Delight and Fun category" of
  the 2024 Apple Design Awards ([nytco-awards-2024]).

[nyt-open-vertex]: https://open.nytimes.com/connecting-the-dots-on-game-development-a28214b513bf
[nyt-make-a-game]: https://web.archive.org/web/20230416050504id_/https://www.nytimes.com/2023/04/10/crosswords/games-digits-beta.html
[nyt-strands-made]: https://web.archive.org/web/20240310115748id_/https://www.nytimes.com/2024/03/04/crosswords/strands-word-search-game.html/
[nyt-open-dark-2026]: https://open.nytimes.com/implementing-dark-mode-in-the-games-app-be7241ddb7ba
[nytco-redesign-2024]: https://www.nytco.com/press/the-new-york-times-games-app-unveils-fresh-redesign/
[nytco-awards-2024]: https://www.nytco.com/press/nyt-games-app-wins-cultural-impact-award-at-apples-2024-app-store-awards/

### LinkedIn's games

- **One board and one emblem each.** Queens is "a logic game where you fill
  the grid so that there is only one Queen per row, column, and colored
  region", on "a colored grid with empty cells" ([li-queens]). Tango fills a
  grid with suns and moons, and its Help warns that "the emojis on the grid
  may vary" on some days ([li-tango]). Zip asks players to "draw a path
  through the grid, connecting numbers sequentially and filling every cell",
  and its walls "appear as bolded lines between cells" ([li-zip]). Pinpoint
  says: "You’re given five clues to figure out this common category."
  ([li-pinpoint])
- **Mistakes shown with pattern.** "Enable Auto-check in the Settings menu to
  highlight rule violations. If too many Crown symbols are placed, affected
  cells are marked with red stripes." ([li-queens]) Zip's Hint will "erase the
  path up to the first mistake and to reveal the next correct step"
  ([li-zip]).
- **The solve.** Each game's article says only: "After completing the game,
  you’ll be directed to the results page" ([li-queens]). Milestone icons
  "start out gray and turn golden as you reach each milestone"
  ([li-streaks]). In LinkedIn's preview GIF for Zip, the grid lines drop
  away, a band of light sweeps the finished path twice, and an orange
  results sheet headed "Victory lap!" rises about 1.8 seconds after the last
  cell ([li-zip-post]; timed frame by frame at 15 frames a second).
- **What the designers aim for.** LinkedIn's Principal Puzzlemaster, Thomas
  Snyder, names "three key qualities": "Approachability: The basic rules must
  be easily understood", "Depth: A good puzzle needs layers of discovery",
  and "Something unique: The game should feel special for the LinkedIn
  community" ([li-patches-design]). LinkedIn's Lakshman Somasundaram writes
  that Zip is "easy to pick up and satisfying to swipe through"
  ([li-patches-post]) and that each game was designed to "only take a few
  minutes" ([li-game-on]). No LinkedIn source read discusses color, icons, or
  motion.
- **Icon colors.** The icon files LinkedIn's game pages load keep one hue
  family per game in their `fill` values: Queens five pastel regions
  (`#C9B5E8`, `#FFD4A8`, `#ABCBFF`, `#C2E6B3`, `#E5E5E5`), Tango an amber
  `#FFBA33` and a blue `#7FADED`, and Zip an orange `#FF6D29` on `#FFD0BA`
  ([li-queens-icon]; [li-tango-icon]; [li-zip-icon]).
- Synthesis: a board shape plus one emblem, a crown, a sun and a moon, or a
  path, inside a shared shell of launch screen, results sheet, and streak
  ribbon. Nothing is a character; the reward is a sweep of light, confetti,
  and a line of praise.

[li-tango]: https://www.linkedin.com/help/linkedin/answer/a6861672
[li-zip]: https://www.linkedin.com/help/linkedin/answer/a7445030
[li-pinpoint]: https://www.linkedin.com/help/linkedin/answer/a6264504
[li-streaks]: https://www.linkedin.com/help/linkedin/answer/a6296670
[li-zip-post]: https://www.linkedin.com/pulse/introducing-zip-newest-linkedin-logic-game-plus-more-somasundaram-0yh5c
[li-patches-design]: https://www.linkedin.com/pulse/from-pieces-patches-how-we-designed-linkedins-newest-game-clghf/
[li-patches-post]: https://www.linkedin.com/pulse/say-hello-patches-meet-zips-best-friend-our-newest-somasundaram-mnttf
[li-game-on]: https://www.linkedin.com/pulse/pinpoint-queens-crossclimb-game-lakshman-somasundaram-k1zwc
[li-queens-icon]: https://media.licdn.com/media/AAYABATzAAwAAQAAAAAAAZC82uVjOXAhS6msAw1L9NiUyw.svg
[li-tango-icon]: https://media.licdn.com/media/AAYABATzAAwAAQAAAAAAAGdDDxyZbs7MRWuUy85EhfgX0A.svg
[li-zip-icon]: https://media.licdn.com/media/AAYABATzAAwAAQAAAAAAAWm1j1BVtLDNQwuc3c1XKHTopg.svg

### Apple News+ puzzles

- **Quartiles.** "Players select tiles containing two to four letters from a
  four-by-five grid to form words." "A word formed from four tiles is called
  a Quartile and is worth 8 points", and "The object of the game is to earn
  the 100 points necessary to reach the Expert rank." ([ug-quartiles])
- **Emoji Game.** Players "use a selection of emoji — including Genmoji
  created using Apple Intelligence — to fill in the blanks of three short
  phrases using as few moves as possible" ([nr-emoji]), and "When you attempt
  an answer or expand a clue, it counts as a move." ([ug-emoji])
- **The look, from Apple's press images.** Quartiles puts a blue band
  (`#0061E6` in the 2024 Newsroom stills) over a light-gray page (`#F3F2F8`)
  and a four-by-five grid of white key-cap tiles, and each found word pops up
  as a `#007AFF` pill with burst lines ([nr-quartiles]). Emoji Game puts an
  amber band (`#FAB00F`) over three white phrase cards, and a solved word
  sits in a pale-yellow highlight, `#FCD786` ([nr-emoji]).
- **A face that reacts.** Emoji Game's header shows one large emoji face over
  the move count. In Apple's promo video, the face turns from 😀 to 🤩
  between 0.1 and 0.3 seconds after the last answer's letters fill in, the
  solved board holds about 1.4 seconds, and a results screen follows with the
  face in a laurel trophy, confetti, and "Perfection!" ([nr-emoji]; timed
  frame by frame at 30 frames a second). No Apple text describes the face.
- **Feedback beyond color.** Apple's sudoku marks conflicts with shape: "the
  squares’ bottom-right corners are marked with red triangles", and "All
  incorrect answers you already entered have a red slash through them"
  ([ug-sudoku]).
- Synthesis: one hue band per puzzle inside a shared shell, the "News+"
  lockup, white cards, and one results card. The Emoji Game face is the
  nearest thing to the Guessling in all three families: a small character
  that reacts a beat after the answer lands, then gives way to the result.

[ug-quartiles]: https://support.apple.com/guide/iphone/iph9ccdd1bab/ios
[nr-emoji]: https://www.apple.com/newsroom/2025/07/apple-news-plus-introduces-emoji-game/
[ug-emoji]: https://support.apple.com/guide/iphone/play-emoji-game-iphd419e8234/ios
[nr-quartiles]: https://www.apple.com/newsroom/2024/05/apple-news-plus-introduces-quartiles-a-new-game-and-offline-mode-for-subscribers/

### What makes a puzzle recognizable

- Synthesis: each game owns one board shape and one small feedback palette,
  used the same way on the board and in the share: Wordle's rows of squares
  in green, yellow, and gray, Connections' bars stacked in spectral order,
  Strands' circles joined by strokes in blue and yellow, Queens' pastel
  regions under crowns, Zip's orange ribbon, Quartiles' white key caps under
  a blue band, and Emoji Game's amber band. A screenshot reads before any
  letter does.
- Synthesis: brand color and feedback color are kept apart. NYT separates
  "Game Brand colors" from "Gameplay Color tokens" ([nyt-open-dark-2025]);
  LinkedIn and Apple give each game one hue and reuse a shared results shell.
- Synthesis: the payoff is short and verbal: Wordle's one word by guesses,
  Connections' and Strands' rank words, Zip's "Victory lap!", and Emoji
  Game's "Perfection!".
- Synthesis: Guessling's board is a column of questions, which is not a
  distinctive shape. The character and the answer chips have to carry the
  look, and the character is the one thing none of these games has.

### What Best Game judges ask for

- **The category page.** "Judges are looking for strong gameplay, a clear art
  direction, and a monetization model that fits the genre instead of fighting
  it." Entrants should include "Notes on the art direction, tone, and what
  makes the game memorable", and the game "should feel coherent, playable,
  and convincing as a shipped experience" ([sh-best-game]).
- **The official rules.** The category is an "Open category for the best
  mobile game shipped during the event. We're looking for great gameplay, art
  direction, and a monetization fit that suits the genre." Its three
  questions are "Is the game fun and engaging to play?", "Does it provide a
  unique gameplay experience, progression, or replayability?", and "How is
  the game monetized?" The write-up must include "a description of the game
  covering gameplay, art direction, and how the monetization model fits the
  genre." ([dp-rules])
- **Apple's nearest definition.** The Apple Design Awards' Visuals and
  Graphics category honors "stunning imagery, skillfully drawn interfaces,
  and high-quality animations with a distinctive and cohesive theme"
  ([ada-2026]).
- Synthesis: "clear" and "cohesive" point the same way: one character, one
  palette, and one motion style across the round, the reveal, the share, and
  the store screenshots.

[ada-2026]: https://developer.apple.com/design/awards/

## Character-led apps

### Duolingo's characters

- **Silhouette first.** On Duo's 2013 redesign: "The most important part of
  Duo’s reshaping was, obviously, Duo’s shape/silhouette. In icon design as
  well as character design, if the overall shape is not appealing, then the
  details within that shape can’t compliment it successfully."
  ([duo-reshaping])
- **Few, rounded shapes.** Duolingo's brand guidelines, retired from
  design.duolingo.com, survive in an Internet Archive copy of the site's code
  from August 23, 2026 ([duo-guidelines]): "All of our illustrations are made
  from three basic shapes: the rounded rectangle, the circle, and the rounded
  triangle." "Pointy shapes are off-brand." "Avoid too many shapes. It
  complicates the overall silhouette." "Usually, the head and body are
  composed of 1–2 basic shapes each." Its simplicity examples rate a
  15-shape figure "Good!" and a 30-shape one "Too many shapes".
- **The face carries the feeling.** "Eyes are an incredible tool for
  conveying our characters' personalities and state of mind. You could
  enlargen or shrink the pupil, suggest tears with a little shiny-eye effect,
  or lower the eyelids." "The mouth can break out of the frame of the face to
  convey more extreme emotions." ([duo-guidelines])
- **Always posed, rarely moving.** "We illustrate expressive poses which
  clearly communicate a mood or activity", and characters shouldn't be left
  "in a static, expressionless state, which could make them feel lifeless".
  Yet in motion, "Duo mostly stands still", "Duo makes slight, expressive
  movements, like waving or pumping his fist", and "Duo doesn't make any
  sudden or quick movements." ([duo-guidelines])
- **Reacting to answers.** "we gave each character a unique animation that
  would play anytime a learner answered an exercise correctly", plus
  "interstitials that reward a learner for answering a number of exercises
  correctly in a row" ([duo-building-character]). In Rive, "based on the
  outcome of the challenge – if you get it right or wrong – we can move to a
  final state, showing the reaction to your response!" ([duo-visemes]) In
  Adventures, characters "respond to mistakes by saying something like, “Oh,
  did you mean…?” and looking a little confused." ([duo-adventures])
- **Lily's head.** "If she’s confused, she might squint or shake her head."
  "If she’s impressed, she might raise an eyebrow and nod approvingly." "If
  there’s a delay in processing, she reacts naturally by tilting her head or
  pondering, making the wait feel intentional rather than mechanical."
  ([rive-lily])
- **Words for a miss.** "When learners stumble, we" support them: "This is
  the time for friendly, helpful language — but don't overdo it. We want them
  to keep going!" Duo says "Not quite, but don't give up!", not "Nope. Maybe
  try that one again." ([duo-guidelines])
- **Celebrate at once.** Learners "immediately see fireworks, celebratory
  animations" while the app finishes its network work, for a "60%+
  reduction in perceived session end latency" ([duo-android-perf]).
- **Color from the character.** "Our core colors are taken directly from our
  mascot, Duo." Feather Green, `#58CC02` in the guidelines' swatch data, "is
  the core color of our brand", and "Keep your illustration to a few colors.
  Too many colors can hurt legibility when an object scales to a small size."
  ([duo-guidelines])
- **Rive at Duolingo.** "Duolingo first used Rive for reward animations, like
  a chest shaking and gems jumping out." ([rive-duo-ct]) For lip sync, "The
  file sizes were compact and plugged in neatly with Duolingo’s app
  architecture, and the handoff from animator to engineer was seamless."
  ([duo-visemes])
- **Effort.** When "only a few designers were capable of illustrating",
  Duolingo "moved to a minimalistic art style that was fast to produce
  without sacrificing design quality and clarity" ([duo-shape-language]). The
  World Characters took "the last 18 months" ([duo-building-character]); lip
  sync needed "a set of 20+ mouths" ([duo-visemes]); and "The final Rive file
  is under a megabyte despite the complexity." ([rive-lily])

[duo-reshaping]: https://blog.duolingo.com/reshaping-duo/
[duo-building-character]: https://blog.duolingo.com/building-character/
[duo-visemes]: https://blog.duolingo.com/world-character-visemes/
[duo-adventures]: https://blog.duolingo.com/adventures/
[duo-android-perf]: https://blog.duolingo.com/android-app-performance/
[rive-duo-ct]: https://rive.app/blog/creative-technologists-duolingo-s-solution-to-the-designer-to-developer-handoff

### Akinator's genie

The web game at en.akinator.com was read in its page code, its images, and
its animation script ([aki-game]).

- **Poses carry it.** The game loads 18 pose images from
  `/assets/img/akitudes_670x1096/` and 56 Lottie animations between them. A
  settings switch, "Animations", replaces the animations with the still
  poses.
- **Poses follow the genie's confidence.** The script compares the server's
  confidence with the question number to pick one of five states, and the
  change between states picks the pose: a rise to confident shows
  `inspiration_forte` (a raised index finger), a drop from confident shows
  `surprise`, a steady confident state shows `mobile` (checking a phone), and
  a long slide shows `decouragement` (fists at the chest). Thinking poses
  include `concentration` (fingertips on temples) and `inquiet` (chewing a
  knuckle).
- **Win, miss, and loss.** A right guess plays `triomphe`, both fists up. A
  wrong guess plays `surprise` or `deception`, then `espoir_anxieux`, chin on
  hands and hopeful. When the genie gives up, it bows with `felicitations`,
  congratulating the player.
- **One body, many faces.** `serein_2`, `surprise`, and `deception` share one
  arms-crossed body to within a few pixels, and only the face changes.
  `triomphe` covers 32% more pixels than `serein_2` and is 21% wider
  (opaque pixels counted in headless Chrome).
- **The character in words.** Elokence's story of the genie: "It had the
  aspect of a man and looked quite friendly", and "You will see that he is
  not infallible. But hush... he does not like to hear it." ([aki-story])

[aki-story]: https://en.akinator.com/content/2/the-fabulous-story-of-akinator

### Brilliant, Finch, and Headspace

- **Brilliant's Koji.** Brilliant's team, on Rive's blog: "We work hard to
  take the sting out of failure and help people see their mistakes as
  stepping stones to mastery", and "the tutor needed to get you into this
  playful state of mind at a glance." Koji responds with "waving, nodding,
  reacting differently depending on whether you breezed through a problem or
  fought for it." The post's video labels a first-try correct answer "wobbles
  with approval" and a wrong one "patient, not deflating" (read from a video
  frame). A young tester: "When you finish the lesson and you got everything
  right, and Koji does a flip, it’s amazing!" ([rive-koji])
- **Finch.** Its makers wrote about tone, not looks: "no guilt, no pressure —
  just small, meaningful steps" ([finch-mission]), and "your birb is always
  there to cheer you on." ([finch-approach]) "Streaks are meant to encourage
  gentle consistency, not perfection." ([finch-guide]) Its Senior Animator
  must "Develop animations with a strong sense of weight, physics, and
  timing" ([finch-animator]).
- **Headspace.** No character or illustration principles written by
  Headspace were found on its site, help center, or press page (see
  [Gaps](#gaps)).

[rive-koji]: https://rive.app/blog/brilliant-builds-its-math-and-coding-tutor-character-with-rive
[finch-mission]: https://help.finchcare.com/hc/en-us/articles/37935610353293-Our-Mission
[finch-approach]: https://help.finchcare.com/hc/en-us/articles/37935669335309-Our-Approach-to-Self-Care
[finch-guide]: https://help.finchcare.com/hc/en-us/articles/42149821015693-New-User-Guide
[finch-animator]: https://jobs.ashbyhq.com/finch/1c0978ec-7a1e-4ca2-9f39-f7878751a076

### How characters show yes, no, unsure, and delight

| Signal  | Duolingo                            | Akinator's genie                        | Brilliant's Koji         |
| ------- | ----------------------------------- | --------------------------------------- | ------------------------ |
| Yes     | Lily may "nod approvingly"          | A raised finger as confidence rises     | "wobbles with approval"  |
| No      | Lily may "squint or shake her head" | Surprise or disappointment, then hope   | "patient, not deflating" |
| Unsure  | "tilting her head or pondering"     | Fingertips on temples, a chewed knuckle | "visible consideration"  |
| Delight | "fireworks, celebratory animations" | Both fists up; a bow when it loses      | "Koji does a flip"       |

- Synthesis: Yes and No are small head moves on a still body, along
  different axes, a vertical nod and a horizontal shake, and the biggest
  change of shape is saved for delight. Unsure is a tilt or a hand at the
  head, which fits the shrug.
- Synthesis: the face does most of the work, eyes and brows for doubt and the
  mouth for delight, so the Guessling's face should be large and simple, with
  no detail that vanishes at small sizes.
- Synthesis: every maker here is kind on a miss, which matches "never mocks
  a wrong guess". The genie's bow when it loses is a model for an unsolved
  reveal, and its still-pose switch is the same idea as Guessling's plan for
  Reduce Motion.

## Readable poses and timing

### Silhouette and staging

- **Readable with no detail at all.** Valve's paper on Team Fortress 2: "Even
  when viewed only in silhouette with no internal shading at all, the
  characters are readily identifiable to players", and "demonstrating the
  ability to visually read the characters even with no internal detail was
  used to validate the character design during the concept phase of the game
  design." ([valve-tf2]) Valve's GDC 2008 slides put "Character silhouette"
  before "Interior shapes" and say "Solve design problems using silhouette
  only" ([valve-gdc2008]).
- **Small and monochrome.** Apple's icon guidance asks for an idea expressed
  "in a simple, unique way with a minimal number of shapes", warns that "dark
  icons are more subdued, and clear and tinted icons are even more so", and
  says "A great app icon is visible, legible, and recognizable, regardless of
  its appearance variant." ([hig-app-icons])
- **Without words.** A GDC 2019 talk on the techniques of Lead Animator Atsuko
  Fukuyama, with examples from ICO and Shadow of the Colossus, sets out to
  "help players feel connected to characters that are unable to speak or
  unable to use words the player understands" ([gdc-fukuyama]).

[valve-tf2]: https://cdn.akamai.steamstatic.com/apps/valve/2007/NPAR07_IllustrativeRenderingInTeamFortress2.pdf
[valve-gdc2008]: https://cdn.akamai.steamstatic.com/apps/valve/2008/GDC2008_StylizationWithAPurpose_TF2.pdf
[hig-app-icons]: https://developer.apple.com/design/human-interface-guidelines/app-icons
[gdc-fukuyama]: https://gdcvault.com/play/1025837/

### Anticipation, squash and stretch, and holds

- **The classic source isn't online.** The twelve principles come from Frank
  Thomas and Ollie Johnston's The Illusion of Life (1981). Disney's book page
  has only a description ([disney-illusion]) and the Internet Archive only
  lending copies, so the book wasn't read, and the principles here come from
  owners who restate parts of them.
- **Key frames and anticipation.** A GDC 2014 talk on Skullgirls covers "the
  importance of strong key frames, anticipation and timing, and how you can
  effectively get these principles across when your designer says only have
  six frames to deliver a punch" ([gdc-skullgirls]).
- **Apple's version.** Apple's 2018 talk on fluid interfaces says to "hint in
  the direction of the gesture", and borrows stretch: "take a page from 2D
  animation and video games by stretching" ([wwdc18-fluid]). Its 2023
  celebration example, meant as "an animation that leaves no doubt", first
  holds, "holding it for 0.36 seconds", then squashes with
  `CubicKeyframe(0.6, duration: 0.15)` and stretches with
  `CubicKeyframe(1.5, duration: 0.1)`, and dips before it jumps, with
  `SpringKeyframe(20.0, duration: 0.15, spring: .bouncy)` and then
  `SpringKeyframe(-60.0, duration: 1.0, spring: .bouncy)`
  ([wwdc23-keyframes]).
- **Rive's tools for it.** Its Cubic Value easing is "ideal for bounces,
  anticipation, and other effects that need to push beyond the final value",
  and "Hold doesn't interpolate values between keys" ([rive-easing]).
- **Moving holds.** For Duolingo's Lily, "The team created eight different
  head animations and eight body animations that dynamically combine,
  generating over 64 variations of neutral movements. This prevented
  repetitive idle loops." ([rive-lily])
- **Apple's symbol effects name the same moves.** "Bounce — Briefly scales a
  symbol with an elastic-like movement that goes either up or down and then
  returns to the symbol’s initial state", "Wiggle — Moves the symbol back and
  forth along a directional axis", and "Breathe — Smoothly increases and
  decreases the presence of a symbol, giving it a living quality."
  ([hig-sf-symbols])

[gdc-skullgirls]: https://gdcvault.com/play/1020575/
[wwdc23-keyframes]: https://developer.apple.com/videos/play/wwdc2023/10157/
[rive-easing]: https://rive.app/docs/editor/animate-mode/interpolation-easing
[hig-sf-symbols]: https://developer.apple.com/design/human-interface-guidelines/sf-symbols

### Reaction durations

- **Respond at once.** "Everything needs to respond instantly."
  ([wwdc18-fluid]) "A delay of less than 100 ms in a discrete user
  interaction is rarely noticeable, but even a few hundred milliseconds can
  make people feel that an app is unresponsive." ([apple-responsiveness])
- **Short and interruptible.** "Aim for brevity and precision in feedback
  animations", and "Let people cancel motion. As much as possible, don’t make
  people wait for an animation to complete before they can do anything,
  especially if they have to experience the animation more than once."
  ([hig-motion]) Springs settle slowly, so "you shouldn't wait for the
  settling duration for user-facing changes" ([wwdc23-springs]).
- **Bounce.** "When you're not sure, use a spring with bounce 0", and "you
  should be cautious about using values higher than around 0.4, since they
  may feel too exaggerated for a UI element" ([wwdc23-springs]).
- **Delight isn't decoration.** "The way to make a design delightful isn't by
  adding confetti or tacking on extra flourishes at the end of your process."
  ([wwdc26-design])
- **Published numbers.** Material 3's duration tokens run from 50 ms
  (`short1`) to 1000 ms (`extra-long4`), and "Selection controls have a short
  duration of 200ms with Standard easing" ([m3-tokens]). LottieFiles suggests
  "0.2–0.3s works well for UI" for tweened state changes ([lf-transitions]).
  Rive transitions default to instant: "The duration is set to zero by
  default" ([rive-transitions]).
- **Library defaults in Expo SDK 57.** Reanimated 4.5.1's `withTiming` runs
  300 ms with `Easing.inOut(Easing.quad)`. A bare `withSpring` is critically
  damped (mass 4, damping 120, stiffness 900), so it doesn't overshoot, and
  for the duration-based spring, "Actual duration is 1.5 times the value of
  perceptual duration." ([rea-timing]; [rea-spring])
- **Rivals' timings.** Wordle's pop is 100 ms, its shake 600 ms, its win
  bounce 1,000 ms, and its results panel waits 2,500 ms (see
  [Wordle's tiles, type, and motion](#wordles-tiles-type-and-motion)). Emoji
  Game's face changes 0.1 to 0.3 seconds after the answer and its board holds
  about 1.4 seconds; Zip's results arrive about 1.8 seconds after the last
  cell. Akinator's calm idle loop is one second of animation, played at 1.3
  times speed ([aki-game]).
- No game or app maker's source read gives a duration for a nod, a head
  shake, a shrug, or a celebration.

[apple-responsiveness]: https://developer.apple.com/documentation/xcode/improving-app-responsiveness
[hig-motion]: https://developer.apple.com/design/human-interface-guidelines/motion
[wwdc23-springs]: https://developer.apple.com/videos/play/wwdc2023/10158/
[wwdc26-design]: https://developer.apple.com/videos/play/wwdc2026/250/
[m3-tokens]: https://m3.material.io/styles/motion/easing-and-duration/tokens-specs
[lf-transitions]: https://docs.lottiefiles.com/en/creator/11_interactivity-and-state-machines/transitions

### State machines and keyframed poses

- **Rive.** "State Machines are a visual way to connect animations together
  and define the logic that drives the transitions", a blend state can "mix
  multiple timelines together", and "Exit Time tells the state machine how
  much of the state must play before transitioning." ([rive-sm];
  [rive-states]; [rive-transitions]) Its inputs are on the way out: data
  binding "replaces both state machine inputs and runtime event listeners"
  ([rive-data-binding]), and the React Native runtime's guide says its
  deprecated APIs "are removed" in version 0.6 ([rive-rn-migration]).
- **Rive in Expo.** The runtime, `@rive-app/react-native` 0.4.20 under MIT,
  is "not compatible with Expo Go. Instead, you’ll need to use a development
  build" ([rive-expo]), which Guessling already needs for RevenueCat
  ([RevenueCat notes][rc-dev-build]). Reduced motion is the file's job:
  "Rive does not automatically apply reduced motion." ([rive-reduced-motion])
- **Lottie.** lottie-react-native plays a segment by frames,
  `animationRef.current?.play(30, 120);`, and version 7.3.8's native
  commands are play, reset, pause, and resume, with no way to play a marker,
  though the format defines "Markers defining named sections of the
  composition" ([lottie-rn]; [lottie-spec]). Expo pins
  `lottie-react-native` ~7.3.8 for SDK 57 but no longer includes it in Expo
  Go ([expo-bundled]; [expo-pr-lottie]). LottieFiles' dotLottie player adds
  state machines, a "Named marker to play", and an Expo plugin
  ([dotlottie-rn]).
- **SVG with Reanimated.** Reanimated animates react-native-svg "both their
  geometry (cx, r, d, points, ...) and their appearance (fill, stroke,
  opacity, ...)" through `useAnimatedProps` ([rea-svg]), and both run in Expo
  Go ([expo-reanimated]). `withSequence` runs animations "in a sequence", and
  `Easing.back` "goes slightly back before moving forward", a built-in
  anticipation ([rea-sequence]; [rea-timing]).
- **What Reduce Motion asks.** App Store Connect: "If the motion itself
  conveys some meaning, such as a status change (for example, item moved to
  cart) or a hierarchical context transition (for example, this view is a
  subview of the prior view), don’t remove the animation entirely. Instead,
  consider providing a new animation that avoids motion, or at least reduces
  full screen motion, such as a dissolve, highlight fade, or color shift."
  ([asc-a11y-motion]) Apple's guidance lists "Tightening animation springs to
  reduce bounce effects" and "Replacing transitions in x-, y-, and z-axes with
  fades to avoid motion" ([hig-a11y]). The [Apple notes][apple-labels] cover
  the label's criteria.
- **Reduce Motion in Reanimated.** "By default all animations are configured
  with ReduceMotion.System", and then "withSpring and withTiming return the
  toValue immediately" ([rea-a11y]). So a nod built from `withSequence`
  becomes a still pose on its own, but a fade also jumps to its end unless it
  sets `ReduceMotion.Never`. `useReducedMotion` "returns a boolean indicating
  whether the reduced motion setting was enabled when the app started", and
  "Changing the reduced motion system setting doesn't cause your components
  to rerender." ([rea-use-reduced-motion]) React Native's AccessibilityInfo
  can report the change instead: "Fires when the state of the reduce motion
  toggle changes." ([rn-a11yinfo])

[rive-sm]: https://rive.app/docs/editor/state-machine/state-machine
[rive-states]: https://rive.app/docs/editor/state-machine/states
[rive-data-binding]: https://rive.app/docs/editor/data-binding/migration-guide
[rive-rn-migration]: https://rive.app/docs/runtimes/react-native/migration-guide
[rive-expo]: https://rive.app/docs/runtimes/react-native/adding-rive-to-expo
[rc-dev-build]: /docs/research/revenuecat-expo.md#development-builds-expo-go-and-preview-api-mode
[rive-reduced-motion]: https://rive.app/docs/editor/accessibility/reduced-motion
[lottie-rn]: https://github.com/lottie-react-native/lottie-react-native
[lottie-spec]: https://lottie.github.io/lottie-spec/latest/
[dotlottie-rn]: https://docs.lottiefiles.com/en/runtimes/distributions/react-native/v0.x/api-reference
[rea-svg]: https://docs.swmansion.com/react-native-reanimated/docs/guides/animating-svg/
[rea-sequence]: https://docs.swmansion.com/react-native-reanimated/docs/animations/withSequence/
[asc-a11y-motion]: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria
[rea-a11y]: https://docs.swmansion.com/react-native-reanimated/docs/guides/accessibility/
[rea-use-reduced-motion]: https://docs.swmansion.com/react-native-reanimated/docs/device/useReducedMotion/

## Color-blind-safe feedback

### WCAG 2.2 on color, contrast, and motion

WCAG 2.2 is the W3C Recommendation of December 12, 2024 ([wcag22]), and W3C's
guidance for software outside the web says Use of Color "applies directly as
written" there ([wcag2ict]).

- **1.4.1 Use of Color, Level A.** "Color is not used as the only visual
  means of conveying information, indicating an action, prompting a response,
  or distinguishing a visual element." ([wcag22])
- **When lightness counts.** Colors that also differ in lightness count "as
  an additional visual distinction, as long as the difference in relative
  luminance between the colors leads to a contrast ratio of 3:1 or greater."
  But "if content relies on the user's ability to accurately perceive or
  differentiate a particular color an additional visual indicator will be
  required regardless of the contrast ratio between those colors. For
  example, knowing whether an outline is green for valid or red for invalid."
  And: "This criterion requires a visible alternative to color."
  ([wcag-use-of-color])
- **1.4.3 Contrast (Minimum), Level AA.** Text needs "a contrast ratio of at
  least 4.5:1", and "Large-scale text and images of large-scale text have a
  contrast ratio of at least 3:1", large scale meaning "at least 18 point or
  14 point bold" ([wcag22]).
- **1.4.11 Non-text Contrast, Level AA.** "Parts of graphics required to
  understand the content" need "a contrast ratio of at least 3:1 against
  adjacent color(s)" ([wcag22]).
- **2.3.3 Animation from Interactions, Level AAA.** "Motion animation
  triggered by interaction can be disabled, unless the animation is essential
  to the functionality or the information being conveyed." Motion animation
  "does not include changes of color, blurring, or opacity which do not
  change the perceived size, shape, or position of the element." ([wcag22])
- **2.2.2 Pause, Stop, Hide, Level A.** Movement that starts automatically,
  "lasts more than five seconds", and "is presented in parallel with other
  content" needs "a mechanism for the user to pause, stop, or hide it"
  ([wcag22]).

[wcag2ict]: https://www.w3.org/TR/wcag2ict-22/
[wcag-use-of-color]: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html

### Apple on color and feedback

- **Color.** "Avoid relying solely on color to differentiate between objects,
  indicate interactivity, or communicate essential information." "For
  example, you can use text labels or glyph shapes to identify objects or
  states." ([hig-color])
- **Accessibility.** "Convey information with more than color alone. Some
  people have trouble differentiating between certain colors and shades. For
  example, people who are color blind may have particular difficulty with
  pairings such as red-green and blue-orange. Offer visual indicators, like
  distinct shapes or icons, in addition to color to help people perceive
  differences in function and changes in state." The page's correct example
  is "An illustration of a green circle containing a checkmark to the left of
  a red octagon containing an X." ([hig-a11y])
- **Several channels at once.** "When you use multiple ways to provide
  feedback, you reach more people and give them the opportunity to receive
  the feedback in ways that work for them. For example, when you provide
  feedback using color, text, sound, and haptics, people can receive it
  whether they silence their device, look away from the screen, or use
  VoiceOver." ([hig-feedback]) For games: "Prioritize perceivability. Make
  sure people can perceive your game’s content whether they use sight,
  hearing, or touch." ([hig-games])
- **The App Store's test.** App Store Connect's criteria for the
  Differentiate Without Color Alone label name the failure: "status buttons
  or icons whose only distinguishing difference is red 🔴 vs green 🟢 to
  indicate positive or negative". The remedy: "Differences like a red square
  🟥 or green circle 🟢 are perceivable by all sighted users, regardless of
  color perception ability." And: "Ideally, your app should be designed by
  default to convey information using more than color alone. Using a setting
  to invoke this experience should be a last resort or stop-gap solution"
  ([asc-a11y-color]). The [Apple notes][apple-labels] have every label's
  criteria.
- **The iPhone setting.** "Go to Settings > Accessibility > Display & Text
  Size.", then "Turn on Differentiate Without Color." Apple's own green
  switches show the idea: "You can also have switches use a vertical line to
  indicate when they’re on and a circle to indicate when they’re off."
  ([ug-display-colors])
- **What an Expo app can read.** SwiftUI exposes the setting: "If this is
  true, UI should not convey information using color alone and instead should
  use shapes or glyphs to convey information." ([swiftui-dwc]) React Native's
  AccessibilityInfo has no reader for it, but it has `isReduceMotionEnabled()`,
  `prefersCrossFadeTransitions()`, and `isDarkerSystemColorsEnabled()`, the
  flag UIKit ties to Increase Contrast ([rn-a11yinfo]; [uikit-dwc]).
  `DynamicColorIOS` takes "two mandatory keys: dark and light, and two
  optional keys highContrastLight and highContrastDark" ([rn-dynamiccolor]).
- **Rivals' labels.** On September 22, 2026, the App Store pages of NYT
  Games, Duolingo, LinkedIn, Akinator, Finch, and Headspace each said "The
  developer has not yet indicated which accessibility features this app
  supports." Apple News declared all seven labels, including Differentiate
  Without Color Alone: "Use shapes or text, in addition to or instead of
  color, to distinguish key information." ([as-apple-news])

[hig-feedback]: https://developer.apple.com/design/human-interface-guidelines/feedback
[hig-games]: https://developer.apple.com/design/human-interface-guidelines/designing-for-games
[ug-display-colors]: https://support.apple.com/guide/iphone/iph3e2e1fb0/ios
[uikit-dwc]: https://developer.apple.com/documentation/uikit/uiaccessibility/shoulddifferentiatewithoutcolor
[rn-dynamiccolor]: https://reactnative.dev/docs/dynamiccolorios
[as-apple-news]: https://apps.apple.com/us/app/apple-news/id1066498020

### Wordle's high-contrast mode

- **The setting.** NYT's help lists "High Contrast Mode - for contrast and
  color blindness improvements" ([nyt-wordle-help]). The served code labels
  it "High Contrast Mode" with "Contrast and colorblindness improvements",
  stores it as `colorblindMode`, and starts it off (`colorblindMode:!1`),
  while dark mode follows the system's `prefers-color-scheme`
  ([nyt-wordle-game]). The original Wordle of January 2022 called the same
  switch "Color Blind Mode", described as "High contrast colors"
  ([wordle-original]).
- **Tile colors.** From `--color-correct`, `--color-present`, and
  `--color-absent` under `:root`, `.dark`, and `.colorblind` in the served
  CSS ([nyt-wordle-game]):

  | Mode          | Correct   | Present   | Absent              | Letters on tiles |
  | ------------- | --------- | --------- | ------------------- | ---------------- |
  | Light         | `#6aaa64` | `#c9b458` | `#787c7e`           | White            |
  | Dark          | `#538d4e` | `#b59f3b` | `#3a3a3c`           | `#f8f8f8`        |
  | High contrast | `#f5793a` | `#85c0f9` | As in light or dark | Black            |

- **The share follows.** In high-contrast mode the result swaps 🟩 for 🟧 and
  🟨 for 🟦, and absent stays ⬜, or ⬛ in dark mode ([nyt-wordle-game]).
- **Contrast.** White letters on the light correct tile measure 2.78:1, below
  even the 3:1 for large text; black letters on the high-contrast orange
  measure 7.68:1.
- **Screen readers.** Each tile's label is a word: `"absent"`,
  `"present in another position"`, or `"correct"` ([nyt-wordle-game]).

[wordle-original]: https://web.archive.org/web/20220116001049/https://www.powerlanguage.co.uk/wordle/

### Published color-blind-safe palettes

- **Okabe and Ito.** The authors of Color Universal Design note, in
  parentheses, "both are strong protanopes". Their advice: "Do not convey
  information in color only. Show difference BOTH in color and shape (solid
  and dotted lines, different symbols, various hatching, etc.)." Red and
  green are "Difficult to distinguish colors between red and green with
  similar intensity (brightness)." In their palette, "For red, vermilion is
  used since it is recognizable also to protanopes", and "For green, bluish
  green is chosen so that it won't be confused with red or brown."
  ([okabe-ito])
- **The Okabe and Ito palette.** Read from the page's Fig. 16, which prints
  the values in the image, in RGB 0 to 255: black (0,0,0), orange
  (230,159,0), sky blue (86,180,233), bluish green (0,158,115), yellow
  (240,228,66), blue (0,114,178), vermilion (213,94,0), and reddish purple
  (204,121,167) ([okabe-ito]).
- **Paul Tol.** His bright scheme, "colour-blind safe" and "The main scheme
  for lines and their labels", is `#4477AA`, `#EE6677`, `#228833`,
  `#CCBB44`, `#66CCEE`, `#AA3377`, and `#BBBBBB`. His advice: "Use different
  types of lines and symbols for better clarity." ([tol])

### The share squares, measured

The emoji were drawn with Apple Color Emoji 22.0d3e2 on macOS 27.0 and read
at the center of each glyph. Apple lists Apple Color Emoji as an iOS system
font ([apple-fonts]), but an iPhone wasn't measured. Color-blind views use
Machado, Oliveira, and Fernandes's matrices ([machado]); see
[Sources and method](#sources-and-method).

| Symbol | In Guessling | Center color | Against white | Against black |
| ------ | ------------ | ------------ | ------------- | ------------- |
| 🟩     | Yes          | `#10B50E`    | 2.75:1        | 7.64:1        |
| 🟥     | No           | `#D72F18`    | 4.87:1        | 4.31:1        |
| ❌     | Wrong guess  | `#EB0000`    | 4.63:1        | 4.53:1        |
| 🟧     | Wordle's HC  | `#FF9112`    | 2.26:1        | 9.31:1        |
| 🟦     | Wordle's HC  | `#1567F3`    | 4.92:1        | 4.27:1        |

| Pair, ΔE00                        | Normal | Protanopia | Deuteranopia | Tritanopia |
| --------------------------------- | ------ | ---------- | ------------ | ---------- |
| 🟩 and 🟥                         | 73.6   | 29.6       | 8.9          | 68.6       |
| 🟧 and 🟦                         | 60.3   | 64.5       | 71.9         | 61.0       |
| Apple green and red, light mode   | 77.8   | 26.2       | 7.2          | 71.6       |
| Okabe–Ito bluish green, vermilion | 54.4   | 18.2       | 20.5         | 62.7       |

- 🟩 and 🟥 are the same shape with a lightness contrast of only 1.77:1, and
  under simulated deuteranopia their difference falls from 73.6 to 8.9. The
  orange and blue pair stays above 60 in all three simulations.
- Apple's published system colors behave the same way. Green `#34C759` and
  red `#FF383C` in light mode are 1.61:1 apart, and the Increased Contrast
  pair, `#008932` and `#E9152D`, is 1.00:1 apart, the same lightness
  ([hig-color]; values from its swatches' alt text).
- White text fails on Apple's default greens (2.22:1 on `#34C759`), while
  black text passes on all four green variants (4.62:1 to 11.42:1).

[apple-fonts]: https://developer.apple.com/fonts/system-fonts/
[machado]: https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html

### Yes and No without color

- Synthesis: Yes and No need a second cue, and the word is the minimum, not
  the design. WCAG counts the green-for-valid case as needing an indicator
  "regardless of the contrast ratio", Apple's model answer adds a checkmark
  and an X, and App Store Connect's changes the shape.
- Synthesis: the Guessling's pose can't be that cue alone, since Reduce
  Motion turns it into a fade and one still frame of a nod doesn't read as
  "yes". A still glyph per answer, a check for Yes, a cross for No, and a
  question mark for "Ask another way", keeps the cue in every mode.
- Synthesis: the share tells Yes from No by color alone, since 🟩 and 🟥 are
  the same shape. The ways out are Wordle's, an opt-in setting that shares 🟦
  and 🟧 instead, and App Store Connect's, a shape change such as 🟢 for Yes.
  Either changes SHARE-1 ([PRD][prd-share]), so it's a PRD decision.

[prd-share]: /docs/archive/guessling-prd.md#sharing-a-result

## Sound and haptics in puzzle games

- **NYT.** Wordle, Connections, and Strands have no sound or haptics in their
  web code, with no audio files and no vibration calls across the bundles;
  the native app's shell wasn't inspected. The help mentions sound for two
  games: Sudoku's "Play Sound on Solve - The app or website will play a
  jingle after the puzzle is completed successfully." ([nyt-sudoku-help]) and
  Pips' "Play sound: Enables in-game sounds." ([nyt-pips-help]), a switch
  that starts off in Pips' code, `sound:!1` ([nyt-pips-game]).
- **LinkedIn.** None of the Help articles or staff posts read mentions sound
  or haptics; the only game settings they name are Auto-check and Auto-place
  X's ([li-queens]).
- **Apple News+.** The only documented haptic is sudoku's. The guide says how
  "To turn off the vibrations you feel when you fill all the squares in a
  block, row, or column" by pointing to the iPhone's own settings
  ([ug-sudoku]).
- **Duolingo.** The brand guidelines say "Duo doesn't talk or make sounds."
  ([duo-guidelines]) No Duolingo page on its sound effects or haptics was
  found: support.duolingo.com now redirects to its help home, whose articles
  don't cover them, and no blog post does.
- **Finch and Headspace.** Finch: "There isn’t a separate in-app toggle for
  sounds—your device settings control them fully." ([finch-sound]) Headspace:
  "Please note that haptic assistance can only be turned on if closed
  captions are also turned on." ([hs-haptics])
- **Apple.** Apple's rules for switchable haptics with their documented
  meanings, and for sounds that follow the silent switch, are in the
  [Apple notes][apple-sound]. The accessibility guidance adds: "Use haptics in
  addition to audio cues." ([hig-a11y])
- Synthesis: the daily games Guessling's players know are silent, sound is the
  exception, such as Sudoku's solve jingle, and where it exists it can start
  off, as in Pips. The PRD's switches start sound and haptics on (SET-2), so
  each cue has to be short, obey the silent switch, and never carry meaning
  the word and pose don't.

[nyt-sudoku-help]: https://help.nytimes.com/360011158491-New-York-Times-Games/30467696592148-Sudoku
[nyt-pips-help]: https://help.nytimes.com/360011158491-New-York-Times-Games/pips
[nyt-pips-game]: https://www.nytimes.com/games/pips
[finch-sound]: https://help.finchcare.com/hc/en-us/articles/39759518297229-Sound-Settings
[hs-haptics]: https://help.headspace.com/hc/en-us/articles/1260804149670-Closed-Captions-and-Haptic-Assistance-Options
[apple-sound]: /docs/research/apple-requirements.md#sound-and-the-silent-switch

## Making a mascot as a small team

### Production options and effort

| Option             | Art made in                                     | Runtime, version, license                       | Expo Go | Cost to ship, per the owner                               |
| ------------------ | ----------------------------------------------- | ----------------------------------------------- | ------- | --------------------------------------------------------- |
| SVG and Reanimated | Any vector editor                               | react-native-svg 15.15.4, Reanimated 4.5.1; MIT | Yes     | Free                                                      |
| Rive               | Rive's editor                                   | `@rive-app/react-native` 0.4.20; MIT            | No      | Export needs Cadet: $9 a month yearly, $17 monthly        |
| Lottie             | After Effects with Bodymovin, or Lottie Creator | lottie-react-native ~7.3.8; Apache-2.0          | No      | LottieFiles' Free and Individual plans bar commercial use |

- **Rive.** On October 20, 2025, Rive wrote that "exports now move to paid
  plans", with "Cadet ($9/month annually, $17/month monthly) — For shipping
  live work." "Runtimes remain open-source under MIT", and "No runtime fee.
  Your exports keep working forever." ([rive-plans-blog]) Rive's claim for
  its format: "file sizes that are typically 10-15x smaller than equivalent
  Lottie files" ([rive-vs-lottie]).
- **Lottie.** "Lottie Creator is a browser-based animation editor — there is
  nothing to install." ([lf-creator]) LottieFiles' Free and Individual plans:
  "Only non-commercial use permitted"; Team and Enterprise are "Required for
  all commercial activities using LottieFiles services" ([lf-commercial]).
  LottieFiles' prices couldn't be read (see [Gaps](#gaps)).
- **SVG and Reanimated.** Both are "Included in Expo Go" and bundled with SDK
  57 ([expo-svg]; [expo-reanimated]; [expo-bundled]); the art can come from
  any vector editor.
- **What owners say about effort.** A GDC 2015 talk on small teams: "In the
  low budget and indie sectors, it's often one of the first areas to be cut
  down for financial reasons." ([gdc-bithell]) Duolingo's Lily took a team
  that "met twice a week" and a weekly file handoff ([rive-lily]); Duolingo's
  minimalist style was chosen because it was "fast to produce"
  ([duo-shape-language]). No owner gives hours or a team size for making a
  mascot in a day.
- Synthesis: for a one-day art budget, Duolingo's and Akinator's cheap moves
  recur: one or two shapes per part, circles for hands, and one body reused
  under several faces.

[rive-plans-blog]: https://rive.app/blog/rive-s-new-9-mo-plan
[lf-creator]: https://docs.lottiefiles.com/en/creator/02_quickstart/setup-and-access
[lf-commercial]: https://help.lottiefiles.com/commercial-use-guide
[expo-svg]: https://docs.expo.dev/versions/v57.0.0/sdk/svg/
[gdc-bithell]: https://gdcvault.com/play/1021790/

### AI-assisted art and the rules

- **Shipaton welcomes AI tools.** "Any AI tool. Any app idea. Just ship it."
  ([sh-vibe]) The submission guide limits only the write-up: "You can use AI
  to correct spelling and formatting, but don’t let AI write your whole
  description. No one will like reading that." ([sh-submit])
- **No disclosure rule, but an ownership rule.** Neither the official rules
  nor the Best Game page mentions AI ([dp-rules]; [sh-best-game]). The rules
  do require a submission to "(a) be your (or your Team, or Organization’s)
  original work product; (b) be solely owned by you, your Team, your
  Organization with no other person or entity having any right or interest in
  it", and the demo video "must not include third party trademarks, or
  copyrighted music or other material unless the Entrant has permission to
  use such material." ([dp-rules])
- **Apple.** No App Review Guideline mentions AI-generated art; the only rule
  on AI is 5.1.2(i), on sharing personal data with third-party AI
  ([Apple notes][apple-ai]). Guideline 5.2 asks: "Make sure your app only
  includes content that you created or that you have a license to use."
  ([apple-guidelines])
- **Copyright in AI output.** The US Copyright Office "concludes that the
  outputs of generative AI can be protected by copyright only where a human
  author has determined sufficient expressive elements. This can include
  situations where a human-authored work is perceptible in an AI output, or a
  human makes creative arrangements or modifications of the output, but not
  the mere provision of prompts." ([usco-ai])
- **Precedent.** Shipaton 2025's Grand Prize winner wrote that "The entire app
  — design, code, and assets — was produced through AI-assisted development"
  ([brief-lessons]).
- Synthesis: AI can explore the look; a person should then draw the final
  character as vector parts, set its key poses, and time its motion, which
  both the rules' "original work product" and the Copyright Office's
  "sufficient expressive elements" favor. Credit the tools in the write-up,
  as the [product][product-character] says.

[sh-vibe]: /docs/sources/www.shipathon.com/[]-vibe-code.md
[sh-submit]: /docs/sources/www.shipathon.com/[]-blog-how-to-submit-your-app-for-shipaton.md
[apple-ai]: /docs/research/apple-requirements.md#rules-about-ai-since-2025
[apple-guidelines]: https://developer.apple.com/app-store/review/guidelines/
[usco-ai]: https://www.copyright.gov/newsnet/2025/1060.html
[brief-lessons]: /docs/BRIEF.md#lessons-from-past-winners
[product-character]: /docs/archive/guessling-product.md#the-guessling-character

## Findings for DESIGN.md

- **Four reactions, four shapes.** Synthesis: give each reaction its own axis
  and silhouette, so each key pose reads as a still. Yes is a vertical dip of
  the head with happy eyes; No is a horizontal turn of the head with open
  eyes and a small, kind mouth; "Ask another way" raises the shoulders, opens
  the hands, and tilts the head; the celebration is the biggest shape of all,
  arms up and a jump with a squash on landing, as Akinator's `triomphe` and
  Apple's celebration example do. See
  [How characters show yes, no, unsure, and delight](#how-characters-show-yes-no-unsure-and-delight).
- **Timing.** Synthesis: show the word the moment the answer arrives, within
  100 ms, and start the motion with it; don't hold the word back for the
  animation. Use a small anticipation, then the move, then a hold on the key
  pose until the next answer. As starting values, anchored to the sources
  rather than stated by them: a nod of 0.4 to 0.6 seconds, a shake of
  about 0.6 seconds like Wordle's, a shrug of about 0.7 seconds with a short
  hold, and a celebration of about 1 second like Wordle's win bounce. Never
  block typing the next question on a reaction. See
  [Reaction durations](#reaction-durations).
- **Reduce Motion, built right.** Synthesis: replace each reaction with a
  cross-fade of about 200 ms to its still key pose, which WCAG's definition
  of motion and App Store Connect's "dissolve" both allow. In Reanimated,
  give that fade `ReduceMotion.Never`, or the system setting snaps it too,
  and listen to AccessibilityInfo's change event, since `useReducedMotion`
  reads the setting only at startup; the TRD's current plan uses
  `useReducedMotion()` ([TRD][trd-reactions]). See
  [State machines and keyframed poses](#state-machines-and-keyframed-poses).
- **A second cue for every answer.** Synthesis: pair each answer's color with
  a glyph of its own shape, a check for Yes, a cross for No, and a question
  mark for "Ask another way", as in Apple's model answer, because green and
  red nearly merge for deuteranopes (ΔE00 8.9 for 🟩 and 🟥). See
  [Yes and No without color](#yes-and-no-without-color).
- **Answer colors that match the share.** Synthesis: take Yes and No from the
  hues of 🟩 (`#10B50E`) and 🟥 (`#D72F18`), so a round and its share read
  alike, and keep them for answers only. Check every chip's text: white fails
  on greens this light, and on red the right text color depends on the
  shade. Give each color light, dark, and Increase Contrast variants through
  `DynamicColorIOS`, and make the neutral for "Ask another way" plainly
  neither green nor red. See
  [The share squares, measured](#the-share-squares-measured).
- **The share's color-only row.** Synthesis: 🟩 and 🟥 differ only in color,
  so decide in the PRD whether to add Wordle's remedy, a high-contrast option
  that shares 🟦 and 🟧, or App Store Connect's, a Yes symbol of another
  shape such as 🟢. The measured orange and blue pair stays far apart in
  every simulation.
- **The reveal.** Synthesis: stage the end like the rivals' best beats. Let
  the last reaction land, hold 1.5 to 2.5 seconds (Emoji Game holds for
  about 1.4, Zip about 1.8, Wordle 2.5), then show the answer's name large and
  plain, the hint in quotes, the row of symbols exactly as it will be shared,
  the turns used, the countdown, Share, and "Play yesterday's?". When the
  round isn't solved, the Guessling presents the answer warmly, like the
  genie's bow, never with a defeat pose. Show the screen at once, as
  Duolingo does, even while statistics load. A fixed word by turns used, in
  the manner of Wordle's six, is optional and must stay kind.
- **A recognizable screenshot.** Synthesis: the Guessling is the brand: large
  on the Today screen, in the key pose of the latest answer beside its word,
  in one signature body color that is not an answer color, kept apart the
  way NYT keeps brand color from gameplay color. Below it, the history's
  answer chips mirror the share, with the turn meter and the hint in curly
  quotes as in the share. The icon uses the same face in a silhouette that
  survives Apple's tinted and clear variants.
- **Type.** Synthesis: use SF Pro Rounded through `fontFamily: 'ui-rounded'`,
  which React Native supports on iOS ([rn-text-style]). System fonts
  "automatically support Dynamic Type (where available) and respond when
  people turn on accessibility features, such as Bold Text", while "If you
  use a custom font, make sure it implements the same behaviors."
  ([hig-typography]) The rounded face suits a character built from rounded
  shapes; NYT's Karnak and Franklin show what a signature typeface adds, at a
  cost this schedule can't pay.
- **More states than four.** Synthesis: plan still poses for idle, thinking
  while an answer is pending (a head tilt, like Lily's), Yes, No, "Ask
  another way" (also used for "Ask a yes-or-no question" and the question
  list), a wrong guess, solved, the unsolved reveal, and resting or busy
  (ASK-10, STATE-3). Start the thinking pose only after a short delay, so a
  fast answer doesn't flicker. Akinator covers a whole game with 18 stills.
- **Production.** Synthesis: build version 1.0 as the TRD plans, an SVG
  character in a few parts (head, body, arms, eyes, brows, mouth), animated
  with Reanimated transforms; it is free, bundled with SDK 57, and its key
  frames double as the stills. Rive is the upgrade if the state graph grows:
  exports need the Cadet plan, $9 a month billed yearly; the development
  build already exists; and new files should use data binding, not inputs.
  Lottie fits worst: no marker playback in React Native, no Expo Go, and a
  commercial plan if LottieFiles' tools make the art. See
  [Production options and effort](#production-options-and-effort).
- **AI-assisted art.** Synthesis: allowed, with no disclosure rule from Apple
  or Shipaton. Because the rules require "original work product" that is
  "solely owned", use AI to explore, then redraw and pose the character by
  hand, and credit the tools. See
  [AI-assisted art and the rules](#ai-assisted-art-and-the-rules).
- **Sound and haptics.** Synthesis: a short, distinct cue per answer and a
  success sound on the solve, all behind Settings' switches and the silent
  switch; a light haptic per answer and a success haptic on the solve, as the
  TRD plans. The round must be complete without any of them. See
  [Sound and haptics in puzzle games](#sound-and-haptics-in-puzzle-games).

[trd-reactions]: /docs/archive/guessling-trd.md#reactions-sound-and-haptics
[rn-text-style]: https://reactnative.dev/docs/0.86/text-style-props
[hig-typography]: https://developer.apple.com/design/human-interface-guidelines/typography

## Conflicts between sources

- **Blue and orange.** Apple lists "red-green and blue-orange" as hard
  pairings ([hig-a11y]), while Wordle's high-contrast mode swaps in orange and
  blue, Okabe and Ito's palette leads with orange and blue ([okabe-ito]), and
  Tol's vibrant scheme holds both ([tol]). Measured, every orange and blue
  pair tried stayed at ΔE00 48.8 or more in all three simulations, though
  their lightness contrast was only 1.00:1 to 2.68:1.
- **Red and green.** Tol: "Contrary to popular belief, pure red and green can
  be distinguished." ([tol]) Okabe and Ito: "Difficult to distinguish colors
  between red and green with similar intensity (brightness)." ([okabe-ito])
  The interface pairs measured here are close in lightness, which is Okabe
  and Ito's case.
- **Contrast thresholds.** Apple's table allows 3:1 for "18 pts" and for any
  bold text ([hig-a11y]); WCAG's large text starts at "at least 18 point or
  14 point bold" ([wcag22]). Apple's Dark Mode page says "no lower than 4.5:1"
  with no size exception ([hig-dark-mode]).
- **What Increase Contrast does.** Apple says "With the Increase Contrast
  setting turned on, the color differences become far more apparent."
  ([hig-color]) Its published Increased Contrast green and red, `#008932` and
  `#E9152D`, each reach 4.5:1 on white but are 1.00:1 against each other.
- **A setting or the default.** SwiftUI's flag tells apps to switch to shapes
  when Differentiate Without Color is on ([swiftui-dwc]); App Store Connect
  calls relying on a setting "a last resort or stop-gap solution"
  ([asc-a11y-color]); Wordle's high-contrast mode is a setting that starts off
  ([nyt-wordle-game]).
- **Duolingo on guilt and motion.** The guidelines say "Duo isn't shy about
  checking in or laying on a guilt trip" but list "Mean" among what Duo
  isn't, and say "Duo mostly stands still" while the streak team wanted
  milestones "much more exciting and powerful" ([duo-guidelines];
  [duo-streak-milestone]). The split is by channel: guilt in notifications,
  support in lessons.
- **Best Game wording.** The category page asks for "a clear art direction"
  ([sh-best-game]); the official rules' criteria name "art direction" in the
  summary, but none of their three questions asks about it ([dp-rules]).
- **Wordle's settings.** The help says "for contrast and color blindness
  improvements" ([nyt-wordle-help]); the game says "Contrast and
  colorblindness improvements" ([nyt-wordle-game]).
- **Connections' names.** The help calls the hardest group "Purple"
  ([nyt-connections-help]); its stylesheet token is `--connections-maroon`,
  while `--connections-purple` is a separate brand color, `#b4a8ff`
  ([nyt-connections-game]).
- **Reanimated's spring.** The `withSpring` docs list a 550 ms duration
  default ([rea-spring]), but a bare `withSpring(x)` runs the physics spring;
  the duration-based one applies only when a duration or damping ratio is
  passed ([rea-451]).
- **Lottie in Expo.** Expo still pins `lottie-react-native` ~7.3.8 for SDK 57
  ([expo-bundled]) but removed it from Expo Go ([expo-pr-lottie]).
- **File sizes.** Rive says its files are "typically 10-15x smaller than
  equivalent Lottie files" ([rive-vs-lottie]); LottieFiles says its dotLottie
  format has "Smaller file size" ([lf-format]). Both are owners' claims about
  their own formats.
- **Okabe and Ito's numbers.** Their text gives vermilion as "RGB=100%,32%,0%
  or #FF2000", but 32% would be `#52`, and Fig. 16 gives (213,94,0)
  ([okabe-ito]); this note uses the figure.

[hig-dark-mode]: https://developer.apple.com/design/human-interface-guidelines/dark-mode
[duo-streak-milestone]: https://blog.duolingo.com/streak-milestone-design-animation/
[rea-451]: https://www.npmjs.com/package/react-native-reanimated/v/4.5.1
[lf-format]: https://docs.lottiefiles.com/en/format

## Gaps

What the sources don't say that DESIGN.md needs, as of September 22, 2026:

- **Durations for these reactions.** No game or app maker states how long a
  nod, a head shake, a shrug, or a celebration should take; the values under
  [Findings for DESIGN.md](#findings-for-designmd) are anchored, not stated.
- **The Illusion of Life.** No readable copy published by Disney exists; the
  Internet Archive has lending copies only ([disney-illusion]).
- **Effort for a one-day mascot.** No owner gives hours or a team size.
- **Duolingo's sound, haptics, and motion settings.** design.duolingo.com
  redirects to the blog's design hub ([duo-design-hub]) and
  support.duolingo.com to the help home; no page on them was found, and the
  brand guidelines were read in an archived copy only.
- **Talk transcripts.** YouTube asked to "Sign in to confirm you’re not a
  bot", so Duolingo's Duocon talks and Shipaton's own "Shipaton 2026: Best
  game" video, dated August 1, 2026, were read by title and description at
  most.
- **Headspace and Finch.** No maker-written principles on either character's
  shape, expressions, or reactions.
- **Akinator.** Nothing from Elokence on the genie's visual design or who
  drew it; its 901 MB press kit wasn't downloaded.
- **LinkedIn.** No source on sound or haptics, no engineering or design post
  on building the games, and the solve animation only in 2024 and 2025 promo
  GIFs; the game code wasn't read.
- **Apple.** No text describes the solve animations, the confetti, or the
  Emoji Game face, and none mentions puzzle sounds.
- **NYT.** The Games app's native shell wasn't inspected for sound or
  haptics, no talk by NYT staff was found, and no post explains the icon set
  or why Wordle is green and yellow, a palette older than NYT's ownership.
- **Emoji on an iPhone.** Measured on macOS only; whether iOS 27 draws the
  same pixels wasn't tested.
- **Differentiate Without Color in Expo.** No React Native or Expo doc shows a
  way to read it.
- **Color-blind simulation.** Machado and colleagues don't say whether to
  apply their matrices in linear or gamma-encoded RGB, and no source gives a
  ΔE00 threshold for "distinguishable".
- **LottieFiles prices.** lottiefiles.com/pricing refused `curl` and headless
  Chrome.

[duo-design-hub]: https://blog.duolingo.com/hub/design/

## See also

- [Product](/docs/archive/guessling-product.md#the-guessling-character): the
  Guessling's role, personality, voice, and art direction.
- [Product requirements](/docs/archive/guessling-prd.md#accessibility): the
  accessibility, sharing, and settings rules the design has to meet.
- [Technical requirements](/docs/archive/guessling-trd.md#reactions-sound-and-haptics):
  how the reactions, sound, and haptics are built.
- [Daily puzzle notes][daily]: release times, share formats, streaks,
  archives, and end-of-round screens.
- [Apple notes](/docs/research/apple-requirements.md#sharing-haptics-and-sound):
  share sheet, haptics, and sound rules, and the Accessibility Nutrition
  Labels.
- [Brief](/docs/BRIEF.md#rules-to-watch) and
  [context](/docs/CONTEXT.md#what-the-official-rules-add): Shipaton's rules.

[daily]: /docs/research/daily-puzzles.md
[dp-rules]: https://revenuecat-shipaton-2026.devpost.com/rules
[nyt-wordle-game]: https://www.nytimes.com/games/wordle/index.html
[nyt-wordle-help]: https://help.nytimes.com/360011158491-New-York-Times-Games/24611727334932-Wordle
[nyt-connections-game]: https://www.nytimes.com/games/connections
[nyt-connections-help]: https://help.nytimes.com/360011158491-New-York-Times-Games/28525912587924-Connections
[nyt-open-dark-2025]: https://open.nytimes.com/the-new-york-times-games-path-to-dark-mode-345dfe464e1a
[li-queens]: https://www.linkedin.com/help/linkedin/answer/a6269510
[ug-sudoku]: https://support.apple.com/guide/iphone/iph9b53d2906/ios
[sh-best-game]: /docs/sources/www.shipathon.com/[]-categories-best-game-award.md
[duo-guidelines]: https://web.archive.org/web/20260823211810/https://design.duolingo.com/main.97ab633ac458b0ea94d6.js
[rive-lily]: https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life
[duo-shape-language]: https://blog.duolingo.com/shape-language-duolingos-art-style/
[aki-game]: https://en.akinator.com/
[disney-illusion]: https://books.disney.com/book/the-illusion-of-life/
[wwdc18-fluid]: https://developer.apple.com/videos/play/wwdc2018/803/
[rive-transitions]: https://rive.app/docs/editor/state-machine/transitions
[rea-timing]: https://docs.swmansion.com/react-native-reanimated/docs/animations/withTiming/
[rea-spring]: https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring/
[expo-bundled]: https://github.com/expo/expo/blob/sdk-57/packages/expo/bundledNativeModules.json
[expo-pr-lottie]: https://github.com/expo/expo/pull/37969
[expo-reanimated]: https://docs.expo.dev/versions/v57.0.0/sdk/reanimated/
[apple-labels]: /docs/research/apple-requirements.md#what-each-label-claims
[hig-a11y]: https://developer.apple.com/design/human-interface-guidelines/accessibility
[rn-a11yinfo]: https://reactnative.dev/docs/0.86/accessibilityinfo
[wcag22]: https://www.w3.org/TR/WCAG22/
[hig-color]: https://developer.apple.com/design/human-interface-guidelines/color
[asc-a11y-color]: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/differentiate-without-color-alone-evaluation-criteria
[swiftui-dwc]: https://developer.apple.com/documentation/swiftui/environmentvalues/accessibilitydifferentiatewithoutcolor
[okabe-ito]: https://jfly.uni-koeln.de/color/
[tol]: https://sronpersonalpages.nl/~pault/
[rive-vs-lottie]: https://rive.app/blog/rive-as-a-lottie-alternative

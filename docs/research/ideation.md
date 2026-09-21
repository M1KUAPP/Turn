# Shipaton 2026 ideation log

The ten rounds of ideation behind the idea in `docs/IDEA.md`, run on September
22, 2026 for RevenueCat Shipaton 2026. They start from the
[brief](/docs/BRIEF.md), the [context](/docs/CONTEXT.md), the
[Jev notes](jev.md), and the [gallery notes](gallery-2026.md), and narrow
thirty candidates to one idea; each round ends with a decision the next one
builds on.

Contents:

1.  [Round 1: constraints and rubric](#round-1-constraints-and-rubric)
1.  [Round 2: thirty candidates](#round-2-thirty-candidates)
1.  [Round 3: screening](#round-3-screening)
1.  [Round 4: scoring](#round-4-scoring)
1.  [Round 5: evidence](#round-5-evidence)
1.  [Round 6: red team](#round-6-red-team)
1.  [Round 7: the choice](#round-7-the-choice)
1.  [Round 8: monetization](#round-8-monetization)
1.  [Round 9: scope, stack, and schedule](#round-9-scope-stack-and-schedule)

## Round 1: constraints and rubric

**Question:** what must any idea satisfy, given a start on September 22 and a
deadline of September 30, 2026, and how will ideas be compared?

**Method:** hard constraints taken from the brief, the context, the Jev
notes, and the goal, and a rubric weighted toward what judges score and what
can ship in time.

### Hard constraints

An idea that breaks one is out.

- **C1. The App Store is the only store in time.** A new personal Google Play
  account needs a 14-day closed test, then production access and review, so a
  test started on September 22 ends too late. The Galaxy Store needs seller
  status first, which Samsung reviews in "about 4 business days" for a
  private seller, then Pre-Review. This rules out Ship Kotlin Everywhere,
  which needs Google Play too, and Best App for Galaxy.
  ([store review][ctx-review])
- **C2. In review by September 24.** The brief's review target, September
  23, leaves no time to build. Apple reviews "90% of submissions" in under 24
  hours on average, so a submission on September 24 leaves time for one
  rejection and for the day an approved app can take to appear. That means
  one core loop and no backend beyond the thin one Jev needs.
  ([review timing][brief-review])
- **C3. Jev makes a decision users rely on.** The goal requires Jev in the
  project. Jev answers typed questions with a choice, a score, or a yes-or-no
  probability, never text; it reads only text and has no mobile SDK. So the
  idea must turn on a judgment about text, and the app calls Jev through a
  thin backend that holds the key. ([Jev notes][jev])
- **C4. A real purchase through RevenueCat in the first build.** The
  subscription goes in the same submission as the app, after the Paid Apps
  Agreement, tax, and banking. ([Apple essentials][ctx-apple])
- **C5. Free, unrestricted judge access until October 13.** Judges get offer
  codes with a free month or longer, since a user's trial ends too soon.
  ([monetization][ctx-money])
- **C6. Nothing that slows review.** An account only if the product needs
  one, since accounts need in-app deletion; no third-party login; explicit
  permission before personal data goes to a third-party AI such as Jev, under
  guideline 5.1.2(i); and no feed of user-generated content.
  ([Apple essentials][ctx-apple])
- **C7. At most one Influencer Award, and no creator's likeness.** The rules
  allow one per project, and a creator's name or image needs express written
  consent. ([official rules][ctx-rules])

[ctx-review]: /docs/CONTEXT.md#getting-through-store-review
[brief-review]: /docs/BRIEF.md#app-review-timing
[jev]: jev.md
[ctx-apple]: /docs/CONTEXT.md#apple-app-store-review-essentials
[ctx-money]: /docs/CONTEXT.md#monetization-and-paywalls
[ctx-rules]: /docs/CONTEXT.md#what-the-official-rules-add

### Assumptions

The goal directive rules out asking, so these are assumed:

- The team is one to three people, starting from no code on September 22,
  2026, with an active Apple Developer Program membership.
- The team has no Google Play account with production access and no Galaxy
  Store seller status.
- The team is not all students (Next Gen) and not RevenueCat or sponsor staff
  (Conflict of Interest).
- "10-round ideation" means ten rounds in sequence, each with its own
  question and decision, from wide to narrow.
- The launch budget is small, so paid campaigns with a daily minimum, such as
  Noise's $50, are out.
- The team can get a Jev API key on September 22, 2026. Jev is in early
  access, so a key is the first thing to request.
- TypeSafe's agreement bars announcing the customer relationship without
  consent, so the team asks TypeSafe before naming Jev in the Devpost
  write-up.

### Rubric

Each idea scores 1 to 5 on each criterion; the total is the sum of weight ×
score ÷ 5, out of 100. The weights follow what judges score (category fit,
monetization, and the first two minutes of video) and what the date allows
(buildability).

| Criterion        | Weight | A 5 means                                                                                |
| ---------------- | ------ | ---------------------------------------------------------------------------------------- |
| Category fit     | 25     | Meets every point judges list for one uncrowded category, plus one or two secondary ones |
| Buildability     | 20     | One core loop that can be in review by September 24, with low review risk                |
| Jev centrality   | 15     | Jev does the job users pay for, and the video can show it                                |
| Monetization fit | 15     | A paywall at the moment of value, common price points, and judge codes                   |
| Demo-ability     | 10     | The "aha" shows on a device within 15 seconds                                            |
| Differentiation  | 10     | Few or no similar entries in the 2026 gallery                                            |
| Early traction   | 5      | A first audience the team can reach before September 30                                  |

**Decision:** Round 3 screens with C1 to C7, and Rounds 4 and 10 score with
this rubric.

## Round 2: thirty candidates

**Question:** what could we build?

**Method:** three subagents wrote ten ideas each, in parallel and without
seeing each other's work, after reading Round 1, the Jev notes, the gallery
notes, the brief, the context, and the category pages. Each took one lens:

- **A, creator briefs:** two ideas for each of the five Influencer Award
  briefs.
- **B, RevenueCat and sponsor categories:** HAMM, Design, Peace Prize, Best
  Game, Keep Them Coming Back, Growth Loop, Funnel Vision, Idea to Income, and
  #BuildInPublic.
- **C, Jev first:** ideas that start from what Jev does well, aimed at the
  gallery's open spaces.

Each idea came back with a logline, its evidence, a three-step loop, the
questions Jev is asked, prices and the paywall moment, categories, crowding,
and its riskiest part. The table keeps a one-line pitch.

| #   | Idea             | Pitch                                                                        | Lens | Primary category           | Jev's job                                            |
| --- | ---------------- | ---------------------------------------------------------------------------- | ---- | -------------------------- | ---------------------------------------------------- |
| 1   | Blanks           | Fills any form from the user's saved text, images, and files                 | A    | Productivity               | Choice matches each form field to a saved item       |
| 2   | Cannery          | Picks the saved reply and files for an incoming client message               | A    | Productivity               | Choice picks the reply; a Noul per file              |
| 3   | Side Order       | Points to the item on this menu that makes the chosen dish more filling      | A    | Nutrition & Healthy Eating | Nouls check the dish; Choice picks a menu line       |
| 4   | Lasted           | Learns which real meals kept the user satisfied, from notes and a check-in   | A    | Nutrition & Healthy Eating | Nouls tag the meal; Score reads satisfaction         |
| 5   | Midstride        | Turns a one-line perimenopause check-in into one session for today           | A    | Yoga & Fitness             | Scores read the check-in; Choice picks a session     |
| 6   | Pocket Studio    | Picks today's session from the classes the user already saved                | A    | Yoga & Fitness             | Choice over the user's saved sessions                |
| 7   | Preflight        | A written, branching rehearsal where the other person reacts to the manager  | A    | Career Coaching            | Choice routes to the next written line               |
| 8   | Hold the Line    | Five spoken pushback drills a day, judged on the spot                        | A    | Career Coaching            | Choice labels the reply; Score rates steadiness      |
| 9   | Pinchlist        | A game bucket list shared by link, with a friend's games ranked for the user | A    | Gaming                     | Score ranks a friend's games                         |
| 10  | Hype Haul        | Pulls every game in a shared showcase recap into the bucket list             | A    | Gaming                     | Choice picks titles from candidates                  |
| 11  | Overturn         | Reads a health-insurance denial letter and unlocks the matching appeal kit   | B    | HAMM                       | Choices read the reason, plan, and deadline          |
| 12  | Sift             | Collapses an exported group chat into the few messages that need the user    | B    | Design                     | A Choice and Nouls label every message               |
| 13  | Earshot          | Alerts Deaf and hard-of-hearing travelers to announcements about their trip  | B    | Peace Prize                | Nouls, a Choice, and a Score judge each announcement |
| 14  | Judgy            | A referee that rules on every answer in a party category game                | B    | Best Game                  | Nouls and a Score rule on each answer                |
| 15  | Sleep On It      | Times one "still want it?" push to the reason for an impulse buy             | B    | Keep Them Coming Back      | Nouls and a Score read the reason                    |
| 16  | Take-Home        | Sorts a school newsletter down to what one class needs this week             | B    | Growth Loop                | A Choice and a Noul per line                         |
| 17  | Ebb              | Tags evening notes against a perimenopause symptom list for a doctor         | B    | Funnel Vision              | About 30 Nouls per note, and a Score per symptom     |
| 18  | Dismissed        | Reads a parking ticket and the driver's story to pick grounds for appeal     | B    | Funnel Vision              | Choices pull ticket fields; Nouls test the grounds   |
| 19  | Hunch            | A daily 20-questions game that answers any yes-or-no question                | B    | Best Game                  | A Noul answers each question from a fact card        |
| 20  | Flagged          | Checks a job posting for fake, ghost, and bait-and-switch red flags          | B    | #BuildInPublic             | A Noul per red flag; a Choice finds the line         |
| 21  | SaySo            | An AAC app that ranks the user's own phrases as they type a few letters      | C    | Peace Prize                | Choice over the phrasebook, with a none option       |
| 22  | Called           | Merged into 13                                                               | C    | Peace Prize                | —                                                    |
| 23  | Subtext          | Tags the tone of each message for autistic and ADHD adults                   | C    | Peace Prize                | A Choice, a Score, and Nouls per message             |
| 24  | Answered         | Plays a family member's recorded answer to a repeated dementia question      | C    | Peace Prize                | Choice picks a recording or none                     |
| 25  | Stepwise         | Matches an older adult's phone problem to a checked picture guide            | C    | Peace Prize                | Choice over the guide library                        |
| 26  | Ebb (daily plan) | Merged into 5                                                                | C    | Yoga & Fitness             | —                                                    |
| 27  | Stillwake        | At 3 a.m., reads one sentence and picks one back-to-sleep technique          | C    | Design                     | Choice picks the technique; Nouls gate safety        |
| 28  | Twenty Asks      | Merged into 19                                                               | C    | Best Game                  | —                                                    |
| 29  | Shout Three      | Merged into 14                                                               | C    | Best Game                  | —                                                    |
| 30  | Hollow Pines     | A text adventure where any typed action maps to an authored one              | C    | Best Game                  | Choice maps the input to the scene's actions         |

Merged duplicates, each kept under the lower number:

- **22 into 13:** both alert Deaf and hard-of-hearing people to announcements.
  Earshot keeps a traveler's own alerts free; Called's name calls at clinics
  and counters become a paid watch.
- **26 into 5:** both turn a perimenopause check-in into today's session for
  Simone's brief. Ebb's safety question joins Midstride.
- **28 into 19:** both are a daily 20-questions game. Best Game becomes
  Hunch's primary category; Idea to Income, lens B's choice, would need the
  app built on Replit.
- **29 into 14:** both make Jev the referee of a party word game. The spoken,
  five-second version stays an option.

Patterns across the thirty:

- Every idea keeps Jev choosing among things people wrote: replies,
  sessions, scenario lines, guides, or verdicts. No idea shows users
  generated text.
- The most common price was $7.99 a month, in 15 of the 30 ideas; yearly
  plans ran from $19.99 to $39.99, and 20 ideas offered a 3-day trial. Every
  idea gives judges offer codes.
- The risks cluster in authored content (scenarios, sessions, guides, fact
  cards) and in review: consent under 5.1.2(i), microphone and
  speech-recognition prompts, and health data.

**Decision:** the 26 distinct ideas go to Round 3.

## Round 3: screening

**Question:** which ideas can ship in time?

**Method:** each of the 26 distinct ideas is checked against C1 to C7 in
order, and a failure names the first constraint it breaks. The reasons for
failing come from the riskiest part each generator reported.

| #   | Idea          | Result   | Reason                                                                                     |
| --- | ------------- | -------- | ------------------------------------------------------------------------------------------ |
| 1   | Blanks        | Pass     | Forms come in as screenshots or PDFs, read on the device                                   |
| 2   | Cannery       | Pass     | Messages come in by paste or share                                                         |
| 3   | Side Order    | Pass     | Menus are read on the device; the reasons are a short written list                         |
| 4   | Lasted        | Pass     | The check-in is a local notification; review needs sample history                          |
| 5   | Midstride     | Pass     | A starter set of written sessions is enough                                                |
| 6   | Pocket Studio | Pass     | Only if classes are saved by pasting a link, with the share extension left for an update   |
| 7   | Preflight     | Pass     | Only with a small scenario set: two free and a few paid                                    |
| 8   | Hold the Line | Pass     | Only with two decks at launch                                                              |
| 9   | Pinchlist     | Pass     | Lists travel in a link, with no accounts                                                   |
| 10  | Hype Haul     | Fails C2 | The core needs a Safari extension that reads arbitrary pages, tuned on real recaps         |
| 11  | Overturn      | Fails C2 | About ten accurate appeal letters across four kinds of plans can't be written and checked  |
| 12  | Sift          | Pass     | The chat export arrives as a file; a sample chat covers review                             |
| 13  | Earshot       | Pass     | Listening stays in the foreground; a demo mode plays recorded announcements                |
| 14  | Judgy         | Pass     | No personal data; the work is in the timer, hand-off, and reveal                           |
| 15  | Sleep On It   | Pass     | The backend's only extra job is one OneSignal call per item                                |
| 16  | Take-Home     | Pass     | Children's names are removed on the device before any text leaves it                       |
| 17  | Ebb           | Pass     | The web funnel is RevenueCat's; the app must handle Redemption Links                       |
| 18  | Dismissed     | Fails C2 | Tickets differ by city, and the scan and appeals need testing on real tickets from several |
| 19  | Hunch         | Pass     | About 30 fact cards are enough to launch                                                   |
| 20  | Flagged       | Pass     | Pasted text only; the highlighted-line view answers the minimum-functionality risk         |
| 21  | SaySo         | Pass     | A starter phrasebook covers review; a local match covers a slow network                    |
| 23  | Subtext       | Pass     | Messages come in by paste; the share extension can wait                                    |
| 24  | Answered      | Fails C6 | The person whose words go to Jev may not be able to give the permission 5.1.2(i) requires  |
| 25  | Stepwise      | Fails C2 | 40 to 60 checked guides with screenshots are the bottleneck                                |
| 27  | Stillwake     | Pass     | Technique cards are short text with haptics; crisis resources are written in               |
| 30  | Hollow Pines  | Fails C2 | A written, playtested mystery with finished paid chapters is the bottleneck                |

Conditions carried forward:

- Health-adjacent text in Midstride, Ebb, and Stillwake needs the 5.1.2(i)
  consent screen and "not medical advice" wording (C6).
- Other people's words reach Jev in Cannery, Sift, Earshot, and Subtext, so
  consent comes before any text leaves the phone (C6).
- Side Order and Lasted describe the additive approach without the creator's
  name for it (C7).

Survivors: 20. The plan called for trimming to about twelve by gallery
cluster size, but cluster sizes mislead here: they put Midstride among 46
fitness apps though none centers on perimenopause, and Hunch among 15 word
games though none takes free-form questions. So all 20 go on, and Round 4's
Category fit and Differentiation scores weigh crowding idea by idea.

**Decision:** 1 to 9, 12 to 17, 19 to 21, 23, and 27 go to Round 4 with
their conditions.

## Round 4: scoring

**Question:** which survivors are strongest?

**Method:** two scorers rated the 20 survivors on the rubric, with a one-line
reason per score. The log's author scored first; a subagent then scored
blind, from the same write-ups, the rubric, the Jev notes, the gallery notes,
and the category pages, without seeing the first scores. Each criterion's
score is the average of the two, and ties go to buildability.

| Rank | #   | Idea          | Fit | Build | Jev | Money | Demo | Differ | Traction | Total |
| ---- | --- | ------------- | --- | ----- | --- | ----- | ---- | ------ | -------- | ----- |
| 1    | 19  | Hunch         | 3.5 | 4     | 5   | 4     | 5    | 4.5    | 4        | 83.5  |
| 2    | 23  | Subtext       | 4   | 4     | 5   | 4     | 4    | 3      | 4        | 81    |
| 3    | 20  | Flagged       | 3   | 4.5   | 4.5 | 4     | 4.5  | 4      | 4        | 79.5  |
| 4    | 21  | SaySo         | 4   | 4     | 3.5 | 3.5   | 4.5  | 5      | 2.5      | 78.5  |
| 5    | 13  | Earshot       | 4   | 3     | 4.5 | 3     | 5    | 5      | 3        | 77.5  |
| 6    | 16  | Take-Home     | 4.5 | 2.5   | 4.5 | 3.5   | 4    | 4      | 3.5      | 76    |
| 7    | 3   | Side Order    | 4   | 3.5   | 4   | 3.5   | 4.5  | 3.5    | 2.5      | 75    |
| 8    | 2   | Cannery       | 3.5 | 4     | 3.5 | 4     | 4    | 3.5    | 3        | 74    |
| 9    | 6   | Pocket Studio | 4   | 4     | 3.5 | 3.5   | 4    | 3      | 2.5      | 73.5  |
| 10   | 5   | Midstride     | 4   | 3     | 3.5 | 4     | 4    | 3.5    | 3.5      | 73    |
| 11   | 4   | Lasted        | 4   | 4     | 3.5 | 3.5   | 3    | 3.5    | 2.5      | 72.5  |
| 12   | 12  | Sift          | 3   | 3     | 4.5 | 3.5   | 5    | 4      | 3        | 72    |
| 13   | 14  | Judgy         | 3   | 4     | 3.5 | 3     | 4    | 4      | 3        | 69.5  |
| 14   | 15  | Sleep On It   | 4   | 3     | 2.5 | 4     | 3    | 4      | 4        | 69.5  |
| 15   | 17  | Ebb           | 3   | 2     | 4   | 4     | 4    | 4.5    | 4        | 68    |
| 16   | 27  | Stillwake     | 3.5 | 3     | 2.5 | 4     | 4    | 3.5    | 3        | 67    |
| 17   | 1   | Blanks        | 3   | 2.5   | 3.5 | 4     | 4    | 4      | 2.5      | 66    |
| 18   | 8   | Hold the Line | 2.5 | 3     | 4.5 | 3.5   | 4    | 2      | 3        | 63.5  |
| 19   | 9   | Pinchlist     | 3.5 | 3     | 2   | 3     | 3    | 3.5    | 4        | 61.5  |
| 20   | 7   | Preflight     | 3   | 2     | 4.5 | 4     | 3.5  | 1.5    | 3        | 61.5  |

Scores two points apart, settled at the average with a reason:

- **Side Order, Jev centrality, 5 against 3:** a list of food words tags
  most menu lines, but Jev reads the dishes and wording such a list misses.
  Settled at 4.
- **Sleep On It, monetization fit, 3 against 5:** a small savings app sells
  weakly, but the paywall lands right after "You kept $140". Settled at 4.
- **Ebb, Jev centrality, 5 against 3:** a symptom checklist records the same
  data, but free text turned into tags as she types is what keeps a diary
  going. Settled at 4.

What the scores show:

- The two scorers agreed on four of the top five: Hunch, Subtext, Flagged,
  and SaySo. The fifth place split between Earshot and Take-Home.
- Only Hunch and Subtext have no workable stand-in for Jev; both scorers gave
  them a 5 for Jev centrality.
- No Influencer Award idea reached the top five. Two briefs are crowded
  (Career Coaching and Productivity), and in the other three a short form
  could do much of Jev's job.
- Three of the top five target the Peace Prize, so at most one of them can be
  the entry.

**Decision:** Top five, in order: Hunch, Subtext, Flagged, SaySo, and
Earshot. They go to Round 5.

## Round 5: evidence

**Question:** is there evidence for the top five?

**Method:** a research subagent checked each idea's competing App Store apps
and built-in iOS features, their reviews, demand from the people who have the
problem, Jev's documented limits, and gallery overlap, from primary sources.
The [evidence notes](idea-evidence.md) cite each finding; the log's author
confirmed the two App Store rivals that move the ranking most. Scores move
only where the evidence changes a criterion.

- **Hunch.** For: Akinator has 422,100 US ratings and NYT Games 293,384, and
  no app or gallery entry pairs a shared daily object with questions typed
  in the player's own words. Against: four apps already let players question
  an AI, one of them on Apple's on-device model, and their reviews punish
  contradictory or hedged answers ("It either is nomadic or it isn't").
  Jev's answers to a question and its negation needn't agree. Differentiation
  goes from 4.5 to 4.
- **Subtext.** For: autistic adults already use chatbots to read messages.
  Against: "Subtext: Decode Messages", a free app "built for autistic
  adults", launched on August 13, 2026, beside other message decoders, and
  Goblin Tools checks tone for $1.99. Differentiation goes from 3 to 2 and
  monetization fit from 4 to 3.
- **Flagged.** For: the FTC counted 104,946 job-scam reports in 2024, the
  FBI's IC3 logged $362.9 million in employment-scam losses in 2025, the
  FTC's warning signs match its checks, and no iOS app found checks job
  postings for scams. Against: security brands' free checkers already catch
  fake job offers, and text that argues for its own legitimacy is Jev's
  documented weak spot. The harm data make a Peace Prize case, so its
  primary category moves there, with #BuildInPublic secondary, and category
  fit goes from 3 to 3.5.
- **SaySo.** For: no app found ranks a user's own phrases by meaning.
  Against: Apple's Live Speech is free and saves phrases, AAC users reject
  subscriptions for basic communication, the phrases must work offline, and
  a phrasebook over 255 phrases needs two Choice steps. Differentiation goes
  from 5 to 3, monetization fit from 3.5 to 2.5, and buildability from 4 to
  3.5.
- **Earshot.** For: no gallery entry serves Deaf users, and studies name
  spoken announcements as a barrier. Against: Apple's free Name Recognition
  alerts on the user's name, airline apps push gate changes, and loudspeaker
  audio defeats captioning. Differentiation goes from 5 to 4 and buildability
  from 3 to 2.5.

| Idea    | Round 4 total | Round 5 total |
| ------- | ------------- | ------------- |
| Hunch   | 83.5          | 82.5          |
| Flagged | 79.5          | 82            |
| Subtext | 81            | 76            |
| Earshot | 77.5          | 73.5          |
| SaySo   | 78.5          | 69.5          |

Take-Home, sixth in Round 4 with 76 and not checked here, ties Subtext; the
tie goes to buildability, where Subtext has 4 and Take-Home 2.5.

What the finalists carry forward:

- **Hunch** must give every player the same answer to the same question:
  cache the first answer per question and object, answer spelling and size
  questions from the fact card in code, and test negated pairs before a card
  ships.
- **Flagged** asks narrow, literal questions per line, computes pay and
  posting age in code, and never says "safe", only "no red flags found".
- **Subtext** needs a new name and a sharper difference from free decoders.

**Decision:** Top three: Hunch, Flagged, and Subtext go to Round 6.

## Round 6: red team

**Question:** why would each finalist lose?

**Method:** a subagent played three roles against each finalist's pitch,
loop, Jev questions, prices, categories, and planned video beats: a
RevenueCat screener who watches two minutes and reads the write-up, the
primary category's judge applying its page, and an App Store reviewer
applying the context's review rules. It used the evidence notes and Jev's
documented limits, and was told to be adversarial.

| Finalist | Category            | Screener | Category judge |
| -------- | ------------------- | -------- | -------------- |
| Hunch    | Best Game (primary) | 4        | 3              |
| Hunch    | Growth Loop         | 2        | 2              |
| Hunch    | #BuildInPublic      | 2        | 1              |
| Flagged  | Peace Prize         | 3        | 3              |
| Flagged  | #BuildInPublic      | 3        | 2              |
| Subtext  | Peace Prize         | 3        | 2              |
| Subtext  | Design              | 2        | 2              |

Likeliest reasons each one loses:

- **Hunch.** The judge's own round contradicts itself: the cache locks in
  wording, not meaning, so "Does it fly?" and "Can it fly?" can disagree,
  and a wrong first answer becomes everyone's answer for the day. A text
  field with three answer labels doesn't look like a polished game among
  148, and the video's "how it works" beat is something Best Game doesn't
  score. A review rejection could leave no time to resubmit: "Play
  yesterday's?" has no yesterday on launch day, and packs without cards are
  placeholders.
- **Flagged.** It proves the harm but not the app: after about five days
  live it has no user outcomes and no accuracy figures, in a Peace field that
  already holds several scam checkers. A judge's test posting that it misses,
  or a big company's listing it flags, sinks a safety app. A weekly pass for
  job seekers argues against the Peace story.
- **Subtext.** A free app built with autistic advisors, with the same name
  and promise, came first; the audience is punishing subscriptions; and
  reading tone in a message that argues for its own tone is Jev's weakest
  task.

Shared risks: Jev is in early access and TypeSafe documents no free tier, so
credits must last through judging on October 13; the `jev-1.13.0` version
must be pinned, because an alias moves when a new release ships; and naming
Jev anywhere needs TypeSafe's consent under section 16.4 of its agreement.

Fixes:

- **Accepted for Hunch:**
  - Answer from a checked bank. Before a card ships, Jev answers a fixed
    bank of common questions and their negations against it, and a person
    fixes every answer between 0.3 and 0.7 and every negated pair that
    disagrees. In play, Jev matches the player's words to the nearest bank
    question, with a "none" option; only "none" gets a live answer.
  - Give it art direction and tone, and show them in the video instead of
    the "how it works" beat.
  - Launch with the archive filled and no packs or "unlimited" claims.
  - Check guesses in code against each card's accepted names, so a guess
    can't argue its way to a match.
  - Ask permission before the first question goes to TypeSafe, show offline
    and busy states, and keep the app out of the Kids category.
  - Replace Growth Loop and #BuildInPublic with HAMM as the secondary: a
    free daily puzzle with a paid archive is how NYT Games sells puzzles,
    and it needs no Layers SDK and no tracking prompt.
- **Accepted for Flagged:** publish an accuracy test on labeled real scams
  and real postings before September 30, drop the weekly pass, and say who
  it's for in the first 15 seconds.
- **Accepted for Subtext:** bring in at least ten autistic and ADHD adults to
  set its tags, threshold, and price. Accepted, but unlikely in the time
  left.
- **Rejected:** publishing the exact wording of Flagged's checks in a public
  changelog, which would show scammers how to get around them.

**Decision:** the panel ranks Hunch first, Flagged second, and Subtext
third. Round 7 re-scores them with the accepted fixes.

## Round 7: the choice

**Question:** which idea, and how can it be sharper?

**Method:** the finalists are re-scored with the fixes Round 6 accepted, the
highest total wins, and ties go to buildability. The winner then takes the
runners-up's best parts and a name.

| Finalist | Fit | Build | Jev | Money | Demo | Differ | Traction | Total |
| -------- | --- | ----- | --- | ----- | ---- | ------ | -------- | ----- |
| Hunch    | 4   | 3.5   | 5   | 4     | 5    | 4      | 4        | 83    |
| Flagged  | 3.5 | 4     | 4   | 3.5   | 4.5  | 4      | 4        | 77    |
| Subtext  | 2.5 | 3.5   | 3.5 | 3     | 4    | 2      | 4        | 62    |

What moved:

- **Hunch:** category fit rises from 3.5 to 4, because the checked bank and
  the art direction answer the judge's two reasons to reject it, and HAMM is
  a secondary it can meet without another SDK. Buildability falls from 4 to
  3.5 for the bank review and the art.
- **Flagged:** buildability, Jev centrality, and monetization fit each fall
  by half a point, for the labeled test set, text written to look
  legitimate, and a monthly-only price on a safety tool.
- **Subtext:** category fit falls from 4 to 2.5, Jev centrality from 5 to
  3.5, and buildability from 4 to 3.5, since the free rival came first,
  reading tone is Jev's weakest task, and co-design takes time.

Borrowed from the runners-up:

- **From Subtext's "can't tell":** when Jev can't settle a question the bank
  doesn't cover, the answer is "Ask another way", and the question doesn't
  count against the twenty.
- **From Flagged's accuracy test:** before launch, measure how often
  paraphrases reach the same bank question and negated pairs agree, and
  report the figures in the write-up.
- **From Flagged's "Jev got this wrong" button:** a "Report this answer"
  button sends a question and its answer to the team, who fix the card for
  the players who come after.

**Name:** Guessling. No App Store title found through Apple's iTunes Search
API on September 22, 2026 matches it, and no gallery project uses it. The
store name "Guessling: Daily 20 Questions" has 29 characters, within the
limit of 30. The Guessling is also the game's character, who answers with a
nod, a head shake, or a shrug; that gives the game the tone Best Game asks
for.

**Decision:** Guessling, the daily 20-questions game formerly called Hunch,
is the idea. Best Game is its primary category and HAMM its secondary.

## Round 8: monetization

**Question:** how does Guessling make money?

**Method:** the context's [benchmarks and paywall rules][ctx-money-r8] and
the evidence note's [rival prices][ev-hunch], shaped to what Best Game asks
for: "a monetization model that fits the genre instead of fighting it".

- **What stays free:** today's puzzle, every day, with its twenty questions
  and share card. A daily game that locks its daily puzzle fights the genre.
- **What's paid:** Guessling+, one entitlement, unlocks the archive of every
  past puzzle: ten at launch, and one more each day as today's puzzle
  retires. That is how NYT Games sells puzzles, and it promises nothing that
  won't exist on launch day.
- **Packages:** two plans, the most common paywall layout. Yearly at $19.99
  with a 3-day free trial is the default; monthly is $2.99. That sits below
  NYT Games at $4.99 to $5.99 a month for a bundle, and above the $0.99 a
  month of a single 20-questions rival.
- **Trial:** 3 days, because nearly all trials start on day 0 and a 7-day
  trial started after September 23 ends after the deadline. Trials started
  by September 27 convert before September 30, when revenue counts for the
  Grand Prize shortlist "as reported in RevenueCat".
- **Paywall moments:** right after today's result, as "Play yesterday's?",
  and on tapping any locked archive puzzle. Both are placements of one
  RevenueCat Paywall, configured remotely, so the offer can change without
  an app update. The paywall can be dismissed, because the daily game stays
  free.
- **Paywall content:** the yearly price in full as the most prominent price,
  the trial length, the renewal price, how to cancel, Restore Purchases, and
  links to the Terms of Use and the privacy policy.
- **Judges:** one-time-use Apple offer codes for a free month of Guessling+,
  created once the app is live, since a never-released app's purchases fail
  even with a code. A code redeemed on October 1 lasts past the end of
  judging on October 13, and the free daily puzzle needs no code at all.
- **What to measure for HAMM:** paywall views, trial starts, and
  conversions from RevenueCat's charts, which count production purchases
  only. No A/B tests: Experiments needs a paid plan, and launch week brings
  too little traffic.

**Decision:** free daily puzzle; Guessling+ archive at $19.99 a year with a
3-day trial or $2.99 a month; paywall after today's result; one-month offer
codes that cover judging to October 13.

[ctx-money-r8]: /docs/CONTEXT.md#monetization-and-paywalls
[ev-hunch]: idea-evidence.md#hunch-a-daily-20-questions-game

## Round 9: scope, stack, and schedule

**Question:** what ships by when?

**Method:** cut Guessling to one loop that can be in review by September 24,
pick a stack that keeps Jev's key off the phone, and schedule each day to
September 30. The dates and review rules come from the brief and the
context.

### Scope of the first version

- **Must:** today's puzzle with its hint; questions typed in the player's
  words and answered from the checked bank or live; "Ask another way"; the
  twenty-question count; guesses checked in code; a spoiler-free share card;
  the Guessling's nod, head shake, shrug, and celebration; the Guessling+
  archive, paywall, and Restore Purchases; the permission notice before the
  first question; offline and busy states; "Report this answer"; the privacy
  policy and terms pages; and 30 checked cards.
- **Should:** a streak count, haptics and sound, and checking the
  entitlement on the server as well as in the app.
- **Won't, in the first version:** accounts, leaderboards, friends, packs,
  push notifications, Android, and an iPad layout.

### Stack and data flow

- **App:** Expo with TypeScript and `react-native-purchases`, 10.10.1 on
  September 21, 2026, with RevenueCat Paywalls. One language runs from the
  app to the backend and Jev's official JavaScript SDK. A Swift team would
  build the same screens in SwiftUI with purchases-ios.
- **Backend:** one Cloudflare Worker, one of the runtimes that Jev's
  JavaScript SDK detects, with the key in the Worker's secrets and the model
  pinned to `jev-1.13.0`. Workers KV holds the cards, their checked bank
  answers, the daily schedule, and each day's live answers. The secret never
  ships in the app: the Worker sends the hint and checks guesses.
- **Per question:** the app sends today's number and the question; the
  Worker sends Jev one request with a Choice over that category's bank
  questions plus "none", and a Noul asking whether the text is a yes-or-no
  question about the hidden thing. A confident match returns the checked
  answer. "None" gets a live Noul against the card: above 0.7 is Yes, below
  0.3 is No, and anything between is "Ask another way", which costs no
  question. A live answer is cached for the day.
- **Authoring:** a script runs Jev over every bank question and its negation
  for each card and lists answers between 0.3 and 0.7 and negated pairs that
  disagree; a person fixes them before the card ships.
- **Data:** only the typed questions reach TypeSafe, after the player agrees
  to a notice that names it. There are no accounts; RevenueCat's anonymous
  IDs carry the purchase.

### Schedule

- **Tuesday, September 22:** request the Jev key and ask TypeSafe's consent
  to name Jev; sign the Paid Apps Agreement and finish tax and banking; set
  up the RevenueCat project, the App Store Connect record, and the two
  subscriptions; write the question bank and the first ten cards; stand up
  the Worker.
- **Wednesday, September 23:** the app's screens and the Guessling's art;
  bank matching and the live fallback; the authoring script; cards up to 30;
  the permission notice; the paywall and archive; the policy pages.
- **Thursday, September 24:** fix the flagged answers; run the consistency
  test; the icon, the 6.9-inch screenshots and the 1179 × 2556 one, and the
  metadata; submit the first build with its subscriptions, set to release
  automatically.
- **Friday, September 25 and Saturday, September 26:** in review. A
  rejection gets a fix for the cited guideline only and a resubmission the
  same day. Draft the launch posts and the video script.
- **Sunday, September 27:** live. Create the offer codes, confirm a
  production purchase, and post the first public puzzle to puzzle
  communities.
- **Monday, September 28:** record the video on a device and upload it.
- **Tuesday, September 29:** write the Devpost description and the category
  answers with the numbers so far.
- **Wednesday, September 30:** refresh the numbers and submit before 11:45 PM
  PT. Keep the Worker running and Jev's credits funded through October 13.

### Review-safety checklist

From the context's [review essentials][ctx-apple-r9]:

- The subscriptions go in the same submission as the first build.
- The paywall shows the billed amount first, the trial, the renewal, how to
  cancel, Restore Purchases, and links to the Terms of Use and the privacy
  policy, which also appear in the metadata.
- Permission comes before the first question goes to TypeSafe (5.1.2(i)),
  and the privacy label declares "Purchases" and the typed questions.
- No accounts, so no deletion flow, and no third-party login.
- The Test Store key never ships, the backend runs through review, and the
  review notes explain how to play.
- Screenshots are final before submitting, because they can't change while
  the app is "Waiting for Review".
- Not in the Kids category.

[ctx-apple-r9]: /docs/CONTEXT.md#apple-app-store-review-essentials

**Decision:** in review by the end of Thursday, September 24, live by Sunday,
September 27, and submitted to Devpost on September 30.

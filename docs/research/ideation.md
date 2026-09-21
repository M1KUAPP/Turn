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

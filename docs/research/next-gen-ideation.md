# Next Gen ideation log

The ten rounds of ideation behind [the idea](/docs/IDEA.md), run on September
22, 2026, after the team gave this feedback on its first idea, Guessling:
"The idea is too simple and our team is aiming for Next Gen category." The
[first log](ideation.md) records why Guessling was chosen for Best Game. This
one starts from the [brief](/docs/BRIEF.md), the [context](/docs/CONTEXT.md),
the [Next Gen notes](next-gen.md), the [technology notes](next-gen-tech.md),
the [Jev notes](jev.md), and the [Jev pattern notes](jev-patterns.md), and
narrows thirty candidates to one; each round ends with a decision the next one
builds on.

Contents:

1.  [Round 1: constraints and rubric](#round-1-constraints-and-rubric)
1.  [Round 2: thirty candidates](#round-2-thirty-candidates)
1.  [Round 3: screening](#round-3-screening)
1.  [Round 4: scoring](#round-4-scoring)
1.  [Round 5: evidence](#round-5-evidence)

## Round 1: constraints and rubric

**Question:** what must any idea satisfy to compete for Next Gen by September
30, 2026, what does "too simple" rule out, and how will ideas be compared?

**Method:** hard constraints taken from the brief, the context, the four
notes, and the feedback, and a rubric split from the four criteria the rules
judge Next Gen by, with Jev added for the goal.

### Hard constraints

An idea that breaks one is out.

- **N1. A Next Gen entry.** An all-student team submits an iOS, iPadOS,
  macOS, or Android app, not a web app, with a video under two minutes that
  shows it working on its device, a public repository holding "all necessary
  source code, assets, and instructions" under a detectable open-source
  license, a description, the icon and screenshot every entry gives, and a
  guardian's consent for each minor. ([Next Gen submission][ng-submit])
- **N2. A RevenueCat purchase the video shows.** The rules require the
  RevenueCat SDK to "power at least one in-app or web purchase", with no Next
  Gen exception, and judges score how thoughtfully the app uses RevenueCat. A
  free Apple account can't use In-App Purchase, and the organizers accept
  that "Test Store is enough for the Next Gen category", so the purchase runs
  through RevenueCat's Test Store, behind a paywall that belongs in the
  product. ([purchase requirement][ng-purchase])
- **N3. Jev decides at run time.** The goal requires Jev in the project.
  Jev answers typed questions with a choice, a score, or a yes-or-no
  probability and never writes text; it reads only text and has no mobile
  SDK. So the core loop turns on Jev's decisions while people use the app,
  every other input becomes text before Jev sees it, and the app calls Jev
  through a backend that holds the key. An essential backend must be
  available for judging, so its code is public and it runs until judging ends
  on October 13; the key never appears in the app or the repository, since
  TypeSafe's agreement requires keys to stay confidential. ([Jev
  notes][jev-what]; [what a judge needs][ng-judge])
- **N4. Working on a device by September 28.** The video must show the app
  "functioning on the device for which it was built", and the context advises
  uploading the final video by September 28. So the core loop works end to end
  on the team's own device by then, within what a free Apple account allows:
  no push notifications, Sign in with Apple, iCloud, or Game Center, local
  builds, and profiles that expire after 7 days. ([free accounts][ng-free];
  [demo video][ctx-video])
- **N5. No personal data from anyone under 18 reaches Jev.** TypeSafe's
  privacy policy says "no part of the Services is directed to children" and
  that it doesn't knowingly handle personal data from anyone under 18. So
  either the audience is adults, or nothing personal from a minor reaches
  Jev. Users give permission before their personal data goes to TypeSafe,
  as Apple's guideline 5.1.2(i) asks of third-party AI: Next Gen skips App
  Review, but judges hold the app to a released app's bar. ([ages and
  accounts][ng-minors])
- **N6. More than one interaction around one call.** The feedback judged
  Guessling too simple: one daily screen where each typed question gets one
  answer. The core loop must need parts that work together, such as live
  perception, state shared between users, or decisions that chain, each
  feeding the next, and Jev's decisions must drive what happens next.
- **N7. Nobody judged without consent.** By the team's own choice, the app
  doesn't send Jev the words or images of people who haven't agreed to it,
  since TypeSafe hosts Jev in the United States and keeps some rights to the
  data it receives. That rules out covertly transcribing lectures or
  conversations. ([data handling][jev-data])

[ng-submit]: next-gen.md#what-a-next-gen-entry-must-submit
[ng-purchase]: next-gen.md#the-purchase-requirement-for-next-gen
[jev-what]: jev.md#what-jev-is
[ng-judge]: next-gen.md#what-a-judge-needs-to-run-the-app
[ng-free]: next-gen.md#building-without-a-paid-developer-account
[ctx-video]: /docs/CONTEXT.md#demo-video-and-write-up
[ng-minors]: next-gen.md#minors-ages-and-accounts
[jev-data]: jev.md#offline-behavior-and-data-handling

### Assumptions

Nobody could be asked during the ideation, so these are assumed:

- "Our team is aiming for Next Gen" means every member is an active student
  with an academic email, and the team enters Next Gen only. An adult member
  holds the TypeSafe, RevenueCat, and developer accounts, and any minor has a
  guardian's consent.
- The team is two to four students starting from no code for the new idea
  on September 22, 2026, with a Mac, at least one recent iPhone, and
  TypeScript; Swift is a plus, not a given.
- The team has no paid Apple Developer Program membership, the case Next Gen
  was made for, so the app uses only a free account's capabilities, builds
  locally, and shows its purchase through RevenueCat's Test Store.
- The team can get a Jev API key on September 22, 2026, and asks TypeSafe
  before naming Jev in public, as the Jev notes advise.
- "10-round ideation" means ten new rounds, each with its own question and
  decision, not a revision of the first log.
- "Include Jev" means Jev makes decisions the app depends on at run time,
  not only in the build tools.
- "Too simple" is about the product, not the code: an idea needs parts that
  work together, with Jev as one of them, rather than one screen around one
  kind of model call.

### Rubric

Each idea scores 1 to 5 on each criterion; the total is the sum of weight ×
score ÷ 5, out of 100. The rules judge Next Gen on four unweighted criteria:
the idea, "meaningful progress toward a working app", the use of RevenueCat,
and "thoughtful technical choices, product thinking, and care"; the idea
breaks ties ([criteria][ng-criteria]). The rubric splits them into seven
criteria, weighted toward the idea, and adds Jev centrality for the goal.

| Criterion            | Rules criterion | Weight | A 5 means                                                                                            |
| -------------------- | --------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| Idea and need        | 1, the idea     | 20     | A clear answer to a real, specific problem for a named group, with evidence                          |
| Originality          | 1, the idea     | 10     | Few or no similar entries in the 2026 gallery, among student entries above all                       |
| Working app          | 2, progress     | 15     | A fully realized app, with its core loop, settings, and paywall, working on a device by September 28 |
| Demo-ability         | 2, progress     | 5      | The "aha" shows on a device within 15 seconds of the video                                           |
| RevenueCat fit       | 3, RevenueCat   | 15     | A purchase that belongs in the product, with a paywall and entitlement that make sense               |
| Technical ambition   | 4, technical    | 15     | A system of several parts, such as perception, decisions, and action, that few could ship            |
| Craft and repository | 4, technical    | 5      | A repository judges can read and run without the team's keys, with tests or evaluations              |
| Jev centrality       | The goal        | 15     | Jev makes the decisions the product depends on, at a speed or scale only it allows                   |

Guessling is scored in round 4 as a control, with the same rubric. The idea
chosen in round 7 must beat Guessling's total and score at least 2 points
higher on technical ambition, or round 7 must say why not.

[ng-criteria]: next-gen.md#next-gen-criteria-and-scoring

**Decision:** round 3 screens with N1 to N7, and rounds 4, 7, and 10 score
with this rubric.

## Round 2: thirty candidates

**Question:** what could a student team build that is more ambitious than
Guessling and depends on Jev?

**Method:** three subagents, each given round 1 and the four notes, wrote ten
ideas apiece through one lens without seeing the others' work: A, students'
own problems; B, capabilities new on the phone in 2026; and C, systems that
need many fast, calibrated decisions a minute. Each idea named its user, why
it matters, the system from input to Jev's decisions to action, Jev's
questions, the purchase, the video's first 15 seconds, the riskiest
assumption, and how to cut it.

| #   | Candidate    | Lens | Pitch                                                                                                   |
| --- | ------------ | ---- | ------------------------------------------------------------------------------------------------------- |
| 1   | Chorus       | A    | Group meetings a Deaf student can follow: every phone captions its owner, and Jev flags what's for them |
| 2   | Qualified    | A    | Twenty questions that find the scholarships a student qualifies for, re-screened after every answer     |
| 3   | Same Boat    | A    | Office hours that group students stuck on the same bug, merged live on the TA's iPad                    |
| 4   | Headcount    | A    | Friends on a night out, where Jev reads motion, battery, and check-ins and nudges the nearest friend    |
| 5   | Lull         | A    | Study spots ranked for each student's senses from on-device sound labels, never audio                   |
| 6   | Finders      | A    | Campus lost and found that matches a photo to a report and checks the owner's hidden detail             |
| 7   | Fair Game    | A    | A career-fair plan that re-ranks booths as the student scans banners and records notes                  |
| 8   | Porchlight   | A    | Friends get a vetted nudge when someone's daily check-ins go quiet; the words stay private              |
| 9   | Bench        | A    | A hands-free lab notebook: spoken notes tick protocol steps and flag deviations                         |
| 10  | Backed       | A    | Every citation in an essay checked against its source while the student writes                          |
| 11  | Bench        | B    | Talk through a lab protocol hands-free: steps tick, values log, timers start, and slips get caught      |
| 12  | Crosstalk    | B    | Friends' phones caption their owners, and Jev taps a hard-of-hearing user when a line needs them        |
| 13  | Tableside    | B    | Players say what they do, and the game master's phone calls the check and its difficulty                |
| 14  | Pointer      | B    | AAC that reads the place and a partner's question and puts the user's own phrase first                  |
| 15  | Cue          | B    | The stage manager's script follows the actors and stands by each cue a line early                       |
| 16  | Muster       | B    | Volunteers speak reports, and Jev triages and routes them to the nearest free volunteer                 |
| 17  | Proof        | B    | A photo-riddle hunt where Jev rules on every photo and rival teams vote on close calls                  |
| 18  | Range        | B    | A strapped-on phone counts rehab reps, and "that's sharp" stops the set by the physio's rules           |
| 19  | Rattle       | B    | A car noise, then Jev narrows 30 faults by choosing each next question and rates the urgency            |
| 20  | Plainly      | B    | The on-device model rewrites a notice in Easy Read, and Jev checks each sentence against the source     |
| 21  | Scenekeeper  | C    | Music and lights that follow the game master's story as it turns                                        |
| 22  | Crewline     | C    | Event radio calls become merged, ranked, and routed tickets within a second                             |
| 23  | Turn         | C    | AAC that ranks the user's own phrases by what a partner just said                                       |
| 24  | Gavel        | C    | Spoken Robert's Rules, tracked live on every member's phone                                             |
| 25  | Close Enough | C    | A live quiz that grades a room's free-text answers within a second                                      |
| 26  | Tableside    | C    | Threaded group captions for hard-of-hearing adults that buzz when they're asked something               |
| 27  | Standby      | C    | Sound cues that fire on the line, even when the actor paraphrases                                       |
| 28  | Orders       | C    | A real-time tactics game where the player commands a squad in plain English                             |
| 29  | Waypoint     | C    | A sign reader for blind travelers that voices only the signs that serve their goal                      |
| 30  | Flowsheet    | C    | A live debate flow that links rebuttals to arguments and flags the dropped ones                         |

Seven ideas repeat another's core and are merged into the first:

- **1, 12, and 26:** live captions that tell a hard-of-hearing user when a
  line needs them. Kept as 1, Chorus, for meetings and meals alike.
- **9 and 11:** a hands-free lab notebook, kept as 9, Bench.
- **13 and 21:** a companion for a tabletop game master, kept as 21,
  Scenekeeper, with 13's check calls folded in.
- **14 and 23:** ranking an AAC user's own phrases, kept as 23, Turn, with
  14's place and typing context folded in.
- **15 and 27:** a script that follows the actors, kept as 15, Cue.
- **16 and 22:** triage for event volunteers' spoken reports, kept as 22,
  Crewline.

Nineteen of the 30 turn live speech into text for Jev, and most of the rest
read the camera or typed text; the three lenses converged on perception on
the phone, Jev deciding per event, and state shared between phones.

**Decision:** 23 distinct candidates go to screening.

## Round 3: screening

**Question:** which of the 23 distinct candidates meet N1 to N7?

**Method:** each candidate was checked against every hard constraint, pass
or fail. A fail names the constraint it breaks; a pass that depends on a cut
its generator proposed names the cut, which later rounds carry forward.

| #   | Candidate    | Result | Reason                                                                                                          |
| --- | ------------ | ------ | --------------------------------------------------------------------------------------------------------------- |
| 1   | Chorus       | Pass   | Each phone transcribes only its owner, and every speaker joins, so N7 holds                                     |
| 2   | Qualified    | Pass   | The student's own paragraph and answers, after a consent notice                                                 |
| 3   | Same Boat    | Pass   | Typed questions from students who join the session                                                              |
| 4   | Headcount    | Fail   | N4: alerting a friend whose phone is in a pocket needs push notifications, which a free Apple account can't use |
| 5   | Lull         | Pass   | Only sound labels and levels leave the phones, never audio or words                                             |
| 6   | Finders      | Pass   | Image input needs Xcode 27 and an iPhone 15 Pro or newer; the generator's cut, typed descriptions, remains      |
| 7   | Fair Game    | Pass   | The student's own résumé text, notes, and banner text                                                           |
| 8   | Porchlight   | Pass   | Adults only, and crisis language goes to resources for the writer, never to friends                             |
| 9   | Bench        | Pass   | The student's own voice, on a single phone                                                                      |
| 10  | Backed       | Pass   | The student's own essay and sources                                                                             |
| 15  | Cue          | Pass   | The cast consents before rehearsal                                                                              |
| 17  | Proof        | Pass   | Descriptions name objects, never people; image input as for 6                                                   |
| 18  | Range        | Pass   | The patient's own remarks, with consent                                                                         |
| 19  | Rattle       | Pass   | A car's sounds and the driver's own answers                                                                     |
| 20  | Plainly      | Pass   | The user's own notices, after a consent notice                                                                  |
| 21  | Scenekeeper  | Pass   | Players consent when they join                                                                                  |
| 22  | Crewline     | Pass   | Volunteers keep the app open, since a free account can't push                                                   |
| 23  | Turn         | Pass   | Only a consenting partner's speech is transcribed; otherwise the place and typed letters rank the phrases       |
| 24  | Gavel        | Pass   | The meeting starts once every member present has joined                                                         |
| 25  | Close Enough | Pass   | Players may be 13, but only anonymous trivia answers reach Jev, per N5                                          |
| 28  | Orders       | Pass   | Players may be 13, but only orders and game state reach Jev, per N5                                             |
| 29  | Waypoint     | Pass   | Only the text of signs reaches Jev                                                                              |
| 30  | Flowsheet    | Pass   | Speakers consent before each round                                                                              |

**Decision:** 22 candidates go to scoring, with Guessling as the control.
Headcount is out: without push, its core loop, a friend's phone buzzing in a
pocket, can't work.

## Round 4: scoring

**Question:** which survivors are strongest, and how far do they clear
Guessling?

**Method:** two scorers rated the 22 survivors and Guessling on the rubric.
The log's author scored first; a subagent then scored blind, from the same
write-ups, round 1, and the four notes, without seeing the first scores. It
was told to be harsh on six days of student work with a free Apple account,
on jobs that plain code or Apple's on-device model could do in Jev's place,
on paywalls that feel wrong for their audience, and on ideas where a wrong
decision could hurt someone. Each criterion's score is the average of the
two, and ties go to the idea score, as the rules break ties. The last two
columns are each scorer's own total.

| Rank | #   | Candidate    | Idea | Orig | Work | Demo | RC  | Tech | Craft | Jev | Total | Author | Blind |
| ---- | --- | ------------ | ---- | ---- | ---- | ---- | --- | ---- | ----- | --- | ----- | ------ | ----- |
| 1    | 23  | Turn         | 5    | 4.5  | 3.5  | 5    | 3   | 4    | 4     | 5   | 84.5  | 82     | 87    |
| 2    | 21  | Scenekeeper  | 3    | 4.5  | 3    | 5    | 4   | 4.5  | 3.5   | 5   | 79    | 79     | 79    |
| 3    | 9   | Bench        | 3.5  | 4.5  | 2.5  | 4.5  | 4   | 4.5  | 3.5   | 4.5 | 77.5  | 83     | 72    |
| 4    | 1   | Chorus       | 4.5  | 4    | 2    | 4.5  | 2.5 | 5    | 3     | 4.5 | 75.5  | 81     | 70    |
| 5    | 3   | Same Boat    | 4    | 4    | 3.5  | 4    | 3   | 4    | 4     | 4   | 75.5  | 77     | 74    |
| 6    | 10  | Backed       | 3.5  | 4    | 3    | 4    | 4   | 3.5  | 4     | 4.5 | 75    | 80     | 70    |
| 7    | 2   | Qualified    | 4    | 4    | 3.5  | 4    | 3   | 3    | 4     | 4.5 | 74    | 77     | 71    |
| 8    | 25  | Close Enough | 3    | 3.5  | 4    | 4.5  | 4   | 3.5  | 4     | 4   | 74    | 80     | 68    |
| 9    | 20  | Plainly      | 3.5  | 4    | 3.5  | 4    | 3   | 4    | 4     | 4   | 73.5  | 77     | 70    |
| 10   | 15  | Cue          | 2.5  | 5    | 2.5  | 5    | 3.5 | 4.5  | 3.5   | 4.5 | 73.5  | 76     | 71    |
| 11   | 22  | Crewline     | 3    | 4.5  | 2    | 4    | 3.5 | 5    | 3     | 4.5 | 73    | 78     | 68    |
| 12   | 29  | Waypoint     | 3.5  | 3.5  | 2.5  | 4    | 2.5 | 5    | 3     | 4.5 | 71.5  | 76     | 67    |
| 13   | 28  | Orders       | 3    | 4    | 2    | 4.5  | 4   | 4    | 3     | 4   | 69.5  | 75     | 64    |
| 14   | 24  | Gavel        | 3    | 5    | 3    | 4    | 3   | 4    | 4     | 3   | 69    | 72     | 66    |
| 15   | 19  | Rattle       | 2.5  | 3.5  | 3    | 4    | 4   | 4    | 3     | 4   | 69    | 75     | 63    |
| 16   | 17  | Proof        | 3    | 4    | 2.5  | 4    | 4   | 4    | 3     | 3   | 67.5  | 74     | 61    |
| 17   | 30  | Flowsheet    | 2.5  | 4.5  | 2    | 3.5  | 3   | 4.5  | 3     | 4.5 | 67.5  | 71     | 64    |
| 18   | G0  | Guessling    | 3    | 3    | 4.5  | 3.5  | 4   | 2    | 3.5   | 3   | 65.5  | 64     | 67    |
| 19   | 7   | Fair Game    | 3    | 4    | 2.5  | 3.5  | 3   | 4    | 3     | 3.5 | 65.5  | 65     | 66    |
| 20   | 6   | Finders      | 3    | 4    | 3    | 4    | 2   | 4    | 3     | 3.5 | 64.5  | 66     | 63    |
| 21   | 8   | Porchlight   | 3    | 3.5  | 4    | 3.5  | 2.5 | 3    | 3     | 3.5 | 64.5  | 67     | 62    |
| 22   | 18  | Range        | 3    | 3.5  | 2.5  | 4    | 3.5 | 4    | 3     | 2.5 | 63.5  | 70     | 57    |
| 23   | 5   | Lull         | 3    | 4.5  | 2.5  | 3    | 3   | 4    | 3     | 2.5 | 63    | 68     | 58    |

Where the scorers were 2 points apart, each score was settled at the
average:

- **Jev centrality, seven times:** Same Boat, Close Enough, Plainly, Orders,
  Rattle, Gavel, and Proof. The blind scorer found a stand-in each time:
  embeddings to group questions, fuzzy matching against accepted spellings,
  the code's own date check, keyword rules for meeting procedure, or the
  on-device model that already saw the photo. Round 6 asks the same of every
  finalist.
- **Idea and need, four times:** Crewline, Porchlight, Range, and Lull. The
  blind scorer marked down ideas where a wrong call could hurt someone (two
  "collapse" reports merged, a missed self-harm signal, a missed "sharp"),
  and Lull's need for phones left in every room.
- **RevenueCat fit, once:** Qualified, since charging students to see the
  scholarships they qualify for resembles the "pay to find scholarships"
  warnings students get.
- **Originality, twice:** Orders and Proof, whose formats exist beyond the
  gallery.

What the scores show:

- Both scorers put Turn first. It ranks only the user's own saved phrases,
  so Jev's inability to write text becomes a safety feature.
- Guessling, the control, ties for 18th of 23 at 65.5. Every top-five
  candidate beats it by at least 10 points and at least doubles its
  technical ambition score of 2.
- The ideas that need live speech across several phones, Chorus, Crewline,
  and Flowsheet, got a 2 for a working app from both scorers.
- The scorers' own top fives share only Turn and Bench, so the averaging
  decides the rest.

**Decision:** top five, in order: Turn, Scenekeeper, Bench, Chorus, and Same
Boat. Chorus and Same Boat tie at 75.5, and the idea score puts Chorus ahead;
Backed misses the cut by half a point. They go to round 5.

## Round 5: evidence

**Question:** does the evidence hold up for the top five?

**Method:** a research subagent checked each finalist against primary
sources: rival apps, the 2026 gallery, evidence that the problem matters,
the devices a student team has, Jev's jagged edges, whether plain code,
embeddings, or Apple's on-device model could do Jev's job, and the harm a
wrong decision could do. The [evidence notes](next-gen-evidence.md) have the
sources. A score changes only where the evidence changes it.

- **Turn.** For: the best-documented need of the five, with "approximately 5
  million Americans" who may benefit from AAC by ASHA's figure, and aided
  speech at "8–10 wpm" against speaking rates of "125 and 185"; the gallery
  still has no AAC entry. Against: Rejoin Voice, released July 12, 2026,
  already listens to the partner and offers three tappable replies, with
  speech free and listening paid, the same split Turn planned. Turn's
  difference is narrower: every reply is one of the user's own saved
  phrases, never generated words, which answers the worry AAC users voiced
  about systems "suggesting the wrong thing". A 240-phrase Choice sits at
  TypeSafe's stated limit, and no study compares Jev with embeddings on AAC
  phrases. Originality goes from 4.5 to 3 and Jev centrality from 5 to 4.5.
- **Scenekeeper.** For: no gallery entry reacts to a live table. Against:
  Bardy already "listens to your party's conversation and automatically
  adjusts the music and ambiance", by keywords, and the evidence of need is
  marketing counts and a 17-person survey. Research on the same task found
  keyword rules and Naive Bayes usable for mood, so Jev's added value is the
  effects, intensity, and check calls. Originality goes from 4.5 to 3.5, the
  idea from 3 to 2.5, and Jev centrality from 5 to 4.
- **Bench.** For: no app checks a spoken value against the protocol's
  tolerance. Against: every other part ships somewhere; the value check lands
  on numbers, Jev's best-documented weakness, where a published parser beat a
  language model; and Boston University's lab policy bars phones and earbuds
  while wearing gloves or using chemicals, the demo's setting. The idea goes
  from 3.5 to 3, Jev centrality from 4.5 to 3.5, the working app from 2.5 to
  2, and demo-ability from 4.5 to 4.
- **Chorus.** For: NIDCD and CDC count the population, and no gallery entry
  serves Deaf users. Against: Hearing Buddy, a 2026 Apple Design Award
  finalist, already merges several phones into one transcript and taps the
  user when their name is said or a question is asked; Apple's Speech
  framework can't tell speakers apart; and every published method is weak at
  finding whom a line addresses. Originality goes from 4 to 2.5 and Jev
  centrality from 4.5 to 3.5.
- **Same Boat.** For: no store app groups office-hours questions live, and
  deadline waits of 39 to 58 minutes are measured. Against: embeddings are
  the textbook method for duplicate questions, and plain cosine similarity
  cut simulated waits by 11%, so Jev's case rests on its probabilities; a TA
  buying a Course Pass alone sits awkwardly with FERPA guidance; and
  students write the text Jev reads. It is the easiest of the five to build.
  Jev centrality goes from 4 to 3, RevenueCat fit from 3 to 2.5, and the
  working app from 3.5 to 4.

| Candidate   | Round 4 total | Round 5 total |
| ----------- | ------------- | ------------- |
| Turn        | 84.5          | 80            |
| Same Boat   | 75.5          | 72.5          |
| Scenekeeper | 79            | 72            |
| Bench       | 77.5          | 70.5          |
| Chorus      | 75.5          | 69.5          |

Backed, sixth in round 4 at 75, wasn't checked, so its score isn't
comparable: every checked finalist lost 3 to 7 points to the evidence, and
Backed would pass Scenekeeper only if it lost less than 3 of its own.

What the finalists carry forward:

- **Turn** must beat its own offline fallback, the place and typed letters
  ranked in code, on the same partner lines, and show it; keep each Choice
  well under 240 phrases with a first-stage filter and a "none of these"
  option; hold the row steady; and let the user pause listening at any time.
- **Same Boat** must show Jev beating embeddings on real duplicate questions,
  or lose its reason to use Jev, and must be bought by a course, not a TA
  alone.
- **Scenekeeper** needs stable cues over accurate but jumpy ones, a rate cap
  in code on any light, and Jev's value in effects and check calls, beyond
  what keywords catch.

**Decision:** top three: Turn, Same Boat, and Scenekeeper go to round 6.

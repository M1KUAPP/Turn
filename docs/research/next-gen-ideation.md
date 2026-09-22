# Next Gen ideation log

The ten rounds of ideation behind [the idea](/docs/IDEA.md), run on September
22, 2026, after the team gave this feedback on its first idea, Guessling:
"The idea is too simple and our team is aiming for Next Gen category." The
[first log](/docs/research/ideation.md) records why Guessling was chosen for
Best Game. This one starts from the [brief](/docs/BRIEF.md), the
[context](/docs/CONTEXT.md), the [Next Gen notes](/docs/research/next-gen.md),
the [technology notes](/docs/research/next-gen-tech.md), the
[Jev notes](/docs/research/jev.md), and the
[Jev pattern notes](/docs/research/jev-patterns.md), and narrows thirty
candidates to one; each round ends with a decision the next one builds on.
Rounds 8 to 10 record the design as each round decided it; where the idea
differs, it holds the current version.

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
1.  [Round 10: pitch test](#round-10-pitch-test)

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
  accounts][ng-minors]; [guideline 5.1.2(i)][jev-store])
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

[ng-submit]: /docs/research/next-gen.md#what-a-next-gen-entry-must-submit
[jev-what]: /docs/research/jev.md#what-jev-is
[ng-judge]: /docs/research/next-gen.md#what-a-judge-needs-to-run-the-app
[ng-free]: /docs/research/next-gen.md#building-without-a-paid-developer-account
[ctx-video]: /docs/CONTEXT.md#demo-video-and-write-up
[ng-minors]: /docs/research/next-gen.md#minors-ages-and-accounts
[jev-data]: /docs/research/jev.md#offline-behavior-and-data-handling
[jev-store]: /docs/research/jev.md#store-review-and-jev

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

[ng-criteria]: /docs/research/next-gen.md#next-gen-criteria-and-scoring

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

| #   | Candidate               | Lens | Pitch                                                                                                                               |
| --- | ----------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Chorus                  | A    | Group meetings a Deaf student can follow: every phone captions its owner, and Jev flags what's for them                             |
| 2   | Qualified               | A    | Twenty questions that find the scholarships a student qualifies for, re-screened after every answer                                 |
| 3   | Same Boat               | A    | Office hours that group students stuck on the same bug, merged live on the TA's iPad                                                |
| 4   | Headcount               | A    | Friends on a night out, where Jev reads motion, battery, and check-ins and nudges the nearest friend                                |
| 5   | Lull                    | A    | Study spots ranked for each student's senses from on-device sound labels, never audio                                               |
| 6   | Finders                 | A    | Campus lost and found that matches a photo to a report and checks the owner's hidden detail                                         |
| 7   | Fair Game               | A    | A career-fair plan that re-ranks booths as the student scans banners and records notes                                              |
| 8   | Porchlight              | A    | Friends get a vetted nudge when someone's daily check-ins go quiet; the words stay private                                          |
| 9   | Bench                   | A    | A hands-free lab notebook: spoken notes tick protocol steps and flag deviations                                                     |
| 10  | Backed                  | A    | Every citation in an essay checked against its source while the student writes                                                      |
| 11  | Bench                   | B    | Talk through a lab protocol hands-free: steps tick, values log, timers start, and slips get caught                                  |
| 12  | Crosstalk               | B    | Friends' phones caption their owners, and Jev taps a hard-of-hearing user when a line needs them                                    |
| 13  | Tableside (game master) | B    | Players say what they do, and the game master's phone calls the check and its difficulty                                            |
| 14  | Pointer                 | B    | Augmentative and alternative communication (AAC) that reads the place and a partner's question and puts the user's own phrase first |
| 15  | Cue                     | B    | The stage manager's script follows the actors and stands by each cue a line early                                                   |
| 16  | Muster                  | B    | Volunteers speak reports, and Jev triages and routes them to the nearest free volunteer                                             |
| 17  | Proof                   | B    | A photo-riddle hunt where Jev rules on every photo and rival teams vote on close calls                                              |
| 18  | Range                   | B    | A strapped-on phone counts rehab reps, and "that's sharp" stops the set by the physio's rules                                       |
| 19  | Rattle                  | B    | A car noise, then Jev narrows 30 faults by choosing each next question and rates the urgency                                        |
| 20  | Plainly                 | B    | The on-device model rewrites a notice in Easy Read, and Jev checks each sentence against the source                                 |
| 21  | Scenekeeper             | C    | Music and lights that follow the game master's story as it turns                                                                    |
| 22  | Crewline                | C    | Event radio calls become merged, ranked, and routed tickets within a second                                                         |
| 23  | Turn                    | C    | AAC that ranks the user's own phrases by what a partner just said                                                                   |
| 24  | Gavel                   | C    | Spoken Robert's Rules, tracked live on every member's phone                                                                         |
| 25  | Close Enough            | C    | A live quiz that grades a room's free-text answers within a second                                                                  |
| 26  | Tableside (captions)    | C    | Threaded group captions for hard-of-hearing adults that buzz when they're asked something                                           |
| 27  | Standby                 | C    | Sound cues that fire on the line, even when the actor paraphrases                                                                   |
| 28  | Orders                  | C    | A real-time tactics game where the player commands a squad in plain English                                                         |
| 29  | Waypoint                | C    | A sign reader for blind travelers that voices only the signs that serve their goal                                                  |
| 30  | Flowsheet               | C    | A live debate flow that links rebuttals to arguments and flags the dropped ones                                                     |

Seven ideas repeat another's core and are merged into one of them:

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
or fail. Every one is a native app with a RevenueCat purchase and Jev deciding
at run time through a relay (N1 to N3). The table shows the parts that meet
N6, the "too simple" test, and the reason names whichever of N4, N5, and N7
the case turned on. A fail names the constraint it breaks; a pass that
depends on a cut its generator proposed names the cut, which later rounds
carry forward.

| #   | Candidate    | Result | N6: parts that work together                                 | Reason                                                                                                          |
| --- | ------------ | ------ | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| 1   | Chorus       | Pass   | Live speech on each phone, merged into one shared transcript | Each phone transcribes only its owner, and every speaker joins, so N7 holds                                     |
| 2   | Qualified    | Pass   | Decisions that chain: each answer re-screens every award     | The student's own paragraph and answers, after a consent notice                                                 |
| 3   | Same Boat    | Pass   | Questions from many phones, merged live in shared state      | Typed questions from students who join the session                                                              |
| 4   | Headcount    | Fail   | Motion and check-ins from several phones                     | N4: alerting a friend whose phone is in a pocket needs push notifications, which a free Apple account can't use |
| 5   | Lull         | Pass   | Sound labels from phones in rooms, matched to profiles       | Only sound labels and levels leave the phones, never audio or words                                             |
| 6   | Finders      | Pass   | Image description, matching, then a check of the owner       | Image input needs Xcode 27 and an iPhone 15 Pro or newer; the generator's cut, typed descriptions, remains      |
| 7   | Fair Game    | Pass   | Fit scores, banner reading, and memos that re-plan the route | The student's own résumé text, notes, and banner text                                                           |
| 8   | Porchlight   | Pass   | Check-ins tracked over time, and nudges to friends           | Adults only, and crisis language goes to resources for the writer, never to friends                             |
| 9   | Bench        | Pass   | Document reading, live speech, and a step checklist          | The student's own voice, on a single phone                                                                      |
| 10  | Backed       | Pass   | Retrieval from sources, then a check of each sentence        | The student's own essay and sources                                                                             |
| 15  | Cue          | Pass   | Script reading, live speech, and the script's position       | The cast consents before rehearsal                                                                              |
| 17  | Proof        | Pass   | Image description, clues shared by teams, and a jury         | Descriptions name objects, never people; image input as for 6                                                   |
| 18  | Range        | Pass   | Motion sensing, speech, and the physio's rules               | The patient's own remarks, with consent                                                                         |
| 19  | Rattle       | Pass   | Sound, motion, and a question loop where each answer chains  | A car's sounds and the driver's own answers                                                                     |
| 20  | Plainly      | Pass   | Text written on the device, checked by Jev, then rewritten   | The user's own notices, after a consent notice                                                                  |
| 21  | Scenekeeper  | Pass   | Live speech driving music and light                          | Players consent when they join                                                                                  |
| 22  | Crewline     | Pass   | Speech from many phones and one shared ticket board          | Volunteers keep the app open, since a free account can't push                                                   |
| 23  | Turn         | Pass   | Live speech, a shortlist, and a steady row of replies        | Only a consenting partner's speech is transcribed; otherwise the place and typed letters rank the phrases       |
| 24  | Gavel        | Pass   | Live speech and a motion state machine on every phone        | The meeting starts once every member present has joined                                                         |
| 25  | Close Enough | Pass   | A room of phones graded at once and shown together           | Players may be 13, but only anonymous trivia answers reach Jev, per N5                                          |
| 28  | Orders       | Pass   | A game simulation driven by spoken orders                    | Players may be 13, but only orders and game state reach Jev, per N5                                             |
| 29  | Waypoint     | Pass   | Live text reading while walking, and speech back             | Only the text of signs reaches Jev                                                                              |
| 30  | Flowsheet    | Pass   | Speech on two phones and a graph of arguments                | Speakers consent before each round                                                                              |

**Decision:** 22 candidates go to scoring, with Guessling as the control.
Headcount is out: without push, its core loop, a friend's phone buzzing in a
pocket, can't work.

## Round 4: scoring

**Question:** which survivors are strongest, and how far do they clear
Guessling?

**Method:** two scorers rated the 22 survivors and Guessling on the rubric.
The log's author scored first; a subagent then scored blind, from the same
write-ups, round 1, and the four notes, without seeing the first scores. The
plan had it see only the candidates and the rubric; reading the notes too
put both scorers on the same evidence. It was told to be harsh on six days of
student work with a free Apple account, on jobs that plain code or Apple's
on-device model could do in Jev's place, on paywalls that feel wrong for their
audience, and on ideas where a wrong decision could hurt someone. Each
criterion's score is the average of the two, and ties go to the idea score, as
the rules break ties. The last two columns are each scorer's own total.

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

Each scorer's own scores, the author's first, in the same order:

| #   | Candidate    | Idea | Orig | Work | Demo | RC  | Tech | Craft | Jev |
| --- | ------------ | ---- | ---- | ---- | ---- | --- | ---- | ----- | --- |
| 23  | Turn         | 5/5  | 4/5  | 3/4  | 5/5  | 3/3 | 4/4  | 4/4   | 5/5 |
| 21  | Scenekeeper  | 3/3  | 5/4  | 3/3  | 5/5  | 4/4 | 4/5  | 4/3   | 5/5 |
| 9   | Bench        | 4/3  | 5/4  | 3/2  | 5/4  | 4/4 | 4/5  | 4/3   | 5/4 |
| 1   | Chorus       | 5/4  | 4/4  | 2/2  | 5/4  | 3/2 | 5/5  | 3/3   | 5/4 |
| 3   | Same Boat    | 4/4  | 4/4  | 3/4  | 4/4  | 3/3 | 4/4  | 4/4   | 5/3 |
| 10  | Backed       | 4/3  | 4/4  | 3/3  | 4/4  | 4/4 | 4/3  | 4/4   | 5/4 |
| 2   | Qualified    | 4/4  | 4/4  | 3/4  | 4/4  | 4/2 | 3/3  | 4/4   | 5/4 |
| 25  | Close Enough | 3/3  | 4/3  | 4/4  | 5/4  | 4/4 | 4/3  | 4/4   | 5/3 |
| 20  | Plainly      | 4/3  | 4/4  | 3/4  | 4/4  | 3/3 | 4/4  | 4/4   | 5/3 |
| 15  | Cue          | 3/2  | 5/5  | 3/2  | 5/5  | 3/4 | 4/5  | 4/3   | 5/4 |
| 22  | Crewline     | 4/2  | 5/4  | 2/2  | 4/4  | 3/4 | 5/5  | 3/3   | 5/4 |
| 29  | Waypoint     | 4/3  | 4/3  | 2/3  | 4/4  | 3/2 | 5/5  | 3/3   | 5/4 |
| 28  | Orders       | 3/3  | 5/3  | 2/2  | 5/4  | 4/4 | 4/4  | 3/3   | 5/3 |
| 24  | Gavel        | 3/3  | 5/5  | 3/3  | 4/4  | 3/3 | 4/4  | 4/4   | 4/2 |
| 19  | Rattle       | 3/2  | 4/3  | 3/3  | 4/4  | 4/4 | 4/4  | 3/3   | 5/3 |
| 17  | Proof        | 3/3  | 5/3  | 3/2  | 4/4  | 4/4 | 4/4  | 3/3   | 4/2 |
| 30  | Flowsheet    | 3/2  | 5/4  | 2/2  | 4/3  | 3/3 | 4/5  | 3/3   | 5/4 |
| G0  | Guessling    | 3/3  | 3/3  | 4/5  | 4/3  | 4/4 | 2/2  | 3/4   | 3/3 |
| 7   | Fair Game    | 3/3  | 4/4  | 2/3  | 3/4  | 3/3 | 4/4  | 3/3   | 4/3 |
| 6   | Finders      | 3/3  | 4/4  | 3/3  | 4/4  | 2/2 | 4/4  | 3/3   | 4/3 |
| 8   | Porchlight   | 4/2  | 3/4  | 4/4  | 3/4  | 2/3 | 3/3  | 3/3   | 4/3 |
| 18  | Range        | 4/2  | 4/3  | 2/3  | 4/4  | 4/3 | 4/4  | 3/3   | 3/2 |
| 5   | Lull         | 4/2  | 5/4  | 2/3  | 3/3  | 3/3 | 4/4  | 3/3   | 3/2 |

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
- **RevenueCat fit, once:** Qualified, since the blind scorer judged that
  charging students to see the scholarships they qualify for looks like the
  paid scholarship searches students are warned against.
- **Originality, twice:** Orders and Proof, whose formats exist beyond the
  gallery.

What the scores show:

- The blind scorer put Turn first, and the author put it second, a point
  behind Bench; averaged, Turn leads by 5.5. It ranks only the user's own
  saved phrases, so Jev's inability to write text becomes a safety feature.
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
wrong decision could do. The
[evidence notes](/docs/research/next-gen-evidence.md) have the sources. A score
changes only where the evidence changes it.

- **Turn.** For: the best-documented need of the five, with "approximately 5
  million Americans" who may benefit from AAC by ASHA's figure, and aided
  speech at "8–10 wpm" against speaking rates of "125 and 185"; the gallery
  still has no AAC entry. Against: Rejoin Voice, released July 12, 2026,
  already listens to the partner and offers three tappable replies, with
  speech free and listening paid, the same split Turn planned. Turn's
  difference is narrower: every reply is one of the user's own saved
  phrases, never generated words. That answers AAC users' worry about a
  system "suggesting the wrong thing" in a tone not their own, though the
  same study's participants felt even pre-stored phrases made listeners
  credit the system. A 240-phrase Choice sits at
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

## Round 6: red team

**Question:** why would each finalist lose, and can it be fixed?

**Method:** one subagent read rounds 1 to 5 and the six notes, then attacked
each finalist in the stance of `/grilling`, in three roles: a Next Gen judge
with two minutes of video, the description, and the README; a RevenueCat
developer advocate who clones the repository on October 1 and tries to run
it without the team's keys; and a TypeSafe engineer who knows Jev's jagged
edges, limits, and terms. For each finalist it named the five worst failure
modes, rated from 1 to 5, each with a fix and its cost in build hours, which
are the subagent's estimates.

### Failures every finalist shares

- **A clean clone may not launch or sell (4).** "Apps built with the iOS 27
  SDK must use the UIKit scene-based life cycle, or they do not launch
  correctly on iOS 27", and without a RevenueCat key the paywall is empty.
  Fix, 2 hours: turn on `ios.enableSceneSupport` (Expo 57.0.23 or later),
  commit the Test Store key, a public SDK key rather than a secret, or script
  its setup, and ship debug builds only, since the iOS SDK crashes release
  builds that carry a Test Store key.
- **The relay (3).** The Jev key must stay confidential while the relay runs
  until judging ends on October 13; no page read names a free tier, nothing
  says what the API returns when credits run out, the status page logged an
  "API issues"
  incident on September 21, and `jev-latest` can move under tuned
  thresholds. Fix, 3 hours: questions fixed on the server, per-device rate
  limits, a credit alert, `jev-1.13.0` pinned, and a visible degraded mode.
- **Naming Jev (2).** TypeSafe's agreement bars announcing the relationship
  without consent, so the team asks on September 22. Fix: half an hour.
- **RevenueCat weighs more than the rubric says.** It is one of the rules'
  four unweighted criteria but 15 of the rubric's 100 points. Weighting round
  5's scores by the four criteria alone, equally, still puts Turn first, at
  about 76, ahead of Scenekeeper at 73 and Same Boat at 72.5.

### Turn under attack

| Role     | Failure mode                                                                                                              | Severity | Fix                                                                                                                                                               | Hours |
| -------- | ------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| Judge    | "What's new, and why Jev?" Rejoin Voice already listens, "Tea or coffee?" is a word match, and the fallback is a strawman | 4        | Score 80 partner lines against gold replies for the fallback, keyword ranking on the partner's line, embeddings, and Jev; publish it; claim "only your own words" | 8     |
| Judge    | "Who types the phrases, and has an AAC user seen this?" A 240-phrase bank takes hours at "8–10 wpm"                       | 3        | About 150 editable starter phrases, every typed reply saved to the bank, and a 30-minute review by a campus speech-language pathology clinic                      | 6     |
| Advocate | Listen mode needs a phone: live transcription doesn't run in the Simulator, and Personal Voice needs an iPhone 15 Pro     | 4        | A field to type the partner's line, a Simulator build in the repository's releases, and a README path through the paid feature                                    | 4     |
| Engineer | One 240-option Choice sits at the reliability limit, always picks something, and flipped on 2 of 8 questions in repeats   | 4        | Code shortlists 40 phrases; Jev asks one Noul per candidate, which can all come back low; buttons keep their slots; yes-or-no questions get fixed buttons         | 6     |
| Engineer | The partner never agreed to TypeSafe, which keeps telemetry rights "in perpetuity", and partners may be under 18          | 3        | A consent card the user shows, a listening light with one-tap pause, no listening for partners marked under 18, and names swapped for tags                        | 3     |

Verdict: build it, with about 27 hours of fixes, all design and evaluation.
Nouls had a mean per-question standard deviation of about 0.01 over
TypeSafe's repeats, though one question crossed 0.5, so steady slots with a
margin can hold the row. If Jev doesn't beat embeddings on the evaluation,
it re-ranks an embedding shortlist instead, TypeSafe's own pattern, and still
decides the row.

### Same Boat under attack

- **"Why not embeddings?" (judge and engineer, 5).** Apple suggests sentence
  embeddings for FAQ matching, and cosine grouping cut simulated waits. Fix,
  8 hours on the first day: label 80 questions from the team's own courses,
  let embeddings shortlist the groups and Jev judge "same underlying bug, not
  same topic", and publish both; if Jev loses, the idea fails the goal.
- **"Who buys the Course Pass?" (judge, 4).** A TA paying alone sits
  awkwardly with FERPA guidance. Fix, 5 hours: the course is the RevenueCat
  customer, bought on the instructor's iPad, and TAs who join inherit it.
- **Students write the state (engineer, 4).** Urgent wording moves an effort
  score, injected text "can move the answer", and some students in a course
  may be under 18, which breaks N5. Fix, 2 hours: drop the effort score, add
  an injection Noul, and confirm each student's age when they join.
- **"Why would 300 students install an app?" (judge, 3).** Fix, 4 hours: a
  web join screen for students.
- **Three phones hide the problem (judge and advocate, 3).** Fix, 3 hours: a
  seed script that replays 40 labeled questions into a demo course.

Verdict: conditional, with about 22 hours of fixes, and worth building only
if Jev beats embeddings on the first day.

### Scenekeeper under attack

- **"Bardy does this; is there a need?" (judge, 5).** Keyword cues such as "a
  skeleton lurches out!" don't need Jev, and the lines that would, such as
  "the torches gutter", land on its literal reading. Fix, 8 hours: keywords
  in code for explicit cues and Jev for effects and check calls, measured on
  100 lines; the thin need can't be fixed.
- **One phone hears everything (engineer, 4),** including its own music and
  players who haven't consented. Fix, 2 hours: push-to-narrate, transcribing
  only the game master.
- **The video would contradict the design (judge, 3),** since cues change
  only after two confident phrases. Fix, 3 hours: one-shot effects at 0.9
  with a cooldown, and slower changes for music and light.
- **The repository can't carry the product (advocate, 4):** licensed audio,
  a smart bulb, and a physical iPhone. Fix, 9 hours: free-licensed audio for
  two worlds, a mode that replays a transcript, and an on-screen light.
- **Rate limits (engineer, 3).** Cookbook authors hit them at about eight
  requests in flight, and 48 tables at 25 calls a minute would use the whole
  listed limit. Fix, 3 hours: one request per finished phrase with a
  sequence number, and stale answers dropped, never retried.

Verdict: not worth building over the other two, with about 25 hours of fixes
on the heaviest base build, and Jev's share still unmeasured.

**Decision:** the red team ranks Turn first, Same Boat second, and
Scenekeeper third. All three go to round 7 with their fixes.

## Round 7: the choice

**Question:** with the fixes in, which idea wins, and how can it be sharper?

**Method:** re-score the three finalists with round 6's fixes, check the
winner against the Guessling control, and fold in the best parts of the
runners-up.

| Candidate   | Round 5 total | Round 7 total | What the fixes changed                                                                                                                |
| ----------- | ------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Turn        | 80            | 82            | Technical ambition 4 to 4.5 and craft 4 to 4.5: a shortlist, per-phrase Nouls, steady slots, a published evaluation, a Simulator path |
| Same Boat   | 72.5          | 73.5          | RevenueCat fit 2.5 to 3.5 and craft 4 to 4.5; working app 4 to 3.5 and originality 4 to 3.5, since Hivenotes builds class FAQs        |
| Scenekeeper | 72            | 67.5          | Jev centrality 4 to 3.5, working app 3 to 2.5, technical ambition 4.5 to 4, and demo 5 to 4.5; craft 3.5 to 4                         |

**The control.** Turn's 82 beats Guessling's 65.5 by 16.5 points, and its
technical ambition, 4.5, beats Guessling's 2 by 2.5, so it meets round 1's
rule.

**Why Turn.** It has the best-documented need of the five finalists checked,
on the criterion that breaks ties. It puts Jev where its limits help: Jev can't
write, so every word spoken is one the user saved. It runs on one phone, its
"aha" lands in seconds, and its repository can show judges a working loop in
the Simulator and an evaluation against simpler methods.

**Folded in from the runners-up:**

- From Same Boat, a band that asks instead of acting: one big button only
  when a phrase clears a high bar, and otherwise the row holds; and a replay
  script of recorded partner lines, so judges see the loop without a partner.
- From Scenekeeper, one request per finished utterance with a sequence
  number, with stale answers dropped rather than retried, and steady over
  jumpy.

**The name.** Turn keeps its name. A 1988 study found that "Augmented
communicators were frequently unsuccessful in their attempts to secure
speaking turns"; the app exists to win those turns back. Its line: "Your own
words, in time for your turn."

**The idea.** Turn is an iPhone app for adults who can't rely on speech. The
user speaks by tapping saved phrases or typing, in their Personal Voice if
they have one. In Listen mode, once the partner agrees, the phone transcribes
the partner on the device; code shortlists 40 of the user's own phrases; and
Jev decides, for each one, whether it answers what the partner just said.
The best fill a row of big buttons above the grid, in steady slots, and a tap
speaks. Jev never writes words, so everything spoken is the user's own. The
repository's evaluation compares Jev with keyword ranking and embeddings on
80 partner lines.

**Decision:** Turn is the idea. Rounds 8 to 10 design its purchase, its
scope and schedule, and its pitch.

## Round 8: monetization

**Question:** how does Turn use RevenueCat so the purchase belongs in the
product, when AAC users resent paying to speak?

**Method:** apply the context's [monetization rules][ctx-money], the evidence
on AAC pricing, and Next Gen's purchase rules to Turn.

- **Speech is never sold.** The grid, saved phrases, typing, and Personal
  Voice stay free. One AAC app's reviewer calls "paying an ongoing
  subscription fee in order to access basic communication" repugnant, fearing
  "that one can have their voice taken away at any time if they can no longer
  afford it", and Rejoin Voice promises "Everything you need to speak is
  free, forever". ([AAC reviews][ev-sayso]; [Turn's rivals][ev-turn-rivals])
- **Listen mode is what's sold.** It is the part that costs the team money
  on every partner line, through Jev and the relay, and the part rivals
  charge for: Rejoin+ costs $12.99 a month or $99.99.
- **One price, paid once.** Turn Listen is a one-time purchase of $24.99 that
  grants the entitlement `listen`. The established text AAC apps also sell
  once, from Speech Assistant AAC's $24.99 to Predictable's $159.99, and a
  one-time price answers the fear of losing one's voice when a payment
  lapses. It matches the lowest of them and costs less than two months of
  Rejoin+. ([SaySo's rivals][ev-sayso])
- **What a user costs.** A Listen request carries the partner's line and 40
  candidate phrases, an estimated 1,500 input tokens, so at Jev's $0.042 per
  million it costs about $0.00006, and 200 partner lines a day for a year
  cost about $4.60. One payment covers about five years of Jev at that pace;
  the relay's hosting comes on top. ([Jev prices][jev-prices])
- **Trying before paying.** Listen mode is free for the first 20 partner
  lines, counted by the relay against the RevenueCat app user ID, so the user
  sees it work first; the context advises giving users "sufficient context
  about what your app offers" before a hard paywall.
- **The paywall.** A RevenueCat Paywall, configured remotely, opens when the
  free lines run out or when the user turns Listen mode on after that. It
  shows the one-time price, says speaking stays free, and closes with one
  tap; speech never waits behind it. Settings holds Restore Purchases, and a
  caregiver can buy from there.
- **The relay checks.** Past the free lines, the relay checks the `listen`
  entitlement through RevenueCat's REST API before calling Jev, with a short
  cache, so past the free lines Jev's key serves only paid users. Test Store
  purchases grant entitlements while Sandbox Testing Access stays at its
  default, "Anybody". ([server checks][expo-server])
- **For Next Gen.** The purchase runs through RevenueCat's Test Store, which
  the organizers accept. The video shows the Test Store sheet, a simulated
  successful purchase, and Listen mode unlocking, and judges can repeat it in
  a debug build. Test Store purchases count as sandbox data, so the entry
  reports no revenue. RevenueCat's [Test Store page][rc-test-store] describes
  products by identifier, price, and duration without saying whether a
  one-time product can be made there. If it can't, the demo sells Listen as a
  yearly Test Store product, which renews at most five times before it ends,
  and the one-time design stays for a store release. ([purchase
  paths][ng-purchase])
- **Left out:** subscriptions, which AAC users resent; web purchases, which
  need a Stripe account; and ads, which have no place in someone's voice.

[ctx-money]: /docs/CONTEXT.md#monetization-and-paywalls
[ev-sayso]: /docs/research/idea-evidence.md#sayso-an-aac-phrase-finder
[ev-turn-rivals]: /docs/research/next-gen-evidence.md#turn-rival-apps
[jev-prices]: /docs/research/jev.md#jev-prices
[expo-server]: /docs/research/revenuecat-expo.md#checking-entitlements-from-a-server
[rc-test-store]: https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store

**Decision:** one entitlement, `listen`, sold once for $24.99 through a
RevenueCat Paywall after 20 free partner lines, and checked by the relay;
speaking is never sold.

## Round 9: scope, stack, and schedule

**Question:** what ships by September 28, on what stack, and how do judges
run it?

**Method:** cut Turn to one core loop, from the partner's line to a spoken
reply; take the fixes from rounds 6 and 7; and schedule the work backward
from the video on September 28.

### Scope of the first version

- **Must:** the speaking grid with categories, typing, and saved phrases;
  about 150 editable starter phrases, with every typed reply saved to the
  bank; speech in the user's Personal Voice once authorized, else a system
  voice; Listen mode with live transcription on the phone and a field to type
  the partner's line; the consent card, the listening light, one-tap pause,
  and a switch that stops listening when the partner is under 18; names
  swapped for tags before any request; the shortlist of 40 and Jev's
  per-phrase decisions; the row of big buttons in steady slots, one big
  button when a phrase clears the high bar, and fixed Yes, No, and Not sure
  buttons for yes-or-no questions; the offline fallback, ranked by place and
  typed letters; the paywall, the Test Store purchase, and Restore Purchases;
  Settings; the relay; the evaluation; and the README, the license, and a
  Simulator build.
- **Should:** the replay script of recorded partner lines, the review by a
  campus speech-language pathology clinic, and an alert when Jev's credits
  run low.
- **Won't:** a partner joining from their own phone, Android, an iPad
  layout, accounts, phrase banks synced to a server, languages other than
  English, and custom switch or eye-gaze access beyond what iOS provides.

### Stack and data flow

- **App:** Expo SDK 57, at 57.0.23 or later with `ios.enableSceneSupport`
  turned on for iOS 27, in TypeScript, with `react-native-purchases` and its
  Paywalls UI, built locally with Xcode 27 under a free Apple account, as
  debug builds only. Two small Swift modules, written with the Expo Modules
  API, run live transcription through `SpeechTranscriber` and ask for
  Personal Voice authorization; `expo-speech` then speaks with the authorized
  voice, and `expo-speech-recognition` is the fallback for transcription.
  ([Turn on students' devices][ev-turn-devices])
- **Shortlist on the phone:** keyword ranking over the partner's line, plus
  the user's most-used replies and the place's phrases, picks 40 phrases in
  TypeScript, so a reply that shares no content word with the question, such
  as "It was hard", still reaches Jev. The bank stays on the phone, and only
  those 40 leave it, per request.
- **One request per partner line:** the state holds the partner's line, with
  names as tags, the place, and the 40 candidates; the questions are a Choice
  for the kind of question (yes-or-no, a choice between options, open, or not
  a question), a Choice for the topic among the bank's categories, and one
  Noul per candidate, "this phrase answers what the partner just said". All
  42 run in parallel in one call.
- **The row, in code:** candidates rank by their Noul. One big button needs
  more than 0.85, the bar TypeSafe's routing example sets for acting without
  asking; six buttons need at least 0.6, its floor; below that the row holds.
  A new phrase takes a slot only when it beats the phrase there by a clear
  margin, and a yes-or-no question puts Yes, No, and Not sure first.
  ([confidence routing][jp-routing])
- **Relay:** one Cloudflare Worker holds the Jev key and a RevenueCat secret
  key. It builds the fixed questions, calls Jev through TypeSafe's JavaScript
  SDK or its HTTP API with the model pinned to `jev-1.13.0`, counts free
  lines, checks the entitlement, limits requests per device, and drops any
  answer older than the latest line by sequence number. It shows a degraded
  state when Jev is busy or down, and the phone falls back to its own
  ranking. ([Workers secrets][cf-secrets])
- **Evaluation:** `eval/` holds 80 partner lines, each with its best replies
  from the starter bank, and a script that scores top-1 and top-6 accuracy,
  "none" handling, and latency for four rankers: the fallback, keyword
  ranking on the partner's line, embeddings from Workers AI, and Jev. The
  README carries the table.
- **Repository:** `app/`, `modules/`, `worker/`, and `eval/`, an MIT
  `LICENSE` at the root, and a README with setup, the Test Store path, the
  Simulator path through a typed partner line, and the evaluation. The app's
  config points at the team's relay, which runs until the winners are
  announced. The Test Store public SDK key is committed for debug builds, a
  choice no RevenueCat page settles; no secret key is.

[ev-turn-devices]: /docs/research/next-gen-evidence.md#turn-on-students-devices
[jp-routing]: /docs/research/jev-patterns.md#confidence-gated-routing-pattern
[cf-secrets]: /docs/research/cloudflare-workers.md#secrets-configuration-and-wrangler

### Schedule to September 30

- **Tuesday, September 22:** request the Jev key and TypeSafe's consent to
  name Jev; create the RevenueCat project, the Test Store product, the
  entitlement, and the offering; start the Expo app with scene support;
  write the starter phrases and the 80 evaluation lines; stand up the relay.
- **Wednesday, September 23:** the grid, typing, the phrase bank, and
  speech with Personal Voice; the relay's Jev request with its fixed
  questions and pinned model; the shortlist on the phone.
- **Thursday, September 24:** Listen mode, with the transcription module and
  the typed-line field; the consent card, the listening light, pause, and the
  under-18 switch; steady slots and the Yes, No, and Not sure buttons; ask the
  campus clinic for a review.
- **Friday, September 25:** run the evaluation and set the thresholds; the
  paywall, the Test Store purchase, Restore, and the relay's free-line count
  and entitlement check; Settings.
- **Saturday, September 26:** the clinic's review, if booked, and its fixes;
  the README, the license, the Simulator build in the repository's
  releases, and the replay script.
- **Sunday, September 27:** polish; the 1024 × 1024 icon and the 1179 × 2556
  screenshot; rehearse the video with a partner who has agreed to it.
- **Monday, September 28:** record the video on an iPhone 15 Pro or later,
  and upload it.
- **Tuesday, September 29:** write the Devpost description and answers, and
  collect a guardian's consent for any minor on the team.
- **Wednesday, September 30:** submit before 11:45 PM PT. Keep the relay
  running and Jev's credits funded through judging, which ends on October 13,
  and until the winners are announced on October 21 or 22.

**Decision:** one core loop, from the partner's line to a spoken reply, on
the stack and schedule above.

## Round 10: pitch test

**Question:** does the pitch hold up in under two minutes and one paragraph?

**Method:** write the logline in the brief's form, the video's beats, and
the description's outline; re-score Turn and the Guessling control; and set
triggers with dates for what could still go wrong.

**Logline:** "For adults who can't rely on speech, Turn helps them answer in
conversation by listening to what the other person says and offering replies
in their own saved words, so they can take their turn before the conversation
moves on."

The video, under two minutes on an iPhone:

1.  **0:00–0:15:** a partner asks "How was physio?"; the row offers "It was
    hard", sharing no content word with the question; a tap speaks it. On
    screen: "Turn: your own words, in time for your turn", the Next Gen
    Award, and one line of the problem, so it's named within 15 seconds.
1.  **0:15–0:35:** the problem: aided speech at 8 to 10 words a minute
    against 125 to 185 spoken, and a reply typed too late.
1.  **0:35–1:05:** how it works: the consent card and the listening light, a
    yes-or-no question answered with the fixed buttons, and the row holding
    steady while nothing speaks until the user taps.
1.  **1:05–1:25:** why Jev: the evaluation table, and "Jev never writes
    words: every phrase is the user's own."
1.  **1:25–1:45:** the purchase: the free lines run out, the paywall opens,
    a Test Store purchase unlocks Listen mode, and speaking stays free.
1.  **1:45–1:55:** the repository, its license, the Simulator path, and the
    student team.

The description, in order: what the team built, what it does, and why it
matters, in the category page's words; the evaluation; the purchase and why
speech is free; the technical choices; privacy and consent; the AI tools
used, credited openly; and the award named, as RevenueCat's September 18
update asks: "Name the awards you're going for".

**Scores.** The pitch changes no score: Turn stays at 82 and Guessling at
65.5.

Triggers:

- **No Jev key by noon PT on September 23:** write to `support@typesafe.ai`
  and TypeSafe's Discord, and build on the phone's own ranking meanwhile,
  since Jev joins at the relay with no app change. No key by September 26
  means the video can't show Jev, and the team decides whether to enter
  without it, which breaks this idea's goal.
- **The evaluation on September 25:** if Jev's top-6 accuracy trails
  embeddings, Jev re-ranks an embedding shortlist instead, built on the phone
  with Apple's sentence embeddings so the bank stays there, and the
  evaluation runs again. If Jev still trails, the README says so, and the pitch
  rests on "none" and steady rows rather than accuracy.
- **No live transcription on a device by the end of September 24:** switch to
  `expo-speech-recognition` and its older recognizer.
- **No clinic review by September 27:** the description says no clinician has
  reviewed Turn yet.
- **No consent from TypeSafe by September 28:** the video, the description,
  and the README call Jev "a hosted decision model", and the consent card
  says "a third-party AI service in the United States".
- **No iPhone 15 Pro or later for the video:** a system voice speaks instead
  of a Personal Voice.

**Decision:** go. Turn is the idea, and `docs/IDEA.md` states it.

[ng-purchase]: /docs/research/next-gen.md#the-purchase-requirement-for-next-gen

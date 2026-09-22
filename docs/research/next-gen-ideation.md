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

# Shipaton 2026 ideation log

The ten rounds of ideation behind the idea in `docs/IDEA.md`, run on September
22, 2026 for RevenueCat Shipaton 2026. They start from the
[brief](/docs/BRIEF.md), the [context](/docs/CONTEXT.md), the
[Jev notes](jev.md), and the [gallery notes](gallery-2026.md), and narrow
thirty candidates to one idea; each round ends with a decision the next one
builds on.

Contents:

1.  [Round 1: constraints and rubric](#round-1-constraints-and-rubric)

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

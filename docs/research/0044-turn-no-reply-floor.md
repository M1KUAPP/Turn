# Turn's no-reply floor research notes

Evidence for issue #77, which must bring the evaluation back to EVAL-1's
floor of 16 lines with no acceptable reply: how other benchmarks built
no-answer items, how a batch's mix moves a labeler's threshold, how to report
a changed plan, and what 8 lines buy against 16. Every source was read on
September 23, 2026, under a 10-minute budget, and judgment starts with
"Synthesis:".

Contents:

1.  [Findings for the plan](#findings-for-the-plan)
1.  [Deliberately written no-answer items](#deliberately-written-no-answer-items)
1.  [A judge's threshold and the batch it sees](#a-judges-threshold-and-the-batch-it-sees)
1.  [Replacing items and reporting a changed plan](#replacing-items-and-reporting-a-changed-plan)
1.  [What 8 against 16 buys](#what-8-against-16-buys)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## Findings for the plan

Synthesis: every item below is this note's own reading of the sections it
links to. None of it picks one of the three options.

- **Other benchmarks fixed the share by construction, not by labeling.**
  DSTC7 Track 1 replaced the right response in a random 20% of its
  no-answer subtask's examples; SQuAD 2.0's writers saw the paragraph and
  were told to write questions "impossible to answer based on the paragraph
  alone", then others answered the dev and test questions to check them.
  Turn's writers were blind to the bank, so "no reply" was left to the
  labelers, which is where the universal replies got in. For option 1: new
  blind lines may meet the same labelers' leniency. For option 2: a rule
  aimed at universal replies targets the cause seen. (See
  [deliberately written no-answer items](#deliberately-written-no-answer-items).)
- **Batch mix moves thresholds.** Scholer et al. found people who first saw
  only non-relevant documents then gave "significantly higher average
  relevance scores". A batch made only of lines meant to have no reply may
  make a labeler more lenient, working against holds; they advise showing
  "multiple relevance levels early". This touches options 1 and 2 alike,
  since both relabel (see
  [a judge's threshold](#a-judges-threshold-and-the-batch-it-sees)).
- **Changing before scoring is the easier case, but the labels are seen.**
  Nosek et al.: "If the outcomes have not yet been observed", changes can be
  documented "without undermining diagnosticity"; partial blinding is "a gray
  area", so report "what was and was not known in advance". No ranker has
  run, but the 8 and 7 are known, and every option is chosen knowing them
  (see [replacing items](#replacing-items-and-reporting-a-changed-plan)).
- **What to record.** Per a summary of Willroth and Atherton: the type,
  reason, and timing of the change, the original plan, the deviation, and its
  "impact on readers' interpretation of the results". Option 3 changes the
  written requirement; options 1 and 2 change the lines or the labeling
  rule, so each is a change to record.
- **Numbers.** With z = 1.959963984540054, a perfect hold record gives
  68% to 100% on 8 lines, 81% to 100% on 16, and 84% to 100% on 20; half
  right gives 22% to 78%, 28% to 72%, and 30% to 70% (see
  [what 8 against 16 buys](#what-8-against-16-buys)).

## Deliberately written no-answer items

- **DSTC7 Track 1, what systems had to do.** The DSTC7 overview says Track 1
  systems "select the correct next utterances from a set of candidates or
  indicate that none of the proposed utterances is correct"; the subtask
  with no-answer cases has "100 candidates, including 0-1 correct options"
  ([DSTC7 overview][dstc7-overview]).
- **DSTC7 Track 1, how the share was set.** "For the data where sometimes
  the pool does not contain the correct utterance, twenty percent of cases
  are selected at random to have no correct utterance"
  ([DSTC7 overview][dstc7-overview]). The track's own paper, Gunasekara et
  al.: "For subtask 4 (no correct option sometimes), twenty percent of
  examples were randomly sampled and the correct utterance was replaced with
  an additional incorrect one" ([DSTC7 Track 1 paper][dstc7-track1]).
- Synthesis: in DSTC7 no one wrote a no-answer item. The designers set the
  share (20%) and picked the cases at random, and "no answer" meant the one
  known right response was swapped out, so there was nothing to label.
- **SQuAD 2.0, what writers were told.** "For each paragraph in the article,
  workers were asked to pose up to five questions that were impossible to
  answer based on the paragraph alone, while referencing entities in the
  paragraph and ensuring that a plausible answer is present." They "were
  asked to spend 7 minutes per paragraph, and were paid $10.50 per hour"
  (section 4.1, [SQuAD 2.0][squad2]).
- **SQuAD 2.0, examples shown.** "As inspiration, we also showed questions
  from SQuAD 1.1 for each paragraph; this further encouraged unanswerable
  questions to look similar to answerable ones" ([SQuAD 2.0][squad2]).
- **SQuAD 2.0, validation.** "We removed questions from workers who wrote 25
  or fewer questions on that article; this filter helped remove noise from
  workers who had trouble understanding the task." For human accuracy, "we
  hired additional crowdworkers to answer all questions in the SQuAD 2.0
  development and test sets" and "selected the final answer by majority
  vote" (sections 4.1 and 4.2, [SQuAD 2.0][squad2]).
- **SQuAD 2.0, share.** Table 2 as read: 43,498 unanswerable of 130,319 in
  train, 5,945 of 11,873 in dev, and 4,332 of 8,862 in test
  ([SQuAD 2.0][squad2]). Synthesis: that's 33.4%, 50.1%, and 48.9%. How the
  near-half share in dev and test was reached is Not found in what was read.
- Synthesis, did the writers know the criterion: in SQuAD 2.0, yes. They saw
  the paragraph, the thing that decides answerability, and were told the
  criterion. In DSTC7 there were no writers. Turn's writers were blind to the
  bank, the thing that decides "no reply", so they could only aim at it.
- **QuAC.** The asymmetry between asker and answerer is that "the student
  (1) cannot access the section to paraphrase it and (2) can be more concise
  by coreferencing previous interactions"; Table 2, as rendered, gives "20.2%
  unanswerable", and "As more questions get asked, the more likely a
  question is to be unanswerable" ([QuAC][quac]). Synthesis: QuAC's askers,
  like Turn's writers, couldn't see what decides the answer, and its share
  wasn't set but came out of the process. Whether QuAC set a target share is
  Not found.
- **Natural Questions.** Not read within the budget; Not found.

[dstc7-overview]: https://ar5iv.labs.arxiv.org/html/1901.03461
[dstc7-track1]: https://aclanthology.org/W19-4107.pdf
[squad2]: https://ar5iv.labs.arxiv.org/html/1806.03822
[quac]: https://ar5iv.labs.arxiv.org/html/1808.07036

## A judge's threshold and the batch it sees

- **Design.** Scholer, Kelly, Wu, Lee, and Webber "examine the effect that
  threshold priming, seeing varying degrees of relevant documents, has on
  people's calibration of relevance. Participants judged the relevance of a
  prologue of documents containing highly relevant, moderately relevant, or
  non-relevant documents, followed by a common epilogue of documents of mixed
  relevance" ([Scholer et al. 2013][scholer]; abstract read through
  [Semantic Scholar's record][scholer-s2]).
- **Result.** "We observe that participants exposed to only non-relevant
  documents in the prologue assigned significantly higher average relevance
  scores to prologue and epilogue documents than participants exposed to
  moderately or highly relevant documents in the prologue."
- **Advice.** "Our findings indicate that assessors should be exposed to
  documents from multiple relevance levels early in the judging process, in
  order to calibrate their relevance thresholds in a balanced way"
  ([Scholer et al. 2013][scholer]). They also note "Showing documents to
  assessors in different orderings, however, may lead to different
  assessment outcomes."
- Synthesis: a batch of only lines meant to have no reply matches their
  non-relevant prologue, and their result points to a more lenient labeler
  there: more replies accepted, fewer holds. Mixing those lines among
  ordinary ones, early in the batch, is what their advice describes. Two
  limits: their judges were people, not Claude labelers, and only the
  abstract was read. A search surfaced an LLM study,
  "Mitigating the Threshold Priming Effect in Large Language Model–Based
  Relevance Judgments" ([arXiv 2512.00390][llm-priming]), but it wasn't read.

[scholer]: https://dl.acm.org/doi/10.1145/2484028.2484090
[scholer-s2]: https://api.semanticscholar.org/graph/v1/paper/DOI:10.1145/2484028.2484090?fields=title,abstract,year,authors
[llm-priming]: https://arxiv.org/abs/2512.00390

## Replacing items and reporting a changed plan

- **Before or after the outcomes.** Nosek et al.: "Deviations from data
  collection and analysis plans are common, even in the most predictable
  investigations. ... If the outcomes have not yet been observed, Jolene can
  document the changes to her preregistration without undermining
  diagnosticity. However, even if the data have been observed, preregistration
  provides substantial benefit. Jolene can transparently report changes that
  were made and why" ([Nosek et al. 2018][nosek]).
- **Blindness.** "The extent to which testing predictions is possible on
  preexisting data depends on whether decisions about the analysis plan are
  blind to the data. 'Pure' preregistration is still possible if no one has
  observed the data." And: "partial blinding creates a gray area between
  prediction and postdiction. Once definitive blindness is killed, the
  diagnosticity of statistical inference is maximized by registering analysis
  plans and transparently reporting what was and was not known in advance
  about the dataset" ([Nosek et al. 2018][nosek]).
- **What to record.** Willroth and Atherton's article
  ([Best Laid Plans][willroth]) returned HTTP 403. An APS Observer article of
  February 7, 2024 ([When Things Don't Go According to Plan][aps-observer])
  says their template reports "the type of deviation, as well as the reason
  for and timing of the change", "their original plan, a description of the
  deviations, and the impact on readers' interpretation of the results", and
  has "a table where researchers can report unregistered steps". Whether the
  template treats a change before seeing results differently is Not found.
- **OSF's pages on updating a registration.** The help page tried,
  `https://help.osf.io/article/110-introduction-to-updating-registrations`,
  returned HTTP 404; Not found.
- **Seeded random draws or strata for dropping items.** No primary source on
  this was read; Not found. The nearest is DSTC7's cases "selected at random
  to have no correct utterance" (see
  [deliberately written no-answer items](#deliberately-written-no-answer-items)).
- Synthesis, what this says about each option:
  - Option 1: Nosek's point that decisions "blind to the data" keep
    diagnosticity argues for a replacement rule fixed before new labels are
    read. Against it: the old labels are already seen, so choosing to replace
    is itself made knowing them ("a gray area").
  - Option 2: no ranker has scored, so "the outcomes", in the sense of the
    system results, are unseen. Against it: the new rule is written after
    seeing which replies the labelers accepted, so it isn't blind to the
    labels.
  - Option 3: the most direct deviation from the written requirement; the
    fields above (original plan, deviation, reason, timing, impact) are what
    the report would carry.
  - All three: record what was known when the change was chosen, namely the
    8 and 7 counts and which replies drove them.

[nosek]: https://pmc.ncbi.nlm.nih.gov/articles/PMC5856500/
[willroth]: https://journals.sagepub.com/doi/full/10.1177/25152459231213802
[aps-observer]: https://www.psychologicalscience.org/publications/observer/methods-preregistration-deviations.html

## What 8 against 16 buys

- **Formula.** NIST's Wilson interval, as the harness note gives it, with
  z = 1.959963984540054 and both limits clamped to [0, 1]
  ([harness notes][harness-wilson], [NIST][nist-wilson]).
- Synthesis: this note's script, 95% two-sided intervals for a right-hold
  rate:

  | Lines (n) | All right | Interval    | Half right | Interval   |
  | --------- | --------- | ----------- | ---------- | ---------- |
  | 8         | 8 of 8    | 68% to 100% | 4 of 8     | 22% to 78% |
  | 16        | 16 of 16  | 81% to 100% | 8 of 16    | 28% to 72% |
  | 20        | 20 of 20  | 84% to 100% | 10 of 20   | 30% to 70% |

  ```python
  from math import sqrt
  Z = 1.959963984540054
  def wilson(x, n, z=Z):
      p = x / n
      c = p + z*z/(2*n)
      h = z*sqrt(p*(1-p)/n + z*z/(4*n*n))
      d = 1 + z*z/n
      return max(0.0, (c-h)/d), min(1.0, (c+h)/d)
  for n in (8, 16, 20):
      for x in (n, n//2):
          lo, hi = wilson(x, n)
          print(x, n, round(lo*100), round(hi*100))
  ```

- Synthesis: raw limits were 0.675592, 0.806392, and 0.838875 for all
  right, and 0.215216 to 0.784784, 0.279996 to 0.720004, and 0.299298 to
  0.700702 for half right. At 8 lines a perfect hold record can't rule out a
  true rate of 68%, against 81% at 16. At half right the width falls from
  57 points to 44 to 40. For option 3, the width at the lower floor is what
  the report would state; for options 1 and 2, the gain from 8 to 16.

[harness-wilson]: /docs/research/0035-turn-eval-harness.md#the-wilson-interval
[nist-wilson]: https://www.itl.nist.gov/div898/handbook/prc/section2/prc241.htm

## Gaps

- SQuAD 2.0 was read through ar5iv; how dev and test reached about half
  unanswerable is Not found.
- Only Scholer et al.'s abstract was read, not the effect sizes, and whether
  the effect holds for Claude labelers is Not found.
- Willroth and Atherton's article and OSF's help page couldn't be fetched;
  the template fields come from a secondary APS summary.
- QuAC was read only through a summarizing fetch; Natural Questions' null
  answers and any primary source on seeded random or stratified replacement
  weren't read.

## See also

- [Turn's evaluation research](/docs/research/0025-turn-evaluation.md)
- [Turn's reply labels research](/docs/research/0034-turn-reply-labels.md)
- [Turn's evaluation harness research](/docs/research/0035-turn-eval-harness.md)
- [Starter content plan](/docs/plans/0011-turn-starter-content.md)
- [Reply labels plan](/docs/plans/0013-turn-reply-labels.md)
- [The TRD's evaluation data](/docs/TRD.md#the-evaluation-data)

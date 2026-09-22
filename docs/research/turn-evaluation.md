# Reply-ranking evaluation research notes

How Turn's evaluation should score four ways of ranking a user's saved phrases
against 80 partner lines, and what published work says about the metrics,
statistics, baselines, data, and latency involved, as input to the rewrite of
Turn's [product][product-doc], [PRD][prd-doc], and [TRD][trd-doc]. Every source
was read on September 22, 2026, so versions and prices are as of that date, and
judgment starts with "Synthesis:". The design is in the [idea][idea-how], and
the [evidence notes][ev-without], [Jev pattern notes][jp-evals], and [technology
notes][tech-embed] already hold the rival methods, Jev's published evals, and
the Workers AI table, so this note links to them instead of repeating them.

Contents:

1.  [Findings for the product, PRD, and TRD](#findings-for-the-product-prd-and-trd)
1.  [Ranking metrics that allow no answer](#ranking-metrics-that-allow-no-answer)
1.  [Calibration and the two confidence bars](#calibration-and-the-two-confidence-bars)
1.  [Uncertainty with 80 partner lines](#uncertainty-with-80-partner-lines)
1.  [Paired comparisons of the four rankers](#paired-comparisons-of-the-four-rankers)
1.  [Keeping threshold tuning out of the result](#keeping-threshold-tuning-out-of-the-result)
1.  [Systems that choose replies from a fixed set](#systems-that-choose-replies-from-a-fixed-set)
1.  [How AAC suggestion studies measured success](#how-aac-suggestion-studies-measured-success)
1.  [Baselines: BM25 and embeddings](#baselines-bm25-and-embeddings)
1.  [Data for the partner lines and the starter bank](#data-for-the-partner-lines-and-the-starter-bank)
1.  [Latency for a conversational turn](#latency-for-a-conversational-turn)
1.  [Conflicts between sources](#conflicts-between-sources)
1.  [Gaps](#gaps)

[product-doc]: /docs/PRODUCT.md
[prd-doc]: /docs/PRD.md
[trd-doc]: /docs/TRD.md
[jp-evals]: /docs/research/jev-patterns.md#evals-calibration-and-consistency

## Findings for the product, PRD, and TRD

Synthesis: each line condenses the section it links to, where the sources are.

- **Score "none" as its own decision.** Ranking metrics (top-1, top-6,
  reciprocal rank) apply only to lines that have a right reply. Lines with none
  are scored on whether the row holds, the way SQuAD 2.0 credits abstaining and
  Smart Reply judged its separate trigger model. Report both, with coverage (the
  share of lines where the row changes), risk (the share of those rows that are
  wrong), and an always-hold baseline. See
  [Ranking metrics that allow no answer](#ranking-metrics-that-allow-no-answer).
- **80 lines give wide intervals.** A top-6 hit rate of 56 of 80 has a 95%
  Wilson interval of 59% to 79%, and a big button that is right on all 40 lines
  where it shows still has a 95% upper bound of 7.2% on its error rate. The
  PRD's bars should be point estimates with intervals, plus zero-tolerance bars
  on yes-or-no, pain, and consent lines. See
  [Uncertainty with 80 partner lines](#uncertainty-with-80-partner-lines).
- **80 lines settle only big differences.** With the exact McNemar test, two
  rankers that agree on 70% to 80% of lines need a true gap of about 15 to 18
  points in top-6 accuracy for 80% power, and a 10-point gap is found less than
  half the time. Saying Jev trails embeddings should take a paired interval
  wholly below zero; anything else is "no clear difference". See
  [Paired comparisons of the four rankers](#paired-comparisons-of-the-four-rankers).
- **Set cut-offs on lines the reported numbers don't use.** Jev's 0.6 and 0.85
  come from TypeSafe's banking example, and BM25 and embedding scores aren't
  probabilities, so their "none" cut-offs must be learned. Freeze Jev's bars and
  question wording before the test run, and set the other rankers' cut-offs by
  cross-validation or at equal coverage. See
  [threshold tuning](#keeping-threshold-tuning-out-of-the-result) and
  [calibration](#calibration-and-the-two-confidence-bars).
- **Smart Reply's lessons fit Turn.** Google decided whether to suggest at all
  with a separate model (AUC 0.854, triggering on about 11% of messages), aimed
  never to show two replies with the same intent, and forced a negative option;
  turning diversity off cut clicks by about 7.5% relative. Turn's fixed Yes, No,
  and Not sure buttons play the forced negative's part. See
  [Systems that choose replies from a fixed set](#systems-that-choose-replies-from-a-fixed-set).
- **Offline hit rates overstate real use.** SpeakFaster's simulated keystroke
  saving rate passed 0.6, while eye-gaze users reached 0.32 to 0.36, and AAC
  studies with users measured rate, pauses, utilization, and ratings, not only
  hits. Turn's product metrics should keep the time to the row apart from the
  user's own selection time. See
  [How AAC suggestion studies measured success](#how-aac-suggestion-studies-measured-success).
- **Keyword ranking and similarity embeddings miss replies that share no
  words.** BM25 "generally performs poorly" on single sentences, similarity
  embeddings trailed reply-trained encoders by about 25 points of 1-of-100
  accuracy on Reddit, and Workers AI offers no reply-trained encoder. Report the
  shortlist's recall at 40 and the lines with no shared content word separately.
  See [Baselines: BM25 and embeddings](#baselines-bm25-and-embeddings).
- **Write the lines and the bank by hand.** DailyDialog is non-commercial and
  share-alike, Switchboard and its dialogue-act transcripts may not be
  redistributed, Persona-Chat's data ships with no license file, and the
  crowdsourced AAC dialogues carry conflicting licenses. Mix the lines like real
  questions: about 70% of questions in American English conversation are
  yes-or-no, most of those declarative. See
  [Data for the partner lines and the starter bank](#data-for-the-partner-lines-and-the-starter-bank).
- **Put the row up within about a second.** Speakers answer yes-or-no questions
  after a mean of about 200 ms, silences past about 700 ms read as trouble, and
  when Todman and Rzepecka shortened the pauses before stored AAC replies in
  social conversation, ratings rose steadily from the natural 16 s down to 2 s.
  Synthesis: time to the row at p50 of 1.0 s or less and p95 of 2.0 s or less on
  the phone, from the end of the partner's speech. See
  [Latency for a conversational turn](#latency-for-a-conversational-turn).

## Ranking metrics that allow no answer

The evaluation labels each of the 80 partner lines with its best replies from
the starter bank and scores four rankers on them ([idea-build]); Jev sees only
the 40 phrases the phone shortlists ([idea-how]). Some lines should have no
fitting phrase at all, so the metrics must handle "none".

[idea-build]: /docs/IDEA.md#stack-and-data-flow

### Top-k accuracy, recall at k, and MRR

- **Reciprocal rank.** TREC-8's question answering track defined it: "An
  individual question received a score equal to the reciprocal of the rank at
  which the first correct response was returned, or 0 if none of the five
  responses contained a correct answer," and "The score for a submission was
  then the mean of the individual questions' reciprocal ranks." The same report
  names two drawbacks: "The score for an individual question can take on only
  six values (0, .2, .25, .33, .5, 1)," and "a system could receive no credit
  for realizing it did not know the answer" ([voorhees-1999]).
- **Precision at k.** The IR textbook describes "measuring precision at fixed
  low levels of retrieved results, such as 10 or 30 documents," and warns that
  it "is the least stable of the commonly used evaluation measures"
  ([irbook-ranked]).
- **Recall at k in response selection.** The Ubuntu Dialogue Corpus paper: "the
  agent is asked to select the k most likely responses, and it is correct if the
  true response is among these k candidates" ([ubuntu-2015]).
- **Library support.** scikit-learn 1.9.1's `top_k_accuracy_score` "computes the
  number of times where the correct label is among the top k labels predicted
  (ranked by predicted scores). Note that the multilabel case isn't covered
  here." ([sk-topk])
- Synthesis: Turn's "top-6 accuracy" is a hit at 6, meaning any acceptable
  phrase among the first six, not precision at 6. A line can have several
  acceptable phrases, which scikit-learn's function doesn't handle, so the
  script needs its own. Reciprocal rank adds little beside top-1 and top-6 for a
  row of six, and, as in TREC-8, it can't credit a correct hold.

[irbook-ranked]: https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html
[sk-topk]: https://scikit-learn.org/stable/modules/generated/sklearn.metrics.top_k_accuracy_score.html

### Abstention and selective prediction

- **The reject option.** Chow's 1970 abstract: "The performance of a pattern
  recognition system is characterized by its error and reject tradeoff."
  ([chow-1970]; abstract only)
- **Risk and coverage.** El-Yaniv and Wiener: "The essence in selective
  classification is to trade-off classifier coverage for higher accuracy. We
  term this trade-off the risk-coverage (RC) trade-off." ([elyaniv-2010])
  Geifman and El-Yaniv define coverage as "the probability mass of the
  non-rejected region", selective risk as the error rate on the inputs not
  rejected, and the "risk-coverage curve, defined to be risk as a function of
  coverage" ([geifman-2017]).
- **Reporting it.** Kamath, Jia, and Liang: "We plot risk versus coverage and
  evaluate on the area under this curve (AUC), as well as the maximum possible
  coverage for a desired risk level." They warn that "Abstention policies based
  solely on the model's softmax probabilities fare poorly, since models are
  overconfident on out-of-domain inputs," and their method "answers 56% of
  questions while maintaining 80% accuracy; in contrast, directly using the
  model's probabilities only answers 48% at 80% accuracy." ([kamath-2020])

The empirical forms, following Geifman and El-Yaniv, with a changed row as the
"prediction" ([geifman-2017]):

```text
coverage = lines where the row changes / all lines
risk     = changed rows with no acceptable phrase / lines where the row changes
```

[chow-1970]: https://doi.org/10.1109/TIT.1970.1054406
[elyaniv-2010]: https://www.jmlr.org/papers/volume11/el-yaniv10a/el-yaniv10a.pdf

### Scoring lines with no right reply

- **SQuAD 2.0.** "For negative examples, abstaining receives a score of 1, and
  any other response gets 0, for both exact match and F1." Its models "abstain
  whenever their predicted probability that a question is unanswerable exceeds
  some threshold. We tune this threshold separately for each model on the
  development set. When evaluating on the test set, we use the threshold that
  maximizes F1 score on the development set." Also, "a baseline that always
  abstains gets 48.9 test F1" ([squad2]).
- **The official script.** It prints separate `HasAns` and `NoAns` scores, and
  its best-threshold search runs on the same data it scores ([squad2-eval]).
- **WikiQA's answer triggering.** Ranking metrics "evaluate the relative ranks
  of correct answers in the candidate sentences of a question, and hence are not
  suitable for evaluating the task of answer triggering." Instead, "we only
  consider the sentence in the candidate set that has the highest model score.
  If the score is above a predefined threshold and the sentence is labeled as a
  correct answer to the question, then it means that the prediction is correct".
  In that set, "nearly two-thirds of questions contain no correct answers"
  ([wikiqa]).
- **DSTC7.** One response-selection subtask had "100 candidates, including 0-1
  correct options": in "twenty percent of examples" the correct utterance "was
  replaced with an additional incorrect one" ([dstc7]).

[dstc7]: https://jkk.name/pub/ws18dstc_task1.pdf

### A scoring scheme for Turn's 80 lines

Synthesis: score the lines twice, once as pure ranking and once as the row a
user would see.

| What the user sees under 0.6 and 0.85 | Line has an acceptable phrase                | Line has none    |
| ------------------------------------- | -------------------------------------------- | ---------------- |
| One big button                        | Right if acceptable, else a wrong big button | Wrong big button |
| Up to six buttons                     | Right if any is acceptable, else a wrong row | Wrong row        |
| No change                             | Missed reply                                 | Right hold       |

- **Ranking, thresholds ignored.** Hit at 1, hit at 6, and reciprocal rank, on
  lines with an acceptable phrase only, twice: end to end, with each ranker over
  the whole bank and Jev over the phone's 40, and with every ranker over the
  same 40, which isolates re-ranking. Give chance rates beside them, from
  `1 − C(N − g, 6) / C(N, 6)` for g acceptable phrases among N: with one among
  40, 2.5% at 1 and 15% at 6; with two, 5% and 28%; with one among 150, 0.7% and
  4%.
- **The shortlist's recall at 40.** The share of lines whose acceptable phrase
  made the 40, since Jev can't pick a phrase the shortlist dropped.
- **Row outcomes.** The six cells of the table per ranker, coverage and risk,
  and an always-hold baseline, which is right on every "none" line and misses
  every other line.
- **Abstention precision and recall.** A hold is the "retrieved" item, using the
  textbook's precision, "the fraction of retrieved documents that are relevant",
  and recall, "the fraction of relevant documents that are retrieved"
  ([irbook-unranked]): holds on "none" lines over all holds, and over all "none"
  lines.
- **The question-type Choice.** Accuracy and a confusion matrix over yes-or-no,
  choice, open, and not a question, since a yes-or-no call brings up the fixed
  Yes, No, and Not sure buttons.
- **Subsets.** Yes-or-no lines, pain and consent lines (the trigger under the
  idea's [risks][idea-risks]), and lines that share no content word with any
  acceptable phrase, each reported apart.

The metric functions, pinned down for the TRD:

```python
def hit_at(ranked, acceptable, k):
    """ranked: phrase ids by score; acceptable: a set, empty on a none line."""
    return any(p in acceptable for p in ranked[:k])


def reciprocal_rank(ranked, acceptable):
    ranks = [i + 1 for i, p in enumerate(ranked) if p in acceptable]
    return 1 / ranks[0] if ranks else 0.0


def row_outcome(scores, acceptable, big=0.85, floor=0.6):
    """scores: {phrase id: probability}. Returns what the user would see."""
    ranked = sorted(scores, key=scores.get, reverse=True)
    top = scores[ranked[0]]
    if top < floor:
        return 'right hold' if not acceptable else 'missed reply'
    if top > big:
        kind, shown = 'big button', ranked[:1]
    else:
        kind, shown = 'row', [p for p in ranked[:6] if scores[p] >= floor]
    right = any(p in acceptable for p in shown)
    return ('right ' if right else 'wrong ') + kind
```

[irbook-unranked]: https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-unranked-retrieval-sets-1.html

## Calibration and the two confidence bars

### Calibration error and reliability diagrams

- **Definition.** Naeini, Cooper, and Hauskrecht call predictions well
  calibrated "if the outcomes predicted to occur with probability p do occur
  about p fraction of the time". Their expected calibration error (ECE) weights
  each bin's gap between the observed fraction of positives and the mean
  prediction by the bin's share of predictions, and the maximum calibration
  error (MCE) takes the largest gap; they used "K = 10" bins ([naeini-2015]).
- **Reliability diagrams.** Guo et al.: "given 100 predictions, each with
  confidence of 0.8, we expect that 80 should be correctly classified."
  Reliability diagrams "plot expected sample accuracy as a function of
  confidence" over "M interval bins (each of size 1/M)", but "reliability
  diagrams do not display the proportion of samples in a given bin"; they used
  "M = 15 bins" ([guo-2017]). Niculescu-Mizil and Caruana: "For each bin, the
  mean predicted value is plotted against the true fraction of positive cases.
  If the model is well calibrated the points will fall near the diagonal line."
  ([niculescu-2005])
- **The Brier score.** Brier's score "has a minimum value of zero for perfect
  forecasting and a maximum value of 2 for the worst possible forecasting"
  ([brier-1950]). scikit-learn 1.9.1 calls it "a strictly proper scoring rule"
  and notes that in binary tasks it "is usually divided by two" so it runs from
  0 to 1 ([sk-brier]).
- **Tools.** scikit-learn's `calibration_curve` defaults to `n_bins=5` and
  `strategy='uniform'`. It says of `n_bins`, "A bigger number requires more
  data", and of the `quantile` strategy, "The bins have the same number of
  samples"; "Calibration curves may also be referred to as reliability
  diagrams." ([sk-calcurve])

Guo et al.'s formula, with B_m the predictions in bin m of n in all
([guo-2017]):

```text
ECE = sum over bins m of (|B_m| / n) * |acc(B_m) - conf(B_m)|
```

[naeini-2015]: https://pmc.ncbi.nlm.nih.gov/articles/PMC4410090/

### Bins and small samples

- **Bias against variance.** "Selecting the number of bins has a bias-variance
  tradeoff", and fixed-width bins let overconfident and underconfident
  predictions in one bin cancel ([nixon-2019]; preprint).
- **Both directions of error.** Kumar, Liang, and Ma show that "binning lower
  bounds the calibration error", while on finite samples "the plugin estimator
  overestimates" the binned error ([kumar-2019]).
- **Equal-mass bins.** Roelofs et al.: "bins of equal mass (number of instances)
  have lower bias than estimators with bins of equal width", and "if we have a
  small number of samples, setting the number of bins too high may result in a
  poor estimate" ([roelofs-2022]).
- **Refitting needs more data.** scikit-learn's guide says isotonic calibration
  "is more prone to overfitting, especially on small datasets", and the
  calibrator should be "fit on a dataset independent of the training data"
  ([sk-calguide]).

[sk-calguide]: https://scikit-learn.org/stable/modules/calibration.html

### Checking 0.6 and 0.85 on Turn's data

- **Where the numbers come from.** TypeSafe's routing example uses 0.6 as a
  floor and 0.85 for acting without confirmation, other TypeSafe pages use 0.5,
  0.8, and 0.9, and no TypeSafe page publishes a reliability plot or calibration
  error for Jev ([jp-routing]; [jp-calibration]).
- **Embedding scores aren't probabilities.** BGE's model card says its
  similarity scores fall "about in the interval" from 0.6 to 1, so "a similarity
  score greater than 0.5 does not indicate that the two sentences are similar",
  and "what matters is the relative order of the scores, not the absolute value"
  ([hf-bge]).
- Synthesis: for Jev, draw one reliability diagram for the top phrase of each
  line, 80 points in five equal-mass bins of 16 lines, and print the counts,
  since a bin with 12 of 16 right has a 95% Wilson interval of 51% to 90%.
  Report the Brier score, and ECE only with its bin scheme named. The 3,200
  line-and-phrase Nouls give a finer picture, but they cluster 40 to a line, so
  intervals should resample lines, not pairs; no source read covers that case.
- Synthesis: 80 lines are too few to refit Jev's probabilities, so measure
  calibration and leave it alone. Label every acceptable phrase, not only the
  best, or a fitting second-best phrase counts against Jev. Reusing 0.6 and 0.85
  on BM25 or cosine scores would mean nothing; those rankers need their own
  cut-offs (see
  [Keeping threshold tuning out of the result](#keeping-threshold-tuning-out-of-the-result)).

[jp-routing]: /docs/research/jev-patterns.md#confidence-gated-routing-pattern

## Uncertainty with 80 partner lines

### Intervals for one ranker's rate

- **The Wilson interval.** NIST's handbook: "The Wilson method for calculating
  confidence intervals for proportions (introduced by Wilson (1927), recommended
  by Brown, Cai and DasGupta (2001) and Agresti and Coull (1998)) is based on
  inverting the hypothesis test", and "Another advantage is that the lower limit
  cannot be negative", which the common p̂ ± z√(p̂(1 − p̂)/n) can't promise
  ([nist-wilson]).
- **Library defaults differ.** statsmodels 0.15.0's `proportion_confint`
  defaults to `method='normal'`, the "asymptotic normal approximation", with
  `wilson` as an option, and notes that the Clopper-Pearson interval "has
  coverage at least 1-alpha, but is in general conservative" ([sm-confint]).
  SciPy 1.18.0's `binomtest(k, n).proportion_ci()` defaults to `'exact'`
  (Clopper-Pearson) and offers `'wilson'` and `'wilsoncc'` ([scipy-propci]).
- **Bounds when nothing goes wrong.** Geifman and El-Yaniv bound selective risk
  with the binomial tail, a bound they call "the tightest possible in this
  setting" ([geifman-2017]). With no errors in m trials, its one-sided 95% upper
  bound is 1 − 0.05^(1/m).

Synthesis: the 95% intervals below are this note's own arithmetic, from NIST's
Wilson formula and, for the one-sided bounds, the binomial tail; statsmodels'
`proportion_confint(k, n, method='wilson')` gives the same Wilson intervals (see
[the evaluation code](#code-for-the-evaluation-script)).

| Observed on the lines      | Rate | 95% interval                    |
| -------------------------- | ---- | ------------------------------- |
| 40 of 80                   | 50%  | 39% to 61%                      |
| 56 of 80                   | 70%  | 59% to 79%                      |
| 64 of 80                   | 80%  | 70% to 87%                      |
| 72 of 80                   | 90%  | 82% to 95%                      |
| 18 of 20 "none" lines held | 90%  | 70% to 97%                      |
| 0 wrong of 20 big buttons  | 0%   | at most 13.9% wrong (one-sided) |
| 0 wrong of 40 big buttons  | 0%   | at most 7.2% wrong (one-sided)  |
| 1 wrong of 40 big buttons  | 2.5% | at most 11.3% wrong (one-sided) |
| 0 wrong of 80 big buttons  | 0%   | at most 3.7% wrong (one-sided)  |

- Synthesis: a quality bar such as a big button wrong less than 5% of the time
  can't be shown with 80 lines, since even a perfect run on all 80 bounds the
  error at 3.7%, and the big button shows on only some lines. The PRD should
  state rates as point estimates with Wilson intervals, and keep zero-tolerance
  bars for the few lines where a wrong tap matters most: yes-or-no, pain, and
  consent.

[nist-wilson]: https://www.itl.nist.gov/div898/handbook/prc/section2/prc241.htm
[sm-confint]: https://www.statsmodels.org/stable/generated/statsmodels.stats.proportion.proportion_confint.html
[scipy-propci]: https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats._result_classes.BinomTestResult.proportion_ci.html

## Paired comparisons of the four rankers

All four rankers score the same 80 lines, so their results are paired, and tests
for two independent samples don't apply.

### McNemar's test

- **The origin.** McNemar's 1947 note, "Note on the sampling error of the
  difference between correlated proportions or percentages", in Psychometrika
  ([mcnemar-1947]).
- **Why it fits.** Dietterich compared five tests: "A fourth test, McNemar's
  test, is shown to have low type I error," and "For algorithms that can be
  executed only once, McNemar's test is the only test with acceptable type I
  error." ([dietterich-1998]) Card et al.: "The standard statistical test for
  comparing classifiers on paired data is McNemar's test (Dietterich, 1998; Dror
  et al., 2018), which uses the numbers of items where the models disagree"
  ([card-2020]).
- **The function.** statsmodels 0.15.0's
  `mcnemar(table, exact=True, correction=True)`: "If exact is True, then the
  binomial distribution will be used. If exact is False, then the chisquare
  distribution will be used, which is the approximation to the distribution of
  the test statistic for large sample sizes." ([sm-mcnemar])

[mcnemar-1947]: https://pubmed.ncbi.nlm.nih.gov/20254758/
[dietterich-1998]: https://pubmed.ncbi.nlm.nih.gov/9744903/
[sm-mcnemar]: https://www.statsmodels.org/stable/generated/statsmodels.stats.contingency_tables.mcnemar.html

### Paired bootstrap

- **In NLP evaluation.** Koehn resampled test sets and compared two systems on
  each sample: "If, say, one system outperforms the other system 95% of the
  time, we draw the conclusion that it is better with 95% statistical
  significance. We call this method paired bootstrap resampling, since we
  compare a pair of systems." He reports that "Even for small test sizes of only
  300 sentences, our methods may give us assurances that test result differences
  are real." ([koehn-2004])
- **As a p-value.** Berg-Kirkpatrick, Burkett, and Klein's procedure: "Draw b
  bootstrap samples x(i) of size n by sampling with replacement from x", count
  the samples whose gain exceeds twice the observed gain, and take that share as
  the p-value; they used 10^6 samples ([bk-2012]). Kamath et al. used "the
  paired bootstrap test with 1000 bootstrap samples" ([kamath-2020]).
- **The function.** SciPy 1.18.0's `bootstrap` takes `paired`: "If True,
  bootstrap resamples an array of indices and uses the same indices for all
  arrays in data". It defaults to `n_resamples=9999` and `method='BCa'`
  ([scipy-bootstrap]).

[koehn-2004]: https://aclanthology.org/W04-3250/
[bk-2012]: https://aclanthology.org/D12-1091/
[scipy-bootstrap]: https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html

### What 80 lines can and can't detect

- **Small test sets.** Card et al.: "if an experiment's test set is small, the
  minimum detectable effect (MDE) size may be large: only large improvements
  will yield sufficiently powered comparisons (i.e., ≥ 80% power)." Their Table
  2 puts the smallest detectable gain on WNLI's 147 test items at 5.26 points,
  against a leader at 94.5% ([card-2020]).
- **Significant but exaggerated.** Results from underpowered experiments "are
  more likely to exaggerate or reverse the true effect", and "Using the observed
  outcome from a single experiment to compute power falls into the trap of
  post-hoc power analysis and is not recommended." ([card-2020])

Synthesis: this note's own power calculation for 80 lines, enumerating every
paired outcome under the exact McNemar test at α = 0.05, counting only
rejections in the right direction. "Agreement" is the share of lines where both
rankers are right or both wrong, the parameter Card et al. call Pa; a gap larger
than the disagreement is impossible.

| Agreement between two rankers | 5-point gap | 10 points | 15 points  | 20 points  | 25 points  |
| ----------------------------- | ----------- | --------- | ---------- | ---------- | ---------- |
| 60%                           | 7%          | 23%       | 50%        | 78%        | 95%        |
| 70%                           | 9%          | 29%       | 63%        | 91%        | 99%        |
| 80%                           | 11%         | 44%       | 86%        | over 99%   | impossible |
| 90%                           | 17%         | 82%       | impossible | impossible | impossible |

- Synthesis: for 80% power, the true gap must be about 21 points at 60%
  agreement, 18 at 70%, 15 at 80%, and 10 at 90%. Whatever the true gap, a
  significant result needs a lopsided split of the disagreements: 15 to 5 of 20
  disagreements (12.5 points of 80) reaches p = 0.041, and 27 to 13 of 40 (17.5
  points) reaches p = 0.039. A paired 95% interval on the gap is about ±10
  points at 80% agreement and ±12 points at 70%.
- Synthesis: the idea's trigger, "Jev's top-6 accuracy trails embeddings on the
  80 lines" ([idea-risks]), fires on noise. By the same enumeration, at 70% to
  80% agreement Jev's observed top-6 trails on 45% to 46% of runs when the two
  are truly equal, and on 13% to 18% of runs when Jev is truly 5 points better.
  Define "trails" as a paired bootstrap interval for the gap lying wholly below
  zero, report "no clear difference" otherwise, and do any power analysis before
  the run, never from the observed gap.

### Code for the evaluation script

A worked example: Jev right on 60 of 80 lines and embeddings on 50, with 15
lines only Jev got right and 5 only embeddings did. This run gave a Wilson
interval of 64.5% to 83.2% for Jev, an exact McNemar p of 0.041, and a paired
BCa interval of 2.5 to 23.8 points for the gap.

```python
import numpy as np
from scipy.stats import bootstrap
from statsmodels.stats.contingency_tables import mcnemar
from statsmodels.stats.proportion import proportion_confint

# One entry per line: True if an acceptable phrase was in that ranker's top 6.
jev = np.array([True] * 60 + [False] * 20)
emb = np.array([True] * 45 + [False] * 15 + [True] * 5 + [False] * 15)

# proportion_confint defaults to method='normal', so name 'wilson'.
low, high = proportion_confint(jev.sum(), len(jev), method='wilson')
table = [[np.sum(jev & emb), np.sum(jev & ~emb)],
         [np.sum(~jev & emb), np.sum(~jev & ~emb)]]
p_value = mcnemar(table, exact=True).pvalue
gap = bootstrap((jev, emb), lambda a, b, axis: a.mean(axis) - b.mean(axis),
                paired=True, vectorized=True, rng=np.random.default_rng(0))
```

- Synthesis: the functions under
  [A scoring scheme for Turn's 80 lines](#a-scoring-scheme-for-turns-80-lines)
  make natural unit tests: a line with two acceptable phrases, a "none" line
  held, a "none" line given a big button, and a row with fewer than six phrases
  above 0.6.
- Synthesis: TypeSafe's cookbooks ship their API answers, so re-running one
  "replays the published numbers instead of calling the API" ([jp-cookbooks]).
  Keeping Jev's and Workers AI's answers for the 80 lines in the repository,
  with the pinned `jev-1.13.0` ([idea-jev]), would let a judge re-run the table
  without the team's keys, and a seeded bootstrap keeps the intervals the same
  on every run.

[jp-cookbooks]: /docs/research/jev-patterns.md#multi-step-and-real-time-cookbooks

## Keeping threshold tuning out of the result

- **Leakage.** scikit-learn 1.9.1: "Learning the parameters of a prediction
  function and testing it on the same data is a methodological mistake". Tuning
  settings on the test set is the same mistake: "the parameters can be tweaked
  until the estimator performs optimally. This way, knowledge about the test set
  can “leak” into the model and evaluation metrics no longer report on
  generalization performance." ([sk-cv])
- **Thresholds in particular.** `TunedThresholdClassifierCV` "tunes this
  threshold using an internal cross-validation", by default "a 5-fold stratified
  cross-validation", and the guide warns: "You should never use the same data
  for training the classifier and tuning the decision threshold due to the risk
  of overfitting." ([sk-threshold])
- **How much it matters.** Cawley and Talbot: "the effects of this form of
  over-fitting are often of comparable magnitude to differences in performance
  between learning algorithms, and thus cannot be ignored in empirical
  evaluation"; they point to "nested cross-validation" as the robust protocol
  ([cawley-2010]).
- **In the papers read here.** SQuAD 2.0 tuned its "none" threshold on the
  development set and applied it to the test set ([squad2]). Vertanen and
  Kristensson's TURK DEV set "will be used for initial evaluations and also to
  tune our models", while TURK TEST "is used only in the final evaluation
  section" ([vk-2011]). Gaines and Vertanen: "We use the dev sets for most of
  our experiments, reserving the test sets for a final evaluation"
  ([gaines-2025]). The IR book says BM25's parameters "should ideally be set to
  optimize performance on a development test collection" ([irbook-bm25]).
- Synthesis: Turn has three sets of settings that can leak: Jev's bars and
  question wording, the "none" cut-offs for BM25 and embeddings, and BM25's k1
  and b. Freeze Jev's 0.6, 0.85, and Noul wording before the run and report Jev
  on all 80 lines. Set the other rankers' cut-offs by five-fold
  cross-validation, reporting the out-of-fold results, or at the coverage Jev
  reaches (see
  [Triggering and diversity in later systems](#triggering-and-diversity-in-later-systems)).
  If anything of Jev's changes after the team sees results, report only on lines
  written by a second person and not yet seen.

[sk-cv]: https://scikit-learn.org/stable/modules/cross_validation.html
[sk-threshold]: https://scikit-learn.org/stable/modules/classification_threshold.html
[cawley-2010]: https://jmlr.org/papers/volume11/cawley10a/cawley10a.pdf

## Systems that choose replies from a fixed set

The [evidence notes][ev-without] give Smart Reply's precision at 10 and the dual
encoders' 1-of-100 results. This section adds how those systems decided whether
to suggest, kept suggestions distinct, and measured success.

### Smart Reply

- **The response set.** "We construct a response set using only the most
  frequent anonymized sentences aggregated from the preprocessed data ... This
  process yields a few million unique sentences." Semantic clusters started from
  hand-picked seeds ("In practice, we pick 100 clusters and on average 3–5
  labeled seed examples per cluster"), and the resulting pairs "are then
  validated by human raters" ([smart-reply]).
- **Whether to suggest at all.** "A feedforward neural network decides whether
  or not to suggest responses. This further improves utility by not showing
  suggestions when they are unlikely to be used." The paper gives no threshold
  ("If the score is above some threshold, we trigger and run the LSTM scoring");
  "The AUC of the triggering model is 0.854", and it triggers on "roughly 11% of
  messages". Its authors add: "it may be beneficial to slightly over-trigger,
  since the cost of presenting a suggestion, even if it is not used, is quite
  low." ([smart-reply])
- **Distinct suggestions.** "the user should never see two responses of the same
  intent." Because "the LSTM has a strong tendency towards producing positive
  responses", a rule forces balance: "If the top two responses (after omitting
  redundant responses) contain at least one positive response and none of the
  top three responses are negative, the third response is replaced with a
  negative one." With diversity turned off, "the click-through rate decreased by
  roughly 7.5% relative." ([smart-reply])
- **What was measured.** Offline, precision at 10 and 20 and mean reciprocal
  rank against the whole response set: 0.321, 0.368, and 0.155 for a frequency
  baseline against 0.483, 0.579, and 0.267 for the LSTM. Online: "The most
  important end-to-end metric for our system is the fraction of messages for
  which it was used. This is currently 10% of all mobile replies." Of the
  suggestions used, "45% were from the 1st position, 35% from the 2nd position
  and 20% from the 3rd position." ([smart-reply])

[smart-reply]: https://arxiv.org/abs/1606.04870

### Efficient response suggestion

- **The same shape.** "The system is restricted to a fixed set of response
  suggestions, R, selected from millions of common messages", returning "m
  (typically 3)" suggestions when they score well enough: "Otherwise no
  suggestions are given." Diversity comes from "a labeling of R is used to
  ensure a negative suggestion is given if the other two are affirmative and
  vice-versa." ([henderson-2017])
- **The offline metric.** "we score a set of 100 responses that includes the
  correct response and 99 randomly selected incorrect competitors ... and report
  precision at 1 (P@1)", and "We found that P@1 correlates with the quality of
  our models as measured in online experiments with users." ([henderson-2017])
- **The online metric.** The conversion rate is "the percentage of times users
  click on one of the suggestions when they are shown". A response bias toward
  common replies helped, because "Without biasing, the model prefers responses
  that are very closely related to the input email, but are less likely to be
  chosen than the more generic yes/no responses." Adding it raised conversion
  from 67% to 88% of the earlier sequence-to-sequence system's rate, at 10% of
  its latency ([henderson-2017]).

[henderson-2017]: https://arxiv.org/abs/1705.00652

### Response selection benchmarks

- **1-of-100 accuracy.** Henderson et al. 2019: "This is Recall@1 using 99
  responses sampled from the test dataset as negatives", and "While there is no
  guarantee that the 99 randomly selected negatives will all be bad responses,
  the metric nevertheless provides a simple summary." ([conv-datasets])
- **Keyword, similarity, and trained encoders side by side.** The paper says
  "The latest evaluation results are maintained in the repository"
  ([conv-datasets]), so this table takes the repository's benchmark page, in
  percent ([conv-benchmarks]):

| Method                                 | Reddit | OpenSubtitles | AmazonQA |
| -------------------------------------- | ------ | ------------- | -------- |
| TF-IDF                                 | 26.4   | 10.9          | 51.8     |
| BM25                                   | 27.5   | 10.9          | 52.3     |
| Universal Sentence Encoder, similarity | 36.6   | 13.6          | 47.6     |
| BERT-large, similarity                 | 14.8   | 12.2          | 25.9     |
| USE-QA, similarity                     | 46.3   | 16.8          | 67.0     |
| Dual encoder trained on Reddit         | 61.3   | 30.6          | 71.3     |
| ConveRT                                | 68.3   | 21.5          | 84.3     |

- **What the authors conclude.** "The keyword-based TF-IDF and BM25 are broadly
  competitive with the vector-based methods, and are particularly strong for
  AmazonQA, possibly because rare words such as the product name are
  informative." A learned map on top of similarity embeddings gives "a
  consistent boost", "showing the importance of learning the mapping from
  context to response versus simply relying on similarity." ([conv-datasets]) On
  OpenSubtitles the dual encoder was fine-tuned and ConveRT wasn't; on AmazonQA
  ConveRT was ([conv-benchmarks]).
- **ConveRT.** Trained on "727M (input, response) pairs", "ConveRT is only 59MB
  in size, making it significantly smaller than the previous state-of-the-art
  dual encoder (444MB)", and its authors conclude that "this illustrates the
  importance of explicitly distinguishing between inputs/contexts and responses
  when modeling response selection" ([convert]). The models are gone: "the
  PolyAI team has decided to take down the ConveRT models from the public
  domain." ([polyai-models])
- **Recall at k.** In the Ubuntu corpus, with one right reply among ten, recall
  at 1 was 41.0% for TF-IDF, 40.3% for an RNN, and 60.4% for an LSTM
  ([ubuntu-2015]).

[convert]: https://arxiv.org/abs/1911.03688
[polyai-models]: https://github.com/PolyAI-LDN/polyai-models

### Triggering and diversity in later systems

- **Skype's suggested replies.** Deb, Bailey, and Shokouhi built the set from
  frequency and a language model ("select top 100k responses based on frequency
  and then top 30k based on lm-scores"), then the system "selects top15
  candidates and de-duplicates using lexical clustering to suggest three
  responses." They measured "Defects (a response is deemed incorrect) and
  Duplicates (at least 2 out of 3 responses are semantically similar)" with
  "crowd sourced human judgments with at least 5 judges per sample", cut
  duplicates "by as much as 40%", and raised clicks by about 5% in a two-week
  A/B test ([deb-2019]).
- **Gmail's Smart Compose.** It shows a suggestion "only when the model is
  'confident' enough" and sets "a triggering threshold based on a target
  triggering frequency/coverage". To compare models fairly, "we first select
  model-specific triggering confidence thresholds to make sure all models have
  the same coverage, and then compute the ExactMatch results out of triggered
  suggestions." Its latency rule: "The system requires the 90th percentile
  latency to be under 60ms." ([smart-compose])
- **Personal signals.** On Reddit, adding the author to the message raised
  precision at 1 from 75.15 to 83.25 with 10 candidates and from 49.16 to 60.53
  with 100 ([al-rfou-2016]).

[deb-2019]: https://arxiv.org/abs/1903.10630
[smart-compose]: https://arxiv.org/abs/1906.00080
[al-rfou-2016]: https://arxiv.org/abs/1606.00372

### What carries over to Turn

- Synthesis: Turn's "none" is Smart Reply's trigger, so score it as its own
  decision (see
  [A scoring scheme for Turn's 80 lines](#a-scoring-scheme-for-turns-80-lines)).
  Smart Reply could over-trigger because an unused suggestion cost little.
  Turn's row of six is cheap in the same way, since nothing speaks until the
  user taps, but a wrong big button on a pain or consent line is not, so judge
  0.85 on precision and 0.6 on coverage.
- Synthesis: compare rankers whose scores live on different scales at equal
  coverage, as Smart Compose did, and plot each ranker's risk-coverage curve
  rather than trusting one threshold per ranker.
- Synthesis: keep the six buttons distinct. One phrase per intent, or per bank
  category, and a duplicate count in the evaluation follow Smart Reply and
  Skype; the fixed Yes, No, and Not sure buttons already do the forced
  negative's job.
- Synthesis: every published number here is tied to its candidate count (1 of
  10, 1 of 100, a response set of millions), so Turn's results mean little
  without the 40-candidate chance rates.
- Synthesis: a frequency prior was strong in Smart Reply, Henderson et al., and
  Al-Rfou et al., which supports the idea's most-used replies in the shortlist.
  A fresh starter bank has no usage history, so the evaluation can't test that
  prior unless it simulates one; the TRD should say which.

## How AAC suggestion studies measured success

The [evidence notes][ev-without] cover Converser, TalkAbout, and the headline
SpeakFaster result; this section keeps to how each study measured success, and
what the numbers were.

### Keystroke savings and hit rates in simulation

- **Retrieving the user's own sentences.** Kristensson et al. assumed "a
  hypothetical user has 500 prior sentences stored in their AAC system", ranked
  them by keyword methods with "k1 = 1.2 and b = 0.75" for BM25, and scored a
  hit this way: "we retrieve the four best matching sentences and consider a
  match to be found if one of these four retrieved sentences matches the test
  sentence." Keystroke savings are 1 − km/kc, "where km is the number of
  keystrokes that need to be typed before the model under investigation results
  in a matching sentence and kc is the number of keystrokes in total for the
  test sentence." They drew "40 sentences at random" per test, estimated
  "keystroke savings ranging from 50–96%, depending on assumptions", and tested
  no users: "It is extremely difficult to validate a context-aware sentence
  retrieval system with AAC users" ([kristensson-2020]).
- **Word prediction.** Vertanen and Kristensson defined savings with "kp is the
  number of keystrokes required with word predictions and ka is the number of
  keystrokes required without", for a keyboard showing five predictions; their
  best model "reduced perplexity by 60-82% relative on three AAC-like test sets.
  This translated to a potential keystroke savings in a predictive keyboard
  interface of 5–11%." ([vk-2011])
- **Counting misses.** Cai et al. 2022 charged for failures: "If the ground
  truth is not in top-5, we add a penalty term (Lfull) to account for the need
  to enter the phrase by starting anew character-by-character, leading to a
  negative KSR." With one partner turn as context, "KSR all approaches 50% and
  is higher compared to no context (20%-37%)" ([cai-2022]).
- **SpeakFaster in simulation.** Its keystrokes include "not only keypresses on
  the keyboard but also UI actions required to use the phrase- and
  word-prediction features". Simulated: "Strategy 1 and Strategy 2 led to the
  keystroke-saving rate (KSR) values 0.640 and 0.657, respectively,
  significantly exceeding the Gboard KSR (0.482)". It showed five options
  because "KSRs in SpeakFaster increased monotonically with the number of
  options, but started to level off at approximately five", and about two-thirds
  of turns needed one model call, a share that "became approximately halved when
  the conversational context was unavailable" ([speakfaster]).
- **The partner's words, even misheard.** Adding partner turns cut a language
  model's perplexity from 93 to 81, and "Even at error probabilities up to 0.7,
  partner turns improved predictions" ([vertanen-2017]; poster). With recognized
  partner speech, "despite recognition word error rates of 7–16%", predictions
  were "nearly as good as when they used the reference transcripts"
  ([adhikary-2019]).

[cai-2022]: https://arxiv.org/abs/2205.03767
[vertanen-2017]: https://www.keithv.com/pub/aacdialogue/VertanenDialogueAAC.pdf
[adhikary-2019]: https://www.keithv.com/pub/speechaac/adhikary-speech-aac.pdf

### Rates, utilization, and ratings with users

- **SpeakFaster with users.** Eye-gaze typists' savings "were in the range of
  0.32–0.36 ... a significant gap from the offline simulation results (which
  exceeded 0.6)." One lab user with ALS reached "6.54 WPM", 61.3% above a 4.05
  WPM baseline, and one field user "an average speed of 10.4 ± 2.6 WPM, which is
  28.8% faster than the daily baseline". The model calls took about 843 ms,
  while choosing among options took "12,732 ± 5207 ms" scripted and "21,225 ±
  19,807 ms" unscripted ([speakfaster]).
- **Utilization.** In a simulated-rate study, "an advanced system gave a 58.6%
  improvement" in communication rate, helped by "better utilization (93.6%
  utilization for advanced versus 78.2% for basic)" ([trnka-2009]).
- **Costs of looking.** An earlier study found "the cost of using this word
  prediction system balanced the benefit of the keystroke savings"
  ([koester-1994]).
- **Stored whole utterances.** Over a training study with one user of the TALK
  system, "average prespeech pause times decreased (from 9 to 5 seconds) and her
  conversational rate increased (from 36 to 64 words per minute)", and ratings
  of the user's competence rose with the rate ([todman-2000]). A later
  comparison: "Conversational rate and perceived communicative competence were
  both higher when the UBD was used." ([todman-2008])
- **Judged quality.** KWickChat reports savings of "around 71%" at a word error
  threshold of 0.65, and two judges gave "a median rating of 4 on a scale from 1
  (very bad) to 5 (very good)" with "an inter-rater reliability of 0.92 across
  all 400 sentences judged" ([kwickchat]; abstract only).

[trnka-2009]: https://doi.org/10.1145/1497302.1497307
[koester-1994]: https://pubmed.ncbi.nlm.nih.gov/10147209/
[todman-2000]: https://doi.org/10.1080/07434610012331279024
[todman-2008]: https://pubmed.ncbi.nlm.nih.gov/18830912/
[kwickchat]: https://doi.org/10.1145/3490099.3511145

### Measures that fit Turn

- Synthesis: for the 80 lines, hit at 1 and hit at 6 are Kristensson et al.'s
  hit at 4 with Turn's row sizes, and a miss should carry a cost, as in Cai et
  al., rather than drop out of the average.
- Synthesis: the offline fallback ranks by place and typed letters, so its
  natural score is Kristensson's: letters typed before an acceptable phrase
  reaches the row, over 0, 1, 2, and 3 letters. The partner-line rankers are
  scored with no letters typed.
- Synthesis: run the evaluation twice, on the typed lines and on the same lines
  spoken and transcribed on the phone, since Jev "accepts text input only" and
  ranks a misheard line as heard ([ev-jagged]).
- Synthesis: offline hits are an upper bound. If the team ever tests with users,
  SpeakFaster, TALK, and Trnka et al. point to the measures: the pause before
  the user speaks, the time to choose, how often the row is used when it holds a
  fitting phrase, and ratings. Converser's partners rated speed and quality no
  differently ([ev-without]), so partner ratings may not move.

[ev-jagged]: /docs/research/next-gen-evidence.md#jevs-jagged-edges-for-turn

## Baselines: BM25 and embeddings

### BM25 settings

- **Ranges, not defaults.** Robertson and Zaragoza: "Concerning the internal
  parameters, the model provides no guidance on how these should be set."
  Experiments "suggest that in general values such as 0.5 < b < 0.8 and 1.2 <
  k1 < 2 are reasonably good in many circumstances. However, there is also
  evidence that optimal values do depend on other factors (such as the type of
  documents or queries)." ([rz-2009])
- **The textbook fallback.** "In the absence of such optimization, experiments
  have shown reasonable values are to set k1 and k3 to a value between 1.2 and 2
  and b = 0.75." The same page warns that "if a term occurs in over half the
  documents in the collection then this model gives a negative term weight"
  ([irbook-bm25]).
- **Library defaults.** Lucene 10.5.1: "BM25 with these default values: k1 = 1.2
  b = 0.75", with IDF "Implemented as"
  `log(1 + (docCount - docFreq + 0.5)/(docFreq + 0.5))`, which can't go negative
  ([lucene-bm25]). Elasticsearch gives the same defaults ([es-similarity]).
  Kristensson et al. used the same values ([kristensson-2020]), while Henderson
  et al.'s baseline code uses `k1=2.0, b=0.75` ([conv-keyword]).
- **In TypeScript.** MiniSearch scores with "BM25+", with
  `defaultBM25params = { k: 1.2, b: 0.7, d: 0.5 }`, and says "Customizing these
  is almost never necessary" ([minisearch]); npm lists version 7.2.0 under the
  MIT license ([minisearch-npm]).
- **One-sentence documents.** The multilingual USE paper: "We exclude
  sentence-level BM25, as BM25 generally performs poorly at this granularity."
  ([use-qa]) The ReQA paper: "earlier work has shown that traditional term-based
  document retrieval technologies are unsuccessful when applied to
  sentence-level retrieval" ([reqa]).

[conv-keyword]: https://github.com/PolyAI-LDN/conversational-datasets/blob/master/baselines/keyword_based.py
[minisearch-npm]: https://www.npmjs.com/package/minisearch

### Similarity embeddings and reply-trained embeddings

- **Trained on question and answer pairs.** In USE-QA, "Responses are encoded
  with additional context information such that the resulting embeddings have a
  high dot product similarity score with the questions they answer." On SQuAD
  sentence retrieval, it reached a precision at 1 of 53.2 against 47.1 for the
  general encoder ([use-qa]).
- **Little word overlap.** In ReQA's sentence retrieval, USE-QA's recall at 1
  was 0.439 on SQuAD and 0.147 on Natural Questions, against 0.240 and 0.043 for
  InferSent, a general sentence embedding; the authors blame, in part, "the
  lower degree of lexical overlap between questions and answers." On paragraphs
  of Natural Questions, BM25's recall at 1 was 0.066 against 0.247 for USE-QA.
  They warn that "BM25 is a difficult baseline to beat when questions were
  written with advance knowledge of the answer" ([reqa]).
- **BM25 stays strong elsewhere.** BEIR: "dense or sparse embeddings can
  substantially underperform traditional lexical models like BM25. Overall, BM25
  remains a strong baseline for zero-shot text retrieval", and "there can be a
  strong lexical bias present in datasets" ([beir]).
- **Symmetric against asymmetric search.** In symmetric search "you could
  potentially flip the query and the entries"; for asymmetric search, "It is
  critical that you choose the right model for your type of task." The multi-qa
  models were "trained on 215M question-answer pairs", and "models that perform
  well on the leaderboard do not necessarily do well on your tasks"
  ([sbert-search]; [sbert-models]).
- **For replies.** Henderson et al.'s table under
  [Response selection benchmarks](#response-selection-benchmarks) is the closest
  published comparison: BM25 at 27.5, similarity with the general encoder at
  36.6, and a reply-trained encoder at 61.3 on Reddit.

[beir]: https://arxiv.org/abs/2104.08663
[sbert-search]: https://sbert.net/examples/sentence_transformer/applications/semantic-search/README.html
[sbert-models]: https://sbert.net/docs/sentence_transformer/pretrained_models.html

### Workers AI embedding models on September 22, 2026

The [technology notes][tech-embed] list bge-small-en-v1.5, bge-base-en-v1.5,
bge-m3, and qwen3-embedding-0.6b, and their prices are unchanged. The catalog
page reads "Last updated Aug 12, 2026" ([cf-models]); the pricing and limits
pages read "Last updated Sep 17, 2026" ([cf-ai-pricing]; [cf-ai-limits]).

| Model not in the technology notes                     | Dimensions     | Input limit | Price on the model page       |
| ----------------------------------------------------- | -------------- | ----------- | ----------------------------- |
| [`@cf/baai/bge-large-en-v1.5`][cf-bge-large]          | 1,024          | 512 tokens  | "$0.204 per M input tokens"   |
| [`@cf/google/embeddinggemma-300m`][cf-embeddinggemma] | Not stated     | Not stated  | None listed; marked Beta      |
| [`@cf/baai/bge-reranker-base`][cf-bge-reranker]       | Not applicable | Not stated  | "$0.00311 per M input tokens" |

- **Limits.** Text embeddings allow "3000 requests per minute", but for
  bge-large the limit "is 1500 requests per minute" ([cf-ai-limits]). Workers AI
  costs "$0.011 per 1,000 Neurons", with "10,000 Neurons per day at no charge"
  ([cf-ai-pricing]).
- **Pooling.** The BGE models take `pooling`, `mean` by default: "`cls` pooling
  will generate more accurate embeddings on larger inputs - however, embeddings
  created with cls pooling are not compatible with embeddings generated with
  mean pooling. ... we highly suggest using the new `cls` pooling for better
  accuracy." ([cf-bge-base])
- **Query instructions.** BGE's card gives a query prefix, "Represent this
  sentence for searching relevant passages: ", says "No instruction only has a
  slight degradation", and advises "choosing the setting that achieves better
  performance on your task" ([hf-bge]). Qwen3's Workers AI schema takes an
  instruction whose default is "Given a web search query, retrieve relevant
  passages that answer the query" ([cf-qwen3-embed]), and Qwen's card reports
  that instructions give "an improvement of 1% to 5%" ([hf-qwen3-embed]).
- **A cross-encoder.** The reranker scores a query against each context, and its
  score "can be mapped to a float value" between 0 and 1 "by sigmoid function"
  ([cf-bge-reranker]).
- Synthesis: the catalog lists no encoder trained on message and reply pairs,
  such as USE-QA or ConveRT, so the "embeddings" ranker is a similarity model
  and should behave like the similarity rows in Henderson et al.'s table.

[cf-models]: https://developers.cloudflare.com/workers-ai/models/
[cf-ai-limits]: https://developers.cloudflare.com/workers-ai/platform/limits/
[cf-bge-large]: https://developers.cloudflare.com/workers-ai/models/bge-large-en-v1.5/
[cf-embeddinggemma]: https://developers.cloudflare.com/workers-ai/models/embeddinggemma-300m/
[cf-bge-reranker]: https://developers.cloudflare.com/workers-ai/models/bge-reranker-base/
[cf-qwen3-embed]: https://developers.cloudflare.com/workers-ai/models/qwen3-embedding-0.6b/
[hf-qwen3-embed]: https://huggingface.co/Qwen/Qwen3-Embedding-0.6B

### Apple's NLEmbedding

- **Availability.** `sentenceEmbedding(for:)` is available from iOS 14.0 and
  macOS 11.0 ([nl-sentence]), so the evaluation can run Apple's embeddings on a
  Mac.
- **Distance.** The distance defaults to cosine: "The range of a cosine distance
  is `[0.0, 2.0]`, derived from the expression `1 -` cosine similarity."
  ([nl-cosine]) One instance "isn't safe for concurrent use" ([nl-embedding]).
- **Size and languages.** The docs define `dimension` only as "The number of
  dimensions in the vocabulary's vector space" ([nl-embedding]); WWDC 2020 said
  "The dimension of this vector is 512 dimensions" and listed "English, Spanish,
  French, German, Italian, Portuguese and simplified Chinese" ([wwdc20-10657]).
- **Symmetric by design.** Apple's own example matches the question "Where is my
  order?" to a similar question in an FAQ ([nl-similarity]), and the newer
  `NLContextualEmbedding` returns per-token vectors that need you to "pool or
  combine subword vectors", adding "For semantic similarity tasks, consider
  using" `NLEmbedding` ([nl-contextual]).

[nl-sentence]: https://developer.apple.com/documentation/naturallanguage/nlembedding/sentenceembedding(for:)
[nl-cosine]: https://developer.apple.com/documentation/naturallanguage/nldistancetype/cosine
[nl-similarity]: https://developer.apple.com/documentation/naturallanguage/finding-similarities-between-pieces-of-text
[nl-contextual]: https://developer.apple.com/documentation/naturallanguage/nlcontextualembedding

### Choosing the embedding ranker

- Synthesis: use `@cf/baai/bge-base-en-v1.5` with `cls` pooling as the Workers
  AI ranker, and try it with and without BGE's query prefix on the development
  lines only. `qwen3-embedding-0.6b`, with partner lines as queries and a
  Turn-specific instruction such as "Given what a conversation partner just
  said, retrieve the reply that answers it", is the instruction-aware
  alternative. Cost is negligible: 80 lines and about 150 phrases are a few
  thousand tokens.
- Synthesis: expect "How was physio?" to "It was hard" to defeat both BM25,
  which has no shared word to use, and similarity embeddings, which favor
  phrases on the same topic. The evaluation should count such lines apart and
  report the shortlist's recall at 40 on them, since that is where the idea says
  Jev earns its place ([idea-how]).
- Synthesis: `bge-reranker-base` over the BM25 shortlist would be a fifth ranker
  that tests whether Jev beats an off-the-shelf cross-encoder. Apple's sentence
  embedding is the phone-side re-ranking path the idea keeps if Jev trails
  ([idea-jev]); scoring it on a Mac shows what that fallback would give.

## Data for the partner lines and the starter bank

### Dataset licenses

| Dataset                                                          | What its own pages say                                                                                                                                       | In an MIT repository                      |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| DailyDialog ([dd-card]; [dd-home-2019])                          | "licensed under CC BY-NC-SA 4.0"; originally "only for research purposes", and "The original copyright of all the conversations belongs to the source owner" | Not without permission                    |
| Persona-Chat ([personachat]; [parlai-license]; [parlai-convai2]) | Released "open source in ParlAI", whose code is MIT; the data archive has no license file, and ParlAI's ConvAI2 page says "License: CC 4.0 BY"               | Unclear                                   |
| Switchboard-1 ([ldc-swb]; [ldc-nonmember])                       | Only for "non-commercial linguistic education, research and technology development"; no redistribution "to others outside of User's Research Group"          | No                                        |
| Switchboard Dialog Act Corpus ([swda-potts]; [swda-github])      | Every transcript "should not be redistributed"; Potts's page is CC BY-NC-SA 3.0 and his repository GPL-2.0                                                   | No                                        |
| Taskmaster-1, 2, and 3 ([taskmaster])                            | "made available under the Creative Commons Attribution 4.0 License"                                                                                          | Yes, credited and marked CC BY; task talk |
| Crowdsourced AAC messages, 2011 ([aac-imagine])                  | CC BY 4.0, "With the exception of lm_test_switch.txt and lm_test_comm.txt"                                                                                   | Yes, credited and marked CC BY            |
| Turk dialogues and COMM2 ([aac-turk]; [aac-comm2])               | The pages say CC BY 4.0; the readmes inside the zips say "Attribution-NoDerivs 3.0 Unported License"                                                         | Unclear; no edits under ND                |

- **DailyDialog's source.** Its authors "crawl the raw data from various
  websites which serve for English learner to practice English dialog in daily
  life." ([dailydialog])
- **Taskmaster's content.** Taskmaster-1 covers "ordering pizza, creating auto
  repair appointments, setting up ride service, ordering movie tickets, ordering
  coffee drinks and making restaurant reservations" ([taskmaster]), talk with an
  assistant rather than between people.

[dd-card]: https://huggingface.co/datasets/li2017dailydialog/daily_dialog
[dd-home-2019]: https://web.archive.org/web/20191218084318/http://yanran.li/dailydialog.html
[personachat]: https://arxiv.org/abs/1801.07243
[parlai-license]: https://github.com/facebookresearch/ParlAI/blob/main/LICENSE
[parlai-convai2]: https://github.com/facebookresearch/ParlAI/blob/main/parlai/tasks/convai2/README.md
[ldc-nonmember]: https://catalog.ldc.upenn.edu/license/ldc-non-members-agreement.pdf
[taskmaster]: https://github.com/google-research-datasets/Taskmaster
[aac-imagine]: https://www.aactext.org/imagine/
[dailydialog]: https://arxiv.org/abs/1710.03957

### What the license texts say

- **MIT.** Permission covers "this software and associated documentation files",
  subject to one condition: "The above copyright notice and this permission
  notice shall be included in all copies or substantial portions of the
  Software." ([osi-mit])
- **NonCommercial and ShareAlike.** "NonCommercial means not primarily intended
  for or directed towards commercial advantage or monetary compensation", and
  adaptations must carry "a Creative Commons license with the same License
  Elements, this version or later, or a BY-NC-SA Compatible License."
  ([cc-by-nc-sa])
- **Creative Commons' own advice.** "We recommend against using Creative Commons
  licenses for software", and for collections, "You may choose a license for the
  collection, however this does not change the license applicable to the
  original material." It adds that "material under any of the Creative Commons
  NonCommercial licenses cannot be used commercially" and "CC cannot advise you
  on what is and is not commercial use." ([cc-faq])
- **Open source licenses for data.** GitHub's choosealicense: "Open source
  software licenses can be also used for non-software works and are often the
  best choice, especially when the works in question can be edited and versioned
  as source." ([cal-nonsoftware])
- Synthesis: Turn sells a $24.99 unlock, and none of these texts settles whether
  a public evaluation file in a paid app's repository is commercial use. Lines
  the team writes itself carry no such question, and MIT can cover them.

[osi-mit]: https://opensource.org/license/mit
[cc-by-nc-sa]: https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.en
[cc-faq]: https://creativecommons.org/faq/
[cal-nonsoftware]: https://choosealicense.com/non-software/

### Question types in dialogue-act schemes

- **SWBD-DAMSL.** The Switchboard coders' manual separates "qy yes/no question",
  "qw wh-question", "qo open ended question", and "qh rhetorical question", plus
  or-questions, declarative questions, which "function pragmatically as
  questions but" lack question form, and tag questions, "a statement and a 'tag'
  which seeks confirmation". Open questions are those that "place few if any
  syntactic constraints on the form of the answer" ([swbd-damsl]).
- **How rare questions are.** In Stolcke et al.'s table, statements make up 36%
  of Switchboard's utterances and opinions 13%, against 2% yes-no questions, 1%
  wh-questions, 1% declarative yes-no questions, and 0.3% open questions, as
  "percentages of the total number of utterances in the overall corpus"
  ([stolcke-2000]).
- **Questions in American English.** Of 328 questions in 17 interactions, 70%
  were polar (230), and "Only 27% (n = 90) of all questions were Q-word
  questions, and alternative questions accounted for less than 3% of questions
  (n = 8)." Among the polar questions, 63% were declarative, 31% interrogative,
  and 6% tags: "In spontaneous conversation, however, declarative utterances
  were the dominant polar question type". Also, "nearly 1/3 of questions were
  deployed to initiate repair" ([stivers-2010]).
- **Across ten languages.** Stivers et al. 2009 note that polar questions were
  "67% of total questions in our 10-language sample" ([stivers-2009]).
- **ISO 24617-2.** Its categories include the "Propositional Question (a.k.a.
  Yes/No-Question)", the check question, the "Set Question (a.k.a.
  WH-Question)", and the "Choice Question (a.k.a. Alternatives Question)"
  ([dit]). Bunt's guidelines: "Think functionally, not formally", and "Would you
  like some coffee? is most likely an offer, rather than a question"
  ([iso-guidelines]).

Synthesis: how Turn's four Choice options map onto the two schemes, with
Stivers' shares of questions:

| Turn's Choice            | SWBD-DAMSL tags              | ISO 24617-2          | Share of questions (Stivers 2010) |
| ------------------------ | ---------------------------- | -------------------- | --------------------------------- |
| Yes-or-no                | qy, qy^d, ^g                 | Propositional, Check | 70%                               |
| A choice between options | qr, qrr                      | Choice               | under 3%                          |
| Open                     | qw, qw^d, qo                 | Set                  | 27%                               |
| Not a question           | statements, backchannels, qh | Inform and others    | Not applicable                    |

[swbd-damsl]: https://web.stanford.edu/~jurafsky/ws97/manual.august1.html
[stolcke-2000]: https://arxiv.org/abs/cs/0006023
[stivers-2010]: https://doi.org/10.1016/j.pragma.2010.04.011
[dit]: https://dit.uvt.nl/
[iso-guidelines]: https://semantic-annotation.uvt.nl/ISO24617-2_Annotation_Guidelines.pdf

### Hand-written test sets in AAC research

- **No genuine corpus.** Vertanen and Kristensson: "there are unfortunately no
  publicly available sources of genuine conversational AAC messages." Their test
  sets included "Context specific phrases suggested by AAC specialists", and
  they split development and test data by crowd worker ([vk-2011]).
- **Surrogate stored sentences.** Kristensson et al. used "a set of 500
  sentences from a publicly available AAC corpus" to model a user's stored
  sentences ([kristensson-2020]).
- **Scripted overstates.** SpeakFaster's simulated savings were lower on users'
  own unscripted turns, "mean: 0.527 vs. 0.650", "likely due to a domain
  mismatch between the TDC dataset and the unscripted content composed by the
  users" ([speakfaster]). Its MIT repository ships only "per-line corrections in
  the `sed` format" for the Turk dialogues, not the dialogues ([tdc-repo]).
- **Fresh sets for language models.** Gaines and Vertanen built "offline, novel
  test sets of AAC-like text that can be used to evaluate LLMs without fear of
  their inclusion in the models' training data" ([gaines-2025]).

[tdc-repo]: https://github.com/TeamGleason/SpeakFaster/tree/main/data/naacl_2022_suppl_data

### Writing Turn's 80 lines

- Synthesis: write the 80 lines and the starter bank by hand. The public sets
  are non-commercial, share-alike, non-redistributable, unclear, or task talk,
  and a public set may sit in a model's training data.
- Synthesis: shape the mix on the sources above. Among the questions, about
  seven in ten yes-or-no, many of them declarative ("You're tired?") or tags;
  about a quarter open; a few choices, over-sampled so the category is tested at
  all; and statements, greetings, offers such as "Do you want some water?", and
  repair ("Sorry?"). About a fifth of the lines should have no fitting phrase in
  the bank, like DSTC7's 20%.
- Synthesis: guard the lines against the bank. ReQA's warning applies when lines
  are written while looking at the answers, so write the lines before looking at
  the bank, have a second person label every acceptable phrase, report the
  labelers' agreement as KWickChat did, and flag lines that share no content
  word with any acceptable phrase.
- Synthesis: split by author, as Vertanen and Kristensson split by worker: one
  person's lines tune what may be tuned, and the other's are the test set.

## Latency for a conversational turn

### Gaps between turns

- **Answers to yes-or-no questions.** Across ten languages, responses "have a
  unimodal distribution with a mode offset for each language between 0 and +200
  ms, and an overall mode of 0 ms"; "The medians are also quite uniform, ranging
  from 0 ms (English, Japanese, Tzeltal, and Yélî-Dnye) to +300 ms", and "The
  mean response offset for the full dataset is +208 ms". Responses "are often
  delayed by up to 1 s if, for example, they do not answer the question".
  Response time was "the time elapsed between the end of the question turn and
  the beginning of the response turn" ([stivers-2009]).
- **Planning ahead.** "the gaps between turns are short (of the order of 200
  ms), but the latencies involved in language production are much longer (over
  600 ms)" ([levinson-2015]).
- **Most gaps are short.** "70–82% of all between-speaker intervals (i.e. gaps
  and overlaps) were shorter than 500 ms", while "Acoustic silence thresholds at
  500 ms or 1000 ms are used in many end-of-utterance detectors in speech
  technology applications", so "a speech technology application using a 500 ms
  acoustic silence threshold would have captured only 18–30%" of the intervals
  ([heldner-2010]).
- **When silence reads as reluctance.** Listeners rated gaps from 200 to 1,200
  ms: "There was a notable drop-off in ratings at 600 ms and a statistically
  significant difference in ratings between 700 and 800 ms" ([roberts-2013]). In
  conversation, "Only for turn transitions of 700 ms or more was the proportion
  of dispreferred responding actions clearly greater than that of preferreds."
  ([kendrick-2015])

[heldner-2010]: https://doi.org/10.1016/j.wocn.2010.08.002
[roberts-2013]: https://pubmed.ncbi.nlm.nih.gov/23742442/
[kendrick-2015]: https://doi.org/10.1080/0163853X.2014.955997

### Pauses before an AAC reply

- **Pause length and competence.** Todman and Rzepecka replaced the pauses
  before stored utterances "with pauses of specified lengths (2 s, 6 s, 10 s,
  Natural = 16 s)", and "Communicative competence ratings of these modified
  conversations showed a highly significant linear trend, with ratings
  increasing from the 16 s condition through the 2 s condition." For
  whole-utterance systems, "it is primarily the average length of pause between
  utterances that determines conversational rate." ([todman-2003])
- **Relevance can beat speed.** Store clerks gave "Significantly higher mean
  ratings ... for the conditions involving the slowly delivered relevant
  messages" than "the quickly delivered partly relevant message condition"
  ([bedrosian-2003]).
- **Oral timing is out of reach.** The evidence notes hold Buzolich and
  Wiemann's 1988 finding on lost turns and Rayman et al.'s 2024 simulation of
  repairs ([ev-need]). That simulation measured delays against "a conservative
  temporal limit obtained for oral communicators" and found that even "at the
  fastest 0.5 s selection latency level, utterance-level composition delays for
  both SOTs were substantially greater than the OIR limit set for this study",
  with most groups "unable to type even a single selection within these bounds"
  ([rayman-2024]).

[ev-need]: /docs/research/next-gen-evidence.md#evidence-that-turns-problem-matters
[rayman-2024]: https://pubmed.ncbi.nlm.nih.gov/37916671/

### Measuring time to the row

- **Endpointing metrics.** Google's end-of-query work reports "EP50 is the
  median latency over all utterances" and "EP90 is the 90th percentile latency
  over all utterances", where "latency is the time at which the system closed
  the mic minus the time at which the user finished speaking", and "forced
  alignment of a reference transcript is used to determine when the user
  finished speaking". A third measure, EP cutoff, is "the proportion of
  utterances where the user is cut off" ([shannon-2017]). Endpointing dominates:
  "the quality of EP prediction is the largest single determinant" of the
  latency users perceive, since "a response typically will not be generated
  until the system recognizes that the user has finished speaking"; on voice
  search, EP50 and EP90 fell from 390 and 740 ms to 270 and 560 ms
  ([bijwadia-2022]). These are Google's server-side figures, not Apple's
  on-device transcriber.
- **Percentiles, not means.** "Using percentiles for indicators allows you to
  consider the shape of the distribution", and "User studies have shown that
  people typically prefer a slightly slower system to one with high variance in
  response time" ([sre-slo]).
- **How the percentile is computed.** NumPy's `percentile` defaults to
  `method='linear'` ([numpy-percentile]); on 80 values, its p95 falls between
  the 76th and 77th smallest, so about four lines set it.
- **Timestamps on the phone.** `SpeechTranscriber` can report volatile results,
  which "Provides tentative results for an audio range in addition to the
  finalized result", and `fastResults` "Biases the transcriber towards
  responsiveness, yielding faster but also less accurate results"
  ([apple-st-reporting]). Each result's `resultsFinalizationTime` is "The audio
  input time up to which results from this module have been finalized"
  ([apple-st-result]), and the `audioTimeRange` option "Includes time-code
  attributes in a transcription's attributed string" ([apple-st-attributes]).
  `OSSignposter` is "An object for measuring task performance using the unified
  logging system" ([apple-ossignposter]), and React Native's `performance.now()`
  "Provides the number of milliseconds from system boot, instead of the number
  of milliseconds from app startup" ([rn-performance]). The [technology
  notes][tech-speech] cover the transcriber itself.
- **The network part.** Jev's round trips and the relay's placement are in the
  [Jev notes][jev-latency] and [Cloudflare notes][cf-placement].

[shannon-2017]: https://www.isca-archive.org/interspeech_2017/shannon17_interspeech.pdf
[bijwadia-2022]: https://arxiv.org/abs/2211.00786
[sre-slo]: https://sre.google/sre-book/service-level-objectives/
[numpy-percentile]: https://numpy.org/doc/stable/reference/generated/numpy.percentile.html
[apple-st-reporting]: https://developer.apple.com/documentation/speech/speechtranscriber/reportingoption
[apple-st-result]: https://developer.apple.com/documentation/speech/speechtranscriber/result
[apple-st-attributes]: https://developer.apple.com/documentation/speech/speechtranscriber/resultattributeoption
[apple-ossignposter]: https://developer.apple.com/documentation/os/ossignposter
[rn-performance]: https://reactnative.dev/docs/global-performance
[tech-speech]: /docs/research/next-gen-tech.md#speechanalyzer-and-speechtranscriber
[jev-latency]: /docs/research/jev.md#rate-limits-context-length-and-latency
[cf-placement]: /docs/research/cloudflare-workers.md#latency-and-placement

### A latency target for Turn

- Synthesis: define time to the row per partner line as the moment the row is
  drawn minus the moment the partner stopped speaking, and report p50, p95, the
  maximum, the count, and the percentile method. Report also how often a line
  went to Jev before the partner had finished, Google's EP cutoff applied to
  Turn.
- Synthesis: aim for p50 of 1.0 s or less and p95 of 2.0 s or less on the phone.
  Human gaps of about 200 ms are out of reach once the user's own selection time
  is added, as Rayman et al. found, but a row within a second leaves most of
  Todman and Rzepecka's best 2 s condition for the user. A rough budget:
  end-of-turn detection about 0.5 s, the relay and Jev about 0.4 s at p50 and 1
  s at p95, and a frame to draw.
- Synthesis: the evaluation script can time only each ranker's own work and
  network trip on the 80 typed lines; run at least three passes, discard warm-up
  calls, and keep one request in flight. End-to-end time comes from the phone:
  the replay script plays recorded lines, the end of speech comes from each
  recording's hand-marked end or the last word's audio time, and each stage is
  logged on one boot-based clock. Whether React Native's clock and the Swift
  module's clock agree needs checking on a device.

## Conflicts between sources

- **Credit for a correct "none".** TREC-8 gave none for knowing that no answer
  was right ([voorhees-1999]), SQuAD 2.0 gives abstaining full credit on
  unanswerable questions ([squad2]), and WikiQA leaves questions with no answer
  out of its ranking metrics ([wikiqa]).
- **Where the threshold is set.** The SQuAD 2.0 paper tunes it on development
  data ([squad2]), while the official script also prints a best threshold found
  on the data it scores ([squad2-eval]).
- **Bins.** Guo et al. used 15 equal-width bins, Niculescu-Mizil and Caruana 10,
  and scikit-learn defaults to 5 ([guo-2017]; [niculescu-2005]; [sk-calcurve]);
  Nixon et al. and Roelofs et al. favor bins of equal mass ([nixon-2019];
  [roelofs-2022]).
- **Which way the ECE errs.** Kumar et al. find that binning understates the
  calibration error while the plug-in estimate overstates the binned error
  ([kumar-2019]); Roelofs et al. say the binned estimate "can either
  overestimate or underestimate" the true error ([roelofs-2022]).
- **The Brier range.** Brier's score runs from 0 to 2; scikit-learn's binary
  default halves it ([brier-1950]; [sk-brier]).
- **Henderson et al.'s numbers.** The paper's table gives TF-IDF 26.7 and BM25
  27.6 on Reddit and the trained encoder 84.2 on AmazonQA ([conv-datasets]); the
  benchmark page gives 26.4, 27.5, and 71.3, noting "we found a bug in the
  evaluation" ([conv-benchmarks]).
- **BM25's b.** It is 0.75 in the IR book, Lucene, and Elasticsearch and 0.7 in
  MiniSearch ([irbook-bm25]; [lucene-bm25]; [es-similarity]; [minisearch]).
  Robertson and Zaragoza call b = 0.5 and k1 = 2 "A common combination", then
  add that "many experiments suggest a somewhat lower value of k1 and a somewhat
  higher value of b" ([rz-2009]).
- **Workers AI figures.** Model pages give four digits, such as "$0.0666 per M
  input tokens" for bge-base, and the pricing page rounds it to "$0.067"
  ([cf-bge-base]; [cf-ai-pricing]). The bge-base page lists 512 maximum input
  tokens beside a "153,600 tokens" context window ([cf-bge-base]).
- **Apple's embedding size.** WWDC 2020 gave 512 dimensions; the current docs
  give no number ([wwdc20-10657]; [nl-embedding]).
- **AAC dialogue licenses.** The aactext.org pages for the Turk dialogues and
  COMM2 say CC BY 4.0, while the readmes inside their zips say
  "Attribution-NoDerivs 3.0 Unported License" ([aac-turk]; [aac-comm2]).
- **The Switchboard dialogue-act transcripts.** Each file says it "should not be
  redistributed", Potts's page is CC BY-NC-SA 3.0, his repository is GPL-2.0,
  and Switchboard itself is under LDC's terms ([swda-potts]; [swda-github];
  [ldc-swb]).
- **Stivers et al.'s means.** Levinson and Torreira give the languages' means as
  "between 7 and 468 ms" ([levinson-2015]); Stivers et al. give Danish "+469 ms"
  ([stivers-2009]).
- **Speed against relevance.** Todman and Rzepecka's ratings rose as pauses
  shortened in social talk, but they cite an earlier study of transactional talk
  that "failed to find clear evidence of a positive effect of pause time"
  ([todman-2003]), and Bedrosian et al.'s clerks preferred slow relevant
  messages to fast, partly relevant ones ([bedrosian-2003]).
- **SpeakFaster's headline.** The abstract claims "57% more motor actions"
  saved, while the results say savings "surpassed that of the traditional
  forward prediction by 30–40% (relative)" ([speakfaster]).

## Gaps

What the sources don't say that Turn's evaluation needs, as of September 22,
2026:

- **No study of Turn's setup.** None compares Jev, BM25, and embeddings on an
  AAC phrase bank, on short spoken partner lines, or on a bank of about 150
  one-sentence phrases; OpenSubtitles in Henderson et al. is the nearest.
- **Jev's calibration.** TypeSafe publishes no reliability plot for Nouls
  ([jp-calibration]), and no source read covers calibration when each line has
  several right answers among 40 clustered candidates.
- **What partners ask.** No source gives the mix of question types that partners
  put to AAC users.
- **Short pauses.** No AAC study read tested pauses under 2 s, or partners of
  adults with ALS or after a stroke.
- **Apple's timing.** Apple publishes no latency for `SpeechTranscriber`'s
  volatile or final results or for voice-activity detection.
- **Smart Reply's operating point.** The paper gives no triggering threshold and
  no precision or recall at it.
- **Workers AI.** No page gives output dimensions for bge-m3,
  qwen3-embedding-0.6b, or EmbeddingGemma, a price for EmbeddingGemma, or
  whether outputs are normalized.
- **Commercial use.** Whether a public evaluation file in a paid app's
  repository counts as commercial use under a NonCommercial license; Creative
  Commons declines to advise.
- **Full texts not read.** Only abstracts were available for Chow 1970,
  KWickChat, Todman 2000, Todman and Rzepecka's journal version, Trnka et al.
  2009, and Bedrosian et al., so their condition details are unread; the Stivers
  and Enfield coding scheme and ISO 24617-2 itself are paywalled. The ACL
  Anthology didn't respond from this machine, so ACL papers were read on arXiv,
  from authors' copies, or, for Koehn and for Berg-Kirkpatrick et al., from the
  Internet Archive's copies of the Anthology PDFs; Heldner and Edlund was read
  from a course copy of the publisher's PDF.

[idea-how]: /docs/IDEA.md#how-it-works
[ev-without]: /docs/research/next-gen-evidence.md#turn-without-jev
[tech-embed]: /docs/research/next-gen-tech.md#workers-ai-embeddings-and-vectorize
[voorhees-1999]: https://trec.nist.gov/pubs/trec8/papers/qa_report.pdf
[ubuntu-2015]: https://arxiv.org/abs/1506.08909
[geifman-2017]: https://arxiv.org/abs/1705.08500
[kamath-2020]: https://arxiv.org/abs/2006.09462
[squad2]: https://arxiv.org/abs/1806.03822
[squad2-eval]: https://github.com/rajpurkar/SQuAD-explorer/blob/master/evaluate-v2.0.py
[wikiqa]: https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/YangYihMeek_EMNLP-15_WikiQA.pdf
[idea-risks]: /docs/IDEA.md#risks
[guo-2017]: https://arxiv.org/abs/1706.04599
[niculescu-2005]: https://ams.confex.com/ams/pdfpapers/88928.pdf
[brier-1950]: https://journals.ametsoc.org/view/journals/mwre/78/1/1520-0493_1950_078_0001_vofeit_2_0_co_2.xml
[sk-brier]: https://scikit-learn.org/stable/modules/generated/sklearn.metrics.brier_score_loss.html
[sk-calcurve]: https://scikit-learn.org/stable/modules/generated/sklearn.calibration.calibration_curve.html
[nixon-2019]: https://arxiv.org/abs/1904.01685
[kumar-2019]: https://arxiv.org/abs/1909.10155
[roelofs-2022]: https://arxiv.org/abs/2012.08668
[jp-calibration]: /docs/research/jev-patterns.md#calibration-claims-and-evidence
[hf-bge]: https://huggingface.co/BAAI/bge-small-en-v1.5
[card-2020]: https://arxiv.org/abs/2010.06595
[idea-jev]: /docs/IDEA.md#how-jev-fits
[vk-2011]: https://aclanthology.org/D11-1065/
[gaines-2025]: https://aclanthology.org/2025.findings-emnlp.826/
[irbook-bm25]: https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html
[conv-datasets]: https://arxiv.org/abs/1904.06472
[conv-benchmarks]: https://github.com/PolyAI-LDN/conversational-datasets/blob/master/BENCHMARKS.md
[kristensson-2020]: https://doi.org/10.1145/3313831.3376525
[speakfaster]: https://pmc.ncbi.nlm.nih.gov/articles/PMC11530652/
[rz-2009]: http://www.staff.city.ac.uk/~sbrp622/papers/foundations_bm25_review.pdf
[lucene-bm25]: https://lucene.apache.org/core/10_5_1/core/org/apache/lucene/search/similarities/BM25Similarity.html
[es-similarity]: https://www.elastic.co/docs/reference/elasticsearch/index-settings/similarity
[minisearch]: https://github.com/lucaong/minisearch/blob/master/src/MiniSearch.ts
[use-qa]: https://arxiv.org/abs/1907.04307
[reqa]: https://arxiv.org/abs/1907.04780
[cf-ai-pricing]: https://developers.cloudflare.com/workers-ai/platform/pricing/
[cf-bge-base]: https://developers.cloudflare.com/workers-ai/models/bge-base-en-v1.5/
[nl-embedding]: https://developer.apple.com/documentation/naturallanguage/nlembedding
[wwdc20-10657]: https://developer.apple.com/videos/play/wwdc2020/10657/
[ldc-swb]: https://catalog.ldc.upenn.edu/LDC97S62
[swda-potts]: https://compprag.christopherpotts.net/swda.html
[swda-github]: https://github.com/cgpotts/swda
[aac-turk]: https://www.aactext.org/turk/
[aac-comm2]: https://www.aactext.org/comm2/
[stivers-2009]: https://pmc.ncbi.nlm.nih.gov/articles/PMC2705608/
[levinson-2015]: https://pmc.ncbi.nlm.nih.gov/articles/PMC4464110/
[todman-2003]: https://www.resna.org/sites/default/files/legacy/conference/proceedings/2003/Papers/AAC/Todman_AAC.htm
[bedrosian-2003]: https://pubmed.ncbi.nlm.nih.gov/12959461/

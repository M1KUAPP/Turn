# Calibrating Jev's top phrase for Turn's evaluation

How to check Jev's top-phrase score against whether that phrase is
acceptable, for issue #45: which calibration this is, which reliability
diagram suits 80 points, and the Brier score with its decompositions. It
builds on the [evaluation notes' calibration section][calibration section]
and the [statistics notes]; every source was read on September 23 or 24,
2026, and judgment starts with "Synthesis:".

[statistics notes]: /docs/research/0043-turn-eval-statistics.md

Contents:

1.  [Findings for issue #45](#findings-for-issue-45)
1.  [Which calibration the top phrase checks](#which-calibration-the-top-phrase-checks)
1.  [Reliability diagrams for 80 lines](#reliability-diagrams-for-80-lines)
1.  [PAV with ties and the consistency band](#pav-with-ties-and-the-consistency-band)
1.  [The Brier score and its decompositions](#the-brier-score-and-its-decompositions)
1.  [Presenting the diagram in the report](#presenting-the-diagram-in-the-report)
1.  [Whether note 0025's bins still hold](#whether-note-0025s-bins-still-hold)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## Findings for issue #45

- **What it checks.** Scoring each line's top phrase against its outcome is
  Guo et al.'s confidence calibration ([guo-2017]). Gupta and Ramdas's
  top-label calibration also conditions on which label was predicted
  ([gupta-2022]); Turn's phrases differ from line to line, so with 80 lines
  that extra condition can't be checked. Synthesis: call it "top-phrase
  calibration" and say it covers only the phrase the row would show.
- **Diagram.** Synthesis: draw a CORP reliability diagram ([corp]) rather
  than binned bars. The paper's own case of unstable bins has 92 forecasts,
  and CORP needs no bin count, handles tied scores by construction, and
  comes with a consistency band by resampling.
- **Band.** A 90% consistency band as `reliabilitydiag` computes it for
  small samples: resample the lines, redraw each outcome as if the score
  were calibrated, refit PAV, and take pointwise percentiles
  ([rd-region]). The package default is 100 resamples.
- **Score.** Report the Brier score `BS = mean((x - y)^2)`, the base rate's
  `UNC = ybar * (1 - ybar)`, the skill score `1 - BS / UNC`, and CORP's
  `BS = MCB - DSC + UNC`, with MCB in place of a binned ECE.
- **Interval.** Synthesis: a percentile interval for the Brier score from
  the seeded bootstrap over lines that the report already has, not a
  formula; no source read gives one for the Brier score.
- **Note 0025.** Synthesis: its five equal-mass bins of 16 give way to CORP;
  its Brier score stays, and its "ECE only with its bin scheme named"
  becomes CORP's MCB, which needs no scheme.

## Which calibration the top phrase checks

- **Guo et al.** For classifiers, "the probability associated with the
  predicted class label should reflect its ground truth correctness
  likelihood", and perfect calibration is `P(Yhat = Y | Phat = p) = p` for
  all `p` in `[0, 1]`, with `Phat` the confidence of the predicted class
  `Yhat` ([guo-2017]).
- **Confidence calibration.** Gupta and Ramdas write a classifier as a
  top-label predictor `c` and a score `h` for it, which is "confidence
  calibrated" when `P(Y = c(X) | h(X)) = h(X)`; for a vector of class
  scores, `c` is the arg max, and "ties are broken arbitrarily"
  ([gupta-2022]).
- **Top-label calibration.** "A multiclass classifier is said to be
  top-label calibrated if the reported probability for the predicted
  class—the top-label—is calibrated, conditioned on the top-label." The
  condition becomes `P(Y = c(X) | h(X), c(X)) = h(X)`. "We propose
  top-label calibration as a rectification of confidence calibration."
  ([gupta-2022])
- **Why they differ.** "However, top-label calibration also conditions on
  the predicted class, which is always part of the prediction in any
  practical setting." ([gupta-2022])

Synthesis:

- Turn's plan is confidence calibration in Guo's sense: the forecast is the
  top phrase's score, the outcome is whether that phrase is acceptable, and
  the check is whether lines scored near `p` are right about `p` of the
  time. Top-label calibration would need many lines per phrase, since each
  of the 40 shortlisted phrases would be its own class; with 80 lines it
  can't be estimated.
- The catch: the forecast is the largest of 40 scores, picked by those same
  scores, so the check says nothing about the other 39 phrases or about the
  3,200 line-and-phrase scores. When two phrases tie at the top, use the
  row's own tie order, so that the scored phrase is the one Turn would show.
- The 16 lines with no acceptable reply stay in: their outcome is 0 whatever
  the score, which is exactly the case the 0.6 floor exists for.

## Reliability diagrams for 80 lines

- **Bins are unstable.** "The classical binning and counting approach to
  plotting reliability diagrams has been hampered by a lack of stability
  under unavoidable, ad hoc implementation decisions." For EMOS forecasts,
  "choices of m = 9, 10, or 11 equidistant bins yield drastically distinct
  reliability diagrams" ([corp]).
- **At about Turn's size.** The EMOS figure's caption gives no size, but
  the Niamey data are small. In the arXiv copy, Fig. 1's caption, on the
  same months' ENS, EPC, and Logistic forecasts, says "The histograms at
  bottom illustrate the distribution of the n = 86 forecast values."
  ([corp]) The PNAS version's Fig. 1 caption says "the n = 92 forecast
  values" ([corp-pnas]), and the package's copy of the data, with EMOS as
  one column, is "A data frame with 92 rows and 6 variables" ([rd-data]).
  "Under the binning and counting approach, small or sparsely populated bins
  are subject to overfitting and large estimation uncertainty" ([corp]).
- **CORP.** It uses "nonparametric isotonic regression and the
  pool-adjacent-violators (PAV) algorithm to estimate conditional event
  probabilities (CEPs), which yields a fully automated choice of bins that
  adapts to both discrete and continuous settings, without any need for
  tuning parameters or implementation decisions." A simulation "demonstrates
  that the efficiency of the CORP approach also holds in small samples", and
  CORP had "the smallest MSE, uniformly over all sample sizes and against
  all alternative methods" ([corp]). The PNAS version keeps that sentence,
  cites data-driven simulations in its supplement, and qualifies it: "Only
  for simulation settings with nearly horizontal true CEPs, the efficiency
  of the CORP approach is slightly inferior to binning and counting with
  very small numbers of bins—exactly the choices that perform particularly
  poorly in almost any other setting." ([corp-pnas])
- **Consistency bars.** Bröcker and Smith introduce "A resampling method
  for assigning consistency bars to the observed frequencies" that shows
  "just how likely the observed relative frequencies are under the
  assumption that the predicted probabilities are reliable", and a second
  presentation, the reliability diagram on probability paper: "Further, an
  alternative presentation of the same information on probability paper
  eases quantitative evaluation and comparison." "Both presentations can
  easily be employed for any method of binning." Each bar spans a bin's
  frequencies over `N_boot` consistency resamples of the whole dataset:
  "The bars extend from the 5% to the 95% quantiles, indicated by dashes."
  ([brocker-2007]) CORP's authors: "They employ a resampling technique for
  the binning and counting method in order to find consistency bands under
  the assumption of calibration." ([corp])
- **Equal width against equal mass.** The evaluation notes already cover
  it: equal-mass bins have lower bias, and too many bins hurt small samples
  ([calibration section]).

Synthesis:

- **Ties at a bin edge.** No source read gives a rule. If binned bars are
  kept, cut only between distinct scores and let a tied group stay whole,
  so bins hold about 16 lines; never split tied lines by file order.
- **Recommendation.** Use CORP. It removes the bin count and the edge rule,
  ties are pooled by construction, its steps show where the data can't
  separate scores, and Bröcker and Smith's idea survives as CORP's
  consistency band. Binned bars with consistency bars would still leave the
  bin choice that CORP's Niamey figure shows to matter at n = 92.

[brocker-2007]: https://journals.ametsoc.org/view/journals/wefo/22/3/waf993_1.xml

## PAV with ties and the consistency band

- **One value per score.** "The PAV algorithm assigns calibrated
  probabilities to the individual unique forecast values, and we interpolate
  linearly inbetween, to facilitate comparison with the diagonal that
  corresponds to perfect calibration." "If a group of (one or more) forecast
  values are assigned identical PAV-calibrated probabilities, the CORP
  reliability diagram displays a horizontal segment." ([corp])
- **Ties in the package.** `reliabilitydiag` sorts with
  `ord <- order(x, -y)`, so tied scores put their hits first, then fits
  `monotone::monotone(y)`, or `stats::isoreg(y)$yf` without that package,
  and forms bins with `rle(CEP_pav)` ([rd-coercion]). In `monotone` 0.1.2,
  `src/monotoneC.c` pools backward only on a strict `>` (`xbm1 > xb`,
  `rx[b - 1] > xb`), and after a merge it also takes in later values while
  the pooled mean is `>=` them (`xb >= rx[i + 1]`) ([monotone]).
- **Band method.** "Consistency bands are generated under the assumption
  that the probability forecasts are calibrated, and so they are positioned
  around the diagonal." "For consistency bands, the resampling is based on
  the assumption of calibrated original forecast values, whereas
  PAV-calibrated probabilities are used to generate confidence bands."
  ([corp])
- **Band code.** The defaults are `region.level = 0.9`,
  `region.position = "diagonal"`, and `n.boot = 100` ([rd-main]).
  "the original forecast-observations pairs are bootstrapped `n.boot`
  times"; "For each bootstrap sample, new observations are drawn under the
  respective assumption (consistency or confidence)." ([rd-main]) The code
  draws `y <- stats::rbinom(n.pav, 1L, x0[s])`, refits after
  `order(x,-y)`, interpolates with `approx` at the original distinct scores,
  and takes `stats::quantile` at `0.5 + c(-0.5, 0.5) * region.level` with
  `na.rm = TRUE` ([rd-region]).
- **Resampling at n = 80.** The package picks resampling when
  `n <= max(1000L, min(5000L, 50L * n_unique))` ([rd-utils]). "While
  resampling works well in small to medium samples, the use of asymptotic
  theory suits cases where the sample size n of the dataset is large"
  ([corp]).

Synthesis: pseudocode for a TypeScript port. Grouping tied scores first and
running PAV on weighted groups gives each score one value, as the package's
`order(x, -y)` does.

```text
pav(x[1..n], y[1..n]):
  groups = one per distinct score v, ascending, with
           w = number of lines at v, s = acceptable lines at v
  stack = []
  for g in groups:
    push {lo: g.v, hi: g.v, w: g.w, s: g.s}
    while stack has 2+ blocks and below.s/below.w >= top.s/top.w:
      pop top and below; push {lo: below.lo, hi: top.hi,
                               w: below.w + top.w, s: below.s + top.s}
  return stack   # each block: scores lo..hi, recalibrated value s/w

fit(blocks, v) = s/w of the block whose lo <= v <= hi

band(x, level = 0.9, B):
  V = distinct scores of x
  for b in 1..B:                    # seeded xoshiro128**
    idx = n indices drawn with replacement
    xs = x[idx]; ys[j] = 1 if uniform() < xs[j] else 0
    blocks = pav(xs, ys)
    for v in V:
      if v is outside [min(xs), max(xs)]: r[b][v] = missing
      else: r[b][v] = linear interpolation of fit(blocks, u) over the
                      distinct u in xs, evaluated at v
  for v in V: lower[v], upper[v] = percentiles (1 - level)/2 and
              (1 + level)/2 of the non-missing r[.][v]
```

[rd-coercion]: https://github.com/aijordan/reliabilitydiag/blob/master/R/coercion.R
[monotone]: https://CRAN.R-project.org/package=monotone
[rd-main]: https://github.com/aijordan/reliabilitydiag/blob/master/R/reliabilitydiag.R
[rd-utils]: https://github.com/aijordan/reliabilitydiag/blob/master/R/utils.R

## The Brier score and its decompositions

- **Definition.** CORP's table lists the Brier score as strictly proper
  with `S(x, y) = (x - y)^2` for a forecast `x` in `[0, 1]` and an outcome
  `y` in `{0, 1}`, and ranks forecasts by the mean score over the sample
  ([corp]). That is the 0-to-1 version the evaluation notes describe
  ([calibration section]).
- **CORP's decomposition.** With `S_X` the mean score of the forecasts,
  `S_C` that of the calibrated values, and `S_R` that of a constant
  reference `r`, "Then `S_X` decomposes as" `MCB - DSC + UNC`, with
  `MCB = S_X - S_C`, `DSC = S_R - S_C`, and `UNC = S_R`. The calibrated
  values "ought to be the PAV-(re)calibrated probabilities, as displayed in
  the CORP reliability diagram, whereas the reference forecast r ought to
  be the marginal event frequency" ([corp]).
- **Its properties.** "MCB ≥ 0 with equality if the original forecast is
  calibrated." "DSC ≥ 0 with equality if the PAV-calibrated forecast is
  constant." "The decomposition is exact." ([corp])
- **Murphy's.** "Murphy's decomposition is exact in the discrete case, but
  fails to be exact under continuous forecasts" ([corp]).
- **In code.** `reliabilitydiag` computes
  `uncertainty = with(l$cases, mean(score(y, mean(y))))`,
  `discrimination = .data$uncertainty - .data$Sc`, and
  `miscalibration = .data$mean_score - .data$Sc` ([rd-summary]).

The formulas, for lines `i = 1..n` with score `x_i`, outcome `y_i`, base
rate `ybar = mean(y)`, and PAV value `xhat_i`:

```text
BS   = (1/n) * sum_i (x_i - y_i)^2
UNC  = (1/n) * sum_i (ybar - y_i)^2  = ybar * (1 - ybar)
BSS  = 1 - BS / UNC                  = (DSC - MCB) / UNC
S_C  = (1/n) * sum_i (xhat_i - y_i)^2
MCB  = BS - S_C        DSC = UNC - S_C        BS = MCB - DSC + UNC

Murphy, over the K distinct scores f_k, with n_k lines and hit rate o_k:
BS   = (1/n) * sum_k n_k (f_k - o_k)^2      reliability
     - (1/n) * sum_k n_k (o_k - ybar)^2     resolution
     + ybar * (1 - ybar)                    uncertainty
```

Synthesis:

- `UNC = ybar * (1 - ybar)` and the second form of the skill score follow
  from CORP's equation by algebra. Murphy's formula is its usual form,
  not checked against the 1973 paper. When the hit rates of the distinct
  scores already rise with the score, PAV pools nothing and the two
  decompositions agree; when it pools, they differ, and CORP's is the one
  the diagram draws.
- With 16 lines always wrong, `ybar` is at most 0.8. `UNC` is at most 0.25,
  when half the lines are acceptable, and falls below 0.16 only if `ybar`
  drops under 0.2. A constant forecast of `ybar` sets the bar the skill
  score is measured against.
- **Interval.** Give one for the Brier score and the skill score: draw the
  80 lines with replacement, recompute both, and report the percentile
  interval, using the seeded generator and resample count of the
  [statistics notes' bootstrap][statistics bootstrap]. The Brier score is a
  mean over lines, so resampling lines keeps each line's one outcome
  whole. MCB and DSC can be shown without intervals; their band is the
  diagram's.

[rd-summary]: https://github.com/aijordan/reliabilitydiag/blob/master/R/summary.R
[statistics bootstrap]: /docs/research/0043-turn-eval-statistics.md#the-paired-bootstrap-for-the-gap

## Presenting the diagram in the report

- **What CORP draws.** In the discrete case it shows the PAV values "as
  dots, interpolate linearly inbetween, and visualize the marginal
  distribution of the forecast values in a bar diagram"; for continuous
  forecasts it "displays the bin-wise constant PAV-calibrated probabilities
  in horizontal segments, which are linearly interpolated inbetween", with
  a Freedman–Diaconis histogram of the scores ([corp]).
- **Which case.** "If the smallest distance between any two distinct
  forecast values is 0.01 or larger, we operate in the discrete setting,
  and else in the continuous one." ([corp])
- **The diagonal and MCB.** Of binned diagrams, CORP's authors write that
  for calibrated forecasts "the points plotted ought to lie on, or close
  to, the diagonal". The paper's CORP diagrams in Figs. 1–3 print MCB;
  those in Figs. 1 and 2 and in Fig. 3(a, c) show 90% consistency bands,
  while Fig. 3(b, d) shows 90% confidence bands ([corp]).
- **Counts.** Guo et al. write of reliability diagrams in general: "Note
  that reliability diagrams do not display the proportion of samples in a
  given bin, and thus cannot be used to estimate how many samples are
  calibrated." Their Figure 1 pairs reliability diagrams with confidence
  histograms ([guo-2017]). The package's bin table keeps `n`, `x_min`,
  `x_max`, and `CEP_pav` for each PAV block ([rd-coercion-bins]).

Synthesis:

- Draw one SVG beside the risk-coverage plot, in the way the
  [statistics notes' plots section][statistics plots] settled: the
  diagonal, the CORP step line with a dot at each distinct score, the 90%
  consistency band shaded behind it, vertical rules at 0.6 and 0.85, and a
  strip of tick marks or a small histogram of the 80 scores below.
- As its text, give a table with one row per PAV block: score range,
  lines, acceptable lines, recalibrated value, and the band's range at the
  block's scores. Under it, one line each for BS with its interval, UNC,
  the skill score, MCB, and DSC. Put the 16 no-reply lines' count in the
  table's caption, since they explain much of any gap below the diagonal.

[rd-coercion-bins]: https://github.com/aijordan/reliabilitydiag/blob/master/R/coercion.R#L241-L247
[statistics plots]: /docs/research/0043-turn-eval-statistics.md#plots-in-a-markdown-report-on-github

## Whether note 0025's bins still hold

- **What 0025 settled.** One diagram for each line's top phrase, counts
  printed, the Brier score, ECE only with its bin scheme named, and
  intervals that resample lines ([calibration section]). All of that still
  holds except the bins.
- **What changes.** Synthesis: five equal-mass bins of 16 need an edge rule
  for tied scores, and their Wilson intervals treat each bin as fixed in
  advance. CORP's paper shows bin counts of 9, 10, and 11 giving
  "drastically distinct" diagrams at n = 92 ([corp]; [rd-data]), about
  Turn's size. CORP is better for 80 lines: no bin count, ties pooled by
  construction, a band made for small samples, and MCB, which replaces ECE
  without a scheme to name.
- **What stays.** The Wilson intervals remain right for single rates such
  as the floor's hit rate; they aren't needed on the diagram.

## Gaps

- The PNAS version of CORP, titled "Stable reliability diagrams for
  probabilistic classifiers", was read in PubMed Central's copy
  ([corp-pnas]), as pnas.org answered with a bot check. Quotes here come
  from the arXiv copy dated August 10, 2020, titled "Evaluating
  probabilistic classifiers: Reliability diagrams and score decompositions
  revisited". PNAS matches them apart from copyedits such as "in between"
  and three changes: n = 92 in Fig. 1's caption, "PAV-transformed
  probabilities" for the PAV values, and "PAV-(re)calibrated forecast" in
  DSC's property.
- CORP's simulations: the authors' replication code sets
  `n.set <- 2^seq(6,13)` for both the coverage and the MSE studies, so the
  sizes run from 64 to 8,192 in doublings, with none at 80 ([replication]).
  Read by eye, the coverage figure's consistency-band points at 64 and 128
  sit above the 0.90 line in all three panels.
- Bröcker and Smith (2007): the article, read on the journal's page, names
  the resample count `N_boot` but gives it no value in the text.
- Murphy (1973): not read; the formula above is its usual form.
- No source read gives an interval for the Brier score or its skill score;
  the bootstrap over lines is this note's own choice.
- No source read gives a rule for tied scores at an equal-mass bin's edge.
- `monotone` 0.1.2 was read, not run; the tie reasoning follows from its
  code, not from a test in R.

[replication]: https://github.com/TimoDimi/replication_DGJ20/tree/master/replication_paper

## See also

- [Turn's evaluation notes](/docs/research/0025-turn-evaluation.md)
- [Turn's evaluation statistics notes](/docs/research/0043-turn-eval-statistics.md)

[calibration section]: /docs/research/0025-turn-evaluation.md#calibration-and-the-two-confidence-bars
[guo-2017]: https://arxiv.org/abs/1706.04599
[gupta-2022]: https://arxiv.org/abs/2107.08353v4
[corp]: https://arxiv.org/abs/2008.03033
[corp-pnas]: https://pmc.ncbi.nlm.nih.gov/articles/PMC7923594/
[rd-region]: https://github.com/aijordan/reliabilitydiag/blob/master/R/region_method.R
[rd-data]: https://github.com/aijordan/reliabilitydiag/blob/master/R/data.R

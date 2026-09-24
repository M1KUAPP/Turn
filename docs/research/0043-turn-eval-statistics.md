# Cut-offs, paired intervals, and risk-coverage curves for Turn's evaluation

The statistics behind issue #36's report: the `embeddings` ranker's
cross-validated hold cut-off, the paired bootstrap between Jev and
`embeddings`, risk-coverage curves, plots on GitHub, and the question-kind
confusion matrix. It adds to the [evaluation notes] and [harness notes];
every source was read on September 23, 2026, and judgment starts with
"Synthesis:".

[evaluation notes]: /docs/research/0025-turn-evaluation.md
[harness notes]: /docs/research/0035-turn-eval-harness.md

Contents:

1.  [Findings for the plan](#findings-for-the-plan)
1.  [Cross-validating the hold cut-off](#cross-validating-the-hold-cut-off)
1.  [The paired bootstrap for the gap](#the-paired-bootstrap-for-the-gap)
1.  [Risk-coverage curves and their area](#risk-coverage-curves-and-their-area)
1.  [Plots in a Markdown report on GitHub](#plots-in-a-markdown-report-on-github)
1.  [The confusion matrix's orientation](#the-confusion-matrixs-orientation)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## Findings for the plan

- **Shuffle, then stratify.** Split the lines into five folds stratified on
  "has an acceptable reply" versus "none", after one seeded shuffle: without
  shuffling, scikit-learn keeps each class's lines "contiguous in y"
  ([skf]), so the file's order would choose the folds.
- **Out of fold.** Pick each fold's cut-off on the other four folds and
  score the held-out fold with it, so "Each sample belongs to exactly one
  test set" ([cvp]); pool the 80 outcomes as counts.
- **Objective.** Synthesis: maximize balanced accuracy over reply and none
  lines, scikit-learn's default ([tuned]), trying every distinct top score
  as a cut-off and breaking ties toward the higher cut-off.
- **Bootstrap.** Draw one set of line indices per resample and score both
  rankers on it ([scipy-bootstrap]'s `paired`), 9,999 times, SciPy's
  default. Synthesis: report the percentile interval. When no line splits
  the two rankers, every resample gives 0: report 0 to 0 and "no clear
  difference" without computing BCa, which SciPy says "may be NaN" then.
- **Generator.** Port `xoshiro128**` 1.1 ([xoshiro-c]) with `Math.imul`, a
  committed seed that isn't all zero, and indices by rejection, not a bare
  modulo, following Lemire's "without introducing statistical biases"
  ([lemire-2019]).
- **Curves.** AURC is "the area under the (empirical) RC-curve", a sum of
  risks over the test set's confidence values divided by n
  ([geifman-2019]). Synthesis: one point per distinct confidence value, tied
  lines entering together, each point's risk weighted by its lines.
- **Plots.** Write an SVG file and link it from `eval/results.md` with a
  relative image link; GitHub "can display" SVG ([gh-files]). Mermaid's
  `xychart` takes no x-y pairs ([mermaid-xy]), so it can't draw four
  rankers' curves without resampling them onto one grid.
- **Confusion matrix.** Rows are the writer's kind, columns the predicted
  kind, as scikit-learn's "known to be in group i and predicted to be in
  group j" ([sk-cm]), with all four kinds in a fixed order.

## Cross-validating the hold cut-off

- **Folds.** scikit-learn's `StratifiedKFold` makes folds "by preserving the
  percentage of samples for each class"; `shuffle` is "Whether to shuffle
  each class's samples before splitting into batches". With `shuffle=False`
  it will "Preserve order dependencies in the dataset ordering ... all
  samples from class k in some test set were contiguous in y", and fold
  sizes differ "by at most one sample" ([skf]). The source counts each
  fold's share "using round robin over the sorted y" ([skf-src]).
- **Few "none" lines.** The source raises "n_splits=%d cannot be greater
  than the number of members in each class." only when every class has
  fewer members than folds; when only the smallest does, it warns "The least
  populated class in y has only %d members, which is less than n_splits=%d."
  ([skf-src])
- **The tuner.** `TunedThresholdClassifierCV` defaults to
  `scoring="balanced_accuracy"`, to `thresholds=100`, "The number of
  decision threshold to use when discretizing the output of the classifier",
  and to "the default 5-fold stratified K-fold cross validation" ([tuned]).
  The source builds its candidates with `np.linspace` from the lowest score
  to the highest, averages each fold's interpolated scores, and takes
  `objective_scores.argmax()` ([tuned-src]); its docs say nothing of ties,
  and for NumPy's `argmax`, "In case of multiple occurrences of the maximum
  values, the indices corresponding to the first occurrence are returned."
  ([np-argmax]) The guide adds: "one should choose a meaningful metric for
  their use case" ([sk-threshold]).
- **Out of fold.** `cross_val_predict`: "Each sample belongs to exactly one
  test set, and its prediction is computed with an estimator fitted on the
  corresponding training set." It warns that scoring these predictions "may
  not be a valid way to measure generalization performance ... unless all
  tests sets have equal size and the metric decomposes over samples." ([cvp])

Synthesis for Turn's 80 lines:

- Five folds of 16 have equal sizes, and the six outcomes are counts, which
  decompose over lines; pool counts, then compute coverage and risk once.
- A cut-off both decides which lines hold and hides a covered line's
  phrases below it, so the candidates are the six highest cosines of each
  training line, the most a row can show, plus "never hold": a cut-off
  between two adjacent candidates behaves the same, so 100 evenly spaced
  values add nothing. Hold when the top score is below the cut-off.
- With fewer than five "none" lines, some fold has none, which scikit-learn
  only warns about. Report each fold's cut-off and count of lines beside the
  pooled result.
- The objective, over the four outcomes a hold decision changes:

  ```text
  reply side = right rows on reply lines / reply lines
  none side  = right holds / none lines
  objective  = (reply side + none side) / 2      ties: the higher cut-off
  ```

A wrong row and a missed reply cost the same here; if the team weighs a
wrong row more, commit the weights before the run.

[skf-src]: https://github.com/scikit-learn/scikit-learn/blob/main/sklearn/model_selection/_split.py
[tuned-src]: https://github.com/scikit-learn/scikit-learn/blob/main/sklearn/model_selection/_classification_threshold.py
[np-argmax]: https://numpy.org/doc/stable/reference/generated/numpy.argmax.html
[sk-threshold]: https://scikit-learn.org/stable/modules/classification_threshold.html

## The paired bootstrap for the gap

The [evaluation notes' paired bootstrap] covers the method's origin; this
adds what the code needs.

- **SciPy's defaults.** `paired`: "Whether the statistic treats
  corresponding elements of the samples in data as paired."; `n_resamples`
  "default: `9999`"; `method` "{'percentile', 'basic', 'bca'}, default:
  `'BCa'`", citing Efron and Tibshirani's 1993 book ([scipy-bootstrap]).
- **BCa's degenerate case.** "Elements of the confidence interval may be NaN
  for `method='BCa'` if the bootstrap distribution is degenerate (e.g. all
  elements are identical)." ([scipy-bootstrap])

Synthesis:

- Each line gives `d = jev - embeddings`, one of -1, 0, or 1, and the gap is
  their mean. Only lines where the two disagree move a resample; with none,
  every resample is 0, the interval is 0 to 0, and the verdict is "no clear
  difference". Check for that case before any interval code runs.
- Prefer the percentile interval: it needs no inverse normal function and
  no jackknife, and has no degenerate case. Reuse the harness's type-7
  [percentiles for latency]. "Trails" needs an upper bound strictly below 0.

[evaluation notes' paired bootstrap]: /docs/research/0025-turn-evaluation.md#paired-bootstrap
[percentiles for latency]: /docs/research/0035-turn-eval-harness.md#percentiles-for-latency

### Seeded random numbers in JavaScript

- **`xoshiro128**`.** Blackman and Vigna: "This is xoshiro128** 1.1, one of our
  32-bit all-purpose, rock-solid generators", with 128 bits of state; "The
  state must be seeded so that it is not everywhere zero." ([xoshiro-c]) The
  site: "All 32-bit generators pass all tests we are aware of, with the
  exception of linearity tests (binary rank and linear complexity) for
  `xoshiro128+` and `xoroshiro64*`", and "We suggest to use SplitMix64 to
  initialize the state" ([xoshiro]).
- **sfc32.** PractRand's notes give it 16 bytes of state, a minimum cycle of
  "2**32", and: "The sfc* RNGs are the fastest of the recommended RNGs and
  one of the smallest. The 32 and 64 bit variants have no known drawbacks,
  though the 16 bit variant is considered inadequate for parallel uses."
  ([practrand])
- **Unbiased indices.** Lemire: "We need functions to convert such random
  words to random integers in an interval ([0,s)) without introducing
  statistical biases." ([lemire-2019])

Synthesis: a port of the reference `next()`, with rejection above the
largest multiple of `n`; test it against outputs of the C file.

```ts
export function xoshiro128ss(a: number, b: number, c: number, d: number) {
  return (): number => {
    const t = b << 9
    const m = Math.imul(b, 5)
    const r = Math.imul((m << 7) | (m >>> 25), 9)
    c ^= a
    d ^= b
    b ^= c
    a ^= d
    c ^= t
    d = (d << 11) | (d >>> 21)
    return r >>> 0
  }
}

export function index(next: () => number, n: number): number {
  const limit = 2 ** 32 - (2 ** 32 % n)
  let x = next()
  while (x >= limit) x = next()
  return x % n
}
```

[xoshiro]: https://prng.di.unimi.it/
[practrand]: https://pracrand.sourceforge.net/RNG_engines.txt

## Risk-coverage curves and their area

The [evaluation notes' selective prediction] section already quotes
Geifman and El-Yaniv's coverage, risk, and curve ([geifman-2017]).

- **The area.** Geifman, Uziel, and El-Yaniv (ICLR 2019): "The performance
  of κ is defined to be the area under the (empirical) RC-curve (AURC) of
  the pair (f,g) computed over Vn", where "Θ be the set of all κ values of
  points in Vn" ([geifman-2019]):

  ```text
  AURC(κ, f | Vn)   = (1/n) · Σ over θ in Θ of r̂(f, g_θ | Vn)
  E-AURC(κ, f | Vn) = AURC(κ, f | Vn) − AURC(κ*, f | Vn)
  ```

- **Excess area.** "E-AURC is a unitless measure in [0,1], and the optimal κ
  will have E-AURC =0" ([geifman-2019]).
- **Ties.** "for now we assume that Θ contains n unique points, and later we
  note how to deal with duplicate values" ([geifman-2019]).
- **Several curves.** Their Figure 1: "Blue: the RC curve based on softmax
  response; black: the optimal curve that can be achieved in hindsight."

Synthesis for Turn:

- A ranker's confidence κ is the score it holds on: the top cosine for
  `embeddings`, Jev's confidence, the shared-word score for `keyword`. Sort
  lines by κ, highest first; at each distinct κ, admit every line with it
  at once and emit one point, so tied lines never split.
- Weight each point's risk by the lines it admits, then divide by n; with no
  ties this is the paper's formula. Coverage 0 has no risk, so the curve
  starts at the first point.
- Draw the four rankers on one pair of axes, with each ranker's operating
  point marked and, as in Figure 1, the in-hindsight curve for reference. A
  ranker without a score, such as `place`, is a single point. The
  out-of-fold `embeddings` point uses five cut-offs, so it can sit off the
  curve.

[evaluation notes' selective prediction]: /docs/research/0025-turn-evaluation.md#abstention-and-selective-prediction
[geifman-2017]: https://arxiv.org/abs/1705.08500

## Plots in a Markdown report on GitHub

- **SVG files.** "GitHub can display several common image formats, including
  PNG, JPG, GIF, PSD, and SVG." "SVGs don't currently support inline
  scripting or animation." "If you are using the Firefox browser, SVGs on
  GitHub may not render." ([gh-files])
- **Linking.** "When you want to display an image that is in your
  repository, use relative links instead of absolute links." ([gh-images])
- **Mermaid on GitHub.** "add Mermaid syntax inside a fenced code block with
  the `mermaid` language identifier", and "To ensure GitHub supports your
  Mermaid syntax, check the Mermaid version currently in use" with an `info`
  diagram ([gh-mermaid]).
- **Mermaid's XY chart.** "Presently, it includes two fundamental chart
  types: the bar chart and the line chart." "The x-axis primarily serves as a
  categorical value, although it can also function as a numeric range value
  when needed." Series take only y-values, `line "series name" [2.3, 45]`,
  and "Named line and bar plots are automatically shown in a legend", from
  v11.17.0 ([mermaid-xy]). The parser accepts both keywords:
  `/^\s*xychart(-beta)?/` ([mermaid-detector]).

Synthesis: every series in one chart shares the x-axis's positions, so
risk-coverage curves, whose coverages differ by ranker, fit Mermaid only
after resampling onto a shared grid, and older Mermaid may draw no legend.
Write `eval/risk-coverage.svg` from the script with no scripts inside, link
it relatively, and list the points in a table beneath for Firefox. If
Mermaid is kept, use `xychart-beta`, which old and new versions accept.

[gh-images]: https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#images
[gh-mermaid]: https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams
[mermaid-detector]: https://github.com/mermaid-js/mermaid/blob/develop/packages/mermaid/src/diagrams/xychart/xychartDetector.ts

## The confusion matrix's orientation

- **Rows are true.** scikit-learn: "By definition, a confusion matrix C is
  such that C_{i,j} is equal to the number of observations known to be in
  group i and predicted to be in group j." ([sk-cm])
- **Order.** `labels`: "If `None` is given, those that appear at least once
  in `y_true` or `y_pred` are used in sorted order." `normalize` "Normalizes
  confusion matrix over the true (rows), predicted (columns) conditions or
  all the population." ([sk-cm])

Synthesis: print a 4-by-4 table with the writer's kind down the side and
the ranker's across the top, headed "true" and "predicted", keeping a kind's
row even when no line has it.

## Gaps

- Efron and Tibshirani's own advice on how many resamples a percentile or
  BCa interval needs: the 1986 paper was paywalled and the book unread.
- How to "deal with duplicate values": Geifman et al. 2019 promise to note
  it later but never come back to it, so the tie rule above is this note's
  own.
- mulberry32 has no primary source found; it isn't recommended here.
- GitHub's Mermaid version, so whether `xychart` and its legend draw there;
  check with an `info` diagram.
- Lemire's method itself: only the abstract was read.

## See also

- [Turn's evaluation notes](/docs/research/0025-turn-evaluation.md)
- [Turn's evaluation harness notes](/docs/research/0035-turn-eval-harness.md)
- [The TRD's metrics](/docs/TRD.md#metrics-intervals-and-thresholds)

[skf]: https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.StratifiedKFold.html
[cvp]: https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_val_predict.html
[tuned]: https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TunedThresholdClassifierCV.html
[scipy-bootstrap]: https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html
[xoshiro-c]: https://prng.di.unimi.it/xoshiro128starstar.c
[lemire-2019]: https://arxiv.org/abs/1805.10941
[geifman-2019]: https://arxiv.org/abs/1805.08206
[gh-files]: https://docs.github.com/en/repositories/working-with-files/using-files/working-with-non-code-files
[mermaid-xy]: https://mermaid.js.org/syntax/xyChart.html
[sk-cm]: https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html

# Turn's evaluation harness research notes

The formulas, conventions, and test values behind `@turn/eval`'s harness for
the `place` and `keyword` rankers, read for issue #29: Wilson intervals,
latency percentiles, timing under Bun and Node, chance rates, and the
labelers' agreement on set-valued labels. Every source was read on September
23, 2026, and judgment starts with "Synthesis:".

Contents:

1.  [Findings for the plan](#findings-for-the-plan)
1.  [The Wilson interval](#the-wilson-interval)
1.  [Percentiles for latency](#percentiles-for-latency)
1.  [Timing JavaScript](#timing-javascript)
1.  [Chance rates](#chance-rates)
1.  [Agreement between two labelers](#agreement-between-two-labelers)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## Findings for the plan

Synthesis: every item below is this note's own reading of the sections it
links to.

- **Wilson.** Use NIST's formula with z = 1.959963984540054. Against 1.96 it
  moves 56 of 80 by about 0.0002 points, and both give 59% to 79%. Clamp to
  [0, 1], since floating point can land just outside: 0 of n has a lower
  bound of 0 and n of n an upper bound of 1, each within rounding, and n = 0
  has no interval (see [the Wilson interval](#the-wilson-interval)).
- **The TRD's 7.2% isn't a Wilson number.** It's the one-sided binomial-tail
  bound 1 − 0.05^(1/40); a two-sided Wilson interval for 0 wrong of 40 tops out
  at 8.76% (see [the Wilson interval](#the-wilson-interval)).
- **Percentiles.** Use Hyndman and Fan's type 7, NumPy's default `linear`:
  h = (n − 1)p on the sorted timings, interpolating between neighbors. The
  median is the usual one, p = 1 is the maximum, and a test can check against
  `np.percentile` (see [percentiles for latency](#percentiles-for-latency)).
- **Timing.** `performance.now()` is monotonic and stepped by 41 ns under both
  Bun 1.4.2 and Node 26.9 on this Mac, far below a ranker's work. Drop the
  first pass as warm-up, since JavaScriptCore compiles hot code in tiers
  (see [timing JavaScript](#timing-javascript)).
- **Chance.** The two formulas match exact enumeration. With N = 40, one
  acceptable phrase gives 2.5% at 1, 15% at 6, and a mean reciprocal rank of
  0.106964; two give 5%, 28.08%, and 0.168130. A run's chance rate is the mean
  of each line's own chance (see [chance rates](#chance-rates)).
- **Agreement.** Print three views: the none-versus-some 2×2 with percent
  agreement, Cohen's kappa, ppos, and pneg; ppos over line-and-phrase pairs,
  which unlike kappa doesn't move with the candidate count; and Krippendorff's
  alpha with MASI distance, where none against none is 0
  (see [agreement between two labelers](#agreement-between-two-labelers)).
- **Oracle.** The six-unit example in
  [A test oracle for agreement](#a-test-oracle-for-agreement) gives
  alpha = 93/269 ≈ 0.345725, matched by NLTK 3.10.3 to the last digit.

## The Wilson interval

- **Formula.** NIST's handbook, section 7.2.4.1, gives the upper limit below;
  the lower limit takes the minus sign. There, z_{α/2} "denotes the variate
  value from the standard normal distribution such that the area to the left
  of the value is α/2", so a two-sided 95% interval uses z_{0.975}
  ([nist-wilson]). The earlier note already quotes NIST's case for Wilson and
  lists library defaults ([evaluation notes][eval-intervals]).

  ```text
  U.L. = ( p̂ + z²/(2n) + z·√( p̂(1 − p̂)/n + z²/(4n²) ) ) / ( 1 + z²/n )
  L.L. = ( p̂ + z²/(2n) − z·√( p̂(1 − p̂)/n + z²/(4n²) ) ) / ( 1 + z²/n )
  p̂ = x / n,   z = z_{1−α/2} = z_{0.975} for 95%
  ```

- Synthesis: z_{0.975} ≈ 1.959963984540054; Python's
  `statistics.NormalDist().inv_cdf(0.975)` returns 1.9599639845400534. This
  note's script gives, for 56 of 80:

  | z                 | Lower    | Upper    | Whole percents |
  | ----------------- | -------- | -------- | -------------- |
  | 1.96              | 0.592316 | 0.789356 | 59% to 79%     |
  | 1.959963984540054 | 0.592318 | 0.789354 | 59% to 79%     |

- Synthesis: the edge cases, with z = 1.959963984540054:
  - **0 of n.** p̂ = 0, so the lower limit is 0 and the upper is
    z²/(n + z²): 4.58% for 0 of 80, 8.76% for 0 of 40. In floating point the
    lower limit came out −1.2 × 10⁻¹⁷ for 0 of 21.
  - **n of n.** The upper limit is 1 and the lower is n/(n + z²): 95.42% for
    80 of 80, 91.24% for 40 of 40. In floating point the upper limit came out
    0.9999999999999998 for 80 of 80 and 1.0000000000000002 for 40 of 40, so
    clamp both limits to [0, 1] and test with a tolerance.
  - **n = 0.** p̂ = 0/0 and z²/n divides by zero, so there's no interval; print
    "no lines" rather than `NaN`.
- Synthesis: the TRD's 7.2%, that a big button right on all 40 lines "can
  still be wrong up to 7.2% of the time", is the earlier note's one-sided
  binomial-tail bound, 1 − 0.05^(1/40) = 0.072158, which that note tabulates
  as "at most 7.2% wrong (one-sided)" ([evaluation notes][eval-intervals]).
  A two-sided Wilson interval gives 8.76% there and a one-sided Wilson
  (z = 1.644854) 6.34%, so a Wilson test shouldn't expect 7.2%.

[nist-wilson]: https://www.itl.nist.gov/div898/handbook/prc/section2/prc241.htm
[eval-intervals]: /docs/research/0025-turn-evaluation.md#intervals-for-one-rankers-rate

## Percentiles for latency

- **Hyndman and Fan's nine types.** R's `quantile` implements them:
  Q_i(p) = (1 − γ)x_j + γx_{j+1}, with j = ⌊np + m⌋, g = np + m − j, and γ a
  function of j and g that each type sets; type 7's γ is g. Type 1 is the
  "Inverse of empirical distribution function" (m = 0; γ = 0 if g = 0, else
  1), which is nearest rank, x at ⌈np⌉. Type 7 has "m = 1-p.
  p_k = (k - 1)/(n - 1)", and "The default method is type 7, as used by S and
  by R < 2.0.0"; Hyndman and Fan recommended type 8 ([r-quantile]).
- **NumPy 2.5.** `numpy.percentile(a, q, ..., method='linear', ...)` lists the
  nine methods "sorted by their R type": `inverted_cdf` is type 1 and `linear`,
  the default, is type 7. `lower`, `higher`, `midpoint`, and `nearest` are
  discontinuous variations of `linear` ([numpy-pct]).
- **NIST.** Section 7.2.6.2: "For the pth percentile, set p(N+1) equal to k + d
  for k an integer, and d, a fraction greater than or equal to 0 and less than
  1", then "Y_(p) = Y_[k] + d (Y_[k+1] - Y_[k])", which is type 6, Dataplot's
  default. It notes "there is not a standard universally accepted way to
  perform this interpolation" and names R7 "the default method for R"
  ([nist-pct]).
- **Hands-on, NumPy 2.5.3.** For 1 to 10, `linear` gives 5.5 and 9.55 at the
  median and the 95th percentile, and `inverted_cdf` gives 5 and 10. For 1 to
  240, `linear` gives 120.5 and 228.05, and `inverted_cdf` 120 and 228.
  Python's `statistics.quantiles` defaults to the exclusive method and gives
  10.45 at the 95th percentile of 1 to 10, above the maximum.
- Synthesis: use type 7 for the median and the 95th percentile. The median is
  the familiar one, p = 1 lands on the maximum, so median ≤ p95 ≤ max follow
  from one definition, and a test can match `np.percentile`'s default. Nearest
  rank also works if the report should print only timings that occurred; at a
  few hundred timings the two differ by a fraction of one gap.

  ```ts
  // Type 7 (NumPy's 'linear'): sorted ascending, n >= 1, 0 <= p <= 1.
  const h = (sorted.length - 1) * p
  const j = Math.floor(h)
  const value = j + 1 < sorted.length ? sorted[j] + (h - j) * (sorted[j + 1] - sorted[j]) : sorted[j]
  ```

[r-quantile]: https://stat.ethz.ch/R-manual/R-devel/library/stats/html/quantile.html
[numpy-pct]: https://numpy.org/doc/stable/reference/generated/numpy.percentile.html
[nist-pct]: https://www.itl.nist.gov/div898/handbook/prc/section2/prc262.htm

## Timing JavaScript

- **Node 26.10's docs.** `performance.now()` "Returns the current high
  resolution millisecond timestamp, where 0 represents the start of the current
  `node` process" ([node-perf]). The page states no resolution or monotonicity.
  `process.hrtime.bigint()` returns nanoseconds "relative to an arbitrary time
  in the past" and "not subject to clock drift" ([node-process]).
- **The High Resolution Time spec.** "The monotonic clock's unsafe current time
  never decreases, so it can't be changed by system clock adjustments." Its
  coarsening, "Let time resolution be 100 microseconds, or a higher
  implementation-defined value", with 5 microseconds when cross-origin
  isolated, is written for browsers ([hr-time]).
- **Bun's docs.** Bun offers "The Web-standard `performance.now()` function"
  and "`Bun.nanoseconds()`, which is like `performance.now()` except it returns
  the time since the application started in nanoseconds", and suggests
  `mitata` for microbenchmarks ([bun-bench]).
- **Hands-on.** Two million back-to-back `performance.now()` calls on this Mac
  (Darwin 27.0) gave a smallest nonzero step of 0.000041 ms, 41 ns, and no
  backward step, under both Node v26.9.0 and Bun 1.4.2.
- **JavaScriptCore's tiers.** Bun runs on JavaScriptCore, which has four tiers:
  LLInt, Baseline, DFG, and FTL. "Each call to the function adds 15 points to
  the execution counter. Each loop execution adds 1 point", and Baseline takes
  500 points, DFG 1000, and FTL 100000, scaled at run time by function size and
  other factors ([jsc-speculation]).
- Synthesis: timer resolution isn't a concern for per-line timings of
  microseconds or more. A ranker looping over 40 phrases per call passes the
  Baseline and DFG thresholds within the first few lines but may reach FTL
  mid-run, so drop the whole first pass, as the TRD's "warm-up calls dropped"
  asks, and report the later passes. Vitest runs on Node's V8, so don't compare
  timings across the two runtimes.

[node-perf]: https://nodejs.org/api/perf_hooks.html
[node-process]: https://nodejs.org/api/process.html
[hr-time]: https://w3c.github.io/hr-time/
[bun-bench]: https://bun.com/docs/project/benchmarking
[jsc-speculation]: https://webkit.org/blog/10308/speculation-in-javascriptcore/

## Chance rates

- Synthesis: with g acceptable phrases among N in uniformly random order, let
  R be the rank of the first acceptable one. The other g − 1 must fall in the
  N − r places after rank r, which gives these, for 1 ≤ g ≤ N:

  ```text
  hit at k  = 1 − C(N − g, k) / C(N, k)
  P(R = r)  = C(N − r, g − 1) / C(N, g),   r = 1 … N − g + 1
  E[1 / R]  = Σ_{r=1}^{N−g+1} (1/r) · C(N − r, g − 1) / C(N, g)
  g = 1:      hit at k = k/N,  E[1 / R] = H_N / N
  ```

- Synthesis: this note's script checked both by exact enumeration, of all 720
  orders for N = 6 and of all C(40, g) position sets for N = 40, in exact
  fractions:

  | N   | g   | Hit at 1 | Hit at 3 or 6           | E[1/R]             |
  | --- | --- | -------- | ----------------------- | ------------------ |
  | 6   | 1   | 1/6      | at 3: 1/2               | 49/120             |
  | 6   | 2   | 1/3      | at 3: 4/5               | 29/50 = 0.58       |
  | 6   | 3   | 1/2      | at 3: 19/20             | 57/80              |
  | 40  | 1   | 1/40     | at 6: 3/20 = 15%        | H_40/40 ≈ 0.106964 |
  | 40  | 2   | 1/20     | at 6: 73/260 ≈ 28.08%   | ≈ 0.168130         |
  | 40  | 3   | 3/40     | at 6: 487/1235 ≈ 39.43% | ≈ 0.219359         |

- Synthesis: a line's chance depends on its own g and on the N its ranker
  orders, 40 for the shortlist, so the run's chance rate is the mean of the
  per-line values over lines with g ≥ 1, the same lines the ranking metrics
  count ([evaluation notes][eval-topk]). If the shortlist drops an acceptable
  phrase, g is the count left inside the 40, and a line with none left has a
  chance of 0.

[eval-topk]: /docs/research/0025-turn-evaluation.md#top-k-accuracy-recall-at-k-and-mrr

## Agreement between two labelers

### Cohen's kappa and specific agreement

- **Kappa.** scikit-learn 1.9.1, citing Cohen (1960), defines
  κ = (p_o − p_e)/(1 − p_e), with p_o "the empirical probability of agreement
  on the label assigned to any sample (the observed agreement ratio)" and p_e
  "estimated using a per-annotator empirical prior over the class labels"
  ([sk-kappa]; [cohen-1960]).
- **ppos and pneg.** Cicchetti and Feinstein: "The problem can be avoided only
  by using ppos and pneg as two separate indexes of proportionate agreement in
  the observers' positive and negative decisions", and "the omnibus value of
  kappa should always be accompanied by separate individual values of ppos and
  pneg" ([cf-1990]). Uebersax's raw-agreement page gives them as
  PA = 2a/(2a + b + c) and NA = 2d/(2d + b + c) ([uebersax-raw]).
- Synthesis: for a 2×2 table with a both positive, b and c split, d both
  negative, and n = a + b + c + d:

  ```text
  p_o  = (a + d) / n
  p_e  = ((a + b)(a + c) + (c + d)(b + d)) / n²
  κ    = (p_o − p_e) / (1 − p_e)
  ppos = 2a / (2a + b + c)
  pneg = 2d / (2d + b + c)
  ```

[sk-kappa]: https://scikit-learn.org/stable/modules/generated/sklearn.metrics.cohen_kappa_score.html
[cohen-1960]: https://doi.org/10.1177/001316446002000104
[cf-1990]: https://pubmed.ncbi.nlm.nih.gov/2189948/
[uebersax-raw]: https://www.john-uebersax.com/stat/raw.htm

### Krippendorff's alpha for two coders

- **General form.** Krippendorff's "Computing Krippendorff's Alpha-Reliability"
  (2011.1.25, literature updated 2013.9.13) defines α = 1 − D_o/D_e, "where Do
  is the observed disagreement among values assigned to units of analysis" and
  D_e "is the disagreement one would expect when the coding of units is
  attributable to chance". In a coincidence matrix "units are entered twice,
  once as c-k pairs and once as k-c pairs", and "For two observers: n = 2N"
  ([kripp-2011]).
- Synthesis: with two coders, no missing values, N units, labels a_u and b_u,
  and a difference δ with δ(x, x) = 0, each unit adds one (a_u, b_u) and one
  (b_u, a_u) coincidence, so the general form reduces to:

  ```text
  α   = 1 − D_o / D_e
  D_o = (1/n) Σ_c Σ_k o_ck δ(c, k)             = (1/N) Σ_u δ(a_u, b_u)
  D_e = (1/(n(n − 1))) Σ_c Σ_k n_c n_k δ(c, k)  with n = 2N
  ```

  D_o is the mean distance within units; D_e is the mean distance over all
  ordered pairs of distinct positions among the 2N pooled labels. When every
  label is the same, D_e = 0 and alpha is 0/0.

[kripp-2011]: https://www.asc.upenn.edu/sites/default/files/2021-03/Computing%20Krippendorff%27s%20Alpha-Reliability.pdf

### MASI and NLTK

- **MASI.** Passonneau (2006): "MASI ranges from 1, when two sets are
  identical, to 0, when they are disjoint", with "MASI = J*M", J the Jaccard
  ratio of intersection to union. "If two sets Q and P are identical, M is 1.
  If one set is a subset of the other, M is 2/3. If the intersection and the
  two set differences are all non-null, then M is 1/3. If the sets are
  disjoint, M is 0." It "can be used in any weighted agreement metric, such as
  Krippendorff's Alpha" ([passonneau-2006]).
- **NLTK's `masi_distance`.** On the `develop` branch (lines 265 to 290), it
  sets `m = 2 / 3` and `m = 1 / 3`, exact float fractions rather than 0.67 and
  0.33, and returns `1 - len_intersection / len_union * m` ([nltk-distance]).
  NLTK 3.10.3 gave 0.6666666666666667 for {1} and {1, 2}, 0.8888888888888888
  for {1, 2} and {2, 3}, and 1.0 for an empty set against {3}: its subset test
  picks m = 2/3 there, but J = 0. Two empty sets raise `ZeroDivisionError`,
  since the union is empty.
- **NLTK's `AnnotationTask.alpha()`.** It skips items with fewer than two
  labels, returns 1 when only one distinct label occurs, and otherwise takes
  `do = total_do / sum(all_valid_labels_freq.values())` and
  `de = self.Disagreement(all_valid_labels_freq)`, where `Disagreement` sums
  `nj * nl * distance` over label pairs and divides by
  `total_labels * (total_labels - 1)` ([nltk-agreement]).
- Synthesis: for two coders an item's `Disagreement` is δ(a_u, b_u), times
  its two labels, so `do` is the mean within-unit distance and `de` is
  Krippendorff's D_e: NLTK's alpha is Krippendorff's here. It returns 1 where
  Krippendorff's is 0/0. Labels must be hashable, so pass `frozenset`s.

[passonneau-2006]: http://www.lrec-conf.org/proceedings/lrec2006/pdf/636_pdf.pdf
[nltk-distance]: https://github.com/nltk/nltk/blob/develop/nltk/metrics/distance.py
[nltk-agreement]: https://github.com/nltk/nltk/blob/develop/nltk/metrics/agreement.py

### A test oracle for agreement

Synthesis: this note's script computed every value below in exact fractions.
Distances use MASI with none against none as 0 and none against any set as 1.

| Unit | Labeler A | Labeler B | Case       | J   | M   | MASI distance |
| ---- | --------- | --------- | ---------- | --- | --- | ------------- |
| u1   | none      | none      | both empty | –   | –   | 0             |
| u2   | none      | p3        | one empty  | 0   | –   | 1             |
| u3   | p1        | p1, p2    | subset     | 1/2 | 2/3 | 2/3           |
| u4   | p1, p2    | p2, p3    | overlap    | 1/3 | 1/3 | 8/9           |
| u5   | p4, p5    | p4, p5    | identical  | 1   | 1   | 0             |
| u6   | p6        | p7        | disjoint   | 0   | 0   | 1             |

- **Alpha with MASI.** The 12 pooled labels are none three times, {p1, p2} and
  {p4, p5} twice each, and {p1}, {p3}, {p2, p3}, {p6}, and {p7} once each.
  D_o = 16/27 ≈ 0.592593, D_e = 269/297 ≈ 0.905724, and
  α = 93/269 ≈ 0.345725. The coincidence-matrix route gives the same values.
- **NLTK 3.10.3.** `AnnotationTask(data, distance=masi0).alpha()`, with `masi0`
  returning 0.0 for two empty sets and `masi_distance` otherwise, gave
  0.34572490706319703, equal to 93/269 as a float, and `Do_Kw()` gave
  0.5925925925925926.
- **Alpha with whole sets as nominal values,** for contrast: D_o = 2/3,
  D_e = 61/66, and α = 17/61 ≈ 0.278689.
- **None versus some,** with positive meaning at least one acceptable phrase:
  a = 4 (u3 to u6), b = 0, c = 1 (u2), d = 1 (u1). Percent agreement is 5/6,
  p_e = 11/18, κ = 4/7 ≈ 0.571429, ppos = 8/9, and pneg = 2/3.
- **Line-and-phrase pairs,** judging every line against the same candidate
  list p1 to p8, 48 pairs: a = 4, b = 2, c = 4, d = 38. Percent agreement is
  7/8, p_e = 3/4, κ = 1/2, ppos = 4/7 ≈ 0.571429, and
  pneg = 38/41 ≈ 0.926829. Against p1 to p40, 240 pairs, only d changes, to
  230: κ = 19/34 ≈ 0.558824, ppos = 4/7, and pneg = 230/233 ≈ 0.987124.
- Synthesis: ppos ignores d, the pairs both labelers left out, so it stays at
  4/7 whatever the candidate list; κ and pneg drift with the list's length, so
  the count script should print ppos for pairs and name the list if it prints
  κ.

## Gaps

- Cohen (1960) and Hyndman and Fan (1996) weren't read directly; their
  formulas come from scikit-learn's and R's documentation, which cite them.
- Uebersax's raw-agreement page returned 404 on September 23, 2026, and no
  archived copy could be fetched; PA and NA are as a search index quoted it,
  and they match the standard 2×2 forms checked above.
- Krippendorff's PDF lost its formula symbols in text extraction; the reduced
  form above is this note's reading of its structure, checked against NLTK's
  code and output.
- JavaScriptCore's thresholds come from a 2020 WebKit post and may have
  changed in the JavaScriptCore that Bun 1.4.2 ships. The 41 ns step was
  measured on one Mac only.

## See also

- [Reply-ranking evaluation research notes](/docs/research/0025-turn-evaluation.md),
  especially
  [Ranking metrics that allow no answer](/docs/research/0025-turn-evaluation.md#ranking-metrics-that-allow-no-answer),
  [A scoring scheme for Turn's 80 lines](/docs/research/0025-turn-evaluation.md#a-scoring-scheme-for-turns-80-lines),
  and
  [Intervals for one ranker's rate](/docs/research/0025-turn-evaluation.md#intervals-for-one-rankers-rate)
- [Turn's shortlist and row research notes](/docs/research/0033-turn-shortlist-and-row.md)
- [The TRD's metrics, intervals, and thresholds](/docs/TRD.md#metrics-intervals-and-thresholds)

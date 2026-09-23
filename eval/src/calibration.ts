import type { LineScore, ScoredLine } from './score'
import { below, bootstrap, mean, percentile, resamples, seeded } from './stats'

/** One line's forecast: its top phrase's score, and whether that phrase is acceptable. */
export type Forecast = { score: number; right: boolean }

/**
 * Each line's forecast from a ranker: the first phrase of its order, which breaks ties as the row does, with its score,
 * and whether it's acceptable; a line where the ranker scored no phrase above 0 forecasts 0 and isn't right. This is
 * Guo et al.'s confidence calibration, of only the phrase the row would show first.
 */
export function topPhrase<Line extends ScoredLine>(scores: readonly LineScore<Line>[], ranker: string): Forecast[] {
  return scores.map(({ line, rankers }) => {
    const { ranking, order } = rankers[ranker]
    const [top] = order
    if (top === undefined) return { score: 0, right: false }
    return { score: ranking.scores.get(top) ?? 0, right: line.acceptable.includes(top) }
  })
}

/** Distinct scores from `low` to `high` that the fit gives one value, with their lines, right lines, and share. */
export type Block = { low: number; high: number; lines: number; right: number; value: number }

/**
 * The pool-adjacent-violators fit of whether each line was right to its score, as CORP's reliability diagram draws it:
 * the least-squares fit that never falls as the score rises, as blocks of distinct scores, low to high. Tied scores
 * pool first, which gives the fit `reliabilitydiag` gets by sorting each tie's right lines first, and adjacent blocks
 * of one value pool too, as its runs of one value do.
 */
export function pav(forecasts: readonly Forecast[]): Block[] {
  const groups = [...Map.groupBy(forecasts, ({ score }) => score)].toSorted(([a], [b]) => a - b)
  const blocks: Omit<Block, 'value'>[] = []
  for (const [score, group] of groups) {
    let block = { low: score, high: score, lines: group.length, right: group.filter(({ right }) => right).length }
    // Pool with the block below while its share is as high or higher, comparing whole numbers, not shares.
    let last = blocks.at(-1)
    while (last && last.right * block.lines >= block.right * last.lines) {
      blocks.pop()
      block = { low: last.low, high: block.high, lines: last.lines + block.lines, right: last.right + block.right }
      last = blocks.at(-1)
    }
    blocks.push(block)
  }
  return blocks.map((block) => ({ ...block, value: block.right / block.lines }))
}

/**
 * The fit at a score, as CORP draws it: a block's value across its scores, and on the line joining two blocks between
 * them. NaN outside the fitted scores, as R's `approx` gives there.
 */
export function fitAt(blocks: readonly Block[], score: number): number {
  const i = blocks.findIndex(({ high }) => score <= high)
  if (i < 0 || score < blocks[0].low) return NaN
  const { low, value } = blocks[i]
  if (score >= low) return value
  const before = blocks[i - 1]
  return before.value + ((score - before.high) / (low - before.high)) * (value - before.value)
}

/** How much of the resampled fits the consistency band holds at each score: `reliabilitydiag`'s default. */
const bandLevel = 0.9

/**
 * CORP's consistency band at each distinct score, low to high, as `reliabilitydiag` draws it for small samples:
 * resample the lines with replacement, redraw each outcome as right with its score's chance, as if the forecasts were
 * calibrated, refit PAV, and read the fit at each score; then take each score's 5th and 95th percentiles, by type 7,
 * over the resamples whose scores reach it. It draws 9,999 resamples from the committed seed, where the package
 * draws 100 by default, since more resamples only shrink the error of drawing them.
 */
export function consistencyBand(forecasts: readonly Forecast[]): { score: number; low: number; high: number }[] {
  const n = forecasts.length
  const scores = [...new Set(forecasts.map(({ score }) => score))].toSorted((a, b) => a - b)
  const fits = scores.map((): number[] => [])
  const next = seeded()
  for (let r = 0; r < resamples; r++) {
    const drawn = Array.from({ length: n }, () => forecasts[below(n, next)].score)
    const blocks = pav(drawn.map((score) => ({ score, right: next() / 2 ** 32 < score })))
    scores.forEach((score, i) => {
      const fit = fitAt(blocks, score)
      if (!Number.isNaN(fit)) fits[i].push(fit)
    })
  }
  const [lower, upper] = [50 - bandLevel * 50, 50 + bandLevel * 50]
  return scores.map((score, i) => ({ score, low: percentile(fits[i], lower), high: percentile(fits[i], upper) }))
}

/** The Brier score with its interval, and CORP's decomposition of it. */
export type Brier = {
  score: number
  low: number
  high: number
  /** UNC: the Brier score of forecasting, for every line, the share of lines that are right. */
  uncertainty: number
  /** MCB: the Brier score minus the PAV fit's; 0 when the forecasts are their own fit. */
  miscalibration: number
  /** DSC: UNC minus the PAV fit's Brier score; 0 when the fit is one value. */
  discrimination: number
}

/**
 * The Brier score of the forecasts, the mean of (score − right)², with its 95% percentile bootstrap interval over
 * the lines, and CORP's decomposition, which adds up to it exactly: score = MCB − DSC + UNC.
 */
export function brier(forecasts: readonly Forecast[]): Brier {
  const outcomes = forecasts.map(({ right }) => (right ? 1 : 0))
  const errors = forecasts.map(({ score }, i) => (score - outcomes[i]) ** 2)
  const score = mean(errors)
  const blocks = pav(forecasts)
  const fitted = mean(forecasts.map(({ score }, i) => (fitAt(blocks, score) - outcomes[i]) ** 2))
  const share = mean(outcomes)
  const uncertainty = mean(outcomes.map((outcome) => (share - outcome) ** 2))
  const { low, high } = bootstrap(
    forecasts.length,
    (sample) => sample.reduce((sum, i) => sum + errors[i], 0) / sample.length
  )
  return { score, low, high, uncertainty, miscalibration: score - fitted, discrimination: uncertainty - fitted }
}

import { startingPolicy } from '@turn/shared/row'
import type { LineScore, ScoredLine } from './score'
import { below, bootstrap, mean, percentile, resamples, seeded } from './stats'
import { svg, tag } from './svg'

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

/** The consistency band at one distinct score. */
export type Bounds = { score: number; low: number; high: number }

/** How much of the resampled fits the consistency band holds at each score: `reliabilitydiag`'s default. */
const bandLevel = 0.9

/**
 * CORP's consistency band at each distinct score, low to high, as `reliabilitydiag` draws it for small samples:
 * resample the lines with replacement, redraw each outcome as right with its score's chance, as if the forecasts were
 * calibrated, refit PAV, and read the fit at each score; then take each score's 5th and 95th percentiles, by type 7,
 * over the resamples whose scores reach it. It draws 9,999 resamples from the committed seed, where the package
 * draws 100 by default, since more resamples only shrink the error of drawing them.
 */
export function consistencyBand(forecasts: readonly Forecast[]): Bounds[] {
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

/** A reliability diagram's makings: the forecasts, their PAV fit, and the consistency band. */
export type Reliability = { forecasts: readonly Forecast[]; blocks: Block[]; band: Bounds[] }

/** The forecasts' PAV fit and consistency band, for the diagram and its table. */
export const reliability = (forecasts: readonly Forecast[]): Reliability => ({
  forecasts,
  blocks: pav(forecasts),
  band: consistencyBand(forecasts)
})

/** A block of the fit against the band: how many distinct scores it spans, and at how many its fit lies outside. */
export type AgainstBand = Block & { scores: number; outside: number }

/**
 * Each block of the fit against the consistency band, which holds 90% of the resampled fits at each score apart: at
 * how many of the block's distinct scores its fit lies outside the band there. The band is pointwise, so even a
 * calibrated ranker's fit lies outside it at about one score in ten.
 */
export function againstBand({ blocks, band }: Reliability): AgainstBand[] {
  return blocks.map((block) => {
    const within = band.filter(({ score }) => score >= block.low && score <= block.high)
    const outside = within.filter(({ low, high }) => block.value < low || block.value > high).length
    return { ...block, scores: within.length, outside }
  })
}

/** The diagram's size and margins, in pixels: a square plot, then a strip of bars under it, and a legend beside it. */
const frame = { width: 640, height: 560, left: 64, top: 24, side: 400, gap: 16, strip: 60 }
const stripTop = frame.top + frame.side + frame.gap
const stripBottom = stripTop + frame.strip

/** A score's place across the plot and a share's up it, in pixels to one decimal. */
const across = (score: number) => (frame.left + score * frame.side).toFixed(1)
const up = (share: number) => (frame.top + (1 - share) * frame.side).toFixed(1)

/**
 * The reliability diagram as an SVG, as CORP draws one: the top score across and the share of lines whose top phrase
 * is acceptable up, each from 0 to 1; the diagonal a calibrated ranker would follow; the consistency band, shaded; the
 * PAV fit as a line through a dot at each distinct score; the row's floor and big button's bar as rules; and under
 * it, a bar for each score's count of lines, the tallest for the most.
 */
export function reliabilityPlot({ forecasts, blocks, band }: Reliability, name: string): string {
  const ticks = [0, 0.2, 0.4, 0.6, 0.8, 1]
  const grid = ticks.flatMap((tick) => [
    tag('line', { x1: across(tick), y1: up(0), x2: across(tick), y2: up(1), stroke: '#e5e7eb' }),
    tag('line', { x1: across(0), y1: up(tick), x2: across(1), y2: up(tick), stroke: '#e5e7eb' }),
    tag('text', { x: across(tick), y: stripBottom + 18, 'text-anchor': 'middle' }, tick.toFixed(1)),
    tag(
      'text',
      { x: frame.left - 8, y: up(tick), 'text-anchor': 'end', 'dominant-baseline': 'middle' },
      tick.toFixed(1)
    )
  ])
  const rules = [
    { at: startingPolicy.floor, label: 'floor' },
    { at: startingPolicy.bigAbove, label: 'big button' }
  ].flatMap(({ at, label }) => [
    tag('line', { x1: across(at), y1: up(0), x2: across(at), y2: up(1), stroke: '#6b7280', 'stroke-dasharray': '2 3' }),
    tag('text', { x: across(at), y: frame.top - 8, 'text-anchor': 'middle' }, `${label} ${at}`)
  ])
  const outline = [
    ...band.map(({ score, high }) => [score, high]),
    ...band.toReversed().map(({ score, low }) => [score, low])
  ]
  // An outline of a single score encloses nothing, so the band there is a bar as wide as the legend's.
  const shade =
    band.length === 1
      ? tag('line', {
          x1: across(band[0].score),
          y1: up(band[0].low),
          x2: across(band[0].score),
          y2: up(band[0].high),
          stroke: '#d1d5db',
          'stroke-width': 10
        })
      : tag('polygon', {
          points: outline.map(([score, share]) => `${across(score)},${up(share)}`).join(' '),
          fill: '#d1d5db'
        })
  const groups = [...Map.groupBy(forecasts, ({ score }) => score)].toSorted(([a], [b]) => a - b)
  const fit = groups.map(([score]) => [score, fitAt(blocks, score)])
  const most = Math.max(...groups.map(([, lines]) => lines.length))
  const legendX = frame.left + frame.side + 24
  const pens: [label: string, pen: Record<string, string | number>][] = [
    ['Calibrated', { stroke: '#6b7280', 'stroke-dasharray': '6 4' }],
    ['Fitted by PAV', { stroke: '#000000', 'stroke-width': 2 }],
    ['90% band', { stroke: '#d1d5db', 'stroke-width': 10 }]
  ]
  const legend = pens.flatMap(([label, pen], i) => {
    const legendY = frame.top + 16 + i * 20
    return [
      tag('line', { x1: legendX, y1: legendY, x2: legendX + 24, y2: legendY, ...pen }),
      tag('text', { x: legendX + 32, y: legendY, 'dominant-baseline': 'middle' }, label)
    ]
  })
  return svg(
    {
      width: frame.width,
      height: frame.height,
      title: `Reliability of ${name}'s top phrase`,
      description:
        `${name}'s top score against the share of lines whose top phrase is acceptable, as the pool-adjacent-` +
        'violators fit gives it, beside the diagonal a calibrated ranker would follow, with the 90% consistency band ' +
        `around it, the row's floor of ${startingPolicy.floor} and big button's bar of ${startingPolicy.bigAbove}, ` +
        "and under it a bar for each score's count of lines."
    },
    [
      ...grid,
      shade,
      tag('line', { x1: across(0), y1: up(0), x2: across(1), y2: up(1), stroke: '#6b7280', 'stroke-dasharray': '6 4' }),
      ...rules,
      tag('polyline', {
        points: fit.map(([score, share]) => `${across(score)},${up(share)}`).join(' '),
        fill: 'none',
        stroke: '#000000',
        'stroke-width': 2
      }),
      ...fit.map(([score, share]) => tag('circle', { cx: across(score), cy: up(share), r: 3, fill: '#000000' })),
      ...groups.map(([score, lines]) => {
        const top = (stripBottom - (lines.length / most) * frame.strip).toFixed(1)
        return tag('line', {
          x1: across(score),
          y1: stripBottom.toFixed(1),
          x2: across(score),
          y2: top,
          stroke: '#000000'
        })
      }),
      tag('text', { x: frame.left - 8, y: stripTop + frame.strip / 2, 'text-anchor': 'end' }, 'Lines'),
      tag('text', { x: across(0.5), y: frame.height - 12, 'text-anchor': 'middle' }, `${name}'s top score`),
      tag(
        'text',
        { transform: `translate(16 ${up(0.5)}) rotate(-90)`, 'text-anchor': 'middle' },
        'Share whose top phrase is acceptable'
      ),
      ...legend
    ]
  )
}

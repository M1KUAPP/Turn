import { expect, test } from 'vitest'
import {
  againstBand,
  brier,
  consistencyBand,
  fitAt,
  pav,
  reliability,
  reliabilityPlot,
  topPhrase,
  type Forecast
} from '../src/calibration'
import type { Ranker } from '../src/rankers'
import { scoreLines } from '../src/score'
import { below, seeded } from '../src/stats'
import { noKind, smallBank } from './small-bank'

/** Forecasts from pairs of a score and whether the phrase was right. */
const forecasts = (...pairs: [number, boolean][]): Forecast[] => pairs.map(([score, right]) => ({ score, right }))

// Two violations and a tie: 0.2 is right once in two, 0.5 always, 0.7 never, and 0.9 always.
const worked = forecasts([0.2, true], [0.2, false], [0.5, true], [0.7, false], [0.7, false], [0.9, true])

test("takes each line's top phrase, as the row breaks ties, and whether it's acceptable", async () => {
  // Each line's scores by phrase; any other phrase scores 0.
  const scored: Record<string, Record<string, number>> = {
    right: { 'water-please': 0.9, 'im-cold': 0.3 },
    wrong: { 'im-cold': 0.7, 'water-please': 0.6 },
    // Tied: "Water, please" comes before "I'm cold" in the shortlist, so the row shows it first.
    tied: { 'im-cold': 0.8, 'water-please': 0.8 },
    none: { 'good-night': 0.65 },
    blank: {}
  }
  const byLine: Ranker = (line, shortlist) => ({
    kind: noKind,
    topic: {},
    scores: new Map(shortlist.map((phrase) => [phrase.id, scored[line][phrase.id] ?? 0])),
    onPhone: false
  })
  const lines = Object.keys(scored).map((text) => ({
    text,
    place: 'home',
    acceptable: text === 'none' ? [] : ['water-please']
  }))
  const { lines: scores } = await scoreLines(lines, smallBank, { byLine })
  expect(topPhrase(scores, 'byLine')).toEqual(
    forecasts([0.9, true], [0.7, false], [0.8, true], [0.65, false], [0, false])
  )
})

test('fits one value to each distinct score, never falling, pooling tied scores and adjacent violators', () => {
  expect(pav(worked)).toEqual([
    { low: 0.2, high: 0.7, lines: 5, right: 2, value: 0.4 },
    { low: 0.9, high: 0.9, lines: 1, right: 1, value: 1 }
  ])
  // Rising already, so nothing pools.
  expect(pav(forecasts([0.1, false], [0.5, true], [0.5, false], [0.9, true]))).toEqual([
    { low: 0.1, high: 0.1, lines: 1, right: 0, value: 0 },
    { low: 0.5, high: 0.5, lines: 2, right: 1, value: 0.5 },
    { low: 0.9, high: 0.9, lines: 1, right: 1, value: 1 }
  ])
  // Two scores that fit the same value make one block, as `reliabilitydiag`'s runs of one value do.
  expect(pav(forecasts([0.3, true], [0.3, false], [0.6, true], [0.6, false]))).toEqual([
    { low: 0.3, high: 0.6, lines: 4, right: 2, value: 0.5 }
  ])
})

test("fits what isotonic regression's max-min formula gives, on made-up forecasts with many ties", () => {
  const next = seeded([7, 11, 13, 17])
  for (let round = 0; round < 50; round++) {
    const made = Array.from({ length: 30 }, () => ({ score: below(8, next) / 8, right: below(2, next) === 1 }))
    const groups = [...Map.groupBy(made, ({ score }) => score)].toSorted(([a], [b]) => a - b)
    const share = (from: number, to: number) => {
      const members = groups.slice(from, to + 1).flatMap(([, group]) => group)
      return members.filter(({ right }) => right).length / members.length
    }
    const blocks = pav(made)
    groups.forEach(([score], i) => {
      let fit = -Infinity
      for (let j = 0; j <= i; j++) {
        let least = Infinity
        for (let k = i; k < groups.length; k++) least = Math.min(least, share(j, k))
        fit = Math.max(fit, least)
      }
      expect(fitAt(blocks, score)).toBeCloseTo(fit, 12)
    })
  }
})

test('reads the fit between two distinct scores on the line joining them, and none outside them', () => {
  const blocks = [
    { low: 0.2, high: 0.4, lines: 2, right: 0, value: 0.25 },
    { low: 0.6, high: 0.8, lines: 2, right: 2, value: 0.75 }
  ]
  expect(fitAt(blocks, 0.2)).toBe(0.25)
  expect(fitAt(blocks, 0.3)).toBe(0.25)
  expect(fitAt(blocks, 0.5)).toBeCloseTo(0.5, 12)
  expect(fitAt(blocks, 0.8)).toBe(0.75)
  expect(fitAt(blocks, 0.1)).toBeNaN()
  expect(fitAt(blocks, 0.9)).toBeNaN()
})

test("gives the Brier score and CORP's decomposition, which adds up to it exactly", () => {
  const { score, uncertainty, miscalibration, discrimination } = brier(worked)
  // (0.64 + 0.04 + 0.25 + 0.49 + 0.49 + 0.01) / 6; the PAV fit's own score is 0.2.
  expect(score).toBeCloseTo(0.32, 12)
  expect(uncertainty).toBeCloseTo(0.25, 12)
  expect(miscalibration).toBeCloseTo(0.12, 12)
  expect(discrimination).toBeCloseTo(0.05, 12)
  expect(miscalibration - discrimination + uncertainty).toBeCloseTo(score, 12)
})

test("measures uncertainty from the share of lines that are right, here a quarter's", () => {
  // The fit is 0 at 0.2 and 0.4 and 0.5 at 0.6 and 0.8, whose own score is 0.125.
  const quarter = brier(forecasts([0.2, false], [0.4, false], [0.6, true], [0.8, false]))
  expect(quarter.score).toBeCloseTo(0.25, 12)
  expect(quarter.uncertainty).toBeCloseTo(0.1875, 12)
  expect(quarter.miscalibration).toBeCloseTo(0.125, 12)
  expect(quarter.discrimination).toBeCloseTo(0.0625, 12)
})

test('finds no miscalibration in forecasts equal to their fit, and no discrimination in a constant fit', () => {
  const calibrated = forecasts(
    [0.25, true],
    [0.25, false],
    [0.25, false],
    [0.25, false],
    [0.75, true],
    [0.75, true],
    [0.75, true],
    [0.75, false]
  )
  expect(brier(calibrated).miscalibration).toBeCloseTo(0, 12)
  expect(brier(calibrated).discrimination).toBeCloseTo(0.0625, 12)
  // Right below and wrong above pools into one block of 0.5.
  const constant = brier(forecasts([0.1, true], [0.9, false]))
  expect(constant.discrimination).toBeCloseTo(0, 12)
  expect(constant.miscalibration).toBeCloseTo(0.56, 12)
})

test("gives the Brier score a percentile interval over resampled lines, one value when every line's is equal", () => {
  expect(brier(forecasts([0.5, true], [0.5, false], [0.5, true]))).toMatchObject({ score: 0.25, low: 0.25, high: 0.25 })
  const { score, low, high } = brier(worked)
  expect(low).toBeLessThan(score)
  expect(high).toBeGreaterThan(score)
  expect(brier(worked)).toEqual(brier(worked))
})

test('bands each distinct score by where the fit falls when each outcome is drawn as its score says', () => {
  // A score of 0 is never right and one of 1 always is, so every resample that reaches them fits them exactly.
  expect(consistencyBand(forecasts([0, false], [0, false], [1, true], [1, true]))).toEqual([
    { score: 0, low: 0, high: 0 },
    { score: 1, low: 1, high: 1 }
  ])
  const band = consistencyBand(worked)
  expect(band.map(({ score }) => score)).toEqual([0.2, 0.5, 0.7, 0.9])
  for (const { low, high } of band) {
    expect(low).toBeGreaterThanOrEqual(0)
    expect(high).toBeLessThanOrEqual(1)
    expect(low).toBeLessThanOrEqual(high)
  }
  // The same on every run, from the committed seed.
  expect(consistencyBand(worked)).toEqual(band)
})

test('draws the diagram as an SVG: the diagonal, the band, the fit through each score, the rules, and the bars', () => {
  const plotted = reliabilityPlot(reliability(worked), 'Jev')
  expect(plotted).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 640 560"/)
  expect(plotted).toContain("<title>Reliability of Jev's top phrase</title>")
  expect(plotted).toMatch(/<desc>Jev's top score against the share of lines whose top phrase is acceptable, .*<\/desc>/)
  // The plot is 400 pixels square, from 64 across and 24 down.
  expect(plotted).toContain('<line x1="64.0" y1="424.0" x2="464.0" y2="24.0"')
  // The fit: 0.4 from 0.2 to 0.7, rising to 1 at 0.9, with a dot at each distinct score.
  expect(plotted).toContain('<polyline points="144.0,264.0 264.0,264.0 344.0,264.0 424.0,24.0"')
  expect(plotted.match(/<circle /g)).toHaveLength(4)
  // The floor and the big button's bar, dotted apart from the grid.
  const rule = 'stroke="#6b7280" stroke-dasharray="2 3"/>'
  expect(plotted).toContain(`<line x1="304.0" y1="424.0" x2="304.0" y2="24.0" ${rule}`)
  expect(plotted).toContain(`<line x1="404.0" y1="424.0" x2="404.0" y2="24.0" ${rule}`)
  expect(plotted).toContain('>floor 0.6</text>')
  expect(plotted).toContain('>big button 0.85</text>')
  // Two lines at 0.2 and 0.7 make the tallest bars, 60 pixels, and one at 0.5 and 0.9 half that.
  expect(plotted).toContain('<line x1="144.0" y1="500.0" x2="144.0" y2="440.0"')
  expect(plotted).toContain('<line x1="264.0" y1="500.0" x2="264.0" y2="470.0"')
  expect(reliabilityPlot(reliability(worked), 'A & <b>')).toContain("<title>Reliability of A &amp; &lt;b&gt;'s")
})

test('shades the band along its upper bounds, low to high, and back along its lower bounds', () => {
  const band = [
    { score: 0.2, low: 0.1, high: 0.5 },
    { score: 0.9, low: 0.6, high: 1 }
  ]
  const plotted = reliabilityPlot({ forecasts: worked, blocks: pav(worked), band }, 'Jev')
  expect(plotted).toContain('<polygon points="144.0,224.0 424.0,24.0 424.0,184.0 144.0,384.0" fill="#d1d5db"/>')
})

test("counts the scores where each block's fit lies outside the band, not the span of the band across it", () => {
  const blocks = pav(worked)
  const band = [
    { score: 0.2, low: 0.1, high: 0.3 },
    { score: 0.5, low: 0.35, high: 0.6 },
    { score: 0.7, low: 0.5, high: 0.9 },
    { score: 0.9, low: 0.8, high: 1 }
  ]
  // The first block's 0.4 lies above the band at 0.2 and below it at 0.7, though inside the band's whole span.
  expect(againstBand({ forecasts: worked, blocks, band })).toEqual([
    { ...blocks[0], scores: 3, outside: 2 },
    { ...blocks[1], scores: 1, outside: 0 }
  ])
  // Half right at 0.1 and at 0.9 pools into one block of 0.5, outside the band at both scores.
  const halves = forecasts(
    ...Array.from({ length: 20 }, (_, i): [number, boolean] => [i < 10 ? 0.1 : 0.9, i % 2 === 0])
  )
  expect(againstBand(reliability(halves))).toMatchObject([{ low: 0.1, high: 0.9, value: 0.5, scores: 2, outside: 2 }])
})

/**
 * The band's exact 5th and 95th percentiles at each distinct score: every draw of the lines' indices and every set of
 * outcomes, each weighted by its chance, and the smallest fit whose share of the weight reaches each percentile; the
 * 9,999 resamples estimate these.
 */
const exactBand = (made: readonly Forecast[]) => {
  const n = made.length
  const scores = [...new Set(made.map(({ score }) => score))].toSorted((a, b) => a - b)
  const fits = scores.map((): [fit: number, chance: number][] => [])
  const draws = (k: number): number[][] =>
    k === 0 ? [[]] : draws(k - 1).flatMap((rest) => made.map((_, i) => [...rest, i]))
  for (const drawn of draws(n)) {
    for (let outcomes = 0; outcomes < 2 ** n; outcomes++) {
      const resample = drawn.map((i, j) => ({ score: made[i].score, right: ((outcomes >> j) & 1) === 1 }))
      const chance = resample.reduce((p, { score, right }) => p * (right ? score : 1 - score), 1 / n ** n)
      const blocks = pav(resample)
      scores.forEach((score, s) => {
        const fit = fitAt(blocks, score)
        if (chance > 0 && !Number.isNaN(fit)) fits[s].push([fit, chance])
      })
    }
  }
  const percentileOf = (weighted: [number, number][], share: number) => {
    const total = weighted.reduce((sum, [, chance]) => sum + chance, 0)
    let reached = 0
    return weighted
      .toSorted(([a], [b]) => a - b)
      .find(([, chance]) => (reached += chance) >= share * total - 1e-12)?.[0]
  }
  return scores.map((score, s) => ({ score, low: percentileOf(fits[s], 0.05), high: percentileOf(fits[s], 0.95) }))
}

test('resamples the lines and reads the fit between their scores, as an exact count of every draw gives', () => {
  const made = forecasts([0, false], [0, false], [0.1, false], [0.75, false], [1, true])
  const exact = exactBand(made)
  // Keeping each line and redrawing only its outcome would give 0 to 1 at 0.1; dropping a resample that holds no line
  // at 0.1, rather than reading its fit on the line between 0 and 0.75, would give 0 to 2/3.
  expect(exact.map(({ score, low, high }) => [score, low, high])).toEqual([
    [0, 0, 0],
    [0.1, 0, 0.5],
    [0.75, 0, 1],
    [1, 1, 1]
  ])
  expect(consistencyBand(made)).toEqual(exact)
})

test('holds 90% of the resampled fits: at one score, the 5th and 95th percentiles of a binomial share', () => {
  // 100 lines at 0.5 pool into one block, whose fit is the share of 100 draws that are right: its 5th and 95th
  // percentiles are 0.5 ∓ 1.645 × 0.05, where a 95% band would reach 0.40 and 0.60.
  const [{ low, high }] = consistencyBand(Array.from({ length: 100 }, (_, i) => ({ score: 0.5, right: i % 2 === 0 })))
  expect(low).toBeCloseTo(0.42, 2)
  expect(high).toBeCloseTo(0.58, 2)
})

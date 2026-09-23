import { expect, test } from 'vitest'
import { brier, consistencyBand, fitAt, pav, topPhrase, type Forecast } from '../src/calibration'
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

test('holds 90% of the resampled fits: at one score, the 5th and 95th percentiles of a binomial share', () => {
  // 100 lines at 0.5 pool into one block, whose fit is the share of 100 draws that are right: its 5th and 95th
  // percentiles are 0.5 ∓ 1.645 × 0.05, where a 95% band would reach 0.40 and 0.60.
  const [{ low, high }] = consistencyBand(Array.from({ length: 100 }, (_, i) => ({ score: 0.5, right: i % 2 === 0 })))
  expect(low).toBeCloseTo(0.42, 2)
  expect(high).toBeCloseTo(0.58, 2)
})

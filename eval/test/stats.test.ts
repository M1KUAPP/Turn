import { expect, test } from 'vitest'
import { chanceHit, chanceReciprocalRank, percentile, wilson } from '../src/stats'

const oneTo = (n: number) => Array.from({ length: n }, (_, i) => i + 1)

test("gives 56 of 80 the 95% interval NIST's Wilson formula gives", () => {
  const interval = wilson(56, 80)
  expect(interval?.low).toBeCloseTo(0.592318, 6)
  expect(interval?.high).toBeCloseTo(0.789354, 6)
})

test('starts 0 of n at 0 and ends n of n at 1, never past them', () => {
  expect(wilson(0, 80)?.low).toBeCloseTo(0, 12)
  expect(wilson(0, 80)?.high).toBeCloseTo(0.045818, 6)
  expect(wilson(80, 80)?.low).toBeCloseTo(0.954182, 6)
  expect(wilson(80, 80)?.high).toBeCloseTo(1, 12)
  // Unclamped, floating point puts these just below 0 and just above 1.
  expect(wilson(0, 21)?.low).toBeGreaterThanOrEqual(0)
  expect(wilson(40, 40)?.high).toBeLessThanOrEqual(1)
})

test('gives no interval over no lines', () => {
  expect(wilson(0, 0)).toBeNull()
})

test("gives NumPy's default percentiles, Hyndman and Fan's type 7", () => {
  expect(percentile(oneTo(10), 50)).toBeCloseTo(5.5, 12)
  expect(percentile(oneTo(10), 95)).toBeCloseTo(9.55, 12)
  expect(percentile(oneTo(240), 50)).toBeCloseTo(120.5, 12)
  expect(percentile(oneTo(240), 95)).toBeCloseTo(228.05, 12)
})

test('gives the least and the greatest value at 0 and 100, in any order, leaving the input alone', () => {
  const timings = [3, 9, 1, 7]
  expect(percentile(timings, 0)).toBe(1)
  expect(percentile(timings, 50)).toBe(5)
  expect(percentile(timings, 100)).toBe(9)
  expect(timings).toEqual([3, 9, 1, 7])
})

test('gives the chance a random order puts an acceptable phrase first or in the first k, as enumeration does', () => {
  expect(chanceHit(6, 2, 1)).toBeCloseTo(1 / 3, 12)
  expect(chanceHit(6, 2, 3)).toBeCloseTo(4 / 5, 12)
  expect(chanceHit(40, 1, 1)).toBeCloseTo(0.025, 12)
  expect(chanceHit(40, 1, 6)).toBeCloseTo(0.15, 12)
  expect(chanceHit(40, 2, 6)).toBeCloseTo(73 / 260, 12)
})

test("gives a random order's expected reciprocal rank, as enumeration does", () => {
  expect(chanceReciprocalRank(6, 2)).toBeCloseTo(29 / 50, 12)
  expect(chanceReciprocalRank(40, 1)).toBeCloseTo(0.106964, 6)
  expect(chanceReciprocalRank(40, 2)).toBeCloseTo(0.16813, 6)
  expect(chanceReciprocalRank(3, 3)).toBe(1)
})

test('gives no chance with no acceptable phrase, and a sure hit when k covers every phrase', () => {
  expect(chanceHit(40, 0, 6)).toBe(0)
  expect(chanceReciprocalRank(40, 0)).toBe(0)
  expect(chanceHit(4, 1, 6)).toBe(1)
})

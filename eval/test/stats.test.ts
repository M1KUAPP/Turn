import { expect, test } from 'vitest'
import { below, chanceHit, chanceReciprocalRank, pairedBootstrap, percentile, seeded, wilson } from '../src/stats'

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

test("draws xoshiro128** 1.1's numbers, as its authors' C code does from the same seed", () => {
  const next = seeded([1, 2, 3, 4])
  expect(Array.from({ length: 6 }, next)).toEqual([11520, 0, 5927040, 70819200, 2031721883, 1637235492])
  const committed = seeded()
  expect(Array.from({ length: 6 }, committed)).toEqual([
    735645822, 2826355964, 373689319, 580518553, 985499675, 3467955503
  ])
})

test('draws each whole number below n about equally often, drawing again past the last whole multiple of n', () => {
  const next = seeded()
  const counts = [0, 0, 0, 0, 0, 0, 0]
  for (let i = 0; i < 70_000; i++) counts[below(7, next)] += 1
  for (const count of counts) expect(Math.abs(count - 10_000)).toBeLessThan(400)
  // 2^32 is 1 more than a multiple of 3, so its last value is drawn again.
  const draws = [2 ** 32 - 1, 5]
  expect(below(3, () => draws.shift() as number)).toBe(2)
})

test("gives the paired bootstrap's interval for a gap, the same on every run", () => {
  // The evaluation notes' example: of 80 lines, 45 both right, 15 only a, 5 only b, and 15 neither.
  const a = [...Array(60).fill(1), ...Array(20).fill(0)]
  const b = [...Array(45).fill(1), ...Array(15).fill(0), ...Array(5).fill(1), ...Array(15).fill(0)]
  const gap = pairedBootstrap(a, b)
  expect(gap?.difference).toBeCloseTo(0.125, 12)
  // About 0.125 ± 1.96 × 0.054, the normal approximation's standard error for paired proportions.
  expect(gap?.low).toBeGreaterThan(0.01)
  expect(gap?.low).toBeLessThan(0.04)
  expect(gap?.high).toBeGreaterThan(0.21)
  expect(gap?.high).toBeLessThan(0.24)
  // The committed seed's interval, 1.25 to 23.75 points; the notes' SciPy BCa interval was 2.5 to 23.8.
  expect(gap).toEqual({ difference: 0.125, low: 0.0125, high: 0.2375 })
  expect(pairedBootstrap(a, b)).toEqual(gap)
  // A smaller sample whose interval moves with the count: 999 resamples would give -1/23 to 8/23.
  const few = [...Array(5).fill(1), 0, ...Array(17).fill(1)]
  const other = [...Array(5).fill(0), 1, ...Array(17).fill(1)]
  expect(pairedBootstrap(few, other)).toEqual({ difference: 4 / 23, low: 0, high: 9 / 23 })
})

test('gives an interval of one value when no item splits the two, and none for no items', () => {
  expect(pairedBootstrap([1, 0, 1], [1, 0, 1])).toEqual({ difference: 0, low: 0, high: 0 })
  expect(pairedBootstrap([1, 1], [0, 0])).toEqual({ difference: 1, low: 1, high: 1 })
  expect(pairedBootstrap([], [])).toBeNull()
})

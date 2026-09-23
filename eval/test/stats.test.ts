import { expect, test } from 'vitest'
import { percentile, wilson } from '../src/stats'

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

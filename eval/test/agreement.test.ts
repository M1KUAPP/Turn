import { expect, test } from 'vitest'
import { compareLabelings } from '../src/agreement'

const candidates = (n: number) => Array.from({ length: n }, (_, i) => `p${i + 1}`)
// The research note's worked example: none and none, none and some, a subset, an overlap, the same set, and two sets
// with nothing in common.
const units = (n: number) =>
  [
    [[], []],
    [[], ['p3']],
    [['p1'], ['p1', 'p2']],
    [
      ['p1', 'p2'],
      ['p2', 'p3']
    ],
    [
      ['p4', 'p5'],
      ['p4', 'p5']
    ],
    [['p6'], ['p7']]
  ].map(([first, second]) => ({ first, second, candidates: candidates(n) }))

test('compares the call on each line, some replies or none, with kappa and positive and negative agreement', () => {
  const { noneOrSome } = compareLabelings(units(8))
  expect(noneOrSome).toMatchObject({ a: 4, b: 0, c: 1, d: 1 })
  expect(noneOrSome.percent).toBeCloseTo(5 / 6, 12)
  expect(noneOrSome.kappa).toBeCloseTo(4 / 7, 12)
  expect(noneOrSome.positive).toBeCloseTo(8 / 9, 12)
  expect(noneOrSome.negative).toBeCloseTo(2 / 3, 12)
})

test('compares each line and candidate phrase, where only kappa and negative agreement move with the candidates', () => {
  const { pairs } = compareLabelings(units(8))
  expect(pairs).toMatchObject({ a: 4, b: 2, c: 4, d: 38 })
  expect(pairs.percent).toBeCloseTo(7 / 8, 12)
  expect(pairs.kappa).toBeCloseTo(1 / 2, 12)
  expect(pairs.positive).toBeCloseTo(4 / 7, 12)
  expect(pairs.negative).toBeCloseTo(38 / 41, 12)
  const wider = compareLabelings(units(40)).pairs
  expect(wider).toMatchObject({ a: 4, b: 2, c: 4, d: 230 })
  expect(wider.kappa).toBeCloseTo(19 / 34, 12)
  expect(wider.positive).toBeCloseTo(4 / 7, 12)
  expect(wider.negative).toBeCloseTo(230 / 233, 12)
})

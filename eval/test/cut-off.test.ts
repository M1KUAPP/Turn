import type { Phrase } from '@turn/shared/shortlist'
import { expect, test } from 'vitest'
import { chooseCutOff, crossValidate, folds } from '../src/cut-off'
import { atCutOff } from '../src/embeddings'
import type { Ranker } from '../src/rankers'
import { scoreLines } from '../src/score'
import { noKind, smallBank } from './small-bank'

// 80 lines as the evaluation has them: 72 with an acceptable reply, then 8 with none.
const labeled = Array.from({ length: 80 }, (_, i) => ({ id: i, none: i >= 72 }))

test('deals five folds of 16, each with its share of the lines with no reply, from a seeded shuffle', () => {
  const fold = folds(labeled, (line) => line.none)
  for (let f = 0; f < 5; f++) {
    const members = labeled.filter((_, i) => fold[i] === f)
    expect(members).toHaveLength(16)
    expect(members.filter((line) => line.none).length).toBeGreaterThanOrEqual(1)
    expect(members.filter((line) => line.none).length).toBeLessThanOrEqual(2)
  }
  expect(folds(labeled, (line) => line.none)).toEqual(fold)
  // Neither the file's order dealt round-robin nor in blocks of 16.
  expect(fold).not.toEqual(labeled.map((_, i) => i % 5))
  expect(fold).not.toEqual(labeled.map((_, i) => Math.floor(i / 16)))
})

test('chooses the cut-off that makes the most items right, a tie going to the higher, or one above them all', () => {
  // Each item is right when it's covered and good, or held and bad.
  const items = [
    { value: 0.9, good: true },
    { value: 0.8, good: true },
    { value: 0.7, good: false },
    { value: 0.6, good: true },
    { value: 0.5, good: false }
  ]
  const right = (item: (typeof items)[number], cutOff: number) => item.value >= cutOff === item.good
  // At 0.8, four are right; at 0.6, four too; the higher wins.
  expect(chooseCutOff(items, (item) => [item.value], right)).toBe(0.8)
  expect(chooseCutOff(items.slice(2, 3), (item) => [item.value], right)).toBe(Infinity)
  expect(chooseCutOff([], (item: (typeof items)[number]) => [item.value], right)).toBe(Infinity)
})

test("tries a line's lower scores too, since a cut-off below its top brings more of its phrases", () => {
  // The first line's top phrase is wrong and its second, at 0.9, right; the second line has no reply. Only its top
  // scores would offer 0.95, which hides the right phrase, and 0.85, which covers the line with none.
  const items = [
    { scores: [0.95, 0.9], acceptable: 0.9 },
    { scores: [0.85], acceptable: null }
  ]
  const right = ({ scores, acceptable }: (typeof items)[number], cutOff: number) =>
    acceptable === null ? scores[0] < cutOff : scores.some((score) => score >= cutOff && score === acceptable)
  expect(chooseCutOff(items, (item) => item.scores, right)).toBe(0.9)
  expect(chooseCutOff(items, (item) => item.scores.slice(0, 1), right)).toBe(Infinity)
})

test("chooses each fold's cut-off on the other folds alone", () => {
  // One item a fold. Covering what reaches 0.7 and holding the rest is right, so every fold chooses 0.7, but the fold
  // that holds 0.7 can't, and chooses the lowest value above it.
  const items = [0.9, 0.8, 0.7, 0.6, 0.5]
  const right = (value: number, cutOff: number) => value >= cutOff === value >= 0.7
  expect(crossValidate(items, [0, 1, 2, 3, 4], (value) => [value], right)).toEqual([0.7, 0.7, 0.8, 0.7, 0.7])
})

test('gives the phrases whose cosine reaches the cut-off 1 and the rest 0, best first, ties in their own order', () => {
  const ranking = {
    kind: noKind,
    topic: {},
    scores: new Map([
      ['a', 0.5],
      ['b', 0.8],
      ['c', 0.62],
      ['d', 0.62]
    ]),
    onPhone: true
  }
  expect([...atCutOff(ranking, 0.62).scores]).toEqual([
    ['b', 1],
    ['c', 1],
    ['d', 1],
    ['a', 0]
  ])
  expect([...atCutOff(ranking, 0.9).scores.values()]).toEqual([0, 0, 0, 0])
})

test("scores a ranker with a cut-off at its line's fold's cut-off, chosen on the other folds", async () => {
  const bank: Phrase[] = smallBank
  // Lines at home whose one good phrase scores its line's value, and lines with none whose best scores theirs.
  const lines = [0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5].map((value, i) => ({
    text: `Line ${i}`,
    place: 'home',
    value,
    acceptable: value >= 0.7 ? ['water-please'] : []
  }))
  const byValue: Ranker = (text, shortlist) => {
    const { value } = lines.find((line) => line.text === text) ?? { value: 0 }
    return {
      kind: noKind,
      topic: {},
      scores: new Map(shortlist.map((phrase) => [phrase.id, phrase.id === 'water-please' ? value : value / 2])),
      onPhone: true
    }
  }
  const { lines: scored, cutOffs } = await scoreLines(lines, bank, { byValue }, { byValue: atCutOff })
  // Four folds learn to cover 0.7 and above from the others; the fold that holds the 0.7 line can't, and covers 0.75.
  expect(cutOffs.byValue).toEqual([0.7, 0.7, 0.7, 0.7, 0.75])
  const fold = folds(lines, (line) => line.acceptable.length > 0)
  for (const [i, { line, rankers }] of scored.entries()) {
    const covered = line.value >= cutOffs.byValue[fold[i]]
    expect(rankers.byValue.outcome, line.text).toBe(
      covered
        ? line.acceptable.length
          ? 'right row'
          : 'wrong row'
        : line.acceptable.length
          ? 'missed reply'
          : 'right hold'
    )
  }
  // So that line alone is missed, as it would be had its fold's cut-off been set without it in a real run.
  const wrong = scored.filter(({ rankers }) => !rankers.byValue.outcome.startsWith('right'))
  expect(wrong.map(({ line, rankers }) => [line.value, rankers.byValue.outcome])).toEqual([[0.7, 'missed reply']])
})

test('counts a right hold as right, so holding every line can win', async () => {
  // Six lines with no reply score higher than the four with one, so covering any line is worse than holding them all.
  const lines = [0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.6, 0.6, 0.6, 0.6].map((value, i) => ({
    text: `Line ${i}`,
    place: 'home',
    acceptable: value < 0.9 ? ['water-please'] : []
  }))
  const byValue: Ranker = (text, shortlist) => ({
    kind: noKind,
    topic: {},
    scores: new Map(shortlist.map((phrase) => [phrase.id, Number(text.slice(5)) < 6 ? 0.9 : 0.6])),
    onPhone: true
  })
  const { lines: scored, cutOffs } = await scoreLines(lines, smallBank, { byValue }, { byValue: atCutOff })
  expect(cutOffs.byValue).toEqual([Infinity, Infinity, Infinity, Infinity, Infinity])
  expect(scored.map(({ rankers }) => rankers.byValue.outcome)).toEqual([
    ...Array(6).fill('right hold'),
    ...Array(4).fill('missed reply')
  ])
})

test("scores each line at a cut-off chosen from the other folds' lines' six highest scores", async () => {
  // Five lines whose top phrase is wrong and whose second, at 0.9, is right, and five with no reply whose top is 0.85:
  // only a cut-off of 0.9, a second score, gets all of them right.
  const lines = ['A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B'].map((kind, i) => ({
    text: `${kind}${i}`,
    place: 'home',
    acceptable: kind === 'A' ? ['water-please'] : []
  }))
  const scored: Record<string, number> = { 'good-night': 0.95, 'water-please': 0.9 }
  const secondRight: Ranker = (text, shortlist) => ({
    kind: noKind,
    topic: {},
    scores: new Map(
      shortlist.map((phrase) => [
        phrase.id,
        text.startsWith('A') ? (scored[phrase.id] ?? 0.1) : phrase.id === 'good-night' ? 0.85 : 0.1
      ])
    ),
    onPhone: true
  })
  const { lines: scores, cutOffs } = await scoreLines(lines, smallBank, { secondRight }, { secondRight: atCutOff })
  expect(cutOffs.secondRight).toEqual([0.9, 0.9, 0.9, 0.9, 0.9])
  expect(scores.map(({ rankers }) => rankers.secondRight.outcome)).toEqual([
    ...Array(5).fill('right row'),
    ...Array(5).fill('right hold')
  ])
})

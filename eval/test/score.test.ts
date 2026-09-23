import type { Phrase } from '@turn/shared/shortlist'
import { expect, test } from 'vitest'
import { keyword, place, type Ranker } from '../src/rankers'
import { scoreLines, summarize } from '../src/score'

const fillers: Phrase[] = Array.from({ length: 30 }, (_, i) => ({
  id: `filler-${i + 1}`,
  text: `Filler ${i + 1}`,
  places: []
}))
// 41 phrases the row can rank, so a shortlist of 40 leaves one out: "It went well", last in the grid.
const bank: Phrase[] = [
  { id: 'yes', text: 'Yes', places: [], fixed: true },
  { id: 'no', text: 'No', places: [], fixed: true },
  { id: 'not-sure', text: 'Not sure', places: [], fixed: true },
  { id: 'thank-you', text: 'Thank you', places: [] },
  { id: 'good-morning', text: 'Good morning', places: ['home'] },
  { id: 'water-please', text: 'Water, please', places: ['home'] },
  { id: 'excuse-me', text: 'Excuse me', places: ['shop'] },
  { id: 'im-cold', text: "I'm cold", places: ['home'] },
  { id: 'good-night', text: 'Good night', places: ['home'] },
  { id: 'more-please', text: 'More, please', places: ['home'] },
  { id: 'im-full', text: "I'm full", places: ['home'] },
  { id: 'im-tired', text: "I'm tired", places: ['home'] },
  { id: 'how-much-is-this', text: 'How much is this?', places: ['shop'] },
  ...fillers,
  { id: 'it-went-well', text: 'It went well', places: [] },
  { id: 'wait-im-typing', text: "Wait, I'm typing", places: [], strip: true }
]
const lines = [
  { id: 'water', text: 'Do you want some water?', place: 'home', acceptable: ['yes', 'no', 'water-please'] },
  { id: 'physio', text: 'How was physio?', place: 'shop', acceptable: ['it-went-well'] },
  { id: 'weather', text: 'Nice weather today.', place: 'home', acceptable: [] },
  { id: 'cold', text: 'Are you cold?', place: 'home', acceptable: ['yes', 'no'] },
  { id: 'costs', text: 'That costs too much.', place: 'shop', acceptable: [] }
]
const fillerIds = fillers.map((filler) => filler.id)
// The TRD's six outcomes, none seen yet.
const none = {
  'right big button': 0,
  'wrong big button': 0,
  'right row': 0,
  'wrong row': 0,
  'missed reply': 0,
  'right hold': 0
}
const run = () => scoreLines(lines, bank, { place, keyword })

test("picks each line's shortlist of 40 from a fresh bank at the line's place", () => {
  const [water, physio] = run().lines
  expect(water.shortlist).toEqual([
    'water-please',
    ...['good-morning', 'im-cold', 'good-night', 'more-please', 'im-full', 'im-tired'],
    ...['thank-you', 'excuse-me', 'how-much-is-this'],
    ...fillerIds
  ])
  expect(physio.shortlist).toEqual([
    ...['excuse-me', 'how-much-is-this'],
    ...['thank-you', 'good-morning', 'water-please', 'im-cold', 'good-night', 'more-please', 'im-full', 'im-tired'],
    ...fillerIds
  ])
})

test('scores each ranker by what the user would see', () => {
  const seen = run().lines.map(({ line, rankers }) => [line.id, rankers.place.outcome, rankers.keyword.outcome])
  expect(seen).toEqual([
    ['water', 'right row', 'right row'],
    ['physio', 'wrong row', 'missed reply'],
    ['weather', 'wrong row', 'right hold'],
    ['cold', 'wrong row', 'right row'],
    ['costs', 'wrong row', 'wrong row']
  ])
})

const scoring =
  (scores: (shortlist: readonly Phrase[]) => [string, number][]): Ranker =>
  (_line, shortlist) => ({
    kind: { yes_no: 0, either_or: 0, open: 0, not_a_question: 0 },
    topic: {},
    scores: new Map(scores(shortlist)),
    onPhone: false
  })

test('orders each ranking by score, keeping its own order among ties', () => {
  const unsorted = scoring(() => [
    ['im-cold', 0.2],
    ['water-please', 0.7],
    ['thank-you', 0.2]
  ])
  const [water] = scoreLines(lines, bank, { unsorted, place }).lines
  expect(water.rankers.unsorted.order).toEqual(['water-please', 'im-cold', 'thank-you'])
  expect(water.rankers.place.order.slice(0, 3)).toEqual(['good-morning', 'water-please', 'im-cold'])
})

test('scores a big button right only when its phrase is acceptable, and counts it in coverage and risk', () => {
  const sure = scoring((shortlist) => [[shortlist[0].id, 0.9]])
  const scored = scoreLines(lines, bank, { sure }).lines
  expect(scored.map(({ rankers }) => rankers.sure.outcome)).toEqual([
    'right big button',
    'wrong big button',
    'wrong big button',
    'wrong big button',
    'wrong big button'
  ])
  const { coverage, risk } = summarize(scored).rankers.sure
  expect([coverage, risk]).toEqual([
    { k: 5, n: 5 },
    { k: 4, n: 5 }
  ])
})

test('sums up the ranking over lines with an acceptable phrase besides the fixed buttons, and the row over all', () => {
  const summary = summarize(run().lines)
  expect(summary.lines).toBe(5)
  expect(summary.recall).toEqual({ k: 1, n: 2 })
  expect(summary.chance.top1).toBeCloseTo(1 / 80, 12)
  expect(summary.chance.top6).toBeCloseTo(3 / 40, 12)
  expect(summary.chance.meanReciprocalRank).toBeCloseTo(0.106964 / 2, 6)
  expect(summary.alwaysHold).toEqual({ ...none, 'missed reply': 3, 'right hold': 2 })
  expect(summary.rankers.keyword).toEqual({
    top1: { k: 1, n: 2 },
    top6: { k: 1, n: 2 },
    meanReciprocalRank: 0.5,
    outcomes: { ...none, 'right row': 2, 'wrong row': 1, 'missed reply': 1, 'right hold': 1 },
    coverage: { k: 3, n: 5 },
    risk: { k: 1, n: 3 }
  })
  expect(summary.rankers.place).toEqual({
    top1: { k: 0, n: 2 },
    top6: { k: 1, n: 2 },
    meanReciprocalRank: 0.25,
    outcomes: { ...none, 'right row': 1, 'wrong row': 4 },
    coverage: { k: 5, n: 5 },
    risk: { k: 4, n: 5 }
  })
})

test("works out chance over each line's own shortlist, however long", () => {
  const small = bank.filter((phrase) => ['thank-you', 'excuse-me', 'im-cold', 'im-tired'].includes(phrase.id))
  const { chance } = summarize(
    scoreLines([{ text: 'Are you cold?', place: 'home', acceptable: ['im-cold'] }], small, {}).lines
  )
  expect(chance.top1).toBeCloseTo(1 / 4, 12)
  expect(chance.top6).toBe(1)
  // (1 + 1/2 + 1/3 + 1/4) / 4
  expect(chance.meanReciprocalRank).toBeCloseTo(25 / 48, 12)
})

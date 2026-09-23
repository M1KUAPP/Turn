import type { Phrase } from '@turn/shared/shortlist'
import { expect, test } from 'vitest'
import { keyword, place, type Ranker } from '../src/rankers'
import { bigButtons, kindMatrix, scoreLines, sharesNoWord, summarize, topSixGap } from '../src/score'
import { smallBank, waitImTyping } from './small-bank'

const fillers: Phrase[] = Array.from({ length: 30 }, (_, i) => ({
  id: `filler-${i + 1}`,
  text: `Filler ${i + 1}`,
  places: []
}))
// 41 phrases the row can rank, so a shortlist of 40 leaves one out: "It went well", last in the grid.
const bank: Phrase[] = [
  ...smallBank,
  { id: 'how-much-is-this', text: 'How much is this?', places: ['shop'] },
  ...fillers,
  { id: 'it-went-well', text: 'It went well', places: [] },
  waitImTyping
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

test("picks each line's shortlist of 40 from a fresh bank at the line's place", async () => {
  const [water, physio] = (await run()).lines
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

test('scores each ranker by what the user would see', async () => {
  const seen = (await run()).lines.map(({ line, rankers }) => [line.id, rankers.place.outcome, rankers.keyword.outcome])
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

test('orders each ranking by score, keeping its own order among ties', async () => {
  const unsorted = scoring(() => [
    ['im-cold', 0.2],
    ['water-please', 0.7],
    ['thank-you', 0.2]
  ])
  const [water] = (await scoreLines(lines, bank, { unsorted, place })).lines
  expect(water.rankers.unsorted.order).toEqual(['water-please', 'im-cold', 'thank-you'])
  expect(water.rankers.place.order.slice(0, 3)).toEqual(['good-morning', 'water-please', 'im-cold'])
})

test('scores a big button right only when its phrase is acceptable, and counts it in coverage and risk', async () => {
  const sure = scoring((shortlist) => [[shortlist[0].id, 0.9]])
  const scored = (await scoreLines(lines, bank, { sure })).lines
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

test('sums up the ranking over lines with an acceptable phrase besides the fixed buttons, and the row over all', async () => {
  const summary = summarize((await run()).lines)
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

test("works out chance over each line's own shortlist, however long", async () => {
  const small = bank.filter((phrase) => ['thank-you', 'excuse-me', 'im-cold', 'im-tired'].includes(phrase.id))
  const { chance } = summarize(
    (await scoreLines([{ text: 'Are you cold?', place: 'home', acceptable: ['im-cold'] }], small, {})).lines
  )
  expect(chance.top1).toBeCloseTo(1 / 4, 12)
  expect(chance.top6).toBe(1)
  // (1 + 1/2 + 1/3 + 1/4) / 4
  expect(chance.meanReciprocalRank).toBeCloseTo(25 / 48, 12)
})

test('times the shortlist and each ranker three times per line, leaving out a warm-up pass', async () => {
  let calls = 0
  const slowAtFirst: Ranker = (line, shortlist, index, context) => {
    // 5 ms a line in the first pass only, as code that must be compiled first is slow.
    const until = performance.now() + (calls++ < lines.length ? 5 : 0)
    while (performance.now() < until);
    return keyword(line, shortlist, index, context)
  }
  const { timings } = await scoreLines(lines, bank, { place, slowAtFirst })
  expect(calls).toBe(4 * lines.length)
  expect(timings.shortlist).toHaveLength(3 * lines.length)
  expect(timings.rankers.place).toHaveLength(3 * lines.length)
  expect(timings.rankers.slowAtFirst).toHaveLength(3 * lines.length)
  expect(Math.max(...timings.rankers.slowAtFirst)).toBeLessThan(5)
  for (const ms of [...timings.shortlist, ...timings.rankers.place]) expect(ms).toBeGreaterThanOrEqual(0)
})

test('finds the lines that share no word with a reply besides the fixed buttons, whose words still count', () => {
  const replies: Phrase[] = [
    ...bank.filter((phrase) => phrase.fixed),
    { id: 'water-please', text: 'Water, please', places: ['home'] },
    { id: 'it-went-well', text: 'It went well', places: [] },
    { id: 'im-fine', text: "I'm fine", places: [] }
  ]
  const noWord = (text: string, acceptable: string[]) => sharesNoWord({ text, acceptable }, replies)
  expect(noWord('How was physio?', ['it-went-well'])).toBe(true)
  expect(noWord('Do you want some water?', ['yes', 'no', 'water-please'])).toBe(false)
  expect(noWord('Are you sure?', ['yes', 'im-fine'])).toBe(true)
  expect(noWord('Are you sure?', ['yes', 'not-sure', 'im-fine'])).toBe(false)
  // Only the fixed buttons answer it, so it doesn't count, though it shares no word.
  expect(noWord('Are you cold?', ['yes', 'no'])).toBe(false)
  expect(noWord('Nice weather today.', [])).toBe(false)
})

test("ranks only the phrases a ranker scores above 0, so keyword gets no credit for the place's phrases", async () => {
  const [weather] = (
    await scoreLines([{ text: 'Nice weather today.', place: 'home', acceptable: ['good-morning'] }], bank, {
      place,
      keyword
    })
  ).lines
  expect(weather.rankers.keyword.order).toEqual([])
  expect(weather.rankers.place.order).toEqual([
    'good-morning',
    'water-please',
    'im-cold',
    'good-night',
    'more-please',
    'im-full',
    'im-tired'
  ])
  const { rankers } = summarize([weather])
  expect([rankers.keyword.top6, rankers.place.top1]).toEqual([
    { k: 0, n: 1 },
    { k: 1, n: 1 }
  ])
})

test('waits for each ranking before the next, so one request is in flight, and scores the first timed pass', async () => {
  let inFlight = 0
  let most = 0
  let calls = 0
  const later: Ranker = async (line, shortlist, index, context) => {
    inFlight += 1
    most = Math.max(most, inFlight)
    calls += 1
    await new Promise((resolve) => setTimeout(resolve, 5))
    inFlight -= 1
    // Two rankers over the lines: the first timed pass ranks by keyword, and the warm-up and the later passes by place.
    const firstTimed = calls > 2 * lines.length && calls <= 4 * lines.length
    return (firstTimed ? keyword : place)(line, shortlist, index, context)
  }
  const { lines: scored, timings } = await scoreLines(lines, bank, { later, again: later })
  expect(most).toBe(1)
  expect(timings.rankers.later).toHaveLength(3 * lines.length)
  // A 5 ms wait, counted in the ranking's time; timers may fire a little early against the clock.
  for (const ms of timings.rankers.later) expect(ms).toBeGreaterThanOrEqual(3)
  expect(scored.map(({ rankers }) => rankers.later.outcome)).toEqual([
    'right row',
    'missed reply',
    'right hold',
    'right row',
    'wrong row'
  ])
})

test("gives the paired interval for one ranker's top 6 minus another's, and trails only when it's wholly below 0", async () => {
  const firstPhrase =
    (acceptable: string): Ranker =>
    (_line, shortlist) => ({
      kind: { yes_no: 0, either_or: 0, open: 0, not_a_question: 0 },
      topic: {},
      scores: new Map(shortlist.map((phrase) => [phrase.id, phrase.id === acceptable ? 0.9 : 0.1])),
      onPhone: false
    })
  // Twenty lines whose one acceptable phrase only `right` puts first; `wrong` puts another phrase first and it last.
  const many = Array.from({ length: 20 }, (_, i) => ({ text: `Line ${i}`, place: 'home', acceptable: ['good-night'] }))
  const last: Ranker = (_line, shortlist) => ({
    kind: { yes_no: 0, either_or: 0, open: 0, not_a_question: 0 },
    topic: {},
    scores: new Map(shortlist.map((phrase, i) => [phrase.id, phrase.id === 'good-night' ? 0.01 : 1 - i / 100])),
    onPhone: false
  })
  // And one that puts it seventh, just past the six.
  const seventh: Ranker = (_line, shortlist) => {
    const others = shortlist.filter((phrase) => phrase.id !== 'good-night')
    return {
      kind: { yes_no: 0, either_or: 0, open: 0, not_a_question: 0 },
      topic: {},
      scores: new Map([...others.map((phrase, i) => [phrase.id, 0.9 - i / 100] as const), ['good-night', 0.845]]),
      onPhone: false
    }
  }
  const { lines: scored } = await scoreLines(many, bank, { right: firstPhrase('good-night'), wrong: last, seventh })
  expect(topSixGap(scored, 'wrong', 'right')).toEqual({ difference: -1, low: -1, high: -1, verdict: 'trails' })
  expect(scored[0].rankers.seventh.order.indexOf('good-night')).toBe(6)
  expect(topSixGap(scored, 'seventh', 'right')?.verdict).toBe('trails')
  expect(topSixGap(scored, 'right', 'wrong')).toEqual({ difference: 1, low: 1, high: 1, verdict: 'leads' })
  expect(topSixGap(scored, 'right', 'right')).toEqual({
    difference: 0,
    low: 0,
    high: 0,
    verdict: 'no clear difference'
  })
  // Lines with no acceptable phrase besides the fixed buttons don't count.
  const { lines: fixedOnly } = await scoreLines([lines[3]], bank, { right: firstPhrase('good-night') })
  expect(topSixGap(fixedOnly, 'right', 'right')).toBeNull()
})

test('lists every big button with its ranker, line, and phrase, and whether the phrase is acceptable', async () => {
  const sure = scoring((shortlist) => [[shortlist[0].id, 0.9]])
  const { lines: scored } = await scoreLines(lines, bank, { sure, keyword })
  // The first shortlisted phrase: the one sharing a word, else the place's first.
  expect(bigButtons(scored).map(({ ranker, line, phrase, right }) => [ranker, line.id, phrase, right])).toEqual([
    ['sure', 'water', 'water-please', true],
    ['sure', 'physio', 'excuse-me', false],
    ['sure', 'weather', 'good-morning', false],
    ['sure', 'cold', 'im-cold', false],
    ['sure', 'costs', 'how-much-is-this', false]
  ])
})

test("counts a ranker's most likely kind of question against its writer's, a tie apart", async () => {
  const kinded = [
    { text: 'Do you want some water?', place: 'home', kind: 'yes_no' as const, acceptable: [] },
    { text: 'Tea or coffee?', place: 'home', kind: 'either_or' as const, acceptable: [] },
    { text: 'How was physio?', place: 'home', kind: 'open' as const, acceptable: [] },
    { text: 'Nice weather today.', place: 'home', kind: 'not_a_question' as const, acceptable: [] }
  ]
  // Yes-or-no for "Do", a tie for "Tea", and open for the rest.
  const guess: Ranker = (line) => ({
    kind: {
      yes_no: line.startsWith('Do') ? 0.8 : 0,
      either_or: line.startsWith('Tea') ? 0.5 : 0,
      open: line.startsWith('Tea') ? 0.5 : line.startsWith('Do') ? 0.2 : 0.9,
      not_a_question: 0
    },
    topic: {},
    scores: new Map(),
    onPhone: false
  })
  const { lines: scored } = await scoreLines(kinded, bank, { guess })
  const { counts, right } = kindMatrix(scored, 'guess')
  expect(right).toEqual({ k: 2, n: 4 })
  expect(counts.yes_no).toEqual({ yes_no: 1, either_or: 0, open: 0, not_a_question: 0, tie: 0 })
  expect(counts.either_or).toEqual({ yes_no: 0, either_or: 0, open: 0, not_a_question: 0, tie: 1 })
  expect(counts.open).toEqual({ yes_no: 0, either_or: 0, open: 1, not_a_question: 0, tie: 0 })
  expect(counts.not_a_question).toEqual({ yes_no: 0, either_or: 0, open: 1, not_a_question: 0, tie: 0 })
})

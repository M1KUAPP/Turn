import { describe, expect, test } from 'vitest'
import { applyAnswer, emptyRow, startingPolicy, type Answer, type Row } from '../src/row'

const yesNo = { yes_no: 0.9, either_or: 0.05, open: 0.03, not_a_question: 0.02 }

/** An open question about food, scoring the candidates in the given order. */
const answer = (seq: number, scores: Record<string, number>, rest: Partial<Answer> = {}): Answer =>
  Object.freeze({
    seq,
    kind: { yes_no: 0.1, either_or: 0.1, open: 0.7, not_a_question: 0.1 },
    topic: { food: 0.8, 'body-pain': 0.1, consent: 0.1 },
    scores: new Map(Object.entries(scores)),
    policy: startingPolicy,
    onPhone: false,
    ...rest
  })

/** Runs the answers in order from an empty row, freezing each row so a rule that changes its input fails. */
const replay = (...answers: Answer[]): Row =>
  answers.reduce<Row>(
    (row, next) => applyAnswer(Object.freeze({ ...row, slots: Object.freeze([...row.slots]) }), next),
    emptyRow
  )

describe('applyAnswer', () => {
  test('shows the phrases at or above the floor in a row, highest first (ROW-3)', () => {
    const row = replay(answer(1, { tea: 0.65, water: 0.7, juice: 0.5 }))
    expect(row.big).toBeNull()
    expect(row.slots).toEqual(['water', 'tea', null, null, null, null])
  })

  test('shows a top phrase above the big-button bar as the big button (ROW-3)', () => {
    const row = replay(answer(1, { tea: 0.7, water: 0.9 }))
    expect(row.big).toBe('water')
    expect(row.slots).toEqual([null, null, null, null, null, null])
  })

  test('changes nothing when no phrase reaches the floor (ROW-3)', () => {
    const before = replay(answer(1, { water: 0.7, tea: 0.65 }))
    const after = applyAnswer(before, answer(2, { juice: 0.5, water: 0.4 }))
    expect(after.slots).toEqual(['water', 'tea', null, null, null, null])
    expect(after.big).toBeNull()
    const big = replay(answer(1, { water: 0.9 }), answer(2, { juice: 0.5 }))
    expect(big.big).toBe('water')
  })

  test.each(['body-pain', 'consent'])('gives a %s line a row, never a big button (ROW-3)', (topic) => {
    const row = replay(answer(1, { water: 0.9 }, { topic: { food: 0.1, [topic]: 0.9 } }))
    expect(row.big).toBeNull()
    expect(row.slots).toEqual(['water', null, null, null, null, null])
  })

  test('drops an answer for a line older than the newest (ROW-7)', () => {
    const row = replay(answer(2, { water: 0.7 }))
    expect(row.seq).toBe(2)
    expect(applyAnswer(row, answer(1, { tea: 0.9 }))).toBe(row)
    // The app raises seq when a line starts, so an older answer loses before the new line's arrives.
    const started = { ...row, seq: 3 }
    expect(applyAnswer(started, answer(2, { tea: 0.9 }))).toBe(started)
  })

  test('puts Yes, No, and Not sure in slots 1 to 3 for a yes-or-no question, and never a big button (ROW-4)', () => {
    const row = replay(answer(1, { water: 0.95, tea: 0.7 }, { kind: yesNo }))
    expect(row.big).toBeNull()
    expect(row.slots).toEqual(['yes', 'no', 'not-sure', 'water', 'tea', null])
  })

  test('shows only the fixed buttons for a topic that gets nothing else (EVAL-5)', () => {
    const policy = { ...startingPolicy, fixedOnlyTopics: ['body-pain'] }
    const row = replay(answer(1, { water: 0.95 }, { topic: { 'body-pain': 0.9, food: 0.1 }, policy }))
    expect(row.big).toBeNull()
    expect(row.slots).toEqual(['yes', 'no', 'not-sure', null, null, null])
  })

  test("frees the fixed buttons' slots when the next line is no yes-or-no question", () => {
    const row = replay(answer(1, { water: 0.7, tea: 0.7 }, { kind: yesNo }), answer(2, { juice: 0.7 }))
    expect(row.slots).toEqual(['juice', null, null, 'water', 'tea', null])
  })

  describe('keeps shown phrases in their slots (ROW-5)', () => {
    const six = answer(1, { a: 0.8, b: 0.75, c: 0.7, d: 0.7, e: 0.65, f: 0.62 })

    test('moves nothing for a shift smaller than the margin', () => {
      const row = replay(six, answer(2, { f: 0.78, e: 0.76, g: 0.75, c: 0.66, d: 0.66, b: 0.64, a: 0.62 }))
      expect(row.slots).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
    })

    test('lets a phrase that beats the lowest shown by the margin take only its slot', () => {
      const row = replay(six, answer(2, { g: 0.8, a: 0.8, b: 0.75, c: 0.7, d: 0.7, e: 0.65, f: 0.62 }))
      expect(row.slots).toEqual(['a', 'b', 'c', 'd', 'e', 'g'])
    })

    test('keeps stale phrases until a phrase needs their slot, then the lowest-scoring goes', () => {
      // Just below the floor, so only the stale rule, not the margin, frees their slots.
      const stale = { a: 0.7, b: 0.55, c: 0.7, d: 0.5, e: 0.7, f: 0.7 }
      const kept = replay(six, answer(2, stale))
      expect(kept.slots).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
      const row = replay(six, answer(2, stale), answer(3, { ...stale, g: 0.61 }))
      expect(row.slots).toEqual(['a', 'b', 'c', 'g', 'e', 'f'])
    })

    test("brings the big button's phrase back into a free slot first, over the slots it covered", () => {
      const all = { a: 0.7, b: 0.7, c: 0.7, d: 0.7, e: 0.7, f: 0.7 }
      const afterBig = (w: number) =>
        replay(answer(1, all), answer(2, { w: 0.9 }), answer(3, { x: 0.75, ...all, b: 0.55, w }))
      expect(afterBig(0.65)).toMatchObject({ big: null, slots: ['a', 'w', 'c', 'd', 'e', 'f'] })
      expect(afterBig(0.5)).toMatchObject({ big: null, slots: ['a', 'x', 'c', 'd', 'e', 'f'] })
    })
  })

  test('returns the topic at or above the floor for its tab, and none below it (ROW-9)', () => {
    expect(replay(answer(1, { water: 0.7 })).tab).toBe('food')
    expect(replay(answer(1, { water: 0.7 }, { topic: { food: 0.5, drinks: 0.3, consent: 0.2 } })).tab).toBeNull()
    // Even an answer that leaves the row as it is marks its topic.
    const held = replay(
      answer(1, { water: 0.7 }),
      answer(2, { juice: 0.4 }, { topic: { 'body-pain': 0.7, food: 0.3 } })
    )
    expect(held).toMatchObject({ tab: 'body-pain', slots: ['water', null, null, null, null, null] })
  })
})

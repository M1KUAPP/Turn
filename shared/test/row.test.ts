import { describe, expect, test } from 'vitest'
import { applyAnswer, clearRow, emptyRow, phrasesInRow, startingPolicy, type Answer, type Row } from '../src/row'

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

  test('says which line the row still answers after a hold (ROW-3)', () => {
    const shown = replay(answer(1, { water: 0.7 }))
    expect(shown.answers).toBe(1)
    expect(applyAnswer(shown, answer(2, { juice: 0.4 }))).toMatchObject({ seq: 2, answers: 1 })
    // An answer that fits but moves nothing isn't a hold.
    expect(applyAnswer(shown, answer(2, { water: 0.7 }))).toMatchObject({ seq: 2, answers: 2, slots: shown.slots })
  })

  test.each(['body-pain', 'consent'])('gives a %s line a row, never a big button (ROW-3)', (topic) => {
    const row = replay(answer(1, { water: 0.9 }, { topic: { food: 0.1, [topic]: 0.9 } }))
    expect(row.big).toBeNull()
    expect(row.slots).toEqual(['water', null, null, null, null, null])
  })

  test("gives the phone's own ranking a row, never a big button, whatever its scores (STATE-1)", () => {
    const row = replay(answer(1, { water: 1, tea: 0 }, { topic: {}, onPhone: true }))
    expect(row).toMatchObject({ big: null, slots: ['water', null, null, null, null, null] })
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

  test('shows only the fixed buttons for a topic that gets nothing else, even after a full row (EVAL-5)', () => {
    const policy = { ...startingPolicy, fixedOnlyTopics: ['body-pain'] }
    const full = answer(1, { a: 0.7, b: 0.7, c: 0.7, d: 0.7, e: 0.7, f: 0.7 })
    const row = replay(full, answer(2, { water: 0.95, d: 0.7 }, { topic: { 'body-pain': 0.9, food: 0.1 }, policy }))
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

    test.each([
      [0.67, 0.82, 0.15],
      [0.6, 0.7, 0.1]
    ])('lets a phrase beat %s by exactly the margin with %s at a margin of %s', (low, high, margin) => {
      const policy = { ...startingPolicy, margin }
      const row = replay(
        answer(1, { a: 0.8, b: 0.8, c: 0.8, d: 0.8, e: 0.8, f: low }, { policy }),
        answer(2, { g: high, a: 0.8, b: 0.8, c: 0.8, d: 0.8, e: 0.8, f: low }, { policy })
      )
      expect(row.slots).toEqual(['a', 'b', 'c', 'd', 'e', 'g'])
    })

    test('never swaps phrases of equal score, even with no margin', () => {
      const all = { a: 0.7, b: 0.7, c: 0.7, d: 0.7, e: 0.7, f: 0.7 }
      const policy = { ...startingPolicy, margin: 0 }
      const row = replay(answer(1, all, { policy }), answer(2, { ...all, g: 0.7, h: 0.7 }, { policy }))
      expect(row.slots).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
    })

    test('keeps stale phrases until a phrase needs their slot, then the lowest-scoring goes', () => {
      // Just below the floor, so only the stale rule, not the margin, frees their slots.
      const stale = { a: 0.7, b: 0.55, c: 0.7, d: 0.5, e: 0.7, f: 0.7 }
      const kept = replay(six, answer(2, stale))
      expect(kept.slots).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
      const row = replay(six, answer(2, stale), answer(3, { ...stale, g: 0.61 }))
      expect(row.slots).toEqual(['a', 'b', 'c', 'g', 'e', 'f'])
    })

    test("leaves the big button's phrase in the slot it already holds", () => {
      const row = replay(answer(1, { a: 0.7, b: 0.7 }), answer(2, { a: 0.9 }), answer(3, { a: 0.7, b: 0.7, c: 0.65 }))
      expect(row.slots).toEqual(['a', 'b', 'c', null, null, null])
    })

    test("brings the big button's phrase back beside the fixed buttons, ahead of higher phrases", () => {
      const row = replay(answer(1, { w: 0.9 }), answer(2, { x: 0.8, w: 0.7 }, { kind: yesNo }))
      expect(row.slots).toEqual(['yes', 'no', 'not-sure', 'w', 'x', null])
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

describe('the policy each answer carries (ROW-8)', () => {
  const with_ = (policy: Partial<typeof startingPolicy>) => ({ policy: { ...startingPolicy, ...policy } })

  test('moves the big-button bar, the floor, and the margin', () => {
    expect(replay(answer(1, { water: 0.9 }, with_({ bigAbove: 0.95 })))).toMatchObject({ big: null })
    expect(replay(answer(1, { water: 0.5 }, with_({ floor: 0.4 }))).slots[0]).toBe('water')
    const six = answer(1, { a: 0.8, b: 0.75, c: 0.7, d: 0.7, e: 0.65, f: 0.62 })
    const next = { g: 0.8, a: 0.8, b: 0.75, c: 0.7, d: 0.7, e: 0.65, f: 0.62 }
    expect(replay(six, answer(2, next, with_({ margin: 0.2 }))).slots).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
  })

  test('can keep phrases from beside the fixed buttons', () => {
    const row = replay(answer(1, { water: 0.7 }, { kind: yesNo, ...with_({ yesNoPhrases: false }) }))
    expect(row.slots).toEqual(['yes', 'no', 'not-sure', null, null, null])
  })

  test('changes which topics never get a big button and which get only the fixed buttons', () => {
    const pain = { topic: { 'body-pain': 0.9, food: 0.1 } }
    expect(replay(answer(1, { water: 0.9 }, { ...pain, ...with_({ noBigTopics: [] }) })).big).toBe('water')
    const food = replay(answer(1, { water: 0.9 }, with_({ fixedOnlyTopics: ['food'] })))
    expect(food).toMatchObject({ big: null, slots: ['yes', 'no', 'not-sure', null, null, null] })
  })

  test('counts a line as yes-or-no only when that kind is the most likely, even under a low floor', () => {
    const kind = { yes_no: 0.35, either_or: 0.05, open: 0.55, not_a_question: 0.05 }
    const row = replay(answer(1, { water: 0.7 }, { kind, ...with_({ floor: 0.3 }) }))
    expect(row.slots).toEqual(['water', null, null, null, null, null])
  })
})

describe('clearRow', () => {
  test('empties the six slots and forgets the remembered big phrase (ROW-10)', () => {
    const cleared = clearRow(replay(answer(1, { a: 0.7, b: 0.7 }), answer(2, { w: 0.9 })))
    expect(cleared).toEqual({ seq: 2, answers: 2, big: null, slots: [null, null, null, null, null, null], tab: null })
    // Remembered, w would come first; forgotten, it takes its turn.
    expect(applyAnswer(cleared, answer(3, { x: 0.7, w: 0.65 })).slots).toEqual(['x', 'w', null, null, null, null])
  })
})

describe('phrasesInRow', () => {
  test("lists the big button's phrase, then the slots', and never a fixed button", () => {
    const row = replay(answer(1, { a: 0.7, b: 0.7 }, { kind: yesNo }), answer(2, { w: 0.9 }))
    expect(row.slots).toEqual(['yes', 'no', 'not-sure', 'a', 'b', null])
    expect(phrasesInRow(row)).toEqual(['w', 'a', 'b'])
  })
})

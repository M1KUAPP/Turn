import { describe, expect, test } from 'vitest'
import { applyAnswer, emptyRow, startingPolicy, type Answer, type Row } from '../src/row'

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
})

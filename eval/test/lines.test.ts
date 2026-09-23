import { expect, test } from 'vitest'
import { lines, type Line } from '../src/data'

const count = (keep: (line: Line) => boolean) => lines.filter(keep).length

test('holds 80 lines, each with every field (EVAL-1)', () => {
  expect(lines).toHaveLength(80)
  expect(new Set(lines.map((line) => line.id)).size).toBe(80)
  for (const line of lines) {
    expect(line.author, line.id).toMatch(/\S/)
    expect(line.text, line.id).toMatch(/\S/)
    expect(line.text, line.id).toBe(line.text.trim())
    expect(line.text.length, line.id).toBeLessThanOrEqual(300)
    expect(line.kind, line.id).toBeOneOf(['yes_no', 'either_or', 'open', 'not_a_question'])
    expect(line.place, line.id).toBeOneOf(['home', 'clinic', 'shop', 'out'])
    expect(line.topic, line.id).toMatch(/^[a-z]+( [a-z]+)*$/)
    for (const concern of line.concerns) expect(concern, line.id).toBeOneOf(['pain', 'health', 'consent'])
    expect(new Set(line.concerns).size, line.id).toBe(line.concerns.length)
  }
})

test('has at least 24 yes-or-no, 8 pain or health, and 4 consent lines (EVAL-1)', () => {
  expect(count((line) => line.kind === 'yes_no')).toBeGreaterThanOrEqual(24)
  expect(count((line) => line.concerns.includes('pain') || line.concerns.includes('health'))).toBeGreaterThanOrEqual(8)
  expect(count((line) => line.concerns.includes('consent'))).toBeGreaterThanOrEqual(4)
})

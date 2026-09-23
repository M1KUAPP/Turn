import { readFileSync } from 'node:fs'
import { expect, test } from 'vitest'

type Line = {
  id: string
  author: string
  text: string
  kind: string
  place: string
  topic: string
  concerns: string[]
}

const lines: Line[] = readFileSync(new URL('../lines.jsonl', import.meta.url), 'utf8')
  .trim()
  .split('\n')
  .map((row) => JSON.parse(row))

const count = (keep: (line: Line) => boolean) => lines.filter(keep).length

test('holds 80 lines, each with every field (EVAL-1)', () => {
  expect(lines).toHaveLength(80)
  expect(new Set(lines.map((line) => line.id)).size).toBe(80)
  for (const line of lines) {
    expect(line.author, line.id).toMatch(/\S/)
    expect(line.text, line.id).toMatch(/\S/)
    expect(line.text, line.id).toBe(line.text.trim())
    expect(line.text.length, line.id).toBeLessThanOrEqual(300)
    expect(['yes_no', 'either_or', 'open', 'not_a_question'], line.id).toContain(line.kind)
    expect(['home', 'clinic', 'shop', 'out'], line.id).toContain(line.place)
    expect(line.topic, line.id).toMatch(/^[a-z]+( [a-z]+)*$/)
    expect(['pain', 'health', 'consent'], line.id).toEqual(expect.arrayContaining(line.concerns))
    expect(new Set(line.concerns).size, line.id).toBe(line.concerns.length)
  }
})

test('has the yes-or-no, pain or health, and consent lines EVAL-1 counts', () => {
  expect(count((line) => line.kind === 'yes_no')).toBeGreaterThanOrEqual(24)
  expect(count((line) => line.concerns.includes('pain') || line.concerns.includes('health'))).toBeGreaterThanOrEqual(8)
  expect(count((line) => line.concerns.includes('consent'))).toBeGreaterThanOrEqual(4)
})

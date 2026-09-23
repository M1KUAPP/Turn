import { expect, test } from 'vitest'
import { bank, checkLabels, phrasesOf, readRows, type Line } from '../src/data'

const fixture = (name: string) => new URL(`fixture/${name}`, import.meta.url)

test('reads a JSON Lines file from a URL or a path', () => {
  const lines: Line[] = readRows(fixture('lines.jsonl'))
  expect(lines.map(({ id }) => id)).toEqual(Array.from({ length: 8 }, (_, i) => `fixture-${i + 1}`))
  expect(lines[0]).toMatchObject({ labeler: 'test-labeler-1', acceptable: ['yes', 'no', 'water-please'] })
  expect(readRows(fixture('second-labeling.jsonl').pathname)).toHaveLength(8)
})

test("gives the bank's phrases in the grid's order, marking the fixed buttons and the strip's five", () => {
  const phrases = phrasesOf(bank)
  expect(phrases).toHaveLength(159)
  expect(phrases.slice(0, 4).map(({ id, fixed }) => [id, fixed])).toEqual([
    ['yes', true],
    ['no', true],
    ['not-sure', true],
    ['i-dont-know', false]
  ])
  expect(phrases.filter(({ strip }) => strip).map(({ text }) => text)).toEqual([
    "Wait, I'm typing",
    'Sorry, say that again',
    'And you?',
    'I use this app to talk. Please give me time.',
    "Something's wrong"
  ])
  expect(phrases.find(({ id }) => id === 'water-please')?.places).toEqual(['home'])
})

test('accepts labels that name phrases in the bank, and names the first line whose labels are missing or unknown', () => {
  expect(() => checkLabels(readRows(fixture('lines.jsonl')), bank)).not.toThrow()
  expect(() => checkLabels([{ id: 'line-01', acceptable: ['yes'] }, { id: 'line-02' }], bank)).toThrow(
    'line-02 lists no acceptable replies'
  )
  expect(() => checkLabels([{ id: 'line-03', acceptable: ['yes', 'water-plz'] }], bank)).toThrow(
    "line-03 lists water-plz, which the starter bank doesn't hold"
  )
})

import { expect, test } from 'vitest'
import { pickShortlist, PhraseIndex, type Phrase } from '../src/shortlist'

// A fixed vocabulary and fixed strides, so every run times the same bank and lines.
const vocabulary = Array.from({ length: 400 }, (_, i) => `word${i}`)
const words = (seed: number, n: number) =>
  Array.from({ length: n }, (_, j) => vocabulary[(seed * 31 + j * 97) % vocabulary.length])

const bank: Phrase[] = Array.from({ length: 2000 }, (_, i) => ({
  id: `p${i}`,
  text: ['I', ...words(i, 3 + (i % 6)), 'please'].join(' '),
  places: i % 5 === 0 ? ['home'] : []
}))
const taps = new Map(Array.from({ length: 300 }, (_, i) => [`p${i * 7}`, 1 + (i % 9)]))
const lines = Array.from({ length: 50 }, (_, i) => `Do you want ${words(i * 13 + 5, 4).join(' ')}?`)

test('picks a shortlist from 2,000 phrases within 50 ms (BANK-7, PERF-4)', () => {
  const index = new PhraseIndex()
  index.update(bank) // at launch
  const context = { bank, row: ['p1', 'p2'], place: 'home', taps }
  const times = lines.map((line) => {
    const start = Date.now()
    const shortlist = pickShortlist(line, index, context)
    const time = Date.now() - start
    expect(shortlist).toHaveLength(40)
    return time
  })
  expect(Math.max(...times)).toBeLessThanOrEqual(50)
})

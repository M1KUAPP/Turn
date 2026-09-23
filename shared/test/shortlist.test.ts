import { describe, expect, test } from 'vitest'
import { pickShortlist, PhraseIndex, type Context, type Phrase } from '../src/shortlist'

const phrase = (id: string, text: string, places: string[] = []): Phrase => ({ id, text, places })

/** Phrases that share no word with each other or with the tests' lines. */
const plain = (...ids: string[]) => ids.map((id) => phrase(id, `Plain ${id}`))

const ids = (phrases: readonly Phrase[]) => phrases.map((p) => p.id)

const range = (from: number, to: number) =>
  Array.from({ length: Math.abs(to - from) + 1 }, (_, i) => (from <= to ? from + i : from - i))

const pick = (line: string, context: Partial<Context> & Pick<Context, 'bank'>) =>
  ids(pickShortlist(line, new PhraseIndex(), { row: [], place: 'home', taps: new Map(), ...context }))

describe('PhraseIndex', () => {
  test('matches the phrases that share a word with the line, best first', () => {
    const index = new PhraseIndex()
    index.update([
      phrase('water-please', 'Water, please'),
      phrase('want-water', 'I want some water now'),
      phrase('hard', 'It was hard')
    ])
    expect(index.match('Do you want some water?')).toEqual(['want-water', 'water-please'])
  })

  test('drops common words, so a line made of them matches nothing', () => {
    const index = new PhraseIndex()
    index.update([phrase('that', 'What is that?'), phrase('this-one', 'This one')])
    expect(index.match('What is this?')).toEqual([])
  })

  test('reads a contraction as common words, with either apostrophe', () => {
    const index = new PhraseIndex()
    index.update([phrase('mind', "I don't mind"), phrase('know', 'I don’t know')])
    expect(index.match('Don’t you?')).toEqual([])
    expect(index.match("Don't you mind?")).toEqual(['mind'])
  })

  test('follows every change to the bank', () => {
    const index = new PhraseIndex()
    index.update([phrase('drink', 'Water, please'), phrase('tired', "I'm tired"), phrase('cold', "I'm cold")])
    index.update([phrase('drink', 'Juice, please'), phrase('cold', "I'm cold"), phrase('hungry', "I'm hungry")])
    expect(index.match('water')).toEqual([])
    expect(index.match('juice')).toEqual(['drink'])
    expect(index.match('tired')).toEqual([])
    expect(index.match('hungry')).toEqual(['hungry'])
    expect(index.match('cold')).toEqual(['cold'])
  })

  test("never matches the fixed buttons or the strip's phrases", () => {
    const index = new PhraseIndex()
    index.update([
      { ...phrase('yes', 'Yes'), fixed: true },
      { ...phrase('say-again', 'Sorry, say that again'), strip: true },
      phrase('what-say', 'What did you say?')
    ])
    expect(index.match('Yes, say it')).toEqual(['what-say'])
  })
})

describe('pickShortlist', () => {
  test("puts the row's phrases first, in the row's order", () => {
    expect(pick('Hello there', { bank: plain('a', 'b', 'c', 'd'), row: ['c', 'a'] })).toEqual(['c', 'a', 'b', 'd'])
  })

  test('then up to 24 phrases that share a word with the line, best first', () => {
    // Shorter phrases score higher, so w00 comes first, though the grid lists it last.
    const w = (i: number) => `w${String(i).padStart(2, '0')}`
    const words = (n: number) => Array.from({ length: n }, (_, i) => `x${i}`)
    const water = range(29, 0).map((i) => phrase(w(i), ['Water', ...words(i)].join(' ')))
    expect(pick('Some water?', { bank: [...plain('a', 'b'), ...water], row: ['b'] })).toEqual([
      'b',
      ...range(0, 23).map(w),
      'a',
      ...range(29, 24).map(w)
    ])
  })

  test("fills up to 40 with the rest by taps, then the grid's order", () => {
    const p = (i: number) => `p${String(i).padStart(2, '0')}`
    const taps = new Map([
      [p(30), 2],
      [p(10), 5],
      [p(44), 1]
    ])
    expect(pick('Hello there', { bank: plain(...range(0, 44).map(p)), taps })).toEqual(
      [10, 30, 44, ...range(0, 9), ...range(11, 29), ...range(31, 38)].map(p)
    )
  })

  test("takes up to 8 of the place's phrases after the keyword matches", () => {
    const home = ['h00', 'h01', 'h02', 'h03', 'h04', 'h05', 'h06', 'h07', 'h08', 'h09', 'h10', 'h11']
    const bank = [...plain('o00', 'o01', 'o02'), ...home.map((id) => phrase(id, `Plain ${id}`, ['home']))]
    expect(pick('Hello there', { bank })).toEqual([...home.slice(0, 8), 'o00', 'o01', 'o02', ...home.slice(8)])
  })

  test("takes up to 8 of the most-tapped before the place's, which come most-tapped first", () => {
    const o = (i: number) => `o${String(i).padStart(2, '0')}`
    const home = ['h00', 'h01', 'h02', 'h03']
    const bank = [...plain(...range(0, 11).map(o)), ...home.map((id) => phrase(id, `Plain ${id}`, ['home']))]
    const taps = new Map<string, number>([...range(2, 11).map((i): [string, number] => [o(i), i + 1]), ['h02', 1]])
    expect(pick('Hello there', { bank, taps })).toEqual([
      ...range(11, 4).map(o),
      'h02',
      'h00',
      'h01',
      'h03',
      ...[3, 2, 0, 1].map(o)
    ])
  })

  test("never holds the fixed buttons or the strip's phrases, wherever they'd qualify", () => {
    const bank = [
      { ...phrase('yes', 'Yes', ['home']), fixed: true },
      { ...phrase('say-again', 'Sorry, say that again', ['home']), strip: true },
      ...plain('a', 'b')
    ]
    const taps = new Map([
      ['yes', 9],
      ['say-again', 9]
    ])
    expect(pick('Yes, say that again', { bank, taps, row: ['yes', 'say-again', 'a'] })).toEqual(['a', 'b'])
  })

  test('holds each phrase once, and one already taken leaves a later step its places', () => {
    const w = (i: number) => `w${String(i).padStart(2, '0')}`
    const words = (n: number) => Array.from({ length: n }, (_, i) => `x${i}`)
    const water = range(23, 0).map((i) => phrase(w(i), ['Water', ...words(i)].join(' ')))
    const bank = [phrase('r', 'Water, please', ['home']), ...plain('a'), ...water]
    expect(pick('Some water?', { bank, row: ['r'], taps: new Map([['r', 3]]) })).toEqual([
      'r',
      ...range(0, 23).map(w),
      'a'
    ])
  })

  test('takes a phrase no line has suggested among the most-tapped once it has the taps (BANK-6)', () => {
    const p = (i: number) => `p${String(i).padStart(2, '0')}`
    const bank = [phrase('water', 'Water, please'), ...plain(...range(0, 57).map(p)), phrase('late', 'Plain late')]
    expect(pick('Some water?', { bank })).not.toContain('late')
    expect(pick('Some water?', { bank, taps: new Map([['late', 3]]) }).slice(0, 2)).toEqual(['water', 'late'])
  })
})

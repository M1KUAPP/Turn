import { applyAnswer, emptyRow, startingPolicy, type Ranking } from '@turn/shared/row'
import { PhraseIndex, type Context, type Phrase } from '@turn/shared/shortlist'
import { expect, test } from 'vitest'
import { keyword, place } from '../src/rankers'

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
  { id: 'wait-im-typing', text: "Wait, I'm typing", places: [], strip: true }
]
const home: Context = { bank, row: [], place: 'home', taps: new Map() }
const rankable = bank.filter((phrase) => !phrase.fixed && !phrase.strip)
const answer = (ranking: Ranking) => applyAnswer(emptyRow, { ...ranking, seq: 1, policy: startingPolicy })

test("ranks the shortlist's phrases at the place first, each group in the bank's order, whatever the line", () => {
  const shortlist = rankable.filter((phrase) => phrase.id !== 'im-full').toReversed()
  const ranking = place('Do you want some water?', shortlist, new PhraseIndex(), home)
  expect([...ranking.scores]).toEqual([
    ['good-morning', 1],
    ['water-please', 1],
    ['im-cold', 1],
    ['good-night', 1],
    ['more-please', 1],
    ['im-tired', 1],
    ['thank-you', 0],
    ['excuse-me', 0]
  ])
})

test("shows the place's first six phrases, never a big button or the fixed buttons, even on a yes-or-no line", () => {
  const row = answer(place('Do you want some water?', rankable, new PhraseIndex(), home))
  expect(row.big).toBeNull()
  expect(row.slots).toEqual(['good-morning', 'water-please', 'im-cold', 'good-night', 'more-please', 'im-full'])
  expect(row.tab).toBeNull()
})

test("ranks by keyword as the phone's own ranking does: shared words first, a yes-or-no kind, no big button", () => {
  const ranking = keyword('Do you want some water?', rankable, new PhraseIndex(), home)
  expect(ranking.scores.get('water-please')).toBe(1)
  expect([...ranking.scores.values()].filter((score) => score > 0)).toHaveLength(1)
  expect(ranking.kind.yes_no).toBe(1)
  expect(answer(ranking).slots).toEqual(['yes', 'no', 'not-sure', 'water-please', null, null])
})

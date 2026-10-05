import { applyAnswer, emptyRow, startingPolicy, type Ranking } from '@turn/shared/row'
import { PhraseIndex, rankable, type Context, type Phrase } from '@turn/shared/shortlist'
import { expect, test } from 'vitest'
import { keyword, place } from '../src/rankers'
import { smallBank, waitImTyping } from './small-bank'

const bank: Phrase[] = [...smallBank, waitImTyping]
const home: Context = { bank, row: [], place: 'home', taps: new Map() }
const toRank = bank.filter(rankable)
const answer = (ranking: Ranking) => applyAnswer(emptyRow, { ...ranking, seq: 1, policy: startingPolicy })

test("ranks the shortlist's phrases at the place first, each group in the bank's order, whatever the line", () => {
  const shortlist = toRank.filter((phrase) => phrase.id !== 'im-full').toReversed()
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
  const row = answer(place('Do you want some water?', toRank, new PhraseIndex(), home))
  expect(row.big).toBeNull()
  expect(row.slots).toEqual(['good-morning', 'water-please', 'im-cold', 'good-night', 'more-please', 'im-full'])
  expect(row.tab).toBeNull()
})

test("ranks by keyword as the phone's own ranking does: shared words first, a yes-or-no kind, no big button", () => {
  const ranking = keyword('Do you want some water?', toRank, new PhraseIndex(), home)
  expect(ranking.scores.get('water-please')).toBe(1)
  expect([...ranking.scores.values()].filter((score) => score > 0)).toHaveLength(1)
  expect(ranking.kind.yes_no).toBe(1)
  expect(answer(ranking).slots).toEqual(['yes', 'no', 'not-sure', 'water-please', null, null])
})

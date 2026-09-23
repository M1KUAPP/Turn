import { describe, expect, test } from 'vitest'
import { PhraseIndex, type Phrase } from '../src/shortlist'

const phrase = (id: string, text: string, places: string[] = []): Phrase => ({ id, text, places })

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

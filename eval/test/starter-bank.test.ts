import { readFileSync } from 'node:fs'
import { expect, test } from 'vitest'

type Phrase = { id: string; text: string; fixed: boolean; places: string[] }
type Category = { id: string; name: string; fixed: boolean; phrases: Phrase[] }
type StarterBank = { categories: Category[]; places: { id: string; name: string }[] }

const bank: StarterBank = JSON.parse(
  readFileSync(new URL('../../app/src/content/starter-bank.json', import.meta.url), 'utf8')
)
const phrases = bank.categories.flatMap((category) => category.phrases)
const categoryById = (id: string) => bank.categories.find((category) => category.id === id)
const phraseTexts = (categoryId: string) => categoryById(categoryId)?.phrases.map((phrase) => phrase.text)
const phraseByText = (text: string) => phrases.find((phrase) => phrase.text === text)
const slug = /^[a-z0-9]+(-[a-z0-9]+)*$/

test('follows the starter-bank format', () => {
  const ids = [...bank.categories, ...phrases].map((item) => item.id)
  expect(new Set(ids).size).toBe(ids.length)
  for (const id of ids) expect(id).toMatch(slug)
  for (const { name } of bank.categories) expect(name).toMatch(/^\S(.{0,38}\S)?$/)
  for (const { text } of phrases) expect(text).toMatch(/^\S(.*\S)?$/)
  const lowered = phrases.map(({ text }) => text.toLowerCase())
  expect(new Set(lowered).size).toBe(lowered.length)
  const placeIds = bank.places.map((place) => place.id)
  for (const { id, places } of phrases) {
    expect(placeIds, id).toEqual(expect.arrayContaining(places))
    expect(new Set(places).size, id).toBe(places.length)
  }
})

test('holds 140 to 160 phrases in about ten categories, none over 120 characters (CONTENT-1)', () => {
  expect(phrases.length).toBeGreaterThanOrEqual(140)
  expect(phrases.length).toBeLessThanOrEqual(160)
  expect(bank.categories.length).toBeGreaterThanOrEqual(9)
  expect(bank.categories.length).toBeLessThanOrEqual(11)
  for (const { id, text } of phrases) expect(text.length, id).toBeLessThanOrEqual(120)
})

test('starts with Home, Clinic, Shop, and Out, each with at least ten phrases (CONTENT-2)', () => {
  expect(bank.places).toEqual([
    { id: 'home', name: 'Home' },
    { id: 'clinic', name: 'Clinic' },
    { id: 'shop', name: 'Shop' },
    { id: 'out', name: 'Out' }
  ])
  for (const { id } of bank.places) {
    expect(phrases.filter(({ places }) => places.includes(id)).length, id).toBeGreaterThanOrEqual(10)
  }
})

test('marks Quick, the strip, and body-pain fixed, as the data model does (BANK-5, SPEAK-7)', () => {
  expect(bank.categories[0]?.id).toBe('quick')
  expect(phraseTexts('quick')).toEqual(['Yes', 'No', 'Not sure', "I don't know", 'I have something to say'])
  expect(phraseTexts('strip')).toEqual([
    "Wait, I'm typing",
    'Sorry, say that again',
    'And you?',
    'I use this app to talk. Please give me time.',
    "Something's wrong"
  ])
  expect(bank.categories.filter(({ fixed }) => fixed).map(({ id }) => id)).toEqual(
    expect.arrayContaining(['quick', 'body-pain', 'strip'])
  )
  expect(bank.categories.filter(({ fixed }) => fixed)).toHaveLength(3)
  expect(phrases.filter(({ fixed }) => fixed).map(({ text }) => text)).toEqual(['Yes', 'No', 'Not sure'])
})

test('holds the phrases other checks name', () => {
  expect(phraseByText('It was hard')?.places).toContain('clinic')
  expect(phraseByText('Water, please')?.places).toContain('home')
  expect(categoryById('food')).toBeDefined()
  expect(phrases.some(({ text }) => /\btired\b/i.test(text))).toBe(true)
})

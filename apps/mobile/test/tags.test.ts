import { describe, expect, test } from 'vitest'
import { limits } from '@turn/shared/relay'
import { fitRequest, tagRequest } from '../src/listen/tags'

type TestSpan = { kind: 'person' | 'place' | 'org'; start: number; end: number }

const fakeFinder = (byText: Record<string, TestSpan[]>) => async (texts: readonly string[]) =>
  texts.map((text) => byText[text] ?? [])

const requestInput = (overrides: Record<string, unknown> = {}) => ({
  line: 'Did Anna call?',
  place: 'Home',
  categories: [{ id: 'category-1', name: 'People' }],
  candidates: [{ id: 'phrase-1', text: 'Anna is my sister' }],
  spares: [],
  ...overrides
})

const lineRequest = (candidates: { id: string; text: string }[]) => ({
  lineId: 'line-1',
  seq: 1,
  line: 'Did you call?',
  place: 'Home',
  categories: [],
  candidates
})

const hasLoneSurrogate = (text: string) => {
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = text.charCodeAt(i + 1)
      if (next < 0xdc00 || next > 0xdfff) return true
      i++
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      return true
    }
  }
  return false
}

describe('tagRequest', () => {
  test('uses the same person tag in the partner line and a candidate', async () => {
    const result = await tagRequest(
      requestInput(),
      fakeFinder({
        'Did Anna call?': [{ kind: 'person', start: 4, end: 8 }],
        'Anna is my sister': [{ kind: 'person', start: 0, end: 4 }]
      })
    )

    expect(result.line).toBe('Did [PERSON 1] call?')
    expect(result.candidates).toEqual([{ id: 'phrase-1', text: '[PERSON 1] is my sister' }])
    expect(JSON.stringify(result)).not.toContain('Anna')
  })

  test('matches a name by kind, ignoring case and extra whitespace', async () => {
    const result = await tagRequest(
      requestInput({ line: 'Did anna   lee call?', candidates: [{ id: 'phrase-1', text: 'Anna Lee is here' }] }),
      fakeFinder({
        'Did anna   lee call?': [{ kind: 'person', start: 4, end: 14 }],
        'Anna Lee is here': [{ kind: 'person', start: 0, end: 8 }]
      })
    )

    expect(result.line).toBe('Did [PERSON 1] call?')
    expect(result.candidates[0].text).toBe('[PERSON 1] is here')
  })

  test('numbers each kind by first appearance across candidates, categories, then place', async () => {
    const result = await tagRequest(
      requestInput({
        line: 'Anna met Bob',
        place: 'Acme Clinic',
        categories: [
          { id: 'one', name: 'Mercy Hospital' },
          { id: 'two', name: 'Main Street' }
        ],
        candidates: [
          { id: 'first', text: 'Bob works at Mercy Hospital' },
          { id: 'second', text: 'Acme Clinic called' }
        ]
      }),
      fakeFinder({
        'Anna met Bob': [
          { kind: 'person', start: 0, end: 4 },
          { kind: 'person', start: 9, end: 12 }
        ],
        'Bob works at Mercy Hospital': [
          { kind: 'person', start: 0, end: 3 },
          { kind: 'place', start: 13, end: 27 }
        ],
        'Acme Clinic called': [{ kind: 'org', start: 0, end: 11 }],
        'Mercy Hospital': [{ kind: 'place', start: 0, end: 14 }],
        'Main Street': [{ kind: 'place', start: 0, end: 11 }],
        'Acme Clinic': [{ kind: 'org', start: 0, end: 11 }]
      })
    )

    expect(result.line).toBe('[PERSON 1] met [PERSON 2]')
    expect(result.candidates).toEqual([
      { id: 'first', text: '[PERSON 2] works at [PLACE 1]' },
      { id: 'second', text: '[ORG 1] called' }
    ])
    expect(result.categories).toEqual([
      { id: 'one', name: '[PLACE 1]' },
      { id: 'two', name: '[PLACE 2]' }
    ])
    expect(result.place).toBe('[ORG 1]')
  })

  test('tags before keeping the line’s last 300 code points', async () => {
    const line = `${'A'.repeat(395)}Anna?`
    const result = await tagRequest(
      requestInput({ line }),
      fakeFinder({ [line]: [{ kind: 'person', start: 395, end: 399 }] })
    )

    expect(result.line).toBe(`${'A'.repeat(289)}[PERSON 1]?`)
    expect(Array.from(result.line)).toHaveLength(limits.line)
  })

  test('keeps the first 40 code points of tagged place and category names', async () => {
    const name = `Anna${'x'.repeat(37)}`
    const result = await tagRequest(
      requestInput({ place: name, categories: [{ id: 'category-1', name }] }),
      fakeFinder({ [name]: [{ kind: 'person', start: 0, end: 4 }] })
    )

    expect(result.place).toBe(`[PERSON 1]${'x'.repeat(30)}`)
    expect(result.categories[0].name).toBe(`[PERSON 1]${'x'.repeat(30)}`)
    expect(Array.from(result.place)).toHaveLength(limits.name)
  })

  test('swaps a candidate made too long by tagging for the next spare phrase', async () => {
    const long = `Anna${'x'.repeat(196)}`
    const result = await tagRequest(
      requestInput({
        candidates: [{ id: 'long', text: long }],
        spares: [{ id: 'spare', text: 'Please wait' }]
      }),
      fakeFinder({ [long]: [{ kind: 'person', start: 0, end: 4 }] })
    )

    expect(result.candidates).toEqual([{ id: 'spare', text: 'Please wait' }])
  })

  test('drops a candidate made too long by tagging when there is no spare', async () => {
    const long = `Anna${'x'.repeat(196)}`
    const result = await tagRequest(
      requestInput({ candidates: [{ id: 'long', text: long }] }),
      fakeFinder({ [long]: [{ kind: 'person', start: 0, end: 4 }] })
    )

    expect(result.candidates).toEqual([])
  })

  test('keeps surrogate pairs intact when cutting the line', async () => {
    const line = `${'a'.repeat(300)}😀`
    const result = await tagRequest(requestInput({ line }), fakeFinder({}))

    expect(Array.from(result.line)).toHaveLength(limits.line)
    expect(result.line).toBe(`${'a'.repeat(299)}😀`)
    expect(hasLoneSurrogate(result.line)).toBe(false)
  })

  test('does not return the private name-to-tag map', async () => {
    const result = await tagRequest(requestInput(), fakeFinder({}))

    expect(Object.keys(result).sort()).toEqual(['candidates', 'categories', 'line', 'place'])
  })
})

describe('fitRequest', () => {
  test('drops candidates from the end until UTF-8 JSON fits the relay byte limit', () => {
    const request = lineRequest(
      Array.from({ length: limits.candidates }, (_, i) => ({ id: `phrase-${i}`, text: 'é'.repeat(limits.text) }))
    )
    const fitted = fitRequest(request)
    const bytes = new TextEncoder().encode(JSON.stringify(fitted)).length

    expect(fitted.candidates.length).toBeLessThan(request.candidates.length)
    expect(fitted.candidates).toEqual(request.candidates.slice(0, fitted.candidates.length))
    expect(bytes).toBeLessThanOrEqual(limits.bytes)
  })
})

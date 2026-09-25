import { describe, expect, test } from 'vitest'
import { runTagChecks } from '../src/listen/tag-checks'
import type { GazetteerFinder } from '../src/listen/gazetteer'

describe('runTagChecks', () => {
  test('passes the name, lowercase gazetteer, line length, and place examples with tagged text', async () => {
    let annaIsGazetteered = false
    const setCalls: [string[], string[], string[]][] = []
    const finder: GazetteerFinder = {
      findNames: async (texts) =>
        texts.map((text) => {
          if (text === 'Anna is my sister') return [{ kind: 'person', start: 0, end: 4 }]
          if (text === 'Did Anna call?') return [{ kind: 'person', start: 4, end: 8 }]
          if (text === 'did anna call?' && annaIsGazetteered) return [{ kind: 'person', start: 4, end: 8 }]
          if (text === 'Cupertino') return [{ kind: 'place', start: 0, end: 9 }]
          return []
        }),
      setGazetteer: async (person, place, org) => {
        setCalls.push([person, place, org])
        annaIsGazetteered = person.includes('Anna')
      }
    }

    const results = await runTagChecks(finder)

    expect(setCalls[0]).toEqual([['Anna'], [], []])
    expect(results).toEqual([
      expect.objectContaining({ name: 'LISTEN-5', passed: true, taggedText: expect.stringContaining('[PERSON 1]') }),
      expect.objectContaining({
        name: 'LISTEN-5 lowercase gazetteer',
        passed: true,
        taggedText: expect.stringContaining('[PERSON 1]')
      }),
      expect.objectContaining({ name: 'LISTEN-6', passed: true, taggedText: 'A'.repeat(300) }),
      expect.objectContaining({ name: 'PLACE-3', passed: true, taggedText: expect.stringContaining('[PLACE 1]') })
    ])
  })
})

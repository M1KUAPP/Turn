import { describe, expect, test } from 'vitest'
import { rebuildGazetteer, type GazetteerBank, type GazetteerFinder } from '../src/listen/gazetteer'

const bank = (phrases: string[], places: string[] = []): GazetteerBank => ({
  phrases: phrases.map((text) => ({ text })),
  places: places.map((name) => ({ name }))
})

const span = (text: string, name: string, kind: 'person' | 'place' | 'org') => {
  const start = text.indexOf(name)
  return { kind, start, end: start + name.length }
}

describe('rebuildGazetteer', () => {
  test('finds names in every phrase and place and sets each kind once', async () => {
    const names: string[][] = []
    let setNames: [string[], string[], string[]] | undefined
    const finder: GazetteerFinder = {
      findNames: async (texts) => {
        names.push([...texts])
        return texts.map((text) => {
          if (text.includes('Anna')) return [span(text, 'Anna', 'person')]
          if (text.includes('Main Street')) return [span(text, 'Main Street', 'place')]
          if (text.includes('Health Center')) return [span(text, 'Health Center', 'org')]
          return []
        })
      },
      setGazetteer: async (person, place, org) => {
        setNames = [person, place, org]
      }
    }

    await rebuildGazetteer(bank(['Anna came home', 'Did Anna call?', 'Health Center is open'], ['Main Street']), finder)

    expect(names).toEqual([['Anna came home', 'Did Anna call?', 'Health Center is open', 'Main Street']])
    expect(setNames).toEqual([['Anna'], ['Main Street'], ['Health Center']])
  })

  test('serializes rebuilds and runs once more with the latest bank after a change', async () => {
    let releaseFirst!: () => void
    let markFirstStarted!: () => void
    const firstStarted = new Promise<void>((resolve) => {
      markFirstStarted = resolve
    })
    const firstGate = new Promise<void>((resolve) => {
      releaseFirst = resolve
    })
    const inputs: string[][] = []
    const gazetteers: [string[], string[], string[]][] = []
    const finder: GazetteerFinder = {
      findNames: async (texts) => {
        inputs.push([...texts])
        return texts.map((text) => (text === 'Anna' ? [span(text, 'Anna', 'person')] : []))
      },
      setGazetteer: async (person, place, org) => {
        gazetteers.push([person, place, org])
        if (gazetteers.length === 1) {
          markFirstStarted()
          await firstGate
        }
      }
    }

    const first = rebuildGazetteer(bank(['Anna']), finder)
    await firstStarted
    const second = rebuildGazetteer(bank(['Mark']), finder)

    expect(gazetteers).toHaveLength(1)
    releaseFirst()
    await Promise.all([first, second])

    expect(inputs).toEqual([['Anna'], ['Mark']])
    expect(gazetteers).toEqual([
      [['Anna'], [], []],
      [[], [], []]
    ])
  })
})

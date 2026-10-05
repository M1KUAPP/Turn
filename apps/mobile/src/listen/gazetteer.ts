import type { NameFinder, NameKind } from './tags'

export type GazetteerBank = {
  phrases: readonly { text: string }[]
  places: readonly { name: string }[]
}

export type GazetteerFinder = {
  findNames: NameFinder
  setGazetteer: (person: string[], place: string[], org: string[]) => Promise<void>
}

type RebuildState = { bank: GazetteerBank; changed: boolean; promise: Promise<void> }

const rebuilding = new WeakMap<GazetteerFinder, RebuildState>()

const normalize = (name: string) => name.trim().toLowerCase().replace(/\s+/g, ' ')

async function buildGazetteer(bank: GazetteerBank, finder: GazetteerFinder) {
  const texts = [...bank.phrases.map(({ text }) => text), ...bank.places.map(({ name }) => name)]
  const spans = await finder.findNames(texts)
  const names: Record<NameKind, string[]> = { person: [], place: [], org: [] }
  const seen: Record<NameKind, Set<string>> = { person: new Set(), place: new Set(), org: new Set() }

  texts.forEach((text, i) => {
    for (const span of spans[i] ?? []) {
      if (span.start < 0 || span.end <= span.start || span.end > text.length) continue
      const name = text.slice(span.start, span.end).trim()
      const key = normalize(name)
      if (!key || seen[span.kind].has(key)) continue
      seen[span.kind].add(key)
      names[span.kind].push(name)
    }
  })

  await finder.setGazetteer(names.person, names.place, names.org)
}

/** Rebuilds one finder at a time and coalesces changes made during a rebuild to the latest bank. */
export function rebuildGazetteer(bank: GazetteerBank, finder: GazetteerFinder): Promise<void> {
  const active = rebuilding.get(finder)
  if (active) {
    active.bank = bank
    active.changed = true
    return active.promise
  }

  const state: RebuildState = { bank, changed: false, promise: Promise.resolve() }
  state.promise = (async () => {
    try {
      do {
        state.changed = false
        await buildGazetteer(state.bank, finder)
      } while (state.changed)
    } finally {
      rebuilding.delete(finder)
    }
  })()
  rebuilding.set(finder, state)
  return state.promise
}

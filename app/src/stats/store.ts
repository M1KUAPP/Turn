// Stats on this phone (SET-4, METRIC-3). A pure module: no React, SQLite, network, or Expo import, and nothing
// here reaches a request. Plan 0042 has the rules.

/** Where a spoken reply came from. The strip and Repeat are neither, and aren't recorded. */
export type ReplySource = 'row' | 'grid'

export type StatsEvent =
  /** A partner line ended, live or typed, and went to be ranked as line `seq`. */
  | { type: 'line'; seq: number; endedAt: number }
  /** The row now answers line `seq`. */
  | { type: 'row'; seq: number }
  /** A reply was spoken in Listen mode, answering line `seq`. */
  | { type: 'reply'; from: ReplySource; seq: number }

export type StatsSnapshot = {
  lines: number
  fromRow: number
  fromGrid: number
  /** Medians in milliseconds, or null before the first sample. */
  toRowMs: number | null
  toSpeechMs: number | null
}

export type StatsStore = {
  record(event: StatsEvent): void
  reset(): Promise<void>
  load(): Promise<void>
  getSnapshot(): StatsSnapshot
  subscribe(listener: () => void): () => void
}

export const STATS_KEY = 'stats'
export const MAX_SAMPLES = 200
export const MAX_SAMPLE_MS = 60_000

export const emptyStats: StatsSnapshot = { lines: 0, fromRow: 0, fromGrid: 0, toRowMs: null, toSpeechMs: null }

/** The lower middle sample, so the value shown is one that was measured; null for none. */
export function medianMs(samples: readonly number[]): number | null {
  if (samples.length === 0) return null
  const sorted = [...samples].sort((a, b) => a - b)
  return sorted[Math.floor((sorted.length - 1) / 2)]
}

/** "1.4 s", one decimal; "None yet" before the first sample. */
export function formatSeconds(ms: number | null): string {
  return ms === null ? 'None yet' : `${(ms / 1000).toFixed(1)} s`
}

export function createStatsStore(options: {
  now: () => number
  setting(key: string): Promise<string | null>
  setSetting(key: string, value: string | null): Promise<void>
}): StatsStore {
  const listeners = new Set<() => void>()
  let lines = 0
  let fromRow = 0
  let fromGrid = 0
  const toRow: number[] = []
  const toSpeech: number[] = []
  const lineEnds = new Map<number, number>()
  const rowSampled = new Set<number>()
  let snapshot = emptyStats
  let writeQueue: Promise<void> = Promise.resolve()

  const notify = () => {
    for (const listener of listeners) {
      try {
        listener()
      } catch {
        // One subscriber must not prevent the others from observing this change.
      }
    }
  }

  const updateSnapshot = () => {
    snapshot = {
      lines,
      fromRow,
      fromGrid,
      toRowMs: medianMs(toRow),
      toSpeechMs: medianMs(toSpeech)
    }
  }

  const queueWrite = (): Promise<void> => {
    const value = JSON.stringify({ lines, fromRow, fromGrid, toRow: [...toRow], toSpeech: [...toSpeech] })
    writeQueue = writeQueue.then(() => options.setSetting(STATS_KEY, value)).catch(() => undefined)
    return writeQueue
  }

  const addSample = (samples: number[], value: number): boolean => {
    if (!Number.isFinite(value) || value < 0 || value > MAX_SAMPLE_MS) return false
    samples.push(value)
    if (samples.length > MAX_SAMPLES) samples.shift()
    return true
  }

  const changed = (): void => {
    updateSnapshot()
    notify()
    void queueWrite()
  }

  const isCount = (value: unknown): value is number => Number.isInteger(value) && (value as number) >= 0
  const isFiniteNumberArray = (value: unknown): value is number[] =>
    Array.isArray(value) && value.every((sample) => typeof sample === 'number' && Number.isFinite(sample))

  return {
    record(event) {
      if (event.type === 'line') {
        if (event.seq <= 0 || lineEnds.has(event.seq)) return
        lines++
        lineEnds.set(event.seq, event.endedAt)
        if (lineEnds.size > 16) {
          let smallest = Infinity
          for (const seq of lineEnds.keys()) smallest = Math.min(smallest, seq)
          lineEnds.delete(smallest)
          rowSampled.delete(smallest)
        }
        changed()
        return
      }

      if (event.type === 'row') {
        if (!lineEnds.has(event.seq) || rowSampled.has(event.seq)) return
        const endedAt = lineEnds.get(event.seq) as number
        if (!addSample(toRow, options.now() - endedAt)) return
        rowSampled.add(event.seq)
        changed()
        return
      }

      if (event.seq <= 0) return
      if (event.from === 'row') fromRow++
      else fromGrid++
      if (lineEnds.has(event.seq)) {
        addSample(toSpeech, options.now() - (lineEnds.get(event.seq) as number))
      }
      changed()
    },
    async reset() {
      const stateChanged =
        lines !== 0 ||
        fromRow !== 0 ||
        fromGrid !== 0 ||
        toRow.length !== 0 ||
        toSpeech.length !== 0 ||
        lineEnds.size !== 0 ||
        rowSampled.size !== 0
      lines = 0
      fromRow = 0
      fromGrid = 0
      toRow.length = 0
      toSpeech.length = 0
      lineEnds.clear()
      rowSampled.clear()
      if (stateChanged) updateSnapshot()
      notify()
      return queueWrite()
    },
    async load() {
      let saved: string | null = null
      try {
        saved = await options.setting(STATS_KEY)
      } catch {
        saved = null
      }

      let nextLines = 0
      let nextFromRow = 0
      let nextFromGrid = 0
      let nextToRow: number[] = []
      let nextToSpeech: number[] = []
      if (saved !== null) {
        try {
          const parsed: unknown = JSON.parse(saved)
          if (
            typeof parsed === 'object' &&
            parsed !== null &&
            !Array.isArray(parsed) &&
            isCount((parsed as Record<string, unknown>).lines) &&
            isCount((parsed as Record<string, unknown>).fromRow) &&
            isCount((parsed as Record<string, unknown>).fromGrid) &&
            isFiniteNumberArray((parsed as Record<string, unknown>).toRow) &&
            isFiniteNumberArray((parsed as Record<string, unknown>).toSpeech)
          ) {
            const value = parsed as {
              lines: number
              fromRow: number
              fromGrid: number
              toRow: number[]
              toSpeech: number[]
            }
            nextLines = value.lines
            nextFromRow = value.fromRow
            nextFromGrid = value.fromGrid
            nextToRow = value.toRow.filter((sample) => sample >= 0 && sample <= MAX_SAMPLE_MS).slice(-MAX_SAMPLES)
            nextToSpeech = value.toSpeech.filter((sample) => sample >= 0 && sample <= MAX_SAMPLE_MS).slice(-MAX_SAMPLES)
          }
        } catch {
          // Unreadable stats are treated as an empty store.
        }
      }

      const stateChanged =
        lines !== nextLines ||
        fromRow !== nextFromRow ||
        fromGrid !== nextFromGrid ||
        toRow.length !== nextToRow.length ||
        toSpeech.length !== nextToSpeech.length ||
        toRow.some((sample, index) => sample !== nextToRow[index]) ||
        toSpeech.some((sample, index) => sample !== nextToSpeech[index]) ||
        lineEnds.size !== 0 ||
        rowSampled.size !== 0
      lines = nextLines
      fromRow = nextFromRow
      fromGrid = nextFromGrid
      toRow.splice(0, toRow.length, ...nextToRow)
      toSpeech.splice(0, toSpeech.length, ...nextToSpeech)
      lineEnds.clear()
      rowSampled.clear()
      if (stateChanged) updateSnapshot()
      notify()
    },
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    }
  }
}

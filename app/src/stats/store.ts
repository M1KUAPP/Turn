// Stats on this phone (SET-4, METRIC-3). A pure module: no React, SQLite, network, or Expo import, and nothing
// here reaches a request. Plan 0042 has the rules; this is Task 1's stub.

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
export function medianMs(_samples: readonly number[]): number | null {
  return null
}

/** "1.4 s", one decimal; "None yet" before the first sample. */
export function formatSeconds(_ms: number | null): string {
  return 'None yet'
}

export function createStatsStore(_options: {
  now: () => number
  setting(key: string): Promise<string | null>
  setSetting(key: string, value: string | null): Promise<void>
}): StatsStore {
  const listeners = new Set<() => void>()
  return {
    record() {},
    async reset() {},
    async load() {},
    getSnapshot: () => emptyStats,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    }
  }
}

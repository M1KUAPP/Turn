import { readFileSync } from 'node:fs'
import { describe, expect, test, vi } from 'vitest'
import {
  createStatsStore,
  emptyStats,
  formatSeconds,
  MAX_SAMPLE_MS,
  MAX_SAMPLES,
  medianMs,
  STATS_KEY
} from '../src/stats/store'

type SettingWriter = ReturnType<typeof vi.fn<(key: string, value: string | null) => Promise<void>>>

function makeStore(
  options: {
    saved?: string | null
    now?: () => number
    setSetting?: SettingWriter
  } = {}
) {
  const setting = vi.fn(async () => options.saved ?? null)
  const setSetting: SettingWriter = options.setSetting ?? vi.fn(async () => undefined)
  const store = createStatsStore({ now: options.now ?? (() => 1000), setting, setSetting })
  return { store, setting, setSetting }
}

async function waitForWrites(setSetting: SettingWriter, count: number) {
  await vi.waitFor(() => expect(setSetting).toHaveBeenCalledTimes(count))
}

describe('stats store', () => {
  test('counts lines and replies from each source', () => {
    const { store } = makeStore({ now: () => 1500 })
    store.record({ type: 'line', seq: 1, endedAt: 1000 })
    store.record({ type: 'line', seq: 2, endedAt: 1000 })
    store.record({ type: 'reply', from: 'row', seq: 1 })
    store.record({ type: 'reply', from: 'grid', seq: 2 })

    expect(store.getSnapshot()).toEqual({ lines: 2, fromRow: 1, fromGrid: 1, toRowMs: null, toSpeechMs: 500 })
  })

  test('ignores non-positive and duplicate line sequences', () => {
    const { store } = makeStore()
    store.record({ type: 'line', seq: 0, endedAt: 10 })
    store.record({ type: 'line', seq: -1, endedAt: 10 })
    store.record({ type: 'line', seq: 1, endedAt: 10 })
    store.record({ type: 'line', seq: 1, endedAt: 20 })
    store.record({ type: 'reply', from: 'row', seq: 0 })
    store.record({ type: 'reply', from: 'grid', seq: -1 })

    expect(store.getSnapshot()).toEqual({ lines: 1, fromRow: 0, fromGrid: 0, toRowMs: null, toSpeechMs: null })
  })

  test('keeps only the 16 greatest line sequences for timing', () => {
    const { store } = makeStore({ now: () => 1000 })
    for (let seq = 1; seq <= 17; seq++) store.record({ type: 'line', seq, endedAt: seq * 10 })

    store.record({ type: 'reply', from: 'grid', seq: 1 })
    expect(store.getSnapshot().toSpeechMs).toBeNull()
    store.record({ type: 'reply', from: 'grid', seq: 2 })
    expect(store.getSnapshot()).toMatchObject({ lines: 17, fromGrid: 2, toSpeechMs: 980 })
  })

  test('counts a row timing sample once per sequence', () => {
    let now = 300
    const { store } = makeStore({ now: () => now })
    store.record({ type: 'line', seq: 1, endedAt: 100 })
    store.record({ type: 'row', seq: 1 })
    now = 150
    store.record({ type: 'row', seq: 1 })

    expect(store.getSnapshot().toRowMs).toBe(200)
  })

  test('drops timing samples below zero and above 60,000 milliseconds', () => {
    let now = 999
    const { store } = makeStore({ now: () => now })
    store.record({ type: 'line', seq: 1, endedAt: 1000 })
    store.record({ type: 'row', seq: 1 })
    store.record({ type: 'reply', from: 'grid', seq: 1 })
    now = 61_001
    store.record({ type: 'line', seq: 2, endedAt: 1000 })
    store.record({ type: 'row', seq: 2 })
    store.record({ type: 'reply', from: 'grid', seq: 2 })

    expect(store.getSnapshot()).toMatchObject({ toRowMs: null, toSpeechMs: null })
  })

  test('accepts a timing sample of exactly 60,000 milliseconds', () => {
    const { store } = makeStore({ now: () => MAX_SAMPLE_MS })
    store.record({ type: 'line', seq: 1, endedAt: 0 })
    store.record({ type: 'row', seq: 1 })
    store.record({ type: 'reply', from: 'row', seq: 1 })

    expect(store.getSnapshot()).toMatchObject({ toRowMs: 60_000, toSpeechMs: 60_000 })
  })

  test('keeps the newest 200 samples and drops the oldest', async () => {
    let now = 1
    const { store, setSetting } = makeStore({ now: () => now })
    store.record({ type: 'line', seq: 1, endedAt: 0 })
    for (now = 1; now <= MAX_SAMPLES + 1; now++) store.record({ type: 'reply', from: 'grid', seq: 1 })
    await waitForWrites(setSetting, MAX_SAMPLES + 2)
    const saved = JSON.parse(setSetting.mock.calls.at(-1)?.[1] ?? 'null') as { toSpeech: number[] }

    expect(saved.toSpeech).toHaveLength(MAX_SAMPLES)
    expect(saved.toSpeech[0]).toBe(2)
    expect(saved.toSpeech.at(-1)).toBe(201)
  })

  test('medianMs returns null for an empty list', () => {
    expect(medianMs([])).toBeNull()
  })

  test('medianMs returns the one sample', () => {
    expect(medianMs([42])).toBe(42)
  })

  test('medianMs returns the middle of an odd list without mutating it', () => {
    const samples = [900, 100, 200]
    expect(medianMs(samples)).toBe(200)
    expect(samples).toEqual([900, 100, 200])
  })

  test('medianMs returns the lower middle of an even list', () => {
    expect(medianMs([100, 200, 300, 900])).toBe(200)
  })

  test('formatSeconds formats null and one-decimal second values', () => {
    expect(formatSeconds(null)).toBe('None yet')
    expect(formatSeconds(800)).toBe('0.8 s')
    expect(formatSeconds(1400)).toBe('1.4 s')
    expect(formatSeconds(12_000)).toBe('12.0 s')
  })

  test('keeps the same snapshot until state changes', () => {
    const { store } = makeStore()
    const empty = store.getSnapshot()
    expect(store.getSnapshot()).toBe(empty)
    store.record({ type: 'line', seq: 1, endedAt: 10 })
    const changed = store.getSnapshot()
    expect(changed).not.toBe(empty)
    expect(store.getSnapshot()).toBe(changed)
    store.record({ type: 'line', seq: 1, endedAt: 20 })
    expect(store.getSnapshot()).toBe(changed)
  })

  test('notifies listeners once and stops after unsubscribe', () => {
    const { store } = makeStore()
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)
    store.record({ type: 'line', seq: 1, endedAt: 10 })
    expect(listener).toHaveBeenCalledOnce()
    unsubscribe()
    store.record({ type: 'reply', from: 'row', seq: 0 })
    expect(listener).toHaveBeenCalledOnce()
  })

  test('a no-op event does not notify or write', async () => {
    const { store, setSetting } = makeStore()
    const listener = vi.fn()
    store.subscribe(listener)
    store.record({ type: 'line', seq: 0, endedAt: 10 })
    store.record({ type: 'row', seq: 1 })
    store.record({ type: 'reply', from: 'grid', seq: 0 })
    await Promise.resolve()

    expect(listener).not.toHaveBeenCalled()
    expect(setSetting).not.toHaveBeenCalled()
  })

  test('writes the exact stats JSON after a change', async () => {
    const { store, setSetting } = makeStore({ now: () => 1200 })
    store.record({ type: 'line', seq: 1, endedAt: 1000 })
    store.record({ type: 'reply', from: 'row', seq: 1 })
    await waitForWrites(setSetting, 2)

    expect(setSetting).toHaveBeenLastCalledWith(
      STATS_KEY,
      JSON.stringify({ lines: 1, fromRow: 1, fromGrid: 0, toRow: [], toSpeech: [200] })
    )
  })

  test('writes land in order when an earlier write is pending', async () => {
    let finishFirst!: () => void
    const first = new Promise<void>((resolve) => {
      finishFirst = resolve
    })
    const values: string[] = []
    const setSetting = vi.fn(async (_key: string, value: string | null) => {
      if (value !== null) values.push(value)
      if (values.length === 1) await first
    })
    const { store } = makeStore({ setSetting })
    store.record({ type: 'line', seq: 1, endedAt: 10 })
    store.record({ type: 'reply', from: 'row', seq: 1 })
    await vi.waitFor(() => expect(setSetting).toHaveBeenCalledTimes(1))
    expect(values).toHaveLength(1)
    finishFirst()
    await vi.waitFor(() => expect(setSetting).toHaveBeenCalledTimes(2))

    expect(values.map((value) => JSON.parse(value))).toEqual([
      { lines: 1, fromRow: 0, fromGrid: 0, toRow: [], toSpeech: [] },
      { lines: 1, fromRow: 1, fromGrid: 0, toRow: [], toSpeech: [990] }
    ])
  })

  test('drops a failed write without throwing or blocking the next write', async () => {
    const setSetting = vi
      .fn<(key: string, value: string | null) => Promise<void>>()
      .mockRejectedValueOnce(new Error('disk full'))
      .mockResolvedValue(undefined)
    const { store } = makeStore({ setSetting })
    expect(() => store.record({ type: 'line', seq: 1, endedAt: 10 })).not.toThrow()
    store.record({ type: 'reply', from: 'row', seq: 1 })
    await store.reset()

    expect(setSetting).toHaveBeenCalledTimes(3)
  })

  test('load of a missing value gives zeroes and notifies', async () => {
    const { store } = makeStore({ saved: null })
    const listener = vi.fn()
    store.subscribe(listener)
    await store.load()

    expect(store.getSnapshot()).toEqual(emptyStats)
    expect(listener).toHaveBeenCalledOnce()
  })

  test('load restores saved counts and caps each sample list to its newest 200', async () => {
    const saved = JSON.stringify({
      lines: 5,
      fromRow: 2,
      fromGrid: 3,
      toRow: Array.from({ length: 250 }, (_, i) => i),
      toSpeech: Array.from({ length: 250 }, (_, i) => i + 1000)
    })
    const { store } = makeStore({ saved })
    await store.load()

    expect(store.getSnapshot()).toEqual({ lines: 5, fromRow: 2, fromGrid: 3, toRowMs: 149, toSpeechMs: 1149 })
  })

  test('load of unparsable JSON gives zeroes', async () => {
    const { store } = makeStore({ saved: '{not json' })
    await store.load()

    expect(store.getSnapshot()).toEqual(emptyStats)
  })

  test('load of a wrong-shaped value gives zeroes', async () => {
    const { store } = makeStore({
      saved: JSON.stringify({ lines: -1, fromRow: 1.5, fromGrid: 0, toRow: [], toSpeech: {} })
    })
    await store.load()

    expect(store.getSnapshot()).toEqual(emptyStats)
  })

  test.each([
    ['a negative count', { lines: -1, fromRow: 0, fromGrid: 0, toRow: [], toSpeech: [] }],
    ['a fractional count', { lines: 0, fromRow: 1.5, fromGrid: 0, toRow: [], toSpeech: [] }],
    ['samples that are not a list', { lines: 1, fromRow: 0, fromGrid: 0, toRow: [], toSpeech: {} }]
  ])('load of %s alone gives zeroes', async (_name, saved) => {
    const { store } = makeStore({ saved: JSON.stringify(saved) })
    await store.load()

    expect(store.getSnapshot()).toEqual(emptyStats)
  })

  test('load rejects non-finite sample values as a wrong shape', async () => {
    const { store } = makeStore({ saved: '{"lines":1,"fromRow":0,"fromGrid":0,"toRow":[null],"toSpeech":[]}' })
    await store.load()

    expect(store.getSnapshot()).toEqual(emptyStats)
  })

  test('reset clears counts, samples, and line timing state and writes zeroes', async () => {
    let now = 150
    const { store, setSetting } = makeStore({ now: () => now })
    store.record({ type: 'line', seq: 1, endedAt: 100 })
    store.record({ type: 'row', seq: 1 })
    store.record({ type: 'reply', from: 'row', seq: 1 })
    const listener = vi.fn()
    store.subscribe(listener)

    await store.reset()
    expect(store.getSnapshot()).toEqual(emptyStats)
    expect(setSetting).toHaveBeenLastCalledWith(
      STATS_KEY,
      JSON.stringify({ lines: 0, fromRow: 0, fromGrid: 0, toRow: [], toSpeech: [] })
    )
    now = 200
    store.record({ type: 'reply', from: 'grid', seq: 1 })

    expect(store.getSnapshot()).toMatchObject({ fromGrid: 1, toSpeechMs: null })
    expect(listener).toHaveBeenCalledTimes(2)
  })

  test('after five lines, the counts match', () => {
    const { store } = makeStore()
    for (let seq = 1; seq <= 5; seq++) store.record({ type: 'line', seq, endedAt: 0 })
    store.record({ type: 'reply', from: 'row', seq: 1 })
    store.record({ type: 'reply', from: 'row', seq: 2 })
    store.record({ type: 'reply', from: 'grid', seq: 3 })
    store.record({ type: 'reply', from: 'grid', seq: 4 })
    store.record({ type: 'reply', from: 'grid', seq: 5 })

    expect(store.getSnapshot()).toMatchObject({ lines: 5, fromRow: 2, fromGrid: 3 })
  })

  test('store.ts has no imports', () => {
    const source = readFileSync(new URL('../src/stats/store.ts', import.meta.url), 'utf8')
    expect(source).not.toMatch(/^\s*import\s/m)
  })
})

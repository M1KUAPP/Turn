import { DatabaseSync } from 'node:sqlite'
import { afterEach, describe, expect, test, vi } from 'vitest'
import type { BankDatabase } from '../src/bank/store'
import { createBankStore } from '../src/bank/store'
import starterBank from '../src/content/starter-bank.json'
import { createLiveListenSession } from '../src/listen/live-session'
import { createTypedListenSession } from '../src/listen/typed-session'
import type { AssetStatus, ListenEngine, ListenEngineEvents, ListenLine } from '../src/listen/engine'

const databases: DatabaseSync[] = []

function database(): BankDatabase {
  const sqlite = new DatabaseSync(':memory:')
  databases.push(sqlite)
  const adapter: BankDatabase = {
    execAsync: async (sql) => {
      sqlite.exec(sql)
    },
    runAsync: async (sql, ...args) => {
      sqlite.prepare(sql).run(...args)
    },
    getFirstAsync: async <T>(sql: string, ...args: (string | number)[]) =>
      (sqlite.prepare(sql).get(...args) as T | undefined) ?? null,
    getAllAsync: async <T>(sql: string, ...args: (string | number)[]) => sqlite.prepare(sql).all(...args) as T[],
    withExclusiveTransactionAsync: async (work) => {
      sqlite.exec('BEGIN IMMEDIATE')
      try {
        await work(adapter)
        sqlite.exec('COMMIT')
      } catch (error) {
        sqlite.exec('ROLLBACK')
        throw error
      }
    }
  }
  return adapter
}

afterEach(() => {
  vi.useRealTimers()
  for (const db of databases.splice(0)) db.close()
})

function fakeEngine(status: AssetStatus = 'installed') {
  let events: ListenEngineEvents | null = null
  let currentText = ''
  let endedAt = 1000
  const engine: ListenEngine = {
    id: 'turn-listen',
    listen(handlers) {
      events = handlers
      return () => {
        events = null
      }
    },
    availability: vi.fn(async () => status),
    installAsset: vi.fn(async () => undefined),
    start: vi.fn(async () => undefined),
    pause: vi.fn(async () => undefined),
    resume: vi.fn(async () => undefined),
    stop: vi.fn(async () => undefined),
    endLine: vi.fn(async () => {
      events?.onLine({ text: currentText, endedAt: endedAt++, silenceWindowMs: 500 })
    }),
    muteForSpeech: vi.fn(async () => undefined)
  }

  return {
    engine,
    partial(text: string) {
      currentText = text
      events?.onPartial(text)
    },
    voice(active: boolean) {
      events?.onVoice(active)
    },
    line(line: ListenLine) {
      events?.onLine(line)
    },
    progress(fraction: number | null) {
      events?.onAssetProgress(fraction)
    },
    state: (state: Parameters<ListenEngineEvents['onState']>[0], reason?: string) => events?.onState(state, reason)
  }
}

async function session(
  options: {
    engine?: ListenEngine | null
    status?: AssetStatus
    now?: () => number
    log?: (entry: { line: string; endedAt: number; rankedAt: number; silenceWindowMs: number }) => void
    place?: () => string | Promise<string>
  } = {}
) {
  const bank = createBankStore(database(), starterBank, () => new Date(2026, 8, 23))
  await bank.initialize()
  const typed = createTypedListenSession(bank)
  await typed.ready
  const fake = options.engine === undefined ? fakeEngine(options.status) : null
  const engine = options.engine === undefined ? (fake?.engine ?? null) : options.engine
  const now = options.now ?? vi.fn(() => 2000)
  const log = options.log ?? vi.fn()
  const live = createLiveListenSession({
    typed,
    engine,
    now,
    log,
    place: options.place
  })
  return { bank, typed, live, engine, fake, now, log }
}

describe('live partner session', () => {
  test('shows Listening until partial words arrive, then updates the live caption', async () => {
    const { live, fake } = await session()

    expect(live.getSnapshot().caption.label).toBe('Listen mode is off.')
    await live.start()
    expect(live.getSnapshot().caption.label).toBe('Listening')
    expect(live.getSnapshot().caption.words).toBe('')

    fake?.partial('How was')
    expect(live.getSnapshot().caption).toMatchObject({ label: "They're saying", words: 'How was' })
    fake?.partial('How was physio?')
    expect(live.getSnapshot().caption.words).toBe('How was physio?')
    expect(fake?.engine.start).toHaveBeenCalledOnce()
    await live.dispose()
  })

  test('ends one line after 500 ms of silence and resets the window for new words and voice', async () => {
    vi.useFakeTimers()
    const fake = fakeEngine()
    const { live, typed } = await session({ engine: fake.engine })
    const send = vi.spyOn(typed, 'send')
    await live.start()

    fake.partial('How was physio?')
    fake.voice(false)
    await vi.advanceTimersByTimeAsync(300)
    fake.partial('How was physio today?')
    await vi.advanceTimersByTimeAsync(400)
    expect(send).not.toHaveBeenCalled()

    fake.voice(true)
    await vi.advanceTimersByTimeAsync(500)
    expect(send).not.toHaveBeenCalled()

    fake.voice(false)
    await vi.advanceTimersByTimeAsync(499)
    expect(send).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(send).toHaveBeenCalledOnce()
    await send.mock.results[0]?.value
    expect(live.getSnapshot().caption).toMatchObject({
      label: 'They said',
      words: 'How was physio today?'
    })
    expect(live.getSnapshot().rankedOnce).toBe(true)
    await live.dispose()
  })

  test('Done ends and ranks an open line once using the engine stamp and ranking time', async () => {
    const log = vi.fn()
    const now = vi.fn(() => 4012)
    const fake = fakeEngine()
    const { live, typed } = await session({ engine: fake.engine, now, log })
    const send = vi.spyOn(typed, 'send')
    await live.start()
    fake.partial('Do you want some water?')

    await live.endLine()
    expect(send).toHaveBeenCalledOnce()
    expect(log).toHaveBeenCalledWith({
      line: 'Do you want some water?',
      endedAt: 1000,
      rankedAt: 4012,
      silenceWindowMs: 500
    })

    fake.line({ text: 'Do you want some water?', endedAt: 1000, silenceWindowMs: 500 })
    expect(send).toHaveBeenCalledOnce()
    await live.dispose()
  })

  test('ignores a duplicate engine boundary for the same open line', async () => {
    const fake = fakeEngine()
    const { live, typed } = await session({ engine: fake.engine })
    const send = vi.spyOn(typed, 'send')
    await live.start()
    fake.partial('How was physio?')

    fake.line({ text: 'How was physio?', endedAt: 1001, silenceWindowMs: 500 })
    fake.line({ text: 'How was physio?', endedAt: 1002, silenceWindowMs: 500 })
    await Promise.resolve()

    expect(send).toHaveBeenCalledOnce()
    await send.mock.results[0]?.value
    await live.dispose()
  })

  test('uses the current place provider for an engine line', async () => {
    const fake = fakeEngine()
    const place = vi.fn(async () => 'clinic')
    const { live, typed } = await session({ engine: fake.engine, place })
    const send = vi.spyOn(typed, 'send')
    await live.start()

    fake.partial('How was physio?')
    fake.line({ text: 'How was physio?', endedAt: 1001, silenceWindowMs: 500 })
    await Promise.resolve()

    expect(send).toHaveBeenCalledWith('How was physio?', 'clinic')
    await send.mock.results[0]?.value
    await live.dispose()
  })

  test('ranks a typed line once and Clear empties the row', async () => {
    const fake = fakeEngine()
    const { live, typed } = await session({ engine: fake.engine })
    const send = vi.spyOn(typed, 'send')
    await live.start()
    fake.partial('Do you want some water?')

    await live.send('Do you want some water?', 'home')
    expect(send).toHaveBeenCalledOnce()
    expect(fake.engine.endLine).toHaveBeenCalledOnce()
    expect(live.getSnapshot().row.seq).toBe(1)
    expect(live.getSnapshot().caption).toMatchObject({ label: 'They said', words: 'Do you want some water?' })
    fake.line({ text: 'Do you want some water?', endedAt: 1000, silenceWindowMs: 500 })
    expect(send).toHaveBeenCalledOnce()

    live.clear()
    expect(live.getSnapshot().row.slots.every((slot) => slot === null)).toBe(true)
    await live.dispose()
  })

  test('a typed line sent over noise alone still lets the next spoken line rank', async () => {
    const fake = fakeEngine()
    const { live, typed } = await session({ engine: fake.engine })
    const send = vi.spyOn(typed, 'send')
    await live.start()
    fake.voice(true)
    vi.mocked(fake.engine.endLine).mockImplementationOnce(async () => undefined)

    await live.send('Do you want some water?', 'home')
    fake.partial('How was physio?')
    fake.line({ text: 'How was physio?', endedAt: 1000, silenceWindowMs: 500 })

    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(2))
    expect(send).toHaveBeenLastCalledWith('How was physio?', '')
    await live.dispose()
  })

  test('the end of noise after a ranked line starts no silence timer', async () => {
    vi.useFakeTimers()
    try {
      const fake = fakeEngine()
      const { live } = await session({ engine: fake.engine })
      await live.start()
      fake.partial('How was physio?')
      await live.endLine()
      fake.voice(true)
      fake.voice(false)
      await vi.advanceTimersByTimeAsync(600)

      expect(fake.engine.endLine).toHaveBeenCalledOnce()
      await live.dispose()
    } finally {
      vi.useRealTimers()
    }
  })

  test('End stops the engine and clears the caption and row', async () => {
    const { live, engine } = await session()
    await live.start()
    await live.send('Do you want some water?', 'home')
    await live.end()

    expect(engine?.stop).toHaveBeenCalledOnce()
    expect(live.getSnapshot().caption.words).toBe('')
    expect(live.getSnapshot().caption.label).toBe('Listen mode is off.')
    expect(live.getSnapshot().row.slots.every((slot) => slot === null)).toBe(true)
    await live.dispose()
  })

  test('a null engine offers the typed prompt and still ranks a typed line', async () => {
    const { live, typed } = await session({ engine: null })
    const send = vi.spyOn(typed, 'send')

    expect(live.getSnapshot().caption.prompt).toBeNull()
    await live.start()
    expect(live.getSnapshot().caption).toMatchObject({
      note: "Live transcription isn't available here. Tap here to type what they say.",
      prompt: 'Tap here to type what they say.'
    })
    await live.send('Do you want some water?', 'home')
    expect(send).toHaveBeenCalledOnce()
    await live.end()
    expect(live.getSnapshot().caption).toMatchObject({
      label: 'Listen mode is off.',
      words: '',
      note: null,
      prompt: null
    })
    await live.dispose()
  })

  test('shows model progress while installing an available English model', async () => {
    const fake = fakeEngine('supported')
    const { live } = await session({ engine: fake.engine })
    const snapshots: ReturnType<typeof live.getSnapshot>[] = []
    live.subscribe(() => snapshots.push(live.getSnapshot()))
    fake.engine.installAsset = vi.fn(async () => {
      fake.progress(0.4)
    })

    await live.start()
    expect(snapshots.some((snapshot) => snapshot.caption.note === "Getting Apple's English speech model")).toBe(true)
    expect(snapshots.some((snapshot) => snapshot.assetProgress === 0.4)).toBe(true)
    await live.dispose()
  })
})

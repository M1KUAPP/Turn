import { DatabaseSync } from 'node:sqlite'
import { afterEach, describe, expect, test, vi } from 'vitest'
import type { BankDatabase } from '../src/bank/store'
import { createBankStore } from '../src/bank/store'
import starterBank from '../src/content/starter-bank.json'
import { createLiveListenSession } from '../src/listen/live-session'
import type { AssetStatus, ListenEngine, ListenEngineEvents, ListenLine } from '../src/listen/engine'
import { createTypedListenSession, type RemoteRanker } from '../src/listen/typed-session'
import { startingPolicy } from '@turn/shared/row'
import type { StatsEvent } from '../src/stats/store'

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
  for (const db of databases.splice(0)) db.close()
})

function fakeEngine(status: AssetStatus = 'installed') {
  let events: ListenEngineEvents | null = null
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
    endLine: vi.fn(async () => undefined)
  }
  return {
    engine,
    line(line: ListenLine) {
      events?.onLine(line)
    }
  }
}

async function session(
  options: {
    stats?: { record: (event: StatsEvent) => void } | null
    includeStats?: boolean
    engine?: ListenEngine | null
    now?: () => number
    remote?: RemoteRanker
  } = {}
) {
  const bank = createBankStore(database(), starterBank, () => new Date(2026, 8, 23))
  await bank.initialize()
  const typed = createTypedListenSession(bank, options.remote)
  await typed.ready
  const fake = options.engine === null ? null : fakeEngine()
  const engine = options.engine === undefined ? (fake?.engine ?? null) : options.engine
  const stats = vi.fn(options.stats?.record)
  const live = createLiveListenSession({
    typed,
    engine,
    now: options.now ?? (() => 2000),
    log: vi.fn(),
    ...(options.includeStats === false
      ? {}
      : { stats: options.stats === undefined ? { record: stats } : options.stats })
  })
  return { typed, live, fake, stats }
}

async function waitForSend(typed: Awaited<ReturnType<typeof session>>['typed']) {
  const send = vi.spyOn(typed, 'send')
  return send
}

describe('live session stats hooks', () => {
  test('rankLine records its sequence and endedAt, then records the answered row', async () => {
    const stats = { record: vi.fn() }
    const { live, typed, fake } = await session({ stats })
    const send = await waitForSend(typed)
    await live.start()
    fake?.line({ text: 'Would you like some water?', endedAt: 1234, silenceWindowMs: 500 })

    await vi.waitFor(() => expect(stats.record).toHaveBeenCalledWith({ type: 'line', seq: 1, endedAt: 1234 }))
    await vi.waitFor(() => expect(send).toHaveBeenCalledOnce())
    await send.mock.results[0]?.value

    expect(live.getSnapshot().row.answers).toBe(1)
    expect(stats.record.mock.calls.map(([event]) => event)).toEqual([
      { type: 'line', seq: 1, endedAt: 1234 },
      { type: 'row', seq: 1 }
    ])
    await live.dispose()
  })

  test('typed send records its own end time and the answered row', async () => {
    const stats = { record: vi.fn() }
    const { live, typed } = await session({ stats, engine: null, now: () => 4567 })
    const send = await waitForSend(typed)
    await live.start()
    await live.send('Would you like some water?', 'home')

    expect(send).toHaveBeenCalledOnce()
    expect(stats.record.mock.calls.map(([event]) => event)).toEqual([
      { type: 'line', seq: 1, endedAt: 4567 },
      { type: 'row', seq: 1 }
    ])
    await live.dispose()
  })

  test('does not record a row when an answer holds the previous row', async () => {
    const stats = { record: vi.fn() }
    const heldRemote: RemoteRanker = {
      allowed: () => true,
      rank: async ({ seq }) => ({
        seq,
        kind: { yes_no: 0, either_or: 0, open: 1, not_a_question: 0 },
        topic: { other: 1 },
        scores: {},
        policy: startingPolicy,
        freeLinesLeft: null,
        ms: { jev: 0, total: 0 }
      })
    }
    const { live, typed, fake } = await session({ stats, remote: heldRemote })
    const send = await waitForSend(typed)
    await live.start()
    fake?.line({ text: 'A line with no matching reply', endedAt: 3000, silenceWindowMs: 500 })
    await vi.waitFor(() => expect(send).toHaveBeenCalledOnce())
    await send.mock.results[0]?.value

    expect(live.getSnapshot().row.seq).toBe(1)
    expect(live.getSnapshot().row.answers).toBe(0)
    expect(stats.record.mock.calls.map(([event]) => event)).toEqual([{ type: 'line', seq: 1, endedAt: 3000 }])
    await live.dispose()
  })

  test.each([
    ['null stats', null, true],
    ['no stats option', undefined, false]
  ] as const)('%s leaves typed ranking behavior intact', async (_name, value, includeStats) => {
    const { live, typed } = await session({ engine: null, ...(includeStats ? { stats: value } : {}), includeStats })
    const send = await waitForSend(typed)
    await live.start()
    await live.send('Would you like some water?', 'home')

    expect(send).toHaveBeenCalledOnce()
    expect(live.getSnapshot().row.seq).toBe(1)
    expect(live.getSnapshot().caption.words).toBe('Would you like some water?')
    await live.dispose()
  })
})

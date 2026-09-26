import { DatabaseSync } from 'node:sqlite'
import { afterEach, describe, expect, test, vi } from 'vitest'
import type { AppStateStatus } from 'react-native'
import type { BankDatabase } from '../src/bank/store'
import { createBankStore } from '../src/bank/store'
import starterBank from '../src/content/starter-bank.json'
import type { ListenEngine, ListenEngineEvents } from '../src/listen/engine'
import { bindListenLifecycle } from '../src/listen/lifecycle'
import { createLiveListenSession } from '../src/listen/live-session'
import { createTypedListenSession } from '../src/listen/typed-session'

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

function fakeEngine() {
  let events: ListenEngineEvents | null = null
  const engine: ListenEngine = {
    id: 'turn-listen',
    listen(handlers) {
      events = handlers
      return () => {
        events = null
      }
    },
    availability: vi.fn(async () => 'installed' as const),
    installAsset: vi.fn(async () => undefined),
    start: vi.fn(async () => undefined),
    pause: vi.fn(async () => undefined),
    resume: vi.fn(async () => undefined),
    stop: vi.fn(async () => undefined),
    endLine: vi.fn(async () => undefined)
  }

  return {
    engine,
    partial(text: string) {
      events?.onPartial(text)
    }
  }
}

afterEach(() => {
  vi.useRealTimers()
  for (const db of databases.splice(0)) db.close()
})

describe('Listen foreground lifecycle', () => {
  test('only background pauses; active leaves it paused and cleanup removes the listener', async () => {
    vi.useFakeTimers()
    const now = vi.fn(() => 5000)
    const bank = createBankStore(database(), starterBank, () => new Date(2026, 8, 23))
    await bank.initialize()
    const typed = createTypedListenSession(bank)
    await typed.ready
    const fake = fakeEngine()
    const live = createLiveListenSession({ typed, engine: fake.engine, now, log: vi.fn() })
    await live.ready

    const listener: { current: ((state: AppStateStatus) => void) | null } = { current: null }
    const remove = vi.fn(() => {
      listener.current = null
    })
    const appState = {
      addEventListener: vi.fn((_event: 'change', handler: (state: AppStateStatus) => void) => {
        listener.current = handler
        return { remove }
      })
    }
    const unbind = bindListenLifecycle(live, appState)
    await live.start()
    fake.partial('An unfinished line')

    listener.current?.('inactive')
    listener.current?.('active')
    expect(fake.engine.pause).not.toHaveBeenCalled()
    expect(live.getSnapshot().phase).toBe('listening')

    listener.current?.('background')
    listener.current?.('active')
    await vi.advanceTimersByTimeAsync(120_000)

    expect(fake.engine.pause).toHaveBeenCalledOnce()
    expect(fake.engine.resume).not.toHaveBeenCalled()
    expect(live.getSnapshot()).toMatchObject({ phase: 'paused', active: true, caption: { words: '' } })

    unbind()
    expect(remove).toHaveBeenCalledOnce()
    listener.current?.('background')
    expect(fake.engine.pause).toHaveBeenCalledOnce()
    await live.dispose()
  })
})

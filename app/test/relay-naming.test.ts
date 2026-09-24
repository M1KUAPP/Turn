import { DatabaseSync } from 'node:sqlite'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { createNamingStore, getOrCreateUserId, refreshNaming } from '../src/relay/naming'

const databases: DatabaseSync[] = []

function database() {
  const sqlite = new DatabaseSync(':memory:')
  sqlite.exec('CREATE TABLE setting (key TEXT PRIMARY KEY, value TEXT NOT NULL)')
  databases.push(sqlite)
  return {
    getFirstAsync: async <T>(sql: string, ...args: (string | number)[]) =>
      (sqlite.prepare(sql).get(...args) as T | undefined) ?? null,
    runAsync: async (sql: string, ...args: (string | number)[]) => {
      sqlite.prepare(sql).run(...args)
    }
  }
}

function identityStorage(initial: string | null = null) {
  let value = initial
  return {
    getItemAsync: vi.fn(async () => value),
    setItemAsync: vi.fn(async (_key: string, next: string) => {
      value = next
    })
  }
}

afterEach(() => {
  vi.useRealTimers()
  for (const db of databases.splice(0)) db.close()
})

describe('relay naming cache', () => {
  test('defaults to unnamed and persists only an exact true value', async () => {
    const db = database()
    const store = createNamingStore(db)
    expect(await store.read()).toBe(false)
    await store.save(true)
    expect(await createNamingStore(db).read()).toBe(true)
    await db.runAsync("UPDATE setting SET value = 'TRUE' WHERE key = 'typesafe_named'")
    expect(await store.read()).toBe(false)
  })

  test('keeps one valid anonymous ID in the device keychain', async () => {
    const storage = identityStorage()
    const created = '5f0e7a8e-3c2b-4d1a-9b6e-2f4c8d0a1b3c'
    expect(await getOrCreateUserId(storage, () => created)).toBe(created)
    expect(await getOrCreateUserId(storage, () => 'should-not-be-used')).toBe(created)
    expect(storage.setItemAsync).toHaveBeenCalledTimes(1)
  })

  test('fetches the relay choice at launch and saves a valid answer', async () => {
    const db = database()
    const store = createNamingStore(db)
    const request = vi.fn(async () => Response.json({ typesafeNamed: true }))

    expect(
      await refreshNaming({
        store,
        storage: identityStorage('5f0e7a8e-3c2b-4d1a-9b6e-2f4c8d0a1b3c'),
        createId: () => 'unused',
        request,
        relayUrl: 'https://relay.example/',
        version: '0.1.0',
        buildKind: 'simulator'
      })
    ).toBe(true)
    expect(await createNamingStore(db).read()).toBe(true)
    expect(request).toHaveBeenCalledWith(
      'https://relay.example/v1/config',
      expect.objectContaining({
        method: 'GET',
        headers: {
          'X-Turn-User': '5f0e7a8e-3c2b-4d1a-9b6e-2f4c8d0a1b3c',
          'X-Turn-Version': '0.1.0',
          'X-Turn-Build': 'simulator'
        }
      })
    )
  })

  test('keeps the cached choice when the relay fails or sends an invalid flag', async () => {
    const store = createNamingStore(database())
    await store.save(true)
    const options = {
      store,
      storage: identityStorage('5f0e7a8e-3c2b-4d1a-9b6e-2f4c8d0a1b3c'),
      createId: () => 'unused',
      relayUrl: 'https://relay.example',
      version: '0.1.0',
      buildKind: 'device' as const
    }
    expect(await refreshNaming({ ...options, request: async () => Response.json({ typesafeNamed: 'true' }) })).toBe(
      true
    )
    expect(await refreshNaming({ ...options, request: async () => Promise.reject(new Error('offline')) })).toBe(true)
    expect(await store.read()).toBe(true)
  })

  test('aborts a stalled config request after three seconds and keeps the cache', async () => {
    vi.useFakeTimers()
    const store = createNamingStore(database())
    await store.save(true)
    const request = vi.fn(
      (_url: string, init: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => reject(new Error('aborted')))
        })
    )
    const result = refreshNaming({
      store,
      storage: identityStorage('5f0e7a8e-3c2b-4d1a-9b6e-2f4c8d0a1b3c'),
      createId: () => 'unused',
      request,
      relayUrl: 'https://relay.example',
      version: '0.1.0',
      buildKind: 'device'
    })
    await vi.advanceTimersByTimeAsync(3_000)
    expect(await result).toBe(true)
    expect(request).toHaveBeenCalledTimes(1)
  })
})

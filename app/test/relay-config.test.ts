import { DatabaseSync } from 'node:sqlite'
import { afterEach, describe, expect, test, vi } from 'vitest'
import type { Config } from '@turn/shared/relay'
import { startingPolicy } from '@turn/shared/row'
import { createConfigClient } from '../src/relay/config'

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
    getItemAsync: vi.fn(async (_key: string) => value),
    setItemAsync: vi.fn(async (_key: string, next: string) => {
      value = next
    })
  }
}

const remoteConfig: Config = {
  jevOn: true,
  typesafeNamed: true,
  freeLinesLeft: 13,
  policy: startingPolicy
}

const validId = '5f0e7a8e-3c2b-4d1a-9b6e-2f4c8d0a1b3c'

function clientPorts(
  db: ReturnType<typeof database>,
  overrides: Partial<{
    storage: ReturnType<typeof identityStorage>
    createId: () => string
    request: (url: string, init: RequestInit) => Promise<Response>
    buildKind: 'device' | 'simulator'
  }> = {}
) {
  const storage = overrides.storage ?? identityStorage()
  return {
    setting: async (key: string) => {
      const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM setting WHERE key = ?', key)
      return row?.value ?? null
    },
    setSetting: async (key: string, value: string | null) => {
      if (value === null) {
        await db.runAsync('DELETE FROM setting WHERE key = ?', key)
      } else {
        await db.runAsync(
          'INSERT INTO setting (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value',
          key,
          value
        )
      }
    },
    getItemAsync: storage.getItemAsync,
    setItemAsync: storage.setItemAsync,
    createId: overrides.createId ?? (() => validId),
    request: overrides.request ?? (async () => Response.json(remoteConfig)),
    relayUrl: 'https://relay.example/',
    version: '0.1.0',
    buildKind: overrides.buildKind ?? ('simulator' as const)
  }
}

afterEach(() => {
  vi.useRealTimers()
  for (const db of databases.splice(0)) db.close()
})

describe('relay configuration client', () => {
  test('keeps the existing privacy notice name while migrating the old cache', async () => {
    const db = database()
    const ports = clientPorts(db)
    await ports.setSetting('typesafe_named', 'true')
    const client = createConfigClient(ports)

    expect(await client.read()).toEqual({
      jevOn: false,
      typesafeNamed: true,
      freeLinesLeft: 20,
      policy: startingPolicy
    })
    expect(client.typesafeNamed()).toBe(true)
    expect(await ports.setting('relay_config')).toBe(
      JSON.stringify({
        jevOn: false,
        typesafeNamed: true,
        freeLinesLeft: 20,
        policy: startingPolicy
      })
    )
  })

  test('fetches and caches the full config with the three relay headers', async () => {
    const db = database()
    const storage = identityStorage()
    const request = vi.fn((_url: string, _init: RequestInit): Promise<Response> =>
      Promise.resolve(Response.json(remoteConfig))
    )
    const ports = clientPorts(db, { storage, request })
    const client = createConfigClient(ports)

    expect(await client.refresh()).toEqual(remoteConfig)
    expect(await ports.setting('relay_config')).toBe(JSON.stringify(remoteConfig))
    expect(await createConfigClient(clientPorts(db, { storage })).read()).toEqual(remoteConfig)
    expect(client.typesafeNamed()).toBe(true)
    expect(client.headers()).toEqual({
      'X-Turn-User': validId,
      'X-Turn-Version': '0.1.0',
      'X-Turn-Build': 'simulator'
    })
    expect(request).toHaveBeenCalledWith(
      'https://relay.example/v1/config',
      expect.objectContaining({
        method: 'GET',
        headers: {
          'X-Turn-User': validId,
          'X-Turn-Version': '0.1.0',
          'X-Turn-Build': 'simulator'
        }
      })
    )
    expect((request.mock.calls[0][1] as RequestInit).headers).not.toHaveProperty('Content-Type')
  })

  test('creates one Keychain ID, reuses it, and replaces a saved non-UUID', async () => {
    const db = database()
    const storage = identityStorage('old-id')
    const createId = vi.fn(() => validId)
    const request = vi.fn((_url: string, _init: RequestInit): Promise<Response> =>
      Promise.resolve(Response.json(remoteConfig))
    )
    const client = createConfigClient(clientPorts(db, { storage, createId, request }))

    await client.refresh()
    await client.refresh()

    expect(storage.getItemAsync).toHaveBeenCalledWith('turn-user-id')
    expect(storage.setItemAsync).toHaveBeenCalledExactlyOnceWith('turn-user-id', validId)
    expect(createId).toHaveBeenCalledExactlyOnceWith()
    expect(request).toHaveBeenCalledTimes(2)
    expect(request.mock.calls.map(([, init]) => (init.headers as Record<string, string>)['X-Turn-User'])).toEqual([
      validId,
      validId
    ])
  })

  test('keeps a cached config after relay failures and invalid response shapes', async () => {
    const db = database()
    const storage = identityStorage(validId)
    let response: (url: string, init: RequestInit) => Promise<Response> = async () => Response.json(remoteConfig)
    const request = vi.fn((url: string, init: RequestInit) => response(url, init))
    const client = createConfigClient(clientPorts(db, { storage, request }))

    await client.refresh()
    response = async () => Response.json({ ...remoteConfig, policy: { floor: 0.1 } })
    expect(await client.refresh()).toEqual(remoteConfig)
    response = async () => Promise.reject(new Error('offline'))
    expect(await client.refresh()).toEqual(remoteConfig)
    expect(await client.read()).toEqual(remoteConfig)
    expect(client.typesafeNamed()).toBe(true)
  })

  test('stays unnamed without a cached config after a three-second timeout', async () => {
    vi.useFakeTimers()
    const db = database()
    const request = vi.fn(
      (_url: string, init: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => reject(new Error('aborted')))
        })
    )
    const client = createConfigClient(clientPorts(db, { request }))

    const refreshing = client.refresh()
    await vi.advanceTimersByTimeAsync(3_000)

    expect((await refreshing).typesafeNamed).toBe(false)
    expect(client.typesafeNamed()).toBe(false)
    expect(request).toHaveBeenCalledTimes(1)
  })
})

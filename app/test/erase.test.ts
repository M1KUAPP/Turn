import { DatabaseSync } from 'node:sqlite'
import { afterEach, describe, expect, test, vi } from 'vitest'
import type { Config } from '@turn/shared/relay'
import { startingPolicy } from '@turn/shared/row'
import starterBank from '../src/content/starter-bank.json'
import { createBankStore, type BankDatabase } from '../src/bank/store'
import { createConfigClient } from '../src/relay/config'
import { eraseAllData } from '../src/erase'

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

describe('erase all data', () => {
  test('ends Listen, stops speech, resets stats, then erases the bank', async () => {
    const calls: string[] = []

    await eraseAllData({
      listen: { end: async () => void calls.push('listen.end') },
      speech: { stop: () => void calls.push('speech.stop') },
      stats: { reset: async () => void calls.push('stats.reset') },
      bank: { eraseAll: async () => void calls.push('bank.eraseAll') }
    })

    expect(calls).toEqual(['listen.end', 'speech.stop', 'stats.reset', 'bank.eraseAll'])
  })

  test('does not erase the bank when resetting stats fails', async () => {
    const calls: string[] = []

    await expect(
      eraseAllData({
        listen: { end: async () => void calls.push('listen.end') },
        speech: { stop: () => void calls.push('speech.stop') },
        stats: {
          reset: async () => {
            calls.push('stats.reset')
            throw new Error('stats unavailable')
          }
        },
        bank: { eraseAll: async () => void calls.push('bank.eraseAll') }
      })
    ).rejects.toThrow('stats unavailable')

    expect(calls).toEqual(['listen.end', 'speech.stop', 'stats.reset'])
  })

  test('keeps the relay user ID in SecureStore after erasing the real bank', async () => {
    const bank = createBankStore(database(), starterBank)
    await bank.initialize()

    const firstId = '5f0e7a8e-3c2b-4d1a-9b6e-2f4c8d0a1b3c'
    const replacementId = 'c57c6e31-4536-4a02-9b7f-9e71e4907213'
    const ids = [firstId, replacementId]
    let storedId: string | null = null
    const secureStore = {
      getItemAsync: vi.fn(async (_key: string) => storedId),
      setItemAsync: vi.fn(async (_key: string, value: string) => {
        storedId = value
      }),
      deleteItemAsync: vi.fn(async (_key: string) => {
        storedId = null
      })
    }
    const config: Config = {
      jevOn: true,
      typesafeNamed: true,
      freeLinesLeft: 13,
      policy: startingPolicy
    }
    const requestedIds: string[] = []
    const request = vi.fn(async (_url: string, init: RequestInit) => {
      requestedIds.push((init.headers as Record<string, string>)['X-Turn-User'])
      return Response.json(config)
    })
    const makeConfigClient = () =>
      createConfigClient({
        setting: bank.setting,
        setSetting: bank.setSetting,
        getItemAsync: secureStore.getItemAsync,
        setItemAsync: secureStore.setItemAsync,
        createId: () => ids.shift()!,
        request,
        relayUrl: 'https://relay.example/',
        version: '0.1.0',
        buildKind: 'simulator'
      })

    await makeConfigClient().refresh()
    expect(storedId).toBe(firstId)

    const parts = {
      listen: { end: async () => {} },
      speech: { stop: () => {} },
      stats: { reset: async () => {} },
      bank,
      secureStore
    }
    await eraseAllData(parts)
    await makeConfigClient().refresh()

    expect(secureStore.deleteItemAsync).not.toHaveBeenCalled()
    expect(storedId).toBe(firstId)
    expect(requestedIds).toEqual([firstId, firstId])
  })
})

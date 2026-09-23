import { DatabaseSync } from 'node:sqlite'
import { afterEach, describe, expect, test, vi } from 'vitest'
import starterBank from '../src/content/starter-bank.json'
import { createBankStore, localDay, type BankDatabase } from '../src/bank/store'

const databases: DatabaseSync[] = []

function database() {
  const sqlite = new DatabaseSync(':memory:')
  databases.push(sqlite)
  const adapter: BankDatabase = {
    execAsync: async (sql: string) => {
      sqlite.exec(sql)
    },
    runAsync: async (sql: string, ...args: (string | number)[]) => {
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

describe('bank store', () => {
  test('seeds only once and reads Quick first with the strip excluded', async () => {
    const db = database()
    const store = createBankStore(db, starterBank, () => new Date(2026, 8, 23))
    await store.initialize()
    const categories = await store.categories()
    expect(categories[0].id).toBe('quick')
    expect(categories.some((category) => category.id === 'strip')).toBe(false)
    expect((await store.phrases('quick')).map((phrase) => phrase.text).slice(0, 3)).toEqual(['Yes', 'No', 'Not sure'])

    await db.runAsync("UPDATE phrase SET text = 'Absolutely' WHERE id = 'yes'")
    await store.initialize()
    expect((await store.phrases('quick'))[0].text).toBe('Absolutely')
  })

  test('records each spoken tap in a local day and prunes rows outside 30 days', async () => {
    const db = database()
    const date = new Date(2026, 8, 23, 22, 30)
    const store = createBankStore(db, starterBank, () => date)
    await store.initialize()
    await store.recordTap('yes')
    await store.recordTap('yes')
    expect(await store.tapCount('yes', localDay(date))).toBe(2)
    await db.runAsync('INSERT INTO tap (phrase_id, day, count) VALUES (?, ?, ?)', 'yes', localDay(date) - 30, 7)
    await store.initialize()
    expect(await store.tapCount('yes', localDay(date) - 30)).toBe(0)
    expect(await store.tapCount('yes', localDay(date))).toBe(2)
  })

  test('publishes bank edits and preserves visible order after taps', async () => {
    const store = createBankStore(database(), starterBank, () => new Date(2026, 8, 23))
    await store.initialize()
    const before = (await store.phrases('quick')).map((phrase) => phrase.id)
    let changes = 0
    const unsubscribe = store.subscribe(() => {
      changes++
    })
    await store.updatePhraseText('yes', 'Certainly')
    await store.recordTap('yes')
    expect(changes).toBe(1)
    expect((await store.phrases('quick')).map((phrase) => phrase.id)).toEqual(before)
    unsubscribe()
  })

  test('the debug action seeds 2,000 phrases without duplicating them', async () => {
    vi.stubGlobal('__DEV__', true)
    try {
      const store = createBankStore(database(), starterBank, () => new Date(2026, 8, 23))
      await store.initialize()
      await store.seedDebugPhrases()
      await store.seedDebugPhrases()
      const phrases = await store.phrases('debug-load')
      expect(phrases).toHaveLength(2000)
      expect(phrases[0].text).toBe('Test phrase 1')
      expect(phrases.at(-1)?.text).toBe('Test phrase 2000')
    } finally {
      vi.unstubAllGlobals()
    }
  })
})

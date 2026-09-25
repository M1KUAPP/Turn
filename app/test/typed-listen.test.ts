import { DatabaseSync } from 'node:sqlite'
import { afterEach, describe, expect, test } from 'vitest'
import { createBankStore, type BankDatabase } from '../src/bank/store'
import starterBank from '../src/content/starter-bank.json'
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

afterEach(() => {
  for (const db of databases.splice(0)) db.close()
})

async function session() {
  const bank = createBankStore(database(), starterBank, () => new Date(2026, 8, 23))
  await bank.initialize()
  const listen = createTypedListenSession(bank)
  await listen.ready
  listen.start()
  return { bank, listen }
}

describe('typed partner lines ranked on the phone', () => {
  test('yes-or-no lines put the fixed buttons first and never show a big button', async () => {
    const { listen } = await session()
    await listen.send('Do you want some water?', 'home')
    const state = listen.getSnapshot()
    expect(state.row.seq).toBe(1)
    expect(state.row.slots.slice(0, 3)).toEqual(['yes', 'no', 'not-sure'])
    expect(state.row.big).toBeNull()
    expect(state.slots.slice(0, 3).map((phrase) => phrase?.text)).toEqual(['Yes', 'No', 'Not sure'])
    expect(state.line).toBe('Do you want some water?')
    expect(state.rankedOnPhone).toBe(true)
    listen.dispose()
  })

  test('a sharing line shows saved phrases, while an unrelated line holds the previous row', async () => {
    const { listen } = await session()
    await listen.send('Are you tired?', 'home')
    const first = listen.getSnapshot()
    expect(first.row.big).toBeNull()
    expect(first.slots.some((phrase) => phrase?.text === "I'm tired")).toBe(true)

    await listen.send('Zyxw qvpr?', 'home')
    const held = listen.getSnapshot()
    expect(held.row.seq).toBe(2)
    expect(held.row.answers).toBe(1)
    expect(held.row.slots).toEqual(first.row.slots)
    expect(held.answeringLine).toBe('Are you tired?')
    expect(held.line).toBe('Zyxw qvpr?')

    listen.clear()
    expect(listen.getSnapshot().row.slots.every((slot) => slot === null)).toBe(true)
    expect(listen.getSnapshot().line).toBeNull()
    listen.end()
    expect(listen.getSnapshot().active).toBe(false)
    listen.dispose()
  })

  test('a new typed phrase enters the live index, and blank lines do nothing', async () => {
    const { bank, listen } = await session()
    await bank.saveTypedPhrase('The new nurse is kind')
    await listen.send('Is the new nurse here?', 'clinic')
    expect(listen.getSnapshot().slots.some((phrase) => phrase?.text === 'The new nurse is kind')).toBe(true)
    const seq = listen.getSnapshot().row.seq
    await listen.send('   ', 'clinic')
    expect(listen.getSnapshot().row.seq).toBe(seq)
    listen.dispose()
  })

  test('an older ranking cannot replace a newer line or a cleared row', async () => {
    const bank = createBankStore(database(), starterBank, () => new Date(2026, 8, 23))
    await bank.initialize()
    let hold: ((value: Awaited<ReturnType<typeof bank.rankingData>>) => void) | undefined
    let reads = 0
    const delayed = {
      subscribe: bank.subscribe,
      rankingData: () => {
        reads++
        return reads === 2 || reads === 4
          ? new Promise<Awaited<ReturnType<typeof bank.rankingData>>>((resolve) => {
              hold = resolve
            })
          : bank.rankingData()
      }
    }
    const listen = createTypedListenSession(delayed)
    await listen.ready
    listen.start()

    const first = listen.send('Are you tired?', 'home')
    const releaseFirst = hold
    const second = listen.send('Do you want some water?', 'home')
    await second
    releaseFirst?.(await bank.rankingData())
    await first
    expect(listen.getSnapshot().row.seq).toBe(2)
    expect(listen.getSnapshot().line).toBe('Do you want some water?')
    expect(listen.getSnapshot().row.slots.slice(0, 3)).toEqual(['yes', 'no', 'not-sure'])

    const third = listen.send('Are you tired?', 'home')
    const releaseThird = hold
    listen.clear()
    releaseThird?.(await bank.rankingData())
    await third
    expect(listen.getSnapshot().row.slots.every((slot) => slot === null)).toBe(true)
    expect(listen.getSnapshot().line).toBeNull()
    listen.dispose()
  })
})

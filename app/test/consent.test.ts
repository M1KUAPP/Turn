import { DatabaseSync } from 'node:sqlite'
import { afterEach, describe, expect, test, vi } from 'vitest'
import type { BankDatabase } from '../src/bank/store'
import { createBankStore } from '../src/bank/store'
import starterBank from '../src/content/starter-bank.json'
import type { Config } from '@turn/shared/relay'
import { startingPolicy } from '@turn/shared/row'
import { createConsentController } from '../src/consent/controller'
import { createLiveListenSession } from '../src/listen/live-session'
import type { ListenEngine } from '../src/listen/engine'
import { createTypedListenSession } from '../src/listen/typed-session'

const databases: DatabaseSync[] = []
const sessions: Array<ReturnType<typeof createLiveListenSession>> = []

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

afterEach(async () => {
  for (const session of sessions.splice(0)) await session.dispose()
  for (const db of databases.splice(0)) db.close()
})

const configValue: Config = {
  jevOn: true,
  typesafeNamed: false,
  freeLinesLeft: 20,
  policy: startingPolicy
}

function configPort(initialNamed = false, refreshNames: boolean[] = []) {
  let named = initialNamed
  const listeners = new Set<() => void>()
  const value = () => ({ ...configValue, typesafeNamed: named })
  return {
    read: vi.fn(async () => value()),
    refresh: vi.fn(async () => {
      if (refreshNames.length) named = refreshNames.shift()!
      for (const listener of listeners) listener()
      return value()
    }),
    typesafeNamed: () => named,
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    }
  }
}

function fakeEngine() {
  const engine: ListenEngine = {
    id: 'turn-listen',
    listen: vi.fn(() => () => undefined),
    availability: vi.fn(async () => 'installed' as const),
    installAsset: vi.fn(async () => undefined),
    start: vi.fn(async () => undefined),
    pause: vi.fn(async () => undefined),
    resume: vi.fn(async () => undefined),
    stop: vi.fn(async () => undefined),
    endLine: vi.fn(async () => undefined),
    muteForSpeech: vi.fn(async () => undefined)
  }
  return engine
}

async function rig(
  options: { db?: BankDatabase; named?: boolean; refreshNames?: boolean[]; typedOnly?: boolean } = {}
) {
  const db = options.db ?? database()
  const bank = createBankStore(db, starterBank, () => new Date('2026-09-25T15:30:00.000Z'))
  await bank.initialize()
  const config = configPort(options.named, options.refreshNames)
  let controller: ReturnType<typeof createConsentController>
  let lineRequests = 0
  let chosenVoice = 'personal-voice-id'
  const spoken: Array<{ text: string; voice: string }> = []
  const typed = createTypedListenSession(bank)
  await typed.ready
  const engine = fakeEngine()
  const session = createLiveListenSession({
    typed,
    engine: options.typedOnly ? null : engine,
    now: () => 123,
    log: () => {}
  })
  sessions.push(session)
  const listen = {
    start: vi.fn(() => session.start()),
    end: vi.fn(async () => session.end()),
    blocked: vi.fn(() => false)
  }
  const speech = {
    speak: vi.fn(async (text: string) => {
      spoken.push({ text, voice: chosenVoice })
    })
  }
  const navigate = vi.fn()
  controller = createConsentController({
    setting: bank.setting,
    setSetting: bank.setSetting,
    now: () => new Date('2026-09-25T15:30:00.000Z'),
    config,
    speech,
    listen,
    navigate
  })
  await controller.ready
  return {
    db,
    bank,
    config,
    controller,
    listen,
    engine,
    session,
    speech,
    navigate,
    spoken,
    setChosenVoice: (voice: string) => {
      chosenVoice = voice
    },
    isActive: () => session.getSnapshot().active,
    requestLine: () => {
      if (!controller.snapshot().requestsBlocked) lineRequests++
    },
    lineRequests: () => lineRequests
  }
}

describe('consent controller', () => {
  test('shows permission once, returns after Not now, and leaves speech available', async () => {
    const app = await rig()

    expect(await app.controller.startListen()).toBe('permission')
    expect(app.listen.start).not.toHaveBeenCalled()
    app.controller.notNow()
    expect(await app.bank.setting('listen_permission')).toBeNull()
    expect(app.isActive()).toBe(false)
    expect(app.listen.end).toHaveBeenCalledOnce()
    expect(app.engine.start).not.toHaveBeenCalled()
    expect(app.navigate).toHaveBeenLastCalledWith('/')

    await app.controller.readAloud()
    expect(app.speech.speak).toHaveBeenCalledOnce()
    expect(await app.controller.startListen()).toBe('permission')
    expect(app.config.refresh).toHaveBeenCalledTimes(2)
  })

  test('Allow stores permission and its date before opening the partner card', async () => {
    const app = await rig()

    await app.controller.allow()

    expect(await app.bank.setting('listen_permission')).toBe('true')
    expect(await app.bank.setting('listen_permission_date')).toBe('2026-09-25')
    expect(app.navigate).toHaveBeenLastCalledWith('/consent')
    expect(app.listen.start).not.toHaveBeenCalled()
  })

  test('waits for They agreed before starting the engine and ends on partner decline', async () => {
    const app = await rig()
    await app.controller.grant()

    expect(await app.controller.startListen()).toBe('consent')
    expect(app.listen.start).not.toHaveBeenCalled()
    expect(app.engine.start).not.toHaveBeenCalled()
    app.controller.partnerDeclined()
    expect(app.isActive()).toBe(false)
    expect(app.listen.end).toHaveBeenCalledOnce()
    expect(app.engine.start).not.toHaveBeenCalled()
    expect(await app.controller.startListen()).toBe('consent')
    expect(app.config.refresh).toHaveBeenCalledTimes(2)
    expect(app.listen.start).not.toHaveBeenCalled()
    expect(app.engine.start).not.toHaveBeenCalled()

    await app.controller.partnerAgreed()
    expect(app.listen.start).toHaveBeenCalledOnce()
    expect(app.engine.start).toHaveBeenCalledOnce()
    expect(app.isActive()).toBe(true)
    expect(app.navigate).toHaveBeenLastCalledWith('/')
  })

  test('They agreed without a saved permission opens the step and starts nothing', async () => {
    const app = await rig()

    await app.controller.partnerAgreed()

    expect(app.listen.start).not.toHaveBeenCalled()
    expect(app.engine.start).not.toHaveBeenCalled()
    expect(app.isActive()).toBe(false)
    expect(app.navigate).toHaveBeenLastCalledWith('/permission')
  })

  test('They agreed starts the typed session without touching an engine', async () => {
    const app = await rig({ typedOnly: true })
    await app.controller.grant()
    await app.controller.startListen()

    await app.controller.partnerAgreed()

    expect(app.isActive()).toBe(true)
    expect(app.engine.listen).not.toHaveBeenCalled()
    expect(app.engine.availability).not.toHaveBeenCalled()
    expect(app.engine.installAsset).not.toHaveBeenCalled()
    expect(app.engine.start).not.toHaveBeenCalled()
    expect(app.engine.pause).not.toHaveBeenCalled()
    expect(app.engine.resume).not.toHaveBeenCalled()
    expect(app.engine.stop).not.toHaveBeenCalled()
    expect(app.engine.endLine).not.toHaveBeenCalled()
    expect(app.engine.muteForSpeech).not.toHaveBeenCalled()
    expect(app.controller.snapshot().requestsBlocked).toBe(false)
  })

  test('reads the card lead and four facts in order in the selected voice', async () => {
    const app = await rig({ named: true })
    app.setChosenVoice('selected-voice')
    await app.controller.grant()
    await app.controller.startListen()

    await app.controller.readAloud()

    expect(app.spoken).toEqual([
      {
        text: 'Can my phone listen while we talk? It turns your words into text on this phone. Your words, with any names it recognizes swapped for tags, go to TypeSafe to pick my replies from my own phrases. No audio is recorded. I can pause it at any time.',
        voice: 'selected-voice'
      }
    ])
  })

  test('keeps under-18 mode across a new controller on the same database and blocks mic and line requests', async () => {
    const db = database()
    const first = await rig({ db })
    await first.controller.grant()
    await first.controller.setUnder18(true)

    const next = await rig({ db })
    expect(next.controller.snapshot().under18).toBe(true)
    expect(next.controller.snapshot().requestsBlocked).toBe(true)
    expect(await next.controller.startListen()).toBe('consent')
    await next.controller.partnerAgreed()

    next.requestLine()
    expect(next.engine.start).not.toHaveBeenCalled()
    expect(next.isActive()).toBe(false)
    expect(next.lineRequests()).toBe(0)
  })

  test('turning on under-18 mode stops a running engine immediately', async () => {
    const app = await rig()
    await app.controller.grant()
    await app.controller.partnerAgreed()
    expect(app.engine.start).toHaveBeenCalledOnce()

    await app.controller.setUnder18(true)

    expect(app.listen.end).toHaveBeenCalledOnce()
    expect(app.engine.stop).toHaveBeenCalledOnce()
    expect(app.isActive()).toBe(false)
    expect(app.controller.snapshot().requestsBlocked).toBe(true)
  })

  test('withdrawal ends Listen mode and blocks lines until permission is granted again', async () => {
    const app = await rig()
    await app.controller.grant()
    await app.controller.startListen()
    await app.controller.partnerAgreed()
    expect(app.isActive()).toBe(true)

    await app.controller.withdraw()
    app.requestLine()
    expect(app.isActive()).toBe(false)
    expect(app.listen.end).toHaveBeenCalledOnce()
    expect(app.engine.stop).toHaveBeenCalledOnce()
    expect(await app.bank.setting('listen_permission')).toBeNull()
    expect(await app.bank.setting('listen_permission_date')).toBeNull()
    expect(app.controller.snapshot().requestsBlocked).toBe(true)
    expect(app.controller.snapshot().note).toBe(
      'Listen mode is off, and nothing more leaves this phone until you allow it again.'
    )
    expect(app.lineRequests()).toBe(0)

    await app.controller.grant()
    app.requestLine()
    expect(app.controller.snapshot().requestsBlocked).toBe(false)
    expect(app.lineRequests()).toBe(1)
  })

  test('builds both texts from the configuration refreshed before each start', async () => {
    const app = await rig({ refreshNames: [true, false] })
    await app.controller.grant()

    expect(await app.controller.startListen()).toBe('consent')
    expect(app.controller.snapshot().typesafeNamed).toBe(true)
    expect(app.controller.snapshot().step.paragraphs[0]).toContain('TypeSafe')
    expect(app.controller.snapshot().card.facts[1]).toContain('TypeSafe')

    expect(await app.controller.startListen()).toBe('consent')
    expect(app.controller.snapshot().typesafeNamed).toBe(false)
    expect(app.controller.snapshot().step.paragraphs[0]).toContain('a third-party AI service in the United States')
    expect(app.controller.snapshot().card.facts[1]).toContain('a third-party AI service in the United States')
  })
})

import { DatabaseSync } from 'node:sqlite'
import { afterEach, describe, expect, test, vi } from 'vitest'
import type { BankDatabase } from '../src/bank/store'
import { createBankStore } from '../src/bank/store'
import starterBank from '../src/content/starter-bank.json'
import { createLiveListenSession } from '../src/listen/live-session'
import { createTypedListenSession } from '../src/listen/typed-session'
import type { AssetStatus, ListenEngine, ListenEngineEvents, ListenLine } from '../src/listen/engine'
import type { TurnListen } from '../../modules/turn-listen/src'

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

type FakeModule = {
  module: Pick<TurnListen, 'setListenMode' | 'muteForSpeech'>
  setListenMode: ReturnType<typeof vi.fn>
  muteForSpeech: ReturnType<typeof vi.fn>
}

function createFakeModule(callLog: string[]): FakeModule {
  const setListenMode = vi.fn(async (active: boolean) => {
    callLog.push(`module.setListenMode:${active}`)
  })
  const muteForSpeech = vi.fn(async (muted: boolean) => {
    callLog.push(`module.muteForSpeech:${muted}`)
  })
  return {
    module: { setListenMode, muteForSpeech },
    setListenMode,
    muteForSpeech
  }
}

function fakeEngine(callLog: string[], status: AssetStatus = 'installed') {
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
    start: vi.fn(async () => {
      callLog.push('engine.start')
    }),
    pause: vi.fn(async () => {
      callLog.push('engine.pause')
    }),
    resume: vi.fn(async () => {
      callLog.push('engine.resume')
    }),
    stop: vi.fn(async () => {
      callLog.push('engine.stop')
    }),
    endLine: vi.fn(async () => {
      callLog.push('engine.endLine')
      events?.onLine({ text: currentText, endedAt: endedAt++, silenceWindowMs: 500 })
    })
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
    module?: Pick<TurnListen, 'setListenMode' | 'muteForSpeech'> | null
    engine?: ListenEngine | null
    status?: AssetStatus
  } = {}
) {
  const callLog: string[] = []
  const bank = createBankStore(database(), starterBank, () => new Date(2026, 8, 23))
  await bank.initialize()
  const typed = createTypedListenSession(bank)
  await typed.ready
  const fakeMod = options.module === undefined ? createFakeModule(callLog) : null
  const module = options.module === undefined ? fakeMod?.module : options.module
  const fakeEng = options.engine === undefined ? fakeEngine(callLog, options.status) : null
  const engine = options.engine === undefined ? (fakeEng?.engine ?? null) : options.engine
  const live = createLiveListenSession({
    typed,
    engine,
    module,
    now: vi.fn(() => 2000),
    log: vi.fn()
  })
  return { bank, typed, live, engine, fakeEng, module, fakeMod, callLog }
}

describe('listen audio session', () => {
  test('start() sets the mode true once with microphone', async () => {
    const { live, fakeMod } = await session()
    await live.start({ microphone: true })
    expect(fakeMod?.setListenMode).toHaveBeenCalledTimes(1)
    expect(fakeMod?.setListenMode).toHaveBeenCalledWith(true)

    await live.start({ microphone: true })
    expect(fakeMod?.setListenMode).toHaveBeenCalledTimes(1)
    await live.dispose()
  })

  test('start() sets the mode true once when typed', async () => {
    const { live, fakeMod } = await session()
    await live.start({ microphone: false })
    expect(fakeMod?.setListenMode).toHaveBeenCalledTimes(1)
    expect(fakeMod?.setListenMode).toHaveBeenCalledWith(true)
    await live.dispose()
  })

  test('micOff(), pause(), and resume() leave the listen mode active', async () => {
    const { live, fakeMod } = await session()
    await live.start()
    expect(fakeMod?.setListenMode).toHaveBeenCalledTimes(1)
    expect(fakeMod?.setListenMode).toHaveBeenCalledWith(true)

    await live.pause()
    expect(fakeMod?.setListenMode).toHaveBeenCalledTimes(1)

    await live.resume()
    expect(fakeMod?.setListenMode).toHaveBeenCalledTimes(1)

    await live.micOff()
    expect(fakeMod?.setListenMode).toHaveBeenCalledTimes(1)

    await live.dispose()
  })

  test('end() sets the mode false once', async () => {
    const { live, fakeMod } = await session()
    await live.start()
    expect(fakeMod?.setListenMode).toHaveBeenCalledWith(true)

    await live.end()
    expect(fakeMod?.setListenMode).toHaveBeenCalledTimes(2)
    expect(fakeMod?.setListenMode).toHaveBeenLastCalledWith(false)

    await live.end()
    expect(fakeMod?.setListenMode).toHaveBeenCalledTimes(2)

    await live.dispose()
    expect(fakeMod?.setListenMode).toHaveBeenCalledTimes(2)
  })

  test('end() stops the engine before it leaves Listen mode', async () => {
    const { live, callLog } = await session()
    await live.start()

    await live.end()

    expect(callLog).toContain('engine.stop')
    expect(callLog.indexOf('module.setListenMode:false')).toBeGreaterThan(callLog.indexOf('engine.stop'))
  })

  test('a session started while end() stops the engine keeps the Listen mode category', async () => {
    const { live, engine, fakeMod } = await session()
    await live.start()
    let finishStop = () => {}
    vi.mocked(engine!.stop).mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finishStop = resolve
        })
    )

    const ending = live.end()
    await live.start()
    finishStop()
    await ending

    expect(fakeMod?.setListenMode).toHaveBeenLastCalledWith(true)
    await live.dispose()
  })

  test('while capturing, beforeSpeak() calls the engine endLine() before muteForSpeech(true)', async () => {
    const { live, fakeEng, fakeMod, callLog } = await session()
    await live.start()
    fakeEng?.partial('Hello there')

    await live.beforeSpeak()

    expect(callLog).toContain('engine.endLine')
    expect(callLog).toContain('module.muteForSpeech:true')
    const endLineIndex = callLog.indexOf('engine.endLine')
    const muteIndex = callLog.indexOf('module.muteForSpeech:true')
    expect(endLineIndex).toBeGreaterThan(-1)
    expect(muteIndex).toBeGreaterThan(endLineIndex)
    await live.dispose()
  })

  test('while Paused, beforeSpeak() calls neither endLine() nor muteForSpeech()', async () => {
    const { live, fakeEng, fakeMod } = await session()
    await live.start()
    fakeEng?.partial('Hello there')
    await live.pause()

    await live.beforeSpeak()
    expect(fakeEng?.engine.endLine).not.toHaveBeenCalled()
    expect(fakeMod?.muteForSpeech).not.toHaveBeenCalled()
    await live.dispose()
  })

  test('while typed, beforeSpeak() calls neither endLine() nor muteForSpeech()', async () => {
    const { live, fakeEng, fakeMod } = await session()
    await live.start({ microphone: false })

    await live.beforeSpeak()
    expect(fakeEng?.engine.endLine).not.toHaveBeenCalled()
    expect(fakeMod?.muteForSpeech).not.toHaveBeenCalled()
    await live.dispose()
  })

  test('with module: null, beforeSpeak() calls neither endLine() nor muteForSpeech()', async () => {
    const { live, fakeEng } = await session({ module: null })
    await live.start()
    fakeEng?.partial('Hello there')

    await live.beforeSpeak()
    expect(fakeEng?.engine.endLine).not.toHaveBeenCalled()
    await live.dispose()
  })

  test('afterSpeech() calls muteForSpeech(false) once when muted, and not at all when not muted', async () => {
    const { live, fakeEng, fakeMod } = await session()
    await live.start()

    live.afterSpeech()
    expect(fakeMod?.muteForSpeech).not.toHaveBeenCalled()

    fakeEng?.partial('Hello')
    await live.beforeSpeak()
    expect(fakeMod?.muteForSpeech).toHaveBeenCalledWith(true)

    live.afterSpeech()
    expect(fakeMod?.muteForSpeech).toHaveBeenCalledWith(false)
    expect(fakeMod?.muteForSpeech).toHaveBeenCalledTimes(2)

    live.afterSpeech()
    expect(fakeMod?.muteForSpeech).toHaveBeenCalledTimes(2)
    await live.dispose()
  })

  test('end() after beforeSpeak() releases the mute', async () => {
    const { live, fakeEng, fakeMod } = await session()
    await live.start()
    fakeEng?.partial('Hello')
    await live.beforeSpeak()
    expect(fakeMod?.muteForSpeech).toHaveBeenCalledWith(true)

    await live.end()
    expect(fakeMod?.muteForSpeech).toHaveBeenCalledWith(false)

    live.afterSpeech()
    expect(fakeMod?.muteForSpeech).toHaveBeenCalledTimes(2)
    await live.dispose()
  })

  test('pause() and micOff() release a mute set by beforeSpeak()', async () => {
    const { live, fakeEng, fakeMod } = await session()
    await live.start()
    fakeEng?.partial('Hello')
    await live.beforeSpeak()
    expect(fakeMod?.muteForSpeech).toHaveBeenCalledWith(true)

    await live.pause()
    expect(fakeMod?.muteForSpeech).toHaveBeenCalledWith(false)

    await live.resume()
    fakeEng?.partial('Hello again')
    await live.beforeSpeak()
    expect(fakeMod?.muteForSpeech).toHaveBeenCalledTimes(3)

    await live.micOff()
    expect(fakeMod?.muteForSpeech).toHaveBeenCalledTimes(4)
    await live.dispose()
  })

  test('a failing muteForSpeech does not make beforeSpeak() throw', async () => {
    const { live, fakeEng, fakeMod } = await session()
    fakeMod?.muteForSpeech.mockRejectedValue(new Error('native mute failed'))
    await live.start()
    fakeEng?.partial('Hello')

    await expect(live.beforeSpeak()).resolves.toBeUndefined()
    await live.dispose()
  })
})

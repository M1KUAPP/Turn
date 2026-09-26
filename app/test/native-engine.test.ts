import { describe, expect, test, vi } from 'vitest'
import type { ListenEngineEvents } from '../src/listen/engine'
import type { TurnListen } from '../../modules/turn-listen/src'

vi.mock('../../modules/turn-listen/src', () => ({ turnListen: null }))

import { createNativeListenEngine } from '../src/listen/native-engine'

function fakeModule() {
  const remove = vi.fn()
  const listen = vi.fn((_events: ListenEngineEvents) => remove)
  const module: TurnListen = {
    findNames: async () => [],
    setGazetteer: async () => {},
    availability: vi.fn(async () => 'installed' as const),
    installAsset: vi.fn(async () => {}),
    start: vi.fn(async () => {}),
    pause: vi.fn(async () => {}),
    resume: vi.fn(async () => {}),
    stop: vi.fn(async () => {}),
    endLine: vi.fn(async () => {}),
    setListenMode: vi.fn(async () => {}),
    muteForSpeech: vi.fn(async () => {}),
    listen
  }
  return {
    module,
    remove
  }
}

describe('the native Listen engine adapter', () => {
  test('returns null when the optional native module is absent', () => {
    expect(createNativeListenEngine(null)).toBeNull()
  })

  test('forwards engine methods to the native module', async () => {
    const fake = fakeModule()
    const engine = createNativeListenEngine(fake.module)

    expect(engine?.id).toBe('turn-listen')
    await expect(engine?.availability()).resolves.toBe('installed')
    await engine?.installAsset()
    await engine?.start({ lang: 'en-US' })
    await engine?.pause()
    await engine?.resume()
    await engine?.endLine()
    await engine?.stop()

    expect(fake.module.availability).toHaveBeenCalledOnce()
    expect(fake.module.installAsset).toHaveBeenCalledOnce()
    expect(fake.module.start).toHaveBeenCalledOnce()
    expect(fake.module.start).toHaveBeenCalledWith({ lang: 'en-US' })
    expect(fake.module.pause).toHaveBeenCalledOnce()
    expect(fake.module.resume).toHaveBeenCalledOnce()
    expect(fake.module.endLine).toHaveBeenCalledOnce()
    expect(fake.module.stop).toHaveBeenCalledOnce()
  })

  test('forwards engine events and removes the module listener', () => {
    const fake = fakeModule()
    const engine = createNativeListenEngine(fake.module)
    const events: ListenEngineEvents = {
      onPartial: vi.fn(),
      onLine: vi.fn(),
      onState: vi.fn(),
      onAssetProgress: vi.fn(),
      onVoice: vi.fn()
    }
    const unsubscribe = engine?.listen(events)

    expect(fake.module.listen).toHaveBeenCalledWith(events)
    unsubscribe?.()
    expect(fake.remove).toHaveBeenCalledOnce()
  })
})

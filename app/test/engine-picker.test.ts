import { describe, expect, test, vi } from 'vitest'
import { pickEngine, pickListenEngine } from '../src/listen/engine-picker'
import type { AssetStatus, EngineChoice, ListenEngine } from '../src/listen/engine'
import Constants from 'expo-constants'
import appConfig from '../app.config'

vi.mock('expo-constants', () => ({
  default: { expoConfig: { extra: { buildKind: 'device', listenEngine: 'expo' } } }
}))

function engine(id: ListenEngine['id'], status: AssetStatus): ListenEngine {
  return {
    id,
    listen: () => () => undefined,
    availability: vi.fn(async () => status),
    installAsset: vi.fn(async () => undefined),
    start: vi.fn(async () => undefined),
    pause: vi.fn(async () => undefined),
    resume: vi.fn(async () => undefined),
    stop: vi.fn(async () => undefined),
    endLine: vi.fn(async () => undefined),
    muteForSpeech: vi.fn(async () => undefined)
  }
}

const choices: EngineChoice[] = ['auto', 'apple', 'expo', 'none']

describe('listen engine picker', () => {
  test.each(choices)('a Simulator always selects the typed path for %s', async (choice) => {
    const turnListen = vi.fn(() => engine('turn-listen', 'installed'))
    const expo = engine('expo-speech-recognition', 'installed')

    await expect(pickEngine({ buildKind: 'simulator', choice, turnListen, expo })).resolves.toBeNull()
    expect(turnListen).not.toHaveBeenCalled()
    expect(expo.availability).not.toHaveBeenCalled()
  })

  test.each(['installed', 'supported', 'downloading'] as const)(
    'auto selects turn-listen when its model is %s',
    async (status) => {
      const apple = engine('turn-listen', status)
      const expo = engine('expo-speech-recognition', 'installed')

      await expect(pickEngine({ buildKind: 'device', choice: 'auto', turnListen: () => apple, expo })).resolves.toBe(
        apple
      )
      expect(expo.availability).not.toHaveBeenCalled()
    }
  )

  test.each(['unsupported', 'none'] as const)('auto falls back to Expo when turn-listen is %s', async (status) => {
    const apple = engine('turn-listen', status)
    const expo = engine('expo-speech-recognition', 'installed')

    await expect(pickEngine({ buildKind: 'device', choice: 'auto', turnListen: () => apple, expo })).resolves.toBe(expo)
  })

  test('auto selects the typed path when both engines are out', async () => {
    const apple = engine('turn-listen', 'unsupported')
    const expo = engine('expo-speech-recognition', 'none')

    await expect(pickEngine({ buildKind: 'device', choice: 'auto', turnListen: () => apple, expo })).resolves.toBeNull()
  })

  test.each([
    ['apple', 'turn-listen'],
    ['expo', 'expo-speech-recognition']
  ] as const)('%s forces only its engine when available', async (choice, id) => {
    const apple = engine('turn-listen', 'installed')
    const expo = engine('expo-speech-recognition', 'installed')

    await expect(pickEngine({ buildKind: 'device', choice, turnListen: () => apple, expo })).resolves.toBe(
      id === 'turn-listen' ? apple : expo
    )
    if (choice === 'apple') expect(expo.availability).not.toHaveBeenCalled()
    else expect(apple.availability).not.toHaveBeenCalled()
  })

  test.each(['apple', 'expo'] as const)('%s returns the typed path when unavailable', async (choice) => {
    const apple = engine('turn-listen', 'unsupported')
    const expo = engine('expo-speech-recognition', 'unsupported')

    await expect(pickEngine({ buildKind: 'device', choice, turnListen: () => apple, expo })).resolves.toBeNull()
  })

  test('none selects the typed path without checking either engine', async () => {
    const turnListen = vi.fn(() => engine('turn-listen', 'installed'))
    const expo = engine('expo-speech-recognition', 'installed')

    await expect(pickEngine({ buildKind: 'device', choice: 'none', turnListen, expo })).resolves.toBeNull()
    expect(turnListen).not.toHaveBeenCalled()
    expect(expo.availability).not.toHaveBeenCalled()
  })

  test('the configured picker reads the device and forced engine from Expo extra', async () => {
    const apple = engine('turn-listen', 'installed')
    const expo = engine('expo-speech-recognition', 'installed')

    await expect(pickListenEngine(() => apple, expo)).resolves.toBe(expo)
    expect(apple.availability).not.toHaveBeenCalled()
  })

  test('the app config routes a Simulator build through the typed picker path', async () => {
    const constants = Constants as unknown as { expoConfig: { extra: unknown } }
    const previousExtra = constants.expoConfig.extra
    vi.stubEnv('EXPO_PUBLIC_BUILD_KIND', 'simulator')
    try {
      const config = appConfig({ config: {} } as never)
      expect(config.extra?.buildKind).toBe('simulator')
      expect(config.extra?.listenEngine).toBe('auto')
      constants.expoConfig.extra = config.extra

      const turnListen = vi.fn(() => engine('turn-listen', 'installed'))
      const expo = engine('expo-speech-recognition', 'installed')

      await expect(pickListenEngine(turnListen, expo)).resolves.toBeNull()
      expect(turnListen).not.toHaveBeenCalled()
      expect(expo.availability).not.toHaveBeenCalled()
    } finally {
      constants.expoConfig.extra = previousExtra
      vi.unstubAllEnvs()
    }
  })
})

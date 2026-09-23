import { describe, expect, test } from 'vitest'
import type { ConfigContext } from 'expo/config'
import appConfig from '../app.config'

const context: ConfigContext = {
  config: { name: 'Turn', slug: 'turn' },
  projectRoot: '/tmp/turn',
  staticConfigPath: null,
  packageJsonPath: '/tmp/turn/package.json'
}

describe('iOS app configuration', () => {
  test('builds Turn for portrait iPhones on iOS 26 and follows system appearance', () => {
    const config = appConfig(context)

    expect(config.ios?.bundleIdentifier).toBe('com.m1ku.turn')
    expect(config.ios?.deploymentTarget).toBe('26')
    expect(config.ios?.supportsTablet).toBe(false)
    expect(config.platforms).toEqual(['ios'])
    expect(config.orientation).toBe('portrait')
    expect(config.userInterfaceStyle).toBe('automatic')
    expect(config.plugins).toContainEqual(['expo-build-properties', { ios: { enableSceneSupport: true } }])
  })

  test('uses the design copy for permissions and a color-only launch screen', () => {
    const config = appConfig(context)

    expect(config.ios?.infoPlist?.NSMicrophoneUsageDescription).toContain('after your partner agrees')
    expect(config.ios?.infoPlist?.NSSpeechRecognitionUsageDescription).toContain(
      "when this iPhone can't do it by itself"
    )
    expect(config.ios?.infoPlist).not.toHaveProperty('NSLocationWhenInUseUsageDescription')
    expect(config.plugins).toContainEqual([
      'expo-splash-screen',
      { backgroundColor: '#F2F2F7', dark: { backgroundColor: '#000000' } }
    ])
    expect(config.plugins).toContainEqual(['./plugins/withBoardSplash', { backgroundColor: '#F2F2F7' }])
  })

  test('passes public relay and Test Store configuration to the app', () => {
    const before = {
      relay: process.env.EXPO_PUBLIC_RELAY_URL,
      revenueCat: process.env.EXPO_PUBLIC_RC_TEST_STORE_KEY,
      kind: process.env.EXPO_PUBLIC_BUILD_KIND
    }
    process.env.EXPO_PUBLIC_RELAY_URL = 'https://turn-relay.example.workers.dev'
    process.env.EXPO_PUBLIC_RC_TEST_STORE_KEY = 'test_public_key'
    process.env.EXPO_PUBLIC_BUILD_KIND = 'simulator'

    try {
      const config = appConfig(context)
      expect(config.extra).toMatchObject({
        relayUrl: 'https://turn-relay.example.workers.dev',
        revenueCatTestStoreKey: 'test_public_key',
        buildKind: 'simulator'
      })
    } finally {
      for (const [key, value] of Object.entries({
        EXPO_PUBLIC_RELAY_URL: before.relay,
        EXPO_PUBLIC_RC_TEST_STORE_KEY: before.revenueCat,
        EXPO_PUBLIC_BUILD_KIND: before.kind
      })) {
        if (value === undefined) delete process.env[key]
        else process.env[key] = value
      }
    }
  })

  test('has the judging relay and Test Store key without a local env file', () => {
    const config = appConfig(context)
    expect(config.extra?.relayUrl).toBe('https://turn-relay.m1ku-turn.workers.dev')
    expect(config.extra?.revenueCatTestStoreKey).toMatch(/^test_/)
    expect(config.extra?.buildKind).toBe('simulator')
  })
})

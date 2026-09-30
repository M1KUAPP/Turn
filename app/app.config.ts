import { existsSync } from 'node:fs'
import { join } from 'node:path'
import type { ConfigContext, ExpoConfig } from 'expo/config'

export default ({ config, projectRoot }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Turn',
  slug: 'turn',
  scheme: 'turn',
  version: '0.1.0',
  platforms: ['ios'],
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  ios: {
    icon: './assets/turn.icon',
    bundleIdentifier: 'com.m1ku.turn',
    deploymentTarget: '26',
    supportsTablet: false,
    infoPlist: {
      NSMicrophoneUsageDescription:
        'Turn listens only in Listen mode, after your partner agrees, to turn their words into text on this iPhone so you can answer in your own phrases. No audio is kept.',
      NSSpeechRecognitionUsageDescription:
        "Turn uses speech recognition only in Listen mode, after your partner agrees, to turn their words into text when this iPhone can't do it by itself."
    }
  },
  plugins: [
    'expo-router',
    'expo-status-bar',
    'expo-sqlite',
    'expo-audio',
    'expo-secure-store',
    ['expo-build-properties', { ios: { enableSceneSupport: true } }],
    ['./plugins/withBoardSplash', { backgroundColor: '#F4EFE7' }],
    './plugins/withLive2D',
    [
      'expo-speech-recognition',
      {
        microphonePermission:
          'Turn listens only in Listen mode, after your partner agrees, to turn their words into text on this iPhone so you can answer in your own phrases. No audio is kept.',
        speechRecognitionPermission:
          "Turn uses speech recognition only in Listen mode, after your partner agrees, to turn their words into text when this iPhone can't do it by itself."
      }
    ],
    ['expo-splash-screen', { backgroundColor: '#F4EFE7', dark: { backgroundColor: '#15120F' } }]
  ],
  extra: {
    relayUrl: process.env.EXPO_PUBLIC_RELAY_URL ?? 'https://turn-relay.m1ku-turn.workers.dev',
    revenueCatTestStoreKey: process.env.EXPO_PUBLIC_RC_TEST_STORE_KEY ?? 'test_TXxJjdDavsAIFUJqzvnenrRIqBc',
    buildKind: process.env.EXPO_PUBLIC_BUILD_KIND ?? 'simulator',
    listenEngine: 'auto',
    // The companion's live renderer is in this build, so the face draws live over its frames; withLive2D copies the
    // same folder into the app (plan 0049).
    live2d: Boolean(projectRoot) && existsSync(join(projectRoot, 'live2d/build/Live2D/index.html'))
  }
})

import type { ConfigContext, ExpoConfig } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Turn',
  slug: 'turn',
  scheme: 'turn',
  version: '0.1.0',
  platforms: ['ios'],
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  ios: {
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
    ['./plugins/withBoardSplash', { backgroundColor: '#F2F2F7' }],
    [
      'expo-speech-recognition',
      {
        microphonePermission:
          'Turn listens only in Listen mode, after your partner agrees, to turn their words into text on this iPhone so you can answer in your own phrases. No audio is kept.',
        speechRecognitionPermission:
          "Turn uses speech recognition only in Listen mode, after your partner agrees, to turn their words into text when this iPhone can't do it by itself."
      }
    ],
    ['expo-splash-screen', { backgroundColor: '#F2F2F7', dark: { backgroundColor: '#000000' } }]
  ],
  extra: {
    relayUrl: process.env.EXPO_PUBLIC_RELAY_URL ?? 'https://turn-relay.m1ku-turn.workers.dev',
    revenueCatTestStoreKey: process.env.EXPO_PUBLIC_RC_TEST_STORE_KEY ?? 'test_TXxJjdDavsAIFUJqzvnenrRIqBc',
    buildKind: process.env.EXPO_PUBLIC_BUILD_KIND ?? 'simulator'
  }
})

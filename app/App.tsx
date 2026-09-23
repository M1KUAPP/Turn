import { useEffect, useState, useSyncExternalStore } from 'react'
import { Text } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { setAudioModeAsync } from 'expo-audio'
import * as Speech from 'expo-speech'
import * as SQLite from 'expo-sqlite'
import { nativeAccessibilitySource } from './src/accessibility/native'
import { createAccessibilityStore } from './src/accessibility/store'
import { createBankStore } from './src/bank/store'
import starterBank from './src/content/starter-bank.json'
import { colors, scaledTextStyle } from './src/constants/theme'
import HomeScreen from './src/screens/HomeScreen'
import { createSpeechController } from './src/speech/controller'

const accessibilityStore = createAccessibilityStore(nativeAccessibilitySource)
type Ready = {
  bank: ReturnType<typeof createBankStore>
  speech: ReturnType<typeof createSpeechController>
}

export default function App() {
  const accessibility = useSyncExternalStore(accessibilityStore.subscribe, accessibilityStore.getSnapshot)
  const [ready, setReady] = useState<Ready | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function start() {
      const db = await SQLite.openDatabaseAsync('turn.db')
      const bank = createBankStore(db, starterBank)
      await Promise.all([bank.initialize(), setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false })])
      if (!active) return
      const speech = createSpeechController({ speak: Speech.speak, stop: Speech.stop }, (id) => {
        void bank.recordTap(id)
      })
      setReady({ bank, speech })
    }
    void start().catch((cause) => {
      if (active) setError(String(cause))
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <SafeAreaProvider>
      {ready ? (
        <HomeScreen bank={ready.bank} speech={ready.speech} boldText={accessibility.boldText} />
      ) : (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.board, justifyContent: 'center', padding: 20 }}>
          <Text
            allowFontScaling={false}
            style={{ ...scaledTextStyle('body', accessibility.boldText, accessibility.fontScale), color: colors.ink }}
          >
            {error ? `Turn could not load its phrase bank: ${error}` : 'Loading phrases…'}
          </Text>
        </SafeAreaView>
      )}
    </SafeAreaProvider>
  )
}

import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
import { setAudioModeAsync } from 'expo-audio'
import * as Speech from 'expo-speech'
import * as SQLite from 'expo-sqlite'
import { nativeAccessibilitySource } from './accessibility/native'
import { createAccessibilityStore } from './accessibility/store'
import { createBankStore } from './bank/store'
import starterBank from './content/starter-bank.json'
import { createSpeechController } from './speech/controller'

const accessibilityStore = createAccessibilityStore(nativeAccessibilitySource)

type Ready = {
  bank: ReturnType<typeof createBankStore>
  speech: ReturnType<typeof createSpeechController>
}

type TurnState = {
  ready: Ready | null
  error: string | null
  boldText: boolean
  fontScale: number
}

const TurnContext = createContext<TurnState | null>(null)

export function TurnProvider({ children }: { children: ReactNode }) {
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
    <TurnContext.Provider
      value={{ ready, error, boldText: accessibility.boldText, fontScale: accessibility.fontScale }}
    >
      {children}
    </TurnContext.Provider>
  )
}

export function useTurn() {
  const value = useContext(TurnContext)
  if (!value) throw new Error('TurnProvider is missing')
  return value
}

import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
import * as Application from 'expo-application'
import { setAudioModeAsync } from 'expo-audio'
import Constants from 'expo-constants'
import * as Crypto from 'expo-crypto'
import * as SecureStore from 'expo-secure-store'
import * as Speech from 'expo-speech'
import * as SQLite from 'expo-sqlite'
import { nativeAccessibilitySource } from './accessibility/native'
import { createAccessibilityStore } from './accessibility/store'
import { createBankStore } from './bank/store'
import starterBank from './content/starter-bank.json'
import { createNamingStore, refreshNaming } from './relay/naming'
import { createSpeechController } from './speech/controller'

const accessibilityStore = createAccessibilityStore(nativeAccessibilitySource)

type Ready = {
  bank: ReturnType<typeof createBankStore>
  speech: ReturnType<typeof createSpeechController>
  typesafeNamed: boolean
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
      const naming = createNamingStore(db)
      const typesafeNamed = await naming.read()
      const speech = createSpeechController({ speak: Speech.speak, stop: Speech.stop }, (id) => {
        void bank.recordTap(id)
      })
      setReady({ bank, speech, typesafeNamed })
      const extra = Constants.expoConfig?.extra
      const relayUrl = typeof extra?.relayUrl === 'string' ? extra.relayUrl : ''
      if (relayUrl) {
        void refreshNaming({
          store: naming,
          storage: SecureStore,
          createId: () => Crypto.randomUUID(),
          request: fetch,
          relayUrl,
          version: Application.nativeApplicationVersion ?? Constants.expoConfig?.version ?? '0.1.0',
          buildKind: extra?.buildKind === 'device' ? 'device' : 'simulator'
        }).then((named) => {
          if (active) setReady((current) => (current ? { ...current, typesafeNamed: named } : current))
        })
      }
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

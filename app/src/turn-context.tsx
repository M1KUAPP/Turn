import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
import * as Application from 'expo-application'
import { useRouter } from 'expo-router'
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
import { createConsentController, type ConsentState } from './consent/controller'
import { consentCard, permissionStep } from './consent/strings'
import { rebuildGazetteer } from './listen/gazetteer'
import { createTypedListenSession } from './listen/typed-session'
import { createConfigClient } from './relay/config'
import { createSpeechController } from './speech/controller'
import { createVoiceSettings } from './speech/voice-settings'
import { turnListen } from '../../modules/turn-listen/src'
import { turnVoice } from '../../modules/turn-voice/src'

const accessibilityStore = createAccessibilityStore(nativeAccessibilitySource)

type Ready = {
  bank: ReturnType<typeof createBankStore>
  speech: ReturnType<typeof createSpeechController>
  voiceSettings: ReturnType<typeof createVoiceSettings>
  listen: ReturnType<typeof createTypedListenSession>
  consent: ReturnType<typeof createConsentController>
  nameTagger: typeof turnListen
  config: ReturnType<typeof createConfigClient>
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
  const router = useRouter()
  const accessibility = useSyncExternalStore(accessibilityStore.subscribe, accessibilityStore.getSnapshot)
  const [ready, setReady] = useState<Ready | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    let listen: ReturnType<typeof createTypedListenSession> | null = null
    let unsubscribeGazetteer: (() => void) | null = null
    let unsubscribeVoiceChanges: (() => void) | null = null
    let unsubscribeConfig: (() => void) | null = null
    async function start() {
      const db = await SQLite.openDatabaseAsync('turn.db')
      const bank = createBankStore(db, starterBank)
      await Promise.all([bank.initialize(), setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false })])
      if (!active) return
      const extra = Constants.expoConfig?.extra
      const relayUrl = typeof extra?.relayUrl === 'string' ? extra.relayUrl : ''
      const config = createConfigClient({
        setting: bank.setting,
        setSetting: bank.setSetting,
        getItemAsync: SecureStore.getItemAsync,
        setItemAsync: SecureStore.setItemAsync,
        createId: () => Crypto.randomUUID(),
        request: fetch,
        relayUrl,
        version: Application.nativeApplicationVersion ?? Constants.expoConfig?.version ?? '0.1.0',
        buildKind: extra?.buildKind === 'device' ? 'device' : 'simulator'
      })
      await config.read()
      const typesafeNamed = config.typesafeNamed()
      const voiceSettings = createVoiceSettings({
        setting: bank.setting,
        setSetting: bank.setSetting,
        availableVoices: Speech.getAvailableVoicesAsync,
        requestPersonalVoice: turnVoice.requestPersonalVoice,
        personalVoice: turnVoice.personalVoice
      })
      await voiceSettings.loadSaved()
      if (!active) return
      void voiceSettings.refresh().catch(() => {})
      unsubscribeVoiceChanges = turnVoice.onVoicesChanged(() => {
        void voiceSettings.refresh().catch(() => {})
      })
      const speech = createSpeechController(
        { speak: Speech.speak, stop: Speech.stop },
        (id) => {
          void bank.recordTap(id)
        },
        { voice: () => voiceSettings.selected().identifier, rate: () => voiceSettings.rate() }
      )
      listen = createTypedListenSession(bank)
      await listen.ready
      if (!active) {
        return
      }
      const consent = createConsentController({
        setting: bank.setting,
        setSetting: bank.setSetting,
        now: () => new Date(),
        config,
        speech,
        listen: {
          start: () => listen?.start(),
          end: () => listen?.end(),
          blocked: () => false
        },
        navigate: (route) => (route === '/' ? router.dismissTo('/') : router.replace(route))
      })
      await consent.ready
      if (!active) return
      const nameTagger = turnListen
      setReady({ bank, speech, voiceSettings, listen, consent, nameTagger, config, typesafeNamed })
      unsubscribeConfig = config.subscribe(() => {
        const named = config.typesafeNamed()
        setReady((current) => (current ? { ...current, typesafeNamed: named } : current))
      })
      if (nameTagger) {
        const rebuild = () => {
          void Promise.all([bank.phrases('all'), bank.places()])
            .then(([phrases, places]) => {
              if (active) return rebuildGazetteer({ phrases, places }, nameTagger)
            })
            .catch(() => {
              // A later bank edit retries the local gazetteer rebuild.
            })
        }
        rebuild()
        unsubscribeGazetteer = bank.subscribe(rebuild)
      }
      void config.refresh()
    }
    void start().catch((cause) => {
      if (active) setError(String(cause))
    })
    return () => {
      active = false
      unsubscribeGazetteer?.()
      unsubscribeVoiceChanges?.()
      unsubscribeConfig?.()
      listen?.dispose()
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

const emptyConsentState: ConsentState = {
  permissionAllowed: false,
  permissionDate: null,
  under18: false,
  typesafeNamed: false,
  requestsBlocked: true,
  note: null,
  step: permissionStep(false),
  card: consentCard(false)
}

const noConsentSubscription = (_listener: () => void) => () => {}
const emptyConsentSnapshot = () => emptyConsentState

export function useConsent() {
  const { ready } = useTurn()
  const consent = ready?.consent ?? null
  const subscribe = consent?.subscribe ?? noConsentSubscription
  const getSnapshot = consent?.snapshot ?? emptyConsentSnapshot
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return { consent, state }
}

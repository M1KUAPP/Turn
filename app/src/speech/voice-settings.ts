export type PersonalVoiceAuthorization = 'authorized' | 'denied' | 'notDetermined' | 'unsupported'

export type AvailableVoice = { identifier: string; name: string; language: string }
export type PersonalVoice = { identifier: string; name: string }
export type VoiceOption = { identifier: string | null; name: string; personal: boolean }

export const SPEECH_RATE_STEPS = [
  { step: 'slowest', label: 'Slowest', rate: 0.5 },
  { step: 'slower', label: 'Slower', rate: 0.75 },
  { step: 'normal', label: 'Normal', rate: 1 },
  { step: 'faster', label: 'Faster', rate: 1.25 },
  { step: 'fastest', label: 'Fastest', rate: 1.5 }
] as const

export type SpeechRateStep = (typeof SPEECH_RATE_STEPS)[number]['step']

export const PERSONAL_VOICE_REFUSED_NOTE =
  "Turn can't use your Personal Voice. In iOS Settings, allow apps to request to use it, then try again."
export const PERSONAL_VOICE_UNAVAILABLE_NOTE =
  "There's no Personal Voice Turn can use on this iPhone. If you've made one, allow apps to request to use it in iOS Settings; until then, Turn keeps the system voice."

type VoiceSettingsPorts = {
  setting(key: string): Promise<string | null>
  setSetting(key: string, value: string | null): Promise<void>
  availableVoices(): Promise<readonly AvailableVoice[]>
  requestPersonalVoice(): Promise<PersonalVoiceAuthorization>
  personalVoice(): Promise<PersonalVoice | null>
}

const systemDefault: VoiceOption = { identifier: null, name: 'System default', personal: false }
const noveltyVoicePrefix = 'com.apple.speech.synthesis.voice.'

function rateStep(value: string | null): SpeechRateStep {
  return SPEECH_RATE_STEPS.some(({ step }) => step === value) ? (value as SpeechRateStep) : 'normal'
}

function buildVoiceList(available: readonly AvailableVoice[], personal: PersonalVoice | null): VoiceOption[] {
  const voices = [systemDefault]
  const identifiers = new Set<string>()
  const english = available
    .filter(({ identifier, language }) => {
      const locale = language.toLowerCase()
      return (
        (locale === 'en' || locale.startsWith('en-')) &&
        !identifier.startsWith(noveltyVoicePrefix) &&
        identifier !== personal?.identifier
      )
    })
    .slice()
    .sort((left, right) => left.name.localeCompare(right.name))

  for (const voice of english) {
    if (identifiers.has(voice.identifier)) continue
    identifiers.add(voice.identifier)
    voices.push({ identifier: voice.identifier, name: voice.name, personal: false })
  }

  if (personal && !identifiers.has(personal.identifier)) {
    voices.push({ identifier: personal.identifier, name: personal.name, personal: true })
  }

  return voices
}

export function createVoiceSettings(ports: VoiceSettingsPorts) {
  let voices = [systemDefault]
  let selected = systemDefault
  let selectedRateStep: SpeechRateStep = 'normal'
  const listeners = new Set<() => void>()

  const notify = () => {
    for (const listener of listeners) listener()
  }

  return {
    voices(): readonly VoiceOption[] {
      return voices
    },
    selected(): VoiceOption {
      return selected
    },
    rate(): number {
      return SPEECH_RATE_STEPS.find(({ step }) => step === selectedRateStep)!.rate
    },
    rateStep(): SpeechRateStep {
      return selectedRateStep
    },
    async chooseVoice(identifier: string | null): Promise<void> {
      const next = voices.find((voice) => voice.identifier === identifier)
      if (!next) throw new Error('Unknown voice')
      await ports.setSetting('voice_id', identifier)
      selected = next
      notify()
    },
    async chooseRate(step: SpeechRateStep): Promise<void> {
      const next = SPEECH_RATE_STEPS.find((item) => item.step === step)
      if (!next) throw new Error('Unknown speech rate')
      await ports.setSetting('speech_rate', step)
      selectedRateStep = step
      notify()
    },
    async choosePersonalVoice(): Promise<string | null> {
      const authorization = await ports.requestPersonalVoice()
      if (authorization === 'denied') return PERSONAL_VOICE_REFUSED_NOTE
      if (authorization !== 'authorized') return PERSONAL_VOICE_UNAVAILABLE_NOTE

      const personal = await ports.personalVoice()
      if (!personal) return PERSONAL_VOICE_UNAVAILABLE_NOTE

      voices = buildVoiceList(await ports.availableVoices(), personal)
      selected = voices.find((voice) => voice.identifier === personal.identifier) ?? selected
      await ports.setSetting('voice_id', personal.identifier)
      notify()
      return null
    },
    // Startup reads only the saved choice: iOS can take many seconds to list its voices on a first launch, and
    // speaking needs just the identifier. refresh() then builds the list and checks the choice still resolves.
    async loadSaved(): Promise<void> {
      const [voiceId, savedRate] = await Promise.all([ports.setting('voice_id'), ports.setting('speech_rate')])
      if (voiceId !== null) selected = { identifier: voiceId, name: '', personal: false }
      selectedRateStep = rateStep(savedRate)
      notify()
    },
    async refresh(): Promise<void> {
      const [available, personal, voiceId, savedRate] = await Promise.all([
        ports.availableVoices(),
        ports.personalVoice(),
        ports.setting('voice_id'),
        ports.setting('speech_rate')
      ])
      voices = buildVoiceList(available, personal)
      const resolvedVoice = voices.find((voice) => voice.identifier === voiceId)
      if (voiceId !== null && !resolvedVoice) await ports.setSetting('voice_id', null)
      selected = resolvedVoice ?? systemDefault
      selectedRateStep = rateStep(savedRate)
      notify()
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    }
  }
}

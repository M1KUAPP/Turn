type SpeechPort = {
  speak(
    text: string,
    options: { onStart: () => void; onDone: () => void; onStopped: () => void; rate: number; voice?: string }
  ): void
  stop(): Promise<void>
}

type SpeechSettingsPort = { voice: () => string | null; rate: () => number }
type SpeechGate = { beforeSpeak(): Promise<void>; afterSpeech(): void }
type SpeechState = { speaking: boolean; lastText: string | null; activePhraseId: string | null }

const noopGate: SpeechGate = {
  beforeSpeak: async () => {},
  afterSpeech: () => {}
}

export function createSpeechController(
  port: SpeechPort,
  recordTap: (id: string) => void,
  settings: SpeechSettingsPort = { voice: () => null, rate: () => 1 },
  gate: SpeechGate = noopGate
) {
  let state: SpeechState = { speaking: false, lastText: null, activePhraseId: null }
  let last: { text: string; id?: string } | null = null
  let generation = 0
  let stopping: Promise<void> | null = null
  const listeners = new Set<() => void>()
  const setState = (next: SpeechState) => {
    state = next
    for (const listener of listeners) listener()
  }
  const stopNative = () => {
    if (!stopping) {
      stopping = port.stop().finally(() => {
        stopping = null
      })
    }
    return stopping
  }

  async function speakText(
    text: string,
    id: string | undefined,
    options: { previewVoice?: string | null; overrideVoice?: boolean; stopFirst?: boolean; remember?: boolean } = {}
  ) {
    const ticket = ++generation
    if (options.stopFirst || state.speaking || stopping) await stopNative()
    if (ticket !== generation) return
    await gate.beforeSpeak()
    if (ticket !== generation) return
    if (options.remember !== false) last = { text, id }
    setState({ speaking: true, lastText: text, activePhraseId: id ?? null })
    let counted = false
    const voice = options.overrideVoice ? (options.previewVoice ?? null) : settings.voice()
    try {
      port.speak(text, {
        rate: settings.rate(),
        ...(voice === null ? {} : { voice }),
        onStart: () => {
          if (ticket === generation && id !== undefined && !counted) {
            counted = true
            recordTap(id)
          }
        },
        onDone: () => {
          if (ticket === generation) {
            gate.afterSpeech()
            setState({ ...state, speaking: false, activePhraseId: null })
          }
        },
        onStopped: () => {
          if (ticket === generation) {
            gate.afterSpeech()
            setState({ ...state, speaking: false, activePhraseId: null })
          }
        }
      })
    } catch (error) {
      if (ticket === generation) {
        gate.afterSpeech()
        setState({ ...state, speaking: false, activePhraseId: null })
      }
      throw error
    }
  }

  function speak(text: string, id?: string) {
    return speakText(text, id)
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    getSnapshot: () => state,
    speak,
    preview(text: string, voice: string | null) {
      return speakText(text, undefined, { previewVoice: voice, overrideVoice: true, stopFirst: true, remember: false })
    },
    async stop() {
      ++generation
      gate.afterSpeech()
      if (state.speaking) {
        setState({ ...state, speaking: false, activePhraseId: null })
        await stopNative()
      }
    },
    async repeat() {
      if (last) await speakText(last.text, last.id)
    }
  }
}

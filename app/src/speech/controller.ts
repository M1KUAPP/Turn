type SpeechPort = {
  speak(text: string, options: { onStart: () => void; onDone: () => void; onStopped: () => void }): void
  stop(): Promise<void>
}

type SpeechState = { speaking: boolean; lastText: string | null; activePhraseId: string | null }

export function createSpeechController(port: SpeechPort, recordTap: (id: string) => void) {
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

  async function speak(text: string, id?: string) {
    const ticket = ++generation
    if (state.speaking || stopping) await stopNative()
    if (ticket !== generation) return
    last = { text, id }
    setState({ speaking: true, lastText: text, activePhraseId: id ?? null })
    let counted = false
    try {
      port.speak(text, {
        onStart: () => {
          if (ticket === generation && id !== undefined && !counted) {
            counted = true
            recordTap(id)
          }
        },
        onDone: () => {
          if (ticket === generation) setState({ ...state, speaking: false, activePhraseId: null })
        },
        onStopped: () => {
          if (ticket === generation) setState({ ...state, speaking: false, activePhraseId: null })
        }
      })
    } catch (error) {
      if (ticket === generation) setState({ ...state, speaking: false, activePhraseId: null })
      throw error
    }
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
    async stop() {
      ++generation
      if (state.speaking) {
        setState({ ...state, speaking: false, activePhraseId: null })
        await stopNative()
      }
    },
    async repeat() {
      if (last) await speak(last.text, last.id)
    }
  }
}

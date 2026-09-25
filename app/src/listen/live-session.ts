import type { EngineState, ListenEngine, ListenEngineEvents, ListenLine } from './engine'
import { listenStrings } from './strings'
import { createTypedListenSession, type TypedListenState } from './typed-session'

export const SILENCE_WINDOW_MS = 500

type TypedSession = ReturnType<typeof createTypedListenSession>

export type ListenLogEntry = {
  line: string
  endedAt: number
  rankedAt: number
  silenceWindowMs: number
}

export type LiveCaption = {
  label: string
  words: string
  note: string | null
  prompt: string | null
  accessibilityLabel: string
}

export type LiveListenSnapshot = TypedListenState & {
  caption: LiveCaption
  phase: EngineState
  assetProgress: number | null
  rankedOnce: boolean
}

export function createLiveListenSession(options: {
  typed: TypedSession
  engine: ListenEngine | null
  now: () => number
  log: (entry: ListenLogEntry) => void
  place?: () => string | Promise<string>
}) {
  const { typed, engine, now, log } = options
  const place = options.place ?? (() => '')
  const listeners = new Set<() => void>()
  const rankedLines = new Set<string>()
  let typedState = typed.getSnapshot()
  let phase: EngineState = engine ? 'idle' : 'unavailable'
  let assetProgress: number | null = null
  let captionLabel: string = listenStrings.off
  let captionWords = ''
  let captionNote: string | null = null
  let captionPrompt: string | null = null
  let rankedOnce = false
  let lineOpen = false
  // The open line's own words; the caption can still hold the last line's.
  let openLineWords = ''
  let lineConsumed = false
  let voiceActive = false
  let ignoreNextEngineLine = false
  let engineRunning = false
  let disposed = false
  let revision = 0
  let silenceTimer: ReturnType<typeof setTimeout> | null = null
  let lineEnding: Promise<void> | null = null
  let pendingRanking: Promise<void> = Promise.resolve()
  let snapshot: LiveListenSnapshot

  const caption = (): LiveCaption => ({
    label: captionLabel,
    words: captionWords,
    note: captionNote,
    prompt: captionPrompt,
    accessibilityLabel: captionWords || captionLabel
  })

  const publish = () => {
    if (disposed) return
    snapshot = { ...typedState, caption: caption(), phase, assetProgress, rankedOnce }
    for (const listener of listeners) listener()
  }

  const rankingNote = () => {
    const hasReplies = typedState.row.big !== null || typedState.row.slots.some((slot) => slot !== null)
    if (hasReplies && typedState.row.answers < typedState.row.seq && typedState.answeringLine) {
      return listenStrings.stillAnswering(typedState.answeringLine)
    }
    return typedState.rankedOnPhone ? listenStrings.rankedOnPhone : null
  }

  const cancelSilenceTimer = () => {
    if (silenceTimer === null) return
    clearTimeout(silenceTimer)
    silenceTimer = null
  }

  const setUnavailable = () => {
    phase = 'unavailable'
    captionNote = listenStrings.unavailable
    captionPrompt = listenStrings.typedLinePrompt
    assetProgress = null
    publish()
  }

  const rankLine = (line: ListenLine) => {
    if (disposed || !typedState.active) return
    const text = line.text.trim()
    if (!text) {
      lineOpen = false
      captionWords = ''
      captionLabel = listenStrings.listening
      rankedOnce = false
      publish()
      return
    }

    const key = `${line.endedAt}\u0000${text}`
    if (rankedLines.has(key)) return
    rankedLines.add(key)
    lineOpen = false
    cancelSilenceTimer()
    captionLabel = listenStrings.said
    captionWords = text
    captionNote = null
    captionPrompt = engine ? null : listenStrings.typedLinePrompt
    rankedOnce = false
    publish()

    const previousSequence = typedState.row.seq
    pendingRanking = (async () => {
      await typed.send(text, await place())
      if (disposed || !typedState.active || typedState.row.seq <= previousSequence) return
      rankedOnce = true
      captionNote = rankingNote()
      publish()
      log({
        line: text,
        endedAt: line.endedAt,
        rankedAt: now(),
        silenceWindowMs: line.silenceWindowMs
      })
    })()
  }

  const endOpenLine = async (ignoreFinal = false): Promise<void> => {
    cancelSilenceTimer()
    if (!engine || (!lineOpen && !lineEnding)) return
    if (lineEnding) {
      await lineEnding
      return
    }
    // A line of noise alone makes no line for the engine to send, so there's nothing to ignore.
    if (ignoreFinal && openLineWords.trim()) {
      ignoreNextEngineLine = true
      lineConsumed = true
    }

    lineOpen = false
    lineEnding = (async () => {
      try {
        await engine.endLine()
        await pendingRanking
      } finally {
        lineEnding = null
      }
    })()
    try {
      await lineEnding
    } catch (error) {
      if (ignoreFinal) ignoreNextEngineLine = false
      throw error
    }
  }

  const engineEvents: ListenEngineEvents = {
    onPartial(text) {
      if (disposed || !typedState.active) return
      if (!lineOpen) {
        lineConsumed = false
        ignoreNextEngineLine = false
      }
      lineOpen = true
      openLineWords = text
      captionLabel = text.trim() ? listenStrings.saying : listenStrings.listening
      captionWords = text
      captionNote = assetProgress === null ? null : listenStrings.gettingModel
      captionPrompt = engine ? null : listenStrings.typedLinePrompt
      rankedOnce = false
      cancelSilenceTimer()
      if (text.trim() && !voiceActive && phase !== 'paused' && phase !== 'unavailable') {
        silenceTimer = setTimeout(() => {
          silenceTimer = null
          void endOpenLine().catch(() => setUnavailable())
        }, SILENCE_WINDOW_MS)
      }
      publish()
    },
    onLine(line) {
      if (ignoreNextEngineLine) {
        ignoreNextEngineLine = false
        lineOpen = false
        lineConsumed = true
        cancelSilenceTimer()
        rankedLines.add(`${line.endedAt}\u0000${line.text.trim()}`)
        return
      }
      if (lineConsumed) return
      lineConsumed = true
      rankLine(line)
    },
    onState(nextPhase) {
      if (disposed) return
      phase = nextPhase
      if (nextPhase === 'unavailable') {
        captionNote = listenStrings.unavailable
        captionPrompt = listenStrings.typedLinePrompt
      } else if (nextPhase === 'paused') {
        cancelSilenceTimer()
        lineOpen = false
        voiceActive = false
        captionLabel = listenStrings.off
        captionWords = ''
        captionNote = null
        rankedOnce = false
      } else if (nextPhase === 'listening' && !captionWords) {
        captionLabel = listenStrings.listening
      }
      publish()
    },
    onAssetProgress(fraction) {
      if (disposed) return
      assetProgress = fraction
      if (fraction !== null) captionNote = listenStrings.gettingModel
      publish()
    },
    onVoice(active) {
      if (disposed || !typedState.active) return
      voiceActive = active
      if (active) {
        if (!lineOpen) {
          lineConsumed = false
          openLineWords = ''
        }
        lineOpen = true
        cancelSilenceTimer()
      } else if (lineOpen && openLineWords.trim()) {
        cancelSilenceTimer()
        silenceTimer = setTimeout(() => {
          silenceTimer = null
          void endOpenLine().catch(() => setUnavailable())
        }, SILENCE_WINDOW_MS)
      }
    }
  }

  const removeEngineEvents = engine?.listen(engineEvents) ?? (() => undefined)
  const removeTypedListener = typed.subscribe(() => {
    typedState = typed.getSnapshot()
    publish()
  })

  snapshot = { ...typedState, caption: caption(), phase, assetProgress, rankedOnce }

  return {
    ready: typed.ready,
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot(): LiveListenSnapshot {
      return snapshot
    },
    async start(): Promise<void> {
      if (typedState.active || disposed) return
      const currentRevision = ++revision
      rankedLines.clear()
      typed.start()
      lineOpen = false
      lineConsumed = false
      voiceActive = false
      ignoreNextEngineLine = false
      captionLabel = listenStrings.listening
      captionWords = ''
      captionNote = engine ? null : listenStrings.unavailable
      captionPrompt = engine ? null : listenStrings.typedLinePrompt
      rankedOnce = false
      assetProgress = null
      phase = engine ? 'starting' : 'unavailable'
      publish()
      if (!engine) return

      try {
        const status = await engine.availability()
        if (disposed || currentRevision !== revision || !typedState.active) return
        if (status === 'unsupported' || status === 'none') {
          setUnavailable()
          return
        }
        if (engine.id === 'turn-listen' && status !== 'installed') {
          captionNote = listenStrings.gettingModel
          publish()
          await engine.installAsset()
          if (disposed || currentRevision !== revision || !typedState.active) return
          captionNote = null
          assetProgress = null
          publish()
        }
        engineRunning = true
        await engine.start({ lang: 'en-US' })
        if (disposed || currentRevision !== revision || !typedState.active) return
        phase = 'listening'
        publish()
      } catch {
        if (disposed || currentRevision !== revision || !typedState.active) return
        engineRunning = false
        setUnavailable()
      }
    },
    async endLine(): Promise<void> {
      if (!typedState.active) return
      await endOpenLine()
    },
    async send(line: string, linePlace?: string): Promise<void> {
      const text = line.trim()
      if (!typedState.active || !text || disposed) return
      if (lineOpen || lineEnding) await endOpenLine(true).catch(() => undefined)
      cancelSilenceTimer()

      const endedAt = now()
      const previousSequence = typedState.row.seq
      captionLabel = listenStrings.said
      captionWords = text
      captionNote = null
      captionPrompt = engine ? null : listenStrings.typedLinePrompt
      rankedOnce = false
      publish()
      await typed.send(text, linePlace ?? (await place()))
      if (disposed || !typedState.active || typedState.row.seq <= previousSequence) return
      rankedOnce = true
      captionNote = rankingNote()
      publish()
      log({ line: text, endedAt, rankedAt: now(), silenceWindowMs: 0 })
    },
    clear(): void {
      cancelSilenceTimer()
      lineOpen = false
      rankedOnce = false
      typed.clear()
      publish()
    },
    async end(): Promise<void> {
      if (disposed) return
      ++revision
      cancelSilenceTimer()
      const shouldStop = engine !== null && engineRunning
      engineRunning = false
      lineOpen = false
      lineConsumed = false
      voiceActive = false
      ignoreNextEngineLine = false
      lineEnding = null
      rankedLines.clear()
      typed.end()
      captionLabel = listenStrings.off
      captionWords = ''
      captionNote = null
      captionPrompt = null
      assetProgress = null
      rankedOnce = false
      phase = engine ? 'idle' : 'unavailable'
      publish()
      if (shouldStop) await engine.stop()
    },
    async dispose(): Promise<void> {
      if (disposed) return
      ++revision
      cancelSilenceTimer()
      const shouldStop = engine !== null && engineRunning
      engineRunning = false
      disposed = true
      removeEngineEvents()
      removeTypedListener()
      listeners.clear()
      typed.dispose()
      if (shouldStop) await engine.stop()
    }
  }
}

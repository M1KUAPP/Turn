import { ExpoSpeechRecognitionModule } from 'expo-speech-recognition'
import type { AssetStatus, EngineId, EngineState, ListenEngine, ListenEngineEvents, ListenLine } from './engine'

export type SpeechRecognitionModule = typeof ExpoSpeechRecognitionModule

export function createExpoEngine(
  module: SpeechRecognitionModule = ExpoSpeechRecognitionModule,
  now: () => number = Date.now
): ListenEngine {
  const id: EngineId = 'expo-speech-recognition'
  let currentEvents: ListenEngineEvents | null = null
  let state: EngineState = 'idle'
  let shouldListen = false
  let permissionGranted = false
  let permissionPending = false
  let taskRunning = false
  let taskStopping = false
  let stopPending = false
  let currentLang = 'en-US'
  let lastVoiceActive: boolean | null = null
  let lineCapTimer: ReturnType<typeof setTimeout> | null = null
  let finalizedText = ''
  let interimText = ''
  let lastFinalizedSegment: string | null = null
  let interimSinceFinal = false
  let lineEndedAt: number | null = null

  function setState(nextState: EngineState, reason?: string) {
    if (state === nextState) return
    state = nextState
    currentEvents?.onState(nextState, reason)
  }

  function clearLineCapTimer() {
    if (lineCapTimer !== null) {
      clearTimeout(lineCapTimer)
      lineCapTimer = null
    }
  }

  function clearTranscript() {
    finalizedText = ''
    interimText = ''
    lastFinalizedSegment = null
    interimSinceFinal = false
    lineEndedAt = null
  }

  function transcript() {
    return `${finalizedText}${interimText}`.trim()
  }

  function fail(reason: string) {
    shouldListen = false
    stopPending = false
    taskStopping = taskRunning
    clearLineCapTimer()
    clearTranscript()
    setState('unavailable', reason)
  }

  function stopAtLineBoundary() {
    if (!shouldListen || state !== 'listening' || !taskRunning || taskStopping) return
    lineEndedAt = now()
    taskStopping = true
    clearLineCapTimer()
    try {
      module.stop()
    } catch {
      // The end event still owns the boundary and restart.
    }
  }

  function armLineCapTimer() {
    clearLineCapTimer()
    lineCapTimer = setTimeout(() => {
      stopAtLineBoundary()
    }, 55_000)
  }

  function startRecognition() {
    if (!shouldListen || taskRunning || !permissionGranted) return

    clearTranscript()
    taskStopping = false
    taskRunning = true
    try {
      module.start({
        lang: currentLang,
        interimResults: true,
        continuous: true,
        requiresOnDeviceRecognition: true,
        addsPunctuation: true,
        iosCategory: {
          category: 'playAndRecord',
          categoryOptions: ['defaultToSpeaker'],
          mode: 'default'
        },
        volumeChangeEventOptions: {
          enabled: true,
          intervalMillis: 100
        }
      })
      setState('listening')
      armLineCapTimer()
    } catch (err) {
      taskRunning = false
      const reason = err instanceof Error ? err.message : String(err)
      fail(reason)
    }
  }

  module.addListener('result', (event) => {
    if (!currentEvents || !shouldListen || state !== 'listening' || !taskRunning) return

    const text = event.results?.[0]?.transcript ?? ''
    if (event.isFinal) {
      if (text.trim()) {
        const isRepeatedFinal =
          lastFinalizedSegment !== null && !interimSinceFinal && text.trim() === lastFinalizedSegment.trim()
        if (!isRepeatedFinal) {
          finalizedText += text
          lastFinalizedSegment = text
        }
        interimText = ''
        interimSinceFinal = false
      }
    } else {
      interimText = text
      interimSinceFinal = true
    }

    // After endLine() the words arrive as the line, not as a caption the session could take for a new line.
    if (!taskStopping) currentEvents.onPartial(transcript())
  })

  module.addListener('volumechange', (event) => {
    if (!currentEvents || typeof event.value !== 'number') return
    const isVoiceActive = event.value >= 0
    if (lastVoiceActive !== isVoiceActive) {
      lastVoiceActive = isVoiceActive
      currentEvents.onVoice(isVoiceActive)
    }
  })

  module.addListener('error', (event) => {
    const error = event.error
    if (error === 'no-speech' || error === 'aborted') return

    const reason = event.message || error || 'Speech recognition error'
    if (error === 'interrupted') {
      shouldListen = false
      stopPending = false
      taskStopping = taskRunning
      clearLineCapTimer()
      clearTranscript()
      setState('paused', reason)
      return
    }

    fail(reason)
  })

  module.addListener('nomatch', () => {
    // No match is an empty recognition result, not an engine failure.
  })

  module.addListener('end', () => {
    clearLineCapTimer()
    if (!taskRunning) {
      if (stopPending && !shouldListen) {
        stopPending = false
        setState('idle')
      }
      return
    }

    taskRunning = false
    const canReportLine = shouldListen && state === 'listening'
    const text = canReportLine ? transcript() : ''
    const line: ListenLine | null = text ? { text, endedAt: lineEndedAt ?? now(), silenceWindowMs: 500 } : null

    clearTranscript()
    taskStopping = false

    if (line) currentEvents?.onLine(line)

    if (shouldListen) {
      startRecognition()
    } else if (stopPending) {
      stopPending = false
      setState('idle')
    }
  })

  async function availability(): Promise<AssetStatus> {
    try {
      if (!module.isRecognitionAvailable() || !module.supportsOnDeviceRecognition()) {
        return 'unsupported'
      }
      const supported = await module.getSupportedLocales({})
      const locales = supported?.locales ?? []
      const hasEnUs = locales.some((loc) => {
        const normalized = loc.toLowerCase().replace('_', '-')
        return normalized === 'en-us'
      })
      return hasEnUs ? 'installed' : 'unsupported'
    } catch {
      return 'unsupported'
    }
  }

  async function installAsset(): Promise<void> {
    // onAssetProgress never reported
  }

  async function start(options: { lang: string }): Promise<void> {
    if (shouldListen && state === 'listening') return
    currentLang = options.lang || 'en-US'
    shouldListen = true
    stopPending = false
    lastVoiceActive = null
    setState('starting')

    if (permissionGranted) {
      startRecognition()
      return
    }
    if (permissionPending) return

    permissionPending = true
    let permission
    try {
      permission = await module.requestMicrophonePermissionsAsync()
    } catch (err) {
      permissionPending = false
      if (!shouldListen) return
      const reason = err instanceof Error ? err.message : String(err)
      fail(reason)
      return
    }
    permissionPending = false

    if (!shouldListen) return
    if (!permission?.granted) {
      fail('Microphone permission not granted')
      return
    }

    permissionGranted = true
    startRecognition()
  }

  async function pause(): Promise<void> {
    if (!shouldListen && state !== 'starting' && state !== 'listening') return
    shouldListen = false
    stopPending = false
    taskStopping = taskRunning
    clearLineCapTimer()
    clearTranscript()
    setState('paused')
    try {
      module.abort()
    } catch {
      // ignore
    }
  }

  async function resume(): Promise<void> {
    if (state !== 'paused') return
    shouldListen = true
    stopPending = false
    setState('starting')
    if (permissionPending) return
    if (permissionGranted) {
      startRecognition()
      return
    }
    await start({ lang: currentLang })
  }

  async function stop(): Promise<void> {
    shouldListen = false
    taskStopping = taskRunning
    stopPending = true
    clearLineCapTimer()
    clearTranscript()
    if (!taskRunning) {
      // No task will send an end to finish the stop.
      stopPending = false
      setState('idle')
      return
    }
    setState('stopping')
    try {
      module.abort()
    } catch {
      // ignore
    }
  }

  async function endLine(): Promise<void> {
    if (!shouldListen || state !== 'listening' || !taskRunning || taskStopping) return
    stopAtLineBoundary()
  }

  function listen(events: ListenEngineEvents): () => void {
    currentEvents = events
    return () => {
      if (currentEvents === events) {
        currentEvents = null
      }
    }
  }

  return {
    id,
    listen,
    availability,
    installAsset,
    start,
    pause,
    resume,
    stop,
    endLine
  }
}

export const expoEngine: ListenEngine = createExpoEngine()

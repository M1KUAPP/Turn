import { beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('expo-speech-recognition', () => {
  return {
    ExpoSpeechRecognitionModule: {
      addListener: vi.fn(() => ({ remove: vi.fn() })),
      requestMicrophonePermissionsAsync: vi.fn(async () => ({ granted: true, status: 'granted' })),
      requestPermissionsAsync: vi.fn(),
      requestSpeechRecognizerPermissionsAsync: vi.fn(),
      isRecognitionAvailable: vi.fn(() => true),
      supportsOnDeviceRecognition: vi.fn(() => true),
      getSupportedLocales: vi.fn(async () => ({ locales: ['en-US'], installedLocales: ['en-US'] })),
      start: vi.fn(),
      stop: vi.fn(),
      abort: vi.fn()
    }
  }
})

import type { ListenEngineEvents, ListenLine } from '../src/listen/engine'
import { createExpoEngine, expoEngine } from '../src/listen/expo-engine'
import appConfig from '../app.config'

type MockListener = (event: any) => void

function createFakeSpeechModule() {
  const listeners: Record<string, Set<MockListener>> = {
    start: new Set(),
    end: new Set(),
    result: new Set(),
    error: new Set(),
    nomatch: new Set(),
    volumechange: new Set()
  }

  const calls = {
    requestMicrophonePermissionsAsync: 0,
    requestPermissionsAsync: 0,
    requestSpeechRecognizerPermissionsAsync: 0,
    isRecognitionAvailable: 0,
    supportsOnDeviceRecognition: 0,
    getSupportedLocales: [] as any[],
    start: [] as any[],
    stop: 0,
    abort: 0
  }

  let micPermissionGranted = true
  let recognitionAvailable = true
  let onDeviceSupported = true
  let supportedLocales: string[] = ['en-US', 'es-ES']
  let startThrows: Error | null = null

  const emit = (event: string, payload?: any) => {
    const handlers = listeners[event]
    if (handlers) {
      for (const handler of Array.from(handlers)) {
        handler(payload)
      }
    }
  }

  const module = {
    addListener(event: string, listener: MockListener) {
      if (!listeners[event]) listeners[event] = new Set()
      listeners[event].add(listener)
      return {
        remove: () => {
          listeners[event]?.delete(listener)
        }
      }
    },
    async requestMicrophonePermissionsAsync() {
      calls.requestMicrophonePermissionsAsync++
      return {
        granted: micPermissionGranted,
        status: micPermissionGranted ? 'granted' : 'denied',
        expires: 'never',
        canAskAgain: true
      }
    },
    async requestPermissionsAsync() {
      calls.requestPermissionsAsync++
      return { granted: true, status: 'granted', expires: 'never', canAskAgain: true }
    },
    async requestSpeechRecognizerPermissionsAsync() {
      calls.requestSpeechRecognizerPermissionsAsync++
      return { granted: true, status: 'granted', expires: 'never', canAskAgain: true }
    },
    isRecognitionAvailable() {
      calls.isRecognitionAvailable++
      return recognitionAvailable
    },
    supportsOnDeviceRecognition() {
      calls.supportsOnDeviceRecognition++
      return onDeviceSupported
    },
    async getSupportedLocales(options: any) {
      calls.getSupportedLocales.push(options)
      return { locales: supportedLocales, installedLocales: supportedLocales }
    },
    start(options: any) {
      calls.start.push(options)
      if (startThrows) throw startThrows
      emit('start', null)
    },
    stop() {
      calls.stop++
    },
    abort() {
      calls.abort++
    }
  }

  return {
    module: module as any,
    calls,
    emit,
    setMicPermission(granted: boolean) {
      micPermissionGranted = granted
    },
    setRecognitionAvailable(avail: boolean) {
      recognitionAvailable = avail
    },
    setOnDeviceSupported(supported: boolean) {
      onDeviceSupported = supported
    },
    setSupportedLocales(locales: string[]) {
      supportedLocales = locales
    },
    setStartThrows(err: Error | null) {
      startThrows = err
    }
  }
}

function fixture(now = 1_000_000) {
  const fake = createFakeSpeechModule()
  let currentTime = now
  const engine = createExpoEngine(fake.module, () => currentTime)
  const events: {
    partials: string[]
    lines: ListenLine[]
    states: Array<{ state: string; reason?: string }>
    assetProgress: Array<number | null>
    voices: boolean[]
  } = {
    partials: [],
    lines: [],
    states: [],
    assetProgress: [],
    voices: []
  }

  const listener: ListenEngineEvents = {
    onPartial: (text) => events.partials.push(text),
    onLine: (line) => events.lines.push(line),
    onState: (state, reason) => events.states.push({ state, reason }),
    onAssetProgress: (fraction) => events.assetProgress.push(fraction),
    onVoice: (active) => events.voices.push(active)
  }

  const unsubscribe = engine.listen(listener)

  return {
    fake,
    engine,
    events,
    unsubscribe,
    advanceTime(ms: number) {
      currentTime += ms
    }
  }
}

describe('expo-speech-recognition engine', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    return () => {
      vi.useRealTimers()
    }
  })

  test('engine id is expo-speech-recognition', () => {
    const { engine } = fixture()
    expect(engine.id).toBe('expo-speech-recognition')
  })

  test('calls requestMicrophonePermissionsAsync() and never speech recognizer permissions', async () => {
    const { fake, engine, events } = fixture()

    await engine.start({ lang: 'en-US' })

    expect(fake.calls.requestMicrophonePermissionsAsync).toBe(1)
    expect(fake.calls.requestPermissionsAsync).toBe(0)
    expect(fake.calls.requestSpeechRecognizerPermissionsAsync).toBe(0)
    expect(events.states.some((s) => s.state === 'listening')).toBe(true)
  })

  test('when microphone permission is denied, transitions to unavailable without starting', async () => {
    const { fake, engine, events } = fixture()
    fake.setMicPermission(false)

    await engine.start({ lang: 'en-US' })

    expect(fake.calls.requestMicrophonePermissionsAsync).toBe(1)
    expect(fake.calls.start.length).toBe(0)
    expect(events.states).toContainEqual({
      state: 'unavailable',
      reason: expect.stringMatching(/permission/i)
    })
  })

  test('starts with the options in the Rules, including .default mode and continuous', async () => {
    const { fake, engine } = fixture()

    await engine.start({ lang: 'en-US' })

    expect(fake.calls.start).toHaveLength(1)
    const options = fake.calls.start[0]
    expect(options).toEqual({
      lang: 'en-US',
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
  })

  test('checks availability: asks isRecognitionAvailable(), supportsOnDeviceRecognition(), confirms en-US in getSupportedLocales({})', async () => {
    const { fake, engine } = fixture()

    const status = await engine.availability()

    expect(fake.calls.isRecognitionAvailable).toBe(1)
    expect(fake.calls.supportsOnDeviceRecognition).toBe(1)
    expect(fake.calls.getSupportedLocales).toEqual([{}])
    expect(status).toBe('installed')
  })

  test('availability returns unsupported when isRecognitionAvailable is false', async () => {
    const { fake, engine } = fixture()
    fake.setRecognitionAvailable(false)

    expect(await engine.availability()).toBe('unsupported')
  })

  test('availability returns unsupported when supportsOnDeviceRecognition is false', async () => {
    const { fake, engine } = fixture()
    fake.setOnDeviceSupported(false)

    expect(await engine.availability()).toBe('unsupported')
  })

  test('availability returns unsupported when en-US is absent from getSupportedLocales', async () => {
    const { fake, engine } = fixture()
    fake.setSupportedLocales(['fr-FR', 'de-DE'])

    expect(await engine.availability()).toBe('unsupported')
  })

  test('availability returns unsupported when getSupportedLocales rejects', async () => {
    const { fake, engine } = fixture()
    fake.module.getSupportedLocales = vi.fn().mockRejectedValue(new Error('locale query failed'))

    expect(await engine.availability()).toBe('unsupported')
  })

  test('accumulates iOS 18 final segments and emits one line at end', async () => {
    const { fake, engine, events } = fixture()

    await engine.start({ lang: 'en-US' })
    fake.emit('result', { isFinal: false, results: [{ transcript: 'How was' }] })
    fake.emit('result', { isFinal: true, results: [{ transcript: 'How was physio?' }] })
    fake.emit('result', { isFinal: false, results: [{ transcript: ' Did it' }] })
    fake.emit('result', { isFinal: true, results: [{ transcript: ' Did it hurt?' }] })

    await engine.endLine()
    fake.emit('result', { isFinal: true, results: [] })
    expect(events.lines).toEqual([])
    fake.emit('end', null)

    expect(events.partials).toEqual([
      'How was',
      'How was physio?',
      'How was physio? Did it',
      'How was physio? Did it hurt?'
    ])
    expect(events.lines).toEqual([{ text: 'How was physio? Did it hurt?', endedAt: 1_000_000, silenceWindowMs: 500 }])
    expect(fake.calls.start).toHaveLength(2)
  })

  test('drops a repeated final segment when no interim arrived between finals', async () => {
    const { fake, engine, events } = fixture()

    await engine.start({ lang: 'en-US' })
    fake.emit('result', { isFinal: true, results: [{ transcript: 'Hello there.' }] })
    fake.emit('result', { isFinal: true, results: [{ transcript: 'Hello there.' }] })
    await engine.endLine()
    fake.emit('end', null)

    expect(events.lines.map((line) => line.text)).toEqual(['Hello there.'])
  })

  test('uses the time endLine() ran for the emitted line', async () => {
    const { fake, engine, events, advanceTime } = fixture(50_000)

    await engine.start({ lang: 'en-US' })
    fake.emit('result', { isFinal: false, results: [{ transcript: 'Good morning' }] })
    advanceTime(500)
    await engine.endLine()
    advanceTime(1_000)
    fake.emit('end', null)

    expect(events.lines).toEqual([{ text: 'Good morning', endedAt: 50_500, silenceWindowMs: 500 }])
  })

  test('no-speech and nomatch are benign and end restarts without an empty line', async () => {
    const { fake, engine, events } = fixture()

    await engine.start({ lang: 'en-US' })
    fake.emit('error', { error: 'no-speech', message: 'No speech was detected.' })
    fake.emit('nomatch', null)
    fake.emit('end', null)

    expect(events.lines).toEqual([])
    expect(events.states.some(({ state }) => state === 'unavailable')).toBe(false)
    expect(fake.calls.start).toHaveLength(2)
  })

  test('fatal error stays unavailable after end and does not restart', async () => {
    const { fake, engine, events } = fixture()

    await engine.start({ lang: 'en-US' })
    fake.emit('result', { isFinal: false, results: [{ transcript: 'Discard this' }] })
    fake.emit('error', { error: 'language-not-supported', message: 'Language not supported' })
    fake.emit('end', null)

    expect(events.lines).toEqual([])
    expect(fake.calls.start).toHaveLength(1)
    expect(events.states.at(-1)).toEqual({ state: 'unavailable', reason: 'Language not supported' })
  })

  test('interruption pauses, drops the open text, and resume restarts after end', async () => {
    const { fake, engine, events } = fixture()

    await engine.start({ lang: 'en-US' })
    fake.emit('result', { isFinal: false, results: [{ transcript: 'Discard this' }] })
    fake.emit('error', { error: 'interrupted', message: 'Audio session was interrupted' })
    fake.emit('end', null)

    expect(events.lines).toEqual([])
    expect(fake.calls.start).toHaveLength(1)
    expect(events.states.at(-1)).toEqual({ state: 'paused', reason: 'Audio session was interrupted' })

    await engine.resume()
    expect(fake.calls.start).toHaveLength(2)
  })

  test('stop() with no task running is idle at once', async () => {
    const { fake, engine, events } = fixture()
    await engine.start({ lang: 'en-US' })
    fake.emit('error', { error: 'audio-capture', message: 'Mic busy' })
    fake.emit('end', null)
    await engine.stop()

    expect(events.states.at(-1)).toEqual({ state: 'idle' })
    expect(fake.calls.abort).toBe(0)
  })

  test('stop() and pause() abort, ignore later results, and never report a line', async () => {
    const stopped = fixture()
    await stopped.engine.start({ lang: 'en-US' })
    stopped.fake.emit('result', { isFinal: false, results: [{ transcript: 'Withdrawn words' }] })
    await stopped.engine.stop()
    stopped.fake.emit('result', { isFinal: true, results: [{ transcript: 'Withdrawn words' }] })
    stopped.fake.emit('end', null)

    expect(stopped.fake.calls.abort).toBe(1)
    expect(stopped.fake.calls.stop).toBe(0)
    expect(stopped.events.partials).toEqual(['Withdrawn words'])
    expect(stopped.events.lines).toEqual([])
    expect(stopped.events.states.at(-1)).toEqual({ state: 'idle' })

    const paused = fixture()
    await paused.engine.start({ lang: 'en-US' })
    paused.fake.emit('result', { isFinal: false, results: [{ transcript: 'Paused words' }] })
    await paused.engine.pause()
    paused.fake.emit('result', { isFinal: true, results: [{ transcript: 'Paused words' }] })
    paused.fake.emit('end', null)

    expect(paused.fake.calls.abort).toBe(1)
    expect(paused.fake.calls.stop).toBe(0)
    expect(paused.events.partials).toEqual(['Paused words'])
    expect(paused.events.lines).toEqual([])
    expect(paused.events.states.at(-1)).toEqual({ state: 'paused' })
  })

  test('resume before pause end waits and starts only after the previous task ends', async () => {
    const { fake, engine } = fixture()

    await engine.start({ lang: 'en-US' })
    await engine.pause()
    await engine.resume()
    expect(fake.calls.start).toHaveLength(1)

    fake.emit('error', { error: 'aborted', message: 'Speech recognition aborted.' })
    fake.emit('end', null)
    expect(fake.calls.start).toHaveLength(2)
  })

  test('endLine() called twice stops only once', async () => {
    const { fake, engine } = fixture()

    await engine.start({ lang: 'en-US' })
    await engine.endLine()
    await engine.endLine()

    expect(fake.calls.stop).toBe(1)
  })

  test('does not repeat listening state after successive lines', async () => {
    const { fake, engine, events } = fixture()

    await engine.start({ lang: 'en-US' })
    fake.emit('result', { isFinal: false, results: [{ transcript: 'First line' }] })
    await engine.endLine()
    fake.emit('end', null)
    fake.emit('result', { isFinal: false, results: [{ transcript: 'Second line' }] })
    await engine.endLine()
    fake.emit('end', null)

    expect(events.lines.map((line) => line.text)).toEqual(['First line', 'Second line'])
    expect(events.states.filter(({ state }) => state === 'listening')).toHaveLength(1)
  })

  test('caps a task at 55 seconds and emits its words before restarting', async () => {
    const { fake, engine, events } = fixture()

    await engine.start({ lang: 'en-US' })
    expect(fake.calls.start).toHaveLength(1)
    expect(fake.calls.stop).toBe(0)
    fake.emit('result', { isFinal: false, results: [{ transcript: 'A long utterance' }] })

    vi.advanceTimersByTime(55_000)
    expect(fake.calls.stop).toBe(1)

    fake.emit('result', { isFinal: true, results: [] })
    fake.emit('end', null)

    expect(fake.calls.start).toHaveLength(2)
    expect(fake.calls.stop).toBe(1)
    expect(events.lines).toEqual([{ text: 'A long utterance', endedAt: 1_000_000, silenceWindowMs: 500 }])
  })

  test('reports onAssetProgress never across engine lifecycle', async () => {
    const { fake, engine, events } = fixture()

    await engine.availability()
    await engine.installAsset()
    await engine.start({ lang: 'en-US' })
    fake.emit('result', { isFinal: false, results: [{ transcript: 'Hi', confidence: 0 }] })
    await engine.endLine()
    fake.emit('end', null)
    await engine.stop()

    expect(events.assetProgress).toEqual([])
  })

  test('maps error from on-device start to onState unavailable without throwing into session', async () => {
    const { fake, engine, events } = fixture()
    fake.setStartThrows(new Error('SFSpeechRecognition on-device failed'))

    // Should NOT throw
    await expect(engine.start({ lang: 'en-US' })).resolves.toBeUndefined()

    expect(events.states).toContainEqual({
      state: 'unavailable',
      reason: 'SFSpeechRecognition on-device failed'
    })
  })

  test('maps native error event to onState unavailable', async () => {
    const { fake, engine, events } = fixture()

    await engine.start({ lang: 'en-US' })
    fake.emit('error', { error: 'language-not-supported', message: 'Language en-US not supported on device' })

    expect(events.states).toContainEqual({
      state: 'unavailable',
      reason: 'Language en-US not supported on device'
    })
  })

  test('maps volumechange into onVoice: >= 0 is true, < 0 is false', async () => {
    const { fake, engine, events } = fixture()

    await engine.start({ lang: 'en-US' })

    fake.emit('volumechange', { value: 2.5 })
    expect(events.voices).toEqual([true])

    fake.emit('volumechange', { value: 5.0 })
    // No redundant change emitted
    expect(events.voices).toEqual([true])

    fake.emit('volumechange', { value: -1.0 })
    expect(events.voices).toEqual([true, false])

    fake.emit('volumechange', { value: 0.0 })
    expect(events.voices).toEqual([true, false, true])
  })

  test('stop() aborts the session and does not restart on end event', async () => {
    const { fake, engine, events } = fixture()

    await engine.start({ lang: 'en-US' })
    expect(fake.calls.start).toHaveLength(1)

    await engine.stop()
    expect(fake.calls.abort).toBe(1)
    expect(fake.calls.stop).toBe(0)
    expect(events.states).toContainEqual({ state: 'stopping' })

    fake.emit('end', null)
    // Does NOT restart
    expect(fake.calls.start).toHaveLength(1)
    expect(events.states).toContainEqual({ state: 'idle' })
  })

  test('unsubscribe removes listeners so no further events are received', async () => {
    const { fake, engine, events, unsubscribe } = fixture()

    await engine.start({ lang: 'en-US' })
    unsubscribe()

    fake.emit('result', { isFinal: false, results: [{ transcript: 'Ignored', confidence: 0 }] })
    expect(events.partials).toEqual([])
  })

  test('default expoEngine instance satisfies ListenEngine interface', () => {
    expect(expoEngine.id).toBe('expo-speech-recognition')
    expect(typeof expoEngine.listen).toBe('function')
    expect(typeof expoEngine.availability).toBe('function')
    expect(typeof expoEngine.installAsset).toBe('function')
    expect(typeof expoEngine.start).toBe('function')
    expect(typeof expoEngine.pause).toBe('function')
    expect(typeof expoEngine.resume).toBe('function')
    expect(typeof expoEngine.stop).toBe('function')
    expect(typeof expoEngine.endLine).toBe('function')
    expect(typeof expoEngine.muteForSpeech).toBe('function')
  })

  test('app.config.ts configures expo-speech-recognition plugin with matching permission strings', () => {
    const config = appConfig({ config: { name: 'Turn', slug: 'turn' } } as any)
    expect(config.plugins).toContainEqual([
      'expo-speech-recognition',
      {
        microphonePermission:
          'Turn listens only in Listen mode, after your partner agrees, to turn their words into text on this iPhone so you can answer in your own phrases. No audio is kept.',
        speechRecognitionPermission:
          "Turn uses speech recognition only in Listen mode, after your partner agrees, to turn their words into text when this iPhone can't do it by itself."
      }
    ])
  })
})

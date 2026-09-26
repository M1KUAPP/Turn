import { describe, expect, test } from 'vitest'
import { createSpeechController } from '../src/speech/controller'

function fixture(gate?: { beforeSpeak(): Promise<void>; afterSpeech(): void }) {
  const utterances: Array<{
    text: string
    options: {
      onStart: () => void
      onDone: () => void
      onStopped: () => void
      rate?: number
      voice?: string
    }
  }> = []
  let stops = 0
  let voice: string | null = null
  let rate = 1
  const counts: string[] = []
  const controller = createSpeechController(
    {
      speak: (text, options) => {
        utterances.push({ text, options })
      },
      stop: async () => {
        stops++
      }
    },
    (id) => {
      counts.push(id)
    },
    { voice: () => voice, rate: () => rate },
    gate
  )
  return {
    controller,
    utterances,
    counts,
    setVoice(next: string | null) {
      voice = next
    },
    setRate(next: number) {
      rate = next
    },
    get stops() {
      return stops
    }
  }
}

describe('speech controller', () => {
  test('speaks and repeats unsaved typed text without recording a phrase tap', async () => {
    const app = fixture()
    await app.controller.speak('A long typed sentence')
    expect(app.controller.getSnapshot().activePhraseId).toBeNull()
    app.utterances[0].options.onStart()
    expect(app.counts).toEqual([])
    await app.controller.repeat()
    expect(app.utterances.map((utterance) => utterance.text)).toEqual([
      'A long typed sentence',
      'A long typed sentence'
    ])
    app.utterances[1].options.onStart()
    expect(app.counts).toEqual([])
  })

  test('identifies only the phrase currently speaking', async () => {
    const app = fixture()
    await app.controller.speak('Yes', 'yes')
    expect(app.controller.getSnapshot().activePhraseId).toBe('yes')

    await app.controller.speak('No', 'no')
    expect(app.controller.getSnapshot().activePhraseId).toBe('no')
    app.utterances[1].options.onDone()
    expect(app.controller.getSnapshot().activePhraseId).toBeNull()

    await app.controller.repeat()
    expect(app.controller.getSnapshot().activePhraseId).toBe('no')
    await app.controller.stop()
    expect(app.controller.getSnapshot().activePhraseId).toBeNull()
  })

  test('a second tap stops the first and ignores stale completion', async () => {
    const app = fixture()
    await app.controller.speak('Yes', 'yes')
    app.utterances[0].options.onStart()
    await app.controller.speak('No', 'no')
    expect(app.stops).toBe(1)
    expect(app.utterances.map((utterance) => utterance.text)).toEqual(['Yes', 'No'])
    app.utterances[0].options.onDone()
    expect(app.controller.getSnapshot().speaking).toBe(true)
    app.utterances[1].options.onStart()
    expect(app.counts).toEqual(['yes', 'no'])
  })

  test('Stop preserves the last text and Repeat speaks it again', async () => {
    const app = fixture()
    await app.controller.speak('Water, please', 'water-please')
    await app.controller.stop()
    expect(app.controller.getSnapshot().speaking).toBe(false)
    await app.controller.repeat()
    expect(app.utterances.map((utterance) => utterance.text)).toEqual(['Water, please', 'Water, please'])
    app.utterances[1].options.onStart()
    expect(app.counts).toEqual(['water-please'])
  })

  test('the newest rapid tap wins while a stop is pending', async () => {
    let releaseStop: (() => void) | undefined
    const heard: string[] = []
    const controller = createSpeechController(
      {
        speak: (text) => {
          heard.push(text)
        },
        stop: () =>
          new Promise<void>((resolve) => {
            releaseStop = resolve
          })
      },
      () => {}
    )
    await controller.speak('One', 'one')
    const second = controller.speak('Two', 'two')
    const third = controller.speak('Three', 'three')
    releaseStop?.()
    await Promise.all([second, third])
    expect(heard).toEqual(['One', 'Three'])
  })

  test('a new tap waits for an explicit Stop to finish', async () => {
    let releaseStop: (() => void) | undefined
    const heard: string[] = []
    const controller = createSpeechController(
      {
        speak: (text) => {
          heard.push(text)
        },
        stop: () =>
          new Promise<void>((resolve) => {
            releaseStop = resolve
          })
      },
      () => {}
    )
    await controller.speak('One', 'one')
    const stopping = controller.stop()
    const second = controller.speak('Two', 'two')
    expect(heard).toEqual(['One'])
    releaseStop?.()
    await Promise.all([stopping, second])
    expect(heard).toEqual(['One', 'Two'])
  })

  test('uses the current voice and rate for phrases, typed words, and Repeat', async () => {
    const app = fixture()
    app.setVoice('voice-one')
    app.setRate(0.75)

    await app.controller.speak('Yes', 'yes')
    expect(app.utterances[0].options).toMatchObject({ voice: 'voice-one', rate: 0.75 })

    app.setVoice('voice-two')
    app.setRate(1.25)
    await app.controller.speak('I need more time')
    expect(app.utterances[1].options).toMatchObject({ voice: 'voice-two', rate: 1.25 })

    app.setVoice('voice-three')
    app.setRate(1.5)
    await app.controller.repeat()
    expect(app.utterances[2].options).toMatchObject({ voice: 'voice-three', rate: 1.5 })
    expect(app.utterances[2].text).toBe('I need more time')
  })

  test('previews an override after stopping speech without recording a tap or replacing Repeat', async () => {
    const app = fixture()
    app.setVoice('chosen-voice')
    app.setRate(1.25)
    await app.controller.speak('Water, please')
    await app.controller.preview('Hello. This is how I sound.', 'preview-voice')

    expect(app.stops).toBe(1)
    expect(app.utterances[1]).toMatchObject({
      text: 'Hello. This is how I sound.',
      options: { voice: 'preview-voice', rate: 1.25 }
    })
    app.utterances[1].options.onStart()
    expect(app.counts).toEqual([])

    await app.controller.repeat()
    expect(app.utterances[2].text).toBe('Water, please')
    expect(app.utterances[2].options).toMatchObject({ voice: 'chosen-voice', rate: 1.25 })
  })

  test('a default voice preview omits the voice identifier', async () => {
    const app = fixture()
    app.setVoice('chosen-voice')

    await app.controller.preview('Hello. This is how I sound.', null)

    expect(app.utterances[0].options).not.toHaveProperty('voice')
  })

  test('within speak(), the order is stop, gate, speak', async () => {
    const order: string[] = []
    const controller = createSpeechController(
      {
        speak: (_text, _options) => {
          order.push('speak')
        },
        stop: async () => {
          order.push('stop')
        }
      },
      () => {},
      { voice: () => null, rate: () => 1 },
      {
        beforeSpeak: async () => {
          order.push('gate')
        },
        afterSpeech: () => {
          order.push('afterSpeech')
        }
      }
    )

    await controller.speak('First')
    order.length = 0

    await controller.speak('Second')
    expect(order).toEqual(['stop', 'gate', 'speak'])
  })

  test('a second tap runs the gate again and the first utterance onDone drops afterSpeech()', async () => {
    const gates: string[] = []
    const app = fixture({
      beforeSpeak: async () => {
        gates.push('beforeSpeak')
      },
      afterSpeech: () => {
        gates.push('afterSpeech')
      }
    })

    await app.controller.speak('First')
    expect(gates).toEqual(['beforeSpeak'])

    await app.controller.speak('Second')
    expect(gates).toEqual(['beforeSpeak', 'beforeSpeak'])

    app.utterances[0].options.onDone()
    expect(gates).toEqual(['beforeSpeak', 'beforeSpeak'])

    app.utterances[1].options.onDone()
    expect(gates).toEqual(['beforeSpeak', 'beforeSpeak', 'afterSpeech'])
  })

  test('a tap that arrives while the gate is pending replaces the first', async () => {
    let openGate = () => {}
    let calls = 0
    const { controller, utterances } = fixture({
      beforeSpeak: () => {
        calls++
        if (calls > 1) return Promise.resolve()
        return new Promise<void>((resolve) => {
          openGate = resolve
        })
      },
      afterSpeech: () => {}
    })

    const first = controller.speak('First')
    await Promise.resolve()
    await controller.speak('Second')
    openGate()
    await first

    expect(utterances.map(({ text }) => text)).toEqual(['Second'])
  })

  test('stop(), onStopped, and a throwing speak each call afterSpeech()', async () => {
    let afterSpeechCalls = 0
    const app = fixture({
      beforeSpeak: async () => {},
      afterSpeech: () => {
        afterSpeechCalls++
      }
    })

    await app.controller.speak('First')
    app.utterances[0].options.onStopped()
    expect(afterSpeechCalls).toBe(1)

    await app.controller.speak('Second')
    await app.controller.stop()
    expect(afterSpeechCalls).toBe(2)

    const throwingController = createSpeechController(
      {
        speak: () => {
          throw new Error('TTS engine crashed')
        },
        stop: async () => {}
      },
      () => {},
      { voice: () => null, rate: () => 1 },
      {
        beforeSpeak: async () => {},
        afterSpeech: () => {
          afterSpeechCalls++
        }
      }
    )

    await expect(throwingController.speak('Fails')).rejects.toThrow('TTS engine crashed')
    expect(afterSpeechCalls).toBe(3)
  })
})

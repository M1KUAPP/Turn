import { describe, expect, test } from 'vitest'
import { createSpeechController } from '../src/speech/controller'

function fixture() {
  const utterances: Array<{
    text: string
    options: {
      onStart: () => void
      onDone: () => void
      onStopped: () => void
    }
  }> = []
  let stops = 0
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
    }
  )
  return {
    controller,
    utterances,
    counts,
    get stops() {
      return stops
    }
  }
}

describe('speech controller', () => {
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
})

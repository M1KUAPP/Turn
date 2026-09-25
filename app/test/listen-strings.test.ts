import { describe, expect, test } from 'vitest'
import { listenStrings } from '../src/listen/strings'

describe('Listen mode copy', () => {
  test('exports the exact caption, note, model, and typed-line words', () => {
    expect(listenStrings).toEqual({
      off: 'Listen mode is off.',
      listening: 'Listening',
      saying: "They're saying",
      said: 'They said',
      stillAnswering: expect.any(Function),
      rankedOnPhone: 'Ranked on this phone',
      unavailable: "Live transcription isn't available here. Tap here to type what they say.",
      unavailableLabel: "Live transcription isn't available here.",
      gettingModel: "Getting Apple's English speech model",
      typedLinePrompt: 'Tap here to type what they say.'
    })
    expect(listenStrings.stillAnswering('How was physio?')).toBe('Still answering “How was physio?”')
  })
})

import { describe, expect, test } from 'vitest'
import { consentWords } from '../src/consent/strings'
import { listenControl } from '../src/screens/listen-control'

describe('the Listen control', () => {
  test('off, it starts Listen mode, with no End', () => {
    expect(listenControl({ active: false, micUnavailable: false, paused: false })).toEqual({
      word: 'Listen',
      symbol: 'ear',
      action: 'start',
      hint: undefined,
      showsEnd: false
    })
  })

  test('listening, it pauses, says so to VoiceOver, and has no End beside it', () => {
    expect(listenControl({ active: true, micUnavailable: false, paused: false })).toEqual({
      word: 'Listening',
      symbol: 'mic.fill',
      action: 'pause',
      hint: 'Pauses listening',
      showsEnd: false
    })
  })

  test('paused, it resumes without the card, with End beside it', () => {
    expect(listenControl({ active: true, micUnavailable: false, paused: true })).toEqual({
      word: 'Paused',
      symbol: 'mic.slash',
      action: 'resume',
      hint: 'Resumes listening',
      showsEnd: true
    })
  })

  test('with the mic off, a tap does nothing, and End stays beside it', () => {
    expect(listenControl({ active: true, micUnavailable: true, paused: false })).toEqual({
      word: consentWords.micOff,
      symbol: 'mic.slash',
      action: null,
      hint: undefined,
      showsEnd: true
    })
  })

  test('the mic being off wins over a pause', () => {
    expect(listenControl({ active: true, micUnavailable: true, paused: true }).action).toBeNull()
  })
})

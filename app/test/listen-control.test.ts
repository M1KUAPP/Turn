import { describe, expect, test } from 'vitest'
import { consentWords } from '../src/consent/strings'
import { listenControl } from '../src/screens/listen-control'

const off = { active: false, micUnavailable: false, paused: false, locked: false, countLabel: null }
const on = { ...off, active: true }

describe('the Listen control', () => {
  test('off, it starts Listen mode, with no End', () => {
    expect(listenControl(off)).toEqual({
      word: 'Listen',
      symbol: 'ear',
      action: 'start',
      hint: undefined,
      detail: null,
      showsEnd: false
    })
  })

  test('off, the free lines left sit under the word (PAY-1)', () => {
    expect(listenControl({ ...off, countLabel: '20 free' }).detail).toBe('20 free')
    expect(listenControl({ ...off, countLabel: '1 free' }).detail).toBe('1 free')
  })

  test('locked, it shows a lock and Unlock, and opens the paywall (PAY-2)', () => {
    expect(listenControl({ ...off, locked: true, countLabel: null })).toEqual({
      word: 'Listen',
      symbol: 'lock',
      action: 'unlock',
      hint: 'Opens Turn Listen',
      detail: 'Unlock',
      showsEnd: false
    })
  })

  test('once Listen mode is on, neither a lock nor a count shows', () => {
    for (const state of [on, { ...on, paused: true }, { ...on, micUnavailable: true }]) {
      const control = listenControl({ ...state, locked: true, countLabel: '20 free' })
      expect(control.symbol).not.toBe('lock')
      expect(control.action).not.toBe('unlock')
      expect(control.detail).toBeNull()
    }
  })

  test('listening, it pauses, says so to VoiceOver, and has no End beside it', () => {
    expect(listenControl(on)).toEqual({
      word: 'Listening',
      symbol: 'mic.fill',
      action: 'pause',
      hint: 'Pauses listening',
      detail: null,
      showsEnd: false
    })
  })

  test('paused, it resumes without the card, with End beside it', () => {
    expect(listenControl({ ...on, paused: true })).toEqual({
      word: 'Paused',
      symbol: 'mic.slash',
      action: 'resume',
      hint: 'Resumes listening',
      detail: null,
      showsEnd: true
    })
  })

  test('with the mic off, a tap does nothing, and End stays beside it', () => {
    expect(listenControl({ ...on, micUnavailable: true })).toEqual({
      word: consentWords.micOff,
      symbol: 'mic.slash',
      action: null,
      hint: undefined,
      detail: null,
      showsEnd: true
    })
  })

  test('the mic being off wins over a pause', () => {
    expect(listenControl({ ...on, micUnavailable: true, paused: true }).action).toBeNull()
  })
})

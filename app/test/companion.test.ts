import { afterEach, describe, expect, test, vi } from 'vitest'
import { companionName, createCompanionSettings } from '../src/companion/settings'
import { BLINK_MS, MOUTH_MS, companionState, faceMotion, playFace, type FaceFrame } from '../src/companion/state'

function ports(values: Record<string, string> = {}) {
  const saved = new Map(Object.entries(values))
  return {
    setting: async (key: string) => saved.get(key) ?? null,
    setSetting: async (key: string, value: string | null) => {
      if (value === null) saved.delete(key)
      else saved.set(key, value)
    },
    saved
  }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('companion state', () => {
  test('Speaking wins over Typing, Typing over Listening, and Listening over Rest', () => {
    expect(companionState({ speaking: true, typing: true, listening: true })).toBe('speaking')
    expect(companionState({ speaking: true, typing: false, listening: false })).toBe('speaking')
    expect(companionState({ speaking: false, typing: true, listening: true })).toBe('typing')
    expect(companionState({ speaking: false, typing: false, listening: true })).toBe('listening')
    expect(companionState({ speaking: false, typing: false, listening: false })).toBe('rest')
  })

  test('holds a still face without Let it move or under Reduce Motion, on the half mouth while speaking', () => {
    expect(faceMotion('speaking', false)).toEqual({ kind: 'still', frame: 'half' })
    expect(faceMotion('rest', false)).toEqual({ kind: 'still', frame: 'rest' })
    expect(faceMotion('typing', true)).toEqual({ kind: 'still', frame: 'type' })
    expect(faceMotion('listening', true)).toEqual({ kind: 'still', frame: 'listen' })
    expect(faceMotion('speaking', true)).toEqual({ kind: 'mouth' })
    expect(faceMotion('rest', true)).toEqual({ kind: 'blink' })
  })
})

describe('the face player', () => {
  test('runs no blink timer under Reduce Motion', () => {
    vi.useFakeTimers()
    const shown: FaceFrame[] = []
    const stop = playFace(faceMotion('rest', false), (frame) => shown.push(frame))

    vi.advanceTimersByTime(20_000)

    expect(vi.getTimerCount()).toBe(0)
    expect(shown).toEqual(['rest'])
    stop()
  })

  test('blinks for 120 ms after four to six seconds at rest, then waits again', () => {
    vi.useFakeTimers()
    const shown: FaceFrame[] = []
    const clock = { setTimeout, clearTimeout, random: () => 0.5 }
    const stop = playFace({ kind: 'blink' }, (frame) => shown.push(frame), clock)

    vi.advanceTimersByTime(4999)
    expect(shown).toEqual(['rest'])
    vi.advanceTimersByTime(1)
    expect(shown).toEqual(['rest', 'blink'])
    vi.advanceTimersByTime(BLINK_MS)
    expect(shown).toEqual(['rest', 'blink', 'rest'])

    stop()
    expect(vi.getTimerCount()).toBe(0)
  })

  test('cycles rest, half, and open about eight times a second while speaking', () => {
    vi.useFakeTimers()
    const shown: FaceFrame[] = []
    const stop = playFace({ kind: 'mouth' }, (frame) => shown.push(frame))

    vi.advanceTimersByTime(MOUTH_MS * 4)

    expect(shown).toEqual(['rest', 'half', 'open', 'rest', 'half'])
    stop()
    expect(vi.getTimerCount()).toBe(0)
  })
})

describe('companion settings', () => {
  test('start with no face and Let it move on', async () => {
    const settings = createCompanionSettings(ports())
    await settings.loadSaved()

    expect(settings.snapshot()).toEqual({ model: null, moves: true })
    expect(companionName(settings.snapshot().model)).toBe('Off')
  })

  test('save the chosen face and Let it move, and read them back', async () => {
    const saved = ports()
    const settings = createCompanionSettings(saved)
    let notified = 0
    settings.subscribe(() => {
      notified += 1
    })

    await settings.chooseModel('ice')
    await settings.chooseMoves(false)
    const next = createCompanionSettings(saved)
    await next.loadSaved()

    expect(notified).toBe(2)
    expect(next.snapshot()).toEqual({ model: 'ice', moves: false })
    expect(companionName(next.snapshot().model)).toBe('Ice')
  })

  test('No companion and Let it move back on clear their settings', async () => {
    const saved = ports({ companion_model: 'ren', companion_moves: '0' })
    const settings = createCompanionSettings(saved)
    await settings.loadSaved()

    await settings.chooseModel(null)
    await settings.chooseMoves(true)

    expect(saved.saved.size).toBe(0)
    expect(settings.snapshot()).toEqual({ model: null, moves: true })
  })

  test('ignore a saved face the app no longer has', async () => {
    const settings = createCompanionSettings(ports({ companion_model: 'retired' }))
    await settings.loadSaved()

    expect(settings.snapshot().model).toBeNull()
  })
})

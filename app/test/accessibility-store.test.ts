import { describe, expect, test, vi } from 'vitest'
import { createAccessibilityStore, type AccessibilityPreferences } from '../src/accessibility/store'

const initial: AccessibilityPreferences = {
  reduceMotion: true,
  boldText: false,
  reduceTransparency: true,
  increaseContrast: false,
  fontScale: 1.786
}

describe('accessibility preferences store', () => {
  test('reads every preference when the first screen subscribes', async () => {
    let onChange: ((change: Partial<AccessibilityPreferences>) => void) | undefined
    const stop = vi.fn()
    const store = createAccessibilityStore({
      read: async () => initial,
      subscribe: (listener) => {
        onChange = listener
        return stop
      }
    })
    const notify = vi.fn()

    const unsubscribe = store.subscribe(notify)
    await store.ready()
    expect(store.getSnapshot()).toEqual(initial)
    expect(notify).toHaveBeenCalledTimes(1)

    onChange?.({ boldText: true, increaseContrast: true, fontScale: 2.0 })
    expect(store.getSnapshot()).toEqual({
      ...initial,
      boldText: true,
      increaseContrast: true,
      fontScale: 2.0
    })
    expect(notify).toHaveBeenCalledTimes(2)

    unsubscribe()
    expect(stop).toHaveBeenCalledTimes(1)
  })

  test('does not overwrite a newer event with a slow launch read', async () => {
    let finishRead!: (value: AccessibilityPreferences) => void
    let onChange!: (change: Partial<AccessibilityPreferences>) => void
    const store = createAccessibilityStore({
      read: () =>
        new Promise((resolve) => {
          finishRead = resolve
        }),
      subscribe: (listener) => {
        onChange = listener
        return () => {}
      }
    })

    store.subscribe(() => {})
    onChange({ boldText: true })
    finishRead(initial)
    await store.ready()
    expect(store.getSnapshot()).toEqual({ ...initial, boldText: true })
  })
})

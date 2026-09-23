import { describe, expect, test, vi } from 'vitest'
import { AccessibilityInfo, AppState, Dimensions, PixelRatio } from 'react-native'
import { nativeAccessibilitySource } from '../src/accessibility/native'

vi.mock('react-native', () => ({
  AccessibilityInfo: {
    isReduceMotionEnabled: vi.fn(async () => true),
    isBoldTextEnabled: vi.fn(async () => false),
    isReduceTransparencyEnabled: vi.fn(async () => true),
    isDarkerSystemColorsEnabled: vi.fn(async () => false),
    addEventListener: vi.fn(() => ({ remove: vi.fn() }))
  },
  AppState: { addEventListener: vi.fn(() => ({ remove: vi.fn() })) },
  Dimensions: {
    get: vi.fn(() => ({ fontScale: 1.25 })),
    addEventListener: vi.fn(() => ({ remove: vi.fn() }))
  },
  PixelRatio: { getFontScale: vi.fn(() => 1.25) }
}))

describe('iOS accessibility source', () => {
  test('reads the five system settings', async () => {
    expect(await nativeAccessibilitySource.read()).toEqual({
      reduceMotion: true,
      boldText: false,
      reduceTransparency: true,
      increaseContrast: false,
      fontScale: 1.25
    })
  })

  test('reports system changes and refreshes after returning from Settings', async () => {
    const changes: unknown[] = []
    const stop = nativeAccessibilitySource.subscribe((change) => changes.push(change))
    const accessibilityEvents = vi.mocked(AccessibilityInfo.addEventListener).mock.calls as unknown as [
      string,
      (value: boolean) => void
    ][]
    expect(accessibilityEvents.map(([name]) => name)).toEqual([
      'reduceMotionChanged',
      'boldTextChanged',
      'reduceTransparencyChanged',
      'darkerSystemColorsChanged'
    ])
    const bold = accessibilityEvents.find(([name]) => name === 'boldTextChanged')![1]
    bold(true)
    expect(changes).toContainEqual({ boldText: true })

    const dimensionHandler = vi.mocked(Dimensions.addEventListener).mock.calls[0][1]
    dimensionHandler({ window: { fontScale: 2 } } as never)
    expect(changes).toContainEqual({ fontScale: 2 })

    const appStateHandler = vi.mocked(AppState.addEventListener).mock.calls[0][1]
    appStateHandler('active')
    await vi.waitFor(() => expect(changes).toContainEqual(awaitedPreferences))

    stop()
    expect(vi.mocked(PixelRatio.getFontScale)).toHaveBeenCalled()
  })
})

const awaitedPreferences = {
  reduceMotion: true,
  boldText: false,
  reduceTransparency: true,
  increaseContrast: false,
  fontScale: 1.25
}

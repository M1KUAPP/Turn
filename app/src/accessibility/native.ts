import { AccessibilityInfo, AppState, Dimensions, PixelRatio } from 'react-native'
import type { AccessibilityPreferences, AccessibilitySource } from './store'

async function readPreferences(): Promise<AccessibilityPreferences> {
  const [reduceMotion, boldText, reduceTransparency, increaseContrast] = await Promise.all([
    AccessibilityInfo.isReduceMotionEnabled(),
    AccessibilityInfo.isBoldTextEnabled(),
    AccessibilityInfo.isReduceTransparencyEnabled(),
    AccessibilityInfo.isDarkerSystemColorsEnabled()
  ])
  return {
    reduceMotion,
    boldText,
    reduceTransparency,
    increaseContrast,
    fontScale: PixelRatio.getFontScale()
  }
}

export const nativeAccessibilitySource: AccessibilitySource = {
  read: readPreferences,
  subscribe(listener) {
    const subscriptions = [
      AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => listener({ reduceMotion: Boolean(value) })),
      AccessibilityInfo.addEventListener('boldTextChanged', (value) => listener({ boldText: Boolean(value) })),
      AccessibilityInfo.addEventListener('reduceTransparencyChanged', (value) =>
        listener({ reduceTransparency: Boolean(value) })
      ),
      AccessibilityInfo.addEventListener('darkerSystemColorsChanged', (value) =>
        listener({ increaseContrast: Boolean(value) })
      ),
      Dimensions.addEventListener('change', ({ window }) => listener({ fontScale: window.fontScale })),
      AppState.addEventListener('change', (state) => {
        if (state === 'active') void readPreferences().then(listener)
      })
    ]
    return () => subscriptions.forEach((subscription) => subscription.remove())
  }
}

import { useEffect, useState } from 'react'
import { AccessibilityInfo, useColorScheme } from 'react-native'

// Plan 0044's shadows as React Native 0.86 boxShadow strings, one set per appearance; the big reply's shows in light
// only. The place menu's scrim is the frames' black wash, 12% in light and the raised shadow's 45% in dark.
const depth = {
  light: {
    card: '0 1px 2px rgba(30,26,21,.06), 0 6px 16px rgba(30,26,21,.07)',
    raised: '0 2px 4px rgba(30,26,21,.08), 0 14px 32px rgba(30,26,21,.12)',
    big: '0 10px 28px rgba(36,56,201,.35)',
    scrim: 'rgba(0,0,0,0.12)'
  },
  dark: {
    card: '0 1px 2px rgba(0,0,0,.45), 0 8px 20px rgba(0,0,0,.35)',
    raised: '0 2px 4px rgba(0,0,0,.5), 0 14px 32px rgba(0,0,0,.45)',
    big: undefined,
    scrim: 'rgba(0,0,0,0.45)'
  }
}

export const listeningGlow = '0 0 18px 2px rgba(255,138,61,.55)'

// The big reply's decoration, white in every appearance, as the frames draw it: a sheen from the top-left corner and a
// faint ring at the bottom right. Both hide under Increase Contrast.
export const bigSheen = 'radial-gradient(circle 234px at 0px 0px, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%)'
export const bigRing = 'rgba(255,255,255,0.06)'

export function useDepth() {
  return depth[useColorScheme() === 'dark' ? 'dark' : 'light']
}

/** An iOS accessibility setting, read at mount and followed as it changes. */
export function useSystemSetting(
  read: () => Promise<boolean>,
  event: 'darkerSystemColorsChanged' | 'reduceTransparencyChanged'
) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    let alive = true
    void read().then((value) => {
      if (alive) setOn(value)
    })
    const subscription = AccessibilityInfo.addEventListener(event, (value) => setOn(Boolean(value)))
    return () => {
      alive = false
      subscription.remove()
    }
  }, [read, event])
  return on
}

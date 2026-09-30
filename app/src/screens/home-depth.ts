import { useColorScheme } from 'react-native'

// Plan 0044's shadows as React Native 0.86 boxShadow strings, one set per appearance; the big reply's shows in light
// only.
const depth = {
  light: {
    card: '0 1px 2px rgba(30,26,21,.06), 0 6px 16px rgba(30,26,21,.07)',
    raised: '0 2px 4px rgba(30,26,21,.08), 0 14px 32px rgba(30,26,21,.12)',
    big: '0 10px 28px rgba(36,56,201,.35)'
  },
  dark: {
    card: '0 1px 2px rgba(0,0,0,.45), 0 8px 20px rgba(0,0,0,.35)',
    raised: '0 2px 4px rgba(0,0,0,.5), 0 14px 32px rgba(0,0,0,.45)',
    big: undefined
  }
}

export const listeningGlow = '0 0 18px 2px rgba(255,138,61,.55)'

// The big reply's decoration, white in every appearance, as the frames draw it: a sheen from the top-left corner and a
// faint ring at the bottom right. Both hide under Increase Contrast.
export const bigSheen = 'radial-gradient(234px 234px at 0px 0px, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%)'
export const bigRing = 'rgba(255,255,255,0.06)'

export function useDepth() {
  return depth[useColorScheme() === 'dark' ? 'dark' : 'light']
}

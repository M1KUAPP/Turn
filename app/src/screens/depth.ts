import { useColorScheme } from 'react-native'

// DESIGN's elevation table, as React Native 0.86 `boxShadow` strings; a string can't follow the appearance by itself.
const shadows = {
  card: {
    light: '0 1px 2px rgba(30,26,21,.06), 0 6px 16px rgba(30,26,21,.07)',
    dark: '0 1px 2px rgba(0,0,0,.45), 0 8px 20px rgba(0,0,0,.35)'
  },
  raised: {
    light: '0 2px 4px rgba(30,26,21,.08), 0 14px 32px rgba(30,26,21,.12)',
    dark: '0 2px 4px rgba(0,0,0,.5), 0 14px 32px rgba(0,0,0,.45)'
  },
  glow: { light: '0 0 18px 2px rgba(255,138,61,.55)', dark: '0 0 18px 2px rgba(255,138,61,.55)' }
} as const

export function useShadow(kind: keyof typeof shadows) {
  return shadows[kind][useColorScheme() === 'dark' ? 'dark' : 'light']
}

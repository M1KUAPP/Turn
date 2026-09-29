import { describe, expect, test, vi } from 'vitest'

vi.mock('react-native', () => ({ DynamicColorIOS: (values: unknown) => values }))

import { colorValues } from '../src/constants/theme'

const appearances = ['light', 'dark', 'light-hc', 'dark-hc'] as const

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((index) => {
    const value = Number.parseInt(hex.slice(index, index + 2), 16) / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

function contrast(first: string, second: string): number {
  const a = luminance(first)
  const b = luminance(second)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

describe('text pairs the settings and bank screens add', () => {
  // Pairs DESIGN's contrast table doesn't list, each held to its 4.5 to 1 floor for text in every appearance.
  const pairs: Array<[keyof typeof colorValues, keyof typeof colorValues, string]> = [
    ['no-edge', 'surface', 'Destructive buttons and rows'],
    ['no-edge', 'surface-pressed', 'Destructive buttons while pressed'],
    ['ink', 'surface-sunken', 'Read aloud and the symbols on sunken buttons'],
    ['accent', 'board', 'The permission step’s privacy link'],
    ['ink-secondary', 'surface-pressed', 'Values in a row while pressed']
  ]

  test.each(pairs)('%s on %s reaches 4.5 to 1: %s', (foreground, background) => {
    for (const appearance of appearances) {
      const ratio = contrast(colorValues[foreground][appearance], colorValues[background][appearance])
      expect(ratio, `${foreground} on ${background}, ${appearance}`).toBeGreaterThanOrEqual(4.5)
    }
  })
})

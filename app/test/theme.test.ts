import { readFileSync } from 'node:fs'
import { describe, expect, test, vi } from 'vitest'
import { parse } from 'yaml'

vi.mock('react-native', () => ({ DynamicColorIOS: (values: unknown) => values }))

import { colorValues, colors, textStyle, typography } from '../src/constants/theme'

const design = readFileSync(new URL('../../docs/DESIGN.md', import.meta.url), 'utf8')
const yamlBlocks = [...design.matchAll(/```yaml\n([\s\S]*?)\n```/g)].map((match) => parse(match[1]))
const designColors = yamlBlocks.find((block) => block.colors)?.colors as Record<string, Record<string, string>>
const designTypography = yamlBlocks.find((block) => block.typography)?.typography as Record<
  string,
  { fontFamily: string; fontSize: string; fontWeight: number; lineHeight: string }
>
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

describe('Turn theme', () => {
  test('keeps every native dynamic color in step with the design', () => {
    expect(colorValues).toEqual(designColors)
    for (const [name, values] of Object.entries(designColors)) {
      expect(colors[name as keyof typeof colors]).toEqual({
        light: values.light,
        dark: values.dark,
        highContrastLight: values['light-hc'],
        highContrastDark: values['dark-hc']
      })
    }
  })

  test('keeps every type size, leading, weight, and Dynamic Type ramp', () => {
    const typeSection = design.split('## Typography')[1].split('## ')[0]
    for (const [name, values] of Object.entries(designTypography)) {
      const token = typography[name as keyof typeof typography]
      expect(token.fontFamily).toBe(values.fontFamily)
      expect(token.fontSize).toBe(Number.parseInt(values.fontSize, 10))
      expect(token.lineHeight).toBe(Number.parseInt(values.lineHeight, 10))
      expect(Number(token.fontWeight)).toBe(values.fontWeight)

      const row = typeSection.split('\n').find((line) => line.startsWith(`| \`${name}\``))
      expect(row, `design table row for ${name}`).toBeDefined()
      const cells = row!.split('|').map((cell) => cell.trim())
      expect(token.dynamicTypeRamp).toBe(cells[3].replaceAll('`', ''))
      expect(Number(token.boldTextWeight)).toBe(Number(cells[4]))
      expect(textStyle(name as keyof typeof typography, true).fontWeight).toBe(token.boldTextWeight)
    }
  })

  test('meets every contrast floor in every appearance', () => {
    const table = design.split('### Contrast')[1].split('## Typography')[0]
    const pairs = table.split('\n').flatMap((line) => {
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim())
      if (!/^`[^`]+`$/.test(cells[0] ?? '') || !/^`[^`]+`$/.test(cells[1] ?? '')) {
        return []
      }
      const floor = Number.parseFloat(cells.at(-1) ?? '')
      return [{ foreground: cells[0].slice(1, -1), background: cells[1].slice(1, -1), floor }]
    })
    expect(pairs.length).toBeGreaterThan(20)

    for (const { foreground, background, floor } of pairs) {
      for (const appearance of appearances) {
        const ratio = contrast(
          colorValues[foreground as keyof typeof colorValues][appearance],
          colorValues[background as keyof typeof colorValues][appearance]
        )
        expect(ratio, `${foreground} on ${background} in ${appearance}`).toBeGreaterThanOrEqual(floor)
      }
    }
  })
})

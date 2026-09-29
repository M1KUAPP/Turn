import { describe, expect, test, vi } from 'vitest'

vi.mock('react-native', () => ({ DynamicColorIOS: ({ light }: { light: string }) => light }))

const { categoryColors } = await import('../src/constants/theme')
const { categoryPalette, categorySymbol, placeSymbol } = await import('../src/screens/category-palette')

const starters = Object.keys(categoryColors).map((id) => ({ id }))

describe('category palette', () => {
  test('gives each starter category its own fill and edge', () => {
    for (const { id } of starters) {
      expect(categoryPalette(id, starters)).toBe(categoryColors[id as keyof typeof categoryColors])
    }
  })

  test('gives added categories the hues after Out and about, cycling from Chat', () => {
    const added = Array.from({ length: 10 }, (_, index) => ({ id: `added-${index}` }))
    const categories = [...starters, { id: 'typed' }, ...added]
    expect(categoryPalette('typed', categories)).toBe(categoryColors.chat)
    expect(categoryPalette('added-0', categories)).toBe(categoryColors.care)
    expect(categoryPalette('added-6', categories)).toBe(categoryColors['out-and-about'])
    expect(categoryPalette('added-7', categories)).toBe(categoryColors.chat)
    expect(categoryPalette('added-8', categories)).toBe(categoryColors.care)
  })

  test('falls back to Chat for a category the bank no longer lists', () => {
    expect(categoryPalette('gone', starters)).toBe(categoryColors.chat)
  })
})

describe('category and place symbols', () => {
  test('names the plan 0044 symbol for each starter category and place', () => {
    expect(categorySymbol('care')).toBe('hand.raised.fill')
    expect(categorySymbol('out-and-about')).toBe('figure.walk')
    expect(placeSymbol('clinic')).toBe('stethoscope')
    expect(placeSymbol('home')).toBe('house.fill')
  })

  test('gives added categories and places a generic mark', () => {
    expect(categorySymbol('added-0')).toBe('tag.fill')
    expect(placeSymbol('gym')).toBe('mappin.and.ellipse')
  })
})

import { describe, expect, test, vi } from 'vitest'

vi.mock('react-native', () => ({ DynamicColorIOS: ({ light }: { light: string }) => light }))

import { categoryHue, categorySymbol, placeSymbol } from '../src/screens/category-style'

const bank = ['quick', 'chat', 'care', 'body-pain', 'food', 'feelings', 'family', 'health', 'out-and-about']

describe('category style', () => {
  test("gives each starter category its own fill and edge, and the strip the card's", () => {
    expect(categoryHue('feelings', bank)).toEqual({ fill: '#FFE2D0', edge: '#B4531C' })
    expect(categoryHue('out-and-about', bank)).toEqual({ fill: '#EEF3D2', edge: '#5C7412' })
    expect(categoryHue('strip', bank)).toEqual({ fill: '#FFFCF7', edge: '#8A8072' })
  })

  test('gives added categories the next hue after out-and-about, cycling from chat, in bank order', () => {
    const added = ['typed', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const ids = [...bank.slice(0, 3), 'typed', ...bank.slice(3), ...added.slice(1)]
    expect(categoryHue('typed', ids)).toEqual(categoryHue('chat', bank))
    expect(categoryHue('a', ids)).toEqual(categoryHue('care', bank))
    expect(categoryHue('g', ids)).toEqual(categoryHue('out-and-about', bank))
    expect(categoryHue('h', ids)).toEqual(categoryHue('chat', bank))
    expect(categoryHue('unknown', bank)).toEqual(categoryHue('chat', bank))
  })

  test("names plan 0044's symbol for each starter category and generic ones for the rest", () => {
    expect(categorySymbol('quick')).toBe('bolt.fill')
    expect(categorySymbol('body-pain')).toBe('figure.stand')
    expect(categorySymbol('out-and-about')).toBe('figure.walk')
    expect(categorySymbol('typed')).toBe('keyboard')
    expect(categorySymbol('strip')).toBe('hand.raised')
    expect(categorySymbol('a1b2')).toBe('square.grid.2x2.fill')
  })

  test("names the starter places' symbols and a map pin for places the user adds", () => {
    expect(placeSymbol('home')).toBe('house.fill')
    expect(placeSymbol('clinic')).toBe('stethoscope')
    expect(placeSymbol('shop')).toBe('bag.fill')
    expect(placeSymbol('out')).toBe('figure.walk')
    expect(placeSymbol('place-123')).toBe('mappin.and.ellipse')
  })
})

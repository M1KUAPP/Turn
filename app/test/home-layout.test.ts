import { describe, expect, test } from 'vitest'
import { homeLayout, pageOffset } from '../src/screens/home-layout'

describe('home layout', () => {
  test('keeps the row at 258 points with two columns on ordinary phones', () => {
    for (const width of [375, 402, 440]) {
      expect(homeLayout(width, 852, 1)).toMatchObject({
        rowColumns: 2,
        stripColumns: 3,
        gridColumns: 2,
        slotHeight: 78,
        rowHeight: 258,
        wholeMiddleScroll: false
      })
    }
  })

  test('uses one card column when narrow and one scrolling middle when short', () => {
    expect(homeLayout(320, 852, 1)).toMatchObject({
      rowColumns: 1,
      stripColumns: 1,
      gridColumns: 1,
      wholeMiddleScroll: true
    })
    expect(homeLayout(402, 667, 1)).toMatchObject({
      rowColumns: 2,
      stripColumns: 3,
      gridColumns: 2,
      slotHeight: 64,
      rowHeight: 208,
      wholeMiddleScroll: true
    })
  })

  test('gives AX5 text one column and two full lines in each fixed slot', () => {
    expect(homeLayout(440, 852, 3.57)).toMatchObject({
      rowColumns: 1,
      stripColumns: 1,
      gridColumns: 1,
      slotHeight: 154,
      rowHeight: 984,
      wholeMiddleScroll: true
    })
  })

  test('pages one visible screen and clamps at either end', () => {
    expect(pageOffset(0, 200, 650, 1)).toBe(200)
    expect(pageOffset(400, 200, 650, 1)).toBe(450)
    expect(pageOffset(100, 200, 650, -1)).toBe(0)
  })
})

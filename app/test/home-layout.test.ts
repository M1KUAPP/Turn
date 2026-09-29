import { describe, expect, test } from 'vitest'
import { homeLayout, pageOffset, replyStat, selectedTab, starterCardShown } from '../src/screens/home-layout'

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
      slotHeight: 165,
      rowHeight: 1050,
      wholeMiddleScroll: true
    })
  })

  test('gives short screens a one-line caption and tighter bands, so the grid starts on screen', () => {
    expect(homeLayout(375, 667, 1)).toMatchObject({ oneLineCaption: true, captionHeight: 48, gridGap: 8, tabMargin: 0 })
    expect(homeLayout(375, 667, 1.353)).toMatchObject({ oneLineCaption: true, captionHeight: 48 })
    expect(homeLayout(393, 852, 1)).toMatchObject({
      oneLineCaption: false,
      captionHeight: 94,
      gridGap: 12,
      tabMargin: 4
    })
    expect(homeLayout(393, 852, 0.8)).toMatchObject({ captionHeight: 86 })
    expect(homeLayout(375, 667, 1.786)).toMatchObject({ oneLineCaption: false, captionHeight: 24 + 70 * 1.786 })
  })

  test('pages one visible screen and clamps at either end', () => {
    expect(pageOffset(0, 200, 650, 1)).toBe(200)
    expect(pageOffset(400, 200, 650, 1)).toBe(450)
    expect(pageOffset(100, 200, 650, -1)).toBe(0)
  })
})

describe('selected tab', () => {
  const categories = [{ id: 'quick' }, { id: 'chat' }, { id: 'care' }]

  test('keeps All selected when tapped', () => {
    expect(selectedTab('all', categories)).toBe('all')
  })

  test('keeps a category the bank still has', () => {
    expect(selectedTab('care', categories)).toBe('care')
  })

  test('falls back to Quick once the selected category is deleted', () => {
    expect(selectedTab('food', categories)).toBe('quick')
  })
})

describe('starter card', () => {
  test('offered on an idle first launch', () => {
    expect(
      starterCardShown({
        listening: false,
        composerOpen: false,
        under18: false,
        reviewPending: true,
        reviewDismissed: false
      })
    ).toBe(true)
  })

  test('not during Listen mode', () => {
    expect(
      starterCardShown({
        listening: true,
        composerOpen: false,
        under18: false,
        reviewPending: true,
        reviewDismissed: false
      })
    ).toBe(false)
  })

  test("not over typing's matches", () => {
    expect(
      starterCardShown({
        listening: false,
        composerOpen: true,
        under18: false,
        reviewPending: true,
        reviewDismissed: false
      })
    ).toBe(false)
  })

  test('not over the under-18 note', () => {
    expect(
      starterCardShown({
        listening: false,
        composerOpen: false,
        under18: true,
        reviewPending: true,
        reviewDismissed: false
      })
    ).toBe(false)
  })

  test('gone after Not now', () => {
    expect(
      starterCardShown({
        listening: false,
        composerOpen: false,
        under18: false,
        reviewPending: true,
        reviewDismissed: true
      })
    ).toBe(false)
  })

  test('gone once all are reviewed', () => {
    expect(
      starterCardShown({
        listening: false,
        composerOpen: false,
        under18: false,
        reviewPending: false,
        reviewDismissed: false
      })
    ).toBe(false)
  })
  test('counts a reply for Stats on this phone only in Listen mode, against the line it answers', () => {
    const held = { listening: true, composerMatching: false, newest: 4, answered: 3 }
    expect(replyStat('row', held)).toEqual({ type: 'reply', from: 'row', seq: 3 })
    expect(replyStat('grid', held)).toEqual({ type: 'reply', from: 'grid', seq: 4 })
    expect(replyStat('row', { ...held, composerMatching: true })).toEqual({ type: 'reply', from: 'grid', seq: 4 })
    expect(replyStat('row', { ...held, listening: false })).toBeNull()
    expect(replyStat('grid', { ...held, listening: false })).toBeNull()
  })
})

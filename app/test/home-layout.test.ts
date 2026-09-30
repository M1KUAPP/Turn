import { describe, expect, test } from 'vitest'
import {
  homeLayout,
  modelProgressWords,
  modelSecondsLeft,
  pageOffset,
  replyStat,
  selectedTab,
  gridTextKind,
  slotTextKind,
  starterCardShown,
  toolbarLayout
} from '../src/screens/home-layout'

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
      captionHeight: 114,
      gridGap: 12,
      tabMargin: 4
    })
    expect(homeLayout(393, 852, 0.8)).toMatchObject({ captionHeight: 97 })
    expect(homeLayout(375, 667, 1.786)).toMatchObject({ oneLineCaption: false, captionHeight: 182 })
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

describe('row slot text', () => {
  test('keeps phrase size while about 22 characters fit two lines of a 402-point slot', () => {
    expect(slotTextKind(22, 144, 1, false)).toBe('phrase')
    expect(slotTextKind(23, 144, 1, false)).toBe('button')
  })

  test('steps down sooner as the text grows, and always on short screens', () => {
    expect(slotTextKind(20, 335, 2.6, false)).toBe('phrase')
    expect(slotTextKind(21, 335, 2.6, false)).toBe('button')
    expect(slotTextKind(4, 144, 1, true)).toBe('button')
  })
})

describe('grid text size', () => {
  // A grid card's line on a 393-point iPhone: half the grid, less its padding and the speaking mark's room.
  const line = (393 - 32 - 12) / 2 - 35 - 18

  test('keeps phrase while every word fits its line', () => {
    expect(gridTextKind('I understand everything you say', line, 1, false)).toBe('phrase')
    expect(gridTextKind("That's everything, thanks", line, 1, false)).toBe('phrase')
  })

  test("steps down when a word would break mid-way, as 'appointment' would", () => {
    expect(gridTextKind('When is my next appointment?', line, 1, false)).toBe('button')
    expect(gridTextKind('I understand', line, 1.2, false)).toBe('button')
  })

  test('takes button on short screens, as the grid always has', () => {
    expect(gridTextKind('Yes', line, 1, true)).toBe('button')
  })
})

describe('toolbar layout', () => {
  const defaultLabels = { type: 26, repeat: 38, up: 14, down: 31 }

  test('puts the four 84-point pills in one row at the default size', () => {
    expect(toolbarLayout(defaultLabels, 18, 356)).toEqual({
      stacked: true,
      pillWidth: 84,
      rows: [['type', 'repeat', 'up', 'down']]
    })
  })

  test('narrows the pills to share one row on a 320-point screen', () => {
    const layout = toolbarLayout(defaultLabels, 18, 274)
    expect(layout.stacked).toBe(true)
    expect(layout.pillWidth).toBe(64)
  })

  test('at AX5 splits Type from Repeat, keeping Up and Down paired, so no label is cut', () => {
    expect(toolbarLayout({ type: 100, repeat: 150, up: 65, down: 120 }, 47, 356)).toEqual({
      stacked: false,
      pillWidth: 173,
      rows: [['type'], ['repeat'], ['up', 'down']]
    })
  })

  test('keeps each pair together when both fit side by side', () => {
    expect(toolbarLayout({ type: 50, repeat: 76, up: 28, down: 60 }, 32, 356).rows).toEqual([
      ['type', 'repeat'],
      ['up', 'down']
    ])
  })

  test('fits four 70-point pills beside the companion face, 2 points apart, in the 298-point bar', () => {
    expect(toolbarLayout(defaultLabels, 18, 298 - 12, 2)).toEqual({
      stacked: true,
      pillWidth: 70,
      rows: [['type', 'repeat', 'up', 'down']]
    })
  })
})

describe('speech model progress', () => {
  test('says the percentage, the time left, and that speaking works', () => {
    expect(modelProgressWords(0.62, 60)).toBe('62%, about a minute. Speaking works now.')
    expect(modelProgressWords(0.2, 250)).toBe('20%, about 4 minutes. Speaking works now.')
  })

  test('leaves the time out until the pace is known, and never says 100% before the end', () => {
    expect(modelProgressWords(0.05, null)).toBe('5%. Speaking works now.')
    expect(modelProgressWords(0.999, 1)).toBe('99%, about a minute. Speaking works now.')
  })

  test('estimates the seconds left from the pace so far', () => {
    expect(modelSecondsLeft({ at: 0, progress: 0.1 }, { at: 10_000, progress: 0.2 })).toBeCloseTo(80)
    expect(modelSecondsLeft({ at: 0, progress: 0.1 }, { at: 500, progress: 0.2 })).toBeNull()
    expect(modelSecondsLeft({ at: 0, progress: 0.1 }, { at: 5_000, progress: 0.1 })).toBeNull()
  })
})

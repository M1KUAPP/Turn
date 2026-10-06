import { describe, expect, test } from 'vitest'
import { keyboardInset } from '../src/screens/sheet-layout'

describe('sheet layout', () => {
  test("lifts a page sheet's body by the keyboard's overlap, counting the sheet's own offset", () => {
    // A 402 by 874 iPhone: the sheet starts 62 points down, and its body ends 34 points above the sheet's bottom.
    expect(keyboardInset(874, 812, { y: 0, height: 778 }, 546)).toBe(294)
    expect(keyboardInset(874, 812, { y: 10.4, height: 778 }, 546)).toBe(304)
  })

  test('lifts nothing when the keyboard is down or clears the body', () => {
    expect(keyboardInset(874, 812, { y: 0, height: 778 }, 874)).toBe(0)
    expect(keyboardInset(874, 812, { y: 0, height: 400 }, 546)).toBe(0)
  })
})

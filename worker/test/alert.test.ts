import { describe, expect, test } from 'vitest'
import { alertWindow, assess, fires, formatAlert } from '../scripts/alert'
import { summarize, type LogLine } from '../scripts/summary'

/** An answered line that used this many of Jev's input tokens. */
const answered = (inputTokens: number): LogLine => ({ outcome: 'answered', ms: { total: 900, jev: 700 }, inputTokens })

/** A line Jev refused for credits. */
const outOfCredits: LogLine = { outcome: 'credits', ms: { total: 300, jev: 280 } }

describe('the credit alert (AVAIL-2)', () => {
  test("prices input tokens at jev-1.13.0's $0.042 a million, 42 nanodollars each", () => {
    expect(assess(summarize([answered(1_000_000), answered(500)]), 1)).toEqual({
      outOfCredits: 0,
      inputTokens: 1_000_500,
      spent: 42_021_000,
      level: 1_000_000_000,
      ranOut: false,
      overLevel: false
    })
  })

  test('fires once the spend passes the level, and not at it', () => {
    expect(fires(assess(summarize([answered(1_000_000)]), 0.042))).toBe(false)
    expect(fires(assess(summarize([answered(1_000_000), answered(1)]), 0.042))).toBe(true)
  })

  test('fires on any line out of credits, whatever the level', () => {
    const finding = assess(summarize([outOfCredits]), 100)
    expect(finding).toMatchObject({ outOfCredits: 1, ranOut: true, overLevel: false })
    expect(fires(finding)).toBe(true)
  })

  test('fires at level 0 on any spend, and stays quiet with none', () => {
    expect(fires(assess(summarize([answered(1)]), 0))).toBe(true)
    expect(fires(assess(summarize([{ outcome: 'config', ms: { total: 3 } }]), 0))).toBe(false)
  })
})

describe("the alert's window", () => {
  const now = Date.parse('2026-09-23T12:17:00.000Z')
  const hour = 60 * 60 * 1000

  test('is the last 24 hours', () => {
    expect(alertWindow(undefined, now)).toEqual({ from: now - 24 * hour, to: now })
  })

  test('starts when the last alert was closed, if that is later', () => {
    expect(alertWindow('2026-09-23T09:00:00Z', now)).toEqual({ from: Date.parse('2026-09-23T09:00:00Z'), to: now })
  })

  test('keeps to 24 hours after an older close', () => {
    expect(alertWindow('2026-09-20T09:00:00Z', now)).toEqual({ from: now - 24 * hour, to: now })
  })

  test.each(['last week', '', '2026-09-23T13:00:00Z'])('is null for a close at %j', (since) => {
    expect(alertWindow(since, now)).toBeNull()
  })
})

describe("the alert's issue", () => {
  const window = { from: Date.parse('2026-09-22T12:17:00.000Z'), to: Date.parse('2026-09-23T12:17:00.000Z') }

  test('says what fired, over which window, and what to do', () => {
    const finding = assess(summarize([answered(25_000_000), outOfCredits, outOfCredits]), 0.5)
    expect(formatAlert(finding, window)).toBe(
      [
        "The relay's logs from 2026-09-22T12:17:00.000Z to 2026-09-23T12:17:00.000Z show:",
        '',
        "- 2 lines that Jev refused for credits, logged as `credits`, which means they've run out.",
        "- 25000000 input tokens, about $1.05 at jev-1.13.0's $0.042 a million, past the level of $0.50.",
        '',
        "TypeSafe has no balance check to read, so look at the balance in TypeSafe's console and add credits if " +
          "needed. Without a balance, the alert can't see a slow drain until a line runs out. Close this issue once " +
          'that is done: the alert then counts only lines after the close.'
      ].join('\n')
    )
  })

  test.each([
    [
      'the spend',
      [answered(512)],
      0,
      "- 512 input tokens, about $0.000022 at jev-1.13.0's $0.042 a million, past the level of $0.00."
    ],
    [
      'running out',
      [answered(512), outOfCredits],
      0.5,
      "- 1 line that Jev refused for credits, logged as `credits`, which means they've run out."
    ]
  ])('says only what fired when it was %s', (_, lines, level, said) => {
    expect(
      formatAlert(assess(summarize(lines), level), window)
        .split('\n')
        .slice(2, 4)
    ).toEqual([said, ''])
  })
})

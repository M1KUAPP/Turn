import { describe, expect, test } from 'vitest'
import { formatSummary, isLogLine, percentile, summarize, type LogLine } from '../scripts/summary'

/** An answered line's log fields, with its times in all and in Jev. */
const answered = (total: number, jev: number, inputTokens = 500): LogLine => ({
  outcome: 'answered',
  ms: { total, jev },
  inputTokens
})

/** One line of each outcome but `answered`, and a second configuration. */
const others: LogLine[] = [
  { outcome: 'paywall', ms: { total: 40 } },
  { outcome: 'failed', ms: { total: 2600, jev: 2500 } },
  { outcome: 'credits', ms: { total: 300, jev: 280 } },
  { outcome: 'unverified', ms: { total: 510 } },
  { outcome: 'internal', ms: { total: 5 } },
  { outcome: 'config', ms: { total: 12 } },
  { outcome: 'config', ms: { total: 9 } },
  { outcome: 'duplicate', ms: { total: 8 } },
  { outcome: 'off', ms: { total: 4 } },
  { outcome: 'invalid', ms: { total: 3 } }
]

describe("a day's summary (METRIC-2)", () => {
  test('counts lines answered, paywall responses, failures, each outcome, and input tokens', () => {
    const summary = summarize([answered(900, 700), answered(800, 600, 700), ...others])
    expect(summary).toMatchObject({ lines: 12, answered: 2, paywall: 1, failures: 4, inputTokens: 1200 })
    expect(Object.fromEntries(summary.outcomes)).toEqual({
      answered: 2,
      paywall: 1,
      failed: 1,
      credits: 1,
      unverified: 1,
      internal: 1,
      config: 2,
      duplicate: 1,
      off: 1,
      invalid: 1
    })
  })

  test('takes the latencies of answered lines only, at the median and the 95th percentile by nearest rank', () => {
    const lines = Array.from({ length: 20 }, (_, i) => answered(100 * (i + 1), 10 * (i + 1)))
    const summary = summarize([...lines, { outcome: 'failed', ms: { total: 99_999, jev: 99_999 } }])
    expect(summary.total).toEqual({ median: 1000, p95: 1900 })
    expect(summary.jev).toEqual({ median: 100, p95: 190 })
  })

  test('sorts the latencies before taking them', () => {
    expect(summarize([answered(300, 30), answered(100, 10), answered(200, 20)]).total).toEqual({
      median: 200,
      p95: 300
    })
  })

  test('has no latency for a day with no answered line', () => {
    const summary = summarize([{ outcome: 'config', ms: { total: 3 } }])
    expect(summary.total).toEqual({ median: null, p95: null })
    expect(summary.jev).toEqual({ median: null, p95: null })
  })

  const upTo = (count: number) => Array.from({ length: count }, (_, i) => i + 1)
  test.each([
    [[5], 50, 5],
    [[5], 95, 5],
    [[1, 2], 50, 1],
    [[1, 2], 95, 2],
    [[1, 2, 3], 50, 2],
    [upTo(20), 95, 19],
    [upTo(21), 95, 20],
    [upTo(100), 95, 95],
    [upTo(101), 50, 51]
  ])('takes %j at the %ith percentile as %i', (sorted, percent, value) => {
    expect(percentile(sorted, percent)).toBe(value)
  })

  test('prints the day, the lines beside the events matched, the counts, the latencies, and the tokens', () => {
    const summary = summarize([answered(900, 700), answered(800, 600, 700), ...others])
    expect(formatSummary('2026-09-23', summary, 13)).toBe(
      [
        "The relay's logs for 2026-09-23, in UTC: 12 log lines, of 13 events the query matched",
        '',
        'Lines answered: 2',
        'Paywall responses: 1',
        'Failures: 4 (credits 1, failed 1, internal 1, unverified 1)',
        'Other outcomes: config 2, duplicate 1, invalid 1, off 1',
        '',
        'Latency of answered lines, in milliseconds:',
        '- In all: median 800, 95th percentile 900',
        '- In Jev: median 600, 95th percentile 700',
        '',
        "Jev's input tokens: 1200"
      ].join('\n')
    )
  })

  test('prints one line and one event in the singular', () => {
    expect(formatSummary('2026-09-24', summarize([answered(900, 700)]), 1).split('\n')[0]).toBe(
      "The relay's logs for 2026-09-24, in UTC: 1 log line, of 1 event the query matched"
    )
  })

  test('prints a day with no lines', () => {
    expect(formatSummary('2026-09-24', summarize([]), 0)).toBe(
      [
        "The relay's logs for 2026-09-24, in UTC: 0 log lines, of 0 events the query matched",
        '',
        'Lines answered: 0',
        'Paywall responses: 0',
        'Failures: 0',
        'Other outcomes: none',
        '',
        'Latency of answered lines, in milliseconds:',
        '- In all: none',
        '- In Jev: none',
        '',
        "Jev's input tokens: 0"
      ].join('\n')
    )
  })
})

describe('a log line', () => {
  test.each([
    ['an answered line', answered(900, 700), true],
    [
      'a configuration',
      { at: '2026-09-23T12:00:00.000Z', user: 'ab12cd34', outcome: 'config', ms: { total: 3 } },
      true
    ],
    ['a string', 'Worker started', false],
    ['no outcome', { ms: { total: 3 } }, false],
    ['an outcome that is no text', { outcome: 7 }, false],
    ['a time that is no number', { outcome: 'answered', ms: { total: '900' } }, false],
    ['a time in Jev that is no number', { outcome: 'answered', ms: { total: 900, jev: '700' } }, false],
    ['times that are no object', { outcome: 'answered', ms: 900 }, false],
    ['tokens that are no number', { outcome: 'answered', inputTokens: '512' }, false]
  ])('reads %s as %s', (_, source, is) => {
    expect(isLogLine(source)).toBe(is)
  })
})

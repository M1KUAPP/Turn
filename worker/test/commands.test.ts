import { describe, expect, test, vi } from 'vitest'
import { main as checkCredits } from '../scripts/credits'
import { readFlags } from '../scripts/flags'
import { main as printLogs } from '../scripts/logs'
import { mockCloudflare } from './helpers'

/** The environment the commands read, with made-up values. */
const env = { TURN_CF_ACCOUNT_ID: 'account-test', TURN_CF_LOGS_TOKEN: 'test-logs-token' }

/** One page of the query's events, with these payloads. */
const page = (sources: unknown[]) => () =>
  Response.json({
    success: true,
    errors: [],
    result: {
      events: { events: sources.map((source, i) => ({ $metadata: { id: `e${i}` }, source })), count: sources.length }
    }
  })

/** An answered line's log fields. */
const answered = { outcome: 'answered', ms: { total: 900, jev: 700 }, inputTokens: 512 }

/** Spies on what a command prints, and what it prints as errors. */
function output() {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {})
  const error = vi.spyOn(console, 'error').mockImplementation(() => {})
  return { printed: () => log.mock.calls.join('\n'), errors: () => error.mock.calls.join('\n') }
}

/** The time range of the command's first query. */
const queried = () => JSON.parse(String(vi.mocked(globalThis.fetch).mock.calls[0]?.[1]?.body)).timeframe

describe('bun run logs', () => {
  test("prints a named day's summary, from its midnight to the next", async () => {
    const { printed } = output()
    mockCloudflare(page([answered]))
    expect(await printLogs(['--day', '2026-09-20'], env)).toBe(0)
    expect(queried()).toEqual({ from: Date.parse('2026-09-20T00:00:00Z'), to: Date.parse('2026-09-21T00:00:00Z') })
    expect(printed()).toContain("The relay's logs for 2026-09-20, in UTC: 1 log line, of 1 event the query matched")
  })

  test.each([
    ['a day that has not begun', ['--day', '2099-01-01'], env],
    ['a flag it does not take', ['--level', '0'], env],
    ['no token', [], { TURN_CF_ACCOUNT_ID: 'account-test' }],
    ['no account', [], { TURN_CF_LOGS_TOKEN: 'test-logs-token' }]
  ])('refuses %s with exit 2, before any query', async (_, args, given) => {
    output()
    expect(await printLogs(args, given)).toBe(2)
    expect(vi.mocked(globalThis.fetch)).not.toHaveBeenCalled()
  })

  test('prints a failed query as its message, without the token, and exits 1', async () => {
    const { errors } = output()
    mockCloudflare(() =>
      Response.json({ success: false, errors: [{ message: 'Authentication error' }] }, { status: 403 })
    )
    expect(await printLogs(['--day', '2026-09-20'], env)).toBe(1)
    expect(errors()).toBe('The telemetry query answered 403: Authentication error')
  })
})

describe('the credit check', () => {
  test('reads from the last close and prints the issue when the alert fires', async () => {
    const { printed } = output()
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    mockCloudflare(page([answered]))
    expect(await checkCredits(['--level', '0', '--since', since], env)).toBe(0)
    expect(queried().from).toBe(Date.parse(since))
    expect(printed()).toMatch(/so the alert fires\.\n\nThe relay's logs from /)
    expect(printed()).toContain("- 512 input tokens, about $0.000022 at jev-1.13.0's $0.042 a million")
  })

  test('reads the last 24 hours at $0.50 unless told, and stays quiet under the level', async () => {
    const { printed } = output()
    mockCloudflare(page([answered]))
    expect(await checkCredits([], env)).toBe(0)
    const { from, to } = queried()
    expect(to - from).toBe(24 * 60 * 60 * 1000)
    expect(printed()).toBe(
      `1 log line since ${new Date(from).toISOString()}: 0 out of credits, and $0.000022 spent against a level ` +
        'of $0.50, so the alert stays quiet.'
    )
  })

  test.each([
    ['an empty level', ['--level', ''], env],
    ['a negative level', ['--level', '-1'], env],
    ['a level that is no number', ['--level', 'lots'], env],
    ['a close that has not happened', ['--since', '2099-01-01T00:00:00Z'], env],
    ['a flag it does not take', ['--day', '2026-09-20'], env],
    ['no token', [], { TURN_CF_ACCOUNT_ID: 'account-test' }]
  ])('refuses %s with exit 2, before any query', async (_, args, given) => {
    output()
    expect(await checkCredits(args, given)).toBe(2)
    expect(vi.mocked(globalThis.fetch)).not.toHaveBeenCalled()
  })
})

describe("a command's flags", () => {
  test.each([
    [['--day', '2026-09-20'], { day: '2026-09-20' }],
    [['--day=2026-09-20'], { day: '2026-09-20' }],
    [['--level', ''], { level: '' }],
    [[], {}]
  ])('reads %j as %j', (args, flags) => {
    expect(readFlags(args, ['day', 'level'])).toEqual(flags)
  })

  test.each([[['--out', 'x']], [['--day']], [['2026-09-20']], [['-d', '2026-09-20']]])('refuses %j', (args) => {
    expect(readFlags(args, ['day', 'level'])).toBeNull()
  })
})

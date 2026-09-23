import { describe, expect, test, vi } from 'vitest'
import { expectError, getConfig, headers, lineFor, lineRequest, send, userHash } from './helpers'

/** The headers of a fresh app user ID on this address, which Cloudflare sets as `CF-Connecting-IP`. */
const from = (address: string, id: string = crypto.randomUUID()) => ({
  ...headers,
  'X-Turn-User': id,
  'CF-Connecting-IP': address
})

/** A line posted from these headers, with the vars changed. */
const lineFrom = (sent: Record<string, string>, changes: Parameters<typeof send>[1] = {}) =>
  send(lineFor(lineRequest(), { ...sent, 'Content-Type': 'application/json' }), changes)

/**
 * Waits for the next minute when fewer than 5 seconds of this one are left, since the binding's windows roll over on
 * the minute, and a test's requests must fall in one window.
 */
async function inOneWindow() {
  const left = 60_000 - (Date.now() % 60_000)
  if (left < 5_000) await scheduler.wait(left + 100)
}

/** Checks that a response is the rate limit's `429`, which tells the app to wait out the binding's minute. */
async function expectLimited(response: Response) {
  await expectError(response, 429, 'rate_limited')
  expect(response.headers.get('Retry-After')).toBe('60')
}

describe('the rate limits (SEC-3)', () => {
  test('answer 30 requests from one ID in a minute, and give the 31st 429 before the object or Jev', async () => {
    await inOneWindow()
    const sent = from('203.0.113.1')
    for (let i = 0; i < 30; i++) expect((await getConfig({}, sent)).status).toBe(200)
    const getByName = vi.fn()
    await expectLimited(await lineFrom(sent, { DEVICE: { getByName } }))
    expect(getByName).not.toHaveBeenCalled()
    expect(vi.mocked(globalThis.fetch)).not.toHaveBeenCalled()
    expect((await getConfig({}, from('203.0.113.1'))).status).toBe(200)
  }, 15_000)

  test('answer 120 requests from one address in a minute, and give the 121st, from a new ID, 429', async () => {
    await inOneWindow()
    for (let user = 0; user < 5; user++) {
      const sent = from('203.0.113.2')
      for (let i = 0; i < 24; i++) expect((await getConfig({}, sent)).status).toBe(200)
    }
    await expectLimited(await getConfig({}, from('203.0.113.2')))
    expect((await getConfig({}, from('203.0.113.3'))).status).toBe(200)
  }, 15_000)

  test("don't count a request that the ID's own limit refuses against its address", async () => {
    await inOneWindow()
    const noisy = from('203.0.113.4')
    for (let i = 0; i < 40; i++) await getConfig({}, noisy)
    for (let user = 0; user < 3; user++) {
      const sent = from('203.0.113.4')
      for (let i = 0; i < 30; i++) expect((await getConfig({}, sent)).status).toBe(200)
    }
    await expectLimited(await getConfig({}, from('203.0.113.4')))
  }, 15_000)

  test('limit the Simulator build while its lines skip the count (PAY-9)', async () => {
    await inOneWindow()
    const sent = { ...from('203.0.113.5'), 'X-Turn-Build': 'simulator' }
    const vars = { SIMULATOR_UNLIMITED: 'true' }
    for (let i = 0; i < 30; i++) expect((await getConfig(vars, sent)).status).toBe(200)
    await expectLimited(await lineFrom(sent, vars))
  }, 15_000)

  test('log a refused request as limited, with the user and no text', async () => {
    await inOneWindow()
    const id = crypto.randomUUID()
    const sent = from('203.0.113.6', id)
    for (let i = 0; i < 30; i++) await getConfig({}, sent)
    const log = vi.spyOn(console, 'log')
    log.mockClear()
    await lineFrom(sent)
    expect(log.mock.calls).toStrictEqual([
      [
        {
          at: expect.stringMatching(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/),
          user: (await userHash(id)).slice(0, 8),
          outcome: 'limited',
          ms: { total: expect.any(Number) }
        }
      ]
    ])
  }, 15_000)
})

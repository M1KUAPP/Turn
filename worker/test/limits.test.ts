import { describe, expect, test, vi } from 'vitest'
import {
  expectError,
  expectRefused,
  getConfig,
  headersFor,
  lineFor,
  lineRequest,
  loggedAt,
  postLineFrom,
  userHash
} from './helpers'

/** The headers of a fresh app user ID, unless one is given, on this address, as Cloudflare sets `CF-Connecting-IP`. */
const from = (address: string, id?: string) => headersFor(id, { 'CF-Connecting-IP': address })

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

describe('the rate limits (SEC-3)', { timeout: 15_000 }, () => {
  test('answer 30 requests from one ID in a minute, and give the 31st 429 before the object or Jev', async () => {
    await inOneWindow()
    const sent = from('203.0.113.1')
    for (let i = 0; i < 30; i++) expect((await getConfig({}, sent)).status).toBe(200)
    const line = lineFor(lineRequest(), { ...sent, 'Content-Type': 'application/json' })
    expect((await expectRefused(line, 429, 'rate_limited')).headers.get('Retry-After')).toBe('60')
    expect((await getConfig({}, from('203.0.113.1'))).status).toBe(200)
  })

  test('answer 120 requests from one address in a minute, and give the 121st, from a new ID, 429', async () => {
    await inOneWindow()
    for (let user = 0; user < 5; user++) {
      const sent = from('203.0.113.2')
      for (let i = 0; i < 24; i++) expect((await getConfig({}, sent)).status).toBe(200)
    }
    await expectLimited(await getConfig({}, from('203.0.113.2')))
    expect((await getConfig({}, from('203.0.113.3'))).status).toBe(200)
  })

  test("don't count a request that the ID's own limit refuses against its address", async () => {
    await inOneWindow()
    const noisy = from('203.0.113.4')
    for (let i = 0; i < 40; i++) await getConfig({}, noisy)
    for (let user = 0; user < 3; user++) {
      const sent = from('203.0.113.4')
      for (let i = 0; i < 30; i++) expect((await getConfig({}, sent)).status).toBe(200)
    }
    await expectLimited(await getConfig({}, from('203.0.113.4')))
  })

  test('limit the Simulator build while its lines skip the count (PAY-9)', async () => {
    await inOneWindow()
    const sent = { ...from('203.0.113.5'), 'X-Turn-Build': 'simulator' }
    const vars = { SIMULATOR_UNLIMITED: 'true' }
    for (let i = 0; i < 30; i++) expect((await getConfig(vars, sent)).status).toBe(200)
    await expectLimited(await postLineFrom(sent, vars))
  })

  test('log a refused request as limited, with the user and no text', async () => {
    await inOneWindow()
    const id = crypto.randomUUID()
    const sent = from('203.0.113.6', id)
    for (let i = 0; i < 30; i++) await getConfig({}, sent)
    const log = vi.spyOn(console, 'log')
    log.mockClear()
    await postLineFrom(sent)
    expect(log.mock.calls).toStrictEqual([
      [
        {
          at: loggedAt,
          user: (await userHash(id)).slice(0, 8),
          outcome: 'limited',
          ms: { total: expect.any(Number) }
        }
      ]
    ])
  })
})

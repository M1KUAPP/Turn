import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import {
  callsTo,
  claimedLines,
  expectError,
  getConfig,
  headersFor,
  lineRequest,
  loggedAt,
  postLineFrom,
  sha256,
  userHash
} from './helpers'

/** The headers of a fresh app user ID, unless one is given, on this address, as Cloudflare sets `CF-Connecting-IP`. */
const from = (address: string, id?: string) => headersFor(id, { 'CF-Connecting-IP': address })

/** Checks that a response is the rate limit's `429`, which tells the app to wait out the minute. */
async function expectLimited(response: Response) {
  await expectError(response, 429, 'rate_limited')
  expect(response.headers.get('Retry-After')).toBe('60')
}

// The user's object and the address's count each clock minute's requests by `Date`, which these tests set.
beforeEach(() => {
  vi.setSystemTime(new Date('2026-10-01T12:00:30.000Z'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe("an ID's limit (SEC-3)", () => {
  test('answers 30 requests from one ID in a minute, and gives the 31st 429 with no line claimed or sent', async () => {
    const id = crypto.randomUUID()
    const sent = from('203.0.113.1', id)
    for (let i = 0; i < 30; i++) expect((await getConfig({}, sent)).status).toBe(200)
    await expectLimited(await postLineFrom(sent))
    expect(callsTo('api.typesafe.ai')).toHaveLength(0)
    expect(await claimedLines(id)).toEqual([])
    expect((await getConfig({}, from('203.0.113.1'))).status).toBe(200)
  })

  test('starts again in the next minute', async () => {
    vi.setSystemTime(new Date('2026-10-01T12:00:59.000Z'))
    const sent = from('203.0.113.2')
    for (let i = 0; i < 30; i++) expect((await getConfig({}, sent)).status).toBe(200)
    await expectLimited(await getConfig({}, sent))
    vi.setSystemTime(new Date('2026-10-01T12:01:00.000Z'))
    expect((await getConfig({}, sent)).status).toBe(200)
  })

  test('counts exactly 30 of 40 simultaneous requests from one ID', async () => {
    const sent = from('203.0.113.3')
    const statuses = await Promise.all(Array.from({ length: 40 }, async () => (await getConfig({}, sent)).status))
    expect(statuses.filter((status) => status === 200)).toHaveLength(30)
    expect(statuses.filter((status) => status === 429)).toHaveLength(10)
  })

  test("doesn't count a line that fails its checks (SEC-2)", async () => {
    const sent = from('203.0.113.4')
    for (let i = 0; i < 30; i++) {
      await expectError(await postLineFrom(sent, {}, lineRequest({ line: '' })), 400, 'invalid_request')
    }
    expect((await getConfig({}, sent)).status).toBe(200)
  })

  test('limits the Simulator build while its lines skip the free lines (PAY-9)', async () => {
    const sent = { ...from('203.0.113.5'), 'X-Turn-Build': 'simulator' }
    const vars = { SIMULATOR_UNLIMITED: 'true' }
    for (let i = 0; i < 30; i++) expect((await getConfig(vars, sent)).status).toBe(200)
    await expectLimited(await postLineFrom(sent, vars))
  })

  test('logs a refused line as limited, with the user and no text', async () => {
    const id = crypto.randomUUID()
    const sent = from('203.0.113.6', id)
    for (let i = 0; i < 30; i++) await getConfig({}, sent)
    const log = vi.spyOn(console, 'log')
    log.mockClear()
    const line = lineRequest()
    await postLineFrom(sent, {}, line)
    expect(log.mock.calls).toStrictEqual([
      [{ at: loggedAt, user: (await userHash(id)).slice(0, 8), seq: 7, outcome: 'limited', ms: { total: 0 } }]
    ])
    expect(JSON.stringify(log.mock.calls)).not.toContain(line.lineId)
  })
})

describe("an address's limit (SEC-3)", () => {
  /**
   * Sends an address's 120 requests of a minute, as configuration requests from five fresh IDs, each answered, with any
   * headers added.
   */
  async function useUpAddress(address: string, added: Record<string, string> = {}) {
    for (let user = 0; user < 5; user++) {
      const sent = { ...from(address), ...added }
      for (let i = 0; i < 24; i++) expect((await getConfig({}, sent)).status).toBe(200)
    }
  }

  test("answers 120 requests from one address in a minute, and gives the 121st, a new ID's line, 429", async () => {
    await useUpAddress('203.0.113.10')
    const id = crypto.randomUUID()
    await expectLimited(await postLineFrom(from('203.0.113.10', id)))
    expect(callsTo('api.typesafe.ai')).toHaveLength(0)
    expect(await claimedLines(id)).toEqual([])
    expect((await getConfig({}, from('203.0.113.11'))).status).toBe(200)
  })

  test("refuses a request over it before the request reaches any user's object", async () => {
    await useUpAddress('203.0.113.12')
    const getByName = vi.fn()
    await expectLimited(await getConfig({ DEVICE: { getByName } }, from('203.0.113.12')))
    expect(getByName).not.toHaveBeenCalled()
  })

  test("answers 500 when the address's object fails, and reaches no user's object", async () => {
    const failing = { getByName: () => ({ admit: () => Promise.reject(new Error('The object is unavailable')) }) }
    const getByName = vi.fn()
    await expectError(
      await getConfig({ ADDRESS: failing, DEVICE: { getByName } }, from('203.0.113.18')),
      500,
      'internal'
    )
    expect(getByName).not.toHaveBeenCalled()
  })

  test('counts by the address Cloudflare sets, whatever X-Forwarded-For says', async () => {
    await useUpAddress('203.0.113.19', { 'X-Forwarded-For': '192.0.2.1' })
    await expectLimited(await getConfig({}, { ...from('203.0.113.19'), 'X-Forwarded-For': '192.0.2.2' }))
  })

  test('keeps one count through the whole clock minute', async () => {
    vi.setSystemTime(new Date('2026-10-01T12:00:00.000Z'))
    await useUpAddress('203.0.113.17')
    vi.setSystemTime(new Date('2026-10-01T12:00:59.999Z'))
    await expectLimited(await getConfig({}, from('203.0.113.17')))
  })

  test('starts again in the next minute', async () => {
    vi.setSystemTime(new Date('2026-10-01T12:00:59.000Z'))
    await useUpAddress('203.0.113.14')
    await expectLimited(await getConfig({}, from('203.0.113.14')))
    vi.setSystemTime(new Date('2026-10-01T12:01:00.000Z'))
    expect((await getConfig({}, from('203.0.113.14'))).status).toBe(200)
  })

  test('counts exactly 120 of 150 simultaneous requests from one address', async () => {
    const users = Array.from({ length: 10 }, () => from('203.0.113.15'))
    const statuses = await Promise.all(
      users.flatMap((sent) => Array.from({ length: 15 }, async () => (await getConfig({}, sent)).status))
    )
    expect(statuses.filter((status) => status === 200)).toHaveLength(120)
    expect(statuses.filter((status) => status === 429)).toHaveLength(30)
  })

  test("doesn't count a line that fails its checks (SEC-2)", async () => {
    for (let user = 0; user < 5; user++) {
      const sent = from('203.0.113.13')
      for (let i = 0; i < 24; i++) {
        await expectError(await postLineFrom(sent, {}, lineRequest({ line: '' })), 400, 'invalid_request')
      }
    }
    expect((await getConfig({}, from('203.0.113.13'))).status).toBe(200)
  })

  test("names the address's object by its salted hash, and requests without one share the salt's", async () => {
    const getByName = vi.fn(() => ({ admit: async () => true }))
    expect((await getConfig({ ADDRESS: { getByName } }, from('203.0.113.16'))).status).toBe(200)
    expect((await getConfig({ ADDRESS: { getByName } }, headersFor())).status).toBe(200)
    expect(getByName.mock.calls).toEqual([
      [`address-${await sha256('test-salt203.0.113.16')}`, { locationHint: 'wnam' }],
      [`address-${await sha256('test-salt')}`, { locationHint: 'wnam' }]
    ])
  })
})

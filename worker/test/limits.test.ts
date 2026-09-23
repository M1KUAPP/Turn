import { runInDurableObject } from 'cloudflare:test'
import { env } from 'cloudflare:workers'
import { afterEach, describe, expect, test, vi } from 'vitest'
import {
  callsTo,
  expectError,
  getConfig,
  headersFor,
  lineFor,
  lineRequest,
  loggedAt,
  postLineFrom,
  send,
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

/** Checks that a response is the rate limit's `429`, which tells the app to wait out the minute. */
async function expectLimited(response: Response) {
  await expectError(response, 429, 'rate_limited')
  expect(response.headers.get('Retry-After')).toBe('60')
}

afterEach(() => {
  vi.useRealTimers()
})

// The user's object counts each clock minute's requests by `Date`, which these tests set; the binding keeps real time.
describe("the ID's limit (SEC-3)", () => {
  test('answer 30 requests from one ID in a minute, and give the 31st 429 with no line counted or sent', async () => {
    vi.setSystemTime(new Date('2026-10-01T12:00:30.000Z'))
    const id = crypto.randomUUID()
    const sent = from('203.0.113.1', id)
    for (let i = 0; i < 30; i++) expect((await getConfig({}, sent)).status).toBe(200)
    await expectLimited(await postLineFrom(sent))
    expect(callsTo('api.typesafe.ai')).toHaveLength(0)
    const claimed = await runInDurableObject(env.DEVICE.getByName(`user-${await userHash(id)}`), (_, state) =>
      state.storage.sql.exec('SELECT line_id FROM free_lines').toArray()
    )
    expect(claimed).toEqual([])
    expect((await getConfig({}, from('203.0.113.1'))).status).toBe(200)
  })

  test("start an ID's count again in the next minute", async () => {
    vi.setSystemTime(new Date('2026-10-01T12:00:59.000Z'))
    const sent = from('203.0.113.2')
    for (let i = 0; i < 30; i++) expect((await getConfig({}, sent)).status).toBe(200)
    await expectLimited(await getConfig({}, sent))
    vi.setSystemTime(new Date('2026-10-01T12:01:00.000Z'))
    expect((await getConfig({}, sent)).status).toBe(200)
  })

  test('count exactly 30 of 40 simultaneous requests from one ID', async () => {
    vi.setSystemTime(new Date('2026-10-01T12:00:30.000Z'))
    const sent = from('203.0.113.3')
    const statuses = await Promise.all(Array.from({ length: 40 }, async () => (await getConfig({}, sent)).status))
    expect(statuses.filter((status) => status === 200)).toHaveLength(30)
    expect(statuses.filter((status) => status === 429)).toHaveLength(10)
  })

  test("check a line before counting it, so an invalid line doesn't use the ID's minute (SEC-2)", async () => {
    vi.setSystemTime(new Date('2026-10-01T12:00:30.000Z'))
    const sent = { ...from('203.0.113.4'), 'Content-Type': 'application/json' }
    for (let i = 0; i < 30; i++) {
      await expectError(await send(lineFor(lineRequest({ line: '' }), sent)), 400, 'invalid_request')
    }
    expect((await getConfig({}, sent)).status).toBe(200)
  })

  test('limit the Simulator build while its lines skip the count (PAY-9)', async () => {
    vi.setSystemTime(new Date('2026-10-01T12:00:30.000Z'))
    const sent = { ...from('203.0.113.5'), 'X-Turn-Build': 'simulator' }
    const vars = { SIMULATOR_UNLIMITED: 'true' }
    for (let i = 0; i < 30; i++) expect((await getConfig(vars, sent)).status).toBe(200)
    await expectLimited(await postLineFrom(sent, vars))
  })

  test('log a refused line as limited, with the user and no text', async () => {
    vi.setSystemTime(new Date('2026-10-01T12:00:30.000Z'))
    const id = crypto.randomUUID()
    const sent = from('203.0.113.6', id)
    for (let i = 0; i < 30; i++) await getConfig({}, sent)
    const log = vi.spyOn(console, 'log')
    log.mockClear()
    const line = lineRequest()
    await send(lineFor(line, { ...sent, 'Content-Type': 'application/json' }))
    expect(log.mock.calls).toStrictEqual([
      [{ at: loggedAt, user: (await userHash(id)).slice(0, 8), seq: 7, outcome: 'limited', ms: { total: 0 } }]
    ])
    expect(JSON.stringify(log.mock.calls)).not.toContain(line.lineId)
  })
})

describe("the address's limit (SEC-3)", { timeout: 15_000 }, () => {
  test('answer 120 requests from one address in a minute, and give the 121st, from a new ID, 429', async () => {
    await inOneWindow()
    for (let user = 0; user < 5; user++) {
      const sent = from('203.0.113.10')
      for (let i = 0; i < 24; i++) expect((await getConfig({}, sent)).status).toBe(200)
    }
    await expectLimited(await getConfig({}, from('203.0.113.10')))
    expect((await getConfig({}, from('203.0.113.11'))).status).toBe(200)
  })

  test("don't count a request that the ID's own limit refuses against its address", async () => {
    await inOneWindow()
    const noisy = from('203.0.113.12')
    for (let i = 0; i < 40; i++) await getConfig({}, noisy)
    for (let user = 0; user < 3; user++) {
      const sent = from('203.0.113.12')
      for (let i = 0; i < 30; i++) expect((await getConfig({}, sent)).status).toBe(200)
    }
    await expectLimited(await getConfig({}, from('203.0.113.12')))
  })
})

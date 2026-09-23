import { describe, expect, test } from 'vitest'
import {
  expectError,
  freeLinesLeft,
  headers,
  jevAnswers,
  jevError,
  lineFor,
  lineRequest,
  mockJev,
  mockRevenueCat,
  postLine,
  send,
  unknownCustomer
} from './helpers'

/** The free lines an answer carries. */
const leftAfter = async (response: Response) =>
  ((await response.json()) as { freeLinesLeft: number | null }).freeLinesLeft

describe('the free lines (PAY-1)', () => {
  test('count down with each answered line, and the 21st gets 402 paywall (STATE-4)', async () => {
    mockJev(...jevAnswers(20))
    for (let left = 19; left >= 0; left--) expect(await leftAfter(await postLine(lineRequest()))).toBe(left)
    mockRevenueCat(unknownCustomer)
    await expectError(await postLine(lineRequest()), 402, 'paywall')
    expect(await freeLinesLeft()).toBe(0)
    expect(await freeLinesLeft({ ...headers, 'X-Turn-User': '7c1d9e2a-4b3f-4e5a-8c6d-0f1e2d3c4b5a' })).toBe(20)
  })

  test('count exactly 20 of 25 simultaneous lines from one ID', async () => {
    mockJev(...jevAnswers(20))
    mockRevenueCat(...Array.from({ length: 5 }, () => unknownCustomer))
    const statuses = await Promise.all(Array.from({ length: 25 }, async () => (await postLine(lineRequest())).status))
    expect(statuses.filter((status) => status === 200)).toHaveLength(20)
    expect(statuses.filter((status) => status === 402)).toHaveLength(5)
    expect(await freeLinesLeft()).toBe(0)
  })

  test('count ten simultaneous copies of one line ID once, answering the rest 409 duplicate', async () => {
    const jev = mockJev(...jevAnswers(1))
    const line = lineRequest()
    const statuses = await Promise.all(Array.from({ length: 10 }, async () => (await postLine(line)).status))
    expect([...statuses].sort()).toEqual([200, ...Array(9).fill(409)])
    expect(jev).toHaveBeenCalledOnce()
    expect(await freeLinesLeft()).toBe(19)
  })

  test('answer a used line ID sent again with new text 409 duplicate, with no call to Jev (SEC-6)', async () => {
    const jev = mockJev(...jevAnswers(1))
    const line = lineRequest()
    expect((await postLine(line)).status).toBe(200)
    await expectError(await postLine({ ...line, line: 'And what about tomorrow?' }), 409, 'duplicate')
    expect(jev).toHaveBeenCalledOnce()
    expect(await freeLinesLeft()).toBe(19)
  })

  test.each([
    ['fails', [jevError(529), jevError(529)]],
    ['is out of credits', [jevError(402)]]
  ])("don't use a free line when Jev %s", async (_, failures) => {
    mockJev(...failures, ...jevAnswers(1))
    await expectError(await postLine(lineRequest()), 503, 'jev_unavailable')
    expect(await freeLinesLeft()).toBe(20)
    expect(await leftAfter(await postLine(lineRequest()))).toBe(19)
  })

  test('show none left, not fewer, once FREE_LINES is lowered below the lines used', async () => {
    mockJev(...jevAnswers(3))
    for (let i = 0; i < 3; i++) await postLine(lineRequest())
    const response = await send(new Request('https://relay.test/v1/config', { headers }), { FREE_LINES: '2' })
    expect(await response.json()).toMatchObject({ freeLinesLeft: 0 })
  })
})

describe('the Simulator switch (PAY-9)', () => {
  const simulator = { ...headers, 'X-Turn-Build': 'simulator' }
  const fromSimulator = (changes: Parameters<typeof send>[1]) =>
    send(lineFor(lineRequest(), { ...simulator, 'Content-Type': 'application/json' }), changes)

  test("lets a simulator request skip the count while it's on, with no count shown", async () => {
    mockJev(...jevAnswers(25))
    for (let i = 0; i < 25; i++) {
      const response = await fromSimulator({ SIMULATOR_UNLIMITED: 'true' })
      expect(response.status).toBe(200)
      expect(await leftAfter(response)).toBeNull()
    }
    expect(await freeLinesLeft(simulator, { SIMULATOR_UNLIMITED: 'true' })).toBeNull()
    expect(await freeLinesLeft(headers, { SIMULATOR_UNLIMITED: 'true' })).toBe(20)
  })

  test("counts a device request while it's on", async () => {
    mockJev(...jevAnswers(1))
    expect(await leftAfter(await postLine(lineRequest(), { SIMULATOR_UNLIMITED: 'true' }))).toBe(19)
  })

  test.each(['false', 'yes', undefined])('counts a simulator request while it is %j', async (value) => {
    mockJev(...jevAnswers(1))
    expect(await leftAfter(await fromSimulator({ SIMULATOR_UNLIMITED: value }))).toBe(19)
    expect(await freeLinesLeft(simulator, { SIMULATOR_UNLIMITED: value })).toBe(19)
  })
})

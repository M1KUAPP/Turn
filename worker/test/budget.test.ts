import { runInDurableObject } from 'cloudflare:test'
import { env } from 'cloudflare:workers'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { Budget } from '../src/budget'
import {
  callsTo,
  expectError,
  freeLinesLeft,
  headersFor,
  jevAnswers,
  jevError,
  lineRequest,
  loggedAt,
  mockJev,
  postLine,
  postLineFrom,
  send,
  simulator,
  userHash
} from './helpers'

/** The vars with the day's calls to Jev lowered to this many, and any other changes. */
const budget = (calls: number, changes: Parameters<typeof send>[1] = {}) => ({
  JEV_DAILY_CALLS: String(calls),
  ...changes
})

afterEach(() => {
  vi.useRealTimers()
})

describe("the day's calls to Jev (SEC-5)", () => {
  test('answer 3 lines at a budget of 3, and give the 4th 503 jev_unavailable with no call to Jev', async () => {
    mockJev(...jevAnswers(3))
    for (let i = 0; i < 3; i++) expect((await postLine(lineRequest(), budget(3))).status).toBe(200)
    await expectError(await postLine(lineRequest(), budget(3)), 503, 'jev_unavailable')
    expect(callsTo('api.typesafe.ai')).toHaveLength(3)
  })

  test('count a retry as a call', async () => {
    mockJev(jevError(529), ...jevAnswers(2))
    expect((await postLine(lineRequest(), budget(3))).status).toBe(200)
    expect((await postLine(lineRequest(), budget(3))).status).toBe(200)
    await expectError(await postLine(lineRequest(), budget(3)), 503, 'jev_unavailable')
    expect(callsTo('api.typesafe.ai')).toHaveLength(3)
  })

  test("leave a line failed, with Jev's status and time, when the budget refuses its retry", async () => {
    mockJev(jevError(529))
    const log = vi.spyOn(console, 'log')
    await expectError(await postLine(lineRequest(), budget(1)), 503, 'jev_unavailable')
    expect(callsTo('api.typesafe.ai')).toHaveLength(1)
    expect(log.mock.calls).toStrictEqual([
      [
        {
          at: loggedAt,
          user: (await userHash()).slice(0, 8),
          seq: 7,
          outcome: 'failed',
          ms: { total: expect.any(Number), jev: expect.any(Number) },
          jevStatus: 529
        }
      ]
    ])
  })

  test('share one budget among all users, counting exactly 3 of 5 simultaneous lines', async () => {
    mockJev(...jevAnswers(3))
    const statuses = await Promise.all(
      Array.from({ length: 5 }, async () => (await postLineFrom(headersFor(), budget(3))).status)
    )
    expect(statuses.filter((status) => status === 200)).toHaveLength(3)
    expect(statuses.filter((status) => status === 503)).toHaveLength(2)
    expect(callsTo('api.typesafe.ai')).toHaveLength(3)
  })

  test('start again from 0 at midnight UTC', async () => {
    mockJev(...jevAnswers(2))
    vi.setSystemTime(new Date('2026-10-01T23:59:59.000Z'))
    expect((await postLine(lineRequest(), budget(1))).status).toBe(200)
    await expectError(await postLine(lineRequest(), budget(1)), 503, 'jev_unavailable')
    vi.setSystemTime(new Date('2026-10-02T00:00:00.000Z'))
    expect((await postLine(lineRequest(), budget(1))).status).toBe(200)
  })

  test("keep a refused line's free line (PAY-1)", async () => {
    mockJev(...jevAnswers(1))
    expect((await postLine(lineRequest(), budget(1))).status).toBe(200)
    await expectError(await postLine(lineRequest(), budget(1)), 503, 'jev_unavailable')
    expect(callsTo('api.typesafe.ai')).toHaveLength(1)
    expect(await freeLinesLeft()).toBe(19)
  })

  test('count a Simulator line that skips the free lines (PAY-9)', async () => {
    mockJev(...jevAnswers(1))
    const vars = budget(1, { SIMULATOR_UNLIMITED: 'true' })
    expect((await postLineFrom(simulator, vars)).status).toBe(200)
    await expectError(await postLineFrom(simulator, vars), 503, 'jev_unavailable')
    expect(callsTo('api.typesafe.ai')).toHaveLength(1)
  })

  test("end a line within its 2.5 seconds while the budget's object is slow (STATE-2)", async () => {
    // The object answers after 3 seconds, as a slow one might; its callers await it either way.
    const answers: Promise<boolean>[] = []
    vi.spyOn(Budget.prototype, 'take').mockImplementation(() => {
      const answer = scheduler.wait(3000).then(() => true)
      answers.push(answer)
      return answer as unknown as boolean
    })
    mockJev(...jevAnswers(2))
    const started = Date.now()
    await expectError(await postLine(lineRequest()), 503, 'jev_unavailable')
    expect(Date.now() - started).toBeLessThan(2900)
    expect(callsTo('api.typesafe.ai')).toHaveLength(0)
    // Every slow answer finishes before the next test resets the object.
    await Promise.all(answers)
  }, 10_000)

  test("keep the day's count in one row of the relay's one budget object", async () => {
    mockJev(...jevAnswers(2))
    for (let i = 0; i < 2; i++) await postLine(lineRequest())
    const rows = await runInDurableObject(env.BUDGET.getByName('jev-calls'), (_, state) =>
      state.storage.sql.exec('SELECT id, day, count FROM calls').toArray()
    )
    expect(rows).toEqual([{ id: 1, day: new Date().toISOString().slice(0, 10), count: 2 }])
  })

  test('refuse a line at once when the budget is spent, and log it spent with no time in Jev or text', async () => {
    mockJev(...jevAnswers(1))
    await postLine(lineRequest(), budget(1))
    const take = vi.spyOn(Budget.prototype, 'take')
    const log = vi.spyOn(console, 'log')
    log.mockClear()
    const line = lineRequest()
    await postLine(line, budget(1))
    // Asked once: the refusal stops the SDK from asking again after its backoff.
    expect(take).toHaveBeenCalledOnce()
    expect(log.mock.calls).toStrictEqual([
      [
        {
          at: loggedAt,
          user: (await userHash()).slice(0, 8),
          seq: 7,
          outcome: 'spent',
          ms: { total: expect.any(Number) }
        }
      ]
    ])
    expect(JSON.stringify(log.mock.calls)).not.toContain(line.lineId)
  })
})

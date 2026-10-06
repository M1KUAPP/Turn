import type { LineRequest } from '@turn/shared/relay'
import { describe, expect, test, vi } from 'vitest'
import {
  headers,
  jevAnswer,
  jevAnswers,
  jevError,
  lineRequest,
  loggedAt,
  mockJev,
  mockRevenueCat,
  postLine,
  send,
  unknownCustomer,
  user,
  userHash
} from './helpers'

describe('the log', () => {
  const at = loggedAt
  const ms = expect.any(Number)

  test('holds one line per request and no text (METRIC-1, PRIV-2)', async () => {
    const log = vi.spyOn(console, 'log')
    const others = (['error', 'warn', 'info', 'debug'] as const).map((name) => vi.spyOn(console, name))
    mockJev(() => Response.json(jevAnswer()), jevError(402), jevError(529), jevError(529))
    const sent: LineRequest[] = []
    const post = (changes: Partial<LineRequest> = {}, vars: Parameters<typeof postLine>[1] = {}) => {
      const body = lineRequest(changes)
      sent.push(body)
      return postLine(body, vars)
    }
    const session = [
      () => send(new Request('https://relay.test/v1/config', { headers })),
      () => post(),
      () => post({ line: 'a'.repeat(301) }),
      () => post({}, { JEV_ON: 'false' }),
      () => post(),
      () => post(),
      () => send(new Request('https://relay.test/v2/lines', { method: 'POST', headers }))
    ]
    for (const request of session) await request()

    const prefix = (await userHash()).slice(0, 8)
    expect(log.mock.calls).toStrictEqual([
      [{ at, user: prefix, outcome: 'config', ms: { total: ms } }],
      [
        {
          at,
          user: prefix,
          seq: 7,
          outcome: 'answered',
          ms: { total: ms, jev: ms },
          model: 'jev-1.13.0',
          inputTokens: 512
        }
      ],
      [{ at, user: prefix, outcome: 'invalid', ms: { total: ms } }],
      [{ at, user: prefix, seq: 7, outcome: 'off', ms: { total: ms } }],
      [{ at, user: prefix, seq: 7, outcome: 'credits', ms: { total: ms, jev: ms }, jevStatus: 402 }],
      [{ at, user: prefix, seq: 7, outcome: 'failed', ms: { total: ms, jev: ms }, jevStatus: 529 }],
      [{ at, outcome: 'not_found', ms: { total: ms } }]
    ])
    const written = JSON.stringify(log.mock.calls)
    for (const { line, place, categories, candidates, lineId } of sent) {
      const texts = [line, place, lineId, ...categories.map(({ name }) => name), ...candidates.map(({ text }) => text)]
      for (const text of texts) expect(written).not.toContain(text)
    }
    expect(written).not.toContain(user)
    for (const other of others) expect(other).not.toHaveBeenCalled()
  })

  test('holds a duplicate, a paywall, and an unverified line, each with no time in Jev and no text', async () => {
    const log = vi.spyOn(console, 'log')
    mockJev(...jevAnswers(1))
    mockRevenueCat(unknownCustomer, () => new Response('Internal Server Error', { status: 500 }))
    const first = lineRequest()
    const sent = [first, first, lineRequest(), lineRequest({ refresh: true })]
    for (const body of sent) await postLine(body, { FREE_LINES: '1' })

    const prefix = (await userHash()).slice(0, 8)
    expect(log.mock.calls.slice(1)).toStrictEqual([
      [{ at, user: prefix, seq: 7, outcome: 'duplicate', ms: { total: ms } }],
      [{ at, user: prefix, seq: 7, outcome: 'paywall', ms: { total: ms } }],
      [{ at, user: prefix, seq: 7, outcome: 'unverified', ms: { total: ms } }]
    ])
    const written = JSON.stringify(log.mock.calls)
    for (const { line, lineId } of sent) for (const text of [line, lineId]) expect(written).not.toContain(text)
    expect(written).not.toContain(user)
  })
})

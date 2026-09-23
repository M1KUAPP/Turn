import { describe, expect, test, vi } from 'vitest'
import { headers, jevAnswer, jevError, lineRequest, mockJev, postLine, send, sha256, user } from './helpers'

describe('the log', () => {
  test('holds one line per request and no text (METRIC-1, PRIV-2)', async () => {
    const log = vi.spyOn(console, 'log')
    const others = (['error', 'warn', 'info', 'debug'] as const).map((name) => vi.spyOn(console, name))
    mockJev(() => Response.json(jevAnswer()), jevError(402), jevError(529), jevError(529))
    const session = [
      () => send(new Request('https://relay.test/v1/config', { headers })),
      () => postLine(lineRequest()),
      () => postLine(lineRequest({ line: 'a'.repeat(301) })),
      () => postLine(lineRequest(), { JEV_ON: 'false' }),
      () => postLine(lineRequest()),
      () => postLine(lineRequest()),
      () => send(new Request('https://relay.test/v2/lines', { method: 'POST', headers }))
    ]
    for (const request of session) await request()

    const at = expect.stringMatching(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/)
    const ms = expect.any(Number)
    const prefix = (await sha256(`test-salt${user}`)).slice(0, 8)
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
    const { line, place, categories, candidates, lineId } = lineRequest()
    for (const text of [line, place, ...categories.map(({ name }) => name), ...candidates.map(({ text }) => text)]) {
      expect(written).not.toContain(text)
    }
    expect(written).not.toContain(user)
    expect(written).not.toContain(lineId)
    for (const other of others) expect(other).not.toHaveBeenCalled()
  })
})

import type { LineRequest } from '@turn/shared/relay'
import { describe, expect, test, vi } from 'vitest'
import { headers, jevAnswer, jevError, lineRequest, mockJev, postLine, send, sha256, user } from './helpers'

describe('the log', () => {
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
    for (const { line, place, categories, candidates, lineId } of sent) {
      const texts = [line, place, lineId, ...categories.map(({ name }) => name), ...candidates.map(({ text }) => text)]
      for (const text of texts) expect(written).not.toContain(text)
    }
    expect(written).not.toContain(user)
    for (const other of others) expect(other).not.toHaveBeenCalled()
  })
})

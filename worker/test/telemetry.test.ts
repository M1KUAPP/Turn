import { describe, expect, test, vi } from 'vitest'
import { pageSize, readLogs } from '../scripts/telemetry'
import { mockCloudflare } from './helpers'

const access = { account: 'account-test', token: 'test-logs-token' }

/** A Workers Logs event whose payload is one of the relay's lines, or anything else given. */
const event = (
  id: string,
  source: unknown = { outcome: 'answered', ms: { total: 900, jev: 700 }, inputTokens: 512 }
) => ({
  $metadata: { id, service: 'turn-relay' },
  source,
  timestamp: 1790121600000,
  dataset: 'cloudflare-workers'
})

/** A page of the query's events, with the count of all the events it matched. */
const page =
  (events: unknown[], count = events.length) =>
  () =>
    Response.json({ success: true, errors: [], result: { events: { events, count } } })

/** The bodies the script posted to the query API. */
const bodies = () => vi.mocked(globalThis.fetch).mock.calls.map(([, init]) => JSON.parse(String(init?.body)))

describe("reading the relay's logs", () => {
  test("asks for the relay's events in the range, 2,000 at a time, without saving the query", async () => {
    mockCloudflare(page([event('e1')]))
    const { lines, matched } = await readLogs(access, 1790035200000, 1790121600000)
    const [[input, init]] = vi.mocked(globalThis.fetch).mock.calls
    expect(String(input)).toBe(
      'https://api.cloudflare.com/client/v4/accounts/account-test/workers/observability/telemetry/query'
    )
    expect(init?.method).toBe('POST')
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer test-logs-token')
    expect(new Headers(init?.headers).get('Content-Type')).toBe('application/json')
    expect(bodies()).toEqual([
      {
        queryId: 'turn-relay-logs',
        timeframe: { from: 1790035200000, to: 1790121600000 },
        view: 'events',
        limit: 2000,
        dry: true,
        parameters: {
          filters: [{ key: '$metadata.service', operation: 'eq', type: 'string', value: 'turn-relay' }]
        }
      }
    ])
    expect(lines).toEqual([{ outcome: 'answered', ms: { total: 900, jev: 700 }, inputTokens: 512 }])
    expect(matched).toBe(1)
  })

  test("pages on from the last event's ID until a page comes back short", async () => {
    const full = Array.from({ length: pageSize }, (_, i) => event(`a${i}`))
    mockCloudflare(page(full, pageSize + 3), page([event('b0'), event('b1'), event('b2')], pageSize + 3))
    const { lines, matched } = await readLogs(access, 0, 1)
    expect(lines).toHaveLength(pageSize + 3)
    expect(matched).toBe(pageSize + 3)
    const [first, second] = bodies()
    expect(first.offset).toBeUndefined()
    expect(second).toMatchObject({ offset: `a${pageSize - 1}`, offsetDirection: 'next' })
  })

  test("keeps only the relay's lines, each event once", async () => {
    mockCloudflare(
      page([event('e1'), event('e2', 'Worker started'), event('e3', { message: 'no outcome' }), event('e1')], 4)
    )
    const { lines, matched } = await readLogs(access, 0, 1)
    expect(lines).toHaveLength(1)
    expect(matched).toBe(4)
  })

  test.each([
    [
      'refuses the token',
      () =>
        Response.json({ success: false, errors: [{ code: 10000, message: 'Authentication error' }] }, { status: 403 })
    ],
    ['fails', () => new Response('Internal Server Error', { status: 500 })],
    ['answers out of shape', () => Response.json({ success: true, result: { events: {} } })],
    ['answers with no JSON', () => new Response('<html>', { status: 200 })],
    ['answers with no count', () => Response.json({ success: true, result: { events: { events: [] } } })],
    [
      'answers a full page it could not page on from',
      page([...Array.from({ length: pageSize - 1 }, (_, i) => event(`a${i}`)), { source: { outcome: 'config' } }])
    ]
  ])('throws, without the token, when the API %s', async (_, reply) => {
    mockCloudflare(reply)
    const error = await readLogs(access, 0, 1).catch((error: unknown) => error)
    expect(error).toBeInstanceOf(Error)
    expect(String(error)).toMatch(/telemetry query/)
    expect(String(error)).not.toContain('test-logs-token')
  })

  test("names the API's own error with its status", async () => {
    mockCloudflare(() =>
      Response.json({ success: false, errors: [{ code: 10000, message: 'Authentication error' }] }, { status: 403 })
    )
    await expect(readLogs(access, 0, 1)).rejects.toThrow('The telemetry query answered 403: Authentication error')
  })
})

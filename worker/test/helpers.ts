import type { LineRequest } from '@turn/shared/relay'
import { env } from 'cloudflare:workers'
import { expect, vi } from 'vitest'
import type { Item } from '../src/entitlement'
import worker from '../src/index'

/**
 * An app user's ID, a lowercase version 4 UUID, which most tests share. Each such test stays under the ID's 30 requests
 * a minute (SEC-3), and one that needs more sends some as other users.
 */
export const user = '5f0e7a8e-3c2b-4d1a-9b6e-2f4c8d0a1b3c'

/** The headers every request from the app carries. */
export const headers: Record<string, string> = {
  'X-Turn-User': user,
  'X-Turn-Version': '1.0.0',
  'X-Turn-Build': 'device'
}

/** The headers of another app user, a fresh one unless an ID is given, with any headers added. */
export const headersFor = (id: string = crypto.randomUUID(), added: Record<string, string> = {}) => ({
  ...headers,
  'X-Turn-User': id,
  ...added
})

/** The headers of the test's user in the Simulator build (PAY-9). */
export const simulator: Record<string, string> = { ...headers, 'X-Turn-Build': 'simulator' }

/** A log line's time, as the relay writes it. */
export const loggedAt = expect.stringMatching(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/)

/** The hex SHA-256 of a text, worked out apart from the relay's own code. */
export async function sha256(text: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

/** The salted hash of an app user's ID, which names their object, for the test's user unless another is given. */
export const userHash = (id = user) => sha256(`test-salt${id}`)

/** Sends a request to the Worker's handler with some vars changed, as the next request after a change sees them. */
export const send = (request: Request, changes: Partial<Record<keyof Env, unknown>> = {}) =>
  worker.fetch(request, { ...env, ...changes } as Env)

/** Checks that a response is the error with this status and code, and carries nothing else (SEC-4). */
export async function expectError(response: Response, status: number, code: string) {
  expect(response.status).toBe(status)
  expect(response.headers.get('Content-Type')).toBe('application/json')
  expect(await response.text()).toBe(JSON.stringify({ error: code }))
}

/** A partner line as the app sends it, with three candidates and a new line ID each time. */
export const lineRequest = (changes: Partial<LineRequest> = {}): LineRequest => ({
  lineId: crypto.randomUUID(),
  seq: 7,
  line: 'How was physio today, [PERSON 1]?',
  place: 'Clinic',
  categories: [
    { id: 'feelings', name: 'Feelings' },
    { id: 'body-pain', name: 'Body and pain' }
  ],
  candidates: [
    { id: 'hard', text: 'It was hard' },
    { id: 'well', text: 'It went well' },
    { id: 'tired', text: "I'm tired" }
  ],
  ...changes
})

/** A line posted as the app posts it, as JSON, or with the headers given instead. */
export const lineFor = (
  body: unknown,
  sent: Record<string, string> = { ...headers, 'Content-Type': 'application/json' }
) =>
  new Request('https://relay.test/v1/lines', {
    method: 'POST',
    headers: sent,
    body: typeof body === 'string' ? body : JSON.stringify(body)
  })

/** Posts a line to the Worker's handler as the app would, with some vars changed. */
export const postLine = (body: unknown, changes: Parameters<typeof send>[1] = {}) => send(lineFor(body), changes)

/** Posts a new line as the app would, from these headers, with some vars changed. */
export const postLineFrom = (sent: Record<string, string>, changes: Parameters<typeof send>[1] = {}) =>
  send(lineFor(lineRequest(), { ...sent, 'Content-Type': 'application/json' }), changes)

/**
 * Checks that a request gets this error, `400 invalid_request` unless another is given, before it reaches the user's
 * object or Jev (SEC-2, SEC-3), and returns the response.
 */
export async function expectRefused(request: Request, status = 400, code = 'invalid_request') {
  const getByName = vi.fn()
  const response = await send(request, { DEVICE: { getByName } })
  await expectError(response, status, code)
  expect(getByName).not.toHaveBeenCalled()
  expect(vi.mocked(globalThis.fetch)).not.toHaveBeenCalled()
  return response
}

/** Jev's answer: an open question, about feelings unless the topic says otherwise, scoring the candidates in order. */
export const jevAnswer = (
  nouls: number[] = [0.9, 0.4, 0.7],
  topic: Record<string, number> = { feelings: 0.8, 'body-pain': 0.15, consent: 0.05 }
) => ({
  model: 'jev-1.13.0',
  answers: {
    kind: {
      type: 'choice',
      choice: 'open',
      confidence: 0.7,
      probabilities: { yes_no: 0.1, either_or: 0.1, open: 0.7, not_a_question: 0.1 }
    },
    topic: { type: 'choice', choice: 'feelings', confidence: 0.8, probabilities: topic },
    ...Object.fromEntries(nouls.map((noul, i) => [`c${String(i).padStart(2, '0')}`, { type: 'noul', noul }]))
  },
  usage: { input_tokens: 512, output_tokens: 20 }
})

/**
 * A response an API gives, built at its call, since the runtime won't share one across Durable Objects, from the call's
 * options, whose signal a reply that hangs listens to.
 */
type Reply = (init?: RequestInit) => Response | Promise<Response>

/** The responses each API has left to give, by host. */
const queues = new Map<string, Reply[]>()

/**
 * Stands in for every API: a call takes the next response queued for its host, and fails once there are none, so a
 * test that forgets one can't reach the real API.
 */
export function routeFetch() {
  queues.clear()
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
    const reply = queues.get(new URL(input instanceof Request ? input.url : String(input)).host)?.shift()
    if (!reply) throw new Error('This test called fetch without mocking it')
    return reply(init)
  })
}

/** Queues these responses for a host's calls, in turn, and returns the spy. */
function queue(host: string, replies: Reply[]) {
  queues.set(host, [...(queues.get(host) ?? []), ...replies])
  return vi.mocked(globalThis.fetch)
}

/** Stands in for Jev with these responses in turn, and returns the spy. */
export const mockJev = (...replies: Reply[]) => queue('api.typesafe.ai', replies)

/** Stands in for RevenueCat's API with these responses in turn, and returns the spy. */
export const mockRevenueCat = (...replies: Reply[]) => queue('api.revenuecat.com', replies)

/** Stands in for Cloudflare's API, which the log scripts query, with these responses in turn, and returns the spy. */
export const mockCloudflare = (...replies: Reply[]) => queue('api.cloudflare.com', replies)

/** RevenueCat's answer for an app user ID it has never seen. */
export const unknownCustomer = () =>
  Response.json(
    { object: 'error', type: 'resource_missing', message: 'Resource not found', retryable: false },
    { status: 404 }
  )

/** Jev's answer, for each of `count` calls. */
export const jevAnswers = (count: number) => Array.from({ length: count }, () => () => Response.json(jevAnswer()))

/** Asks for the configuration as the app does, with some vars changed, for the test's user or the headers' user. */
export const getConfig = (changes: Parameters<typeof send>[1] = {}, sent: Record<string, string> = headers) =>
  send(new Request('https://relay.test/v1/config', { headers: sent }), changes)

/** The free lines the configuration shows, with some vars changed, to the test's user or the one the headers name. */
export async function freeLinesLeft(changes: Parameters<typeof send>[1] = {}, sent: Record<string, string> = headers) {
  return ((await (await getConfig(changes, sent)).json()) as { freeLinesLeft: number | null }).freeLinesLeft
}

/** `listen`, bought once, which never expires. */
export const listen: Item = { entitlement_id: env.RC_ENTITLEMENT_ID, expires_at: null }

/** RevenueCat's list of the user's active entitlements, in the spec's shape. */
export const activeEntitlements =
  (...items: Item[]) =>
  () =>
    Response.json({
      object: 'list',
      items: items.map((item) => ({ object: 'customer.active_entitlement', ...item })),
      next_page: null,
      url: `/v2/projects/${env.RC_PROJECT_ID}/customers/${user}/active_entitlements`
    })

/** RevenueCat's error body, with its status. */
export const rcError = (status: number, type: string) => () =>
  Response.json({ object: 'error', type, message: 'Something went wrong', retryable: status >= 500 }, { status })

/** The calls that reached an API, by its host. */
export const callsTo = (host: string) =>
  vi
    .mocked(globalThis.fetch)
    .mock.calls.filter(([input]) => new URL(input instanceof Request ? input.url : String(input)).host === host)

/** A call that hangs until its signal aborts it. */
export const hang: Reply = (init) =>
  new Promise((_, reject) => init?.signal?.addEventListener('abort', () => reject(init.signal?.reason)))

/** Jev's error, whose body holds what no answer from the relay may carry: the key and an internal error. */
export const jevError = (status: number) => () =>
  Response.json({ detail: 'Traceback: bad key test-typesafe-key' }, { status })

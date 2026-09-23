import type { LineRequest } from '@turn/shared/relay'
import { env } from 'cloudflare:workers'
import { expect, vi } from 'vitest'
import worker from '../src/index'

/** An app user's ID, a lowercase version 4 UUID. */
export const user = '5f0e7a8e-3c2b-4d1a-9b6e-2f4c8d0a1b3c'

/** The headers every request from the app carries. */
export const headers: Record<string, string> = {
  'X-Turn-User': user,
  'X-Turn-Version': '1.0.0',
  'X-Turn-Build': 'device'
}

/** Sends a request to the Worker's handler with some vars changed, as the next request after a change would see them. */
export const send = (request: Request, changes: Partial<Record<keyof Env, unknown>> = {}) =>
  worker.fetch(request, { ...env, ...changes } as Env)

/** Checks that a response is the error with this status and code, and carries nothing else (SEC-4). */
export async function expectError(response: Response, status: number, code: string) {
  expect(response.status).toBe(status)
  expect(response.headers.get('Content-Type')).toBe('application/json')
  expect(await response.text()).toBe(JSON.stringify({ error: code }))
}

/** A partner line as the app sends it, with three candidates. */
export const lineRequest = (changes: Partial<LineRequest> = {}): LineRequest => ({
  lineId: '0b9e4d52-6f1a-4c3e-8d7b-9a2f5e1c4b6d',
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

/** Posts a line to the Worker's handler as JSON, with some vars changed. */
export const postLine = (body: unknown, changes: Parameters<typeof send>[1] = {}) =>
  send(
    new Request('https://relay.test/v1/lines', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: typeof body === 'string' ? body : JSON.stringify(body)
    }),
    changes
  )

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
 * Stands in for Jev with these responses in turn, each built at its call since the runtime won't share one across
 * Durable Objects, and returns the spy. Past them, a call fails as `test/setup.ts` makes it.
 */
export function mockJev(...responses: (() => Response)[]) {
  const spy = vi.mocked(globalThis.fetch)
  for (const response of responses) spy.mockImplementationOnce(async () => response())
  return spy
}

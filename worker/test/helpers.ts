import { env } from 'cloudflare:workers'
import { expect } from 'vitest'
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

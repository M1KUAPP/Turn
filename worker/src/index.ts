import type { ErrorCode, LineAnswer } from '@turn/shared/relay'
import { readConfig } from './config'
import { readLine, readUser } from './request'

export { Device } from './device'

const statuses: Record<ErrorCode, number> = {
  invalid_request: 400,
  not_found: 404,
  duplicate: 409,
  paywall: 402,
  rate_limited: 429,
  jev_off: 503,
  jev_unavailable: 503,
  internal: 500
}

/** An error's response, which carries its code and nothing else (SEC-4). */
const failure = (code: ErrorCode) => Response.json({ error: code }, { status: statuses[code] })

/** The name of a user's object: the hex SHA-256 of the salt and their ID, which can't be traced back without the salt. */
async function objectName(salt: string, user: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + user))
  return `user-${[...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')}`
}

/** Checks a line before anything else (SEC-2), then asks the user's object for Jev's answer. */
async function answerLine(request: Request, env: Env, started: number): Promise<Response> {
  const user = readUser(request.headers)
  const line = user && (await readLine(request))
  if (!user || !line) return failure('invalid_request')
  const config = readConfig(env)
  if (!config.jevOn) return failure('jev_off')
  const device = env.DEVICE.getByName(await objectName(env.ID_SALT, user), { locationHint: 'wnam' })
  const reply = await device.answer(line)
  if (reply.outcome !== 'answered') return failure('jev_unavailable')
  const { kind, topic, scores, ms } = reply
  const answer: LineAnswer = {
    seq: line.seq,
    kind,
    topic,
    scores,
    policy: config.policy,
    freeLinesLeft: config.freeLinesLeft,
    ms: { jev: ms, total: Date.now() - started }
  }
  return Response.json(answer)
}

async function route(request: Request, env: Env, started: number): Promise<Response> {
  const { pathname } = new URL(request.url)
  if (request.method === 'POST' && pathname === '/v1/lines') return answerLine(request, env, started)
  if (request.method === 'GET' && pathname === '/v1/config') {
    if (!readUser(request.headers)) return failure('invalid_request')
    return Response.json(readConfig(env))
  }
  return failure('not_found')
}

export default {
  async fetch(request: Request, env: Env) {
    const started = Date.now()
    try {
      return await route(request, env, started)
    } catch {
      return failure('internal')
    }
  }
} satisfies ExportedHandler<Env>

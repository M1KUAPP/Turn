import type { ErrorCode, LineAnswer } from '@turn/shared/relay'
import { readConfig } from './config'
import { readLine, readUser } from './request'

export { Device } from './device'

/** How a request ended, in its log line (METRIC-1). */
type Outcome =
  'config' | 'answered' | 'paywall' | 'duplicate' | 'invalid' | 'not_found' | 'off' | 'failed' | 'credits' | 'internal'

/**
 * What a request's log line is made from, gathered as the request goes: each fact once it's known, and never any text
 * (PRIV-2). `fetch` writes the line from them, with the time and the total from `started`.
 */
type LogFacts = {
  /** When the request arrived, in milliseconds since 1970. */
  started: number
  /** The first 8 characters of the hash of the user's ID. */
  user?: string
  seq?: number
  outcome?: Outcome
  jevMs?: number
  model?: string
  inputTokens?: number
  /** The status Jev failed with, if it sent one. */
  jevStatus?: number
}

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

/** The error each failing outcome answers with. */
const codes = {
  paywall: 'paywall',
  duplicate: 'duplicate',
  invalid: 'invalid_request',
  not_found: 'not_found',
  off: 'jev_off',
  failed: 'jev_unavailable',
  credits: 'jev_unavailable',
  internal: 'internal'
} satisfies Partial<Record<Outcome, ErrorCode>>

/** Records how a request ended, and answers with that error's code and nothing else (SEC-4). */
function refuse(log: LogFacts, outcome: keyof typeof codes) {
  log.outcome = outcome
  const code = codes[outcome]
  return Response.json({ error: code }, { status: statuses[code] })
}

/** The hex SHA-256 of the salt and the user's ID, which can't be traced back to the ID without the salt. */
async function hashUser(salt: string, user: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + user))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

/** The user's object, named by the salted hash of their ID. */
const deviceFor = (env: Env, hash: string) => env.DEVICE.getByName(`user-${hash}`, { locationHint: 'wnam' })

/** Checks a line before anything else (SEC-2), then asks the user's object to count it and ask Jev. */
async function answerLine(request: Request, env: Env, log: LogFacts, hash: string): Promise<Response> {
  const line = await readLine(request)
  if (!line) return refuse(log, 'invalid')
  log.seq = line.seq
  const config = readConfig(env)
  if (!config.jevOn) return refuse(log, 'off')
  const reply = await deviceFor(env, hash).answer(line, { freeLines: config.freeLinesLeft })
  if ('ms' in reply) log.jevMs = reply.ms
  if (reply.outcome !== 'answered') {
    if ('status' in reply && reply.status) log.jevStatus = reply.status
    return refuse(log, reply.outcome)
  }
  log.outcome = 'answered'
  log.model = reply.model
  log.inputTokens = reply.inputTokens
  const answer: LineAnswer = {
    seq: line.seq,
    kind: reply.kind,
    topic: reply.topic,
    scores: reply.scores,
    policy: config.policy,
    freeLinesLeft: reply.freeLinesLeft,
    ms: { jev: reply.ms, total: Date.now() - log.started }
  }
  return Response.json(answer)
}

/** Finds the route, then checks the headers every request carries, before a line's body or the configuration. */
async function route(request: Request, env: Env, log: LogFacts): Promise<Response> {
  const { pathname } = new URL(request.url)
  const isLine = request.method === 'POST' && pathname === '/v1/lines'
  const isConfig = request.method === 'GET' && pathname === '/v1/config'
  if (!isLine && !isConfig) return refuse(log, 'not_found')
  const user = readUser(request.headers)
  if (!user) return refuse(log, 'invalid')
  const hash = await hashUser(env.ID_SALT, user)
  log.user = hash.slice(0, 8)
  if (isLine) return answerLine(request, env, log, hash)
  const config = readConfig(env)
  const freeLinesLeft = await deviceFor(env, hash).freeLinesLeft({ freeLines: config.freeLinesLeft })
  log.outcome = 'config'
  return Response.json({ ...config, freeLinesLeft })
}

export default {
  /** Answers a request, then writes its one log line as an object, whose keys Workers Logs indexes (METRIC-1). */
  async fetch(request: Request, env: Env) {
    const log: LogFacts = { started: Date.now() }
    let response: Response
    try {
      response = await route(request, env, log)
    } catch {
      response = refuse(log, 'internal')
    }
    const { started, jevMs, ...facts } = log
    const total = Date.now() - started
    console.log({
      at: new Date(started).toISOString(),
      ...facts,
      ms: jevMs === undefined ? { total } : { total, jev: jevMs }
    })
    return response
  }
} satisfies ExportedHandler<Env>

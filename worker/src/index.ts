import type { Config, ErrorCode, LineAnswer, Outcome } from '@turn/shared/relay'
import { isOn, readConfig } from './config'
import type { Terms } from './device'
import { readLine, readUser, type User } from './request'

export { Budget } from './budget'
export { Device } from './device'

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
  unverified: 'jev_unavailable',
  invalid: 'invalid_request',
  not_found: 'not_found',
  limited: 'rate_limited',
  off: 'jev_off',
  failed: 'jev_unavailable',
  credits: 'jev_unavailable',
  spent: 'jev_unavailable',
  internal: 'internal'
} satisfies Partial<Record<Outcome, ErrorCode>>

/**
 * Records how a request ended, and answers with that error's code and nothing else (SEC-4). A request over a rate limit
 * is told to wait 60 seconds, the longest period a binding can have, since the binding doesn't say when its window
 * ends (SEC-3).
 */
function refuse(log: LogFacts, outcome: keyof typeof codes) {
  log.outcome = outcome
  const code = codes[outcome]
  const headers = outcome === 'limited' ? { 'Retry-After': '60' } : undefined
  return Response.json({ error: code }, { status: statuses[code], headers })
}

/** The hex SHA-256 of the salt and the user's ID, which can't be traced back to the ID without the salt. */
async function hashUser(salt: string, userId: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + userId))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

/** The user's object, named by the salted hash of their ID. */
const deviceFor = (env: Env, hash: string) => env.DEVICE.getByName(`user-${hash}`, { locationHint: 'wnam' })

/**
 * The count's terms: the free lines a new user gets, whether this request skips the count, as one from the Simulator
 * build does while `SIMULATOR_UNLIMITED` is on (PAY-9), and the calls to Jev all users share in a UTC day (SEC-5).
 */
const termsFor = (env: Env, freeLines: number, dailyCalls: number, { build }: User): Terms => ({
  freeLines,
  unlimited: build === 'simulator' && isOn(env.SIMULATOR_UNLIMITED),
  dailyCalls
})

/** Checks a line before any count or call (SEC-2), then asks the user's object to count it and ask Jev. */
async function answerLine(request: Request, env: Env, log: LogFacts, user: User, hash: string): Promise<Response> {
  const line = await readLine(request)
  if (!line) return refuse(log, 'invalid')
  log.seq = line.seq
  const { freeLines, dailyCalls, ...config } = readConfig(env)
  if (!config.jevOn) return refuse(log, 'off')
  const reply = await deviceFor(env, hash).answer(line, user.id, termsFor(env, freeLines, dailyCalls, user))
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

/**
 * Whether a request is within its ID's 30 a minute, and then its address's 120, a backstop for IDs minted on one
 * address (SEC-3). A request its ID's own limit refuses doesn't count against the address, which a mobile network may
 * share. Cloudflare sets `CF-Connecting-IP` on requests from clients; any request without one shares one count.
 */
async function withinLimits(request: Request, env: Env, hash: string) {
  if (!(await env.USER_LIMITER.limit({ key: hash })).success) return false
  const address = request.headers.get('CF-Connecting-IP') ?? ''
  return (await env.ADDRESS_LIMITER.limit({ key: address })).success
}

/**
 * Finds the route, then checks the headers every request carries and the rate limits, before a line's body or the
 * configuration.
 */
async function route(request: Request, env: Env, log: LogFacts): Promise<Response> {
  const { pathname } = new URL(request.url)
  const isLine = request.method === 'POST' && pathname === '/v1/lines'
  const isConfig = request.method === 'GET' && pathname === '/v1/config'
  if (!isLine && !isConfig) return refuse(log, 'not_found')
  const user = readUser(request.headers)
  if (!user) return refuse(log, 'invalid')
  const hash = await hashUser(env.ID_SALT, user.id)
  log.user = hash.slice(0, 8)
  if (!(await withinLimits(request, env, hash))) return refuse(log, 'limited')
  if (isLine) return answerLine(request, env, log, user, hash)
  const { freeLines, dailyCalls, ...config } = readConfig(env)
  const freeLinesLeft = await deviceFor(env, hash).freeLinesLeft(termsFor(env, freeLines, dailyCalls, user))
  log.outcome = 'config'
  return Response.json({ ...config, freeLinesLeft } satisfies Config)
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

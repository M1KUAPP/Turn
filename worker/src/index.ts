import type { Config, ErrorCode, LineAnswer, LineRequest, Outcome } from '@turn/shared/relay'
import { isOn, readConfig } from './config'
import type { Terms } from './device'
import { readLine, readUser, type User } from './request'

export { Address } from './address'
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
 * is told to wait 60 seconds: the ID's count and the address's both start again when their clock minute ends, which is
 * never further off (SEC-3).
 */
function refuse(log: LogFacts, outcome: keyof typeof codes) {
  log.outcome = outcome
  const code = codes[outcome]
  const headers = outcome === 'limited' ? { 'Retry-After': '60' } : undefined
  return Response.json({ error: code }, { status: statuses[code], headers })
}

/** The hex SHA-256 of the salt and a user's ID or an address, which can't be traced back to either without the salt. */
async function saltedHash(salt: string, value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + value))
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

/** Asks the user's object to count a line that passed its checks and the address's limit, and to ask Jev. */
async function answerLine(line: LineRequest, env: Env, log: LogFacts, user: User, hash: string): Promise<Response> {
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
 * Whether a request is within its address's 120 a minute, which the address's own object counts exactly, so a flood
 * from IDs minted on one address reaches their objects no faster (SEC-3). The object is named by the salted hash of
 * `CF-Connecting-IP`, which Cloudflare sets on requests from clients, and its edge won't take one from a client; any
 * request without one shares one count. Each ID's 30 are counted by its object, in the call that serves the request.
 */
async function withinAddressLimit(request: Request, env: Env) {
  const hash = await saltedHash(env.ID_SALT, request.headers.get('CF-Connecting-IP') ?? '')
  return env.ADDRESS.getByName(`address-${hash}`, { locationHint: 'wnam' }).admit()
}

/**
 * Finds the route, then checks the headers every request carries and a line's body before any count or call (SEC-2),
 * then the address's limit, before the user's object counts the request and serves the line or the configuration.
 */
async function route(request: Request, env: Env, log: LogFacts): Promise<Response> {
  const { pathname } = new URL(request.url)
  const isLine = request.method === 'POST' && pathname === '/v1/lines'
  const isConfig = request.method === 'GET' && pathname === '/v1/config'
  if (!isLine && !isConfig) return refuse(log, 'not_found')
  const user = readUser(request.headers)
  if (!user) return refuse(log, 'invalid')
  const hash = await saltedHash(env.ID_SALT, user.id)
  log.user = hash.slice(0, 8)
  const line = isLine ? await readLine(request) : undefined
  if (line === null) return refuse(log, 'invalid')
  if (line) log.seq = line.seq
  if (!(await withinAddressLimit(request, env))) return refuse(log, 'limited')
  if (line) return answerLine(line, env, log, user, hash)
  const { freeLines, dailyCalls, ...config } = readConfig(env)
  const reply = await deviceFor(env, hash).config(termsFor(env, freeLines, dailyCalls, user))
  if ('outcome' in reply) return refuse(log, reply.outcome)
  log.outcome = 'config'
  return Response.json({ ...config, freeLinesLeft: reply.freeLinesLeft } satisfies Config)
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

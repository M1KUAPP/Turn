import { buildJevRequest, readJevAnswer, type JevLine } from '@turn/shared/jev'
import type { LineAnswer, LineRequest } from '@turn/shared/relay'
import { APIError, TypeSafeClient, type Fetch } from '@typesafe-ai/sdk'
import { DurableObject } from 'cloudflare:workers'
import { checkEntitlement, type Entitlement } from './entitlement'

/**
 * How a call to Jev ended: its answer, with the model and tokens it reports, how it failed, with its status, or that
 * the day's calls were spent before it could start.
 */
type JevReply =
  | (Pick<LineAnswer, 'kind' | 'topic' | 'scores'> & {
      outcome: 'answered'
      model: string
      inputTokens: number
      ms: number
    })
  | { outcome: 'failed' | 'credits'; status?: number; ms: number }
  | { outcome: 'spent' }

/**
 * How the user's object ended a line: Jev's reply, with the free lines left once it answered, or why the line got no
 * call. Never an error, whose message could carry text across to the Worker.
 */
export type LineReply =
  | (Extract<JevReply, { outcome: 'answered' }> & Pick<LineAnswer, 'freeLinesLeft'>)
  | Exclude<JevReply, { outcome: 'answered' }>
  | { outcome: 'duplicate' | 'paywall' | 'unverified' }

/**
 * From the Worker's vars: the free lines each user gets, whether this request skips the count, and the calls to Jev all
 * users share in a UTC day (PAY-1, PAY-9, SEC-5).
 */
export type Terms = { freeLines: number; unlimited: boolean; dailyCalls: number }

/** RevenueCat's last answer about `listen`, which the object keeps a day if yes and a minute if no (PAY-7). */
type Cached = { active: number; checked_at: number; refreshed_at: number | null }

/** The most a line may take in the relay, RevenueCat's check included, since a later answer is stale (STATE-2). */
const budgetMs = 2500

const minute = 60_000
const day = 24 * 60 * minute

/** A promise's result, or its signal's reason if that aborts first, so no wait outlasts the call it's part of. */
function unlessAborted<T>(promise: Promise<T>, signal: AbortSignal | null | undefined): Promise<T> {
  if (!signal) return promise
  if (signal.aborted) return Promise.reject(signal.reason)
  const aborted = new Promise<never>((_, reject) =>
    signal.addEventListener('abort', () => reject(signal.reason), { once: true })
  )
  return Promise.race([promise, aborted])
}

/** One app user's object, which counts their free lines and calls Jev for their lines. */
export class Device extends DurableObject<Env> {
  /**
   * A client for one line: two attempts of at most 1.5 seconds each, each made through `fetch`, with no wait for a
   * server's `Retry-After`, and no logs. The key, the address, the model, and the log level are all set here, since the
   * SDK reads any of them the code leaves out from `process.env`, which holds the Worker's vars and secrets.
   */
  private jev(fetch: Fetch) {
    return new TypeSafeClient({
      apiKey: this.env.TYPESAFE_API_KEY,
      baseURL: 'https://api.typesafe.ai',
      defaultModel: this.env.JEV_MODEL,
      logLevel: 'off',
      timeout: 1500,
      retry: { maxRetries: 1, respectRetryAfter: false },
      fetch
    })
  }

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    // The ID of each free line claimed, which is deleted if Jev fails, so only answered lines count (PAY-1).
    ctx.storage.sql.exec('CREATE TABLE IF NOT EXISTS free_lines (line_id TEXT PRIMARY KEY, at INTEGER NOT NULL)')
    // RevenueCat's last answer, and when a line with `refresh` last skipped a cached no (PAY-4, PAY-7).
    ctx.storage.sql.exec(
      'CREATE TABLE IF NOT EXISTS entitlement (id INTEGER PRIMARY KEY CHECK (id = 1), active INTEGER NOT NULL, ' +
        'checked_at INTEGER NOT NULL, refreshed_at INTEGER)'
    )
  }

  /** How many free lines are claimed, counting any whose call to Jev is still under way. */
  private claimed(): number {
    return this.ctx.storage.sql.exec<{ count: number }>('SELECT COUNT(*) AS count FROM free_lines').one().count
  }

  /**
   * Claims a line in one transaction, before any `await`, so simultaneous lines can't share the last free line: a line
   * ID already claimed is a duplicate (SEC-6), and a new one below the free lines is claimed (PAY-1).
   */
  private claim(lineId: string, { freeLines }: Terms): 'free' | 'duplicate' | 'paid' {
    return this.ctx.storage.transactionSync(() => {
      const { sql } = this.ctx.storage
      if (sql.exec('SELECT 1 FROM free_lines WHERE line_id = ?', lineId).toArray().length > 0) return 'duplicate'
      if (this.claimed() >= freeLines) return 'paid'
      sql.exec('INSERT INTO free_lines (line_id, at) VALUES (?, ?)', lineId, Date.now())
      return 'free'
    })
  }

  /** RevenueCat's last answer, if the object has asked. */
  private cached(): Cached | undefined {
    return this.ctx.storage.sql.exec<Cached>('SELECT active, checked_at, refreshed_at FROM entitlement').toArray()[0]
  }

  /**
   * Whether the user may have lines past the free ones (PAY-7). A cached yes under a day old answers at once, and so
   * does a cached no under a minute old, unless the line carries `refresh` and no refresh skipped one in the last
   * minute (PAY-4). Otherwise the object asks RevenueCat and caches its answer, recording a refresh only once its check
   * answered. If RevenueCat can't answer, a cached yes of any age still counts, and nothing else is a no; a refresh it
   * couldn't answer leaves the cached no stale.
   */
  private async entitled(userId: string, refresh: boolean): Promise<Entitlement> {
    const now = Date.now()
    const cached = this.cached()
    if (cached?.active && now - cached.checked_at < day) return 'yes'
    const freshNo = cached?.active === 0 && now - cached.checked_at < minute
    const refreshing = freshNo && refresh && (cached.refreshed_at === null || now - cached.refreshed_at >= minute)
    if (freshNo && !refreshing) return 'no'
    const answer = await checkEntitlement(this.env, userId)
    if (answer === 'unknown') {
      // A refresh RevenueCat couldn't answer leaves the no it skipped stale, so the next line asks again rather than
      // meeting it after a purchase (PAY-4).
      if (refreshing) this.ctx.storage.sql.exec('UPDATE entitlement SET checked_at = 0 WHERE active = 0')
      return cached?.active ? 'yes' : 'unknown'
    }
    // The newest check's answer stays, not the last to finish: an older no mustn't cover a newer yes.
    this.ctx.storage.sql.exec(
      'INSERT INTO entitlement (id, active, checked_at, refreshed_at) VALUES (1, ?, ?, ?) ' +
        'ON CONFLICT (id) DO UPDATE SET active = excluded.active, checked_at = excluded.checked_at, ' +
        'refreshed_at = excluded.refreshed_at WHERE excluded.checked_at >= entitlement.checked_at',
      answer === 'yes' ? 1 : 0,
      now,
      refreshing ? now : (cached?.refreshed_at ?? null)
    )
    return answer
  }

  /**
   * The free lines this user has left, which the configuration and each answer carry, or null once they're entitled or
   * while their requests skip the count.
   */
  freeLinesLeft({ freeLines, unlimited }: Terms): number | null {
    if (unlimited || this.cached()?.active) return null
    return Math.max(0, freeLines - this.claimed())
  }

  /**
   * Answers a line on a free line, releasing the claim if Jev doesn't answer, so only answered lines count (PAY-1), or
   * past the free lines only for a user RevenueCat says has `listen` (PAY-7). A line that skips the count goes straight
   * to Jev (PAY-9). The app user ID is used only to ask RevenueCat, and never stored.
   */
  async answer(line: LineRequest, userId: string, terms: Terms): Promise<LineReply> {
    const started = Date.now()
    if (terms.unlimited) {
      const reply = await this.ask(line, budgetMs, terms.dailyCalls)
      return reply.outcome === 'answered' ? { ...reply, freeLinesLeft: null } : reply
    }
    const claim = this.claim(line.lineId, terms)
    if (claim === 'duplicate') return { outcome: 'duplicate' }
    if (claim === 'paid') {
      const entitled = await this.entitled(userId, line.refresh === true)
      if (entitled === 'no') return { outcome: 'paywall' }
      if (entitled === 'unknown') return { outcome: 'unverified' }
    }
    const [reply] = await Promise.all([
      this.ask(line, budgetMs - (Date.now() - started), terms.dailyCalls),
      // A purchase made before the free lines ran out shows once a line with `refresh` asks RevenueCat (PAY-4).
      claim === 'free' && line.refresh === true ? this.entitled(userId, true) : undefined
    ])
    if (reply.outcome !== 'answered') {
      // Only a free line's own claim: a paid copy of the same line ID may be failing while another copy holds one.
      if (claim === 'free') this.ctx.storage.sql.exec('DELETE FROM free_lines WHERE line_id = ?', line.lineId)
      return reply
    }
    return { ...reply, freeLinesLeft: this.freeLinesLeft(terms) }
  }

  /**
   * Asks Jev about one line within `msLeft`, the milliseconds left of the line's 2.5 seconds (STATE-2). Each attempt,
   * the SDK's retry included, first takes one of the day's calls (SEC-5), and a refusal aborts the call, so the SDK
   * doesn't try again: the line is `spent` if no attempt reached Jev, and otherwise ends as its last attempt did. Any
   * failure, an answer out of shape included, is `failed`, except a 402, which is how running out of credits most
   * likely shows (AVAIL-2).
   */
  private async ask(line: JevLine, msLeft: number, dailyCalls: number): Promise<JevReply> {
    const started = Date.now()
    const calls = this.env.BUDGET.getByName('jev-calls', { locationHint: 'wnam' })
    const spent = new AbortController()
    // Whether an attempt reached Jev, and the status Jev failed the last one with, which a refused retry keeps.
    let attempted = false
    let status: number | undefined
    const jev = this.jev(async (input, init) => {
      // The attempt's own time bounds its wait for the budget too, so a slow answer can't hold the line (STATE-2).
      if (!(await unlessAborted(calls.take(dailyCalls), init?.signal))) {
        spent.abort()
        throw new Error("The day's calls to Jev are spent")
      }
      attempted = true
      const response = await fetch(input, init)
      status = response.ok ? undefined : response.status
      return response
    })
    try {
      const result = await jev.systemOne(buildJevRequest(line, this.env.JEV_MODEL), {
        signal: AbortSignal.any([AbortSignal.timeout(msLeft), spent.signal])
      })
      const { kind, topic, scores } = readJevAnswer(result.answers, line)
      return {
        outcome: 'answered',
        kind,
        topic,
        scores: Object.fromEntries(scores),
        model: result.model,
        inputTokens: result.usage.input_tokens,
        ms: Date.now() - started
      }
    } catch (error) {
      const ms = Date.now() - started
      if (spent.signal.aborted) return attempted ? { outcome: 'failed', status, ms } : { outcome: 'spent' }
      if (!(error instanceof APIError)) return { outcome: 'failed', ms }
      return { outcome: error.status === 402 ? 'credits' : 'failed', status: error.status, ms }
    }
  }
}

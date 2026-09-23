import { buildJevRequest, readJevAnswer, type JevLine } from '@turn/shared/jev'
import type { LineAnswer, LineRequest } from '@turn/shared/relay'
import { APIError, TypeSafeClient } from '@typesafe-ai/sdk'
import { DurableObject } from 'cloudflare:workers'

/** How a call to Jev ended: its answer, with the model and tokens it reports, or how it failed, with its status. */
type JevReply =
  | (Pick<LineAnswer, 'kind' | 'topic' | 'scores'> & {
      outcome: 'answered'
      model: string
      inputTokens: number
      ms: number
    })
  | { outcome: 'failed' | 'credits'; status?: number; ms: number }

/**
 * How the user's object ended a line: Jev's reply, with the free lines left once it answered, or why the line got no
 * call. Never an error, whose message could carry text across to the Worker.
 */
export type LineReply =
  | (Extract<JevReply, { outcome: 'answered' }> & Pick<LineAnswer, 'freeLinesLeft'>)
  | Exclude<JevReply, { outcome: 'answered' }>
  | { outcome: 'duplicate' | 'paywall' }

/** What the Worker tells the object from its vars: how many free lines each user gets. */
export type Terms = { freeLines: number }

/** One app user's object, which counts their free lines and calls Jev for their lines. */
export class Device extends DurableObject<Env> {
  /**
   * Two attempts of at most 1.5 seconds each, with no wait for a server's `Retry-After`, and no logs. The key, the
   * address, the model, and the log level are all set here, since the SDK reads any of them the code leaves out from
   * `process.env`, which holds the Worker's vars and secrets.
   */
  private readonly jev = new TypeSafeClient({
    apiKey: this.env.TYPESAFE_API_KEY,
    baseURL: 'https://api.typesafe.ai',
    defaultModel: this.env.JEV_MODEL,
    logLevel: 'off',
    timeout: 1500,
    retry: { maxRetries: 1, respectRetryAfter: false }
  })

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    // The ID of each free line claimed, which is deleted if Jev fails, so only answered lines count (PAY-1).
    ctx.storage.sql.exec('CREATE TABLE IF NOT EXISTS free_lines (line_id TEXT PRIMARY KEY, at INTEGER NOT NULL)')
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

  /** The free lines this user has left, which the configuration and each answer carry (PAY-1). */
  freeLinesLeft({ freeLines }: Terms): number {
    return Math.max(0, freeLines - this.claimed())
  }

  /** Answers a line on a free line, releasing the claim if Jev doesn't answer, so only answered lines count (PAY-1). */
  async answer(line: LineRequest, terms: Terms): Promise<LineReply> {
    const claim = this.claim(line.lineId, terms)
    if (claim === 'duplicate') return { outcome: 'duplicate' }
    if (claim === 'paid') return { outcome: 'paywall' }
    const reply = await this.ask(line)
    if (reply.outcome !== 'answered') {
      this.ctx.storage.sql.exec('DELETE FROM free_lines WHERE line_id = ?', line.lineId)
      return reply
    }
    return { ...reply, freeLinesLeft: this.freeLinesLeft(terms) }
  }

  /**
   * Asks Jev about one line, within 2.5 seconds in all, since a late answer is stale (STATE-2). Any failure, an answer
   * out of shape included, is `failed`, except a 402, which is how running out of credits most likely shows (AVAIL-2).
   */
  private async ask(line: JevLine): Promise<JevReply> {
    const started = Date.now()
    try {
      const result = await this.jev.systemOne(buildJevRequest(line, this.env.JEV_MODEL), {
        signal: AbortSignal.timeout(2500)
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
      if (!(error instanceof APIError)) return { outcome: 'failed', ms }
      return { outcome: error.status === 402 ? 'credits' : 'failed', status: error.status, ms }
    }
  }
}

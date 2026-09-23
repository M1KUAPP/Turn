import { buildJevRequest, readJevAnswer, type JevLine } from '@turn/shared/jev'
import type { LineAnswer } from '@turn/shared/relay'
import { APIError, TypeSafeClient } from '@typesafe-ai/sdk'
import { DurableObject } from 'cloudflare:workers'

/**
 * What the user's object returns for a line: Jev's answer, with the model and tokens it reports, or how the call
 * failed, with Jev's status if it sent one. Never an error, whose message could carry text across to the Worker.
 */
export type JevReply =
  | (Pick<LineAnswer, 'kind' | 'topic' | 'scores'> & {
      outcome: 'answered'
      model: string
      inputTokens: number
      ms: number
    })
  | { outcome: 'failed' | 'credits'; status?: number; ms: number }

/** One app user's object, which calls Jev for their lines. */
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

  /**
   * Asks Jev about one line, within 2.5 seconds in all, since a late answer is stale (STATE-2). Any failure, an answer
   * out of shape included, is `failed`, except a 402, which is how running out of credits most likely shows (AVAIL-2).
   */
  async answer(line: JevLine): Promise<JevReply> {
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

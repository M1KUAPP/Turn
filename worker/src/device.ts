import { buildJevRequest, readJevAnswer, type JevLine } from '@turn/shared/jev'
import type { LineAnswer } from '@turn/shared/relay'
import { TypeSafeClient } from '@typesafe-ai/sdk'
import { DurableObject } from 'cloudflare:workers'

/** What the user's object returns for a line: Jev's answer, with the model and tokens it reports. */
export type JevReply = Pick<LineAnswer, 'kind' | 'topic' | 'scores'> & {
  model: string
  inputTokens: number
  /** Milliseconds spent calling Jev. */
  ms: number
}

/** One app user's object, which calls Jev for their lines. */
export class Device extends DurableObject<Env> {
  /**
   * Every option is set here, since the SDK reads any it lacks from `process.env`, which holds the Worker's vars and
   * secrets: two attempts of at most 1.5 seconds each, with no wait for a server's `Retry-After`, and no logs.
   */
  private readonly jev = new TypeSafeClient({
    apiKey: this.env.TYPESAFE_API_KEY,
    defaultModel: this.env.JEV_MODEL,
    logLevel: 'off',
    timeout: 1500,
    retry: { maxRetries: 1, respectRetryAfter: false }
  })

  /** Asks Jev about one line, within 2.5 seconds in all, since a late answer is stale (STATE-2). */
  async answer(line: JevLine): Promise<JevReply> {
    const started = Date.now()
    const result = await this.jev.systemOne(buildJevRequest(line, this.env.JEV_MODEL), {
      signal: AbortSignal.timeout(2500)
    })
    const { kind, topic, scores } = readJevAnswer(result.answers, line)
    return {
      kind,
      topic,
      scores: Object.fromEntries(scores),
      model: result.model,
      inputTokens: result.usage.input_tokens,
      ms: Date.now() - started
    }
  }
}

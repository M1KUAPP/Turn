import { phoneKind, type Ranker } from './rankers'
import { runModel, type Env } from './workers-ai'

/** Workers AI's cross-encoder, which the report names (EVAL-6). */
export const rerankerModel = '@cf/baai/bge-reranker-base'

/** One score in Workers AI's answer: `id` is the context's index in the request. */
type Scored = { id?: unknown; score?: unknown }

/**
 * Workers AI's cross-encoder as a ranker (EVAL-8): one request for each line, with the line as the query and the
 * shortlist's phrases as the contexts, in the shortlist's order, and each phrase scores what the model gave its index.
 * An answer that doesn't score every index once, from 0 to 1, throws: a raw logit would drop every phrase scored 0 or
 * less from the ranking. It has no question kind of its own, so it takes the phone's
 * yes-or-no rule, and since its score isn't a probability it never brings a big button: its cut-off for holding comes
 * from cross-validation instead.
 */
export function reranker(env: Env = process.env): Ranker {
  const run = runModel(rerankerModel, env)
  return async (line, shortlist) => {
    const { response } = await run({ query: line, contexts: shortlist.map(({ text }) => ({ text })) })
    const scored = Array.isArray(response) ? (response as Scored[]) : []
    const byIndex = new Map(scored.map(({ id, score }) => [id, score]))
    const inRange = (score: unknown) => typeof score === 'number' && score >= 0 && score <= 1
    const scoresEachOnce = scored.length === shortlist.length && shortlist.every((_, i) => inRange(byIndex.get(i)))
    if (!scoresEachOnce) {
      throw new Error(`Workers AI's answer doesn't score each of the ${shortlist.length} phrases once, from 0 to 1`)
    }
    return {
      kind: phoneKind(line),
      topic: {},
      scores: new Map(shortlist.map((phrase, i) => [phrase.id, byIndex.get(i) as number])),
      onPhone: true
    }
  }
}

import { isYesNo } from '@turn/shared/shortlist'
import type { AtCutOff, Ranker } from './rankers'

/** Workers AI's embedding model, which the report names (EVAL-6). */
export const embeddingModel = '@cf/baai/bge-base-en-v1.5'

/** Embeds texts, one vector for each, in the texts' order. */
export type Embed = (texts: readonly string[]) => Promise<number[][]>

/** The most texts the model's schema takes in one request. */
const batchSize = 100

/** What Workers AI's REST API answers, as far as the ranker reads it. */
type Answer = {
  success?: boolean
  errors?: { code: number; message: string }[]
  result?: { shape?: number[]; data?: number[][]; pooling?: string }
}

/**
 * Workers AI's REST API, with the account and a token that may run Workers AI from the environment. Each request
 * holds at most 100 texts and asks for `cls` pooling, since vectors pooled by the default `mean` don't compare with
 * them; an answer that isn't a success, isn't pooled by `cls`, or holds anything but one 768-number vector for each
 * text throws, with Cloudflare's error codes but never the token.
 */
export function workersAi(env: Readonly<Record<string, string | undefined>> = process.env): Embed {
  const { CLOUDFLARE_ACCOUNT_ID: account, CLOUDFLARE_API_TOKEN: token } = env
  if (!account || !token) {
    throw new Error('The embeddings ranker needs CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN in the environment')
  }
  const url = `https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/${embeddingModel}`
  return async (texts) => {
    const vectors: number[][] = []
    for (let start = 0; start < texts.length; start += batchSize) {
      const batch = texts.slice(start, start + batchSize)
      const response = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: batch, pooling: 'cls' })
      })
      // Every field is optional and checked below, and a page that isn't JSON reads as nothing.
      const answer = (await response.json().catch(() => null)) as Answer | null
      if (answer?.success !== true) {
        const codes = answer?.errors?.map(({ code, message }) => `${code} ${message}`).join('; ') || 'no error codes'
        throw new Error(`Workers AI answered ${response.status}: ${codes}`)
      }
      const { shape, data, pooling } = answer.result ?? {}
      const fits = data?.length === batch.length && data.every((vector) => vector.length === 768)
      if (pooling !== 'cls' || shape?.[0] !== batch.length || shape[1] !== 768 || !data || !fits) {
        throw new Error(`Workers AI's answer holds no 768-number cls vector for each of ${batch.length} texts`)
      }
      vectors.push(...data)
    }
    return vectors
  }
}

/** The cosine of the angle between two vectors: their dot product over both lengths. */
export function cosine(a: readonly number[], b: readonly number[]): number {
  let dot = 0
  let aa = 0
  let bb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    aa += a[i] * a[i]
    bb += b[i] * b[i]
  }
  return dot / Math.sqrt(aa * bb)
}

/**
 * Workers AI's embeddings as a ranker: each shortlisted phrase scores its cosine with the line, in the shortlist's
 * order, with no query prefix. The line and any phrase it hasn't seen go in one request, and a phrase's vector is kept
 * for the rest of the run, as a store of the bank's vectors would keep it. It has no question kind of its own, so it
 * takes the phone's yes-or-no rule, and since a cosine isn't a probability it never brings a big button: its cut-off
 * for holding comes from cross-validation instead.
 */
export function embeddings(embed: Embed): Ranker {
  const known = new Map<string, number[]>()
  return async (line, shortlist) => {
    const unseen = shortlist.filter((phrase) => !known.has(phrase.id))
    const [lineVector, ...vectors] = await embed([line, ...unseen.map((phrase) => phrase.text)])
    unseen.forEach((phrase, i) => known.set(phrase.id, vectors[i]))
    const scores = new Map<string, number>()
    for (const phrase of shortlist) {
      const vector = known.get(phrase.id)
      if (vector) scores.set(phrase.id, cosine(lineVector, vector))
    }
    return {
      kind: { yes_no: isYesNo(line) ? 1 : 0, either_or: 0, open: 0, not_a_question: 0 },
      topic: {},
      scores,
      onPhone: true
    }
  }
}

/**
 * The embeddings' ranking at a cut-off: the phrases whose cosine reaches it score 1 and the rest 0, best first, as the
 * keyword ranker scores the phrases that share a word; a stable sort keeps the shortlist's order among ties.
 */
export const atCutOff: AtCutOff = (ranking, cutOff) => ({
  ...ranking,
  scores: new Map([...ranking.scores].sort(([, a], [, b]) => b - a).map(([id, score]) => [id, score >= cutOff ? 1 : 0]))
})

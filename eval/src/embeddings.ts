import { isYesNo } from '@turn/shared/shortlist'
import type { AtCutOff, Ranker } from './rankers'
import { runModel, type Env } from './workers-ai'

/** Workers AI's embedding model, which the report names (EVAL-6). */
export const embeddingModel = '@cf/baai/bge-base-en-v1.5'

/** Embeds texts, one vector for each, in the texts' order. */
export type Embed = (texts: readonly string[]) => Promise<number[][]>

/** The most texts the model's schema takes in one request. */
const batchSize = 100

/** The vectors in a Workers AI answer, as far as the ranker reads them. */
type Vectors = { shape?: number[]; data?: number[][]; pooling?: string }

/** An answer's vectors if they're one of `dimension` numbers for each of `count` texts, as its shape says too. */
const vectorsIn = (count: number, dimension: number, { shape, data }: Vectors): number[][] | null =>
  shape?.[0] === count && shape[1] === dimension && data?.length === count && data.every((v) => v.length === dimension)
    ? data
    : null

/** Embeds texts in batches of at most `size`, one request each, keeping the texts' order. */
const batched =
  (size: number, request: (batch: readonly string[]) => Promise<number[][]>): Embed =>
  async (texts) => {
    const vectors: number[][] = []
    for (let start = 0; start < texts.length; start += size) {
      vectors.push(...(await request(texts.slice(start, start + size))))
    }
    return vectors
  }

/**
 * Workers AI's REST API for `bge-base-en-v1.5`. Each request holds at most 100 texts and asks for `cls` pooling, since
 * vectors pooled by the default `mean` don't compare with them; an answer that isn't pooled by `cls`, or holds
 * anything but one 768-number vector for each text, throws.
 */
export function workersAi(env: Env = process.env): Embed {
  const run = runModel(embeddingModel, env)
  return batched(batchSize, async (batch) => {
    // Every field is optional and checked here.
    const answer = (await run({ text: batch, pooling: 'cls' })) as Vectors
    const vectors = answer.pooling === 'cls' ? vectorsIn(batch.length, 768, answer) : null
    if (!vectors) {
      throw new Error(`Workers AI's answer holds no 768-number cls vector for each of ${batch.length} texts`)
    }
    return vectors
  })
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

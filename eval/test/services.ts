import type { JevRequest } from '@turn/shared/jev'
import { isYesNo } from '@turn/shared/shortlist'
import { vi } from 'vitest'
import type { SentenceEmbedding } from '../src/apple'
import { cosine } from '../src/embeddings'

/** A text's words of three letters or more, lowercased, which the stand-ins below compare. */
const words = (text: string) => new Set(text.toLowerCase().match(/[a-z']{3,}/g) ?? [])

/**
 * A made-up vector of `dimension` numbers for a text: a constant, then each of its words counted in one of the rest by
 * a hash, so every cosine is above 0 and texts that share words come closer.
 */
function madeUpVector(text: string, dimension: number): number[] {
  const vector: number[] = Array(dimension).fill(0)
  vector[0] = 1
  for (const word of words(text)) {
    let hash = 0
    for (const char of word) hash = (hash * 31 + char.charCodeAt(0)) % (dimension - 1)
    vector[1 + hash] += 1
  }
  return vector
}

/** A made-up vector of 768 numbers, as bge's are. */
export const fakeVector = (text: string): number[] => madeUpVector(text, 768)

/** A made-up vector of 1,024 numbers, as qwen3's are. */
export const fakeQwenVector = (text: string): number[] => madeUpVector(text, 1024)

/** Stands in for Apple's sentence embedding and its Swift helper: 512 made-up numbers for each text, at revision 1. */
export const fakeSentenceEmbedding = async (): Promise<SentenceEmbedding> => ({
  embed: async (texts) => texts.map((text) => madeUpVector(text, 512)),
  revision: 1,
  dimension: 512,
  system: '27.0 (Build 26A428)',
  close: async () => {}
})

/**
 * A made-up answer from Jev: yes-or-no at 0.9 when the phone would call the line one, else open at 0.9; the first
 * category as the topic at 0.9; and each candidate 0.9 when it shares a word with the line, else 0.2.
 */
export function fakeJevAnswer({ model, state, questions }: JevRequest) {
  const line = words(state.partner_line)
  const yesNo = isYesNo(state.partner_line)
  const answers = Object.fromEntries(
    Object.entries(questions).map(([key, question]) => {
      if (key === 'kind') {
        const kind = { yes_no: yesNo ? 0.9 : 0.05, either_or: 0.05, open: yesNo ? 0.05 : 0.9, not_a_question: 0 }
        return [key, { type: 'choice', probabilities: kind }]
      }
      if (question.type === 'choice') {
        const options = Object.keys(question.criteria)
        return [key, { type: 'choice', probabilities: Object.fromEntries(options.map((id, i) => [id, i ? 0 : 0.9])) }]
      }
      const shares = [...words(question.instructions.phrase)].some((word) => line.has(word))
      return [key, { type: 'noul', noul: shares ? 0.9 : 0.2 }]
    })
  )
  return { model, answers, usage: { input_tokens: 1000 + Object.keys(questions).length, output_tokens: 20 } }
}

/**
 * A made-up answer from Workers AI's reranker: each context the cosine of its made-up vector with the query's, over
 * 1,000, best first, as small as the live probe's scores and in their order.
 */
export function fakeRerank({ query, contexts }: { query: string; contexts: { text: string }[] }) {
  const line = fakeVector(query)
  const scored = contexts.map(({ text }, id) => ({ id, score: cosine(line, fakeVector(text)) / 1000 }))
  return scored.toSorted((a, b) => b.score - a.score)
}

/** Workers AI's endpoint for a model, as the tests' made-up account reaches it. */
const endpoint = (model: string) => `https://api.cloudflare.com/client/v4/accounts/test-account/ai/run/${model}`

/**
 * Stands in for Workers AI and Jev behind the `fetch` spy that `test/setup.ts` makes: Workers AI embeds each text with
 * `fakeVector`, pooled as asked, or in 1,024 numbers for qwen3, and reranks with `fakeRerank`, and Jev answers with
 * `fakeJevAnswer`, as the model `modelFor` names for the call, if it names one. Returns the spy, whose calls a test can
 * read.
 */
export function fakeServices(modelFor: (call: number) => string | undefined = () => undefined) {
  let jevCalls = 0
  const spy = vi.mocked(globalThis.fetch)
  spy.mockImplementation(async (input, init) => {
    const url = String(input)
    const body = JSON.parse(String(init?.body))
    const success = (result: object) => Response.json({ success: true, errors: [], messages: [], result })
    if (url === endpoint('@cf/baai/bge-base-en-v1.5')) {
      return success({ shape: [body.text.length, 768], data: body.text.map(fakeVector), pooling: body.pooling })
    }
    if (url === endpoint('@cf/baai/bge-reranker-base')) return success({ response: fakeRerank(body) })
    if (url === endpoint('@cf/qwen/qwen3-embedding-0.6b')) {
      const texts: string[] = body.queries ?? body.documents
      return success({ shape: [texts.length, 1024], data: texts.map(fakeQwenVector) })
    }
    if (url === 'https://api.typesafe.ai/v1/systemone') {
      const answer = fakeJevAnswer(body)
      return Response.json({ ...answer, model: modelFor(jevCalls++) ?? answer.model })
    }
    throw new Error(`No stand-in for ${url}`)
  })
  return spy
}

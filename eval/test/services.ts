import type { JevRequest } from '@turn/shared/jev'
import { isYesNo } from '@turn/shared/shortlist'
import { vi } from 'vitest'

/** A text's words of three letters or more, lowercased, which the stand-ins below compare. */
const words = (text: string) => new Set(text.toLowerCase().match(/[a-z']{3,}/g) ?? [])

/**
 * A made-up vector for a text: a constant, then each of its words counted in one of 767 buckets by a hash, so every
 * cosine is above 0 and texts that share words come closer.
 */
export function fakeVector(text: string): number[] {
  const vector: number[] = Array(768).fill(0)
  vector[0] = 1
  for (const word of words(text)) {
    let hash = 0
    for (const char of word) hash = (hash * 31 + char.charCodeAt(0)) % 767
    vector[1 + hash] += 1
  }
  return vector
}

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
 * Stands in for Workers AI and Jev behind the `fetch` spy that `test/setup.ts` makes: Workers AI embeds each text with
 * `fakeVector`, pooled as asked, and Jev answers with `fakeJevAnswer`, as the model `modelFor` names for the call, if
 * it names one. Returns the spy, whose calls a test can read.
 */
export function fakeServices(modelFor: (call: number) => string | undefined = () => undefined) {
  let jevCalls = 0
  const spy = vi.mocked(globalThis.fetch)
  spy.mockImplementation(async (input, init) => {
    const url = String(input)
    const body = JSON.parse(String(init?.body))
    if (url.startsWith('https://api.cloudflare.com/client/v4/accounts/test-account/ai/run/')) {
      const result = { shape: [body.text.length, 768], data: body.text.map(fakeVector), pooling: body.pooling }
      return Response.json({ success: true, errors: [], messages: [], result })
    }
    if (url === 'https://api.typesafe.ai/v1/systemone') {
      const answer = fakeJevAnswer(body)
      return Response.json({ ...answer, model: modelFor(jevCalls++) ?? answer.model })
    }
    throw new Error(`No stand-in for ${url}`)
  })
  return spy
}

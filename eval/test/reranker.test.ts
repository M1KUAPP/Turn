import { applyAnswer, emptyRow, startingPolicy } from '@turn/shared/row'
import { PhraseIndex, rankable } from '@turn/shared/shortlist'
import { expect, test, vi } from 'vitest'
import { reranker } from '../src/reranker'
import { fakeServices } from './services'
import { smallBank } from './small-bank'

const home = { bank: smallBank, row: [], place: 'home', taps: new Map<string, number>() }
const shortlist = smallBank.filter(rankable)
const answer = (response: unknown) => async () =>
  Response.json({ success: true, errors: [], messages: [], result: { response } })

test("asks Workers AI's reranker with the line as the query and the shortlist's phrases as contexts", async () => {
  const services = fakeServices()
  await reranker()('Do you want some water?', shortlist, new PhraseIndex(), home)
  const [url, init] = services.mock.calls[0]
  expect(String(url)).toBe(
    'https://api.cloudflare.com/client/v4/accounts/test-account/ai/run/@cf/baai/bge-reranker-base'
  )
  expect(JSON.parse(String(init?.body))).toEqual({
    query: 'Do you want some water?',
    contexts: shortlist.map(({ text }) => ({ text }))
  })
})

test("scores each phrase what the model gave its index, in the shortlist's order, whatever the answer's", async () => {
  // Best first, as Workers AI answered in the live probe, down to a score of 0, the least a sigmoid gives.
  const response = shortlist.map((_, id) => ({ id, score: id / 100 })).toReversed()
  vi.mocked(fetch).mockImplementationOnce(answer(response))
  const ranking = await reranker()('Do you want some water?', shortlist, new PhraseIndex(), home)
  expect([...ranking.scores]).toEqual(shortlist.map(({ id }, i) => [id, i / 100]))
})

test("refuses an answer that doesn't score each phrase once, from 0 to 1", async () => {
  const each = shortlist.map((_, id) => ({ id, score: 0.5 }))
  const wrong = [
    each.slice(1),
    [...each.slice(1), { id: 1, score: 0.5 }],
    [...each, { id: 0, score: 0.9 }],
    [...each.slice(1), { id: shortlist.length, score: 0.5 }],
    [...each.slice(1), { id: '0', score: 0.5 }],
    [...each.slice(1), { id: 0, score: '0.5' }],
    [...each.slice(1), { id: 0 }],
    // A raw logit, which would drop every phrase scored 0 or less from the ranking.
    [...each.slice(1), { id: 0, score: -2.3 }],
    [...each.slice(1), { id: 0, score: 1.5 }],
    null
  ]
  for (const response of wrong) {
    vi.mocked(fetch).mockImplementationOnce(answer(response))
    await expect(reranker()('Hello', shortlist, new PhraseIndex(), home)).rejects.toThrow(
      `Workers AI's answer doesn't score each of the ${shortlist.length} phrases once, from 0 to 1`
    )
  }
})

test("takes the phone's kind and never brings a big button, even at a score of 1", async () => {
  vi.mocked(fetch).mockImplementation(answer(shortlist.map((_, id) => ({ id, score: id === 2 ? 1 : 0.01 }))))
  const yesNo = await reranker()('Do you want some water?', shortlist, new PhraseIndex(), home)
  expect(yesNo.kind).toEqual({ yes_no: 1, either_or: 0, open: 0, not_a_question: 0 })
  const ranking = await reranker()('How was your day?', shortlist, new PhraseIndex(), home)
  expect(ranking.kind).toEqual({ yes_no: 0, either_or: 0, open: 0, not_a_question: 0 })
  expect(ranking.topic).toEqual({})
  const row = applyAnswer(emptyRow, { ...ranking, seq: 1, policy: startingPolicy })
  expect(row.big).toBeNull()
  expect(row.slots[0]).toBe(shortlist[2].id)
})

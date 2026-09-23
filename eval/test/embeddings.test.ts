import { applyAnswer, emptyRow, startingPolicy } from '@turn/shared/row'
import { PhraseIndex, rankable } from '@turn/shared/shortlist'
import { expect, test, vi } from 'vitest'
import { cosine, embeddings, qwen, workersAi, type Embed } from '../src/embeddings'
import { fakeQwenVector, fakeServices, fakeVector } from './services'
import { smallBank } from './small-bank'

const home = { bank: smallBank, row: [], place: 'home', taps: new Map<string, number>() }
const shortlist = smallBank.filter(rankable)

test('asks Workers AI for cls vectors with the account and token from the environment, 100 texts at most', async () => {
  const services = fakeServices()
  const texts = Array.from({ length: 250 }, (_, i) => `Phrase number ${i}`)
  expect(await workersAi()(texts)).toEqual(texts.map(fakeVector))
  expect(services.mock.calls.map(([, init]) => JSON.parse(String(init?.body)).text.length)).toEqual([100, 100, 50])
  for (const [url, init] of services.mock.calls) {
    expect(String(url)).toBe(
      'https://api.cloudflare.com/client/v4/accounts/test-account/ai/run/@cf/baai/bge-base-en-v1.5'
    )
    expect(init?.method).toBe('POST')
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer test-cloudflare-token')
    expect(JSON.parse(String(init?.body)).pooling).toBe('cls')
  }
})

test('needs both the account and the token', () => {
  const needs = 'Workers AI needs CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN in the environment'
  expect(() => workersAi({ CLOUDFLARE_API_TOKEN: 'token' })).toThrow(needs)
  expect(() => workersAi({ CLOUDFLARE_ACCOUNT_ID: 'account' })).toThrow(needs)
})

test("throws Workers AI's error codes, never the token, and says so when an answer isn't JSON", async () => {
  vi.mocked(fetch).mockResolvedValueOnce(
    Response.json({ success: false, errors: [{ code: 10000, message: 'Authentication error' }] }, { status: 401 })
  )
  const error: Error = await workersAi()(['Hello']).catch((thrown) => thrown)
  expect(error.message).toBe('Workers AI answered 401: 10000 Authentication error')
  expect(error.message).not.toContain('test-cloudflare-token')
  // Such as the page Cloudflare's edge sends for its error 1010.
  vi.mocked(fetch).mockResolvedValueOnce(new Response('error code: 1010', { status: 403 }))
  await expect(workersAi()(['Hello'])).rejects.toThrow('Workers AI answered 403: no error codes')
})

test('refuses an answer pooled by mean, or short of one 768-number vector for each text', async () => {
  const answer = (result: object) => async () => Response.json({ success: true, errors: [], messages: [], result })
  vi.mocked(fetch)
    .mockImplementationOnce(answer({ shape: [1, 768], data: [fakeVector('Hi')], pooling: 'mean' }))
    .mockImplementationOnce(answer({ shape: [2, 768], data: [fakeVector('Hi')], pooling: 'cls' }))
    .mockImplementationOnce(answer({ shape: [1, 768], data: [[0.1, 0.2]], pooling: 'cls' }))
    .mockImplementationOnce(answer({ shape: [1, 768], data: [], pooling: 'cls' }))
    .mockImplementationOnce(answer({ shape: [1, 512], data: [fakeVector('Hi')], pooling: 'cls' }))
  for (let i = 0; i < 5; i++) {
    await expect(workersAi()(['Hi'])).rejects.toThrow("Workers AI's answer holds no 768-number cls vector")
  }
})

test('gives the cosine of the angle between two vectors, whatever their lengths', () => {
  expect(cosine([1, 0], [0, 1])).toBe(0)
  expect(cosine([1, 2], [2, 4])).toBeCloseTo(1, 12)
  expect(cosine([1, 0], [-3, 0])).toBe(-1)
  expect(cosine([3, 4], [4, 3])).toBeCloseTo(24 / 25, 12)
})

test("scores each phrase's cosine with the line in the shortlist's order, and takes the phone's kind", async () => {
  const embed = vi.fn<Embed>(async (texts) => texts.map(fakeVector))
  const rank = embeddings(embed)
  const ranking = await rank('Do you want some water?', shortlist, new PhraseIndex(), home)
  expect([...ranking.scores.keys()]).toEqual(shortlist.map((phrase) => phrase.id))
  const water = cosine(fakeVector('Do you want some water?'), fakeVector('Water, please'))
  expect(ranking.scores.get('water-please')).toBeCloseTo(water, 12)
  expect(ranking).toMatchObject({ kind: { yes_no: 1, either_or: 0, open: 0, not_a_question: 0 }, onPhone: true })
  expect(ranking.topic).toEqual({})
  expect((await rank('Nice weather today.', shortlist, new PhraseIndex(), home)).kind.yes_no).toBe(0)
  // The first line went with every phrase in one request, and the next with only itself.
  expect(embed.mock.calls.map(([texts]) => texts)).toEqual([
    ['Do you want some water?', ...shortlist.map((phrase) => phrase.text)],
    ['Nice weather today.']
  ])
})

test("asks qwen3 for lines as queries under the TRD's instruction, and phrases as documents under none", async () => {
  const services = fakeServices()
  const { queries, documents } = qwen()
  const texts = Array.from({ length: 40 }, (_, i) => `Phrase number ${i}`)
  expect(await queries(['Do you want some water?'])).toEqual([fakeQwenVector('Do you want some water?')])
  expect(await documents(texts)).toEqual(texts.map(fakeQwenVector))
  const bodies = services.mock.calls.map(([, init]) => JSON.parse(String(init?.body)))
  expect(bodies).toEqual([
    {
      queries: ['Do you want some water?'],
      instruction: 'Given what a conversation partner just said, retrieve the reply that answers it'
    },
    { documents: texts.slice(0, 32) },
    { documents: texts.slice(32) }
  ])
  for (const [url] of services.mock.calls) {
    expect(String(url)).toBe(
      'https://api.cloudflare.com/client/v4/accounts/test-account/ai/run/@cf/qwen/qwen3-embedding-0.6b'
    )
  }
})

test('refuses a qwen3 answer short of one 1,024-number vector for each text', async () => {
  const answer = (result: object) => async () => Response.json({ success: true, errors: [], messages: [], result })
  vi.mocked(fetch)
    .mockImplementationOnce(answer({ shape: [1, 768], data: [fakeVector('Hi')] }))
    .mockImplementationOnce(answer({ shape: [2, 1024], data: [fakeQwenVector('Hi')] }))
    .mockImplementationOnce(answer({ shape: [1, 1024], data: [fakeVector('Hi')] }))
  for (let i = 0; i < 3; i++) {
    await expect(qwen().documents(['Hi'])).rejects.toThrow("Workers AI's answer holds no 1024-number vector")
  }
})

test('embeds the line alone and its unseen phrases apart when the model takes the line as a query', async () => {
  const query = vi.fn<Embed>(async (texts) => texts.map((text) => fakeVector(`query ${text}`)))
  const embed = vi.fn<Embed>(async (texts) => texts.map((text) => fakeVector(text)))
  const rank = embeddings(embed, query)
  const ranking = await rank('Do you want some water?', shortlist, new PhraseIndex(), home)
  const water = cosine(fakeVector('query Do you want some water?'), fakeVector('Water, please'))
  expect(water).not.toBeCloseTo(cosine(fakeVector('Do you want some water?'), fakeVector('Water, please')), 12)
  expect(ranking.scores.get('water-please')).toBeCloseTo(water, 12)
  await rank('Nice weather today.', shortlist, new PhraseIndex(), home)
  expect(query.mock.calls.map(([texts]) => texts)).toEqual([['Do you want some water?'], ['Nice weather today.']])
  expect(embed.mock.calls.map(([texts]) => texts)).toEqual([shortlist.map((phrase) => phrase.text)])
})

test("never brings a big button, even at a cosine of 1, since a cosine isn't a probability", async () => {
  const rank = embeddings(async (texts) => texts.map(fakeVector))
  const ranking = await rank('Water, please', shortlist, new PhraseIndex(), home)
  expect(ranking.scores.get('water-please')).toBeCloseTo(1, 12)
  const row = applyAnswer(emptyRow, { ...ranking, seq: 1, policy: startingPolicy })
  expect(row.big).toBeNull()
  expect(row.slots[0]).toBe('water-please')
})

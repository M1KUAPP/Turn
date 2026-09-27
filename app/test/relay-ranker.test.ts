import { describe, expect, test, vi } from 'vitest'
import type { LineAnswer, LineRequest } from '@turn/shared/relay'
import { startingPolicy } from '@turn/shared/row'
import type { Phrase } from '@turn/shared/shortlist'
import { createRelayRanker } from '../src/listen/relay-ranker'

const answer = (line: LineRequest): LineAnswer => ({
  seq: line.seq,
  kind: { yes_no: 0, either_or: 0, open: 1, not_a_question: 0 },
  topic: { food: 1 },
  scores: Object.fromEntries(line.candidates.map(({ id }) => [id, 0.9])),
  policy: startingPolicy,
  freeLinesLeft: 19,
  ms: { jev: 50, total: 100 }
})

const phrases: Phrase[] = Array.from({ length: 40 }, (_, i) => ({
  id: `phrase-${i}`,
  text: i === 0 ? 'Alice wants lunch' : `Lunch reply ${i}`,
  places: [],
  fixed: false
}))

function harness(
  onFindNames?: () => void,
  fullBank = phrases,
  options: {
    purchases?: { refreshNext: () => boolean; refreshAnswered: () => void }
    request?: (url: string, init: RequestInit) => Promise<Response>
  } = {}
) {
  let allowed = true
  let jevOn = true
  let status = 'unreachable'
  const freeLines = vi.fn()
  const posts: LineRequest[] = []
  const rank = createRelayRanker({
    bank: {
      categories: async () => [{ id: 'food', name: 'Food', fixed: 0, position: 0 }],
      places: async () => [{ id: 'clinic', name: 'Clinic', position: 0 }],
      rankingData: async () => ({ bank: fullBank, taps: new Map<string, number>() })
    },
    config: {
      snapshot: () => ({ jevOn, typesafeNamed: false, freeLinesLeft: 20, policy: startingPolicy }),
      status: () => status as 'working' | 'unreachable' | 'off',
      lineResult: (next) => {
        status = next
      },
      freeLines,
      headers: () => ({ 'X-Turn-User': 'user', 'X-Turn-Version': '1', 'X-Turn-Build': 'device' })
    },
    purchases: options.purchases,
    allowed: () => allowed,
    findNames: async (texts) => {
      onFindNames?.()
      return texts.map((text) => {
        const start = text.indexOf('Alice')
        return start < 0 ? [] : [{ kind: 'person' as const, start, end: start + 5 }]
      })
    },
    relayUrl: 'https://relay.example',
    createId: () => '5f0e7a8e-3c2b-4d1a-9b6e-2f4c8d0a1b3c',
    request: async (url, init) => {
      const line = JSON.parse(String(init.body)) as LineRequest
      posts.push(line)
      if (options.request) return options.request(url, init)
      return new Response(JSON.stringify(answer(line)), { status: 200 })
    }
  })
  return {
    rank,
    posts,
    freeLines,
    status: () => status,
    setAllowed: (value: boolean) => (allowed = value),
    setJevOn: (value: boolean, confirmed = true) => {
      jevOn = value
      if (!value && confirmed) status = 'off'
    }
  }
}

describe('relay ranking preparation', () => {
  test('tags names across fields and sends the 40 candidates in order', async () => {
    const { rank, posts, status } = harness()
    const result = await rank({
      line: 'Alice wants lunch',
      place: 'clinic',
      shortlist: phrases,
      seq: 7,
      signal: new AbortController().signal
    })
    expect(result.seq).toBe(7)
    expect(posts).toHaveLength(1)
    expect(posts[0]).toMatchObject({
      lineId: '5f0e7a8e-3c2b-4d1a-9b6e-2f4c8d0a1b3c',
      seq: 7,
      line: '[PERSON 1] wants lunch',
      place: 'Clinic',
      categories: [{ id: 'food', name: 'Food' }]
    })
    expect(posts[0].candidates).toHaveLength(40)
    expect(posts[0].candidates[0]).toEqual({ id: 'phrase-0', text: '[PERSON 1] wants lunch' })
    expect(posts[0].candidates.map(({ id }) => id)).toEqual(phrases.map(({ id }) => id))
    expect(status()).toBe('working')
  })

  test('does not POST after permission changes during name tagging', async () => {
    let block = () => {}
    const { rank, posts, setAllowed } = harness(() => block())
    block = () => setAllowed(false)
    const blocker = new AbortController()
    await expect(
      rank({ line: 'Alice', place: 'clinic', shortlist: phrases, seq: 1, signal: blocker.signal })
    ).rejects.toThrow()
    expect(posts).toHaveLength(0)
  })

  test('does not POST when Jev is off', async () => {
    const { rank, posts, status, setJevOn } = harness()
    setJevOn(false)
    await expect(
      rank({ line: 'Lunch', place: 'clinic', shortlist: phrases, seq: 1, signal: new AbortController().signal })
    ).rejects.toMatchObject({ code: 'jev_off' })
    expect(posts).toHaveLength(0)
    expect(status()).toBe('off')
  })

  test('an unavailable config leaves Jev state unknown, so a line may still try the relay', async () => {
    const { rank, posts, setJevOn } = harness()
    setJevOn(false, false)
    await rank({ line: 'Lunch', place: 'clinic', shortlist: phrases, seq: 1, signal: new AbortController().signal })
    expect(posts).toHaveLength(1)
  })

  test('replaces a phrase that becomes too long after tagging with a rankable spare', async () => {
    const long = { ...phrases[0], text: `Alice${'x'.repeat(193)}` }
    const shortlist = [long, ...phrases.slice(1)]
    const spare: Phrase = { id: 'spare', text: 'Another lunch reply', places: [] }
    const fixed: Phrase = { id: 'yes', text: 'Yes', places: [], fixed: true }
    const { rank, posts } = harness(undefined, [...shortlist, fixed, spare])
    const result = await rank({
      line: 'Alice wants lunch',
      place: 'clinic',
      shortlist,
      seq: 1,
      signal: new AbortController().signal
    })
    expect(posts[0].candidates).toHaveLength(40)
    expect(posts[0].candidates[0].id).toBe('spare')
    expect(posts[0].candidates.some(({ id }) => id === 'yes')).toBe(false)
    expect(result.candidateOrder[0]).toBe('spare')
  })

  test('request carries refresh: true when purchases port says true, and omits refresh key otherwise', async () => {
    const purchasesTrue = { refreshNext: vi.fn(() => true), refreshAnswered: vi.fn() }
    const withTrue = harness(undefined, phrases, { purchases: purchasesTrue })
    await withTrue.rank({
      line: 'Alice wants lunch',
      place: 'clinic',
      shortlist: phrases,
      seq: 1,
      signal: new AbortController().signal
    })
    expect(withTrue.posts[0]).toHaveProperty('refresh', true)

    const withoutPort = harness()
    await withoutPort.rank({
      line: 'Alice wants lunch',
      place: 'clinic',
      shortlist: phrases,
      seq: 2,
      signal: new AbortController().signal
    })
    expect(withoutPort.posts[0]).not.toHaveProperty('refresh')

    const purchasesFalse = { refreshNext: vi.fn(() => false), refreshAnswered: vi.fn() }
    const withFalse = harness(undefined, phrases, { purchases: purchasesFalse })
    await withFalse.rank({
      line: 'Alice wants lunch',
      place: 'clinic',
      shortlist: phrases,
      seq: 3,
      signal: new AbortController().signal
    })
    expect(withFalse.posts[0]).not.toHaveProperty('refresh')
  })

  test('an answered line calls refreshAnswered once when it carried refresh and never otherwise', async () => {
    const refreshAnsweredTrue = vi.fn()
    const withRefresh = harness(undefined, phrases, {
      purchases: { refreshNext: () => true, refreshAnswered: refreshAnsweredTrue }
    })
    await withRefresh.rank({
      line: 'Alice wants lunch',
      place: 'clinic',
      shortlist: phrases,
      seq: 1,
      signal: new AbortController().signal
    })
    expect(refreshAnsweredTrue).toHaveBeenCalledOnce()

    const refreshAnsweredFalse = vi.fn()
    const withoutRefresh = harness(undefined, phrases, {
      purchases: { refreshNext: () => false, refreshAnswered: refreshAnsweredFalse }
    })
    await withoutRefresh.rank({
      line: 'Alice wants lunch',
      place: 'clinic',
      shortlist: phrases,
      seq: 2,
      signal: new AbortController().signal
    })
    expect(refreshAnsweredFalse).not.toHaveBeenCalled()
  })

  test("an answer's freeLinesLeft of 7 and of null reach freeLines", async () => {
    const withSeven = harness(undefined, phrases, {
      request: async (_url, init) => {
        const line = JSON.parse(String(init.body)) as LineRequest
        return new Response(JSON.stringify({ ...answer(line), freeLinesLeft: 7 }), { status: 200 })
      }
    })
    await withSeven.rank({
      line: 'Alice wants lunch',
      place: 'clinic',
      shortlist: phrases,
      seq: 1,
      signal: new AbortController().signal
    })
    expect(withSeven.freeLines).toHaveBeenCalledWith(7)

    const withNull = harness(undefined, phrases, {
      request: async (_url, init) => {
        const line = JSON.parse(String(init.body)) as LineRequest
        return new Response(JSON.stringify({ ...answer(line), freeLinesLeft: null }), { status: 200 })
      }
    })
    await withNull.rank({
      line: 'Alice wants lunch',
      place: 'clinic',
      shortlist: phrases,
      seq: 2,
      signal: new AbortController().signal
    })
    expect(withNull.freeLines).toHaveBeenCalledWith(null)
  })

  test('a 402 paywall error rethrows with code paywall, reports working, and calls freeLines(0)', async () => {
    const { rank, freeLines, status } = harness(undefined, phrases, {
      request: async () =>
        new Response(JSON.stringify({ error: 'paywall' }), {
          status: 402,
          headers: { 'Content-Type': 'application/json' }
        })
    })

    await expect(
      rank({
        line: 'Alice wants lunch',
        place: 'clinic',
        shortlist: phrases,
        seq: 1,
        signal: new AbortController().signal
      })
    ).rejects.toMatchObject({ code: 'paywall', status: 402 })

    expect(status()).toBe('working')
    expect(freeLines).toHaveBeenCalledWith(0)
  })

  test('a failed line that carried refresh does not call refreshAnswered', async () => {
    const refreshAnswered = vi.fn()
    const { rank } = harness(undefined, phrases, {
      purchases: { refreshNext: () => true, refreshAnswered },
      request: async () =>
        new Response(JSON.stringify({ error: 'paywall' }), {
          status: 402,
          headers: { 'Content-Type': 'application/json' }
        })
    })

    await expect(
      rank({
        line: 'Alice wants lunch',
        place: 'clinic',
        shortlist: phrases,
        seq: 1,
        signal: new AbortController().signal
      })
    ).rejects.toThrow()

    expect(refreshAnswered).not.toHaveBeenCalled()
  })
})

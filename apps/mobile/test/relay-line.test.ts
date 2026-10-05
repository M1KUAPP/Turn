import { afterEach, expect, test, vi } from 'vitest'
import { postLine } from '../src/relay/line'

afterEach(() => vi.useRealTimers())

const options = {
  relayUrl: 'https://relay.example',
  userId: '5f0e7a8e-3c2b-4d1a-9b6e-2f4c8d0a1b3c',
  version: '0.1.0',
  buildKind: 'device' as const
}

const line = {
  lineId: '8ea25eb0-1234-4abc-8def-123456789abc',
  seq: 7,
  line: 'What would you like for lunch?',
  place: 'Home',
  categories: [{ id: 'food', name: 'Food' }],
  candidates: [{ id: 'lunch', text: 'Soup, please' }]
}

test('sends one line to the relay with the app identity and returns its scores', async () => {
  const request = vi.fn(async () =>
    Response.json({
      seq: 7,
      kind: { yes_no: 0.9, either_or: 0.02, open: 0.05, not_a_question: 0.03 },
      topic: { food: 0.8, consent: 0.2 },
      scores: { lunch: 0.91 },
      policy: {
        floor: 0.6,
        bigAbove: 0.85,
        margin: 0.15,
        yesNoPhrases: true,
        noBigTopics: ['body-pain', 'consent'],
        fixedOnlyTopics: []
      },
      freeLinesLeft: 19,
      ms: { jev: 160, total: 290 }
    })
  )
  const answer = await postLine(
    {
      ...options,
      relayUrl: 'https://relay.example/',
      request
    },
    line
  )

  expect(answer.seq).toBe(7)
  expect(answer.scores).toEqual({ lunch: 0.91 })
  expect(request).toHaveBeenCalledExactlyOnceWith(
    'https://relay.example/v1/lines',
    expect.objectContaining({
      method: 'POST',
      headers: {
        'X-Turn-User': '5f0e7a8e-3c2b-4d1a-9b6e-2f4c8d0a1b3c',
        'X-Turn-Version': '0.1.0',
        'X-Turn-Build': 'device',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(line)
    })
  )
})

test('aborts a stalled line after three seconds without retrying', async () => {
  vi.useFakeTimers()
  const request = vi.fn(
    (_url: string, init: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init.signal?.addEventListener('abort', () => reject(new Error('aborted')))
      })
  )

  const result = postLine({ ...options, request }, line)
  const failed = expect(result).rejects.toThrow('aborted')
  await vi.advanceTimersByTimeAsync(3_000)
  await failed
  expect(request).toHaveBeenCalledTimes(1)
})

test('aborts the old line when the caller starts another', async () => {
  vi.useFakeTimers()
  const oldLine = new AbortController()
  const request = vi.fn(
    (_url: string, init: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init.signal?.addEventListener('abort', () => reject(new Error('aborted')))
      })
  )

  const result = postLine({ ...options, request }, line, oldLine.signal)
  const failed = expect(result).rejects.toThrow('aborted')
  await vi.advanceTimersByTimeAsync(1_000)
  oldLine.abort()
  await failed
  expect(request).toHaveBeenCalledTimes(1)
})

test('reports a relay error code so the session can fall back on the phone', async () => {
  const request = vi.fn(async () => Response.json({ error: 'jev_off' }, { status: 503 }))

  await expect(postLine({ ...options, request }, line)).rejects.toMatchObject({ status: 503, code: 'jev_off' })
  expect(request).toHaveBeenCalledTimes(1)
})

test('rejects an answer for another line or with invalid scores', async () => {
  const answer = {
    seq: 7,
    kind: { yes_no: 0.9, either_or: 0.02, open: 0.05, not_a_question: 0.03 },
    topic: { food: 0.8, consent: 0.2 },
    scores: { lunch: 0.91 },
    policy: {
      floor: 0.6,
      bigAbove: 0.85,
      margin: 0.15,
      yesNoPhrases: true,
      noBigTopics: ['body-pain', 'consent'],
      fixedOnlyTopics: []
    },
    freeLinesLeft: 19,
    ms: { jev: 160, total: 290 }
  }
  const wrongLine = vi.fn(async () => Response.json({ ...answer, seq: 6 }))
  const badScore = vi.fn(async () => Response.json({ ...answer, scores: { lunch: 'high' } }))

  await expect(postLine({ ...options, request: wrongLine }, line)).rejects.toThrow('Invalid relay answer')
  await expect(postLine({ ...options, request: badScore }, line)).rejects.toThrow('Invalid relay answer')
})

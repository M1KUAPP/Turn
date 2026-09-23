import { startingPolicy } from '@turn/shared/row'
import { env } from 'cloudflare:workers'
import { describe, expect, test, vi } from 'vitest'
import {
  expectError,
  headers,
  jevAnswer,
  jevError,
  lineRequest,
  mockJev,
  postLine,
  send,
  sha256,
  user
} from './helpers'

describe('POST /v1/lines', () => {
  test("answers with Jev's scores by candidate id, the kind, the topic, the policy, and the free lines", async () => {
    const jev = mockJev(() => Response.json(jevAnswer([0.9, 0.4, 0.7])))
    const response = await postLine(lineRequest())
    expect(response.status).toBe(200)
    const answer = await response.json()
    expect(answer).toEqual({
      seq: 7,
      kind: { yes_no: 0.1, either_or: 0.1, open: 0.7, not_a_question: 0.1 },
      topic: { feelings: 0.8, 'body-pain': 0.15, consent: 0.05 },
      scores: { hard: 0.9, well: 0.4, tired: 0.7 },
      policy: startingPolicy,
      freeLinesLeft: 20,
      ms: { jev: expect.any(Number), total: expect.any(Number) }
    })
    expect(jev).toHaveBeenCalledOnce()
  })

  test("reaches the user's object by the salted hash of their ID, in western North America", async () => {
    mockJev(() => Response.json(jevAnswer()))
    const getByName = vi.fn((name: string, options?: DurableObjectNamespaceGetDurableObjectOptions) =>
      env.DEVICE.getByName(name, options)
    )
    await postLine(lineRequest(), { DEVICE: { getByName } })
    expect(getByName).toHaveBeenCalledExactlyOnceWith(`user-${await sha256(`test-salt${user}`)}`, {
      locationHint: 'wnam'
    })
  })

  test('follows a changed policy in the next answer, with no app build (ROW-8)', async () => {
    mockJev(() => Response.json(jevAnswer()))
    const response = await postLine(lineRequest(), { POLICY: { floor: 0.7, fixedOnlyTopics: ['consent'] } })
    expect(await response.json()).toMatchObject({
      policy: { ...startingPolicy, floor: 0.7, fixedOnlyTopics: ['consent'] }
    })
  })

  test('answers 503 jev_off with no call to Jev while the switch is off (STATE-3)', async () => {
    const jev = mockJev()
    await expectError(await postLine(lineRequest(), { JEV_ON: 'false' }), 503, 'jev_off')
    expect(jev).not.toHaveBeenCalled()
  })

  test.each(['', undefined])('answers 500 internal with no call to Jev when JEV_MODEL is %j (SEC-2)', async (model) => {
    const jev = mockJev()
    await expectError(await postLine(lineRequest(), { JEV_MODEL: model }), 500, 'internal')
    expect(jev).not.toHaveBeenCalled()
  })

  test.each([
    ['JSON that does not parse', '{"seq": 7,'],
    ['a list', '[]'],
    ['a line id that is no UUID', lineRequest({ lineId: 'line-1' })],
    ['a negative sequence number', lineRequest({ seq: -1 })],
    ['a fractional sequence number', lineRequest({ seq: 1.5 })],
    ['a line that is no text', { ...lineRequest(), line: 42 }],
    ['no place', { ...lineRequest(), place: undefined }],
    ['a category with no name', lineRequest({ categories: [{ id: 'food' }] as never })],
    ['a candidate whose id is a number', lineRequest({ candidates: [{ id: 1, text: 'Yes' }] as never })],
    ['a refresh that is text', { ...lineRequest(), refresh: 'true' }]
  ])('refuses %s with 400 invalid_request and no call to Jev', async (_, body) => {
    const jev = mockJev()
    await expectError(await postLine(body), 400, 'invalid_request')
    expect(jev).not.toHaveBeenCalled()
  })
})

describe("a line's limits (SEC-2)", () => {
  /** A request's body with a field of 17,000 characters, which the relay would otherwise ignore. */
  const oversized = JSON.stringify({ ...lineRequest(), padding: 'x'.repeat(17_000) })
  const post = (body: string, sent: Record<string, string>) =>
    send(new Request('https://relay.test/v1/lines', { method: 'POST', headers: { ...headers, ...sent }, body }))
  const categories = (count: number) =>
    Array.from({ length: count }, (_, i) => ({ id: `c${i}`, name: `Category ${i}` }))
  const candidates = (count: number) => Array.from({ length: count }, (_, i) => ({ id: `p${i}`, text: `Phrase ${i}` }))

  test.each([
    ['a line of 301 characters', lineRequest({ line: 'a'.repeat(301) })],
    ['an empty line', lineRequest({ line: '' })],
    ["a place's name of 41 characters", lineRequest({ place: 'a'.repeat(41) })],
    ['13 categories', lineRequest({ categories: categories(13) })],
    ["a category's name of 41 characters", lineRequest({ categories: [{ id: 'food', name: 'a'.repeat(41) }] })],
    ['a category with an empty name', lineRequest({ categories: [{ id: 'food', name: '' }] })],
    ['41 candidates', lineRequest({ candidates: candidates(41) })],
    ["a candidate's text of 201 characters", lineRequest({ candidates: [{ id: 'long', text: 'a'.repeat(201) }] })],
    ['a candidate with an empty text', lineRequest({ candidates: [{ id: 'empty', text: '' }] })],
    ['an id of 65 characters', lineRequest({ categories: [{ id: 'a'.repeat(65), name: 'Food' }] })],
    ['an empty id', lineRequest({ candidates: [{ id: '', text: 'Yes' }] })],
    ['a category id twice', lineRequest({ categories: [...categories(2), { id: 'c0', name: 'Again' }] })],
    ['a candidate id twice', lineRequest({ candidates: [...candidates(2), { id: 'p1', text: 'Again' }] })],
    ['a category named by the fixed consent option', lineRequest({ categories: [{ id: 'consent', name: 'Consent' }] })]
  ])('refuses %s with 400 invalid_request and no call to Jev', async (_, body) => {
    const jev = mockJev()
    await expectError(await postLine(body), 400, 'invalid_request')
    expect(jev).not.toHaveBeenCalled()
  })

  test.each([
    ['a body over 16 KB', oversized, { 'Content-Type': 'application/json' }],
    ['a body over 16 KB that says so', oversized, { 'Content-Type': 'application/json', 'Content-Length': '17200' }],
    [
      'a length over 16 KB, before reading',
      JSON.stringify(lineRequest()),
      { 'Content-Type': 'application/json', 'Content-Length': '16385' }
    ],
    ['a body sent as text', JSON.stringify(lineRequest()), { 'Content-Type': 'text/plain' }],
    ['a body with no type', JSON.stringify(lineRequest()), {}]
  ])('refuses %s with 400 invalid_request and no call to Jev', async (_, body, sent) => {
    const jev = mockJev()
    await expectError(await post(body, sent), 400, 'invalid_request')
    expect(jev).not.toHaveBeenCalled()
  })

  test('answers a line at every limit, counting each emoji as one character', async () => {
    const full = lineRequest({
      line: '😀'.repeat(300),
      place: 'a'.repeat(40),
      categories: categories(12).map((category) => ({ ...category, name: 'n'.repeat(40) })),
      candidates: candidates(40).map((candidate, i) => ({ id: `${i}`.padStart(64, 'p'), text: 't'.repeat(200) }))
    })
    const topic = Object.fromEntries([...full.categories.map(({ id }) => [id, 0.05]), ['consent', 0.4]])
    mockJev(() => Response.json(jevAnswer(Array(40).fill(0.5), topic)))
    const response = await post(JSON.stringify(full), { 'Content-Type': 'application/json; charset=utf-8' })
    expect(response.status).toBe(200)
    expect(Object.keys(((await response.json()) as { scores: object }).scores)).toHaveLength(40)
  })
})

describe("Jev's failures", () => {
  test.each([
    ['busy', 529],
    ['rate-limited', 429],
    ['failing', 500]
  ])('answers 503 jev_unavailable, with the code alone, when Jev is %s after one retry (SEC-4)', async (_, status) => {
    const jev = mockJev(jevError(status), jevError(status))
    await expectError(await postLine(lineRequest()), 503, 'jev_unavailable')
    expect(jev).toHaveBeenCalledTimes(2)
  })

  test.each([
    ['refuses the key', 401],
    ['is out of credits', 402]
  ])(
    'answers 503 jev_unavailable, with the code alone, when Jev %s, without a retry (SEC-4, AVAIL-2)',
    async (_, status) => {
      const jev = mockJev(jevError(status))
      await expectError(await postLine(lineRequest()), 503, 'jev_unavailable')
      expect(jev).toHaveBeenCalledOnce()
    }
  )

  test('answers 503 jev_unavailable when an answer is missing a candidate', async () => {
    const answer = jevAnswer()
    delete (answer.answers as Record<string, unknown>).c01
    mockJev(() => Response.json(answer))
    await expectError(await postLine(lineRequest()), 503, 'jev_unavailable')
  })

  test('answers after one retry when Jev fails once', async () => {
    const jev = mockJev(jevError(500), () => Response.json(jevAnswer()))
    expect((await postLine(lineRequest())).status).toBe(200)
    expect(jev).toHaveBeenCalledTimes(2)
  })

  test("gives up on a hung call within the phone's 3 seconds (STATE-2)", async () => {
    vi.mocked(globalThis.fetch).mockImplementation(
      (_, init) =>
        new Promise((_, reject) => init?.signal?.addEventListener('abort', () => reject(init.signal?.reason)))
    )
    const started = Date.now()
    await expectError(await postLine(lineRequest()), 503, 'jev_unavailable')
    expect(Date.now() - started).toBeLessThan(3000)
  })
})

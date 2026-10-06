import type { Config, LineAnswer, LineRequest } from '@turn/shared/relay'
import { fixedButtons, startingPolicy } from '@turn/shared/row'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test, vi } from 'vitest'
import { main, render, replay } from '../src/replay'

const relay = 'http://relay.test'
const config: Config = { jevOn: true, typesafeNamed: false, freeLinesLeft: 20, policy: startingPolicy }
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

/**
 * Stands in for the relay: the configuration, then each line's answer from `answer`, which gets the request's signal.
 * Returns the spy.
 */
function fakeRelay(
  answer: (request: LineRequest, signal?: AbortSignal | null) => Response | Promise<Response>,
  served: Config = config
) {
  return vi.mocked(fetch).mockImplementation(async (input, init) => {
    const url = String(input)
    if (url === `${relay}/v1/config`) return Response.json(served)
    if (url === `${relay}/v1/lines`) return answer(JSON.parse(String(init?.body)), init?.signal)
    throw new Error(`No stand-in for ${url}`)
  })
}

/** The relay's answer to a request: each candidate scores what `scores` gives it, or else 0.1. */
const answered = (request: LineRequest, scores: Readonly<Record<string, number>> = {}) =>
  Response.json({
    seq: request.seq,
    kind: { yes_no: 0, either_or: 0, open: 1, not_a_question: 0 },
    topic: {},
    scores: Object.fromEntries(request.candidates.map(({ id }) => [id, scores[id] ?? 0.1])),
    policy: startingPolicy,
    freeLinesLeft: 19,
    ms: { jev: 150, total: 290 }
  } satisfies LineAnswer)

const lines = (...texts: string[]) => texts.map((text) => ({ text, place: 'home' }))

test('sends each line as the app would, as one new user, with the headers and body the relay checks', async () => {
  const spy = fakeRelay((request) => answered(request))
  await replay([...lines('Do you want a cup of tea?'), { text: 'Have you got your coat?', place: 'out' }], relay)
  const users = new Set(spy.mock.calls.map(([, init]) => new Headers(init?.headers).get('X-Turn-User')))
  expect(users.size).toBe(1)
  expect([...users][0]).toMatch(uuid)
  for (const [, init] of spy.mock.calls) {
    const sent = new Headers(init?.headers)
    expect([sent.get('X-Turn-Version'), sent.get('X-Turn-Build'), sent.get('User-Agent')]).toEqual([
      'replay',
      'simulator',
      'turn-replay/1.0'
    ])
  }
  const posts = spy.mock.calls.filter(([url]) => String(url).endsWith('/v1/lines'))
  const bodies = posts.map(([, init]) => JSON.parse(String(init?.body)) as LineRequest)
  expect(bodies.map(({ seq, line, place }) => [seq, line, place])).toEqual([
    [1, 'Do you want a cup of tea?', 'Home'],
    [2, 'Have you got your coat?', 'Out']
  ])
  for (const { lineId, categories, candidates } of bodies) {
    expect(lineId).toMatch(uuid)
    expect(categories.map(({ id }) => id)).not.toContain('strip')
    expect(candidates).toHaveLength(40)
    expect(candidates.map(({ id }) => id)).not.toContain('yes')
  }
  expect(bodies[0].lineId).not.toBe(bodies[1].lineId)
  expect(new Headers(posts[0][1]?.headers).get('Content-Type')).toBe('application/json')
})

test("sends a long line's last 300 characters, as the app does, counting each emoji as one", async () => {
  const sent: LineRequest[] = []
  fakeRelay((request) => {
    sent.push(request)
    return answered(request)
  })
  await replay(lines('😀'.repeat(10) + 'x'.repeat(295)), relay)
  expect(sent[0].line).toBe('😀'.repeat(5) + 'x'.repeat(295))
})

test('counts slot changes: steady slots, a phrase that beats the lowest by the margin, and a hold', async () => {
  const requests: LineRequest[] = []
  // Six phrases from the middle of the first line's shortlist, and then the first phrase the row doesn't show.
  let six: Record<string, number> = {}
  let fresh = ''
  fakeRelay((request) => {
    requests.push(request)
    const ids = request.candidates.map(({ id }) => id)
    if (request.seq === 1)
      six = Object.fromEntries(ids.slice(10, 16).map((id, i) => [id, [0.8, 0.78, 0.76, 0.74, 0.72, 0.62][i]]))
    const [first, , , , , sixth] = Object.keys(six)
    fresh ||= ids.find((id) => !(id in six)) ?? ''
    // Line 2 shifts the six by less than the margin and brings a phrase 0.07 above the lowest; line 3 one 0.18 above.
    const scores = [six, { ...six, [first]: 0.81, [sixth]: 0.63, [fresh]: 0.7 }, { ...six, [fresh]: 0.8 }, {}][
      request.seq - 1
    ]
    return answered(request, scores)
  })
  const { replayed } = await replay(lines('One', 'Two', 'Three', 'Four'), relay)
  expect(replayed.map(({ changes, held, by }) => [changes, held, by])).toEqual([
    [6, false, 'relay'],
    [0, false, 'relay'],
    [1, false, 'relay'],
    [0, true, 'relay']
  ])
  // The next line's shortlist starts with the phrases in the row, in their slots' order.
  expect(replayed[0].row.slots).toEqual(Object.keys(six))
  expect(requests[1].candidates.slice(0, 6).map(({ id }) => id)).toEqual(Object.keys(six))
  // The new phrase took the lowest one's slot, the sixth, and the others stayed put.
  expect(replayed[2].row.slots).toEqual([...Object.keys(six).slice(0, 5), fresh])
  expect(replayed[3].row).toMatchObject({ slots: replayed[2].row.slots, answers: 3 })
  expect(replayed[0].ms).toMatchObject({ jev: 150, total: 290 })
})

test('drops an answer for an older line, as the app does, and counts the line as held', async () => {
  fakeRelay((request) => answered({ ...request, seq: 1 }, request.seq === 1 ? {} : { [request.candidates[0].id]: 0.7 }))
  const { replayed } = await replay(lines('One', 'Two'), relay)
  expect(replayed[1]).toMatchObject({ by: 'relay', changes: 0, held: true })
  expect(replayed[1].row.slots.every((id) => id === null)).toBe(true)
})

test('follows the policy each answer carries, not the one the configuration gave', async () => {
  fakeRelay(async (request) => {
    const answer = (await answered(request, { [request.candidates[0].id]: 0.55 }).json()) as LineAnswer
    return Response.json({ ...answer, policy: { ...startingPolicy, floor: 0.5 } })
  })
  const { replayed } = await replay(lines('One'), relay)
  expect(replayed[0].row.slots.filter((id) => id !== null)).toHaveLength(1)
})

test("keeps its one user within the relay's 30 requests a minute, waiting only once it must (SEC-3)", async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'Date'] })
  try {
    const spy = fakeRelay((request) => answered(request))
    const answer = spy.getMockImplementation()!
    const times: number[] = []
    spy.mockImplementation(async (input, init) => {
      times.push(Date.now())
      return answer(input, init)
    })
    let done = false
    const replaying = replay(lines(...Array.from({ length: 40 }, (_, i) => `Line ${i + 1}`)), relay).finally(() => {
      done = true
    })
    while (!done) await vi.advanceTimersByTimeAsync(1000)
    const { replayed } = await replaying
    expect(replayed.map(({ by }) => by)).toEqual(Array(40).fill('relay'))
    expect(times).toHaveLength(41)
    // At most 29 of its requests in any 60 seconds, one fewer than the relay allows, in case two arrive closer.
    for (const start of times) expect(times.filter((t) => t >= start && t < start + 60_000).length).toBeLessThan(30)
    // The configuration and the first 28 lines go at once, and the 29th once the configuration's minute is up.
    expect(times[28]).toBe(times[0])
    expect(times[29]).toBe(times[0] + 60_000)
  } finally {
    vi.useRealTimers()
  }
})

test('has the phone rank a line when the relay fails, answers nothing, or answers too late', async () => {
  fakeRelay((request, signal) => {
    if (request.seq === 1) return Response.json({ error: 'jev_unavailable' }, { status: 503 })
    if (request.seq === 2) throw new TypeError('fetch failed')
    // Line 3's answer never comes, and the request fails as `fetch` does when the replay gives up on it.
    return new Promise<never>((_, reject) => signal?.addEventListener('abort', () => reject(signal.reason)))
  })
  const { replayed } = await replay(lines('Do you want a cup of tea?', 'Hello', 'Are you cold?'), relay, 50)
  expect(replayed.map(({ by, failure }) => [by, failure])).toEqual([
    ['phone', 'jev_unavailable'],
    ['phone', 'unreachable'],
    ['phone', 'no answer in time']
  ])
  // The phone's own yes-or-no rule brings the fixed buttons, with the configuration's policy.
  expect(replayed[0].row.slots.slice(0, 3)).toEqual(fixedButtons)
})

test('has the phone rank a line the relay answers out of shape, and says so', async () => {
  fakeRelay(async (request) => {
    // A big button, but no times; then a page that isn't JSON.
    const body = (await answered(request, { [request.candidates[0].id]: 0.9 }).json()) as Partial<LineAnswer>
    if (request.seq === 1) return Response.json({ ...body, ms: undefined })
    return new Response('<html>Bad gateway</html>', { status: 200 })
  })
  const { replayed } = await replay(lines('Hello', 'Good morning'), relay)
  expect(replayed.map(({ by, failure }) => [by, failure])).toEqual([
    ['phone', 'an answer out of shape'],
    ['phone', 'an answer out of shape']
  ])
  // The phone's own ranking, which never brings a big button, not the relay's.
  expect(replayed.map(({ row }) => row.big)).toEqual([null, null])
})

test('has the phone rank every line when Jev is off, sending none to the relay', async () => {
  const spy = fakeRelay((request) => answered(request), { ...config, jevOn: false })
  const { replayed } = await replay(lines('Do you want a cup of tea?', 'Hello'), relay)
  expect(replayed.map(({ by, failure }) => [by, failure])).toEqual([
    ['phone', 'jev_off'],
    ['phone', 'jev_off']
  ])
  expect(spy.mock.calls.map(([url]) => String(url))).toEqual([`${relay}/v1/config`])
})

test("ranks on the phone with the configuration's policy, not the starting one", async () => {
  // A policy that gives yes-or-no lines only the fixed buttons, where the starting one adds "Water, please".
  fakeRelay((request) => answered(request), {
    ...config,
    jevOn: false,
    policy: { ...startingPolicy, yesNoPhrases: false }
  })
  const { replayed } = await replay(lines('Do you want some water?'), relay)
  expect(replayed[0].row.slots).toEqual([...fixedButtons, null, null, null])
})

test('stops at a 402, where the app would open the paywall', async () => {
  fakeRelay((request) => (request.seq === 2 ? Response.json({ error: 'paywall' }, { status: 402 }) : answered(request)))
  const { replayed, stopped } = await replay(lines('One', 'Two', 'Three'), relay)
  expect(replayed).toHaveLength(1)
  expect(stopped).toBe(2)
  expect(render('lines.jsonl', relay, { replayed, stopped }).replace(/\s+/g, ' ')).toContain(
    'The relay answered 402 at line 2: the app would open the paywall there, so the replay stopped. A relay whose ' +
      "SIMULATOR_UNLIMITED switch is on doesn't count a Simulator build's lines"
  )
})

test("stops when the relay won't give its configuration", async () => {
  vi.mocked(fetch).mockResolvedValue(Response.json({ error: 'internal' }, { status: 500 }))
  await expect(replay(lines('One'), relay)).rejects.toThrow('The relay answered 500 to GET /v1/config')
})

test('prints a row for each line and the totals, from a file of lines', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'turn-replay-'))
  const file = join(dir, 'lines.jsonl')
  writeFileSync(
    file,
    lines('One', 'Two')
      .map((line) => JSON.stringify(line))
      .join('\n')
  )
  fakeRelay((request) => answered(request, request.seq === 1 ? { [request.candidates[0].id]: 0.7 } : {}))
  const log = vi.spyOn(console, 'log').mockImplementation(() => {})
  await main(['--lines', file, '--relay', `${relay}/`])
  const [[printed]] = log.mock.calls
  expect(printed).toContain('| #   | The partner said | Ranked by | The row')
  expect(printed).toMatch(
    /\| 1 {3}\| One {14}\| relay {5}\| [a-z-]+, -, -, -, -, - +\| 1 +\| +\| \d+ \(Jev 150, relay 290\) \|/
  )
  expect(printed).toMatch(/\| 2 {3}\| Two {14}\| relay {5}\| .+ \| 0 +\| held \|/)
  expect(printed.replace(/\s+/g, ' ')).toContain(
    'Slot changes: 1 in all, on 1 of 2 lines. The row held on 1 line and showed 0 big buttons, and the phone ' +
      'ranked 0 lines.'
  )
})

test("refuses a line with no text or a place the starter bank doesn't have", async () => {
  const dir = mkdtempSync(join(tmpdir(), 'turn-replay-'))
  const file = join(dir, 'lines.jsonl')
  writeFileSync(file, JSON.stringify({ text: 'Hello', place: 'moon' }))
  await expect(main(['--lines', file, '--relay', relay])).rejects.toThrow("Line 1's place isn't in the starter bank")
  writeFileSync(file, JSON.stringify({ text: ' ', place: 'home' }))
  await expect(main(['--lines', file, '--relay', relay])).rejects.toThrow('Line 1 has no text')
})

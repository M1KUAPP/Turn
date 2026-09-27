import { describe, expect, test } from 'vitest'
import type { LineAnswer } from '@turn/shared/relay'
import { startingPolicy } from '@turn/shared/row'
import type { Phrase } from '@turn/shared/shortlist'
import { createRelayRanker } from '../src/listen/relay-ranker'
import { createTypedListenSession, type RemoteRanker } from '../src/listen/typed-session'

const phrases: Phrase[] = Array.from({ length: 40 }, (_, i) => ({
  id: `phrase-${i}`,
  text: i === 0 ? 'Lunch sounds good' : `Lunch reply ${i}`,
  places: [],
  fixed: false
}))

function bank() {
  return {
    rankingData: async () => ({ bank: phrases, taps: new Map<string, number>() }),
    subscribe: () => () => {}
  }
}

function answer(seq: number, score = 0.95): LineAnswer {
  return {
    seq,
    kind: { yes_no: 0, either_or: 0, open: 1, not_a_question: 0 },
    topic: { food: 1 },
    scores: Object.fromEntries(phrases.map(({ id }, i) => [id, i === 0 ? score : 0])),
    policy: startingPolicy,
    freeLinesLeft: 19,
    ms: { jev: 50, total: 100 }
  }
}

async function session(remote: RemoteRanker) {
  const listen = createTypedListenSession(bank(), remote)
  await listen.ready
  listen.start()
  return listen
}

describe('typed lines with a remote ranker', () => {
  test('a typed line reaches the request builder and fills the row from its answer', async () => {
    let posted = ''
    const source = {
      ...bank(),
      categories: async () => [{ id: 'food', name: 'Food', position: 0, fixed: 0 }],
      places: async () => [{ id: 'home', name: 'Home', position: 0 }]
    }
    const rank = createRelayRanker({
      bank: source,
      config: {
        snapshot: () => ({ jevOn: true, typesafeNamed: false, freeLinesLeft: 20, policy: startingPolicy }),
        status: () => 'working',
        lineResult: () => {},
        headers: () => ({ 'X-Turn-User': 'user', 'X-Turn-Version': '1', 'X-Turn-Build': 'simulator' })
      },
      allowed: () => true,
      findNames: async (texts) => texts.map(() => []),
      relayUrl: 'https://relay.example',
      createId: () => '5f0e7a8e-3c2b-4d1a-9b6e-2f4c8d0a1b3c',
      request: async (_url, init) => {
        posted = String(init.body)
        const line = JSON.parse(posted) as { seq: number }
        return Response.json(answer(line.seq))
      }
    })
    const listen = createTypedListenSession(source, { allowed: () => true, rank })
    await listen.ready
    listen.start()
    await listen.send('What do you want for lunch?', 'home')
    expect(JSON.parse(posted)).toMatchObject({ line: 'What do you want for lunch?', place: 'Home' })
    expect(listen.getSnapshot().row.big).toBe('phrase-0')
    listen.dispose()
  })

  test('a remote answer uses the row rules for a big button and topic', async () => {
    const inputs: Parameters<RemoteRanker['rank']>[0][] = []
    const listen = await session({
      allowed: () => true,
      rank: async (input) => {
        inputs.push(input)
        return answer(input.seq)
      }
    })
    await listen.send('What do you want for lunch?', 'home')
    const state = listen.getSnapshot()
    expect(inputs).toHaveLength(1)
    expect(inputs[0].shortlist).toHaveLength(40)
    expect(state.row.big).toBe('phrase-0')
    expect(state.bigButton?.text).toBe('Lunch sounds good')
    expect(state.row.tab).toBe('food')
    expect(state.rankedOnPhone).toBe(false)
    expect(state.degraded).toBe(false)
    listen.dispose()
  })

  test('a low remote answer holds the previous row', async () => {
    let score = 0.95
    const listen = await session({ allowed: () => true, rank: async ({ seq }) => answer(seq, score) })
    await listen.send('Lunch?', 'home')
    score = 0.1
    await listen.send('Something else?', 'home')
    expect(listen.getSnapshot().row.big).toBe('phrase-0')
    expect(listen.getSnapshot().row.answers).toBe(1)
    expect(listen.getSnapshot().answeringLine).toBe('Lunch?')
    listen.dispose()
  })

  test('a newer line aborts and defeats a late remote answer', async () => {
    const calls: { seq: number; signal: AbortSignal; resolve: (answer: LineAnswer) => void }[] = []
    const listen = await session({
      allowed: () => true,
      rank: ({ seq, signal }) =>
        new Promise((resolve) => {
          calls.push({ seq, signal, resolve })
        })
    })
    const first = listen.send('First lunch?', 'home')
    await Promise.resolve()
    const second = listen.send('Second lunch?', 'home')
    await Promise.resolve()
    expect(calls).toHaveLength(2)
    expect(calls[0].signal.aborted).toBe(true)
    calls[1].resolve(answer(calls[1].seq))
    await second
    calls[0].resolve(answer(calls[0].seq))
    await first
    expect(listen.getSnapshot().line).toBe('Second lunch?')
    expect(listen.getSnapshot().row.answers).toBe(2)
    listen.dispose()
  })

  test('Clear and End abort requests and keep late replies out of the row', async () => {
    const calls: { seq: number; signal: AbortSignal; resolve: (answer: LineAnswer) => void }[] = []
    const listen = await session({
      allowed: () => true,
      rank: ({ seq, signal }) => new Promise((resolve) => calls.push({ seq, signal, resolve }))
    })
    const first = listen.send('Lunch?', 'home')
    await Promise.resolve()
    listen.clear()
    expect(calls[0].signal.aborted).toBe(true)
    calls[0].resolve(answer(calls[0].seq))
    await first
    expect(listen.getSnapshot().row.big).toBeNull()

    const second = listen.send('Dinner?', 'home')
    await Promise.resolve()
    listen.end()
    expect(calls[1].signal.aborted).toBe(true)
    calls[1].resolve(answer(calls[1].seq))
    await second
    expect(listen.getSnapshot().active).toBe(false)
    expect(listen.getSnapshot().row.big).toBeNull()
    listen.dispose()
  })

  test('two failures degrade, a success clears, and Jev off degrades immediately', async () => {
    let failure: string | null = 'offline'
    const listen = await session({
      allowed: () => true,
      rank: async ({ seq }) => {
        if (failure) throw Object.assign(new Error(failure), { code: failure })
        return answer(seq)
      }
    })
    await listen.send('Lunch one', 'home')
    expect(listen.getSnapshot().degraded).toBe(false)
    expect(listen.getSnapshot().rankedOnPhone).toBe(true)
    await listen.send('Lunch two', 'home')
    expect(listen.getSnapshot().degraded).toBe(true)
    failure = null
    await listen.send('Lunch three', 'home')
    expect(listen.getSnapshot().degraded).toBe(false)
    failure = 'jev_off'
    await listen.send('Lunch four', 'home')
    expect(listen.getSnapshot().degraded).toBe(true)
    failure = null
    await listen.send('Lunch five', 'home')
    expect(listen.getSnapshot().degraded).toBe(false)
    failure = 'offline'
    await listen.send('Lunch six', 'home')
    expect(listen.getSnapshot().degraded).toBe(true)
    listen.dispose()
  })

  test('blocked consent never invokes the remote ranker', async () => {
    let calls = 0
    const listen = await session({
      allowed: () => false,
      rank: async ({ seq }) => {
        calls++
        return answer(seq)
      }
    })
    await listen.send('Lunch?', 'home')
    expect(calls).toBe(0)
    expect(listen.getSnapshot().rankedOnPhone).toBe(true)
    listen.dispose()
  })

  test('a permission change during a line discards the remote answer', async () => {
    let allowed = true
    let resolve: ((answer: LineAnswer) => void) | undefined
    const listen = await session({
      allowed: () => allowed,
      rank: () =>
        new Promise((done) => {
          resolve = done
        })
    })
    const line = listen.send('Lunch?', 'home')
    await Promise.resolve()
    allowed = false
    listen.cancelRemote()
    resolve?.(answer(1))
    await line
    expect(listen.getSnapshot().row.big).toBeNull()
    expect(listen.getSnapshot().rankedOnPhone).toBe(true)
    listen.dispose()
  })
})

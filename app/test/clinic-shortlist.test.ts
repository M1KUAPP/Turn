import { describe, expect, test } from 'vitest'
import { startingPolicy } from '@turn/shared/row'
import type { Phrase } from '@turn/shared/shortlist'
import starterBank from '../src/content/starter-bank.json'
import { createTypedListenSession, type RemoteRanker } from '../src/listen/typed-session'

// The bank as a fresh install ranks it: every category but the strip, in the grid's order, with no taps.
const phrases: Phrase[] = starterBank.categories
  .filter((category) => category.id !== 'strip')
  .flatMap((category) =>
    category.phrases.map((phrase) => ({ id: phrase.id, text: phrase.text, places: phrase.places, fixed: phrase.fixed }))
  )

async function shortlistFor(line: string, place: string) {
  let sent: readonly Phrase[] = []
  const remote: RemoteRanker = {
    allowed: () => true,
    rank: async ({ shortlist, seq }) => {
      sent = shortlist
      return {
        seq,
        kind: { yes_no: 0, either_or: 0, open: 1, not_a_question: 0 },
        topic: {},
        scores: {},
        policy: startingPolicy,
        freeLinesLeft: 19,
        ms: { jev: 50, total: 100 }
      }
    }
  }
  const listen = createTypedListenSession(
    { rankingData: async () => ({ bank: phrases, taps: new Map<string, number>() }), subscribe: () => () => {} },
    remote
  )
  await listen.ready
  listen.start()
  await listen.send(line, place)
  return sent.map(({ id }) => id)
}

describe("a fresh bank's shortlist at the clinic", () => {
  test('sends Jev "It was hard" for "How was physio?" (scenarios 1 and 10)', async () => {
    const ids = await shortlistFor('How was physio?', 'clinic')
    expect(ids).toHaveLength(40)
    expect(ids).toContain('it-was-hard')
  })

  test("sends every one of the clinic's phrases", async () => {
    const clinic = phrases.filter((phrase) => !phrase.fixed && phrase.places.includes('clinic')).map(({ id }) => id)
    expect(await shortlistFor('How was physio?', 'clinic')).toEqual(expect.arrayContaining(clinic))
  })
})

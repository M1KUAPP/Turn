import { buildJevRequest } from '@turn/shared/jev'
import { PhraseIndex, pickShortlist } from '@turn/shared/shortlist'
import { APIError } from '@typesafe-ai/sdk'
import { expect, test, vi } from 'vitest'
import { bank, phrases } from '../src/data'
import { jev, jevLine, relayModel } from '../src/jev'
import { fakeJevAnswer, fakeServices } from './services'

const line = 'Do you want some water?'
const home = { bank: phrases, row: [], place: 'home', taps: new Map<string, number>() }
const shortlist = pickShortlist(line, new PhraseIndex(), home)

test("pins the model the relay runs, from worker/wrangler.jsonc's JEV_MODEL", () => {
  expect(relayModel()).toBe('jev-1.13.0')
})

test("builds the relay's request: the place's name, the grid's categories without the strip, and the shortlist", () => {
  const request = jevLine(line, 'home', shortlist)
  expect(request.line).toBe(line)
  expect(request.place).toBe('Home')
  expect(request.categories.map(({ id }) => id)).toEqual(
    bank.categories.map(({ id }) => id).filter((id) => id !== 'strip')
  )
  expect(request.categories).toContainEqual({ id: 'body-pain', name: 'Body and pain' })
  expect(request.candidates).toEqual(shortlist.map(({ id, text }) => ({ id, text })))
  expect(() => jevLine(line, 'moon', shortlist)).toThrow('The starter bank has no place moon')
})

test("sends Jev the relay's request with the team's key, the code's address and model, and no logs", async () => {
  const services = fakeServices()
  const log = vi.spyOn(console, 'log')
  const warn = vi.spyOn(console, 'warn')
  const debug = vi.spyOn(console, 'debug')
  const ranking = await jev('jev-1.13.0')(line, shortlist, new PhraseIndex(), home)
  const [[url, init]] = services.mock.calls
  expect(String(url)).toBe('https://api.typesafe.ai/v1/systemone')
  expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer test-typesafe-key')
  expect(JSON.parse(String(init?.body))).toEqual(buildJevRequest(jevLine(line, 'home', shortlist), 'jev-1.13.0'))
  for (const spy of [log, warn, debug]) expect(spy).not.toHaveBeenCalled()
  // The stand-in scores the phrase sharing "water" 0.9 and the rest 0.2, in the shortlist's order.
  expect([...ranking.scores.keys()]).toEqual(shortlist.map(({ id }) => id))
  expect(ranking.scores.get('water-please')).toBe(0.9)
  expect(ranking).toMatchObject({ kind: { yes_no: 0.9 }, onPhone: false })
})

test('keeps the model and the input tokens Jev reports for each call', async () => {
  fakeServices().mockImplementationOnce(async (_url, init) =>
    Response.json({ ...fakeJevAnswer(JSON.parse(String(init?.body))), model: 'jev-1.14.0' })
  )
  const ranker = jev('jev-1.13.0')
  await ranker(line, shortlist, new PhraseIndex(), home)
  await ranker(line, shortlist, new PhraseIndex(), home)
  const inputTokens = 1000 + 2 + shortlist.length
  expect(ranker.calls).toEqual([
    { model: 'jev-1.14.0', inputTokens },
    { model: 'jev-1.13.0', inputTokens }
  ])
})

test("retries a failed call, and throws Jev's error once the retries run out", async () => {
  const overloaded = async () => Response.json({ detail: 'Overloaded' }, { status: 529 })
  fakeServices().mockImplementationOnce(overloaded)
  expect((await jev('jev-1.13.0')(line, shortlist, new PhraseIndex(), home)).scores.get('water-please')).toBe(0.9)
  const services = fakeServices().mockImplementation(overloaded)
  services.mockClear()
  await expect(jev('jev-1.13.0')(line, shortlist, new PhraseIndex(), home)).rejects.toBeInstanceOf(APIError)
  // The first attempt and two retries.
  expect(services).toHaveBeenCalledTimes(3)
}, 10_000)

test('needs the key', () => {
  expect(() => jev('jev-1.13.0', {})).toThrow('The Jev ranker needs TYPESAFE_API_KEY in the environment')
})

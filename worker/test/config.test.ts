import { startingPolicy } from '@turn/shared/row'
import { exports } from 'cloudflare:workers'
import { describe, expect, test } from 'vitest'
import { expectError, headers, send } from './helpers'

const getConfig = (changes: Parameters<typeof send>[1] = {}, sent: Record<string, string> = headers) =>
  send(new Request('https://relay.test/v1/config', { headers: sent }), changes)

describe('GET /v1/config', () => {
  test('returns the switches, the free lines, and the starting policy', async () => {
    const response = await exports.default.fetch('https://relay.test/v1/config', { headers })
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      jevOn: true,
      typesafeNamed: false,
      freeLinesLeft: 20,
      policy: startingPolicy
    })
  })

  test('follows the naming setting and the switch at the next request, with no app build (CONSENT-7, STATE-3)', async () => {
    expect(await (await getConfig({ TYPESAFE_NAMED: 'true' })).json()).toMatchObject({
      typesafeNamed: true,
      jevOn: true
    })
    expect(await (await getConfig({ JEV_ON: 'false' })).json()).toMatchObject({ jevOn: false })
    expect(await (await getConfig({ JEV_ON: 'yes' })).json()).toMatchObject({ jevOn: false })
  })

  test('lays the changed policy values over the starting policy (ROW-8)', async () => {
    const fromJson = await getConfig({ POLICY: { floor: 0.7 } })
    expect(((await fromJson.json()) as { policy: unknown }).policy).toEqual({ ...startingPolicy, floor: 0.7 })
    const fromString = await getConfig({ POLICY: '{"noBigTopics":["consent"],"yesNoPhrases":false}' })
    expect(((await fromString.json()) as { policy: unknown }).policy).toEqual({
      ...startingPolicy,
      noBigTopics: ['consent'],
      yesNoPhrases: false
    })
  })

  test.each([
    ['an unknown key', { flor: 0.7 }],
    ['a name every object inherits', { constructor: ['consent'] }],
    ['a floor above 1', { floor: 1.5 }],
    ['a floor as text', { floor: '0.7' }],
    ['a switch as text', { yesNoPhrases: 'false' }],
    ['topics that are not all text', { noBigTopics: ['consent', 1] }],
    ['a list', [0.7]],
    ['JSON that does not parse', '{floor: 0.7}']
  ])('answers 500 internal for a POLICY with %s', async (_, policy) => {
    await expectError(await getConfig({ POLICY: policy }), 500, 'internal')
  })

  test.each(['twenty', '', '-1', '2.5'])('answers 500 internal for FREE_LINES %j', async (freeLines) => {
    await expectError(await getConfig({ FREE_LINES: freeLines }), 500, 'internal')
  })

  test.each([
    ['no user', { 'X-Turn-User': '' }],
    ['an uppercase user', { 'X-Turn-User': '5F0E7A8E-3C2B-4D1A-9B6E-2F4C8D0A1B3C' }],
    ['a version 1 UUID', { 'X-Turn-User': '5f0e7a8e-3c2b-1d1a-9b6e-2f4c8d0a1b3c' }],
    ['a UUID of the wrong variant', { 'X-Turn-User': '5f0e7a8e-3c2b-4d1a-7b6e-2f4c8d0a1b3c' }],
    ['no version', { 'X-Turn-Version': '' }],
    ['a version of 33 characters', { 'X-Turn-Version': '1'.repeat(33) }],
    ['a version with a space', { 'X-Turn-Version': '1.0 beta' }],
    ['no build', { 'X-Turn-Build': '' }],
    ['another build', { 'X-Turn-Build': 'watch' }]
  ])('refuses %s with 400 invalid_request', async (_, change) => {
    const sent = Object.fromEntries(Object.entries({ ...headers, ...change }).filter(([, value]) => value !== ''))
    await expectError(await getConfig({}, sent), 400, 'invalid_request')
  })
})

describe('any other request', () => {
  test.each([
    ['GET', '/'],
    ['GET', '/v1/lines'],
    ['POST', '/v1/config'],
    ['GET', '/v1/config/'],
    ['DELETE', '/v1/lines']
  ])('%s %s gets 404 not_found', async (method, path) => {
    await expectError(await send(new Request(`https://relay.test${path}`, { method, headers })), 404, 'not_found')
  })
})

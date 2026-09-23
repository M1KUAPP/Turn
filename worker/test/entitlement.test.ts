import { runInDurableObject } from 'cloudflare:test'
import { env } from 'cloudflare:workers'
import { describe, expect, test, vi } from 'vitest'
import { checkEntitlement } from '../src/entitlement'
import {
  activeEntitlements,
  callsTo,
  expectError,
  freeLinesLeft,
  hang,
  jevAnswers,
  lineRequest,
  listen,
  mockJev,
  mockRevenueCat,
  postLine,
  rcError,
  unknownCustomer,
  user,
  userHash
} from './helpers'

/** Makes RevenueCat's last answer, and any refresh, older by `ms` in the test user's object. */
async function age(ms: number) {
  const stub = env.DEVICE.getByName(`user-${await userHash()}`)
  await runInDurableObject(stub, (_, state) => {
    state.storage.sql.exec(
      'UPDATE entitlement SET checked_at = checked_at - ?, refreshed_at = refreshed_at - ?',
      ms,
      ms
    )
  })
}

/** Every line is past the free lines with none to give. */
const paid = { FREE_LINES: '0' }

describe("RevenueCat's answer (PAY-7)", () => {
  test("asks for the user's active entitlements with the relay's key", async () => {
    mockRevenueCat(activeEntitlements(listen))
    expect(await checkEntitlement(env, user)).toBe('yes')
    const [[input, init]] = callsTo('api.revenuecat.com')
    expect(String(input)).toBe(
      `https://api.revenuecat.com/v2/projects/${env.RC_PROJECT_ID}/customers/${user}/active_entitlements`
    )
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer test-rc-key')
  })

  test.each([
    ['listen with no expiry', [listen], 'yes'],
    ['listen expiring later', [{ ...listen, expires_at: Date.now() + 60_000 }], 'yes'],
    ['listen among others', [{ entitlement_id: 'entl_other', expires_at: null }, listen], 'yes'],
    ['listen expired', [{ ...listen, expires_at: Date.now() - 1000 }], 'no'],
    ['only another entitlement', [{ entitlement_id: 'entl_other', expires_at: null }], 'no'],
    ['no entitlements', [], 'no']
  ])('reads a list with %s as %s', async (_, items, answer) => {
    mockRevenueCat(activeEntitlements(...items))
    expect(await checkEntitlement(env, user)).toBe(answer)
  })

  test('reads a 404 for an ID RevenueCat has never seen as no', async () => {
    mockRevenueCat(unknownCustomer)
    expect(await checkEntitlement(env, user)).toBe('no')
  })

  test.each([
    ['a server error', rcError(500, 'server_error')],
    ['no server to answer', rcError(503, 'server_error')],
    ['a rate limit', rcError(429, 'rate_limit_error')],
    ['a locked customer', rcError(423, 'resource_locked_error')],
    ['a refused key', rcError(401, 'authentication_error')],
    ['a key without access', rcError(403, 'authorization_error')],
    ['a 404 for something else', rcError(404, 'invalid_request')],
    ['a body that is no JSON', () => new Response('<html>Bad gateway</html>', { status: 200 })],
    ["a list with a server error's status", () => Response.json({ object: 'list', items: [listen] }, { status: 500 })],
    ['a list whose items are no list', () => Response.json({ object: 'list', items: {} })],
    ['an item out of shape', () => Response.json({ object: 'list', items: [{ entitlement_id: 7, expires_at: null }] })],
    [
      'an expiry out of shape',
      () => Response.json({ object: 'list', items: [{ ...listen, expires_at: '2026-10-01' }] })
    ],
    [
      'a network error',
      () => {
        throw new TypeError('Network connection lost.')
      }
    ]
  ])('reads %s as unknown', async (_, reply) => {
    mockRevenueCat(reply)
    expect(await checkEntitlement(env, user)).toBe('unknown')
  })

  test('gives up as unknown after half a second', async () => {
    vi.mocked(globalThis.fetch).mockImplementationOnce(
      (_, init) =>
        new Promise((_, reject) => init?.signal?.addEventListener('abort', () => reject(init.signal?.reason)))
    )
    const started = Date.now()
    expect(await checkEntitlement(env, user)).toBe('unknown')
    expect(Date.now() - started).toBeGreaterThanOrEqual(500)
    expect(Date.now() - started).toBeLessThan(1000)
  })

  test.each(['RC_SECRET_KEY', 'RC_PROJECT_ID', 'RC_ENTITLEMENT_ID'])(
    'reads an unset %s as unknown, without asking',
    async (name) => {
      expect(await checkEntitlement({ ...env, [name]: '' }, user)).toBe('unknown')
      expect(callsTo('api.revenuecat.com')).toHaveLength(0)
    }
  )
})

describe('lines past the free lines (PAY-7)', () => {
  test("answer a fresh ID's 21st line 402, then Jev's answer for a line with refresh after a purchase", async () => {
    mockJev(...jevAnswers(21))
    for (let i = 0; i < 20; i++) expect((await postLine(lineRequest())).status).toBe(200)
    mockRevenueCat(unknownCustomer, activeEntitlements(listen))
    await expectError(await postLine(lineRequest()), 402, 'paywall')
    const response = await postLine(lineRequest({ refresh: true }))
    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ freeLinesLeft: null })
    expect(await freeLinesLeft()).toBeNull()
  })

  test('keep a no for a minute, then ask again', async () => {
    mockRevenueCat(activeEntitlements(), activeEntitlements(listen))
    mockJev(...jevAnswers(1))
    await expectError(await postLine(lineRequest(), paid), 402, 'paywall')
    await age(59_000)
    await expectError(await postLine(lineRequest(), paid), 402, 'paywall')
    expect(callsTo('api.revenuecat.com')).toHaveLength(1)
    await age(2000)
    expect((await postLine(lineRequest(), paid)).status).toBe(200)
    expect(callsTo('api.revenuecat.com')).toHaveLength(2)
  })

  test('keep a yes for a day, then ask again', async () => {
    mockRevenueCat(activeEntitlements(listen), activeEntitlements())
    mockJev(...jevAnswers(2))
    expect((await postLine(lineRequest(), paid)).status).toBe(200)
    await age(24 * 60 * 60_000 - 1000)
    expect((await postLine(lineRequest(), paid)).status).toBe(200)
    expect(callsTo('api.revenuecat.com')).toHaveLength(1)
    await age(2000)
    await expectError(await postLine(lineRequest(), paid), 402, 'paywall')
    expect(callsTo('api.revenuecat.com')).toHaveLength(2)
  })

  test('let a line with refresh skip a fresh no once a minute (PAY-4)', async () => {
    mockRevenueCat(activeEntitlements(), activeEntitlements(), activeEntitlements(), activeEntitlements(listen))
    mockJev(...jevAnswers(1))
    await expectError(await postLine(lineRequest(), paid), 402, 'paywall')
    await expectError(await postLine(lineRequest({ refresh: true }), paid), 402, 'paywall')
    await expectError(await postLine(lineRequest({ refresh: true }), paid), 402, 'paywall')
    expect(callsTo('api.revenuecat.com')).toHaveLength(2)
    await age(61_000)
    await expectError(await postLine(lineRequest(), paid), 402, 'paywall')
    expect((await postLine(lineRequest({ refresh: true }), paid)).status).toBe(200)
    expect(callsTo('api.revenuecat.com')).toHaveLength(4)
  })

  test("keep the newest check's answer, not the last to finish", async () => {
    mockRevenueCat(async () => {
      await scheduler.wait(300)
      return activeEntitlements()()
    }, activeEntitlements(listen))
    mockJev(...jevAnswers(2))
    const older = postLine(lineRequest(), paid)
    await scheduler.wait(50)
    expect((await postLine(lineRequest({ refresh: true }), paid)).status).toBe(200)
    await expectError(await older, 402, 'paywall')
    expect((await postLine(lineRequest(), paid)).status).toBe(200)
  })

  test('answer 503 jev_unavailable, never 402, when RevenueCat fails and no yes is cached', async () => {
    mockRevenueCat(rcError(503, 'server_error'), activeEntitlements(), rcError(500, 'server_error'))
    await expectError(await postLine(lineRequest(), paid), 503, 'jev_unavailable')
    await expectError(await postLine(lineRequest(), paid), 402, 'paywall')
    await expectError(await postLine(lineRequest({ refresh: true }), paid), 503, 'jev_unavailable')
    expect(callsTo('api.typesafe.ai')).toHaveLength(0)
  })

  test("keep a failed refresh's skip for the next line with refresh", async () => {
    mockRevenueCat(activeEntitlements(), rcError(503, 'server_error'), activeEntitlements(listen))
    mockJev(...jevAnswers(1))
    await expectError(await postLine(lineRequest(), paid), 402, 'paywall')
    await expectError(await postLine(lineRequest({ refresh: true }), paid), 503, 'jev_unavailable')
    expect((await postLine(lineRequest({ refresh: true }), paid)).status).toBe(200)
  })

  test('let the line after a failed refresh ask again, not meet the no the refresh skipped (PAY-4)', async () => {
    mockRevenueCat(activeEntitlements(), rcError(503, 'server_error'), activeEntitlements(listen))
    mockJev(...jevAnswers(1))
    await expectError(await postLine(lineRequest(), paid), 402, 'paywall')
    await expectError(await postLine(lineRequest({ refresh: true }), paid), 503, 'jev_unavailable')
    expect((await postLine(lineRequest(), paid)).status).toBe(200)
  })

  test("keep a yes that arrived while a failed refresh's check ran", async () => {
    mockRevenueCat(
      activeEntitlements(),
      async () => {
        await scheduler.wait(300)
        return rcError(503, 'server_error')()
      },
      activeEntitlements(listen)
    )
    mockJev(...jevAnswers(2))
    await expectError(await postLine(lineRequest(), paid), 402, 'paywall')
    const failing = postLine(lineRequest({ refresh: true }), paid)
    await scheduler.wait(50)
    expect((await postLine(lineRequest({ refresh: true }), paid)).status).toBe(200)
    await expectError(await failing, 503, 'jev_unavailable')
    expect((await postLine(lineRequest(), paid)).status).toBe(200)
    expect(callsTo('api.revenuecat.com')).toHaveLength(3)
  })

  test("give Jev what's left of the line's 2.5 seconds after RevenueCat's check (STATE-2)", async () => {
    mockRevenueCat(async () => {
      await scheduler.wait(400)
      return activeEntitlements(listen)()
    })
    mockJev(hang, hang)
    const started = Date.now()
    await expectError(await postLine(lineRequest(), paid), 503, 'jev_unavailable')
    expect(Date.now() - started).toBeGreaterThanOrEqual(2500)
    expect(Date.now() - started).toBeLessThan(2700)
  })

  test('answer from a yes older than a day when RevenueCat fails', async () => {
    mockRevenueCat(activeEntitlements(listen), rcError(500, 'server_error'))
    mockJev(...jevAnswers(2))
    expect((await postLine(lineRequest(), paid)).status).toBe(200)
    await age(25 * 60 * 60_000)
    const response = await postLine(lineRequest(), paid)
    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ freeLinesLeft: null })
    expect(callsTo('api.revenuecat.com')).toHaveLength(2)
  })

  test('ask RevenueCat about a free line only when it carries refresh, and show null once it says yes (PAY-4)', async () => {
    mockRevenueCat(activeEntitlements(listen))
    mockJev(...jevAnswers(2))
    expect(await (await postLine(lineRequest())).json()).toMatchObject({ freeLinesLeft: 19 })
    expect(callsTo('api.revenuecat.com')).toHaveLength(0)
    expect(await (await postLine(lineRequest({ refresh: true }))).json()).toMatchObject({ freeLinesLeft: null })
    expect(callsTo('api.revenuecat.com')).toHaveLength(1)
    expect(await freeLinesLeft()).toBeNull()
  })

  test.each([
    ['says no', activeEntitlements()],
    ['fails', rcError(503, 'server_error')]
  ])('answer a free line with refresh and keep its count when RevenueCat %s', async (_, reply) => {
    mockRevenueCat(reply)
    mockJev(...jevAnswers(1))
    const response = await postLine(lineRequest({ refresh: true }))
    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ freeLinesLeft: 19 })
  })
})

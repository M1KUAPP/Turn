import { expect, test, vi } from 'vitest'
import { runModel } from '../src/workers-ai'

test("posts the body to the model's endpoint with the account and token from the environment", async () => {
  vi.mocked(fetch).mockResolvedValueOnce(Response.json({ success: true, errors: [], result: { response: [] } }))
  expect(await runModel('@cf/test/model')({ query: 'Hi' })).toEqual({ response: [] })
  const [url, init] = vi.mocked(fetch).mock.calls[0]
  expect(String(url)).toBe('https://api.cloudflare.com/client/v4/accounts/test-account/ai/run/@cf/test/model')
  expect(init?.method).toBe('POST')
  expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer test-cloudflare-token')
  expect(new Headers(init?.headers).get('Content-Type')).toBe('application/json')
  expect(JSON.parse(String(init?.body))).toEqual({ query: 'Hi' })
})

test('needs both the account and the token', () => {
  const needs = 'Workers AI needs CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN in the environment'
  expect(() => runModel('@cf/test/model', { CLOUDFLARE_API_TOKEN: 'token' })).toThrow(needs)
  expect(() => runModel('@cf/test/model', { CLOUDFLARE_ACCOUNT_ID: 'account' })).toThrow(needs)
})

test("throws Workers AI's error codes, never the token, and says so when an answer isn't JSON", async () => {
  vi.mocked(fetch).mockResolvedValueOnce(
    Response.json({ success: false, errors: [{ code: 3030, message: 'AiError: invalid input' }] }, { status: 400 })
  )
  const error: Error = await runModel('@cf/test/model')({}).catch((thrown) => thrown)
  expect(error.message).toBe('Workers AI answered 400: 3030 AiError: invalid input')
  expect(error.message).not.toContain('test-cloudflare-token')
  vi.mocked(fetch).mockResolvedValueOnce(new Response('error code: 1010', { status: 403 }))
  await expect(runModel('@cf/test/model')({})).rejects.toThrow('Workers AI answered 403: no error codes')
})

test('gives an empty result for a success that carries none', async () => {
  vi.mocked(fetch).mockResolvedValueOnce(Response.json({ success: true, errors: [] }))
  expect(await runModel('@cf/test/model')({})).toEqual({})
})

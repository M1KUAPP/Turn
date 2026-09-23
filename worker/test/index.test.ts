import { exports } from 'cloudflare:workers'
import { expect, test } from 'vitest'

test('runs inside the Workers runtime', () => {
  expect(navigator.userAgent).toBe('Cloudflare-Workers')
})

test('answers a request', async () => {
  const response = await exports.default.fetch('https://relay.test/')
  expect(response.status).toBe(404)
})

test('refuses a fetch no test mocked', async () => {
  await expect(fetch('https://api.typesafe.ai/v1/models')).rejects.toThrow('without mocking')
})

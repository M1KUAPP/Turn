import { exports } from 'cloudflare:workers'
import { expect, test } from 'vitest'
import { expectError } from './helpers'

test('runs inside the Workers runtime', () => {
  expect(navigator.userAgent).toBe('Cloudflare-Workers')
})

test('answers a request', async () => {
  await expectError(await exports.default.fetch('https://relay.test/'), 404, 'not_found')
})

test('refuses a fetch no test mocked', async () => {
  await expect(fetch('https://api.typesafe.ai/v1/models')).rejects.toThrow('without mocking')
})

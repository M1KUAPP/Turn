import { expect, test } from 'vitest'

test("fails any fetch a test doesn't stand in for, and shows no test a real key", async () => {
  await expect(fetch('https://api.typesafe.ai/v1/systemone')).rejects.toThrow(
    'This test called fetch without mocking it'
  )
  expect(process.env.TYPESAFE_API_KEY).toBe('test-typesafe-key')
  expect(process.env.CLOUDFLARE_API_TOKEN).toBe('test-cloudflare-token')
})

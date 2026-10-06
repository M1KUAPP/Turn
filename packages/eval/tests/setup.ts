import { afterEach, beforeEach, vi } from 'vitest'

// No test may see a real key from the shell, even one that forgets to stand in for a service.
for (const name of ['TYPESAFE_API_KEY', 'CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN']) delete process.env[name]

/**
 * Makes any `fetch` a test doesn't stand in for fail, and sets made-up keys, plus wrong values for what TypeSafe's SDK
 * reads from the environment for any option the code leaves out, so those tests fail if the code ever leaves one out.
 */
const guard = () => {
  vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('This test called fetch without mocking it'))
  vi.stubEnv('TYPESAFE_API_KEY', 'test-typesafe-key')
  vi.stubEnv('CLOUDFLARE_ACCOUNT_ID', 'test-account')
  vi.stubEnv('CLOUDFLARE_API_TOKEN', 'test-cloudflare-token')
  vi.stubEnv('TYPESAFE_BASE_URL', 'https://stray.invalid')
  vi.stubEnv('TYPESAFE_DEFAULT_MODEL', 'jev-stray')
  vi.stubEnv('TYPESAFE_LOG_LEVEL', 'debug')
}

// Once for any `beforeAll`, which runs before the first `beforeEach`, and again before each test.
guard()
beforeEach(guard)

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

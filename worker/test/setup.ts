import { reset } from 'cloudflare:test'
import { afterEach, beforeEach, vi } from 'vitest'
import { routeFetch } from './helpers'

beforeEach(() => {
  // A test that doesn't stand in for an API would otherwise call the real one.
  routeFetch()
  // The relay's log lines would fill the test output; the log's own test reads them from this spy.
  vi.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(async () => {
  vi.restoreAllMocks()
  // Each object keeps its counts, and the rate limits keep theirs, which would otherwise carry into the next test.
  await reset()
})

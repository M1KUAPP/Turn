import { afterEach, beforeEach, vi } from 'vitest'

beforeEach(() => {
  // A test that doesn't stand in for Jev would otherwise call the real API.
  vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('This test called fetch without mocking it'))
  // The relay's log lines would fill the test output; the log's own test reads them from this spy.
  vi.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

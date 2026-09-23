import { afterEach, beforeEach, vi } from 'vitest'

// A test that doesn't stand in for Jev would otherwise call the real API.
beforeEach(() => {
  vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('This test called fetch without mocking it'))
})

afterEach(() => {
  vi.restoreAllMocks()
})

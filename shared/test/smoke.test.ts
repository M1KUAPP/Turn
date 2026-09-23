import { expect, test } from 'vitest'

test('Vitest runs TypeScript in this package', () => {
  const answer: number = 6 * 7
  expect(answer).toBe(42)
})

import { expect, test } from 'vitest'
import { listOf } from '../src/prose'

test('joins names as prose', () => {
  expect(listOf(['claude-c'])).toBe('claude-c')
  expect(listOf(['claude-c', 'claude-d'])).toBe('claude-c and claude-d')
  expect(listOf(['claude-c', 'claude-d', 'claude-e'])).toBe('claude-c, claude-d, and claude-e')
})

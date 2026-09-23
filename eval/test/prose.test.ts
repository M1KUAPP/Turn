import { expect, test } from 'vitest'
import { listOf, wrap } from '../src/prose'

test('joins names as prose', () => {
  expect(listOf(['claude-c'])).toBe('claude-c')
  expect(listOf(['claude-c', 'claude-d'])).toBe('claude-c and claude-d')
  expect(listOf(['claude-c', 'claude-d', 'claude-e'])).toBe('claude-c, claude-d, and claude-e')
})

test('fills prose to 80 columns, indenting the lines after the first', () => {
  const words = Array.from({ length: 40 }, (_, i) => `word${i}`).join(' ')
  const lines = wrap(`- ${words}`, '  ').split('\n')
  expect(lines.length).toBeGreaterThan(1)
  for (const line of lines) expect(line.length).toBeLessThanOrEqual(80)
  for (const line of lines.slice(1)) expect(line).toMatch(/^ {2}\S/)
  expect(lines.join(' ').replaceAll(/\s+/g, ' ')).toBe(`- ${words}`)
})

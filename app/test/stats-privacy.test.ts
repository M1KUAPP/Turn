import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'

describe('stats stay out of relay request builders', () => {
  test.each([
    ['line request builder', '../src/relay/line.ts'],
    ['Listen ranker request builder', '../src/listen/relay-ranker.ts']
  ])('%s has no stats reference', (_name, sourcePath) => {
    const source = readFileSync(new URL(sourcePath, import.meta.url), 'utf8')
    expect(source).not.toMatch(/stats/i)
  })
})

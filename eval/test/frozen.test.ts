import { fileURLToPath } from 'node:url'
import { expect, test, vi } from 'vitest'
import { main } from '../src/report'

// Git's answers, as a working tree with changes its commit lacks would give them.
const git = vi.hoisted(() => ({ dirty: false }))
vi.mock('node:child_process', async (original) => {
  const real = await original<typeof import('node:child_process')>()
  const execFileSync = ((file: string, args: readonly string[], options: object) => {
    if (git.dirty && args[0] === 'diff') throw new Error('The working tree has changes')
    return real.execFileSync(file, args, options)
  }) as typeof real.execFileSync
  return { ...real, execFileSync }
})

test('refuses to score the 80 lines with uncommitted changes, before any ranker runs (EVAL-2)', async () => {
  git.dirty = true
  await expect(main(['--out', '/dev/null'])).rejects.toThrow(
    "Commit every change before scoring eval/lines.jsonl, so the history shows Jev's settings before any result"
  )
  // Named by its path too.
  const lines = fileURLToPath(new URL('../lines.jsonl', import.meta.url))
  await expect(main(['--lines', lines, '--out', '/dev/null'])).rejects.toThrow('(EVAL-2)')
  // No ranker called a service, not even the guard's stand-in for one.
  expect(fetch).not.toHaveBeenCalled()
})

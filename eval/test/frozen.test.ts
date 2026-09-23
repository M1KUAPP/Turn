import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test, vi } from 'vitest'
import { main } from '../src/report'
import { fakeServices } from './services'

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

test('refuses to score any of the 80 lines with uncommitted changes, before any ranker runs (EVAL-2)', async () => {
  git.dirty = true
  await expect(main(['--out', '/dev/null'])).rejects.toThrow(
    "Commit every change before scoring the 80 lines of eval/lines.jsonl, so the history shows Jev's settings before"
  )
  // Named by its path, or copied under another name: one of its lines is enough.
  const eighty = fileURLToPath(new URL('../lines.jsonl', import.meta.url))
  await expect(main(['--lines', eighty, '--out', '/dev/null'])).rejects.toThrow('(EVAL-2)')
  const copy = join(mkdtempSync(join(tmpdir(), 'turn-eval-')), 'LINES.jsonl')
  writeFileSync(copy, readFileSync(eighty, 'utf8').split('\n')[0])
  await expect(main(['--lines', copy, '--out', '/dev/null'])).rejects.toThrow('(EVAL-2)')
  // No ranker called a service, not even the guard's stand-in for one.
  expect(fetch).not.toHaveBeenCalled()
})

test('scores lines that are none of the 80 on a tree with changes', async () => {
  git.dirty = true
  const fixture = fileURLToPath(new URL('fixture/lines.jsonl', import.meta.url))
  fakeServices()
  const out = join(mkdtempSync(join(tmpdir(), 'turn-eval-')), 'results.md')
  await main(['--lines', fixture, '--out', out])
  expect(readFileSync(out, 'utf8')).toMatch(/at commit `[0-9a-f]+` with uncommitted changes\./)
})

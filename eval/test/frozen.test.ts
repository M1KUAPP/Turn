import { buildJevRequest } from '@turn/shared/jev'
import { startingPolicy } from '@turn/shared/row'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test, vi } from 'vitest'
import { jevLine, relayModel } from '../src/jev'
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

test("keeps Jev's settings as the first run on the 80 lines used them (EVAL-2)", () => {
  expect(startingPolicy).toEqual({
    floor: 0.6,
    bigAbove: 0.85,
    margin: 0.15,
    yesNoPhrases: true,
    noBigTopics: ['body-pain', 'consent'],
    fixedOnlyTopics: []
  })
  // The request the run sent for a line at home, with one candidate: the wording, the pin, and the bank's place and
  // categories, compared as sent, in its keys' order. `shared/test/jev.test.ts` pins the wording piece by piece and the
  // relay's snapshot can be rewritten with `vitest -u`, so this holds all of it in one place, as EVAL-2 froze it.
  const request = buildJevRequest(
    jevLine('Tea?', 'home', [{ id: 'tea', text: 'Tea, please', places: [] }]),
    relayModel()
  )
  const frozen = {
    model: 'jev-1.13.0',
    state: { partner_line: 'Tea?', place: 'Home' },
    questions: {
      kind: {
        type: 'choice',
        instructions: 'What kind of question is `partner_line`?',
        criteria: {
          yes_no: 'Can be answered with yes or no',
          either_or: 'Asks the listener to pick one of the options it names',
          open: "Needs an answer in the listener's own words",
          not_a_question: 'A statement, greeting, or comment, not a question'
        }
      },
      topic: {
        type: 'choice',
        instructions: 'What topic is `partner_line` about?',
        criteria: {
          quick: 'Quick',
          chat: 'Chat',
          care: 'Care and help',
          'body-pain': 'Body and pain',
          food: 'Food and drink',
          feelings: 'Feelings',
          family: 'Family and friends',
          health: 'Health',
          'out-and-about': 'Out and about',
          consent: 'Agreeing to or refusing care, treatment, or a procedure'
        }
      },
      c00: {
        type: 'noul',
        instructions: {
          phrase: 'Tea, please',
          question: '`phrase` answers what the partner just said in `partner_line`.'
        }
      }
    }
  }
  expect(JSON.stringify(request, null, 2)).toBe(JSON.stringify(frozen, null, 2))
})

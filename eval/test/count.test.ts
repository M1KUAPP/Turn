import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test, vi } from 'vitest'
import { main } from '../src/count'

const fixture = (name: string) => fileURLToPath(new URL(`fixture/${name}`, import.meta.url))

/** Runs the script with these arguments, catching what it prints and the exit code it returns. */
const run = (args: string[]) => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {})
  try {
    const code = main(args)
    return { code, printed: log.mock.calls.map((call) => call.join(' ')).join('\n') }
  } finally {
    log.mockRestore()
  }
}
const onFixture = () => run(['--lines', fixture('lines.jsonl'), '--second', fixture('second-labeling.jsonl')])
/** Writes JSON Lines to a new temporary file, returning its path. */
const jsonl = (rows: object[]) => {
  const file = join(mkdtempSync(join(tmpdir(), 'turn-eval-')), 'rows.jsonl')
  writeFileSync(file, rows.map((row) => JSON.stringify(row)).join('\n'))
  return file
}

test('prints each EVAL-1 quota with its count, and exits 1 when one falls short', () => {
  const { code, printed } = onFixture()
  expect(printed).toContain("EVAL-1's quotas, on the 8 lines in eval/test/fixture/lines.jsonl:")
  for (const quota of [
    '- 8 lines, of exactly 80: not met',
    '- 2 with no acceptable reply, of at least 16: not met',
    '- 3 yes-or-no, of at least 24: not met',
    '- 3 about pain or health, of at least 8: not met',
    '- 1 asking for consent, of at least 4: not met',
    '- 2 sharing no word with a reply, of at least 10: not met'
  ])
    expect(printed).toContain(quota)
  expect(code).toBe(1)
})

test("prints the labelers' agreement on each line's call, on each line and phrase, and as alpha", () => {
  const { printed } = onFixture()
  expect(printed).toContain("The labelers' agreement, test-labeler-1's labels against test-labeler-2's:")
  expect(printed).toContain(
    '- Some replies or none, on 8 lines: both some on 6, only the first on 0, only the second on 1, and both none ' +
      "on 1; agreement 0.88, Cohen's kappa 0.60, positive agreement 0.92, and negative agreement 0.67."
  )
  // 151 phrases the row can rank on each of the 8 lines, and Yes, No, and Not sure on the 3 yes-or-no lines.
  expect(printed).toContain(
    '- Each line and candidate phrase, on 1217 pairs: both on 13, only the first on 6, only the second on 2, and ' +
      "neither on 1196; positive agreement 0.76, and negative agreement 1.00 and Cohen's kappa 0.76, which move " +
      "with the pairs' count."
  )
  expect(printed).toContain("- Krippendorff's alpha with the MASI distance over each line's replies: 0.51.")
})

/** n lines that meet every other quota: 16 with no reply, and the rest answered by a phrase they share no word with. */
const meeting = (n: number) => {
  const lines = Array.from({ length: n }, (_, i) => ({
    id: `line-${i + 1}`,
    author: 'test-writer-1',
    text: 'How was physio?',
    kind: 'yes_no',
    place: 'clinic',
    topic: 'therapy',
    concerns: ['pain', 'consent'],
    labeler: 'test-labeler-1',
    acceptable: i < 16 ? [] : ['it-went-well']
  }))
  const second = lines.map(({ id, acceptable }) => ({ id, labeler: 'test-labeler-2', acceptable }))
  return ['--lines', jsonl(lines), '--second', jsonl(second)]
}

test('exits 0 when every quota is met, and holds the lines to exactly 80', () => {
  const met = run(meeting(80))
  expect(met.printed).toContain('- 80 lines, of exactly 80: met')
  expect(met.printed).toContain('- 64 sharing no word with a reply, of at least 10: met')
  expect(met.printed).not.toContain('not met')
  expect(met.code).toBe(0)
  const over = run(meeting(81))
  expect(over.printed).toContain('- 81 lines, of exactly 80: not met')
  expect(over.code).toBe(1)
})

test('stops at a line the second labeling lacks', () => {
  const partial = jsonl(
    readFileSync(fixture('second-labeling.jsonl'), 'utf8')
      .trim()
      .split('\n')
      .slice(0, 7)
      .map((row) => JSON.parse(row))
  )
  expect(() => run(['--lines', fixture('lines.jsonl'), '--second', partial])).toThrow(
    'fixture-8 has no second labeling'
  )
})

test('stops at a line whose second labeling names a phrase the bank lacks', () => {
  const second = jsonl([{ id: 'fixture-1', labeler: 'test-labeler-2', acceptable: ['water-plz'] }])
  expect(() => run(['--lines', fixture('lines.jsonl'), '--second', second])).toThrow('fixture-1 lists water-plz')
})

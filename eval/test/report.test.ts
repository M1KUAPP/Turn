import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { beforeAll, expect, test } from 'vitest'
import { main, rate } from '../src/report'
import { fakeServices } from './services'

const fixture = fileURLToPath(new URL('fixture/lines.jsonl', import.meta.url))
let report = ''

beforeAll(async () => {
  fakeServices()
  const out = join(mkdtempSync(join(tmpdir(), 'turn-eval-')), 'results.md')
  await main(['--lines', fixture, '--out', out])
  report = readFileSync(out, 'utf8')
})

/** The report's section under a heading, up to the next heading of the same level or higher. */
const section = (heading: string) => {
  const level = heading.indexOf(' ')
  const start = report.indexOf(`\n${heading}\n`)
  expect(start, heading).toBeGreaterThanOrEqual(0)
  const rest = report.slice(start + heading.length + 2)
  const end = rest.search(new RegExp(`^#{1,${level}} `, 'm'))
  return end < 0 ? rest : rest.slice(0, end)
}
/** Words as the report wraps them, a line break wherever a space may be. */
const prose = (text: string) =>
  new RegExp(
    text
      .split(' ')
      .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('\\s+')
  )
/** A table's row for a ranker or step, as its cells. */
const cells = (text: string, first: string) =>
  text
    .split('\n')
    .find((line) => line.startsWith(`| ${first} `))
    ?.split('|')
    .slice(2, -1)
    .map((cell) => cell.trim())

test('prints a rate of 56 of 80 with its Wilson interval, 59% to 79%, and one decimal under 10%', () => {
  expect(rate({ k: 56, n: 80 })).toBe('56 of 80, 70% (59% to 79%)')
  expect(rate({ k: 2, n: 6 })).toBe('2 of 6, 33% (9.7% to 70%)')
  expect(rate({ k: 0, n: 0 })).toBe('0 of 0')
})

test('names the date, the commit, and the files it read', () => {
  expect(report).toMatch(
    /^- \*\*Run:\*\* [A-Z][a-z]+ \d{1,2}, \d{4}, at commit `[0-9a-f]{7,}`( with uncommitted changes)?\.$/m
  )
  expect(report).toContain('- **Lines:** the 8 in `eval/test/fixture/lines.jsonl`.')
  expect(report).toContain("- **Bank:** the app's own, `app/src/content/starter-bank.json`.")
})

test('says who wrote and labeled these lines, and who wrote the 80 lines and the starter bank', () => {
  const who = section('## Who wrote the data')
  expect(who).toMatch(prose('test-writer-1 wrote 4 and test-writer-2 wrote 4, and test-labeler-1 labeled'))
  expect(who).toMatch(prose('Claude subagents wrote the 80 lines and the starter bank on September 23, 2026'))
  expect(who).toMatch(prose('Two wrote 40 lines each from a brief that showed no phrase of the bank, as claude-a'))
  expect(who).toMatch(prose('a third wrote the bank without seeing the lines, and a fourth read every phrase'))
  expect(who).toMatch(prose("Two more, claude-c and claude-d, then labeled every line's replies, each alone"))
  expect(who).toMatch(prose('from a brief that set no quota. Their labels left too few lines with no reply,'))
  expect(who).toMatch(prose('so claude-f wrote 20 more lines meant to have none from a brief that showed no list'))
  expect(who).toMatch(prose("of the bank's phrases, only the labeling rules, which name the fixed buttons"))
  expect(who).toMatch(prose('of the 80 lines, it saw only the five that its first draft repeated, quoted back'))
  expect(who).toMatch(prose('claude-g and claude-h labeled the new lines among the 80 by the same rules'))
  expect(who).toMatch(prose('12 of them replaced lines with a reply, so that 16 lines have none'))
  expect(who).toMatch(prose("claude-c's labeling, with claude-g's for the new lines, is the one the evaluation scores"))
  expect(who).toMatch(prose('no teammate had yet read the bank or labeled a line'))
})

test("scores the place ranker's ranking and row on all lines", () => {
  // The fixture's 6 lines with an acceptable phrase: only fixture-3's reply is among its place's first six phrases.
  expect(cells(section('### Ranking on all lines'), 'place')).toEqual([
    '0 of 6, 0% (0% to 39%)',
    '1 of 6, 17% (3% to 56%)',
    // (1/9 + 0 + 1/5 + 1/9 + 0 + 1/10) / 6
    '0.09'
  ])
  expect(section('### Ranking on all lines')).toContain("The shortlist's recall at 40: 4 of 6, 67% (30% to 90%).")
  expect(cells(section('### The row on all lines'), 'place')).toEqual([
    '0',
    '0',
    '1',
    '7',
    '0',
    '0',
    '8 of 8, 100% (68% to 100%)',
    '7 of 8, 88% (53% to 98%)'
  ])
  expect(cells(section('### The row on all lines'), 'always hold')).toEqual([
    '0',
    '0',
    '0',
    '0',
    '6',
    '2',
    '0 of 8, 0% (0% to 32%)',
    '0 of 0'
  ])
})

test("scores the keyword ranker's ranking and row on all lines", () => {
  expect(cells(section('### Ranking on all lines'), 'keyword')).toEqual([
    '3 of 6, 50% (19% to 81%)',
    '4 of 6, 67% (30% to 90%)',
    // (1 + 0 + 1 + 1 + 0 + 1/2) / 6
    '0.58'
  ])
  expect(cells(section('### The row on all lines'), 'keyword')).toEqual([
    '0',
    '0',
    '4',
    '2',
    '1',
    '1',
    '6 of 8, 75% (41% to 93%)',
    '2 of 6, 33% (9.7% to 70%)'
  ])
})

test('reports the yes-or-no, pain and consent, and no-shared-word lines apart', () => {
  expect(section('## Yes-or-no lines')).toContain('On the 3 lines')
  expect(section('## Pain and consent lines')).toContain('On the 2 lines')
  expect(section('## Lines that share no word with a reply')).toContain('On the 2 lines')
  expect(cells(section('### The row on lines that share no word with a reply'), 'keyword')?.slice(0, 6)).toEqual([
    '0',
    '0',
    '0',
    '1',
    '1',
    '0'
  ])
})

test('gives the latency of the shortlist and each ranker at the median, the 95th percentile, and the maximum', () => {
  const latency = section('## Latency')
  for (const step of ['shortlist', 'place', 'keyword']) {
    const [median, p95, max] = (cells(latency, step) ?? []).map(Number)
    expect(median, step).toBeGreaterThanOrEqual(0)
    expect(p95, step).toBeGreaterThanOrEqual(median)
    expect(max, step).toBeGreaterThanOrEqual(p95)
  }
})

test("pads every table as Prettier does, so the report passes the repo's lint", () => {
  const tables = report.split('\n\n').filter((block) => block.startsWith('|'))
  expect(tables.length).toBeGreaterThan(0)
  for (const table of tables) {
    const rows = table.trimEnd().split('\n')
    expect(new Set(rows.map((row) => row.length)).size, rows[0]).toBe(1)
    expect(rows[1], rows[0]).toMatch(/^\|( -{3,} \|)+$/)
  }
})

test("wraps its prose at 80 columns, as the repo's Markdown style asks", () => {
  const lines = report.split('\n').filter((line) => !line.startsWith('|') && !line.includes('](#'))
  for (const line of lines) expect(line.length, line).toBeLessThanOrEqual(80)
})

test('stops before scoring a line whose labels name a phrase the bank lacks', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'turn-eval-'))
  const bad = join(dir, 'lines.jsonl')
  const [first] = readFileSync(fixture, 'utf8').split('\n')
  writeFileSync(bad, first.replace('water-please', 'water-plz'))
  await expect(main(['--lines', bad, '--out', join(dir, 'results.md')])).rejects.toThrow('fixture-1 lists water-plz')
})

test('says so in a whole sentence when a group has no lines', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'turn-eval-'))
  const [water] = readFileSync(fixture, 'utf8').split('\n')
  writeFileSync(join(dir, 'lines.jsonl'), water)
  fakeServices()
  await main(['--lines', join(dir, 'lines.jsonl'), '--out', join(dir, 'results.md')])
  const one = readFileSync(join(dir, 'results.md'), 'utf8')
  expect(one).toMatch(prose('There are no lines about pain or asking for consent, which EVAL-5 names.'))
  expect(one).toMatch(
    prose('There are no lines that share no word with an acceptable reply, as the phone matches words.')
  )
  const empty = one.slice(one.indexOf('## Pain and consent lines'), one.indexOf('## Latency'))
  for (const line of empty.split('\n')) expect(line.length, line).toBeLessThanOrEqual(80)
})

test("says how the app picks each shortlist, and what that leaves of the line in the place ranker's order", () => {
  expect(report).toMatch(prose('up to 24 phrases that share a word with the line'))
  expect(report).toMatch(prose("the place's first eight phrases in the bank's order"))
  expect(report).toMatch(prose("so the place ranker's top 1 and top 6 never depend on the line"))
})

test('scores all four rankers on the same lines, in every group and step (EVAL-3)', () => {
  const rankers = ['place', 'keyword', 'embeddings', 'jev']
  for (const group of ['all lines', 'yes-or-no lines', 'pain and consent lines']) {
    for (const ranker of rankers) {
      expect(cells(section(`### Ranking on ${group}`), ranker), `${group} ${ranker}`).toHaveLength(3)
      expect(cells(section(`### The row on ${group}`), ranker), `${group} ${ranker}`).toHaveLength(8)
    }
  }
  for (const step of ['shortlist', ...rankers]) expect(cells(section('## Latency'), step), step).toHaveLength(3)
})

test("names Jev's pin, what Jev answered as, and Workers AI's model (EVAL-6)", () => {
  // 8 lines in four passes, and the stand-in counts 1,000 tokens and one more for each of 42 questions.
  expect(report).toMatch(
    prose(
      '- **Models:** Jev, pinned to `jev-1.13.0` by `worker/wrangler.jsonc`, which answered as `jev-1.13.0` on all ' +
        "32 calls, with a median of 1,042 input tokens a call; and Workers AI's `@cf/baai/bge-base-en-v1.5`, with " +
        '`cls` pooling.'
    )
  )
})

test("gives Jev minus embeddings in top 6 with its paired interval, matching the table's counts (EVAL-4)", () => {
  const ranking = section('### Ranking on all lines')
  const hits = (ranker: string) => Number(cells(ranking, ranker)?.[1].split(' ')[0])
  const gap =
    /Jev minus embeddings in top 6: ([+-]?[\d.]+) points, with a 95% paired\s+interval\s+of\s+(-?[\d.]+)\s+to\s+(-?[\d.]+),\s+so\s+([^.]+)\./
  const [, difference, low, high, verdict] = gap.exec(ranking) ?? []
  expect(Number(difference)).toBeCloseTo(((hits('jev') - hits('embeddings')) / 6) * 100, 1)
  expect(Number(low)).toBeLessThanOrEqual(Number(difference))
  expect(Number(high)).toBeGreaterThanOrEqual(Number(difference))
  const expected =
    Number(high) < 0
      ? 'Jev trails embeddings (EVAL-4)'
      : Number(low) > 0
        ? 'Jev leads embeddings'
        : "there's no clear difference"
  expect(verdict.replace(/\s+/g, ' ')).toBe(expected)
})

test("lists the embeddings ranker's five cut-offs, each chosen on the other folds", () => {
  const cutOffs = section("## The embeddings ranker's cut-offs")
  expect(cutOffs).toMatch(prose('Folds 1 to 5:'))
  expect(cutOffs.match(/\d\.\d{3}|none, holding every line/g)).toHaveLength(5)
  expect(report).toContain("1.  [The embeddings ranker's cut-offs](#the-embeddings-rankers-cut-offs)")
})

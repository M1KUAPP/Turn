import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { beforeAll, expect, test, vi } from 'vitest'
import { sentenceEmbedding } from '../src/apple'
import { brier } from '../src/calibration'
import { calibrationTable, main, rate } from '../src/report'
import { fakeSentenceEmbedding, fakeServices } from './services'

// Apple's sentence embedding runs in a Swift helper that only a Mac has, so every run here stands in for it.
vi.mock('../src/apple', async (original) => ({
  ...(await original<typeof import('../src/apple')>()),
  sentenceEmbedding: vi.fn((await import('./services')).fakeSentenceEmbedding)
}))

const fixture = fileURLToPath(new URL('fixture/lines.jsonl', import.meta.url))
let report = ''

/** What the run asked qwen3 for: each request's body. */
let qwenBodies: { queries?: string[]; documents?: string[]; instruction?: string }[] = []

let outDir = ''

beforeAll(async () => {
  const services = fakeServices()
  outDir = mkdtempSync(join(tmpdir(), 'turn-eval-'))
  const out = join(outDir, 'results.md')
  await main(['--lines', fixture, '--out', out])
  report = readFileSync(out, 'utf8')
  qwenBodies = services.mock.calls
    .filter(([url]) => String(url).endsWith('/@cf/qwen/qwen3-embedding-0.6b'))
    .map(([, init]) => JSON.parse(String(init?.body)))
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
  expect(latency).toMatch(
    prose("The apple ranker's time is this Mac's, through a pipe to its Swift helper, not the phone's.")
  )
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
  expect(one).toMatch(
    prose(
      'No ranker showed a big button on a line its writer marked yes-or-no, or on one about pain or consent, in any ' +
        'of its answers.'
    )
  )
  // Its one line's top phrase is right, so always forecasting the share would be perfect.
  expect(one).toMatch(prose('which leaves no skill score, since every line is right or none is.'))
  // One line fills one fold, so four have no lines, and the report says so rather than give their cut-offs.
  expect(one.match(/\| no lines(?= +\|)/g)).toHaveLength(16)
  const empty = one.slice(one.indexOf('## Pain and consent lines'), one.indexOf('## Latency'))
  for (const line of empty.split('\n').filter((line) => !line.startsWith('|'))) {
    expect(line.length, line).toBeLessThanOrEqual(80)
  }
})

test("says how the app picks each shortlist, and what that leaves of the line in the place ranker's order", () => {
  expect(report).toMatch(prose('up to 24 phrases that share a word with the line'))
  expect(report).toMatch(prose("the place's first eight phrases in the bank's order"))
  expect(report).toMatch(prose("so the place ranker's top 1 and top 6 never depend on the line"))
})

test('scores all seven rankers on the same lines, in every group and step (EVAL-3, EVAL-8)', () => {
  const rankers = ['place', 'keyword', 'embeddings', 'jev', 'reranker', 'qwen3', 'apple']
  for (const group of [
    'all lines',
    'yes-or-no lines',
    'pain and consent lines',
    'lines that share no word with a reply'
  ]) {
    for (const ranker of rankers) {
      expect(cells(section(`### Ranking on ${group}`), ranker), `${group} ${ranker}`).toHaveLength(3)
      expect(cells(section(`### The row on ${group}`), ranker), `${group} ${ranker}`).toHaveLength(8)
    }
  }
  for (const step of ['shortlist', ...rankers]) expect(cells(section('## Latency'), step), step).toHaveLength(3)
})

test("names Jev's pin, what Jev answered as, Workers AI's models, and Apple's embedding (EVAL-6)", () => {
  // 8 lines in four passes.
  expect(report).toMatch(
    prose(
      '- **Models:** Jev, pinned to `jev-1.13.0` by `worker/wrangler.jsonc`, which answered as `jev-1.13.0` on all ' +
        "32 calls; Workers AI's `@cf/baai/bge-base-en-v1.5`, with `cls` pooling, `@cf/baai/bge-reranker-base`, and " +
        '`@cf/qwen/qwen3-embedding-0.6b`, with the instruction "Given what a conversation partner just said, ' +
        'retrieve the reply that answers it"; and Apple\'s English sentence embedding at revision 1, of 512 numbers, ' +
        'on macOS 27.0 (Build 26A428).'
    )
  )
})

test("gives Jev minus embeddings in top 6 with its paired interval, matching the table's counts (EVAL-4)", () => {
  const ranking = section('### Ranking on all lines')
  const hits = (ranker: string) => Number(cells(ranking, ranker)?.[1].split(' ')[0])
  const number = '(-?[+]?[\\d.]+)'
  const gap = new RegExp(
    `Jev minus embeddings in top 6: ${number} points, with a 95% paired\\s+interval\\s+of\\s+${number}\\s+to\\s+` +
      `${number},\\s+so\\s+([^.]+)\\.`
  )
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

test("gives EVAL-4's verdict on all lines alone, and each subset's interval without one", () => {
  expect(section('### Ranking on all lines')).toMatch(prose(', so there'))
  for (const group of ['yes-or-no lines', 'pain and consent lines']) {
    const ranking = section(`### Ranking on ${group}`)
    expect(ranking, group).toMatch(prose('Jev minus embeddings in top 6:'))
    expect(ranking, group).not.toMatch(/, so\s/)
  }
})

test('lists the five cut-offs of each ranker whose scores need one, each chosen on the other folds', () => {
  const cutOffs = section('## The cut-offs for holding')
  // The fixture's 8 lines, dealt round, make folds of 2, 2, 2, 1, and 1.
  expect(cutOffs).toMatch(prose('folds 1 to 5 held 2, 2, 2, 1, and 1 lines.'))
  for (const ranker of ['embeddings', 'reranker', 'qwen3', 'apple']) {
    const values = cells(cutOffs, ranker) ?? []
    expect(values, ranker).toHaveLength(5)
    for (const value of values) expect(value, ranker).toMatch(/^(\d\.\d\d+|\d\.\d+e-\d+|hold all)$/)
  }
  // The stand-in reranker's scores are cosines over 1,000, so its cut-offs keep three figures past their zeros.
  expect(cells(cutOffs, 'reranker')?.filter((value) => /^0\.000\d{3}$/.test(value)).length).toBeGreaterThan(0)
  expect(cells(cutOffs, 'place')).toBeUndefined()
  expect(cells(cutOffs, 'jev')).toBeUndefined()
  expect(report).toContain('1.  [The cut-offs for holding](#the-cut-offs-for-holding)')
})

test('lists every big button on a yes-or-no, pain, or consent line, and whether it was right (EVAL-5)', () => {
  const shown = section('## Big buttons on yes-or-no, pain, and consent lines')
  // The stand-in calls fixture-2 an open question and scores the phrase sharing "hurt" 0.9; on the yes-or-no lines it
  // brings the fixed buttons instead, and no other ranker shows a big button.
  expect(shown).toMatch(prose('or on one about pain or consent, in any of its answers (EVAL-5): 1, 1 of them wrong.'))
  expect(cells(shown, 'jev')).toEqual([
    'fixture-2',
    'Where does it hurt the most?',
    'Is this going to hurt?',
    'wrong',
    '4 of 4'
  ])
})

test("escapes a pipe in a line's text, so the big buttons' table keeps its columns", async () => {
  const dir = mkdtempSync(join(tmpdir(), 'turn-eval-'))
  const pain = readFileSync(fixture, 'utf8').split('\n')[1].replace('hurt the most', 'hurt | the most')
  writeFileSync(join(dir, 'lines.jsonl'), pain)
  fakeServices()
  await main(['--lines', join(dir, 'lines.jsonl'), '--out', join(dir, 'results.md')])
  expect(readFileSync(join(dir, 'results.md'), 'utf8')).toContain('| Where does it hurt \\| the most? |')
})

test("gives Jev's question kind against its writer's, as accuracy and a confusion matrix", () => {
  const kind = section('## The question kind')
  // The stand-in calls a line yes-or-no when the phone would and open otherwise: right on the three yes-or-no lines
  // and the two open ones, but "Do you want to pay by card or cash?" isn't yes-or-no, and neither statement is open.
  expect(kind).toMatch(prose(`on all 8 lines: right on ${rate({ k: 5, n: 8 })}.`))
  expect(cells(kind, 'Yes or no')).toEqual(['3', '0', '0', '0', '0'])
  expect(cells(kind, 'Either or')).toEqual(['1', '0', '0', '0', '0'])
  expect(cells(kind, 'Open')).toEqual(['0', '0', '2', '0', '0'])
  expect(cells(kind, 'Not a question')).toEqual(['0', '0', '2', '0', '0'])
})

test("plots every ranker's risk against its coverage beside the report, with a table as its text", async () => {
  const curves = section('## Risk and coverage')
  expect(curves).toContain('![Risk against coverage for each ranker](results-risk-coverage.svg)')
  expect(readFileSync(join(outDir, 'results-risk-coverage.svg'), 'utf8').match(/<polyline /g)).toHaveLength(7)
  // place covers every line at once, 7 of its 8 rows wrong, as the row's table says.
  expect(cells(curves, 'place')).toEqual(Array(5).fill('88% at 100%'))
  for (const ranker of ['keyword', 'embeddings', 'jev', 'reranker', 'qwen3', 'apple']) {
    expect(cells(curves, ranker), ranker).toHaveLength(5)
  }
})

test("names Jev nowhere with --unnamed, calling it the hosted decision model with its pin's version", async () => {
  const dir = mkdtempSync(join(tmpdir(), 'turn-eval-'))
  fakeServices()
  await main(['--lines', fixture, '--out', join(dir, 'results.md'), '--unnamed'])
  const unnamed = readFileSync(join(dir, 'results.md'), 'utf8')
  const plotted = readFileSync(join(dir, 'results-risk-coverage.svg'), 'utf8')
  const calibrated = readFileSync(join(dir, 'results-reliability.svg'), 'utf8')
  for (const text of [unnamed, plotted, calibrated]) expect(text).not.toMatch(/jev|typesafe/i)
  expect(unnamed).toContain("## The hosted decision model's calibration")
  // Named mid-sentence in lower case, and capitalized only where a sentence or a label starts.
  expect(unnamed).toContain("![Reliability of the hosted decision model's top phrase](results-reliability.svg)")
  expect(calibrated).toContain("<title>Reliability of the hosted decision model's top phrase</title>")
  expect(calibrated).toContain("<desc>The hosted decision model's top score against")
  expect(calibrated).toContain(">The hosted decision model's top score</text>")
  expect(unnamed).toMatch(prose('- **Models:** The hosted decision model, pinned to version 1.13.0 by'))
  expect(unnamed).toMatch(prose('which answered as version 1.13.0 on all 32 calls'))
  expect(unnamed).toMatch(prose('The hosted decision model minus embeddings in top 6:'))
  // Its first row, in the ranking on all lines.
  expect(cells(unnamed, 'hosted decision model')).toHaveLength(3)
  expect(plotted).toContain('>hosted decision model</text>')
})

test('names no model even when Jev reports one in other words, and counts a single call as one', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'turn-eval-'))
  // Jev's first call answers as a model whose name has capitals and another word in it.
  fakeServices((call) => (call === 0 ? 'TypeSafe Jev-1.14.0' : undefined))
  await main(['--lines', fixture, '--out', join(dir, 'results.md'), '--unnamed'])
  const unnamed = readFileSync(join(dir, 'results.md'), 'utf8')
  expect(unnamed).not.toMatch(/jev|typesafe/i)
  expect(unnamed).toMatch(prose('which answered as version 1.14.0 on 1 call and version 1.13.0 on 31 calls'))
})

test('wraps the Lines line, so only a path too long for any line runs past 80 columns', async () => {
  const dir = join(
    mkdtempSync(join(tmpdir(), 'turn-eval-')),
    'a-folder-whose-name-is-long-enough-to-push-the-path-past-80'
  )
  mkdirSync(dir)
  writeFileSync(join(dir, 'lines.jsonl'), readFileSync(fixture, 'utf8'))
  fakeServices()
  await main(['--lines', join(dir, 'lines.jsonl'), '--out', join(dir, 'results.md')])
  const long = readFileSync(join(dir, 'results.md'), 'utf8')
    .split('\n')
    .filter((line) => line.length > 80 && !line.startsWith('|') && !line.includes('](#'))
  expect(long).toEqual([`  \`${join(dir, 'lines.jsonl')}\`.`])
})

test('lists every section in its contents, in order, and nothing else', () => {
  const contents = [...report.matchAll(/^1\.  \[(.+)\]\(#.+\)$/gm)].map(([, heading]) => heading)
  expect(contents).toEqual([...report.matchAll(/^## (.+)$/gm)].map(([, heading]) => heading))
  expect(contents).toHaveLength(11)
})

test("draws Jev's reliability diagram beside the report, its blocks as its text, and the Brier score (EVAL-8)", () => {
  const calibration = section("## Jev's calibration")
  expect(calibration).toContain("![Reliability of Jev's top phrase](results-reliability.svg)")
  expect(readFileSync(join(outDir, 'results-reliability.svg'), 'utf8')).toContain(
    "<title>Reliability of Jev's top phrase</title>"
  )
  // Every line shares a word with some phrase, which the stand-in scores 0.9, so every top score is 0.9: right on
  // fixture-1, 3, and 6, and wrong on the other five. Eight lines drawn at 0.9 as if calibrated put the fit's 5th and
  // 95th percentiles at 6 and 8 of 8, so 3 of 8 lies outside the band at its one score.
  expect(cells(calibration, '0.9')).toEqual(['8', '3', '0.38', '1 of 1 score'])
  expect(calibration).toMatch(prose('on all 8 lines: 3 of them are.'))
  // fixture-4 and fixture-5 have no reply, and the 40 miss the replies of 2 of the 6 lines with one besides Yes, No,
  // and Not sure, as the shortlist's recall of 4 of 6 says.
  expect(calibration).toMatch(prose('Of the 8, 4 have no acceptable phrase among their 40, so their top phrase is'))
  // (3 × 0.1² + 5 × 0.9²) / 8; always 3/8 scores 3/8 × 5/8, and so does the fit, which is 3/8 on every line.
  expect(calibration).toMatch(prose('is 0.510, with a 95% bootstrap interval of'))
  // The interval of those forecasts, in the file's order, which the resamples draw from.
  const { low, high } = brier(
    [true, false, true, false, false, true, false, false].map((right) => ({ score: 0.9, right }))
  )
  expect(calibration).toMatch(prose(`interval of ${low.toFixed(3)} to ${high.toFixed(3)}; lower is better.`))
  expect(calibration).toMatch(prose('Always forecasting the share acceptable, 3 of 8, would score 0.234, so the'))
  // 1 − 0.510 / 0.234375.
  expect(calibration).toMatch(prose('skill score, 1 minus the Brier score over that, is -1.176: above 0 beats'))
  expect(calibration).toMatch(prose('a miscalibration of 0.276 and a discrimination of 0.000: before rounding,'))
  expect(calibration).toMatch(prose("so even a calibrated ranker's fit would lie outside it at about one score in ten"))
})

test("sends each line to qwen3 as a query under the TRD's instruction, and the phrases as documents", () => {
  const instruction = 'Given what a conversation partner just said, retrieve the reply that answers it'
  const queried = qwenBodies.filter((body) => body.queries)
  // Each of the 8 lines in four passes, the warm-up's included.
  expect(queried).toHaveLength(32)
  for (const body of queried) expect(body).toEqual({ queries: [expect.any(String)], instruction })
  const texts = readFileSync(fixture, 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line).text)
  expect(new Set(queried.flatMap((body) => body.queries))).toEqual(new Set(texts))
  const documents = qwenBodies.filter((body) => body.documents)
  expect(documents.length).toBeGreaterThan(0)
  for (const body of documents) expect(body.instruction).toBeUndefined()
})

test('gives each block of the fit its scores, lines, acceptable lines, share, and scores outside the band', () => {
  const forecasts = [0.2, 0.2, 0.5, 0.7, 0.7, 0.9].map((score, i) => ({ score, right: [0, 2, 5].includes(i) }))
  const band = [
    { score: 0.2, low: 0.1, high: 0.3 },
    { score: 0.5, low: 0.35, high: 0.6 },
    { score: 0.7, low: 0.5, high: 0.9 },
    { score: 0.9, low: 0.8, high: 1 }
  ]
  // PAV pools 0.2 to 0.7 into one block of 2 in 5, which lies above the band at 0.2 and below it at 0.7.
  const blocks = [
    { low: 0.2, high: 0.7, lines: 5, right: 2, value: 0.4 },
    { low: 0.9, high: 0.9, lines: 1, right: 1, value: 1 }
  ]
  const rows = calibrationTable({ forecasts, blocks, band }).split('\n').slice(2)
  expect(cells(rows.join('\n'), '0.2 to 0.7')).toEqual(['5', '2', '0.40', '2 of 3 scores'])
  expect(cells(rows.join('\n'), '0.9')).toEqual(['1', '1', '1.00', '0 of 1 score'])
})

test("closes Apple's helper even when a ranker fails", async () => {
  const embedding = await fakeSentenceEmbedding()
  const close = vi.spyOn(embedding, 'close')
  vi.mocked(sentenceEmbedding).mockResolvedValueOnce(embedding)
  // No stand-in for the services, so the embeddings ranker's first request fails.
  const out = join(mkdtempSync(join(tmpdir(), 'turn-eval-')), 'results.md')
  await expect(main(['--lines', fixture, '--out', out])).rejects.toThrow('This test called fetch without mocking it')
  expect(close).toHaveBeenCalledOnce()
})

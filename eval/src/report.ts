import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { linesFrom, phrases, root, type Line } from './data'
import { listOf, wrap } from './prose'
import { keyword, place } from './rankers'
import { outcomes, scoreLines, sharesNoWord, summarize, type Count, type LineScore } from './score'
import { percentile, wilson } from './stats'

const rankers = { place, keyword }

/** A share as the TRD writes one: in whole percents at or above 10%, and to one decimal below. */
const percent = (share: number) => {
  const points = share * 100
  return `${points >= 10 ? Math.round(points) : Math.round(points * 10) / 10}%`
}

/** A rate with its 95% Wilson interval, such as "56 of 80, 70% (59% to 79%)", or "0 of 0" over no lines. */
export const rate = ({ k, n }: Count): string => {
  const interval = wilson(k, n)
  if (interval === null) return '0 of 0'
  return `${k} of ${n}, ${percent(k / n)} (${percent(interval.low)} to ${percent(interval.high)})`
}

/** A Markdown table, padded as Prettier pads one, so the report passes the repo's lint. */
const table = (header: readonly string[], rows: readonly (readonly string[])[]) => {
  const widths = header.map((cell, i) => Math.max(3, cell.length, ...rows.map((row) => row[i].length)))
  const line = (cells: readonly string[]) => `| ${cells.map((cell, i) => cell.padEnd(widths[i])).join(' | ')} |`
  return [line(header), line(widths.map((width) => '-'.repeat(width))), ...rows.map(line)].join('\n')
}

/** Who wrote and labeled the lines, counted from the file, then who made the 80 lines and the bank, as the TRD says. */
const provenance = (labeled: readonly Line[]) => {
  const authors = Map.groupBy(labeled, (line) => line.author)
  const writers = listOf([...authors].map(([author, written]) => `${author} wrote ${written.length}`))
  const labelers = listOf([...new Set(labeled.map((line) => line.labeler))])
  return [
    '## Who wrote the data',
    [
      wrap(`- **These lines:** ${writers}, and ${labelers} labeled their acceptable replies.`, '  '),
      wrap(
        "- **The 80 lines, their labels, and the bank,** as the TRD's evaluation data records: at the team's " +
          'direction, Claude subagents wrote the 80 lines and the starter bank on September 23, 2026. Two wrote 40 ' +
          "lines each from a brief that showed no phrase of the bank, so each line's author is claude-a or " +
          'claude-b; a third wrote the bank without seeing the lines, and a fourth read every phrase. Two more, ' +
          "claude-c and claude-d, then labeled every line's replies, each alone and from a brief that set no " +
          "quota; claude-c's labeling is the one the evaluation scores. Text a language model wrote or labeled may " +
          'suit a ranker built on one, and two labelings by one model show consistency rather than correctness. On ' +
          'that date, no teammate had yet read the bank or labeled a line, and no clinic had reviewed the bank.',
        '  '
      )
    ].join('\n')
  ]
}

/** One group's ranking and row, with each rate's interval. */
const groupSections = (name: string, about: string, scores: readonly LineScore<Line>[]) => {
  const lower = name[0].toLowerCase() + name.slice(1)
  if (scores.length === 0) return [`## ${name}`, wrap(`There are no lines ${about}.`)]
  const summary = summarize(scores)
  const names = Object.keys(rankers)
  const ranking =
    summary.recall.n === 0
      ? ['None of them has an acceptable phrase besides Yes, No, and Not sure.']
      : [
          wrap(`On the ${summary.recall.n} with an acceptable phrase besides Yes, No, and Not sure:`),
          table(
            ['Ranker', 'Top 1', 'Top 6', 'Mean reciprocal rank'],
            [
              [
                'chance',
                percent(summary.chance.top1),
                percent(summary.chance.top6),
                summary.chance.meanReciprocalRank.toFixed(2)
              ],
              ...names.map((ranker) => {
                const { top1, top6, meanReciprocalRank } = summary.rankers[ranker]
                return [ranker, rate(top1), rate(top6), meanReciprocalRank.toFixed(2)]
              })
            ]
          ),
          wrap(`The shortlist's recall at 40: ${rate(summary.recall)}.`)
        ]
  const capitalized = outcomes.map((outcome) => outcome[0].toUpperCase() + outcome.slice(1))
  const row = table(
    ['Ranker', ...capitalized, 'Coverage', 'Risk'],
    [
      [
        'always hold',
        ...outcomes.map((outcome) => String(summary.alwaysHold[outcome])),
        rate({ k: 0, n: summary.lines }),
        rate({ k: 0, n: 0 })
      ],
      ...names.map((ranker) => {
        const { outcomes: seen, coverage, risk } = summary.rankers[ranker]
        return [ranker, ...outcomes.map((outcome) => String(seen[outcome])), rate(coverage), rate(risk)]
      })
    ]
  )
  return [
    `## ${name}`,
    wrap(`On the ${summary.lines} lines ${about}.`),
    `### Ranking on ${lower}`,
    ...ranking,
    `### The row on ${lower}`,
    row
  ]
}

/** The report for the lines, in Markdown, scored with the app's own shortlist, rankers, and row rules. */
const render = (labeled: readonly Line[], { run, file }: { run: string; file: string }) => {
  const { lines: scores, timings } = scoreLines(labeled, phrases, rankers)
  const groups = [
    { name: 'All lines', about: 'in the file', keep: () => true },
    {
      name: 'Yes-or-no lines',
      about: 'that their writer marked yes-or-no',
      keep: (line: Line) => line.kind === 'yes_no'
    },
    {
      name: 'Pain and consent lines',
      about: 'about pain or asking for consent, which EVAL-5 names',
      keep: (line: Line) => line.concerns.includes('pain') || line.concerns.includes('consent')
    },
    {
      name: 'Lines that share no word with a reply',
      about: 'that share no word with an acceptable reply, as the phone matches words',
      keep: (line: Line) => sharesNoWord(line, phrases)
    }
  ]
  const steps: [string, number[]][] = [['shortlist', timings.shortlist], ...Object.entries(timings.rankers)]
  const latency = table(
    ['Step', 'Median', '95th percentile', 'Maximum'],
    steps.map(([step, samples]) => [step, ...[50, 95, 100].map((q) => percentile(samples, q).toFixed(3))])
  )
  const slug = (heading: string) => heading.toLowerCase().replaceAll(' ', '-')
  const sections = ['Who wrote the data', ...groups.map(({ name }) => name), 'Latency']
  return (
    [
      "# Turn's evaluation",
      [
        `- **Run:** ${run}.`,
        `- **Lines:** the ${labeled.length} in \`${file}\`.`,
        "- **Bank:** the app's own, `app/src/content/starter-bank.json`."
      ].join('\n'),
      wrap(
        'Each line is scored alone, from an empty row. The app picks its shortlist of 40: up to 24 phrases that ' +
          "share a word with the line, then, since a fresh bank has no taps, the place's first eight phrases in the " +
          "bank's order, then the rest in the bank's order. Each ranker orders those 40, and the row's rules turn " +
          "its ranking into what the user would see. The place's first eight phrases are always among the 40, so " +
          "the place ranker's top 1 and top 6 never depend on the line, though which of its later phrases are " +
          'among them can.'
      ),
      [
        '- **Ranking:** top 1 and top 6 count the lines with an acceptable phrase first or among the first six. ' +
          'A ranker ranks only the phrases it scores above 0, so keyword ranks none on a line that shares no word. ' +
          'Chance is a random order of the same phrases. The mean reciprocal rank is a mean of ranks, not a rate, ' +
          'so it has no interval.',
        '- **The row:** coverage is the share of lines where the row changes, and risk the share of those rows ' +
          'that are wrong. Always holding is right on every line with no acceptable reply.',
        '- **Intervals:** every rate carries its 95% Wilson interval.'
      ]
        .map((item) => wrap(item, '  '))
        .join('\n'),
      'Contents:',
      sections.map((heading) => `1.  [${heading}](#${slug(heading)})`).join('\n'),
      ...provenance(labeled),
      ...groups.flatMap(({ name, about, keep }) =>
        groupSections(
          name,
          about,
          scores.filter(({ line }) => keep(line))
        )
      ),
      '## Latency',
      wrap(
        'Milliseconds per line over three passes, after a warm-up pass: the app picking the shortlist, then each ' +
          "ranker's ranking and the row's rules."
      ),
      latency
    ].join('\n\n') + '\n'
  )
}

/** The commit the run is on, marked when the working tree has changes the commit lacks. */
const commit = () => {
  const git = (...args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
  const hash = git('rev-parse', '--short', 'HEAD')
  try {
    git('diff', '--quiet', 'HEAD')
    return `\`${hash}\``
  } catch {
    return `\`${hash}\` with uncommitted changes`
  }
}

/**
 * `bun run eval`: scores the place and keyword rankers on the labeled lines in `eval/lines.jsonl`, or the file
 * `--lines` names, and writes the report to `eval/results.md`, or the file `--out` names (EVAL-3).
 */
export function main(args: readonly string[]): void {
  const { values } = parseArgs({ args: [...args], options: { lines: { type: 'string' }, out: { type: 'string' } } })
  const { lines: labeled, file } = linesFrom(values.lines)
  const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date())
  const out = values.out ?? fileURLToPath(new URL('../results.md', import.meta.url))
  writeFileSync(out, render(labeled, { run: `${date}, at commit ${commit()}`, file }))
  console.log(`Wrote ${values.out ?? 'eval/results.md'}`)
}

if (import.meta.main) main(process.argv.slice(2))

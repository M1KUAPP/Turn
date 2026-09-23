import { fixedButtons } from '@turn/shared/row'
import { rankable } from '@turn/shared/shortlist'
import { parseArgs } from 'node:util'
import { compareLabelings } from './agreement'
import { checkLabels, linesFrom, phrases, readRows, secondLabeling, type Labels, type Line } from './data'
import { sharesNoWord } from './score'

/** Three decimals, so a negative agreement of 0.996 doesn't print as a perfect 1.00. */
const three = (value: number) => value.toFixed(3)
const names = (labelers: readonly string[]) => [...new Set(labelers)].join(' and ')

/**
 * `bun run eval:count`: checks EVAL-1's quotas on the labeled lines in `eval/lines.jsonl`, or the file `--lines`
 * names, and prints the labelers' agreement with the second labeling in `eval/second-labeling.jsonl`, or the file
 * `--second` names. It returns the exit code: 1 when a quota falls short.
 */
export function main(args: readonly string[]): number {
  const { values } = parseArgs({ args: [...args], options: { lines: { type: 'string' }, second: { type: 'string' } } })
  const { lines, file } = linesFrom(values.lines)
  const second: Labels[] = values.second === undefined ? secondLabeling : readRows(values.second)
  checkLabels(second)
  const count = (keep: (line: Line) => boolean) => lines.filter(keep).length
  const atLeast = (what: string, least: number, keep: (line: Line) => boolean) => {
    const found = count(keep)
    return { what, found, want: `at least ${least}`, met: found >= least }
  }
  const quotas = [
    { what: 'lines', found: lines.length, want: 'exactly 80', met: lines.length === 80 },
    atLeast('with no acceptable reply', 16, (line) => line.acceptable.length === 0),
    atLeast('yes-or-no', 24, (line) => line.kind === 'yes_no'),
    atLeast('about pain or health', 8, (line) => line.concerns.includes('pain') || line.concerns.includes('health')),
    atLeast('asking for consent', 4, (line) => line.concerns.includes('consent')),
    atLeast('sharing no word with a reply', 10, (line) => sharesNoWord(line, phrases))
  ]
  // The pairs are each line and every phrase the row can rank, with the fixed buttons on a yes-or-no line.
  const rankableIds = phrases.filter(rankable).map(({ id }) => id)
  const secondById = new Map(second.map((labels) => [labels.id, labels]))
  const { noneOrSome, pairs, alpha } = compareLabelings(
    lines.map((line) => {
      const labels = secondById.get(line.id)
      if (labels === undefined) throw new Error(`${line.id} has no second labeling`)
      const candidates = line.kind === 'yes_no' ? [...fixedButtons, ...rankableIds] : rankableIds
      return { first: line.acceptable, second: labels.acceptable, candidates }
    })
  )
  console.log(
    [
      `EVAL-1's quotas, on the ${lines.length} lines in ${file}:`,
      ...quotas.map(({ what, found, want, met }) => `- ${found} ${what}, of ${want}: ${met ? 'met' : 'not met'}`),
      '',
      `The labelers' agreement, ${names(lines.map(({ labeler }) => labeler))}'s labels against ` +
        `${names(second.map(({ labeler }) => labeler))}'s:`,
      `- Some replies or none, on ${lines.length} lines: both some on ${noneOrSome.a}, only the first on ` +
        `${noneOrSome.b}, only the second on ${noneOrSome.c}, and both none on ${noneOrSome.d}; agreement ` +
        `${three(noneOrSome.percent)}, Cohen's kappa ${three(noneOrSome.kappa)}, positive agreement ` +
        `${three(noneOrSome.positive)}, and negative agreement ${three(noneOrSome.negative)}.`,
      `- Each line and candidate phrase, on ${pairs.a + pairs.b + pairs.c + pairs.d} pairs: both on ${pairs.a}, ` +
        `only the first on ${pairs.b}, only the second on ${pairs.c}, and neither on ${pairs.d}; positive agreement ` +
        `${three(pairs.positive)}, and negative agreement ${three(pairs.negative)} and Cohen's kappa ${three(pairs.kappa)}, ` +
        "which move with the pairs' count.",
      `- Krippendorff's alpha with the MASI distance over each line's replies: ${three(alpha)}.`
    ].join('\n')
  )
  return quotas.every(({ met }) => met) ? 0 : 1
}

if (import.meta.main) process.exitCode = main(process.argv.slice(2))

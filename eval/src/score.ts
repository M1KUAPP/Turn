import { applyAnswer, emptyRow, fixedButtons, startingPolicy, type Row } from '@turn/shared/row'
import { PhraseIndex, pickShortlist, type Phrase } from '@turn/shared/shortlist'
import type { Ranker } from './rankers'
import { chanceHit, chanceReciprocalRank } from './stats'

/** What scoring reads from a labeled partner line: the ids of every acceptable reply, or none. */
export type ScoredLine = { text: string; place: string; acceptable: readonly string[] }

/** What the user would see after a line, by whether it has an acceptable reply (EVAL-3). */
export const outcomes = [
  'right big button',
  'wrong big button',
  'right row',
  'wrong row',
  'missed reply',
  'right hold'
] as const
export type Outcome = (typeof outcomes)[number]

/** One line, scored: its shortlist's ids and, per ranker, its order over them and what the user would see. */
export type LineScore<Line extends ScoredLine> = {
  line: Line
  shortlist: string[]
  rankers: Record<string, { order: string[]; outcome: Outcome }>
}

/** A count of k lines out of n, for a rate. */
export type Count = { k: number; n: number }

/** The row's answer carries sequence number 1, so a row still answering line 0, the empty row's, has held. */
const seq = 1

const outcomeOf = (row: Row, acceptable: ReadonlySet<string>): Outcome => {
  if (row.answers < seq) return acceptable.size === 0 ? 'right hold' : 'missed reply'
  if (row.big !== null) return acceptable.has(row.big) ? 'right big button' : 'wrong big button'
  return row.slots.some((id) => id !== null && acceptable.has(id)) ? 'right row' : 'wrong row'
}

/** Runs the work, adding how long it took, in milliseconds, to the samples. */
const time = <T>(samples: number[], work: () => T): T => {
  const start = performance.now()
  const result = work()
  samples.push(performance.now() - start)
  return result
}

/**
 * Scores each line alone, as the app would from an empty row, with the line's place and a fresh bank's lack of taps:
 * picks its shortlist, has each ranker rank it, and applies the row's rules with their starting policy. It times the
 * shortlist and each ranker's ranking and rules over three passes, one line at a time, after a warm-up pass it leaves
 * out, since Bun and Node compile hot code as it runs.
 */
export function scoreLines<Line extends ScoredLine>(
  lines: readonly Line[],
  bank: readonly Phrase[],
  rankers: Readonly<Record<string, Ranker>>
) {
  const index = new PhraseIndex()
  const names = Object.keys(rankers)
  const pass = () => {
    const timings = {
      shortlist: [] as number[],
      rankers: Object.fromEntries(names.map((name) => [name, [] as number[]]))
    }
    const scored = lines.map((line): LineScore<Line> => {
      const context = { bank, row: [], place: line.place, taps: new Map<string, number>() }
      const shortlist = time(timings.shortlist, () => pickShortlist(line.text, index, context))
      const acceptable = new Set(line.acceptable)
      const byRanker = names.map((name) => {
        const { ranking, row } = time(timings.rankers[name], () => {
          const ranking = rankers[name](line.text, shortlist, index, context)
          return { ranking, row: applyAnswer(emptyRow, { ...ranking, seq, policy: startingPolicy }) }
        })
        // A stable sort, so the ranking's own order breaks ties.
        const order = [...ranking.scores].sort(([, a], [, b]) => b - a).map(([id]) => id)
        return [name, { order, outcome: outcomeOf(row, acceptable) }] as const
      })
      return { line, shortlist: shortlist.map((phrase) => phrase.id), rankers: Object.fromEntries(byRanker) }
    })
    return { lines: scored, timings }
  }
  // The warm-up pass, whose timings are left out.
  pass()
  const passes = [pass(), pass(), pass()]
  return {
    lines: passes[0].lines,
    timings: {
      shortlist: passes.flatMap(({ timings }) => timings.shortlist),
      rankers: Object.fromEntries(names.map((name) => [name, passes.flatMap(({ timings }) => timings.rankers[name])]))
    }
  }
}

const mean = (values: readonly number[]) => values.reduce((sum, value) => sum + value, 0) / values.length
/** How many lines saw each outcome, naming every outcome. */
const tally = (seen: readonly Outcome[]) => {
  const counts = Object.fromEntries(outcomes.map((outcome) => [outcome, 0])) as Record<Outcome, number>
  for (const outcome of seen) counts[outcome] += 1
  return counts
}

/**
 * Sums up a group of scored lines. The ranking counts only lines with an acceptable phrase besides the fixed buttons,
 * which no ranker orders; its means over no such lines are NaN. The row counts every line.
 */
export function summarize<Line extends ScoredLine>(scores: readonly LineScore<Line>[]) {
  const ranked = scores
    .map((score) => ({ ...score, phrases: new Set(score.line.acceptable.filter((id) => !fixedButtons.includes(id))) }))
    .filter(({ phrases }) => phrases.size > 0)
  const inShortlist = ranked.map(({ shortlist, phrases }) => shortlist.filter((id) => phrases.has(id)).length)
  const names = Object.keys(scores[0]?.rankers ?? {})
  return {
    lines: scores.length,
    recall: { k: inShortlist.filter((g) => g > 0).length, n: ranked.length },
    chance: {
      top1: mean(ranked.map(({ shortlist }, i) => chanceHit(shortlist.length, inShortlist[i], 1))),
      top6: mean(ranked.map(({ shortlist }, i) => chanceHit(shortlist.length, inShortlist[i], 6))),
      meanReciprocalRank: mean(ranked.map(({ shortlist }, i) => chanceReciprocalRank(shortlist.length, inShortlist[i])))
    },
    alwaysHold: tally(scores.map(({ line }) => (line.acceptable.length === 0 ? 'right hold' : 'missed reply'))),
    rankers: Object.fromEntries(
      names.map((name) => {
        const firstHit = ranked.map(({ rankers, phrases }) => rankers[name].order.findIndex((id) => phrases.has(id)))
        const seen = tally(scores.map(({ rankers }) => rankers[name].outcome))
        const wrong = seen['wrong big button'] + seen['wrong row']
        const changed = wrong + seen['right big button'] + seen['right row']
        return [
          name,
          {
            top1: { k: firstHit.filter((i) => i === 0).length, n: ranked.length },
            top6: { k: firstHit.filter((i) => i >= 0 && i < 6).length, n: ranked.length },
            meanReciprocalRank: mean(firstHit.map((i) => (i < 0 ? 0 : 1 / (i + 1)))),
            outcomes: seen,
            coverage: { k: changed, n: scores.length },
            risk: { k: wrong, n: changed }
          }
        ]
      })
    )
  }
}

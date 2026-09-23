import { applyAnswer, emptyRow, fixedButtons, startingPolicy, type Ranking, type Row } from '@turn/shared/row'
import { PhraseIndex, pickShortlist, type Phrase } from '@turn/shared/shortlist'
import { crossValidate, folds } from './cut-off'
import type { CutOff, Ranker } from './rankers'
import { chanceHit, chanceReciprocalRank, mean, pairedBootstrap } from './stats'

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

/**
 * One line, scored: its shortlist's ids and, per ranker, its ranking, its order over the phrases it scored above 0,
 * the row the rules made of it, and what the user would see.
 */
export type LineScore<Line extends ScoredLine> = {
  line: Line
  shortlist: string[]
  rankers: Record<string, { ranking: Ranking; order: string[]; row: Row; outcome: Outcome }>
}

/** A count of k lines out of n, for a rate. */
export type Count = { k: number; n: number }

/**
 * Every line's score, each step's timings in milliseconds (the shortlist's and each ranker's), and, for a ranker with a
 * cross-validated cut-off, each fold's.
 */
export type Scores<Line extends ScoredLine> = {
  lines: LineScore<Line>[]
  timings: { shortlist: number[]; rankers: Record<string, number[]> }
  cutOffs: Record<string, number[]>
}

/** One ranker over a group of lines: its ranking, and what the user would see. */
export type RankerSummary = {
  top1: Count
  top6: Count
  meanReciprocalRank: number
  outcomes: Record<Outcome, number>
  coverage: Count
  risk: Count
}

/** A group of lines, summed up for each ranker, beside chance, the shortlist's recall, and always holding. */
export type Summary = {
  lines: number
  recall: Count
  chance: { top1: number; top6: number; meanReciprocalRank: number }
  alwaysHold: Record<Outcome, number>
  rankers: Record<string, RankerSummary>
}

/** The row's answer carries sequence number 1, so a row still answering line 0, the empty row's, has held. */
const seq = 1

const outcomeOf = (row: Row, acceptable: ReadonlySet<string>): Outcome => {
  if (row.answers < seq) return acceptable.size === 0 ? 'right hold' : 'missed reply'
  if (row.big !== null) return acceptable.has(row.big) ? 'right big button' : 'wrong big button'
  return row.slots.some((id) => id !== null && acceptable.has(id)) ? 'right row' : 'wrong row'
}

/** Runs the work and waits for it, adding how long it took, in milliseconds, to the samples. */
const time = async <T>(samples: number[], work: () => T | Promise<T>): Promise<T> => {
  const start = performance.now()
  const result = await work()
  samples.push(performance.now() - start)
  return result
}

/** The row the rules make of one line's ranking, from an empty row, with their starting policy. */
const rowFor = (ranking: Ranking): Row => applyAnswer(emptyRow, { ...ranking, seq, policy: startingPolicy })

/** A ranking's top score, which a cut-off compares. */
const top = (ranking: Ranking) => Math.max(...ranking.scores.values())

/**
 * Scores each line alone, as the app would from an empty row, with the line's place and a fresh bank's lack of taps:
 * picks its shortlist, has each ranker rank it, one ranking at a time, and applies the row's rules with their starting
 * policy once every line is ranked. It times the shortlist and each ranking, a network trip included, over three
 * passes, after a warm-up pass it leaves out, since Bun and Node compile hot code as it runs and a first call opens its
 * connection; the lines are scored from the first of the three.
 *
 * A ranker with a cut-off is scored out of fold: five folds, stratified on whether a line has an acceptable reply, and
 * each fold's lines at the cut-off that made the most of the other four folds' lines right (EVAL-2).
 */
export async function scoreLines<Line extends ScoredLine>(
  lines: readonly Line[],
  bank: readonly Phrase[],
  rankers: Readonly<Record<string, Ranker>>,
  cutOffs: Readonly<Record<string, CutOff>> = {}
): Promise<Scores<Line>> {
  const index = new PhraseIndex()
  const names = Object.keys(rankers)
  const pass = async () => {
    const timings = {
      shortlist: [] as number[],
      rankers: Object.fromEntries(names.map((name) => [name, [] as number[]]))
    }
    const ranked: { line: Line; shortlist: Phrase[]; rankings: Record<string, Ranking> }[] = []
    for (const line of lines) {
      const context = { bank, row: [], place: line.place, taps: new Map<string, number>() }
      const shortlist = await time(timings.shortlist, () => pickShortlist(line.text, index, context))
      const rankings: Record<string, Ranking> = {}
      for (const name of names) {
        rankings[name] = await time(timings.rankers[name], () => rankers[name](line.text, shortlist, index, context))
      }
      ranked.push({ line, shortlist, rankings })
    }
    return { ranked, timings }
  }
  // The warm-up pass, whose timings are left out.
  await pass()
  const passes = [await pass(), await pass(), await pass()]
  const { ranked } = passes[0]
  const fold = folds(lines, (line) => line.acceptable.length > 0)
  const chosen = Object.fromEntries(
    Object.entries(cutOffs).map(([name, cut]) => {
      const items = ranked.map(({ line, rankings }) => ({
        ranking: rankings[name],
        acceptable: new Set(line.acceptable)
      }))
      const right = ({ ranking, acceptable }: (typeof items)[number], cutOff: number) =>
        outcomeOf(rowFor(cut(ranking, cutOff)), acceptable).startsWith('right')
      return [name, crossValidate(items, fold, ({ ranking }) => top(ranking), right)]
    })
  )
  const scored = ranked.map(({ line, shortlist, rankings }, i): LineScore<Line> => {
    const acceptable = new Set(line.acceptable)
    const byRanker = names.map((name) => {
      const ranking = rankings[name]
      // A phrase scored 0 isn't ranked, so a ranking that holds orders nothing, and a stable sort keeps the
      // ranking's own order among ties.
      const order = [...ranking.scores]
        .filter(([, score]) => score > 0)
        .sort(([, a], [, b]) => b - a)
        .map(([id]) => id)
      const cut = cutOffs[name]
      const row = rowFor(cut ? cut(ranking, chosen[name][fold[i]]) : ranking)
      return [name, { ranking, order, row, outcome: outcomeOf(row, acceptable) }] as const
    })
    return { line, shortlist: shortlist.map((phrase) => phrase.id), rankers: Object.fromEntries(byRanker) }
  })
  return {
    cutOffs: chosen,
    lines: scored,
    timings: {
      shortlist: passes.flatMap(({ timings }) => timings.shortlist),
      rankers: Object.fromEntries(names.map((name) => [name, passes.flatMap(({ timings }) => timings.rankers[name])]))
    }
  }
}

/** How many lines saw each outcome, naming every outcome. */
const tally = (seen: readonly Outcome[]) => {
  const counts = Object.fromEntries(outcomes.map((outcome) => [outcome, 0])) as Record<Outcome, number>
  for (const outcome of seen) counts[outcome] += 1
  return counts
}

/** The lines a ranking counts, those with an acceptable phrase besides the fixed buttons, which no ranker orders. */
const withPhrases = <Line extends ScoredLine>(scores: readonly LineScore<Line>[]) =>
  scores
    .map((score) => ({ ...score, phrases: new Set(score.line.acceptable.filter((id) => !fixedButtons.includes(id))) }))
    .filter(({ phrases }) => phrases.size > 0)

/**
 * Sums up a group of scored lines. The ranking counts only lines with an acceptable phrase besides the fixed buttons,
 * which no ranker orders; its means over no such lines are NaN. The row counts every line.
 */
export function summarize<Line extends ScoredLine>(scores: readonly LineScore<Line>[]): Summary {
  const ranked = withPhrases(scores)
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

/** How a ranker's top 6 compares with another's: `trails` and `leads` only when the whole interval lies on one side. */
export type Verdict = 'trails' | 'leads' | 'no clear difference'

/**
 * The paired bootstrap's interval for ranker a's top-6 accuracy minus ranker b's, over the same lines with an
 * acceptable phrase besides the fixed buttons, and its verdict: a trails b only when the whole interval lies below
 * zero (EVAL-4), and leads only when it lies above. Null when no line has such a phrase.
 */
export function topSixGap<Line extends ScoredLine>(
  scores: readonly LineScore<Line>[],
  a: string,
  b: string
): { difference: number; low: number; high: number; verdict: Verdict } | null {
  const ranked = withPhrases(scores)
  const hits = (name: string) =>
    ranked.map(({ rankers, phrases }) => (rankers[name].order.slice(0, 6).some((id) => phrases.has(id)) ? 1 : 0))
  const gap = pairedBootstrap(hits(a), hits(b))
  if (gap === null) return null
  return { ...gap, verdict: gap.high < 0 ? 'trails' : gap.low > 0 ? 'leads' : 'no clear difference' }
}

/**
 * Whether a line shares no word with any of its acceptable replies, as the phone matches words, so its keyword
 * ranking can't find them (EVAL-1). Only a line with a reply besides the fixed buttons counts, but their words count.
 */
export function sharesNoWord(line: Pick<ScoredLine, 'text' | 'acceptable'>, bank: readonly Phrase[]): boolean {
  if (line.acceptable.every((id) => fixedButtons.includes(id))) return false
  const index = new PhraseIndex()
  // Without their flags, since the index leaves out the fixed buttons.
  index.update(
    bank.filter(({ id }) => line.acceptable.includes(id)).map(({ id, text, places }) => ({ id, text, places }))
  )
  return index.match(line.text).length === 0
}

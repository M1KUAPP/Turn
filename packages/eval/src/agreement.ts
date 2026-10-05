import { mean } from './stats'

/** A two-by-two table of two labelings' calls, with how far they agree. */
export type Table = {
  a: number
  b: number
  c: number
  d: number
  percent: number
  kappa: number
  positive: number
  negative: number
}

/** How far two labelings agree: on each line's call, on each line and candidate, and as alpha over the sets. */
export type Agreement = { alpha: number; noneOrSome: Table; pairs: Table }

/** One line as two labelings saw it: each one's acceptable replies, and the phrases either could have listed. */
export type Unit = { first: readonly string[]; second: readonly string[]; candidates: readonly string[] }

/**
 * Two labelings' calls on the same items, a two-by-two table (a: both yes, b: only the first, c: only the second, d:
 * neither), with percent agreement, Cohen's kappa, and the positive and negative agreement Cicchetti and Feinstein
 * ask to accompany kappa.
 */
const agreementOf = (a: number, b: number, c: number, d: number): Table => {
  const n = a + b + c + d
  const observed = (a + d) / n
  const expected = ((a + b) * (a + c) + (c + d) * (b + d)) / (n * n)
  return {
    a,
    b,
    c,
    d,
    percent: observed,
    kappa: (observed - expected) / (1 - expected),
    positive: (2 * a) / (2 * a + b + c),
    negative: (2 * d) / (2 * d + b + c)
  }
}

/** Counts a two-by-two table over the items, from whether each labeling said yes to each. */
const tableOf = (calls: readonly (readonly [boolean, boolean])[]) => {
  const count = (first: boolean, second: boolean) => calls.filter(([x, y]) => x === first && y === second).length
  return agreementOf(count(true, true), count(true, false), count(false, true), count(false, false))
}

/**
 * Passonneau's MASI distance between two sets of replies, 1 − J × M: J is the share of the replies both list, and M is
 * 1 for the same set, 2/3 when one holds the other, 1/3 when they overlap, and 0 when they share none. Two empty sets
 * are the same set, at 0, and an empty set shares nothing with any other, at 1.
 */
export function masiDistance(first: readonly string[], second: readonly string[]): number {
  if (first.length === 0 && second.length === 0) return 0
  const both = first.filter((id) => second.includes(id)).length
  const either = first.length + second.length - both
  const holds = both === first.length || both === second.length
  // Sets that share none have J = 0, so their M, 0, needs no case.
  const monotonicity = both === either ? 1 : holds ? 2 / 3 : 1 / 3
  return 1 - (both / either) * monotonicity
}

/**
 * Krippendorff's alpha for two labelings with the MASI distance, 1 − D_o/D_e: D_o is the mean distance between the
 * two labels of each line, and D_e the mean over every pair of the pooled labels.
 */
const alphaOf = (units: readonly Unit[]) => {
  const pooled = units.flatMap(({ first, second }) => [first, second])
  const observed = mean(units.map(({ first, second }) => masiDistance(first, second)))
  const expected = mean(pooled.flatMap((x, i) => pooled.slice(i + 1).map((y) => masiDistance(x, y))))
  return 1 - observed / expected
}

/**
 * How far two labelings agree (EVAL-1): on each line's call of some replies or none, on each line and candidate
 * phrase, and as Krippendorff's alpha over the sets. Kappa and negative agreement over the pairs move with the
 * candidates' count, as positive agreement doesn't.
 */
export function compareLabelings(units: readonly Unit[]): Agreement {
  return {
    alpha: alphaOf(units),
    noneOrSome: tableOf(units.map(({ first, second }) => [first.length > 0, second.length > 0])),
    pairs: tableOf(
      units.flatMap(({ first, second, candidates }) =>
        candidates.map((id) => [first.includes(id), second.includes(id)] as const)
      )
    )
  }
}

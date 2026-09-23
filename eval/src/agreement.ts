/** One line as two labelings saw it: each one's acceptable replies, and the phrases either could have listed. */
export type Unit = { first: readonly string[]; second: readonly string[]; candidates: readonly string[] }

/**
 * Two labelings' calls on the same items, a two-by-two table (a: both yes, b: only the first, c: only the second, d:
 * neither), with percent agreement, Cohen's kappa, and the positive and negative agreement Cicchetti and Feinstein
 * ask to accompany kappa.
 */
const agreementOf = (a: number, b: number, c: number, d: number) => {
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
 * How far two labelings agree (EVAL-1): on each line's call of some replies or none, and on each line and candidate
 * phrase. Kappa and negative agreement over the pairs move with the candidates' count, as positive agreement doesn't.
 */
export function compareLabelings(units: readonly Unit[]) {
  return {
    noneOrSome: tableOf(units.map(({ first, second }) => [first.length > 0, second.length > 0])),
    pairs: tableOf(
      units.flatMap(({ first, second, candidates }) =>
        candidates.map((id) => [first.includes(id), second.includes(id)] as const)
      )
    )
  }
}

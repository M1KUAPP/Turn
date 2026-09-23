import { below, seeded } from './stats'

/**
 * Deals the items into folds, stratified by their class: one seeded shuffle, so the file's order doesn't pick the
 * folds, then each class's items in turn, round-robin, so every fold holds each class's share and the folds' sizes
 * differ by at most one. Returns each item's fold.
 */
export function folds<T>(items: readonly T[], classOf: (item: T) => unknown, count = 5): number[] {
  const next = seeded()
  const order = items.map((_, i) => i)
  // Fisher and Yates's shuffle.
  for (let i = order.length - 1; i > 0; i--) {
    const j = below(i + 1, next)
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  const fold: number[] = Array(items.length)
  let dealt = 0
  for (const members of Map.groupBy(order, (i) => classOf(items[i])).values()) {
    for (const i of members) fold[i] = dealt++ % count
  }
  return fold
}

/**
 * The cut-off that makes the most items right, from the values the items offer, the only points where one can change,
 * and one above them all, which holds every item; a tie goes to the higher cut-off.
 */
export function chooseCutOff<T>(
  items: readonly T[],
  values: (item: T) => readonly number[],
  right: (item: T, cutOff: number) => boolean
): number {
  const candidates = [Infinity, ...new Set(items.flatMap(values))].toSorted((a, b) => b - a)
  let best = Infinity
  let most = -1
  for (const cutOff of candidates) {
    const count = items.filter((item) => right(item, cutOff)).length
    if (count > most) {
      best = cutOff
      most = count
    }
  }
  return best
}

/** Each fold's cut-off, chosen on the other folds' items alone, so an item is scored at a cut-off it didn't set. */
export function crossValidate<T>(
  items: readonly T[],
  fold: readonly number[],
  values: (item: T) => readonly number[],
  right: (item: T, cutOff: number) => boolean,
  count = 5
): number[] {
  return Array.from({ length: count }, (_, held) =>
    chooseCutOff(
      items.filter((_, i) => fold[i] !== held),
      values,
      right
    )
  )
}

/** The mean of the values, NaN for none. */
export const mean = (values: readonly number[]) => values.reduce((sum, value) => sum + value, 0) / values.length

/** The standard normal's 97.5th percentile, for two-sided 95% intervals. */
const z = 1.959963984540054

/** A rate's 95% Wilson score interval, by NIST's formula, or null for a rate over nothing. */
export function wilson(successes: number, n: number): { low: number; high: number } | null {
  if (n === 0) return null
  const p = successes / n
  const center = p + (z * z) / (2 * n)
  const spread = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))
  const scale = 1 + (z * z) / n
  return { low: Math.max(0, (center - spread) / scale), high: Math.min(1, (center + spread) / scale) }
}

/**
 * The qth percentile of the values, q from 0 to 100, by Hyndman and Fan's type 7, NumPy's default: the median is the
 * usual one, and the 100th percentile is the maximum.
 */
export function percentile(values: readonly number[], q: number): number {
  const sorted = values.toSorted((a, b) => a - b)
  const h = ((sorted.length - 1) * q) / 100
  const j = Math.floor(h)
  return j + 1 < sorted.length ? sorted[j] + (h - j) * (sorted[j + 1] - sorted[j]) : sorted[j]
}

/** The chance that a random order of n phrases, g of them acceptable, puts one in the first k: 1 − C(n − g, k)/C(n, k). */
export function chanceHit(n: number, g: number, k: number): number {
  let miss = 1
  for (let i = 0; i < Math.min(k, n); i++) miss *= (n - g - i) / (n - i)
  return 1 - miss
}

/**
 * The expected reciprocal rank of the first acceptable phrase in a random order of n phrases, g of them acceptable:
 * the sum over r of P(R = r)/r, where P(R = 1) = g/n and each next rank's share follows from the last.
 */
export function chanceReciprocalRank(n: number, g: number): number {
  let expected = 0
  let atRank = g / n
  for (let r = 1; r <= n - g + 1 && atRank > 0; r++) {
    expected += atRank / r
    atRank *= (n - r - g + 1) / (n - r)
  }
  return expected
}

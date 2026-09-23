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

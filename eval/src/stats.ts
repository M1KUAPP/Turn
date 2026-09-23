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

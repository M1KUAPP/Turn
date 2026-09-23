/** The mean of the values, NaN for none. */
export const mean = (values: readonly number[]): number => values.reduce((sum, value) => sum + value, 0) / values.length

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

/**
 * The chance that a random order of n phrases, g of them acceptable, puts one in the first k:
 * 1 − C(n − g, k)/C(n, k).
 */
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

const rotl = (x: number, k: number) => (x << k) | (x >>> (32 - k))

/** The seed the evaluation's shuffles and resamples start from, committed so every run draws the same numbers. */
const seed = [0xcbe300d9, 0x05bdaea0, 0xc518bed1, 0x49317689] as const

/**
 * A generator of 32-bit integers from the seed: Blackman and Vigna's xoshiro128** 1.1, whose 128 bits of state must
 * not all be zero. `Math.random` can't be seeded, and a run must draw the same numbers every time.
 */
export function seeded([a, b, c, d]: readonly number[] = seed): () => number {
  return () => {
    const result = Math.imul(rotl(Math.imul(b, 5), 7), 9) >>> 0
    const t = b << 9
    c ^= a
    d ^= b
    b ^= c
    a ^= d
    c ^= t
    d = rotl(d, 11)
    return result
  }
}

/** A whole number from 0 to n − 1, each equally likely: a draw past the last whole multiple of n is drawn again. */
export function below(n: number, next: () => number): number {
  const limit = 2 ** 32 - (2 ** 32 % n)
  let x = next()
  while (x >= limit) x = next()
  return x % n
}

/**
/** How many times the paired bootstrap resamples the items: SciPy's default count. */
const resamples = 9999

/**
 * The paired bootstrap's 95% interval for the mean of a − b over the same items: 9,999 resamples of the items, each
 * the same for both, and the 2.5th and 97.5th percentiles of their means. When no item splits a and b, every
 * resample gives the same mean, and so does the interval. Null for no items.
 */
export function pairedBootstrap(
  a: readonly number[],
  b: readonly number[]
): { difference: number; low: number; high: number } | null {
  const n = a.length
  if (n === 0) return null
  const gaps = a.map((value, i) => value - b[i])
  const next = seeded()
  const means = Array.from({ length: resamples }, () => {
    let sum = 0
    for (let i = 0; i < n; i++) sum += gaps[below(n, next)]
    return sum / n
  })
  return { difference: mean(gaps), low: percentile(means, 2.5), high: percentile(means, 97.5) }
}

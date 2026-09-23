import type { Outcome } from '@turn/shared/relay'

/** One of the relay's log lines, as `worker/src/index.ts` writes it, with the fields a summary reads. */
export type LogLine = { outcome: string; ms?: { total?: number; jev?: number }; inputTokens?: number }

/** A latency at the median and the 95th percentile, in milliseconds, or null with no answered line. */
type Latency = { median: number | null; p95: number | null }

/** A day of the relay's log lines, counted as METRIC-2 names them. */
export type Summary = {
  lines: number
  /** How many lines ended with each outcome. */
  outcomes: Map<string, number>
  answered: number
  paywall: number
  /** Lines that got no answer because something broke: Jev, its credits, RevenueCat's check, or the relay. */
  failures: number
  /** The time in all and in Jev, over answered lines only, since the other outcomes end before Jev is asked. */
  total: Latency
  jev: Latency
  /** Jev's billable input tokens, which each answered line reports. */
  inputTokens: number
}

/** The outcomes that count as failures. */
const failingOutcomes: readonly Outcome[] = ['credits', 'failed', 'internal', 'unverified']

/** Whether an outcome counts as a failure. */
const isFailure = (outcome: string) => (failingOutcomes as readonly string[]).includes(outcome)

/** The relay's `isRecord`, copied since the scripts import no package at run time, so the workflow needn't install. */
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** Whether a field a line may leave out is a number when it's there. */
const isNumberIfSet = (value: unknown) => value === undefined || typeof value === 'number'

/** Whether an event's payload is one of the relay's log lines, with each field a summary reads in its type. */
export function isLogLine(source: unknown): source is LogLine {
  if (!isRecord(source) || typeof source.outcome !== 'string' || !isNumberIfSet(source.inputTokens)) return false
  const { ms } = source
  return ms === undefined || (isRecord(ms) && isNumberIfSet(ms.total) && isNumberIfSet(ms.jev))
}

/**
 * The value at a percentile of sorted numbers, by nearest rank: the smallest value with at least that percent of the
 * values at or below it. The percent is a whole number, so the rank has no rounding error.
 */
export function percentile(sorted: readonly number[], percent: number): number | null {
  return sorted.length === 0 ? null : sorted[Math.ceil((percent * sorted.length) / 100) - 1]
}

/** Counts log lines by outcome, and takes the latencies of the answered ones at the median and the 95th percentile. */
export function summarize(lines: readonly LogLine[]): Summary {
  const outcomes = new Map<string, number>()
  for (const { outcome } of lines) outcomes.set(outcome, (outcomes.get(outcome) ?? 0) + 1)
  const answered = lines.filter(({ outcome }) => outcome === 'answered')
  const latency = (key: 'total' | 'jev'): Latency => {
    const sorted = answered.flatMap(({ ms }) => ms?.[key] ?? []).sort((a, b) => a - b)
    return { median: percentile(sorted, 50), p95: percentile(sorted, 95) }
  }
  return {
    lines: lines.length,
    outcomes,
    answered: outcomes.get('answered') ?? 0,
    paywall: outcomes.get('paywall') ?? 0,
    failures: failingOutcomes.reduce((sum, outcome) => sum + (outcomes.get(outcome) ?? 0), 0),
    total: latency('total'),
    jev: latency('jev'),
    inputTokens: lines.reduce((sum, { inputTokens }) => sum + (inputTokens ?? 0), 0)
  }
}

/** A count and its noun, in the singular for one. */
const counted = (count: number, noun: string) => `${count} ${noun}${count === 1 ? '' : 's'}`

/** Some outcomes' counts, by name, as "name count, name count". */
const listed = (outcomes: Map<string, number>, keep: (outcome: string) => boolean) =>
  [...outcomes]
    .filter(([outcome]) => keep(outcome))
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([outcome, count]) => `${outcome} ${count}`)
    .join(', ')

const printed = ({ median, p95 }: Latency) => (median === null ? 'none' : `median ${median}, 95th percentile ${p95}`)

/** A day's summary as the command prints it, beside the events the query matched, which may hold other payloads. */
export function formatSummary(day: string, summary: Summary, matched: number): string {
  const failures = listed(summary.outcomes, isFailure)
  const others = listed(
    summary.outcomes,
    (outcome) => outcome !== 'answered' && outcome !== 'paywall' && !isFailure(outcome)
  )
  return [
    `The relay's logs for ${day}, in UTC: ${counted(summary.lines, 'log line')}, of ${counted(matched, 'event')} ` +
      'the query matched',
    '',
    `Lines answered: ${summary.answered}`,
    `Paywall responses: ${summary.paywall}`,
    `Failures: ${summary.failures}${failures ? ` (${failures})` : ''}`,
    `Other outcomes: ${others || 'none'}`,
    '',
    'Latency of answered lines, in milliseconds:',
    `- In all: ${printed(summary.total)}`,
    `- In Jev: ${printed(summary.jev)}`,
    '',
    `Jev's input tokens: ${summary.inputTokens}`
  ].join('\n')
}

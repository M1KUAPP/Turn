import type { Summary } from './summary'

/** `jev-1.13.0`'s price, $0.042 a million input tokens, in nanodollars a token, so a spend is a whole number. */
const nanodollarsPerToken = 42

const dayMs = 24 * 60 * 60 * 1000

/** What the alert found in a window of the relay's logs, with the spend and the level in nanodollars. */
export type Finding = { outOfCredits: number; inputTokens: number; spent: number; level: number; fires: boolean }

/**
 * Whether the alert fires (AVAIL-2): when any line in the window ran out of Jev's credits, since TypeSafe publishes no
 * balance to warn from sooner, or when the window's estimated spend passes the level, given in dollars.
 */
export function assess(summary: Summary, dollars: number): Finding {
  const outOfCredits = summary.outcomes.get('credits') ?? 0
  const spent = summary.inputTokens * nanodollarsPerToken
  const level = Math.round(dollars * 1e9)
  return { outOfCredits, inputTokens: summary.inputTokens, spent, level, fires: outOfCredits > 0 || spent > level }
}

/**
 * The window the alert reads: the last 24 hours, or from when the last alert issue was closed if that's later, so a
 * handled alert doesn't fire again from the same lines. Null for a close that doesn't parse or hasn't happened.
 */
export function alertWindow(since: string | undefined, now: number): { from: number; to: number } | null {
  if (since === undefined) return { from: now - dayMs, to: now }
  const closed = Date.parse(since)
  if (Number.isNaN(closed) || closed > now) return null
  return { from: Math.max(now - dayMs, closed), to: now }
}

/** Dollars from nanodollars, with at least two decimals and at most six. */
export function dollars(nanodollars: number): string {
  const [whole, fraction = ''] = (nanodollars / 1e9).toFixed(6).replace(/0+$/, '').split('.')
  return `$${whole}.${fraction.padEnd(2, '0')}`
}

/** The alert issue's body: what fired, over which window, and what the team does about it. */
export function formatAlert(finding: Finding, window: { from: number; to: number }): string {
  const { outOfCredits, inputTokens, spent, level } = finding
  const from = new Date(window.from).toISOString()
  const to = new Date(window.to).toISOString()
  return [
    `The relay's logs from ${from} to ${to} show:`,
    '',
    ...(outOfCredits > 0
      ? [
          `- ${outOfCredits} ${outOfCredits === 1 ? 'line' : 'lines'} that Jev refused for credits, logged as ` +
            "`credits`, which means they've run out."
        ]
      : []),
    ...(spent > level
      ? [
          `- ${inputTokens} input tokens, about ${dollars(spent)} at jev-1.13.0's $0.042 a million, past the level ` +
            `of ${dollars(level)}.`
        ]
      : []),
    '',
    "TypeSafe has no balance check to read, so look at the balance in TypeSafe's console and add credits if " +
      'needed. Close this issue once that is done: the alert then counts only lines after the close.'
  ].join('\n')
}

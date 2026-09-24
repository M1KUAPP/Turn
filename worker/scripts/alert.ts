import type { Outcome } from '@turn/shared/relay'
import type { Summary } from './summary'
import { dayMs, type Range } from './telemetry'

/** `jev-1.13.0`'s price, $0.042 a million input tokens, in nanodollars a token, so a spend is a whole number. */
const nanodollarsPerToken = 42

/** What the alert found in a window of the relay's logs, with the spend and the level in nanodollars. */
export type Finding = {
  outOfCredits: number
  inputTokens: number
  spent: number
  level: number
  /** Whether any line ran out of Jev's credits. */
  ranOut: boolean
  /** Whether the estimated spend passed the level. */
  overLevel: boolean
}

/**
 * Reads the alert's two reasons to fire (AVAIL-2): any line in the window that ran out of Jev's credits, since TypeSafe
 * publishes no balance to warn from sooner, and the window's estimated spend passing the level, given in dollars.
 */
export function assess(summary: Summary, levelDollars: number): Finding {
  const outOfCredits = summary.outcomes.get('credits' satisfies Outcome) ?? 0
  const spent = summary.inputTokens * nanodollarsPerToken
  const level = Math.round(levelDollars * 1e9)
  return {
    outOfCredits,
    inputTokens: summary.inputTokens,
    spent,
    level,
    ranOut: outOfCredits > 0,
    overLevel: spent > level
  }
}

/** Whether the alert fires: for either reason. */
export const fires = ({ ranOut, overLevel }: Finding) => ranOut || overLevel

/**
 * The window the alert reads: the last 24 hours, or from when the last alert issue was closed if that's later, so a
 * handled alert doesn't fire again from the same lines. Null for a close that doesn't parse or hasn't happened.
 */
export function alertWindow(since: string | undefined, now: number): Range | null {
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
export function formatAlert(finding: Finding, window: Range): string {
  const { outOfCredits, inputTokens, spent, level, ranOut, overLevel } = finding
  const from = new Date(window.from).toISOString()
  const to = new Date(window.to).toISOString()
  return [
    `The relay's logs from ${from} to ${to} show:`,
    '',
    ...(ranOut
      ? [
          `- ${outOfCredits} ${outOfCredits === 1 ? 'line' : 'lines'} that Jev refused for credits, logged as ` +
            "`credits`, which means they've run out."
        ]
      : []),
    ...(overLevel
      ? [
          `- ${inputTokens} input tokens, about ${dollars(spent)} at jev-1.13.0's ` +
            `${dollars(nanodollarsPerToken * 1e6)} a million, past the level of ${dollars(level)}.`
        ]
      : []),
    '',
    "TypeSafe has no balance check to read, so look at the balance in TypeSafe's console and add credits if " +
      "needed. Without a balance, the alert can't see a slow drain until a line runs out. Close this issue once " +
      'that is done: the alert then counts only lines after the close.'
  ].join('\n')
}

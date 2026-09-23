import { parseArgs } from 'node:util'
import { formatSummary, summarize } from './summary'
import { dayRange, readLogs } from './telemetry'

/**
 * `bun run logs`: prints a UTC day of the relay's log lines as METRIC-2 counts them, yesterday unless `--day` names
 * one. Workers Logs keep 3 days on the Free plan. The account's ID and the token come from `TURN_CF_ACCOUNT_ID` and
 * `TURN_CF_LOGS_TOKEN`, never from the command line.
 */
export async function main(args: readonly string[], env: Record<string, string | undefined>): Promise<number> {
  const { values } = parseArgs({ args: [...args], options: { day: { type: 'string' } } })
  const range = dayRange(values.day, Date.now())
  if (!range) {
    console.error(`--day takes a day that has begun, such as 2026-09-23, not ${values.day}`)
    return 2
  }
  const account = env.TURN_CF_ACCOUNT_ID
  const token = env.TURN_CF_LOGS_TOKEN
  if (!account || !token) {
    console.error('Set TURN_CF_ACCOUNT_ID and TURN_CF_LOGS_TOKEN, as worker/README.md says.')
    return 2
  }
  try {
    const { lines, matched } = await readLogs({ account, token }, range.from, range.to)
    console.log(formatSummary(range.day, summarize(lines), matched))
    return 0
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    return 1
  }
}

if (import.meta.main) process.exitCode = await main(process.argv.slice(2), process.env)

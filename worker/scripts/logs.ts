import { readFlags } from './flags'
import { formatSummary, summarize } from './summary'
import { accessFrom, accessMissing, dayRange, messageOf, readLogs } from './telemetry'

/**
 * `bun run logs`: prints a UTC day of the relay's log lines as METRIC-2 counts them, yesterday unless `--day` names
 * one. Workers Logs keep 3 days on the Free plan. The account's ID and the token come from `TURN_CF_ACCOUNT_ID` and
 * `TURN_CF_LOGS_TOKEN`, never from the command line.
 */
export async function main(args: readonly string[], env: Record<string, string | undefined>): Promise<number> {
  const flags = readFlags(args, ['day'])
  const range = flags && dayRange(flags.day, Date.now())
  if (!range) {
    console.error('bun run logs takes only --day, and a day that has begun, such as 2026-09-23.')
    return 2
  }
  const access = accessFrom(env)
  if (!access) {
    console.error(accessMissing)
    return 2
  }
  try {
    const { lines, matched } = await readLogs(access, range)
    console.log(formatSummary(range.day, summarize(lines), matched))
    return 0
  } catch (error) {
    console.error(messageOf(error))
    return 1
  }
}

if (import.meta.main) process.exitCode = await main(process.argv.slice(2), process.env)

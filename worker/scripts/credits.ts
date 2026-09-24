import { writeFile } from 'node:fs/promises'
import { alertWindow, assess, dollars, fires, formatAlert } from './alert'
import { readFlags } from './flags'
import { counted, summarize } from './summary'
import { accessFrom, accessMissing, messageOf, readLogs } from './telemetry'

/**
 * `bun scripts/credits.ts`: reads the alert's window of the relay's logs and prints what it found, and when the alert
 * fires, writes the issue's body to `--out`, or prints it. `--level` is in dollars, $0.50 unless given, and `--since`
 * is when the last alert issue was closed. The account's ID and the token come from the environment, as for `logs.ts`.
 */
export async function main(args: readonly string[], env: Record<string, string | undefined>): Promise<number> {
  const flags = readFlags(args, ['level', 'since', 'out'])
  const { level: given = '0.50', since, out } = flags ?? {}
  const level = Number(given)
  const window = alertWindow(since, Date.now())
  if (!flags || given.trim() === '' || !Number.isFinite(level) || level < 0 || !window) {
    console.error('--level takes dollars from 0, and --since a time that has passed, such as 2026-09-23T09:00:00Z.')
    return 2
  }
  const access = accessFrom(env)
  if (!access) {
    console.error(accessMissing)
    return 2
  }
  try {
    const { lines } = await readLogs(access, window)
    const finding = assess(summarize(lines), level)
    console.log(
      `${counted(lines.length, 'log line')} since ${new Date(window.from).toISOString()}: ` +
        `${finding.outOfCredits} out of credits, and ${dollars(finding.spent)} spent against a level of ` +
        `${dollars(finding.level)}, so the alert ${fires(finding) ? 'fires' : 'stays quiet'}.`
    )
    if (fires(finding)) {
      const body = formatAlert(finding, window)
      if (out) await writeFile(out, `${body}\n`)
      else console.log(`\n${body}`)
    }
    return 0
  } catch (error) {
    console.error(messageOf(error))
    return 1
  }
}

if (import.meta.main) process.exitCode = await main(process.argv.slice(2), process.env)

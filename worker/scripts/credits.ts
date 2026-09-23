import { writeFile } from 'node:fs/promises'
import { parseArgs } from 'node:util'
import { alertWindow, assess, dollars, formatAlert } from './alert'
import { summarize } from './summary'
import { accessFrom, accessMissing, messageOf, readLogs } from './telemetry'

/**
 * `bun scripts/credits.ts`: reads the alert's window of the relay's logs and prints what it found, and when the alert
 * fires, writes the issue's body to `--out`, or prints it. `--level` is in dollars, $0.50 unless given, and `--since`
 * is when the last alert issue was closed. The account's ID and the token come from the environment, as for `logs.ts`.
 */
export async function main(args: readonly string[], env: Record<string, string | undefined>): Promise<number> {
  const { values } = parseArgs({
    args: [...args],
    options: { level: { type: 'string', default: '0.50' }, since: { type: 'string' }, out: { type: 'string' } }
  })
  const level = Number(values.level)
  const window = alertWindow(values.since, Date.now())
  if (values.level.trim() === '' || !Number.isFinite(level) || level < 0 || !window) {
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
      `${lines.length} log lines since ${new Date(window.from).toISOString()}: ${finding.outOfCredits} out of ` +
        `credits, and ${dollars(finding.spent)} spent against a level of ${dollars(finding.level)}, so the alert ` +
        `${finding.fires ? 'fires' : 'stays quiet'}.`
    )
    if (finding.fires) {
      const body = formatAlert(finding, window)
      if (values.out) await writeFile(values.out, `${body}\n`)
      else console.log(`\n${body}`)
    }
    return 0
  } catch (error) {
    console.error(messageOf(error))
    return 1
  }
}

if (import.meta.main) process.exitCode = await main(process.argv.slice(2), process.env)

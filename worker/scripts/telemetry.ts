import { isLogLine, type LogLine } from './summary'

/** Where the relay's logs are read from: the Cloudflare account's ID, and an API token that may query Workers Logs. */
export type Access = { account: string; token: string }

/** A span of time, in milliseconds since 1970. */
export type Range = { from: number; to: number }

/** The account's ID and the token from the environment, never the command line, or null if either is missing. */
export function accessFrom(env: Record<string, string | undefined>): Access | null {
  const { TURN_CF_ACCOUNT_ID: account, TURN_CF_LOGS_TOKEN: token } = env
  return account && token ? { account, token } : null
}

/** What a command prints when `accessFrom` finds nothing. */
export const accessMissing = 'Set TURN_CF_ACCOUNT_ID and TURN_CF_LOGS_TOKEN, as worker/README.md says.'

/** A failure as a command prints it: the error's message, never its stack. */
export const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

/** The most events one query returns. */
export const pageSize = 2000

export const dayMs = 24 * 60 * 60 * 1000

/**
 * A UTC day's range in milliseconds since 1970, from its midnight to the next, or to now if that's sooner, for a day
 * that has begun: yesterday unless one is named as `YYYY-MM-DD`. Null for any other name.
 */
export function dayRange(day: string | undefined, now: number): (Range & { day: string }) | null {
  const name = day ?? new Date(now - dayMs).toISOString().slice(0, 10)
  const from = Date.parse(`${name}T00:00:00.000Z`)
  // A name that parses back to itself, since some runtimes read February 30 as March 2.
  if (Number.isNaN(from) || new Date(from).toISOString().slice(0, 10) !== name || from > now) return null
  return { day: name, from, to: Math.min(from + dayMs, now) }
}

/** The query API's answer, unchecked, with the fields the script reads. */
type Answer = {
  errors?: { message?: unknown }[]
  result?: {
    events?: { events?: { $metadata?: { id?: unknown }; source?: unknown }[] }
    calculations?: { aggregates?: { value?: unknown }[] }[]
  }
}

/** The API's own message for a failed query, if it sent one. */
const firstError = (answer: Answer | undefined) => {
  const message = answer?.errors?.[0]?.message
  return typeof message === 'string' ? `: ${message}` : ''
}

/** Asks about the `turn-relay` Worker's events in a range, as a dry run, which doesn't persist the results. */
async function query({ account, token }: Access, { from, to }: Range, view: object, parameters: object = {}) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}`
  const response = await fetch(`${url}/workers/observability/telemetry/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      queryId: 'turn-relay-logs',
      timeframe: { from, to },
      dry: true,
      ...view,
      parameters: {
        filters: [{ key: '$metadata.service', operation: 'eq', type: 'string', value: 'turn-relay' }],
        ...parameters
      }
    })
  })
  const answer = (await response.json().catch(() => undefined)) as Answer | undefined
  if (!response.ok) throw new Error(`The telemetry query answered ${response.status}${firstError(answer)}`)
  return answer
}

/**
 * The relay's log lines in a range, from Workers Logs through Cloudflare's telemetry query API, with the count of
 * events the query matched. It reads the `turn-relay` Worker's events 2,000 at a time, paging on from the last event's
 * ID until a page comes back short, and keeps each event once, only if its payload is one of the relay's lines. The
 * total comes from a count, since a page's own count is only how many it returned. It throws when the API refuses,
 * answers out of shape, or repeats a page.
 */
export async function readLogs(access: Access, range: Range) {
  const seen = new Set<unknown>()
  const lines: LogLine[] = []
  for (let offset: string | undefined; ;) {
    const answer = await query(access, range, {
      view: 'events',
      limit: pageSize,
      ...(offset === undefined ? {} : { offset, offsetDirection: 'next' })
    })
    const events = answer?.result?.events?.events
    if (!Array.isArray(events)) throw new Error('The telemetry query answered out of shape')
    const known = seen.size
    for (const { $metadata, source } of events) {
      if ($metadata?.id !== undefined && seen.has($metadata.id)) continue
      seen.add($metadata?.id)
      if (isLogLine(source)) lines.push(source)
    }
    if (events.length < pageSize) break
    // A full page of events already read means the cursor didn't move, and asking again would loop.
    if (seen.size === known) throw new Error('The telemetry query repeated a page')
    const last = events.at(-1)?.$metadata?.id
    if (typeof last !== 'string') throw new Error('The telemetry query answered out of shape')
    offset = last
  }
  const counted = await query(
    access,
    range,
    { view: 'calculations' },
    { calculations: [{ operator: 'count', alias: 'events' }] }
  )
  const matched = counted?.result?.calculations?.[0]?.aggregates?.[0]?.value
  if (typeof matched !== 'number') throw new Error('The telemetry query answered out of shape')
  return { lines, matched }
}

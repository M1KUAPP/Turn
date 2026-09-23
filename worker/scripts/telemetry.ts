import { isLogLine, type LogLine } from './summary'

/** Where the relay's logs are read from: the Cloudflare account's ID, and an API token that may query Workers Logs. */
export type Access = { account: string; token: string }

/** The most events one query returns. */
export const pageSize = 2000

const dayMs = 24 * 60 * 60 * 1000

/**
 * A UTC day's range in milliseconds since 1970, from its midnight to the next, or to now if that's sooner, for a day
 * that has begun: yesterday unless one is named as `YYYY-MM-DD`. Null for any other name.
 */
export function dayRange(day: string | undefined, now: number): { day: string; from: number; to: number } | null {
  const name = day ?? new Date(now - dayMs).toISOString().slice(0, 10)
  const from = Date.parse(`${name}T00:00:00.000Z`)
  // A name that parses back to itself, since some runtimes read February 30 as March 2.
  if (Number.isNaN(from) || new Date(from).toISOString().slice(0, 10) !== name || from > now) return null
  return { day: name, from, to: Math.min(from + dayMs, now) }
}

/** The query API's answer, unchecked, with the fields the script reads. */
type Answer = {
  errors?: { message?: unknown }[]
  result?: { events?: { events?: { $metadata?: { id?: unknown }; source?: unknown }[]; count?: unknown } }
}

/** The API's own message for a failed query, if it sent one. */
const firstError = (answer: Answer | undefined) => {
  const message = answer?.errors?.[0]?.message
  return typeof message === 'string' ? `: ${message}` : ''
}

/**
 * The relay's log lines between two times, in milliseconds since 1970, from Workers Logs through Cloudflare's telemetry
 * query API, with the count of events the query matched. It asks for the `turn-relay` Worker's events, 2,000 at a time
 * without saving the query, and pages on from the last event's ID until a page comes back short. Each event counts
 * once, and only if its payload is one of the relay's lines. It throws when the API refuses or answers out of shape.
 */
export async function readLogs({ account, token }: Access, from: number, to: number) {
  const accountUrl = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}`
  const seen = new Set<unknown>()
  const lines: LogLine[] = []
  for (let offset: string | undefined; ;) {
    const response = await fetch(`${accountUrl}/workers/observability/telemetry/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        queryId: 'turn-relay-logs',
        timeframe: { from, to },
        view: 'events',
        limit: pageSize,
        dry: true,
        parameters: { filters: [{ key: '$metadata.service', operation: 'eq', type: 'string', value: 'turn-relay' }] },
        ...(offset === undefined ? {} : { offset, offsetDirection: 'next' })
      })
    })
    const answer = (await response.json().catch(() => undefined)) as Answer | undefined
    if (!response.ok) throw new Error(`The telemetry query answered ${response.status}${firstError(answer)}`)
    const events = answer?.result?.events?.events
    const matched = answer?.result?.events?.count
    if (!Array.isArray(events) || typeof matched !== 'number')
      throw new Error('The telemetry query answered out of shape')
    for (const { $metadata, source } of events) {
      if ($metadata?.id !== undefined && seen.has($metadata.id)) continue
      seen.add($metadata?.id)
      if (isLogLine(source)) lines.push(source)
    }
    if (events.length < pageSize) return { lines, matched }
    const last = events.at(-1)?.$metadata?.id
    if (typeof last !== 'string') throw new Error('The telemetry query answered out of shape')
    offset = last
  }
}

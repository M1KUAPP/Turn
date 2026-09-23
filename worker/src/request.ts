import type { LineRequest } from '@turn/shared/relay'

/** A lowercase version 4 UUID, as `crypto.randomUUID()` makes. */
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

/** The app's version: 1 to 32 visible ASCII characters. */
const version = /^[\x21-\x7e]{1,32}$/

const builds = ['device', 'simulator']

/** The app user ID, when every header each request carries is well formed, or null. */
export function readUser(headers: Headers): string | null {
  const user = headers.get('X-Turn-User') ?? ''
  const valid =
    uuid.test(user) &&
    version.test(headers.get('X-Turn-Version') ?? '') &&
    builds.includes(headers.get('X-Turn-Build') ?? '')
  return valid ? user : null
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** Whether a value is a list of records, each with a text id and a text in `field`. */
const isList = (value: unknown, field: string) =>
  Array.isArray(value) &&
  value.every((item) => isRecord(item) && typeof item.id === 'string' && typeof item[field] === 'string')

function isLineRequest(body: unknown): body is LineRequest {
  if (!isRecord(body)) return false
  const { lineId, seq, line, place, categories, candidates, refresh } = body
  return (
    typeof lineId === 'string' &&
    uuid.test(lineId) &&
    typeof seq === 'number' &&
    Number.isSafeInteger(seq) &&
    seq >= 0 &&
    typeof line === 'string' &&
    typeof place === 'string' &&
    isList(categories, 'name') &&
    isList(candidates, 'text') &&
    (refresh === undefined || typeof refresh === 'boolean')
  )
}

/** The line a request asks about, when its body is one, or null. */
export async function readLine(request: Request): Promise<LineRequest | null> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return null
  }
  return isLineRequest(body) ? body : null
}

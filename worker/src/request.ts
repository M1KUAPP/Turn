import { limits, type LineRequest } from '@turn/shared/relay'

/** A lowercase version 4 UUID, as `crypto.randomUUID()` makes. */
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

/** The app's version: 1 to 32 visible ASCII characters. */
const version = /^[\x21-\x7e]{1,32}$/

/** The two builds a request can come from: one on a phone, or one in the Simulator. */
const builds = ['device', 'simulator'] as const

/** Who sent a request, the app user ID and the build, when every header each request carries is well formed. */
export function readUser(headers: Headers): { id: string; build: (typeof builds)[number] } | null {
  const id = headers.get('X-Turn-User') ?? ''
  const build = builds.find((name) => name === headers.get('X-Turn-Build'))
  const valid = uuid.test(id) && version.test(headers.get('X-Turn-Version') ?? '') && build !== undefined
  return valid ? { id, build } : null
}

/** Whether a value is a JSON object: not null, and not a list. */
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** A JSON media type, with or without parameters such as the charset. */
const json = /^application\/json\s*(;|$)/i

/**
 * Whether a value is a text of `min` to `max` characters, counted as Unicode code points, as SQLite's `length()` counts
 * the phone's text, which holds no NUL, so a text within the phone's limits is within these. The body's 16 KB can
 * still refuse a request of long texts in other scripts, so the app trims its shortlist to fit.
 */
const isText = (value: unknown, min: number, max: number) =>
  typeof value === 'string' && value.length >= min && [...value].length <= max

/** Whether a value is a list of at most `max` records with unique ids of 1 to 64 characters, each passing `check`. */
const isList = (value: unknown, max: number, check: (item: Record<string, unknown>) => boolean) =>
  Array.isArray(value) &&
  value.length <= max &&
  value.every((item) => isRecord(item) && isText(item.id, 1, limits.id) && check(item)) &&
  new Set(value.map((item) => item.id)).size === value.length

function isLineRequest(body: unknown): body is LineRequest {
  if (!isRecord(body)) return false
  const { lineId, seq, line, place, categories, candidates, refresh } = body
  return (
    typeof lineId === 'string' &&
    uuid.test(lineId) &&
    typeof seq === 'number' &&
    Number.isSafeInteger(seq) &&
    seq >= 0 &&
    isText(line, 1, limits.line) &&
    isText(place, 0, limits.name) &&
    isList(categories, limits.categories, ({ id, name }) => isText(name, 1, limits.name) && id !== 'consent') &&
    isList(candidates, limits.candidates, ({ text }) => isText(text, 1, limits.text)) &&
    (refresh === undefined || typeof refresh === 'boolean')
  )
}

/** The body as text, or null once it passes 16 KB, where reading stops, whatever `Content-Length` says (SEC-2). */
async function readText(request: Request): Promise<string | null> {
  if (Number(request.headers.get('Content-Length')) > limits.bytes) return null
  if (!request.body) return ''
  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let text = ''
  let size = 0
  for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
    size += chunk.value.byteLength
    if (size > limits.bytes) {
      await reader.cancel()
      return null
    }
    text += decoder.decode(chunk.value, { stream: true })
  }
  return text + decoder.decode()
}

/** The line a request asks about, when its body is JSON within every limit (SEC-2), or null. */
export async function readLine(request: Request): Promise<LineRequest | null> {
  if (!json.test(request.headers.get('Content-Type') ?? '')) return null
  const text = await readText(request)
  if (text === null) return null
  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    return null
  }
  return isLineRequest(body) ? body : null
}

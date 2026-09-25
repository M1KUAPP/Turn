import type { LineAnswer, LineRequest } from '@turn/shared/relay'

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const probability = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1

const probabilities = (value: unknown): value is Record<string, number> =>
  record(value) && Object.values(value).every(probability)

function validAnswer(value: unknown, line: LineRequest): value is LineAnswer {
  if (!record(value) || value.seq !== line.seq) return false
  const { kind, topic, scores } = value
  if (!probabilities(kind) || !probabilities(topic) || !probabilities(scores)) return false
  if (!['yes_no', 'either_or', 'open', 'not_a_question'].every((name) => name in kind)) return false
  if (Object.keys(scores).length !== line.candidates.length || line.candidates.some(({ id }) => !(id in scores)))
    return false
  const policy = value.policy
  if (!record(policy)) return false
  if (!['floor', 'bigAbove', 'margin'].every((name) => probability(policy[name]))) return false
  if (typeof policy.yesNoPhrases !== 'boolean') return false
  if (!Array.isArray(policy.noBigTopics) || !policy.noBigTopics.every((topic) => typeof topic === 'string'))
    return false
  if (!Array.isArray(policy.fixedOnlyTopics) || !policy.fixedOnlyTopics.every((topic) => typeof topic === 'string'))
    return false
  if (value.freeLinesLeft !== null && (!Number.isInteger(value.freeLinesLeft) || Number(value.freeLinesLeft) < 0))
    return false
  const ms = value.ms
  return (
    record(ms) &&
    typeof ms.jev === 'number' &&
    Number.isFinite(ms.jev) &&
    ms.jev >= 0 &&
    typeof ms.total === 'number' &&
    Number.isFinite(ms.total) &&
    ms.total >= 0
  )
}

type Options = {
  relayUrl: string
  userId: string
  version: string
  buildKind: 'device' | 'simulator'
  request: (url: string, init: RequestInit) => Promise<Response>
}

export class RelayLineError extends Error {
  constructor(
    readonly status: number,
    readonly code: string
  ) {
    super(code)
  }
}

/** Sends one already-tagged partner line to the relay. The TypeSafe key stays in the Worker. */
export async function postLine(
  { relayUrl, userId, version, buildKind, request }: Options,
  line: LineRequest,
  signal?: AbortSignal
) {
  const controller = new AbortController()
  const abort = () => controller.abort()
  if (signal?.aborted) abort()
  else signal?.addEventListener('abort', abort, { once: true })
  const timeout = setTimeout(() => controller.abort(), 3_000)
  try {
    const response = await request(`${relayUrl.replace(/\/+$/, '')}/v1/lines`, {
      method: 'POST',
      headers: {
        'X-Turn-User': userId,
        'X-Turn-Version': version,
        'X-Turn-Build': buildKind,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(line),
      signal: controller.signal
    })
    if (!response.ok) {
      const body: unknown = await response.json().catch(() => null)
      const code =
        typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'string'
          ? body.error
          : 'internal'
      throw new RelayLineError(response.status, code)
    }
    const answer: unknown = await response.json()
    if (!validAnswer(answer, line)) throw new Error('Invalid relay answer')
    return answer
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', abort)
  }
}

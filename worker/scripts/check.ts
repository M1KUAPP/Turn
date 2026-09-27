import { writeFile } from 'node:fs/promises'
import type { Config, LineRequest } from '@turn/shared/relay'
import { readFlags } from './flags'

/** The default relay URL, matching app/app.config.ts. */
export const DEFAULT_RELAY_URL = 'https://turn-relay.m1ku-turn.workers.dev'

/** The app's version, matching app/app.config.ts. */
export const APP_VERSION = '0.1.0'

/** The starter bank's categories, less the strip, as the app sends them (`app/src/content/starter-bank.json`). */
export const starterCategories = [
  { id: 'quick', name: 'Quick' },
  { id: 'chat', name: 'Chat' },
  { id: 'care', name: 'Care and help' },
  { id: 'body-pain', name: 'Body and pain' },
  { id: 'food', name: 'Food and drink' },
  { id: 'feelings', name: 'Feelings' },
  { id: 'family', name: 'Family and friends' },
  { id: 'health', name: 'Health' },
  { id: 'out-and-about', name: 'Out and about' }
] as const

/** 40 starter phrases with their real ids, including "It was hard", and no fixed button or strip phrase, as the app's shortlist has none. */
export const starterCandidates = [
  { id: 'it-was-hard', text: 'It was hard' },
  { id: 'it-went-well', text: 'It went well' },
  { id: 'im-here-for-my-appointment', text: "I'm here for my appointment" },
  { id: 'when-is-my-next-appointment', text: 'When is my next appointment?' },
  { id: 'can-i-talk-to-the-doctor', text: 'Can I talk to the doctor?' },
  { id: 'can-you-write-that-down-for-me', text: 'Can you write that down for me?' },
  { id: 'is-this-going-to-hurt', text: 'Is this going to hurt?' },
  { id: 'can-we-try-something-else', text: 'Can we try something else?' },
  { id: 'its-time-for-my-medicine', text: "It's time for my medicine" },
  { id: 'i-already-took-my-medicine', text: 'I already took my medicine' },
  { id: 'what-are-the-side-effects', text: 'What are the side effects?' },
  { id: 'i-need-a-refill', text: 'I need a refill' },
  { id: 'i-slept-well', text: 'I slept well' },
  { id: 'i-didnt-sleep-well', text: "I didn't sleep well" },
  { id: 'im-ready-for-bed', text: "I'm ready for bed" },
  { id: 'im-tired', text: "I'm tired" },
  { id: 'im-happy', text: "I'm happy" },
  { id: 'im-feeling-better', text: "I'm feeling better" },
  { id: 'im-cold', text: "I'm cold" },
  { id: 'im-too-hot', text: "I'm too hot" },
  { id: 'im-bored', text: "I'm bored" },
  { id: 'im-worried', text: "I'm worried" },
  { id: 'im-sad', text: "I'm sad" },
  { id: 'im-scared', text: "I'm scared" },
  { id: 'im-frustrated', text: "I'm frustrated" },
  { id: 'im-lonely', text: "I'm lonely" },
  { id: 'im-having-a-rough-day', text: "I'm having a rough day" },
  { id: 'im-in-a-bad-mood', text: "I'm in a bad mood" },
  { id: 'i-dont-feel-like-talking-right-now', text: "I don't feel like talking right now" },
  { id: 'i-love-it', text: 'I love it' },
  { id: 'i-dont-like-it', text: "I don't like it" },
  { id: 'stop-please', text: 'Stop, please' },
  { id: 'no-i-dont-want-that', text: "No, I don't want that" },
  { id: 'yes-go-ahead', text: 'Yes, go ahead' },
  { id: 'i-dont-know', text: "I don't know" },
  { id: 'i-have-something-to-say', text: 'I have something to say' },
  { id: 'it-hurts', text: 'It hurts' },
  { id: 'the-pain-is-gone', text: 'The pain is gone' },
  { id: 'the-pain-is-mild', text: 'The pain is mild' },
  { id: 'the-pain-is-bad', text: 'The pain is bad' }
] as const

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** Whether a value is a valid Config as the app checks it. */
export function isConfig(value: unknown): value is Config {
  if (!isRecord(value) || !isRecord(value.policy)) return false
  const { freeLinesLeft, policy } = value
  return (
    typeof value.jevOn === 'boolean' &&
    typeof value.typesafeNamed === 'boolean' &&
    (freeLinesLeft === null ||
      (typeof freeLinesLeft === 'number' && Number.isSafeInteger(freeLinesLeft) && freeLinesLeft >= 0)) &&
    typeof policy.floor === 'number' &&
    Number.isFinite(policy.floor) &&
    typeof policy.bigAbove === 'number' &&
    Number.isFinite(policy.bigAbove) &&
    typeof policy.margin === 'number' &&
    Number.isFinite(policy.margin) &&
    typeof policy.yesNoPhrases === 'boolean' &&
    Array.isArray(policy.noBigTopics) &&
    policy.noBigTopics.every((topic) => typeof topic === 'string') &&
    Array.isArray(policy.fixedOnlyTopics) &&
    policy.fixedOnlyTopics.every((topic) => typeof topic === 'string')
  )
}

export type StepResult = {
  name: 'config' | 'line'
  passed: boolean
  ms: number
  status?: number
  error?: string
  jevOn?: boolean
  freeLinesLeft?: number | null
  answerMs?: { jev: number; total: number }
  hardRank?: { place: number; total: number; score: number }
}

function isTimeoutError(error: unknown, signal: AbortSignal): boolean {
  if (signal.aborted) return true
  if (error instanceof Error) {
    const msg = error.message.toLowerCase()
    return msg.includes('timeout') || error.name === 'TimeoutError' || error.name === 'AbortError'
  }
  return false
}

/** Formats the Markdown report for the relay check, omitting any user UUID. */
export function formatReport({
  date,
  relayUrl,
  config,
  line
}: {
  date: Date
  relayUrl: string
  config: StepResult
  line?: StepResult
}): string {
  const passed = config.passed && (line?.passed ?? false)
  const iso = date.toISOString()
  const lines: string[] = [
    `### Relay check, ${iso.slice(0, 10)} ${iso.slice(11, 19)} UTC`,
    '',
    `- **Relay URL:** ${relayUrl}`,
    `- **Status:** ${passed ? 'passed' : 'failed'}`,
    `- Step ${config.name}: ${config.passed ? 'passed' : 'failed'} (${config.ms} ms)`
  ]
  if (config.passed) {
    lines.push(`  - \`jevOn\`: ${config.jevOn}`)
    lines.push(`  - \`freeLinesLeft\`: ${config.freeLinesLeft}`)
  } else {
    if (config.status !== undefined) lines.push(`  - HTTP status: ${config.status}`)
    if (config.error) lines.push(`  - Relay error code: ${config.error}`)
  }
  if (line) {
    lines.push(`- Step ${line.name}: ${line.passed ? 'passed' : 'failed'} (${line.ms} ms)`)
    if (line.passed) {
      if (line.answerMs) lines.push(`  - Answer ms: Jev ${line.answerMs.jev} ms, total ${line.answerMs.total} ms`)
      if (line.hardRank) {
        lines.push(
          `  - "It was hard": place ${line.hardRank.place} of ${line.hardRank.total} (score ${line.hardRank.score})`
        )
      }
    } else {
      if (line.status !== undefined) lines.push(`  - HTTP status: ${line.status}`)
      if (line.error) lines.push(`  - Relay error code: ${line.error}`)
    }
  } else if (!config.passed) {
    lines.push(`- **Step line:** skipped`)
  }
  return lines.join('\n')
}

/** Step 1: GET /v1/config. */
export async function checkConfig(
  relayUrl: string,
  userId: string,
  options: { fetch?: typeof globalThis.fetch; timeoutMs?: number } = {}
): Promise<StepResult> {
  const fetchFn = options.fetch ?? globalThis.fetch
  const timeoutMs = options.timeoutMs ?? 10_000
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(new Error('timeout')), timeoutMs)
  const started = Date.now()
  try {
    const response = await fetchFn(`${relayUrl}/v1/config`, {
      method: 'GET',
      headers: {
        'X-Turn-User': userId,
        'X-Turn-Version': APP_VERSION,
        'X-Turn-Build': 'simulator'
      },
      signal: controller.signal
    })
    const ms = Date.now() - started
    if (!response.ok) {
      const data: unknown = await response.json().catch(() => null)
      const code = isRecord(data) && typeof data.error === 'string' ? data.error : 'unknown'
      return { name: 'config', passed: false, ms, status: response.status, error: code }
    }
    const body: unknown = await response.json().catch(() => null)
    if (!isConfig(body)) {
      return { name: 'config', passed: false, ms, status: response.status, error: 'invalid_shape' }
    }
    return {
      name: 'config',
      passed: true,
      ms,
      status: response.status,
      jevOn: body.jevOn,
      freeLinesLeft: body.freeLinesLeft
    }
  } catch (err) {
    const ms = Date.now() - started
    const timeout = isTimeoutError(err, controller.signal)
    return {
      name: 'config',
      passed: false,
      ms,
      error: timeout ? 'timeout' : err instanceof Error ? err.message : 'network_error'
    }
  } finally {
    clearTimeout(timer)
  }
}

/** Step 2: POST /v1/lines. */
export async function checkLine(
  relayUrl: string,
  userId: string,
  options: { fetch?: typeof globalThis.fetch; timeoutMs?: number } = {}
): Promise<StepResult> {
  const fetchFn = options.fetch ?? globalThis.fetch
  const timeoutMs = options.timeoutMs ?? 10_000
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(new Error('timeout')), timeoutMs)
  const started = Date.now()
  const linePayload: LineRequest = {
    lineId: crypto.randomUUID(),
    seq: 1,
    line: 'How was physio?',
    place: 'Clinic',
    categories: starterCategories,
    candidates: starterCandidates
  }
  try {
    const response = await fetchFn(`${relayUrl}/v1/lines`, {
      method: 'POST',
      headers: {
        'X-Turn-User': userId,
        'X-Turn-Version': APP_VERSION,
        'X-Turn-Build': 'simulator',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(linePayload),
      signal: controller.signal
    })
    const ms = Date.now() - started
    if (!response.ok) {
      const data: unknown = await response.json().catch(() => null)
      const code = isRecord(data) && typeof data.error === 'string' ? data.error : 'unknown'
      return { name: 'line', passed: false, ms, status: response.status, error: code }
    }
    const body: unknown = await response.json().catch(() => null)
    if (!isRecord(body) || !isRecord(body.scores) || !isRecord(body.ms)) {
      return { name: 'line', passed: false, ms, status: response.status, error: 'invalid_shape' }
    }
    const scores = body.scores
    const candidateIds = starterCandidates.map((c) => c.id)
    const hasAll = candidateIds.every((id) => id in scores)
    const allValid = candidateIds.every((id) => {
      const s = scores[id]
      return typeof s === 'number' && Number.isFinite(s) && s >= 0 && s <= 1
    })
    if (!hasAll || !allValid) {
      return { name: 'line', passed: false, ms, status: response.status, error: 'invalid_scores' }
    }
    const sorted = [...starterCandidates].sort((a, b) => Number(scores[b.id] ?? 0) - Number(scores[a.id] ?? 0))
    const index = sorted.findIndex((c) => c.id === 'it-was-hard')
    const place = index + 1
    const score = Number(scores['it-was-hard'])
    const answerMs = {
      jev: typeof body.ms.jev === 'number' ? body.ms.jev : 0,
      total: typeof body.ms.total === 'number' ? body.ms.total : ms
    }
    return {
      name: 'line',
      passed: true,
      ms,
      status: response.status,
      answerMs,
      hardRank: { place, total: starterCandidates.length, score }
    }
  } catch (err) {
    const ms = Date.now() - started
    const timeout = isTimeoutError(err, controller.signal)
    return {
      name: 'line',
      passed: false,
      ms,
      error: timeout ? 'timeout' : err instanceof Error ? err.message : 'network_error'
    }
  } finally {
    clearTimeout(timer)
  }
}

export type CheckOptions = {
  fetch?: typeof globalThis.fetch
  timeoutMs?: number
  now?: () => Date
}

/** Runs the full check: config then line. */
export async function runCheck(
  relayUrl: string,
  options: CheckOptions = {}
): Promise<{ report: string; passed: boolean; config: StepResult; line?: StepResult }> {
  const userId = crypto.randomUUID()
  const date = options.now ? options.now() : new Date()
  const config = await checkConfig(relayUrl, userId, options)
  let line: StepResult | undefined
  if (config.passed) {
    line = await checkLine(relayUrl, userId, options)
  }
  const passed = config.passed && (line?.passed ?? false)
  const report = formatReport({ date, relayUrl, config, line })
  return { report, passed, config, line }
}

/**
 * `bun scripts/check.ts [--relay <url>] [--out <file>]`:
 * Checks the relay once as a Simulator install would, outputs a Markdown report,
 * and exits 0 on success, 1 on failure, 2 on bad flags.
 */
export async function main(
  args: readonly string[] = process.argv.slice(2),
  _env: Record<string, string | undefined> = process.env,
  options: CheckOptions = {}
): Promise<number> {
  const flags = readFlags(args, ['relay', 'out'])
  const { relay: givenRelay, out } = flags ?? {}
  if (!flags || (givenRelay !== undefined && givenRelay.trim() === '') || (out !== undefined && out.trim() === '')) {
    console.error('bun scripts/check.ts takes only --relay <url> and --out <file>.')
    return 2
  }
  let relayUrl = DEFAULT_RELAY_URL
  if (givenRelay !== undefined) {
    try {
      new URL(givenRelay)
      relayUrl = givenRelay.replace(/\/+$/, '')
    } catch {
      console.error('bun scripts/check.ts takes only --relay <url> and --out <file>.')
      return 2
    }
  }
  try {
    const { report, passed, config, line } = await runCheck(relayUrl, options)
    if (out) {
      await writeFile(out, `${report}\n`)
    } else {
      console.log(report)
    }
    if (!passed) {
      const failedStep = !config.passed ? config.name : line?.name
      console.error(`The relay check failed at step ${failedStep}.`)
      return 1
    }
    return 0
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    return 1
  }
}

if (import.meta.main) process.exitCode = await main(process.argv.slice(2), process.env)

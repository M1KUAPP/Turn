import type { Config, LineAnswer, LineRequest } from '@turn/shared/relay'
import { applyAnswer, emptyRow, phrasesInRow, type Answer, type Row } from '@turn/shared/row'
import { PhraseIndex, pickShortlist, rankOnPhone } from '@turn/shared/shortlist'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { bank, phrases, readRows } from './data'
import { jevLine } from './jev'
import { cell, table, wrap } from './prose'

/** A partner line as recorded, in conversation order, with the id of the place where it was said. */
export type RecordedLine = { text: string; place: string }

/** How one line went: who ranked it, and if the phone did, why; the row after it; and its slot changes and times. */
export type Replayed = {
  line: RecordedLine
  seq: number
  by: 'relay' | 'phone'
  /** The relay's error code, or what went wrong, when the phone ranked the line instead. */
  failure?: string
  row: Row
  /** How many of the six slots show a different phrase than before the line (ROW-5). */
  changes: number
  /** Whether the row still answers an earlier line. */
  held: boolean
  /** Milliseconds: the request's round trip, and the relay's own count of its time in Jev and in all. */
  ms?: { trip: number; jev: number; total: number }
}

/** The headers the relay checks, for the replay's made-up user, who counts as a Simulator build. */
const headers = (user: string) => ({
  'Content-Type': 'application/json',
  // Cloudflare's edge refuses some tools' default user agents.
  'User-Agent': 'turn-replay/1.0',
  'X-Turn-User': user,
  'X-Turn-Version': 'replay',
  'X-Turn-Build': 'simulator'
})

/**
 * Replays partner lines, in order, through a relay and the row's rules, as the app would with a fresh bank and no
 * microphone (EVAL-7). It gets the configuration once, as the app does at launch, and sends each line as a new user's,
 * with the next sequence number and a shortlist whose first phrases are the row's. The row takes each answer, with its
 * scores back in the shortlist's order and the policy it carries. When the relay fails or no answer comes within 3
 * seconds, the phone ranks the line with the cached policy (STATE-2), and with Jev off it ranks every line (STATE-3).
 * A `402` stops the replay, since the app would open the paywall there (STATE-4).
 */
export async function replay(
  lines: readonly RecordedLine[],
  relay: string,
  wait = 3000
): Promise<{ replayed: Replayed[]; stopped?: number }> {
  const user = randomUUID()
  const got = await fetch(`${relay}/v1/config`, { headers: headers(user), signal: AbortSignal.timeout(wait) })
  if (!got.ok) throw new Error(`The relay answered ${got.status} to GET /v1/config`)
  const config = (await got.json()) as Config
  const index = new PhraseIndex()
  const replayed: Replayed[] = []
  let row: Row = emptyRow
  for (const [i, line] of lines.entries()) {
    const seq = i + 1
    // One line at a time, so no answer arrives after a newer line's.
    const before = row
    const context = { bank: phrases, row: phrasesInRow(before), place: line.place, taps: new Map<string, number>() }
    const shortlist = pickShortlist(line.text, index, context)
    let answer: Answer | undefined
    let failure: string | undefined = config.jevOn ? undefined : 'jev_off'
    let ms: Replayed['ms']
    if (config.jevOn) {
      const request: LineRequest = { lineId: randomUUID(), seq, ...jevLine(line.text, line.place, shortlist) }
      const started = performance.now()
      try {
        const response = await fetch(`${relay}/v1/lines`, {
          method: 'POST',
          headers: headers(user),
          body: JSON.stringify(request),
          signal: AbortSignal.timeout(wait)
        })
        if (response.status === 402) return { replayed, stopped: seq }
        if (response.ok) {
          const body = (await response.json()) as LineAnswer
          const scores = new Map(shortlist.map(({ id }) => [id, body.scores[id] ?? 0]))
          answer = { kind: body.kind, topic: body.topic, scores, onPhone: false, seq: body.seq, policy: body.policy }
          ms = { trip: performance.now() - started, jev: body.ms.jev, total: body.ms.total }
        } else {
          const error = (await response.json().catch(() => null)) as { error?: string } | null
          failure = error?.error ?? `status ${response.status}`
        }
      } catch (error) {
        failure = error instanceof Error && error.name === 'TimeoutError' ? 'no answer in time' : 'unreachable'
      }
    }
    answer ??= { ...rankOnPhone(line.text, shortlist, index, context), seq, policy: config.policy }
    row = applyAnswer(before, answer)
    const changes = row.slots.filter((id, slot) => id !== before.slots[slot]).length
    replayed.push({ line, seq, by: failure ? 'phone' : 'relay', failure, row, changes, held: row.answers < seq, ms })
  }
  return { replayed }
}

/** What the row shows: the big button, or the six slots, an empty one as a dash. */
const shows = ({ big, slots }: Row) => (big !== null ? `big button: ${big}` : slots.map((id) => id ?? '-').join(', '))

/** The replay as Markdown: a row for each line, then the totals. */
export function render(file: string, relay: string, { replayed, stopped }: Awaited<ReturnType<typeof replay>>) {
  const plural = (count: number, one: string) => `${count} ${one}${count === 1 ? '' : 's'}`
  const changed = replayed.filter(({ changes }) => changes > 0).length
  const changes = replayed.reduce((sum, { changes }) => sum + changes, 0)
  const byPhone = replayed.filter(({ by }) => by === 'phone').length
  const summary =
    `Slot changes: ${changes} in all, on ${changed} of ${plural(replayed.length, 'line')}. The row held on ` +
    `${plural(replayed.filter(({ held }) => held).length, 'line')} and showed ` +
    `${plural(replayed.filter(({ row }) => row.big !== null).length, 'big button')}, and the phone ranked ` +
    `${plural(byPhone, 'line')}.`
  return [
    wrap(`Replayed ${plural(replayed.length, 'line')} of \`${file}\` through ${relay}, as a new user.`),
    table(
      ['#', 'The partner said', 'Ranked by', 'The row', 'Slot changes', 'Held', 'Milliseconds'],
      replayed.map(({ line, seq, by, failure, row, changes, held, ms }) => [
        String(seq),
        cell(line.text),
        failure ? `${by} (${failure})` : by,
        shows(row),
        String(changes),
        held ? 'held' : '',
        ms ? `${Math.round(ms.trip)} (Jev ${ms.jev}, relay ${ms.total})` : ''
      ])
    ),
    ...(stopped === undefined
      ? []
      : [
          wrap(
            `The relay answered 402 at line ${stopped}: the app would open the paywall there, so the replay stopped.`
          )
        ]),
    wrap(summary)
  ].join('\n\n')
}

/**
 * `bun run replay`: replays the lines in `eval/replay.jsonl`, or the file `--lines` names, one JSON object a line with
 * `text` and a starter-bank `place`, through the relay at `http://localhost:8787`, or the one `--relay` names, and
 * prints how the row went.
 */
export async function main(args: readonly string[]): Promise<void> {
  const { values } = parseArgs({ args: [...args], options: { lines: { type: 'string' }, relay: { type: 'string' } } })
  const file = values.lines ?? fileURLToPath(new URL('../replay.jsonl', import.meta.url))
  const relay = (values.relay ?? 'http://localhost:8787').replace(/\/+$/, '')
  const lines: RecordedLine[] = readRows(file)
  for (const [i, { text, place }] of lines.entries()) {
    if (typeof text !== 'string' || text.trim() === '') throw new Error(`Line ${i + 1} has no text`)
    if (!bank.places.some(({ id }) => id === place)) throw new Error(`Line ${i + 1}'s place isn't in the starter bank`)
  }
  console.log(render(values.lines ?? 'eval/replay.jsonl', relay, await replay(lines, relay)))
}

if (import.meta.main) await main(process.argv.slice(2))

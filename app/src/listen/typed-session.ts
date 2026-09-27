import { applyAnswer, clearRow, emptyRow, phrasesInRow, startingPolicy, type Row } from '@turn/shared/row'
import type { LineAnswer } from '@turn/shared/relay'
import type { Policy } from '@turn/shared/row'
import { PhraseIndex, pickShortlist, rankOnPhone, type Phrase } from '@turn/shared/shortlist'
import type { createBankStore } from '../bank/store'

type Bank = Pick<ReturnType<typeof createBankStore>, 'rankingData' | 'subscribe'>
type RankingData = Awaited<ReturnType<Bank['rankingData']>>
type Reply = { id: string; text: string }

export type RemoteRanker = {
  allowed(): boolean
  rank(input: {
    line: string
    place: string
    shortlist: readonly Phrase[]
    seq: number
    signal: AbortSignal
  }): Promise<LineAnswer & { candidateOrder?: readonly string[] }>
  policy?(): Policy
}

export type TypedListenState = {
  active: boolean
  row: Row
  line: string | null
  answeringLine: string | null
  rankedOnPhone: boolean
  degraded: boolean
  slots: readonly (Reply | null)[]
  bigButton: Reply | null
}

/** A typed-only Listen session. It ranks locally when a remote answer is unavailable. */
export function createTypedListenSession(bank: Bank, remote?: RemoteRanker) {
  const index = new PhraseIndex()
  const listeners = new Set<() => void>()
  const lines = new Map<number, string>()
  let data: RankingData = { bank: [], taps: new Map() }
  let revision = 0
  let request = 0
  let sequence = 0
  let inFlight: AbortController | null = null
  let failures: boolean[] = []
  let disposed = false
  let state: TypedListenState = {
    active: false,
    row: emptyRow,
    line: null,
    answeringLine: null,
    rankedOnPhone: false,
    degraded: false,
    slots: emptyRow.slots.map(() => null),
    bigButton: null
  }

  const show = (row: Row): Pick<TypedListenState, 'slots' | 'bigButton'> => {
    const byId = new Map(data.bank.map((phrase) => [phrase.id, phrase]))
    const reply = (id: string | null): Reply | null => {
      const phrase = id === null ? null : byId.get(id)
      return phrase ? { id: phrase.id, text: phrase.text } : null
    }
    return { slots: row.slots.map(reply), bigButton: reply(row.big) }
  }
  const publish = (next: Omit<TypedListenState, 'slots' | 'bigButton'>) => {
    if (disposed) return
    state = { ...next, ...show(next.row) }
    for (const listener of listeners) listener()
  }
  const refresh = async () => {
    const current = ++revision
    const next = await bank.rankingData()
    if (disposed || current !== revision) return
    data = next
    index.update(next.bank)
    publish(state)
  }
  const ready = refresh()
  const abort = () => {
    inFlight?.abort()
    inFlight = null
  }
  const currentLine = (current: number, seq: number) =>
    !disposed && state.active && current === request && state.row.seq === seq
  const complete = (seq: number, ranking: Parameters<typeof applyAnswer>[1], onPhone: boolean, degraded: boolean) => {
    const row = applyAnswer(state.row, ranking)
    publish({
      ...state,
      row,
      answeringLine: row.answers < seq ? (lines.get(row.answers) ?? null) : null,
      rankedOnPhone: onPhone,
      degraded
    })
  }
  const unsubscribeBank = bank.subscribe(() => {
    void refresh().catch(() => {
      // A later bank edit or typed line retries the local read.
    })
  })

  return {
    ready,
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot: () => state,
    start() {
      if (state.active) return
      publish({ ...state, active: true })
    },
    end() {
      request++
      abort()
      lines.clear()
      failures = []
      publish({ active: false, row: emptyRow, line: null, answeringLine: null, rankedOnPhone: false, degraded: false })
    },
    clear() {
      request++
      abort()
      lines.clear()
      publish({
        ...state,
        row: clearRow(state.row),
        line: null,
        answeringLine: null,
        rankedOnPhone: false
      })
    },
    cancelRemote() {
      abort()
    },
    async send(line: string, place: string) {
      const text = line.trim()
      if (!state.active || !text) return
      const current = ++request
      abort()
      const seq = ++sequence
      lines.set(seq, text)
      publish({ ...state, row: { ...state.row, seq }, line: text, rankedOnPhone: false })

      // Read again so a recent tap or bank edit is reflected even if its subscription refresh is still in flight.
      const next = await bank.rankingData()
      if (!currentLine(current, seq)) return
      data = next
      index.update(next.bank)
      const context = { bank: next.bank, row: phrasesInRow(state.row), place, taps: next.taps }
      const shortlist = pickShortlist(text, index, context)
      if (remote?.allowed()) {
        const controller = new AbortController()
        inFlight = controller
        try {
          const answer = await remote.rank({ line: text, place, shortlist, seq, signal: controller.signal })
          if (!currentLine(current, seq)) return
          if (remote.allowed()) {
            failures = [...failures, false].slice(-3)
            const scores = new Map(
              (answer.candidateOrder ?? shortlist.map(({ id }) => id)).map((id) => [id, answer.scores[id] ?? 0])
            )
            complete(seq, { ...answer, scores, onPhone: false }, false, false)
            return
          }
        } catch (cause) {
          if (!currentLine(current, seq)) return
          if (remote.allowed() && !controller.signal.aborted) {
            const off = typeof cause === 'object' && cause !== null && 'code' in cause && cause.code === 'jev_off'
            failures = [...failures, true].slice(-3)
            publish({ ...state, degraded: off || failures.filter(Boolean).length >= 2 })
          }
        } finally {
          if (inFlight === controller) inFlight = null
        }
      }
      if (!currentLine(current, seq)) return
      const ranking = rankOnPhone(text, shortlist, index, context)
      complete(seq, { ...ranking, seq, policy: remote?.policy?.() ?? startingPolicy }, true, state.degraded)
    },
    dispose() {
      disposed = true
      request++
      abort()
      unsubscribeBank()
      listeners.clear()
    }
  }
}

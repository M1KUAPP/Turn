import { applyAnswer, clearRow, emptyRow, phrasesInRow, startingPolicy, type Row } from '@turn/shared/row'
import { PhraseIndex, pickShortlist, rankOnPhone } from '@turn/shared/shortlist'
import type { createBankStore } from '../bank/store'

type Bank = Pick<ReturnType<typeof createBankStore>, 'rankingData' | 'subscribe'>
type RankingData = Awaited<ReturnType<Bank['rankingData']>>
type Reply = { id: string; text: string }

export type TypedListenState = {
  active: boolean
  row: Row
  line: string | null
  answeringLine: string | null
  rankedOnPhone: boolean
  slots: readonly (Reply | null)[]
  bigButton: Reply | null
}

/** A typed-only Listen session. It reads the local bank and never opens the microphone or contacts the relay. */
export function createTypedListenSession(bank: Bank) {
  const index = new PhraseIndex()
  const listeners = new Set<() => void>()
  const lines = new Map<number, string>()
  let data: RankingData = { bank: [], taps: new Map() }
  let revision = 0
  let request = 0
  let disposed = false
  let state: TypedListenState = {
    active: false,
    row: emptyRow,
    line: null,
    answeringLine: null,
    rankedOnPhone: false,
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
      lines.clear()
      publish({ active: false, row: emptyRow, line: null, answeringLine: null, rankedOnPhone: false })
    },
    clear() {
      request++
      lines.clear()
      publish({
        ...state,
        row: clearRow(state.row),
        line: null,
        answeringLine: null,
        rankedOnPhone: false
      })
    },
    async send(line: string, place: string) {
      const text = line.trim()
      if (!state.active || !text) return
      const current = ++request
      const seq = state.row.seq + 1
      lines.set(seq, text)
      publish({ ...state, row: { ...state.row, seq }, line: text, rankedOnPhone: false })

      // Read again so a recent tap or bank edit is reflected even if its subscription refresh is still in flight.
      const next = await bank.rankingData()
      if (disposed || !state.active || current !== request || state.row.seq !== seq) return
      data = next
      index.update(next.bank)
      const context = { bank: next.bank, row: phrasesInRow(state.row), place, taps: next.taps }
      const shortlist = pickShortlist(text, index, context)
      const ranking = rankOnPhone(text, shortlist, index, context)
      const row = applyAnswer(state.row, { ...ranking, seq, policy: startingPolicy })
      publish({
        ...state,
        row,
        answeringLine: row.answers < seq ? (lines.get(row.answers) ?? null) : null,
        rankedOnPhone: true
      })
    },
    dispose() {
      disposed = true
      request++
      unsubscribeBank()
      listeners.clear()
    }
  }
}

import type { LineAnswer, LineRequest } from '@turn/shared/relay'
import { rankable, type Phrase } from '@turn/shared/shortlist'
import type { createBankStore } from '../bank/store'
import type { createConfigClient } from '../relay/config'
import { postLine, RelayLineError } from '../relay/line'
import { fitRequest, tagRequest, type NameFinder } from './tags'

type Bank = Pick<ReturnType<typeof createBankStore>, 'categories' | 'places' | 'rankingData'>
type Config = Pick<ReturnType<typeof createConfigClient>, 'headers' | 'snapshot' | 'status' | 'lineResult'>

type Ports = {
  bank: Bank
  config: Config
  allowed(): boolean
  findNames: NameFinder
  relayUrl: string
  createId(): string
  request(url: string, init: RequestInit): Promise<Response>
}

export type RelayRankInput = {
  line: string
  place: string
  shortlist: readonly Phrase[]
  seq: number
  signal: AbortSignal
}

/** Builds the private request at send time, after checking the current consent state. */
export function createRelayRanker(ports: Ports) {
  return async ({
    line,
    place,
    shortlist,
    seq,
    signal
  }: RelayRankInput): Promise<LineAnswer & { candidateOrder: readonly string[] }> => {
    if (!ports.allowed() || signal.aborted) throw new Error('Relay request blocked')
    if (ports.config.status() === 'off') {
      ports.config.lineResult('off')
      throw new RelayLineError(503, 'jev_off')
    }
    if (!ports.relayUrl) throw new Error('Relay address unavailable')

    const [categories, places, rankingData] = await Promise.all([
      ports.bank.categories(),
      ports.bank.places(),
      ports.bank.rankingData()
    ])
    if (!ports.allowed() || signal.aborted) throw new Error('Relay request blocked')
    const shortlisted = new Set(shortlist.map(({ id }) => id))
    const tagged = await tagRequest(
      {
        line,
        place: places.find(({ id }) => id === place)?.name ?? '',
        categories: categories.map(({ id, name }) => ({ id, name })),
        candidates: shortlist.map(({ id, text }) => ({ id, text })),
        spares: rankingData.bank
          .filter((phrase) => rankable(phrase) && !shortlisted.has(phrase.id))
          .slice(0, 40)
          .map(({ id, text }) => ({ id, text }))
      },
      ports.findNames
    )
    if (!ports.allowed() || signal.aborted) throw new Error('Relay request blocked')
    if (ports.config.status() === 'off') {
      ports.config.lineResult('off')
      throw new RelayLineError(503, 'jev_off')
    }

    const lineRequest: LineRequest = fitRequest({ lineId: ports.createId(), seq, ...tagged })
    const headers = ports.config.headers()
    try {
      const answer = await postLine(
        {
          relayUrl: ports.relayUrl,
          userId: headers['X-Turn-User'],
          version: headers['X-Turn-Version'],
          buildKind: headers['X-Turn-Build'] === 'device' ? 'device' : 'simulator',
          request: ports.request
        },
        lineRequest,
        signal
      )
      ports.config.lineResult('working')
      return { ...answer, candidateOrder: lineRequest.candidates.map(({ id }) => id) }
    } catch (cause) {
      if (!signal.aborted) {
        ports.config.lineResult(cause instanceof RelayLineError && cause.code === 'jev_off' ? 'off' : 'unreachable')
      }
      throw cause
    }
  }
}

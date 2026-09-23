import MiniSearch from 'minisearch'
import { commonWords } from './common-words'
import type { Ranking } from './row'

/** A phrase in the user's bank, as the shortlist sees it. */
export type Phrase = {
  id: string
  text: string
  /** The ids of the places the phrase is tied to. */
  places: readonly string[]
  /** Yes, No, and Not sure. */
  fixed?: boolean
  /** The conversation strip's five. */
  strip?: boolean
}

/** The fixed buttons and the strip's phrases are never ranked (ROW-2, SPEAK-7). */
const rankable = (phrase: Phrase) => !phrase.fixed && !phrase.strip

const processTerm = (term: string) => {
  const word = term.toLowerCase()
  return commonWords.has(word) ? null : word
}

/** MiniSearch's BM25+ over the bank's phrases, with its defaults and without common words. */
export class PhraseIndex {
  private readonly search = new MiniSearch<{ id: string; text: string }>({ fields: ['text'], processTerm })
  /** Each indexed phrase's text, since MiniSearch removes a phrase by the text it indexed. */
  private readonly texts = new Map<string, string>()
  /** Each phrase's place in the bank, which breaks ties between equal scores. */
  private positions = new Map<string, number>()

  /**
   * Brings the index in line with the bank: adds new phrases, removes edited ones by their old text and adds them
   * again, and removes deleted ones. Removing keeps every match's score above 0, which MiniSearch's `discard` doesn't.
   */
  update(bank: readonly Phrase[]): void {
    this.positions = new Map(bank.map((phrase, i) => [phrase.id, i]))
    const ids = new Set<string>()
    for (const { id, text } of bank.filter(rankable)) {
      ids.add(id)
      const indexed = this.texts.get(id)
      if (indexed === text) continue
      if (indexed !== undefined) this.search.remove({ id, text: indexed })
      this.search.add({ id, text })
      this.texts.set(id, text)
    }
    for (const [id, text] of this.texts) {
      if (ids.has(id)) continue
      this.search.remove({ id, text })
      this.texts.delete(id)
    }
  }

  /** The ids of the phrases that share a word with the line, other than common words, best first. */
  match(line: string): string[] {
    const position = (id: string) => this.positions.get(id) ?? 0
    return this.search
      .search(line)
      .sort((a, b) => b.score - a.score || position(a.id) - position(b.id))
      .map((result) => result.id)
  }
}

/** What the shortlist reads from the phone for one line. */
export type Context = {
  /** The whole bank, in the grid's order. */
  bank: readonly Phrase[]
  /** The ids of the phrases in the row: the big button's first, then the slots'. */
  row: readonly string[]
  /** The id of the place the user is in. */
  place: string
  /** Each phrase's taps over the last 30 days, by id. */
  taps: ReadonlyMap<string, number>
}

/** The candidates Jev scores for a line, in the TRD's order and without duplicates (ROW-2). */
export function pickShortlist(line: string, index: PhraseIndex, { bank, row, place, taps }: Context): Phrase[] {
  index.update(bank)
  const byId = new Map(bank.filter(rankable).map((phrase) => [phrase.id, phrase]))
  const picked = new Map<string, Phrase>()
  const take = (ids: Iterable<string>, limit: number) => {
    let taken = 0
    for (const id of ids) {
      if (taken === limit || picked.size === 40) return
      const phrase = byId.get(id)
      if (!phrase || picked.has(id)) continue
      picked.set(id, phrase)
      taken++
    }
  }
  const tapsOf = (phrase: Phrase) => taps.get(phrase.id) ?? 0
  const idsOf = (phrases: Phrase[]) => phrases.map((phrase) => phrase.id)
  // A stable sort, so the grid's order breaks ties.
  const byTaps = [...byId.values()].sort((a, b) => tapsOf(b) - tapsOf(a))
  take(row, Infinity)
  take(index.match(line), 24)
  take(idsOf(byTaps.filter((phrase) => tapsOf(phrase) > 0)), 8)
  take(idsOf(byTaps.filter((phrase) => phrase.places.includes(place))), 8)
  take(idsOf(byTaps), Infinity)
  return [...picked.values()]
}

/** The forms of "do", "be", and "have", the modal verbs, and their negatives, which open a yes-or-no question. */
const yesNoOpeners: ReadonlySet<string> = new Set(
  `
  do does did don't doesn't didn't am is are was were isn't aren't wasn't weren't have has had haven't hasn't hadn't
  can could may might must shall should will would
  can't cannot couldn't mightn't mustn't shan't shouldn't won't wouldn't
  `
    .trim()
    .split(/\s+/)
)

/** Whether the phone counts a line as a yes-or-no question: it starts with one of the openers above. */
export function isYesNo(line: string): boolean {
  const first = /^\W*([a-z]+(?:'[a-z]+)?)/.exec(line.toLowerCase().replaceAll('’', "'"))
  return first !== null && yesNoOpeners.has(first[1])
}

/**
 * The phone's own ranking of a line over its shortlist (STATE-1): each phrase that shares a word with the line, other
 * than common words, scores 1, the place's first, then by taps, then by keyword rank; the rest score 0. The caller adds
 * the line's sequence number and the cached policy for the row's rules, which never show it as a big button.
 */
export function rankOnPhone(
  line: string,
  shortlist: readonly Phrase[],
  index: PhraseIndex,
  { place, taps }: Pick<Context, 'place' | 'taps'>
): Ranking {
  const rank = new Map(index.match(line).map((id, i) => [id, i]))
  const atPlace = (phrase: Phrase) => (phrase.places.includes(place) ? 1 : 0)
  const tapsOf = (phrase: Phrase) => taps.get(phrase.id) ?? 0
  const rankOf = (phrase: Phrase) => rank.get(phrase.id) ?? Infinity
  const sharing = shortlist
    .filter((phrase) => rank.has(phrase.id))
    .sort((a, b) => atPlace(b) - atPlace(a) || tapsOf(b) - tapsOf(a) || rankOf(a) - rankOf(b))
  const rest = shortlist.filter((phrase) => !rank.has(phrase.id))
  return {
    kind: { yes_no: isYesNo(line) ? 1 : 0, either_or: 0, open: 0, not_a_question: 0 },
    topic: {},
    scores: new Map([
      ...sharing.map((phrase) => [phrase.id, 1] as const),
      ...rest.map((phrase) => [phrase.id, 0] as const)
    ]),
    onPhone: true
  }
}

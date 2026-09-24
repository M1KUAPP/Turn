import type { Ranking } from '@turn/shared/row'
import { isYesNo, rankOnPhone, type Context, type Phrase, type PhraseIndex } from '@turn/shared/shortlist'

/**
 * Orders a line's shortlist, as the phone's own ranking does, for the row's rules to turn into a row. A ranker that
 * calls a model answers later.
 */
export type Ranker = (
  line: string,
  shortlist: readonly Phrase[],
  index: PhraseIndex,
  context: Context
) => Ranking | Promise<Ranking>

/**
 * For a ranker whose scores aren't probabilities: the ranking the row's rules see at a cut-off, which five-fold
 * cross-validation sets (EVAL-2).
 */
export type AtCutOff = (ranking: Ranking, cutOff: number) => Ranking

/** The phone's yes-or-no rule as a kind of question, for a ranker that calls no kind of its own. */
export const phoneKind = (line: string): Ranking['kind'] => ({
  yes_no: isYesNo(line) ? 1 : 0,
  either_or: 0,
  open: 0,
  not_a_question: 0
})

/** The phone's own ranking: phrases sharing a word with the line score 1, and a line with none holds (STATE-1). */
export const keyword = rankOnPhone satisfies Ranker

/**
 * The place's phrases alone, with no use of the line: they score 1 and the rest of the shortlist 0, each group in the
 * bank's order. Like the phone's own ranking it never brings a big button, and with no kind it never brings the fixed
 * buttons either.
 */
export const place = ((_line, shortlist, _index, { bank, place }): Ranking => {
  const shortlisted = new Set(shortlist.map((phrase) => phrase.id))
  const ordered = bank.filter((phrase) => shortlisted.has(phrase.id))
  const atPlace = (phrase: Phrase) => phrase.places.includes(place)
  return {
    kind: { yes_no: 0, either_or: 0, open: 0, not_a_question: 0 },
    topic: {},
    scores: new Map([
      ...ordered.filter(atPlace).map((phrase) => [phrase.id, 1] as const),
      ...ordered.filter((phrase) => !atPlace(phrase)).map((phrase) => [phrase.id, 0] as const)
    ]),
    onPhone: true
  }
}) satisfies Ranker

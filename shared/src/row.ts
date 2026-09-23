/** The rules' settings, which come with every answer, so the team can change them without an app build (ROW-8). */
export type Policy = {
  /** A phrase at or above it can show; a shown phrase below it is stale. */
  floor: number
  /** A top phrase above it shows as the big button. */
  bigAbove: number
  /** How much a new phrase must beat the lowest one shown by to take its slot. */
  margin: number
  /** Whether phrases fill slots 4 to 6 beside Yes, No, and Not sure. */
  yesNoPhrases: boolean
  /** The topics that never get a big button. */
  noBigTopics: readonly string[]
  /** The topics that get only the fixed buttons. */
  fixedOnlyTopics: readonly string[]
}

/** The TRD's starting values, for the relay to serve and for the app before it has cached a policy. */
export const startingPolicy: Policy = {
  floor: 0.6,
  bigAbove: 0.85,
  margin: 0.15,
  yesNoPhrases: true,
  noBigTopics: ['body-pain', 'consent'],
  fixedOnlyTopics: []
}

export type Kind = 'yes_no' | 'either_or' | 'open' | 'not_a_question'

/** A line's ranking, by Jev through the relay or by the phone itself. */
export type Ranking = {
  /** How likely the line is each kind of question. */
  kind: Readonly<Record<Kind, number>>
  /** How likely the line is about each topic: the user's category ids, plus `consent`. */
  topic: Readonly<Record<string, number>>
  /** Each candidate's score, from 0 to 1, in the shortlist's order, which breaks ties. */
  scores: ReadonlyMap<string, number>
  /** Whether the phone ranked the line itself, which never brings a big button (STATE-1). */
  onPhone: boolean
}

/** A ranking for one line, with the policy the rules follow. */
export type Answer = Ranking & { seq: number; policy: Policy }

/** What the row shows. The rules return a new row and never change the one they're given. */
export type Row = {
  /** The newest line's sequence number: the app raises it when a line starts, and an older line's answer is dropped. */
  seq: number
  /** The big button's phrase, shown across the row over the six slots. */
  big: string | null
  /** Whether Yes, No, and Not sure hold slots 1 to 3. */
  fixedButtons: boolean
  /** The six slots' phrases: null for an empty slot, or one a fixed button holds. */
  slots: readonly (string | null)[]
  /** The category whose tab is marked. */
  tab: string | null
}

export const emptyRow: Row = Object.freeze({
  seq: 0,
  big: null,
  fixedButtons: false,
  slots: Object.freeze([null, null, null, null, null, null]),
  tab: null
})

/** The key with the highest value, the first of any tie, or null when there's none. */
const mostLikely = <K extends string>(odds: Readonly<Record<K, number>>): K | null => {
  let best: K | null = null
  for (const [key, value] of Object.entries(odds) as [K, number][]) if (best === null || value > odds[best]) best = key
  return best
}

/** Applies the TRD's rules for the row to an answer. Nothing here speaks; only a tap does (ROW-6). */
export function applyAnswer(row: Row, { seq, topic: topics, scores, policy }: Answer): Row {
  if (seq < row.seq) return row
  const topic = mostLikely(topics)
  // A stable sort, so the shortlist's order breaks ties.
  const fresh = [...scores].filter(([, score]) => score >= policy.floor).sort(([, a], [, b]) => b - a)
  const top = fresh[0]
  if (top && top[1] > policy.bigAbove && !(topic !== null && policy.noBigTopics.includes(topic))) {
    return { ...row, seq, big: top[0] }
  }
  const slots = [...row.slots]
  for (const [id] of fresh) {
    const empty = slots.indexOf(null)
    if (empty === -1) break
    slots[empty] = id
  }
  return { ...row, seq, slots }
}

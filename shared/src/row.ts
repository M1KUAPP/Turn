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

/** Yes, No, and Not sure: the fixed buttons' phrase ids, in the order they take slots 1 to 3 (ROW-4). */
export const fixedButtons: readonly string[] = Object.freeze(['yes', 'no', 'not-sure'])

/** What the row shows. The rules return a new row and never change the one they're given. */
export type Row = {
  /** The newest line's sequence number: the app raises it when a line starts, and an older line's answer is dropped. */
  seq: number
  /** The line the row's phrases answer. A hold leaves it behind, so the caption can say which line that is (ROW-3). */
  answers: number
  /** The big button's phrase, shown across the row over the six slots. */
  big: string | null
  /** The six slots' phrase ids, the fixed buttons' among them, or null for an empty slot. */
  slots: readonly (string | null)[]
  /** The category whose tab is marked. */
  tab: string | null
}

export const emptyRow: Row = Object.freeze({
  seq: 0,
  answers: 0,
  big: null,
  slots: Object.freeze([null, null, null, null, null, null]),
  tab: null
})

/** Floating-point slack, so a phrase that beats another by exactly the margin counts as beating it. */
const slack = 1e-9

/** The keys with the highest probability: more than one for a tie, and none for an empty record. */
const mostLikely = (probabilities: Readonly<Record<string, number>>): string[] => {
  const highest = Math.max(...Object.values(probabilities))
  return Object.keys(probabilities).filter((key) => probabilities[key] === highest)
}

/** Applies the TRD's rules for the row to an answer. Nothing here speaks; only a tap does (ROW-6). */
export function applyAnswer(row: Row, { seq, kind, topic, scores, policy, onPhone }: Answer): Row {
  if (seq < row.seq) return row
  // A tie for the most likely topic counts as each tied topic for the safety rules, and marks no tab.
  const topics = mostLikely(topic)
  const tab = topics.length === 1 && topic[topics[0]] >= policy.floor ? topics[0] : null
  const kinds = mostLikely(kind)
  const yesNo = kinds.length === 1 && kinds[0] === 'yes_no' && kind.yes_no >= policy.floor
  const fixedTopic = topics.some((likely) => policy.fixedOnlyTopics.includes(likely))
  const showFixed = yesNo || fixedTopic
  const phrasesAllowed = !fixedTopic && (!yesNo || policy.yesNoPhrases)
  // A stable sort, so the shortlist's order breaks ties.
  const fresh = [...scores].filter(([, score]) => score >= policy.floor).sort(([, a], [, b]) => b - a)
  const top = fresh[0]
  // Nothing reaches the floor, so the row holds, still answering its earlier line (ROW-3).
  if (!showFixed && !top) return { ...row, seq, tab }
  const bigAllowed = !showFixed && !onPhone && !topics.some((likely) => policy.noBigTopics.includes(likely))
  if (bigAllowed && top && top[1] > policy.bigAbove) return { ...row, seq, answers: seq, big: top[0], tab }
  const slots = row.slots.map((id) => (id !== null && fixedButtons.includes(id) ? null : id))
  if (showFixed) slots.splice(0, 3, ...fixedButtons)
  if (!phrasesAllowed) slots.fill(null, 3)
  const usable = !showFixed ? [0, 1, 2, 3, 4, 5] : phrasesAllowed ? [3, 4, 5] : []
  const scoreAt = (i: number) => {
    const id = slots[i]
    return id === null ? 0 : (scores.get(id) ?? 0)
  }
  /** The lowest-scoring of the slots, the first of any tie. */
  const lowest = (indices: number[]) =>
    indices.reduce<number | undefined>(
      (low, i) => (low === undefined || scoreAt(i) < scoreAt(low) ? i : low),
      undefined
    )
  /** The first empty slot, or else the lowest-scoring stale one: a shown phrase now below the floor. */
  const free = () => usable.find((i) => slots[i] === null) ?? lowest(usable.filter((i) => scoreAt(i) < policy.floor))
  // After a big button, its phrase takes a free slot first if it still reaches the floor.
  if (row.big !== null && !slots.includes(row.big) && (scores.get(row.big) ?? 0) >= policy.floor) {
    const slot = free()
    if (slot !== undefined) slots[slot] = row.big
  }
  for (const [id, score] of fresh) {
    if (slots.includes(id)) continue
    const slot = free()
    if (slot !== undefined) {
      slots[slot] = id
      continue
    }
    // A new phrase must beat the lowest shown, and by at least the margin.
    const low = lowest(usable)
    if (low === undefined || score <= scoreAt(low) || score - scoreAt(low) < policy.margin - slack) break
    slots[low] = id
  }
  return { ...row, seq, answers: seq, big: null, slots, tab }
}

/** Empties the row, forgets the big button's phrase, and unmarks the tab, keeping the newest line's number (ROW-10). */
export function clearRow(row: Row): Row {
  return { ...emptyRow, seq: row.seq, answers: row.seq }
}

/** The phrases in the row, for the shortlist's first step: the big button's, then the slots', never a fixed button. */
export function phrasesInRow({ big, slots }: Row): string[] {
  return [big, ...slots].filter((id): id is string => id !== null && !fixedButtons.includes(id))
}

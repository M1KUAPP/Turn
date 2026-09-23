import type { LineRequest } from './relay'
import type { Kind, Ranking } from './row'

/** What Jev reads for one line: the line and the place, the categories for its topic, and the shortlist to score. */
export type JevLine = Pick<LineRequest, 'line' | 'place' | 'categories' | 'candidates'>

type Choice = { type: 'choice'; instructions: string; criteria: Record<string, string> }
type Noul = { type: 'noul'; instructions: { phrase: string; question: string } }

/** The body of one request to Jev, in the shape TypeSafe's SDK takes and sends as it is. */
export type JevRequest = {
  model: string
  state: { partner_line: string; place: string }
  questions: { kind: Choice; topic: Choice } & Record<string, Choice | Noul>
}

/** Each kind of question, as Jev reads it. */
const kinds: Record<Kind, string> = {
  yes_no: 'Can be answered with yes or no',
  either_or: 'Asks the listener to pick one of the options it names',
  open: "Needs an answer in the listener's own words",
  not_a_question: 'A statement, greeting, or comment, not a question'
}

const kindKeys = Object.keys(kinds) as Kind[]

/** The topic every line may have besides the user's categories, which the row's safety rules follow (ROW-3). */
const consent = 'Agreeing to or refusing care, treatment, or a procedure'

const answers = '`phrase` answers what the partner just said in `partner_line`.'

/** The question's key for the candidate at an index: `c00` to `c39`, which never reach the model. */
const keyFor = (index: number) => `c${String(index).padStart(2, '0')}`

/**
 * Builds the request for one line: the kind, the topic over the user's category ids plus `consent`, and one Noul per
 * candidate, in the candidates' order, with the model pinned (SEC-2).
 */
export function buildJevRequest({ line, place, categories, candidates }: JevLine, model: string): JevRequest {
  const topics = Object.fromEntries(categories.map(({ id, name }) => [id, name]))
  return {
    model,
    state: { partner_line: line, place },
    questions: {
      kind: { type: 'choice', instructions: 'What kind of question is `partner_line`?', criteria: { ...kinds } },
      topic: { type: 'choice', instructions: 'What topic is `partner_line` about?', criteria: { ...topics, consent } },
      ...Object.fromEntries(
        candidates.map(({ text }, i) => [
          keyFor(i),
          { type: 'noul', instructions: { phrase: text, question: answers } }
        ])
      )
    }
  }
}

/** Whether a value is a JSON object: not null, and not a list. */
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** A probability from Jev's answer, which must be a number from 0 to 1. */
const probability = (value: unknown, key: string): number => {
  if (typeof value !== 'number' || !(value >= 0 && value <= 1)) throw new Error(`Jev gave no probability for ${key}`)
  return value
}

/** The probability of each option a Choice asked about, in the order it asked. */
const readChoice = <K extends string>(answer: unknown, key: string, options: readonly K[]) => {
  if (!isRecord(answer) || answer.type !== 'choice' || !isRecord(answer.probabilities)) {
    throw new Error(`Jev's answer to ${key} isn't a Choice`)
  }
  const { probabilities } = answer
  const read = (option: K) => probability(probabilities[option], key)
  return Object.fromEntries(options.map((option) => [option, read(option)])) as Record<K, number>
}

/**
 * Reads Jev's answers to the request `buildJevRequest` made for the same line into the row's ranking, with each
 * candidate's score by its id in the candidates' order, which breaks ties. TypeSafe's SDK doesn't check Jev's answers,
 * so one that is missing or out of shape throws.
 */
export function readJevAnswer(answers: unknown, { categories, candidates }: JevLine): Ranking {
  if (!isRecord(answers)) throw new Error("Jev's answers aren't an object")
  const noul = (key: string) => {
    const answer = answers[key]
    if (!isRecord(answer) || answer.type !== 'noul') throw new Error(`Jev's answer to ${key} isn't a Noul`)
    return probability(answer.noul, key)
  }
  return {
    kind: readChoice(answers.kind, 'kind', kindKeys),
    topic: readChoice(answers.topic, 'topic', [...categories.map(({ id }) => id), 'consent']),
    scores: new Map(candidates.map(({ id }, i) => [id, noul(keyFor(i))])),
    onPhone: false
  }
}

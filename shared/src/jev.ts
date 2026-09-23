import type { LineRequest } from './relay'
import type { Kind } from './row'

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

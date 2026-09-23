import { describe, expect, test } from 'vitest'
import { buildJevRequest, type JevLine } from '../src/jev'

const line: JevLine = {
  line: 'How was physio today, [PERSON 1]?',
  place: 'Clinic',
  categories: [
    { id: 'feelings', name: 'Feelings' },
    { id: 'body-pain', name: 'Body and pain' }
  ],
  candidates: [
    { id: 'hard', text: 'It was hard' },
    { id: 'well', text: 'It went well' }
  ]
}

/** Forty candidates, as the shortlist sends them. */
const forty = Array.from({ length: 40 }, (_, i) => ({ id: `p${i}`, text: `Phrase ${i}` }))

describe('buildJevRequest', () => {
  test('pins the model and puts only the line and the place in the state (SEC-2)', () => {
    const request = buildJevRequest(line, 'jev-1.13.0')
    expect(request.model).toBe('jev-1.13.0')
    expect(request.state).toEqual({ partner_line: 'How was physio today, [PERSON 1]?', place: 'Clinic' })
  })

  test('asks for the kind of question in the TRD words', () => {
    expect(buildJevRequest(line, 'jev-1.13.0').questions.kind).toEqual({
      type: 'choice',
      instructions: 'What kind of question is `partner_line`?',
      criteria: {
        yes_no: 'Can be answered with yes or no',
        either_or: 'Asks the listener to pick one of the options it names',
        open: "Needs an answer in the listener's own words",
        not_a_question: 'A statement, greeting, or comment, not a question'
      }
    })
  })

  test("asks for the topic over the user's category ids, each described by its name, then consent", () => {
    const { topic } = buildJevRequest(line, 'jev-1.13.0').questions
    expect(topic).toEqual({
      type: 'choice',
      instructions: 'What topic is `partner_line` about?',
      criteria: {
        feelings: 'Feelings',
        'body-pain': 'Body and pain',
        consent: 'Agreeing to or refusing care, treatment, or a procedure'
      }
    })
    expect(Object.keys(topic.criteria)).toEqual(['feelings', 'body-pain', 'consent'])
  })

  test('asks one Noul per candidate, c00 to c39 in the request order', () => {
    const { questions } = buildJevRequest({ ...line, candidates: forty }, 'jev-1.13.0')
    const keys = Object.keys(questions).filter((key) => key !== 'kind' && key !== 'topic')
    expect(keys).toEqual(Array.from({ length: 40 }, (_, i) => `c${String(i).padStart(2, '0')}`))
    expect(questions.c00).toEqual({
      type: 'noul',
      instructions: { phrase: 'Phrase 0', question: '`phrase` answers what the partner just said in `partner_line`.' }
    })
    expect(questions.c39).toMatchObject({ instructions: { phrase: 'Phrase 39' } })
  })

  test('asks only the kind and the topic when there are no candidates', () => {
    expect(Object.keys(buildJevRequest({ ...line, candidates: [] }, 'jev-1.13.0').questions)).toEqual(['kind', 'topic'])
  })
})

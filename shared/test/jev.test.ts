import { describe, expect, test } from 'vitest'
import { buildJevRequest, readJevAnswer, type JevLine } from '../src/jev'

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

describe('readJevAnswer', () => {
  const kind = {
    type: 'choice',
    choice: 'open',
    confidence: 0.7,
    probabilities: { yes_no: 0.1, either_or: 0.1, open: 0.7, not_a_question: 0.1 }
  }
  const topic = {
    type: 'choice',
    choice: 'body-pain',
    confidence: 0.8,
    probabilities: { feelings: 0.15, 'body-pain': 0.8, consent: 0.05 }
  }
  /** Jev's answers to the line above, in an order of Jev's own. */
  const answers = { c01: { type: 'noul', noul: 0.4 }, topic, c00: { type: 'noul', noul: 0.9 }, kind }

  test("scores each candidate by its id, in the candidates' order, whatever the answers' order", () => {
    expect([...readJevAnswer(answers, line).scores]).toEqual([
      ['hard', 0.9],
      ['well', 0.4]
    ])
  })

  test("returns the kind's and the topic's probabilities, as a ranking Jev made, not the phone", () => {
    const ranking = readJevAnswer(answers, line)
    expect(ranking.kind).toEqual({ yes_no: 0.1, either_or: 0.1, open: 0.7, not_a_question: 0.1 })
    expect(ranking.topic).toEqual({ feelings: 0.15, 'body-pain': 0.8, consent: 0.05 })
    expect(ranking.onPhone).toBe(false)
  })

  test.each([
    ['a missing Noul', { ...answers, c01: undefined }],
    ['a Noul above 1', { ...answers, c01: { type: 'noul', noul: 1.2 } }],
    ['a Noul that is not a number', { ...answers, c01: { type: 'noul', noul: '0.4' } }],
    ['a Choice where a Noul belongs', { ...answers, c01: { ...kind, noul: 0.4 } }],
    ['a missing kind', { ...answers, kind: undefined }],
    ['a kind without one of its options', { ...answers, kind: { ...kind, probabilities: { yes_no: 0.5, open: 0.5 } } }],
    [
      'a topic without consent',
      { ...answers, topic: { ...topic, probabilities: { feelings: 0.2, 'body-pain': 0.8 } } }
    ],
    ['no answers', null]
  ])('throws for %s', (_, bad) => {
    expect(() => readJevAnswer(bad, line)).toThrow()
  })
})

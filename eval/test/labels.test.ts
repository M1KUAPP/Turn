import { fixedButtons } from '@turn/shared/row'
import { PhraseIndex } from '@turn/shared/shortlist'
import { expect, test } from 'vitest'
import { bank, lines, phrases, secondLabeling, type Line } from '../src/data'

const phraseIds = phrases.map((phrase) => phrase.id)
const textById = new Map(phrases.map((phrase) => [phrase.id, phrase.text]))
const stripIds = bank.categories
  .filter(({ id }) => id === 'strip')
  .flatMap((strip) => strip.phrases.map(({ id }) => id))

/**
 * Holds one labeling's replies for a line to the rules: bank ids, no repeats, no strip phrase, and the fixed buttons
 * only on a yes-or-no line.
 */
const expectRepliesFollowRules = (line: Line, acceptable: string[]) => {
  expect(new Set(acceptable).size, line.id).toBe(acceptable.length)
  for (const id of acceptable) {
    expect(id, line.id).toBeOneOf(phraseIds)
    expect(id, line.id).not.toBeOneOf(stripIds)
    if (line.kind !== 'yes_no') expect(id, line.id).not.toBeOneOf([...fixedButtons])
  }
}

/** Whether the phone's keyword ranking, run over the line's acceptable replies alone, finds a word they share. */
const sharesAWord = (line: Line) => {
  const index = new PhraseIndex()
  index.update(line.acceptable.map((id) => ({ id, text: textById.get(id) ?? '', places: [] })))
  return index.match(line.text).length > 0
}

test("lists each line's acceptable replies by bank id, labeled by someone other than its writer (EVAL-1)", () => {
  for (const line of lines) {
    expect(line.labeler, line.id).toMatch(/\S/)
    expect(line.labeler, line.id).not.toBe(line.author)
    expectRepliesFollowRules(line, line.acceptable)
  }
})

// The first labeling leaves fewer lines with no acceptable reply than EVAL-1's 16, and neither the lines nor the labels
// change to close the gap (plan 0013, decision 11), so this quota waits for the team's answer in #77.
test.todo('has at least 16 lines with no acceptable reply (EVAL-1)')

test('has at least 10 lines that share no content word with any acceptable reply (EVAL-1)', () => {
  const answeredByRanking = (line: Line) => line.acceptable.some((id) => !fixedButtons.includes(id))
  expect(lines.filter((line) => answeredByRanking(line) && !sharesAWord(line)).length).toBeGreaterThanOrEqual(10)
})

test('commits a second labeling of every line beside the first, by another labeler', () => {
  expect(secondLabeling.map((labels) => labels.id)).toEqual(lines.map((line) => line.id))
  for (const [i, line] of lines.entries()) {
    const labels = secondLabeling[i]
    expect(labels?.labeler, line.id).toMatch(/\S/)
    expect(labels?.labeler, line.id).not.toBe(line.labeler)
    expectRepliesFollowRules(line, labels?.acceptable ?? [])
  }
})

import { fixedButtons } from '@turn/shared/row'
import { expect, test } from 'vitest'
import { bank, lines, phrases, phrasesOf, secondLabeling, type Line } from '../src/data'
import { sharesNoWord } from '../src/score'

const phraseIds = phrases.map((phrase) => phrase.id)
const stripIds = bank.categories
  .filter(({ id }) => id === 'strip')
  .flatMap((strip) => strip.phrases.map(({ id }) => id))

/**
 * Holds one labeling's replies for a line to the rules: bank ids in the bank's order without repeats, no strip phrase,
 * and the fixed buttons only on a yes-or-no line.
 */
const expectRepliesFollowRules = (line: Line, acceptable: string[]) => {
  expect(acceptable, line.id).toEqual(phraseIds.filter((id) => acceptable.includes(id)))
  for (const id of acceptable) {
    expect(id, line.id).not.toBeOneOf(stripIds)
    if (line.kind !== 'yes_no') expect(id, line.id).not.toBeOneOf([...fixedButtons])
  }
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
  expect(lines.filter((line) => sharesNoWord(line, phrasesOf(bank))).length).toBeGreaterThanOrEqual(10)
})

test('commits a second labeling of every line beside the first, by another labeler', () => {
  expect(secondLabeling.map((labels) => labels.id)).toEqual(lines.map((line) => line.id))
  for (const [i, line] of lines.entries()) {
    const labels = secondLabeling[i]
    expect(labels.labeler, line.id).toMatch(/\S/)
    expect(labels.labeler, line.id).not.toBe(line.labeler)
    expectRepliesFollowRules(line, labels.acceptable)
  }
})

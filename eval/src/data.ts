import { readFileSync } from 'node:fs'

/** A partner line, as its writer wrote it and its first labeler labeled it (EVAL-1). */
export type Line = {
  id: string
  author: string
  text: string
  kind: string
  place: string
  topic: string
  concerns: string[]
  /** Who listed the line's acceptable replies. */
  labeler: string
  /** The starter-bank ids of every acceptable reply, in the bank's order, or none. */
  acceptable: string[]
}

/** One line's acceptable replies in the second labeling, which only the labelers' agreement reads. */
export type Labels = Pick<Line, 'id' | 'labeler' | 'acceptable'>

export type Phrase = { id: string; text: string; fixed: boolean; places: string[] }
export type Category = { id: string; name: string; fixed: boolean; phrases: Phrase[] }
export type StarterBank = { categories: Category[]; places: { id: string; name: string }[] }

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')

/** Reads a JSON Lines file, one object per row. */
const readRows = (path: string) =>
  read(path)
    .trim()
    .split('\n')
    .map((row) => JSON.parse(row))

/** The 80 partner lines in `eval/lines.jsonl`, with the first labeling. */
export const lines: Line[] = readRows('../lines.jsonl')

/** The second labeling in `eval/second-labeling.jsonl`, in the lines' order. */
export const secondLabeling: Labels[] = readRows('../second-labeling.jsonl')

/** The starter bank, from the app's own file. */
export const bank: StarterBank = JSON.parse(read('../../app/src/content/starter-bank.json'))

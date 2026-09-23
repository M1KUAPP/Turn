import { readFileSync } from 'node:fs'

/** A partner line, as its writer wrote it (EVAL-1). */
export type Line = {
  id: string
  author: string
  text: string
  kind: string
  place: string
  topic: string
  concerns: string[]
}

export type Phrase = { id: string; text: string; fixed: boolean; places: string[] }
export type Category = { id: string; name: string; fixed: boolean; phrases: Phrase[] }
export type StarterBank = { categories: Category[]; places: { id: string; name: string }[] }

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')

/** The 80 partner lines in `eval/lines.jsonl`, one JSON object per row. */
export const lines: Line[] = read('../lines.jsonl')
  .trim()
  .split('\n')
  .map((row) => JSON.parse(row))

/** The starter bank, from the app's own file. */
export const bank: StarterBank = JSON.parse(read('../../app/src/content/starter-bank.json'))

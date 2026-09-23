import type { Kind } from '@turn/shared/row'
import type { Phrase as ShortlistPhrase } from '@turn/shared/shortlist'
import { readFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/** A partner line, as its writer wrote it and its first labeler labeled it (EVAL-1). */
export type Line = {
  id: string
  author: string
  text: string
  kind: Kind
  place: string
  topic: string
  concerns: string[]
  /** Who listed the line's acceptable replies. */
  labeler: string
  /** The starter-bank ids of every acceptable reply, in the bank's order, or none. */
  acceptable: string[]
}

/** One line's acceptable replies in the second labeling, which only the labelers' agreement reads. */
type Labels = Pick<Line, 'id' | 'labeler' | 'acceptable'>

type Phrase = { id: string; text: string; fixed: boolean; places: string[] }
type Category = { id: string; name: string; fixed: boolean; phrases: Phrase[] }
type StarterBank = { categories: Category[]; places: { id: string; name: string }[] }

const here = (path: string) => new URL(path, import.meta.url)
/** The repository's root folder. */
export const root = fileURLToPath(here('../../'))

/** Reads a JSON Lines file, one object per row, from a URL or a path from the working directory. */
export const readRows = (file: URL | string) =>
  readFileSync(file, 'utf8')
    .trim()
    .split('\n')
    .map((row) => JSON.parse(row))

/** The 80 partner lines in `eval/lines.jsonl`, with the first labeling. */
export const lines: Line[] = readRows(here('../lines.jsonl'))

/** The second labeling in `eval/second-labeling.jsonl`, in the lines' order. */
export const secondLabeling: Labels[] = readRows(here('../second-labeling.jsonl'))

/** The starter bank, from the app's own file. */
export const bank: StarterBank = JSON.parse(readFileSync(here('../../app/src/content/starter-bank.json'), 'utf8'))

/** Every phrase in the bank, in the bank's order, as the shortlist and the row's rules see them, the strip's marked. */
export const phrases: ShortlistPhrase[] = bank.categories.flatMap((category) =>
  category.phrases.map(({ id, text, fixed, places }) => ({ id, text, places, fixed, strip: category.id === 'strip' }))
)

/** Stops at the first line whose labels are missing or name a phrase the bank doesn't hold, naming it. */
export function checkLabels(labeled: readonly { id: string; acceptable?: readonly string[] }[]) {
  const ids = new Set(phrases.map(({ id }) => id))
  for (const { id, acceptable } of labeled) {
    if (!Array.isArray(acceptable)) throw new Error(`${id} lists no acceptable replies, not even [] for none`)
    const unknown = acceptable.find((reply) => !ids.has(reply))
    if (unknown !== undefined) throw new Error(`${id} lists ${unknown}, which the starter bank doesn't hold`)
  }
}

/**
 * The labeled lines a command reads: the file its `--lines` names, or else the 80 in `eval/lines.jsonl`, checked
 * against the bank, with the file's path from the repository's root, or its whole path when it lies outside.
 */
export function linesFrom(path: string | undefined): { lines: Line[]; file: string } {
  const found: Line[] = path === undefined ? lines : readRows(path)
  checkLabels(found)
  if (path === undefined) return { lines: found, file: 'eval/lines.jsonl' }
  const inRepository = relative(root, resolve(path))
  return { lines: found, file: inRepository.startsWith('..') ? resolve(path) : inRepository }
}

/** The second labeling a command reads: the file its `--second` names, or else `eval/second-labeling.jsonl`, checked. */
export function labelingFrom(path: string | undefined): Labels[] {
  const found: Labels[] = path === undefined ? secondLabeling : readRows(path)
  checkLabels(found)
  return found
}

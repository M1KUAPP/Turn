import { spawn } from 'node:child_process'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'
import type { Embed } from './embeddings'

/** The revision of Apple's English sentence embedding the evaluation pins, so a Mac with another can't change it. */
export const appleRevision = 1

/** The Swift helper that runs Apple's sentence embedding, beside this file. */
const helper = fileURLToPath(new URL('sentence-embedding.swift', import.meta.url))

/** Apple's sentence embedding as its helper names it, with a way to embed texts and one to stop the helper. */
export type SentenceEmbedding = {
  embed: Embed
  revision: number
  dimension: number
  /** The system it runs on, as macOS names its version. */
  system: string
  /** Ends the helper's input, and waits for it to exit. */
  close: () => Promise<void>
}

/**
 * Apple's English sentence embedding at the pinned revision, as the phone would compute it (EVAL-8), from a helper
 * that stays open for the run, so each line's time is its embedding's, not a new process's: the Swift helper unless the
 * command names another. The helper names its revision, dimension, and system first, then answers each line of texts,
 * as JSON, with a line of their vectors. A helper that can't start, stops, writes a line that isn't JSON, has another
 * revision, or answers with the wrong number of vectors or numbers throws, and one that fails before it has named
 * itself is stopped.
 */
export async function sentenceEmbedding(
  command: readonly string[] = ['swift', helper, String(appleRevision)]
): Promise<SentenceEmbedding> {
  const [file, ...args] = command
  const child = spawn(file, args, { stdio: ['pipe', 'pipe', 'inherit'] })
  const exited = new Promise<void>((resolve) => child.once('exit', () => resolve()))
  // Such as no `swift` on this machine; caught here, since nothing may be reading when it comes.
  const failed = new Promise<never>((_, reject) => child.once('error', reject))
  failed.catch(() => {})
  const lines = createInterface({ input: child.stdout })[Symbol.asyncIterator]()
  const read = async (): Promise<unknown> => {
    const { value, done } = await Promise.race([lines.next(), failed])
    if (done) throw new Error("Apple's sentence embedding stopped")
    try {
      return JSON.parse(value)
    } catch {
      throw new Error("Apple's sentence embedding answered with a line that isn't JSON")
    }
  }
  /** The helper's first line: its revision, which must be the pinned one, its dimension, and its system. */
  const introduction = async () => {
    const { revision, dimension, system } = ((await read()) ?? {}) as Record<string, unknown>
    if (revision !== appleRevision) {
      throw new Error(
        `Apple's sentence embedding is at revision ${revision ?? 'none'}, not the pinned ${appleRevision}`
      )
    }
    if (!Number.isInteger(dimension) || typeof system !== 'string') {
      throw new Error("Apple's sentence embedding named no dimension or system")
    }
    return { revision, dimension: dimension as number, system }
  }
  const { revision, dimension, system } = await introduction().catch((error: unknown) => {
    child.kill()
    throw error
  })
  const embed: Embed = async (texts) => {
    child.stdin.write(`${JSON.stringify(texts)}\n`)
    const vectors = await read()
    const each =
      Array.isArray(vectors) &&
      vectors.length === texts.length &&
      vectors.every((vector) => Array.isArray(vector) && vector.length === dimension)
    if (!each) {
      throw new Error(
        `Apple's sentence embedding answered with no ${dimension}-number vector for each of ${texts.length} texts`
      )
    }
    return vectors
  }
  const close = () => {
    child.stdin.end()
    return exited
  }
  return { embed, revision, dimension, system, close }
}

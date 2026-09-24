import { existsSync, mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from 'vitest'
import { appleRevision, sentenceEmbedding } from '../src/apple'
import { cosine } from '../src/embeddings'

/**
 * A command that stands in for the Swift helper: a Node script that writes `first` as its first line, or stops at once
 * without one, then answers each line of texts with the vectors `answer` makes of them, stopping after `answers` of
 * them. Given a folder to `record` in, it writes its process ID there, and a file when it exits.
 */
const standIn = (
  first: string | null,
  { answer = 'texts.map((text) => [text.length, 1, 0, 0])', answers = 0, record = '' } = {}
) => [
  process.execPath,
  '-e',
  `const fs = require('node:fs')
  const record = ${JSON.stringify(record)}
  if (record) {
    fs.writeFileSync(record + '/pid', String(process.pid))
    process.on('exit', () => fs.writeFileSync(record + '/exited', ''))
  }
  const first = ${JSON.stringify(first)}
  if (first === null) process.exit(0)
  console.log(first)
  let answered = 0
  require('node:readline')
    .createInterface({ input: process.stdin })
    .on('line', (line) => {
      const texts = JSON.parse(line)
      console.log(JSON.stringify(${answer}))
      if (++answered === ${answers}) process.exit(0)
    })`
]

const named = { revision: 1, dimension: 4, system: '27.0 (Build 26A428)' }

/** A new folder for a stand-in to record in. */
const folder = () => mkdtempSync(join(tmpdir(), 'turn-helper-'))

/** Whether the process that recorded its ID in the folder has ended, waiting up to two seconds for it. */
const ended = async (record: string) => {
  const pid = Number(readFileSync(join(record, 'pid'), 'utf8'))
  for (let tries = 0; tries < 40; tries++) {
    try {
      process.kill(pid, 0)
    } catch {
      return true
    }
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  return false
}

test('reads the revision, dimension, and system first, then answers each request with its own vectors', async () => {
  const embedding = await sentenceEmbedding(standIn(JSON.stringify(named)))
  expect(embedding).toMatchObject(named)
  expect(await embedding.embed(['Hi', 'Hello'])).toEqual([
    [2, 1, 0, 0],
    [5, 1, 0, 0]
  ])
  expect(await embedding.embed(['Good morning'])).toEqual([[12, 1, 0, 0]])
  await embedding.close()
})

test('closes the helper by ending its input, and waits until it has exited', async () => {
  const record = folder()
  const embedding = await sentenceEmbedding(standIn(JSON.stringify(named), { record }))
  expect(existsSync(join(record, 'exited'))).toBe(false)
  await embedding.close()
  expect(existsSync(join(record, 'exited'))).toBe(true)
})

test('refuses and stops a helper at another revision, or one that names no dimension or system', async () => {
  expect(appleRevision).toBe(1)
  const record = folder()
  await expect(sentenceEmbedding(standIn(JSON.stringify({ ...named, revision: 2 }), { record }))).rejects.toThrow(
    "Apple's sentence embedding is at revision 2, not the pinned 1"
  )
  expect(await ended(record)).toBe(true)
  for (const first of [
    { revision: 1, system: named.system },
    { revision: 1, dimension: 4 }
  ]) {
    await expect(sentenceEmbedding(standIn(JSON.stringify(first)))).rejects.toThrow(
      "Apple's sentence embedding named no dimension or system"
    )
  }
})

test("refuses and stops a helper whose first line isn't JSON, or is JSON's null", async () => {
  const record = folder()
  await expect(sentenceEmbedding(standIn('Hello', { record }))).rejects.toThrow(
    "Apple's sentence embedding answered with a line that isn't JSON"
  )
  expect(await ended(record)).toBe(true)
  await expect(sentenceEmbedding(standIn('null'))).rejects.toThrow(
    "Apple's sentence embedding is at revision none, not the pinned 1"
  )
})

test('refuses an answer short of one vector of the dimension for each text', async () => {
  for (const answer of ['texts.slice(1).map(() => [1, 1, 0, 0])', 'texts.map(() => [1, 1, 0])', 'null']) {
    const embedding = await sentenceEmbedding(standIn(JSON.stringify(named), { answer }))
    await expect(embedding.embed(['Hi', 'Hello'])).rejects.toThrow(
      "Apple's sentence embedding answered with no 4-number vector for each of 2 texts"
    )
    await embedding.close()
  }
})

test("says so when the helper stops before it answers or partway, or can't start", async () => {
  await expect(sentenceEmbedding(standIn(null))).rejects.toThrow("Apple's sentence embedding stopped")
  const once = await sentenceEmbedding(standIn(JSON.stringify(named), { answers: 1 }))
  expect(await once.embed(['Hi'])).toEqual([[2, 1, 0, 0]])
  await expect(once.embed(['Hello'])).rejects.toThrow("Apple's sentence embedding stopped")
  await once.close()
  await expect(sentenceEmbedding(['/nonexistent/sentence-embedding'])).rejects.toThrow('ENOENT')
})

test.runIf(process.platform === 'darwin')(
  "embeds with this Mac's own sentence embedding, at the pinned revision",
  async () => {
    const embedding = await sentenceEmbedding()
    expect(embedding.revision).toBe(appleRevision)
    expect(embedding.dimension).toBe(512)
    expect(embedding.system).toMatch(/^\d+\.\d+(\.\d+)? \(Build \w+\)$/)
    const [tea, cup, bus] = await embedding.embed([
      'Do you want some tea?',
      'Would you like a cup of tea?',
      'The bus is late.'
    ])
    expect(tea).toHaveLength(512)
    expect(cosine(tea, cup)).toBeGreaterThan(cosine(tea, bus))
    // In the order asked for: each text's vector is the one it gets alone.
    expect(await embedding.embed(['Do you want some tea?'])).toEqual([tea])
    expect(await embedding.embed(['The bus is late.'])).toEqual([bus])
    await embedding.close()
  },
  30_000
)

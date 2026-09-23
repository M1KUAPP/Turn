import { expect, test } from 'vitest'
import { appleRevision, sentenceEmbedding } from '../src/apple'
import { cosine } from '../src/embeddings'

/**
 * A command that stands in for the Swift helper: a Node script that writes `first` as its first line, or stops at once
 * without one, then answers each line of texts with the vectors `answer` makes of them.
 */
const standIn = (first: object | null, answer = 'texts.map((text) => [text.length, 1, 0, 0])') => [
  process.execPath,
  '-e',
  `const first = ${JSON.stringify(first)}
  if (first === null) process.exit(0)
  console.log(JSON.stringify(first))
  require('node:readline')
    .createInterface({ input: process.stdin })
    .on('line', (line) => {
      const texts = JSON.parse(line)
      console.log(JSON.stringify(${answer}))
    })`
]

const named = { revision: 1, dimension: 4, system: 'Version 27.0 (Build 26A428)' }

test('reads the revision, dimension, and system first, then answers each request with its own vectors', async () => {
  const embedding = await sentenceEmbedding(standIn(named))
  expect(embedding).toMatchObject(named)
  expect(await embedding.embed(['Hi', 'Hello'])).toEqual([
    [2, 1, 0, 0],
    [5, 1, 0, 0]
  ])
  expect(await embedding.embed(['Good morning'])).toEqual([[12, 1, 0, 0]])
  await embedding.close()
})

test('refuses a helper at a revision other than the pinned one, or one that names no dimension or system', async () => {
  expect(appleRevision).toBe(1)
  await expect(sentenceEmbedding(standIn({ ...named, revision: 2 }))).rejects.toThrow(
    "Apple's sentence embedding is at revision 2, not the pinned 1"
  )
  for (const first of [
    { revision: 1, system: named.system },
    { revision: 1, dimension: 4 }
  ]) {
    await expect(sentenceEmbedding(standIn(first))).rejects.toThrow(
      "Apple's sentence embedding named no dimension or system"
    )
  }
})

test('refuses an answer short of one vector of the dimension for each text', async () => {
  for (const answer of ['texts.slice(1).map(() => [1, 1, 0, 0])', 'texts.map(() => [1, 1, 0])', 'null']) {
    const embedding = await sentenceEmbedding(standIn(named, answer))
    await expect(embedding.embed(['Hi', 'Hello'])).rejects.toThrow(
      "Apple's sentence embedding answered with no 4-number vector for each of 2 texts"
    )
    await embedding.close()
  }
})

test("says so when the helper stops before it answers, or can't start", async () => {
  await expect(sentenceEmbedding(standIn(null))).rejects.toThrow("Apple's sentence embedding stopped")
  await expect(sentenceEmbedding(['/nonexistent/sentence-embedding'])).rejects.toThrow('ENOENT')
})

test.runIf(process.platform === 'darwin')(
  "embeds with this Mac's own sentence embedding, at the pinned revision",
  async () => {
    const embedding = await sentenceEmbedding()
    expect(embedding.revision).toBe(appleRevision)
    expect(embedding.dimension).toBe(512)
    expect(embedding.system).toMatch(/^Version \d+/)
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

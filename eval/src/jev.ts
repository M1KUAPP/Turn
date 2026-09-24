import { buildJevRequest, readJevAnswer, type JevLine } from '@turn/shared/jev'
import type { Phrase } from '@turn/shared/shortlist'
import { TypeSafeClient } from '@typesafe-ai/sdk'
import { readFileSync } from 'node:fs'
import { bank } from './data'
import type { Ranker } from './rankers'

/**
 * The model the relay pins, `JEV_MODEL` in `worker/wrangler.jsonc`, read with the file's comment lines dropped, so the
 * evaluation runs the relay's Jev and the report names its pin (EVAL-6).
 */
export function relayModel(): string {
  const config = readFileSync(new URL('../../worker/wrangler.jsonc', import.meta.url), 'utf8')
  const model = JSON.parse(config.replace(/^\s*\/\/.*$/gm, '')).vars?.JEV_MODEL
  if (typeof model !== 'string' || model === '') throw new Error('worker/wrangler.jsonc pins no JEV_MODEL')
  return model
}

/** The grid's categories, which a line's topic is chosen from: all the bank's but the strip's, which the grid hides. */
const categories = bank.categories.filter(({ id }) => id !== 'strip').map(({ id, name }) => ({ id, name }))

/**
 * What the relay's request holds for one line, as the app builds it: the line as written, since the evaluation's lines
 * hold no names to tag; the place's name; the grid's categories; and the shortlist's ids and texts.
 */
export function jevLine(line: string, place: string, shortlist: readonly Phrase[]): JevLine {
  const name = bank.places.find(({ id }) => id === place)?.name
  if (name === undefined) throw new Error(`The starter bank has no place ${place}`)
  return { line, place: name, categories, candidates: shortlist.map(({ id, text }) => ({ id, text })) }
}

/** What Jev reported for one call: the model that answered. */
export type JevCall = { model: string }

/**
 * Jev as a ranker, as the relay runs it: the relay's request builder with the pinned model, and the relay's reading of
 * the answer. The client takes the team's key from the environment and sets the address, the model, and the log level
 * in code, since TypeSafe's SDK reads any it isn't given from the environment. It keeps the SDK's 10-second attempts
 * and two retries, since a slow link from the evaluation's machine shouldn't count against Jev; a call that still
 * fails throws. Each call's model is kept in `calls`, so the report can say whether Jev kept to the pin.
 */
export function jev(model: string, env: Readonly<Record<string, string | undefined>> = process.env) {
  const apiKey = env.TYPESAFE_API_KEY
  if (!apiKey) throw new Error('The Jev ranker needs TYPESAFE_API_KEY in the environment')
  const client = new TypeSafeClient({
    apiKey,
    baseURL: 'https://api.typesafe.ai',
    defaultModel: model,
    logLevel: 'off',
    timeout: 10_000,
    retry: { maxRetries: 2 }
  })
  const calls: JevCall[] = []
  const rank: Ranker = async (line, shortlist, _index, { place }) => {
    const request = jevLine(line, place, shortlist)
    const result = await client.systemOne(buildJevRequest(request, model))
    calls.push({ model: result.model })
    return readJevAnswer(result.answers, request)
  }
  return Object.assign(rank, { calls })
}

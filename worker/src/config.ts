import type { Config } from '@turn/shared/relay'
import { startingPolicy, type Policy } from '@turn/shared/row'
import { isRecord } from './request'

/** Whether a switch is on: only `true` is, so a typo turns it off. */
export const isOn = (value: unknown) => String(value) === 'true'

/** Whether a value can take the place of one of the policy's, whose starting value sets its type. */
const fits = (given: unknown, start: Policy[keyof Policy]) => {
  if (typeof start === 'number') return typeof given === 'number' && given >= 0 && given <= 1
  if (typeof start === 'boolean') return typeof given === 'boolean'
  return Array.isArray(given) && given.every((topic) => typeof topic === 'string')
}

/**
 * The starting policy with the values `POLICY` changes, as JSON in `wrangler.jsonc` or as a string from `--var` or the
 * dashboard, and as it is when `POLICY` is unset. An unknown key, a value of the wrong type, or a number outside 0 to 1
 * throws, so a mistake shows at the next request.
 */
function readPolicy(value: unknown): Policy {
  if (value === undefined) return startingPolicy
  const changes: unknown = typeof value === 'string' ? JSON.parse(value) : value
  if (!isRecord(changes)) throw new Error('POLICY is no object')
  for (const [key, given] of Object.entries(changes)) {
    if (!Object.hasOwn(startingPolicy, key) || !fits(given, startingPolicy[key as keyof Policy])) {
      throw new Error(`POLICY's ${key} is unknown or of the wrong type`)
    }
  }
  return { ...startingPolicy, ...changes }
}

/**
 * The configuration, read from the vars at every request, so changing one needs no app build (ROW-8, CONSENT-7), with
 * the free lines a new user gets, which the user's object replaces with their own. It throws without `JEV_MODEL`, since
 * the SDK would then pick a model of its own (SEC-2).
 */
export function readConfig(env: Env): Config & { freeLinesLeft: number } {
  if (!env.JEV_MODEL) throw new Error('JEV_MODEL is unset')
  if (!/^\d+$/.test(String(env.FREE_LINES))) throw new Error('FREE_LINES is not a whole number')
  return {
    jevOn: isOn(env.JEV_ON),
    typesafeNamed: isOn(env.TYPESAFE_NAMED),
    freeLinesLeft: Number(env.FREE_LINES),
    policy: readPolicy(env.POLICY)
  }
}

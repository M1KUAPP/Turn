import type { Config } from '@turn/shared/relay'
import { startingPolicy, type Policy } from '@turn/shared/row'

/** Whether a switch is on: only `true` is, so a typo turns it off. */
const isOn = (value: unknown) => String(value) === 'true'

/** Whether a value can take the place of one of the policy's, whose starting value sets its type. */
const fits = (given: unknown, start: Policy[keyof Policy]) => {
  if (typeof start === 'number') return typeof given === 'number' && given >= 0 && given <= 1
  if (typeof start === 'boolean') return typeof given === 'boolean'
  return Array.isArray(given) && given.every((topic) => typeof topic === 'string')
}

/**
 * The starting policy with the values `POLICY` changes, as JSON in `wrangler.jsonc` or as a string from `--var` or the
 * dashboard. An unknown key or a value of the wrong type throws, so a mistake shows at the next request.
 */
function readPolicy(value: unknown): Policy {
  const changes: unknown = typeof value === 'string' ? JSON.parse(value) : value
  if (typeof changes !== 'object' || changes === null || Array.isArray(changes)) throw new Error('POLICY is no object')
  for (const [key, given] of Object.entries(changes)) {
    if (!Object.hasOwn(startingPolicy, key) || !fits(given, startingPolicy[key as keyof Policy])) {
      throw new Error(`POLICY's ${key} is unknown or of the wrong type`)
    }
  }
  return { ...startingPolicy, ...changes }
}

/** The configuration, read from the vars at every request, so changing one needs no app build (ROW-8, CONSENT-7). */
export function readConfig(env: Env): Config {
  if (!/^\d+$/.test(String(env.FREE_LINES))) throw new Error('FREE_LINES is not a whole number')
  return {
    jevOn: isOn(env.JEV_ON),
    typesafeNamed: isOn(env.TYPESAFE_NAMED),
    freeLinesLeft: Number(env.FREE_LINES),
    policy: readPolicy(env.POLICY)
  }
}

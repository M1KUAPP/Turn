import { DurableObject } from 'cloudflare:workers'
import { countInMinute, createMinuteCount } from './minute-count'

/** The requests one address may send the relay in a clock minute, which its object counts (SEC-3). */
const addressRequestsPerMinute = 120

/** One address's object, which counts its requests, so the IDs minted on one address share its 120 a minute (SEC-3). */
export class Address extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    // The address's requests in the current clock minute, which a new minute starts again from 0 (SEC-3).
    createMinuteCount(ctx.storage.sql)
  }

  /**
   * Counts one more of the address's requests in the current clock minute, or none once 120 are counted there: whether
   * this one may go on (SEC-3).
   */
  admit(): boolean {
    return countInMinute(this.ctx.storage, addressRequestsPerMinute)
  }
}

import { isRecord } from './request'

/** RevenueCat's answer about `listen`: yes, no, or unknown when it couldn't be asked or answered out of shape. */
export type Entitlement = 'yes' | 'no' | 'unknown'

/** The relay's RevenueCat settings: a key that can only read customers, the project, and `listen`'s object ID. */
type Settings = Pick<Env, 'RC_SECRET_KEY' | 'RC_PROJECT_ID' | 'RC_ENTITLEMENT_ID'>

/** An item of the active entitlements list, in the spec's shape: the entitlement's object ID, and when it expires. */
export type Item = { entitlement_id: string; expires_at: number | null }

const isItem = (item: unknown): item is Item =>
  isRecord(item) &&
  typeof item.entitlement_id === 'string' &&
  (item.expires_at === null || typeof item.expires_at === 'number')

/**
 * Asks RevenueCat's REST API v2 whether the user has `listen`, within half a second (PAY-7). A list holding it with no
 * expiry or one still ahead is a yes; a list without it, or a 404 for an ID RevenueCat has never seen, is a no; and
 * anything else, an unset setting included, is unknown, so a failure never shows as a false 402. One page is enough,
 * since `listen` is the project's only entitlement.
 */
export async function checkEntitlement(settings: Settings, userId: string): Promise<Entitlement> {
  const { RC_SECRET_KEY: key, RC_PROJECT_ID: project, RC_ENTITLEMENT_ID: listen } = settings
  if (!key || !project || !listen) return 'unknown'
  const path = `/v2/projects/${encodeURIComponent(project)}/customers/${encodeURIComponent(userId)}/active_entitlements`
  try {
    const response = await fetch(`https://api.revenuecat.com${path}`, {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(500)
    })
    const body: unknown = await response.json()
    if (response.status === 404) return isRecord(body) && body.type === 'resource_missing' ? 'no' : 'unknown'
    const items: unknown = isRecord(body) && body.object === 'list' ? body.items : undefined
    if (!response.ok || !Array.isArray(items) || !items.every(isItem)) return 'unknown'
    const now = Date.now()
    const active = items.some(
      ({ entitlement_id, expires_at }) => entitlement_id === listen && (expires_at === null || expires_at > now)
    )
    return active ? 'yes' : 'no'
  } catch {
    return 'unknown'
  }
}

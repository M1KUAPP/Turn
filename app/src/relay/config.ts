import type { Config } from '@turn/shared/relay'
import { startingPolicy } from '@turn/shared/row'

type ConfigPorts = {
  setting(key: string): Promise<string | null>
  setSetting(key: string, value: string | null): Promise<void>
  getItemAsync(key: string): Promise<string | null>
  setItemAsync(key: string, value: string): Promise<void>
  createId(): string
  request(url: string, init: RequestInit): Promise<Response>
  relayUrl: string
  version: string
  buildKind: 'device' | 'simulator'
}

const userIdKey = 'turn-user-id'
const configKey = 'relay_config'
const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

const defaultConfig: Config = {
  jevOn: false,
  typesafeNamed: false,
  freeLinesLeft: 20,
  policy: startingPolicy
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isConfig(value: unknown): value is Config {
  if (!isRecord(value) || !isRecord(value.policy)) return false
  const { freeLinesLeft, policy } = value
  return (
    typeof value.jevOn === 'boolean' &&
    typeof value.typesafeNamed === 'boolean' &&
    (freeLinesLeft === null ||
      (typeof freeLinesLeft === 'number' && Number.isSafeInteger(freeLinesLeft) && freeLinesLeft >= 0)) &&
    typeof policy.floor === 'number' &&
    Number.isFinite(policy.floor) &&
    typeof policy.bigAbove === 'number' &&
    Number.isFinite(policy.bigAbove) &&
    typeof policy.margin === 'number' &&
    Number.isFinite(policy.margin) &&
    typeof policy.yesNoPhrases === 'boolean' &&
    Array.isArray(policy.noBigTopics) &&
    policy.noBigTopics.every((topic) => typeof topic === 'string') &&
    Array.isArray(policy.fixedOnlyTopics) &&
    policy.fixedOnlyTopics.every((topic) => typeof topic === 'string')
  )
}

export function createConfigClient(ports: ConfigPorts) {
  let current = defaultConfig
  let userId: string | null = null
  let userIdPromise: Promise<string> | null = null
  const listeners = new Set<() => void>()

  const notify = () => {
    for (const listener of listeners) listener()
  }

  async function getUserId(): Promise<string> {
    if (!userIdPromise) {
      userIdPromise = (async () => {
        const saved = await ports.getItemAsync(userIdKey)
        if (saved && uuidV4.test(saved)) return saved
        const created = ports.createId()
        if (!uuidV4.test(created)) throw new Error('Anonymous ID is not a UUIDv4')
        await ports.setItemAsync(userIdKey, created)
        return created
      })().then(
        (id) => {
          userId = id
          return id
        },
        (error: unknown) => {
          userIdPromise = null
          throw error
        }
      )
    }
    return userIdPromise
  }

  function headers(): Record<string, string> {
    if (!userId) throw new Error('The relay user ID is not ready')
    return {
      'X-Turn-User': userId,
      'X-Turn-Version': ports.version,
      'X-Turn-Build': ports.buildKind
    }
  }

  async function read(): Promise<Config> {
    const saved = await ports.setting(configKey)
    if (saved === null) {
      const oldNaming = await ports.setting('typesafe_named')
      current = oldNaming === null ? defaultConfig : { ...defaultConfig, typesafeNamed: oldNaming === 'true' }
      if (oldNaming !== null) await ports.setSetting(configKey, JSON.stringify(current))
      return current
    }
    try {
      const parsed: unknown = JSON.parse(saved)
      current = isConfig(parsed) ? parsed : defaultConfig
    } catch {
      current = defaultConfig
    }
    return current
  }

  async function refresh(): Promise<Config> {
    let cached = current
    try {
      cached = await read()
    } catch {
      // A local storage failure leaves the in-memory copy available.
    }
    if (!ports.relayUrl) return cached

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3_000)
    try {
      await getUserId()
      const url = `${ports.relayUrl.replace(/\/+$/, '')}/v1/config`
      const response = await ports.request(url, {
        method: 'GET',
        headers: headers(),
        signal: controller.signal
      })
      if (!response.ok) return cached
      const body: unknown = await response.json()
      if (!isConfig(body)) return cached
      await ports.setSetting(configKey, JSON.stringify(body))
      current = body
      notify()
      return current
    } catch {
      return cached
    } finally {
      clearTimeout(timeout)
    }
  }

  return {
    headers,
    read,
    typesafeNamed: () => current.typesafeNamed,
    refresh,
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    }
  }
}

type NamingDatabase = {
  getFirstAsync<T>(sql: string, ...params: (string | number)[]): Promise<T | null>
  runAsync(sql: string, ...params: (string | number)[]): Promise<unknown>
}

type IdentityStorage = {
  getItemAsync(key: string): Promise<string | null>
  setItemAsync(key: string, value: string): Promise<void>
}

type NamingStore = ReturnType<typeof createNamingStore>

type RefreshOptions = {
  store: NamingStore
  storage: IdentityStorage
  createId: () => string
  request: (url: string, init: RequestInit) => Promise<Response>
  relayUrl: string
  version: string
  buildKind: 'device' | 'simulator'
}

const userIdKey = 'turn-user-id'
const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

export function createNamingStore(db: NamingDatabase) {
  return {
    async read(): Promise<boolean> {
      const row = await db.getFirstAsync<{ value: string }>("SELECT value FROM setting WHERE key = 'typesafe_named'")
      return row?.value === 'true'
    },
    async save(value: boolean): Promise<void> {
      await db.runAsync(
        "INSERT INTO setting (key, value) VALUES ('typesafe_named', ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value",
        String(value)
      )
    }
  }
}

export async function getOrCreateUserId(storage: IdentityStorage, createId: () => string): Promise<string> {
  const saved = await storage.getItemAsync(userIdKey)
  if (saved && uuidV4.test(saved)) return saved
  const created = createId()
  if (!uuidV4.test(created)) throw new Error('Anonymous ID is not a UUIDv4')
  await storage.setItemAsync(userIdKey, created)
  return created
}

/** Refreshes at launch; any failure keeps the last offline choice. */
export async function refreshNaming({
  store,
  storage,
  createId,
  request,
  relayUrl,
  version,
  buildKind
}: RefreshOptions): Promise<boolean> {
  const cached = await store.read()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 3_000)
  try {
    const id = await getOrCreateUserId(storage, createId)
    const url = `${relayUrl.replace(/\/+$/, '')}/v1/config`
    const response = await request(url, {
      method: 'GET',
      headers: { 'X-Turn-User': id, 'X-Turn-Version': version, 'X-Turn-Build': buildKind },
      signal: controller.signal
    })
    if (!response.ok) return cached
    const body: unknown = await response.json()
    if (typeof body !== 'object' || body === null || !('typesafeNamed' in body)) return cached
    const named = body.typesafeNamed
    if (typeof named !== 'boolean') return cached
    await store.save(named)
    return named
  } catch {
    return cached
  } finally {
    clearTimeout(timeout)
  }
}

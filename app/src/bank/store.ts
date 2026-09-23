export type Category = { id: string; name: string; position: number; fixed: number }
export type Phrase = {
  id: string
  category_id: string
  text: string
  position: number
  fixed: number
  reviewed: number
  created_at: number
}

type StarterBank = {
  categories: Array<{
    id: string
    name: string
    fixed: boolean
    phrases: Array<{ id: string; text: string; fixed: boolean; places: string[] }>
  }>
  places: Array<{ id: string; name: string }>
}

export type BankDatabase = {
  execAsync(sql: string): Promise<unknown>
  runAsync(sql: string, ...params: (string | number)[]): Promise<unknown>
  getFirstAsync<T>(sql: string, ...params: (string | number)[]): Promise<T | null>
  getAllAsync<T>(sql: string, ...params: (string | number)[]): Promise<T[]>
  withExclusiveTransactionAsync(work: (tx: BankDatabase) => Promise<void>): Promise<void>
}

const schema = `
CREATE TABLE IF NOT EXISTS category (
  id TEXT PRIMARY KEY, name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 40),
  position INTEGER NOT NULL, fixed INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS phrase (
  id TEXT PRIMARY KEY, category_id TEXT NOT NULL REFERENCES category (id),
  text TEXT NOT NULL CHECK (length(text) BETWEEN 1 AND 200), position INTEGER NOT NULL,
  fixed INTEGER NOT NULL DEFAULT 0, reviewed INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS place (
  id TEXT PRIMARY KEY, name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 40),
  position INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS phrase_place (
  phrase_id TEXT NOT NULL REFERENCES phrase (id) ON DELETE CASCADE,
  place_id TEXT NOT NULL REFERENCES place (id) ON DELETE CASCADE,
  PRIMARY KEY (phrase_id, place_id)
);
CREATE TABLE IF NOT EXISTS tap (
  phrase_id TEXT NOT NULL REFERENCES phrase (id) ON DELETE CASCADE,
  day INTEGER NOT NULL, count INTEGER NOT NULL,
  PRIMARY KEY (phrase_id, day)
);
CREATE TABLE IF NOT EXISTS setting (key TEXT PRIMARY KEY, value TEXT NOT NULL);
`

export function localDay(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000
}

export function createBankStore(db: BankDatabase, starter: StarterBank, now: () => Date = () => new Date()) {
  const listeners = new Set<() => void>()
  const notify = () => {
    for (const listener of listeners) listener()
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    async initialize() {
      await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;')
      await db.execAsync(schema)
      const marker = await db.getFirstAsync<{ value: string }>("SELECT value FROM setting WHERE key = 'starter_seeded'")
      if (!marker) {
        await db.withExclusiveTransactionAsync(async (tx) => {
          const seededAt = now().getTime()
          for (const [position, category] of starter.categories.entries()) {
            await tx.runAsync(
              'INSERT INTO category (id, name, position, fixed) VALUES (?, ?, ?, ?)',
              category.id,
              category.name,
              position,
              Number(category.fixed)
            )
            for (const [phrasePosition, phrase] of category.phrases.entries()) {
              await tx.runAsync(
                'INSERT INTO phrase (id, category_id, text, position, fixed, reviewed, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
                phrase.id,
                category.id,
                phrase.text,
                phrasePosition,
                Number(phrase.fixed),
                0,
                seededAt
              )
            }
          }
          for (const [position, place] of starter.places.entries()) {
            await tx.runAsync('INSERT INTO place (id, name, position) VALUES (?, ?, ?)', place.id, place.name, position)
          }
          for (const category of starter.categories) {
            for (const phrase of category.phrases) {
              for (const place of phrase.places) {
                await tx.runAsync('INSERT INTO phrase_place (phrase_id, place_id) VALUES (?, ?)', phrase.id, place)
              }
            }
          }
          await tx.runAsync("INSERT INTO setting (key, value) VALUES ('starter_seeded', '1')")
        })
        notify()
      }
      await db.runAsync('DELETE FROM tap WHERE day < ?', localDay(now()) - 29)
    },
    categories() {
      return db.getAllAsync<Category>(
        "SELECT id, name, position, fixed FROM category WHERE id != 'strip' ORDER BY position, id"
      )
    },
    phrases(categoryId: string) {
      return db.getAllAsync<Phrase>(
        categoryId === 'all'
          ? "SELECT p.* FROM phrase p JOIN category c ON c.id = p.category_id WHERE c.id != 'strip' ORDER BY c.position, p.position, p.id"
          : 'SELECT * FROM phrase WHERE category_id = ? ORDER BY position, id',
        ...(categoryId === 'all' ? [] : [categoryId])
      )
    },
    async recordTap(phraseId: string) {
      await db.runAsync(
        'INSERT INTO tap (phrase_id, day, count) VALUES (?, ?, 1) ON CONFLICT (phrase_id, day) DO UPDATE SET count = count + 1',
        phraseId,
        localDay(now())
      )
    },
    async tapCount(phraseId: string, day: number) {
      const row = await db.getFirstAsync<{ count: number }>(
        'SELECT count FROM tap WHERE phrase_id = ? AND day = ?',
        phraseId,
        day
      )
      return row?.count ?? 0
    },
    async updatePhraseText(phraseId: string, text: string) {
      await db.runAsync('UPDATE phrase SET text = ?, reviewed = 1 WHERE id = ?', text, phraseId)
      notify()
    },
    async seedDebugPhrases() {
      if (!__DEV__) return
      await db.withExclusiveTransactionAsync(async (tx) => {
        await tx.runAsync(
          "INSERT OR IGNORE INTO category (id, name, position, fixed) VALUES ('debug-load', 'Debug load', 100, 0)"
        )
        for (let position = 0; position < 2000; position++) {
          await tx.runAsync(
            'INSERT OR IGNORE INTO phrase (id, category_id, text, position, fixed, reviewed, created_at) VALUES (?, ?, ?, ?, 0, 1, ?)',
            `debug-${position}`,
            'debug-load',
            `Test phrase ${position + 1}`,
            position,
            now().getTime()
          )
        }
      })
      notify()
    }
  }
}

import type { Phrase as RankablePhrase } from '@turn/shared/shortlist'

export type Category = { id: string; name: string; position: number; fixed: number }
export type Place = { id: string; name: string; position: number }
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
    places() {
      return db.getAllAsync<Place>('SELECT id, name, position FROM place ORDER BY position, id')
    },
    async selectedPlace() {
      return db.getFirstAsync<Place>(
        "SELECT id, name, position FROM place ORDER BY id = (SELECT value FROM setting WHERE key = 'selected_place') DESC, position, id LIMIT 1"
      )
    },
    async choosePlace(id: string) {
      const place = await db.getFirstAsync<Place>('SELECT id, name, position FROM place WHERE id = ?', id)
      if (!place) throw new Error('Unknown place')
      await db.runAsync(
        "INSERT INTO setting (key, value) VALUES ('selected_place', ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value",
        id
      )
      notify()
    },
    async addPlace(name: string): Promise<Place> {
      const trimmed = name.trim()
      if (trimmed.length < 1) throw new Error('Name is required')
      if (trimmed.length > 40) throw new Error('Name is too long')

      let result!: Place

      await db.withExclusiveTransactionAsync(async (tx) => {
        const count = await tx.getFirstAsync<{ count: number }>('SELECT COUNT(*) AS count FROM place')
        if ((count?.count ?? 0) >= 12) throw new Error('Too many places')
        const maxPos = await tx.getFirstAsync<{ max_pos: number | null }>('SELECT MAX(position) AS max_pos FROM place')
        const position = (maxPos?.max_pos ?? -1) + 1
        const id =
          typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `place-${now().getTime()}-${Math.random().toString(36).slice(2, 9)}`
        await tx.runAsync('INSERT INTO place (id, name, position) VALUES (?, ?, ?)', id, trimmed, position)
        result = { id, name: trimmed, position }
      })

      notify()

      return result
    },
    async renamePlace(id: string, name: string): Promise<void> {
      const trimmed = name.trim()
      if (trimmed.length < 1) throw new Error('Name is required')
      if (trimmed.length > 40) throw new Error('Name is too long')

      let notifyNeeded = false

      await db.withExclusiveTransactionAsync(async (tx) => {
        const place = await tx.getFirstAsync<{ id: string; name: string }>(
          'SELECT id, name FROM place WHERE id = ?',
          id
        )
        if (!place) throw new Error('Unknown place')
        if (place.name === trimmed) return
        await tx.runAsync('UPDATE place SET name = ? WHERE id = ?', trimmed, id)
        notifyNeeded = true
      })

      if (notifyNeeded) {
        notify()
      }
    },
    async movePlace(id: string, direction: -1 | 1): Promise<void> {
      let notifyNeeded = false

      await db.withExclusiveTransactionAsync(async (tx) => {
        const rows = await tx.getAllAsync<{ id: string; position: number }>(
          'SELECT id, position FROM place ORDER BY position, id'
        )
        const index = rows.findIndex((row) => row.id === id)
        if (index === -1) throw new Error('Unknown place')
        const neighbor = rows[index + direction]
        if (!neighbor || rows[index].position === neighbor.position) return
        await tx.runAsync('UPDATE place SET position = ? WHERE id = ?', neighbor.position, id)
        await tx.runAsync('UPDATE place SET position = ? WHERE id = ?', rows[index].position, neighbor.id)
        notifyNeeded = true
      })

      if (notifyNeeded) {
        notify()
      }
    },
    async deletePlace(id: string): Promise<void> {
      let notifyNeeded = false

      await db.withExclusiveTransactionAsync(async (tx) => {
        const place = await tx.getFirstAsync<{ id: string }>('SELECT id FROM place WHERE id = ?', id)
        if (!place) throw new Error('Unknown place')
        await tx.runAsync('DELETE FROM place WHERE id = ?', id)
        const selected = await tx.getFirstAsync<{ value: string }>(
          "SELECT value FROM setting WHERE key = 'selected_place'"
        )
        if (selected?.value === id) {
          const first = await tx.getFirstAsync<{ id: string }>('SELECT id FROM place ORDER BY position, id LIMIT 1')
          if (first) {
            await tx.runAsync(
              "INSERT INTO setting (key, value) VALUES ('selected_place', ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value",
              first.id
            )
          } else {
            await tx.runAsync("DELETE FROM setting WHERE key = 'selected_place'")
          }
        }
        notifyNeeded = true
      })

      if (notifyNeeded) {
        notify()
      }
    },
    phrases(categoryId: string) {
      return db.getAllAsync<Phrase>(
        categoryId === 'all'
          ? "SELECT p.* FROM phrase p JOIN category c ON c.id = p.category_id WHERE c.id != 'strip' ORDER BY c.position, p.position, p.id"
          : 'SELECT * FROM phrase WHERE category_id = ? ORDER BY position, id',
        ...(categoryId === 'all' ? [] : [categoryId])
      )
    },
    async rankingData(): Promise<{ bank: RankablePhrase[]; taps: Map<string, number> }> {
      const [phrases, ties, counts] = await Promise.all([
        db.getAllAsync<Phrase>(
          "SELECT p.* FROM phrase p JOIN category c ON c.id = p.category_id WHERE c.id != 'strip' ORDER BY c.position, p.position, p.id"
        ),
        db.getAllAsync<{ phrase_id: string; place_id: string }>('SELECT phrase_id, place_id FROM phrase_place'),
        db.getAllAsync<{ phrase_id: string; count: number }>(
          'SELECT phrase_id, SUM(count) AS count FROM tap WHERE day >= ? GROUP BY phrase_id',
          localDay(now()) - 29
        )
      ])
      const places = new Map<string, string[]>()
      for (const tie of ties) {
        const list = places.get(tie.phrase_id) ?? []
        list.push(tie.place_id)
        places.set(tie.phrase_id, list)
      }
      return {
        bank: phrases.map((phrase) => ({
          id: phrase.id,
          text: phrase.text,
          places: places.get(phrase.id) ?? [],
          fixed: phrase.fixed === 1
        })),
        taps: new Map(counts.map(({ phrase_id, count }) => [phrase_id, count]))
      }
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
    async saveTypedPhrase(text: string): Promise<Phrase | null> {
      const trimmed = text.trim()
      if (trimmed.length < 1 || trimmed.length > 200) {
        return null
      }

      let notifyNeeded = false
      let result: Phrase | null = null

      await db.withExclusiveTransactionAsync(async (tx) => {
        // Compare duplicate phrase text across the whole bank after trimming and ignoring case
        const existing = await tx.getFirstAsync<Phrase>(
          `SELECT p.* FROM phrase p
           JOIN category c ON c.id = p.category_id
           WHERE LOWER(TRIM(p.text)) = LOWER(?)
           ORDER BY c.position, p.position, p.id
           LIMIT 1`,
          trimmed
        )
        if (existing) {
          result = existing
          return
        }

        const allPhrases = await tx.getAllAsync<Phrase>(
          `SELECT p.* FROM phrase p
           JOIN category c ON c.id = p.category_id
           ORDER BY c.position, p.position, p.id`
        )
        const normalized = trimmed.toLowerCase()
        const jsMatch = allPhrases.find((p) => p.text.trim().toLowerCase() === normalized)
        if (jsMatch) {
          result = jsMatch
          return
        }

        // Create the Typed category lazily on first insertion
        const existingCategory = await tx.getFirstAsync<{ id: string }>("SELECT id FROM category WHERE id = 'typed'")
        if (!existingCategory) {
          const maxCat = await tx.getFirstAsync<{ max_pos: number | null }>(
            'SELECT MAX(position) AS max_pos FROM category'
          )
          const catPosition = (maxCat?.max_pos ?? -1) + 1
          await tx.runAsync(
            'INSERT INTO category (id, name, position, fixed) VALUES (?, ?, ?, ?)',
            'typed',
            'Typed',
            catPosition,
            0
          )
        }

        const maxPos = await tx.getFirstAsync<{ max_pos: number | null }>(
          "SELECT MAX(position) AS max_pos FROM phrase WHERE category_id = 'typed'"
        )
        const position = (maxPos?.max_pos ?? -1) + 1
        const id =
          typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `typed-${now().getTime()}-${Math.random().toString(36).slice(2, 9)}`
        const createdAt = now().getTime()

        await tx.runAsync(
          'INSERT INTO phrase (id, category_id, text, position, fixed, reviewed, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          id,
          'typed',
          trimmed,
          position,
          0,
          1,
          createdAt
        )

        result = {
          id,
          category_id: 'typed',
          text: trimmed,
          position,
          fixed: 0,
          reviewed: 1,
          created_at: createdAt
        }
        notifyNeeded = true
      })

      if (notifyNeeded) {
        notify()
      }

      return result
    },
    async typeMatches(input: string, placeId?: string | null): Promise<Phrase[]> {
      const trimmed = input.trim()
      if (!trimmed) return []

      const words = trimmed.match(/[\p{L}\p{N}']+/gu)
      if (!words || words.length === 0) return []

      const currentWord = words[words.length - 1].toLowerCase()
      if (!currentWord) return []

      const normalizedCurrent = currentWord.replace(/['’]/g, '')

      type CandidateRow = Phrase & { place_match: number }
      const rows = await db.getAllAsync<CandidateRow>(
        `SELECT p.id, p.category_id, p.text, p.position, p.fixed, p.reviewed, p.created_at,
           EXISTS(
             SELECT 1 FROM phrase_place pp
             WHERE pp.phrase_id = p.id AND pp.place_id = ?
           ) AS place_match
         FROM phrase p
         JOIN category c ON c.id = p.category_id
         WHERE c.id != 'strip'
         ORDER BY place_match DESC, c.position, p.position, p.id`,
        placeId ?? ''
      )

      const matches: Phrase[] = []
      for (const row of rows) {
        const phraseWords = row.text.match(/[\p{L}\p{N}']+/gu) || []
        const hasPrefixMatch = phraseWords.some((w) => {
          const lower = w.toLowerCase()
          return (
            lower.startsWith(currentWord) ||
            (normalizedCurrent.length > 0 && lower.replace(/['’]/g, '').startsWith(normalizedCurrent))
          )
        })

        if (hasPrefixMatch) {
          matches.push({
            id: row.id,
            category_id: row.category_id,
            text: row.text,
            position: row.position,
            fixed: row.fixed,
            reviewed: row.reviewed,
            created_at: row.created_at
          })
          if (matches.length === 6) break
        }
      }

      return matches
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

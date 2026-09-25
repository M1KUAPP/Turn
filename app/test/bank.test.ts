import { DatabaseSync } from 'node:sqlite'
import { afterEach, describe, expect, test, vi } from 'vitest'
import starterBank from '../src/content/starter-bank.json'
import { createBankStore, localDay, type BankDatabase } from '../src/bank/store'

const databases: DatabaseSync[] = []

function database() {
  const sqlite = new DatabaseSync(':memory:')
  databases.push(sqlite)
  const adapter: BankDatabase = {
    execAsync: async (sql: string) => {
      sqlite.exec(sql)
    },
    runAsync: async (sql: string, ...args: (string | number)[]) => {
      sqlite.prepare(sql).run(...args)
    },
    getFirstAsync: async <T>(sql: string, ...args: (string | number)[]) =>
      (sqlite.prepare(sql).get(...args) as T | undefined) ?? null,
    getAllAsync: async <T>(sql: string, ...args: (string | number)[]) => sqlite.prepare(sql).all(...args) as T[],
    withExclusiveTransactionAsync: async (work) => {
      sqlite.exec('BEGIN IMMEDIATE')
      try {
        await work(adapter)
        sqlite.exec('COMMIT')
      } catch (error) {
        sqlite.exec('ROLLBACK')
        throw error
      }
    }
  }
  return adapter
}

afterEach(() => {
  for (const db of databases.splice(0)) db.close()
})

describe('bank store', () => {
  test('reads and writes nullable settings across store instances', async () => {
    const db = database()
    const first = createBankStore(db, starterBank)
    await first.initialize()

    expect(await first.setting('voice_id')).toBeNull()
    await first.setSetting('voice_id', 'voice-1')
    await first.setSetting('speech_rate', 'normal')

    const next = createBankStore(db, starterBank)
    await next.initialize()
    expect(await next.setting('voice_id')).toBe('voice-1')
    expect(await next.setting('speech_rate')).toBe('normal')

    await next.setSetting('voice_id', null)
    expect(await first.setting('voice_id')).toBeNull()
    expect(await next.setting('speech_rate')).toBe('normal')
  })

  test('remembers the chosen place across launches and rejects unknown places', async () => {
    const db = database()
    const first = createBankStore(db, starterBank)
    await first.initialize()
    expect((await first.places()).map((place) => place.name)).toEqual(['Home', 'Clinic', 'Shop', 'Out'])
    expect((await first.selectedPlace())?.name).toBe('Home')

    await first.choosePlace('clinic')
    const next = createBankStore(db, starterBank)
    await next.initialize()
    expect((await next.selectedPlace())?.name).toBe('Clinic')
    await expect(next.choosePlace('missing')).rejects.toThrow('Unknown place')
    expect((await next.selectedPlace())?.name).toBe('Clinic')
  })

  test('seeds only once and reads Quick first with the strip excluded', async () => {
    const db = database()
    const store = createBankStore(db, starterBank, () => new Date(2026, 8, 23))
    await store.initialize()
    const categories = await store.categories()
    expect(categories[0].id).toBe('quick')
    expect(categories.some((category) => category.id === 'strip')).toBe(false)
    expect((await store.phrases('quick')).map((phrase) => phrase.text).slice(0, 3)).toEqual(['Yes', 'No', 'Not sure'])

    await db.runAsync("UPDATE phrase SET text = 'Absolutely' WHERE id = 'yes'")
    await store.initialize()
    expect((await store.phrases('quick'))[0].text).toBe('Absolutely')
  })

  test('records each spoken tap in a local day and prunes rows outside 30 days', async () => {
    const db = database()
    const date = new Date(2026, 8, 23, 22, 30)
    const store = createBankStore(db, starterBank, () => date)
    await store.initialize()
    await store.recordTap('yes')
    await store.recordTap('yes')
    expect(await store.tapCount('yes', localDay(date))).toBe(2)
    await db.runAsync('INSERT INTO tap (phrase_id, day, count) VALUES (?, ?, ?)', 'yes', localDay(date) - 30, 7)
    await store.initialize()
    expect(await store.tapCount('yes', localDay(date) - 30)).toBe(0)
    expect(await store.tapCount('yes', localDay(date))).toBe(2)
  })

  test('publishes bank edits and preserves visible order after taps', async () => {
    const store = createBankStore(database(), starterBank, () => new Date(2026, 8, 23))
    await store.initialize()
    const before = (await store.phrases('quick')).map((phrase) => phrase.id)
    let changes = 0
    const unsubscribe = store.subscribe(() => {
      changes++
    })
    await store.updatePhraseText('yes', 'Certainly')
    await store.recordTap('yes')
    expect(changes).toBe(1)
    expect((await store.phrases('quick')).map((phrase) => phrase.id)).toEqual(before)
    unsubscribe()
  })

  test('reads the rankable bank with place ties and recent tap counts', async () => {
    const date = new Date(2026, 8, 23)
    const store = createBankStore(database(), starterBank, () => date)
    await store.initialize()
    await store.recordTap('it-was-hard')
    await store.recordTap('it-was-hard')

    const first = await store.rankingData()
    expect(first.bank.some((phrase) => phrase.id === 'wait-im-typing')).toBe(false)
    expect(first.bank.find((phrase) => phrase.id === 'it-was-hard')).toMatchObject({
      text: 'It was hard',
      places: ['clinic'],
      fixed: false
    })
    expect(first.bank.find((phrase) => phrase.id === 'yes')?.fixed).toBe(true)
    expect(first.taps.get('it-was-hard')).toBe(2)

    await store.updatePhraseText('it-was-hard', 'Physio was hard')
    const typed = await store.saveTypedPhrase('The new nurse is kind')
    const next = await store.rankingData()
    expect(next.bank.find((phrase) => phrase.id === 'it-was-hard')?.text).toBe('Physio was hard')
    expect(next.bank.find((phrase) => phrase.id === typed?.id)?.text).toBe('The new nurse is kind')
  })

  test('the debug action seeds 2,000 phrases without duplicating them', async () => {
    vi.stubGlobal('__DEV__', true)
    try {
      const store = createBankStore(database(), starterBank, () => new Date(2026, 8, 23))
      await store.initialize()
      await store.seedDebugPhrases()
      await store.seedDebugPhrases()
      const phrases = await store.phrases('debug-load')
      expect(phrases).toHaveLength(2000)
      expect(phrases[0].text).toBe('Test phrase 1')
      expect(phrases.at(-1)?.text).toBe('Test phrase 2000')
    } finally {
      vi.unstubAllGlobals()
    }
  })

  test('saves typed phrases with trimming, deduplication, length limits, and bank order', async () => {
    const store = createBankStore(database(), starterBank, () => new Date(2026, 8, 23))
    await store.initialize()

    let changeCount = 0
    store.subscribe(() => {
      changeCount++
    })

    // Returns null for empty or whitespace-only text
    expect(await store.saveTypedPhrase('')).toBeNull()
    expect(await store.saveTypedPhrase('   ')).toBeNull()
    expect(changeCount).toBe(0)

    // Returns null for text longer than 200 characters after trimming
    const text200 = 'a'.repeat(200)
    const text201 = 'a'.repeat(201)
    expect(await store.saveTypedPhrase(text201)).toBeNull()
    expect(await store.saveTypedPhrase(`  ${text201}  `)).toBeNull()
    expect(changeCount).toBe(0)

    // Saves valid 200-character phrase and creates Typed category lazily
    const categoriesBefore = await store.categories()
    expect(categoriesBefore.some((c) => c.id === 'typed')).toBe(false)

    const saved200 = await store.saveTypedPhrase(`  ${text200}  `)
    expect(saved200).not.toBeNull()
    expect(saved200?.text).toBe(text200)
    expect(saved200?.category_id).toBe('typed')
    expect(saved200?.position).toBe(0)
    expect(saved200?.id).toBeTruthy()
    expect(changeCount).toBe(1)

    const categoriesAfter = await store.categories()
    const typedCategory = categoriesAfter.find((c) => c.id === 'typed')
    expect(typedCategory).toBeDefined()
    expect(typedCategory?.name).toBe('Typed')

    // Appends subsequent phrases in bank order with unique ids
    const savedSecond = await store.saveTypedPhrase('A unique second phrase')
    expect(savedSecond).not.toBeNull()
    expect(savedSecond?.category_id).toBe('typed')
    expect(savedSecond?.position).toBe(1)
    expect(savedSecond?.id).not.toBe(saved200?.id)
    expect(changeCount).toBe(2)

    const typedPhrases = await store.phrases('typed')
    expect(typedPhrases.map((p) => p.text)).toEqual([text200, 'A unique second phrase'])

    // Deduplicates across the whole bank after trimming and ignoring case
    // 1. Existing starter bank phrase ('Yes' in Quick)
    const duplicateYes = await store.saveTypedPhrase('   yEs   ')
    expect(duplicateYes?.id).toBe('yes')
    expect(duplicateYes?.category_id).toBe('quick')
    expect(changeCount).toBe(2)

    // 2. Existing strip phrase ("Wait, I'm typing")
    const duplicateStrip = await store.saveTypedPhrase("  wait, i'm typing  ")
    expect(duplicateStrip?.id).toBe('wait-im-typing')
    expect(duplicateStrip?.category_id).toBe('strip')
    expect(changeCount).toBe(2)

    // 3. Existing typed phrase ('A unique second phrase')
    const duplicateTyped = await store.saveTypedPhrase('a UNIQUE second phrase')
    expect(duplicateTyped?.id).toBe(savedSecond?.id)
    expect(changeCount).toBe(2)
  })

  test('matches phrases by word prefix with current place priority, bank order ties, strip excluded, max 6', async () => {
    const store = createBankStore(database(), starterBank, () => new Date(2026, 8, 23))
    await store.initialize()

    // Empty or whitespace-only input returns empty array
    expect(await store.typeMatches('', 'home')).toEqual([])
    expect(await store.typeMatches('   ', 'home')).toEqual([])

    // At Home, typing "wa" matches phrases whose words begin with "wa"
    // "Wait, I'm typing" in strip must be excluded.
    // "Water, please" (tied to Home) should come first.
    const homeMatches = await store.typeMatches('wa', 'home')
    expect(homeMatches).toHaveLength(6)
    expect(homeMatches.some((p) => p.category_id === 'strip')).toBe(false)
    expect(homeMatches.some((p) => p.text === "Wait, I'm typing")).toBe(false)
    expect(homeMatches[0].text).toBe('Water, please')

    // At Clinic, "Water, please" is not tied to clinic, so phrases tied to clinic come first
    const clinicMatches = await store.typeMatches('wa', 'clinic')
    expect(clinicMatches).toHaveLength(6)
    expect(clinicMatches.some((p) => p.category_id === 'strip')).toBe(false)
    expect(['It was hard', 'How long is the wait?', "I'm waiting for my ride"]).toContain(clinicMatches[0].text)

    // Without place, bank order breaks ties
    const noPlaceMatches = await store.typeMatches('wa', null)
    expect(noPlaceMatches).toHaveLength(6)
    expect(noPlaceMatches.some((p) => p.category_id === 'strip')).toBe(false)
    // First non-strip "wa" phrase in bank order is "No, I don't want that" from 'care'
    expect(noPlaceMatches[0].text).toBe("No, I don't want that")

    // Multi-word input: current typed word is the last word
    const multiWordMatches = await store.typeMatches('I want wa', 'home')
    expect(multiWordMatches.map((p) => p.id)).toEqual(homeMatches.map((p) => p.id))

    // Matching words in the middle of a phrase
    const pleaseMatches = await store.typeMatches('ple', 'home')
    expect(pleaseMatches.some((p) => p.text === 'Water, please')).toBe(true)

    // Substring in middle of word does not match
    const noSubstrings = await store.typeMatches('ter', 'home')
    expect(noSubstrings.some((p) => p.text === 'Water, please')).toBe(false)

    // Matches saved typed phrases as well
    await store.saveTypedPhrase('Waffles for breakfast')
    const matchesWithTyped = await store.typeMatches('waf', 'home')
    expect(matchesWithTyped.some((p) => p.text === 'Waffles for breakfast')).toBe(true)
  })
})

describe('place storage', () => {
  test('adds places with trimmed 1-40 character names, up to 12, appended in order', async () => {
    const db = database()
    const store = createBankStore(db, starterBank, () => new Date(2026, 8, 23))
    await store.initialize()

    let changes = 0
    store.subscribe(() => {
      changes++
    })

    const added = await store.addPlace('  School  ')
    expect(added.name).toBe('School')
    expect(added.id).toBeTruthy()
    expect(added.position).toBe(4)
    expect(changes).toBe(1)
    expect((await store.places()).map((place) => place.name)).toEqual(['Home', 'Clinic', 'Shop', 'Out', 'School'])

    const forty = 'n'.repeat(40)
    await store.addPlace(`  ${forty}  `)
    expect(changes).toBe(2)
    expect((await store.places())[5].name).toBe(forty)

    await expect(store.addPlace('')).rejects.toThrow('Name is required')
    await expect(store.addPlace('   ')).rejects.toThrow('Name is required')
    await expect(store.addPlace('n'.repeat(41))).rejects.toThrow('Name is too long')
    expect(changes).toBe(2)

    for (let i = 0; i < 6; i++) await store.addPlace(`Place ${i}`)
    expect(await store.places()).toHaveLength(12)
    expect(changes).toBe(8)

    await expect(store.addPlace('A thirteenth place')).rejects.toThrow('Too many places')
    expect(changes).toBe(8)
    expect(await store.places()).toHaveLength(12)

    const next = createBankStore(db, starterBank)
    await next.initialize()
    expect((await next.places()).map((place) => place.name)).toEqual([
      'Home',
      'Clinic',
      'Shop',
      'Out',
      'School',
      forty,
      'Place 0',
      'Place 1',
      'Place 2',
      'Place 3',
      'Place 4',
      'Place 5'
    ])
  })

  test('renames places with trimmed 1-40 character names and notifies only on real edits', async () => {
    const db = database()
    const store = createBankStore(db, starterBank, () => new Date(2026, 8, 23))
    await store.initialize()

    let changes = 0
    store.subscribe(() => {
      changes++
    })

    await store.renamePlace('home', '  House  ')
    expect(changes).toBe(1)
    expect((await store.places())[0].name).toBe('House')
    expect((await store.selectedPlace())?.name).toBe('House')

    // The same name after trimming is not a real edit
    await store.renamePlace('home', 'House')
    expect(changes).toBe(1)

    const forty = 'a'.repeat(40)
    await store.renamePlace('clinic', forty)
    expect(changes).toBe(2)
    expect((await store.places())[1].name).toBe(forty)

    await expect(store.renamePlace('missing', 'Here')).rejects.toThrow('Unknown place')
    await expect(store.renamePlace('shop', '')).rejects.toThrow('Name is required')
    await expect(store.renamePlace('shop', 'a'.repeat(41))).rejects.toThrow('Name is too long')
    expect(changes).toBe(2)

    const next = createBankStore(db, starterBank)
    await next.initialize()
    expect((await next.places()).map((place) => place.name)).toEqual(['House', forty, 'Shop', 'Out'])
    expect((await next.selectedPlace())?.name).toBe('House')
  })

  test('moves places up and down, swapping with their neighbour, without notifying on impossible moves', async () => {
    const db = database()
    const store = createBankStore(db, starterBank, () => new Date(2026, 8, 23))
    await store.initialize()

    let changes = 0
    store.subscribe(() => {
      changes++
    })

    await store.movePlace('clinic', -1)
    expect(changes).toBe(1)
    expect((await store.places()).map((place) => place.name)).toEqual(['Clinic', 'Home', 'Shop', 'Out'])
    expect((await store.places())[0].position).toBe(0)
    expect((await store.places())[1].position).toBe(1)

    // Moves it back down
    await store.movePlace('clinic', 1)
    expect(changes).toBe(2)
    expect((await store.places()).map((place) => place.name)).toEqual(['Home', 'Clinic', 'Shop', 'Out'])

    await expect(store.movePlace('missing', 1)).rejects.toThrow('Unknown place')
    await store.movePlace('home', -1)
    await store.movePlace('out', 1)
    expect(changes).toBe(2)
    expect((await store.places()).map((place) => place.name)).toEqual(['Home', 'Clinic', 'Shop', 'Out'])

    await store.movePlace('shop', -1)
    expect(changes).toBe(3)
    expect((await store.places()).map((place) => place.name)).toEqual(['Home', 'Shop', 'Clinic', 'Out'])

    const next = createBankStore(db, starterBank)
    await next.initialize()
    expect((await next.places()).map((place) => place.name)).toEqual(['Home', 'Shop', 'Clinic', 'Out'])
    expect((await next.selectedPlace())?.name).toBe('Home')
  })

  test('deletes places, cascades phrase joins, and falls the selection back to the first place', async () => {
    const db = database()
    const store = createBankStore(db, starterBank, () => new Date(2026, 8, 23))
    await store.initialize()

    const shopJoins = await db.getAllAsync<{ phrase_id: string }>(
      "SELECT phrase_id FROM phrase_place WHERE place_id = 'shop'"
    )
    expect(shopJoins.length).toBeGreaterThan(0)

    let changes = 0
    store.subscribe(() => {
      changes++
    })

    // Deleting a place that is not selected keeps the selection
    await store.deletePlace('shop')
    expect(changes).toBe(1)
    expect((await store.places()).map((place) => place.id)).toEqual(['home', 'clinic', 'out'])
    expect(
      await db.getAllAsync<{ phrase_id: string }>('SELECT phrase_id FROM phrase_place WHERE place_id = ?', 'shop')
    ).toEqual([])
    expect((await store.selectedPlace())?.name).toBe('Home')

    // Deleting the selected place falls back to the first remaining place
    await store.deletePlace('home')
    expect(changes).toBe(2)
    expect((await store.selectedPlace())?.name).toBe('Clinic')

    const next = createBankStore(db, starterBank)
    await next.initialize()
    expect((await next.selectedPlace())?.name).toBe('Clinic')

    // Deleting the last places leaves no place and no selection
    await store.deletePlace('clinic')
    await store.deletePlace('out')
    expect(changes).toBe(4)
    expect(await store.places()).toEqual([])
    expect(await store.selectedPlace()).toBeNull()

    await expect(store.deletePlace('out')).rejects.toThrow('Unknown place')
    expect(changes).toBe(4)

    const last = createBankStore(db, starterBank)
    await last.initialize()
    expect(await last.places()).toEqual([])
    expect(await last.selectedPlace()).toBeNull()
  })
})

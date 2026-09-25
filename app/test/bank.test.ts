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
    await store.editPhrase('i-dont-know', { text: 'Certainly' })
    await store.recordTap('i-dont-know')
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

    await store.editPhrase('it-was-hard', { text: 'Physio was hard' })
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

describe('category storage', () => {
  test('adds categories with trimmed 1-40 character names up to 12 (with and without Typed), refusing the 13th and >40 chars', async () => {
    const db = database()
    const store = createBankStore(db, starterBank, () => new Date(2026, 8, 23))
    await store.initialize()

    let changes = 0
    store.subscribe(() => {
      changes++
    })

    // Adds a category with trimmed name
    const added = await store.addCategory('  Custom  ')
    expect(added.name).toBe('Custom')
    expect(added.id).toBeTruthy()
    expect(added.fixed).toBe(0)
    expect(changes).toBe(1)
    const cats = await store.categories()
    expect(cats.some((c) => c.name === 'Custom')).toBe(true)

    // Rejects empty or whitespace-only name
    await expect(store.addCategory('')).rejects.toThrow('Name is required')
    await expect(store.addCategory('   ')).rejects.toThrow('Name is required')
    // Rejects 41 characters
    await expect(store.addCategory('c'.repeat(41))).rejects.toThrow('Name is too long')
    expect(changes).toBe(1)

    // Limit WITHOUT Typed:
    // Starter bank has 10 categories (9 visible + strip).
    // With 'Custom' added, there are 11 categories in DB.
    // Reserving 1 slot for Typed, effective count is 12 (at maximum).
    // Adding another category must be refused as the 13th!
    await expect(store.addCategory('Twelfth in DB')).rejects.toThrow('Too many categories')
    expect(changes).toBe(1)

    // Survives relaunch
    const next = createBankStore(db, starterBank)
    await next.initialize()
    expect((await next.categories()).some((c) => c.name === 'Custom')).toBe(true)

    // Limit WITH Typed:
    // Create a new store where Typed already exists
    const db2 = database()
    const store2 = createBankStore(db2, starterBank, () => new Date(2026, 8, 23))
    await store2.initialize()
    await store2.saveTypedPhrase('Hello world')
    // Now DB has 11 categories (9 starter visible + 1 strip + 1 typed).
    // Adding 1 custom category brings total to 12 categories in DB.
    await store2.addCategory('Twelfth Category')
    expect((await store2.categories()).length).toBe(11) // 11 visible + 1 strip = 12 total in DB
    // Attempting to add a 13th must be refused
    await expect(store2.addCategory('Thirteenth Category')).rejects.toThrow('Too many categories')
  })

  test('renames categories with trimmed 1-40 character names, allows Quick and body-pain, refuses strip and invalid names', async () => {
    const db = database()
    const store = createBankStore(db, starterBank, () => new Date(2026, 8, 23))
    await store.initialize()

    let changes = 0
    store.subscribe(() => {
      changes++
    })

    // Normal category rename
    await store.renameCategory('chat', '  Conversations  ')
    expect(changes).toBe(1)
    expect((await store.categories()).find((c) => c.id === 'chat')?.name).toBe('Conversations')

    // Same trimmed name does not notify
    await store.renameCategory('chat', 'Conversations')
    expect(changes).toBe(1)

    // Quick CAN be renamed
    await store.renameCategory('quick', 'Fast')
    expect(changes).toBe(2)
    expect((await store.categories())[0].name).toBe('Fast')

    // body-pain CAN be renamed
    await store.renameCategory('body-pain', 'Pain & Body')
    expect(changes).toBe(3)
    expect((await store.categories()).find((c) => c.id === 'body-pain')?.name).toBe('Pain & Body')

    // strip CANNOT be renamed
    await expect(store.renameCategory('strip', 'New Strip')).rejects.toThrow('Cannot rename strip')
    expect(changes).toBe(3)

    // Unknown category
    await expect(store.renameCategory('missing', 'Nowhere')).rejects.toThrow('Unknown category')

    // Validation
    await expect(store.renameCategory('chat', '')).rejects.toThrow('Name is required')
    await expect(store.renameCategory('chat', '   ')).rejects.toThrow('Name is required')
    await expect(store.renameCategory('chat', 'a'.repeat(41))).rejects.toThrow('Name is too long')
    expect(changes).toBe(3)

    // Survives relaunch
    const next = createBankStore(db, starterBank)
    await next.initialize()
    expect((await next.categories())[0].name).toBe('Fast')
    expect((await next.categories()).find((c) => c.id === 'body-pain')?.name).toBe('Pain & Body')
  })

  test('moves categories up and down, keeping Quick first, and refuses moving Quick, above Quick, or strip', async () => {
    const db = database()
    const store = createBankStore(db, starterBank, () => new Date(2026, 8, 23))
    await store.initialize()

    let changes = 0
    store.subscribe(() => {
      changes++
    })

    // Initial categories: quick, chat, care, body-pain, ...
    const initial = (await store.categories()).map((c) => c.id)
    expect(initial[0]).toBe('quick')
    expect(initial[1]).toBe('chat')
    expect(initial[2]).toBe('care')

    // Moving care up (-1) swaps with chat (at index 1)
    await store.moveCategory('care', -1)
    expect(changes).toBe(1)
    const afterFirstMove = (await store.categories()).map((c) => c.id)
    expect(afterFirstMove[1]).toBe('care')
    expect(afterFirstMove[2]).toBe('chat')

    // Moving care back down (1) swaps back with chat
    await store.moveCategory('care', 1)
    expect(changes).toBe(2)
    expect((await store.categories()).map((c) => c.id)).toEqual(initial)

    // Moving Quick (-1 or 1) is refused
    await expect(store.moveCategory('quick', -1)).rejects.toThrow('Quick cannot be moved')
    await expect(store.moveCategory('quick', 1)).rejects.toThrow('Quick cannot be moved')
    expect(changes).toBe(2)

    // Moving category at index 1 up (-1) would place it above Quick -> refused
    await expect(store.moveCategory('chat', -1)).rejects.toThrow('Quick must stay first')
    expect(changes).toBe(2)

    // Moving strip is refused
    await expect(store.moveCategory('strip', 1)).rejects.toThrow('Cannot move strip')
    await expect(store.moveCategory('strip', -1)).rejects.toThrow('Cannot move strip')

    // Moving unknown category is refused
    await expect(store.moveCategory('missing', 1)).rejects.toThrow('Unknown category')
    expect(changes).toBe(2)

    // Moving last category down does nothing (no throw, no notify)
    const lastCat = initial[initial.length - 1]
    await store.moveCategory(lastCat, 1)
    expect(changes).toBe(2)

    // Survives relaunch
    await store.moveCategory('care', -1)
    const next = createBankStore(db, starterBank)
    await next.initialize()
    expect((await next.categories()).map((c) => c.id)[1]).toBe('care')
  })

  test('deletes categories, moving phrases to destination category, and refuses deleting fixed categories, strip, or non-empty without destination', async () => {
    const db = database()
    const store = createBankStore(db, starterBank, () => new Date(2026, 8, 23))
    await store.initialize()

    let changes = 0
    store.subscribe(() => {
      changes++
    })

    // Fixed categories cannot be deleted
    await expect(store.deleteCategory('quick')).rejects.toThrow('Category cannot be deleted')
    await expect(store.deleteCategory('body-pain')).rejects.toThrow('Category cannot be deleted')
    await expect(store.deleteCategory('strip')).rejects.toThrow('Category cannot be deleted')
    expect(changes).toBe(0)

    // Unknown category
    await expect(store.deleteCategory('missing')).rejects.toThrow('Unknown category')

    // chat has phrases: deleting without destination is refused
    const chatPhrases = await store.phrases('chat')
    expect(chatPhrases.length).toBeGreaterThan(0)
    await expect(store.deleteCategory('chat')).rejects.toThrow('Destination category is required')

    // Destination cannot be itself
    await expect(store.deleteCategory('chat', 'chat')).rejects.toThrow('Destination cannot be the same category')

    // Destination cannot be strip
    await expect(store.deleteCategory('chat', 'strip')).rejects.toThrow('Cannot move phrases to strip')

    // Destination cannot be unknown
    await expect(store.deleteCategory('chat', 'missing')).rejects.toThrow('Unknown destination category')

    // Deleting chat with destination 'care' moves all phrases to care at its end in one transaction
    const carePhrasesBefore = await store.phrases('care')
    await store.deleteCategory('chat', 'care')
    expect(changes).toBe(1)
    expect((await store.categories()).some((c) => c.id === 'chat')).toBe(false)

    const carePhrasesAfter = await store.phrases('care')
    expect(carePhrasesAfter.length).toBe(carePhrasesBefore.length + chatPhrases.length)
    // The moved phrases are at the end of care
    const movedIds = carePhrasesAfter.slice(carePhrasesBefore.length).map((p) => p.id)
    expect(movedIds).toEqual(chatPhrases.map((p) => p.id))

    // Survives relaunch
    const next = createBankStore(db, starterBank)
    await next.initialize()
    expect((await next.categories()).some((c) => c.id === 'chat')).toBe(false)
    expect((await next.phrases('care')).length).toBe(carePhrasesAfter.length)

    // Deleting an empty category succeeds without destination
    const emptyCat = await next.addCategory('Empty')
    expect((await next.phrases(emptyCat.id)).length).toBe(0)
    await next.deleteCategory(emptyCat.id)
    expect((await next.categories()).some((c) => c.id === emptyCat.id)).toBe(false)

    // Typed category can be deleted like any other category
    await next.saveTypedPhrase('Something typed')
    expect((await next.categories()).some((c) => c.id === 'typed')).toBe(true)
    const typedPhrases = await next.phrases('typed')
    expect(typedPhrases.length).toBeGreaterThan(0)
    await next.deleteCategory('typed', 'care')
    expect((await next.categories()).some((c) => c.id === 'typed')).toBe(false)
  })
})

describe('phrase storage and undo', () => {
  test('adds phrases with trimmed 1-200 character text and place associations, appending to category, refusing strip and invalid text', async () => {
    const db = database()
    const store = createBankStore(db, starterBank, () => new Date(2026, 8, 23))
    await store.initialize()

    let changes = 0
    store.subscribe(() => {
      changes++
    })

    const initialCare = await store.phrases('care')
    const added = await store.addPhrase('care', '  I need help with this  ', ['home', 'clinic'])
    expect(added.text).toBe('I need help with this')
    expect(added.category_id).toBe('care')
    expect(added.position).toBe(initialCare.length)
    expect(added.fixed).toBe(0)
    expect(added.reviewed).toBe(1)
    expect(changes).toBe(1)

    const places = await store.phrasePlaces(added.id)
    expect(places.sort()).toEqual(['clinic', 'home'])

    // Rejects empty or whitespace-only text
    await expect(store.addPhrase('care', '')).rejects.toThrow('Text is required')
    await expect(store.addPhrase('care', '   ')).rejects.toThrow('Text is required')

    // Rejects text longer than 200 characters
    await expect(store.addPhrase('care', 'p'.repeat(201))).rejects.toThrow('Text is too long')

    // Rejects adding to strip
    await expect(store.addPhrase('strip', 'Strip phrase')).rejects.toThrow('Cannot add phrases to strip')

    // Rejects unknown category
    await expect(store.addPhrase('missing', 'Hello')).rejects.toThrow('Unknown category')

    // Survives relaunch
    const next = createBankStore(db, starterBank)
    await next.initialize()
    const nextCare = await next.phrases('care')
    const found = nextCare.find((p) => p.id === added.id)
    expect(found?.text).toBe('I need help with this')
    expect((await next.phrasePlaces(added.id)).sort()).toEqual(['clinic', 'home'])
  })

  test('edits phrase text, category, and places, updating reviewed flag and enforcing fixed/strip rules', async () => {
    const db = database()
    const store = createBankStore(db, starterBank, () => new Date(2026, 8, 23))
    await store.initialize()

    let changes = 0
    store.subscribe(() => {
      changes++
    })

    // Starter phrases have reviewed = 0 initially
    const carePhrases = await store.phrases('care')
    const starterPhrase = carePhrases[0]
    expect(starterPhrase.reviewed).toBe(0)

    // Editing text sets reviewed = 1
    await store.editPhrase(starterPhrase.id, { text: '  Updated starter text  ' })
    expect(changes).toBe(1)
    const careAfterEdit = await store.phrases('care')
    const editedStarter = careAfterEdit.find((p) => p.id === starterPhrase.id)
    expect(editedStarter?.text).toBe('Updated starter text')
    expect(editedStarter?.reviewed).toBe(1)

    // Editing category moves phrase to the end of the new category
    const familyBefore = await store.phrases('family')
    await store.editPhrase(starterPhrase.id, { categoryId: 'family' })
    expect(changes).toBe(2)
    const familyAfter = await store.phrases('family')
    expect(familyAfter.length).toBe(familyBefore.length + 1)
    const movedPhrase = familyAfter.at(-1)
    expect(movedPhrase?.id).toBe(starterPhrase.id)
    expect(movedPhrase?.position).toBe(familyBefore.length)

    // Editing places
    await store.editPhrase(starterPhrase.id, { placeIds: ['shop'] })
    expect(changes).toBe(3)
    expect(await store.phrasePlaces(starterPhrase.id)).toEqual(['shop'])

    // Fixed phrase rules (BANK-5)
    // 'yes' cannot be renamed
    await expect(store.editPhrase('yes', { text: 'Yeah' })).rejects.toThrow('Fixed phrases cannot be renamed')
    // 'yes' cannot be moved out of Quick
    await expect(store.editPhrase('yes', { categoryId: 'care' })).rejects.toThrow(
      'Fixed phrases cannot be moved out of Quick'
    )
    // 'yes' can update its places
    await store.editPhrase('yes', { placeIds: ['home'] })
    expect(changes).toBe(4)
    expect(await store.phrasePlaces('yes')).toEqual(['home'])

    // Strip phrase rules (SPEAK-7)
    // Strip phrase can be reworded
    await store.editPhrase('wait-im-typing', { text: 'Please hold on' })
    expect(changes).toBe(5)
    expect((await store.phrases('strip')).find((p) => p.id === 'wait-im-typing')?.text).toBe('Please hold on')

    // Strip phrase cannot be moved out of strip
    await expect(store.editPhrase('wait-im-typing', { categoryId: 'quick' })).rejects.toThrow(
      'Cannot move strip phrases'
    )

    // Non-strip phrase cannot be moved into strip
    await expect(store.editPhrase(starterPhrase.id, { categoryId: 'strip' })).rejects.toThrow(
      'Cannot move phrases to strip'
    )

    // Validation
    await expect(store.editPhrase(starterPhrase.id, { text: '' })).rejects.toThrow('Text is required')
    await expect(store.editPhrase(starterPhrase.id, { text: 't'.repeat(201) })).rejects.toThrow('Text is too long')
    await expect(store.editPhrase('missing', { text: 'Hello' })).rejects.toThrow('Unknown phrase')

    // Survives relaunch
    const next = createBankStore(db, starterBank)
    await next.initialize()
    expect((await next.phrases('strip')).find((p) => p.id === 'wait-im-typing')?.text).toBe('Please hold on')
  })

  test('moves phrases up and down within category, refusing moves on strip phrases and boundaries', async () => {
    const db = database()
    const store = createBankStore(db, starterBank, () => new Date(2026, 8, 23))
    await store.initialize()

    let changes = 0
    store.subscribe(() => {
      changes++
    })

    const initialCare = await store.phrases('care')
    const firstId = initialCare[0].id
    const secondId = initialCare[1].id

    // Moving second phrase up (-1) swaps with first phrase
    await store.movePhrase(secondId, -1)
    expect(changes).toBe(1)
    const afterMove = await store.phrases('care')
    expect(afterMove[0].id).toBe(secondId)
    expect(afterMove[1].id).toBe(firstId)

    // Moving it back down (1) restores order
    await store.movePhrase(secondId, 1)
    expect(changes).toBe(2)
    const afterRestore = await store.phrases('care')
    expect(afterRestore[0].id).toBe(firstId)
    expect(afterRestore[1].id).toBe(secondId)

    // Strip phrases cannot be moved
    await expect(store.movePhrase('wait-im-typing', 1)).rejects.toThrow('Cannot move strip phrases')

    // Unknown phrase throws
    await expect(store.movePhrase('missing', 1)).rejects.toThrow('Unknown phrase')

    // Moving first phrase up does nothing (no throw, no notify)
    await store.movePhrase(firstId, -1)
    expect(changes).toBe(2)

    // Survives relaunch
    await store.movePhrase(secondId, -1)
    const next = createBankStore(db, starterBank)
    await next.initialize()
    expect((await next.phrases('care'))[0].id).toBe(secondId)
  })

  test('deletes phrases with staging, undo restores most recent delete, and commit persists to SQLite', async () => {
    const db = database()
    const store = createBankStore(db, starterBank, () => new Date(2026, 8, 23))
    await store.initialize()

    let changes = 0
    store.subscribe(() => {
      changes++
    })

    // Fixed phrases cannot be deleted
    await expect(store.deletePhrase('yes')).rejects.toThrow('Fixed phrases cannot be deleted')
    await expect(store.deletePhrase('no')).rejects.toThrow('Fixed phrases cannot be deleted')
    await expect(store.deletePhrase('not-sure')).rejects.toThrow('Fixed phrases cannot be deleted')
    expect(changes).toBe(0)

    // Strip phrases cannot be deleted
    await expect(store.deletePhrase('wait-im-typing')).rejects.toThrow('Cannot delete strip phrases')
    expect(changes).toBe(0)

    // Unknown phrase cannot be deleted
    await expect(store.deletePhrase('missing')).rejects.toThrow('Unknown phrase')

    // Pick a phrase from care to stage delete
    const carePhrases = await store.phrases('care')
    const target = carePhrases[0]

    // Stage delete
    await store.deletePhrase(target.id)
    expect(changes).toBe(1)

    // It hides immediately from phrases(category)
    const careAfterDelete = await store.phrases('care')
    expect(careAfterDelete.some((p) => p.id === target.id)).toBe(false)

    // It hides immediately from phrases('all')
    const allAfterDelete = await store.phrases('all')
    expect(allAfterDelete.some((p) => p.id === target.id)).toBe(false)

    // It hides immediately from rankingData()
    const ranking = await store.rankingData()
    expect(ranking.bank.some((p) => p.id === target.id)).toBe(false)

    // Deleting already-staged phrase is refused
    await expect(store.deletePhrase(target.id)).rejects.toThrow('Unknown phrase')

    // Before commitDeletes, phrase is still in SQLite, so relaunching store still sees it
    const relaunchBeforeCommit = createBankStore(db, starterBank)
    await relaunchBeforeCommit.initialize()
    expect((await relaunchBeforeCommit.phrases('care')).some((p) => p.id === target.id)).toBe(true)

    // Undo restores the staged phrase
    const restored = await store.undoDelete()
    expect(restored).not.toBeNull()
    expect(restored?.id).toBe(target.id)
    expect(changes).toBe(2)

    // It reappears in phrases and rankingData
    expect((await store.phrases('care')).some((p) => p.id === target.id)).toBe(true)
    expect((await store.rankingData()).bank.some((p) => p.id === target.id)).toBe(true)

    // Undo when empty returns null
    expect(await store.undoDelete()).toBeNull()
    expect(changes).toBe(2)

    // Stage delete two phrases: A then B
    const secondTarget = carePhrases[1]
    await store.deletePhrase(target.id)
    await store.deletePhrase(secondTarget.id)
    expect(changes).toBe(4)

    // Undo after another edit: edit a third phrase, then undo restores B then A
    const thirdTarget = carePhrases[2]
    await store.editPhrase(thirdTarget.id, { text: 'Edited third phrase' })
    expect(changes).toBe(5)

    const undoB = await store.undoDelete()
    expect(undoB?.id).toBe(secondTarget.id)
    expect(changes).toBe(6)

    const undoA = await store.undoDelete()
    expect(undoA?.id).toBe(target.id)
    expect(changes).toBe(7)

    // Now test commitDeletes()
    await store.deletePhrase(target.id)
    expect(changes).toBe(8)
    await store.commitDeletes()
    expect(changes).toBe(9)

    // Now after commitDeletes, phrase is permanently deleted from SQLite
    const relaunchAfterCommit = createBankStore(db, starterBank)
    await relaunchAfterCommit.initialize()
    expect((await relaunchAfterCommit.phrases('care')).some((p) => p.id === target.id)).toBe(false)
  })
})

# Erase all data implementation plan

> **For agentic workers:** Use `superpowers:executing-plans`. One task; write the failing Vitest cases first.

**Goal:** Settings' "Erase all data" (SET-3) deletes the phrases, categories, places, tap counts, and settings after a system alert with a destructive button, then loads the starter bank as on first launch. The Keychain user ID stays, since it's both the relay's and RevenueCat's identity, so a purchase of Turn Listen survives.

**Architecture:** The bank store gains `eraseAll()`, which empties every table and seeds the starter bank again in one transaction. `TurnProvider` gains `eraseAll()`, which stops Listen mode and speech, resets the stats, erases the bank, and then runs its start-up again, so every controller that read a setting at launch (consent, the under-18 switch, the voice and rate, the relay's cached configuration, the stats, the ranking index) starts from the empty settings. Settings' row asks first.

**Tech stack:** Expo SDK 57, expo-router, expo-sqlite, Vitest with `node:sqlite`, Maestro.

**Spec:** Issue #60; [Settings](/docs/PRD.md#settings) SET-3; the TRD's [Flows on the phone](/docs/TRD.md#flows-on-the-phone); DESIGN's [Settings](/docs/DESIGN.md#settings) and "Erase all data" in its strings.

## Decisions

- **Rows, not the file.** The TRD said the app deletes the SQLite file. The open connection holds that file, so `eraseAll()` deletes every row instead, with the same result, and the TRD now says so.
- **What goes.** Every row of `phrase_place`, `tap`, `phrase`, `category`, `place`, and `setting`, in that order for the foreign keys. `setting` holds consent's date, the under-18 switch, the voice and rate, the selected place, the relay's cached configuration, `starter_review_dismissed` (#47), and `stats` (#54). The store's in-memory staged deletions go too.
- **What stays.** The Keychain's `turn-user-id` (`app/src/relay/config.ts:16`), which only the configuration client reads, through `SecureStore`. Nothing in the erase path is given `SecureStore`.
- **The starter bank returns** through the same seeding `initialize()` does on first launch, moved into one helper both call, so the two can't drift.
- **Start-up runs again.** `TurnProvider`'s effect depends on a `generation` counter; `eraseAll()` bumps it after the erase, the old effect's cleanup disposes the old session and listeners, and `start()` builds fresh ones, which read the empty settings. `ready` is `null` in between, as at launch.
- **Order.** End Listen mode, stop speech, reset the stats (so a queued stats write can't restore old counts), erase the bank, bump `generation`. A failure before the erase leaves everything as it was.
- **Afterwards,** Settings returns to Home with `router.dismissTo('/')`. Home shows the starter bank and the starter card (BANK-10), and Listen mode asks for permission again, since consent is a setting.
- **Purchases (#53, not on `main` yet).** RevenueCat identifies the user by the Keychain ID, so the entitlement comes back after the erase. #53's start-up must not configure RevenueCat twice when start-up runs again; check `Purchases.isConfigured()` first when #53 and this meet.

## Changes

- `app/src/bank/store.ts`: move the seeding in `initialize()` into a helper that takes the transaction; add `eraseAll()`, which, in one `withExclusiveTransactionAsync`, deletes the six tables' rows, seeds, and then clears the staged deletions and calls `notify()`.
- `app/src/erase.ts` (new): `eraseAllData(parts)` with `parts: { listen: { end(): Promise<void> }, speech: { stop(): void }, stats: { reset(): Promise<void> }, bank: { eraseAll(): Promise<void> } }`, which runs the order above. Pure, with no imports but types.
- `app/src/turn-context.tsx`: `generation` state in the effect's dependencies; `eraseAll(): Promise<void>` on the context value (beside `ready`), which calls `eraseAllData` with the current `ready`, then sets `ready` to `null` and bumps `generation`.
- `app/src/screens/SettingsScreen.tsx`: the "Erase all data" row gains an action that opens `Alert.alert('Erase all data?', <DESIGN's message>, [...])` with "Cancel" (`style: 'cancel'`) and "Erase" (`style: 'destructive'`), whose handler awaits `eraseAll()` and then calls `router.dismissTo('/')`.
- `docs/TRD.md`: "Erase all data (SET-3)" says rows, not the file.

## Tests

- `app/test/bank.test.ts`: after adding a phrase and a place, tapping a phrase, choosing a place, and setting `starter_review_dismissed` and `stats`, `eraseAll()` leaves categories, phrases, places, and phrase-place links equal to a freshly seeded store's, no taps, and only `starter_seeded` in `setting`; subscribers hear it once; the added phrase is gone; `initialize()` afterwards seeds nothing twice.
- `app/test/erase.test.ts` (new): `eraseAllData` calls `listen.end`, `speech.stop`, `stats.reset`, and `bank.eraseAll` in that order; a rejected `stats.reset` stops it before the bank; and, with a real bank and a configuration client over a fake `SecureStore` holding `turn-user-id`, the relay user ID after the erase is the one from before.

## Maestro

`app/maestro/erase.yaml` (new): from a fresh install, tap "Not now" on the starter card, open Settings, scroll to "Erase all data", tap it, and `takeScreenshot: erase-alert`; tap "Cancel" and assert Settings is still open; tap "Erase all data" again, then "Erase"; assert Home shows the starter card's words again. `takeScreenshot: erase-home`. It passes at the default size and at AX5.

## Checks

- [ ] Vitest: erase, and the starter bank returns (SET-3); the Keychain ID stays; the order.
- [ ] CI `pr` run: every flow passes at both sizes, with `erase.yaml`.
- [ ] After #53 merges: in the Simulator, buy Turn Listen, erase, and Listen mode is still unlocked.

# Settings and places implementation plan

> **For agentic workers:** Use failing tests before changing the bank store. Issue #39, `docs/DESIGN.md`, and the linked PRD and TRD sections are the spec.

**Goal:** Open Settings from Home and manage up to 12 local places, with the place picker reflecting every edit.

**Architecture:** Introduce Expo Router's native stack at `app/src/app/`, keeping the existing bank and speech initialization in one provider shared by Home and Settings. The Settings route owns grouped placeholder rows and a Places route owns the list and a bounded text sheet. The bank store remains the only writer for place data and notifies Home after changes.

**Tech stack:** Expo SDK 57, Expo Router, React Native, SQLite, Vitest, iOS Simulator.

**Spec:** [Issue #39](https://github.com/RevenueCat-M1KU/RevenueCat/issues/39), [Settings design](../DESIGN.md#settings), [Place picker design](../DESIGN.md#the-place-picker).

## Task 1: Place storage

**Files:** `app/src/bank/store.ts`, `app/test/bank.test.ts`.

- [x] Write failing tests for `addPlace(name): Promise<Place>`, `renamePlace(id, name): Promise<void>`, `movePlace(id, direction: -1 | 1): Promise<void>`, and `deletePlace(id): Promise<void>`.
- [x] Verify trimming, 1–40 character names, a 12-place limit, order changes, deletion of selected and last place, persistence across store recreation, and one notification per real edit.
- [x] Implement the methods with SQLite transactions. `selectedPlace()` returns `Place | null` when no place exists; deleting a selected place falls back to the first remaining place. The phrase-place join uses its existing foreign-key cascade.
- [x] Run `rtk bun run --cwd app test -- bank.test.ts` and `rtk bun run --cwd app typecheck`.

## Task 2: Native Settings navigation

**Files:** `app/package.json`, `bun.lock`, `app/app.config.ts`, `app/index.ts`, `app/App.tsx`, `app/src/app/_layout.tsx`, `app/src/app/index.tsx`, `app/src/app/settings/index.tsx`, `app/src/app/settings/places.tsx`, `app/src/turn-context.tsx`, `app/src/screens/HomeScreen.tsx`.

- [x] Install the Expo SDK 57-compatible Router and Application packages; move app initialization into a provider shared by all routes.
- [x] Register Home, Settings, and Places in a native stack. Home has no navigation header; the Settings control opens Settings in one tap, and native Back returns home.
- [x] Render Settings' grouped rows in the design's order, with disabled placeholders for tickets that have not landed. Places opens its editor; About shows the installed app version.
- [ ] Verify Home still loads its bank and speech after navigation, and the place picker reads updated names and order from bank notifications.

## Task 3: Places screen

**Files:** `app/src/app/settings/places.tsx` and optional focused screen component.

- [x] Show each place in bank order with 44-point Move up and Move down buttons and named accessibility actions on the row; disable impossible moves.
- [x] Add and rename through a sheet with `TextInput maxLength={40}`, Save and Cancel; trim on save and show validation errors.
- [x] Confirm deletion with a system alert. Permit deleting the last place; Home offers the Places screen when the picker has none.
- [ ] Check add, rename, move, delete, the 13th-place and 41st-character limits, and version display in the iOS Simulator at normal and large text sizes.

## Task 4: Handoff

- [x] Run `rtk graphify update .`, format generated files, and run workspace tests, typecheck, lint, and an iOS build.
- [x] Commit and push a PR stacked on `feat/27-speak-grid`, which remains open against `main`. Close #39 only after the acceptance checks pass.

The iOS 27 simulator build installed and launched, and Expo Router bundled the three routes. Hands-on UI checks remain open because the desktop computer-use service could not connect during this session.

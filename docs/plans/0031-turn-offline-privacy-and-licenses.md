# Offline privacy notice and licenses implementation plan

> **For agentic workers:** Use failing focused tests before implementing behavior. Issue #44, `docs/PRD.md`, `docs/TRD.md`, and `docs/DESIGN.md` are the spec.

**Goal:** Make the privacy notice and open-source licenses readable from Settings without a network connection.

**Architecture:** Bundle both notice wordings and the dependency license inventory in the app. Persist the relay's `typesafeNamed` choice in SQLite, refresh it at launch using a stable Keychain-backed anonymous ID, and never fetch when opening the notice. Keep the unnamed wording until a valid configuration has been cached. The app's notice omits contact details for now at the owner's direction; a separate issue will add them before release.

**Tech stack:** Expo SDK 57, Expo Router, SecureStore, Crypto, SQLite, Vitest, Bun.

**Spec:** [Issue #44](https://github.com/RevenueCat-M1KU/RevenueCat/issues/44), [TRD data inventory](../TRD.md#data-inventory), [Settings design](../DESIGN.md#settings).

## Task 1: Cache the relay's naming choice

**Files:** `app/src/relay/naming.ts`, `app/src/turn-context.tsx`, `app/package.json`, `bun.lock`, `app/test/relay-naming.test.ts`.

- [x] Add a focused test showing that an absent SQLite setting selects the unnamed wording, a saved true value survives a new store instance, and malformed values do not turn naming on.
- [x] Run the focused test and confirm the missing behavior causes the failure.
- [x] Implement `createNamingStore(db)` with `read(): Promise<boolean>` and `save(value: boolean): Promise<void>` using the existing `setting` table.
- [x] Add tests for a stable UUIDv4 from SecureStore and a `GET /v1/config` that saves only a valid `typesafeNamed` boolean, times out after three seconds, and retains the cached choice on failure.
- [x] Run those tests red, then implement `getOrCreateUserId` and `refreshNaming` with injected storage, UUID, fetch, and timers. Use the relay URL and build kind from Expo's public app configuration.
- [x] Load the cached choice before showing the notice, refresh it once on launch, and make refresh failure leave the notice usable offline.

## Task 2: Show the bundled notice

**Files:** `app/src/content/privacy-notice.ts`, `app/src/screens/PrivacyNoticeScreen.tsx`, `app/src/app/settings/privacy.tsx`, `app/src/app/_layout.tsx`, `app/src/screens/SettingsScreen.tsx`, `app/test/privacy-notice.test.ts`.

- [x] Write a failing content test against the required TRD data inventory: local bank, audio never stored or sent, transient transcript, tagged line and 40 candidates through Cloudflare to the hosted service in the United States, possible health details, RevenueCat purchase data, provider retention for telemetry and abuse monitoring, under-18 rule, and nearby speech warning.
- [x] Test that neither variant contains `Jev`, only the named variant contains `TypeSafe`, and the unnamed variant is selected when no valid configuration is available.
- [x] Implement two bundled variants in plain adult wording, omitting contact details as the owner directed.
- [x] Register a native Privacy notice route and enable the Settings row. Render headings and body text with the existing dynamic-type-aware `TurnText` in a scroll view. Opening the route makes no network request.

## Task 3: Bundle and show dependency licenses

**Files:** `scripts/generate-app-licenses.ts`, `scripts/generate-ios-licenses.ts`, `app/src/content/open-source-licenses.json`, `app/src/content/ios-licenses.json`, `app/src/screens/LicensesScreen.tsx`, `app/src/app/settings/licenses.tsx`, `app/src/app/_layout.tsx`, `app/src/screens/SettingsScreen.tsx`, `app/test/licenses.test.ts`.

- [x] Build an offline generator from the installed app dependency graph and package metadata. Record package name, exact version, license expression, and available license text. Fail generation if required package metadata is missing.
- [x] Add a test that the bundled manifest covers each installed app dependency and has a license for each entry. Run it red before generating the manifest.
- [x] Generate the manifest. Register a native Open-source licenses route with a searchable list and readable license details.
- [x] Re-run the generator and confirm the check reports no changes; verify the licenses screen reads only bundled data.
- [x] Bundle CocoaPods' generated native library acknowledgements and check them against the installed iOS project when it is available.

## Task 4: Verify and hand off

- [x] Run focused tests, workspace tests, typecheck, lint, an iOS export and build, and `rtk graphify update .`.
- [x] Push this branch and open [PR #107](https://github.com/RevenueCat-M1KU/RevenueCat/pull/107) stacked on `feat/27-speak-grid`.
- [x] Create [#106](https://github.com/RevenueCat-M1KU/RevenueCat/issues/106) for public contact details and teammate wording review. Close #44 after merge as the owner requested; #106 remains a release gate.

The configured workspace suite passed 543 tests; typecheck, lint, an iOS export, and an iOS 27 simulator build passed. The simulator installed and launched Turn. A system deep-link confirmation prevented automated screenshot verification of the new routes. The bundled inventory lists 554 installed app dependency packages and 12 iOS native libraries, with a license expression for each and full license text where available.

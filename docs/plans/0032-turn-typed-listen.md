# Typed partner lines in Listen mode implementation plan

> **For agentic workers:** Use failing focused tests before implementing behavior. Issue #43, `docs/PRD.md`, `docs/TRD.md`, and `docs/DESIGN.md` are the spec.

**Goal:** Let a user type a partner line and see phone-ranked replies in the fixed row, without a microphone or relay request.

**Architecture:** Read ordered phrases, place ties, and recent taps from the local SQLite bank. Keep a live `PhraseIndex` and apply the shared shortlist, phone ranking, and row rules in a typed-only session controller. The home screen starts and ends that session, opens a separate partner-line composer from the caption, and renders its row. Issues #46, #48, and #49 add consent, the relay, and live transcription later.

**Tech stack:** Expo SDK 57, React Native, SQLite, `@turn/shared`, Vitest, Bun.

**Spec:** [Issue #43](https://github.com/RevenueCat-M1KU/RevenueCat/issues/43), [PRD listening](../PRD.md#listening), [home screen states](../DESIGN.md#the-home-screen-state-by-state).

## Task 1: Read ranking inputs from the bank

**Files:** `app/src/bank/store.ts`, `app/test/bank.test.ts`, `app/package.json`, `bun.lock`.

- [x] Test that ordered phrases exclude the strip and carry fixed-button flags, place ties, and 30-day tap counts; run it red.
- [x] Add `rankingData()` to read those inputs from SQLite without changing grid order.
- [x] Add the shared workspace package as an app runtime dependency.

## Task 2: Apply the phone's ranking to typed lines

**Files:** `app/src/listen/typed-session.ts`, `app/test/typed-listen.test.ts`.

- [x] Test and implement yes-or-no fixed slots, shared-word phrases, a held row, Clear and End, blank input, and newly saved phrases.
- [x] Test an older answer and an in-flight answer after Clear; keep them from replacing the current row.
- [x] Build the index at launch and refresh it after bank edits. Keep partner lines in memory only.

## Task 3: Connect the home screen

**Files:** `app/src/screens/HomeScreen.tsx`, `app/src/screens/PartnerLineComposer.tsx`, `app/src/screens/ReplyRow.tsx`, `app/src/turn-context.tsx`, `app/src/app/index.tsx`.

- [x] Start a typed-only Listen session from the top control; keep the microphone off and provide End.
- [x] Open “What did they say?” from the caption and send its text to the phone-ranked session, distinct from “Type what to say.”
- [x] Render the row's slots and held-line note, Clear, full accessibility labels, fixed-button colors, and the speaking symbol.
- [x] Hold visible slots while a finger presses, and queue one changed-row announcement behind Turn's speech.

## Task 4: Verify and hand off

- [x] Update the bundled license inventory for the shared runtime dependency and keep workspace code out of third-party acknowledgements.
- [x] Run focused tests red and green, then the workspace suite, typecheck, lint, and an iOS export.
- [x] Build and launch the app in the iOS 27 Simulator; inspect the home screen screenshot for startup errors.
- [x] In Device Hub, check fixed replies, shared-word ranking, a held row, a newly saved phrase, a tap count that stays unchanged while untouched and rises after a tap, Clear, End, stable grid position, and a two-line ellipsis with the full accessibility label.
- [x] Fix the long phrase's over-shrinking and keep the composer open when a hardware keyboard is connected; rebuild and inspect both in the Simulator.
- [ ] Verify the Reduce Motion row transition frame by frame. The setting was enabled and the row updated, but Simulator video capture produced an empty file.
- [ ] Run the physical iPhone VoiceOver announcement check.
- [x] Run `rtk graphify update .` and format the generated graph files.
- [x] Push the branch and open [PR #109](https://github.com/RevenueCat-M1KU/RevenueCat/pull/109), now targeting `main`.

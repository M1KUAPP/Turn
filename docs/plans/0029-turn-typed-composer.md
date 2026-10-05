# Typed composer implementation plan

> **For agentic workers:** Check behavior with a failing test before implementing each model change. Issue #38 and `docs/DESIGN.md` are the spec.

**Goal:** Let the user type up to 500 characters, speak them offline, save eligible short text once under Typed, and see matching saved phrases while typing.

**Architecture:** Keep saved text and phrase matching in the SQLite bank store. Use the existing speech controller for both saved and unsaved text. The home screen owns transient composer text and shows matching phrases in the fixed reply row while the composer is open; closing it restores the prior row. A keyboard avoiding container docks the composer above the iOS keyboard and lets the upper bands scroll on short screens.

**Tech stack:** Expo SDK 57, React Native, SQLite, Vitest, iOS Simulator.

**Spec:** [Issue #38](https://github.com/M1KUAPP/Turn/issues/38), [DESIGN.md](/docs/DESIGN.md#the-composer), [TRD.md](/docs/TRD.md#flows-on-the-phone).

Contents:

1.  [Task 1: Store typed phrases and find prefix matches](#task-1-store-typed-phrases-and-find-prefix-matches)
1.  [Task 2: Speak text that is not saved](#task-2-speak-text-that-is-not-saved)
1.  [Task 3: Composer and row behavior](#task-3-composer-and-row-behavior)
1.  [Task 4: Handoff](#task-4-handoff)

## Task 1: Store typed phrases and find prefix matches

- [x] Add bank tests for trimming and case insensitive deduplication, lazy Typed creation, 200 character save limit, and bank order.
- [x] Add bank tests for word prefix matching, strip exclusion, current place priority, and six result limit.
- [x] Observe the new tests fail, then implement the bank methods and make them pass.

## Task 2: Speak text that is not saved

- [x] Add a speech controller test for unsaved text: it speaks and repeats without recording a phrase tap.
- [x] Observe the test fail, then allow a missing phrase id in the speech controller and make the test pass.

## Task 3: Composer and row behavior

- [x] Build the keyboard docked composer with a 500 character limit, four-line field, remaining count near the limit, Speak or Stop, and a close control.
- [x] Show matching saved phrases in the fixed row while typing and restore the prior row when the composer closes.
- [ ] Verify in the iOS 27 Simulator at normal and large text sizes, including keyboard layout, saved Typed phrase, repeated speech, and empty/long text.

## Task 4: Handoff

- [x] Refresh Graphify; run formatting, tests, typechecks, and an iOS build.
- [x] Commit and push a stacked PR against `feat/33-home-screen`. Leave #38 open until review and any device checks pass.

The iOS 27 simulator build launched successfully. Hands-on keyboard, speech, and Airplane Mode checks remain open because the desktop UI control service could not connect during this session.

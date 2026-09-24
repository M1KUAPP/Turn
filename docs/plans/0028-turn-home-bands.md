# Turn home bands implementation plan

> **For agentic workers:** Implement each task with a failing test first where behavior can be checked in Vitest. The issue and design are the spec.

**Goal:** Complete the home screen bands, place picker, fixed reply row, and paging in #33.

**Architecture:** Keep phrase and place data in the existing SQLite bank store. Give the screen a small layout model for width, text size, and short screens; render the caption, strip, row, tabs, and grid in that order. Use one scrolling list for the middle on short screens or from AX1, and only scroll the grid otherwise. The row accepts empty, six-slot, or big-button content without changing its outer frame.

**Tech stack:** Expo SDK 57, React Native, SQLite, Vitest, iOS Simulator.

**Spec:** [Issue #33](https://github.com/RevenueCat-M1KU/RevenueCat/issues/33), [DESIGN.md](../DESIGN.md#the-home-screen).

## Task 1: Persist the chosen place and read the strip

- [x] Add bank tests: the starter places load in order; Clinic survives a store recreation; an unknown place cannot be selected.
- [x] Run the bank test and confirm the new cases fail for the missing API.
- [x] Add `places`, `selectedPlace`, and `choosePlace` to the bank store, using the existing `setting` table. Read the strip through the existing `phrases('strip')` query and verify it on the simulator with another category selected.
- [x] Run the bank tests and typecheck.

## Task 2: Lay out the home bands

- [x] Add layout tests for 320, 375, 402, and 440 point widths, short screens, and AX5. Check column count, fixed row height, and single-scroller mode.
- [x] Run the layout test and confirm it fails for the missing model.
- [x] Implement the layout model and render the top bar, caption, five strip buttons, fixed reply row, tabs, grid, and bottom bar. Keep the row and strip before the grid in accessibility order. Use native iOS place selection.
- [x] Make strip taps use the existing speech controller; keep Type, Settings, and Listen visible pending their own issues. Make Up and Down page the active vertical list.
- [x] Add a development-only row preview and check empty, six-slot, and big-button states in the simulator.
- [x] Run app tests and typecheck.

## Task 3: Verify and hand off

- [x] Check formatting, full workspace tests, and typechecks.
- [x] Build and inspect on an iOS 27 Simulator at normal and AX5 text sizes; record the physical iPhone Switch Control check that remains.
- [x] Refresh Graphify, commit, push, and open [PR #103](https://github.com/RevenueCat-M1KU/RevenueCat/pull/103) against `feat/27-speak-grid` until #91 merges. Keep #33 open for the physical Switch Control check.

The physical iPhone Switch Control order check remains for #33 after the PR is reviewed.

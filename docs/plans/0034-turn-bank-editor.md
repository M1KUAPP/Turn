# Phrase bank editor implementation plan

> **For agentic workers:** Write failing tests before changing the bank
> store. Issue #41, `docs/DESIGN.md`, and the linked PRD and TRD sections are
> the spec.

**Goal:** Edit the phrase bank one category at a time, from Settings and from
a phrase's Edit action, within the bank's limits and fixed parts.

**Architecture:** The bank store stays the only writer and holds every rule,
so the rules are tested on Linux. Two thin Expo Router screens mirror
`PlacesScreen.tsx`: `/bank` lists the categories, and `/bank/[category]`
edits one category's phrases, as the design names it. The design has no
category list, so `/bank` fills that gap with the Places screen's pattern.

**Tech stack:** Expo SDK 57, Expo Router, React Native, SQLite, Vitest.

**Spec:** [Issue #41](https://github.com/RevenueCat-M1KU/RevenueCat/issues/41),
[the phrase bank](../PRD.md#the-phrase-bank),
[the phone's database](../TRD.md#the-phones-database),
[the phrase bank editor](../DESIGN.md#the-phrase-bank-editor),
[the phrase button](../DESIGN.md#the-phrase-button).

## Rules the store enforces

- **Count.** At most 12 categories, counting the hidden `strip` and counting
  Typed even before it exists, since `saveTypedPhrase` creates it on the
  first typed phrase (TRD: the starter's ten categories "leave room under
  BANK-2's 12 for Typed and at least one more"). Names hold 1 to 40
  characters, trimmed.
- **Quick** stays first: it can't move, nothing moves above it, and it can't
  be deleted. It can be renamed.
- **Yes, No, and Not sure** can't be deleted, renamed, or moved out of
  Quick (BANK-5).
- **`body-pain`** can be renamed and moved, not deleted (BANK-5).
- **`strip`** never shows in `/bank`'s reorderable list or the grid. Its
  phrases can be reworded, never added, moved, or deleted (SPEAK-7); the
  category can't be renamed, moved, or deleted.
- **Typed** can be deleted like any other category; typing recreates it.
- **Phrases** hold 1 to 200 characters, trimmed (BANK-3), and tie to any of
  the user's places. Ids never change on edit, since the evaluation's labels
  and the row's rules name them. Editing a starter phrase sets `reviewed`.
- **Deleting a category** that holds phrases needs a destination category,
  and moves them there, at its end, in one transaction (BANK-2).
- **Deleting a phrase** stages it: it hides everywhere at once, including
  the grid, and Undo restores the most recent staged phrase, with no timer.
  Staged deletions reach SQLite only when the editor closes (BANK-9, TRD).
- **Order** changes only by these calls; each real change notifies once
  (BANK-4).

## Task 1: Category operations

**Files:** `app/src/bank/store.ts`, `app/test/bank.test.ts`.

- [ ] Write failing tests for `addCategory(name): Promise<Category>`,
      `renameCategory(id, name): Promise<void>`,
      `moveCategory(id, direction: -1 | 1): Promise<void>`, and
      `deleteCategory(id, destinationId?: string): Promise<void>`, covering every
      category rule above: the 12 with and without Typed, the 13th refused, 41
      characters refused, Quick first, the fixed categories' refusals, and a
      non-empty delete without a destination refused.
- [ ] Implement them with SQLite transactions, mirroring the place methods.
- [ ] Run `rtk bun run --cwd app test -- bank.test.ts` and
      `rtk bun run --cwd app typecheck`.

## Task 2: Phrase operations and Undo

**Files:** `app/src/bank/store.ts`, `app/test/bank.test.ts`.

- [ ] Write failing tests for `addPhrase(categoryId, text, placeIds)`,
      `editPhrase(id, { text?, categoryId?, placeIds? })`,
      `movePhrase(id, direction: -1 | 1)`, `phrasePlaces(id)`,
      `deletePhrase(id)`, `undoDelete(): Promise<Phrase | null>`, and
      `commitDeletes()`, covering every phrase rule above, relaunch persistence
      (recreate the store on the same database, as the place tests do), a staged
      phrase missing from `phrases()` and `rankingData()`, and Undo after other
      edits.
- [ ] Reuse or replace `updatePhraseText`; don't leave two ways to reword.
- [ ] Implement them; keep staged deletions in the store's memory.
- [ ] Run the same two commands.

## Task 3: Screens and entry points

**Files:** `app/src/app/_layout.tsx`, `app/src/app/bank/index.tsx`,
`app/src/app/bank/[category].tsx`, `app/src/screens/CategoriesScreen.tsx`,
`app/src/screens/PhraseBankScreen.tsx`, `app/src/screens/SettingsScreen.tsx`,
`app/src/screens/HomeScreen.tsx`.

- [ ] Register both routes in the native stack. Settings' disabled "Phrase
      bank" row opens `/bank`.
- [ ] `CategoriesScreen` mirrors `PlacesScreen`: the categories in grid order
      with Move up and Move down, named accessibility actions, a sheet with
      `maxLength={40}` to add and rename, and a system alert to delete. Deleting
      a category that holds phrases asks where they go, listing the other
      categories. Refused actions aren't offered. The strip shows last, apart,
      as a row that opens its phrases.
- [ ] `PhraseBankScreen` shows the category's phrases in `body`, wrapped,
      with their places under them in `subheadline`, and "Starter" on starter
      phrases nobody has reviewed. Edit mode shows 44-point Move up and Move
      down; Edit, Move, and Delete are named accessibility actions. The sheet
      holds the phrase field (`maxLength={200}`, counting down near the end),
      its category, and its places. The Undo bar stays at the bottom while any
      deletion is staged; leaving the screen commits them.
- [ ] Home's phrase buttons get Edit and Move as named accessibility actions,
      never long presses; both open the phrase's sheet in its category's editor.
- [ ] Read `docs/DESIGN.md`'s rules that do not bend and its tokens, as
      `app/src/screens/AGENTS.md` asks.

## Task 4: Handoff

- [ ] Run `rtk graphify update .`, then `rtk bun run test`,
      `rtk bun run typecheck`, and `rtk bun run lint`.
- [ ] Commit, and open a pull request stacked on `feat/43-typed-listen`.
- [ ] Before merge, a teammate checks on the Simulator and the iPhone: edit a
      starter phrase and relaunch (BANK-1); each action, and a 13th category
      refused (BANK-2); a 201st character can't be typed (BANK-3); the grid shows
      each edit at once and never reorders on its own (BANK-4); no Delete for
      Yes, No, Not sure, or body and pain (BANK-5); reword a strip phrase and it
      speaks from the same place (SPEAK-7); delete, wait a minute, Undo (BANK-9);
      reorder with Switch Control, without dragging (A11Y-8); and the largest
      text size.

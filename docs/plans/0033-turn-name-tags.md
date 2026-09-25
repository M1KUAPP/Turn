# Names as tags implementation plan

> **For agentic workers:** Write failing tests before each change. Issue #34,
> `docs/TRD.md` "Names as tags" and "The turn-listen module", and
> `docs/PRD.md` "Listening" are the spec.

**Goal:** Swap every name Turn finds for a tag before a line's request can
leave the phone, then cut the request to the relay's limits.

**Architecture:** The `turn-listen` local module, in the repository's
`modules/` as the TRD's layout has it, starts with a thin Swift name finder:
`NLTagger` returns each name's kind and range, and an `NLGazetteer` built
from the user's phrases and places helps it. Everything else is TypeScript
in the app, tested on Linux against a fake finder: numbering tags, replacing
names, tag then cut, and fitting the body. Only the app tags, since
`NLTagger` runs only on iOS, so the code lives in `app/`, not `shared/`.
No request leaves the phone yet: typed Listen mode never contacts the relay,
and #48 sends lines, so this change also adds a `__DEV__` self-check for the
device criteria, like the home screen's row preview.

**Tech stack:** Expo SDK 57 local modules, Swift, NaturalLanguage, React
Native, Vitest.

**Spec:** [Issue #34](https://github.com/RevenueCat-M1KU/RevenueCat/issues/34),
[names as tags](/docs/TRD.md#names-as-tags),
[the turn-listen module](/docs/TRD.md#the-turn-listen-module),
[the repository layout](/docs/TRD.md#repository-layout),
[iPhone notes on NLTagger](/docs/research/0023-turn-ios.md#swapping-names-for-tags-with-nltagger),
[iPhone notes on local modules](/docs/research/0023-turn-ios.md#two-local-swift-modules-in-expo).

## Rules

- **Spans.** The finder returns, per text, `{ kind, start, end }` with
  `kind` one of `person`, `place`, and `org`, and offsets in UTF-16 code
  units, end exclusive, which JavaScript strings index directly.
- **Order.** Tags number by first appearance, per kind, across the line,
  then the candidates in shortlist order, then the category names in grid
  order, then the place's name, as the TRD lists them.
- **Same name, same tag.** Names match by kind, ignoring case and extra
  whitespace, so a lowercased transcript's "anna" gets Anna's tag.
- **Tag, then cut.** Lengths count code points, as the relay checks them:
  the line keeps its last 300; the place's and categories' names keep their
  first 40; a candidate over 200 is swapped for the next spare phrase,
  tagged with the same map, and dropped if none is left. Then candidates
  drop from the end until the request's UTF-8 JSON fits `limits.bytes`.
  Limits come from `@turn/shared/relay`, never literals.
- **Ids** never change, and the name-to-tag map is never returned, stored,
  or logged.

## Task 1: Spare phrases from the shortlist

**Files:** `shared/src/shortlist.ts`, `shared/test/shortlist.test.ts`.

- [x] Write a failing test: `pickShortlist(line, index, context, 50)` returns
      up to 50 phrases, and its first 40 equal `pickShortlist(line, index,
context)`'s.
- [x] Add the optional `size = 40` parameter; callers stay unchanged.
- [x] Run `rtk bun run --cwd shared test -- shortlist.test.ts` and
      `rtk bun run typecheck`.

## Task 2: Tagging and cutting

**Files:** `app/src/listen/tags.ts`, `app/test/tags.test.ts`.

- [x] Write failing tests with a fake finder for each rule above and each
      acceptance criterion that code can show: "Did Anna call?" and "Anna is my
      sister" both carry `[PERSON 1]` and no "Anna" (LISTEN-5); a 400-character
      typed line keeps its last 300 after tagging (LISTEN-6); a candidate pushed
      over 200 by a tag is swapped for a spare; the place's name is tagged
      (PLACE-3); a request of 40 two-byte candidates drops some to fit; and no
      surrogate pair is ever split.
- [x] Implement `tagRequest(input, findNames)`, taking the line, the place's
      name, the categories, the shortlist, and the spares, and returning the
      tagged line, place, categories, and candidates; and
      `fitRequest(request: LineRequest): LineRequest`.
- [x] Run `rtk bun run --cwd app test -- tags.test.ts` and
      `rtk bun run --cwd app typecheck`.

## Task 3: The turn-listen module's name finder

**Files:** `app/package.json`, `modules/turn-listen/**`,
`app/src/listen/gazetteer.ts`, `app/test/gazetteer.test.ts`,
`app/src/turn-context.tsx`.

- [x] Set `expo.autolinking.nativeModulesDir` to `../modules`, as the TRD
      says. Scaffold `modules/turn-listen` with
      `bunx create-expo-module@latest --local` if it runs without prompts;
      otherwise write the files the iPhone notes list, by hand.
- [x] In Swift, `findNames(texts: [String]) -> [[Span]]` makes one `NLTagger`
      per call with the `nameType` scheme and the `joinNames`,
      `omitPunctuation`, and `omitWhitespace` options, maps each range with
      `NSRange(range, in: text)`, and returns only `personalName`, `placeName`,
      and `organizationName`. `setGazetteer(person, place, org)` builds an
      `NLGazetteer` for English, kept behind a lock and applied to each tagger.
      No numbering, replacing, or cutting in Swift.
- [x] `modules/turn-listen/src/` exports typed wrappers through
      `requireOptionalNativeModule`, so the app runs without the module.
- [x] Write failing tests, then `rebuildGazetteer(bank, finder)`: find the
      names in every phrase and place, and set them as the gazetteer. Rebuilds
      run one at a time, and a change during one runs once more after it.
- [x] Rebuild on load and after each bank change in the provider, only when
      the module is present.
- [x] Run the app's tests and typecheck.

## Task 4: The device self-check

**Files:** `app/src/listen/tag-checks.ts`, `app/test/tag-checks.test.ts`,
`app/src/screens/SettingsScreen.tsx`.

- [x] `runTagChecks(finder)` runs the acceptance criteria's examples,
      including the lowercased line after setting a gazetteer from "Anna is my
      sister", and returns a pass or fail with the tagged text for each. It
      passes with the fake finder in a test.
- [x] A `__DEV__`-only Settings row, "Check name tags", runs it with the
      module and shows the results in an alert, then rebuilds the bank's
      gazetteer.

## Task 5: Handoff

- [ ] Run `rtk graphify update .`, then `rtk bun run test`,
      `rtk bun run typecheck`, and `rtk bun run lint`.
- [ ] Commit, and open a pull request stacked on `feat/43-typed-listen`
      that says the Swift was written without a compiler.
- [ ] Before merge, a teammate builds the Debug build on a Mac, fixes any
      Swift or podspec error, and taps "Check name tags" in the
      Simulator and on the iPhone: every check passes, including the lowercased
      line (LISTEN-5, LISTEN-6, PLACE-3, "works in the Simulator and on the
      iPhone").

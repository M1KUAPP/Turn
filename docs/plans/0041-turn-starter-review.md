# Starter bank review implementation plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` when
> workers are available, or `superpowers:executing-plans`. Each task writes
> failing Vitest tests first. Task 0 lands the four store functions as stubs,
> so Task 1 and Task 2 typecheck apart and run in parallel.

**Goal:** On first launch the empty row holds a card that invites the user, or
whoever helps them, to review the starter bank category by category, as
[the first launch](/docs/DESIGN.md#the-first-launch) sets out.

**Architecture:** `reviewed` already exists on `phrase` and the seed already
writes `0` for every starter phrase, so no schema change and no migration. The
store gains four functions: mark a category reviewed, find the next category to
review, read the card's state, and record Not now. `PhraseBankScreen` marks its
own category reviewed when it unmounts, beside the existing `commitDeletes()`
cleanup, so a category counts as reviewed however the editor was opened. A pure
`starterCardShown` in `home-layout.ts` decides when Home offers the card, and
`ReplyRow` draws it while no reply shows, sized to its words at the top of the
row's fixed frame, so the frame's height never changes.

**Tech stack:** Expo SDK 57, React Native, expo-sqlite, Vitest, Maestro 2.10.0.

**Spec:** Issue #47; [The phrase bank](/docs/PRD.md#the-phrase-bank) BANK-10;
the TRD data model and its `reviewed` column and Undo rule;
[The first launch](/docs/DESIGN.md#the-first-launch), [The row](/docs/DESIGN.md#the-row),
[The phrase bank editor](/docs/DESIGN.md#the-phrase-bank-editor),
[Buttons and lists](/docs/DESIGN.md#buttons-and-lists) and its equal-pairs
rule, and [Strings the PRD leaves open](/docs/DESIGN.md#strings-the-prd-leaves-open).

## Existing behavior and decisions

- **The seed already marks everything.** `app/src/bank/store.ts:97-105` inserts
  a literal `0` into `phrase.reviewed` for every phrase in every category in
  `app/src/content/starter-bank.json`, `strip` included. Nothing needs seeding
  differently, and the `reviewed INTEGER NOT NULL DEFAULT 1` default
  (`store.ts:41`) already covers `addPhrase` (`store.ts:452`), `saveTypedPhrase`
  (`store.ts:711`) and `seedDebugPhrases` (`store.ts:801`).
- **The editor already shows the mark.** `PhraseBankScreen.tsx:254-269` draws
  the "Starter" badge, and `PhraseBankScreen.tsx:210` builds
  `phraseDetails = [placesText, phrase.reviewed === 0 ? 'Starter' : null]` into
  `accessibilityValue`. Task 1 does not touch either.
- **`editPhrase` already clears one mark.** `store.ts:550-559` writes
  `reviewed = 1` whenever the phrase was unreviewed, even with no other change.
  That is the PRD's "keeps, edits, or reviews".
- **The note overlay cannot host the card.** `ReplyRow.tsx:213-236` renders the
  empty state as an absolutely-positioned overlay with `pointerEvents="none"`,
  which suppresses touches. The card has two live buttons, so it goes where the
  big button goes: the `bigButton ? ... : ...` ternary at `ReplyRow.tsx:166`.
- **The store's subscription already exists** (`store.ts:74-79`) and Home
  already re-reads on every notify (`HomeScreen.tsx:221`). `setSetting`
  (`store.ts:285-295`) deliberately does **not** notify, so `dismissStarterReview`
  must not be built on it.
- **The card never changes the row's height.** `layout.rowHeight` is 3 × 78 +
  2 × 12 = 258 points at the default size and on ordinary phones
  (`home-layout.ts:18`, `home-layout.test.ts:12`). The card is
  `height: layout.rowHeight`, the same as the big button (`ReplyRow.tsx:174`),
  so no existing Maestro flow's scroll distance changes.

### 1. Which phrases carry the mark, and what the walk covers

Every phrase the seed inserts starts at `reviewed = 0`, which is
`store.ts:103`. That covers three cases the pack names separately:

- **The fixed buttons** `yes`, `no`, `not-sure` in `quick` carry the mark.
  They are the team's words, and BANK-5 bars renaming them, so the Quick
  category's own review is the only way the user can keep them. They are
  cleared by `reviewCategory('quick')`, which updates by category and so takes
  them with it.
- **`body-pain` carries the mark** like any other category and is walked. It is
  fixed only against deletion and renaming (BANK-5); nothing in BANK-10 exempts
  it.
- **`strip` carries the mark and is in the walk, last.** The TRD counts the
  strip among the starter bank's ten categories ("Its ten categories, the
  strip's among them"), and its five phrases are the team's words like the rest.
  Excluding it would need a `c.id != 'strip'` clause in two new queries _and_
  leave five phrases permanently marked, so the card's "until every category is
  reviewed" would never be reached. One rule, no residue, no special case.

**The walk order** is `category.position`, then `category.id`, which is the
order `categories()` already uses (`store.ts:126`) and the order the tabs show:
`quick`, `chat`, `care`, `body-pain`, `food`, `feelings`, `family`, `health`,
`out-and-about`, `strip`. The `typed` category never appears: `saveTypedPhrase`
inserts it with `reviewed = 1` (`store.ts:715`).

### 2. What reviewing a category is

**A category counts as reviewed when the user leaves its editor.** Not when
they touch a phrase in it, and not only when the walk put them there.

Justification, from the pack: PRD BANK-10 sets the flag "when the user keeps,
edits, or reviews" a phrase, and the check is "review one category, and its
marks go" — the _category_ is the unit, not the phrase. BANK-9 already uses
"until the user leaves the editor" as the boundary for Undo
(`PhraseBankScreen.tsx:44-48`), so the app already has that boundary for a
different reason and this reuses it. Most importantly, leaving the editor is
the one rule that holds "however the editor was opened": the card's Review,
Settings → Phrase bank → a category (`SettingsScreen.tsx:163` →
`CategoriesScreen.tsx:172`), or the grid's Edit accessibility action
(`HomeScreen.tsx:313-316`). A rule keyed to the walk's own navigation would
make a category reviewable only if you got there by accident of tapping Review,
which is not what the user was asked to do.

A consequence worth stating: a user who only reorders a category in the editor
(BANK-2, A11Y-8) has kept it, and its marks go. That is the intended reading
of "review".

**Trigger:** a new effect in `PhraseBankScreen.tsx`, separate from the
`commitDeletes` one so that changing the route param doesn't start committing
deletes early:

```ts
useEffect(() => {
  return () => {
    void bank?.reviewCategory(categoryId)
  }
}, [bank, categoryId])
```

Its cleanup captures the old `categoryId`, so navigating straight from one
category to another marks the one being left.

### 3. The store

Four functions on the object `createBankStore` returns. **No schema change, no
migration**: `reviewed` and `setting` already exist.

```ts
async nextReviewCategoryId(): Promise<string | null> {
  const row = await db.getFirstAsync<{ id: string }>(
    `SELECT c.id FROM category c
     JOIN phrase p ON p.category_id = c.id
     WHERE p.reviewed = 0
     ORDER BY c.position, c.id
     LIMIT 1`
  )
  return row?.id ?? null
}
```

```ts
async reviewCategory(id: string): Promise<void> {
  const pending = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) AS count FROM phrase WHERE category_id = ? AND reviewed = 0',
    id
  )
  if (!pending || pending.count === 0) return
  await db.withExclusiveTransactionAsync(async (tx) => {
    await tx.runAsync('UPDATE phrase SET reviewed = 1 WHERE category_id = ? AND reviewed = 0', id)
  })
  notify()
}
```

The `COUNT` first is not optional. `BankDatabase.runAsync` is typed
`Promise<unknown>` (`store.ts:27`), so this adapter cannot report changed rows,
and every other notifier in the store is guarded the same way
(`store.ts:165`, `store.ts:186`, `store.ts:530`). It also means opening
`/bank/typed` or a category whose phrases are all kept costs one indexed count
and no notify.

```ts
async dismissStarterReview(): Promise<void> {
  await db.runAsync(
    "INSERT INTO setting (key, value) VALUES ('starter_review_dismissed', '1') ON CONFLICT (key) DO UPDATE SET value = excluded.value"
  )
  notify()
}
```

The key is **`starter_review_dismissed`**, matching the existing snake_case
keys (`starter_seeded` at `store.ts:118`, `selected_place` at `store.ts:276`).
It is written with its own `INSERT` rather than through `setSetting`, because
`setSetting` does not notify and Home is listening.

```ts
async starterReviewState(): Promise<{ pending: boolean; dismissed: boolean }> {
  const [row, dismissed] = await Promise.all([
    db.getFirstAsync<{ count: number }>('SELECT COUNT(*) AS count FROM phrase WHERE reviewed = 0'),
    db.getFirstAsync<{ value: string }>(
      "SELECT value FROM setting WHERE key = 'starter_review_dismissed'"
    )
  ])
  return { pending: (row?.count ?? 0) > 0, dismissed: dismissed?.value === '1' }
}
```

**How Home learns of a change:** the store's existing `subscribe`
(`store.ts:74-79`). `reviewCategory` and `dismissStarterReview` call `notify()`;
`editPhrase` already does (`store.ts:562`). Home's read effect
(`HomeScreen.tsx:201-226`) already subscribes, so the only change is one more
entry in its `Promise.all` and one `useState`.

### 4. The row

**When Home offers the card.** A pure function beside `homeLayout` in
`app/src/screens/home-layout.ts`, so the rule is tested without a renderer:

```ts
/** Whether the row offers the starter card (BANK-10): only on an idle Home, never over Listen mode, typing's matches, or the under-18 note. */
export function starterCardShown(state: {
  listening: boolean
  composerOpen: boolean
  under18: boolean
  reviewPending: boolean
  reviewDismissed: boolean
}): boolean {
  return !state.listening && !state.composerOpen && !state.under18 && state.reviewPending && !state.reviewDismissed
}
```

DESIGN's state table gives the invitation to the first launch: a session
opening leaves the row empty, and with Listen mode off the row holds typing's
matches while the keyboard is up. The under-18 note (`HomeScreen.tsx:573-579`)
keeps the row too, so `consent-under18.yaml:67-71` still reads it. Home passes:

```tsx
starterCard={
  starterCardShown({
    listening: listening.active,
    composerOpen: composerMode === 'speak',
    under18: consentState.under18,
    reviewPending: review.pending,
    reviewDismissed: review.dismissed
  })
    ? { onReview: startReview, onDismiss: dismissReview }
    : null
}
```

**Replies still win.** `ReplyRow` draws the card only while `empty`
(`ReplyRow.tsx:149`) and `starterCard` is set, in place of the empty slot grid
in the `bigButton` ternary's else-branch (`ReplyRow.tsx:166`); a reply or the
big button always shows instead. The note overlay's guard at `ReplyRow.tsx:213`
becomes `empty && !starterCard`. The note's `pointerEvents="none"` must not be
copied: the card's buttons take touches.

**The frame never changes.** The row's outer `View` keeps
`height: layout.rowHeight`. The card sits at the frame's top, sized to its
words, and the rest of the frame stays the board, as the empty row does around
its note. Nothing above or below the row moves when the card comes or goes.

**The card,** a new `app/src/screens/StarterReviewCard.tsx`:

| Part       | Value                                                                                                                                                                                                                                                          |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Box        | `borderWidth: 2`, `borderColor: colors.edge`, `borderRadius: 12`, `padding: 12`, `gap: 12`, `backgroundColor: colors.surface`: a row slot's box (`ReplyRow.tsx:106-110`)                                                                                       |
| Words      | "The Turn team wrote these starter phrases. Review them to make them yours." in `TurnText kind="body"`, `colors.ink`, with no line limit                                                                                                                       |
| Buttons    | "Review", then "Not now": DESIGN's equal pair, two `SecondaryButton`s in a `View` with `flexDirection: stacked ? 'column' : 'row'` and `gap: 12`, each `equalPair={!stacked}`, as the permission step lays out its pair (`PermissionStepScreen.tsx:59,95-107`) |
| Font scale | `stacked` is `useWindowDimensions().fontScale >= 1.786`, read in the card as the permission step does; `ReplyRow` gains no size prop                                                                                                                           |

`SecondaryButton`: copy `PermissionStepScreen.tsx:8-50` into a new
`app/src/screens/SecondaryButton.tsx` as its default export, with `disabled`
optional and `false` by default, and use it in the card only.
`PermissionStepScreen` and `ConsentCardScreen` keep their own copies in this
change.

**It fits at every size.** From `homeLayout`'s frames and `body`'s line
heights, to be confirmed in the screenshots:

| Size                       | Frame | The card, about                                |
| -------------------------- | ----- | ---------------------------------------------- |
| Default                    | 258   | 132: two lines of words and one row of buttons |
| Short screen, default size | 208   | 154: three lines and one row                   |
| AX1                        | 744   | 360: five lines and two stacked buttons        |
| AX5, 375 points wide       | 984   | 800: nine lines and two stacked buttons        |

**VoiceOver** reads the words, then "Review", button, then "Not now", button.
The card's box is not an accessibility element of its own, and nothing sits
behind it, since it replaces the empty slots. It isn't a changed row, so it
announces nothing (A11Y-2).

### 5. Review's walk

`Review` opens the editor on the next category. In `HomeScreen`:

```ts
const startReview = () => {
  void bank.nextReviewCategoryId().then((next) => {
    if (next) router.push({ pathname: '/bank/[category]', params: { category: next } })
  })
}
const dismissReview = () => {
  void bank.dismissStarterReview()
}
```

The object form matches the existing pushes at `HomeScreen.tsx:313-316` and
`HomeScreen.tsx:362-365`. A `null` category can only come from a stale tap
after the last review, so it opens nothing.

**Coming back with categories left.** The editor's cleanup marks the category
just left, `reviewCategory` notifies, Home re-reads `starterReviewState()`,
`pending` is still true, and the card is back. The next Review opens the next
category. No new string and no new state.

### 6. The editor's mark

Already implemented; leave it exactly as it is:

- `PhraseBankScreen.tsx:252-270` draws "Starter" after a phrase's places, in
  `footnote` and `ink-secondary`, in the same box as the places.
- `PhraseBankScreen.tsx:210` joins the places and "Starter" into
  `accessibilityValue`, so VoiceOver reads "Home, Starter" under the phrase.
- **Do not reformat `PhraseBankScreen.tsx:210`:**
  `app/test/screen-accessibility.test.ts:39` matches that source line as text.

### 7. Tests

**`app/test/bank.test.ts`**: a new `describe('starter review')` beside
`describe('phrase storage and undo')` (line 677), with that file's `database()`
helper (line 8) and its relaunch pattern.

| Case                                                   | Asserts                                                                                                                                                                      |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| the seed marks every starter phrase                    | every row of `phrase` has `reviewed === 0`, including `yes`, `no`, `not-sure`, a `body-pain` phrase, and `wait-im-typing`; no `typed` row exists                             |
| the walk runs the starter bank in position order       | `nextReviewCategoryId()` gives `quick`, `chat`, `care`, `body-pain`, `food`, `feelings`, `family`, `health`, `out-and-about`, then `strip`, as each is reviewed; then `null` |
| reviewing a category clears only its own marks         | after `reviewCategory('quick')` every Quick phrase is 1 and every `care` phrase is still 0; the subscriber fired exactly once                                                |
| reviewing a spent or unknown category notifies nothing | `reviewCategory('quick')` twice, then `reviewCategory('typed')` and `reviewCategory('missing')`: the subscriber fired once in all                                            |
| a typed phrase carries no mark                         | after `saveTypedPhrase`, its row has `reviewed === 1`, and it never makes `pending` true once every starter category is reviewed                                             |
| editing a phrase clears only its own mark              | `editPhrase` on one `care` phrase leaves it 1 and its neighbours 0                                                                                                           |
| pending until every category is reviewed               | `{ pending: true, dismissed: false }`; still pending after the nine grid categories; `{ pending: false, dismissed: false }` after `strip`                                    |
| Not now survives a relaunch                            | `dismissStarterReview()`, then a second `createBankStore` on the same `db` and `initialize()`: `{ pending: true, dismissed: true }`; the subscriber fired on the dismissal   |

**`app/test/home-layout.test.ts`**: a new `describe('starter card')`.

| Case                            | Asserts                                         |
| ------------------------------- | ----------------------------------------------- |
| offered on an idle first launch | all false, `reviewPending: true` → `true`       |
| not during Listen mode          | the same with `listening: true` → `false`       |
| not over typing's matches       | the same with `composerOpen: true` → `false`    |
| not over the under-18 note      | the same with `under18: true` → `false`         |
| gone after Not now              | the same with `reviewDismissed: true` → `false` |
| gone once all are reviewed      | the same with `reviewPending: false` → `false`  |

**`app/test/screen-accessibility.test.ts`**: unchanged, and it must still pass.

### 8. Maestro

The reviewer writes these; workers don't touch `app/maestro/`.

**New: `app/maestro/bank-10-starter-review.yaml`**, one flow for the check and
Not now:

1. `clearState` launch; the card's words are visible; screenshot
   `bank-10-card`.
2. Tap `Review`; the Quick editor opens with "Starter" visible; screenshot
   `bank-10-quick-marked`.
3. Leave the editor by its back button, as `bank-4-grid.yaml:163-170` leaves
   Settings (`text: '.*Turn.*'`, `leftOf` the title). **Not `back`**, which is
   Android's, and **not a relaunch**, since killing the app skips the editor's
   cleanup. The card is back, since Chat and the rest remain; screenshot
   `bank-10-card-returns`.
4. Settings, Phrase bank, Quick, as `bank-1-persistence.yaml:10-30` reaches
   Chat: no "Starter" is visible. Screenshot `bank-10-quick-reviewed`. That is
   the check: "review one category, and its marks go".
5. Relaunch without `clearState`; tap the card's `Not now`; the note "Replies
   to your partner appear here." is back and the card's words are gone.
6. Relaunch again: still the note, no card.

**Existing flows the card affects.** Only `consent-not-now.yaml` and
`consent-step.yaml` tap `Not now`, and on a fresh install the card's `Not now`
is on Home behind the permission step, where Maestro still counts it as
visible. Each flow taps the card's `Not now` first, right after launch, when
it is the only one on screen; the rest of the flow is unchanged. `home.yaml`'s
`home-first-view` screenshot now shows the card, as intended. Flows that open a
category editor now mark that category reviewed; none reads the marks, the
card, or the note.

### 9. Tasks

**Task 0, the reviewer's, before the workers start:** this plan, and the four
store functions as stubs in `store.ts` with the signatures in section 3 and
bodies that throw `new Error('Task 1')`, so both tasks typecheck from the
start.

**Task 1, the data.** `app/src/bank/store.ts`,
`app/src/screens/PhraseBankScreen.tsx`, `app/test/bank.test.ts`, and nothing
else.

- [ ] Write the eight `starter review` cases first and see the new ones fail.
- [ ] Replace the four stubs with section 3's bodies.
- [ ] Add the editor's cleanup effect from section 2 below the `commitDeletes`
      effect, with deps `[bank, categoryId]`. Leave lines 210, 234, and
      252-270 as they are.
- [ ] `bun run --cwd app test` and `bun run --cwd app typecheck`.

**Task 2, the card.** `app/src/screens/home-layout.ts`,
`app/src/screens/SecondaryButton.tsx` (new),
`app/src/screens/StarterReviewCard.tsx` (new), `app/src/screens/ReplyRow.tsx`,
`app/src/screens/HomeScreen.tsx`, `app/test/home-layout.test.ts`, and nothing
else.

- [ ] Write the six `starter card` cases first and see them fail.
- [ ] Add `starterCardShown` to `home-layout.ts`.
- [ ] Add `SecondaryButton.tsx` and `StarterReviewCard.tsx` per section 4.
- [ ] In `ReplyRow.tsx`: add
      `starterCard?: { onReview: () => void; onDismiss: () => void } | null`
      to `Props`; draw the card in the else-branch when `empty && starterCard`;
      guard the note with `empty && !starterCard`.
- [ ] In `HomeScreen.tsx`: `const [review, setReview] = useState({ pending: false, dismissed: false })`;
      add `bank.starterReviewState()` to the read at line 204 and `setReview`
      to its `.then`; add `startReview` and `dismissReview` from section 5;
      pass `starterCard` from section 4.
- [ ] `bun run --cwd app test` and `bun run --cwd app typecheck`.

Neither task changes a type another file relies on: `Ready.bank` in
`app/src/turn-context.tsx:34` is `ReturnType<typeof createBankStore>`, so the
store's new functions reach `useTurn()` with no edit, and `ReplyRow`'s new prop
is optional.

### 10. Decisions

1. **The strip is walked, last.** Leaving it out would leave five phrases
   marked for good, and the card would never retire.
2. **Leaving an editor reviews its category, however it was opened.** A
   `review` route parameter set only by the card would serve one edge case.
3. **Installs from before this change get the card,** since their seeded
   phrases already carry `reviewed = 0`. That reaches existing testers; no
   backfill.
4. **Not now is permanent,** as DESIGN says; bringing the card back would need
   a new string.

## Checks

- [ ] Vitest proves the seed's marks, one category's marks going and no
      other's, the walk's order, Not now across a relaunch, one edit clearing
      one mark, and when Home offers the card.
- [ ] `bun run --cwd app test` and `bun run --cwd app typecheck` pass, and
      `app/test/screen-accessibility.test.ts` passes unchanged.
- [ ] Every planted bug in the new rules turns a test red.
- [ ] `bank-10-starter-review` passes in the screenshot job at the default size
      and at AX5, with every other flow, and its screenshots show the card
      inside the row's frame.

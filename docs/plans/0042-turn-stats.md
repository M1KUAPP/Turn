# Stats on this phone implementation plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` when workers are available, or `superpowers:executing-plans`. The stub in `app/src/stats/store.ts` and its wiring land first; Task 1 and Task 2 then touch no file in common.

**Goal:** Count on the phone, for Settings' "Stats on this phone" (SET-4), the partner lines, the replies from the row, the replies from the grid or keyboard, and the median times from a line's end to the row and to speech, as [METRIC-3](/docs/PRD.md#measurement-requirements) sets out. Nothing the module holds reaches a request.

**Architecture:** A pure module, `app/src/stats/store.ts`, holds the counts, the timing samples, and each recent line's end time by its `seq`. The live session records lines and rows; Home records replies with the `seq` of the line each one answers. The store persists one JSON value under the `setting` table's `stats` key, and Settings' new screen reads it with `useSyncExternalStore`.

**Tech stack:** Expo SDK 57, expo-router, expo-sqlite through the bank store's `setting` table, Vitest, Maestro.

**Spec:** Issue #54; [Settings](/docs/PRD.md#settings) SET-4, [Measurement requirements](/docs/PRD.md#measurement-requirements) METRIC-3, the north star in [Success metrics](/docs/PRODUCT.md#success-metrics), and [Stats on this phone](/docs/DESIGN.md#stats-on-this-phone) in DESIGN.

Contents:

1.  [Decisions](#decisions)
1.  [The module](#the-module)
1.  [The hooks](#the-hooks)
1.  [The screen](#the-screen)
1.  [Tests](#tests)
1.  [Maestro](#maestro)
1.  [Tasks](#tasks)
1.  [Checks](#checks)

## Decisions

- **The north star.** `PRODUCT.md:288-290`: replies from the row, out of all partner lines the user answers. The screen shows both reply counts, so the share is `fromRow / (fromRow + fromGrid)`.
- **What counts as a reply.** Only in Listen mode (`listening.active`), and only when there's a line to answer (`seq > 0`):
  - From the row: a tap on a row slot or the big button while the composer isn't matching typed words.
  - From the grid or keyboard: a tap on a grid phrase, on a phrase the composer matched (the row's slots while `composerMode === 'speak'`), or the composer's Speak.
  - Neither: the strip, whose phrases manage the conversation rather than answer it, and Repeat, which says again a reply already counted.
- **Which line a reply answers.** A reply from the row answers the line the row answers, `row.answers` of the snapshot the user touched (`shownListening`), so a held row's reply is timed from the older line, as the caption's "Still answering" says. A reply from the grid or keyboard answers the newest line, `listening.row.seq`.
- **Times.** The store keeps each line's `endedAt` by `seq`, for the newest 16 lines. A `row` event for a known `seq` adds `now() - endedAt` to the time-to-row samples, once per `seq`; a `reply` for a known `seq` adds it to the time-to-speech samples. A sample below 0 or above 60,000 ms is dropped. Each list keeps its newest 200 samples, and a median is the lower middle sample, so the value shown is one that was measured.
- **The clock.** `line.endedAt` and the typed path's `endedAt` come from the session's `now`, which `TurnProvider` sets to `Date.now`, the store's `now`.
- **Persistence.** One JSON value, `{ lines, fromRow, fromGrid, toRow, toSpeech }`, under the `setting` key `stats`, written after every change through a promise chain, so writes land in order and a failed write is dropped. The line-end map stays in memory. `load()` treats a missing or unreadable value as zeroes. No schema change.
- **Nothing on the speaking path waits.** `record` updates memory, notifies, and queues the write without awaiting it.
- **Staying on the phone.** The module imports nothing. It isn't in `shared/`, which the Worker also builds against, and neither request builder, `app/src/relay/line.ts` or `app/src/listen/relay-ranker.ts`, can reach it.
- **Erase all data (#60) clears it,** through `stats.reset()`, since erasing the `setting` table alone would leave the store's memory to write the old counts back.

## The module

Landed as a stub with the final types:

```ts
export type ReplySource = 'row' | 'grid'
export type StatsEvent =
  | { type: 'line'; seq: number; endedAt: number }
  | { type: 'row'; seq: number }
  | { type: 'reply'; from: ReplySource; seq: number }
export type StatsSnapshot = {
  lines: number
  fromRow: number
  fromGrid: number
  toRowMs: number | null
  toSpeechMs: number | null
}
export type StatsStore = {
  record(event: StatsEvent): void
  reset(): Promise<void>
  load(): Promise<void>
  getSnapshot(): StatsSnapshot
  subscribe(listener: () => void): () => void
}
export const STATS_KEY = 'stats'
export const MAX_SAMPLES = 200
export const MAX_SAMPLE_MS = 60_000
export const emptyStats: StatsSnapshot
export function medianMs(samples: readonly number[]): number | null
export function formatSeconds(ms: number | null): string
export function createStatsStore(options: {
  now: () => number
  setting(key: string): Promise<string | null>
  setSetting(key: string, value: string | null): Promise<void>
}): StatsStore
```

- `record` of a `line` with `seq <= 0` or a repeated `seq`, and of a `reply` with `seq <= 0`, changes nothing. A `reply` for a `seq` the map no longer holds still counts, with no time sample.
- `getSnapshot` returns the same object until something changes, as `useSyncExternalStore` needs.
- `reset()` zeroes the counts, empties both sample lists and the line map, notifies, and writes `stats` as zeroes.
- `formatSeconds(null)` is "None yet"; otherwise the seconds with one decimal, as "0.8 s" or "12.0 s".

## The hooks

- `app/src/turn-context.tsx` (landed with the stub): builds the store before the typed session, awaits `load()`, passes it to `createLiveListenSession`, and adds `stats` to `Ready`.
- `app/src/listen/live-session.ts`, `stats?: Pick<StatsStore, 'record'> | null` in the options (landed with the stub). In `rankLine` and in the typed path's `send`, right after calling `typed.send(...)` and before awaiting it, read the line's `seq` from `typedState.row.seq`, which `typed.send` publishes synchronously, and record `line` with it and the line's `endedAt`. After the await, when the existing guard passes and `typedState.row.answers === seq`, record `row` for it.
- `app/src/screens/HomeScreen.tsx`: in the `ReplyRow`'s `onSpeak`, the grid's `renderPhrase`, and `speakDraft`, record `reply` by the rules above before speaking. `renderStripPhrase` and Repeat record nothing.

## The screen

- **Route:** `app/src/app/settings/stats.tsx`, a one-line re-export of `app/src/screens/StatsScreen.tsx`, like `settings/privacy.tsx`, and `<Stack.Screen name="settings/stats" options={{ title: 'Stats on this phone' }} />` in `app/src/app/_layout.tsx` beside the other settings routes.
- **Reached from** Settings' existing "Stats on this phone" row, which gains `open: () => router.push('/settings/stats')`.
- **Layout and words:** DESIGN's "Stats on this phone": Settings' grouped rows, labels, values, the note, and "Reset stats" with its alert.

## Tests

- `app/test/stats-store.test.ts` (new): counts; a repeated or zero `seq`; the time samples, from the right `endedAt`; a `row` counted once per `seq`; the 16-line map; the 200-sample cap dropping the oldest; samples below 0 or above 60,000 ms dropped; `medianMs` of `[]`, one, odd, and even lists (lower middle); `formatSeconds`; a stable snapshot; listeners; `load()` of nothing, of a saved value, and of unreadable JSON; the write after a change; `reset()`; and the SET-4 check, "after five lines, the counts match": five lines, two replies from the row, three from the grid, then 5, 2, and 3. Also that `store.ts` imports nothing.
- `app/test/stats-hooks.test.ts` (new), with the fixtures of `live-session.test.ts`: `rankLine` and the typed `send` record `line` with the line's `seq` and `endedAt`, and `row` when the row answers it; a held row records no `row`; `stats: null` and no `stats` record nothing.
- `app/test/stats-privacy.test.ts` (new): neither `app/src/relay/line.ts` nor `app/src/listen/relay-ranker.ts` mentions `stats`.
- `app/test/stats-screen.test.ts` (new) only if the repo already renders screens in Vitest; otherwise the Maestro flow covers the screen.

## Maestro

- `app/maestro/stats.yaml` (new): from a fresh install, start Listen mode as `listen.yaml` does, send one typed partner line, tap a row reply, tap a grid phrase, end Listen mode, open Settings, then "Stats on this phone", and assert "Partner lines" 1, "Replies from the row" 1, and "Replies from the grid or keyboard" 1. Screenshot, then "Reset stats", confirm "Reset", assert the zeroes and "None yet", and screenshot again. It passes at the default size and at AX5.
- `app/maestro/settings.yaml`: only if a step it takes changes.

## Tasks

**Task 1, the module and its hooks.** Files: `app/src/stats/store.ts`, `app/src/listen/live-session.ts`, `app/test/stats-store.test.ts`, `app/test/stats-hooks.test.ts`, `app/test/stats-privacy.test.ts`.

**Task 2, the screen and the replies.** Files: `app/src/screens/StatsScreen.tsx`, `app/src/app/settings/stats.tsx`, `app/src/app/_layout.tsx`, `app/src/screens/SettingsScreen.tsx`, `app/src/screens/HomeScreen.tsx`, `app/maestro/stats.yaml`, and `app/maestro/settings.yaml` if needed.

## Checks

- [ ] Vitest: "after five lines, the counts match", the times, Reset, and the privacy checks.
- [ ] CI `pr` run: every flow passes at the default size and AX5, with `stats.yaml`.
- [ ] On an iPhone, a spoken line raises "Partner lines" and both times.
- [ ] A traffic capture of one iPhone session shows only `GET /v1/config` and `POST /v1/lines`, with the bodies in `shared/src/relay.ts`.

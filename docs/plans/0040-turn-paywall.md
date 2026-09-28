# Turn Listen paywall and purchases implementation plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` when
> workers are available, or `superpowers:executing-plans`. Tests come first,
> and no test imports RevenueCat's SDK: every test builds the port by hand.

**Goal:** Sell Turn Listen through RevenueCat's paywall once the 20 free
partner lines are used up, restore under Test Store, and check a Test Store
purchase in the Simulator build, as #53 and #59 ask.

**Architecture:** `app/src/purchases/engine.ts` is the port, in the shape of
`app/src/listen/engine.ts`: the few RevenueCat calls Turn makes, and the
store's types. `revenuecat-engine.ts` is the only file that imports
`react-native-purchases` or `react-native-purchases-ui`, and it holds no
state. `store.ts` holds the state: the relay's free lines, RevenueCat's
`listen`, the Locked rule, the refresh flag, and the last note. Home,
Settings, and the relay path read the store.

**Tech stack:** Expo SDK 57, React Native, `react-native-purchases` and
`react-native-purchases-ui` 10.10.1 (the TRD's pin), Vitest, Maestro 2.10.0.

**Spec:** #53 and #59; the PRD's
[paywall and purchases](/docs/PRD.md#the-paywall-and-purchases) (PAY-1 to
PAY-10), STATE-4, SPEAK-5, SET-1, PRIV-4, and METRIC-4; the TRD's
[purchases and entitlements](/docs/TRD.md#purchases-and-entitlements); the
design's [Listen control](/docs/DESIGN.md#the-listen-control),
[Settings](/docs/DESIGN.md#settings),
[the paywall](/docs/DESIGN.md#the-paywall), the home screen's states, and
[the strings the PRD leaves open](/docs/DESIGN.md#strings-the-prd-leaves-open).

## Existing behavior and decisions

- **The paywall is published.** #26 built it in RevenueCat's editor and
  attached it to the offering `default`, whose one package, `$rc_lifetime`,
  sells the $24.99 non-consumable `turn_listen` for the entitlement `listen`.
  DESIGN names its words: "Keep Listen mode on", "Turn Listen is one
  payment. Speaking stays free.", and "Unlock Listen mode".
- **Every build is a Debug build.** A Release build with a Test Store key
  crashes, and 10.10.1 has no way around it.
- **The key and the ID exist.** `app/app.config.ts` passes the committed
  Test Store key as `extra.revenueCatTestStoreKey`. `app/src/relay/config.ts`
  keeps the Keychain UUID under `turn-user-id` and sends it as `X-Turn-User`;
  the same ID becomes RevenueCat's `appUserID`, so the free lines and the
  purchase share it (PAY-10). The SDK isn't a dependency yet.
- **The relay already counts.** `GET /v1/config` and every answered line carry
  `freeLinesLeft`, `null` once entitled; past the free lines without `listen`
  it answers `402 { "error": "paywall" }`; a line with `refresh: true` skips a
  cached no (#30). Nothing in the app reads the count or sets `refresh`, and
  `fitRequest` keeps any `refresh` it's given.
- **A 402 is a failure today.** `relay-ranker.ts` marks the relay
  `unreachable` on any error, and `typed-session.ts` counts the failure and
  ranks the line on the phone. STATE-4 wants the paywall instead of ranking,
  and DESIGN's "Free lines used up" state leaves the row empty.
- **Closing the paywall** turns Listen mode off and leaves everything else as
  it was (PAY-2). A purchase unlocks Listen mode at once (PAY-4), so after a
  purchase Listen mode carries on, or starts if the user was turning it on.
- **Failures stay quiet.** DESIGN's tone gives each outcome one note, with no
  alert and no alarm color. The note goes in the caption on Home and under
  the Turn Listen section in Settings, and the Locked control, or Settings'
  Unlock row, is the retry.
- **`presentPaywallIfNeeded` checks the entitlement itself** and resolves
  `NOT_PRESENTED` when `listen` is active, so a Locked control shown before
  RevenueCat answers is never a dead end.

## The port

`app/src/purchases/engine.ts`, types only, landed first on the branch so
both workers build against it:

```ts
/** RevenueCat's SDK behind one surface (#53); see docs/plans/0040-turn-paywall.md. */
export const listenEntitlement = 'listen'

/** RevenueCatUI's PAYWALL_RESULT, by value. */
export type PaywallResult = 'NOT_PRESENTED' | 'ERROR' | 'CANCELLED' | 'PURCHASED' | 'RESTORED'

/** The calls Turn makes. None rejects: a thrown SDK error becomes false, null, or 'ERROR'. */
export type PurchasesEngine = {
  /** Purchases.configure with the Test Store key and the app user ID, once; false if it threw. */
  configure(input: { apiKey: string; appUserID: string }): Promise<boolean>
  /** Whether `listen` is active in getCustomerInfo(); null when RevenueCat can't say. */
  listenActive(): Promise<boolean | null>
  /** Calls back with `listen`'s state on each customer info update; returns the unsubscribe. */
  onListenChange(listener: (active: boolean) => void): () => void
  /** restorePurchases(), then `listen`'s state; null when it threw. */
  restore(): Promise<boolean | null>
  /** presentPaywallIfNeeded for `listen`; 'ERROR' when it threw. */
  presentPaywall(): Promise<PaywallResult>
}

/** Where the paywall opened from, which decides what closing it does. */
export type PaywallDoor = 'line' | 'control' | 'settings'

export type PurchasesSnapshot = {
  /** The relay's count; null once entitled, or while the Simulator switch skips the count. */
  freeLinesLeft: number | null
  /** RevenueCat's `listen`; null until it answers. */
  listen: boolean | null
  /** No free lines left and `listen` not known to be active (PAY-1, PAY-2). */
  locked: boolean
  /** "20 free", under "Listen", while there's a count and no `listen`; else null (PAY-1). */
  countLabel: string | null
  /** The paywall is open or a restore is running. */
  busy: boolean
  /** The last purchase or restore's note, in DESIGN's words; null when there's none. */
  note: string | null
}

export type PurchasesStore = {
  /** Configures RevenueCat, reads `listen`, and follows it; never rejects, and nothing waits on it (SPEAK-5). */
  start(input: { apiKey: string; appUserID: string }): Promise<void>
  snapshot(): PurchasesSnapshot
  subscribe(listener: () => void): () => void
  /** Opens the paywall unless it's open or busy, and says what Listen mode is now. */
  openPaywall(door: PaywallDoor): Promise<'unlocked' | 'locked'>
  restore(): Promise<void>
  /** Whether the next line carries `refresh` (PAY-4). */
  refreshNext(): boolean
  /** A line that carried `refresh` was answered, so the flag clears. */
  refreshAnswered(): void
  clearNote(): void
  dispose(): void
}
```

`revenuecat-engine.ts` implements `PurchasesEngine` with these calls, each
checked against the 10.10.1 typings:

| Call                                                                               | Typing                                                          |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `Purchases.isConfigured()`, `Purchases.configure({ apiKey, appUserID })`           | `react-native-purchases/dist/purchases.d.ts:1062`, `:290`       |
| `Purchases.getCustomerInfo()`                                                      | `purchases.d.ts:519`                                            |
| `Purchases.addCustomerInfoUpdateListener()`, `removeCustomerInfoUpdateListener()`  | `purchases.d.ts:313`, `:319`                                    |
| `Purchases.restorePurchases()`                                                     | `purchases.d.ts:466`                                            |
| `RevenueCatUI.presentPaywallIfNeeded({ requiredEntitlementIdentifier: 'listen' })` | `react-native-purchases-ui/lib/typescript/src/index.d.ts:331`   |
| `PAYWALL_RESULT`                                                                   | `@revenuecat/purchases-typescript-internal/dist/enums.d.ts:158` |

`listen` is `customerInfo.entitlements.active[listenEntitlement] !== undefined`.
The adapter never calls `setAttributes` or any other attribute setter
(PRIV-4).

## The store

`app/src/purchases/store.ts` exports
`createPurchasesStore({ engine, config })`, where `config` is the relay
config client's `snapshot()` and `subscribe()`:

- **The count** is `config.snapshot().freeLinesLeft`, which the relay path
  keeps current (below).
- **`start()`** configures the engine, then sets `listen` from
  `engine.listenActive()` and follows `onListenChange`; if `configure`
  returns false, `listen` stays null. `listen` starts null.
- **Locked** is `freeLinesLeft === 0 && listen !== true`.
- **`countLabel`** is `` `${freeLinesLeft} free` `` when `freeLinesLeft` is
  at least 1 and `listen !== true`, else null. At 0 the control shows
  "Unlock" instead (DESIGN).
- **The refresh flag** turns on when `listen` becomes true after being false
  or null, and after an `unlocked` result or restore; `refreshAnswered()`
  clears it. A line that fails keeps it.
- **`openPaywall(door)`,** while not busy: busy, `engine.presentPaywall()`,
  not busy. `PURCHASED`, `RESTORED`, and `NOT_PRESENTED` set `listen` true,
  the refresh flag, and the note "Listen mode is unlocked.", and resolve
  `unlocked`. `CANCELLED` and `ERROR` set the note "The purchase didn't go
  through. Listen mode is still locked." and resolve `locked`. While busy it
  resolves at once, `unlocked` if `listen` is true, else `locked`, and opens
  nothing.
- **`restore()`:** `true` gives "Listen mode is unlocked." with `listen` and
  the refresh flag set; `false` gives "No purchase found for this phone.
  Listen mode is still locked."; `null` gives "Turn couldn't check for a
  purchase. Listen mode hasn't changed.", the one string DESIGN lacks, which
  this change adds to its table.
- **`clearNote()`** runs when Listen mode starts, and when the user opens the
  paywall or restores again.

## What each door does

| Door                                        | Unlocked                                                           | Locked                                         |
| ------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------- |
| `line`: the relay answered `paywall`        | Listen mode carries on; the next line carries `refresh`            | Listen mode ends, which clears the row (PAY-2) |
| `control`: the Locked control was tapped    | Listen mode starts, through `consent.startListen()` as a tap would | Nothing else; the control stays Locked         |
| `settings`: "Unlock Listen mode" was tapped | The row reads "Unlocked"                                           | Nothing else                                   |

The note shows in every case. A `paywall` answer that arrives while the
paywall is open changes nothing.

## The relay path

- **`relay/config.ts`** gains `freeLines(count: number | null)`, which sets
  the cached config's `freeLinesLeft`, saves it as `read()` does, and
  notifies, and `userId()`, the existing `getUserId`, so the app configures
  RevenueCat with the same ID.
- **`relay-ranker.ts`** takes an optional `purchases` port
  (`refreshNext`, `refreshAnswered`):
  - It adds `refresh: true` to the request when `refreshNext()` is true.
  - After an answer, it calls `config.freeLines(answer.freeLinesLeft)`, then
    `refreshAnswered()` if the request carried `refresh`.
  - On `RelayLineError(402, 'paywall')` it reports the relay `working`, not
    `unreachable`, calls `config.freeLines(0)`, and rethrows.
- **`typed-session.ts`**, in `send`'s catch: a `paywall` code calls the
  remote's new optional `onPaywall()`, empties the row, counts no failure,
  leaves `degraded` alone, and returns without ranking on the phone. Other
  errors go on as today.

## The screens

- **`listen-control.ts`** takes `locked`. Off and locked is `lock`, "Listen",
  and "Unlock", whose tap opens the paywall; Listening, Paused, and Mic off
  never show a lock. Off shows `countLabel` under "Listen" in `subheadline`
  with tabular figures. The control's accessibility label stays "Listen",
  with "Unlock" or the count as its value, so "Tap Listen" and the flows'
  `tapOn: Listen` keep working.
- **`HomeScreen.tsx`:** the Locked control calls `openPaywall('control')`,
  then `consent.startListen()` on `unlocked`. The caption shows the store's
  note, as it shows the other notes.
- **`SettingsScreen.tsx`:** the Turn Listen section's first row is "Unlock
  Listen mode", which calls `openPaywall('settings')`, or "Unlocked" once
  `listen` is true; the second is Restore Purchases. Both are disabled while
  busy, and the note sits under the section.
- **`turn-context.tsx`** builds the engine and the store after `config.read()`,
  configures RevenueCat with `void` and never awaits it (SPEAK-5), gives the
  ranker the store and the typed session an `onPaywall` that runs
  `openPaywall('line')` and ends Listen mode on `locked`, and puts
  `purchases` on `Ready`.

## Tests

| File                                      | Tests                                                                                                                                                                                                                          |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `app/test/purchases-store.test.ts` (new)  | Locked at 0 with `listen` false and with it null, never with it true; `countLabel` at 20, 1, 0, and null; each `PaywallResult`'s resolution and note; busy opens once; restore's three notes; the refresh flag's set and clear |
| `app/test/purchases-engine.test.ts` (new) | No `setAttributes`, `setEmail`, `setDisplayName`, or `setPhoneNumber` in `app/src` (PRIV-4); both packages pinned at 10.10.1                                                                                                   |
| `app/test/relay-ranker.test.ts`           | `refresh: true` only while the port says so, cleared only by an answer; a 402 rethrows `paywall`, reports `working`, and sets the count to 0; an answer's count reaches `freeLines`                                            |
| `app/test/typed-listen.test.ts`           | A `paywall` error calls `onPaywall`, empties the row, ranks nothing, and leaves `degraded` false; `jev_unavailable` still degrades on the second failure                                                                       |
| `app/test/relay-config.test.ts`           | `freeLines` updates, saves, and notifies; `userId()` returns the Keychain ID                                                                                                                                                   |
| `app/test/listen-control.test.ts`         | Locked's word, symbol, value, and action; no lock once Listen mode is on; the count under Off                                                                                                                                  |

## The Simulator checks (#59)

Two flows in `app/maestro/`, which `scripts/simulator-screenshots.sh` runs
at the default size and at AX5:

- **`paywall-buy.yaml`** (PAY-4, PAY-6): `clearKeychain`, then
  `launchApp: { clearState: true }`, so the ID is new and owns nothing;
  Settings; "Unlock Listen mode"; wait for "Keep Listen mode on" and take a
  screenshot; tap the paywall's "Unlock Listen mode"; wait for "Test Store
  Purchase", screenshot, and tap "Test valid purchase"; wait for "Unlocked";
  tap Restore Purchases and wait for "Listen mode is unlocked.".
- **`paywall-failed.yaml`** (PAY-5): the same to the alert, then "Test failed
  purchase", RevenueCat's own error if it shows one, and the paywall's close
  button; wait for "The purchase didn't go through. Listen mode is still
  locked." and "Unlock Listen mode".

Settings' row and the paywall's button share the words "Unlock Listen mode".
If RevenueCat's sheet leaves Settings in Maestro's hierarchy, the paywall's
button is the later match, `index: 1`. The first run is a discovery run: its
screenshots and each failed step's hierarchy settle that, the close
button's name, and whether Test Store's alert reaches Maestro at all, before
the flows are narrowed. The AX5 screenshots are #26's last check. If Test
Store can't buy in the Simulator, the purchase checks move to #128 as #59
says, and the pull request setting `SIMULATOR_UNLIMITED` to `"true"` goes to
whoever holds the relay's Cloudflare account.

## METRIC-4

RevenueCat's REST API v2 shows the purchase:
`GET /v2/projects/proj9f033172/customers/{id}/active_entitlements` lists
`entl6b65cc982a` with `expires_at: null`
([RevenueCat notes](/docs/research/0009-revenuecat-expo.md#rest-api-v2-customer-and-active-entitlements)).
It needs a secret key with `customer_information:customers:read`, which only
a teammate with the dashboard can make; the relay's own key can't be read
back from Cloudflare. The flow's customer ID is found by listing the
project's customers after the run.

## Tasks

- **Task 0, the reviewer:** land `engine.ts` above, then `bun add
react-native-purchases@10.10.1 react-native-purchases-ui@10.10.1` in `app/`.
- **Task 1, worker A:** `app/src/purchases/revenuecat-engine.ts`,
  `app/src/purchases/store.ts`, `app/test/purchases-store.test.ts`, and
  `app/test/purchases-engine.test.ts`.
- **Task 2, worker B:** `app/src/relay/config.ts`,
  `app/src/listen/relay-ranker.ts`, `app/src/listen/typed-session.ts`,
  `app/test/relay-config.test.ts`, `app/test/relay-ranker.test.ts`, and
  `app/test/typed-listen.test.ts`.
- **Task 3, the reviewer, after both:** `turn-context.tsx`, the screens,
  `app/test/listen-control.test.ts`, DESIGN's new string, and the two flows;
  then the discovery run, the narrowed flows, and a full screenshot run.
- **Task 4, the reviewer:** METRIC-4, and the records on #53, #59, and #26.

Each task ends with `bun run --cwd app test` and `bun run --cwd app
typecheck` passing, and every rule mutation-tested by the reviewer.

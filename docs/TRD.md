# Turn technical requirements

How the first version of Turn is built to meet the
[product requirements](/docs/PRD.md): the architecture, the versions, the
data, the relay's API, how a partner line becomes a row of replies, listening
and speaking on the phone, purchases, the app, security and privacy,
reliability, the evaluation, tests, and release. It's written on September
22, 2026, before the code, as the contract the code is built to, and it
changes with the code. The [product](/docs/PRODUCT.md) says why, the
[idea](/docs/IDEA.md) owns the schedule and the risks, and the research notes
on [Turn's iPhone build][ios-notes], [its relay and services][svc-notes],
[evaluating reply ranking][eval-notes], [Jev][jev-notes], and
[Cloudflare Workers][cf-notes] hold the sources.

Contents:

1.  [Overview](#overview)
1.  [System architecture](#system-architecture)
1.  [Stack and repository](#stack-and-repository)
1.  [Data model](#data-model)
1.  [Relay API](#relay-api)
1.  [See also](#see-also)

## Overview

- **Scope:** the first version, for iPhone, as the PRD defines it. PRD IDs in
  parentheses mark where this document meets a requirement, and the
  [traceability table](#requirements-traceability) maps every ID.
- **Decisions that shape the build:**
  - An Expo app in TypeScript, with two small local Swift modules, RevenueCat's
    SDK and Paywalls, and no accounts: a random ID, kept in the Keychain and
    given to RevenueCat as the app user ID, is the only ID.
  - The phrase bank lives in SQLite on the phone. The phone tags names, picks
    the shortlist, and turns Jev's probabilities into the row, so the relay
    never holds the bank, and the row's rules can be tested without a
    network.
  - One Cloudflare Worker, the relay, is the only backend. A Durable Object
    for each user counts free lines, caches the entitlement, and is the only
    caller of Jev in the app's path.
  - Jev, pinned to `jev-1.13.0`, answers 42 questions for each partner line
    in one request, within 2.5 seconds and at most one quick retry, since a
    late answer is stale.
  - No audio or transcript is stored anywhere, and the relay logs no text.
  - No analytics SDK: the relay's logs and the evaluation give the numbers.
- **Changing it:** anything here that turns out wrong is fixed here, in the
  same change as the code.

## System architecture

```text
+-------------------------------+   HTTPS    +-------------------------------+
| iPhone app (Expo, TypeScript) |----------->| Worker: turn-relay            |
| grid, row rules, bank (SQLite)|  /v1/lines | validate, rate-limit, config  |
| turn-listen: SpeechTranscriber|<-----------| /v1/config                    |
|   and name tagging            |            +---------------+---------------+
| turn-voice: Personal Voice    |                            | one object per user,
| expo-speech, RevenueCat SDK   |                            | in western North America
+---------------+---------------+            +---------------v---------------+     +-----------+
                |                            | Durable Object user-<hash>    |---->| Jev       |
                | purchases, paywall         | free lines, entitlement cache |     | (TypeSafe)|
                v                            +---------------+---------------+     +-----------+
+-------------------------------+                            |
| RevenueCat (Test Store,       |<---------------------------+
| Paywalls, entitlements)       |   REST API v2: active entitlements
+-------------------------------+
```

What each part owns:

- **The app** speaks, keeps the phrase bank, the places, and the settings,
  shows the consent flow, listens through `turn-listen`, tags names, picks
  the shortlist, applies the row's rules, and sells Turn Listen through
  RevenueCat. It talks only to the relay, and to RevenueCat through the SDK.
- **`turn-listen`,** a local Swift module, runs live transcription, decides
  when a partner line ends, pauses while Turn speaks, and swaps names for
  tags with Apple's NaturalLanguage framework.
- **`turn-voice`,** a local Swift module, asks for Personal Voice and lists
  the voices `expo-speech` can use.
- **The relay** is the only public API, at its `workers.dev` address, and
  runs with `"placement": { "region": "aws:us-west-2" }`, next to Jev. It
  checks headers and lengths, applies the rate limits, serves the
  configuration, and passes each line to the user's Durable Object.
- **The user's Durable Object** counts free lines, keeps the `listen`
  entitlement it has confirmed, builds the Jev request, and calls Jev. It's
  created with `locationHint: "wnam"`, so a line crosses an ocean at most
  once, from the phone to the relay ([services notes][svc-placement]).
- **Jev** answers the kind of question, the topic, and one Noul per
  candidate.
- **RevenueCat** runs the Test Store purchase, the paywall, and the
  entitlement.
- **The evaluation** in `eval/` calls Jev and Workers AI directly with the
  team's keys; it isn't part of the app's path.

The path of one partner line:

1.  `turn-listen` reports a finished line, or the user sends a typed one. The
    app gives it the next sequence number and cancels any request in flight.
2.  The app tags names in the line and the shortlist, picks the 40
    candidates, and sends `POST /v1/lines`.
3.  The relay checks the request, applies the user's limit, and passes it to
    `user-<hash>`.
4.  The object claims a free line or, past them, checks the entitlement; it
    answers `402` if neither allows the line. Otherwise it calls Jev, within
    2.5 seconds.
5.  If Jev fails, the object releases the claim; otherwise it returns the
    probabilities, the policy, and the free lines left.
6.  The app drops the answer if a newer line exists, applies the
    [row's rules](#from-probabilities-to-the-row), and renders the row.
7.  The user taps a reply; `expo-speech` speaks it while listening pauses.

[svc-placement]: /docs/research/turn-services.md#placement-near-typesafe-and-revenuecat

## Stack and repository

### Versions on September 22, 2026

| Part                            | Version                | Notes                                                                    |
| ------------------------------- | ---------------------- | ------------------------------------------------------------------------ |
| Expo SDK                        | 57.0.23 or later       | `ios.enableSceneSupport` on for the iOS 27 SDK ([Expo notes][tech-expo]) |
| React Native                    | 0.86.3                 | pinned by the SDK's template ([RevenueCat notes][rc-expo])               |
| Xcode and iOS SDK               | Xcode 27, iOS 27 SDK   | on macOS Tahoe 26.6 or later                                             |
| iOS deployment target           | 26                     | `SpeechTranscriber`'s first release (COMPAT-1)                           |
| `react-native-purchases`, `-ui` | 10.10.1                | Test Store and Paywalls, on purchases-ios 5.90.1                         |
| `expo-secure-store`             | 57.0.4                 | the user's ID in the Keychain                                            |
| `expo-speech`                   | 57.0.3                 | speech with a chosen voice                                               |
| `expo-speech-recognition`       | 57.1.0                 | the last fallback recognizer                                             |
| `expo-sqlite`                   | 57.0.3                 | the phrase bank                                                          |
| `minisearch`                    | 7.2.0                  | BM25+ keyword ranking in the shared code                                 |
| `create-expo-module`            | 57.0.1                 | scaffolds the two local modules                                          |
| `@typesafe-ai/sdk`              | 0.6.0                  | in the relay and the evaluation; runs under workerd                      |
| Jev                             | `jev-1.13.0`           | the only model on September 22, 2026                                     |
| Wrangler                        | 4.136.2                | needs Node.js 22 or later; `compatibility_date` `2026-09-22`             |
| `@cloudflare/vitest-plugin`     | 1.2.1, with Vitest 4.1 | the relay's tests ([Cloudflare notes][cf-notes])                         |
| `@revenuecat/cli`               | 0.1.3                  | headless Test Store purchases for the relay's tests                      |

The iPhone build notes have the [libraries' dates and licenses][ios-libs];
all of them are MIT.

[tech-expo]: /docs/research/next-gen-tech.md#expo-sdk-57-sdk-58-and-xcode-27
[rc-expo]: /docs/research/revenuecat-expo.md#expo-sdk-react-native-and-minimum-ios
[ios-libs]: /docs/research/turn-ios.md#libraries-on-september-22-2026

### Repository layout

The code lives in this repository, as Bun workspaces, next to `docs/`:

```text
/
├── app/                  # the Expo project; routes in app/src/app/
├── modules/
│   ├── turn-listen/      # SpeechTranscriber, line ends, name tagging
│   └── turn-voice/       # Personal Voice authorization
├── worker/               # the relay: Worker, Durable Object, tests
├── eval/                 # partner lines, split, rankers, results
├── docs/
├── LICENSE               # MIT, detected by GitHub
└── README.md
```

- **Local modules.** `npx create-expo-module@latest --local` scaffolds each
  module, and autolinking finds modules in the directory named by
  `nativeModulesDir`, which "defaults to `./modules/`" of the Expo project;
  since the project is `app/`, its autolinking configuration sets
  `nativeModulesDir` to `../modules`. Local modules generate no barrel file,
  so the app imports from each module's `src` files
  ([iPhone build notes][ios-modules]).
- **Shared code.** The shortlist, the row's rules, and the Jev request
  builder live in small TypeScript files that the app, the relay, and the
  evaluation import, so the evaluation measures the code the app runs.
- **The starter bank** lives in `app/src/content/starter-bank.json`, which the
  app loads on first launch and the evaluation reads (CONTENT-1).

[ios-modules]: /docs/research/turn-ios.md#two-local-swift-modules-in-expo

## Data model

### The phone's database

`expo-sqlite` holds everything the phone keeps (BANK-8):

```sql
CREATE TABLE category (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 40),
  position INTEGER NOT NULL,
  fixed INTEGER NOT NULL DEFAULT 0          -- 1 for Quick, which stays first
);
CREATE TABLE phrase (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES category (id),
  text TEXT NOT NULL CHECK (length(text) BETWEEN 1 AND 200),
  position INTEGER NOT NULL,
  fixed INTEGER NOT NULL DEFAULT 0,         -- 1 for Yes, No, and Not sure
  reviewed INTEGER NOT NULL DEFAULT 1,      -- 0 for starter phrases not yet reviewed
  created_at INTEGER NOT NULL
);
CREATE TABLE place (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 40),
  position INTEGER NOT NULL
);
CREATE TABLE phrase_place (
  phrase_id TEXT NOT NULL REFERENCES phrase (id) ON DELETE CASCADE,
  place_id TEXT NOT NULL REFERENCES place (id) ON DELETE CASCADE,
  PRIMARY KEY (phrase_id, place_id)
);
CREATE TABLE tap (
  phrase_id TEXT NOT NULL REFERENCES phrase (id) ON DELETE CASCADE,
  day INTEGER NOT NULL,                     -- days since 1970-01-01, local
  count INTEGER NOT NULL,
  PRIMARY KEY (phrase_id, day)
);
CREATE TABLE setting (key TEXT PRIMARY KEY, value TEXT NOT NULL);
```

- **Counts by day** let the shortlist take the most-tapped replies of the
  last 30 days (BANK-6), and older rows are deleted on launch.
- **The conversation strip's** five phrases live in their own fixed
  category, which the grid doesn't show and the shortlist never uses
  (SPEAK-7); their text can change, their positions can't.
- **Starter phrases** carry a `reviewed` flag, set when the user keeps,
  edits, or reviews them (BANK-10).
- **Settings** hold the voice and its rate, the place, the user's permission
  and its date, the under-18 switch, the cached configuration, and the stats
  of METRIC-3.
- **Limits** match the PRD: phrases of 200 characters (BANK-3), and places
  of 40, at most 12 (PLACE-1); the app enforces the counts.

### The relay's storage

Each user's Durable Object, backed by SQLite, keeps two small tables and
nothing else:

```sql
CREATE TABLE free_lines (line_id TEXT PRIMARY KEY, at INTEGER NOT NULL);
CREATE TABLE entitlement (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  active INTEGER NOT NULL,                  -- 1 once RevenueCat confirms listen
  checked_at INTEGER NOT NULL,
  refreshed_at INTEGER                      -- the last purchase that skipped a cached no
);
```

- **Claiming a free line.** Inside `transactionSync()`, a line ID already in
  `free_lines` is a repeat and costs nothing, a new ID below 20 rows is
  inserted as a free line, and at 20 rows the line needs the entitlement. In
  the services notes' local test, this counted exactly 20 of 25 simultaneous
  lines for one device, and ten copies of one line once
  ([services notes][svc-count]). If Jev fails, the object deletes the row,
  so only answered lines count (PAY-1).
- **The entitlement row** caches RevenueCat's answer: a yes for 24 hours,
  since `listen` is a one-time purchase, and a no for 1 minute.
- **The name.** The Worker reaches the object with `getByName()` on the
  SHA-256 of the app user ID and a secret salt, with `locationHint: "wnam"`,
  so a stored record can't be traced back to an ID without the salt.
- **The Free plan's budget.** Each new free line writes 2 rows, so the Free
  plan's 100,000 rows a day cover about 2,500 devices spending all 20 lines
  in one day.

[svc-count]: /docs/research/turn-services.md#counting-free-partner-lines-per-device

### What is never stored

- **Audio** exists only in `turn-listen`'s buffers while they're
  transcribed (PRIV-1).
- **Partner lines, candidates, and Jev's answers** live in memory: the
  caption for at most two minutes (LISTEN-8), the row until it changes, and
  the relay's copy only for the length of a request (PRIV-2).
- **The tag map,** which pairs each tag with its name, lives in memory for
  one request and never leaves the phone.

## Relay API

The relay's base URL comes from the app's configuration, and every request
carries these headers:

| Header           | Value                                      |
| ---------------- | ------------------------------------------ |
| `X-Turn-User`    | the app user ID: a random UUID, version 4  |
| `X-Turn-Version` | the app's version                          |
| `X-Turn-Build`   | `device` or `simulator`, set at build time |
| `Content-Type`   | `application/json`, for `POST`             |

`GET /v1/config` returns what the app caches at launch: whether Jev is on,
whether the texts name TypeSafe (CONSENT-7), the number of free lines, and
the current policy.

```ts
type Config = {
  jevOn: boolean
  typesafeNamed: boolean
  freeLines: number // 20
  policy: Policy
}
```

`POST /v1/lines` asks for one partner line's decisions:

```ts
type LineRequest = {
  lineId: string // a random UUID, so a repeated request never counts twice
  seq: number // increases with every line on this install
  line: string // at most 300 characters, names as tags (LISTEN-5, LISTEN-6)
  place: string // at most 40 characters (PLACE-3)
  categories: string[] // at most 12, each at most 40 characters
  candidates: { id: string; text: string }[] // at most 40, text at most 200
  refresh?: boolean // the first line after a purchase (PAY-4)
}

type LineAnswer = {
  seq: number
  kind: Record<'yes_no' | 'either_or' | 'open' | 'not_a_question', number>
  topic: Record<string, number> // one probability per category name
  scores: Record<string, number> // candidate id -> Noul, 0 to 1
  policy: Policy
  freeLinesLeft: number | null // null once the user is entitled
  ms: { jev: number; total: number }
}

type Policy = {
  floor: number // 0.6
  bigAbove: number // 0.85
  margin: number // 0.15
  yesNoPhrases: boolean // true: phrases may fill slots 4 to 6
  noBigTopics: string[] // never a big button; starts as ["Body and pain"]
  fixedOnlyTopics: string[] // only the fixed buttons; starts empty
}
```

Errors return `{ "error": "<code>" }`:

| Status | Code              | When                                           | The app                             |
| ------ | ----------------- | ---------------------------------------------- | ----------------------------------- |
| 400    | `invalid_request` | a header, field, or length outside the limits  | ranks on the phone; logs the bug    |
| 402    | `paywall`         | no free lines left and no `listen` entitlement | opens the paywall (PAY-2, STATE-4)  |
| 429    | `rate_limited`    | over the user's limit, with `Retry-After`      | ranks on the phone                  |
| 503    | `jev_off`         | the configuration turns Jev off (STATE-3)      | ranks on the phone; degraded notice |
| 503    | `jev_unavailable` | Jev timed out or failed                        | ranks on the phone (STATE-2)        |
| 500    | `internal`        | anything else                                  | ranks on the phone                  |

The body may hold at most 16 KB, and a request that breaks any limit above
gets `400` before any count or call (SEC-2).

## See also

- [Product requirements](/docs/PRD.md): every requirement this document
  traces.
- [Product](/docs/PRODUCT.md): what Turn is and why.
- [Idea](/docs/IDEA.md): the schedule, the risks, and the pitch.
- [iPhone build notes][ios-notes], [relay and services notes][svc-notes],
  [evaluation notes][eval-notes], [Jev notes][jev-notes],
  [Cloudflare notes][cf-notes], and
  [RevenueCat notes](/docs/research/revenuecat-expo.md): the sources behind
  the choices here.
- [Guessling technical requirements](/docs/archive/guessling-trd.md): the
  build of the team's first idea, archived.

[ios-notes]: /docs/research/turn-ios.md
[svc-notes]: /docs/research/turn-services.md
[eval-notes]: /docs/research/turn-evaluation.md
[jev-notes]: /docs/research/jev.md
[cf-notes]: /docs/research/cloudflare-workers.md

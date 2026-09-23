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
1.  [Decision pipeline](#decision-pipeline)
1.  [Listening and speaking on the phone](#listening-and-speaking-on-the-phone)
1.  [Purchases and entitlements](#purchases-and-entitlements)
1.  [The iPhone app](#the-iphone-app)
1.  [Security and privacy](#security-and-privacy)
1.  [Reliability and observability](#reliability-and-observability)
1.  [Evaluation](#evaluation)
1.  [Testing](#testing)
1.  [Environments and release](#environments-and-release)
1.  [Requirements traceability](#requirements-traceability)
1.  [Open technical questions](#open-technical-questions)
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
- **Values:** limits, timeouts, windows, caches, and budgets, such as a
  cached no for 1 minute or one retry of 1.5 seconds, are decisions of this
  document unless a source is named, as in the PRD.
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
- **Jev** answers the kind of question, the topic, and one Noul, Jev's
  yes-or-no question with a probability, per candidate.
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

[svc-placement]: /docs/research/0024-turn-services.md#placement-near-typesafe-and-revenuecat

## Stack and repository

### Versions on September 22, 2026

| Part                            | Version                   | Notes                                                                    |
| ------------------------------- | ------------------------- | ------------------------------------------------------------------------ |
| Expo SDK                        | 57.0.23 or later          | `ios.enableSceneSupport` on for the iOS 27 SDK ([Expo notes][tech-expo]) |
| React Native                    | 0.86.3                    | pinned by the SDK's template ([RevenueCat notes][rc-expo])               |
| Xcode and iOS SDK               | Xcode 27, iOS 27 SDK      | on macOS Tahoe 26.6 or later                                             |
| iOS deployment target           | 26                        | `SpeechTranscriber`'s first release (COMPAT-1)                           |
| `react-native-purchases`, `-ui` | 10.10.1                   | Test Store and Paywalls, on purchases-ios 5.90.1                         |
| `expo-secure-store`             | 57.0.4                    | the user's ID in the Keychain                                            |
| `expo-speech`                   | 57.0.3                    | speech with a chosen voice                                               |
| `expo-speech-recognition`       | 57.1.0                    | the last fallback recognizer                                             |
| `expo-sqlite`                   | 57.0.3                    | the phrase bank                                                          |
| `react-native-reanimated`       | 4.5.1                     | the design's fades, with `react-native-worklets` 0.10.1, as SDK 57 pins  |
| `minisearch`                    | 7.2.0                     | BM25+ keyword ranking in the shared code                                 |
| `create-expo-module`            | 57.0.1                    | scaffolds the two local modules                                          |
| `@typesafe-ai/sdk`              | 0.6.0                     | in the relay and the evaluation; runs under workerd                      |
| Jev                             | `jev-1.13.0`              | the only model on September 22, 2026                                     |
| Wrangler                        | 4.136.2                   | needs Node.js 22 or later; `compatibility_date` `2026-09-22`             |
| `@cloudflare/vitest-plugin`     | 1.2.2, with Vitest 4.1.11 | the relay's tests; pins Wrangler 4.136.2 ([workspace notes][ws-notes])   |
| TypeScript                      | 6.0.3                     | `tsc` everywhere; Expo SDK 57's pin ([workspace notes][ws-notes])        |
| `@revenuecat/cli`               | 0.1.3                     | headless Test Store purchases for the relay's tests                      |

The iPhone build notes have the dates and licenses of the Expo libraries
and MiniSearch, all MIT ([iPhone build notes][ios-libs]), and the iOS design
notes have Reanimated's pins in SDK 57 ([iOS design notes][ios-rea]), which
the [design's motion][design-motion] uses.

[rc-expo]: /docs/research/0009-revenuecat-expo.md#expo-sdk-react-native-and-minimum-ios
[ios-libs]: /docs/research/0023-turn-ios.md#libraries-on-september-22-2026
[ios-rea]: /docs/research/0015-ios-design.md#reanimated-4-in-sdk-57

### Repository layout

The code lives in this repository, as Bun workspaces, next to `docs/`:

```text
/
├── app/                  # the Expo project; routes in app/src/app/
├── modules/
│   ├── turn-listen/      # SpeechTranscriber, line ends, name tagging
│   └── turn-voice/       # Personal Voice authorization
├── shared/               # shortlist, row rules, Jev request builder
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
  builder live in small TypeScript files in `shared/`, the `@turn/shared`
  package, which the app, the relay, and the evaluation import one file at a
  time, such as `@turn/shared/shortlist`, so the evaluation measures the code
  the app runs. The package ships its source, with no build step.
- **Commands.** `bun install` at the root installs every workspace, and
  `bun run test` and `bun run typecheck` run each package's Vitest tests and
  TypeScript check. Bun's own test runner, `bun test`, isn't used.
- **The starter bank** lives in `app/src/content/starter-bank.json`, which the
  app loads on first launch and the evaluation reads (CONTENT-1).

## Data model

### The phone's database

`expo-sqlite` holds everything the phone keeps (BANK-8):

```sql
CREATE TABLE category (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 40),
  position INTEGER NOT NULL,
  fixed INTEGER NOT NULL DEFAULT 0          -- 1 for Quick and body-pain, which can't be deleted
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
- **The starter bank's ids** are how the app finds its fixed parts: the
  strip's category is `strip`, the fixed buttons are `yes`, `no`, and
  `not-sure` in `quick`, and the body-and-pain category is `body-pain`. Its
  ten categories, the strip's among them, leave room under BANK-2's 12 for
  Typed and at least one more.
- **Starter phrases** carry a `reviewed` flag, set when the user keeps,
  edits, or reviews them (BANK-10).
- **Settings** hold the voice and its rate, the place, the user's permission
  and its date, the under-18 switch, the cached configuration, and the stats
  of METRIC-3.
- **Limits** match the PRD: phrases of 200 characters (BANK-3), at most 12
  categories of 40 (BANK-2), and at most 12 places of 40 (PLACE-1); the app
  enforces the counts, so a request never breaks the relay's limits.

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
  `free_lines` is a duplicate, which gets `409` and no call to Jev (SEC-6), so
  an ID can't be reused for a new line; a new ID below 20 rows is inserted as a
  free line; and at 20 rows the line needs the entitlement. In the services
  notes' local test, this claim counted exactly 20 of 25 simultaneous lines for
  one device, and ten copies of one line ID once ([services notes][svc-count]).
  If Jev fails, the object deletes the row, so only answered lines count
  (PAY-1).
- **The entitlement row** caches RevenueCat's answer: a yes for 24 hours,
  since `listen` is a one-time purchase, and a no for 1 minute.
- **The name.** The Worker reaches the object with `getByName()` on the
  SHA-256 of the app user ID and a secret salt, with `locationHint: "wnam"`,
  so a stored record can't be traced back to an ID without the salt.
- **The Free plan's budget.** Each new free line writes 2 rows in the
  device's object and 1 in the daily budget's, so the Free plan's 100,000
  rows a day cover about 1,600 devices spending all 20 lines in one day.

[svc-count]: /docs/research/0024-turn-services.md#counting-free-partner-lines-per-device

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

`GET /v1/config` returns what the app caches at launch and when Listen mode
starts: whether Jev is on, whether the texts name TypeSafe (CONSENT-7), the
free lines this user has left, and the current policy. The Worker asks the
user's Durable Object for the free lines left, so they survive a relaunch
(PAY-1, PAY-2).

```ts
type Config = {
  jevOn: boolean
  typesafeNamed: boolean
  freeLinesLeft: number // 20 for a new user
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
  categories: { id: string; name: string }[] // at most 12; names of 40 characters
  candidates: { id: string; text: string }[] // at most 40, text at most 200
  refresh?: boolean // the first line after a purchase (PAY-4)
}

type LineAnswer = {
  seq: number
  kind: Record<'yes_no' | 'either_or' | 'open' | 'not_a_question', number>
  topic: Record<string, number> // one per category id, plus "consent"
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
  noBigTopics: string[] // never a big button; starts as ["body-pain", "consent"]
  fixedOnlyTopics: string[] // only the fixed buttons; starts empty
}
```

Errors return `{ "error": "<code>" }`:

| Status | Code              | When                                           | The app                             |
| ------ | ----------------- | ---------------------------------------------- | ----------------------------------- |
| 400    | `invalid_request` | a header, field, or length outside the limits  | ranks on the phone; logs the bug    |
| 409    | `duplicate`       | a line ID this user's free lines already hold  | ranks on the phone; logs the bug    |
| 402    | `paywall`         | no free lines left and no `listen` entitlement | opens the paywall (PAY-2, STATE-4)  |
| 429    | `rate_limited`    | over the user's limit, with `Retry-After`      | ranks on the phone                  |
| 503    | `jev_off`         | the configuration turns Jev off (STATE-3)      | ranks on the phone; degraded notice |
| 503    | `jev_unavailable` | Jev timed out or failed                        | ranks on the phone (STATE-2)        |
| 500    | `internal`        | anything else                                  | ranks on the phone                  |

The body may hold at most 16 KB, and a request that breaks any limit above
gets `400` before any count or call (SEC-2).

## Decision pipeline

### The end of a line

Apple's transcriber has no end-of-utterance event, and `SpeechDetector`
reports only errors, so Turn sets its own rule
([iPhone build notes][ios-line-end]):

- **Results.** `turn-listen` keeps a volatile and a finalized transcript, as
  Apple's sample does, and treats text as settled once the analyzer's
  `resultsFinalizationTime` passes its end, not only when a result arrives
  with `isFinal`.
- **The silence rule.** When the tapped audio has stayed below a speech level,
  and no new words have arrived, for the window, the module calls
  `finalize(through: nil)` and reports the settled text as one line (LISTEN-2).
  The window starts at 0.5 seconds, the evaluation notes' budget for detecting
  the end of a turn, and the [replay test](#testing) tunes it against two pulls:
  a longer window slows the row (PERF-1), and a shorter one cuts the partner off
  (PERF-5) ([evaluation notes][eval-latency]).
- **Manual ends.** Done ends a spoken line at once, the same way, and a
  typed line ends when the user sends it (LISTEN-4).
- **Length.** The app keeps a line's last 300 characters once its names are
  tagged (LISTEN-6).

[ios-line-end]: /docs/research/0023-turn-ios.md#ending-the-partners-line
[eval-latency]: /docs/research/0025-turn-evaluation.md#a-latency-target-for-turn

### Names as tags

Before a request, `turn-listen` tags the line, the 40 candidates, the
category names, and the place's name together (LISTEN-5):

- **The tagger.** `NLTagger` with the `nameType` scheme and the options
  `joinNames`, `omitPunctuation`, and `omitWhitespace`, as in Apple's recipe
  ([iPhone build notes][ios-names]).
- **The gazetteer.** The tagger missed every name in lowercased text in the
  notes' test until a gazetteer listed them, and transcripts are noisier
  than typed text. So the module builds an `NLGazetteer` from the names the
  tagger finds in the user's own phrases and places, which the user typed
  with capitals, and rebuilds it after each edit.
- **Tags.** Each distinct personal name becomes `[PERSON n]`, place name
  `[PLACE n]`, and organization name `[ORG n]`, numbered by first
  appearance, and the same name gets the same tag everywhere in the request.
- **Tag, then cut.** A tag can make text longer, so the app tags first, then
  keeps the line's last 300 characters, cuts the place's and the categories'
  names to 40, and swaps any candidate over 200 characters for the next
  phrase in the shortlist, so a request never breaks the relay's limits
  (LISTEN-6, SEC-2).
- The candidates' ids don't change, so Jev's answers map back to the user's
  own text, and the tag map stays on the phone.
- The place's name is tagged like the rest, so no name the tagger finds
  leaves the phone; a place such as Clinic or Home has none (PLACE-3).

[ios-names]: /docs/research/0023-turn-ios.md#swapping-names-for-tags-with-nltagger

### The shortlist

The phone picks 40 candidates, never the fixed buttons or the strip's
phrases, in this order, without duplicates (ROW-2, SPEAK-7):

1.  The phrases now in the row, so each gets a new score: the big button's,
    if one shows, then up to six in the slots under it.
2.  Up to 24 phrases by keyword ranking over the line as heard, before any
    tags: MiniSearch's BM25+ with its defaults (k 1.2, b 0.7, d 0.5), on
    lowercased words with common words dropped, since MiniSearch applies
    none itself. The common words are NLTK's English list without its
    contractions, whose fragments it holds, plus "please"; only phrases
    that share a word count ([iPhone build notes][ios-ranker];
    [shortlist notes][sl-words]).
3.  Up to 8 of the user's most-tapped phrases of the last 30 days.
4.  Up to 8 of the place's phrases, most-tapped first.
5.  The rest by taps over the last 30 days, then by the grid's order, until
    there are 40.

Within a step, the grid's order breaks ties.

If the evaluation finds Jev trailing (EVAL-4), step 2 ranks by Apple's
sentence embedding instead of keywords, as the idea plans: the iPhone build
notes' test scanned 2,000 stored vectors in 2.3 ms on a Mac
([iPhone build notes][ios-embed]).

At 2,000 phrases, the BM25 index is built once at launch and follows each
edit, so a shortlist takes at most 50 milliseconds (PERF-4, BANK-7). An
edited or deleted phrase is removed by the text it was indexed with, since
MiniSearch's `discard` can score a match below 0
([shortlist notes][sl-minisearch]).

[ios-ranker]: /docs/research/0023-turn-ios.md#a-phrase-ranker-in-typescript
[ios-embed]: /docs/research/0023-turn-ios.md#sentence-embeddings-for-a-shortlist
[sl-words]: /docs/research/0033-turn-shortlist-and-row.md#common-word-lists
[sl-minisearch]: /docs/research/0033-turn-shortlist-and-row.md#minisearch-720

### The Jev request

The object sends one request per line, built by the shared request builder,
with the model pinned (SEC-2):

```jsonc
{
  "model": "jev-1.13.0",
  "state": {
    "partner_line": "How was physio today, [PERSON 1]?",
    "place": "Clinic"
  },
  "questions": {
    "kind": {
      "type": "choice",
      "instructions": "What kind of question is `partner_line`?",
      "criteria": {
        "yes_no": "Can be answered with yes or no",
        "either_or": "Asks the listener to pick one of the options it names",
        "open": "Needs an answer in the listener's own words",
        "not_a_question": "A statement, greeting, or comment, not a question"
      }
    },
    "topic": {
      "type": "choice",
      "instructions": "What topic is `partner_line` about?",
      "criteria": {
        "feelings": "Feelings",
        "body-pain": "Body and pain",
        "food": "Food and drink",
        "consent": "Agreeing to or refusing care, treatment, or a procedure"
      }
    },
    "c00": {
      "type": "noul",
      "instructions": {
        "phrase": "It was hard",
        "question": "`phrase` answers what the partner just said in `partner_line`."
      }
    }
    // c01 to c39 have the same shape
  }
}
```

- **One Noul per candidate, a small state.** The state holds only the tagged
  line and the place, and each candidate rides in its own Noul's
  `instructions`, as TypeSafe's Noul page does for records; unrelated state
  "costs you accuracy", and more questions don't
  ([services notes][svc-request]). Nouls can all come back low, which is
  how the row learns that nothing fits.
- **Keys.** `c00` to `c39` stand for the candidates in the request's order,
  and the object maps each answer back to the phone's phrase id; the key "is
  not sent to the underlying model" ([Jev notes][jev-api]).
- **The topic's options** are the user's category ids, each described by
  its name as the user wrote it, plus a fixed `consent` option, so the
  safety rules follow ids a rename can't change (ROW-3). That is at most 13
  options, far below a Choice's limit of 255, and nothing documented caps 42
  questions: TypeSafe's own cookbooks send 54 and 62 in one request.
- **The call.** `@typesafe-ai/sdk` 0.6.0 with every option in code:
  `defaultModel: 'jev-1.13.0'`, `logLevel: 'off'`, `timeout: 1500` per
  attempt, and `retry: { maxRetries: 1, respectRetryAfter: false }`, under
  `AbortSignal.timeout(2500)`. The SDK's defaults would let one call run
  about 31.5 seconds.
- **Errors.** A `429`, a `529`, a timeout, or a `5xx` becomes
  `jev_unavailable`. Running out of credits has no documented status: the
  SDK passes a `402` as its base `APIError`, which the object logs as
  `credits` and answers as `jev_unavailable` (AVAIL-2).
- **Size and cost.** About 1,700 to 1,900 input tokens a line, by the
  services notes' estimate, or up to about $0.00008 at $0.042 per
  million; the object logs `usage.input_tokens` and the `model` field of
  each answer, so a silent model change would show.

[svc-request]: /docs/research/0024-turn-services.md#the-request-body-for-one-partner-line
[jev-api]: /docs/research/0005-jev.md#the-system-one-http-api

### From probabilities to the row

The app applies these rules to each answer, with the policy the answer
carries (ROW-3 to ROW-8):

```text
on answer(a)
  if a.seq < newest seq: drop it                                   # ROW-7
  P = a.policy
  topic = the most likely topic
  yesNo = kind yes_no is the most likely kind, at P.floor or more
  fixedTopic = topic is in P.fixedOnlyTopics
  showFixed = yesNo or fixedTopic                                  # ROW-4
  phrasesAllowed = not fixedTopic and (not yesNo or P.yesNoPhrases)
  fresh = candidates scoring P.floor or more, highest first,
          ties in the answer's order
  if not showFixed and fresh is empty:
    keep the row as it is, answering its earlier line              # ROW-3
  else if not showFixed and fresh[0] > P.bigAbove
          and topic is not in P.noBigTopics
          and the phone didn't rank the line:                      # STATE-1
    show fresh[0] as the big button and remember it                # ROW-3
  else:
    if showFixed:
      slots 1-3 = Yes, No, Not sure                                # ROW-4
      if phrasesAllowed: usable = slots 4-6
      else: empty slots 4-6; usable = none                         # EVAL-5
    else: empty the slots the fixed buttons held; usable = all six
    each shown phrase takes its new score; below P.floor, it's stale
    if the row was a big button, and its phrase isn't shown but still
      scores P.floor or more: it takes the first empty usable slot,
      or else the lowest-scoring stale one                         # ROW-5
    for each fresh phrase not shown, highest first:
      if a usable slot is empty: take the first one
      else if a usable slot is stale: take the lowest-scoring stale one
      else if it beats the lowest shown by P.margin: take that slot  # ROW-5
      else: stop
  mark the topic's tab if it scores P.floor or more, else none     # ROW-9
  if the row changed: render; announce the number of replies       # A11Y-2
```

- **Stale phrases stay visible** until a new phrase needs their slot, so a
  line with little to say doesn't blank the row. A shown phrase the answer
  doesn't score counts as 0.
- **A hold** leaves the row answering its earlier line, and the row records
  which, so the caption can say which line the replies still answer.
- **The big button** fills the row's fixed area; the six slots underneath
  keep their phrases for the next answer (ROW-1). Its phrase goes back in
  after the fixed buttons take their slots, so Yes can't cover it.
- **The fixed buttons** hold their slots by their phrase ids, `yes`, `no`,
  and `not-sure`, so the app speaks and counts them like any phrase.
- **Ties** go by the answer's order: the shortlist's for Jev's answers, so
  the app gives the rules their scores in that order, which the relay's
  JSON object can't carry, and the phone's own for its ranking.
- **A tie** for the most likely topic counts as each tied topic, so a tie
  with a topic that never gets a big button gets none, and a tie marks no
  tab.
- **Clearing** empties the slots, forgets the big button's phrase, and
  unmarks the tab, but keeps the newest line's number (ROW-10). An answer
  still in flight for that line can fill the row again, so stopping Listen
  mode also aborts its request.
- **Nothing speaks** in these rules; only a tap does (ROW-6).

### Timeouts, sequence numbers, and fallbacks

- **One line at a time.** A new line aborts the request in flight with an
  `AbortController`, and an answer for an older sequence number is dropped
  (ROW-7).
- **The phone waits 3 seconds** for the relay, and the relay gives Jev 2.5
  seconds in all, with at most one retry of 1.5 seconds and no wait for a
  server's `Retry-After`, since a later answer would arrive too late to help
  (STATE-2).
- **After a failure,** the phone ranks that line itself. After two failures
  among the last three lines, the app shows "Listen mode is degraded" until
  a line succeeds (STATE-2).

### The phone's own ranking

Offline, after a failure, with Jev off, or while the under-18 switch is on,
the phone ranks the line with the shortlist's BM25 (STATE-1, CONSENT-6):

- Phrases sharing a word with the line, other than common words, score 1 and
  the others 0; the place's phrases, then taps, then the keyword ranking,
  break ties.
- A line that starts with a form of "do", "be", "have", or a modal verb,
  such as "Do you" or "Can you", counts as a yes-or-no question.
- The row's rules then run as above, with no big button, so steady slots
  still hold.
- The row shows "Ranked on this phone" while this ranking is in use.

## Listening and speaking on the phone

### The turn-listen module

The module's interface, as the app sees it, in the Expo Modules API, with
Swift `async` functions behind each `AsyncFunction` and events sent with
`sendEvent` ([iPhone build notes][ios-modules]):

```ts
type ListenState = 'listening' | 'paused' | 'stopped' | 'unavailable'

availability(): Promise<{ engine: 'speech' | 'dictation' | 'none'; asset: 'installed' | 'downloadable' | 'unsupported' }>
installAsset(): Promise<void> // emits onAssetProgress
start(): Promise<void> // after the consent card (CONSENT-4)
pause(): Promise<void>
resume(): Promise<void>
stop(): Promise<void>
endLine(): Promise<void> // Done
muteForSpeech(muted: boolean): Promise<void>
tagNames(texts: string[]): Promise<{ texts: string[] }> // same tag, same name
setGazetteer(names: { text: string; kind: 'person' | 'place' | 'org' }[]): Promise<void>

events: onPartial { text }, onLine { text, endedAt }, onState { state, reason? }, onAssetProgress { fraction }
```

- **The pipeline.** As in Apple's iOS 26 sample: a `SpeechTranscriber` for
  `en-US`, pinned rather than `Locale.current` since Jev is English-first,
  with volatile results and time ranges; an `AVAudioEngine` input tap; each
  buffer converted to `bestAvailableAudioFormat(compatibleWith:)`, since
  "the analyzer does not perform audio conversion"; and an
  `AsyncStream<AnalyzerInput>` into `start(inputSequence:)`. The module
  keeps the engine as the source instead of iOS 27's capture provider,
  which reconfigures the app's audio session itself
  ([iPhone build notes][ios-mic]).
- **Warm-up.** `prepareToAnalyze(in:)` runs when Listen mode starts, to cut
  the delay before the first result.
- **The model.** The first time Listen mode turns on, `installAsset()`
  downloads the English model with a progress bar; after that, transcription
  works offline (LISTEN-1).
- **Permissions.** `SpeechTranscriber` needs only the microphone: Apple's
  samples declare only `NSMicrophoneUsageDescription`. The speech
  recognition prompt belongs to the last fallback and is asked only if it
  runs.
- **Availability.** Every `SpeechAnalyzer` call sits behind
  `#available(iOS 26.0, *)`, since the module's podspec still targets iOS
  16.4, and `SpeechTranscriber.isAvailable` is checked at launch.
- **Threads.** One `NLTagger` per call, since "An `NLTagger` isn’t safe for
  concurrent use".

[ios-mic]: /docs/research/0023-turn-ios.md#from-the-microphone-to-the-analyzer

### The audio session

Turn sets the shared audio session itself, since `expo-speech` never does
and the default category is silenced by the Silent switch
([iPhone build notes][ios-session]):

- **At launch:** `.playback`, so speech plays with the Silent switch set to
  silent and with the screen locked, and follows the current route, such as
  connected headphones (VOICE-4).
- **In Listen mode:** `.playAndRecord` with the `.default` mode and
  `.defaultToSpeaker`, so the partner hears Turn through the loudspeaker;
  no Bluetooth input option, so the built-in microphone stays in use.
  Options are set again on every category change, since they don't carry
  over.
- **No voice processing.** Echo cancellation would likely treat Turn's own
  speech as other audio and duck it, and an AAC voice must stay loud.
- **Turn never hears itself (LISTEN-3).** On a tap, the app calls
  `finalize(through: nil)` through `endLine()`, then `muteForSpeech(true)`,
  which mutes input with `AVAudioApplication.setInputMuted(_:)`, then speaks;
  on `onDone` or `onStopped`, after the session's `outputLatency`, it
  unmutes.
- **Leaving the foreground (LISTEN-7).** The module stops the engine and
  reports `paused`; the app shows the light off until the user taps it.
- **Interruptions (LISTEN-10).** A call or Siri pauses Listen mode, which
  stays paused. The module observes both iOS 26's interruption notification
  and iOS 27's replacements, `AVAudioSessionDidBecomeInactiveNotification`
  and `AVAudioSessionResumptionRecommendationNotification`; a
  `.playAndRecord` session can't start during a call and reports
  `unavailable` with the reason.
- **Route changes.** After an engine configuration change, the module
  reinstalls the tap and restarts the engine, and never releases the engine
  inside the handler.

[ios-session]: /docs/research/0023-turn-ios.md#audio-session-category-mode-and-options

### The turn-voice module

```ts
requestPersonalVoice(): Promise<'authorized' | 'denied' | 'notDetermined' | 'unsupported'>
personalVoice(): Promise<{ identifier: string; name: string } | null>
events: onVoicesChanged {}
```

- **Asking (VOICE-2).** `requestPersonalVoiceAuthorization()` runs when the
  user picks Personal Voice in Settings; Apple lists no Info.plist key for
  it, and the user must first turn on "Allow Apps to Request to Use" in iOS
  Settings, which the screen explains ([iPhone build notes][ios-pv]).
- **Finding it.** Once authorized, the voice with the `isPersonalVoice` trait
  appears among `AVSpeechSynthesisVoice.speechVoices()`. `personalVoice()`
  returns it only if `AVSpeechSynthesisVoice(identifier:)` resolves it,
  since no Apple page says it does and `expo-speech` loses its errors on
  iOS.
- **Speaking.** `expo-speech` speaks with that identifier, or the system
  voice chosen in Settings, at the chosen rate (VOICE-1, VOICE-3). `denied`
  and `unsupported` are treated alike: a system voice speaks, and Settings
  says why.
- **Stopping (SPEAK-2).** A new tap calls `Speech.stop()` before speaking,
  since `expo-speech` queues utterances.

[ios-pv]: /docs/research/0023-turn-ios.md#personal-voice

### When transcription isn't available

Three engines, tried in order (LISTEN-9):

1.  `SpeechTranscriber`, when `isAvailable` and the English model is
    installed or downloadable.
1.  `DictationTranscriber` in the same analyzer, which "supports the same
    languages, speech-to-text model, and devices as iOS 10’s on-device
    SFSpeechRecognizer", with its `frequentFinalization` option.
1.  `expo-speech-recognition` 57.1.0, the idea's fallback, if the module
    itself fails on the video's iPhone by the end of September 24, as the
    idea's [risks][idea-risks] set: on the device with
    `requiresOnDeviceRecognition`, restarted for each partner line, which
    stays under `SFSpeechRecognizer`'s one-minute limit, with `iosCategory`
    in the `.default` mode, since its default `.measurement` mode lowers
    playback.

With none of them, or in the Simulator, where Apple's sample doesn't run,
Listen mode says so and offers the typed-line field.

[idea-risks]: /docs/IDEA.md#risks

## Purchases and entitlements

### RevenueCat setup

- **Test Store** comes with a new RevenueCat project, with its API key,
  which starts with `test_`; the In-App Purchase capability, which needs the
  paid program, isn't needed ([services notes][svc-setup]).
- **The product:** `turn_listen`, a one-time Test Store product at $24.99,
  made under Product catalog, Products, on the Test Store tab. Test Store's
  docs never name a one-time type, but REST API v2 and purchases-ios both
  handle non-consumable Test Store products, so if the dashboard's form
  offers none on September 22, the team creates it with
  `POST /v2/projects/{project_id}/products` and `"type": "non_consumable"`,
  using a key with `project_configuration:products:read_write` (PAY-3,
  PAY-8). A saved product's price can't be edited; a new product replaces
  it in the package.
- **Not a yearly product.** A yearly Test Store product renews every hour and
  ends after five hours, which would lock Listen mode mid-judging
  ([services notes][svc-one-time]).
- **Entitlement:** `listen`, with the Test Store product attached.
- **Offering:** `default`, with one package for the product, and a Paywall
  built in the dashboard that shows the price once and says speaking stays
  free (PAY-2, PAY-3).
- **Sandbox Testing Access** stays at "Anybody", its default, so "All
  non-production purchases (Test Store and platform sandbox) will grant
  access to entitlements" ([RevenueCat notes][rc-sandbox]).
- **The relay's key:** a v2 secret key with only
  `customer_information:customers:read`.

[svc-setup]: /docs/research/0024-turn-services.md#setting-up-test-store-in-the-dashboard
[svc-one-time]: /docs/research/0024-turn-services.md#one-time-products-in-test-store
[rc-sandbox]: /docs/research/0009-revenuecat-expo.md#recommended-backend-pattern

### Purchases in the app

- **The ID.** On first launch, the app creates a random version 4 UUID,
  keeps it with `expo-secure-store`, and passes it to `Purchases.configure`
  as the `appUserID`, with the Test Store key. RevenueCat recommends "A
  non-guessable pseudo-random ID, like a UUID", and Expo says Keychain data
  usually survives a reinstall with the same bundle ID but that "you should
  never rely on this implementation detail"; when it survives, the free
  lines and the purchase do too (PAY-10) ([services notes][svc-ids]).
- **The paywall.** On a `402`, or when Listen mode is turned on while the
  configuration shows no free lines left and RevenueCat's customer info has
  no active `listen`, the app presents RevenueCat's paywall for `listen`
  (PAY-2); setup and the paywall never block the grid (SPEAK-5):

  ```ts
  await RevenueCatUI.presentPaywallIfNeeded({
    requiredEntitlementIdentifier: 'listen'
  })
  ```

- **The sheet.** Test Store shows an alert titled "Test Store Purchase"
  with "Test valid purchase", "Test failed purchase", and "Cancel". Success
  resolves with the new customer info, a failure rejects with code `42`,
  and a cancel sets `userCancelled`; the app shows Listen mode unlocked, the
  failure with a retry, or the paywall again (PAY-4, PAY-5).
- **After a purchase,** the next line carries `refresh: true`, so the relay
  skips a cached no (PAY-4).
- **Restore.** Under Test Store, `restorePurchases` only returns the current
  customer: "Restoring purchases not available in Test Store." Settings
  keeps the button, which refreshes the customer and says whether `listen`
  is active (PAY-6).
- **Release builds crash** with a Test Store key: purchases-ios shows "Wrong
  API Key" and calls `fatalError` outside a Debug build, and
  `react-native-purchases` 10.10.1 exposes no way around it, so every build
  the team ships is a Debug build ([services notes][svc-key]).
- **No attributes.** The app sets no RevenueCat customer attributes, so
  RevenueCat receives only the app user ID and the purchase (PRIV-4).

[svc-ids]: /docs/research/0024-turn-services.md#identifiers-that-survive-a-reinstall

### The relay's entitlement check

The user's object checks only once the free lines are used (PAY-1, PAY-7):

```text
on line(lineId, refresh)
  if the build is simulator and SIMULATOR_UNLIMITED is on: call Jev    # PAY-9
  claim = claim(lineId)                  # free, duplicate, or paid
  if claim is duplicate: 409
  else if claim is free:
    call Jev; if it fails: release(lineId)
  else if the cached yes is under 24 hours old: call Jev
  else if the cached no is under 1 minute old
          and not (refresh and the last refresh is over 1 minute old): 402
  else: ask RevenueCat; cache the answer; call Jev or answer 402
```

- **The call** uses the secret key; a `404` means RevenueCat has never seen
  the ID, so the answer is no ([RevenueCat notes][rc-v2]):

  ```text
  GET https://api.revenuecat.com/v2/projects/{project_id}/customers/{customer_id}/active_entitlements
  ```

- **The match** compares each item's `entitlement_id` with the entitlement's
  object id in the relay's configuration, since the API returns ids, not
  the `listen` lookup key, and accepts an `expires_at` that is `null` or
  still ahead.
- **Test Store counts.** Active entitlements carry no store or
  environment, so the check can't tell a Test Store unlock from a real one;
  for Next Gen it accepts both, with Sandbox Testing Access left at
  "Anybody" through October 13, 2026 ([services notes][svc-server]).
- **Tests without a phone.** `rc customers simulate-purchase` from
  `@revenuecat/cli` makes a headless Test Store purchase for a test ID, so
  the relay's check can be tested from a script.
- **The limit.** RevenueCat allows 480 requests a minute for customer
  information, far above the entry's traffic.
- **Judges in the Simulator.** If the check on September 25 finds that Test
  Store can't buy in the Simulator, the relay's `SIMULATOR_UNLIMITED` switch
  skips the count for requests marked `simulator` until judging ends on
  October 13 (PAY-9). The header can be forged, which costs only Jev
  credits, and the per-ID rate limit still applies.

[rc-v2]: /docs/research/0009-revenuecat-expo.md#rest-api-v2-customer-and-active-entitlements
[svc-server]: /docs/research/0024-turn-services.md#test-store-purchases-on-the-server

## The iPhone app

### Screens and navigation

Expo Router, with routes under `app/src/app/`:

| Route              | Screen                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `/`                | the grid, the row, the conversation strip, the place picker, the Listen button, the light, the caption, and the keyboard |
| `/permission`      | the user's permission step, as a sheet (CONSENT-1)                                                                       |
| `/consent`         | the consent card, full screen (CONSENT-4)                                                                                |
| `/settings`        | Settings (SET-1), with voice, places, bank, Turn Listen, Restore Purchases, privacy, licenses, and stats                 |
| `/bank/[category]` | the phrase bank editor for one category (BANK-2)                                                                         |

The paywall is presented by RevenueCat's UI over the current screen (PAY-2).

- **The home screen** has no header, and its bands follow the
  [design's home screen][design-home]: only the grid scrolls, except on short
  screens and from AX1, where everything between the top bar and the bottom
  bar scrolls as one column.
- **The permission step** is a `formSheet` that sets
  `headerTransparent: false` and a solid background, since Expo Router makes
  form sheets transparent where Liquid Glass is available
  ([Turn's iOS design notes][ios-glass-expo]), as the
  [design's permission step][design-permission] asks.

[design-home]: /docs/DESIGN.md#the-home-screen
[design-permission]: /docs/DESIGN.md#the-permission-step
[ios-glass-expo]: /docs/research/0029-turn-ios-design.md#glass-in-expo-sdk-57-and-how-to-avoid-it

### State and storage

- **One store** holds the row, the Listen state, the free lines left, and
  the cached configuration in memory, and writes settings through to SQLite.
- **The grid** reads the bank from SQLite at launch and after each edit, and
  never reorders itself (BANK-4).
- **Taps** write one row per phrase and day (BANK-6).
- **Typing takes the row.** While the keyboard is open, the row shows the
  phrases matching the letters typed (SPEAK-4); when it closes, the row
  returns to its last answer.

### Networking

- **Only the relay** is called by the app's own code, with `fetch`, a
  3-second abort, and no retry (STATE-2).
- **The configuration** is fetched at launch and when Listen mode starts,
  and the last copy is kept; without one, the texts don't name TypeSafe
  (CONSENT-7), and the paywall's check when Listen mode starts reads it
  (PAY-2).

### Flows on the phone

- **Typing (SPEAK-3).** The [design's composer][design-composer], docked
  above the keyboard, takes up to 500 characters and speaks them on Speak.
  Text of up to 200 characters that the bank doesn't already hold, compared
  after trimming and ignoring case, goes into the Typed category, which the
  app creates on first use and counts among the 12.
- **Repeat (SPEAK-6).** The last spoken text stays in memory, and Repeat
  speaks it again.
- **Undo (BANK-9).** A deleted phrase stays hidden, with an Undo button,
  until the user leaves the editor, and only then is deleted from SQLite; no
  timer runs (A11Y-5).
- **Permission (CONSENT-1 to CONSENT-3).** Allow writes the permission and
  its date to `setting`; Not now writes nothing, so the step returns.
  Withdrawing in Settings deletes it, stops `turn-listen`, aborts any
  request in flight, and blocks new ones until the user allows again.
- **Clear (ROW-10).** Clear, or stopping Listen mode, empties the six slots
  and forgets the remembered big phrase.
- **The privacy notice (SET-2).** Both versions, naming TypeSafe and not,
  ship inside the app as text, and Settings shows the one the cached
  configuration picks, with no network.
- **Erase all data (SET-3).** After a confirmation, the app deletes the
  SQLite file and the settings and loads the starter bank as on first
  launch; the Keychain ID stays, since it holds the purchase.

[design-composer]: /docs/DESIGN.md#the-composer

### Accessibility in the app

- **A steady row.** The six slots have fixed sizes and are keyed by slot
  position, since slots never move and only their phrases change, and the
  big button fills the same area (ROW-1, A11Y-1)
  ([iPhone build notes][ios-row]). A slot's height follows the text size and
  the screen, never its phrase: its text takes `numberOfLines={2}`, steps down
  to the `headline` size before it ends with an ellipsis, and keeps the whole
  phrase as its label, and the big button's steps down to `title3`'s size
  the same way (A11Y-4), as the [design's row][design-row] sets. An answer
  that would change a slot waits while a finger is on it.
- **Labels and roles.** Each phrase is a `Pressable` with
  `accessibilityRole="button"`, the only role besides `togglebutton` that
  becomes the iOS button trait, and its visible text as its label, which
  also gives Voice Control its name, since React Native 0.86 has no separate
  Voice Control names; the light is a button labeled "Listening" with a hint
  to pause (A11Y-2, A11Y-8) ([AAC notes][aac-rn]).
- **Actions.** Edit and Move are labeled `accessibilityActions`, not long
  presses; `onPress` fires on release; and the editor reorders with Move up
  and Move down, never by dragging (A11Y-8).
- **Announcements.** A changed row is announced once, as the number of
  replies, with `announceForAccessibilityWithOptions` and `queue: true`, so
  it doesn't cut off Turn's own speech (A11Y-2).
- **Order.** Layout order sets focus order, so the strip and the row come
  before the grid, and Switch Control reaches them first (A11Y-3).
- **Paging.** The [design's bottom bar][design-bottom-bar] has Up and Down,
  which scroll the grid by a screen, so it works with taps alone (A11Y-5).
- **No detection.** `AccessibilityInfo` reports VoiceOver and Reduce Motion
  but not Switch Control or Voice Control, so the app works the same for
  every input method.
- **Text.** Every text style comes from the theme with the
  `dynamicTypeRamp` the [design's typography][design-type] names, font scaling
  stays on, and phrase text wraps everywhere
  but the row's slots; from AX1, when `PixelRatio.getFontScale()` reaches
  1.786, the row, the strip, and the grid take one column each (A11Y-4)
  ([Turn's iOS design notes][ios-scale-turn]).
- **Accessibility settings.** A store reads Reduce Motion, Bold Text, Reduce
  Transparency, Increase Contrast, and the text size at launch and follows
  each change event, since Reanimated reads Reduce Motion only at launch.
  Reduce Motion stills the light's pulse and the row's fades, the
  [design's motion][design-motion], which run with `ReduceMotion.Never` so the
  store decides, and Bold Text moves each text
  style to its heavier weight (A11Y-6)
  ([Turn's iOS design notes][ios-rn-settings]).
- **The theme.** `app/src/constants/theme.ts` holds the design's tokens:
  each color as a `DynamicColorIOS` with its four values, and each text style
  with its size, leading, weights, and ramp. A unit test compares it with the
  design's `yaml` and recomputes every pair's contrast
  ([design][design-code]).
- **Feedback.** Speech is the only sound: no earcons and no haptics, and
  `allowHapticsAndSystemSoundsDuringRecording` stays false
  ([design][design-sound]).
- **Testing.** "VoiceOver isn't available via the simulator", so
  VoiceOver, Switch Control, and Voice Control are tested on a phone.

[ios-row]: /docs/research/0023-turn-ios.md#a-steady-row-in-react-native
[design-row]: /docs/DESIGN.md#the-row
[design-bottom-bar]: /docs/DESIGN.md#the-bottom-bar
[design-type]: /docs/DESIGN.md#typography
[aac-rn]: /docs/research/0022-aac-practice.md#react-natives-accessibility-api
[ios-rn-settings]: /docs/research/0029-turn-ios-design.md#colors-and-settings-in-react-native-086
[ios-scale-turn]: /docs/research/0029-turn-ios-design.md#scaling-text-in-react-native-086
[design-code]: /docs/DESIGN.md#keeping-code-in-step
[design-sound]: /docs/DESIGN.md#sound-and-haptics

### Build configuration

`app/app.config.ts` sets ([iPhone build notes][ios-modules]):

- **`ios.bundleIdentifier`:** one ID, chosen on September 22 and never
  changed, since the Devpost entry names it (SUBMIT-5).
- **`ios.deploymentTarget`:** `"26"`, the built-in property that replaced
  the build-properties setting in SDK 56 (COMPAT-1).
- **`expo-build-properties`:** the plugin with `ios.enableSceneSupport` set
  to `true`, for the iOS 27 SDK, since "expo@57.0.23 adds opt-in scene
  support, enabled with the ios.enableSceneSupport property of
  expo-build-properties" ([technology notes][tech-expo]).
- **`ios.supportsTablet`:** `false`, and `orientation` `portrait`.
- **`userInterfaceStyle`:** `'automatic'`, so the app follows the system's
  appearance, as the [design's colors][design-colors] ask; without it, Expo
  writes the light style into Info.plist
  ([Turn's iOS design notes][ios-launch]).
- **`ios.icon`:** `./assets/turn.icon`, the design's Icon Composer file
  ([design][design-icon]).
- **`expo-splash-screen`:** the design's `board` color in light and dark,
  with no image ([design][design-launch]).
- **`ios.infoPlist`:** `NSMicrophoneUsageDescription`, worded for the user
  and the partner, and `NSSpeechRecognitionUsageDescription` for the last
  fallback, in the [design's words][design-words]; no location key
  (PLACE-2).
- **`extra`:** the relay's URL, the Test Store public key, and the build's
  kind, `device` or `simulator`, for `X-Turn-Build`.

[ios-launch]: /docs/research/0029-turn-ios-design.md#the-launch-screen-in-expo-sdk-57
[design-icon]: /docs/DESIGN.md#the-app-icon
[design-launch]: /docs/DESIGN.md#launch
[design-colors]: /docs/DESIGN.md#colors
[design-words]: /docs/DESIGN.md#strings-the-prd-leaves-open

## Security and privacy

### Secrets and configuration

| Name                                 | Kind   | Where            | Purpose                                     |
| ------------------------------------ | ------ | ---------------- | ------------------------------------------- |
| `TYPESAFE_API_KEY`                   | secret | the relay        | calls Jev                                   |
| `RC_SECRET_KEY`                      | secret | the relay        | the v2 entitlement check                    |
| `ID_SALT`                            | secret | the relay        | hashes app user IDs                         |
| `JEV_MODEL`                          | var    | the relay        | `jev-1.13.0`                                |
| `JEV_ON`                             | var    | the relay        | the switch that turns Jev off (STATE-3)     |
| `TYPESAFE_NAMED`                     | var    | the relay        | whether the texts name TypeSafe (CONSENT-7) |
| `FREE_LINES`                         | var    | the relay        | 20 (PAY-1)                                  |
| `POLICY`                             | var    | the relay        | the row's policy, as JSON (ROW-8)           |
| `SIMULATOR_UNLIMITED`                | var    | the relay        | judges' access in the Simulator (PAY-9)     |
| `RC_PROJECT_ID`, `RC_ENTITLEMENT_ID` | var    | the relay        | the v2 check                                |
| Test Store public key                | public | the app's config | RevenueCat's SDK in debug builds            |
| Relay URL                            | public | the app's config | the relay's address                         |

The relay's `wrangler.jsonc`, in the shape the services notes' local test
ran under Wrangler 4.136.2:

```jsonc
{
  "name": "turn-relay",
  "main": "src/index.ts",
  "compatibility_date": "2026-09-22",
  "placement": { "region": "aws:us-west-2" },
  "durable_objects": {
    "bindings": [
      { "name": "DEVICE", "class_name": "Device" },
      { "name": "BUDGET", "class_name": "Budget" }
    ]
  },
  "exports": {
    "Device": { "type": "durable-object", "storage": "sqlite" },
    "Budget": { "type": "durable-object", "storage": "sqlite" }
  },
  "ratelimits": [
    {
      "name": "USER_LIMITER",
      "namespace_id": "1001",
      "simple": { "limit": 30, "period": 60 }
    },
    {
      "name": "ADDRESS_LIMITER",
      "namespace_id": "1002",
      "simple": { "limit": 120, "period": 60 }
    }
  ],
  "observability": { "enabled": true, "logs": { "invocation_logs": false } },
  "secrets": { "required": ["TYPESAFE_API_KEY", "RC_SECRET_KEY", "ID_SALT"] },
  "vars": { "JEV_MODEL": "jev-1.13.0", "JEV_ON": "true", "FREE_LINES": "20" }
}
```

- **Secrets** are set with Wrangler and listed under `secrets.required`, so a
  deploy without them fails. For local work they live in `worker/.dev.vars`,
  which Git ignores, and a committed `.dev.vars.example` names them for anyone
  who runs the relay with their own keys (SEC-1)
  ([services notes][svc-secrets]).
- **The Test Store key** is the only RevenueCat key the app carries, and it
  sits in the app's committed configuration so judges can build from source.
  RevenueCat's blogs keep test keys out of version control and advise
  rotating them, while its docs say nothing; every build a judge runs
  carries the key anyway, so the team commits it for judging and rotates it
  after the winners are announced (SEC-1).
- **No secret key** is in the repository or its history, which a secret
  scan checks before it goes public (SUBMIT-1).

[svc-secrets]: /docs/research/0024-turn-services.md#secrets-and-wranglerjsonc-for-the-relay

### Validation and abuse limits

- **Headers:** `X-Turn-User` must be a lowercase version 4 UUID, and
  `X-Turn-Build` `device` or `simulator`; anything else gets `400`.
- **Lengths:** as in [Relay API](#relay-api), checked before any count or
  call (SEC-2).
- **Rate:** 30 requests a minute per ID hash, through Cloudflare's rate
  limiting binding with a 60-second period, and 120 a minute per address as
  a backstop only, since mobile networks share addresses (SEC-3). The
  binding counts per Cloudflare location and is "permissive, eventually
  consistent"; with the relay placed in one region, its counters act almost
  like global ones ([services notes][svc-ratelimit]).
- **A daily budget.** Anyone can mint new IDs, since the relay's code and
  address are public and a Test Store purchase is free, so neither the free
  lines nor `listen` guards Jev's credits. One more Durable Object counts Jev
  calls per UTC day, retries included, and past 10,000, about $0.80, the relay
  answers `jev_unavailable` until midnight UTC ([services notes][svc-abuse]).
- **The switch:** `JEV_ON` set to false stops every call to Jev at once
  (STATE-3).
- **Errors** carry only the codes above (SEC-4).

[svc-ratelimit]: /docs/research/0024-turn-services.md#the-rate-limiting-binding-for-turn
[svc-abuse]: /docs/research/0024-turn-services.md#limiting-abuse-of-the-free-lines

### Data inventory

| Data                                    | Where                     | Kept                             | Leaves to                                                                        |
| --------------------------------------- | ------------------------- | -------------------------------- | -------------------------------------------------------------------------------- |
| The phrase bank, places, taps, settings | the phone's SQLite        | until the user erases them       | 40 candidates and the category names per line, tagged, to the relay and TypeSafe |
| Audio                                   | `turn-listen`'s buffers   | never stored                     | nowhere                                                                          |
| A partner line                          | the phone's memory        | the caption, at most two minutes | the relay and TypeSafe, tagged, with the place's name                            |
| The app user ID                         | RevenueCat's SDK          | the SDK's own storage            | RevenueCat, and the relay, which stores its hash                                 |
| Free lines used, the cached entitlement | the user's Durable Object | until the relay is deleted       | nowhere                                                                          |
| Request logs                            | Workers Logs              | 3 days on the Free plan          | Cloudflare                                                                       |
| Purchases                               | RevenueCat                | RevenueCat's retention           | RevenueCat                                                                       |

TypeSafe keeps rights "in perpetuity" to use requests for telemetry and abuse
monitoring, and "Jev is not trained on customer requests or responses"
([Jev notes][jev-data]); the permission step and the privacy notice say so
(CONSENT-1, CONTENT-4).

[jev-data]: /docs/research/0005-jev.md#offline-behavior-and-data-handling

## Reliability and observability

### Failure modes

| Failure                                     | Seen as                                                   | Response                                                         |
| ------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------- |
| No network                                  | `fetch` fails at once                                     | the phone's own ranking, "Ranked on this phone" (STATE-1)        |
| Relay slow or down                          | no answer in 3 seconds                                    | the phone's own ranking; degraded after two in three (STATE-2)   |
| Jev slow, busy, or failing                  | `503 jev_unavailable`                                     | the same                                                         |
| Jev out of credits                          | an undocumented status, likely `402`, logged as `credits` | the same, and the credit alert (AVAIL-2)                         |
| The daily Jev budget spent                  | `503 jev_unavailable`                                     | the same, until midnight UTC                                     |
| Over the Free plan's 100,000 requests a day | Cloudflare's Error 1027                                   | the same; the team moves to Workers Paid, $5 a month             |
| Jev turned off                              | `503 jev_off`                                             | the same, with the degraded notice (STATE-3)                     |
| RevenueCat down, past free lines            | the check fails                                           | a cached yes still answers; otherwise `503`, never a false `402` |
| Transcription unavailable                   | `turn-listen` reports it                                  | the message, the typed field, the fallback recognizer (LISTEN-9) |
| Personal Voice denied                       | `turn-voice` reports it                                   | the system voice, with the reason (VOICE-2)                      |

### Logs and counts

- **One log line per request** from the relay: the time, the first 8
  characters of the ID's hash, the sequence number, the outcome (`answered`,
  `paywall`, `limited`, `failed`, or `off`), and the milliseconds in Jev and
  in all; never a line, phrase, place, or category (METRIC-1, PRIV-2).
- **What else is logged.** The relay turns off automatic invocation logs,
  which hold each request's details, and leaves tracing off: from October
  1, 2026, traces count against the same quota, and a trace of the
  RevenueCat call would keep the app user ID in its URL
  ([services notes][svc-logs]).
- **A script** in `worker/scripts/` reads a day of logs and prints the counts
  and latencies METRIC-2 names. The Free plan keeps logs for 3 days, so the
  team runs it daily during judging.
- **The daily check** during judging sends one typed line to the relay from
  a team member's phone or the Simulator and records the result (AVAIL-1).

[svc-logs]: /docs/research/0024-turn-services.md#workers-logs-and-traces-for-the-relay

### Service life

The relay and Jev's credits run until the winners are announced on October
21 or 22, 2026 (AVAIL-1). After that, setting `JEV_ON` to false sends every
line to the phone's own ranking, and speaking never depends on the relay.

## Evaluation

### The evaluation data

- **`eval/lines.jsonl`:** 80 partner lines, each with an id, its author, the
  text, its kind, a place, the topic, whether it concerns pain, health, or
  consent, and the ids of every acceptable reply in the starter bank, or
  none (EVAL-1). For yes-or-no lines, acceptable replies may include the
  fixed buttons.
- **New lines.** The public conversation sets are non-commercial,
  share-alike, not redistributable, or unlicensed, so the lines are written
  for Turn, by writers who haven't seen the bank, in the mix real questions
  have: about seven in ten questions yes-or-no, many of them declarative,
  such as "You're tired?", and about a fifth of lines with no acceptable
  reply. A second teammate labels the acceptable replies, and the script
  reports their agreement ([evaluation notes][eval-data]).
- **The starter bank** comes from the app's own file, so the evaluation
  ranks the phrases a user starts with. A fresh bank has no taps, so the
  shortlist's most-tapped slots fall back to the place's phrases and the
  bank's order, and the evaluation says so.
- **Who wrote them.** At the team's direction, Claude subagents wrote both
  files on September 23, 2026. Two wrote 40 lines each from a brief that
  showed no phrase of the bank ([the brief][lines-brief]), so each line's
  `author` is `claude-a` or `claude-b`; a third wrote the bank without
  seeing the lines, and a fourth read every phrase. Text a language model
  wrote may suit a ranker built on one, so the report and the README say
  who wrote the lines and the bank. On that date, no teammate had yet read
  the bank (CONTENT-1), and no clinic had reviewed it (CONTENT-5).

[eval-data]: /docs/research/0025-turn-evaluation.md#writing-turns-80-lines
[lines-brief]: /docs/plans/0011-turn-starter-content.md#appendix-the-line-writers-brief

### The rankers

| Ranker       | What it does                                                                                                                                        |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `place`      | the place's phrases in the bank's order, with no use of the line; the phone's own ranking of a line is `keyword`                                    |
| `keyword`    | the phone's own ranking over the line, which holds when no word is shared                                                                           |
| `embeddings` | `@cf/baai/bge-base-en-v1.5` with `cls` pooling: cosine similarity between the line and each phrase, with a cross-validated cut-off                  |
| `jev`        | the app's shortlist, the relay's request builder, and the row's rules                                                                               |
| `jev-rerank` | Jev over the 40 phrases nearest by Apple's sentence embedding, computed on a Mac as the phone would, run only when Jev trails `embeddings` (EVAL-4) |

- **Extras (EVAL-8).** `bge-reranker-base` over the keyword shortlist, an
  off-the-shelf cross-encoder; `qwen3-embedding-0.6b` with the instruction
  "Given what a conversation partner just said, retrieve the reply that
  answers it"; and Apple's sentence embedding, run on a Mac.
- **Embeddings measure similarity.** General-purpose embeddings trailed
  reply-trained encoders by about 25 points on a response-selection
  benchmark, and Workers AI offers no reply-trained model, so a line such as
  "How was physio?" is where keyword ranking and embeddings should fail and
  Jev should earn its place ([evaluation notes][eval-baselines]).

[eval-baselines]: /docs/research/0025-turn-evaluation.md#similarity-embeddings-and-reply-trained-embeddings

### Metrics, intervals, and thresholds

Each line is scored twice, as a pure ranking and as the row a user would
see ([evaluation notes][eval-scoring]):

| What the user sees | Line has an acceptable reply                 | Line has none    |
| ------------------ | -------------------------------------------- | ---------------- |
| One big button     | Right if acceptable, else a wrong big button | Wrong big button |
| Up to six buttons  | Right if any is acceptable, else a wrong row | Wrong row        |
| No change          | Missed reply                                 | Right hold       |

- **Ranking,** on lines with an acceptable reply only: hit at 1, hit at 6,
  and reciprocal rank, end to end and with every ranker over the same 40
  phrases, beside chance rates: with one acceptable phrase among 40, 2.5%
  at 1 and 15% at 6.
- **The row:** the six outcomes above, coverage (the share of lines where
  the row changes), risk (the share of those rows that are wrong), and an
  always-hold baseline, which is right on every line with no reply.
- **The shortlist's recall at 40:** the share of lines whose acceptable
  reply made the 40, since Jev can't pick a phrase the shortlist dropped.
- **Kind:** accuracy and a confusion matrix for the question-kind Choice,
  since a yes-or-no call brings up the fixed buttons.
- **Intervals.** Every rate carries a 95% Wilson interval: a top-6 rate of 56 of
  80 spans 59% to 79%, and a big button right on all 40 lines where it shows can
  still be wrong up to 7.2% of the time, by a one-sided 95% bound. Differences
  between two rankers use a paired bootstrap over lines, and 80 lines settle
  only gaps of about 15 to 18 points (EVAL-4) ([evaluation notes][eval-power]).
- **Frozen settings.** Jev's 0.6 and 0.85 come from TypeSafe's routing
  example, and 80 lines are too few to refit them, so they, the margin, and
  the question wording are committed before the first run (EVAL-2). Cosine
  scores aren't probabilities, so the embedding ranker's cut-off comes from
  five-fold cross-validation, reported out of fold; the keyword ranker holds
  when no word is shared, as the phone does; and every ranker's
  risk-coverage curve is plotted.
- **Latency:** each ranker's own work and network trip at the median, the
  95th percentile, and the maximum, over at least three passes with warm-up
  calls dropped and one request in flight; end-to-end time comes from the
  phone (PERF-1).

[eval-scoring]: /docs/research/0025-turn-evaluation.md#a-scoring-scheme-for-turns-80-lines
[eval-power]: /docs/research/0025-turn-evaluation.md#what-80-lines-can-and-cant-detect

### The replay script

The replay script (EVAL-7) sends the replay test's lines as text, in
conversation order, through the relay and the shared row rules, with no
microphone, and counts slot changes per line (ROW-5).

### The report

`bun run eval` writes `eval/results.md`: one row per ranker with each
metric, its interval, and the latency, plus the date, the model pin, and the
commit; the README copies the table (EVAL-6). The script also lists every
big button on a yes-or-no, pain, or consent line (EVAL-5).

## Testing

The shared code and the relay are tested with Vitest, the relay's tests
running inside the Workers runtime through `@cloudflare/vitest-plugin`, at
the [versions above](#versions-on-september-22-2026)
([Cloudflare notes][cf-notes]). The app's screens and the Swift modules are
checked on devices, by the checklist below, not with UI tests, in the first
version.

- **Unit tests,** for the shared code: the shortlist, BM25, the tag map, the
  request builder, the row's rules against recorded answers (ROW-3 to
  ROW-9), and the phone's own ranking (STATE-1).
- **Relay tests,** in the Workers runtime: validation and limits (SEC-2,
  SEC-3), the free-line count under concurrent requests (PAY-1), the
  entitlement cache and refresh (PAY-7), and every error code, with Jev and
  RevenueCat mocked.
- **A contract test** keeps a snapshot of the Jev request, and a manual
  smoke test sends one line to Jev with the team's key.
- **Device checks,** on the video's iPhone: transcription and line ends
  (LISTEN-1, LISTEN-2), Turn not hearing itself (LISTEN-3), the background
  and interruptions (LISTEN-7, LISTEN-10), Personal Voice (VOICE-2), the
  loudspeaker and the silent switch (VOICE-4), and timings (PERF-2,
  PERF-3).
- **The replay test** checks timing on the phone (PERF-1, PERF-5) and tunes
  the silence window: at least 50 recorded partner lines, each with its end
  of speech marked by hand, play from a second device to the iPhone in
  Listen mode, and the app logs each stage against `turn-listen`'s stamp of
  the line's end. It counts lines cut off before the recording's marked end.
- **Purchase checks:** each Test Store outcome, restore, and the next line
  after a purchase (PAY-4 to PAY-6).
- **Accessibility checks:** VoiceOver, Switch Control, Voice Control, the
  largest text size, Reduce Motion, and contrast (A11Y-1 to A11Y-7).
- **The privacy check:** after a 10-minute session, the app's container and
  the relay's storage and logs hold no audio, transcript, or phrase text
  (RELEASE-3).

## Environments and release

- **Local:** the relay under `wrangler dev`, the app in the Simulator or on
  a device, pointed at it by the app's configuration.
- **The team's relay:** one deployment on `workers.dev`, used by the video's
  build, the Simulator build, and judges; there is no separate staging
  relay, so risky changes are tested locally first.
- **Deploys:** `wrangler deploy` from `worker/`, after its tests pass; to undo
  one, the team deploys the previous commit again, and `JEV_ON` can turn Jev
  off at once meanwhile.
- **Debug builds only.** A Release build with a Test Store key crashes at
  launch, so every build the team ships uses the Debug configuration
  ([services notes][svc-key]).
- **The device build:** `npx expo run:ios --device` from a Mac with Xcode
  27, signed by a free Personal Team, with Developer Mode on and the
  certificate trusted on the phone. For timings and the video, Metro serves
  production JavaScript with `npx expo start --no-dev --minify`. Free
  profiles expire after seven days, so the video's build is installed on or
  after September 22 (COMPAT-4) ([iPhone build notes][ios-free-build]).
- **The Simulator build:** `xcodebuild` in the Debug configuration for the
  `iphonesimulator` SDK, from the prebuilt `ios/` workspace, with the
  JavaScript bundle embedded so it runs without Metro. That a Debug build
  runs from its embedded bundle is unverified, so the September 25 check
  covers it; if it can't, the README's Simulator path starts Metro first.
  The `.app` is zipped into a GitHub release, and the README installs it
  with `xcrun simctl install booted Turn.app` (SUBMIT-3, COMPAT-2).
- **The repository goes public** after the secret scan, with the MIT
  `LICENSE` at its root (SUBMIT-1).
- **Work outside the build.** The clinic's review (CONTENT-5) runs on the
  device build with the feature chart, and its notes go in `docs/`; the
  video (SUBMIT-4) is recorded from the device build on September 28; while
  naming is off, a search of the app's strings, the README, and the
  description finds no TypeSafe or Jev name before submission (SUBMIT-6);
  and the release checklist records each Must's check with the build it ran
  on (RELEASE-1 to RELEASE-5).

[ios-free-build]: /docs/research/0023-turn-ios.md#building-to-an-iphone-with-a-free-account

## Requirements traceability

Every PRD requirement, and the sections of this document that meet it or,
for work outside the build, such as the video or the clinic's review, say
how the team does it:

| Requirements                                                                                        | Met in                                                                                                     |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| SPEAK-1, SPEAK-2, SPEAK-3, SPEAK-4, SPEAK-5, SPEAK-6, SPEAK-7                                       | [The iPhone app], [Listening and speaking on the phone], [Data model]                                      |
| BANK-1, BANK-2, BANK-3, BANK-4, BANK-5, BANK-6, BANK-7, BANK-8, BANK-9, BANK-10                     | [Data model], [Decision pipeline], [The iPhone app]                                                        |
| PLACE-1, PLACE-2, PLACE-3                                                                           | [Data model], [Decision pipeline], [The iPhone app]                                                        |
| VOICE-1, VOICE-2, VOICE-3, VOICE-4                                                                  | [Listening and speaking on the phone], [The iPhone app]                                                    |
| CONSENT-1, CONSENT-2, CONSENT-3, CONSENT-4, CONSENT-5, CONSENT-6, CONSENT-7                         | [The iPhone app], [Relay API], [Security and privacy]                                                      |
| LISTEN-1, LISTEN-2, LISTEN-3, LISTEN-4, LISTEN-5, LISTEN-6, LISTEN-7, LISTEN-8, LISTEN-9, LISTEN-10 | [Listening and speaking on the phone], [Decision pipeline]                                                 |
| ROW-1, ROW-2, ROW-3, ROW-4, ROW-5, ROW-6, ROW-7, ROW-8, ROW-9, ROW-10                               | [Decision pipeline], [Relay API], [The iPhone app]                                                         |
| STATE-1, STATE-2, STATE-3, STATE-4                                                                  | [Decision pipeline], [Reliability and observability]                                                       |
| PAY-1, PAY-2, PAY-3, PAY-4, PAY-5, PAY-6, PAY-7, PAY-8, PAY-9, PAY-10                               | [Purchases and entitlements], [Relay API]                                                                  |
| SET-1, SET-2, SET-3, SET-4                                                                          | [The iPhone app]                                                                                           |
| CONTENT-1, CONTENT-2, CONTENT-3, CONTENT-4, CONTENT-5                                               | [Stack and repository], [The iPhone app], [Security and privacy], [Evaluation], [Environments and release] |
| EVAL-1, EVAL-2, EVAL-3, EVAL-4, EVAL-5, EVAL-6, EVAL-7, EVAL-8                                      | [Evaluation]                                                                                               |
| PERF-1, PERF-2, PERF-3, PERF-4, PERF-5                                                              | [Decision pipeline], [Testing]                                                                             |
| AVAIL-1, AVAIL-2                                                                                    | [Reliability and observability]                                                                            |
| PRIV-1, PRIV-2, PRIV-3, PRIV-4, PRIV-5                                                              | [Security and privacy], [Data model], [Listening and speaking on the phone], [Purchases and entitlements]  |
| SEC-1, SEC-2, SEC-3, SEC-4, SEC-5, SEC-6                                                            | [Security and privacy], [Relay API], [Reliability and observability]                                       |
| A11Y-1, A11Y-2, A11Y-3, A11Y-4, A11Y-5, A11Y-6, A11Y-7, A11Y-8                                      | [The iPhone app], [Testing]                                                                                |
| COMPAT-1, COMPAT-2, COMPAT-3, COMPAT-4                                                              | [Stack and repository], [Environments and release]                                                         |
| METRIC-1, METRIC-2, METRIC-3, METRIC-4                                                              | [Reliability and observability], [The iPhone app], [Purchases and entitlements]                            |
| SUBMIT-1, SUBMIT-2, SUBMIT-3, SUBMIT-4, SUBMIT-5, SUBMIT-6                                          | [Environments and release]                                                                                 |
| RELEASE-1, RELEASE-2, RELEASE-3, RELEASE-4, RELEASE-5                                               | [Testing], [Environments and release]                                                                      |

[the iphone app]: #the-iphone-app
[listening and speaking on the phone]: #listening-and-speaking-on-the-phone
[data model]: #data-model
[decision pipeline]: #decision-pipeline
[relay api]: #relay-api
[security and privacy]: #security-and-privacy
[reliability and observability]: #reliability-and-observability
[purchases and entitlements]: #purchases-and-entitlements
[stack and repository]: #stack-and-repository
[evaluation]: #evaluation
[environments and release]: #environments-and-release
[testing]: #testing

## Open technical questions

Each with a safe default; the PRD's [open questions][prd-open] cover the
product and legal ones.

- **Forty Nouls in one request.** TypeSafe's cookbooks send up to 62
  questions at once, but no published run has 40 per-candidate Nouls. Safe
  default: send one real request on September 23 and record its time and
  tokens; if it runs slow, cut the shortlist to 24 phrases.
- **Jev's undocumented limits:** a body-size limit, the status for exhausted
  credits, whether a `429` always carries `Retry-After`, and whether the
  rate limit is per key or per account. Safe default: treat any unexpected
  `4xx` as `jev_unavailable`, log it, and keep auto-refill on.
- **How long the pin lasts.** No page says when `jev-1.13.0` retires. Safe
  default: log each answer's `model`, and move to a new version only after
  the evaluation runs on it.
- **The Simulator build without Metro.** Nobody has tested whether a Debug
  build with an embedded bundle runs alone. Safe default: check on September
  25; if not, the README's Simulator path starts Metro first.
- **A one-time product in the dashboard.** Test Store's form may offer no
  such type. Safe default: create it through REST API v2 (PAY-8).
- **The Keychain after deletion.** Apple doesn't say whether Keychain items
  survive deleting the app, and Expo says not to rely on it. Safe default:
  PAY-10 stays a Should, and the README says a reinstall may reset the free
  lines and the purchase, which Restore can't bring back under Test Store.
- **Transcription on the team's phones.** Apple lists no devices, asset
  size, or latency for `SpeechTranscriber`. Safe default: test on each
  teammate's iPhone by September 24, with `DictationTranscriber` and then
  `expo-speech-recognition` behind it.
- **Personal Voice by identifier.** No Apple page says the identifier
  resolves. Safe default: the Swift module checks it, and a system voice
  speaks otherwise.
- **One clock for timings.** React Native's `performance.now()` counts from
  boot, and nobody has checked it against the Swift module's timestamps.
  Safe default: `turn-listen` stamps each line's end, and the app logs every
  later stage on the same clock after checking the two agree on a device.
- **The rate limiting binding on the Free plan.** Cloudflare states no price
  or Free plan status for it. Safe default: if it isn't available, the
  user's Durable Object counts requests per minute itself.

[prd-open]: /docs/PRD.md#open-questions

## See also

- [Product requirements](/docs/PRD.md): every requirement this document
  traces.
- [Product](/docs/PRODUCT.md): what Turn is and why.
- [Design](/docs/DESIGN.md): how the app looks, reads, and moves, which the
  sections above build.
- [Idea](/docs/IDEA.md): the schedule, the risks, and the pitch.
- [iPhone build notes][ios-notes], [relay and services notes][svc-notes],
  [evaluation notes][eval-notes], [Jev notes][jev-notes],
  [Cloudflare notes][cf-notes], [workspace notes][ws-notes], and
  [RevenueCat notes](/docs/research/0009-revenuecat-expo.md): the sources behind
  the choices here.
- [Guessling technical requirements](/docs/archive/guessling-trd.md): the
  build of the team's first idea, archived.

[ios-notes]: /docs/research/0023-turn-ios.md
[svc-notes]: /docs/research/0024-turn-services.md
[eval-notes]: /docs/research/0025-turn-evaluation.md
[jev-notes]: /docs/research/0005-jev.md
[cf-notes]: /docs/research/0010-cloudflare-workers.md
[ws-notes]: /docs/research/0031-turn-workspace.md
[ios-modules]: /docs/research/0023-turn-ios.md#two-local-swift-modules-in-expo
[svc-key]: /docs/research/0024-turn-services.md#the-test-store-api-key
[tech-expo]: /docs/research/0018-next-gen-tech.md#expo-sdk-57-sdk-58-and-xcode-27
[design-motion]: /docs/DESIGN.md#motion

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

## Decision pipeline

### The end of a line

Apple's transcriber has no end-of-utterance event, and `SpeechDetector`
reports only errors, so Turn sets its own rule
([iPhone build notes][ios-line-end]):

- **Results.** `turn-listen` keeps a volatile and a finalized transcript, as
  Apple's sample does, and treats text as settled once the analyzer's
  `resultsFinalizationTime` passes its end, not only when a result arrives
  with `isFinal`.
- **The silence rule.** When the tapped audio has stayed below a speech
  level, and no new words have arrived, for the window, the module calls
  `finalize(through: nil)` and reports the settled text as one line
  (LISTEN-2). The window starts at 0.5 seconds, the evaluation notes' budget
  for detecting the end of a turn, and the replay test tunes it against two
  pulls: a longer window slows the row (PERF-1), and a shorter one cuts the
  partner off (PERF-5) ([evaluation notes][eval-latency]).
- **Manual ends.** Done ends a spoken line at once, the same way, and a
  typed line ends when the user sends it (LISTEN-4).
- **Length.** The app keeps a line's last 300 characters (LISTEN-6).

[ios-line-end]: /docs/research/turn-ios.md#ending-the-partners-line
[eval-latency]: /docs/research/turn-evaluation.md#a-latency-target-for-turn

### Names as tags

Before a request, `turn-listen` tags the line and the 40 candidates together
(LISTEN-5):

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
  appearance, and the same
  name gets the same tag everywhere in the request.
- The candidates' ids don't change, so Jev's answers map back to the user's
  own text, and the tag map stays on the phone.
- The place's name is sent as the user wrote it, since the user chose it for
  that purpose (PLACE-3).

[ios-names]: /docs/research/turn-ios.md#swapping-names-for-tags-with-nltagger

### The shortlist

The phone picks 40 candidates, never the fixed buttons, in this order,
without duplicates (ROW-2):

1.  The phrases now in the row, up to six, so each gets a new score.
2.  Up to 24 phrases by keyword ranking over the line as heard, before any
    tags: MiniSearch's BM25+ with its defaults (k 1.2, b 0.7, d 0.5), on
    lowercased words with a list of common words dropped, since MiniSearch
    applies none itself; only phrases that share a word count
    ([iPhone build notes][ios-ranker]).
3.  Up to 8 of the user's most-tapped phrases of the last 30 days.
4.  Up to 8 of the place's phrases, most-tapped first.
5.  The rest by all-time taps, then by the grid's order, until there are 40.

At 2,000 phrases, the BM25 index is built once at launch and updated on each
edit, so a shortlist takes at most 50 milliseconds (PERF-4, BANK-7).

[ios-ranker]: /docs/research/turn-ios.md#a-phrase-ranker-in-typescript

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
        "Feelings": null,
        "Body and pain": null,
        "Food and drink": null
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
  "costs you accuracy", and more questions don't. This refines the idea,
  which puts the 40 candidates in the state
  ([services notes][svc-request]). Nouls can all come back low, which is
  how the row learns that nothing fits.
- **Keys.** `c00` to `c39` stand for the candidates in the request's order,
  and the object maps each answer back to the phone's phrase id; the key "is
  not sent to the underlying model" ([Jev notes][jev-api]).
- **The topic's options** are the user's category names, at most 12, far
  below a Choice's limit of 255, and nothing documented caps 42 questions:
  TypeSafe's own cookbooks send 54 and 62 in one request.
- **The call.** `@typesafe-ai/sdk` 0.6.0 with every option in code:
  `defaultModel: 'jev-1.13.0'`, `logLevel: 'off'`, `timeout: 1500` per
  attempt, and `retry: { maxRetries: 1, respectRetryAfter: false }`, under
  `AbortSignal.timeout(2500)`. The SDK's defaults would let one call run
  about 31.5 seconds.
- **Errors.** A `429`, a `529`, a timeout, or a `5xx` becomes
  `jev_unavailable`. Running out of credits has no documented status: the
  SDK passes a `402` as its base `APIError`, which the object logs as
  `credits` and answers as `jev_unavailable` (AVAIL-2).
- **Size and cost.** About 1,700 to 1,900 input tokens a line, more than
  the idea's estimate of 1,500, or up to about $0.00008 at $0.042 per
  million; the object logs `usage.input_tokens` and the `model` field of
  each answer, so a silent model change would show.

[svc-request]: /docs/research/turn-services.md#the-request-body-for-one-partner-line
[jev-api]: /docs/research/jev.md#the-system-one-http-api

### From probabilities to the row

The app applies these rules to each answer, with the policy the answer
carries (ROW-3 to ROW-8):

```text
on answer(a)
  if a.seq < newest seq: drop it                                   # ROW-7
  P = a.policy
  yesNo = kind yes_no is the most likely kind, at P.floor or more
  fixedOnly = yesNo, or the most likely topic is in P.fixedOnlyTopics
  fresh = candidates scoring P.floor or more, highest first
  if not fixedOnly and fresh is empty: keep the row as it is      # ROW-3
  if not fixedOnly and fresh[0] > P.bigAbove
     and the most likely topic is not in P.noBigTopics:
    show fresh[0] as the big button, remember it, and stop         # ROW-3
  if the row was a big button: put its phrase in the first free slot
    if it still scores P.floor or more                             # ROW-5
  if fixedOnly: slots 1-3 = Yes, No, Not sure                     # ROW-4
    usable = slots 4-6 if yesNo and P.yesNoPhrases, else none
  else: empty the slots the fixed buttons held; usable = all six
  each shown phrase takes its new score; below P.floor, it's stale
  for each fresh phrase not shown, highest first:
    if a usable slot is empty: take the first one
    else if a usable slot is stale: take the lowest-scoring stale one
    else if it beats the lowest shown by P.margin: take that slot  # ROW-5
    else: stop
  mark the topic's tab if the topic scores P.floor or more         # ROW-9
  render; announce the number of replies to VoiceOver              # A11Y-2
```

- **Stale phrases stay visible** until a new phrase needs their slot, so a
  line with little to say doesn't blank the row.
- **The big button** fills the row's fixed area; the six slots underneath
  keep their phrases for the next answer (ROW-1).
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
  the others 0; the place's phrases, then taps, break ties.
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

[ios-mic]: /docs/research/turn-ios.md#from-the-microphone-to-the-analyzer

### The audio session

Turn sets the shared audio session itself, since `expo-speech` never does
and the default category is silenced by the Silent switch
([iPhone build notes][ios-session]):

- **At launch:** `.playback`, so speech plays with the Silent switch set to
  silent and with the screen locked (VOICE-4).
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

[ios-session]: /docs/research/turn-ios.md#audio-session-category-mode-and-options

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

[ios-pv]: /docs/research/turn-ios.md#personal-voice

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
[ios-modules]: /docs/research/turn-ios.md#two-local-swift-modules-in-expo

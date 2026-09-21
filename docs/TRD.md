# Guessling technical requirements

How version 1.0 of Guessling is built to meet the
[product requirements](/docs/PRD.md): the architecture, the versions, the
data, the API, how questions are answered, purchases, the app, security and
privacy, reliability, tests, and release. It's written on September 22,
2026, before the code, as the contract the code is built to, and it changes
with the code. The [product](/docs/PRODUCT.md) says why, the
[idea](/docs/IDEA.md) owns the schedule and the risks, and four research
notes, on [RevenueCat in Expo][rc-notes], the [Cloudflare backend][cf-notes],
[Apple's requirements][apple-notes], and [daily puzzles][daily-notes], hold
the sources.

Contents:

1.  [Overview](#overview)
1.  [System architecture](#system-architecture)
1.  [Stack and repository](#stack-and-repository)
1.  [Data model](#data-model)
1.  [Worker API](#worker-api)
1.  [Answer pipeline](#answer-pipeline)
1.  [See also](#see-also)

## Overview

- **Scope:** version 1.0, for iPhone, as the PRD defines it. PRD IDs in
  parentheses mark where this document meets a requirement, and the
  [traceability table](#requirements-traceability) maps every ID.
- **Decisions that shape the build:**
  - An Expo app in TypeScript, with RevenueCat's SDK and Paywalls and no
    accounts: RevenueCat's anonymous app user ID is the only player ID.
  - One Cloudflare Worker is the only backend. Workers KV holds what the
    team publishes, and one Durable Object per puzzle holds what players
    generate: answers, progress, and reports.
  - Jev, pinned to `jev-1.13.0`, is called only from the Durable Object,
    with the key as a Worker secret, so neither the key nor the answer
    reaches the phone.
  - A question goes through code rules, exact bank wordings, stored
    answers, Jev's match, and only then Jev's live answer; the first step
    that answers wins, and the answer is stored for everyone.
  - The server counts plays in Workers Analytics Engine; the app has no
    analytics SDK.
- **Changing it:** anything here that turns out wrong is fixed here, in the
  same change as the code.

## System architecture

```text
+------------------------+       +------------------------------+
| iPhone app (Expo)      | HTTPS | Worker: guessling-api        |----> RevenueCat REST API v2
| RevenueCat SDK and     |------>| validate, rate-limit,        |      (Guessling+ check)
| Paywalls               |       | confirm Guessling+, route    |----> Analytics Engine
+-----------+------------+       | static /privacy /terms       |      (counts)
            |                    +--------------+---------------+
            v                                   | one object per puzzle, in wnam
+------------------------+       +--------------v---------------+       +--------------+
| App Store, RevenueCat  |       | Durable Object puzzle-<n>    |------>| Jev          |
| (purchases, paywall)   |       | answers, players, reports    |       | (TypeSafe,   |
+------------------------+       +--------------+---------------+       | us-west-2)   |
                                                |                       +--------------+
                                 +--------------v---------------+
                                 | Workers KV                   |
                                 | puzzles, banks, config       |
                                 +------------------------------+
```

What each part owns:

- **The app** shows the round, keeps its history on the device, holds the
  notice choice, and sells Guessling+ through RevenueCat. It talks only to
  the Worker, and to Apple and RevenueCat through the SDK.
- **The Worker** is the only public API, on the team's own domain. It
  checks headers and lengths, applies the burst limit, confirms Guessling+
  with RevenueCat before an archive puzzle, sends puzzle requests to the
  puzzle's Durable Object, writes counts, and serves the config, today's
  puzzle, the archive list, and the policy pages.
- **The Durable Object** for each puzzle runs the answer pipeline, keeps the
  puzzle's answers, players' progress, and reports, and is the only caller
  of Jev. It's created with `locationHint: "wnam"`, near TypeSafe's servers
  in AWS us-west-2 ([Cloudflare notes][cf-latency]).
- **Workers KV** holds the published puzzles, the banks, and the config.
- **Jev** matches questions to the bank and answers the rest.
- **RevenueCat** runs purchases, the paywall, entitlements, and the charts.
- **The scripts** check, publish, test, and fix puzzles, and pull reports
  and counts.

The path of one question:

1.  The app sends `POST /v1/puzzles/<n>/ask` with a new `requestId`.
2.  The Worker checks the headers and the text's length, applies the
    player's burst limit, confirms Guessling+ if `n` is an archive puzzle,
    and passes the request to `puzzle-<n>`.
3.  The object runs the [answer pipeline](#answer-pipeline), calling Jev
    only if nothing stored or computed answers it.
4.  The object stores the answer and the player's new turn count, and
    returns the response.
5.  The Worker writes a count if the player allowed it and returns the
    response; the app shows the Guessling's reaction and adds the answer to
    the round's history.

[cf-latency]: /docs/research/cloudflare-workers.md#latency-and-placement

## Stack and repository

### Versions on September 22, 2026

| Part               | Choice                                                      | Why                                                   |
| ------------------ | ----------------------------------------------------------- | ----------------------------------------------------- |
| App framework      | Expo SDK 57 (`expo` 57.0.24), React Native 0.86.3           | The latest stable SDK; SDK 58 is a beta               |
| Language           | TypeScript, in the app, the Worker, and the scripts         | One language, as the idea chose                       |
| Minimum iOS        | 16.4, Expo SDK 57's floor                                   | Every device then uses StoreKit 2 (COMPAT-1)          |
| Build image        | EAS `macos-tahoe-26.5-xcode-26.6`, pinned                   | Xcode 26.6 with the iOS 26.5 SDK (COMPAT-2)           |
| Purchases          | `react-native-purchases` and `-ui` 10.10.1                  | RevenueCat's SDK and Paywalls; needs a dev build      |
| Backend            | Cloudflare Workers Paid, Wrangler 4.136.1, `wrangler.jsonc` | Free caps 100,000 requests a day and 10 ms of CPU     |
| Jev client         | `@typesafe-ai/sdk` 0.6.0, every option set in code          | Runs in a Worker; its defaults wait too long          |
| Jev model          | `jev-1.13.0`, pinned                                        | An alias "moves when a new release ships"             |
| Worker tests       | `@cloudflare/vitest-plugin` 1.2.1 with Vitest 4.1           | The plugin needs Vitest 4.1, not 5                    |
| Jev mocks in tests | `@msw/cloudflare` 0.0.1 with `msw` 2.14 or later            | Cloudflare's documented way to mock outbound requests |
| Package manager    | Bun, already used by this repository                        |                                                       |

- The Worker's `compatibility_date` is the day the project starts. From
  2026-08-04 on, Node.js compatibility is on by default and fills
  `process.env` with the Worker's variables, which Jev's SDK reads, so the
  Worker passes every SDK option in code
  ([Cloudflare notes][cf-nodejs]).
- No `expo-updates` in version 1.0: it would add Crash Data to the privacy
  label, and fixes to behavior need review anyway
  ([RevenueCat notes on EAS Update][rc-eas-update]).

[cf-nodejs]: /docs/research/cloudflare-workers.md#nodejs-compatibility-by-default
[rc-eas-update]: /docs/research/revenuecat-expo.md#eas-update-and-app-store-rules

### Repository layout

The code lives in this repository, beside `docs/`, as Bun workspaces:

```text
app/          The Expo app: screens, round state, purchases
worker/       The Worker, the PuzzleDay Durable Object, and static pages
  public/     privacy.html, terms.html, support.html
content/
  banks/      One bank per category: animal.json, food.json, object.json, place.json
  puzzles/    One file per puzzle: 011-octopus.json
  review/     The checking script's output, one CSV per puzzle
  tests/      The paraphrase sets for the consistency test
scripts/      check.ts, publish.ts, consistency.ts, reports.ts, forget.ts, stats.ts
```

## Data model

Three stores hold everything: Workers KV for what the team publishes, one
Durable Object per puzzle for what players generate, and the device for the
player's own round. The types below are the contract between the scripts,
the Worker, and the app.

### Published data in Workers KV

KV can take "up to 60 seconds or more" to show a change everywhere, caches
missing keys too, and allows one write a second per key
([Cloudflare notes][cf-kv-publish]). So a published puzzle revision never
changes: a fix is a new revision, and a small pointer names the live one.

| Key                     | Value                              | Written by            |
| ----------------------- | ---------------------------------- | --------------------- |
| `puzzle:<n>:<rev>`      | `Puzzle`, as JSON; never rewritten | `publish.ts`          |
| `live:<n>`              | The live revision of puzzle `n`    | `publish.ts`          |
| `bank:<category>:<ver>` | `Bank`, as JSON; never rewritten   | `publish.ts`          |
| `config`                | `AppConfig`, as JSON               | `publish.ts --config` |

The Worker reads revisions with a `cacheTtl` of a day, and pointers and the
config with the default 60 seconds.

```ts
type Category = 'animal' | 'food' | 'object' | 'place'

interface Bank {
  category: Category
  version: number // a Puzzle names the version it was checked against
  questions: { id: string; text: string; not: string }[] // at most 127 (CONTENT-5)
}

interface Puzzle {
  number: number // 1–10 are starters; 11 is 2026-09-24 (TODAY-3)
  date: string | null // YYYY-MM-DD for a daily puzzle, null for a starter
  category: Category
  hint: string // "An animal"
  display: string // the name the reveal shows: "Octopus"
  names: string[] // accepted names, normalized: ["octopus", "octopuses", "octopi"]
  card: { thing: string; facts: string[] } // the state Jev reads; at most 40 facts
  bankVersion: number
  checked: Record<string, 'yes' | 'no'> // every bank id and `${id}_not` (CONTENT-4)
}

interface AppConfig {
  notice: { version: number; provider: string; title: string; body: string } // NOTICE-2, NOTICE-5
  links: { privacy: string; terms: string; support: string }
  aiEnabled: boolean // the kill switch for live answers
  minAppVersion: string
}
```

[cf-kv-publish]: /docs/research/cloudflare-workers.md#publishing-tomorrows-puzzle-ahead-of-time

### Player data in each puzzle's Durable Object

One object per puzzle number, named `puzzle-<n>`, keeps that puzzle's
answers, players' progress, and reports in its SQLite storage, which new
namespaces must use:

```sql
CREATE TABLE answers (
  wording    TEXT PRIMARY KEY, -- the normalized question, with no player ID
  answer     TEXT NOT NULL,    -- 'yes' | 'no' | 'rephrase' | 'not_question'
  source     TEXT NOT NULL,    -- 'bank' | 'live'
  bank_id    TEXT,             -- the matched entry, such as 'q017' or 'q017_not'
  p          REAL,             -- the probability that decided it
  model      TEXT NOT NULL,    -- 'jev-1.13.0'
  created_at INTEGER NOT NULL
);

CREATE TABLE players (
  player        TEXT PRIMARY KEY, -- SHA-256 of PLAYER_SALT and the app user ID
  turns         INTEGER NOT NULL DEFAULT 0,
  free_inputs   INTEGER NOT NULL DEFAULT 0, -- answers that used no turn (ASK-10)
  status        TEXT NOT NULL DEFAULT 'playing', -- 'playing' | 'solved' | 'lost'
  last_request  TEXT,  -- the last request ID, for retries (STATE-2)
  last_response TEXT,  -- the JSON sent for it
  created_at    INTEGER NOT NULL,
  updated_at    INTEGER NOT NULL
);

CREATE TABLE reports (
  id         INTEGER PRIMARY KEY,
  wording    TEXT NOT NULL,
  answer     TEXT NOT NULL,
  reason     TEXT,             -- 'wrong' | 'unclear' | NULL
  created_at INTEGER NOT NULL
);
```

- Only wordings from players who allowed AI answers go into `answers`
  (NOTICE-3). Code-rule answers, such as letter questions, aren't stored,
  since code gives the same answer every time.
- No table holds question text next to a player: `players` has counts, and
  `answers` and `reports` have wordings without IDs (PRIV-3).

### What the device keeps

The app keeps these in a key-value store on the device, never on the
server:

| Key            | Value                                                    |
| -------------- | -------------------------------------------------------- |
| `consent`      | `{ choice: 'on' \| 'off', version: number }` (NOTICE-4)  |
| `round:<n>`    | The round's questions, answers, turns, and status        |
| `streak`       | `{ current, best, lastSolved: 'YYYY-MM-DD' }` (STREAK-1) |
| `stats`        | `{ played, solved }` (END-5)                             |
| `settings`     | `{ sound: boolean, haptics: boolean }` (SET-2)           |
| `reported:<n>` | The wordings reported on puzzle `n` (REPORT-3)           |

## Worker API

The app talks only to the Worker, over HTTPS, in JSON. Every request carries
these headers:

- `X-Guessling-Player`: the RevenueCat app user ID; the Worker hashes it
  before storing anything.
- `X-Guessling-AI`: `on` or `off`, the player's notice choice (NOTICE-3).
- `X-Guessling-Version`: the app's version, so the Worker can ask an old
  build to update.
- `X-Guessling-Refresh: 1`, only on the first archive request after a
  purchase or restore, to skip the entitlement cache (PAY-5).

| Method and path                      | What it does                                        | Guessling+  |
| ------------------------------------ | --------------------------------------------------- | ----------- |
| `GET /v1/config`                     | The notice, the policy links, and the kill switch   | No          |
| `GET /v1/today?date=YYYY-MM-DD`      | Today's puzzle for the device's date, with progress | No          |
| `GET /v1/archive`                    | Every past puzzle's number, date, and hint          | No          |
| `GET /v1/puzzles/<n>`                | An archive puzzle, with progress                    | Yes         |
| `GET /v1/puzzles/<n>/bank`           | The category's bank questions, for the list         | For archive |
| `POST /v1/puzzles/<n>/ask`           | Answers a question                                  | For archive |
| `POST /v1/puzzles/<n>/guess`         | Decides a guess                                     | For archive |
| `POST /v1/puzzles/<n>/reports`       | Stores a report                                     | No          |
| `GET /privacy`, `/terms`, `/support` | The policy and support pages, as static assets      | No          |

"For archive" means the Worker confirms Guessling+ when `n` isn't today's
puzzle for the player and isn't a round they started before midnight
(TODAY-5). A puzzle's view never includes `names` or `card`; the end of a
round adds `reveal`:

```ts
interface PuzzleView {
  number: number
  date: string | null
  hint: string
  turnsLeft: number // 20 minus turns used
  status: 'playing' | 'solved' | 'lost'
  reveal?: { display: string } // only once status isn't 'playing' (END-2)
}
```

Asking and guessing:

```ts
// POST /v1/puzzles/<n>/ask
interface AskRequest {
  requestId: string // a UUID per question; a retry resends the same one (STATE-2)
  text?: string // 1–140 characters (ASK-1)
  bankId?: string // instead of text, a question picked from the list (ASK-9)
}

// POST /v1/puzzles/<n>/guess
interface GuessRequest {
  requestId: string
  text: string // 1–60 characters (GUESS-1)
}

interface TurnResponse {
  answer: 'yes' | 'no' | 'rephrase' | 'not_question' | 'pick' | 'rest' | 'right' | 'wrong'
  turnsLeft: number
  status: 'playing' | 'solved' | 'lost'
  reveal?: { display: string }
}
```

- `rephrase` shows "Ask another way", `not_question` shows "Ask a yes-or-no
  question", `pick` brings up the question list for a player with AI
  answers off, and `rest` says the player has used the 40 answers that
  don't use a turn (ASK-10). None of the four uses a turn.
- `right` and `wrong` answer a guess, or a question that names an accepted
  name (GUESS-4); both use a turn.

Errors come back as `{ "error": { "code": string, "message": string } }`:

| Status | Code          | When                                                            |
| ------ | ------------- | --------------------------------------------------------------- |
| 400    | `bad_request` | A missing header, or text over its limit                        |
| 403    | `needs_plus`  | An archive puzzle without a confirmed Guessling+                |
| 404    | `not_found`   | A puzzle that isn't published, or a date not yet today anywhere |
| 409    | `finished`    | A turn on a round that has ended                                |
| 426    | `update`      | An app version below `minAppVersion`                            |
| 429    | `slow_down`   | A player over the burst limit (SEC-3)                           |
| 503    | `busy`        | Jev didn't answer in time and no stored answer fits (STATE-3)   |
| 503    | `unconfirmed` | RevenueCat couldn't confirm Guessling+ (STATE-5)                |

Admin routes, for the team's scripts only, need `Authorization: Bearer`
with the `ADMIN_TOKEN` secret:

- `GET /v1/admin/reports?number=<n>` lists a puzzle's reports (REPORT-2).
- `POST /v1/admin/puzzles/<n>/forget` deletes stored answers for given
  wordings after a fix, and refuses while the puzzle's day hasn't ended
  everywhere (CONTENT-8).
- `GET /v1/admin/stats?from=YYYY-MM-DD&to=YYYY-MM-DD` returns the counts
  behind the idea's numbers (METRIC-5).

## Answer pipeline

The puzzle's Durable Object answers every question, so one object decides
each wording once (ASK-5). It checks, in this order, and stops at the first
step that answers:

1.  **Limits.** The round must be playing, with turns left; a player past 40
    answers that used no turn gets `rest` (ASK-10). A repeated `requestId`
    gets the stored response again (STATE-2).
2.  **Normalize.** Lowercase, trim, collapse spaces, drop a final `?`, `.`,
    or `!`, and straighten curly quotes. The result is the _wording_.
3.  **A named guess.** A wording shaped "is it a/an/the X" whose X,
    normalized the same way, is an accepted name is `right` (GUESS-4).
4.  **Letters.** A wording about the name's letters, such as its first or
    last letter, a letter it contains, or its length, is answered in code
    from `display` (ASK-7); one the rules can't parse is `rephrase`.
5.  **An exact bank wording.** A wording equal to a bank question, or its
    negation, after normalization gets the checked answer, with no Jev call.
    A `bankId` from the list takes the same path (ASK-9).
6.  **Stored.** A wording in `answers` gets the stored answer (ASK-5).
7.  **No AI.** With `X-Guessling-AI: off`, or `aiEnabled` false, stop with
    `pick`, and store nothing (NOTICE-3, ASK-9).
8.  **Jev.** The match request, then, if nothing matched, the live request;
    both below.
9.  **Store.** Insert the answer under the wording if no answer is there
    yet, and return what storage then holds, `rephrase` and `not_question`
    included.

### Sharing one Jev call per wording

A `fetch` inside a Durable Object lets other requests run while it waits, so
two players who send the same new wording at once could each start a Jev
call and get different answers; the Cloudflare note's local test did
exactly that ([Cloudflare notes][cf-concurrency]). The object therefore
keeps pending calls in memory, keyed by wording, and a second request awaits
the first one's promise:

```ts
private inflight = new Map<string, Promise<Answer>>()

private answerViaJev(wording: string, text: string): Promise<Answer> {
  let pending = this.inflight.get(wording)
  if (pending === undefined) {
    pending = this.askJev(text) // the match request, then the live request
      .then((answer) => {
        this.sql.exec(
          'INSERT OR IGNORE INTO answers (wording, answer, source, bank_id, p, model, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          wording, answer.answer, answer.source, answer.bankId, answer.p, MODEL, Date.now()
        )
        return this.stored(wording) ?? answer // everyone gets what storage holds
      })
      .finally(() => this.inflight.delete(wording))
    this.inflight.set(wording, pending)
  }
  return pending
}
```

Losing the map when the object is evicted is safe, since answered wordings
are in storage. A failed call rejects every waiting request, which the app
shows as busy.

[cf-concurrency]: /docs/research/cloudflare-workers.md#concurrent-first-answers-to-a-new-wording

### The match request

The first request's state is the player's question. A Choice picks the bank
entry that asks the same thing, and a Noul checks that it's a yes-or-no
question at all. With at most 127 questions, their negations, and "none",
the Choice stays within its 255 options.

```json
{
  "model": "jev-1.13.0",
  "state": "Is it something that lives in the sea?",
  "questions": {
    "match": {
      "type": "choice",
      "instructions": "Which question asks the same thing as the text? Choose none if no question does.",
      "criteria": {
        "q017": "Does it live in water?",
        "q017_not": "Does it live out of water?",
        "none": "No question here asks the same thing"
      }
    },
    "is_question": {
      "type": "noul",
      "instructions": "The text is a question that can be answered yes or no",
      "criteria": {
        "true": "A yes-or-no question, such as 'Does it fly?' or 'Is it bigger than a car?'",
        "false": "A statement, a command, an open question such as 'What color is it?', or not a question"
      }
    }
  }
}
```

- `is_question` below 0.5 gives `not_question` (ASK-4).
- Otherwise, a `match` choice other than `none` whose probability is at
  least `MATCH_MIN` gives that entry's checked answer (ASK-6). `MATCH_MIN`
  starts at 0.6, and the consistency test sets it on September 24:
  at least 90% of paraphrases must reach the right entry and at most 5% of
  questions outside the bank may match (CONTENT-6).

### The live request

When nothing matched, the second request's state is the puzzle's card, and
one Noul asks the player's question as written:

```json
{
  "model": "jev-1.13.0",
  "state": {
    "thing": "octopus",
    "facts": ["An octopus lives in the sea.", "An octopus has eight arms."]
  },
  "questions": {
    "answer": { "type": "noul", "instructions": "Is it something that lives in the sea?" }
  }
}
```

- Above 0.7 is `yes`, below 0.3 is `no`, and anything between is
  `rephrase`, the idea's thresholds (ASK-12).
- Neither request carries the player's ID, device, or address (PRIV-2).

### Timeouts, retries, and the Jev budget

The SDK's defaults, 10 seconds per attempt and two retries, could hold a
player for about 31.5 seconds, so the Worker sets every option in code and
bounds the whole question ([Cloudflare notes][cf-sdk]):

```ts
const client = new TypeSafeClient({
  apiKey: env.TYPESAFE_API_KEY,
  defaultModel: 'jev-1.13.0',
  logLevel: 'off', // at 'debug' it would log request bodies, which hold the card
  timeout: 1500, // per attempt
  retry: { maxRetries: 1 }
})

// One budget for the match and live requests together.
const budget = AbortSignal.timeout(3000)
const match = await client.systemOne(matchRequest, { signal: budget })
```

- Past the budget, the Worker answers `busy` and stores nothing, so the
  next attempt can still reach Jev (STATE-3, PERF-2).
- Each object counts its Jev calls per minute in memory and answers `busy`
  for new wordings past 600, so the two or three live dates stay under
  TypeSafe's 1,200 requests a minute (AVAIL-2, SEC-3).
- Errors are logged by class and status only, never by message, since an
  open issue reports the key echoed into the SDK's connection errors
  (SEC-4).

[cf-sdk]: /docs/research/cloudflare-workers.md#the-sdk-under-workerd

## See also

- [Product requirements](/docs/PRD.md): every requirement this document
  traces.
- [Product](/docs/PRODUCT.md): what Guessling is and why.
- [Idea](/docs/IDEA.md): the schedule, the risks, and the pitch.
- [RevenueCat notes][rc-notes], [Cloudflare notes][cf-notes],
  [Apple notes][apple-notes], and [daily puzzle notes][daily-notes]: the
  sources behind the choices here.
- [Jev notes](/docs/research/jev.md): the API, the SDKs, the limits, and the
  terms.

[rc-notes]: /docs/research/revenuecat-expo.md
[cf-notes]: /docs/research/cloudflare-workers.md
[apple-notes]: /docs/research/apple-requirements.md
[daily-notes]: /docs/research/daily-puzzles.md

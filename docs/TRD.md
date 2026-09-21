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
1.  [Puzzle days and content tooling](#puzzle-days-and-content-tooling)
1.  [Purchases and entitlements](#purchases-and-entitlements)
1.  [The iPhone app](#the-iphone-app)
1.  [Security and privacy](#security-and-privacy)
1.  [Reliability and observability](#reliability-and-observability)
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

## Puzzle days and content tooling

### Dates and numbers

- **Numbering.** Starters are #1 to #10 and have no date. Daily puzzle `n`,
  from #11 on, belongs to September 13, 2026 plus `n` days, so #11 is
  Thursday, September 24 and #17 is Wednesday, September 30 (TODAY-3).
- **Today.** The app sends the device's local date (TODAY-2). A date is
  today somewhere from 10:00 UTC the day before until 12:00 UTC the day
  after, about 50 hours, so the Worker accepts a date only in that window
  ([Cloudflare notes][cf-dates]):

```ts
function isPlayableDate(localDate: string, now = Date.now()): boolean {
  const earliest = new Date(now - 12 * 3_600_000).toISOString().slice(0, 10)
  const latest = new Date(now + 14 * 3_600_000).toISOString().slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(localDate) && localDate >= earliest && localDate <= latest
}
```

- **Past midnight.** A player with a round still `playing` on puzzle `n`
  may keep taking turns on it, without Guessling+, until 12:00 UTC two days
  after `n`'s date. That's at least 24 hours after their local midnight in
  every time zone (TODAY-5).
- **The archive.** For a player, the archive is the starters plus every
  daily puzzle dated before their device's date (ARCHIVE-1).
- **A day ends everywhere** at 12:00 UTC on the day after the puzzle's date,
  when UTC−12 reaches midnight. Only then can a stored answer change
  (CONTENT-8).
- **The clock.** In a deployed Worker, `Date.now()` moves only on I/O,
  which is close enough for choosing a date.

[cf-dates]: /docs/research/cloudflare-workers.md#choosing-todays-puzzle-for-a-players-date

### From draft to published puzzle

The content lives in the repository as JSON, and the scripts, run with Bun,
take a puzzle from draft to published:

1.  **`check.ts <n>`** asks Jev every bank question and its negation, with
    the card as the state, several questions per request and at most eight
    requests at once, since TypeSafe's own cookbook notes the public
    endpoint "rate-limits above roughly eight" ([Cloudflare notes][cf-fetch]).
    It writes
    `content/review/<n>.csv` with each probability and flags every answer
    between 0.3 and 0.7 and every pair whose answers agree when they should
    differ (CONTENT-4).
2.  **A person** fills in `checked` for every flagged entry and copies the
    clear answers as they stand.
3.  **`publish.ts <n>`** refuses a puzzle unless every bank id and negation
    is checked, the names are normalized, the date matches the number, the
    card has at most 40 facts, and the bank at most 127 questions
    (CONTENT-3, CONTENT-5). It then writes `puzzle:<n>:<rev>` and points
    `live:<n>` at it, with `wrangler kv key put --remote`, since Wrangler 4
    writes to local storage without that flag. A daily puzzle goes up at
    least two days before its date (CONTENT-2).
4.  **`consistency.ts <category>`** sends the category's paraphrase set
    through the match request and reports the share that reach the right
    entry and the share of questions outside the bank that match anything,
    saved with the date, the model, and the bank version (CONTENT-6,
    METRIC-4).

The first two puzzles are the pilot: they show how many answers a person
must fix, and the idea's [bank rule][idea-stack] applies if that's too
many. The schedule is reviewed against the content rules before each
puzzle is published (CONTENT-7, CONTENT-9).

[cf-fetch]: /docs/research/cloudflare-workers.md#calling-the-system-one-api-with-fetch
[idea-stack]: /docs/IDEA.md#stack-and-data-flow

### Fixing a puzzle after its day

1.  `reports.ts <n>` lists a puzzle's reports from the admin route
    (REPORT-2).
2.  A person corrects `checked` or the card, reruns `check.ts`, and
    publishes a new revision; `live:<n>` moves only after the day has ended
    everywhere.
3.  `forget.ts <n> <wording>...` deletes the corrected wordings' stored
    answers, which the Worker allows only once the day has ended
    everywhere. Archive players then get the fixed answer (ARCHIVE-3).

## Purchases and entitlements

### RevenueCat and App Store Connect setup

| Item                | Value                                                                    |
| ------------------- | ------------------------------------------------------------------------ |
| Entitlement         | lookup key `plus`, shown to players as Guessling+                        |
| Products            | `guessling_plus_yearly` at $19.99 and `guessling_plus_monthly` at $2.99  |
| Subscription group  | Guessling+, with both products at the same level                         |
| Introductory offer  | a 3-day free trial on the yearly product                                 |
| Offering            | `default`, with the `$rc_annual` and `$rc_monthly` packages              |
| Paywall             | one RevenueCat Paywall on `default`, yearly preselected (PAY-1, PAY-2)   |
| In-App Purchase Key | uploaded to RevenueCat, which StoreKit 2 needs to record transactions    |
| Sandbox access      | "Anybody", at least until approval, since App Review buys in the sandbox |

- The paywall is built in RevenueCat's editor with Close ("Navigate back"),
  Restore Purchases, Terms of Use, and Privacy Policy buttons, since
  current paywalls ignore `displayCloseButton` (PAY-3). Keeping both
  products at one level means an offer code on either is never a
  downgrade.
- The Worker needs the entitlement's object ID, such as `entla1b2c3d4e5`,
  not its lookup key; `GET /v2/projects/{project_id}/entitlements` lists
  both ([RevenueCat notes][rc-v2-ids]).

[rc-v2-ids]: /docs/research/revenuecat-expo.md#rest-api-v2-customer-and-active-entitlements

### Purchases in the app

- `Purchases.configure({ apiKey })` runs once at launch with the public
  `appl_` key from `EXPO_PUBLIC_RC_IOS_KEY`; with no `appUserID`, the SDK
  makes an anonymous ID, `$RCAnonymousID:` and 32 lowercase hex
  characters, which the app sends as `X-Guessling-Player`.
- `Purchases.addCustomerInfoUpdateListener` keeps an `isPlus` flag, true
  while `customerInfo.entitlements.active.plus` exists. It drives the locks
  in the archive; the Worker still decides access (ARCHIVE-4).
- "Play yesterday's?" and a locked archive puzzle call
  `RevenueCatUI.presentPaywall()` (PAY-4). On `PURCHASED` or `RESTORED`,
  the app sends its next archive request with `X-Guessling-Refresh: 1` and
  opens the puzzle (PAY-5).
- Settings calls `Purchases.restorePurchases()` only from the Restore
  Purchases tap, since a programmatic restore can prompt for sign-in
  (PAY-6). Redeem Code calls `Purchases.presentCodeRedemptionSheet()`
  (PAY-8).
- When the app returns to the foreground, it calls `getCustomerInfo()`, so
  a code redeemed through its link shows up without a restart; Restore
  Purchases is the fallback (PAY-7).
- A reinstall gets a new anonymous ID; Restore Purchases, with RevenueCat's
  default transfer behavior, merges the old and new IDs.

### The server's entitlement check

The Worker asks RevenueCat's API v2 for the player's active entitlements,
with a v2 secret key limited to `customer_information:customers:read`,
which allows 480 requests a minute. API v1 would create a customer for any
unknown ID, and a v2 `404` means RevenueCat has never seen the ID
([RevenueCat notes][rc-v2]).

```ts
const ANONYMOUS_ID = /^\$RCAnonymousID:[a-z0-9]{32}$/

export async function hasGuesslingPlus(appUserId: string, env: Env): Promise<boolean> {
  if (!ANONYMOUS_ID.test(appUserId)) return false
  const url =
    `https://api.revenuecat.com/v2/projects/${env.RC_PROJECT_ID}` +
    `/customers/${encodeURIComponent(appUserId)}/active_entitlements`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${env.RC_SECRET_KEY}` } })
  if (res.status === 404) return false // RevenueCat has never seen this ID
  if (!res.ok) throw new Unconfirmed(res.status) // answered as 503 unconfirmed (STATE-5)
  const body = (await res.json()) as { items: { entitlement_id: string; expires_at: number | null }[] }
  return body.items.some(
    (e) => e.entitlement_id === env.RC_ENTITLEMENT_ID && (e.expires_at === null || e.expires_at > Date.now())
  )
}
```

- A yes is cached, by the hashed ID, until the entitlement expires or for
  15 minutes, whichever comes first; a no for 1 minute. The refresh header
  skips the cache.
- An app user ID works like a bearer value: nothing ties it to a device.
  Guessing one is impractical, but a player who shares theirs shares
  Guessling+, which the team accepts.

[rc-v2]: /docs/research/revenuecat-expo.md#rest-api-v2-customer-and-active-entitlements

### The judges' offer code

- Once the app is Ready for Sale, the team creates a custom offer code on
  the monthly product: one month free, auto-renewal off, open to new,
  existing, and expired subscribers, with a redemption limit of a few
  dozen. Codes can take up to an hour to work (PAY-7).
- Judges get the redemption link, in the format RevenueCat documents,
  rather than the in-app sheet, which RevenueCat calls "extremely
  unstable":

```text
https://apps.apple.com/redeem?ctx=offercodes&id={apple_app_id}&code={code}
```

- Before approval, sandbox codes, created in batches of 10 or more, test
  the same flow in a TestFlight build through the Sandbox Account settings
  (RELEASE-2) ([RevenueCat notes on offer codes][rc-codes]).

[rc-codes]: /docs/research/revenuecat-expo.md#apple-offer-codes

## The iPhone app

### Screens and navigation

Expo Router, with one stack:

| Route         | Screen                                                                 | Requirements           |
| ------------- | ---------------------------------------------------------------------- | ---------------------- |
| `/`           | Today: the Guessling, the hint, turns, the history, the question field | TODAY, ASK, GUESS, END |
| `/notice`     | The AI notice, as a modal before the first question                    | NOTICE                 |
| `/archive`    | The archive list, with locks for players without Guessling+            | ARCHIVE                |
| `/puzzle/[n]` | An archive round or a round open past midnight, on the Today component | ARCHIVE-3, TODAY-5     |
| `/settings`   | AI answers, restore, redeem, policy links, support, version, switches  | SET, PAY-6, PAY-8      |
| Paywall       | `RevenueCatUI.presentPaywall()`, a native modal                        | PAY                    |

### State, storage, and time

- A round's state lives in one reducer per puzzle, saved to the device's
  key-value store after every answer (TODAY-4); the server holds only the
  turn count and status.
- The app works out today's date from the device's time zone when it
  starts, when it returns to the foreground, and at local midnight, and
  moves to the new puzzle then, keeping a round still open (TODAY-2,
  TODAY-5).
- The streak and the statistics are computed on the device from the saved
  rounds (STREAK-1, STREAK-2, END-5).

### Networking

- One `api.ts` module adds the headers, parses errors into the codes of the
  [Worker API](#worker-api), and gives each request 5 seconds before it
  shows the offline or busy state (PERF-2).
- A question gets a `requestId` from `expo-crypto`'s `randomUUID()` when
  it's typed, and is kept with the round until an answer arrives. "Send
  again" resends the same ID, so a retry never costs a second turn
  (STATE-1, STATE-2).
- The question field is disabled while a request is pending (ASK-8).

### The notice, sharing, and settings

- `/notice` shows the text from `GET /v1/config` with two buttons of equal
  weight; the choice and the notice's version go to the device store, and a
  newer version brings the modal back before the next question (NOTICE-1,
  NOTICE-4, NOTICE-5).
- Share builds the text of SHARE-1 on the device from the round's history
  and opens `Share.share({ message })`; no photo-library access is needed
  (SHARE-1, SHARE-2, SHARE-3).
- The privacy policy, the terms, and support open in Safari with
  `Linking.openURL`, not in a browser inside the app, which would change the
  age rating's web-access answer (SET-1, STORE-4).

### Reactions, sound, and haptics

- The Guessling is four poses, nod, head shake, shrug, and celebration,
  animated with Reanimated. With Reduce Motion on, `useReducedMotion()`
  swaps the motion for a fade between poses (ASK-2, A11Y-3).
- Sounds play in the ambient audio category, so the silent switch mutes
  them and the player's music keeps playing; a light haptic marks each
  answer and a success haptic the solve. Both follow Settings' switches
  (SET-2) ([Apple notes on sound][apple-sound]).

[apple-sound]: /docs/research/apple-requirements.md#sound-and-the-silent-switch

### Accessibility

- Every answer shows its word, and the Guessling's image carries the answer
  as its accessibility label; `AccessibilityInfo.announceForAccessibility`
  reads each new answer (A11Y-1, A11Y-4).
- Text uses the system's Dynamic Type sizes, and screens scroll rather than
  truncate at the largest sizes (A11Y-2).
- Colors come from one theme with light and dark variants, and text keeps a
  contrast of at least 4.5 to 1 (A11Y-5).
- The paywall is RevenueCat's native view; the VoiceOver and Larger Text
  checks run on it too, since a label can be claimed only if the purchase
  works with that feature (A11Y-6).

### Build configuration

`app.config.ts`:

```ts
export default {
  name: 'Guessling',
  slug: 'guessling',
  orientation: 'portrait',
  ios: {
    bundleIdentifier: 'com.<team>.guessling',
    supportsTablet: false, // iPhone only, the default (COMPAT-1)
    config: { usesNonExemptEncryption: false } // HTTPS through the system only
  },
  plugins: ['expo-router']
}
```

- `ios.deploymentTarget` stays at SDK 57's 16.4 (COMPAT-1).
- Expo aggregates its modules' privacy manifests; if Apple emails about a
  missing required reason after an upload, the reason goes into
  `ios.privacyManifests` ([RevenueCat notes on privacy manifests][rc-pm]).
- The app still runs on iPad at phone resolution, so every screen, the
  share sheet and the paywall included, is checked on an iPad simulator
  (COMPAT-3).

[rc-pm]: /docs/research/revenuecat-expo.md#privacy-manifests-in-expo

## Security and privacy

### Secrets and configuration

| Name                     | Kind          | Holds                                                 |
| ------------------------ | ------------- | ----------------------------------------------------- |
| `TYPESAFE_API_KEY`       | Worker secret | Jev's key (SEC-1)                                     |
| `RC_SECRET_KEY`          | Worker secret | RevenueCat v2 key, read-only on customers (SEC-1)     |
| `PLAYER_SALT`            | Worker secret | The salt for hashing player IDs                       |
| `ADMIN_TOKEN`            | Worker secret | The admin routes' bearer token                        |
| `ALERT_WEBHOOK_URL`      | Worker secret | Where the daily check posts a failure (AVAIL-3)       |
| `RC_PROJECT_ID`          | Worker var    | RevenueCat's project ID                               |
| `RC_ENTITLEMENT_ID`      | Worker var    | The Guessling+ entitlement's object ID                |
| `MATCH_MIN`              | Worker var    | The match threshold, 0.6 until the consistency test   |
| `EXPO_PUBLIC_API_URL`    | App, public   | The Worker's address on the team's domain             |
| `EXPO_PUBLIC_RC_IOS_KEY` | App, public   | RevenueCat's `appl_` key; `test_` only in development |

- The five secrets are listed in `wrangler.jsonc` under `secrets.required`,
  so a deploy without one fails. `EXPO_PUBLIC_` values are "visible in
  plain-text in your compiled application", so nothing secret goes there.
- The EAS development profile is the only one with the `test_` key;
  preview, TestFlight, and review builds are release builds, which crash on
  purpose with it, and a build script refuses a release build whose key
  starts with `test_` (SEC-5).

### Validation and abuse limits

- The Worker refuses a request without its headers, text over its length
  limit, or a player ID that isn't an anonymous RevenueCat ID, before any
  KV read or Jev call (SEC-3).
- A Rate Limiting binding allows each player 10 requests in 10 seconds,
  keyed by the hashed player ID. Cloudflare calls the binding "permissive"
  and advises against keying on addresses, which many mobile users share
  ([Cloudflare notes][cf-ratelimit]).
- Exact caps live in the puzzle's object: 20 turns and 40 free answers per
  player (ASK-10), and 600 Jev calls a minute per object (AVAIL-2).
- A client that makes up new IDs escapes the per-player limits; the
  per-object Jev cap is the backstop.

[cf-ratelimit]: /docs/research/cloudflare-workers.md#limiting-requests-per-device

### Data inventory

| Data                                   | Where it's kept                            | Linked to a player | Kept for                        | App Privacy type                     |
| -------------------------------------- | ------------------------------------------ | ------------------ | ------------------------------- | ------------------------------------ |
| Typed questions, with AI answers on    | `answers` in the puzzle's object; TypeSafe | No                 | As long as the puzzle is served | Other User Content, Gameplay Content |
| Round progress: turns and status       | `players`, under a salted hash of the ID   | Yes                | As long as the puzzle is served | Gameplay Content                     |
| RevenueCat app user ID                 | RevenueCat; hashed on the server           | Yes                | RevenueCat's retention          | User ID                              |
| Purchases                              | RevenueCat and Apple                       | Yes                | RevenueCat's retention          | Purchase History                     |
| Counts of plays, questions, and solves | Analytics Engine, indexed by the hash      | Yes                | Three months                    | Product Interaction                  |
| Reports                                | `reports` in the puzzle's object           | No                 | Until triaged, then 30 days     | Customer Support                     |
| Logs                                   | Workers Logs, with no text and no IDs      | No                 | Seven days on Workers Paid      | Not collected                        |

- None of it is used for tracking, so there's no tracking prompt (PRIV-1),
  and the App Privacy answers follow the last column (STORE-5, PRIV-5).
- TypeSafe receives only wordings, cards, and bank questions (PRIV-2);
  RevenueCat receives the app user ID and purchases through its SDK and the
  Worker's entitlement checks; Cloudflare runs all of the Worker's traffic.
  The privacy policy names all three (PRIV-4).
- Workers Logs keep each request's details unless `invocation_logs` is off,
  so it is off, and the Worker logs its own JSON events without text, IDs,
  or addresses (PRIV-3).
- A player who declines the notice leaves round progress only: no stored
  wordings and no counts (NOTICE-3).

## Reliability and observability

### Failure modes

| Failure                           | What the player sees                                | What the system does                                             |
| --------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------- |
| Jev slow, `429`, or `529`         | An answer, or busy with the question list (STATE-3) | One retry inside the 3-second budget; stored answers still work  |
| Jev down or out of credits        | Busy with the question list                         | The daily check alerts; `aiEnabled` can switch live answers off  |
| RevenueCat's API down             | "Couldn't confirm Guessling+" and a retry (STATE-5) | Cached yes answers keep subscribers playing for up to 15 minutes |
| A puzzle missing from KV          | "Today's puzzle is late" and a retry (STATE-4)      | The daily check alerts two days ahead (AVAIL-3)                  |
| An overloaded or restarted object | Busy                                                | One retry on a new stub for idempotent reads                     |
| No network on the phone           | Offline, with the question kept (STATE-1)           | Nothing is sent, so no turn is used                              |
| A player leaves mid-question      | The answer on return, by the same `requestId`       | The object stores the answer as soon as Jev returns              |

### Logs and counts

- **Logs.** Workers Logs, enabled in `wrangler.jsonc`, with one JSON event
  per question: the step that answered, Jev's latency and status, and the
  outcome.
- **Counts.** Workers Analytics Engine, one data point per event, for
  players who allowed AI answers: puzzle opened, question answered, with
  its answer and source, guess, round solved or lost, report, and busy. The
  index is the hashed player ID, so distinct players and the return rate
  are `count(DISTINCT index1)` queries; at high volume the data is sampled,
  so totals use `SUM(_sample_interval)` (METRIC-1, METRIC-2)
  ([Cloudflare notes][cf-ae]).
- **Numbers for the write-up.** `stats.ts` queries the SQL API and prints
  the idea's numbers with the latest consistency results (METRIC-5);
  RevenueCat's charts give the money (METRIC-3).

[cf-ae]: /docs/research/cloudflare-workers.md#workers-analytics-engine

### The daily check

A Cron Trigger at 09:00 UTC, an hour before the next date first becomes
today in UTC+14, confirms that `live:<n>` exists for the next two dates,
sends Jev one test question, and posts to the team's webhook if either
fails (AVAIL-3). It also makes the first call to the next date's object with
`locationHint: "wnam"`, so no player pays for creating it.

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

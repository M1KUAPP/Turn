# Guessling technical requirements

> **Superseded on September 22, 2026.** This document describes Guessling,
> the team's first idea. [Turn](/docs/IDEA.md), an entry for the Next Gen
> Award, replaced it, and this document's links to the idea point at the
> [archived Guessling idea](/docs/archive/guessling-idea.md).

How version 1.0 of Guessling is built to meet the
[product requirements](/docs/PRD.md): the architecture, the versions, the
data, the API, how questions are answered, purchases, the app, security and
privacy, reliability, tests, and release. It's written on September 22,
2026, before the code, as the contract the code is built to, and it changes
with the code. The [product](/docs/PRODUCT.md) says why, the
[idea](/docs/archive/guessling-idea.md) owns the schedule and the risks, and
five research notes, on [RevenueCat in Expo][rc-notes], the
[Cloudflare backend][cf-notes], [Apple's requirements][apple-notes],
[daily puzzles][daily-notes], and [designing for iOS][ios-notes], hold the
sources.

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
1.  [Testing](#testing)
1.  [Environments and release](#environments-and-release)
1.  [Requirements traceability](#requirements-traceability)
1.  [Open technical questions](#open-technical-questions)
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
  - Jev, pinned to `jev-1.13.0`, is called in play only from the puzzles'
    Durable Objects, with the key as a Worker secret, so neither the key
    nor the answer reaches the phone. The daily check and the team's
    scripts are its only other callers, and budgets for each keep them
    together under TypeSafe's limit.
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
            |                    | reads KV: config, puzzles    |
            |                    | cron 09:00 UTC: daily check, |
            |                    | one test question to Jev     |
            v                    +--------------+---------------+
+------------------------+                      | one object per puzzle, in wnam
| App Store, RevenueCat  |       +--------------v---------------+       +--------------+
| (purchases, paywall)   |       | Durable Object puzzle-<n>    |------>| Jev          |
+------------------------+       | answers, players, reports    |   ^   | (TypeSafe)   |
                                 +--------------+---------------+   |   +--------------+
                                                |                   |
                                 +--------------v---------------+   |   +--------------+
                                 | Workers KV                   |   +---| budget       |
                                 | puzzles, banks, config       |       | tokens/min   |
                                 +------------------------------+       +--------------+
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
  of Jev in play. It's created with `locationHint: "wnam"`, near where
  `api.typesafe.ai` resolved on September 22, 2026, AWS us-west-2 by DNS
  alone ([Cloudflare notes][cf-latency]).
- **The budget**, one more Durable Object, also created in `wnam`, hands
  out tokens for Jev requests in play and for RevenueCat lookups.
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

| Part                   | Choice                                                                                                                            | Why                                                                      |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| App framework          | Expo SDK 57 (`expo` 57.0.24), React Native 0.86.3                                                                                 | The latest stable SDK; SDK 58 is a beta                                  |
| Language               | TypeScript, in the app, the Worker, and the scripts                                                                               | One language, as the idea chose                                          |
| Minimum iOS            | 16.4, Expo SDK 57's floor                                                                                                         | Every device then uses StoreKit 2 (COMPAT-1)                             |
| Build image            | EAS `macos-tahoe-26.5-xcode-26.6`, pinned                                                                                         | Xcode 26.6 with the iOS 26.5 SDK (COMPAT-2)                              |
| Purchases              | `react-native-purchases` and `-ui` 10.10.1                                                                                        | RevenueCat's SDK and Paywalls; needs a dev build                         |
| Drawing, motion, sound | Reanimated 4.5.1, react-native-svg 15.15.4, `expo-glass-effect`, `expo-symbols`, and `expo-haptics` ~57.0.3, `expo-audio` ~57.0.5 | SDK 57's pins; `npx expo install` picks them ([iOS notes][ios-versions]) |
| Backend                | Cloudflare Workers Paid, Wrangler 4.136.1, `wrangler.jsonc`                                                                       | Free caps 100,000 requests a day and 10 ms of CPU                        |
| Jev client             | `@typesafe-ai/sdk` 0.6.0, every option set in code                                                                                | Ran in a local workerd test; defaults wait too long                      |
| Jev model              | `jev-1.13.0`, pinned                                                                                                              | An alias "moves when a new release ships"                                |
| Worker tests           | `@cloudflare/vitest-plugin` 1.2.1 with Vitest 4.1                                                                                 | The plugin needs Vitest 4.1, not 5                                       |
| Jev mocks in tests     | `@msw/cloudflare` 0.0.1 with `msw` 2.14 or later                                                                                  | Cloudflare's documented way to mock outbound requests                    |
| Package manager        | Bun, already used by this repository                                                                                              |                                                                          |

- The Worker's `compatibility_date` is the newest date Wrangler accepts on
  the day the project starts; on September 21, Wrangler 4.136.1 refused
  2026-09-22 as a future date. From
  2026-08-04 on, Node.js compatibility is on by default and fills
  `process.env` with the Worker's variables, which Jev's SDK reads, so the
  Worker passes every SDK option in code
  ([Cloudflare notes][cf-nodejs]).
- No `expo-updates` in version 1.0: it would add Crash Data to the privacy
  label, and Expo says changes to an app's behavior "usually" need review
  ([RevenueCat notes on EAS Update][rc-eas-update]). It can join a later
  build if the team wants JavaScript bug fixes during judging.

[cf-nodejs]: /docs/research/cloudflare-workers.md#nodejs-compatibility-by-default
[rc-eas-update]: /docs/research/revenuecat-expo.md#eas-update-and-app-store-rules
[ios-versions]: /docs/research/ios-design.md#package-versions-in-sdk-57

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
  date: string | null // set by publish.ts from the target's FIRST_DAILY_DATE; null for a starter
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
CREATE TABLE answers (          -- WITHOUT ROWID, so rows keep no insertion order
  wording    TEXT PRIMARY KEY, -- the normalized question, with no player ID
  answer     TEXT NOT NULL,    -- 'yes' | 'no' | 'rephrase' | 'not_question'
  source     TEXT NOT NULL,    -- 'bank' | 'live'
  bank_id    TEXT,             -- the matched entry, such as 'q017' or 'q017_not'
  p          REAL,             -- the probability that decided it
  model      TEXT NOT NULL     -- 'jev-1.13.0'
) WITHOUT ROWID;

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
  id         TEXT PRIMARY KEY, -- a random UUID, so IDs keep no order
  wording    TEXT NOT NULL,
  answer     TEXT NOT NULL,
  reason     TEXT,             -- 'wrong' | 'unclear' | NULL
  day        TEXT NOT NULL     -- the UTC date it arrived, YYYY-MM-DD, and no finer
);
```

- Only wordings from players who allowed AI answers go into `answers`
  (NOTICE-3). Code-rule answers, such as letter questions, aren't stored,
  since code gives the same answer every time.
- No table holds question text next to a player: `players` has counts, and
  `answers` and `reports` have wordings without IDs (PRIV-3). Neither keeps a
  time finer than a day or an insertion order, and the question and report
  events in Analytics Engine carry no player ID, so a wording can't be matched
  to a player's turn or count by when it arrived.

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
- `X-Guessling-AI`: `on:<version>`, with the notice version the player
  accepted, or `off` (NOTICE-3). The Worker treats an older version than
  the config's as `off`, so a long session can't keep sending questions
  under an old notice (NOTICE-5).
- `X-Guessling-Date`: the device's local date, `YYYY-MM-DD`, which the
  Worker accepts only while it's today somewhere on Earth; see
  [Dates and numbers](#dates-and-numbers).
- `X-Guessling-Version`: the app's version, so the Worker can ask an old
  build to update.
- `X-Guessling-Refresh: 1`, only on the first archive request after a
  purchase or restore, to skip a cached no (PAY-5); the Worker honors it
  at most once a minute per player.

| Method and path                      | What it does                                        | Guessling+  |
| ------------------------------------ | --------------------------------------------------- | ----------- |
| `GET /v1/config`                     | The notice, the policy links, and the kill switch   | No          |
| `GET /v1/today`                      | Today's puzzle for the device's date, with progress | No          |
| `GET /v1/archive`                    | Every past puzzle's number, date, and hint          | No          |
| `GET /v1/puzzles/<n>`                | A puzzle by number, with progress                   | For archive |
| `GET /v1/puzzles/<n>/bank`           | The category's bank questions, for the list         | For archive |
| `POST /v1/puzzles/<n>/ask`           | Answers a question                                  | For archive |
| `POST /v1/puzzles/<n>/guess`         | Decides a guess                                     | For archive |
| `POST /v1/puzzles/<n>/reports`       | Stores a report                                     | No          |
| `GET /privacy`, `/terms`, `/support` | The policy and support pages, as static assets      | No          |

"For archive" means the Worker confirms Guessling+ unless `n` is the daily
puzzle dated `X-Guessling-Date`, or a round the player started, with at least
one turn, that is still `playing` inside the window TODAY-5 allows
(ARCHIVE-4). Opening a puzzle creates no player row; the first turn does. A
player who sets their clock to another date that is still today somewhere can
open that date's puzzle, as Wordle allows; the team accepts that. A puzzle's
view never includes `names` or `card`, so the answer can't reach the app early
(SEC-2); the end of a round adds `reveal`:

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

// POST /v1/puzzles/<n>/reports
interface ReportRequest {
  text: string // the question as the player typed it
  answer: 'yes' | 'no' | 'rephrase' | 'not_question' | 'right' | 'wrong'
  reason?: 'wrong' | 'unclear' // REPORT-1
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
  don't use a turn (ASK-10). None of the four uses a turn, and `pick`
  doesn't count toward the 40.
- `right` and `wrong` answer a guess, or a question that names an accepted
  name (GUESS-4); both use a turn.

Errors come back as `{ "error": { "code": string, "message": string } }`:

| Status | Code          | When                                                                                        |
| ------ | ------------- | ------------------------------------------------------------------------------------------- |
| 400    | `bad_request` | A missing header, or text over its limit                                                    |
| 400    | `bad_date`    | A device date that isn't today anywhere; the app asks the player to check the date and time |
| 403    | `needs_plus`  | An archive puzzle without a confirmed Guessling+                                            |
| 404    | `not_found`   | A puzzle that isn't published, or a date not yet today anywhere                             |
| 409    | `finished`    | A turn on a round that has ended                                                            |
| 409    | `pending`     | A new turn while the player's earlier one is still pending                                  |
| 426    | `update`      | An app version below `minAppVersion`                                                        |
| 429    | `slow_down`   | A player over the burst limit (SEC-3)                                                       |
| 503    | `busy`        | Jev didn't answer in time and no stored answer fits (STATE-3)                               |
| 503    | `unconfirmed` | RevenueCat couldn't confirm Guessling+ (STATE-5)                                            |

Admin routes, for the team's scripts only, need `Authorization: Bearer`
with the `ADMIN_TOKEN` secret:

- `GET /v1/admin/reports?number=<n>` lists a puzzle's reports (REPORT-2).
- `POST /v1/admin/players/forget` deletes one player's row, given their
  RevenueCat ID, for a deletion request (PRIV-4).
- `POST /v1/admin/puzzles/<n>/forget` deletes stored answers after a fix,
  by wording or by `bank_id`, which removes every paraphrase matched to
  that entry and its negation, and refuses until the puzzle closes
  (CONTENT-8).

## Answer pipeline

The puzzle's Durable Object answers every question, so one object decides
each wording once (ASK-5). It checks, in this order, and stops at the first
step that answers:

1.  **Limits.** The round must be playing, with turns left; a player past 40
    answers that used no turn gets `rest` (ASK-10). A repeated `requestId`
    gets the stored response again (STATE-2).
2.  **Normalize.** Lowercase, trim, collapse spaces, drop a final `?`, `.`,
    or `!`, and straighten curly quotes. The result is the _wording_.
3.  **A named guess.** A wording shaped "is it a/an/the X" whose X, in
    name form, is an accepted name is `right` (GUESS-4).
4.  **Letters.** A wording the code rules recognize as a question about the
    name's letters, such as its first or last letter, a letter it
    contains, or its length, is answered in code from `display` (ASK-7).
    Letter questions the rules don't recognize are caught by the match
    request's `about_letters` Noul, below.
5.  **An exact bank wording.** A wording equal to a bank question, or its
    negation, after normalization gets the checked answer, with no Jev call.
    A `bankId` from the list takes the same path (ASK-9).
6.  **Stored.** A wording in `answers` gets the stored answer (ASK-5).
7.  **No AI.** With `X-Guessling-AI: off`, an outdated notice version, or
    `aiEnabled` false, stop with
    `pick`, and store nothing (NOTICE-3, ASK-9).
8.  **Jev.** The match request, then, if nothing matched, the live request;
    both below.
9.  **Store.** Insert the answer under the wording if no answer is there yet,
    and return what storage then holds, `rephrase` and `not_question`
    included.

A question can be sent again while its first request still waits on Jev: by
the app's "Send again" after its timeout, or by the Worker's retry. So the
object also keeps pending requests by `requestId`, and a repeat awaits the
first one's result instead of taking a second turn. When Jev returns, the
object checks the round again, still `playing`, turns left, the free-answer
limit, and `last_request`, and applies the turn in one synchronous update: the
check-and-set Cloudflare prescribes after an outside call
([Cloudflare notes][cf-gates]). A Yes, a No, or a guess then takes a turn, and
anything else doesn't (ASK-3, GUESS-3), and the twentieth turn or a right
guess ends the round (END-1). The object also refuses a new `requestId` from a
player whose earlier one is still pending, with `pending`, so a round has one
turn in flight at a time. The Guessling+ check's 1-second timeout and the
3-second Jev budget keep the server's worst case under the app's 5 seconds.

A guess takes the same limits and retry handling, and never reaches Jev.
It's compared in _name form_: lowercase, trimmed, with punctuation turned
into spaces, spaces collapsed, and a leading "a", "an", or "the" removed, so "An
Octopus!" becomes "octopus". `publish.ts` stores `names` in the same form,
so a guess is right exactly when its name form is in `names` (GUESS-2).

[cf-gates]: /docs/research/cloudflare-workers.md#single-threaded-execution-and-input-and-output-gates

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
          'INSERT OR IGNORE INTO answers (wording, answer, source, bank_id, p, model) VALUES (?, ?, ?, ?, ?, ?)',
          wording, answer.answer, answer.source, answer.bankId, answer.p, MODEL
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
    },
    "about_letters": {
      "type": "noul",
      "instructions": "The text asks about the letters, spelling, or length of a name"
    }
  }
}
```

- `is_question` below 0.5 gives `not_question` (ASK-4).
- `about_letters` above 0.5 gives `rephrase`: a letter question the code
  rules didn't parse never reaches the live request, whose state holds the
  name (ASK-7).
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
- Every Jev request in play first takes a token from one Durable Object,
  `budget`, which hands out at most `JEV_BUDGET` a minute across all
  puzzles: 1,000 in production and 50 in the test environment. The SDK's
  injected `fetch` asks for a token before each attempt, so a retry counts
  too. Without a token, it returns a made-up `409`, a status the SDK
  doesn't retry, and the object answers `busy`. The count lives in memory,
  since losing it on eviction only resets one minute's window.
- The scripts share one cap of 100 a minute, so they run one at a time,
  and the daily check sends one
  question, so production, the test environment, and the scripts together
  stay under TypeSafe's 1,200 requests a minute even on one key (AVAIL-2,
  SEC-3). A cap per puzzle couldn't: three dates can be live at once,
  besides rounds past midnight and archive puzzles.
- Cloudflare warns that one object for a global counter "funnels all
  traffic through a single instance"; at 1,000 a minute, about 17 a
  second, the budget stays far under an object's guidance of 500 to 1,000
  requests a second ([Cloudflare notes][cf-counting]).
- Errors are logged by class and status only, never by message, since an
  open issue reports the key echoed into the SDK's connection errors
  (SEC-4).

[cf-sdk]: /docs/research/cloudflare-workers.md#the-sdk-under-workerd
[cf-counting]: /docs/research/cloudflare-workers.md#counting-in-a-durable-object

## Puzzle days and content tooling

### Dates and numbers

- **Numbering.** Starters are #1 to #10 and have no date. Daily puzzle `n`,
  from #11 on, belongs to `FIRST_DAILY_DATE` plus `n` − 11 days. In production
  that date is 2026-09-24, so #11 is Thursday, September 24 and #17 is
  Wednesday, September 30 (TODAY-3); the test environment sets an earlier
  date, so it has a today before launch. For a date before `FIRST_DAILY_DATE`,
  `GET /v1/today` serves #11 early, so App Review can finish a round in every
  time zone before September 24; nobody else is playing yet, so nobody gets
  different answers.
- **Today.** The app sends the device's local date with every request
  (TODAY-2). A date is today somewhere from 10:00 UTC the day before until
  12:00 UTC the day after, about 50 hours, so the Worker accepts a date
  only in that window ([Cloudflare notes][cf-dates]):

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
- **A puzzle closes** at 12:00 UTC two days after its date: its date ended
  everywhere a day earlier, when UTC−12 reached midnight, and every round
  begun on it has had the 24 hours TODAY-5 allows. Only then can a stored
  answer change (CONTENT-8).
- **The clock.** In a deployed Worker, `Date.now()` moves only on I/O,
  which is close enough for choosing a date.

[cf-dates]: /docs/research/cloudflare-workers.md#choosing-todays-puzzle-for-a-players-date

### From draft to published puzzle

The content lives in the repository as JSON, and the scripts, run with Bun,
take a puzzle from draft to published:

1.  **`check.ts <n>`** asks Jev every bank question and its negation, with
    the card as the state, several questions per request and at most eight
    requests at once and 100 a minute, since TypeSafe's own cookbook notes
    the public endpoint "rate-limits above roughly eight"
    ([Cloudflare notes][cf-fetch]). It writes `content/review/<n>.csv` with
    each probability and flags every answer between 0.3 and 0.7 and every
    question and negation whose answers contradict each other, both Yes or
    both No (CONTENT-4).
2.  **A person** fills in `checked` for every flagged entry and copies the
    clear answers as they stand.
3.  **`publish.ts <n>`** refuses a puzzle unless every bank id and negation is
    checked, the names are in name form, the date comes from the number and
    the target's `FIRST_DAILY_DATE`, the card
    has at most 40 facts, and the bank at most 127 questions (CONTENT-3,
    CONTENT-5). It then writes `puzzle:<n>:<rev>` and points `live:<n>` at it,
    with `wrangler kv key put --remote`, since Wrangler 4 writes to local
    storage without that flag. A daily puzzle goes up at least two days before
    its date (CONTENT-2), and from the moment its date is today anywhere,
    `publish.ts` refuses to move `live:<n>` again until the puzzle closes
    (CONTENT-8).
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
[idea-stack]: /docs/archive/guessling-idea.md#stack-and-data-flow

### Fixing a puzzle after its day

1.  `reports.ts <n>` lists a puzzle's reports from the admin route
    (REPORT-2).
2.  A person corrects `checked` or the card, reruns `check.ts`, and
    publishes a new revision; `live:<n>` moves only once the puzzle
    closes.
3.  `forget.ts <n> --bank <id>` deletes every stored answer matched to the
    corrected bank entry or its negation, and `forget.ts <n> <wording>...`
    deletes live answers by wording; the Worker allows both only once the
    puzzle closes. Archive players then get the fixed answer, whatever
    words they use (ARCHIVE-3). A starter has no date, so it has no day to
    wait for, and a fix to it applies at once.

## Purchases and entitlements

### RevenueCat and App Store Connect setup

| Item                | Value                                                                               |
| ------------------- | ----------------------------------------------------------------------------------- |
| Entitlement         | lookup key `plus`, shown to players as Guessling+                                   |
| Products            | `guessling_plus_yearly` at $19.99 and `guessling_plus_monthly` at $2.99             |
| Subscription group  | Guessling+, with both products at the same level                                    |
| Introductory offer  | a 3-day free trial on the yearly product                                            |
| Offering            | `default`, with the `$rc_annual` and `$rc_monthly` packages                         |
| Paywall             | one RevenueCat Paywall on `default`, yearly preselected (PAY-1, PAY-2)              |
| In-App Purchase Key | uploaded to RevenueCat, which StoreKit 2 needs to record transactions               |
| Sandbox access      | "Anybody", at least until approval, since App Review reportedly buys in the sandbox |

- The paywall is built in RevenueCat's editor with Close ("Navigate back"),
  Restore Purchases, Terms of Use, and Privacy Policy buttons, since
  current paywalls ignore `displayCloseButton` (PAY-3). Keeping both
  products at one level means an offer code on either is never a
  downgrade.
- The Worker needs the entitlement's object ID, such as `entla1b2c3d4e5`,
  not its lookup key; `GET /v2/projects/{project_id}/entitlements` lists
  both ([RevenueCat notes][rc-v2]).

### Purchases in the app

- `Purchases.configure({ apiKey })` runs once at launch with the public
  `appl_` key from `EXPO_PUBLIC_RC_IOS_KEY`; with no `appUserID`, the SDK
  makes an anonymous ID, `$RCAnonymousID:` and 32 lowercase hex
  characters, which the app sends as `X-Guessling-Player`.
- `Purchases.addCustomerInfoUpdateListener` keeps an `isPlus` flag, true
  while `customerInfo.entitlements.active.plus` exists. It drives the locks
  in the archive; the Worker still decides access (ARCHIVE-4).
- "Play yesterday's?", which reads "Play another?" and targets starter #10
  while no daily puzzle is dated before today (END-3), and a locked archive
  puzzle (ARCHIVE-2) call `RevenueCatUI.presentPaywall()` for a player without
  Guessling+ (PAY-4). On `PURCHASED` or `RESTORED`, the app sends its next
  archive request with `X-Guessling-Refresh: 1` and opens the puzzle (PAY-5).
- Settings calls `Purchases.restorePurchases()` only from the Restore
  Purchases tap, since a programmatic restore can prompt for sign-in
  (PAY-6). Redeem Code calls `Purchases.presentCodeRedemptionSheet()`
  (PAY-8).
- When the app returns to the foreground, it calls
  `Purchases.syncPurchases()`, which RevenueCat says to call after a
  redirect to the App Store, then reads the customer info, so a code
  redeemed through its link shows up without a restart; Restore Purchases
  is the fallback (PAY-7). `getCustomerInfo()` alone wouldn't do, since it
  refreshes only a cache older than five minutes.
- A reinstall gets a new anonymous ID; Restore Purchases, with RevenueCat's
  default transfer behavior, merges the old and new IDs.

### The server's entitlement check

The Worker asks RevenueCat's API v2 for the player's active entitlements,
with a v2 secret key limited to `customer_information:customers:read`,
which allows 480 requests a minute. API v1 would create a customer for any
unknown ID; for v2, the docs list a `404` for a customer RevenueCat doesn't
know, which the note couldn't test without a key, so the first day's tests
confirm it ([RevenueCat notes][rc-v2]).

```ts
const ANONYMOUS_ID = /^\$RCAnonymousID:[a-z0-9]{32}$/

export async function hasGuesslingPlus(appUserId: string, env: Env): Promise<boolean> {
  if (!ANONYMOUS_ID.test(appUserId)) return false
  const url =
    `https://api.revenuecat.com/v2/projects/${env.RC_PROJECT_ID}` +
    `/customers/${encodeURIComponent(appUserId)}/active_entitlements`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${env.RC_SECRET_KEY}` },
    signal: AbortSignal.timeout(1000) // a timeout is answered as unconfirmed too
  })
  if (res.status === 404) return false // RevenueCat has never seen this ID
  if (!res.ok) throw new Unconfirmed(res.status) // answered as 503 unconfirmed (STATE-5)
  const body = (await res.json()) as { items: { entitlement_id: string; expires_at: number | null }[] }
  return body.items.some(
    (e) => e.entitlement_id === env.RC_ENTITLEMENT_ID && (e.expires_at === null || e.expires_at > Date.now())
  )
}
```

- The answer is cached in the Worker's Cache API, keyed by the hashed ID: a
  yes until the entitlement expires or for 15 minutes, whichever comes
  first, and a no for 1 minute. The cache is per Cloudflare data center, so
  a player whose requests move to another one is simply checked again.
- The refresh header skips only a cached no, at most once a minute per player,
  so no single player can spend RevenueCat's limit of 480 requests a minute.
  The budget object also caps all lookups at 400 a minute, so invented IDs,
  which always miss the cache, can't spend it either; past the cap, a lookup
  is answered `unconfirmed`.
- A timeout, a `429`, or any other failure is answered `unconfirmed`, and
  the app offers a retry (STATE-5).
- An app user ID works like a bearer value: nothing ties it to a device.
  Guessing one is impractical, but a player who shares theirs shares
  Guessling+, which the team accepts.

### The judges' offer code

- Once the app is Ready for Sale, the team creates a custom offer code on
  the monthly product: one month free, auto-renewal off, open to new,
  existing, and expired subscribers, with a redemption limit of about 100,
  since no note says whether Devpost shows the code publicly. The team
  watches redemptions and keeps a second code ready. Codes can take up to
  an hour to work (PAY-7).
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
- The question field, the Guess button, and the question list are
  disabled while a request is pending, and after a timeout the app offers
  only "Send again", with the same `requestId` (ASK-8).

### The notice, sharing, and settings

- Each answer in the history, shown oldest first (ASK-11), has "Report this
  answer", which sends `POST /v1/puzzles/<n>/reports` and records the
  wording in `reported:<n>`, so the button turns into "Reported"
  (REPORT-1, REPORT-3).
- A finished puzzle shows its end screen, with Share and "Play
  yesterday's?", until the next puzzle starts (END-3, END-4).
- Settings shows the player's RevenueCat ID under support, so the team can
  look up a judge's Guessling+ (SET-1).
- `/notice` shows the text from `GET /v1/config` with two buttons of equal
  weight; the choice and the notice's version go to the device store, and a
  newer version brings the modal back before the next question (NOTICE-1,
  NOTICE-4, NOTICE-5).
- Share builds the text of SHARE-1 on the device from the round's history
  and opens `Share.share({ message })`; no photo-library access is needed
  (SHARE-1, SHARE-2, SHARE-3).
- The privacy policy, the terms, and support open in Safari with
  `Linking.openURL`, not in a browser inside the app, which could change
  the age rating's web-access answer (SET-1, STORE-4).

### Reactions, sound, and haptics

The design draws [the Guessling][design-guessling], times its
[motion][design-motion], and specifies [the sounds][design-sound]; this
section says how they're built. The rig draws with `react-native-svg`, the
composer's glass comes from `expo-glass-effect`, and symbols from
`expo-symbols`, all pinned by SDK 57, and a unit test keeps
`app/src/constants/theme.ts` in step with the design's tokens.

- The Guessling's poses, which the design draws, are animated with
  Reanimated; four of them, the nod, head shake, shrug, and celebration,
  answer questions. With Reduce Motion on, each reaction becomes a fade to
  its pose. The app reads the setting from `AccessibilityInfo` and follows
  its `reduceMotionChanged` event, and every animation, full or faded, sets
  its `reduceMotion` option to `ReduceMotion.Never`: `useReducedMotion()`
  and Reanimated's default both keep the value from launch, the default
  makes an animation jump to its end, and a nod built from a sequence would
  show nothing at all (ASK-2, A11Y-3)
  ([iOS notes on Reduce Motion][ios-reduce-motion]).
- Sounds play in the ambient audio category, so the silent switch mutes
  them and the player's music keeps playing; a light haptic marks each Yes,
  No, wrong guess, "Ask another way", and "Ask a yes-or-no question", and a
  success haptic the solve, as the design's answer table lists. Both
  follow Settings' switches (SET-2) ([Apple notes on sound][apple-sound]).
- The ambient category needs an explicit call before the first sound,
  since without it the first sound stops the player's music:

  ```ts
  await setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' })
  ```

  The expo-audio plugin sets `enableBackgroundPlayback` and
  `microphonePermission` to false, since its defaults add a background
  audio mode and a microphone usage string
  ([iOS notes on sounds][ios-sounds]).

[apple-sound]: /docs/research/apple-requirements.md#sound-and-the-silent-switch
[design-guessling]: /docs/DESIGN.md#the-guessling
[design-motion]: /docs/DESIGN.md#motion
[design-sound]: /docs/DESIGN.md#sound-and-haptics
[ios-reduce-motion]: /docs/research/ios-design.md#reduce-motion-in-reanimated
[ios-sounds]: /docs/research/ios-design.md#short-sounds-in-expo

### Accessibility

- Every answer shows its word, and the Guessling's image carries the answer
  as its accessibility label; `AccessibilityInfo.announceForAccessibility`
  reads each new answer (A11Y-1, A11Y-4).
- Each text style sets `dynamicTypeRamp` to the Apple text style whose
  curve it follows, so text grows as the system's does. Without a ramp,
  React Native scales every size by one multiplier, which puts a 34-point
  title at about 121 points at the largest accessibility size, where
  Apple's is 60. Screens scroll rather than truncate at the largest sizes
  (A11Y-2) ([iOS notes on text scaling][ios-scaling]).
- Colors come from one theme with light, dark, and Increase Contrast
  values, each a `DynamicColorIOS`, and text keeps a contrast of at least
  4.5 to 1 in all four (A11Y-5). The app follows the system's appearance
  with `userInterfaceStyle: 'automatic'`: without it, Expo writes
  `UIUserInterfaceStyle` as `Light`, which locks the app, the paywall, and
  the system sheets in light mode ([iOS notes on Dark Mode][ios-dark]).
- The paywall is RevenueCat's native view; the VoiceOver and Larger Text
  checks run on it too, since a label can be claimed only if the purchase
  works with that feature (A11Y-6). The iOS SDK hides paywall images from
  VoiceOver, whatever alt text the editor holds, so nothing the paywall
  must say goes in an image ([iOS notes on the paywall][ios-paywall]).

[ios-dark]: /docs/research/ios-design.md#dark-mode-in-the-app-config
[ios-scaling]: /docs/research/ios-design.md#how-react-native-scales-text
[ios-paywall]: /docs/research/ios-design.md#limits-on-matching-the-app

### Build configuration

`app.config.ts`:

```ts
export default {
  name: 'Guessling',
  slug: 'guessling',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic', // follow the system's appearance (A11Y-5)
  ios: {
    bundleIdentifier: 'com.<team>.guessling',
    supportsTablet: false, // iPhone only, the default (COMPAT-1)
    icon: './assets/guessling.icon', // one Icon Composer file
    config: { usesNonExemptEncryption: false } // HTTPS through the system only
  },
  plugins: [
    'expo-router',
    ['expo-audio', { enableBackgroundPlayback: false, microphonePermission: false }],
    ['expo-splash-screen', { backgroundColor: '#2E5BD8', dark: { backgroundColor: '#0D1B40' } }]
  ]
}
```

- `ios.deploymentTarget` stays at SDK 57's 16.4 (COMPAT-1).
- The icon and the launch screen follow the design's
  [app icon][design-icon] and [launch][design-launch] sections: Xcode builds
  the images for iOS 18 and earlier from the `.icon` file, and the launch
  screen is the table's solid blue in each appearance.
- Expo aggregates its modules' privacy manifests; if Apple emails about a
  missing required reason after an upload, the reason goes into
  `ios.privacyManifests` ([RevenueCat notes on privacy manifests][rc-pm]).
- The app still runs on iPad at phone resolution, so every screen, the
  share sheet and the paywall included, is checked on an iPad simulator
  (COMPAT-3).

[rc-pm]: /docs/research/revenuecat-expo.md#privacy-manifests-in-expo
[design-icon]: /docs/DESIGN.md#the-app-icon
[design-launch]: /docs/DESIGN.md#launch

## Security and privacy

### Secrets and configuration

| Name                     | Kind          | Holds                                                           |
| ------------------------ | ------------- | --------------------------------------------------------------- |
| `TYPESAFE_API_KEY`       | Worker secret | Jev's key (SEC-1)                                               |
| `RC_SECRET_KEY`          | Worker secret | RevenueCat v2 key, read-only on customers (SEC-1)               |
| `PLAYER_SALT`            | Worker secret | The salt for hashing player IDs                                 |
| `ADMIN_TOKEN`            | Worker secret | The admin routes' bearer token                                  |
| `ALERT_WEBHOOK_URL`      | Worker secret | Where the daily check posts a failure (AVAIL-3)                 |
| `RC_PROJECT_ID`          | Worker var    | RevenueCat's project ID                                         |
| `RC_ENTITLEMENT_ID`      | Worker var    | The Guessling+ entitlement's object ID                          |
| `MATCH_MIN`              | Worker var    | The match threshold, 0.6 until the consistency test             |
| `JEV_BUDGET`             | Worker var    | Jev requests a minute in play: 1,000, or 50 for the test Worker |
| `FIRST_DAILY_DATE`       | Worker var    | The date of daily puzzle #11: 2026-09-24 in production          |
| `EXPO_PUBLIC_API_URL`    | App, public   | The Worker's address on the team's domain                       |
| `EXPO_PUBLIC_RC_IOS_KEY` | App, public   | RevenueCat's `appl_` key; `test_` only in development           |

- The five secrets are listed in `wrangler.jsonc` under `secrets.required`,
  so a deploy without one fails. `EXPO_PUBLIC_` values are "visible in
  plain-text in your compiled application", so nothing secret goes there.
- The EAS development profile is the only one with the `test_` key;
  preview, TestFlight, and review builds are release builds, which crash on
  purpose with it, so the TestFlight build would crash at launch (SEC-5).

### Validation and abuse limits

- The Worker refuses a request without its headers, text over its length
  limit, or a player ID that isn't an anonymous RevenueCat ID, before any
  KV read or Jev call (SEC-3).
- A Rate Limiting binding allows each player 10 requests in 10 seconds,
  keyed by the hashed player ID. Cloudflare calls the binding "permissive"
  and advises against keying on addresses, which many mobile users share
  ([Cloudflare notes][cf-ratelimit]).
- Exact caps live in Durable Objects: 20 turns and 40 free answers per
  player in the puzzle's object (ASK-10), and 1,000 Jev requests a minute
  in `budget` (AVAIL-2).
- A client that makes up new IDs escapes the per-player limits; the shared
  Jev budget is the backstop.

[cf-ratelimit]: /docs/research/cloudflare-workers.md#limiting-requests-per-device

### Data inventory

| Data                                   | Where it's kept                                | Linked to a player | Kept for                        | App Privacy type                     |
| -------------------------------------- | ---------------------------------------------- | ------------------ | ------------------------------- | ------------------------------------ |
| Typed questions, with AI answers on    | `answers` in the puzzle's object; TypeSafe     | No                 | As long as the puzzle is served | Other User Content, Gameplay Content |
| Round progress: turns and status       | `players`, under a salted hash of the ID       | Yes                | As long as the puzzle is served | Gameplay Content                     |
| RevenueCat app user ID                 | RevenueCat; hashed on the server               | Yes                | RevenueCat's retention          | User ID                              |
| Purchases                              | RevenueCat and Apple                           | Yes                | RevenueCat's retention          | Purchase History                     |
| Paywall views                          | RevenueCat, recorded by its Paywalls           | Yes                | RevenueCat's retention          | Product Interaction                  |
| Counts of plays, questions, and solves | Analytics Engine; only openings carry the hash | Yes                | Three months                    | Product Interaction                  |
| Reports                                | `reports` in the puzzle's object               | No                 | 30 days from arrival            | Customer Support                     |
| Logs                                   | Workers Logs, with no text and no IDs          | No                 | Seven days on Workers Paid      | Not collected                        |

- None of it is used for tracking, so there's no tracking prompt (PRIV-1),
  and the App Privacy answers follow the last column (STORE-5, PRIV-5).
- TypeSafe receives only wordings, cards, and bank questions (PRIV-2);
  RevenueCat receives the app user ID and purchases through its SDK and the
  Worker's entitlement checks; Cloudflare runs all of the Worker's traffic.
  The privacy policy names all three (PRIV-4).
- Workers Logs keep each request's details unless `invocation_logs` is off,
  so it is off, and the Worker logs its own JSON events without text, IDs,
  or addresses (PRIV-3).
- A player who declines the notice leaves round progress, and any report
  they choose to send, but no stored wordings and no counts (NOTICE-3).
  RevenueCat still records paywall views, as part of the purchase flow, and
  the privacy policy says so (PRIV-4).
- A deletion request quotes the RevenueCat ID shown in Settings (SET-1).
  `delete-player.ts <id>` asks every puzzle's object, through
  `POST /v1/admin/players/forget`, to delete that player's row; the team
  deletes the customer in RevenueCat; and the openings in Analytics Engine
  age out after three months, which the privacy policy states (PRIV-4).

## Reliability and observability

### Failure modes

| Failure                                  | What the player sees                                | What the system does                                              |
| ---------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------- |
| Jev slow, `429`, or `529`                | An answer, or busy with the question list (STATE-3) | One retry inside the 3-second budget; stored answers still work   |
| Jev down or out of credits               | Busy with the question list                         | The daily check alerts; `aiEnabled` can switch live answers off   |
| RevenueCat's API down                    | "Couldn't confirm Guessling+" and a retry (STATE-5) | Cached yes answers keep subscribers playing for up to 15 minutes  |
| A puzzle missing from KV                 | "Today's puzzle is late" and a retry (STATE-4)      | The daily check alerts two days ahead (AVAIL-3)                   |
| An overloaded object                     | Busy                                                | No retry: Cloudflare says overload errors "should not be retried" |
| A restarted object, or a retryable error | Busy, or the answer on retry                        | One retry on a new stub; a repeated `requestId` is safe           |
| No network on the phone                  | Offline, with the question kept (STATE-1)           | Nothing is sent, so no turn is used                               |
| A player leaves mid-question             | The answer on return, by the same `requestId`       | The object stores the answer as soon as Jev returns               |

Whether a player's disconnect also cancels the object's call to Jev isn't
documented; if it does, the retry with the same `requestId` simply asks
again.

### Logs and counts

- **Logs.** Workers Logs, enabled in `wrangler.jsonc`, with one JSON event
  per question: the step that answered, Jev's latency and status, and the
  outcome.
- **Counts.** Workers Analytics Engine, one data point per event, for players
  who allowed AI answers: puzzle opened, question answered, with its answer
  and source, guess, round solved or lost, report, and busy, each with the
  puzzle and the player's date, so a finish on its date is countable. Only the
  "puzzle opened" event carries the hashed player ID as its index, so distinct
  players and the return rate are `count(DISTINCT index1)` queries on
  openings, and the question and report events carry no ID that could line
  them up with a stored wording; at high volume the data is sampled, so totals
  use `SUM(_sample_interval)` (METRIC-1, METRIC-2)
  ([Cloudflare notes][cf-ae]).
- **Numbers for the write-up.** `stats.ts` queries the SQL API, with a token
  kept on the team's machines, not in the Worker, and prints the idea's
  numbers with the latest consistency results (METRIC-5); RevenueCat's charts
  give the money (METRIC-3).

[cf-ae]: /docs/research/cloudflare-workers.md#workers-analytics-engine

### The daily check

A Cron Trigger at 09:00 UTC, an hour before the next date first becomes
today in UTC+14, confirms that `live:<n>` exists for the next two dates,
sends Jev one test question, and posts to the team's webhook if either
fails (AVAIL-3). It also makes the first call to the next date's object with
`locationHint: "wnam"`, so no player pays for creating it, and deletes
reports more than 30 days old.

### Service life

The Worker, Jev's credits with auto-refill on, and a new puzzle each day run
through at least October 22, 2026, and then for as long as any Guessling+
subscription runs (AVAIL-1). The standing costs are small: Workers Paid is
$5 a month, and RevenueCat's Pro plan is free below $2,500 of monthly
tracked revenue.

## Testing

| Layer                | What runs                                                                                                         | Proves                                          |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Unit                 | Vitest on normalization, letter rules, guesses, dates and numbers, thresholds, and the share text                 | ASK-5, ASK-7, ASK-12, GUESS-2, TODAY-3, SHARE-1 |
| Worker integration   | `@cloudflare/vitest-plugin` with Jev and RevenueCat mocked by `@msw/cloudflare`                                   | The pipeline, limits, retries, and access       |
| Recorded Jev answers | Real match and live responses saved as fixtures from the test environment                                         | The request shapes and thresholds               |
| Consistency          | `consistency.ts` on each category's paraphrase set                                                                | CONTENT-6                                       |
| Purchases            | A TestFlight build with a sandbox account: trial, purchase, restore, offer code                                   | PAY, RELEASE-2                                  |
| Devices              | The smallest and largest iPhones and an iPad simulator, VoiceOver, the largest text, Reduce Motion, airplane mode | COMPAT-3, A11Y, STATE-1                         |
| Load                 | 30 questions a second for a minute at the test server, half of them repeats                                       | AVAIL-2                                         |
| Timing               | 50 questions timed in the app on the release build, and a cold start on the oldest iPhone the team has            | PERF-1, PERF-2, PERF-3                          |

On the first day, a deployed test Worker also makes one real Jev call
through the SDK, which the notes only ran locally; if it fails there, the
Worker calls the HTTP API directly with `fetch`, as the idea planned.

The Worker integration tests that matter most:

- Two simultaneous first requests for one wording make one Jev call, and
  both players get the stored answer (ASK-5).
- A repeated `requestId` returns the first response and uses no second turn
  (STATE-2), including a repeat sent while the first still waits on Jev.
- The 41st free answer returns `rest`, and a guess still works (ASK-10).
- With `X-Guessling-AI: off`, no Jev call happens, nothing is stored, and no
  count is written (NOTICE-3).
- An archive request without the entitlement gets `needs_plus`, and with
  RevenueCat failing, `unconfirmed` (ARCHIVE-4, STATE-5).
- `forget` refuses before the puzzle closes (CONTENT-8).

The plugin injects its own Node.js compatibility flags, unlike production
from 2026-08-04, and Vitest's fake timers don't reach the KV simulator, so
date logic takes the clock as a parameter
([Cloudflare notes][cf-tests]). Before each submission, the context's
[review essentials][ctx-apple] and RevenueCat's launch checklist are the
pre-flight (RELEASE-1).

[cf-tests]: /docs/research/cloudflare-workers.md#local-development-and-tests
[ctx-apple]: /docs/CONTEXT.md#apple-app-store-review-essentials

## Environments and release

| Environment | Worker                                   | App build                             | RevenueCat key | Purchases  |
| ----------- | ---------------------------------------- | ------------------------------------- | -------------- | ---------- |
| Local       | `wrangler dev`, simulated KV and objects | EAS `development` profile, dev client | `test_`        | Test Store |
| Test        | `guessling-api-test` on the domain       | EAS `preview` profile, TestFlight     | `appl_`        | Sandbox    |
| Production  | `guessling-api` on the domain            | EAS `production` profile, App Store   | `appl_`        | Real       |

- The test Worker has its own KV namespace and objects, and a fake Jev
  switch for the busy and down checks (STATE-3).
- EAS keeps `EXPO_PUBLIC_API_URL` and `EXPO_PUBLIC_RC_IOS_KEY` per
  environment. The production profile pins the build image, and its submit
  profile names the App Store Connect record's `ascAppId`, since that
  record exists from September 22 for the subscriptions.

Release steps for version 1.0, which the idea's
[schedule](/docs/archive/guessling-idea.md#schedule-to-september-30) dates:

1.  On September 22, set up the App Store Connect record: the name, subtitle,
    category, description, and keywords (STORE-1); the privacy, terms, and
    support URLs (STORE-3); and availability in every storefront except China
    mainland and Vietnam, with Brazil after its tax form and the EU after
    trader verification, which starts that day (STORE-8). The subscriptions
    get the same storefronts.
2.  Deploy the production Worker, publish the 17 puzzles and the config,
    and check them in KV with `wrangler kv key get --remote`, since the API
    serves a daily puzzle only once its date is today somewhere
    (CONTENT-1).
3.  Build with the `production` profile and upload with `eas submit`; the
    build appears in TestFlight after processing.
4.  Run the release criteria on that build against the production server
    with sandbox purchases, and the calendar-bound checks on a `preview`
    build against the test Worker, as RELEASE-1 says (RELEASE-1 to
    RELEASE-4).
5.  Add the final screenshots (STORE-2), the age rating answers (STORE-4),
    the privacy answers (STORE-5), and the review notes STORE-7 lists, then
    submit with both subscriptions (STORE-6), set to release automatically,
    with Mac and Apple Vision Pro availability turned off (COMPAT-4).
6.  Once it's live: create the judges' offer code, wait for it to work,
    redeem it on a real device, and confirm a production purchase
    (RELEASE-5).
7.  Before 11:45 PM PT on September 30, complete the brief's submission
    checklist on Devpost with the App Store link, the RevenueCat project ID,
    and the judges' code (RELEASE-6).

A deployed Worker can be replaced by redeploying an earlier commit, but a
released app can't be recalled, so behavior that might need changing during
judging, such as the notice, the policy pages, and live answers, sits behind
the config and the static pages.

## Requirements traceability

Every PRD requirement, and the sections of this document that meet it:

| Requirements                                                                                      | Met in                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| NOTICE-1, NOTICE-2, NOTICE-3, NOTICE-4, NOTICE-5                                                  | [Worker API](#worker-api), [Answer pipeline](#answer-pipeline), [The iPhone app](#the-iphone-app), [Data model](#data-model)                                 |
| TODAY-1, TODAY-2, TODAY-3, TODAY-4, TODAY-5                                                       | [Puzzle days and content tooling](#puzzle-days-and-content-tooling), [The iPhone app](#the-iphone-app)                                                       |
| ASK-1, ASK-2, ASK-3, ASK-4, ASK-5, ASK-6, ASK-7, ASK-8, ASK-9, ASK-10, ASK-11, ASK-12             | [Worker API](#worker-api), [Answer pipeline](#answer-pipeline), [The iPhone app](#the-iphone-app)                                                            |
| GUESS-1, GUESS-2, GUESS-3, GUESS-4                                                                | [Worker API](#worker-api), [Answer pipeline](#answer-pipeline)                                                                                               |
| END-1, END-2, END-3, END-4, END-5                                                                 | [Worker API](#worker-api), [Answer pipeline](#answer-pipeline), [The iPhone app](#the-iphone-app)                                                            |
| SHARE-1, SHARE-2, SHARE-3                                                                         | [The iPhone app](#the-iphone-app)                                                                                                                            |
| STREAK-1, STREAK-2                                                                                | [The iPhone app](#the-iphone-app)                                                                                                                            |
| ARCHIVE-1, ARCHIVE-2, ARCHIVE-3, ARCHIVE-4                                                        | [Puzzle days and content tooling](#puzzle-days-and-content-tooling), [Purchases and entitlements](#purchases-and-entitlements)                               |
| PAY-1, PAY-2, PAY-3, PAY-4, PAY-5, PAY-6, PAY-7, PAY-8                                            | [Purchases and entitlements](#purchases-and-entitlements), [The iPhone app](#the-iphone-app)                                                                 |
| REPORT-1, REPORT-2, REPORT-3                                                                      | [Data model](#data-model), [Worker API](#worker-api), [Puzzle days and content tooling](#puzzle-days-and-content-tooling), [The iPhone app](#the-iphone-app) |
| SET-1, SET-2                                                                                      | [The iPhone app](#the-iphone-app)                                                                                                                            |
| STATE-1, STATE-2, STATE-3, STATE-4, STATE-5                                                       | [Answer pipeline](#answer-pipeline), [The iPhone app](#the-iphone-app), [Reliability and observability](#reliability-and-observability)                      |
| CONTENT-1, CONTENT-2, CONTENT-3, CONTENT-4, CONTENT-5, CONTENT-6, CONTENT-7, CONTENT-8, CONTENT-9 | [Puzzle days and content tooling](#puzzle-days-and-content-tooling), [Environments and release](#environments-and-release)                                   |
| PERF-1, PERF-2, PERF-3                                                                            | [Answer pipeline](#answer-pipeline), [The iPhone app](#the-iphone-app), [Testing](#testing)                                                                  |
| AVAIL-1, AVAIL-2, AVAIL-3                                                                         | [Reliability and observability](#reliability-and-observability), [Security and privacy](#security-and-privacy)                                               |
| PRIV-1, PRIV-2, PRIV-3, PRIV-4, PRIV-5                                                            | [Security and privacy](#security-and-privacy)                                                                                                                |
| SEC-1, SEC-2, SEC-3, SEC-4, SEC-5                                                                 | [Security and privacy](#security-and-privacy), [Answer pipeline](#answer-pipeline), [Worker API](#worker-api)                                                |
| A11Y-1, A11Y-2, A11Y-3, A11Y-4, A11Y-5, A11Y-6                                                    | [The iPhone app](#the-iphone-app), [Testing](#testing)                                                                                                       |
| COMPAT-1, COMPAT-2, COMPAT-3, COMPAT-4                                                            | [Stack and repository](#stack-and-repository), [The iPhone app](#the-iphone-app), [Environments and release](#environments-and-release)                      |
| METRIC-1, METRIC-2, METRIC-3, METRIC-4, METRIC-5                                                  | [Reliability and observability](#reliability-and-observability), [Puzzle days and content tooling](#puzzle-days-and-content-tooling)                         |
| STORE-1, STORE-2, STORE-3, STORE-4, STORE-5, STORE-6, STORE-7, STORE-8                            | [Environments and release](#environments-and-release), [Security and privacy](#security-and-privacy)                                                         |
| RELEASE-1, RELEASE-2, RELEASE-3, RELEASE-4, RELEASE-5, RELEASE-6                                  | [Testing](#testing), [Environments and release](#environments-and-release)                                                                                   |

## Open technical questions

Each with a safe default; the PRD's [open questions][prd-open] cover the
product and legal ones.

- **Jev's rate-limit scope.** No TypeSafe page says whether 1,200 requests
  a minute apply per key or per account. Safe default: one key, with the
  shared budget of 1,000 a minute in play and 100 for the scripts.
- **Jev's concurrency.** TypeSafe's own cookbook caps its pool near eight
  requests at once, but only the limit of 1,200 a minute is documented.
  Safe default: the scripts stay at eight at once, and the Worker's budget
  counts requests, not concurrency; watch for `429` responses at launch.
- **Jev out of credits.** No TypeSafe page says what the API returns when
  credits run out. Safe default: treat any unexpected `4xx` as busy, alert,
  and keep auto-refill on.
- **Where far players wait.** An object created in western North America
  adds an ocean crossing for players in Asia and Europe, and Cloudflare
  publishes no latency figures between regions. Safe default: measure it
  with `request.cf.colo` in the logs, and keep PERF-1's target to the
  United States.
- **Sampled counts.** Analytics Engine may sample at high volume, which
  would make distinct-player counts estimates. Safe default: report them as
  estimates if `_sample_interval` ever exceeds 1.
- **Propagation.** KV gives no upper bound on how long a change takes to
  appear everywhere. Safe default: publish two days ahead (CONTENT-2) and
  never rewrite a revision.

[prd-open]: /docs/PRD.md#open-questions

## See also

- [Product requirements](/docs/PRD.md): every requirement this document
  traces.
- [Product](/docs/PRODUCT.md): what Guessling is and why.
- [Design](/docs/DESIGN.md): how Guessling looks, moves, and sounds, as
  tokens and rules a coding agent can follow.
- [Idea](/docs/archive/guessling-idea.md): the schedule, the risks, and the
  pitch.
- [RevenueCat notes][rc-notes], [Cloudflare notes][cf-notes],
  [Apple notes][apple-notes], [daily puzzle notes][daily-notes], and
  [iOS design notes][ios-notes]: the sources behind the choices here.
- [Jev notes](/docs/research/jev.md): the API, the SDKs, the limits, and the
  terms.

[rc-notes]: /docs/research/revenuecat-expo.md
[cf-notes]: /docs/research/cloudflare-workers.md
[apple-notes]: /docs/research/apple-requirements.md
[daily-notes]: /docs/research/daily-puzzles.md
[ios-notes]: /docs/research/ios-design.md
[rc-v2]: /docs/research/revenuecat-expo.md#rest-api-v2-customer-and-active-entitlements

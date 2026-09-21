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

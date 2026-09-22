# Turn's relay and services research notes

What Turn's relay and the services behind it need, as input to the rewrite of
Turn's product, PRD, and TRD documents: Jev's request for each partner line,
the Cloudflare Worker that counts free lines and checks the purchase,
RevenueCat's Test Store, a device identity that needs no paid Apple account,
and the notices the services' terms ask for. Every source was read on
September 22, 2026, so versions, prices, and limits are as of that date,
judgment starts with "Synthesis:", and local tests with Wrangler 4.136.2 are
labeled as such. What the [idea](/docs/IDEA.md) and the earlier notes hold is
linked, not repeated.

Contents:

1.  [Findings for the product, PRD, and TRD](#findings-for-the-product-prd-and-trd)
1.  [Jev's request for each partner line](#jevs-request-for-each-partner-line)
1.  [The relay on Cloudflare Workers](#the-relay-on-cloudflare-workers)
1.  [RevenueCat Test Store for Turn](#revenuecat-test-store-for-turn)
1.  [Identifying a device to the relay](#identifying-a-device-to-the-relay)
1.  [Notices, consent, and sensitive data](#notices-consent-and-sensitive-data)
1.  [Latest versions as of September 22, 2026](#latest-versions-as-of-september-22-2026)
1.  [Conflicts between sources](#conflicts-between-sources)
1.  [Gaps](#gaps)

## Findings for the product, PRD, and TRD

Synthesis: each line condenses the section it links to, where the sources
are.

- **Give each phrase its own Noul, and keep the state small.** TypeSafe's
  Noul page puts each candidate inside its own question's `instructions`,
  and its jaggedness page says unrelated state "costs you accuracy"; the
  idea first put all 40 phrases in the state. See
  [The request body for one partner line](#the-request-body-for-one-partner-line).
- **Nothing caps 42 questions.** No page or schema limits the questions in a
  request; the budgets are 64k tokens per request and 32k for the state plus
  the longest question, and TypeSafe's own cookbooks send 54 and 62 questions
  in one request. See
  [Limits on questions, options, and state](#limits-on-questions-options-and-state).
- **Keep the pin.** `jev-1.13.0` is still the only model, pinning is
  TypeSafe's advice, and no page promises how long a pinned version lasts.
  See
  [The model pin on September 22, 2026](#the-model-pin-on-september-22-2026).
- **Bound every call.** The SDK's defaults allow three 10-second attempts,
  and running out of credits has no documented status; the relay sets a short
  timeout, at most one retry, and a `signal`, and handles a 402 itself. See
  [Errors, retries, and timeouts](#errors-retries-and-timeouts).
- **A line costs about 1,700 to 1,900 input tokens,** not the 1,500 the idea
  first estimated: up to about $0.00008, or $5.20 to $5.80 a year at 200 lines a
  day. See [How a Jev request is billed](#how-a-jev-request-is-billed).
- **Count free lines in one Durable Object per device.** KV can't count
  concurrent lines, D1 now fails hard past its Free limits, and a SQLite
  object per device counted exactly 20 of 25 simultaneous lines, and a
  repeated line once, in a local test. See
  [Counting free partner lines per device](#counting-free-partner-lines-per-device).
- **Place the relay at `aws:us-west-2`.** Jev runs in AWS us-west-2, and a
  placement hint plus a `wnam` object keeps each line to one ocean crossing.
  See
  [Placement near TypeSafe and RevenueCat](#placement-near-typesafe-and-revenuecat).
- **Traces start counting on October 1, 2026,** during judging, and keep
  URLs, while RevenueCat's v2 path carries the app user ID; keep tracing off
  and user text in POST bodies. See
  [Workers Logs and traces for the relay](#workers-logs-and-traces-for-the-relay).
- **Test Store can sell a one-time product.** REST API v2 and the iOS SDK
  both handle non-consumable Test Store products; only the dashboard's form
  is undocumented, and the yearly fallback the idea first planned would lock
  Listen mode after five hours. See
  [One-time products in Test Store](#one-time-products-in-test-store).
- **Restore does nothing under Test Store.** The SDK only refetches the
  current customer, and the anonymous ID lives in UserDefaults, so a
  reinstall loses the purchase and resets the free lines. See
  [Paywalls, Customer Center, and restore](#paywalls-customer-center-and-restore).
- **RevenueCat's blogs treat the Test Store key as private,** against the
  idea's plan to commit it, and Release builds crash with it, so a judges'
  Simulator build must be a Debug build. See
  [The Test Store API key](#the-test-store-api-key).
- **Only purchases show the store.** Active entitlements carry no store or
  environment; v2 purchases and webhooks mark Test Store buys as
  `test_store` and `sandbox`. See
  [Test Store purchases on the server](#test-store-purchases-on-the-server).
- **No device check works on a free account.** App Attest and DeviceCheck
  both need the paid program; a random ID kept in the Keychain usually
  survives a reinstall, which Expo says not to rely on. See
  [App Attest and DeviceCheck on a free account](#app-attest-and-devicecheck-on-a-free-account)
  and
  [Identifiers that survive a reinstall](#identifiers-that-survive-a-reinstall).
- **Neither provider addresses health data.** TypeSafe's DPA lists sensitive
  data as "N/A", RevenueCat's DPA makes the customer keep special-category
  data out, and both want their processing disclosed to users. See
  [Notices, consent, and sensitive data](#notices-consent-and-sensitive-data).

## Jev's request for each partner line

The API reference, SDK methods, prices, and terms are in the
[Jev notes][jev-notes], and the patterns are in the
[Jev pattern notes][jp-notes]. This section covers the one request the relay
makes per partner line, with 2 Choices and 40 Nouls, as the
[idea][idea-jev] describes it.

[jev-notes]: /docs/research/jev.md
[jp-notes]: /docs/research/jev-patterns.md

### The request body for one partner line

- **Data can ride in a question.** "The `instructions` property can be a
  string, an object, or an array. ... Put the question in one field and the
  data in the others, and refer to the data fields by name in backticks, the
  same way you point a question at a nested `state` value" ([ts-api]).
- **One Noul per candidate is TypeSafe's pattern.** The Noul page checks a
  resume against three database records in one request: "Each record goes
  into a `potential_duplicate` field as it is, the `question` is the same for
  every record, and all the records are checked in one request." Its keys,
  such as `same_as_record_18`, "contain each record's database ID"
  ([ts-noul]). The build guide adds: "When a value comes from a database, put
  it in its own field instead of splicing it into a string template."
  ([ts-build])
- **Unrelated state costs accuracy; more questions don't.** "Jev suffers
  from context rot, so unrelated material in the `state` costs you
  accuracy." ([ts-jagged]) "Each question is evaluated independently, so
  adding more questions does not create context-rot." ([ts-intro])
- **Paths into the state also work.** A question can name part of the state
  "with a dot-and-index path to its key, including the backticks"
  ([ts-primitives]), so `` `candidates[3]` `` is valid.
- **"None" comes from Nouls.** "Unlike the Choice probabilities, the Noul
  probability doesn't depend on the other options, so it can fall near zero
  when the document has no answer." ([cb-semantic-find]) With one Noul per
  candidate, "Each is answered on its own, so they can all come back low"
  ([cb-skill-suggestion]). A Choice needs "an `other` or `none of the above`
  option when the list might not cover every input" ([ts-choice]).
- **Not yet shown at Turn's size.** TypeSafe's per-candidate examples ask
  about three candidates in a request ([ts-noul]; [cb-skill-suggestion]);
  its re-ranking cookbook sends "one request per candidate" and adds that "A
  real application would ask several questions about the same pair in one
  call." ([cb-rerank])

Synthesis: the body below keeps the state to the partner's line and the
place and gives each phrase its own Noul, as the Noul page does. The idea's
first layout, with the 40 phrases in the state and `` `candidates[3]` `` in each
Noul, is valid too, but then each Noul reads 39 phrases it isn't about; the
evaluation can try both. Keys stay in code: "The key is not sent to the
underlying model and is not used in inference." ([ts-api]) The relay sends
the body to `POST https://api.typesafe.ai/v1/systemone` with a `Bearer` key
and a JSON content type, as the [Jev notes][jev-api] show.

```jsonc
{
  "model": "jev-1.13.0",
  "state": { "partner_line": "How was physio today, [PERSON_1]?", "place": "clinic" },
  "questions": {
    "kind": {
      "type": "choice",
      "instructions": "What kind of question is `partner_line`?",
      "criteria": {
        "yes_no": "Can be answered with yes or no",
        "choice_between_options": "Asks the listener to pick one of the options it names",
        "open": "Needs an answer in the listener's own words",
        "not_a_question": "A statement, greeting, or comment, not a question"
      }
    },
    "topic": {
      "type": "choice",
      "instructions": "What topic is `partner_line` about?",
      "criteria": { "health": null, "feelings": null, "food_and_drink": null, "plans": null, "other": null }
    },
    "c00": {
      "type": "noul",
      "instructions": {
        "phrase": "It was hard",
        "question": "`phrase` answers what the partner just said in `partner_line`."
      }
    },
    "c01": {
      "type": "noul",
      "instructions": {
        "phrase": "It went well",
        "question": "`phrase` answers what the partner just said in `partner_line`."
      }
    }
    // c02 to c39 have the same shape
  }
}
```

[ts-build]: https://docs.typesafe.ai/concepts/how-to-build-with-system-one
[ts-intro]: https://docs.typesafe.ai/introduction
[cb-semantic-find]: https://docs.typesafe.ai/cookbooks/semantic_find
[cb-skill-suggestion]: https://docs.typesafe.ai/cookbooks/skill_suggestion
[ts-choice]: https://docs.typesafe.ai/primitives/choice

### The SDK call for Turn

- **No new SDK.** `@typesafe-ai/sdk` 0.6.0, published September 15, 2026 at
  18:17 UTC, is still npm's `latest` ([npm-ts-sdk]), and the changelog's
  newest entry is still v0.6.0 ([ts-js-changelog]).
- **Workers.** The package declares only `"node": ">=20"` ([npm-ts-sdk]),
  and no TypeSafe page names Cloudflare Workers, but the source checks
  `g.navigator?.userAgent === "Cloudflare-Workers"` and reports the runtime
  as `cloudflare-workers` ([gh-js-runtime]). The SDK ran under workerd in the
  [Cloudflare notes' local test][cf-sdk].
- **Helpers.** `noul(instructions = null, criteria?)` and
  `choice(instructions, criteria)` build the questions, and the SDK's own
  checks reject only an empty question set and a Score under two levels, so
  a Choice's size and a bare Noul reach the server unchecked
  ([gh-js-questions]).
- **Request ID.** `.withResponse()` adds `requestId`, the "Request ID from
  `x-typesafe-request-id`, or `undefined` when absent" ([gh-js-api-promise]).

Synthesis: the relay's call sets every option in code, as the
[Cloudflare notes][cf-sdk] advise. Keys built at run time lose their
per-key answer types, so the code checks each answer's `type`:

```ts
import { choice, noul, TypeSafeClient } from '@typesafe-ai/sdk'

const client = new TypeSafeClient({
  apiKey: env.TYPESAFE_API_KEY,
  defaultModel: 'jev-1.13.0',
  logLevel: 'off',
  timeout: 1500,
  retry: { maxRetries: 1, respectRetryAfter: false }
})

const ANSWERS = '`phrase` answers what the partner just said in `partner_line`.'
const questions = {
  kind: choice('What kind of question is `partner_line`?', KIND_OPTIONS),
  topic: choice('What topic is `partner_line` about?', TOPIC_OPTIONS),
  ...Object.fromEntries(
    phrases.map((phrase, i) => [`c${String(i).padStart(2, '0')}`, noul({ phrase, question: ANSWERS })])
  )
}

const { data, requestId } = await client
  .systemOne({ state: { partner_line: line, place }, questions }, { signal: AbortSignal.timeout(2500) })
  .withResponse()
```

[ts-js-changelog]: https://docs.typesafe.ai/sdk/javascript/changelog
[gh-js-runtime]: https://github.com/typesafe-ai/typesafe-sdk-js/blob/v0.6.0/src/runtime.ts
[gh-js-questions]: https://github.com/typesafe-ai/typesafe-sdk-js/blob/v0.6.0/src/questions.ts
[gh-js-api-promise]: https://github.com/typesafe-ai/typesafe-sdk-js/blob/v0.6.0/src/api-promise.ts

### Limits on questions, options, and state

- **Token budgets.** "64k tokens per request; 32k tokens for `state` plus
  the longest question", which the models page now explains: "Jev ingests
  the `state` once and evaluates every question against it in parallel. The
  64k budget covers the `state` plus all questions combined; the 32k budget
  applies to the `state` plus the single longest question." ([ts-models])
- **No question count.** The live OpenAPI schema, version 0.2.0, gives
  `questions` `"minProperties": 1`, no maximum, and no pattern for keys
  ([ts-openapi]), and no docs page sets a count. The biggest single requests
  TypeSafe publishes are "62 questions about 17 blocks, one request, 0.51s"
  ([cb-autoformat]) and "54 questions per command" ([cb-function-calling]).
- **Choice options.** "You can have a maximum of 255 options per Choice."
  ([ts-api]) A community test, not TypeSafe's, got
  `400 {"detail":"Too many choices. Must have at most 255 choices."}` for
  256 labels, and a 400 for an empty question key or a Noul with neither
  instructions nor criteria ([gh-js-6]).
- **Bytes.** No page gives a request-body byte limit or mentions `413`.
- Synthesis: a Turn request of about 1,900 tokens uses about 3% of the 64k
  budget, its Choices need 4 options and one per phrase-bank category, and
  its 42 questions sit under the 54 and 62 of TypeSafe's cookbooks. Nothing
  documented limits it, though no published run has 40 candidate Nouls in
  one request.

[cb-autoformat]: https://docs.typesafe.ai/cookbooks/autoformat
[cb-function-calling]: https://docs.typesafe.ai/cookbooks/function_calling

### The response the relay reads

- **Shape.** `answers` holds "Answers keyed by the question names supplied
  in the request", and `model` "May differ from the alias supplied in the
  request" ([ts-openapi]).
- **A Noul is one number.** A Noul answer holds `type` and `noul`, the
  "Probability of a yes answer or a true statement, from 0 to 1"
  ([ts-openapi]); "Noul has no separate `confidence`." ([ts-primitives])
- **A Choice** holds `choice`, `confidence`, and `probabilities`, whose
  "values sum to approximately 1" ([ts-openapi]).
- **No order.** No page defines the order of keys in `answers` or
  `probabilities`, and the quickstart's response lists "technical" before
  "billing" though its request lists billing first ([ts-quickstart]).
- **Thresholds are the app's.** On the per-candidate example: "Threshold each
  value in your code ... and send the middle values to a person." ([ts-noul])
  The idea's bars, 0.85 and 0.6, come from TypeSafe's
  [routing example][jp-routing].
- Synthesis: the relay returns the scores keyed by the phone's own phrase
  IDs, never by position, with the `model` field and the request ID, so a
  support request can name the exact call.

[jp-routing]: /docs/research/jev-patterns.md#confidence-gated-routing-pattern

### Errors, retries, and timeouts

The documented statuses (401, 422, 429, and 529) and the live API's 403 for
a missing key are in the [Jev notes][jev-api]. New, or specific to Turn:

- **`Retry-After` isn't promised.** The SDKs "honor the `retry-after` header
  when the response carries one" ([ts-models]); no page says a 429 always
  carries one.
- **Validation bodies.** The OpenAPI schema documents only `422`, an
  `HTTPValidationError` whose `detail` items hold `loc`, `msg`, and `type`
  ([ts-openapi]); the community tests above got `400` with a string
  `detail` ([gh-js-6]).
- **Running out of credits is undocumented.** With no auto-refill and a zero
  balance, "TypeSafe may decline to generate Output in response to
  Customer's submission of Input" (MCA section 8.2, [ts-mca]), and no page
  names the status. The SDK maps 400, 401, 403, 404, 422, and 429 to their
  own error classes and any status from 500 up to `InternalServerError`;
  everything else, 402 and 413 included, becomes the base `APIError`
  ([gh-js-errors]).
- **Defaults.** `DEFAULT_TIMEOUT_MS = 10_000`, a "Timeout per attempt in
  milliseconds; there is no total retry budget." The default policy retries
  twice, backing off from 500 ms to at most 5,000 ms with 25% jitter, on
  "408, 429, and 500–599", so a 529 retries and a 402 doesn't
  ([gh-js-retry]; [gh-js-types]).
- **Server delays.** The SDK reads `retry-after-ms`, then `Retry-After`, and
  follows the server's delay only up to `maxRetryAfterMs`: "Maximum server
  retry delay in milliseconds; longer delays use backoff. Default: 60000."
  ([gh-js-types]) An open issue reports that a blank `Retry-After` retries
  at once ([gh-js-9]).
- **Open issues.** None of the seven open JS SDK issues concerns Workers or
  many-question requests, and none has a reply from TypeSafe
  ([gh-js-issues]).
- Synthesis: the defaults let one call run about 31.5 seconds before any
  server delay, far past a conversational turn. The settings above allow two
  attempts of 1.5 seconds inside a 2.5-second `signal`, ignore server
  delays, and leave a 402 for the relay to catch as "out of credits". Past
  that, the phone ranks by itself, as the [idea's risks][idea-risks] plan.

[gh-js-errors]: https://github.com/typesafe-ai/typesafe-sdk-js/blob/v0.6.0/src/errors.ts
[gh-js-retry]: https://github.com/typesafe-ai/typesafe-sdk-js/blob/v0.6.0/src/retry.ts
[gh-js-9]: https://github.com/typesafe-ai/typesafe-sdk-js/issues/9
[gh-js-issues]: https://github.com/typesafe-ai/typesafe-sdk-js/issues

### The model pin on September 22, 2026

- **One model.** The models page lists only `jev-1.13.0`, and
  "`jev-preview` currently points to the same model as `jev-latest`. There
  is no preview build available right now." ([ts-models])
- **Pinning is TypeSafe's advice.** "If you have tuned confidence thresholds
  against a specific version, pin that version's ID instead of the alias and
  move to the new one on your own schedule." ([ts-models])
- **The pin works though unlisted.** `GET /v1/models` "currently lists the
  aliases. Versioned IDs such as `jev-1.13.0` are accepted by the `model`
  field whether or not they appear in the list." ([ts-models]) Synthesis: a
  startup check for `jev-1.13.0` in that list would fail wrongly.
- **No retirement policy.** No page says how long a pinned ID stays; the
  MCA promises only "commercially reasonable efforts to provide advance
  notice" of updates that break an integration (section 2.5, [ts-mca]).
- **Nothing newer yet.** The jaggedness page still reads "**Applies to
  `jev-1.13`.** Last reviewed 2026-09-17" and says "Many of these will be
  fixed in later versions." ([ts-jagged]) The docs' newest sitemap dates,
  08:57 UTC on September 22, 2026, are on 17 cookbooks ([ts-sitemap]), and
  the parallel-questions and re-ranking cookbooks among them still set
  `TYPESAFE_MODEL = "jev-1.12"` ([cb-parallel]; [cb-rerank]).
- **Status.** "All services are online", with "99.839% uptime" for
  `api.typesafe.ai`, updated at 2:00 PM UTC on September 22, 2026, and no
  incident after the "API issues" of September 21, 2026 ([ts-status];
  [jp-changed]).
- Synthesis: keep `jev-1.13.0`, and log each response's `model` field,
  which "reports the versioned ID that answered" ([ts-models]), so a silent
  change would show.

[ts-sitemap]: https://docs.typesafe.ai/sitemap.xml
[ts-status]: https://status.typesafe.ai/
[jp-changed]: /docs/research/jev-patterns.md#what-changed-since-the-jev-notes

### How a Jev request is billed

- **Input tokens only.** "Charged per input token. Output tokens are free."
  ([ts-models]) `usage.input_tokens` is the "Number of billable input tokens
  used to evaluate the request." ([ts-openapi])
- **The state counts once.** "Adding questions barely changes the response
  time and costs only the tokens for the extra questions, which are cheap."
  ([ts-primitives]) "The document dominates every request. N single-question
  calls pay for it N times, in N round trips; the batched call pays once."
  ([cb-parallel])
- **Published usage.** One short Noul about a one-sentence state used 296
  input tokens ([ts-api]), the quickstart's three questions used 392
  ([ts-quickstart]), and the Noul page's three candidate records used 535
  ([ts-noul]).
- Synthesis: in the parallel-questions cookbook's run on `jev-1.12`, the
  batched call of 13 questions cost $0.000497, about 11,833 tokens at $0.042
  per million, against $0.006090 for 13 single calls, about 11,154 tokens
  each ([cb-parallel]), so each extra question cost about 57 tokens. The
  296-token example puts a request's fixed overhead near 280 tokens. A Turn
  request with 40 phrases of about 14 characters then comes to roughly 1,700
  to 1,900 input tokens, depending on the layout: about $0.00007 to $0.00008
  a line, or $5.20 to $5.80 a year at 200 lines a day, against the
  "about 1,500" tokens and $4.60 the idea first estimated ([idea-money]).
  TypeSafe's tokenizer isn't published, so the relay should log
  `usage.input_tokens` from its first real call.

## The relay on Cloudflare Workers

Plans, KV, Durable Object basics, the Rate Limiting binding, secrets, and
Jev's SDK under workerd are in the [Cloudflare notes][cf-notes]. This
section covers what changed since and what Turn's relay needs: it holds the
Jev key and a RevenueCat secret key, counts 20 free lines per device, checks
`listen` past them, and makes one Jev call per line ([idea-stack]).

[cf-notes]: /docs/research/cloudflare-workers.md
[idea-stack]: /docs/IDEA.md#stack-and-data-flow

### Counting free partner lines per device

- **Cloudflare's guidance.** Its storage guide gives Durable Objects "global
  coordination across clients; real-time WebSocket applications; strongly
  consistent, transactional storage", KV data that is "not typically
  modified (within KV's 1 write RPS per unique key limit), and do not need to
  be immediately consistent", and D1 "Relational data, including user
  profiles, product listings and orders" ([cf-storage-options]).
- **KV can't count.** Besides its [eventual consistency][cf-kv], "KV is not
  ideal for applications where you need support for atomic operations", and
  the Free plan allows "1,000 writes per day" ([cf-kv-how];
  [cf-kv-limits]).
- **D1 is exact but fails hard on Free.** "Each individual D1 database is
  inherently single-threaded, and processes queries one at a time."
  ([cf-d1-limits]) "Beginning September 1, 2026, D1 queries on the Workers
  Free plan will fail when an account exceeds the daily row read or row
  write limits" ([cf-d1-free-enforce]), which are 5 million rows read and
  100,000 written a day ([cf-d1-pricing]). Free also caps D1 at 10
  databases of 500 MB and 50 queries per Worker invocation ([cf-d1-limits]).
- **A Durable Object fits a device.** "Create one Durable Object per logical
  unit that needs coordination: a chat room, a game session, a document, a
  user's data, or a tenant's workspace." The same page warns against "using
  a Durable Object for global rate limiting or global counters"
  ([cf-do-rules]). `transactionSync()` runs a synchronous callback as one
  transaction that rolls back if it throws ([cf-do-sqlite]).
- **Free limits.** As in the [Cloudflare notes][cf-do-free], 100,000
  requests and 100,000 rows written a day, with one new line: "Durable
  Objects that are idle and eligible for hibernation are not billed for
  duration, even before the runtime has hibernated them." ([cf-do-pricing])
- **Local test.** Wrangler 4.136.2 ran one SQLite object per device, a
  `free_lines` table keyed by line ID, and a claim inside
  `transactionSync()`. Twenty-five simultaneous distinct lines for one device
  got exactly 20 free and 5 refused; ten simultaneous copies of one line ID
  counted once; and a repeated line past the cap still came back free, as a
  repeat. The first insert reported `rowsWritten` 2, the row and its
  primary-key index.

The claim the local test ran, trimmed:

```ts
export class Device extends DurableObject<Env> {
  claim(lineId: string): 'free' | 'repeat' | 'paid' {
    return this.ctx.storage.transactionSync(() => {
      const sql = this.ctx.storage.sql
      if (sql.exec('SELECT 1 FROM free_lines WHERE line_id = ?', lineId).toArray().length > 0) return 'repeat'
      const used = sql.exec('SELECT COUNT(*) AS n FROM free_lines').one().n as number
      if (used >= FREE_LINES) return 'paid'
      sql.exec('INSERT INTO free_lines (line_id, at) VALUES (?, ?)', lineId, Date.now())
      return 'free'
    })
  }
}
```

- Synthesis: one object per device, reached with
  `getByName(appUserId, { locationHint: 'wnam' })`, holds at most 20 line
  IDs and, once RevenueCat confirms it, a `listen` flag, since the purchase
  is one-time. The phone sends a random ID with each line, so a retried
  request never counts twice. Each new free line writes 2 rows, so Free's
  100,000 rows a day cover about 2,500 devices spending all 20 lines in one
  day. Counting a line only when Jev answers takes a second call to the
  object, to commit or release the claim, which the TRD has to choose.

[cf-storage-options]: https://developers.cloudflare.com/workers/platform/storage-options/
[cf-kv]: /docs/research/cloudflare-workers.md#kv-consistency-and-caching
[cf-kv-how]: https://developers.cloudflare.com/kv/concepts/how-kv-works/
[cf-kv-limits]: https://developers.cloudflare.com/kv/platform/limits/
[cf-d1-limits]: https://developers.cloudflare.com/d1/platform/limits/
[cf-d1-free-enforce]: https://developers.cloudflare.com/changelog/post/2026-09-01-d1-free-tier-limit-enforcement/
[cf-d1-pricing]: https://developers.cloudflare.com/d1/platform/pricing/
[cf-do-sqlite]: https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/
[cf-do-free]: /docs/research/cloudflare-workers.md#durable-objects-on-the-free-and-paid-plans
[cf-do-pricing]: https://developers.cloudflare.com/durable-objects/platform/pricing/

### The Rate Limiting binding for Turn

- **Unchanged.** Periods of 10 or 60 seconds, counters per Cloudflare
  location, and "permissive, eventually consistent" counting, as in the
  [Cloudflare notes][cf-ratelimit-notes] ([cf-ratelimit]).
- **Newly quoted.** "The Rate Limiting API is backed by the same
  infrastructure that serves rate limiting rules." Good keys include "API
  keys in `Authorization` HTTP headers, URL paths or routes, specific query
  parameters used by your application, and/or user IDs and tenant IDs."
  ([cf-ratelimit])
- **Local development.** "Rate limiting logic should be tested against local
  simulations" ([cf-local-dev]). Local test: with a limit of 3 per 10
  seconds, five calls in a row returned `[true, true, true, false, false]`.
- **Price.** Still none stated, and no word on the Free plan
  ([cf-ratelimit]; [cf-ratelimit-ga]).
- Synthesis: key it by app user ID with a burst limit a conversation never
  reaches, such as 10 lines a minute. With the placement below, the Worker
  runs in one data center near us-west-2, so its per-location counters act
  almost like global ones; that is inference, not a documented property.

[cf-ratelimit-notes]: /docs/research/cloudflare-workers.md#the-rate-limiting-binding
[cf-local-dev]: https://developers.cloudflare.com/workers/local-development/
[cf-ratelimit-ga]: https://developers.cloudflare.com/changelog/post/2025-09-19-ratelimit-workers-ga/

### Secrets and wrangler.jsonc for the relay

- **Required secrets now filter local files.** "When defined, only the keys
  listed in `secrets.required` are loaded from `.dev.vars` or `.env`.
  Additional keys are excluded and missing keys produce a warning."
  ([cf-secrets]) "Required secrets are validated during local development
  and deploy" ([cf-wrangler-config]).
- **Logs are on by default.** `observability.enabled` "Defaults to `true`
  for all new Workers" ([cf-wrangler-config]).
- **Object declarations.** `storage` is "One of `"sqlite"` (recommended;
  required for new namespaces)", and "`migrations` and `exports` are
  mutually exclusive." ([cf-wrangler-config])
- **Local test.** Wrangler 4.136.2 accepted a configuration of this shape in
  `wrangler dev` and `wrangler deploy --dry-run`; every key is on the
  configuration, placement, or Workers Logs pages:

```jsonc
{
  "name": "turn-relay",
  "main": "src/index.ts",
  "compatibility_date": "2026-09-22",
  "placement": { "region": "aws:us-west-2" },
  "durable_objects": { "bindings": [{ "name": "DEVICE", "class_name": "Device" }] },
  "exports": { "Device": { "type": "durable-object", "storage": "sqlite" } },
  "ratelimits": [{ "name": "LINE_LIMITER", "namespace_id": "1001", "simple": { "limit": 10, "period": 60 } }],
  "observability": { "enabled": true, "logs": { "invocation_logs": false } },
  "secrets": { "required": ["TYPESAFE_API_KEY", "RC_SECRET_KEY"] }
}
```

- Synthesis: the RevenueCat project ID and the `listen` entitlement's ID
  are configuration, not secrets, so they go in `vars`. `.dev.vars` stays
  out of git, and a committed example file names the two secrets for anyone
  who runs the relay with their own keys.

[cf-secrets]: https://developers.cloudflare.com/workers/configuration/secrets/

### Workers Logs and traces for the relay

- **Unchanged.** Free keeps 200,000 events a day for 3 days, and Paid 20
  million a month for 7 days ([cf-workers-logs]; [cf-logs-notes]).
- **What an invocation log holds.** "Each Workers invocation returns a single
  invocation log that contains details such as the Request, Response, and
  related metadata." ([cf-workers-logs]) The page doesn't say whether it
  redacts headers. Tail Workers do: a header's value becomes `REDACTED` when
  its name is `cookie` or `set-cookie` or contains "auth", "key", "secret",
  "token", or "jwt" ([cf-tail-handler]).
- **Traces count from October 1, 2026.** "Starting on October 1, 2026, tracing
  will be billed as part of your usage on the Workers Free Paid and
  Enterprise plans. Each span in a trace represents one observability event,
  sharing the same monthly quota and pricing as Workers logs" ([cf-traces]).
  Tracing stays off unless `observability.traces.enabled` is set, and a
  fetch span records `url.full`, `url.query`, four request headers, and the
  body's size, not the body ([cf-trace-spans]).
- **Exceptions carry detail.** Since August 24, 2026, a logged exception
  "includes the exception name, message, and stack." ([cf-exception-logs])
- Synthesis: the partner's line and the phrases travel only in POST bodies
  and never reach `console.log`, and the relay logs event names, statuses,
  and latencies. RevenueCat's v2 endpoint puts the app user ID in its path
  ([rc-notes-v2]), so a trace of that call would keep the ID for 3 or 7
  days; leave tracing off through judging, which ends October 13, 2026. Map
  SDK errors to the relay's own codes before logging, as the
  [Cloudflare notes][cf-sdk] advise.

[cf-logs-notes]: /docs/research/cloudflare-workers.md#workers-logs
[cf-tail-handler]: https://developers.cloudflare.com/workers/runtime-apis/handlers/tail/
[cf-trace-spans]: https://developers.cloudflare.com/workers/observability/traces/spans-and-attributes/
[cf-exception-logs]: https://developers.cloudflare.com/changelog/post/2026-08-24-preserve-exception-info/

### Placement near TypeSafe and RevenueCat

- **Region hints.** Since January 22, 2026, `placement.region` takes a
  cloud region "using the format `{provider}:{region}`", with `aws:us-west-2`
  among the examples, and "Cloudflare maps your specified cloud region to the
  data center with the lowest latency to that region." The page recommends
  it for a "Single back-end service in a known cloud region"
  ([cf-placement]; [cf-placement-hints]).
- **Scope.** "Placement only affects the execution of fetch event handlers.
  It does not affect RPC methods or named entrypoints", and "Durable Objects
  provide automatic placement without configuration." The page advises: "Do
  as much work as possible within the Durable Object and return a composite
  result, rather than making multiple round-trips from your Worker"
  ([cf-placement]).
- **Smart Placement** "is available on all Workers plans", but it "only
  considers locations where the Worker has previously run", and "The
  `cf-placement` header may be removed before Smart Placement exits beta."
  ([cf-placement])
- **Where the services are.** At about 14:07 UTC on September 22, 2026,
  `api.typesafe.ai` resolved to two EC2 addresses in us-west-2, as the
  [Cloudflare notes][cf-latency] found. `api.revenuecat.com` resolved to four
  Amazon CloudFront edge addresses, with a `via` header naming CloudFront,
  and neither service's addresses fall in Cloudflare's published ranges
  ([cf-ips]). RevenueCat's origin region can't be seen from outside.
- Synthesis: run the fetch handler with
  `"placement": { "region": "aws:us-west-2" }` and create each device's
  object with `locationHint: "wnam"`. A line then crosses an ocean once,
  from the phone's nearest Cloudflare location to the placed Worker, while
  the object call, the Jev call, and the RevenueCat call, which a nearby
  CloudFront edge answers, stay in western North America. With default
  placement, a phone in Asia pays two Pacific round trips per line: the
  Worker to its object, and the Worker to Jev.

[cf-placement-hints]: https://developers.cloudflare.com/changelog/post/2026-01-22-explicit-placement-hints/
[cf-latency]: /docs/research/cloudflare-workers.md#latency-and-placement
[cf-ips]: https://www.cloudflare.com/ips-v4

### Free and Paid limits for the relay

Plan prices are in the [Cloudflare notes][cf-prices]. What bears on judging:

- **Daily requests.** Free allows "100,000/day", and "When a Worker exceeds
  this limit, Cloudflare returns Error 1027", until midnight UTC
  ([cf-limits]).
- **CPU.** An HTTP request gets "10 ms" of CPU on Free and "5 min (default:
  30 seconds)" on Paid; past it, Cloudflare returns Error 1102 with the
  message `Worker exceeded resource limits` ([cf-limits]).
- **Subrequests.** An invocation gets "50" on Free and "10,000 (up to 10M)"
  on Paid, and a new row, "Subrequests to internal services", gives Free
  "1,000" ([cf-limits]).
- **Logs and traces.** 200,000 events a day on Free, which traces share
  from October 1, 2026 ([cf-traces]).
- Synthesis: a line costs one Worker request, one object request, two rows
  written while it's free, two or three subrequests, and a few log events,
  so Free covers judging many times over. The risk is a script minting
  device IDs: it could reach 100,000 requests, leave the relay returning
  Error 1027 until midnight UTC, and burn Jev credits on the way. The $5 Paid
  plan removes the daily cap; a global daily Jev budget and the phone's own
  ranking cover the rest.

[cf-prices]: /docs/research/cloudflare-workers.md#workers-free-and-paid-prices
[cf-limits]: https://developers.cloudflare.com/workers/platform/limits/

### Wrangler's version

- **Wrangler 4.136.2**, published at 09:37 UTC on September 22, 2026, is
  npm's `latest`; it needs Node.js 22 or newer (`"node": ">=22.0.0"`) and
  depends on workerd 1.20260921.1 and Miniflare 5.20260921.0-alpha
  ([npm-wrangler]). workerd's own `latest` is 1.20260922.1, from 01:22 UTC
  the same day ([npm-workerd]).
- **Compatibility date.** The configuration page's sample shows
  `"compatibility_date": "2026-09-22"` under "Set this to today's date"
  ([cf-wrangler-config]). Local test: Wrangler 4.136.2 ran with that date and
  no warning at 14:10 UTC on September 22, 2026, where 4.136.1 had refused it
  at 22:14 UTC on September 21, 2026 ([cf-compat]).
- **Flags.** The newest default for JavaScript Workers is still Node.js
  compatibility from 2026-08-04 ([cf-compat-flags]).

[cf-compat]: /docs/research/cloudflare-workers.md#config-files-and-compatibility-dates
[cf-compat-flags]: https://developers.cloudflare.com/workers/configuration/compatibility-flags/

### Workers AI for the evaluation script

The models and prices in the [technology notes][tech-embeddings] still hold.
New:

- **Free includes it.** "Workers AI is included in both the Free and Paid
  Workers plans", at "$0.011 per 1,000 Neurons", with "10,000 Neurons per
  day at no charge" ([cf-ai-pricing]). No embedding model is among the models
  that need Workers Paid since July 28, 2026 ([cf-ai-paid-models]) or on the
  planned deprecations ([cf-ai-deprecations]).
- **More models.** `@cf/baai/bge-large-en-v1.5` gives 1,024 dimensions for
  "$0.204 per M input tokens" at 1,500 requests a minute ([cf-bge-large];
  [cf-ai-pricing]; [cf-ai-limits]), and `@cf/google/embeddinggemma-300m` is
  marked "Beta" ([cf-embeddinggemma]). `@cf/baai/bge-reranker-base` scores
  pairs instead: it "uses question and document as input and directly output
  similarity instead of embedding" ([cf-bge-reranker]).
- **Pooling.** For the BGE English models, "`cls` pooling will generate more
  accurate embeddings on larger inputs - however, embeddings created with
  cls pooling are not compatible with embeddings generated with mean
  pooling. The default pooling method is `mean`" ([cf-bge-base]).
- **Qwen3 takes a task.** `@cf/qwen/qwen3-embedding-0.6b` accepts `queries`
  and `documents`, up to 32 each, and an `instruction` that defaults to
  "Given a web search query, retrieve relevant passages that answer the
  query" ([cf-qwen3-embed]).
- **From a script.** A model runs at
  `https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/{model}`
  with `Authorization: Bearer {API_TOKEN}`, and a custom token "will need
  permissions for both" `Workers AI - Read` and `Workers AI - Edit`
  ([cf-ai-rest]).
- Synthesis: the evaluation's 80 lines and about 150 phrases come to a few
  thousand tokens, far inside the free 10,000 Neurons a day. Qwen3 with an
  instruction such as "Given what a conversation partner said, retrieve the
  reply that answers it" matches Turn's task better than plain similarity,
  and the reranker adds a pairwise baseline closer to Jev's Nouls. The
  README's table should name each model and its pooling.

[tech-embeddings]: /docs/research/next-gen-tech.md#workers-ai-embeddings-and-vectorize
[cf-ai-pricing]: https://developers.cloudflare.com/workers-ai/platform/pricing/
[cf-ai-paid-models]: https://developers.cloudflare.com/changelog/post/2026-07-28-models-require-workers-paid/
[cf-ai-deprecations]: https://developers.cloudflare.com/changelog/post/2026-05-08-planned-model-deprecations/
[cf-bge-large]: https://developers.cloudflare.com/workers-ai/models/bge-large-en-v1.5/
[cf-ai-limits]: https://developers.cloudflare.com/workers-ai/platform/limits/
[cf-embeddinggemma]: https://developers.cloudflare.com/workers-ai/models/embeddinggemma-300m/
[cf-bge-reranker]: https://developers.cloudflare.com/workers-ai/models/bge-reranker-base/
[cf-bge-base]: https://developers.cloudflare.com/workers-ai/models/bge-base-en-v1.5/
[cf-qwen3-embed]: https://developers.cloudflare.com/workers-ai/models/qwen3-embedding-0.6b/
[cf-ai-rest]: https://developers.cloudflare.com/workers-ai/get-started/rest-api/

## RevenueCat Test Store for Turn

What Test Store is and its SDK minimums are in the
[Next Gen notes][ng-purchase], and the release-build crash in the
[RevenueCat and Expo notes][rc-notes-keys]. This section covers Turn's
one-time `listen` purchase, sold in debug builds through Test Store only
([idea-money]).

[ng-purchase]: /docs/research/next-gen.md#purchase-paths-without-a-store-listing
[rc-notes-keys]: /docs/research/revenuecat-expo.md#configuring-the-sdk-and-api-keys

### Setting up Test Store in the dashboard

- **It comes with the project.** "During the setup of a _new_ RevenueCat
  project, a Test Store will be automatically created with products." A
  project without one can "create one on the **Apps and providers** tab in
  the sidebar. In the _Test configuration_ section, create a new Test Store
  and you will be presented with an API key to use in the SDK."
  ([rc-test-store])
- **Products.** "Navigate to **Product catalog → Products**", "Select the
  **Test Store** tab", "Click **+ New**", and "Configure the product details
  (name, identifier, price, duration)" ([rc-config-products]); the products
  overview words the last step as "Enter a product identifier and configure
  pricing" ([rc-products]).
- **No edits.** "You cannot edit an existing product's identifier, duration,
  or price in the dashboard after it has been saved"; the fix is a new
  product swapped into the package ([rc-test-store]).
- **Entitlement and offering.** "Navigate to **Product catalog →
  Entitlements**", "Click **+ New**", then attach the product; "The offering
  marked as "default" is automatically returned as `currentOffering` in the
  SDK." ([rc-config-products]) A package takes an identifier from a list of
  durations, and "If a duration isn't suitable for your package (e.g.
  consumable purchases), then you can choose a custom identifier."
  ([rc-offerings])
- **One-time purchases unlock for good.** "non-consumable and consumable
  purchases that are attached to an entitlement will unlock that content
  **forever**." ([rc-entitlements])
- **A CLI can script it.** `@revenuecat/cli` 0.1.3, published September 18,
  2026 ([npm-rc-cli]), has `rc products prices set`, to "Create or update
  Test Store prices idempotently", and `rc customers simulate-purchase`, to
  "Create a real headless Test Store transaction" for a given app user ID
  ([rc-cli-commands]).
- Synthesis: `simulate-purchase` can give a test ID `listen` without a
  phone, so the relay's entitlement check can be tested from a script.

[rc-products]: https://www.revenuecat.com/docs/offerings/products-overview
[rc-offerings]: https://www.revenuecat.com/docs/offerings/overview
[rc-entitlements]: https://www.revenuecat.com/docs/getting-started/entitlements

### One-time products in Test Store

- **The docs don't say.** No Test Store page says "one-time", "lifetime", or
  "non-consumable"; product setup lists only "(name, identifier, price,
  duration)" ([rc-config-products]; [rc-test-store]), and RevenueCat's
  changelog has no Test Store entry ([rc-changelog]).
- **The API does.** REST API v2's create-product call takes a `type` of
  "subscription" "one_time" "consumable" "non_consumable"
  "non_renewing_subscription"; its `subscription` object is "Only supported
  for simulated store products", and its `title` "is required for Test Store
  products" ([rc-api-v2-product]). In the iOS SDK, "Simulated Store" is "the
  internal name of the "Test Store"" ([ios-config-src]).
- **The SDK does.** purchases-ios 5.90.1, the version under
  `react-native-purchases` 10.10.1, decodes Test Store products as
  `subscription`, `consumable`, or `nonConsumable = "non_consumable"`
  ([ios-webproducts-src]) and maps them to its own product types
  ([ios-sim-product-src]). Its test of a "Test Lifetime Product" expects
  `productType == .nonConsumable`, `productCategory == .nonSubscription`, and
  no subscription period ([ios-sim-tests-src]). The JavaScript types include
  `PRODUCT_TYPE.NON_CONSUMABLE` and `PACKAGE_TYPE.LIFETIME` ([phc-offerings]).
- **The yearly fallback fails.** "Each test subscription will renew
  automatically up to 5 times, after which it will cancel and its associated
  entitlements will become inactive", and a 1-year product renews every "1
  hour" and ends after "5 hours" ([rc-test-store]).
- Synthesis: the API and the SDK both support a one-time `listen` product;
  only whether the dashboard's form offers the type is unverified. If it
  doesn't, `POST /v2/projects/{project_id}/products` with
  `"type": "non_consumable"`, which needs a secret key with
  `project_configuration:products:read_write` ([rc-api-v2-product]), is a
  documented route. The yearly fallback the idea first planned would lock Listen
  mode five hours after a purchase, mid-judging, so it is no fallback.

[rc-changelog]: https://www.revenuecat.com/changelog
[rc-api-v2-product]: https://www.revenuecat.com/docs/api-v2/product
[ios-webproducts-src]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/Sources/Networking/Responses/WebBillingProductsResponse.swift
[ios-sim-product-src]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/Sources/Purchasing/SimulatedStore/WebBillingProduct+SimulatedStoreProduct.swift
[ios-sim-tests-src]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/Tests/UnitTests/Purchasing/SimulatedStoreUnitTests/WebProductToStoreProductConversionTests.swift
[phc-offerings]: https://github.com/RevenueCat/purchases-hybrid-common/blob/19.2.0/typescript/src/offerings.ts

### The Test Store API key

- **Format.** purchases-ios 5.90.1 treats a key that starts with `test_` as
  a Test Store key, with `test_` and 32 letters in its example
  ([ios-config-src]).
- **Where it is.** It appears when the Test Store is created; later, "You
  can find both types of keys in **Project Settings > API keys** in the
  RevenueCat dashboard." ([rc-configure])
- **Committing it.** No docs page says whether it may sit in a public
  repository. RevenueCat's engineering blog of November 12, 2025 says "You
  can use this key just like a regular secret API key when running in a test
  environment" and loads it from `local.properties`: "This keeps secrets out
  of version control." ([rc-blog-tests]) Its company post of December 19,
  2025, updated January 6, 2026, lists "Rotate Test API keys for safety and
  keep test traffic out of revenue metrics" ([rc-blog-test-store]).
- **Release builds crash.** Under
  `#if !DEBUG && !BYPASS_SIMULATED_STORE_RELEASE_CHECK`, a Test Store key in
  a Release build logs an error that starts
  `[RevenueCat]: Test Store API key used in Release build`, shows an alert
  titled "Wrong API Key" that says "The app will close now to protect the
  security of test purchases.", and calls `fatalError`
  ([ios-config-src]; [ios-sim-ui-src]). The only opt-outs are `uiPreviewMode`
  and `forceAllowTestStoreInReleaseBuilds`, added in 5.89.0
  ([gh-ios-changelog]), and `react-native-purchases` 10.10.1 configures the
  native SDK with `dangerousSettings:nil` ([rnp-native-src]).
- Synthesis: any Release build carrying the key crashes at launch, so a
  Simulator build for judges must be a Debug build, which then needs Metro
  running or its JavaScript bundle embedded; that part is unverified. The
  key is readable in any build a judge gets, so committing it opens nothing
  new, but it goes against RevenueCat's blog advice. The options are to
  commit it and rotate it after judging, or to keep it in an untracked file
  and ship it only inside the Simulator build.

[rc-configure]: https://www.revenuecat.com/docs/getting-started/configuring-sdk
[rnp-native-src]: https://github.com/RevenueCat/react-native-purchases/blob/10.10.1/ios/RNPurchases.m

### Test Store in debug builds and the Simulator

- **Versions.** Version 10.10.1 of `react-native-purchases` and of
  `react-native-purchases-ui`, published September 21, 2026, is still npm's
  `latest` ([npm-rnp]; [npm-rnpui]), on purchases-ios 5.90.1 as the
  [RevenueCat and Expo notes][rc-notes-versions] trace. purchases-ios 5.90.2
  changes nothing in Test Store ([gh-ios-changelog]).
- **Recent Test Store changes.** `react-native-purchases` 10.8.0, published
  August 25, 2026, has the entry "Match native SDKs text for simulated store
  purchase alert" ([rnp-changelog]; [npm-rnp]), and purchases-ios 5.89.0
  has "send X-Is-Sandbox header when using a Test Store API key"
  ([gh-ios-changelog]).
- **No In-App Purchase capability.** "Purchases made through the Test Store
  don't go through the App Store, so if you're starting there, you can come
  back to this step when you connect the App Store." ([rc-ios-install]) The
  React Native guide adds: "Nothing else is needed to build and test with the
  Test Store." ([rc-rn-install])
- **The Simulator.** RevenueCat's company post lists "Test in Expo, web
  previews, simulators, and dev builds that lack native store APIs"
  ([rc-blog-test-store]). In the source, the sheet is a plain alert on the
  top view controller ([ios-sim-ui-src]), and "The Simulated Store ("Test
  Store") never produces StoreKit transactions" ([ios-orchestrator-src]).
- Synthesis: the paid-only In-App Purchase capability isn't needed, and
  nothing in the sheet needs hardware the Simulator lacks, which narrows the
  [Next Gen notes' gap][ng-gaps] on Test Store in the Simulator. It still
  deserves a run on September 25, 2026, as the [idea][idea-open] plans.

[npm-rnpui]: https://registry.npmjs.org/react-native-purchases-ui
[rnp-changelog]: https://github.com/RevenueCat/react-native-purchases/blob/10.10.1/CHANGELOG.md
[rc-ios-install]: https://www.revenuecat.com/docs/getting-started/installation/ios
[rc-rn-install]: https://www.revenuecat.com/docs/getting-started/installation/reactnative
[ng-gaps]: /docs/research/next-gen.md#gaps
[idea-open]: /docs/IDEA.md#assumptions-and-open-questions

### The Test Store purchase sheet

From purchases-ios 5.90.1 ([ios-sim-ui-src]; [ios-sim-handler-src];
[ios-orchestrator-src]):

- **Text.** The title is "Test Store Purchase", and the message reads "This
  is a test purchase and should only be used during development. In
  production, use an Apple API key from RevenueCat.", followed by lines for
  "Product ID:", "Title:", and "Price:", and a period only for a
  subscription.
- **Buttons.** "Test valid purchase", "Test failed purchase", and "Cancel".
- **Success.** The SDK makes a transaction whose ID is `test_`, the purchase
  time in milliseconds, and a UUID, posts it to RevenueCat, and
  `purchasePackage` resolves with `{ customerInfo, productIdentifier }`.
- **Failure.** The purchase rejects with error code 42,
  `testStoreSimulatedPurchaseError`, "Purchase failure simulated successfully
  in Test Store." ([ios-errorcode-src]), which JavaScript sees as
  `TEST_STORE_SIMULATED_PURCHASE_ERROR = "42"` ([phc-error-codes]).
- **Cancel.** The purchase rejects with the cancelled error, and
  `react-native-purchases` sets `userCancelled` when the code is
  `PURCHASE_CANCELLED_ERROR` ([rnp-src]).
- Synthesis: the video's purchase is one tap on "Test valid purchase", and
  the app needs three visible outcomes: unlocked, a failed purchase with a
  retry, and a quiet return to the paywall on cancel.

[ios-sim-handler-src]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/Sources/Purchasing/SimulatedStore/SimulatedStorePurchaseHandler.swift
[ios-errorcode-src]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/Sources/Generated/ErrorCode.swift
[phc-error-codes]: https://github.com/RevenueCat/purchases-hybrid-common/blob/19.2.0/typescript/src/generated/error-codes.ts
[rnp-src]: https://github.com/RevenueCat/react-native-purchases/blob/10.10.1/src/purchases.ts

### Test Store purchases on the server

- **Purchases carry the store.** A REST API v2 purchase has `store`, "one of
  ... `galaxy`, `test_store`", and `environment`, "one of `production`,
  `sandbox`" ([rc-api-v2-purchase]); the customer's purchases list takes an
  `environment` filter ([rc-api-v2-resources]).
- **Active entitlements don't.** Each item holds only `entitlement_id` and
  `expires_at` ([rc-api-v2-resources]), as the
  [RevenueCat and Expo notes][rc-notes-v2] found.
- **Webhooks.** A webhook sends "events for production purchases, sandbox
  purchases, or both", and "When testing with sandbox purchases, the
  `environment` value will be `SANDBOX`." ([rc-webhooks]) The `store` field
  can be `TEST_STORE`, and a one-time purchase fires `NON_RENEWING_PURCHASE`,
  "A customer has made a purchase that won't auto-renew."
  ([rc-webhook-events])
- **Test Store is sandbox.** "Purchases through Test Store will be reported
  as sandbox data." ([rc-test-store]) The SDK's `X-Is-Sandbox` header is
  true for a Test Store key ([ios-httpclient-src]).
- **Sandbox Testing Access.** "**Anybody** _(default)_: All **non-production
  purchases** (Test Store and platform sandbox) will grant access to
  entitlements"; the other options are "**Allowed App User IDs only**" and
  "**Nobody**". Restricting it later means "Non-production purchases will
  still be recorded" and "Previously granted entitlements will be removed."
  ([rc-sandbox-access])
- Synthesis: `active_entitlements` alone can't tell a Test Store unlock from
  a real one; the relay would read the customer's purchases with
  `environment=production`, or check `store` and `environment`. For Next
  Gen, the relay accepts Test Store unlocks, and Sandbox Testing Access stays
  at "Anybody" through October 13, 2026. A store release would require a
  production purchase or switch the setting to "Nobody".

[rc-api-v2-purchase]: https://www.revenuecat.com/docs/api-v2/purchase
[rc-api-v2-resources]: https://www.revenuecat.com/docs/api-v2/customer/resources
[ios-httpclient-src]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/Sources/Networking/HTTPClient/HTTPClient.swift
[rc-sandbox-access]: https://www.revenuecat.com/docs/projects/sandbox-access

### Paywalls, Customer Center, and restore

- **Paywalls.** Test Store lets a project "configure your Products and
  Paywalls and test purchases without the need for Apple, Google or Stripe
  accounts" ([rc-projects]). For a lifetime product, the paywall variable
  `product.period` "Returns "lifetime" for lifetime products"
  ([rc-paywall-vars]), and the legacy templates were "only compatible with
  packages associated with subscription or non-consumable products like
  "lifetime" purchases" ([rc-paywalls-legacy]).
- **Customer Center** labels these purchases "Test Store"
  ([ios-cc-config-src]), and purchases-ios 5.88.0 made it "show the most
  recent one-time purchases" ([gh-ios-changelog]).
- **Restore does nothing.** With a Test Store key, `restorePurchases` and
  `syncPurchases` log "Restoring purchases not available in Test Store.
  Returning current CustomerInfo." and return the current customer
  ([ios-orchestrator-src]; [ios-purchase-strings-src]); purchases-ios 5.35.0
  was the release that would "Disable restore and sync purchases in Test
  Store" ([gh-ios-changelog]). No docs page says so.
- Synthesis: after a reinstall, the new anonymous ID doesn't have `listen`,
  and Restore Purchases can't bring it back; recovering it takes a transfer
  through the REST API or the CLI. Keep the Restore button, which a store
  release needs, but don't show restoring in the video.

[rc-projects]: https://www.revenuecat.com/docs/projects/overview
[rc-paywall-vars]: https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls/variables
[rc-paywalls-legacy]: https://www.revenuecat.com/docs/tools/paywalls-legacy/creating-paywalls
[ios-cc-config-src]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/Sources/CustomerCenter/CustomerCenterConfigData.swift

### Charts and dashboards with Test Store data

- **Charts.** "Due to the limitations of the sandbox environments, charts are
  only displayed for production transaction data." ([rc-charts])
- **Overview.** "Clicking the **Sandbox data** toggle above the Overview
  metrics will change the Overview metrics to report non-production
  purchases (both Test Store purchases and platform sandbox purchases)."
  ([rc-sandbox]) The toggle "does not affect the **New Customers** or
  **Active Customers** cards" ([rc-overview-metrics]).
- **Customers.** "The Customers dashboard tab doesn't support toggling the
  'View sandbox data' switch as there is no concept of a sandbox customer in
  RevenueCat, only sandbox transactions." ([rc-customer-lists])
- Synthesis: the entry's screenshots of RevenueCat come from the Overview
  with the Sandbox data toggle on, and the description says why Charts is
  empty.

[rc-charts]: https://www.revenuecat.com/docs/dashboard-and-metrics/charts
[rc-sandbox]: https://www.revenuecat.com/docs/test-and-launch/sandbox
[rc-overview-metrics]: https://www.revenuecat.com/docs/dashboard-and-metrics/overview
[rc-customer-lists]: https://www.revenuecat.com/docs/dashboard-and-metrics/customer-lists

## Identifying a device to the relay

The relay counts free lines per device and checks `listen` per RevenueCat
customer. What the RevenueCat ID is and who can send one are in the
[RevenueCat and Expo notes][rc-notes-who].

[rc-notes-who]: /docs/research/revenuecat-expo.md#who-can-send-an-app-user-id

### RevenueCat's anonymous ID for Turn

- **Format.** purchases-ios 5.90.1 builds `$RCAnonymousID:` plus a UUID with
  its dashes removed, lowercased ([ios-identity-src]), and "App User IDs
  should not be longer than 100 characters." ([rc-identify])
- **Where it lives.** The ID is cached in UserDefaults under
  `com.revenuecat.userdefaults.appUserID.new` ([ios-devicecache-src]), in the
  `com.revenuecat.user_defaults` suite for new installs
  ([ios-defaults-src]), not in the Keychain.
- **Reinstalls.** "In the event that the user deletes and reinstalls the app,
  the cache will be cleared and a new random anonymous App User ID will be
  generated." ([rc-identify])
- Synthesis: keyed by the anonymous ID, a reinstall resets the 20 free lines
  and, with restore disabled in Test Store, loses the `listen` purchase too.

[ios-identity-src]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/Sources/Identity/IdentityManager.swift
[ios-devicecache-src]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/Sources/Caching/DeviceCache.swift
[ios-defaults-src]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/Sources/FoundationExtensions/UserDefaults+Extensions.swift

### App Attest and DeviceCheck on a free account

- **App Attest is paid-only.** Apple's capability table ticks App Attest only
  for the paid and enterprise programs ([apple-caps-ios]), as the
  [Next Gen notes][ng-caps] found.
- **DeviceCheck's server key is out of reach.** "To authenticate
  communication with the DeviceCheck service, you'll use a private key enabled
  with DeviceCheck." ([apple-dc-key]) Keys live in Certificates, Identifiers &
  Profiles, which Apple's account table marks unavailable to "Registered for
  free" accounts: "Once you're enrolled, you'll be able to access additional
  resources, like Certificates, Identifiers & Profiles" ([apple-account]).
- **Both need a registered App ID.** "To use the `DCDevice` class, your app
  must have an app ID that you register on the Apple Developer website."
  ([apple-dcdevice])
- **DeviceCheck was made for this.** Its two bits per device let an app
  "identify devices that have already taken advantage of a promotional offer
  that you provide" ([apple-dc]). Apple's WWDC21 session describes the abuse
  exactly: "Someone might abuse the promotion by reinstalling the app over and
  over again just to claim the free item", and "The state persists across app
  reinstallation, device transfer between users, and even "Erase all contents
  and settings."" ([wwdc21-10244])
- **App Attest keys wouldn't help either.** They "don't survive app
  reinstallation, device migration, or restoration of a device from a backup."
  ([apple-aa-integrity])
- **Expo's module.** `@expo/app-integrity` 57.0.2, published September 11,
  2026 ([npm-app-integrity]), wraps App Attest only; its page says "This
  library is currently in alpha and will frequently experience breaking
  changes" and "App Attest is not supported on iOS Simulator."
  ([expo-app-integrity])
- Synthesis: Apple's own answer to free-item abuse, DeviceCheck, needs the
  paid program, which the team doesn't have; nothing Apple offers binds the
  relay's key to a genuine iPhone on a free account.

[apple-caps-ios]: https://developer.apple.com/help/account/reference/supported-capabilities-ios
[ng-caps]: /docs/research/next-gen.md#apple-capabilities-on-a-free-account
[apple-dc-key]: https://developer.apple.com/help/account/capabilities/create-a-devicecheck-private-key
[apple-account]: https://developer.apple.com/help/account/basics/about-your-developer-account
[apple-dcdevice]: https://developer.apple.com/documentation/devicecheck/dcdevice
[wwdc21-10244]: https://developer.apple.com/videos/play/wwdc2021/10244/
[apple-aa-integrity]: https://developer.apple.com/documentation/devicecheck/establishing-your-app-s-integrity
[expo-app-integrity]: https://docs.expo.dev/versions/v57.0.0/sdk/app-integrity/

### Identifiers that survive a reinstall

- **`identifierForVendor`.** "The value changes when the user deletes all of
  that vendor's apps from the device and subsequently reinstalls one or more
  of them. The value can also change when installing test builds using Xcode
  or when installing an app on a device using ad-hoc distribution."
  ([apple-idfv])
- **The Keychain.** Apple's keychain pages don't say what happens to items
  when an app is deleted; they cover only backups ([apple-keychain-access]).
  Expo's SDK 57 page for `expo-secure-store`, whose package is at 57.0.4,
  does: data "will persist across app uninstallations when the app is
  reinstalled with the same bundle ID", and also "Keep in mind that this is
  not guaranteed and you should never rely on this implementation detail."
  ([expo-securestore]; [npm-secure-store])
- **No fingerprinting.** "Can I fingerprint or use signals from the device
  to try to identify the device or a user? No. Per the Apple Developer
  Program License Agreement, you may not derive data from a device for the
  purpose of uniquely identifying it." ([apple-privacy-use])
- Synthesis: a random UUID kept with `expo-secure-store` and passed to
  `Purchases.configure` as a custom `appUserID` would carry both the free
  lines and the Test Store purchase across most reinstalls. RevenueCat
  recommends such an ID: "A non-guessable pseudo-random ID, like a UUID (RFC
  4122 version 4), is recommended." ([rc-identify]) `identifierForVendor` is
  weaker here, since every build a judge or the team installs comes from
  Xcode.

[apple-idfv]: https://developer.apple.com/documentation/uikit/uidevice/identifierforvendor
[apple-privacy-use]: https://developer.apple.com/app-store/user-privacy-and-data-use/

### Limiting abuse of the free lines

- **Cloudflare's free options.** The Free plan gets one WAF rate limiting
  rule, counting by IP over 10 seconds, and such rules "are not designed to
  allow a precise number of requests to reach your origin server"
  ([cf-waf-rl]). "For native mobile applications, Turnstile does not run
  natively. Instead, you use a WebView" ([cf-turnstile-mobile]). API Shield
  is an "Enterprise-only paid add-on" ([cf-api-shield]), and Bot Fight Mode
  "may challenge API or mobile app traffic" ([cf-bfm]).
- **RevenueCat's rule.** "App User IDs should not be guessable"
  ([rc-identify]).
- Synthesis: any client can mint new IDs, since the relay's code and URL
  are public, and a Test Store purchase costs nothing, so neither the
  free-line count nor `listen` guards Jev's credits. The backstops are the
  per-device count, the burst limit, and a global daily Jev budget checked
  before every call. Kept in one object, that budget is the global counter
  Cloudflare's [rules page][cf-do-rules] warns about, which is harmless at
  judging's volume. At about $0.00008 a line, 20 free lines cost about
  $0.0016 per minted ID.

[cf-waf-rl]: https://developers.cloudflare.com/waf/rate-limiting-rules/
[cf-turnstile-mobile]: https://developers.cloudflare.com/turnstile/get-started/mobile-implementation/
[cf-api-shield]: https://developers.cloudflare.com/api-shield/
[cf-bfm]: https://developers.cloudflare.com/bots/get-started/bot-fight-mode/

## Notices, consent, and sensitive data

Legal interpretation is left to the [Gaps](#gaps); this section quotes what
the terms say.

### TypeSafe's section 5 and data terms

Section 5 of the Master Customer Agreement, "Last updated Sep 19, 2026", is
headed "Customer Obligations" and reads in full ([ts-mca]):

> Customer is responsible for Input, including its content and accuracy, and
> will comply with Laws when using the Services.
> Customer represents, warrants, and covenants that it has made all
> disclosures, has provided all notices, and has obtained (and will maintain)
> all rights, consents, and permissions necessary for TypeSafe to exercise
> the rights granted to it in this Agreement (including the rights granted
> with respect to Input) without violating or infringing Laws or third-party
> rights. Customer is responsible for the acts and omissions of Customer Users
> and End Users in connection with the Agreement as though such acts and
> omissions were Customer's own.

- **Who counts.** Section 2.2 names apps "developed and operated by Customer
  for the benefit of Customer's end users ("End Users")", and section 4.1
  defines Input as "any data, files, queries, and other materials that
  Customer (including Customer Users or End Users) inputs or makes available
  to TypeSafe" ([ts-mca]).
- **What rides on it.** A breach of section 5 allows immediate suspension
  under section 6, and section 13.2 makes the customer defend TypeSafe
  against claims arising from facts that would breach it ([ts-mca]).
- **The DPA.** The data processing addendum, last updated April 24, 2026,
  lists the "Categories of Data Subjects" as "Customer and Customer's
  users.", and its line for "Sensitive Data Transferred (If Applicable)"
  ends "N/A." ([ts-dpa])
- **Other terms** on training, hosting, and under-18 data are in the
  [Jev notes][jev-data] and the [Next Gen notes][ng-minors].

[jev-data]: /docs/research/jev.md#offline-behavior-and-data-handling
[ng-minors]: /docs/research/next-gen.md#minors-ages-and-accounts

### RevenueCat's terms on privacy notices

- **Terms of Use, section 2.2** ("Last Modified: March 20th, 2024"):
  "Customer will make all disclosures to, and procure all necessary consents
  and authorizations from, Customer's users as are reasonably necessary or
  appropriate for RevenueCat's performance of the Services, including without
  limitation: (i) RevenueCat's and Stripe's processing of personally
  identifiable information relating to such users, including, without
  limitation, by disclosing RevenueCat's and Stripe's processing of such
  information in Customer's privacy policy in a reasonable and
  industry-standard manner." ([rc-terms])
- **The stakes.** "Customer represents that it has obtained all consents
  necessary for Customer and its Authorized Users to use the Services", and
  RevenueCat may terminate if the customer "breaches Sections 2.2, 2.4, or 3"
  ([rc-terms]).
- **The DPA** ("Effective: August 2026") makes the customer "solely
  responsible for ... (b) providing any notices required by Data Protection
  Legislation to, and receiving any required consents and authorizations
  required by Data Protection Legislation from, Data Subjects" ([rc-dpa]).
  It needs no signature: it "is included in our standard terms and
  conditions" ([rc-data-compliance]).
- **The privacy policy** ("Last Updated: June 2026"): "We are not the Data
  Controllers of this data and act as Data Processors", and "The customer's
  privacy policy or other agreement between the customer and the end user
  will apply to such processing, and not this Policy." ([rc-pp]) Its GDPR
  page adds that "you as the "controller" of your own application's data are
  responsible for disclosing that in your own privacy policy." ([rc-gdpr])

[rc-terms]: https://www.revenuecat.com/terms
[rc-data-compliance]: https://www.revenuecat.com/docs/welcome/set-up-revenuecat/data-and-compliance
[rc-pp]: https://www.revenuecat.com/privacy
[rc-gdpr]: https://www.revenuecat.com/gdpr

### Sensitive and health-related data

- **TypeSafe.** No text in the MCA, the DPA, the privacy policy, the site's
  terms, or the docs addresses health data, protected health information,
  HIPAA, special-category or disability data, or medical and other high-risk
  uses; the DPA's sensitive-data line is "N/A." ([ts-dpa]; [ts-mca]) Its
  use-case map lists no health or accessibility industry ([ts-use-cases]).
- **RevenueCat.** The DPA makes the customer responsible for "(c) ensuring
  no Special Categories of Personal Data (GDPR Article 9 or equivalent terms
  of UK Data Protection Law, as applicable), Personal Data relating to
  criminal convictions and offenses ... or "Sensitive Personal Information"
  under CCPA is submitted for Processing by the Application Services"
  ([rc-dpa]). Its Apple privacy guide says "RevenueCat does not collect
  health or fitness data from users" ([rc-app-privacy]). No RevenueCat page
  read here mentions HIPAA.
- Synthesis: Turn sends RevenueCat only the app user ID and the purchase and
  sets no customer attributes. TypeSafe receives the partner's words, the
  place's name, and the user's phrases, which can reveal health, such as a
  clinic visit or pain, so the privacy notice and the consent card name that
  flow plainly.

[ts-use-cases]: https://docs.typesafe.ai/concepts/use-case-map
[rc-app-privacy]: https://www.revenuecat.com/docs/platform-resources/apple-platform-resources/apple-app-privacy

## Latest versions as of September 22, 2026

| Component                           | Latest                              | Date               | Sources             |
| ----------------------------------- | ----------------------------------- | ------------------ | ------------------- |
| Jev model                           | `jev-1.13.0`, behind both aliases   | Not stated         | [ts-models]         |
| `@typesafe-ai/sdk`                  | 0.6.0                               | September 15, 2026 | [npm-ts-sdk]        |
| TypeSafe OpenAPI document           | 0.2.0                               | Not stated         | [ts-openapi]        |
| Wrangler                            | 4.136.2                             | September 22, 2026 | [npm-wrangler]      |
| workerd                             | 1.20260922.1                        | September 22, 2026 | [npm-workerd]       |
| `react-native-purchases` and its UI | 10.10.1                             | September 21, 2026 | [npm-rnp]           |
| `RevenueCat` (purchases-ios)        | 5.90.1 under 10.10.1; 5.90.2 newest | Not stated         | [rc-notes-versions] |
| `@revenuecat/cli`                   | 0.1.3                               | September 18, 2026 | [npm-rc-cli]        |
| `@expo/app-integrity`               | 57.0.2 (alpha)                      | September 11, 2026 | [npm-app-integrity] |
| `expo-secure-store`                 | 57.0.4                              | September 11, 2026 | [npm-secure-store]  |

## Conflicts between sources

The idea was revised in the same pull request to follow this note, so the
conflicts with it below describe the idea as first written.

- **The yearly fallback.** The idea said a yearly Test Store product "renews
  at most five times before it ends" ([idea-risks]); Test Store's table ends
  a 1-year product after "5 hours" ([rc-test-store]).
- **Committing the Test Store key.** The idea committed it for debug builds
  ([idea-repo]); RevenueCat's blogs keep it "out of version control" and
  suggest rotating it, while its docs are silent ([rc-blog-tests];
  [rc-blog-test-store]).
- **Where the phrases go.** The idea put the 40 candidates in the state
  ([idea-jev]); TypeSafe's Noul page puts each candidate in its own question
  and its jaggedness page warns about unrelated state ([ts-noul];
  [ts-jagged]).
- **Tokens per line.** The idea estimated "about 1,500" input tokens a line
  ([idea-money]); TypeSafe's published usage implies about 1,700 to 1,900
  (see [How a Jev request is billed](#how-a-jev-request-is-billed)).
- **Restore Purchases.** The idea puts Restore Purchases in Settings
  ([idea-money]); under Test Store it only refetches the current customer
  ([ios-orchestrator-src]).
- **`Retry-After` handling.** The Jev notes say the SDK honors `Retry-After`
  "up to `maxRetryAfterMs` 60000" ([jev-js]); the code falls back to its own
  backoff for a longer delay instead of capping it ([gh-js-types]).
- **Error statuses.** The API reference and the OpenAPI schema document 422
  for a body that fails validation ([ts-api]; [ts-openapi]); community tests
  got 400 for Choice size, empty keys, and bare Nouls ([gh-js-6]).
- **Whether a Noul needs instructions.** The API reference marks
  `instructions` required ([ts-api]); the OpenAPI schema requires only `type`
  and allows a null ([ts-openapi]).
- **Choice size.** The docs cap a Choice at 255 options ([ts-api]), and the
  schema sets no maximum ([ts-openapi]).
- **Test Store prices.** The dashboard can't edit a Test Store price
  ([rc-test-store]), while the CLI will "Create or update Test Store prices
  idempotently" ([rc-cli-commands]).
- **Webhook stores.** The webhook `store` field lists `TEST_STORE`, but the
  events-by-store table has no Test Store column ([rc-webhook-events]).
- **Keychain persistence.** Expo's SecureStore page calls persistence across
  reinstalls "an expected behavior of the iOS Keychain system" and also says
  "you should never rely on this implementation detail"
  ([expo-securestore]).
- **Smart Placement's status.** "available on all Workers plans", yet it may
  still "exit beta" ([cf-placement]).

[idea-repo]: /docs/IDEA.md#the-repository
[jev-js]: /docs/research/jev.md#javascript-sdk-methods

## Gaps

What no source settled on September 22, 2026:

- **Test Store's dashboard form.** Whether it offers a non-consumable or
  lifetime type, and whether a non-consumable Test Store product can be
  bought twice ([rc-config-products]).
- **Test Store webhooks.** Whether they need the sandbox filter; the docs
  imply it without saying so ([rc-webhooks]).
- **The Test Store key in public.** Any official statement on committing or
  rotating it ([rc-test-store]).
- **Restore under Test Store.** No docs page describes it; only the SDK's log
  text does ([ios-purchase-strings-src]).
- **The judges' Simulator build.** Whether a Debug build with an embedded
  JavaScript bundle runs without Metro was not tested.
- **Jev's limits.** A maximum number of questions per request, a body byte
  limit, the status for exhausted credits, whether 429 always carries
  `Retry-After`, and the scope of the rate limit ([ts-api]; [ts-models]).
- **Forty candidate Nouls.** No published run tests 40 per-candidate Nouls
  in one request, or how accuracy changes at that size ([ts-noul]).
- **Model retirement.** How long `jev-1.13.0` stays after a new release
  ([ts-models]).
- **Tokens.** TypeSafe's tokenizer and fixed overhead per request; the
  estimates here are inference ([ts-openapi]).
- **Cloudflare.** The Rate Limiting binding's price and Free plan status,
  the plan and beta status of region placement, whether invocation logs
  redact headers, and RevenueCat's origin region behind CloudFront
  ([cf-ratelimit]; [cf-placement]; [cf-workers-logs]).
- **Apple.** No page states DeviceCheck's or App Attest's behavior in the
  Simulator, or whether keychain items survive deleting an app
  ([apple-dc]; [apple-keychain-access]).
- **Legal interpretation.** Whether a conversation partner, who is neither
  the customer nor an end user, is covered by the notices that section 5 of
  TypeSafe's agreement requires or by its DPA's "Customer and Customer's
  users"; whether the
  user's phrases and the partner's words are health or special-category data
  under the laws that apply; whether that matters to TypeSafe's "N/A" line
  or RevenueCat's clause (c); and how TypeSafe's under-18 statement applies
  to a younger partner's words ([ts-mca]; [ts-dpa]; [rc-dpa]).

[idea-jev]: /docs/IDEA.md#how-jev-fits
[ts-api]: https://docs.typesafe.ai/api
[ts-noul]: https://docs.typesafe.ai/primitives/noul
[ts-jagged]: https://docs.typesafe.ai/model-jaggedness/jev-1.13
[ts-primitives]: https://docs.typesafe.ai/primitives
[cb-rerank]: https://docs.typesafe.ai/cookbooks/rerank_typesafe
[jev-api]: /docs/research/jev.md#the-system-one-http-api
[npm-ts-sdk]: https://registry.npmjs.org/@typesafe-ai/sdk
[cf-sdk]: /docs/research/cloudflare-workers.md#the-sdk-under-workerd
[ts-models]: https://docs.typesafe.ai/models
[ts-openapi]: https://api.typesafe.ai/openapi.json
[gh-js-6]: https://github.com/typesafe-ai/typesafe-sdk-js/issues/6
[ts-quickstart]: https://docs.typesafe.ai/introduction/quickstart
[ts-mca]: https://typesafe.ai/legal/mca
[gh-js-types]: https://github.com/typesafe-ai/typesafe-sdk-js/blob/v0.6.0/src/types.ts
[idea-risks]: /docs/IDEA.md#risks
[cb-parallel]: https://docs.typesafe.ai/cookbooks/parallel_questions
[idea-money]: /docs/IDEA.md#monetization
[cf-do-rules]: https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/
[cf-ratelimit]: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
[cf-wrangler-config]: https://developers.cloudflare.com/workers/wrangler/configuration/
[cf-workers-logs]: https://developers.cloudflare.com/workers/observability/logs/workers-logs/
[cf-traces]: https://developers.cloudflare.com/workers/observability/traces/
[rc-notes-v2]: /docs/research/revenuecat-expo.md#rest-api-v2-customer-and-active-entitlements
[cf-placement]: https://developers.cloudflare.com/workers/configuration/placement/
[npm-wrangler]: https://registry.npmjs.org/wrangler
[npm-workerd]: https://registry.npmjs.org/workerd
[rc-test-store]: https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store
[rc-config-products]: https://www.revenuecat.com/docs/projects/configuring-products
[npm-rc-cli]: https://registry.npmjs.org/@revenuecat/cli
[rc-cli-commands]: https://www.revenuecat.com/docs/tools/cli/commands
[ios-config-src]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/Sources/Purchasing/Configuration.swift
[rc-blog-tests]: https://www.revenuecat.com/blog/engineering/testing-test-store
[rc-blog-test-store]: https://www.revenuecat.com/blog/company/revenuecat-test-store
[ios-sim-ui-src]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/Sources/Purchasing/SimulatedStore/SimulatedStorePurchaseUI.swift
[gh-ios-changelog]: https://github.com/RevenueCat/purchases-ios/blob/main/CHANGELOG.md
[npm-rnp]: https://registry.npmjs.org/react-native-purchases
[rc-notes-versions]: /docs/research/revenuecat-expo.md#sdk-versions-on-september-22-2026
[ios-orchestrator-src]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/Sources/Purchasing/Purchases/PurchasesOrchestrator.swift
[rc-webhooks]: https://www.revenuecat.com/docs/integrations/webhooks
[rc-webhook-events]: https://www.revenuecat.com/docs/integrations/webhooks/event-types-and-fields
[ios-purchase-strings-src]: https://github.com/RevenueCat/purchases-ios/blob/5.90.1/Sources/Logging/Strings/PurchaseStrings.swift
[rc-identify]: https://www.revenuecat.com/docs/customers/identifying-customers
[apple-dc]: https://developer.apple.com/documentation/devicecheck
[npm-app-integrity]: https://registry.npmjs.org/@expo/app-integrity
[apple-keychain-access]: https://developer.apple.com/documentation/security/restricting-keychain-item-accessibility
[expo-securestore]: https://docs.expo.dev/versions/v57.0.0/sdk/securestore/
[npm-secure-store]: https://registry.npmjs.org/expo-secure-store
[ts-dpa]: https://typesafe.ai/legal/data-processing
[rc-dpa]: https://www.revenuecat.com/dpa

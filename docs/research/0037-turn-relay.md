# Turn's relay research notes

What the relay's code and tests can rely on in `@typesafe-ai/sdk` 0.6.0,
`@cloudflare/vitest-plugin` 1.2.2, Wrangler 4.136.2, and Workers Logs, read
for issue #24 on September 23, 2026. Judgment starts with "Synthesis:".

Contents:

1.  [The SDK's client and call](#the-sdks-client-and-call)
1.  [The SDK's errors, fetch, and runtime](#the-sdks-errors-fetch-and-runtime)
1.  [Tests in the Workers pool](#tests-in-the-workers-pool)
1.  [Wrangler's config and deploy](#wranglers-config-and-deploy)
1.  [Workers Logs](#workers-logs)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## The SDK's client and call

Read from the npm tarball ([sdk-tgz]), `dist/index.d.mts` (types) and
`dist/index.mjs` (code). The retry defaults, the error-class list, and
`.withResponse()`'s `requestId` are already in the
[relay notes][svc-errors].

- **Constructor options.** `TypeSafeClientConfig` has `apiKey?: string`,
  `baseURL?: string` ("falls back to `TYPESAFE_BASE_URL`, then
  `https://api.typesafe.ai`"), `defaultModel?: string` (then `jev-latest`),
  `logLevel?: LogLevel`, `logger?: Logger`, `retry?: Partial<RetryPolicy>`,
  `timeout?: number` ("Timeout per attempt in milliseconds, without a total
  retry budget. Default: 10000."), `defaultHeaders?`,
  `dangerouslyAllowBrowser?`, and `fetch?: Fetch`, "Custom HTTP fetch
  implementation for transport configuration or tests. Default: global
  `fetch`." (`index.d.mts:203-228`)
- **`'off'` is valid.**
  `type LogLevel = "debug" | "info" | "warn" | "error" | "off"`, "`off` disables
  logging" (`index.d.mts:193-194`). The code never calls `logger.warn` or
  `logger.error`; `info` logs attempt summaries and `debug` logs each request
  body (`index.mjs:596-599`), so the user's line would reach the log at `debug`.
- **Environment fallback.** Every option left out is read from
  `process.env` when `process` exists (`index.mjs:65-70`), and an explicit
  `logLevel` wins over `TYPESAFE_LOG_LEVEL` (`index.mjs:444-449`). Workers
  fill `process.env` with "any environment variables, secrets, or version
  metadata" when `nodejs_compat_populate_process_env` is on, "enabled by
  default for compatibility dates on or after 2025-04-01" ([cf-process]).
- **Retry fields.** `RetryPolicy` holds `maxRetries`, `backoffInitialMs`,
  `backoffMaxMs`, `backoffJitter`, `httpStatuses: ReadonlySet<number>`,
  `respectRetryAfter: boolean`, `maxRetryAfterMs`, `apiConnectionError`, and
  `apiTimeoutError` (`index.d.mts:160-179`); bad values throw
  `TypeSafeError` in the constructor (`index.mjs:423-436`).
- **The call** (`index.d.mts:299`), whose request is
  `{ state: EntryType; questions: Q; model?: string }`, where `EntryType` is a
  string, JSON object, JSON array, or `null` (`index.d.mts:40-42, 147-154`).
  `RequestOptions` holds `signal?: AbortSignal`, `timeout?: number` (per
  attempt), `retry?: Partial<RetryPolicy>`, and `headers?`
  (`index.d.mts:181-190`):

  ```ts
  systemOne<const Q extends Questions>(request: SystemOneRequest<Q>, options?: RequestOptions): APIPromise<SystemOneResult<Q>>
  ```

- **The answer types** (`index.d.mts:87-135`), where `.withResponse()`
  resolves to `{ data, response, requestId }` (`index.d.mts:3-10`):

  ```ts
  interface NoulResponse {
    readonly type: 'noul'
    readonly noul: number
  }
  interface ChoiceResponse<T extends ChoiceCriteria = ChoiceCriteria> {
    readonly type: 'choice'
    readonly choice: keyof T & string
    readonly confidence: number
    readonly probabilities: { readonly [label in keyof T]: number }
  }
  interface SystemOneResult<Q extends Questions> {
    readonly model: string
    readonly answers: { readonly [K in keyof Q]: ResultFor<Q[K]> }
    readonly usage: Usage // input_tokens and output_tokens, both numbers
  }
  ```

- **Plain question objects work.** The question types are these
  (`index.d.mts:46-69`):

  ```ts
  interface NoulQuestion {
    type: 'noul'
    instructions?: EntryType
    criteria?: { true?: EntryType; false?: EntryType } | null
  }
  interface ChoiceQuestion<T extends ChoiceCriteria = ChoiceCriteria> {
    type: 'choice'
    instructions?: EntryType
    criteria: T
  }
  ```

  At run time the SDK checks only that `questions` isn't
  empty and that a Score has a list of two or more (`index.mjs:347-354`), and
  that check throws synchronously, before any promise exists
  (`index.mjs:548-549`). The helpers only build the same object: `noul` returns
  `{ type: "noul", instructions, criteria }` with `instructions` defaulting to
  `null`, and `choice` also throws for an array (`index.mjs:313-345`).

- **The body isn't rewritten.**
  `const body = { ...request, model: request.model ?? this.defaultModel }`, then
  `JSON.stringify(req.body)` (`index.mjs:550-553, 589`). Nothing is renamed or
  added besides `model`, extra fields pass through ("Additional properties on a
  request variable are forwarded, including `null` values",
  `index.d.mts:143-146`), and `undefined` fields such as `noul()`'s missing
  `criteria` drop out.
- **URL, method, and headers.** `POST ${baseURL}/v1/systemone`
  (`index.mjs:554, 579`) with `Authorization: Bearer <key>`,
  `Accept: application/json`, `User-Agent` and `X-TypeSafe-SDK` both
  `typesafe-sdk/0.6.0`, `X-TypeSafe-Runtime` (`cloudflare-workers` under
  workerd), and `Content-Type: application/json`; a retry adds
  `X-TypeSafe-Retry-Count: <n>` (`index.mjs:580-595`). These win over
  `defaultHeaders` and per-call `headers` of the same name, because the merge
  keeps the last value (`index.mjs:451-457`).
- **The response isn't checked.** The body is `res.text()` then
  `JSON.parse`, returned as is (`index.mjs:677-690`); only `models.list()`
  checks a shape (`index.mjs:368-371`).
- Synthesis: the relay can pass `{ type: 'choice', instructions, criteria }`
  and `{ type: 'noul', instructions }` inline, since the `const` type
  parameter keeps `type` literal; a question built apart from the call needs
  `satisfies ChoiceQuestion` or `as const`. It must still pass every option
  in code, since a Worker secret named `TYPESAFE_API_KEY` or a var named
  `TYPESAFE_LOG_LEVEL` would otherwise be read from `process.env`. It must
  validate `answers` itself. A contract snapshot of the parsed body is safer
  than one of the raw string, whose key order follows the object's.

[sdk-tgz]: https://registry.npmjs.org/@typesafe-ai/sdk/-/sdk-0.6.0.tgz
[svc-errors]: /docs/research/0024-turn-services.md#errors-retries-and-timeouts
[cf-process]: https://developers.cloudflare.com/workers/runtime-apis/nodejs/process/

## The SDK's errors, fetch, and runtime

- **Every error class.** `TypeSafeError` is the base; `APIError` carries
  `status`, `headers`, `body`, and `requestId`, with subclasses
  `BadRequestError` (400), `AuthenticationError` (401),
  `PermissionDeniedError` (403), `NotFoundError` (404),
  `UnprocessableEntityError` (422), `RateLimitError` (429, adds
  `retryAfterMs`), and `InternalServerError` (500 and up); besides those are
  `APIConnectionError`, its subclass `APITimeoutError` (adds `timeoutMs`),
  and `APIUserAbortError` (`index.d.mts:327-375`; mapping at
  `index.mjs:191-200`).
- **A 402.** `fromResponse` ends in `return new APIError(status, body, headers)`
  (`index.mjs:199`), and each error's `name` is its class (`index.mjs:140`), so
  a 402 is `err instanceof APIError && err.status === 402` with
  `err.name === "APIError"`.
- **An aborted `signal`.** Each attempt aborts one controller from either
  the caller's signal or its own timer, and checks the caller first: "if
  (signal?.aborted) ... throw new APIUserAbortError(void 0, { cause: err })"
  (`index.mjs:628-651`). An abort during the wait between attempts also
  throws `APIUserAbortError`, whose `cause` is `signal.reason`
  (`index.mjs:122-133, 664-674`), and it's never retried
  (`index.mjs:609`).
- **A per-attempt timeout.** Only when the caller's signal isn't aborted:
  `throw new APITimeoutError(timeout, { cause: err })`, message "Request
  timed out after <n>ms." (`index.mjs:652-655, 229-231`). The timer covers
  the whole body, since the SDK drains a clone of the response before
  returning (`index.mjs:459-476, 645`). Anything else is
  `APIConnectionError` (`index.mjs:656-657`).
- **The global `fetch`, at call time.**
  `const defaultFetch = (input, init) => globalThis.fetch(input, init)` and
  `this.fetch = config.fetch ?? defaultFetch` (`index.mjs:401, 521`); the
  constructor only checks that a global `fetch` exists (`index.mjs:520`).
- **No Node built-ins.** `dist/index.mjs` has no `import` or `require`, and
  touches `process` only behind `typeof` or `?.` guards
  (`index.mjs:66, 379, 384`). The runtime header is worked out once at module
  load (`index.mjs:478`).
- Synthesis: a 2.5-second `AbortSignal.timeout(2500)` surfaces as
  `APIUserAbortError`, never as `APITimeoutError`, so the relay tells
  "budget spent" from "attempt timed out" by class, and can confirm it by
  its own signal's `reason`, a `TimeoutError`. Replacing or spying on
  `globalThis.fetch` intercepts the SDK even for a client built earlier, as
  long as the spy is in the same global; passing `fetch` in the constructor
  is the explicit seam.

## Tests in the Workers pool

Paths below are inside the installed plugin, `PKG` =
`worker/node_modules/@cloudflare/vitest-plugin`, or Wrangler's bundle, `WR`
= `worker/node_modules/wrangler/wrangler-dist/cli.js`; both are links into
the root `node_modules/.bun/`.

- **`fetchMock` is gone.** `cloudflare:test` exports `SELF`,
  `abortAllDurableObjects`, `createExecutionContext`, `env`,
  `evictAllDurableObjects`, `evictDurableObject`, `listDurableObjectIds`,
  `reset`, `runDurableObjectAlarm`, `runInDurableObject`,
  `waitOnExecutionContext`, and a few others, but no `fetchMock`
  (`PKG/dist/worker/lib/cloudflare/test.mjs:3`). The migration guide says
  "To mock outbound requests, use `@msw/cloudflare`" ([cf-vi-migrate];
  [cf-vi-outbound]).
- **One isolate.** The default export "runs in the same isolate/context as
  tests, so any global mocks will apply to it too"
  (`PKG/types/cloudflare-test.d.ts:8-10`), and the Durable Object wrapper
  builds the class from the same imported module
  (`PKG/dist/worker/lib/cloudflare/test-internal.mjs:313-320, 522-541`).
- **`SELF` and `env` are deprecated.** "Instead, use
  `import { exports } from "cloudflare:workers"` and `exports.default.fetch()`",
  and `import { env } from "cloudflare:workers"`
  (`PKG/types/cloudflare-test.d.ts:1-12`). A changed `env` reaches only a
  handler called directly, `worker.fetch(request, { ...env, X }, ctx)`
  ([cf-vi-apis]); a Durable Object still gets the binding `env`
  (`test-internal.mjs:540`).
- **Snapshots.** The pool sets `snapshotEnvironment = "cloudflare:snapshot"`
  (`PKG/dist/pool/index.mjs:64858`), whose environment reads, writes, and
  removes snapshot files through a loopback to Node
  (`PKG/dist/worker/lib/cloudflare/snapshot.mjs:7-33`). The docs' examples use
  `toMatchInlineSnapshot` ([cf-vi-apis]).
- **Vars and secrets.** The plugin reads `wrangler.jsonc` through Wrangler
  and merges its `miniflare` option on top, "`miniflare` values taking
  precedence" (`PKG/dist/pool/index.mjs:64571-64603`; [cf-vi-config]), so
  `miniflare.bindings` adds or overrides single keys. Wrangler loads
  `.dev.vars`, falls back to `.env`, and with `secrets` declared keeps only
  the required names (`WR:185522-185575`); a string var becomes
  `plain_text` and anything else `json` (`WR:185577`).
- **A missing `.dev.vars` doesn't fail tests.** Wrangler only warns:
  "Missing required secrets: ... Add them to .dev.vars, .env, or set as
  environment variables." (`WR:185562-185568`)
- **`placement`, `exports`, `observability`.** Wrangler validates the file;
  the Miniflare options use `exports` to wire Durable Objects
  (`WR:369604-369640`) and don't read `placement` or `observability`.
- Synthesis: `vi.spyOn(globalThis, 'fetch')` and `vi.spyOn(console, 'log')`
  both reach the Durable Object, since it shares the test's isolate; the
  pool logs through its own saved `globalThis.__console`
  (`PKG/dist/worker/index.mjs:725`), so the spy sees only the relay's lines.
  Build each mocked `Response` inside `mockImplementation`, not once up
  front, since the runtime refuses I/O objects shared across Durable
  Objects (`test-internal.mjs:317`). Tests get the key from
  `miniflare.bindings`, never `.dev.vars`. All three snapshot matchers
  should work; none was run.

[cf-vi-migrate]: https://developers.cloudflare.com/workers/testing/vitest-integration/migration-guides/migrate-to-vitest-plugin/
[cf-vi-outbound]: https://developers.cloudflare.com/workers/testing/vitest-integration/mock-outbound-requests/
[cf-vi-apis]: https://developers.cloudflare.com/workers/testing/vitest-integration/test-apis/
[cf-vi-config]: https://developers.cloudflare.com/workers/testing/vitest-integration/configuration/

## Wrangler's config and deploy

Read from `worker/node_modules/wrangler/config-schema.json` (`SCHEMA`) and
`WR`; no Wrangler command ran.

- **`placement`.** One schema form is `{ mode?: "targeted", region: string }`
  with `"required": ["region"]` (`SCHEMA:261-333`). Wrangler checks only that
  `region` is a non-empty string (`WR:20762-20875`) and sends it as is
  (`WR:169525-169546`), so `"aws:us-west-2"` passes locally and the API judges
  it.
- **`exports` replaces `migrations`.** "The configuration of Durable Objects
  via `exports` is mutually exclusive with `migrations`" (`SCHEMA:115-120`),
  and having both is an error (`WR:22726-22731`). An export needs `type` and
  `storage`, `"sqlite"` or `"legacy-kv"`, and `state` defaults to
  `"created"` (`SCHEMA:3627-3758`). With exports, the upload carries
  `exports` and `migrations: void 0` (`WR:164369-164386`).
- **`observability`.** `logs.invocation_logs` is a boolean, "Set to false
  to disable invocation logs" (`SCHEMA:3996-3999`), and `traces.enabled` is
  a boolean; neither object allows other keys (`SCHEMA:3953-4040`).
- **`secrets.required`** is `string[]`: it "Replaces
  .dev.vars/.env/process.env inference for type generation" and "Enables
  local dev validation with warnings", and "is not automatically inherited
  from the top level environment" (`SCHEMA:415-429`).
- **`vars`.** Each value is `string | Json`, and `Json` allows numbers,
  booleans, `null`, arrays, and objects (`SCHEMA:397, 5787-5812`).
- **`wrangler types`.** Each required secret is typed `string`
  (`WR:203013-203024, 203119-203122`). Vars are strict by default
  (`WR:202766`): the type is the literal `JSON.stringify(value)`, so `true`
  types as `true` and `{"a":1}` as `{"a":1}` (`WR:203715-203722`), or
  `typeof` the value with `--strict-vars=false`.
- **`getByName` with `locationHint`.** No `@cloudflare/workers-types` is
  installed; runtime types come from workerd (`WR:202119`), and the installed
  `workerd` 1.20260921.1 binary holds
  `getByName(name: string, options?: DurableObjectNamespaceGetDurableObj...` and
  `locationHint`.
- **Deploy order for a new name** (`deployWorker`, `WR:175135`):
  1.  `preUploadApiChecks` (`WR:174927`) looks the Worker up, where "not
      found" sets `workerExists = false` (`WR:175032`), checks queues, and
      reads the workers.dev subdomain (`WR:175065-175069`), which can
      register one for an account without (`WR:159447-159490`).
  1.  Local export payloads, then asset and Workers Sites uploads when
      configured, then bindings and `--secrets-file` values
      (`WR:175209-175256`).
  1.  The secrets check, `addRequiredSecretsInheritBindings` (`WR:175257`),
      throws "The following required secrets have not been set ... This Worker
      does not exist yet, so secrets cannot be set in advance with
      `wrangler secret put`", pointing to
      `wrangler deploy --secrets-file <path-to-file>` (`WR:170817-170828`).
  1.  Only then `provisionBindings` (`WR:175351`), the script upload that
      creates the Durable Object namespaces (`WR:175380-175432`), and
      `triggersDeploy` with the workers.dev route (`WR:175634`).
- **`--dry-run` skips it.** `preUploadApiChecks` returns `workerExists: true`
  "if (props.dryRun || !accountId || !name2)" (`WR:174929-174934`), so the throw
  can't fire, and the run exits at "--dry-run: exiting now."
  (`WR:175563-175565`). For an existing Worker the API rejects the missing
  inherit binding instead (`WR:170832-170850, 175526`).
- Synthesis: a new relay needs no `migrations` block, only `exports`. A
  first deploy without secrets fails before any script, namespace, or route
  exists, so the first deploy passes the key with `--secrets-file`. A test
  that the check works can't use `--dry-run`.

## Workers Logs

- **What an invocation log is.** "Each Workers invocation returns a single
  invocation log that contains details such as the Request, Response, and
  related metadata." ([cf-wlogs])
- **`console.log` is a separate kind.** "Any `console.log` statements within
  your Worker will be visible in Workers Logs." "Invocation logs can be disabled
  in wrangler by adding the `invocation_logs = false` configuration", shown as
  `{"observability": {"logs": {"invocation_logs": false}}}` ([cf-wlogs]). The
  page doesn't say in so many words that `console.log` lines stay.
- **Objects become fields.** `console.log("user_id: " + 123)` is stored as
  `{message: "user_id: 123"}`, while `console.log({user_id: 123})` is stored
  as `{user_id: 123}`: "In scenarios 2 and 3, your logs can be filtered
  against the keys `user_id` and `user_email`." Workers Logs "automatically
  extracts the fields and indexes them intelligently" ([cf-wlogs]).
- **Limits.** "A single log has a maximum size limit of 256 KB. Logs
  exceeding that size will be truncated." Retention is 7 days on Paid and 3
  on Free ([cf-wlogs]).
- Synthesis: `invocation_logs: false` drops the per-request record that
  holds the URL and headers, and the relay's own line stays, as the docs
  class it as a custom log. The line should be a plain object,
  `console.log({ route, status, ms, ... })`, since only the object form is
  documented to index; whether a `JSON.stringify`'d string is parsed is
  undocumented.

[cf-wlogs]: https://developers.cloudflare.com/workers/observability/logs/workers-logs/

## Gaps

- **Nothing was run.** No test ran in the Workers pool in this pass: not
  the SDK against a spied `fetch`, not a `console.log` spy inside a Durable
  Object, and none of `toMatchSnapshot`, `toMatchInlineSnapshot`, or
  `toMatchFileSnapshot`. The findings above come from reading source.
- **`@msw/cloudflare`.** The docs' replacement for `fetchMock` wasn't
  checked for its version or for reaching a Durable Object's `fetch`.
- **`console.log` without invocation logs.** The docs class `console.log`
  as custom logs but never say outright that they stay with
  `invocation_logs: false`; nothing was deployed to see.
- **JSON strings in Workers Logs.** Whether `console.log(JSON.stringify(x))`
  is parsed into fields is undocumented.
- **Region names.** Wrangler accepts any `region` string; whether
  `aws:us-west-2` is a region the API takes wasn't checked.
- **`getByName` at 2026-09-22.** The option is in workerd's types, but whether a
  compatibility date gates it wasn't confirmed, and `wrangler types` wasn't run.

## See also

- [Relay notes, the SDK call](/docs/research/0024-turn-services.md#the-sdk-call-for-turn)
- [Relay notes, secrets and wrangler.jsonc](/docs/research/0024-turn-services.md#secrets-and-wranglerjsonc-for-the-relay)
- [Relay notes, Workers Logs and traces](/docs/research/0024-turn-services.md#workers-logs-and-traces-for-the-relay)
- [Setup notes, Cloudflare and Wrangler](/docs/research/0036-turn-setup.md#cloudflare-and-wrangler-41362)
- [TRD, Relay API](/docs/TRD.md#relay-api)

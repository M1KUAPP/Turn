# Calling Workers AI and Jev from Turn's evaluation

How the evaluation's `embeddings` and `jev` rankers (#36) call Workers AI and
Jev from Bun, and how the replay script (#37) runs the relay under
`wrangler dev`. Read on September 23, 2026, from Cloudflare's docs, BAAI's
model card, and the installed Wrangler 4.136.2 (`wrangler-dist/cli.js`) and
`@typesafe-ai/sdk` 0.6.0 (`dist/index.mjs`) under the main checkout's
`node_modules/.bun/`.

Contents:

1.  [Findings for the plan](#findings-for-the-plan)
1.  [Workers AI's REST API for bge-base](#workers-ais-rest-api-for-bge-base)
1.  [Wrangler's auth token and whoami](#wranglers-auth-token-and-whoami)
1.  [The TypeSafe SDK in Bun and Node](#the-typesafe-sdk-in-bun-and-node)
1.  [wrangler dev for the replay](#wrangler-dev-for-the-replay)
1.  [User agents and error 1010](#user-agents-and-error-1010)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## Findings for the plan

- **Call one URL with a scoped token.** POST to
  `https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/baai/bge-base-en-v1.5`
  with `Authorization: Bearer <token>`; a custom token needs "Workers AI -
  Read" and "Workers AI - Edit" ([cf-ai-rest]). Read the token and account ID
  from the environment; no source says `/ai/run` takes Wrangler's OAuth token.
- **Always send `"pooling": "cls"`.** The default is `mean`, and "embeddings
  created with cls pooling are not compatible with embeddings generated with
  mean pooling" ([cf-bge-json]). Check `result.pooling === "cls"` and
  `result.shape` against `[n, 768]` before scoring.
- **Batch at most 100 texts.** The `text` array has `"maxItems": 100` and
  each item `"minLength": 1` ([cf-bge-json]), so 80 lines and about 150
  phrases take three requests, and an empty phrase must be caught first.
- **Divide by both norms.** Cloudflare doesn't say the vectors are unit length;
  BAAI's card only recommends `normalize_embeddings=True` ([hf-bge]). Full
  cosine is correct either way.
- **No query prefix by default.** For v1.5, "No instruction only has a slight
  degradation" ([hf-bge]); a prefixed run would be a separate ranker.
- **Set every SDK option in code.** `TypeSafeClient` reads four
  `TYPESAFE_*` variables when options are left out ([relay notes][sdk-call]);
  it runs on any runtime with a global `fetch` (`index.mjs:401, 520`), and a
  402 or 429 is an `APIError` with `status` ([relay notes][sdk-errors]).
- **`wrangler dev` warns, not refuses.** Missing required secrets log "Missing
  required secrets: ..." and the server starts (`cli.js:185559-185567`).
  Values come from `.dev.vars`, or else from `.env` files and the shell
  ([cf-secrets]).
- **Take the relay's URL as an argument.** `wrangler dev` listens on
  `localhost:8787` but moves to the next free port of up to ten when 8787 is
  taken (`cli.js:205765, 205928-205966`).
- **Reset with `.wrangler/state`.** Deleting it resets local Durable Object
  storage ([cf-local-data]).
- **Report a 403 with 1010 plainly.** Browser Integrity Check blocks
  "visitors without a user agent or with a non-standard user agent"
  ([cf-bic]); Bun sends `Bun/<version>` and Node sends `node`, and no
  Cloudflare page says whether either is blocked.

## Workers AI's REST API for bge-base

- **Endpoint and header.** "https://api.cloudflare.com/client/v4/accounts/
  {ACCOUNT_ID}/ai/run/{model}" with "Authorization: Bearer {API_TOKEN}"
  ([cf-ai-rest]). The API reference lists "Workers AI Write" and "Workers AI
  Read" as accepted permissions, and API token or API email and key as
  schemes ([cf-ai-run]).
- **Wrangler's OAuth scope.** Wrangler requests `ai:read` and `ai:write` at
  login (`cli.js:179440-179451`) and describes `ai:write` as "See and change
  Workers AI catalog and assets" (`cli.js:129549`). `wrangler ai models`
  calls `/accounts/${account_id}/ai/models/search` (`cli.js:77377, 360761`);
  nothing in `cli.js` calls `/ai/run`. Synthesis: the OAuth token reaches the
  `/ai/` API family, but whether `/ai/run` accepts it is unverified.
- **Request.** `text` is a string or an array; `pooling` is "`mean`" or
  "`cls`" with `"default": "mean"`, and "we highly suggest using the new `cls`
  pooling for better accuracy" ([cf-bge-json]). A second form takes
  `requests`, a "Batch of the embeddings requests to run using async-queue",
  and answers with a `request_id` instead ([cf-bge-json]).
- **Response.** The model's output has `shape`, `data` ("Embeddings of the
  requested text values"), and `pooling` ([cf-bge-json]), inside the
  envelope `result`, `success`, `errors`, `messages` ([cf-ai-rest]).
- **Limits.** "max_input_tokens": "512" beside a "context_window" of
  "153600" ([cf-bge-json]); BAAI gives a sequence length of 512 ([hf-bge]).
  No Cloudflare page says whether longer text is cut or refused.
- **Price and rate.** "$0.0666 per M input tokens" ([cf-bge-json]), and text
  embeddings allow "3000 requests per minute"
  ([evaluation notes][eval-embed]).
- **BAAI's card.** It pools "the last hidden state of the first token (i.e.,
  [CLS])", gives the query instruction "Represent this sentence for searching
  relevant passages:", and warns that "the similarity distribution of the
  current BGE model is about in the interval [0.6, 1]" ([hf-bge]).
- Synthesis: a request and its response, with vectors cut to two numbers:

  ```json
  { "text": ["Do you want tea?", "Yes please", "No thanks"], "pooling": "cls" }
  ```

  ```json
  {
    "result": {
      "shape": [3, 768],
      "data": [
        [0.012, -0.034],
        [0.051, 0.002],
        [0.018, -0.027]
      ],
      "pooling": "cls"
    },
    "success": true,
    "errors": [],
    "messages": []
  }
  ```

  Because scores cluster in [0.6, 1], the ranker should rank rather than
  apply an absolute cutoff, and any threshold must come from the tuning split.

[cf-ai-run]: https://developers.cloudflare.com/api/resources/ai/methods/run/
[eval-embed]: /docs/research/0025-turn-evaluation.md#workers-ai-embedding-models-on-september-22-2026

## Wrangler's auth token and whoami

Read from source only; neither command was run.

- **`wrangler auth token`** is "Retrieve your current authentication token or
  credentials for use with other tools and scripts" ([cf-wrangler-general]).
  It prints `CLOUDFLARE_API_TOKEN` when set, else the OAuth token from local
  state, else fails with "Not logged in. Please run `wrangler login` to
  authenticate." (`cli.js:350336-350370`). With `--json` it prints
  `{ type: "api_token" | "oauth", token }`, or
  `{ type: "api_key", key, email }` for a global key, and skips the banner
  (`cli.js:350316-350359`).
- **`wrangler whoami --json`** prints `loggedIn`, `authType`, `email`,
  `accounts`, and `tokenPermissions` (`cli.js:349836-349851`), where
  `tokenPermissions` is the OAuth scope list (`getScopes()`); unauthenticated,
  it prints `{ loggedIn: false }` and "Exits with a non-zero status"
  ([cf-wrangler-general]).
- Synthesis: both print a secret or an email, so the evaluation shouldn't
  shell out to them; a README step can tell the user to export
  `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` instead.

[cf-wrangler-general]: https://developers.cloudflare.com/workers/wrangler/commands/general/

## The TypeSafe SDK in Bun and Node

The [relay notes][sdk-call] already cover the options (`apiKey`, `baseURL`,
`defaultModel`, `logLevel`, `timeout`, `retry`), the `TYPESAFE_API_KEY`,
`TYPESAFE_BASE_URL`, `TYPESAFE_DEFAULT_MODEL`, and `TYPESAFE_LOG_LEVEL`
fallbacks, `systemOne`'s `{ model, answers, usage }`, and the
[error classes][sdk-errors]. New:

- **Runtimes.** The README says "Install the SDK (Node.js 20 or newer)", and
  `package.json` has `"engines": { "node": ">=20" }`. The runtime header
  names Bun first: "`bun/${g.Bun.version}${platform}`" (`index.mjs:380`).
- **Fetch.** The default is `globalThis.fetch(input, init)`
  (`index.mjs:401`); without one the constructor throws "No global `fetch` is
  available in this runtime" (`index.mjs:395, 520`). This machine has Bun
  1.4.2 and Node v26.9.0.
- **Price and limits.** Jev charges input tokens only, and a Turn line costs
  about $0.00007 to $0.00008 ([services notes][jev-billed]); the published
  limit is "250,000 tokens per second / 1,200 requests per minute"
  ([Jev notes][jev-limits]).
- Synthesis: 80 lines in sequence stay far under 1,200 a minute; the ranker
  should pass `logLevel: "off"` so no line is logged, and record
  `usage.input_tokens` and `model` beside each result.

[jev-billed]: /docs/research/0024-turn-services.md#how-a-jev-request-is-billed
[jev-limits]: /docs/research/0005-jev.md#pricing-limits-and-terms

## wrangler dev for the replay

- **Required secrets.** With `secrets` set, a missing name logs "Missing
  required secrets: ${missing.join(", ")}. Add them to .dev.vars, .env, or
  set as environment variables." through `logger2.warn`, and nothing throws
  (`cli.js:185551-185568`). Deploys differ: "`wrangler deploy` and
  `wrangler versions upload` will fail with a clear error" ([cf-secrets]).
- **Where values come from.** `.dev.vars` is read first; only if it's absent
  are `.env` and `.env.local` read (`cli.js:185464-185471, 185527-185549`),
  and of `CLOUDFLARE_INCLUDE_PROCESS_ENV` the docs say "This is not needed when
  using the `secrets` configuration property, which loads from `process.env`
  automatically" ([cf-secrets]). "When defined, only the keys listed in
  `secrets.required` are loaded from `.dev.vars` or `.env`" ([cf-secrets]).
- **Address and port.** `--ip` is "IP address to listen on" and `--port`
  "Port to listen on" (`cli.js:185849-185856`). The IP defaults to
  `localhost` (`127.0.0.1` on Windows, `cli.js:487`) and the port to
  `DEFAULT_LOCAL_PORT = 8787`, probing the next ten ports unless in CI
  (`cli.js:205765, 205966, 206157`).
- **Local storage.** Wrangler and Vite "store local binding data in the same
  location: the `.wrangler/state` folder in your project directory"; "You
  can delete the `.wrangler/state` folder at any time to reset your local
  environment" ([cf-local-data]). `--persist-to` moves it; its help says
  "defaults to .wrangler/state" (`cli.js:185982`).
- **The public internet.** Synthesis: a local Worker's `fetch` runs in workerd
  on this machine, so reaching `https://api.typesafe.ai` should work, but no
  page read today says so.
- Synthesis: the relay's `worker/wrangler.jsonc` requires `TYPESAFE_API_KEY`,
  `RC_SECRET_KEY`, and `ID_SALT`, so a `.dev.vars` with all three keeps the
  warning away; the replay should print the URL it targets.

## User agents and error 1010

- **The error.** 1010 means "The owner of this website has banned your
  access based on your browser's signature"; site owners "can disable Browser
  Integrity Check in their Security Settings" ([cf-1010]).
- **The check.** It "looks for common HTTP headers abused most commonly by
  spammers" and targets "visitors without a user agent or with a non-standard
  user agent such as commonly used by abusive bots, crawlers, or visitors";
  "Browser Integrity Check is enabled by default" ([cf-bic]).
- **Default agents.** Bun's docs show "User-Agent: Bun/1.3.3" ([bun-fetch]).
  Node's undici uses `'node'` and adds it only "if
  (!httpRequest.headersList.contains('user-agent', true))" ([undici-fetch]),
  so a caller's header wins. The SDK sends `typesafe-sdk/0.6.0`
  ([relay notes][sdk-call]).
- Synthesis: Cloudflare publishes no list of blocked agents, so whether
  `Bun/1.4.2` passes where `Python-urllib` failed is untested. The script can
  treat a 403 whose body names 1010 as its own error with a hint.

[cf-1010]: https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1010/
[bun-fetch]: https://bun.com/docs/runtime/networking/fetch
[undici-fetch]: https://github.com/nodejs/undici/blob/main/lib/web/fetch/index.js

## Gaps

- Whether Workers AI truncates or refuses text past 512 tokens.
- Whether bge-base's returned vectors are unit length.
- Whether `/ai/run` accepts Wrangler's OAuth token with `ai:write`, and how
  long that token lasts.
- A Cloudflare page stating that a Worker under `wrangler dev` can fetch the
  public internet.
- Whether Bun's or Node's default agent trips Browser Integrity Check, and
  which host returned the earlier 1010.
- Whether Jev's 1,200 requests a minute is per key or per account.

A spike on September 23, 2026 settled three of these for this Mac: a call
with the Wrangler login's token, taken from `wrangler auth token --json`,
answered `200` with six vectors whose norms ran from 0.9996 to 1.0003, and
one text of 700 words also answered `200`, so a long text isn't refused,
though whether it's cut is still unstated.

## See also

- [Services notes: Workers AI for the evaluation script](/docs/research/0024-turn-services.md#workers-ai-for-the-evaluation-script)
- [Evaluation notes: choosing the embedding ranker](/docs/research/0025-turn-evaluation.md#choosing-the-embedding-ranker)
- [Evaluation harness notes](/docs/research/0035-turn-eval-harness.md)
- [Relay notes: Wrangler's config and deploy](/docs/research/0038-turn-relay.md#wranglers-config-and-deploy)

[cf-ai-rest]: https://developers.cloudflare.com/workers-ai/get-started/rest-api/
[cf-bge-json]: https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/workers-ai-models/bge-base-en-v1.5.json
[hf-bge]: https://huggingface.co/BAAI/bge-base-en-v1.5
[sdk-call]: /docs/research/0038-turn-relay.md#the-sdks-client-and-call
[sdk-errors]: /docs/research/0038-turn-relay.md#the-sdks-errors-fetch-and-runtime
[cf-secrets]: https://developers.cloudflare.com/workers/configuration/secrets/
[cf-local-data]: https://developers.cloudflare.com/workers/development-testing/local-data/
[cf-bic]: https://developers.cloudflare.com/waf/tools/browser-integrity-check/

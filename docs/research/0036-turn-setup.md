# Turn's setup research notes

How the Jev key and credits, the relay's Cloudflare account, and the video
iPhone get set up, read for issues #14 and #16. Every source was read on
September 23, 2026, and judgment starts with "Synthesis:".

Contents:

1.  [TypeSafe's API and credits](#typesafes-api-and-credits)
1.  [Cloudflare and Wrangler 4.136.2](#cloudflare-and-wrangler-41362)
1.  [Apple, Xcode 27, and iOS 27](#apple-xcode-27-and-ios-27)
1.  [A key in Git's history](#a-key-in-gits-history)
1.  [Hands-on check](#hands-on-check)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## TypeSafe's API and credits

The MCA's credit, expiry, and auto-refill terms are already quoted in the
[Jev notes](/docs/research/0005-jev.md#free-tier-credits-and-programs).

- **`GET /v1/models` needs a key.** The spec, version 0.2.0, puts
  `security: [{"HTTPBearer": []}]` on the operation and describes it as
  "List the models and aliases available to the authenticated account."
  ([OpenAPI][ts-openapi]) A GET without a key returned HTTP 403 with the
  `error_type` `authentication_error` and the message "Must supply an API
  key! Check your request and try again."
- **The docs say 401, the API sent 403.** The API page's error table lists
  "`401 Unauthorized` | Missing or invalid API key", then 422, 429, and 529,
  and nothing for 402 or an empty balance ([API reference][ts-api]).
- **Only two operations.** The spec holds `POST /v1/systemone` and
  `GET /v1/models`, each with responses `200` and `422` only
  ([OpenAPI][ts-openapi]). There's no balance, usage, or auto-refill
  endpoint.
- **Billing a model list.** Nothing says whether `GET /v1/models` is billed.
  The only per-request figure is the systemone response's `usage`: "The
  response also includes the model used and token usage."
  ([OpenAPI][ts-openapi])
- **Credits in the docs.** The full docs text, `llms-full.txt` at 910 KB,
  has no match for "refill", and its index lists no billing or credits page
  ([docs index][ts-llms]; [full docs][ts-llms-full]). Buying credits and
  turning on auto-refill in the console aren't documented.
- Synthesis: a model list submits no Input, and the MCA consumes credits
  "by each Input submitted", so `GET /v1/models` is likely free; use it as
  the key check in #14. It lists aliases, not the pinned `jev-1.13.0`, as
  the [relay notes][svc-pin] say, so the pin shows only in a systemone
  answer's `model`. Confirm the balance and the auto-refill switch in the
  console by eye.

[svc-pin]: /docs/research/0024-turn-services.md#the-model-pin-on-september-22-2026
[ts-openapi]: https://api.typesafe.ai/openapi.json
[ts-api]: https://docs.typesafe.ai/api
[ts-llms]: https://docs.typesafe.ai/llms.txt
[ts-llms-full]: https://docs.typesafe.ai/llms-full.txt

## Cloudflare and Wrangler 4.136.2

Line numbers are in the installed bundle,
`worker/node_modules/wrangler/wrangler-dist/cli.js`, read without running
any command that changes state.

- **`secret put` creates a missing Worker.** On a not-found error (line
  303209), `createDraftWorker` in `src/secret/index.ts` asks "There doesn't
  seem to be a Worker called "${scriptName}". Do you want to create a new
  Worker with that name and add secrets to it?" with
  `{ defaultValue: true, fallbackValue: true }`, under the comment "we want
  to default to true in non-interactive/CI contexts to preserve existing
  behaviour" (lines 303026 to 303035). It then uploads a placeholder,
  `export default { fetch() {} }`.
- **`secret put` reads a pipe.** With `process.stdin.isTTY` false, the value
  comes from `readFromStdin()` instead of the "Enter a secret value:" prompt,
  and `trimTrailingWhitespace` trims it (lines 303166 to 303169), so a pipe
  keeps the key off the command line.
- **The docs.** "`wrangler secret put` creates a new version of the Worker
  and deploys it immediately." ([secrets][cf-secrets]) The command
  "Create[s] or update[s] a secret for a Worker", and `--name` defaults "to
  the name specified in your Wrangler config file" ([commands][cf-commands]).
- **Reading the subdomain.** `GET /accounts/{account_id}/workers/subdomain`
  "Returns a Workers subdomain for an account." ([API][cf-sub-api])
  Wrangler 4.136.2's `--help` lists no `subdomain` command, only
  `wrangler whoami`. Accounts "come with a `workers.dev` subdomain that is
  configurable in the Cloudflare dashboard", and each Worker gets
  `<YOUR_WORKER_NAME>.<YOUR_SUBDOMAIN>.workers.dev` ([workers.dev][cf-wdev]).
- **Deploying with no subdomain.** Before uploading, Wrangler reads that
  endpoint only when the Worker doesn't exist yet (lines 175064 and 175065);
  after uploading, `subdomainDeploy` reads it for any Worker with no
  workers.dev URL yet (line 160176). On error 10007 it warns "You need to
  register a workers.dev subdomain before publishing to workers.dev" and
  asks "Would you like to register a workers.dev subdomain now?" with
  `fallbackValue: false` (lines 159474 to 159488). A yes prompts for a name
  matching
  `^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$`; a no, or a non-interactive run,
  fails with a link to
  `https://dash.cloudflare.com/<account>/workers/onboarding`.
- **Agents skip the prompt.** When `detectedAgent.isAgent`, the deploy sets
  `autoRegisterWorkersDevSubdomain` to
  `getWorkerNameFromProject(process.cwd())` (line 288551), which registers a
  subdomain named from `package.json`'s `name`.
  `toValidWorkerName` turns each character outside `[a-z0-9- ]` into a
  hyphen and trims the ends, so `worker/`'s `@turn/relay` becomes
  `turn-relay`.
- **SQLite Durable Objects on Free.** Still "available both on Workers Free
  and Workers Paid plans", and on Free "Only Durable Objects with SQLite
  storage backend are available"; Free allows "100,000 / day" requests,
  "13,000 GB-s / day", "5 million / day" rows read, "100,000 / day" rows
  written, and "5 GB (total)" ([pricing][cf-do-pricing]). Limits add "100
  (Free)" classes per account and "1 GB on the Free plan" per object
  ([limits][cf-do-limits]).
- **`secrets.required` history.** 4.70.0 added local validation, 4.77.0
  made `wrangler deploy` fail "If any required secrets are missing", 4.88.0
  made the property "no longer experimental", and 4.107.1 fixed the new
  Worker's error, which "suggested running `wrangler secret put <NAME>`,
  which doesn't work because the Worker doesn't exist yet"
  ([changelog][wr-changelog]).
- **Deploy with a missing required secret.** For a new Worker, 4.136.2
  stops before uploading: "This Worker does not exist yet, so secrets cannot
  be set in advance with \`wrangler secret put\`." and points to
  `wrangler deploy --secrets-file <path-to-file>`. For an existing Worker,
  missing names become `{ type: "inherit" }` bindings, and a rejected one
  says to use `wrangler secret put <NAME>` or `--secrets-file`
  (`secrets-validation.ts`, lines 170806 to 170848).
- Synthesis: the deploy error and the `secret put` code disagree, since
  `secret put` would create the Worker the error says doesn't exist.
  Untested either way, and moot for Turn: the
  [hands-on check](#hands-on-check) found `turn-relay` and the subdomain
  already in place, so `secret put` adds the key to an existing Worker, and
  a deploy that declares `secrets.required` inherits it.

[cf-secrets]: https://developers.cloudflare.com/workers/configuration/secrets/
[cf-commands]: https://developers.cloudflare.com/workers/wrangler/commands/workers/
[cf-sub-api]: https://developers.cloudflare.com/api/resources/workers/subresources/subdomains/methods/get/
[cf-wdev]: https://developers.cloudflare.com/workers/configuration/routing/workers-dev/
[cf-do-pricing]: https://developers.cloudflare.com/durable-objects/platform/pricing/
[cf-do-limits]: https://developers.cloudflare.com/durable-objects/platform/limits/
[wr-changelog]: https://github.com/cloudflare/workers-sdk/blob/main/packages/wrangler/CHANGELOG.md

## Apple, Xcode 27, and iOS 27

- **Bundle ID rules.** "The bundle ID string must contain only alphanumeric
  characters (A–Z, a–z, and 0–9), hyphens (-), and periods (.). Typically,
  you use a reverse-DNS format for bundle ID strings. Bundle IDs are
  case-insensitive." After an upload to App Store Connect, "you can't change
  the bundle ID or delete the associated explicit App ID"
  ([CFBundleIdentifier][ap-bundle]).
- **Free account limits.** "You can register up to 10 App IDs, which expire
  after 7 days. You can register up to 3 devices, which expire after 7 days.
  You can install up to 3 apps per device. Provisioning profiles that enable
  apps to be installed on a device will expire 7 days from issuance."
  ([memberships][ap-memberships])
- **Developer Mode.** It "only appears in Settings if you initiate pairing
  or if you previously paired the device to a Mac." Then: "In the Privacy &
  Security settings on the device, turn on the Developer Mode switch under
  Security", tap Restart, and "After the device restarts ... swipe up, tap
  Enable in the dialog, and enter your device passcode." Xcode 27's Device
  Hub "displays a message when you need to turn on Developer Mode"
  ([Developer Mode][ap-devmode]).
- **Trusting a developer.** Apple's page covers enterprise apps: "Tap
  Settings > General > VPN & Device Management", tap the developer, tap
  Trust, and "In iOS 18, iPadOS 18, and visionOS 2 and later, tap "Allow &
  Restart"" ([enterprise apps][ap-enterprise]).
- **`devicectl`.** In Xcode 27.0 (27A266a), `list devices` shows an
  Identifier column with "each device's UDID", and JSON's
  "'hardwareProperties', 'deviceProperties', and 'connectionProperties' keys
  are deprecated in favor of the 'properties' dictionary". To find a field,
  "run the command with '--json-output -' and inspect the JSON".
  `device info details --device <uuid|ecid|serial_number|udid|name|dns_name>`
  takes the name too. With no iPhone attached it printed "No devices found."
- Synthesis: choose a lowercase ID once, such as `com.<team>.turn`, since
  case doesn't separate IDs. Record the phone with the commands below and
  read the model and OS version out of the file.

```shell
xcrun devicectl list devices
xcrun devicectl device info details --device "<name>" \
  --json-output iphone.json
```

[ap-bundle]: https://developer.apple.com/documentation/bundleresources/information-property-list/cfbundleidentifier
[ap-memberships]: https://developer.apple.com/support/compare-memberships/
[ap-devmode]: https://developer.apple.com/documentation/xcode/enabling-developer-mode-on-a-device
[ap-enterprise]: https://support.apple.com/en-us/118254

## A key in Git's history

- **Pickaxe.** `-S<string>` looks "for differences that change the number
  of occurrences of the specified <string> (i.e. addition/deletion) in a
  file." `--all` acts "as if all the refs in refs/, along with HEAD, are
  listed on the command line", and `--reflog` adds "all objects mentioned by
  reflogs" ([git log][git-log]).
- **Every object.** `--batch-all-objects` makes `git cat-file` "perform the
  requested batch operation on all objects in the repository and any
  alternate object stores (not just reachable objects)"
  ([git cat-file][git-cat-file]).
- Synthesis: an empty pickaxe result shows no commit on any ref or reflog
  ever added or removed the key, but `-S` takes the key as an argument,
  where `ps` can see it while git runs. Matching every object instead, with
  the key read from a pipe by `grep -F -f`, covers dangling objects too and
  keeps the key off every command line. `grep -c` counts matching lines, so
  0 means no object holds the key.

```shell
git cat-file --batch-all-objects --batch |
  grep -a -F -c -f <(printf '%s\n' "${TYPESAFE_API_KEY:?}")
```

[git-log]: https://git-scm.com/docs/git-log
[git-cat-file]: https://git-scm.com/docs/git-cat-file

## Hands-on check

The session ran these on September 23, 2026, between 08:48 and 09:30 UTC,
on the Mac that deploys the relay. No command printed the key or took it as
an argument: curl read its header from standard input.

- **The key works.** `GET /v1/models` with the key returned 200, an
  `x-typesafe-request-id`, and two models, `jev-latest` and `jev-preview`;
  without it, 403. One `POST /v1/systemone` with a single Noul about "Do you
  want some water?" returned 200 in 1.08 s with `"model":"jev-1.13.0"`, a
  Noul of 0.97, and `"usage":{"input_tokens":292,"output_tokens":22}`, so
  the account's credits paid for a call.
- **Wrangler is logged in.** `wrangler whoami` reports an OAuth token for
  one account, named Turn, with `workers (write)` among its scopes.
- **The subdomain and the Worker exist.** The subdomain call returned the
  account's registered subdomain. `turn-relay` was uploaded at 07:54 UTC for
  #15, which set `RC_SECRET_KEY` on it; its workers.dev route is enabled,
  and its `/v1/config` there answered 404, the scaffold's only response. The
  account's list of Durable Object namespaces came back empty, with
  `"success": true`.
- **The Mac.** Xcode 27.0 (27A266a) on macOS 27.0. Xcode's list of Apple
  Accounts is empty, `security find-identity -v -p codesigning` finds "0
  valid identities", and `xcrun devicectl list devices` prints "No devices
  found."
- **No key in Git.** After fetching every branch and, by hash, the heads of
  all 18 pull requests, no line of the 4,559 objects in the repository's
  store, reachable or not (262 MB from
  `git cat-file --batch-all-objects --batch`), holds the key, and no line of
  `git log --all --reflog -p` does either. Both scans read the key from a
  pipe with `grep -F -f`.
- Synthesis: the key, the credits, the login, the subdomain, and the Worker
  are ready, so #14's secret and #16's Cloudflare checks can run now. The
  Apple Account, the iPhone, and TypeSafe's auto-refill switch need a
  person.

## Gaps

- **Credits.** TypeSafe's docs don't describe buying credits, the
  auto-refill switch, or the status an empty balance returns.
- **Billing for the model list.** No source says whether `GET /v1/models`
  is free.
- **`secret put`, then deploy.** Whether a deploy after `secret put`
  created a placeholder Worker passes `secrets.required` wasn't tested;
  Turn's Worker already exists.
- **Personal Team IDs.** Apple doesn't say whether a free team can register
  any unused bundle ID.
- **Trust path for development apps.** Apple's page covers enterprise apps
  only; the Settings path for a Personal Team's app wasn't found on Apple's
  sites.
- **`devicectl` fields.** Which JSON keys hold the model name and OS version
  wasn't checked, since no iPhone was attached.

## See also

- [Jev notes, credits](/docs/research/0005-jev.md#free-tier-credits-and-programs)
- [Cloudflare Workers notes, Durable Objects on Free and Paid](/docs/research/0010-cloudflare-workers.md#durable-objects-on-the-free-and-paid-plans)
- [iPhone build notes, a free account](/docs/research/0023-turn-ios.md#building-to-an-iphone-with-a-free-account)
- [Relay notes, secrets and wrangler.jsonc](/docs/research/0024-turn-services.md#secrets-and-wranglerjsonc-for-the-relay)
- [Relay notes, the model pin](/docs/research/0024-turn-services.md#the-model-pin-on-september-22-2026)

# Turn's workspace research notes

How to lay out Bun workspaces for the relay, the evaluation, and the shared
decision code, read for issue #17. Every source was read on September 23,
2026, and judgment starts with "Synthesis:".

Contents:

1.  [Versions on September 23, 2026](#versions-on-september-23-2026)
1.  [Hands-on check](#hands-on-check)
1.  [Bun workspaces](#bun-workspaces)
1.  [The Workers Vitest plugin](#the-workers-vitest-plugin)
1.  [Wrangler's generated types and local secrets](#wranglers-generated-types-and-local-secrets)
1.  [One TypeScript source package for every consumer](#one-typescript-source-package-for-every-consumer)
1.  [Prettier and the Git hooks](#prettier-and-the-git-hooks)
1.  [Recommended layout and scripts](#recommended-layout-and-scripts)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## Versions on September 23, 2026

Read from the npm registry with `npm view`. Times are UTC.

| Package                     | TRD's pin | Pin published                 | npm `latest`, published   |
| --------------------------- | --------- | ----------------------------- | ------------------------- |
| `wrangler`                  | 4.136.2   | 2026-09-22 09:37              | 4.136.3, 2026-09-22 16:36 |
| `@cloudflare/vitest-plugin` | 1.2.1     | 2026-09-21 16:57              | 1.2.3, 2026-09-22 16:39   |
| `vitest`                    | 4.1       | 4.1.11 (`V4` tag), 2026-08-18 | 5.0.1, 2026-09-15         |
| `typescript`                | none      | none                          | 7.0.2, 2026-07-08         |

- **Wrangler 4.136.2 exists** and needs `"node": ">=22.0.0"`. It depends on
  workerd `1.20260921.1`, Miniflare `5.20260921.0-alpha`, and esbuild
  `0.28.1`, with a peer dependency on `@cloudflare/workers-types`
  `^5.20260921.1` ([npm-wrangler]).
- **The plugin's pin is no longer `latest`.** `@cloudflare/vitest-plugin`
  1.2.1 depends on `wrangler` `4.136.1` exactly, plus Miniflare
  `5.20260921.0-alpha` and esbuild `0.28.1`; its peers are `vitest`,
  `@vitest/runner`, and `@vitest/snapshot`, all `^4.1.0`. Version 1.2.2
  (09:41 on September 22) depends on `wrangler` `4.136.2`, and 1.2.3 on
  `4.136.3` ([npm-plugin]). Wrangler 4.136.1 also used workerd
  `1.20260921.1` ([npm-wrangler]), so both Wranglers run the same runtime.
- **Vitest's `latest` is 5.x.** The `V4` tag is `4.1.11` and `latest` is
  `5.0.1` ([npm-vitest]), outside the plugin's `^4.1.0` peer range, so an
  unpinned `bun add -d vitest` would break the relay's tests.
- **TypeScript's `latest` is 7.0.2**, from July 8, 2026, with a `tsc` bin
  and `"node": ">=16.20.0"`; the `dev` tag still names 3.9.4
  ([npm-typescript]). The TRD doesn't pin TypeScript.
- **`2026-09-22` is accepted.** The relay's smoke test ran in workerd with
  that `compatibility_date`, and `wrangler types` stamped "Runtime types
  generated with workerd@1.20260921.1 2026-09-22" (see
  [Hands-on check](#hands-on-check)).
- Synthesis: the TRD's pins install and pass, but plugin 1.2.1 brings a
  second Wrangler (4.136.1). Plugin 1.2.2 is the exact partner of Wrangler
  4.136.2, so changing the TRD's row to 1.2.2 gives one Wrangler without
  moving the runtime. Pin `vitest` to `4.1.11`, not a caret on `latest`.

[npm-wrangler]: https://registry.npmjs.org/wrangler
[npm-plugin]: https://registry.npmjs.org/@cloudflare/vitest-plugin
[npm-vitest]: https://registry.npmjs.org/vitest
[npm-typescript]: https://registry.npmjs.org/typescript

## Hands-on check

A throwaway workspace in a scratch folder, on macOS with Bun 1.4.2 and
Node.js 26.9.0: `shared` (`@turn/shared`, exporting `./src/index.ts`),
`worker` (Wrangler 4.136.2, plugin 1.2.1, Vitest 4.1.11), and `eval`
(Vitest 4.1.11), both importing `@turn/shared` as `workspace:*`. The root
had `"private": true`, `"workspaces": ["shared", "worker", "eval"]`, and a
`prepare` script that echoed a marker.

```jsonc
// worker/wrangler.jsonc
{
  "name": "turn-relay",
  "main": "src/index.ts",
  "compatibility_date": "2026-09-22",
  "secrets": { "required": ["TYPESAFE_API_KEY", "RC_SECRET_KEY", "ID_SALT"] }
}
```

```ts
// worker/vitest.config.ts
import { cloudflareTest } from '@cloudflare/vitest-plugin'
import { defineConfig } from 'vitest/config'
export default defineConfig({ plugins: [cloudflareTest({ wrangler: { configPath: './wrangler.jsonc' } })] })

// worker/test/smoke.test.ts
import { exports } from 'cloudflare:workers'
import { expect, test } from 'vitest'
test('runs in workerd', async () => {
  const res = await exports.default.fetch('http://example.com/')
  expect(await res.text()).toContain('Cloudflare-Workers') // the Worker returns navigator.userAgent
})
```

- **Install** ran the root `prepare` script and exited 0.

  ```text
  $ bun install
  $ echo PREPARE-RAN
  PREPARE-RAN
  81 packages installed [7.18s]
  ```

- **All tests from the root** passed, exit 0, with no `.dev.vars`. The
  missing secrets were a warning, not a failure.

  ```text
  $ bun run --filter '*' test
  @turn/shared test:  Test Files  1 passed (1)
  @turn/shared test: Exited with code 0
  @turn/eval test:  Test Files  1 passed (1)
  @turn/eval test: Exited with code 0
  @turn/worker test: Using secrets defined in process.env
  @turn/worker test: ▲ [WARNING] Missing required secrets: RC_SECRET_KEY, ID_SALT. Add them to .dev.vars, .env, or set as environment variables.
  @turn/worker test:  Test Files  1 passed (1)
  @turn/worker test: Exited with code 0
  ```

  The warning named two of the three secrets, so the third was already in
  the shell's environment: Wrangler reads `process.env` too.

- **One failing package** made the root command exit 1, and the other
  packages still ran to the end.

  ```text
  @turn/shared test: Exited with code 0
  @turn/eval test:  FAIL  test/smoke.test.ts > eval imports shared
  @turn/eval test: Exited with code 1
  @turn/worker test: Exited with code 0
  FAIL_EXIT=1
  ```

- **A package without the script** is skipped: with `shared`'s `test`
  script removed, the root command ran the other two and exited 0. A
  script that no package has fails with exit 1:
  `error: Script "nosuch" not found in 3 packages matching "*"`.
- **Types** (`bunx wrangler types` in `worker/`) wrote a 15,758-line
  `worker-configuration.d.ts` holding `Env` with the three secrets and the
  runtime types, exit 0, and asked for Node.js types: "Since your Worker
  has Node.js compatibility enabled, you should install Node.js types by
  running "npm i --save-dev @types/node"." `bunx wrangler types --check`
  printed "Types at worker-configuration.d.ts are up to date." and exited
  0, also after Prettier had rewritten the file.
- **Dry-run deploy** bundled the shared package's TypeScript source.

  ```text
  $ bunx wrangler deploy --dry-run --outdir dist
   ⛅️ wrangler 4.136.2 (update available 4.136.3)
  Total Upload: 0.41 KiB / gzip: 0.28 KiB
  No bindings found.
  --dry-run: exiting now.
  ```

- **Leftovers** in `worker/` after these runs: `.wrangler/` and `dist/`.
- **Two Wranglers.** `node_modules/.bun/` held `wrangler@4.136.1` (the
  plugin's) and `wrangler@4.136.2`, one workerd (`1.20260921.1`), and one
  Miniflare.
- **`bunx wrangler` from the root** reported 4.136.3: with isolated
  installs there is no root `node_modules/.bin`, so `bunx` fetched npm's
  `latest`. Inside `worker/` it reported 4.136.2.
- **A root Vitest `test.projects`** listing all three packages ran the two
  Node projects but failed the Workers one, exit 1, run with `shared`'s
  Vitest binary: `Error: No such module "vitest/worker"`.

## Bun workspaces

- **The field.** "The `"workspaces"` key in the root `package.json` lists
  the subdirectories to treat as workspaces", with full glob support, and a
  package references another with "the workspace protocol (for example
  `workspace:*`)". "`bun install` installs dependencies for all workspaces
  in the monorepo" ([bun-ws]).
- **Isolated installs.** "Isolated installs are the default for **new**
  workspace/monorepo projects (with `configVersion = 1` in the lockfile).
  Existing projects continue using hoisted installs unless explicitly
  configured" ([bun-iso]). The repo's `bun.lock` already has
  `"configVersion": 1`, so the workspaces will install isolated, as in the
  hands-on check.
- **Running scripts.** `bun --filter '*' dev` runs matching packages'
  scripts "in parallel"; "Bun respects package dependency order when
  running scripts"; `--parallel --no-exit-on-error` continues past a
  failure; and "Use `--if-present` with `--workspaces` to skip packages
  that don't have the requested script"
  ([Bun's filter docs](https://bun.com/docs/pm/filter)).
- **Install scripts.** "Bun is "default-secure": it only runs lifecycle
  scripts for packages on an allow list", `trustedDependencies` adds to it,
  and "A curated list of popular npm packages with lifecycle scripts is
  allowed by default" ([bun-life]). In the hands-on check,
  `bun pm untrusted` found "0 untrusted dependencies with scripts", and
  workerd ran, so `trustedDependencies` isn't needed for Wrangler.
- Synthesis: `bun install` at the root installs everything and still runs
  husky's `prepare`; `bun run --filter '*' test` runs every package's tests
  and fails when any fails. Later packages without a `test` script, such as
  `app/`, are skipped.

[bun-ws]: https://bun.com/docs/pm/workspaces
[bun-iso]: https://bun.com/docs/pm/isolated-installs
[bun-life]: https://bun.com/docs/pm/lifecycle

## The Workers Vitest plugin

The Cloudflare notes already cover the rename, the `cloudflareTest(...)`
setup, and per-file storage isolation
([Cloudflare notes](/docs/research/0010-cloudflare-workers.md#local-development-and-tests)).
New here:

- **Calling the Worker.** "You can use the `exports` object provided by
  `cloudflare:workers` to write an integration test.
  `exports.default.fetch()` calls the default export handler defined in the
  main Worker"; `env` also comes from `cloudflare:workers`, and helpers from
  `cloudflare:test` ([cf-first]).
- **Test types.** A `test/tsconfig.json` extends the Worker's, adds
  `"@cloudflare/vitest-plugin/types"` ("provides `cloudflare:test` and
  `cloudflare:workers` types") to `types`, and includes the output of
  `wrangler types` ([cf-first]).
- **Required secrets.** Missing `secrets.required` values only warned in
  the tests (see [Hands-on check](#hands-on-check)).
- Synthesis: keep the relay's tests a per-package `vitest run` behind
  `bun run --filter`, not a project in a root Vitest config, which failed
  here.

[cf-first]: https://developers.cloudflare.com/workers/testing/vitest-integration/write-your-first-test/

## Wrangler's generated types and local secrets

- **Runtime types come from `wrangler types`.** Cloudflare recommends it
  over `@cloudflare/workers-types` because it "generates types based on
  your Worker's compatibility date", adds the file to `tsconfig.json`'s
  `types` (`"./worker-configuration.d.ts"`), and says "If you have the
  `nodejs_compat` compatibility flag, you should also install
  `@types/node`." On the file: "You can commit your types file to git if
  you wish." `@cloudflare/workers-types` "will still be the recommended way
  to type libraries and shared packages in the workers environment"
  ([cf-ts]).
- **`.dev.vars` or `.env`.** "Put secrets for use in local development in
  either a `.dev.vars` file or a `.env` file", "Choose to use either
  `.dev.vars` or `.env` but not both. If you define a `.dev.vars` file,
  then values in `.env` files will not be included", and with
  `secrets.required` "only the keys listed in `secrets.required` are loaded
  from `.dev.vars` or `.env`" ([cf-secrets]).
- **Ignoring them.** "The `.dev.vars` and `.env` files should not be
  committed to git. Add `.dev.vars*` and `.env*` to your project's
  `.gitignore` file" ([cf-secrets]). That pattern also matches
  `.dev.vars.example`, so it needs a `!.dev.vars.example` line, as the
  repo's `.gitignore` already does for `.env.example`.
- Synthesis: commit `worker/worker-configuration.d.ts`, check it in CI with
  `wrangler types --check`, and add `@types/node`. Keep the shared package
  free of Worker and Node.js globals so it needs neither type package.

[cf-ts]: https://developers.cloudflare.com/workers/languages/typescript/
[cf-secrets]: https://developers.cloudflare.com/workers/configuration/secrets/

## One TypeScript source package for every consumer

- **Wrangler's esbuild and Vitest** consumed `@turn/shared`'s
  `"exports": { ".": "./src/index.ts" }` with no build step (see
  [Hands-on check](#hands-on-check)).
- **Expo.** "Expo's Metro config has built-in monorepo support for Bun,
  npm, pnpm, and Yarn", so a `metro.config.js` needs no monorepo changes.
  "From **SDK 54**, Expo supports isolated dependencies", but "not all
  packages you install will work", with hoisting as the fallback
  ([expo-mono]).
- Synthesis: a source-only shared package works for the relay and the
  evaluation today. Whether Metro in SDK 57 follows its `exports` under
  isolated installs is for the app's ticket to confirm.

[expo-mono]: https://docs.expo.dev/guides/monorepos/

## Prettier and the Git hooks

- **The generated types fail `prettier --check`.** Prettier 3.9.8 with the
  repo's settings reported "Code style issues found" in
  `worker-configuration.d.ts`, and lint-staged's `"*"` pattern would
  rewrite all of it on commit.
- **Ignored files.** Prettier "will also follow rules specified in the
  ".gitignore" file if it exists in the same directory from which it is
  run" ([prettier-ignore]), so `.wrangler/` and `dist/` drop out once Git
  ignores them.
- Synthesis: add `worker/worker-configuration.d.ts` to `.prettierignore`.
  The hooks call `bunx lint-staged` and `bunx commitlint` from the root,
  where those tools stay root dependencies.

[prettier-ignore]: https://prettier.io/docs/ignore

## Recommended layout and scripts

`shared/` is a placeholder name: the TRD's layout has no directory for the
shared package yet.

```text
/
├── package.json        # private; workspaces ["shared", "worker", "eval"]
├── bun.lock
├── shared/             # exports "./src/index.ts"; Vitest 4.1.11
├── worker/
│   ├── wrangler.jsonc
│   ├── worker-configuration.d.ts   # generated, committed, Prettier-ignored
│   ├── .dev.vars.example           # TYPESAFE_API_KEY=, RC_SECRET_KEY=, ID_SALT=
│   ├── vitest.config.ts
│   ├── src/
│   └── test/           # tsconfig.json with @cloudflare/vitest-plugin/types
└── eval/               # Vitest 4.1.11; @turn/shared as workspace:*
```

- **Root scripts:** keep `"lint": "prettier --check ."` and
  `"prepare": "husky"`, and add `"test": "bun run --filter '*' test"`.
  Installing is plain `bun install`.
- **Package scripts:** `"test": "vitest run"` in each package, and
  Wrangler run from `worker/` (for example `"types": "wrangler types"`),
  never `bunx wrangler` at the root.
- **`.gitignore` additions:** `.dev.vars*`, `!.dev.vars.example`,
  `.wrangler/`, and `dist/`.

## Gaps

- Metro in Expo SDK 57 resolving a TypeScript-source workspace package
  under Bun's isolated installs wasn't tested.
- TypeScript 7.0.2 wasn't run against the workspace (`tsc --noEmit`), and
  its fit with `moduleResolution: "bundler"` wasn't read.
- The Git hooks weren't run in the scratch workspace; only `prepare` was
  seen to run.
- A root Vitest `test.projects` with Vitest installed at the root, or with
  hoisted installs, wasn't tried.
- Secrets from a present `.dev.vars` reaching `env` in tests weren't
  checked, nor whether `wrangler dev` or a real deploy fails when a
  required secret is missing.
- Bun's default trusted-dependency list itself wasn't read.

## See also

- [Technical requirements](/docs/TRD.md)
- [Cloudflare Workers research notes](/docs/research/0010-cloudflare-workers.md)
- [Turn's relay and services research notes](/docs/research/0024-turn-services.md)

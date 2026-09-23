# Turn's workspace implementation plan

**Goal:** Close [issue #17][issue]: Bun workspaces next to `docs/` for the
shared decision code, the relay, and the evaluation, where one command at the
root installs every package and one runs every package's tests, the relay's
inside the Workers runtime, at the TRD's versions, with the relay's local
secrets kept out of Git.

**Architecture:** Three packages join the root `package.json` as Bun
workspaces: `shared/` (`@turn/shared`), `worker/` (`@turn/relay`), and
`eval/` (`@turn/eval`). Each extends a root `tsconfig.base.json` and runs its
own `vitest run` and `tsc`, which the root's `bun run test` and
`bun run typecheck` call in every package. The relay's Vitest config adds
`@cloudflare/vitest-plugin`, so its tests run in workerd. The shared package
ships its TypeScript source, one file per import path, with no build step.
The TRD's layout and versions change in the same commits as the code.

**Tech Stack:** Bun 1.4.2 workspaces with isolated installs, TypeScript
6.0.3, Vitest 4.1.11, `@cloudflare/vitest-plugin` 1.2.2, Wrangler 4.136.2,
Prettier 3 run by husky and lint-staged, commitlint with Conventional
Commits, graphify, the `gh` CLI, and subagents for research and review.

**Spec:** [Issue #17][issue], under the spec in [issue #13][spec], and the
TRD's sections on the [stack and repository][trd-stack],
[secrets and configuration][trd-secrets], and
[testing](/docs/TRD.md#testing). The user's goal directive, verbatim:
"/ask-matt Complete and close #17. Follow @docs/references/markdown-style.md
(use List instead of TOC) and this workflow: branch -> /research (10-minute
max) -> plan -> implement -> create small and atomic commits -> push branch
-> PR -> code review -> resolve -> merge -> delete branch."

Contents:

1.  [Global constraints](#global-constraints)
1.  [Skills](#skills)
1.  [Design](#design)
1.  [Verification gate](#verification-gate)
1.  [Tasks](#tasks)

[issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/17
[spec]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/13
[trd-secrets]: /docs/TRD.md#secrets-and-configuration

## Global constraints

- **The ticket's acceptance criteria,** verbatim:
  - "One command from the root installs every workspace, and one runs every
    package's tests; a smoke test in each passes, the relay's inside the
    Workers runtime"
  - "The versions match the TRD's table"
  - "`bun run lint` passes, and the commit hooks still run"
  - "The relay's local secrets file is ignored by Git, and an example file
    names each secret"
- **Scope.** The Expo app joins in [its own ticket][app-ticket]; the relay's
  routes, bindings, and `secrets.required` belong to
  [the relay's ticket][relay-ticket], the shortlist to
  [the shortlist's ticket][shortlist-ticket], and the evaluation's harness to
  [the harness's ticket][harness-ticket]. This change adds no module to the
  shared package.
- **Versions** are pinned exactly, not as ranges, and every package in the
  TRD's table matches its row.
- **Code** follows the repo's Prettier settings (single quotes, no
  semicolons, 120 columns, no trailing commas) and TypeScript's `strict`.
- **Markdown** follows
  [the Markdown style guide](/docs/references/markdown-style.md), with a
  `Contents:` list in lazy numbering (`1.  [Heading](#anchor)`) instead of
  `[TOC]`: one H1, prose wrapped at 80 characters (links, tables, headings,
  and code blocks are exempt), a language on every fenced code block, and
  repo links as root paths.
- **Commits** follow Conventional Commits: a lowercase subject, a header of
  at most 100 characters, body lines of at most 100 characters, and no
  attribution lines. Stage explicit paths only, never `-A` or `.`, and never
  `skills-lock.json`, `.agents/`, or `.claude/`.
- Absolute dates only. Use they/them for anyone whose pronouns aren't
  stated.

[app-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/22
[relay-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/24
[shortlist-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/23
[harness-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/29

## Skills

`/ask-matt` sends a ticket from `/to-tickets` to `/implement`, which builds
at agreed seams with `/tdd`, typechecks and runs single tests as it goes,
runs the full suite at the end, and closes with `/code-review`. The
directive's steps map to skills:

- **`/research`:** one background agent, capped at 10 minutes, wrote
  [the workspace notes][note] in about five.
- **`/tdd`:** each package starts from its failing smoke test, and the seam
  is the root's `bun run test`.
- **`/pr`:** the pull request's body.
- **`/code-review`:** one round, on its Standards and Spec axes, with issue
  #17 and this plan as the spec.

[note]: /docs/research/0031-turn-workspace.md

## Design

### Decisions

1.  **Three packages, named for the domain.** `shared/` is `@turn/shared`,
    `worker/` is `@turn/relay`, and `eval/` is `@turn/eval`, each private
    and an ES module. The TRD's layout names `worker/` and `eval/` but has
    no folder for the shared code, so it gains `shared/`, the word the TRD
    and the tickets use for that code.
1.  **The shared package ships source, one file per import path.**
    `"exports": { "./*": "./src/*.ts" }` lets each consumer import only the
    file it uses, such as `@turn/shared/shortlist`, with no build step and
    no barrel file, so the relay's bundle never carries the shortlist's
    MiniSearch. In a scratch prototype, a file imported this way resolved in
    Vitest on Node.js, in workerd through the plugin, in Wrangler's bundle,
    and in TypeScript's `bundler` resolution. Metro's check comes with the
    app's ticket, as [the note's gaps][note-gaps] say.
1.  **One command each at the root.** `bun install` installs every package
    and still runs husky's `prepare` ([hands-on check][note-check]).
    `bun run test` is `bun run --filter '*' test`, and `bun run typecheck`
    is `bun run --filter '*' typecheck`: each runs the script in every
    package that has it and exits non-zero if any package fails
    ([Bun workspaces][note-bun]). Bun's own `bun test` runner isn't used,
    and the TRD says so.
1.  **Each package runs its own Vitest.** A root Vitest config with the
    three packages as projects failed on the relay's tests
    ([hands-on check][note-check]), so each package's `test` script is
    `vitest run`.
1.  **One smoke test per package.** `shared` and `eval` each get a test
    that Vitest runs TypeScript there. The relay's Worker answers every
    request with 404 until its routes arrive, and its test checks, inside
    workerd, that `navigator.userAgent` is `Cloudflare-Workers` and that a
    request to the Worker gets 404. Without the plugin, that test fails to
    import `cloudflare:workers`, which is its red step. No package imports
    `@turn/shared` yet: the first ticket that uses it adds the
    `workspace:*` dependency with the first file.
1.  **TypeScript 6.0.3, `strict`, from one base.** A root
    `tsconfig.base.json` sets `strict`, `noEmit`, `isolatedModules`,
    `verbatimModuleSyntax`, `skipLibCheck`, `moduleResolution: "bundler"`,
    ES2024, and `types: []`, so the shared code sees no Node.js, DOM, or
    Workers globals. Each package extends it, and the relay's adds the types
    `wrangler types` generates and `@cloudflare/vitest-plugin/types`, which
    its tests need for `cloudflare:workers`. The version is 6.0.3, which
    Expo SDK 57's template pins, so the shared code is checked by the
    TypeScript the app will compile it with ([versions][note-versions]).
    `tsc` 6.0.3 passes in all three packages and catches type errors planted
    in the relay's test and in the shared code. The TRD's table has no
    TypeScript row, so it gains one.
1.  **The Workers types are generated, not committed.** The relay's
    `typecheck` runs `wrangler types` before `tsc`. The generated file is
    15,758 lines of runtime types in [the note's check][note-check], about
    590 KB, which Prettier would reformat and graphify would index, so Git
    ignores it, and Prettier follows Git.
    `wrangler types` asks for `@types/node`, but `tsc` passes without it and
    the relay uses no Node.js API, so it isn't added.
1.  **The plugin is 1.2.2, not 1.2.1.** Plugin 1.2.1 depends on Wrangler
    4.136.1 exactly, so the TRD's pins would install two Wranglers; 1.2.2,
    published on September 22, 2026, depends on 4.136.2 exactly
    ([versions][note-versions]). The TRD's table and testing section change
    in the relay's commit. Vitest is pinned to 4.1.11, since npm's `latest`
    is 5.0.1, outside the plugin's `^4.1.0` peer range.
1.  **Local secrets stay out of Git.** `.gitignore` gains `.dev.vars*` and
    `!.dev.vars.example` beside its `.env*` rules, as Cloudflare advises
    ([local secrets][note-secrets]), and `worker/.dev.vars.example` names
    `TYPESAFE_API_KEY`, `RC_SECRET_KEY`, and `ID_SALT`, each with an empty
    value and a comment on its use from the TRD's table. `.gitignore` also
    gains `.wrangler/`, where Wrangler keeps its local state.
    `secrets.required` waits for the relay's ticket, whose criterion is that
    a deploy without the secrets fails.
1.  **The hooks don't change.** They call `bunx lint-staged` and
    `bunx commitlint` at the root, where those tools stay root dependencies,
    and each commit's output shows them run.
1.  **Prettier skips the source captures.** `bun run lint` already failed on
    `main`: 60 of the 61 captures of outside pages in `docs/sources/`, added
    on September 19, 2026, were never formatted. Formatting them would
    rewrite the quotes in their front matter, 429 changed words, and one
    file still failed after `prettier --write`, so `.prettierignore` gains
    `docs/sources/` instead, in a commit of its own before the workspace's.

[note-gaps]: /docs/research/0031-turn-workspace.md#gaps
[note-check]: /docs/research/0031-turn-workspace.md#hands-on-check
[note-bun]: /docs/research/0031-turn-workspace.md#bun-workspaces
[note-versions]: /docs/research/0031-turn-workspace.md#versions-on-september-23-2026
[note-secrets]: /docs/research/0031-turn-workspace.md#wranglers-generated-types-and-local-secrets

### Rejected alternatives

- **One root Vitest config with projects:** it failed on the relay's tests.
- **A `packages/` folder:** the TRD's layout puts each package at the root.
- **A barrel `src/index.ts`:** every consumer would load every file, and the
  relay would bundle MiniSearch.
- **Committing `worker-configuration.d.ts`,** as the note suggests: 590 KB
  of generated types in every diff that changes a binding, plus entries in
  `.prettierignore` and `.graphifyignore`, and `wrangler types --check` to
  keep it current. Generating it in `typecheck` needs none of these.
- **Plugin 1.2.3 with Wrangler 4.136.3,** the newest pair: it moves the
  TRD's Wrangler pin too, while 1.2.2 changes only the plugin's.
- **TypeScript 7.0.2,** npm's `latest`, which the first commits used until
  the review: the app will compile the shared code with Expo's 6.0.3, and
  7.0.2's package has no compiler API and no `tsserver`.
- **A smoke test that imports the shared package:** it needs a module there
  before any ticket defines one, so the prototype checked those imports
  instead.

### Out of scope

- The app, the local modules, the relay's routes and configuration, the
  evaluation's harness, and any shared module (see
  [the scope](#global-constraints)).
- Continuous integration, the README, and the license, which later tickets
  add.

## Verification gate

Every code task runs these from the root before committing, and each must
exit 0:

```shell
setopt pipefail
bun install --frozen-lockfile
bun run test
bun run typecheck
bun run lint
```

Markdown files run the gate from [the plan-storage plan][docs-gate]:
Prettier, `check_md.py` with `--contents`, and `fact_scan.py` for new prose.
After Task 7, `git check-ignore -v worker/.dev.vars` names the rule that
ignores it, and `git status --short` lists no generated file.

[docs-gate]: /docs/plans/0009-plan-storage.md#verification-gate

## Tasks

Every subagent prompt carries the repo rule: run `graphify query "<question>"`
before grepping or reading repo files. No subagent sends the user's email
address or any personal identifier to an API, and none writes a repo file
its prompt doesn't name or runs git.

### Task 1: Research note

A background agent wrote `docs/research/0031-turn-workspace.md` in about
five minutes. It passed the docs gate, with one fact-scan miss (its own
line count of a generated file), and was committed as
`docs(research): add notes on the workspace setup`.

### Task 2: This plan

- [ ] **Step 1: Run the docs gate, then commit**

```shell
git add docs/plans/0010-turn-workspace.md
git commit -m "docs(plan): add the plan for the workspace"
```

### Task 3: Prettier and the source captures

- [ ] **Step 1: See it fail.** `bun run lint` exits 1 on 60 files in
      `docs/sources/`.
- [ ] **Step 2: Ignore them.** Add `docs/sources/` to `.prettierignore`,
      then `bun run lint` passes.
- [ ] **Step 3: Commit**

```shell
git add .prettierignore docs/plans/0010-turn-workspace.md
git commit -m "chore: keep prettier off the source captures"
```

### Task 4: The workspace and the shared package

**Files:** modify `package.json`, `bun.lock`, and `docs/TRD.md`; create
`tsconfig.base.json` and
`shared/{package.json,tsconfig.json,src/smoke.test.ts}`.

- [ ] **Step 1: Write the failing smoke test** in `shared/src/smoke.test.ts`:

```ts
import { expect, test } from 'vitest'

test('Vitest runs TypeScript in this package', () => {
  const answer: number = 6 * 7
  expect(answer).toBe(42)
})
```

- [ ] **Step 2: Run it and see it fail.** `bun run test` exits 1: the root
      has no `test` script yet.
- [ ] **Step 3: Add the workspace.** In the root `package.json`, add
      `"private": true`, `"workspaces": ["shared"]`, and two scripts:

```json
{
  "test": "bun run --filter '*' test",
  "typecheck": "bun run --filter '*' typecheck"
}
```

`tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "target": "es2024",
    "lib": ["es2024"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "types": [],
    "strict": true,
    "noEmit": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true
  }
}
```

`shared/package.json`, and a `shared/tsconfig.json` that extends
`../tsconfig.base.json` and includes `src`:

```json
{
  "name": "@turn/shared",
  "private": true,
  "type": "module",
  "exports": {
    "./*": "./src/*.ts"
  },
  "scripts": {
    "test": "vitest run",
    "typecheck": "tsc"
  },
  "devDependencies": {
    "typescript": "6.0.3",
    "vitest": "4.1.11"
  }
}
```

- [ ] **Step 4: Run it and see it pass.** `bun install`, then the
      [verification gate](#verification-gate).
- [ ] **Step 5: Update the TRD.** In
      [the repository layout](/docs/TRD.md#repository-layout), add `shared/`
      to the tree, name the folder, the package, and the import by file in
      the shared-code bullet, and add a bullet for the root commands, saying
      that Bun's own `bun test` isn't used. In
      [the versions table][trd-stack], add TypeScript 6.0.3.
- [ ] **Step 6: Commit**

```shell
git add package.json bun.lock tsconfig.base.json shared docs/TRD.md
git commit -m "build: add the bun workspace and the shared package"
```

### Task 5: The evaluation's package

**Files:** modify `package.json` and `bun.lock`; create
`eval/{package.json,tsconfig.json,src/smoke.test.ts}`.

- [ ] **Step 1: Write the smoke test,** the shared package's test, in
      `eval/src/smoke.test.ts`. Until `eval` is a workspace, `bun run test`
      doesn't run it.
- [ ] **Step 2: Add the package.** `eval/package.json` is the shared
      package's without `exports`, named `@turn/eval`, and its
      `tsconfig.json` matches the shared package's. Add `eval` to the
      root's `workspaces`, after `shared`.
- [ ] **Step 3: Run it and see it pass.** `bun install`, then the gate;
      `bun run test` reports `@turn/eval`.
- [ ] **Step 4: Commit**

```shell
git add package.json bun.lock eval
git commit -m "build(eval): add the evaluation's package"
```

### Task 6: The relay's package

**Files:** modify `package.json`, `bun.lock`, `.gitignore`, and
`docs/TRD.md`; create `worker/{package.json,wrangler.jsonc,tsconfig.json}`,
`worker/vitest.config.ts`, `worker/src/index.ts`, and
`worker/test/index.test.ts`.

- [ ] **Step 1: Write the failing test** in `worker/test/index.test.ts`:

```ts
import { exports } from 'cloudflare:workers'
import { expect, test } from 'vitest'

test('runs inside the Workers runtime', () => {
  expect(navigator.userAgent).toBe('Cloudflare-Workers')
})

test('answers a request', async () => {
  const response = await exports.default.fetch('https://relay.test/')
  expect(response.status).toBe(404)
})
```

- [ ] **Step 2: Add the package without the plugin's config, and see it
      fail.** `worker/package.json` is named `@turn/relay`, with
      `"test": "vitest run"`, `"typecheck": "wrangler types && tsc"`, and
      the dev dependencies `@cloudflare/vitest-plugin` 1.2.2, `typescript`
      6.0.3, `vitest` 4.1.11, and `wrangler` 4.136.2. Add `worker` to the
      root's `workspaces` between `shared` and `eval`, and run `bun install`.
      `bun run test` fails with "Cannot find package 'cloudflare:workers'".
- [ ] **Step 3: Add the Worker and the plugin.** `worker/wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "turn-relay",
  "main": "src/index.ts",
  "compatibility_date": "2026-09-22"
}
```

`worker/src/index.ts`:

```ts
export default {
  fetch() {
    return new Response(null, { status: 404 })
  }
} satisfies ExportedHandler<Env>
```

`worker/vitest.config.ts`:

```ts
import { cloudflareTest } from '@cloudflare/vitest-plugin'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [cloudflareTest({ wrangler: { configPath: './wrangler.jsonc' } })]
})
```

`worker/tsconfig.json`:

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "types": ["./worker-configuration.d.ts", "@cloudflare/vitest-plugin/types"]
  },
  "include": ["src", "test"]
}
```

In `.gitignore`, add `.wrangler/` and `worker-configuration.d.ts`.

- [ ] **Step 4: Run it and see it pass.** The gate, then
      `git status --short` lists neither `.wrangler/` nor the generated
      types.
- [ ] **Step 5: Update the TRD.** The plugin's row says 1.2.2, keeping
      its column's width, and the testing section says 1.2.2 with Vitest
      4.1.11, and why, citing the note, whose link moves to the end of the
      TRD, since two sections now use it.
- [ ] **Step 6: Commit**

```shell
git add package.json bun.lock .gitignore worker docs/TRD.md
git commit -m "build(relay): add the relay's package, tested in the workers runtime"
```

### Task 7: Local secrets

- [ ] **Step 1: Ignore them.** Under `.gitignore`'s `# Environment`, after
      `!.env.example`, add `.dev.vars*` and `!.dev.vars.example`.
- [ ] **Step 2: Name them** in `worker/.dev.vars.example`:

```text
# Copy to .dev.vars, which Git ignores, and fill in your own values.
# TypeSafe's API key, for calling Jev.
TYPESAFE_API_KEY=
# RevenueCat's secret API key, for the v2 entitlement check.
RC_SECRET_KEY=
# Hashes app user IDs: any long random string, such as `openssl rand -hex 32`.
ID_SALT=
```

- [ ] **Step 3: Check it.** With a throwaway `worker/.dev.vars`,
      `git check-ignore -v worker/.dev.vars` names the rule,
      `git check-ignore worker/.dev.vars.example` prints nothing, and the
      gate passes; then delete the throwaway file.
- [ ] **Step 4: Commit**

```shell
git add .gitignore worker/.dev.vars.example
git commit -m "build(relay): keep local secrets out of git and name them in an example"
```

### Task 8: Graph, pull request, review, and merge

1.  Run `graphify update .`, check that the graph holds no `node_modules`,
    `.wrangler`, or generated types, and commit `graphify-out/` as
    `chore(graphify): refresh the graph after adding the workspace`.
1.  Push the branch and open the pull request with the `/pr` template and
    "Closes #17".
1.  Run one `/code-review` round against `main`, with issue #17 and this
    plan as the spec, post it as a PR comment, fix what it confirms in one
    commit per fix or group of related fixes, and post a resolution comment.
1.  Rebase-merge the pull request, delete the branch locally and on the
    remote, and check that #17 closed with its criteria ticked.

[trd-stack]: /docs/TRD.md#versions-on-september-22-2026

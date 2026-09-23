# Turn's exact address limit implementation plan

**Goal:** Close [issue #98][address-ticket]: decide whether the relay counts
each address's 120 requests a minute exactly, and record why. The decision
is yes: an object of its own counts each address, so the 121st request in a
clock minute from one address gets `429` with `Retry-After` before it
reaches any user's object.

**Architecture:** Once a request's headers and a line's body pass, the
Worker asks a new `Address` Durable Object, named by the salted hash of
`CF-Connecting-IP`, to count the request in the current clock minute, the
way the user's `Device` object already counts the ID's 30. Below 120 the
object writes the count plus one; otherwise the request gets
`429 rate_limited` with `Retry-After: 60`, and no user's object is
reached. The count replaces the `ADDRESS_LIMITER` rate limiting binding,
which let 250 requests from one address through in 18 seconds. The
minute's count moves into one module that both objects use.

**Tech Stack:** Cloudflare Workers with SQLite Durable Objects, Wrangler
4.136.2, `@cloudflare/vitest-plugin` 1.2.2 with Vitest 4.1.11, and
TypeScript 6.0.3 in a Bun 1.4.2 workspace; graphify; and subagents for
research and review.

**Spec:** Issue #98, under the spec in [issue #13][spec], and the TRD's
sections on [validation and abuse limits][trd-limits],
[the relay's storage][trd-storage], and
[secrets and configuration][trd-secrets]. The user's goal directive,
verbatim: "/ask-matt Complete and close #98. Follow
@docs/references/markdown-style.md (use List instead of TOC) and this
workflow: branch -> /research (10-minute max) -> plan -> implement ->
create small and atomic commits -> push branch -> PR -> code review ->
resolve -> merge -> delete branch."

Contents:

1.  [Global constraints](#global-constraints)
1.  [Skills](#skills)
1.  [Design](#design)
1.  [Verification gate](#verification-gate)
1.  [Tasks](#tasks)

[address-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/98
[spec]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/13
[trd-limits]: /docs/TRD.md#validation-and-abuse-limits
[trd-storage]: /docs/TRD.md#the-relays-storage
[trd-secrets]: /docs/TRD.md#secrets-and-configuration

## Global constraints

- **#98's acceptance criteria,** verbatim:
  - "The decision, and why, is recorded here"
  - "If the address is counted exactly, the 121st request in a clock minute
    from one address gets 429 with `Retry-After`, before it reaches any
    user's object"
- **The ticket's body:** "Decide whether to count each address exactly,
  for example in a Durable Object named by a salted hash of the address, as
  each user's object now counts the ID's 30, or to keep the binding and
  accept the gap. An exact count costs one more object call and one row per
  request, which the Free plan's 100,000 a day then share."
- **Blockers.** #35 closed through #96, which the ticket was blocked by.
- **Scope.** The app's side of a `429` is [#48][app-ticket]. SEC-3's 30
  requests an ID, the daily budget, and `Retry-After: 60` stay as #96 built
  them.
- **Versions** are pinned exactly, as they are.
- **Code** follows the repo's Prettier settings (single quotes, no
  semicolons, 120 columns, no trailing commas), TypeScript's `strict`, and
  the doc comments of `worker/src/`, wrapped under 120 columns by hand.
- **Markdown** follows
  [the Markdown style guide](/docs/references/markdown-style.md), with a
  `Contents:` list in lazy numbering (`1.  [Heading](#anchor)`) instead of
  `[TOC]`: one H1, prose wrapped at 80 characters (links, tables, headings,
  and code blocks are exempt), a language on every fenced code block, repo
  links as root paths, and no code span broken across lines.
- **Commits** follow Conventional Commits: a lowercase subject, a header of
  at most 100 characters, body lines of at most 100 characters with none
  starting with "word:" or "word #N", and no attribution lines. Stage
  explicit paths only, never `-A` or `.`, and never `skills-lock.json`,
  `.agents/`, or `.claude/`.
- **The worktree.** Other sessions work in the main checkout and in
  sibling worktrees, so this change is built in
  `../revenuecat-address-limit`, on the branch `relay/address-limit`. Plan
  0026 and notes 0048 and 0049 belong to open pull request #97, so this
  change takes plan 0027 and note 0050, which its peers confirmed.
- **Secrets and identifiers.** The Cloudflare account ID, the account's
  login, the `workers.dev` subdomain, and this Mac's public addresses never
  appear in a command line's output, a tracked file, a commit, or a
  comment. A fail-closed scan reads each from a private file and checks
  every doc, message, and comment before it's committed or posted. The
  live check's app user IDs are fixed check IDs made for it, never a
  person's.
- Absolute dates only. Use they/them for anyone whose pronouns aren't
  stated.

[app-ticket]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/48

## Skills

`/ask-matt` sends a ticket to `/implement`, which builds at agreed seams
with `/tdd`, runs the full suite at the end, and closes with
`/code-review`. The directive's steps map to skills:

- **`/research`:** one background agent, capped at 10 minutes, read
  Cloudflare's pages on the Free plan's quotas, what an object's call
  costs, the binding's price, `exports`, and object names, in about six
  minutes. Its findings, with a local measurement of the count's rows, are
  [the address limit notes][note-address].
- **`/tdd`:** each behavior starts from a failing test at the Worker's
  `fetch`, the seam the relay's tests already use.
- **`/pr`:** the pull request's body.
- **`/code-review`:** one round, on its Standards and Spec axes, with the
  issue and this plan as the spec, plus a fact-check and bug-hunt agent.

[note-address]: /docs/research/0050-turn-address-limit.md

## Design

### Decisions

1.  **Count each address exactly.** The relay's code is public once the
    repository opens for judging (SEC-1), and its address is in every copy
    of the app, so the likeliest abuse is a script on one machine minting
    IDs. That's the burst the binding missed: live, it let all 250 requests
    from one address through in 18 seconds
    ([relay limits notes][note-live]), and Cloudflare calls it "permissive,
    eventually consistent" ([address limit notes][note-binding]). Counted
    exactly, at most 120 of one address's requests a minute reach users'
    objects, so its lines take at most 240 of the day's calls to Jev a
    minute, retries included, and the 10,000 last over 40 minutes against
    it. The count holds nothing against a sender with many addresses, such
    as one IPv6 client moving through its /64; the daily budget stays what
    caps them. Nor does it keep one address from the Free plan's rows: at
    120 requests a minute, each from a new ID, it writes 8 rows a request,
    or 11 for lines, and spends the day's 100,000 in about 75 to 105
    minutes, where the binding's live pace, had it held nothing back, took
    about 11 to 15; then every call to an object fails until midnight UTC.
1.  **The cost fits the Free plan.** A counted request reads 2 rows and
    writes 1 in its address's object, a refused one reads 1 and writes
    none, and an object's first request writes 2 more for its table
    ([address limit notes][note-rows]). A new device that spends all 20
    free lines in a day from one address, with two configuration requests,
    then writes 112 rows, not 88: 24 in the address's object, 68 in its own
    (6 for its tables, 22 for its count, and 40 for its free lines), and 20
    in the day's budget. The Free plan's 100,000 rows a day cover about 890
    such devices, not 1,140, and its 100,000 object requests about 1,560,
    at 64 each. Rows still run out first, far above judging's volume.
1.  **Its storage grows with new addresses.** Each new address's object
    keeps its database, about 12 KB by Cloudflare's figure, until its data
    is removed ([address limit notes][note-quotas]). At 3 rows for a new
    object, the Free plan's rows allow about 33,000 new addresses a day,
    about 0.4 GB. Its 5 GB is a total that no day resets, though, so a
    sender moving through new addresses every day would fill it in about
    12 days, as minted IDs' objects already could. An address's object
    holds nothing a later minute reads, so dropping the class with a
    `"deleted"` tombstone loses only the current minute's counts.
1.  **An object per address.** `Address`, a SQLite Durable Object in
    `worker/src/address.ts`, is reached with
    `getByName('address-<hash>', { locationHint: 'wnam' })`, where the hash
    is the hex SHA-256 of `ID_SALT` and the address, as the user's object
    is named by the ID's. The address is `CF-Connecting-IP`, which
    Cloudflare's edge won't take from a client, and a request without one
    shares the hash of the salt alone. Its `admit()` counts the request
    against `addressRequestsPerMinute`, 120, a constant beside the class.
    The Worker's `hashUser()` becomes `saltedHash()`, which hashes both.
1.  **One count for both objects.** The `requests` table and the count
    that `Device.admit()` runs move to `worker/src/minute-count.ts`: one
    function creates the table, and one counts a request in the current
    clock minute in one `transactionSync()`, writing the count plus one
    below its limit, or refusing and writing nothing. `Device` counts
    against 30 through it and `Address` against 120; the user's object
    keeps its table, so no stored count changes shape.
1.  **The address's count, then the ID's.** In `route()`, once `readUser`
    passes and a line's body is read and checked (SEC-2), the Worker asks
    the address's object, and only then the user's object, which counts the
    request as the first step of serving it. A request over the address's
    120 gets `429 rate_limited` with `Retry-After: 60`, and reaches no
    user's object, so it spends none of the ID's 30, no free line, and no
    call. Invalid headers or lines get `400` first and count against
    nothing. The price: one sender behind a carrier's NAT can spend the
    address's 120 in a minute alone, its requests past 30 refused by its
    own count, while its neighbours wait for the next minute. Counting the
    ID first would let every flood into users' objects, as #96 found.
1.  **The binding goes.** `ADDRESS_LIMITER` and its `ratelimits` entry
    leave `worker/wrangler.jsonc`. In front of the exact count, it would
    spare object calls only for a flood that outlasts its lag, which live
    held back nothing for 18 seconds, while each such request still spends
    one of the Worker's own 100,000 a day. In the local tests, where the
    binding counts exactly, it would refuse the 121st itself and hide the
    object's count.
1.  **`Retry-After: 60`,** as #96 set it: both counts start again when
    their clock minute ends, which is never more than 60 seconds away, and
    both limits keep answering alike. `refuse()`'s comment loses the
    binding's reason. The log's outcome stays `limited`.
1.  **The tests.** The address's tests set `Date` with `vi.setSystemTime`,
    as the ID's do, since the object counts by it, and send each address's
    requests across fresh IDs below 30 each:
    - 120 requests answer, and the 121st, a new ID's line, gets `429` with
      `Retry-After: 60`, no call to Jev, and no claimed line, while another
      address still answers;
    - a request over the limit never asks `DEVICE` for an object;
    - the next clock minute starts again;
    - exactly 120 of 150 simultaneous requests answer;
    - a line that fails its checks counts against nothing;
    - the object's name is `address-` and the salted hash of the address,
      or of nothing for a request without one, never the address;
    - from review round 1: a failing address object answers
      `500 internal` and reaches no user's object, `X-Forwarded-For` never
      picks the count, Simulator requests count too (PAY-9), and one count
      lasts from a minute's first millisecond to its last.

    Before the object, the local binding counts exactly, so only the tests
    of the next minute and of the name fail against it. The other tests
    send no address, as before, so each shares one address's count and
    stays under 120, and `reset()` clears it after each test.

1.  **Every guard is mutated once.** Before the pull request, the limit,
    the comparison, the minute, the order of the two counts, the key, the
    hash, and the `Retry-After` are broken one at a time, and a test must
    fail for each; review round 1 adds a shorter window, failing open,
    `X-Forwarded-For` as the key, and Simulator requests skipping the
    count.
1.  **The live check.** After the review, the reviewed head is deployed
    with `wrangler deploy`, once the live version is still #96's
    `e3ebe6b9`, and a script that prints only statuses, `Retry-After`, and
    times sends, each part in a new clock minute:
    - 150 configuration requests from this Mac, across ten fixed check IDs
      with 15 each, eight at a time, from the minute's first second: exactly
      120 should answer, and 30 get `429` with `Retry-After: 60`;
    - 31 configuration requests from one check ID: the 31st gets `429`;
    - one line from a check ID, which Jev answers.

    Before the deploy and after it, 20 configuration requests from one
    check ID, one every 2 seconds, give the median time each took from
    this Mac, the added call's cost. The check IDs run from
    `00000000-0000-4000-8000-000000000981` to
    `00000000-0000-4000-8000-000000000990`, so repeated checks reuse ten
    objects. What it found goes in the note's
    hands-on check and on #98. After the merge, a build of `main`'s worker
    is compared byte for byte with the deployed script.

1.  **The TRD.** The architecture's diagram, parts, and path of a line,
    the relay's storage and the Free plan's budget, the secrets table's
    `ID_SALT` and `wrangler.jsonc`, the limits' rate bullet, and the data
    inventory, each section in its own commit.

[note-live]: /docs/research/0046-turn-relay-limits.md#hands-on-check
[note-binding]: /docs/research/0050-turn-address-limit.md#the-bindings-price
[note-rows]: /docs/research/0050-turn-address-limit.md#local-measurement
[note-quotas]: /docs/research/0050-turn-address-limit.md#the-free-plans-quotas

### Rejected alternatives

- **Keeping the binding and accepting the gap:** for as long as the binding
  lags, a script on one machine reaches users' objects past 120 a minute,
  spending the day's calls to Jev and the Free plan's rows for every user
  until midnight UTC.
- **The binding in front of the count:** see the binding's decision.
- **A count kept in memory:** it writes no row, but an object idle for 10
  seconds hibernates and discards it, so a sender who pauses gets a fresh
  120, and a deploy starts it again too.
- **Deleting each address's data when its minute ends:** an alarm is a
  billed request and a row written, and its deletes are rows too, so it
  would spend the daily rows sooner to save storage their limit already
  bounds.
- **One object for every address:** every request would queue through the
  one object, the global counter Cloudflare warns about, and its table
  would grow a row per address.
- **The address unhashed:** the object's name would carry it; the salted
  hash keeps names that can't be traced back without the salt.
- **A salt of its own:** `ID_SALT` is already the relay's secret, and the
  `address-` prefix keeps the names apart from users'.
- **Grouping IPv6 addresses by /64:** the ticket counts one address, and
  #96 rejected it; an IPv6 sender with many addresses stays the daily
  budget's to cap.
- **The seconds to the next minute as `Retry-After`:** a change to both
  limits' answers, which the app's #48 reads, beyond this ticket.
- **A copy of `Device.admit()` in `Address`:** the same count twice, with
  only the limit different.

### Out of scope

- The app's handling of `429` and `Retry-After` (#48).
- IPv6 prefixes, an alert on refused requests, and Workers Paid.

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

The gate also fails on any line over 120 columns in `worker/` or
`shared/`, and it never pipes a check into `tail`.

Markdown files run the gate from [the plan-storage plan][docs-gate]:
Prettier, `check_md.py` with `--contents`, and `fact_scan.py` for new prose,
plus a check that no code span breaks across lines and the identifier scan.

[docs-gate]: /docs/plans/0009-plan-storage.md#verification-gate

## Tasks

Every subagent prompt carries the repo rule: run `graphify query "<question>"`
before grepping or reading repo files. No subagent sends the user's email
address or any personal identifier to an API, runs `bun run eval`, deploys,
or writes a repo file its prompt doesn't name or runs git.

### Task 1: Research notes

A background agent wrote the findings, and the local measurement added its
own, in `docs/research/0050-turn-address-limit.md`, which passed the docs
gate and was committed.

### Task 2: This plan

- [ ] **Step 1: Run the docs gate, then commit** as
      `docs(plan): add the plan for the exact address limit`.

### Task 3: One minute's count

**Files:** create `worker/src/minute-count.ts`; modify
`worker/src/device.ts`.

- [ ] **Step 1: Move the count** out of `Device` into the module, with the
      ID's tests unchanged, run the gate, and commit as
      `refactor(relay): share the clock minute's count between objects`.

### Task 4: The address's object

**Files:** create `worker/src/address.ts`; modify `worker/wrangler.jsonc`,
`worker/src/index.ts`, `worker/test/limits.test.ts`, and
`worker/test/setup.ts`.

- [ ] **Step 1: Write the failing tests** in the design's list, and see
      the tests of the next minute and of the name fail against the
      binding.
- [ ] **Step 2: Add the object and its binding,** remove the rate limiting
      binding, see the tests pass, run the gate, and commit as
      `feat(relay): count each address's requests exactly in its own object`.

### Task 5: Mutations

- [ ] **Step 1: Mutate each guard** in the design's list, one at a time,
      and see a test fail for each; add a test for any that survives.

### Task 6: The TRD

- [ ] **Step 1: Edit** the TRD's sections as the design's last decision
      says, run the docs gate, and commit each section on its own.

### Task 7: Graph, pull request, review, deploy, and merge

1.  Run `graphify update .` and commit `graphify-out/` as
    `chore(graphify): refresh the graph after the address limit`.
1.  Post the decision on #98, re-read #98, push the branch, and open the
    pull request with the `/pr` template and "Part of #98", since #98
    closes by hand once the live check's evidence is on it.
1.  Run one `/code-review` round against `main`, with the issue and this
    plan as the spec, and a fact-check and bug-hunt agent; post it as a PR
    comment, fix what it confirms in one commit per fix or group of related
    fixes, and post a resolution comment.
1.  Deploy the reviewed head, run the live check, record it in the note's
    hands-on check, and post the results on the pull request.
1.  List `docs/plans` and `docs/research` on `origin/main`, on open pull
    requests, and on peer branches, renumber if another claims these
    numbers, then rebase-merge, delete the branch locally and on the
    remote, and remove the worktree.
1.  Compare a build of `main`'s worker with the deployed script, post the
    evidence on #98, tick its criteria, and close it.

# Turn's setup implementation plan

**Goal:** Close [issue #14][key-issue] and [issue #16][setup-issue]: the Jev
key checked and set as the relay's secret, with no copy in Git; the
Cloudflare account checked; the bundle ID chosen and named in the TRD; and
the criteria only a person can meet moved, word for word, to two
`ready-for-human` follow-up tickets.

**Architecture:** No code changes. The key goes from `~/.zshrc` to the
relay's secrets through a pipe, so it never appears in a command line, an
output, or a tracked file. A shell check proves each criterion the session
ticks. The TRD records the bundle ID. The follow-up tickets carry TypeSafe's
console, the two messages, and the video iPhone, with the texts and
commands a teammate needs.

**Tech Stack:** Wrangler 4.136.2, curl, Git, Xcode 27's `xcrun devicectl`,
graphify, the `gh` CLI, and subagents for research and review.

**Spec:** [Issue #14][key-issue] and [issue #16][setup-issue], under the
spec in [issue #13][spec], and the TRD's sections on
[secrets and configuration][trd-secrets], [build configuration][trd-build],
and [environments and release][trd-env]. The user's goal directive,
verbatim: "/ask-matt Complete and close #14 (TYPESAFE_API_KEY from
~/.zshrc) and #16. Follow @docs/references/markdown-style.md (use List
instead of TOC) and this workflow: branch -> /research (10-minute max) ->
plan -> implement -> create small and atomic commits -> push branch -> PR
-> code review -> resolve -> merge -> delete branch."

Contents:

1.  [Global constraints](#global-constraints)
1.  [Skills](#skills)
1.  [Design](#design)
1.  [Verification gate](#verification-gate)
1.  [Tasks](#tasks)
1.  [Appendix: the two messages](#appendix-the-two-messages)

[key-issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/14
[setup-issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/16
[spec]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/13
[trd-secrets]: /docs/TRD.md#secrets-and-configuration
[trd-env]: /docs/TRD.md#environments-and-release

## Global constraints

- **#14's acceptance criteria,** verbatim:
  - "The key lives only in the relay's secrets and teammates' ignored local
    files, never in the repository or its history (SEC-1)"
  - "Credits are funded and auto-refill is on, with the date noted here
    (AVAIL-1)"
  - "The naming request is sent, with its date noted here, and its answer
    when it comes (SUBMIT-6, CONSENT-7)"
  - "If there's no key by noon PT on September 23: support and Discord are
    contacted, noted here"
  - "If there's no key by the end of September 24: the go/no-go decision is
    recorded here"
  - "The organizers' answer on keeping the captures public is recorded here"
- **#16's acceptance criteria,** verbatim:
  - "`wrangler login` works on the Mac that deploys the relay"
  - "The bundle ID is recorded here"
  - "Xcode 27 builds to the video iPhone under the free Personal Team, with
    Developer Mode on and the certificate trusted (COMPAT-4)"
  - "The video iPhone's model and iOS version are recorded here; without an
    iPhone 15 Pro or later, the video uses a system voice"
- **The key never shows.** No command prints the key or takes it as an
  argument, and no tracked file holds it: curl reads its header with
  `-K -`, `wrangler secret put` reads the value from a pipe, and `grep`
  reads the pattern with `-f`.
- **Other checkouts.** Peer sessions hold the main checkout and
  `../revenuecat-score-rankers`, so this work runs in `../revenuecat-setup`
  and writes nothing in either.
- **A person's steps stay a person's.** No agent ticks a criterion that
  needs TypeSafe's console, a message sent as the team, or the iPhone in
  hand. Each moves verbatim to a `ready-for-human` follow-up, as #75 did for
  #18, and the closed ticket's box stays unticked with a pointer.
- **Docs** follow the [Markdown style guide][style], with a `Contents:` list
  in place of `[TOC]`.

[style]: /docs/references/markdown-style.md

## Skills

`/ask-matt` sends a ticket to `/implement`, and a wall only a person can
pass to `/wizard`. The directive's steps map to skills:

- **`/research`:** one background agent, capped at 10 minutes, wrote
  [the setup notes][note] in about six, and the session added its hands-on
  check.
- **`/implement`:** there's no code, so no `/tdd` slice; each criterion the
  session ticks has a shell check with its expected output, under
  [Verification gate](#verification-gate).
- **`/wizard`:** not used. A wizard "walks a human, step by step, through a
  manual procedure", but each of the person's steps here runs once, and the
  skill keeps a wizard ephemeral unless the user wants a repeatable setup
  path; the follow-up tickets carry the steps instead.
- **`/pr`:** the pull request's body.
- **`/code-review`:** one round, on its Standards and Spec axes, with issues
  #14 and #16 and this plan as the spec, plus a fact-check agent.

[note]: /docs/research/0036-turn-setup.md

## Design

### Decisions

1.  **The key goes to the relay as a secret.** From `worker/`, the pinned
    Wrangler adds it to `turn-relay`, the Worker #15 deployed with
    `RC_SECRET_KEY`:

    ```shell
    printf '%s' "${TYPESAFE_API_KEY:?}" |
      bunx wrangler secret put TYPESAFE_API_KEY --name turn-relay
    ```

    Wrangler reads the value from the pipe because standard input isn't a
    terminal ([Cloudflare notes][note-cf]), and sends whatever the pipe
    holds, so `:?` stops the command when the variable is unset or empty
    instead of uploading an empty secret. The key's other copy stays in
    `~/.zshrc`, outside every repository.

1.  **No `worker/.dev.vars`.** The relay's tests mock Jev, and #28 calls it
    through the deployed relay, so no ticket runs Jev under `wrangler dev`
    yet, and each copy of the key is one more file that can leak. A teammate
    who needs one copies `worker/.dev.vars.example`.
1.  **Two calls prove the key.** `GET /v1/models` proves it without
    spending an Input, and one `POST /v1/systemone` with a single Noul
    proves that credits pay for a call and that the pin answers as
    `jev-1.13.0` ([hands-on check][note-hands]).
1.  **The Git check reads every object.** The key, read from a pipe, is
    matched against every object in the store, reachable or not, after
    fetching every branch and every pull request's head, so no ref, reflog,
    or dangling object can hold it. It runs before the pull request and
    again after the merge.
1.  **The triggers didn't fire.** The key was in `~/.zshrc` when the
    session started, at 01:48 PDT on September 23, and a billed call
    succeeded at 01:57 PDT, before noon PT. Neither the support message nor
    the go/no-go decision is needed, so both boxes are ticked with that
    note.
1.  **The bundle ID is `com.m1ku.turn`.** It's lowercase, since "Bundle IDs
    are case-insensitive", and reverse-DNS, as Apple advises
    ([Apple notes][note-apple]). `m1ku` is the team's GitHub organization,
    `RevenueCat-M1KU`, without the sponsor's name, and `turn` is the app. It
    changes only if Apple refuses to register it at the first device build,
    before any build or Devpost names it.
1.  **The TRD names it.** [Build configuration][trd-build] gets the ID and
    the date it was chosen, since #22 builds `app/app.config.ts` from that
    section.
1.  **The relay's subdomain stays out of the docs.** The account's
    workers.dev subdomain is shaped like a student ID, so the notes, the
    plan, and the comments name the Worker `turn-relay` and leave the
    subdomain out. The team decides whether to rename it in the Cloudflare
    dashboard before #22 puts the relay's URL in the app's configuration,
    which makes it public.
1.  **Two follow-up tickets** carry the rest, each a `ready-for-human` Task
    under #13 in the Speaking milestone, with `priority:must`:
    - **Jev's credits and the two questions** (`area:relay`): #14's second,
      third, and sixth criteria, verbatim, with the
      [two messages](#appendix-the-two-messages). It blocks #32 and #66,
      which #14 blocked and which need what it records. #28 needs only the
      key and credits, which work now.
    - **The video iPhone** (`area:release`): #16's third and fourth
      criteria, verbatim, with the steps from the
      [Apple notes][note-apple]. It blocks #22, whose iPhone check needs the
      phone.
1.  **Closing.** Each ticket's body ticks what the session proved, and each
    unticked box names its follow-up. A comment on each gives the evidence;
    #22 and #24 get the bundle ID, where to read the relay's address, and
    the secrets' state; and the pull request closes both tickets.

[note-hands]: /docs/research/0036-turn-setup.md#hands-on-check
[note-apple]: /docs/research/0036-turn-setup.md#apple-xcode-27-and-ios-27

### Rejected alternatives

- **Keeping #14 and #16 open** until a person finishes: the goal closes
  them, #75 set the pattern of moving a person's criteria to a follow-up,
  and closing #16 unblocks #24 now.
- **A committed `/wizard` script** for the person's steps: each runs once,
  and the tickets carry the texts and commands.
- **Deploying a Durable Object** to prove the account allows one: SQLite
  Durable Objects are on the Free plan ([Cloudflare notes][note-cf]), the
  account's namespace list answers, and #24 and #35 deploy the relay's two
  classes anyway.
- **Other bundle IDs.** `io.github.revenuecat-m1ku.turn`, from the
  organization's GitHub Pages domain, puts the sponsor's name in the app's
  ID; `dev.workers.<subdomain>.turn`, from the relay's subdomain, ties the
  app's ID to a label that changes if the subdomain does.
- **The relay's address in the TRD:** the app's configuration takes it when
  #22 builds the app, after the team settles the subdomain.

### Out of scope

- `ID_SALT`, `secrets.required`, and the relay's code (#24).
- The real line with 40 candidates and its timing (#28).
- The credits alert (#32) and the secret scan before the repository goes
  public (#66).
- Sending the two messages and pairing the iPhone, which the follow-up
  tickets hold.

## Verification gate

Markdown files run the gate from [the plan-storage plan][docs-gate]:
Prettier, `check_md.py` with `--contents`, and `fact_scan.py` for new prose.

The setup checks run from `worker/` in this worktree, with `SUBDOMAIN` set
to the account's workers.dev subdomain from the Cloudflare dashboard:

```shell
bunx wrangler whoami
bunx wrangler secret list --name turn-relay
curl -s -o /dev/null -w '%{http_code}\n' \
  "https://turn-relay.${SUBDOMAIN:?}.workers.dev/v1/config"
```

`whoami` must report an OAuth login to the account named Turn. It also
prints the login's email and the account's ID, so a ticket gets a summary,
never its output. The secret list must name `TYPESAFE_API_KEY` and
`RC_SECRET_KEY`, and the relay must answer 404 until #24.

The key checks keep the key off every command line, and the scan stops at
the first failed step, so a failure can't pass for a clean result:

```shell
printf 'header = "Authorization: Bearer %s"\n' "${TYPESAFE_API_KEY:?}" |
  curl -s -K - -o /dev/null -w '%{http_code}\n' \
  https://api.typesafe.ai/v1/models
(
  set -eu -o pipefail
  : "${TYPESAFE_API_KEY:?}"
  git fetch -q origin
  git ls-remote origin 'refs/pull/*/head' | cut -f1 > "$TMPDIR/heads.txt"
  xargs git fetch -q origin < "$TMPDIR/heads.txt"
  git cat-file --batch-all-objects --batch > "$TMPDIR/objects.bin"
  git log --all --reflog -p --no-color > "$TMPDIR/log.txt"
  wc -c "$TMPDIR/objects.bin" "$TMPDIR/log.txt"
  for f in "$TMPDIR/objects.bin" "$TMPDIR/log.txt"; do
    grep -a -F -c -f <(printf '%s\n' "$TYPESAFE_API_KEY") "$f" || true
  done
  rm "$TMPDIR/heads.txt" "$TMPDIR/objects.bin" "$TMPDIR/log.txt"
)
```

The model list must answer 200. The scan must print two sizes well above
zero, then two counts of 0: `grep -c` counts matching lines, not objects,
and exits 1 when it counts none, hence `|| true`. A glob refspec needs a
destination, so the pull requests' heads are fetched by hash, which stores
their objects without adding refs to the checkouts the peers share.

[docs-gate]: /docs/plans/0009-plan-storage.md#verification-gate

## Tasks

Every subagent prompt carries the repo rule: run `graphify query "<question>"`
before grepping or reading repo files. No subagent sends the user's email
address or any personal identifier to an API, reads the key, writes a repo
file its prompt doesn't name, or runs git.

### Task 1: Research note

A background agent wrote `docs/research/0036-turn-setup.md` in about six
minutes, and the session added its hands-on check and fixed one synthesis:
the model list shows aliases, so it can't check the pin. It passed the docs
gate, with fact-scan misses only for Wrangler's line numbers and the object
count, and was committed as
`docs(research): add notes on the Jev key, Cloudflare, and the iPhone`.

### Task 2: This plan

- [ ] **Step 1: Run the docs gate, then commit** as
      `docs(plan): add the plan for the key, Cloudflare, and the iPhone`.

### Task 3: The relay's secret

- [ ] **Step 1: Add the key** to `turn-relay` with the command under
      [Decisions](#decisions).
- [ ] **Step 2: Check** that `wrangler secret list --name turn-relay` shows
      `TYPESAFE_API_KEY` and `RC_SECRET_KEY`, and that the relay still
      answers 404.

### Task 4: The Git check

- [ ] **Step 1: Fetch** every branch and every pull request's head.
- [ ] **Step 2: Count** the objects that hold the key, expecting 0.

### Task 5: The bundle ID in the TRD

- [ ] **Step 1: Edit** [build configuration][trd-build]:
      `ios.bundleIdentifier` is `com.m1ku.turn`, chosen on September 23.
- [ ] **Step 2: Run the docs gate,** then commit as
      `docs(trd): name the bundle ID`.

### Task 6: The follow-up tickets

- [ ] **Step 1: Create** the two tickets under [Decisions](#decisions) with
      `gh issue create --type Task`, add each as a sub-issue of #13, and add
      the blocking links: the first blocks #32 and #66, and the second
      blocks #22.
- [ ] **Step 2: Check** each ticket's labels, milestone, parent, and links
      with `gh api`.

### Task 7: The tickets' boxes and comments

- [ ] **Step 1: Tick** #14's first, fourth, and fifth boxes and #16's first
      and second, and point every unticked box to its follow-up.
- [ ] **Step 2: Comment** on #14 and #16 with the evidence, on #22 with the
      bundle ID, the relay's address, and the iPhone's follow-up, and on #24
      with the secrets `turn-relay` holds.

### Task 8: Graph, pull request, review, and merge

1.  Run `graphify update .` and commit `graphify-out/` as
    `chore(graphify): refresh the graph after the setup notes and plan`.
1.  Push the branch and open the pull request with the `/pr` template, with
    "Closes #14" and "Closes #16".
1.  Run one `/code-review` round against `main`, with issues #14 and #16 and
    this plan as the spec, plus a fact-check agent; post it as a PR comment,
    fix what it confirms in one commit per fix, and post a resolution
    comment.
1.  Rerun the Git check, rebase-merge the pull request, delete the branch on
    the remote and locally, remove the worktree, and check that both issues
    closed with their boxes as Task 7 left them.

## Appendix: the two messages

Drafts for the first follow-up ticket. A teammate sends each as the team,
from the account that holds TypeSafe's keys where it applies, and records
the date and the answer on the ticket.

### The naming request

To `sales@typesafe.ai`, where the [Jev notes][jev-mca] send questions on
section 16.4, and in TypeSafe's Discord if no answer comes within a day:

```text
Subject: Permission to name Jev and TypeSafe in our Shipaton 2026 entry

Hello TypeSafe team,

We're a student team entering RevenueCat's Shipaton 2026 for the Next Gen
Award with Turn, an iPhone app for people who use AAC (augmentative and
alternative communication). When a conversation partner speaks, Turn's
server asks Jev (jev-1.13.0) through your API which of the user's saved
phrases answer what was said.

Section 16.4 of your Master Customer Agreement says a customer needs your
prior consent to use TypeSafe's name, so we're asking:

1. May we name Jev and TypeSafe in the app (its permission step, consent
   card, and privacy notice), in our demo video, in our Devpost
   description, and in our README?
2. Our repository's design docs and research notes name Jev and TypeSafe
   and quote your public docs. May we make the repository public before
   the September 30, 2026 deadline?
3. Our relay depends on your SDK, @typesafe-ai/sdk, from npm. Is that fine
   in a public repository?

Until we hear from you, the entry calls Jev "a hosted decision model" and
TypeSafe "a third-party AI service in the United States".

Thank you,
<name>, for the Turn team
```

[jev-mca]: /docs/research/0005-jev.md#master-customer-agreement-terms-for-apps

### The organizers' question

In the official Shipaton Discord, or to `shipaton@revenuecat.com`:

```text
Hi! Our team saved copies of the Shipaton pages we researched (59 pages of
shipathon.com, the Devpost overview, and one YouTube page) as Markdown in
our repository's docs/sources folder, each with a link back to its page.
We plan to make the repository public for judging. May those copies stay in
the public repository, or should we remove them and keep only the links?
```

[note-cf]: /docs/research/0036-turn-setup.md#cloudflare-and-wrangler-41362
[trd-build]: /docs/TRD.md#build-configuration

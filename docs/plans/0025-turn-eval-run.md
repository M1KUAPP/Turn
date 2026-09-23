# Turn's evaluation run implementation plan

**Goal:** Close [issue #40][run-issue]: Jev's settings stay as `main` froze
them, the first run of all four rankers on the 80 labeled lines is committed
with its date, model pin, and commit, and the relay's configuration matches
the result, by rules this plan sets before any result exists.

**Architecture:** The settings are the ones `main` holds at `8ea25eb`: the
starting policy in `shared/src/row.ts`, the question wording in
`shared/src/jev.ts`, and the relay's `JEV_MODEL` and empty `POLICY` in
`worker/wrangler.jsonc`. A test pins their values. This plan, the test, and
the research note are pushed before the run. `bun run eval --unnamed` then
runs once, in a detached worktree at `8ea25eb`, and its report and plot are
committed as written. The rules below turn the report's big-button list and
Jev's verdict against embeddings into the relay's configuration and any
follow-up, and a read of the deployed relay checks that it serves the
evaluated settings.

**Tech Stack:** Bun, Vitest 4.1.11, and TypeScript 6.0.3 in `@turn/eval`;
TypeSafe's SDK 0.6.0 for Jev and Workers AI's REST API for embeddings;
Wrangler 4 for the relay's read-only check; the `gh` CLI.

**Spec:** Issue #40, under the spec in [issue #13][spec]; the PRD's
[evaluation requirements][prd-eval] and [release criteria][prd-release]; the
TRD's [metrics, intervals, and thresholds][trd-metrics] and
[report][trd-report]; and the idea's [risks][idea-risks]. The user's goal
directive, verbatim: "/ask-matt Complete and close #40. Follow
@docs/references/markdown-style.md (use List instead of TOC) and this
workflow: branch -> /research (10-minute max) -> plan -> implement -> create
small and atomic commits -> push branch -> PR -> code review -> resolve ->
merge -> delete branch."

Contents:

1.  [Global constraints](#global-constraints)
1.  [Skills](#skills)
1.  [Design](#design)
1.  [Verification gate](#verification-gate)
1.  [Tasks](#tasks)
1.  [Appendix: the run's script](#appendix-the-runs-script)
1.  [Appendix: the relay's check](#appendix-the-relays-check)

[run-issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/40
[spec]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/13
[prd-eval]: /docs/PRD.md#evaluation-requirements
[prd-release]: /docs/PRD.md#release-criteria
[trd-metrics]: /docs/TRD.md#metrics-intervals-and-thresholds
[trd-report]: /docs/TRD.md#the-report
[idea-risks]: /docs/IDEA.md#risks

## Global constraints

- **#40's acceptance criteria,** verbatim:
  - "The history shows the settings committed before the results (EVAL-2)"
  - "On the 80 labeled lines, the count script prints the quotas and the
    labelers' agreement (EVAL-1)"
  - "The report is committed with the date, the model pin, and the commit
    (EVAL-6)"
  - "No big button is wrong on a yes-or-no, pain, or consent line, or the
    relay's configuration now gives those lines only the fixed buttons
    (EVAL-5)"
  - "The relay's configuration matches the evaluation's result (RELEASE-2)"
  - "If Jev trails, the re-ranking run and its decision are recorded here
    (EVAL-4)"
- **#40's "What to build",** verbatim: "Jev's floor (0.6), big-button bar
  (0.85), margin (0.15), and question wording are committed before the
  first run, and Jev is reported on all 80 lines. After the run: a wrong big
  button on any yes-or-no, pain, or consent line means the relay's
  configuration gives those lines only the fixed buttons and the grid; Jev
  trailing embeddings means the script also scores Jev re-ranking the 40
  phrases nearest by Apple's sentence embeddings, and if that does better, a
  follow-up ticket switches the phone's shortlist to them; and any change to
  Jev's settings after the team sees results means the README reports Jev
  only on at least 20 new lines, written and labeled by a teammate who
  hasn't seen them. The relay's configuration then matches the result."
- **RELEASE-2,** verbatim: "The evaluation has run with the final
  thresholds and model pin, and the relay's configuration matches its
  result. Check: the README's table and the relay's values."
- **Nobody has seen a result.** No ranker but `place` and `keyword` has
  scored the 80 lines, and nobody has read a result of those two: #93's
  fact check ran `bun run eval` once on a scratch copy, before the
  embeddings and Jev rankers existed, and deleted the report unread, as its
  note on #40 says. In this change only Task 7 runs `bun run eval` on the 80
  lines, and every reviewer's prompt forbids the command by name.
- **The repository's rules:** Conventional Commits with no attribution
  lines; never stage `skills-lock.json`, `.agents/`, or `.claude/`; run
  `graphify query "<question>"` before reading repo files. Keys stay out of
  every command line, output, tracked file, log, and comment, and no
  account ID, email, or workers.dev subdomain goes into the repository, a
  commit, or a comment, as plan 0021 set.

## Skills

- `/research` wrote the [run's notes][run-notes]; `/code-review` reviews the
  branch on two axes, with #40 and this plan as the spec, beside a fact
  check; `/pr` shapes the pull request's body.

[run-notes]: /docs/research/0047-turn-eval-run.md

## Design

### Decisions

1.  **The frozen settings** are those at `8ea25eb`, `main`'s head when this
    plan was written. No file of the relay's or `shared/src` has changed
    since #86 merged as `a21be9b`, and Task 10 checks what the relay serves:

    ```shell
    git diff a21be9b 8ea25eb -- worker shared/src  # prints nothing
    ```

    - **The policy,** `startingPolicy` in `shared/src/row.ts`: a floor of
      0.6, a big button above 0.85, a margin of 0.15, phrases beside Yes,
      No, and Not sure, no big button on `body-pain` or `consent`, and no
      topic held to the fixed buttons. The relay serves it unchanged, since
      `POLICY` in `worker/wrangler.jsonc` is `{}`.
    - **The question wording,** in `shared/src/jev.ts`: the kind Choice's
      instructions and four criteria, the topic Choice's instructions and
      `consent`'s description, and each candidate's Noul question.
    - **The model pin,** `jev-1.13.0`, `JEV_MODEL` in
      `worker/wrangler.jsonc`.
    - **The draws:** the committed seed in `eval/src/stats.ts`, which the
      folds' shuffle and the 9,999 bootstrap resamples start from.

    The TRD's frozen settings say where they come from: 0.6 and 0.85 from
    TypeSafe's routing example, and 80 lines are too few to refit them.

2.  **A test pins them.** `eval/test/frozen.test.ts` gains a test that
    holds the policy's values and the request's wording as literals, so a
    later change fails a test named for EVAL-2. The pin already has tests,
    `eval/test/jev.test.ts` and `worker/test/jev-request.test.ts`, and
    `worker/test/config.test.ts` checks that the committed vars serve
    `startingPolicy`.
3.  **The run's commit.** The run happens in a detached worktree at
    `8ea25eb` with a clean tree, so the report names a commit that stays on
    `main`. GitHub's rebase merge "Always updates the committer information
    and creates new commit SHAs" ([merge methods][gh-merge]), so a run on
    this branch's head would name a commit `main` never holds. This plan,
    the test, and the note are pushed before the run, so GitHub's record of
    the push dates them before any result.
4.  **Naming stays off.** `TYPESAFE_NAMED` is `"false"`, and #79, which
    would have asked TypeSafe, closed as not planned with no answer
    recorded, so SUBMIT-6 keeps the names out of the README. The run uses
    `--unnamed`, and its report is the README's table. No second run makes
    a named copy, since Jev's answers vary between calls; the pin's name
    stays in `worker/wrangler.jsonc`.
5.  **One run.** `bun run eval --unnamed` runs once. It writes the report
    only at its end and prints nothing but the report's path, so a run that
    stops first leaves no result: its cause is fixed without touching a
    setting, Task 7's log records the attempt, and the command runs again
    at the same commit, as the [run's notes][notes-deviation] advise. Once
    `eval/results.md` exists, nothing runs again, whatever it says.
6.  **A preflight** on the fixture's 8 lines, none of them among the 80,
    checks both keys and both services with the same script, writing into
    the scratchpad.
7.  **EVAL-1's count** runs at the same commit: `bun run eval:count`, whose
    output goes into the pull request and onto #40.
8.  **EVAL-5's rule.** If the report's "Big buttons on yes-or-no, pain, and
    consent lines" lists any wrong big button, in any of the four answers
    Jev gave a line, the relay's `POLICY` becomes this:

    ```json
    { "yesNoPhrases": false, "fixedOnlyTopics": ["body-pain", "consent"] }
    ```

    That's the TRD's EVAL-5 path in the row's rules: a line Jev calls
    yes-or-no, or whose topic it calls pain or consent, gets only the fixed
    buttons, with the grid a tap away. The relay is deployed with it, and
    `GET /v1/config` must serve it. The rules read Jev's own kind and topic,
    so a line Jev calls something else keeps the starting rules; #40's
    closing comment says so beside each wrong big button. If none is wrong,
    `POLICY` stays `{}`. EVAL-5 set this remedy before the run, so it isn't
    a change after the team sees results in EVAL-2's sense, and the floor,
    the bar, the margin, and the wording don't change.

9.  **EVAL-4's rule.** Only the all-lines verdict counts. If it says Jev
    trails embeddings, Task 9 builds `jev-rerank` and runs the evaluation a
    second time with all five rankers; the first run's report stays as
    committed, and the second's is committed beside it.
    - **`jev-rerank`:** a Swift script on this Mac embeds each line and
      every phrase the app's shortlist can pick with
      `NLEmbedding.sentenceEmbedding(for: .english)`, logging its revision
      and dimension; each line's 40 phrases of least cosine distance, ties
      in the bank's order, go to Jev with the relay's request builder, the
      pin, and the row's rules, as `jev` does.
    - **"Does better"** means a higher top-6 accuracy than `jev` on all
      lines in the second run, with its paired interval given. Then a
      follow-up ticket switches the phone's shortlist to those embeddings,
      as the TRD's shortlist section plans, and #40 records both runs and
      the decision.
    - If the verdict is "leads" or "no clear difference", `jev-rerank`
      isn't built, and #40 records the verdict.
10. **Nothing else changes after the run.** A later change to anything of
    Jev's needs EVAL-2's 20 new lines, written and labeled by a teammate
    who hasn't seen them: a `ready-for-human` ticket, not this change.
11. **RELEASE-2's check,** after the run and any EVAL-5 change, as the
    [run's notes][notes-relay] describe. `GET /v1/config` on the team's
    relay must serve the evaluated policy with `jevOn` true. Wrangler's
    `deployments status --json` names the version serving all traffic, and
    `versions view <id> --json` gives its `plain_text` bindings, of which
    only `JEV_MODEL`, `JEV_ON`, and `POLICY` are printed. If one differs
    from `main`, the relay is deployed from `main` after the merge and
    checked again.
12. **The report as written.** `eval/results.md` and
    `eval/results-risk-coverage.svg` are committed byte for byte as the run
    wrote them, checked by SHA-256 after the commit.
13. **The record.** The TRD changes only if EVAL-5's rule changes `POLICY`,
    when its `wrangler.jsonc` listing follows. The README is #64's.

[gh-merge]: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github
[notes-deviation]: /docs/research/0047-turn-eval-run.md#reporting-a-deviation-or-an-unwelcome-result
[notes-relay]: /docs/research/0047-turn-eval-run.md#reading-the-relays-deployed-vars

### Rejected alternatives

- **Running on this branch's head:** the rebase merge would give the named
  commit a new hash, and the report would name a commit `main` lacks.
- **A merge commit, or a second pull request for the results:** either
  keeps the hash, but the repository merges by rebase, and running at
  `8ea25eb` needs neither.
- **A named run beside the unnamed one:** a second run calls Jev again and
  gives other numbers than the README's.
- **No big button anywhere,** a bar of 1, for EVAL-5: it changes a frozen
  setting, and EVAL-5 names only yes-or-no, pain, and consent lines.
- **Keeping every answer** to score the rows again under EVAL-5's policy:
  nothing asks for it, and the relay's rules act on Jev's answers as they
  come.

### Out of scope

- The README's table (#64), the calibration and extra rankers (#45), and
  the phone's shortlist switching, a follow-up only if EVAL-4's rule says
  so.

## Verification gate

Before each commit, run unpiped:

- `bun run typecheck`, `bun run test`, and `bun run lint`.
- `check_md.py` on each changed Markdown file, and a 120-column check on
  changed code.
- Before any commit that touches `eval/results.md` or its plot, the SHA-256
  of each against the run's own files.

## Tasks

Each task ends with its own commit unless it says otherwise.

### Task 1: Research note

`/research` wrote `docs/research/0047-turn-eval-run.md`: preregistration's
rules for a one-shot run and its deviations, reading the relay's deployed
vars without changing them, and Apple's sentence embedding.

### Task 2: This plan

This file, with the decisions above.

### Task 3: The settings' test

- **Test:** "keeps Jev's settings as the first run on the 80 lines used
  them (EVAL-2)", in `eval/test/frozen.test.ts`: `startingPolicy` equals
  the six values of decision 1, and `buildJevRequest` for one line with no
  categories and one candidate equals the whole request, wording included.
- **Check that it can fail:** a margin of 0.2, a changed kind's
  description, and a changed Noul question each fail it; then restore.
- **Done:** it passed at once, and each of six changes failed it: a margin
  of 0.2, `consent` dropped from `noBigTopics`, a kind's description
  reworded, the Noul question shortened, two kinds swapped in order, and a
  key added to the request's `state`.

### Task 4: Push before the run

Push the branch, and note the push's time from GitHub's activity for the
branch. No commit.

- **Done:** GitHub's activity for the branch records its creation at
  14:20:44 UTC on September 23, 2026, at `21391a4`, which holds the note,
  this plan, and the test.

### Task 5: The preflight

In the detached worktree at `8ea25eb`, run the appendix's script with
`--unnamed --lines eval/test/fixture/lines.jsonl` and `--out` in the
scratchpad. It must write a report in which Jev answered as `jev-1.13.0`.
No commit.

- **Attempt 1,** 14:25:39 to 14:26:20 UTC: it stopped at its first Workers
  AI request, before any Jev call, with Bun's `fetch` error "unknown
  certificate verification error", and wrote no report. Bun and curl
  reached the same host from the tool's shell a few minutes later, and
  nothing was changed.
- **Attempt 2,** 14:30:49 to 14:31:35 UTC: it wrote the report. Jev
  answered as version 1.13.0 on all 32 calls, and neither the report nor
  its plot holds "jev" or "TypeSafe".

### Task 6: EVAL-1's count

In the same worktree, `bun run eval:count`: every quota met, exit 0, and
the agreement printed. No commit; the output goes into the pull request.

- **Done** at 14:32 UTC, exit 0:

  ```text
  EVAL-1's quotas, on the 80 lines in eval/lines.jsonl:
  - 80 lines, of exactly 80: met
  - 16 with no acceptable reply, of at least 16: met
  - 37 yes-or-no, of at least 24: met
  - 30 about pain or health, of at least 8: met
  - 10 asking for consent, of at least 4: met
  - 49 sharing no word with a reply, of at least 10: met

  The labelers' agreement, claude-c and claude-g's labels against claude-d and claude-h's:
  - Some replies or none, on 80 lines: both some on 63, only the first on 1, only the second on 3, and both none on 13; agreement 0.950, Cohen's kappa 0.836, positive agreement 0.969, and negative agreement 0.867.
  - Each line and candidate phrase, on 12191 pairs: both on 335, only the first on 71, only the second on 26, and neither on 11759; positive agreement 0.874, and negative agreement 0.996 and Cohen's kappa 0.869, which move with the pairs' count.
  - Krippendorff's alpha with the MASI distance over each line's replies: 0.643.
  ```

### Task 7: The run

In the same worktree, with a clean tree at `8ea25eb`, the appendix's script
with `--unnamed`. Log each attempt here: its start, its end, and how it
ended.

- **Attempt 1,** 14:33:43 to 14:41:03 UTC, the only one: it exited 0 and
  wrote the report and its plot, whose SHA-256 are these:

  ```text
  c31f019cdd5286674274b62a040189666d16b99e4a875c018dd2e680b6bb7e84  eval/results.md
  6ff610a77328b7d96c3b58f3c62ac34a6a69ad2acd8f5a6f1e53f54ee7d1a446  eval/results-risk-coverage.svg
  ```

### Task 8: The report

Copy `eval/results.md` and `eval/results-risk-coverage.svg` from the run's
worktree, commit them, and check their SHA-256 against the run's files.

- **Done:** committed before anyone read them, and both hashes match in the
  working tree and in the commit.

### Task 9: The rules

Read the report and apply decisions 8 and 9, each change in its own
commit, and record here what each rule found.

- **EVAL-5:** the report lists one big button on a yes-or-no, pain, or
  consent line: "Yes, go ahead" on `line-05`, in 1 of Jev's 4 answers, and
  it's right. None is wrong, so `POLICY` stays `{}`, with no commit.
- **EVAL-4:** on all lines, Jev minus embeddings in top 6 is +29.7 points,
  with a paired interval of 17.2 to 42.2, so Jev leads embeddings, and
  `jev-rerank` isn't built.

### Task 10: RELEASE-2's check

Decision 11's reads, with the second appendix's script, which prints only
the three vars, the switches, and the policy.

- **Done** during the run, at 14:36 UTC, and after it, at 14:43 UTC, with
  the same answers. `GET /v1/config` served `jevOn` true, `typesafeNamed`
  false, and the starting policy. Version `30a35862`, created at 12:58:31
  UTC, served all traffic, with `JEV_MODEL` `jev-1.13.0`, `JEV_ON` `"true"`,
  and `POLICY` `{}`, as `main`'s `worker/wrangler.jsonc` has them. No deploy
  was needed.

### Task 11: Pull request and review

`/pr`, then `/code-review` against `origin/main` with a fact check; post
the review and its resolution on the pull request; rebase-merge; delete
the branch; remove both worktrees.

### Task 12: Close #40

Tick what the evidence proves, comment with the evidence, close #40, and
leave notes on #45 and #64.

## Appendix: the run's script

`run.zsh`, run as `zsh -ic 'zsh run.zsh <worktree> <arguments>'` so the
keys come from `~/.zshrc` into the environment, never onto a command line:

```zsh
#!/bin/zsh
# Runs `bun run eval` in the given worktree at 8ea25eb, from a clean tree,
# with the keys in the environment only.
setopt err_exit pipe_fail no_unset
cd "${1:?}"; shift
[[ $(git rev-parse --short HEAD) == 8ea25eb ]] || { print -u2 'Not at 8ea25eb'; exit 1 }
git diff --quiet HEAD || { print -u2 'The tree has changes'; exit 1 }
export CLOUDFLARE_ACCOUNT_ID="${TURN_CF_ACCOUNT_ID:?}"
export CLOUDFLARE_API_TOKEN="$(cd worker && bunx wrangler auth token --json | jq -r .token)"
: "${TYPESAFE_API_KEY:?}" "${CLOUDFLARE_API_TOKEN:?}"
bun run eval "$@"
```

## Appendix: the relay's check

`relay-check.zsh`, run as
`zsh -ic 'zsh relay-check.zsh <worktree> <relay address>'` for decision 11.
The address stays out of the repository, and the script prints no account
ID, email, author, or secret:

```zsh
#!/bin/zsh
# RELEASE-2's read-only check: what the team's relay serves, and the vars of the version serving its traffic.
# Usage: zsh -ic 'zsh relay-check.zsh <worktree> <relay address>'. Prints only the checked values: no account ID,
# email, author, or secret.
setopt err_exit pipe_fail no_unset
cd "${1:?}/worker"
relay="${2:?}"
export CLOUDFLARE_ACCOUNT_ID="${TURN_CF_ACCOUNT_ID:?}"
user="$(uuidgen | tr 'A-Z' 'a-z')"
print '# GET /v1/config, as a new user of the device build'
curl -sS --fail-with-body -A 'turn-release-check' \
  -H "X-Turn-User: $user" -H 'X-Turn-Version: 1.0.0' -H 'X-Turn-Build: device' \
  "$relay/v1/config" | jq -c '{jevOn, typesafeNamed, policy}'
print '# The deployment serving traffic: each version and its share'
deployment="$(bunx wrangler deployments status --json 2>/dev/null)"
print -r -- "$deployment" | jq -c '[.versions[] | {version_id, percentage}]'
version="$(print -r -- "$deployment" | jq -r '.versions | max_by(.percentage) | .version_id')"
print '# That version: its created time, and its JEV_MODEL, JEV_ON, and POLICY'
view="$(bunx wrangler versions view "$version" --json 2>/dev/null)"
print -r -- "$view" | jq -c '{created: .metadata.created_on}'
print -r -- "$view" | jq -c '[.resources.bindings[] | select(.name == "JEV_MODEL" or .name == "JEV_ON" or .name == "POLICY")
  | {name, type, value: (.text // .json)}]'
```

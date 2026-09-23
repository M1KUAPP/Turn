# Plan storage implementation plan

**Goal:** Move the eight finished plans out of `docs/superpowers/plans/`, a
folder named for the obra/superpowers skills that commit d53f939 replaced
with mattpocock/skills on September 22, 2026, into `docs/plans/`; keep every
link to them working; and say where the next plan goes.

**Architecture:** One background research note, on
[plan and spec storage][note], weighs where mattpocock/skills,
obra/superpowers, GitHub, and long-lived design records keep plans and
specs. The plans move with `git mv`, and a script repoints every link and
`git add` path into the old folder in the same commit, so Git pairs each old
path with its new one and no commit has a broken link. Two small commits
then replace the plans' notes that name superpowers' skills and tell agents
where plans live.

**Tech Stack:** Markdown (GFM), Prettier 3 run by husky and lint-staged,
commitlint with Conventional Commits, `git mv`, Python 3 for the local
checks, graphify, the `gh` CLI, and subagents for research and review.

**Spec:** No separate spec file. The user's goal directive and the
[design](#design) below are the spec. The directive, verbatim: "/ask-matt
Migrate @docs/superpowers/ to something else, see
d53f939764744ea5b5f9d5e88677bfbaf5fbd2d5. Follow
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

## Global constraints

- Follow [the Markdown style guide](/docs/references/markdown-style.md), with a
  `Contents:` list in lazy numbering (`1.  [Heading](#anchor)`) instead of a
  `[TOC]` directive, as the other documents do.
- One H1; ATX headings with unique names; prose wrapped at 80 characters
  (links, tables, headings, and code blocks are exempt); `- ` bullets; a
  language on every fenced code block.
- Repo links use root paths such as `/docs/PRD.md`. Long or repeated links
  become reference links, defined before the next heading after first use, or
  at the end of the document when several sections use them.
- Each plan keeps its file name and its words. The only edits are link
  targets and `git add` paths that name the old folder, and the note that
  opens the five plans written for superpowers. Text that describes the old
  folder, as in this plan and the research note, stays.
- The move and the link changes land in one commit, so no commit has a
  broken link.
- Absolute dates only. Use they/them for any person whose pronouns aren't
  stated.
- Conventional Commits: lowercase subject, header of at most 100 characters,
  body lines of at most 100 characters, no attribution lines.
- Stage explicit paths only. Never stage `skills-lock.json`, `.agents/`, or
  `.claude/`; they hold unrelated local changes.

## Skills

The goal names `/ask-matt`, whose map sends new work through
`/grill-with-docs`, an interview. The directive rules out pausing for
answers, so the [decisions](#decisions) below stand in for the interview.
The other steps map to skills:

- **`/research`:** one background agent, capped at 10 minutes, read primary
  sources and wrote [the research note][note].
- **`/pr`:** the pull request body.
- **`/code-review`:** one round, on its Standards and Spec axes, with this
  plan as the spec.

`/to-spec` and `/to-tickets` would publish this work to GitHub issues, but
only the user can invoke them, and a move this size needs neither a spec
issue nor tickets.

## Design

The directive leaves the destination open ("something else"), so the
research note weighs the options, and this plan picks one.

### Decisions

1.  **The plans move to `docs/plans/`, keeping their file names.**
    - No mattpocock skill writes a plan file. They publish specs and tickets
      to the tracker, while `/handoff` refers to plans by path and
      `/code-review` looks for a spec file under `docs/`
      ([what each skill writes][note-mp];
      [how `/code-review` finds a spec][note-cr]).
    - The plans are finished records still in use: `docs/DESIGN.md` and the
      archived Guessling design link the check scripts in two plans'
      appendices, a research note links one plan's verification gate, and
      later plans build on earlier plans' scripts. In the repo, those links
      stay relative, graphify indexes the plans, and `git log --follow` keeps
      their history, the way ADRs, RFCs, KEPs, and PEPs keep finished
      records ([design records in a repo][note-conv]).
    - `docs/plans/` names what the files are, since each title ends
      "implementation plan", and the directive's "plan" step, without a
      tool's name. It's also where superpowers kept plans until v5.0.0 moved
      them to `docs/superpowers/` ([superpowers' paths][note-sp]).
1.  **Every link and `git add` path into the old folder changes in the
    move's commit.** That's four references in three documents
    (`docs/DESIGN.md`, `docs/archive/guessling-design.md`, and
    `docs/research/frontend-trends.md`), and inside the plans, 10 links and
    5 `git add` commands. A script rewrites only link targets and `git add`
    paths, so the directive's words and this plan's account of the old
    folder stay as written.
1.  **The five plans written before d53f939 lose their superpowers note.**
    The brief's, the context's, the first idea's, and the two Guessling
    plans open by requiring superpowers' `subagent-driven-development` or
    `executing-plans` skill, which the repo no longer has. The note becomes
    a dated line that says what the plan was written for and that its tasks
    are done. The three later plans have no such note.
1.  **`docs/agents/issue-tracker.md` says where plans live.** It says
    "Issues and specs for this repo live as GitHub issues", and every agent
    loads it through `AGENTS.md`. A short paragraph adds that a change's plan
    file is committed on its branch as `docs/plans/YYYY-MM-DD-<topic>.md` and
    passed to `/code-review` by path, since `/code-review` finds a spec file
    on its own only when the name matches the branch, while specs from
    `/to-spec`, tickets, and wayfinder maps stay in GitHub issues.

[note-mp]: /docs/research/plan-storage.md#where-mattpocockskills-puts-documents
[note-cr]: /docs/research/plan-storage.md#how-code-review-finds-a-spec
[note-conv]: /docs/research/plan-storage.md#conventions-for-design-records-in-a-repo

### Rejected alternatives

- **GitHub issues**, where `/to-spec`, `/to-tickets`, and `/wayfinder`
  publish: the links to the plans would leave the repo, graphify and
  `git log` would lose them, their unticked steps would show as open tasks
  on closed issues, and the limit on an issue's length is unverified.
- **`docs/specs/`:** `/to-spec` bans file paths and code in a spec, and
  these plans are task lists with Python scripts, so the name would promise
  a different document. Each plan's own "Spec:" line says its spec is the
  user's directive and its design section, not the whole plan.
- **`docs/archive/`:** the folder holds the Guessling documents that Turn's
  replaced. The Turn plans aren't superseded, and later plans run the
  scripts in earlier plans' appendices.
- **`.scratch/`:** the local tracker's folder, which
  `setup-matt-pocock-skills` reads as a sign of a local tracker; this repo's
  tracker is GitHub.
- **Leaving the folder:** no link would break, but the path would keep
  naming a skill set the repo removed.

### Out of scope

- The `.superpowers/` line in `.gitignore`, which only superpowers' tools
  needed ([superpowers' paths][note-sp]). It's outside `docs/superpowers/`,
  so the pull request mentions it rather than removing it.
- Moving the check scripts out of the plans' appendices into files of their
  own.
- The merged pull requests' bodies, which name the old paths as they were.

## Verification gate

Every task runs this gate on each Markdown file it changes, after editing and
before committing. `CHECKS` is a directory holding `check_md.py`,
`fact_scan.py`, and `check_links.py` from the
[first idea plan's appendix][idea-appendix], with `check_md.py` changed as in
the [Guessling product plan's appendix][check-md-change].

```shell
bunx prettier --write "$DOC" && bunx prettier --check "$DOC"
python3 "$CHECKS/check_md.py" . "$DOC" --contents
```

- `check_md.py` must print `OK`.
- New prose also runs `fact_scan.py . "$DOC" docs/sources docs/research`,
  and the commit body names the misses that are facts from outside the
  corpus. A new research note also runs `check_links.py`.

After Tasks 3 and 4, each of these prints nothing:

```shell
ls -d docs/superpowers 2>/dev/null
git grep -nE '(\(|\]: )/docs/superpower[s]/' -- '*.md'
git grep -n 'git add docs/superpower[s]/' -- '*.md'
git grep -n 'superpower[s]:' -- docs
```

[idea-appendix]: /docs/plans/2026-09-22-shipaton-2026-idea.md#appendix-check-scripts
[check-md-change]: /docs/plans/2026-09-22-guessling-product-prd-trd.md#appendix-check-scripts

## Tasks

Every subagent prompt carries the repo rule: run `graphify query "<question>"`
before grepping or reading repo files. No subagent sends the user's email
address or any personal identifier to an API, and none writes a repo file its
prompt doesn't name or runs git.

### Task 1: Research note

A background agent wrote `docs/research/plan-storage.md` in about four
minutes. It passed the gate, with fact-scan misses only for the plans' sizes,
superpowers' release dates, and GitHub's unverified limit, and was committed
as `docs(research): add notes on where plans and specs live`.

### Task 2: This plan

- [ ] **Step 1: Run the gate, then commit**

```shell
git add docs/plans/2026-09-23-plan-storage.md
git commit -m "docs(plan): add the plan for moving plans out of docs/superpowers"
```

### Task 3: Move the plans

- [ ] **Step 1: Move the files**

```shell
git mv docs/superpowers/plans/*.md docs/plans/
```

- [ ] **Step 2: Repoint the links**

Save this as `repoint_plans.py` in the scratchpad and run it on every
Markdown file that names the old folder:

```python
#!/usr/bin/env python3
"""Usage: repoint_plans.py <file.md> ...

Repoints link targets and `git add` paths from the old plans folder to
docs/plans/, and prints each changed file with its count. Other text that
names the old folder stays.
"""
import re
import sys

OLD = re.escape('docs/superpowers/plans/')
TARGET = re.compile(r'(?<=\(/)' + OLD + r'|(?<=\]: /)' + OLD + r'|(?<=git add )' + OLD)

for name in sys.argv[1:]:
    with open(name, encoding='utf-8') as f:
        text = f.read()
    text, count = TARGET.subn('docs/plans/', text)
    if count:
        with open(name, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f'{name}: {count}')
```

```shell
python3 repoint_plans.py $(git grep -l 'docs/superpowers/plans/' -- '*.md')
```

Expected: 21 changes in 11 files, the 16 links and 5 `git add` paths that
[decision 2](#decisions) and this plan's two links account for.

- [ ] **Step 3: Run the gate on every changed file, then commit**

`git diff --cached -M --name-status` must show eight renames.

```shell
git add docs/plans docs/DESIGN.md docs/archive/guessling-design.md docs/research/frontend-trends.md
git commit -m "docs(plans): move the plans from docs/superpowers to docs/plans"
```

### Task 4: The superpowers notes

- [ ] **Step 1: Replace the note in the five older plans**

In the brief's, the context's, the first idea's, and the two Guessling
plans, the four-line note under the title becomes:

```markdown
> Written for obra/superpowers' `subagent-driven-development` and
> `executing-plans` skills, which the repo replaced with mattpocock/skills
> on September 22, 2026. The tasks below are done.
```

- [ ] **Step 2: Run the gate, then commit**

```shell
git add docs/plans
git commit -m "docs(plans): date the notes that name superpowers' skills"
```

### Task 5: Where plans live

- [ ] **Step 1: Add the paragraph to `docs/agents/issue-tracker.md`**

After "Use the `gh` CLI for all operations.":

```markdown
Plan files are the exception: when a change has one, it's committed on the
change's branch as `docs/plans/YYYY-MM-DD-<topic>.md`, and its path is passed
to `/code-review` as the spec. Specs from `/to-spec`, tickets, and wayfinder
maps stay in GitHub issues.
```

- [ ] **Step 2: Run the gate, then commit**

```shell
git add docs/agents/issue-tracker.md
git commit -m "docs(agents): say where plans live"
```

### Task 6: Graph, pull request, review, and merge

1.  Run `graphify update .` and commit `graphify-out/` as
    `chore(graphify): refresh the graph after moving the plans`.
1.  Push the branch and open the pull request with the `/pr` template.
1.  Run one `/code-review` round against this plan, post it as a PR comment,
    fix what it confirms in one commit per fix or group of related fixes,
    and post a resolution comment.
1.  Rebase-merge the pull request and delete the branch, locally and on the
    remote.

[note]: /docs/research/plan-storage.md
[note-sp]: /docs/research/plan-storage.md#where-obrasuperpowers-put-plans-and-specs

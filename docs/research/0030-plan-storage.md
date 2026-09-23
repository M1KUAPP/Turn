# Plan and spec storage research notes

Where plans and specs should live now that the repo has moved from
obra/superpowers to mattpocock/skills, read for the eight plans still in
`docs/superpowers/plans/`. Every source was read on September 23, 2026, at
the commit or tag its link names, and judgment starts with "Synthesis:".

Contents:

1.  [Where mattpocock/skills puts documents](#where-mattpocockskills-puts-documents)
1.  [Where obra/superpowers put plans and specs](#where-obrasuperpowers-put-plans-and-specs)
1.  [GitHub issue size limits](#github-issue-size-limits)
1.  [How /code-review finds a spec](#how-code-review-finds-a-spec)
1.  [Conventions for design records in a repo](#conventions-for-design-records-in-a-repo)
1.  [What this means for the repo's plans](#what-this-means-for-the-repos-plans)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## Where mattpocock/skills puts documents

Read at commit `c55ee46` (September 18, 2026), the head of `main`. The
repo's copies in `.agents/skills/` are byte-identical to upstream for every
skill below and for the four `setup-matt-pocock-skills` templates, so there
is no local difference to note.

- **`to-spec`** writes a spec from the conversation, then "publish it to the
  project issue tracker" with the `ready-for-agent` label. Its template says
  "Do NOT include specific file paths or code snippets" ([to-spec][mp-to-spec]).
- **`to-tickets`** breaks "a plan, spec, or conversation" into tickets. On a
  real tracker it publishes one issue per ticket; on local files it writes
  `.scratch/<feature-slug>/issues/<NN>-<slug>.md` ([to-tickets][mp-to-tickets]).
- **`implement`** builds from "a spec or set of tickets" and commits to the
  current branch; it saves no document ([implement][mp-implement]).
- **`implement-spec`** (in `skills/in-progress/`) opens a branch and a draft
  PR that closes the spec issue and tickets. Exploration notes go "in a
  directory outside the repo" ([implement-spec][mp-implement-spec]).
- **`handoff`** saves "to the temporary directory of the user's OS - not the
  current workspace", and references "specs, plans, ADRs, issues" by path or
  URL instead of copying them ([handoff][mp-handoff]).
- **`research`** saves "where the repo already keeps such notes; match the
  existing convention" ([research][mp-research]).
- **`domain-modeling`** writes `CONTEXT.md` and `docs/adr/`, lazily, and says
  `CONTEXT.md` is not "a spec, a scratch pad, or a repository for
  implementation decisions" ([domain-modeling][mp-domain-modeling]).
- **`wayfinder`** keeps its map as "a single issue on this repo's issue
  tracker, labelled `wayfinder:map`", with child issues as tickets
  ([wayfinder][mp-wayfinder]).
- **`prototype`** commits the prototype "to a throwaway branch, out of main"
  and leaves a pointer on the implementation issue. It names no branch
  pattern: `prototype/<name>` appears only as a UI route in `UI.md`
  ([prototype][mp-prototype]).
- **`setup-matt-pocock-skills`** writes `docs/agents/issue-tracker.md`,
  `docs/agents/domain.md`, and `docs/agents/triage-labels.md`, and treats an
  existing `.scratch/` as "a sign that a local-markdown issue tracker
  convention is already in use" ([setup][mp-setup]). The local template puts
  each spec at `.scratch/<feature-slug>/spec.md` ([local tracker][mp-local]);
  the GitHub template says "Issues and specs for this repo live as GitHub
  issues" ([GitHub tracker][mp-github]); `domain.md` covers only `CONTEXT.md`
  and `docs/adr/` ([domain template][mp-domain]).

Neither the README nor any file above mentions `docs/plans`, `docs/specs`,
or superpowers, and none describes migrating from another skill set
([README][mp-readme]). The changelog's 1.1.0 entry renamed `to-prd` to
`to-spec`, making "spec" "the single through-line term", and merged
`to-plan` and `to-issues` into `to-tickets` ([CHANGELOG][mp-changelog]).

Synthesis: no mattpocock skill writes a plan file into the repo. New specs
and tickets go to the tracker, which `docs/agents/issue-tracker.md` sets to
GitHub issues in `RevenueCat-M1KU/RevenueCat`.

[mp-to-spec]: https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/engineering/to-spec/SKILL.md
[mp-to-tickets]: https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/engineering/to-tickets/SKILL.md
[mp-implement]: https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/engineering/implement/SKILL.md
[mp-implement-spec]: https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/in-progress/implement-spec/SKILL.md
[mp-handoff]: https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/productivity/handoff/SKILL.md
[mp-research]: https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/engineering/research/SKILL.md
[mp-domain-modeling]: https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/engineering/domain-modeling/SKILL.md
[mp-wayfinder]: https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/engineering/wayfinder/SKILL.md
[mp-prototype]: https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/engineering/prototype/SKILL.md
[mp-setup]: https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/engineering/setup-matt-pocock-skills/SKILL.md
[mp-local]: https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md
[mp-github]: https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/engineering/setup-matt-pocock-skills/issue-tracker-github.md
[mp-domain]: https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/engineering/setup-matt-pocock-skills/domain.md
[mp-readme]: https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/README.md
[mp-changelog]: https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/CHANGELOG.md

## Where obra/superpowers put plans and specs

Read at tag `v6.4.1` (September 18, 2026).

- **`writing-plans`**: "Save plans to:
  `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`", then "(User
  preferences for plan location override this default)"
  ([writing-plans][sp-plans]).
- **`brainstorming`**: writes the spec to
  `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`, with "(User
  preferences for spec location override this default)", and commits it
  ([brainstorming][sp-brainstorming]).
- **The path moved in v5.0.0 (March 9, 2026)**, listed under "Breaking
  Changes": specs and plans moved to `docs/superpowers/`, "User preferences
  for spec/plan locations override these defaults", and "Migration: move
  existing files from `docs/plans/` to new locations if desired". Before
  that, v3.2.0 (October 18, 2025) stored both kinds in `docs/plans/`, with a
  `-design.md` suffix for specs ([release notes][sp-notes]). Upstream itself
  still keeps four older plans in `docs/plans/`, such as
  `2026-01-17-visual-brainstorming.md`, beside `docs/superpowers/plans/` at
  v6.4.1.
- **`.superpowers/` is scratch space, not plans.** The brainstorming visual
  companion keeps mockups in `.superpowers/brainstorm/` and tells the agent
  to "Remind the user to add `.superpowers/` to `.gitignore`"
  ([visual companion][sp-visual]). Plan execution keeps its ledger, briefs,
  and reviews in `.superpowers/sdd/<plan-basename>/`
  ([executing-plans][sp-exec]); v6.0.3 moved that out of `.git/`, and v6.2.0
  made it one directory per plan ([release notes][sp-notes]).

Synthesis: the `.superpowers/` line in `.gitignore` guards output that only
superpowers made; none of the mattpocock files read here mention it.

[sp-plans]: https://github.com/obra/superpowers/blob/v6.4.1/skills/writing-plans/SKILL.md
[sp-brainstorming]: https://github.com/obra/superpowers/blob/v6.4.1/skills/brainstorming/SKILL.md
[sp-notes]: https://github.com/obra/superpowers/blob/v6.4.1/RELEASE-NOTES.md
[sp-visual]: https://github.com/obra/superpowers/blob/v6.4.1/skills/brainstorming/visual-companion.md
[sp-exec]: https://github.com/obra/superpowers/blob/v6.4.1/skills/executing-plans/SKILL.md

## GitHub issue size limits

Not verified. A code search of `github/docs` and
`github/rest-api-description` for "65536" and "65,536" found no page that
states a maximum length for an issue body or an issue comment. The 65,536
figure is the one GitHub's API is widely reported to enforce, but this note
has no GitHub page to cite for it.

Sizes of the eight plans, from `wc -c` and `wc -m`:

| Plan                                      | Bytes   | Characters |
| ----------------------------------------- | ------- | ---------- |
| `2026-09-21-shipaton-2026-brief.md`       | 25,867  | 25,849     |
| `2026-09-21-shipaton-2026-context.md`     | 31,517  | 31,505     |
| `2026-09-22-guessling-design.md`          | 37,693  | 37,675     |
| `2026-09-22-guessling-product-prd-trd.md` | 40,297  | 40,296     |
| `2026-09-22-next-gen-idea.md`             | 26,105  | 26,103     |
| `2026-09-22-shipaton-2026-idea.md`        | 44,169  | 44,163     |
| `2026-09-22-turn-product-prd-trd.md`      | 38,190  | 38,190     |
| `2026-09-23-turn-design.md`               | 37,022  | 37,020     |
| Total                                     | 280,860 | 280,801    |

Synthesis: if the limit is 65,536 characters, each plan fits in one issue
body, since the largest is 44,169 even in bytes, and the eight together
would need eight issues, not one.

## How /code-review finds a spec

The repo's copy matches upstream. Step 2, "Identify the spec source", reads
([code-review](/.agents/skills/code-review/SKILL.md)):

```markdown
Look for the originating spec, in this order:

1. Issue references in the commit messages (`#123`, `Closes #45`, GitLab `!67`, etc.), fetched via the workflow in `docs/agents/issue-tracker.md`.
2. A path the user passed as an argument.
3. A spec file under `docs/`, `specs/`, or `.scratch/` matching the branch name or feature.
4. If nothing is found, ask the user where the spec is. If they say there isn't one, the **Spec** sub-agent will skip and report "no spec available".
```

Synthesis: any folder under `docs/` qualifies for step 3, so the choice of
subfolder does not change what `/code-review` can find; the file name has to
match the branch name or feature.

## Conventions for design records in a repo

- **ADRs.** Michael Nygard's 2011 post: "We will keep ADRs in the project
  repository under doc/arch/adr-NNN.md", "numbered sequentially and
  monotonically", and a reversed decision is kept and marked "superseded"
  ([Nygard][nygard]). adr-tools defaults to `doc/adr` and creates numbered
  files ([adr-tools][adr-tools]). adr.github.io credits Nygard's post and
  says ADR usage "can be extended to design and other decisions ('any
  decision record')" ([adr.github.io](https://adr.github.io/)).
- **Rust RFCs.** An RFC is "merged into the RFC repository as a markdown
  file" at `text/0000-my-feature.md`, renamed to its PR number once accepted.
  "once accepted, RFCs should not be substantially changed"; bigger changes
  are new RFCs ([rust-lang/rfcs][rust-rfcs]).
- **Kubernetes KEPs.** Each KEP is a directory under `keps/`, grouped by SIG
  and numbered, such as `keps/sig-architecture/0000-kep-process/README.md`,
  copied from `NNNN-kep-template/` ([KEP README][keps]).
- **Python PEPs.** Text files in a versioned repository whose "revision
  history is the historical record". Once resolved, "a PEP is considered a
  historical document rather than a living specification", and living
  documentation "should be maintained elsewhere" ([PEP 1][pep-1]).

Synthesis: all four keep finished records in the repo, named by number or
topic and not by the tool that wrote them, and treat them as frozen history.

[nygard]: https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
[adr-tools]: https://github.com/npryce/adr-tools/blob/b3279baf9be2207d1a4f4bbd608fd0b591c72aee/README.md
[rust-rfcs]: https://github.com/rust-lang/rfcs/blob/51783df9a76c355de7ceebeae101cba47f8ca463/README.md
[keps]: https://github.com/kubernetes/enhancements/blob/30893f027449862fb3ac6f274bc4035ddc19e9bf/keps/README.md
[pep-1]: https://github.com/python/peps/blob/7d5ca36e57dba93be8c7f6ac2af69ae3936dd27c/peps/pep-0001.rst

## What this means for the repo's plans

Facts that bear on every option: no mattpocock skill will write another plan
file (see
[where mattpocock/skills puts documents](#where-mattpocockskills-puts-documents)),
and `docs/superpowers/plans/` is linked from `docs/DESIGN.md`,
`docs/research/0014-frontend-trends.md`, and `docs/archive/guessling-design.md`,
and named 15 times inside the plans themselves: 10 links and 5 `git add`
commands.

- **Leave `docs/superpowers/plans/` in place.** For: no links break, and
  superpowers upstream left its own old `docs/plans/` files unmoved. Against:
  the folder names a skill set the repo removed on September 22, 2026.
- **Move to `docs/plans/`.** For: it was superpowers' own default before
  v5.0.0, it is neutral, and `/code-review` still searches it. Against: every
  link above must change, and no current skill writes there.
- **Move to `docs/specs/`.** For: "spec" is mattpocock's term. Against: these
  are task lists with Python scripts, while `to-spec` bans file paths and code
  snippets in a spec, so the name would promise a different document.
- **Move to `docs/archive/`.** For: the folder exists and PEP 1 and Rust
  RFCs treat finished records as history. Against: later plans link to the
  check scripts as live references, which "archive" does not suggest.
- **GitHub issues.** For: `to-spec`, `to-tickets`, and `wayfinder` publish
  there, and `/code-review` checks issue references first. Against: the size
  limit is unverified, issues sit outside git history, `grep`, and graphify,
  and the in-repo links to the scripts would need new targets.
- **`.scratch/`.** For: `/code-review` searches it. Against: it is the local
  tracker's folder with a `spec.md` plus `issues/` shape, the repo's tracker
  is GitHub, and `setup-matt-pocock-skills` reads `.scratch/` as a sign of a
  local tracker.

## Gaps

- No GitHub page was found that states the issue body or comment limit.
- The KEP README shows the folder layout only by example; `kep.yaml` and the
  template's contents were not read.

## See also

- [Issue tracker setup](/docs/agents/issue-tracker.md)
- [Domain docs layout](/docs/agents/domain.md)

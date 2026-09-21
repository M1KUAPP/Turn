# Shipaton 2026 context implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `docs/CONTEXT.md`, the background a team needs to build a
winning RevenueCat Shipaton 2026 entry: past winners in depth, primary-source
best practices, and related materials.

**Architecture:** One new Markdown file distilled from three new research
notes, each written from primary web sources with a citation for every claim:
[past winners](/docs/research/past-winners.md),
[best practices](/docs/research/best-practices.md), and
[related materials](/docs/research/related-materials.md). It complements
[the brief](/docs/BRIEF.md): the brief says what the contest requires, and
the context says what has worked and where the official docs live, linking to
the brief instead of repeating it. Each task adds whole sections together
with their `Contents:` entries, so every commit leaves a consistent document.

**Tech Stack:** Markdown (GFM), Prettier 3 run by husky and lint-staged,
commitlint with Conventional Commits, the `gh` CLI, and Python 3 with curl for
the local checks in the [appendix](#appendix-check-scripts).

**Spec:** No separate spec file. The user's goal directive and the
[design](#design) below are the spec; facts come from the research notes.

Contents:

1.  [Global constraints](#global-constraints)
1.  [Design](#design)
1.  [Verification gate](#verification-gate)
1.  [Tasks](#tasks)
1.  [Appendix: check scripts](#appendix-check-scripts)

## Global constraints

- Follow [the Markdown style guide](/docs/references/markdown-style.md), with a
  `Contents:` list in lazy numbering (`1.  [Heading](#anchor)`) instead of a
  `[TOC]` directive, as in the brief.
- One H1; ATX headings with unique names and blank lines around them; prose
  wrapped at 80 characters (links, tables, headings, and code blocks are
  exempt); no trailing whitespace; `- ` bullets; a language on every fenced
  code block.
- Repo links use root paths such as `/docs/BRIEF.md`. Long or repeated links
  become reference links, defined before the next heading after first use, or
  at the end of the document when used in several sections.
- Facts come only from the research notes in `docs/research/` and from the
  brief. Copy figures verbatim. Label facts from the 2024 Ship-a-ton, Shipaton
  2025, or Shipyard 2026 with their edition. Date anything that changes (store
  ratings, prices, policy versions, SDK versions) as of September 21, 2026.
  Mark conclusions drawn across sources as synthesis. Use absolute dates,
  never "N days left".
- Don't repeat the brief. Rules, dates, eligibility, the submission checklist,
  the judging stages, prizes, perks, and RevenueCat's own Shipaton tips live
  there; link to its sections instead.
- Where sources conflict, say which one governs and list the conflict under
  Open questions. For contest rules the order is the official rules, Devpost,
  2026 site pages, 2026 blog posts, then past editions; for store policy, the
  store's own documentation governs.
- Conventional Commits: lowercase subject, header of at most 100 characters,
  no attribution lines.
- Stage explicit paths only. Never stage `skills-lock.json`, `.agents/`, or
  `.claude/`; they hold unrelated local changes.

## Design

`docs/CONTEXT.md` serves a team that has read the brief and now has to decide
what to build, how to monetize it, how to get it approved, and how to pitch
it. It answers what has won before and why, what primary sources say works,
and where the official material lives. Sections:

1.  **Key takeaways**: the points that most change what a team does, each
    linking to its section. Written last.
1.  **What the official rules add**: what the rules, read on Devpost during
    the research, settle or change relative to the brief.
1.  **Past winners**: per edition, the winners that matter for 2026
    categories: what they built, how they made money, the evidence they
    showed, and where they are now.
1.  **What wins each category**: for each 2026 category with a precedent,
    what past winners did beside what 2026 judges ask for; sponsor guidance
    for the new categories.
1.  **Monetization and paywalls**: RevenueCat's benchmark figures and paywall
    guidance, and the product setup that lets judges test premium features.
1.  **Getting through store review**: the Apple, Google Play, and Galaxy
    Store rules that most often block a new subscription app, beyond the
    timing already in the brief.
1.  **Store listing and discoverability**: Apple and Google listing fields,
    limits, and guidance.
1.  **Retention and push notifications**: platform rules and OneSignal
    guidance.
1.  **Demo video and write-up**: Devpost's guidance lined up with the
    Shipaton judging funnel.
1.  **Related materials**: a curated directory of RevenueCat docs and SDKs,
    category programs, store docs, sponsor docs, the creators behind the
    Influencer Awards, and past-edition pages.
1.  **Open questions**: conflicts and gaps the research could not settle,
    each with a safe default.
1.  **See also**: the brief and the research notes.

Assumptions, stated because the goal directive rules out asking:

- "Context" means background knowledge for the team and the agents in this
  repo, not a glossary or agent instructions.
- Research goes beyond `docs/sources/` to primary web sources, because the
  captures cover past winners only briefly and best practices hardly at all.
- The research is split into three notes, one per topic the request names,
  written in parallel.
- The brief gains one "See also" link to the context; nothing else in it
  changes.

Rejected alternatives: extending the brief (it would double in length and mix
contest rules with advice), a link-only reading list (every reader would have
to redo the research), and per-claim citations in the context (noisy, and the
notes already carry them).

## Verification gate

Every task runs this gate after writing and before committing. `CHECKS` is a
directory holding the three scripts from the
[appendix](#appendix-check-scripts).

```shell
bunx prettier --write docs/CONTEXT.md && bunx prettier --check docs/CONTEXT.md
python3 "$CHECKS/check_md.py" . docs/CONTEXT.md --contents
python3 "$CHECKS/fact_scan.py" . docs/CONTEXT.md docs/sources docs/research
python3 "$CHECKS/check_links.py" docs/CONTEXT.md
```

- Prettier runs first because lint-staged rewrites staged files on commit;
  the checks must see the committed form.
- `check_md.py` must print `OK`. It enforces the style rules above, checks
  that the `Contents:` list matches the H2 headings in order, and checks
  anchors, local link targets, and reference-link definitions.
- `fact_scan.py` lists figures that appear in neither `docs/sources/` nor the
  research notes. Each miss must be fixed, or explained in the commit message
  body when it is a derived value.
- `check_links.py` lists external links that don't return HTTP 2xx. Devpost
  answers scripted requests with 403, so open those by hand; any other
  failure is a broken link to fix.

Each task also has its own assertions, run as a failing test first:

```shell
check() { for p in "$@"; do grep -qE -- "$p" docs/CONTEXT.md || echo "MISSING: $p"; done; }
```

## Tasks

Sections appear in the document in the order of the [design](#design), not in
task order: each task inserts its sections at their place and adds their
`Contents:` entries in the same order. The notes are
[past winners](/docs/research/past-winners.md) (PW),
[best practices](/docs/research/best-practices.md) (BP),
[related materials](/docs/research/related-materials.md) (RM), and
[Shipaton 2026](/docs/research/shipaton-2026.md) (S26).

### Task 1: Frame, official rules, and see also

**Files:**

- Create: `docs/CONTEXT.md`

**Interfaces:**

- Produces: the H1 `# Shipaton 2026 context`, the intro, the `Contents:`
  list, `## What the official rules add`, and `## See also`, which every later
  task extends.

- [ ] **Step 1: Write the failing assertions**

```shell
touch docs/CONTEXT.md
check '^# Shipaton 2026 context$' '^## What the official rules add$' '^## See also$' \
  'Updated August 31, 2026' 'October 21' 'as reported in RevenueCat' '26,920'
```

Expected: seven `MISSING:` lines.

- [ ] **Step 2: Write the sections**

Content, from RM § Official rules and Devpost pages and RM § App Growth
Annual and the Shippies:

- Intro (3 sentences): what the context covers; the brief holds the rules,
  dates, and prizes, so the context links to it; facts come from the notes,
  with web sources read on September 21, 2026.
- What the official rules add (bullets): the rules are headed "Updated
  August 31, 2026" and prevail; the Submission Period from July 31, judging
  to October 13, and "Winners announced: October 21st 2026" against the
  brief's October 22; the Shippies on October 20 and App Growth Annual on
  October 21, 2026; organizations may enter through a "Representative"; the
  Grand Prize shortlist uses revenue "as reported in RevenueCat"; Galaxy
  optimization is 20% of Best App for Galaxy; the tie-break; one Influencer
  Award per project; travel only for the Grand Prize and the #BuildInPublic
  first place; the category fields the rules ask for; 26,920 participants on
  September 21, 2026.
- See also: the brief and the four research notes.

- [ ] **Step 3: Run the gate and the assertions**

Run the [verification gate](#verification-gate), then the Step 1 `check`
command. Expected: prettier passes, `OK`, no unexplained fact misses, no
broken links, and no `MISSING:` lines.

- [ ] **Step 4: Commit**

```shell
git add docs/CONTEXT.md
git commit -m "docs(context): add Shipaton 2026 context with the official rules"
```

### Task 2: Past winners

**Files:**

- Modify: `docs/CONTEXT.md` (insert after the official rules; extend
  `Contents:`)

**Interfaces:**

- Consumes: the Task 1 frame.
- Produces: `## Past winners`.

- [ ] **Step 1: Write the failing assertions**

```shell
check '^## Past winners$' '51,882' '\$30,017' 'based on the revenue we build a short list' \
  '10 of the 30' '12 hours'
```

Expected: six `MISSING:` lines.

- [ ] **Step 2: Write the section**

Content, from PW §§ Editions at a glance, Shipaton 2025 winners, Winner
postmortems and interviews, Where past winners are now, Patterns across
categories:

- A table of the three editions: dates, cash, participants, and gallery size.
- Lessons, each labeled with its edition: Payout's numbers, speed, and
  creator distribution, and the shortlist quote; only 10 of the 30 2025
  write-ups gave numbers; story over polish; both past deadlines extended
  for slow review; 12 of 27 timed 2025 videos ran past three minutes; most
  write-ups kept Devpost's headings and were filed in the last days; AI tools
  credited openly; first-time builders.
- Where the winners are now: 28 of 30 still listed, five with more than 100
  US ratings, and Payout's scale a year later.

- [ ] **Step 3: Run the gate and the assertions**

Expected: as in Task 1.

- [ ] **Step 4: Commit**

```shell
git add docs/CONTEXT.md
git commit -m "docs(context): add past winners"
```

### Task 3: What wins each category

**Files:**

- Modify: `docs/CONTEXT.md` (insert after past winners; extend `Contents:`)

**Interfaces:**

- Consumes: the Task 1 frame.
- Produces: `## What wins each category`, with the H3s
  `### Categories with a precedent` and `### Categories new in 2026`.

- [ ] **Step 1: Write the failing assertions**

```shell
check '^## What wins each category$' 'Audience Fit \(30%\)' '1:50 Justice Model' \
  'Publishing to Google Play is not yet supported' 'observable' 'A single deployed message'
```

Expected: six `MISSING:` lines.

- [ ] **Step 2: Write the section**

Content, from PW § Patterns by 2026 category, RM §§ RevenueCat programs
behind 2026 categories and Sponsor documentation, and the rules: one bullet
per category, stating what 2026 judges ask for (linking to the brief's prize
table) and what past winners or sponsor docs add. Categories with a
precedent: Grand Prize, #BuildInPublic, HAMM, Design, Peace Prize, Keep Them
Coming Back, Ship Kotlin Everywhere, Conflict of Interest, and the Influencer
Awards (Shipyard). New in 2026: Catvertising, Best Game, Next Gen, Most Viral
App, Best App for Galaxy, Idea to Income, Growth Loop, and Funnel Vision.

- [ ] **Step 3: Run the gate and the assertions**

Expected: as in Task 1.

- [ ] **Step 4: Commit**

```shell
git add docs/CONTEXT.md
git commit -m "docs(context): add what wins each category"
```

### Task 4: Monetization and store review

**Files:**

- Modify: `docs/CONTEXT.md` (insert after the categories; extend
  `Contents:`)

**Interfaces:**

- Consumes: the Task 1 frame.
- Produces: `## Monetization and paywalls` and
  `## Getting through store review`, with one H3 per store.

- [ ] **Step 1: Write the failing assertions**

```shell
check '^## Monetization and paywalls$' '^## Getting through store review$' '10\.7%' \
  '90% of submissions' 'API level 36' '10\.7\.0' '1179 × 2556'
```

Expected: seven `MISSING:` lines.

- [ ] **Step 2: Write the sections**

Content, from BP §§ Monetization and paywall benchmarks, Apple App Store
review, Google Play review, and Samsung Galaxy Store review:

- Monetization: State of Subscription Apps 2026 medians (hard paywall versus
  freemium, trial lengths, day-0 trials, common prices, early revenue);
  paywall rules from RevenueCat, Apple, and Google; promo codes for judges;
  a labeled synthesis for the deadline.
- Store review: link the brief's review timing, then Apple (speed, first
  purchase in one draft submission, Xcode 26, subscription screen, account
  deletion and 4.8, US web links, screenshot sizes, privacy label), Google
  Play (the 12-tester rule, review time, API level 36, subscriptions, app
  content, license testers), and the Galaxy Store (seller status, review
  phases, RevenueCat SDK limits).

- [ ] **Step 3: Run the gate and the assertions**

Expected: as in Task 1.

- [ ] **Step 4: Commit**

```shell
git add docs/CONTEXT.md
git commit -m "docs(context): add monetization and store review guidance"
```

### Task 5: Listing, retention, and pitch

**Files:**

- Modify: `docs/CONTEXT.md` (insert after store review; extend `Contents:`)

**Interfaces:**

- Consumes: the Task 1 frame.
- Produces: `## Store listing and discoverability`,
  `## Retention and push notifications`, and `## Demo video and write-up`.

- [ ] **Step 1: Write the failing assertions**

```shell
check '^## Store listing and discoverability$' '^## Retention and push notifications$' \
  '^## Demo video and write-up$' '170 characters' '4\.5\.4' 'first few'
```

Expected: six `MISSING:` lines.

- [ ] **Step 2: Write the sections**

Content, from BP §§ Store listing and discoverability, Retention and push
notifications, Demo video and write-up:

- Listing: Apple and Google Play field limits, copy and policy rules, custom
  product pages, and the Galaxy Store's required metadata.
- Retention: Apple 4.5.4, permission prompts, OneSignal journeys and cadence,
  the RevenueCat integration, and billing failures.
- Pitch: Devpost's guidance, then a labeled synthesis that maps it to the
  two-minute prescreen, the description list, and upload timing.

- [ ] **Step 3: Run the gate and the assertions**

Expected: as in Task 1.

- [ ] **Step 4: Commit**

```shell
git add docs/CONTEXT.md
git commit -m "docs(context): add listing, retention, and pitch guidance"
```

### Task 6: Related materials

**Files:**

- Modify: `docs/CONTEXT.md` (insert before open questions; extend
  `Contents:`)

**Interfaces:**

- Consumes: the Task 1 frame.
- Produces: `## Related materials`, with H3s for RevenueCat setup and tools,
  programs behind the 2026 categories, store documentation, sponsor
  documentation, Influencer Award creators, and past-edition pages.

- [ ] **Step 1: Write the failing assertions**

```shell
check '^## Related materials$' '5\.90\.2' 'RevenueCat/ai-toolkit' '@ChrisLawley' \
  'Test Store API key'
```

Expected: five `MISSING:` lines.

- [ ] **Step 2: Write the section**

Content, from RM: a curated subset with one line per resource. RevenueCat
quickstart, codelabs, `.md` docs for agents, current SDK versions, Test
Store, launch checklist, charts, the project ID, and the AI Toolkit; RevenueCat
Ads, Funnels and Stripe Projects, and the Galaxy guide; Apple, Google Play,
and Galaxy Store documentation; sponsor docs; a table of the five creators'
channels and brief videos, for audience research only; and a table of
past-edition winner posts and galleries. Each H3 defines its reference links
before the next heading.

- [ ] **Step 3: Run the gate and the assertions**

Expected: as in Task 1.

- [ ] **Step 4: Commit**

```shell
git add docs/CONTEXT.md
git commit -m "docs(context): add related materials"
```

### Task 7: Key takeaways and open questions

**Files:**

- Modify: `docs/CONTEXT.md` (insert the takeaways first and the open
  questions before see also; extend `Contents:`)

**Interfaces:**

- Consumes: every earlier section, which the takeaways link to.
- Produces: `## Key takeaways` and `## Open questions`.

- [ ] **Step 1: Write the failing assertions**

```shell
check '^## Key takeaways$' '^## Open questions$' 'one overall award' 'Safe default' \
  '\*\*Funnel Vision checkout\.\*\*'
```

Expected: five `MISSING:` lines.

- [ ] **Step 2: Write the sections**

Content, from the sections above and the Conflicts and Gaps sections of all
three notes:

- Key takeaways: about ten bullets, each ending with a link to its section:
  Apple as the realistic store, the official rules, revenue versus story,
  monetizing from day one, deep sponsor use, the two-minute video, two
  screenshot sizes, slow review at the deadline, the AI Toolkit and Test
  Store, and policy traps.
- Open questions: each states the question, what the sources say, and a safe
  default: prize limits (rules versus JetBrains), the Stripe Project ID, the
  Replit preview URL, the Funnel Vision checkout and period, Sign in with
  Apple, expedited review, dismissing a hard paywall on Google Play, the
  Galaxy seller type, organization accounts on Google Play, RevenueCat Ads
  access time, and self-reported winner figures.

- [ ] **Step 3: Run the gate and the assertions**

Expected: as in Task 1.

- [ ] **Step 4: Commit**

```shell
git add docs/CONTEXT.md
git commit -m "docs(context): add key takeaways and open questions"
```

### Task 8: Brief link, whole-document review, and graph refresh

**Files:**

- Modify: `docs/BRIEF.md` (one line in `## See also`)
- Modify: `docs/CONTEXT.md` (fixes only)
- Modify: `graphify-out/` (generated)

- [ ] **Step 1: Link the context from the brief**

Add to the brief's See also, after the research notes bullet:

```markdown
- [Context](/docs/CONTEXT.md): what past winners did, best practices from
  primary sources, and related materials.
```

Run `check_md.py` on `docs/BRIEF.md` (expected: `OK`), then commit:

```shell
git add docs/BRIEF.md
git commit -m "docs(brief): link the context document"
```

- [ ] **Step 2: Run the gate on the whole document**

Expected: prettier passes, `OK`, every fact-scan miss explained, and every
failing link opened by hand.

- [ ] **Step 3: Independent fact check**

Dispatch a fresh agent to check every claim in `docs/CONTEXT.md` against the
research notes, and to spot-check the notes' most consequential claims
against their primary sources. Fix confirmed mismatches and commit them as
`docs(context): correct facts against the research notes`.

- [ ] **Step 4: Refresh the knowledge graph**

```shell
bun run graph
git add graphify-out
git commit -m "chore(graphify): refresh the graph"
```

Expected: the graph picks up the new docs. Skip the commit if nothing
changed.

### Task 9: Pull request, review, and merge

- [ ] **Step 1: Push and open the PR**

```shell
git push -u origin docs/context
gh pr create --base main --head docs/context --title "docs: add Shipaton 2026 context" --body-file "$CHECKS/pr-body.md"
```

`pr-body.md` summarizes the context, the three research notes, the plan, and
the checks run. No attribution lines.

- [ ] **Step 2: Review and resolve, at most two rounds**

Each round: review the PR diff (accuracy against the notes and their
sources, the style guide, overlap with the brief, internal consistency),
apply the valid findings as small commits, run the gate, and push. Stop after
round two even if minor nits remain, and list them in the PR.

- [ ] **Step 3: Merge and delete the branch**

```shell
gh pr merge --rebase --delete-branch
git checkout main && git pull --ff-only
```

Rebase merging keeps the atomic commits and the linear history of `main`.

## Appendix: check scripts

The scripts from the
[brief plan's appendix](/docs/superpowers/plans/2026-09-21-shipaton-2026-brief.md#appendix-check-scripts),
with changes: `check_md.py` also checks the anchor in a link to another
Markdown file and where each reference definition sits, and `fact_scan.py`
takes the corpus directories as arguments. `check_links.py` is new.

`check_md.py`:

````python
#!/usr/bin/env python3
"""Lint a Markdown file against docs/references/markdown-style.md rules.

Usage: check_md.py <repo_root> <file.md> [--contents]
Exit 1 and print one line per violation; print OK otherwise.
--contents also requires a "Contents:" list that matches the H2 headings.
"""
import os
import re
import sys

root, path = sys.argv[1], sys.argv[2]
want_contents = '--contents' in sys.argv
lines = open(path, encoding='utf-8').read().split('\n')
errs = []


def err(n, msg):
    errs.append(f'{path}:{n}: {msg}')


def slug(text):
    # GitHub heading anchor algorithm.
    text = re.sub(r'`|\*\*|__', '', text).strip().lower()
    text = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', text)
    text = re.sub(r'[^\w\- ]', '', text)
    return text.replace(' ', '-')


in_code = False
headings = []  # (line_no, level, text)
prose = []  # lines with code blocks blanked and inline code removed
fence_re = re.compile(r'^\s*(```|~~~)(.*)$')
for i, line in enumerate(lines, 1):
    m = fence_re.match(line)
    if m:
        if not in_code and not m.group(2).strip():
            err(i, 'code fence without a language')
        in_code = not in_code
        prose.append('')
        continue
    prose.append('' if in_code else re.sub(r'`[^`]*`', '', line))
    if line != line.rstrip():
        err(i, 'trailing whitespace')
    if in_code:
        continue
    h = re.match(r'^(#{1,6})\s+(.*)$', line)
    if h:
        headings.append((i, len(h.group(1)), h.group(2).strip()))
        if i > 1 and lines[i - 2].strip():
            err(i, 'heading not preceded by a blank line')
        if i < len(lines) and lines[i].strip():
            err(i, 'heading not followed by a blank line')
        continue
    if re.match(r'^#{1,6}\S', line):
        err(i, 'heading without a space after #')
    if re.match(r'^\s*(=+|-{3,})\s*$', line) and i > 1 and lines[i - 2].strip() and not lines[i - 2].lstrip().startswith('|'):
        err(i, 'setext-style heading or ambiguous rule')
    exempt = line.lstrip().startswith('|') or re.match(r'^ {0,3}\[[^\]]+\]:\s', line)
    if len(line) > 80 and not exempt:
        # A link may run past column 80, but text beside it must wrap.
        rest = re.sub(r'\[[^\]]*\]\([^)]*\)', '', line)
        rest = re.sub(r'<?https?://[^\s`>]+>?', '', rest)
        rest = re.sub(r'^\s*(?:[-*+]|\d+\.)?\s*', '', rest)
        if re.sub(r'[\s.,;:!?()"\'`]', '', rest):
            err(i, f'prose line is {len(line)} chars (> 80)')
    for bad in ('TBD', 'TODO', 'FIXME', 'XXX', '[TOC]', 'lorem'):
        if bad in re.sub(r'`[^`]*`', '', line):
            err(i, f'placeholder or forbidden token {bad!r}')

h1 = [h for h in headings if h[1] == 1]
if len(h1) != 1:
    err(1, f'expected exactly one H1, found {len(h1)}')
elif headings[0][1] != 1:
    err(headings[0][0], 'first heading is not the H1')
seen = {}
for n, _lvl, text in headings:
    if text.lower() in seen:
        err(n, f'duplicate heading {text!r} (first at line {seen[text.lower()]})')
    seen.setdefault(text.lower(), n)
for (n, lvl, _t), (_n0, lvl0, _t0) in zip(headings[1:], headings):
    if lvl > lvl0 + 1:
        err(n, f'heading level jumps from H{lvl0} to H{lvl}')

anchors = {slug(t) for _n, _l, t in headings}
text = '\n'.join(prose)

# Contents list: must mirror the H2 headings, in order.
if want_contents:
    try:
        start = lines.index('Contents:')
    except ValueError:
        err(1, 'missing "Contents:" list')
    else:
        entries = []
        for j in range(start + 2, len(lines)):
            m = re.match(r'^1\.  \[([^\]]+)\]\(#([^)]+)\)$', lines[j])
            if not m:
                break
            entries.append(m.group(2))
        h2 = [slug(t) for _n, lvl, t in headings if lvl == 2]
        if entries != h2:
            err(start + 1, f'Contents anchors {entries} != H2 anchors {h2}')

# In-page anchors resolve.
for m in re.finditer(r'\]\(#([^)]+)\)', text):
    if m.group(1) not in anchors:
        err(text[:m.start()].count('\n') + 1, f'broken anchor #{m.group(1)}')

# Local link targets exist; root paths resolve from the repo root.
# A reference definition starts a block: its previous line is blank or
# another definition (a definition cannot interrupt a paragraph).
def_re = re.compile(r'^ {0,3}\[([^\]\n]+)\]:[ \t]+(\S+)')
def_lines = {}
for i, line in enumerate(prose):
    m = def_re.match(line)
    if m and (i == 0 or not prose[i - 1].strip() or (i - 1) in def_lines):
        def_lines[i] = (m.group(1).lower(), m.group(2))
targets = [m.group(1) for m in re.finditer(r'\]\(([^)\s]+)\)', text)]
targets += [t for _l, t in def_lines.values()]


def file_anchors(p):
    # Heading anchors of another Markdown file, skipping fenced code.
    anchors, fence = set(), False
    for line in open(p, encoding='utf-8'):
        if re.match(r'^\s*(```|~~~)', line):
            fence = not fence
        elif not fence and (h := re.match(r'^#{1,6}\s+(.*?)\s*$', line)):
            anchors.add(slug(h.group(1)))
    return anchors


for t in targets:
    if re.match(r'^(https?:|mailto:|#)', t):
        continue
    t, _, frag = t.partition('#')
    full = os.path.join(root, t.lstrip('/')) if t.startswith('/') else os.path.join(os.path.dirname(path), t)
    if not os.path.exists(full):
        err(0, f'link target does not exist: {t}')
    elif frag and full.endswith('.md') and frag not in file_anchors(full):
        err(0, f'broken anchor: {t}#{frag}')
    if t.startswith('../'):
        err(0, f'relative link into another directory: {t}')

# Reference links: every use defined, every definition used.
defs = {label for label, _t in def_lines.values()}
body = '\n'.join(l for i, l in enumerate(prose) if i not in def_lines)
used = {m.group(1).lower() for m in re.finditer(r'\]\[([^\]]+)\]', body)}
used |= {m.group(1).lower() for m in re.finditer(r'(?<!\])\[([^\]]+)\](?![(\[:])', body) if m.group(1).lower() in defs}
for u in sorted(used - defs):
    err(0, f'undefined reference link [{u}]')
for d in sorted(defs - used):
    err(0, f'unused reference link definition [{d}]')

# A definition sits in the section (text between two headings) that uses it,
# or at the end of the document when several sections use it.
sec, section_of = 0, []
for line in prose:
    if re.match(r'^#{1,6}\s', line):
        sec += 1
    section_of.append(sec)
uses = {}
for i, line in enumerate(prose):
    if i in def_lines:
        continue
    labels = [m.group(1) for m in re.finditer(r'\]\[([^\]]+)\]', line)]
    labels += [m.group(1) for m in re.finditer(r'(?<!\])\[([^\]]+)\](?![(\[:])', line)]
    for label in labels:
        if label.lower() in defs:
            uses.setdefault(label.lower(), set()).add(section_of[i])
for i, (label, _t) in def_lines.items():
    secs = uses.get(label, set())
    if len(secs) == 1 and section_of[i] not in secs:
        err(i + 1, f'definition [{label}] is not in the section that uses it')
    elif len(secs) > 1 and section_of[i] != sec:
        err(i + 1, f'definition [{label}] is used in several sections; move it to the end')

print('\n'.join(errs) if errs else 'OK')
sys.exit(1 if errs else 0)
````

`fact_scan.py`:

````python
#!/usr/bin/env python3
"""List the figures in a Markdown file that never appear in the corpus.

Usage: fact_scan.py <repo_root> <file.md> [corpus_dir ...]
The corpus is every .md file under the given directories, relative to
<repo_root> (default: docs/sources). Extracts money amounts, percentages,
clock times, month-day dates, and multi-digit numbers, then searches the
corpus (whitespace-normalized, case-insensitive). Prints each unmatched
figure with its line; exit 1 if any. A miss is not proof of an error (the
file may reformat a figure), but every miss must be explained or fixed.
"""
import pathlib
import re
import sys

root, path = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
dirs = sys.argv[3:] or ['docs/sources']
corpus = ' '.join(
    re.sub(r'\s+', ' ', p.read_text(encoding='utf-8'))
    for d in dirs
    for p in sorted((root / d).rglob('*.md'))
).lower()

MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December'
patterns = [
    r'\$\s?\d(?:[\d,]*\d)?(?:\.\d+)?\s?(?:[kKmM]\b|million|billion)?',
    r'\d+(?:\.\d+)?\s?%',
    r'\b\d{1,2}(?::\d{2})?\s?(?:AM|PM|am|pm|a\.m\.|p\.m\.)',
    rf'\b(?:{MONTHS})\s\d{{1,2}}(?:st|nd|rd|th)?\b',
    r'\b\d[\d,]*\d\b',
]
misses = 0
lines = path.read_text(encoding='utf-8').split('\n')
in_code = False
for n, line in enumerate(lines, 1):
    if line.lstrip().startswith('```'):
        in_code = not in_code
    if in_code or re.match(r'^\s*\[[^\]]+\]:\s', line):
        continue
    line = re.sub(r'\]\([^)]*\)', ']', line)  # ignore link targets
    found = set()
    for pat in patterns:
        for m in re.finditer(pat, line):
            tok = re.sub(r'\s+', ' ', m.group(0)).strip()
            if any(tok in f for f in found):
                continue
            found.add(tok)
            if tok.lower() not in corpus:
                misses += 1
                print(f'{path}:{n}: {tok!r} not found in {", ".join(dirs)}')
print(f'{misses} unmatched figure(s)')
sys.exit(1 if misses else 0)
````

`check_links.py`:

````python
#!/usr/bin/env python3
"""Report the external links in a Markdown file that don't return HTTP 2xx.

Usage: check_links.py <file.md>
Fetches each unique http(s) URL with curl (GET, redirects followed) and
prints the status of every URL that fails; exit 1 if any. Some sites block
scripted requests (403 or 429): open those by hand before calling them
broken.
"""
import re
import subprocess
import sys

text = open(sys.argv[1], encoding='utf-8').read()
text = re.sub(r'```.*?```', '', text, flags=re.S)  # skip fenced code
urls = sorted({u.rstrip('.,;:') for u in re.findall(r'https?://[^\s)<>`"\]]+', text)})
bad = 0
for url in urls:
    code = subprocess.run(
        ['curl', '-sL', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '20',
         '-A', 'Mozilla/5.0', url],
        capture_output=True, text=True).stdout
    if not code.startswith('2'):
        bad += 1
        print(f'{code} {url}')
print(f'{len(urls)} link(s), {bad} not OK')
sys.exit(1 if bad else 0)
````

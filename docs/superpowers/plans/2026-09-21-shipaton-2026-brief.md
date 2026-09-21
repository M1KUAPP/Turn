# Shipaton 2026 brief implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `docs/BRIEF.md`, a concise, source-backed brief of RevenueCat
Shipaton 2026 for the team and the agents working in this repo.

**Architecture:** One new Markdown file distilled from
[the research notes](/docs/research/shipaton-2026.md), which cite every claim
to `docs/sources/`. The brief keeps the facts a team acts on; the notes keep
the per-claim citations and the long tables. Each task adds whole sections
together with their `Contents:` entries, so every commit leaves a consistent
document.

**Tech Stack:** Markdown (GFM), Prettier 3 run by husky and lint-staged,
commitlint with Conventional Commits, the `gh` CLI, and Python 3 for the local
checks in the [appendix](#appendix-check-scripts).

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
  `[TOC]` directive, as at the top of the Devpost source.
- One H1; ATX headings with unique names and blank lines around them; prose
  wrapped at 80 characters (links, tables, headings, and code blocks are
  exempt); no trailing whitespace; `- ` bullets; a language on every fenced
  code block.
- Repo links use root paths such as `/docs/research/shipaton-2026.md`. Long or
  repeated links become reference links, defined before the next heading
  after first use, or at the end of the document when used in several
  sections.
- Facts come only from `docs/sources/`, through the research notes. Copy
  figures verbatim. Label anything from the 2024 Ship-a-ton, Shipaton 2025, or
  Shipyard with its edition. Use absolute dates, never "N days left".
- Where sources conflict, state the authoritative value (the order is: the
  official rules, then Devpost, then 2026 site pages, then 2026 blog posts,
  then past editions) and list the conflict under Open questions.
- Conventional Commits: lowercase subject, header of at most 100 characters,
  no attribution lines.
- Stage explicit paths only. Never stage `skills-lock.json`, `.agents/`, or
  `.claude/`; they hold unrelated local changes.

## Design

`docs/BRIEF.md` serves a team deciding what to build and how to submit it. It
answers, in order: what the event is, when things happen, who and which apps
qualify, what to hand in, how entries are judged, what can be won, which rules
are easy to break, where to get help, what has won before, how to win, and
what is still unclear. Sections:

1.  **At a glance**: the one-screen summary.
1.  **Key dates**: a table of the dated milestones with time zones.
1.  **Eligibility**: who may enter and which apps qualify.
1.  **Submission checklist**: every required item, plus app review timing.
1.  **Judging process**: the four stages and what screeners look for.
1.  **Prizes and categories**: the prize structure and a 21-row table.
1.  **Rules to watch**: rules a team could break by accident.
1.  **Resources and perks**: Ship Kit, sale, livestreams, community.
1.  **Lessons from past winners**: patterns, each labeled with its edition.
1.  **Winning playbook**: source-attributed tips from idea to pitch.
1.  **Open questions**: conflicts and gaps to confirm with the organizers.
1.  **See also**: the research notes and the key sources.

Rejected alternatives: inline citations on every claim (noisy, and the
research notes already carry them) and a link-only brief (the corpus is too
large to skim, so the brief must stand alone).

## Verification gate

Every task runs this gate after writing and before committing. `CHECKS` is a
directory holding the two scripts from the
[appendix](#appendix-check-scripts).

```shell
bunx prettier --write docs/BRIEF.md && bunx prettier --check docs/BRIEF.md
python3 "$CHECKS/check_md.py" . docs/BRIEF.md --contents
python3 "$CHECKS/fact_scan.py" . docs/BRIEF.md
```

- Prettier runs first because lint-staged rewrites staged files on commit;
  the checks must see the committed form.
- `check_md.py` must print `OK`. It enforces the style rules above, checks
  that the `Contents:` list matches the H2 headings in order, and checks
  anchors, local link targets, and reference-link definitions.
- `fact_scan.py` lists figures that never appear in `docs/sources/`. Each
  miss must be fixed, or explained in the commit message body when it is a
  derived value (for example, a date computed from "one week before the
  deadline").

Each task also has its own assertions, run as a failing test first:

```shell
check() { for p in "$@"; do grep -qE -- "$p" docs/BRIEF.md || echo "MISSING: $p"; done; }
```

## Tasks

### Task 1: Frame, at a glance, and key dates

**Files:**

- Create: `docs/BRIEF.md`

**Interfaces:**

- Produces: the H1 `# RevenueCat Shipaton 2026 brief`, the intro, the
  `Contents:` list, and the `## See also` section that every later task
  extends. Later tasks insert their sections before `## See also` and add
  their `Contents:` entries in the same order.

- [ ] **Step 1: Write the failing assertions**

```shell
touch docs/BRIEF.md
check '^# RevenueCat Shipaton 2026 brief$' '^## At a glance$' '^## Key dates$' '^## See also$' \
  '11:45 PM Pacific Time' 'October 22, 2026' '\$700,000' 'August 1'
```

Expected: eight `MISSING:` lines.

- [ ] **Step 2: Write the sections**

Content, from research notes §§ Overview, Key dates and timeline:

- Intro (2 sentences): what the brief is for; facts condensed from
  `docs/sources/`, with citations in the research notes.
- At a glance (bullets): RevenueCat's global mobile hackathon, online with
  optional IRL events, entered on Devpost; the challenge (a brand-new app on
  the App Store, Google Play Store, or Samsung Galaxy Store, first released
  between August 1 and September 30, 2026, with the RevenueCat SDK powering at
  least one in-app or web purchase or serving RevenueCat Ads); platforms iOS,
  iPadOS, macOS, or Android; deadline "Wednesday, September 30, 2026 at 11:45
  PM Pacific Time"; "over $700,000 in cash prizes" (the site says "$740k+"),
  21 categories, Grand Prize $100,000; winners announced October 22, 2026;
  contact `shipaton@revenuecat.com`.
- Key dates (table: Date, Milestone): August 1 to September 30, 2026 window;
  September 23, 2026 as the derived "at least one week before" store-review
  target; September 30, 2026, 11:45 PM Pacific Time deadline; October 1
  intake filtering; October 8–9 final selection; October 22, 2026
  announcement; App Growth Annual "in October". Note the FAQ's warning to
  check the deadline in local time and that the judging dates come from a
  post that says "This process is subject to change".
- See also: the research notes, the Devpost capture, and the official rules
  URL `https://revenuecat-shipaton-2026.devpost.com/rules` (not captured).

- [ ] **Step 3: Run the gate and the assertions**

Run the [verification gate](#verification-gate), then the Step 1 `check`
command. Expected: prettier passes, `OK`, no unexplained fact misses, and no
`MISSING:` lines.

- [ ] **Step 4: Commit**

```shell
git add docs/BRIEF.md
git commit -m "docs(brief): add Shipaton 2026 brief with key dates"
```

### Task 2: Eligibility and submission checklist

**Files:**

- Modify: `docs/BRIEF.md` (insert before `## See also`; extend `Contents:`)

**Interfaces:**

- Consumes: the Task 1 frame.
- Produces: `## Eligibility` and `## Submission checklist`.

- [ ] **Step 1: Write the failing assertions**

```shell
check '^## Eligibility$' '^## Submission checklist$' '1024' '1179' 'RevenueCat project ID' \
  'TestFlight' '14 days' 'Submitted' 'Quebec'
```

Expected: nine `MISSING:` lines.

- [ ] **Step 2: Write the sections**

Content, from research notes §§ Eligibility rules, Submission requirements:

- Eligibility, who: unlimited team size (one person flown to New York per
  eligible prize); the Quebec and Brazil change and the Cuba, Iran, North
  Korea, Crimea, and Russia exclusion; minors (students 13+) and teams with a
  minor compete only for Next Gen, with guardian consent; RevenueCat and
  sponsor employees enter Conflict of Interest.
- Eligibility, apps: first store release inside the window; updates and
  second-store launches don't count; the web-only exception; building and
  promoting before August 1 is fine but publishing is not; must be live, not
  in review; TestFlight or testing tracks don't count; downloadable in the US;
  English; multiple apps allowed if "unique and substantially different"; web
  apps are not eligible, but web purchases count as monetization.
- Submission checklist (numbered, the submission guide's nine items):
  project name and tagline; description; public store URL; public or unlisted
  YouTube or Vimeo video with at most 2 minutes of essential footage; 1024 ×
  1024 icon; a 1179 × 2556 screenshot without a device frame; RevenueCat
  project ID; free trial or promo code; category-specific details. Then: the
  bundle ID or package name check at intake; "Submitted and 5/5 steps done";
  edits allowed until the deadline.
- App review timing (subsection): submit for review at least one week ahead;
  Apple can take up to 24 hours to show the app; new personal Google Play
  accounts need 12 testers for 14 days; ship monetization in the first build
  when there is no time for two reviews; no expedited review; review hygiene
  (privacy policy, Terms of Use, reviewer account, Sign in with Apple).

- [ ] **Step 3: Run the gate and the assertions**

Expected: as in Task 1.

- [ ] **Step 4: Commit**

```shell
git add docs/BRIEF.md
git commit -m "docs(brief): add eligibility and submission checklist"
```

### Task 3: Judging process and prizes

**Files:**

- Modify: `docs/BRIEF.md` (insert before `## See also`; extend `Contents:`)

**Interfaces:**

- Consumes: the Task 1 frame.
- Produces: `## Judging process`, `## Prizes and categories`, and the
  category reference links (`[cat-*]`, defined right after the table).

- [ ] **Step 1: Write the failing assertions**

```shell
check '^## Judging process$' '^## Prizes and categories$' '\$100,000' '\$25,000' 'October 8' \
  'developer advocate' 'Conflict of Interest'
test "$(grep -c '^| \[' docs/BRIEF.md)" -eq 21 || echo "MISSING: 21 category rows"
```

Expected: seven `MISSING:` lines and the row-count miss.

- [ ] **Step 2: Write the sections**

Content, from research notes §§ Judging process and criteria, Prize
categories and prize structure:

- Judging process: the four stages (intake filtering on October 1; at least
  two RevenueCat screeners scoring 1 to 5 per targeted category; judges
  scoring and nominating, with "close to 100 apps" in the final round; final
  selection on October 8–9 with a developer advocate downloading the app); no
  early judging; no published weights or tie-breakers; the Grand Prize uses
  revenue for the shortlist but "does not decide the winner"; the first two
  minutes of video must carry the pitch, the app in use, the purchase or ad
  flow, and the targeted categories.
- Prizes: the Grand Prize bundle; 1st-place bundles (travel for the Grand
  Prize and #BuildInPublic 1st, an invitation for other 1st places); 2nd and
  3rd places get a blog post; categories are chosen in the Devpost
  "Additional info" step, one Influencer Award per project, and only
  categories whose questions are answered get judged.
- Table (Category, Presenter, Cash for 1st / 2nd / 3rd, What it rewards), 21
  rows with amounts from the Devpost prize list, which overrides the Devpost
  summary's "$20,000" for sponsor categories.

- [ ] **Step 3: Run the gate and the assertions**

Expected: as in Task 1.

- [ ] **Step 4: Commit**

```shell
git add docs/BRIEF.md
git commit -m "docs(brief): add judging process and prize categories"
```

### Task 4: Rules to watch, resources, and perks

**Files:**

- Modify: `docs/BRIEF.md` (insert before `## See also`; extend `Contents:`)

**Interfaces:**

- Consumes: the Task 1 frame.
- Produces: `## Rules to watch` and `## Resources and perks`.

- [ ] **Step 1: Write the failing assertions**

```shell
check '^## Rules to watch$' '^## Resources and perks$' 'likeness' 'shipkit@revenuecat.com' \
  '#ShipatonSale' 'luma.com/shipaton-live' 'discord.gg/shipaton26'
```

Expected: seven `MISSING:` lines.

- [ ] **Step 2: Write the sections**

Content, from research notes §§ Official rules and legal terms; Resources,
perks, and programs:

- Rules to watch: read the uncaptured official rules; video length and
  rights; no influencer likeness or brand without written consent; English;
  "don't let AI write your whole description" (AI-built apps are welcome);
  sponsor categories need a working integration, not a tag; the app must
  match the video; winners' icons, screenshots, and videos become public
  marketing; prize money goes to a bank account and attending New York is
  optional; IP, tax, and disqualification terms are not in the corpus.
- Resources and perks: Ship Kit (28 perks over five milestones, emailed;
  support timing and contacts; a few high-value perks verbatim); the
  resources page (Zero to Ship, SDK quickstart and codelabs, AI Toolkits);
  the #ShipatonSale directory with a few deadline-relevant deals; the
  remaining livestreams and the calendar; IRL events and hosting; Discord and
  its channels; build-in-public partners; students; the media kit.

- [ ] **Step 3: Run the gate and the assertions**

Expected: as in Task 1.

- [ ] **Step 4: Commit**

```shell
git add docs/BRIEF.md
git commit -m "docs(brief): add rules to watch and resources"
```

### Task 5: Lessons from past winners and winning playbook

**Files:**

- Modify: `docs/BRIEF.md` (insert before `## See also`; extend `Contents:`)

**Interfaces:**

- Consumes: the Task 1 frame.
- Produces: `## Lessons from past winners` and `## Winning playbook`.

- [ ] **Step 1: Write the failing assertions**

```shell
check '^## Lessons from past winners$' '^## Winning playbook$' 'Payout' 'Gurwi' 'Meshing' \
  '4-8-24' 'Story Circle' '100 paying customers'
```

Expected: eight `MISSING:` lines.

- [ ] **Step 2: Write the sections**

Content, from research notes §§ Past editions and winners, Winning playbook:

- Lessons: a few labeled winners (2025 Grand Prize Payout; 2025
  #BuildInPublic Gurwi; 2025 Buzziest Launch ReadHim; 2025 HAMM Vector Guard;
  2024 Karo; 2024 Meshing; Shipyard 2026's "focus") and the recurring
  patterns (specific problem, public building with visible feedback, numbers
  in the write-up, monetization designed in, openly credited AI use, deep
  sponsor-tool use).
- Playbook (H3 per stage, each tip attributed with its edition): pick the
  idea; build fast (4-8-24); grow after launch (100 paying customers as a
  2025 target); pitch the submission (Story Circle, proof-first video,
  logline template, two-minute limit for 2026).

- [ ] **Step 3: Run the gate and the assertions**

Expected: as in Task 1.

- [ ] **Step 4: Commit**

```shell
git add docs/BRIEF.md
git commit -m "docs(brief): add past-winner lessons and winning playbook"
```

### Task 6: Open questions

**Files:**

- Modify: `docs/BRIEF.md` (insert before `## See also`; extend `Contents:`)

**Interfaces:**

- Consumes: the Task 1 frame.
- Produces: `## Open questions`.

- [ ] **Step 1: Write the failing assertions**

```shell
check '^## Open questions$' 'more than one prize' 'measurement period' 'X95EwqBxQT'
```

Expected: four `MISSING:` lines.

- [ ] **Step 2: Write the section**

Content, from research notes §§ Conflicts and ambiguities, Gaps in the
corpus: each item states the question, what the sources say, and the safe
default. Cover the uncaptured official rules; multiple prizes per app; a
working purchase versus a real transaction; the "$20,000" summary versus the
prize list; six versus nine required items; the Funnel Vision measurement
period; travel versus invitation; the two Discord links; company entries;
public betas before August 1; and undated captures.

- [ ] **Step 3: Run the gate and the assertions**

Expected: as in Task 1.

- [ ] **Step 4: Commit**

```shell
git add docs/BRIEF.md
git commit -m "docs(brief): add open questions from source conflicts"
```

### Task 7: Whole-document review and graph refresh

**Files:**

- Modify: `docs/BRIEF.md` (fixes only)
- Modify: `graphify-out/` (generated)

- [ ] **Step 1: Run the gate on the whole document**

Expected: prettier passes, `OK`, and every fact-scan miss explained.

- [ ] **Step 2: Independent fact check**

Dispatch a fresh agent to check every claim in `docs/BRIEF.md` against
`docs/sources/` and report each mismatch with the source line. Fix confirmed
mismatches and commit them as `docs(brief): correct facts against sources`.

- [ ] **Step 3: Refresh the knowledge graph**

```shell
bun run graph
git add graphify-out
git commit -m "chore(graphify): refresh the graph"
```

Expected: the graph picks up the new docs. Skip the commit if nothing
changed.

### Task 8: Pull request, review, and merge

- [ ] **Step 1: Push and open the PR**

```shell
git push -u origin docs/brief
gh pr create --base main --head docs/brief --title "docs: add Shipaton 2026 brief" --body-file "$CHECKS/pr-body.md"
```

`pr-body.md` summarizes the brief, the research notes, the plan, and the
checks run. No attribution lines.

- [ ] **Step 2: Review and resolve, at most two rounds**

Each round: review the PR diff (accuracy against `docs/sources/`, the style
guide, internal consistency), apply the valid findings as small commits, run
the gate, and push. Stop after round two even if minor nits remain, and list
them in the PR.

- [ ] **Step 3: Merge and delete the branch**

```shell
gh pr merge --rebase --delete-branch
git checkout main && git pull --ff-only
```

Rebase merging keeps the atomic commits and the linear history of `main`.

## Appendix: check scripts

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
    exempt = line.lstrip().startswith('|') or '](' in line or re.match(r'^ {0,3}\[[^\]]+\]:\s', line) or 'http' in line
    if len(line) > 80 and not exempt:
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
for t in targets:
    if re.match(r'^(https?:|mailto:|#)', t):
        continue
    t = t.split('#')[0]
    full = os.path.join(root, t.lstrip('/')) if t.startswith('/') else os.path.join(os.path.dirname(path), t)
    if not os.path.exists(full):
        err(0, f'link target does not exist: {t}')
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

print('\n'.join(errs) if errs else 'OK')
sys.exit(1 if errs else 0)
````

`fact_scan.py`:

````python
#!/usr/bin/env python3
"""List the figures in a Markdown file that never appear in docs/sources/.

Usage: fact_scan.py <repo_root> <file.md>
Extracts money amounts, percentages, clock times, month-day dates, and
multi-digit numbers, then searches the source corpus (whitespace-normalized,
case-insensitive). Prints each unmatched figure with its line; exit 1 if any.
A miss is not proof of an error (the brief may reformat a figure), but every
miss must be explained or fixed.
"""
import pathlib
import re
import sys

root, path = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
corpus = ' '.join(
    re.sub(r'\s+', ' ', p.read_text(encoding='utf-8'))
    for p in sorted((root / 'docs/sources').rglob('*.md'))
).lower()

MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December'
patterns = [
    r'\$\s?\d[\d,]*(?:\.\d+)?\s?(?:[kKmM]\b|million|billion)?',
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
                print(f'{path}:{n}: {tok!r} not found in docs/sources')
print(f'{misses} unmatched figure(s)')
sys.exit(1 if misses else 0)
````

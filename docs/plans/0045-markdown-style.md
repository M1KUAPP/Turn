# Markdown style enforcement

Apply the rewritten [Markdown style guide](/docs/references/markdown-style.md) to the repo's Markdown, and keep Prettier as the formatter that enforces it on every commit.

Contents:

1.  [Context](#context)
1.  [Decisions](#decisions)
1.  [Steps](#steps)
1.  [Checks](#checks)

## Context

The guide's rewrite, as first drafted, dropped the line length limit (one line per paragraph and list item), replaced the `[TOC]` directive with a `Contents:` list, and used `*` list and emphasis markers with 4-column list alignment. `AGENTS.md` now imports [project conventions](/docs/references/project-conventions.md), which points at the guide, instead of importing the guide itself.

Prettier 3.9.8 runs on every staged file through lint-staged and in `bun run lint`. Its Markdown printer always prints `- ` bullets and `_` emphasis, with no option to change either, so it rewrote the draft's `*` markers on commit. The decision is to keep Prettier and fit the guide to its output.

A survey of 134 Markdown files outside the vendored folders found 11,675 hard-wrapped paragraphs in 124 files, 21 files with headings but no contents list, 13 `../` links and images, and 1 code fence without a language.

`bun run eval` writes `eval/results.md` in the old style: its `wrap()` fills prose to 80 columns and its contents list names only the H2s. Its tests assert both.

## Decisions

1.  `.prettierrc.json` gets a Markdown override for `**/*.md`:
    - `proseWrap: "never"` puts every paragraph and list item on one line.
    - `printWidth: 10000` keeps every table padded. With `never`, Prettier prints a table unpadded once its padded rows pass `printWidth`, which at 120 columns would have flipped 172 of the corpus's 307 tables; the widest row today is 748 columns.
    - `embeddedLanguageFormatting: "off"` leaves code blocks byte for byte. With `never`, Prettier's formatting of fenced Markdown and YAML unwrapped examples, an agent prompt in plan 0013, and the YAML that `app/test/theme.test.ts` reads from `docs/DESIGN.md`.
    - `excludeFiles` names the root `README.md`, which project conventions exempt, and the root `AGENTS.md`, a list of `@path` imports one per line. Because `**/*.md` contains a slash, Prettier matches it and the exclusions against the path from the repo root, not the basename, so nested files such as `worker/README.md` still follow the guide.
2.  The guide follows Prettier's output: `- ` bullets with one space, nested content aligned with its parent's text (2 spaces under a bullet, 4 under `1.  `), `_` emphasis, and tables with outer pipes. It also states the anchor rule and that a page without subheadings needs no contents list.
3.  Scope is every Markdown file Prettier formats. `.agents/`, `.claude/`, and `docs/sources/` stay in `.prettierignore`. `docs/research/design/` joins them, since it holds verbatim copies of astra's research, and so does `graphify-out/`, since graphify writes its report with deliberate line breaks that unwrapping would fight on every `graphify update`.
4.  Rules Prettier can't apply are fixed by a one-off script and by hand: a contents list in every doc with headings below the H1, linking every heading with its GitHub anchor and placed before the first H2; `../` links and images rewritten as root paths; a language on every code fence. Prettier reads text between two `$` signs as inline math and keeps its line breaks, so the script also joins those paragraphs.
5.  The eval report follows the guide too: no `wrap()` in the report or the replay, and a contents list that nests each section's H3s. A test formats the report with Prettier under the repo's config and expects no change.
6.  `docs/DESIGN.md` is reformatted even though draft PR #165 edits it. Resolving the conflict takes their version, runs `bun run lint:fix`, updates its contents list by hand, and reruns `bun run test`, since `app/test/theme.test.ts` reads the file.
7.  Project conventions gain what Prettier enforces and what it leaves to authors, the `$` trap, the exemptions, the generated reports, and the retirement of the old `check_md.py` gate.
8.  `.git-blame-ignore-revs` lists the two formatting-only commits.

## Steps

1.  Config, guide, project conventions, and this plan.
2.  `prettier --write '**/*.md'`, committed on its own.
3.  The `$` paragraphs joined, committed on its own.
4.  Contents lists, links, and fences.
5.  The eval report, test first.
6.  `.git-blame-ignore-revs`.

## Checks

1.  `bun run lint` exits 0.
2.  For every file steps 2 and 3 change, markdown-it renders the same HTML with whitespace collapsed outside code, and every code block is byte for byte the same.
3.  A markdown-it checker over the formatted files reports zero of each: paragraphs spanning lines, docs with subheadings but no contents list, contents entries that don't match the headings in text, anchor, nesting, or order, contents lists after the first H2, `#fragment` links (in-doc and cross-doc) with no matching heading, `../` links, code fences without a language, and files whose H1 count isn't 1. Run on `main` first, it must report the survey's counts.
4.  Root `AGENTS.md` differs from `main` only by the import change. The root `README.md` from `feat/64-readme-license` comes through Prettier unchanged, while `worker/README.md` and `app/src/screens/AGENTS.md` unwrap.
5.  `bun run test` and `bun run typecheck` pass, including `eval/test/report.test.ts`'s check that Prettier leaves the report unchanged.

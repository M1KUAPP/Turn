# Project conventions

Conventions for every change in this repo. `AGENTS.md` imports this page, so agents read it at the start of each session.

- Read the [Markdown style guide](/docs/references/markdown-style.md) before creating or editing Markdown. The root `README.md` is exempt.
- Prettier formats Markdown when you commit, through lint-staged. The Markdown override in `.prettierrc.json` sets `proseWrap: "never"` for one line per paragraph and list item, a 10000-column `printWidth` so every table stays padded, and `embeddedLanguageFormatting: "off"` so code blocks stay as written. Prettier fixes wrapping, list markers and indentation, emphasis, blank lines, and table padding; contents lists, anchors, links, and the guide's other rules are yours to keep. `bun run lint:fix` formats by hand and `bun run lint` fails on unformatted files, but no CI job runs either.
- Prettier reads text between two `$` signs as math and keeps its line breaks, so write a paragraph with two prices on one line.
- Keep one `@path` import per line in the root `AGENTS.md`. It's an import list, not a document, so the style guide doesn't apply and Prettier keeps its line breaks.
- Leave the formatting of copied and generated Markdown alone: `.agents/` and `.claude/` (installed skills), `docs/sources/` and `docs/research/design/` (verbatim copies), and `graphify-out/` (graphify's output), which `.prettierignore` lists. `eval/results.md` and `eval/results-extras.md` come from `bun run eval`, so change `eval/src/report.ts` rather than the reports.
- The `check_md.py` gate that plans 0001 to 0027 run checks the old 80-column style. Don't run it.

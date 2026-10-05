# Turn conventions

Turn's own rules, on top of the shared agent docs. The shared files in `docs/agents/` and `docs/references/` are byte-for-byte copies of the template repository's, so Turn's additions to them live here.

Contents:

1.  [Domain docs](#domain-docs)
1.  [Issues and plans](#issues-and-plans)
1.  [Formatting](#formatting)
1.  [Markdown style](#markdown-style)
    1.  [Contents list anchors](#contents-list-anchors)
    1.  [Nested list spacing](#nested-list-spacing)

## Domain docs

This repo is single-context. The root `CONTEXT.md`, moved there from `docs/CONTEXT.md`, holds the Shipaton 2026 hackathon context rather than a glossary. Keep glossary terms in the root `CONTEXT.md`.

## Issues and plans

Issues and specs for this repo live as GitHub issues in `M1KUAPP/Turn`.

Plan files are the exception: when a change has one, it's committed on the change's branch as `docs/plans/NNNN-<topic>.md`, numbered one past the highest plan there, and its path is passed to `/code-review` as the spec. Specs from `/to-spec`, tickets, and wayfinder maps stay in GitHub issues. Superpowers' `writing-plans` and `brainstorming` skills write their plans and specs to `docs/plans/` too, not `docs/superpowers/`.

## Formatting

- Prettier formats Markdown when you commit, through lint-staged, with the template's `.prettierrc.json`. Its default `proseWrap: "preserve"` keeps one line per paragraph and list item as you write it, tables stay padded, and code blocks in a language Prettier knows are formatted too. Prettier fixes wrapping, list markers and indentation, emphasis, blank lines, and table padding; contents lists, anchors, links, and the guide's other rules are yours to keep. `bun run lint:fix` formats by hand and `bun run lint` fails on unformatted files, but no CI job runs either. `bun run check` runs the lint, typecheck, and tests.
- Prettier reads text between two `$` signs as math and keeps its line breaks, so write a paragraph with two prices on one line.
- Keep one `@path` import per line in the root `AGENTS.md`. It's an import list, not a document, so the style guide doesn't apply and Prettier keeps its line breaks.
- Leave the formatting of copied and generated Markdown alone: `.agents/` and `.claude/` (installed skills), `docs/research/design/` (verbatim copies), and `graphify-out/` (graphify's output), which `.prettierignore` lists. `eval/results.md` and `eval/results-extras.md` come from `bun run eval`, so change `eval/src/report.ts` rather than the reports.
- The `check_md.py` gate that plans 0001 to 0027 run checks the old 80-column style. Don't run it.

## Markdown style

These add to the [Markdown style guide](/docs/references/markdown-style.md). Turn's Markdown follows Prettier's formatting of lists, emphasis, and tables.

### Contents list anchors

Each link points at the heading's anchor as GitHub makes it: the heading text in lowercase, with each space turned into a hyphen and punctuation other than `-` and `_` dropped. A page with no headings below its H1 needs no list.

### Nested list spacing

When nesting lists, indent the nested content so it lines up with the text of the item it belongs to: 4 spaces under a numbered item, 2 spaces under a bullet.

```markdown
1.  Use 2 spaces after the item number, so the text itself is indented 4 spaces.
2.  Use 2 spaces again for the next item.

    Indent a continuation paragraph 4 spaces, aligned with the item text.

- Use 1 space after a bullet, so the text itself is indented 2 spaces.
  1.  Indent a list nested under a bullet 2 spaces.

      A continuation paragraph in a nested list lines up with its item's text, here 6 spaces.

  2.  Looks nice, doesn't it?
- Back to the bulleted list.
```

The following works, but it's very messy:

```text
- Bullet.
     1. Irregular nesting... DO NOT DO THIS.
```

Even when there's no nesting, align continuation paragraphs and code blocks with the item text:

```markdown
- Foo.

  A second paragraph, indented 2 spaces.

1.  Two spaces for the list item.

    A second paragraph, indented 4 spaces.

2.  Back to 2 spaces.
```

However, when a numbered list is small, not nested, and each item is a single short line, one space after the number can suffice:

```markdown
1. Foo.
2. Bar.
```

# README from the team template

Replace the root `README.md` with one built on the team's README template, with `[SCREENSHOT]` placeholders where screenshots go and an issue that tracks capturing them.

Contents:

1.  [Context](#context)
1.  [Decisions](#decisions)
1.  [Steps](#steps)
1.  [Checks](#checks)

## Context

The template lives outside the repo at `tool.repository/template.repository/readme/README.md`. Its sections, in order: a centered banner with the name, a one-line description, three links, and tech badges; a collapsible table of contents; About The Project with Screenshots, How It Works, Features, Architecture, and Tech Stack; Getting Started with Prerequisites and Installation; Roadmap; Team; License; and Acknowledgments. Every section ends with a back-to-top link. Its Architecture section asks for a [tt-a1i/archify](https://github.com/tt-a1i/archify) diagram customized with the project's design system.

The user asked to ignore the current README and remove it, so its text isn't carried over. The PRD still sets what the README must hold for judges: the logline and the evaluation's table with its date, model pin, and commit (SUBMIT-2, EVAL-3, EVAL-6); setup from a Mac with Xcode 27, the Simulator path by typing a partner line, the Test Store purchase, the privacy notice, and running the relay and the evaluation with one's own keys (SUBMIT-2); and no name for the model or its provider, only "a hosted decision model" (SUBMIT-6). The new README fits each of these into a template section, drawing on the source, [product](/docs/PRODUCT.md), the [PRD](/docs/PRD.md), and the [evaluation report](/eval/results.md).

The Turn v2 redesign (plan [0044](/docs/plans/0044-turn-v2-redesign.md), issue #166) is still landing, so screenshots taken today would go stale. The README uses `[SCREENSHOT]` placeholders, and the issue says to capture them once v2 lands.

## Decisions

1.  **Template structure, Turn content.** Every template section stays, in its order, with its anchors and back-to-top links. The template's placeholder badges become Turn's stack: Expo, React Native, TypeScript, Swift, Cloudflare Workers, RevenueCat, and Bun. Paths in the README have no leading slash, since GitHub resolves those in HTML against github.com.
2.  **Where the PRD's content goes.** About The Project holds the logline and the evaluation's table. How It Works holds the judge's Simulator path and the Test Store purchase. Features names the privacy notice. Getting Started holds the Mac setup, the source build, and running the relay and evaluation with one's own keys.
3.  **Banner.** The existing hero images in `assets/pitch/` become the banner, as a `<picture>` with light and dark sources, as [pitch assets](/docs/pitch-assets.md) intended. They're artwork, not screenshots, so they stay; the issue notes that their phone mockups show v1.
4.  **Placeholders.** The Screenshots table and each How It Works step hold the literal text `[SCREENSHOT]`, each in a uniquely named cell or step. The issue lists every placeholder as a task with its location, screen, state, and appearance. `readme-aha.gif` shows v1, so How It Works uses a placeholder instead.
5.  **Architecture diagram.** An archify `architecture` candidate, traced from source at commit `931c68c`, passes `finalize` at the showcase profile, using the skill at `.agents/skills/archify` in the main checkout. Its SVG export is re-tinted with the app's color tokens from `app/src/constants/theme.ts` and the system font stack, and its embedded font is removed. Two files, `assets/readme/architecture-light.svg` and `assets/readme/architecture-dark.svg`, go in a `<picture>` like the banner, so the diagram follows GitHub's theme without relying on media queries inside an image. The candidate, viewer, and scripts stay out of the repo; the variable-to-token map is below.
6.  **Links.** The banner links go to the Simulator preview release, the privacy notice, and the evaluation report. Roadmap and Team point at `M1KUAPP/Turn`. The existing `LICENSE` stays as it is.
7.  **The issue** is created before the pull request, labelled `documentation` and `ready-for-human`, with `Blocked by: #166`. The pull request says `Refs #<issue>`, so merging it doesn't close the issue.

The tint maps archify's variables to Turn's tokens: background and label masks to `board`; grid and panel borders to `hairline`; text to `ink` and `ink-secondary`; arrows and lane strokes to `edge`; the emphasis arrow to `accent`; frontend to `accent-soft` and `accent`; backend to the health category; database to the family category; cloud to `listen-soft` and `listen`; security to `no-fill` and `no-edge`; message bus to the food category; and external to `unsure-fill` and `unsure-edge`.

## Steps

1.  This plan.
2.  The archify candidate, `finalize`, and the tinted light and dark SVGs.
3.  The new `README.md`, replacing the old one.
4.  The screenshots issue, then the pull request.

## Checks

1.  `finalize architecture <candidate> <html> --repo-root . --quality showcase --json` exits 0 with every gate `pass`.
2.  Each SVG passes `xmllint --noout`, `rg -c 'data:font|@font-face|JetBrains'` finds nothing, and each is under 100 KB. Rendered in Chrome as an `<img>`, every visible fill and stroke is a `theme.ts` token of that appearance; a screenshot of each is inspected.
3.  `rg -i 'jev|typesafe' README.md assets/readme` finds nothing.
4.  The README's `##` and `###` headings match the template's, in order. `rg -n 'owner/repo|RepoName|RepoDesc|path-to-banner|^_[^_]+_$|href="#"|Live Demo|Next\.js|Vue|Angular|Svelte|Laravel|Bootstrap|jQuery' README.md` finds nothing.
5.  `rg -o '\[SCREENSHOT\]' README.md | wc -l` equals the number of task items in the issue.
6.  Every relative `href`, `src`, `srcset`, and Markdown link target resolves to a file in the repo; every `#anchor` matches a heading slug or an `id`; every `<img>` has a non-empty `alt`.
7.  Every command in the README's code blocks names a script, file, or flag that exists: `bun run eval` and its `--unnamed` and `--out` flags, `worker/.dev.vars.example`, `app/.env.example`, and the release asset `Turn.app.zip` (`gh release view v0.1.0-preview.1`).
8.  `bun run lint` exits 0.
9.  After the push, `gh api markdown` renders the README with its `<picture>`, `<source>`, and `<details>` elements intact.

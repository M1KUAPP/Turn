# Frontend trends research notes

Where the DESIGN.md convention comes from and how agents use it, what AI UI
generators and component and motion libraries offer in September 2026, and which
visual trends Apple, Google, Figma, Framer, and Webflow name for 2025 and 2026.
These notes fed Guessling's design system and art direction, now the
[archived Guessling design](/docs/archive/guessling-design.md); every source was
read on September 22, 2026, so versions, prices, and features are as of that
date, and judgment starts with "Synthesis:". motionsites.ai itself has its own
[research notes](/docs/research/motionsites.md).

Contents:

1.  [Sources and method](#sources-and-method)
1.  [The DESIGN.md convention](#the-designmd-convention)
    1.  [Where DESIGN.md comes from](#where-designmd-comes-from)
    1.  [Sections and tokens in the specification](#sections-and-tokens-in-the-specification)
    1.  [How agents are meant to use DESIGN.md](#how-agents-are-meant-to-use-designmd)
    1.  [VoltAgent's awesome-design-md](#voltagents-awesome-design-md)
    1.  [Taste Skill](#taste-skill)
    1.  [Anthropic's frontend-design skill](#anthropics-frontend-design-skill)
    1.  [What each source tells an agent to do and ban](#what-each-source-tells-an-agent-to-do-and-ban)
    1.  [A DESIGN.md that follows this repo's style guide](#a-designmd-that-follows-this-repos-style-guide)
1.  [AI UI generators in September 2026](#ai-ui-generators-in-september-2026)
    1.  [Google Stitch](#google-stitch)
    1.  [Vercel v0](#vercel-v0)
    1.  [Lovable](#lovable)
    1.  [Bolt.new](#boltnew)
    1.  [Figma Make](#figma-make)
    1.  [Framer AI](#framer-ai)
    1.  [Aura.build](#aurabuild)
    1.  [Magic Patterns](#magic-patterns)
    1.  [21st.dev and its MCP server](#21stdev-and-its-mcp-server)
    1.  [Relume](#relume)
1.  [Component and motion libraries](#component-and-motion-libraries)
    1.  [Component kits for the web](#component-kits-for-the-web)
    1.  [Animation libraries for the web](#animation-libraries-for-the-web)
    1.  [Animation formats with native players](#animation-formats-with-native-players)
    1.  [3D and shader tools](#3d-and-shader-tools)
    1.  [What Expo SDK 57 already bundles](#what-expo-sdk-57-already-bundles)
1.  [Visual design trends in 2025 and 2026](#visual-design-trends-in-2025-and-2026)
    1.  [Apple's Liquid Glass](#apples-liquid-glass)
    1.  [Google's Material 3 Expressive](#googles-material-3-expressive)
    1.  [Figma, Framer, and Webflow](#figma-framer-and-webflow)
    1.  [Trend by trend](#trend-by-trend)
    1.  [Critiques of AI-generated sameness](#critiques-of-ai-generated-sameness)
1.  [Findings for DESIGN.md](#findings-for-designmd)
1.  [Conflicts between sources](#conflicts-between-sources)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## Sources and method

- **First parties.** Google's blog, Stitch's docs, and Google Labs' GitHub
  repositories for DESIGN.md; the VoltAgent, Taste Skill, and Anthropic
  repositories through the GitHub API, with the copies in `.agents/skills/`;
  each generator's and library's own site, docs, pricing page, changelog,
  repository, and npm entry; Apple's Newsroom, Human Interface Guidelines, and
  developer docs; Google's blog and Material site; and Figma's, Framer's, and
  Webflow's own blogs. Galleries, listicles, and trend blogs appear only where
  labeled "Commentary".
- **No web search.** The session's search allowance ran out early, so pages were
  found through the sites' own sitemaps, navigation, and changelogs, the GitHub
  API, and the npm registry.
- **Stitch's docs.** stitch.withgoogle.com draws its docs in a frame from
  `app-companion-430619.appspot.com`, so the static pages under
  `/docs/<page>/index.html` there were read directly. The What's new list and
  in-app text come from the JavaScript that Stitch served on September 22, 2026.
- **Apple's guidelines.** The Human Interface Guidelines pages were read through
  the JSON that developer.apple.com's page viewer loads.
- **Tested, not only read.** Version 0.4.0 of Google's `@google/design.md` CLI
  was run on sample files in a scratch folder outside this repo, and the samples
  also went through the `check_md.py` of the plans'
  [verification gate](/docs/plans/2026-09-22-guessling-product-prd-trd.md#verification-gate).

## The DESIGN.md convention

### Where DESIGN.md comes from

- **Google introduced it with Stitch.** Google's post of March 18, 2026, on the
  redesigned Stitch says you can "use the new DESIGN.md — an agent-friendly
  markdown file — to export or import your design rules to or from other design
  and coding tools" ([stitch-blog-mar]). The What's new list in the code Stitch
  served on September 22, 2026, dates "Meet the new Stitch" to "18 MAR" and
  describes it as "AI-native canvas, smarter design agent, voice, instant
  prototypes, design systems, DESIGN.md, and more" ([stitch-whats-new]).
- **Opened as a draft standard.** On April 21, 2026, Google Labs wrote: "Today,
  we’re open-sourcing the draft specification for DESIGN.md, so it can be used
  across any single tool or platform. Instead of guessing intent, AI agents can
  know exactly what a color is for, and can validate their choices against WCAG
  accessibility rules." ([stitch-blog-apr]) The specification lives in
  `google-labs-code/design.md`, created April 10, 2026, under Apache-2.0, which
  describes itself as "A format specification for describing a visual identity
  to coding agents" ([gdm-repo]).
- **Status on September 22, 2026.** "The DESIGN.md format is at version `alpha`.
  The spec, token schema, and CLI are under active development. Expect changes
  to the format as it matures." ([gdm-repo]) The CLI, `@google/design.md`, was
  first published on npm on April 21, 2026, as version 0.1.0; its latest
  is 0.4.0, published July 27, 2026 ([gdm-npm]).
- **An earlier, prose-only form.** Google's Stitch skills repository added a
  `design-md` skill on January 22, 2026 ("feat: add DESIGN.md skill (#3)"). It
  asks an agent to "synthesize a 'Semantic Design System' into a file named
  `DESIGN.md`" with five numbered sections and no tokens
  ([stitch-skills-first]), and the current copy still does
  ([stitch-skill-design-md]). The repository says "This is not an officially
  supported Google product." ([stitch-skills])
- **Commentary.** VoltAgent's collection calls DESIGN.md "a new concept
  introduced by Google Stitch" ([volt-readme]). Google's own pages above bear
  that out.

[stitch-blog-apr]: https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/
[gdm-npm]: https://www.npmjs.com/package/@google/design.md
[stitch-skills-first]: https://github.com/google-labs-code/stitch-skills/blob/f66e8c54c321963c184b2fa59c100190c5e3a852/design-md/SKILL.md
[stitch-skills]: https://github.com/google-labs-code/stitch-skills

### Sections and tokens in the specification

- **Two layers.** "A DESIGN.md file combines machine-readable design tokens
  (YAML front matter) with human-readable design rationale (markdown prose).
  Tokens give agents exact values. Prose tells them _why_ those values exist and
  how to apply them." ([gdm-repo])
- **Tokens.** The schema has `version` (currently `"alpha"`), `name`,
  `description`, `omitted`, `colors`, `typography`, `rounded`, `spacing`, and
  `components`. A dimension is "a string with a unit suffix. Valid units are:
  px, em, rem", a reference looks like `{colors.primary}`, and a component takes
  `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`,
  `height`, and `width` ([gdm-spec]).
- **Section order.** "Sections use `##` headings. They can be omitted, but those
  present must appear in this order": Overview (alias "Brand & Style"), Colors,
  Typography, Layout (alias "Layout & Spacing"), Elevation & Depth (alias
  "Elevation"), Shapes, Components, and Do's and Don'ts ([gdm-repo]). "An
  optional `#` heading may appear for document titling purposes but is not
  parsed as a section." ([stitch-dmd-spec])
- **Open to extension.** An unknown section heading is to be preserved ("do not
  error"), while a duplicate one is an "Error; reject the file" ([gdm-spec]).
  The spec "leaves open the categories where flexibility helps more: motion,
  iconography, elevation, text casing, paragraph measure", and its philosophy
  page shows a custom `## Motion` section with its own `motion:` tokens
  ([gdm-philosophy]).
- **Prose over values.** "The quality of a generated design is determined less
  by the precision of its values than by how clearly the intent is described."
  And: "Adjectives describe a region. A specific reference describes a point."
  ([gdm-philosophy])
- **Don'ts.** "An intentional list of 'don'ts' is useful. A long rambling list
  is often a sign the description was too vague to carry them."
  ([gdm-philosophy])
- **The CLI.** `lint` runs eleven rules, among them `broken-ref` (an error),
  `contrast-ratio` for "Component `backgroundColor`/`textColor` pairs below WCAG
  AA minimum (4.5:1)", and `section-order`. `export` writes a Tailwind v3
  `theme.extend` object, a Tailwind v4 `@theme` block, or W3C DTCG
  `tokens.json`; `spec` prints the specification, "useful for injecting spec
  context into agent prompts" ([gdm-repo]).

### How agents are meant to use DESIGN.md

- **Next to AGENTS.md.** Stitch's docs call DESIGN.md "A design system document
  that AI agents read to generate consistent UI across your project" and "the
  design counterpart to AGENTS.md": AGENTS.md is for coding agents and says "How
  to build the project"; DESIGN.md is for design agents and says "How the
  project should look and feel" ([stitch-dmd-overview]).
- **What an agent does with it.** "When a design agent like Stitch reads your
  DESIGN.md, every screen it generates follows the same visual rules: your color
  palette, your typography, your component patterns." It "is a living artifact,
  not a static config file. It evolves as your design evolves. The agent
  generates it, you refine it, and it’s re-applied to screens as you iterate."
  ([stitch-dmd-overview])
- **Three ways to write one.** "Let the agent generate it" from a described
  vibe, "Derive from branding" from a URL or image, or "Write it by hand"
  ([stitch-dmd-overview]).
- **Carrying it to code.** "When you export a project, the DESIGN.md file is
  included in the zip alongside the generated screens", and "The exported
  DESIGN.md is a standalone document. It doesn’t depend on Stitch to be useful."
  ([stitch-dmd-usage]) Stitch's own tips read "Download DESIGN.md to use your
  design system in other AI coding tools" and "Import your DESIGN.md to start
  with a design system in Stitch" ([stitch-canvas-code]).
- **From an existing codebase.** "Copy this prompt into any coding agent
  (Gemini, Claude Code, Cursor, Antigravity) from a project directory." Its
  output "is a DESIGN.md you can drop into .stitch/DESIGN.md and immediately use
  for screen generation", and an `extract-design-md` skill does the same job
  ([stitch-dmd-import]).
- **Where the file lives.** Stitch's skills use `.stitch/DESIGN.md`
  ([stitch-dmd-import]); VoltAgent says "Drop it into your project root"
  ([volt-readme]). The CLI takes any path ([gdm-repo]).
- **Motion is left to the coding agent.** Taste Skill's Stitch template notes:
  "Stitch generates static screens — it does not animate. This section documents
  the **intended motion behavior** so that the coding agent (Antigravity,
  Cursor, etc.) knows exactly how to implement animations"
  ([local-stitch-design]). Stitch's What's new entry of May 19, 2026, "Google
  I/O: 5 Major Upgrades", lists "motion on canvas" ([stitch-whats-new]).
- **Vercel's version.** Vercel keeps a lowercase `design.md` as "one public file
  any agent can load". A prose-only first draft failed: "every model reading it
  interpreted that description differently, generating vastly different pages
  from the same guidance." So Vercel added a public stylesheet, "because agents
  kept inventing their own typography, spacing, and layout", and an evaluation
  loop. In its test, pages built with the file had 39 known failures against 91
  without, "57% fewer in this test", with the caveat that "Six pages is also far
  too small a sample" ([vercel-designmd]).

[stitch-canvas-code]: https://app-companion-430619.appspot.com/assets/CanvasV3-DN9gQsiX.js
[stitch-dmd-import]: https://stitch.withgoogle.com/docs/design-md/get-instructions/

### VoltAgent's awesome-design-md

- **What it is.** "A collection of DESIGN.md files analysis by popular brand
  design systems. Drop one into your project and let coding agents generate a
  matching UI." It was created on March 31, 2026, is MIT-licensed, had 117,127
  GitHub stars on September 22, 2026, and its README lists 73 files
  ([volt-readme]).
- **How to use it.** "Copy a DESIGN.md into your project, tell your AI agent
  “build me a page that looks like this,” and generate high-quality UI that
  stays visually consistent with the design language." ([volt-readme])
- **Sections the README promises.** "Every file follows the Stitch DESIGN.md
  format with extended sections": "Visual Theme & Atmosphere", "Color Palette &
  Roles", "Typography Rules", "Component Stylings", "Layout Principles", "Depth
  & Elevation", "Do's and Don'ts", "Responsive Behavior", and "Agent Prompt
  Guide", with a `preview.html` and a `preview-dark.html` beside each file
  ([volt-readme]).
- **Sections the files use.** The Apple and Claude files open with YAML front
  matter (`version: alpha`, then `colors`, `typography`, `rounded`, `spacing`,
  and `components`) and use the headings "Overview", "Colors", "Typography",
  "Layout", "Elevation & Depth", "Shapes", "Components", "Do's and Don'ts",
  "Responsive Behavior", "Iteration Guide", and "Known Gaps" ([volt-apple];
  [volt-claude]). The Apple file still had the nine numbered README headings,
  from "## 1. Visual Theme & Atmosphere" to "## 9. Agent Prompt Guide", on April
  6, 2026 ([volt-apple-0406]); by May 1, 2026, it had the specification's.
- **What the files are.** "The extracted design tokens represent publicly
  visible CSS values. We do not claim ownership of any site's visual identity."
  ([volt-readme])

[volt-claude]: https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/claude/DESIGN.md
[volt-apple-0406]: https://github.com/VoltAgent/awesome-design-md/blob/80bbbc23ea94939ceda7ad74dd844224f07dcb9e/design-md/apple/DESIGN.md

### Taste Skill

- **What it is.** "Taste-Skill - gives your AI good taste. stops the AI from
  generating boring, generic slop" (the repository's description; MIT; 89,094
  stars; last pushed September 20, 2026). Its README offers "Portable **Agent
  Skills** that upgrade AI-built interfaces: stronger layout, typography,
  motion, and spacing instead of boilerplate-looking UIs." ([taste-readme])
- **Versions.** "The default `taste-skill` (install name
  `design-taste-frontend`) is now **v2 (experimental)**, a substantial rewrite
  of the original v1." ([taste-readme]) The copies in `.agents/skills/` matched
  the upstream files byte for byte on September 22, 2026.
- **Its Stitch skill.** `stitch-design-taste` "generates `DESIGN.md` files
  optimized for Google Stitch screen generation" as "the **single source of
  truth**" ([local-stitch-skill]). Its template's headings are "# Design System:
  [Project Title]", then "## 1. Visual Theme & Atmosphere", "## 2. Color Palette
  & Roles", "## 3. Typography Rules", "## 4. Component Stylings", "## 5. Layout
  Principles", "## 6. Motion & Interaction", and "## 7. Anti-Patterns (Banned)".
  Its sample DESIGN.md adds "Configuration — Set Your Style" dials, "5. Hero
  Section", and "7. Responsive Rules", for nine numbered sections
  ([local-stitch-design]). Google's Stitch skills repository carries a variant,
  `taste-design`, added by Taste Skill's author on March 30, 2026, with the
  dials changed to "Creativity 9, Density 5" and bans on fabricated data added
  ([stitch-skill-taste]).
- **The default skill, v2.** It is for "Landing pages, portfolios, and
  redesigns. Not dashboards, not data tables, not multi-step product UI." It
  lists "Native mobile (use Apple HIG / Material directly)" as out of scope. It
  asks for a one-line "Design Read", three dials (`8 / 6 / 4` by default),
  official packages when a brief matches a real design system, React or Next.js
  with Tailwind v4 and Motion, and fonts that are self-hosted: "Never link
  Google Fonts via `<link>` in production." ([local-taste-v2])
- **What v2 bans.** Defaults such as "AI-purple gradients, centered hero over
  dark mesh, three equal feature cards, generic glassmorphism on everything,
  infinite-loop micro-animations everywhere, Inter + slate-900"; every em dash
  ("zero em-dashes"); `Fraunces` and `Instrument_Serif` as default serifs; and
  scroll cues. Reduced motion and dark mode are "mandatory", and "There is no
  official `liquid-glass.css`" ([local-taste-v2]).
- **The other skills.** `high-end-visual-design` bans "Inter, Roboto, Arial,
  Open Sans, Helvetica" and "Standard `linear` or `ease-in-out` transitions",
  and requires "Double-Bezel" cards ([local-soft]). `minimalist-ui` bans
  gradients and "3D glassmorphism (beyond subtle navbar blurs)" and targets
  `'SF Pro Display'` with an editorial serif ([local-minimal]). `gpt-taste` says
  "Static interfaces are strictly forbidden. You must write real GSAP"
  ([local-gpt]). `redesign-existing-projects` calls the "Purple/blue 'AI
  gradient' aesthetic" "the most common AI design fingerprint" and prescribes
  "subtle noise, grain, or micro-patterns" for flat surfaces ([local-redesign]).

[taste-readme]: https://github.com/Leonxlnx/taste-skill
[local-soft]: /.agents/skills/high-end-visual-design/SKILL.md

### Anthropic's frontend-design skill

- **The current skill.** Updated on September 3, 2026 ("Update frontend-design
  skill to avoid generic design defaults (#1713)"), it offers "Guidance for
  distinctive, intentional visual design when building new UI or reshaping an
  existing one", under Apache-2.0 ([anth-fd]; [anth-fd-license]).
- **What it asks for.** Start from the subject: "The subject's industry, subject
  matter, materials, and vernacular are where distinctive visual choices come
  from". Use "one family or two" typefaces and "line lengths of less than 80
  characters". Plan in two passes, with "a compact token system with color,
  type, layout, and principles" and "4–6 named hex values", then check the plan
  for generic defaults. "Spend your boldness in one place." Keep a "quality
  floor": "responsive down to mobile, visible keyboard focus, reduced motion
  respected, visually accessible, harmonious color palettes." Write copy with
  "plain verbs, sentence case, no filler" ([anth-fd]).
- **What it flags.** "Accenting just a single word or phrase in a headline, like
  putting one word in italic/bold or a different color", "Using all caps for
  labels", and "Adding unnecessary typographic labels above content". On motion:
  "fade-and-slide-up entrances on each section and hover transitions on every
  card are the generic default and read as AI-generated". It lists five looks
  that "AI-generated design right now clusters around": a warm cream background
  with a serif display and a terracotta accent "(often near #D97757 —
  Anthropic's own Claude-interaction accent, so on a user's brief it reads as a
  tell)"; a near-black background with one acid-green or vermilion accent; a
  broadsheet layout; "the SaaS-card kit"; and "template chrome", which includes
  "tinted near-black (#0B0B0B, #111) standing in for black". "The brief's own
  words always win" ([anth-fd]).
- **"AI slop" in earlier versions.** The skill of December 4, 2025, opened by
  promising interfaces "that avoid generic "AI slop" aesthetics" and said "NEVER
  use generic AI-generated aesthetics like overused font families (Inter,
  Roboto, Arial, system fonts), cliched color schemes (particularly purple
  gradients on white backgrounds)" ([anth-fd-2025]). The version of June 9,
  2026, dropped the phrase and the font bans for three "looks"
  ([anth-fd-2026-06]); the current one has five.
- **Anthropic's reasoning.** Its post of November 12, 2025: "when you ask an LLM
  to build a landing page without guidance, it will almost always conform to
  Inter fonts, purple gradients on white backgrounds, and minimal animations."
  The cause: "Distributional convergence." Its sample prompt says "Never use:
  Inter, Roboto, Open Sans, Lato, default system fonts", "Load from Google
  Fonts", and "In frontend design,this creates what users call the "AI slop"
  aesthetic." ([anth-blog])

[anth-fd-license]: https://github.com/anthropics/skills/blob/main/skills/frontend-design/LICENSE.txt
[anth-fd-2026-06]: https://github.com/anthropics/skills/blob/2235be7c60b551f5de82ade908fd3816455afcda/skills/frontend-design/SKILL.md

### What each source tells an agent to do and ban

| Source                            | Tells the agent to                                               | Bans or flags                                                          |
| --------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| DESIGN.md specification           | Pair tokens with prose; name a specific reference                | Broken token references; text under 4.5:1; duplicate sections          |
| VoltAgent's files                 | Copy a brand's file and build "a page that looks like this"      | Each brand's own "Don't" list                                          |
| `stitch-design-taste`             | Encode mood, one accent, font stacks, springs, and a banned list | Inter, generic serifs, pure black, purple neon, centered heroes, emoji |
| `design-taste-frontend` v2        | State a design read and dials; use official systems              | Em dashes, Inter by default, AI purple, Fraunces, scroll cues          |
| `high-end-visual-design`          | Pick a vibe and layout archetype; nested "Double-Bezel" cards    | Inter, Roboto, Arial, Open Sans, Helvetica; Lucide; linear easing      |
| `minimalist-ui`                   | Warm monochrome, serif display, flat bento grids, muted pastels  | Inter, Roboto, Open Sans; Lucide; gradients; heavy shadows             |
| `gpt-taste`                       | Randomize layouts; follow AIDA; use GSAP ScrollTrigger           | Inter; static pages; labels like "SECTION 01"                          |
| `redesign-existing-projects`      | Audit first, then fix fonts, color, states, and layout           | Inter everywhere; purple-blue gradients; surfaces with no texture      |
| Anthropic's skill, September 2026 | Ground in the subject; 4–6 named hex values; one bold element    | Five generated looks; one-word accents; all-caps labels                |
| Anthropic's post, November 2025   | Steer typography, theme, motion, and backgrounds                 | Inter, Roboto, Open Sans, Lato, system fonts; purple on white          |

- **Shared ground.** Nearly all of them ask for one committed direction instead
  of defaults and for a single accent or a small palette. The specification,
  Taste Skill's v2, and Anthropic's skill also ask for WCAG AA contrast and
  respect for reduced motion.
- **Where they part.** The lists contradict each other on the details (see
  [Conflicts between sources](#conflicts-between-sources)). Some of Taste
  Skill's cures, a near-black such as `#0a0a0a`, italic emphasis inside a
  headline, and `minimalist-ui`'s warm off-white under a serif display, are
  close to looks Anthropic's current skill flags as tells, and Google's own
  example DESIGN.md sets its body text in Inter ([stitch-dmd-overview]).
- **Scope.** All of them are written for the web: Taste Skill's default skill
  calls native mobile out of scope ([local-taste-v2]), Anthropic's talks of "web
  designs", "the hero", and CSS selectors ([anth-fd]), and the DESIGN.md CLI
  exports only web formats ([gdm-repo]). None mentions a game or a character.

### A DESIGN.md that follows this repo's style guide

- **One H1 and a Contents list.** The specification allows an optional title
  heading that "is not parsed as a section" ([stitch-dmd-spec]), and the parser
  keeps any text before the first `##` as a prelude ([gdm-parser]), so an H1, an
  introduction, and a `Contents:` list fit.
- **Sentence case.** The CLI matches section names and aliases exactly
  ([gdm-config]). "Overview", "Colors", "Typography", "Layout", "Shapes",
  "Components", and the alias "Elevation" are already sentence case; "Do's and
  don'ts" is read as an unknown section, which is preserved without an error but
  left out of the order check.
- **Tokens without front matter.** The `check_md.py` of the plans' verification
  gate ([plan-gate]) reads a front matter's closing `---` as a setext heading,
  and long YAML lines count against 80 columns. The CLI also reads tokens from
  fenced `yaml` blocks; with neither, it reports "No YAML content found.
  Expected frontmatter (---) or fenced yaml code blocks." ([gdm-parser])
  Google's philosophy page itself puts a `colors:` block inside `## Colors`
  ([gdm-philosophy]).
- **Tested.** A sample with an H1, a `Contents:` list, sentence-case sections, a
  custom `## Motion` section, and tokens only in fenced `yaml` blocks passed
  `bunx @google/design.md@0.4.0 lint` with 0 errors and 0 warnings, drew a
  `contrast-ratio` warning ("2.80:1, below WCAG AA minimum of 4.5:1") when a
  weak pair was planted, and passed `check_md.py` with `--contents`. The same
  tokens as front matter failed `check_md.py` at the closing `---`.
- **Units and export.** Dimensions accept only `px`, `em`, and `rem`
  ([gdm-spec]), and `export` targets Tailwind and DTCG, not React Native
  ([gdm-repo]).
- Synthesis: A DESIGN.md can meet this repo's style with the eight specification
  sections under sentence-case names, tokens in fenced `yaml` blocks inside the
  sections they describe, and custom sections for what the specification leaves
  open. The app's theme file then mirrors the tokens, reading `px` as points,
  and the CLI's contrast check can guard the 4.5:1 floor the TRD already sets.

[gdm-config]: https://github.com/google-labs-code/design.md/blob/main/packages/cli/src/linter/spec-config.yaml
[plan-gate]: /docs/plans/2026-09-22-guessling-product-prd-trd.md#verification-gate

## AI UI generators in September 2026

Prices are as each pricing page showed them on September 22, 2026, to a reader
who may be outside the US; several pages default to yearly billing.

| Tool           | What it generates                                         | Design-system input                               | Export                                                  | Native mobile         | Lowest paid plan                          |
| -------------- | --------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------- | --------------------- | ----------------------------------------- |
| Google Stitch  | App and web screens as HTML with Tailwind, and images     | DESIGN.md; themes; a design system from a URL     | Figma; a zip with DESIGN.md; MCP; SDK; other tools      | No; HTML to translate | None; free with daily credits             |
| Vercel v0      | Full-stack web apps in Next.js, React, and shadcn/ui      | Design Systems 2.0, saved as a skill; Figma       | GitHub sync; ZIP; Vercel; MCP                           | No                    | Plus, $30 a user a month                  |
| Lovable        | Web apps; TanStack Start by default since May 13, 2026    | Design systems built as React components          | Two-way GitHub sync; download; hosting; MCP             | No                    | Pro, $25 a month                          |
| Bolt.new       | Web apps, and mobile apps through Expo                    | Chakra, Material UI, Shadcn, or your own on Teams | Download; GitHub; Bolt Cloud or Netlify; EAS for stores | Yes, Expo             | Pro, $25 a month                          |
| Figma Make     | Prototypes and web apps in React on Vite                  | Make kits and `Guidelines.md`                     | Published URL; code zip; one-way GitHub push; layers    | No                    | Professional Full seat, $16 a month       |
| Framer         | Hosted websites, and React code components                | The site's own styles and components              | Framer hosting; no site code export found               | No                    | Basic, $10 a month                        |
| Aura.build     | Landing pages in HTML, Tailwind, and JavaScript, or React | DESIGN.md import and a DESIGN.md library          | HTML; Figma; MCP; publishing                            | No                    | Pro, $12.50 a month billed yearly         |
| Magic Patterns | Prototype web apps in React 18 and Tailwind v3            | Import from GitHub, npm, Figma, or a website      | Zip; two-way GitHub sync; Figma; MCP                    | No                    | Starter, $17 a seat a month billed yearly |
| 21st.dev       | React, Tailwind, and shadcn/ui components                 | The project's design context and themes           | Copied code; MCP server; CLI                            | No; icons only        | Builder, $6 a month billed yearly         |
| Relume         | Sitemaps, wireframes, and style guides                    | Style guide tokens                                | Figma; Webflow; React, as unstyled wireframes           | No                    | Starter, from $18 a month                 |

- Synthesis: Only Bolt.new generates a React Native app itself, through Expo;
  Google's Stitch skills can convert Stitch's HTML in a coding agent. Only
  Stitch and Aura read DESIGN.md. Every other output is a web stack, so for
  Guessling these tools can sketch screens and try styles, not supply the app's
  code.

### Google Stitch

- **What it is.** "Google Stitch is an AI-native software design canvas
  developed by Google Labs", which turns "natural language prompts, hand-drawn
  wireframes, or screenshots into fully editable user interfaces and
  production-ready front-end code" and "generates clean, semantic HTML and CSS
  (including Tailwind support)" ([stitch-home]). It launched on May 20, 2025
  ([stitch-launch]) and became an "AI-native software design canvas" on March
  18, 2026 ([stitch-blog-mar]).
- **App or web.** "When you start a project, Stitch asks you to make a choice:
  App or Web." App mode "Optimizes for vertical scrolling, bottom-aligned
  navigation (thumb zones), and stacked content." ([stitch-devices])
- **Output.** "Every Stitch screen produces two downloadable artifacts: an HTML
  file (a complete document with inline Tailwind CSS) and a screenshot image."
  ([stitch-sdk-artifacts]) "It’s important to understand that the HTML code
  serves as a base for translation. LLMs excel at taking HTML combined with a
  reference image and converting it to other component formats such as React,
  Angular, and Vue, or non-web platforms such as Jetpack Compose, Flutter, and
  SwiftUI." ([stitch-learn])
- **Design systems.** DESIGN.md import, export, and editing (see
  [The DESIGN.md convention](#the-designmd-convention)); the theme editor sets
  "Light or Dark mode appearance, accent color, the corner radius of components,
  and font" ([stitch-learn]).
- **Export.** Figma export as "editable layers" (February 10, 2026), a zip with
  DESIGN.md, an MCP server, and an SDK, `@google/stitch-sdk` 0.3.5 (May
  12, 2026) ([stitch-whats-new]; [stitch-dmd-usage]; [stitch-mcp];
  [stitch-sdk]). On May 19, 2026, Google added a shareable link "via Google AI
  Studio", export "into Google Antigravity", and publishing "to the web directly
  with Netlify" ([stitch-blog-may]).
- **Native mobile.** Google's skills repository has a `react-native` skill,
  added June 2, 2026, that converts "Stitch HTML designs to React Native
  components ... using StyleSheet" and writes tokens to `src/theme.ts`
  ([stitch-skill-rn]).
- **Price.** "Yes, Stitch is currently provided free of charge. It operates on a
  daily credit limit." It "is available in English to users 18+ in countries
  where Gemini is available." ([stitch-home])

[stitch-home]: https://stitch.withgoogle.com/
[stitch-launch]: https://developers.googleblog.com/en/stitch-a-new-way-to-design-uis/
[stitch-devices]: https://stitch.withgoogle.com/docs/learn/device-types/
[stitch-sdk-artifacts]: https://stitch.withgoogle.com/docs/sdk/download-artifacts/
[stitch-learn]: https://stitch.withgoogle.com/docs/learn/overview/
[stitch-mcp]: https://stitch.withgoogle.com/docs/mcp/setup/
[stitch-sdk]: https://github.com/google-labs-code/stitch-sdk
[stitch-blog-may]: https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-updates/
[stitch-skill-rn]: https://github.com/google-labs-code/stitch-skills/blob/main/plugins/stitch-build/skills/react-native/SKILL.md

### Vercel v0

- **What it is.** "v0 is an AI-powered development platform that turns ideas
  into production-ready, full-stack web apps", "with best-in-class expertise in
  Next.js, React, Tailwind CSS, shadcn/ui, and the AI SDK" ([v0-faq]). v0.dev
  now redirects to v0.app.
- **Design systems.** Design Systems 2.0 "lets you teach v0 your design system
  once, so chats can build with your real components, tokens, and conventions";
  "A design system is saved as a skill", built from GitHub repositories, Figma
  frames, links, or attachments ([v0-ds]). The older route is a shadcn registry,
  "a distribution specification designed to pass context from your design system
  to AI Models" ([v0-ds-legacy]). v0's docs don't mention DESIGN.md.
- **Export.** GitHub sync, ZIP download, deploys to Vercel, a Platform API, and
  an MCP server: "The v0 MCP server lets another agent use v0." ([v0-github];
  [v0-mcp])
- **Native mobile.** "v0 has a dedicated iOS app that lets you prompt, generate,
  and iterate on projects directly from your iOS device" ([v0-faq]); that app is
  for using v0, and v0 generates no React Native or SwiftUI.
- **Price.** Free at "$0/month" with "$5 of included monthly credits" and a "7
  message/day limit"; Plus at "$30" "/user/month", shown against a
  struck-through "$90"; Business at "$100/user/month"; Enterprise custom
  ([v0-pricing]).

[v0-faq]: https://v0.app/docs/faqs
[v0-ds]: https://v0.app/docs/design-systems-2
[v0-ds-legacy]: https://v0.app/docs/design-systems-legacy
[v0-github]: https://v0.app/docs/github
[v0-mcp]: https://v0.app/docs/api/v2/guides/mcp-server

### Lovable

- **What it is.** "a full-stack AI development platform for building, iterating
  on, and deploying web applications using natural language" ([lovable-docs]).
  "New Lovable apps created from May 13, 2026 use TanStack Start with
  server-side rendering by default, except on Enterprise plans"; older projects
  use "Lovable's older React + Vite stack", styled with Tailwind CSS
  ([lovable-changelog]).
- **Design systems.** Available "on all paid plans" and working "natively with
  design systems that are implemented as React components"; a release writes
  rule files such as `rules/design-tokens.md`, not a DESIGN.md ([lovable-ds]).
  Figma designs come in through a plugin, the Figma MCP, or a `.fig` upload
  ([lovable-figma]). First messages get "three design directions by default"
  ([lovable-guidance]).
- **Export.** "Export and two-way sync your Lovable project code" with GitHub,
  plus GitLab and Bitbucket, a code download on paid plans, hosting on Lovable
  Cloud, and an MCP server ([lovable-github]).
- **Native mobile.** "Lovable builds **web apps** and publishing always deploys
  to a web URL", and "Lovable does not generate projects in React Native"; it
  suggests prototyping screens in Lovable and rebuilding them in React Native
  ([lovable-publish]).
- **Price.** Free at "$0"; Pro at "$25" a month with "100 monthly credits";
  Business at "$50"; Enterprise priced by volume. "The free plan includes a
  daily grant of 5 build credits (up to 30 a month)" ([lovable-pricing]).

[lovable-docs]: https://docs.lovable.dev/llms.txt
[lovable-changelog]: https://docs.lovable.dev/changelog
[lovable-ds]: https://docs.lovable.dev/features/design-systems
[lovable-figma]: https://docs.lovable.dev/integrations/figma
[lovable-guidance]: https://docs.lovable.dev/features/design-guidance
[lovable-github]: https://docs.lovable.dev/integrations/github
[lovable-pricing]: https://lovable.dev/pricing

### Bolt.new

- **What it is.** "Bolt is an AI-powered builder for websites, web apps, and
  mobile apps." "To build mobile apps, you use the Expo integration." It can
  start from a prompt, a Figma frame, Stitch designs, a GitHub repository, or a
  Lovable import ([bolt-intro]).
- **Mobile.** "When you ask Bolt to create a mobile app, it automatically uses
  Expo to make your app work on multiple platforms", with publishing to "iOS:
  TestFlight (for testing) and the Apple App Store" through the EAS CLI run
  locally. "Projects created for web do not easily switch over to mobile." The
  page names no Expo SDK version ([bolt-expo]).
- **Design systems.** "A design system gives Bolt a set of visual rules to
  follow"; Chakra, Material UI, and Shadcn come built in, and your own system
  needs "a paid Team plan" ([bolt-ds]). Bolt reads files, websites, GitHub,
  Storybook, or npm and "uses them to generate a Storybook inside Bolt"
  ([bolt-ds-add]). Figma import runs through Anima, and Stitch exports arrive
  with "screenshots and page HTML" ([bolt-figma]; [bolt-stitch]).
- **Export.** Download as a zip, GitHub, and hosting on Bolt Cloud or Netlify
  ([bolt-git]).
- **Price.** Free at "$0" with a "300K tokens daily limit"; Pro at "$25" "per
  month" "billed monthly", from 10M tokens a month; Teams at "$30" "per month
  and member"; Enterprise custom ([bolt-pricing]).

[bolt-intro]: https://support.bolt.new/get-started/intro-bolt
[bolt-ds]: https://support.bolt.new/building/design-system/introduction
[bolt-ds-add]: https://support.bolt.new/building/design-system/add-design-system
[bolt-figma]: https://support.bolt.new/integrations/figma
[bolt-stitch]: https://support.bolt.new/integrations/google-stitch
[bolt-git]: https://support.bolt.new/integrations/git
[bolt-pricing]: https://bolt.new/pricing

### Figma Make

- **What it is.** Launched May 7, 2025, as "a new prompt-to-app capability"
  ([figma-make-launch]), Figma Make is "an AI-driven, prompt-to-app tool that
  lets you bring ideas and existing Figma designs to life as interactive apps",
  "available for Full seats on paid plans" ([figma-make-help]). Its main file is
  `App.tsx`, and Make kits set "package.json and vite.config.ts settings"
  ([figma-make-code]; [figma-make-kits]).
- **Design systems.** Make kits bring "npm packages for code context",
  "Variables and styles from published Figma Design libraries", and "Guidelines
  to help Figma Make understand how to use your system's assets"
  ([figma-make-kits]). "When you create something with Make, an empty
  Guidelines.md file is also added", with the tip "More context isn't always
  better. It can confuse the LLM." ([figma-make-guidelines])
- **Export.** Publishing "as a website with a dedicated URL", pasting a preview
  into Figma Design as layers ([figma-make-help]), downloading code as a zip
  ([figma-make-code]), and "a one-way push from Figma Make → GitHub"
  ([figma-make-github]).
- **Native mobile.** None found; Make builds "functional prototypes, web apps,
  and interactive UI" ([figma-make-faq]).
- **Price.** Starter is free with "150 AI credits/day, up to 500 AI credits/mo";
  a Professional Full seat is "$16/mo" with "3,000 AI credits/mo" on annual
  billing; Organization and Enterprise Full seats are "$55/mo" and "$90/mo",
  billed annually ([figma-pricing]).

[figma-make-launch]: https://www.figma.com/blog/introducing-figma-make/
[figma-make-help]: https://help.figma.com/hc/en-us/articles/31304412302231
[figma-make-code]: https://help.figma.com/hc/en-us/articles/33649966245783
[figma-make-kits]: https://help.figma.com/hc/en-us/articles/39241689698839
[figma-make-guidelines]: https://help.figma.com/hc/en-us/articles/33665861260823
[figma-make-github]: https://help.figma.com/hc/en-us/articles/35463818346647
[figma-make-faq]: https://help.figma.com/hc/en-us/articles/31722591905559
[figma-pricing]: https://www.figma.com/pricing/

### Framer AI

- **What it is.** "Framer is an AI website builder for designers and teams",
  "not a design file (use Figma for that) and not an app-codegen tool (use
  Lovable, v0, or Claude Code for that)" ([framer-llms]). "Framer’s AI agent
  creates editable pages, sections, copy, and visuals directly in your project",
  and can "build a code component for your site" ([framer-ai]); code components
  "are React Components" ([framer-code]). External agents such as Claude Code,
  Cursor, and Codex can edit a site, each change on a branch ([framer-agents]).
- **Design systems.** "The agent takes care of colors, fonts, component styles,
  motion and effects across your site." ([framer-agents-home])
- **Export.** Sites are hosted by Framer; no export of a site's code was found
  in the docs read.
- **Native mobile.** None; Framer makes websites.
- **Price.** Free at "$0" with "500 AI credits to try"; Basic at "$10, per
  month"; Pro at "$30, per month"; Enterprise custom; "Additional editors are
  $20 / month" ([framer-pricing]). Its `llms.txt` gives the same plans "as of 30
  Aug 2026 (monthly; yearly billing available)" ([framer-llms]).

[framer-llms]: https://www.framer.com/llms.txt
[framer-ai]: https://www.framer.com/ai/
[framer-code]: https://www.framer.com/developers/components-introduction
[framer-agents]: https://www.framer.com/agents/external/
[framer-agents-home]: https://www.framer.com/agents/
[framer-pricing]: https://www.framer.com/pricing

### Aura.build

- **What it is.** "Aura is an AI website and landing page builder" that "Exports
  standard HTML, Tailwind CSS, vanilla JavaScript, and Figma-ready output", "a
  design-first AI website builder rather than a full-stack app generator"
  ([aura-llms]). React projects arrived in version 1.5.8 (March 30, 2026)
  ([aura-changelog]).
- **DESIGN.md.** Version 1.6.0 (May 4, 2026) added "Import from DESIGN.md,
  templates, and URLs" ([aura-changelog]). Its library lets you "Browse, upload,
  or generate DESIGN.md systems for typography, colors, spacing, components,
  motion, and style rules" and says "A DESIGN.md generator gives the AI stronger
  visual constraints before page generation starts, which helps reduce generic
  layouts"; it showed 725 systems ([aura-systems]).
- **Export.** HTML, Figma, an MCP server that sends "complete HTML or React
  projects to Aura", and publishing with CMS and SEO controls ([aura-mcp];
  [aura-llms]).
- **Native mobile.** None; its mobile preview is a 393-pixel-wide web page
  ([aura-changelog]).
- **Price.** On the default yearly view, "Paid annual plans are 50% off": Free
  at "$0" with "No AI prompts included"; Pro at "$12.50" a month for "120 AI
  prompts/month after trial"; Max at "$25"; Ultra at "$50" ([aura-pricing]).

[aura-llms]: https://www.aura.build/llms.txt
[aura-changelog]: https://www.aura.build/changelog
[aura-mcp]: https://www.aura.build/mcp
[aura-pricing]: https://www.aura.build/pricing

### Magic Patterns

- **What it is.** "Magic Patterns is an AI design tool for product teams. Create
  prototypes with your real design system, hand off to engineering" ([mp-llms]);
  "Every Magic Patterns design is a website" ([mp-faq]). Its code is "React 18 +
  TypeScript, styled with **Tailwind CSS v3** utility classes" with
  `lucide-react` icons and `framer-motion` animations ([mp-skill]).
- **Design systems.** "Our Design Systems feature is what makes Magic Patterns
  fundamentally different from other AI tools": components, type, icons, colors
  "with dark mode and token references", and rules, imported from GitHub, npm,
  Figma, a local folder, or a website ([mp-ds]). No DESIGN.md support was found.
- **Export.** An MCP server, a prompt to copy, an integration skill, a zip,
  "Two-way sync with a GitHub repository", and a Figma plugin ([mp-export]).
- **Native mobile.** None found.
- **Price.** With "Annual (15% off)" selected: Free at "$0"; Starter at "$17" a
  seat a month, "$20" billed monthly, with "1,000 monthly credits"; Business at
  "$85", "$100" monthly; Enterprise custom; "Each additional credit costs $0.02"
  ([mp-pricing]).

[mp-llms]: https://www.magicpatterns.com/docs/llms.txt
[mp-faq]: https://www.magicpatterns.com/docs/documentation/get-started/faq
[mp-skill]: https://www.magicpatterns.com/docs/documentation/exporting/integration-skill
[mp-ds]: https://www.magicpatterns.com/docs/documentation/design-systems/overview
[mp-export]: https://www.magicpatterns.com/docs/documentation/exporting/overview
[mp-pricing]: https://www.magicpatterns.com/pricing

### 21st.dev and its MCP server

- **What it is.** A "Community catalog of 12,000+ hand-crafted React and
  Tailwind CSS components, templates, and component libraries", "one product
  with two actions — Find and Generate", whose components are "React + Tailwind
  CSS + TypeScript, shadcn/ui-compatible" ([21st-llms]).
- **Magic MCP.** "'Magic MCP' is the former name of the 21st MCP. Same tool,
  renamed." ([21st-llms]) Its repository still says "It's like v0, but in your
  Cursor / Claude Code / Windsurf" ([21st-magic-repo]). The server's tools
  include `search`, `get_component`, `generate`, and `get_inspiration`, which is
  "reranked against a project's Design Context (stack, tokens, prior decisions)"
  ([21st-mcp]).
- **Design systems.** A `21st-design-sync` skill reads "the current project's
  shadcn/Tailwind design tokens" and publishes them as a theme ([21st-skills]).
  No DESIGN.md support was found.
- **Native mobile.** None; only icons can be copied "as a React component, SVG,
  Vue or React Native" ([21st-llms]).
- **Price.** Hobby at "$0/mo" with "2 free copies / day"; Builder at "$6/mo
  billed yearly, $8/mo billed quarterly"; Builder with AI credits from "$15" a
  month billed yearly ([21st-pricing]).

[21st-llms]: https://21st.dev/llms.txt
[21st-magic-repo]: https://github.com/21st-dev/magic-mcp
[21st-mcp]: https://21st.dev/mcp.md
[21st-skills]: https://21st.dev/.well-known/skills/index.json
[21st-pricing]: https://21st.dev/pricing.md

### Relume

- **What it is.** "an AI-powered website builder that helps designers and
  developers create sitemaps, wireframes, and full websites faster using AI",
  which "integrates with Webflow, Figma, and React" ([relume-llms]). Its React
  library is "A React + Tailwind component library" with "UI elements based on
  Shadcn UI" ([relume-react]).
- **Design systems.** A style guide of "Colours, typography and spacing tokens"
  ([relume-pricing]); no DESIGN.md support was found.
- **Export.** Figma, Webflow, and React, but "Exporting of the Relume Style
  Guide or Relume Designs is not supported with React export. You will only be
  exporting unstyled wireframes (layouts)" ([relume-react]). A library MCP
  server drops components into a project "as editable React" ([relume-mcp]).
- **Native mobile.** None; Relume makes websites.
- **Price.** The Site Builder's export plans run from Free to Starter "From $18
  / mo", Pro "From $40 / mo", and Team "From $36 / mo (min 3 users)"; publishing
  is Free or Pro "from $14 / month" ([relume-pricing]).

[relume-llms]: https://www.relume.ai/llms.txt
[relume-react]: https://react-docs.relume.io/
[relume-pricing]: https://www.relume.ai/pricing
[relume-mcp]: https://www.relume.ai/relume-library-mcp

## Component and motion libraries

Versions are npm's `latest` tags on September 22, 2026. For the app, what
matters is whether a library runs in React Native 0.86 under Expo SDK 57, whose
`bundledNativeModules.json` pins the native modules `npx expo install` picks
([expo-bundled]).

| Library           | What it is                            | License                               | Version on September 22, 2026             | In React Native             |
| ----------------- | ------------------------------------- | ------------------------------------- | ----------------------------------------- | --------------------------- |
| shadcn/ui         | Components copied in by a CLI         | MIT                                   | `shadcn` CLI 4.21.0, September 4, 2026    | No; a community port exists |
| Magic UI          | Animated copy-paste components        | MIT; Pro sold separately              | No package; added with the shadcn CLI     | No                          |
| Aceternity UI     | Copy-paste components and blocks      | Its own license, not open source      | No package; added with the shadcn CLI     | No                          |
| Motion            | Animation library for the web         | MIT                                   | 13.4.0, September 16, 2026                | No                          |
| GSAP              | Animation library for the web         | Standard "No Charge" GSAP License     | 3.15.0, April 13, 2026                    | No statement found          |
| Lenis             | Smooth scrolling for the browser      | MIT                                   | 1.3.26, August 5, 2026                    | No                          |
| Rive              | Animation editor with native runtimes | Runtimes MIT; editor paid to ship     | `@rive-app/react-native` 0.4.20           | Yes, in a development build |
| Lottie, dotLottie | Open animation format and its package | Players MIT or Apache-2.0             | `lottie-react-native` 7.5.0; SDK pins 7.3 | Yes                         |
| Spline            | 3D and 2D design tool                 | Runtime unlicensed; React wrapper MIT | `@splinetool/runtime` 2.0.55              | Only in a WebView           |
| Unicorn Studio    | WebGL shader and effects tool         | Proprietary                           | `unicornstudio.js` 2.2.14                 | Only in a WebView           |
| React Three Fiber | React renderer for three.js           | MIT                                   | 9.7.0, July 31, 2026                      | Yes, through `expo-gl`      |

### Component kits for the web

- **shadcn/ui.** "shadcn/ui is a set of beautifully-designed, accessible
  components and a code distribution platform" and "This is not a component
  library. It is how you build your component library." ([shadcn-docs]) MIT
  ([shadcn-license]). The `shadcn` CLI was at 4.21.0 (September 4, 2026). Its
  CLI v4 (March 6, 2026) added presets: "A preset packs your entire design
  system config into a short code. Colors, theme, icon library, fonts, radius."
  ([shadcn-cli-v4]) Since "July 2026 - Base UI as the Default", "New projects
  now use Base UI by default. Radix is still fully supported."
  ([shadcn-changelog]) It is "Available for Next.js, Vite, Laravel, React
  Router, Astro, and TanStack Start." ([shadcn-install]) React Native Reusables,
  a separate project, is "Bringing shadcn/ui to React Native" ([rnr]).
- **Magic UI.** "150+ free and open-source animated components and effects built
  with React , Typescript , Tailwind CSS , and Motion", "that you can copy and
  paste into your web apps" ([magicui]; [magicui-docs]). MIT ([magicui-repo]).
  It installs through the shadcn CLI and has an MCP server; Magic UI Pro is
  "Individual License - Lifetime Access $199 one-time payment" ([magicui-pro]).
- **Aceternity UI.** "200+ production-ready components, blocks and templates
  built with React, Tailwind CSS and Motion. Copy, paste, customize"
  ([aceternity]). Its license is its own: "The Aceternity License provides you
  with an ongoing, non-exclusive, worldwide license to use the digital work"
  ([aceternity-licence]). Components install with the shadcn CLI, and the
  pricing page showed Annual Access at $169, Lifetime at $199, and Team at
  $1590, each below a struck-through price ([aceternity-pricing]).

[shadcn-docs]: https://ui.shadcn.com/docs
[shadcn-license]: https://github.com/shadcn-ui/ui/blob/main/LICENSE.md
[shadcn-cli-v4]: https://ui.shadcn.com/docs/changelog/2026-03-cli-v4
[shadcn-changelog]: https://ui.shadcn.com/docs/changelog
[shadcn-install]: https://ui.shadcn.com/docs/installation
[rnr]: https://github.com/founded-labs/react-native-reusables
[magicui]: https://magicui.design/
[magicui-docs]: https://magicui.design/docs
[magicui-repo]: https://github.com/magicuidesign/magicui
[magicui-pro]: https://pro.magicui.design/
[aceternity]: https://ui.aceternity.com/
[aceternity-licence]: https://ui.aceternity.com/licence
[aceternity-pricing]: https://pro.aceternity.com/pricing

### Animation libraries for the web

- **Motion.** "Production-grade animation library for the web", for React,
  JavaScript, and Vue, and "Completely free to use, MIT licensed and open
  source." ([motion]) Framer Motion became Motion on November 12, 2024: "With
  Framer's blessing and support, Framer Motion is now completely independent."
  ([motion-blog]) `motion` and `framer-motion` were both at 13.4.0 (September
  16, 2026); 13.0.0 shipped on August 5, 2026. Motion+ is a one-time "Personal
  licence" priced at £299 in the page's structured data ([motion-plus]). There
  is no React Native version: the maintainer wrote in 2021 that "Native support
  won't be on our roadmap for the foreseeable future", pointing to Moti
  ([motion-rn]).
- **GSAP.** Webflow bought it: "GSAP has been acquired by Webflow" (October
  15, 2024) ([gsap-webflow]). It became free with release 3.13: "GSAP is now
  100% FREE including ALL of the bonus plugins like SplitText , MorphSVG , and
  all the others that were exclusively available to Club GSAP members. That's
  right - the entire GSAP toolset is FREE, even for commercial use!" (post dated
  April 29, 2025) ([gsap-313]). Webflow's post of April 30, 2025 adds: "We’re
  also expanding the standard license to cover commercial use" ([webflow-gsap]).
  The license is the "Standard "No Charge" GSAP License", effective April 30,
  2025, which forbids use "in tools that allow users to build visual animations
  without code that ... competes with Webflow’s visual animation building
  capabilities" ([gsap-license]). The latest release is 3.15.0 (April 13, 2026).
  GSAP calls itself "Professional-grade JavaScript animation for the modern web"
  and says nothing about React Native ([gsap]).
- **Lenis.** "a lightweight, robust, and performant smooth scroll library" that
  "wraps the browser's own scroll" ([lenis]). It is MIT-licensed, and
  version 1.3.26 (August 5, 2026) has packages for React, Vue, and Framer but
  none for React Native.

[motion]: https://motion.dev/
[motion-blog]: https://motion.dev/blog/framer-motion-is-now-independent-introducing-motion
[motion-plus]: https://motion.dev/plus
[motion-rn]: https://github.com/motiondivision/motion/issues/180
[gsap-webflow]: https://gsap.com/blog/webflow-GSAP
[webflow-gsap]: https://webflow.com/blog/gsap-becomes-free
[gsap]: https://gsap.com/
[lenis]: https://github.com/darkroomengineering/lenis

### Animation formats with native players

- **Rive.** "Build interactive UI, motion, and game experiences in the Editor
  ... What you build runs natively on mobile, desktop, web" ([rive]). "Our
  official runtimes are all open-source and licensed under the MIT License"
  ([rive-runtimes]). The editor's yearly prices: Free at $0, Cadet at $9 a seat
  a month (the first plan with "Export .riv files"), Voyager at $32, and
  Enterprise at $120 ([rive-pricing]).
- **Rive in React Native.** The new runtime, version 0.4.20 of
  `@rive-app/react-native` (August 19, 2026), is built on Nitro Modules and
  needs "React Native : 0.78 or later", "Expo SDK : 53 or later", and "iOS
  : 15.1 or later" ([rive-rn]). The older `rive-react-native` is at 9.8.5, from
  July 17, 2026. "Because this package contains custom native code, it’s not
  compatible with Expo Go. Instead, you’ll need to use a development build"
  ([rive-expo]). Neither package is in Expo SDK 57's pinned list
  ([expo-bundled]).
- **Lottie.** "Lottie is an open format for animated vector graphics", now run
  by the Lottie Animation Community, "a non-profit open source project hosted by
  The Linux Foundation" ([lottie-lac]). Its specification reached version 1.0 on
  September 17, 2024, and 1.0.1 on April 15, 2025 ([lottie-news]).
  `lottie-react-native` 7.5.0 (August 22, 2026, Apache-2.0) "Requires React
  Native 0.84 or newer and the New Architecture"; Expo SDK 57 pins ~7.3.8
  ([lottie-rn]; [expo-bundled]). Expo Go dropped Lottie on June 20, 2025:
  "Remove Lottie. Latest version is a nitro module" ([expo-go-lottie]).
- **dotLottie.** "an open-source file format designed to package one or more
  Lottie animations along with their associated resources, such as images,
  themes, state machines, into a single, compressed file" ([dotlottie]).
  `@lottiefiles/dotlottie-react-native` is at 0.12.1 (July 30, 2026, MIT), and
  "Expo Go does not bundle the DotLottie native module." ([dotlottie-rn])

[rive]: https://rive.app/
[rive-runtimes]: https://rive.app/docs/runtimes/getting-started
[rive-pricing]: https://rive.app/pricing
[rive-expo]: https://rive.app/docs/runtimes/react-native/adding-rive-to-expo
[lottie-lac]: https://lottie.github.io/
[lottie-news]: https://lottie.github.io/news/
[lottie-rn]: https://github.com/lottie-react-native/lottie-react-native
[expo-go-lottie]: https://github.com/expo/expo/pull/37521
[dotlottie]: https://dotlottie.io/spec/2.0/
[dotlottie-rn]: https://github.com/LottieFiles/dotlottie-react-native

### 3D and shader tools

- **Spline.** "a design tool for making interactive 3D and 2D experiences in
  your browser, and shipping them to the web, iOS and Android" ([spline-docs]).
  Code export covers Vanilla JS, Three.js, React, Next.js, and react-three-fiber
  ([spline-code]). A SwiftUI runtime built on Metal needs iOS 16.0 and an A13
  chip, and "To export for Apple Platforms, you’ll need an active **Pro** or
  **Max** subscription." ([spline-ios]) Pro costs "$25 / mo billed yearly or $30
  billed monthly" ([spline-pricing]). `@splinetool/runtime` 2.0.55 (September
  18, 2026) states no license; the `react-spline` wrapper is MIT. There is no
  React Native package, so a WebView or a hand-wrapped Swift runtime are the
  only routes.
- **Unicorn Studio.** "a visual design tool for creating production-ready
  interactive graphics with shaders, media, 3D, and interactive motion", with a
  runtime of "~50 KB gzipped" that needs WebGL2 ([unicorn-docs]). "the
  underlying code remains our proprietary intellectual property"
  ([unicorn-faq]). Its embed code loads `unicornstudio.js` from
  `cdn.jsdelivr.net`, and the JSON export for self-hosting comes with the paid
  Legend plan, at "$168/year or $20 billed monthly" ([unicorn-embed];
  [unicorn-pricing]).
- **React Three Fiber.** "a React renderer for three.js", MIT, at 9.7.0 (July
  31, 2026). It "can be imported from `@react-three/fiber/native`. We use
  `expo-gl` and `expo-asset` under the hood", and its docs warn that iOS
  simulators "can cause EXC_BAD_ACCESS crashes" ([r3f-install]).

[spline-docs]: https://docs.spline.design/
[spline-code]: https://docs.spline.design/exporting-your-scene/web/exporting-as-code
[spline-ios]: https://docs.spline.design/exporting-your-scene/apple-platform/native-3d-embeds-for-i-os
[spline-pricing]: https://spline.design/pricing
[unicorn-docs]: https://www.unicorn.studio/docs
[unicorn-faq]: https://www.unicorn.studio/docs/faqs
[unicorn-embed]: https://www.unicorn.studio/docs/embed
[unicorn-pricing]: https://www.unicorn.studio/docs/pricing
[r3f-install]: https://github.com/pmndrs/react-three-fiber/blob/master/docs/getting-started/installation.mdx

### What Expo SDK 57 already bundles

- **Pinned modules.** For `expo` 57.0.24, the list pins
  `react-native-reanimated` 4.5.1, `@shopify/react-native-skia` 2.6.2,
  `react-native-svg` 15.15.4, `lottie-react-native` ~7.3.8, `expo-gl` ~57.0.2,
  `expo-glass-effect` ~57.0.3, `@expo/ui` ~57.0.19, `expo-blur` ~57.0.3,
  `expo-mesh-gradient` ~57.0.2, `expo-symbols` ~57.0.3, `expo-haptics` ~57.0.3,
  and `expo-font` ~57.0.4 ([expo-bundled]).
- **Springs in Reanimated.** "`withSpring` lets you create spring-based
  animations." Its physics defaults are a damping of 120 and a stiffness of 900;
  a duration-based spring defaults to 550 ms and a `dampingRatio` of 1
  ([rea-spring]).
- **Reduce Motion in Reanimated.** "By default all animations are configured
  with `ReduceMotion.System`", and when the setting is on, "`withSpring` and
  `withTiming` return the `toValue` immediately" ([rea-a11y]).
- Synthesis: Of the eleven, only Rive, Lottie and dotLottie, and React Three
  Fiber have React Native packages. The web-only kits and libraries could serve
  the three static pages at most, and policy pages need none of them.

[rea-a11y]: https://docs.swmansion.com/react-native-reanimated/docs/guides/accessibility

## Visual design trends in 2025 and 2026

A first party here is the company that makes the platform or the tool, speaking
for itself on its own site. Everything else is marked "Commentary".

### Apple's Liquid Glass

- **The announcement.** On June 9, 2025, Apple introduced "a new material called
  Liquid Glass. This translucent material reflects and refracts its
  surroundings, while dynamically transforming to help bring greater focus to
  content" across iOS 26 and Apple's other platforms; "This is our broadest
  software design update ever." "Controls are crafted out of Liquid Glass and
  act as a distinct functional layer that sits above apps." ([apple-nr-2025])
- **Where it goes.** "Liquid Glass forms a distinct functional layer for
  controls and navigation elements — like tab bars and sidebars — that floats
  above the content layer". "Don't use Liquid Glass in the content layer",
  except for "controls in the content layer with a transient interactive element
  like sliders and toggles". "Use Liquid Glass effects sparingly", and "Only use
  clear Liquid Glass for components that appear over visually rich backgrounds."
  ([hig-materials])
- **Getting it for free.** "In system frameworks, standard components like bars,
  sheets, popovers, and controls automatically adopt this material." Apple asks
  developers to "Reduce your use of custom backgrounds in controls and
  navigation elements" and to test "with a variety of display and accessibility
  settings", since people can "turn on accessibility settings that reduce
  transparency or motion in the interface" ([apple-adopting]).
- **Accessibility comes with it.** "Reduced Transparency, makes Liquid Glass
  frostier and obscures more of the content behind it. Increased contrast, makes
  elements predominantly black or white and highlights them with a contrasting
  border and Reduced Motion decreases the intensity of some effects and disables
  any elastic properties for the material. These are available automatically
  whenever you use the new material." ([wwdc25-glass])
- **Color on glass.** "By default, Liquid Glass has no inherent color, and
  instead takes on colors from the content directly behind it." Custom colors
  need "light and dark variants, and an increased contrast option for each
  variant", and "Even if your app ships in a single appearance mode, provide
  both light and dark colors to support Liquid Glass adaptivity" ([hig-color]).
- **Users control it.** iOS 26 lets people choose "Clear for a more transparent
  look or Tinted for more contrast and increased opacity" ([apple-guide-26]). At
  WWDC on June 8, 2026, Apple announced "A new slider in Settings" that adjusts
  Liquid Glass "anywhere from ultra-clear to fully tinted" ([apple-nr-wwdc26]),
  and iOS 27, with that slider, began rolling out on September 14, 2026
  ([apple-nr-ios27]).
- **The opt-out ends.** `UIDesignRequiresCompatibility` runs an app "using a
  compatibility mode for UI elements", Apple says to "Temporarily use this key",
  and "The system ignores this key when you build for iOS 27 or later"
  ([apple-uidrc]).
- **In Expo.** `expo-glass-effect` renders "a liquid glass effect using iOS's
  native UIVisualEffectView"; "`GlassView` is only available on iOS 26 and
  above. It will fallback to regular `View` on unsupported platforms." Because
  availability "may also be `true` if the user has enabled accessibility
  settings that limit the Liquid Glass effect", Expo points to
  `AccessibilityInfo.isReduceTransparencyEnabled()` ([expo-glass]).
- **In Expo Router.** "Starting from iOS 26, navigation headers adopt the
  system's "Liquid Glass" effect by default. It cannot be disabled per screen"
  ([expo-stack]). "On iOS 26 and later, the system draws the tab bar with Liquid
  Glass and derives its background from the content behind it" ([expo-tabs]).

[apple-nr-2025]: https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/
[hig-materials]: https://developer.apple.com/design/human-interface-guidelines/materials
[apple-adopting]: https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass
[wwdc25-glass]: https://developer.apple.com/videos/play/wwdc2025/219/
[hig-color]: https://developer.apple.com/design/human-interface-guidelines/color
[apple-guide-26]: https://support.apple.com/guide/iphone/adjust-iphone-display-and-text-settings-iphd6804774e/26/ios/26
[apple-nr-wwdc26]: https://www.apple.com/newsroom/2026/06/apple-unveils-next-generation-of-apple-intelligence-siri-ai-and-more/
[apple-nr-ios27]: https://www.apple.com/newsroom/2026/09/major-updates-for-apples-software-platforms-are-now-available/
[expo-glass]: https://docs.expo.dev/versions/latest/sdk/glass-effect/
[expo-tabs]: https://docs.expo.dev/router/advanced/native-tabs/

### Google's Material 3 Expressive

- **The announcement.** On May 13, 2025, Google called Material 3 Expressive
  "one of our biggest updates in years", with "a system of more natural, springy
  animations meant to bring a moment of delight to everyday routines" and
  "emphasized typography" ([keyword-m3e]).
- **The research.** "Material 3 Expressive is the most researched update to
  Google's design system, ever", built on "46 separate research studies with
  hundreds of designs, and more than 18,000 participants". It started from the
  question "Why did all these apps look so similar? So boring?" and names
  "color, shape, size, motion, and containment" as the parts of expressive
  design. Google reports a preference "up to 87%" among 18-to-24 year olds and
  key elements spotted "up to four times faster", and warns that "it's not a
  one-size-fits-all solution", that "a strong minority of users preferred
  calmer, less intense versions", and that "No amount of emotion can compensate
  for a lack of clarity." ([design-google-m3e])
- **What changed.** "M3 Expressive isn't a new version of the system", and "this
  isn't "M4."" It brought "Fourteen new or updated components", "a new set of 35
  shapes" with "A built-in shape-morph animation", new type styles that "support
  bold editorial layouts", and the advice to "Create editorial-like moments in
  your app by emphasizing typography" ([m3-blog-2025]).
- **Springs replace curves.** "The physics system is replacing the previous
  system based on easing and duration." "The expressive motion scheme overshoots
  the final values to add bounce", while "Effects spring tokens are used to
  animate properties such as color and opacity animations, where there shouldn't
  be any overshoot." ([m3-motion])
- **In 2026.** At Google I/O on May 19, 2026, "Material announced the Expressive
  layout system, lists and menus on Android, and the future of Material Android
  being Compose-first", with a spacing system "built on an 8dp scale"
  ([m3-blog-2026]).

[keyword-m3e]: https://blog.google/products-and-platforms/platforms/android/material-3-expressive-android-wearos-launch/
[m3-blog-2025]: https://m3.material.io/blog/building-with-m3-expressive
[m3-blog-2026]: https://m3.material.io/blog/whats-new-at-io26

### Figma, Framer, and Webflow

- **Figma's 2026 list.** Figma's "Top Web design trends for 2026" names
  thirteen, among them "3D and immersive elements", "Vibrant color palettes",
  "Bold typography", "Dark mode", "Motion design and animation", and "Gamified
  design". "Dark mode has become standard for sites and mobile apps", and "Neon
  gradients, high-contrast pairings, and playful hues are replacing minimal or
  muted tones" ([figma-trends]).
- **Figma on AI and craft.** Figma's State of the Designer 2026, published
  February 12, 2026: "despite fears that AI slop might degrade craft and
  quality, designers are actually finding the opposite to be true: 91% say that
  new AI tools improve their designs." ([figma-sotd]) At Config, on June 24,
  2026: "while AI has lowered the floor, it has not raised the ceiling"
  ([figma-config26]). Config 2025 added "Texture and Noise effects" and
  "Progressive blur" to Figma Draw ([figma-config25]).
- **Framer.** Its latest trend post, "7 emerging web design trends for 2025"
  (October 15, 2024), names interactivity, "Nostalgic Retro Elements" with
  "grainy textures", "Human-Crafted Designs", "Vivid Colors", "Dark Mode",
  illustrations, and "Micro Animations", and warns "don't go too wild with it"
  ([framer-trends]). Its sitemap listed no 2026 trend post on September
  22, 2026. Its glossary calls bento grids "cards that can span different rows
  or columns" and says of noise: "Apply noise sparingly—heavy noise can look
  dated and affect performance." ([framer-bento]; [framer-noise])
- **Webflow's 2026 list.** "8 web design trends to watch in 2026" (December 23,
  2025; updated January 8, 2026) opens with "In a world of algorithmic sameness,
  human craft is becoming the differentiator." It names "Proprietary effects and
  styles", "Art converging with advanced UI", "Minimalism in copy", "The TL;DR
  experience", "Explosion of color", "Dynamic text treatments", "Guided
  scrolling", and "The infinite canvas"; of guided scrolling it says "This isn't
  about scrollytelling or narrative experiences." ([webflow-2026])
- **Webflow's 2025 list.** It named "Futuristic, sci-fi gaming UI aesthetics"
  with "translucent panels" and "cinematic fluidity", "Window and shadow
  overlays", "Glow effects", "Flash-era nostalgia", "Sophisticated, animated
  scrolls", and "AI-generated imagery" ([webflow-2025]).
- **Google Stitch's vocabulary.** Stitch's own prompt word bank defines "Bento
  Grid", "Editorial" ("Large serif headings, generous whitespace"),
  "Glassmorphism" ("Translucency, background blur (backdrop-filter), and subtle
  white borders."), "Grainy/Noise", and "Dark Mode OLED" ("True black
  backgrounds (#000000)") ([stitch-modes]).

[figma-config26]: https://www.figma.com/blog/config-2026-recap/
[figma-config25]: https://www.figma.com/blog/config-2025-recap/
[framer-bento]: https://www.framer.com/dictionary/bento-grids
[webflow-2025]: https://webflow.com/blog/web-design-trends-2025

### Trend by trend

| Trend                         | What first parties say                                                                          | Skills and commentary                                                |
| ----------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Glass and translucency        | Apple: Liquid Glass for controls and navigation only; Webflow 2025: "translucent panels"        | Taste Skill warns against "generic glassmorphism on everything"      |
| Expressive type               | Material: "emphasized typography"; Figma: "Bold typography"; Webflow: "Dynamic text treatments" | Anthropic flags serif displays on cream and one-word italic accents  |
| Serif display italics         | None names them; Stitch's word bank has "Large serif headings" under "Editorial"                | The skills disagree (see [Conflicts](#conflicts-between-sources))    |
| Bento grids                   | Framer's glossary and Stitch's word bank define them; no trend report names them                | Taste Skill prescribes asymmetric bento; Anthropic's "SaaS-card kit" |
| Grain and noise               | Framer 2025: "grainy textures"; Figma Draw: noise effects; Framer: "Apply noise sparingly"      | Taste Skill adds grain to flat surfaces                              |
| Spring motion                 | SwiftUI animates with springs by default; Material's motion physics                             | Taste Skill's default spring                                         |
| Cinematic video and scrolling | Figma: "3D and immersive elements"; Webflow 2026 moves from scrollytelling to guided scrolling  | See the motionsites.ai notes                                         |
| Dark-first palettes           | Figma: "Dark mode has become standard"; Apple: support both, and dark only "In rare cases"      | Taste Skill requires both modes                                      |
| AI-generated sameness         | Anthropic, Google, Webflow, Figma, and Vercel all name it                                       | Aura's DESIGN.md library sets most display type in Inter             |

- **Springs at Apple.** "Because springs are such a great tool for animations,
  we now use them as the default animation in SwiftUI" (WWDC23), and "springs
  with no bounce are great too! These types of non-bouncy springs are used in
  animations all over iOS." ([apple-springs]) SwiftUI's presets are `smooth`
  ("no bounce"), `snappy` ("small amount of bounce"), and `bouncy` ("higher
  amount of bounce") ([swiftui-animation]).
- **Motion limits.** Apple: "Add motion purposefully", "Make motion optional",
  "Aim for brevity and precision in feedback animations", "In apps, generally
  avoid adding motion to UI interactions that occur frequently", and "Let people
  cancel motion." ([hig-motion]) WCAG 2.2 requires a way to "pause, stop, or
  hide" moving content that starts automatically and lasts more than five
  seconds (Success Criterion 2.2.2), and at level AAA lets people disable
  "Motion animation triggered by interaction" (2.3.3) ([wcag22]).
- **Dark mode at Apple.** "people often choose Dark Mode as their default
  interface style, and they generally expect all apps and games to respect their
  preference." "Avoid offering an app-specific appearance setting." "At a
  minimum, make sure the contrast ratio between colors is no lower than 4.5:1.
  For custom foreground and background colors, strive for a contrast ratio of
  7:1, especially in small text." ([hig-dark])

[apple-springs]: https://developer.apple.com/videos/play/wwdc2023/10158/
[wcag22]: https://www.w3.org/TR/WCAG22/

### Critiques of AI-generated sameness

- **Anthropic.** "when you ask an LLM to build a landing page without guidance,
  it will almost always conform to Inter fonts, purple gradients on white
  backgrounds, and minimal animations" ([anth-blog]); its current skill lists
  five looks generated design "clusters around" ([anth-fd]).
- **Google Stitch.** Stitch's page for the Taste Skill, "contributed by a
  community member, Leon Lin", says: "Most AI-generated interfaces converge on
  the same look: oversaturated purple gradients, centered three-column cards,
  Inter font, fabricated statistics." ([stitch-taste])
- **Google's Material research.** "Why did all these apps look so similar? So
  boring?" and "It's time to move beyond "clean" and "boring" designs"
  ([design-google-m3e]).
- **Webflow.** "As design tools become more powerful and accessible, visual
  homogeneity becomes a real risk." Brands answer with proprietary effects:
  "These aren't effects anyone can replicate with a prompt" ([webflow-2026]).
- **Figma.** "In an era where anyone can use AI to prompt their way to a
  prototype, craft is what sets products apart." ([figma-sotd]) "When generating
  assets is cheap, how you differentiate them is what's critical."
  ([figma-ai-2026])
- **Vercel.** On August 31, 2026, Vercel wrote that without its design.md file
  "the model generated a generic SaaS dashboard", and that the file "names the
  recurring generated-design patterns that we never want to see"
  ([vercel-designmd]).
- **Relume, about a rival.** "Claude Design is powerful. But without a design
  system, every output looks identical." ([relume-claude])
- **Counterpoints.** OpenAI's GPT-5 prompting guide lists "Fonts: San Serif,
  Inter, Geist, Mona Sans, IBM Plex Sans, Manrope" among its recommended
  defaults ([openai-gpt5]), an example prompt in Lovable's docs includes 'Font
  is "Inter".' ([lovable-prompting]), and Google's example DESIGN.md sets body
  text in Inter ([stitch-dmd-overview]).
- **An observation.** Of the first 98 cards in Aura's library of DESIGN.md
  files, 67 set their large display style in Inter, by this research's count on
  September 22, 2026 ([aura-systems]).

[stitch-taste]: https://stitch.withgoogle.com/docs/skills/taste/
[figma-ai-2026]: https://www.figma.com/blog/2026-ai-report/
[relume-claude]: https://www.relume.ai/claude-design-export
[lovable-prompting]: https://docs.lovable.dev/prompting/prompting-one

## Findings for DESIGN.md

Judgment for a native iPhone game with a character, private by default, entering
a category whose judges look for "strong gameplay, a clear art direction, and a
monetization model that fits the genre" ([best-game]).

- **Format.** Synthesis: Adopt Google's DESIGN.md format, the one Stitch, Aura,
  and the CLI read, in this repo's style: an H1 and a `Contents:` list, the
  specification's sections under sentence-case names ("Overview", "Colors",
  "Typography", "Layout", "Elevation", "Shapes", "Components", "Do's and
  don'ts"), tokens in fenced `yaml` blocks, and custom sections such as
  "Character" and "Motion". Pin `@google/design.md@0.4.0` for linting, because
  the format is still alpha. See
  [A DESIGN.md that follows this repo's style guide](#a-designmd-that-follows-this-repos-style-guide).
- **Values in code as well.** Synthesis: Vercel's prose-only draft gave
  different pages from different models until a stylesheet took the values away
  from the model, and the CLI exports only web formats. So the app's theme file
  should carry the same tokens as DESIGN.md and be checked against it, while
  DESIGN.md explains the reasons. See
  [How agents are meant to use DESIGN.md](#how-agents-are-meant-to-use-designmd).
- **A point, not a region.** Synthesis: Google's "A specific reference describes
  a point" and Anthropic's "Ground your designs in the subject matter" agree.
  The overview should name one concrete reference for the Guessling's world; the
  same sentence can open the Devpost notes on "the art direction, tone, and what
  makes the game memorable" that the Best Game page asks for ([best-game]). See
  [Sections and tokens in the specification](#sections-and-tokens-in-the-specification).
- **The character is the signature.** Synthesis: The product document makes the
  four reactions the art direction ([product-character]), and Anthropic's "Spend
  your boldness in one place" and Webflow's "Proprietary effects and styles"
  point the same way. No generator, kit, or skill here covers a character, so
  DESIGN.md needs a Character section of its own: the silhouette at small sizes,
  the four poses and their timing, and the rule that every pose shows its word.
  See [Anthropic's frontend-design skill](#anthropics-frontend-design-skill).
- **Springs, short and never blocking.** Synthesis: Springs are the one motion
  trend Apple and Google share, and SDK 57's Reanimated 4.5.1 has `withSpring`.
  Give each pose spring tokens in the Motion section, with bounce for movement
  and none for color and opacity, the split Material makes between spatial and
  effects springs. A round can show twenty reactions, so each stays brief and
  never holds up the next question, as "Let people cancel motion" asks. Reject
  Taste Skill's "Perpetual Micro-Interactions". See
  [Trend by trend](#trend-by-trend).
- **An explicit Reduce Motion rule.** Synthesis: With Reduce Motion on,
  Reanimated's default makes `withSpring` and `withTiming` "return the `toValue`
  immediately", so the TRD's fade between poses ([trd-reactions]) snaps unless
  the fade itself opts out with `ReduceMotion.Never`. DESIGN.md should say what
  may still move under Reduce Motion (opacity) and what may not (position,
  rotation, scale). See
  [What Expo SDK 57 already bundles](#what-expo-sdk-57-already-bundles).
- **Colors follow the system.** Synthesis: Apple asks for light and dark
  variants "and an increased contrast option for each variant" and for no in-app
  appearance switch, so each color token needs four values, checked at 4.5:1 or
  better, and 7:1 for small text where it can. React Native reports the settings
  through `useColorScheme` ([rn-scheme]) and
  `AccessibilityInfo.isDarkerSystemColorsEnabled()` ([rn-a11y]). Reject a
  dark-first or pure-black palette: Figma's and Framer's lists favor dark mode
  and Stitch's word bank offers pure black, but Apple asks apps to follow the
  system and keeps dark-only for immersive media. See
  [Trend by trend](#trend-by-trend).
- **The system's typefaces.** Synthesis: SF Pro, its rounded variant, and New
  York come with the device, reach React Native as `system-ui`, `ui-rounded`,
  and `ui-serif` ([rn-text]), and need nothing bundled or downloaded; a custom
  face, if any, belongs to the wordmark. Apple recommends a default of 17 points
  and a minimum of 11 ([hig-type]). The skills' font bans are rules for web
  landing pages and don't carry over.
- **Glass from the system, not as the look.** Synthesis: Built with Xcode 26
  ([trd-versions]), the app's native stack headers and sheets take on Liquid
  Glass on iOS 26 and later, while iPhones on iOS 16.4 to 18 keep the older
  look, so every screen must work both ways. Keep glass off the content layer,
  which holds the Guessling, the hint, and the answers; a custom control with
  glass uses `expo-glass-effect`, a solid fallback, and
  `isReduceTransparencyEnabled()`. Don't rely on
  `UIDesignRequiresCompatibility`, which Apple ignores in iOS 27 builds. See
  [Apple's Liquid Glass](#apples-liquid-glass).
- **Material's evidence, not its parts.** Synthesis: Google's research ties
  expressive shape, color, size, and motion to faster recognition and to words
  like "playful" and "friendly", which suits a character game, but its
  components are Android's and now Compose-first. Borrow the shape language and
  emphasis; keep iOS controls. See
  [Google's Material 3 Expressive](#googles-material-3-expressive).
- **Guessling's own don'ts.** Synthesis: The skills' ban lists contradict one
  another and Anthropic's, all target web pages, and Google warns that "A long
  rambling list is often a sign the description was too vague". Keep the list
  short and specific: never mock a wrong guess, show the word with every
  reaction, never hold up the next question, and load nothing from a third party
  on the web pages. See
  [What each source tells an agent to do and ban](#what-each-source-tells-an-agent-to-do-and-ban).
- **Generators for sketches; native players for the character.** Synthesis: Only
  Bolt.new emits an Expo app, and its web projects "do not easily switch over to
  mobile"; Stitch's App mode can still sketch screens and export a DESIGN.md to
  compare with. Reanimated stays the v1.0 engine. Rive is the upgrade path if
  the poses need state machines: its runtimes are MIT, and the app already needs
  a development build for RevenueCat, though Rive is not in SDK 57's pinned
  list. Lottie is pinned for fixed clips. Reject the web-only kits and
  libraries, and Spline, Unicorn Studio, and React Three Fiber, whose 3D no
  round needs. See
  [Component and motion libraries](#component-and-motion-libraries).
- **Web pages private by construction.** Synthesis: The three static pages can
  share the app's color tokens, set type in `system-ui`, keep CSS inline, and
  follow `prefers-color-scheme` and `prefers-reduced-motion`. That rules out
  Google Fonts, which Anthropic's sample prompt loads and Taste Skill forbids in
  production; the Tailwind script that Google's Stitch skill writes into HTML,
  `cdn.tailwindcss.com` ([stitch-inline]); and Unicorn Studio's
  `cdn.jsdelivr.net` embed. Cinematic video, grain, and bento grids don't belong
  on policy pages.

[best-game]: https://www.shipaton.com/categories/best-game-award
[product-character]: /docs/archive/guessling-product.md#the-guessling-character
[trd-reactions]: /docs/archive/guessling-trd.md#reactions-sound-and-haptics
[rn-scheme]: https://reactnative.dev/docs/usecolorscheme
[rn-a11y]: https://reactnative.dev/docs/accessibilityinfo
[rn-text]: https://reactnative.dev/docs/0.86/text-style-props
[hig-type]: https://developer.apple.com/design/human-interface-guidelines/typography
[trd-versions]: /docs/archive/guessling-trd.md#versions-on-september-22-2026
[stitch-inline]: https://github.com/google-labs-code/stitch-skills/blob/main/plugins/stitch-design/skills/extract-static-html/scripts/extract_inline_html.ts

## Conflicts between sources

- **VoltAgent's sections.** Its README promises nine numbered sections from
  "Visual Theme & Atmosphere" to "Agent Prompt Guide"; its files now use the
  specification's headings plus "Responsive Behavior", "Iteration Guide", and
  "Known Gaps" ([volt-readme]; [volt-apple]).
- **Google's three shapes of DESIGN.md.** The specification has eight named
  sections and YAML tokens ([gdm-spec]); the `design-md` skill writes five
  numbered prose sections with no tokens ([stitch-skill-design-md]); and the
  `extract-design-md` skill writes front matter and six numbered sections,
  ending with "Design System Notes for Stitch Generation"
  ([stitch-skill-extract]).
- **Where tokens go.** The specification says tokens are "embedded as YAML front
  matter at the beginning of the file" ([gdm-spec]); the CLI also reads fenced
  `yaml` blocks ([gdm-parser]).
- **Color values.** Stitch's specification page types a color as "# + hex code
  (sRGB)" ([stitch-dmd-spec]); the GitHub specification accepts "any valid CSS
  color string" ([gdm-spec]).
- **How many lint rules.** Stitch's docs say the linter "runs 8 lint rules"
  ([stitch-dmd-cli]); the repository lists eleven ([gdm-repo]).
- **Contrast.** Stitch's example DESIGN.md says "Do maintain 4:1 contrast ratio
  for all text" ([stitch-dmd-overview]); the specification's example and the CLI
  use 4.5:1 ([gdm-spec]), and Apple says "no lower than 4.5:1" and to "strive
  for" 7:1 ([hig-dark]).
- **Inter.** Taste Skill bans it ([local-stitch-skill]); Anthropic's skill
  banned it in December 2025 ([anth-fd-2025]) and no longer names it
  ([anth-fd]); OpenAI's guide recommends it ([openai-gpt5]); Google's example
  DESIGN.md uses it ([stitch-dmd-overview]).
- **Near-black.** Taste Skill replaces pure black with "off-black, dark
  charcoal, or tinted dark (`#0a0a0a`, `#121212`, or a dark navy)"
  ([local-redesign]); Anthropic lists "tinted near-black (#0B0B0B, #111)
  standing in for black" as a tell ([anth-fd]); Stitch's word bank offers "True
  black backgrounds (#000000)" ([stitch-modes]).
- **Serifs.** `minimalist-ui` prescribes an editorial serif display including
  Instrument Serif ([local-minimal]); `stitch-design-taste` recommends Fraunces
  and Instrument Serif when a serif is needed ([local-stitch-skill]); the v2
  default skill bans both as defaults ([local-taste-v2]); Anthropic flags a
  cream background with a serif display as a generated look ([anth-fd]).
- **Italic emphasis.** Taste Skill v2: "use **italic or bold of the SAME font**"
  to emphasize a word ([local-taste-v2]). Anthropic: avoid "putting one word in
  italic/bold or a different color" ([anth-fd]).
- **How much motion.** Taste Skill: "Every active component should have an
  infinite loop state" ([local-stitch-skill]), and "Static interfaces are
  strictly forbidden" ([local-gpt]). Apple: "Don't add motion for the sake of
  adding motion." ([hig-motion]) Anthropic: "Use non-user-triggered motion
  sparingly and deliberately" ([anth-fd]).
- **Grain.** Taste Skill adds "subtle noise, grain, or micro-patterns" to flat
  surfaces ([local-redesign]); Framer warns "heavy noise can look dated and
  affect performance" ([framer-noise]).
- **Google Fonts.** Anthropic's sample prompt says "Load from Google Fonts"
  ([anth-blog]); Taste Skill says "Never link Google Fonts via `<link>` in
  production" ([local-taste-v2]).
- **Taste Skill's own numbers.** Its Stitch skill defaults to "Variance 8,
  Motion 6, Density 4" ([local-stitch-skill]); Google's hosted copy to
  "Creativity 9, Variance 8, Motion 6, Density 5" ([stitch-skill-taste]). The
  skill's template has seven sections and its sample file nine
  ([local-stitch-design]).
- **Default springs.** Material's expressive scheme "overshoots the final values
  to add bounce" ([m3-motion]); Apple's `smooth` preset has "no bounce"
  ([swiftui-animation]); Reanimated's duration-based default is critically
  damped ([rea-spring]).
- **Opting out of Liquid Glass.** Apple ignores the key "when you build for iOS
  27 or later" ([apple-uidrc]); Expo writes "From iOS 27, this option will be
  removed by Apple" ([expo-stack]), which reads as the OS version.
- **In-app appearance toggles.** Figma: "Many well-known brands like YouTube, X,
  and Slack offer a toggle for switching between light and dark modes."
  ([figma-trends]) Framer: "building a dark mode toggle into your design lets
  users select whichever they prefer." ([framer-trends]) Apple: "Avoid offering
  an app-specific appearance setting." ([hig-dark])
- **Generator plans and claims.** v0's docs list five plans, among them
  "Premium: $20/month", which "is in the process of being sunsetted"
  ([v0-docs-pricing]), while its pricing page shows four ([v0-pricing]).
  Lovable's `llms.txt` describes "building web and mobile apps"
  ([lovable-llms]), while its publishing FAQ says it "builds **web apps**" and
  "does not generate projects in React Native" ([lovable-publish]).
- **Library dates.** GSAP's 3.13 post is dated April 29, 2025, and the license,
  Webflow's post, and the npm release April 30 ([gsap-313]; [gsap-license]);
  Motion's changelog dates 13.4.0 to September 14, 2026, and npm to September
  16; `lottie-react-native` is at 7.5.0 while SDK 57 pins ~7.3.8
  ([expo-bundled]).

[stitch-skill-extract]: https://github.com/google-labs-code/stitch-skills/blob/main/plugins/stitch-design/skills/extract-design-md/SKILL.md
[stitch-dmd-cli]: https://stitch.withgoogle.com/docs/design-md/cli/
[v0-docs-pricing]: https://v0.app/docs/pricing
[lovable-llms]: https://lovable.dev/llms.txt

## Gaps

What the sources don't settle for DESIGN.md, as of September 22, 2026:

- **Earlier uses of the name.** Without web search, this research could not look
  for anyone using a DESIGN.md file before Google's skill of January 22, 2026.
- **Stitch and fenced tokens.** The CLI reads tokens from fenced `yaml` blocks,
  but whether Stitch's importer does was not tested; Stitch needs a signed-in
  account.
- **A React Native export.** Neither the CLI nor any generator exports tokens
  for React Native; the DTCG file is the nearest input for a conversion script.
- **Bold Text in React Native.** Apple says system fonts respond to Bold Text on
  their own; whether React Native's `ui-rounded` text does was not checked.
- **Rive on SDK 57.** Version 0.4.20 of `@rive-app/react-native` asks for React
  Native 0.78 or later, but it isn't in Expo SDK 57's pinned list, and its Nitro
  Modules requirement differs between its docs and its package ([rive-rn]); only
  a build would show whether it works with React Native version 0.86.3.
- **Bolt's Expo version.** Bolt's docs name no Expo SDK ([bolt-expo]).
- **Liquid Glass details.** No Apple page says which iOS 26 update added the
  Clear and Tinted setting, or whether an app built with the iOS 26 SDK can
  still opt out on iOS 27.
- **Named trends.** No first party names serif display italics, cinematic video
  backgrounds, or bento grids as a 2025 or 2026 trend, and without web search
  the commentary that does was not surveyed.
- **Prices behind toggles and locations.** Only the default billing view was
  captured for Figma, Aura, Lovable, and Framer; Stitch's credit amounts need a
  sign-in; Lovable and 21st.dev may price by region.
- **Unread pages.** Framer's State of Sites 2026 report sits behind an email
  form, and Monotype's type-trend chapters need JavaScript.

## See also

- [The Guessling character](/docs/archive/guessling-product.md#the-guessling-character),
  the art direction DESIGN.md will spell out.
- The TRD's
  [reactions, sound, and haptics](/docs/archive/guessling-trd.md#reactions-sound-and-haptics)
  and [accessibility](/docs/archive/guessling-trd.md#accessibility)
  requirements.
- [RevenueCat and Expo research notes](/docs/research/revenuecat-expo.md), on
  Expo SDK 57 and the EAS build image.
- [Apple requirements for Guessling](/docs/research/apple-requirements.md),
  including sound, haptics, and accessibility labels.
- [motionsites.ai research notes](/docs/research/motionsites.md), the other half
  of the research behind DESIGN.md.
- [Markdown style guide](/docs/references/markdown-style.md), which a DESIGN.md
  in this repo follows.

[stitch-blog-mar]: https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/
[stitch-whats-new]: https://app-companion-430619.appspot.com/assets/whatsNewUpdates-rKZW2RTS.js
[gdm-repo]: https://github.com/google-labs-code/design.md
[stitch-skill-design-md]: https://github.com/google-labs-code/stitch-skills/blob/main/plugins/stitch-utilities/skills/design-md/SKILL.md
[volt-readme]: https://github.com/VoltAgent/awesome-design-md
[gdm-spec]: https://github.com/google-labs-code/design.md/blob/main/docs/spec.md
[stitch-dmd-spec]: https://stitch.withgoogle.com/docs/design-md/specification/
[gdm-philosophy]: https://github.com/google-labs-code/design.md/blob/main/PHILOSOPHY.md
[stitch-dmd-overview]: https://stitch.withgoogle.com/docs/design-md/overview/
[stitch-dmd-usage]: https://stitch.withgoogle.com/docs/design-md/usage/
[local-stitch-design]: /.agents/skills/stitch-design-taste/DESIGN.md
[vercel-designmd]: https://vercel.com/blog/how-our-agents-build-on-brand-pages-with-design-md
[volt-apple]: https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/apple/DESIGN.md
[local-stitch-skill]: /.agents/skills/stitch-design-taste/SKILL.md
[stitch-skill-taste]: https://github.com/google-labs-code/stitch-skills/commit/6c0cbdb909b7d256c8b9b3854c8c8f87aab2c140
[local-taste-v2]: /.agents/skills/design-taste-frontend/SKILL.md
[local-minimal]: /.agents/skills/minimalist-ui/SKILL.md
[local-gpt]: /.agents/skills/gpt-taste/SKILL.md
[local-redesign]: /.agents/skills/redesign-existing-projects/SKILL.md
[anth-fd]: https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
[anth-fd-2025]: https://github.com/anthropics/skills/blob/00756142ab04c82a447693cf373c4e0c554d1005/skills/frontend-design/SKILL.md
[anth-blog]: https://claude.com/blog/improving-frontend-design-through-skills
[gdm-parser]: https://github.com/google-labs-code/design.md/blob/main/packages/cli/src/linter/parser/handler.ts
[v0-pricing]: https://v0.app/pricing
[lovable-publish]: https://docs.lovable.dev/features/publish
[bolt-expo]: https://support.bolt.new/integrations/expo
[aura-systems]: https://www.aura.build/design-systems
[expo-bundled]: https://unpkg.com/expo@57.0.24/bundledNativeModules.json
[gsap-313]: https://gsap.com/blog/3-13/
[gsap-license]: https://gsap.com/standard-license
[rive-rn]: https://rive.app/docs/runtimes/react-native/react-native
[rea-spring]: https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring
[apple-uidrc]: https://developer.apple.com/documentation/bundleresources/information-property-list/uidesignrequirescompatibility
[expo-stack]: https://docs.expo.dev/router/advanced/stack/
[design-google-m3e]: https://design.google/library/expressive-material-design-google-research
[m3-motion]: https://m3.material.io/styles/motion/overview/how-it-works
[figma-trends]: https://www.figma.com/resource-library/web-design-trends/
[figma-sotd]: https://www.figma.com/blog/state-of-the-designer-2026/
[framer-trends]: https://www.framer.com/blog/web-design-trends/
[framer-noise]: https://www.framer.com/dictionary/noise
[webflow-2026]: https://webflow.com/blog/web-design-trends-2026
[stitch-modes]: https://stitch.withgoogle.com/docs/learn/design-modes/
[swiftui-animation]: https://developer.apple.com/documentation/swiftui/animation
[hig-motion]: https://developer.apple.com/design/human-interface-guidelines/motion
[hig-dark]: https://developer.apple.com/design/human-interface-guidelines/dark-mode
[openai-gpt5]: https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide

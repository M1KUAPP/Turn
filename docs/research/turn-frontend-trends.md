# Turn's frontend trends research notes

What changed in trending frontend services and design after September 22,
2026, read for Turn's `docs/DESIGN.md`, the design of an accessibility-first
iPhone app that people use in the middle of a conversation: Google's DESIGN.md
convention and its linter, AI generators that build native apps and the
evidence on how accessible generated interfaces are, React Native libraries for
Expo SDK 57, and the visual trends of 2025 and 2026. Every source was read on
September 23, 2026, and judgment starts with "Synthesis:". The
[frontend trends notes](/docs/research/frontend-trends.md) written for
Guessling on September 22 are linked, not repeated.

Contents:

1.  [Findings for DESIGN.md](#findings-for-designmd)
1.  [The DESIGN.md convention on September 23, 2026](#the-designmd-convention-on-september-23-2026)
1.  [AI generators that build native apps](#ai-generators-that-build-native-apps)
1.  [React Native libraries for Expo SDK 57](#react-native-libraries-for-expo-sdk-57)
1.  [Visual trends through an accessibility lens](#visual-trends-through-an-accessibility-lens)
1.  [How DESIGN.md should serve agents for Turn](#how-designmd-should-serve-agents-for-turn)
1.  [Conflicts between sources](#conflicts-between-sources)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## Findings for DESIGN.md

Synthesis: each line condenses the section it links to, where the sources
are.

- **Keep Google's format and its 0.4.0 pin, and carry the rest yourself.**
  Version 0.4.0 of July 27 is still the newest, the format is still alpha,
  and appearance modes, motion tokens, and accessibility rules exist only as
  open issues and pull requests. See
  [Modes, motion, and accessibility in open proposals](#modes-motion-and-accessibility-in-open-proposals).
- **Put all four appearances in the tokens, where the linter checks them.**
  Nested `light`, `dark`, `light-hc`, and `dark-hc` values for each color, and
  one component per appearance for each text pair, linted clean with every
  appearance's contrast checked; Guessling's file kept three appearances in a
  table the linter never read. See
  [A Turn-shaped sample through the linter](#a-turn-shaped-sample-through-the-linter).
- **Gate on warnings, and test the rest in the app.** A 4.48:1 pair is only a
  warning and exits 0, a key repeated in two `yaml` blocks skips every other
  rule, and nothing checks large text, button edges, text size, or motion, so
  the gate reads `summary.warnings` and the theme file's own test covers the
  PRD's 3:1 edges, wrapping, and Reduce Motion. See
  [What the linter checks](#what-the-linter-checks).
- **Name type tokens after Apple's text styles.** A `dynamicTypeRamp` field
  draws a warning, but a token named `body` or `headline` carries the ramp in
  its name, the mapping HeroUI Native makes in code. See
  [What goes in tokens and what in prose](#what-goes-in-tokens-and-what-in-prose).
- **Write motion as prose, and make Reduce Motion the app's job.** The
  maintainer's answer for motion is a custom section; Reanimated reads the
  setting only at launch, its CSS animations ignore it, and Rive, ordinary
  Lottie files, and Expo's glass and SwiftUI views don't check it. One
  app-level flag has to drive every animation. See
  [Reanimated and Moti](#reanimated-and-moti).
- **Take no component kit.** None of the six kits ships with SDK 57, none
  reads Increase Contrast, and their fixed heights, one-line labels, and
  capped font scaling would need undoing; Expo UI's SwiftUI controls are worth
  a look for Settings. See
  [Styling and component kits](#styling-and-component-kits).
- **Assume generated screens fail on contrast and labels.** Low contrast leads
  every dataset, a bare "make it accessible" helped little or hurt, and
  concrete rules with a review pass helped most, so the file's rules should be
  numbered and testable. See
  [Studies of AI-generated interfaces](#studies-of-ai-generated-interfaces).
- **Use generators to sketch, not to build.** No hosted generator states an
  Expo SDK newer than 54, Rork now writes SwiftUI, Expo's own agent closed on
  July 31, and none documents labels, font scaling, or reduced motion for the
  mobile code it writes. See
  [Generators that emit Expo or native code](#generators-that-emit-expo-or-native-code).
- **Choose calm, legible, and steady over expressive.** After Liquid Glass
  drew legibility complaints, Apple added a tinted option and a slider, and
  Google's expressive research also found that removing labels hurt and that
  a strong minority preferred calmer designs. See
  [What each trend means mid-conversation](#what-each-trend-means-mid-conversation).
- **Keep the bans that protect speed and legibility.** Vercel's "Default to
  stillness", Anthropic's all-caps flag, and Expo's native tells suit Turn;
  the wrap ban, the font bans, and character bans applied to phrases don't.
  See [Bans that don't suit an AAC app](#bans-that-dont-suit-an-aac-app).
- **Point agents to the file from a rule scoped to screen code.** Claude Code
  loads imports in full at every launch and advises files under 200 lines, so
  DESIGN.md should open with the rules agents must not break. See
  [Where agents meet the file](#where-agents-meet-the-file).

## The DESIGN.md convention on September 23, 2026

Google's `google-labs-code/design.md` repository, its releases, issues, and
pull requests, the npm registry, and the CLI itself own these facts. The
earlier notes'
[DESIGN.md convention](/docs/research/frontend-trends.md#the-designmd-convention)
section covers the format's origin, its eight sections, VoltAgent's
collection, and Stitch; this one adds what changed and what the linter does
with a file shaped like Turn's.

### Releases from 0.1.0 to 0.4.0

- **No release since July.** npm's `latest` is still 0.4.0, published July
  27, 2026, after 0.1.0 and 0.1.1 on April 21, 0.2.0 on May 26, and 0.3.0 on
  June 15 ([npm][gdm-npm]). The newest commit on `main` is "release: 0.4.0
  (#161)" ([commits][gdm-commits]), and the format is still "at version
  `alpha`" ([repository][gdm-repo]).
- **What the releases added.** 0.2.0 brought a "Tailwind CSS v4 export" and
  color formats from the CSS Color Module ([0.2.0][gdm-rel-020]); 0.3.0 made
  "Nested YAML like `colors: { background: { light: '#fff' } }`" parse "with
  dot-separated paths (e.g. `colors.background.light`)" ([0.3.0][gdm-rel-030]);
  and 0.4.0 added an "Optional `omitted` frontmatter key", a `css-vars`
  export, "Typography sub-property linting", and "Token name collision
  detection" ([0.4.0][gdm-rel-040]).
- Synthesis: Guessling's pin, `@google/design.md@0.4.0`, is still the newest
  release, and nothing merged since changes what it checks.

[gdm-npm]: https://registry.npmjs.org/@google/design.md
[gdm-commits]: https://github.com/google-labs-code/design.md/commits/main
[gdm-rel-020]: https://github.com/google-labs-code/design.md/releases/tag/0.2.0
[gdm-rel-030]: https://github.com/google-labs-code/design.md/releases/tag/0.3.0
[gdm-rel-040]: https://github.com/google-labs-code/design.md/releases/tag/0.4.0

### The token schema and section order

- **Tokens.** The top-level keys are `version`, `name`, `description`,
  `omitted`, `colors`, `typography`, `rounded`, `spacing`, and `components`
  ([repository][gdm-repo]). A color is "any valid CSS color string",
  "internally converted to sRGB for WCAG contrast checking", and a
  dimension's "Valid units are: px, em, rem." ([specification][gdm-spec])
- **Components and states.** A component has eight property tokens,
  `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`,
  `height`, and `width`, and states are separate keys, "for example,
  "button-primary", "button-primary-hover", "button-primary-active"
  ([specification][gdm-spec]).
- **Tokens as context.** "The token values serve as context and are not
  rendering instructions. Generally, we do not accept or recommend token
  requirements in the specification." ([philosophy][gdm-philosophy])
- **Accessibility in the text.** The only accessibility line is an example,
  "Do maintain WCAG AA contrast ratios (4.5:1 for normal text)"
  ([specification][gdm-spec]); there is no accessibility section, no focus,
  target-size, or text-size token, and no word on text scaling or motion.

### What the linter checks

- **Eleven rules.** `spec --rules-only --format json` in 0.4.0 lists one
  error, `broken-ref`, seven warnings, among them `contrast-ratio`,
  `orphaned-tokens`, and `token-like-ignored`, and three infos
  ([repository][gdm-repo]).
- **Contrast, exactly.** The rule "warns when component
  backgroundColor/textColor pairs fall below the AA minimum of 4.5:1". Its
  source sets `const WCAG_AA_MINIMUM = 4.5;`, skips a component without both
  colors, and never reads the typography, so large text is held to 4.5:1 too
  ([source][gdm-contrast-src]).
- **Only a warning.** In this note's run, a file whose one problem was a
  4.48:1 pair exited with code 0. The help offers "Output format: json or
  text", and `text` still printed JSON.
- **Not checked.** Non-text contrast (WCAG's 3:1 for edges and icons), text
  size, line height, letter spacing, focus indicators, and motion.

[gdm-contrast-src]: https://github.com/google-labs-code/design.md/blob/0.4.0/packages/cli/src/linter/linter/rules/contrast-ratio.ts#L19-L45

### Modes, motion, and accessibility in open proposals

- **Modes: endorsed, not merged.** Issue 13, opened April 21, 2026, comes
  from a team whose "token set has ~100 role tokens maintained in parallel for
  light and dark" ([issue 13][gdm-13]). A maintainer answered on May 1, "I'm
  very supportive of multi-themes", since a common property name "will be
  agent friendly when tooling isn't present" ([comment][gdm-13-may1]), and on
  May 27, "This is at the top of the list." ([comment][gdm-13-may27]) The pull
  request for "multi-theme support via per-token mode values (light/dark)"
  has been open since June 26 ([PR 128][gdm-128]).
- **Motion: a custom section, by design.** Issue 47 proposed "motion tokens
  (duration, easing) with prefers-reduced-motion fallback" ([issue
  47][gdm-47]). The maintainer replied that "DESIGN.md doesn't hard code map
  to CSS or any other rendering syntax", that "DESIGN.md's north star is to
  capture design intent which is a mixture of prose and tokens", and that
  "For now you can always add these as custom tokens with a custom section."
  ([comment][gdm-47-reply]) A pull request adding motion tokens was closed
  unmerged on June 15 ([PR 74][gdm-74]).
- **Accessibility: ten requests, four open pull requests.** Issue 116,
  "DESIGN.md as infrastructure for AI-generated UI", opened June 25, argues
  that "a developer who authors a compliant DESIGN.md file today can
  reasonably feel they have "done their part."" while "nothing in the format
  tells the agent what accessible UI looks like"; its ten requests run from
  non-text contrast and focus-ring tokens to a minimum font size and line
  heights of 1.5 ([issue 116][gdm-116]). Pull requests 141, 142, 143, and 148
  take parts of it and have been open since June 27 and 28 ([PR 141][gdm-141];
  [PR 142][gdm-142]; [PR 143][gdm-143]; [PR 148][gdm-148]).
- **Tokens in section bodies.** Pull request 178, opened September 14, would
  document fenced `yaml` blocks inside sections, where "all blocks are parsed
  and merged into a single design token tree" and "defining the same
  top-level key in multiple blocks is an error" ([PR 178][gdm-178]).
- **Points.** A pull request to accept `pt`, `mm`, `cm`, and `in` "for
  print/PDF design systems" has been open since August 7 ([PR 164][gdm-164]).
- Synthesis: the format has no appearance modes, motion, or accessibility
  vocabulary, and its maintainer points motion to prose; Turn's DESIGN.md
  can't wait for any open pull request.

[gdm-13]: https://github.com/google-labs-code/design.md/issues/13
[gdm-13-may1]: https://github.com/google-labs-code/design.md/issues/13#issuecomment-4362034517
[gdm-13-may27]: https://github.com/google-labs-code/design.md/issues/13#issuecomment-4556180349
[gdm-128]: https://github.com/google-labs-code/design.md/pull/128
[gdm-47]: https://github.com/google-labs-code/design.md/issues/47
[gdm-47-reply]: https://github.com/google-labs-code/design.md/issues/47#issuecomment-4362095391
[gdm-74]: https://github.com/google-labs-code/design.md/pull/74
[gdm-116]: https://github.com/google-labs-code/design.md/issues/116
[gdm-141]: https://github.com/google-labs-code/design.md/pull/141
[gdm-142]: https://github.com/google-labs-code/design.md/pull/142
[gdm-143]: https://github.com/google-labs-code/design.md/pull/143
[gdm-148]: https://github.com/google-labs-code/design.md/pull/148
[gdm-164]: https://github.com/google-labs-code/design.md/pull/164

### A Turn-shaped sample through the linter

Samples in this note's scratch folder went through
`bunx @google/design.md@0.4.0 lint` on September 23, 2026, each with an H1, a
`Contents:` list, the specification's sections, custom sections, and tokens
in fenced `yaml` blocks.

| What the sample tried                                                    | What 0.4.0 reported                                                            |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Each color with nested `light`, `dark`, `light-hc`, and `dark-hc` values | Accepted; exports flatten them to names such as `surface.light-hc`             |
| One component per appearance, each naming leaf tokens                    | 0 errors, 0 warnings, and every appearance's pair contrast-checked             |
| A component naming the group, `{colors.surface}`                         | Error: "does not resolve to any defined token"                                 |
| High-contrast values that no component references                        | One `orphaned-tokens` warning each                                             |
| A pair at 4.48:1, and one at 4.54:1                                      | A warning for the first, nothing for the second                                |
| Bold 34 px text at 3.45:1                                                | Warned against 4.5:1; no large-text threshold                                  |
| `borderColor` on a component                                             | Warning: "not a recognized component sub-token"                                |
| `12pt` in `rounded`, and `64pt` in `spacing`                             | Error: "Only px, rem, and em are allowed"; spacing kept its value silently     |
| `dynamicTypeRamp: body` in a typography token                            | Warning: "not a recognized typography property"                                |
| A `motion:` map with `ms` values, even the philosophy page's own example | Warning `token-like-ignored`: "It will be silently ignored by export commands" |
| 9 px text, `lineHeight: 1`, and `letterSpacing: -0.1em`                  | No warning                                                                     |
| `colors` defined in two `yaml` blocks                                    | One warning, then every other rule skipped: a 1.16:1 pair went unreported      |

- Synthesis: version 0.4.0 can already guard all four of Turn's appearances
  if each color carries nested appearance values and each text pair appears as
  one component per appearance, the specification's own pattern for states.
  Each top-level key must sit in one `yaml` block, and the gate must read
  `summary.warnings`, not the exit code.

### How Stitch and coding agents read the file

- **Stitch, unchanged since September 22.** Its docs still say the linter
  "runs 8 lint rules" ([Stitch CLI][stitch-dmd-cli]) and type a color as "# +
  hex code (sRGB)" ([Stitch specification][stitch-dmd-spec]), and its design
  system panel edits only "primary, secondary, tertiary, and neutral base
  colors", "headline, body, and label font families", and roundedness
  ([Stitch usage][stitch-dmd-usage]), so it can't hold four appearances. The
  earlier notes cover
  [how agents are meant to use DESIGN.md](/docs/research/frontend-trends.md#how-agents-are-meant-to-use-designmd).
- **Claude Code.** It reads `CLAUDE.md` or `AGENTS.md`; "Imported files are
  expanded and loaded into context at launch", its docs advise "target under
  200 lines per CLAUDE.md file", and path-scoped rules "only apply when Claude
  is working with files matching the specified patterns"
  ([Claude Code memory][cc-memory]).
- Synthesis: no page read here says an agent loads a DESIGN.md unless
  something points it there, so where the pointer lives decides whether a
  screen is built with it; a rule scoped to the app's screen files loads it
  when screens change, not in every session.

[stitch-dmd-usage]: https://stitch.withgoogle.com/docs/design-md/usage/

## AI generators that build native apps

Each generator's own docs, `llms.txt` files, changelogs, and repositories own
the product facts; the papers and reports own the measurements. The earlier
notes'
[AI UI generators](/docs/research/frontend-trends.md#ai-ui-generators-in-september-2026)
section covers the web generators and their prices. v0 still builds
"functional web applications" ([v0][v0-faqs]), "Lovable does not generate
projects in React Native" ([Lovable][lovable-publish]), and Figma Make's
codebase beta "is not intended for ... native mobile, or non-web codebases"
([Figma][figma-make-local]).

[v0-faqs]: https://v0.app/docs/faqs
[lovable-publish]: https://docs.lovable.dev/features/publish
[figma-make-local]: https://help.figma.com/hc/en-us/articles/40789739982871-Make-in-your-local-codebase-Setup-gotchas-and-troubleshooting

### Generators that emit Expo or native code

| Tool                                | Emits                                         | Expo version it states                                         | Reads DESIGN.md                                       |
| ----------------------------------- | --------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------- |
| [Bolt.new][bolt-expo-page]          | Expo, when the prompt says "mobile app"       | None; its open-source sibling pins [Expo 53][boltdiy-template] | Only if attached with a [Knowledge rule][bolt-stitch] |
| [a0.dev][a0-upgrade]                | Expo                                          | SDK 54 "as of 11/18/25"                                        | Not mentioned                                         |
| [Rork][rork-expo]                   | SwiftUI, Kotlin, or web; no new Expo projects | Not applicable                                                 | Writes its own [`.rork/DESIGN.md`][rork-modes]        |
| [Vibecode][vibecode-faq]            | React Native and Expo                         | None                                                           | Not mentioned                                         |
| [Anything][anything-mobile]         | Expo                                          | None                                                           | Not mentioned                                         |
| [Replit][replit-mobile]             | Expo                                          | None                                                           | [Yes][replit-designmd]                                |
| [Newly][newly-llms]                 | React Native and Expo                         | SDK 54                                                         | No; reads [`AGENTS.md` or `CLAUDE.md`][newly-tips]    |
| [Google Stitch][stitch-rn-skill]    | HTML and CSS; React Native through a skill    | None                                                           | Yes, its own format                                   |
| [Claude Design][claude-design-help] | HTML, PDF, PPTX, and a handoff to Claude Code | Not applicable                                                 | Not mentioned                                         |
| [Expo Agent][expo-agent-end]        | Expo, SwiftUI, and Compose; closed July 31    | None                                                           | Not applicable                                        |

- **Rork left Expo.** "You can no longer create Expo (React Native) projects
  in Rork. New apps are native iPhone (Swift), native Android (Kotlin), or
  web", because on its benchmarks "the agent wrote better Swift apps than
  React Native apps" ([Rork][rork-expo]); it "saves the design decisions to
  `.rork/DESIGN.md`, so later messages keep the same look"
  ([Rork's modes][rork-modes]).
- **Expo's own agent closed.** Expo Agent, a beta from March 10, 2026, could
  "write real SwiftUI and Jetpack Compose" and was "powered by Claude Code"
  ([beta][expo-agent-beta]); "After July 31, 2026 it won't be available
  anymore", and Expo sends users to "our open-source skills"
  ([Expo][expo-agent-end]).
- **Bolt.** "When you ask Bolt to create a mobile app, it automatically uses
  Expo to make your app work on multiple platforms" ([Bolt][bolt-expo-page]),
  but no Bolt page names an SDK; its open-source sibling, bolt.diy, starts
  Expo apps from a template pinning `"expo": "^53.0.0"`
  ([template][boltdiy-template]).
- **Claude Design.** Launched April 17, 2026, as "a new Anthropic Labs
  product" ([Anthropic][claude-design-news]), it exports files and hands off
  to Claude Code, with no native mobile output in its help pages
  ([help][claude-design-help]), and builds design systems from React
  components, not DESIGN.md ([design systems][claude-design-ds]).
- Synthesis: no hosted generator states an Expo SDK newer than 54, three
  behind Turn's 57, and the one that changed direction went to SwiftUI.
  Generators can sketch Turn's screens; its code comes from the team's agent
  working in the repository with DESIGN.md.

[bolt-expo-page]: https://support.bolt.new/integrations/expo
[boltdiy-template]: https://github.com/xKevIsDev/bolt-expo-template/blob/main/package.json
[bolt-stitch]: https://support.bolt.new/integrations/google-stitch
[rork-modes]: https://docs.rork.com/features/agent-modes
[vibecode-faq]: https://www.vibecodeapp.com/docs/faqs
[anything-mobile]: https://www.anything.com/docs/apps/mobile
[replit-mobile]: https://docs.replit.com/features/artifact-types/building-mobile-apps
[replit-designmd]: https://docs.replit.com/design/design-md
[newly-llms]: https://newly.app/llms.txt
[newly-tips]: https://docs.newly.app/build/prompting-tips
[expo-agent-end]: https://expo.dev/changelog/expo-agent-ending-the-closed-beta-and-winding-the-project-down
[expo-agent-beta]: https://expo.dev/blog/expo-agent-beta
[claude-design-news]: https://www.anthropic.com/news/claude-design-anthropic-labs
[claude-design-ds]: https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design

### What each generator says about accessibility

- **Hosted generators say little.** a0.dev's docs index lists no
  accessibility page ([a0.dev][a0-llms]); Vibecode notes only that "Some users
  may have haptic feedback disabled" ([Vibecode][vibecode-haptics]); Anything
  and Replit mention "large touch targets" and "large tap targets"
  ([Anything][anything-mobbin]; [Replit][replit-mobile-app]); and Rork's
  simulator can change the text size ([Rork][rork-iphone]).
- **Bolt.** Its built-in prompts for "SEO, accessibility, dark mode
  implementation, and error handling" show only inside the app
  ([prompt library][bolt-prompts]). bolt.diy's published system prompt asks
  for `accessibilityLabel`, `accessibilityHint`, and `accessibilityRole`,
  "touch targets are at least 44×44 points", and "reduced motion alternatives
  for animations" ([prompts][boltdiy-prompts]); nothing says Bolt.new uses it.
- **Stitch's React Native skill.** "Every interactive element must have
  `accessibilityLabel` and `accessibilityRole`." ([skill][stitch-rn-skill])
  It says nothing of font scaling, motion, or target sizes.
- **Claude Design.** "Claude can review your design for accessibility,
  contrast ratios, information hierarchy, and general usability."
  ([help][claude-design-help])
- **Expo's skills, the most specific.** "Let labels wrap or reflow before
  considering a per-element `maxFontSizeMultiplier`", and "Never disable
  scaling app-wide with `allowFontScaling={false}`" ([design
  system][expo-ds-skill]); "44×44pt minimum touch target", and "Reduced motion
  means fewer and gentler, not zero: keep opacity and color changes that
  explain a state change, drop translation, scale, parallax and overshoot"
  ([animation][expo-anim-skill]).
- Synthesis: the React Native accessibility rules vendors publish live in
  skills and prompts for agents, Expo's above all, and none checks the code a
  generator ships; Expo's match Turn's PRD closely enough to quote.

[a0-llms]: https://docs.a0.dev/llms.txt
[vibecode-haptics]: https://www.vibecodeapp.com/docs/features/haptics
[anything-mobbin]: https://www.anything.com/docs/import/mobbin
[replit-mobile-app]: https://docs.replit.com/build/mobile-app
[rork-iphone]: https://docs.rork.com/iphone/rork-iphone
[bolt-prompts]: https://support.bolt.new/building/prompt-library
[boltdiy-prompts]: https://github.com/stackblitz-labs/bolt.diy/blob/main/app/lib/common/prompts/prompts.ts

### Studies of AI-generated interfaces

Peer-reviewed studies from 2024 to 2026. All but one measure web code, and
none measures React Native, SwiftUI, or iOS.

- **Model code against human code (TOSEM, June 12, 2026).** Regenerating 473
  files from ten web projects, GPT-4o and Qwen2.5-Coder had lower
  "inaccessibility rates (0.347 and 0.348 vs. 0.425)" than the originals;
  "Contrast Issues (text_contrast_sufficient) dominate, comprising 80% of all
  violations"; and prompting strategies "fail to consistently surpass Naive
  Code Generation" ([preprint][suh-arxiv]; [TOSEM][suh-tosem]). Feeding
  checker results back to the model did best.
- **Native Android screens (MOBILESoft 2025; UAIS, July 30, 2026).** Google's
  Accessibility Scanner found 702 issues in 288 generated screens, "an
  average of 2.44 errors per screen", led by "Contrast (301), followed by
  Context (205)"; asking "Rewrite the screen code to make it accessible."
  produced more errors (387) than not asking (315) ([UAIS][rabelo-uais];
  [preprint][rabelo-pre]; [MOBILESoft][rabelo-mobilesoft]). It is the only
  native-mobile study found.
- **Developers with Copilot (CHI 2025).** "none of the participants,
  including the two who were familiar with web accessibility, prompted with
  accessibility in mind"; an assistant with an accessibility system prompt,
  linter feedback, and reminders did better ([CodeA11y][codea11y]).
- **ChatGPT websites (W4A 2024).** "The majority of websites (84%) generated
  by ChatGPT exhibited many accessibility problems." ([W4A 2024][aljedaani])
- **Specific rules against a vague request (W4A 2025).** A prompt naming 200%
  zoom, 4.5:1 contrast, labels, and 44 by 44 pixel targets cut the experts'
  violation rate from 58.0% to 19.0%, yet contrast and zoom failures rose to
  20% under it ([W4A 2025][gurita]).
- **What checkers miss (CHI 2026, extended abstract).** 300 generated pages
  held "541 semantic violations" that pass axe-core, led by generic buttons
  (27%) and vague links (26%) ([CHI 2026][calo]).
- **Frontier models without guidance (COLM 2026).** Axe inaccessibility rates
  were 0.13 for GPT-5.1, 0.24 for Gemini 3 Pro, and 0.45 for Claude Sonnet
  4.6; training with the checker as a reward cut a base model's rate "by
  87.5%" ([A11yn][a11yn]).
- Synthesis: contrast recurs, a vague request doesn't fix it, and concrete
  numbers, a checker in the loop, and a review pass do. For an AAC app the
  semantic finding matters most: a phrase button's label is its content, and
  no automated checker judges whether it's right.

[suh-tosem]: https://doi.org/10.1145/3820782
[rabelo-pre]: https://www.researchsquare.com/article/rs-7744912/v1
[rabelo-mobilesoft]: https://doi.org/10.1109/MOBILESoft66462.2025.00010
[codea11y]: https://arxiv.org/abs/2502.10884
[aljedaani]: https://doi.org/10.1145/3677846.3677854
[calo]: https://tommasocalo.github.io/papers/26-semacces-chiea.pdf
[a11yn]: https://arxiv.org/abs/2510.13914

### The WebAIM Million in 2026

"95.9% of home pages had detected WCAG 2 failures. This number increased from
94.8% in 2025—reversing a trend of small improvements each of the previous 6
years." Errors averaged 56.1 a page, up 10.1% ([2026][webaim-2026]).

| Failure                             | [2026][webaim-2026] | [2025][webaim-2025] |
| ----------------------------------- | ------------------- | ------------------- |
| Low contrast text                   | 83.9%               | 79.1%               |
| Missing alternative text for images | 53.1%               | 55.5%               |
| Missing form input labels           | 51%                 | 48.2%               |
| Empty links                         | 46.3%               | 45.4%               |
| Empty buttons                       | 30.6%               | 29.6%               |
| Missing document language           | 13.5%               | 15.8%               |

- **ARIA.** Pages with ARIA "had significantly more errors (59.1 on average)
  than pages without ARIA (42 on average)" ([2026][webaim-2026]).
- **AI, as WebAIM reads it.** The trends "likely reflect broader shifts in
  web development including increased reliance on 3rd party frameworks and
  libraries and automated or AI-assisted coding practices ("vibe coding")"
  ([2026][webaim-2026]); the report doesn't measure generated pages.
- Synthesis: in a native app these become low-contrast text, unlabeled
  images, and empty buttons, which the PRD's A11Y-2, A11Y-7, and A11Y-8
  already forbid.

[webaim-2026]: https://webaim.org/projects/million/
[webaim-2025]: https://webaim.org/projects/million/2025

### Vendor and benchmark measurements

None of these is peer reviewed.

- **Microsoft's A11y LLM Eval, May 2026.** With "8 models | 32 prompt cases |
  1280 control samples" and no accessibility guidance, pages passed its checks
  12% of the time; a one-line instruction raised that to 37%, a longer rule
  set to 60%, and a skill with a review turn to 86%. Color contrast was 89.1%
  of failures, and passing means only the harness's checks passed, "not that
  the page is WCAG conformant" ([Microsoft][ms-eval]).
- **AIMAC.** The GAAD Foundation's benchmark of "60 models" finds that
  "80-90% of violations are color-contrast issues" ([AIMAC][aimac]).

[aimac]: https://aimac.ai/

## React Native libraries for Expo SDK 57

The npm registry owns versions, dates, and licenses; each library's docs and
source own the rest. `expo` 57.0.24, published September 18, 2026, is the
newest 57.x, and SDK 58 has been in beta since September 15 ([npm][npm-expo];
[SDK 58 beta][expo-sdk58-beta]). The iOS design notes'
[package versions](/docs/research/ios-design.md#package-versions-in-sdk-57)
still hold for the modules SDK 57 pins.

[npm-expo]: https://registry.npmjs.org/expo

### Versions and licenses on September 23, 2026

| Package                               | npm latest, published           | SDK 57 pin | License                  | Honors Reduce Motion by itself            |
| ------------------------------------- | ------------------------------- | ---------- | ------------------------ | ----------------------------------------- |
| [`@expo/ui`][npm-expo-ui]             | 57.0.19, September 18           | ~57.0.19   | MIT                      | No; `animation` modifier is ungated       |
| [`expo-glass-effect`][npm-glass]      | 57.0.3, September 11            | ~57.0.3    | MIT                      | No; `animate` is ungated                  |
| [`expo-router`][npm-router]           | 57.0.22, September 18           | ~57.0.22   | MIT                      | System tab bar                            |
| [`react-native-reanimated`][npm-rea]  | 4.7.0, September 18             | 4.5.1      | MIT                      | Read at launch; not in CSS animations     |
| [`moti`][npm-moti]                    | 0.30.0, January 29, 2025        | None       | MIT                      | As Reanimated                             |
| [`@rive-app/react-native`][npm-rive]  | 0.4.20, August 19               | None       | MIT                      | No                                        |
| [`lottie-react-native`][npm-lottie]   | 7.5.0, August 22                | ~7.3.8     | Apache-2.0               | Only with a "reduced motion" marker       |
| [`nativewind`][npm-nativewind]        | 4.2.7, September 14; 5.0.0-rc.0 | None       | MIT                      | A media query in v4, dropped in the v5 RC |
| [`react-native-unistyles`][npm-uni]   | 3.3.0, July 10                  | None       | MIT                      | No                                        |
| [`tamagui`][npm-tamagui]              | 2.7.7, August 15                | None       | MIT file; registry empty | As Reanimated; its toast ignores it       |
| [`@gluestack-ui/core`][npm-gluestack] | 5.0.15, June 25                 | None       | MIT                      | As Reanimated in part                     |
| [`heroui-native`][npm-heroui]         | 1.0.10, September 21            | None       | Apache-2.0               | Yes, a global switch                      |
| [`@rn-primitives/dialog`][npm-rnp]    | 1.5.2, July 2                   | None       | MIT                      | Explicit `ReduceMotion.System` on `main`  |

Dates are in 2026 unless marked; pins are from SDK 57's
[`bundledNativeModules.json`][expo-bundled-57], and the sections below source
the last column. SDK 57's default template already depends on `@expo/ui`,
`expo-glass-effect`, `expo-router`, and Reanimated ([template][expo-template]).
`@rn-primitives` packages underlie React Native Reusables.

[npm-expo-ui]: https://registry.npmjs.org/@expo/ui
[npm-glass]: https://registry.npmjs.org/expo-glass-effect
[npm-router]: https://registry.npmjs.org/expo-router
[npm-rea]: https://registry.npmjs.org/react-native-reanimated
[npm-rive]: https://registry.npmjs.org/@rive-app/react-native
[npm-lottie]: https://registry.npmjs.org/lottie-react-native
[npm-nativewind]: https://registry.npmjs.org/nativewind
[npm-uni]: https://registry.npmjs.org/react-native-unistyles
[npm-tamagui]: https://registry.npmjs.org/tamagui
[npm-gluestack]: https://registry.npmjs.org/@gluestack-ui/core
[npm-heroui]: https://registry.npmjs.org/heroui-native
[npm-rnp]: https://registry.npmjs.org/@rn-primitives/dialog
[expo-template]: https://unpkg.com/expo-template-default@57.0.26/package.json

### Expo UI, glass views, and native tabs

- **Expo UI.** Its SwiftUI views take `accessibilityLabel`,
  `accessibilityHint`, `accessibilityValue`, and `accessibilityInputLabels`,
  which "Sets alternative spoken phrases that Voice Control uses to refer to
  the view"; a font with a `textStyle` scales "with the user's Dynamic Type
  setting", while a size alone is a "Fixed-size system font (no Dynamic Type
  scaling)" ([modifiers][expo-ui-modifiers]). Its `animation` modifier doesn't
  check Reduce Motion ([source][expo-ui-registry]).
- **`expo-glass-effect`.** Its availability check "may also be true if the
  user has enabled accessibility settings that limit the Liquid Glass effect",
  so Expo points to `AccessibilityInfo.isReduceTransparencyEnabled()`
  ([docs][expo-glass-57]); the module has no Reduce Transparency, Increase
  Contrast, or Reduce Motion code, and `animate` runs `UIView.animate`
  unconditionally ([source][glass-view-src]).
- **Native tabs.** SDK 57 imports them from
  `expo-router/unstable-native-tabs`, and SDK 58 moves them to
  `expo-router/native-tabs`, "also stable" ([guide][expo-native-tabs];
  [SDK 58 beta][expo-sdk58-beta]); since 57.0.5, a tab's screen-reader label
  "Defaults to the visible tab label" ([source][expo-router-types]). The TRD's
  routes have no tabs ([TRD][trd-screens]).
- Synthesis: Expo UI's SwiftUI controls bring SwiftUI's VoiceOver behavior,
  Voice Control names, and Dynamic Type when fonts use `textStyle`, so they
  suit Settings' switches and pickers; the row and the grid stay React Native
  `Pressable` buttons, as the TRD plans ([TRD][trd-a11y]).

[expo-ui-modifiers]: https://docs.expo.dev/versions/v57.0.0/sdk/ui/swift-ui/modifiers/
[expo-ui-registry]: https://github.com/expo/expo/blob/sdk-57/packages/expo-ui/ios/Modifiers/ViewModifierRegistry.swift
[expo-glass-57]: https://docs.expo.dev/versions/v57.0.0/sdk/glass-effect/
[glass-view-src]: https://github.com/expo/expo/blob/sdk-57/packages/expo-glass-effect/ios/GlassView.swift
[expo-native-tabs]: https://docs.expo.dev/router/advanced/native-tabs/
[expo-router-types]: https://github.com/expo/expo/blob/sdk-57/packages/expo-router/src/native-tabs/types.ts
[trd-screens]: /docs/TRD.md#screens-and-navigation
[trd-a11y]: /docs/TRD.md#accessibility-in-the-app

### Styling and component kits

- **None ships with SDK 57.** None of the six is in SDK 57's
  `bundledNativeModules.json` ([bundled][expo-bundled-57]); Expo's Tailwind
  guide names "NativeWind or Uniwind" for native styling
  ([Expo][expo-tailwind]).
- **SDK 57 support.** "Nativewind v4.2.7 adds Expo SDK 57 support"
  ([NativeWind][nativewind-install]), HeroUI Native upgraded "as per expo 57"
  ([HeroUI][heroui-changelog]), and Tamagui's starter moved to SDK 57 on
  `main` after 2.7.7 ([Tamagui][tamagui-starter]), while gluestack's starter
  kit still pins Expo 56 ([gluestack][gluestack-starter]).
- **Font scaling.** HeroUI Native caps its avatar text with
  `maxFontSizeMultiplier={1.4}` ([source][heroui-avatar]), and its provider
  docs set `allowFontScaling: false` under the comment "Disable font scaling
  for accessibility" ([provider][heroui-provider]); Tamagui's button label
  sets `ellipsis: true` ([source][tamagui-button]); and HeroUI's buttons have
  fixed heights ([source][heroui-button-css]). On the other side, HeroUI maps
  headings and body text to `dynamicTypeRamp` ([source][heroui-text]), and
  Unistyles exposes the content size category, "especially useful for users
  with visual impairments" ([Unistyles][unistyles-csc]).
- **Roles.** React Native Reusables' primitives set roles for checkboxes,
  switches, dialogs, and headings, and a July release fixed menus and
  popovers that were "unusable with VoiceOver & TalkBack"
  ([rn-primitives][rnp-151]); gluestack tests with "NVDA and JAWS", desktop
  screen readers ([gluestack][gluestack-a11y]).
- **Increase Contrast.** In the docs and source searched for this note, no
  kit reads it; themes switch between light and dark only.
- **Reduce Motion.** HeroUI Native disables "all animations" when "Reduce
  Motion" is on ([HeroUI][heroui-animation]); NativeWind 4 handles
  `prefers-reduced-motion` ([source][css-interop-conditions]), which the v5
  release candidate's native conditions drop ([source][rncss-media-query]);
  and Tamagui's toast says "on native, we could use
  AccessibilityInfo.isReduceMotionEnabled() but that requires async, so
  default to false" ([source][tamagui-toast]).
- Synthesis: every kit brings habits Turn would have to undo, and none adds
  what React Native lacks for Increase Contrast; a phrase button, the big
  button, the strip, the light, the caption, and the consent card are
  cheaper to build on `Pressable`, `Text`, and `DynamicColorIOS`.

[expo-tailwind]: https://docs.expo.dev/guides/tailwind/
[nativewind-install]: https://www.nativewind.dev/docs/getting-started/installation
[heroui-changelog]: https://github.com/heroui-inc/heroui-native/blob/main/CHANGELOG.md
[tamagui-starter]: https://github.com/tamagui/tamagui/blob/main/code/starters/expo-router/package.json
[gluestack-starter]: https://github.com/gluestack/gluestack-ui/blob/main/apps/starter-kit-expo/package.json
[heroui-avatar]: https://unpkg.com/heroui-native@1.0.10/src/components/avatar/avatar.tsx
[heroui-provider]: https://heroui.com/en/docs/native/getting-started/provider
[tamagui-button]: https://unpkg.com/@tamagui/button@2.7.7/src/Button.tsx
[heroui-button-css]: https://unpkg.com/heroui-native@1.0.10/src/styles/components/button.css
[heroui-text]: https://unpkg.com/heroui-native@1.0.10/src/components/text/text.constants.ts
[unistyles-csc]: https://www.unistyl.es/v3/references/content-size-category/
[rnp-151]: https://github.com/roninoss/rn-primitives/releases/tag/all%401.5.1
[gluestack-a11y]: https://gluestack.io/ui/docs/home/core-concepts/accessibility
[heroui-animation]: https://heroui.com/en/docs/native/getting-started/animation
[css-interop-conditions]: https://unpkg.com/react-native-css-interop@0.2.7/src/runtime/native/conditions.ts
[rncss-media-query]: https://unpkg.com/react-native-css@3.1.0-rc.0/src/native/conditions/media-query.ts
[tamagui-toast]: https://unpkg.com/@tamagui/toast@2.7.7/src/useReducedMotion.ts

### Reanimated and Moti

- **Read once at launch.** `useReducedMotion` returns "A boolean indicating
  whether the reduced motion setting was enabled when the app started", and
  "Changing the reduced motion system setting doesn't cause your components
  to rerender" ([docs][rea-use-reduced]); 4.7.0's hook still returns a
  constant set when its module loads ([source][rea-hook-470]). The iOS design
  notes give the full
  [Reduce Motion behavior](/docs/research/ios-design.md#reduce-motion-in-reanimated).
- **CSS animations still ignore it.** A maintainer's commit in an unmerged
  pull request says "CSS has no reduced-motion support, but the hook
  Reanimated exports can drive the duration instead"
  ([PR 10058][rea-pr-10058]), though `ReducedMotionConfig` is said to disable
  "all animation" ([docs][rea-reduced-config]).
- **Moti.** No release since 0.30.0 of January 29, 2025 ([npm][npm-moti]);
  its guide says "Version 2 and 3 are both compatible" ([docs][moti-install]),
  a Reanimated 4 upgrade has been an open pull request since August 2025
  ([PR 389][moti-389]), and an open issue reports that "after upgrading to
  expo 54 moti animation happened strangely or not worked at all"
  ([issue 391][moti-391]).
- Synthesis: a `withRepeat` pulse on the listening light obeys Reduce Motion
  only if the setting was on at launch, so the app needs its own flag, kept
  current by the `reduceMotionChanged` event ([React Native][rn-a11yinfo]),
  that stops the pulse and swaps movement for a fade (A11Y-6). Moti adds
  nothing Turn needs.

[rea-use-reduced]: https://docs.swmansion.com/react-native-reanimated/docs/device/useReducedMotion/
[rea-hook-470]: https://github.com/software-mansion/react-native-reanimated/blob/4.7.0/packages/react-native-reanimated/src/hook/useReducedMotion.ts
[rea-pr-10058]: https://github.com/software-mansion/react-native-reanimated/pull/10058
[rea-reduced-config]: https://docs.swmansion.com/react-native-reanimated/docs/device/ReducedMotionConfig/
[moti-install]: https://github.com/nandorojo/moti/blob/master/docs/docs/installation.md
[moti-389]: https://github.com/nandorojo/moti/pull/389
[moti-391]: https://github.com/nandorojo/moti/issues/391
[rn-a11yinfo]: https://reactnative.dev/docs/0.86/accessibilityinfo

### Rive and Lottie

- **Rive.** "Rive does not automatically apply reduced motion"; a file needs
  a data-bound property "such as prefersReducedMotion", and "In the future,
  runtimes may expose a built-in reduced motion value" ([Rive][rive-reduced]).
  Its React Native runtime gets a `semantics` prop for VoiceOver only in the
  0.5.0 beta ([source][rive-rn-semantics]).
- **Lottie.** `lottie-react-native` pins lottie-ios 4.6.0 and has no
  reduced-motion prop ([podspec][lottie-podspec]); lottie-ios plays a marker
  named "reduced motion" when the setting is on, if the file has one
  ([lottie-ios][lottie-reduced]), so an ordinary file keeps animating.
- Synthesis: neither stops under Reduce Motion without work in the file or
  the app, and Turn's light and row need neither; they belong to the pitch
  video at most.

[rive-reduced]: https://rive.app/docs/editor/accessibility/reduced-motion
[rive-rn-semantics]: https://github.com/rive-app/rive-nitro-react-native/blob/v0.5.0-beta.5/src/core/Semantics.ts
[lottie-podspec]: https://github.com/lottie-react-native/lottie-react-native/blob/v7.3.8/packages/core/lottie-react-native.podspec
[lottie-reduced]: https://github.com/airbnb/lottie-ios/blob/4.6.0/Sources/Public/Configuration/ReducedMotionOption.swift

## Visual trends through an accessibility lens

Apple's, Google's, W3C's, and researchers' own pages own these facts. The
earlier notes cover the announcements, including
[what Apple's settings do to Liquid Glass](/docs/research/frontend-trends.md#apples-liquid-glass),
and [Turn's iOS design notes](/docs/research/turn-ios-design.md) cover the
platform's APIs.

### Liquid Glass and its legibility

- **The critique.** Nielsen Norman Group, October 10, 2025: "The result is
  light, airy — and often invisible."; "Text on top of images is a bad idea";
  and "The interface is restless, needy, less predictable, less legible, and
  constantly pulling focus" ([NN/g][nng-glass]), an expert review, not a
  study.
- **Low-vision users.** AppleVis's report card of March 17, 2026: the
  redesign "had a significant negative impact on the user experience for
  many" low-vision users ([AppleVis][applevis], read through the Internet
  Archive because the site blocks bots).
- **Apple's changes in iOS 26.** iOS 26.1 (November 3, 2025) added "a new
  tinted option for Liquid Glass" that "increases opacity of the material";
  iOS 26.2 (December 12, 2025) gave the Lock Screen clock "more or less
  opacity"; and iOS 26.4 (March 24, 2026) added a "Reduce bright effects
  setting" and made Reduce Motion "more reliably" reduce "the animations of
  Liquid Glass" ([About iOS 26 Updates][ios26-updates];
  [dates][apple-security]).
- **iOS 27.** "Liquid Glass refinements improve overall readability, and a
  new slider in Settings lets you personalize its appearance from
  ultra-clear to fully tinted" ([About iOS 27 Updates][ios27-updates]); with
  Reduce Transparency or Increase Contrast on, "you need to turn them off to
  change the look for Liquid Glass" ([iPhone User Guide][ios27-guide]). Apps
  rebuilt with Xcode 27 can't keep the old design: "We'll be removing support
  for opting to use the old design" ([State of the Union][wwdc26-sotu]).
- Synthesis: Turn's system bars and sheets will be glass that users can make
  nearly opaque, while the grid, the row, the strip, and the caption are
  content and stay solid, as Apple's "Don't use Liquid Glass in the content
  layer" asks ([HIG][hig-materials]); test at both ends of the slider and with
  Reduce Transparency and Increase Contrast on.

[ios26-updates]: https://support.apple.com/en-us/123075
[apple-security]: https://support.apple.com/en-us/100100
[ios27-updates]: https://support.apple.com/en-us/149076
[ios27-guide]: https://support.apple.com/guide/iphone/adjust-iphone-display-and-text-settings-iphd6804774e/ios
[wwdc26-sotu]: https://developer.apple.com/videos/play/wwdc2026/102/
[hig-materials]: https://developer.apple.com/design/human-interface-guidelines/materials

### Material 3 Expressive and older users

- **Faster finding.** In eye tracking across 10 apps, "Participants were able
  to spot key UI elements up to four times faster in the M3 Expressive
  designs" ([Google][dg-m3e]).
- **Age and ability.** "Usability tests typically find that older adults
  take longer to visually locate key UI elements. But with M3 Expressive
  versions, we've seen a dramatic erasure of age effects in fixation times,
  helping 45-plus-year-old users perform on par with their younger
  counterparts." Expressive designs were also "more visually appealing,
  intuitive, and easy to use for participants with varying movement and
  visual abilities" ([Google][dg-m3e]).
- **The limits Google states.** "removing text labels from email actions
  resulted in decreased usability", results were "impacted by users' lack of
  familiarity", and "a strong minority of users preferred calmer, less intense
  versions" ([Google][dg-m3e]); the article gives no participant counts and
  cites no paper.
- Synthesis: the evidence backs large, contained, high-contrast buttons with
  text labels, which Turn already plans, not shape morphing or springy
  motion; Google's "older" starts at 45, and NN/g's at 65
  ([NN/g][nng-seniors-2019]).

[dg-m3e]: https://design.google/library/expressive-material-design-google-research

### Tactile depth and clear signifiers

- **First parties.** Apple says Liquid Glass responds to touch "to reinforce
  the feeling of a tactile experience", and the same page says "Make motion
  optional" ([HIG][hig-motion]); Figma's 2026 list praises "raised or inset
  elements that look almost touchable" ([Figma][figma-trends]).
- **The evidence is about signifiers.** In NN/g's 2017 eyetracking study of
  71 participants, weak signifiers cost "22% more time" and "25% more
  fixations" ([NN/g][nng-flat]), and young adults "don't enjoy click
  uncertainty any more than other age groups" ([NN/g][nng-flat-long]).
- Synthesis: Turn's buttons need strong static signifiers, a filled shape and
  a 3:1 edge (A11Y-7), the part of "tactile" that survives Reduce Motion;
  Apple's tactile feel arrives through motion those users switch off.

[hig-motion]: https://developer.apple.com/design/human-interface-guidelines/motion
[nng-flat]: https://www.nngroup.com/articles/flat-ui-less-attention-cause-uncertainty/
[nng-flat-long]: https://www.nngroup.com/articles/flat-design-long-exposure/

### Bold, large, and variable type

- **First parties.** Google Sans Flex varies "weight, width, optical size,
  slant, grade, and roundedness" ([Google][gsf]); Apple says "avoid
  Ultralight, Thin, and Light font weights", added "emphasized weights to the
  Dynamic Type style specifications" on December 16, 2025 ([HIG][hig-type]),
  and dropped all-caps section headers, which "no longer render entirely in
  capital letters" ([Adopting Liquid Glass][apple-adopting]).
- **Capitals and weight.** W3C: "Text in all capital letters is more
  difficult to read for most people, with and without disabilities", and "For
  some people, bold text is easier to read" ([W3C][w3c-lowvision]). The
  Readability Consortium found "Older participants read faster at bold
  weights of serif font" ([poster][readability-bold]), while a 2026 study of
  22 young adults reading through simulated low vision found ACT Easy
  Regular's "advantage over Gotham and ACT Easy Bold were significant"
  ([PLOS One][legge-2026]).
- **Age and polarity.** NN/g: "a 50-year old user will need about 11% more
  time than a 30-year old user" ([NN/g][nng-font]); a Google study of 459
  readers found "dark text on a light background (Light Mode) is read
  reliably faster than its polar opposite (Dark Mode)"
  ([CHI 2023][readability-polarity]).
- Synthesis: size is the robust lever and weight isn't settled, so phrases
  should be large system text that follows Dynamic Type and Bold Text, in
  sentence case, never thin or in capitals, and dark mode follows the user's
  setting, not a trend.

[gsf]: https://design.google/library/google-sans-flex-font
[hig-type]: https://developer.apple.com/design/human-interface-guidelines/typography
[apple-adopting]: https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass
[nng-font]: https://www.nngroup.com/articles/best-font-for-online-reading/

### Calm technology

- **The idea.** "A calm technology will move easily from the periphery of our
  attention, to the center, and back." (Weiser and Brown, December 21, 1995,
  [via the Internet Archive][calm-1995])
- **The principles.** "Technology should require the smallest possible amount
  of attention", "Technology should work even when it fails", and "The right
  amount of technology is the minimum needed to solve the problem"
  ([Calm Technology][calmtech]); the Calm Tech Institute certifies products,
  "Websites and Apps" among them, "against an 81-point framework"
  ([certified][calmtech-certified]; [certification][calmtech-cert]).
- **As a 2026 mood.** Pantone called its 2026 color "a whisper of calm and
  peace in a noisy world" ([Pantone][pantone-2026]).
- Synthesis: calm technology describes Turn's light and row: the light stays
  in the periphery until it matters, the row comes to the center only when a
  phrase fits, and "work even when it fails" is the phone's ranking offline.

[calm-1995]: https://web.archive.org/web/19990420044335/http://www.ubiq.com:80/weiser/calmtech/calmtech.htm
[calmtech]: https://calmtech.com/
[calmtech-certified]: https://www.calmtech.institute/calm-tech-certified
[calmtech-cert]: https://www.calmtech.institute/calm-tech-certification
[pantone-2026]: https://www.pantone.com/articles/press-releases/pantone-announces-color-of-the-year-2026-cloud-dancer

### Sameness in generated design

- **Purple's origin, from its author.** The creator of Tailwind CSS, August 7,
  2025: "I'd like to formally apologize for making every button in Tailwind UI
  `bg-indigo-500` five years ago, leading to every AI generated UI on earth
  also being indigo." ([X][wathan])
- **OpenAI.** Models "fall back to high-frequency patterns from the training
  data", and its sample prompt says "avoid purple-on-white defaults. No
  purple bias or dark mode bias." (March 20, 2026, [OpenAI][openai-gpt54])
- **Expo, for native apps.** Expo's design skill lists "Recurring mistakes in
  generated React Native apps", among them "The Purple-Gradient Hero", "Inter
  Everywhere", "The Squish Reflex", "The Grand Entrance", and "Dark-Mode
  Amnesia", and keeps the list "near 20 entries: recognition degrades with
  length" (September 9, 2026, [Expo][expo-native-slop]).
- The earlier notes collect
  [Anthropic's, Google's, Webflow's, Figma's, and Vercel's critiques](/docs/research/frontend-trends.md#critiques-of-ai-generated-sameness).
- Synthesis: for Turn, sameness matters less than inaccessibility; the tells
  worth banning also cost legibility or steadiness, such as entrances,
  squish on every press, and colors that break in dark mode.

[wathan]: https://x.com/adamwathan/status/1953510802159219096
[openai-gpt54]: https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4

### Design for older adults

- **NN/g.** "Users aged 65 and older are 43% slower at using websites than
  users aged 21–55", seniors succeeded 55.3% of the time against 74.5%, and
  "drastic design changes hurt seniors the most"
  ([NN/g, 2013][nng-seniors-2013]); in 2019, with 123 participants aged 65
  and older, mobile text was "often too small and lightly colored"
  ([NN/g, 2019][nng-seniors-2019]).
- **W3C.** Ageing can bring "reduced contrast sensitivity, color perception,
  and near-focus", "reduced dexterity and fine motor control", and "reduced
  short-term memory, difficulty concentrating, and being easily distracted"
  ([W3C][w3c-older]); its WCAG mapping adds that "Some older people are
  particularly distracted by any movement and sound"
  ([W3C mapping][w3c-older-dev]) and predates WCAG 2.2's target sizes.
- Synthesis: Turn's users include people after a stroke and with Parkinson's
  disease ([product][product-users]), many of them older, and each finding
  lands on a PRD rule: larger, darker text (A11Y-4, A11Y-7), large targets
  (A11Y-1), nothing that moves on its own (A11Y-6), and no layout change the
  user didn't make (BANK-4, ROW-5).

[nng-seniors-2013]: https://www.nngroup.com/articles/usability-seniors-improvements/
[w3c-older]: https://www.w3.org/WAI/older-users/
[w3c-older-dev]: https://www.w3.org/WAI/older-users/developing/
[product-users]: /docs/PRODUCT.md#users-and-partners

### What each trend means mid-conversation

| Trend                      | Accessibility risk                                      | What Turn takes                            |
| -------------------------- | ------------------------------------------------------- | ------------------------------------------ |
| Liquid Glass               | Low contrast over content; restless motion              | Glass only in system bars; solid phrases   |
| Material 3 Expressive      | Unfamiliar layouts; motion; lost labels                 | Big contained buttons with text labels     |
| Tactile depth              | Signifiers carried by motion vanish under Reduce Motion | Filled buttons with 3:1 edges              |
| Bold, large, variable type | Thin weights, capitals, type over images                | Large system text, Dynamic Type, Bold Text |
| Calm technology            | None found                                              | The model for the light and the row        |
| Dark-first palettes        | Light mode reads faster in one study                    | Follow the system in four appearances      |
| AI-generated sameness      | Generated screens fail contrast and labels              | Numbered, testable rules in DESIGN.md      |

- Synthesis: mid-conversation, the user's hand has learned where things are
  and the partner is waiting, so any trend that moves, hides, or restyles a
  control costs a turn; the AAC evidence for fixed positions points the same
  way ([AAC notes][aac-fixed]).

[aac-fixed]: /docs/research/aac-practice.md#fixed-button-positions-and-motor-automaticity

## How DESIGN.md should serve agents for Turn

Synthesis throughout: this section applies the ones above to the PRD's
[accessibility requirements](/docs/PRD.md#accessibility) and the TRD's
[accessibility in the app](/docs/TRD.md#accessibility-in-the-app).

### What goes in tokens and what in prose

- **Tokens** hold what an agent must copy exactly and the linter can check:
  every color in four appearances; type styles named after Apple's text
  styles (`largeTitle`, `title2`, `headline`, `body`, `callout`, `footnote`)
  at their default sizes in `px`, read as points; the size scale, including
  the 44-point target floor and the 64-point row slot; corner radii; and one
  component per appearance for each text pair.
- **Prose** holds what tokens can't: one specific reference for Turn's
  look, since "A specific reference describes a point."
  ([philosophy][gdm-philosophy]); the rules that are behaviors (the row never
  moves or resizes, the grid never reorders, text wraps and is never cut off,
  a label is the visible text, nothing acts on touch-down, nothing speaks
  without a tap); the motion table; and the checks.
- **Values in code too.** The earlier finding still holds that the theme file
  mirrors the tokens under a unit test
  ([earlier findings](/docs/research/frontend-trends.md#findings-for-designmd));
  a script from the `dtcg` or `css-vars` export to `DynamicColorIOS` is short,
  since the exporters flatten appearances to names such as `surface.light-hc`.
- **Concrete over hopeful.** Vague requests failed in the studies and
  concrete numbers helped, so each rule states a number or a test, such as
  "text reaches 4.5:1 in all four appearances" or "at the largest
  accessibility size, no phrase is cut off".

### Appearances, contrast, and motion the format lacks

- **Appearances.** The nested `light`, `dark`, `light-hc`, and `dark-hc`
  values map one to one onto `DynamicColorIOS`'s `light`, `dark`,
  `highContrastLight`, and `highContrastDark` ([React Native][rn-dynamic]);
  pull request 128's `{ light, dark }` form would cover only two of the four.
  One rule, nothing behind a phrase is translucent, keeps these the whole
  color story, since the system's glass bars adapt by themselves.
- **Edges and large text.** A table lists the button-edge and glyph pairs that
  need 3:1, checked by the theme test, since the linter can't see edges and
  holds large text to 4.5:1.
- **Reduce Motion.** A prose table gives each animation its normal and its
  Reduce Motion behavior, following Expo's "fewer and gentler, not zero"
  ([animation][expo-anim-skill]), and names the one app-level flag every
  animation reads.
- **Dynamic Type.** One rule and one test: at the largest accessibility size,
  phrases wrap and the grid scrolls (A11Y-4), with no `maxFontSizeMultiplier`
  on a phrase and no `allowFontScaling={false}` anywhere, as Expo's skill
  says ([design system][expo-ds-skill]).

[rn-dynamic]: https://reactnative.dev/docs/0.86/dynamiccolorios

### Bans that suit an AAC app

| Ban                                                               | Source                     | Why it suits Turn                                  |
| ----------------------------------------------------------------- | -------------------------- | -------------------------------------------------- |
| "Default to stillness"; no "decorative pulsing status indicators" | [Vercel][vercel-design-md] | The light pulses only if the pulse means something |
| "The Grand Entrance": staggered entrance animations               | [Expo][expo-native-slop]   | The row changes in place; nothing slides in        |
| "The Squish Reflex": scaling every touchable on press             | [Expo][expo-native-slop]   | Buttons stay where the hand learned them           |
| "Dark-Mode Amnesia": hardcoded colors                             | [Expo][expo-native-slop]   | Four appearances, all from tokens                  |
| "Using all caps for labels"                                       | [Anthropic][anth-fd]       | Capitals read slower                               |
| "generic glassmorphism on everything"                             | [Taste Skill][local-taste] | No glass behind phrases                            |
| "infinite-loop micro-animations everywhere"                       | [Taste Skill][local-taste] | Motion answers the user                            |
| "Visible theme controls"                                          | [Vercel][vercel-design-md] | The app follows the system's appearance            |

- **What they share.** Anthropic's skill welcomes motion "that answers a
  person's action (opening, expanding, confirming)" when it "shows what
  changed" ([Anthropic][anth-fd]), and Taste Skill gives
  "accessibility-critical" work its lowest motion dial, noting that such
  "constraints OVERRIDE aesthetic preference" ([Taste Skill][local-taste]).
- The list stays short, as Expo and Google both advise
  ([Expo][expo-native-slop]; [philosophy][gdm-philosophy]), and every ban on
  it protects the user's speed or legibility, not a brand.

### Bans that don't suit an AAC app

- **The wrap ban.** Taste Skill's "CTA BUTTON WRAP BAN (mandatory): Button
  text MUST fit on one line at desktop" ([Taste Skill][local-taste]) would
  push an agent to cut or shorten a phrase, while Turn's text must wrap at
  every size (A11Y-4).
- **Character bans on content.** Taste Skill's "zero em-dashes" and Vercel's
  "Em dashes" ([Taste Skill][local-taste]; [Vercel][vercel-design-md]) can
  govern the team's interface copy at most, never a phrase, which is the
  user's own words ([principles][product-principles]).
- **Font bans.** The earlier notes record bans on Inter and on "default
  system fonts"
  ([earlier notes](/docs/research/frontend-trends.md#anthropics-frontend-design-skill));
  for Turn the system font is the accessible choice, and Expo's fix for
  "Inter Everywhere" is "System type (SF / Roboto) by default"
  ([Expo][expo-native-slop]).
- **Edges read as clutter.** Expo flags "A 1px gray `borderWidth` outlining
  every container" ([Expo][expo-native-slop]), but a phrase button's 3:1 edge
  is a signifier the PRD requires (A11Y-7): edges on buttons, not containers.
- **Web-page scope.** Taste Skill lists "Native mobile (use Apple HIG /
  Material directly)" as out of scope ([Taste Skill][local-taste]), and
  Anthropic's skill plans "web designs" around a "hero" and flags "tinted
  near-black (#0B0B0B, #111) standing in for black" ([Anthropic][anth-fd]);
  an app used mid-conversation has no hero, and its dark colors come from the
  contrast table.

[product-principles]: /docs/PRODUCT.md#product-principles

### Where agents meet the file

- A short rule scoped to the app's screen files, as Claude Code's path-scoped
  rules allow, can hold the rules agents must not break and point to
  DESIGN.md, instead of an import that loads the whole file into every
  session ([Claude Code memory][cc-memory]).
- DESIGN.md opens with those rules, numbered, before any tokens, since longer
  instruction files "reduce adherence" ([Claude Code memory][cc-memory]) and
  Expo keeps its list short for the same reason ([Expo][expo-native-slop]).
- The file names its gate: `bunx @google/design.md@0.4.0 lint` piped to
  `jq -e '.summary.errors == 0 and .summary.warnings == 0'`, the theme test,
  and a review turn in which the agent checks each screen against the rules,
  the step that lifted Microsoft's pass rates most ([Microsoft][ms-eval]).

## Conflicts between sources

- **The philosophy page and the linter.** PHILOSOPHY.md says of its motion
  example, "The linter accepts these values and agents read the prose"; 0.4.0
  warns `token-like-ignored` on that exact block ([philosophy][gdm-philosophy];
  this note's run).
- **Repeated keys.** Pull request 178 would make "defining the same top-level
  key in multiple blocks" an error; 0.4.0 warns once and skips every other
  rule ([PR 178][gdm-178]; this note's run).
- **The README and the CLI.** The README's sample shows a pair that "passes
  WCAG AA" as a `warning`, and lists only `json` output; 0.4.0 prints nothing
  for a passing pair, and its help also offers "text" ([repository][gdm-repo];
  this note's run).
- **Stitch's docs.** "8 lint rules" and "# + hex code (sRGB)" against the
  CLI's eleven and "any valid CSS color string" ([Stitch CLI][stitch-dmd-cli];
  [Stitch specification][stitch-dmd-spec]; [specification][gdm-spec]).
- **Rork.** Its FAQ says "Rork Pro uses React Native and Expo", while its docs
  say no new Expo projects can be made ([FAQ][rork-faq]; [docs][rork-expo]).
- **a0.dev's SDK.** "Expo SDK 54 as of 11/18/25" against "Must use version
  52" for Expo Go on Android ([upgrading][a0-upgrade]; [testing][a0-testing]).
- **Native tabs' status.** The
  [iOS design notes](/docs/research/ios-design.md#headers-sheets-and-tabs-in-expo-router)
  call SDK 57's native tabs alpha; the v57 reference page carries no badge,
  and the SDK 58 beta calls them "stable" ([reference][expo-native-tabs-57];
  [SDK 58 beta][expo-sdk58-beta]).
- **Glass legibility.** Apple's WWDC25 session says the regular variant
  "provides legibility regardless of context"
  ([session 219](https://developer.apple.com/videos/play/wwdc2025/219/));
  NN/g calls iOS 26 "less legible", and AppleVis reports "a significant
  negative impact" for low-vision users ([NN/g][nng-glass];
  [AppleVis][applevis]).
- **Bold for low vision.** W3C and the Readability Consortium favor bold; the
  2026 PLOS One study found a font's regular weight read better than its bold
  ([W3C][w3c-lowvision]; [poster][readability-bold]; [PLOS One][legge-2026]).
- **Dark mode.** Figma says it "reduces eye strain", while Google's CHI 2023
  study found light mode "read reliably faster" ([Figma][figma-trends];
  [CHI 2023][readability-polarity]).
- **Whether asking for accessibility helps.** It raised errors in the Android
  study and didn't beat no prompt in the TOSEM study, but it cut
  expert-rated violations in the W4A 2025 study and raised Microsoft's pass
  rates ([UAIS][rabelo-uais]; [preprint][suh-arxiv]; [W4A 2025][gurita];
  [Microsoft][ms-eval]).

[rork-faq]: https://rork.com/faq
[a0-testing]: https://docs.a0.dev/development/testing/mobile-app-testing
[expo-native-tabs-57]: https://docs.expo.dev/versions/v57.0.0/sdk/router/native-tabs/

## Gaps

What no source settled on September 23, 2026:

- **Stitch and nested tokens.** Whether Stitch's importer reads nested
  appearance values or fenced `yaml` blocks is untested; Stitch needs a
  sign-in.
- **Generated React Native.** No study measures the accessibility of
  generated React Native, Expo, SwiftUI, or iOS screens, and none measures
  v0, Bolt, or Lovable output.
- **Hosted generators' code.** Whether a hosted generator adds labels, font
  scaling, or reduced motion to its code would need a signed-in run; Bolt's
  accessibility prompts show only in its app, and no Bolt page names an Expo
  SDK.
- **Kits on a device.** No kit was run with VoiceOver, Switch Control, Voice
  Control, the largest text sizes, Increase Contrast, or Reduce Motion, and
  no kit's docs or source mention Voice Control or Switch Control.
- **Blocked pages.** The ACM Digital Library refused every request, so ACM
  papers were read through arXiv, the authors' copies, or abstracts; AppleVis
  was read through the Internet Archive; and GitHub's anonymous API limit ran
  out, so some issues were read through raw files and diffs.
- **Unverified.** The W4A 2024 paper's checker names and violation shares,
  and Stitch's "App mode", since Stitch's docs need JavaScript.

## See also

- [Frontend trends research notes](/docs/research/frontend-trends.md), for
  Guessling, which this note updates.
- [Turn's motionsites.ai notes](/docs/research/turn-motionsites.md),
  [AAC design notes](/docs/research/aac-design.md), and
  [Turn's iOS design notes](/docs/research/turn-ios-design.md), the rest of
  the research behind Turn's DESIGN.md.
- [AAC practice research notes](/docs/research/aac-practice.md), with React
  Native's accessibility API and WCAG 2.2 in a native app.
- [iOS design research notes](/docs/research/ios-design.md), on Reanimated,
  text scaling, colors, and glass in Expo.
- [Markdown style guide](/docs/references/markdown-style.md), which a
  DESIGN.md in this repo follows.

[gdm-repo]: https://github.com/google-labs-code/design.md
[gdm-spec]: https://github.com/google-labs-code/design.md/blob/main/docs/spec.md
[gdm-philosophy]: https://github.com/google-labs-code/design.md/blob/main/PHILOSOPHY.md
[gdm-178]: https://github.com/google-labs-code/design.md/pull/178/files
[stitch-dmd-cli]: https://stitch.withgoogle.com/docs/design-md/cli/
[stitch-dmd-spec]: https://stitch.withgoogle.com/docs/design-md/specification/
[cc-memory]: https://code.claude.com/docs/en/memory
[a0-upgrade]: https://docs.a0.dev/advanced/upgrading-your-project
[rork-expo]: https://docs.rork.com/expo
[stitch-rn-skill]: https://github.com/google-labs-code/stitch-skills/blob/main/plugins/stitch-build/skills/react-native/SKILL.md
[claude-design-help]: https://support.claude.com/en/articles/14604416-get-started-with-claude-design
[expo-ds-skill]: https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-design-system/SKILL.md
[expo-anim-skill]: https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-animation/SKILL.md
[suh-arxiv]: https://arxiv.org/abs/2503.15885
[rabelo-uais]: https://doi.org/10.1007/s10209-026-01373-0
[gurita]: https://mintviz.usv.ro/publications/2025.W4A.3.pdf
[ms-eval]: https://microsoft.github.io/a11y-llm-eval-report/
[expo-sdk58-beta]: https://expo.dev/changelog/sdk-58-beta
[npm-moti]: https://registry.npmjs.org/moti
[expo-bundled-57]: https://unpkg.com/expo@57.0.24/bundledNativeModules.json
[nng-glass]: https://www.nngroup.com/articles/liquid-glass/
[applevis]: https://web.archive.org/web/20260319185118/https://www.applevis.com/blog/apple-vision-accessibility-2025-applevis-report-card
[nng-seniors-2019]: https://www.nngroup.com/articles/usability-for-senior-citizens/
[figma-trends]: https://www.figma.com/resource-library/web-design-trends/
[w3c-lowvision]: https://www.w3.org/TR/low-vision-needs/
[readability-bold]: https://thereadabilityconsortium.org/wp-content/uploads/2024/08/font-weights-grades-MMR44x44.pdf
[legge-2026]: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0345068
[readability-polarity]: https://thereadabilityconsortium.org/wp-content/uploads/2023/07/How-bold-can-we-be-The-impact-of-adjusting-font-grade-on-readability-in-light-and-dark-polarities-1.pdf
[expo-native-slop]: https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-design-system/references/native-slop.md
[vercel-design-md]: https://vercel.com/design.md
[anth-fd]: https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
[local-taste]: /.agents/skills/design-taste-frontend/SKILL.md

# motionsites.ai research notes

What motionsites.ai sells and on what terms, what a local corpus of 813
prompts holds (483 of them from motionsites.ai), which design patterns recur
across them, and which of those patterns suit a native iPhone game. These
notes are the motionsites.ai part of the research behind `docs/DESIGN.md`,
Guessling's design system and art direction for Shipaton's Best Game
category. Every source was read on September 22, 2026, so prices, counts,
and page text are as of that date, and judgment starts with "Synthesis:".

Contents:

1.  [Sources and method](#sources-and-method)
1.  [What motionsites.ai sells](#what-motionsitesai-sells)
    1.  [The product and its catalog](#the-product-and-its-catalog)
    1.  [Free and paid prompts](#free-and-paid-prompts)
    1.  [Prices on September 22, 2026](#prices-on-september-22-2026)
    1.  [AI builders the prompts target](#ai-builders-the-prompts-target)
    1.  [License and terms](#license-and-terms)
1.  [The local prompt corpus](#the-local-prompt-corpus)
    1.  [What each file holds](#what-each-file-holds)
    1.  [Working-prompt modes](#working-prompt-modes)
    1.  [Folder prefixes and counts](#folder-prefixes-and-counts)
    1.  [How the corpus matches the live catalog](#how-the-corpus-matches-the-live-catalog)
1.  [Quantitative analysis](#quantitative-analysis)
    1.  [Metadata fields](#metadata-fields)
    1.  [Dates and the newest prompts](#dates-and-the-newest-prompts)
    1.  [Stack mentions](#stack-mentions)
    1.  [Font families](#font-families)
    1.  [Page backgrounds and hex colors](#page-backgrounds-and-hex-colors)
    1.  [Technique counts](#technique-counts)
    1.  [Design language in numbers](#design-language-in-numbers)
1.  [What 27 prompts share](#what-27-prompts-share)
    1.  [Prompt structure](#prompt-structure)
    1.  [Type pairings](#type-pairings)
    1.  [Backgrounds, video, and glass](#backgrounds-video-and-glass)
    1.  [Text opacity, buttons, and copy](#text-opacity-buttons-and-copy)
    1.  [Motion and reduced motion](#motion-and-reduced-motion)
1.  [What transfers to a native iPhone game](#what-transfers-to-a-native-iphone-game)
    1.  [Web-only patterns](#web-only-patterns)
    1.  [Patterns that carry over](#patterns-that-carry-over)
    1.  [Where each pattern fits in Guessling](#where-each-pattern-fits-in-guessling)
1.  [Findings for DESIGN.md](#findings-for-designmd)
1.  [Conflicts between sources](#conflicts-between-sources)
1.  [Gaps](#gaps)
1.  [Appendix: analysis script](#appendix-analysis-script)
1.  [See also](#see-also)

## Sources and method

- **Site pages.** The home page, the 13 URLs in its sitemap ([ms-sitemap]),
  two more lessons that the Academy links, and 11 routes that appear only
  in the site's JavaScript, such as `/mcp`, `/request`, `/motionsite`,
  `/design-md`, and `/templates`, were fetched with `curl`. The pages are
  rendered on the server, so their text was read from the HTML; values that
  change with a control, such as prompt-pack prices, were read in the page
  code served that day ([ms-unlimited-js]; [ms-dialog-js]).
- **Policy pages.** No page and no sitemap entry links a terms, license,
  privacy, or refund page, and `/terms`, `/license`, `/privacy`, `/refund`,
  `/terms-of-service`, `/privacy-policy`, `/pricing`, and `/faq` returned
  HTTP 404. The robots file allows every crawler ([ms-robots]).
- **Search.** The web search tool's quota for this session was spent, and
  `site:motionsites.ai` queries sent to Bing and DuckDuckGo with `curl`
  returned unrelated results or a bot check, so no search results for the
  domain were read.
- **Live listing.** The home page fills its grid by reading a `prompts`
  table from the site's Supabase backend with the public key the page
  ships. That read, repeated once at 04:05 UTC, returned 526 rows of the
  columns the page asks for (title, category, type, `is_free`,
  `created_at`, and preview URLs) and no prompt text. These rows date the
  corpus; these notes call them the live listing.
- **Corpus.** The 813 folders under
  `/Users/yk/Projects/playground.repository/motionsitesai.repository/`
  `motionsitesai/prompts` were read in place and never written to. Corpus
  facts cite a folder name; counts come from the script in
  [Appendix: analysis script](#appendix-analysis-script), run with the
  corpus and the live listing, and are marked "appendix".
- **Close reading.** 27 prompts were read in full, chosen across the five
  prefixes, the site's categories, and dates up to the newest; they're
  listed in [What 27 prompts share](#what-27-prompts-share).
- **Paid content.** The prompts may be paid content, so these notes quote
  at most a few words of any prompt and describe the rest in their own
  words.
- **Native side.** React Native 0.86's style reference, Expo SDK 57's
  module pages, and Reanimated 4's docs were read to judge what transfers
  to the app.

[ms-sitemap]: https://motionsites.ai/sitemap.xml
[ms-robots]: https://motionsites.ai/robots.txt

## What motionsites.ai sells

### The product and its catalog

- **What it is.** The page title is "MotionSites AI — Official Premium AI
  Website Prompts", and the description says "Beautiful Website Prompts for
  Lovable, Bolt, Cursor, and Claude. Build Stunning 3d Websites With AI.
  Just copy, paste, and launch" ([ms-home]).
- **What a prompt is.** Each design is a card with a video or image
  preview, and "Copy full prompt" copies the long text specification behind
  it; some cards add "Open in Bolt", "Open in Google AI Studio", "Open in
  Kimi", "Download from GitHub", or "Download assets" ([ms-dialog-js]). A
  lesson sums up the contents: "MotionSites prompts contain the layout,
  styling, fonts, animations, responsive behavior, dependencies, and exact
  content needed to recreate the design." ([ms-lesson-ai])
- **Catalog.** Landing pages and "Blocks & components to help you build &
  launch premium AI websites faster" ([ms-sections]); "premium app design
  prompts" for "web & mobile apps" ([ms-apps]); "Animated Backgrounds",
  whose cards offer "Copy URL" for the video itself ([ms-backgrounds]);
  "Handcrafted Animated Gradients" ([ms-gradients]); and templates with
  "Open in Lovable" and "Open in Bolt" buttons ([ms-templates]).
- **DESIGN.md files.** A page offers "Drop-in DESIGN.md blueprints to guide
  your AI builds with taste and consistency", but its four cards read
  "Coming soon", and its code says "This DESIGN.md requires an active plan."
  ([ms-design-md])
- **Other offers.** An MCP server "Included in all paid plans" ([ms-mcp]);
  custom private prompts ([ms-request]); a creator program, "Get paid for
  designs you've already created" ([ms-submit]), and "free lifetime access"
  for builders whose tagged design MotionSites accepts ([ms-lesson-3d]);
  affiliates at "40% commission per referral" ([ms-affiliates]); and free
  video lessons "Powered by Design Rocket" ([ms-academy]).
- **Size.** The about page claims "500 Prompts available", "1,000 Prompts
  coming", "50,000 Total websites built", and "100,000 Users", and says
  "Launched in 2026" ([ms-motionsite]); the MCP page offers "500+ Premium
  Website Design Prompts" ([ms-mcp]). The live listing held 526 prompts,
  created from March 1 to September 21, 2026, 49 of them in September
  (appendix). The build and user counts couldn't be checked.
- **Thesis.** "Most AI-generated websites follow the same formula:
  oversized headings, glowing gradients, generic cards, and layouts you've
  already seen everywhere." And: "But motion alone isn't enough. It still
  needs good typography, spacing, structure, and restraint."
  ([ms-motionsite])

[ms-sections]: https://motionsites.ai/sections
[ms-apps]: https://motionsites.ai/apps
[ms-backgrounds]: https://motionsites.ai/backgrounds
[ms-gradients]: https://motionsites.ai/gradients
[ms-templates]: https://motionsites.ai/templates
[ms-submit]: https://motionsites.ai/submit-earn
[ms-affiliates]: https://motionsites.ai/affiliates

### Free and paid prompts

- **Share.** 179 of the 526 live prompts (34.0%) are marked free
  (appendix).
- **Copy limits.** A visitor who copies too many sees "You've reached your
  free copy limit." and "Create an account or upgrade to keep
  downloading."; a paid prompt opens with a plan or a pack credit ("Use 1
  prompt credit?") ([ms-dialog-js]). Through the MCP server, "Free accounts
  can open 3 free prompts — paid plans unlock all 500+." ([ms-mcp])
- **Fair use.** The three-month plan caps copies at "Fair use: 3 prompt
  copies / Day" ([ms-unlimited]), and the prompt dialog counts down the
  "daily prompt copies left" and adds "Re-opening this prompt later today
  is free." ([ms-dialog-js])

### Prices on September 22, 2026

| Offer               | Price                               | Terms quoted                                                        | Source            |
| ------------------- | ----------------------------------- | ------------------------------------------------------------------- | ----------------- |
| 3 Months            | $129                                | "Every 3 months, cancel anytime"; "Fair use: 3 prompt copies / Day" | [ms-unlimited]    |
| Yearly Access       | $279                                | "Per year, cancel anytime"; "Unlimited prompts access"              | [ms-unlimited]    |
| Lifetime Access     | $399, beside a struck-through $759  | "Lifetime Access - One-time Payment"; "Most Popular"                | [ms-unlimited]    |
| Prompt packs        | $49 for 2, $99 for 5, $149 for 10   | "2–10 prompt downloads"; "No commitment"                            | [ms-unlimited-js] |
| Custom hero section | $99, beside a struck-through $599   | "One-time payment"                                                  | [ms-request]      |
| Custom landing page | $249, beside a struck-through $1499 | "Landing page (5–6 sections)"; "One-time payment"                   | [ms-request]      |

- **What every plan includes.** "Access to Apps", "Animated Backgrounds",
  "Access to sections", "40+ Lovable Templates", "Motionsites MCP",
  "Community Access", "For personal & client work", and "Priority
  support"; lifetime adds "Lifetime updates" and "Early access". "The
  currency for your membership billing will be in USD." ([ms-unlimited])
- **Offers in the code.** The page code also holds a "Founding Members
  Sale" countdown for the $399 price and a $199 "Upgrade to Lifetime" for
  three-month members ([ms-unlimited-js]).
- **The pitch.** "A single freelance landing page typically costs
  $500–$2,000." ([ms-unlimited])

### AI builders the prompts target

- **Named builders.** The description names "Lovable, Bolt, Cursor, and
  Claude" ([ms-home]); the pricing FAQ says to paste a prompt "into AI
  builders like Lovable, Cursor, Bolt, Claude, v0, or Replit"
  ([ms-unlimited]); custom prompts work in "Cursor, Claude, ChatGPT, Codex,
  Lovable, Google AI Studio and any other tool that accepts a text prompt"
  ([ms-request]); and a lesson pastes into "Claude Code, Cursor, Bolt,
  Lovable, or another AI website builder" ([ms-lesson-ms]).
- **MCP.** "One command. No API key. Works with Claude, Cursor and Codex."
  The page gives setup steps for Claude Code, Cursor, and Codex and a
  custom connector for Claude Desktop and the web, and "Ask your agent for
  a design and it pulls real MotionSites prompts." ([ms-mcp])
- **Target stack.** A lesson's prompt "is designed for React, TypeScript,
  Tailwind CSS, and Framer Motion" ([ms-lesson-ai]), which matches the
  corpus (see [Stack mentions](#stack-mentions)).
- **How to use one.** "Choose a design → copy the prompt → paste it into an
  AI builder → refine the result." And: "Small, specific instructions
  usually work better than asking the AI to redesign the entire page."
  ([ms-lesson-ai]) Of two more lessons, one turns a single image into a 3D
  model with AI tools and animates it with Three.js in Claude's Code mode
  ([ms-lesson-3d]), and the other keeps text out of the background video,
  since "The headline, navigation, and other interface elements should
  remain editable website content" ([ms-lesson-scroll]). The Academy's
  video titles follow new models, such as "Build This Scroll Website with
  NEW Grok 4.5" ([ms-academy]).

[ms-lesson-scroll]: https://motionsites.ai/lesson/build-scroll-animated-website-with-ai

### License and terms

- **No terms page.** No license, terms, privacy, or refund page exists (see
  [Sources and method](#sources-and-method)), and the footer reads only
  "© Motionsites AI 2026. All rights reserved" ([ms-home]).
- **The only grant.** Every plan lists "For personal & client work", set in
  bold ([ms-unlimited]; [ms-unlimited-js]).
- **Custom prompts.** A request buys "a private, custom prompt built only
  for you and never published" ([ms-request]).
- **Unanswered.** Nothing says whether a buyer may share, publish, or
  resell prompt text, whether code built from a prompt carries any
  restriction, or whether the videos and images a prompt points to may ship
  in a product.
- Synthesis: A plan covers building sites from prompts, for oneself and for
  clients; nothing grants redistribution, and "All rights reserved" argues
  against it. Guessling should take patterns, not text or media: no prompt
  text in the repo, and no video, image, or font that a prompt points to in
  the app, the store page, or the web pages.

## The local prompt corpus

The corpus holds 483 motionsites.ai prompts and 330 from three other
libraries in one folder layout. Counts come from the appendix unless a
folder is named.

### What each file holds

- **metadata.json.** In all 813 folders, a `record` shaped like a catalog
  row (`id`, `title`, `category`, `page_type`, `sort_order`, `is_free`,
  `types`, and preview URLs; numbered folders add `type`, `created_at`, and
  `row_span`) and a `workingPrompt` object. Numbered folders also hold
  `result`, whose `prompt_text` is the text an export captured, next to an
  empty `sections` list and null `error` and `code` (`003-3`).
- **prompt.md.** In 658 folders, the prompt as captured. Set against
  `result.prompt_text` in the 276 numbered folders that have a prompt.md,
  and ignoring whitespace, it's the same text in 208; the same text, which
  the export wraps in a title, ID, and category header or a closing
  "Generated by MotionSites Export Tool" line, in 57 (`017-aethera-studio`);
  another version of the prompt in 9; and a reconstruction in 2. In
  `336-portal`, the export describes a streaming-site hero and prompt.md a
  password-manager hero.
- **working-prompt.md.** In 622 folders, the text meant for use. Where both
  files exist (467 folders), the two are byte-identical; in 155 numbered
  folders it's the only text.
- **Which file counts.** The script reads working-prompt.md and falls back
  to prompt.md, so each folder contributes one text.

### Working-prompt modes

- **Two modes.** `workingPrompt.mode` is "original" in 658 folders and
  "premium" in 155, all of them numbered.
- **Premium.** These carry `note: "Unlocked prompt from archive."`,
  `file: "working-prompt.md"`, and a `generatedAt` in the same second of
  July 17, 2026 as the numbered records' `created_at`. Of the 155 texts, 93
  open with front matter that names a `motionitems` image bucket and sets
  `premium` to true in 44 and false in 49 (`006-3d-animation-hero`), 58 read
  as full prompts (`133-duolingo-styleguide`), and 4 are one-line summaries
  under 300 characters (`014-acreage-farming`).
- **Recovered.** `recovered: true` appears on the 276 numbered folders in
  original mode and nowhere else. The metadata doesn't define it; since
  prompt.md there is the captured text, it reads as "the original text was
  recovered", which is an inference.
- **Reconstructions.** Two of those folders say they aren't originals:
  `389-slam-dunk-hero` and `459-wisa-space-hero` open as a "Reconstructed
  Working Prompt", "not the original paid prompt", built from "public
  MotionSites title, category, and preview media metadata". Their captured
  text only pointed to Google AI Studio.
- Synthesis: working-prompt.md is the file to analyze, but the premium
  texts came from an archive rather than the site, so they may not match
  what MotionSites sells today; 58 of them match a live prompt.

### Folder prefixes and counts

| Prefix   | Folders | Source, from the metadata and the text                                                               | Files                                     |
| -------- | ------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Numbered | 431     | motionsites.ai rows from an export of July 17, 2026                                                  | 276 with both, 155 with working-prompt.md |
| `ms-`    | 52      | motionsites.ai: `types` starts with "MotionSites", and 51 titles are in the live listing             | Both, identical                           |
| `sup-`   | 144     | Superdesign: `[Superdesign]` titles, category "Superdesign Canvas", 5 previews on superdesign.dev    | 139 with both, 5 with prompt.md only      |
| `hx-`    | 93      | HorizonX: `[HorizonX]` titles, category "HorizonX Library", previews on cdn.horizonx.so              | prompt.md only                            |
| `dev21-` | 93      | 21st.dev: `[21st.dev]` titles, category "21st.dev Registry", ids start "21st-", previews on 21st.dev | prompt.md only                            |

- **Numbering.** A numbered folder's number is its record's `sort_order`,
  which runs roughly alphabetically from `003-3` to `470-lysian-hero`, with
  37 numbers unused. The other prefixes' `sort_order` values start at 803
  (`ms-`), 1000 (`hx-`), 2000 (`dev21-`), and 3000 (`sup-`).
- **21st.dev confirmed.** Besides the metadata, every `dev21-` prompt names
  a registry install for its component, `npx shadcn@latest add` followed by
  a `https://21st.dev/r/` address (`dev21-arifuzzamanmoin-heximage`).
- **Templates, not specs.** Every `hx-` prompt is one template of about 850
  characters filled with a title and a one-line concept, and it names
  glassmorphism, "Framer Motion or GSAP", and four builders (`hx-all-in-one`;
  `hx-legion-age`). Every `dev21-` prompt is a template of about 580
  characters around the install line (`dev21-xubohuah-particle-text-effect`).
- **Superdesign's format.** `sup-` prompts are JSON with `summary`,
  `style`, `layout_and_structure`, `special_ui_components`, and
  `special_notes`; 139 records add `originalCategory`, `tags`,
  `deslop_score`, and `visual_score`, and 74 of those 139 have a
  `deslop_score` of 8 or 9, the highest values present
  (`sup-acid-yellow-neo-brutalist-mega-footer`).
- **Length.** Median prompts run 8,947 characters in `ms-`, 7,350 in
  numbered folders, 6,115 in `sup-`, 846 in `hx-`, and 579 in `dev21-`.

### How the corpus matches the live catalog

- **Coverage.** 385 folders match a live prompt by id or title, covering
  359 distinct live prompts, 68% of 526. The other 26 repeat a design
  another folder holds: `003-3` and `086-clearinvoice-saas-hero` are one
  live prompt, whose id is "3" and title "ClearInvoice SaaS Hero".
- **Free flags disagree.** The site marks 239 of the matched folders paid
  and 146 free, but their records say `is_free: true` in all but 3.
- **Placeholders.** Every numbered record has `category: "Premium"` and a
  `created_at` in one second of July 17, 2026, so the site's own dates and
  categories come from the live listing.
- **What's missing.** The newest matched prompt was created on August 30,
  2026 (`ms-space-planet`), so none of the 49 September prompts is in the
  corpus, and 97 archive folders match no live prompt: removed, renamed, or
  never listed.
- **The other libraries.** No `sup-`, `hx-`, or `dev21-` title appears in
  the live listing, and nothing records how they joined the corpus.

## Quantitative analysis

Counts are prompts with at least one match, out of all 813 and out of the
483 motionsites.ai prompts (numbered and `ms-`), since the templated `hx-`
and `dev21-` texts skew the totals. Every regex is case-insensitive, except
a part marked `(?-i:...)`; each was checked by reading a sample of its
matches and narrowed where it caught page copy, such as "cut through the
noise". The exact regexes are in the appendix; all counts here are from its
run.

### Metadata fields

- **Category.** All 431 numbered records say "Premium", every `sup-` record
  "Superdesign Canvas", `hx-` "HorizonX Library", and `dev21-` "21st.dev
  Registry"; only `ms-` records carry the site's categories, led by SaaS
  (10), Landing Page (8), and Hero Section (7). Superdesign's
  `originalCategory` is led by "Design Systems & Styles" (14), then
  "Animations & Backgrounds", "Components", "Forms & Contact", and "Pricing
  Pages" (12 each).
- **Page type.** "landing" in 432 records (the 431 numbered and one `ms-`),
  "hero" in 43, and one value per other library: "superdesign",
  "horizonx", and "21st_dev".
- **Types and tags.** Numbered records have none. `ms-` records list
  "MotionSites", "React", "Tailwind", and "Framer Motion"; `hx-` "HorizonX",
  "Vibecoding", "React", and "Tailwind"; `dev21-` "21st.dev", the author,
  and "shadcn". Superdesign's `tags` add words such as "landing page",
  "responsive", "saas", "editorial", and "cream".
- **Free flag.** `is_free` is true in 810 of 813 records (99.6%); the three
  exceptions are `ms-` folders.
- **Created.** `created_at` falls in July 2026 in all 431 numbered records,
  one export second, and is missing from the other 382.
- **Previews.** 223 records (27.4%) have a `video_preview_url`: all 93
  `hx-`, 69 `dev21-`, 41 `ms-`, 20 `sup-`, and no numbered record. 598 have
  an image preview.
- **Site types.** In the live listing, the matched folders are mostly
  "hero" (275 of 385), then "features" (35) and "mobile" (21).

### Dates and the newest prompts

- **By month.** The live catalog grew by 63 prompts in March 2026, 39 in
  April, 80 in May, 109 in June, 98 in July, 88 in August, and 49 in
  September through the 21st.
- **By period.** For the 385 matched folders, dated by the live listing:

| Pattern                         | Mar–Apr (126) | May–Jun (191) | Jul–Aug (68) |
| ------------------------------- | ------------- | ------------- | ------------ |
| React                           | 80%           | 88%           | 63%          |
| Tailwind CSS                    | 75%           | 86%           | 59%          |
| framer-motion or motion         | 35%           | 37%           | 7%           |
| hls.js                          | 17%           | 4%            | 0%           |
| Liquid glass or glassmorphism   | 43%           | 20%           | 22%          |
| Video file or `<video>` element | 88%           | 66%           | 72%          |
| Single HTML file, no framework  | 0%            | 4%            | 24%          |
| Reduced motion                  | 1%            | 7%            | 31%          |
| `aria-` or `focus-visible`      | 1%            | 20%           | 35%          |
| Phone frame or Dynamic Island   | 0%            | 0%            | 24%          |
| Median length in characters     | 4,259         | 7,457         | 9,402        |

- **Newest in the corpus.** `ms-space-planet` (August 30, 2026),
  `ms-quantum-lucid` (August 27), `113-cyberpunk-reveal` and
  `179-future-state` (August 25), `ms-scaling-platform` (August 23), and
  `ms-palomar-labs` (August 21).
- **Newest on the site.** All 49 September prompts are heroes, most often
  filed under "Creative" (7), "3D" (4), and "Portfolio" (4), with titles
  such as "Future 3D Portfolio" and "Particle Field"; none is in the
  corpus, so only their metadata was read.
- Synthesis: The catalog moved from React, Tailwind, and Framer Motion
  pages with HLS video and liquid glass in March and April toward longer,
  stricter specs by August: single HTML files, exact tokens, "do not"
  lists, reduced-motion and accessibility rules, and phone-frame app
  screens. That shift is the newest thing here, and the part that suits a
  design document.

### Stack mentions

| Stack                         | All 813     | Numbered and `ms-` (483) |
| ----------------------------- | ----------- | ------------------------ |
| React                         | 615 (75.6%) | 404 (83.6%)              |
| Vite                          | 282 (34.7%) | 282 (58.4%)              |
| React and Vite together       | 271 (33.3%) | 271 (56.1%)              |
| Next.js as the framework      | 12 (1.5%)   | 12 (2.5%)                |
| Tailwind CSS                  | 631 (77.6%) | 392 (81.2%)              |
| framer-motion or motion       | 299 (36.8%) | 189 (39.1%)              |
| GSAP                          | 151 (18.6%) | 54 (11.2%)               |
| Lenis                         | 29 (3.6%)   | 28 (5.8%)                |
| three.js or React Three Fiber | 24 (3.0%)   | 18 (3.7%)                |
| Spline                        | 3 (0.4%)    | 3 (0.6%)                 |
| hls.js                        | 30 (3.7%)   | 30 (6.2%)                |
| lucide-react                  | 421 (51.8%) | 289 (59.8%)              |
| shadcn                        | 115 (14.1%) | 20 (4.1%)                |

The regexes, as the script runs them:

```text
React                          \breact\b
Vite                           \bvite\b
Next.js as the framework       next\.?js\s*v?\d|next\.?js\s*\((?:app|pages)|\bnext/(?:image|link|font|navigation|router)\b|\bapp router\b|framework\W{0,8}next\.?js|next\.config
Tailwind CSS                   tailwind
framer-motion or motion        framer[- ]?motion|\bmotion/react\b|(?-i:["\']motion["\']\s*:)|npm package "motion"|\bmotion\.(?:div|span|h[1-6]|p|section|button|img|a|li)\b
GSAP                           \bgsap\b|scrolltrigger
Lenis                          \blenis\b
three.js or React Three Fiber  three\.?js|@react-three|react[- ]three[- ]fiber|\bR3F\b|from [\'"]three[\'"]
Spline                         @splinetool|spline\.design|\bspline (?:scene|viewer|3d)
hls.js                         hls\.?js|\bnew Hls\b
lucide-react                   lucide
shadcn                         shadcn
```

- **How matched.** Next.js counts only as a framework statement (a version,
  "App Router", or a `next/` import), since service copy mentions it;
  framer-motion counts as the name, a `motion/react` import, a lowercase
  `"motion":` dependency, or a `motion.div`-style element.
- **Templates inflate the totals.** All 93 `hx-` prompts name React,
  Tailwind, and "Framer Motion or GSAP", and all 93 `dev21-` prompts name
  React, Tailwind, and shadcn, which is why GSAP and shadcn look larger
  among all 813 (`hx-all-in-one`; `dev21-arifuzzamanmoin-heximage`).

### Font families

- **How matched.** Families named in Google Fonts `family=` parameters,
  plus the first family in each CSS `font-family` or JavaScript
  `fontFamily` declaration, without generic families, CSS variables, or
  icon fonts. The second column counts prompts that name the family
  anywhere, which catches prose such as "Font: Inter".

| Family               | Declared   | Named anywhere |
| -------------------- | ---------- | -------------- |
| Inter                | 94 (11.6%) | 314 (38.6%)    |
| Instrument Serif     | 52 (6.4%)  | 76 (9.3%)      |
| Manrope              | 20 (2.5%)  | 28 (3.4%)      |
| Barlow               | 14 (1.7%)  | 22 (2.7%)      |
| JetBrains Mono       | 13 (1.6%)  | 33 (4.1%)      |
| Geist                | 10 (1.2%)  | 24 (3.0%)      |
| Playfair Display     | 10 (1.2%)  | 39 (4.8%)      |
| Anton                | 8 (1.0%)   | 21 (2.6%)      |
| Space Grotesk        | 8 (1.0%)   | 35 (4.3%)      |
| Inter Tight          | 6 (0.7%)   | 11 (1.4%)      |
| Outfit               | 6 (0.7%)   | 25 (3.1%)      |
| DM Sans              | 5 (0.6%)   | 12 (1.5%)      |
| Georgia              | 5 (0.6%)   | 27 (3.3%)      |
| Condiment            | 4 (0.5%)   | 6 (0.7%)       |
| Helvetica Now Var    | 4 (0.5%)   | 6 (0.7%)       |
| Kanit                | 4 (0.5%)   | 6 (0.7%)       |
| Mazzard H            | 4 (0.5%)   | 4 (0.5%)       |
| Orbitron             | 4 (0.5%)   | 8 (1.0%)       |
| Cooper BT W01 Light  | 3 (0.4%)   | 3 (0.4%)       |
| Cooper BT W01 Medium | 3 (0.4%)   | 3 (0.4%)       |
| Futura Md BT Medium  | 3 (0.4%)   | 3 (0.4%)       |
| Helvetica Regular    | 3 (0.4%)   | 4 (0.5%)       |
| PP Mondwest          | 3 (0.4%)   | 3 (0.4%)       |
| Plus Jakarta Sans    | 3 (0.4%)   | 12 (1.5%)      |
| TT Firs Neue         | 3 (0.4%)   | 3 (0.4%)       |

- **Where fonts come from.** 167 prompts (20.5%) load Google Fonts, 65 (all
  from motionsites.ai, 13.5% of 483) load from `db.onlinewebfonts.com`, 8
  use Fontshare, and 29 declare `@font-face`. The families from the font
  mirror include Helvetica Neue and Helvetica Now (`ms-palomar-labs`;
  `456-wellness-companion`) and Cooper and Futura cuts.
- Synthesis: Inter for interface text with Instrument Serif for display is
  the house pairing, and that ubiquity is a reason for Guessling to choose
  its own. Families such as Helvetica Now and Futura are sold under
  commercial licenses, so a copy served by a font mirror shouldn't reach a
  shipped app.

### Page backgrounds and hex colors

- **How matched.** Four steps, each used only when the one before can't
  decide: a page-level color (a `body` or `html` background, prose such as
  "page background", or the background class on a `min-h-screen`
  wrapper); a stated theme ("dark mode", "light theme", and the like, when
  only one kind appears); text colors, when white text outnumbers dark text
  two to one or the reverse, with at least three uses; and the first CSS or
  labeled background color. A color is dark below 50% HLS lightness, and
  tints under 50% alpha are skipped.
- **Checks.** Where a page-level color or a stated theme exists, the
  text-color step agrees with it in 67 of 75 prompts and the
  first-background step in 88 of 97.

| Page         | All 813     | Numbered and `ms-` (483) |
| ------------ | ----------- | ------------------------ |
| Dark         | 286 (35.2%) | 251 (52.0%)              |
| Light        | 124 (15.3%) | 87 (18.0%)               |
| Undetermined | 403 (49.6%) | 145 (30.0%)              |

- **Stated themes.** 109 prompts say dark and 43 say light. The
  undetermined group holds 185 of the 186 `hx-` and `dev21-` templates, none
  of which names a hex color, and Superdesign leans lighter than
  motionsites.ai, with 37 light and 34 dark `sup-` prompts.
- **Hex colors.** 551 prompts use at least one of 1,885 distinct hex
  colors (three-digit values expanded, alpha dropped). Pure white and
  black lead, then near-blacks, then grays and accents from Tailwind's
  default palette, such as `#3b82f6`, which `006-3d-animation-hero` labels
  "Tailwind Blue-500":

| Hex       | Prompts     | Hex       | Prompts   |
| --------- | ----------- | --------- | --------- |
| `#ffffff` | 273 (33.6%) | `#3b82f6` | 18 (2.2%) |
| `#000000` | 143 (17.6%) | `#888888` | 18 (2.2%) |
| `#0a0a0a` | 54 (6.6%)   | `#f0f0f0` | 17 (2.1%) |
| `#111111` | 41 (5.0%)   | `#f5f5f5` | 17 (2.1%) |
| `#1a1a1a` | 37 (4.6%)   | `#fafafa` | 17 (2.1%) |
| `#050505` | 28 (3.4%)   | `#10b981` | 14 (1.7%) |
| `#64748b` | 22 (2.7%)   | `#f8fafc` | 14 (1.7%) |
| `#9ca3af` | 22 (2.7%)   | `#0c0c0c` | 13 (1.6%) |
| `#6b7280` | 21 (2.6%)   | `#666666` | 13 (1.6%) |
| `#0f172a` | 19 (2.3%)   | `#94a3b8` | 13 (1.6%) |

- **Accents.** A prompt usually carries one signature accent: a pale
  chartreuse (`251-luxury-focus`), a lime (`005-3d-studio-pricing`), a cyan
  (`ms-quantum-lucid`; `ms-space-planet`), or an acid yellow
  (`sup-acid-yellow-neo-brutalist-mega-footer`). Two prompts ban the usual
  AI palette outright, with "NO purple/violet anywhere" (`251-luxury-focus`)
  and "avoid generic indigo or violet" palettes
  (`sup-acid-yellow-neo-brutalist-mega-footer`).

### Technique counts

| Technique                                | All 813     | Numbered and `ms-` (483) |
| ---------------------------------------- | ----------- | ------------------------ |
| Liquid glass or glassmorphism            | 293 (36.0%) | 172 (35.6%)              |
| Backdrop blur                            | 362 (44.5%) | 287 (59.4%)              |
| Video file or `<video>` element          | 341 (41.9%) | 341 (70.6%)              |
| Says "background video"                  | 251 (30.9%) | 250 (51.8%)              |
| HLS stream (`.m3u8`)                     | 32 (3.9%)   | 32 (6.6%)                |
| Gradient                                 | 428 (52.6%) | 340 (70.4%)              |
| Noise or grain                           | 66 (8.1%)   | 21 (4.3%)                |
| Marquee                                  | 67 (8.2%)   | 53 (11.0%)               |
| Parallax                                 | 77 (9.5%)   | 70 (14.5%)               |
| Scroll-triggered animation               | 195 (24.0%) | 183 (37.9%)              |
| Split or letter-by-letter text           | 70 (8.6%)   | 66 (13.7%)               |
| 3D, as a word or a CSS 3D transform      | 88 (10.8%)  | 68 (14.1%)               |
| Particles                                | 29 (3.6%)   | 24 (5.0%)                |
| Shaders or WebGL                         | 37 (4.6%)   | 17 (3.5%)                |
| Custom cursor                            | 20 (2.5%)   | 17 (3.5%)                |
| Bento grid                               | 31 (3.8%)   | 15 (3.1%)                |
| Magnetic button or hover                 | 15 (1.8%)   | 14 (2.9%)                |
| Beams or spotlights                      | 24 (3.0%)   | 20 (4.1%)                |
| Aurora background                        | 4 (0.5%)    | 0 (0.0%)                 |
| Springs                                  | 43 (5.3%)   | 39 (8.1%)                |
| Mask-composite border                    | 67 (8.2%)   | 66 (13.7%)               |
| Gradient text (`background-clip: text`)  | 47 (5.8%)   | 43 (8.9%)                |
| Blend modes                              | 135 (16.6%) | 118 (24.4%)              |
| Blur-in entrance (animates to `blur(0)`) | 42 (5.2%)   | 42 (8.7%)                |

The regexes, as the script runs them:

```text
Liquid glass or glassmorphism        liquid[- ]?glass|glass[- ]?morph|frosted[- ]glass
Backdrop blur                        backdrop-filter|backdrop-blur|backdropFilter
Video file or <video> element        <video\b|\.mp4\b|\.webm\b|\.m3u8\b
Says "background video"              background[- ]video|video[- ]background|bg[- ]video
HLS stream (.m3u8)                   \.m3u8\b
Gradient                             (?:linear|radial|conic)-gradient|bg-gradient-|\bgradient\b
Noise or grain                       feTurbulence|fractalNoise|film[- ]grain|grainy|(?:noise|grain)[^\n.]{0,25}(?:texture|overlay|layer|filter|effect)|(?:texture|overlay|subtle|faint|fractal|svg|static)[^\n.]{0,15}(?:noise|grain)|noise[ /-]grain|grain[ /-]noise
Marquee                              marquee|(?<!gsap )(?<!gsap\.)\bticker\b
Parallax                             parallax
Scroll-triggered animation           scrolltrigger|whileInView|useInView|IntersectionObserver|\buseScroll\b|scroll[- ](?:triggered|driven|linked)|animation-timeline|on scroll
Split or letter-by-letter text       split ?text|split(?:ting)? (?:the )?(?:text|heading|headline|title) into|letter[- ]by[- ]letter|word[- ]by[- ]word|char(?:acter)?[- ]by[- ]char|per[- ](?:letter|word|character|char)\b|each (?:letter|word|character|char)\b|\.split\(\s*[\'"]\s?[\'"]\s*\)
3D                                   \b3d\b|three\.?js|@react-three|preserve-3d|translateZ|rotate[XY]\(
Particles                            particle
Shaders or WebGL                     shader|webgl|\bglsl\b|gl_FragColor
Custom cursor                        custom[- ]cursor|cursor:\s*none|cursor-none|cursor[- ](?:follower|trail|dot|ring|glow|blob)|follows? the (?:cursor|mouse)
Bento grid                           bento
Magnetic button or hover             magnetic[\s"-]{1,3}(?:button|hover|effect|cursor|pull|mouse|interaction|squares|attraction|force|field|link)|magneticbutton
Beams or spotlights                  \bbeams?\b|spotlight|light rays?|god ?rays
Aurora background                    aurora[- ](?:background|glow|gradient|effect|lit|glass|blob|light)
Springs                              type:\s*[\'"`]spring|useSpring|withSpring|stiffness|damping|spring (?:physics|animation|transition|config)
Mask-composite border                mask-composite
Gradient text                        background-clip:\s*text|bg-clip-text
Blend modes                          mix-blend|blend-mode
Blur-in entrance                     blur\(\s*0(?:\.0+)?(?:px)?\s*\)
```

- **Narrowed.** "Noise" and "grain" count only beside texture words, so
  copy such as "No noise." doesn't; "magnetic" counts only beside
  interaction words, so a card's "magnetic stripe" and a product called
  "Magnetic Amber" don't; "ticker" after "GSAP" is an API, not a
  marquee; springs need spring physics, not a "spring-like" curve; and
  "aurora" needs an effect word, so "aurora skies" in copy doesn't count.
- **Still broad.** "3D" also counts the word in copy, such as a service
  called "3D Modeling"; "gradient" counts any mention; and "spotlight"
  catches one "Product Spotlight" section.
- **Templates again.** All 93 `hx-` templates name glassmorphism,
  which is why liquid glass is as common among all 813 as among the 483
  (`hx-all-in-one`).

### Design language in numbers

| Pattern                                           | All 813     | Numbered and `ms-` (483) |
| ------------------------------------------------- | ----------- | ------------------------ |
| Pill shapes (`rounded-full` or a 9999px radius)   | 341 (41.9%) | 272 (56.3%)              |
| White text at reduced opacity (`text-white/NN`)   | 147 (18.1%) | 137 (28.4%)              |
| Uppercase with letter spacing on the same line    | 272 (33.5%) | 191 (39.5%)              |
| Serif and italic within 60 characters on one line | 91 (11.2%)  | 73 (15.1%)               |

- **Opacity steps.** `text-white/70` (81 prompts) and `/80` (74) lead, then
  `/60` (53), `/90` (36), `/50` (35), and `/40` (30).
- **Contrast.** White at a given opacity over `#0a0a0a` gives 2.6 to 1 at
  30%, 3.8 at 40%, 5.3 at 50%, 7.3 at 60%, 9.8 at 70%, and 12.6 at 80%, so
  50% is the lowest step that clears the TRD's 4.5 to 1 on near-black
  ([trd-a11y]).
- **Headings.** Of the 483 motionsites.ai prompts, 45.8% have a heading
  about the stack or setup, 45.3% about fonts, 45.3% about layout, 44.3%
  about assets or media, 42.0% about global CSS, 40.2% about animation,
  35.6% about responsive rules, 31.7% about colors or tokens, 22.8% about
  rules or notes, and 4.1% about accessibility. The most common headings
  are "Typography" (80) and "Color Palette" (74).

## What 27 prompts share

The 27 prompts read in full:

- **Newest from motionsites.ai, August 2026:** `ms-space-planet`,
  `ms-quantum-lucid`, `113-cyberpunk-reveal`, `179-future-state`,
  `ms-palomar-labs`, and `ms-agent-wave`.
- **App screens:** `267-mood-tracker`, `456-wellness-companion`,
  `ms-church-community`, and `050-aurora-onboard`.
- **Heroes, pages, and sections:** `237-liquid-glass-agency`,
  `091-codercrest-hero`, `251-luxury-focus`, `005-3d-studio-pricing`,
  `468-zenith-footer`, and `ms-fun-404-page`.
- **Archive texts:** `006-3d-animation-hero`, `133-duolingo-styleguide`,
  and `014-acreage-farming`.
- **Superdesign:**
  `sup-modal-design-success-celebration-pastel-legibility-fixed`,
  `sup-cream-and-sky-playful-saas-pricing`,
  `sup-account-setup-flow-goals-interests-card-based`, and
  `sup-acid-yellow-neo-brutalist-mega-footer`.
- **Templates:** `hx-all-in-one`, `hx-legion-age`,
  `dev21-arifuzzamanmoin-heximage`, and
  `dev21-xubohuah-particle-text-effect`.

### Prompt structure

- **Order.** A motionsites.ai prompt opens with one line that names the
  build and the stack, then runs in a stable order: stack and
  dependencies, fonts, colors or tokens, exact asset URLs, global CSS, the
  page's layers, one block per component with exact classes, sizes, and
  copy, animations with keyframes, durations, curves, and delays,
  responsive rules per breakpoint, and closing rules (`179-future-state`;
  `267-mood-tracker`; `ms-agent-wave`). The heading counts in
  [Design language in numbers](#design-language-in-numbers) bear this out.
- **Newest shapes.** The August prompts add banner sections and closing
  checks: `ms-quantum-lucid` runs from "FONT" and "MEDIA" to "DO / DO NOT",
  and `ms-space-planet` numbers twelve sections from "CONCEPT" to
  "ACCEPTANCE CHECKS".
- **Archive shape.** An archive text opens with a "System Role &
  Instructions" preamble and then a numbered specification, from
  "Technical Architecture & Stack" to "SEO & Accessibility"
  (`006-3d-animation-hero`).
- **Superdesign's shape.** JSON with a summary, a style block, layout
  parts, special components, and special notes
  (`sup-cream-and-sky-playful-saas-pricing`).
- **No improvising.** Specs forbid invented copy, buttons, gradients, and
  overlays (`ms-palomar-labs`) and list what not to add
  (`ms-quantum-lucid`).

### Type pairings

- **The house pairing.** A grotesk sans for body and interface text, with
  Instrument Serif, usually italic, for headlines or for one or two words
  in them: Inter with Instrument Serif (`ms-agent-wave`, where the serif
  words are also a muted gray), Barlow with Instrument Serif
  (`237-liquid-glass-agency`), and Manrope with Instrument Serif
  (`251-luxury-focus`).
- **Other pairings.** A display serif over a grotesk: Prata with Hanken
  Grotesk (`ms-space-planet`) and Fraunces with Plus Jakarta Sans
  (`sup-cream-and-sky-playful-saas-pricing`). Also one variable sans at
  exact fractional weights (Figtree in `ms-quantum-lucid`), a monospace
  for everything (JetBrains Mono in `113-cyberpunk-reveal`), a rounded face
  for a playful system (Nunito in `133-duolingo-styleguide`), and
  extra-bold Poppins
  (`sup-modal-design-success-celebration-pastel-legibility-fixed`).
- **Setting.** Headlines are large, light to medium in weight, tightly
  tracked, with leading near 1; labels are small, uppercase, and widely
  tracked (`179-future-state`; `ms-quantum-lucid`; `ms-palomar-labs`).
- **Bans on defaults.** `ms-quantum-lucid` forbids Inter or the system font
  as the primary face, and `ms-palomar-labs` wants a light Helvetica, "not
  heavy Inter/SF".

### Backgrounds, video, and glass

- **Dark first.** Most motionsites.ai pages are dark, and near-blacks such
  as `#0a0a0a` and `#050505` are more common than any color (see
  [Page backgrounds and hex colors](#page-backgrounds-and-hex-colors)).
- **Video.** 70.6% of motionsites.ai prompts name a video file or element,
  and 282 point at one CloudFront host, whose files are named by date
  (appendix; `ms-palomar-labs`). The loop is muted and inline, with no
  overlay at all (`ms-palomar-labs`; `050-aurora-onboard`), a fade to the
  page color at the bottom (`237-liquid-glass-agency`), or a light black
  scrim for contrast (`179-future-state`).
- **Scroll-scrubbed video.** A tall page whose scroll position drives the
  video's time, with smoothing (`179-future-state`; `251-luxury-focus`).
- **Liquid glass.** An almost clear white fill, a backdrop blur, an inset
  highlight, and a gradient hairline border cut with `mask-composite`: the
  same recipe in `237-liquid-glass-agency`,
  `456-wellness-companion`, and a MotionSites lesson ([ms-lesson-ms]).
- **Light pages.** Warm cream fields with pastel blobs or a dotted grain
  (`sup-cream-and-sky-playful-saas-pricing`; `ms-palomar-labs`), or a
  saturated orange gradient for a children's brand (`ms-fun-404-page`).

### Text opacity, buttons, and copy

- **Opacity for hierarchy.** Secondary text is white at 50% to 90% rather
  than a gray, with `text-white/70` and `/80` most common (see
  [Design language in numbers](#design-language-in-numbers)), as in
  `267-mood-tracker` and `179-future-state`.
- **Pills.** The usual pair is a solid white pill with dark text as the
  primary action and a glass or outlined pill as the secondary
  (`179-future-state`; `237-liquid-glass-agency`). Some go square on
  purpose: `ms-agent-wave`'s metallic nav buttons have a 7px radius, and
  `sup-account-setup-flow-goals-interests-card-based` asks for a 12px
  radius, not a pill, on its main button.
- **Press and hover.** Buttons shrink a little on press, to 0.95 or 0.98,
  and grow a little on hover (`468-zenith-footer`; `113-cyberpunk-reveal`),
  and a light sheen crosses some on hover (`ms-agent-wave`;
  `113-cyberpunk-reveal`). A game-like variant has a solid bottom shadow
  that disappears as the button moves down on press
  (`133-duolingo-styleguide`).
- **Copy.** Every string is specified and nothing may be added
  (`ms-palomar-labs`; `ms-quantum-lucid`). Headlines are short, broken
  across lines on purpose, often with one italic word; a small badge or
  eyebrow sits above; body copy is one or two sentences in muted white or
  gray (`ms-agent-wave`; `ms-space-planet`).

### Motion and reduced motion

- **Entrances.** On load, elements fade in and rise 8 to 26 pixels,
  staggered by roughly 50 to 150 milliseconds, on an ease-out curve such as
  `cubic-bezier(0.16, 1, 0.3, 1)` over half a second to a second
  (`267-mood-tracker`; `ms-palomar-labs`; `ms-agent-wave`).
- **Headline reveals.** Lines rise out of a clipped mask (`ms-space-planet`;
  `ms-agent-wave`), a clip-path wipes down (`ms-quantum-lucid`), words
  sharpen from a blur one by one (`237-liquid-glass-agency`), or text types
  in character by character (`ms-church-community`).
- **Named vocabularies.** `ms-space-planet` names five motion verbs, draw,
  reveal, rise, settle, and fade, each with its curve, and `ms-agent-wave`
  names seven entrance variants in a table of delays.
- **Success moments.** A badge pops with overshoot, a check draws itself,
  two rings pulse outward, and confetti falls
  (`sup-modal-design-success-celebration-pastel-legibility-fixed`); dots
  pop with overshoot along a stats arc (`113-cyberpunk-reveal`).
- **Springs.** Spring physics with stiffness, damping, and mass drive a
  magnetic button (`006-3d-animation-hero`), and an overshooting curve
  makes a toggle feel springy (`sup-cream-and-sky-playful-saas-pricing`).
- **Reduced motion.** The newest prompts switch animation off under
  `prefers-reduced-motion` and make the final state the resting state, so
  nothing stays hidden if an animation never runs (`ms-agent-wave`;
  `ms-space-planet`; `ms-quantum-lucid`; `113-cyberpunk-reveal`); 31% of
  July and August prompts handle reduced motion, against 1% in March and
  April (appendix).

## What transfers to a native iPhone game

Every bullet here is judgment. Guessling is one screen with a question
field and a character whose four poses are "animated with Reanimated", with
a fade under Reduce Motion ([trd-reactions]), and its text keeps "a
contrast of at least 4.5 to 1" in light and dark themes ([trd-a11y]). Expo
SDK 55 and later "run entirely on the New Architecture" ([expo-new-arch]).

[expo-new-arch]: https://docs.expo.dev/guides/new-architecture/

### Web-only patterns

- **hls.js.** Synthesis: The library exists for browsers that can't play
  HLS, and iOS can: expo-video's docs cover HLS sources, telling apps to
  "make sure that the uri contains .m3u8 extension" ([expo-video]). So
  hls.js is web-only, but HLS isn't. What doesn't fit is the background
  loop itself: behind a puzzle it competes with the character, costs data,
  and says nothing about Guessling.
- **CSS backdrop-filter.** Synthesis: React Native 0.86 has no backdrop
  filter, and on iOS its `filter` style offers brightness and opacity only:
  "these are the only two filter functions available on iOS" ([rn-style]).
  expo-blur's BlurView, "A React component that blurs everything underneath
  the view", names "navigation bars, tab bars, and modals" as its common
  use ([expo-blur]); that's the native glass, best kept to one sheet or
  bar.
- **mask-composite borders and gradient text.** Synthesis: React Native has
  no CSS masks. A gradient hairline becomes a gradient view behind an inset
  view, from expo-linear-gradient, which "transitions between multiple
  colors in a linear direction" ([expo-linear-gradient]), and gradient text
  needs a masked view, "A library that provides a masked view."
  ([expo-masked-view]) The built-in gradient style in 0.86,
  `experimental_backgroundImage`, carries "Don't use them in production."
  ([rn-style])
- **Scroll-driven pages.** Synthesis: ScrollTrigger, reveals on
  IntersectionObserver, and scroll-scrubbed video assume a long page; a
  round is one screen, so there's nothing to scrub.
- **Cursors and hover.** Synthesis: Custom cursors, cursor spotlights,
  magnetic buttons, and hover sheens need a pointer; on an iPhone, press
  states replace them.
- **Blur-in text.** Synthesis: With no blur filter on iOS in React Native,
  the words-sharpening reveal becomes a fade or a rise.
- **Fonts by URL.** Synthesis: The app bundles its fonts, so Google Fonts
  links and font mirrors don't apply, and commercial families don't
  transfer without a license.
- **Phone frames.** Synthesis: The HTML iPhone frames with a drawn Dynamic
  Island in the July and August app prompts exist to show an app on a web
  page (`267-mood-tracker`; `456-wellness-companion`); the app runs on the
  real one.

[expo-blur]: https://docs.expo.dev/versions/v57.0.0/sdk/blur-view/
[expo-linear-gradient]: https://docs.expo.dev/versions/v57.0.0/sdk/linear-gradient/
[expo-masked-view]: https://docs.expo.dev/versions/v57.0.0/sdk/masked-view/

### Patterns that carry over

- **A spec shaped like the newest prompts.** Synthesis: Tokens with exact
  values, exact copy, a list of what not to add, and acceptance checks
  translate directly into `docs/DESIGN.md` (`ms-quantum-lucid`;
  `ms-space-planet`).
- **A named motion vocabulary.** Synthesis: A handful of verbs, each with
  one curve and a duration range, maps onto Reanimated: "withSpring lets
  you create spring-based animations", configured by `stiffness`,
  `damping`, and `mass`, and its `reduceMotion` option defaults to
  `ReduceMotion.System` ([rea-spring]).
- **Reduced motion as a rule.** Synthesis: The resting state is the final
  state, as in the newest prompts; "useReducedMotion lets you query the
  reduced motion system setting" ([rea-reduced]), which fits the TRD's
  fade between poses ([trd-reactions]).
- **Press feedback.** Synthesis: A slight shrink on press, and the
  game-style button whose bottom shadow disappears as it moves down
  (`133-duolingo-styleguide`), suit the Guess button.
- **Hierarchy by opacity, with a floor.** Synthesis: White at 50% or more
  on near-black clears 4.5 to 1 (see
  [Design language in numbers](#design-language-in-numbers)); the light
  theme needs its own floor, tested the same way.
- **Split colors.** Synthesis: Decorative pastels for fills and confetti,
  and darker text tokens that clear 4.5 to 1, as in
  `sup-modal-design-success-celebration-pastel-legibility-fixed`, fit the
  TRD's contrast rule ([trd-a11y]).
- **One accent and no default purple.** Synthesis: One signature accent per
  design, and the bans on the violet "AI" palette, are cheap ways to look
  deliberate (`251-luxury-focus`;
  `sup-acid-yellow-neo-brutalist-mega-footer`).
- **Drawn marks.** Synthesis: A check that draws itself, pulsing rings, and
  faces made of a few paths
  (`sup-modal-design-success-celebration-pastel-legibility-fixed`;
  `267-mood-tracker`) suit react-native-svg, "A library that allows using
  SVGs in your app." ([expo-svg])
- **Blend modes, if needed.** Synthesis: `mixBlendMode` "is only available
  on the New Architecture and Android 10+" ([rn-style]), which Expo SDK 57
  runs, so a trick such as darkening a white-backed character video onto a
  color field (`ms-fun-404-page`) could work natively, though drawn poses
  don't need it.

[rea-spring]: https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring/
[rea-reduced]: https://docs.swmansion.com/react-native-reanimated/docs/device/useReducedMotion/
[expo-svg]: https://docs.expo.dev/versions/v57.0.0/sdk/svg/

### Where each pattern fits in Guessling

- **Nod (Yes).** Synthesis: A quick vertical spring with a little
  overshoot, and the word "Yes" rising out of a mask below the character,
  with the TRD's light haptic ([trd-reactions]).
- **Head shake (No).** Synthesis: A horizontal spring with low damping, so
  it swings two or three times and settles; no red flash, since the
  character "never mocks a wrong guess" ([product-character]).
- **Shrug ("Ask another way").** Synthesis: A slower lift and drop on a
  plain ease-out, without overshoot, so it reads as neither yes nor no.
- **Celebration.** Synthesis: The success recipe, once: a pop with
  overshoot, a drawn sparkle or check, a ring pulse, and a short burst of
  confetti, then settle; under Reduce Motion, the TRD's fade.
- **End-of-round reveal.** Synthesis: The one place for the display face:
  the answer rises out of a mask or wipes in, a hairline draws under it,
  and the stats and the Share button rise in a stagger (`ms-space-planet`;
  `ms-quantum-lucid`).
- **Paywall.** Synthesis: It's RevenueCat's native paywall
  ([rc-paywalls]), so only choices carry over: the app's type and accent, a
  highlighted package with a badge, a reassurance line under the prices
  (`sup-cream-and-sky-playful-saas-pricing`), and legible contrast; not
  video or glass.
- **App Store screenshots.** Synthesis: One reaction per screenshot on the
  app's own field, a short two-line caption with one italic word, and
  phones side by side as in the three-screen app prompts
  (`267-mood-tracker`; `ms-church-community`).
- **Demo video.** Synthesis: The category asks for "real gameplay on the
  device the game was built for" ([shipaton-cats]), so the video is a
  screen recording, which is also how MotionSites tells builders to show
  work: "Record a screen capture of your live site" with a short caption
  ([ms-lesson-3d]). Its title cards can reuse the type pairing and the
  entrance choreography.
- **The three web pages.** Synthesis: CSS works on /privacy, /terms, and
  /support, so the web patterns apply literally but lightly: the app's
  pairing and accent, light and dark themes, no video, and at most a short
  fade that honors `prefers-reduced-motion` ([cf-pages]).

## Findings for DESIGN.md

- **Take patterns, not prompts.** The site grants only "For personal &
  client work" and reserves all rights; 282 motionsites.ai prompts point at
  one CloudFront host for media and 65 load fonts from a mirror. Synthesis:
  DESIGN.md
  should cite these notes, not prompt text, and the app should ship no
  media or mirrored font a prompt points to. See
  [License and terms](#license-and-terms).
- **Write it like the newest prompts.** The August prompts are the longest
  (a median of 9,402 characters) and add exact tokens, "do not" lists,
  reduced motion, accessibility, and acceptance checks, while MotionSites'
  own DESIGN.md files were still "Coming soon" ([ms-design-md]).
  Synthesis: give DESIGN.md the same parts. See
  [Dates and the newest prompts](#dates-and-the-newest-prompts).
- **One sans and one expressive face.** Inter (94 prompts declare it, 314
  name it) with Instrument Serif (52 and 76) is the house pairing, and two
  August prompts rule out Inter as the main face. Synthesis: pick a pairing
  with a reason, keep
  the display face for the few words that matter, and test both at the
  largest Dynamic Type sizes. See [Type pairings](#type-pairings).
- **Dark is a habit, not a rule.** 52.0% of motionsites.ai prompts are dark
  and 18.0% light, and the playful ones use warm light fields. Synthesis:
  Guessling needs both themes anyway ([trd-a11y]), so define both fields
  and let the character carry the mood. See
  [Page backgrounds and hex colors](#page-backgrounds-and-hex-colors).
- **Hierarchy by opacity, with a floor.** White at 70% and 80% is the usual
  secondary text, and 50% is the lowest that clears 4.5 to 1 on near-black.
  Synthesis: define three or four text levels per theme and test each. See
  [Design language in numbers](#design-language-in-numbers).
- **One accent with one job.** Prompts pick one signature accent and ban
  the violet default. Synthesis: one accent for the answer and the primary
  action, with its decorative and text versions split for contrast. See
  [Patterns that carry over](#patterns-that-carry-over).
- **Name the motion.** The newest prompts name their moves and give each a
  curve. Synthesis: name Guessling's moves after its reactions, give each a
  Reanimated spring or curve and a duration, and reuse them everywhere. See
  [Motion and reduced motion](#motion-and-reduced-motion).
- **Celebrate with a recipe.** A pop, a drawn check, a pulsing ring, and
  confetti make up the corpus's success moment. Synthesis: play it once on
  the solve, and keep the other three reactions smaller. See
  [Where each pattern fits in Guessling](#where-each-pattern-fits-in-guessling).
- **Rest in the final state.** 31% of July and August prompts handle
  reduced motion, against 1% in March and April. Synthesis: every animation
  in DESIGN.md gets a reduced-motion version, as the TRD's fade does
  ([trd-reactions]).
- **Leave the web signatures on the web.** Background video, glass on every
  card, scroll scrubbing, cursors, and blur-in text are web habits or don't
  fit one puzzle screen. Synthesis: use BlurView for one sheet at most,
  expo-linear-gradient for gradients, and no `experimental_backgroundImage`
  in production. See [Web-only patterns](#web-only-patterns).

## Conflicts between sources

- **Free flags.** 810 of 813 corpus records say `is_free: true`, but the
  site marks 239 of the 385 matched folders paid (appendix).
- **Dates and categories.** The corpus dates all 431 numbered records to
  one second of July 17, 2026 and files them under "Premium"; the live
  listing dates the same prompts from March to August 2026 and files them
  under categories such as "Landing Page", "Hero", and "SaaS" (appendix).
- **A monthly plan.** The purchase confirmation says "Your Go Unlimited
  monthly plan is active", but the pricing page sells three-month, yearly,
  and lifetime access only ([ms-payment]; [ms-unlimited]).
- **Template count.** The plans list "40+ Lovable Templates", and the
  prompt dialog's upsell "30+ AI Ready Templates" ([ms-unlimited];
  [ms-dialog-js]).
- **Recovered but reconstructed.** Two folders marked `recovered: true`
  hold texts that call themselves reconstructions (`389-slam-dunk-hero`;
  `459-wisa-space-hero`).
- **Two versions of one prompt.** In 9 numbered folders, prompt.md and the
  export's `prompt_text` are different prompts under one title
  (`336-portal`).
- **Builder lists.** Each page names a different set of builders, from
  three on the MCP page to six in the pricing FAQ ([ms-mcp];
  [ms-unlimited]).
- **HLS as web-only.** The brief for these notes counts HLS video
  backgrounds as web-only, but expo-video plays HLS sources on iOS
  ([expo-video]); only the hls.js library is web-only.

[ms-payment]: https://motionsites.ai/payment-success

## Gaps

What the sources don't say that DESIGN.md or the team needs, as of
September 22, 2026:

- **Terms.** No license, terms, privacy, or refund text was found, so what
  a buyer may do with prompt text, code built from a prompt, or the media a
  prompt points to is undocumented; the checkout, which the page code opens
  at an address from the site's backend, wasn't visited.
- **Search.** No search results for the domain were read (see
  [Sources and method](#sources-and-method)), so off-site terms, reviews,
  and earlier versions of the pages went unchecked.
- **Visitor limits.** The number of free copies before "You've reached your
  free copy limit." isn't stated anywhere ([ms-dialog-js]).
- **Marketing counts.** "50,000 Total websites built" and "100,000 Users"
  have no source ([ms-motionsite]).
- **Corpus origin.** The corpus has no README or scripts. The archive
  behind the premium texts, what `recovered` means, and how the
  Superdesign, HorizonX, and 21st.dev folders were gathered aren't
  recorded, and those three libraries' own sites weren't visited.
- **September.** The 49 prompts added from September 1 to 21, 2026 aren't
  in the corpus, so what's newest rests on their metadata alone.
- **Paywall editor.** Whether RevenueCat's paywall editor can show a badge
  on a package, a custom font, or a gradient wasn't checked here (see
  [RevenueCat paywalls in React Native][rc-paywalls]).
- **Previews.** The preview videos weren't watched; every design judgment
  here comes from prompt text.
- **Background classifier.** 30.0% of motionsites.ai prompts stay
  undetermined, and the text-color step agrees with stronger signals in 67
  of 75 prompts, not all (appendix).

## Appendix: analysis script

Python 3 with the standard library only. Run it as
`python3 analyze.py <prompts folder> [<live listing>.json]`; without the
JSON, it skips the sections that need live dates. The JSON is the list of
rows the home page reads (see [Sources and method](#sources-and-method)).
The run behind these notes printed every count quoted above.

```python
#!/usr/bin/env python3
"""Count metadata, stacks, fonts, colors, and techniques in the corpus.

Usage: python3 analyze.py PROMPTS_DIR [LIVE_LISTING_JSON]

PROMPTS_DIR holds one folder per prompt, each with metadata.json and
prompt.md, working-prompt.md, or both. LIVE_LISTING_JSON, if given, is
the list of rows that https://motionsites.ai/ loads for its grid; rows
are joined to folders by id, then by title, to date the prompts.
Every regex is case-insensitive unless it says (?-i:...).
"""
import collections
import colorsys
import json
import os
import re
import sys

ROOT = sys.argv[1]
LIVE = sys.argv[2] if len(sys.argv) > 2 else None
I = re.I


def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()


def prefix(folder):
    return 'numbered' if re.match(r'\d+-', folder) else folder.split('-')[0] + '-'


rows = []
for folder in sorted(os.listdir(ROOT)):
    base = os.path.join(ROOT, folder)
    if not os.path.isdir(base):
        continue
    files = set(os.listdir(base))
    # The working prompt is the one meant for use; prompt.md is the fallback.
    name = 'working-prompt.md' if 'working-prompt.md' in files else 'prompt.md'
    rows.append({
        'folder': folder,
        'prefix': prefix(folder),
        'meta': json.loads(read(os.path.join(base, 'metadata.json'))),
        'files': files,
        'text': read(os.path.join(base, name)),
    })
N = len(rows)
MS = [r for r in rows if r['prefix'] in ('numbered', 'ms-')]  # MotionSites' own


def pct(n, d=N):
    return f'{n} ({100 * n / d:.1f}%)'


def top_items(counter, top=None):
    # Ties sort by name, so every run prints the same order.
    return sorted(counter.items(), key=lambda kv: (-kv[1], str(kv[0])))[:top]


def show(title, counter, top=None, d=N):
    print(f'\n## {title}')
    for key, n in top_items(counter, top):
        print(f'  {pct(n, d):>14}  {key}')


def table(title, patterns):
    print(f'\n## {title} (all {N} | numbered and ms- {len(MS)})')
    for label, pat in patterns.items():
        a = sum(1 for r in rows if re.search(pat, r['text'], I))
        b = sum(1 for r in MS if re.search(pat, r['text'], I))
        print(f'  {pct(a):>14} | {pct(b, len(MS)):>14}  {label}')


# 1. Folders, files, and working-prompt modes.
show('Folders by prefix', collections.Counter(r['prefix'] for r in rows))
show('Files present', collections.Counter(
    (r['prefix'], ' + '.join(sorted(r['files']))) for r in rows))
show('workingPrompt mode, recovered', collections.Counter(
    (r['prefix'], r['meta']['workingPrompt'].get('mode'),
     r['meta']['workingPrompt'].get('recovered')) for r in rows))
same = collections.Counter()
for r in rows:
    if {'prompt.md', 'working-prompt.md'} <= r['files']:
        base = os.path.join(ROOT, r['folder'])
        same[read(os.path.join(base, 'prompt.md'))
             == read(os.path.join(base, 'working-prompt.md'))] += 1
show('prompt.md identical to working-prompt.md', same)
versus, kinds = collections.Counter(), collections.Counter()
for r in rows:
    res = r['meta'].get('result')
    if res and 'prompt.md' in r['files']:
        captured = read(os.path.join(ROOT, r['folder'], 'prompt.md'))
        a, b = re.sub(r'\s+', '', res['prompt_text']), re.sub(r'\s+', '', captured)
        versus['same text' if a == b else 'same text inside a wrapper' if b in a
               else 'reconstruction' if 'Reconstructed Working Prompt' in captured
               else 'another version'] += 1
    if r['meta']['workingPrompt'].get('mode') == 'premium':
        flag = re.search(r'^premium:\s*(\w+)', r['text'].split('---')[1], re.M) \
            if r['text'].startswith('---') else None
        kinds[f'front matter, premium: {flag.group(1)}' if flag else
              'under 300 characters' if len(r['text']) < 300 else 'full text'] += 1
show('prompt.md against result.prompt_text, ignoring whitespace', versus)
show('Kinds of premium working prompts', kinds)
orders = collections.defaultdict(list)
for r in rows:
    orders[r['prefix']].append(r['meta']['record']['sort_order'])
print('\n## sort_order range by prefix')
for p, v in sorted(orders.items()):
    print(f'  {p:>9}  {min(v)} to {max(v)}')
used = set(orders['numbered'])
print(f'  numbered: {max(used) - min(used) + 1 - len(used)} numbers unused')
scores = [r['meta']['record'].get('deslop_score') for r in rows]
scores = [x for x in scores if x is not None]
print(f'  deslop_score: {len(scores)} records, {sum(1 for x in scores if x >= 8)} at 8 or 9')
sizes = collections.defaultdict(list)
for r in rows:
    sizes[r['prefix']].append(len(r['text']))
print('\n## Prompt length in characters (median, max)')
for p, v in sorted(sizes.items()):
    v.sort()
    print(f'  {p:>9}  {v[len(v) // 2]:>6}  {v[-1]:>6}')

# 2. Metadata fields from each folder's record.
rec = [r['meta']['record'] for r in rows]
show('record.category', collections.Counter(x.get('category') for x in rec), 15)
show('record.originalCategory (sup- only)', collections.Counter(
    x['originalCategory'] for x in rec if x.get('originalCategory')), 15)
show('record.page_type', collections.Counter(x.get('page_type') for x in rec))
show('record.types and record.tags', collections.Counter(
    t for x in rec for t in (x.get('types') or []) + (x.get('tags') or [])), 20)
show('record.is_free', collections.Counter(x.get('is_free') for x in rec))
show('record.created_at by month', collections.Counter(
    (x.get('created_at') or 'none')[:7] for x in rec))
show('Preview video, preview image', collections.Counter(
    (r['prefix'], bool(r['meta']['record'].get('video_preview_url')),
     bool(r['meta']['record'].get('image_preview_url'))) for r in rows))

# 3. Optional join to the live listing, for real dates and free flags.
if LIVE:
    live = json.loads(read(LIVE))
    by_id = {x['id']: x for x in live}
    by_title = {x['title'].strip().lower(): x for x in live}
    hits = []
    for r in rows:
        x = r['meta']['record']
        hit = by_id.get(x['id']) or by_title.get(x['title'].strip().lower())
        if hit:
            hits.append((r, hit))
    dates = sorted(x['created_at'] for x in live)
    print(f'\n## Live listing: {len(live)} rows created {dates[0][:10]} to {dates[-1][:10]}, '
          f'{sum(1 for x in live if x.get("is_free"))} free; {len(hits)} folders '
          f'match {len({h["id"] for _r, h in hits})} distinct rows')
    show('Live rows by month', collections.Counter(
        x['created_at'][:7] for x in live), d=len(live))
    newest = [x for x in live if x['created_at'][:7] == dates[-1][:7]]
    for field in ('type', 'category'):
        show(f'Live rows created in {dates[-1][:7]}, by {field}', collections.Counter(
            x.get(field) for x in newest), 6, d=len(newest))
    show('Folders found in the live listing', collections.Counter(
        (r['prefix'], r['meta']['workingPrompt']['mode'],
         'free' if h['is_free'] else 'paid') for r, h in hits))
    show('Matched folders by live month', collections.Counter(
        h['created_at'][:7] for _r, h in hits))
    show('Matched folders by live type', collections.Counter(
        h.get('type') for _r, h in hits), 8)
    show('Matched folders by live category', collections.Counter(
        h.get('category') for _r, h in hits), 8)
    print('\n## Newest matched folders')
    for r, h in sorted(hits, key=lambda p: p[1]['created_at'])[-12:]:
        print(f'  {h["created_at"][:10]}  {r["folder"]}')

# 4. Stack mentions in the prompt text.
STACK = {
    'React': r'\breact\b',
    'Vite': r'\bvite\b',
    'Next.js as the framework': r'next\.?js\s*v?\d|next\.?js\s*\((?:app|pages)'
                                r'|\bnext/(?:image|link|font|navigation|router)\b'
                                r'|\bapp router\b|framework\W{0,8}next\.?js|next\.config',
    'Tailwind CSS': r'tailwind',
    'framer-motion or motion': r'framer[- ]?motion|\bmotion/react\b'
                               r'|(?-i:["\']motion["\']\s*:)|npm package "motion"'
                               r'|\bmotion\.(?:div|span|h[1-6]|p|section|button|img|a|li)\b',
    'GSAP': r'\bgsap\b|scrolltrigger',
    'Lenis': r'\blenis\b',
    'three.js or React Three Fiber': r'three\.?js|@react-three|react[- ]three[- ]fiber'
                                     r'|\bR3F\b|from [\'"]three[\'"]',
    'Spline': r'@splinetool|spline\.design|\bspline (?:scene|viewer|3d)',
    'hls.js': r'hls\.?js|\bnew Hls\b',
    'lucide-react': r'lucide',
    'shadcn': r'shadcn',
}
table('Stack mentions', STACK)
both = [r for r in rows if re.search(STACK['React'], r['text'], I)
        and re.search(STACK['Vite'], r['text'], I)]
print(f'  {pct(len(both)):>14} | '
      f'{pct(sum(1 for r in both if r in MS), len(MS)):>14}  React and Vite together')

# 5. Fonts: Google Fonts URLs and font-family declarations.
GENERIC = {'sans-serif', 'serif', 'monospace', 'system-ui', 'ui-sans-serif',
           'ui-serif', 'ui-monospace', '-apple-system', 'blinkmacsystemfont',
           'inherit', 'cursive', 'initial', 'arial', 'helvetica'}
ICONS = r'material (?:symbols|icons)|font ?awesome|phosphor|ionicons'


def families(text):
    """Family names from Google Fonts URLs and the first family of each
    font-family or fontFamily declaration, without generics or icons."""
    found = set()
    for url in re.findall(r'fonts\.googleapis\.com/css2?\?[^\s"\'`)>]+', text):
        for fam in re.findall(r'family=([^:&"\'\s)]+)', url):
            found.add(fam.replace('+', ' ').strip())
    decls = re.findall(r'font-family\s*:\s*([^;}\n]+)', text, I)
    decls += re.findall(r'fontFamily[ \t]*[:=][ \t]*[{\[]?[ \t]*(?:\w+[ \t]*:[ \t]*)?'
                        r'\[?[ \t]*([\'"][^\n]{1,80})', text)
    for decl in decls:
        first = decl.strip().strip('`').split(',')[0].strip().strip('\'"`[]{} ')
        if first and not first.startswith('var(') and first.lower() not in GENERIC \
                and len(first) < 40 and not re.search(r'[${}()]', first):
            found.add(first)
    return {f for f in found if not re.search(ICONS, f, I)}


fonts = collections.Counter()
for r in rows:
    fonts.update(families(r['text']))
print(f'\n## Top 25 font families (all {N}): declared | named anywhere')
for fam, n in top_items(fonts, 25):
    # A name counts when no longer family name continues it.
    pat = r'(?<![\w-])' + re.escape(fam) + r'(?![\w-]| (?:Tight|Display|Mono|Sans|Serif|Text))'
    named = sum(1 for r in rows if re.search(pat, r['text']))
    print(f'  {pct(n):>12} | {pct(named):>12}  {fam}')

table('Font and asset sources', {
    'Google Fonts URL': r'fonts\.googleapis\.com',
    'db.onlinewebfonts.com': r'onlinewebfonts',
    'Fontshare': r'fontshare',
    '@font-face': r'@font-face',
    'CloudFront host d8j0ntlcm91z4': r'd8j0ntlcm91z4\.cloudfront\.net',
    'Mux HLS streams': r'stream\.mux\.com',
})

# 6. Colors: page background, then hex frequency.
TW_GRAY = r'(?:slate|gray|grey|zinc|neutral|stone)'


def lightness(token):
    """Return HLS lightness from 0 to 1 for a color token, or None."""
    t = token.strip().lower()
    if t in ('black', 'bg-black'):
        return 0.0
    if t in ('white', 'bg-white'):
        return 1.0
    m = re.fullmatch(r'(?:bg-\[)?#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\]?', t)
    if m:
        h = m.group(1)
        h = ''.join(c * 2 for c in h) if len(h) == 3 else h[:6]
        return colorsys.rgb_to_hls(*[int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)])[1]
    m = re.fullmatch(r'rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+%?))?\s*\)', t)
    if m:
        alpha = m.group(4)
        if alpha and not alpha.endswith('%') and float(alpha) < 0.5:
            return None  # a tint, not a page color
        return colorsys.rgb_to_hls(*[int(m.group(i)) / 255 for i in (1, 2, 3)])[1]
    m = re.fullmatch(r'bg-' + TW_GRAY + r'-(\d+)', t)
    return 1 - int(m.group(1)) / 1000 if m else None


COLOR = r'#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|\bblack\b|\bwhite\b'
TW_BG = r'bg-(?:black|white|\[#[0-9a-f]{3,8}\]|' + TW_GRAY + r'-\d+)\b'
PAGE = [  # page-level statements, tried in order
    r'(?:body|html)\s*\{[^}]{0,300}?background(?:-color)?\s*:\s*(' + COLOR + ')',
    r'(?:page|body|site|global|overall|main|root)\s+(?:background|bg)(?:[- ]colou?r)?'
    r'[^\n]{0,40}?(' + COLOR + '|' + TW_BG + ')',
    r'min-h-screen[^"\'`\n]{0,80}?(' + TW_BG + ')',
    r'(' + TW_BG + r')[^"\'`\n]{0,80}?min-h-screen',
]
SAYS_DARK = r'\bdark[- ](?:mode|theme|background|ui)\b'
SAYS_LIGHT = r'\blight[- ](?:mode|theme|background|ui)\b'
LIGHT_TEXT = (r'\btext-white\b|\bcolor:\s*(?:#fff\b|#ffffff\b|white\b)'
              r'|\bcolor:\s*rgba?\(\s*255,\s*255,\s*255')
DARK_TEXT = (r'\btext-black\b|\btext-' + TW_GRAY + r'-(?:800|900|950)\b'
             r'|\bcolor:\s*(?:#000\b|#000000\b|black\b|#111\b|#111111\b)')
FIRST_BG = (r'background(?:-color)?\**\s*[:=]\s*[`\'"]?\s*(?:pure\s+|solid\s+)?'
            r'(' + COLOR + ')')


def by_page_color(text):
    for pat in PAGE:
        for m in re.finditer(pat, text, I):
            value = lightness(m.group(1))
            if value is not None:
                return 'dark' if value < 0.5 else 'light'


def by_stated_theme(text):
    dark, light = re.search(SAYS_DARK, text, I), re.search(SAYS_LIGHT, text, I)
    if bool(dark) != bool(light):
        return 'dark' if dark else 'light'


def by_text_color(text):
    on_dark = len(re.findall(LIGHT_TEXT, text, I))
    on_light = len(re.findall(DARK_TEXT, text, I))
    if max(on_dark, on_light) >= 3 and max(on_dark, on_light) >= 2 * min(on_dark, on_light):
        return 'dark' if on_dark > on_light else 'light'


def by_first_background(text):
    for m in re.finditer(FIRST_BG, text, I):
        value = lightness(m.group(1))
        if value is not None:
            return 'dark' if value < 0.5 else 'light'


STEPS = [('page color', by_page_color), ('stated theme', by_stated_theme),
         ('text color', by_text_color), ('first background', by_first_background)]


def page_background(text):
    """Dark or light from the first step that decides: a page-level color,
    a stated theme, text colors outnumbering the other kind two to one, or
    the first CSS or labeled background color."""
    for name, step in STEPS:
        verdict = step(text)
        if verdict:
            return verdict, name
    return 'undetermined', 'none'


bg = collections.Counter(page_background(r['text']) for r in rows)
bg_ms = collections.Counter(page_background(r['text'])[0] for r in MS)
print(f'\n## Page background (all {N} | numbered and ms- {len(MS)})')
for key in ('dark', 'light', 'undetermined'):
    total = sum(n for (k, _s), n in bg.items() if k == key)
    steps = ', '.join(f'{s} {n}' for (k, s), n in sorted(bg.items()) if k == key)
    print(f'  {pct(total):>14} | {pct(bg_ms[key], len(MS)):>14}  {key} ({steps})')
show('Page background by prefix', collections.Counter(
    (r['prefix'], page_background(r['text'])[0]) for r in rows))
table('Stated theme', {'says dark': SAYS_DARK, 'says light': SAYS_LIGHT})
# How often the two weaker steps agree where a stronger step decides.
for name, step in STEPS[2:]:
    pairs = [(by_page_color(r['text']) or by_stated_theme(r['text']), step(r['text']))
             for r in rows]
    pairs = [(a, b) for a, b in pairs if a and b]
    agree = sum(1 for a, b in pairs if a == b)
    print(f'  {name} agrees with page color or stated theme: {agree} of {len(pairs)}')


def hexes(text):
    out = []
    for h in re.findall(r'(?<![&\w])#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b', text):
        h = h.lower()
        out.append('#' + (''.join(c * 2 for c in h) if len(h) == 3 else h[:6]))
    return out


hex_docs, hex_all = collections.Counter(), collections.Counter()
for r in rows:
    found = hexes(r['text'])
    hex_all.update(found)
    hex_docs.update(set(found))
show('Top 20 hex colors (prompts that use each)', hex_docs, 20)
print(f'  distinct hex colors: {len(hex_all)}; prompts with any: '
      f'{sum(1 for r in rows if hexes(r["text"]))}; hx- and dev21- prompts with any: '
      f'{sum(1 for r in rows if r["prefix"] in ("hx-", "dev21-") and hexes(r["text"]))}')

# 7. Techniques.
TECH = {
    'liquid glass or glassmorphism': r'liquid[- ]?glass|glass[- ]?morph|frosted[- ]glass',
    'backdrop blur': r'backdrop-filter|backdrop-blur|backdropFilter',
    'video file or <video> element': r'<video\b|\.mp4\b|\.webm\b|\.m3u8\b',
    'says background video': r'background[- ]video|video[- ]background|bg[- ]video',
    'HLS stream (.m3u8)': r'\.m3u8\b',
    'gradient': r'(?:linear|radial|conic)-gradient|bg-gradient-|\bgradient\b',
    'noise or grain': r'feTurbulence|fractalNoise|film[- ]grain|grainy'
                      r'|(?:noise|grain)[^\n.]{0,25}(?:texture|overlay|layer|filter|effect)'
                      r'|(?:texture|overlay|subtle|faint|fractal|svg|static)[^\n.]{0,15}'
                      r'(?:noise|grain)|noise[ /-]grain|grain[ /-]noise',
    'marquee': r'marquee|(?<!gsap )(?<!gsap\.)\bticker\b',
    'parallax': r'parallax',
    'scroll-triggered animation': r'scrolltrigger|whileInView|useInView|IntersectionObserver'
                                  r'|\buseScroll\b|scroll[- ](?:triggered|driven|linked)'
                                  r'|animation-timeline|on scroll',
    'split or letter-by-letter text': r'split ?text|split(?:ting)? (?:the )?(?:text|heading'
                                      r'|headline|title) into|letter[- ]by[- ]letter'
                                      r'|word[- ]by[- ]word|char(?:acter)?[- ]by[- ]char'
                                      r'|per[- ](?:letter|word|character|char)\b'
                                      r'|each (?:letter|word|character|char)\b'
                                      r'|\.split\(\s*[\'"]\s?[\'"]\s*\)',
    '3D, as a word or a CSS 3D transform': r'\b3d\b|three\.?js|@react-three|preserve-3d'
                                           r'|translateZ|rotate[XY]\(',
    'particles': r'particle',
    'shaders or WebGL': r'shader|webgl|\bglsl\b|gl_FragColor',
    'custom cursor': r'custom[- ]cursor|cursor:\s*none|cursor-none|cursor[- ](?:follower'
                     r'|trail|dot|ring|glow|blob)|follows? the (?:cursor|mouse)',
    'bento grid': r'bento',
    'magnetic button or hover': r'magnetic[\s"-]{1,3}(?:button|hover|effect|cursor|pull'
                                r'|mouse|interaction|squares|attraction|force|field|link)'
                                r'|magneticbutton',
    'beams or spotlights': r'\bbeams?\b|spotlight|light rays?|god ?rays',
    'aurora background': r'aurora[- ](?:background|glow|gradient|effect|lit|glass|blob|light)',
    'springs': r'type:\s*[\'"`]spring|useSpring|withSpring|stiffness|damping'
               r'|spring (?:physics|animation|transition|config)',
    'mask-composite border': r'mask-composite',
    'gradient text (background-clip: text)': r'background-clip:\s*text|bg-clip-text',
    'blend modes': r'mix-blend|blend-mode',
    'blur-in entrance (animates to blur 0)': r'blur\(\s*0(?:\.0+)?(?:px)?\s*\)',
}
table('Techniques', TECH)

# 8. Shared design language.
LANG = {
    'pill shapes (rounded-full, radius 9999px)': r'rounded-full|border-radius:\s*(?:9999|999|100)px',
    'white text at reduced opacity (text-white/NN)': r'text-white/\d+',
    'uppercase with letter spacing': r'uppercase[^\n]{0,80}(?:tracking|letter-spacing)'
                                     r'|(?:tracking|letter-spacing)[^\n]{0,80}uppercase',
    'serif italic accent': r'italic[^\n]{0,60}serif|serif[^\n]{0,60}italic',
}
table('Design language', LANG)
opacity = collections.Counter()
for r in rows:
    opacity.update(set(re.findall(r'text-white/(\d+)', r['text'])))
show('text-white/NN values (prompts that use each)', opacity, 10)


def luminance(rgb):
    c = [v / 255 for v in rgb]
    c = [v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4 for v in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


print('\n## WCAG contrast of white at NN% opacity over #0a0a0a')
for a in (30, 40, 50, 60, 70, 80, 90):
    mixed = [round(255 * a / 100 + 10 * (1 - a / 100))] * 3
    ratio = (luminance(mixed) + 0.05) / (luminance([10] * 3) + 0.05)
    print(f'  {a}%: {ratio:.1f} to 1')

# 9. Section headings: Markdown headings, bold-only lines, and caps lines.
HEAD = re.compile(r'^(?:#{1,6}\s+(.+?)\s*#*|\*\*([^*\n]{2,60})\*\*:?'
                  r'|([A-Z][A-Z0-9 &/()—–-]{2,50}))\s*$', re.M)
GROUPS = {
    'stack or setup': r'stack|depend|setup|tech|install|package|framework',
    'fonts or typography': r'font|typograph|type scale',
    'layout or structure': r'layout|structure|markup|page shell|layer',
    'assets or media': r'asset|media|video|image|url',
    'global CSS': r'global|css|reset|base style',
    'hero': r'hero',
    'animation or motion': r'anim|motion|entrance|transition|interaction',
    'responsive': r'responsive|breakpoint|mobile|tablet',
    'navbar': r'\bnav',
    'colors or tokens': r'colou?r|palette|token|theme|design system',
    'do and do-not rules': r'do not|don.t|avoid|never|rules|notes|behavio',
    'footer': r'footer',
    'accessibility': r'accessib|a11y',
}
has_group, names = collections.Counter(), collections.Counter()
for r in MS:
    heads = [next(x for x in m.groups() if x) for m in HEAD.finditer(r['text'])]
    heads = [h for h in heads if len(h) <= 60]
    names.update({re.sub(r'^[\d.)\s]+|[^\w\s/&-]', '', h.lower()).strip() for h in heads})
    for group, pat in GROUPS.items():
        if any(re.search(pat, h, I) for h in heads):
            has_group[group] += 1
show('Heading groups in numbered and ms- prompts', has_group, d=len(MS))
show('Most common headings in numbered and ms- prompts', names, 12, d=len(MS))

# 10. What changed over time, for folders dated by the live listing.
if LIVE:
    PERIOD = {'03': 'Mar-Apr', '04': 'Mar-Apr', '05': 'May-Jun', '06': 'May-Jun',
              '07': 'Jul-Aug', '08': 'Jul-Aug', '09': 'Sep'}
    groups = collections.defaultdict(list)
    for r, h in hits:
        groups[PERIOD[h['created_at'][5:7]]].append(r['text'])
    order = [p for p in ('Mar-Apr', 'May-Jun', 'Jul-Aug', 'Sep') if groups[p]]
    TREND = {
        'React': STACK['React'],
        'Tailwind CSS': STACK['Tailwind CSS'],
        'framer-motion or motion': STACK['framer-motion or motion'],
        'hls.js': STACK['hls.js'],
        'liquid glass or glassmorphism': TECH['liquid glass or glassmorphism'],
        'video file or <video> element': TECH['video file or <video> element'],
        'single HTML file, no framework': r'single[^\n]{0,30}(?:html|index\.html)[^\n]{0,20}file'
                                          r'|one html file|single-file html|self-contained html'
                                          r'|no frameworks?\b|no build step',
        'reduced motion': r'prefers-reduced-motion|reduced[- ]motion|useReducedMotion',
        'aria or focus-visible': r'aria-|focus-visible',
        'phone frame or Dynamic Island': r'dynamic island|iphone (?:frame|mockup)|phone frame',
    }
    print('\n## By live creation period: '
          + ' | '.join(f'{p} n={len(groups[p])}' for p in order))
    for label, pat in TREND.items():
        cells = [f'{100 * sum(1 for t in groups[p] if re.search(pat, t, I)) / len(groups[p]):>3.0f}%'
                 for p in order]
        print(f'  {" | ".join(cells)}  {label}')
    print(f'  median length: {[sorted(map(len, groups[p]))[len(groups[p]) // 2] for p in order]}')
```

## See also

- [The Guessling character][product-character] and
  [Reactions, sound, and haptics][trd-reactions], which set the four
  reactions this design must carry.
- [RevenueCat paywalls in React Native][rc-paywalls], for what the native
  paywall allows.
- [RevenueCat core category requirements][shipaton-cats], for the Best Game
  brief and its demo video.
- [Store listing and discoverability][bp-store] and
  [Demo video and write-up][bp-video], for the screenshots and the video.
- [Hosting the privacy policy and terms][cf-pages], for the three web
  pages.

[ms-home]: https://motionsites.ai/
[ms-unlimited]: https://motionsites.ai/unlimited
[ms-unlimited-js]: https://motionsites.ai/assets/unlimited-K6uVgjuc.js
[ms-dialog-js]: https://motionsites.ai/assets/PromptDetailDialog-ORjvw6mN.js
[ms-mcp]: https://motionsites.ai/mcp
[ms-motionsite]: https://motionsites.ai/motionsite
[ms-request]: https://motionsites.ai/request
[ms-design-md]: https://motionsites.ai/design-md
[ms-academy]: https://motionsites.ai/academy
[ms-lesson-ai]: https://motionsites.ai/lesson/build-animated-website-with-ai
[ms-lesson-ms]: https://motionsites.ai/lesson/build-animated-website-with-motionsites
[ms-lesson-3d]: https://motionsites.ai/lesson/build-3d-scroll-animated-website-with-ai
[rn-style]: https://reactnative.dev/docs/0.86/view-style-props
[trd-reactions]: /docs/archive/guessling-trd.md#reactions-sound-and-haptics
[trd-a11y]: /docs/archive/guessling-trd.md#accessibility
[expo-video]: https://docs.expo.dev/versions/v57.0.0/sdk/video/
[product-character]: /docs/archive/guessling-product.md#the-guessling-character
[rc-paywalls]: /docs/research/revenuecat-expo.md#revenuecat-paywalls-and-customer-center-in-react-native
[shipaton-cats]: /docs/research/shipaton-2026.md#revenuecat-core-category-requirements
[cf-pages]: /docs/research/cloudflare-workers.md#hosting-the-privacy-policy-and-terms
[bp-store]: /docs/research/best-practices.md#store-listing-and-discoverability
[bp-video]: /docs/research/best-practices.md#demo-video-and-write-up

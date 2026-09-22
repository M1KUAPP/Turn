# motionsites.ai for Turn research notes

What changed on motionsites.ai since the [earlier motionsites note][ms-note]
of September 22, 2026, what its prompt corpus holds that is close to Turn, how
the corpus's common patterns fare against WCAG 2.2, and which of them suit
Turn's app, demo video, Devpost images, and README, for Turn's
`docs/DESIGN.md`, beside three sibling notes on frontend trends, AAC design,
and iOS design. Every source was read on September 23, 2026, so counts and
page text are as of that date, and judgment starts with "Synthesis:". Facts
the earlier note already holds are linked, not repeated.

Contents:

1.  [Findings for DESIGN.md](#findings-for-designmd)
1.  [Sources and method](#sources-and-method)
1.  [The live site on September 23, 2026](#the-live-site-on-september-23-2026)
1.  [The corpus through Turn's lens](#the-corpus-through-turns-lens)
1.  [Accessibility of the common patterns](#accessibility-of-the-common-patterns)
1.  [The prompts closest to Turn](#the-prompts-closest-to-turn)
1.  [What transfers to Turn, surface by surface](#what-transfers-to-turn-surface-by-surface)
1.  [Conflicts between sources](#conflicts-between-sources)
1.  [Gaps](#gaps)
1.  [Appendix: analysis script](#appendix-analysis-script)
1.  [See also](#see-also)

## Findings for DESIGN.md

Synthesis: each bullet condenses the section it links to, where the sources
are.

- **Nothing on motionsites.ai is about AAC, speech, or disability.** The
  nearest prompts are a voice-input template and two prosthetics pages, one
  with its subtext at 2.22 to 1. Turn can borrow craft, but its rules come
  from the PRD's [accessibility requirements][prd-a11y]. See
  [Subjects close to Turn](#subjects-close-to-turn).
- **Borrow the newest spec format, not the pages.** The best prompt near Turn
  lists its motion inventory, exact copy, and acceptance checks; DESIGN.md
  should too, with checks that name A11Y-1 to A11Y-8. See
  [Layout and type in the closest prompts](#layout-and-type-in-the-closest-prompts).
- **Set text tokens per theme from computed floors.** White text on `#0a0a0a`
  clears 4.5 to 1 only from 45% opacity, black on white from 54%, and a gray
  can pass in one theme and fail in the other. A prompt that claims 4.5 to 1
  computes to 3.92 to 4.41, so every pair in DESIGN.md should carry its
  measured ratio. See [Text contrast (1.4.3)](#text-contrast-143).
- **Give every control a solid fill and a 3:1 edge.** Glass edges of white at
  10% to 20% on near-black reach 1.25 to 1.77 to 1, and 3 to 1 needs 34%; the
  row, grid, and strip need the edges [A11Y-7][prd-a11y] asks for. See
  [Boundaries and states (1.4.11 and 1.4.1)](#boundaries-and-states-1411-and-141).
- **Calm in copy, busy in motion: refuse the loops.** Eleven of 18 wellness
  prompts loop a video or an infinite animation, none handles reduced motion,
  and no background loop in the corpus can be paused. Turn should have no
  ambient motion, and the listening light should hold still. See
  [Motion (2.2.2 and 2.3.3)](#motion-222-and-233).
- **Nothing moves under a finger, and nothing hides behind hover.**
  Fade-and-rise entrances shift targets, and 67.5% of motionsites.ai prompts
  style hover. The row may cross-fade a phrase inside its fixed slot, swapping
  instantly under Reduce Motion, and every control needs pressed and focused
  looks. See [The native iPhone app](#the-native-iphone-app).
- **Size for Turn, not for landing pages.** Pill buttons estimate at a median
  of 40 px, 22.6% of motionsites.ai prompts set text under 12 px, and 32.5%
  scale text with the viewport. Take the shapes, and take sizes from Turn's
  44 pt minimum, 64 pt row, and Dynamic Type. See
  [Resize, reflow, and target size (1.4.4, 1.4.10, 2.5.8)](#resize-reflow-and-target-size-144-1410-258).
- **Warm light fields are the corpus's calm, legible pattern.** Cream with
  brown or near-black ink reaches 12.98 to 16.17 to 1, with one accent and no
  violet, a fit for Turn's light theme once the accent has a text shade. See
  [Color, imagery, and motion in the closest prompts](#color-imagery-and-motion-in-the-closest-prompts).
- **Design pitch assets for how they're seen.** Devpost shows a thumbnail at
  333 by 222 px and a portrait screenshot at 264 by 573 px, GitHub serves
  light and dark images, and YouTube's automatic captions can misrepresent
  speech. That calls for a typographic thumbnail, 3:2 composites, both-theme
  README images, and captions written by hand. See
  [What transfers to Turn, surface by surface](#what-transfers-to-turn-surface-by-surface).
- **Skip the website.** No Next Gen item needs one, and the privacy notice
  ships in the app and README. See [A one-page website](#a-one-page-website).
- **Still take patterns, not media or fonts.** The terms still reserve all
  rights, and prompts near Turn load commercial type from font mirrors. See
  [License and terms][ms-note-license].

[ms-note-license]: /docs/research/motionsites.md#license-and-terms

## Sources and method

- **Site.** From 02:54 on September 23, 2026 (UTC+8), `curl` fetched, without
  logging in, the home page, the 13 URLs in the [sitemap][ms-sitemap], two
  more Academy lessons, the routes the earlier note found in the site's code,
  and eleven policy paths, reading the server-rendered HTML and page code.
- **Live listing.** The home page reads a `prompts` table with the public key
  it ships ([ms-index-js]); the same anonymous read at 18:55 UTC on September
  22 (02:55 on September 23, UTC+8), 15 hours after the earlier note's,
  returned 529 rows of the page's 15 columns and no prompt text.
- **Corpus.** The 813 folders, unchanged since September 18, were read in
  place. Counts come from the [appendix](#appendix-analysis-script) script;
  each regex was checked against a sample of its matches and narrowed where
  it caught something else, such as `translateY` for translation or "design
  language" for sign language.
- **Close reading.** 27 prompts, none among the earlier note's 27, were read
  in full ([The 27 prompts read in full](#the-27-prompts-read-in-full)).
- **Other sources.** [WCAG 2.2][wcag22], a W3C Recommendation of December
  12, 2024, with its Understanding documents, [errata][wcag-errata], and W3C's
  [WCAG2ICT][wcag2ict] note; Devpost's help center and the Shipaton 2026
  gallery and project pages, whose images were measured; GitHub Docs; and
  YouTube Help. Two web searches located the Devpost article.

[ms-sitemap]: https://motionsites.ai/sitemap.xml

## The live site on September 23, 2026

### Changes since September 22

- **Three new prompts.** The listing grew from 526 to 529 rows, all three
  created on September 22: "Space Voyage" (Creative, free), "Avelon Drive"
  (Cars), and "Golden Identity" (Agency), all heroes. September counts 52
  prompts, and 180 of 529 are free (appendix).
- **An archive prompt went live.** `397-space-voyage`, from the July 17
  export, matches the new "Space Voyage" row, so the newest matched folder
  is dated September 22, not August 30 as in
  [How the corpus matches the live catalog][ms-note-match].
- **Prices and plans.** Unchanged from the [price table][ms-note-prices]:
  $129 for three months, $279 a year, and $399 for life beside a struck-out
  $759 ([ms-unlimited]), from the same script files the earlier note cited
  ([ms-unlimited-js]; [ms-dialog-js]).
- **Terms.** Unchanged: `/terms`, `/privacy`, `/license`, `/refund`, and seven
  more policy paths, `/accessibility` among them, return HTTP 404; the footer
  still reads "All rights reserved" ([ms-home]); and the DESIGN.md page still
  shows four "Coming soon" cards ([ms-design-md]).

[ms-note-match]: /docs/research/motionsites.md#how-the-corpus-matches-the-live-catalog
[ms-note-prices]: /docs/research/motionsites.md#prices-on-september-22-2026
[ms-unlimited]: https://motionsites.ai/unlimited
[ms-unlimited-js]: https://motionsites.ai/assets/unlimited-K6uVgjuc.js
[ms-dialog-js]: https://motionsites.ai/assets/PromptDetailDialog-ORjvw6mN.js
[ms-home]: https://motionsites.ai/
[ms-design-md]: https://motionsites.ai/design-md

### What the catalog holds near Turn

- **App prompts stopped in July.** The Apps page ([ms-apps]) lists rows typed
  `mobile` ([ms-index-js]): 41 prompts, 9 free, 40 created in July 2026 and
  one in May, none since July 31.
- **Health and wellness arrived with July.** 22 rows carry a health or
  wellness category: Wellness (9), Healthcare (4), Health (3), and one each of
  Health App, Medicine, Medical, Med, Mindfulness, and Fitness, the earliest
  on July 6, 2026 ("Stillmind", on July 2, is filed under Hero); 7 are in the
  corpus.
- **Nothing on disability or speech.** One row each is filed under AI
  Assistant, AI App, and Communication, but no category, title, or id names
  accessibility, assistive technology, AAC, voice, speech, hearing, or
  captions; "SpeakUp Venture Hero" is a venture studio's page.

[ms-apps]: https://motionsites.ai/apps

### Accessibility guidance on the site

- **None in the pages.** No page mentions reduced motion, contrast, WCAG,
  screen readers, or captions; "accessible" appears once, meaning available,
  in "motion-first websites accessible to anyone" ([ms-motionsite]).
- **The gallery autoplays.** Each catalog card plays its preview video muted
  and looping ([ms-card-js]). Of the stylesheet and 13 scripts read, only the
  Sonner toast library's code has a `prefers-reduced-motion` rule
  ([ms-main-js]).
- **The one public prompt.** The scroll lesson's prompt scrubs video with the
  scroll, reveals blocks on scroll, sets 10 or 11 px labels, and has no
  reduced-motion rule, though it gives alt text ([ms-lesson-scroll]).

[ms-motionsite]: https://motionsites.ai/motionsite
[ms-card-js]: https://motionsites.ai/assets/PromptCard-CABYwf6z.js
[ms-main-js]: https://motionsites.ai/assets/index-BDDE3vjG.js
[ms-lesson-scroll]: https://motionsites.ai/lesson/build-scroll-animated-website-with-ai

## The corpus through Turn's lens

Counts are prompts with a match, in four groups: all 813, the 483 from
motionsites.ai (numbered and `ms-`), the 88 whose subject is close to Turn,
and the 41 about a mobile app; the corpus itself is described in the earlier
note's [local prompt corpus][ms-note-corpus] section.

[ms-note-corpus]: /docs/research/motionsites.md#the-local-prompt-corpus

### Subjects close to Turn

A subject is judged from the title, the live category and type, Superdesign's
category and tags, and the first 500 characters, where motionsites.ai prompts
name the build ([What 27 prompts share][ms-note-27]).

| Subject                         | All 813    | motionsites.ai 483 |
| ------------------------------- | ---------- | ------------------ |
| Health or medicine              | 15 (1.8%)  | 11 (2.3%)          |
| Care                            | 4 (0.5%)   | 3 (0.6%)           |
| Wellness or mindfulness         | 18 (2.2%)  | 13 (2.7%)          |
| Accessibility or assistive tech | 3 (0.4%)   | 2 (0.4%)           |
| Communication                   | 7 (0.9%)   | 2 (0.4%)           |
| Voice or speech                 | 1 (0.1%)   | 0 (0.0%)           |
| Audio or music                  | 8 (1.0%)   | 2 (0.4%)           |
| AI assistant or agent           | 19 (2.3%)  | 8 (1.7%)           |
| Mobile app                      | 41 (5.0%)  | 22 (4.6%)          |
| Any of these                    | 88 (10.8%) | 49 (10.1%)         |

- **Assistive.** Two prosthetics pages (`354-prosthetics-hero`;
  `hx-hand-prosthesis-simulator`) and an ADHD-friendly planner
  (`ms-adhd-planner`).
- **Voice.** A 619-character 21st.dev template that installs a voice-input
  component (`dev21-user_2rQ1QHrJyxpmWMHhqhANzWMc64n-ai-voice-input`); no
  prompt designs speech output, captions, or a conversation.

### Accessibility mentions

The periods date the 384 matched folders by the live listing, as in the
earlier note's [Dates and the newest prompts][ms-note-dates].

| Mention                          | All 813     | motionsites.ai 483 | Close to Turn 88 | Mar–Apr 125 | May–Jun 191 | Jul–Aug 68 |
| -------------------------------- | ----------- | ------------------ | ---------------- | ----------- | ----------- | ---------- |
| `prefers-reduced-motion`         | 32 (3.9%)   | 31 (6.4%)          | 8 (9.1%)         | 0.8%        | 5.2%        | 29.4%      |
| Reduced motion, any form         | 38 (4.7%)   | 36 (7.5%)          | 8 (9.1%)         | 0.8%        | 7.3%        | 30.9%      |
| Contrast, any mention            | 232 (28.5%) | 69 (14.3%)         | 25 (28.4%)       | 4.8%        | 2.6%        | 5.9%       |
| Contrast as a requirement        | 47 (5.8%)   | 29 (6.0%)          | 7 (8.0%)         | 0.8%        | 0.5%        | 0.0%       |
| A contrast number, such as 4.5:1 | 5 (0.6%)    | 0 (0.0%)           | 3 (3.4%)         | 0.0%        | 0.0%        | 0.0%       |
| Accessibility, WCAG, or a11y     | 70 (8.6%)   | 54 (11.2%)         | 6 (6.8%)         | 0.0%        | 1.0%        | 4.4%       |
| ARIA attribute or role           | 88 (10.8%)  | 79 (16.4%)         | 9 (10.2%)        | 0.8%        | 20.4%       | 33.8%      |
| Visible focus style              | 66 (8.1%)   | 41 (8.5%)          | 5 (5.7%)         | 0.0%        | 7.3%        | 10.3%      |
| Removes the focus outline        | 25 (3.1%)   | 21 (4.3%)          | 5 (5.7%)         | 0.0%        | 7.3%        | 7.4%       |
| Keyboard access                  | 26 (3.2%)   | 19 (3.9%)          | 2 (2.3%)         | 2.4%        | 3.1%        | 4.4%       |
| Alt text                         | 49 (6.0%)   | 41 (8.5%)          | 7 (8.0%)         | 0.0%        | 13.1%       | 17.6%      |
| Captions or subtitles for video  | 0           | 0                  | 0                | 0.0%        | 0.0%        | 0.0%       |

- **Numbers only in Superdesign.** No motionsites.ai prompt states a contrast
  ratio; the five that do are Superdesign prompts asking for 4.5 to 1
  (`sup-claymorphism-mobile-app-pastel-habit-tracker-home`).
- **Archive boilerplate.** 49 of the 54 motionsites.ai prompts that name
  accessibility, and 27 of the 29 that ask for contrast, are archive texts in
  the "premium" [working-prompt mode][ms-note-modes].

[ms-note-dates]: /docs/research/motionsites.md#dates-and-the-newest-prompts
[ms-note-modes]: /docs/research/motionsites.md#working-prompt-modes

### Text size, weight, and opacity

| Pattern                                 | All 813     | motionsites.ai 483 | Close to Turn 88 | Mobile app 41 |
| --------------------------------------- | ----------- | ------------------ | ---------------- | ------------- |
| Sets a text size                        | 409 (50.3%) | 365 (75.6%)        | 46 (52.3%)       | 21 (51.2%)    |
| Smallest size under 12 px               | 124 (15.3%) | 109 (22.6%)        | 15 (17.0%)       | 10 (24.4%)    |
| Smallest size exactly 12 px             | 122 (15.0%) | 110 (22.8%)        | 17 (19.3%)       | 5 (12.2%)     |
| Text sized in viewport units or clamp() | 182 (22.4%) | 157 (32.5%)        | 11 (12.5%)       | 2 (4.9%)      |
| Full-height section that hides overflow | 143 (17.6%) | 132 (27.3%)        | 19 (21.6%)       | 6 (14.6%)     |
| Thin weights (100 to 300)               | 118 (14.5%) | 107 (22.2%)        | 11 (12.5%)       | 5 (12.2%)     |
| White text at reduced opacity           | 157 (19.3%) | 147 (30.4%)        | 23 (26.1%)       | 7 (17.1%)     |
| White text under 45% opacity            | 38 (4.7%)   | 33 (6.8%)          | 7 (8.0%)         | 3 (7.3%)      |

- **Sizes.** Tailwind names count at their pixel sizes (`text-xs` is 12 px),
  other sizes as written, and sizes under 6 px are skipped as decoration. Of
  the 365 motionsites.ai prompts that set sizes, 109 (29.9%) go under 12 px.

### Color, video, and motion

The earlier note's [background classifier][ms-note-bg] finds 286 dark, 124
light, and 403 undetermined pages among all 813, and 39, 11, and 38 among the
88 close prompts.

| Pattern                              | All 813     | motionsites.ai 483 | Close to Turn 88 | Mobile app 41 |
| ------------------------------------ | ----------- | ------------------ | ---------------- | ------------- |
| Liquid glass or glassmorphism        | 293 (36.0%) | 172 (35.6%)        | 33 (37.5%)       | 13 (31.7%)    |
| Video file or `<video>` element      | 341 (41.9%) | 341 (70.6%)        | 37 (42.0%)       | 14 (34.1%)    |
| Autoplay                             | 275 (33.8%) | 274 (56.7%)        | 31 (35.2%)       | 13 (31.7%)    |
| Pause or play control for the viewer | 6 (0.7%)    | 4 (0.8%)           | 4 (4.5%)         | 3 (7.3%)      |
| Parallax                             | 77 (9.5%)   | 70 (14.5%)         | 5 (5.7%)         | 1 (2.4%)      |
| Scroll-triggered reveal              | 177 (21.8%) | 165 (34.2%)        | 7 (8.0%)         | 2 (4.9%)      |
| Scroll-linked motion                 | 108 (13.3%) | 101 (20.9%)        | 5 (5.7%)         | 2 (4.9%)      |
| Marquee or ticker                    | 67 (8.2%)   | 53 (11.0%)         | 3 (3.4%)         | 1 (2.4%)      |
| Infinite animation                   | 156 (19.2%) | 111 (23.0%)        | 15 (17.0%)       | 5 (12.2%)     |
| Pulsing dot                          | 19 (2.3%)   | 5 (1.0%)           | 0 (0.0%)         | 0 (0.0%)      |
| Hover styles                         | 368 (45.3%) | 326 (67.5%)        | 33 (37.5%)       | 11 (26.8%)    |
| Says something appears on hover      | 7 (0.9%)    | 6 (1.2%)           | 0 (0.0%)         | 0 (0.0%)      |
| Blur-in entrance                     | 42 (5.2%)   | 42 (8.7%)          | 3 (3.4%)         | 2 (4.9%)      |
| Phone frame or Dynamic Island        | 18 (2.2%)   | 17 (3.5%)          | 18 (20.5%)       | 18 (43.9%)    |

- **No pause for loops.** The six play or pause controls belong to two
  music-player mockups, a timer, a demo video, a button that starts a video,
  and hover zones; none pauses a background loop.
- **Reduced motion spares the video.** Of 19 prompts that play video and
  handle reduced motion, 3 stop or hide the video under it (`ms-cyber-layer`;
  `ms-pet-diagnostics`; `ms-space-planet`), and `ms-real-time-alerts` exempts
  its video on purpose as the "static stage".
- **Calm subjects move.** Of 18 wellness prompts, 11 loop a video or an
  infinite animation and none handles reduced motion; of 15 health or care
  prompts, 9 loop and 1 handles it.
- **Dots and hover.** In the matches read, a pulsing dot sits beside a label
  such as "All systems operational"; 1 of the 19 prompts handles reduced
  motion. Of 7 prompts that say content appears on hover, 1 offers a focus or
  touch fallback.

[ms-note-bg]: /docs/research/motionsites.md#page-backgrounds-and-hex-colors

### Button sizes

A rounded button class with padding, a text size, and no set height is
estimated as Tailwind's line height plus twice its vertical padding, at the
phone-width classes. 62 such strings in 39 motionsites.ai prompts give a
median of 40 px, 39 under 44 px and none under 24 px; 27 of the 39 prompts go
under 44 px. The close prompts give 23 strings, with a median of 44 px.

## Accessibility of the common patterns

WCAG 2.2 is written for web content; for native software, W3C's
[WCAG2ICT][wcag2ict] says to "use platform-defined density-independent pixel
measurements which approximate the CSS reference pixel", naming "points (pt)
for iOS". Contrast uses WCAG's relative luminance, with its 0.04045
threshold, and "(L1 + 0.05) / (L2 + 0.05)" ([wcag22]).

### Text contrast (1.4.3)

Text needs "a contrast ratio of at least 4.5:1", and large text 3 to 1
([wcag22]); large is "approximately 18.5px and 24px" for 14 pt bold and 18 pt,
and "4.499:1 would not meet the 4.5:1 threshold" ([u-contrast]).

| White text at                     | 30%  | 40%  | 50%  | 60%  | 70%  | 80%   | 90%   |
| --------------------------------- | ---- | ---- | ---- | ---- | ---- | ----- | ----- |
| On `#0a0a0a`                      | 2.59 | 3.77 | 5.33 | 7.30 | 9.71 | 12.58 | 15.94 |
| On `#000000`                      | 2.46 | 3.66 | 5.28 | 7.37 | 9.96 | 13.08 | 16.75 |
| On glass, white/10 over `#0a0a0a` | 2.70 | 3.72 | 5.00 | 6.56 | 8.40 | 10.55 | 13.02 |

- **Floors.** White text reaches 4.5 to 1 from 45% on `#0a0a0a`, 46% on
  black, and 47% on that glass, and black text from 54% on white; 38 prompts
  set white text below 45%.
- **Grays flip between themes.** `#6b7280` gives 4.83 on white but 4.10 on
  `#0a0a0a`; `#888888` gives 5.58 on `#0a0a0a` but 3.54 on white; `#9ca3af`
  gives 7.80 and 2.54; `#666666` gives 3.45 and 5.74.
- **Thin type.** Thin fonts "may be rendered by user agents with a much
  fainter color" ([u-contrast]); 22.2% of motionsites.ai prompts use weights
  of 100 to 300 (`ms-mind-body-healing` sets its muted lines light).
- **Claims that don't compute.** The claymorphism prompt pairs each pastel
  with a darker text shade for "contrast >= 4.5:1", but its sage, peach,
  butter, and sky pairs give 4.41, 3.92, 4.09, and 4.41, and its muted text
  2.98 (`sup-claymorphism-mobile-app-pastel-habit-tracker-home`). White on the
  terracotta send button gives 4.48 (`sup-warm-terracotta-ai-chat-interface`).
- **Text over video.** WCAG's failure F83 is "using background images that do
  not provide sufficient contrast" ([u-contrast]). Over a white frame, white
  text needs a black scrim of at least 54%; 40% gives 2.85, and white at 80%
  under 60% gives 4.37. Close prompts use 10% to 30% (`454-wellbeing-os`;
  `082-celestial-renewal`) or "No dark overlay" (`457-wellness-hero`).
- **The disability page.** `354-prosthetics-hero` sets 13 px subtext in
  `#9ca3af` on `#f0f0ee`, 2.22 to 1, and an 11.5 px blue link at 3.22.
- Synthesis: opacity ranks text in the corpus, and it works only above a
  floor that changes with the background; DESIGN.md should name solid text
  tokens per theme, each with its ratio, and measure every claim.

[u-contrast]: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

### Boundaries and states (1.4.11 and 1.4.1)

- **The criteria.** "Visual information required to identify user interface
  components and states" needs 3 to 1 against adjacent colors, and "Color is
  not used as the only visual means of conveying information" ([wcag22]).
- **Edges, with a caveat.** A control identified by its text needs no drawn
  boundary, but "it is a best practice to delineate the boundary of all
  controls" for people with cognitive disabilities ([u-non-text]); Turn's
  [A11Y-7][prd-a11y] asks for button edges at 3 to 1.
- **Glass edges fail.** Against `#0a0a0a`, white edges at 5%, 10%, 15%, 20%,
  and 30% give 1.10, 1.25, 1.47, 1.77, and 2.59; 3 to 1 needs 34%.
  `445-vitara-hero`'s chips give 1.61, `214-innovation-summit`'s FAQ cards
  1.50, and `333-place-saver`'s plan cards 1.36.
- **Shape as well as color.** The claymorphism screen makes done and pending
  "obviously distinct", a raised check against a ringed well, and the
  champagne paywall marks Pro with checks and Free with dashes
  (`sup-champagne-noir-paywall-65a2fd`); the pulsing dots read sit beside
  labels, so the word holds the meaning.

[u-non-text]: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html

### Motion (2.2.2 and 2.3.3)

- **Pause, Stop, Hide.** Moving content that "(1) starts automatically, (2)
  lasts more than five seconds, and (3) is presented in parallel with other
  content" needs a way to pause, stop, or hide it ([wcag22]), because "Some
  people with cognitive disabilities and attention deficits are distracted by
  continuous movement" ([u-pause]).
- **What doesn't count.** "Having an animation stop only so long as a user has
  focus on it ... would not be considered a 'mechanism for the user to
  pause'" ([u-pause]). Synthesis: the 6 prompts whose motion pauses only
  while hovered fail the same way.
- **The corpus.** Autoplaying video (275 prompts), infinite animation (156),
  and marquees (67) run past five seconds unpaused, and
  `455-wellness-balance` rotates a card every 3.5 seconds.
- **Animation from Interactions.** At Level AAA, "Motion animation triggered by
  interaction can be disabled"; parallax is "often non-essential", reactions
  include "nausea, migraine headaches", and `prefers-reduced-motion` is a
  sufficient technique ([u-animation]). The corpus has parallax in 77 prompts
  and scroll-linked motion in 108 (`466-yoga-coach` follows the cursor).
- **Opacity isn't motion; blur now is.** WCAG's definition excludes "changes
  of color, blurring, or opacity", but a June 27, 2025 erratum amends it "to
  not exclude blurring" ([wcag-errata]), bringing the 42 blur-in entrances
  under 2.3.3; fades without movement stay outside it.
- Synthesis: the corpus's reduced-motion rules switch off entrances and keep
  the ambient loops, the part 2.2.2 is about.

### Resize, reflow, and target size (1.4.4, 1.4.10, 2.5.8)

- **Resize.** Text must scale "up to 200 percent without loss of content or
  functionality" ([wcag22]), and "incorrect use of viewport units to resize
  text" is failure F94 ([u-resize]). 32.5% of motionsites.ai prompts size text
  with the viewport or `clamp()`, and 27.3% set a full-height section that
  hides overflow, clipping text that grows.
- **Reflow.** Content must work "at a width equivalent to 320 CSS pixels"
  without two-way scrolling ([wcag22]; [u-reflow]). `ms-pet-diagnostics`
  checks "No horizontal scrollbar" from 320 px, one of a handful of prompts
  that test overflow at a phone width.
- **Target size.** Targets need "at least 24 by 24 CSS pixels" ([wcag22]),
  for people with "hand tremors, spasticity, and quadriplegia"; important
  controls should aim for 2.5.5 ([u-target]). The corpus's buttons pass 24 px,
  and 39 of 62 fall under 44 ([Button sizes](#button-sizes)).
- Synthesis: 32 to 40 px buttons pass 2.5.8, but Turn's users are the people
  it names, and the PRD asks for 44 pt controls and 64 pt row buttons
  ([A11Y-1][prd-a11y]), so the corpus's sizes don't transfer.

[u-resize]: https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
[u-reflow]: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
[u-target]: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html

## The prompts closest to Turn

### The 27 prompts read in full

- **Health and care:** `049-aura-hero`, `206-health-portal`,
  `445-vitara-hero`, `hx-medlio`, `ms-mind-body-healing`,
  `ms-pet-diagnostics`, and `ms-wellness-device`.
- **Calm and wellness:** `077-calm-hero`, `082-celestial-renewal`,
  `404-stillmind`, `454-wellbeing-os`, `455-wellness-balance`,
  `457-wellness-hero`, `466-yoga-coach`,
  `sup-claymorphism-mobile-app-pastel-habit-tracker-home`, and
  `sup-softly-digital-wellness-app`.
- **Assistive and cognitive:** `354-prosthetics-hero` and `ms-adhd-planner`.
- **Voice, communication, and AI assistants:**
  `dev21-user_2rQ1QHrJyxpmWMHhqhANzWMc64n-ai-voice-input`,
  `145-email-landing-page`, `ms-ai-workflow-agents`, and
  `sup-warm-terracotta-ai-chat-interface`.
- **Phone apps and paywalls:** `094-coffee-rewards`, `214-innovation-summit`,
  `333-place-saver`, `424-travel-journal`, and
  `sup-champagne-noir-paywall-65a2fd`.

### Layout and type in the closest prompts

- **One screen, one message.** A floating nav pill, a badge, a two-line
  headline, one sentence, and one or two pill buttons on a single viewport
  (`077-calm-hero`; `457-wellness-hero`; `ms-mind-body-healing`).
- **Type.** A grotesk for everything and an expressive face for the headline
  or one word in it: Instrument Serif, Playfair Display, Cormorant Garamond,
  Fraunces, or Inria Serif; also a script logo (`082-celestial-renewal`),
  condensed capitals (`466-yoga-coach`), and a rounded sans (claymorphism).
- **Small print.** Tab and FAQ labels at 10 px (`424-travel-journal`;
  `214-innovation-summit`), a 10.5 px badge and 12 px terms
  (`333-place-saver`), an 8 px logo line (`206-health-portal`), and table text
  down to 8.5 px (`ms-pet-diagnostics`).
- **A spec with checks.** `ms-pet-diagnostics` has "no scroll, entrance, or
  decorative animations", a "Total motion inventory", no video under reduced
  motion, and acceptance checks. Synthesis: DESIGN.md should read like it.

### Color, imagery, and motion in the closest prompts

- **Dark over video, mostly.** 39 of the 88 close prompts are dark and 11
  light; video sits behind 37, under light scrims or none. The imagery is
  generated skies, water, woods, soft-lit people, and products.
- **Warm light, when light.** `#321C04` on `#F6E4CF` gives 12.98 to 1
  (`ms-adhd-planner`), and `#1A1A1A` on `#FAF6F0` 16.17
  (`sup-warm-terracotta-ai-chat-interface`). Each keeps one accent and bans
  violet; the terracotta gives 4.16 as text on cream, its deeper shade 5.18
  on paper.
- **Ambient motion.** Video that floats forever (`049-aura-hero`), an overlay
  that bobs forever (`404-stillmind`), a pulsing "Breathe" button
  (`sup-softly-digital-wellness-app`), shimmering headline text
  (`145-email-landing-page`), and clouds on the scroll
  (`082-celestial-renewal`).
- **Reduced motion.** Four of the 27 handle it (`ms-pet-diagnostics`;
  `333-place-saver`; `094-coffee-rewards`; `214-innovation-summit`).

### Copy and tone in the closest prompts

- **Calm in few words.** "Calm Your Mind" (`077-calm-hero`), "Your calm is
  always within" (`457-wellness-hero`), and "No noise." beside four looping
  videos (`ms-adhd-planner`); a focus app promises to "Rise above the chaos"
  over an animation that never stops (`404-stillmind`).
- **Trust lines.** Compliance badges (`049-aura-hero`), a YC badge
  (`ms-ai-workflow-agents`), and "Terra can make mistakes"
  (`sup-warm-terracotta-ai-chat-interface`).
- **Paywalls.** "Premium, not pushy", ending with Terms, Privacy, and Restore
  (`sup-champagne-noir-paywall-65a2fd`), or features, two plan cards, a badge,
  and a full-width Subscribe button (`333-place-saver`).
- **Disability.** The prosthetics hero addresses "people who keep fighting"
  (`354-prosthetics-hero`).

### How they present a phone app

- **HTML iPhones.** Frames 370 to 393 px wide with a drawn Dynamic Island,
  status bar, and home indicator, two or three side by side on a stage that
  scales to fit (`333-place-saver`; `214-innovation-summit`;
  `424-travel-journal`).
- **Shrunk to fit.** Screens scaled to 0.78 or 0.787, or content to 93%, put
  labels at 8 to 10 px (`094-coffee-rewards`; `333-place-saver`;
  `214-innovation-summit`); Superdesign instead draws a frameless 390 px
  screen (`sup-claymorphism-mobile-app-pastel-habit-tracker-home`).

## What transfers to Turn, surface by surface

Every bullet here is judgment. Turn's constraints come from its
[product principles][product-principles], the PRD's
[accessibility requirements][prd-a11y], and the TRD's
[accessibility in the app][trd-a11y]; web-only techniques are in the earlier
note's [Web-only patterns][ms-note-web].

[product-principles]: /docs/PRODUCT.md#product-principles
[ms-note-web]: /docs/research/motionsites.md#web-only-patterns

### The native iPhone app

- Synthesis: **fits.**
  - Text tokens per theme with measured ratios, and the computed floors as the
    faintest level allowed.
  - A warm light theme and a near-black dark theme, each with one accent that
    has a text shade and a fill shade.
  - State shown by shape, icon, and word: the raised check and ringed well
    suit the fixed buttons and the marked category tab ([ROW-9][prd-row]), and
    a dot beside a word suits the listening light, which
    [CONSENT-5][prd-consent] already labels "Listening".
  - Opaque buttons with 3:1 edges, exact copy, and a written motion inventory.
- Synthesis: **doesn't fit.**
  - Video, ambient loops, parallax, scroll-linked motion, marquees, cursor
    effects, and hover reveals: an iPhone has no pointer, and loops are what
    2.2.2 targets.
  - Entrance rises and staggers on the row or the grid: even 8 px moves a
    button a finger is heading for, against the fixed positions AAC relies on
    ([AAC notes][aac-fixed]) and [ROW-1][prd-row]. A cross-fade inside a fixed
    slot moves nothing; under Reduce Motion, the swap is instant.
  - A light that pulses all session, the corpus's pulsing dot: a steady light
    with its word says the same, and [A11Y-6][prd-a11y] already stops the
    pulse under Reduce Motion.
  - Blur-in text, glass edges, small tracked capitals, thin weights, and type
    tied to screen width; Dynamic Type sets sizes ([A11Y-4][prd-a11y]).
  - 32 to 40 px pills, hover-only actions where Turn uses named actions
    ([A11Y-8][prd-a11y]), and splash counters or entrances that wait for
    media, since speaking never waits ([SPEAK-5][prd-grid]).
  - The corpus's shrink on press, to 0.95 or 0.98; a darker fill gives
    feedback without changing the target under the finger.

[prd-consent]: /docs/PRD.md#permission-and-consent
[aac-fixed]: /docs/research/aac-practice.md#fixed-button-positions-and-motor-automaticity
[prd-grid]: /docs/PRD.md#the-speaking-grid

### The demo video

- Synthesis: **fits.** Title cards in the corpus's rhythm, two short lines
  with one emphasized word that fade and rise once, then rest; one accent;
  and one script for voice, on-screen text, and captions ([pitch][idea-pitch]).
- Synthesis: **doesn't fit.** Loops behind text, blur-in or letter-by-letter
  reveals, shimmering gradients, and secondary lines in white at 40% to 60%.
  HTML phone frames don't apply: the rules want footage "functioning on the
  device" ([Next Gen notes][ng-submit]).
- **Size.** Devpost embeds the player at 660 by 371 px ([dp-day-box]), about
  a third of 1920 by 1080, so 36 px text shows near 12 px. Synthesis: size
  on-screen text for the embed.
- **Captions.** WCAG's captions "identify who is speaking and include
  non-speech information" ([u-captions]); YouTube's automatic captions "might
  misrepresent the spoken content due to mispronunciations, accents, dialects,
  or background noise" ([yt-auto]), and its transcripts mark speakers with
  ">>" and sounds in square brackets ([yt-transcript]). Synthesis: the demo
  mixes a partner's speech with a synthetic voice, so upload a written caption
  file naming the partner and Turn, and burn in the key exchange on a plate of
  at least 54% black.

[u-captions]: https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html
[yt-auto]: https://support.google.com/youtube/answer/6373554
[yt-transcript]: https://support.google.com/youtube/answer/2734799

### Devpost gallery images and thumbnail

- **Devpost's rule.** The thumbnail "should be a JPG, PNG or GIF format, 5 MB
  max file size. For best results, use a 3:2 ratio." ([dp-steps])
- **Measured sizes.** The 2026 gallery shows each card's image at 333 by 222
  px, cropped to 3:2, taking the first gallery image when no thumbnail is set
  ([dp-gallery]). On a project page, images fit a box about 806 by 573 px: a
  1800 by 1200 image shows at 806 by 537, a 1206 by 2622 screenshot at 264 by
  573, each with its caption below ([dp-day-box]; [dp-portrait]).
- **Required.** A 1179 by 2556 screenshot "WITHOUT device frames" and a 1024
  px icon ([Next Gen notes][ng-submit]), which winners' marketing reuses
  ([Devpost form notes][ship-form]).
- Synthesis: **fits.** A typographic 3:2 thumbnail, the logline and one big
  reply button on a solid field, legible at 333 px; 3:2 composites of two or
  three phones side by side, each with a one-line caption; and the frameless
  screenshot showing the row mid-answer, since it may stand alone.
- Synthesis: **doesn't fit.** A phone screenshot as the thumbnail, which
  crops to a sliver; an animated GIF thumbnail; and image text below the
  contrast floors.

[dp-steps]: https://help.devpost.com/article/126-know-your-submission-steps
[dp-gallery]: https://revenuecat-shipaton-2026.devpost.com/project-gallery
[dp-portrait]: https://devpost.com/software/cancelled-subscription-assistent
[ship-form]: /docs/research/shipaton-2026.md#devpost-form-walkthrough

### The README on GitHub

- **Light and dark images.** Yes: "By using the HTML `<picture>` element with
  the `prefers-color-scheme` media feature, you can add an image that changes
  depending on whether a visitor is using light or dark mode", with a
  fallback `<img>` ([gh-quickstart]).
- **Alt text.** "Alt text is a short text equivalent of the information in
  the image" ([gh-syntax]).
- **Animated GIFs.** "By default, GitHub syncs with your system-level
  preference for reduced motion" for animated `.gif` images ([gh-a11y]), and
  stopping a GIF within five seconds is a sufficient technique for 2.2.2
  ([u-pause]).
- **Social preview.** "1280 by 640 pixels for best display", under 1 MB, and
  PNGs with transparency work ([gh-social]).
- Synthesis: a static hero in light and dark versions with two or three
  phones; the logline and evaluation table as text, since WCAG prefers text to
  images of text ([wcag22]); and the [pitch's][idea-pitch] "aha" clip as a
  short GIF whose first frame tells the story, as many will see it paused.

[gh-quickstart]: https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/quickstart-for-writing-on-github
[gh-syntax]: https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax
[gh-a11y]: https://docs.github.com/en/account-and-profile/how-tos/account-settings/managing-accessibility-settings
[gh-social]: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview

### A one-page website

- **What Next Gen asks for.** A description, a video, a licensed public
  repository, an icon, and a screenshot, and no web page; a web-only app isn't
  eligible ([Next Gen notes][ng-submit]). Judges "may choose to judge based
  solely on the text description, images, and video"
  ([Next Gen criteria][ng-criteria]).
- **Privacy.** The notice ships in the app and reads offline
  ([SET-2][prd-settings]), and the README covers it ([SUBMIT-2][prd-submit]);
  RevenueCat asks for disclosures in a privacy policy, not on a web page
  ([services notes][svc-rc-privacy]).
- **Later.** A store release needs a privacy policy link in App Store Connect
  and a support link ([best-practices notes][bp-privacy]).
- Synthesis: a website would only repeat the README; after a store release,
  one static page with the privacy notice and a support address will do.

[ng-criteria]: /docs/research/next-gen.md#next-gen-criteria-and-scoring
[prd-settings]: /docs/PRD.md#settings
[prd-submit]: /docs/PRD.md#submission-requirements
[svc-rc-privacy]: /docs/research/turn-services.md#revenuecats-terms-on-privacy-notices
[bp-privacy]: /docs/research/best-practices.md#privacy-policy-privacy-labels-and-terms-of-use

## Conflicts between sources

- **Claimed and computed contrast.** The claymorphism prompt claims 4.5 to 1
  for pairs that compute to 3.92 to 4.41, and `077-calm-hero` claims "WCAG AAA
  compliance" for text over a video no one can measure from the prompt.
- **Flashing and vestibular.** `077-calm-hero` says its video "avoids rapid
  flashing" out of care for vestibular disorders, but WCAG ties flashing to
  seizures and motion to vestibular disorders ([u-pause]; [u-animation]).
- **Blur.** WCAG 2.2's text excludes blurring from motion animation; the
  June 27, 2025 erratum removes that ([wcag22]; [wcag-errata]).
- **Reduced motion as a mechanism.** WCAG lets a mechanism be "provided by
  either the platform or by user agents" ([wcag22]), which could admit an
  operating system's Reduce Motion, but no sufficient technique for 2.2.2
  relies on it ([u-pause]).
- **Join totals.** Both joins give 385 folders and 359 rows, though this one
  adds `397-space-voyage`, so an earlier match no longer holds.
- **Files.** The brief for these notes says each folder has three files; 658
  have `prompt.md` and 622 `working-prompt.md`
  ([What each file holds][ms-note-files]).

[ms-note-files]: /docs/research/motionsites.md#what-each-file-holds

## Gaps

What the sources don't settle, as of September 23, 2026:

- **No precedent.** No prompt designs AAC, speech output, captions, or a
  conversation, so every Turn-specific judgment here is inference.
- **Which match dropped.** Without the earlier listing, it can't be named.
- **Rendering.** Devpost documents only the thumbnail's ratio and limits, so
  its sizes were measured on three projects; GitHub documents video
  attachments for issues, pull requests, and comments, 10 MB on a free plan
  ([gh-attach]), but not for READMEs, nor the README's rendered width.
- **Coverage.** Contrast over video can't be computed from prompt text, so
  the scrims assume a white frame; only 62 button strings allow an estimate;
  and the previews, the MCP server, and pages behind a login went unread.

[gh-attach]: https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/attaching-files

## Appendix: analysis script

Python 3 with the standard library only, run with Python 3.14.7 as
`python3 analyze_turn.py <prompts folder> [<live listing>.json]`; the JSON is
the rows the home page reads ([Sources and method](#sources-and-method)). It
adapts the earlier note's [script][ms-note-script], whose loader, join, and
page-background steps it keeps, and reproduces that note's 286 dark, 124
light, and 403 undetermined pages. Every corpus and listing count above
comes from its run.

```python
#!/usr/bin/env python3
"""Count subjects, accessibility mentions, text, color, and motion in the
prompt corpus, through Turn's lens. Usage:
python3 analyze_turn.py PROMPTS_DIR [LIVE_LISTING_JSON]

Adapted from the Guessling note's analyze.py: one text per folder
(working-prompt.md, else prompt.md), joined to the live listing by id, then
title. Regexes are case-insensitive. Subjects come from the title, live
category and type, Superdesign's category and tags, and the first 500
characters after any front matter; everything else searches the whole text.
"""
import collections
import colorsys
import json
import os
import re
import sys

ROOT, LIVE = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else None)
I = re.I


def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()


live = json.loads(read(LIVE)) if LIVE else []
by_id = {x['id']: x for x in live}
by_title = {x['title'].strip().lower(): x for x in live}
rows = []
for folder in sorted(os.listdir(ROOT)):
    base = os.path.join(ROOT, folder)
    if not os.path.isdir(base):
        continue
    files = set(os.listdir(base))
    text = read(os.path.join(base, 'working-prompt.md' if 'working-prompt.md' in files
                             else 'prompt.md'))
    meta = json.loads(read(os.path.join(base, 'metadata.json')))
    rec = meta['record']
    hit = by_id.get(rec['id']) or by_title.get(rec['title'].strip().lower()) or {}
    body = re.sub(r'\A---\n.*?\n---\n', '', text, flags=re.S)
    rows.append({'folder': folder, 'text': text, 'live': hit,
                 'premium': meta['workingPrompt'].get('mode') == 'premium',
                 'ms': bool(re.match(r'\d+-|ms-', folder)),  # motionsites.ai's own
                 'subject': ' | '.join([rec.get('title') or '', hit.get('category') or '',
                                        hit.get('type') or '', rec.get('originalCategory') or '',
                                        ' '.join(rec.get('tags') or []), body[:500]])})
N, MS = len(rows), [r for r in rows if r['ms']]


def pct(n, d):
    return f'{n} ({100 * n / d:.1f}%)' if d else '0'


def count(pattern, group):
    return sum(1 for r in group if re.search(pattern, r['text'], I))


def table(title, patterns, groups):
    print(f'\n## {title}: ' + ' | '.join(f'{g} {len(v)}' for g, v in groups.items()))
    for label, pat in patterns.items():
        test = pat if callable(pat) else (lambda r, p=pat: re.search(p, r['text'], I))
        print('  ' + ' | '.join(f'{pct(sum(1 for r in v if test(r)), len(v)):>13}'
                                for v in groups.values()) + f'  {label}')


# 1. The live listing: size, dates, the Apps page, and the join.
if live:
    months = sorted(collections.Counter(x['created_at'][:7] for x in live).items())
    print(f'## Live listing: {len(live)} rows, {sum(x["is_free"] for x in live)} free, '
          f'by month {months}')
    for x in sorted(live, key=lambda x: x['created_at'])[-4:]:
        print(f'  newest: {x["created_at"][:10]} {x["title"]} ({x["category"]}, {x["type"]})')
    norm = lambda s: re.sub(r'[^a-z0-9]+', '-', (s or '').lower()).strip('-')
    apps = [x for x in live if 'mobile' in {norm(x['type']), norm(x['category'])}]
    print(f'  Apps page (type or category "mobile"): {len(apps)}, '
          f'{sum(x["is_free"] for x in apps)} free, by month '
          f'{sorted(collections.Counter(x["created_at"][:7] for x in apps).items())}')
    hits = [(r['live']['created_at'][:10], r['folder'], r['live']['id']) for r in rows if r['live']]
    print(f'  folders matching a row: {len(hits)}, distinct rows {len({h[2] for h in hits})}, '
          f'newest {max(hits)[:2]}')
    CATS = ('Wellness', 'Healthcare', 'Health', 'Health App', 'Medicine', 'Medical', 'Med',
            'Mindfulness', 'Fitness', 'AI', 'AI Assistant', 'AI App', 'Communication')
    print('  categories: ' + ', '.join(f'{c} {sum(x["category"] == c for x in live)}' for c in CATS))
    care = [x for x in live if x['category'] in CATS[:9]]
    print(f'  health or wellness: {len(care)}, earliest {min(x["created_at"] for x in care)[:10]}, '
          f'{sum(1 for x in care if x["id"] in {h[2] for h in hits})} in the corpus')
    WORDS = r'accessib|assistive|\baac\b|\bvoice|speech|\bspeak|hearing|\bdeaf|caption'
    print('  titles, categories, or ids with disability or speech words: ' + ', '.join(
        x['title'] for x in live if re.search(WORDS, f'{x["title"]} {x["category"]} {x["id"]}', I)))

# 2. Subjects close to Turn.
SUBJECTS = {
    'health or medicine': r'\bhealth(?!\s*&\s*food)|medical|medicine|\bclinics?\b|hospital|\bpatients?\b|'
                          r'doctor|physician|dental|dentist|pharma|telehealth|therap(?:y|ist)|'
                          r'surg(?:ery|ical)|cardi(?:ac|ology)',
    'care': r'health ?care|care ?giv|elder ?care|senior (?:care|living)|home ?care|nursing|\bnurses?\b|'
            r'care home|assisted living',
    'wellness or mindfulness': r'wellness|well-?being|mental health|meditat|mindful|\byoga\b|healing|'
                               r'\bsleep\b|habit[- ]track|mood[- ](?:track|journal)',
    'accessibility or assistive tech': r'assistive|disabilit|\bdeaf|hard of hearing|hearing (?:aid|loss)|'
                                       r'\bblind\b|low vision|visually impaired|screen reader|'
                                       r'\bsign language|\baac\b|augmentative|speech (?:therapy|impair)|'
                                       r'wheelchair|prosthe|\badhd\b|neurodiver',
    'communication': r'chat (?:app|interface|ui|assistant|input)|\bai chat|messaging|messenger|video call|'
                     r'voice call|\binbox\b|email (?:client|app|landing)|social (?:app|network)|'
                     r'community app|\bconversation\b',
    'voice or speech': r'\bvoice (?:input|assistant|agent|note|call|chat|ai|memo|interface|mode)|'
                       r'voice-(?:first|enabled|based)|\bspeech\b|text-to-speech|transcri(?:be|ption)|'
                       r'dictation|microphone',
    'audio or music': r'\baudio|podcast|headphone|earbud|\bmusic\b|vinyl|record label|\bsongs?\b|\balbum|'
                      r'\bdj\b|now playing',
    'AI assistant or agent': r'\bai[- ](?:assistant|agents?|companion|chat|copilot|coach)|assistant|copilot|'
                             r'chatbot|\bagents?\b|agentic|companion|\bllm\b',
    'mobile app': r'mobile app|\bios app|iphone|android|app (?:ui|screens?|showcase|mockup|interface|design|'
                  r'concept)|phone (?:mockup|frame)|smartphone|app store|google play|'
                  r'mobile (?:ui|screens?|interface)',
}
for r in rows:
    r['subjects'] = {k for k, p in SUBJECTS.items() if re.search(p, r['subject'], I)}
    if (r['live'].get('type') or '').lower() == 'mobile':
        r['subjects'].add('mobile app')
CLOSE = [r for r in rows if r['subjects']]
print(f'\n## Subjects (all {N} | motionsites.ai {len(MS)})')
for k in list(SUBJECTS) + ['any of these']:
    a = [r for r in rows if (r['subjects'] if k == 'any of these' else k in r['subjects'])]
    print(f'  {pct(len(a), N):>13} | {pct(sum(r["ms"] for r in a), len(MS)):>13}  {k}: '
          + ', '.join(r['folder'] for r in a if k != 'any of these'))
CALM = r'\b(?:calm|calming|serene|serenity|tranquil|soothing)\b'
print(f'  calm vocabulary anywhere: {pct(count(CALM, rows), N)} | {pct(count(CALM, MS), len(MS))}')
GROUPS = {'all': rows, 'motionsites.ai': MS, 'close to Turn': CLOSE,
          'mobile app': [r for r in rows if 'mobile app' in r['subjects']]}

# 3. Accessibility mentions, overall and by live creation period.
A11Y = {
    'prefers-reduced-motion': r'prefers-reduced-motion',
    'reduced motion, any form': r'prefers-reduced-motion|reduced?[- ]motion|useReducedMotion|'
                                r'motion-(?:reduce|safe):',
    'contrast, any mention': r'contrast',
    'contrast as a requirement': r'contrast[- ]ratio|wcag|4\.5\s*:\s*1|(?:sufficient|enough|legib\w*|readab\w*|'
                                 r'accessible|\baa\b)[^\n.]{0,30}contrast|'
                                 r'contrast[^\n.]{0,30}(?:legib|readab|accessib|\baa\b)',
    'names a contrast number': r'(?:>=|≥|at least|minimum(?: of)?)\s*4\.5|4\.5\s*:\s*1|\b3:1\b|\b7:1\b',
    'accessibility, a11y, WCAG, or screen reader': r'accessibility|a11y|wcag|screen[- ]reader',
    'ARIA attribute or role': r'\baria-[a-z]+|\brole=["\'{]',
    'visible focus style': r'focus-visible|focus:ring|focus:border|focus:outline-(?!none)|:focus\b|'
                           r'focus ring|focus state|focus-within',
    'removes the focus outline': r'outline-none|outline:\s*(?:none|0)\b',
    'keyboard access': r'keyboard|tabindex|onkeydown|keydown|\besc(?:ape)? key|enter key|arrow keys',
    'alt text': r'\balt=|\balt:\s|\balt text|\balt attribute',
    'captions or subtitles for video': r'<track\b|\.vtt\b|kind=["\']?(?:captions|subtitles)|closed captions|'
                                       r'subtitles? track',
}
table('Accessibility mentions', A11Y, GROUPS)
for label in ('accessibility, a11y, WCAG, or screen reader', 'contrast as a requirement'):
    hit = [r for r in MS if re.search(A11Y[label], r['text'], I)]
    print(f'  {label}: {len(hit)} motionsites.ai prompts, {sum(r["premium"] for r in hit)} premium')
if live:
    PERIOD = dict.fromkeys(('03', '04'), 'Mar-Apr') | dict.fromkeys(('05', '06'), 'May-Jun') \
        | dict.fromkeys(('07', '08'), 'Jul-Aug') | {'09': 'Sep'}
    dated = collections.defaultdict(list)
    for r in rows:
        if r['live']:
            dated[PERIOD[r['live']['created_at'][5:7]]].append(r)
    table('By live creation period', A11Y, {p: dated[p] for p in ('Mar-Apr', 'May-Jun', 'Jul-Aug')})

# 4. Text sizes, weights, and white text at reduced opacity.
NAMED = {'xs': 12, 'sm': 14, 'base': 16}
SIZE = re.compile(r'\btext-\[(\d+(?:\.\d+)?)(px|rem)\]|font-size:\s*(\d+(?:\.\d+)?)(px|rem)'
                  r'|fontSize:\s*[\'"]?(\d+(?:\.\d+)?)(px|rem)?', I)
for r in rows:
    sizes = [NAMED[m] for m in re.findall(r'\btext-(xs|sm|base)\b', r['text'])]
    for m in SIZE.finditer(r['text']):
        n, unit = m.group(1) or m.group(3) or m.group(5), m.group(2) or m.group(4) or m.group(6)
        sizes.append(float(n) * (16 if unit == 'rem' else 1))
    sizes = [x for x in sizes if x >= 6]  # smaller values are decoration, not text
    r['min_size'] = min(sizes) if sizes else None
    alphas = [int(a) / 100 for a in re.findall(r'\btext-white/(\d+)\b', r['text'])]
    alphas += [float(a) for a in re.findall(r'\btext-white/\[(0?\.\d+)\]', r['text'])]
    alphas += [float(a) for a in re.findall(r'(?<![-\w])color:\s*rgba\(\s*255\s*,\s*255\s*,'
                                            r'\s*255\s*,\s*(0?\.\d+)\s*\)', r['text'], I)]
    r['alphas'] = {round(a, 2) for a in alphas}
table('Text sizes and weights', {
    'sets a text size': lambda r: r['min_size'] is not None,
    'smallest size under 12 px': lambda r: (r['min_size'] or 99) < 12,
    'smallest size 12 px': lambda r: r['min_size'] == 12,
    'text sized in viewport units or clamp()': r'text-\[[\d.]+vw\]|font-size:\s*[^;\n]*\b[\d.]+vw|'
                                               r'fontSize:\s*[\'"][\d.]+vw|clamp\(',
    'thin weights (100 to 300)': r'font-(?:thin|extralight|light)\b|font-?weight:\s*[\'"]?(?:100|200|300)\b',
    'full-height section that hides overflow': r'(?:h-screen|h-\[100(?:vh|svh|dvh)\]|height:\s*100(?:vh|'
                                               r'svh|dvh))[^\n]{0,120}overflow-hidden|overflow-hidden'
                                               r'[^\n]{0,120}(?:h-screen|h-\[100(?:vh|svh|dvh)\])|'
                                               r'(?:h-screen|100vh)[^\n]{0,60}overflow:\s*hidden',
    'white text at reduced opacity': lambda r: r['alphas'],
    'white text under 45% opacity': lambda r: r['alphas'] and min(r['alphas']) < .45,
}, GROUPS)
white = collections.Counter(a for r in rows for a in r['alphas'])
print('  white text opacities (prompts using each): '
      + ', '.join(f'{a:.0%} {n}' for a, n in sorted(white.items())))


# 5. Contrast of common pairs, with the WCAG 2.2 formula and sRGB blending.
def lum(rgb):
    c = [v / 255 for v in rgb]
    c = [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def over(fg, alpha, bg):  # a color at alpha over bg, as browsers blend
    return [f * alpha + b * (1 - alpha) for f, b in zip(fg, bg)]


def rgb(h):
    return [int(h[i:i + 2], 16) for i in (1, 3, 5)]


def floor(fg, bg, target):
    return next(a / 100 for a in range(101) if ratio(over(fg, a / 100, bg), bg) >= target)


W, K, INK = [255] * 3, [0] * 3, rgb('#0a0a0a')
print('\n## Contrast')
for name, fg, bg in (('white on #0a0a0a', W, INK), ('white on #000000', W, K),
                     ('white on glass white/10 over #0a0a0a', W, over(W, .1, INK)),
                     ('black on #ffffff', K, W), ('black on #f5f5f5', K, rgb('#f5f5f5'))):
    print(f'  {name}: ' + ', '.join(f'{a}% {ratio(over(fg, a / 100, bg), bg):.2f}'
                                    for a in range(30, 100, 10)))
    print(f'    text floor (4.5:1) {floor(fg, bg, 4.5):.0%}, edge floor (3:1) '
          f'{floor(fg, bg, 3):.0%}')
for fg, bg in (('#9ca3af', '#0a0a0a'), ('#9ca3af', '#ffffff'), ('#6b7280', '#0a0a0a'),
               ('#6b7280', '#ffffff'), ('#888888', '#0a0a0a'), ('#888888', '#ffffff'),
               ('#666666', '#0a0a0a'), ('#666666', '#ffffff')):
    print(f'  {fg} on {bg}: {ratio(rgb(fg), rgb(bg)):.2f}')
print('  white edges on #0a0a0a (1.4.11): ' + ', '.join(
    f'white/{a} {ratio(over(W, a / 100, INK), INK):.2f}' for a in (5, 10, 15, 20, 30)))
PAIRS = [('#9ca3af', 1, '#f0f0ee'), ('#3b82f6', 1, '#f0f0ee'), ('#ffffff', .15, '#2b3534'),
         ('#ffffff', .14, '#131519'), ('#ffffff', .11, '#14151d'), ('#321c04', 1, '#f6e4cf'),
         ('#1a1a1a', 1, '#faf6f0'), ('#c4552f', 1, '#faf6f0'), ('#a8421f', 1, '#f4ece1'),
         ('#ffffff', 1, '#c4552f'), ('#3f6b48', 1, '#bfe3c6'), ('#a4593a', 1, '#ffd9c2'),
         ('#8a6d1f', 1, '#ffe9b0'), ('#3a6a8a', 1, '#c9e4f6'), ('#8a90a0', 1, '#f6f7fb')]
print('  colors named in the prompts read: ' + ', '.join(  # foreground, its opacity, background
    f'{f}/{a:.0%} on {b} {ratio(over(rgb(f), a, rgb(b)), rgb(b)):.2f}' for f, a, b in PAIRS))
scrim = next(a / 100 for a in range(101) if ratio(W, over(K, a / 100, W)) >= 4.5)
print(f'  white text on a white video frame: the lightest black scrim for 4.5:1 is {scrim:.0%}; '
      f'40% gives {ratio(W, over(K, .4, W)):.2f}; white/80 text under 60% gives '
      f'{ratio(over(W, .8, over(K, .6, W)), over(K, .6, W)):.2f}')

# 6. Dark or light page, by the Guessling note's four steps.
COLOR = r'#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|\bblack\b|\bwhite\b'
TW_BG = r'bg-(?:black|white|\[#[0-9a-f]{3,8}\]|(?:slate|gray|zinc|neutral|stone)-\d+)\b'
PAGE = [r'(?:body|html)\s*\{[^}]{0,300}?background(?:-color)?\s*:\s*(' + COLOR + ')',
        r'(?:page|body|site|global|overall|main|root)\s+(?:background|bg)(?:[- ]colou?r)?'
        r'[^\n]{0,40}?(' + COLOR + '|' + TW_BG + ')',
        r'min-h-screen[^"\'`\n]{0,80}?(' + TW_BG + ')', r'(' + TW_BG + r')[^"\'`\n]{0,80}?min-h-screen']
FIRST_BG = r'background(?:-color)?\**\s*[:=]\s*[`\'"]?\s*(?:pure\s+|solid\s+)?(' + COLOR + ')'


def lightness(token):
    t = token.strip().lower()
    if t in ('black', 'bg-black', 'white', 'bg-white'):
        return 1.0 if 'white' in t else 0.0
    m = re.fullmatch(r'(?:bg-\[)?#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\]?', t)
    if m:
        h = m.group(1) if len(m.group(1)) > 3 else ''.join(c * 2 for c in m.group(1))
        return colorsys.rgb_to_hls(*[int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)])[1]
    m = re.fullmatch(r'rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+%?))?\s*\)', t)
    if m and not (m.group(4) and not m.group(4).endswith('%') and float(m.group(4)) < .5):
        return colorsys.rgb_to_hls(*[int(m.group(i)) / 255 for i in (1, 2, 3)])[1]
    m = re.fullmatch(r'bg-(?:slate|gray|zinc|neutral|stone)-(\d+)', t)
    return 1 - int(m.group(1)) / 1000 if m else None


def first_color(text, patterns):
    for pat in patterns:
        for m in re.finditer(pat, text, I):
            v = lightness(m.group(1))
            if v is not None:
                return 'dark' if v < .5 else 'light'


def page(text):
    """1. A page-level color; 2. one stated theme; 3. light or dark text
    colors outnumbering the other kind two to one, three uses or more;
    4. the first CSS or labeled background color."""
    d = re.search(r'\bdark[- ](?:mode|theme|background|ui)\b', text, I)
    li = re.search(r'\blight[- ](?:mode|theme|background|ui)\b', text, I)
    on_dark = len(re.findall(r'\btext-white\b|\bcolor:\s*(?:#fff\b|#ffffff\b|white\b)', text, I))
    on_light = len(re.findall(r'\btext-black\b|\btext-(?:slate|gray|zinc|neutral|stone)-'
                              r'(?:800|900|950)\b|\bcolor:\s*(?:#000\b|#000000\b|#111\b)', text, I))
    by_text = None
    if max(on_dark, on_light) >= 3 and max(on_dark, on_light) >= 2 * min(on_dark, on_light):
        by_text = 'dark' if on_dark > on_light else 'light'
    return (first_color(text, PAGE) or (('dark' if d else 'light') if bool(d) != bool(li)
            else None) or by_text or first_color(text, [FIRST_BG]) or 'undetermined')


print('\n## Page background: ' + ' | '.join(f'{g} ' + ', '.join(
    f'{k} {n}' for k, n in sorted(collections.Counter(page(r['text']) for r in v).items()))
    for g, v in GROUPS.items()))

# 7. Motion, media, and pointer patterns.
MOTION = {
    'glass (liquid glass or glassmorphism)': r'liquid[- ]?glass|glass[- ]?morph|frosted[- ]glass',
    'video file or <video> element': r'<video\b|\.mp4\b|\.webm\b|\.m3u8\b',
    'autoplay': r'autoplay',
    'pause or play control for the viewer': r'pause (?:button|control|toggle)|play/pause|play-pause|'
                                            r'aria-label=["\'](?:pause|play)|play control|play \+ pause',
    'parallax': r'parallax',
    'scroll-triggered reveal': r'whileInView|useInView|IntersectionObserver|scroll[- ]triggered|on scroll|'
                               r'scrolltrigger',
    'scroll-linked motion': r'\buseScroll\b|scrollYProgress|\buseTransform\b|\bscrub|animation-timeline|'
                            r'scroll-timeline|scroll[- ](?:driven|linked)',
    'marquee or ticker': r'marquee|(?<!gsap )(?<!gsap\.)\bticker\b',
    'infinite animation': r'\binfinite\b|repeat:\s*Infinity|animate-(?:spin|ping|pulse|bounce)\b',
    'pulsing dot': r'(?:puls\w*|ping)[ -](?:\w+[ -]){0,2}dots?\b|'
                   r'\bdots?\b[^\n.]{0,60}(?:animate-(?:pulse|ping)|\bpuls\w*|\bping\b)',
    'pause only while hovered': r'hover:\[animation-play-state:\s*paused\]|pauses? on hover|pauseOnHover|'
                                r':hover[^{\n]*\{[^}]*animation-play-state:\s*paused',
    'hover styles': r'hover:|:hover|whileHover|onMouseEnter|mouseenter',
    'says something appears on hover': r'(?<!dis)\b(?:appears?|reveals?|revealed|shows?|fades? in|'
                                       r'slides? (?:in|up))\s+on\s+hover',
    'focus or touch fallback for hover': r'group-focus|focus-within|onFocus|\(hover:\s*(?:none|hover)\)|'
                                         r'\(pointer:\s*coarse\)|touchstart|on tap',
    'blur-in entrance (animates to blur 0)': r'blur\(\s*0(?:\.0+)?(?:px)?\s*\)',
    'phone frame or Dynamic Island': r'dynamic island|iphone (?:\d+ )?(?:pro )?(?:frame|mockup)|'
                                     r'phone (?:frame|mockup)',
}
table('Motion, media, and pointer patterns', MOTION, GROUPS)
RM, VID = A11Y['reduced motion, any form'], MOTION['video file or <video> element']
hov = [r for r in rows if re.search(MOTION['says something appears on hover'], r['text'], I)]
dots = [r for r in rows if re.search(MOTION['pulsing dot'], r['text'], I)]
both = [r for r in rows if re.search(RM, r['text'], I) and re.search(VID, r['text'], I)]
stop = r'reduced?[- ]motion[^\n]{0,250}(?:video|poster|autoplay)|(?:video|poster|autoplay)' \
       r'[^\n]{0,250}reduced?[- ]motion'
print(f'  hover reveals with a fallback: {count(MOTION["focus or touch fallback for hover"], hov)}'
      f' of {len(hov)}; pulsing dots with reduced motion: {count(RM, dots)} of {len(dots)}; '
      f'video and reduced motion: {len(both)}, the rule names the video: {count(stop, both)}')
for name, keys in (('wellness or mindfulness', {'wellness or mindfulness'}),
                   ('health, medicine, or care', {'health or medicine', 'care'})):
    sub = [r for r in rows if r['subjects'] & keys]
    print(f'  {name}: {len(sub)} prompts, {count(VID + "|" + MOTION["infinite animation"], sub)} '
          f'loop a video or an infinite animation, {count(RM, sub)} handle reduced motion')

# 8. Button heights at the base (phone) breakpoint: on a line naming a button
# or CTA, a rounded class string with px-, py-, text-xs to text-lg, and no h-
# is its Tailwind line height plus twice its vertical padding.
LINE = {'xs': 16, 'sm': 20, 'base': 24, 'lg': 28}


def button_heights(text):
    out = []
    for line in text.splitlines():
        if re.search(r'\bbutton|\bbtn\b|\bcta\b', line, I):
            for cls in re.findall(r'["\'`]([^"\'`\n]{10,300})["\'`]', line):
                size = re.search(r'(?<![\w:-])text-(xs|sm|base|lg)\b', cls)
                py = re.search(r'(?<![\w:-])py-(\d+(?:\.5)?)\b', cls)
                if size and py and re.search(r'\brounded', cls) and not re.search(
                        r'(?<![\w:-])h-', cls) and re.search(r'(?<![\w:-])px-\d', cls):
                    out.append(LINE[size.group(1)] + 8 * float(py.group(1)))
    return out


print('\n## Estimated button heights')
for g, v in GROUPS.items():
    per = {r['folder']: button_heights(r['text']) for r in v}
    hs = sorted(h for x in per.values() for h in x)
    if hs:
        print(f'  {g}: {len(hs)} strings in {sum(1 for x in per.values() if x)} prompts, median '
              f'{hs[len(hs) // 2]:.0f} px, {sum(h < 44 for h in hs)} under 44 px, '
              f'{sum(h < 24 for h in hs)} under 24 px; '
              f'{sum(1 for x in per.values() if x and min(x) < 44)} prompts go under 44 px')
```

[ms-note-script]: /docs/research/motionsites.md#appendix-analysis-script

## See also

- [motionsites.ai research notes][ms-note], which this note extends,
  especially [What 27 prompts share][ms-note-27] and
  [Patterns that carry over][ms-note-carry].
- The sibling notes behind `docs/DESIGN.md`:
  [frontend trends](/docs/research/turn-frontend-trends.md),
  [AAC design](/docs/research/aac-design.md), and
  [iOS design](/docs/research/turn-ios-design.md).
- The PRD's [accessibility requirements][prd-a11y] and [reply row][prd-row],
  the TRD's [accessibility in the app][trd-a11y], the idea's
  [pitch][idea-pitch], and the [Next Gen notes][ng-submit].

[ms-note-carry]: /docs/research/motionsites.md#patterns-that-carry-over
[ms-note]: /docs/research/motionsites.md
[prd-a11y]: /docs/PRD.md#accessibility
[ms-index-js]: https://motionsites.ai/assets/Index-DISY_D2l.js
[wcag22]: https://www.w3.org/TR/WCAG22/
[wcag-errata]: https://www.w3.org/WAI/WCAG22/errata/
[wcag2ict]: https://www.w3.org/TR/wcag2ict-22/
[ms-note-27]: /docs/research/motionsites.md#what-27-prompts-share
[u-pause]: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
[u-animation]: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
[trd-a11y]: /docs/TRD.md#accessibility-in-the-app
[prd-row]: /docs/PRD.md#the-reply-row
[idea-pitch]: /docs/IDEA.md#pitch
[ng-submit]: /docs/research/next-gen.md#what-a-next-gen-entry-must-submit
[dp-day-box]: https://devpost.com/software/day-box

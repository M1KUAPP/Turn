# Turn design

How Turn looks, reads, and moves: the design system and art direction for the
iPhone app, the paywall's styling, the app icon, and the pitch assets. It
follows Google's [DESIGN.md format][gdm], so design and coding agents can read
its tokens, and it turns the [product's][product-principles] principles into
rules and layouts that the [technical requirements](/docs/TRD.md) build and the
[product requirements](/docs/PRD.md) test. Facts are as of September 23, 2026;
every color, size, and duration this document sets is a design decision.

Contents:

1.  [Overview](#overview)
1.  [Influences and trends](#influences-and-trends)
1.  [See also](#see-also)

## Overview

```yaml
version: alpha
name: Turn
description: >-
  An AAC app for iPhone that speaks an adult's saved phrases and typed words,
  and offers their own replies as a partner finishes speaking.
```

### Rules that don't bend

Every screen keeps these ten rules; each names the requirement it serves and
the test that shows it holds. The rest of this document says how.

1.  **Nothing moves under a finger.** The strip, the row's six slots, and the
    grid keep their places and sizes whatever the row shows; only the words
    inside a slot change, and never while it's pressed (ROW-1, ROW-5,
    BANK-4). Test: the grid's first button and every slot's frame stay put
    through every state of the row.
2.  **Phrases read at 7 to 1.** Phrase text reaches 7 to 1 against its fill in
    all four appearances, other text 4.5 to 1, and every button's edge 3 to 1
    (A11Y-7). Test: `check_contrast.py` and the theme test.
3.  **A word for every state.** Listening, paused, a note, a marked tab, and
    Yes, No, and Not sure each carry a word or a shape as well as a color
    (A11Y-6). Test: every screen in grayscale, through Color Filters.
4.  **Text follows Dynamic Type.** Every text style follows one of Apple's up
    to AX5 and wraps; only the row may end a phrase with an ellipsis, and then
    VoiceOver and speech give the whole phrase (A11Y-4). Test: every screen at
    AX5.
5.  **Targets for unsteady hands.** Phrase buttons in the row and the grid are
    at least 78 points tall, the strip's at least 48, and every other control
    at least 44 by 44 (A11Y-1). Test: the Accessibility Inspector.
6.  **Only a tap speaks.** Nothing speaks without a tap, nothing acts on
    touch-down, and nothing needs a long press, a swipe, or a drag (ROW-6,
    A11Y-5, A11Y-8). Test: every scenario with single taps.
7.  **Motion answers someone.** Only a new reply, the big button, and the
    light while the partner's words arrive move anything, and Reduce Motion,
    read live, stills them all (A11Y-6). Test: turn Reduce Motion on
    mid-session.
8.  **No glass behind words.** Phrases, the line, notes, and the consent card
    sit on solid fills; Liquid Glass stays in the system's bars, sheets,
    alerts, and keyboard. Test: both ends of the Liquid Glass slider.
9.  **The system decides the look.** Turn follows the iPhone's appearance,
    Increase Contrast, and Bold Text, and has no theme of its own. Test: all
    four appearances, with Bold Text on and off.
10. **Plain words, no AI badges.** No percentages, sparkles, "smart", or
    exclamation marks, and a reply looks like any other phrase of the user's,
    because it is one ([product principles][product-principles]). Test: read
    every string in [Words on screen](#words-on-screen).

### The reference

A whiteboard and four markers. When a device fails, people who can't speak
reach for a board and a pen, as one AAC user did after an update changed their
app's layout, taking "a white board and marker" to a cancer appointment
([AAC design notes][aac-criticize]). A board has what Turn needs: big, dark
words that both people can read, inks with fixed jobs, nothing on it but what's
being said, and nothing to wait for.

- **What it gives each surface.** The board is the background; each phrase is
  written on a white card on it; black marker is the text; blue is Turn's own
  ink, for its actions and for the one reply it's sure of; green and red belong
  to Yes and No and nothing else; and the listening light is the one orange
  thing, after the dot iOS shows while a microphone is on.
- **Why a reference.** Google's format asks for one, since "A specific
  reference describes a point." ([trends notes][ft-tokens])
- **Why this one.** It's the tool AAC users already trust, it looks like
  nothing special, and devices that looked like mainstream ones drew the least
  attention in interviews about assistive technology
  ([AAC design notes][aac-stigma]). It's calm in the sense the trends notes
  found: "Technology should require the smallest possible amount of attention"
  ([trends notes][ft-calm]).
- **What it rules out.** Decoration, mascots, clinical icons, gradients, and
  anything that moves on its own.

[aac-criticize]: /docs/research/aac-design.md#what-users-criticize
[ft-tokens]: /docs/research/turn-frontend-trends.md#what-goes-in-tokens-and-what-in-prose
[aac-stigma]: /docs/research/aac-design.md#social-acceptability-and-stigma

### Scope

- **In:** the app's screens and their states, the paywall's styling, the app
  icon and launch screen, the Devpost images, the README's images, and the
  look of the demo video.
- **Out:** a website, since no Next Gen item needs one and the privacy notice
  ships in the app ([motionsites notes][ms-web]); a partner view that flips
  the last phrase toward the partner, an
  [open question](#open-questions); and any appearance setting inside the app.

[ms-web]: /docs/research/turn-motionsites.md#a-one-page-website

## Influences and trends

What the four notes found, and what Turn takes from each. Every row cites the
note that holds its sources.

| Source                          | What it offers                                 | What Turn does                                                                                    |
| ------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| motionsites.ai's newest prompts | Exact tokens, a motion inventory, and checks   | Adopts the shape: this file lists every animation and ends with checks ([notes][ms-spec])         |
| motionsites.ai's house look     | Near-black pages, video, glass, and faint text | Rejects it: faint text and glass edges fail contrast, and loops can't pause ([notes][ms-a11y])    |
| Calm wellness prompts           | Warm light fields and one accent               | Adopts a light field and one accent, not their loops ([notes][ms-color])                          |
| Google's DESIGN.md format       | Tokens and prose that a linter checks          | Adopts it, with four appearances per color ([notes][ft-sample])                                   |
| AI generators of native apps    | Fast first screens                             | Sketches only: generated screens fail on contrast and labels first ([notes][ft-studies])          |
| React Native component kits     | Ready-made controls                            | Rejects them: none handles Increase Contrast ([notes][ft-kits])                                   |
| Apple's Liquid Glass            | Glass controls that float over content         | Adapts it: glass stays in the system's chrome ([notes][ios-glass-content])                        |
| Google's Material 3 Expressive  | Large, contained buttons with labels           | Adopts the buttons and labels, not the springy motion ([notes][ft-m3e])                           |
| Calm technology                 | Attention only when something matters          | Adopts it for the light and the row ([notes][ft-calm])                                            |
| Text AAC apps                   | Message windows, phrases, and show views       | Adopts fixed places and plain text, and keeps more in view than any rival ([notes][aac-patterns]) |

- **Bans Turn keeps.** "Default to stillness", no staggered entrances, no
  squish on press, no hardcoded colors, no labels in capitals, no glass on
  everything, and no endless loops, each because it protects speed or
  legibility ([trends notes][ft-bans]).
- **Bans Turn drops.** A ban on wrapping button text, bans on characters such
  as em dashes applied to phrases, which are the user's own words, and bans on
  the system font, which is the accessible choice here
  ([trends notes][ft-nobans]).
- **What motionsites.ai lacks.** Nothing in its catalog or its 813-prompt
  corpus is about AAC, speech, or disability, so its craft transfers and its
  sizes don't: its buttons are a median of 40 pixels, under Turn's 44-point
  floor ([motionsites notes][ms-findings]).

[ms-spec]: /docs/research/turn-motionsites.md#layout-and-type-in-the-closest-prompts
[ms-a11y]: /docs/research/turn-motionsites.md#accessibility-of-the-common-patterns
[ms-color]: /docs/research/turn-motionsites.md#color-imagery-and-motion-in-the-closest-prompts
[ft-sample]: /docs/research/turn-frontend-trends.md#a-turn-shaped-sample-through-the-linter
[ft-studies]: /docs/research/turn-frontend-trends.md#studies-of-ai-generated-interfaces
[ft-kits]: /docs/research/turn-frontend-trends.md#styling-and-component-kits
[ios-glass-content]: /docs/research/turn-ios-design.md#content-and-controls-on-glass
[ft-m3e]: /docs/research/turn-frontend-trends.md#material-3-expressive-and-older-users
[aac-patterns]: /docs/research/aac-design.md#patterns-across-the-apps
[ft-bans]: /docs/research/turn-frontend-trends.md#bans-that-suit-an-aac-app
[ft-nobans]: /docs/research/turn-frontend-trends.md#bans-that-dont-suit-an-aac-app
[ms-findings]: /docs/research/turn-motionsites.md#findings-for-designmd

## See also

- [Product](/docs/PRODUCT.md): who Turn is for, and the principles this
  design turns into rules.
- [Product requirements](/docs/PRD.md): the requirements each rule and
  component cites.
- [Technical requirements](/docs/TRD.md): how the app draws and moves what
  this document describes.
- [Idea](/docs/IDEA.md): the pitch, the schedule, and the risks.
- The research behind these choices:
  [motionsites.ai for Turn](/docs/research/turn-motionsites.md),
  [frontend trends](/docs/research/turn-frontend-trends.md),
  [AAC interface design](/docs/research/aac-design.md),
  [Turn's iOS design](/docs/research/turn-ios-design.md), and
  [AAC practice](/docs/research/aac-practice.md).
- [Google's DESIGN.md format][gdm]: the specification and the linter.
- [Guessling design](/docs/archive/guessling-design.md): the design for the
  team's first idea, archived.

[gdm]: https://github.com/google-labs-code/design.md
[product-principles]: /docs/PRODUCT.md#product-principles
[ft-calm]: /docs/research/turn-frontend-trends.md#calm-technology

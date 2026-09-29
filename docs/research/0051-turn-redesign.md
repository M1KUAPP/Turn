# Turn redesign research

Where Turn's v2 look came from. On September 29, 2026, four inspiration sites were browsed by opening individual items, five web research reports were run, and three art directions were rendered, after the team lead called v1 too plain. This note records the sources; the decisions they fed are in the [v2 plan][plan].

Contents:

1.  [How the research ran](#how-the-research-ran)
1.  [What the sites showed](#what-the-sites-showed)
    1.  [Dribbble](#dribbble)
    1.  [Load More](#load-more)
    1.  [60fps.design](#60fpsdesign)
    1.  [Awwwards and the Apple Design Awards](#awwwards-and-the-apple-design-awards)
1.  [Patterns Turn adopts](#patterns-turn-adopts)
    1.  [Listening](#listening)
    1.  [The partner's words](#the-partners-words)
    1.  [Replies and cards](#replies-and-cards)
    1.  [Color](#color)
    1.  [Motion](#motion)
    1.  [The paywall](#the-paywall)
    1.  [Consent](#consent)
1.  [What the web research found](#what-the-web-research-found)
    1.  [AAC and caption apps](#aac-and-caption-apps)
    1.  [iOS design in 2025 and 2026](#ios-design-in-2025-and-2026)
    1.  [Expo and React Native feasibility](#expo-and-react-native-feasibility)
    1.  [RevenueCat paywalls](#revenuecat-paywalls)
    1.  [Color and accessibility](#color-and-accessibility)
1.  [Art directions](#art-directions)
1.  [What Turn rejects](#what-turn-rejects)
1.  [See also](#see-also)

[plan]: /docs/plans/0044-turn-v2-redesign.md

## How the research ran

Four sites were read on September 29, 2026 by opening items one at a time rather than browsing listings: [Dribbble][dribbble], [Load More][loadmo] at loadmo.re, [60fps.design][sixtyfps], and [Awwwards][awwwards] followed through to the [Apple Design Awards][ada] entries. Dribbble yielded 19 opened shots, Load More 20 posts across eight aesthetic tags, 60fps 20 paused videos, and the awards work 11 references.

Five written reports were run in parallel, each a separate brief: an AAC and caption app teardown, an iOS design state-of-the-art review, an Expo and React Native feasibility check, a RevenueCat paywall study, and a color and accessibility review against WCAG 2.2.

Two limits shaped what could be claimed.

- **Motion timings are estimates.** Most Dribbble shots and all Load More posts are video, and the videos would not render in a background browser tab. 60fps timings come from frames sampled 0.1 to 0.4 seconds apart. The timings carried into v2 are proposals, not measurements.
- **Screenshots stayed out of the repository.** The captures live outside the repo, so this note cites links instead of embedding images. A reader following a link sees the current state of the page, which may have changed since September 29, 2026.

Reports were treated as leads rather than findings. Only claims tied to a URL in the source reports were kept; anything that could not be traced to one was left out. Apple Design Awards statuses are as the source pages described them on the day.

[dribbble]: https://dribbble.com
[loadmo]: https://loadmo.re
[sixtyfps]: https://60fps.design
[awwwards]: https://www.awwwards.com
[ada]: https://developer.apple.com/design/awards/

## What the sites showed

### Dribbble

Dribbble holds concept shots rather than working apps, so its value is palette, layout, and label discipline. Voice and AI searches on the site are dominated by purple gradients and glowing orbs, which Turn rejects; the warm alternatives share an ecru or paper ground, one earthy accent, and a serif for spoken words.

| Reference                          | Link                                                                                                    | What Turn takes                                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| AI Voice Notes, Anna               | [shot](https://dribbble.com/shots/27676321-Mobile-App-Design-AI-Voice-Notes-App-Smart-Notes-AI-App)     | A listening pill of dot, word, and timer, one accent on a warm ground, and one big stop button       |
| Speak Sync, Ronas IT               | [shot](https://dribbble.com/shots/25051073-Voice-Recognition-App)                                       | The caption as a highlighter: newest line in bold ink on a tinted pill, older lines stepping down    |
| Senior Living App, UITOP           | [shot](https://dribbble.com/shots/27757616-Senior-Living-App-UX-for-Daily-Activities-Resident-Planning) | Tinted tiles with an icon chip, one color per category, and explicit paging buttons                  |
| Translator app, Purrweb            | [shot](https://dribbble.com/shots/20698000-Translator-app)                                              | Both voices in one card, split by position, hairline, and label rather than color                    |
| AI Voice Assistant, Abdur Rouf     | [shot](https://dribbble.com/shots/26801881-AI-Voice-Assistant-App)                                      | One floating capsule reading Pause, state, Stop, left to right, with a warning about glass over text |
| OneTap LifeTime Paywall, AJ Picard | [shot](https://dribbble.com/shots/23501058-OneTap-LifeTime-Paywall)                                     | A pay-once structure: one price, one list, one button, and no offer badge or struck-out price        |

### Load More

The loadmo.re gallery curates experimental mobile sites rather than native apps, and has no search. It has no onboarding, paywall, or settings categories, so it contributed grounds, type, and consent ideas rather than commercially.

| Reference           | Link                                                | What Turn takes                                                                                 |
| ------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Duuu                | [post](https://loadmo.re/posts/duuu)                | A caption of stacked rows and one full-width solid bar whose word and fill both flip with state |
| Boring Conversation | [post](https://loadmo.re/posts/boring-conversation) | The Turn loop in small: the partner's line, then ready replies directly under it                |
| Fruitful School     | [post](https://loadmo.re/posts/fruitful-school)     | A warm neutral ground, bevelled tiles, and one icon per section                                 |
| Blink               | [post](https://loadmo.re/posts/blink)               | One large plain sentence of reason before the system prompt, then one button                    |
| Cupidku             | [post](https://loadmo.re/posts/cupidku)             | The data promise in body size, and heavy sticker borders that hold 3:1 in every appearance      |
| Sona Stream         | [post](https://loadmo.re/posts/sona-stream)         | Leading a paywall with the free promise, then one full-width primary bar                        |

### 60fps.design

Sixty fps is a library of about 2,100 short iOS interaction recordings, which made it the only source where motion could be observed. Its strongest patterns for Turn were that states are spelled out in words next to the animation, that liveness lives inside the control that owns it, and that sheets morph rather than being replaced.

| Reference                                 | Link                                                                                       | What Turn takes                                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Perplexity, word and sentence audio       | [shot](https://60fps.design/shots/perplexity-conversation-word-sentence-audio-interaction) | A small label over big words, and a fill that follows the voice through the phrase        |
| Duolingo, voice speak button              | [shot](https://60fps.design/shots/duolingo-voice-speak-button-interaction)                 | A chunky lipped phrase button whose face sinks on press instead of sliding                |
| Shazam, Dynamic Island listening          | [shot](https://60fps.design/shots/shazam-dynamic-island-listening)                         | Word, meter, and control in one fixed capsule that never pushes the grid                  |
| Miles, permission sheet morph             | [shot](https://60fps.design/shots/miles-permission-sheet-morph-interaction)                | The consent card: icon rows, a title, and one anchored button whose label only crossfades |
| Claude, voice selection border pulse      | [shot](https://60fps.design/shots/claude-voice-selection-border-pulse-interaction)         | A warm edge glow on the speaking card, and cream with terracotta as a warm, adult palette |
| Netflix, poster reflection on bottom tabs | [shot](https://60fps.design/shots/netflix-poster-reflection-on-bottom-tabs-interaction)    | The bottom bar as one floating capsule, with an opaque variant for Reduce Transparency    |

### Awwwards and the Apple Design Awards

Awwwards is built around websites, and its mobile categories are mostly landing pages, so most references came from the awards and were followed through to their App Store iPhone screenshots. Neither source had a one-time-purchase paywall: App Store screenshots skip paywalls, and Awwwards pricing elements are web tier tables. Paywall references came from Dribbble and the RevenueCat report instead.

| Reference                            | Link                                                                                  | What Turn takes                                                                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Wispr Flow, N4 Studio                | [Awwwards](https://www.awwwards.com/sites/wispr-flow)                                 | A serif partner line opening with a "They said" pill, history that steps back but never vanishes, and cream with near-black ink       |
| Hearing Buddy, Lilly Seay            | [App Store](https://apps.apple.com/us/app/hearing-buddy-live-captions/id6747363502)   | A labeled question marker on the caption, which is the moment Yes, No, and Not sure appear first, and a "Still listening?" idle check |
| Structured, unorderly                | [App Store](https://apps.apple.com/us/app/structured-daily-planner-todo/id1499198946) | One tint and one line icon per category, repeated on a small labeled chip row, on a blush canvas with coral accents                   |
| Moonlitt, Flipping Hues              | [App Store](https://apps.apple.com/us/app/moonlitt-moon-phase-tracker/id6444718902)   | Liquid Glass restricted to chrome, with solid content cards, and selection shown by fill and size as well as color                    |
| Speechify, Speechify Inc.            | [App Store](https://apps.apple.com/us/app/speechify-text-to-speech/id1209815023)      | A phrase-level tint plus a boxed word while speaking, and a named voice chip for Personal Voice                                       |
| How We Feel, The How We Feel Project | [App Store](https://apps.apple.com/us/app/how-we-feel/id1562706384)                   | A tint plus a shape plus a word per category, and an italic serif lead-in for a dignified reply                                       |

## Patterns Turn adopts

### Listening

- **A fixed capsule holding a word, a meter, and a control.** From the [Shazam shot][s-shazam], the [Messages audio bar][s-messages], and the [asol listening pill][s-asol]. v2's Listen control is one capsule that never moves the grid, and the Listen control component has Off, Listening, Paused, Unlock, and Mic off variants.
- **State in a word beside the motion.** From [ChatGPT listening][s-chatgpt] and [Guitar Wiz][s-guitarwiz], where a check sits beside "In Tune". v2 spells out Listening and Paused, and a state never rides on color alone.
- **The lamp, not the orb.** The [Breathe orb][s-breathe] and the ChatGPT orb both swell with input; v2 keeps the gesture but bounds it, washing the top of the board with a warm radial glow behind everything.
- **An idle check.** [Hearing Buddy][hearing-buddy] asks whether it should still be listening after quiet minutes. v2's caption states its own state, and End sits beside Paused rather than inside it.
- **No haptics as meaning.** The [Expo haptics notes][expo-haptics] say iOS suppresses the Taptic Engine while the microphone records, so nothing in Listen mode may depend on touch.

[s-shazam]: https://60fps.design/shots/shazam-dynamic-island-listening
[s-messages]: https://60fps.design/shots/apple-messages-audio-interaction
[s-asol]: https://dribbble.com/shots/27676321-Mobile-App-Design-AI-Voice-Notes-App-Smart-Notes-AI-App
[s-chatgpt]: https://60fps.design/shots/chatgpt-listening
[s-guitarwiz]: https://apps.apple.com/us/app/guitar-wiz-chords-tuner/id6740015002
[s-breathe]: https://loadmo.re/posts/breathe-resting-computer
[expo-haptics]: https://docs.expo.dev/versions/latest/sdk/haptics/

### The partner's words

- **A two-level stack: label, then words.** From the [Perplexity shot][s-perplexity], [Duuu][duuu], and [Glossary of Time][glossary]. v2's caption sets `partner-line`, 28-point serif, under a small label.
- **A serif voice for what the partner says.** From [Boring Conversation][boring] and [How We Feel][how-we-feel]. v2 sets the partner's words in `ui-serif` and everything the user says in `ui-rounded` bold, so the two voices differ by typeface alone.
- **A "They said" pill.** From [Wispr Flow][wispr]. v2 names the speaker in words; [Vocable][vocable] prefixes its transcript the same way.
- **One line at a time.** [Wispr Flow][wispr] and the [Hearing Buddy][hearing-buddy] captions keep a history that steps back. Turn keeps no transcript, so v2 shows only the newest line, and says "Still answering" when the row holds for small talk.
- **A line that grows in place.** From the [Wispr mobile view][wispr-mobile]. v2's caption area is a fixed height at the current text size, so replies and grid never shift while the partner talks, and replies are offered only once the line is final.

[s-perplexity]: https://60fps.design/shots/perplexity-conversation-word-sentence-audio-interaction
[duuu]: https://loadmo.re/posts/duuu
[glossary]: https://loadmo.re/posts/glossary-of-time
[boring]: https://loadmo.re/posts/boring-conversation
[how-we-feel]: https://apps.apple.com/us/app/how-we-feel/id1562706384
[wispr]: https://www.awwwards.com/sites/wispr-flow
[vocable]: https://apps.apple.com/us/app/vocable-aac/id1492230282
[hearing-buddy]: https://apps.apple.com/us/app/hearing-buddy-live-captions/id6747363502
[wispr-mobile]: https://www.awwwards.com/inspiration/mobile-wispr-flow

### Replies and cards

- **The reply row sits under the caption, not beside it.** From [Rejoin Voice][rejoin], [Vocable][vocable], and [Boring Conversation][boring]. v2 places the row directly below the caption so reading and answering cost one glance.
- **Replies come from the user's own phrases.** The [Rejoin Voice][rejoin] teardown and the paywall copy both say this; v2's paywall promises replies drawn from saved phrases, and the row has one to six slots.
- **A question puts Yes, No, and Not sure first.** From the [Hearing Buddy][hearing-buddy] Question Alert. v2 gives each a 40-point symbol disc, `checkmark`, `xmark`, and `questionmark.circle`, so shape and word carry the difference.
- **One confident reply is a lifted card, not a fill.** From [Tiimo][tiimo] and [Moonlitt][moonlitt]. v2's big reply fills the row's frame in the accent with a category tag and a speaker mark.
- **A card you can feel.** From [Fruitful School][fruitful] and the [Duolingo speak button][s-duolingo]. v2's phrase card has a 1.5-point inked edge, soft two-layer shadows, and a press that thickens the edge and darkens the fill without moving.
- **State lives on the item.** From [Busy Simulator][busy]. v2's speaking slot carries a waveform symbol, and the strip keeps a fixed height whether the row holds one reply or six.

[rejoin]: https://apps.apple.com/us/app/rejoin-voice-aac-speech-app/id6478950587
[tiimo]: https://apps.apple.com/us/app/tiimo-visual-daily-planner/id1480220328
[moonlitt]: https://apps.apple.com/us/app/moonlitt-moon-phase-tracker/id6444718902
[fruitful]: https://loadmo.re/posts/fruitful-school
[s-duolingo]: https://60fps.design/shots/duolingo-voice-speak-button-interaction
[busy]: https://loadmo.re/posts/busy-simulator

### Color

- **Warm grounds instead of white.** From [Boring Conversation][boring], [Glossary of Time][glossary], and [Structured][structured]. v2's board is warm paper in light and warm charcoal in dark, not system gray.
- **One accent with a job.** From [Structured][structured] and the [iOS trends findings](#ios-design-in-2025-and-2026). v2 gives ultramarine to Turn's own actions and its one confident reply, orange to listening, and green, red, and gray to Yes, No, and Not sure.
- **A category is a hue plus an icon plus a word.** From [How We Feel][how-we-feel] and [Structured][structured]. v2 adds a `categoryColors` map; each tab carries its symbol and its 10-point dot.
- **A tinted card must still hold 7:1.** The [WCAG 2.2 findings][color-wcag] show that pale tints are easy in light mode and that dark mode needs deep jewel surfaces. v2 checks every pairing in all four appearances.
- **Glass for chrome, solid for words.** From [Moonlitt][moonlitt] and the [HIG on materials][hig-materials]. v2's only glass surface is the floating toolbar.

[structured]: https://apps.apple.com/us/app/structured-daily-planner-todo/id1499198946
[color-wcag]: https://www.w3.org/TR/WCAG22/
[hig-materials]: https://developer.apple.com/design/human-interface-guidelines/materials

### Motion

- **Springs for arrival, damped curves for layout.** From the [60fps.design findings](#60fpsdesign) and the [Reanimated notes][reanimated]. v2's reply arrival fades out 90 ms and in 180 ms, staggered 40 ms.
- **Motion is feedback.** v2's motion table names what Reduce Motion shows instead for every row; [Reanimated's reduced-motion hook][ra-reduced] is how the app reads the setting.
- **Nothing moves under a finger.** The [contrast findings][color-wcag] and the [iOS trends findings](#ios-design-in-2025-and-2026) both state it; v2's press changes fill and edge only, never transform.
- **No overshoot under a resting hand.** [Swiggy's purchase check][swiggy] and [Honk's reply bubble][honk] spring past their mark; v2 keeps a 200 ms cross-fade for the big reply instead, since the row sits under a resting hand.

[reanimated]: https://docs.swmansion.com/react-native-reanimated/docs/animations/entering-exiting-animations/
[ra-reduced]: https://docs.swmansion.com/react-native-reanimated/docs/accessibility/reduced-motion/
[swiggy]: https://60fps.design/shots/swiggy-purchased-loader-to-check-mark-animation
[honk]: https://60fps.design/shots/honk-call-chat-suggestions-bubble-chat-interaction

### The paywall

- **The free thing first, then the one price.** From the [Spielwerk paywall][spielwerk] and [Sona Stream][sona]. v2 opens with "Speaking, typing, and your phrases stay free" and follows with the single $24.99 package.
- **One price, one list, one button.** From the [AJ Picard pay-once design][ajpicard] and the [Spielwerk paywall][spielwerk]. v2's paywall has three plain promise rows, a package card, one purchase button, and a calm legal row.
- **The free allowance in a sentence.** From [Be Gen 21][begen21]. v2 says "20 free" in a pill on the Listen control, counting down.
- **Purchase states with a word and a shape.** From [Swiggy][swiggy]. v2 shows "Unlocking", then a drawn check with "Turn Listen is yours".
- **No urgency.** The [RevenueCat report][rc-guide] and the [benchmarks][rc-bench] both point the same way, and the plan forbids countdowns, badges, and percentages.

[spielwerk]: https://60fps.design/shots/spielwerk-pricing-button-text-animation
[sona]: https://loadmo.re/posts/sona-stream
[ajpicard]: https://dribbble.com/shots/23501058-OneTap-LifeTime-Paywall
[begen21]: https://loadmo.re/posts/be-gen-21
[rc-guide]: https://www.revenuecat.com/blog/growth/the-essential-guide-to-mobile-paywalls/
[rc-bench]: https://www.revenuecat.com/blog/growth/state-of-subscription-apps-benchmarks/

### Consent

- **One large sentence of reason before the system prompt.** From [Blink][blink] and the [Miles permission sheet][s-miles]. v2's consent card is a partner-facing card with a serif question, four facts with symbols, and an orange edge.
- **The data promise in body size.** From [Cupidku][cupidku]. v2 never puts what happens to the audio in fine print.
- **Two plain answers.** From [Bato's onboarding][bato] and the [Miles sheet][s-miles]. v2 offers "They agreed" in the listening color and "They said no" as secondary.
- **The button stays put.** From the [Miles permission sheet][s-miles]: the height springs, the copy crossfades, the rows stagger, and the button holds its place. v2's consent card keeps its two answers anchored at the bottom.

[blink]: https://loadmo.re/posts/blink
[s-miles]: https://60fps.design/shots/miles-permission-sheet-morph-interaction
[cupidku]: https://loadmo.re/posts/cupidku
[bato]: https://dribbble.com/shots/26858394-Mental-Health-App

## What the web research found

### AAC and caption apps

A teardown of 17 apps across AAC, live captioning, voice relay, and speech AI. The parts that changed v2's layout:

- **Stack the caption above the replies.** [Rejoin Voice][rejoin] and [Vocable][vocable] both put the partner's transcript immediately above the response cards, cutting the eye travel between hearing and answering.
- **Keep grid coordinates fixed.** [Proloquo][proloquo] and [Speech Assistant][speech-assistant] swap labels at identical coordinates when the category changes, because motor memory is the user's map.
- **Keep a permanent conversation strip.** [TD Snap][tdsnap]'s QuickFires and [Nagish][nagish] both keep high-frequency control words docked regardless of the active category.
- **Name the speaker in words.** [Ava][ava] prefixes transcript chunks with the partner's identity; Turn uses "They're saying" and "They said".
- **Show the noise floor, not decibels.** [Google Live Transcribe][transcribe] uses an inner ring for ambient noise and an outer ring for the speaker, so the user can see whether the room is too loud without reading a number.
- **Freeze auto-scroll on touch.** [Otter][otter] suspends live scrolling the moment the user scrolls back, and offers a resume control.
- **Full-screen partner display.** [Proloquo4Text][p4t] flips the composed phrase 180 degrees so the person across the table can read it.

[proloquo]: https://apps.apple.com/us/app/proloquo-aac/id1552554790
[speech-assistant]: https://apps.apple.com/us/app/speech-assistant-aac/id1139762358
[tdsnap]: https://apps.apple.com/us/app/td-snap/id1229061614
[nagish]: https://apps.apple.com/us/app/rylo-live-call-captioning/id1552554790
[ava]: https://apps.apple.com/us/app/ava-transcribe-voice-to-text/id1081047125
[transcribe]: https://www.android.com/accessibility/live-transcribe/
[otter]: https://apps.apple.com/us/app/otter-transcribe-voice-notes/id1276437113
[p4t]: https://apps.apple.com/us/app/proloquo4text-aac/id751647251

### iOS design in 2025 and 2026

- **Liquid Glass is a functional layer, not a decoration.** The [HIG Materials page][hig-materials] puts glass on bars, controls, sheets, and popovers. The [adopting guide][adopting-glass] describes refraction and specular edges rather than a flat blur.
- **The HIG names the antipatterns.** Do not layer glass on glass, do not let translucency compromise text, and do not use glass or motion as the sole status indicator ([materials][hig-materials], [accessibility][hig-access]).
- **Accessibility settings replace the material.** Reduce Transparency swaps glass for solid fills, Increase Contrast hardens borders, and Reduce Motion stops the specular shift ([HIG accessibility][hig-access]).
- **Type has split into two system voices.** SF Pro Rounded for controls and SF Pro for data, with a serif such as New York for editorial calm. v2 follows this split exactly.
- **Warm neutrals replaced pure white and black.** The report names warm off-whites in light and deep midnight tones in dark, with a single restrained accent.
- **The awards set the benchmark.** The [2026 announcement][nr-ada-26] and the [2025 announcement][nr-ada-25] list Guitar Wiz, Moonlitt, Tide Guide, Speechify, and CapWords; each appears in the site tables above.

[adopting-glass]: https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass
[hig-access]: https://developer.apple.com/design/human-interface-guidelines/accessibility
[nr-ada-26]: https://www.apple.com/newsroom/2026/06/apple-announces-winners-of-the-2026-apple-design-awards/
[nr-ada-25]: https://www.apple.com/newsroom/2025/06/apple-announces-winners-of-the-2025-apple-design-awards/

### Expo and React Native feasibility

- **Glass is available but fragile.** [expo-glass-effect][glass] needs iOS 26 and falls back to a plain view elsewhere. Setting `opacity: 0` on a glass view makes it vanish, and `isLiquidGlassAvailable()` can report true while Reduce Transparency is on, so Turn must read [AccessibilityInfo][rn-accessibility] itself.
- **System fonts need no bundling.** React Native maps `ui-rounded` to SF Pro Rounded and `ui-serif` to New York directly ([Text][rn-text]), which is why v2 ships no font files.
- **Dynamic Type runs to AX5.** Text scales to the largest accessibility size ([Text][rn-text]). The report suggested capping it with `maxFontSizeMultiplier`; Turn doesn't, since A11Y-4 requires every size, so buttons take minimum heights rather than fixed ones.
- **Reanimated covers the motion budget.** CSS transitions, layout transitions, and spring presets are production-ready on the New Architecture ([entering and exiting][ra-entering], [layout transitions][ra-layout]), and [reduced motion][ra-reduced] is a documented hook.
- **Haptics go quiet while recording.** [expo-haptics][expo-haptics] maps to UIKit, and iOS suppresses the engine during dictation or recording, so no state may depend on touch.
- **Box shadows are now spec-shaped.** [View style props][rn-view-style] give `boxShadow` and `filter`, with the warning that `filter` forces `overflow: hidden` and clips children.
- **Skia and SwiftUI hosts were ruled out.** Both add native build risk without changing the design; plain animated views and Reanimated cover the listening light and the meter.
- **The paywall stays RevenueCat's.** The [React Native paywall guide][rc-rn] covers presenting a dashboard paywall; v2 rebuilds it in the Paywalls editor rather than shipping a custom screen.

[glass]: https://docs.expo.dev/versions/latest/sdk/glass-effect/
[rn-accessibility]: https://reactnative.dev/docs/accessibilityinfo
[rn-text]: https://reactnative.dev/docs/text
[ra-entering]: https://docs.swmansion.com/react-native-reanimated/docs/animations/entering-exiting-animations/
[ra-layout]: https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/layout-transitions/
[rn-view-style]: https://reactnative.dev/docs/view-style-props
[rc-rn]: https://www.revenuecat.com/docs/tools/paywalls/displaying-paywalls/react-native

### RevenueCat paywalls

- **Paywalls v2 renders natively.** It uses SwiftUI on iOS rather than a webview, and definitions are delivered as JSON from RevenueCat's servers ([announcement][rc-v2]).
- **The component set includes the parts v2 needs.** A `Footer` for the purchase button and legal row, a `Package` card for the one-time product, a `Feature list`, and a `Button` for Close and Restore all exist in the [components documentation][rc-components].
- **Countdowns exist as a component.** `Countdown` is a supported [component][rc-components]; Turn simply does not place one.
- **Clarity converts better than cleverness.** The [essential guide][rc-guide] describes high-converting paywalls as a clear headline, a few bullets, and a call to action.
- **Testimonial clutter costs conversion.** The same guide reports that removing quote walls in favor of direct feature clarity improved results.
- **Hard paywalls convert far better than soft ones.** The [benchmarks][rc-bench] put mandatory onboarding paywalls at roughly 10.7% to 12.1% of downloads within 35 days against about 2.1% for freemium. Turn gates on a usage milestone instead, and the [guide][rc-guide] names presenting a paywall before value as a leading cause of churn.
- **About a quarter of apps offer a lifetime tier.** The same [benchmarks][rc-bench] put one-time or lifetime options at roughly 1 in 4.

[rc-v2]: https://www.revenuecat.com/blog/engineering/announcing-revenuecat-paywalls-v2/
[rc-components]: https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls/components

### Color and accessibility

- **AAC color convention is grammatical, not decorative.** The Modified Fitzgerald Key, which assigns yellow to pronouns, green to verbs, and red to negation, came from a 1929 syntax structure rather than from color coding ([history][fitzgerald]). Turn keeps it as background and does not color individual buttons by word class.
- **Adult text AAC apps do not rainbow their grids.** [Proloquo4Text][p4t-site] is monochrome by default, and [TD Talk][tdtalk] and [Alpha Core][alphacore] reserve color for category and mode.
- **Background color did not speed up adult visual search.** Thistle found it helped only in large 60-symbol arrays, and had no significant effect in small ones ([2019 study][thistle-2019]); earlier work found heavy backgrounds slowed children down ([2017 study][thistle-2017]). Turn's grid is small, and [Wilkinson and colleagues][thistle-2019] found fixed spatial layout beats color coding.
- **WCAG 2.2 sets the thresholds Turn already uses.** 4.5:1 for text and 3:1 for non-text at Level AA, and 7:1 for standard text at Level AAA ([WCAG 2.2][color-wcag]).
- **Color alone is never enough.** WCAG 2.2 SC 1.4.1, plus the fact that any 8-hue palette collides under dichromacy, is why the [color report][color-wcag] requires a label and an icon on every category.
- **Dark mode has an eye cost.** Halation and scatter make white on pure black harder to read for astigmatic and cataract eyes ([NN/g on dark mode][dark-mode]). v2 uses warm charcoal with off-white ink rather than black and white.
- **Target size has empirical support.** Motor studies put the accuracy plateau at 60 to 80 points and recommend 8 to 12 points of gutter ([ACM study][motor]). The [HIG][hig-access] requires 44 by 44 points as the floor; Turn's 78 is above it.
- **Bolder weights for older eyes.** Apple warns against thin and light weights ([HIG typography][hig-typography]); v2's phrases are bold.

[fitzgerald]: https://praacticalaac.org/praactical/praactical-aac-spread-the-word-modified-fitzgerald-key/
[p4t-site]: https://www.assistiveware.com/support/proloquo4text
[tdtalk]: https://www.tobiidynavox.com/pages/td-talk
[alphacore]: https://thinksmartbox.com/product/alpha-core/
[thistle-2019]: https://pubs.asha.org/doi/10.1044/2019_PERS-SIG12-2019-0004
[thistle-2017]: https://pubs.asha.org/doi/10.1044/2017_AJSLP-15-0144
[dark-mode]: https://www.nngroup.com/articles/dark-mode/
[motor]: https://dl.acm.org/doi/10.1145/1414471.1414494
[hig-typography]: https://developer.apple.com/design/human-interface-guidelines/typography

## Art directions

Three directions were rendered and compared on the same screens.

**Warm Voice** puts a warm paper board under category-edged cards, sets the partner's words in a large serif, and uses a restrained orange listening capsule with a warm glow on the caption. Its weaknesses are contrast on the pale category fills and crowding on the Listen screen, where the caption, five conversation controls, six replies, tabs, Yes and No, and the toolbar all share one viewport. v2 is this direction.

**Night Studio** turns the same grid into a calm illuminated listening space: deep matte navy tiles, one electric accent for Turn's confident reply, and a contained aurora marking the listening state. Its gain is a premium dark appearance, which is why v2's dark mode is warm charcoal rather than black. Its losses are contrast on the bright accent and the lack of category tints, so v2 keeps Warm Voice's category hues in dark.

**Bold Blocks** uses warm paper, ink-dark outlines, hard offset shadows, and solid fruit-colored blocks for a tactile identity with no mascots. Its gain is the big Yes and No symbols on a 2.5-point edge, which v2 adopts so the three fixed answers read without color. Its pale greens and pinks would need checking against 7:1 before use, so the fills did not travel.

The plan is the record of what shipped: Warm Voice, with Night Studio's dark mode and Bold Blocks' big Yes and No symbols.

## What Turn rejects

- **Glass behind words.** The [Abdur Rouf shot][glass-shot] and the [Emoji Personality Test][emoji] both blur content under a card, and the [HIG][hig-materials] says not to layer glass on glass or let translucency compromise text. Glass is confined to the floating toolbar.
- **Auto-playing loops.** The [Sona][sona] chain and the [Breathe][s-breathe] orb animate on their own. v2's motion table is feedback, and every row says what Reduce Motion shows instead.
- **AI orbs and sparkles.** Dominant on [Dribbble][dribbble] voice searches, and the [AAC teardown][rejoin] calls them patronizing. Turn never uses a sparkle glyph.
- **Candy colors that read as a children's app.** The [contrast findings][color-wcag] note that adult users report feeling stigmatized by toy-like colorful grids. Category tints are pale and edge-bound; phrase text stays ink on a surface.
- **Countdown timers and offer badges.** Supported by [RevenueCat][rc-components] and used across most paywalls on [Dribbble][dribbble]. Turn's rules forbid them, and the [guide][rc-guide] says urgency reads as anxiety in a health-adjacent app.
- **Scroll-driven and gesture mechanics.** The [District][district] morph, the [How We Feel][s-hwf] drifting bubbles, and the [Grokk][grokk] timed suggestion pills all move targets. v2 pages with Up and Down and never moves a grid while a finger may be landing.
- **Drag to reorder.** The [AAC teardown's anti-patterns][rejoin] rule out long-presses, two-finger taps, and drag-and-drop for users with spasticity and tremors. v2's category editor moves rows with Move up and Move down buttons, and the phrase bank orders with the same two controls.

[glass-shot]: https://dribbble.com/shots/26801881-AI-Voice-Assistant-App
[emoji]: https://loadmo.re/posts/the-emoji-personality-test
[district]: https://60fps.design/shots/district-icon-grid-to-tabs-morph-interaction
[s-hwf]: https://60fps.design/shots/how-we-feel-emotion-picker
[grokk]: https://60fps.design/shots/grok-cycling-suggestion-pills

## See also

- [The v2 redesign plan][plan], the build order, the tokens, and the checks.
- [DESIGN.md][design-md], whose rules v2 keeps and whose colors, type, shapes, depth, and motion the plan replaces.
- [The AAC design notes][aac-design], the earlier research behind those rules.
- [Turn's iOS design research notes][turn-ios-design], which own the platform and RevenueCat facts v2 builds on.

[design-md]: /docs/DESIGN.md
[aac-design]: /docs/research/0028-aac-design.md
[turn-ios-design]: /docs/research/0029-turn-ios-design.md

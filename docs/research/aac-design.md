# AAC interface design research notes

How text AAC apps for literate adults look and behave, and what research says
about the visual and interaction design of augmentative and alternative
communication (AAC) and other assistive interfaces. The note feeds the rewrite
of [DESIGN.md](/docs/DESIGN.md) as Turn's design system and art direction, with
the three sibling notes under [See also](#see-also). Every source below was read
on September 23, 2026, so versions and page contents are as of that date, and
judgment starts with "Synthesis:". The [AAC practice notes][aac-notes] already
cover fixed positions, quick-fire phrases, AI suggestions and authorship, iOS
access features, target sizes, Live Speech, and devices that listen, and the
[evidence notes][ev-rivals] hold the rival apps' prices, so this note links to
both instead of repeating them.

Contents:

1.  [Findings for DESIGN.md](#findings-for-designmd)
1.  [How text AAC apps look and behave](#how-text-aac-apps-look-and-behave)
1.  [Color, grids, and type on AAC displays](#color-grids-and-type-on-aac-displays)
1.  [Targets, touch, and mounting](#targets-touch-and-mounting)
1.  [The partner's view](#the-partners-view)
1.  [Dignity and aesthetics](#dignity-and-aesthetics)
1.  [Showing suggestions and doubt](#showing-suggestions-and-doubt)
1.  [Conflicts between sources](#conflicts-between-sources)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## Findings for DESIGN.md

Synthesis: each line condenses the section it links to, where the sources are.

- **Keep the strip, the row, and the fixed buttons as fixed groups, set apart by
  space, within a thumb's reach.** Spacing helped where color coding didn't, and
  one thumb reaches the middle of a phone best, so the stack can keep the PRD's
  order, strip and row above the grid, but should start below the top edge. See
  [One-handed use and where controls
  sit](#one-handed-use-and-where-controls-sit).
- **Make speech buttons at least 12 mm, about 72 to 77 points, on the short
  side, and wider than tall.** Errors converged at 12 mm for tetraplegic users
  and kept falling up to 18 mm for others with motor impairments, while A11Y-1's
  64 points is about 10 mm; a larger-button setting should show fewer slots, not
  smaller ones. See [Target size and spacing for tremor and
  weakness](#target-size-and-spacing-for-tremor-and-weakness).
- **Forgive slow, heavy, and repeated taps, and leave the tuning to iOS.** Touch
  with tremor varies by person and by day, so Turn should act on release, keep
  long presses off phrases, point caregivers to Touch Accommodations, and offer
  a setting that keeps a stray tap from cutting off speech, as SPEAK-2 now lets
  it. See [Guards against accidental
  activation](#guards-against-accidental-activation).
- **Size text by Dynamic Type, left-aligned, and drop the row's columns before
  its text shrinks.** Reading slows below about 13 characters a line,
  left-aligned lines help readers with hemianopia after a stroke, and no special
  font has evidence behind it. See [Text size, line length, and
  fonts](#text-size-line-length-and-fonts).
- **Don't color-code phrases, and follow the system appearance.** Color coding
  comes from symbol grids for children, and dark text on light reads better, yet
  many low-vision readers need the reverse, so Turn needs no in-app theme, 7:1
  contrast on phrase text, and category color only beside category names. See
  [Color coding and backgrounds](#color-coding-and-backgrounds) and [Dark mode,
  contrast polarity, and glare](#dark-mode-contrast-polarity-and-glare).
- **Set suggestions apart by the row's place, and show confidence only through
  its three states.** No rival documents marking each reply as AI, suspected
  smart-reply use made senders seem less cooperative, and Apple and Google
  advise implying confidence by order and thresholds, not numbers. See [Whether
  to show confidence](#whether-to-show-confidence).
- **Offer fewer, shorter phrases from the first slot, and never change a slot
  under a finger.** Choosing took about 2.4 seconds from one suggestion and 5.5
  from six, long phrases took twice as long as short ones, and content that
  moves as it arrives causes wrong taps. See [What prediction displays
  cost](#what-prediction-displays-cost).
- **When nothing fits, keep the slots and say in words which line they answer.**
  Smart Reply shows nothing for most emails and Apple prefers old data with its
  age to a blank, so the caption, not dimmed phrases, should say the row still
  answers an earlier line. See [Stale rows, empty rows, and targets that
  move](#stale-rows-empty-rows-and-targets-that-move).
- **Keep the strip and the fixed buttons always in view, stricter than any
  rival.** Rivals put quick-fire phrases behind a tab or the keyboard, while
  Vocable and Rejoin give closed questions a few huge tiles. See [Patterns
  across the apps](#patterns-across-the-apps).
- **Give the light a word and a symbol, large when listening starts and steady
  after, and show Paused as its own state.** Small lights go unnoticed,
  indicator colors mean opposite things on different devices, and bystanders
  don't trust a light that goes out. See [Showing a bystander that a device
  listens](#showing-a-bystander-that-a-device-listens).
- **Make the consent card one decision: notify first, then ask, with two equal
  buttons and a way to have it read aloud.** A notice's first layer must carry
  its point, a highlighted button sways choices, talking beats forms, and no
  rival documents asking the partner. See [Consent notices people
  read](#consent-notices-people-read).
- **Add a Show view of the last spoken phrase, flipped toward the partner, and
  never show the row or live typing.** Seven of the twelve apps have one, users
  share typing only with close partners, and a screen held up to the partner
  costs eye contact. See [Displays that face the
  partner](#displays-that-face-the-partner).
- **Look like an ordinary iOS app an adult chose, write plainly, keep failures
  quiet, and never move the layout under the user.** Mainstream-looking devices
  drew the least attention, and a Predictable user whose layout changed fell
  back to a whiteboard. See [Social acceptability and
  stigma](#social-acceptability-and-stigma).

## How text AAC apps look and behave

The twelve apps below were read through their manuals, help centers, App Store
listings, and screenshots, which this note describes in words. TD Snap and Grid
for iPad run only on iPad and the rest on iPhone; the [evidence
notes][ev-rivals] hold prices and ratings.

### Comparison of twelve apps

Synthesis: the table condenses the app sections below it, where the sources are.

| App                  | Message window                      | Speak, Stop, Repeat                 | Partner view                       | Listening                       | Suggestions marked            | Touch guards                           | Appearance                  |
| -------------------- | ----------------------------------- | ----------------------------------- | ---------------------------------- | ------------------------------- | ----------------------------- | -------------------------------------- | --------------------------- |
| Proloquo4Text        | Text Pad at the top                 | Play pill; Clear                    | Full Screen with Flip; Watch tilts | None                            | Only Apple's Writing Tools    | Tap inserts, hold speaks               | Colors per area             |
| Predictable          | Large box mid-screen                | Big Speak; Stop, Pause, or non-stop | Show with flip; Dual window        | Live Translate records speech   | Named AI keys with sparkles   | Hold 0.5 to 7 s; freeze after a tap    | Dark by default since 8.0   |
| Spoken               | One line at the top                 | Speaker icon; X clears              | Show Large                         | None                            | Not labeled                   | Scroll arrows                          | Dark Mode toggle            |
| TD Snap Text         | Message Bar across the top          | Speak, Clear, Delete                | Rear window on TD devices only     | None                            | None                          | Hold, release, 2 s lockout             | Window font and colors      |
| TouchChat            | Bar of 14 to 72 pt, 1 to 10 lines   | Tap the bar; Prevent Interruption   | Speak and Enlarge Text             | None                            | None                          | Dwell and release 0.1 to 5 s; keyguard | Seven fonts; no dark mode   |
| Grid for iPad        | Chat area at the top                | Speak, Clear, Undo, Fix             | Not found                          | None                            | Opt-in AI tools               | Left to iPadOS                         | Dark gray keyboard          |
| Speech Assistant AAC | Textbox at the top                  | Speak; Clear                        | Rotated text; extra textbox        | None                            | No AI                         | Double-tap guard                       | Color schemes, custom       |
| Talk For Me          | Text box; text stays after speaking | Say It!; text stays to repeat       | None                               | None                            | No AI                         | Scroll buttons, no swipes              | Light, dark, or system      |
| Vocable AAC          | Label; partner's words replace it   | Speak key                           | Not found                          | Listen category; two sounds     | GPT and on-device alike       | Hover time 0.5 to 5 s                  | One dark indigo theme       |
| Rejoin Voice         | Message card at the top             | Gold Speak button                   | Display mode, flipped              | Gold orb; gray when muted       | Own card under partner's line | Steady taps act on lift                | Light, Night, High Contrast |
| CoughDrop            | Box at the top; tap to repeat       | Tap the box to speak again          | Flip text                          | None                            | No AI                         | Minimum press time                     | Not found                   |
| Live Speech          | Floating "Type to Speak" bar        | Speak; Recent re-speaks             | None                               | None; Live Captions is separate | Suggested words               | iOS settings only                      | Follows iOS                 |

### Proloquo4Text

- **One screen.** AssistiveWare's app for "literate adults, teens and children"
  is "laid out on a single screen to reduce the effort of typing"; version 5.6
  is from April 28, 2026, and its only AI is Apple's Writing Tools
  ([listing][p4t-listing]). The iPhone screenshots show a white Text Pad filling
  the top half in large black type, a blue Play pill between a keyboard toggle
  and a trash can for Clear, a row of five word predictions, and the iOS
  keyboard.
- **Phrases.** By default a tap on a phrase inserts it "while a touch and hold
  will speak it immediately", and Quick Talk speaks on a tap
  ([support][p4t-blocks]), but "On the iPhone, you will need to hide the
  keyboard in order to access Quick Blocks" ([support][p4t-iphone]). Text size,
  color, and font are set per area, with a separate size for Full Screen
  ([support][p4t-textpad]), and no hold time or dark-mode setting turned up.
- **The partner.** "In full screen mode you can use the Flip button (4) to make
  the text easily readable for a communication partner facing you", and on Apple
  Watch, "Tilting your wrist towards the person you are talking to will flip
  your message" ([manual 4.0][p4t-manual]). An AAC user quoted by the maker
  picks the flipped view over speech "because I don't want my conversation
  publicized or they have a hard time understanding the speaker" ([blog, March
  10, 2019][p4t-blog]).

[p4t-blocks]: https://www.assistiveware.com/support/proloquo4text/basics/the-quick-blocks
[p4t-iphone]: https://www.assistiveware.com/support/proloquo4text/basics/difference-in-using-proloquo4text-on-ipad-and-iphone
[p4t-textpad]: https://www.assistiveware.com/support/proloquo4text/adjust-appearance/text-pad-and-quick-blocks
[p4t-manual]: https://download.assistiveware.com/proloquo4text/files/Proloquo4Text-4.0-manual-EN.pdf
[p4t-blog]: https://www.assistiveware.com/blog/making-the-most-of-proloquo4text

### Predictable

- **Dark by default.** Therapy Box's Predictable, whose listing names "ALS/MND"
  first among the conditions it serves, brought in version 8.0 of July 8, 2026
  "a default dark mode featuring a large speak button"
  ([listing][pred-listing]); the screenshots show white-on-black keys, three
  wide prediction buttons, and a round speak button ringed in teal.
- **The partner and the floor.** A Show key fills the screen with "return to
  keyboard, bell, flip and speak", a "Dual message window" will "invert the top
  section" so "you can easily show others your text whilst typing", and a
  floorholder can speak by itself "after a predetermined amount of time of
  active typing" ([user guide][pred-guide]).
- **Touch guards and AI.** Time Delay holds run "from 0.5 to 7 seconds",
  "Enabling Force Delay freezes the screen after the first tap", and "Non stop
  speak" removes Stop and Pause, which "can help prevent accidental duplicate
  presses of the speak button" ([user guide][pred-guide]). AI features are named
  keys with sparkle icons, "AI Tunes, AI Phrase Builder, Rewrite, and Live
  Translate" ([listing][pred-listing]), and Live Translate records speech so the
  user can "choose from AI generated responses" ([user guide][pred-guide]).

[pred-guide]: https://docs.google.com/presentation/d/1JN_zwB6Nfy6g7ZKmYfk-2UKSgUyYBhc-bTzYnjA2njM/preview

### Spoken

- **Words first.** Spoken is "designed for teens and adults", and its
  predictions carry no AI label: "Our speech engine learns the way you talk"
  ([listing][spoken-listing]); Large Print and Dark Mode are toggles
  ([features][spoken-features]). The screenshots show a pale cream-to-blue
  background, a slab-serif typeface, one line of message text between a red X
  and a speak icon, and two columns of large predicted words with thin line
  icons.
- **Show, alert, and arrows.** Holding the speak icon offers Show Large, which
  "displays your text in extra large print for other people to read"
  ([help][spoken-phrase]); an attention button "will flash the light on the back
  of your device and play an alert noise" ([help][spoken-alert]); and scroll
  arrows came because "Apple's Assistive Touch scrolling feature appears to be
  incompatible with Spoken" ([help][spoken-eye]).

[spoken-features]: https://spokenaac.com/features/
[spoken-phrase]: https://spokenaac.com/help/what-can-i-do-with-a-phrase/
[spoken-alert]: https://spokenaac.com/help/how-do-i-alert-people/
[spoken-eye]: https://spokenaac.com/help/does-spoken-support-eye-tracking/

### TD Snap's Text page set

- **For literate users, on iPad.** TD Snap "Requires iPadOS 13.0 or later", and
  its Text page set is "for those who are literate or transitioning from symbol
  supports to literacy" ([listing][tdsnap-listing]). Tobii Dynavox's images show
  a Message Bar with Speak at the left of a wide white window and Clear, Delete,
  and Share at its right, and off-white, text-only buttons, with "Wait, I'm
  typing." on a QuickFires page behind a toolbar tab ([Text page
  set][tdsnap-text]). The page set styles the message window's font, size, and
  colors ([manual][tdsnap-manual]).
- **The Partner Window.** On the maker's own I-13, I-16, and TD Pilot devices, a
  rear screen "informs the conversation partner that the user is preparing to
  speak", and in one mode "will display a series of dots to indicate that the
  user is preparing their message" until the text is spoken
  ([manual][tdsnap-manual]).
- **Touch methods.** Plain Touch acts "as soon as they are touched", Touch Enter
  adds a hold "for users who may touch or click unintended objects
  accidentally", Touch Exit selects on lift, and Delay Between Selections at
  Medium ignores "all selection attempts that occur within 2 seconds after a
  selection" ([manual][tdsnap-manual]).

[tdsnap-listing]: https://apps.apple.com/us/app/td-snap/id1072799231
[tdsnap-text]: https://www.tobiidynavox.com/pages/td-snap-text

### TouchChat

- **The Speech Display Bar.** PRC-Saltillo's TouchChat HD has a Spelling set, "a
  QWERTY keyboard page set with four word prediction buttons and a few
  pre-stored phrases"; its bar's "Font sizes range from 14 Point to 72 Point"
  over one to ten lines, in "one of the seven available fonts", and a tap can
  "Speak and Enlarge Text" ([manual][tc-manual]). No flip, dark mode, AI, or
  listening turned up.
- **Repeat, interruption, and timing.** With Auto Clear off, "Spoken text
  remains in the Speech Display Bar until you clear it"; "Prevent Interruption
  prevents interruptions of speaking a sentence if you accidentally hit another
  button while it is speaking"; dwell and release times run from 0.1 to 5.0
  seconds; and "Keyguard Inset adjusts the display for a keyguard"
  ([manual][tc-manual]).

[tc-manual]: https://touchchatapp.com/assets/uploads/TouchChat_App_Manual-v101-en-us.pdf

### Grid for iPad

- **Text sets.** In Smartbox's text grid sets, such as Text Talker, "Your
  message appears in the chat writing area at the top of the grid, and you will
  see the speak command on the right side" ([help][grid-text]), and "Your chat
  history will suggest messages based on when and where you last said something"
  ([Text Talker][grid-talker]). The screenshot shows a white chat area, a block
  of Speak, Clear, Fix, and Undo, three history phrases on a dark gray band,
  five predictions, and a dark gray keyboard.
- **Touch and AI.** "Grid for iPad can only change the highlight colour
  directly", leaving touch to iPad's accessibility settings
  ([help][grid-access]); users "Opt in to the use of Online AI Tools", which
  offer "four responses" to choose from ([news, March 31, 2026][grid-ai]).

[grid-text]: https://hub.thinksmartbox.com/knowledgebase/using-a-text-communication-grid-set/
[grid-talker]: https://thinksmartbox.com/text-talker/
[grid-access]: https://hub.thinksmartbox.com/knowledgebase/access-settings-in-grid/
[grid-ai]: https://thinksmartbox.com/news/text-talker-ai-beta-grid-set/

### Speech Assistant AAC

- **Show, rotate, and guard.** A-Soft's listing says "You can rotate the text to
  show your message to the person opposite of you" and "you can also create a
  personal color scheme" ([listing][sa-listing]), and the manual, version 6.0 of
  August 20, 2026, adds "an extra rotated textbox, so both can easily read the
  text"; autocomplete "searches, based on your typing, through all your
  phrases", and "Prevent double touching" helps "people with motor skill
  impairments or shaky hands", with a warning not to combine it with iOS's
  Ignore Repeat ([manual][sa-manual]).

[sa-manual]: https://www.asoft.nl/SpeechAssistantAAC-iOS-UserManual.pdf

### Talk For Me

- **Text stays.** Of two apps with the name, this note reads "Talk For Me - Text
  to Speech", "Built from the ground up by a developer who lost the ability to
  speak", whose version 3.3 of September 11, 2026 added buttons that "completely
  eliminate the need for swipe gestures" ([listing][tfm-listing]). Its manual:
  "You will notice the text remains in the window after being spoken. I designed
  it this way because I frequently find the need to repeat what I say"; it
  offers "light mode, dark mode, or system setting" ([manual][tfm-manual]).

[tfm-listing]: https://apps.apple.com/us/app/talk-for-me-text-to-speech/id975096888
[tfm-manual]: https://www.mobiletouchtech.com/talkforme-manual

### Vocable AAC

- **Listening.** Vocable works "Through head tracking or touch"; its Listen mode
  of June 13, 2022 "only supports Yes/No, “How Many” and “OR” question types",
  and Smart Assist of September 18, 2023 "is powered by an Azure based GPT
  engine" ([listing][voc-listing]). The screenshot shows the partner's "are you
  ok" in large mint text over two huge tiles, Yes and No.
- **In the code.** In the open-source app, the partner's words replace the
  output label in bold mint-green text, sounds mark when listening starts and
  pauses, GPT and on-device answers fill the same tiles, every color has one
  dark indigo appearance, head-tracking hover time runs from 0.5 to 5 seconds,
  and when nothing fits the app shows "Sounds complicated" over "Not sure what
  to suggest. Please use the keyboard or select an existing phrase to reply."
  ([source][voc-source]).

[voc-source]: https://github.com/willowtreeapps/vocable-ios

### Rejoin Voice

- **Generated replies in their own card.** Released on July 12, 2026 ([evidence
  notes][ev-rivals]), Rejoin "listens alongside your conversation, on-device",
  and "three replies are already waiting, written in your style"
  ([listing][rejoin-listing]). The screenshots show a warm cream screen with
  gold accents, the partner's line quoted in italic serif, tone chips, three
  full-width reply buttons, and a wide gold Speak button.
- **The orb.** "While the Speak page is open, Rejoin listens (the gold orb
  breathes to show it)", and "Tap the orb any time to mute; it turns gray"
  ([support][rejoin-support]); "With Reduce Motion on, the orb changes by
  brightness instead of animation" ([accessibility][rejoin-a11y]). No page read
  mentions asking the partner, and "What Rejoin heard, and the record of your
  conversations, are stored only on your device" ([privacy
  policy][rejoin-privacy]).
- **Display mode and sizes.** It "fills the screen with your message and flips
  it to face the person across the table, for loud rooms, restaurants, and
  hospital wards", and its screenshot says "tap text to say it again"
  ([listing][rejoin-listing]); "Primary buttons are at least 60 points tall —
  the Speak button is 74, phrase tiles over 100", "Steady taps" registers "taps
  on lift and ignores brushes", and there are "Light, Night, and a separate High
  Contrast mode" ([accessibility][rejoin-a11y]). A hands-free screenshot answers
  a closed question with four huge tiles: Yes, No, Maybe, and "Give me a moment"
  ([listing][rejoin-listing]).

[rejoin-privacy]: https://rejoinvoice.com/privacy-policy

### CoughDrop

- **Tap to repeat, flip to show.** "Hitting multiple times will repeat the
  vocalization each time", and the repeat menu can "flip the text" for someone
  on "the other side of the device" ([help][cd-repeat]). Selection can trigger
  "immediately, only after a minimum amount of time, or after a delay even
  without releasing" ([help][cd-sensitivity]), and Forbes AAC, which acquired
  CoughDrop, "decided to stop releasing updates with an open-source license"
  ([blog, March 1, 2023][cd-forbes]).

[cd-repeat]: https://coughdrop.zendesk.com/hc/en-us/articles/201800425-How-do-I-repeat-myself-in-CoughDrop
[cd-sensitivity]: https://coughdrop.zendesk.com/hc/en-us/articles/201800365
[cd-forbes]: https://blog.mycoughdrop.com/coughdrop-has-joined-forbes-aac/

### Live Speech

- **The window.** Opening, typing, saved phrases, and calls are in the [AAC
  practice notes][aac-live-speech]. Apple's illustration for iPadOS 17 shows one
  translucent bar at the bottom of the screen, with "Type to Speak…", a Phrases
  button, and a close button, floating over a FaceTime call ([support
  article][ls-support]).
- **What it lacks.** Apple's pages document no text size for the window, no view
  for the partner, no listening, and no Stop or Repeat, with Recent for
  re-speaking ([iOS 27 guide][ls-guide]); that's an absence of documentation,
  not a test on a phone. The separate Live Captions feature can "customize the
  text, size, and color of the captions", and its accuracy "shouldn't be relied
  upon in high-risk or emergency situations" ([guide][captions-guide]).

[aac-live-speech]: /docs/research/aac-practice.md#live-speech
[ls-support]: https://support.apple.com/en-us/105018
[ls-guide]: https://support.apple.com/guide/iphone/type-to-speak-iphcf92d2d9b/27/ios/27
[captions-guide]: https://support.apple.com/guide/iphone/get-live-captions-of-spoken-audio-iphe0990f7bb/27/ios/27

### Patterns across the apps

- **A show view is standard, and Repeat means text left on screen.**
  Proloquo4Text, Predictable, Spoken, TouchChat, Speech Assistant AAC,
  CoughDrop, and Rejoin put the text large or flipped for the partner in a tap
  or two, and TD Snap uses a rear screen on its maker's devices. Talk For Me,
  CoughDrop, Rejoin, and TouchChat re-speak text left on screen, and none of
  Proloquo4Text, Predictable, Spoken, TD Snap, or TouchChat has a Repeat button
  by default.
- **Quick-fire phrases hide, and gestures go.** TD Snap's QuickFires sit behind
  a tab, Proloquo4Text's Quick Talk behind the iPhone keyboard, and
  Predictable's floorholder behind a key; Spoken, Predictable, TD Snap, and Talk
  For Me add buttons that replace swipes, and six apps build in holds, lockouts,
  or release activation, while Grid for iPad leaves touch to iPadOS.
- **Suggestions sit apart, and listening faces the holder.** Rejoin puts
  generated replies in a card under the partner's quoted line, Grid for iPad and
  Predictable keep AI in named tools, and Vocable shows GPT and on-device
  answers alike; Rejoin's orb and Vocable's sounds face the holder, and neither
  app documents asking the partner.
- Synthesis: Turn's always-visible strip and fixed buttons are stricter than any
  rival, and a show view is the one common feature Turn's PRD lacks. Rejoin
  already has a flipped display mode, a light that respects Reduce Motion,
  published target sizes, and taps that act on lift, so DESIGN.md should match
  those and differ where Turn's principles do: the user's own phrases, the
  partner's consent, and no transcript kept.

## Color, grids, and type on AAC displays

Most display research in AAC used symbols and children; this section says where
its findings reach literate adults and where they don't. The [AAC practice
notes][aac-fixed] cover fixed positions.

[aac-fixed]: /docs/research/aac-practice.md#fixed-button-positions-and-motor-automaticity

### Color coding and backgrounds

- **Practice outran evidence.** The Fitzgerald Key was "developed by Edith
  Fitzgerald in 1929 as a means of teaching grammatical language to children who
  were deaf and hearing impaired" and adapted for AAC in 1973 ([Tobii
  Dynavox][tdx-core]), Proloquo2Go applies a modified form by default
  ([AssistiveWare][p2g-color]), and background color is "widespread in clinical
  practice (Thistle & Wilkinson, 2015) despite a limited research base" ([Light
  et al., 2019][light-2019]).
- **Children.** "Targets that contain only background color but no foreground
  color appear to have a negative effect on the speed with which younger
  children can locate a target" ([Thistle and Wilkinson, 2009][thistle-2009]),
  and "Rapid search was facilitated by a spatial organization cue, but not by
  the addition of background color" ([Wilkinson and Snell,
  2011][wilkinson-2011]).
- **Adults.** Sixty adults without disabilities, acting as partners, were faster
  with background color only in a 60-symbol array ([Thistle,
  2019][thistle-2019]). For 10 adolescents and adults with Down syndrome,
  close-set symbols caused "visual crowding", spacing and grouping cut looks at
  distractors, and "Background color was helpful in reducing the latency to find
  the target" ([Wilkinson et al., 2022][wilkinson-2022]); scattering
  like-colored symbols made people reach across the body more, which "will
  generate greater physical burden" ([Wilkinson et al., 2026][wilkinson-2026]).
- **Nothing on text.** The field's review advises "Only use background color
  with caution" and to "Consider the benefits of text alone", and lists color
  cues, spacing, and layout for keyboards as untested ([Light et al.,
  2019][light-2019]); no study found tested color coding on text-only phrase
  displays or with literate adults who use AAC.
- Synthesis: color by word class serves symbol grids for people building
  sentences, not Turn's whole-sentence buttons. Space does what color was meant
  to: separate the strip, the row, and the grid with clear gaps, cluster Yes,
  No, and Not sure, and keep related items together to save reaches. Category
  colors, if any, belong on the category tabs beside the names, since MS can
  dull color vision and [A11Y-6][prd-a11y] forbids color alone.

[tdx-core]: https://download.mytobiidynavox.com/Compass/documents/Articles%20and%20References/The%20Story%20of%20Core.pdf
[p2g-color]: https://www.assistiveware.com/support/proloquo2go/appearance/color-code-page-background
[wilkinson-2011]: https://pmc.ncbi.nlm.nih.gov/articles/PMC3472415/
[wilkinson-2026]: https://pmc.ncbi.nlm.nih.gov/articles/PMC12353571/

### Grid size, scrolling, and navigation

- **Fewer items, fewer levels.** For 10 adults with aphasia and 10 without,
  "Number of symbols on the screen and location level had a significant effect
  on accuracy and latency for both groups" ([Petroi et al., 2014][petroi-2014]),
  and Tobii Dynavox advises a smaller grid with bigger buttons when speed or
  accuracy suffers ([TD Snap manual][tdsnap-manual]).
- **Scrolling hides things.** Of 22 older adults, "21 participants didn't
  realize the tab menus could be scrolled horizontally" ([Li and Luximon,
  2019][li-luximon]), and "The indicators of mode changes should be persistent
  and large, since the elderly users may fail to notice short alerts or small
  changes in the look-and-feel" ([Kobayashi et al., 2011][kobayashi-2011]); "six
  of the eight users" with limited arm mobility chose enlarged controls even
  though pages grew longer ([Valencia et al., 2017][valencia-2017]).
- Synthesis: show one category at a time with every category name in view, not
  in a sideways scroller; let the grid scroll vertically, with large page
  buttons too; never make scrolling the way to reach the strip, the row, or the
  fixed buttons; and keep Listen mode's state persistent and large.

[petroi-2014]: https://pubmed.ncbi.nlm.nih.gov/24575783/
[li-luximon]: https://doi.org/10.1080/0144929X.2019.1622786
[valencia-2017]: https://doi.org/10.1093/iwc/iwx013

### Text size, line length, and fonts

- **Critical print size.** Reading is fastest over "approximately 0.2° to 2°" of
  x-height, 1.4 to 14 mm at 40 cm, and people in their 70s lose more acuity "in
  poor lighting, in glare or with low-contrast print" ([Legge and Bigelow,
  2011][legge-bigelow-2011]); the smallest size read at full speed "increased
  slowly until 68 years" and "then more rapidly until 81 years" ([Calabrèse et
  al., 2016][calabrese-2016]).
- **The floor on line length.** "If the number of characters on a line gets too
  small, reading speed declines": about 13 characters a line for normal vision
  and nine for low vision ([Xiong et al., 2022][xiong-2022]). WCAG 1.4.8 sets
  the ceiling, "Width is no more than 80 characters or glyphs", without
  justified text ([WCAG 2.2][wcag22]); no study found tested short phrase labels
  that wrap inside buttons.
- **Vision after stroke and in MS.** Of 1,033 acute stroke patients, 73% had
  visual problems, including "28% visual field loss, 27% visual inattention"
  ([Rowe et al., 2019][rowe-2019]), and about half of survivors with visual
  impairment "were visually asymptomatic" ([Rowe et al., 2022][rowe-2022]);
  "Patients with left HFD have difficulties finding the beginning of the next
  line" ([Kuester-Gruber et al., 2021][kuester-2021]). MS brings "reduced colour
  vision" and "transient visual blurring associated with increase in body
  temperature" ([Balcer et al., 2015][balcer-2015]), and in ALS, eye movements,
  "traditionally regarded as spared", can be affected ([Sharma et al.,
  2011][sharma-2011]).
- **Special fonts.** The Braille Institute's Atkinson Hyperlegible "uses special
  design principles to differentiate characters", with a Next family of "seven
  weights" from 2025 ([Braille Institute][braille-font]); its download form asks
  for an email address, while Google Fonts distributes both under the SIL Open
  Font License 1.1 ([Google Fonts][gf-next]), and no peer-reviewed evaluation
  turned up. In 2026 Legge's group found "It has been difficult to demonstrate
  major advantages of fonts designed specifically for low vision" ([Legge et
  al., 2026][legge-2026]); OpenDyslexic "did not lead to a better or worse
  readability" for 48 adults with dyslexia ([Rello and Baeza-Yates,
  2013][rello-2013]); and a 2026 meta-analysis found dyslexia fonts had "no
  consistent or reliable effect" ([Azzarello et al., 2026][azzarello-2026]).
- Synthesis: the [iOS design note](/docs/research/turn-ios-design.md) covers
  Dynamic Type; this research adds a floor. At accessibility sizes the row and
  the grid should drop columns so each phrase keeps about 13 characters a line,
  down to one phrase a line, and never truncate. Left-align phrase text so each
  line starts in the same place, keep safety-critical controls off the far left
  edge alone, and let the layout survive a text-size change in mid-conversation,
  since iOS 27 lets people "Change the size of text while you're in an app"
  ([Apple][ug-text]). Use the system font with Bold Text honored; Atkinson
  Hyperlegible Next can be an option but not a claim, and Turn shouldn't ship a
  dyslexia font.

[legge-bigelow-2011]: https://pmc.ncbi.nlm.nih.gov/articles/PMC3428264/
[calabrese-2016]: https://pmc.ncbi.nlm.nih.gov/articles/PMC4961000/
[xiong-2022]: https://pmc.ncbi.nlm.nih.gov/articles/PMC9357187/
[rowe-2019]: https://pmc.ncbi.nlm.nih.gov/articles/PMC6402759/
[rowe-2022]: https://pubmed.ncbi.nlm.nih.gov/33347793/
[kuester-2021]: https://pmc.ncbi.nlm.nih.gov/articles/PMC7904714/
[balcer-2015]: https://pmc.ncbi.nlm.nih.gov/articles/PMC4285195/
[sharma-2011]: https://pubmed.ncbi.nlm.nih.gov/21747027/
[braille-font]: https://www.brailleinstitute.org/freefont/
[gf-next]: https://github.com/google/fonts/tree/main/ofl/atkinsonhyperlegiblenext
[legge-2026]: https://pmc.ncbi.nlm.nih.gov/articles/PMC13012447/
[rello-2013]: https://doi.org/10.1145/2513383.2513447
[azzarello-2026]: https://doi.org/10.1007/s11881-026-00389-8
[ug-text]: https://support.apple.com/guide/iphone/make-text-easier-to-read-iph3c076905a/27/ios/27

### Dark mode, contrast polarity, and glare

- **Dark on light reads better.** The "positive polarity advantage was
  independent of ambient lighting" ([Buchner and Baumgartner,
  2007][buchner-2007]), held "for both age groups" ([Piepenbrock et al.,
  2013][piepenbrock-2013]), and "linearly increased with decreasing character
  size" ([Piepenbrock et al., 2014][piepenbrock-2014]); in glance reading, white
  on black did worst in a dark room and polarity didn't matter in bright light
  ([Dobres et al., 2017][dobres-2017]); and dark mode raised cognitive load "for
  older adults in a bright environment" ([Sethi and Ziat, 2023][sethi-2023]).
- **But not for everyone.** Legge notes that "a subset of people with low vision
  read 10% to 50% faster with bright letters on a black background", often from
  light scatter such as cataract ([Legge, 2016][legge-2016]); in one survey, 46%
  of 133 low-vision adults preferred reversed contrast and 39% black on white
  ([Wu et al., 2020][wu-2020]).
- **Glare.** "The brighter the display, the less the contrast will be diluted by
  glare sources" ([Legge, 2016][legge-2016]); the iPhone 11 reaches "625 nits
  max brightness (typical)" ([Apple][iphone11-specs]) and the iPhone 17 "3000
  nits peak brightness (outdoor)" ([Apple][iphone17-specs]).
- **Apple's rules.** People "generally expect all apps and games to respect
  their preference" for Dark Mode, "Avoid offering an app-specific appearance
  setting", and custom colors should "strive for a contrast ratio of 7:1,
  especially in small text" ([HIG][hig-dark]); iOS 27 adds per-app "color, text
  size, and motion settings" ([Apple][ug-per-app]).
- Synthesis: follow the system appearance and iOS's display settings instead of
  an in-app theme, since no one polarity suits every low-vision reader; design
  the light appearance as the reference, aim for 7:1 on phrase text, above
  [A11Y-7][prd-a11y]'s 4.5:1, put solid backgrounds behind text, and never carry
  state in a faint tint that sunlight washes out.

[piepenbrock-2013]: https://pubmed.ncbi.nlm.nih.gov/23654206/
[piepenbrock-2014]: https://pubmed.ncbi.nlm.nih.gov/25141597/
[sethi-2023]: https://pubmed.ncbi.nlm.nih.gov/36533999/
[legge-2016]: https://pmc.ncbi.nlm.nih.gov/articles/PMC5726769/
[wu-2020]: https://pmc.ncbi.nlm.nih.gov/articles/PMC7172011/
[ug-per-app]: https://support.apple.com/guide/iphone/customize-per-app-visual-settings-iph1f48544ab/27/ios/27

## Targets, touch, and mounting

The [AAC practice notes][aac-targets] hold the minimum sizes; this section adds
what motor-impairment studies found. Converting millimeters to points assumes
the iPhone 11's "326 ppi" screen draws two pixels per point and the iPhone 17's
"460 ppi" screen three ([iPhone 11][iphone11-specs]; [iPhone
17][iphone17-specs]), the two scale factors Apple lists for iOS
([HIG][hig-images]); so 12 mm is 77 or 72 points, 18 mm is 116 or 109, and
[A11Y-1][prd-a11y]'s 64 points is 10.0 to 10.6 mm.

[aac-targets]: /docs/research/aac-practice.md#minimum-target-sizes
[hig-images]: https://developer.apple.com/design/human-interface-guidelines/images

### Target size and spacing for tremor and weakness

- **At least 18 mm.** For 16 adults with upper-body motor impairments, tapping
  brought "a three-fold increase in pointing (tapping) errors" over a mouse, and
  their error rate fell from 42.1% at 6 mm to 7.0% at 18 mm; the authors raise
  the minimum "to at least 18mm", and spurious touches came in 21.3% of dragging
  trials ([Findlater et al., 2017][findlater-2017]). The iPad lay flat on a
  table.
- **12 mm as a compromise.** Fifteen tetraplegic users gave "12 mm as an
  approximate suitable value", though error "is still high (20%)", and were
  "more accurate and precise acquiring targets closer to their arm support
  point" ([Guerreiro et al., 2010][guerreiro-2010]).
- **Older adults and kiosks.** Older adults with poor dexterity need buttons "at
  least 19.05 mm" with gaps of "6.35 mm to 12.7 mm", and zero spacing "was
  associated with the lowest accuracy" ([Jin et al., 2007][jin-2007]); people
  with motor-control disabilities kept improving up to 30 mm, while a gap of 1
  or 3 mm "did not affect user performance" ([Chen et al., 2013][chen-2013]);
  able-bodied thumbs need about 9.2 mm ([Parhi et al., 2006][parhi-2006]); and
  Apple asks for "about 12 points of padding around elements that include a
  bezel" ([HIG][hig-a11y]).
- **Tremor at home.** Over four weeks, a phone's recognizer "misinterpreted
  almost one in five interactions" by people with tremor, and behavior varied
  "dramatically and erratically between sessions" ([Montague et al.,
  2014][montague-2014]); older adults erred about 26% of the time on a hand-held
  phone and about 17% on a tablet resting on a table, and "keys should be wider
  instead of taller" ([Nicolau and Jorge, 2012][nicolau-jorge-2012]).
- Synthesis: set the row's slots, the strip, and Yes, No, and Not sure at 12 mm,
  about 72 to 77 points, on the short side, toward 18 mm where the layout
  allows, wider than tall, with visible edges and about 12 points between them.
  On a 402-point-wide iPhone 17, 16-point margins and 12-point gaps leave three
  slots of about 115 points, or 19 mm, across, so six slots fit as two rows of
  three; a larger-button setting would show three slots rather than shrink six.

[hig-a11y]: https://developer.apple.com/design/human-interface-guidelines/accessibility
[montague-2014]: https://doi.org/10.1145/2661334.2661362

### Touch settings in iOS 27

- **Touch Accommodations.** With Hold Duration "taps and swipes within the
  duration are ignored", with Use Final Touch Location "iPhone registers the tap
  where you lift your finger", and iOS 27's guided setup ends with "a
  personalized list of Touch Accommodations" ([Apple][ug-touch]); the settings
  allow "more than 1 million possible configurations", and automatic tuning
  raised motor-impaired users' touch success by 20.2% ([Peng et al.,
  2019][peng-2019]).
- **Slow taps in React Native.** In React Native 0.86.3, a press held past the
  500 ms long-press delay still fires `onPress` unless the component also has
  `onLongPress` ([source][rn-pressability]), so a slow, heavy tap on a phrase
  still speaks; elsewhere "an overly slow tap can be recognized as a “hold”
  operation" ([Kobayashi et al., 2011][kobayashi-2011]).
- **Guided Access.** A caregiver can "Circle any areas of the screen you want to
  disable", but "Crash Detection and Emergency Services aren't available while
  using Guided Access" ([Apple][ug-guided]).
- Synthesis: don't rebuild Hold Duration or Ignore Repeat inside Turn, as Grid
  for iPad doesn't; test with each on, point caregivers to the guided setup, and
  keep long presses off phrases.

[ug-touch]: https://support.apple.com/guide/iphone/adjust-how-iphone-responds-to-your-touch-iph77bcdd132/27/ios/27
[peng-2019]: https://doi.org/10.1145/3290605.3300913
[rn-pressability]: https://github.com/react/react-native/blob/v0.86.3/packages/react-native/Libraries/Pressability/Pressability.js
[ug-guided]: https://support.apple.com/guide/iphone/lock-iphone-to-one-app-iph7fad0d10/27/ios/27

### Guards against accidental activation

- **Settings and thresholds.** Proloquo2Go's Hold Duration "can be helpful for
  users with hand tremors who may accidentally brush buttons", and its Select on
  Release "does disable swiping up or down pages", so paging buttons are needed
  ([AssistiveWare][p2g-accidental]). Older adults made "bounce errors, which
  occurred when a key was unintentionally pressed more than once"; the best
  threshold per person "varied from 25ms to 1000ms" on a phone, where personal
  thresholds cut the error rate "6.8%" against "0.8%" for one 100 ms threshold
  ([Nicolau and Jorge, 2012][nicolau-jorge-2012]).
- **Keyguards.** A keyguard makes "a barrier between buttons to improve motor
  accuracy", though "Too thick and it may make activating a button more
  difficult" ([NWACS, May 28, 2021][nwacs-keyguards]); the only indexed study,
  of one child on a physical keyboard, found accuracy rose and speed fell
  ([McCormack, 1990][mccormack-1990]).
- Synthesis: act on release, as the [AAC practice notes][aac-wcag] already
  require, and leave repeat filtering to Ignore Repeat, which each user tunes,
  since one fixed threshold helped little. SPEAK-2 lets a tap on another phrase
  cut off the one being spoken; an optional "finish speaking first" setting like
  TouchChat's, and a speaking phrase that ignores a second tap as Predictable's
  non-stop speak does, would keep a tremor's bounce from cutting off a reply.
  The strip and the row's slots never move, so they're the part of Turn a
  keyguard could cover.

[p2g-accidental]: https://www.assistiveware.com/support/proloquo2go/alternative-access/access-method
[nwacs-keyguards]: https://nwacs.info/blog/2021/5/keyguards-improve-activation-accuracy
[mccormack-1990]: https://pubmed.ncbi.nlm.nih.gov/2330961/
[aac-wcag]: /docs/research/aac-practice.md#wcag-22-in-a-native-app

### One-handed use and where controls sit

- **One hand is common.** "74% used one hand to dial", "45% of participants
  stated they use one hand for nearly all device interactions", and "mid-device
  regions are easiest to access" ([Karlson et al., 2006][karlson-2006]); thumb
  users "were at most ease interacting in the center of the device" ([Parhi et
  al., 2006][parhi-2006]); and "the thumb could not have reached the opposite
  upper corner" ([Bergstrom-Lehtovirta and Oulasvirta, 2014][bergstrom-2014]).
- **Apple's order.** Apple says to "place the most important items near the top
  and leading side of the window or display" ([HIG][hig-layout]), and apps
  should "allow the system gestures to take precedence" at the screen's edges
  ([Apple][edges]).
- Synthesis: keep speech controls in the middle band, away from the top corners
  and the bottom edge, where the Home and Reachability swipes live. The strip
  and the row can stay above the grid, as the PRD and the [TRD's focus
  order][trd-a11y] need, if the stack starts below the navigation area; that
  departs from Apple's top-first rule, so test reach one-handed on a 6.3-inch
  phone.

[karlson-2006]: http://www.cs.umd.edu/hcil/trs/2006-02/2006-02.pdf
[edges]: https://developer.apple.com/documentation/uikit/uiviewcontroller/preferredscreenedgesdeferringsystemgestures
[trd-a11y]: /docs/TRD.md#accessibility-in-the-app

### Mounted phones and wheelchairs

- **Position first.** ASHA lists the "physical positioning of the individual
  relative to their communication partner" and "positioning and access to AAC
  from hospital bed" among AAC concerns ([ASHA][asha-aac]).
- **An ALS clinic's advice.** "Position device at eye level"; "Because the
  device often needs to be in front of the user's face, it can be difficult to
  replicate a friendly conversation. Key clicks can be helpful in alerting
  communication partners that you are typing"; and a power-chair user who kept
  dropping their phone did better with a handlebar mount, the elbow on the
  armrest, and a stylus ([Dellea, 2017][dellea-2017]). Tobii Dynavox describes
  mounts for "your wheelchair, lying in bed, or sitting in your favorite
  recliner" ([training cards][tdsnap-cards]).
- Synthesis: a mounted phone faces the user, so a partner beside a wheelchair
  may see only its back. The light and the consent card must read at arm's
  length, the loudspeaker and the strip's "Wait, I'm typing" carry what the
  partner can't see, and nothing in Turn should depend on holding the phone.

[asha-aac]: https://www.asha.org/practice-portal/professional-issues/augmentative-and-alternative-communication/
[dellea-2017]: https://www.hdc.lsuhsc.edu/docs/positioning%20and%20mounting%206.7.17.pdf
[tdsnap-cards]: https://download-tobiidynavox-com.s3.amazonaws.com/Software/TD_Snap/TobiiDynavox_Snap_Text_TrainingCards_en_US.pdf

## The partner's view

The [AAC practice notes][aac-listen] hold Apple's indicator rule and early
bystander studies; this section adds displays for the partner, indicator
research, and consent notices.

### Displays that face the partner

- **Dual screens.** On the Lightwriter SL40 Connect, "Anything you type will
  appear in the top half of the screen, and also on the out-facing partner
  display for your communication partners to read", a second conversation keeps
  text off that display, and the user chooses "how many lines of text you would
  like to show on the partner display" ([user guide][lightwriter-guide]).
  Jabbla's Allora 3 has "a high-contrast partner display" for noise, privacy,
  and groups ([Jabbla][allora3]), and Tobii Dynavox's Partner Window "will
  mirror the message window", and "For privacy, the user can toggle the partner
  window on/off" ([manual][iseries-manual]).
- **Apple's own pattern.** In Translate, "In the face-to-face view, each person
  can see the conversation from their own side" ([Apple][ug-translate]).
- Synthesis: an iPhone has no rear screen, so Turn's partner display is the one
  the apps already use, a Show view of the last spoken phrase, large and flipped
  with a tap, which also helps in noise and with partners who struggle with
  synthetic speech.

[allora3]: https://www.jabbla.com/en/devices/allora-3-2/
[iseries-manual]: https://download.mytobiidynavox.com/I-Series/documents/I-Series_User_manual/TD%20I-Series%20I-13%20and%20I-16/TD_I-Series%20I-13_I-16_UsersManual_en-US_1000280.pdf
[ug-translate]: https://support.apple.com/guide/iphone/translate-in-person-conversations-n4pjjxr31uel/27/ios/27

### Research on what partners should see

- **Status beats lights.** An awareness-display study with people with ALS and
  their partners covered cues for "listening, talking, typing, saying “Hold on,”
  and asking “Pardon me?”"; a colored LED cluster was rated "significantly less
  helpful" and "significantly less understandable" than text or emoji, and a
  close partner said a typing cue would help "people that get uncomfortable
  waiting for a response" ([Sobel et al., 2017][sobel-2017]).
- **Eye contact.** A partner felt "a tradeoff, of making eye contact vs. looking
  at the screen" ([Sobel et al., 2017][sobel-2017]), and in a later study a
  speech-language pathologist advised "look at the user and not the device"
  ([Weinberg, O'Connor, et al., 2025][weinberg-mmhmm]).
- **Who sees typing.** In AACrobat's survey, "half of the partners describe
  looking over the AAC user's shoulder", which one user called "not socially
  acceptable", and the app defaulted "“Work” and “Other” to block-by-block",
  text shown only once spoken ([Fiannaca et al., 2017][aacrobat-2017]); one user
  accepted a partner reading their display in a noisy church, "I would rather be
  understood than them hearing me" ([Valencia et al., 2020][valencia-2020], read
  in [the first author's dissertation][valencia-thesis]). Partners were "unsure
  whether to wait for a response or continue the conversation" ([Kane et al.,
  2017][kane-2017]).
- Synthesis: the partner should see the phrase once it's spoken, never the row
  before the tap and not typing as it happens; while the user composes, partners
  want a signal, which the strip's "Wait, I'm typing" gives with one tap. Show
  should close again, since a screen held up to the partner takes their eyes off
  the user.

[weinberg-mmhmm]: https://arxiv.org/abs/2506.17890
[valencia-2020]: https://doi.org/10.1145/3313831.3376376
[valencia-thesis]: https://kilthub.cmu.edu/articles/thesis/Agency_in_Augmentative_and_Alternative_Communication_AAC_/25135136

### Showing a bystander that a device listens

- **Big beats small.** A webcam's light was noticed by 45% of people during
  computer tasks and "only 5%" during paper tasks, and "adding onscreen glyphs"
  raised this to "93% and 59%"; the glyph appeared full screen, blinked, and
  shrank to a corner, and "without understanding, the indicator is useless"
  ([Portnoff et al., 2015][portnoff-2015]).
- **Lights aren't trusted for off.** Status lights on body-worn cameras "lack
  noticeability, understandability, security and trustworthiness", and designers
  should "First notify and make both, user and bystander aware of the situation,
  then ask for consent" ([Koelle et al., 2018][koelle-2018]); bystanders "may
  worry the camera could still be recording with the LED off" ([Ahmad et al.,
  2020][ahmad-2020]); camera-glasses wearers found their light "too faint for
  sunny conditions" ([Bhardwaj et al., 2024][bhardwaj-2024]); and smart-home
  guests mostly wanted to be told "verbally by the owner (N=123)" ([Marky et
  al., 2022][marky-2022]).
- **Colors disagree.** On iPhone, "An orange indicator means the microphone is
  being used by an app" ([Apple][apple-indicators]); on Google's speakers, "When
  the mic is off, the light ring glows orange" ([Google][google-lights]); and on
  Echo speakers, a muted microphone is "Solid red" ([Amazon][echo-lights]).
- Synthesis: the light should carry the word "Listening" and a microphone symbol
  where the partner can see them, with color only as a third cue; appear large
  when listening starts, then settle into a steady label, with no pulse under
  Reduce Motion, as Rejoin's orb changes brightness instead. Paused needs its
  own visible state, such as a struck-through microphone with "Paused", since a
  light that goes out doesn't convince bystanders and the iPhone's orange dot
  faces only the holder.

[koelle-2018]: https://doi.org/10.1145/3173225.3173234
[ahmad-2020]: https://doi.org/10.1145/3415187
[bhardwaj-2024]: https://doi.org/10.1145/3613904.3642242
[marky-2022]: https://doi.org/10.56553/popets-2022-0115
[apple-indicators]: https://support.apple.com/en-us/108331
[google-lights]: https://support.google.com/googlehome/answer/7073219?hl=en
[echo-lights]: https://developer.amazon.com/en-US/alexa/branding/echo-guidelines/identity-guidelines/light-ring

### Consent notices people read

- **Short layers and habit.** Notices should reach "incidental users, such as
  bystanders", audio recording calls for "just-in-time notices", "the smallest
  notice" should capture "the main aspects of the data practice", and after
  repeated notices "the content of a warning literally does not register
  anymore" ([Schaub et al., 2015][schaub-2015]); in a field study with over
  80,000 visitors, "nudging has a large effect on the choices users make" ([Utz
  et al., 2019][utz-2019]).
- **Key information first.** US research consent "must begin with a concise and
  focused presentation of the key information" ([45 CFR 46.116][cfr-46-116]),
  which fits Turn's card by analogy, and CDC's index asks "Is the main message
  at the top, beginning, or front of the material?" ([CDC][cdc-cci]).
- **Talk, and type size.** Talking one-on-one "appears to be the most effective
  available way of improving research participants' understanding" ([Flory and
  Emanuel, 2004][flory-2004]); UK guidance defines large print as "a point size
  of 16 and above" but warns "No single point size is suitable for everyone"
  ([GOV.UK][gov-uk-formats]); and consent guidelines ask writers to avoid
  "talking down" and "childish pictures" ([Beck et al., 2025][beck-2025]).
- Synthesis: the card should lead with one plain message in the partner's words,
  then the facts [CONSENT-4][prd-consent] lists, one to a sentence, then "They
  agreed" and "They said no" at equal weight, with detail behind a link. Since
  talking works best and guests want to be told by the owner, a button that has
  Turn read the card aloud on the user's tap fits both findings and the rule
  that nothing speaks without a tap; CONSENT-5's resume without the card guards
  against habituation.

[schaub-2015]: https://www.usenix.org/conference/soups2015/proceedings/presentation/schaub
[utz-2019]: https://doi.org/10.1145/3319535.3354212
[cfr-46-116]: https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-A/part-46/subpart-A/section-46.116
[cdc-cci]: https://www.cdc.gov/ccindex/pdf/full-index-score-sheet.pdf
[flory-2004]: https://doi.org/10.1001/jama.292.13.1593
[gov-uk-formats]: https://www.gov.uk/government/publications/inclusive-communication/accessible-communication-formats
[beck-2025]: https://pmc.ncbi.nlm.nih.gov/articles/PMC12448064/
[prd-consent]: /docs/PRD.md#permission-and-consent

## Dignity and aesthetics

### Social acceptability and stigma

- **Mainstream looks draw less attention.** In 20 interviews, "Smaller devices
  and those that looked like mainstream counterparts attracted the least
  attention", and the one AAC user said the device let others "see I can
  communicate like any person" ([Shinohara and Wobbrock, 2011][shinohara-2011]);
  in a diary study, "functional breakdowns (and sometimes the mere presence) of
  ATs elicited breakdowns in social interactions" ([Shinohara and Wobbrock,
  2016][shinohara-2016]).
- **Age and symbolism.** Technology aimed at older people carries "stigmatizing
  symbolism" ([Yusif et al., 2016][yusif-2016]), tablet AAC can be "visually
  identifiable – perpetuating public stigmas" ([Curtis et al.,
  2024][curtis-2024]), and yet observers found head-mounted displays more
  acceptable "if the device was being used to support a person with a
  disability" ([Profita et al., 2016][profita-2016]).
- Synthesis: Turn should look like an ordinary iOS app, in iOS's own type and
  controls, with no symbols, mascots, or clinical icons, and it should fail
  quietly, since a breakdown in public is a social failure.

[shinohara-2011]: https://doi.org/10.1145/1978942.1979044
[shinohara-2016]: https://doi.org/10.1145/2827857
[yusif-2016]: https://doi.org/10.1016/j.ijmedinf.2016.07.004
[profita-2016]: https://doi.org/10.1145/2858036.2858130

### Identity and tone

- **Interaction design is missing.** Pullin and colleagues write that
  "interaction design is still conspicuous by its absence in most AAC design",
  and delays "contribute to presumptions of incompetence, stigma, and social
  isolation" ([Pullin et al., 2017][pullin-2017]).
- **Identity first.** A 2025 agenda puts "strengthen the expression of personal
  identity" first and reports adults who need AAC naming the need to be spoken
  to "as an adult (93%)" and "to give the time needed for communication (88%)"
  ([McNaughton et al., 2025][mcnaughton-2025], reporting [Collier et al.,
  2012][collier-2012]); with ALS, store clerks "would often be rude or
  impatient" ([Kane et al., 2017][kane-2017]).
- **Makers' tone.** AssistiveWare says "the AAC user can develop a sense of
  ownership by participating in personalizing their AAC system"
  ([AssistiveWare][aw-personalize]), and Proloquo4Text's page opens with "Not
  being able to speak isn't the same as having nothing to say."
  ([AssistiveWare][p4t-product]).
- Synthesis: write plain, calm, adult copy with no exclamation marks,
  celebrations, streaks, or pity; treat the strip's floorholder and "Please give
  me time" as dignity features; and have the paywall say that speech stays free,
  since reviewers call paid speech "repugnant" (see [What users
  criticize](#what-users-criticize)).

[pullin-2017]: https://doi.org/10.1080/07434618.2017.1342690
[mcnaughton-2025]: https://pmc.ncbi.nlm.nih.gov/articles/PMC13077306/
[collier-2012]: https://pubmed.ncbi.nlm.nih.gov/23148525/
[aw-personalize]: https://www.assistiveware.com/learn-aac/personalize-vocabulary-and-system
[p4t-product]: https://www.assistiveware.com/products/proloquo4text

### What users criticize

Secondary evidence: a sample of App Store reviews from Apple's anonymous review
feed and posts on the ALS Forums, read on September 23, 2026; Reddit returned a
login page and a 403. No reviewer is named.

- **Clutter, size, and sameness.** A Proloquo4Text user says "I get overwhelmed
  by visual clutter" (September 27, 2023; [listing][p4t-listing]); for an
  intubated patient, "The text is so tiny that even someone with perfect vision
  would struggle" (Speech Assistant AAC, June 28, 2026; [listing][sa-listing]);
  and an adult reviewer of Spoken finds "Everything is the same black and white,
  in the same font" (July 5, 2024; [listing][spoken-listing]), while a Vocable
  reviewer says "App colors are very bright and can give me a headache" (2022;
  [listing][voc-listing]).
- **Change and money.** After Predictable 8, "it changed by layout and it won't
  let me change it back", and the reviewer took "a white board and marker" to a
  cancer appointment (July 17, 2026; [listing][pred-listing]); paying for speech
  is "repugnant" (Spoken, July 5, 2024); and a forum member with ALS chose an
  app because "it is geared for adults" (November 20, 2013; [ALS
  Forums][als-forum-ipads]).
- Synthesis: large, uncluttered defaults matter more than options, since an
  exhausted person can't customize; a quiet category tint can tell phrases apart
  without the bright palettes some find painful; and a new look must never move
  anything the user has learned.

[als-forum-ipads]: https://www.alsforums.com/community/threads/als-and-ipads-for-communication.24126/

## Showing suggestions and doubt

The [AAC practice notes][aac-own-words] cover what AAC users say about AI
suggestions; this section covers how to display them and the system's doubt.

[aac-own-words]: /docs/research/aac-practice.md#speaking-in-their-own-words

### How mainstream products mark suggestions

- **Place and gray.** In iOS 27, "predictions that complete the word or phrase
  you're typing appear inline in gray text", and the user's own word stays in
  the strip above the keyboard "as the option in quotation marks"
  ([Apple][ug-predictive]); Gmail's Smart Compose shows "only the top suggestion
  to users only when the model is 'confident' enough", in lighter gray ([Chen et
  al., 2019][chen-2019]).
- **Smart Reply.** It "always presents 3 suggestions"; of those used, "45% were
  from the 1st position, 35% from the 2nd position and 20% from the 3rd
  position"; it keeps a negative option "to give the user a real choice"; and it
  appeared on 11% of messages, since it must "figure out cases where the
  response is not expected" ([Kannan et al., 2016][kannan-2016]).
- **What partners infer.** In 219 pairs, "The more participants thought their
  partner used smart replies, the less cooperative they rated them", "even if
  they are not actually using smart replies" ([Hohenstein et al.,
  2023][hohenstein-2023]), and "An AI-assisted apology makes the sender appear
  less warm than if they had written it themselves" (preprint; [Khadpe et al.,
  2025][khadpe-2025]); in another study smart replies raised trust and served as
  "a moral crumple zone" when things went wrong ([Hohenstein and Jung,
  2020][hohenstein-jung-2020]).
- Synthesis: no AAC study compared ways of marking suggestions, and the twelve
  apps separate them by place or by named tool. The row's band carries the
  difference, not each phrase: its buttons can look like the grid's, since the
  words are the user's own, with no sparkle or AI badge; the permission step and
  the consent card say where Jev acts; and nothing about the row faces the
  partner, which extends the [AAC practice notes][aac-authorship] on "the device
  did that for you".

[ug-predictive]: https://support.apple.com/guide/iphone/use-predictive-text-iphd4ea90231/27/ios/27
[chen-2019]: https://doi.org/10.1145/3292500.3330723
[hohenstein-2023]: https://doi.org/10.1038/s41598-023-30938-9
[khadpe-2025]: https://arxiv.org/abs/2509.09645
[hohenstein-jung-2020]: https://doi.org/10.1016/j.chb.2019.106190
[aac-authorship]: /docs/research/aac-practice.md#authorship-and-how-partners-see-suggestions

### Whether to show confidence

- **Apple.** "If you're not sure how your confidence values correlate with the
  quality of your results, it's not a good idea to convey confidence to people";
  "consider ranking or ordering the results in a way that implies confidence
  levels"; "set a confidence threshold below which you don't offer results"; and
  "Be especially careful to avoid mistakes in proactive features" ([HIG, machine
  learning][hig-ml]). The generative AI page adds "Clearly identify when and
  where you use AI" ([HIG, generative AI][hig-genai]).
- **Google and Microsoft.** "Numeric confidence indicators are risky", while
  showing several options "can be especially useful in low-confidence
  situations" ([PAIR][pair-trust]); Microsoft's guidelines, from [Amershi et
  al., 2019][amershi-2019], ask systems to "gracefully degrade the AI system's
  services when uncertain about a user's goals" ([HAX G10][hax-g10]).
- **Research.** A confidence score "can help calibrate people's trust" but
  "trust calibration alone is not sufficient" ([Zhang et al.,
  2020][zhang-2020]); stated and observed accuracy moved reliance more than
  per-item confidence ([Rechkemmer and Yin, 2022][rechkemmer-2022]); a short
  statement of accuracy before use raised acceptance of an imperfect AI
  ([Kocielnik et al., 2019][kocielnik-2019]); and among 23 adults aged 65 to 78,
  phrases like "I am 92% confident..." "were often met with skepticism and
  confusion" ([Mathur et al., 2026][mathur-2026]).
- Synthesis: the row's three states are the categorical and several-option
  displays these guides recommend, and slot order implies the rest; show no
  percentages, never hedge the user's own words, and state the evaluation's
  accuracy once, in plain words, in Settings or onboarding.

[hig-genai]: https://developer.apple.com/design/human-interface-guidelines/generative-ai
[amershi-2019]: https://doi.org/10.1145/3290605.3300233
[hax-g10]: https://www.microsoft.com/en-us/haxtoolkit/guideline/scope-services-when-in-doubt/
[rechkemmer-2022]: https://doi.org/10.1145/3491102.3501967
[kocielnik-2019]: https://doi.org/10.1145/3290605.3300641

### Stale rows, empty rows, and targets that move

- **Empty is normal.** Smart Reply and Smart Compose show nothing below their
  thresholds, Apple says to "Suggest alternative ways to accomplish the goal
  instead of showing no results" ([HIG, machine learning][hig-ml]), Vocable
  points to the keyboard (see [Vocable AAC](#vocable-aac)), and offline, "Rejoin
  shows your most-used phrases instead" ([support][rejoin-support]).
- **Old data with its age.** For widgets, Apple suggests "displaying text that
  describes when the data was last updated" and showing content "without hiding
  stale data behind placeholder content" ([HIG, widgets][hig-widgets]).
- **Moving targets.** Layout shifts can make people "click the wrong link or
  button" ([web.dev][cls]); PAIR advises "designating a specific area of the
  interface for less-predictable AI output" ([PAIR][pair-errors]); and
  highlighting predicted menu items in color "was not found to be faster than
  static menus even at a high level of adaptive accuracy" ([Findlater et al.,
  2009][findlater-2009]).
- Synthesis: keep the row's phrases at full contrast and say in the caption area
  which partner line they answer, such as "Still answering: How was physio?",
  rather than dimming them; never swap a slot's phrase while it's pressed, and
  replace a phrase in place with a crossfade that Reduce Motion turns off. The
  category tab that [ROW-9][prd-row] marks needs a shape or text change as well
  as color.

[hig-widgets]: https://developer.apple.com/design/human-interface-guidelines/widgets
[cls]: https://web.dev/articles/cls
[pair-errors]: https://pair.withgoogle.com/chapter/errors-failing/
[findlater-2009]: https://doi.org/10.1145/1518701.1518956
[prd-row]: /docs/PRD.md#the-reply-row

### What prediction displays cost

- **Prediction can slow people down.** "Use of word prediction significantly
  decreased text generation rate for the spinal cord injured (SCI) subjects", as
  its "cognitive cost" "largely overwhelmed the benefit provided by keystroke
  savings" ([Koester and Levine, 1996][koester-1996]); yet "Seven participants
  had their fastest typing speed with word prediction" on on-screen keyboards
  ([Anson et al., 2006][anson-2006]), and a more accurate predictor was used
  more, "93.6% utilization for advanced versus 78.2% for basic" ([Trnka et al.,
  2009][trnka-2009]).
- **Each option costs time.** In one study, "longer suggestion lists resulted in
  longer search & selection times", about 2.4 seconds for one phrase suggestion,
  4.0 for three, and 5.5 for six ([Buschek et al., 2021][buschek-2021]); in
  SpeakFaster, "selecting phrases eight words or longer took more than twice as
  long" as phrases of two words or fewer ([Cai et al., 2024][cai-2024]); and "As
  a user becomes fatigued, they may increasingly accept such bigger predictions"
  (preprint; [Frisch et al., 2026][frisch-2026]).
- Synthesis: fill slots in order from the first, show only phrases above the
  floor so the row often holds two or three, prefer different intents to
  near-duplicates, and put each phrase's key words first; accuracy pays twice,
  since people use an accurate row more.

[koester-1996]: https://doi.org/10.1080/07434619612331277608
[anson-2006]: https://doi.org/10.1080/10400435.2006.10131913
[trnka-2009]: https://doi.org/10.1145/1497302.1497307
[buschek-2021]: https://doi.org/10.1145/3411764.3445372
[cai-2024]: https://pmc.ncbi.nlm.nih.gov/articles/PMC11530652/
[frisch-2026]: https://arxiv.org/abs/2606.24854

## Conflicts between sources

- **Background color.** It slowed or didn't help preschoolers ([Thistle and
  Wilkinson, 2009][thistle-2009]) but sped adults with Down syndrome ([Wilkinson
  et al., 2022][wilkinson-2022]) and adults without disabilities in large arrays
  ([Thistle, 2019][thistle-2019]); Light et al. describe that study's arrays as
  "large arrays containing 64 symbols" ([Light et al., 2019][light-2019]), while
  its abstract describes 60.
- **Polarity and room light.** The positive-polarity advantage "was independent
  of ambient lighting" ([Buchner and Baumgartner, 2007][buchner-2007]), but in
  glance reading white on black suffered only in the dark ([Dobres et al.,
  2017][dobres-2017]).
- **Themes.** Apple says "Avoid offering an app-specific appearance setting"
  ([HIG][hig-dark]), while AAC apps ship their own themes and WCAG 1.4.8 asks
  that colors "can be selected by the user" ([WCAG 2.2][wcag22]); iOS 27's
  per-app settings may reconcile them.
- **Target size.** Recommendations run from 9.2 mm ([Parhi et al.,
  2006][parhi-2006]) through 12 mm ([Guerreiro et al., 2010][guerreiro-2010]) to
  at least 18 mm ([Findlater et al., 2017][findlater-2017]) and 19.05 mm ([Jin
  et al., 2007][jin-2007]); Findlater et al. call 12 mm's error rates of over
  20% "likely unacceptably high for real use", and gaps mattered for older
  adults but not in a kiosk study ([Jin et al., 2007][jin-2007]; [Chen et al.,
  2013][chen-2013]).
- **Where important controls go.** Apple puts the most important items "near the
  top" ([HIG][hig-layout]), while thumb-reach and arm-support studies favor the
  middle and bottom ([Bergstrom-Lehtovirta and Oulasvirta,
  2014][bergstrom-2014]; [Guerreiro et al., 2010][guerreiro-2010]).
- **Subtle or conspicuous.** Sobel et al. suggest partner cues "less bright,
  smaller, and in a more peripheral location" ([Sobel et al.,
  2017][sobel-2017]), while small lights went unnoticed ([Portnoff et al.,
  2015][portnoff-2015]); and AAC researchers pursue discreet devices to avoid
  stigma ([Curtis et al., 2024][curtis-2024]), while Apple's rule and bystander
  research require visible listening ([AAC practice notes][aac-listen]).
- **Live typing.** The Lightwriter shows text to the partner as it's typed by
  default ([user guide][lightwriter-guide]), while AAC users limited that to
  close partners ([Fiannaca et al., 2017][aacrobat-2017]).
- **Borderline suggestions.** Smart Reply's authors would "slightly
  over-trigger" ([Kannan et al., 2016][kannan-2016]), while Apple sets a
  threshold below which nothing shows ([HIG, machine learning][hig-ml]) and
  listeners rated partly relevant AAC messages lowest ([AAC practice
  notes][aac-fail]).
- **Numbers.** Confidence scores helped calibrate trust ([Zhang et al.,
  2020][zhang-2020]), while PAIR calls numbers risky ([PAIR][pair-trust]) and
  older adults distrusted them ([Mathur et al., 2026][mathur-2026]).
- **Rejoin's own pages.** The accessibility page says "Switch scanning and
  eye-gaze layouts are on our roadmap", while the ALS page says "It is designed
  for switch control, dwell and eye-gaze" ([accessibility][rejoin-a11y]; [ALS
  page][rejoin-als]); and "The first AI-based AAC app"
  ([listing][rejoin-listing]) came after Vocable's GPT answers of September 18,
  2023 ([listing][voc-listing]).

[aac-fail]: /docs/research/aac-practice.md#why-prestored-phrase-systems-work-or-fail
[rejoin-als]: https://rejoinvoice.com/aac-for-als

## Gaps

What the sources read don't say, as of September 23, 2026:

- **Text displays and Turn's users.** No study tested color, grid size, spacing,
  or layout on text-only phrase displays with literate adults who use AAC, short
  labels that wrap inside buttons, Atkinson Hyperlegible, dark mode or glare
  with users who have ALS, MS, or stroke, target sizes with people with ALS, or
  phones in mounts.
- **Accidental activation.** No study of accidental activation in touch AAC or
  of keyguards on phones; whether iOS Touch Accommodations delay React Native's
  `Pressable` needs a test on a phone.
- **The partner.** No study compares partners seeing text as it's typed with
  seeing it once spoken, tests a partner consent card, or tests how a partner
  notices an AAC app's listening light; indicator studies concern webcams,
  speakers, and camera glasses.
- **Tone and suggestions.** No study asks adults with acquired speech loss how
  an AAC app should look or sound, or tests marking suggestions, confidence,
  stale suggestions, or wrong taps when a list changes just before a tap with
  AAC users.
- **Abstracts only.** The color-cue studies by Thistle and Wilkinson, Petroi et
  al., the polarity studies, Koester and Levine, Trnka et al., Anson et al.,
  Profita et al., Curtis et al., and Flory and Emanuel were read as abstracts.
- **Blocked pages and other routes.** ACM's Digital Library, Taylor & Francis,
  ASHA's journals, ScienceDirect, the Journal of Vision, and IEEE Xplore
  returned bot checks or 403s, so authors' copies, PubMed Central, arXiv, a
  dissertation, and abstracts from Europe PMC, OpenAlex, and Semantic Scholar
  were read instead. CoughDrop's help center was read through Zendesk's public
  API; the MIT Press page for Pullin's Design Meets Disability, Disability
  Studies Quarterly, Reddit, and the British Dyslexia Association's 2023 style
  guide stayed blocked; and the Braille Institute's font download asks for an
  email address, so it wasn't used. The session's web searches ran out, so a
  last search for studies of phone microphone indicators wasn't run.

## See also

- [DESIGN.md](/docs/DESIGN.md): Turn's design system and art direction, which
  this note feeds.
- [AAC practice notes][aac-notes]: fixed positions, prestored phrases, AI
  suggestions and authorship, access features, target sizes, Live Speech, and
  ethics.
- [Evidence notes][ev-rivals]: Turn's rival apps, prices, and ratings.
- [PRD](/docs/PRD.md): the functional and [accessibility][prd-a11y] requirements
  this note tests.
- [TRD](/docs/TRD.md#the-iphone-app): the iPhone app's screens and
  accessibility.
- [iOS design notes](/docs/research/turn-ios-design.md), [frontend trends
  notes](/docs/research/turn-frontend-trends.md), and [motionsites.ai
  notes](/docs/research/turn-motionsites.md): the sibling notes for DESIGN.md,
  written on September 23, 2026.

[aac-notes]: /docs/research/aac-practice.md
[ev-rivals]: /docs/research/next-gen-evidence.md#turn-rival-apps
[p4t-listing]: https://apps.apple.com/us/app/proloquo4text-aac/id751646884
[pred-listing]: https://apps.apple.com/us/app/predictable/id404445007
[spoken-listing]: https://apps.apple.com/us/app/spoken-tap-to-talk-aac/id1034487817
[tdsnap-manual]: https://download.mytobiidynavox.com/Snap/documents/TD_Snap_UsersManual_en-US.pdf
[sa-listing]: https://apps.apple.com/us/app/speech-assistant-aac/id1139762358
[voc-listing]: https://apps.apple.com/us/app/vocable-aac/id1497040547
[rejoin-listing]: https://apps.apple.com/us/app/rejoin-voice-aac-speech-app/id6779377273
[rejoin-support]: https://rejoinvoice.com/support
[rejoin-a11y]: https://rejoinvoice.com/accessibility
[light-2019]: https://pmc.ncbi.nlm.nih.gov/articles/PMC6436972/
[thistle-2009]: https://pubmed.ncbi.nlm.nih.gov/19332524/
[thistle-2019]: https://doi.org/10.1044/2019_PERSP-19-00017
[wilkinson-2022]: https://pmc.ncbi.nlm.nih.gov/articles/PMC9132148/
[prd-a11y]: /docs/PRD.md#accessibility
[kobayashi-2011]: https://doi.org/10.1007/978-3-642-23774-4_9
[wcag22]: https://www.w3.org/TR/WCAG22/
[buchner-2007]: https://pubmed.ncbi.nlm.nih.gov/17510822/
[dobres-2017]: https://pubmed.ncbi.nlm.nih.gov/28166901/
[iphone11-specs]: https://support.apple.com/en-us/111865
[iphone17-specs]: https://www.apple.com/iphone-17/specs/
[hig-dark]: https://developer.apple.com/design/human-interface-guidelines/dark-mode
[findlater-2017]: https://doi.org/10.1145/3025453.3025603
[guerreiro-2010]: https://doi.org/10.1145/1878803.1878809
[jin-2007]: https://doi.org/10.1007/978-3-540-73279-2_104
[chen-2013]: https://pmc.ncbi.nlm.nih.gov/articles/PMC3572909/
[parhi-2006]: https://doi.org/10.1145/1152215.1152260
[nicolau-jorge-2012]: https://doi.org/10.1145/2384916.2384939
[bergstrom-2014]: https://doi.org/10.1145/2556288.2557354
[hig-layout]: https://developer.apple.com/design/human-interface-guidelines/layout
[aac-listen]: /docs/research/aac-practice.md#partners-and-devices-that-listen
[lightwriter-guide]: https://myturn-prod-attachments.s3-us-west-2.amazonaws.com/6/536/item/1009030/file_attachment/lightwriter_sl40_connect-0E30BE32-ECFF-2BFA-1A1B-17222A7A57FF.pdf
[sobel-2017]: https://doi.org/10.1145/3025453.3025610
[aacrobat-2017]: https://doi.org/10.1145/2998181.2998215
[kane-2017]: https://doi.org/10.1145/2998181.2998284
[portnoff-2015]: https://doi.org/10.1145/2702123.2702164
[curtis-2024]: https://doi.org/10.1145/3663548.3675655
[kannan-2016]: https://doi.org/10.1145/2939672.2939801
[hig-ml]: https://developer.apple.com/design/human-interface-guidelines/machine-learning
[pair-trust]: https://pair.withgoogle.com/chapter/explainability-trust/
[zhang-2020]: https://doi.org/10.1145/3351095.3372852
[mathur-2026]: https://doi.org/10.1145/3772318.3790812

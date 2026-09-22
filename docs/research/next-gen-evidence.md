# Next Gen idea evidence notes

Evidence from primary sources for the five finalists that round 5 of the [Next
Gen ideation log][ideation] checks before a red team attacks the top three:
Turn, Scenekeeper, Bench, Chorus, and Same Boat, in rank order. For each
finalist the notes cover rival apps, overlapping entries in the 2026 Devpost
gallery, evidence that the problem matters, feasibility on a student team's
devices, the Jev jagged edges that would hit it, whether simpler methods could
do Jev's job, and the harm a wrong decision could cause. Every source was read
on September 22, 2026, so prices, rating counts, and gallery counts are as of
that day, and conclusions start with "Synthesis:". The notes build on the [Jev
notes][jev-notes], the [Jev pattern notes][jp-notes], the [technology
notes][tech-notes], the [gallery notes][gallery-notes], and the [Next Gen
notes][ng-notes], and link to them instead of repeating them. They don't pick a
winner.

Contents:

1.  [Method and coverage](#method-and-coverage)
1.  [Key findings](#key-findings)
1.  [What simpler methods offer](#what-simpler-methods-offer)
1.  [Turn, AAC that ranks the user's own phrases](#turn-aac-that-ranks-the-users-own-phrases)
1.  [Scenekeeper, live sound and light for a game master](#scenekeeper-live-sound-and-light-for-a-game-master)
1.  [Bench, a hands-free lab notebook](#bench-a-hands-free-lab-notebook)
1.  [Chorus, group captions for Deaf and hard-of-hearing adults](#chorus-group-captions-for-deaf-and-hard-of-hearing-adults)
1.  [Same Boat, office hours grouped by problem](#same-boat-office-hours-grouped-by-problem)
1.  [Jagged edges compared](#jagged-edges-compared)
1.  [Conflicts between sources](#conflicts-between-sources)
1.  [Gaps](#gaps)

[ideation]: /docs/research/next-gen-ideation.md
[jev-notes]: /docs/research/jev.md
[tech-notes]: /docs/research/next-gen-tech.md
[ng-notes]: /docs/research/next-gen.md

## Method and coverage

- **Rival apps.** App Store apps were found with the iTunes Search API and read
  with its lookup call and the US listing page, which give the seller, the
  price, in-app purchase names and prices, the rating average and count, and the
  release and update dates. Google Play apps were read from their US English
  listing pages, whose structured data gives the developer, the price, and the
  rating average and count; the displayed review count is rounded, as in "269K
  reviews". Tables give averages to two decimal places. Built-in phone features
  are cited to Apple's and Google's own help pages.
- **Gallery.** The live gallery and its search at `/submissions/search?terms=`
  were read with `curl` on September 22, 2026. The gallery's count line read "1
  – 24 of 1148", and it showed "Participants (27022)" ([dv-gallery]), up from
  1,115 projects in the [gallery notes][gallery-notes] and 1,145 in the [Next
  Gen notes][ng-gallery-counts] earlier the same day. A search hit means the
  term appears somewhere in a project's searchable text, including answers that
  aren't public, so the nearest entries' project pages were read too. Phrases
  were searched in double quotes, and each count links to its search.
- **Need and harm.** Statistics come from the agency that publishes them,
  peer-reviewed abstracts from PubMed through NCBI's E-utilities or from the
  publisher's page, and company figures only from the company's own pages.
  Preprints are labeled as such.
- **Platforms.** Apple's facts come from the DocC data behind
  developer.apple.com pages, Apple support pages, and WWDC session pages; Expo's
  from its docs and package source; TypeSafe's from its docs, re-read as
  Markdown on September 22, 2026. The jaggedness page says "Applies to
  `jev-1.13`. Last reviewed 2026-09-17." ([ts-jagged])
- **Division of work.** Five parallel research passes, one per finalist,
  gathered the store listings, statistics, and studies, saving the raw pages;
  the store figures and key quotes here were spot-checked against the live
  listings, the saved pages, and PubMed.
- **Finalist details.** Each finalist's design, question counts, thresholds, and
  purchase are as round 5's brief describes them, which extends [round 2's
  pitches][ideation-r2].

[ideation-r2]: /docs/research/next-gen-ideation.md#round-2-thirty-candidates

## Key findings

Synthesis: each line condenses a section below, where the sources are.

- **Across the five.** Three finalists face a shipping app with the same core
  loop, Rejoin Voice for Turn, Bardy for Scenekeeper, and Hearing Buddy for
  Chorus, and Bench faces Verbex and Lab Laps, which cover its parts. None of
  the five has a close match in the 2026 gallery, and no gallery entry names
  Jev. See each finalist's rival apps.
- **Turn.** Rejoin Voice, released July 12, 2026, listens to the partner and
  offers three tappable replies, with speech free and listening at $12.99 a
  month, the same split Turn plans; its replies are generated, where Turn's are
  the user's own phrases. The need is the best documented of the five (ASHA's 5
  million, 8 to 10 words a minute against 125 to 185). The 240-phrase Choice
  sits at Jev's stated reliability limit, and Personal Voice, by Apple's iOS 27
  guide, needs an iPhone 15 Pro or later, plus a small Swift module under Expo.
  See [Turn](#turn-aac-that-ranks-the-users-own-phrases).
- **Scenekeeper.** Bardy already "listens to your party's conversation and
  automatically adjusts the music and ambiance", by keywords, on Android, with
  voice-triggered effects on its roadmap. Evidence of need is weak, company fan
  counts and a 17-person survey. Research on the same task found keyword rules
  and Naive Bayes at 34% to 64% accuracy and showed that viewers prefer stable
  music to accurate but jumpy music. Flashing bulbs are the real harm, handled
  by a rate cap in code. See
  [Scenekeeper](#scenekeeper-live-sound-and-light-for-a-game-master).
- **Bench.** Verbex records spoken lab notes on the phone, and Lab Laps turns a
  protocol photo into timed steps with Live Activities; none checks a spoken
  value against a tolerance. That check lands on numbers, Jev's best-documented
  weakness, where a published parser beat GPT-3. Boston University's policy bars
  phones and earbuds at the bench when gloves or chemicals are in use, which is
  the demo's setting. See [Bench](#bench-a-hands-free-lab-notebook).
- **Chorus.** Hearing Buddy, a 2026 Apple Design Award finalist, merges several
  phones' microphones into one transcript and taps the user when their name is
  said or a question is asked, with those alerts in its paid tier. Apple's
  Speech framework lists no module that tells speakers apart, and published
  accuracy for addressee and task detection is low: 52% to 56% for the models in
  a 2026 meetings study, against a 47.6% baseline. The name Chorus is taken in
  the gallery. See
  [Chorus](#chorus-group-captions-for-deaf-and-hard-of-hearing-adults).
- **Same Boat.** No store app groups office-hours questions live; university web
  queues group by hand, and Piazza flags duplicate posts by default. Waits of 39
  to 58 minutes at deadlines and cancellation after 49 minutes are measured, and
  plain cosine similarity cut simulated waits by 11%. Students write Jev's
  state, which is its adversarial weak spot, and a TA buying a Course Pass alone
  sits awkwardly with FERPA guidance. See [Same
  Boat](#same-boat-office-hours-grouped-by-problem).
- **Simpler methods.** Apple's on-device model can classify text offline and for
  free but returns no probabilities, and Apple's embeddings run on any iPhone
  from iOS 14; for Same Boat and Turn, embeddings are the standard published
  method, and for Bench's numbers, parsers are. See [What simpler methods
  offer](#what-simpler-methods-offer).

## What simpler methods offer

A round 4 scorer asked whether plain code, keyword rules, text embeddings, or
Apple's on-device model could do Jev's job for several candidates. These facts
apply to all five finalists; each finalist's section adds the evidence for its
own task.

- **Apple's on-device model can classify.** Apple lists "Classify or judge
  text", with the example "Is this text relevant to the topic 'Swift'?", among
  the on-device model's capabilities, and lists "Do basic math", "Create code",
  and "Perform logical reasoning" as "Capabilities to avoid". A response "may
  take a few seconds" ([Apple][fm-tasks]).
- **It can be made to pick.** Guided generation "uses constrained sampling when
  generating output, which defines the rules on what the model can generate",
  and a schema built at run time can be "an any-of schema" over strings, as in
  Apple's example `anyOf: ["Tomato", "Chicken Noodle", "Clam Chowder"]` ([guided
  generation][fm-guided]; [DynamicGenerationSchema][fm-dynamic]).
- **But it returns no probabilities.** Its generation options control sampling,
  temperature, the response length, and tool calling
  ([GenerationOptions][fm-options]), and a response holds its content, raw
  content, token usage, and transcript entries ([Response][fm-response]).
  Neither page offers a probability, so an app can't gate a buzz or an automatic
  tick on the model's confidence the way the finalists gate on Jev's.
- **Its limits.** It runs only on Apple Intelligence iPhones, the iPhone 15 Pro
  and later, in sessions of 4,096 tokens ([technology notes][tech-fm];
  [devices][tech-ai-devices]). The only speed figure found in Apple's posts is
  for its 2024 model: "on iPhone 15 Pro we are able to reach time-to-first-token
  latency of about 0.6 millisecond per prompt token, and a generation rate of 30
  tokens per second" ([Apple, June 10, 2024][afm-2024]).
- **A tagging variant.** A content-tagging version of the model "produces a list
  of categorizing tags based on the input text you provide" and "isn't a typical
  language model that responds to a query from a person" ([Apple][fm-tags]).
- **Embeddings on the phone.** Apple's Natural Language framework has had
  sentence embeddings since iOS 14 ([Apple][nl-embedding]); an embedding
  "locates neighboring, similar strings", and "The higher the similarity of any
  two strings, the smaller the distance is between them"
  ([Apple][nl-embedding-class]).
- **TypeSafe's own advice.** Its jaggedness page lists "Asking the model
  something code can compute exactly" first among things to avoid, and says of
  counting: "If the unit is something a regular expression or a parser can find,
  the count belongs in code and the model has nothing to add." ([jaggedness
  page][ts-jagged]) Its re-ranking cookbook pairs Jev with keyword search: BM25
  shortlists, then Jev "to raise top-1 accuracy from 5% to 18% and top-10
  accuracy from 38% to 62%" on legal queries ([cookbook][cb-rerank]); its RAG
  cookbook retrieves with embeddings before Jev scores the passages
  ([cookbook][cb-rag]).
- Synthesis: the on-device model is the only free, offline substitute that reads
  meaning, and it is slower, limited to newer iPhones, and silent on confidence.
  Embeddings and keyword rules are fast and offline but measure word or meaning
  overlap, not whether a line answers, addresses, or contradicts another.
  TypeSafe itself puts keyword search or embeddings in front of Jev, not instead
  of it.

[fm-tasks]: https://developer.apple.com/documentation/foundationmodels/generating-content-and-performing-tasks-with-foundation-models
[fm-guided]: https://developer.apple.com/documentation/foundationmodels/generating-swift-data-structures-with-guided-generation
[fm-dynamic]: https://developer.apple.com/documentation/foundationmodels/dynamicgenerationschema
[fm-options]: https://developer.apple.com/documentation/foundationmodels/generationoptions
[fm-response]: https://developer.apple.com/documentation/foundationmodels/languagemodelsession/response
[afm-2024]: https://machinelearning.apple.com/research/introducing-apple-foundation-models
[fm-tags]: https://developer.apple.com/documentation/foundationmodels/categorizing-and-organizing-data-with-content-tags
[nl-embedding]: https://developer.apple.com/documentation/naturallanguage/nlembedding/sentenceembedding(for:)
[nl-embedding-class]: https://developer.apple.com/documentation/naturallanguage/nlembedding
[cb-rerank]: https://docs.typesafe.ai/cookbooks/rerank_typesafe
[cb-rag]: https://docs.typesafe.ai/cookbooks/classifying_rag_passages

## Turn, AAC that ranks the user's own phrases

Candidate 23, an augmentative and alternative communication (AAC) app, for
adults who can't rely on speech after ALS, a stroke, or other causes: a
consenting partner's speech is transcribed on the phone, Jev ranks the user's
own saved phrases (a Choice over up to 240, plus question type and topic), and
the top ones fill a row of big buttons above a fixed grid. A tap speaks the
phrase, in the user's Personal Voice if set; with no partner speech, the place
and typed letters rank instead. Speaking is always free, and Listen mode is a
one-time unlock.

### Turn rival apps

The incumbents sell symbol grids or typing with saved phrases; three newer apps
listen to the partner, and one of them matches Turn's pricing. Counts are US
ratings on the listing.

| App                            | Store       | Maker                  | Price and in-app purchases                         | Ratings        | Average        | Updated    |
| ------------------------------ | ----------- | ---------------------- | -------------------------------------------------- | -------------- | -------------- | ---------- |
| [Proloquo2Go AAC][t-p2g]       | App Store   | AssistiveWare B.V.     | $249.99; Gateway vocabulary $149.99                | 12,121         | 4.77           | 2026-07-22 |
| [Proloquo4Text AAC][t-p4t]     | App Store   | AssistiveWare B.V.     | $119.99; none listed                               | 925            | 4.73           | 2026-04-28 |
| [TD Snap][t-tdsnap]            | App Store   | Tobii Dynavox LLC      | Free; speaking upgrade $9.99 a month; others $4.99 | 840            | 4.15           | 2026-08-17 |
| [Predictable][t-predictable]   | App Store   | Prentke Romich Company | $159.99                                            | 203            | 4.48           | 2026-09-18 |
| [Speech Assistant AAC][t-sa]   | Google Play | A-Soft-nl              | Free; in-app purchases "$10.99 per item"           | 3,031          | 4.46           | 2026-09-10 |
| [Spoken][t-spoken]             | App Store   | Spoken Inc.            | Free; $6.49 a month to $249.00 lifetime            | 160            | 4.31           | 2025-11-19 |
| [Vocable AAC][t-vocable]       | App Store   | WillowRoot Apps, LLC   | Free; none                                         | 60             | 4.48           | 2026-02-26 |
| [Rejoin Voice][t-rejoin]       | App Store   | Sevira, LLC.           | Free; Rejoin+ $12.99 a month or $99.99             | 1              | 5.00           | 2026-09-20 |
| [MaTalk AI][t-matalk]          | App Store   | Verbali, Inc           | Free; $4.99 a month or $49.99 a year               | 7              | 4.43           | 2026-09-08 |
| [Live Transcribe][t-lt]        | Google Play | Research at Google     | Free                                               | 268,622        | 3.88           | 2026-08-17 |
| [Look to Speak][t-lts]         | Google Play | Google Creative Lab    | Free                                               | 1,122          | 3.87           | 2024-05-29 |
| Live Speech and Personal Voice | Built in    | Apple                  | Free with iOS                                      | Not applicable | Not applicable | iOS 17     |

- **Proloquo2Go.** A symbol grid with core vocabulary, "used by people with
  autism, Down syndrome, cerebral palsy, Angelman syndrome, and others with
  speech difficulties". Nothing listens to the partner ([listing][t-p2g]).
- **Proloquo4Text.** Typing and saved phrases for literate users: "Type once,
  then say it again with history and sentence prediction." Its prediction
  follows the user's own typing ([listing][t-p4t]).
- **TD Snap.** It charges for speech itself: "A monthly subscription is required
  to enable speech following a 1-month trial period." ([listing][t-tdsnap])
- **Predictable and Speech Assistant AAC.** Saved phrases on buttons with
  prediction or autocomplete, "With the app you can create categories and
  phrases, which are placed on buttons" ([Speech Assistant][t-sa]);
  Predictable's listing mentions a "chatGPT" shortcut and "your iOS personal
  voice" ([Predictable][t-predictable]). Neither ranks phrases by what the
  partner said.
- **Spoken.** AI word prediction tuned by a setup survey: "A quick survey helps
  it tailor suggestions based on the people and places you talk about most."
  ([listing][t-spoken])
- **Vocable AAC.** Its listing offers to "use the power of AI to assist with
  active conversation" ([listing][t-vocable]); WillowTree's September 28, 2023
  press release says Smart Assist "actually listens to caregivers and gives the
  user likely response options based on generative AI natural language models"
  ([press release][t-vocable-pr]). The replies are generated, not the user's
  saved phrases.
- **Rejoin Voice, the closest rival.** Released July 12, 2026: "Rejoin listens
  alongside your conversation, on-device. By the time a question ends, three
  replies are already waiting, written in your style, about your life. Tap one
  and it's spoken instantly." It speaks in the user's Personal Voice, and
  "Nothing is ever said that you didn't choose." Its pricing is Turn's:
  "Everything you need to speak is free, forever", while "Rejoin+ adds the AI
  layer" for $12.99 a month, including "live listening with tappable replies",
  and "If a subscription ever lapses, Rejoin never goes silent."
  ([listing][t-rejoin]) It writes new replies; Turn ranks the user's own.
- **MaTalk AI.** For children, with pictures: "Live Listen & Suggest -
  real-time, relevant picture choices pop up when someone asks a question."
  ([listing][t-matalk])
- **Google.** Live Transcribe transcribes the partner, and the user types a
  reply; Look to Speak lets people "use your eyes to select a menu of phrases
  and pictures and have them spoken aloud"; and Project Relate "is not currently
  accepting new sign ups" ([Live Transcribe][t-lt]; [Look to Speak][t-lts];
  [Project Relate help][t-relate]).
- **Apple, built in.** Live Speech speaks typed text, and "You can create a list
  of phrases that you use often so you can chime in quickly in a conversation"
  ([Live Speech][t-live-speech]), and Personal Voice works "with Live Speech,
  Read & Speak, VoiceOver, and augmented speech apps" ([Personal
  Voice][t-pv-support]).
- Synthesis: Turn's mechanism, listening to the partner and offering tappable
  replies, and its pricing, free speech with paid listening, already ship in
  Rejoin Voice, released on July 12, 2026 and holding one rating. Turn's
  remaining difference is that every reply is one of the user's own saved
  phrases, never generated text. Valencia et al. found that AAC users worry
  about generated words; see [Harm from a wrong Turn
  decision](#harm-from-a-wrong-turn-decision).

[t-p2g]: https://apps.apple.com/us/app/proloquo2go-aac/id308368164
[t-p4t]: https://apps.apple.com/us/app/proloquo4text-aac/id751646884
[t-tdsnap]: https://apps.apple.com/us/app/td-snap/id1072799231
[t-predictable]: https://apps.apple.com/us/app/predictable/id404445007
[t-sa]: https://play.google.com/store/apps/details?id=nl.asoft.speechassistant
[t-spoken]: https://apps.apple.com/us/app/spoken-tap-to-talk-aac/id1034487817
[t-vocable]: https://apps.apple.com/us/app/vocable-aac/id1497040547
[t-rejoin]: https://apps.apple.com/us/app/rejoin-voice-aac-speech-app/id6779377273
[t-matalk]: https://apps.apple.com/us/app/matalk-ai/id6747360381
[t-lts]: https://play.google.com/store/apps/details?id=com.androidexperiments.looktospeak
[t-vocable-pr]: https://www.prweb.com/releases/willowtree-transforms-vocable-aac-mobile-app-with-conversational-ai-integration-giving-voice-to-millions-301941058.html
[t-relate]: https://sites.research.google/relate/help/
[t-live-speech]: https://support.apple.com/en-us/105018

### Turn in the 2026 gallery

- **No AAC entry.** On September 22, 2026 the gallery search found no project
  for "augmentative" [(0)][s-augmentative], "nonverbal" [(0)][s-nonverbal],
  "aphasia" [(0)][s-aphasia], "dysarthria" [(0)][s-dysarthria], "speech
  impairment" [(0)][s-speech-impairment], or "sign language"
  [(0)][s-sign-language]. "AAC" had [one hit][s-aac], Offline Convert, a video
  and photo converter, where AAC is the audio format. "Personal voice" had
  [one][s-personal-voice], the voice-note summarizer AlGrano, and "live speech"
  [one][s-live-speech], the to-do app Focus5.
- **The nearest entry, SideBell.** Its tagline: "An accessible call bell that
  works without the internet. One tap on the patient's iPad. The caregiver's
  phone raises an alarm and says out loud what is needed." Its story names
  Turn's users: "Someone recovering in bed after a stroke can often press a
  button but cannot call out. So can many people living with ALS or severe motor
  impairment." It "ships with two items, 'Discomfort' and 'Water'", which the
  caregiver can extend, lists one builder, and links an App Store listing and a
  GitHub repository; its story doesn't mention students or Next Gen
  ([SideBell][p-sidebell]).
- **Other voice entries.** They serve other jobs: myQuote, a Next Gen entry,
  "uses TTS and UI themes"; Jiak Ba Beh is "a hands-free, voice-first AI
  companion" for seniors; and Kinlily and Bebe Di Voice Box preserve family
  members' voices ([Next Gen entries][ng-field]; [gallery list][gallery-list]).
- Synthesis: Turn would still be the gallery's only AAC entry, as the earlier
  [SaySo check][prior-sayso] found. SideBell shares Turn's users but not its
  job, and shows that at least one builder has already pitched stroke and ALS to
  the 2026 judges.

[s-augmentative]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=augmentative
[s-nonverbal]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=nonverbal
[s-aphasia]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=aphasia
[s-dysarthria]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=dysarthria
[s-speech-impairment]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22speech+impairment%22
[s-sign-language]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22sign+language%22
[s-aac]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=AAC
[s-personal-voice]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22personal+voice%22
[s-live-speech]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22live+speech%22
[p-sidebell]: https://devpost.com/software/sidebell
[gallery-list]: /docs/research/gallery-2026.md#full-project-list

### Evidence that Turn's problem matters

- **Who may benefit.** "Beukelman and Light (2020) estimated that approximately
  5 million Americans and 97 million people in the world may benefit from AAC."
  ([ASHA][t-asha]) The figure comes from a 2020 textbook that ASHA cites; the
  page is undated.
- **ALS.** "At some point, 80 to 95% of people with ALS are unable to meet their
  daily communication needs using natural speech." That is a claim in a 2011
  review, not new data ([Beukelman et al., 2011][t-als-aac]). CDC's National ALS
  Registry dashboard, last reviewed June 25, 2026, projects 34,720 adults with
  ALS in the United States in 2026 ([CDC][t-als-cdc]).
- **Stroke and aphasia.** "Every year, more than 795,000 people in the United
  States have a stroke" ([CDC][t-stroke]). NIDCD: "About 2 million people in the
  United States are living with aphasia", citing the National Aphasia
  Association, and "approximately one third of stroke survivors have aphasia"
  ([NIDCD, updated April 16, 2025][t-aphasia]).
- **The speed gap.** A 2018 systematic review of 39 studies found average
  text-entry rates of "15.4, 12.5, 4.2, and 1.7 WPM" for speech recognition, a
  standard keyboard, a cursor-driven on-screen keyboard, and scanning ([Koester
  and Arthanat, 2018][t-ter]). Kristensson et al. put it against speech:
  "compared to speaking rates of between 125 and 185 words per minute ..., aided
  communication rates in general are reported at 8–10 wpm without acceleration
  methods" ([CHI 2020][t-kristensson]).
- **Lost turns.** A 1988 study of conversations found that "Augmented
  communicators were frequently unsuccessful in their attempts to secure
  speaking turns" ([Buzolich and Wiemann, 1988][t-turns]), and a 2024 simulation
  of repairs found that "None of the user groups were found to be capable of
  producing full [repair] utterances within the temporal limits of oral-speech
  conversation" ([Rayman et al., 2024][t-repair]).
- Synthesis: the population and the speed gap are well documented by ASHA, CDC,
  NIDCD, and peer-reviewed reviews; how long partners wait, and whether ranked
  replies close the gap in real conversations, rests on old or simulated
  studies.

[t-asha]: https://www.asha.org/practice-portal/professional-issues/augmentative-and-alternative-communication/
[t-als-aac]: https://pubmed.ncbi.nlm.nih.gov/21603029/
[t-stroke]: https://www.cdc.gov/stroke/data-research/facts-stats/index.html
[t-aphasia]: https://www.nidcd.nih.gov/health/aphasia
[t-ter]: https://pubmed.ncbi.nlm.nih.gov/28368689/
[t-turns]: https://pubmed.ncbi.nlm.nih.gov/2965282/
[t-repair]: https://pubmed.ncbi.nlm.nih.gov/37916671/

### Turn on students' devices

- **Hearing the partner.** `SpeechTranscriber` (iOS 26 and later) transcribes
  live on the device, and Apple's live-audio sample runs only on a physical
  device ([technology notes][tech-speech]). From Expo, `expo-speech-recognition`
  57.1.0 offers `continuous` and `requiresOnDeviceRecognition` on iOS 17 and
  later and Android 13 and later, through the older `SFSpeechRecognizer` ([its
  README][esr]; [modules][tech-modules]). Both APIs take custom vocabulary;
  Apple's `contextualStrings` are "Words or phrases, grouped by tag, that should
  be recognized even if they are not in the system vocabulary", such as family
  names ([Apple][speech-context]).
- **Speaking in the user's voice.** Personal Voice "is available in English
  (U.S.), Mandarin Chinese (China mainland), and Spanish (Mexico) and is
  available on iPhone 15 Pro models, iPhone 16 models and later", and it "can be
  used only with Live Speech and with third-party apps that you allow, such as
  Augmentative and Alternative Communication (AAC) apps" ([iPhone User
  Guide][pv-guide]). An app asks with `requestPersonalVoiceAuthorization`, from
  iOS 17 ([Apple][pv-auth]). Apple's WWDC23 session: "Once authorized, Personal
  Voices will appear alongside System voices in the AVSpeechSynthesisVoice API
  speechVoices", and the feature "should be primarily used for augmentative or
  alternative communication apps" ([WWDC23 session 10033][wwdc23-10033]).
- **Expo's gap.** `expo-speech`'s iOS module lists voices with
  `AVSpeechSynthesisVoice.speechVoices()` and never requests Personal Voice
  authorization ([source][expo-speech-src]), so the authorization call needs a
  small local Swift module ([Swift bridges][tech-swift-bridge]).
- **Choice size.** A Choice takes "a maximum of 255 options", and TypeSafe's
  classification cookbook says "a Choice works reliably up to roughly 240
  options" ([API notes][jev-api]; [cookbook][cb-classify-confidence]). Turn's
  240-phrase Choice sits at that limit, and a bigger phrase bank needs two
  stages ([pattern notes][jp-choice]).
- **Latency and offline use.** Jev runs only as a hosted service in the United
  States, and its quoted 100 to 150 ms excludes the trip from the phone to the
  team's backend ([data handling][jev-data]; [latency][jev-rate]). Turn's
  fallback, ranking by place and typed letters in code, works offline.
- **Android.** The platform recognizer's docs warn it "is not intended to be
  used for continuous recognition" ([Android notes][tech-android-speech]), and
  no Android page read offers third-party apps a personal-voice equivalent.
- **Accounts.** Turn needs only microphone and speech-recognition permission,
  and nothing on Apple's paid-only list ([accounts][tech-accounts]).
- Synthesis: buildable on an iPhone 15 Pro or later with Expo and two small
  native pieces, live on-device transcription and Personal Voice authorization.
  On an older iPhone the demo can speak in a system voice.

[pv-auth]: https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer/requestpersonalvoiceauthorization(completionhandler:)
[wwdc23-10033]: https://developer.apple.com/videos/play/wwdc2023/10033/
[expo-speech-src]: https://github.com/expo/expo/blob/main/packages/expo-speech/ios/SpeechModule.swift
[tech-swift-bridge]: /docs/research/next-gen-tech.md#writing-a-swift-bridge-with-expo-modules
[jev-data]: /docs/research/jev.md#offline-behavior-and-data-handling
[tech-android-speech]: /docs/research/next-gen-tech.md#speech-and-vision-on-android

### Jev's jagged edges for Turn

- **Choice size, high.** At 240 phrases Turn uses the whole reliable range, and
  "Choice question probabilities always add up to 1, so a line ranks first even
  when none answer the query" ([pattern notes][jp-choice]). Without a "none of
  these" option or a Noul, small talk still fills the row.
- **Consistency, medium.** Over 15 identical requests, "TypeSafe flips on 2 of
  the 8 questions" ([consistency][jp-consistency]). AAC reviewers treat a stable
  layout as essential ([SaySo check][prior-sayso]), so a reshuffled row costs
  the user a learned tap.
- **Literal reading and indirection, medium.** Jev "answers the question you
  wrote, not the one you meant", and "A question about a property of a property
  or something that requires multiple hops of reasoning costs accuracy"
  ([jaggedness page][ts-jagged]). "Do you want me to call your sister?" ranks
  "Please call Anna" only if the phrase's criteria say who Anna is.
- **Transcription errors, medium.** Jev "accepts text input only" ([Jev
  notes][jev-what]), so a misheard partner question is ranked as heard.
- **English first, medium.** "English is the primary training language and where
  accuracy is currently best" ([Jev notes][jev-lang]), and Personal Voice speaks
  only three languages.
- **Numbers, dates, and adversarial content, low.** Most phrases are social;
  times and amounts can be matched in code, and the partner is a consenting
  person, not an attacker.

### Turn without Jev

- **Choosing from a fixed set is an old, measured task.** Gmail's Smart Reply
  builds "a target response space R comprising only high quality responses" and
  picks from it; on response ranking, a frequency baseline scored precision at
  10 of 0.321, a bag-of-words classifier 0.345, and its LSTM 0.483 ([Kannan et
  al., KDD 2016][t-smart-reply]).
- **Embeddings do it well when trained for replies.** Henderson et al. "consider
  natural language response suggestion from a fixed set of candidates" with dual
  encoders, and picked the right reply from 100 candidates 48% to 52% of the
  time; on hand-written rules: "These systems are brittle, and progress is slow"
  ([preprint, 2017][t-henderson]). Those encoders were trained on email reply
  pairs; Apple's built-in sentence embeddings measure similarity instead
  ([simpler methods](#what-simpler-methods-offer)).
- **Keyword search over a user's own sentences.** Kristensson et al. simulated
  retrieval of the user's past sentences with keyword ranking (IDF, BM25, and a
  unigram model) and context tags for place, time, and partner, and estimated
  "keystroke savings ranging from 50–96%", depending on their assumptions; no
  users were tested ([CHI 2020][t-kristensson]).
- **Partner speech has been tried.** Wisenburn and Higginbotham's Converser
  recognized the partner's speech to offer utterances and "generated a faster
  communication rate" than an alphabet board alone, but users relied on "stored
  noun phrases" more than full utterances, and partners' ratings "showed no
  difference" ([2008][t-converser-2008]; [2009][t-converser-2009]). In a
  simulation, adding partner turns lowered a word model's perplexity from 93 to
  81 ([Vertanen, ASSETS 2017 poster][t-vertanen]).
- **Place as context.** TalkAbout "provides users with a word list that is
  adapted to their current location and conversation partner", in a design study
  with five adults with aphasia that reports no accuracy ([Kane et al., ASSETS
  2012][t-kane]).
- **Language models generate instead.** SpeakFaster, an LLM that expands
  abbreviations, saved "57% more motor actions than traditional predictive
  keyboards in offline simulation", and two eye-gaze users with ALS typed
  "29-60% above baselines" ([Cai et al., Nature Communications,
  2024][t-speakfaster]).
- **Apple's on-device model.** An any-of schema can limit it to the saved
  phrases, so it could pick one offline and free, but it returns no
  probabilities and "may take a few seconds" ([simpler
  methods](#what-simpler-methods-offer)); a list of 240 phrases also fills a
  good part of its 4,096-token session.
- Synthesis: the published record favors a trained ranker over keyword rules for
  choosing a reply from a fixed set, and no source compares Jev, embeddings, and
  the on-device model on an AAC user's phrases. Turn's own offline fallback,
  place plus typed letters in code, is the keyword baseline Jev has to beat on
  camera.

[t-smart-reply]: https://arxiv.org/abs/1606.04870
[t-henderson]: https://arxiv.org/abs/1705.00652
[t-converser-2008]: https://pubmed.ncbi.nlm.nih.gov/18465364/
[t-converser-2009]: https://pubmed.ncbi.nlm.nih.gov/19444679/
[t-vertanen]: https://www.keithv.com/pub/aacdialogue/VertanenDialogueAAC.pdf
[t-kane]: https://doi.org/10.1145/2384916.2384926
[t-speakfaster]: https://pubmed.ncbi.nlm.nih.gov/39487163/

### Harm from a wrong Turn decision

- **Communication problems and hospital errors.** In 2,355 reviewed charts from
  2000/01 admissions in Quebec, "patients with preventable adverse events were
  significantly more likely than those without such events to have a
  communication problem (odds ratio [OR] 3.00; 95% CI 1.43-6.27)", and patients
  with communication problems more often had multiple preventable events, "46%
  v. 20%" ([Bartlett et al., CMAJ, 2008][t-bartlett]). The study concerns
  communication problems in general, not AAC errors.
- **Wrong suggestions and authorship.** AAC users testing AI suggestions "had
  concerns about the system suggesting the wrong thing and making the
  participants look bad", and selecting "an automated phrase, even a pre-stored
  phrase they had created beforehand, made others believe the system did all the
  work for them" ([Valencia et al., CHI 2023][t-valencia]).
- **Listening.** The same participants asked "how they could turn off the system
  from hearing the conversations all the time" ([Valencia et al., CHI
  2023][t-valencia]). California's Penal Code section 632 bars using an
  electronic device to "eavesdrop upon or record the confidential communication"
  without "the consent of all parties" ([California Penal Code 632][t-pc632]);
  whether live transcription that stores no audio falls under it is a legal
  question no source here settles.
- **Prediction has a cost.** A study of able-bodied participants using scanning
  found that "the cost of using this word prediction system balanced the benefit
  of the keystroke savings" ([Koester and Levine, 1994][t-wp-cost]).
- Synthesis: a mis-ranked row costs time more than words, because the user still
  taps and nothing speaks on its own. The harm grows where a wrong tap answers a
  question about pain or consent. Using only the user's own phrases answers the
  worry about wrong tone, but Valencia's participants felt that even pre-stored
  phrases made listeners credit the system.

[t-bartlett]: https://pubmed.ncbi.nlm.nih.gov/18519903/
[t-valencia]: https://doi.org/10.1145/3544548.3581560
[t-wp-cost]: https://pubmed.ncbi.nlm.nih.gov/10147209/

## Scenekeeper, live sound and light for a game master

Candidate 21. For adult tabletop groups: the game master's phone transcribes the
table, with players' consent by QR code, and Jev reads each phrase for location,
mood, intensity, combat, and a dozen sound effects (about 18 questions a phrase,
15 to 25 calls a minute), and each declared action for the check it needs and
its difficulty. Code crossfades music and effects, can set smart bulbs, and
shows the game master check cards. One sound world is free; a subscription opens
all worlds, lights, and campaign tools.

### Scenekeeper rival apps

Game-master audio is a busy category of manual soundboards, and one app already
listens to the table. Counts are US ratings on the listing.

| App                                  | Store       | Maker                    | Price and in-app purchases                  | Ratings | Average | Updated    |
| ------------------------------------ | ----------- | ------------------------ | ------------------------------------------- | ------- | ------- | ---------- |
| [Bardy][s-bardy]                     | Google Play | Bardy LLC                | Free, 5K+ downloads; iOS in TestFlight beta | None    | None    | 2025-08-22 |
| [Pocket Bard][s-pocketbard]          | App Store   | Pocket Bard Inc.         | Free; Open Worlds $6.99, yearly $49.99      | 1,556   | 4.81    | 2026-08-14 |
| [Pocket Bard][s-pocketbard-gp]       | Google Play | Pocket Bard Inc.         | Free; in-app purchases; 500K+ downloads     | 4,979   | 4.85    | 2026-08-14 |
| [Syrinscape][s-syrinscape-gp]        | Google Play | Syrinscape               | Free; sold through its own web store        | 823     | 1.91    | 2026-02-23 |
| [RPG Sounds: Fantasy][s-rpgsounds]   | App Store   | SuperFly Games Ltd       | Free; Pro $6.99 a month, $19.99 to $69.99   | 1,442   | 4.64    | 2026-06-09 |
| [RPG Master Sounds Mixer][s-rpgms]   | App Store   | Salvador Sevillano       | Free; packs $0.99 to $2.99                  | 512     | 4.71    | 2026-01-21 |
| [TableTone][s-tabletone]             | App Store   | GreenLobster Media       | Free; $9.99 a month or $99.99 a year        | 32      | 3.56    | 2026-08-24 |
| [SessionKeeper][s-sessionkeeper]     | App Store   | SessionKeeper LLC        | Free; $3.99 to $24.99 a month; credits      | 84      | 4.82    | 2026-09-21 |
| [D&D Beyond][s-ddb]                  | App Store   | Wizards of the Coast LLC | Free; subscriptions $2.99 to $54.99; books  | 91,048  | 4.75    | 2026-09-21 |
| [Philips Hue][s-hue-app]             | App Store   | Signify Netherlands B.V. | Free; sync and security add-ons             | 114,806 | 4.69    | 2026-09-22 |
| [RPG Sounds Fantasy Worlds][s-rpgfw] | App Store   | iMakeStuff               | Free; scenes $0.99, all $15.99              | 35      | 4.69    | 2022-04-19 |

- **Bardy, the direct rival.** "Bardy is the only app that listens to your
  party's conversation and automatically adjusts the music and ambiance to fit
  the setting." ([listing][s-bardy]) Its AI "is trained to analyze the
  conversation and respond to keywords and phrases", and planned prices are
  "$7.99/month, or $79.99/year" with AI, or "$2.99/month" manual only; the AI is
  "attuned to Common (English)" ([FAQ][s-bardy-faq]). "Fighting is only
  activated by phrases like 'roll initiative'" ([how it works][s-bardy-how]),
  and its roadmap lists "Add voice activated sounds effects" for Winter 2026
  ([roadmap][s-bardy-roadmap]). It has no lights or check cards.
- **Manual soundboards.** Pocket Bard: "With just a tap, change your entire
  soundscape to match the tone of your session" ([listing][s-pocketbard]); RPG
  Sounds: "Add buttons that can have sounds assigned to them for quick access
  during skill checks, attack rolls, and other game events"
  ([listing][s-rpgsounds]); RPG Master Sounds offers "effortlessly mixing
  hundreds of sound effects, music tracks, and immersive soundscapes"
  ([listing][s-rpgms]); Syrinscape plays while "requiring almost no interaction"
  ([App Store listing][s-syrinscape]); and TableTone sells "unlimited access to
  exclusive, studio-grade content updated regularly" by subscription
  ([listing][s-tabletone]).
- **Recording, not reacting.** SessionKeeper: "Hit record. Play D&D. Get your
  campaign automatically organized", with "Speaker recognition (who said what)"
  ([listing][s-sessionkeeper]). D&D Beyond is where players "roll using the
  built-in dice roller and be ready for skill checks, attack rolls, saving
  throws" ([listing][s-ddb]).
- **Lights.** Philips Hue can "Make your lights flash, dance, dim, brighten, and
  change color in sync with your screen or sound!" ([listing][s-hue-app]); RPG
  Sounds Fantasy Worlds offered "light scripts and light effects when connected
  to Philips Hue or IKEA® TRÅDFRI" and was last updated in 2022
  ([listing][s-rpgfw]).
- Synthesis: the listening half of Scenekeeper ships in Bardy, by keywords, on
  Android, with 5K+ downloads and planned pricing a notch below a typical
  Scenekeeper subscription. Scenekeeper's remaining differences are sound
  effects on cue, lights, and check calls, and Bardy's roadmap already promises
  voice-activated effects. The incumbents' ratings show that game masters pay
  for audio, but by tapping.

[s-bardy]: https://play.google.com/store/apps/details?id=com.bardyllc.bardy
[s-pocketbard]: https://apps.apple.com/us/app/id6444221555
[s-pocketbard-gp]: https://play.google.com/store/apps/details?id=com.MojoFilterMediaLLC.RPGSoundSystem
[s-syrinscape-gp]: https://play.google.com/store/apps/details?id=com.ixc.Syrinscape
[s-rpgsounds]: https://apps.apple.com/us/app/id1205984620
[s-rpgms]: https://apps.apple.com/us/app/id1444724681
[s-tabletone]: https://apps.apple.com/us/app/id6449381031
[s-sessionkeeper]: https://apps.apple.com/us/app/id6737173822
[s-ddb]: https://apps.apple.com/us/app/id1501810129
[s-hue-app]: https://apps.apple.com/us/app/id1055281310
[s-rpgfw]: https://apps.apple.com/us/app/id1453514004
[s-bardy-roadmap]: https://www.bardy.ai/roadmap
[s-syrinscape]: https://apps.apple.com/us/app/id704200939

### Scenekeeper in the 2026 gallery

- **Searches.** "Tabletop" had [3 hits][s-tabletop], "D&D" [2][s-dnd], "game
  master" [2][s-game-master], and "RPG" [18][s-rpg]; "TTRPG" [(0)][s-ttrpg],
  "dungeon master" [(0)][s-dungeon-master], "soundboard" [(0)][s-soundboard],
  "smart bulb" [(0)][s-smart-bulb], "HomeKit" [(0)][s-homekit], and "Philips
  Hue" [(0)][s-hue] had none.
- **Merchants Bag.** "Living economy, inventory & AI for tabletop RPGs." Its
  builder writes: "As a Game Master for 10 years, I noticed there still wasn't a
  truly easy way to manage the table without getting lost in thousands of
  papers, character sheets, and notebooks." It lists two builders and App Store
  and Google Play links, and is built with Expo and Firebase. It runs campaigns,
  items, maps, and a market; it doesn't listen, play sound, or set lights
  ([Merchants Bag][p-merchants-bag]).
- **LMS: Land of Magic Spices.** A "story-driven fantasy RPG for iOS and
  Android" inspired by Dungeons & Dragons, a single-player game rather than a
  table tool ([LMS][p-lms]).
- **Soundscape Therapy.** A Next Gen entry offering "AI-powered mood-based sound
  therapy for mental wellness", which maps moods to sounds for wellness, not
  play ([Next Gen entries][ng-field]).
- Synthesis: no entry reacts to a live table. The one game-master tool comes
  from a builder with ten years at the table and is already on both stores.

[s-tabletop]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=tabletop
[s-dnd]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22D%26D%22
[s-game-master]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22game+master%22
[s-rpg]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=RPG
[s-ttrpg]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=TTRPG
[s-dungeon-master]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22dungeon+master%22
[s-soundboard]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=soundboard
[s-smart-bulb]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22smart+bulb%22
[s-homekit]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=HomeKit
[s-hue]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22philips+hue%22
[p-merchants-bag]: https://devpost.com/software/merchants-bag
[p-lms]: https://devpost.com/software/lms-land-of-magic-spices

### Evidence that Scenekeeper's problem matters

- **The audience, in company figures.** Hasbro: "Dungeons & Dragons Celebrates
  50th Anniversary in 2024 with More than 50 Million Fans" (February 12, 2024)
  ([Hasbro][s-hasbro]). Ten months later D&D Beyond thanked "all 85 million of
  you worldwide" and counted "19 million users on D&D Beyond" (December
  20, 2024) ([D&D Beyond][s-ddb-2024]). Roll20's homepage says "Join 15+ million
  players" ([Roll20][s-roll20]). These count fans and accounts, not weekly
  tables.
- **Game masters do use music.** In a study of 17 game masters, "Using
  supporting material like music and images" scored 4.29 out of 5, and "Music
  selection for the story scenes is a very common technique" ([Katifori et al.,
  FDG 2022][s-fdg]). One of them said: "Game mastering is a marathon not a race,
  conservation of mental strength is vital." ([Katifori et al., FDG
  2022][s-fdg])
- **Demand for audio apps.** Pocket Bard shows 500K+ Google Play downloads and
  Syrinscape 100K+ ([rivals](#scenekeeper-rival-apps)).
- **Music and immersion.** In the Bardo study, 61 viewers of recorded play
  preferred Bardo's automatic music 163 times against 74 for the videos' own
  music, with 68 ties ([Padovani et al., AIIDE 2017][s-bardo-2017]). Those were
  spectators of recorded play, not players at a table, and no controlled study
  of real tables turned up.
- Synthesis: the evidence is weak. The audience figures are marketing counts
  that disagree with each other, and the only data on game masters' music use is
  a 17-person survey. No government or peer-reviewed source counts active
  tables.

[s-roll20]: https://roll20.net/
[s-fdg]: https://doi.org/10.1145/3555858.3555918

### Scenekeeper on students' devices

- **One phone hears the table.** Transcription works as for Turn, with
  `SpeechTranscriber` or `expo-speech-recognition` ([technology
  notes][tech-speech]; [README][esr]). Apple publishes no accuracy figure for a
  phone listening to several people across a table.
- **Listening while playing.** The phone plays music and effects while it
  transcribes. `expo-speech-recognition` lists "Voice Processing" on iOS only,
  to "Prevent microphone feedback" ([README][esr]).
- **Crossfades.** `AVAudioPlayer`'s `setVolume(_:fadeDuration:)` "Changes the
  audio player's volume over a duration of time", from iOS 10
  ([Apple][avplayer-fade]). `expo-audio` exposes a `volume` from 0.0 to 1.0 but
  documents no fade, and on iOS its background recording option "adds the audio
  background mode" ([expo-audio]).
- **Lights.** HomeKit lets an app "Communicate with configured accessories and
  services in order to perform actions like turning on the lights in the living
  room" ([Apple][homekit]), and HomeKit is one of the nine capabilities open to
  a free developer account ([free capabilities][ng-free-caps]). The bulb must
  already be set up in the Home app, and Android has no HomeKit.
- **Jev load.** Scenekeeper makes 15 to 25 calls a minute per table. Jev's
  listed limit is 1,200 requests a minute ([latency][jev-rate]), and TypeSafe's
  cookbook authors hit rate limits at about eight requests in flight
  ([concurrency][jp-concurrency]).
- Synthesis: 48 tables at 25 calls a minute would use the whole listed limit, so
  one team key serves a demo, not a launch. If each call carried 2,000 input
  tokens, four hours at 25 calls a minute would be 12 million tokens, about
  $0.50 at $0.042 per million ([prices][jev-prices]).
- Synthesis: buildable with Expo plus the transcription module; HomeKit needs a
  small native module and a HomeKit bulb, and cue timing is the demo's risk.

[avplayer-fade]: https://developer.apple.com/documentation/avfaudio/avaudioplayer/setvolume(_:fadeduration:)
[homekit]: https://developer.apple.com/documentation/homekit
[ng-free-caps]: /docs/research/next-gen.md#apple-capabilities-on-a-free-account
[jp-concurrency]: /docs/research/jev-patterns.md#concurrency-in-the-cookbooks
[jev-prices]: /docs/research/jev.md#jev-prices

### Jev's jagged edges for Scenekeeper

- **Large, noisy state, high.** Table talk mixes narration with rules questions,
  jokes, and side talk, and "Accuracy falls as the state grows with content
  unrelated to the decision" ([jaggedness page][ts-jagged]). Send one phrase and
  a short rolling context, not the session.
- **Literal reading, high.** Narration works by implication ("the torches
  gutter"), and Jev reads "Scoping words, negations, and implied conditions ...
  at face value" ([jaggedness page][ts-jagged]).
- **Numbers, medium.** A check's difficulty is a number, and "Jev will perform
  better on semantic questions than mathematical ones" ([jaggedness
  page][ts-jagged]); ask for a named tier and map it to a number in code.
- **Structural invariants, medium.** A dozen effect Nouls and a combat Noul are
  separate questions, and TypeSafe warns against holding "the model to
  arithmetic identities between separate questions" ([jaggedness
  page][ts-jagged]); code has to settle combat against calm.
- **Consistency, medium.** Two of eight Choices flipped across 15 identical
  calls ([consistency][jp-consistency]), which would make music flap without the
  design's rule of switching only above 0.8 twice running.
- **Adversarial content, low to medium.** Players can say "combat!" as a joke,
  and "State is data, and `jev-1.13` does not treat it as hostile by default"
  ([jaggedness page][ts-jagged]).

### Scenekeeper without Jev

- **Keyword rules already ship.** Bardy's AI "is trained to analyze the
  conversation and respond to keywords and phrases, like 'you enter the cave'"
  ([FAQ][s-bardy-faq]), and "Fighting is only activated by phrases like 'roll
  initiative'" ([how it works][s-bardy-how]). Foundry VTT's scene playlist "will
  begin automatically playing when this Scene is activated", a rule with no
  language at all ([Foundry VTT][s-foundry]).
- **The Bardo experiments measured it.** Bardo classified each sentence of a
  YouTube Dungeons & Dragons campaign, 9 episodes and 5,892 sentences, into four
  moods from automatic captions. An emotion word list averaged 34% accuracy, 49%
  with a sliding window, and Naive Bayes with a sliding window 64%; game words
  mattered: "the words check, perception, and stealth appear frequently in
  sentences of the Suspenseful emotion" ([Padovani et al., AIIDE
  2017][s-bardo-2017]).
- **Decisive beats accurate.** A follow-up ensemble with about the same average
  accuracy as Naive Bayes, 65% against 64%, but far fewer short
  misclassifications, 5 against 40 an episode, was preferred 93 times against
  48, with 59 ties; the authors conclude "it is preferable to use a model that
  is somewhat inaccurate but decisive, than a model that is accurate but often
  indecisive" ([Padovani et al., AAAI 2019][s-bardo-2019]).
- **A fine-tuned model helps.** On the same episodes, a fine-tuned BERT beat
  Naive Bayes in every episode, by 7% on average for valence and 5% for arousal
  ([Ferreira et al., AIIDE 2020][s-bardo-2020]).
- **The on-device model.** It can tag moods offline, but its guardrails "aim to
  block harmful or sensitive content, such as self-harm, violence, and adult
  materials" ([Apple][s-fm-safety]), which combat narration may trip, and it
  returns no probabilities ([simpler methods](#what-simpler-methods-offer)).
- Synthesis: for mood, a trained classifier or keyword rules reach usable
  accuracy, and Bardy already ships keywords; the published lesson is that
  stability matters more than accuracy. Jev's added value would be the effects,
  intensity, and check calls, for which no measurement turned up.

[s-foundry]: https://foundryvtt.com/article/scenes/
[s-bardo-2019]: https://ojs.aaai.org/index.php/AAAI/article/view/4108
[s-bardo-2020]: https://ojs.aaai.org/index.php/AIIDE/article/view/7408
[s-fm-safety]: https://developer.apple.com/documentation/foundationmodels/improving-the-safety-of-generative-model-output

### Harm from a wrong Scenekeeper decision

- **Flashing lights.** "For about 3% of people with epilepsy, exposure to
  flashing lights at certain intensities or to certain visual patterns can
  trigger seizures", and "flashing lights between the frequency of 5 to 30
  flashes per second (Hertz) are most likely to trigger seizures"; for strobes,
  the Epilepsy Foundation's advisers recommend "The flash rate be kept to under
  2 Hertz" ([Epilepsy Foundation, archived August 16, 2026][s-ef]). WCAG 2.2's
  success criterion 2.3.1 bars content that "flashes more than three times in
  any one second period" unless below its thresholds, which are written for
  screens ([W3C][s-wcag]).
- **The bulb maker's own warning.** For its event-driven Sports Live effects,
  Signify writes: "Contains flickering lights that may affect people with
  photosensitive epilepsy or other light sensitivities. Please use caution and
  stop use immediately if symptoms occur." (May 6, 2026) ([Signify][s-signify])
- **Loud sounds.** WHO: "you can safely listen to a sound level of 80dB for up
  to 40 hours a week", and hearing loss "can be immediate (such as when exposed
  to a sudden burst of loud sound)" ([WHO][s-who]).
- **Recording players.** California's Penal Code section 632 requires "the
  consent of all parties" to record a confidential communication ([California
  Penal Code 632][t-pc632]), and Bardy's policy says players' "speech may be
  converted into text and the resulting transcripts are processed and stored
  securely on Firebase" ([Bardy privacy policy][s-bardy-privacy]).
- Synthesis: a wrong cue mostly costs immersion, and the Bardo studies show
  viewers forgive a late switch more than a flickering one. The serious harm is
  the lights: a combat cue that flashes a bulb falls in the seizure range unless
  code caps the rate, which is a code rule, not a Jev decision.

[s-ef]: https://web.archive.org/web/20260816074759/https://www.epilepsy.com/what-is-epilepsy/seizure-triggers/photosensitivity
[s-wcag]: https://www.w3.org/TR/WCAG22/#three-flashes-or-below-threshold
[s-signify]: https://www.signify.com/global/our-company/news/press-releases/2026/20260506-philips-hue-and-philips-smart-lighting-launches-new-sports-live
[s-who]: https://www.who.int/news-room/questions-and-answers/item/deafness-and-hearing-loss-safe-listening
[s-bardy-privacy]: https://www.bardy.ai/privacy-policy

## Bench, a hands-free lab notebook

Candidate 9. For lab-course students aged 18 and over: a photo of the protocol
becomes steps, the student talks through earbuds, and Jev places each note on a
step, picks which spoken number counts, and flags deviations, spills, and
hazards (about 6 questions a phrase; it acts at p 0.85 or more and asks
otherwise). Code checks tolerances, ticks steps, starts timers in a Live
Activity, and logs values; a partner's phone can mirror the run. Three protocols
are free; a semester subscription adds unlimited protocols, partner sync, and a
run-log PDF.

### Bench rival apps

Institutional notebooks have thin mobile apps; the closest rivals are small 2026
apps for voice notes, protocol scanning, and bench timers. Counts are US ratings
on the listing.

| App                              | Store       | Maker             | Price and in-app purchases                     | Ratings | Average | Updated    |
| -------------------------------- | ----------- | ----------------- | ---------------------------------------------- | ------- | ------- | ---------- |
| [Verbex - Lab Notes][b-verbex]   | App Store   | Multimod Labs LLC | Free; $2.99 a week, $7.99 a month, $49.99 year | 5       | 4.20    | 2026-09-21 |
| [LabLogger][b-lablogger]         | App Store   | LAB LOGGER INC.   | Free; none                                     | 0       | None    | 2026-09-10 |
| [Lab Laps][b-lablaps]            | App Store   | Lenard Szabo      | Free; Pro $4.99 a month or $29.99 a year       | 93      | 4.74    | 2026-09-21 |
| [Lab Laps][b-lablaps-gp]         | Google Play | Lab Laps          | Free; in-app purchases                         | 2,424   | 4.72    | 2026-09-22 |
| [LabProtocol][b-labprotocol]     | App Store   | TOMAS SAROUN      | Free; LabProtocol Pro $2.99                    | 0       | None    | 2026-05-14 |
| [LabArchives ELN][b-labarchives] | Google Play | LabArchives, LLC  | Free                                           | 7       | 2.86    | 2025-08-07 |
| [Labguru by Cenevo][b-labguru]   | App Store   | Biodata Ltd       | Free                                           | 2       | 3.00    | 2026-08-17 |
| [eLABJournal][b-elab]            | App Store   | Bio-ITech BV      | Free                                           | 8       | 5.00    | 2025-09-26 |
| [SciNote][b-scinote]             | App Store   | Scinote LLC       | Free                                           | 0       | None    | 2024-03-20 |
| [Lab.Hacks][b-labhacks]          | App Store   | Lab.hacks GmbH    | Free; ad-free $2.99 a month or $28.99 a year   | 136     | 4.93    | 2026-08-28 |
| [Laboratory Timer][b-labtimer]   | App Store   | shazino           | Free                                           | 52      | 4.65    | 2019-11-21 |

- **Verbex, the closest in mechanism.** Released February 19, 2026: "The
  protocol says what should happen. Verbex records what actually happened." It
  captures "procedures, materials, deviations, observations, and results using
  voice notes, typed notes, timers, and images while working at the bench",
  files each note "under the experiment section you choose", and says
  "Transcription, image text extraction, and draft generation happen on your
  iPhone." It deliberately "organizes your captures without deciding their
  scientific meaning" ([listing][b-verbex]): no tolerance checks or flags.
- **LabLogger.** Released August 25, 2026, free: "Voice capture. Dictate while
  your hands are busy, gloved, or holding something you can't put down."
  ([listing][b-lablogger])
- **Lab Laps, the closest on protocols and timers.** "AI PROTOCOL SCANNING Turn
  a photo, PDF, or file into a structured project with materials and timed
  steps", and "active timers can stay visible with Live Activities"; it is
  "GREAT FOR bench scientists, students, and teams who want fewer missed steps"
  ([listing][b-lablaps]). No voice is described, and it has the most ratings of
  the bench tools.
- **LabProtocol.** "LabProtocol turns any laboratory protocol into an
  interactive checklist that guides you through the experiment step by step",
  with AI import and taps, not voice ([listing][b-labprotocol]).
- **Institutional notebooks.** LabArchives' Android app offers "dictate text
  entries" ([listing][b-labarchives]), and LabArchives sells an education
  edition that it says "has proven results in thousands of STE lab courses"
  ([LabArchives][b-labarchives-edu]); Labguru offers to "Follow step-by-step
  workflows without carrying a laptop to the bench or cleanroom"
  ([listing][b-labguru]); eLABJournal lets users "View protocols or procedures
  and walk through them step by step" ([listing][b-elab]); and SciNote offers
  "completing the protocol steps on the fly" but was last updated in March 2024
  ([listing][b-scinote]). They sell to institutions, not students.
- **The voice lab assistant that left.** Labforward merged with LabTwin on
  September 17, 2024 ([Labforward][b-labtwin-merge]), and its April 10, 2025
  release said the beta Labfolder Go "supports both iOS and Android"
  ([release][b-labfolder-go]). On September 22, 2026 the Play listings for
  LabTwin and protocols.io returned HTTP 404, and the App Store search found
  neither LabTwin nor Labfolder Go.
- **Timers and calculators.** Lab.Hacks offers "essential tools, calculators" to
  "a student, researcher, or lab technician", and has 2,140 ratings on Google
  Play ([App Store][b-labhacks]; [Google Play][b-labhacks-gp]); Laboratory Timer
  runs "multiple alarm timers for laboratory at once" and was last updated in
  2019 ([listing][b-labtimer]).
- Synthesis: each of Bench's parts ships somewhere: voice capture at the bench
  (Verbex, LabLogger), photo-to-steps with Live Activity timers (Lab Laps), and
  step checklists (LabProtocol). No listing read checks a spoken value against
  the protocol's tolerance or flags a deviation live, which is the part Jev
  would do. The one well-funded voice lab assistant, LabTwin, is no longer in
  the stores.

[b-verbex]: https://apps.apple.com/us/app/verbex-lab-notes/id6758427118
[b-lablogger]: https://apps.apple.com/us/app/lablogger-ai-lab-notebook/id6797163239
[b-lablaps]: https://apps.apple.com/us/app/lab-laps-colony-counter/id6760195063
[b-lablaps-gp]: https://play.google.com/store/apps/details?id=com.lablaps.app
[b-labprotocol]: https://apps.apple.com/us/app/labprotocol/id6761419953
[b-labarchives]: https://play.google.com/store/apps/details?id=com.labarchives.android_twa_us
[b-labguru]: https://apps.apple.com/us/app/labguru-by-cenevo/id1555918944
[b-elab]: https://apps.apple.com/us/app/elabjournal/id932410151
[b-scinote]: https://apps.apple.com/us/app/scinote/id1660589965
[b-labhacks]: https://apps.apple.com/us/app/lab-hacks/id1462593060
[b-labtimer]: https://apps.apple.com/us/app/laboratory-timer/id537195348
[b-labarchives-edu]: https://www.labarchives.com/products/eln-for-education
[b-labtwin-merge]: https://labforward.io/resources/labforward-merges-with-labtwin
[b-labfolder-go]: https://labforward.io/blog/labfolder-go-app-press-release
[b-labhacks-gp]: https://play.google.com/store/apps/details?id=com.chrostudios.labhacks

### Bench in the 2026 gallery

- **Searches.** "Lab notebook" had [one hit][s-lab-notebook], Patterns, which
  runs "small personal experiments on your habits"; "wet lab" had
  [one][s-wet-lab], Deep-Session; and "pipette" [(0)][s-pipette], "reagent"
  [(0)][s-reagent], "titration" [(0)][s-titration], "microscope"
  [(0)][s-microscope], and "lab report" [(0)][s-lab-report] had none.
  "Hands-free" had [18][s-hands-free].
- **Deep-Session.** A researcher's session journal: "I wanted a lightweight
  journal for wet lab, analysis, reading, and writing—one session, one unit of
  work, then a short reflection". It's an Android app with a timer and a
  three-question reflection, and it lists one builder
  ([Deep-Session][p-deep-session]). It has no protocol steps, voice, or values.
- **Stir.** "Stir is an AI cooking copilot that guides you hands-free through
  recipes with voice, smart timers, and fridge vision so you can cook
  confidently without touching your phone." It is built with Expo and Gemini
  Live, lists one builder, and links an App Store listing ([Stir][p-stir]). It
  is Bench's loop for recipes.
- **SciNova AI.** A web "Science Hub" with an "AI Science Chat", aimed
  "especially for students" ([SciNova AI][p-scinova]); it's a science explainer,
  not a bench tool.
- Synthesis: no entry works at the lab bench, but Stir already shows the
  hands-free voice, step, and timer loop, in cooking. Bench's originality rests
  on the lab specifics: values, tolerances, deviations, and hazards.

[s-lab-notebook]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22lab+notebook%22
[s-wet-lab]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22wet+lab%22
[s-pipette]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=pipette
[s-reagent]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=reagent
[s-titration]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=titration
[s-microscope]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=microscope
[s-lab-report]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22lab+report%22
[s-hands-free]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22hands-free%22
[p-deep-session]: https://devpost.com/software/deep-session
[p-stir]: https://devpost.com/software/stir-phlj4i
[p-scinova]: https://devpost.com/software/scinova-ai-intelligent-science-lab

### Evidence that Bench's problem matters

- **Records at a lab accident.** On January 7, 2010, a Texas Tech graduate
  student was injured in an explosion, with "the loss of three fingers,
  perforation of his eye, and cuts and burns" ([CSB release, October 19,
  2011][b-csb-release]). The U.S. Chemical Safety Board found that "Laboratory
  notebooks were not dated and did not always indicate amounts of reactants used
  during synthesis", and that "Since 2001, the CSB has gathered preliminary
  information on 120 different university laboratory incidents" ([CSB
  report][b-csb-report]).
- **Training gaps.** In a 2012 survey with 991 academic respondents, "about 25%
  of all researchers were not trained on the specific hazard with which they
  worked" ([Schröder et al., 2016][b-schroder]). A 2020 review adds that "the
  study of academic lab safety is still underdeveloped" ([Ménard and Trant,
  Nature Chemistry, 2020][b-menard]).
- **Reproducibility.** "Two-thirds of researchers who responded to a survey by
  this journal said that current levels of reproducibility are a major problem"
  ([Nature, May 25, 2016][b-nature-2016]). Nature later summarized the same
  survey: "Nature asked 1,576 scientists", and "over 70% said they'd tried and
  failed to reproduce another group's experiments" ([Nature,
  2019][b-nature-2019]).
- **The notebook burden.** In a 2026 survey at one institution adopting the
  eLabFTW notebook (55 analyzable responses), respondents cited "time burden
  (67%), inefficient organization (63%), and difficulties retrieving information
  (63%)", and "paper notebooks (85%)" were among the tools that "dominate"
  ([Jäger et al., PLoS One, 2026][b-elabftw]).
- **How many students.** No NCES or NSF count of lab-course enrollment turned
  up. As a proxy, U.S. colleges awarded 131,462 bachelor's degrees in biological
  and biomedical sciences and 28,301 in physical sciences in 2021–22 ([NCES
  Digest table 322.10][b-nces]).
- **Voice at the bench works in trials.** Voice control of lab instruments
  reached "high mean accuracy (95% ± 3.62) of speech command recognition"
  ([Austerjost et al., SLAS Technology, 2018][b-voice-2018]), and a lab voice
  assistant reached 91.3% accuracy against 85.1% for a stock recognizer, and
  98.6% after lab-specific tuning ([Avila Vazquez et al., Scientific Reports,
  2023][b-voice-2023]).
- Synthesis: lab safety and record keeping are documented problems, but no
  source ties them to lab-course students' notebooks, and none counts the
  students. The evidence is moderate for the problem and weak for the audience.

[b-schroder]: https://escholarship.org/uc/item/9q21s3z7
[b-menard]: https://pubmed.ncbi.nlm.nih.gov/31740762/
[b-nature-2016]: https://www.nature.com/articles/533437a
[b-nature-2019]: https://www.nature.com/articles/d41586-019-00067-3
[b-elabftw]: https://pubmed.ncbi.nlm.nih.gov/42623395/
[b-voice-2018]: https://pubmed.ncbi.nlm.nih.gov/30021077/
[b-voice-2023]: https://pubmed.ncbi.nlm.nih.gov/37945580/

### Bench on students' devices

- **Reading the protocol.** `RecognizeDocumentsRequest` (iOS 26) "extracts
  different groups of text and barcodes within the document image", including
  "tables and lists" ([technology notes][tech-vision]). Foundation Models can
  turn that text into typed steps with guided generation, on Apple Intelligence
  iPhones only (the iPhone 15 Pro and later), in sessions of 4,096 tokens, and
  in the Simulator on an Apple Intelligence Mac ([technology notes][tech-fm];
  [devices][tech-ai-devices]).
- **Listening through earbuds.** `allowBluetoothHFP` is "An option that makes
  Bluetooth Hands-Free Profile (HFP) devices available for audio input", with
  the record and play-and-record categories ([Apple][bt-hfp]). iOS 26's
  `bluetoothHighQualityRecording` "enables full-bandwidth audio when the
  Bluetooth route supports it, such as on certain AirPods models", but
  "Bluetooth high-quality recording isn't currently supported in the European
  Union" ([Apple][bt-hq]). Transcription then works as for Turn, with lab words
  added as `contextualStrings` ([Apple][speech-context]).
- **Timers on the Lock Screen.** A Live Activity lasts "up to eight hours", its
  data "can't exceed a combined size of 4 KB", and it "can't access the network"
  ([Apple][la-doc]); local updates need no paid account, and `expo-widgets`
  builds Live Activities from Expo on iOS ([technology notes][tech-la];
  [modules][tech-modules]). Apple's page points to `numericText(countsDown:)`
  for timer text ([Apple][la-doc]).
- **Mirroring.** A partner's phone can follow the run over a WebSocket to a
  Durable Object ([technology notes][tech-do]).
- Synthesis: the heaviest native work of the five: document reading, the
  on-device model, Bluetooth input, live transcription, and a Live Activity.
  Filming it needs a physical iPhone 15 Pro or later, gloves, and a quiet enough
  bench.

[tech-vision]: /docs/research/next-gen-tech.md#vision-requests
[bt-hfp]: https://developer.apple.com/documentation/avfaudio/avaudiosession/categoryoptions-swift.struct/allowbluetoothhfp
[bt-hq]: https://developer.apple.com/documentation/avfaudio/avaudiosession/categoryoptions-swift.struct/bluetoothhighqualityrecording
[la-doc]: https://developer.apple.com/documentation/activitykit/displaying-live-data-with-live-activities
[tech-la]: /docs/research/next-gen-tech.md#live-activities

### Jev's jagged edges for Bench

- **Numbers, high.** Bench's core is values and tolerances, and TypeSafe says
  Jev "struggles with tasks that require numeric precision" and "Jev is not a
  calculator" ([jaggedness page][ts-jagged]). TypeSafe's own fix fits: "A regex
  finds the candidate values, TypeSafe picks the one the question asks for", so
  the result "cannot invent a value or transpose a digit"
  ([cookbook][cb-pre-parsed]). Code then checks the tolerance.
- **Calibration at the action threshold, medium to high.** Bench acts at p 0.85
  or more, but TypeSafe publishes no reliability curve; the only split is 27 of
  30 right at or above 0.9 on 60 filings with `jev-1.12`
  ([calibration][jp-calibration]).
- **Times, medium.** Durations such as "thirty minutes" belong in code, since
  Jev "reads dates as text, not as ordered quantities" ([jaggedness
  page][ts-jagged]).
- **Large state, medium.** A whole protocol is mostly irrelevant to one spoken
  note; send the current step and its neighbors ([jaggedness page][ts-jagged]).
- **Literal reading, medium.** "It went cloudy" is a deviation only against the
  step's expected result, which must be in the state as words.
- **Adversarial content and generation, low.** The speaker is the student, and
  the on-device model, not Jev, writes the steps.

### Bench without Jev

- **Apple's parsers don't cover lab values.** `NSDataDetector` finds "dates,
  addresses, links, phone numbers, and transit information" and "discards
  potential matches in case of uncertainty" ([Apple][b-nsdatadetector]), so a
  spoken "fifty microliters" needs the app's own parser; Apple's `UnitVolume`
  lists milliliters and cubic millimeters but no microliters
  ([Apple][b-unitvolume]).
- **Parsing beats a language model at pulling quantities.** On 590 news
  sentences, CQE, which "makes use of dependency parsing and a dictionary of
  units", scored an F1 of 85.6 for values with units, against 59.1 for few-shot
  GPT-3 and 47.2 for the Quantulum3 library; for linking a number to what it
  measures, the task closest to "which number counts", strict F1 was 57.0
  against 25.7, and "Even GPT-3 struggles" ([Almasian et al., EMNLP
  2023][b-cqe]). TypeSafe's cookbook pairs the two: a regex finds the
  candidates, and Jev picks one ([cookbook][cb-pre-parsed]).
- **Placing speech on steps.** Classic classifiers placed operating-room speech
  in the right surgical phase with "82.95% average accuracy", with phrases
  "misplaced due to the similarity in the words used" ([Guzmán-García et al.,
  2021][b-surgical]); speech recognition plus a rule engine built from the WHO
  surgical checklist reached 93.8% checklist verification accuracy in
  simulation, and "Residual failures were mainly associated with extreme speech
  overlap and unseen vocabulary" ([Shi et al., 2025][b-who]); and an offline
  intent parser recognized intents "with 92.8-94.8% accuracy" ([Medroa et al.,
  2025][b-rhasspy]).
- **Hazard words are about chemicals, not events.** OSHA's hazard statement
  "describes the nature of the hazard(s) of a chemical" ([29 CFR
  1910.1200][b-osha]); a list of those phrases doesn't recognize "it spilled on
  my glove".
- **Rare, serious events are hard for any text classifier.** On real, imbalanced
  patient-safety incident reports, extreme-risk incidents were identified with
  F-scores of 25.5% from semantic features and 19.8% from bag-of-words features,
  against 87.3% on a balanced benchmark ([Wang and Coiera, JAMIA,
  2020][b-rare]).
- **The on-device model.** It can structure a protocol into steps offline, which
  is how Bench already uses it, and could classify notes, but it can't gate on a
  probability, which Bench's p 0.85 rule needs ([simpler
  methods](#what-simpler-methods-offer)).
- Synthesis: for Bench's numbers, a published parser beat a language model, and
  TypeSafe's own guidance agrees. For step placement, keyword and rule systems
  reach 83% to 95% in trials outside the lab. What's left for Jev is judging
  deviations and spills in free speech, the rare-event task where every
  published text method is weakest.

[b-unitvolume]: https://developer.apple.com/documentation/foundation/unitvolume
[b-cqe]: https://aclanthology.org/2023.emnlp-main.793/
[b-surgical]: https://pubmed.ncbi.nlm.nih.gov/33668544/
[b-who]: https://pubmed.ncbi.nlm.nih.gov/41601542/
[b-rhasspy]: https://pubmed.ncbi.nlm.nih.gov/41444572/
[b-osha]: https://www.ecfr.gov/current/title-29/section-1910.1200
[b-rare]: https://pubmed.ncbi.nlm.nih.gov/32574362/

### Harm from a wrong Bench decision

- **Automation bias.** "Automation bias results in making both omission and
  commission errors when decision aids are imperfect", and it "cannot be
  prevented by training or instructions" ([Parasuraman and Manzey,
  2010][b-automation]). In an e-prescribing study of 120 medical students,
  "Incorrect CDS increased omission errors by 33.3%" ([Lyell et al.,
  2017][b-cds]).
- **An unchecked deviation.** At Texas Tech the students scaled a synthesis to
  about 10 grams, and "The PIs of the research were not consulted on the
  decision to scale up" ([CSB report][b-csb-report]); the CSB found "two
  previous near-misses within the laboratories of the same principal
  investigators since 2007" ([CSB release][b-csb-release]).
- **Transcripts carry errors.** Speech-recognized clinical notes had a 7.4% word
  error rate before review and 0.4% after a transcriptionist's review ([Zhou et
  al., JAMA Network Open, 2018][b-sr-notes]).
- **Phones and earbuds at the bench.** Boston University's policy says personal
  electronic devices "should not be allowed" "Any time chemicals, hazardous
  materials, or biohazardous materials are used in the laboratory" and "While
  wearing gloves", and it counts "headphones/earbuds" as such devices ([BU
  policy][b-bu]). In a 2020 study of the phones of 126 students and 37
  laboratory staff at a Malaysian university's health faculty, "All of the
  tested MPs were contaminated", and the authors recommend "restricting the use
  of MPs in laboratory environments" ([Hikmah et al., 2020][b-phones]).
- Synthesis: a false green tick is the worst Bench error, because automation
  bias means students stop checking; a missed hazard flag is worse still if
  students treat the app as a safety net. The larger risk to the idea is
  institutional: at universities with rules like Boston University's, the demo's
  gloved hands, phone, and earbuds are not allowed at the bench.

[b-automation]: https://pubmed.ncbi.nlm.nih.gov/21077562/
[b-cds]: https://pubmed.ncbi.nlm.nih.gov/28302112/
[b-sr-notes]: https://pubmed.ncbi.nlm.nih.gov/30370424/
[b-bu]: https://www.bu.edu/research/forms-policies/policy-on-the-safe-use-of-personal-electronic-devices-in-the-laboratory/
[b-phones]: https://pubmed.ncbi.nlm.nih.gov/32788850/

## Chorus, group captions for Deaf and hard-of-hearing adults

Candidate 1. For project meetings and meals with friends: each member's phone
transcribes its owner, a shared Durable Object merges one attributed transcript,
and Jev flags each line as addressed to the user, a question, a task and who
takes it, a deadline, or a topic shift (about 6 questions an utterance, 10 to 30
calls a minute). The user's phone buzzes above p 0.8, and tasks land on a shared
board. Captions are free; a subscription adds groups of three or more, history,
and export.

### Chorus rival apps

Group captions on several phones already ship, and one app buzzes its user for
their name or a question. Counts are US ratings on the listing.

| App                                | Store       | Maker              | Price and in-app purchases                          | Ratings        | Average        | Updated    |
| ---------------------------------- | ----------- | ------------------ | --------------------------------------------------- | -------------- | -------------- | ---------- |
| [Hearing Buddy][c-hb]              | App Store   | Krager Labs LLC    | Free; Buddy+ $9.99 a month or $59.99 a year         | 134            | 4.10           | 2026-09-18 |
| [Ava][c-ava]                       | App Store   | Transcense Inc.    | Free; Community $14.99, yearly $119.99; credits     | 4,194          | 4.40           | 2026-08-28 |
| [Ava][c-ava-gp]                    | Google Play | Ava Accessibility  | Free; in-app purchases                              | 720            | 4.15           | 2026-08-31 |
| [Live Transcribe][c-lt-ios]        | App Store   | Mighty Fine Apps   | Free; $4.99 to $9.99 a month; $49.99 to $79.99 year | 7,795          | 4.62           | 2026-09-19 |
| [Live Transcribe][t-lt]            | Google Play | Research at Google | Free                                                | 268,622        | 3.88           | 2026-08-17 |
| [Otter][c-otter]                   | App Store   | Otter.ai, Inc.     | Free; Pro $16.99 a month or $99.99 a year           | 80,524         | 4.79           | 2026-09-15 |
| [Rylo, formerly Nagish][c-rylo]    | App Store   | Nagish Inc.        | Free                                                | 3,671          | 4.61           | 2026-09-17 |
| [InnoCaption][c-inno]              | App Store   | Mezmo Corporation  | Free                                                | 11,979         | 4.68           | 2026-09-18 |
| [Rogervoice][c-roger]              | App Store   | RogerVoice         | Free; Freedom $5.99; Premium $29.99                 | 1,702          | 4.75           | 2026-08-31 |
| Live Captions and Name Recognition | Built in    | Apple              | Free with iOS                                       | Not applicable | Not applicable | iOS 26     |

- **Hearing Buddy, the closest rival.** Built "by someone who is hard of
  hearing", it was a "2026 Apple Design Award Finalist (Inclusivity)". Its
  listing: "In meetings, classes, and group conversations, more people can turn
  on their mic, and every voice flows into one shared transcript", and "When
  someone says your name, your Apple Watch taps your wrist. The same tap tells
  you when someone asks a question." Sharing works "directly between devices. No
  internet, no account, no server." Captions and sharing are free; "Name and
  question alerts on Apple Watch, iPhone, and Lock Screen" and "Conversation
  summaries" are Buddy+ features ([listing][c-hb]). Apple's awards page says it
  "uses the Foundation Models framework and on-device speech-to-text features"
  ([Apple Design Awards][c-ada]).
- **Ava.** "To use voice to text in group conversations, invite users to
  download the Ava app with a QR code or link so they can connect with you
  instantly. Ava shows a real-time color-coded transcript of who says what." Its
  free plan allows "up to 40-minute-long sessions" ([listing][c-ava]). It flags
  nothing.
- **Single-phone captioners.** Mighty Fine's Live Transcribe offers "Speaker
  Detection — Follow group chats with color-coded words" ([listing][c-lt-ios]);
  Google's Live Transcribe lets users set a phone "to vibrate when your name's
  spoken" ([Android accessibility][c-android-audio]).
- **Meeting notes.** Otter lets users "Tag the speakers to label the paragraphs"
  and "Add comments and assign action items" ([listing][c-otter]); it is a
  meeting tool, not one built for Deaf users.
- **Phone-call captions.** Rylo, InnoCaption, and Rogervoice caption calls; Rylo
  adds "Rylo Live Transcribe", which "captions in-person conversations
  instantly" ([Rylo][c-rylo]; [InnoCaption][c-inno]; [Rogervoice][c-roger]).
- **Apple, built in.** Live Captions transcribe "live conversations around you"
  on the iPhone 11 or later, and Name Recognition, from iOS 26, can
  "continuously listen for your name and notify you when it's detected" ([Live
  Captions][c-captions]; [Name Recognition][c-name]).
- Synthesis: Chorus's core, one shared transcript from several phones plus a tap
  when the user is named or asked something, ships in Hearing Buddy, an Apple
  Design Award finalist whose paid tier sells the alerts. Chorus's remaining
  differences are its task and deadline flags, the shared task board, and
  attributing each line to a speaker's own phone.

[c-hb]: https://apps.apple.com/us/app/hearing-buddy-speech-to-text/id6747363502
[c-ava]: https://apps.apple.com/us/app/ava-transcribe-voice-to-text/id1030067058
[c-ava-gp]: https://play.google.com/store/apps/details?id=me.ava.android
[c-otter]: https://apps.apple.com/us/app/otter-transcribe-voice-notes/id1276437113
[c-rylo]: https://apps.apple.com/us/app/rylo-live-call-captioning/id1514154600
[c-inno]: https://apps.apple.com/us/app/innocaption-call-captioning/id1333988644
[c-roger]: https://apps.apple.com/us/app/rogervoice-call-captions/id1033113354
[c-android-audio]: https://www.android.com/accessibility/audio/

### Chorus in the 2026 gallery

- **Searches.** "Deaf" still had [one hit][s-deaf], the workout app Muscle
  Odyssey, as in the [gallery notes][gallery-open]. "Hard of hearing"
  [(0)][s-hoh], "hearing loss" [(0)][s-hearing-loss], "hearing aid"
  [(0)][s-hearing-aid], "live captions" [(0)][s-live-captions], "diarization"
  [(0)][s-diarization], and "SpeechTranscriber" [(0)][s-speechtranscriber] had
  none.
- **Solo transcription tools.** Textik "turns voice memos, lectures and meetings
  into searchable, timestamped text" ([Textik][p-textik]), and Meeting Copilot
  is "a Chrome extension providing live meeting transcription and AI Q&A
  assistance" ([Meeting Copilot][p-meeting-copilot]), a browser tool of the kind
  Next Gen doesn't accept ([Next Gen notes][ng-submit]).
- **Hivenotes.** A project that the [Next Gen notes][ng-field] tie to the award
  by search, with two team members listed: "a collaborative classroom notebook"
  in which students can "Record lectures and generate transcripts"
  ([Hivenotes][p-hivenotes]).
- **Usme.** It reads captured voice and text "for the people, projects, places
  and promises inside it", and names "the promise you made in a meeting on
  Tuesday" as the failure it prevents ([Usme][p-usme]): Chorus's task
  extraction, for one person.
- **The name.** An Android entry is already called Chorus: "A way to gather the
  voices and stories that capture life's most meaningful moments"
  ([Chorus][p-chorus-other]).
- Synthesis: no entry serves Deaf or hard-of-hearing users, so Chorus's audience
  is open, but the name is taken.

[s-deaf]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=deaf
[gallery-open]: /docs/research/gallery-2026.md#open-idea-spaces
[s-hoh]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22hard+of+hearing%22
[s-hearing-loss]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22hearing+loss%22
[s-hearing-aid]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22hearing+aid%22
[s-live-captions]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22live+captions%22
[s-diarization]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=diarization
[s-speechtranscriber]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=SpeechTranscriber
[p-textik]: https://devpost.com/software/textik
[p-meeting-copilot]: https://devpost.com/software/meeting-copilot
[ng-submit]: /docs/research/next-gen.md#what-a-next-gen-entry-must-submit
[p-usme]: https://devpost.com/software/magpie-ask-your-life-a-question
[p-chorus-other]: https://devpost.com/software/chorus-lbiwje

### Evidence that Chorus's problem matters

- **How many adults.** NIDCD: "Approximately 15% of American adults (37.5
  million) ages 18 and over report some trouble hearing" ([NIDCD][c-nidcd]); the
  figure traces to the 2012 National Health Interview Survey (Blackwell et al.,
  2014), cited on a page updated September 20, 2024. CDC's newer brief, on 2019
  data: "13.0% of adults aged 18 and over had some difficulty hearing even when
  using a hearing aid and 1.6% either had a lot of difficulty hearing or could
  not hear at all", and the second share was 0.6% among adults aged 18 to 44
  ([CDC data brief 414][c-db414]).
- **How many students.** NCES's most recent breakdown by type is old: in
  2008–09, "difficulty hearing" was 4% of the disabilities reported by colleges
  ([NCES 2011-018][c-nces-2011]); its 2019–20 figure, 21 percent of
  undergraduates reporting a disability, isn't broken out by hearing ([NCES Fast
  Facts][c-nces-fast]).
- **Group conversation is the hard case.** "Dinner table syndrome" names the
  experience that "deaf individuals are excluded from the flow of conversations
  at mealtime" ([Meek, 2020][c-meek]). In captioning research, difficulties come
  from "simultaneous utterances from multiple speakers and speakers whom may be
  potentially out of view" ([SpeechBubbles, CHI 2018][c-speechbubbles]), and
  Deaf and hard-of-hearing people "face barriers to communication in small-group
  meetings with hearing peers" ([Seita et al., ASSETS 2018][c-seita]).
- **Automatic captions struggle with groups.** On the CHiME-6 dinner-party
  recordings, the baseline word error rate was 51.8% on the development set and
  51.3% on evaluation, rising to 84.3% and 77.9% when diarization replaced
  oracle segmentation ([Watanabe et al., 2020][c-chime6]). Whisper large-v2
  scored 2.7% on clean read speech, 16.9% on meetings recorded with headset
  microphones, and 36.4% from a single distant microphone ([Radford et al., ICML
  2023][c-whisper]).
- Synthesis: the population is large and counted by NIDCD and CDC, and group
  conversation is a documented barrier; the student numbers are old. The same
  research shows why group captions are hard: many voices at once, far from any
  one microphone.

[c-nces-2011]: https://nces.ed.gov/pubs2011/2011018.pdf
[c-nces-fast]: https://nces.ed.gov/fastfacts/display.asp?id=60
[c-meek]: https://doi.org/10.46743/2160-3715/2020.4203
[c-speechbubbles]: https://doi.org/10.1145/3173574.3173867
[c-seita]: https://doi.org/10.1145/3234695.3236355
[c-chime6]: https://www.isca-archive.org/chime_2020/watanabe20b_chime.pdf
[c-whisper]: https://proceedings.mlr.press/v202/radford23a/radford23a.pdf

### Chorus on students' devices

- **One transcriber per phone.** Each phone runs `SpeechTranscriber`
  ([technology notes][tech-speech]), or `expo-speech-recognition` from Expo
  ([README][esr]).
- **"Only its owner" has no API.** The Speech framework's modules are
  `SpeechTranscriber`, `DictationTranscriber`, and `SpeechDetector`, whose
  "voice activity detection (VAD) analysis" asks "is there speech?" ([Speech
  framework][speech-topics]; [SpeechDetector][speech-detector]). None identifies
  who is speaking, so every phone at a table hears every speaker, and the server
  has to drop the copies.
- **Buzzing without push.** A free account can't send push notifications
  ([accounts][tech-accounts]). Apple's docs say "a background app could ask the
  system to display an alert" with a local notification ([Apple][local-notif]),
  and `expo-audio`'s background recording option "adds the audio background
  mode" on iOS ([expo-audio]), so the buzz can work only while Chorus keeps
  recording.
- **Merging.** Each group gets a Durable Object that holds the merged transcript
  and relays it over WebSockets ([technology notes][tech-do]).
- **Devices for the demo.** The video needs three or more phones. A free
  personal team registers "up to 3 devices", which expire after 7 days ([Next
  Gen notes][ng-free-limits]); Android phones can take a debug build without an
  account.
- Synthesis: the hardest of the five to demo well: several phones, duplicate
  lines from cross-talk, and a buzz that depends on the app staying alive in the
  background.

[speech-topics]: https://developer.apple.com/documentation/speech
[speech-detector]: https://developer.apple.com/documentation/speech/speechdetector
[local-notif]: https://developer.apple.com/documentation/usernotifications/scheduling-a-notification-locally-from-your-app
[ng-free-limits]: /docs/research/next-gen.md#free-provisioning-limits

### Jev's jagged edges for Chorus

- **Literal reading and indirection, high.** Whether a line is addressed to the
  user depends on names, gaze, and the turn before; "Can you take the slides?"
  names no one. Jev "answers the question you wrote, not the one you meant", and
  multi-hop questions cost accuracy ([jaggedness page][ts-jagged]).
- **Dates, high.** Deadlines arrive as "Thu" or "by next Friday", and Jev "reads
  dates as text, not as ordered quantities"; TypeSafe's fix is to extract each
  date part as a Choice and compute in code ([jaggedness page][ts-jagged]).
- **Consistency at the buzz threshold, medium.** A 0.8 threshold sits where
  repeated calls can flip ([consistency][jp-consistency]), so the same line can
  buzz once and not the next time.
- **Structural invariants, medium.** "Question" and "task" are separate Nouls
  that can both be high; code decides which card to show ([jaggedness
  page][ts-jagged]).
- **Large state, medium.** The addressee needs the last few lines, not the whole
  meeting ([jaggedness page][ts-jagged]).
- **English first, medium.** Accuracy is best in English ([Jev
  notes][jev-lang]).

### Chorus without Jev

- **Name spotting covers a fifth of the job.** In a multi-party dialogue corpus,
  "explicit addressees are indicated in approximately 20% of conversational
  turns" ([IWSDS 2025 paper, arXiv][c-iwsds]). In meetings, a task's owner "may
  occasionally be expressed by explicit use of a name, but is more often
  specified through the interaction itself" ([Purver et al., 2007][c-purver]).
  Apple's Name Recognition and Google's Live Transcribe already alert on names
  ([rivals](#chorus-rival-apps)).
- **Addressees without gaze.** On four-person meetings, a classifier using
  utterance features alone found the addressee 52.62% of the time, 76.82% with
  conversational context, and 82.59% with gaze as well, where always guessing
  "the whole group" scores 40.20% ([Jovanović et al., 2006][c-jovanovic]). In a
  2026 study on meetings, an SVM scored 56.4% against a 47.6% baseline, and the
  language models tested scored 52.3% (Qwen3-14B) and 55.7% (Gemini 2.5 Pro)
  ([Interspeech 2026 preprint][c-is26]).
- **Questions.** In ICSI meetings, 6,318 of 63,514 utterances were questions;
  detection from words scored an F-measure of 67.48 on human transcripts and
  51.64 on automatic ones, partly because declarative questions "do not differ
  in syntax from statements" ([Boakye et al., 2009][c-boakye]).
- **Tasks.** "only 1.4% of utterances" in the meeting data carried an
  action-item class, and earlier systems reached "f-scores limited to
  approximately 0.3, even given manual transcripts and dialogue act tags"
  ([Purver et al., 2007][c-purver]).
- **Deadlines.** `NSDataDetector` finds dates in text on the phone but "discards
  potential matches in case of uncertainty" ([Apple][b-nsdatadetector]).
- **The on-device model.** Hearing Buddy already uses Foundation Models for
  captions and summaries ([Apple Design Awards][c-ada]); it could tag lines
  offline, but it can't gate a buzz on a probability ([simpler
  methods](#what-simpler-methods-offer)).
- Synthesis: the published accuracy for Chorus's flags is low for every method,
  from keyword rules to large language models, and no study measures any of them
  on live captions of in-person groups. Names and dates are cheap in code;
  addressees and tasks are the hard, unmeasured part Jev would own.

[c-iwsds]: https://arxiv.org/abs/2501.16643
[c-jovanovic]: https://aclanthology.org/E06-1022/
[c-is26]: https://arxiv.org/abs/2606.17542
[c-boakye]: https://doi.org/10.1109/ASRU.2009.5373293

### Harm from a wrong Chorus decision

- **What users want most.** In a survey of Deaf and hard-of-hearing people,
  "urgent alerts and voices directed at you are considered of highest interest",
  and "A sound sensing system that presents all sounds to users may overwhelm
  them" ([Findlater et al., CHI 2019][c-findlater]).
- **False alarms wear out attention.** Alarm desensitization is "related to a
  high false alarm rate, poor positive predictive value" ([Cvach,
  2012][c-cvach]).
- **Wrong owners.** For action items, "Establishing identity therefore becomes a
  problem of speaker and addressee identification" ([Purver et al.,
  2007][c-purver]), the step with the lowest published accuracy above.
- **Over-reliance.** Apple warns that "The accuracy of Live Captions may vary
  and shouldn't be relied upon in high-risk or emergency situations", and "Don't
  rely on your iPhone to recognize your name in circumstances where you may be
  harmed or injured or in high-risk or emergency situations" ([Live
  Captions][c-captions]; [Name Recognition][c-name]).
- **Error rates understate harm.** Evaluating captions for Deaf and
  hard-of-hearing users, Kafle and Huenerfauth note that "WER has been found to
  have little correlation with human-subject performance on many applications",
  and propose a captioning-focused measure instead ([ASSETS 2017][c-kafle]).
- Synthesis: a missed "Question for you" repeats the exclusion Chorus exists to
  end, and frequent false buzzes teach the user to ignore it. A task given to
  the wrong person on the shared board is visible to the whole group, which
  makes that error social, not just technical.

[c-findlater]: https://doi.org/10.1145/3290605.3300276
[c-cvach]: https://pubmed.ncbi.nlm.nih.gov/22839984/
[c-kafle]: https://doi.org/10.1145/3132525.3132542

## Same Boat, office hours grouped by problem

Candidate 3. For large courses, with students aged 18 and over: students join by
course code and type questions, and for each one Jev chooses an open group or
"new", an FAQ entry or "none", and an assignment part, and scores the effort
shown; merges between p 0.5 and 0.8 ask "Same as this?". The TA's iPad sorts the
groups, and students see how many others are stuck on the same thing. Students
use it free; the TA buys a per-term Course Pass.

### Same Boat rival apps

Course Q&A apps are old and poorly rated on phones, and the office-hours queues
that group students are web tools that group by hand. Counts are US ratings on
the listing.

| App                             | Store       | Maker                     | Price and in-app purchases             | Ratings | Average | Updated    |
| ------------------------------- | ----------- | ------------------------- | -------------------------------------- | ------- | ------- | ---------- |
| [Piazza][sb-piazza]             | App Store   | Piazzza, Inc.             | Free                                   | 279     | 2.11    | 2026-09-09 |
| [Piazza][sb-piazza-gp]          | Google Play | Piazza Technologies, Inc. | Free                                   | 2,203   | 3.12    | 2026-07-22 |
| [Campuswire][sb-campuswire]     | App Store   | CampusTech, Inc.          | Free                                   | 66      | 2.53    | 2026-08-12 |
| [Top Hat][sb-tophat]            | App Store   | TopHatMonocle Corp        | Free                                   | 22,933  | 4.63    | 2026-09-14 |
| [Top Hat][sb-tophat-gp]         | Google Play | Top Hat Corporation       | Free                                   | 4,269   | 2.92    | 2026-09-03 |
| [Poll Everywhere][sb-pollev]    | App Store   | Poll Everywhere, Inc.     | Free; annual paid participation $13.99 | 3,004   | 4.76    | 2026-09-22 |
| [Ed Discussion][sb-ed]          | Web only    | Ed                        | No public price found                  | None    | None    | Not shown  |
| [My Digital Hand][sb-mdh]       | Web only    | My Digital Hand           | Not stated                             | None    | None    | Not shown  |
| [Queue@Illinois][sb-queue-uiuc] | Web only    | University of Illinois    | Free at the university                 | None    | None    | Not shown  |
| [QueueStatus][sb-queuestatus]   | Web only    | QueueStatus, Inc.         | Not stated                             | None    | None    | Not shown  |
| [CS50.ai][sb-cs50ai]            | Web only    | Harvard CS50              | Not stated                             | None    | None    | Not shown  |

- **Piazza suggests duplicates.** Before a post, "instructors and students will
  begin to be prompted with a list of existing posts that might be similar to
  their question, note, or poll", and "This feature is enabled by default"
  ([Piazza help][sb-piazza-dupes]). It is a forum, not a live queue.
- **Campuswire votes instead of merging.** In its Live Sessions for office
  hours, "students can upvote their peers question topics so the best questions
  get discussed first" ([Campuswire][sb-cw-live]).
- **Class response tools.** Top Hat lets students "Contribute in class with an
  easy-to-use response system" ([listing][sb-tophat]), Poll Everywhere charges
  participants $13.99 a year on iOS to "Respond to live Poll Everywhere
  questions from anywhere" ([listing][sb-pollev]), and Ed Discussion, a web
  forum, promises "Questions reach and benefit all students in the class"
  ([Ed][sb-ed]); none runs an office-hours queue.
- **Slido clusters questions.** "Slido can cluster similar questions into
  topics, so you can spot repeats, group related themes and keep the Q&A
  flowing" ([Slido blog, April 1, 2026][sb-slido]); it serves events and
  lectures, with no FAQ answers or TA queue.
- **Office-hours queues group by hand.** Queue@Illinois: "By grouping students
  together based on the topic they are having trouble with, the instructor
  doesn't have to explain the same concept to several students separately"
  ([Queue@Illinois][sb-queue-uiuc]). QueueStatus lets "Queue administrators ...
  identify and bulk process queue entries with similar requests"
  ([QueueStatus][sb-queuestatus]). My Digital Hand keeps a waitlist and may ask
  "a few questions about your issue" first ([My Digital Hand][sb-mdh]).
- **AI teaching assistants write answers.** CS50.ai is "CS50's adaptation of
  ChatGPT for students and teachers" ([CS50.ai][sb-cs50ai]), which Jev never
  does.
- Synthesis: no store app groups live office-hours questions automatically. The
  grouping idea is established and manual in university web queues, and
  duplicate detection is a shipped default in Piazza's forum, so Same Boat's
  novelty is doing it live on phones and an iPad, with answers picked from the
  course's own FAQ.

[sb-campuswire]: https://apps.apple.com/us/app/campuswire/id1222147987
[sb-pollev]: https://apps.apple.com/us/app/poll-everywhere/id893375312
[sb-ed]: https://edstem.org/
[sb-mdh]: https://mydigitalhand.org/
[sb-queue-uiuc]: https://queue.illinois.edu/
[sb-queuestatus]: https://queuestatus.com/
[sb-cs50ai]: https://cs50.ai/
[sb-piazza-dupes]: https://support.piazza.com/support/solutions/articles/48000975998-instructors-duplicate-post-suggestions
[sb-cw-live]: https://campuswire.com/livesessions
[sb-slido]: https://blog.slido.com/save-time-and-boost-interaction-with-slido-ai-features/

### Same Boat in the 2026 gallery

- **Searches.** "Office hours" [(0)][s-office-hours], "teaching assistants"
  [(0)][s-teaching-assistants], "help queue" [(0)][s-help-queue], "Piazza"
  [(0)][s-piazza], and "course code" [(0)][s-course-code] had no hits; "teaching
  assistant" had [one][s-teaching-assistant], the puzzle app PuzzleMint.
- **Hivenotes.** The likely Next Gen entry described under Chorus lets a teacher
  compile "A structured study guide", "A glossary", and "Frequently asked
  questions", and lets students "Ask AI questions grounded in the class's
  material" ([Hivenotes][p-hivenotes]): Same Boat's FAQ half, without the queue.
- **A student entry for the same students.** AI study campanion was built by
  "first-year computer science students" to summarize "research papers, lecture
  notes, and programming concepts"; it has no queue or TA side ([AI study
  campanion][p-ai-study]).
- **Student-side AI tutors.** ExamCat is "a social studying app where students
  join a room with their friends and Junko, a cute AI cat"
  ([ExamCat][p-examcat]), and the gallery notes count 11 "AI tutors or homework
  solvers" ([saturated spaces][gallery-saturated]).
- Synthesis: no entry serves teaching assistants or office hours; the student
  side, AI tutors, is crowded.

[s-office-hours]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22office+hours%22
[s-teaching-assistants]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22teaching+assistants%22
[s-help-queue]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22help+queue%22
[s-piazza]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=Piazza
[s-course-code]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22course+code%22
[s-teaching-assistant]: https://revenuecat-shipaton-2026.devpost.com/submissions/search?terms=%22teaching+assistant%22
[p-ai-study]: https://devpost.com/software/ai-study-campanion-7xkblc
[p-examcat]: https://devpost.com/software/examcat
[gallery-saturated]: /docs/research/gallery-2026.md#saturated-idea-spaces

### Evidence that Same Boat's problem matters

- **Long waits at deadlines.** In UIUC's CS 124, with "nearly 2,000 students" a
  year, the average wait per student on due dates was "57.5 minutes on Fall 2021
  deadlines" and "39.1 minutes on Spring 2022 deadlines", while help itself took
  5.3 minutes on Fall 2021 deadlines ([SIGCSE 2024][sb-split]).
- **Students give up.** At NC State, "after waiting for 49 minutes, most
  students will cancel their help request", and "only 21% of students have
  commits while waiting" ([Gao, Lynch, and Heckman, March 22, 2023][sb-ncsu]).
- **Repeated questions.** CS50's office hours in 2010 "suffered from logistical
  inefficiencies, repetition of questions among students, and lack of
  communication among staff, which led to high wait times"; in Fall 2011 an
  average of 120 students came per night, and "wait times for students still
  sometimes exceeded an hour" ([MacWilliam and Malan, 2013][sb-malan]). On a
  course forum with 391 students, "25.6% of posts were duplicates at the time of
  posting" ([PARQR, L@S 2019][sb-parqr]).
- **Demand bunches.** At Duke, "a strong majority of interactions happen within
  3 days of the deadline" ([SIGCSE 2023][sb-duke]).
- **Enrollment.** U.S. bachelor's degrees in computer and information sciences
  rose from 50,961 in 2012–13 to 108,503 in 2021–22 ([NCES Digest table
  322.10][b-nces]). But CRA's 2025 Taulbee report finds "Total CS enrollment
  stood at 122,555 across the longitudinal cohort in 2025, still 27.7% above its
  2020 level but down 4.1% from its 2024 peak" ([CRA Taulbee 2025][sb-taulbee]).
- Synthesis: long waits and repeated questions in big courses are measured,
  though course by course; no study counts how many office-hours queue entries
  are duplicates, and CS enrollment has begun to fall from its peak.

[sb-split]: https://doi.org/10.1145/3626252.3630873
[sb-ncsu]: https://zenodo.org/records/7761609
[sb-duke]: https://users.cs.duke.edu/~ksm/pubs/sigcsets_2023_what-drives-students-to-office-hours.pdf
[sb-taulbee]: https://datavisualization.cra.org/TaulbeeReports/2025/bachelors.html

### Same Boat on students' devices

- **Typed input only.** Nothing needs perception: one Expo app runs on students'
  phones and the TA's iPad, and one Durable Object per session relays questions
  and groups over WebSockets ([technology notes][tech-do]). Nothing on Apple's
  paid-only list is needed ([accounts][tech-accounts]).
- **One request per question.** The Choices over open groups plus "new", over
  FAQ entries plus "none", and over assignment parts, and the effort Score,
  share one state and ride one request ([pattern notes][jp-fanout]); each Choice
  stays under the 255-option limit while a session has fewer than 255 open
  groups ([pattern notes][jp-choice]).
- **Answers are picked, not written.** Jev can choose an FAQ entry but can't
  write an answer ([Jev notes][jev-what]), which matches the design.
- Synthesis: the easiest of the five to build and film. Its risk is the quality
  of the merge decision, not the plumbing.

[jp-fanout]: /docs/research/jev-patterns.md#speculative-fan-out-pattern

### Jev's jagged edges for Same Boat

- **Adversarial content, high.** Students write the state, and "text that argues
  for its own classification, can move the answer" ([jaggedness
  page][ts-jagged]). "I've tried everything, this is urgent" can raise an effort
  Score.
- **Large, noisy state, medium to high.** Pasted code and stack traces are
  mostly irrelevant to whether two students share a bug; "Accuracy falls as the
  state grows with content unrelated to the decision" ([jaggedness
  page][ts-jagged]).
- **Literal reading, medium.** "Same bug" and "same topic" are different
  questions, and the criteria have to say which one counts ([jaggedness
  page][ts-jagged]).
- **Numbers, medium.** Line numbers, error codes, and test counts are numeric,
  where Jev is weaker; exact matches such as the same error code belong in code
  ([jaggedness page][ts-jagged]).
- **Structural invariants, medium.** A Choice over groups always picks one,
  while "each Noul is absolute and can be low for all of them" ([jaggedness
  page][ts-jagged]); a "new" option plus a Noul gate keeps a lone question from
  joining the wrong group.

### Same Boat without Jev

- **Embeddings are fast but trail pair models on duplicates.** Sentence-BERT cut
  finding the most similar pair "from 65 hours with BERT / RoBERTa to about 5
  seconds with SBERT, while maintaining the accuracy from BERT" ([Reimers and
  Gurevych, 2019][sb-sbert]). On Quora question pairs, duplicate-class F1 was
  73.44 for SBERT and 74.16 for the Universal Sentence Encoder, against 80.40
  for a BERT cross-encoder, with a majority baseline of 66.67 ([Thakur et al.,
  NAACL 2021][sb-augsbert]).
- **Keyword retrieval on a course forum.** PARQR, using TF-IDF, "correctly
  recommends a relevant post, if one exists, 73.5% of the time" ([PARQR, L@S
  2019][sb-parqr]).
- **Apple's own FAQ example.** Apple suggests sentence embeddings for exactly
  this: "you could use a sentence embedding to suggest a result from the FAQ
  with the similar title" ([Apple][sb-apple-faq]).
- **People can't match short questions either.** At CS50, "Students' brevity was
  detrimental to office hours' efficiency, as the greeter could not detect, and
  thus dispatch, students with equivalent questions to the same teaching
  assistant" ([MacWilliam and Malan, 2013][sb-malan]).
- **AI teaching assistants are right most of the time.** CS50's duck, retrieving
  from course material, gave correct answers on "22 out of 25 (88%) curricular"
  and "30 out of 39 (77%) administrative" questions ([Liu et al., SIGCSE
  2024][sb-cs50-2024]); Jill Watson passed 76.7% of 150 questions, against 31.3%
  for OpenAI Assistants ([AIED 2024][sb-jill]). A fine-tuned GPT-3.5 sorting
  2,082 help requests "approximated the accuracy and consistency across
  categories observed between two human raters" ([preprint,
  2023][sb-helpclass]).
- **Plain cosine similarity already helps.** Grouping queue entries by the
  cosine similarity of students' reported issues, simulated on "real office hour
  attendance data from a 480-person undergraduate course", gave "moderate
  decreases in student wait time during the semester overall (11% on average)",
  and 20% on the busiest days ([Hott, Floryan, and Basit, SIGCSE 2024
  poster][sb-grouping]).
- **The on-device model.** Apple warns that "Because of their smaller size,
  on-device models have limited reasoning abilities"
  ([Apple][sb-apple-prompting]), and lists "Create code" among capabilities to
  avoid ([simpler methods](#what-simpler-methods-offer)); students' questions
  about bugs often quote code.
- Synthesis: Same Boat's merge decision is the textbook duplicate-question task,
  where embeddings run offline on the phone at a known, moderate accuracy, and
  Apple's docs suggest them for FAQ matching. The case for Jev is its
  probabilities, which drive the "Same as this?" band, and one request for
  group, FAQ entry, and assignment part together.

[sb-sbert]: https://aclanthology.org/D19-1410/
[sb-augsbert]: https://aclanthology.org/2021.naacl-main.28.pdf
[sb-apple-faq]: https://developer.apple.com/documentation/naturallanguage/finding-similarities-between-pieces-of-text
[sb-jill]: https://doi.org/10.1007/978-3-031-64302-6_23
[sb-helpclass]: https://arxiv.org/abs/2310.20105
[sb-grouping]: https://doi.org/10.1145/3626253.3635544
[sb-apple-prompting]: https://developer.apple.com/documentation/foundationmodels/prompting-an-on-device-foundation-model

### Harm from a wrong Same Boat decision

- **Confident wrong answers.** CS50's team found that "AI tends to exhibit a
  tone of complete and authoritative confidence even when wrong" ([Liu et al.,
  SIGCSE 2024][sb-cs50-2024]); an FAQ answer shown to a student mid-panic
  carries the same risk, even when Jev only picks it.
- **Wrong merges.** No study measures a wrong merge in office hours; in the
  closest case, PARQR missed an existing relevant post about a quarter of the
  time ([PARQR, L@S 2019][sb-parqr]). A student merged into the wrong group
  waits for help with a problem they don't have.
- **Scoring effort.** No study of effort scores on help requests turned up. The
  nearest documented harm is automated judging of student writing: AI-text
  detectors "incorrectly labeled more than half of the TOEFL essays as
  'AI-generated' (average false-positive rate: 61.3%)", while classifying US
  eighth-graders' essays accurately ([Liang et al., Patterns, 2023][sb-liang]).
- **Student privacy law.** FERPA applies to institutions receiving funds "under
  any program administered by the Secretary" ([34 CFR 99.1][sb-ferpa-1]);
  education records are those "Directly related to a student" and "Maintained by
  an educational agency or institution or by a party acting for the agency or
  institution" ([34 CFR 99.3][sb-ferpa-3]); and an outside party counts as a
  school official only if it "Is under the direct control of the agency or
  institution with respect to the use and maintenance of education records" ([34
  CFR 99.31][sb-ferpa-31]). The Department of Education's guidance answers
  whether FERPA covers online services with "It depends", and says schools
  "should be clear with both teachers and administrators about ... who has the
  authority to enter into agreements with providers" ([PTAC, February
  2014][sb-ptac]). Campuswire "agrees to be designated as a 'School Official'"
  when it partners with an institution ([Campuswire][sb-cw-ferpa]).
- Synthesis: the harms are mostly time and trust: a wrong merge delays one
  student, a wrong FAQ pick misleads with borrowed authority, and an effort
  score can judge a student on how they write. A TA who buys a Course Pass alone
  may be entering the kind of agreement the guidance says needs the school's
  approval, so the per-TA purchase model sits awkwardly with FERPA.

[sb-liang]: https://www.ebi.ac.uk/europepmc/webservices/rest/PMC10382961/fullTextXML
[sb-ferpa-1]: https://www.ecfr.gov/current/title-34/part-99/section-99.1
[sb-ferpa-3]: https://www.ecfr.gov/current/title-34/part-99/section-99.3
[sb-ferpa-31]: https://www.ecfr.gov/current/title-34/part-99/section-99.31
[sb-ptac]: https://studentprivacy.ed.gov/sites/default/files/resource_document/file/Student%20Privacy%20and%20Online%20Educational%20Services%20(February%202014)_0.pdf
[sb-cw-ferpa]: https://campuswire.com/ferpa

## Jagged edges compared

The nine failure modes on TypeSafe's jaggedness page for `jev-1.13` ([jaggedness
page][ts-jagged]; [Jev notes][jev-limits]), plus four limits from the [pattern
notes][jp-notes], rated for each finalist. The ratings are this note's synthesis
from the sections above: "high" means the finalist's core decision lands on the
edge, "medium" that a design fix is needed, and "low" that the edge barely
applies.

| Jagged edge                              | Turn                  | Scenekeeper             | Bench                     | Chorus                   | Same Boat               |
| ---------------------------------------- | --------------------- | ----------------------- | ------------------------- | ------------------------ | ----------------------- |
| 1. Literal reading                       | Medium                | High: implied mood      | Medium                    | High: who is addressed   | Medium: bug or topic    |
| 2. Math and numbers                      | Low                   | Medium: difficulty      | High: values, tolerances  | Low                      | Medium: error codes     |
| 3. Dates and times                       | Low                   | Low                     | Medium: durations         | High: deadlines          | Low                     |
| 4. Indirection                           | Medium                | Medium: action to check | Medium                    | High: assignee           | Medium                  |
| 5. Large state full of irrelevant detail | Low                   | High: table chatter     | Medium: whole protocol    | Medium                   | Medium to high: code    |
| 6. Adversarial content                   | Low                   | Low to medium           | Low                       | Low                      | High: students' text    |
| 7. Contradictory instructions            | Low                   | Low                     | Low                       | Low                      | Low                     |
| 8. Structural invariants                 | Medium: none option   | Medium: combat vs calm  | Low                       | Medium: question or task | Medium: new option      |
| 9. Generation                            | Avoided by design     | Avoided by design       | Avoided: the model writes | Avoided by design        | Avoided by design       |
| Choice size (reliable to about 240)      | High: 240 phrases     | Low                     | Low                       | Low                      | Low                     |
| Consistency between identical calls      | Medium: row order     | Medium: flapping music  | Medium                    | Medium: buzz at 0.8      | Low to medium           |
| Calibration at the action threshold      | Low: the user taps    | Medium: 0.8 twice       | Medium to high: acts 0.85 | Medium: buzzes at 0.8    | Medium: asks 0.5 to 0.8 |
| Rate limit (1,200 a minute; 8 in flight) | Low: per partner turn | Medium: 15 to 25 a min  | Low                       | Medium: 10 to 30 a min   | Low: per question       |

- Synthesis: Bench's core decision sits on Jev's best-documented weakness,
  numbers, and Chorus's on two, dates and addressees read literally. Turn's main
  exposure is structural, a Choice at the edge of its reliable size, which code
  can halve with a first-stage filter. Same Boat is the only finalist whose
  users can write adversarial state.

[jev-limits]: /docs/research/jev.md#known-limitations-on-the-jaggedness-page

## Conflicts between sources

- **Gallery size on one day.** The gallery notes counted 1,115 projects on
  September 22, 2026, the Next Gen notes 1,145, and this note 1,148 ([gallery
  notes][gallery-notes]; [Next Gen notes][ng-gallery-counts];
  [gallery][dv-gallery]). The gallery grew during the day; the searches above
  are this note's own.
- **Personal Voice devices.** Apple's support article lists "iPhone 12 or later"
  among Personal Voice's requirements ([Apple support][t-pv-support]), while the
  iOS 27 iPhone User Guide says it "is available on iPhone 15 Pro models, iPhone
  16 models and later" ([iPhone User Guide][pv-guide]).
- **ALS figures on one CDC page.** The ALS Registry dashboard projects 34,720
  adults with ALS in 2026 and shows a "New U.S. Prevalence (CY 2025)" of 10.1
  per 100,000, while its footnote says "Calendar year 2018 is the most current
  prevalence data available at this time" and "Statistics current as of
  9/1/2023" ([CDC][t-als-cdc]). The live page refused `curl` later the same day;
  the figures come from a copy saved earlier that day.
- **Dungeons & Dragons' audience.** Hasbro counted "More than 50 Million Fans"
  on February 12, 2024 ([Hasbro][s-hasbro]); D&D Beyond thanked "all 85 million
  of you worldwide" on December 20, 2024 ([D&D Beyond][s-ddb-2024]).
- **Hearing figures.** NIDCD's 37.5 million adults with "some trouble hearing"
  comes from the 2012 National Health Interview Survey ([NIDCD][c-nidcd]); CDC's
  brief on 2019 data puts "some difficulty hearing even when using a hearing
  aid" at 13.0% of adults ([CDC data brief 414][c-db414]). The two measure
  different things in different years.
- **A listing's own count.** Mighty Fine's Live Transcribe claims "10k+ App
  Store reviews at 4.6 stars" in its description, while the US store shows 7,795
  ratings, probably because the claim counts every country
  ([listing][c-lt-ios]).
- **The same app in two stores.** Top Hat averages 4.63 on the App Store and
  2.92 on Google Play, and Piazza 2.11 and 3.12 ([Top Hat][sb-tophat]; [Top Hat
  on Play][sb-tophat-gp]; [Piazza][sb-piazza]; [Piazza on Play][sb-piazza-gp]);
  the tables give each store's own figure.
- **Counts that moved during the day.** The earlier evidence notes recorded
  4,193 ratings for Ava and 7,786 for Mighty Fine's Live Transcribe on the same
  date ([Earshot check][prior-earshot]); this note's reads showed 4,194 and
  7,795.
- **Choice size.** TypeSafe's API takes "a maximum of 255 options per Choice",
  while its classification cookbook says "a Choice works reliably up to roughly
  240 options" ([API notes][jev-api]; [cookbook][cb-classify-confidence]);
  Turn's 240 phrases sit at the second figure.
- **The on-device model's context.** Apple's context-window article gives 4,096
  tokens a session, while a WWDC26 code sample prints 8,192, as the [technology
  notes][tech-conflicts] record; this note uses the documented 4,096.

[prior-earshot]: /docs/research/idea-evidence.md#earshot-announcement-alerts-for-deaf-and-hard-of-hearing-travelers
[tech-conflicts]: /docs/research/next-gen-tech.md#conflicts-between-sources

## Gaps

What no source settled on September 22, 2026:

- **Jev on these tasks.** No TypeSafe cookbook, eval, or demo covers ranking an
  AAC user's phrases, cueing a game table, reading lab notes, flagging lines in
  a group conversation, or merging duplicate questions
  ([cookbooks][jev-cookbooks]), so every accuracy figure for the finalists would
  be the team's own.
- **Head-to-head comparisons.** No study compares Jev, keyword rules,
  embeddings, and Apple's on-device model on any of the five tasks, and Apple
  publishes no accuracy for `NLEmbedding` or for classification with Foundation
  Models.
- **Calibration at the finalists' thresholds.** Nothing published shows how
  often Jev is right at 0.8 or 0.85 on any task; the one split is on SEC filings
  with `jev-1.12` ([calibration][jp-calibration]).
- **Transcription accuracy.** Apple publishes no word error rate for
  `SpeechTranscriber`, none for a phone across a table, a Bluetooth headset
  microphone, or several speakers at once, and no false-alarm rate for Name
  Recognition ([technology notes][tech-speech]). Whether a phone near its owner
  also transcribes other nearby speakers isn't documented.
- **Turn.** No study measures the harm of a mis-ranked or mis-tapped AAC phrase,
  or how long partners wait; Rejoin Voice and MaTalk AI have 1 and 7
  ratings, so there is no usage evidence for listening AAC yet. No Android page
  read offers third-party apps a voice cloned from the user, like Personal
  Voice.
- **Scenekeeper.** No government or peer-reviewed count of active tabletop
  groups, no controlled study of music at real tables, and no measurement of
  predicting a check or its difficulty from speech.
- **Bench.** No NCES or NSF count of students in lab courses, no study of phones
  or earbuds in teaching wet labs, and no confirmation of why LabTwin, Labfolder
  Go, and protocols.io left the stores.
- **Chorus.** The newest breakdown of college students by hearing disability is
  from 2008–09, and no study measures question, task, owner, or deadline flags
  on live captions of in-person groups.
- **Same Boat.** No study counts how many office-hours queue entries duplicate
  another, or measures the harm of a wrong merge; no Department of Education
  guidance speaks to a TA buying an app alone.
- **Category entries.** Devpost shows no category opt-ins, so whether an
  overlapping entry is a student's comes only from its story ([gallery
  notes][gallery-notes]).
- **Lights in a demo.** No Apple page read gives how fast HomeKit applies a
  change to a bulb.

[jp-notes]: /docs/research/jev-patterns.md
[gallery-notes]: /docs/research/gallery-2026.md
[dv-gallery]: https://revenuecat-shipaton-2026.devpost.com/project-gallery
[ng-gallery-counts]: /docs/research/next-gen.md#gallery-counts-on-september-22
[ts-jagged]: https://docs.typesafe.ai/model-jaggedness/jev-1.13
[tech-fm]: /docs/research/next-gen-tech.md#foundation-models-in-ios-27
[tech-ai-devices]: /docs/research/next-gen-tech.md#apple-intelligence-devices
[t-lt]: https://play.google.com/store/apps/details?id=com.google.audio.hearing.visualization.accessibility.scribe
[t-pv-support]: https://support.apple.com/en-us/104993
[ng-field]: /docs/research/next-gen.md#entries-that-name-next-gen
[prior-sayso]: /docs/research/idea-evidence.md#sayso-an-aac-phrase-finder
[t-als-cdc]: https://www.cdc.gov/als/dashboard/index.html
[t-kristensson]: https://doi.org/10.1145/3313831.3376525
[tech-speech]: /docs/research/next-gen-tech.md#speechanalyzer-and-speechtranscriber
[esr]: https://github.com/jamsch/expo-speech-recognition
[tech-modules]: /docs/research/next-gen-tech.md#speech-camera-and-model-modules
[speech-context]: https://developer.apple.com/documentation/speech/analysiscontext/contextualstrings
[pv-guide]: https://support.apple.com/guide/iphone/record-your-personal-voice-iph51936468d/ios
[jev-api]: /docs/research/jev.md#the-system-one-http-api
[cb-classify-confidence]: https://docs.typesafe.ai/cookbooks/classification_using_confidence
[jp-choice]: /docs/research/jev-patterns.md#choice-size-and-high-cardinality-decisions
[jev-rate]: /docs/research/jev.md#rate-limits-context-length-and-latency
[tech-accounts]: /docs/research/next-gen-tech.md#apple-accounts-for-a-student-team
[jp-consistency]: /docs/research/jev-patterns.md#consistency-results
[jev-what]: /docs/research/jev.md#what-jev-is
[jev-lang]: /docs/research/jev.md#jev-platform-and-language-support
[t-pc632]: https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=632.
[s-bardy-faq]: https://www.bardy.ai/faq
[s-bardy-how]: https://www.bardy.ai/how-it-works
[s-hasbro]: https://newsroom.hasbro.com/news-releases/news-release-details/dungeons-dragons-celebrates-50th-anniversary-2024-more-50
[s-ddb-2024]: https://www.dndbeyond.com/posts/1887-thanking-our-community-for-a-great-2024
[s-bardo-2017]: https://ojs.aaai.org/index.php/AIIDE/article/view/12958
[expo-audio]: https://docs.expo.dev/versions/latest/sdk/audio/
[b-csb-release]: https://www.csb.gov/csb-releases-investigation-into-2010-texas-tech-laboratory-accident-case-study-identifies-systemic-deficiencies-in-university-safety-management-practices/
[b-csb-report]: https://www.csb.gov/file.aspx?DocumentId=5671
[b-nces]: https://nces.ed.gov/programs/digest/d23/tables/dt23_322.10.asp
[tech-do]: /docs/research/next-gen-tech.md#websockets-on-a-hibernating-durable-object
[cb-pre-parsed]: https://docs.typesafe.ai/cookbooks/pre_parsed_value_extraction_cookbook
[jp-calibration]: /docs/research/jev-patterns.md#calibration-claims-and-evidence
[b-nsdatadetector]: https://developer.apple.com/documentation/foundation/nsdatadetector
[c-lt-ios]: https://apps.apple.com/us/app/live-transcribe/id1471473738
[c-ada]: https://developer.apple.com/design/awards/
[c-captions]: https://support.apple.com/guide/iphone/get-live-captions-of-spoken-audio-iphe0990f7bb/ios
[c-name]: https://support.apple.com/guide/iphone/get-notified-when-your-name-is-called-iphb865d79be/ios
[p-hivenotes]: https://devpost.com/software/hivenotes-collaborative-lecture-intelligence
[c-nidcd]: https://www.nidcd.nih.gov/health/statistics/quick-statistics-hearing
[c-db414]: https://www.cdc.gov/nchs/data/databriefs/db414-H.pdf
[c-purver]: https://aclanthology.org/2007.sigdial-1.4/
[sb-piazza]: https://apps.apple.com/us/app/piazza/id453142230
[sb-piazza-gp]: https://play.google.com/store/apps/details?id=com.piazza.android
[sb-tophat]: https://apps.apple.com/us/app/top-hat-better-learning/id674069291
[sb-tophat-gp]: https://play.google.com/store/apps/details?id=com.tophat.android.app
[sb-malan]: https://cs.harvard.edu/malan/publications/ccsce12.pdf
[sb-parqr]: https://arxiv.org/pdf/1909.02043
[sb-cs50-2024]: https://cs.harvard.edu/malan/publications/V1fp0567-liu.pdf
[jev-cookbooks]: /docs/research/jev.md#cookbooks-and-demos

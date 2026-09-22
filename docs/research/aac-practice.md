# AAC practice research notes

What augmentative and alternative communication (AAC) practice and research say
that should shape the rewrite of Turn's [product](/docs/PRODUCT.md),
[PRD](/docs/PRD.md), and [TRD](/docs/TRD.md): design conventions, studies of AI
and context-aware suggestions, who Turn fits, outcome measures, iOS access
features, Apple's speech features, ethics, and what a clinic review can check.
Every source below was read on September 22, 2026, so versions and page contents
are as of that date, and judgment starts with "Synthesis:". The
[idea](/docs/IDEA.md) and the [evidence notes][ev-turn] already hold Turn's
rivals, need, devices, Jev's jagged edges, simpler methods, and harm, so this
note links to them instead of repeating them.

Contents:

1.  [Findings for the product, PRD, and TRD](#findings-for-the-product-prd-and-trd)
1.  [AAC design conventions for Turn](#aac-design-conventions-for-turn)
1.  [AI and context-aware suggestions in AAC research](#ai-and-context-aware-suggestions-in-aac-research)
1.  [Who Turn fits](#who-turn-fits)
1.  [Outcome measures Turn's metrics can borrow](#outcome-measures-turns-metrics-can-borrow)
1.  [iOS access features AAC users rely on](#ios-access-features-aac-users-rely-on)
1.  [Live Speech, Personal Voice, and Vocal Shortcuts](#live-speech-personal-voice-and-vocal-shortcuts)
1.  [Ethics, safety, and consent](#ethics-safety-and-consent)
1.  [What a clinic review can check](#what-a-clinic-review-can-check)
1.  [Conflicts between sources](#conflicts-between-sources)
1.  [Gaps](#gaps)

[ev-turn]: /docs/research/next-gen-evidence.md#turn-aac-that-ranks-the-users-own-phrases

## Findings for the product, PRD, and TRD

Synthesis: each line condenses the section it links to, where the sources are.

- **Keep the grid fixed and let only the reply row adapt.** AAC practice keeps
  button positions fixed for motor planning, and outside AAC, a separate
  adaptive row that copies items, leaving the originals in place, had the lowest
  perceived cost. The evidence comes from children without disabilities and
  office workers, not adult AAC users. See [Fixed button positions and motor
  automaticity](#fixed-button-positions-and-motor-automaticity).
- **A phrase that almost fits is worse than a delay.** In every study of how
  service providers judged an AAC customer that included a partly relevant
  prestored message, it was rated below the alternatives, including a delayed
  message, which supports a row that holds when nothing fits and a high bar for
  the single big button. See [Why prestored-phrase systems work or
  fail](#why-prestored-phrase-systems-work-or-fail).
- **Add a fixed strip for managing the conversation.** Floorholders, repair
  requests, questions back to the partner, and an introduction to the app are
  established AAC strategies, and repair has to take one selection. See
  [Quick-fire, turn-holding, and repair
  messages](#quick-fire-turn-holding-and-repair-messages).
- **AAC users judge AI replies by whether they sound like them.** The most
  common complaint about generated suggestions was that they lacked the user's
  style, and generated phrases rarely fit. Turn's own phrases answer that, but
  choosing even a pre-stored phrase from a list drew "the device did that for
  you", and ranked suggestions can steer what users say. See [Speaking in their
  own words](#speaking-in-their-own-words) and [Authorship and how partners see
  suggestions](#authorship-and-how-partners-see-suggestions).
- **Users want a check before speaking, a way out, and no dependence on the
  network.** Some would trade control for speed and others would rather type;
  many asked to check, correct, or cancel before anything is said; and a user of
  a cloud model had to switch it off without signal. Tap-to-speak, the grid,
  typing, and the offline ranking cover these. See [Control, speed, and
  errors](#control-speed-and-errors).
- **Stored phrases already carry most everyday speech; what they lack is the
  moment.** In six months of one ALS user's conversations, about two thirds of
  spoken words came from stored phrases, and users describe stored phrases as
  blind to what was just said, the gap Turn's row fills. See [Context from the
  partner, the place, and the
  moment](#context-from-the-partner-the-place-and-the-moment).
- **Measure time to the spoken reply, not keystrokes saved.** Keystroke savings
  didn't predict rate or task success, and Gajos's utilization ratio gives an
  acceptance rate for the row. See [Rate, savings, and acceptance
  measures](#rate-savings-and-acceptance-measures).
- **Turn fits literate adults with motor speech impairments, not aphasia.** ALS,
  dysarthria after stroke, laryngectomy, brainstem stroke, and many adults with
  multiple sclerosis, Parkinson's disease, or cerebral palsy fit; aphasia's
  reading and word-finding problems argue against a text-only, changing row. ALS
  users move from touch to switches or eye gaze, so Switch Control and Eye
  Tracking have to keep working. See [Who Turn fits](#who-turn-fits).
- **Build for iOS access features without detecting them.** Every phrase should
  be a labeled button whose label matches its text, with no gestures or timers
  and targets of 44 by 44 points. React Native 0.86 can't detect Switch Control
  or Voice Control or set Voice Control names, and neither feature runs in the
  Simulator. See [iOS access features AAC users rely
  on](#ios-access-features-aac-users-rely-on).
- **Personal Voice needs early setup and a fallback.** Since iOS 26 a voice
  takes 10 phrases, but Apple disagrees with itself about which iPhones can make
  one; apps need the user's "Allow Apps to Request to Use" switch and can't
  capture the audio. See [Live Speech, Personal Voice, and Vocal
  Shortcuts](#live-speech-personal-voice-and-vocal-shortcuts).
- **Authorship is the field's own test.** ASHA and ISAAC reject facilitated
  communication because others authored the messages, and a 2025 paper applies
  the same test to language models in AAC; Turn's own-words design passes it,
  but starter phrases stay the team's words until the user keeps them. See
  [Rights, competence, and authorship](#rights-competence-and-authorship).
- **Ask the partner first, show a cue, and store nothing.** Most bystanders in
  one study wanted to be asked before being recorded, some smart speaker users
  don't trust the mute button, and Apple's developer agreement requires an
  indicator during any speech capture and bars apps designed to record others
  without their awareness. Nobody has studied how an AAC user's partners feel
  about being transcribed. See [Partners and devices that
  listen](#partners-and-devices-that-listen).
- **Safety-critical answers stay fixed.** Hospital studies show patients with
  communication disabilities being bypassed; fixed Yes, No, and Not sure buttons
  and a fixed "Something's wrong" follow. See [Safety-critical
  messages](#safety-critical-messages).
- **A clinic review should be narrow.** A short review can't do feature matching
  with a client, so the team can bring a feature chart in ASHA's terms and five
  questions. See [What a clinic review can
  check](#what-a-clinic-review-can-check).

## AAC design conventions for Turn

Most conventions below come from ASHA's Practice Portal page on AAC, which is
undated: its citation guide reads "American Speech-Language-Hearing Association
(n.d.)" ([ASHA][asha-aac]). Peer-reviewed studies back or qualify each one.

### Fixed button positions and motor automaticity

- **What ASHA says about fixed locations.** In a core vocabulary approach,
  "Often, words from the initial set remain in the same location to minimize
  demands on memory and motor planning as more words are added to the AAC
  display; however, the extent to which this can happen varies depending on the
  AAC system." LAMP uses "consistent motor plans to access vocabulary", and
  "LAMP's emphasis on motor planning may reduce the cognitive demands of
  choosing from a symbol set and may result in more automatic and faster
  communication (Autism Spectrum Australia, 2013)." ([ASHA][asha-aac])
- **Display types.** ASHA sorts displays into static ("Symbols remain in a fixed
  location."), dynamic, and hybrid: "Static/fixed display with dynamic component
  (e.g., alphabet board or keyboard with word prediction; grid display that
  opens new page following user selection of a symbol)." ([ASHA][asha-aac])
- **The one controlled test of location.** Preschoolers without disabilities, 12
  in each group, found symbols on arrays that stayed the same or moved each
  session: "by the 5th session, participants in the consistent condition
  demonstrated significantly faster response times than participants in the
  variable condition", and the authors say "replication with children who use
  AAC is critical" ([Thistle et al., 2018][thistle-2018]).
- **The evidence is thin.** A survey of 112 speech-language pathologists (SLPs)
  listed "supports for motor planning" among "areas for future research"
  ([Thistle and Wilkinson, 2015][thistle-2015]), and a 2019 state-of-the-science
  review says: "To date, there has been only minimal research to investigate the
  effects of design variables for grid displays with adults with acquired
  disabilities." ([Light et al., 2019][light-2019])
- **Adaptive rows outside AAC.** In studies of office software with experienced
  computer users, not AAC users, a "split interface" copied predicted buttons
  into a separate adaptive toolbar while the originals stayed put. Users
  preferred it to no adaptation, and the authors "hypothesize that the very low
  perceived cost of the Split Interface has to do with its high spatial
  stability. That is, this adaptation strategy did not alter the familiar parts
  of the interface in any way and only adapted a clearly designated separate
  adaptive area." A design that moved buttons drew the complaint that "it would
  change the position of other buttons on the toolbars", and on how often to
  adapt: "high frequency effectively reduces a mechanism's predictability"
  ([Gajos et al., 2006][gajos-2006]).
- **Accuracy matters more than predictability.** In a follow-up with 23
  volunteers, "increasing predictability and accuracy led to strongly improved
  satisfaction. Increasing accuracy also resulted in improved performance and
  higher utilization of the adaptive interface", and "improvement in accuracy
  had a stronger effect on performance, utilization and some satisfaction
  ratings than the improvement in predictability" ([Gajos et al.,
  2008][gajos-2008]).
- Synthesis: Turn's layout, a fixed grid with a separate reply row that copies
  phrases rather than moving them, is a split interface in Gajos's sense, the
  design with the lowest perceived cost. The grid should never reorder itself by
  use or by Jev's answers; only the reply row adapts, once per partner line, and
  holding still when nothing fits keeps it predictable. The evidence for fixed
  positions comes from preschoolers without disabilities and office workers, not
  adult AAC users.

[thistle-2018]: https://pubmed.ncbi.nlm.nih.gov/29860450/
[thistle-2015]: https://pubmed.ncbi.nlm.nih.gov/25892523/
[gajos-2006]: https://doi.org/10.1145/1133265.1133306

### Prestored phrases, spelling, and symbols

- **Three ways to represent language.** ASHA lists "Alphabet-based methods" that
  "use traditional orthography (spelling) and rate enhancement techniques such
  as word or phrase prediction", "Single-meaning messages" on graphic symbols,
  and semantic compaction, where "a relatively small set of icons can be used to
  create many words and phrases" ([ASHA][asha-aac]).
- **What suits literate adults.** "Semantic–syntactic displays are useful for
  adults with relatively intact language (e.g., individuals with ALS)"
  ([ASHA][asha-aac]). "Adults with acquired conditions who are literate often
  use onscreen keyboard interfaces to generate text", and in a preliminary study
  of 10 adults with traumatic brain injury and 10 without, "Both groups strongly
  preferred using the QWERTY onscreen keyboard layout" ([Light et al.,
  2019][light-2019]).
- **Whole utterances.** A review of utterance-based devices says "There is
  evidence that utterance-based approaches have the potential to deliver faster
  rates without loss of coherence", and in a comparison with a word construction
  system in offices, "Conversational rate and perceived communicative competence
  were both higher when the UBD was used." ([Todman et al., 2008][todman-2008])
- **Stored messages limit what can be said.** ASHA's comparison of speech output
  gives synthesized speech "Allows for novel message generation" and digitized,
  recorded speech "Limited novel message generation (number of possible
  utterances is limited to recorded items)" ([ASHA][asha-aac]).
- Synthesis: Turn is an utterance-based system with a keyboard behind it. The
  phrase row buys speed, and the keyboard keeps novel messages possible, so
  typing has to stay one tap away from every screen, as the idea already plans.

### How prestored messages are organized

- **Organizing schemes.** ASHA describes taxonomic displays that "group symbols
  according to semantic category (e.g., people, places, feelings, actions)",
  activity grid displays that "organize vocabulary by event schemes, routines,
  or activities", and context-based displays "designed for a particular (usually
  frequent) context or environment", which "require a well-developed combination
  of core and fringe vocabulary". It warns that "The use of taxonomic displays
  for persons with aphasia can add to the cognitive and linguistic load and may
  lead to increased errors and slower response time (Petroi et al., 2011)."
  ([ASHA][asha-aac])
- **Core and fringe.** "Core vocabulary consists of high-frequency words that
  make up about 80% of the words used by most people every day", and "Fringe
  vocabulary consists of lower frequency words—mostly nouns—that tend to be
  context specific." ([ASHA][asha-aac])
- **Personal vocabulary prevents abandonment.** "Selection and inclusion of
  functional, personalized, and meaningful vocabulary within an AAC system can
  lead to greater intervention success and decreased likelihood of abandonment",
  and "Nouns tend to dominate vocabulary sets for AAC users (Dark &
  Balandin, 2007); however, the inclusion of verbs and other parts of speech can
  increase AAC acceptance and use" ([ASHA][asha-aac]).
- **Settings adults need.** For adult outpatients ASHA lists the "ability of the
  AAC system to incorporate vocabulary for various settings (e.g., medical,
  leisure, recreational, vocational)", and in acute care, "vocabulary that
  allows the individual to participate in their medical care by expressing basic
  wants and needs, indicating refusal or rejection, advocating for basic needs,
  and expressing preferences related to medical care" ([ASHA][asha-aac]).
- **Who programs the messages.** Among 68 people with ALS who used AAC,
  "Ninety-six percent of the AAC facilitators were family members, most with
  nontechnical backgrounds", and facilitators typically handle "programming new
  messages into the AAC device" ([Beukelman et al., 2011][beukelman-2011]).
- **Place and partner as context.** TalkAbout adapted word lists to location and
  partner, and Kristensson et al. tagged stored sentences with place, time, and
  partner; the [evidence notes][ev-without] hold both.
- Synthesis: Turn's categories are a taxonomic display and its place picker a
  context-based one. The starter bank should cover ASHA's medical-care
  vocabulary, including refusing, and the phrase editor should be easy for a
  family member without technical skills, since family members usually add the
  messages.

### Quick-fire, turn-holding, and repair messages

- **Messages that manage the conversation.** ASHA's description of PODD books
  includes "symbols for navigation, such as 'I have something to say'" and
  "pragmatic starters, such as 'Something's wrong,' 'I want something,' or 'I'm
  asking a question,' to help individuals convey contextual information"
  ([ASHA][asha-aac]).
- **Strategic competence.** ASHA counts "using an introductory (pre-stored)
  statement to explain AAC to unfamiliar communication partners" and "asking
  one's communication partner to write or type messages to aid in understanding
  and to repair communication breakdowns" among AAC users' strategies, and lists
  "turn-taking" and "requesting attention" among social skills
  ([ASHA][asha-aac]).
- **Floorholders.** Three studies each had 96 sales clerks rate scripted,
  videotaped store conversations with an AAC customer. A slowly delivered
  relevant message "with a floorholder yielded significantly higher mean ratings
  than that without the floorholder" ([Bedrosian et al., 2003][bedrosian-2003]),
  though a "quickly delivered message with repetition" beat slow messages "with
  and without a preceding conversational floorholder" ([McCoy et al.,
  2007][mccoy-2007]).
- **Questions back to the partner.** After about 6 hours of instruction, six AAC
  users aged 10 to 44 asked "partner-focused questions (i.e., questions about
  communication partners and their experiences)", and "Members of the general
  public, blind to the goals of the study, judged the majority of the
  participants to be more competent communicators after instruction." ([Light et
  al., 1999][light-1999])
- **Repair.** In a simulation of other-initiated repair (OIR) with AAC, "None of
  the user groups were found to be capable of producing full OIR utterances
  within the temporal limits of oral-speech conversation, with most unable to
  type even a single selection within these bounds" ([Rayman et al.,
  2024][rayman-2024]); the [evidence notes][ev-need] cover the gap in time.
- Synthesis: a small fixed strip of conversation-managing phrases, always in the
  same place and never ranked by Jev, would carry what these studies support: a
  floorholder ("Wait, I'm typing"), repair ("Sorry, say that again"), a question
  back ("And you?"), an introduction to the app, and "Something's wrong". Repair
  has to be one selection, since even one selection is often too slow.

[light-1999]: https://pubmed.ncbi.nlm.nih.gov/10025558/
[rayman-2024]: https://pubmed.ncbi.nlm.nih.gov/37916671/

### Rate enhancement and its costs

- **ASHA's framing.** Intervention may include "rate enhancement features that
  allow users to produce language with fewer keystrokes", and partner training
  includes "helping the user take advantage of rate enhancement features"
  ([ASHA][asha-aac]).
- **Keystroke savings don't equal speed.** Priming a device with vocabulary for
  the task had "a marginally significant effect on AAC device use as measured by
  keystroke savings; however, these advantages did not translate into higher
  level measures of rate, task performance, or user perceptions", which
  "indicates to AAC device designers and users that keystroke-based measures of
  device use may not be predictive of high level performance" ([Higginbotham et
  al., 2009][higginbotham-2009]). The participants were adults without
  disabilities.
- **Prediction misses personal words.** "words that are infrequent or not within
  the language model's word database, including proper names, acronyms or
  abbreviations, often do not show up in the system, requiring full typing"
  ([Fager et al., 2019][fager-2019]).
- **Measured costs and savings.** Word prediction's scanning cost, keyword
  retrieval's simulated savings, and SpeakFaster's abbreviation expansion are in
  the [evidence notes][ev-without] and [harm section][ev-harm].
- Synthesis: Turn's evaluation and product metrics should time the whole path
  from the end of the partner's line to the spoken reply, not count keystrokes
  saved, and the typing path needs the user's own names, which generic
  prediction lacks.

### Partner strategies and co-construction

- **What partners are taught.** ASHA's partner training covers "using active
  listening strategies", "increasing wait time for conversational turn-taking",
  and "helping the user take advantage of rate enhancement features". As an
  example of poor training, partners "are more likely to ask yes/no questions
  instead of open-ended questions, dominate the conversation, or fail to respond
  to the individual's communication attempts when communicating with children
  who use AAC (Kent-Walsh & McNaughton, 2005)." ([ASHA][asha-aac])
- **Partner instruction works.** A meta-analysis of 17 single-case studies with
  53 participants found partner interventions "highly effective", with "Aided
  AAC modeling, expectant delay, and open-ended question asking" the skills most
  often taught, though most of the evidence came from participants under 12
  ([Kent-Walsh et al., 2015][kent-walsh-2015]).
- **Co-construction.** "For individuals with complex communication needs, one of
  the most frequent communicative strategies is the co-construction of meaning
  with familiar partners" ([Hörmeyer and Renner, 2013][hormeyer-2013]). When
  partners speak word guesses aloud during typing, "The dyad must decide whether
  to take the time for the message to be written in its entirety or to stop,
  mid-typing", and "partners often disengage from conversation during long,
  inactive waiting times" ([Fager et al., 2019][fager-2019]).
- **Authorship stays with the user.** Of a dual app that lets a partner send
  word suggestions to the user's prediction row: "The responsibility of
  selecting letters and words during text entry remains with the person with
  complex communication needs, as the sole author of the text", and the authors
  add that "independence, understood as giving the individual control over the
  exact message he or she produces, is non-negotiable" ([Fager et al.,
  2019][fager-2019]).
- Synthesis: Listen mode automates part of what a familiar partner does in
  co-construction, guessing what the user might say, while leaving the choice
  with the user, which is the line Fager et al. draw. The consent card is a
  chance to teach the partner ASHA's turn-taking strategy, more wait time: pause
  after asking.

[kent-walsh-2015]: https://pubmed.ncbi.nlm.nih.gov/26059542/
[hormeyer-2013]: https://pubmed.ncbi.nlm.nih.gov/23952567/

### Why prestored-phrase systems work or fail

- **A partly relevant phrase costs more than a slow one.** "Significantly higher
  mean ratings were found for the conditions involving the slowly delivered
  relevant messages (both preceded by a conversational floorholder and without a
  floorholder) when compared to the quickly delivered partly relevant message
  condition." ([Bedrosian et al., 2003][bedrosian-2003])
- **So does a phrase that says too little.** Quick messages with excessive
  information and slow adequate ones, with or without a floorholder, "were rated
  higher than (d) the quickly delivered message with inadequate information"
  ([Hoag et al., 2004][hoag-2004]).
- **Partly relevant ranks last.** With delivery kept short, "the prestored
  message with repeated words/phrases was rated the highest, followed by the
  message with excessive information; next was the message with inadequate
  information, followed by the message with partly relevant information" ([Hoag
  et al., 2008][hoag-2008]). In a movie theater, a convenience store, and a hair
  salon, "messages with partly relevant information were consistently rated the
  lowest and messages with a delay in delivery were consistently rated in the
  middle" ([Bedrosian et al., 2020][bedrosian-2020]).
- **Retrieval.** Twelve adults with severe speech impairments learned codes for
  80 prestored messages and "were found to be more accurate at recalling the
  codes to retrieve concrete messages than those to retrieve abstract messages"
  ([Light and Lindsay, 1992][light-1992]).
- **Rate and perceived competence rise together.** Utterance-based devices
  raised both in office conversations ([Todman et al., 2008][todman-2008]).
- **Why users stop.** A systematic review of high-tech AAC lists "ease of use of
  the device; reliability; availability of technical support; voice/language of
  the device; decision-making process; time taken to generate a message; family
  perceptions and support; communication partner responses; service provision;
  and knowledge and skills of staff" ([Baxter et al., 2012][baxter-2012]).
  ASHA's barriers include "slow rate and low frequency of communication" and
  "lack of relevant vocabulary" ([ASHA][asha-aac]).
- Synthesis: these studies used scripted videos rated by service providers, not
  real conversations, but in all three that included a partly relevant message
  it lost: to slow relevant messages in 2003, to every other violation in 2008,
  and to a delayed message in all three settings in 2020. That points the same
  way as Valencia's participants: a phrase that almost fits makes the user look
  worse than waiting. It supports Turn's rule that the row holds when no phrase
  clears the bar, and a high bar for the single big button. Speed still counts
  when the content fits, since quick messages with repetition were rated
  highest.

[hoag-2004]: https://pubmed.ncbi.nlm.nih.gov/15842010/
[hoag-2008]: https://pubmed.ncbi.nlm.nih.gov/18465368/
[light-1992]: https://pubmed.ncbi.nlm.nih.gov/1405541/
[baxter-2012]: https://pubmed.ncbi.nlm.nih.gov/22369053/

## AI and context-aware suggestions in AAC research

The [evidence notes][ev-without] hold the systems' numbers, from Smart Reply and
keyword retrieval to Converser, TalkAbout, and SpeakFaster. This section is
about what AAC users said they want and fear. Another research note covers
evaluation metrics.

### Studies and systems read

- **Valencia et al., CHI 2023.** Twelve AAC users ("two eye gaze AAC users, four
  switch users and six AAC users who used direct selection") tried
  language-model phrase suggestions in 90-minute remote sessions; "None of our
  participants had aphasia or any disabilities affecting language use, only
  verbal speech production." The partner's line was typed in, and listening was
  only discussed, through "design concepts that showcased a system using partner
  speech" ([Valencia et al., 2023][valencia-2023]).
- **COMPA, CHI 2024.** Five AAC users and a partner each used, in video calls, a
  browser extension that "uses a conversation's live transcription to enable AAC
  users to mark conversation segments they intend to address", with generated
  starter phrases ([Valencia et al., 2024][compa-2024]).
- **Why So Serious?, CHI 2025.** Five AAC users tried interfaces whose "back-end
  ... captures the conversation context using the device's microphone" to
  suggest humorous remarks, after interviews with seven ([Weinberg et al.,
  2025][weinberg-2025]).
- **I, Robot?, CHI 2026.** An AAC user who is the lead author lived with a cloud
  model tuned on months of their own logged speech ([Weinberg et al.,
  2026][weinberg-2026]).
- **People with neurodegenerative disease.** Fifteen interviews and 51 surveys
  on personalized language models, with the caveat "No participant needed this
  new assistive technology at the time of the study" ([Klein et al.,
  2024][klein-2024]); and 66 people, including "eight participants" who already
  used AAC, on speed against accuracy ([Fried-Oken et al.,
  2024][fried-oken-2024]).
- **SpeakFaster.** Its context was "the previous turns of the ongoing dialogue,
  including the turns authored by the user and the conversation partner", shown
  as text; "all partner conversations for the other AAC and non-AAC user studies
  were presented as text to the user" ([Cai et al., 2024][speakfaster-2024]).
- **No AAC users.** KWickChat, which generates sentences from keywords with
  "dialogue history and persona tags", was judged by two human raters, and the
  authors call that "a necessary precursor to evaluation with AAC users" ([Shen
  et al., 2022][kwickchat-2022]). A study of recognizing the partner's speech to
  improve prediction recruited "14 participants via convenience sampling"
  ([Adhikary et al., 2019][adhikary-2019]).

[kwickchat-2022]: https://doi.org/10.1145/3490099.3511145

### Speaking in their own words

- **Style was the main complaint.** "participants' most common critique was that
  the phrases did not reflect their personal style and the image of themselves
  they wanted to portray", and one asked: "If the system is being used in the
  future, are all AAC users going to talk the same way?" ([Valencia et al.,
  2023][valencia-2023])
- **Generated wording rarely fit.** "Overall, it was difficult for the starter
  phrases to capture the exact wording AAC users wanted", and "When they did use
  them, they edited the phrases to accurately convey their intended message."
  ([Valencia et al., 2024][compa-2024])
- **Suggestions steer.** A participant said a suggestion "matched my intentions
  and also influenced it" ([Weinberg et al., 2025][weinberg-2025]), and the user
  who lived with a model trained on their own speech noticed it "was subtly
  steering dialogue in specific directions; pulling toward familiar patterns or
  vocabulary, narrowing my expression rather than expanding it" ([Weinberg et
  al., 2026][weinberg-2026]).
- **Saved phrases carry personality.** Among seven people with ALS, "A3 saved a
  few phrases full of curse words", "A2 noted he had created and saved over 500
  text files", and one had banked food phrases that were no longer relevant
  "since he now received nutrition through a feeding tube"; their shared measure
  of success was "whether it enabled them to communicate their ideas, thoughts,
  and personality as they were previously able to" ([Kane et al.,
  2017][kane-2017]).
- **Care goes into saved phrases.** People with ALS testing a voice editor
  "wouldn't use the editor for regular speech but would use it for crafting and
  saving common phrases" ([Fiannaca et al., 2018][voicesetting-2018]).
- **An AAC user asked for Turn's idea.** "an app that will know what setting I
  am in, either at home or work, and will predict phrases or words that I have
  already used for that environment" ([Jin, 2025][jin-2025]).
- Synthesis: offering only the user's own phrases answers the most common
  complaint about generated replies, but a ranked row can still steer what the
  user says, and saved phrases go stale as a disease progresses, so the bank
  needs easy editing and retiring.

[voicesetting-2018]: https://doi.org/10.1145/3173574.3173857
[jin-2025]: https://pmc.ncbi.nlm.nih.gov/articles/PMC13142680/

### Authorship and how partners see suggestions

- **Even pre-stored phrases.** "Participants reflected on how selecting an
  automated phrase, even a pre-stored phrase they had created beforehand, made
  others believe the system did all the work for them." One participant's
  customized answer drew "'oh, the device did that for you'. That was insulting
  to get that answer." Another: "if the exact expression desired popped up on
  the list, choosing it would mean something different to an observing intimate
  friend than if I were to type it." ([Valencia et al., 2023][valencia-2023])
- **Visible suggestions get attributed.** A friend told the I, Robot? author:
  "since you started using your new app, I am always thinking if you or AI is
  talking to me", and "The visibility of suggestions sometimes made
  interlocutors attribute suggestions to me" ([Weinberg et al.,
  2026][weinberg-2026]). A 2026 position paper warns of "the erroneous
  impression that message content is being controlled by the AI and not by the
  user" (preprint; [Frisch et al., 2026][frisch-2026]).
- **Partners finishing sentences.** Partners reported that they "Guess the end
  of a sentence before it has been completely typed and spoken", and a user
  answered: "It erodes one's confidence over time." Another was "very
  comfortable with someone anticipating my comments" when "asking for something
  or simply conveying information", but not in conversation ([Fiannaca et al.,
  2017][aacrobat-2017]).
- **Authorship in ethics.** The field's authorship test and its application to
  language models are under [Rights, competence, and
  authorship](#rights-competence-and-authorship).
- Synthesis: the partner shouldn't see the reply row before the user taps, and
  the consent card can say the user picks every phrase. Nothing in these studies
  tested whether ranked own phrases escape "the device did that".

[aacrobat-2017]: https://doi.org/10.1145/2998181.2998215

### Control, speed, and errors

- **Timing is the point.** "conversations move quickly, and I don't speak
  quickly anymore… the correct accuracy never gets out there [since everyone
  else has moved on] … timing is everything", and "I think speed is the number
  one factor. And the ability to express sarcasm is number two." ([Kane et al.,
  2017][kane-2017])
- **Some will trade control for speed.** "when the timing is critical, there is
  a willingness to 'trade-in' agency to deliver the humorous comments faster",
  though one participant "felt like I wasn't in control" ([Weinberg et al.,
  2025][weinberg-2025]).
- **Others won't.** "I would much prefer to type each word than have my
  sentences completed for me and take a chance that it's being wrong"; "Twelve
  respondents specifically wanted the ability to 'double check' (AS07) or
  'correct or edit' (NS05) or 'cancel' (NS06) communication acts before going
  out"; and the authors warn of "the potential injustice of a choice
  architecture that presents 'close enough' communication as the only option"
  ([Fried-Oken et al., 2024][fried-oken-2024]).
- **Errors look like the user's.** Participants had "concerns about the system
  suggesting the wrong thing and making the participants look bad", and "Many
  help requests that users wanted to generate were high stakes and needed to be
  specific"; for "suction", the model offered "I have a suction cup that needs
  to go on the wall" ([Valencia et al., 2023][valencia-2023]). SpeakFaster's
  errors "may still impact the perception of the user's communication or
  cognitive abilities in undesirable ways" ([Cai et al.,
  2024][speakfaster-2024]).
- **Too many suggestions, too slow.** At an airport, "I received 130
  suggestions, which I rejected them all", and with no signal, "the delay made
  them impractical for real-time interaction" ([Weinberg et al.,
  2026][weinberg-2026]). "P3, P4, P6, and P7, have a strong preference for
  software that does not rely on Internet access." ([Weinberg et al.,
  2025][weinberg-2025])
- **Keep typing.** Participants knew "they might need to fall back to typing a
  message themselves", and the authors ask systems to "allow users to correct or
  override the system if it fails to produce usable output" ([Valencia et al.,
  2023][valencia-2023]).
- Synthesis: tap-to-speak is the "double check" these users asked for, and the
  fixed grid and keyboard keep "close enough" from being the only option. A row
  that holds still when unsure, and that keeps working offline through the
  phone's own ranking, answers the two failures the long-term user hit: too many
  suggestions and no network.

### Context from the partner, the place, and the moment

- **Stored phrases dominate daily use.** In six months of recording one eye-gaze
  user with ALS, "only about a third of the user's spoken words were typed on
  the fly during the sessions and the rest were re-activations of previously
  stored phrases" ([Cai et al., 2023][observer-2023]).
- **But they ignore the moment.** Stored phrases "are context-agnostic and do
  not reflect any deeper thoughts or direct references to what is being said
  during the conversation", and seeing the conversation "while listening to
  their conversational partner helped her think of jokes and keep up" ([Weinberg
  et al., 2025][weinberg-2025]).
- **Place and partner.** People with ALS "would be interested in using
  context-aware AAC at the doctor's office, supermarket, pharmacy, and around
  the home" ([Kane and Morris, 2017][scenetalk-2017]), and respondents wanted to
  "toggle" the "settings", "modes", "folders", "lingo" of a language model
  "depending on their current partner or context" ([Klein et al.,
  2024][klein-2024]).
- **Quick responses.** "QuickFire phrases like 'wait,' 'yeah,' or 'I'm
  listening' were helpful, but constrained by navigation time and device
  layout." ([Weinberg, O'Connor, et al., 2025][mmhmm-2025])
- **Partners who know the user is typing wait.** "the conversations partners
  know when I am typing, so they would wait" ([Valencia et al.,
  2024][compa-2024]).
- **An AAC user's view of listening.** "when combined with a computer or
  microphone that is listening to a question or comment from communication
  partners, in-ear speakers could provide quick response options" ([Williams and
  Holyfield, 2025][williams-2025]).
- Synthesis: users already lean on stored phrases, and the gap they name is that
  stored phrases don't know the conversation; Turn's row fills exactly that gap.
  The place picker matches what people with ALS asked for, and a quick-response
  strip needs to sit where no navigation is needed.

[scenetalk-2017]: https://doi.org/10.1145/3064663.3064762
[mmhmm-2025]: https://doi.org/10.1145/3663547.3746381
[williams-2025]: https://pmc.ncbi.nlm.nih.gov/articles/PMC13096938/

## Who Turn fits

The [evidence notes][ev-need] hold the population counts: ASHA's 5 million
Americans who may benefit from AAC, CDC's ALS and stroke figures, and NIDCD's
aphasia figures. This section is about fit.

### Adults with motor speech impairments

- **How common dysarthria is.** ASHA's Practice Portal page on dysarthria
  (undated) gives these ranges: "Between 40% and 51% of individuals with
  multiple sclerosis are diagnosed with dysarthria at some point during the
  course of their disease"; "Approximately 26%–62% of individuals with
  neuromuscular disease experience dysarthria during the course of their
  disease", with amyotrophic lateral sclerosis among the examples; dysarthria
  "affects approximately 44%–88% of individuals with Parkinson's disease"; and
  "22%–58% of individuals with acute stroke present with dysarthria"
  ([ASHA][asha-dysarthria]).
- **Who needs AAC.** ASHA cites a UK estimate that "0.5% of the population
  requires the use of AAC", among whom the largest groups had
  "Alzheimer's/dementia (23%), Parkinson's disease (22%), autism spectrum
  disorder (ASD; 19%), learning disabilities (13%), and stroke (11%)". For ALS,
  "In Germany, 46% of patients demonstrated the need for AAC, yet 39% failed to
  access an AAC device (Funke et al., 2018)." ([ASHA][asha-aac])
- **ALS.** "Almost all people with amyotrophic lateral sclerosis (ALS)
  experience a motor speech disorder as the disease progresses." Ball et al.
  recommend referral for AAC assessment "when their speaking rates reach 125
  words per minute on the Speech Intelligibility Test (Sentence Subtest)",
  against "190 words per minute" for adults without disability. "96% of people
  with ALS for whom speaking rate was monitored and AAC assessment was
  recommended in a timely manner accepted and used AAC", and the Nebraska
  database shows use for "24.9 months for those with bulbar ALS and 31.1 months
  for those with spinal ALS" ([Beukelman et al., 2011][beukelman-2011]).
- **Cognition in ALS.** "between 10–75% of ALS patients experience cognitive
  impairment and between 15–41% experience a fronto-temporal dementia (FTD)",
  while of 87 recent Nebraska patients "77.0% did not demonstrate cognitive
  impairments, 18.4% demonstrated a mild cognitive impairment, and 4.6%
  demonstrated a fronto-temporal dementia (FTD)". Those who rejected AAC
  "reported a cooccurring functional dementia or experienced multiple severe
  health issues" ([Beukelman et al., 2011][beukelman-2011]).
- **Laryngectomy and head and neck cancer.** Speech after laryngectomy "most
  often includes use of" an electrolarynx, esophageal speech, or
  tracheoesophageal speech, and people "may use both low- and high-tech AAC
  systems. This may occur on a temporary basis in the acute postsurgical phase
  or as a long-term option for individuals who have had extensive surgical
  resection (e.g., laryngectomy or glossectomy)" ([ASHA][asha-hnc]).
- **Brainstem stroke and locked-in syndrome.** In a survey of 44 people with
  locked-in syndrome in France, "The principal cause of LIS was stroke (86.4%)",
  "76.7% could read", and "65.8% could communicate without technical aid";
  patients "generally have preserved vertical eye movements and movement of the
  eyelids (blinking)" ([León-Carrión et al., 2002][leon-carrion-2002]).
  Eye-controlled technology lets them "use a word processor coupled to a speech
  synthesizer" ([Laureys et al., 2005][laureys-2005]).
- **Cerebral palsy.** ASHA cites "44.4% of Swedish children with cerebral palsy
  used a form of AAC" ([ASHA][asha-aac]). Adult cases in one review include a
  university student with athetoid cerebral palsy who uses eye gaze but whose
  "eye-gaze access is inconsistent and relatively ineffective as she moves about
  the campus", and people with spastic cerebral palsy "experiencing increasing
  neck pain while using a head-activated switch for scanning access to their AAC
  device as they age" ([Fager et al., 2019][fager-2019]).
- Synthesis: Turn's text phrases fit adults whose language and reading survive
  while speech doesn't: ALS without marked cognitive change, dysarthria after
  stroke, laryngectomy, and many adults with multiple sclerosis, Parkinson's
  disease, brainstem stroke, or cerebral palsy. Its touch-first design fits the
  early and middle stages; later stages depend on how well it works with the iOS
  access features under [iOS access features AAC users rely
  on](#ios-access-features-aac-users-rely-on).

[asha-hnc]: https://www.asha.org/practice-portal/clinical-topics/head-and-neck-cancer/
[leon-carrion-2002]: https://pubmed.ncbi.nlm.nih.gov/12119076/

### Aphasia and why text phrases may not suit

- **What aphasia affects.** ASHA's aphasia page (undated) says aphasia "involves
  varying degrees of impairment in four primary areas": spoken and written
  expression, and spoken and reading comprehension. "Anomia, or difficulty
  retrieving words, is essentially universal", and "roughly 25%–50% of all
  strokes result in aphasia" ([ASHA][asha-aphasia]).
- **Reading and listening.** Signs include "having difficulty recognizing words
  by sight or comprehending written material of any length" and "having
  difficulty understanding long or rapidly presented speech (e.g., television
  program, complex conversation)" ([ASHA][asha-aphasia]).
- **What AAC for aphasia looks like.** ASHA's aphasia page describes AAC that
  uses "the individual's residual language abilities and training communication
  partners to use 'augmented input' to enhance comprehension and to offer
  written or visual choices" ([ASHA][asha-aphasia]). Visual scene displays pair
  photos with short text: they "capitalize on the relative strengths of adults
  with aphasia and simultaneously decrease demands on their language systems",
  and "adults prefer to communicate by selecting messages from text boxes paired
  with VSDs to reduce their chances of inadvertently selecting an unintended
  message"; adults with aphasia were "more accurate and faster identifying
  symbols when they had to navigate across fewer levels and when they were using
  a small array of four symbols" ([Light et al., 2019][light-2019]).
- Synthesis: a text-only row that changes after each partner line asks a person
  with aphasia to read and decide quickly, which is where aphasia hurts, so
  Turn's first version shouldn't claim to serve aphasia. A future version could
  pair phrases with photos and show fewer choices, following the visual scene
  display research.

### How needs change over time

- **Access changes as ALS progresses.** "people with ALS should be fitted with
  AAC technology that supports multiple access methods such as allowing them to
  transition from hand access to scanning and/or head/eye-tracking". Eye
  tracking "is often reported to be the least fatiguing access method by people
  with ALS"; in one follow-up, 93% of 15 people with ALS reported using eye
  tracking successfully, for 53% "eye movement was the only viable access
  option", and "All of the participants (100%) used their eye-tracking device to
  support face-to-face communication" ([Beukelman et al.,
  2011][beukelman-2011]).
- **Access needs setup and support.** Eye tracking "often required
  trouble-shooting", such as lighting changes and camera angles for glasses,
  with a "mean length of instruction" of "5 hours (range of 2–20 hours)"
  ([Beukelman et al., 2011][beukelman-2011]). "Lighting (e.g., bright lights,
  outdoor lighting), positioning (e.g., re-positioning requiring frequent
  re-calibration), and physical conditions of the eye (e.g., dry eyes) can pose
  challenges to continuous use of eye tracking", "switch scanning can be slow",
  and a prototype that combined the two raised one stroke survivor's
  first-attempt accuracy from 63% to 91% ([Fager et al., 2019][fager-2019]).
- **Plan early.** ASHA advises "initiating AAC systems and voice banking as
  early as possible following a diagnosis" ([ASHA][asha-dysarthria]) and says
  "Voice banking should be completed when a communicator's energy and skills are
  sufficient to generate clear speech" ([ASHA][asha-aac]).
- **At the end of life.** SLPs consider "flexibility of access method as
  physical abilities change or decline" and "vocabulary selection to ensure that
  the individual will be able to express their wishes, desires, and feelings;
  basic needs; and issues related to medical care" ([ASHA][asha-aac]).
- Synthesis: an ALS user may start Turn by touch and, over the two years or more
  that people with ALS use AAC in the Nebraska data, move to Switch Control or
  Eye Tracking, so every screen, the reply row included, must keep working with
  those features, and onboarding should prompt the user to record a Personal
  Voice while their speech is still clear.

## Outcome measures Turn's metrics can borrow

Another research note covers evaluation metrics and statistics; this section
lists the clinical measures and what the field knows about abandonment.

### Rate, savings, and acceptance measures

- **Keystroke savings mislead.** As under [Rate enhancement and its
  costs](#rate-enhancement-and-its-costs), keystroke-based measures "may not be
  predictive of high level performance" ([Higginbotham et al.,
  2009][higginbotham-2009]).
- **Utilization, an acceptance rate.** Gajos et al. measured "the number of
  times that the participant selected the requested UI element from the adaptive
  toolbar divided by the number of times that the requested element was present
  on the adaptive toolbar", and it rose with accuracy ([Gajos et al.,
  2008][gajos-2008]). For Turn, the same ratio is taps on a row phrase over
  lines where the right phrase was in the row.
- **Conversation measures.** A study of 10 dyads in which one person had ALS and
  used a speech-generating device indexed "Task completion times, talk times,
  contribution types (i.e., main/repair), and contribution functions (i.e.,
  presentation/acceptance)", and concluded that "symmetry is a useful metric for
  identifying the constraining influence of carrying out in-person interactions
  with an SGD" ([Seale et al., 2020][seale-2020]).
- **Perceived competence.** The utterance-based device studies measured
  conversational rate together with partners' ratings of "perceived
  communicative competence" ([Todman et al., 2008][todman-2008]), and the
  trade-off studies measured sales clerks' "attitudes toward the AAC user and
  his or her communication" ([Bedrosian et al., 2003][bedrosian-2003]).

[seale-2020]: https://pubmed.ncbi.nlm.nih.gov/32706312/

### Participation and satisfaction scales

- **Communicative Participation Item Bank (CPIB).** Calibrated with "701
  individuals representing four diagnoses: multiple sclerosis, Parkinson's
  disease, amyotrophic lateral sclerosis and head and neck cancer", it has a
  46-item bank and "A 10-item, disorder-generic short form". "The items ask
  about the extent to which the respondent's condition interferes with
  participation in a wide range of speaking situations", such as "Having a
  casual conversation at mealtime at home"; responses score "Not at all = 3, A
  little = 2, Quite a bit = 1, and Very much = 0", and "The total summary score
  can range from 0 – 30" ([Baylor et al., 2013][baylor-2013]).
- **The CPIB's limit for Turn.** "individuals who relied solely on AAC were not
  included out of concern that the relevance and appropriateness of the items in
  the CPIB have not yet been evaluated with AAC users", and "The CPIB has also
  not yet been tested with people who depend solely on AAC for communication"
  ([Baylor et al., 2013][baylor-2013]).
- **QUEST 2.0.** Item analysis cut the Quebec User Evaluation of Satisfaction
  with Assistive Technology to "12 items", with a structure "related to the
  assistive technology device (eight items) and services (four items)" ([Demers
  et al., 2000][demers-2000]). Its developers' research center, in French, rates
  items on "une échelle ordinale à 5 niveaux" (a five-level ordinal scale) from
  "pas satisfait du tout" (not satisfied at all) to "très satisfait" (very
  satisfied) ([CRIUGM][criugm-quest]). With 81 adults with multiple sclerosis,
  its device, services, and total scores reached test-retest ICCs of
  "0.82, 0.82, 0.91" ([Demers et al., 2002][demers-2002]).
- **PIADS.** The Psychosocial Impact of Assistive Devices Scale "is a 26 item
  self-rating scale" that "appears to have very significant power to predict AD
  abandonment and retention" ([Day et al., 2002][day-2002]).
- Synthesis: none of these scales was built for an app used in each
  conversation, and the CPIB was never tested with people who rely only on AAC.
  For a hackathon build, they are questions a clinic could ask in a later pilot,
  not metrics the first version can report.

[baylor-2013]: https://pmc.ncbi.nlm.nih.gov/articles/PMC4377222/
[demers-2000]: https://pubmed.ncbi.nlm.nih.gov/11508406/
[criugm-quest]: https://criugm.qc.ca/outils/evaluation-de-la-satisfaction-envers-une-aide-technique-esat-quebec-user-evaluation-of-satisfaction-with-assistive-technology-quest/
[demers-2002]: https://pubmed.ncbi.nlm.nih.gov/11827151/
[day-2002]: https://pubmed.ncbi.nlm.nih.gov/11827152/

### Abandonment rates and reasons

- **Assistive technology in general.** In a survey of 227 adults, "29.3% of all
  devices were completely abandoned", with abandonment "highest during the first
  year and after 5 years of use", tied to "lack of consideration of user opinion
  in selection, easy device procurement, poor device performance, and change in
  user needs or priorities" ([Phillips and Zhao, 1993][phillips-1993]).
- **AAC.** ASHA: "Abandonment occurs in approximately one third of cases
  (Zangari & Kangas, 1997), even if the system is well designed and functional
  (Johnson et al., 2006)." ([ASHA][asha-aac]) In a survey of 275 members of
  ASHA's AAC special interest division, "Not Maintaining/Adjusting the System,
  Attitude, Lack of Training, Lack of Support, and Poor Fit were most often
  related to inappropriate abandonment" ([Johnson et al., 2006][johnson-2006]).
- **What makes people stop.** ASHA's barriers include "AAC potentially
  symbolizing disease progression", "slow rate and low frequency of
  communication", "equipment breakdowns", and "lack of relevant vocabulary";
  barriers fall when "the AAC user values the system and has a sense of
  ownership" ([ASHA][asha-aac]). A review of low-tech and unaided AAC found the
  most prominent barriers were "environmental factors, including attitudes of
  and supports provided by professionals, family members, and the society at
  large" ([Moorcroft et al., 2019][moorcroft-2019]).
- **ALS is different.** With timely referral, 96% accepted AAC, up from about
  72% of men and 74% of women before 1996, and "Reports of low AAC use often
  accompany descriptions of minimal training or follow-up" ([Beukelman et al.,
  2011][beukelman-2011]).
- Synthesis: the reasons people abandon AAC that Turn can influence are fit,
  speed, reliability, relevant vocabulary, and ownership. Speech that never sits
  behind the paywall, an editable bank, and a row that holds when unsure address
  them; training and follow-up, the reasons in the ALS data, are outside an app.

[phillips-1993]: https://pubmed.ncbi.nlm.nih.gov/10171664/
[johnson-2006]: https://pubmed.ncbi.nlm.nih.gov/17114167/
[moorcroft-2019]: https://pubmed.ncbi.nlm.nih.gov/30070927/

## iOS access features AAC users rely on

The quotes come from Apple's iPhone User Guide pages for iOS 27, which shipped
on September 14, 2026; Apple's Switch Control and Eye Tracking pages read the
same for iOS 26. Apple lists iOS 27 as compatible with iPhone 11 and later and
iPhone SE (2nd generation and later) ([Apple][apple-ios]).

[apple-ios]: https://www.apple.com/os/ios/

### Switch Control

- **Switches.** "Tap Add New Switch, then choose External, Screen, Camera, Back
  Tap, Sound, or AirPod Gestures." A camera switch responds when you "move your
  head to the left or right, or pinch your left or right index finger and thumb"
  ([Apple][ug-sc-setup]).
- **Scanning styles.** "Auto Scanning: The cursor automatically moves to the
  next item after a specified duration. This is the default scanning style."
  "Manual Scanning requires at least two switches." In single-switch step
  scanning, "if no action is taken within a specified duration, the current item
  is automatically selected." ([Apple][ug-sc-setup])
- **Item and point modes.** "Item mode: The cursor sequentially highlights items
  or groups of items." "Gliding cursor: You select a point on the screen using
  scanning crosshairs." ([Apple][ug-sc-select])
- **Timing the user can set.** "Auto Scanning Time", "Pause on First Item",
  "Loops", "Move Repeat", "Long Press", "Hold Duration: Specify how long you
  need to press and hold a switch before it's accepted as a switch action",
  "Ignore Repeat: Ignore accidental repeated switch triggers", and "Group Items:
  Group items for faster navigation." ([Apple][ug-sc-setup])
- **Brain-computer interfaces.** Apple announced in May 2025 "a new protocol to
  support Switch Control for Brain Computer Interfaces (BCIs)" ([Apple Newsroom,
  May 13, 2025][nr-2025]); its developer reference, for iOS 26 and later,
  describes a device "functioning as an input type for system control and
  interaction with on-device assistive technology features like Switch Control
  and AssistiveTouch" ([Apple][bci-ref]).
- **Typing.** From iOS 26, "Typing using Eye Tracking and Switch Control will be
  easier and more accurate using QuickPath, a separate dwell timer for keyboard
  keys, and fewer steps when typing with switches." ([Apple][ios26-pdf])

[ug-sc-setup]: https://support.apple.com/guide/iphone/set-up-and-turn-on-switch-control-iph400b2f114/27/ios/27
[ug-sc-select]: https://support.apple.com/guide/iphone/select-items-perform-actions-and-more-iph8de250c54/27/ios/27
[bci-ref]: https://developer.apple.com/documentation/accessibility/brain-computer-interface-hid-reference-for-connecting-to-apple-platforms

### Voice Control

- **Commands.** Users say "Tap item name", "Show names", "Show numbers", or
  "Show grid" ([Apple][ug-vc]).
- **New in iOS 27.** "Flexible Item Names: With Apple Intelligence, you can
  refer to onscreen items in your own words instead of using their exact labels.
  This is turned on by default and can be turned off to use exact labels." It
  needs "an Apple Intelligence-enabled iPhone 15 Pro, iPhone 15 Pro Max, or
  iPhone 16 model or later" ([Apple][ug-vc]) and is available "in English in the
  U.S., Canada, the UK, and Australia" ([Apple Newsroom, May 19,
  2026][nr-2026]).
- **Dictation.** "When Voice Control is on, you use Voice Control to dictate
  text; standard iOS Dictation isn't available." ([Apple][ug-vc])
- Synthesis: a phrase button's name is the whole phrase, which is long to say
  after "Tap", so Voice Control users will lean on numbers or, on Apple
  Intelligence iPhones, on Flexible Item Names. Keeping each button's label
  identical to its visible text keeps both working.

[ug-vc]: https://support.apple.com/guide/iphone/use-voice-control-iph2c21a3c88/27/ios/27

### Dwell, Eye Tracking, and Head Tracking

- **AssistiveTouch dwell.** Dwell Control has "Movement Tolerance: Adjust the
  distance the cursor can move while dwelling on an item" and hot corners, and
  works with "trackpads, game controllers, and mouse devices" ([Apple][ug-at]).
- **Eye Tracking.** "All data used to set up and control Eye Tracking is
  processed on device." "iPhone should be on a stable surface about a foot and a
  half away from your face." "You need to calibrate Eye Tracking every time you
  turn it on." Settings include "Snap to Item: Have the Eye Tracking pointer
  automatically move to the item on the screen that's closest to where you're
  looking", and "When the dwell timer finishes, an action—tap, by default—is
  performed." ([Apple][ug-et]) "Eye Tracking is available on iPhone 12 and
  later" ([Apple][apple-mobility]), and from iOS 26 users "have the option to
  use a switch or dwell to make selections" ([Apple Newsroom, May 13,
  2025][nr-2025]).
- **Head Tracking.** "Head Tracking is available on iOS 26 and later." The
  iPhone sits "about 18 inches away from your face", and facial expressions such
  as "Raise Eyebrows or Open Mouth" can trigger actions such as "Single-Tap"
  ([Apple][ug-ht]).
- Synthesis: eye and head pointing land on whatever sits under the pointer, so
  snapping and dwell favor large, well-separated targets, and a reply row that
  changes while the user's gaze is dwelling could put a different phrase under
  the pointer. Slots that change only when a partner line ends, and only by a
  clear margin, make that rare.

[ug-at]: https://support.apple.com/guide/iphone/use-assistivetouch-iph96b21954/27/ios/27
[ug-et]: https://support.apple.com/guide/iphone/control-iphone-with-the-movement-of-your-eyes-iph66057d0f6/27/ios/27
[apple-mobility]: https://www.apple.com/accessibility/mobility/
[ug-ht]: https://support.apple.com/guide/iphone/control-iphone-with-the-movement-of-your-head-iph9c3dc17cf/27/ios/27

### VoiceOver, text, motion, and touch settings

- **VoiceOver.** "Swipe right" selects the next item, "Double tap" activates it,
  "Two-finger double tap" starts or stops the current action, and "Two-finger
  rotation" chooses a rotor setting ([Apple][ug-vo]); "VoiceOver lets users
  access actions quickly using the Actions rotor"
  ([Apple][uikit-custom-action]).
- **Bold Text and Reduce Motion.** "Make text heavier: Turn on Bold Text."
  ([Apple][ug-text]) "Reduce Motion: Turn on. (When off, you'll see more motion,
  like the fluid morphing effects of Liquid Glass.)" ([Apple][ug-motion]) The
  [iOS design notes][ios-type] cover Dynamic Type.
- **Touch Accommodations.** "Respond to longer or shorter touches: Turn on Hold
  Duration", "Treat multiple touches as a single touch: Turn on Ignore Repeat",
  and "Under Tap Assistance, choose either Use Initial Touch Location or Use
  Final Touch Location." New in iOS 27: "Tap Set Up Touch Accommodations, then
  follow the onscreen instructions." ([Apple][ug-ta])

[ug-vo]: https://support.apple.com/guide/iphone/use-voiceover-gestures-iph3e2e2281/27/ios/27
[uikit-custom-action]: https://developer.apple.com/documentation/uikit/uiaccessibilitycustomaction
[ug-text]: https://support.apple.com/guide/iphone/make-text-easier-to-read-iph3c076905a/27/ios/27
[ug-motion]: https://support.apple.com/guide/iphone/customize-onscreen-motion-iph0b691d3ed/27/ios/27
[ug-ta]: https://support.apple.com/guide/iphone/adjust-how-iphone-responds-to-your-touch-iph77bcdd132/27/ios/27

### What the app must give these features

- **Labels and actions drive everything.** Apple's testing guide sets the goal
  "A user can perform all tasks within your app using only Switch Control" and
  says "Install your app on a physical device, since Switch Control isn't
  available on Simulator." ([Apple][a11y-testing])
- **Voice Control names.** For SwiftUI's input labels: "Provide labels in
  descending order of importance. Voice Control and Full Keyboard Access use the
  input labels." ([Apple][swiftui-input-labels])
- **Which elements respond.** The SwiftUI modifier for
  `accessibilityRespondsToUserInteraction` sets "whether this Accessibility
  element responds to user interaction and would thus be interacted with by
  technologies such as Switch Control, Voice Control or Full Keyboard Access"
  ([Apple][swiftui-responds]).
- **Announcements.** The announcement notification is for "events that don't
  update the app's UI, or that update the UI only briefly", and the layout
  notification is "A notification that an app posts when the layout of a screen
  changes." ([Apple][uikit-announcement]; [Apple][uikit-layout-changed])
- **Apple's design rules.** The Human Interface Guidelines give iOS a default
  control size of "44x44 pt" and a minimum of "28x28 pt", suggest "about 12
  points of padding around elements that include a bezel", and warn that "Views
  and controls that auto-dismiss on a timer can be problematic for people who
  need longer to process information, and for people who use assistive
  technologies that require more time to traverse the interface."
  ([Apple][hig-a11y]) "As a general rule, a button needs a hit region of at
  least 44x44 pt" ([Apple][hig-buttons]).
- Synthesis: Turn gets switch, voice, and dwell access mostly for free if every
  phrase is a labeled button and nothing depends on gestures or timers. It has
  to be tested on a physical iPhone with Switch Control and Voice Control, since
  neither runs in the Simulator.

[a11y-testing]: https://developer.apple.com/documentation/accessibility/performing-accessibility-testing-for-your-app
[swiftui-input-labels]: https://developer.apple.com/documentation/swiftui/view/accessibilityinputlabels(_:)
[swiftui-responds]: https://developer.apple.com/documentation/swiftui/view/accessibilityrespondstouserinteraction(_:)
[uikit-announcement]: https://developer.apple.com/documentation/uikit/uiaccessibility/notification/announcement
[uikit-layout-changed]: https://developer.apple.com/documentation/uikit/uiaccessibility/notification/layoutchanged
[hig-buttons]: https://developer.apple.com/design/human-interface-guidelines/buttons

### Minimum target sizes

- **WCAG 2.2, Level AA.** Success Criterion 2.5.8: "The size of the target for
  pointer inputs is at least 24 by 24 CSS pixels, except when:", with exceptions
  for spacing, an equivalent control, inline targets, user agent control, and
  essential presentation ([WCAG 2.2][wcag22]).
- **WCAG 2.2, Level AAA.** Success Criterion 2.5.5: "The size of the target for
  pointer inputs is at least 44 by 44 CSS pixels except when:"
  ([WCAG 2.2][wcag22]). W3C's guidance recommends larger targets when "the
  control is used frequently" or "the result of the interaction cannot be easily
  undone" ([Understanding 2.5.5][wcag-ts-enh]).
- **Who it's for.** "Disabilities addressed by this requirement include hand
  tremors, spasticity, and quadriplegia. Some people with disabilities use
  specialized input devices instead of a computer mouse or trackpad."
  ([Understanding 2.5.8][wcag-ts-min])
- **CSS pixels become points.** W3C's note on applying WCAG to software says:
  "use platform-defined density-independent pixel measurements which approximate
  the CSS reference pixel. Examples of platform-defined density-independent
  pixel measurements include: points (pt) for iOS and macOS"
  ([WCAG2ICT][wcag2ict]), and React Native says "All dimensions in React Native
  are unitless, and represent density-independent pixels" ([React
  Native][rn-dimensions]).
- **React Native's own advice.** "Typical interface guidelines recommend touch
  targets that are at least 30 - 40 points/density-independent pixels." ([React
  Native][rn-view]) Its `hitSlop` prop "Sets additional distance outside of
  element in which a press can be detected" ([React Native][rn-pressable]); in
  the 0.86.3 source it widens only the touch hit test, not the frame assistive
  technologies use ([source][rn-view-src]).

[wcag-ts-enh]: https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html
[wcag-ts-min]: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
[rn-dimensions]: https://reactnative.dev/docs/0.86/height-and-width

### React Native's accessibility API

Expo SDK 57 runs React Native 0.86 ([Expo][expo-versions]); the latest 0.86
release is 0.86.3, published August 24, 2026 ([GitHub][rn-release]), and
the 0.86 docs say "This is documentation for React Native 0.86, which is no
longer in active development." ([React Native][rn-a11y]) Font scaling is covered
in the [iOS design notes][ios-type]. Expo's docs have no accessibility guide.

- **One element per button.** "By default, all touchable elements are
  accessible", and "The label is constructed by concatenating all Text node
  children separated by spaces." ([React Native][rn-a11y])
- **Roles.** `button` is "Used when the element should be treated as a button."
  ([React Native][rn-a11y]) In the 0.86.3 source only `button` and
  `togglebutton` become the iOS button trait; `grid`, `list`, and other roles
  fall through to "AccessibilityTraits::None" ([source][rn-roles-src]).
- **Actions.** "Actions either represent standard actions, such as clicking a
  button or adjusting a slider, or custom actions specific to a given component
  such as deleting an email message" ([React Native][rn-a11y]). In the 0.86.3
  iOS source every entry in `accessibilityActions`, standard names included,
  becomes a `UIAccessibilityCustomAction` labeled by its `label` or else its
  name ([source][rn-view-src]).
- **No Voice Control names.** The 0.86.3 source has no
  `accessibilityUserInputLabels`, the UIKit property that gives Voice Control
  alternative names, so the spoken name comes from the label.
- **Focus order.** Layout order sets it. `experimental_accessibilityOrder` is
  documented with "This API is experimental. Experimental APIs may contain bugs
  and are likely to change in a future version of React Native. Don't use them
  in production." ([React Native][rn-a11y]); in 0.86.3 it reaches iOS only
  behind the `enableAccessibilityOrder` flag, whose `defaultValue` is `false`
  ([source][rn-flags-src]).
- **Announcements.** `announceForAccessibilityWithOptions`: "By default
  announcements will interrupt any existing speech, but on iOS they can be
  queued behind existing speech by setting queue to true in the options object."
  ([React Native][rn-a11yinfo])
- **What an app can detect.** On iOS, `AccessibilityInfo` reports VoiceOver
  (`isScreenReaderEnabled`), Reduce Motion, Bold Text, Grayscale, Invert Colors,
  Reduce Transparency, Darker System Colors, and `prefersCrossFadeTransitions`;
  nothing reports Switch Control or Voice Control ([React Native][rn-a11yinfo];
  [source][rn-a11yinfo-src]).
- **Press on release.** "The person will remove their finger, triggering
  onPressOut followed by onPress." "If the person leaves their finger longer
  than 500 milliseconds before removing it, onLongPress is triggered." ([React
  Native][rn-pressable]) Sliding off the button past `pressRetentionOffset`, by
  default "{bottom: 30, left: 20, right: 20, top: 20}", cancels the press
  ([React Native][rn-pressable]).
- **Large Content Viewer.** `accessibilityShowsLargeContentViewer` is "A boolean
  value that determines whether the large content viewer is shown when the user
  performs a long press on the element", on iOS 13 and later ([React
  Native][rn-a11y]).
- Synthesis: use `Pressable` with `accessibilityRole="button"` and visible text
  as the label for every phrase, put secondary actions such as Edit or Pin in
  labeled `accessibilityActions`, avoid `onLongPress` on phrases, place the
  reply row before the grid in layout so it comes first in focus order, and
  announce row changes to VoiceOver with a queued announcement. Since React
  Native can't tell when Switch Control or Voice Control is on, the app must
  work for them without detecting them.

[expo-versions]: https://docs.expo.dev/versions/latest/
[rn-release]: https://github.com/react/react-native/releases/tag/v0.86.3
[rn-roles-src]: https://github.com/react/react-native/blob/v0.86.3/packages/react-native/ReactCommon/react/renderer/components/view/accessibilityPropsConversions.h
[rn-a11yinfo]: https://reactnative.dev/docs/0.86/accessibilityinfo
[rn-a11yinfo-src]: https://github.com/react/react-native/blob/v0.86.3/packages/react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo.js

### WCAG 2.2 in a native app

The WCAG 2.2 Recommendation is dated 12 December 2024 ([WCAG 2.2][wcag22]), and
W3C's Group Note on applying it to software, WCAG2ICT, is dated 11 December 2025
and "provides informative guidance (guidance that is not normative and does not
set requirements)" ([WCAG2ICT][wcag2ict]).

- **Pointer Cancellation (2.5.2, Level A).** One of four conditions must hold,
  such as "The down-event of the pointer is not used to execute any part of the
  function" ([WCAG 2.2][wcag22]). Pressable's `onPress`, which fires on release,
  meets it as long as nothing acts on press-in.
- **Label in Name (2.5.3, Level A).** "For user interface components with labels
  that include text or images of text, the name contains the text that is
  presented visually." ([WCAG 2.2][wcag22]) It serves "speech-input users (i.e.,
  users of speech recognition applications)"
  ([Understanding 2.5.3][wcag-label]).
- **Dragging Movements (2.5.7, Level AA).** "All functionality that uses a
  dragging movement for operation can be achieved by a single pointer without
  dragging" ([WCAG 2.2][wcag22]), so reordering phrases needs a way without
  dragging.
- **Timing Adjustable (2.2.1, Level A).** Each time limit must be one the user
  can turn off, adjust, or extend, with exceptions ([WCAG 2.2][wcag22]).
- **Resize Text (1.4.4, Level AA)** asks for text "resized without assistive
  technology up to 200 percent without loss of content or functionality"
  ([WCAG 2.2][wcag22]).
- **Status Messages (4.1.3, Level AA).** For software, "there is still a user
  need to have status messages be programmatically exposed so that they can be
  presented to the user by assistive technologies without receiving focus"
  ([WCAG2ICT][wcag2ict]).
- **Consistency across screens.** WCAG2ICT maps a "set of web pages" to a "set
  of software programs", says those "appear to be extremely rare", and calls
  consistent order within a program "generally considered best practice"
  ([WCAG2ICT][wcag2ict]).
- Synthesis: for Turn, 44 by 44 points (AAA) fits the phrases and reply buttons,
  which are used constantly, and 24 by 24 points (AA) is the floor for
  everything else; a reply row that updates without moving focus needs a
  VoiceOver announcement to satisfy 4.1.3.

[wcag-label]: https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html

## Live Speech, Personal Voice, and Vocal Shortcuts

The [evidence notes][ev-devices] cover Personal Voice's languages, the
authorization call, and Expo's gap; this section adds what users see and what
apps may do, as of September 22, 2026.

[ev-devices]: /docs/research/next-gen-evidence.md#turn-on-students-devices

### Personal Voice for users in iOS 26 and iOS 27

- **Creating one in iOS 27.** "Tap Accessibility, then tap Personal Voice." "Tap
  Create a Personal Voice, then follow the onscreen instructions." "To see the
  option to create your Personal Voice, you must first set a passcode."
  ([Apple][ug-pv])
- **Ten phrases since iOS 26.** "Personal Voice uses on-device intelligence to
  create a smoother, more natural-sounding voice in less than a minute, using
  only 10 recorded phrases." A footnote limits it to "English (US), Mandarin
  Chinese (China mainland), and Spanish (Mexico) on devices that support Apple
  Intelligence." ([Apple][ios26-pdf]) For people who struggle to read aloud,
  "you can even create your Personal Voice using short, three-word phrases"
  ([Apple][apple-speech]). The iOS 17 version asked users "to record 15 minutes
  of audio" ([Apple Newsroom, May 16, 2023][nr-2023]).
- **On the device.** "Your recorded speech is then processed securely on device.
  You'll receive a notification when your Personal Voice is ready."
  ([Apple][kb-pv]) Apple's WWDC23 session: "Your Personal Voice is generated on
  the device and not on a server." ([Apple][wwdc23])
- **Other devices.** "To allow your Personal Voice to be used on all of your
  devices with iCloud, turn on Share Across Devices" ([Apple][ug-pv]), and
  "iCloud stores your Personal Voice using end-to-end encryption"
  ([Apple][kb-pv]).
- **Terms of use.** "You can use Personal Voice only to create a voice that
  sounds like you on device, using your own voice, and for your own personal,
  noncommercial use." ([Apple][ug-pv])
- **iOS 27 changed nothing announced.** Apple's May 19, 2026 accessibility
  announcement doesn't mention Personal Voice ([Apple Newsroom, May 19,
  2026][nr-2026]).
- **Which iPhones.** Apple's pages disagree; see [Conflicts between
  sources](#conflicts-between-sources).
- Synthesis: people with ALS should record a Personal Voice while their speech
  is clear, which ASHA's voice banking advice already says, so Turn's onboarding
  can point to Settings early and fall back to a system voice when the phone
  can't make one.

[nr-2023]: https://www.apple.com/newsroom/2023/05/apple-previews-live-speech-personal-voice-and-more-new-accessibility-features/

### Personal Voice in third-party apps

- **The user's switch comes first.** "To allow apps to request to use your
  Personal Voice, turn on Allow Apps to Request to Use." ([Apple][ug-pv])
  "Personal Voice can be used only with Live Speech and with third-party apps
  that you allow, such as Augmentative and Alternative Communication (AAC)
  apps." ([Apple][ug-pv])
- **Four statuses.** The authorization status can be `authorized`, `denied`,
  `notDetermined`, or `unsupported`, the last meaning "The device doesn't
  support personal voices." ([Apple][pv-status-enum]) "the framework denies the
  request if the device doesn't support using personal voices"
  ([Apple][pv-status]).
- **Intended use.** "Keep in mind that usage of Personal Voice is sensitive and
  should be primarily used for augmentative or alternative communication apps."
  ([Apple][wwdc23])
- **No usage-description key.** Apple's list of protected resources has no
  Personal Voice entry; its Speech group lists only
  `NSSpeechRecognitionUsageDescription` ([Apple][protected-resources]).
- **Speaking, not recording.** Apps "can then use your Personal Voice to speak
  aloud through your device's speaker or during calls, but they can't capture
  speech from Personal Voice" ([Apple][kb-pv]).
- **Calls.** `mixToTelephonyUplink` is "A Boolean value that specifies whether
  to send synthesized speech to an active call" ([Apple][mix-uplink]), and it
  needs the user's setting: "Turn on Allow Apps to Add Audio in Calls."
  ([Apple][ug-ls])
- Synthesis: Turn's Swift module must handle all four statuses, send users to
  Settings when "Allow Apps to Request to Use" is off, never cache Personal
  Voice audio, and treat phone calls as a later feature that needs its own
  setting.

[pv-status-enum]: https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer/personalvoiceauthorizationstatus-swift.enum
[pv-status]: https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer/personalvoiceauthorizationstatus-swift.type.property
[protected-resources]: https://developer.apple.com/documentation/bundleresources/protected-resources
[mix-uplink]: https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer/mixtotelephonyuplink

### Live Speech

- **Opening it.** "Triple-click the side button or Home button (depending on
  your iPhone model), then tap Live Speech (if the Accessibility Shortcut is set
  up with more than one feature)." ([Apple][ug-ls])
- **Typing.** "Tap the Live Speech window, type what you want to have spoken,
  then tap Speak", or "tap suggested words that appear above the keyboard as you
  type" ([Apple][ug-ls]).
- **Phrases and categories.** "You can also add your phrases to custom
  categories like school or work." "Speak a phrase from a saved category: Scroll
  to the left to select a category, then tap a phrase." "Quickly speak a
  recently used phrase: Tap Recent, then tap a phrase." ([Apple][ug-ls]) The iOS
  26 page described categories "such as for different activities—like work,
  school, or gaming" ([Apple][ug26-ls]).
- **Calls.** "If you're on a FaceTime call, Live Speech is output on the other
  end of the call. Otherwise, the speaker on your iPhone outputs Live Speech."
  ([Apple][ug-ls])
- **Devices.** "Live Speech is available on iPhone XS and later with iOS 17 or
  later", on iPad, Mac with Apple silicon, and Apple Watch
  ([Apple][apple-speech]).
- **No developer API.** No Apple page read offers apps access to Live Speech or
  its saved phrases.
- Synthesis: Live Speech is the free baseline Turn is judged against: typing,
  categories, recents, suggestions, and Personal Voice, one triple-click away.
  It has nothing that listens to the partner, so Turn's difference is Listen
  mode, not the phrase bank.

[ug26-ls]: https://support.apple.com/guide/iphone/type-to-speak-iphcf92d2d9b/26/ios/26

### Vocal Shortcuts

- **What they are.** "Vocal Shortcuts can be useful if you have moderate to
  severe atypical speech but can reliably vocalize certain utterances. Audio is
  processed on device." ([Apple][ug-vs]) "Up to 50 commands can be saved on your
  device." ([Apple][apple-speech])
- **Always listening.** An icon "is shown in the status bar to indicate that
  Vocal Shortcuts is using the iPhone microphone to listen for shortcuts"
  ([Apple][ug-vs]).
- **Atypical speech.** "When your primary language is set to English (U.S.), you
  can have Siri listen for atypical speech." ([Apple][ug-siri])
- Synthesis: a user with some reliable sounds could open Turn or trigger a Siri
  request by voice. No Apple page says how Vocal Shortcuts shares the microphone
  with an app's own transcription, so Listen mode should be tested with Vocal
  Shortcuts on.

[ug-vs]: https://support.apple.com/guide/iphone/use-vocal-shortcuts-iph7f242ea2c/27/ios/27
[ug-siri]: https://support.apple.com/guide/iphone/change-siri-accessibility-settings-iphaff1d606/27/ios/27

## Ethics, safety, and consent

### Rights, competence, and authorship

- **The right to communicate.** The NJC's revised Communication Bill of Rights
  includes "The right to have access to functioning AAC (augmentative and
  alternative communication) and other AT (assistive technology) services and
  devices at all times", "The right to refuse or reject undesired objects,
  actions, events, or choices", and "The right to be addressed directly and not
  be spoken for or talked about in the third person while present" ([Brady et
  al., 2016][brady-2016]). The UN Convention on the Rights of Persons with
  Disabilities counts "augmentative and alternative modes, means and formats of
  communication" as communication (Article 2) and asks states to accept
  "augmentative and alternative communication ... of their choice by persons
  with disabilities in official interactions" (Article 21) ([Article 2][crpd-2];
  [Article 21][crpd-21]).
- **No prerequisites.** ASHA "aligns with the National Joint Committee for the
  Communication Needs of Persons With Severe Disabilities (NJC) in support of a
  zero-exclusion policy for AAC services", says "There are no prerequisites for
  AAC intervention", and that "impaired cognition does not preclude
  communication" ([ASHA][asha-aac]). None of the ASHA, NJC, or RCSLT pages read
  for this note uses the phrase "presume competence"; their wording is zero
  exclusion and no prerequisites.
- **Authorship is the test AAC ethics already uses.** ASHA's position on
  facilitated communication (FC), quoted on its AAC page: "there is extensive
  scientific evidence—produced over several decades and across several
  countries—that messages are authored by the 'facilitator' rather than the
  person with a disability" ([ASHA][asha-aac]). ISAAC's committee found
  "unequivocal evidence for facilitator control: messages generated through FC
  are authored by the facilitators rather than the individuals with
  disabilities" ([Schlosser et al., 2014][schlosser-2014]).
- **Authorship and language models.** A 2025 paper applies that test to language
  models in voice output communication aids: "We suggest that there is relevant
  similarity between some potential applications of LLMs and the discredited
  technique of facilitated communication (FC). We highlight risks related to
  authorship and authenticity of the message produced by LLM-enabled VOCAs", and
  its authors "counsel against the uncritical inclusion of LLMs within new and
  existing VOCAs" ([Griffiths et al., 2025][griffiths-2025]). A UK conference
  workshop of the AAC community raised "the need to ensure that outputs
  generated by AI were authentically authored by users", with "broad support for
  the idea of a Code of Practice" ([Griffiths et al., 2024][griffiths-2024]).
- Synthesis: the field's own test for a valid message is who authored it. Turn
  passes it in a way generated replies don't: every phrase was written or
  accepted by the user, and nothing is spoken without their tap. Two parts still
  need care. Starter phrases the team writes are the team's words until the user
  keeps or edits them, and a row that ranks phrases steers what the user says,
  so the user must always be able to ignore it.

[brady-2016]: https://pmc.ncbi.nlm.nih.gov/articles/PMC4770561/
[crpd-2]: https://social.desa.un.org/issues/disability/crpd/article-2-definitions
[crpd-21]: https://social.desa.un.org/issues/disability/crpd/article-21-freedom-of-expression-and-opinion-and-access-to-information
[schlosser-2014]: https://pubmed.ncbi.nlm.nih.gov/25384895/
[griffiths-2025]: https://doi.org/10.1108/JET-01-2025-0005
[griffiths-2024]: https://doi.org/10.1108/JET-01-2024-0007

### Professional bodies on AI in AAC

- **RCSLT, May 7, 2026.** The Royal College of Speech and Language Therapists
  published "Artificial Intelligence (AI): principles for safe and ethical
  practice in speech and language therapy", which "emphasise that AI should
  support, not replace, clinical expertise, and highlight the importance of
  transparency, consent, data protection and professional judgement" ([RCSLT
  news][rcslt-ai-news]). It names AAC twice: "AI features that are built into
  software already used in practice, such as electronic patient record systems,
  documentation tools, or communication aids (AAC). These may not always be
  visible as 'AI' but still require the same level of critical oversight", and
  bias "may affect speakers of different accents and dialects, bilingual people,
  AAC users, or those with atypical speech profiles" ([RCSLT
  principles][rcslt-ai]).
- **RCSLT on consent and co-production.** "SLTs should seek informed consent
  where the use of AI directly influences assessment, clinical decision making,
  therapeutic interaction, or the use of personal data", and "Co-production with
  the people SLTs support should be prioritised when designing, selecting or
  evaluating AI tools that influence their support, wherever possible." ([RCSLT
  principles][rcslt-ai])
- **ASHA.** Its undated page for clinicians says "AI cannot replace the
  audiologist, speech-language pathologist, or assistant but could innovate
  personal and client-centered care when carefully considered", and "Any claims
  about the efficacy of an AI tool must be substantiated with evidence." It
  addresses clinicians' use of generative AI, not AAC devices
  ([ASHA][asha-genai]).
- Synthesis: no professional body read here has a position on AI reply
  suggestions in AAC devices. The RCSLT principles are the nearest, and their
  asks, transparency about where AI acts, consent, and evidence for claims, line
  up with Turn's consent step and published evaluation.

[rcslt-ai-news]: https://www.rcslt.org/news/new-rcslt-principles-for-using-ai-in-speech-and-language-therapy/
[rcslt-ai]: https://www.rcslt.org/wp-content/uploads/2026/05/AI-principles-in-speech-and-language-therapy-May-2026.pdf
[asha-genai]: https://www.asha.org/practice/generative-artificial-intelligence-for-clinicians/

### Safety-critical messages

- **Hospitals.** A metasynthesis of 18 studies found patients with severe
  communication disabilities had "little or no access to the hospital call
  system", "Patients commonly received no support from staff in using their
  communication systems", and "There was little recognition from hospital staff
  and carers that patients would need to communicate about more than basic
  needs. There was no expectation that patients would wish to communicate
  information or take an active role in discussions about their own care
  decisions." ([Hemsley and Balandin, 2014][hemsley-2014]) The [evidence
  notes][ev-harm] have the Quebec chart review on preventable adverse events.
- **Talking to the carer instead.** "Across the studies reviewed, hospital staff
  preferentially interacted with carers rather than the patient" ([Hemsley and
  Balandin, 2014][hemsley-2014]).
- **Consent to treatment.** For people with locked-in syndrome, "only the
  medically stabilized, informed LIS patient is competent to consent to or
  refuse life-sustaining treatment" ([Laureys et al., 2005][laureys-2005]).
- **What to include.** ASHA's acute care vocabulary covers "indicating refusal
  or rejection" and "expressing preferences related to medical care"
  ([ASHA][asha-aac]).
- Synthesis: a wrong reply to "Are you in pain?" or "Do you agree to the
  procedure?" matters more than a wrong reply to "How was physio?". Keeping
  yes-or-no answers on fixed Yes, No, and Not sure buttons, never letting the
  model place a phrase in the big button for pain or consent questions, and
  keeping "Something's wrong" in a fixed place follow from these sources; none
  of them tested ranked replies in a hospital.

[hemsley-2014]: https://pmc.ncbi.nlm.nih.gov/articles/PMC4266100/

### Partners and devices that listen

- **Apple's rule for recordings.** Apple's Developer Program License Agreement,
  section 3.3.3(A), covers any app that "captures or makes any video,
  microphone, screen recordings, or camera recordings, whether saved on the
  device or sent to a server (e.g., an image, photo, voice or speech capture, or
  other recording)": "a reasonably conspicuous audio, visual or other indicator
  must be displayed to the user as part of the Application to indicate that a
  Recording is taking place. Your Application may not be designed to facilitate
  Recordings of others without their awareness." ([Apple][dpla]) It is the Apple
  Developer Program's agreement, and a store release needs that program ([the
  idea's categories](/docs/IDEA.md#categories-to-enter)).
- **What AAC users and the law say.** Valencia's participants asked how to stop
  the system hearing every conversation, and California bars recording
  confidential communication without every party's consent; the [evidence
  notes][ev-harm] quote both.
- **The one AAC study that recorded partners.** SpeakFaster Observer's user with
  ALS, their spouse, and four caregivers gave written consent; a user-provided
  LED ensured "a salient signal is visible to conversation participants during
  active data collection"; transcripts from "non-participating individuals are
  redacted"; the user could "delete logged sessions"; and recording paused
  around the holidays because of "the presence of many non-participating
  visitors". Deciding when to record "incurs cognitive cost" ([Cai et al.,
  2023][observer-2023]).
- **Partners' own views are missing.** A 2026 position paper: "Whether AAC users
  or the people around them would want such contextual monitoring is a topic
  worth future investigation." (preprint; [Frisch et al., 2026][frisch-2026])
  AAC users themselves said "if there were no privacy in place or clear
  transparency about how it would work, they would absolutely not use it"
  ([Valencia et al., 2023][valencia-2023]).
- **Bystanders want to be asked.** "Most of the participants (17/31) expressed
  that they would prefer for someone to ask their permission before recording
  them with AR glasses", which depended on "whether or not they were the focus
  of the recording", and "Subtleness may be partially offset by visual or aural
  cues to bystanders that a recording is taking place." ([Denning et al.,
  2014][denning-2014])
- **Mute buttons aren't trusted.** Smart speaker users said "I don't really
  trust it to stop recording", and "Incidental users, such as guests or
  children, are bystanders who may not be aware of or understand how the smart
  speakers work." The authors propose a guest mode that "would not record or
  maintain a log of requests" and a timed pause "after which the speaker should
  audibly announce that it is listening again" ([Lau et al., 2018][lau-2018]).
  Owners "were more protective of others' recordings (such as children and
  guests)" ([Malkin et al., 2019][malkin-2019]).
- **Transcribed partners change.** With automatic captioning, "hearing
  individuals spoke more loudly, with improved voice quality (harmonics-to-noise
  ratio), with a non-standard articulation (changes in F1 and F2 formants), and
  at a faster rate" ([Seita et al., 2018][seita-2018]), and some deaf and
  hard-of-hearing participants "worried that it would reshape the conversation
  environment in a way that negatively impacts social dynamics" ([McDonnell et
  al., 2021][mcdonnell-2021]).
- **Partner-facing displays cut both ways.** A study of AAC awareness displays
  weighed "the ways in which these designs can further mark users" as other, and
  users "are only willing to share text as it is being typed with very close
  conversation partners in certain scenarios" ([Sobel et al.,
  2017][sobel-2017]).
- **Opt-in and on the device.** "This may require the AAC device or user to
  allow partners to opt-in to having their voice recognized", and "Users may
  prefer to have their speech recognized locally on device" ([Adhikary et al.,
  2019][adhikary-2019]).
- Synthesis: asking first, a visible cue, a pause the partner can see take
  effect, no stored transcripts, and transcription on the phone are what
  bystander and AAC research point to, and Apple's agreement requires an
  indicator. Nobody has asked partners of an AAC user how being transcribed
  feels, so the consent card is a design guess, and it should stay small so it
  doesn't mark the user as "other".

[dpla]: https://developer.apple.com/support/terms/apple-developer-program-license-agreement/
[denning-2014]: https://doi.org/10.1145/2556288.2557352
[lau-2018]: https://doi.org/10.1145/3274371
[malkin-2019]: https://doi.org/10.2478/popets-2019-0068
[seita-2018]: https://doi.org/10.1145/3234695.3236355
[sobel-2017]: https://doi.org/10.1145/3025453.3025610

## What a clinic review can check

- **Feature matching.** ASHA's feature-matching assessment weighs features
  including "the ability to facilitate written communication", "capacity for use
  in varying environments and with different partners", "input type (i.e.,
  direct vs. indirect selection)", "output (i.e., type of speech, voice)", "the
  capability to be modified to allow for changes in communication abilities and
  needs", "AAC user preference", and "affordability and ease of maintenance"
  ([ASHA][asha-aac]). A 2026 study calls feature matching "the gold standard in
  identifying effective communication systems for individuals with complex
  communication needs" and advises that "It may be best to use an item-by-item
  rating to ensure a more accurate assessment of the app" ([Da Fonte et al.,
  2026][da-fonte-2026]).
- **App charts.** Gosnell, Costello, and Shane offer "a clinical framework for
  comparing and selecting apps", built on "a chart detailing features believed
  to represent critical and fundamental considerations for a broad profile of
  people evidencing complex communication needs" ([Gosnell et al.,
  2011][gosnell-2011]).
- **Mobile AAC's known challenges.** McNaughton and Light list the need "to
  ensure the focus is on communication, not just technology", "to ensure ease of
  access for all individuals who require AAC", and "to maximize AAC solutions to
  support a wide variety of communication functions" ([McNaughton and Light,
  2013][mcnaughton-2013]).
- **Access and display.** A clinic can test the reply row against the display
  findings in [AAC design conventions for
  Turn](#aac-design-conventions-for-turn) and the iOS features in [iOS access
  features AAC users rely on](#ios-access-features-aac-users-rely-on). Apple's
  Accessibility Nutrition Labels give a checklist of their own; the [Apple
  notes][apple-labels] quote the criteria.
- Synthesis: the [30-minute review][r6-turn] the plan asks for is too short for
  feature matching with a client, so the useful ask is narrower. The team could
  bring a one-page feature chart in ASHA's terms (input, output, vocabulary,
  modifiability, cost) and ask the clinic to judge five things: whether the
  starter phrases and categories suit adults with ALS, stroke, or laryngectomy;
  whether the fixed Yes, No, and Not sure buttons and the conversation strip
  cover safety-critical answers; whether the row's changes are predictable
  enough; whether the consent card is fair to partners; and who the app
  shouldn't be offered to, such as people with aphasia.

[da-fonte-2026]: https://pubmed.ncbi.nlm.nih.gov/41723854/
[gosnell-2011]: https://doi.org/10.1044/aac20.3.87
[mcnaughton-2013]: https://pubmed.ncbi.nlm.nih.gov/23705813/
[apple-labels]: /docs/research/apple-requirements.md#accessibility-nutrition-labels
[r6-turn]: /docs/research/next-gen-ideation.md#turn-under-attack

## Conflicts between sources

- **Which iPhones can make a Personal Voice.** The iOS 27 guide says Personal
  Voice "is available on iPhone 15 Pro models, iPhone 16 models and later"
  ([Apple][ug-pv]), as does apple.com ([Apple][apple-speech]), while Apple's
  support article, published October 13, 2025, lists "iOS 17 or later" and
  "iPhone 12 or later" ([Apple][kb-pv]). The iOS 26 feature list ties the
  10-phrase method to "devices that support Apple Intelligence"
  ([Apple][ios26-pdf]), which may explain the gap; Apple doesn't say.
- **Aphasia counts.** NIDCD says "About 2 million people in the United States
  are living with aphasia" (in the [evidence notes][ev-need]); ASHA says "2–4
  million people in the United States are living with aphasia"
  ([ASHA][asha-aphasia]). Both cite the National Aphasia Association.
- **Minimum target sizes.** Apple's default is 44 by 44 points with a minimum of
  28 by 28 ([Apple][hig-a11y]); WCAG asks for 24 by 24 CSS pixels at Level AA
  and 44 by 44 at Level AAA ([WCAG 2.2][wcag22]); React Native's docs say "at
  least 30 - 40 points/density-independent pixels" ([React Native][rn-view]);
  Android recommends "at least 48dpx48dp" ([Android][android-a11y]).
- **React Native's docs against its source.** The docs say the `activate` action
  is "Engaged when a screen reader user double taps the component" and describe
  `experimental_accessibilityOrder` as setting focus order ([React
  Native][rn-a11y]); the 0.86.3 iOS source sends every `accessibilityActions`
  entry to VoiceOver as a custom action and applies the order only behind a flag
  that defaults to `false` ([source][rn-view-src]; [source][rn-flags-src]).
- **Predictability against accuracy.** AAC practice keeps positions fixed "to
  minimize demands on memory and motor planning" ([ASHA][asha-aac]), while the
  one study that separated the two found "improvement in accuracy had a stronger
  effect on performance, utilization and some satisfaction ratings than the
  improvement in predictability" ([Gajos et al., 2008][gajos-2008]). Turn's
  split layout keeps both: a fixed grid and an adaptive row.
- **Floorholders.** A floorholder raised ratings of a slow, relevant message
  ([Bedrosian et al., 2003][bedrosian-2003]), but a quick message with
  repetition beat slow messages "with and without a preceding conversational
  floorholder" ([McCoy et al., 2007][mccoy-2007]).
- **Speed or control.** When timing mattered, users showed "a willingness to
  'trade-in' agency to deliver the humorous comments faster" ([Weinberg et al.,
  2025][weinberg-2025]), while others "would much prefer to type each word than
  have my sentences completed for me" ([Fried-Oken et al.,
  2024][fried-oken-2024]).
- **Preparation or the device.** When one participant used prepared answers in a
  job interview, people "attributed her with being responsible and well
  prepared"; on another occasion, a customized answer drew "'oh, the device did
  that for you'" ([Valencia et al., 2023][valencia-2023]).
- **Close enough.** Listeners rated partly relevant prestored messages lowest
  ([Bedrosian et al., 2020][bedrosian-2020]), yet older adults using generated
  sentences sometimes "accepted the suggestions as socially adequate" ([Xiang et
  al., 2025][socializechat-2025]).
- **Showing partners the context.** Partners valued knowing what an AAC user was
  answering ([Valencia et al., 2024][compa-2024]), while deaf and
  hard-of-hearing users worried a shared caption display could "reshape the
  conversation environment" ([McDonnell et al., 2021][mcdonnell-2021]).
- **Consistency across screens.** WCAG2ICT treats a "set of web pages" as a "set
  of software programs", rare in practice ([WCAG2ICT][wcag2ict]), while W3C's
  2025 draft on mobile says the "equivalent unit of evaluation for a 'set of web
  pages' would be a 'set of screens'" ([WCAG2Mobile draft][wcag2mobile]).

[android-a11y]: https://developer.android.com/guide/topics/ui/accessibility/apps
[socializechat-2025]: https://doi.org/10.1109/SMC58881.2025.11342589
[wcag2mobile]: https://www.w3.org/TR/wcag2mobile-22/

## Gaps

What the sources read don't say, as of September 22, 2026:

- **No study of Turn's pattern with AAC users.** No study read tested a model
  that ranks only the user's own saved phrases against the partner's live
  speech; the nearest are Converser in 2008 and 2009 ([evidence
  notes][ev-without]) and the stored-phrase use SpeakFaster Observer recorded.
- **Partners' views on being transcribed.** No study asked how partners,
  especially strangers, feel about an AAC user's device transcribing them; the
  recording studies used familiar partners who had consented to research.
- **Yes, No, and Not sure first.** No AAC study tests putting fixed answer
  buttons first for yes-or-no questions.
- **No adult AAC evidence for fixed positions or adaptive rows.** The location
  study used preschoolers without disabilities, and the adaptive interface
  studies used office workers.
- **Abstracts only.** The relevance, informativeness, floorholder, and
  rule-violation studies, Gosnell et al.'s app chart, KWickChat, Converser, the
  AI consultation by Griffiths et al. (2024), and the captioning study by Seita
  et al. were read as abstracts, since their full texts sit behind pages that
  block scripted reading.
- **No measure built for an AAC app.** The CPIB hasn't been tested with people
  who rely only on AAC, and QUEST 2.0 and PIADS rate devices.
- **No professional position on AI reply suggestions in AAC devices.** ASHA's AI
  page addresses clinicians, and the RCSLT principles cover AI in practice
  generally. A search of ISAAC's site for "artificial intelligence" finds only a
  webinar listing ([ISAAC][isaac-search]), and its page for the facilitated
  communication statement sits in a members-only area.
- **Missing clinical numbers.** No source read gives literacy rates for adults
  with cerebral palsy who use AAC or the share of ALS that begins with bulbar
  symptoms.
- **Safety-critical answers.** No study tested suggested or ranked replies to
  questions about pain, consent, or emergencies.
- **Personal Voice details.** Apple doesn't say how long training takes after
  the 10 phrases, whether older iPhones keep voices made before iOS 26, or what
  `write(_:toBufferCallback:)` does with a personal voice.
- **Microphone sharing.** No Apple page says how an app's live transcription
  shares the microphone with Vocal Shortcuts or Voice Control.
- **Detecting access features from React Native.** React Native 0.86 can't
  detect Switch Control or Voice Control or set Voice Control names, and none of
  the React Native findings was tested on a device.

[isaac-search]: https://isaac-online.org/english/?s=artificial+intelligence
[asha-aac]: https://www.asha.org/practice-portal/professional-issues/augmentative-and-alternative-communication/
[light-2019]: https://pmc.ncbi.nlm.nih.gov/articles/PMC6436972/
[gajos-2008]: https://doi.org/10.1145/1357054.1357252
[todman-2008]: https://pubmed.ncbi.nlm.nih.gov/18830912/
[beukelman-2011]: https://pmc.ncbi.nlm.nih.gov/articles/PMC3096454/
[ev-without]: /docs/research/next-gen-evidence.md#turn-without-jev
[bedrosian-2003]: https://pubmed.ncbi.nlm.nih.gov/12959461/
[mccoy-2007]: https://pubmed.ncbi.nlm.nih.gov/17364489/
[ev-need]: /docs/research/next-gen-evidence.md#evidence-that-turns-problem-matters
[higginbotham-2009]: https://pubmed.ncbi.nlm.nih.gov/18608144/
[fager-2019]: https://pmc.ncbi.nlm.nih.gov/articles/PMC6436971/
[ev-harm]: /docs/research/next-gen-evidence.md#harm-from-a-wrong-turn-decision
[bedrosian-2020]: https://pubmed.ncbi.nlm.nih.gov/32362177/
[valencia-2023]: https://doi.org/10.1145/3544548.3581560
[compa-2024]: https://doi.org/10.1145/3613904.3642762
[weinberg-2025]: https://doi.org/10.1145/3706598.3714102
[weinberg-2026]: https://doi.org/10.1145/3772318.3790310
[klein-2024]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10351684/
[fried-oken-2024]: https://pmc.ncbi.nlm.nih.gov/articles/PMC11409582/
[speakfaster-2024]: https://pmc.ncbi.nlm.nih.gov/articles/PMC11530652/
[adhikary-2019]: https://aclanthology.org/W19-1706/
[kane-2017]: https://doi.org/10.1145/2998181.2998284
[frisch-2026]: https://arxiv.org/abs/2606.24854
[observer-2023]: https://doi.org/10.1145/3544549.3573870
[asha-dysarthria]: https://www.asha.org/practice-portal/clinical-topics/dysarthria-in-adults/
[laureys-2005]: https://pubmed.ncbi.nlm.nih.gov/16186044/
[asha-aphasia]: https://www.asha.org/practice-portal/clinical-topics/aphasia/
[nr-2025]: https://www.apple.com/newsroom/2025/05/apple-unveils-powerful-accessibility-features-coming-later-this-year/
[ios26-pdf]: https://www.apple.com/os/pdf/All_New_Features_iOS_26_Sept_2025.pdf
[nr-2026]: https://www.apple.com/newsroom/2026/05/apple-unveils-new-accessibility-features-and-updates-with-apple-intelligence/
[ios-type]: /docs/research/ios-design.md#how-react-native-scales-text
[hig-a11y]: https://developer.apple.com/design/human-interface-guidelines/accessibility
[wcag22]: https://www.w3.org/TR/WCAG22/
[wcag2ict]: https://www.w3.org/TR/wcag2ict-22/
[rn-view]: https://reactnative.dev/docs/0.86/view
[rn-pressable]: https://reactnative.dev/docs/0.86/pressable
[rn-view-src]: https://github.com/react/react-native/blob/v0.86.3/packages/react-native/React/Fabric/Mounting/ComponentViews/View/RCTViewComponentView.mm
[rn-a11y]: https://reactnative.dev/docs/0.86/accessibility
[rn-flags-src]: https://github.com/react/react-native/blob/v0.86.3/packages/react-native/scripts/featureflags/ReactNativeFeatureFlags.config.js
[ug-pv]: https://support.apple.com/guide/iphone/record-your-personal-voice-iph51936468d/27/ios/27
[apple-speech]: https://www.apple.com/accessibility/speech/
[kb-pv]: https://support.apple.com/en-us/104993
[wwdc23]: https://developer.apple.com/videos/play/wwdc2023/10033/
[ug-ls]: https://support.apple.com/guide/iphone/type-to-speak-iphcf92d2d9b/27/ios/27
[mcdonnell-2021]: https://doi.org/10.1145/3479578

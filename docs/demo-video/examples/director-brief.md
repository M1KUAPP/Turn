# Turn demo video: director's brief

The design for Turn's Shipaton demo video (#67): story, look, sound, footage, and how it gets made. AlaskanTuna agreed each section on Sep 30, 2026. The recorder's own brief is `~/.cache/turn-work/video/briefs/recorder.md`; the implementation plan builds on this one.

Contents:

1.  [Goal](#goal)
1.  [Constraints](#constraints)
1.  [Story](#story)
1.  [Words](#words)
1.  [Look and motion](#look-and-motion)
1.  [Sound](#sound)
1.  [Footage](#footage)
1.  [Production](#production)
1.  [Schedule](#schedule)
1.  [Risks and fallbacks](#risks-and-fallbacks)

## Goal

A trailer-quality demo, under two minutes, that makes judges feel Turn's promise in the first ten seconds and then proves it.

- **By 0:17** a viewer can say what Turn does and who it's for, and has seen the Next Gen Award named.
- **Every Next Gen criterion is on screen:** the idea (the hook and the gap), a working app (the conversation), RevenueCat (the purchase), and technical choices and care (the model, the evaluation, consent, the care montage).
- **#67's criteria hold:** under 2:00 on YouTube, the Test Store purchase shown and named as a test, no copyrighted music, a caption file, and neither Jev nor TypeSafe named (SUBMIT-4, SUBMIT-6).

## Constraints

- **Deadline:** Devpost closes Oct 1, 2:45 PM MYT. The final render is due Sep 30, 10 PM MYT.
- **No iPhone or Mac.** All app footage is the real v2 build (PR #172) in the iPhone 16 Simulator on GitHub Actions, driven by Maestro. The replay engine feeds partner lines into Listen mode; everything after it is the real app.
- **Faithful to the iPhone.** Rows come from the hosted model, the relay's latency stays uncut, and the replay's timings follow the video iPhone's measured stages from #153 (last word to line end about 0.88 s, row at about 1.76 s median). No invented rows, states, or speeds, and no speed timer.
- **No Simulator mention in the video,** by the user's call: it's a trailer. The Devpost description should say how the footage was captured.
- **DESIGN's video rules hold, with three agreed changes.** Kept: 16:9 with the portrait screen inside, Atkinson Hyperlegible Next, on-screen text at least 54 px at 1080p, a caption file, no music under the partner or Turn. Changed: a narrator between app scenes; music where no one else speaks; and the key exchange set as ink-on-paper type beside the phone, not on a black plate, since its contrast is far higher.
- **Naming:** "a hosted decision model", never Jev or TypeSafe.
- **No real people.** The partner and narrator are ElevenLabs voices; Turn speaks in the app's own Apple voice.

## Story

A family member picks the person up from physio; the demo is one conversation. The narrator (N) never speaks over the partner or Turn.

| Time | Scene              | Picture                                                                                                                                    | Sound                                                  |
| ---- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| 0:00 | Hook (S1b)         | Opens on light. The phone rises in, its listen light comes on, and the orange glow blooms across the paper. Two exchanges.                 | Partner and Turn only; no music                        |
| 0:10 | Title (M1)         | "Turn" and the logline land on the music's first downbeat, with the Next Gen Award.                                                        | Sunset Tower drops in; N1                              |
| 0:17 | The gap (M2)       | The conversation streams on at 125–185 words a minute while "It was hard" types itself at 8–10 and arrives too late.                       | N2                                                     |
| 0:31 | Consent (S2)       | The partner's card, "They agreed", and the light comes on.                                                                                 | N3; music fades out by 0:38                            |
| 0:39 | Yes or no (S3)     | Yes, No, and Not sure; then the row offers a pain phrase. Tag: "Yes-or-no questions get fixed buttons."                                    | Partner and Turn only                                  |
| 0:53 | Nothing fits (S4)  | The row holds and nothing speaks; the person types "Mornings, please". Tag: "Nothing fits? Type it. Turn saves it."                        | Partner and Turn only                                  |
| 1:03 | The model (M3, M4) | Phrase cards lift into the row; a made-up sentence is struck through; the eval bars grow on the beat.                                      | Music returns; N4                                      |
| 1:21 | Purchase (S6)      | The free lines run out, the paywall, a purchase tagged "Test purchase · RevenueCat Test Store", Listen continues, a grid tap still speaks. | N6; partner audio muted in this scene                  |
| 1:41 | Care (S8)          | The same screen in Light, Dark, high contrast, and the largest text size.                                                                  | N7                                                     |
| 1:48 | End (M5, S9)       | End card; then the person types "Thanks for listening" and Turn says it.                                                                   | N8 optional; music fades out before Turn; silence; cut |

Target runtime is 1:55. If the cut runs long, N8 goes first, then the care montage shortens to two looks.

## Words

**Partner** (ElevenLabs, bright and warm), by replay ID:

1.  1: "How was physio?"
1.  9: "You look so much happier!"
1.  2: "Are you in pain?"
1.  3: "Where does it hurt?"
1.  4: "Would mornings or afternoons work better for your next visit?"
1.  5 to 8 (the purchase; muted in the cut, so their timings can stay placeholders): "Are you tired?", "Is the new medicine helping?", "Can you lift your arm for me?", "Does that feel better?"

**Turn** (planned taps; the model's actual rows win): "It went well", "I'm feeling better", "Yes", "My back hurts" or "It hurts to move", "Mornings, please", and "Thanks for listening".

**Narrator** (ElevenLabs, calm, a different timbre):

1.  N1: "For people who can't rely on their speech, replies come too late. Turn gets their own words ready in time."
1.  N2: "Conversation moves at 125 to 185 words a minute. Typing on a speech device: 8 to 10. 'It was hard' takes about twenty seconds, and by then, the moment has passed."
1.  N3: "Turn listens, and offers replies the person has already saved. First, the partner agrees."
1.  N4: "A hosted decision model picks from the person's own phrases, or none of them. It never writes a word. In our evaluation, the right reply made the row three times in four. Embeddings: under half."
1.  N6: "Speaking is always free. After 20 free lines, Turn Listen is a one-time purchase through RevenueCat."
1.  N7: "Built for the largest text sizes, dark mode, and high contrast."
1.  N8: "Turn. Your own words, in time for your turn."

**On screen:**

- **Title:** "Turn" · "Your own words, in time for your **turn**." · "RevenueCat Shipaton 2026 · Next Gen Award".
- **The gap:** "Conversation: 125–185 words a minute" · "Typed reply: 8–10".
- **The model:** "It never writes a word." · "Every phrase is the person's own."
- **The eval:** bars for keyword 23%, embeddings 45%, and the hosted decision model 75%, captioned "Right reply in the top 6 · 64 partner lines with a saved answer".
- **End card:** the icon, the logline, "github.com/M1KUAPP/Turn", "Open source · MIT", and "Three students · Next Gen Award".

Every number comes from the README's evaluation (Sep 23, `213f488`) or the PRD.

## Look and motion

- **Frame:** 1920 × 1080 at 30 fps, on v2's warm paper `#F4EFE7`, lit high-key from the center.
- **Phone:** the real footage in a plain, unbranded frame about 940 px tall, with v2's 1.5-point inked edge and soft two-layer shadow. Centered in the hook; to one side when words sit beside it.
- **Legibility:** the big words beside the phone carry the reading. The camera eases in gently (about 1.12×) toward the row around each exchange, since a deeper push would cover those words. A soft ink ring marks each real tap, taken from the cue sheet.
- **Type:** Atkinson Hyperlegible Next everywhere, from the repository's `assets/pitch/fonts/`. Titles 120 px, conversation words 72 to 84 px, tags at least 56 px. Partner words in ink `#1E1A15` left of the phone; Turn's in bold ultramarine `#2438C9` on the right. Orange (`#B84300`, glow `#FF8A3D`) only for listening. Title cards: two short lines, one word in ultramarine, fade in once and rest.
- **Signature:** while Turn listens, its orange glow spills out of the phone across the paper.
- **Motion grammar:** every frame is a pure function of the frame number, with keyframe tables and seeded randomness only. Elements enter already moving on an exponential ease-out, rest, and leave quickly. No bounces, whip-pans, or blur smears; motion blur only on fast phone moves, at most 4 px. Cuts land on the beat in music sections and follow the speech in conversation.
- **Stills gate:** five stills approved before the full render: the hook as the row appears, the title, the gap, the eval, and the end card.

## Sound

- **Voices:** two partner and two narrator candidates from ElevenLabs, picked by the user's ear. Partner lines are generated with word timestamps, which become `replay/lines.json` for the replay engine, so on-screen words match the audio exactly. Turn's lines are the app's Apple voice, rendered with `say` on the CI Mac.
- **Music:** "Sunset Tower" from the user's suite (00:36:21, G major, 92 BPM), on one continuous timeline from the title's downbeat. It fades out a second before any partner or Turn line and comes back where it would have been. It sits about 18 dB under the narrator and ends with a fade under the end card, before Turn's last line.
- **Levels:** master at −14 LUFS integrated and −1 dBTP true peak.
- **Content ID fallback:** a second render with no music, in case YouTube's copyright check claims the track.
- **Captions:** an SRT from the script and the timeline, with speakers named Partner, Turn, and Narrator.

## Footage

The recorder delivers takes, cue sheets, and Turn's WAVs to `~/.cache/turn-work/video/footage/<run-id>/` with a manifest, as its brief says. Scene to beat: S1b is the hook, S2 is consent, S3 and S4 are the conversation, S6 is the purchase, S8 is care, and S9 is the ending. S1 (the "It was hard" take) is spare footage. Takes are recorded again from `main` once #172 merges, if the screens changed.

## Production

- **Roles:** the director (session `revenuecat-97`) owns this brief, the voices, the Remotion edit, the mix, the captions, and final QA. The recorder (`revenuecat-56`) owns footage. The user owns the ElevenLabs account and key, picking voices, the review gates, the YouTube upload, and Devpost.
- **Project:** Remotion in `~/CS/muba/turn-video/`, its own local git outside the Turn repository, with scenes as data-driven compositions and timings in JSON. The user previews in Remotion Studio from a Windows browser.
- **Review gates:** voices, then stills, then the rough cut, then the final.
- **Deliverables:** `turn-demo.mp4` (H.264, 1080p30), `turn-demo-no-music.mp4`, and `turn-demo.en.srt`, copied to a Windows folder for upload.
- **QA before upload:** under 2:00; no Jev or TypeSafe in audio, text, or captions; the test purchase shown and named; no music under the partner or Turn; every number matches the README; text at least 54 px; loudness on target.
- **Upload (user):** YouTube, unlisted, "not made for kids", SRT attached. Wait for YouTube's copyright check before putting the link on Devpost; if the track is claimed, upload the no-music version instead.

## Schedule

Times are MYT on Sep 30 unless noted.

| By          | What                                                      |
| ----------- | --------------------------------------------------------- |
| 10:00       | This brief and the plan approved; the ElevenLabs key in   |
| 11:00       | Voices picked; `lines.json` with real timings to recorder |
| 16:00       | Final footage from the replay build                       |
| 18:00       | Rough cut for the user's review                           |
| 22:00       | Final render, both versions, and the SRT                  |
| Oct 1 10:00 | Uploaded, checked, and on Devpost (closes 2:45 PM)        |

## Risks and fallbacks

- **The replay spike fails:** S1b and S3 to S4 on the typed path, with the caption already filled in the cut.
- **The model offers different rows:** the script follows the app; lines change, never the rows.
- **The track is claimed:** the no-music render.
- **#172 changes after recording:** re-record the affected scenes from its new head.
- **Time runs short:** cut in this order: N8, the care montage to two looks, M3's struck-through sentence, the S3 follow-up line.

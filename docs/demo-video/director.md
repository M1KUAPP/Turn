# Director runbook

The director owns the video from the producer's first description to the final files: the brief, the recorder's brief, the plan, the voices, the music and sound, the sync, the edit, the mix, the captions and the checks. Its edit is a Remotion project in its own folder and its own local git, outside the app's repository. File formats live in [contracts.md](contracts.md); the recorder's side is [recorder.md](recorder.md).

Contents:

1.  [Rules](#rules)
1.  [The edit project](#the-edit-project)
1.  [1. Write the brief](#1-write-the-brief)
1.  [2. Brief the recorder](#2-brief-the-recorder)
1.  [3. Plan the edit project](#3-plan-the-edit-project)
1.  [4. Make the voices](#4-make-the-voices)
1.  [5. Make the music and sound](#5-make-the-music-and-sound)
1.  [6. Ingest and sync the footage](#6-ingest-and-sync-the-footage)
1.  [7. Cut the edit](#7-cut-the-edit)
1.  [8. Review the cut](#8-review-the-cut)
1.  [9. Finish and check](#9-finish-and-check)

## Rules

- **The producer holds the taste.** Every creative choice (a voice, a track, a still, the cut) goes to the user as a multiple-choice question with your recommendation first. Gates wait for their pick.
- **The script follows the app.** Turn's words, captions and audio come from what each take actually spoke, never from the script. When a take differs from the plan, rewrite the narration around it.
- **Hard rules are tests.** Each rule the brief makes absolute (the runtime limit, no music under app speech, banned words, minimum text size) gets a test in the edit project, run before every render.
- **Every frame is a function of the frame number.** Motion comes from keyframe tables and seeded randomness, so a render is reproducible and a still shows exactly what the video shows.
- **Media stays out of git.** `public/` and `out/` are ignored; the scripts regenerate them. Secrets are read only inside the script that uses them.

## The edit project

Turn's layout, which [Turn's implementation](README.md#turns-implementation) points at. Start a new project with the same shape:

```text
turn-video/
├── public/            fonts, footage/, voice/, turn/, music/, sfx/ (not in git)
├── scripts/           eleven.ts, audition.ts, lines.ts, voice-lines.ts, audio.ts,
│                      music.ts, beats.py, sfx.ts, ingest.ts, detect.py, levels.py,
│                      stills.ts, captions.ts, qa.ts, finish.sh
├── src/
│   ├── Root.tsx       Main, MainNoMusic, and one preview composition per motion scene
│   ├── Main.tsx       places scenes, voices, effects, room tone, music and subtitles
│   ├── edit.ts        the cut: SEQUENCE and the scene groups
│   ├── build.ts       buildEdit(): frames, audio, speech cues, captions, subtitles
│   ├── copy.ts        every on-screen string
│   ├── theme.ts       colours and type sizes
│   ├── lib/           time, keyframes, timeline, words, cues, clips, envelope, srt, subs, qa
│   ├── data/          footage.json, voice.json, beats.json, levels.json (generated)
│   ├── components/    the phone frame, words beside it, tags, subtitles, chapter chips
│   └── scenes/        AppScene and the motion scenes
└── test/              the hard rules and the timing maths
```

The stack is Remotion 4 with React and TypeScript, Bun for scripts and tests, Python with NumPy for frame and audio analysis, librosa (through `uv run --with librosa`) for beats, and FFmpeg for every encode and measurement. Load the `remotion:remotion-best-practices` skill before writing compositions.

## 1. Write the brief

Interview the producer with the brainstorming skill, one question at a time, then write the brief with these sections ([Turn's](examples/director-brief.md) is the model):

- **Goal:** what a viewer can say by a given second, and the judging criteria each scene proves.
- **Constraints:** the deadline, the hardware the team lacks, what stays faithful to the real device (with measured numbers), naming rules, and what may never appear.
- **Story:** a table of time, scene, picture and sound, with the target runtime and the order in which scenes get cut when it runs long.
- **Words:** the partner's lines by ID, the app's planned replies (the app's actual choices win), the narration by ID, and every on-screen string with the source of each number.
- **Look and motion:** frame size and rate, colours, type and minimum sizes, the phone's frame and camera moves, the motion grammar, and the stills the producer approves before a full render.
- **Sound:** voices and how they're picked, music and where it plays, loudness targets, the no-music fallback, and captions.
- **Footage:** where takes land and which scene each one serves.
- **Production:** roles and their sessions, the edit project's location, review gates, deliverables, the QA list and the upload steps.
- **Schedule and risks:** times for each gate, and a fallback for each risk.

_Done when_ the producer has approved every section.

## 2. Brief the recorder

Write the recorder's brief from the brief's scenes ([Turn's](examples/recorder-brief.md) is the model): the situation (why the cloud machine, why a stand-in), the rules from [recorder.md](recorder.md#rules), the capture pipeline task, the stand-in spike with its time box, the scenes in priority order with their lines and the reply each one expects, the deliverables, and when to report. Send it to the recorder's session, or start that session with it.

_Done when_ the recorder has dispatched its first run.

## 3. Plan the edit project

Turn the brief into a task plan with the writing-plans skill, then build it task by task with subagent-driven development. The plan carries:

- **Global constraints:** the brief's hard rules, restated as numbers (frame size, runtime limit in seconds, colours, loudness targets).
- **Review focus:** the ways this video can go wrong, each with the test that catches it. Turn's five: the app offers a different reply than the script; music under speech; runtime creep past the limit; banned words on screen or in captions; a tap with no coordinates.
- **File structure** and **task order**, with the gates G1 to G4 placed: tasks that need nothing external first, the voices at G1, the ingest and motion scenes on candidate footage while the final footage records.

Turn's tests, as a starting set: every frame of every app line has music at zero gain; the narrator never overlaps the partner or the app; the app's captions are the phrases the takes spoke; the runtime is under the limit; music scenes end on a beat; on-screen copy contains no banned word; every text size meets the minimum; every subtitle row spells its narration's words.

_Done when_ the producer approves the plan.

## 4. Make the voices

Gate G1. The scripts call ElevenLabs's API with a key the producer saved to a file only `eleven.ts` reads (`~/.config/turn/elevenlabs-key` for Turn).

1.  **Audition.** `bun scripts/audition.ts` lists the premade voices with gender, age, accent and use; pick two or three per role that fit the brief. `bun scripts/audition.ts partner:<id> narrator:<id> ...` renders a line from the script in each, into the working folder's `audio/auditions/`.
1.  **The producer picks by ear.** Ask with the files' paths; record the picks in `scripts/voices.json`.
1.  **Generate every line.** `bun scripts/voice-lines.ts` speaks each line in `scripts/lines.ts` through `/v1/text-to-speech/<voice>/with-timestamps` with a fixed seed, so a re-run repeats the take, and per-role settings (Turn's partner: stability 0.45, style 0.25; narrator: stability 0.6, style 0.1; both similarity 0.8 with speaker boost). It normalizes each clip to −16 LUFS, turns the character alignment into word timings, and writes `src/data/voice.json` and the recorder's `lines.json`. Pass line IDs to regenerate only those.
1.  **Tell the recorder** that `lines.json` has real timings; its next run is the final footage.

_Done when_ `lines.json` holds every partner line with word timings and the recorder has been told.

## 5. Make the music and sound

1.  **Music.** Use a track the producer owns or licenses. `music.ts` cuts the chosen section with FFmpeg, normalizes it to −16 LUFS, and runs `beats.py`, which finds the tempo, beats and downbeats with librosa and picks the entry: the first downbeat whose next two bars reach 90% of the track's median energy. The edit starts the music on that downbeat.
1.  **Effects.** `sfx.ts` generates each effect through ElevenLabs's sound generation and normalizes it to its own target (−24 to −26 LUFS for effects, −40 for room tone, which loops). Effects go on motion-graphics moments only, never on the app's own taps, and sit about 18 dB under the narrator. Play each one to the producer; a prompt can come back as a voice, so phrase prompts as foley ("Foley sound effect: ... No voice, no speech, no music.") and raise `prompt_influence`.
1.  **Waveform levels**, when the edit draws waveforms: `python3 scripts/levels.py public/voice/*.wav public/turn/*.wav > src/data/levels.json` gives each clip's loudness per frame.

_Done when_ `src/data/beats.json` exists and the producer has heard and accepted each effect.

## 6. Ingest and sync the footage

Run per footage run, after the recorder reports one (its files are under `footage/<run-id>/`):

```shell
bun scripts/ingest.ts ~/.cache/turn-work/video/footage/<run-id> [<later-run-id> ...]
```

For each take in the run's manifest, `ingest.ts`:

1.  Skips a take the manifest marks `take FAIL`, keeping an earlier run's take with the same key.
1.  Re-encodes the original recording to 30 fps H.264 (`-fflags +igndts`, see [lessons.md](lessons.md#footage)), holding the last frame to the take's recorded length, into `public/footage/<key>.mp4`. The key is `<scene>[-<clip>]-t<take>`.
1.  Runs `detect.py`, which reads each event off the footage's pixels (below).
1.  Converts the detected times to frames with `screenCues` (`src/lib/cues.ts`), falling back for each missed event (below), normalizes each phrase the app spoke to −16 LUFS under `public/turn/`, and fails when a spoken phrase has no WAV.
1.  Merges the take into `src/data/footage.json`; later runs on the command line win.

It prints, per take, any event "not seen on screen, from cues". Step through each of those in Remotion Studio and accept the fallback or fix the detector.

### What detect.py reads

The detector decodes the take at a sixth of its size and watches fixed regions, in points of the 393 × 852 screen:

- **A partner line starts** when the caption card's text first changes after the line's cue. The voice began earlier by the stand-in's first result tick (1000 ms behind the first word, on a 500 ms cadence), so the voice's start is the caption's change minus that tick.
- **The reply row arrives** when the row region first changes after the caption, and **settles** when its pixels hold still for 0.3 s.
- **A tap lands** when the 68 × 30-point box around the tap's point first changes after its mark.
- **The app speaks** when the device log says its audio started (the `audio-start` cues the recorder adds). The Stop label isn't a clock: on a launch's first reply it can render only after the voice has ended.

Regions are tied to the app's layout: update the boxes when the screens change, and keep the old ones in a comment.

### When an event isn't seen

Each event falls back in this order, with lags measured on Turn's runs (`screenCues` in `src/lib/cues.ts`):

- **A partner line:** the screen, then the cue plus 0.12 s.
- **A tap:** the screen; then the device log's alert time, since a system alert's button shows no press; then, for a press that speaks, 0.1 s before its audio starts; then Maestro's tap log plus 1.2 s; then the mark plus 0.9 s.
- **The app's speech:** the device log's audio start, then 0.1 s after the press. A cold synthesizer is the exception: when Stop outlasts the voice by over 0.25 s, the voice ends as Stop goes.

_Done when_ `footage.json` lists every take `edit.ts` names, and every unseen event has been checked.

## 7. Cut the edit

The cut is data in `src/edit.ts`; `buildEdit()` in `src/build.ts` turns it into frames, audio and captions, and `Main.tsx` renders them.

- **App scenes are windows cut at cue points.** Each window runs from `pre` frames before a start cue to `post` frames after an end cue. Cues name events: a partner line (`replay`), the row settling after it (`row`), a tap by its label (`tap`), a phrase the app spoke (`speak`), the first reply after a line whatever its text (`speakAfter`), or a time in the take (`at`, for a moment no event marks, such as a sheet sliding up). Cut the recorder's waits, never the app's own latency: each window keeps a line through its row, and a tap through the reply's speech.
- **Groups set the sound and look.** In Turn's edit: `MUTED` groups drop the partner's and app's audio (the purchase), `PUSH` groups lean the camera toward the mean of their taps, `ROOM_TONE` groups lay room tone under a run of scenes, and `CHAPTERS` puts a chip on each section.
- **Narration** is placed by scene and frame offset (`NARRATION`); the build test keeps it clear of the partner and the app.
- **The music envelope** (`src/lib/envelope.ts`) is silent from 8 frames before each partner or app line to 8 frames after, joining gaps under a second; ducks 12 dB under the narrator from a base gain of 0.5 (about 18 dB down in all); drops to 0.55 of its level inside app scenes, so it breathes quietly between lines; and fades out before the app's last line. Motion scenes that carry music end on a beat (`snapEnds`, within 10 frames).
- **Motion scenes** (title, charts, the end card) are compositions with their own preview (`P-Title` and so on in `Root.tsx`). Build them with helper agents, one scene each, given the brief's look section, the theme, `copy.ts`, and Remotion's agent skills; review each by stills.
- **Captions** come from the build: every partner line, app phrase and narration, named Partner, Turn or Narrator. On-screen subtitle rows split each narration at most 42 characters a row (`COPY.subs`), and a test checks that the rows spell the narration's words.

Preview with `bun run studio` (the producer can open Studio from their own browser). Run `bun test` and `bunx tsc --noEmit` after each change.

_Done when_ the tests and the typecheck pass and the cut plays through in Studio with no missing cue.

## 8. Review the cut

1.  **Stills (gate G2).** `bun scripts/stills.ts` renders the frames the brief names (Turn's: the hook just after the app's first reply, the title, the gap, an app scene, the model, the end card) with `remotion still`, and copies them where the producer can see them. Act on their notes and render again.
1.  **The rough cut (gate G3).** Render `Main` and give the producer the file. Notes on taste become tasks: Turn's "the stills look basic" sent three helper agents to rebuild the motion scenes while the director fixed the pacing.
1.  **New footage.** When the app changes, the recorder re-films the scenes whose screens changed; ingest the new runs, update the take keys in `edit.ts`, and render the stills again. The tests catch runtime creep and captions that no longer match the takes.

_Done when_ the producer approves the rough cut.

## 9. Finish and check

Gate G4. `scripts/finish.sh` runs the whole finish:

1.  `bun test` and `bunx tsc --noEmit`.
1.  Renders `Main` and `MainNoMusic` at H.264, CRF 16, 320 kb/s audio.
1.  Sets loudness without pumping: measure, lift to −13 LUFS, limit at −2 dBFS at 192 kHz (attack 1 ms, release 60 ms), then a two-pass `loudnorm` to −14 LUFS and −1 dBTP with `linear=true`. It fails when `loudnorm` reports anything but linear, since its dynamic mode pumps the music bed.
1.  Writes the captions as SRT (`bun scripts/captions.ts`).
1.  Runs QA (`scripts/qa.ts`): each file under the runtime limit (119.5 s for Turn), −14 ± 0.7 LUFS, true peak at most −0.9 dBTP, and no banned word in the captions.
1.  Copies both videos and the SRT to the producer's folder.

Then check what scripts can't: watch the whole video at full size; check every number against its source; confirm the brief's must-shows are on screen (Turn's: the test purchase named as a test). Hand the producer the files, the brief's upload steps, and a video description.

_Done when_ QA passes, your own checks pass, and the producer approves the files.

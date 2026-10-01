# Lessons

What went wrong or surprised the crew on Turn's video, each with its cause and the fix now built into the pipeline. Read the sections for the stage you're in; each lesson applies beyond iOS unless it names the platform.

Contents:

1.  [Crew and taste](#crew-and-taste)
1.  [CI and capture](#ci-and-capture)
1.  [Maestro](#maestro)
1.  [Footage](#footage)
1.  [Speech](#speech)
1.  [Sound](#sound)
1.  [Edit and delivery](#edit-and-delivery)

## Crew and taste

- **The app went off script.** The script expected certain replies; the hosted model ranked others. The rule since: film what the app does, send the director the actual reply, and rewrite the words around the footage. Captions and the app's audio come from each take's own cues, and a test fails when they drift from the takes.
- **Taste arrives late unless you ask for it.** The producer's first look at the cut was "the stills look basic", three hours in. A stills gate before the first full render (G2) puts that note first; multiple-choice questions with a recommendation keep each gate to one reply.
- **Footage finds bugs.** Filming the real app caught a label clipping at large text sizes; a third session fixed it in the app while filming went on. Keep fixes out of the recorder's branch.
- **The app changed at 10:46 PM.** A redesign merged after the cut was done made every shot stale. Because voices, sync, cut and mix were code, the recorder re-filmed every scene overnight in two parallel batches and the director re-ran the pipeline; nothing was re-edited by hand. Plan for one full re-shoot.
- **Agents can set up accounts.** The director drove the producer's Chrome with Claude in Chrome to create the ElevenLabs key, then saved it to a file only its script reads.

## CI and capture

- **New workflow files don't dispatch.** GitHub dispatches only workflows that exist on the default branch, so a recording job goes into the app's existing build workflow on the recorder's branch, dispatched with `--ref <branch>`.
- **Runs cancel each other.** A concurrency group keyed on the commit alone cancels a running batch when the next one starts. Turn's group includes the `flows` input, so batches of different scenes from one commit run side by side.
- **The first two runs uploaded nothing.** `actions/upload-artifact` rejects paths containing `:"<>|*?`, and Maestro names folders after flows. Rename paths before the upload, and upload with `if: always()` so a failed or timed-out run still returns its footage.
- **Cold runners time out.** Maestro's driver sometimes times out before any step on a fresh runner (`IOSDriverTimeoutException`). Retry once for that error only; any other failure stands.
- **Deep links ask first.** Cueing lines through `turn://` made iOS show "Open in Turn?" mid-shot. The stand-in polls a server on localhost instead, which needs no system prompt.
- **One look per take.** A take that fails mid-flow can leave dark mode or a large text size behind. Reset the appearance, contrast and text size before every take, not once per run.

## Maestro

Version 2.10.0, on iOS:

- **No sleep and no shell.** Waits and recording control go through `runScript` calling the recording-control server over HTTP ([recorder.md](recorder.md#the-recording-control-server)).
- **Visibility is judged against the whole screen.** An element under a bar or the keyboard counts as visible, and a tap on it lands on the bar. Scroll it clear first.
- **`above` and `below` compare element tops,** and resolve only while both elements are on screen: Maestro lists only on-screen elements, so a tall row can push its anchor off.
- **Leaving a screen:** tap the navigation back button by its text, not `back`. **The keyboard:** `hideKeyboard` does nothing in sheets; tap a label that takes no touches.
- **`scrollUntilVisible` gives up after 20 s** and doesn't re-check after its last swipe; long lists at large text sizes need a timeout of 60 to 180 s.
- **Wait for what the app shows, never for a fixed time:** `extendedWaitUntil` on the reply's text, with regex for lines that may wrap.

## Footage

- **simctl's recordings misread.** `simctl io recordVideo` writes variable frame rate files with decode timestamps that FFmpeg's default timing misreads, reordering a take by up to 9 s. Decode and re-encode with `-fflags +igndts`, which keeps presentation times; the recorder's own 60 fps copies were scrambled the same way, so the ingest starts from the originals.
- **Still holds vanish.** A variable frame rate file has no frames while the screen is still, so a hold at the end of a take comes out short. Hold the last frame to the take's recorded length (`tpad=stop_mode=clone`, then `-t <recordedSeconds>`).
- **The runner's clock lies about the screen.** Maestro's taps land 0.8 to 1.7 s after its log says, a tap on an in-app alert later still, and a cold synthesizer speaks up to 2 s after its tap. Sync to the pixels and the device log ([director.md](director.md#6-ingest-and-sync-the-footage)), and keep the measured lags only as fallbacks.
- **Some moments have no event.** A sheet sliding up, or the paywall's skeleton and hero image loading over the runner's network, aren't marked by any cue. Cut them by time in the take (an `at` cue), and cut a loading state the user wouldn't wait through on a real phone.

## Speech

- **The first reply after launch is late.** In the Simulator, a launch's first utterance starts about 2 s late while the voice and audio path load, and reaches the speaking state only after its voice has ended. Have the app speak once off camera before filming (`warm-speech.yaml` taps a phrase before Listen mode starts), and Turn's stand-in also speaks one word at zero volume as Listen mode starts, outside every store.
- **A label isn't a clock.** The Stop label can render after the voice it labels has finished. The synthesizer's own log ("Audio queue started successfully") times speech exactly, so the recorder adds those times to the cue sheets.
- **Simulator recordings are silent.** Render each phrase the app spoke on the runner with `say`, in the voice the app gets by default there (Samantha for Turn), and lay those WAVs on the app's speech cues.

## Sound

- **A sound effect sounded like a person.** The prompt "twang" came back as a voice. Write effect prompts as foley ("Foley sound effect: ... No voice, no speech, no music.") and raise `prompt_influence` (0.85 fixed Turn's).
- **Loudness normalization pumped the music.** FFmpeg's `loudnorm` falls back to dynamic mode when the input's peaks are too far above the target, and that pumps the bed under the voices. Lift to 1 dB over the target, limit at −2 dBFS with 4× oversampling, then run a two-pass `loudnorm` with `linear=true` and fail the build if it reports anything else.
- **Music can be claimed.** Render a no-music version alongside the main one, upload unlisted, and wait for YouTube's copyright check before sharing the link; if the track is claimed, upload the no-music version.
- **Music under speech is a bug, not a mix choice.** The envelope silences music around every partner and app line, and a test checks every frame of every line in the real edit.

## Edit and delivery

- **Cut waits, never latency.** Cut where the recorder's flows waited, and keep the app's own response time inside every window, so the video can't flatter the app's speed.
- **Motion scenes parallelize well.** Give each animated scene to its own helper agent with the brief's look section, the theme and Remotion's agent skills, and review each by stills; the director keeps the cut and pacing.
- **Automate the checklist.** Runtime, loudness, true peak and banned words are checked by a script before every hand-off, so the wrong file never reaches the upload.

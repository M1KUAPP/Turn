# Recorder runbook

The recorder films the real app on a cloud machine, scene by scene from the director's shot list, and delivers each take with a cue sheet that says when every line, tap and spoken phrase happened. This runbook is for an iOS app on GitHub Actions; [README.md](README.md#adapting-it-to-another-app) maps the pieces to other platforms. File formats live in [contracts.md](contracts.md).

Contents:

1.  [Rules](#rules)
1.  [Steps](#steps)
1.  [The recording mode](#the-recording-mode)
1.  [The recording-control server](#the-recording-control-server)
1.  [Scene flows](#scene-flows)
1.  [The stand-in input](#the-stand-in-input)
1.  [The app's own voice](#the-apps-own-voice)
1.  [Downloading a run](#downloading-a-run)

## Rules

- **Honest footage.** Record the app as it behaves. Rows, states and timings come from the app; the app's own latency stays in every take. When a scene's planned reply doesn't appear, record what did and send the director the actual reply.
- **A branch that never merges.** Work in your own worktree on a branch such as `video/<name>`: no pull request, no merge, no release, and no comments on the app's issues. Skip the repository's graph or docs updates on it.
- **The user authorizes.** Anything that needs a person (a key, a payment, a repository setting) goes to the user, never to the director.
- **Secrets stay unprinted.** Read key files only inside the scripts that use them.
- **Time-boxed spikes.** Give the stand-in three hours; past that, film its scenes on the app's manual path (typed input, for Turn) and report why.

## Steps

1.  **Branch.** Create the worktree and branch, install with the lockfile (`bun install --frozen-lockfile`), and read the director's brief for you. _Done when_ the app's existing Simulator build passes on your branch.
1.  **Recording mode.** Add a `video` job to the app's existing build workflow, as [the recording mode](#the-recording-mode) describes. _Done when_ a run dispatched with an empty scene list builds, boots the Simulator and uploads an artifact.
1.  **Server and flows.** Add the [recording-control server](#the-recording-control-server), the shared flow steps and one scene flow ([scene flows](#scene-flows)). _Done when_ a run returns that scene's MP4, a cue sheet with every tap's point, and `results.txt` saying PASS.
1.  **First footage.** Record every scene that needs no stand-in, and send the director the run ID. _Done when_ the director has a run to cut against.
1.  **The stand-in.** Build it behind a build flag ([the stand-in input](#the-stand-in-input)) and film one line with it. _Done when_ a take shows the line in the caption and the app's real reply row after it, with the line's `replay` cue in the cue sheet.
1.  **Final footage.** Once the director's `lines.json` has real timings, record every scene, in parallel batches, with the takes the brief asks for. _Done when_ every take in `results.txt` says PASS; re-record a failed take rather than ship it.
1.  **Download and report.** Download each run ([downloading a run](#downloading-a-run)) and message the director the run ID, the footage path and anything the manifest's notes flag. _Done when_ the director confirms ingest.

Report at each of these points (a run dispatched, footage downloaded, the stand-in's result, any blocker) without waiting for replies.

## The recording mode

Add the mode to the workflow that already builds the app, not to a new file: GitHub dispatches only workflows that exist on the default branch, so a new file on your branch can't run. Dispatch your branch's copy of the existing one:

```shell
gh workflow run <build-workflow>.yml --repo <owner>/<repo> --ref <your-branch> \
  -f ref=<your-branch> -f screenshots=video -f flows="s1b-hook s2-consent:3" \
  -f takes=1 -f listen_engine=replay
```

**Turn has no workflows now.** They were removed after [`bcb0849`](https://github.com/M1KUAPP/Turn/blob/679b3409323eba612a38b67ae50fd31a43a0912f/.github/workflows/ios-simulator-build.yml), so GitHub won't dispatch Turn's `video` job, and recording Turn is manual: on a Mac with Xcode 27, CocoaPods and the Maestro CLI, check out `041a528`, whose branch is gone, and run the job's commands by hand:

```shell
git fetch origin 041a5280867853a5d16e95c7d366629f5975c069
git switch --detach 041a5280867853a5d16e95c7d366629f5975c069
EXPO_PUBLIC_LISTEN_ENGINE=replay bash scripts/build-simulator.sh
ditto -x -k Turn.app.zip turn-app
bash scripts/video/record-scenes.sh turn-app/Turn.app <out> "s1b-hook s2-consent:3" 1
```

What Turn's `video` job did, in order ([`ios-simulator-build.yml` at `041a528`](https://github.com/M1KUAPP/Turn/blob/041a5280867853a5d16e95c7d366629f5975c069/.github/workflows/ios-simulator-build.yml), on `video/replay-engine-v5`):

1.  **Inputs.** `screenshots: video` picks the job; `flows` lists scene flows (a name can end in `:N` for N takes); `takes` is the default count; `listen_engine` is the build flag the stand-in reads.
1.  **Concurrency.** The group includes the `flows` input, so batches of different scenes from one commit run side by side instead of cancelling each other.
1.  **Build, then record.** The run's build job makes the Simulator `.app` with the stand-in's flag and uploads it; the video job downloads it.
1.  **Record.** `scripts/video/record-scenes.sh <App.app> <out> "<scenes>" <takes>` runs the takes ([below](#one-take)). Its step sets `continue-on-error: true` and a timeout under the job's, so a run that fails or overruns still uploads what it filmed.
1.  **Upload.** One artifact per run (`Turn-video`), uploaded with `if: always()` and a 7-day retention; a last step fails the run if any take failed.

### Runner setup

`record-scenes.sh` prepares the device before any take:

- **Device.** The newest available iOS runtime, and an iPhone 16 on it (created if absent), booted and waited on with `simctl bootstatus -b`.
- **A clean status bar.** `simctl status_bar <udid> override --time '9:41' --dataNetwork wifi --wifiMode active --wifiBars 3 --cellularMode active --cellularBars 4 --batteryState charged --batteryLevel 100`.
- **The default look.** `simctl ui <udid> appearance light`, `content_size large`, `increase_contrast disabled`; every take starts from this look again, even after a failed one.
- **The app.** `simctl install` of the downloaded build.

### One take

For each scene and take, the script:

1.  Resets the look and tells the server which scene and take this is (`/ui`, `/take`).
1.  Streams the app's device log to `maestro/<scene>-take<N>/device.log` (`simctl spawn <udid> log stream --style compact --level info --predicate 'process == "<App>"'`); speech and alert timings come from it later.
1.  Runs the flow with `maestro --device <udid> test --debug-output <dir> --flatten-debug-output`, with `MAESTRO_CLI_LOG_PATTERN_FILE='%d{UNIX_MILLIS} ...'` so every log line carries epoch milliseconds for matching taps to cues.
1.  Retries once only when Maestro's driver timed out before any step (`IOSDriverTimeoutException`, a cold runner); any other failure stands.
1.  Dumps the last screen's view hierarchy (`maestro hierarchy`), every element's frame in points, for the director's detectors.
1.  Calls `/finish`, so the recording file is closed before the next take starts, and appends `scene take PASS|FAIL` to `results.txt`.

After all takes it renders the app's voice ([the app's own voice](#the-apps-own-voice)), writes the cue sheets with `cues.py`, and renames any path holding `:"<>|*?`: `upload-artifact` rejects them, and Maestro names folders after flows. Turn's first two runs uploaded nothing for that reason.

## The recording-control server

Maestro can't run a shell command, but its JavaScript can make HTTP requests. So a small server on the runner (`scripts/video/recorder.py`, port 8765) does the work a flow can't, and logs every request with the host clock to `events.jsonl`. Flows call it through one script, `apps/mobile/maestro/video/rec.js`, with `CMD` and its variables in `env`.

| Endpoint                                        | Does                                                                                                                                                                                                  |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/take?scene&take`                              | Names the flow and take that follow                                                                                                                                                                   |
| `/start?scene&clip&lead`                        | Starts `simctl io <udid> recordVideo --codec=h264 --force <file>`; the moment simctl prints "Recording started" is the file's zero (`recordingStartMs`); then waits `lead` ms (2000) before returning |
| `/stop?tail`                                    | Waits `tail` ms (2000), then stops the recording with SIGINT                                                                                                                                          |
| `/mark?label`                                   | Logs a cue: `tap <label>`, `line <text>`, `speak <phrase>`, or several joined with `;`                                                                                                                |
| `/wait?ms`                                      | Sleeps; Maestro has no sleep step                                                                                                                                                                     |
| `/ui?appearance&increase_contrast&content_size` | Runs `simctl ui` for each given setting                                                                                                                                                               |
| `/cue?id`                                       | Queues line `id` from `lines.json` for the stand-in                                                                                                                                                   |
| `/cue-next`                                     | The stand-in's poll: returns the queued line (200) and logs a `replay` event, or 204                                                                                                                  |
| `/finish`                                       | Stops any open recording and waits until every file is closed                                                                                                                                         |

One flow can film several scenes: `/start?scene=<name>` names each recording after its scene, and a `clip` name splits one scene into short clips (Turn's four accessibility looks).

## Scene flows

A scene is one Maestro flow in `apps/mobile/maestro/video/<scene>.yaml`, built from shared steps. The shape of Turn's hook scene, `s1b-hook.yaml`:

1.  **Off camera:** a fresh app at the clinic (`setup-clinic.yaml`, which ends by having the app speak once through `warm-speech.yaml`; see [lessons.md](lessons.md#speech)), then Listen mode started and consent accepted (`listen-setup.yaml`).
1.  **Start** with `rec.js` `CMD: start`, `LEAD: '2000'`.
1.  **Act at a person's pace:** a line (`replay-line.yaml`), a hold while the reply row settles, a tap on the reply (`row-reply.yaml`), a 3-second hold after each result.
1.  **Stop** with `CMD: stop`, `TAIL: '2000'`.

The shared steps, each a few lines of YAML:

- **`tap.yaml`:** a 1.2-second pause, a `tap <TARGET>` mark, then the tap. Every on-camera tap goes through it, so the cue sheet has it.
- **`hold.yaml`:** a `/wait` of `MS`; holds give the edit room to cut.
- **`replay-line.yaml`:** marks `cue replay <ID>`, queues the line, and waits up to 20 s for the caption to match `LINE_RE`. The app's answer is never hurried.
- **`row-reply.yaml`:** taps `REPLY` in the reply row (`above: All`) if the row offers it and no earlier call has tapped, marking `tap X; speak X` as one cue. Call it with the scene's replies in order of preference, so the first one the app offers is the one tapped.
- **`takeScreenshot`** at key moments (the row before the tap): cheap evidence when a take looks wrong.

Write flows against what the app shows, never against fixed waits: wait for text (`extendedWaitUntil`) and use regex for lines that can wrap. Put dismissable cards (Turn's Starter phrases card) away off camera before the start.

## The stand-in input

The stand-in replaces exactly one input the cloud machine lacks, behind the app's own interface for that input, so nothing downstream can tell. Turn's is `apps/mobile/src/listen/replay-engine.ts`, a `ListenEngine` that replays scripted partner lines word by word.

- **Selected by a build flag only.** `EXPO_PUBLIC_LISTEN_ENGINE=replay` makes `app.config.ts` set `extra.listenEngine` to `replay`, and the engine picker returns the stand-in only when the build kind is `simulator` and that flag is set. Every other build is unchanged, so the stand-in can't reach users.
- **Timed like the device.** Measure the real input's stages on a real device first, then copy them. Turn's, from the video iPhone: the voice level falls 190 ms after the last word, finalizing takes 190 ms, the transcriber's results trail the audio by 1000 ms and arrive every 500 ms, and the line ends after a 500 ms silence window, so a line lands 0.88 s after its last word, as on the phone.
- **Events in the real order.** `onVoice(true)` at the first word, `onPartial(words so far)` on each result tick, `onVoice(false)` after the last word plus the voice fall, then after the silence window and finalizing `onLine({text, endedAt, silenceWindowMs})`. Pause drops a line being finalized, as the device's pause does.
- **Cued over localhost, not deep links.** While listening, the engine polls `http://localhost:8765/cue-next` every 150 ms; a flow queues a line with `/cue`. A `turn://` link would also work, but iOS asks "Open in Turn?" first, and that question ends up on camera. Only the replay build adds the App Transport Security exception for plain HTTP to `localhost`.
- **Timings read at run time.** The server reads `lines.json` on each `/cue`, so new voice timings from the director need no rebuild.
- **Warmed up.** Its `warm` hook speaks one word at zero volume as Listen mode starts, muted and outside every store, so the first reply on camera isn't late ([lessons.md](lessons.md#speech)).
- **Tested.** A unit test of one line's event timeline with fake timers (`apps/mobile/test/replay-engine.test.ts`), plus the app's typecheck.

## The app's own voice

Simulator recordings carry no sound, so the runner renders each phrase the app spoke, in the voice the app uses there:

1.  A tiny Swift program, compiled for the Simulator and run with `simctl spawn`, prints `AVSpeechSynthesisVoice(language: AVSpeechSynthesisVoice.currentLanguageCode())`: the default voice an app gets when it sets none. It wrote Samantha for Turn; the script falls back to Samantha when the probe fails.
1.  Every `speak <phrase>` mark in `events.jsonl` becomes `say -v <voice> --file-format=WAVE --data-format=LEI16@48000 -o voice/<slug>.wav "<phrase>"`, listed in `voice/phrases.tsv`.

## Downloading a run

On the local machine, after dispatching:

1.  **Wait and download** in the background with `~/.cache/turn-work/video/fetch-run.sh <run-id>`: it polls `gh run view` every minute, then `gh run download -n Turn-video` into `footage/<run-id>/` with a 15-minute timeout.
1.  **Device-log speech times:** `python3 scripts/video/audio-cues.py <dir>` adds `audio-start` and `queue-stop` cues from the synthesizer's "Audio queue started successfully" log lines; the director's sync prefers them for the app's voice. It keeps the runner's sheets in `cues.runner/`, so it can run again.
1.  **Manifest:** `python3 scripts/video/manifest.py <dir> <run-id>` writes `manifest.json` ([contracts.md](contracts.md#manifestjson)).
1.  **Constant-frame-rate copies, when wanted:** `python3 scripts/video/cfr.py <dir>` writes 60 fps copies to `cfr/`, the last frame held to each take's recorded length. The director's ingest re-encodes from the originals itself.

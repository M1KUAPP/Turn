# Recorder brief: Turn demo video footage

You're the app recorder for Turn's Shipaton demo video (#67). The director is the session `revenuecat-97`; it owns the script and the edit. The user (AlaskanTuna, "Adam") approved this brief's scope on Sep 30.

Contents:

1.  [Situation](#situation)
1.  [Rules](#rules)
1.  [Task A: the CI capture pipeline](#task-a-the-ci-capture-pipeline)
1.  [Task B: the replay engine spike](#task-b-the-replay-engine-spike)
1.  [Scenes](#scenes)
1.  [Deliverables](#deliverables)
1.  [Reporting](#reporting)

## Situation

- **No iPhone and no Mac.** Nobody on the team can film on a device before the deadline, so every app shot comes from the iOS Simulator on GitHub Actions' macOS runners, driven by Maestro.
- **Deadline.** Devpost closes Oct 1, 2:45 PM MYT. The director needs a first pass of footage as early as possible for the rough cut, and final footage by Sep 30, 10 PM MYT.
- **The v2 screens.** The video shows v2. It isn't on `main` yet: it's PR #172 (`claude/zealous-gates-5pc5pu`, kymil4, in review). Branch from #172's head and rebase onto `main` once it merges.
- **Why a replay engine.** The Simulator build switches Listen's engine off on purpose (`apps/mobile/src/listen/engine-picker.ts:17`), and Apple's SpeechAnalyzer sample doesn't run in the Simulator (`docs/research/0023-turn-ios.md`, "Transcription devices and the Simulator"). So we replace the ears, not the microphone: a scripted `ListenEngine` feeds partner lines word by word, and everything after it (caption, relay, ranking, row, tap, speech) is real.

## Rules

- **Your own worktree:** `~/.cache/turn-work/wt/video-rec`, branch `video/replay-engine`, `bun install --frozen-lockfile`. Never touch the main clone at `~/CS/muba/RevenueCat`.
- **This branch never merges.** No PR to `main`, no merges, no releases, no issue or PR comments, no repository settings. Skip `graphify update` on it.
- **CI:** dispatch the existing workflow with your branch as both refs, so it runs your branch's copy of the workflow file:

  ```shell
  gh workflow run ios-simulator-build.yml --repo M1KUAPP/Turn \
    --ref video/replay-engine -f ref=video/replay-engine ...
  ```

  A brand-new workflow file won't dispatch unless it also exists on `main`, so add a recording mode to your branch's copy of `.github/workflows/ios-simulator-build.yml` instead. Other runs are in flight on `main` (run 36641397957); a different `ref` string keeps yours from cancelling them. Poll in the background, not in a tight loop.

  _Added after the brief:_ Turn's workflows were removed after [`7c48b24`](https://github.com/M1KUAPP/Turn/blob/679b3409323eba612a38b67ae50fd31a43a0912f/.github/workflows/ios-simulator-build.yml), so this dispatch no longer runs. Recording Turn is now manual, on a Mac, as [the recording mode](/docs/demo-video/recorder.md#the-recording-mode) says.

- **Secrets:** never print `~/.config/turn/rc-secret-key` or the proxy token.
- **House rules** in `CLAUDE.md` and `docs/agents/` apply (rtk, Bun).
- **Honesty.** Record the app as it behaves. Never fake a row, a state, or a timing; if a line gives a different row than planned, record what happened and tell the director. Keep the relay's latency uncut.
- **Ask the user**, not the director, for anything that needs a person's authorization.

## Task A: the CI capture pipeline

Goal: scene recordings from the iPhone 16 Simulator (iOS 27, as the workflow uses), downloaded locally with a manifest. Start here; it doesn't depend on Task B.

- **Screen state:** Light appearance, default text size, status bar overridden to 9:41 with full battery and signal (`xcrun simctl status_bar booted override --time "9:41" --batteryState charged --batteryLevel 100 --cellularBars 4 --wifiBars 3`).
- **Recording:** one file per scene take at native 1179 × 2556, H.264, with `xcrun simctl io booted recordVideo --codec=h264 --force <file>` (or Maestro's `startRecording`), started 2 seconds before the first action and stopped 2 seconds after the last. Setup steps (launch, place, consent when it isn't the scene) happen before recording starts.
- **Human pace:** about 1 to 1.5 seconds before each tap and 2 to 3 seconds of hold after each result, so the edit has room. Maestro has no sleep; reuse the `runScript` pattern in `apps/mobile/maestro/wait-one-minute.js` with a shorter wait.
- **Cue sheet per take:** JSON with the recording's start time and, as seconds from it, every tap (with x, y in points) and every replayed line's start. Maestro's `--debug-output` command timestamps are one source.
- **Turn's voice:** recordings have no sound. On the runner, render each phrase Turn speaks with `say` in the same Apple voice the app uses in the Simulator (find it in the app's speech code; report the voice identifier), as 48 kHz WAV, one file per phrase.
- **Artifacts:** upload recordings, cue sheets, and WAVs as one artifact per run; download them in the background (15-minute timeout) to `~/.cache/turn-work/video/footage/<run-id>/`, with a `manifest.json` listing scene, take, file, duration, commit SHA, and notes.

## Task B: the replay engine spike

**Time box: 3 hours from when you start it.** If it hasn't produced a usable S1 recording by then, stop, record S1 on the typed path, and report why.

- **Engine:** `apps/mobile/src/listen/replay-engine.ts`, implementing `ListenEngine` (`apps/mobile/src/listen/engine.ts`). `availability()` returns `'installed'`; `installAsset()` does nothing. `start()` reports `listening`. Pause, resume, stop, and `endLine()` behave like the real engine closely enough that the session and UI can't tell the difference.
- **One line:** `onVoice(true)` at the first word, `onPartial(words so far)` at each word's time, `onVoice(false)` at the last word's end, then after 500 ms of silence (LISTEN-2's window) `onLine({ text, endedAt, silenceWindowMs: 500 })`. Match the real engine's order of events; read `ListenEngine.swift` and `live-session.ts` to check it.
- **Trigger:** a deep link cues each line. The app's scheme is `turn` (`apps/mobile/app.config.ts:7`), so Maestro's `openLink: turn://replay/<id>` cues line `<id>`. If links prove awkward, fall back to times after `start()`.
- **Script:** word timings come from `~/.cache/turn-work/video/replay/lines.json`, which the director writes from the ElevenLabs clips' word timestamps. Its shape is `[{ "id": 1, "text": "How was physio?", "words": [{ "word": "How", "startMs": 0, "endMs": 180 }, ...] }]`. Until it lands, use placeholder timings of the same shape (about 280 ms a word). Prefer reading the script at runtime (for example, a file written into the app's data container on the runner) over bundling it, so new timings don't need a rebuild.
- **Switch:** only a build with `EXPO_PUBLIC_LISTEN_ENGINE=replay` (or similar) picks the replay engine, and it may run when `buildKind` is `'simulator'`; `extra.listenEngine` is hard-coded to `'auto'` at `apps/mobile/app.config.ts:47`. Every other build behaves as before.
- **Checks:** a Vitest test of one line's event timeline, `bun run --cwd apps/mobile test`, and `bun run --cwd apps/mobile typecheck`.

## Scenes

All at Clinic, in priority order. One conversation runs through S1 to S4. The lines are the director's first draft; the phrases named are the starter bank's.

1.  **S1, the main moment (replay; typed fallback).** Already listening, with the orange light on. Partner: "How was physio?" The row offers "It was hard". Tap it; Turn speaks. Three takes.
1.  **S6, the purchase.** The free-lines pill counting down, the last free line, the paywall, the Test Store purchase sheet, the purchase, and Listen continuing. Also tap a grid phrase after the lines run out, to show speaking stays free. `apps/mobile/maestro/paywall-buy.yaml` is the base. The paywall is RevenueCat's remote config, so record whatever is published; #171 may republish it later, and then we re-record.
1.  **S2, consent.** Tap Listen for the first time: "Before Listen mode starts", Allow, the partner's card ("Can my phone listen while we talk?"), "They agreed", and the light comes on. `judge.yaml` has the steps.
1.  **S3, yes or no.** Partner: "Are you in pain?" Yes, No, and Not sure appear; tap Yes. Then "Where does it hurt?"; the row should offer "My back hurts" or "It hurts to move"; tap it.
1.  **S4, nothing fits.** Partner: a line with no fitting saved reply (pick one from `packages/eval/lines.jsonl` whose label has no acceptable reply, and confirm the model returns none). The row holds, nothing speaks, and the user taps "Thank you" in the grid instead.
1.  **S8, the care montage.** The listening Home screen after S1's row, as four 3-second clips: Light, Dark, Increase Contrast, and the largest accessibility text size (`xcrun simctl ui booted appearance dark`, `increase_contrast enabled`, `content_size accessibility-extra-extra-extra-large`).
1.  **S5, speak and type.** Tap a grid phrase; then Type, "Can we stop at the pharmacy?", and it's spoken.
1.  **S7, Settings.** A slow scroll through Settings (voice, places, stats).

If a line gives a different row than planned, don't change the app: record it, and send the director the actual row so the script can follow the app.

## Deliverables

1.  A first run with S2, S6, and S8 on the typed or current build, as soon as the pipeline works.
1.  S1 on the replay engine, or on the typed path after the time box.
1.  Every scene above, re-recorded from `main` after #172 merges if the UI changed.
1.  For each: the files, cue sheets, WAVs, and manifest under `~/.cache/turn-work/video/footage/`.

## Reporting

Send `revenuecat-97` a short message at each point: a run dispatched (with its ID), footage downloaded (with its path), the spike's result (works or fails, with evidence), and any blocker as soon as you hit it. Don't wait for replies to keep going on independent work.

# Listen audio session implementation plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` when
> workers are available, or `superpowers:executing-plans`. Task 1 writes
> failing Vitest tests first; Task 2 is Swift, checked by the CI build.

**Goal:** Keep Turn from hearing itself, and speak through the loudspeaker in
Listen mode, as [the audio session](/docs/TRD.md#the-audio-session) sets out.

**Architecture:** `turn-listen`'s Swift switches the shared audio session to
`.playAndRecord` for Listen mode and back to `.playback` after it, and its
`muteForSpeech` gains the output-latency wait. The live session wraps every
tap in Listen mode: it ends the open line, mutes input, speaks, and releases
the mute when speech ends. The mute leaves the engine interface, since
`AVAudioApplication.setInputMuted` is app-wide.

**Tech stack:** Expo SDK 57, Swift, Vitest.

**Spec:** Issue #58; [Listening](/docs/PRD.md#listening) LISTEN-3,
[Voices](/docs/PRD.md#voices) VOICE-4; the
[turn-listen module](/docs/TRD.md#the-turn-listen-module) and
[the audio session](/docs/TRD.md#the-audio-session).

## Existing behavior and decisions

- **Launch already has `.playback`.** `app/src/turn-context.tsx` calls
  `expo-audio`'s `setAudioModeAsync({ playsInSilentMode: true, allowsRecording:
false })`, so speech plays with the Silent switch on. That call stays:
  `expo-audio` has no players or recorders in Turn, and re-applies its mode
  only after a media services reset, which is rare and ends Listen mode anyway.
- **Nothing sets `.playAndRecord` today.** turn-listen's engine records under
  the launch `.playback`, which has no input; only the fallback asks for its
  own category, through `iosCategory` with the same values.
- **Listen mode is the typed session's lifetime, not capture's.**
  `setListenMode(true)` runs at session start whatever the microphone option
  is, so a phrase tapped while Paused, or with a partner under 18, still plays
  from the loudspeaker. Pause, resume, and `micOff()` leave it; `end()` and
  `dispose()` set it false.
- **Options go with every category change.** One Swift helper sets the
  category, the `.default` mode, and the options each time, since they don't
  carry over: `.defaultToSpeaker` for Listen mode, no Bluetooth input option,
  and no voice processing.
- **The mute is app-wide, so it leaves the engine interface.** `endLine()` is
  the engine's and stays; `muteForSpeech()` moves to the session, which calls
  the module directly. The Expo stub goes.
- **The latency wait is native.** `outputLatency` has no TypeScript route, so
  `muteForSpeech(false)` waits it, then unmutes. A generation counter drops a
  pending unmute when a newer mute arrives, so a second tap stays muted.
- **A configuration change reinstalls the tap.** When the engine is capturing,
  the handler calls `removeCapture()`, clears `audioConverter` so it's rebuilt
  from the new input format, and calls `startCapture()`, keeping the engine.
- A tap's order is `Speech.stop()` when needed (the controller already does
  it), `endLine()`, `muteForSpeech(true)`, then speak. A second tap re-runs
  the gate, and the controller's `generation` guard drops the first
  utterance's `onDone`. End and Pause during speech release the mute.

## Task 1: The session gates speech, in TypeScript

**Files:** `modules/turn-listen/src/index.ts`, `app/src/listen/engine.ts`,
`app/src/listen/expo-engine.ts`, `app/src/listen/native-engine.ts`,
`app/src/listen/live-session.ts`, `app/src/speech/controller.ts`,
`app/src/turn-context.tsx`, `app/test/live-session.test.ts`,
`app/test/speech-controller.test.ts`, `app/test/expo-engine.test.ts`, and a
new `app/test/listen-audio-session.test.ts`.

- [ ] Write `listen-audio-session.test.ts` first, and see it fail. With a fake
      module and a fake engine: `start()` sets the mode true once, typed or
      with the microphone; `micOff()` leaves it; `end()` sets it false once.
      While capturing, `beforeSpeak()` calls `endLine()` before
      `muteForSpeech(true)`; while Paused, typed, or with no module, it calls
      neither. `afterSpeech()` calls `muteForSpeech(false)`, and `end()`
      during speech releases the mute.
- [ ] Extend `speech-controller.test.ts`: within `speak()`, the order is stop,
      gate, speak; a second tap re-runs the gate and drops the first
      utterance's `onDone`; `stop()`, `onStopped`, and a failed `speak` each
      call `afterSpeech()`.
- [ ] Add `setListenMode(active: boolean)` to the `TurnListen` interface, and
      remove `muteForSpeech` from `ListenEngine`, both adapters, and the Expo
      stub. `createLiveListenSession` takes an optional
      `module: Pick<TurnListen, 'setListenMode' | 'muteForSpeech'> | null`,
      defaulting to `null`, so the existing session tests need no new fixture.
- [ ] The session calls the mode in `start()`, `end()`, and `dispose()`, and
      exposes `beforeSpeak()` and `afterSpeech()`, as tested.
- [ ] The speech controller takes an optional gate, with
      `beforeSpeak(): Promise<void>` and `afterSpeech(): void`, no-ops by
      default. `speakText()` awaits `gate.beforeSpeak()` after its stop, and
      returns if a newer `generation` took over. `onDone`, `onStopped`, the throw path, and
      `stop()` call `gate.afterSpeech()` inside their `generation` guards.
- [ ] In `turn-context.tsx`, keep `setAudioModeAsync`, pass the module to the
      live session, and pass the session's gate to the speech controller
      through a late-bound getter, since the controller is built first.
- [ ] Run `bun run --cwd app test` and `bun run --cwd app typecheck`.

## Task 2: The Swift audio session

**Files:** `modules/turn-listen/ios/ListenEngine.swift` and
`modules/turn-listen/ios/TurnListenModule.swift`.

- [ ] Add `setListenMode(_ active: Bool)` to `ListenEngine` and an
      `AsyncFunction("setListenMode")` to the module. Both directions go
      through one helper: `.playAndRecord`, `.default`, and
      `[.defaultToSpeaker]` when active; `.playback` and `.default` when not.
- [ ] `startCapture()` applies the Listen mode category first, so a resume
      records even if another owner changed the category meanwhile.
- [ ] `muteForSpeech(_:)` holds a generation and a `Task`. Muting cancels a
      pending unmute and calls `setInputMuted(true)` at once. Unmuting waits
      `AVAudioSession.sharedInstance().outputLatency`, read then, and returns
      without unmuting if a newer mute arrived.
- [ ] `stop()` releases the mute, so a session ended during speech never
      leaves input muted for the next.
- [ ] Observe `AVAudioEngineConfigurationChange` for the engine, removed with
      the other observers. When it fires while capturing: `removeCapture()`,
      `audioConverter = nil`, then `startCapture()`; the handler never
      releases the engine, and a failed restart reports `unavailable`.

## Checks

- [ ] Vitest proves the order and the guards in Task 1, and the session's
      pause, resume, interruption, lifecycle, and caption tests still pass.
- [ ] The CI Simulator build proves the Swift compiles and the app still
      launches and speaks through its flows. The Simulator takes the typed
      path, so it can't prove the mute or the loudspeaker.
- [ ] On the video iPhone, in Listen mode: tap "It was hard"; Turn speaks it,
      and the caption never shows those words as the partner's (LISTEN-3).
- [ ] On the video iPhone, with the Silent switch on: a phrase plays from the
      bottom speaker in Listen mode, and from headphones outside it (VOICE-4).
- [ ] On the video iPhone, connect and disconnect headphones during Listen
      mode; transcription keeps working on both sides of the change.

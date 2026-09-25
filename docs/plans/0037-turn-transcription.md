# Live transcription implementation plan

> **For agentic workers:** Write failing tests before each change. Issues #49 and
> #51, `docs/PRD.md` "Listening", `docs/TRD.md` "The turn-listen module", "The
> end of a line", "When transcription isn't available", and "The audio
> session", `docs/api-notes.md`, and `docs/DESIGN.md` "The caption" and "Strings
> the PRD leaves open" are the spec. One TypeScript port faked in tests, three
> workers building in parallel against it. TypeScript is tested on Linux, the
> Swift compiles in CI, and a teammate reads the screens on the video iPhone.

**Goal:** After "They agreed", transcribe the partner live on the phone, show
the words under "They're saying" with Done, end a line on a 0.5-second
silence or on Done, rank each line once as a typed line is ranked, and offer
`expo-speech-recognition` behind the same port as the fallback the video
iPhone's check decides.

**Architecture:** `listen/engine.ts` owns the whole engine surface.
`listen/live-session.ts` composes today's `createTypedListenSession` unchanged:
a spoken line calls the typed session's `send()`, the one ranking path. Two
adapters fill the port, `turn-listen` (SpeechAnalyzer) and
`expo-speech-recognition`, picked by `listen/engine-picker.ts`. The engine is
chosen once, at Listen mode's start, by `extra.buildKind` and
`extra.listenEngine`.

**Tech stack:** Expo SDK 57, Expo Modules API, the local `turn-listen` module
(Speech framework, `en-US`), `expo-speech-recognition` 57.1.0, Vitest.

**Spec:** [Issue #49](https://github.com/RevenueCat-M1KU/RevenueCat/issues/49),
[Issue #51](https://github.com/RevenueCat-M1KU/RevenueCat/issues/51),
[Listening](/docs/PRD.md#listening),
[The turn-listen module](/docs/TRD.md#the-turn-listen-module),
[The end of a line](/docs/TRD.md#the-end-of-a-line),
[When transcription isn't available](/docs/TRD.md#when-transcription-isnt-available),
[the caption](/docs/DESIGN.md#the-caption).

## Rules

- **One port, one surface.** `app/src/listen/engine.ts` is the block below.
  It imports nothing from Expo, so every test runs on Linux. Three workers
  build against it: this file lands first as its own change, then Task 1
  (users), Task 2 (`expo-speech-recognition`), and Task 3 (`turn-listen`) go in
  parallel.
- **`typed-session.ts` is untouched.** Its `TypedListenState` and
  `createTypedListenSession(bank)` keep their names and shape; #48 builds on
  them. `live-session.ts` wraps it, so a spoken line and a typed line rank by
  one code path.
- **How Listen mode picks an engine.** `extra.listenEngine` is `'auto'` (the
  default), `'apple'`, `'expo'`, or `'none'`, added to `app/app.config.ts`
  beside today's `buildKind`. A Simulator build (`extra.buildKind ===
'simulator'`) always takes the typed path, with the LISTEN-9 note. On a
  device, `'auto'` takes `turn-listen` when its availability is `installed`,
  `supported`, or `downloading`; else `expo-speech-recognition` when it is
  available; else the typed path. `'apple'` and `'expo'` force one engine and
  fall to the typed path when it is unavailable; `'none'` is typed only. #49's
  device check sets the constant.
- **Where the API wins over the TRD** (each verified in `docs/api-notes.md`):
  Apple's missing-asset status is `supported` (the TRD's "downloadable") and
  `downloading`, not `asset: 'downloadable'`; `SpeechTranscriber.isAvailable`
  is capability only, so `en-US` is checked with `supportedLocale(equivalentTo:)`
  and `AssetInventory.status(forModules:)`; `DictationTranscriber` takes
  `.volatileResults` as well as `.frequentFinalization`, or the caption is not
  volatile like the transcriber's; `expo-speech-recognition` with
  `requiresOnDeviceRecognition: true` asks for the microphone only, so the
  TRD's speech-recognition prompt is dropped; its `isRecognitionAvailable()`
  and `supportsOnDeviceRecognition()` are default-locale checks, so `en-US` is
  confirmed with `getSupportedLocales({})` and an `error` from an on-device
  start fails closed; it never auto-rotates its single task, so a line is
  `stop()`ed, its final `result` taken, `end` awaited, and the next line
  started, with a long line capped; on iOS 18 and later it marks a result
  final at each pause, many times in one task, each holding only its new
  segment, so the engine joins a task's segments and sends the line once, at
  `end`; and `speechend` is unsupported on iOS, so
  the 0.5-second rule is Turn's own timer over `onVoice`, not an engine event.
- **The line ends (LISTEN-2, PERF-1, PERF-5).** `SILENCE_WINDOW_MS = 500` is
  exported from `live-session.ts` for #55. Neither engine reports an
  end-of-utterance event, so the session owns the window: it resets on every
  `onPartial` and on `onVoice(true)`, and ends the line when the timer expires.
  A line also ends at once on Done (`endLine()`) or when a typed line is sent.
  Each ended line is ranked exactly once, by `send()`; the session marks the
  line ranked on the snapshot it publishes, so no line is ever ranked twice.
- **The caption (LISTEN-1).** A `caption` card across the screen, 86 points
  tall: the label in `subheadline`, `ink-secondary`, the words in `title3`,
  `ink`, and one capsule button at the trailing edge. While hearing, the label
  is "They're saying"; after a line, "They said", with the note "Ranked on
  this phone" while the phone ranked it; the row holding, the note is "Still
  answering “How was physio?”" with the line's own words. Words appear as they
  are heard, with no animation, and a long line shows its last two lines, cut
  at the start with an ellipsis, with the whole line as the accessibility
  label. A new session says "Listening" in `title2` until the first words
  arrive. Out of Listen mode, the caption says "Listen mode is off.".
- **The model download (LISTEN-1).** The first time, `installAsset()` runs
  with the note "Getting Apple's English speech model" and a progress bar
  under the words, from `onAssetProgress`'s fraction, observed on the main
  actor from `AssetInventory.assetInstallationRequest(supporting:)?.progress`.
  After that, transcription needs no network.
- **Done, Clear, and the words.** The button is Done while a partner line is
  open and Clear when the row holds replies, and it never moves. A tap on the
  words opens the partner's composer. "Tap here to type what they say." is the
  typed path's prompt, as `app/src/consent/strings.ts` already has it.
- **No live transcription (LISTEN-9, #52).** When neither engine is available,
  the note is "Live transcription isn't available here. Tap here to type what
  they say.", the Listen control shows "Mic off" with End, and the microphone
  never turns on; typed partner lines still get replies. This is the
  Simulator's and the judges' path.
- **Permissions, said exactly.** Nothing prompts before "They agreed".
  `turn-listen` asks `AVAudioApplication.requestRecordPermission()` and
  nothing else: SpeechAnalyzer transcriber modules run on-device and Apple's
  speech-recognition authorization and `NSSpeechRecognitionUsageDescription`
  belong to legacy `SFSpeechRecognizer`, not to it. `expo-speech-recognition`
  with `requiresOnDeviceRecognition: true` calls
  `requestMicrophonePermissionsAsync()` and nothing else; the
  `requestPermissionsAsync()` and
  `requestSpeechRecognizerPermissionsAsync()` paths are never called, because
  they prompt for network recognition. `NSMicrophoneUsageDescription` and
  `NSSpeechRecognitionUsageDescription` are already in
  `app/app.config.ts:16-21`, and adding the config plugin with the same
  permission strings writes no prompt of its own.
- **Consent gates the microphone (CONSENT-3, CONSENT-4, CONSENT-6).** The
  engine's `start()` runs only from the consent controller's `partnerAgreed()`,
  and its `stop()` runs from `partnerDeclined()`, `notNow()`, `withdraw()`, and
  the under-18 switch going on. The under-18 switch and a withdrawal never
  leave a line in flight. The controller's `listen` port grows an
  engine-aware pair that also reports whether a microphone would be opened at
  all.
- **The fallback's own rules (#51).** It starts with `lang: 'en-US'`,
  `interimResults: true`, `continuous: true` (without it, iOS 18+ stops on the
  first final result and iOS 17 and earlier after three seconds of silence),
  `requiresOnDeviceRecognition: true`, `addsPunctuation: true`, and
  `iosCategory: { category: 'playAndRecord', categoryOptions:
['defaultToSpeaker'], mode: 'default' }`. It sets `volumeChangeEventOptions`
  (default 100 ms, scale -2 to 10, below 0 inaudible) so `onVoice` has a
  meter. `.default` is explicit because the package's own default `.measurement`
  mode lowers playback.
- **Audio and the route (#58's work, named here).** The `.playAndRecord`
  session with `.defaultToSpeaker` and no voice processing is #58, not this
  plan; the port carries `muteForSpeech` so that ticket has its hook. Do not
  adopt iOS 27's `CaptureInputSequenceProvider`: its `providerWithSession`
  creates an `AVCaptureSession` that auto-configures the app's audio session,
  which would pre-empt #58's routing policy. The caption, line ends, and Done
  do not change with the engine (#51's last criterion).
- **Privacy (PRIV-1).** Audio lives only in the module's buffers and a line
  only in the caption's memory, cleared on End, on pause, and two minutes
  after a line ends (LISTEN-8, #57's timer). Nothing is written to SQLite or
  the Keychain.

## The port: `app/src/listen/engine.ts`

```ts
export type EngineId = 'turn-listen' | 'expo-speech-recognition'

/** Mirrors AssetInventory.Status, plus 'none' for an engine that is absent. */
export type AssetStatus = 'installed' | 'supported' | 'downloading' | 'unsupported' | 'none'

export type EngineState = 'idle' | 'starting' | 'listening' | 'paused' | 'stopping' | 'unavailable'

/** One ended line. The engine stamps endedAt; the app logs against it. */
export type ListenLine = {
  text: string
  endedAt: number
  silenceWindowMs: number
}

export type ListenEngineEvents = {
  /** Words heard so far in the open line. */
  onPartial(text: string): void
  /** The open line, once, on the engine's own boundary. */
  onLine(line: ListenLine): void
  onState(state: EngineState, reason?: string): void
  /** Fraction 0..1 while an asset installs, null when there is none. */
  onAssetProgress(fraction: number | null): void
  /** True while the partner's voice is above the silence level. */
  onVoice(active: boolean): void
}

export type ListenEngine = {
  id: EngineId
  /** The session registers its handlers once; the engine calls them. */
  listen(events: ListenEngineEvents): () => void
  availability(): Promise<AssetStatus>
  installAsset(): Promise<void>
  start(options: { lang: string }): Promise<void>
  pause(): Promise<void>
  resume(): Promise<void>
  stop(): Promise<void>
  endLine(): Promise<void>
  muteForSpeech(muted: boolean): Promise<void>
}

/** From extra.listenEngine. 'auto' is the default. */
export type EngineChoice = 'auto' | 'apple' | 'expo' | 'none'

/** Null means the typed path. */
export type EnginePicker = (input: {
  buildKind: 'simulator' | 'device'
  choice: EngineChoice
  turnListen: () => ListenEngine | null
  expo: ListenEngine
}) => Promise<ListenEngine | null>
```

## Task 1: The live session and the picker

**Files:** `app/src/listen/engine.ts` (the block above, landed first),
`app/src/listen/engine-picker.ts`, `app/src/listen/live-session.ts`,
`app/src/listen/strings.ts`, `app/test/live-session.test.ts`,
`app/test/engine-picker.test.ts`. `app/src/listen/typed-session.ts` and
`app/test/typed-listen.test.ts` are not modified.

- [x] Write failing tests for the picker: a Simulator build always yields
      `null`, whatever the choice; on a device `'auto'` takes `turn-listen` at
      `installed`, `supported`, and `downloading`, falls to `expo` when
      `turn-listen` is `unsupported` or `none`, and to `null` when both are
      out; `'apple'` and `'expo'` force one engine and fall to `null`;
      `'none'` is `null`.
- [x] Write failing tests with a fake engine: the caption shows "Listening"
      until the first `onPartial`, then "They're saying" and the words as they
      arrive; a line ends on the 0.5-second timer after `onVoice(false)`,
      which `onPartial` and `onVoice(true)` reset, and at once on Done and on
      a typed send; each is ranked once, never twice; `endedAt` and the ranked
      time reach a `now()`-driven log (PERF-1); Clear empties the row; End
      clears the caption and the row.
- [x] Write failing tests for the design's words, pinned exactly:
      "Listen mode is off.", "Listening", "They're saying", "They said",
      "Still answering “How was physio?”", "Ranked on this phone",
      "Live transcription isn't available here. Tap here to type what they
      say.", "Getting Apple's English speech model", and "Tap here to type
      what they say.", shaped like `app/src/content/privacy-notice.ts`.
- [x] `live-session.ts` takes `{ typed, engine, now, log }`, re-exports the
      typed session's `start`/`end`/`clear`/`send`/`dispose`, and adds
      `caption`, `phase`, `assetProgress`, and `rankedOnce`. The engine's
      events are registered on construction and removed on `dispose`; a `null`
      engine is the typed path, with the caption's typed prompt.
- [x] `engine-picker.ts` exports the `EnginePicker` signature above, reading
      `extra.listenEngine` and `extra.buildKind` through `Constants`.
- [x] `bun run --cwd app test -- live-session.test.ts engine-picker.test.ts`
      and `bun run --cwd app typecheck`.

## Task 2: The `expo-speech-recognition` engine

**Files:** `app/package.json`, `app/app.config.ts`, `app/src/listen/expo-engine.ts`,
`app/test/expo-engine.test.ts`.

- [x] `bun add expo-speech-recognition@57.1.0` in `app/`, the TRD's pin, and
      add the plugin with `microphonePermission` and
      `speechRecognitionPermission` strings matching the ones already in
      `app/app.config.ts:16-21`, so the keys stay the same.
- [x] Write failing tests with the library faked: the engine calls
      `requestMicrophonePermissionsAsync()` and never
      `requestPermissionsAsync()` or
      `requestSpeechRecognizerPermissionsAsync()`; it starts with the
      options in the Rules, including `.default` mode; it asks
      `isRecognitionAvailable()` and `supportsOnDeviceRecognition()` and
      confirms `en-US` in `getSupportedLocales({})`; it reports `onPartial`
      from every `result` with the task's words so far, and one `onLine`
      per task, at its `end`; it
      `stop()`s at a line end, waits for `end`, then starts the next line, so
      no task runs past a minute; it reports `onAssetProgress` never; and an
      `error` from an on-device start maps to `onState` `unavailable` with a
      reason, never a throw into the session.
- [x] `expo-engine.ts` maps the library's events, `volumechange` into
      `onVoice`, and its errors onto the port. It is written against the port
      only, so Task 2 never waits on Task 3.
- [x] `bun run --cwd app test -- expo-engine.test.ts` and
      `bun run --cwd app typecheck`.

## Task 3: The `turn-listen` Swift engine

**Files:** `modules/turn-listen/ios/TurnListenModule.swift`,
`modules/turn-listen/ios/ListenEngine.swift`,
`modules/turn-listen/src/index.ts`, `app/src/listen/native-engine.ts`,
`modules/turn-listen/ios/TurnListen.podspec`.

- [x] Add the transcription half beside the existing name tagging in
      `TurnListenModule.swift`: `availability()`, `installAsset()`, `start()`,
      `pause()`, `resume()`, `stop()`, `endLine()`, `muteForSpeech(_:)`, and
      the five events with `sendEvent`, each behind `#available(iOS 26.0, *)`.
- [x] `ListenEngine.swift` holds the pipeline: an `en-US` transcriber built
      from `supportedLocale(equivalentTo:)` with `reportingOptions:
[.volatileResults]` and `attributeOptions: [.audioTimeRange]`; an
      `AVAudioEngine` input tap; each buffer converted with `AVAudioConverter`
      to `bestAvailableAudioFormat(compatibleWith:)`; an
      `AsyncStream<AnalyzerInput>` into `start(inputSequence:)`; and
      `prepareToAnalyze(in:)` before the tap, which starts after the consumer.
- [x] Availability is `isAvailable` (capability) plus
      `AssetInventory.status(forModules:)` for the `en-US` transcriber, mapped
      to the port's `AssetStatus`. `installAsset()` takes
      `assetInstallationRequest(supporting:)`, publishes
      `progress.fractionCompleted` on the main actor, and awaits
      `downloadAndInstall()`.
- [x] Results are read concurrently with capture, volatile text kept separate
      so a final replaces it. Text settles when `resultsFinalizationTime`
      passes a result's end, not only on `isFinal`.
- [x] The engine takes `SpeechTranscriber` when it is available and falls to
      `DictationTranscriber` with `[.volatileResults, .frequentFinalization]`
      in the same analyzer, checking that module's own locale and asset
      status, chosen before the line is fed. The module's `#if DEBUG` switch
      forces the second, so the video iPhone's check can force it (#49).
- [x] The silence rule: the tap's audio level drives `onVoice`, and after
      `SILENCE_WINDOW_MS` below level with no new words, the engine calls
      `finalize(through: nil)` and reports the settled text once as one
      `onLine`, stamped with the end of the line. `endLine()` does the same at
      once. A nil time code finalizes through the last audio the analyzer has
      consumed, not the newest captured buffer, so pass a known time code when
      queue lag could split a line. End of session: remove the tap, stop the
      engine, finish the continuation, `finalizeAndFinishThroughEndOfInput()`,
      then await the consumer.
- [x] `modules/turn-listen/src/index.ts` grows the port's functions and a
      listener registration beside today's `findNames` and `setGazetteer`,
      keeping `requireOptionalNativeModule`, so the Simulator's null path
      holds and `turnListen` stays nullable.
- [x] `native-engine.ts` wraps it into the port, or returns `null` when the
      module is absent, so `app/src/turn-context.tsx` keeps its name tagging.
- [ ] Confirm the podspec's deployment target and that the module's Swift
      compiles in CI; the Swift is never compiled on Linux.

## Task 4: The screens

**Files:** `app/src/screens/HomeScreen.tsx`, `app/src/turn-context.tsx`,
`app/src/consent/controller.ts`, `app/test/consent.test.ts`.

- [ ] `turn-context.tsx` builds the engine by the picker once, wraps it in the
      live session, passes both to the consent controller, and disposes both
      on unmount.
- [ ] The Listen control, inline in `HomeScreen.tsx` where it lives today,
      gains one state beside "Listen" and "Mic off": Listening, the
      `listening` capsule, orange, `mic.fill` and "Listening". The free-line
      count is #53's and Pause is #57's, so neither is added here and no new
      control component is extracted.
- [ ] The caption renders the snapshot exactly as the design sets it: the
      label, the words, Done or Clear, the progress bar under the words while
      the model downloads, the note for each degraded and unavailable state,
      and a tap on the words opening the partner's composer.
- [ ] The consent controller's `listen` port becomes engine-aware: `start()`
      reaches the engine only from `partnerAgreed()`, `end()` from
      `partnerDeclined()`, `notNow()`, `withdraw()`, and `setUnder18(true)`,
      and `blocked()` answers true when no engine is available. Add failing
      tests first: the microphone never starts before "They agreed", stops at
      once on Withdraw and on End, and never starts while the under-18 switch
      is on, with the typed path asserting no prompt.
- [ ] `bun run --cwd app test` and `bun run --cwd app typecheck`, then
      `bun run lint`.

## Task 5: Handoff

- [ ] `bun run test`, `bun run typecheck`, and `bun run lint` at the root, and
      the Swift module compiles in CI (PRIV-1, LISTEN-1, LISTEN-2).
- [ ] `expo export:embed` for the iOS bundle, and the Simulator build still
      shows the LISTEN-9 note with the typed path (COMPAT-2, #52).
- [ ] Maestro flows for the two paths: one that turns Listen mode on, agrees,
      and reads the caption, and one that ends a line with Done; both typed,
      so they run in CI, with the spoken steps marked for a device.
- [ ] A teammate on the video iPhone: with the model installed, in Airplane
      Mode, the caption follows a partner's speech (LISTEN-1).
- [ ] A teammate: the first run downloads Apple's English model with the
      progress bar in the caption (LISTEN-1).
- [ ] A teammate: two sentences with a pause make two ranked lines, and Done
      ends a line at once (LISTEN-2).
- [ ] A teammate: "They said no" never shows the microphone indicator
      (CONSENT-4); Withdraw during Listen mode takes the indicator out at once
      (CONSENT-3); the under-18 switch keeps the microphone off (CONSENT-6).
      No system permission dialog appears before "They agreed" on either
      engine.
- [ ] A teammate: with SpeechTranscriber forced off in a debug build,
      DictationTranscriber takes over in the same analyzer, and with both
      forced off, the fallback or the typed path holds (LISTEN-9).
- [ ] A teammate: after a session, the app's container holds no audio and no
      transcript (PRIV-1).
- [ ] A teammate: each line's stages are logged on one clock against the
      module's stamp, and the teammate records here which engine works on the
      video iPhone, or that neither does — the verdict that sets
      `extra.listenEngine` for #51.
- [ ] Record in #51 which criteria of #52, #55, #57, and #58 change with the
      engine, and close #51 as not planned if an Apple engine works.

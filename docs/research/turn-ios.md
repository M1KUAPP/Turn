# Turn's iPhone build research notes

What Turn's iPhone build needs from Apple's frameworks, Expo, and a few
libraries, as input to the rewrite of the product, PRD, and TRD documents for
Turn, the AAC app that the [idea](/docs/IDEA.md) describes. Every source below
was read on September 22, 2026, so versions and limits are as of that date,
and judgment starts with "Synthesis:". What the [technology notes][tech-notes]
and the [evidence notes][ev-devices] already hold is linked, not repeated.

Contents:

1.  [Findings for the product, PRD, and TRD](#findings-for-the-product-prd-and-trd)
1.  [Live transcription with SpeechTranscriber](#live-transcription-with-speechtranscriber)
1.  [Listening and speaking at once](#listening-and-speaking-at-once)
1.  [Personal Voice](#personal-voice)
1.  [On-device text tools](#on-device-text-tools)
1.  [Two local Swift modules in Expo](#two-local-swift-modules-in-expo)
1.  [Libraries on September 22, 2026](#libraries-on-september-22-2026)
1.  [Timing a conversation depends on](#timing-a-conversation-depends-on)
1.  [Conflicts between sources](#conflicts-between-sources)
1.  [Gaps](#gaps)

[tech-notes]: /docs/research/next-gen-tech.md

## Findings for the product, PRD, and TRD

Synthesis: each line condenses the section it links to, where the sources
are.

- **Transcription is a small Swift pipeline.** No maintained Expo package
  streams `SpeechTranscriber`, so the module taps `AVAudioEngine`, converts
  each buffer to the analyzer's format, and feeds an `AnalyzerInput` stream.
  iOS 27 adds helpers for that and deprecates the old tap. See
  [From the microphone to the analyzer](#from-the-microphone-to-the-analyzer).
- **Turn must decide when the partner has finished.** Apple offers no
  end-of-utterance event, and `SpeechDetector` reports only errors, so Turn
  needs its own silence rule plus `finalize(through:)`, tuned on a phone. See
  [Ending the partner's line](#ending-the-partners-line).
- **One download, then offline.** The English model comes from Apple's
  servers once, is shared with other apps, and adds nothing to the app's
  size; Apple gives no download size. See
  [Model assets and locales](#model-assets-and-locales).
- **The microphone prompt is the only one Apple's samples ask for.** Both
  `SpeechAnalyzer` samples declare only the microphone key; the speech
  recognition key belongs to the fallback. See
  [Permissions for transcription](#permissions-for-transcription).
- **Speech is silent in silent mode unless Turn sets the session.**
  `expo-speech` "won't produce sound if the device is in silent mode", while
  `.playback` and `.playAndRecord` keep playing "with the Silent switch set
  to silent", so Turn should set its audio session at launch, not only in
  Listen mode. See
  [Audio session category, mode, and options](#audio-session-category-mode-and-options).
- **Turn's own voice stays out of the transcript by muting, not by echo
  cancellation.** Voice processing ducks audio it doesn't render, third-party
  apps can't capture a Personal Voice's audio, and muting input from the tap
  until `onDone` is documented and simple. See
  [Keeping Turn's own speech out of the transcript](#keeping-turns-own-speech-out-of-the-transcript).
- **iOS 27 moves the interruption API.** The iOS 27 SDK deprecates the
  interruption notification in favor of two new ones, and a phone call blocks
  a `.playAndRecord` session outright. See
  [Interruptions and route changes](#interruptions-and-route-changes).
- **Personal Voice needs one call and one identifier.** Apple lists no
  Info.plist key for it, the user must allow apps in Settings, and
  `expo-speech` can take the voice's identifier but can't tell which voice it
  is, so the Swift module finds it. See [Personal Voice](#personal-voice).
- **Names need a gazetteer, not just a tagger.** `NLTagger` finds names in
  cased text, but this note's test on a Mac found none once the text was
  lowercased, until a gazetteer of the user's own names was added. See
  [Swapping names for tags with NLTagger](#swapping-names-for-tags-with-nltagger).
- **Apple's sentence embeddings are small and fast enough to scan.** They are
  512-dimensional, have no index, and took milliseconds on a Mac; contextual
  embeddings are meant for training. See
  [Sentence embeddings for a shortlist](#sentence-embeddings-for-a-shortlist).
- **Local modules autolink, and Swift `async` works in `AsyncFunction`.** The
  template targets iOS 16.4, so iOS 26 calls need `#available`, and Expo's
  docs say nothing on it. See
  [Two local Swift modules in Expo](#two-local-swift-modules-in-expo).
- **The libraries are MIT and current, with gaps.** `expo-speech` 57.0.3,
  `expo-speech-recognition` 57.1.0 without `SpeechAnalyzer`, `expo-sqlite`
  57.0.3 with FTS5 on by default, and MiniSearch 7.2.0 with BM25+. See
  [Libraries on September 22, 2026](#libraries-on-september-22-2026).
- **No latency numbers exist for the loop's two ends.** Apple publishes none
  for final transcripts or speech start, and React Native says nothing about
  keeping VoiceOver focus through a re-render, so the team measures. See
  [Timing a conversation depends on](#timing-a-conversation-depends-on).

## Live transcription with SpeechTranscriber

Apple's Speech documentation, its two sample projects, and WWDC25 session 277
own these facts. The [technology notes][tech-speech] already cover the
versions, the on-device promise, languages, and concurrency; this section adds
what the transcription module needs.

[tech-speech]: /docs/research/next-gen-tech.md#speechanalyzer-and-speechtranscriber

### From the microphone to the analyzer

- **The steps.** Apple lists them: "Create and configure the necessary
  modules", "Ensure the relevant assets are installed or already present",
  "Create an input sequence you can use to provide the spoken audio", "Create
  and configure the analyzer with the modules and input sequence", "Supply
  audio", "Start analysis", "Act on results", and "Finish analysis when
  desired." ([SpeechAnalyzer][sa])
- **No conversion inside.** "The audio data must have an audio format that is
  supported by the analyzer’s modules; the analyzer does not perform audio
  conversion." ([AnalyzerInput][analyzer-input])
  `bestAvailableAudioFormat(compatibleWith:)` returns `nil` "if the specified
  modules require you to install additional assets", and "the analyzer does
  not transparently upsample, downsample, or convert audio input."
  ([format][sa-format])
- **The iOS 26 path.** Apple's WWDC25 sample, with an iOS 26.0 deployment
  target, sets the session to `.playAndRecord` with the `.spokenAudio` mode,
  taps the `AVAudioEngine` input node with a 4,096-frame buffer in the node's
  own format, converts each buffer with an `AVAudioConverter`, and yields it
  into an `AsyncStream<AnalyzerInput>` that `start(inputSequence:)` consumes.
  Its converter sets `primeMethod = .none`, commented "Sacrifice quality of
  first samples in order to avoid any timestamp drift from source"
  ([iOS 26 sample][sample-26]). Apple explains the risk: "Some conversion
  algorithms can use a “priming” method that may shift some audio to a later
  converted buffer" ([start time][input-start-time]).
- **The tap changes in iOS 27.** `installTap(onBus:bufferSize:format:block:)`
  is marked deprecated from iOS 27.0, and its buffer size is a request: "The
  implementation may choose another size." ([installTap][install-tap]) Its iOS
  27 successor, `installAudioTap(onBus:bufferSize:format:tapProvider:)`, passes
  read-only buffers "safe for concurrent use", and for the buffer size,
  "Supported range is \[100, 400\] ms." ([installAudioTap][install-audio-tap])
- **The iOS 27 helpers.** iOS 27 adds `CaptureInputSequenceProvider` and
  `AssetInputSequenceProvider` to "Access audio from a file, asset, or capture
  device, such as a microphone", and `AnalyzerInputConverter` "to convert
  `AVAudioBuffer` data into formats that `AnalyzerInput` supports"
  ([Speech updates][speech-updates]). The converter's `convert(_:at:)` "does
  not necessarily convert the entire audio buffer", and `flush()` converts
  what it held back ([convert][converter-convert]).
- **The provider takes over the session.** Apple's iOS 27 sample uses the
  provider, which "configures the session automatically, eliminating the need
  to install audio engine taps" ([iOS 27 sample][sample-27]). Its
  `providerWithSession` method "automatically configures your application’s
  default `AVAudioSession`. To avoid this behavior, call
  `provider(from:in:compatibleWith:priority:)` instead."
  ([provider][provider-session])
- **Skipping audio is allowed.** "To skip past part of an audio stream, omit
  the buffers you want to skip from the input sequence. You can resume with a
  later buffer." A later buffer may need its time-code passed as
  `bufferStartTime` "to account for skipped audio" ([SpeechAnalyzer][sa]).
- **Warming up.** `prepareToAnalyze(in:)` does the lazy setup "immediately to
  reduce or eliminate delays in analyzing the first audio input"
  ([prepare][sa-prepare]); the `.lingering` retention "Keeps the models in
  memory for a time so that they can be reused by another compatible analyzer
  session" ([retention][sa-retention]).
- **Reusing the samples.** Both samples' `LICENSE.txt` files grant the right
  "to use, copy, modify, merge, publish, distribute" on the condition that
  "The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software."
  ([iOS 26 sample][sample-26]; [iOS 27 sample][sample-27])

The iOS 26 sample's setup, cut to the calls that matter:

```swift
let transcriber = SpeechTranscriber(locale: Locale.current,
                                    transcriptionOptions: [],
                                    reportingOptions: [.volatileResults],
                                    attributeOptions: [.audioTimeRange])
analyzer = SpeechAnalyzer(modules: [transcriber])
analyzerFormat = await SpeechAnalyzer.bestAvailableAudioFormat(compatibleWith: [transcriber])
(inputSequence, inputBuilder) = AsyncStream<AnalyzerInput>.makeStream()
try await analyzer?.start(inputSequence: inputSequence)
// For each tapped buffer:
let converted = try self.converter.convertBuffer(buffer, to: analyzerFormat)
inputBuilder.yield(AnalyzerInput(buffer: converted))
```

- Synthesis: keep `AVAudioEngine` as the source, as the iOS 26 sample does,
  rather than a provider that reconfigures the session: Turn shares one audio
  session with its own speech, and dropping buffers while Turn speaks is the
  documented way to skip audio. On iOS 27, `AnalyzerInputConverter` can
  replace the sample's hand-written converter, and the deprecated tap still
  builds.

[analyzer-input]: https://developer.apple.com/documentation/speech/analyzerinput
[sa-format]: https://developer.apple.com/documentation/speech/speechanalyzer/bestavailableaudioformat(compatiblewith:)
[input-start-time]: https://developer.apple.com/documentation/speech/analyzerinput/init(buffer:bufferstarttime:)
[install-tap]: https://developer.apple.com/documentation/avfaudio/avaudionode/installtap(onbus:buffersize:format:block:)
[speech-updates]: https://developer.apple.com/documentation/updates/speech
[converter-convert]: https://developer.apple.com/documentation/speech/analyzerinputconverter/convert(_:at:)
[provider-session]: https://developer.apple.com/documentation/speech/captureinputsequenceprovider/providerwithsession(from:compatiblewith:priority:)
[sa-retention]: https://developer.apple.com/documentation/speech/speechanalyzer/options/modelretention-swift.enum

### Presets, options, and results

`SpeechTranscriber` takes a preset or its three option sets
([presets][st-preset]):

| Preset                                     | Volatile | Fast | Alternatives | Time ranges |
| ------------------------------------------ | -------- | ---- | ------------ | ----------- |
| `transcription`                            | No       | No   | No           | No          |
| `transcriptionWithAlternatives`            | No       | No   | Yes          | No          |
| `timeIndexedTranscriptionWithAlternatives` | No       | No   | Yes          | Yes         |
| `progressiveTranscription`                 | Yes      | Yes  | No           | No          |
| `timeIndexedProgressiveTranscription`      | Yes      | Yes  | No           | Yes         |

- **Volatile results.** The option "Provides tentative results for an audio
  range in addition to the finalized result" ([volatile][st-volatile]).
  WWDC25: "They’re delivered almost as soon as they’re spoken but they are
  less accurate guesses", and an app can "show better iterations of that
  result over the next few seconds." ([session 277][wwdc25-277])
- **Fast results.** The option "Biases the transcriber towards
  responsiveness, yielding faster but also less accurate results", since it
  "reduces result latency by using a smaller “context window”"
  ([fast][st-fast]).
- **Other options.** `etiquetteReplacements` means "a phrase recognized as an
  expletive would be transcribed with asterisks" ([etiquette][st-etiquette]);
  `transcriptionConfidence` adds "A confidence level (0–1)" to the text
  ([confidence][st-confidence]).
- **What a result is.** "A phrase or passage of transcribed speech. The
  phrases are sent in order." With volatile results, "each phrase is sent one
  or more times as the interpretation gets better and better until it is
  finalized." ([result][st-result])
- **Final or not.** For `isFinal`: "If `true`, then this result is final.
  There will be no later result over its range." If `false`, "there is no
  guarantee that this result will be reissued with this property set to
  `true`." ([isFinal][st-isfinal]) A module "is not required to provide new,
  final results for audio ranges that it finalizes through if the
  previously-volatile result was unchanged by finalization"; once
  `resultsFinalizationTime >= range.end`, that result and "all
  previously-provided results" before that time are final
  ([finalization time][st-final-time]).
- **Empty text.** "An empty string indicates that the audio contains no
  recognizable speech and, for results in the volatile range, that previous
  results for this range are revoked." ([text][st-text])
- **Two buffers of text.** Apple's sample keeps a volatile and a finalized
  transcript and clears the volatile one on each final result: "If we don’t
  clear out our volatile results, we could end up with duplicates."
  ([session 277][wwdc25-277])
- Synthesis: start with the sample's options, volatile results and time
  ranges, and treat text as settled once `resultsFinalizationTime` passes its
  end, not only when a result arrives with `isFinal`. Try `fastResults` in the
  timing test before turning it on.

[st-preset]: https://developer.apple.com/documentation/speech/speechtranscriber/preset
[st-volatile]: https://developer.apple.com/documentation/speech/speechtranscriber/reportingoption/volatileresults
[st-etiquette]: https://developer.apple.com/documentation/speech/speechtranscriber/transcriptionoption/etiquettereplacements
[st-confidence]: https://developer.apple.com/documentation/foundation/attributescopes/speechattributes/confidenceattribute
[st-result]: https://developer.apple.com/documentation/speech/speechtranscriber/result
[st-isfinal]: https://developer.apple.com/documentation/speech/speechmoduleresult/isfinal
[st-final-time]: https://developer.apple.com/documentation/speech/speechmoduleresult/resultsfinalizationtime
[st-text]: https://developer.apple.com/documentation/speech/speechtranscriber/result/text

### Model assets and locales

- **Where the model comes from.** Assets "are machine-learning models
  downloaded from Apple’s servers and managed by the system." "Once assets are
  downloaded, they persist between app launches and are shared between apps.
  The system may unsubscribe your app from assets that haven’t been used in a
  while." ([AssetInventory][asset-inventory])
- **When a download is needed.** "Note that the download may finish
  immediately; the assets may have already been downloaded if the assets were
  preinstalled on the system, another app already downloaded them, or a
  previous module configuration used the same assets."
  ([AssetInventory][asset-inventory]) WWDC25: "Remember that transcription is
  entirely on device but the models need to be fetched."
  ([session 277][wwdc25-277])
- **The request.** `assetInstallationRequest(supporting:)` returns `nil` "If
  the current status is `.installed`", reserves locales automatically, and
  throws if that "would exceed `maximumReservedLocales`"
  ([request][asset-request]). `downloadAndInstall()` retries on its own: "If
  the system is unable to immediately download assets because of a
  connectivity issue or other error, the system will automatically attempt to
  download the assets later." ([download][asset-download]) The request
  reports progress, which WWDC25 suggests showing "to let your user know
  what’s happening" ([session 277][wwdc25-277]).
- **Status.** `status(forModules:)` reports `unsupported`, `downloading`,
  `supported`, or `installed` ([status][asset-status]).
- **Reservations.** The number of locales an app may reserve "may vary
  between devices according to storage space." ([maximum][asset-max])
- **Size.** "The model is retained in system storage and does not increase
  the download or storage size of your application, nor does it increase the
  run-time memory size." ([session 277][wwdc25-277]) No page gives the
  asset's size in megabytes.
- **Locales.** `supportedLocales` includes "locales that may not be installed
  but are downloadable", and "This array is empty if the device does not
  support the transcriber" ([supported][st-supported]); `installedLocales`
  counts "only locales that are installed on the device"
  ([installed][st-installed]). `supportedLocale(equivalentTo:)` may return a
  locale with another region: "This may result in an unexpected transcription,
  such as between “color” and “colour”." ([equivalent][st-equivalent])
- Synthesis: fetch the `en-US` asset when the user first turns on Listen
  mode, over a network and with a progress bar, then transcribe offline. Jev is
  English-first, so pin `en-US` instead of trusting `Locale.current`.

[asset-request]: https://developer.apple.com/documentation/speech/assetinventory/assetinstallationrequest(supporting:)
[asset-download]: https://developer.apple.com/documentation/speech/assetinstallationrequest/downloadandinstall()
[asset-status]: https://developer.apple.com/documentation/speech/assetinventory/status(formodules:)
[asset-max]: https://developer.apple.com/documentation/speech/assetinventory/maximumreservedlocales
[st-supported]: https://developer.apple.com/documentation/speech/speechtranscriber/supportedlocales
[st-installed]: https://developer.apple.com/documentation/speech/speechtranscriber/installedlocales
[st-equivalent]: https://developer.apple.com/documentation/speech/speechtranscriber/supportedlocale(equivalentto:)

### Ending the partner's line

- **No end-of-utterance event.** "Modules deliver results periodically, but
  you can manually synchronize their processing and delivery to outside cues.
  To deliver a result for a particular time-code, call `finalize(through:)`."
  ([SpeechAnalyzer][sa])
- **Forcing a final result.** With `nil`, `finalize(through:)` "finalizes up
  to and including the last audio the analyzer has consumed", and on return
  "Modules will have published the finalized results to their stream"
  ([finalize][sa-finalize]).
- **What Apple's samples do.** Both end a transcript on a tap, not on
  silence. The iOS 27 sample calls `finalize(through: nil)` when the user
  pauses, commented "If we paused the capture session, finalize the transcript
  with the latest audio" ([iOS 27 sample][sample-27]); WWDC25 says to "call
  finalize on your analyzer stream. This will ensure that any volatile results
  get finalized." ([session 277][wwdc25-277])
- **The volatile range.** A handler reports `changedStart`, which "indicates
  that prior results have been finalized", though "the better tool for that
  job is the `resultsFinalizationTime` property"
  ([handler][sa-volatile-handler]).
- **SpeechDetector doesn't report silence.** It "performs a voice activity
  detection (VAD) analysis" to "gate transcription by the presence of voices,
  saving power", and "only functions in conjunction with a
  `SpeechTranscriber` or `DictationTranscriber` module"
  ([detector][detector]). Its results "currently only support error handling
  from the VAD model", and the sequence "may throw an error, but will
  otherwise remain empty" ([detector results][detector-results]). If the model
  "drops audio that does contain speech", accuracy may suffer
  ([detector][detector]).
- **Catching up.** `cancelAnalysis(before:)` can "force “catch-up” if the
  analyzer is taking too long" ([cancel][sa-cancel]).
- Synthesis: Turn needs its own rule for when a line ends: a silence window
  measured from the tapped audio's level, or no new volatile text for a set
  time, then `finalize(through: nil)`, with a tap on the listening light as a
  manual end. No Apple page gives a window length, so the team measures one.

[sa-volatile-handler]: https://developer.apple.com/documentation/speech/speechanalyzer/setvolatilerangechangedhandler(_:)
[detector]: https://developer.apple.com/documentation/speech/speechdetector
[detector-results]: https://developer.apple.com/documentation/speech/speechdetector/results
[sa-cancel]: https://developer.apple.com/documentation/speech/speechanalyzer/cancelanalysis(before:)

### Permissions for transcription

- **Microphone.** Both Apple samples declare only
  `NSMicrophoneUsageDescription` and call only
  `AVCaptureDevice.requestAccess(for: .audio)` ([iOS 26 sample][sample-26];
  [iOS 27 sample][sample-27]). The key "is required if your app uses APIs
  that access the device’s microphone" ([microphone key][plist-mic]).
- **Speech recognition.** Its key "is required if your app uses APIs that
  send user data to Apple’s speech recognition servers" ([speech
  key][plist-speech]), and Apple's permission article says its process "only
  applies to speech recognition using `SFSpeechRecognizer`. `SpeechAnalyzer`
  transcriber modules don’t send audio data of the user’s voice to Apple’s
  servers." The same article warns that without the key "your app will crash
  when it attempts to request authorization or use the APIs of the Speech
  framework" ([permission][speech-permission]).
- Synthesis: `SpeechTranscriber` needs only the microphone prompt, by Apple's
  samples. Declare both keys anyway, since the `expo-speech-recognition`
  fallback uses `SFSpeechRecognizer`, and ask for speech recognition only if
  the fallback runs.

[plist-mic]: https://developer.apple.com/documentation/bundleresources/information-property-list/nsmicrophoneusagedescription

### Transcription devices and the Simulator

- **Hardware.** `isAvailable` tells "whether this module is available given
  the device’s hardware and capabilities"; if not, "consider disabling the
  feature or using `DictationTranscriber` instead." ([SpeechTranscriber][st])
  WWDC25: "available for all platforms but watchOS with certain hardware
  requirements." ([session 277][wwdc25-277]) No Apple page lists the devices.
- **The dictation fallback.** `DictationTranscriber` "supports the same
  languages, speech-to-text model, and devices as iOS 10’s on-device
  SFSpeechRecognizer", and users won't have to "turn on Siri or keyboard
  dictation" ([session 277][wwdc25-277]). It runs in the same analyzer, with
  a `frequentFinalization` option "resulting in more frequent but also less
  accurate finalized results" and an `atypicalSpeech` hint
  ([DictationTranscriber][dictation]; [finalization][dictation-frequent]).
- **Custom words.** Apple documents contextual strings, such as names, for
  `DictationTranscriber`: "With the `DictationTranscriber` module, you can use
  this property to specify short custom phrases", up to "no more than 100"
  ([contextual strings][analysis-context]). The `SpeechTranscriber` pages
  don't mention them.
- **Simulator.** "The sample app doesn’t run in the iOS Simulator, so you
  need to run it on a physical device with iOS or iPadOS 27 or later."
  ([iOS 27 sample][sample-27]) The [technology notes][tech-conflicts] record
  the conflicting reports on Simulator audio.
- **Release notes.** The iOS 26 notes, their point releases, and the iOS 27
  notes through 27.2 beta 2 list no Speech framework issues
  ([iOS 27 notes][ios27-notes]).
- Synthesis: check `SpeechTranscriber.isAvailable` at launch and fall back to
  `DictationTranscriber` in the same module before `expo-speech-recognition`;
  test on the phones that will film the video.

[st]: https://developer.apple.com/documentation/speech/speechtranscriber
[dictation]: https://developer.apple.com/documentation/speech/dictationtranscriber
[dictation-frequent]: https://developer.apple.com/documentation/speech/dictationtranscriber/reportingoption/frequentfinalization
[tech-conflicts]: /docs/research/next-gen-tech.md#conflicts-between-sources
[ios27-notes]: https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-27-release-notes

## Listening and speaking at once

Apple's AVFAudio documentation, WWDC sessions, and samples own these facts.
Where a web page is empty, the AVFAudio headers in Apple's macOS 27.0 SDK,
which carry each symbol's iOS availability, fill in; they are cited by file
name.

### Audio session category, mode, and options

- **The category.** `.playAndRecord` "is appropriate for simultaneous
  recording and playback", and "Your audio continues with the Silent switch
  set to silent and with the screen locked." It is nonmixable by default, and
  "The user must grant permission for audio recording."
  ([playAndRecord][play-and-record])
- **The default silences speech.** The default category, `soloAmbient`, is
  "silenced by screen locking and by the Silent switch"
  ([soloAmbient][solo-ambient]). Expo's docs agree for speech: "On iOS
  physical devices, `expo-speech` won't produce sound if the device is in
  silent mode." ([expo-speech][expo-speech-docs]) With `.playback`, "your app
  audio continues with the Silent switch set to silent or when the screen
  locks" ([playback][playback]).
- **The speaker.** `.defaultToSpeaker` routes audio "to the speaker rather
  than the receiver, even when other accessories, such as headphones and
  wireless Bluetooth headphones, are in use", and "Route changes and
  interruptions don’t reset this override. Only changing the audio session
  category resets this option." Plugging in a headset "doesn’t cause the
  route to change to headset mic and headphones"
  ([defaultToSpeaker][default-to-speaker]). The header describes it more
  narrowly, as routing to the speaker "when no other audio route is
  connected" (`AVAudioSessionTypes.h`).
- **Bluetooth.** `.allowBluetooth` is renamed `.allowBluetoothHFP` with the
  same value; HFP "makes Bluetooth Hands-Free Profile (HFP) devices available
  for audio input" ([HFP][allow-bt-hfp]; `AVAudioSessionTypes.h`). iOS 26's
  `.bluetoothHighQualityRecording` "may increase input latency" and "is
  therefore not recommended for real-time communication usage"
  (`AVAudioSessionTypes.h`; [high quality][bt-hq]).
- **Options don't carry over.** "If an application changes its category, it
  should reassert the options, since they are not sticky across category
  changes." (`AVAudioSessionTypes.h`)
- **Modes.** `.default` works "with every audio session category"
  ([default][mode-default]). `.measurement` "disables some dynamics processing
  on input and output signals, resulting in a lower-output playback level"
  ([measurement][mode-measurement]). A chat mode without voice processing
  "doesn’t apply voice-specific processing, like echo cancellation and
  automatic gain correction, and disables dynamic processing on input and
  output, which results in a lower playback level" ([voiceChat][mode-chat]).
  `.spokenAudio` suits "podcasts or audio books" ([spokenAudio][mode-spoken]).
- **What the samples set.** The iOS 26 transcription sample uses
  `.playAndRecord` with `.spokenAudio` ([iOS 26 sample][sample-26]); Apple's
  voice-processing sample uses `.playAndRecord` with `.defaultToSpeaker`
  ([voice processing sample][vp-sample]). The iOS 27 sample's capture session
  configures the session itself, and "The audio session’s original state
  isn’t restored after capture finishes." ([capture session][capture-session])
- **What the Expo packages do.** `expo-speech` never sets the session, and
  passes `useApplicationAudioSession` to the synthesizer only when given
  ([source][es-src]). `expo-speech-recognition` sets `.playAndRecord`,
  `.measurement`, `.defaultToSpeaker`, and `.allowBluetooth` on every start
  unless `iosCategory` overrides it, and warns that "this library does modify
  the current audio session category and mode" ([source][esr-recognizer];
  [README][esr-readme]).
- Synthesis: set `.playback` at launch, so speech plays in silent mode, and
  switch to `.playAndRecord` with the `.default` mode and `.defaultToSpeaker`
  when Listen mode starts, so the partner hears Turn through the speaker;
  leave out the HFP option to keep the built-in microphone. When the fallback
  runs, pass `iosCategory` with the `default` mode, since `.measurement`
  lowers playback.

[play-and-record]: https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/playandrecord
[solo-ambient]: https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/soloambient
[playback]: https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/playback
[allow-bt-hfp]: https://developer.apple.com/documentation/avfaudio/avaudiosession/categoryoptions-swift.struct/allowbluetoothhfp
[bt-hq]: https://developer.apple.com/documentation/avfaudio/avaudiosession/categoryoptions-swift.struct/bluetoothhighqualityrecording
[mode-default]: https://developer.apple.com/documentation/avfaudio/avaudiosession/mode-swift.struct/default
[mode-measurement]: https://developer.apple.com/documentation/avfaudio/avaudiosession/mode-swift.struct/measurement
[mode-chat]: https://developer.apple.com/documentation/avfaudio/avaudiosession/mode-swift.struct/voicechat
[mode-spoken]: https://developer.apple.com/documentation/avfaudio/avaudiosession/mode-swift.struct/spokenaudio
[vp-sample]: https://developer.apple.com/documentation/avfaudio/using-voice-processing
[capture-session]: https://developer.apple.com/documentation/avfoundation/avcapturesession/automaticallyconfiguresapplicationaudiosession
[esr-recognizer]: https://github.com/jamsch/expo-speech-recognition/blob/v57.1.0/ios/ExpoSpeechRecognizer.swift

### Echo cancellation with voice processing

- **What it does.** `setVoiceProcessingEnabled(_:)` (iOS 13) makes the input
  node take "out any of the audio that is played from the device at a given
  time from the incoming audio"; it "requires both input and output nodes to
  be in the voice processing mode", and it can be switched only "when the
  engine is in a stopped state" (`AVAudioIONode.h`; [API][vp-enable]).
- **What it's for.** WWDC19: "The main use case for the mode is echo
  cancellation and voice-over IP applications." ([session 510][wwdc19-510])
  WWDC23 lists "echo cancellation, noise suppression, automatic gain control",
  and says it "grants users full control over the mic mode settings for your
  app" ([session 10235][wwdc23-10235]).
- **It ducks other sound.** WWDC23 counts every stream "other than the voice
  audio stream from your app" as other audio: "That's why we duck the volume
  level of other audio" ([session 10235][wwdc23-10235]). iOS 17's ducking
  setting defaults to "disable advanced ducking, with a ducking level set to"
  the default level ([ducking][vp-ducking]).
- **A lighter option.** `setPrefersEchoCancelledInput(_:)` (iOS 18.2) "is
  valid only when used with `playAndRecord` category and `default` mode, and
  is only available on certain 2024 or later iPhone models"; the app checks
  `isEchoCancelledInputAvailable` ([echo-cancelled input][echo-input]).
- Synthesis: an AAC voice must stay loud, and a Personal Voice's audio can't
  be captured into the engine (see the next section), so voice processing
  would likely count Turn's own speech as other audio and duck it. Leave it
  off in the first version and silence input while Turn speaks.

[vp-enable]: https://developer.apple.com/documentation/avfaudio/avaudioionode/setvoiceprocessingenabled(_:)
[vp-ducking]: https://developer.apple.com/documentation/avfaudio/avaudioinputnode/voiceprocessingotheraudioduckingconfiguration
[echo-input]: https://developer.apple.com/documentation/avfaudio/avaudiosession/setprefersechocancelledinput(_:)

### Keeping Turn's own speech out of the transcript

- **Muting input.** `AVAudioApplication.setInputMuted(_:)` (iOS 17) "mutes all
  sources of audio input in the app" ([setInputMuted][input-muted]); the
  header says the samples are "zeroed out" (`AVAudioApplication.h`).
- **Callback timing.** `didStart` comes after any `preUtteranceDelay`, "after
  the delay completes and speech begins" ([didStart][did-start]); for
  `didFinish`, "The system ignores the final utterance’s `postUtteranceDelay`
  and calls this method immediately when speech ends" ([didFinish][did-finish]);
  `didCancel` fires only for an utterance being spoken when `stopSpeaking(at:)`
  is called ([didCancel][did-cancel]). `expo-speech` maps them to `onStart`,
  `onDone`, and `onStopped` ([source][es-src]).
- **Which session speaks.** With `usesApplicationAudioSession` at its default
  of `YES`, the synthesizer uses the shared session; with `NO`, it uses "a
  separate AVAudioSession for playback", which "may have a different route from
  the app’s shared instance session" (`AVSpeechSynthesis.h`;
  [property][uses-app-session]).
- **Output lag.** "Using an AirPlay-enabled device for your audio content can
  result in a 2-second delay." ([outputLatency][output-latency])
- **Personal Voice can't be captured.** Third-party apps "can then use your
  Personal Voice to speak aloud through your device’s speaker or during
  calls, but they can’t capture speech from Personal Voice."
  ([Apple Support][pv-support])
- Synthesis: on a tap, call `finalize(through: nil)`, mute input, and speak;
  unmute on `onDone` or `onStopped` after the session's `outputLatency`. Leave
  `useApplicationAudioSession` at its default so speech follows Turn's route.

[input-muted]: https://developer.apple.com/documentation/avfaudio/avaudioapplication/setinputmuted(_:)
[did-start]: https://developer.apple.com/documentation/avfaudio/avspeechsynthesizerdelegate/speechsynthesizer(_:didstart:)
[did-finish]: https://developer.apple.com/documentation/avfaudio/avspeechsynthesizerdelegate/speechsynthesizer(_:didfinish:)
[did-cancel]: https://developer.apple.com/documentation/avfaudio/avspeechsynthesizerdelegate/speechsynthesizer(_:didcancel:)
[uses-app-session]: https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer/usesapplicationaudiosession

### Interruptions and route changes

- **Interruptions.** On `.began`, "the system interrupted your app’s audio
  session and it’s no longer active", and the notification arrives "on the
  main thread" ([notification][interruption-note]); Apple's article resumes
  only when `.ended` carries `.shouldResume` ([article][interruptions]).
- **iOS 27's replacement.** The iOS 27 SDK deprecates the interruption API
  with the message "Use AVAudioSessionDidBecomeInactiveNotification and
  AVAudioSessionResumptionRecommendationNotification instead"
  ([InterruptionType][interruption-type]; `AVAudioSession.h`). Both
  notifications are new in iOS 27 ([inactive][inactive-note];
  [resumption][resumption-note]).
- **Calls.** "If you attempt to activate a session with category `record` or
  `playAndRecord` when another app is already hosting a call, then your
  session fails with the error `AVAudioSessionErrorInsufficientPriority`."
  ([setActive][set-active])
- **Route changes.** "The system posts this notification on a secondary
  thread", with a reason such as a new or removed device
  ([notification][route-change-note]; [article][route-change]).
- **Engine resets.** On a configuration change, "the audio engine stops,
  uninitializes itself, and issues this notification", and Apple warns:
  "Don’t deallocate the engine from within the client’s notification
  handler." ([notification][engine-config])
- **The fallback's record.** `expo-speech-recognition` watches both
  notifications, and its open issues include
  [a crash on a route change][esr-139] and
  [recognition stopping when Bluetooth connects][esr-133].
- Synthesis: pause Listen mode on an interruption or a call and show it
  paused; resume only on the system's recommendation and if the user hadn't
  paused; reinstall the tap and restart the engine after a configuration
  change.

[interruptions]: https://developer.apple.com/documentation/avfaudio/handling-audio-interruptions
[inactive-note]: https://developer.apple.com/documentation/avfaudio/avaudiosession/didbecomeinactivenotification
[resumption-note]: https://developer.apple.com/documentation/avfaudio/avaudiosession/resumptionrecommendationnotification
[route-change-note]: https://developer.apple.com/documentation/avfaudio/avaudiosession/routechangenotification
[route-change]: https://developer.apple.com/documentation/avfaudio/responding-to-audio-route-changes
[engine-config]: https://developer.apple.com/documentation/foundation/nsnotification/name-swift.struct/avaudioengineconfigurationchange
[esr-139]: https://github.com/jamsch/expo-speech-recognition/issues/139
[esr-133]: https://github.com/jamsch/expo-speech-recognition/issues/133

## Personal Voice

Apple's AVFAudio documentation, WWDC23 session 10033, and Apple's support
pages own these facts. The [evidence notes][ev-devices] already hold the
languages, the AAC wording, and `expo-speech`'s missing authorization call.

### Asking for Personal Voice and finding it

- **The request.** `requestPersonalVoiceAuthorization(completionHandler:)`
  (iOS 17) has an `async` variant that returns the status
  ([request][pv-request]). The header adds: "Call this method before
  performing any other tasks associated with speech synthesis using personal
  voices." (`AVSpeechSynthesis.h`)
- **The statuses.** `authorized`, `denied`, `notDetermined`, and
  `unsupported`, which means "The device doesn’t support personal voices"
  ([statuses][pv-status-enum]). The user can "change the authorization in the
  Settings app", and "the framework denies the request if the device doesn’t
  support using personal voices." ([status][pv-status])
- **Finding the voice.** "The system only makes personal voices available
  when `personalVoiceAuthorizationStatus` is" authorized ([trait][pv-trait]);
  WWDC23: "Once authorized, Personal Voices will appear alongside System
  voices in the AVSpeechSynthesisVoice API speechVoices and will be denoted
  with a new voiceTrait called isPersonalVoice." ([session 10033][wwdc23-10033])
  A notification fires when "a new personal voice becomes available and the
  user authorized the app" ([notification][voices-changed]).
- **No Info.plist key.** Apple's list of protected resources has no Personal
  Voice key ([protected resources][protected]), and the WWDC23 code uses none.
- **A Settings switch.** To let apps ask, the user must "turn on Allow Apps to
  Request to Use" ([iPhone User Guide][pv-guide]; [Apple Support][pv-support]).
- **What it's for.** "usage of Personal Voice is sensitive and should be
  primarily used for augmentative or alternative communication apps"
  ([session 10033][wwdc23-10033]).

WWDC23's code for the lookup:

```swift
AVSpeechSynthesizer.requestPersonalVoiceAuthorization() { status in
    if status == .authorized {
        personalVoices = AVSpeechSynthesisVoice.speechVoices().filter { $0.voiceTraits.contains(.isPersonalVoice) }
    }
}
```

- Synthesis: the Personal Voice module needs two functions, one that asks
  and one that returns the Personal Voice's identifier, plus an event when
  the voice list changes. Ask during onboarding, before Turn first speaks.

[pv-request]: https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer/requestpersonalvoiceauthorization(completionhandler:)
[pv-trait]: https://developer.apple.com/documentation/avfaudio/avspeechsynthesisvoice/traits/ispersonalvoice
[wwdc23-10033]: https://developer.apple.com/videos/play/wwdc2023/10033/
[voices-changed]: https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer/availablevoicesdidchangenotification
[protected]: https://developer.apple.com/documentation/bundleresources/protected-resources

### Speaking a Personal Voice through expo-speech

- **How it picks a voice.** `speak` sets
  `utterance.voice = AVSpeechSynthesisVoice(identifier: voice)` and throws if
  that's `nil` ([source][es-src]). The initializer returns a voice "if the
  identifier is valid and the voice is available on the device; otherwise,
  `nil`" ([init][voice-init]).
- **It can't tell which voice is the Personal Voice.** `getVoices` returns
  only each voice's identifier, name, language, and a quality of `Enhanced`
  or `Default`, with no traits ([source][es-src]).
- **Errors are lost on iOS.** The TypeScript `speak()` doesn't await the
  native call, and a source comment says "iOS never uses this event at all"
  of the error event ([Speech.ts][es-ts]), so a bad identifier never reaches
  `onError`.
- Synthesis: once authorized, the Personal Voice should resolve by
  identifier, since it is then "available", but no Apple page says so outright.
  Check the identifier in Swift before passing it to `Speech.speak`, and fall
  back to a system voice if it's missing.

[voice-init]: https://developer.apple.com/documentation/avfaudio/avspeechsynthesisvoice/init(identifier:)

### Personal Voice devices and the Simulator

- **Devices.** Apple Support lists "iOS 17 or later" and "iPhone 12 or later"
  ([Apple Support][pv-support]); the iOS 27 iPhone User Guide says it "is
  available on iPhone 15 Pro models, iPhone 16 models and later"
  ([iPhone User Guide][pv-guide]). The [evidence notes][ev-devices] record
  the conflict.
- **iOS 26 changes.** On May 13, 2025, Apple announced for later that year "a
  smoother, more natural-sounding voice in less than a minute, using only 10
  recorded phrases" and "support for Spanish (Mexico)" ([newsroom][nr-2025]).
  The API hasn't changed since: `AVSpeechSynthesis.h` is identical in Apple's
  macOS 26.5 and 27.0 SDKs.
- **Terms.** A Personal Voice is "only for your own personal, non-commercial
  use" ([Apple Support][pv-support]).
- **Simulator.** No Apple page says what Personal Voice does in the
  Simulator.
- Synthesis: film on an iPhone 15 Pro or later, as the
  [idea's risks](/docs/IDEA.md#risks) plan, and treat `denied` and
  `unsupported` alike: speak in a system voice.

[nr-2025]: https://www.apple.com/newsroom/2025/05/apple-unveils-powerful-accessibility-features-coming-later-this-year/

## On-device text tools

Apple's NaturalLanguage documentation and WWDC sessions own these facts. The
[evidence notes][ev-simpler] already hold that sentence embeddings exist from
iOS 14 and measure similarity; this section adds what name swapping and an
embedding shortlist need. No NaturalLanguage symbol is newer than iOS 17, and
Apple keeps no NaturalLanguage updates page.

[ev-simpler]: /docs/research/next-gen-evidence.md#what-simpler-methods-offer

### Swapping names for tags with NLTagger

- **The scheme.** `nameType` is "A scheme that classifies tokens according to
  whether they are part of a named entity", with the tags `personalName`,
  `placeName`, and `organizationName` ([nameType][nl-nametype]).
- **The options.** Without `joinNames`, "multiple-word names will be returned
  as multiple tokens"; with it, they are "joined together and returned as a
  single token." `omitPunctuation`, `omitWhitespace`, and `omitOther` drop
  punctuation, whitespace, and "non-linguistic items, such as symbols"
  ([options][nl-options]).
- **Apple's recipe.** The article's code, cut to its core
  ([article][nl-ner-article]):

  ```swift
  let tagger = NLTagger(tagSchemes: [.nameType])
  tagger.string = text
  let options: NLTagger.Options = [.omitPunctuation, .omitWhitespace, .joinNames]
  let tags: [NLTag] = [.personalName, .placeName, .organizationName]
  tagger.enumerateTags(in: text.startIndex..<text.endIndex, unit: .word, scheme: .nameType, options: options) { tag, tokenRange in
      if let tag = tag, tags.contains(tag) {
          print("\(text[tokenRange]): \(tag.rawValue)")
      }
      return true
  }
  ```

- **Languages depend on the device.** `availableTagSchemes(for:language:)`
  reports the schemes available "on the current device", and "When a tag
  scheme is unavailable for a specific language, it may be because the
  framework hasn’t loaded the support for that language";
  `requestAssets(for:tagScheme:)` asks the framework "to load any missing
  assets" ([schemes][nl-schemes]; [assets][nl-request-assets]). No page lists
  the languages.
- **Confidence.** `tagHypotheses(at:unit:scheme:maximumCount:)` (iOS 14)
  returns each tag "with its associated probability score"
  ([hypotheses][nl-hypotheses]). WWDC20 filters a false positive with a
  threshold of "point eight" and asks developers to "calibrate it on
  representative data" ([session 10657][wwdc20-10657]).
- **Known names.** An `NLGazetteer` holds "terms and their labels, which take
  precedence over a word tagger", and can be built at run time with
  `init(dictionary:language:)` ([gazetteer][nl-gazetteer]).
- **One thread per tagger.** "An `NLTagger` isn’t safe for concurrent use,
  including its read-looking query methods" ([NLTagger][nl-tagger]).
- **Transcripts are harder.** Apple's research on Siri notes that entity
  recognition "is usually developed and tested on text from well-written
  sources", while voice input "may be noisy because of user or speech
  recognition error" ([Apple research][mlr-dexter]).
- **A test on a Mac.** On September 22, 2026, on macOS 27.0 with an Apple M5,
  this note's own test found names in cased partner lines, missed "Mercy
  Hospital" and "Main Street", found no names in fully lowercased lines, and
  found them again once a gazetteer listed them. Tagging took about 0.16 ms a
  line. It isn't an iPhone measurement.
- Synthesis: tag each final partner line with `joinNames`, add a gazetteer of
  the names the user's phrases and places already hold, and give the same
  name the same tag in the line and in the 40 candidates, so a question about
  calling Anna still matches "Please call Anna". Keep the tag-to-name map on
  the phone.

[nl-nametype]: https://developer.apple.com/documentation/naturallanguage/nltagscheme/nametype
[nl-options]: https://developer.apple.com/documentation/naturallanguage/nltagger/options
[nl-ner-article]: https://developer.apple.com/documentation/naturallanguage/identifying-people-places-and-organizations
[nl-schemes]: https://developer.apple.com/documentation/naturallanguage/nltagger/availabletagschemes(for:language:)
[nl-request-assets]: https://developer.apple.com/documentation/naturallanguage/nltagger/requestassets(for:tagscheme:completionhandler:)
[nl-hypotheses]: https://developer.apple.com/documentation/naturallanguage/nltagger/taghypotheses(at:unit:scheme:maximumcount:)
[nl-gazetteer]: https://developer.apple.com/documentation/naturallanguage/nlgazetteer
[nl-tagger]: https://developer.apple.com/documentation/naturallanguage/nltagger
[mlr-dexter]: https://machinelearning.apple.com/research/deep-encoding

### Sentence embeddings for a shortlist

- **Sentence embeddings.** `sentenceEmbedding(for:)` (iOS 14) returns "An
  `NLEmbedding` if available, otherwise `nil`" ([method][nl-sentence]), and
  `NLEmbedding` has no way to request its assets. WWDC20: "The dimension of
  this vector is 512 dimensions", for "English, Spanish, French, German,
  Italian, Portuguese and simplified Chinese", on text "similar in length to a
  single sentence" ([session 10657][wwdc20-10657]).
- **Distance.** The cosine distance's range "is `[0.0, 2.0]`, derived from the
  expression `1 -` cosine similarity" ([cosine][nl-cosine]).
- **No index.** "Sentence embeddings are dynamic. They don’t have a fixed
  vocabulary, and they can return results for arbitrary sentences.
  Nearest-neighbor search therefore doesn’t apply to sentence embeddings."
  ([article][nl-similarity]) WWDC20's code stores the vectors and scans them
  with its own cosine function ([session 10657][wwdc20-10657]).
- **Not concurrent.** "A single `NLEmbedding` instance isn’t safe for
  concurrent use" ([NLEmbedding][nl-embedding]).
- **Contextual embeddings are for training.** `NLContextualEmbedding` (iOS 17)
  feeds Create ML's `bertEmbedding`, and Apple's note says: "For semantic
  similarity tasks, consider using `NLEmbedding`." Its models are "downloaded
  as needed", per WWDC23, and it returns subword vectors that the app must
  pool ([contextual][nl-contextual]; [session 10042][wwdc23-10042]).
- **The Mac test again.** The English sentence embedding took about 2.7 ms a
  phrase, and scanning 2,000 stored vectors took 2.3 ms. For "How was
  physio?", it put "It was fine, thanks" nearest and "It was hard" fourth of
  six, an illustration of similarity rather than answering, not an evaluation.
- Synthesis: an on-device embedding arm is cheap enough to precompute for the
  whole bank and scan per line, so the evaluation can include it; keyword
  ranking stays the shortlist, as the [idea](/docs/IDEA.md#how-it-works)
  plans.

[nl-sentence]: https://developer.apple.com/documentation/naturallanguage/nlembedding/sentenceembedding(for:)
[nl-cosine]: https://developer.apple.com/documentation/naturallanguage/nldistancetype/cosine
[nl-similarity]: https://developer.apple.com/documentation/naturallanguage/finding-similarities-between-pieces-of-text
[nl-embedding]: https://developer.apple.com/documentation/naturallanguage/nlembedding
[nl-contextual]: https://developer.apple.com/documentation/naturallanguage/nlcontextualembedding
[wwdc23-10042]: https://developer.apple.com/videos/play/wwdc2023/10042/

## Two local Swift modules in Expo

Expo's docs, its `sdk-57` source, and the npm registry own these facts. The
technology notes already cover [what the Modules API is][tech-bridge],
[development builds][tech-dev-builds], and the free account's
[7-day, 3-device limits][tech-accounts].

[tech-bridge]: /docs/research/next-gen-tech.md#writing-a-swift-bridge-with-expo-modules
[tech-dev-builds]: /docs/research/next-gen-tech.md#expo-go-and-development-builds
[tech-accounts]: /docs/research/next-gen-tech.md#apple-accounts-for-a-student-team

### Scaffolding and autolinking local modules

- **Versions.** `create-expo-module` is 57.0.1 (August 14, 2026), its
  template 57.0.12 (September 15), and `expo-modules-core` 57.0.18 (September
  11), all MIT ([CLI][npm-create-module]; [template][npm-template];
  [core][npm-emc]).
- **Where they go.** "Local modules are created in the **modules** directory
  by default", and they "skip installing module dependencies and do not
  create an example app." By default they "do not generate a barrel file, so
  imports point directly to files in the module's **src** directory."
  ([create-expo-module][create-module])
- **What the template makes.** An `expo-module.config.json` listing the Swift
  module class, and a podspec with `:ios => '16.4'` and
  `s.dependency 'ExpoModulesCore'` ([template][module-template]).
- **Autolinking.** Expo "searches local modules in the directory specified in
  your autolinking configuration's `nativeModulesDir` option, which defaults
  to `./modules/`", and only packages with an **expo-module.config.json**
  count ([autolinking][autolinking]).
- **Rebuilds.** "You have to repeat the build step anytime you make a change
  to the native code", and `npx pod-install` is needed "if you add new native
  files to the module or when you modify **expo-module.config.json**"
  ([get started][modules-start]).
- **Inline modules.** They "are experimental and available in Expo SDK 56 and
  later. The API is subject to breaking changes." ([reference][inline-modules])
- Synthesis: scaffold the two modules with the `--local` flag, one for
  transcription and one for Personal Voice, and import from their **src**
  files, since no barrel file is generated.

[npm-create-module]: https://registry.npmjs.org/create-expo-module
[npm-template]: https://registry.npmjs.org/expo-module-template
[npm-emc]: https://registry.npmjs.org/expo-modules-core
[autolinking]: https://docs.expo.dev/modules/autolinking/
[inline-modules]: https://docs.expo.dev/modules/inline-modules-reference/

### The module definition in Swift

- **Functions.** `Function` runs on the JavaScript thread and "blocks further
  execution of the script until the native function returns"; an
  `AsyncFunction` "always returns a `Promise`" and runs "on a different thread
  than the JavaScript runtime runs on" by default ([Module API][module-api]).
- **Swift `async`.** The docs don't show it, but the source does:
  `AsyncFunction` takes a `@Sendable (A0, repeat each A) async throws` closure
  ([source][emc-concurrent]), added as "support for concurrent (async/await)
  functions in Swift", and the package "Adopted Swift 6"
  ([changelog][emc-changelog]).
- **Events.** `Events` "Defines event names that the module can send to
  JavaScript", and the module calls
  `sendEvent(_ eventName: String, _ body: [String: Any?] = [:])`
  ([Module API][module-api]; [Module.swift][emc-module]).
- **Listening.** `OnStartObserving` runs "when the first event listener is
  added", and `OnStopObserving` "when all event listeners for a given event
  are removed" ([Module API][module-api]). In JavaScript, "Modules are
  extending the built-in `EventEmitter` class", with `addListener`,
  `useEvent`, or `useEventListener` ([Module API][module-api]).
- **Lifecycle.** `OnCreate` replaces the class initializer and `OnDestroy`
  the destructor ([Module API][module-api]).

The template's TypeScript side:

```ts
import { NativeModule, requireNativeModule } from 'expo'
declare class MyModule extends NativeModule<MyModuleEvents> {
  setValueAsync(value: string): Promise<void>
}
export default requireNativeModule<MyModule>('MyModule')
```

- Synthesis: the transcription module can expose `start` and `stop` as
  `AsyncFunction`s with `async` bodies, send volatile text, final lines, and
  state as events, and start the engine only while JavaScript listens.

[emc-concurrent]: https://github.com/expo/expo/blob/sdk-57/packages/expo-modules-core/ios/Api/Factories/ConcurrentFunctionFactories.swift
[emc-changelog]: https://github.com/expo/expo/blob/sdk-57/packages/expo-modules-core/CHANGELOG.md
[emc-module]: https://github.com/expo/expo/blob/sdk-57/packages/expo-modules-core/ios/Core/Modules/Module.swift

### iOS 26 APIs on SDK 57's minimum iOS

- **The floor.** SDK 57 supports iOS "16.4+" ([RevenueCat and Expo
  notes][rc-min-ios]), and the module template's podspec says the same
  ([template][module-template]).
- **No Expo page on `#available`.** Expo's module docs never mention it;
  Expo's own glass module on `sdk-57` shows the pattern
  ([GlassEffectModule.swift][glass-module]):

  ```swift
  #if compiler(>=6.2)  // Xcode 26
  if #available(iOS 26.0, tvOS 26.0, macOS 26.0, *) {
  ```

- **Raising the floor instead.** The app config's `ios.deploymentTarget`
  "Sets the iOS deployment target (minimum iOS version)", as `"18.6"` or "just
  a major version (e.g., `"26"`)" ([app config][app-config]); the old
  build-properties setting is "Deprecated: use built-in ios.deploymentTarget
  property instead (SDK 56 and greater)" ([build properties][build-props]).
- Synthesis: wrap the `SpeechAnalyzer` code in `#available(iOS 26.0, *)` and
  the Personal Voice calls in `#available(iOS 17.0, *)`, and report an
  unavailable state to JavaScript on older systems. Raising the app's target
  doesn't edit the module's podspec, which still says 16.4, so keep the checks
  either way.

[rc-min-ios]: /docs/research/revenuecat-expo.md#expo-sdk-react-native-and-minimum-ios
[glass-module]: https://github.com/expo/expo/blob/sdk-57/packages/expo-glass-effect/ios/GlassEffectModule.swift
[build-props]: https://docs.expo.dev/versions/v57.0.0/sdk/build-properties/

### Info.plist keys and config plugins

- **The simple way.** "To set permission messages, use the `ios.infoPlist`
  key", and "Changes to the **Info.plist** cannot be updated over-the-air"
  ([permissions][permissions]). `ios.infoPlist` is "Applied prior to all other
  Expo-specific configuration. No other validation is performed"
  ([app config][app-config]).
- **A plugin, if needed.** A config plugin can set keys with `withInfoPlist`
  from `expo/config-plugins` ([plugins][config-plugins]).
- **The fallback's plugin.** `expo-speech-recognition`'s plugin always writes
  `NSSpeechRecognitionUsageDescription` and `NSMicrophoneUsageDescription`,
  taking the plugin's props first, then an existing `ios.infoPlist` value,
  then "Allow $(PRODUCT_NAME) to use speech recognition." or "Allow
  $(PRODUCT_NAME) to use the microphone." ([plugin][esr-plugin])
- Synthesis: put both usage strings in `ios.infoPlist`, worded for Turn's
  partner and user; no plugin of Turn's own is needed.

[permissions]: https://docs.expo.dev/guides/permissions/
[config-plugins]: https://docs.expo.dev/config-plugins/plugins/
[esr-plugin]: https://github.com/jamsch/expo-speech-recognition/blob/v57.1.0/app.plugin.js

### Building to an iPhone with a free account

- **One command.** `npx expo run:ios` "compiles and installs the native binary
  on your device or emulator, then starts the Metro bundler", runs
  `npx expo prebuild` first if the native folders are missing, and takes
  "the `--device` flag to select a device" ([local development][local-dev]).
- **Signing.** Expo CLI can "Automatically codesign iOS apps for development
  from the CLI without having to open Xcode" ([Expo CLI][expo-cli]); Expo's
  signing guide has the developer pick a Development Team in Xcode and trust
  the certificate on the phone under "Settings > General > Device Management"
  ([signing guide][xcode-signing]).
- **Developer Mode.** "Devices running iOS 16 and above need to enable
  OS-level **Developer Mode** setting before they can run" local development
  builds ([Developer Mode][developer-mode]).
- Synthesis: build from a Mac with Xcode 27 and a Personal Team, and plan to
  reinstall weekly, since free profiles expire after seven days.

[local-dev]: https://docs.expo.dev/guides/local-app-development/
[expo-cli]: https://docs.expo.dev/more/expo-cli/
[xcode-signing]: https://github.com/expo/fyi/blob/main/setup-xcode-signing.md
[developer-mode]: https://docs.expo.dev/guides/ios-developer-mode/

## Libraries on September 22, 2026

The npm registry owns versions, dates, and licenses; each library's docs and
source own the rest.

| Package                   | Latest  | Published          | License    | Notes                                     |
| ------------------------- | ------- | ------------------ | ---------- | ----------------------------------------- |
| `expo-speech`             | 57.0.3  | September 11, 2026 | MIT        | Also the `sdk-57` tag; `next` is 58.0.0   |
| `expo-speech-recognition` | 57.1.0  | September 16, 2026 | MIT        | `SFSpeechRecognizer` only                 |
| `expo-sqlite`             | 57.0.3  | September 11, 2026 | MIT        | FTS3, FTS4, and FTS5 on by default        |
| `minisearch`              | 7.2.0   | September 16, 2025 | MIT        | BM25+; no dependencies                    |
| `@orama/orama`            | 3.1.18  | December 19, 2025  | Apache-2.0 | Lists BM25 among its features             |
| `flexsearch`              | 0.8.212 | September 6, 2025  | Apache-2.0 | Names BM25 only as a rival in a benchmark |
| `wink-bm25-text-search`   | 3.1.2   | November 21, 2022  | MIT        | Four `wink` dependencies                  |

Sources: [expo-speech][npm-expo-speech]; [expo-speech-recognition][npm-esr];
[expo-sqlite][npm-sqlite]; [minisearch][npm-minisearch]; [Orama][npm-orama];
[FlexSearch][npm-flexsearch]; [wink][npm-wink].

[npm-expo-speech]: https://registry.npmjs.org/expo-speech
[npm-esr]: https://registry.npmjs.org/expo-speech-recognition
[npm-sqlite]: https://registry.npmjs.org/expo-sqlite
[npm-minisearch]: https://registry.npmjs.org/minisearch
[npm-flexsearch]: https://registry.npmjs.org/flexsearch

### expo-speech in SDK 57

- **The API.** `speak` takes `language`, `pitch`, `rate`, `voice`, `volume`,
  and `useApplicationAudioSession`, with `onStart`, `onDone`, `onStopped`,
  `onError`, and `onBoundary`; speaking again "adds an utterance to queue";
  `isSpeakingAsync` "Will return `true` if speaker is paused"; and on iOS
  `maxSpeechInputLength` "returns `Number.MAX_VALUE`"
  ([docs][expo-speech-docs]).
- **Voices.** `getAvailableVoicesAsync` returns `identifier`, `name`,
  `quality`, and `language` only ([source][es-src]).
- **Silent mode.** "On iOS physical devices, `expo-speech` won't produce
  sound if the device is in silent mode." ([docs][expo-speech-docs])
- Synthesis: `expo-speech` covers speaking; Turn's Swift module supplies the
  Personal Voice identifier and the audio session, and the app listens for
  `onDone` and `onStopped`, not `onError`.

### expo-speech-recognition as the fallback

- **What it wraps.** It implements "the iOS `SFSpeechRecognizer`, Android
  `SpeechRecognizer` and Web `SpeechRecognition`" (see the
  [technology notes][tech-modules]); its code, changelog, and issues never
  mention `SpeechAnalyzer`, and version 56.0.0 raised its minimum to iOS 16.4
  ([changelog][esr-changelog]).
- **Options.** `continuous` defaults to false; without it, "on iOS 17-,
  recognition will run until no speech is detected for 3 seconds" and "on iOS
  18+ and Android, recognition will run until a final result is received";
  `requiresOnDeviceRecognition` will "Prevent device from sending audio over
  the network"; and `iosVoiceProcessingEnabled` "may switch the
  AVAudioSession mode" to voice chat ([README][esr-readme]).
- **Events.** On iOS, "you should expect one final result before speech
  recognition has stopped", `speechend` is "Not supported yet on iOS", and
  `volumechange` gives "a value between -2 and 10" ([README][esr-readme]).
  The maintainer: "on iOS if you're using continuous recording you'll only get
  a final result once you call the stop() function"
  ([issue 79][esr-79]).
- **The one-minute limit.** Apple: "Plan for a one-minute limit on audio
  duration." ([SFSpeechRecognizer][sfspeech]) The library doesn't restart live
  recognition; the maintainer advises that "you may need to enable on-device
  recognition" since "there's API limits with the default network-based
  recognizer" ([issue 81][esr-81]), and the author of an earlier report
  closed it as "a limitation on iOS" ([issue 42][esr-42]).
- Synthesis: as a fallback, run it on the device with
  `requiresOnDeviceRecognition` and an `iosCategory` in the default mode, and
  restart it for each partner line: without `continuous`, iOS 18 and later
  stop at a final result, and with it, a final result comes only on `stop()`.
  Either way, no recognition task runs long enough to meet the one-minute
  limit.

[tech-modules]: /docs/research/next-gen-tech.md#speech-camera-and-model-modules
[esr-changelog]: https://github.com/jamsch/expo-speech-recognition/blob/v57.1.0/CHANGELOG.md
[esr-79]: https://github.com/jamsch/expo-speech-recognition/issues/79
[sfspeech]: https://developer.apple.com/documentation/speech/sfspeechrecognizer
[esr-81]: https://github.com/jamsch/expo-speech-recognition/issues/81
[esr-42]: https://github.com/jamsch/expo-speech-recognition/issues/42

### expo-sqlite and FTS5

- **FTS is on.** The config plugin's `enableFTS` defaults to `true`, "Whether
  to enable the FTS3, FTS4 and FTS5 extensions" ([docs][sqlite-docs]); the
  podspec adds `-DSQLITE_ENABLE_FTS5=1` unless it's turned off
  ([podspec][sqlite-podspec]).
- **The API.** `openDatabaseAsync` and `openDatabaseSync`, with `runAsync`,
  `getAllAsync`, and `withTransactionAsync`, and a warning that
  "`execAsync()` does not escape parameters" ([docs][sqlite-docs]).
- **Ranking.** In FTS5, "The built-in auxiliary function bm25() returns a
  real value indicating how well the current row matches the full-text query.
  The better the match, the numerically smaller the value returned."
  ([FTS5][fts5])

[sqlite-docs]: https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/
[sqlite-podspec]: https://github.com/expo/expo/blob/sdk-57/packages/expo-sqlite/ios/ExpoSQLite.podspec
[fts5]: https://www.sqlite.org/fts5.html

### A phrase ranker in TypeScript

- **MiniSearch.** It is "a tiny but powerful in-memory fulltext search
  engine", with "Exact match, prefix search, fuzzy match, field boosting" and
  "Zero external dependencies" ([README][minisearch]). Version 5.0.0 moved to
  "the BM25+ algorithm", later tunable "via the `bm25` search option"
  ([changelog][minisearch-changelog]); the defaults are `k: 1.2`, `b: 0.7`,
  and `d: 0.5` ([source][minisearch-source]).
- **Text handling.** "Terms are downcased by default. No stemming is
  performed, and no stop-word list is applied." ([README][minisearch])
- **On the phone.** It supports "all browsers and NodeJS versions
  implementing the ES9 (ES2018)" and says nothing of React Native
  ([README][minisearch]). Its default tokenizer uses Unicode property escapes,
  which Hermes lists as supported ([Hermes][hermes-regexp]). The package's ES
  build is 78,014 bytes, 18,324 gzipped, by this note's count.
- **Alternatives.** Orama's README lists BM25 among its features, under the
  Apache-2.0 license ([Orama][orama]); `wink-bm25-text-search` hasn't been
  published since November 21, 2022 ([wink][npm-wink]).
- Synthesis: for 150 to 2,000 short phrases, MiniSearch in memory is the
  simplest keyword ranker, with a stop-word list and the place's phrases added
  in Turn's code; FTS5's `bm25()` is the alternative if the bank already
  lives in SQLite. No source times either on a phone.

[minisearch]: https://github.com/lucaong/minisearch
[minisearch-changelog]: https://github.com/lucaong/minisearch/blob/master/CHANGELOG.md
[minisearch-source]: https://github.com/lucaong/minisearch/blob/master/src/MiniSearch.ts
[hermes-regexp]: https://github.com/facebook/hermes/blob/main/doc/RegExp.md
[orama]: https://github.com/oramasearch/orama

## Timing a conversation depends on

Apple's documentation and WWDC sessions, React Native's docs, and React's docs
own these facts. Where no primary source gives a number, this section says
so.

### Transcription finalization time

- **No number from Apple.** No Speech page, sample, WWDC25 session, or
  release note gives a latency for volatile or final results. The wording is
  qualitative: volatile results are "delivered almost as soon as they’re
  spoken" and improve "over the next few seconds" ([session 277][wwdc25-277]),
  and the iOS 27 sample says "The transcriber module provides an update
  moments after a new batch of audio becomes available."
  ([iOS 27 sample][sample-27])
- **Levers Apple documents.** `fastResults` "reduces result latency by using
  a smaller “context window”" ([fast][st-fast]); `prepareToAnalyze(in:)`
  cuts "delays in analyzing the first audio input" ([prepare][sa-prepare]);
  `finalize(through:)` forces final results ([finalize][sa-finalize]).
- **Audio arrives in chunks.** The sample asks for 4,096-frame tap buffers,
  and iOS 27's new tap takes sizes from 100 to 400 ms
  ([iOS 26 sample][sample-26]; [installAudioTap][install-audio-tap]).
- Synthesis: at 48 kHz, 4,096 frames is about 85 ms, so the buffer adds
  little. Measure, on the demo iPhone, the time from the partner's last word
  to the last volatile change, to a final result without forcing, and to the
  return of `finalize(through: nil)`.

### Speech start time

- **No number from Apple.** `speak(_:)` "begins speaking that utterance
  either immediately or after pausing for its `preUtteranceDelay`"
  ([AVSpeechSynthesizer][synth]), and the class has no warm-up method. Apple's
  research on Personal Voice says only that the model was made small enough
  "to achieve real-time speech synthesis" ([Apple research][ml-pv]).
- **Output lag.** AirPlay output "can result in a 2-second delay"
  ([outputLatency][output-latency]).
- Synthesis: measure from the tap to `onStart` on the demo iPhone, for a
  system voice and for the Personal Voice, first use and later uses.

[synth]: https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer
[ml-pv]: https://machinelearning.apple.com/research/personal-voice

### A steady row in React Native

- **Fixed sizes.** "The general way to set the dimensions of a component is by
  adding a fixed `width` and `height` to style", which "is common for
  components whose size should always be fixed" ([size][rn-size]).
- **Stable keys.** React: "Keys must not change or that defeats their
  purpose!", and "Index as a key often leads to subtle and confusing bugs"
  when items move ([React][react-keys]).
- **Announcements.** `announceForAccessibilityWithOptions` announcements
  "will interrupt any existing speech, but on iOS they can be queued behind
  existing speech by setting `queue` to `true`" ([AccessibilityInfo][rn-info]).
- **Focus.** `setAccessibilityFocus` is deprecated: "Prefer using
  `sendAccessibilityEvent` with eventType `focus` instead."
  ([AccessibilityInfo][rn-info]) `accessibilityLiveRegion` is for TalkBack,
  on Android only ([accessibility][rn-a11y]).
- **Testing.** "VoiceOver isn't available via the simulator"
  ([accessibility][rn-a11y]).
- **Nothing on re-renders.** No React Native or Expo page says what happens
  to VoiceOver focus when the focused view's content changes or the view is
  replaced, and neither mentions layout shift.
- Synthesis: give the row fixed-size slots keyed by slot position, since the
  slots never move and only their phrases change, announce a new row with
  `queue: true` so it doesn't cut off Turn's own speech, and test focus with
  VoiceOver on a phone. The [iOS design notes][design-text] cover how text
  scales in React Native.

[rn-size]: https://reactnative.dev/docs/0.86/height-and-width
[react-keys]: https://react.dev/learn/rendering-lists
[rn-info]: https://reactnative.dev/docs/0.86/accessibilityinfo
[rn-a11y]: https://reactnative.dev/docs/0.86/accessibility
[design-text]: /docs/research/ios-design.md#how-react-native-scales-text

## Conflicts between sources

- **The speech recognition key.** Apple's permission article warns that
  without `NSSpeechRecognitionUsageDescription` "your app will crash when it
  attempts to request authorization or use the APIs of the Speech framework",
  while the key's own page requires it only for "APIs that send user data to
  Apple’s speech recognition servers", the same article says `SpeechAnalyzer`
  modules don't send audio there, and both `SpeechAnalyzer` samples ship
  without it ([permission][speech-permission]; [key][plist-speech];
  [iOS 26 sample][sample-26]; [iOS 27 sample][sample-27]).
- **Custom vocabulary.** The [evidence notes][ev-devices] say both speech APIs
  take custom vocabulary through contextual strings, while Apple's
  `AnalysisContext` page describes them "With the `DictationTranscriber`
  module" only ([contextual strings][analysis-context]).
- **Whether the model must be fetched.** WWDC25 says "the models need to be
  fetched" ([session 277][wwdc25-277]), while `AssetInventory` allows that the
  assets "were preinstalled on the system" ([AssetInventory][asset-inventory]);
  no page says which locales, if any, ship with iOS.
- **The speaker override.** The `defaultToSpeaker` page routes to the speaker
  "even when other accessories, such as headphones and wireless Bluetooth
  headphones, are in use", while `AVAudioSessionTypes.h` says "when no other
  audio route is connected" ([defaultToSpeaker][default-to-speaker]).
- **Interruption deprecation.** The iOS 27 SDK header and the
  `InterruptionType` page deprecate the interruption API on iOS 27, while the
  `interruptionNotification` page shows the deprecation for visionOS only
  ([InterruptionType][interruption-type]; [notification][interruption-note]).
- **Deactivating a busy session.** The `setActive(_:options:)` page says
  deactivating with running audio "returns an `AVAudioSession.ErrorCode.isBusy`
  error", while `AVAudioSession.h` says that starting in iOS 26.0 it "will no
  longer return AVAudioSessionErrorCodeIsBusy" ([setActive][set-active]).
- **What voice processing removes.** WWDC19 says "any audio that is coming
  from the device is taken out" ([session 510][wwdc19-510]), while WWDC23
  treats audio not rendered through it as "other audio" to duck
  ([session 10235][wwdc23-10235]); neither says which applies to
  `AVSpeechSynthesizer`.
- **Personal Voice devices.** Apple Support says iPhone 12 or later, and the
  iOS 27 guide says iPhone 15 Pro, iPhone 16, and later, as the
  [evidence notes][ev-devices] already record.
- **An unsupported device's status.** `PersonalVoiceAuthorizationStatus` has
  an `unsupported` case, while the status page says "the framework denies the
  request if the device doesn’t support using personal voices"
  ([statuses][pv-status-enum]; [status][pv-status]).
- **`OnStartObserving`.** The Module API says "You need to pass an event
  name", while an example further down the same page passes none, and the
  source makes the name optional ([Module API][module-api];
  [source][emc-observing]).
- **The barrel file.** The get-started page imports a local module's
  `index.ts`, while `create-expo-module` generates none unless asked
  ([get started][modules-start]; [create-expo-module][create-module]).
- **`onError` on iOS.** Expo's docs list the callback for iOS, while the
  source says "iOS never uses this event at all" ([docs][expo-speech-docs];
  [Speech.ts][es-ts]).
- **Sentence embedding languages.** WWDC20 lists seven, while this note's Mac
  test got an embedding for English, Spanish, German, and Chinese only
  ([session 10657][wwdc20-10657]).
- **Orama's license.** The npm registry and `LICENSE.md` say Apache-2.0,
  while GitHub's API reports "NOASSERTION" ([Orama][npm-orama]).

[emc-observing]: https://github.com/expo/expo/blob/sdk-57/packages/expo-modules-core/ios/Api/Factories/ObjectFactories.swift

## Gaps

What no source settled on September 22, 2026:

- **Transcription.** No device list for `SpeechTranscriber`, no asset size,
  no count for `maximumReservedLocales`, no statement on `SpeechTranscriber`
  in the Simulator beyond Apple's sample, no word on whether any locale ships
  preinstalled, no end-of-utterance signal, and no word on whether contextual
  strings affect `SpeechTranscriber`.
- **Latency.** No Apple number for volatile results, final results,
  `finalize(through:)`, or the start of synthesized speech.
- **Audio.** Whether voice processing or echo-cancelled input removes
  `AVSpeechSynthesizer` output, which "2024 or later iPhone models" support
  echo-cancelled input, and whether the synthesizer activates the shared
  session by itself.
- **Personal Voice.** Whether `AVSpeechSynthesisVoice(identifier:)` resolves a
  Personal Voice, what authorization returns when the Settings switch is off,
  and what happens in the Simulator.
- **Text tools.** No language list for `nameType`, no accuracy on
  transcripts, no iPhone speed or model size, and no word on whether the
  sentence embedding works offline on a new phone.
- **Expo.** No docs on `#available`, on Swift `async` in `AsyncFunction`, or
  on calling `sendEvent` from a background thread.
- **Libraries.** `expo-speech-recognition` has no `SpeechAnalyzer` support, no
  workaround for the one-minute limit on live input, and no `speechend` on
  iOS; MiniSearch doesn't mention React Native or Hermes; and nobody publishes
  phone timings for 150 to 2,000 phrases.
- **React Native.** Nothing on keeping VoiceOver focus through a re-render or
  on layout shift.

[ev-devices]: /docs/research/next-gen-evidence.md#turn-on-students-devices
[sa]: https://developer.apple.com/documentation/speech/speechanalyzer
[sample-26]: https://developer.apple.com/documentation/speech/bringing-advanced-speech-to-text-capabilities-to-your-app
[install-audio-tap]: https://developer.apple.com/documentation/avfaudio/avaudionode/installaudiotap(onbus:buffersize:format:tapprovider:)
[sample-27]: https://developer.apple.com/documentation/speech/recognizing-speech-in-live-audio
[sa-prepare]: https://developer.apple.com/documentation/speech/speechanalyzer/preparetoanalyze(in:)
[wwdc25-277]: https://developer.apple.com/videos/play/wwdc2025/277/
[st-fast]: https://developer.apple.com/documentation/speech/speechtranscriber/reportingoption/fastresults
[asset-inventory]: https://developer.apple.com/documentation/speech/assetinventory
[sa-finalize]: https://developer.apple.com/documentation/speech/speechanalyzer/finalize(through:)
[plist-speech]: https://developer.apple.com/documentation/bundleresources/information-property-list/nsspeechrecognitionusagedescription
[speech-permission]: https://developer.apple.com/documentation/speech/asking-permission-to-use-speech-recognition
[analysis-context]: https://developer.apple.com/documentation/speech/analysiscontext/contextualstrings
[expo-speech-docs]: https://docs.expo.dev/versions/v57.0.0/sdk/speech/
[default-to-speaker]: https://developer.apple.com/documentation/avfaudio/avaudiosession/categoryoptions-swift.struct/defaulttospeaker
[es-src]: https://github.com/expo/expo/blob/sdk-57/packages/expo-speech/ios/SpeechModule.swift
[esr-readme]: https://github.com/jamsch/expo-speech-recognition/blob/v57.1.0/README.md
[wwdc19-510]: https://developer.apple.com/videos/play/wwdc2019/510/
[wwdc23-10235]: https://developer.apple.com/videos/play/wwdc2023/10235/
[output-latency]: https://developer.apple.com/documentation/avfaudio/avaudiosession/outputlatency
[pv-support]: https://support.apple.com/en-us/104993
[interruption-note]: https://developer.apple.com/documentation/avfaudio/avaudiosession/interruptionnotification
[interruption-type]: https://developer.apple.com/documentation/avfaudio/avaudiosession/interruptiontype
[set-active]: https://developer.apple.com/documentation/avfaudio/avaudiosession/setactive(_:options:)
[pv-status-enum]: https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer/personalvoiceauthorizationstatus-swift.enum
[pv-status]: https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer/personalvoiceauthorizationstatus-swift.type.property
[pv-guide]: https://support.apple.com/guide/iphone/record-your-personal-voice-iph51936468d/ios
[es-ts]: https://github.com/expo/expo/blob/sdk-57/packages/expo-speech/src/Speech.ts
[wwdc20-10657]: https://developer.apple.com/videos/play/wwdc2020/10657/
[create-module]: https://docs.expo.dev/more/create-expo-module/
[module-template]: https://github.com/expo/expo/tree/sdk-57/packages/expo-module-template
[modules-start]: https://docs.expo.dev/modules/get-started/
[module-api]: https://docs.expo.dev/modules/module-api/
[app-config]: https://docs.expo.dev/versions/latest/config/app/
[npm-orama]: https://registry.npmjs.org/@orama/orama
[npm-wink]: https://registry.npmjs.org/wink-bm25-text-search

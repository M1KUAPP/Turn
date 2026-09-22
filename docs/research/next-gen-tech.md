# Next Gen technology research notes

What a phone can newly do on September 22, 2026, and how Jev pairs with it,
as input to the ten-round ideation for RevenueCat Shipaton 2026's Next Gen
Award, which judges student apps from a demo video and a public open-source
repository ([Next Gen rules][sp-next-gen]). Every source below was read on
September 22, 2026, so versions, prices, and limits are as of that date, and
judgment starts with "Synthesis:". What the [Jev notes][jev-notes], the
[Cloudflare notes][cf-notes], the [RevenueCat and Expo notes][rc-notes], the
[iOS design notes][design-notes], and the [Apple notes][apple-notes] already
hold is linked, not repeated.

Contents:

1.  [Findings for the ideation](#findings-for-the-ideation)
1.  [Platform versions on September 22, 2026](#platform-versions-on-september-22-2026)
1.  [On-device language models on iPhone](#on-device-language-models-on-iphone)
1.  [Speech and translation on iPhone](#speech-and-translation-on-iphone)
1.  [Vision, sound, and motion on iPhone](#vision-sound-and-motion-on-iphone)
1.  [System surfaces on iPhone](#system-surfaces-on-iphone)
1.  [Android equivalents](#android-equivalents)
1.  [Expo and React Native access](#expo-and-react-native-access)
1.  [Real-time backends on Cloudflare](#real-time-backends-on-cloudflare)
1.  [How Jev pairs with phone perception](#how-jev-pairs-with-phone-perception)
1.  [Accounts, entitlements, and devices for an eight-day build](#accounts-entitlements-and-devices-for-an-eight-day-build)
1.  [Conflicts between sources](#conflicts-between-sources)
1.  [Gaps](#gaps)

[rc-notes]: /docs/research/revenuecat-expo.md
[apple-notes]: /docs/research/apple-requirements.md

## Findings for the ideation

Synthesis: each line condenses the section it links to, where the sources
are. None of it picks an idea.

- **iOS 27 is current; Expo SDK 57 still is too.** iOS 27 and Xcode 27
  shipped on September 14, 2026. SDK 57 is Expo's latest stable release, and
  SDK 58, "built for iOS 27", is a beta that should run past September 30.
  Calling iOS 27-only APIs from Expo today means a local Xcode 27 build. See
  [Platform versions on September 22, 2026](#platform-versions-on-september-22-2026)
  and [Expo SDK 57, SDK 58, and Xcode 27](#expo-sdk-57-sdk-58-and-xcode-27).
- **The phone now has a free, offline text generator.** Foundation Models
  runs Apple's AFM 3 model with typed output, tool calling, and, new in iOS
  27, image input, at no cost per request, in sessions the docs cap at 4,096
  tokens, on Apple Intelligence iPhones only (iPhone 15 Pro and later). It
  writes the text Jev can't. See
  [Foundation Models in iOS 27](#foundation-models-in-ios-27).
- **Private Cloud Compute is out of reach.** It needs the App Store Small
  Business Program, which needs a paid membership, and an entitlement Apple
  grants on request. See [Private Cloud Compute](#private-cloud-compute).
- **Perception runs on the device and needs no entitlement.** Live speech
  transcription, text and document reading, 21-joint hands, 19-point bodies,
  17-joint 3D bodies, 300-plus sound classes, and 100 Hz motion all produce
  labels, points, or text in the app. See
  [Speech and translation on iPhone](#speech-and-translation-on-iphone) and
  [Vision, sound, and motion on iPhone](#vision-sound-and-motion-on-iphone).
- **Jev only reads text, and its limits favor events over frames.** Every
  perception result must become text or JSON first, and at 1,200 requests a
  minute and about 100 to 150 ms a call before network time, a loop should ask
  one batch of questions per event, not per camera frame. See
  [How Jev pairs with phone perception](#how-jev-pairs-with-phone-perception).
- **Demos of perception need a real iPhone.** Apple's live speech sample,
  Translation, and the new Vision tools don't run in the Simulator, and Expo
  lists the camera, audio input, and motion as unavailable there; the
  on-device language model does run in the Simulator on an Apple Intelligence
  Mac. See
  [Simulator and hardware limits](#simulator-and-hardware-limits).
- **A free Apple account can build to a phone, with limits.** Xcode installs
  on up to 3 devices with App IDs that expire after 7 days; push, Siri, In-App
  Purchase, and TestFlight need the paid program, and so do EAS device builds.
  See
  [Apple accounts for a student team](#apple-accounts-for-a-student-team).
- **Expo bridges lag Apple's newest APIs.** The maintained speech module wraps
  the older `SFSpeechRecognizer`, the Apple Foundation Models bridge hasn't
  released since January and transcribes files only, and no module exposes
  iOS 27 image input. A local Expo module in Swift or a Swift app closes the
  gap. See
  [Speech, camera, and model modules](#speech-camera-and-model-modules) and
  [Writing a Swift bridge with Expo Modules](#writing-a-swift-bridge-with-expo-modules).
- **Real-time camera ML in React Native means VisionCamera 5.** VisionCamera's
  own comparison gives Expo Camera no real-time frame processing; VisionCamera
  5 and ExecuTorch run models on live frames in a development build. See
  [Speech, camera, and model modules](#speech-camera-and-model-modules).
- **Live Activities work without a server, but pushes need a paid account.**
  `expo-widgets` builds them from Expo; local updates are free, while APNs
  updates need the Push Notifications capability. See
  [Live Activities](#live-activities).
- **A WebSocket to a hibernating Durable Object suits a live loop.** Idle
  sockets cost no duration, incoming messages bill at 20 to 1, and the object
  calls Jev per message. Workers AI can transcribe speech, but on-device
  transcription is free. See
  [Real-time backends on Cloudflare](#real-time-backends-on-cloudflare).
- **Android's on-device model is harder for students.** Gemini Nano's Prompt
  API is beta, Kotlin-first, limited to recent phones, foreground-only, and
  its terms bar users and developers under 18. See
  [Android equivalents](#android-equivalents).
- **Health data can't flow to Jev.** HealthKit bars sharing with a third party
  that doesn't provide a health or fitness service. See
  [Core Motion and HealthKit](#core-motion-and-healthkit).

## Platform versions on September 22, 2026

The earlier notes built on iOS 26 and Expo SDK 57 ([design-notes];
[rc-expo-versions]). iOS 26 is now the previous release; SDK 57 is still
Expo's newest stable SDK.

| Component    | Latest stable      | Released                            | Newer, in beta                                   | Sources                        |
| ------------ | ------------------ | ----------------------------------- | ------------------------------------------------ | ------------------------------ |
| iOS          | 27.0 (24A437)      | September 14, 2026                  | 27.2 beta 2 (24B5089g), September 21             | [apple-releases]               |
| Xcode        | 27 (27A266a)       | September 14, 2026                  | 27.1 beta, September 18; 27.2 beta, September 16 | [apple-releases]; [xcode-reqs] |
| Android      | 17 (API level 37)  | June 16, 2026                       | 17 QPR1 Beta 9, August 17                        | [android-17]; [android-qpr1]   |
| Expo SDK     | 57; `expo` 57.0.24 | June 30, 2026; 57.0.24 September 18 | 58.0.0-preview.4, September 21                   | [expo-sdk57]; [npm-expo]       |
| React Native | 0.87.1             | August 26, 2026                     | 0.88.0-rc.2, September 21                        | [npm-rn]; [rn-087]             |

- **iOS 27.** "Siri AI, the next generation of Apple Intelligence, powerful
  parental controls, and an expansive set of software improvements start
  rolling out today across iOS 27, iPadOS 27, macOS 27, and other Apple
  platforms" ([nr-ios27]).
- **Xcode 27.** It runs on "macOS Tahoe 26.6 or later", carries the iOS 27
  SDK, deploys to "iOS 15–27", and ships Swift 6.4 ([xcode-reqs]).
- **Android 17.** "Today we're releasing Android 17 and making it available
  on most supported Pixel devices." ([android-17])
- **Expo SDK 58.** "SDK 58 is built for iOS 27, and you can ship with the beta
  if you want iOS 27 support in your app now." "The SDK 58 beta period begins
  today and will last three to four weeks." ([expo-sdk58]) It was posted
  September 15, 2026.
- **React Native.** "Today we are excited to release React Native 0.87!"
  ([rn-087]) SDK 57 stays on React Native 0.86 ([expo-versions]).
- Synthesis: an Expo app for September 30 stays on SDK 57 with React Native
  0.86. Features that exist only in iOS 27 need the path under
  [Expo SDK 57, SDK 58, and Xcode 27](#expo-sdk-57-sdk-58-and-xcode-27).

[rc-expo-versions]: /docs/research/revenuecat-expo.md#expo-sdk-react-native-and-minimum-ios
[apple-releases]: https://developer.apple.com/news/releases/
[xcode-reqs]: https://developer.apple.com/xcode/system-requirements/
[android-qpr1]: https://developer.android.com/about/versions/17/qpr1/release-notes
[npm-expo]: https://registry.npmjs.org/expo
[npm-rn]: https://registry.npmjs.org/react-native
[rn-087]: https://reactnative.dev/blog/2026/08/11/react-native-0.87
[expo-versions]: https://docs.expo.dev/versions/latest/

## On-device language models on iPhone

Apple's documentation, WWDC sessions, and apple.com own these facts. The
on-device model is the one text generator in this note that runs on the phone
itself, free per request.

### Foundation Models in iOS 27

- **What it does.** "On-device models excel at a diverse range of text
  generation tasks, like summarization, entity extraction, text and image
  understanding, refinement, dialog for games, generating creative content,
  and more." ([fm]) Apple's product page adds: "Any app can tap into the
  on-device models that power Apple Intelligence, and the features you build
  work offline. And it’s all at no cost per request." ([apple-ai])
- **The model.** "Currently, there are 3 model versions that align with:"
  iOS 26.0 through 26.3, 26.4, and 27.0 ([fm-slm]). iOS 27 names two on-device
  variants, "AFM 3 Core." and "AFM 3 Core Advanced." ([fm-variant]), and
  Apple's research post calls AFM 3 Core "the next generation of our
  3-billion-parameter dense model that delivers a step up in quality"
  ([ml-afm3]).
- **Guided generation.** With the `@Generable` and `@Guide` macros,
  "Constrained sampling prevents the model from producing malformed output
  and provides you with results as a type you define." ([fm-guided])
  `DynamicGenerationSchema` builds schemas at run time ([fm]).
- **Tool calling.** Tools conform to the `Tool` protocol ([fm]), and Apple
  advises: "Provide no more than three to five tools per request."
  ([fm-context]) iOS 27 adds `GenerationOptions.ToolCallingMode` and the
  Vision tools `OCRTool` and `BarcodeReaderTool` ([fm-updates]).
- **Context window.** "Apple’s on-device foundation model has a context
  window of 4096 tokens per session, with a token representing each word, or
  partial word." ([fm-context]) The WWDC26 session's code sample prints
  `model.contextSize` as `8192`, and the session advises using the size and
  token-count APIs "to adapt your app to the hardware it's running on"
  ([wwdc26-241]).
- **Image input, new in iOS 27.** "The framework supports several image types
  to include in your prompts, like `CGImage`, `CIImage`, `CVPixelBuffer`, and
  image URLs." The article's advice: "Perform image analysis with the
  on-device model first." ([fm-images]) The WWDC26 "What's new" session says
  "The model supports images in any size and aspect ratio, so you don't need
  to crop or pad to any particular shape", but "larger images will consume
  more tokens and incur more latency." ([wwdc26-241]) In a WWDC26 group lab,
  an Apple engineer put an image at "about 200 tokens or so" ([wwdc26-8011]).
- **Latency.** Apple states no token rate. "The response call is
  asynchronous because it may take a few seconds for the on-device foundation
  model to generate the response." ([fm-generating]) Call `prewarm` only "when
  you have a window of at least 1 second" ([fm-prewarm]).
- **Languages.** "The on-device system language model is multilingual, which
  means the same model understands and generates text in any language that
  Apple Intelligence supports." ([fm-languages])
- **Guardrails.** The framework has "Guardrails that aim to block harmful or
  sensitive content, such as self-harm, violence, and adult materials."
  ([fm-safety])
- **Content tagging.** A second on-device model: "When you prompt the content
  tagging model, it produces a tag that uses one to a few lowercase words."
  ([fm-tags])
- **Availability.** The model reports `.deviceNotEligible`,
  `.appleIntelligenceNotEnabled`, or `.modelNotReady` when it can't run, and
  "It can take some time for the model to download and become available when
  a person turns on Apple Intelligence." ([fm-generating])
- **Other models behind the same API.** iOS 27 adds the `LanguageModel`
  protocol to "use any large language model — server or on-device" and
  `CoreAILanguageModel` for models run with Core AI ([fm-updates]), a new
  framework to "Run AI models in your app on Apple silicon." ([coreai])
  "Running and integrating a Core AI model requires macOS 27, iOS 27, and
  Xcode 27 or later." ([fm-coreai]) The WWDC26 session warns: "Remember,
  never store private keys in your app binary." ([wwdc26-241])
- Synthesis: the on-device model writes text and typed Swift values offline
  and free, which Jev can't do, but its small context and "a few seconds" of
  generation make it a slow, small generator rather than a per-frame
  classifier. Read `contextSize` at run time rather than hard-coding 4,096.

[fm]: https://developer.apple.com/documentation/foundationmodels
[apple-ai]: https://www.apple.com/apple-intelligence/
[fm-slm]: https://developer.apple.com/documentation/foundationmodels/systemlanguagemodel
[fm-guided]: https://developer.apple.com/documentation/foundationmodels/generating-swift-data-structures-with-guided-generation
[fm-updates]: https://developer.apple.com/documentation/updates/foundationmodels
[fm-images]: https://developer.apple.com/documentation/foundationmodels/analyzing-images-with-multimodal-prompting
[wwdc26-8011]: https://developer.apple.com/videos/play/wwdc2026/8011/
[fm-generating]: https://developer.apple.com/documentation/foundationmodels/generating-content-and-performing-tasks-with-foundation-models
[fm-prewarm]: https://developer.apple.com/documentation/foundationmodels/languagemodelsession/prewarm(promptprefix:)
[fm-languages]: https://developer.apple.com/documentation/foundationmodels/supporting-languages-and-locales-with-foundation-models
[fm-safety]: https://developer.apple.com/documentation/foundationmodels/improving-the-safety-of-generative-model-output
[fm-tags]: https://developer.apple.com/documentation/foundationmodels/categorizing-and-organizing-data-with-content-tags
[coreai]: https://developer.apple.com/documentation/coreai
[fm-coreai]: https://developer.apple.com/documentation/foundationmodels/running-a-core-ai-model-in-a-foundation-models-session

### Private Cloud Compute

- **What it adds.** The server model "provides a larger 32K-token context size
  and stronger reasoning for handling long documents or extended multiturn
  conversations." "People just need a device that supports Apple Intelligence
  and gets a daily request limit." "Using PCC requires a network connection"
  ([fm-pcc]).
- **No cost to developers.** "And even better, there are no token costs to
  you, the developer." ([wwdc26-319])
- **Who may use it.** Developers must be "enrolled in the App Store Small
  Business Program", have "fewer than 2 million first-time app downloads", and
  "Have the Private Cloud Compute entitlement assigned to their account."
  Testing works "via TestFlight or ad hoc distribution" ([apple-pcc]). To join
  the Small Business Program you must "Be an Account Holder in the Apple
  Developer Program" ([asbp]).
- Synthesis: Private Cloud Compute needs a paid membership, a program
  enrollment, and an entitlement Apple grants by request, so a team without a
  paid membership can't plan on it for September 30. The on-device model
  needs none of these.

[fm-pcc]: https://developer.apple.com/documentation/foundationmodels/adding-server-side-intelligence-with-private-cloud-compute
[wwdc26-319]: https://developer.apple.com/videos/play/wwdc2026/319/

### Apple Intelligence devices

- **iPhones.** "Apple Intelligence and Siri AI in iOS 27, iPadOS 27, macOS 27,
  watchOS 27, and visionOS 27 are available on iPhone Duo, iPhone Air, iPhone
  16 models or later, iPhone 15 Pro, iPhone 15 Pro Max", plus newer iPads,
  Macs with M1 or later, and Apple Vision Pro ([nr-ios27]).
- **Languages.** "Apple Intelligence is available with support for these
  languages: English, Danish, Dutch, French, German, Italian, Norwegian,
  Portuguese, Spanish, Swedish, Turkish, Vietnamese, Chinese (simplified),
  Chinese (traditional), Japanese, and Korean." ([nr-ios27])
- **Setup.** Apple Intelligence needs "Up to 8 GB of storage" on most
  supported iPhones and "Device language and Siri language set to the same
  supported language", and "Apple Intelligence features will not currently
  work for supported devices purchased in China mainland." ([ai-support])
- **Simulator.** "If your development machine is running the latest macOS,
  and has Apple Intelligence enabled and ready, then we can conveniently run
  this in the iPhone and visionPro simulators." ([wwdc25-259])
- Synthesis: a student whose iPhone is older than the iPhone 15 Pro can still
  build and demo the on-device model in the Simulator on an Apple silicon Mac
  with Apple Intelligence turned on, but not on that phone.

[ai-support]: https://support.apple.com/en-us/121115

## Speech and translation on iPhone

Apple's Speech and Translation documentation owns these facts; both run on
the phone and turn audio or text into text a backend can pass to Jev.

### SpeechAnalyzer and SpeechTranscriber

- **Versions.** `SpeechAnalyzer`, `SpeechTranscriber`, and `SpeechDetector`
  arrived in iOS 26 ([speech-analyzer]; [speech-transcriber];
  [speech-detector]). iOS 27 adds a way to "Access audio from a file, asset,
  or capture device, such as a microphone" ([speech-updates]).
  `DictationTranscriber` is "similar to system dictation features and
  compatible with older devices" ([speech-dictation]).
- **On device.** "`SpeechAnalyzer` transcriber modules don’t send audio data
  of the user’s voice to Apple’s servers." ([speech-permission]) The model
  "is retained in system storage and does not increase the download or
  storage size of your application, nor does it increase the run-time memory
  size." ([wwdc25-277])
- **Live results.** The transcriber can report volatile results, and "They’re
  delivered almost as soon as they’re spoken but they are less accurate
  guesses." ([wwdc25-277]) Preparing the analyzer first "may improve how
  quickly the modules return their first results." ([speech-analyzer])
- **Languages.** The list comes only at run time from `supportedLocales`
  ([speech-locales]). WWDC25 says: "SpeechTranscriber can currently transcribe
  these languages, with more to come, and is available for all platforms but
  watchOS with certain hardware requirements." ([wwdc25-277]) Where a device
  isn't supported, "consider disabling the feature or using
  `DictationTranscriber` instead." ([speech-transcriber])
- **Concurrency.** "The system normally limits simultaneous analyses to a
  conservative number, considering hardware capabilities of different
  devices." ([speech-analyzer])
- **Simulator.** Apple's iOS 27 live-audio sample: "The sample app doesn’t run
  in the iOS Simulator, so you need to run it on a physical device with iOS
  or iPadOS 27 or later." ([speech-live-sample])
- **The older API.** For `SFSpeechRecognizer`, "Plan for a one-minute limit on
  audio duration." ([sfspeech]) The maintained Expo module still wraps this
  older API; see
  [Speech, camera, and model modules](#speech-camera-and-model-modules).
- Synthesis: `SpeechTranscriber` gives a free, private, live transcript, and
  a finished utterance is a natural moment to send one text state to Jev.
  Plan on testing it on a physical iPhone.

[speech-analyzer]: https://developer.apple.com/documentation/speech/speechanalyzer
[speech-transcriber]: https://developer.apple.com/documentation/speech/speechtranscriber
[speech-detector]: https://developer.apple.com/documentation/speech/speechdetector
[speech-updates]: https://developer.apple.com/documentation/updates/speech
[speech-dictation]: https://developer.apple.com/documentation/speech/dictationtranscriber
[speech-permission]: https://developer.apple.com/documentation/speech/asking-permission-to-use-speech-recognition
[wwdc25-277]: https://developer.apple.com/videos/play/wwdc2025/277/
[sfspeech]: https://developer.apple.com/documentation/speech/sfspeechrecognizer

### Translation

- **On device.** "All translations using the `TranslationSession` class are
  processed on the user’s device." ([translation-session])
- **Downloads.** "With the customizable translation APIs, the framework asks a
  person for permission to download the language translation models, if
  necessary." ([translation-sample])
- **Modes.** The `highFidelity` strategy "provides more fluent translations
  using Apple Intelligence", and `lowLatency` "provides fast translations
  using traditional models" ([translation-strategy]).
- **Versions.** The framework dates from iOS 17.4, `TranslationSession` from
  iOS 18, and the strategy option from iOS 26.4 ([translation];
  [translation-session]; [translation-strategy]).
- **Simulator.** "This sample code project runs only in macOS and on physical
  iOS devices. It doesn’t translate text in iOS or iPadOS simulators."
  ([translation-sample])
- Synthesis: Jev's accuracy is best in English ([ts-models]), so translating
  to English on the device before a Jev call is one way to serve other
  languages; no TypeSafe page tests that.

[translation-session]: https://developer.apple.com/documentation/translation/translationsession
[translation-strategy]: https://developer.apple.com/documentation/translation/translationsession/strategy
[translation]: https://developer.apple.com/documentation/translation

## Vision, sound, and motion on iPhone

Apple's documentation and WWDC sessions own these facts. Each framework runs
on the device and hands the app labels, points, or text.

### Vision requests

- **On device and fast.** "In all cases, all of Vision’s processing happens
  on the user’s device to enhance performance and user privacy."
  ([vision-text-article]) WWDC26: "And Vision is fast. Often fast enough to
  analyze video frames in real time." ([wwdc26-237]) Apple gives no frame
  rates.
- **Text.** `RecognizeTextRequest` "generates a collection of
  RecognizedTextObservation objects" with a fast or an accurate recognition
  level ([vision-text]). "It can read text in over 30 languages."
  ([wwdc26-237])
- **Documents, iOS 26.** `RecognizeDocumentsRequest` "extracts different
  groups of text and barcodes within the document image", including "tables
  and lists" ([vision-documents]).
- **Hands.** `HumanHandPoseObservation.JointName` lists 21 joints, from the
  wrist to each fingertip ([vision-hand-joints]), and the request's
  `maximumHandCount` notes: "The default value is `2`." ([vision-hand-count])
- **Bodies.** The 2D request is "detecting up to 19 unique body points"
  ([vision-body]). The 3D request "measures 17 individual joint locations in
  3D space", and "The request only supports the detection and results for the
  most prominent person in the frame" ([vision-3d]).
- **Versions.** The Swift request types above date from iOS 18
  ([vision-text]), while `GenerateIterativeSegmentationRequest` and `OCRTool`
  need iOS 27 ([vision-segment]; [vision-ocrtool]).
- **Lens smudges, iOS 26.** "Running DetectLensSmudgeRequest requires a device
  with A14 Bionic and later or device with M1 and later." ([vision-smudge])
- **New in iOS 27.** Tap-to-segment arrives with
  `GenerateIterativeSegmentationRequest` ([vision-segment]), and "before you
  perform a segmentation request for the first time on a device, you'll have
  to download the model." For Foundation Models, "This year, tool calling
  supports image arguments." ([wwdc26-237]) "OCRTool isn’t available in
  Simulator." ([vision-ocrtool]) "BarcodeReaderTool isn’t available in
  Simulator." ([vision-barcodetool])
- Synthesis: Vision hands back text and named points; code can turn them
  into short text such as a joint angle or a hand's state, since Jev "is not a
  calculator" ([jev-limitations]).

[vision-text-article]: https://developer.apple.com/documentation/vision/recognizing-text-in-images
[wwdc26-237]: https://developer.apple.com/videos/play/wwdc2026/237/
[vision-text]: https://developer.apple.com/documentation/vision/recognizetextrequest
[vision-documents]: https://developer.apple.com/documentation/vision/recognizedocumentsrequest
[vision-hand-joints]: https://developer.apple.com/documentation/vision/humanhandposeobservation/jointname
[vision-hand-count]: https://developer.apple.com/documentation/vision/detecthumanhandposerequest/maximumhandcount
[vision-body]: https://developer.apple.com/documentation/vision/detecting-human-body-poses-in-images
[vision-3d]: https://developer.apple.com/documentation/vision/identifying-3d-human-body-poses-in-images
[vision-segment]: https://developer.apple.com/documentation/vision/generateiterativesegmentationrequest
[vision-ocrtool]: https://developer.apple.com/documentation/vision/ocrtool
[vision-barcodetool]: https://developer.apple.com/documentation/vision/barcodereadertool
[jev-limitations]: /docs/research/jev.md#known-limitations-on-the-jaggedness-page

### Sound Analysis

- **Classes.** "Sound requests can identify over 300 sounds." ([soundanalysis])
  The built-in classifier dates from iOS 15 ([sound-classifier]).
- **Live audio.** An app "can use an audio stream analyzer to show a visual
  label for sounds the app identifies in real time" ([sound-stream]).
- **Windows and scores.** "The built-in classifier supports window durations
  between 1/2 second long and 15 seconds long." The label scores "do not add
  up to a value of one. The confidences are independent", and the work is
  "done locally on-device" ([wwdc21-10036]).
- **Music, new in iOS 27.** The Music Understanding framework returns
  "information like the rhythm, pace, loudness, key, and instrument activity",
  in one result "or as a livestream of partial results"
  ([music-understanding]).
- Synthesis: a sound label with its confidence is already text, so it can go
  into Jev's state as it is.

[soundanalysis]: https://developer.apple.com/documentation/soundanalysis
[sound-classifier]: https://developer.apple.com/documentation/soundanalysis/snclassifieridentifier/version1
[sound-stream]: https://developer.apple.com/documentation/soundanalysis/classifying-sounds-in-an-audio-stream
[wwdc21-10036]: https://developer.apple.com/videos/play/wwdc2021/10036/
[music-understanding]: https://developer.apple.com/documentation/musicunderstanding

### Core Motion and HealthKit

- **Motion rate.** "The maximum frequency at which you can request updates is
  hardware-dependent but is usually at least 100 Hz." ([cm-raw]) "Create only
  one CMMotionManager object for your app." ([cm-manager])
- **Activity.** "Motion data reflects whether the user is walking, running, in
  a vehicle, or stationary for periods of time." ([cm-activity])
- **Headphones.** `CMHeadphoneMotionManager` "delivers headphone motion
  updates to your app" from iOS 14 ([cm-headphone]).
- **Heart rate needs a sensor.** "Collecting heart rate data on iPhone or iPad
  requires pairing with an external heart rate sensor because these devices
  don’t have one." ([hk-workout])
- **Sharing health data.** "You must not disclose any information gained
  through HealthKit to a third party without express permission from the
  user. Even with permission, you can only share information to a third party
  if they also provide a health or fitness service to the user." ([hk-privacy])
- Synthesis: motion activity and step counts can become Jev state, but
  HealthKit-derived text can't go to TypeSafe, which provides no health or
  fitness service to the user.

[cm-raw]: https://developer.apple.com/documentation/coremotion/getting-raw-accelerometer-events
[cm-manager]: https://developer.apple.com/documentation/coremotion/cmmotionmanager
[cm-activity]: https://developer.apple.com/documentation/coremotion/cmmotionactivitymanager
[cm-headphone]: https://developer.apple.com/documentation/coremotion/cmheadphonemotionmanager
[hk-privacy]: https://developer.apple.com/documentation/healthkit/protecting-user-privacy

## System surfaces on iPhone

Apple's documentation, WWDC26 sessions, and the Newsroom own these facts.

### App Intents, Siri, and Visual Intelligence

- **Visual Intelligence.** An app answers visual searches through an
  `IntentValueQuery` over a `SemanticContentDescriptor`, whose "Labels are
  general, high-level terms in the `en_US` locale and might change over
  time." "Your app can’t contain more than one IntentValueQuery that takes a
  SemanticContentDescriptor." ([vi-integrate]) The framework dates from iOS 26
  ([vi-framework]). In iOS 27, "This year, Visual
  Intelligence is also available on iPadOS and macOS." ([wwdc26-297])
- **Siri in iOS 27.** "In the 27 releases, Siri is more capable, more
  contextual, and more personal. And App Intents are the foundation that make
  that possible." ([wwdc26-240]) "Onscreen awareness is how your app connects
  what's visible on screen to structured information and actions the system
  understands." ([wwdc26-343])
- **Siri AI rollout.** Siri AI "is now rolling out as a beta in English, with
  support for French, Japanese, Korean, Portuguese, and Spanish coming in
  October", and "Siri AI will not be available initially in the EU in iOS,
  iPadOS, and watchOS." ([nr-ios27])
- **App Shortcuts.** They "are available as soon as someone installs your
  app" ([app-shortcuts]).
- **Entitlements.** The Siri entitlement is for "Intents app extensions that
  handle any Siri requests other than shortcut requests" ([siri-entitlement]),
  and Apple's capability table lists Siri as paid-only ([apple-capabilities]).
- Synthesis: a Visual Intelligence query hands the app English labels, which
  are text Jev can judge, for example to pick which of the app's items
  matches.

[vi-integrate]: https://developer.apple.com/documentation/visualintelligence/integrating-your-app-with-visual-intelligence
[vi-framework]: https://developer.apple.com/documentation/visualintelligence
[wwdc26-297]: https://developer.apple.com/videos/play/wwdc2026/297/
[wwdc26-240]: https://developer.apple.com/videos/play/wwdc2026/240/
[wwdc26-343]: https://developer.apple.com/videos/play/wwdc2026/343/
[app-shortcuts]: https://developer.apple.com/documentation/appintents/app-shortcuts
[siri-entitlement]: https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.siri

### Live Activities

- **Versions.** ActivityKit dates from iOS 16.1 ([activitykit]).
- **Where they show.** "On iPad and iPhone, it appears on the Lock Screen, in
  the Dynamic Island, and on the Home Screen", and also on Apple Watch, the
  Mac, and CarPlay, but "visionOS doesn’t support Live Activities."
  ([activitykit])
- **Limits.** "A Live Activity can be active for up to eight hours", stays on
  the Lock Screen for "a maximum of 12 hours", its data "can’t exceed a
  combined size of 4 KB", and "it can’t access the network or receive location
  updates" ([la-display]).
- **Push updates.** "The system allows for a certain budget of ActivityKit
  push notifications per hour." "You can’t use broadcast push notifications
  to start a Live Activity." ([la-push])
- **Simulator.** "Run your app in Simulator or on a test device and start a
  Live Activity." To test pushes there, "use a Mac with the Apple T2 Security
  Chip or a Mac with Apple silicon that runs macOS 13 or later." ([la-push])
- **iOS 27.** "in iOS 27, Live Activities are visible in the Dynamic Island,
  when in portrait and landscape" ([wwdc26-223]).
- Synthesis: the latest Jev decision can sit on the Lock Screen through local
  updates while the app runs; server-pushed updates need APNs, which needs
  the paid program.

[activitykit]: https://developer.apple.com/documentation/activitykit
[la-display]: https://developer.apple.com/documentation/activitykit/displaying-live-data-with-live-activities
[wwdc26-223]: https://developer.apple.com/videos/play/wwdc2026/223/

## Android equivalents

Google's Android and ML Kit pages own these facts. Google documents them for
Kotlin and Java only; React Native reaches them through community modules.

### Gemini Nano through the ML Kit GenAI APIs

- **Runtime.** "Gemini Nano runs in Android's AICore system service, which
  leverages device hardware to enable low inference latency and keeps the
  model up-to-date." ([android-nano])
- **APIs.** Summarization, proofreading, rewriting, image description
  ("Generate a short description of a given image."), speech recognition, and
  a Prompt API to "Generate text content based on a custom text-only or
  multimodal prompt." ([mlkit-genai])
- **Prompt API.** "This API is offered in beta, and is not subject to any SLA
  or deprecation policy." It "accepts either a text input or a combined image
  and text input, and emits text output or structured output."
  ([mlkit-prompt]) "Input must be under 4000 tokens (or approximately 3000
  English words)." ([mlkit-prompt-start]) Structured output "Works in Kotlin
  only." ([mlkit-structured])
- **Latency.** The only figures are for prefix caching on a Pixel 9, where a
  300-token prefix with a 50-token suffix went from "0.82 seconds" to "0.45
  seconds" ([mlkit-prefix]).
- **Devices.** The Prompt API runs on the Pixel 9, 10, and 11 families, the
  Galaxy S26 family, and other named phones, grouped by Gemini Nano version;
  no Pixel 8 or older model is listed ([mlkit-genai]).
- **Quotas.** "AICore enforces an inference quota per app. Making too many
  GenAI API requests in a short period will result in an ErrorCode.BUSY
  response." "GenAI API inference is permitted only when the app is the top
  foreground application." ([mlkit-genai])
- **Terms.** "You must be 18 years of age or older to use the APIs.", and
  apps may not be "directed towards or is likely to be accessed by individuals
  under the age of 18" ([mlkit-genai-terms]).
- Synthesis: the age terms matter for Next Gen, which admits students from 13
  ([sp-next-gen]); a team member under 18 can't accept them.

[android-nano]: https://developer.android.com/ai/gemini-nano
[mlkit-prompt-start]: https://developers.google.com/ml-kit/genai/prompt/android/get-started
[mlkit-structured]: https://developers.google.com/ml-kit/genai/prompt/android/structured-output
[mlkit-prefix]: https://developers.google.com/ml-kit/genai/prompt/android/prefix-caching

### Speech and vision on Android

- **Platform speech.** `createOnDeviceSpeechRecognizer` was "Added in API
  level 31", while the class warns: "The implementation of this API is likely
  to stream audio to remote servers to perform speech recognition. As such
  this API is not intended to be used for continuous recognition"
  ([android-speech]).
- **ML Kit GenAI speech.** It is "offered in alpha". Basic mode is "Generally
  available on most Android devices with API level 31 and higher", and
  Advanced mode is "Available on Pixel 10 and Pixel 11 devices"
  ([mlkit-speech]).
- **Text.** Text recognition v2 "can recognize text in any Chinese,
  Devanagari, Japanese, Korean and Latin character set" ([mlkit-text-v2]) and
  runs "Real-time on most devices for Latin script library, slower for
  others." ([mlkit-text])
- **Pose.** Pose detection gives a "full-body 33 point skeletal match" at "~30
  and ~45 fps respectively" on "modern phones like the Pixel 4 and iPhone X"
  ([mlkit-pose]).
- **Objects.** Given an image, "it detects up to five objects in the image
  along with the position of each object in the image." ([mlkit-objects])
- **Firebase hybrid.** Firebase AI Logic's hybrid mode is "an Experimental
  feature", and "On-device inference only supports single-turn text
  generation (not chat)" ([fb-hybrid]).

[android-speech]: https://developer.android.com/reference/android/speech/SpeechRecognizer
[mlkit-text-v2]: https://developers.google.com/ml-kit/vision/text-recognition/v2
[mlkit-text]: https://developers.google.com/ml-kit/vision/text-recognition/v2/android
[mlkit-pose]: https://developers.google.com/ml-kit/vision/pose-detection
[mlkit-objects]: https://developers.google.com/ml-kit/vision/object-detection/android
[fb-hybrid]: https://firebase.google.com/docs/ai-logic/hybrid/android/get-started

## Expo and React Native access

Expo's docs and changelog, the npm registry, and each library's repository own
these facts. Versions and dates are the npm registry's.

### Expo SDK 57, SDK 58, and Xcode 27

- **The iOS 27 launch rule.** "Apps built with the iOS 27 SDK must use the
  UIKit scene-based life cycle, or they do not launch correctly on iOS 27."
  "On SDK 57, expo@57.0.23 adds opt-in scene support, enabled with the
  ios.enableSceneSupport property of expo-build-properties" ([expo-sdk57]).
- **The opt-in.** It lets you "Adopt the UIKit scene lifecycle in an Expo SDK
  57 iOS project, as required by the iOS 27 SDK (Xcode 27)", and "Only the
  standard SDK 57 Swift AppDelegate template is supported."
  ([expo-build-props]) Expo's guide: "If you need to build with Xcode 27 and
  the iOS 27 SDK before upgrading to SDK 58, opt in with the
  `ios.enableSceneSupport` property" ([expo-fyi-scene]).
- **No Xcode 27 on EAS yet.** "EAS Build images with Xcode 27 and with the SDK
  58 toolchain are coming soon", and "Until then, the `latest` EAS Build image
  ships Xcode 26.6." ([expo-sdk58]) The newest image listed carries "Xcode 26.6
  (17F113)" ([eas-infra]).
- **SDK 58's timing.** "React Native 0.88 has not been released yet, so the
  beta uses the release candidate. We will move to the stable release when
  React Native 0.88 ships, and release SDK 58 shortly after." ([expo-sdk58])
- Synthesis: to call an iOS 27-only API such as image input from Expo before
  September 30, build locally with Xcode 27, either on SDK 57.0.23 or later
  with the opt-in or on the SDK 58 beta. Cloud builds on EAS still use the
  iOS 26 SDK.

[expo-build-props]: https://docs.expo.dev/versions/latest/sdk/build-properties/
[expo-fyi-scene]: https://github.com/expo/fyi/blob/main/ios-scene-lifecycle.md

### Speech, camera, and model modules

| Package                               | Latest, published            | What it gives                                          | Limits                                | Sources                               |
| ------------------------------------- | ---------------------------- | ------------------------------------------------------ | ------------------------------------- | ------------------------------------- |
| `expo-speech-recognition`             | 57.1.0, September 16         | `SFSpeechRecognizer` and Android `SpeechRecognizer`    | Development build                     | [npm-expo-speech]; [gh-expo-speech]   |
| `react-native-vision-camera`          | 5.2.3, August 20             | Camera with synchronous frame output on worklets       | Development build                     | [npm-visioncamera]; [vc-frame-output] |
| `react-native-vision-camera-ocr-plus` | 2.0.6, August 20             | Text recognition for VisionCamera 5                    | VisionCamera 5                        | [npm-vc-ocr]                          |
| `expo-camera`                         | 57.0.5, September 11         | Photos, video, and barcode scanning                    | No frame processing, per VisionCamera | [npm-expo-camera]; [vc-vs-expo]       |
| `react-native-fast-tflite`            | 3.0.1, April 21              | TensorFlow Lite models with GPU delegates              | Development build                     | [npm-fast-tflite]; [gh-fast-tflite]   |
| `@react-native-ai/apple`              | 0.12.0, January 28           | Foundation Models text, tools, and file transcription  | iOS 26, New Architecture              | [npm-rn-ai-apple]; [gh-rn-ai-apple]   |
| `react-native-executorch`             | 0.10.2, September 11         | Local LLMs, Whisper, OCR, detection, and pose          | iOS 17, Android 13, New Architecture  | [npm-executorch]; [gh-executorch]     |
| `expo-sensors`                        | 57.0.3, September 11         | Accelerometer, gyroscope, device motion, and pedometer | Works in Expo Go                      | [npm-expo-sensors]; [expo-sensors]    |
| `expo-widgets`                        | 57.0.20, September 18        | Widgets and Live Activities in Expo UI                 | iOS only on SDK 57; not in Expo Go    | [npm-expo-widgets]; [expo-widgets]    |
| `@use-voltra/ios-client`              | 2.3.1, September 16          | Live Activities and widgets from React components      | Not in Expo Go                        | [npm-voltra]; [gh-voltra]             |
| `@bacons/apple-targets`               | 5.0.0, July 17               | Config plugin for widget and other Apple targets       | Needs prebuild                        | [npm-apple-targets]                   |
| `@kingstinct/react-native-healthkit`  | 16.0.0, September 18         | HealthKit                                              | Not in Expo Go                        | [npm-rn-healthkit]; [gh-rn-healthkit] |
| `expo-app-intents`                    | 0.4.2 (`next`), September 21 | App Intents for Siri and Shortcuts                     | Alpha, SDK 58 beta                    | [npm-expo-app-intents]                |

- **Speech.** `expo-speech-recognition` "implements the iOS
  `SFSpeechRecognizer`, Android `SpeechRecognizer` and Web
  `SpeechRecognition`" ([gh-expo-speech]); its code doesn't call
  `SpeechAnalyzer`. Expo's own Speech module is "A library that provides
  access to text-to-speech functionality." ([expo-speech])
- **Camera frames.** VisionCamera's frame output "requires
  react-native-vision-camera-worklets (and react-native-worklets) to be
  installed to synchronously run the `onFrame(...)` function on a parallel JS
  Worklet Runtime." ([vc-frame-output]) "VisionCamera is a third-party native
  package and runs in an Expo Development Build (`expo prebuild`), or in a
  bare React Native app." ([vc-vs-expo]) "As VisionCamera V5 is released,
  VisionCamera V4 is no longer actively maintained." ([gh-visioncamera])
- **Apple's model from JavaScript.** `@react-native-ai/apple` needs "iOS 26+",
  an "Apple Intelligence enabled device", and the "React Native New
  Architecture" ([gh-rn-ai-apple]), and "Streaming objects is currently not
  supported" ([gh-rn-ai-generating]). Its transcription "uses Apple's
  `SpeechAnalyzer` and `SpeechTranscriber`", but "The API currently does not
  support streaming or live transcription." ([gh-rn-ai-transcription])
- **Models in JavaScript.** ExecuTorch needs "React Native 0.83+ or Expo SDK
  55+ with Development Builds (Expo Go is not supported due to custom C++
  native libraries)" ([gh-executorch]), and its docs offer to "Run real-time
  on-device computer vision models on live camera feeds using VisionCamera v5
  and ExecuTorch synchronous worklets." ([executorch-docs])
- **Sensors.** "Starting in Android 12 (API level 31), the system has a 200Hz
  limit for each sensor updates." ([expo-sensors])
- **Haptics.** `expo-haptics` is covered in the
  [iOS design notes][design-haptics]; for patterns, Expo now says: "For more
  advanced control over haptics, we recommend Pulsar haptics SDK."
  ([expo-haptics])
- **Live Activities.** `expo-widgets` is "A library to build iOS home screen
  widgets and Live Activities using Expo UI components." "When
  `enablePushNotifications` is `true`, you can update Live Activities
  remotely from your server through Apple Push Notification service (APNs)"
  ([expo-widgets]). The older `expo-live-activity` says: "This library is
  deprecated. Consider other solutions like expo-widgets"
  ([gh-expo-live-activity]).
- **Maintenance.** The `callstackincubator/ai` repository behind
  `@react-native-ai/apple` was last committed to on July 7, 2026, while
  VisionCamera's repository was pushed September 14, ExecuTorch's September
  21, and `expo-speech-recognition` released v57.1.0 on September 16
  ([gh-rn-ai]; [gh-visioncamera]; [gh-executorch]; [gh-expo-speech]).
- **Other Live Activity modules.** Voltra "turns React Native JSX into SwiftUI
  and Jetpack Compose Glance", supports "ActivityKit push tokens (iOS)", and
  "The library isn't supported in Expo Go." ([gh-voltra])
- Synthesis: no maintained module streams `SpeechTranscriber` live or passes
  images to Foundation Models, so those need a local module or a Swift app.

[npm-expo-speech]: https://registry.npmjs.org/expo-speech-recognition
[gh-expo-speech]: https://github.com/jamsch/expo-speech-recognition
[npm-visioncamera]: https://registry.npmjs.org/react-native-vision-camera
[vc-frame-output]: https://visioncamera.margelo.com/docs/frame-output
[npm-vc-ocr]: https://registry.npmjs.org/react-native-vision-camera-ocr-plus
[npm-expo-camera]: https://registry.npmjs.org/expo-camera
[vc-vs-expo]: https://visioncamera.margelo.com/docs/visioncamera-vs-expo-camera
[npm-fast-tflite]: https://registry.npmjs.org/react-native-fast-tflite
[gh-fast-tflite]: https://github.com/margelo/react-native-fast-tflite
[npm-rn-ai-apple]: https://registry.npmjs.org/@react-native-ai/apple
[npm-executorch]: https://registry.npmjs.org/react-native-executorch
[gh-executorch]: https://github.com/software-mansion/react-native-executorch
[npm-expo-sensors]: https://registry.npmjs.org/expo-sensors
[expo-sensors]: https://docs.expo.dev/versions/latest/sdk/sensors/
[npm-expo-widgets]: https://registry.npmjs.org/expo-widgets
[expo-widgets]: https://docs.expo.dev/versions/latest/sdk/widgets/
[npm-voltra]: https://registry.npmjs.org/@use-voltra/ios-client
[gh-voltra]: https://github.com/callstackincubator/voltra
[npm-apple-targets]: https://registry.npmjs.org/@bacons/apple-targets
[npm-rn-healthkit]: https://registry.npmjs.org/@kingstinct/react-native-healthkit
[gh-rn-healthkit]: https://github.com/kingstinct/react-native-healthkit
[npm-expo-app-intents]: https://registry.npmjs.org/expo-app-intents
[expo-speech]: https://docs.expo.dev/versions/latest/sdk/speech/
[gh-visioncamera]: https://github.com/margelo/react-native-vision-camera
[gh-rn-ai-generating]: https://github.com/callstackincubator/ai/blob/main/website/src/docs/apple/generating.md
[gh-rn-ai-transcription]: https://github.com/callstackincubator/ai/blob/main/website/src/docs/apple/transcription.md
[executorch-docs]: https://docs.swmansion.com/react-native-executorch/llms.txt
[design-haptics]: /docs/research/ios-design.md#haptics-in-expo
[expo-haptics]: https://docs.expo.dev/versions/latest/sdk/haptics/
[gh-expo-live-activity]: https://github.com/software-mansion-labs/expo-live-activity
[gh-rn-ai]: https://github.com/callstackincubator/ai

### Writing a Swift bridge with Expo Modules

- **What it is.** The Expo Modules API "allows you to write Swift and Kotlin to
  add new capabilities to your app with native modules and views."
  ([expo-modules])
- **Creating one.** `npx create-expo-module@latest --local` is "the
  recommended way to create a local Expo module", and every native change
  needs a new build ([expo-modules-start]).
- **Building blocks.** `Function` "Defines a native synchronous function",
  `Events` "Defines event names that the module can send to JavaScript", and
  `View` "Enables the module to be used as a native view."
  ([expo-module-api])
- Synthesis: a local module that starts `SpeechTranscriber` and emits each
  finished phrase as an event, or wraps a Foundation Models session, is a
  small Swift file, but it needs Xcode, a development build, and, for iOS 27
  APIs, the Xcode 27 path above.

[expo-modules]: https://docs.expo.dev/modules/overview/
[expo-modules-start]: https://docs.expo.dev/modules/get-started/
[expo-module-api]: https://docs.expo.dev/modules/module-api/

### Expo Go and development builds

- **Expo Go.** "Expo Go is a pre-built native app that works like a playground
  — it can't be changed after you install it." ([expo-dev-faq]) The App Store
  build "now supports projects running on Expo SDK 57" ([expo-go-57]).
- **What it can't run.** "To add new native libraries ... you need to build
  your own native app (a development build)." ([expo-dev-faq]) In the table
  above, only `expo-camera` and `expo-sensors` run in Expo Go; the
  [RevenueCat notes][rc-dev-builds] cover the same rule for purchases.
- **Signing.** A local build is "the only way to install a development build
  on an iPhone without a paid Apple Developer account", and on EAS, "All
  builds that run on an iPhone device require a paid Apple Developer account
  for build signing." ([expo-dev-builds]) Simulator builds need none:
  "without needing to deploy to TestFlight or even having an Apple Developer
  account" ([expo-sim-builds]).

[expo-dev-faq]: https://docs.expo.dev/develop/development-builds/faq/
[expo-go-57]: https://expo.dev/changelog/expo-go-57-login
[rc-dev-builds]: /docs/research/revenuecat-expo.md#development-builds-expo-go-and-preview-api-mode

## Real-time backends on Cloudflare

Workers plans and prices, Durable Object storage, input and output gates,
location hints, hibernation timing, and placement are in the
[Cloudflare notes][cf-notes]; this section adds what a live loop needs:
WebSockets, speech-to-text, and embeddings. Cloudflare's docs own these facts.

### WebSockets on a hibernating Durable Object

- **Server role.** Durable Objects "can act as WebSocket servers that connect
  thousands of clients per instance" ([cf-do-ws]).
- **Hibernation.** "Clients remain connected while the Durable Object is not
  in memory", "Billable Duration (GB-s) charges do not accrue during
  hibernation", and "When a message arrives, the Durable Object wakes up
  automatically"; "In-memory state is reset" ([cf-do-ws]). An object can't
  hibernate while it has an "in-progress awaited `fetch()`"
  ([cf-do-lifecycle]).
- **Batching.** For "high-frequency data like sensor readings or game state
  updates", the page advises: "Batch every 50-100ms or every 50-100 messages,
  whichever comes first." ([cf-do-ws])
- **Outgoing sockets.** "Hibernation is only supported when a Durable Object
  acts as a WebSocket server. Outgoing WebSockets do not hibernate."
  ([cf-do-ws])
- **Limits.** "The WebSocket Hibernation API permits a maximum of 32,768
  WebSocket connections per Durable Object", and auto-responses are "limited
  to 2,048 characters each" ([cf-do-state]). A received message may be "32
  MiB", and "Each incoming HTTP request or WebSocket message resets the
  remaining available CPU time to 30 seconds" ([cf-do-limits]). A socket's
  attachment has a "Maximum serialized size is 16,384 bytes" ([cf-do-ws]).
- **Billing.** "A request is needed to create a WebSocket connection. There is
  no charge for outgoing WebSocket messages", and "a 20:1 ratio is applied to
  incoming WebSocket messages" ([cf-do-pricing]).
- **Restarts.** "When Cloudflare releases new code to its global network, we
  may restart servers, which terminates WebSockets connections"
  ([cf-network-ws]).
- Synthesis: the phone keeps one WebSocket to a per-session object, sends each
  new text state on it, and the object calls Jev with `fetch` and answers on
  the same socket. The object stays awake only while that call is in flight,
  and Paid's included million requests cover about 20 million incoming
  messages a month. The app must reconnect after deploys.

[cf-do-ws]: https://developers.cloudflare.com/durable-objects/best-practices/websockets/
[cf-do-lifecycle]: https://developers.cloudflare.com/durable-objects/concepts/durable-object-lifecycle/
[cf-do-state]: https://developers.cloudflare.com/durable-objects/api/state/
[cf-do-limits]: https://developers.cloudflare.com/durable-objects/platform/limits/
[cf-do-pricing]: https://developers.cloudflare.com/durable-objects/platform/pricing/
[cf-network-ws]: https://developers.cloudflare.com/network/websockets/

### Agents SDK, voice, and Realtime

- **Agents SDK.** `agents` 0.24.0 was published September 18, 2026
  ([npm-agents]). Its client runs on "any JavaScript runtime — browsers,
  Node.js, Deno, Bun, or edge functions" and offers `useAgent`, a "React hook
  with automatic reconnection and state management" ([cf-agents-client]).
  State "Changes are broadcast to all connected WebSocket clients instantly"
  ([cf-agents-state]), and "Hibernation is enabled by default"
  ([cf-agents-ws]). No Agents page names React Native or Expo.
- **Voice.** `@cloudflare/voice`, marked "Beta", streams audio "over
  WebSocket — no SFU or meeting infrastructure required" as "binary WebSocket
  frames (16kHz mono 16-bit PCM)", and its client's default input is the
  "built-in AudioWorklet" ([cf-voice]).
- **Realtime.** RealtimeKit's React Native Core 2.0.0 "Requires React Native
  0.84 or above" and "Expo 56 or above" ([cf-rtk-rn]).
- Synthesis: React Native has no AudioWorklet, so streaming phone audio to
  `@cloudflare/voice` needs a native PCM capture module; transcribing on the
  phone and sending text avoids that.

[npm-agents]: https://registry.npmjs.org/agents
[cf-agents-state]: https://developers.cloudflare.com/agents/runtime/lifecycle/state/
[cf-agents-ws]: https://developers.cloudflare.com/agents/runtime/communication/websockets/
[cf-rtk-rn]: https://developers.cloudflare.com/realtime/realtimekit/release-notes/react-native-core/

### Workers AI speech-to-text

| Model                                                   | Input                             | Live streaming                          | Price per audio minute                                           |
| ------------------------------------------------------- | --------------------------------- | --------------------------------------- | ---------------------------------------------------------------- |
| [`@cf/openai/whisper`][cf-whisper]                      | Audio bytes                       | No                                      | "$0.000453 per audio minute"                                     |
| [`@cf/openai/whisper-large-v3-turbo`][cf-whisper-turbo] | Base64 audio                      | No                                      | "$0.000513 per audio minute"                                     |
| [`@cf/deepgram/nova-3`][cf-nova-3]                      | Eight encodings, linear16 to g729 | HTTP or WebSocket                       | "$0.0052 per audio minute, $0.0092 per audio minute (websocket)" |
| [`@cf/deepgram/flux`][cf-flux]                          | 16-bit PCM only                   | WebSocket only, with end-of-turn events | "$0.0077 per audio minute (websocket)"                           |

- **Flux.** It is "WebSocket only as it requires live bi-directional streaming
  in order to recognize speech activity" ([cf-flux-changelog]).
- **Rate limit.** Speech recognition models allow "720 requests per minute"
  ([cf-ai-limits]).

[cf-whisper-turbo]: https://developers.cloudflare.com/workers-ai/models/whisper-large-v3-turbo/
[cf-nova-3]: https://developers.cloudflare.com/workers-ai/models/nova-3/
[cf-flux]: https://developers.cloudflare.com/workers-ai/models/flux/
[cf-flux-changelog]: https://developers.cloudflare.com/changelog/post/2025-10-02-deepgram-flux/

### Workers AI embeddings and Vectorize

| Model                                             | Dimensions | Input limit   | Price                        |
| ------------------------------------------------- | ---------- | ------------- | ---------------------------- |
| [`@cf/baai/bge-small-en-v1.5`][cf-bge-small]      | 384        | 512 tokens    | "$0.0202 per M input tokens" |
| [`@cf/baai/bge-base-en-v1.5`][cf-bge-base]        | 768        | 512 tokens    | "$0.0666 per M input tokens" |
| [`@cf/baai/bge-m3`][cf-bge-m3]                    | Not stated | 60,000 tokens | "$0.0118 per M input tokens" |
| [`@cf/qwen/qwen3-embedding-0.6b`][cf-qwen3-embed] | Not stated | 8,192 tokens  | "$0.0118 per M input tokens" |

- **Rate limit.** Text embeddings allow "3000 requests per minute"
  ([cf-ai-limits]).
- **Vectorize.** An index holds up to "20,000,000" vectors of up to "1536
  dimensions" ([cf-vectorize-limits]).

[cf-bge-small]: https://developers.cloudflare.com/workers-ai/models/bge-small-en-v1.5/
[cf-bge-base]: https://developers.cloudflare.com/workers-ai/models/bge-base-en-v1.5/
[cf-bge-m3]: https://developers.cloudflare.com/workers-ai/models/bge-m3/
[cf-qwen3-embed]: https://developers.cloudflare.com/workers-ai/models/qwen3-embedding-0.6b/
[cf-vectorize-limits]: https://developers.cloudflare.com/vectorize/platform/limits/

### Workers AI prices and limits

- **Neurons.** "$0.011 per 1,000 Neurons", with "10,000 Neurons per day at no
  charge"; "All limits reset daily at 00:00 UTC" ([cf-ai-pricing]).
- **Where models run.** On "serverless GPUs, on Cloudflare's global network"
  ([cf-ai]); no page gives a speech latency figure.
- Synthesis: the free daily Neurons cover about 14 minutes of Flux audio,
  and Flux costs about $0.46 per hour of audio. Transcribing on the phone and
  sending text costs nothing per minute.

[cf-ai]: https://developers.cloudflare.com/workers-ai/

## How Jev pairs with phone perception

TypeSafe's docs own the Jev facts here; the API, SDKs, prices, and terms are in
the [Jev notes][jev-notes], so this section keeps only what bears on a loop
that turns camera, microphone, or sensor input into decisions.

### Jev reads text, so perception must become text first

- **Text only.** The Models page lists Jev's input as "Text only. String, JSON
  object, or array of text values. No image, audio, or video input." and says:
  "Pre-process non-text inputs (images, audio, video, binaries) into text or
  structured fields before sending them as `state`." ([ts-models])
- **State can be the app's state.** State "could be a support message, a
  passage of text, or the current state of your application" ([ts-state]).
- **No generated text.** "System One models do not write replies, produce
  code, or generate explanations of their reasoning." ([ts-system-one])
- **Games run on text state.** The launch post's Doom bot "is on structured
  state as a data structure with text, not on images (yet…)"
  ([ts-blog-launch]).
- Synthesis: each perception source in this note ends in text or JSON that
  can be Jev's `state`: a transcript from `SpeechTranscriber`, recognized text
  or joint names from Vision, a sound label from Sound Analysis, an activity
  from Core Motion, or a description from the Foundation Models image input.
  Jev then judges that text; it never sees the pixels or the audio.

[ts-state]: https://docs.typesafe.ai/concepts/state
[ts-system-one]: https://docs.typesafe.ai/concepts/system-one

### Fan-out, confidence gates, and intent routing

- **Speculative fan-out.** "we recommend putting all of the questions your
  system needs in a single request, and then using code to decide what is
  relevant after the fact. All questions are evaluated in parallel, so adding
  more questions usually has little effect on response time." "Speculative
  questions are ignored when irrelevant and save a round trip when they are
  not." ([ts-fan-out])
- **Confidence-gated routing.** In the voice banking example, "The 0.6 floor
  catches anything the model is genuinely uncertain about. Above that floor,
  each action type has its own threshold based on the consequences of acting
  on a wrong classification." Approving a transfer "requires very high
  confidence (>0.85), otherwise the system should ask the user to confirm."
  ([ts-confidence-routing])
- **Intent routing.** "TypeSafe can sit in front of all of these as a fast,
  cheap classifier that determines which handler to invoke." In the example,
  "One intent routes to deterministic code with no LLM involved."
  ([ts-intent])
- **Pairing with a generative model.** The smart home demo uses a Noul to
  spot compound requests, and "If this is true, the system uses an LLM to
  split the request into a list of atomic commands." "The initial TypeSafe
  response is so fast compared to the LLM response that it adds negligible
  latency to the overall system." ([ts-smart-home])

[ts-fan-out]: https://docs.typesafe.ai/patterns/fan-out
[ts-intent]: https://docs.typesafe.ai/patterns/intent-routing
[ts-smart-home]: https://docs.typesafe.ai/demos/smart-home

### Jev's real-time claims and limits

- **Real time.** "Frontier intelligence at real-time speeds (150ms) means AI
  can make decisions faster than human perception. Fast and smart enough to be
  programmed to play games or embedded into a UI." ([ts-use-cases])
- **Latency.** "Most queries complete in about 100 ms. System One is fast
  enough for real-time request paths and user interfaces." ([ts-build]) The
  launch post says "End-to-end response time is 70ms-500ms for TypeSafe"
  ([ts-blog-launch]).
- **A game loop's rate and cost.** The Doom bot made "10 queries a second
  (which ends up costing ~$7/hour)" ([ts-blog-launch]).
- **Rate limits.** "250,000 tokens per second / 1,200 requests per minute",
  and "Rate limits are adjusting dynamically." ([ts-models])
- **Context length.** "64k tokens per request; 32k tokens for `state` plus the
  longest question" ([ts-models]).
- **Language.** "English is the primary training language and where accuracy
  is currently best." ([ts-models])
- **One request, one response.** The API reference documents a single
  `POST /v1/systemone` call per evaluation, retried with "exponential
  backoff" on `429` and `529` ([ts-api]); no page in the docs index describes
  a streaming or WebSocket interface ([ts-llms]).
- **Where it runs.** TypeSafe's service "is currently based" on the West
  Coast ([ts-blog-launch]); the measured placement is in the
  [Cloudflare notes][cf-latency].

[ts-build]: https://docs.typesafe.ai/concepts/how-to-build-with-system-one
[ts-api]: https://docs.typesafe.ai/api
[cf-latency]: /docs/research/cloudflare-workers.md#latency-and-placement

### Pairings the sources suggest

- Synthesis: a perception loop has three hops. The phone turns input into text
  on the device, sends it to the team's backend, and the backend calls Jev in
  the United States. Only the last hop is Jev's quoted 100 to 150 ms.
- Synthesis: 1,200 requests per minute is 20 a second. At the Doom bot's 10
  queries a second, two players at once would use the whole limit, so a live
  loop should call Jev on events (a finished utterance, a new recognized
  object, a changed pose) with every question in one request, not on every
  camera frame or partial transcript.
- Synthesis: Jev can't write text, and the on-device Foundation Models model
  can. One pairing is the model writing or describing and Jev checking,
  scoring, or routing what it wrote, which matches TypeSafe's "Universal
  Verification" category ([ts-use-cases]).
- Synthesis: confidence gates map onto phone UI. A high-confidence answer
  acts at once, a middling one asks the user to confirm, and a low one falls
  back to a manual control, as in the voice banking example
  ([ts-confidence-routing]).
- Synthesis: keep the Jev key on the server. The Next Gen entry is a public
  repository, and Expo inlines public environment variables into the app (see
  [Public environment variables][rc-public-env]). The JS SDK's browser guard
  tests for `window.document` ([gh-js-runtime]), which a React Native app
  doesn't define, so the guard won't stop a key shipped in an app.

[rc-public-env]: /docs/research/revenuecat-expo.md#public-environment-variables
[gh-js-runtime]: https://github.com/typesafe-ai/typesafe-sdk-js/blob/v0.6.0/src/runtime.ts

## Accounts, entitlements, and devices for an eight-day build

The Next Gen page, Apple's account help, and Expo's docs own these facts.

### Apple accounts for a student team

- **Next Gen needs no store.** "Unlike most Shipaton categories, this one does
  not require a paid Apple or Google developer account, and no App Store or
  Google Play release is required." ([shipaton-next-gen])
- **The free agreement.** Apple's capability table defines its free column
  this way: "No cost is associated with this agreement and developers can’t
  distribute apps" ([apple-capabilities]). In it, HealthKit, App Groups, and
  Background Modes are open to free accounts, while Push Notifications, Siri,
  In-App Purchase, iCloud, and Sign in with Apple need a paid membership.
- **Personal Team limits.** "You can register up to 10 App IDs, which expire
  after 7 days." "You can register up to 3 devices" and "You can install up to
  3 apps per device." ([apple-account-basics])
- **Running on a phone.** Xcode lets you "sign in with your Apple Developer
  Program or personal Apple Account" to run on a device ([xcode-run]).
- **Purchases without a store.** RevenueCat's Test Store runs purchases with no
  store account; see the [related materials notes][rm-test-store].
- Synthesis: a team with no paid membership can still demo on its own
  iPhones by building locally with Xcode, reinstalling at least weekly, and
  using the Test Store for purchases. It can't use push-updated Live
  Activities, Siri extensions, TestFlight, or Private Cloud Compute.

[shipaton-next-gen]: https://www.shipaton.com/categories/next-gen-award
[apple-account-basics]: https://developer.apple.com/help/account/basics/about-your-developer-account
[rm-test-store]: /docs/research/related-materials.md#test-store-and-sandbox-testing

### Simulator and hardware limits

- **Xcode.** In a simulator, "some hardware-specific features might not be
  available", and "To test the feature itself, run your code on a physical
  device." ([xcode-run]) A simulator can take the Mac's microphone: "Choose
  System to use the same audio input as the Mac." ([xcode-sim-env])
- **Expo.** Its Simulator guide says "The following hardware is unavailable in
  the Simulator:" and lists audio input, the barometer, the camera, and
  "Motion Support (accelerometer and gyroscope)" ([expo-ios-sim]).
- **Motion permission.** "To access motion and fitness data, include
  NSMotionUsageDescription." ([coremotion])

What each item needs, from the sections above; "Not stated" means no source
covers it:

| Item                                | Paid membership                       | Entitlement or permission             | Device                                        | Simulator                                          |
| ----------------------------------- | ------------------------------------- | ------------------------------------- | --------------------------------------------- | -------------------------------------------------- |
| Foundation Models, on device        | No                                    | None                                  | Apple Intelligence iPhone                     | Runs on an Apple Intelligence Mac [wwdc25-259]     |
| Private Cloud Compute               | Yes [asbp]                            | Managed entitlement [apple-pcc]       | Apple Intelligence device                     | Not stated                                         |
| `SpeechTranscriber`                 | No                                    | Microphone                            | Physical iPhone; hardware rules not listed    | Apple's sample doesn't run [speech-live-sample]    |
| Translation                         | No                                    | None                                  | Physical iPhone                               | Doesn't translate [translation-sample]             |
| Vision requests                     | No                                    | Camera, for live frames               | A14 or later for lens smudges [vision-smudge] | `OCRTool` and `BarcodeReaderTool` unavailable      |
| Sound Analysis                      | No                                    | Microphone                            | Not stated                                    | Not stated                                         |
| Core Motion                         | No                                    | Motion usage description [coremotion] | Motion hardware                               | No motion, per Expo [expo-ios-sim]                 |
| HealthKit                           | No [apple-capabilities]               | HealthKit capability                  | A sensor for heart rate [hk-workout]          | Not stated                                         |
| App Intents and App Shortcuts       | No; the Siri capability is paid       | None                                  | Apple Intelligence for Siri AI                | Not stated                                         |
| Live Activities, local updates      | No                                    | None                                  | Any iPhone                                    | Runs [la-push]                                     |
| Live Activities, push updates       | Yes [apple-capabilities]              | Push Notifications                    | Any iPhone                                    | Needs an Apple silicon or T2 Mac [la-push]         |
| Expo development build on an iPhone | Local: no; EAS: yes [expo-dev-builds] | None                                  | Physical iPhone                               | Simulator builds need no account [expo-sim-builds] |

- Synthesis: plan the demo video on a physical iPhone 15 Pro or newer if the
  idea uses both the on-device model and live perception; with an older
  iPhone, the language model can be filmed in the Simulator and perception on
  the phone.

[coremotion]: https://developer.apple.com/documentation/coremotion

## Conflicts between sources

- **Android's current release.** The Android 17 post says Android 17 (API
  level 37) shipped on June 16, 2026 ([android-17]), while the body of the
  Android releases index still opens with Android 16 ([android-versions]).
- **On-device context size.** The context window article gives "4096 tokens
  per session" ([fm-context]), while the WWDC26 session's code sample prints
  `print(model.contextSize) // 8192` ([wwdc26-241]). No page says which
  devices or model variants get which size.
- **Model languages.** Apple's AFM 3 post evaluates locales it calls "our
  remaining supported global locales", where "AFIHHMPRTU refers to Arabic,
  Finnish, Indonesian, Hebrew, Hindi, Malay, Polish, Russian, Thai, and
  Ukrainian." ([ml-afm3]) None of those ten is among the 16 languages that
  Apple Intelligence lists for users ([nr-ios27]).
- **Simulator audio.** Expo lists "Audio Input" as unavailable in the
  Simulator ([expo-ios-sim]), Xcode lets a simulator use the Mac's microphone
  ([xcode-sim-env]), and the `expo-speech-recognition` maintainer says
  recognition fails on iOS 26.4 simulators but "You can use an older simulator
  (v26.0 / v26.1) which should work okay." ([gh-expo-speech-145])
- **Package minimums.** `@react-native-ai/apple` requires "iOS 26+" as a whole
  ([gh-rn-ai-apple]), while its embeddings page asks only for iOS 17
  ([gh-rn-ai-embeddings]).
- **Workers AI prices.** The pricing page rounds Whisper to "$0.0005" per
  audio minute ([cf-ai-pricing]), while the model page gives "$0.000453 per
  audio minute" ([cf-whisper]).
- **GenAI API stability.** The ML Kit GenAI terms bar services marked
  "Preview" or "Experimental Access" from production ([mlkit-genai-terms]),
  while the APIs are labeled beta or alpha ([mlkit-prompt]; [mlkit-speech]);
  no page says whether those labels count.
- **Jev latency.** The Jev notes list TypeSafe's three figures, "about 100
  ms", "150ms", and "70ms-500ms" ([jev-conflicts]).

[android-versions]: https://developer.android.com/about/versions
[gh-expo-speech-145]: https://github.com/jamsch/expo-speech-recognition/issues/145
[gh-rn-ai-embeddings]: https://github.com/callstackincubator/ai/blob/main/website/src/docs/apple/embeddings.md
[jev-conflicts]: /docs/research/jev.md#conflicts-between-sources

## Gaps

What the sources don't say that a Next Gen team choosing a Jev app needs, as
of September 22, 2026:

- **Model speed.** No AFM 3 token rate or time to first token, and no list of
  iPhones that get the "AFM 3 Core Advanced." variant ([fm-variant]).
- **Speech languages.** `SpeechTranscriber`'s locale list and hardware rules
  exist only at run time ([speech-locales]).
- **Private Cloud Compute.** The daily limit per person and how long an
  entitlement request takes; the request form is behind an Apple Account
  sign-in ([apple-pcc]).
- **Simulator support.** Nothing from Apple on Vision requests other than the
  two tools, Sound Analysis, Core Motion, HealthKit, Visual Intelligence, or
  App Intents in the Simulator.
- **Live Activity budget.** No number for the hourly push budget ([la-push]).
- **Bridges.** No React Native module streams `SpeechTranscriber` live or
  sends images to Foundation Models, Expo ships no Foundation Models module,
  and no VisionCamera 5 pose plugin turned up on npm.
- **Expo timing.** No date for an EAS image with Xcode 27 or for SDK 58
  stable ([expo-sdk58]; [eas-infra]).
- **Android.** Whether Gemini Nano runs in the Android Emulator, and which
  languages the Prompt API supports ([mlkit-genai]; [mlkit-prompt]).
- **Cloudflare.** No page covers React Native or Expo for `agents` or
  `@cloudflare/voice`, or gives Flux's languages or any speech latency
  ([cf-agents-client]; [cf-voice]).
- **Jev.** No streaming interface, no guidance on perception input beyond
  "Pre-process non-text inputs", and no latency figures from outside the
  United States ([ts-models]; [ts-llms]).

[sp-next-gen]: /docs/research/shipaton-2026.md#revenuecat-core-category-requirements
[jev-notes]: /docs/research/jev.md
[cf-notes]: /docs/research/cloudflare-workers.md
[design-notes]: /docs/research/ios-design.md
[android-17]: https://developer.android.com/blog/posts/android-17-is-here
[expo-sdk57]: https://expo.dev/changelog/sdk-57
[nr-ios27]: https://www.apple.com/newsroom/2026/09/major-updates-for-apples-software-platforms-are-now-available/
[expo-sdk58]: https://expo.dev/changelog/sdk-58-beta
[fm-variant]: https://developer.apple.com/documentation/foundationmodels/systemlanguagemodel/variant-swift.struct
[ml-afm3]: https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models
[fm-context]: https://developer.apple.com/documentation/foundationmodels/managing-the-context-window
[wwdc26-241]: https://developer.apple.com/videos/play/wwdc2026/241/
[apple-pcc]: https://developer.apple.com/private-cloud-compute/
[asbp]: https://developer.apple.com/app-store/small-business-program/
[wwdc25-259]: https://developer.apple.com/videos/play/wwdc2025/259/
[speech-locales]: https://developer.apple.com/documentation/speech/speechtranscriber/supportedlocales
[speech-live-sample]: https://developer.apple.com/documentation/speech/recognizing-speech-in-live-audio
[translation-sample]: https://developer.apple.com/documentation/translation/translating-text-within-your-app
[ts-models]: https://docs.typesafe.ai/models
[vision-smudge]: https://developer.apple.com/documentation/vision/detectlenssmudgerequest
[hk-workout]: https://developer.apple.com/documentation/healthkit/hkworkoutsession
[apple-capabilities]: https://developer.apple.com/help/account/reference/supported-capabilities-ios
[la-push]: https://developer.apple.com/documentation/activitykit/starting-and-updating-live-activities-with-activitykit-push-notifications
[mlkit-genai]: https://developers.google.com/ml-kit/genai
[mlkit-prompt]: https://developers.google.com/ml-kit/genai/prompt/android
[mlkit-genai-terms]: https://developers.google.com/ml-kit/genai-terms
[mlkit-speech]: https://developers.google.com/ml-kit/genai/speech-recognition/android
[eas-infra]: https://docs.expo.dev/build-reference/infrastructure/
[gh-rn-ai-apple]: https://github.com/callstackincubator/ai/tree/main/packages/apple-llm
[expo-dev-builds]: https://docs.expo.dev/develop/development-builds/introduction/
[expo-sim-builds]: https://docs.expo.dev/build-reference/simulators/
[cf-agents-client]: https://developers.cloudflare.com/agents/communication-channels/chat/client-sdk/
[cf-voice]: https://developers.cloudflare.com/agents/communication-channels/voice/
[cf-whisper]: https://developers.cloudflare.com/workers-ai/models/whisper/
[cf-ai-limits]: https://developers.cloudflare.com/workers-ai/platform/limits/
[cf-ai-pricing]: https://developers.cloudflare.com/workers-ai/platform/pricing/
[ts-blog-launch]: https://typesafe.ai/blog/introducing-system-one-models-and-jev
[ts-confidence-routing]: https://docs.typesafe.ai/patterns/confidence-routing
[ts-use-cases]: https://docs.typesafe.ai/concepts/use-case-map
[ts-llms]: https://docs.typesafe.ai/llms.txt
[xcode-run]: https://developer.apple.com/documentation/xcode/running-your-app-on-simulated-or-physical-devices
[xcode-sim-env]: https://developer.apple.com/documentation/xcode/configuring-the-environment-of-a-simulated-device
[expo-ios-sim]: https://docs.expo.dev/workflow/ios-simulator/

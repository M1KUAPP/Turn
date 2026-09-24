# Personal Voice implementation plan

> **For agentic workers:** Write failing tests before each change. Issue #42,
> `docs/PRD.md` "Voices", `docs/TRD.md` "The turn-voice module", and
> `docs/DESIGN.md` "Settings" are the spec. TypeScript is tested on Linux; a
> teammate compiles the Swift on a Mac.

**Goal:** Choose and preview a voice, including the user's Personal Voice,
set the speech rate in five steps, and speak every phrase with both.

**Architecture:** A thin `turn-voice` local module, beside `turn-listen`,
asks iOS for Personal Voice and finds it, with the TRD's API. TypeScript owns
everything else, behind ports faked in tests: which voices Settings lists, the
rate steps, what each permission answer shows, saving the choice in the
phone's `setting` table, and handing the voice and rate to `expo-speech` on
every utterance. Settings' Voice row opens `/settings/voice`, as Places opens
`/settings/places`.

**Tech stack:** Expo SDK 57 local modules, Swift, AVFAudio, `expo-speech`,
Expo Router, SQLite, Vitest.

**Spec:** [Issue #42](https://github.com/RevenueCat-M1KU/RevenueCat/issues/42),
[voices](/docs/PRD.md#voices),
[the turn-voice module](/docs/TRD.md#the-turn-voice-module),
[Settings](/docs/DESIGN.md#settings),
[iPhone notes on Personal Voice](/docs/research/0023-turn-ios.md#personal-voice).

## Rules

- **The voice list (VOICE-1).** "System default" first, then the installed
  English voices from `Speech.getAvailableVoicesAsync()` sorted by name, then
  the Personal Voice when authorized and resolved, deduplicated by
  identifier. Apple's novelty voices, whose identifiers start with
  `com.apple.speech.synthesis.voice.`, are English too and are left out.
- **The default.** No saved voice means "System default": speak with no
  identifier, so iOS picks its English voice. A saved voice that no longer
  resolves, such as a deleted Personal Voice, falls back to it and is
  cleared (COMPAT-3).
- **Rate (VOICE-3).** DESIGN's five steps, "Slowest", "Slower", "Normal",
  "Faster", and "Fastest", map to `expo-speech` rates 0.5, 0.75, 1, 1.25, and
  1.5, which it multiplies by Apple's default of 0.5, so iOS speaks at 0.25
  to 0.75. The docs give no numbers; these are the plan's. "Normal" is the
  default. Each step is its own row in Settings' Voice group, one tap each.
- **Personal Voice (VOICE-2).** Tapping the Personal Voice row calls
  `requestPersonalVoice()`. `authorized` with a resolved voice selects it.
  `denied` shows DESIGN's refused note, verbatim: "Turn can't use your
  Personal Voice. In iOS Settings, allow apps to request to use it, then try
  again." `unsupported`, `notDetermined`, or no resolved voice shows the
  unavailable note: "There's no Personal Voice Turn can use on this iPhone.
  If you've made one, allow apps to request to use it in iOS Settings; until
  then, Turn keeps the system voice." Either way the current voice stays.
- **Preview.** Each voice's Preview button says "Hello. This is how I
  sound." in that voice at the chosen rate, stops any speech first
  (SPEAK-2), and counts no tap.
- **Storage.** `voice_id` and `speech_rate` in the `setting` table, as
  `selected_place` is; nothing leaves the phone.

## Task 1: Voice settings

**Files:** `app/src/bank/store.ts`, `app/test/bank.test.ts`,
`app/src/speech/voice-settings.ts`, `app/test/voice-settings.test.ts`.

- [ ] Write failing tests with fakes for each rule above: the list's order,
      filter, and deduplication; the five rates; the default; each
      permission answer and its note; the fallback; and a choice surviving a
      new store on the same database.
- [ ] Add `setting(key): Promise<string | null>` and
      `setSetting(key, value: string | null): Promise<void>` to the store.
- [ ] Implement `createVoiceSettings(ports)` with `voices()`, `selected()`,
      `rate()`, `chooseVoice(id | null)`, `chooseRate(step)`,
      `choosePersonalVoice()`, `refresh()`, and `subscribe(listener)`.
- [ ] Run `rtk bun run --cwd app test -- voice-settings.test.ts` and
      `rtk bun run --cwd app typecheck`.

## Task 2: The turn-voice module

**Files:** `modules/turn-voice/**`.

- [ ] Mirror `modules/turn-listen`'s files. The podspec targets iOS 17, so
      the Personal Voice calls need no availability checks.
- [ ] In Swift, with the TRD's API exactly: `requestPersonalVoice()` awaits
      `AVSpeechSynthesizer.requestPersonalVoiceAuthorization()` and returns
      the status's name; `personalVoice()` returns the first voice with the
      `isPersonalVoice` trait only when authorized and
      `AVSpeechSynthesisVoice(identifier:)` resolves it, else `null`; and
      `onVoicesChanged` fires on `availableVoicesDidChangeNotification`.
- [ ] `src/` exports typed wrappers through `requireOptionalNativeModule`;
      a missing module answers `unsupported` and `null`.

## Task 3: Speaking with the voice and rate

**Files:** `app/src/speech/controller.ts`,
`app/test/speech-controller.test.ts`, `app/src/turn-context.tsx`.

- [ ] Write failing tests: every phrase, Repeat, and preview carry the
      current voice and rate; a preview overrides the voice, counts no tap,
      and stops speech first.
- [ ] Pass `voice` (omitted for the default) and `rate` to `Speech.speak`
      in the provider, which also creates the voice settings and refreshes
      them on `onVoicesChanged`.
- [ ] Run the controller's tests and the app's typecheck.

## Task 4: Settings

**Files:** `app/src/screens/SettingsScreen.tsx`,
`app/src/screens/VoiceScreen.tsx`, `app/src/app/settings/voice.tsx`,
`app/src/app/_layout.tsx`.

- [ ] The Voice row shows the chosen voice's name and opens
      `/settings/voice`: the list, a check on the chosen voice, and a
      Preview button on each row. The five rate rows and the Personal Voice
      row live in Settings' Voice group, with the note under the group.
- [ ] Mirror `PlacesScreen`; follow `docs/DESIGN.md`'s rules that do not
      bend: no opacity on text, no `allowFontScaling={false}`, names equal
      to the visible text, 44-point targets, no drags or long presses.

## Task 5: Handoff

- [ ] Run `rtk graphify update .`, then `rtk bun run test`,
      `rtk bun run typecheck`, and `rtk bun run lint`, and bundle for iOS
      with `expo export:embed`.
- [ ] Commit, and open a draft pull request stacked on `feat/34-name-tags`
      that says the Swift was written without a compiler.
- [ ] Before merge, a teammate builds on a Mac and checks: preview two
      voices (VOICE-1); the slowest and fastest steps sound different
      (VOICE-3); the voice and rate survive a relaunch; in the Simulator,
      Personal Voice shows the unavailable note (VOICE-2); on the iPhone,
      allow and deny each show their result (VOICE-2); and without a
      Personal Voice, phrases speak in the chosen system voice (COMPAT-3).

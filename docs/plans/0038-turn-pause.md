# Listen pause implementation plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` when
> workers are available, or `superpowers:executing-plans`. Write failing
> Vitest tests before implementation. Task 3 is a human visual-design pass.

**Goal:** Make Listen mode pause, resume, stop, and clear its private caption
as specified, with a truthful, accessible listening light.

**Architecture:** The in-memory live session owns pause/resume and expiry.
AppState calls pause; `turn-listen` reuses `onState` for interruption. The Home
screen toggles the same session without revisiting consent.

**Tech stack:** Expo SDK 57, Swift, Vitest, Reanimated.

**Spec:** Issue #57; [Listening](/docs/PRD.md#listening), [Permission and
consent](/docs/PRD.md#permission-and-consent); [audio
session](/docs/TRD.md#the-audio-session);
[Listen control](/docs/DESIGN.md#the-listen-control),
[caption](/docs/DESIGN.md#the-caption), and [Motion](/docs/DESIGN.md#motion).

## Existing behavior and decisions

- #120 already has live transcription, the large initial caption, and
  Listening/mic.fill and Paused/mic.slash looks. `EngineState` and both engines
  support pause/resume, but the session exposes no actions; `HomeScreen` shows
  orange for active phases except paused/unavailable (including `starting`),
  and disables the active control; paused clears words and displays “Paused”.
- The Expo fallback already handles interruptions: the installed 57.1.0 Swift
  source observes `AVAudioSession.interruptionNotification` and emits the
  typed `error: 'interrupted'` event for calls, Siri, or alarms;
  `expo-engine.ts` maps it to `paused`. `turn-listen` has no interruption
  observer. Turn has no Listen AppState handler. End already clears the row;
  completed caption words have no expiry and remain in session memory.
- Pause drops the open transcript, clears the caption, and preserves the row;
  End also stops an initialized-but-paused engine and clears the row. An
  interruption or non-active AppState pauses and never resumes automatically.
  Returning to `active` leaves it paused for a tap; #57 upgrades PRD
  LISTEN-10's “Should” to an acceptance check.
- Only AppState `background` counts as leaving the foreground. `inactive`
  also fires for Control Center and the notification shade, where pausing
  would make the user tap to resume; calls and Siri reach the session as
  interruptions. The TRD puts this rule in the module; AppState applies it
  to both engines at once.
- Two minutes after `ListenLine.endedAt`, the caption returns to the
  session-opening look, "Listening" in large type, and the row stays as it
  was. DESIGN's states table has no blank caption, so LISTEN-8's "caption is
  gone" means the words go and the resting state shows.
- DESIGN's light uses a 1.2-second opacity cycle from 100% to 35% and back,
  for at most five seconds per line, and holds at 100% otherwise and under
  Reduce Motion. The app has no Reanimated dependency, so add the Expo
  SDK-compatible package rather than substituting an SF Symbol effect.

## Task 1: Session actions and foreground lifecycle

**Files:** `app/src/listen/live-session.ts`, new
`app/src/listen/lifecycle.ts`, `app/src/turn-context.tsx`,
`app/test/live-session.test.ts`, new `app/test/listen-lifecycle.test.ts`.

- [ ] Add `pause()` and `resume()` to the session. Pause cancels the silence
      timer, drops an open line, clears the caption, preserves the row, and
      calls `engine.pause()`. Resume calls `engine.resume()` on the same
      session; it never calls the consent controller.
- [ ] Route an engine `onState('paused')` (including an interruption) through
      the same caption/line cleanup. Do not auto-resume on a later engine
      state or foreground event. Track an initialized engine separately from
      active capture so End stops it after pause; guard late start completions
      so a backgrounded app cannot begin capture afterward.
- [ ] Add a lifecycle binding that pauses on AppState `background` and treats
      `inactive` and `active` as no-ops. Register it beside the session in
      `turn-context.tsx` and remove it on provider cleanup. Expose the existing
      store's `reduceMotion` value there for Task 3.
- [ ] Add one `endedAt`-based caption timer. A newer line replaces its
      deadline; pause and End cancel it. Expiry clears only caption words and
      line label/note, so the caption shows "Listening" large again, leaving
      the reply row intact.
- [ ] Extend `live-session.test.ts` and `listen-lifecycle.test.ts` with a fake
      engine, fixed `now()`, and `vi.useFakeTimers()`: pause drops an open line
      and preserves replies; resume stays in-session; End while listening or
      paused stops once and clears the row; interruption and background pause
      stay paused after time advances; `active` does not resume; a caption
      survives 119,999 ms, clears at 120,000 ms from `endedAt`, and an older
      timer cannot clear a newer line.
- [ ] Run `rtk bun run --cwd app test -- live-session.test.ts
listen-lifecycle.test.ts` and `rtk bun run --cwd app typecheck`.

## Task 2: Native `turn-listen` interruptions

**Files:** `modules/turn-listen/ios/ListenEngine.swift`.

- [ ] Observe iOS 26 audio-session interruption begin and, under iOS 27,
      `AVAudioSessionDidBecomeInactiveNotification`. Pause capture, discard
      the in-flight line, and emit the existing `onState('paused', reason)`;
      remove observers with the engine. Do not resume on an interruption end
      or resumption recommendation: the issue and PRD require a tap.
- [ ] Reuse `TurnListenModule.swift`'s existing `onState` event and the
      `modules/turn-listen/src/index.ts` bridge; add no parallel event or new
      native session layer. The existing Swift pause method already stops
      capture and retains the session for `resume()`.
- [ ] Confirm the Swift module compiles in the iOS Simulator build. A physical
      call/Siri check is in Task 4.

## Task 3: Listen control and light (human visual-design task)

**Files:** `app/src/screens/HomeScreen.tsx`, `app/package.json`, `bun.lock`,
`app/test/screen-accessibility.test.ts`.

- [ ] Keep the control inline: Off starts consent; Listening pauses; Paused
      resumes in-session without consent; Mic off stays disabled; End remains
      separate and clears the row. Keep Mic off while `phase === 'starting'`;
      show orange Listening/mic.fill only when the engine reports `listening`.
      Paused is the card/mic.slash capsule with End. Words and symbols
      distinguish states in grayscale; color is a third cue.
- [ ] Add `react-native-reanimated` 4.5.1 and `react-native-worklets` 0.10.1, as
      the TRD pins them for SDK 57 (`bunx expo install`). Fade the symbol at the
      Motion table's 1.2-second 100%-35%-100% cycle while words arrive, stop at
      line end or after five seconds for that line, and hold at 100% otherwise.
      Read `reduceMotion` from `useTurn()`; under Reduce Motion cancel the
      animation and hold at 100%. Do not use an SF Symbol effect.
- [ ] Preserve the session-start `Listening` title2 caption until the first
      words arrive, and show it again when a line's words expire. Give the
      control button role and the visible state as its accessibility label;
      Listening's hint is DESIGN's "Pauses listening", and Paused's is "Resumes
      listening". Today's hint, "Type partner lines from the caption.", belongs
      to the caption. Update the screen accessibility test for those labels and
      hints.
- [ ] Check Listening, Paused, Mic off, and End in grayscale and with VoiceOver;
      confirm the symbol stops under Reduce Motion.

## Task 4: CI and iPhone checks

**Files:** `app/maestro/listen.yaml` (assert End clears the last reply). Run
`scripts/simulator-screenshots.sh` and
`.github/workflows/ios-simulator-build.yml`.

- [ ] Run `rtk bun run test`, `rtk bun run typecheck`, and `rtk bun run lint`.
      The iOS Simulator workflow compiles Swift and embeds the bundle; its
      screenshot job runs Maestro flows when dispatched.
- [ ] The Simulator build forces the typed path (`engine-picker.ts` returns
      `null` for `buildKind === 'simulator'`). Maestro can show Mic off, typed
      entry, and End clearing the row. Fake-engine Vitest tests prove pause,
      resume, interruption, lifecycle, and expiry; a Simulator flow cannot
      prove actual microphone capture or the iOS privacy indicator.
- [ ] On the video iPhone, verify the indicator follows pause/resume; leaving
      the app turns it off and return stays paused; a call and Siri stay
      paused; partner speech drives the capped fade; and VoiceOver, grayscale,
      and Reduce Motion match DESIGN.

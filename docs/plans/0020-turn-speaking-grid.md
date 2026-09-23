# Turn speaking grid

Implement [issue #27](https://github.com/RevenueCat-M1KU/RevenueCat/issues/27)
on `feat/27-speak-grid`. The existing starter bank is the initial data.

## Design

- Open one persistent SQLite database. Create the TRD tables, seed them only
  when the bank has never been initialized, and prune tap rows older than 30
  local days at launch. Keep category and phrase positions fixed during speech.
- Put bank reads and writes behind one store with subscriptions. The store
  owns seeding, daily tap writes, and a debug-only 2,000-phrase seed action.
  Future editor, search, and gazetteer work can use the same write boundary.
- Configure the iOS shared audio session for playback before speaking, and
  keep `expo-speech` on that session. A speech controller handles rapid taps,
  Stop, Repeat, callbacks, and the last spoken text in memory.
- Render category tabs and a scrollable phrase grid from SQLite. Quick is
  first; All is the fixed trailing tab and shows every grid category. Phrase
  cards use dynamic colors/type, wrap fully, speak on release, and have
  accessibility labels matching their visible text. The bottom bar provides
  Repeat/Stop and paging controls. Leave later composer, row, and Listen
  controls to their own issues.

## Steps

1. Add `expo-sqlite`, `expo-speech`, and the minimal audio-session dependency.
   Write bank behavior tests first and watch them fail.
2. Implement the database schema, first-launch seed, ordered reads, tap
   counting/pruning, subscriptions, and debug stress seed. Run focused tests.
3. Write speech-controller tests first and watch them fail. Implement
   interruption, completion, Stop, and Repeat; configure playback at launch.
4. Build the grid and tabs with design tokens and accessibility behavior.
5. Run tests, TypeScript, graphify update, Expo checks, and an iOS 27 Simulator
   build. Exercise tabs, rapid taps, Repeat/Stop, relaunch, and large text in
   the Simulator where possible. Do not reinstall the iOS 26 runtime.
6. Push the branch and open a PR linked to #27. Record physical iPhone audio,
   VoiceOver, and timing checks as outstanding until the teammate tests them.

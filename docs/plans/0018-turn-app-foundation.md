# Turn app foundation implementation plan

**Goal:** Start the Expo app for #22 with its iOS configuration, design theme,
and live accessibility preferences.

**Architecture:** The app package owns Expo configuration and a small root
screen. The theme exports the design's four appearance values and native
dynamic colors. One accessibility store reads iOS preferences at launch and
subscribes to their changes. The device build check remains pending on the
video iPhone after #80 verified its signing setup.

**Tech stack:** Expo SDK 57, React Native 0.86, React 19.2, TypeScript 6,
Vitest 4, and Bun workspaces.

**Spec:** [Issue #22](https://github.com/RevenueCat-M1KU/RevenueCat/issues/22),
the [TRD](/docs/TRD.md#build-configuration), and the
[design](/docs/DESIGN.md#colors).

## Global constraints

- Keep the app portrait and iPhone only, with iOS 26 as its deployment target.
- Follow the system appearance and the four color values in the design.
- Use the design's system font styles and Dynamic Type ramps.
- Do not add analytics, advertising, or a location permission.
- Keep the existing starter bank and shared, relay, and evaluation packages.
- Leave the app icon to #56 and the two native modules to their own issues.

## Tasks

### Task 1: Expo package and configuration

- [x] Add an app workspace with an entry screen and local-module autolinking.
- [x] Test the evaluated Expo config: deployment target, scene support,
      permissions, launch colors, appearance, build kind, and public settings.
- [x] Validate the resolved config with Expo's own config command.
- [x] Prebuild iOS and inspect the generated deployment target, usage texts,
      scene manifest, iPhone family, and color-only launch storyboard.

### Task 2: Theme

- [x] Test each color and type token against the design's YAML blocks.
- [x] Test every pair in the design's contrast table at its stated floor.
- [x] Implement native dynamic colors and type styles with Bold Text weights.

### Task 3: Accessibility preferences

- [x] Test launch reads and change events for Reduce Motion, Bold Text,
      Reduce Transparency, Increase Contrast, and font scale.
- [x] Implement the store and connect it to the root screen.
- [x] Verify all app and workspace tests, type checking, and scoped formatting.

### Task 4: Native check and handoff

- [x] Build and run on an iPhone 16 Simulator with Xcode 27 and iOS 27.0;
      verify the empty home in light and dark appearance.
- [x] Install the iOS 26.0 Simulator runtime (23A343), then build and run
      Turn Debug on an iPhone 16 Simulator with Xcode 27. The empty home
      renders in light `#F2F2F7` and dark `#000000`.
- [x] Build and launch Turn Debug on the physical video iPhone under the free
      Personal Team. #80 verified signing with a throwaway app on a teammate's
      Mac; no physical iPhone is paired with this Mac. #88 ran it on the Mac
      paired with the phone on September 23, and the empty home renders in
      light `#F2F2F7` and dark `#000000`.
- [x] Update #22 with the verified code result and remaining device checks.

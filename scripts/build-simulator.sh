#!/usr/bin/env bash
# Builds the Simulator app judges install (SUBMIT-3): Turn in the Debug configuration for the iphonesimulator SDK,
# with the JavaScript bundle embedded so it runs without Metro, pointed at the team's relay, marked as the
# Simulator build, and zipped as Turn.app.zip in the directory it runs from. The iOS Simulator build workflow runs
# it on every native pull request. Needs macOS with Xcode 27, CocoaPods, Node, and Bun 1.4.2.
set -euo pipefail

usage() {
  printf 'Usage: %s [commit]\n' "$0" >&2
  printf 'Builds this checkout, or the commit in a temporary worktree.\n' >&2
  exit 2
}

[[ $# -le 1 ]] || usage

out="$PWD/Turn.app.zip"
root="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
cd "$root"

if [[ $# -eq 1 ]]; then
  tmp="$(mktemp -d)"
  git worktree add --detach "$tmp/turn" "$1"
  trap 'cd "$root" && git worktree remove --force "$tmp/turn" && rm -rf "$tmp"' EXIT
  cd "$tmp/turn"
fi

# The Simulator build whatever the shell says, so its requests carry X-Turn-Build: simulator.
export EXPO_PUBLIC_BUILD_KIND=simulator
export EXPO_NO_GIT_STATUS=1

bun install --frozen-lockfile
(cd app && bunx expo prebuild --platform ios --clean --no-install)
(cd app/ios && pod install)

# Parallel targets push a compile error far above the log's tail, so a failure prints every error line.
log="$PWD/app/ios/xcodebuild.log"
if ! (cd app/ios && xcodebuild -workspace Turn.xcworkspace -scheme Turn -configuration Debug \
  -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath build CODE_SIGNING_ALLOWED=NO build > "$log" 2>&1); then
  grep -E ': (fatal )?error: ' "$log" | sort -u
  tail -n 50 "$log"
  exit 1
fi
tail -n 200 "$log"

# Expo's bundling phase sets SKIP_BUNDLING in every Debug build, which FORCE_BUNDLING can't override, so the
# bundle is embedded here, from the entry the phase would use.
app="$PWD/app/ios/build/Build/Products/Debug-iphonesimulator/Turn.app"
(
  cd app
  entry="$(node -e "require('expo/scripts/resolveAppEntry')" "$PWD" ios absolute | tail -n 1)"
  bunx expo export:embed --platform ios --dev false --entry-file "$entry" \
    --bundle-output "$app/main.jsbundle" --assets-dest "$app"
)
test -s "$app/main.jsbundle"

rm -f "$out"
(cd "$(dirname "$app")" && ditto -c -k --sequesterRsrc --keepParent Turn.app "$out")
printf 'Built %s\n' "$out"

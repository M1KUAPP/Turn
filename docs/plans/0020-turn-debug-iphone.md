# Turn's Debug iPhone build implementation plan

**Goal:** Close [issue #88][debug-issue]: Turn's own Debug build, from the
latest `main`, signed under the free Personal Team, installed on the video
iPhone, and opened to its empty home in light and dark appearance with no
runtime error; then tick the last box of [issue #22][app-issue].

**Architecture:** No code in the repository changes. A detached, clean
worktree of `origin/main` runs the ticket's command, which prebuilds the
ignored `app/ios/`, signs with the Mac's one Apple Development identity,
installs and launches Turn on the phone, and keeps Metro serving its
bundle. `devicectl` switches the phone to light and then dark appearance and
takes a screenshot of each, and a sampler checks the board color in sRGB.
The tickets record the results, the research note keeps the hands-on check,
and the TRD's device build names the command that worked.

**Tech Stack:** Expo SDK 57 (`expo` 57.0.24, `@expo/cli` 57.0.26), React
Native 0.86.3, Bun 1.4.2, Xcode 27.0 (27A266a) with `xcrun devicectl`,
CocoaPods from Homebrew, `codesign`, `security`, `sips`, Python 3's standard
library, graphify, the `gh` CLI, and subagents for research and review.

**Spec:** [Issue #88][debug-issue], under [issue #22][app-issue] and the
spec in [issue #13][spec], and the TRD's
[environments and release][trd-env]. The user's goal directive, verbatim:
"/ask-matt Complete and close #88. Follow @docs/references/markdown-style.md
(use List instead of TOC) and this workflow: branch -> /research (10-minute
max) -> plan -> implement -> create small and atomic commits -> push branch
-> PR -> code review -> resolve -> merge -> delete branch."

Contents:

1.  [Global constraints](#global-constraints)
1.  [Skills](#skills)
1.  [Design](#design)
1.  [Verification gate](#verification-gate)
1.  [Tasks](#tasks)

[debug-issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/88
[app-issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/22
[spec]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/13
[trd-env]: /docs/TRD.md#environments-and-release

## Global constraints

- **#88's acceptance criteria,** verbatim:
  - "Turn Debug builds and signs under the free Personal Team, then
    installs on the physical video iPhone (COMPAT-4)."
  - "Turn opens with its JavaScript bundle and shows the empty home in
    light and dark appearance, without a runtime error."
  - "The issue records the tested commit, device model and iOS version,
    Xcode version, and build/install/launch result; any failure has a
    redacted error."
  - "#22's final acceptance checkbox is checked after a passing run."
- **#22's final criterion,** verbatim: "On the iPhone: a debug build
  installs under the free Personal Team (COMPAT-4)"
- **COMPAT-4,** verbatim: "Debug builds install on the team's iPhones under
  a free Apple account, and the build for the video is installed after
  September 21, so its seven-day profile lasts through September 28. Check:
  the build's install date."
- **No identifier leaves this Mac.** These go into no tracked file, commit,
  or comment:
  - the phone's name, UDID, CoreDevice identifier, ECID, serial number, and
    host names;
  - the team ID, the Personal Team's name, which is a person's name, and
    the certificate's name;
  - the Apple Account's identifiers and any email address;
  - the Mac's name and address.

  The scratchpad's `ids.json` holds them, read from `devicectl`'s JSON,
  Xcode's preferences, and the certificate without printing them. Every log
  passes `redact.py`, which puts a label such as `<udid>` in place of each,
  before it's kept or read, and `idscan.py` checks every file, commit, and
  comment before it's published. Expo writes the team ID into `app/ios/`,
  which `.gitignore` covers.

- **A person's steps stay a person's.** Unlocking the phone, keeping it
  awake on the Mac's Wi-Fi, and answering prompts on it are the person's.
  The session asks for each when it reaches it, does everything else, and
  ticks a box only when a check proves it.
- **The phone's settings come back.** The session reads the phone's
  appearance before it changes it and sets it back afterward.
- **Other checkouts.** Three peer sessions are busy, so docs change in
  `../revenuecat-debug-iphone`, the build runs in
  `../revenuecat-turn-build`, and nothing is written in other checkouts.
- **Docs** follow the [Markdown style guide][style], with a `Contents:` list
  in place of `[TOC]`.

[style]: /docs/references/markdown-style.md

## Skills

`/ask-matt` isn't installed in this session, so the directive's steps map
to the skills that are:

- **`/research`:** one background agent, capped at 10 minutes, wrote
  [the Debug iPhone notes][note] in about seven.
- **No `/tdd` slice:** there's no code, so each criterion has a shell check
  with its expected output, under [Verification gate](#verification-gate).
- **`/wizard`:** not used. The person's part is a few taps on the phone,
  and the session asks for each as it reaches it.
- **`/pr`:** the pull request's body.
- **`/code-review`:** one round, on its Standards and Spec axes, with issue
  #88 and this plan as the spec, plus a fact-check agent.

[note]: /docs/research/0045-turn-debug-iphone.md

## Design

### Decisions

1.  **A clean checkout of `main`.** A detached worktree at `origin/main`,
    with `bun install --frozen-lockfile` at its root, is the ticket's clean
    checkout. The branch's worktree holds only docs, so the tested commit is
    `main`'s head, and the build's `git status --short` stays empty.
1.  **CocoaPods on purpose.** The run installs CocoaPods itself when `pod`
    is missing: `gem install cocoapods` first, then `brew install cocoapods`
    ([CocoaPods notes][note-pods]). This Mac's system gem folder belongs to
    root, so the gem step would fail and Homebrew would install it. The
    session runs `brew install cocoapods` first instead, so the install has
    its own log and the ticket can name its version.
1.  **The ticket's command, with the phone named.** From `app/`, the
    session runs `EXPO_PUBLIC_BUILD_KIND=device bunx expo run:ios --device`
    with the phone's UDID as the flag's value. Without a TTY a bare
    `--device` opens a picker that errors, and Expo matches a UDID whole
    ([run command notes][note-run]). The command runs in the background, and
    its output passes `redact.py` into `run.log`. It prebuilds `app/ios/`,
    signs, builds, installs, launches, and keeps Metro running.
1.  **Signing by Expo.** With one Apple Development identity, Expo takes it,
    reads the team from the certificate, writes it into `app/ios/`, and
    passes `-allowProvisioningUpdates` and
    `-allowProvisioningDeviceRegistration` on this first build
    ([signing notes][note-sign]). The build must succeed, and the `.app`'s
    signature and embedded profile must name an Apple Development
    certificate, `com.m1ku.turn`, and 1 device, with an expiry after
    September 28.
1.  **The phone unlocked for the install.** Without a TTY, Expo throws on a
    locked phone ([run command notes][note-run]), so the person unlocks it
    before the build ends, and `devicectl device info lockState` checks it.
1.  **A fallback for the install.** Expo installs through its own usbmux
    client, which may fail at the Developer Disk Image on iOS 27
    ([install notes][note-install]). If the build succeeds and Expo's
    install or launch fails, the session keeps the failure's redacted text
    for the ticket, installs and launches the same `.app` with `devicectl`
    as #80 did, and serves the bundle with
    `EXPO_PUBLIC_BUILD_KIND=device bunx expo start`.
1.  **Metro over Wi-Fi.** The Debug app reads the Mac's address from
    `ip.txt` in the `.app` and loads its bundle from Metro on port 8081, so
    the phone must be on the Mac's Wi-Fi ([Metro notes][note-metro]). The
    first launch may meet iOS's Local Network alert, lose its request, and
    show "No script URL provided". The person then taps Allow, and the
    session relaunches Turn with `devicectl`.
1.  **Light and dark by `devicectl`.** The session saves the phone's
    appearance, sets light, dark, then light again with a screenshot after
    each, and then restores the saved style. `sample.py` converts each shot
    to sRGB and needs 99% of the middle 80% of the screen within 2 of the
    board color, `#F2F2F7` in light and `#000000` in dark, and a drawn
    status bar, which an asleep screen lacks. The light shots on either
    side of the dark one show that Turn stayed in front. The screenshots
    stay in the scratchpad, since they show the phone's status bar; only
    the samples are recorded.
1.  **No runtime error.** A red error screen or a LogBox banner would cover
    part of the middle, so the sampler would fail it. Metro's log must also
    show Turn's iOS bundle and no error, and Turn's process must still run
    after the last screenshot.
1.  **The records.**
    - #88 gets one comment with the evidence: the tested commit, the phone's
      model and iOS version, Xcode's and CocoaPods' versions, each step's
      result, the samples, and the install date and profile expiry. Then
      its boxes are ticked.
    - #22 gets its last box ticked and a comment that points to #88.
    - The research note gets a hands-on check, and the TRD's device build
      gets the command that worked.
    - [Plan 0018][app-plan]'s last box, this same check, is ticked with a
      pointer to #88.
1.  **Closing.** The pull request closes #88. #22's code merged in #85 and
    its iOS 26 check in #87, and its teammate kept it open only for the
    native runs, so with every box ticked the session closes it too, which
    unblocks #27.

[note-pods]: /docs/research/0045-turn-debug-iphone.md#cocoapods-when-pod-is-missing
[note-run]: /docs/research/0045-turn-debug-iphone.md#the-run-command-on-a-device
[note-sign]: /docs/research/0045-turn-debug-iphone.md#code-signing-and-xcodebuild-arguments
[note-install]: /docs/research/0045-turn-debug-iphone.md#install-and-launch-on-ios-17-and-later
[note-metro]: /docs/research/0045-turn-debug-iphone.md#how-the-debug-app-finds-metro
[app-plan]: /docs/plans/0018-turn-app-foundation.md

### Rejected alternatives

- **Building in the branch's worktree:** its docs commits sit on top of
  `main`, while a separate checkout makes the tested commit exactly
  `main`'s.
- **Letting the run install CocoaPods:** the same Homebrew install would
  happen unasked, after a failed gem attempt, inside the build's log.
- **A TTY for Expo's picker:** passing the UDID picks the same phone with
  no prompt, and keeps the phone's name out of the command.
- **Checking the colors by eye alone:** the screenshots give numbers the
  ticket can record, and the person still sees the phone.
- **An embedded bundle** (a Release build or forced bundling): the ticket
  asks for the Debug app with its bundle from Metro.

### Out of scope

- Production JavaScript for timings and the video
  (`expo start --no-dev --minify`), and the video's own build and its
  install date (#65 and #67).
- VoiceOver, Switch Control, and Voice Control on the phone.
- The transcription check on the video iPhone (#49).

## Verification gate

Markdown files run the gate from [the plan-storage plan][docs-gate]:
Prettier, `check_md.py` with `--contents`, and `fact_scan.py` for new prose;
the research note also runs `check_links.py`. `idscan.py` must print
`CLEAN` for every changed file, commit message, and comment.

The device checks run from the scratchpad's `dev/` folder. `UDID` holds the
phone's UDID from `ids.json` and is never printed, `BUILD` is the clean
checkout, and `R` is `python3 -u redact.py`:

```shell
(cd "$BUILD/app" && EXPO_PUBLIC_BUILD_KIND=device \
  bunx expo run:ios --device "${UDID:?}") 2>&1 | $R > run.log
APP=$(find ~/Library/Developer/Xcode/DerivedData -path '*/Debug-iphoneos/Turn.app' -newer stamp -maxdepth 6)
codesign -dvv "$APP" 2>&1 | grep -E '^(Identifier|Authority|TeamIdentifier)=' | $R
security cms -D -i "$APP/embedded.mobileprovision" > profile.plist
for key in CreationDate ExpirationDate; do plutil -extract "$key" raw profile.plist; done
plutil -extract ProvisionedDevices raw profile.plist
xcrun devicectl device info appearance --device "$UDID" --json-output appearance-before.json
xcrun devicectl device settings appearance --device "$UDID" --mode light
xcrun devicectl device capture screenshot --device "$UDID" --destination light-1.png
python3 sample.py light-1.png '#F2F2F7'
xcrun devicectl device info processes --device "$UDID" --json-output processes.json
```

- `run.log` must show the build succeeding, the install, the launch, and
  Metro serving an iOS bundle, with no error line.
- The signature's identifier must be `com.m1ku.turn` and its first
  authority an Apple Development certificate. The profile must expire
  after September 28 and list 1 device.
- `sample.py` must exit 0 for `light-1.png`, `dark.png` with `#000000`, and
  `light-2.png`.
- `processes.json` must list an executable inside `Turn.app` after the last
  screenshot, and `idscan.py` must print `CLEAN` for the kept logs.

[docs-gate]: /docs/plans/0009-plan-storage.md#verification-gate

## Tasks

Every subagent prompt carries the repo rule: run
`graphify query "<question>"` before grepping or reading repo files. No
subagent sends the user's email address or any personal identifier to an
API, touches the phone, runs a build, writes a repo file its prompt doesn't
name, or runs git.

### Task 1: Research note

A background agent wrote `docs/research/0045-turn-debug-iphone.md` in about
seven minutes. The session moved three long paths into code blocks, and the
note passed the docs gate and `idscan.py`. It was committed as
`docs(research): add notes on Turn's Debug build on the iPhone`.

### Task 2: This plan

- [x] **Step 1: Run the docs gate, then commit** as
      `docs(plan): add the plan for Turn's Debug build on the iPhone`.

### Task 3: The clean checkout and CocoaPods

- [x] **Step 1: Check out `main`** with
      `git worktree add --detach ../revenuecat-turn-build origin/main`,
      run `bun install --frozen-lockfile` at its root, and check that
      `git status --short` prints nothing.
- [x] **Step 2: Install CocoaPods** with `brew install cocoapods`, and note
      `pod --version`.

### Task 4: Build, install, and launch

- [x] **Step 1: The person** unlocks the phone, keeps it awake and on the
      Mac's Wi-Fi, and leaves the cable in.
- [x] **Step 2: Run** the ticket's command under
      [Verification gate](#verification-gate) in the background, and
      watch `run.log` for the build, the install, and the launch.
- [x] **Step 3: The person** taps Allow if the Local Network alert shows,
      and the session relaunches Turn if its first launch missed Metro.
- [x] **Step 4: Check** the signature, the profile, and Metro's bundle
      line. If Expo's install or launch failed, keep its redacted error and
      take the fallback in [Decisions](#decisions).

### Task 5: Light and dark

- [x] **Step 1: Save** the phone's appearance, then set light, dark, and
      light again, with a screenshot and a sample after each.
- [x] **Step 2: Restore** the saved appearance, and check Turn's process
      and Metro's log.

### Task 6: The records

- [x] **Step 1: Add the run** to the research note as a hands-on check, run
      the docs gate, and commit as
      `docs(research): add Turn's Debug build to the hands-on check`.
- [x] **Step 2: Edit** the TRD's device build to give the command that
      worked, run the docs gate, and commit as
      `docs(trd): give the device build's command and its first run`.
- [x] **Step 3: Tick** plan 0018's device box with a pointer to #88, run
      the docs gate, and commit as
      `docs(plan): tick the app foundation's iPhone check`.

### Task 7: Graph, pull request, review, and merge

1.  Run `graphify update .` and commit `graphify-out/` as
    `chore(graphify): refresh the graph after the Debug iPhone notes`.
1.  Push the branch and open the pull request with the `/pr` template, with
    "Closes #88".
1.  Run one `/code-review` round against `main`, with issue #88 and this
    plan as the spec, plus a fact-check agent, reviewing the tickets'
    drafts too. Post it as a PR comment, fix what it confirms in one commit
    per fix, and post a resolution comment.
1.  List `docs/plans` and `docs/research` on `origin/main`; if a peer's
    merge took 0020 or 0045, renumber in one commit and fix every link.
1.  Comment on #88 with the evidence, then tick its boxes. Tick #22's last
    box, comment, and close it, as [Decisions](#decisions) says.
1.  Rebase-merge the pull request, delete the branch on the remote and
    locally, stop Metro, remove both worktrees, and check that #88 closed
    with every box ticked.

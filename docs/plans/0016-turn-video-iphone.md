# Turn's video iPhone implementation plan

**Goal:** Close [issue #80][iphone-issue]: an app with bundle ID
`com.m1ku.turn` built to the video iPhone under the free Personal Team, with
Developer Mode on and the certificate trusted, and the phone's model and iOS
version recorded on the ticket.

**Architecture:** No code in the repository. A throwaway SwiftUI app, shaped
like Xcode's iOS App template, lives in the session's scratchpad.
`xcodebuild` builds it for the phone with automatic signing, which makes the
Personal Team's certificate, registers the phone and the App ID, and issues
a seven-day profile. `devicectl` installs and launches the app and reads the
phone's model, iOS version, and Developer Mode. The ticket records the
results, the research note keeps the hands-on check, and the TRD says the
bundle ID is registered.

**Tech Stack:** Xcode 27.0 (27A266a) with `xcodebuild`, `xcrun devicectl`,
and `security`; `jq`; graphify; the `gh` CLI; and subagents for research and
review.

**Spec:** [Issue #80][iphone-issue], under the spec in [issue #13][spec], and
the TRD's [build configuration][trd-build] and
[environments and release][trd-env]. The user's goal directive, verbatim:
"/ask-matt Complete and close #80. Follow @docs/references/markdown-style.md
(use List instead of TOC) and this workflow: branch -> /research (10-minute
max) -> plan -> implement -> create small and atomic commits -> push branch
-> PR -> code review -> resolve -> merge -> delete branch."

Contents:

1.  [Global constraints](#global-constraints)
1.  [Skills](#skills)
1.  [Design](#design)
1.  [Verification gate](#verification-gate)
1.  [Tasks](#tasks)

[iphone-issue]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/80
[spec]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/13
[trd-env]: /docs/TRD.md#environments-and-release

## Global constraints

- **#80's acceptance criteria,** verbatim:
  - "Xcode 27 builds to the video iPhone under the free Personal Team, with
    Developer Mode on and the certificate trusted (COMPAT-4)"
  - "The video iPhone's model and iOS version are recorded here; without an
    iPhone 15 Pro or later, the video uses a system voice"
- **COMPAT-4,** verbatim: "Debug builds install on the team's iPhones under
  a free Apple account, and the build for the video is installed after
  September 21, so its seven-day profile lasts through September 28. Check:
  the build's install date."
- **No identifier leaves this Mac.** The phone's name, UDID, and serial
  number, the team ID, the Apple Account's email, and the Personal Team's
  name, which is a person's name, go into no file, commit, or comment.
  Commands read them into variables, and logs are redacted before anyone
  reads them. Only the model, the product type, the iOS version and build,
  and dates are recorded.
- **A person's steps stay a person's.** Connecting the phone, trusting the
  Mac, turning on Developer Mode, and trusting the developer are steps on
  the phone. The session asks for each when it reaches it, does everything
  else, and ticks a box only when a check proves it.
- **Other checkouts.** Two peer sessions are busy, so this work runs in
  `../revenuecat-video-iphone` and writes nothing in other checkouts.
- **Docs** follow the [Markdown style guide][style], with a `Contents:` list
  in place of `[TOC]`.

[style]: /docs/references/markdown-style.md

## Skills

`/ask-matt` sends a ticket to `/implement`, and a wall only a person can
pass to `/wizard`. The directive's steps map to skills:

- **`/research`:** one background agent, capped at 10 minutes, wrote
  [the video iPhone notes][note] in under four, and the session adds its
  hands-on check.
- **`/implement`:** there's no code, so no `/tdd` slice; each criterion has
  a shell check with its expected output, under
  [Verification gate](#verification-gate).
- **`/wizard`:** not used. The person's part is four steps on the phone,
  each done once, and the session asks for each as it reaches it.
- **`/pr`:** the pull request's body.
- **`/code-review`:** one round, on its Standards and Spec axes, with issue
  #80 and this plan as the spec, plus a fact-check agent.

[note]: /docs/research/0037-turn-video-iphone.md

## Design

### Decisions

1.  **A throwaway app, not Turn.** The ticket says to "Build any app to the
    phone under the Personal Team with the bundle ID `com.m1ku.turn`, such
    as Xcode's iOS App template, since #22 builds Turn itself". The session
    writes a project of that shape, `TurnProbe`, in its scratchpad: one
    SwiftUI view that says "Hello, world!", named "Turn Probe" on the home
    screen, for iPhone only, with iOS 26.0 as its minimum (COMPAT-1). It
    stays out of the repository, and #22's build of Turn, with the same
    bundle ID, replaces it on the phone.
1.  **Signing from the command line.** `xcodebuild` builds the Debug
    configuration for the phone by its identifier, with
    `-allowProvisioningUpdates`, `-allowProvisioningDeviceRegistration`, and
    `DEVELOPMENT_TEAM` read from Xcode's preferences
    ([signing notes][note-sign]). A first try with no phone attached failed
    with "Your team has no devices from which to generate a provisioning
    profile" and made no certificate ([hands-on check][note-hands]), so the
    build waits for the phone.
1.  **The profile proves the signing.** The profile Xcode embeds in the app
    must list one device and expire seven days after its creation, and the
    Mac must then hold one valid signing identity.
1.  **`devicectl` reads the phone.** One device's JSON gives the model, the
    product type, the iOS version and build, the pairing state, and
    Developer Mode's state under `properties` ([model notes][note-model]).
    Xcode's own device table maps the product type to a name.
1.  **The launch proves the trust.** `devicectl` installs the app. A launch
    before the person trusts the developer on the phone is expected to
    fail; after they trust it under Settings > General > VPN & Device
    Management, the same launch must succeed. Developer Mode must read as
    on, since iOS 16 and later run no development build without it.
1.  **The ticket records the phone.** #80 gets the model, the product type,
    the iOS version and build, Developer Mode's state, and the profile's
    creation and expiry dates. COMPAT-4's install date belongs to the
    video's own build, which #22 and the release tickets make later; these
    dates show how long this profile covers it.
1.  **The phone decides the voice.** An iPhone 15 Pro or later, product type
    `iPhone16,1` or higher in Xcode's table, can use Personal Voice by
    Apple's iOS 27 guide, and the plan for the video holds. On an older
    phone the video uses a system voice: the ticket says so, and the idea's
    schedule and risks and the PRD's Apple dependency change in their own
    commits.
1.  **The TRD records the registration.** [Build configuration][trd-build]
    says only Apple refusing the bundle ID at the first device build can
    change it. Once the build succeeds, it says Apple registered it that
    day. If Apple refuses it, the session picks another under the same
    rules, lowercase and reverse-DNS, before any build or Devpost names it,
    and changes the TRD with it.
1.  **Closing.** #80's body ticks both boxes, and a comment gives the
    evidence; #22 gets the model and iOS version for its iPhone check; and
    the pull request closes #80, which unblocks #22.

[note-sign]: /docs/research/0037-turn-video-iphone.md#xcodebuild-automatic-signing
[note-hands]: /docs/research/0037-turn-video-iphone.md#hands-on-check
[note-model]: /docs/research/0037-turn-video-iphone.md#the-phones-model-and-ios-version

### Rejected alternatives

- **Building Turn itself:** #22 owns the app and its configuration, and the
  ticket asks for any app.
- **Making the template in Xcode's window:** the same project written by
  hand builds from the command line, so every step leaves a log.
- **Keeping the app in the repository:** #22's build replaces it.
- **Naming the phone by its name or UDID** on the ticket: both identify a
  person's device, and the criterion asks for the model and iOS version.
- **Another follow-up ticket** for the phone, as #16 made this one: #80 is
  the person's ticket, so it closes only when the phone passes the checks.

### Out of scope

- Turn's app and `npx expo run:ios --device` (#22).
- The teammates' iPhones and the transcription check on each (#49).
- The video's build, its install date, and the shoot (#65 and #67).

## Verification gate

Markdown files run the gate from [the plan-storage plan][docs-gate]:
Prettier, `check_md.py` with `--contents`, and `fact_scan.py` for new prose;
the research note also runs `check_links.py`.

The device checks run from the scratchpad's `probe/` folder, once the
phone's tunnel has connected, since `list devices` leaves a phone's
`reality` empty before then. `TEAM` holds the team ID from Xcode's
preferences and `UDID` the phone's, and neither is printed; the build's log
is kept only after they, the phone's name, and the account's email and name
are redacted from it:

```shell
xcrun devicectl list devices --json-output devices.json
UDID=$(jq -r '.result.devices[]
  | select(.properties.hardware.reality == "physical")
  | .properties.hardware.udid' devices.json)
jq -r '.result.devices[]
  | select(.properties.hardware.reality == "physical") | .properties
  | [.hardware.marketingName, .hardware.productType,
     .software.osVersionNumber.stringValue,
     .software.osBuildVersions.buildVersion.name,
     .connection.pairingState,
     (.state.developerModeStatus | keys[0])] | @tsv' devices.json
xcodebuild -project TurnProbe.xcodeproj -scheme TurnProbe \
  -configuration Debug -destination "id=${UDID:?}" -derivedDataPath build \
  -allowProvisioningUpdates -allowProvisioningDeviceRegistration \
  DEVELOPMENT_TEAM="${TEAM:?}" build
APP=build/Build/Products/Debug-iphoneos/TurnProbe.app
security cms -D -i "$APP/embedded.mobileprovision" > profile.plist
for key in CreationDate ExpirationDate ProvisionedDevices; do
  plutil -extract "$key" raw profile.plist
done
security find-identity -v -p codesigning | tail -1
xcrun devicectl device install app --device "$UDID" "$APP"
xcrun devicectl device process launch --device "$UDID" com.m1ku.turn
```

- The device line must show a model, a product type, an iOS version and
  build, `paired`, and `enabled`.
- The build must end with `** BUILD SUCCEEDED **`.
- The profile must print a creation date, an expiry seven days later, and
  1 device, and the identity count must be 1.
- The install must succeed, and the launch must succeed once the developer
  is trusted on the phone.

[docs-gate]: /docs/plans/0009-plan-storage.md#verification-gate

## Tasks

Every subagent prompt carries the repo rule: run
`graphify query "<question>"` before grepping or reading repo files. No
subagent sends the user's email address or any personal identifier to an
API, touches the phone, runs `xcodebuild` against Apple, writes a repo file
its prompt doesn't name, or runs git.

### Task 1: Research note

A background agent wrote `docs/research/0037-turn-video-iphone.md` in under
four minutes, and the session added a hands-on check: the build with no
phone attached, and `devicectl`'s JSON paths read from a Simulator device.
It passed the docs gate and was committed as
`docs(research): add notes on building to the video iPhone`.

### Task 2: This plan

- [ ] **Step 1: Run the docs gate, then commit** as
      `docs(plan): add the plan for the video iPhone`.

### Task 3: The phone

- [ ] **Step 1: The person** connects the video iPhone to the Mac with a
      cable, unlocks it, taps Trust, and enters the passcode. Then, under
      Settings > Privacy & Security > Developer Mode, they turn it on, tap
      Restart, and after the restart tap Enable and enter the passcode.
- [ ] **Step 2: Check** the device line and Developer Mode's state.

### Task 4: The build

- [ ] **Step 1: Build** with `build_device.sh` for the phone.
- [ ] **Step 2: Check** the profile's dates and device count, and the
      signing identity.

### Task 5: Install, trust, and launch

- [ ] **Step 1: Install** the app and launch it, noting the launch's error.
- [ ] **Step 2: The person** trusts the developer on the phone under
      Settings > General > VPN & Device Management.
- [ ] **Step 3: Launch** again and check that it succeeds.

### Task 6: The records

- [ ] **Step 1: Add the phone's results** to the research note's hands-on
      check, run the docs gate, and commit as
      `docs(research): add the video iPhone to the hands-on check`.
- [ ] **Step 2: Edit** [build configuration][trd-build] to say Apple
      registered the bundle ID, run the docs gate, and commit as
      `docs(trd): say Apple registered the bundle ID`.
- [ ] **Step 3: Tick** #80's boxes, comment on #80 with the evidence, and
      comment on #22 with the phone's model and iOS version.

### Task 7: Graph, pull request, review, and merge

1.  Run `graphify update .` and commit `graphify-out/` as
    `chore(graphify): refresh the graph after the video iPhone notes`.
1.  Push the branch and open the pull request with the `/pr` template, with
    "Closes #80".
1.  Run one `/code-review` round against `main`, with issue #80 and this
    plan as the spec, plus a fact-check agent; post it as a PR comment, fix
    what it confirms in one commit per fix, and post a resolution comment.
1.  Rebase-merge the pull request, delete the branch on the remote and
    locally, remove the worktree, and check that #80 closed with both boxes
    ticked.

[trd-build]: /docs/TRD.md#build-configuration

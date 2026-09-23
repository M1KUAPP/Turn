# Turn's Debug iPhone build research notes

How Turn's Expo SDK 57 app builds, signs, installs, and launches as a Debug
build on the video iPhone with `expo run:ios --device`, and how it finds
Metro, read for issue #88 on September 23, 2026. Code is quoted from the
installed `@expo/cli` 57.0.26, `@expo/package-manager` 1.13.1, `expo`
57.0.24, and React Native 0.86.3, help text from Xcode 27.0 (27A266a), and
judgment starts with "Synthesis:".

Contents:

1.  [The run command on a device](#the-run-command-on-a-device)
1.  [Code signing and xcodebuild arguments](#code-signing-and-xcodebuild-arguments)
1.  [CocoaPods when pod is missing](#cocoapods-when-pod-is-missing)
1.  [How the Debug app finds Metro](#how-the-debug-app-finds-metro)
1.  [Appearance and screenshots](#appearance-and-screenshots)
1.  [Install and launch on iOS 17 and later](#install-and-launch-on-ios-17-and-later)
1.  [The build kind variable](#the-build-kind-variable)
1.  [Turn's entitlements](#turns-entitlements)
1.  [Hands-on check](#hands-on-check)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## The run command on a device

Paths below are under `@expo/cli/build/src/` in
`node_modules/.bun/@expo+cli@57.0.26+849cc1836f483ec3/node_modules/`, with
line numbers.

- **The order of work.** `runIosAsync` sets `NODE_ENV` and loads `.env`
  files (`run/ios/runIosAsync.js:106-107`), prebuilds `ios/` if it's missing
  (110-115), resolves options (117), runs `xcodebuild` (193), starts the dev
  server (244-249), then installs and launches (251). `app/ios/` is
  gitignored (`/.gitignore` line 85), so the first run prebuilds.
- **Matching `--device <value>`.** The list is usbmuxd's devices plus
  simulators (`run/ios/options/resolveDevice.js:71-75`). A value is matched
  whole and case-insensitively: "device.udid.toLowerCase() === searchValue
  || device.name.toLowerCase() === searchValue" (139). A miss throws "No
  device UDID or name matching" (141). The usbmuxd UDID is the device's
  `SerialNumber` (`run/ios/appleDevice/AppleDevice.js:167`).
- **A bare `--device`.** It opens a picker (`resolveDevice.js:131`).
- **No TTY.** Expo is interactive only when "!env.CI &&
  process.stdout.isTTY" (`utils/interactive.js:13-14`). Otherwise a prompt
  throws `CommandError('NON_INTERACTIVE', ...)` (`utils/prompts.js:67-76`).
- **Prompts that can appear.**
  - The device picker, with a bare `--device`: it errors without a TTY.
  - The signing team, only with 2 or more identities: without a TTY the
    CLI takes the first one (see the next section).
  - A busy port: "Use port 8082 instead?" (`utils/port.js:155-159`).
    Without a TTY it warns and returns no port (165-167).
  - A locked phone: "Cannot launch ... Unlock <device name> to
    continue..." Without a TTY it throws instead
    (`run/ios/appleDevice/installOnDeviceAsync.js:138-147`).
  - Prebuild's "Install the updated dependencies?", when a template
    changes `package.json` (`prebuild/prebuildAsync.js:156-159`).
  - None for CocoaPods: the install is non-interactive (see
    [CocoaPods](#cocoapods-when-pod-is-missing)).
- **Metro and staying alive.** A Debug build defaults to `Debug`
  (`run/ios/options/resolveOptions.js:33`) and starts the dev server (57).
  After the launch it logs "Logs for your project will appear below" and
  keeps running; only with the bundler off does it call `manager.stopAsync()`
  (`runIosAsync.js:257-261`, `run/hints.js:42-43`).
- **What it prints that could identify someone.**
  - "› Using --device <udid>" (`resolveDevice.js:147`, `hints.js:36-37`).
  - "› Auto signing app using team(s): <team ID>"
    (`run/ios/codeSigning/configureCodeSigning.js:88`).
  - "› Signing and building iOS app with: <certificate common name>"
    (`configureCodeSigning.js:103`). The source's own sample
    lines have the form "Apple Development: <email> (<ID>)"
    (`run/ios/codeSigning/Security.js:81-86`).
  - The locked-phone messages carry the device name
    (`installOnDeviceAsync.js:142, 147`).
  - "› Installing <binary path>" shows the DerivedData path
    (`run/ios/launchApp.js:89`).
- Synthesis: pass the phone's UDID, never its name, and run with a TTY or
  expect every prompt above to error or pick a default. Pipe the output
  through a redaction filter before it reaches a log or a PR.

## Code signing and xcodebuild arguments

- **When signing is skipped.** If every target already has a
  `DEVELOPMENT_TEAM`, or every target has a provisioning profile, the CLI
  logs the teams and returns `null`
  (`configureCodeSigning.js:68-99`,
  `run/ios/codeSigning/xcodeCodeSigning.js:49-53`).
- **Finding identities.** It runs
  `security find-identity -p codesigning -v` and keeps lines matching
  `Develop(ment|er)` (`Security.js:72-95`).
  With none it logs a link to `https://expo.fyi/setup-xcode-signing` and
  throws "No code signing certificates are available to use."
  (`run/ios/codeSigning/resolveCertificateSigningIdentity.js:106-117`).
- **One identity, or no TTY.** With `ids.length === 1 || !isInteractive()`
  it uses the first identity
  (`resolveCertificateSigningIdentity.js:118-125`).
- **The team ID.** It reads the certificate's subject: the common name
  becomes `codeSigningInfo` and the `OU` field becomes `appleTeamId`
  (`Security.js:101-109`).
- **Several identities, with a TTY.** It prefers `ios.appleTeamId` from the
  app config (134-135), else prompts "Development team for signing the app"
  with "team name (team ID) - common name" (151-158). It saves the choice
  as `developmentCodeSigningId` in Expo's user settings
  (`run/ios/codeSigning/settings.js:20-25`) and writes `ios.appleTeamId`
  into the app config when none was set (140-146).
- **What it writes to the Xcode project.** `DEVELOPMENT_TEAM`,
  `CODE_SIGN_IDENTITY = "Apple Development"`, `CODE_SIGN_STYLE = Automatic`,
  and `ProvisioningStyle = Automatic` in `TargetAttributes`
  (`xcodeCodeSigning.js:66-83`).
- **The xcodebuild arguments.** `-workspace` (or `-project`),
  `-configuration Debug`, `-scheme`, `-destination id=<udid>`,
  `COCOAPODS_PARALLEL_CODE_SIGN=true`, and `COMPILER_INDEX_STORE_ENABLE=NO`
  (`run/ios/XcodeBuild.js:258-277`). Only when signing was just configured
  does it add `DEVELOPMENT_TEAM=<team ID>`, `-allowProvisioningUpdates`,
  and `-allowProvisioningDeviceRegistration` (279-283).
- **The environment.** It passes `RCT_METRO_PORT` and `SKIP_BUNDLING=1`
  for a Debug device build (`XcodeBuild.js:229-240`,
  `resolveOptions.js:54`).
- Synthesis: the first run after prebuild talks to Apple, since it passes
  both provisioning flags. A rerun with `app/ios/` kept passes neither, so
  it can't renew a free profile, which expires after 7 days
  ([free-team limits][setup-apple]). If a rerun fails on provisioning,
  delete `app/ios/` and run again, or build with the command in
  [the video iPhone notes][xcodebuild-signing].

[xcodebuild-signing]: /docs/research/0037-turn-video-iphone.md#xcodebuild-automatic-signing

## CocoaPods when pod is missing

- **It installs CocoaPods itself.** When `pod` isn't on `PATH`, the CLI
  sets "CocoaPods CLI not found in your PATH, installing it now." and calls
  `installCLIAsync({ nonInteractive: true, ... })` with no prompt
  (`utils/cocoapods.js:160-178`).
- **Gem first.** It runs `gem install cocoapods --no-document`
  (`@expo/package-manager/build/ios/CocoaPodsPackageManager.js:56-60`).
  Non-interactive, a failure throws instead of retrying with `sudo`
  (63-68).
- **Then Homebrew.** On a gem failure it logs "› Attempting to install
  CocoaPods CLI with Homebrew" and runs `brew install cocoapods`, then
  `brew link cocoapods` if needed (`CocoaPodsPackageManager.js:72-118`).
- **If both fail.** It logs "Unable to install the CocoaPods CLI." and
  returns `false` (`cocoapods.js:179-190`). Prebuild goes on
  (`prebuildAsync.js:191-198`), and a later run with `ios/` present throws
  `AbortCommandError` (`cocoapods.js:224-231`).
- **This Mac.** `gem` is `/usr/bin/gem` (system Ruby 2.6.10), and `brew` is
  `/opt/homebrew/bin/brew`.
- Synthesis: running the command as-is installs software. The system gem
  directory likely needs `sudo`, so the gem step fails and Homebrew installs
  CocoaPods. Install CocoaPods on purpose first (with the person's say-so),
  or the run will do it unasked.

## How the Debug app finds Metro

React Native paths below are under this folder:

```text
node_modules/.bun/react-native@0.86.3+d04dbab8887f20e2/node_modules/react-native/
```

- **`ip.txt`.** `scripts/react-native-xcode.sh` "Enables iOS devices to get
  the IP address of the machine running Metro" when the configuration is
  Debug and the platform isn't a simulator (lines 14-16). It takes the first
  address from `ipconfig getifaddr en0` through `en8`, else from `ifconfig`
  (17-25), and writes `echo "$IP" > "$DEST/ip.txt"` into the `.app` (13,
  27). This runs before the "SKIP_BUNDLING enabled; skipping." exit (30-33).
- **No embedded bundle.** The SDK 57 template's "Bundle React Native code
  and images" phase exports `SKIP_BUNDLING=1` for Debug
  ([template project][template-pbxproj]). Prebuild downloads the template
  from npm (`prebuild/resolveTemplate.js:111`), so it isn't installed yet.
- **`bundleURL`.** The template's `AppDelegate.swift` returns this in
  Debug, and `main.jsbundle` in Release
  ([template AppDelegate][template-appdelegate], lines 60-66):

  ```swift
  RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")
  ```

- **Picking the host.** `React/Base/RCTBundleURLProvider.mm` uses port
  `RCT_METRO_PORT`, 8081 by default (line 20). `guessPackagerHost` reads
  `ip.txt`, then `host = ipGuess ?: @"localhost"`, and returns it only if
  `isPackagerRunning` (206-222). That check requests `/status`, expects
  `packager-status:running`, and times out after 6 seconds (34, 90-135). A
  saved `RCT_jsLocation` is tried first (259). With no host it falls back to
  `main.jsbundle` (323-332), which a Debug build lacks.
- **Without Metro.** `React/Base/RCTJavaScriptLoader.mm` shows "No script
  URL provided. Make sure the packager is running or you have embedded a JS
  bundle in your application bundle." (112), or "Could not connect to
  development server." with "WiFi is enabled and connected to the same
  network as the Node Server" (247-251).
- **Local network privacy.** TN3179: "Outgoing traffic to a local network
  address requires local network access", and "If the system presents a
  local network alert in response to one of your local network operations,
  it may deny the operation immediately, before the user has responded to
  the alert." It also says "If your app accesses the local network, add the
  NSLocalNetworkUsageDescription property" ([TN3179][tn3179]).
- **Info.plist.** Neither `NSLocalNetworkUsageDescription` nor
  `NSBonjourServices` is in the template's `Info.plist`, in
  `@expo/config-plugins` 57.0.9, in `@expo/prebuild-config` 57.0.16, or in
  the introspected config. The introspected `NSAppTransportSecurity` has
  `NSAllowsArbitraryLoads: true`, so plain `http` to a LAN IP loads.
- Synthesis: the phone must reach the Mac's LAN IP on port 8081, so both
  need the same Wi-Fi or LAN; no source says the cable carries Metro. Expect
  the Local Network alert on the first launch, with iOS's default text. The
  first `/status` check may be denied before the tap, so the first launch
  may show "No script URL provided"; tap Allow, then relaunch.

[template-pbxproj]: https://github.com/expo/expo/blob/sdk-57/templates/expo-template-bare-minimum/ios/HelloWorld.xcodeproj/project.pbxproj
[template-appdelegate]: https://github.com/expo/expo/blob/sdk-57/templates/expo-template-bare-minimum/ios/HelloWorld/AppDelegate.swift
[tn3179]: https://developer.apple.com/documentation/technotes/tn3179-understanding-local-network-privacy

## Appearance and screenshots

- **Screenshot.** `xcrun devicectl help device capture screenshot`:
  "Captures a screenshot from the device and saves it as a PNG file to the
  specified destination." `--destination` "(must be a .png file)", and
  without `--display-unique-id` it "captures the primary display."
- **Set the appearance.** `xcrun devicectl help device settings appearance`:
  "Set the user interface style (light/dark) ... for a device (if
  supported)." `--mode` takes "(values: light, dark, l, d)".
- **Read the appearance.** `xcrun devicectl help device info appearance`:
  "Get the current user interface style (light/dark) and other appearance
  settings for a device (if supported)."
- **Displays.** `xcrun devicectl help device info displays`: "This command
  shows the current display/screen information for this device."
- **JSON.** Each takes `--json-output <path>`; "When the JSON document is on
  stdout, human-readable output ... is routed to stderr instead."
- **Locked phones.** None of the four help texts mentions locking.
  `xcrun devicectl help device info lockState` says "This command gets
  the current locked state of a device."
- **The color profile.** `man sips` says `--getProperty` will "Output the
  property value for key to stdout" and `--matchTo` will "Color match image
  to profile". On a test Display P3 PNG, `sips -g profile` printed
  `profile: Display P3`, and this made an sRGB copy:

  ```shell
  sips --matchTo '/System/Library/ColorSync/Profiles/sRGB Profile.icc' \
    shot.png --out shot-srgb.png
  ```

- **One pixel as sRGB.** This CoreGraphics script, tested with Swift 6.4,
  draws the pixel into a 1x1 sRGB bitmap, so it matches from the embedded
  profile. It read `#F2F2F7` back from a Display P3 test image.

  ```swift
  // Usage: swift pixel.swift <file.png> <x> <y>  (pixels, top-left origin)
  import CoreGraphics
  import Foundation
  import ImageIO

  let a = CommandLine.arguments
  guard a.count == 4, let x = Int(a[2]), let y = Int(a[3]),
        let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: a[1]) as CFURL, nil),
        let img = CGImageSourceCreateImageAtIndex(src, 0, nil),
        x >= 0, y >= 0, x < img.width, y < img.height
  else { fputs("usage: swift pixel.swift file.png x y\n", stderr); exit(1) }

  var px = [UInt8](repeating: 0, count: 4)
  let srgb = CGColorSpace(name: CGColorSpace.sRGB)!
  let ctx = CGContext(data: &px, width: 1, height: 1, bitsPerComponent: 8,
                      bytesPerRow: 4, space: srgb,
                      bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
  ctx.interpolationQuality = .none
  ctx.draw(img, in: CGRect(x: -x, y: y - img.height + 1, width: img.width, height: img.height))
  print(String(format: "sRGB at (%d,%d): #%02X%02X%02X", x, y, px[0], px[1], px[2]))
  ```

- Synthesis: set `--mode light`, check it with `device info appearance`,
  capture, then repeat with `--mode dark`. Check `device info lockState`
  before capturing, and put back the phone's own appearance afterwards.

## Install and launch on iOS 17 and later

- **Expo's own usbmux client first.** For a phone, `launchAppAsync` calls
  `installOnDeviceAsync` (`launchApp.js:87-103`), which calls
  `AppleDevice.runOnDevice` (`installOnDeviceAsync.js:103-120`). That opens
  lockdown, mounts the Developer Disk Image, uploads the app to
  `PublicStaging` over AFC, installs it with the installation proxy, and
  launches it through `debugserver` (`AppleDevice.js:175-240, 270-297`).
- **The Developer Disk Image.** If no image is mounted, it looks for one in
  `<Xcode>/Platforms/iPhoneOS.platform/DeviceSupport/<version>/`
  (`start/doctor/apple/XcodeDeveloperDiskImagePrerequisite.js:89-103`).
  Xcode 27 has no such folder on this Mac; its images are in
  `/Library/Developer/DeveloperDiskImages/iOS_DDI`.
- **The launch fallback.** `launchApp` tries `debugserver` over usbmux and
  falls back to `devicectl` on any error: "iOS 17 introduces a new protocol
  called RemoteXPC. This is not yet implemented, so we fallback to
  devicectl." It logs the switch only at debug level
  (`AppleDevice.js:299-317`).
- **The install fallback.** Only an `APPLE_DEVICE_USBMUXD` error, "No
  devices found" or "No device found (udid: ...)", switches the install to
  `devicectl` (`installOnDeviceAsync.js:123-131`,
  `run/ios/appleDevice/client/UsbmuxdClient.js:106-116`). That path runs
  `xcrun devicectl device install app --device <id> <app>`
  (`start/platforms/ios/devicectl.js:239-252`).
- **Launch errors.** "There was an error launching app: <result>" and
  "Unable to launch app, number of tries exceeded" (`AppleDevice.js:294`,
  `AppleDevice.js:297`). An install without a launch warns "App ...
  installed but couldn't be launched. Open on device manually." (236).
- **A locked phone.** devicectl's `Locked` error becomes "Device is locked,
  unlock and try again." (`devicectl.js:161-162`), and the install path
  says "Cannot launch <app> on <device name> because the device is locked."
  (`installOnDeviceAsync.js:147`).
- **An untrusted developer.** The CLI has no message of its own for it; the
  launch error is iOS's, as quoted in the [video iPhone
  notes][hands-on-0037].
- Synthesis: the usbmux install may fail at the disk image step on iOS 27,
  though it didn't in the [hands-on check](#hands-on-check). The launch
  there likely goes through `devicectl`, and the default log can't show
  which. If the build succeeds and the install fails, install and launch
  the built `.app` with devicectl as #80 did, and keep Metro running with
  `bunx expo start`.

[hands-on-0037]: /docs/research/0037-turn-video-iphone.md#hands-on-check

## The build kind variable

- **In the config.** `app/app.config.ts` sets `extra.buildKind` from
  `process.env.EXPO_PUBLIC_BUILD_KIND ?? 'simulator'`, and
  `EXPO_PUBLIC_BUILD_KIND=device bunx expo config --type introspect --json`
  gives `buildKind: "device"`. No app code reads `buildKind` yet.
- **Read again at build time.** `expo-constants` 57.0.19 adds a
  `before_compile` script phase, "Generate app.config for prebuilt
  Constants.manifest" (`ios/EXConstants.podspec:38-48`). Its script loads
  `.env` with `@expo/env` and evaluates the config into
  `EXConstants.bundle` (`scripts/get-app-config-ios.sh:35`,
  `scripts/src/getAppConfig.ts:22-26`). `@expo/env` says "This won't
  override existing environment variables defined in the system
  environment." (`build/index.js:270`)
- **In JavaScript.** "Every environment variable must be statically
  referenced as a property of `process.env` using JavaScript's dot notation
  for it to be inlined." Expo CLI loads `EXPO_PUBLIC_` variables from `.env`
  files "whenever you use the Expo CLI, such as when running
  `npx expo start`" ([environment variables][expo-env]). In development,
  `babel-preset-expo` 57.0.12 points `EXPO_PUBLIC_*` at a virtual module
  (`build/plugins/inline-env-vars.js:47-55`) that Metro fills from its own
  environment (`environmentVariableSerializerPlugin.js:17-25`, under
  `@expo/metro-config`'s `build/serializer/`).
- Synthesis: `extra.buildKind` is fixed when `xcodebuild` runs, from the
  environment `expo run:ios` passes down. `process.env.EXPO_PUBLIC_BUILD_KIND`
  in JavaScript comes from the process running Metro, so restart Metro with
  the same variable.

[expo-env]: https://docs.expo.dev/guides/environment-variables/

## Turn's entitlements

- **Entitlements.** The introspected config has `ios.entitlements: {}`. It
  has no `aps-environment`, iCloud, App Groups, Sign in with Apple,
  Associated Domains, or keychain groups.
- **Info.plist.** `UIBackgroundModes` is absent, and `UIUserInterfaceStyle`
  is `Automatic`, so the app follows the phone's appearance.
- **Free-team limits.** A free team can register 10 App IDs and 3 devices,
  install 3 apps per device, and its profiles "will expire 7 days from
  issuance" ([setup notes][setup-apple]).
- Synthesis: nothing in Turn's config needs a paid team today. Adding push,
  iCloud, or App Groups later would.

## Hands-on check

The session ran Turn's build on this Mac on September 23, 2026, with times
in UTC, from a detached worktree at `main`'s head, `0113583`, after
`bun install --frozen-lockfile`. Every log passed a redaction filter before
it was kept.

- **CocoaPods.** Before the run, `brew install cocoapods` installed
  CocoaPods 1.17.0 and its dependency, Ruby 4.0.7, so Expo's own install
  step didn't run.
- **The build.** From `app/`, the ticket's command, with the phone's UDID
  after `--device`, started at 12:51:45. It printed "Finished prebuild" and
  "Installed CocoaPods", then "› Using --device" with the UDID and
  "› Signing and building iOS app with:" with the certificate's name. It
  ended with "› Build Succeeded" and "› 0 error(s), and 1 warning(s)", and
  no prompt appeared. `codesign` dates the signature 12:53:36.
- **Signing.** The app's signature has the identifier `com.m1ku.turn` and
  an Apple Development certificate as its first authority, and
  `codesign --verify --strict` passes. Its embedded profile is the one from
  #80, "iOS Team Provisioning Profile: com.m1ku.turn", created at 10:08:39
  and expiring at 10:08:39 on September 30, with 1 device. The app's
  entitlements are `application-identifier`,
  `com.apple.developer.team-identifier`, and `get-task-allow`. Expo wrote
  the team ID into two `DEVELOPMENT_TEAM` lines in the ignored `app/ios/`,
  and the checkout's `git status --short` stayed empty.
- **Install and launch.** Expo's own usbmux install on iOS 27.0 printed
  "✔ Complete 100%" and "› Logs for your project will appear below.", and
  Turn was running by a screenshot at 12:54:15. The log doesn't show
  whether Expo launched it over usbmux or through its `devicectl` fallback.
  The `.app` holds `ip.txt` with the Mac's Wi-Fi address and no
  `main.jsbundle`.
- **Local Network.** That screenshot showed iOS's alert, "Allow “Turn” to
  find devices on local networks?", over React Native's red "No script URL
  provided" screen. The alert closed at 12:54:53, and a `devicectl`
  relaunch at 12:55:12 still showed the red screen. The person was then
  asked to switch Turn on under Settings > Privacy & Security > Local
  Network, check that the phone was on the Mac's Wi-Fi, and tap Reload JS.
  By 12:57:16 Metro had logged "iOS Bundled 4645ms app/index.ts (709
  modules)".
- **Light and dark.** `devicectl` set light, dark, and light again, and
  `device info appearance` read each back before the screenshots at
  12:57:53, 12:57:57, and 12:58:02. Each was 1290 by 2796 pixels in sRGB
  IEC61966-2.1. In the middle 80% of the height, 100% of the sampled pixels
  were within 2 of `#F2F2F7`, `#000000`, and `#F2F2F7` in turn, and the
  status bar was drawn. The phone's own dark style was set back afterward.
- **No error.** After the launch, Metro's log held only the bundle line, and
  Turn was still running after the last screenshot.
- **A locked phone.** A screenshot at 12:46, before the person unlocked the
  phone, was entirely `#000000` with no status bar.
- Synthesis: Turn's Debug build installs and runs on the video iPhone under
  the free Personal Team, and #80's profile covers it through September 30.
  A phone's first launch meets the Local Network alert and the red screen;
  with access on and the phone on the Mac's Wi-Fi, Reload JS loads the
  bundle. Take screenshots only while the phone is unlocked and awake.

## Gaps

- **Metro over the cable.** No source says whether a USB-only phone can
  reach Metro.
- **The Local Network setting.** The hands-on check saw the alert's title,
  but not which of the person's steps turned access on, so the Settings
  path above is unverified.
- **xcodebuild's own log.** Whether the formatted build log prints the
  signing identity or profile name wasn't read.
- **Web quotes.** The TN3179, Expo docs, and template quotes came through a
  fetch summary, so check their wording before reusing them.

## See also

- [Turn's video iPhone research notes](/docs/research/0037-turn-video-iphone.md)
- [Turn's setup research notes](/docs/research/0036-turn-setup.md)
- [Expo: environment variables](https://docs.expo.dev/guides/environment-variables/)

[setup-apple]: /docs/research/0036-turn-setup.md#apple-xcode-27-and-ios-27

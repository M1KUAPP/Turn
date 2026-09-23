# Turn's video iPhone research notes

How a Mac with Xcode 27.0 (27A266a) and a free Personal Team builds an app
with bundle ID `com.m1ku.turn` to a USB iPhone from the command line, read
for issue #80 on September 23, 2026. Local help text is quoted from Xcode
27.0 (27A266a), and judgment starts with "Synthesis:".

Contents:

1.  [xcodebuild automatic signing](#xcodebuild-automatic-signing)
1.  [devicectl install and launch](#devicectl-install-and-launch)
1.  [The phone's model and iOS version](#the-phones-model-and-ios-version)
1.  [Free and paid team App IDs](#free-and-paid-team-app-ids)
1.  [Hands-on check](#hands-on-check)
1.  [Gaps](#gaps)
1.  [See also](#see-also)

## xcodebuild automatic signing

- **`-allowProvisioningUpdates`.** `xcodebuild -help` says "Allow
  xcodebuild to communicate with the Apple Developer website. For
  automatically signed targets, xcodebuild will create and update
  profiles, app IDs, and certificates." It "Requires a developer account
  to have been added in Xcode's Accounts settings" or an App Store Connect
  key.
- **`-allowProvisioningDeviceRegistration`.** The help says "Allow
  xcodebuild to register your destination device on the developer portal
  if necessary. This flag only takes effect if -allowProvisioningUpdates
  is also passed." `man xcodebuild` says "Requires
  -allowProvisioningUpdates."
- **`DEVELOPMENT_TEAM`.** "The team ID of a development team to use for
  signing certificates and provisioning profiles."
  ([Build settings reference][build-settings])
- **`CODE_SIGN_STYLE`.** "This setting specifies the method used to
  acquire and locate signing assets. Choose `Automatic` to let Xcode
  automatically create and update profiles, app IDs, and certificates."
  ([Build settings reference][build-settings])
- **The certificate.** An Apple Development certificate is for this:
  "Run an iOS, iPadOS, macOS, tvOS, visionOS, watchOS app on devices and
  use certain app services during development."
  ([Certificates overview][certs])
- **Destinations.** `man xcodebuild` shows both
  `-destination generic/platform=iOS` and
  `-destination 'platform=iOS,name=My iPad'`.
- Synthesis: name the phone as the destination, since device registration
  acts on "your destination device"; a generic destination names no phone.
  Run this only by hand, since it talks to Apple with the account.

  ```shell
  xcodebuild -workspace ios/Turn.xcworkspace -scheme Turn \
    -configuration Debug -destination 'platform=iOS,name=<phone-name>' \
    -allowProvisioningUpdates -allowProvisioningDeviceRegistration \
    CODE_SIGN_STYLE=Automatic DEVELOPMENT_TEAM=<team-id> build
  ```

[build-settings]: https://developer.apple.com/documentation/xcode/build-settings-reference
[certs]: https://developer.apple.com/help/account/certificates/certificates-overview/

## devicectl install and launch

- **Install.** `xcrun devicectl help device install app` says "This
  command installs an app bundle (with a .app extension) on the device."
  Its usage is `devicectl device install app --device <...> <path>`.
- **Launch.** `xcrun devicectl help device process launch` says "This
  command launches an application on a device and passes it specific
  arguments." Its target is `<bundle-identifier-or-path>`.
- **JSON output.** Both take `--json-output <path>`, and "Pass '-' (or
  '/dev/stdout' / '/dev/fd/1') to write the JSON to stdout instead of a
  file."
- **Developer Mode.** Apple says "Enable Developer Mode on a device to run
  your app on the device through Xcode."
  ([Enabling Developer Mode][devmode]) The setting appears only once the
  phone has started pairing with a Mac or was paired with one before, as
  the [setup notes][setup-apple] quote.
- Synthesis: install, then launch, and keep both JSON files as proof.

  ```shell
  xcrun devicectl device install app --device <phone-name> \
    --json-output install.json <path/to/Turn.app>
  xcrun devicectl device process launch --device <phone-name> \
    --json-output launch.json com.m1ku.turn
  ```

[devmode]: https://developer.apple.com/documentation/xcode/enabling-developer-mode-on-a-device

## The phone's model and iOS version

- **The `properties` dictionary.** The help for `device info details` says
  "the 'hardwareProperties', 'deviceProperties', and
  'connectionProperties' keys are deprecated in favor of the 'properties'
  dictionary and will be removed in a future release."
- **Dotted paths.** `xcrun devicectl help list devices` says "a device's
  'properties' dictionary is filtered as 'properties.<category>.<field>'",
  with the example `properties.state.visibilityClass`. It says to "run
  the command with '--json-output -' and inspect the JSON for a single
  item" to find every field.
- **Field names in Xcode.** Xcode's
  `CoreDeviceClientJSONSupport.framework`, under
  `/Library/Developer/PrivateFrameworks/CoreDevice.framework`, holds the
  strings `productType`, `marketingName`, `osVersionNumber`,
  `osBuildUpdate`, `developerModeStatus`, `pairingState`, `tunnelState`,
  `transportType`, and `ddiServicesAvailable`.
- **Xcode's device table.** Xcode ships
  `Platforms/iPhoneOS.platform/usr/standalone/device_traits.db`. Its
  `Devices` table maps `ProductType` to `ProductDescription`. Its
  `Metadata` row names `XcodeBuildVersion` `27A200c` and
  `PlatformVersion` `27.0`. Queried read-only, it lists these product types
  from `iPhone16,1` up:

  | ProductType  | ProductDescription |
  | ------------ | ------------------ |
  | `iPhone16,1` | iPhone 15 Pro      |
  | `iPhone16,2` | iPhone 15 Pro Max  |
  | `iPhone17,1` | iPhone 16 Pro      |
  | `iPhone17,2` | iPhone 16 Pro Max  |
  | `iPhone17,3` | iPhone 16          |
  | `iPhone17,4` | iPhone 16 Plus     |
  | `iPhone17,5` | iPhone 16e         |
  | `iPhone18,1` | iPhone 17 Pro      |
  | `iPhone18,2` | iPhone 17 Pro Max  |
  | `iPhone18,3` | iPhone 17          |
  | `iPhone18,4` | iPhone Air         |
  | `iPhone18,5` | iPhone 17e         |
  | `iPhone19,2` | iPhone 18 Pro      |
  | `iPhone19,3` | iPhone 18 Pro Max  |
  | `iPhone19,4` | iPhone             |
  | `iPhone19,7` | iPhone 18 Pro Max  |

  ```shell
  sqlite3 -readonly /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/usr/standalone/device_traits.db \
    "select distinct ProductType, ProductDescription from Devices
     where ProductType like 'iPhone%' order by ProductType"
  ```

- Synthesis: save one device's JSON, then find `productType`,
  `marketingName`, `osVersionNumber`, and `developerModeStatus` in its
  `properties`. Map the product type with the table above.

  ```shell
  xcrun devicectl list devices --json-output devices.json
  ```

## Free and paid team App IDs

- **Personal Team limits.** The [setup notes][setup-apple] quote Apple's
  limits for a free team: 10 App IDs and 3 devices, each expiring after 7
  days, 3 apps per device, and profiles that expire 7 days from issuance.
- **Reinstalling.** "You'll need to rebuild and reinstall your app to your
  device after expiration." ([Developer account overview][account])
- **Matching bundle IDs.** "The explicit App ID you enter here should
  match the bundle ID you entered in the target's Summary pane in Xcode."
  ([Register an App ID][register])
- Synthesis: the free `com.m1ku.turn` App ID expires after 7 days, so it
  shouldn't hold the name for good. Whether a paid team can register it
  inside those 7 days is under Gaps.

[account]: https://developer.apple.com/help/account/basics/about-your-developer-account
[register]: https://developer.apple.com/help/account/identifiers/register-an-app-id/

## Hands-on check

The session ran these on this Mac on September 23, 2026, with times in UTC.
The app was a SwiftUI project shaped like Xcode's iOS App template, with
bundle ID `com.m1ku.turn`. The first three checks ran before any phone was
attached.

- **No phone, no signing.** With the Personal Team signed in and no phone
  attached, `xcodebuild` with `-allowProvisioningUpdates` and
  `-destination generic/platform=iOS` failed with "Communication with Apple
  failed: Your team has no devices from which to generate a provisioning
  profile. Connect a device to use or manually add device IDs in
  Certificates, Identifiers & Profiles." and "No profiles for
  'com.m1ku.turn' were found". Afterward `security find-identity`, with
  `-v -p codesigning`, still printed "0 valid identities found", so no
  certificate was made. Neither error says whether the bundle ID is free.
- **Simulator devices in the list.** After a Simulator build,
  `xcrun devicectl list devices` also listed a Simulator device, "iPhone 18
  Pro (iPhone19,2)", with `simulated` in its Reality column.
- **The JSON paths.** That device's JSON held
  `properties.hardware.marketingName`, `properties.hardware.productType`,
  `properties.hardware.reality`, `properties.hardware.udid`,
  `properties.software.osVersionNumber.stringValue`,
  `properties.software.osBuildVersions.buildVersion.name`, and
  `properties.connection.pairingState`. The deprecated `hardwareProperties`
  and `deviceProperties` held the same values, and no field named Developer
  Mode.
- **The phone.** At 10:05 an iPhone was attached by cable and trusted.
  `device info details` read "iPhone 15 Pro Max" as its `marketingName`,
  `iPhone16,2` as its `productType`, `physical` as its `reality`, iOS 27.0
  (24A435), and `paired`. In the first `list devices` JSON, taken before
  the phone's tunnel connected, `reality` and `marketingName` were empty.
- **Developer Mode.** The deprecated `deviceProperties.developerModeStatus`
  first read `disabled`. After the person turned the setting on and the
  phone restarted, it read `enabled`, and
  `properties.state.developerModeStatus` read `{"enabled":{"mode":1}}`.
- **Signing with the phone.** A signed build that overlapped the phone's
  restart for Developer Mode failed with "Timed out waiting for all
  destinations matching the provided destination specifier to become
  available". The next, from
  10:08:08 to 10:08:43 with `-destination id=<UDID>` and both provisioning
  flags, printed `** BUILD SUCCEEDED **`. It signed with a new Apple
  Development identity and the profile "iOS Team Provisioning Profile:
  com.m1ku.turn", created at 10:08:39 and expiring at 10:08:39 on September
  30, with 1 device and an application identifier of the team ID followed
  by `.com.m1ku.turn`. The Mac then held "1 valid identities found".
- **Install and trust.** `devicectl device install app` succeeded at
  10:08:56. A launch at 10:09:06 failed with CoreDeviceError 10002: "Unable
  to launch com.m1ku.turn because it has an invalid code signature,
  inadequate entitlements or its profile has not been explicitly trusted by
  the user". After the person trusted the developer under Settings >
  General > VPN & Device Management, the same launch succeeded at 10:10:20,
  and the app kept running.
- Synthesis: Apple registered `com.m1ku.turn` for the Personal Team at the
  first build with a phone, and the profile lasts past the September 28
  shoot. The phone is an iPhone 15 Pro Max, one of the "iPhone 15 Pro
  models" that the iOS 27 guide lists for Personal Voice
  ([Personal Voice devices][pv-devices]). Pick a phone out of the list only
  after its tunnel connects.

[pv-devices]: /docs/research/0023-turn-ios.md#personal-voice-devices-and-the-simulator

## Gaps

- **Another team's registration.** `com.m1ku.turn` was free, so the error
  for a bundle ID another team holds wasn't seen. No Apple page says
  whether a live free App ID blocks another team, free or paid, from
  registering it; a teammate who builds under their own Personal Team may
  meet that.
- **The trust error's source.** No Apple page gives the launch error before
  the developer is trusted; the hands-on check quotes iOS's own message.
- **Table oddities.** The table's `iPhone19,4` reads only "iPhone", and
  `iPhone19,7` repeats "iPhone 18 Pro Max". Its build, 27A200c, differs from
  the installed 27A266a.

## See also

- [Turn's setup research notes](/docs/research/0036-turn-setup.md)
- [Distributing your app to registered devices](https://developer.apple.com/documentation/xcode/distributing-your-app-to-registered-devices)

[setup-apple]: /docs/research/0036-turn-setup.md#apple-xcode-27-and-ios-27

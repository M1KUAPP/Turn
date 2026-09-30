# Live companion plan

How the companion handoff's step 6, the live Live2D renderer, ships: what it adds to [plan 0048](/docs/plans/0048-turn-companion.md)'s frames, where the models come from and how a build gets them, the checks that prove it done, and the decisions made on the way. The spec is the handoff's "Two renderers" note: react-native-webview running Cubism SDK for Web 5-r.5 with Core 6.0 from the SDK zip, Ice Girl's textures halved, and the model files fetched at build time and kept out of the repo, adding breathing and hair physics with the same states and props.

Contents:

1.  [What ships](#what-ships)
1.  [How a build gets the models](#how-a-build-gets-the-models)
1.  [Checks](#checks)
1.  [Decisions](#decisions)

## What ships

| Part                                      | What it does                                                                                                                                                                                              |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/src/companion/live2d.ts`             | Shared by the app and the page: each frame's pose, each model's framing for the face and the portrait, and the messages between them                                                                      |
| `app/live2d/renderer.ts` and `index.html` | The page: loads one model, poses it from the frame the app shows, breathes and runs its physics while it may move, draws at 30 frames a second on a transparent canvas, and says when it's ready or fails |
| `app/src/companion/Live2DView.tsx`        | The web view over the frames in `CompanionFace` and the partner view, which hide their frames once the model has drawn and bring them back if it fails                                                    |
| `app/plugins/withLive2D.ts`               | Copies the built page into the app as a `Live2D` folder, and only when it has been built                                                                                                                  |
| `scripts/fetch-companion-models.ts`       | Fetches the models and the SDK, checks them, and builds the page                                                                                                                                          |

The face keeps the frames' states and timing: the app still steps through `useFaceFrame`, and the page poses each frame, easing into it while the face may move and jumping to it when it may not. Rest has the eyes open and the mouth shut; half and open open the mouth; blink shuts the eyes; listen nods the head up 12° with the eyes; and type nods it down 16°. With Let it move on and Reduce Motion off, the model also breathes, with the SDK sample's breath turned down so the face stays where it is, and its hair and clothes follow its physics. Otherwise it holds still, with no breath and no physics.

## How a build gets the models

`scripts/fetch-companion-models.ts` downloads the four archives from the team's Drive folder, "Turn Companion Screen Assets", and `CubismSdkForWeb-5-r.5.zip` from Live2D, and checks each against its pinned SHA-256, so a changed file stops the build. It unpacks them, needing `unzip` and, for Ice Girl's RAR, `bsdtar`, which is macOS's `tar`. Then it writes `app/live2d/build/Live2D`, which Git ignores:

- `core.js`, the SDK's Cubism Core 6.0.
- `renderer.js`, the page's code bundled with the SDK's framework by Bun.
- `shaders.js`, the framework's shaders, since the framework reads them with `fetch`, which a file URL can't serve.
- `models/<model>.js`, each model's settings, moc, and physics.
- `models/<model>-portrait.js` and `-face.js`, its textures, base64 encoded in scripts, since a `<script>` tag always loads from the bundle.

The portrait's textures keep their size, except Ice Girl's, which halve from 8192 to 4096 pixels. The face's 52-point circle takes a quarter of the portrait's, scaled with `sips` on a Mac and Pillow elsewhere. The page comes to about 35 MB.

`scripts/build-simulator.sh` runs it before prebuild, so the Simulator build and its workflow carry the live face. A failed fetch warns and the build goes on with the frames, since the build is what judges install. For a local build, run `bun scripts/fetch-companion-models.ts` before `expo prebuild`. `app.config.ts` sets `extra.live2d` only when the page is built, and without it the app never makes a web view.

## Checks

- `bun run lint`, `bun run typecheck`, and `bun run test` pass. New unit tests cover each frame's pose, a framing for every model's face and portrait, and `extra.live2d` following the build. `bunx tsc -p app/live2d` typechecks the page against the fetched SDK.
- `expo prebuild --platform ios` puts the `Live2D` folder in the app's Copy Bundle Resources phase.
- In headless Chromium, loading the page from a file URL without file-access flags, every model draws at both fits, and each framing matches its frames. That's to about 2% RMS difference on the rest frames for all four faces and for the Suit, Ice, and Office portraits, and 7% for Ren's portrait. The page poses each frame sent to `turnSet`, breathes while it may move and holds still when it may not, keeps a pose sent before it was ready, and reports a missing model as an error.
- Not checked here: the page in the iOS web view itself, and its memory on a device. The Simulator build workflow compiles react-native-webview and bundles the page; run `app/maestro/companion.yaml` on it and watch the face after it loads.

## Decisions

- **Frames first, then live.** The frames show until the model has drawn, about a second in Chromium, and come back if the web view fails or its process ends, so the face is never blank and the Maestro flow's IDs don't change.
- **The face's textures** are a quarter of the portrait's. Home shows a face whenever one is chosen, and Ice Girl's four halved textures alone would take 256 MB of GPU memory. The face shows the head at 52 points, so a quarter still has more texels than pixels.
- **Packed as scripts**, base64 encoded, rather than read from files, since the web view's `fetch` can't read file URLs and a texture read from one would taint WebGL; scripts cost a third more space and load for certain.
- **Drive as the source**, pinned by hash, as the handoff keeps the models out of the repo. If the folder's files change, update the hashes in the script.
- **Licenses.** Cubism Core is Live2D's Redistributable Code under its Proprietary Software License, and the framework is under its Open Software License. A business with more than 10 million yen of annual revenue needs a Cubism SDK Release License before releasing the app. The README credits the SDK. The in-app iOS license list, generated by `scripts/generate-ios-licenses.ts`, needs a Mac with CocoaPods to pick up react-native-webview's pod.
- **Ice Girl** is still in, as plan 0048 has her; the handoff asks the team to message TianYeLuLu before shipping her, and now her model files ship in the app, not only pictures of her.

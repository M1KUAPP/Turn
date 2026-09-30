# Turn companion plan

How the companion handoff ships: what each build step changed, where the assets came from, the checks that prove it done, and the decisions made on the way. The spec is the Figma file's "Handoff · companion" frame on the handoff page, and the frames tagged NEW or CHANGED on "📱 Screens (w/ Companion)" are the picture.

Contents:

1.  [Build order](#build-order)
1.  [Assets](#assets)
1.  [Checks](#checks)
1.  [Decisions](#decisions)

## Build order

Steps 1 to 5 of the handoff ship in one pull request; step 6, the live Live2D renderer, stays a stretch.

| Step | Frames                     | What changed                                                                                                          |
| ---- | -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 1    | 33, 67                     | `/settings/companion` and the Companion row under Voice, whose value is the face's name or Off                        |
| 2    | 02–16, 03, 06d, 32, 59, 60 | `CompanionFace` left of the toolbar, which narrows to 298 points with 70-point pills, 2 points apart, beside the face |
| 3    | 62–66                      | `/partner`, a full-screen modal opened by tapping the face                                                            |
| 4    | 03, 04, 08, 22             | Listening while the partner's words arrive, and Typing while the composer's field has focus                           |
| 5    | 40, 41                     | Show the face here in the place sheets, saved with the place                                                          |

The code sits where the handoff's code map puts it: the settings in `app/src/companion/settings.ts`, read through `useCompanion()` in `turn-context.tsx`; the state and the frame timing in `app/src/companion/state.ts`; the images in `frames.ts`; and the face in `CompanionFace.tsx`.

## Assets

`app/assets/companion/<model>/` holds each model's six faces (`face-rest`, `-half`, `-open`, `-blink`, `-listen`, `-type`), four portraits (`portrait-rest`, `-half`, `-open`, `-blink`), and Settings' `tile`, each at `@2x` and `@3x`. They are the board's source images, 312-point squares for faces and 3x for portraits and tiles, matched to the board's layer names against its render and by eye, then scaled down for the smaller sizes. Together they come to about 18 MB, 16 MB of it portraits.

The README's Acknowledgments credit the four models, and the app itself carries no credit, as the handoff asks.

## Checks

- `bun run lint`, `bun run typecheck`, and `bun run test` pass. New unit tests cover the state's priority, Speaking over Typing over Listening over Rest; the blink timer, which never starts under Reduce Motion or with Let it move off; the settings; the place column and its migration; the toolbar's 70-point pills; and a preview keeping the last line.
- `expo export --platform ios` bundles the app and resolves all 44 images at both scales.
- `app/maestro/companion.yaml` chooses Ren, checks the face on Home, taps a phrase, sees the face's `companion-face-speaking` ID, opens the partner view, and taps Done. Run it with `scripts/simulator-screenshots.sh Turn.app <out> pr` on a Mac, then compare the screenshots with frames 02 to 16, 22, 40, 41, and 62 to 67.

## Decisions

- **Settings storage:** `companion_model` and `companion_moves` live in the bank's `setting` table beside `voice_id` and `speech_rate`, where the voice settings are, rather than in SecureStore as the handoff's code map says, so Erase all data clears them.
- **Show the face here:** a `show_companion` column on `place`, since frame 40's note asks for it to be stored with the place. Banks from before it gain the column at launch, with every place showing the face. The toggle shows only while a face is chosen, as the note says, and Save keeps it with the name.
- **Listening** follows the caption's `lineOpen`, the signal that runs the listening light.
- **The mouth** cycles rest, half, and open every 125 ms, as the handoff has it.
- **The partner view** speaks nothing when it opens, since only a tap speaks; Say it again repeats the last line, and with no line yet there's no card and Say it again is off. The flip's VoiceOver label, "Flip screen", and its hint are the only new strings the handoff doesn't list. On a screen shorter than 874 points the portrait shrinks and keeps its 370 by 440 shape.
- **Previews keep the last line:** a voice or face preview no longer replaces the speech controller's last text, so the partner view and Repeat never show "Hello. This is how I sound."
- **The face's circle** matches the toolbar beside it, glass with the raised shadow, since the handoff calls that toolbar "otherwise identical" and the code's toolbar has no hairline.
- **Large text:** beside the face the toolbar's pairs stop fitting from about AX2, so at AX5 it takes four rows where it took two. The face stays, since the handoff keeps it in one place, but this is worth a look on a device. In the composer the face shows only below AX1, so the field keeps its width.
- **Type:** the tiles' names are in `title`, the nearest token to the frame's 20 points, and the screen's line under its title is the subheadline ramp at regular weight, as frame 67 has it.
- **Ice Girl** is in the app, as frame 67 has it, but the handoff asks the team to message TianYeLuLu before shipping her; the other three can ship now.
- **Left out:** step 6, the live Live2D renderer, which [plan 0049](/docs/plans/0049-live-companion.md) adds.

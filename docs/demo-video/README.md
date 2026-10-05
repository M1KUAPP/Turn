# Demo video pipeline

How Turn's demo video was made with no Mac and no iPhone, written as instructions an agent follows to make one for another app: two Claude Code sessions film the real app on a cloud machine and edit it in code, while the user keeps every taste call. Turn's result is a 1:38 demo ([YouTube](https://youtu.be/OIAwcZPi3oc)); the [Gist](https://gist.github.com/AlaskanTuna/1899cdb8c48b8bc4998b9ae02607a365) tells the same story for human readers.

Contents:

1.  [The four rules](#the-four-rules)
1.  [The crew](#the-crew)
1.  [The run](#the-run)
1.  [Adapting it to another app](#adapting-it-to-another-app)
1.  [Turn's implementation](#turns-implementation)
1.  [See also](#see-also)

## The four rules

Every choice in the pipeline serves one of these.

1.  **Film the real app.** Footage comes from the app's own build, run on a cloud machine and driven by scripted taps. The edit frames that footage; it never stands in for it with a mockup.
1.  **Replace only the input the machine lacks.** Turn's Simulator has no microphone and no transcriber, so a stand-in feeds the partner's scripted words, timed like the real device, and everything after it (caption, ranking, reply row, tap, speech) is the app's own work. One stand-in, at the edge; the rest stays honest.
1.  **Trust the screen, not the clocks.** CI logs drift from what the screen shows by up to two seconds. The edit syncs to events read off the footage's own pixels and the device's own log, and falls back to CI marks plus a measured lag only when both miss.
1.  **Make every stage code.** Voices, music, sync, the cut, the mix and the checks are scripts and React components, so new footage means a re-run, not a re-edit. When a redesign landed at 10:46 PM, every scene was re-filmed overnight and the cut rebuilt from the same code.

## The crew

Each role is its own Claude Code session on the same machine, with a name the others can message (`SendMessage`; `ListAgents` shows the names). Files are the contracts between roles ([contracts.md](contracts.md)); a message only says a file is ready, or that something blocks.

| Role                | Owns                                                                         | Runbook                    |
| ------------------- | ---------------------------------------------------------------------------- | -------------------------- |
| Director            | The brief, the plan, voices, music, the edit, the mix, captions and final QA | [director.md](director.md) |
| Recorder            | The capture pipeline, the stand-in input, every take and its cue sheet       | [recorder.md](recorder.md) |
| Fixer (optional)    | App bugs the footage exposes, through the app's normal pull requests         | The app's own workflow     |
| Producer (the user) | Accounts and keys, a pick at every gate, the upload                          | The gates below            |

- **The producer holds the taste.** Each creative choice reaches the user as a multiple-choice question with a recommended option first (`AskUserQuestion`), and each gate waits for their pick. Authorizations (keys, payments, publishing) go to the user too, never between agents.
- **The script follows the app.** When the real app does something other than the plan (a different reply, an extra screen), the recorder films what happened and tells the director, who rewrites the words around the footage.

## The run

The director drives the order. Each step ends on a gate that names its owner.

1.  **Inputs.** The producer supplies a repository whose CI can run the app's platform (GitHub Actions macOS runners for iOS), an ElevenLabs account with its API key saved to a file only the scripts read, a music track they own or license, and the app's build steps. _Gate:_ each exists, and the director knows the key file's path without having printed it.
1.  **Brief.** The director interviews the producer (Superpowers' brainstorming skill asks the questions people forget) and writes the director's brief ([director.md, step 1](director.md#1-write-the-brief)). _Gate:_ the producer approves every section.
1.  **Recorder brief and first footage.** The director writes the recorder's brief ([director.md, step 2](director.md#2-brief-the-recorder)); the recorder builds the CI recording mode and films the scenes it can film today ([recorder.md](recorder.md#steps)). _Gate:_ a run's takes, cue sheets and manifest sit in `footage/<run-id>/`.
1.  **Plan.** The director turns the brief into a task plan for the edit project (Superpowers' writing-plans), with tests that guard the brief's hard rules ([director.md, step 3](director.md#3-plan-the-edit-project)). _Gate:_ the producer approves it.
1.  **Voices, gate G1.** The director auditions voices, the producer picks by ear, and the director generates every line with word timings and hands the partner lines to the recorder as `lines.json` ([director.md, step 4](director.md#4-make-the-voices)). _Gate:_ the producer's picks are in and `lines.json` holds real timings.
1.  **Final footage, music and sound.** The recorder films every scene with the real timings, in parallel batches, while the director makes the music and effects ([director.md, step 5](director.md#5-make-the-music-and-sound)). _Gate:_ every take in the runs' manifests says PASS, the director has the run IDs, and the producer has heard each effect.
1.  **Ingest and sync.** The director ingests each run and reads every event off the footage ([director.md, step 6](director.md#6-ingest-and-sync-the-footage)). _Gate:_ `footage.json` lists every take, and every event the detector missed has a named fallback.
1.  **Edit, gates G2 and G3.** The director cuts the edit, then renders the agreed stills and the rough cut ([director.md, steps 7 and 8](director.md#7-cut-the-edit)). _Gate:_ the producer approves the stills (G2), then the rough cut (G3).
1.  **Finish, gate G4.** Render both versions, set loudness, write captions and run QA ([director.md, step 9](director.md#9-finish-and-check)). _Gate:_ QA passes and the producer approves the files.
1.  **Publish.** The producer uploads, following the brief's upload steps.

When the app changes after footage exists, return to step 6 for the scenes whose screens changed, then steps 7 to 9; nothing earlier repeats.

## Adapting it to another app

Swap the platform pieces; keep the contracts, the edit project and the rules.

| Platform    | Machine and recording                                                                                         | Taps                     |
| ----------- | ------------------------------------------------------------------------------------------------------------- | ------------------------ |
| iOS         | GitHub-hosted macOS runner, Xcode's Simulator, `xcrun simctl io recordVideo`                                  | Maestro                  |
| Android     | Linux runner with KVM, an emulator, `adb shell screenrecord` (three-minute limit) or the emulator's recording | Maestro                  |
| Web         | Any runner, Playwright with `recordVideo` per browser context                                                 | Playwright actions       |
| Desktop app | A runner with the OS, a screen recorder such as FFmpeg's screen grab                                          | The OS's UI test tooling |

Pick the stand-in from what the cloud machine lacks:

- **Microphone or speech recognition:** a scripted engine behind the app's own input interface, as [recorder.md, the stand-in](recorder.md#the-stand-in-input) describes.
- **Camera:** a fixed image or clip fed through the app's camera layer in a recording-only build.
- **Location, notifications, deep links, purchases:** the platform's own simulation (`simctl location`, `simctl push`, the store's test environment). Turn's purchase used RevenueCat's Test Store and said so on screen.

Carried over as they are: [contracts.md](contracts.md), the edit project's layout and scripts ([director.md](director.md)), the recording-control server and cue sheets ([recorder.md](recorder.md)), and every entry in [lessons.md](lessons.md) that isn't platform-specific.

## Turn's implementation

The working code, for copying patterns from:

- **The recorder's side** is the branch `video/replay-engine-v5` of `M1KUAPP/Turn`, at commit `041a528`. It never merges, by design: `.github/workflows/ios-simulator-build.yml` (the `video` job), `scripts/video/` (the recording-control server, cue sheets, manifest, speech timing), `apps/mobile/maestro/video/` (the scene flows and their building blocks) and `apps/mobile/src/listen/replay-engine.ts` (the stand-in). Turn's own workflows were removed after `bcb0849`, so filming Turn again is manual ([the recording mode](recorder.md#the-recording-mode)).
- **The director's side** is `~/CS/m1ku/turn-video/`, its own local git at commit `c8ab43a` with no remote: a Remotion 4 project whose layout [director.md](director.md#3-plan-the-edit-project) maps.
- **The working files** are under `~/.cache/turn-work/video/`: the recorder's brief, `footage/<run-id>/` for each run, `replay/lines.json`, and the music and auditions under `audio/`.
- **The briefs** as approved on Sep 30, 2026, kept as written: [the director's](examples/director-brief.md) and [the recorder's](examples/recorder-brief.md). Start a new project's briefs from these. Their `~/CS/muba/` paths are now `~/CS/m1ku/`.

Turn's run, end to end: about 19 hours from the first prompt to the final file (9 of them waiting on the team's review), 15 CI filming runs, 55 takes, and five versions of the cut.

## See also

- [director.md](director.md), [recorder.md](recorder.md), [contracts.md](contracts.md) and [lessons.md](lessons.md)
- [Landing video pipeline](/docs/research/design/video-pipeline.md), for generated (not filmed) footage on a website
- [Remotion's agent skills](https://www.remotion.dev/docs/ai/skills) and [Maestro](https://maestro.dev)

# File contracts

The files the director and the recorder hand each other, and the ones each side keeps for itself. A role changes a format only after telling the other side, since both sides' scripts parse them. Times are milliseconds or seconds as each format says; positions are points of the device's screen (393 × 852 on an iPhone 16).

Contents:

1.  [Where the files live](#where-the-files-live)
1.  [lines.json](#linesjson)
1.  [A run's folder](#a-runs-folder)
1.  [events.jsonl](#eventsjsonl)
1.  [Cue sheets](#cue-sheets)
1.  [manifest.json](#manifestjson)
1.  [The edit's data](#the-edits-data)

## Where the files live

A working folder outside both repositories, shared by both sessions. Turn's is `~/.cache/turn-work/video/`:

```text
video/
├── briefs/recorder.md      the recorder's brief
├── replay/lines.json       director → recorder: the partner's lines and word timings
├── footage/<run-id>/       recorder → director: one CI run's takes
├── audio/                  the music source and voice auditions
└── fetch-run.sh            waits for a run and downloads its artifact
```

## lines.json

The partner's lines, written by the director's `voice-lines.ts` and read by the recorder's server on each `/cue`, so new timings need no rebuild:

```json
[
  {
    "id": 1,
    "text": "How was physio?",
    "words": [
      { "word": "How", "startMs": 0, "endMs": 186 },
      { "word": "was", "startMs": 221, "endMs": 313 },
      { "word": "physio?", "startMs": 360, "endMs": 1161 }
    ]
  }
]
```

- `id` is the number flows cue (`replay-line.yaml` with `ID: '1'`); IDs are stable even when lines are added.
- `words` come from ElevenLabs's character alignment, from the clip's start. Punctuation stays on its word.
- Until real timings exist, placeholders of the same shape (about 280 ms a word) let the recorder build.

## A run's folder

What one CI run's artifact holds once downloaded to `footage/<run-id>/`:

| Path                       | Holds                                                                                   |
| -------------------------- | --------------------------------------------------------------------------------------- |
| `video/`                   | simctl's own recordings, `<scene>[-<clip>]-take<N>.mp4`, variable frame rate, no audio  |
| `cfr/`                     | the same at a constant 60 fps, the last frame held to the take's recorded length        |
| `cues/`                    | one cue sheet per recording                                                             |
| `cues.runner/`             | the runner's cue sheets, before `audio-cues.py` added the device log's speech times     |
| `events.jsonl`             | every request to the recording-control server                                           |
| `results.txt`              | one line per take: scene, take and `PASS` or `FAIL`, tab-separated                      |
| `voice/`, `voice.txt`      | the app's spoken phrases as 48 kHz WAVs, `phrases.tsv` (file, then text), and the voice |
| `maestro/`                 | per take: Maestro's debug output and log, `device.log`, the last screen's hierarchy     |
| `manifest.json`            | the run, described for the director                                                     |
| `commit.txt`, `device.txt` | the commit filmed and the simulated device                                              |

## events.jsonl

One JSON object per line, appended by the recording-control server with the runner's clock:

```json
{"t": 1790785257756.7, "event": "record-start", "flow": "s2-consent", "scene": "s2-consent", "take": "1", "file": "s2-consent-take1.mp4", "clip": null, "recordingStartMs": 1790785257756.612, "exact": true}
{"t": 1790785261710.9, "event": "mark", "flow": "s2-consent", "scene": "s2-consent", "take": "1", "file": "s2-consent-take1.mp4", "label": "tap Listen"}
```

Every event has `t` (epoch milliseconds), `event`, `flow`, `scene` and `take`. The events are `ui` (`setting`, `value`, `code`), `record-start` (`recordingStartMs`, and `exact` when simctl printed "Recording started"), `mark` (`label`), `cue` (a flow queued line `id`; `found` says whether `lines.json` had it), `replay` (the stand-in took the line: `id`, `text` and `words`) and `record-stop`. It's raw material: `cues.py` turns it into cue sheets.

## Cue sheets

One per recording, `cues/<scene>[-<clip>]-take<N>.json`: everything the edit needs to know about one file, with times in seconds from the recording's first frame.

```json
{
  "file": "video/s2-consent-take1.mp4",
  "scene": "s2-consent",
  "flow": "s2-consent",
  "take": 1,
  "clip": null,
  "recordingStartMs": 1790785257756.612,
  "recordingStartExact": true,
  "recordingStopMs": 1790785288024.1,
  "recordedSeconds": 30.267,
  "units": { "t": "seconds from recordingStartMs", "x": "points", "y": "points" },
  "cues": [{ "kind": "tap", "text": "Listen", "x": 294.0, "y": 85.0, "t": 4.223, "markT": 3.954 }]
}
```

`markT` is when the flow marked the event; `t` is the best time the runner had for it. Kinds:

| Kind          | Fields                | Meaning                                                                                  |
| ------------- | --------------------- | ---------------------------------------------------------------------------------------- |
| `cue`         | `text`                | A flow queued a line (`replay 5`)                                                        |
| `replay`      | `id`, `text`, `words` | The stand-in took the line; its words are timed from `t`                                 |
| `tap`         | `text`, `x`, `y`      | A tap, at Maestro's logged time and the tapped element's centre                          |
| `speak`       | `text`                | The app was asked to say this phrase; it shares its mark with the tap that caused it     |
| `alert-tap`   | `text`                | A system alert's button, timed from the device log, which lands later than Maestro's log |
| `audio-start` | `text`                | The device log says the phrase's audio started                                           |
| `queue-stop`  | `text`                | The device log says the phrase's audio stopped                                           |
| `silent-warm` | `text`                | The stand-in's zero-volume warm-up word at the start of Listen mode; never on screen     |

A `tap` with no `x` and `y` means Maestro's log missed it. The detector skips it, so the edit draws no ring and can't cut on it, and any speech it caused is timed from the mark.

## manifest.json

The run, described for the director's ingest:

```json
{
  "run": "36739684140",
  "runUrl": "https://github.com/M1KUAPP/Turn/actions/runs/36739684140",
  "commit": "a4d723edc04ed027c7f4a6fbb1f134b037f2c7cc",
  "device": "iPhone 16 <udid> on com.apple.CoreSimulator.SimRuntime.iOS-27-0",
  "voice": {
    "language": "en-US",
    "identifier": "com.apple.voice.super-compact.en-US.Samantha",
    "name": "Samantha",
    "mac-voice": "Samantha"
  },
  "phrases": [{ "file": "voice/thanks-for-listening.wav", "text": "Thanks for listening" }],
  "notes": ["video/ is simctl's own file: variable frame rate, ..."],
  "recordings": [
    {
      "scene": "s2-consent",
      "take": 1,
      "clip": null,
      "file": "video/s2-consent-take1.mp4",
      "duration": 30.373,
      "bytes": 14845211,
      "video": { "width": 1178, "height": 2556, "codec": "h264", "avgFrameRate": "384600/18233", "frames": 641 },
      "commit": "a4d723e...",
      "cfr": null,
      "cues": "cues/s2-consent-take1.json",
      "notes": ["take PASS"]
    }
  ]
}
```

- `phrases` lists every WAV of the app's voice in the run; the ingest fails on a spoken phrase missing from it.
- A recording's `notes` carry `take PASS` or `take FAIL` from `results.txt`, plus anything the run noticed (a recording start taken from the spawn rather than simctl's message).

## The edit's data

Generated by the director's scripts into `src/data/`, read by the edit:

- **`voice.json`:** `{partner: Clip[], narrator: Clip[]}`, each clip `{id, text, src, durationMs, words}`, with `src` under `public/` (`voice/partner-1.wav`).
- **`footage.json`:** `{takes: Take[]}`. A take is `{key, scene, take, clip, src, frames, width, height, pointScale, taps, replays, speaks}`, where `taps` are `{frame, x, y, text}`, `replays` are `{frame, id, text, rowFrame?}` (`rowFrame` is where the reply row settled) and `speaks` are `{frame, text, src, durationMs}`. Frames are the take's own, at 30 fps; `pointScale` turns points into the recording's pixels.
- **`beats.json`:** `{bpm, entrySec, beats, downbeats}`, in seconds of the music file.
- **`levels.json`:** each voice clip's loudness per frame, 0 to 1, keyed by its path under `public/`.

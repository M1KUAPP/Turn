# Turn

For adults who can't rely on speech, Turn helps them answer in conversation by
listening to what the other person says and offering replies in their own saved
words, so they can take their turn before the conversation moves on.

## Evaluation

On September 23, 2026, at commit [`8ea25eb`][evaluation-commit], the team
evaluated 80 partner lines with a hosted decision model pinned to version 1.13.0.
The table measures the 64 lines with an acceptable saved reply beyond the fixed
Yes, No, and Not sure buttons. Top 1 and top 6 are the shares with an acceptable
phrase in those positions; chance is a random order of the same shortlist.

| Ranker                | Top 1                        | Top 6                      | Mean reciprocal rank |
| --------------------- | ---------------------------- | -------------------------- | -------------------- |
| chance                | 5%                           | 26%                        | 0.15                 |
| place                 | 1 of 64, 1.6% (0.3% to 8.3%) | 8 of 64, 13% (6.5% to 23%) | 0.06                 |
| keyword               | 10 of 64, 16% (8.7% to 26%)  | 15 of 64, 23% (15% to 35%) | 0.19                 |
| embeddings            | 14 of 64, 22% (14% to 33%)   | 29 of 64, 45% (34% to 57%) | 0.34                 |
| hosted decision model | 43 of 64, 67% (55% to 77%)   | 48 of 64, 75% (63% to 84%) | 0.72                 |

The hosted decision model's top 6 led embeddings by 29.7 percentage points;
the 95% paired interval was 17.2 to 42.2 points. See the [full report],
including uncertainty, risk, coverage, and latency. The lines, starter bank,
and acceptable-reply labels were written by Claude subagents at the team's
direction; no clinic or teammate had reviewed them when this evaluation ran.
The report records each writer's and labeler's role. The results describe this
dataset, whose model-written labels may favor a model-based ranker.

[evaluation-commit]: https://github.com/RevenueCat-M1KU/RevenueCat/commit/8ea25eb
[full report]: /eval/results.md

## Try Turn on an iOS 27 Simulator

Use a Mac with Xcode 27, an iOS 27 Simulator runtime, and Bun. Install Xcode's
command-line tools and select Xcode as the active developer directory. From a
clone of this repository:

```shell
bun install --frozen-lockfile
cd app
EXPO_PUBLIC_BUILD_KIND=simulator bunx expo run:ios --device
```

Select an iOS 27 Simulator when prompted and leave Metro running for this Debug
build. On the home screen, tap **Listen**, tap the caption's **Tap here to type
what they say**, enter **How was physio?**, and tap **Send**. Tap a reply to
hear it in a system voice. The current `main` branch ranks typed lines on the
phone; [relay-backed replies] and the [standalone Simulator release] are still
in progress. Live transcription needs a physical iPhone.

When the standalone release is published, its zip will contain `Turn.app`.
After unzipping it, boot an iOS 27 Simulator and install it with:

```shell
xcrun simctl install booted Turn.app
```

[relay-backed replies]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/48
[standalone Simulator release]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/63

## Test Store purchase

Turn Listen is a one-time Test Store purchase; speaking from the grid stays
free. The [purchase flow] is still being connected to the app, so the current
`main` build cannot complete a purchase. Once that flow lands, 20 answered
partner lines are free; the next line opens the paywall. A successful Test Store
purchase unlocks Listen mode, and **Settings → Turn Listen → Restore Purchases**
refreshes its status. A reinstall may reset the free-line count or purchase in
Test Store, so use **Restore Purchases** to check the current status.

[purchase flow]: https://github.com/RevenueCat-M1KU/RevenueCat/issues/53

## Privacy

In the app, open **Settings → About → Privacy notice**. Its text is bundled
with the app and reads without a network connection. Phrases, places, and tap
counts stay on the phone. Once relay-backed Listen mode is available, after
permission and the partner's agreement, the phone sends each partner line, the
current place, category names, and up to 40 candidate phrases through the
Cloudflare relay to a hosted decision model. Audio is not sent or stored. The
[privacy notice source] explains name tags, service records, purchases, and the
under-18 restriction.

[privacy notice source]: /app/src/content/privacy-notice.ts

## Run with your own keys

The app config includes the team's public Test Store key and relay address for
judging. To use your own relay and RevenueCat project, copy
[`worker/.dev.vars.example`](/worker/.dev.vars.example) to `worker/.dev.vars`
and fill in its three required secret values. The file is ignored by Git.
Set your RevenueCat project and entitlement IDs in
[`worker/wrangler.jsonc`](/worker/wrangler.jsonc), then start the local relay:

```shell
cd worker
bunx wrangler dev
```

In a second terminal, set `EXPO_PUBLIC_RELAY_URL=http://localhost:8787` and
your public Test Store key in `app/.env`, following
[`app/.env.example`](/app/.env.example), then build the app as above. Keep secret
keys in the relay; the app needs only the public Test Store key. The current
`main` build does not yet call the relay from typed Listen mode.

To run the evaluation with your own hosted-model and Cloudflare Workers AI
credentials, use the environment variable names documented in
[`eval/src/report.ts`](/eval/src/report.ts). It also needs a Mac with Swift.
Run it from a clean commit; it makes paid model calls and writes a separate
report and plots:

```shell
bun run eval --unnamed --out eval/your-results.md
```

Answers can vary between runs. The committed [evaluation report](/eval/results.md)
is the September 23 run, not a promise that a rerun has identical numbers.

## License

Turn's source is available under the [MIT license](/LICENSE).

# Release checklist

This is RELEASE-1's checklist: one row for every Must requirement in
[the product requirements](/docs/PRD.md), with the check it names, where that
check runs, its result, and the build it ran on. At the team lead's direction
it stands in for RELEASE-1's sign-off (#65), and every failure is listed. It
covers `main` at `c0a1180`, its test suites, the CI runs that build and drive
the app in the Simulator, and the device build a teammate installs on the
video iPhone.

Contents:

1.  [Summary](#summary)
1.  [Failures](#failures)
1.  [Waiting](#waiting)
1.  [Checks by area](#checks-by-area)
1.  [See also](#see-also)

## Summary

| Result          | Rows |
| --------------- | ---- |
| Pass            | 50   |
| Fail            | 13   |
| Not checked     | 1    |
| Pending         | 1    |
| Waiting on #<n> | 40   |
| RELEASE-4       | 7    |
| RELEASE-5       | 3    |

The 115 rows are the PRD's 115 Musts, the five release criteria among them.
The Simulator rows come from [run 36323630432], all 42 flows passing on
`c0a1180`. `Pending` is RELEASE-1 itself, until the rows waiting on the video
iPhone are in; `RELEASE-4` and `RELEASE-5` rows run before the Devpost
deadline and through judging, outside RELEASE-1.

## Failures

- **No paywall in the video's build: PAY-1, PAY-2, PAY-4, PAY-5, PAY-6,
  STATE-4, SET-1, COMPAT-2, and METRIC-4.** The relay counts the free lines
  and answers the 21st with `402`, but the app shows no count, opens no
  paywall, and ranks that line on the phone instead. Settings' Turn Listen
  and Restore Purchases open nothing, and no purchase exists for RevenueCat
  to show. #53 builds it after the recording; #59 buys in the Simulator.
- **The Simulator build never reaches the relay: LISTEN-4 and COMPAT-2.**
  Unsigned, it can't use the Keychain (`-34018`), so it never has a user ID;
  Settings says "Listen service: can't be reached", and every line is ranked
  on the phone, so scenario 10's "It was hard" can't appear.
  `fix/50-simulator-keychain` signs it to run locally. The device build is
  signed and unaffected.
- **Teammate reads that didn't happen: CONTENT-1, CONTENT-3, and
  CONTENT-4.** Their checks ask a teammate to read the starter phrases, to
  compare both versions of the consent texts with the requirements, and to
  compare the privacy notice with the TRD's data inventory. #75 and #76 closed
  as not planned. Tests check what a script can:
  `eval/test/starter-bank.test.ts`, `app/test/consent-strings.test.ts`, and
  `app/test/privacy-notice.test.ts`.
- **Checked nowhere: STATE-2.** No test or flow blocks the relay's address
  for scenario 7; unit tests cover the degraded note.

## Waiting

- **#92, the speaking grid on the video iPhone:** SPEAK-2, SPEAK-5, BANK-4,
  VOICE-4, and PERF-2.
- **#128, Listen mode on the video iPhone:** CONSENT-3, CONSENT-4, LISTEN-1,
  and LISTEN-2.
- **#136, the iPhone checks no other issue held:** SPEAK-7, VOICE-2,
  VOICE-3, CONSENT-5, LISTEN-3, LISTEN-7, ROW-6, STATE-1, and COMPAT-3.
- **#61, accessibility on the iPhone:** A11Y-1 to A11Y-6, and A11Y-8.
- **#62, privacy after a 10-minute session:** BANK-8, PLACE-3, ROW-2, PRIV-1
  to PRIV-3, and RELEASE-3.
- **#55, timing on the iPhone:** BANK-7, PERF-1, PERF-3, PERF-4, and PERF-5.
- **#119, the README:** EVAL-6 and RELEASE-2.
- **#65, the video build's install date:** COMPAT-4.

## Checks by area

Every section below names its requirements in the order
[the product requirements](/docs/PRD.md) lists them.

### The speaking grid

| ID      | Check                                                                                             | Where                                                                                                                                                                                             | Result          | Build           |
| ------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | --------------- |
| SPEAK-1 | On first launch, all six are on screen.                                                           | `app/maestro/home.yaml`; its first-launch screenshot shows the place picker, Listen, the strip, the row, the grid by category, and Type                                                           | Pass            | run 36323630432 |
| SPEAK-2 | Tap two phrases in quick succession; only the second finishes.                                    | `app/test/speech-controller.test.ts`, "a second tap stops the first and ignores stale completion"; `app/test/speech-controller.test.ts`, "the newest rapid tap wins while a stop is pending"; #92 | Waiting on #92  | video build     |
| SPEAK-3 | Speak a new sentence, then find it under Typed; speak it again, and it isn't added twice.         | `app/maestro/bank-2-actions.yaml` speaks a typed sentence and finds Typed; `app/test/bank.test.ts`, "saves typed phrases with trimming, deduplication, length limits, and bank order"             | Pass            | run 36323630432 |
| SPEAK-4 | At Home, type "wa"; saved phrases such as "Water, please" appear, and "Wait, I'm typing" doesn't. | `app/test/bank.test.ts`, "matches phrases by word prefix with current place priority, bank order ties, strip excluded, max 6"                                                                     | Pass            | c0a1180         |
| SPEAK-5 | In Airplane Mode, and with the relay's address blocked, every phrase and typed sentence speaks.   | `app/test/speech-controller.test.ts`, "speaks and repeats unsaved typed text without recording a phrase tap"; #92                                                                                 | Waiting on #92  | video build     |
| SPEAK-7 | With the grid on any category, each strip phrase speaks with one tap.                             | `app/maestro/speak-7-strip.yaml` rewords a strip phrase but taps none to speak; #136 does                                                                                                         | Waiting on #136 | video build     |

### The phrase bank

| ID     | Check                                                                                                                            | Where                                                                                                                                                                                                                | Result         | Build           |
| ------ | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | --------------- |
| BANK-1 | Edit a starter phrase and relaunch; the edit stays.                                                                              | `app/maestro/bank-1-persistence.yaml`                                                                                                                                                                                | Pass           | run 36323630432 |
| BANK-2 | Each action in the editor, and a 13th category can't be added.                                                                   | `app/maestro/bank-2-actions.yaml`: add, rename, and move, and "You can have up to 12 categories." with no Add category                                                                                               | Pass           | run 36323630432 |
| BANK-3 | A 201st character can't be typed in the editor.                                                                                  | `app/maestro/bank-3-character-limit.yaml`: "0 characters left", 200 characters kept, never 201                                                                                                                       | Pass           | run 36323630432 |
| BANK-4 | Change the place and speak ten phrases; the grid is unchanged.                                                                   | `app/test/bank.test.ts`, "publishes bank edits and preserves visible order after taps"; #92                                                                                                                          | Waiting on #92 | video build     |
| BANK-5 | The editor offers no delete for Yes, No, Not sure, or the body and pain category.                                                | `app/maestro/bank-5-fixed.yaml`                                                                                                                                                                                      | Pass           | run 36323630432 |
| BANK-6 | Speak a phrase that no line has suggested three times; with no other signal, it enters the next shortlist among the most-tapped. | `shared/test/shortlist.test.ts`, "takes a phrase no line has suggested among the most-tapped once it has the taps (BANK-6)"                                                                                          | Pass           | c0a1180         |
| BANK-7 | Seed 2,000 phrases and run both checks.                                                                                          | `shared/test/shortlist-speed.test.ts`, "picks a shortlist from 2,000 phrases within 50 ms (BANK-7, PERF-4)"; `app/test/bank.test.ts`, "the debug action seeds 2,000 phrases without duplicating them"; PERF-3 in #55 | Waiting on #55 | video build     |
| BANK-8 | A capture of the app's traffic shows no other phrase text.                                                                       | #62                                                                                                                                                                                                                  | Waiting on #62 | video build     |

### Places

| ID      | Check                                                                                              | Where                                                                                                                                   | Result         | Build       |
| ------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ----------- |
| PLACE-1 | Pick Clinic, relaunch, and Clinic is still chosen.                                                 | `app/test/bank.test.ts`, "remembers the chosen place across launches and rejects unknown places"; `app/maestro/places.yaml` adds Clinic | Pass           | c0a1180     |
| PLACE-2 | The app's Info.plist has no location usage key, and iOS Settings shows no Location entry for Turn. | `app/test/config.test.ts`, "uses the design copy for permissions and a color-only launch screen"                                        | Pass           | c0a1180     |
| PLACE-3 | A captured request holds the name and nothing else about places.                                   | `app/test/relay-ranker.test.ts`, "tags names across fields and sends the 40 candidates in order"; #62                                   | Waiting on #62 | video build |

### Voices

| ID      | Check                                                                                                                                            | Where                                                                                                                                                                     | Result          | Build           |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | --------------- |
| VOICE-1 | Preview two voices.                                                                                                                              | `app/maestro/voice.yaml`: two previews, then Samantha kept across a relaunch                                                                                              | Pass            | run 36323630432 |
| VOICE-2 | On an iPhone with a Personal Voice, allow and deny; on the Simulator, see the explanation.                                                       | `app/maestro/voice.yaml` sees the Simulator's explanation; #136 allows and denies a Personal Voice                                                                        | Waiting on #136 | video build     |
| VOICE-3 | The slowest and fastest steps are audibly different.                                                                                             | `app/test/voice-settings.test.ts`, "stores the %s speech rate as %s", stores the five steps; hearing them needs the iPhone, which no device issue holds; #92 could add it | Waiting on #136 | video build     |
| VOICE-4 | In Listen mode with the switch on silent, a phrase is heard from the bottom speaker; outside it, with headphones connected, from the headphones. | #92                                                                                                                                                                       | Waiting on #92  | video build     |

### Permission and consent

| ID        | Check                                                                    | Where                                                                                                                                                                                                                             | Result          | Build           |
| --------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | --------------- |
| CONSENT-1 | Read the step on a fresh install.                                        | `app/maestro/consent-step.yaml`                                                                                                                                                                                                   | Pass            | run 36323630432 |
| CONSENT-2 | Choose "Not now", speak a phrase, then turn Listen mode on again.        | `app/maestro/consent-not-now.yaml`: Not now, Yes speaks, and Listen shows the step again                                                                                                                                          | Pass            | run 36323630432 |
| CONSENT-3 | Withdraw during Listen mode; the light goes out, and no request follows. | `app/test/consent.test.ts`, "withdrawal ends Listen mode and blocks lines until permission is granted again"; `app/maestro/consent-withdraw.yaml`; #128                                                                           | Waiting on #128 | video build     |
| CONSENT-4 | Tap "They said no"; the iOS microphone indicator never appears.          | `app/test/consent.test.ts`, "waits for They agreed before starting the engine and ends on partner decline"; `app/maestro/consent-decline.yaml`; #128                                                                              | Waiting on #128 | video build     |
| CONSENT-5 | Pause and resume; the iOS indicator follows.                             | `app/test/listen-control.test.ts`, "paused, it resumes without the card, with End beside it", covers the control; the iOS indicator needs the iPhone, and #57's check went to no device issue; #128 could add it                  | Waiting on #136 | video build     |
| CONSENT-6 | With the switch on, type a line; the relay's logs show no request.       | `app/maestro/consent-under18.yaml`; `app/test/consent.test.ts`, "keeps under-18 mode across a new controller on the same database and blocks mic and line requests"                                                               | Pass            | run 36323630432 |
| CONSENT-7 | Turn the setting on, relaunch, and the texts name TypeSafe.              | `worker/test/config.test.ts`, "follows the naming setting and the switch at the next request (CONSENT-7, STATE-3)"; `app/test/consent-strings.test.ts`, "returns the exact permission step and card copy in both naming versions" | Pass            | c0a1180         |

### Listening

| ID       | Check                                                                                                                      | Where                                                                                                                                                                                                                                                               | Result          | Build           |
| -------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | --------------- |
| LISTEN-1 | Once the model is installed, in Airplane Mode, the caption still follows a partner's speech.                               | #128                                                                                                                                                                                                                                                                | Waiting on #128 | video build     |
| LISTEN-2 | Say two sentences with a pause; two lines are ranked.                                                                      | `app/test/live-session.test.ts`, "ends one line after 500 ms of silence and resets the window for new words and voice"; `app/test/live-session.test.ts`, "Done ends and ranks an open line once using the engine stamp and ranking time"; #128                      | Waiting on #128 | video build     |
| LISTEN-3 | Scenario 12.                                                                                                               | `app/test/listen-audio-session.test.ts`, "while capturing, beforeSpeak() calls the engine endLine() before muteForSpeech(true)", covers the gate; scenario 12 needs the iPhone, and #58's check went to no device issue; #128 could add it                          | Waiting on #136 | video build     |
| LISTEN-4 | Scenario 10.                                                                                                               | `app/maestro/listen.yaml` sends a typed line, but the unsigned Simulator build can't use the Keychain (`-34018`), never reaches the relay, and ranks every line on the phone, so "It was hard" can't answer "How was physio?"; `fix/50-simulator-keychain` signs it | Fail            | run 36323630432 |
| LISTEN-5 | The line "Did Anna call?" and the phrase "Anna is my sister" reach the relay as `[PERSON 1]` in both, with "Anna" nowhere. | `app/test/tags.test.ts`, "uses the same person tag in the partner line and a candidate"; `app/test/relay-ranker.test.ts`, "tags names across fields and sends the 40 candidates in order"                                                                           | Pass            | c0a1180         |
| LISTEN-6 | A typed line of 400 characters reaches the relay as its last 300.                                                          | `app/test/tags.test.ts`, "tags before keeping the line's last 300 code points"                                                                                                                                                                                      | Pass            | c0a1180         |
| LISTEN-7 | Switch apps; the iOS microphone indicator goes out.                                                                        | `app/test/listen-lifecycle.test.ts`, "only background pauses; active leaves it paused and cleanup removes the listener", covers the pause; the indicator needs the iPhone, and #57's check went to no device issue; #128 could add it                               | Waiting on #136 | video build     |
| LISTEN-8 | Wait two minutes; the caption is gone.                                                                                     | `app/test/live-session.test.ts`, "a line caption expires exactly two minutes after endedAt while its reply row stays"                                                                                                                                               | Pass            | c0a1180         |
| LISTEN-9 | On the Simulator, the message and the field appear.                                                                        | `app/maestro/listen.yaml`: "Mic off" and "Tap here to type what they say." after They agreed                                                                                                                                                                        | Pass            | run 36323630432 |

### The reply row

| ID     | Check                                                                                    | Where                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Result          | Build       |
| ------ | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------- |
| ROW-1  | The grid's first button doesn't move across every state of the row.                      | `app/test/home-layout.test.ts`, "keeps the row at 258 points with two columns on ordinary phones"; `shared/test/row.test.ts`, "shows the phrases at or above the floor in a row, highest first (ROW-3)"                                                                                                                                                                                                                                                                     | Pass            | c0a1180     |
| ROW-2  | A captured request.                                                                      | `app/test/relay-ranker.test.ts`, "tags names across fields and sends the 40 candidates in order"; `shared/test/shortlist.test.ts`, "never holds the fixed buttons or the strip's phrases, wherever they'd qualify"; #62                                                                                                                                                                                                                                                     | Waiting on #62  | video build |
| ROW-3  | Replay recorded answers at 0.9, 0.7, and 0.5, and a pain line and a consent line at 0.9. | `shared/test/row.test.ts`, "shows a top phrase above the big-button bar as the big button (ROW-3)"; `shared/test/row.test.ts`, "shows the phrases at or above the floor in a row, highest first (ROW-3)"; `shared/test/row.test.ts`, "changes nothing when no phrase reaches the floor (ROW-3)"; `shared/test/row.test.ts`, "gives a body-pain line a row, never a big button (ROW-3)"; `shared/test/row.test.ts`, "gives a consent line a row, never a big button (ROW-3)" | Pass            | c0a1180     |
| ROW-4  | Scenario 2.                                                                              | `shared/test/row.test.ts`, "puts Yes, No, and Not sure in slots 1 to 3 for a yes-or-no question, and never a big button (ROW-4)"; `app/test/typed-listen.test.ts`, "yes-or-no lines put the fixed buttons first and never show a big button"                                                                                                                                                                                                                                | Pass            | c0a1180     |
| ROW-5  | Replay recorded answers that shift by less, and by more, than the margin.                | `shared/test/row.test.ts`, "moves nothing for a shift smaller than the margin"; `shared/test/row.test.ts`, "lets a phrase that beats the lowest shown by the margin take only its slot"; `eval/test/replay.test.ts`, "counts slot changes: steady slots, a phrase that beats the lowest by the margin, and a hold"                                                                                                                                                          | Pass            | c0a1180     |
| ROW-6  | Leave a big button untouched for a minute; nothing speaks.                               | no test or flow; #136 leaves a big button a minute                                                                                                                                                                                                                                                                                                                                                                                                                          | Waiting on #136 | video build |
| ROW-7  | Delay one answer past the next line's; the older one never shows.                        | `shared/test/row.test.ts`, "drops an answer for a line older than the newest (ROW-7)"; `app/test/typed-remote.test.ts`, "a newer line aborts and defeats a late remote answer"                                                                                                                                                                                                                                                                                              | Pass            | c0a1180     |
| ROW-8  | Change a value in the relay; the next line follows it.                                   | `worker/test/lines.test.ts`, "follows a changed policy in the next answer, with no app build (ROW-8)"; `worker/test/config.test.ts`, "lays the changed policy values over the starting policy (ROW-8)"                                                                                                                                                                                                                                                                      | Pass            | c0a1180     |
| ROW-9  | After "What do you want for lunch?", the food tab is marked.                             | `shared/test/row.test.ts`, "returns the topic at or above the floor for its tab, and none below it (ROW-9)"                                                                                                                                                                                                                                                                                                                                                                 | Pass            | c0a1180     |
| ROW-10 | Tap Clear.                                                                               | `shared/test/row.test.ts`, "empties the six slots and forgets the remembered big phrase (ROW-10)"; `app/test/live-session.test.ts`, "End stops the engine and clears the caption and row"                                                                                                                                                                                                                                                                                   | Pass            | c0a1180     |

### Offline and degraded states

| ID      | Check                                         | Where                                                                                                                                                                                                                                                       | Result          | Build       |
| ------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------- |
| STATE-1 | Scenario 6.                                   | `shared/test/shortlist.test.ts`, "fills six slots, the place's phrases first, and never shows a big button (STATE-1)", covers the ranking; scenario 6 needs the iPhone in Airplane Mode, and #128's Airplane Mode step doesn't ask for the row and its note | Waiting on #136 | video build |
| STATE-2 | Scenario 7, with the relay's address blocked. | `app/test/live-session.test.ts`, "shows the degraded notice after two relay failures"; scenario 7 with the relay's address blocked is in no flow or device issue                                                                                            | Not checked     | —           |
| STATE-3 | Turn Jev off in the relay and send a line.    | `worker/test/lines.test.ts`, "answers 503 jev_off, reaching neither the object nor Jev, while the switch is off (STATE-3)"; `app/test/typed-remote.test.ts`, "two failures degrade, a success clears, and Jev off degrades immediately"                     | Pass            | c0a1180     |
| STATE-4 | Scenario 8.                                   | `worker/test/count.test.ts`, "count down with each answered line, and the 21st gets 402 paywall (STATE-4)"; #53                                                                                                                                             | Fail            | —           |

### The paywall and purchases

| ID    | Check                                                                            | Where                                                                                                                                     | Result    | Build   |
| ----- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| PAY-1 | After 20 answered lines, the 21st opens the paywall.                             | `worker/test/count.test.ts`, "count down with each answered line, and the 21st gets 402 paywall (STATE-4)"; #53; #92                      | Fail      | —       |
| PAY-2 | Close the paywall, then speak a phrase.                                          | #53                                                                                                                                       | Fail      | —       |
| PAY-3 | The dashboard, and the paywall's price.                                          | #15, "rc offerings verify shows the product, USD 24.99 price, entitlement, and package linked"; #26                                       | Pass      | —       |
| PAY-4 | Scenario 8.                                                                      | `worker/test/entitlement.test.ts`, "let a line with refresh skip a fresh no once a minute (PAY-4)"; #53                                   | Fail      | —       |
| PAY-5 | Choose each failure outcome Test Store offers.                                   | #53                                                                                                                                       | Fail      | —       |
| PAY-6 | Scenario 9.                                                                      | #53                                                                                                                                       | Fail      | —       |
| PAY-7 | A request with a fresh ID's 21st line and no purchase gets the paywall response. | `worker/test/entitlement.test.ts`, "answer a fresh ID's 21st line 402, then Jev's answer for a line with refresh after a purchase"        | Pass      | c0a1180 |
| PAY-8 | The product's type in the dashboard on September 22.                             | #15, "a headless Test Store purchase for the setup-only user turn-setup-check-20260923 granted the listen entitlement with no expiration" | Pass      | —       |
| PAY-9 | On September 25, buy in the Simulator build, or run 25 lines in it.              | `worker/wrangler.jsonc`, `SIMULATOR_UNLIMITED` is `"false"`; #59 and #53 decide how judges get past 20 lines                              | RELEASE-5 | —       |

### Settings

| ID    | Check                     | Where                                                                                                                                                        | Result | Build           |
| ----- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | --------------- |
| SET-1 | Each entry opens.         | `app/maestro/settings.yaml`, `licenses.yaml`, `privacy.yaml`, `places.yaml` open the other entries; Turn Listen and Restore Purchases open nothing until #53 | Fail   | —               |
| SET-2 | Open it in Airplane Mode. | `app/maestro/privacy.yaml` opens it; its text is bundled in `app/src/content/privacy-notice.ts`, so it needs no network                                      | Pass   | run 36323630432 |

### Content requirements

| ID        | Check                                                                   | Where                                                                                                                                                                                  | Result | Build   |
| --------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------- |
| CONTENT-1 | A script counts phrases and lengths, and a teammate reads every phrase. | `eval/test/starter-bank.test.ts`, "holds 140 to 160 phrases in about ten categories, none over 120 characters (CONTENT-1)"; #75; #18                                                   | Fail   | —       |
| CONTENT-2 | Each place has at least ten phrases.                                    | `eval/test/starter-bank.test.ts`, "starts with Home, Clinic, Shop, and Out, each with at least ten phrases (CONTENT-2)"                                                                | Pass   | c0a1180 |
| CONTENT-3 | A teammate compares each version with the requirements.                 | `app/test/consent-strings.test.ts`, "returns the exact permission step and card copy in both naming versions"; #46                                                                     | Fail   | —       |
| CONTENT-4 | A teammate compares it with the TRD's data inventory.                   | `app/test/privacy-notice.test.ts`, "%s version covers the data inventory in plain words", checks the items; the teammate's comparison hasn't happened, as with CONTENT-1 and CONTENT-3 | Fail   | —       |

### Evaluation requirements

| ID     | Check                                                        | Where                                                                                                                                                                                                                                                                                | Result          | Build   |
| ------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------- | ------- |
| EVAL-1 | A script counts them and prints the labelers' agreement.     | `eval/test/count.test.ts`, "prints each EVAL-1 quota with its count, and exits 1 when one falls short"; #77, "bun run eval:count now meets every EVAL-1 quota (16 with none, 37 yes-or-no, 30 on pain or health, 10 on consent, and 49 that share no word) and exits 0"              | Pass            | c0a1180 |
| EVAL-2 | The history shows the settings committed before the results. | `eval/test/frozen.test.ts`, "refuses to score any of the 80 lines with uncommitted changes, before any ranker runs (EVAL-2)" and "keeps Jev's settings as the first run on the 80 lines used them (EVAL-2)"; #40, where nothing of Jev's changed after the results                   | Pass            | c0a1180 |
| EVAL-3 | Run it and read the table.                                   | `eval/test/report.test.ts`, "scores all seven rankers on the same lines, in every group and step (EVAL-3, EVAL-8)"; `eval/results.md`                                                                                                                                                | Pass            | c0a1180 |
| EVAL-4 | The table shows the interval.                                | `eval/test/report.test.ts`, "gives Jev minus embeddings in top 6 with its paired interval, matching the table's counts (EVAL-4)"; `eval/results.md`; Jev leads, so the re-ranking step doesn't run                                                                                   | Pass            | c0a1180 |
| EVAL-5 | The script lists every big button on those lines.            | `eval/test/report.test.ts`, "lists every big button on a yes-or-no, pain, or consent line, and whether it was right (EVAL-5)"; #40, "The report lists one: 'Yes, go ahead' on line-05 … in 1 of Jev's 4 answers, and it's acceptable. None is wrong, so the relay's POLICY stays {}" | Pass            | c0a1180 |
| EVAL-6 | Read the README.                                             | the draft README in #119 names the date, the model pin, and the commit; it isn't merged                                                                                                                                                                                              | Waiting on #119 | —       |

### Performance

| ID     | Check                                                 | Where                                                                                                                                                   | Result         | Build       |
| ------ | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ----------- |
| PERF-1 | Timings from at least 50 replayed lines.              | #55                                                                                                                                                     | Waiting on #55 | video build |
| PERF-2 | Timings from 50 taps.                                 | #92                                                                                                                                                     | Waiting on #92 | video build |
| PERF-3 | Timings from ten cold launches on the video's iPhone. | #55                                                                                                                                                     | Waiting on #55 | video build |
| PERF-4 | Timings from 50 lines.                                | `shared/test/shortlist-speed.test.ts`, "picks a shortlist from 2,000 phrases within 50 ms (BANK-7, PERF-4)", runs on Linux; the phone's timing is #55's | Waiting on #55 | video build |
| PERF-5 | Count cut-off lines among at least 50 replayed lines. | #55                                                                                                                                                     | Waiting on #55 | video build |

### Availability

| ID      | Check                    | Where                                      | Result    | Build |
| ------- | ------------------------ | ------------------------------------------ | --------- | ----- |
| AVAIL-1 | The daily log of checks. | #70, the daily relay check through judging | RELEASE-5 | —     |

### Privacy

| ID     | Check                                                                     | Where                                                                                                                                   | Result         | Build       |
| ------ | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ----------- |
| PRIV-1 | A capture of the app's traffic, and the app's container, after a session. | #62                                                                                                                                     | Waiting on #62 | video build |
| PRIV-2 | The relay's storage and logs after a session.                             | `worker/test/logs.test.ts`, "holds one line per request and no text (METRIC-1, PRIV-2)"; the storage and logs after a session are #62's | Waiting on #62 | video build |
| PRIV-3 | The relay's logs and a capture.                                           | #62                                                                                                                                     | Waiting on #62 | video build |
| PRIV-4 | The code sets none.                                                       | `app/package.json` at `c0a1180` has no RevenueCat SDK, so nothing sets attributes; #53 adds the SDK with a test that it sets none       | Pass           | c0a1180     |
| PRIV-5 | The dependency list.                                                      | `app/package.json`'s dependencies at `c0a1180`: Expo, React Native, and their modules, with no analytics or advertising SDK             | Pass           | c0a1180     |

### Security

| ID    | Check                                                             | Where                                                                                                                                                                                                                                                                                                           | Result | Build   |
| ----- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------- |
| SEC-1 | A secret scan of the full history before it goes public.          | #66: gitleaks 8.30.1 and trufflehog 3.97.9 over the full public history on September 27, clean; the Test Store key is the only RevenueCat key                                                                                                                                                                   | Pass   | —       |
| SEC-2 | An oversized field gets a 400.                                    | `worker/test/lines.test.ts`, "refuses a line of 301 characters with 400 invalid_request, reaching neither the object nor Jev"; `shared/test/jev.test.ts`, "pins the model and puts only the line and the place in the state (SEC-2)"                                                                            | Pass   | c0a1180 |
| SEC-3 | The 31st in a minute gets a 429.                                  | `worker/test/limits.test.ts`, "answers 30 requests from one ID in a minute, and gives the 31st 429 with no line claimed or sent"; #98, "150 configuration requests from one address, across ten check users, eight at a time, got exactly 120 200s and 30 429s, each with Retry-After: 60, within 9.59 seconds" | Pass   | c0a1180 |
| SEC-4 | Force each error and read the response.                           | `worker/test/lines.test.ts`, "answers 503 jev_unavailable, with the code alone, when Jev is %s after one retry (SEC-4)"                                                                                                                                                                                         | Pass   | c0a1180 |
| SEC-5 | Lower the budget to 3 in a test and send 4 lines.                 | `worker/test/budget.test.ts`, "answer 3 lines at a budget of 3, and give the 4th 503 jev_unavailable with no call to Jev"                                                                                                                                                                                       | Pass   | c0a1180 |
| SEC-6 | Resend a used line ID with new text, and the relay answers `409`. | `worker/test/count.test.ts`, "answer a used line ID sent again with new text 409 duplicate, with no call to Jev (SEC-6)"                                                                                                                                                                                        | Pass   | c0a1180 |

### Accessibility

| ID     | Check                                                                                                                              | Where                                                                                                                                                                                                                                                                  | Result         | Build       |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ----------- |
| A11Y-1 | Measure in the Accessibility Inspector.                                                                                            | `app/test/home-layout.test.ts`, "keeps the row at 258 points with two columns on ordinary phones"; #92                                                                                                                                                                 | Waiting on #61 | video build |
| A11Y-2 | With VoiceOver on.                                                                                                                 | `app/test/listen-control.test.ts`, "listening, it pauses, says so to VoiceOver, and has no End beside it"; #92                                                                                                                                                         | Waiting on #61 | video build |
| A11Y-3 | With each.                                                                                                                         | #61                                                                                                                                                                                                                                                                    | Waiting on #61 | video build |
| A11Y-4 | At the largest size, every phrase reads whole in the grid, and a long one in the row reads whole to VoiceOver.                     | `app/test/home-layout.test.ts`, "gives AX5 text one column and two full lines in each fixed slot"; `app/test/screen-accessibility.test.ts`, "phrase rows name the phrase, expose details as a value, and retain named actions"; `app/maestro/a11y-8-reorder.yaml`; #92 | Waiting on #61 | video build |
| A11Y-5 | Walk every scenario with taps only.                                                                                                | `app/test/home-layout.test.ts`, "pages one visible screen and clamps at either end"; #61                                                                                                                                                                               | Waiting on #61 | video build |
| A11Y-6 | With Reduce Motion on.                                                                                                             | `app/test/accessibility-native.test.ts`, "reads the five system settings"; #61                                                                                                                                                                                         | Waiting on #61 | video build |
| A11Y-7 | Measure every color pair.                                                                                                          | `app/test/theme.test.ts`, "meets every contrast floor in every appearance"; #26's measure of the paywall's pairs; #61 checks again on the iPhone                                                                                                                       | Pass           | c0a1180     |
| A11Y-8 | On an iPhone, say "Tap It was hard", tap a cut-off phrase in the row with Voice Control, and reorder a phrase with Switch Control. | `app/test/screen-accessibility.test.ts`, "phrase rows name the phrase, expose details as a value, and retain named actions"; `app/maestro/a11y-8-reorder.yaml`; #92                                                                                                    | Waiting on #61 | video build |

### Compatibility

| ID       | Check                               | Where                                                                                                                                                         | Result          | Build           |
| -------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | --------------- |
| COMPAT-1 | Build and run on iOS 26 and iOS 27. | #22, "installed Apple iOS 26.0 Simulator runtime (23A343) in Xcode 27.0 … Build Succeeded"; [run 36311733499]                                                 | Pass            | run 36311733499 |
| COMPAT-2 | Scenario 10.                        | `app/maestro/listen.yaml` covers the field and the row, but the row is ranked on the phone until `fix/50-simulator-keychain` lands, and the paywall until #53 | Fail            | run 36323630432 |
| COMPAT-3 | VOICE-2 on both kinds.              | VOICE-2's iPhone half, in #136                                                                                                                                | Waiting on #136 | video build     |
| COMPAT-4 | The build's install date.           | whoever installs the video build records its date on #65; #80's profile runs from September 23 to 30                                                          | Waiting on #65  | video build     |

### Measurement requirements

| ID       | Check                          | Where                                                                                                                                                                                   | Result | Build   |
| -------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------- |
| METRIC-1 | Read the logs after a session. | `worker/test/logs.test.ts`, "holds one line per request and no text (METRIC-1, PRIV-2)"; #24, "wrangler tail showed one line for each of 4 requests"                                    | Pass   | c0a1180 |
| METRIC-2 | Run it on a day's logs.        | `worker/test/summary.test.ts`, "counts lines answered, paywall responses, failures, each outcome, and input tokens"; #31, "On September 23, 2026 it read 85 log lines out of 85 events" | Pass   | c0a1180 |
| METRIC-4 | After a purchase.              | #53                                                                                                                                                                                     | Fail   | —       |

### Submission requirements

| ID       | Check                                                       | Where                         | Result    | Build |
| -------- | ----------------------------------------------------------- | ----------------------------- | --------- | ----- |
| SUBMIT-1 | GitHub shows the repository as public with the MIT license. | #66, #119                     | RELEASE-4 | —     |
| SUBMIT-2 | Someone outside the team follows it to a spoken reply.      | #68; the draft README in #119 | RELEASE-4 | —     |
| SUBMIT-3 | Install it on a clean Simulator.                            | #63; the draft README in #119 | RELEASE-4 | —     |
| SUBMIT-4 | Watch it logged out.                                        | #67                           | RELEASE-4 | —     |
| SUBMIT-5 | Devpost shows the entry as submitted.                       | #69                           | RELEASE-4 | —     |
| SUBMIT-6 | Search each for the names.                                  | #66                           | RELEASE-4 | —     |

### Release criteria

These five are the release criteria themselves, and they count among the 115
Musts.

| ID        | Check                                      | Where                                                                                                                                                          | Result          | Build       |
| --------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------- |
| RELEASE-1 | The checklist, signed off.                 | this file; #92, #128, #61, #62, #55                                                                                                                            | Pending         | —           |
| RELEASE-2 | The README's table and the relay's values. | the draft README in #119: its table's pin (1.13.0) and thresholds (0.6, 0.85, 0.15) match `worker/wrangler.jsonc` and both evaluation reports; it isn't merged | Waiting on #119 | —           |
| RELEASE-3 | The saved results.                         | #62                                                                                                                                                            | Waiting on #62  | video build |
| RELEASE-4 | Devpost, logged in.                        | #66, #67, #68, #69, #119                                                                                                                                       | RELEASE-4       | —           |
| RELEASE-5 | The daily log of checks.                   | #70                                                                                                                                                            | RELEASE-5       | —           |

## See also

- [Product requirements](/docs/PRD.md): the Musts this checklist records.
- [Technical requirements](/docs/TRD.md): how the first version is built, its
  [requirements traceability](/docs/TRD.md#requirements-traceability), its
  [testing](/docs/TRD.md#testing), and its
  [environments and release](/docs/TRD.md#environments-and-release).
- [The evaluation](/eval/results.md) and
  [the second run](/eval/results-extras.md).
- [The relay's configuration](/worker/wrangler.jsonc).
- #65, which this checklist is written for.

[run 36311733499]: https://github.com/M1KUAPP/Turn/actions/runs/36311733499
[run 36323630432]: https://github.com/M1KUAPP/Turn/actions/runs/36323630432

# Consent implementation plan

> **For agentic workers:** Write failing tests before each change. Issue #46,
> `docs/PRD.md` "Permission and consent", `docs/TRD.md` "Relay API",
> "Networking", and "Flows on the phone", and `docs/DESIGN.md` "The
> permission step", "The consent card", and "Strings the PRD leaves open" are
> the spec. Every rule lives in TypeScript behind ports faked in tests; screens
> stay thin. TypeScript is tested on Linux; a teammate reads the screens on a
> phone.

**Goal:** Ask the user's permission before anything leaves the phone, show the
partner the consent card each time Listen mode starts, keep the under-18
switch and everything it turns off, withdraw at once from Settings, and name
TypeSafe only when the relay's cached configuration says so.

**Architecture:** One `relay/config` client, grown from `naming.ts`, owns the
Keychain's app user ID, the three headers, and the cached configuration. A
`consent` module holds the two texts, both versions, and the state machine
behind ports faked in tests: when the step shows, what each answer does, the
card's flow, Read aloud, the under-18 switch, and withdrawal. Screens render
the controller's snapshot and call its methods. `/permission` is a form sheet,
`/consent` a full screen.

**Tech stack:** Expo SDK 57, Expo Router, `expo-secure-store`, `expo-crypto`,
SQLite's `setting` table, `expo-speech`, Vitest.

**Spec:** [Issue #46](https://github.com/RevenueCat-M1KU/RevenueCat/issues/46),
[Permission and consent](/docs/PRD.md#permission-and-consent),
[Relay API](/docs/TRD.md#relay-api),
[Networking](/docs/TRD.md#networking),
[the permission step](/docs/DESIGN.md#the-permission-step),
[the consent card](/docs/DESIGN.md#the-consent-card).

## Rules

- **The ID and the headers (CONSENT-1, PRIV-3).** One random version 4 UUID in
  the Keychain, created once and reused, and every request carries it, the
  app's version, and the build kind, exactly as `worker/src/request.ts:17-19`
  reads them: `X-Turn-User`, `X-Turn-Version`, `X-Turn-Build`, whose value is
  `device` or `simulator` from `app/app.config.ts:36`. `Content-Type` is
  `application/json` on POSTs only (`worker/src/request.ts:83`).
- **The configuration.** Fetched at launch and each time Listen mode is turned
  on, before the step or the card, and the last copy is kept; any failure,
  timeout, or bad shape keeps it, and with no copy the texts don't name
  TypeSafe (`app/src/relay/naming.ts:60-80` keeps this behaviour).
- **The step (CONSENT-1).** It shows the first time Listen mode is turned on,
  before any line leaves, and only that once: Allow writes the permission and
  its date; "Not now" writes nothing, leaves Listen mode off, and the step
  returns next time. It says what leaves, that names are swapped for tags, to
  whom, that audio and the rest of the bank never leave, and that the service
  may keep data to monitor it. Its title is "Before Listen mode starts", its
  link "Read the privacy notice", and "Allow" and "Not now" are two equal
  secondary buttons. The body keeps the design's words, split at its
  sentences into short paragraphs, as the step's section asks: what leaves
  and the tags; audio and the rest of the bank; what the service may keep.
- **The card (CONSENT-4).** It shows each time Listen mode starts, before the
  microphone. "They agreed" starts Listen mode, today the typed session,
  with the microphone to come in #49, and nothing starts before it; "They
  said no" leaves Listen mode off. The ticket also asks the card to have the
  user pause when others talk nearby, but the design has no words for it, so
  the card keeps the design's four facts and the pull request asks the team. Its lead, facts, and Read aloud
  are the design's, below. It holds the under-18 switch, and Read aloud
  speaks the lead and then the four facts, in the chosen voice, on one tap.
- **The under-18 switch (CONSENT-6).** It stays as set and takes effect at
  once, in or out of Listen mode. While it's on, no
  microphone, the Listen control shows "Mic off" with End beside it, the
  caption shows the note and "Tap here to type what they say.", the row's note
  is "Listen mode is off for this partner.", and a typed partner line is
  ranked on the phone and never sent, which the typed session already does.
- **Withdrawal (CONSENT-3).** Settings' Listen mode group shows "Allowed on"
  and its date with "Withdraw", or "Not allowed" with "Allow". Withdrawing
  deletes the permission, stops Listen mode at once, and blocks every line
  request until the user allows again, then says "Listen mode is off, and
  nothing more leaves this phone until you allow it again."
- **The naming (CONSENT-7).** `{service}` is "TypeSafe" or "a third-party AI
  service in the United States", following the cached configuration, with no
  copy meaning the second. Both texts have both versions, and CONTENT-3 signs
  them off.
- **The screens bend nothing.** No opacity on text, no
  `allowFontScaling={false}`, `numberOfLines` only in the row's slots and the
  caption, accessibility names equal to the visible text, 44-point targets, no
  drags, long presses, haptics, or animation.

## Task 1: The relay's ID, headers, and cached configuration

**Files:** `app/src/relay/config.ts` (from `app/src/relay/naming.ts`),
`app/test/relay-config.test.ts` (from `app/test/relay-naming.test.ts`),
`app/src/turn-context.tsx`.

- [x] Write failing tests with fakes: the ID is made once and reused, a saved
      non-UUID is replaced, every request carries all three headers, a good
      answer is cached, and a failure, a 3-second timeout, or a bad shape
      keeps the last copy and leaves `typesafeNamed()` false without one.
- [x] `createConfigClient(ports)` with the TRD's port shapes:
      `headers(): Record<string, string>`, `read(): Promise<Config>`,
      `typesafeNamed(): boolean`, `refresh(): Promise<Config>`, and
      `subscribe(listener)`, over `setting(key)`, `setSetting(key, value)`,
      `getItemAsync`, `setItemAsync`, `createId`, `request(url, init)`,
      `relayUrl`, `version`, and `buildKind`. Keep the whole `Config` under
      `relay_config`; keep the 3-second abort.
- [x] Call `refresh()` once at launch in the provider, and expose
      `typesafeNamed` from the client so `ready.typesafeNamed` keeps working
      for the privacy notice.
- [x] `rtk bun run --cwd app test -- relay-config.test.ts` and
      `rtk bun run --cwd app typecheck`.

## Task 2: The two texts, both versions

**Files:** `app/src/consent/strings.ts`, `app/test/consent-strings.test.ts`.

- [x] Write failing tests that pin every string exactly, in both versions, and
      that no string names TypeSafe when the configuration is off.
- [x] Export the design's words, from `/docs/DESIGN.md`: the step's title
      "Before Listen mode starts", its body with `{service}` (lines 1438-1443),
      the link "Read the privacy notice", and "Allow" and "Not now"; the
      card's lead "Can my phone listen while we talk?" and its four facts
      (lines 1445-1449); "Read aloud"; "My partner is under 18"; "They
      agreed" and "They said no"; `{service}` as above (lines 1386-1387); the
      under-18 words "Mic off", "Listen mode is off for this partner",
      "Tap here to type what they say." (lines 1230, 1409-1413); and
      Settings' "Allowed on", "Withdraw", "Not allowed", "Allow", and the
      after-Withdraw note (lines 1428-1429).
- [x] `permissionStep(typesafeNamed): Step` and `consentCard(typesafeNamed):
Card`, each with its ordered paragraphs and facts, shaped like
      `app/src/content/privacy-notice.ts`.
- [x] `rtk bun run --cwd app test -- consent-strings.test.ts`.

## Task 3: The consent controller

**Files:** `app/src/consent/controller.ts`, `app/test/consent.test.ts`.

- [x] Write failing tests with fakes for: the step showing once and returning
      after "Not now", with speaking still working; "Allow" writing the
      permission and its date; the card showing on every start and each
      answer's effect, with nothing started before "They agreed"; Read aloud
      speaking the lead and the four facts in order in the chosen voice; the
      under-18 switch surviving a new store on the same database and turning
      off the microphone, the request, and the card's effect; withdrawal
      stopping Listen mode at once and blocking requests until the user allows
      again; and each text following the configuration.
- [x] `createConsentController(ports)` with
      `snapshot(): ConsentState`, `subscribe(listener)`,
      `startListen(): Promise<'permission' | 'consent'>`, `allow(): Promise<void>`,
      `notNow(): void`, `partnerAgreed(): Promise<void>`, `partnerDeclined(): void`,
      `readAloud(): Promise<void>`, `setUnder18(on: boolean): Promise<void>`,
      `withdraw(): Promise<void>`, and `grant(): Promise<void>`, over
      `setting`, `setSetting`, `now`, `config` (the Task 1 client), `speech`,
      `listen` (start, end, and a `blocked()` check), and `navigate(route)`.
- [x] Refresh the configuration in `startListen()` before it answers, so both
      texts follow the copy just fetched; `startListen()` answers
      `'permission'` when no permission is saved and `'consent'` when one is,
      and never starts the session itself.
- [x] `rtk bun run --cwd app test -- consent.test.ts` and
      `rtk bun run --cwd app typecheck`.

## Task 4: The screens

**Files:** `app/src/screens/PermissionStepScreen.tsx`,
`app/src/screens/ConsentCardScreen.tsx`, `app/src/app/permission.tsx`,
`app/src/app/consent.tsx`, `app/src/app/_layout.tsx`,
`app/src/screens/HomeScreen.tsx`, `app/src/screens/SettingsScreen.tsx`,
`app/src/turn-context.tsx`.

- [x] `/permission` is a `formSheet` at full height with
      `headerTransparent: false` and a `surface` background, the title in
      `title2`, the body paragraphs in `body`, the privacy-notice link, and
      the equal pair of secondary buttons stacked from AX1. The link opens
      `/settings/privacy`.
- [x] `/consent` is a full screen on the board: the lead in
      `largeTitle-emphasized`, the four facts one to a line in `title2`, the
      under-18 switch in a list row, "Read aloud" as a secondary button, and
      the equal pair of "They agreed" and "They said no" within a thumb's
      reach. Every word is text, never an image.
- [x] Home's Listen control calls `startListen()` and pushes the route it
      answers; while the switch is on it shows "Mic off" with End, the caption
      shows the note and the typed line, and the row's empty note is the
      under-18 sentence.
- [x] Settings' Listen mode group holds the permission row with "Withdraw" or
      "Allow", the under-18 switch, and the after-Withdraw note.
- [x] Follow the design's rules that do not bend, as Task 3's last rule says.
- [x] `rtk bun run --cwd app typecheck` and `rtk bun run lint`.

## Task 5: Handoff

- [ ] `rtk graphify update .`, then `rtk bun run test`, `rtk bun run typecheck`,
      and `rtk bun run lint` (CONSENT-1 to CONSENT-7).
- [ ] Bundle for iOS with `expo export:embed` (CONSENT-1).
- [ ] Commit, and open a draft pull request stacked on the Personal Voice
      branch (CONSENT-1).
- [ ] A teammate reads the step on a fresh install; "Allow" and "Not now" are
      the same size and style (CONSENT-1).
- [ ] A teammate chooses "Not now", speaks a phrase, turns Listen mode on, and
      the step returns (CONSENT-2).
- [ ] A teammate withdraws during Listen mode; Listen mode ends at once
      (CONSENT-3).
- [ ] A teammate taps "They said no"; Listen mode stays off (CONSENT-4).
- [ ] A teammate taps Read aloud and hears the lead and the four facts in the
      chosen voice (CONSENT-4).
- [ ] With the under-18 switch on, the control shows "Mic off" with End, and a
      typed line is ranked on the phone with no request in the relay's logs
      (CONSENT-6).
- [ ] With `TYPESAFE_NAMED` on in the relay and a relaunch, both texts name
      TypeSafe (CONSENT-7).
- [ ] A teammate compares each version of the step and the card with
      CONSENT-1 and CONSENT-4 and signs off (CONTENT-3).

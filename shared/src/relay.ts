import type { Policy, Ranking } from './row'

/** The most a request may hold, which the relay checks and the app cuts to (SEC-2). Lengths count characters. */
export const limits = {
  /** The partner's line, with its names as tags (LISTEN-6). */
  line: 300,
  /** The place's name and each category's name (PLACE-1, BANK-2). */
  name: 40,
  categories: 12,
  candidates: 40,
  /** Each candidate's text (BANK-3). */
  text: 200,
  /** Each category's and candidate's id. */
  id: 64,
  /** The whole body, in bytes. */
  bytes: 16 * 1024
}

/** A category the line's topic may be: its id in the phone's bank, described by the name the user gave it. */
export type Category = { id: string; name: string }

/** A phrase for Jev to score against the line, by its id in the phone's bank. */
export type Candidate = { id: string; text: string }

/** What `GET /v1/config` returns, which the app caches at launch and when Listen mode starts. */
export type Config = {
  /** Whether lines go to Jev; when off, the phone ranks every line (STATE-3). */
  jevOn: boolean
  /** Whether the permission step, the consent card, and the privacy notice name TypeSafe (CONSENT-7). */
  typesafeNamed: boolean
  /** The free lines this user has left: 20 for a new user (PAY-1). */
  freeLinesLeft: number | null
  policy: Policy
}

/** What `POST /v1/lines` takes: one partner line, tagged and cut to the limits. */
export type LineRequest = {
  /** A random UUID, so a repeated request never counts twice. */
  lineId: string
  /** Increases with every line on this install, so the app can drop a late answer (ROW-7). */
  seq: number
  /** The partner's line, with its names as tags (LISTEN-5). */
  line: string
  /** The current place's name, tagged like the line (PLACE-3). */
  place: string
  /** The grid's categories, which the line's topic is chosen from, with `consent`. */
  categories: readonly Category[]
  /** The shortlist, in its order (ROW-2). */
  candidates: readonly Candidate[]
  /** The first line after a purchase, which skips a cached no (PAY-4). */
  refresh?: boolean
}

/** Jev's answer to one line, with the policy the row's rules follow. */
export type LineAnswer = Pick<Ranking, 'kind' | 'topic'> & {
  seq: number
  /** Each candidate's score, from 0 to 1, by id. The app puts them back in the shortlist's order, which breaks ties. */
  scores: Readonly<Record<string, number>>
  policy: Policy
  /** Null once the user is entitled. */
  freeLinesLeft: number | null
  /** Milliseconds spent in Jev and in all. */
  ms: { jev: number; total: number }
}

/** The code in every error's body, `{ "error": code }`, which carries nothing else (SEC-4). */
export type ErrorCode =
  | 'invalid_request'
  | 'not_found'
  | 'duplicate'
  | 'paywall'
  | 'rate_limited'
  | 'jev_off'
  | 'jev_unavailable'
  | 'internal'

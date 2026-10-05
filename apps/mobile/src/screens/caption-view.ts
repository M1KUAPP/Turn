import { consentWords } from '../consent/strings'
import type { EngineState } from '../listen/engine'
import { listenStrings } from '../listen/strings'
import { purchaseNotes } from '../purchases/store'

export type CaptionInput = {
  active: boolean
  phase: EngineState
  caption: { label: string; words: string; note: string | null }
  assetProgress: number | null
  under18: boolean
  purchaseNote: string | null
  rowAnswers: number
}

export type CaptionView = {
  // off, mic-off, and paused set a message beside a symbol disc; words is the label and the partner's words.
  kind: 'off' | 'model' | 'mic-off' | 'paused' | 'opening' | 'words'
  micOn: boolean
  lineOpen: boolean
  label: string | null
  words: string
  note: string | null
  noteSymbol: 'wifi.slash' | 'iphone' | 'lock.open.fill' | 'info.circle'
  discSymbol: 'ear' | 'keyboard' | 'pause.fill' | 'lock.open.fill'
  button: 'done' | 'clear' | null
  accessibilityLabel: string
}

const stillAnsweringPrefix = listenStrings.stillAnswering('').slice(0, -1)

/** What the caption shows (DESIGN, the home screen, state by state): Listen mode off, the speech model's progress, the
 * mic off for a partner under 18 or without live transcription, paused, "Listening" until the first words, and then
 * the partner's words under their label, with a note pill and Done or Clear. */
export function captionView(input: CaptionInput): CaptionView {
  const { active, phase, caption } = input
  const under18 = active && input.under18
  const micOff = active && (under18 || phase === 'unavailable')
  const paused = active && !micOff && phase === 'paused'
  const micOn = active && !micOff && !paused
  const lineOpen = micOn && caption.label === listenStrings.saying
  const unavailable = !under18 && caption.note === listenStrings.unavailable
  const offLabel = under18 ? consentWords.under18Note : unavailable ? listenStrings.unavailableLabel : null
  const speakerLabel =
    caption.label === listenStrings.saying || caption.label === listenStrings.said ? caption.label : null
  // During a session only the unlock shows beside the words; off, a purchase's note replaces "Listen mode is off."
  const sessionNote = input.purchaseNote === purchaseNotes.unlocked ? input.purchaseNote : null
  const note = under18 || unavailable ? null : (caption.note ?? sessionNote)
  const words = !active
    ? (input.purchaseNote ?? listenStrings.off)
    : paused
      ? 'Paused'
      : caption.words || (micOff ? consentWords.typedLinePrompt : listenStrings.listening)
  const label = offLabel ?? speakerLabel
  // "Still answering" names the line the row answers, so it stands where the speaker label would.
  const labelIsNote = !offLabel && note?.startsWith(stillAnsweringPrefix) === true
  const kind = !active
    ? 'off'
    : input.assetProgress !== null
      ? 'model'
      : micOff
        ? caption.words
          ? 'words'
          : 'mic-off'
        : paused
          ? 'paused'
          : caption.words
            ? 'words'
            : 'opening'

  return {
    kind,
    micOn,
    lineOpen,
    label: labelIsNote ? note : label,
    words,
    note: !active || labelIsNote ? null : note,
    noteSymbol: note?.startsWith(listenStrings.degraded)
      ? 'wifi.slash'
      : note === listenStrings.rankedOnPhone
        ? 'iphone'
        : note === purchaseNotes.unlocked
          ? 'lock.open.fill'
          : 'info.circle',
    discSymbol: paused
      ? 'pause.fill'
      : micOff
        ? under18
          ? 'ear'
          : 'keyboard'
        : input.purchaseNote === purchaseNotes.unlocked
          ? 'lock.open.fill'
          : 'ear',
    button: lineOpen ? 'done' : active && input.rowAnswers > 0 ? 'clear' : null,
    accessibilityLabel: [label, active ? note : null, words].filter(Boolean).join(', ')
  }
}

export type WordSegment = { text: string; fade: boolean; highlight: boolean }

const lastWordStart = (text: string) => /\S+\s*$/.exec(text)?.index ?? text.length

/** Where the words that came with `text` begin: after the text it extends, or else at its last word, since a recognizer
 * can rewrite what it heard. */
export function freshStart(text: string, before: string): number {
  return before && text.startsWith(before) ? before.length : lastWordStart(text)
}

/** Words arriving (plan 0044's motion): one caption line's text split into the part already shown, the new words that
 * fade in, and the newest word, which sits on the highlight. `lineStart` is where the line begins in `text`, for the
 * last line of a long caption. */
export function wordSegments(text: string, fresh: number, lineStart = 0): WordSegment[] {
  const newest = lastWordStart(text)
  const cuts =
    fresh <= newest
      ? [
          { from: 0, to: fresh, fade: false, highlight: false },
          { from: fresh, to: newest, fade: true, highlight: false },
          { from: newest, to: text.length, fade: true, highlight: true }
        ]
      : [
          { from: 0, to: newest, fade: false, highlight: false },
          { from: newest, to: fresh, fade: false, highlight: true },
          { from: fresh, to: text.length, fade: true, highlight: true }
        ]
  return cuts
    .map(({ from, to, fade, highlight }) => ({
      text: text.slice(Math.max(from, lineStart), Math.max(to, lineStart)),
      fade,
      highlight
    }))
    .filter((segment) => segment.text.length > 0)
}

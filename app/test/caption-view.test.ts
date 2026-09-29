import { describe, expect, test } from 'vitest'
import { consentWords } from '../src/consent/strings'
import { listenStrings } from '../src/listen/strings'
import { purchaseNotes } from '../src/purchases/store'
import { captionView, type CaptionInput } from '../src/screens/caption-view'

const off: CaptionInput = {
  active: false,
  phase: 'idle',
  caption: { label: listenStrings.off, words: '', note: null },
  assetProgress: null,
  under18: false,
  purchaseNote: null,
  rowAnswers: 0
}
const listening: CaptionInput = {
  ...off,
  active: true,
  phase: 'listening',
  caption: { label: listenStrings.listening, words: '', note: null }
}
const said = (note: string | null = null): CaptionInput => ({
  ...listening,
  caption: { label: listenStrings.said, words: 'How was physio?', note },
  rowAnswers: 1
})

describe('the caption', () => {
  test('off, says Listen mode is off beside an ear, or a purchase note in its place', () => {
    expect(captionView(off)).toMatchObject({ kind: 'off', words: listenStrings.off, discSymbol: 'ear', button: null })
    expect(captionView({ ...off, purchaseNote: purchaseNotes.unlocked })).toMatchObject({
      kind: 'off',
      words: purchaseNotes.unlocked,
      discSymbol: 'lock.open.fill',
      note: null
    })
  })

  test('says Listening large, with the mic on, until the first words', () => {
    expect(captionView(listening)).toMatchObject({ kind: 'opening', words: 'Listening', micOn: true, lineOpen: false })
  })

  test('while the partner speaks, labels the words and offers Done', () => {
    const view = captionView({
      ...listening,
      caption: { label: listenStrings.saying, words: 'How was phys', note: null }
    })
    expect(view).toMatchObject({ kind: 'words', label: listenStrings.saying, lineOpen: true, button: 'done' })
  })

  test('after a line, says They said and offers Clear once the row holds replies', () => {
    expect(captionView(said())).toMatchObject({ kind: 'words', label: listenStrings.said, button: 'clear' })
    expect(captionView({ ...said(), rowAnswers: 0 }).button).toBeNull()
  })

  test('puts Still answering where the label was, and other notes in a pill with their symbol', () => {
    const still = listenStrings.stillAnswering('How was physio?')
    expect(captionView(said(still))).toMatchObject({ label: still, note: null })
    expect(captionView(said(listenStrings.rankedOnPhone))).toMatchObject({
      label: listenStrings.said,
      note: listenStrings.rankedOnPhone,
      noteSymbol: 'iphone'
    })
    expect(captionView(said(listenStrings.degraded))).toMatchObject({ noteSymbol: 'wifi.slash' })
  })

  test('shows the speech model where the caption was while it downloads', () => {
    expect(captionView({ ...listening, phase: 'starting', assetProgress: 0.62 }).kind).toBe('model')
  })

  test('paused, clears the words (LISTEN-8) and says Paused beside its symbol', () => {
    expect(captionView({ ...said(), phase: 'paused' })).toMatchObject({
      kind: 'paused',
      words: 'Paused',
      discSymbol: 'pause.fill',
      micOn: false
    })
  })

  test('without live transcription, asks for a typed line, then shows it under the note', () => {
    const unavailable = { ...listening, phase: 'unavailable' as const }
    const prompt = captionView({ ...unavailable, caption: { ...listening.caption, note: listenStrings.unavailable } })
    expect(prompt).toMatchObject({
      kind: 'mic-off',
      label: listenStrings.unavailableLabel,
      words: consentWords.typedLinePrompt,
      discSymbol: 'keyboard'
    })
    expect(prompt.accessibilityLabel).toMatch(/Tap here to type what they say\./)
    const typed = captionView({
      ...unavailable,
      caption: { label: listenStrings.said, words: 'Are you tired?', note: listenStrings.unavailable }
    })
    expect(typed).toMatchObject({ kind: 'words', label: listenStrings.unavailableLabel, words: 'Are you tired?' })
    expect(typed.accessibilityLabel).toMatch(/Are you tired\?/)
  })

  test('for a partner under 18, says Listen mode is off for this partner with the mic off', () => {
    const view = captionView({ ...listening, under18: true })
    expect(view).toMatchObject({ kind: 'mic-off', label: consentWords.under18Note, discSymbol: 'ear', micOn: false })
    expect(view.accessibilityLabel).toBe(`${consentWords.under18Note}, ${consentWords.typedLinePrompt}`)
  })
})

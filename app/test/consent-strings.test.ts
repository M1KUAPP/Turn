import { describe, expect, test } from 'vitest'
import { consentCard, consentWords, permissionStep } from '../src/consent/strings'

describe('consent copy', () => {
  test('returns the exact permission step and card copy in both naming versions', () => {
    expect(permissionStep(false)).toEqual({
      title: 'Before Listen mode starts',
      paragraphs: [
        'When your partner finishes speaking, Turn sends their words, the place you picked, your category names, and 40 of your phrases to a third-party AI service in the United States, which picks the phrases that answer. Names Turn recognizes are swapped for tags first.',
        'Your audio and the rest of your phrases never leave this phone.',
        'The service may keep what it receives to monitor its service.'
      ],
      privacyNotice: 'Read the privacy notice',
      allow: 'Allow',
      notNow: 'Not now'
    })
    expect(permissionStep(true)).toEqual({
      title: 'Before Listen mode starts',
      paragraphs: [
        'When your partner finishes speaking, Turn sends their words, the place you picked, your category names, and 40 of your phrases to TypeSafe, which picks the phrases that answer. Names Turn recognizes are swapped for tags first.',
        'Your audio and the rest of your phrases never leave this phone.',
        'The service may keep what it receives to monitor its service.'
      ],
      privacyNotice: 'Read the privacy notice',
      allow: 'Allow',
      notNow: 'Not now'
    })
    expect(consentCard(false)).toEqual({
      lead: 'Can my phone listen while we talk?',
      facts: [
        'It turns your words into text on this phone.',
        'Your words, with any names it recognizes swapped for tags, go to a third-party AI service in the United States to pick my replies from my own phrases.',
        'No audio is recorded.',
        'I can pause it at any time.'
      ],
      readAloud: 'Read aloud',
      under18: 'My partner is under 18',
      agreed: 'They agreed',
      declined: 'They said no'
    })
    expect(consentCard(true)).toEqual({
      lead: 'Can my phone listen while we talk?',
      facts: [
        'It turns your words into text on this phone.',
        'Your words, with any names it recognizes swapped for tags, go to TypeSafe to pick my replies from my own phrases.',
        'No audio is recorded.',
        'I can pause it at any time.'
      ],
      readAloud: 'Read aloud',
      under18: 'My partner is under 18',
      agreed: 'They agreed',
      declined: 'They said no'
    })
  })

  test('keeps the unnamed permission and card copy free of the TypeSafe name', () => {
    const unnamed = JSON.stringify({ step: permissionStep(false), card: consentCard(false), words: consentWords })
    expect(unnamed).not.toContain('TypeSafe')
  })

  test('exports the under-18 and withdrawal words verbatim', () => {
    expect(consentWords).toEqual({
      micOff: 'Mic off',
      under18Note: 'Listen mode is off for this partner',
      under18RowNote: 'Listen mode is off for this partner.',
      typedLinePrompt: 'Tap here to type what they say.',
      allowedOn: 'Allowed on',
      withdraw: 'Withdraw',
      notAllowed: 'Not allowed',
      allow: 'Allow',
      afterWithdraw: 'Listen mode is off, and nothing more leaves this phone until you allow it again.'
    })
  })
})

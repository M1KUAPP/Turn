export type Step = {
  title: string
  paragraphs: readonly string[]
  privacyNotice: string
  allow: string
  notNow: string
}

export type Card = {
  lead: string
  facts: readonly string[]
  readAloud: string
  under18: string
  agreed: string
  declined: string
}

export const consentWords = {
  micOff: 'Mic off',
  under18Note: 'Listen mode is off for this partner',
  under18RowNote: 'Listen mode is off for this partner.',
  typedLinePrompt: 'Tap here to type what they say.',
  allowedOn: 'Allowed on',
  withdraw: 'Withdraw',
  notAllowed: 'Not allowed',
  allow: 'Allow',
  afterWithdraw: 'Listen mode is off, and nothing more leaves this phone until you allow it again.'
} as const

const serviceName = (typesafeNamed: boolean) =>
  typesafeNamed ? 'TypeSafe' : 'a third-party AI service in the United States'

export function permissionStep(typesafeNamed: boolean): Step {
  const service = serviceName(typesafeNamed)
  return {
    title: 'Before Listen mode starts',
    paragraphs: [
      `When your partner finishes speaking, Turn sends their words, the place you picked, your category names, and 40 of your phrases to ${service}, which picks the phrases that answer. Names Turn recognizes are swapped for tags first.`,
      'Your audio and the rest of your phrases never leave this phone.',
      'The service may keep what it receives to monitor its service.'
    ],
    privacyNotice: 'Read the privacy notice',
    allow: 'Allow',
    notNow: 'Not now'
  }
}

export function consentCard(typesafeNamed: boolean): Card {
  const service = serviceName(typesafeNamed)
  return {
    lead: 'Can my phone listen while we talk?',
    facts: [
      'It turns your words into text on this phone.',
      `Your words, with any names it recognizes swapped for tags, go to ${service} to pick my replies from my own phrases.`,
      'No audio is recorded.',
      'I can pause it at any time.'
    ],
    readAloud: 'Read aloud',
    under18: 'My partner is under 18',
    agreed: 'They agreed',
    declined: 'They said no'
  }
}

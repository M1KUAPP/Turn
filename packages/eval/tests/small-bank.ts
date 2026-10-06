import type { Phrase } from '@turn/shared/shortlist'

/** Yes, No, and Not sure, then nine phrases the row can rank: seven at home, one at the shop, and one at neither. */
export const smallBank: Phrase[] = [
  { id: 'yes', text: 'Yes', places: [], fixed: true },
  { id: 'no', text: 'No', places: [], fixed: true },
  { id: 'not-sure', text: 'Not sure', places: [], fixed: true },
  { id: 'thank-you', text: 'Thank you', places: [] },
  { id: 'good-morning', text: 'Good morning', places: ['home'] },
  { id: 'water-please', text: 'Water, please', places: ['home'] },
  { id: 'excuse-me', text: 'Excuse me', places: ['shop'] },
  { id: 'im-cold', text: "I'm cold", places: ['home'] },
  { id: 'good-night', text: 'Good night', places: ['home'] },
  { id: 'more-please', text: 'More, please', places: ['home'] },
  { id: 'im-full', text: "I'm full", places: ['home'] },
  { id: 'im-tired', text: "I'm tired", places: ['home'] }
]

/** The strip's first phrase, which no ranker ranks. */
export const waitImTyping: Phrase = { id: 'wait-im-typing', text: "Wait, I'm typing", places: [], strip: true }

/** The kinds of question a ranking gives when its ranker calls none: every kind at 0. */
export const noKind = { yes_no: 0, either_or: 0, open: 0, not_a_question: 0 }

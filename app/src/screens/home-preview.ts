import { emptyRow } from '@turn/shared/row'
import type { LiveListenSnapshot } from '../listen/live-session'
import { listenStrings } from '../listen/strings'
import type { PurchasesSnapshot } from '../purchases/engine'

type Preview = {
  listening: LiveListenSnapshot
  purchases?: Partial<PurchasesSnapshot>
  under18?: boolean
  speakingId?: string
}

const six = [
  { id: 'it-was-hard', text: 'It was hard' },
  { id: 'im-feeling-better', text: "I'm feeling better" },
  { id: 'my-back-hurts', text: 'My back hurts' },
  { id: 'can-we-take-a-break', text: 'Can we take a break?' },
  { id: 'thank-you', text: 'Thank you' },
  { id: 'tell-me-more', text: 'Tell me more' }
]
const yesNo = [
  { id: 'yes', text: 'Yes' },
  { id: 'no', text: 'No' },
  { id: 'not-sure', text: 'Not sure' },
  { id: 'water-please', text: 'Water, please' },
  { id: 'im-thirsty', text: "I'm thirsty" },
  { id: 'more-please', text: 'More, please' }
]
const big = { id: 'id-like-to-go-home-now', text: "I'd like to go home now" }

function session(
  caption: Partial<LiveListenSnapshot['caption']>,
  replies: readonly { id: string; text: string }[] | null,
  extra: Partial<LiveListenSnapshot> = {}
): LiveListenSnapshot {
  const slots = replies ?? [null, null, null, null, null, null]
  return {
    active: true,
    row: { ...emptyRow, seq: 1, answers: replies ? 1 : 0, slots: slots.map((reply) => reply?.id ?? null) },
    line: null,
    answeringLine: null,
    rankedOnPhone: false,
    degraded: false,
    slots,
    bigButton: null,
    caption: { label: listenStrings.said, words: '', note: null, prompt: null, accessibilityLabel: '', ...caption },
    phase: 'listening',
    assetProgress: null,
    rankedOnce: true,
    ...extra
  }
}

/** Home's states for checking against the design's frames in a __DEV__ bundle, chosen by the route's `preview`
 * parameter, as in `turn:///?preview=hearing`. */
export function homePreview(name: string | undefined, live: LiveListenSnapshot): Preview | null {
  const said = { label: listenStrings.said, words: 'How was physio?' }
  switch (name) {
    case 'opening':
      return { listening: session({ label: listenStrings.listening }, null) }
    case 'hearing':
      return { listening: session({ label: listenStrings.saying, words: 'How was phys' }, six) }
    case 'replies':
      return { listening: session(said, six) }
    case 'big':
      return {
        listening: session({ ...said, words: 'Do you want to go home?' }, null, {
          row: { ...emptyRow, seq: 1, answers: 1, big: big.id },
          bigButton: big
        })
      }
    case 'yes-no':
      return { listening: session({ ...said, words: 'Do you want some water?' }, yesNo) }
    case 'still':
      return {
        listening: session(
          { ...said, words: 'Nice day for it.', note: listenStrings.stillAnswering('How was physio?') },
          six
        )
      }
    case 'ranked':
      return { listening: session({ ...said, note: listenStrings.rankedOnPhone }, six) }
    case 'degraded':
      return { listening: session({ ...said, note: listenStrings.degraded }, six) }
    case 'paused':
      return { listening: session({ label: listenStrings.listening }, six, { phase: 'paused' }) }
    case 'under18':
      return { listening: session({ label: listenStrings.listening }, null), under18: true }
    case 'speaking':
      return { listening: session(said, six), speakingId: 'it-was-hard' }
    case 'locked':
      return { listening: live, purchases: { locked: true, countLabel: null } }
    case 'model':
      return {
        listening: session({ label: listenStrings.listening, note: listenStrings.gettingModel }, null, {
          phase: 'starting',
          assetProgress: 0.62
        })
      }
    default:
      return null
  }
}

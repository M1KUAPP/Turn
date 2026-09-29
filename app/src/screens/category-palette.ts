import type { SymbolViewProps } from 'expo-symbols'
import { categoryColors } from '../constants/theme'

type StarterCategory = keyof typeof categoryColors
type SFSymbol = Extract<SymbolViewProps['name'], string>

// A category the user adds takes the next hue after Out and about, cycling from Chat (DESIGN, color roles).
const addedHues: readonly StarterCategory[] = [
  'chat',
  'care',
  'body-pain',
  'food',
  'feelings',
  'family',
  'health',
  'out-and-about'
]

const isStarter = (id: string): id is StarterCategory => Object.hasOwn(categoryColors, id)

/** A category's fill and inked edge: a starter category's own pair, and for one the user added, the hues after Out
 * and about's in the order the bank lists the added categories. */
export function categoryPalette(categoryId: string, categories: readonly { id: string }[]) {
  if (isStarter(categoryId)) return categoryColors[categoryId]
  const added = categories.filter((category) => !isStarter(category.id))
  const index = Math.max(
    0,
    added.findIndex((category) => category.id === categoryId)
  )
  return categoryColors[addedHues[index % addedHues.length]]
}

const categorySymbols: Record<StarterCategory, SFSymbol> = {
  quick: 'bolt.fill',
  chat: 'bubble.left.and.bubble.right.fill',
  care: 'hand.raised.fill',
  'body-pain': 'figure.stand',
  food: 'fork.knife',
  feelings: 'heart.fill',
  family: 'person.2.fill',
  health: 'cross.case.fill',
  'out-and-about': 'figure.walk'
}

/** Each starter category's symbol (plan 0044's category table); a category the user added shows a tag. */
export function categorySymbol(categoryId: string): SFSymbol {
  return isStarter(categoryId) ? categorySymbols[categoryId] : 'tag.fill'
}

const placeSymbols: Record<string, SFSymbol> = {
  home: 'house.fill',
  clinic: 'stethoscope',
  shop: 'bag.fill',
  out: 'figure.walk'
}

/** The starter places' symbols (plan 0044's icons); a place the user added shows a pin. */
export function placeSymbol(placeId: string): SFSymbol {
  return placeSymbols[placeId] ?? 'mappin.and.ellipse'
}

const fixedReplyTokens = {
  yes: { fill: 'yes-fill', edge: 'yes-edge' },
  no: { fill: 'no-fill', edge: 'no-edge' },
  'not-sure': { fill: 'unsure-fill', edge: 'unsure-edge' }
} as const

/** Yes, No, and Not sure's own fill and edge tokens, which they keep in the row and in Quick; null for other phrases. */
export function phraseColorTokensForId(id: string) {
  return fixedReplyTokens[id as keyof typeof fixedReplyTokens] ?? null
}

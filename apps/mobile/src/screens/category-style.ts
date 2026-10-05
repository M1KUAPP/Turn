import type { ComponentProps } from 'react'
import type { SymbolView } from 'expo-symbols'
import { categoryColors, colors } from '../constants/theme'

export type SymbolName = Extract<ComponentProps<typeof SymbolView>['name'], string>

type StarterCategoryId = keyof typeof categoryColors

// Hues a category the user adds takes, in turn: the next after out-and-about, cycling from chat (DESIGN, colors).
const addedHues = ['chat', 'care', 'body-pain', 'food', 'feelings', 'family', 'health', 'out-and-about'] as const

const starterSymbols: Record<StarterCategoryId, SymbolName> = {
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

function isStarter(id: string): id is StarterCategoryId {
  return Object.prototype.hasOwnProperty.call(categoryColors, id)
}

/** A category's fill and inked edge. A category the user added, Typed included, takes the next hue by its place
 * among the added ones in the bank's order; the strip keeps `surface` and `edge`. */
export function categoryHue(id: string, categoryIds: readonly string[]) {
  if (id === 'strip') return { fill: colors.surface, edge: colors.edge }
  if (isStarter(id)) return categoryColors[id]
  const added = categoryIds.filter((other) => other !== 'strip' && !isStarter(other))
  const index = Math.max(0, added.indexOf(id))
  return categoryColors[addedHues[index % addedHues.length]]
}

/** A category's symbol, from plan 0044's table; Typed and the categories the user adds take generic ones. */
export function categorySymbol(id: string): SymbolName {
  if (isStarter(id)) return starterSymbols[id]
  if (id === 'strip') return 'hand.raised'
  if (id === 'typed') return 'keyboard'
  return 'square.grid.2x2.fill'
}

const starterPlaceSymbols: Record<string, SymbolName> = {
  home: 'house.fill',
  clinic: 'stethoscope',
  shop: 'bag.fill',
  out: 'figure.walk'
}

/** A place's symbol: plan 0044's for the starter places, a map pin for the ones the user adds. */
export function placeSymbol(id: string): SymbolName {
  return Object.prototype.hasOwnProperty.call(starterPlaceSymbols, id) ? starterPlaceSymbols[id] : 'mappin.and.ellipse'
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

export function homeLayout(width: number, height: number, fontScale: number) {
  const short = height < 700
  const singleColumn = width < 352 || fontScale >= 1.786
  const rowColumns = singleColumn ? 1 : 2
  const rowGap = short ? 8 : 12
  const slotHeight = Math.max(
    short ? 64 : 78,
    Math.ceil(2 * (short ? 22 : 25) * Math.min(fontScale, 2.6) + (short ? 20 : 24))
  )
  // Short screens below AX1 give the caption one 48-point line, the grid 8 points between buttons, and the tabs no
  // margins, so the grid's first row is on screen at launch (SPEAK-1).
  const oneLineCaption = short && fontScale < 1.786
  return {
    short,
    oneLineCaption,
    captionHeight: oneLineCaption ? 48 : Math.max(86, 24 + 70 * fontScale),
    gridGap: short ? 8 : 12,
    tabMargin: short ? 0 : 4,
    rowColumns,
    stripColumns: singleColumn ? 1 : 3,
    gridColumns: singleColumn ? 1 : 2,
    wholeMiddleScroll: short || singleColumn,
    rowGap,
    slotHeight,
    rowHeight: (6 / rowColumns) * slotHeight + (6 / rowColumns - 1) * rowGap
  }
}

export function pageOffset(offset: number, viewportHeight: number, contentHeight: number, direction: -1 | 1) {
  return Math.max(0, Math.min(contentHeight - viewportHeight, offset + direction * viewportHeight))
}

/** Whether the row offers the starter card (BANK-10): only on an idle Home, never over Listen mode, typing's matches, or the under-18 note. */
export function starterCardShown(state: {
  listening: boolean
  composerOpen: boolean
  under18: boolean
  reviewPending: boolean
  reviewDismissed: boolean
}): boolean {
  return !state.listening && !state.composerOpen && !state.under18 && state.reviewPending && !state.reviewDismissed
}

/** The reply Stats on this phone counts for a spoken phrase (#54): none outside Listen mode. A row slot or the big
 * button answers the line the row answers; a grid phrase, a phrase the composer matched, or the composer's Speak answers
 * the newest line. The strip and Repeat never ask. */
export function replyStat(
  tapped: 'row' | 'grid',
  state: { listening: boolean; composerMatching: boolean; newest: number; answered: number }
): { type: 'reply'; from: 'row' | 'grid'; seq: number } | null {
  if (!state.listening) return null
  if (tapped === 'row' && !state.composerMatching) return { type: 'reply', from: 'row', seq: state.answered }
  return { type: 'reply', from: 'grid', seq: state.newest }
}

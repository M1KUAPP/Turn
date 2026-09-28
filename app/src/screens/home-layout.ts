export function homeLayout(width: number, height: number, fontScale: number) {
  const short = height < 700
  const singleColumn = width < 352 || fontScale >= 1.786
  const rowColumns = singleColumn ? 1 : 2
  const rowGap = short ? 8 : 12
  const slotHeight = Math.max(
    short ? 64 : 78,
    Math.ceil(2 * (short ? 22 : 25) * Math.min(fontScale, 2.6) + (short ? 20 : 24))
  )
  return {
    short,
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

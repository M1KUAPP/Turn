export function homeLayout(width: number, height: number, fontScale: number) {
  const short = height < 700
  const singleColumn = width < 352 || fontScale >= 1.786
  const rowColumns = singleColumn ? 1 : 2
  const rowGap = short ? 8 : 12
  const slotHeight = Math.max(
    short ? 64 : 78,
    Math.ceil(2 * (short ? 22 : 27) * Math.min(fontScale, 2.6) + (short ? 20 : 24))
  )
  // Short screens below AX1 give the caption one 48-point line, the grid 8 points between buttons, and the tabs no
  // margins, so the grid's first row is on screen at launch (SPEAK-1).
  const oneLineCaption = short && fontScale < 1.786
  return {
    short,
    oneLineCaption,
    // A label and two lines of partner-line inside the panel's padding: 114 points at the default size.
    captionHeight: oneLineCaption ? 48 : Math.max(86, Math.ceil(28 + 86 * fontScale)),
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

/** The tab Home keeps selected once it reads the bank (#152): All, or a category the bank still has; Quick once the
 * selected category is deleted. */
export function selectedTab(categoryId: string, categories: { id: string }[]): string {
  return categoryId === 'all' || categories.some((category) => category.id === categoryId) ? categoryId : 'quick'
}

/** The text size a row slot shows its phrase at (DESIGN, the row): phrase while it fits two lines, then button's size,
 * past which the slot ends it with an ellipsis. Estimated from its length, at about half an em a character. */
export function slotTextKind(
  length: number,
  textWidth: number,
  fontScale: number,
  short: boolean
): 'phrase' | 'button' {
  const perLine = Math.floor(textWidth / (22 * Math.min(fontScale, 2.6) * 0.55))
  return !short && length <= 2 * perLine ? 'phrase' : 'button'
}

export type ToolbarItem = 'type' | 'repeat' | 'up' | 'down'

const toolbarGap = 6

/** The floating toolbar's rows (DESIGN, the bottom bar). The four pills share one row, each a symbol above its label and
 * up to 84 points wide, while they fit; otherwise each pill puts its symbol beside its label, and a pair, Type and Repeat
 * or Up and Down, shares a row only when both fit, so no label is ever cut. `labels` are the labels' natural widths,
 * Repeat's standing for Stop's too, so the bar doesn't change while Turn speaks. Beside the companion's face the pills
 * sit 2 points apart, so four fit at 70 points in the 298-point bar. */
export function toolbarLayout(labels: Record<ToolbarItem, number>, symbol: number, space: number, gap = toolbarGap) {
  const items: ToolbarItem[] = ['type', 'repeat', 'up', 'down']
  const stacked = Math.max(...items.map((item) => Math.max(symbol, labels[item]) + 23))
  const pillWidth = Math.max(stacked, Math.min(84, (space - 3 * gap) / 4))
  if (4 * pillWidth + 3 * gap <= space) return { stacked: true, pillWidth, rows: [items] }
  const beside = (item: ToolbarItem) => symbol + 6 + labels[item] + 27
  const pair = (a: ToolbarItem, b: ToolbarItem) => (beside(a) + gap + beside(b) <= space ? [[a, b]] : [[a], [b]])
  return { stacked: false, pillWidth, rows: [...pair('type', 'repeat'), ...pair('up', 'down')] }
}

/** The speech model's progress where the caption was (plan 0044's strings): "62%, about a minute. Speaking works now."
 * The time is left out until the pace is known. */
export function modelProgressWords(progress: number, secondsLeft: number | null): string {
  const percent = Math.min(99, Math.floor(progress * 100))
  const time =
    secondsLeft === null
      ? ''
      : secondsLeft < 90
        ? ', about a minute'
        : `, about ${Math.round(secondsLeft / 60)} minutes`
  return `${percent}%${time}. Speaking works now.`
}

/** Seconds the download has left at its pace so far, from its first and latest readings (times in milliseconds); null
 * until a second has passed with progress made. */
export function modelSecondsLeft(
  first: { at: number; progress: number },
  latest: { at: number; progress: number }
): number | null {
  const elapsed = latest.at - first.at
  const rate = (latest.progress - first.progress) / elapsed
  if (elapsed < 1000 || !(rate > 0)) return null
  return (1 - latest.progress) / rate / 1000
}

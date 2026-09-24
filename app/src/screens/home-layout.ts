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

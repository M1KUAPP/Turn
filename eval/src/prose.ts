/** Fills prose to 80 columns, as the repo's Markdown style asks, indenting the lines after the first. */
export const wrap = (text: string, indent = ''): string => {
  const filled: string[] = []
  let line = ''
  for (const word of text.split(' ')) {
    if (line !== '' && line.length + 1 + word.length > 80) {
      filled.push(line)
      line = indent + word
    } else line = line === '' ? word : `${line} ${word}`
  }
  return [...filled, line].join('\n')
}

/** Joins names as prose: "a", "a and b", or "a, b, and c". */
export const listOf = (items: readonly string[]): string =>
  items.length < 3 ? items.join(' and ') : `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`

/** A Markdown table, padded as Prettier pads one, so the output passes the repo's lint. */
export const table = (header: readonly string[], rows: readonly (readonly string[])[]): string => {
  const widths = header.map((cell, i) => Math.max(3, cell.length, ...rows.map((row) => row[i].length)))
  const line = (cells: readonly string[]) => `| ${cells.map((cell, i) => cell.padEnd(widths[i])).join(' | ')} |`
  return [line(header), line(widths.map((width) => '-'.repeat(width))), ...rows.map(line)].join('\n')
}

/** A table's cell holding text, with any pipe escaped so it can't end the cell. */
export const cell = (text: string): string => text.replaceAll('|', '\\|')

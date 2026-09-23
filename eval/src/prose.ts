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

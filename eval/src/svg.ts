/** Text safe inside SVG. */
const escaped = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

/** An SVG element with its attributes, empty unless it holds text. */
export const tag = (name: string, attributes: Record<string, string | number>, text?: string): string => {
  const pairs = Object.entries(attributes).map(([key, value]) => ` ${key}="${value}"`)
  return text === undefined ? `<${name}${pairs.join('')}/>` : `<${name}${pairs.join('')}>${escaped(text)}</${name}>`
}

/**
 * A plot's SVG document: its size, then its title and description for screen readers, a white page, and its elements
 * in 12-pixel text, one to a line.
 */
export const svg = (
  { width, height, title, description }: { width: number; height: number; title: string; description: string },
  elements: readonly string[]
): string =>
  [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" font-family="sans-serif">`,
    tag('title', {}, title),
    tag('desc', {}, description),
    tag('rect', { width, height, fill: '#ffffff' }),
    `<g font-size="12" fill="#111827">`,
    ...elements,
    '</g>',
    '</svg>',
    ''
  ].join('\n')

/** Text safe inside SVG. */
const escaped = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

/** An SVG element with its attributes, empty unless it holds text. */
export const tag = (name: string, attributes: Record<string, string | number>, text?: string): string => {
  const pairs = Object.entries(attributes).map(([key, value]) => ` ${key}="${value}"`)
  return text === undefined ? `<${name}${pairs.join('')}/>` : `<${name}${pairs.join('')}>${escaped(text)}</${name}>`
}

/**
 * A plot's grid, on scales that take a share from 0 to 1: at each tick, a light line across and one up, with the tick's
 * label under the plot at `bottom` and left of it at `left`.
 */
export const grid = (
  ticks: readonly number[],
  scale: {
    x: (share: number) => string
    y: (share: number) => string
    bottom: number
    left: number
    label: (tick: number) => string
  }
): string[] => {
  const { x, y, bottom, left, label } = scale
  return ticks.flatMap((tick) => [
    tag('line', { x1: x(tick), y1: y(0), x2: x(tick), y2: y(1), stroke: '#e5e7eb' }),
    tag('line', { x1: x(0), y1: y(tick), x2: x(1), y2: y(tick), stroke: '#e5e7eb' }),
    tag('text', { x: x(tick), y: bottom, 'text-anchor': 'middle' }, label(tick)),
    tag('text', { x: left, y: y(tick), 'text-anchor': 'end', 'dominant-baseline': 'middle' }, label(tick))
  ])
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

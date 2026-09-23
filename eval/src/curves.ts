import type { Ranking } from '@turn/shared/row'
import type { LineScore, ScoredLine } from './score'

/** One point of a ranker's risk-coverage curve: at a threshold, the share of lines covered, and of those, wrong. */
export type Point = { threshold: number; coverage: number; risk: number }

/** A ranking's top score, or 0 for none. */
const top = (ranking: Ranking) => Math.max(0, ...ranking.scores.values())

/**
 * A ranker's risk-coverage curve over the lines, highest threshold first. A line's confidence is its top score. At
 * each distinct confidence above 0, a line is covered when its top reaches it, and right when one of its first six
 * phrases scoring at least that much is acceptable, as the evaluation notes count a changed row; the fixed buttons and
 * the big button don't count. Lines tied at a threshold are covered together.
 */
export function riskCoverage<Line extends ScoredLine>(scores: readonly LineScore<Line>[], ranker: string): Point[] {
  const lines = scores.map(({ line, rankers }) => ({ ...rankers[ranker], acceptable: new Set(line.acceptable) }))
  const thresholds = [...new Set(lines.map(({ ranking }) => top(ranking)))].filter((threshold) => threshold > 0)
  return thresholds
    .toSorted((a, b) => b - a)
    .map((threshold) => {
      const covered = lines.filter(({ ranking }) => top(ranking) >= threshold)
      const wrong = covered.filter(
        ({ ranking, order, acceptable }) =>
          !order.slice(0, 6).some((id) => (ranking.scores.get(id) ?? 0) >= threshold && acceptable.has(id))
      )
      return { threshold, coverage: covered.length / lines.length, risk: wrong.length / covered.length }
    })
}

/** The plot's size and margins, in pixels. */
const size = { width: 640, height: 400, left: 64, right: 24, top: 24, bottom: 56 }
const plotWidth = size.width - size.left - size.right
const plotHeight = size.height - size.top - size.bottom

/** Okabe and Ito's colors, which people with each common kind of color blindness can tell apart. */
const colors = ['#E69F00', '#56B4E9', '#009E73', '#D55E00', '#0072B2', '#CC79A7']

/** A share's place on the plot, in pixels to one decimal. */
const x = (coverage: number) => (size.left + coverage * plotWidth).toFixed(1)
const y = (risk: number) => (size.top + (1 - risk) * plotHeight).toFixed(1)

/** Text safe inside SVG. */
const escaped = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

/** An SVG element with its attributes, empty unless it holds text. */
const tag = (name: string, attributes: Record<string, string | number>, text?: string) => {
  const pairs = Object.entries(attributes).map(([key, value]) => ` ${key}="${value}"`)
  return text === undefined ? `<${name}${pairs.join('')}/>` : `<${name}${pairs.join('')}>${escaped(text)}</${name}>`
}

/**
 * Every ranker's risk-coverage curve as an SVG: coverage across, risk up, each from 0% to 100%, one colored line and
 * its points for each ranker, and a legend. A curve of one point shows as that point.
 */
export function plot(curves: readonly (readonly [string, readonly Point[]])[]): string {
  const ticks = [0, 0.2, 0.4, 0.6, 0.8, 1]
  const grid = ticks.flatMap((tick) => [
    tag('line', { x1: x(tick), y1: y(0), x2: x(tick), y2: y(1), stroke: '#e5e7eb' }),
    tag('line', { x1: x(0), y1: y(tick), x2: x(1), y2: y(tick), stroke: '#e5e7eb' }),
    tag('text', { x: x(tick), y: size.top + plotHeight + 18, 'text-anchor': 'middle' }, `${tick * 100}%`),
    tag('text', { x: size.left - 8, y: y(tick), 'text-anchor': 'end', 'dominant-baseline': 'middle' }, `${tick * 100}%`)
  ])
  const legendX = size.width - size.right - 150
  const drawn = curves.flatMap(([name, points], i) => {
    const color = colors[i % colors.length]
    const byCoverage = points.toSorted((a, b) => a.coverage - b.coverage)
    const legendY = size.top + 16 + i * 20
    return [
      tag('polyline', {
        points: byCoverage.map(({ coverage, risk }) => `${x(coverage)},${y(risk)}`).join(' '),
        fill: 'none',
        stroke: color,
        'stroke-width': 2
      }),
      ...byCoverage.map(({ coverage, risk }) => tag('circle', { cx: x(coverage), cy: y(risk), r: 3, fill: color })),
      tag('line', { x1: legendX, y1: legendY, x2: legendX + 24, y2: legendY, stroke: color, 'stroke-width': 2 }),
      tag('text', { x: legendX + 32, y: legendY, 'dominant-baseline': 'middle' }, name)
    ]
  })
  const names = curves.map(([name]) => name).join(', ')
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size.width} ${size.height}" font-family="sans-serif">`,
    tag('title', {}, 'Risk against coverage for each ranker'),
    tag(
      'desc',
      {},
      'For each ranker, the share of rows that are wrong against the share of lines where the row changes, as its ' +
        `threshold falls: ${names}.`
    ),
    tag('rect', { width: size.width, height: size.height, fill: '#ffffff' }),
    `<g font-size="12" fill="#111827">`,
    ...grid,
    tag(
      'text',
      { x: x(0.5), y: size.height - 12, 'text-anchor': 'middle' },
      'Coverage: the share of lines where the row changes'
    ),
    tag(
      'text',
      { transform: `translate(16 ${y(0.5)}) rotate(-90)`, 'text-anchor': 'middle' },
      'Risk: the share of those rows that are wrong'
    ),
    ...drawn,
    '</g>',
    '</svg>',
    ''
  ].join('\n')
}

import { expect, test } from 'vitest'
import { plot, riskCoverage } from '../src/curves'
import type { Ranker } from '../src/rankers'
import { scoreLines } from '../src/score'
import { smallBank } from './small-bank'

// Each line's scores by phrase; any other phrase scores 0.
const scored: Record<string, Record<string, number>> = {
  sure: { 'water-please': 0.9 },
  shifting: { 'im-cold': 0.8, 'water-please': 0.75 },
  tied: { 'water-please': 0.8 },
  none: { 'good-night': 0.7 },
  blank: {}
}
const byLine: Ranker = (line, shortlist) => ({
  kind: { yes_no: 0, either_or: 0, open: 0, not_a_question: 0 },
  topic: {},
  scores: new Map(shortlist.map((phrase) => [phrase.id, scored[line][phrase.id] ?? 0])),
  onPhone: false
})
const lines = Object.keys(scored).map((text) => ({
  text,
  place: 'home',
  acceptable: text === 'none' ? [] : ['water-please']
}))

test("draws a ranker's risk against its coverage at each distinct top score, tied lines covered together", async () => {
  const { lines: scores } = await scoreLines(lines, smallBank, { byLine })
  expect(riskCoverage(scores, 'byLine')).toEqual([
    { threshold: 0.9, coverage: 1 / 5, risk: 0 },
    // "shifting" is covered, but only "I'm cold" reaches 0.8; "tied" is covered with it.
    { threshold: 0.8, coverage: 3 / 5, risk: 1 / 3 },
    // At 0.7 "Water, please" shows beside it, and only the line with no reply is wrong; "blank" is never covered.
    { threshold: 0.7, coverage: 4 / 5, risk: 1 / 4 }
  ])
})

test('draws each curve as a line through its points in an SVG, with a title, a description, and a legend', () => {
  const svg = plot([
    ['jev', [{ threshold: 0.9, coverage: 0.5, risk: 0.25 }]],
    [
      'a<b',
      [
        { threshold: 1, coverage: 1, risk: 0.5 },
        { threshold: 2, coverage: 0.25, risk: 0 }
      ]
    ]
  ])
  expect(svg).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 640 400"/)
  expect(svg).toContain('<title>Risk against coverage for each ranker</title>')
  expect(svg).toContain('as its threshold falls: jev, a&lt;b.</desc>')
  // Coverage 50% sits halfway across the plot, 64 + 276, and risk 25% a quarter of the way up, 24 + 240.
  expect(svg).toContain('<polyline points="340.0,264.0" fill="none" stroke="#E69F00" stroke-width="2"/>')
  expect(svg).toContain('<circle cx="340.0" cy="264.0" r="3" fill="#E69F00"/>')
  // In order of coverage, whatever order the points came in.
  expect(svg).toContain('<polyline points="202.0,344.0 616.0,184.0" fill="none" stroke="#56B4E9" stroke-width="2"/>')
  expect(svg).toMatch(/<text [^>]*>jev<\/text>/)
  expect(svg).toMatch(/<text [^>]*>a&lt;b<\/text>/)
  expect(svg.trimEnd().endsWith('</svg>')).toBe(true)
})

test('counts a line right only when an acceptable phrase is among its first six', async () => {
  // On "crowded", six phrases score above "Water, please", which comes seventh; "low" adds a threshold of 0.5.
  const crowded: Ranker = (line, shortlist) => ({
    kind: { yes_no: 0, either_or: 0, open: 0, not_a_question: 0 },
    topic: {},
    scores: new Map(
      shortlist.map((phrase, i) => {
        if (line === 'low') return [phrase.id, 0.5]
        return [phrase.id, phrase.id === 'water-please' ? 0.885 : 0.95 - i / 100]
      })
    ),
    onPhone: false
  })
  const both = [
    { text: 'crowded', place: 'home', acceptable: ['water-please'] },
    { text: 'low', place: 'home', acceptable: [] }
  ]
  const { lines: scores } = await scoreLines(both, smallBank, { crowded })
  expect(scores[0].rankers.crowded.order.indexOf('water-please')).toBe(6)
  expect(riskCoverage(scores, 'crowded').at(-1)).toEqual({ threshold: 0.5, coverage: 1, risk: 1 })
})

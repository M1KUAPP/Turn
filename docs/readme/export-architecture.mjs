#!/usr/bin/env node
/**
 * Exports the README architecture diagram, tinted with Turn's color tokens.
 *
 * Archify (https://github.com/tt-a1i/archify) renders architecture.json into a standalone HTML viewer. This script
 * delivers a temporary copy of architecture.json (with the meta.output path that `deliver` needs), checks it, restyles
 * the viewer with apps/mobile/src/constants/theme.ts tokens and the system font stack, and saves the viewer's own SVG
 * export once per color scheme. Archify's SVG export follows prefers-color-scheme, but a README <picture> picks the
 * file by GitHub's theme, so each file is locked to its scheme with the export's svg[data-theme] rules.
 *
 * Re-run, from the repository root:
 *   node docs/readme/export-architecture.mjs <archify>/archify/bin/archify.mjs
 *
 * Inputs: architecture.json beside this file, and the path to archify's CLI (a checkout with `npm ci` done; the
 * diagram was built with archify 2.17). It passes `deliver` at the standard quality profile; showcase fails only
 * desktop readability, since the diagram is 1680 pixels wide.
 *
 * Needs Playwright and its Chromium. Either install them without saving
 * (`bun add --no-save playwright && bunx playwright install chromium`) or point PLAYWRIGHT at an installed
 * playwright package directory.
 *
 * Writes: architecture-light.svg and architecture-dark.svg beside this file.
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const README_DIR = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT ?? 'playwright')

// Archify's theme variables mapped to theme.ts tokens, as plan 0047 lists: background and masks to board, grid and
// panel borders to hairline, text to ink and ink-secondary, arrows and lanes to edge, emphasis to accent, frontend to
// accent, backend to the health category, database to the family category, cloud to listen, security to no, message
// bus to the food category, and external to unsure.
const THEMES = {
  light: {
    '--bg': '#F4EFE7',
    '--grid': '#DDD4C6',
    '--canvas-dot': '#DDD4C6',
    '--text': '#1E1A15',
    '--text-muted': '#5B5347',
    '--text-dim': '#8A8072',
    '--text-faint': '#5B5347',
    '--panel': '#FFFCF7',
    '--panel-border': '#DDD4C6',
    '--lane-fill': '#EAE3D8',
    '--lane-stroke': '#8A8072',
    '--arrow': '#8A8072',
    '--arrow-emphasis': '#2438C9',
    '--mask': '#F4EFE7',
    '--frontend-fill': '#E4E8FC',
    '--frontend-stroke': '#2438C9',
    '--backend-fill': '#D4EEF0',
    '--backend-stroke': '#15707B',
    '--database-fill': '#E8E0FB',
    '--database-stroke': '#6444C4',
    '--cloud-fill': '#FCE6D6',
    '--cloud-stroke': '#B84300',
    '--security-fill': '#FBE0DB',
    '--security-stroke': '#B3261E',
    '--messagebus-fill': '#FAEBC2',
    '--messagebus-stroke': '#8A6500',
    '--external-fill': '#ECE6DD',
    '--external-stroke': '#6B6357'
  },
  dark: {
    '--bg': '#15120F',
    '--grid': '#3A342C',
    '--canvas-dot': '#3A342C',
    '--text': '#F6F1E9',
    '--text-muted': '#B9AFA1',
    '--text-dim': '#8C8274',
    '--text-faint': '#B9AFA1',
    '--panel': '#221E19',
    '--panel-border': '#3A342C',
    '--lane-fill': '#0F0D0B',
    '--lane-stroke': '#8C8274',
    '--arrow': '#8C8274',
    '--arrow-emphasis': '#8FA0FF',
    '--mask': '#15120F',
    '--frontend-fill': '#1D2244',
    '--frontend-stroke': '#8FA0FF',
    '--backend-fill': '#0F2A2D',
    '--backend-stroke': '#4FC3CF',
    '--database-fill': '#241C3A',
    '--database-stroke': '#A78BF2',
    '--cloud-fill': '#3A1F0C',
    '--cloud-stroke': '#FF9A4D',
    '--security-fill': '#361512',
    '--security-stroke': '#FF7B6E',
    '--messagebus-fill': '#2E2510',
    '--messagebus-stroke': '#D9AE3B',
    '--external-fill': '#2A2621',
    '--external-stroke': '#A39A8C'
  }
}

const FONT =
  "ui-rounded, 'SF Pro Rounded', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

const declarations = (vars) =>
  Object.entries(vars)
    .map(([name, value]) => `${name}: ${value};`)
    .join(' ')

const tokenCss = [
  `:root, [data-theme="dark"] { ${declarations(THEMES.dark)} }`,
  `[data-theme="light"] { ${declarations(THEMES.light)} }`,
  `svg, svg text { font-family: ${FONT}; }`,
  // Regions in the lane neutrals and boundary titles in the muted text color, rather than archify's cloud colors.
  '.c-region { fill: var(--lane-fill); fill-opacity: 0.55; stroke: var(--lane-stroke); }',
  'svg text[data-boundary-label] { fill: var(--text-muted); }'
].join('\n')

function restyle(html) {
  // Archify's export copies the #archify-fonts element's text into the SVG; empty it so the SVG embeds no font.
  const fonts = /(<style id="archify-fonts">)[\s\S]*?(<\/style>)/
  if (!fonts.test(html)) throw new Error('No #archify-fonts style element: is this an Archify HTML file?')
  return html.replace(fonts, '$1$2').replace('</head>', `<style id="turn-tokens">\n${tokenCss}\n</style>\n</head>`)
}

async function exportSvg(browser, pageUrl, scheme) {
  const context = await browser.newContext({
    colorScheme: scheme,
    acceptDownloads: true,
    viewport: { width: 1440, height: 900 }
  })
  const page = await context.newPage()
  await page.goto(pageUrl)
  await page.evaluate(() => document.fonts.ready)
  const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
  if (theme !== scheme) throw new Error(`Viewer opened in ${theme} theme, expected ${scheme}`)
  await page.click('#btn-export')
  const [download] = await Promise.all([page.waitForEvent('download'), page.click('#export-menu [data-format="svg"]')])
  const svg = fs.readFileSync(await download.path(), 'utf8')
  await context.close()
  if (!/^(<\?xml[^>]*>\s*)?<svg /.test(svg) || /<svg [^>]*data-theme=/.test(svg)) throw new Error('Unexpected SVG root')
  return svg.replace('<svg ', `<svg data-theme="${scheme}" `)
}

const archify = process.argv[2]
if (!archify || !fs.existsSync(archify)) {
  console.error('Usage: node docs/readme/export-architecture.mjs <archify>/archify/bin/archify.mjs')
  process.exit(2)
}

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'turn-architecture-'))
try {
  const source = JSON.parse(fs.readFileSync(path.join(README_DIR, 'architecture.json'), 'utf8'))
  source.meta.output = 'architecture.html'
  const input = path.join(workDir, 'architecture.json')
  const delivered = path.join(workDir, 'architecture.html')
  fs.writeFileSync(input, JSON.stringify(source, null, 2))
  const quality = source.meta.quality_profile
  execFileSync('node', [archify, 'deliver', 'architecture', input, delivered, '--quality', quality], {
    stdio: 'inherit'
  })
  execFileSync('node', [archify, 'check', delivered, '--require-provenance'], { stdio: 'ignore' })

  const styled = path.join(workDir, 'styled.html')
  fs.writeFileSync(styled, restyle(fs.readFileSync(delivered, 'utf8')))
  const browser = await chromium.launch()
  try {
    for (const scheme of ['light', 'dark']) {
      const outFile = path.join(README_DIR, `architecture-${scheme}.svg`)
      fs.writeFileSync(outFile, await exportSvg(browser, pathToFileURL(styled).href, scheme))
      console.log(`wrote ${path.relative(process.cwd(), outFile)}`)
    }
  } finally {
    await browser.close()
  }
} finally {
  fs.rmSync(workDir, { recursive: true, force: true })
}

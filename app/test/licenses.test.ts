import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, test } from 'vitest'

type LicenseEntry = { name: string; version: string; license: string; text: string | null }

const root = resolve(import.meta.dirname, '../..')

describe('bundled open-source licenses', () => {
  test('covers the installed app runtime graph without a stale or missing package', () => {
    expect(() => execFileSync('bun', ['scripts/generate-app-licenses.ts', '--check'], { cwd: root })).not.toThrow()
  })

  test('provides a license for each listed package and excludes server-only tools', () => {
    const entries = JSON.parse(
      readFileSync(resolve(root, 'app/src/content/open-source-licenses.json'), 'utf8')
    ) as LicenseEntry[]
    expect(entries.some((entry) => entry.name === 'expo')).toBe(true)
    expect(entries.some((entry) => entry.name === 'react-native')).toBe(true)
    expect(entries.some((entry) => entry.name === '@typesafe-ai/sdk')).toBe(false)
    expect(entries.some((entry) => entry.name === 'vitest')).toBe(false)
    for (const entry of entries) {
      expect(entry.name).toBeTruthy()
      expect(entry.version).toBeTruthy()
      expect(entry.license || entry.text).toBeTruthy()
    }
  })

  test('also bundles the iOS native library acknowledgements', () => {
    const entries = JSON.parse(
      readFileSync(resolve(root, 'app/src/content/ios-licenses.json'), 'utf8')
    ) as LicenseEntry[]
    expect(entries.some((entry) => entry.name === 'hermes-engine')).toBe(true)
    expect(entries.every((entry) => entry.name && entry.license && entry.text)).toBe(true)
  })
})

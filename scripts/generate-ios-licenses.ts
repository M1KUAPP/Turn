import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

type Specifier = { Title?: string; License?: string; FooterText?: string }
type Acknowledgements = { PreferenceSpecifiers: Specifier[] }
type Entry = { name: string; license: string; text: string }

const root = resolve(import.meta.dirname, '..')
const source = join(root, 'app/ios/Pods/Target Support Files/Pods-Turn/Pods-Turn-acknowledgements.plist')
const output = join(root, 'app/src/content/ios-licenses.json')

if (!existsSync(source)) throw new Error('Generate the iOS project with Expo and install CocoaPods first.')

const plist = JSON.parse(
  execFileSync('plutil', ['-convert', 'json', '-o', '-', source], { encoding: 'utf8' })
) as Acknowledgements
const entries: Entry[] = plist.PreferenceSpecifiers.filter((item) => item.Title && item.License && item.FooterText).map(
  (item) => ({ name: item.Title!, license: item.License!, text: item.FooterText!.trim() })
)

if (!entries.length || entries.some((entry) => !entry.text)) throw new Error('iOS acknowledgements are incomplete.')
entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
const manifest = JSON.stringify(entries, null, 2) + '\n'

if (process.argv.includes('--check')) {
  if (!existsSync(output) || readFileSync(output, 'utf8') !== manifest) {
    throw new Error('The bundled iOS licenses are stale. Run bun scripts/generate-ios-licenses.ts after pod install.')
  }
} else {
  writeFileSync(output, manifest)
  process.stdout.write(`Wrote ${entries.length} iOS native library licenses.\n`)
}

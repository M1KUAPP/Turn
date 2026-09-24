import { existsSync, readFileSync, readdirSync, realpathSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'

type PackageJson = {
  name: string
  version: string
  license?: string | { type?: string }
  licenses?: Array<{ type?: string }>
  dependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

type Entry = { name: string; version: string; license: string; text: string | null }

const root = resolve(import.meta.dirname, '..')
const app = join(root, 'app')
const output = join(app, 'src/content/open-source-licenses.json')
const initial = JSON.parse(readFileSync(join(app, 'package.json'), 'utf8')) as PackageJson
const visited = new Set<string>()
const entries = new Map<string, Entry>()
const missing: string[] = []
const compare = (left: string, right: string) => (left < right ? -1 : left > right ? 1 : 0)

function installedFrom(from: string, name: string): string | null {
  let container = from
  while (basename(container) !== 'node_modules' && dirname(container) !== container) container = dirname(container)
  const candidates = [
    join(from, 'node_modules', name),
    join(container, name),
    join(app, 'node_modules', name),
    join(root, 'node_modules', name)
  ]
  for (const candidate of candidates) {
    if (existsSync(join(candidate, 'package.json'))) return realpathSync(candidate)
  }
  return null
}

function licenseText(directory: string): string | null {
  const file = readdirSync(directory)
    .sort()
    .find((name) => /^(LICEN[CS]E|COPYING)(\.|-|$)/i.test(name))
  if (!file) return null
  return readFileSync(join(directory, file), 'utf8').trim() || null
}

function licenseExpression(pkg: PackageJson): string {
  if (typeof pkg.license === 'string') return pkg.license
  if (pkg.license?.type) return pkg.license.type
  return (
    pkg.licenses
      ?.map((item) => item.type)
      .filter((type): type is string => !!type)
      .join(' OR ') ?? ''
  )
}

function visit(directory: string) {
  const path = realpathSync(directory)
  if (visited.has(path)) return
  visited.add(path)
  const pkg = JSON.parse(readFileSync(join(path, 'package.json'), 'utf8')) as PackageJson
  const key = `${pkg.name}@${pkg.version}`
  const text = licenseText(path)
  const license = licenseExpression(pkg) || (text ? 'See bundled license text' : '')
  if (!license) missing.push(key)
  entries.set(key, { name: pkg.name, version: pkg.version, license, text })

  for (const name of Object.keys({ ...pkg.dependencies, ...pkg.optionalDependencies, ...pkg.peerDependencies })) {
    const dependency = installedFrom(path, name)
    if (dependency) visit(dependency)
    else if (pkg.dependencies?.[name]) missing.push(`${key} requires missing ${name}`)
  }
}

for (const name of Object.keys(initial.dependencies ?? {})) {
  const directory = installedFrom(join(app, 'node_modules', 'app-root'), name)
  if (!directory) missing.push(`app requires missing ${name}`)
  else visit(directory)
}

if (missing.length) {
  throw new Error(`License inventory is incomplete:\n${missing.sort().join('\n')}`)
}

const manifest =
  JSON.stringify(
    [...entries.values()].sort((a, b) => compare(a.name, b.name) || compare(a.version, b.version)),
    null,
    2
  ) + '\n'

if (process.argv.includes('--check')) {
  if (!existsSync(output) || readFileSync(output, 'utf8') !== manifest) {
    throw new Error('The bundled app license inventory is stale. Run bun scripts/generate-app-licenses.ts.')
  }
} else {
  writeFileSync(output, manifest)
  process.stdout.write(`Wrote ${entries.size} app dependency licenses.\n`)
}

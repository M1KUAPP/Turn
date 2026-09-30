// Builds the companion's live renderer, app/live2d/build/Live2D (plan 0049): fetches the Cubism SDK for Web 5-r.5 and
// the four Live2D models, checks each against its SHA-256, and packs them with app/live2d/renderer.ts into a page the
// app's web view loads. The models stay out of the repo, as the handoff asks. The Simulator build runs it before
// prebuild; run it by hand with `bun scripts/fetch-companion-models.ts`, then prebuild, to see the live face in a local
// build. Needs curl, gh signed in to GitHub, unzip, and bsdtar (macOS's tar), and sips or Pillow.
import { $ } from 'bun'
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import type { CompanionModel } from '../app/src/companion/settings'

const root = resolve(import.meta.dirname, '..')
const live2d = join(root, 'app/live2d')
const cache = join(live2d, '.cache')
const out = join(live2d, 'build/Live2D')

// BOOTH serves its models only to a signed-in account, so the three from BOOTH sit on this repo's release instead, as
// downloaded from their BOOTH pages.
const release = { repo: 'M1KUAPP/Turn', tag: 'companion-models' }

// Each archive, from Live2D's own downloads where it has one and the release otherwise, pinned: a changed file stops
// the build here.
const archives: Record<'sdk' | CompanionModel, { url?: string; file: string; sha256: string }> = {
  sdk: {
    url: 'https://cubism.live2d.com/sdk-web/bin/CubismSdkForWeb-5-r.5.zip',
    file: 'CubismSdkForWeb-5-r.5.zip',
    sha256: '67064a7fb1812cf502f5c4a03bfe12cc638c75a621bb4acf06bb28763df06ba0'
  },
  // Ren Foster, from https://www.live2d.com/en/learn/sample/ren-foster/
  ren: {
    url: 'https://cubism.live2d.com/sample-data/bin/ren/ren_en.zip',
    file: 'ren_en.zip',
    sha256: 'fd4c8a363178669721a71e57b32959d0f1da660ed1c16f08f88ba13c966388dc'
  },
  // Suit Male, from https://booth.pm/ja/items/5178925
  suit: { file: 'office_m2.zip', sha256: '73bf53495a7b51a22e2ddc10e0748383a02048038eba7313fac5947ae482dcb5' },
  // Ice Girl, from https://booth.pm/ja/items/5975192
  ice: { file: 'IceGirl_Live2d.rar', sha256: 'eb747c3b334ea28554e14a0f29183f0cac3816864cf49e2c61c5a5ee04a1daa1' },
  // Office Girl, from https://booth.pm/ja/items/4304615
  office: { file: 'office_f_vts.zip', sha256: '87daa99434b5c75a064e18c777d9c1ab2c784c77ccf9d4473b69371b656651ce' }
}

// Each model's settings inside its archive, and its textures' scale in the portrait. Ice Girl's 8192-pixel textures
// are halved, as the handoff asks; the face's 52-point circle takes a quarter of the portrait's, to save memory.
const models: { model: CompanionModel; settings: string; scale: number }[] = [
  { model: 'ren', settings: 'runtime/ren.model3.json', scale: 1 },
  { model: 'suit', settings: 'office_m/office_m/office_m.model3.json', scale: 1 },
  { model: 'ice', settings: 'IceGIrl Live2D/IceGirl.model3.json', scale: 0.5 },
  { model: 'office', settings: 'office_f_vts/office_f_vts/office_f.model3.json', scale: 1 }
]
const faceScale = 0.25
const sdk = join(cache, 'sdk/CubismSdkForWeb-5-r.5')

type ModelSettings = {
  FileReferences: { Moc: string; Textures: string[]; Physics?: string; Pose?: string }
}

async function sha256(file: string) {
  const hasher = new Bun.CryptoHasher('sha256')
  hasher.update(await Bun.file(file).arrayBuffer())
  return hasher.digest('hex')
}

async function fetchArchive(name: keyof typeof archives) {
  const { url, file, sha256: expected } = archives[name]
  const path = join(cache, file)
  if (!existsSync(path) || (await sha256(path)) !== expected) {
    console.log(`Downloading ${file}`)
    if (url) {
      await $`curl --fail --silent --show-error --location --retry 3 --output ${path} ${url}`
    } else {
      if (!Bun.which('gh'))
        throw new Error(`${file} is on the ${release.tag} release: install gh and run gh auth login`)
      await $`gh release download ${release.tag} --repo ${release.repo} --pattern ${file} --dir ${cache} --clobber`
    }
    const actual = await sha256(path)
    if (actual !== expected) throw new Error(`${file} has SHA-256 ${actual}, not the pinned ${expected}`)
  }
  const into = join(cache, name)
  rmSync(into, { recursive: true, force: true })
  mkdirSync(into, { recursive: true })
  if (file.endsWith('.rar')) {
    const bsdtar = Bun.which('bsdtar') ?? (process.platform === 'darwin' ? 'tar' : null)
    if (!bsdtar) throw new Error('Unpacking Ice Girl needs bsdtar (libarchive-tools on Linux)')
    await $`${bsdtar} -xf ${path} -C ${into}`
  } else {
    await $`unzip -q -o ${path} -d ${into}`
  }
  return into
}

function pngSize(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset)
  return { width: view.getUint32(16), height: view.getUint32(20) }
}

// A texture at a scale, through sips on a Mac and Pillow elsewhere.
async function scaled(file: string, scale: number): Promise<Uint8Array> {
  const bytes = readFileSync(file)
  if (scale === 1) return bytes
  const { width, height } = pngSize(bytes)
  const [w, h] = [Math.round(width * scale), Math.round(height * scale)]
  const target = join(cache, 'scaled.png')
  if (Bun.which('sips')) {
    await $`sips --resampleHeightWidth ${h} ${w} ${file} --out ${target}`.quiet()
  } else {
    const script =
      'import sys; from PIL import Image; Image.open(sys.argv[1]).resize((int(sys.argv[3]), int(sys.argv[4])), Image.LANCZOS).save(sys.argv[2])'
    await $`python3 -c ${script} ${file} ${target} ${w} ${h}`
  }
  return readFileSync(target)
}

// A model as scripts the page loads with <script> tags, which a file URL in the web view always allows, base64
// encoded: its settings, moc, and physics once, and its textures at each fit's scale.
function packModel(settingsPath: string) {
  const dir = dirname(settingsPath)
  const { Moc, Physics, Pose } = (JSON.parse(readFileSync(settingsPath, 'utf8')) as ModelSettings).FileReferences
  const files: Record<string, string> = {}
  for (const name of [basename(settingsPath), Moc, Physics, Pose]) {
    if (name) files[name] = readFileSync(join(dir, name)).toString('base64')
  }
  return `window.turnModel=${JSON.stringify({ settings: basename(settingsPath), files })};\n`
}

async function packTextures(settingsPath: string, scale: number) {
  const dir = dirname(settingsPath)
  const { Textures } = (JSON.parse(readFileSync(settingsPath, 'utf8')) as ModelSettings).FileReferences
  const files: Record<string, string> = {}
  for (const name of Textures) files[name] = Buffer.from(await scaled(join(dir, name), scale)).toString('base64')
  return `window.turnTextures=${JSON.stringify(files)};\n`
}

rmSync(out, { recursive: true, force: true })
mkdirSync(join(out, 'models'), { recursive: true })
mkdirSync(cache, { recursive: true })

await fetchArchive('sdk')
for (const { model, settings, scale } of models) {
  const path = join(await fetchArchive(model), settings)
  writeFileSync(join(out, `models/${model}.js`), packModel(path))
  writeFileSync(join(out, `models/${model}-portrait.js`), await packTextures(path, scale))
  writeFileSync(join(out, `models/${model}-face.js`), await packTextures(path, scale * faceScale))
  console.log(`Packed ${model}`)
}

// The framework reads its shaders with fetch, which a file URL can't serve, so they ride along as a script too.
const shaderDir = join(sdk, 'Framework/Shaders/WebGL')
const shaders = Object.fromEntries(
  readdirSync(shaderDir).map((name) => [name, readFileSync(join(shaderDir, name), 'utf8')])
)
writeFileSync(join(out, 'shaders.js'), `window.turnShaders=${JSON.stringify(shaders)};\n`)

const framework = join(sdk, 'Framework/src')
const built = await Bun.build({
  entrypoints: [join(live2d, 'renderer.ts')],
  target: 'browser',
  format: 'iife',
  minify: true,
  plugins: [
    {
      name: 'cubism-framework',
      setup(build) {
        build.onResolve({ filter: /^@framework\// }, ({ path }) => ({
          path: join(framework, `${path.slice('@framework/'.length)}.ts`)
        }))
      }
    }
  ]
})
if (!built.success) throw new AggregateError(built.logs, 'The renderer failed to bundle')
writeFileSync(join(out, 'renderer.js'), await built.outputs[0].text())
copyFileSync(join(sdk, 'Core/live2dcubismcore.min.js'), join(out, 'core.js'))
copyFileSync(join(live2d, 'index.html'), join(out, 'index.html'))
console.log(`Built ${out}`)

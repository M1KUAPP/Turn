// The companion's live renderer (plan 0049): one model drawn by the Cubism SDK for Web on a transparent canvas, posed
// from the frame the app shows, breathing and with hair physics while it may move. scripts/fetch-companion-models.ts
// bundles it with the SDK's framework into apps/mobile/live2d/build/Live2D, the page the app's web view loads; the
// app's tsconfig leaves it out, since the framework isn't in the repo.
import { CubismDefaultParameterId } from '@framework/cubismdefaultparameterid'
import { CubismModelSettingJson } from '@framework/cubismmodelsettingjson'
import { BreathParameterData, CubismBreath } from '@framework/effect/cubismbreath'
import type { CubismIdHandle } from '@framework/id/cubismid'
import { CubismFramework, LogLevel, Option } from '@framework/live2dcubismframework'
import { CubismMatrix44 } from '@framework/math/cubismmatrix44'
import { CubismUserModel } from '@framework/model/cubismusermodel'
import { CubismShaderManager_WebGL } from '@framework/rendering/cubismshader_webgl'
import {
  liveFraming,
  livePose,
  type LiveEvent,
  type LiveInit,
  type LivePose,
  type LiveUpdate
} from '../src/companion/live2d'

declare global {
  interface Window {
    turnInit?: LiveInit
    turnModel?: { settings: string; files: Record<string, string> } | null
    turnTextures?: Record<string, string> | null
    turnShaders?: Record<string, string>
    turnSet?: (update: LiveUpdate) => void
    ReactNativeWebView?: { postMessage(message: string): void }
  }
}

const shaderPath = 'shaders/'
// 30 frames a second is plenty for breathing and hair, and halves the GPU's work beside the toolbar.
const frameMs = 1000 / 30
// Time constants, in seconds, for easing into a new pose: a blink and the mouth are quick, a look is slower.
const ease = { eyes: 0.03, mouth: 0.04, look: 0.18 }
// How far a full look nods the head, in degrees, and turns the eyes, as a share of their reach; matched to the frames.
const lookAngle = 16
const lookEyes = 0.6

// Ready once, and every error, so the app goes back to the frames whenever the model can't draw.
let ready = false
function post(event: LiveEvent) {
  if (event.type === 'ready') {
    if (ready) return
    ready = true
  }
  window.ReactNativeWebView?.postMessage(JSON.stringify(event))
}

window.addEventListener('error', (event) => post({ type: 'error', message: String(event.message) }))

// The framework fetches its shader files; the page carries them in shaders.js instead.
const realFetch = window.fetch.bind(window)
window.fetch = (input, init) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
  const source = url.startsWith(shaderPath) ? window.turnShaders?.[url.slice(shaderPath.length)] : undefined
  return source === undefined ? realFetch(input, init) : Promise.resolve(new Response(source))
}

function decode(base64: string): ArrayBuffer {
  const text = atob(base64)
  const bytes = new Uint8Array(text.length)
  for (let index = 0; index < text.length; index += 1) bytes[index] = text.charCodeAt(index)
  return bytes.buffer
}

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Couldn't load ${src}`))
    document.head.appendChild(script)
  })
}

// A texture from its PNG, premultiplied as the renderer expects; a blob URL keeps the image from tainting WebGL.
async function loadTexture(gl: WebGLRenderingContext, base64: string) {
  const url = URL.createObjectURL(new Blob([decode(base64)], { type: 'image/png' }))
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.bindTexture(gl.TEXTURE_2D, null)
    return texture
  } finally {
    URL.revokeObjectURL(url)
  }
}

const id = (name: string) => CubismFramework.getIdManager().getId(name)

class Companion extends CubismUserModel {
  private textures: WebGLTexture[] = []
  private breathing = CubismBreath.create()
  private readonly ids: Record<'eyeL' | 'eyeR' | 'mouth' | 'angleY' | 'eyeBallY', CubismIdHandle>
  private pose: LivePose
  private target: LivePose

  constructor(
    private readonly gl: WebGLRenderingContext,
    private readonly init: LiveInit
  ) {
    super()
    this.ids = {
      eyeL: id(CubismDefaultParameterId.ParamEyeLOpen),
      eyeR: id(CubismDefaultParameterId.ParamEyeROpen),
      mouth: id(CubismDefaultParameterId.ParamMouthOpenY),
      angleY: id(CubismDefaultParameterId.ParamAngleY),
      eyeBallY: id(CubismDefaultParameterId.ParamEyeBallY)
    }
    this.pose = livePose(init.frame)
    this.target = this.pose
    // The SDK sample's breath, turned down, so the face breathes but stays where it is on screen.
    this.breathing.setParameters([
      new BreathParameterData(id(CubismDefaultParameterId.ParamAngleX), 0, 1.5, 6.5345, 0.5),
      new BreathParameterData(id(CubismDefaultParameterId.ParamAngleY), 0, 1, 3.5345, 0.5),
      new BreathParameterData(id(CubismDefaultParameterId.ParamAngleZ), 0, 1.5, 5.5345, 0.5),
      new BreathParameterData(id(CubismDefaultParameterId.ParamBodyAngleX), 0, 1, 15.5345, 0.5),
      new BreathParameterData(id(CubismDefaultParameterId.ParamBreath), 0.5, 0.5, 3.2345, 1)
    ])
  }

  async load(files: Record<string, string>, settingsName: string, width: number, height: number) {
    const buffer = (name: string) => decode(files[name])
    const settingsBuffer = buffer(settingsName)
    const settings = new CubismModelSettingJson(settingsBuffer, settingsBuffer.byteLength)
    const moc = buffer(settings.getModelFileName())
    this.loadModel(moc)
    const physics = settings.getPhysicsFileName()
    if (physics) {
      const physicsBuffer = buffer(physics)
      this.loadPhysics(physicsBuffer, physicsBuffer.byteLength)
    }
    const pose = settings.getPoseFileName()
    if (pose) {
      const poseBuffer = buffer(pose)
      this.loadPose(poseBuffer, poseBuffer.byteLength)
    }
    this._model.saveParameters()
    this._physics?.stabilization(this._model)
    for (let index = 0; index < settings.getTextureCount(); index += 1) {
      this.textures.push(await loadTexture(this.gl, files[settings.getTextureFileName(index)]))
    }
    this.resize(width, height)
  }

  // A new renderer for a new canvas size, since the model's offscreen targets follow it.
  resize(width: number, height: number) {
    this.createRenderer(width, height)
    const renderer = this.getRenderer()
    renderer.startUp(this.gl)
    renderer.setIsPremultipliedAlpha(true)
    this.textures.forEach((texture, index) => renderer.bindTexture(index, texture))
    renderer.loadShaders(shaderPath)
  }

  shadersLoaded() {
    return CubismShaderManager_WebGL.getInstance().getShader(this.gl)._isShaderLoaded
  }

  setFrame(update: LiveUpdate) {
    this.target = livePose(update.frame)
  }

  // Poses the model for `seconds` since the last step: eased and breathing with physics while it moves, and straight
  // to the pose, still, when it doesn't.
  step(seconds: number, animate: boolean) {
    const model = this._model
    const toward = (from: number, to: number, time: number) =>
      animate ? from + (to - from) * (1 - Math.exp(-seconds / time)) : to
    this.pose = {
      eyes: toward(this.pose.eyes, this.target.eyes, ease.eyes),
      mouth: toward(this.pose.mouth, this.target.mouth, ease.mouth),
      look: toward(this.pose.look, this.target.look, ease.look)
    }
    model.loadParameters()
    const range = (handle: CubismIdHandle) => {
      const index = model.getParameterIndex(handle)
      return {
        index,
        min: model.getParameterMinimumValue(index),
        max: model.getParameterMaximumValue(index),
        rest: model.getParameterDefaultValue(index)
      }
    }
    for (const eye of [this.ids.eyeL, this.ids.eyeR]) {
      const { index, min, rest } = range(eye)
      model.setParameterValueByIndex(index, min + (rest - min) * this.pose.eyes)
    }
    const mouth = range(this.ids.mouth)
    model.setParameterValueByIndex(mouth.index, mouth.rest + (mouth.max - mouth.rest) * this.pose.mouth)
    model.addParameterValueById(this.ids.angleY, this.pose.look * lookAngle)
    model.addParameterValueById(this.ids.eyeBallY, this.pose.look * lookEyes)
    if (animate) {
      this.breathing.updateParameters(model, seconds)
      this._physics?.evaluate(model, seconds)
    }
    model.update()
  }

  draw(width: number, height: number) {
    const gl = this.gl
    const { CanvasWidth, CanvasHeight, CanvasOriginX, CanvasOriginY, PixelsPerUnit } = this._model.getModel().canvasinfo
    const framing = liveFraming[this.init.model][this.init.fit]
    // The framing's view in model units, mapped to the whole canvas.
    const viewHeight = (framing.height * CanvasHeight) / PixelsPerUnit
    const viewWidth = (viewHeight * width) / height
    const centreX = (framing.x * CanvasWidth - CanvasOriginX) / PixelsPerUnit
    const centreY = (CanvasOriginY - framing.y * CanvasHeight) / PixelsPerUnit
    const projection = new CubismMatrix44()
    projection.scale(2 / viewWidth, 2 / viewHeight)
    projection.translate((-2 * centreX) / viewWidth, (-2 * centreY) / viewHeight)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, width, height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    const renderer = this.getRenderer()
    renderer.setMvpMatrix(projection)
    renderer.setRenderState(null as unknown as WebGLFramebuffer, [0, 0, width, height])
    renderer.drawModel(shaderPath)
  }
}

async function start(init: LiveInit) {
  const option = new Option()
  option.logFunction = (message: string) => console.log(message)
  option.loggingLevel = LogLevel.LogLevel_Warning
  CubismFramework.startUp(option)
  CubismFramework.initialize()

  const canvas = document.querySelector('canvas')
  if (!canvas) throw new Error('The page has no canvas')
  const context = { alpha: true, premultipliedAlpha: true, antialias: true }
  const gl = (canvas.getContext('webgl2', context) ?? canvas.getContext('webgl', context)) as WebGLRenderingContext
  if (!gl) throw new Error('No WebGL')
  canvas.addEventListener('webglcontextlost', () => post({ type: 'error', message: 'WebGL context lost' }))

  const size = () => {
    const ratio = window.devicePixelRatio || 1
    return { width: Math.round(canvas.clientWidth * ratio), height: Math.round(canvas.clientHeight * ratio) }
  }
  let { width, height } = size()
  canvas.width = width
  canvas.height = height

  await Promise.all([loadScript(`models/${init.model}.js`), loadScript(`models/${init.model}-${init.fit}.js`)])
  const packed = window.turnModel
  const textures = window.turnTextures
  if (!packed || !textures) throw new Error(`models/${init.model} is incomplete`)
  window.turnModel = null
  window.turnTextures = null
  const companion = new Companion(gl, init)
  await companion.load({ ...packed.files, ...textures }, packed.settings, width, height)

  let animate = init.animate
  let frame = 0
  let last = performance.now()
  let drawn = 0
  const tick = (now: number) => {
    frame = 0
    const seconds = Math.min((now - last) / 1000, 0.1)
    if (animate && now - drawn < frameMs - 2) {
      frame = requestAnimationFrame(tick)
      return
    }
    last = now
    drawn = now
    const next = size()
    if (next.width !== width || next.height !== height) {
      ;({ width, height } = next)
      canvas.width = width
      canvas.height = height
      companion.resize(width, height)
    }
    companion.step(seconds, animate)
    // Until the shaders load, a draw draws nothing, so a still face keeps trying.
    if (!companion.shadersLoaded()) {
      frame = requestAnimationFrame(tick)
      return
    }
    companion.draw(width, height)
    post({ type: 'ready' })
    if (animate) frame = requestAnimationFrame(tick)
  }
  const wake = () => {
    if (frame) return
    last = performance.now()
    frame = requestAnimationFrame(tick)
  }
  window.turnSet = (update) => {
    animate = update.animate
    companion.setFrame(update)
    wake()
  }
  window.addEventListener('resize', wake)
  wake()
}

// The app sets turnInit before the page loads; the size may still be 0 until the web view is laid out.
function begin() {
  const init = window.turnInit
  if (!init) return post({ type: 'error', message: 'No turnInit' })
  if (!document.querySelector('canvas')?.clientWidth) return void requestAnimationFrame(begin)
  start(init).catch((error: unknown) => post({ type: 'error', message: String(error) }))
}
begin()

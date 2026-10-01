import { useEffect, useRef, useState } from 'react'
import { SectionHead } from '../components/SectionHead'
import { useInView, prefersReducedMotion } from '../lib/useInView'
import './story.css'

type FrameManifest = {
  count: number
  width: number
  height: number
  pattern: string
}

type Scene = {
  start: number
  settled: number
  fadeOut: number
  end: number
}

const SCENES: readonly Scene[] = [
  { start: 0, settled: 0, fadeOut: 0.18, end: 0.25 },
  { start: 0.25, settled: 0.32, fadeOut: 0.43, end: 0.5 },
  { start: 0.51, settled: 0.58, fadeOut: 0.66, end: 0.73 },
  { start: 0.74, settled: 0.82, fadeOut: 1, end: 1 }
]
const SPEED_VALUES = [125, 185, 8, 10] as const

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function sceneOpacity(progress: number, scene: Scene) {
  if (progress < scene.start || progress > scene.end) return 0
  if (progress < scene.settled) return clamp01((progress - scene.start) / (scene.settled - scene.start))
  if (progress <= scene.fadeOut) return 1
  return clamp01(1 - (progress - scene.fadeOut) / (scene.end - scene.fadeOut))
}

function frameUrl(pattern: string, frame: number) {
  return pattern.replace(/%0?(\d*)d/, (_match, width: string) => String(frame).padStart(Number(width) || 1, '0'))
}

function loadImage(source: string, pending: Set<HTMLImageElement>) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    pending.add(image)
    image.onload = () => {
      pending.delete(image)
      void image
        .decode()
        .catch(() => undefined)
        .then(() => resolve(image))
    }
    image.onerror = () => {
      pending.delete(image)
      reject(new Error(`Could not load ${source}`))
    }
    image.src = source
  })
}

function lerpStep(current: number, target: number, seconds: number) {
  const next = current + (target - current) * (1 - Math.exp(-seconds * 8))
  return Math.abs(target - next) < 0.002 ? target : next
}

export function Story() {
  const cinematicRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const stillRef = useRef<HTMLImageElement | null>(null)
  const beatRefs = useRef<Array<HTMLDivElement | null>>([])
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([])
  const typedTextRef = useRef<HTMLSpanElement | null>(null)
  const answerCardRef = useRef<HTMLDivElement | null>(null)
  const [mediaMode, setMediaMode] = useState<'still' | 'frames'>('still')
  const [stillReady, setStillReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const cinematic = cinematicRef.current
    const canvas = canvasRef.current
    if (!cinematic || !canvas) return

    setMediaMode('still')
    if (reducedMotion) return

    const context = canvas.getContext('2d')
    if (!context) return

    let near = false
    let running = false
    let raf = 0
    let lastTime = performance.now()
    let currentFrame = 0
    let drawnFrame = -1
    let drawnSurface = ''
    let frameCount = 0
    let frameWidth = 1280
    let frameHeight = 720
    let pattern = ''
    let preloadStarted = false
    const decodedFrames: Array<HTMLImageElement | undefined> = []
    const pendingImages = new Set<HTMLImageElement>()
    const controller = new AbortController()

    const progressForSection = () => {
      const rect = cinematic.getBoundingClientRect()
      const scrollSpan = Math.max(0, cinematic.offsetHeight - window.innerHeight)
      return scrollSpan > 0 ? clamp01(-rect.top / scrollSpan) : 0
    }

    const updateStory = (progress: number) => {
      beatRefs.current.forEach((beat, index) => {
        if (beat) beat.style.setProperty('--story-opacity', String(sceneOpacity(progress, SCENES[index])))
      })

      const typingProgress = clamp01((progress - 0.31) / 0.1)
      const typedLength = Math.floor(typingProgress * 4)
      const typedText = 'It was hard'.slice(0, typedLength)
      if (typedTextRef.current && typedTextRef.current.textContent !== typedText) {
        typedTextRef.current.textContent = typedText
      }

      const crossingProgress = clamp01((progress - 0.52) / 0.1)
      if (answerCardRef.current) {
        answerCardRef.current.style.setProperty('--story-answer-opacity', String(1 - crossingProgress * 0.65))
        answerCardRef.current.style.setProperty('--story-strike', String(crossingProgress))
      }

      const activeBeat = progress < 0.25 ? 0 : progress < 0.51 ? 1 : progress < 0.74 ? 2 : 3
      dotRefs.current.forEach((dot, index) => {
        if (!dot) return
        const active = index === activeBeat ? 'true' : 'false'
        if (dot.dataset.active !== active) dot.dataset.active = active
      })
    }

    const drawFrame = (now: number, progress: number) => {
      if (frameCount === 0) return
      const targetFrame = progress * (frameCount - 1)
      const seconds = Math.min(0.1, Math.max(0, now - lastTime) / 1000)
      currentFrame = lerpStep(currentFrame, targetFrame, seconds)
      const requestedIndex = Math.round(currentFrame)

      let image = decodedFrames[requestedIndex]
      let imageIndex = requestedIndex
      if (!image) {
        let bestDistance = Number.POSITIVE_INFINITY
        for (let index = 0; index < decodedFrames.length; index += 1) {
          const candidate = decodedFrames[index]
          if (!candidate) continue
          const distance = Math.abs(index - requestedIndex)
          if (distance < bestDistance) {
            image = candidate
            imageIndex = index
            bestDistance = distance
          }
        }
      }
      if (!image) return

      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      const pixelWidth = Math.round(rect.width * dpr)
      const pixelHeight = Math.round(rect.height * dpr)
      const surface = `${pixelWidth}x${pixelHeight}@${dpr}`
      const resized = surface !== drawnSurface
      if (resized) {
        canvas.width = pixelWidth
        canvas.height = pixelHeight
        drawnSurface = surface
      }
      if (imageIndex === drawnFrame && !resized) return

      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, rect.width, rect.height)
      const sourceWidth = image.naturalWidth || frameWidth
      const sourceHeight = image.naturalHeight || frameHeight
      const scale = Math.max(rect.width / sourceWidth, rect.height / sourceHeight)
      const width = sourceWidth * scale
      const height = sourceHeight * scale
      context.drawImage(image, (rect.width - width) / 2, (rect.height - height) / 2, width, height)
      drawnFrame = imageIndex
    }

    const tick = (now: number) => {
      raf = 0
      if (!near) {
        running = false
        return
      }
      const progress = progressForSection()
      updateStory(progress)
      if (stillRef.current) {
        stillRef.current.style.transform = `scale(${1 + progress * 0.12})`
      }
      drawFrame(now, progress)
      lastTime = now
      raf = requestAnimationFrame(tick)
    }

    const startLoop = () => {
      if (running) return
      near = true
      running = true
      lastTime = performance.now()
      raf = requestAnimationFrame(tick)
    }

    const stopLoop = () => {
      near = false
      running = false
      cancelAnimationFrame(raf)
      raf = 0
    }

    const preload = async () => {
      if (preloadStarted) return
      preloadStarted = true
      try {
        const response = await fetch('/img/story/frames.json', { signal: controller.signal })
        if (!response.ok) throw new Error('Frame manifest is unavailable')
        const manifest = (await response.json()) as FrameManifest
        if (!manifest.count || !manifest.pattern || controller.signal.aborted) throw new Error('Invalid frame manifest')
        frameCount = manifest.count
        frameWidth = manifest.width || frameWidth
        frameHeight = manifest.height || frameHeight
        pattern = manifest.pattern

        decodedFrames[0] = await loadImage(frameUrl(pattern, 1), pendingImages)
        if (controller.signal.aborted) return
        setMediaMode('frames')
        if (near) startLoop()

        for (let index = 1; index < frameCount; index += 1) {
          if (controller.signal.aborted) return
          try {
            decodedFrames[index] = await loadImage(frameUrl(pattern, index + 1), pendingImages)
          } catch {
            // Keep the nearest decoded image available if an individual frame is missing.
          }
        }
      } catch {
        setMediaMode('still')
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startLoop()
          void preload()
        } else {
          stopLoop()
        }
      },
      { rootMargin: `${Math.max(window.innerHeight, 720)}px 0px`, threshold: 0 }
    )
    observer.observe(cinematic)

    return () => {
      observer.disconnect()
      stopLoop()
      controller.abort()
      pendingImages.forEach((image) => {
        image.onload = null
        image.onerror = null
        image.src = ''
      })
    }
  }, [reducedMotion])

  return (
    <section
      className="story"
      id="story"
      data-section="story"
      data-motion={reducedMotion ? 'reduced' : 'full'}
      data-media={mediaMode}
      data-still-ready={stillReady ? 'true' : 'false'}
    >
      <div className="story-cinematic" ref={cinematicRef}>
        <div className="story-stage">
          <div className="story-media" aria-hidden="true">
            <img
              className="story-still"
              src="/img/story/still.webp"
              alt=""
              ref={stillRef}
              onLoad={() => setStillReady(true)}
              onError={() => setStillReady(false)}
            />
            <canvas className="story-canvas" ref={canvasRef} />
          </div>
          <div className="story-scrim" aria-hidden="true" />

          <div className="story-beats">
            <div
              className="story-beat"
              ref={(node) => {
                beatRefs.current[0] = node
              }}
            >
              <div className="story-beat-inner">
                <h3 className="story-opening">
                  <span className="story-serif">You have ALS. Your mind is sharp.</span>
                  <span className="story-voice">Your voice and hands aren&apos;t.</span>
                </h3>
              </div>
            </div>

            <div
              className="story-beat"
              ref={(node) => {
                beatRefs.current[1] = node
              }}
            >
              <div className="story-beat-inner">
                <p className="story-label">They ask</p>
                <h3 className="story-partner-line">How was physio?</h3>
                <p className="story-label story-typing-label">You, typing at 9 words a minute</p>
                <div className="story-typing-card">
                  <span ref={typedTextRef}>It w</span>
                  <span className="story-caret" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div
              className="story-beat"
              ref={(node) => {
                beatRefs.current[2] = node
              }}
            >
              <div className="story-beat-inner">
                <p className="story-label">They answer for you</p>
                <h3 className="story-partner-line">Tiring, huh?</h3>
                <div className="story-answer-card" ref={answerCardRef}>
                  <span>It w</span>
                  <span className="story-strike" aria-hidden="true" />
                </div>
                <p className="story-afterthought">And the conversation moves on.</p>
              </div>
            </div>

            <div
              className="story-beat story-beat-close"
              ref={(node) => {
                beatRefs.current[3] = node
              }}
            >
              <div className="story-beat-inner story-close-inner">
                <h3 className="story-close-line">
                  <span className="story-serif">Conversation doesn&apos;t wait.</span>
                  <span className="story-voice">So Turn gets your words ready first.</span>
                </h3>
              </div>
            </div>
          </div>

          <div className="story-rail" aria-hidden="true">
            {SCENES.map((_scene, index) => (
              <span
                className="story-rail-dot"
                data-active={index === 0 ? 'true' : 'false'}
                key={index}
                ref={(node) => {
                  dotRefs.current[index] = node
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="section story-gap">
        <div className="wrap">
          <div className="story-gap-top">
            <div className="story-gap-copy">
              <SectionHead
                eyebrow="The gap"
                serif="Talk runs at 125 to 185 words a minute."
                voice="A speech device, 8 to 10."
              />
              <p className="body story-gap-body">
                80 to 95% of people with ALS eventually lose reliable speech. They still have plenty to say.
                Conversation just doesn&apos;t wait.
              </p>
            </div>
            <SpeedBars />
          </div>

          <div className="story-gap-panels">
            <div className="panel blue story-latency">
              <p className="num story-latency-number">1.8 s</p>
              <p className="story-latency-copy">from the end of their sentence to your replies</p>
              <p className="story-latency-note">Median on a real iPhone, 52 lines</p>
            </div>

            <div className="panel story-replies">
              <p className="caps accent">With Turn</p>
              <p className="serif story-replies-line">The reply is waiting before you reach for the keyboard.</p>
              <div className="story-reply-grid" role="list" aria-label="Suggested replies">
                <div className="card cat-care story-reply-card" role="listitem">
                  It went well
                </div>
                <div className="card cat-care speaking story-reply-card" role="listitem">
                  It was hard
                </div>
                <div className="card cat-pain story-reply-card" role="listitem">
                  It&apos;s getting worse
                </div>
                <div className="card cat-chat story-reply-card" role="listitem">
                  I&apos;m good, thanks
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SpeedBars() {
  const [barsRef, inView] = useInView<HTMLDivElement>({ threshold: 0.22, rootMargin: '0px 0px -4% 0px' })
  const [reduced, setReduced] = useState(prefersReducedMotion)
  const [values, setValues] = useState<number[]>([0, 0, 0, 0])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (reduced) {
      setValues([...SPEED_VALUES])
      return
    }
    if (!inView) return

    let raf = 0
    const start = performance.now()
    let lastUpdate = start
    const animate = (now: number) => {
      const progress = clamp01((now - start) / 1200)
      const eased = 1 - (1 - progress) ** 4
      if (progress === 1 || now - lastUpdate >= 40) {
        setValues(SPEED_VALUES.map((target) => Math.round(target * eased)))
        lastUpdate = now
      }
      if (progress < 1) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced])

  const visible = inView || reduced

  return (
    <div className={`story-speeds${visible ? ' is-visible' : ''}`} ref={barsRef}>
      <div className="story-speed-row">
        <p className="num story-speed-number">
          {values[0]}–{values[1]}
        </p>
        <div className="story-speed-detail">
          <p className="story-speed-label">Conversation, words a minute</p>
          <div className="story-bar-track" aria-hidden="true">
            <span className="story-bar story-bar-full" />
          </div>
        </div>
      </div>
      <div className="story-speed-row">
        <p className="num story-speed-number">
          {values[2]}–{values[3]}
        </p>
        <div className="story-speed-detail">
          <p className="story-speed-label">Typing on a speech device, words a minute</p>
          <div className="story-bar-track" aria-hidden="true">
            <span className="story-bar story-bar-device" />
          </div>
        </div>
      </div>
    </div>
  )
}

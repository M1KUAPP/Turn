import { useEffect, useRef, useState } from 'react'
import { Phone } from '../components/Phone'
import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import { prefersReducedMotion } from '../lib/useInView'
import './faces.css'

const companions = ['Ren', 'Suit', 'Office', 'Ice'] as const
type Companion = (typeof companions)[number]
type FaceFrame = 'rest' | 'blink' | 'half' | 'open'

let activeFacePlayback: (() => void) | null = null

function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(() => prefersReducedMotion())

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reducedMotion
}

function SpeakerIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M4 10v4h4l5 4V6l-5 4H4Z" />
      <path d="M16 9.5a4 4 0 0 1 0 5M18.5 7a7.5 7.5 0 0 1 0 10" />
    </svg>
  )
}

function CompanionCard({ name }: { name: Companion }) {
  const [frame, setFrame] = useState<FaceFrame>('rest')
  const [speaking, setSpeaking] = useState(false)
  const reducedMotion = useReducedMotionPreference()
  const mouthTimer = useRef<number | undefined>(undefined)
  const fallbackTimer = useRef<number | undefined>(undefined)
  const stopPlayback = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (reducedMotion) return

    let blinkTimer = 0
    let restoreTimer = 0
    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(
        () => {
          setFrame('blink')
          restoreTimer = window.setTimeout(() => {
            setFrame('rest')
            scheduleBlink()
          }, 120)
        },
        3000 + Math.random() * 3000
      )
    }
    scheduleBlink()
    return () => {
      window.clearTimeout(blinkTimer)
      window.clearTimeout(restoreTimer)
    }
  }, [speaking, reducedMotion])

  useEffect(() => {
    if (!reducedMotion || !speaking) return
    window.clearInterval(mouthTimer.current)
    setFrame('open')
  }, [reducedMotion, speaking])

  useEffect(() => {
    return () => {
      window.clearInterval(mouthTimer.current)
      window.clearTimeout(fallbackTimer.current)
      if (activeFacePlayback === stopPlayback.current) {
        window.speechSynthesis?.cancel()
        activeFacePlayback = null
      }
    }
  }, [])

  const sayPhrase = () => {
    activeFacePlayback?.()
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    window.clearInterval(mouthTimer.current)
    window.clearTimeout(fallbackTimer.current)

    setSpeaking(true)
    setFrame(reducedMotion ? 'open' : 'half')

    const mouthFrames: FaceFrame[] = ['half', 'open', 'half', 'rest']
    let frameIndex = 0
    if (!reducedMotion) {
      mouthTimer.current = window.setInterval(() => {
        frameIndex = (frameIndex + 1) % mouthFrames.length
        setFrame(mouthFrames[frameIndex])
      }, 90)
    }

    let stopped = false
    const stop = () => {
      if (stopped) return
      stopped = true
      window.clearInterval(mouthTimer.current)
      window.clearTimeout(fallbackTimer.current)
      setSpeaking(false)
      setFrame('rest')
      if (activeFacePlayback === stop) activeFacePlayback = null
      if (stopPlayback.current === stop) stopPlayback.current = null
    }
    stopPlayback.current = stop
    activeFacePlayback = stop

    if (typeof SpeechSynthesisUtterance === 'undefined' || !('speechSynthesis' in window)) {
      fallbackTimer.current = window.setTimeout(stop, 1600)
      return
    }

    const voices = window.speechSynthesis.getVoices()
    const hasAvailableVoice = voices.length > 0
    if (!hasAvailableVoice) {
      fallbackTimer.current = window.setTimeout(stop, 1600)
    }

    const utterance = new SpeechSynthesisUtterance('It was hard')
    const englishVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('en'))
    if (englishVoice) utterance.voice = englishVoice
    utterance.rate = 1
    utterance.lang = englishVoice?.lang ?? 'en-US'
    utterance.onend = hasAvailableVoice ? stop : null
    utterance.onerror = () => {
      if (stopped) return
      window.clearTimeout(fallbackTimer.current)
      fallbackTimer.current = window.setTimeout(stop, 1600)
    }

    try {
      window.speechSynthesis.speak(utterance)
    } catch {
      window.clearTimeout(fallbackTimer.current)
      fallbackTimer.current = window.setTimeout(stop, 1600)
    }
  }

  return (
    <Reveal className="faces-card-reveal">
      <button
        type="button"
        className={`panel faces-companion${speaking ? ' faces-speaking' : ''}`}
        aria-label={`Hear ${name} say: It was hard`}
        onClick={sayPhrase}
      >
        <span className="faces-portrait">
          <img
            src={`/img/faces/${name.toLowerCase()}-portrait-${frame}.webp`}
            alt={`${name}, a Turn companion`}
            width="800"
            height="1000"
            decoding="async"
          />
          <span
            className={`card speaking faces-bubble${speaking ? ' faces-bubble-visible' : ''}`}
            aria-hidden={!speaking}
          >
            <span>It was hard</span>
            <SpeakerIcon />
          </span>
        </span>
        <span className="faces-name">{name}</span>
      </button>
    </Reveal>
  )
}

const careScreens = [
  ['care-light', 'Light', 'Turn in light appearance, showing the reply controls.'],
  ['care-dark', 'Dark', 'Turn in dark appearance, showing the reply controls.'],
  ['care-contrast', 'Increase Contrast', 'Turn with Increase Contrast enabled.'],
  ['care-ax5', 'Largest text', 'Turn with the largest text setting.']
] as const

export function Faces() {
  const careGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const frames: FaceFrame[] = ['rest', 'blink', 'half', 'open']
    companions.forEach((name) => {
      frames.forEach((frame) => {
        const image = new Image()
        image.src = `/img/faces/${name.toLowerCase()}-portrait-${frame}.webp`
      })
    })

    const screenImages = careGridRef.current?.querySelectorAll('img') ?? []
    screenImages.forEach((image) => {
      image.loading = 'eager'
      void image.decode().catch(() => undefined)
    })
  }, [])

  return (
    <section className="section faces-section" id="faces" data-section="faces">
      <div className="wrap">
        <SectionHead
          eyebrow="A face for your words"
          serif="Tap a face."
          voice="Your partner sees it speak."
          lede="Pick a Live2D companion. When Turn speaks, its mouth moves with your words, so the person across from you has a face to look at, not a phone."
        />

        <div className="faces-companion-grid">
          {companions.map((name) => (
            <CompanionCard key={name} name={name} />
          ))}
        </div>
        <p className="body faces-hint">
          Tap a face to hear it. Turn uses the voice you choose; your browser&apos;s voice is standing in here.
        </p>

        <div className="faces-care">
          <h3 className="serif faces-care-heading">Built for the largest text, dark mode and high contrast.</h3>
          <div ref={careGridRef} className="faces-care-grid">
            {careScreens.map(([screen, caption, alt], index) => (
              <Reveal key={screen} className="faces-care-cell" delay={index * 90}>
                <Phone screen={screen} alt={alt} width="clamp(150px, 17vw, 230px)" className="faces-care-phone" />
                <span className="chip soft faces-care-chip">{caption}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

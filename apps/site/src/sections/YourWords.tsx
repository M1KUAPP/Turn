import { useEffect, useState } from 'react'
import { Phone } from '../components/Phone'
import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import { useInView, prefersReducedMotion } from '../lib/useInView'
import './words.css'

const TYPED_PHRASE = 'I need a break'

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

const categories = [
  ['Quick', 'quick'],
  ['Chat', 'chat'],
  ['Care and help', 'care'],
  ['Body and pain', 'pain'],
  ['Food and drink', 'food'],
  ['Feelings', 'feel'],
  ['Family and friends', 'family'],
  ['Health', 'health'],
  ['Out and about', 'out']
] as const

function AnswerIcon({ kind }: { kind: 'yes' | 'no' | 'unsure' }) {
  if (kind === 'yes') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="m5 12.5 4.5 4.5L19 7" />
      </svg>
    )
  }
  if (kind === 'no') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    )
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M9.4 9a2.7 2.7 0 1 1 4.4 2.1c-1.1.9-1.8 1.3-1.8 2.9" />
      <path d="M12 18.2h.01" />
    </svg>
  )
}

function AnswerCards() {
  return (
    <div className="words-answer-row" aria-label="Yes, No, and Not sure">
      {(['yes', 'no', 'unsure'] as const).map((kind) => (
        <div key={kind} className={`card words-answer words-answer--${kind} ${kind}`}>
          <span className="words-answer-disc" aria-hidden="true">
            <AnswerIcon kind={kind} />
          </span>
          <span>{kind === 'unsure' ? 'Not sure' : kind === 'yes' ? 'Yes' : 'No'}</span>
        </div>
      ))}
    </div>
  )
}

function ComposerVisual() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 })
  const reducedMotion = useReducedMotionPreference()
  const [typed, setTyped] = useState(reducedMotion ? TYPED_PHRASE : '')

  useEffect(() => {
    if (reducedMotion) {
      setTyped(TYPED_PHRASE)
      return
    }
    if (!inView) return

    let index = 0
    setTyped('')
    const interval = window.setInterval(() => {
      index += 1
      setTyped(TYPED_PHRASE.slice(0, index))
      if (index >= TYPED_PHRASE.length) window.clearInterval(interval)
    }, 55)
    return () => window.clearInterval(interval)
  }, [inView, reducedMotion])

  return (
    <div ref={ref} className="words-composer" aria-label={`Typed phrase: ${TYPED_PHRASE}`}>
      <div className="words-composer-field">
        <span className="words-composer-text">{typed}</span>
        <span className="words-composer-caret" aria-hidden="true" />
      </div>
      <span className="btn accent words-speak-button">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <path d="M4 10v4h4l5 4V6l-5 4H4Z" />
          <path d="M16 9.5a4 4 0 0 1 0 5M18.5 7a7.5 7.5 0 0 1 0 10" />
        </svg>
        Speak
      </span>
    </div>
  )
}

function CategoryCloud() {
  return (
    <div className="words-category-cloud" aria-label="Nine phrase categories">
      {categories.map(([label, category]) => (
        <span key={category} className={`chip soft words-category words-category--${category}`}>
          <span className="words-category-dot" aria-hidden="true" />
          {label}
        </span>
      ))}
    </div>
  )
}

const samplePhrases = [
  ['Can we take a break?', 'cat-quick'],
  ["I'm thirsty", 'cat-food'],
  ['It hurts here', 'cat-pain'],
  ['I love you', 'cat-family'],
  ['Call my daughter', 'cat-family'],
  ["Let's go outside", 'cat-out']
] as const

export function YourWords() {
  return (
    <section className="section words-section" id="words" data-section="words">
      <div className="wrap">
        <SectionHead eyebrow="Everything else" serif="Not a reply in the row?" voice="Your words are one tap away." />

        <div className="words-grid">
          <Reveal className="words-panel words-place panel">
            <div className="words-copy">
              <h3 className="h3 words-title">Places change the phrases</h3>
              <p className="body words-description">
                Pick Clinic, Home, Shop or Out, and the phrases for that place come first.
              </p>
            </div>
            <div className="words-place-window">
              <Phone
                screen="step-1-pick-a-place"
                alt="Place menu: Home, Clinic, Shop, Out"
                width="clamp(176px, 17vw, 226px)"
                className="words-place-phone"
              />
            </div>
          </Reveal>

          <Reveal className="words-panel words-replies panel" delay={80}>
            <div className="words-copy">
              <h3 className="h3 words-title">Yes and No, always in reach</h3>
              <p className="body words-description">
                A yes-or-no question puts big Yes, No and Not sure buttons first.
              </p>
            </div>
            <AnswerCards />
          </Reveal>

          <Reveal className="words-panel words-type panel" delay={40}>
            <div className="words-copy">
              <h3 className="h3 words-title">Nothing fits? Type it.</h3>
              <p className="body words-description">
                Turn speaks what you type and saves it to your phrase bank for next time.
              </p>
            </div>
            <ComposerVisual />
          </Reveal>

          <Reveal className="words-panel words-bank panel" delay={100}>
            <div className="words-copy">
              <h3 className="h3 words-title">About 150 starter phrases, all yours to edit</h3>
              <p className="body words-description">
                Nine categories, from Quick and Chat to Body and pain. Rewrite, reorder, add your own.
              </p>
            </div>
            <CategoryCloud />
            <div className="words-sample-phrases" aria-label="Sample phrases">
              {samplePhrases.map(([phrase, category], index) => (
                <span key={phrase} className={`card words-sample-card ${category}`} data-index={index}>
                  {phrase}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal className="panel sunken words-voice" delay={80}>
            <div className="words-voice-copy">
              <h3 className="h3 words-title">Speaks in your voice</h3>
              <p className="body words-description">
                Use the Personal Voice you made on your iPhone, or any system voice, at the speed you like.
              </p>
            </div>
            <div className="words-voice-options">
              <span className="chip soft words-voice-chip">Personal Voice</span>
              <span className="chip soft words-voice-chip">System voices</span>
              <span className="chip soft words-voice-chip">Speech rate</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

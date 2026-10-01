import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Phone } from '../components/Phone'
import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import './how.css'

const steps = [
  {
    title: 'Your partner agrees',
    description:
      'Each time Listen mode starts, your partner sees a consent card and chooses. A partner under 18 is never heard.',
    screen: 'partner-consent',
    alt: 'Partner consent card: Can my phone listen while we talk?'
  },
  {
    title: 'Turn listens',
    description:
      'Their words turn into text on the phone, live. An orange light shows while it listens, and one tap pauses it.',
    screen: 'v-theyre-saying',
    alt: "The caption shows They're saying: How was physio?"
  },
  {
    title: 'Your replies appear',
    description:
      'Up to six of your own saved phrases, about 1.8 seconds after they finish. A yes-or-no question puts Yes and No first.',
    screen: 'v-replies',
    alt: "Reply row: It went well, It was hard, It's getting worse, I'm good, thanks"
  },
  {
    title: 'Tap. Turn says it.',
    description:
      'Out loud, in your Personal Voice or a system voice. Turn a companion on, and your partner sees a face say it.',
    screen: 'partner-view',
    alt: 'Partner view: a companion above the words It went well'
  }
] as const

function ListeningChip({ active, mobile = false }: { active: boolean; mobile?: boolean }) {
  return (
    <span
      className={`chip listen how-listening-chip${mobile ? ' how-listening-chip-mobile' : ''}${active ? ' how-visible' : ''}`}
      aria-hidden={!active}
    >
      <span className="light" aria-hidden="true" />
      Listening
    </span>
  )
}

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const stepsRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const list = stepsRef.current
    if (!list) return

    // The active step is the last one whose text has risen past 60% of the
    // viewport, so the phone changes as each step comes into reading position.
    let raf = 0
    const update = () => {
      raf = 0
      const line = window.innerHeight * 0.6
      let index = 0
      list.querySelectorAll<HTMLElement>('[data-how-step]').forEach((step) => {
        if (step.getBoundingClientRect().top < line) index = Number(step.dataset.howStep) || 0
      })
      setActiveStep(index)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const listening = activeStep === 1 || activeStep === 2

  return (
    <section className="section how" id="how" data-section="how" aria-labelledby="how-title">
      <div className="wrap">
        <SectionHead
          id="how-title"
          eyebrow="How Listen mode works"
          serif="Their question."
          voice="Your answer in one tap."
          lede="Turn listens while your partner talks. When they finish, a row of your own saved phrases is ready. Nothing speaks until you tap."
        />

        <div className="how-layout">
          <ol
            className="how-steps"
            ref={stepsRef}
            aria-label="How Listen mode works"
            style={{ '--how-rail-length': `${activeStep * 44}svh` } as CSSProperties}
          >
            {steps.map((step, index) => (
              <li
                className={`how-step${activeStep === index ? ' how-active' : ''}`}
                key={step.screen}
                aria-current={activeStep === index ? 'step' : undefined}
              >
                <div className="how-step-copy" data-how-step={index}>
                  <span className={`num how-marker how-marker-${index + 1}`} aria-hidden="true">
                    {index + 1}
                  </span>
                  <div className="how-step-words">
                    <h3 className="h3 how-step-title">{step.title}</h3>
                    <p className="body how-step-description">{step.description}</p>
                  </div>
                </div>

                <div className="how-mobile-visual">
                  <Reveal className="how-mobile-phone-wrap">
                    <Phone width="min(300px, 72vw)" className="how-mobile-phone">
                      <img
                        className="how-mobile-capture"
                        src={`/img/screens/${step.screen}.webp`}
                        alt={step.alt}
                        loading="eager"
                        decoding="sync"
                        width={1178}
                        height={2556}
                      />
                    </Phone>
                    {(index === 1 || index === 2) && <ListeningChip active={activeStep === index} mobile />}
                  </Reveal>
                </div>
              </li>
            ))}
          </ol>

          <aside className="how-stage" aria-label="Listen mode on an iPhone">
            <div className="how-phone-wrap">
              <div className={`how-lamp${listening ? ' how-listening' : ''}`} aria-hidden="true" />
              <Phone width="clamp(260px, 25vw, 340px)" className="how-desktop-phone">
                <div className="how-screen">
                  {steps.map((step, index) => (
                    <img
                      className={`how-capture${activeStep === index ? ' how-active' : ''}`}
                      key={step.screen}
                      src={`/img/screens/${step.screen}.webp`}
                      alt={step.alt}
                      aria-hidden={activeStep !== index}
                      loading="eager"
                      decoding="sync"
                    />
                  ))}
                </div>
              </Phone>
              <ListeningChip active={listening} />
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

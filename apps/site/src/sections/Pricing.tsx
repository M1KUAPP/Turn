import { useEffect, useRef } from 'react'
import './pricing.css'
import { Phone } from '../components/Phone'
import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'

const freeFeatures = [
  'The speaking grid and about 150 starter phrases',
  'Typing, spoken aloud',
  'Your saved phrases and places',
  'Personal Voice and system voices',
  'Companions'
]

const listenFeatures = [
  'Listen mode after 20 free partner lines',
  'Replies from your own phrases as your partner finishes',
  'Restore Purchases on any of your devices'
]

function FeatureList({ items, inverse = false }: { items: string[]; inverse?: boolean }) {
  return (
    <ul className={`pricing-list${inverse ? ' pricing-list--inverse' : ''}`}>
      {items.map((item) => (
        <li className="pricing-feature" key={item}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
            <path
              d="m5 12.5 4.4 4.2L19 7.5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function Pricing() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const paywallImage = sectionRef.current?.querySelector<HTMLImageElement>('.pricing-phone > img')
    if (paywallImage) {
      paywallImage.loading = 'eager'
      void paywallImage.decode()
    }
  }, [])

  return (
    <section ref={sectionRef} className="section pricing" id="pricing" data-section="pricing">
      <div className="wrap">
        <SectionHead align="center" eyebrow="Pricing" serif="Talking stays free." voice="Listening is one payment." />

        <div className="pricing-layout">
          <Reveal className="pricing-reveal">
            <article className="panel pricing-card">
              <h3 className="caps pricing-tier">Speak</h3>
              <p className="num pricing-price">Free</p>
              <p className="pricing-period">Always.</p>
              <FeatureList items={freeFeatures} />
              <p className="pricing-note">The paywall never stands between you and speech.</p>
            </article>
          </Reveal>

          <Reveal className="pricing-reveal" delay={90}>
            <article className="panel blue pricing-card pricing-card--listen">
              <h3 className="caps pricing-tier">Turn Listen</h3>
              <p className="num pricing-price">US$24.99</p>
              <p className="pricing-period">Once. No subscription.</p>
              <FeatureList items={listenFeatures} inverse />
              <div className="chip pricing-revenuecat">
                <img src="/img/logos/revenuecat.svg" alt="" />
                <span>Through RevenueCat</span>
              </div>
            </article>
          </Reveal>

          <Reveal className="pricing-phone-wrap" delay={180}>
            <Phone
              screen="turn-listen-paywall"
              alt="Turn Listen paywall: one payment of US$24.99, Restore Purchases"
              width="clamp(176px, 28vw, 224px)"
              className="pricing-phone"
            />
          </Reveal>
        </div>

        <Reveal as="blockquote" className="pricing-quote" delay={120}>
          <p className="serif pricing-quote-text">“Paying monthly to be heard felt wrong.”</p>
          <cite className="caps pricing-quote-byline">The Turn team</cite>
        </Reveal>
      </div>
    </section>
  )
}

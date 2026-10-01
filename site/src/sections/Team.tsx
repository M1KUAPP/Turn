import { useEffect, useState } from 'react'
import './team.css'
import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import { LINKS } from '../lib/links'
import { prefersReducedMotion, useInView } from '../lib/useInView'

const members = [
  { name: 'Lim Yuh Kang', handle: 'kymil4', avatar: 'av_kymil4' },
  { name: 'Hee Zi Jie', handle: 'AlaskanTuna', avatar: 'av_AlaskanTuna' },
  { name: 'Jeremy Woon', handle: 'WhiteAvocad0', avatar: 'av_WhiteAvocad0' }
] as const

const stats = [
  { value: 1300, prefix: '', suffix: '+', label: 'commits on main', blue: true },
  { value: 100, prefix: '', suffix: '+', label: 'pull requests merged', blue: false },
  { value: 900, prefix: '~', suffix: '', label: 'automated tests', blue: false }
]

type CountUpProps = Pick<(typeof stats)[number], 'value' | 'prefix' | 'suffix'>

function CountUp({ value, prefix, suffix }: CountUpProps) {
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.3 })
  const reducedMotion = prefersReducedMotion()
  const [count, setCount] = useState(reducedMotion ? value : 0)

  useEffect(() => {
    if (reducedMotion) {
      setCount(value)
      return
    }
    if (!inView) return

    let frame = 0
    let start = 0
    const duration = 900
    const animate = (now: number) => {
      if (!start) start = now
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const next = Math.round(value * eased)
      setCount((current) => (current === next ? current : next))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [inView, reducedMotion, value])

  const format = (number: number) => new Intl.NumberFormat('en-US').format(number)

  return (
    <>
      <span className="num team-stat-number" aria-hidden="true">
        <span ref={ref}>
          {prefix}
          {format(count)}
          {suffix}
        </span>
      </span>
      <span className="sr-only">
        {prefix}
        {format(value)}
        {suffix}
      </span>
    </>
  )
}

export function Team() {
  return (
    <section className="section team" id="team" data-section="team">
      <div className="wrap">
        <SectionHead eyebrow="Team M1KU" serif="Three students. One week." voice="One very quiet AI." />

        <div className="team-members">
          {members.map(({ name, handle, avatar }, index) => (
            <Reveal key={handle} delay={index * 90}>
              <article className="panel team-member">
                <img
                  className="team-avatar"
                  src={`/img/team/${avatar}.webp`}
                  alt={`Portrait of ${name}`}
                  width="120"
                  height="120"
                />
                <h3 className="serif team-member-name">{name}</h3>
                <a className="team-member-handle" href={LINKS.team[handle]} target="_blank" rel="noreferrer">
                  @{handle}
                </a>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="team-stats">
          {stats.map(({ blue, ...stat }, index) => (
            <Reveal key={stat.label} delay={index * 90}>
              <article className={`panel team-stat-panel${blue ? ' blue' : ''}`}>
                <CountUp {...stat} />
                <p className="team-stat-label">{stat.label}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="body team-thanks">
          Thanks to RevenueCat for Shipaton, and for a Test Store that let us buy our own app more times than we&apos;d
          like to admit.
        </p>

        <Reveal className="panel team-cta">
          <div className="team-cta-copy">
            <h3 className="serif team-cta-title">Turn is open source.</h3>
            <p className="body">MIT licensed. The Simulator build runs on any Mac with Xcode.</p>
          </div>
          <div className="team-cta-actions">
            <a className="btn ink" href={LINKS.github} target="_blank" rel="noreferrer">
              <img className="team-github-mark" src="/img/logos/github.svg" alt="" aria-hidden="true" />
              Star on GitHub
            </a>
            <a className="btn" href={LINKS.release} target="_blank" rel="noreferrer">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 3v9m0 0 3.5-3.5M10 12 6.5 8.5M4 14v2h12v-2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Get the Simulator build
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

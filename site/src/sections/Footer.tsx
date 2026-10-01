import { useEffect, useRef } from 'react'
import { LINKS } from '../lib/links'
import { prefersReducedMotion } from '../lib/useInView'
import { IconArrow, IconGitHub, IconPin, IconYouTube } from '../components/Icons'
import './footer.css'

const COLUMNS = [
  {
    title: 'The app',
    links: [
      ['How it works', '#how'],
      ['The model', '#picks'],
      ['Your words', '#words'],
      ['Companions', '#faces'],
      ['Pricing', '#pricing']
    ]
  },
  {
    title: 'The project',
    links: [
      ['Demo video', LINKS.youtube],
      ['Source code', LINKS.github],
      ['Evaluation', LINKS.evaluation],
      ['Behind the video', LINKS.gist]
    ]
  },
  {
    title: 'Shipaton 2026',
    links: [
      ['Devpost gallery', LINKS.devpost],
      ['RevenueCat', LINKS.revenuecat],
      ['Team M1KU', '#team']
    ]
  }
] as const

const external = (href: string) => (href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})

/**
 * The page lifts off the footer like a drawer opening; the lamp in the
 * etching lights once the drawer is mostly open.
 */
export function Footer() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const foot = ref.current
    if (!foot) return
    if (prefersReducedMotion()) {
      foot.style.setProperty('--reveal', '1')
      foot.classList.add('lit')
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const main = document.querySelector('main')
      const h = foot.offsetHeight || 1
      const bottom = main ? main.getBoundingClientRect().bottom : window.innerHeight
      const reveal = Math.min(1, Math.max(0, (window.innerHeight - bottom) / h))
      foot.style.setProperty('--reveal', reveal.toFixed(3))
      foot.classList.toggle('lit', reveal > 0.62)
      // The nav steps aside while the drawer is open.
      document.documentElement.toggleAttribute('data-drawer-open', reveal > 0.35)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <footer className="foot" id="footer" ref={ref}>
      <div className="foot-body">
        <div className="wrap foot-grid">
          <div className="foot-brand">
            <a href="#top" className="foot-logo" aria-label="Turn, back to top">
              <img src="/img/turn-icon.webp" alt="" width={44} height={44} />
              <span>Turn</span>
            </a>
            <p className="foot-tag">Your own words, in time for your turn.</p>
            <ul className="foot-contact">
              <li>
                <IconGitHub />
                <a href={LINKS.github} target="_blank" rel="noreferrer">
                  github.com/M1KUAPP/Turn
                </a>
              </li>
              <li>
                <IconYouTube />
                <a href={LINKS.youtube} target="_blank" rel="noreferrer">
                  youtu.be/OIAwcZPi3oc
                </a>
              </li>
              <li>
                <IconPin />
                <span>Made in Malaysia by Team M1KU</span>
              </li>
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <nav className="foot-col" key={col.title} aria-label={col.title}>
              <h3 className="foot-head">{col.title}</h3>
              <ul>
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} {...external(href)}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="foot-try">
            <h3 className="foot-head">Try Turn</h3>
            <p className="foot-try-text">The Simulator build runs on any Mac with Xcode. No account, no sign-up.</p>
            <a className="foot-field" href={LINKS.release} target="_blank" rel="noreferrer">
              <span>Get the Simulator build</span>
              <span className="foot-field-go">
                <IconArrow />
              </span>
            </a>
          </div>
        </div>

        <div className="wrap foot-legal">
          <p>© 2026 Team M1KU. Built for RevenueCat Shipaton 2026.</p>
          <nav aria-label="Legal">
            <a href={LINKS.privacy} target="_blank" rel="noreferrer">
              Privacy notice
            </a>
            <span aria-hidden="true">|</span>
            <a href={LINKS.license} target="_blank" rel="noreferrer">
              MIT License
            </a>
            <span aria-hidden="true">|</span>
            <span>Not an emergency service</span>
          </nav>
        </div>
      </div>

      <div className="foot-art" aria-hidden="true">
        <img
          src="/img/footer/lamp-night.webp"
          srcSet="/img/footer/lamp-night-1100.webp 1100w, /img/footer/lamp-night.webp 1926w"
          sizes="max(100vw, 760px)"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <span className="foot-glow" />
        <span className="foot-core" />
      </div>
    </footer>
  )
}

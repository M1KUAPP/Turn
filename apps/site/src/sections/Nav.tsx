import { useEffect, useState } from 'react'
import { LINKS } from '../lib/links'
import { IconGitHub, IconPlay } from '../components/Icons'
import './nav.css'

const ITEMS = [
  ['How it works', '#how'],
  ['The model', '#picks'],
  ['Companions', '#faces'],
  ['Pricing', '#pricing']
] as const

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav frost${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <a href="#top" className="nav-brand" aria-label="Turn, back to top">
          <img src="/img/turn-icon.webp" alt="" width={36} height={36} />
          <span>Turn</span>
        </a>
        <nav className="nav-links" aria-label="Sections">
          {ITEMS.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <a className="btn small ink" href="#made">
            <IconPlay /> <span className="nav-demo-long">Watch the demo</span>
            <span className="nav-demo-short">Demo</span>
          </a>
          <a className="nav-icon" href={LINKS.github} target="_blank" rel="noreferrer" aria-label="Turn on GitHub">
            <IconGitHub />
          </a>
        </div>
      </div>
    </header>
  )
}

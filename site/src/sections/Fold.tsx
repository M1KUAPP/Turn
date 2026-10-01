import { useEffect, useRef, type ReactNode } from 'react'
import { prefersReducedMotion } from '../lib/useInView'
import './fold.css'

const HELD = [
  { text: 'It went well', cls: 'cat-care' },
  { text: 'It was hard', cls: 'cat-care' },
  { text: "It's getting worse", cls: 'cat-pain' },
  { text: "I'm good, thanks", cls: 'cat-chat' }
]

/**
 * "When nothing fits" pins to the screen, and everything after it folds up
 * over it as a new sheet, the way the page itself lifts off the footer.
 */
export function Fold({ children }: { children: ReactNode }) {
  const pinRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const pin = pinRef.current
    const layer = layerRef.current
    if (!pin || !layer || prefersReducedMotion()) return
    let raf = 0
    const update = () => {
      raf = 0
      const h = window.innerHeight
      const cover = Math.min(1, Math.max(0, (h - layer.getBoundingClientRect().top) / h))
      pin.style.setProperty('--cover', cover.toFixed(3))
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

  return (
    <div className="fold">
      <div className="fold-pin" ref={pinRef}>
        <div className="wrap fold-pin-inner">
          <p className="caps accent">When nothing fits</p>
          <h2 className="fold-title">
            <span className="h1 fold-serif">The row holds.</span>
            <span className="voice fold-voice">Turn changes nothing rather than guess.</span>
          </h2>
          <div className="fold-demo" aria-hidden="true">
            <p className="fold-said">
              <span className="caps">They said</span>
              <span className="serif">Lovely weather today.</span>
            </p>
            <div className="fold-row">
              {HELD.map((r) => (
                <span key={r.text} className={`card ${r.cls}`}>
                  {r.text}
                </span>
              ))}
            </div>
            <span className="chip soft fold-held">Small talk that needs no reply changes nothing</span>
          </div>
          <p className="lede fold-lede">Type a reply instead, and Turn speaks it and saves it for next time.</p>
        </div>
      </div>
      <div className="fold-layer" ref={layerRef}>
        {children}
      </div>
    </div>
  )
}

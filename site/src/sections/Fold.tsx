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
 * Pins `pin` to the screen, and folds `children` up over it as a new sheet,
 * the way the page itself lifts off the footer. A pin taller than the window
 * sticks by its bottom edge, so all of it is seen before the sheet arrives.
 */
export function Fold({ pin, children, variant }: { pin: ReactNode; children: ReactNode; variant?: string }) {
  const pinRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const pinEl = pinRef.current
    const layer = layerRef.current
    if (!pinEl || !layer) return
    const still = prefersReducedMotion()
    let raf = 0
    const place = () => {
      pinEl.style.top = `${Math.min(0, window.innerHeight - pinEl.offsetHeight)}px`
    }
    const update = () => {
      raf = 0
      if (still) return
      const h = window.innerHeight
      const cover = Math.min(1, Math.max(0, (h - layer.getBoundingClientRect().top) / h))
      pinEl.style.setProperty('--cover', cover.toFixed(3))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const onResize = () => {
      place()
      onScroll()
    }
    place()
    update()
    const observer = new ResizeObserver(onResize)
    observer.observe(pinEl)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className={`fold${variant ? ` fold--${variant}` : ''}`}>
      <div className="fold-pin" ref={pinRef}>
        <div className="fold-pin-body">{pin}</div>
      </div>
      <div className="fold-layer" ref={layerRef}>
        {children}
      </div>
    </div>
  )
}

/** "When nothing fits": one screen that the model's sheet covers. */
export function NothingFits() {
  return (
    <div className="fold-screen">
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
  )
}

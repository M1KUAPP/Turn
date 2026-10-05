import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/useInView'
import { IconUp } from './Icons'
import './totop.css'

/** A small frosted button, bottom right, that takes the page back to the top. */
export function ToTop() {
  const [shown, setShown] = useState(false)
  const ringRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      setShown(window.scrollY > window.innerHeight * 0.8)
      ringRef.current?.style.setProperty('--progress', (window.scrollY / max).toFixed(4))
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
    <button
      type="button"
      className={`totop frost${shown ? ' shown' : ''}`}
      aria-label="Back to top"
      tabIndex={shown ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })}
    >
      <svg className="totop-ring" viewBox="0 0 48 48" aria-hidden="true">
        <circle ref={ringRef} cx="24" cy="24" r="22.5" pathLength="1" />
      </svg>
      <IconUp className="totop-icon" />
    </button>
  )
}

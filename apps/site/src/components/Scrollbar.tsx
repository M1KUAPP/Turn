import { useEffect, useRef, useState } from 'react'
import './scrollbar.css'

const MIN_THUMB = 40
const IDLE_MS = 1100

/**
 * A thin page scrollbar that sits on the right edge in the table's own warm
 * gray, shows while the page moves or under the pointer, and can be dragged.
 * Wheel, keys and touch still scroll the page natively.
 */
export function Scrollbar() {
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const [enabled] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches)

  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    root.classList.add('has-scrollbar')
    const track = trackRef.current!
    const thumb = thumbRef.current!
    let raf = 0
    let idle = 0
    let thumbH = 0
    let travel = 0

    const layout = () => {
      raf = 0
      const view = window.innerHeight
      const doc = root.scrollHeight
      const max = Math.max(1, doc - view)
      thumbH = Math.max(MIN_THUMB, Math.round((view / doc) * view))
      travel = view - thumbH
      thumb.style.height = `${thumbH}px`
      thumb.style.transform = `translateY(${Math.round((window.scrollY / max) * travel)}px)`
      track.hidden = doc <= view + 1
    }
    const wake = () => {
      track.classList.add('active')
      window.clearTimeout(idle)
      idle = window.setTimeout(() => track.classList.remove('active'), IDLE_MS)
    }
    const onScroll = () => {
      wake()
      if (!raf) raf = requestAnimationFrame(layout)
    }
    const onResize = () => {
      if (!raf) raf = requestAnimationFrame(layout)
    }

    // Drag the thumb; a press on the track jumps there.
    let dragFrom = 0
    let scrollFrom = 0
    const toScroll = (dy: number) => (dy / Math.max(1, travel)) * (root.scrollHeight - window.innerHeight)
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      e.preventDefault()
      if (e.target !== thumb) {
        const y = e.clientY - thumbH / 2
        window.scrollTo({ top: toScroll(y), behavior: 'smooth' })
        return
      }
      dragFrom = e.clientY
      scrollFrom = window.scrollY
      thumb.setPointerCapture(e.pointerId)
      track.classList.add('dragging')
    }
    const onMove = (e: PointerEvent) => {
      if (!thumb.hasPointerCapture(e.pointerId)) return
      window.scrollTo({ top: scrollFrom + toScroll(e.clientY - dragFrom), behavior: 'instant' as ScrollBehavior })
    }
    const onUp = (e: PointerEvent) => {
      if (thumb.hasPointerCapture(e.pointerId)) thumb.releasePointerCapture(e.pointerId)
      track.classList.remove('dragging')
    }

    layout()
    const observer = new ResizeObserver(onResize)
    observer.observe(document.body)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    track.addEventListener('pointerdown', onDown)
    thumb.addEventListener('pointermove', onMove)
    thumb.addEventListener('pointerup', onUp)
    thumb.addEventListener('pointercancel', onUp)
    return () => {
      root.classList.remove('has-scrollbar')
      cancelAnimationFrame(raf)
      window.clearTimeout(idle)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      track.removeEventListener('pointerdown', onDown)
      thumb.removeEventListener('pointermove', onMove)
      thumb.removeEventListener('pointerup', onUp)
      thumb.removeEventListener('pointercancel', onUp)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div className="sbar" ref={trackRef} aria-hidden="true">
      <div className="sbar-thumb" ref={thumbRef} />
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'

/** True once the element has scrolled into view (or always, with `repeat`, while it is). */
export function useInView<T extends Element>(
  options: { threshold?: number; rootMargin?: string; repeat?: boolean } = {}
) {
  const { threshold = 0.2, rootMargin = '0px 0px -10% 0px', repeat = false } = options
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (!repeat) io.disconnect()
        } else if (repeat) setInView(false)
      },
      { threshold, rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, rootMargin, repeat])
  return [ref, inView] as const
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

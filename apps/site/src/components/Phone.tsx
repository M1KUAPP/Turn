import type { CSSProperties, ReactNode } from 'react'

type Props = {
  /** A capture in /img/screens, e.g. "partner-view". Omit to pass a custom screen as children. */
  screen?: string
  alt?: string
  /** CSS width of the phone, e.g. "300px" or "clamp(220px, 24vw, 320px)". */
  width?: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/** An iPhone around a real capture (1178 x 2556), or around custom children. */
export function Phone({ screen, alt = '', width = '300px', className = '', style, children }: Props) {
  return (
    <div className={`phone ${className}`} style={{ ...style, ['--w' as string]: width }}>
      {screen ? (
        <img src={`/img/screens/${screen}.webp`} alt={alt} loading="lazy" decoding="async" width={1178} height={2556} />
      ) : (
        <div className="phone-screen">{children}</div>
      )}
    </div>
  )
}

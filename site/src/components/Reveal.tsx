import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useInView } from '../lib/useInView'

type Props = {
  children: ReactNode
  as?: ElementType
  delay?: number
  className?: string
  style?: CSSProperties
}

/** Fades and lifts its children in once, when they scroll into view. Still under Reduce Motion. */
export function Reveal({ children, as: Tag = 'div', delay = 0, className = '', style }: Props) {
  const [ref, inView] = useInView<HTMLElement>()
  return (
    <Tag
      ref={ref}
      className={`reveal${inView ? ' in' : ''}${className ? ` ${className}` : ''}`}
      style={{ ...style, ['--delay' as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}

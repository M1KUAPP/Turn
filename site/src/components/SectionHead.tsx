import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type Props = {
  eyebrow?: string
  /** The partner's line, in the serif. */
  serif: ReactNode
  /** The person's answer, in rounded ultramarine. */
  voice?: ReactNode
  lede?: ReactNode
  id?: string
  align?: 'left' | 'center'
  size?: 'h1' | 'h2'
}

/**
 * Every section opens like the app's conversation: their line in the serif,
 * your answer in rounded bold ultramarine.
 */
export function SectionHead({ eyebrow, serif, voice, lede, id, align = 'left', size = 'h2' }: Props) {
  return (
    <header className={`shead shead--${align}`}>
      {eyebrow && (
        <Reveal as="p" className="caps accent shead-eyebrow">
          {eyebrow}
        </Reveal>
      )}
      <Reveal as="h2" className={`${size} shead-title`} delay={60}>
        <span id={id} className="shead-serif">
          {serif}
        </span>
        {voice && <span className="voice shead-voice">{voice}</span>}
      </Reveal>
      {lede && (
        <Reveal as="p" className="lede shead-lede" delay={140}>
          {lede}
        </Reveal>
      )}
    </header>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { LINKS } from '../lib/links'
import { prefersReducedMotion, useInView } from '../lib/useInView'
import { say } from '../lib/speech'
import {
  IconCheck,
  IconChevronDown,
  IconGear,
  IconGitHub,
  IconKeyboard,
  IconPin,
  IconPlay,
  IconQuestion,
  IconRepeat,
  IconSpeaker,
  IconUp,
  IconX
} from '../components/Icons'
import './hero.css'

type Reply = { text: string; cls: string }
type Turn = { line: string; replies: Reply[]; pick: number }

// Three partner lines and the replies Turn offers from the person's own bank.
const TURNS: Turn[] = [
  {
    line: 'How was physio?',
    replies: [
      { text: 'It went well', cls: 'cat-care' },
      { text: 'It was hard', cls: 'cat-care' },
      { text: "It's getting worse", cls: 'cat-pain' },
      { text: "I'm good, thanks", cls: 'cat-chat' },
      { text: 'My back hurts', cls: 'cat-pain' },
      { text: "I'm tired", cls: 'cat-feel' }
    ],
    pick: 1
  },
  {
    line: 'Are you in any pain?',
    replies: [
      { text: 'Yes', cls: 'yes' },
      { text: 'No', cls: 'no' },
      { text: 'Not sure', cls: 'unsure' },
      { text: 'A little, in my back', cls: 'cat-pain' },
      { text: "It's a sharp pain", cls: 'cat-pain' },
      { text: "I'm good, thanks", cls: 'cat-chat' }
    ],
    pick: 3
  },
  {
    line: 'Do you want to go outside after?',
    replies: [
      { text: "Let's go outside", cls: 'cat-out' },
      { text: 'Maybe later', cls: 'cat-quick' },
      { text: "I'm tired", cls: 'cat-feel' },
      { text: 'Yes, please', cls: 'cat-quick' },
      { text: 'Not today', cls: 'cat-quick' },
      { text: 'Can we go to the park?', cls: 'cat-out' }
    ],
    pick: 0
  }
]

const STRIP = ["Wait, I'm typing", 'Sorry, say that again', 'And you?']

type Phase = 'off' | 'hearing' | 'replies'
type Mouth = 'rest' | 'half' | 'open' | 'blink'

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function useCompanion(speaking: boolean, still: boolean) {
  const [mouth, setMouth] = useState<Mouth>('rest')
  useEffect(() => {
    if (speaking) {
      const cycle: Mouth[] = ['half', 'open', 'half', 'rest']
      let i = 0
      const id = window.setInterval(() => setMouth(cycle[i++ % cycle.length]), 95)
      return () => {
        window.clearInterval(id)
        setMouth('rest')
      }
    }
    if (still) return
    let id = 0
    const blink = () => {
      setMouth('blink')
      window.setTimeout(() => setMouth('rest'), 130)
      id = window.setTimeout(blink, 3200 + Math.random() * 2400)
    }
    id = window.setTimeout(blink, 2200)
    return () => window.clearTimeout(id)
  }, [speaking, still])
  return mouth
}

const FRAMES: Mouth[] = ['rest', 'half', 'open', 'blink']

function LiveDemo() {
  const [stageRef, inView] = useInView<HTMLDivElement>({ threshold: 0.35 })
  const [turn, setTurn] = useState(0)
  const [words, setWords] = useState(0)
  const [phase, setPhase] = useState<Phase>('off')
  const [tap, setTap] = useState<number | null>(null)
  const [speaking, setSpeaking] = useState<number | null>(null)
  const [spoken, setSpoken] = useState<string | null>(null)
  const [ended, setEnded] = useState(false)
  const token = useRef(0)
  const still = useRef(false)

  const current = TURNS[turn]
  const lineWords = current.line.split(' ')
  const listening = phase !== 'off'
  const mouth = useCompanion(speaking !== null, still.current)

  const run = useCallback(async () => {
    const my = ++token.current
    const alive = () => token.current === my
    setEnded(false)
    for (let t = 0; t < TURNS.length; t++) {
      const line = TURNS[t].line.split(' ')
      setTurn(t)
      setWords(0)
      setTap(null)
      setSpeaking(null)
      setPhase('hearing')
      await wait(t === 0 ? 700 : 450)
      for (let i = 1; i <= line.length; i++) {
        if (!alive()) return
        setWords(i)
        await wait(250)
      }
      await wait(500)
      if (!alive()) return
      setPhase('replies')
      await wait(1500)
      if (!alive()) return
      const pick = TURNS[t].pick
      setTap(pick)
      await wait(360)
      if (!alive()) return
      setTap(null)
      setSpeaking(pick)
      setSpoken(TURNS[t].replies[pick].text)
      await wait(Math.max(1400, TURNS[t].replies[pick].text.length * 85))
      if (!alive()) return
      setSpeaking(null)
      await wait(t < TURNS.length - 1 ? 1100 : 300)
      if (!alive()) return
    }
    setEnded(true)
  }, [])

  // Show a finished first turn under Reduce Motion; otherwise play once on view.
  useEffect(() => {
    if (!inView) return
    if (prefersReducedMotion()) {
      still.current = true
      setTurn(0)
      setWords(TURNS[0].line.split(' ').length)
      setPhase('replies')
      setSpoken(TURNS[0].replies[TURNS[0].pick].text)
      setEnded(true)
      return
    }
    void run()
    return () => {
      token.current++
    }
  }, [inView, run])

  // A tap takes over from the script, and speaks.
  const speak = async (index: number, text: string) => {
    token.current++
    setEnded(true)
    setTap(null)
    setSpeaking(index)
    setSpoken(text)
    await say(text)
    setSpeaking((s) => (s === index ? null : s))
  }

  const repliesShown = phase === 'replies'

  return (
    <div className="hero-stage" ref={stageRef}>
      <div className="hero-lamp" data-on={listening || undefined} aria-hidden="true" />

      <div className="hero-device">
        <div className={`hero-listening chip listen${listening ? ' on' : ''}`} aria-hidden="true">
          <span className="light" /> Listening
        </div>

        <div className="phone hero-phone">
          <div className="phone-screen app" role="group" aria-label="A live demo of Turn's Listen mode">
            <div className="app-status" aria-hidden="true">
              <span>9:41</span>
              <span className="app-status-icons">
                <i className="sig" />
                <i className="wifi" />
                <i className="batt" />
              </span>
            </div>

            <div className="app-top" aria-hidden="true">
              <span className="app-round">
                <IconGear />
              </span>
              <span className="app-place">
                <IconPin /> Clinic <IconChevronDown />
              </span>
              <span className={`app-listen${listening ? ' on' : ''}`}>
                {listening ? (
                  <>
                    <span className="light" /> Listening
                  </>
                ) : (
                  'Listen'
                )}
              </span>
            </div>

            <div className={`app-caption${phase === 'hearing' ? ' live' : ''}`} aria-live="polite">
              <div className="app-caption-head">
                <span className={`app-caption-label${phase === 'hearing' ? ' live' : ''}`}>
                  {phase === 'hearing' ? (
                    <>
                      <span className="app-dot" /> They're saying
                      <span className="app-meter" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                      </span>
                    </>
                  ) : phase === 'replies' ? (
                    'They said'
                  ) : (
                    'Listen mode is off'
                  )}
                </span>
                {phase === 'replies' && (
                  <span className="app-pill">
                    <IconX /> Clear
                  </span>
                )}
              </div>
              <p className="app-line">
                {phase === 'off'
                  ? ' '
                  : lineWords.map((w, i) => (
                      <span
                        key={`${turn}-${i}`}
                        className={`app-word${i < words ? ' in' : ''}${i === words - 1 && phase === 'hearing' ? ' new' : ''}`}
                      >
                        {w}{' '}
                      </span>
                    ))}
              </p>
            </div>

            <div className="app-strip">
              {STRIP.map((s) => (
                <button key={s} className="app-chip" onClick={() => speak(-1, s)} tabIndex={-1}>
                  {s}
                </button>
              ))}
              <button
                className="app-chip wide"
                onClick={() => speak(-1, 'I use this app to talk. Please give me time.')}
                tabIndex={-1}
              >
                I use this app to talk. Please give me time.
              </button>
              <button className="app-chip warn" onClick={() => speak(-1, "Something's wrong")} tabIndex={-1}>
                Something's wrong
              </button>
            </div>

            <div className="app-row" key={`row-${turn}-${repliesShown}`}>
              {repliesShown ? (
                current.replies.map((r, i) => (
                  <button
                    key={r.text}
                    className={`card app-slot ${r.cls}${speaking === i ? ' speaking' : ''}${tap === i ? ' tapped' : ''}`}
                    style={{ ['--i' as string]: i }}
                    onClick={() => speak(i, r.text)}
                    aria-label={`Say: ${r.text}`}
                  >
                    {r.cls === 'yes' && (
                      <span className="app-disc yes">
                        <IconCheck />
                      </span>
                    )}
                    {r.cls === 'no' && (
                      <span className="app-disc no">
                        <IconX />
                      </span>
                    )}
                    {r.cls === 'unsure' && (
                      <span className="app-disc unsure">
                        <IconQuestion />
                      </span>
                    )}
                    <span className="app-slot-text">{r.text}</span>
                    {speaking === i && <IconSpeaker className="app-spk" />}
                  </button>
                ))
              ) : (
                <p className="app-empty">Replies to your partner appear here.</p>
              )}
            </div>

            <div className="app-tabs" aria-hidden="true">
              <span className="sel">
                <i /> Quick
              </span>
              <span>
                <i className="chat" /> Chat
              </span>
              <span>
                <i className="care" /> Care and help
              </span>
              <span className="all">All</span>
            </div>

            <div className="app-yesno">
              <button className="card yes app-big" onClick={() => speak(-1, 'Yes')} tabIndex={-1}>
                <span className="app-disc yes">
                  <IconCheck />
                </span>
                Yes
              </button>
              <button className="card no app-big" onClick={() => speak(-1, 'No')} tabIndex={-1}>
                <span className="app-disc no">
                  <IconX />
                </span>
                No
              </button>
            </div>

            <div className="app-bar frost" aria-hidden="true">
              <span className="app-face">
                <img src="/img/faces/ren-face-rest.webp" alt="" />
              </span>
              <span className="app-tool type">
                <IconKeyboard />
                Type
              </span>
              <span className="app-tool">
                <IconRepeat />
                Repeat
              </span>
              <span className="app-tool">
                <IconUp />
                Up
              </span>
              <span className="app-tool">
                <IconUp style={{ transform: 'rotate(180deg)' }} />
                Down
              </span>
            </div>
          </div>
        </div>

        <div className={`hero-companion${speaking !== null ? ' talking' : ''}`} aria-hidden="true">
          <div className="hero-face">
            {FRAMES.map((f) => (
              <img key={f} src={`/img/faces/ren-portrait-${f}.webp`} alt="" className={mouth === f ? 'on' : ''} />
            ))}
          </div>
          <div className={`card speaking hero-said${spoken ? ' in' : ''}`} key={spoken ?? 'none'}>
            {spoken ?? 'It was hard'}
            <IconSpeaker />
          </div>
        </div>
      </div>

      <div className="hero-hint">
        {ended ? (
          <>
            <span>Tap a reply to hear it.</span>
            <button className="btn small" onClick={() => void run()}>
              <IconRepeat /> Replay
            </button>
          </>
        ) : (
          <span>{repliesShown ? 'Tap a reply to hear it.' : 'Listening to their side of the conversation…'}</span>
        )}
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="hero" id="top" data-section="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="hero-kicker">
            <span className="chip soft">
              <img src="/img/logos/revenuecat.svg" alt="" /> RevenueCat Shipaton 2026
            </span>
            <span className="caps">Open source, MIT</span>
          </p>
          <h1 className="hero-title">
            <span className="h-display hero-serif">Your own words,</span>
            <span className="voice hero-voice">in time for your turn.</span>
          </h1>
          <p className="lede hero-lede">
            An iPhone app for people who can't rely on their speech. As your partner talks, Turn listens and offers
            replies <strong>from your own saved phrases</strong>. The AI only picks; it never writes a word. One tap,
            and Turn says it out loud.
          </p>
          <div className="hero-ctas">
            <a className="btn accent" href="#made">
              <IconPlay /> Watch the 1:38 demo
            </a>
            <a className="btn" href={LINKS.github} target="_blank" rel="noreferrer">
              <IconGitHub /> View on GitHub
            </a>
          </div>
          <ul className="hero-facts">
            <li>
              <IconCheck /> Speaking is free
            </li>
            <li>
              <IconCheck /> Listen mode is one payment
            </li>
            <li>
              <IconCheck /> No subscription
            </li>
          </ul>
        </div>
        <LiveDemo />
      </div>
    </section>
  )
}

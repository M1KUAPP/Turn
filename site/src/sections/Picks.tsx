import type { CSSProperties } from 'react'
import { SectionHead } from '../components/SectionHead'
import { LINKS } from '../lib/links'
import { useInView } from '../lib/useInView'
import './picks.css'

type Category = 'quick' | 'chat' | 'care' | 'pain' | 'food' | 'feel' | 'family' | 'health' | 'out'

type Phrase = {
  text: string
  category: Category
}

const STARTER_PHRASES: Phrase[] = [
  { text: 'It was hard', category: 'feel' },
  { text: "I'm thirsty", category: 'food' },
  { text: 'Can we take a break?', category: 'care' },
  { text: "Where's my phone?", category: 'quick' },
  { text: 'I love you', category: 'family' },
  { text: 'Not now', category: 'quick' },
  { text: 'Thank you', category: 'chat' },
  { text: 'It hurts here', category: 'pain' },
  { text: 'Call my daughter', category: 'family' },
  { text: "I'm cold", category: 'feel' },
  { text: 'It went well', category: 'health' },
  { text: "It's getting worse", category: 'pain' },
  { text: "I'm good, thanks", category: 'chat' },
  { text: 'Not bad, actually', category: 'chat' },
  { text: 'Ask me later', category: 'quick' },
  { text: 'Can you help me?', category: 'care' },
  { text: "I'm ready", category: 'quick' },
  { text: 'I need the bathroom', category: 'care' },
  { text: 'Please speak slowly', category: 'chat' },
  { text: 'I need a moment', category: 'feel' },
  { text: 'That sounds good', category: 'chat' },
  { text: "I'm tired", category: 'feel' },
  { text: 'I need some water', category: 'food' },
  { text: 'My shoulder hurts', category: 'pain' },
  { text: 'Call my son', category: 'family' },
  { text: "I'd like to go home", category: 'out' },
  { text: 'What time is it?', category: 'quick' },
  { text: "I don't understand", category: 'chat' },
  { text: "I'm feeling better", category: 'health' },
  { text: 'Please sit with me', category: 'family' },
  { text: "It's too loud", category: 'feel' },
  { text: "I'm hungry", category: 'food' },
  { text: 'I need my glasses', category: 'care' },
  { text: "Let's go outside", category: 'out' },
  { text: 'Can you repeat that?', category: 'chat' },
  { text: 'The pain is sharp', category: 'pain' },
  { text: 'Maybe tomorrow', category: 'quick' },
  { text: 'I miss you', category: 'family' },
  { text: "That's enough for now", category: 'feel' },
  { text: 'Thank you for waiting', category: 'chat' }
]

const SHORTLIST = [
  { text: 'It went well', category: 'health' },
  { text: 'It was hard', category: 'feel' },
  { text: "It's getting worse", category: 'pain' },
  { text: "I'm good, thanks", category: 'chat' },
  { text: 'Not bad, actually', category: 'chat' },
  { text: 'Ask me later', category: 'quick' }
] as const

const EVALUATION = [
  { name: "Turn's hosted decision model", percent: 75, result: '48 of 64', featured: true },
  { name: 'Embeddings', percent: 45, result: '29 of 64', featured: false },
  { name: 'Keyword ranking', percent: 23, result: '15 of 64', featured: false }
] as const

const DESKTOP_CONNECTORS = [
  'M 452 64 C 498 96 516 184 600 288',
  'M 452 120 C 500 142 524 210 600 288',
  'M 452 176 C 506 194 530 238 600 288',
  'M 452 232 C 510 246 542 270 600 288',
  'M 452 344 C 508 326 542 306 600 288',
  'M 452 400 C 506 366 532 326 600 288',
  'M 452 456 C 500 398 524 344 600 288'
]

export function Picks() {
  const [funnelRef, funnelInView] = useInView<HTMLDivElement>({ threshold: 0.12 })
  const [evaluationRef, evaluationInView] = useInView<HTMLDivElement>({ threshold: 0.18 })

  return (
    <section className="section picks" id="picks" data-section="picks">
      <div className="wrap">
        <SectionHead
          eyebrow="The model"
          serif="It picks from your words, or passes."
          voice="It never writes one."
          lede="A hosted decision model sees your partner's line and 40 of your saved phrases. It can only choose among them, or choose none. Every reply Turn offers is something you saved or typed."
        />

        <div
          ref={funnelRef}
          className={`picks-funnel panel${funnelInView ? ' is-in-view' : ''}`}
          role="group"
          aria-label="Forty saved phrases go in. The model picks replies from them or passes."
        >
          <svg className="picks-funnel-lines" viewBox="0 0 1200 560" preserveAspectRatio="none" aria-hidden="true">
            {DESKTOP_CONNECTORS.map((path) => (
              <path key={path} d={path} pathLength="1" />
            ))}
          </svg>

          <div className="picks-source">
            <div className="picks-count picks-count--in">
              <span className="num picks-count-number">40</span>
              <span className="picks-count-label">your phrases in</span>
            </div>
            <ul className="picks-source-grid" aria-label="Examples from your saved phrases">
              {STARTER_PHRASES.map((phrase, index) => (
                <li
                  className="picks-source-item"
                  key={phrase.text}
                  style={{ '--picks-delay': `${index * 20}ms` } as CSSProperties}
                >
                  <span className={`card cat-${phrase.category} picks-source-card`}>{phrase.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <svg className="picks-mobile-arrow picks-mobile-arrow--first" viewBox="0 0 24 44" aria-hidden="true">
            <path d="M12 2v34m-7-7 7 7 7-7" />
          </svg>

          <div className="picks-model panel ink">
            <p className="caps picks-model-label">Picks or passes</p>
            <p className="picks-heard-label">Their line</p>
            <h3 className="serif picks-partner-line">How was physio?</h3>
            <div className="picks-model-rule" aria-hidden="true" />
            <p className="picks-model-note">Only a saved phrase can answer.</p>
          </div>

          <svg className="picks-mobile-arrow picks-mobile-arrow--second" viewBox="0 0 24 44" aria-hidden="true">
            <path d="M12 2v34m-7-7 7 7 7-7" />
          </svg>

          <div className="picks-output">
            <ul className="picks-output-grid" aria-label="Six phrases the model can offer">
              {SHORTLIST.map((phrase, index) => (
                <li
                  className="picks-output-item"
                  key={phrase.text}
                  style={{ '--picks-delay': `${1540 + index * 45}ms` } as CSSProperties}
                >
                  <span className={`card cat-${phrase.category} picks-output-card`}>{phrase.text}</span>
                </li>
              ))}
            </ul>
            <div className="picks-count picks-count--out">
              <span className="num picks-zero">0</span>
              <span className="picks-count-label">words written</span>
            </div>
          </div>
        </div>

        <div ref={evaluationRef} className={`picks-evaluation panel${evaluationInView ? ' is-in-view' : ''}`}>
          <p className="caps accent picks-evaluation-eyebrow">Evaluation, 64 partner lines</p>
          <h3 className="serif picks-evaluation-title">The right reply made the top six three times out of four.</h3>

          <ol className="picks-evaluation-rows" aria-label="Top six accuracy comparison">
            {EVALUATION.map((item, index) => (
              <li
                className={`picks-evaluation-row${item.featured ? ' picks-evaluation-row--featured' : ''}`}
                key={item.name}
              >
                <span className="picks-evaluation-name">{item.name}</span>
                <div
                  className={`picks-evaluation-plot${index === 0 ? ' picks-evaluation-plot--first' : ''}`}
                  aria-hidden="true"
                >
                  <div className="picks-evaluation-rail">
                    <span
                      className="picks-evaluation-bar"
                      style={{ '--picks-bar-width': `${item.percent}%` } as CSSProperties}
                    />
                  </div>
                  {index === 0 && <span className="picks-chance-label">Chance, 26%</span>}
                </div>
                <span className="picks-evaluation-score">
                  <span className="num picks-evaluation-percent">{item.percent}%</span>
                  <span className="picks-evaluation-total">{item.result}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="picks-evaluation-foot">
            <p className="body picks-evaluation-method">
              Top 6 accuracy on the 64 lines with a saved reply besides Yes, No and Not sure; 80 lines evaluated on
              September 23, 2026. Claude subagents wrote the lines, the starter bank and the labels.
            </p>
            <a className="picks-evaluation-link" href={LINKS.evaluation}>
              <span>Read the evaluation</span>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4.5 12h14m-6-6 6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>

        <div className="picks-privacy-grid">
          <article className="panel picks-privacy-panel">
            <p className="caps accent picks-privacy-eyebrow">What leaves the phone</p>
            <h3 className="serif picks-privacy-title">
              Only the line, the place, and 40 of your phrases. Names are swapped for tags first.
            </h3>
            <div className="picks-privacy-chips">
              <span className="chip">No audio recorded</span>
              <span className="chip">Your phrase bank stays put</span>
              <span className="chip">Pause any time</span>
            </div>
          </article>

          <article className="panel sunken picks-privacy-panel picks-privacy-panel--quiet">
            <p className="caps picks-privacy-eyebrow">When it's not sure</p>
            <h3 className="serif picks-privacy-title">
              No phrase clears the bar? The row holds. Offline or slow? Your phone ranks phrases itself, and says so.
            </h3>
          </article>
        </div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import './made.css'
import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import { LINKS } from '../lib/links'

const agents = [
  {
    role: 'Director',
    items: [
      { image: 'vid-script', label: 'Script' },
      { image: 'vid-voice', label: 'Voices' },
      { image: 'vid-filmstrip', label: 'Cut in Remotion' }
    ]
  },
  {
    role: 'Camera',
    items: [
      { image: 'vid-cloudmac', label: 'iOS Simulator on cloud Macs' },
      { image: 'vid-camera', label: 'Every take filmed' },
      { image: 'vid-clapper', label: 'Real app, real taps' }
    ]
  }
]

const logos = [
  { file: 'claude', name: 'Claude' },
  { file: 'elevenlabs', name: 'ElevenLabs' },
  { file: 'githubactions', name: 'GitHub Actions' },
  { file: 'apple', name: 'Apple' },
  { file: 'xcode', name: 'Xcode' }
]

function AgentPanel({ role, items }: (typeof agents)[number]) {
  return (
    <article className="panel made-agent">
      <p className="caps made-agent-role">{role}</p>
      <h4 className="serif made-agent-name">Claude Code</h4>
      <ul className="made-agent-list">
        {items.map(({ image, label }) => (
          <li className="made-agent-item" key={label}>
            <img src={`/img/gen/${image}.webp`} alt="" loading="lazy" width="64" height="64" />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function VideoFacade() {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="made-video">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${LINKS.youtubeId}?autoplay=1&rel=0`}
          title="Turn demo video"
          allow="autoplay; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          className="made-video-play"
          type="button"
          onClick={() => setPlaying(true)}
          aria-label="Play Turn demo video"
        >
          <img
            className="made-video-poster"
            src={`https://i.ytimg.com/vi/${LINKS.youtubeId}/maxresdefault.jpg`}
            alt=""
            fetchPriority="high"
          />
          <span className="made-video-play-icon" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M12 8.5 24 16 12 23.5v-15Z" fill="currentColor" />
            </svg>
          </span>
        </button>
      )}
    </div>
  )
}

export function MadeWith() {
  return (
    <section className="section made" id="made" data-section="made">
      <div className="wrap">
        <SectionHead eyebrow="The demo" serif="See it work." voice="1 minute 38 seconds." />

        <div className="made-video-wrap">
          <Reveal>
            <VideoFacade />
          </Reveal>
          <a className="made-video-link" href={LINKS.youtube} target="_blank" rel="noreferrer">
            Watch on YouTube
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
              <path
                d="M5.5 14.5 14 6m0 0H7m7 0v7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <div className="made-story-grid">
          <Reveal className="made-story-copy">
            <h3 className="made-story-title">
              <span className="serif">None of us filmed it.</span>
              <span className="voice">Two Claude Code agents did.</span>
            </h3>
            <p className="body made-story-body">
              One directed: it wrote the script, voiced the partner and the narrator with ElevenLabs, and cut it all in
              Remotion. The other ran the real app in the iOS Simulator on GitHub&apos;s cloud Macs and filmed every
              take. An iPhone demo, made from a Windows laptop, without a single Apple device.
            </p>
            <a className="btn made-story-button" href={LINKS.gist} target="_blank" rel="noreferrer">
              How we made the video
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 10h12m0 0-5-5m5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </Reveal>

          <Reveal className="made-agent-diagram" delay={110}>
            <div className="made-agent-pair">
              <AgentPanel {...agents[0]} />
              <div className="made-agent-bridge" aria-hidden="true">
                <span>script</span>
                <svg viewBox="0 0 64 42" fill="none">
                  <path
                    d="M5 12h53M58 12l-5-5m5 5-5 5M59 30H6m0 0 5-5m-5 5 5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="4 4"
                  />
                </svg>
                <span>takes</span>
              </div>
              <AgentPanel {...agents[1]} />
            </div>
            <div className="made-logos" aria-label="Tools used to make the demo">
              {logos.map(({ file, name }) => (
                <img key={file} src={`/img/logos/${file}.svg`} alt={name} loading="lazy" />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

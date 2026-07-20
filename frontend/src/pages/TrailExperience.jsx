import { useMemo, useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTrailById } from '../data/trails.js'
import useVoiceGuide, { LANGUAGES } from '../hooks/useVoiceGuide.js'
import useAmbientAudio from '../hooks/useAmbientAudio.js'
import aiGuideImg from '../assets/ai-guide.png'
import siteWadaImg from '../assets/site_wada.png'
import siteFortImg from '../assets/site_fort.png'
import siteTempleImg from '../assets/site_temple.png'
import siteStepwellImg from '../assets/site_stepwell.png'
import './TrailExperience.css'

export default function TrailExperience() {
  const { trailId } = useParams()
  const trail = useMemo(() => getTrailById(trailId), [trailId])
  const [stepIndex, setStepIndex] = useState(0)
  const [language, setLanguage] = useState('en')
  const nodeRefs = useRef([])

  if (!trail) {
    return (
      <div className="trail">
        <Link to="/trails" className="trail__back">← Back to the atlas</Link>
        <p style={{ padding: '2rem' }}>Trail not found.</p>
      </div>
    )
  }

  const site = trail.sites[stepIndex]
  const isLast = stepIndex === trail.sites.length - 1
  const isFirst = stepIndex === 0

  const { isPlaying, toggleSpeech } = useVoiceGuide(site.narration, site.id, language)

  // Site type drives the Web Audio synth (temple / fort / stepwell / wada)
  const siteType = site.icon || 'wada'
  const { isMuted, toggleMute } = useAmbientAudio(siteType)

  // S-curve path: nodes sweep left→right→left across the column
  const generatePath = () => {
    const pts = []
    for (let i = 0; i <= 60; i++) {
      const t = i / 60
      const top  = 20 + t * 60          // 20% → 80% (padded away from edges)
      const left = 50 - Math.cos(t * Math.PI * 2) * 22
      pts.push(`${left},${top}`)
    }
    return pts.join(' ')
  }

  useEffect(() => {
    nodeRefs.current[stepIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [stepIndex])

  let activeSiteImg = siteWadaImg
  if (site.name?.includes('Wada') || site.id === 'wada') activeSiteImg = siteWadaImg
  else if (site.icon === 'fort')      activeSiteImg = siteFortImg
  else if (site.icon === 'temple')    activeSiteImg = siteTempleImg
  else if (site.icon === 'stepwell')  activeSiteImg = siteStepwellImg

  return (
    <div className="trail">
      {/* Full-screen background photo */}
      <div className="trail__bg" style={{ backgroundImage: `url(${activeSiteImg})` }} />
      <div className="trail__bg-overlay" />

      {/* ── Compact top bar ── */}
      <header className="trail__header">
        <div className="trail__header-left">
          <Link to="/trails" className="trail__back">← Back to atlas</Link>
          <h1 className="trail__title">{trail.name}</h1>
        </div>
        <div className="trail__header-right">
          <button
            className={`trail__ctrl-btn ${!isMuted ? 'trail__ctrl-btn--on' : ''}`}
            onClick={toggleMute}
          >
            {isMuted ? '🔇' : '🔊'} Ambient
          </button>
          <div className="trail__lang">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                className={`trail__lang-btn ${language === l.code ? 'trail__lang-btn--active' : ''}`}
                onClick={() => setLanguage(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── S-curve trail map ── */}
      <div className="trail__layout">
        <div className="trail__path-column">
          <div className="trail__path-container">
            <svg className="trail__svg-line" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                points={generatePath()}
                fill="none"
                stroke="rgba(214,159,76,0.75)"
                strokeWidth="0.6"
                strokeDasharray="2 2.5"
                strokeLinecap="round"
              />
            </svg>

            {trail.sites.map((s, i) => {
              const isActive = i === stepIndex
              const isPast   = i < stepIndex
              const t = trail.sites.length > 1 ? i / (trail.sites.length - 1) : 0.5
              const top  = 20 + t * 60
              const left = 50 - Math.cos(t * Math.PI * 2) * 22

              // Nodes on LEFT side → card pops RIGHT; nodes on RIGHT → card pops LEFT
              const alignClass = left < 50 ? 'align-right' : 'align-left'

              return (
                <div
                  key={s.id}
                  ref={(el) => (nodeRefs.current[i] = el)}
                  className={`trail__node ${isActive ? 'trail__node--active' : ''} ${isPast ? 'trail__node--past' : ''}`}
                  style={{ top: `${top}%`, left: `${left}%` }}
                >
                  <button
                    className="trail__node-marker"
                    onClick={() => setStepIndex(i)}
                    aria-label={`Go to ${s.name}`}
                  >
                    <div className="trail__node-marker-inner" />
                  </button>

                  {isActive && (
                    <div className={`trail__node-content ${alignClass}`}>
                      <img src={activeSiteImg} alt={s.name} className="trail__node-hero" />
                      <div className="trail__node-text">
                        <span className="trail__stop-label">Stop {i + 1} of {trail.sites.length}</span>
                        <h2 className="trail__stop-name">{s.name}</h2>
                        <p className="trail__stop-meta">{s.type} · built {s.built}</p>
                        <p className="trail__stop-desc">{s.narration[language] || s.narration.en}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Nav buttons: floating on screen, no footer bar ── */}
      <div className="trail__nav">
        <button
          className="trail__nav-btn"
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          disabled={isFirst}
        >
          ← Prev
        </button>
        {isLast ? (
          <Link to="/trails" className="trail__nav-btn trail__nav-btn--primary">Finish Trail</Link>
        ) : (
          <button
            className="trail__nav-btn trail__nav-btn--primary"
            onClick={() => setStepIndex((i) => Math.min(trail.sites.length - 1, i + 1))}
          >
            Next Stop →
          </button>
        )}
      </div>

      {/* ── AI Guide — prominent floating character ── */}
      <div className={`trail__guide ${isPlaying ? 'trail__guide--speaking' : ''}`} onClick={toggleSpeech}>
        <div className="trail__guide-bubble">
          {isPlaying
            ? site.narration[language]?.slice(0, 80) + '…'
            : 'Tap me to hear the story of ' + site.name}
        </div>
        <div className="trail__guide-avatar">
          <img src={aiGuideImg} alt="Heritage Guide" />
          <div className="trail__guide-ring trail__guide-ring-1" />
          <div className="trail__guide-ring trail__guide-ring-2" />
        </div>
      </div>
    </div>
  )
}

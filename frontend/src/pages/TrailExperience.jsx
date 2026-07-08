import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTrailById } from '../data/trails.js'
import SiteIcon from '../components/trails/SiteIcon.jsx'
import VoiceGuide from '../components/trails/VoiceGuide.jsx'
import './TrailExperience.css'

export default function TrailExperience() {
  const { trailId } = useParams()
  const trail = useMemo(() => getTrailById(trailId), [trailId])
  const [stepIndex, setStepIndex] = useState(0)
  const [language, setLanguage] = useState('en')

  if (!trail) {
    return (
      <div className="trail">
        <div className="trail__header">
          <Link to="/" className="trail__back">
            ← Back to the atlas
          </Link>
        </div>
        <p style={{ padding: '2.4rem' }}>That trail couldn't be found.</p>
      </div>
    )
  }

  const site = trail.sites[stepIndex]
  const isLast = stepIndex === trail.sites.length - 1
  const isFirst = stepIndex === 0

  return (
    <div className="trail">
      <header className="trail__header">
        <Link to="/" className="trail__back">
          ← Back to the atlas
        </Link>
        <div className="trail__heading">
          <span className="eyebrow">{trail.theme} · {trail.region}</span>
          <h1>{trail.name}</h1>
        </div>
        <span className="eyebrow">
          Stop {stepIndex + 1} of {trail.sites.length}
        </span>
      </header>

      <div className="trail__progress">
        {trail.sites.map((s, i) => (
          <button
            key={s.id}
            className={`trail__dot ${i < stepIndex ? 'trail__dot--done' : ''} ${
              i === stepIndex ? 'trail__dot--active' : ''
            }`}
            onClick={() => setStepIndex(i)}
            aria-label={`Go to ${s.name}`}
          />
        ))}
      </div>

      <div className="trail__stage">
        <div className="trail__medallion-wrap">
          <div className="trail__medallion">
            <SiteIcon type={site.icon} size={104} color="#e2b969" />
          </div>
          <h2 className="trail__site-name">{site.name}</h2>
          <p className="trail__site-meta">{site.type} · built {site.built}</p>
        </div>

        <div className="trail__caption">
          <span className="eyebrow">Field note</span>
          <p>{site.narration[language] || site.narration.en}</p>
          <VoiceGuide
            narration={site.narration}
            stepKey={site.id}
            language={language}
            onLanguageChange={setLanguage}
          />
        </div>
      </div>

      <div className="trail__nav">
        <button
          className="trail__nav-btn"
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          disabled={isFirst}
        >
          ← Previous stop
        </button>
        {isLast ? (
          <Link to="/" className="trail__nav-btn trail__nav-btn--primary">
            Finish trail
          </Link>
        ) : (
          <button
            className="trail__nav-btn trail__nav-btn--primary"
            onClick={() => setStepIndex((i) => Math.min(trail.sites.length - 1, i + 1))}
          >
            Next stop →
          </button>
        )}
      </div>
    </div>
  )
}

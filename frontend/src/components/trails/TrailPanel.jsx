import { Link } from 'react-router-dom'
import SiteIcon from './SiteIcon.jsx'

export default function TrailPanel({ matches, activeTrail, onPick }) {
  if (activeTrail) {
    return (
      <div className="trail-panel">
        <span className="eyebrow">{activeTrail.theme}</span>
        <h2 className="trail-panel__title">{activeTrail.name}</h2>
        <p className="trail-panel__meta">
          {activeTrail.region} · {activeTrail.era} · {activeTrail.distanceKm} km ·{' '}
          {Math.round(activeTrail.durationMin / 60)
            ? `${Math.floor(activeTrail.durationMin / 60)}h ${activeTrail.durationMin % 60}m`
            : `${activeTrail.durationMin}m`}
        </p>
        <p className="trail-panel__desc">{activeTrail.description}</p>

        <ol className="trail-panel__sites">
          {activeTrail.sites.map((s, i) => (
            <li key={s.id}>
              <span className="trail-panel__site-icon">
                <SiteIcon type={s.icon} size={20} color="#e2b969" />
              </span>
              <span>
                <strong>{s.name}</strong>
                <span className="trail-panel__built">{s.built}</span>
              </span>
            </li>
          ))}
        </ol>

        <Link to={`/trail/${activeTrail.id}`} className="btn-primary">
          Begin trail →
        </Link>
      </div>
    )
  }

  return (
    <div className="trail-panel trail-panel--empty">
      <span className="eyebrow">Trails found</span>
      {matches.length === 0 ? (
        <p className="trail-panel__desc">
          No trail matches that combination yet. Try a different region or theme.
        </p>
      ) : (
        <ul className="trail-panel__list">
          {matches.map((t) => (
            <li key={t.id}>
              <button className="trail-panel__list-item" onClick={() => onPick(t)}>
                <strong>{t.name}</strong>
                <span>{t.region} · {t.sites.length} sites · {t.distanceKm} km</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="trail-panel__hint">
        Pan and zoom the map, or select any glowing marker to preview its trail.
      </p>
    </div>
  )
}

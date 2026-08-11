import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SiteIcon from './SiteIcon.jsx'

export default function TrailPanel({ matches, activeTrail, onPick }) {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 4

  // Reset to first page if matches change
  useEffect(() => {
    setCurrentPage(0)
  }, [matches])

  const totalPages = Math.ceil(matches.length / itemsPerPage)
  const paginatedMatches = matches.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  if (activeTrail) {
    return (
      <div className="trail-panel">
        <button onClick={() => onPick(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(214, 159, 76, 1)', cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', padding: 0 }}>
          ← Back to all trails
        </button>
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

        <Link to={`/trails/${activeTrail.id}`} state={{ trail: activeTrail }} className="btn-primary">
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
        <>
          <ul className="trail-panel__list">
            {paginatedMatches.map((t) => (
              <li key={t.id}>
                <button className="trail-panel__list-item" onClick={() => onPick(t)}>
                  <strong>{t.name}</strong>
                  <span>{t.region} · {t.sites.length} sites · {t.distanceKm} km</span>
                </button>
              </li>
            ))}
          </ul>
          
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                style={{ padding: '0.4rem 0.8rem', cursor: currentPage === 0 ? 'not-allowed' : 'pointer', background: 'transparent', border: '1px solid rgba(214, 159, 76, 0.5)', borderRadius: '4px' }}
              >
                Previous
              </button>
              <span style={{ fontSize: '0.8rem', color: 'rgba(43, 33, 24, 0.7)' }}>
                Page {currentPage + 1} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                style={{ padding: '0.4rem 0.8rem', cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer', background: 'transparent', border: '1px solid rgba(214, 159, 76, 0.5)', borderRadius: '4px' }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      <p className="trail-panel__hint">
        Pan and zoom the map, or select any glowing marker to preview its trail.
      </p>
    </div>
  )
}

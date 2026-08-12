import { useMemo, useState, useEffect } from 'react'
import TrailsMap from './TrailsMap.jsx'
import FilterBar from '../components/trails/FilterBar.jsx'
import TrailPanel from '../components/trails/TrailPanel.jsx'
import FloatingChatbot from '../components/FloatingChatbot.jsx'
import { themes } from '../data/trails.js'
import { apiFetch } from '../api/client.js'
import './GlobeHome.css'

const CITY_COORDS = {
  'Pune': [18.5204, 73.8567],
  'Mumbai': [19.0760, 72.8777],
  'Nashik': [20.0059, 73.7903],
  'Kolhapur': [16.7050, 74.2433],
  'Chhatrapati Sambhajinagar': [19.8762, 75.3433],
  'Nagpur': [21.1458, 79.0882]
}

function getNearestCity(lat, lon) {
  let minDistance = Infinity;
  let nearestCity = 'Maharashtra';
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    const dist = Math.pow(lat - coords[0], 2) + Math.pow(lon - coords[1], 2);
    if (dist < minDistance) {
      minDistance = dist;
      nearestCity = city;
    }
  }
  return minDistance < 2.0 ? nearestCity : 'Maharashtra';
}

export default function GlobeHome() {
  const [region, setRegion] = useState(null)
  const [theme, setTheme] = useState(null)
  const [activeTrailId, setActiveTrailId] = useState(null)
  const [viewMode, setViewMode] = useState('map') // 'map' or 'directory'
  
  const [trails, setTrails] = useState([])
  const [trailsLoading, setTrailsLoading] = useState(true)
  const [trailsError, setTrailsError] = useState(null)

  useEffect(() => {
    setTrailsLoading(true)
    setTrailsError(null)
    apiFetch('/trails/dynamic')
      .then(data => {
        // Map dynamic trails to match the structure expected by TrailPanel
        const mappedTrails = data.trails.map(t => {
          // Determine the city based on the first site's coordinates
          const cityRegion = t.sites.length > 0 
            ? getNearestCity(t.sites[0].latitude, t.sites[0].longitude) 
            : 'Maharashtra';
            
          // Walking pace (~15 min/km) plus a dwell time per stop - a rough
          // but real estimate, built from the backend's actual sequential
          // haversine distance instead of a flat guess.
          const walkingMinutes = t.distance_km * 15
          const dwellMinutes = t.sites.length * 15

          return {
            id: t.trail_id.toString(),
            name: t.name,
            theme: 'Dynamic Cluster',
            region: cityRegion,
            era: 'Various',
          distanceKm: t.distance_km,
          durationMin: Math.round(walkingMinutes + dwellMinutes),
          description: `An auto-generated trail clustering ${t.sites.length} heritage sites within a 5km radius.`,
          sites: t.sites.map(s => ({
            id: s.id,
            name: s.name,
            built: 'Unknown',
            type: s.category || 'Site',
            icon: s.category === 'built' ? 'wada' : 'site',
            signification: s.description || 'No description available',
            narration: {
              en: s.description || 'No description available for this site.',
            },
            lat: s.latitude,
            lon: s.longitude,
            image_url: s.image_url
          }))
        }
      })
      setTrails(mappedTrails)
      setTrailsLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch trails", err)
        setTrailsError('Could not load trails. Please try again later.')
        setTrailsLoading(false)
      })
  }, [])

  const matches = useMemo(
    () =>
      trails.filter(
        (t) => (!region || t.region === region) && (!theme || t.theme === theme)
      ),
    [region, theme, trails]
  )

  const allSites = useMemo(
    () => trails.flatMap((t) => t.sites.map((s) => ({ ...s, trailId: t.id }))),
    [trails]
  )

  const activeTrail = useMemo(
    () => trails.find((t) => t.id === activeTrailId) || null,
    [activeTrailId, trails]
  )

  const handleSelectSite = (site) => setActiveTrailId(site.trailId)

  const handleRegion = (r) => {
    setRegion(r)
    setActiveTrailId(null)
  }
  const handleTheme = (t) => {
    setTheme(t)
    setActiveTrailId(null)
  }

  const dynamicRegions = useMemo(() => {
    const r = new Set(trails.map(t => t.region).filter(Boolean));
    return Array.from(r).sort();
  }, [trails]);

  return (
    <div className="home">
      <div className="home__hero-quote">
        "A people without the knowledge of their past history, origin and culture is like a tree without roots." — Marcus Garvey
      </div>
      {/* Clean single-row filter toolbar — no hero title */}
      <div className="home__toolbar">
        <FilterBar
          regions={dynamicRegions}
          themes={themes}
          region={region}
          theme={theme}
          onRegion={handleRegion}
          onTheme={handleTheme}
        >
          <div className="home__view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              Map View
            </button>
            <button
              className={`toggle-btn ${viewMode === 'directory' ? 'active' : ''}`}
              onClick={() => setViewMode('directory')}
            >
              Directory View
            </button>
          </div>
        </FilterBar>
      </div>

      {trailsLoading && (
        <div className="home__status">Loading trails…</div>
      )}
      {trailsError && (
        <div className="home__status home__status--error">{trailsError}</div>
      )}

      {viewMode === 'map' ? (
        <div className="home__body">
          <TrailsMap 
            trails={matches} 
            activeTrail={activeTrail} 
            onSelectSite={handleSelectSite} 
          />
          <TrailPanel matches={matches} activeTrail={activeTrail} onPick={(t) => setActiveTrailId(t ? t.id : null)} />
        </div>
      ) : (
        <div className="home__directory-view">
          <div className="table-responsive">
            <table className="heritage-user-table">
              <thead>
                <tr>
                  <th>Site Name</th>
                  <th>Region</th>
                  <th>Type</th>
                  <th>Signification & Details</th>
                </tr>
              </thead>
              <tbody>
                {allSites
                  .filter(site => {
                    const parentTrail = trails.find(t => t.id === site.trailId);
                    if (!parentTrail) return false;
                    const matchesRegion = !region || parentTrail.region === region;
                    const matchesTheme = !theme || parentTrail.theme === theme;
                    return matchesRegion && matchesTheme;
                  })
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((site) => {
                    const parentTrail = trails.find(t => t.id === site.trailId);
                    if (!parentTrail) return null;
                    return (
                      <tr key={site.id}>
                        <td className="td-name"><strong>{site.name}</strong></td>
                        <td className="td-region">{parentTrail.region}</td>
                        <td className="td-type">{site.type}</td>
                        <td className="td-signification">
                          <p>{site.signification}</p>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <FloatingChatbot />
    </div>
  )
}

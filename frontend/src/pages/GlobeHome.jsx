import { useMemo, useState } from 'react'
import HeritageMap from '../components/trails/HeritageMap.jsx'
import FilterBar from '../components/trails/FilterBar.jsx'
import TrailPanel from '../components/trails/TrailPanel.jsx'
import FloatingChatbot from '../components/FloatingChatbot.jsx'
import { trails, regions, themes } from '../data/trails.js'
import './GlobeHome.css'

export default function GlobeHome() {
  const [region, setRegion] = useState(null)
  const [theme, setTheme] = useState(null)
  const [activeTrailId, setActiveTrailId] = useState(null)
  const [viewMode, setViewMode] = useState('map') // 'map' or 'directory'

  const matches = useMemo(
    () =>
      trails.filter(
        (t) => (!region || t.region === region) && (!theme || t.theme === theme)
      ),
    [region, theme]
  )

  const allSites = useMemo(
    () => trails.flatMap((t) => t.sites.map((s) => ({ ...s, trailId: t.id }))),
    []
  )

  const activeTrail = useMemo(
    () => trails.find((t) => t.id === activeTrailId) || null,
    [activeTrailId]
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

  return (
    <div className="home">
      {/* Clean single-row filter toolbar — no hero title */}
      <div className="home__toolbar">
        <FilterBar
          regions={regions}
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

      {viewMode === 'map' ? (
        <div className="home__body">
          <HeritageMap sites={allSites} activeTrail={activeTrail} onSelectSite={handleSelectSite} />
          <TrailPanel matches={matches} activeTrail={activeTrail} onPick={(t) => setActiveTrailId(t.id)} />
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
                    const matchesRegion = !region || parentTrail.region === region;
                    const matchesTheme = !theme || parentTrail.theme === theme;
                    return matchesRegion && matchesTheme;
                  })
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((site) => {
                    const parentTrail = trails.find(t => t.id === site.trailId);
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

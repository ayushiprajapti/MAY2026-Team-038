import { useMemo, useState } from 'react'
import HeritageMap from '../components/HeritageMap.jsx'
import FilterBar from '../components/FilterBar.jsx'
import TrailPanel from '../components/TrailPanel.jsx'
import { trails, regions, themes } from '../data/trails.js'
import './GlobeHome.css'

export default function GlobeHome() {
  const [region, setRegion] = useState(null)
  const [theme, setTheme] = useState(null)
  const [activeTrailId, setActiveTrailId] = useState(null)

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
      <header className="home__header">
        <div>
          <span className="eyebrow">INTACH · Heritage Trails</span>
          <h1 className="home__title">A living atlas of what survives</h1>
          <p className="home__tagline">
            Explore the map, find a marker, and walk a trail built from the approved
            heritage site database.
          </p>
        </div>
      </header>

      <FilterBar
        regions={regions}
        themes={themes}
        region={region}
        theme={theme}
        onRegion={handleRegion}
        onTheme={handleTheme}
      />

      <div className="home__body">
        <HeritageMap sites={allSites} activeTrail={activeTrail} onSelectSite={handleSelectSite} />
        <TrailPanel matches={matches} activeTrail={activeTrail} onPick={(t) => setActiveTrailId(t.id)} />
      </div>
    </div>
  )
}

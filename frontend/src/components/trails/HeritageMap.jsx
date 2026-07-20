import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { buildSiteIcon } from '../../utils/markerIcon.js'
import './HeritageMap.css'

const MAHARASHTRA_CENTER = [18.9, 74.6]
const DEFAULT_ZOOM = 7

// Flies the view to the active trail's bounds, or back out to the regional
// overview when no trail is selected. Needs to live inside <MapContainer />
// to access the map instance via useMap().
function FlyToTrail({ activeTrail }) {
  const map = useMap()

  useEffect(() => {
    if (activeTrail) {
      const bounds = L.latLngBounds(activeTrail.sites.map((s) => [s.lat, s.lon]))
      map.flyToBounds(bounds, { padding: [64, 64], duration: 0.9, maxZoom: 13 })
    } else {
      map.flyTo(MAHARASHTRA_CENTER, DEFAULT_ZOOM, { duration: 0.9 })
    }
  }, [activeTrail, map])

  return null
}

export default function HeritageMap({ sites, activeTrail, onSelectSite }) {
  const path = activeTrail ? activeTrail.sites.map((s) => [s.lat, s.lon]) : null

  return (
    <div className="heritage-map">
      <MapContainer
        center={MAHARASHTRA_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        className="heritage-map__container"
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={18}
        />

        <FlyToTrail activeTrail={activeTrail} />

        {path && (
          <Polyline
            positions={path}
            pathOptions={{
              color: '#e2b969',
              weight: 3,
              opacity: 0.9,
              dashArray: '1 9',
              className: 'trail-line',
            }}
          />
        )}

        {sites.map((site) => {
          const isTrailSite = activeTrail && activeTrail.sites.some((s) => s.id === site.id)
          return (
            <Marker
              key={site.id}
              position={[site.lat, site.lon]}
              icon={buildSiteIcon(site.icon, { active: isTrailSite })}
              eventHandlers={{ click: () => onSelectSite(site) }}
            >
              <Popup>
                <strong>{site.name}</strong>
                <br />
                <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.75rem' }}>
                  {site.type} · built {site.built}
                </span>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import './TrailsMap.css'

// Fix default leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// A small palette of colors for the trails
const TRAIL_COLORS = [
  '#d69f4c', // primary gold
  '#4a5d23', // olive green
  '#800000', // maroon
  '#4c6a85', // slate blue
  '#b77b4d', // terracotta
  '#594c65', // purple
]

const createColoredIcon = (color) => {
  return L.divIcon({
    className: 'custom-colored-marker',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

function MapEffect({ trails, activeTrail }) {
  const map = useMap();
  
  useEffect(() => {
    if (activeTrail && activeTrail.sites && activeTrail.sites.length > 0) {
      if (activeTrail.sites.length === 1) {
        map.flyTo([activeTrail.sites[0].lat, activeTrail.sites[0].lon], 14, { duration: 1.5 });
      } else {
        const bounds = L.latLngBounds(activeTrail.sites.map(s => [s.lat, s.lon]));
        map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
      }
    } else if (trails && trails.length > 0) {
      const allSites = trails.flatMap(t => t.sites);
      if (allSites.length > 0) {
        const bounds = L.latLngBounds(allSites.map(s => [s.lat, s.lon]));
        map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5, maxZoom: 12 });
      }
    }
  }, [activeTrail, trails, map]);

  return null;
}

export default function TrailsMap({ trails = [], activeTrail, onSelectSite }) {
  // Center on Pune
  const center = [18.5204, 73.8567]

  return (
    <div className="trails-map-container" style={{ width: '100%', height: '100%' }}>
      <MapContainer center={center} zoom={7} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapEffect trails={trails} activeTrail={activeTrail} />

          {trails.map((trail, index) => {
            const color = TRAIL_COLORS[index % TRAIL_COLORS.length]
            const icon = createColoredIcon(color)
            
            // Build coordinates for the polyline connecting sites in this trail
            const positions = trail.sites.map(site => [site.lat, site.lon])

            // If it's the active trail, make the line thicker and gold
            const isActive = activeTrail && activeTrail.id === trail.id
            const finalColor = isActive ? '#e2b969' : color
            const finalWeight = isActive ? 5 : 3
            const finalOpacity = isActive ? 1 : 0.6

            return (
              <div key={trail.id}>
                {/* Draw a line connecting the sites in the trail */}
                {positions.length > 1 && (
                  <Polyline 
                    positions={positions} 
                    pathOptions={{ color: finalColor, weight: finalWeight, dashArray: isActive ? '1, 9' : '5, 5', opacity: finalOpacity }} 
                  />
                )}

                {/* Draw markers for each site */}
                {trail.sites.map((site) => (
                  <Marker 
                    key={site.id} 
                    position={[site.lat, site.lon]} 
                    icon={icon}
                    eventHandlers={{ click: () => onSelectSite && onSelectSite(site) }}
                  >
                    <Popup className="trail-popup">
                      <h3>{site.name}</h3>
                      <p className="trail-popup-category">{site.category}</p>
                      <p className="trail-popup-trailname">Part of: {trail.name}</p>
                      
                      {/* Link to dynamic trail viewer passing the state */}
                      <Link to={`/trails/${trail.id}`} state={{ trail: trail }} className="trail-popup-btn">
                        Start Trail Experience
                      </Link>
                    </Popup>
                  </Marker>
                ))}
              </div>
            )
          })}
      </MapContainer>
    </div>
  )
}

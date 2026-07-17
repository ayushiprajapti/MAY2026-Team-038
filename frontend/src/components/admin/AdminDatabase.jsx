import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { trails, regions } from '../../data/trails';
import { buildSiteIcon } from '../../utils/markerIcon';
import './AdminDatabase.css';

const MAHARASHTRA_CENTER = [18.9, 74.6];
const DEFAULT_ZOOM = 7;

function MapBoundsController({ sites, selectedRegion }) {
  const map = useMap();

  useEffect(() => {
    if (sites.length > 0) {
      const bounds = L.latLngBounds(sites.map((s) => [s.lat, s.lon]));
      map.flyToBounds(bounds, { padding: [40, 40], duration: 0.8, maxZoom: 12 });
    } else {
      map.flyTo(MAHARASHTRA_CENTER, DEFAULT_ZOOM, { duration: 0.8 });
    }
  }, [sites, selectedRegion, map]);

  return null;
}

export default function AdminDatabase() {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [activeSiteId, setActiveSiteId] = useState(null);
  
  const rowRefs = useRef({});

  // Flatten the trails data into a list of sites, attaching region and signification
  const allSites = useMemo(() => {
    const flattened = [];
    trails.forEach((trail) => {
      trail.sites.forEach((site) => {
        flattened.push({
          ...site,
          region: trail.region,
          trailName: trail.name
        });
      });
    });
    return flattened;
  }, []);

  const filteredSites = useMemo(() => {
    if (selectedRegion === 'All') return allSites;
    return allSites.filter(site => site.region === selectedRegion);
  }, [selectedRegion, allSites]);

  // Scroll to active row in table
  useEffect(() => {
    if (activeSiteId && rowRefs.current[activeSiteId]) {
      rowRefs.current[activeSiteId].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeSiteId]);

  return (
    <div className="admin-db-page">
      <div className="admin-db-header">
        <h1>Heritage Database</h1>
        <p>Manage and view all approved heritage sites across regions.</p>
        
        <div className="admin-db-filters">
          <label htmlFor="regionFilter"><strong>Filter by Region:</strong></label>
          <select 
            id="regionFilter" 
            value={selectedRegion} 
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setActiveSiteId(null);
            }}
          >
            <option value="All">All Regions</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="admin-db-content">
        
        {/* Map View */}
        <MapContainer
          center={MAHARASHTRA_CENTER}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={false}
          className="admin-db-map-container"
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={18}
          />

          <MapBoundsController sites={filteredSites} selectedRegion={selectedRegion} />

          {filteredSites.map((site) => (
            <Marker
              key={site.id}
              position={[site.lat, site.lon]}
              icon={buildSiteIcon(site.icon, { active: activeSiteId === site.id })}
              eventHandlers={{
                click: () => setActiveSiteId(site.id)
              }}
            >
              <Popup>
                <strong>{site.name}</strong>
                <br />
                <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.75rem' }}>
                  {site.region} · {site.type}
                </span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Table View */}
        <div className="admin-db-table-wrapper">
          <table className="admin-db-table">
            <thead>
              <tr>
                <th>Site Name & Trail</th>
                <th>Region</th>
                <th>Type / Built</th>
                <th>Signification</th>
              </tr>
            </thead>
            <tbody>
              {filteredSites.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    <div className="empty-table-state">
                      No sites found for the selected region.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSites.map((site) => (
                  <tr 
                    key={site.id} 
                    ref={el => rowRefs.current[site.id] = el}
                    className={activeSiteId === site.id ? 'active-row' : ''}
                    onClick={() => setActiveSiteId(site.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <strong>{site.name}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#666' }}>{site.trailName}</span>
                    </td>
                    <td>{site.region}</td>
                    <td>
                      {site.type}
                      <br />
                      <span style={{ fontSize: '0.8rem', color: '#666' }}>{site.built}</span>
                    </td>
                    <td className="signification-col">{site.signification}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { trails, regions } from '../../data/trails';
import { buildSiteIcon } from '../../utils/markerIcon';
import AdminSidebar from '../shared/AdminSidebar';
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
    <div className="admin-db-page p-8 space-y-8 text-left w-full h-full">
        
        {/* Header Section with Integrated Filter */}
        <div className="py-6 border-b border-heritage-border/20 flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-left">
          <div>
            <p className="uppercase tracking-[0.2em] text-[#c28230] text-xs font-bold">
              Admin Panel
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#9c2d19] mt-2">
              Heritage Database
            </h1>
            <p className="mt-3 text-heritage-charcoal/85 text-base leading-relaxed max-w-3xl">
              Manage and view all approved heritage sites across regions on an interactive map.
            </p>
          </div>

          {/* Region filter in header */}
          <div className="flex items-center gap-3 shrink-0">
            <label htmlFor="regionFilter" className="text-xs font-bold uppercase tracking-wider text-heritage-charcoal/70">
              Region:
            </label>
            <select
              id="regionFilter"
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setActiveSiteId(null);
              }}
              className="w-48 border border-heritage-border bg-white shadow-sm focus:outline-none focus:border-heritage-bronze focus:ring-1 focus:ring-heritage-bronze rounded-lg p-2.5 text-xs font-semibold text-heritage-espresso transition cursor-pointer"
            >
              <option value="All">All Regions</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content Area */}
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

          {/* Table View - Restyled to match Volunteer Tables */}
          <div className="heritage-card rounded-2xl p-6 md:p-8 overflow-x-auto shadow-sm">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-heritage-border/40 text-heritage-charcoal/60 uppercase font-semibold tracking-wider text-[10px]">
                  <th className="py-3 px-4">Site Name & Trail</th>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4">Type / Built</th>
                  <th className="py-3 px-4">Signification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-border/20 text-heritage-espresso font-medium">
                {filteredSites.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-12 text-center text-heritage-charcoal/60 font-semibold"
                    >
                      No sites found for the selected region.
                    </td>
                  </tr>
                ) : (
                  filteredSites.map((site) => (
                    <tr 
                      key={site.id} 
                      ref={el => rowRefs.current[site.id] = el}
                      className={`hover:bg-heritage-cream/10 transition-colors cursor-pointer ${
                        activeSiteId === site.id ? 'bg-heritage-cream/30 border-l-4 border-heritage-bronze' : ''
                      }`}
                      onClick={() => setActiveSiteId(site.id)}
                    >
                      <td className="py-3.5 px-4 font-semibold text-heritage-espresso">
                        <strong>{site.name}</strong>
                        <span className="text-[10px] text-heritage-charcoal/60 font-sans mt-0.5 block">{site.trailName}</span>
                      </td>
                      <td className="py-3.5 px-4 text-heritage-charcoal/80">{site.region}</td>
                      <td className="py-3.5 px-4 text-heritage-charcoal/80">
                        <div>{site.type}</div>
                        <span className="text-[10px] text-heritage-charcoal/60 font-sans mt-0.5 block">{site.built}</span>
                      </td>
                      <td className="py-3.5 px-4 text-heritage-charcoal/80 max-w-sm leading-relaxed whitespace-normal">
                        {site.signification}
                      </td>
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

import L from 'leaflet'

// Same line-work as components/SiteIcon.jsx, expressed as raw SVG path
// strings so they can be dropped into a Leaflet divIcon (Leaflet renders
// marker icons outside React, so it needs plain HTML, not JSX).
const PATHS = {
  fort: `
    <path d="M6 40h36" />
    <path d="M9 40V20l4-4v6h3v-6l4-4v8h4v-8l4 4v6h3v-6l4 4v20" />
    <path d="M9 20l4-4M31 16l4 4" />
    <path d="M24 8v4" />
  `,
  wada: `
    <path d="M6 40h36" />
    <path d="M10 40V22h28v18" />
    <path d="M10 22 24 10l14 12" />
    <path d="M18 40v-9h12v9" />
    <path d="M14 28h4M30 28h4" />
  `,
  temple: `
    <path d="M6 40h36" />
    <path d="M12 40V26h24v14" />
    <path d="M16 26v-6h16v6" />
    <path d="M20 20v-5h8v5" />
    <path d="M24 15V7" />
    <circle cx="24" cy="6" r="1.4" fill="currentColor" stroke="none" />
  `,
  stepwell: `
    <path d="M6 14h36" />
    <path d="M10 14v6h28v-6" />
    <path d="M14 20v6h20v-6" />
    <path d="M18 26v6h12v-6" />
    <path d="M22 32v6h4v-6" />
  `,
}

export function buildSiteIcon(type, { active = false } = {}) {
  const size = active ? 42 : 30
  const iconSize = Math.round(size * 0.55)
  const body = PATHS[type] || PATHS.fort
  const html = `
    <div class="site-marker ${active ? 'site-marker--active' : ''}">
      <svg
        viewBox="0 0 48 48"
        width="${iconSize}"
        height="${iconSize}"
        fill="none"
        stroke="${active ? '#241a10' : '#f2e6c8'}"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      >${body}</svg>
    </div>
  `

  return L.divIcon({
    html,
    className: 'site-marker-wrap',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 2],
  })
}

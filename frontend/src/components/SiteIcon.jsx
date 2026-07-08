// Hand-drawn line icons, styled like copper-plate engraving marks.
// Kept as vector line-work rather than photography — deliberate,
// license-free, and consistent with the "engraved atlas" signature.

export default function SiteIcon({ type, size = 28, color = 'currentColor' }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  switch (type) {
    case 'fort':
      return (
        <svg {...common}>
          <path d="M6 40h36" />
          <path d="M9 40V20l4-4v6h3v-6l4-4v8h4v-8l4 4v6h3v-6l4 4v20" />
          <path d="M9 20l4-4M31 16l4 4" />
          <path d="M24 8v4" />
        </svg>
      )
    case 'wada':
      return (
        <svg {...common}>
          <path d="M6 40h36" />
          <path d="M10 40V22h28v18" />
          <path d="M10 22 24 10l14 12" />
          <path d="M18 40v-9h12v9" />
          <path d="M14 28h4M30 28h4" />
        </svg>
      )
    case 'temple':
      return (
        <svg {...common}>
          <path d="M6 40h36" />
          <path d="M12 40V26h24v14" />
          <path d="M16 26v-6h16v6" />
          <path d="M20 20v-5h8v5" />
          <path d="M24 15V7" />
          <circle cx="24" cy="6" r="1.4" fill={color} stroke="none" />
        </svg>
      )
    case 'stepwell':
      return (
        <svg {...common}>
          <path d="M6 14h36" />
          <path d="M10 14v6h28v-6" />
          <path d="M14 20v6h20v-6" />
          <path d="M18 26v6h12v-6" />
          <path d="M22 32v6h4v-6" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="16" />
        </svg>
      )
  }
}

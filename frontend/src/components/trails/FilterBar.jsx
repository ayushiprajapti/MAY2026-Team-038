import RegionPicker from './RegionPicker.jsx'

export default function FilterBar({ regions, themes, region, theme, onRegion, onTheme, children }) {
  return (
    <div className="filter-bar">
      <RegionPicker regions={regions} region={region} onRegion={onRegion} />

      <div className="chip-row">
          <button
            className={`chip ${theme === null ? 'chip--active' : ''}`}
            onClick={() => onTheme(null)}
          >
            All
          </button>
          {themes.map((t) => (
            <button
              key={t}
              className={`chip ${theme === t ? 'chip--active' : ''}`}
              onClick={() => onTheme(theme === t ? null : t)}
            >
              {t}
            </button>
          ))}
          
          <div style={{ marginLeft: 'auto', display: 'flex' }}>
            {children}
          </div>
        </div>
    </div>
  )
}

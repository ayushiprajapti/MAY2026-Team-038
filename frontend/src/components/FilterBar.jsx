import RegionPicker from './RegionPicker.jsx'

export default function FilterBar({ regions, themes, region, theme, onRegion, onTheme }) {
  return (
    <div className="filter-bar">
      <RegionPicker regions={regions} region={region} onRegion={onRegion} />

      <div className="filter-group">
        <span className="eyebrow">Theme</span>
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
        </div>
      </div>
    </div>
  )
}

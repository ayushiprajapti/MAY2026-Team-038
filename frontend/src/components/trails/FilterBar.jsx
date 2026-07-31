import RegionPicker from './RegionPicker.jsx'
import ThemePicker from './ThemePicker.jsx'

export default function FilterBar({ regions, themes, region, theme, onRegion, onTheme, children }) {
  return (
    <div className="filter-bar">
      <RegionPicker regions={regions} region={region} onRegion={onRegion} />
      <ThemePicker themes={themes} theme={theme} onTheme={onTheme} />

      <div style={{ marginLeft: 'auto', display: 'flex' }}>
        {children}
      </div>
    </div>
  )
}

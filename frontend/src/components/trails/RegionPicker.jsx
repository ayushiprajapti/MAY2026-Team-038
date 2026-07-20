import { useEffect, useRef, useState } from 'react'

export default function RegionPicker({ regions, region, onRegion }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const filtered = regions.filter((r) => r.toLowerCase().includes(query.toLowerCase()))

  const pick = (r) => {
    onRegion(r)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="region-picker" ref={wrapRef}>
      <div className="region-picker__control">
        <input
          ref={inputRef}
          className="region-picker__input"
          placeholder="All regions"
          value={open ? query : region || ''}
          onFocus={() => {
            setOpen(true)
            setQuery('')
          }}
          onChange={(e) => setQuery(e.target.value)}
        />
        {region && !open && (
          <button
            className="region-picker__clear"
            onClick={() => pick(null)}
            aria-label="Clear region filter"
            type="button"
          >
            ×
          </button>
        )}
      </div>

      {open && (
        <ul className="region-picker__list">
          <li>
            <button type="button" onClick={() => pick(null)}>
              All regions
            </button>
          </li>
          {filtered.length === 0 && <li className="region-picker__empty">No regions match "{query}"</li>}
          {filtered.map((r) => (
            <li key={r}>
              <button
                type="button"
                className={region === r ? 'region-picker__item--active' : ''}
                onClick={() => pick(r)}
              >
                {r}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

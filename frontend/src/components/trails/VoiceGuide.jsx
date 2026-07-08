import { useEffect, useRef, useState } from 'react'

const LANGUAGES = [
  { code: 'en', speechLang: 'en-IN', label: 'English' },
  { code: 'hi', speechLang: 'hi-IN', label: 'हिंदी' },
  { code: 'mr', speechLang: 'mr-IN', label: 'मराठी' },
]

export default function VoiceGuide({ narration, stepKey, language, onLanguageChange }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [voices, setVoices] = useState([])
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const utterRef = useRef(null)

  useEffect(() => {
    if (!supported) return
    const load = () => setVoices(window.speechSynthesis.getVoices())
    load()
    window.speechSynthesis.onvoiceschanged = load
  }, [supported])

  // stop narration whenever the step changes
  useEffect(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setIsPlaying(false)
  }, [stepKey, supported])

  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel()
    }
  }, [supported])

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0]

  const play = () => {
    if (!supported) return
    window.speechSynthesis.cancel()
    const text = narration[language] || narration.en
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = currentLang.speechLang
    utter.rate = 0.96
    utter.pitch = 1
    const match = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(currentLang.code))
    if (match) utter.voice = match
    utter.onend = () => setIsPlaying(false)
    utter.onerror = () => setIsPlaying(false)
    utterRef.current = utter
    window.speechSynthesis.speak(utter)
    setIsPlaying(true)
  }

  const stop = () => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setIsPlaying(false)
  }

  return (
    <div className="voice-guide">
      <div className="voice-guide__lang">
        <span className="eyebrow">Guide language</span>
        <div className="chip-row">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              className={`chip ${language === l.code ? 'chip--active' : ''}`}
              onClick={() => onLanguageChange(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <button
        className="voice-guide__play"
        onClick={isPlaying ? stop : play}
        disabled={!supported}
        aria-label={isPlaying ? 'Stop narration' : 'Play narration'}
      >
        {isPlaying ? (
          <>
            <IconStop /> Stop
          </>
        ) : (
          <>
            <IconPlay /> Play AI voice guide
          </>
        )}
      </button>

      {!supported && (
        <p className="voice-guide__fallback">
          Voice playback isn't supported in this browser — read the caption below instead.
        </p>
      )}
    </div>
  )
}

function IconPlay() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 5v14l12-7z" />
    </svg>
  )
}
function IconStop() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
    </svg>
  )
}

import { useEffect, useRef, useState } from 'react'

export const LANGUAGES = [
  { code: 'en', speechLang: 'en-IN', label: 'English' },
  { code: 'hi', speechLang: 'hi-IN', label: 'हिंदी' },
  { code: 'mr', speechLang: 'mr-IN', label: 'मराठी' },
]

export default function useVoiceGuide(narration, stepKey, language) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [voices, setVoices] = useState([])
  const [error, setError] = useState(null)
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

  const toggleSpeech = () => {
    if (!supported) return
    setError(null)
    
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0]
    const text = narration[language] || narration.en
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = currentLang.speechLang
    utter.rate = 0.96
    utter.pitch = 1
    let match = null;
    const matches = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith(currentLang.code))
    
    if (matches.length > 0) {
      match = matches.find(v => v.name.toLowerCase().includes('male')) || matches[0]
    } else if (language === 'mr') {
      // Fallback to Hindi if Marathi is not found
      const hiMatches = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('hi'))
      match = hiMatches.find(v => v.name.toLowerCase().includes('male')) || hiMatches[0]
    }

    if (match) {
      utter.voice = match
    } else if (language !== 'en') {
      setError(`No voice found for ${currentLang.label} on your system.`)
      return
    }
    
    utter.onend = () => setIsPlaying(false)
    utter.onerror = () => setIsPlaying(false)
    utterRef.current = utter
    
    window.speechSynthesis.speak(utter)
    setIsPlaying(true)
  }

  return { isPlaying, toggleSpeech, supported, error }
}

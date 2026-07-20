import { useEffect, useRef, useState } from 'react'

const AUDIO_MAP = {
  // Reliable Google Sound Effects Library (CORS-enabled)
  temple:   'https://actions.google.com/sounds/v1/alarms/medium_bell_ringing_near.ogg',
  fort:     'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg', // Loud wind/waves
  stepwell: 'https://actions.google.com/sounds/v1/water/humidifier_bubble.ogg', // Water bubbling
  wada:     'https://actions.google.com/sounds/v1/ambiences/crickets_with_distant_traffic.ogg' // Evening ambience
}

export default function useAmbientAudio(siteType) {
  const audioRef = useRef(null)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Clean up previous audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }

    const type = siteType || 'wada'
    const src = AUDIO_MAP[type] || AUDIO_MAP.wada

    const audio = new Audio(src)
    audio.loop = true
    audio.volume = 0.5
    audio.muted = true // Start muted to bypass browser autoplay blocks
    audioRef.current = audio

    // Attempt to start playing silently
    audio.play().catch(() => {
      // Browsers may block even muted autoplay, toggleMute will handle it
    })

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [siteType])

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.muted = false
      if (audio.paused) {
        audio.play().catch(console.warn)
      }
      setIsMuted(false)
    } else {
      audio.muted = true
      setIsMuted(true)
    }
  }

  return { isMuted, toggleMute }
}

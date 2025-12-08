'use client'

import { useState, useRef, useCallback } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export function AudioController() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // audio 요소의 onCanPlay 이벤트로 로드 상태 관리
  const handleCanPlay = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3
      setIsLoaded(true)
    }
  }, [])

  const toggleAudio = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.log('Audio playback failed:', error)
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/examples/A_Promise_of_Eternity.mp3"
        loop
        preload="auto"
        onCanPlay={handleCanPlay}
      />
      <button
        onClick={toggleAudio}
        className={`fixed bottom-24 right-4 z-40 w-10 h-10 rounded-full
          bg-white/10 backdrop-blur border border-white/20
          flex items-center justify-center text-[#F5E6D3]
          hover:bg-white/20 transition-all duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${isPlaying ? 'animate-pulse-slow' : ''}
        `}
        aria-label={isPlaying ? '음악 끄기' : '음악 켜기'}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>
    </>
  )
}

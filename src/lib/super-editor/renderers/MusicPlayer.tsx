'use client'

/**
 * MusicPlayer - 배경음악 FAB 컴포넌트
 * 플로팅 버튼 형태로 BGM 재생/정지 제어
 */

import React, { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import type { Screen } from '../schema/layout'
import type { UserData } from '../schema/user-data'

interface MusicPlayerProps {
  screen: Screen
  userData: UserData
  mode?: 'preview' | 'edit' | 'build'
}

export function MusicPlayer({ screen, userData, mode = 'preview' }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // BGM 데이터 가져오기
  const bgmData = (userData.data as Record<string, unknown>).bgm as {
    presetId?: string
    enabled?: boolean
    autoplay?: boolean
    url?: string
  } | undefined

  // 오디오 URL (presetId 기반으로 가져오거나 직접 URL 사용)
  const audioUrl = bgmData?.url

  useEffect(() => {
    if (!audioRef.current || !audioUrl) return

    const audio = audioRef.current
    audio.src = audioUrl
    audio.loop = true

    const handleCanPlay = () => setIsLoaded(true)
    const handleEnded = () => setIsPlaying(false)
    const handleError = () => {
      console.error('Failed to load audio:', audioUrl)
      setIsLoaded(false)
    }

    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [audioUrl])

  // 자동 재생 (사용자 인터랙션 이후)
  useEffect(() => {
    if (!bgmData?.autoplay || !isLoaded || mode !== 'preview') return

    // 사용자 인터랙션 대기
    const handleInteraction = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // 자동 재생 실패 (모바일 정책)
            console.log('Autoplay blocked')
          })
      }
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }

    document.addEventListener('click', handleInteraction)
    document.addEventListener('touchstart', handleInteraction)

    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }
  }, [bgmData?.autoplay, isLoaded, isPlaying, mode])

  const togglePlay = () => {
    if (!audioRef.current || !isLoaded) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Play failed:', err))
    }
  }

  // edit 모드에서는 항상 FAB 표시, 그 외에는 bgmData 필요
  const showFab = mode === 'edit' || (bgmData?.enabled && audioUrl)
  if (!showFab) return null

  return (
    <>
      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="auto" />

      {/* FAB Button - 우상단 32x32 */}
      <button
        onClick={togglePlay}
        disabled={mode === 'edit' ? false : !isLoaded}
        className="music-fab"
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1000,
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: '#fff',
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          pointerEvents: 'auto',
        }}
        aria-label={isPlaying ? '음악 끄기' : '음악 켜기'}
      >
        {isPlaying ? (
          <Volume2 size={16} strokeWidth={2} />
        ) : (
          <VolumeX size={16} strokeWidth={2} />
        )}
      </button>

      <style jsx>{`
        .music-fab:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        .music-fab:active {
          transform: scale(0.95);
        }
      `}</style>
    </>
  )
}

'use client'

/**
 * MusicPlayer - 배경음악 FAB 컴포넌트
 * 플로팅 버튼 형태로 BGM 재생/정지 제어
 */

import React, { useState, useRef, useEffect } from 'react'
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

  if (!bgmData?.enabled || !audioUrl) return null

  return (
    <>
      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="auto" />

      {/* FAB Button */}
      <button
        onClick={togglePlay}
        disabled={!isLoaded}
        className="music-fab"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          width: 48,
          height: 48,
          borderRadius: '50%',
          backgroundColor: '#fff',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isLoaded ? 'pointer' : 'wait',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        aria-label={isPlaying ? '음악 정지' : '음악 재생'}
      >
        {isPlaying ? (
          // Pause Icon
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          // Play Icon (with spinning animation when playing)
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{
              animation: isLoaded ? 'none' : 'spin 1s linear infinite',
            }}
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Keyframes for spinning */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
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

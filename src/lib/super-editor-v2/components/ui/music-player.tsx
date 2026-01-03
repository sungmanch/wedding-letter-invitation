'use client'

/**
 * MusicPlayer - 배경음악 FAB 컴포넌트
 * 우측 상단에 24x24 플로팅 버튼으로 BGM 재생/정지 제어
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { useDocumentData } from '../../context/document-context'

// ============================================
// Types
// ============================================

export interface MusicPlayerProps {
  /** 렌더링 모드 */
  mode?: 'view' | 'preview' | 'edit'
}

// ============================================
// Component
// ============================================

export function MusicPlayer({ mode = 'view' }: MusicPlayerProps) {
  const data = useDocumentData()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // BGM 데이터
  const musicData = data.music
  const audioUrl = musicData?.url

  // 오디오 로드
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
    if (!musicData?.autoPlay || !isLoaded || mode !== 'view') return

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
  }, [musicData?.autoPlay, isLoaded, isPlaying, mode])

  // 재생/정지 토글
  const togglePlay = useCallback(() => {
    if (!audioRef.current || !isLoaded) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Play failed:', err))
    }
  }, [isLoaded, isPlaying])

  // edit 모드에서는 항상 FAB 표시, 그 외에는 musicData 필요
  const showFab = mode === 'edit' || (musicData && audioUrl)
  if (!showFab) return null

  return (
    <>
      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="auto" />

      {/* FAB Button - 우상단 36x36 */}
      <button
        onClick={togglePlay}
        disabled={mode === 'edit' ? false : !isLoaded}
        className="se2-music-fab"
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 1000,
          width: 36,
          height: 36,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          border: 'none',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
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
          <VolumeOnIcon size={20} />
        ) : (
          <VolumeOffIcon size={20} />
        )}
      </button>

      <style jsx>{`
        .se2-music-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .se2-music-fab:active {
          transform: scale(0.95);
        }
        .se2-music-fab:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </>
  )
}

// ============================================
// Icons (Inline SVG)
// ============================================

interface IconProps {
  size?: number
  className?: string
}

function VolumeOnIcon({ size = 14, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

function VolumeOffIcon({ size = 14, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}

export default MusicPlayer

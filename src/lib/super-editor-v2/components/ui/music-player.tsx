'use client'

/**
 * MusicPlayer - 배경음악 FAB 컴포넌트
 * 우측 상단에 36x36 플로팅 버튼으로 BGM 재생/정지 제어
 * - 일반 오디오 파일: <audio> 태그
 * - 유튜브 URL: 숨겨진 iframe 임베드
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
// Utility Functions
// ============================================

/**
 * 유튜브 URL인지 확인
 */
function isYoutubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

/**
 * 유튜브 URL에서 비디오 ID 추출
 */
function extractYoutubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

// ============================================
// Component
// ============================================

export function MusicPlayer({ mode = 'view' }: MusicPlayerProps) {
  const data = useDocumentData()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // BGM 데이터
  const musicData = data.music
  const audioUrl = musicData?.url || ''
  const isYoutube = audioUrl ? isYoutubeUrl(audioUrl) : false
  const youtubeVideoId = isYoutube ? extractYoutubeVideoId(audioUrl) : null

  // 일반 오디오 로드
  useEffect(() => {
    if (isYoutube || !audioRef.current || !audioUrl) return

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
  }, [audioUrl, isYoutube])

  // 유튜브 iframe 로드
  useEffect(() => {
    if (!isYoutube || !youtubeVideoId) return
    // iframe이 로드되면 준비 완료
    setIsLoaded(true)
  }, [isYoutube, youtubeVideoId])

  // 자동 재생 (사용자 인터랙션 이후)
  useEffect(() => {
    if (!musicData?.autoPlay || !isLoaded || mode !== 'view') return

    const handleInteraction = () => {
      if (isYoutube && iframeRef.current) {
        // 유튜브 iframe에 재생 메시지 전송
        iframeRef.current.contentWindow?.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          '*'
        )
        setIsPlaying(true)
      } else if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => console.log('Autoplay blocked'))
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
  }, [musicData?.autoPlay, isLoaded, isPlaying, isYoutube, mode])

  // 재생/정지 토글
  const togglePlay = useCallback(() => {
    if (!isLoaded) return

    if (isYoutube && iframeRef.current) {
      // 유튜브 iframe 제어
      const command = isPlaying ? 'pauseVideo' : 'playVideo'
      iframeRef.current.contentWindow?.postMessage(
        `{"event":"command","func":"${command}","args":""}`,
        '*'
      )
      setIsPlaying(!isPlaying)
    } else if (audioRef.current) {
      // 일반 오디오 제어
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.error('Play failed:', err))
      }
    }
  }, [isLoaded, isPlaying, isYoutube])

  // edit 모드에서는 항상 FAB 표시, 그 외에는 musicData 필요
  const showFab = mode === 'edit' || (musicData && audioUrl)
  if (!showFab) return null

  return (
    <>
      {/* 일반 오디오용 Hidden Audio Element */}
      {!isYoutube && <audio ref={audioRef} preload="auto" />}

      {/* 유튜브용 Hidden Iframe */}
      {isYoutube && youtubeVideoId && (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1&autoplay=0&loop=1&playlist=${youtubeVideoId}&controls=0`}
          style={{
            position: 'fixed',
            width: 1,
            height: 1,
            top: -9999,
            left: -9999,
            opacity: 0,
            pointerEvents: 'none',
          }}
          allow="autoplay; encrypted-media"
          title="BGM Player"
        />
      )}

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

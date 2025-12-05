'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { PrimitiveNode, BgmPlayerProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { getNodeProps, resolveDataBinding } from '../types'
import { getBgmById, getBgmCategories, bgmPresets } from '../../audio/bgm-presets'

export function BgmPlayer({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<BgmPlayerProps>(node)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // Props 기본값
  const autoplay = props.autoplay !== false
  const loop = props.loop !== false
  const volume = props.volume ?? 0.5
  const fadeIn = props.fadeIn ?? 1000
  const fadeOut = props.fadeOut ?? 500
  const showControls = props.showControls !== false
  const controlsPosition = props.controlsPosition || 'bottom-right'
  const controlsStyle = props.controlsStyle || 'minimal'

  // 오디오 소스 결정 (trackId 우선, 없으면 src)
  const getAudioSrc = (): string => {
    if (props.trackId) {
      const preset = getBgmById(props.trackId)
      return preset?.url || ''
    }
    if (props.src) {
      return resolveDataBinding(props.src, context.data) as string
    }
    return ''
  }

  const audioSrc = getAudioSrc()

  // Fade 볼륨 애니메이션
  const fadeVolume = useCallback(
    (targetVolume: number, duration: number, onComplete?: () => void) => {
      if (!audioRef.current) return

      const audio = audioRef.current
      const startVolume = audio.volume
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        if (audioRef.current) {
          audioRef.current.volume = startVolume + (targetVolume - startVolume) * progress
        }

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          onComplete?.()
        }
      }

      requestAnimationFrame(animate)
    },
    []
  )

  // 재생 시작 (fade in 포함)
  const play = useCallback(() => {
    if (!audioRef.current || !audioSrc) return

    audioRef.current.volume = 0
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true)
        fadeVolume(volume, fadeIn)
      })
      .catch((error) => {
        console.warn('BGM autoplay blocked:', error)
      })
  }, [audioSrc, volume, fadeIn, fadeVolume])

  // 일시정지 (fade out 포함)
  const pause = useCallback(() => {
    if (!audioRef.current) return

    fadeVolume(0, fadeOut, () => {
      audioRef.current?.pause()
      setIsPlaying(false)
    })
  }, [fadeOut, fadeVolume])

  // 토글
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, play, pause])

  // 첫 인터랙션 후 자동 재생
  useEffect(() => {
    if (context.mode === 'edit' || !autoplay || hasInteracted) return

    const handleInteraction = () => {
      setHasInteracted(true)
      play()
    }

    document.addEventListener('touchstart', handleInteraction, { once: true })
    document.addEventListener('click', handleInteraction, { once: true })

    return () => {
      document.removeEventListener('touchstart', handleInteraction)
      document.removeEventListener('click', handleInteraction)
    }
  }, [context.mode, autoplay, hasInteracted, play])

  // 스크롤 연동 볼륨 조절
  useEffect(() => {
    if (!props.syncWithScroll?.enabled || !audioRef.current || context.mode === 'edit') return

    const handleScroll = () => {
      if (!audioRef.current || !isPlaying) return

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0

      const startVolume = props.syncWithScroll?.startVolume ?? 1
      const endVolume = props.syncWithScroll?.endVolume ?? 0.3

      const currentVolume = startVolume + (endVolume - startVolume) * scrollProgress
      audioRef.current.volume = Math.max(0, Math.min(1, currentVolume * volume))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [props.syncWithScroll, isPlaying, volume, context.mode])

  // 컨트롤 위치 스타일
  const positionStyles: Record<string, React.CSSProperties> = {
    'top-right': { top: 16, right: 16 },
    'top-left': { top: 16, left: 16 },
    'bottom-right': { bottom: 16, right: 16 },
    'bottom-left': { bottom: 16, left: 16 },
  }

  // 편집 모드 플레이스홀더
  if (context.mode === 'edit') {
    const presetName = props.trackId ? getBgmById(props.trackId)?.name : null

    return (
      <div
        data-node-id={node.id}
        data-node-type="bgm-player"
        style={{
          padding: '12px 16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          outline: isSelected ? '2px solid #3b82f6' : undefined,
        }}
        onClick={(e) => {
          e.stopPropagation()
          context.onSelectNode?.(node.id)
        }}
      >
        <span style={{ fontSize: '20px' }}>🎵</span>
        <span style={{ fontSize: '14px', color: '#374151' }}>
          배경음악: {presetName || props.src || '미설정'}
        </span>
      </div>
    )
  }

  // 미니멀 스타일 컨트롤
  const MinimalControl = () => (
    <button
      onClick={togglePlay}
      aria-label={isPlaying ? '음악 일시정지' : '음악 재생'}
      style={{
        position: 'fixed',
        ...positionStyles[controlsPosition],
        zIndex: 9999,
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: 'none',
        background: 'rgba(0, 0, 0, 0.5)',
        color: '#fff',
        fontSize: '18px',
        cursor: 'pointer',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s, background 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)'
        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)'
      }}
    >
      {isPlaying ? '🔊' : '🔇'}
    </button>
  )

  // 바이닐 스타일 컨트롤
  const VinylControl = () => (
    <button
      onClick={togglePlay}
      aria-label={isPlaying ? '음악 일시정지' : '음악 재생'}
      style={{
        position: 'fixed',
        ...positionStyles[controlsPosition],
        zIndex: 9999,
        width: 56,
        height: 56,
        borderRadius: '50%',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        background: 'linear-gradient(145deg, #1a1a1a, #2d2d2d)',
        color: '#fff',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: isPlaying ? 'spin 3s linear infinite' : 'none',
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#1a1a1a',
          }}
        />
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  )

  return (
    <>
      <audio ref={audioRef} src={audioSrc} loop={loop} preload="metadata" />
      {showControls && (controlsStyle === 'vinyl' ? <VinylControl /> : <MinimalControl />)}
    </>
  )
}

export const bgmPlayerRenderer: PrimitiveRenderer<BgmPlayerProps> = {
  type: 'bgm-player',
  render: (node, context) => <BgmPlayer key={node.id} node={node} context={context} />,
  editableProps: [
    {
      key: 'trackId',
      label: '프리셋 BGM',
      type: 'select',
      options: [
        { value: '', label: '선택 안함' },
        ...bgmPresets.map((bgm) => ({
          value: bgm.id,
          label: `${bgm.name} (${getBgmCategories().find((c) => c.value === bgm.category)?.label})`,
        })),
      ],
      defaultValue: '',
    },
    {
      key: 'src',
      label: '커스텀 URL',
      type: 'text',
      defaultValue: '',
    },
    {
      key: 'volume',
      label: '볼륨 (0-1)',
      type: 'number',
      defaultValue: 0.5,
    },
    {
      key: 'autoplay',
      label: '자동 재생',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'loop',
      label: '반복 재생',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'fadeIn',
      label: '페이드 인 (ms)',
      type: 'number',
      defaultValue: 1000,
    },
    {
      key: 'syncWithScroll.enabled',
      label: '스크롤 연동 볼륨',
      type: 'boolean',
      defaultValue: false,
    },
    {
      key: 'showControls',
      label: '컨트롤 표시',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'controlsPosition',
      label: '버튼 위치',
      type: 'select',
      options: [
        { value: 'top-right', label: '우측 상단' },
        { value: 'top-left', label: '좌측 상단' },
        { value: 'bottom-right', label: '우측 하단' },
        { value: 'bottom-left', label: '좌측 하단' },
      ],
      defaultValue: 'bottom-right',
    },
    {
      key: 'controlsStyle',
      label: '컨트롤 스타일',
      type: 'select',
      options: [
        { value: 'minimal', label: '미니멀' },
        { value: 'vinyl', label: '바이닐' },
      ],
      defaultValue: 'minimal',
    },
  ],
}

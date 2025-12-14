'use client'

/**
 * Image Element - 이미지 요소
 *
 * 메인 사진, 갤러리 이미지 등 렌더링
 */

import { useState, useMemo, type CSSProperties } from 'react'
import Image from 'next/image'
import type { ElementStyle } from '../../schema/types'

// ============================================
// Types
// ============================================

export interface ImageElementProps {
  src?: string | null
  objectFit?: 'cover' | 'contain' | 'fill'
  overlay?: string
  style?: ElementStyle
  editable?: boolean
  className?: string
}

// ============================================
// Component
// ============================================

export function ImageElement({
  src,
  objectFit = 'cover',
  overlay,
  style,
  editable = false,
  className = '',
}: ImageElementProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // 컨테이너 스타일
  const containerStyle = useMemo<CSSProperties>(() => ({
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: isLoading ? 'var(--bg-section-alt)' : undefined,
  }), [isLoading])

  // 오버레이 스타일
  const overlayStyle = useMemo<CSSProperties | undefined>(() => {
    if (!overlay) return undefined
    return {
      position: 'absolute',
      inset: 0,
      backgroundColor: overlay,
      pointerEvents: 'none',
    }
  }, [overlay])

  if (!src || hasError) {
    return (
      <div
        className={`se2-image-element se2-image-element--empty ${className}`}
        style={containerStyle}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-section-alt)',
            color: 'var(--fg-muted)',
          }}
        >
          {editable ? (
            <span style={{ fontSize: '14px' }}>이미지를 선택하세요</span>
          ) : (
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`se2-image-element ${className}`}
      style={containerStyle}
    >
      <Image
        src={src}
        alt=""
        fill
        style={{ objectFit }}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        sizes="100vw"
      />

      {/* 오버레이 */}
      {overlay && <div style={overlayStyle} />}

      {/* 로딩 인디케이터 */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              border: '2px solid var(--border-default)',
              borderTopColor: 'var(--accent-default)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      )}
    </div>
  )
}

// ============================================
// Exports
// ============================================

export { ImageElement as default }

'use client'

/**
 * Map Element - 지도 요소
 *
 * NaverMap 컴포넌트를 사용한 지도 렌더링
 */

import { useMemo, type CSSProperties } from 'react'
import type { ElementStyle } from '../../schema/types'
import { NaverMap } from '@/lib/super-editor/primitives/content/NaverMap'

// ============================================
// Types
// ============================================

export interface MapElementProps {
  value?: unknown // 좌표 문자열 "lat,lng" 또는 주소
  zoom?: number
  showMarker?: boolean
  style?: ElementStyle
  className?: string
  /** 장소명 (NaverMap의 마커 타이틀에 사용) */
  name?: string
  /** 주소 (NaverMap 하단에 표시) */
  address?: string
}

interface Coordinates {
  lat: number
  lng: number
}

// ============================================
// Component
// ============================================

export function MapElement({
  value,
  zoom = 16,
  showMarker = true,
  style,
  className = '',
  name = '웨딩홀',
}: MapElementProps) {
  // 좌표 파싱
  const coordinates = useMemo<Coordinates | null>(() => {
    if (!value) return null

    const valueStr = String(value)

    // "lat,lng" 형식 체크
    if (valueStr.includes(',')) {
      const [latStr, lngStr] = valueStr.split(',')
      const lat = parseFloat(latStr.trim())
      const lng = parseFloat(lngStr.trim())

      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng }
      }
    }

    return null
  }, [value])

  const containerStyle = useMemo<CSSProperties>(() => ({
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: 'var(--bg-section-alt)',
    borderRadius: style?.border?.radius ?? 0,
    overflow: 'hidden',
  }), [style?.border?.radius])

  // 좌표가 없는 경우
  if (!coordinates) {
    return (
      <div
        className={`se2-map-element se2-map-element--empty ${className}`}
        style={containerStyle}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: 'var(--fg-muted)',
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span style={{ fontSize: '14px' }}>지도를 표시할 위치를 설정하세요</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`se2-map-element ${className}`}
      style={containerStyle}
    >
      <NaverMap
        lat={coordinates.lat}
        lng={coordinates.lng}
        name={name}
        zoom={zoom}
        showMarker={showMarker}
        height={280}
        navigationButtons={['kakao', 'naver', 'tmap']}
      />
    </div>
  )
}

// ============================================
// Exports
// ============================================

export { MapElement as default }

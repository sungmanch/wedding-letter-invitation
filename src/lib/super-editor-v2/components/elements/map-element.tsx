'use client'

/**
 * Map Element - 지도 요소
 *
 * NaverMap 컴포넌트를 사용한 지도 렌더링
 * binding: 'venue'로 VenueInfo 객체를 직접 받거나
 * value로 "lat,lng" 문자열을 받을 수 있음
 */

import { useMemo, type CSSProperties } from 'react'
import type { ElementStyle, VenueInfo } from '../../schema/types'
import { NaverMap } from './naver-map'

// ============================================
// Types
// ============================================

export interface MapElementProps {
  /** VenueInfo 객체 또는 좌표 문자열 "lat,lng" */
  value?: VenueInfo | string | unknown
  zoom?: number
  showMarker?: boolean
  style?: ElementStyle
  className?: string
}

interface Coordinates {
  lat: number
  lng: number
  name: string
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
}: MapElementProps) {
  // 좌표 파싱 (VenueInfo 객체 또는 문자열)
  const coordinates = useMemo<Coordinates | null>(() => {
    if (!value) return null

    // VenueInfo 객체인 경우 (binding: 'venue')
    if (typeof value === 'object' && value !== null) {
      const venue = value as VenueInfo
      if (venue.lat && venue.lng) {
        return {
          lat: venue.lat,
          lng: venue.lng,
          name: venue.name || '웨딩홀',
        }
      }
      // coordinates 필드가 있는 경우 (Legacy)
      if (venue.coordinates?.lat && venue.coordinates?.lng) {
        return {
          lat: venue.coordinates.lat,
          lng: venue.coordinates.lng,
          name: venue.name || '웨딩홀',
        }
      }
      return null
    }

    // 문자열인 경우 "lat,lng" 형식
    const valueStr = String(value)
    if (valueStr.includes(',')) {
      const [latStr, lngStr] = valueStr.split(',')
      const lat = parseFloat(latStr.trim())
      const lng = parseFloat(lngStr.trim())

      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng, name: '웨딩홀' }
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
        name={coordinates.name}
        zoom={zoom}
        showMarker={showMarker}
      />
    </div>
  )
}

// ============================================
// Exports
// ============================================

export { MapElement as default }

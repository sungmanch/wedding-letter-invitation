'use client'

/**
 * Map Element - 지도 요소
 *
 * 카카오맵/네이버맵 연동 지도 렌더링
 */

import { useEffect, useRef, useState, useMemo, type CSSProperties } from 'react'
import type { ElementStyle } from '../../schema/types'

// ============================================
// Types
// ============================================

export interface MapElementProps {
  value?: unknown // 좌표 문자열 "lat,lng" 또는 주소
  zoom?: number
  showMarker?: boolean
  style?: ElementStyle
  className?: string
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
  zoom = 15,
  showMarker = true,
  style,
  className = '',
}: MapElementProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)

  // 좌표 파싱
  useEffect(() => {
    if (!value) {
      setCoordinates(null)
      return
    }

    const valueStr = String(value)

    // "lat,lng" 형식 체크
    if (valueStr.includes(',')) {
      const [latStr, lngStr] = valueStr.split(',')
      const lat = parseFloat(latStr.trim())
      const lng = parseFloat(lngStr.trim())

      if (!isNaN(lat) && !isNaN(lng)) {
        setCoordinates({ lat, lng })
        return
      }
    }

    // TODO: 주소 → 좌표 변환 (Geocoding API)
    setCoordinates(null)
  }, [value])

  // 카카오맵 초기화
  useEffect(() => {
    if (!coordinates || !mapRef.current) return

    // 카카오맵 SDK가 로드되었는지 확인
    if (typeof window !== 'undefined' && (window as unknown as { kakao?: { maps?: unknown } }).kakao?.maps) {
      initializeKakaoMap()
      return
    }

    // SDK 로드 대기
    const checkKakao = setInterval(() => {
      if ((window as unknown as { kakao?: { maps?: unknown } }).kakao?.maps) {
        clearInterval(checkKakao)
        initializeKakaoMap()
      }
    }, 100)

    return () => clearInterval(checkKakao)

    function initializeKakaoMap() {
      const kakao = (window as unknown as { kakao: { maps: KakaoMaps } }).kakao

      const container = mapRef.current
      if (!container || !coordinates) return

      const options = {
        center: new kakao.maps.LatLng(coordinates.lat, coordinates.lng),
        level: Math.max(1, Math.min(14, 17 - zoom)), // zoom을 level로 변환
      }

      const map = new kakao.maps.Map(container, options)

      // 마커 추가
      if (showMarker) {
        const markerPosition = new kakao.maps.LatLng(coordinates.lat, coordinates.lng)
        new kakao.maps.Marker({
          position: markerPosition,
          map: map,
        })
      }

      setIsMapLoaded(true)
    }
  }, [coordinates, zoom, showMarker])

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
      {/* 카카오맵 컨테이너 */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />

      {/* 로딩 오버레이 */}
      {!isMapLoaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-section-alt)',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              border: '3px solid var(--border-default)',
              borderTopColor: 'var(--accent-default)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      )}

      {/* 지도 링크 버튼들 */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          right: 8,
          display: 'flex',
          gap: 8,
        }}
      >
        <MapLinkButton
          type="kakao"
          coordinates={coordinates}
        />
        <MapLinkButton
          type="naver"
          coordinates={coordinates}
        />
        <MapLinkButton
          type="tmap"
          coordinates={coordinates}
        />
      </div>
    </div>
  )
}

// ============================================
// Map Link Button
// ============================================

interface MapLinkButtonProps {
  type: 'kakao' | 'naver' | 'tmap'
  coordinates: Coordinates
}

function MapLinkButton({ type, coordinates }: MapLinkButtonProps) {
  const handleClick = () => {
    const { lat, lng } = coordinates

    switch (type) {
      case 'kakao':
        window.open(`https://map.kakao.com/link/map/${lat},${lng}`, '_blank')
        break
      case 'naver':
        window.open(`https://map.naver.com/v5/?c=${lng},${lat},15,0,0,0,dh`, '_blank')
        break
      case 'tmap':
        window.open(`https://apis.openapi.sk.com/tmap/app/routes?goalx=${lng}&goaly=${lat}`, '_blank')
        break
    }
  }

  const labels: Record<string, string> = {
    kakao: '카카오맵',
    naver: '네이버',
    tmap: 'T맵',
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        flex: 1,
        padding: '8px 4px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '12px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'background-color 0.2s',
      }}
    >
      {labels[type]}
    </button>
  )
}

// ============================================
// Kakao Maps Type Definition
// ============================================

interface KakaoMaps {
  LatLng: new (lat: number, lng: number) => unknown
  Map: new (container: HTMLElement, options: { center: unknown; level: number }) => unknown
  Marker: new (options: { position: unknown; map: unknown }) => unknown
}

// ============================================
// Exports
// ============================================

export { MapElement as default }

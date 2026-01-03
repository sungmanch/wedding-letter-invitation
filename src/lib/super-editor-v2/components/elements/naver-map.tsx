'use client'

/**
 * NaverMap - 네이버 지도 컴포넌트 (super-editor-v2)
 *
 * 기존 super-editor/primitives/content/NaverMap.tsx에서 이전
 * - 네비게이션 버튼을 제거하고 지도만 렌더링 (버튼은 block preset에서 별도 처리)
 * - height를 100%로 받아서 부모 컨테이너에 맞춤
 */

import { useEffect, useRef, useState, useCallback } from 'react'

export interface NaverMapProps {
  lat: number
  lng: number
  name: string
  zoom?: number
  showMarker?: boolean
  className?: string
  style?: React.CSSProperties
}

declare global {
  interface Window {
    naver: typeof naver
  }
}

const NAVER_MAP_SCRIPT_ID = 'naver-map-script'

function loadNaverMapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'))
      return
    }

    // 이미 로드된 경우
    if (window.naver?.maps) {
      resolve()
      return
    }

    // 이미 스크립트가 로딩 중인 경우
    const existingScript = document.getElementById(NAVER_MAP_SCRIPT_ID)
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve())
      existingScript.addEventListener('error', () =>
        reject(new Error('Failed to load Naver Map script'))
      )
      return
    }

    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID
    if (!clientId) {
      reject(new Error('NEXT_PUBLIC_NAVER_MAP_CLIENT_ID is not defined'))
      return
    }

    const script = document.createElement('script')
    script.id = NAVER_MAP_SCRIPT_ID
    script.type = 'text/javascript'
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`
    script.async = true

    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Naver Map script'))

    document.head.appendChild(script)
  })
}

export function NaverMap({
  lat,
  lng,
  name,
  zoom = 16,
  showMarker = true,
  className = '',
  style,
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<naver.maps.Map | null>(null)
  const markerRef = useRef<naver.maps.Marker | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.naver?.maps) return

    const location = new window.naver.maps.LatLng(lat, lng)

    const mapOptions: naver.maps.MapOptions = {
      center: location,
      zoom,
      zoomControl: true,
      zoomControlOptions: {
        style: window.naver.maps.ZoomControlStyle.SMALL,
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    }

    mapInstanceRef.current = new window.naver.maps.Map(mapRef.current, mapOptions)

    if (showMarker) {
      markerRef.current = new window.naver.maps.Marker({
        position: location,
        map: mapInstanceRef.current,
        title: name,
      })

      // 마커 클릭 시 지도 중심 이동
      window.naver.maps.Event.addListener(markerRef.current, 'click', () => {
        mapInstanceRef.current?.setCenter(location)
        mapInstanceRef.current?.setZoom(zoom)
      })
    }

    setIsLoading(false)
  }, [lat, lng, zoom, showMarker, name])

  useEffect(() => {
    loadNaverMapScript()
      .then(initializeMap)
      .catch((err) => {
        console.error('Naver Map error:', err)
        setError(err.message)
        setIsLoading(false)
      })

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
      }
      mapInstanceRef.current?.destroy()
    }
  }, [initializeMap])

  // lat, lng 변경 시 지도 업데이트
  useEffect(() => {
    if (mapInstanceRef.current && window.naver?.maps) {
      const location = new window.naver.maps.LatLng(lat, lng)
      mapInstanceRef.current.setCenter(location)

      if (markerRef.current) {
        markerRef.current.setPosition(location)
      }
    }
  }, [lat, lng])

  return (
    <div
      className={`se2-naver-map ${className}`}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f3f4f6',
        }}
      >
        {isLoading && (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="1.5"
              style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>지도 로딩 중...</span>
          </div>
        )}
        {error && (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '8px',
              color: '#ef4444',
            }}
          >
            <span style={{ fontSize: '14px' }}>지도를 불러올 수 없습니다</span>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default NaverMap

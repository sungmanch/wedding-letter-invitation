'use client'

/**
 * Super Editor v2 - Location Search Field
 *
 * 주소 검색 필드
 * - Daum Postcode 팝업으로 주소 검색
 * - VWorld Geocoding API로 좌표 변환
 */

import { useState, useCallback } from 'react'
import { useDaumPostcodePopup } from 'react-daum-postcode'
import { geocodeAddress } from '../../../../super-editor/actions'

// ============================================
// Types
// ============================================

export interface LocationSearchFieldProps {
  /** 현재 주소 값 */
  value: string
  /** 현재 위도 */
  lat?: number
  /** 현재 경도 */
  lng?: number
  /** 주소 + 좌표 한 번에 변경 콜백 (stale closure 방지용) */
  onLocationChange: (address: string, lat: number, lng: number) => void
  /** 비활성화 여부 */
  disabled?: boolean
  /** placeholder */
  placeholder?: string
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function LocationSearchField({
  value,
  lat: _lat,
  lng: _lng,
  onLocationChange,
  disabled = false,
  placeholder = '주소를 검색해주세요',
  className = '',
}: LocationSearchFieldProps) {
  // lat, lng are passed for potential future use (e.g., showing current coords)
  void _lat
  void _lng
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Daum 우편번호 팝업
  const openPostcode = useDaumPostcodePopup()

  const handleAddressSearch = useCallback(() => {
    if (disabled) return

    openPostcode({
      onComplete: async (data) => {
        // 도로명주소 우선, 없으면 지번주소
        const address = data.roadAddress || data.jibunAddress

        setError(null)
        setIsGeocoding(true)

        try {
          // 좌표 변환 (서버 액션)
          const result = await geocodeAddress(address)

          if (result.success && result.lat && result.lng) {
            // 주소와 좌표를 한 번에 업데이트 (stale closure 방지)
            onLocationChange(address, result.lat, result.lng)
          } else {
            setError(result.error || '좌표 변환에 실패했습니다')
          }
        } catch (err) {
          console.error('Geocoding error:', err)
          setError('좌표 변환 중 오류가 발생했습니다')
        } finally {
          setIsGeocoding(false)
        }
      },
    })
  }, [openPostcode, onLocationChange, disabled])

  return (
    <div className={`space-y-2 ${className}`}>
      {/* 주소 입력 + 검색 버튼 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          readOnly
          placeholder={placeholder}
          disabled={disabled}
          onClick={!disabled ? handleAddressSearch : undefined}
          className="flex-1 px-3 py-2 bg-white border border-[var(--sand-100)] rounded-lg text-[var(--text-primary)] text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--sage-500)] disabled:cursor-not-allowed disabled:bg-gray-50"
        />
        <button
          type="button"
          onClick={handleAddressSearch}
          disabled={disabled || isGeocoding}
          className="px-4 py-2 bg-[var(--sage-500)] text-white rounded-lg hover:bg-[var(--sage-600)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap text-sm font-medium transition-colors"
        >
          {isGeocoding ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              변환 중
            </>
          ) : (
            <>
              <SearchIcon className="w-4 h-4" />
              주소 검색
            </>
          )}
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}

    </div>
  )
}

// ============================================
// Icons
// ============================================

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

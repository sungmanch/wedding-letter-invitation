'use client'

import { useState, useCallback } from 'react'
import { useDaumPostcodePopup } from 'react-daum-postcode'
import type { LocationField as LocationFieldType } from '../../schema/editor'
import { useSuperEditor } from '../../context'
import { geocodeAddress } from '../../actions'

interface LocationFieldProps {
  field: LocationFieldType
}

interface VenueData {
  address?: string
  lat?: number
  lng?: number
}

export function LocationField({ field }: LocationFieldProps) {
  const { getFieldValue, updateField } = useSuperEditor()
  const venueData = getFieldValue(field.dataPath) as VenueData | undefined
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Daum 우편번호 팝업
  const openPostcode = useDaumPostcodePopup()

  const handleAddressSearch = useCallback(() => {
    openPostcode({
      onComplete: async (data) => {
        // 도로명주소 우선, 없으면 지번주소
        const address = data.roadAddress || data.jibunAddress

        // 주소 업데이트
        updateField(field.dataPath, {
          ...venueData,
          address,
        })

        setError(null)
        setIsGeocoding(true)

        try {
          // 좌표 변환 (서버 액션)
          const result = await geocodeAddress(address)

          if (result.success && result.lat && result.lng) {
            updateField(field.dataPath, {
              ...venueData,
              address,
              lat: result.lat,
              lng: result.lng,
            })
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
  }, [openPostcode, updateField, field.dataPath, venueData])

  const openMap = useCallback(() => {
    if (!venueData?.lat || !venueData?.lng) return

    const provider = field.mapProvider ?? 'naver'
    let url = ''

    switch (provider) {
      case 'kakao':
        url = `https://map.kakao.com/link/map/${venueData.lat},${venueData.lng}`
        break
      case 'naver':
        url = `https://map.naver.com/v5/?c=${venueData.lng},${venueData.lat},15,0,0,0,dh`
        break
      case 'google':
        url = `https://www.google.com/maps?q=${venueData.lat},${venueData.lng}`
        break
    }

    if (url) window.open(url, '_blank')
  }, [venueData, field.mapProvider])

  return (
    <div className="field-wrapper">
      {field.label && (
        <label className="block text-sm font-medium text-[#F5E6D3]/80 mb-2">
          {field.label}
          {field.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* 주소 입력 + 검색 버튼 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={venueData?.address ?? ''}
          readOnly
          placeholder="주소를 검색해주세요"
          disabled={field.disabled}
          className="flex-1 px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 cursor-pointer disabled:cursor-not-allowed disabled:bg-white/[0.02]"
          onClick={!field.disabled ? handleAddressSearch : undefined}
        />
        <button
          type="button"
          onClick={handleAddressSearch}
          disabled={field.disabled || isGeocoding}
          className="px-4 py-2 bg-[#C9A962]/20 text-[#C9A962] rounded-lg hover:bg-[#C9A962]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              주소 검색
            </>
          )}
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}

      {/* 좌표 변환 성공 표시 + 지도 열기 */}
      {venueData?.lat && venueData?.lng && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-[#F5E6D3]/50">
            좌표: {venueData.lat.toFixed(6)}, {venueData.lng.toFixed(6)}
          </span>
          <button
            type="button"
            onClick={openMap}
            className="text-sm text-[#C9A962] hover:text-[#B8A052] flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            지도에서 확인
          </button>
        </div>
      )}

      {field.helpText && (
        <p className="mt-2 text-sm text-[#F5E6D3]/50">{field.helpText}</p>
      )}
    </div>
  )
}

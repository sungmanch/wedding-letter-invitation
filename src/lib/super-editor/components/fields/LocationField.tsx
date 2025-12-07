'use client'

import { useState, useCallback } from 'react'
import type { LocationField as LocationFieldType } from '../../schema/editor'
import { useSuperEditor } from '../../context'

interface LocationFieldProps {
  field: LocationFieldType
}

interface Coordinates {
  lat: number
  lng: number
}

export function LocationField({ field }: LocationFieldProps) {
  const { getFieldValue, updateField } = useSuperEditor()
  const coordinates = getFieldValue(field.dataPath) as Coordinates | undefined
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleLatChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const lat = parseFloat(e.target.value) || 0
      updateField(field.dataPath, { ...coordinates, lat })
    },
    [coordinates, field.dataPath, updateField]
  )

  const handleLngChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const lng = parseFloat(e.target.value) || 0
      updateField(field.dataPath, { ...coordinates, lng })
    },
    [coordinates, field.dataPath, updateField]
  )

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      // 카카오맵 API를 통한 주소 검색 (실제 구현 시 API 키 필요)
      // 여기서는 placeholder로 구현
      console.log('Searching for:', searchQuery)
      // TODO: 실제 지오코딩 API 호출
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }, [searchQuery])

  const openMap = useCallback(() => {
    if (!coordinates?.lat || !coordinates?.lng) return

    const provider = field.mapProvider ?? 'kakao'
    let url = ''

    switch (provider) {
      case 'kakao':
        url = `https://map.kakao.com/link/map/${coordinates.lat},${coordinates.lng}`
        break
      case 'naver':
        url = `https://map.naver.com/v5/?c=${coordinates.lng},${coordinates.lat},15,0,0,0,dh`
        break
      case 'google':
        url = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`
        break
    }

    if (url) window.open(url, '_blank')
  }, [coordinates, field.mapProvider])

  return (
    <div className="field-wrapper">
      {field.label && (
        <label className="block text-sm font-medium text-[#F5E6D3]/80 mb-2">
          {field.label}
          {field.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* 주소 검색 */}
      {field.searchEnabled && (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="주소를 검색하세요"
            className="flex-1 px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962]/30"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={isSearching}
            className="px-4 py-2 bg-white/10 text-[#F5E6D3] rounded-lg hover:bg-white/20 disabled:opacity-50"
          >
            {isSearching ? '검색 중...' : '검색'}
          </button>
        </div>
      )}

      {/* 좌표 입력 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#F5E6D3]/50 mb-1">위도 (Latitude)</label>
          <input
            type="number"
            step="any"
            value={coordinates?.lat ?? ''}
            onChange={handleLatChange}
            placeholder="37.5665"
            disabled={field.disabled}
            className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962]/30 disabled:bg-white/[0.02]"
          />
        </div>
        <div>
          <label className="block text-xs text-[#F5E6D3]/50 mb-1">경도 (Longitude)</label>
          <input
            type="number"
            step="any"
            value={coordinates?.lng ?? ''}
            onChange={handleLngChange}
            placeholder="126.9780"
            disabled={field.disabled}
            className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962]/30 disabled:bg-white/[0.02]"
          />
        </div>
      </div>

      {/* 지도 열기 버튼 */}
      {coordinates?.lat && coordinates?.lng && (
        <button
          type="button"
          onClick={openMap}
          className="mt-2 text-sm text-[#C9A962] hover:text-[#B8A052] flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          지도에서 확인
        </button>
      )}

      {field.helpText && (
        <p className="mt-2 text-sm text-[#F5E6D3]/50">{field.helpText}</p>
      )}
    </div>
  )
}

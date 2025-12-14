'use client'

/**
 * Super Editor v2 - Address Field
 *
 * 주소 입력 필드
 * - 장소명 + 도로명주소 + 상세주소
 * - 지도 보기 버튼
 * - 카카오/네이버 지도 연동
 */

import { useCallback, type ChangeEvent } from 'react'
import type { VariablePath } from '../../../schema/types'

// ============================================
// Types
// ============================================

export interface AddressInfo {
  /** 장소명 (예: 더 웨딩컨벤션) */
  name: string
  /** 도로명 주소 */
  address: string
  /** 상세 주소 (층, 홀 등) */
  detail: string
  /** 위도 */
  lat?: number
  /** 경도 */
  lng?: number
}

export interface AddressFieldProps {
  /** 필드 ID */
  id: string
  /** 라벨 */
  label: string
  /** 바인딩 경로 */
  binding: VariablePath
  /** 현재 값 */
  value: AddressInfo
  /** 변경 콜백 */
  onChange: (value: AddressInfo) => void
  /** 도움말 텍스트 */
  helpText?: string
  /** 필수 여부 */
  required?: boolean
  /** 비활성화 여부 */
  disabled?: boolean
  /** 지도 버튼 표시 */
  showMapButtons?: boolean
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function AddressField({
  id,
  label,
  binding,
  value,
  onChange,
  helpText,
  required = false,
  disabled = false,
  showMapButtons = true,
  className = '',
}: AddressFieldProps) {
  // 필드 변경 핸들러
  const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, name: e.target.value })
  }, [value, onChange])

  const handleAddressChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, address: e.target.value })
  }, [value, onChange])

  const handleDetailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, detail: e.target.value })
  }, [value, onChange])

  // 지도 열기
  const openKakaoMap = useCallback(() => {
    const query = encodeURIComponent(value.address || value.name)
    if (value.lat && value.lng) {
      window.open(`https://map.kakao.com/link/map/${value.name},${value.lat},${value.lng}`, '_blank')
    } else {
      window.open(`https://map.kakao.com/link/search/${query}`, '_blank')
    }
  }, [value])

  const openNaverMap = useCallback(() => {
    const query = encodeURIComponent(value.address || value.name)
    if (value.lat && value.lng) {
      window.open(`https://map.naver.com/v5/search/${query}?c=${value.lng},${value.lat},15,0,0,0,dh`, '_blank')
    } else {
      window.open(`https://map.naver.com/v5/search/${query}`, '_blank')
    }
  }, [value])

  const hasAddress = value.name || value.address

  const inputClassName = `
    w-full px-3 py-2 border border-white/10 rounded-lg
    bg-white/5 text-[#F5E6D3] placeholder:text-[#F5E6D3]/40
    focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962]/30 focus:outline-none
    disabled:bg-white/[0.02] disabled:cursor-not-allowed disabled:text-[#F5E6D3]/50
    transition-colors
  `

  return (
    <div className={`field-wrapper ${className}`}>
      {/* 라벨 */}
      <label className="block text-sm font-medium text-[#F5E6D3]/80 mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {/* 주소 입력 */}
      <div className="space-y-2">
        {/* 장소명 */}
        <input
          id={`${id}-name`}
          type="text"
          value={value.name}
          onChange={handleNameChange}
          placeholder="장소명 (예: 더 웨딩컨벤션)"
          disabled={disabled}
          className={inputClassName}
        />

        {/* 도로명 주소 */}
        <input
          id={`${id}-address`}
          type="text"
          value={value.address}
          onChange={handleAddressChange}
          placeholder="도로명 주소"
          disabled={disabled}
          className={inputClassName}
        />

        {/* 상세 주소 */}
        <input
          id={`${id}-detail`}
          type="text"
          value={value.detail}
          onChange={handleDetailChange}
          placeholder="상세 주소 (층, 홀 등)"
          disabled={disabled}
          className={inputClassName}
        />
      </div>

      {/* 지도 버튼 */}
      {showMapButtons && hasAddress && (
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={openKakaoMap}
            disabled={disabled}
            className="
              flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg
              bg-[#FEE500]/20 text-[#3C1E1E] hover:bg-[#FEE500]/30
              transition-colors font-medium text-sm
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <KakaoMapIcon className="w-4 h-4" />
            카카오맵
          </button>
          <button
            type="button"
            onClick={openNaverMap}
            disabled={disabled}
            className="
              flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg
              bg-[#03C75A]/20 text-[#03C75A] hover:bg-[#03C75A]/30
              transition-colors font-medium text-sm
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <NaverMapIcon className="w-4 h-4" />
            네이버지도
          </button>
        </div>
      )}

      {/* 도움말 */}
      {helpText && (
        <p className="mt-1 text-xs text-[#F5E6D3]/50">{helpText}</p>
      )}
    </div>
  )
}

// ============================================
// Icons
// ============================================

function KakaoMapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
    </svg>
  )
}

function NaverMapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  )
}

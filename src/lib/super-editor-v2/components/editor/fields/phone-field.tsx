'use client'

/**
 * Super Editor v2 - Phone Field
 *
 * 전화번호 입력 필드
 * - 자동 하이픈 포맷팅
 * - 전화 걸기 버튼
 */

import { useCallback, useMemo, type ChangeEvent } from 'react'
import type { VariablePath } from '../../../schema/types'

// ============================================
// Types
// ============================================

export interface PhoneFieldProps {
  /** 필드 ID */
  id: string
  /** 라벨 */
  label: string
  /** 바인딩 경로 */
  binding: VariablePath
  /** 현재 값 */
  value: string
  /** 변경 콜백 */
  onChange: (value: string) => void
  /** 플레이스홀더 */
  placeholder?: string
  /** 도움말 텍스트 */
  helpText?: string
  /** 필수 여부 */
  required?: boolean
  /** 비활성화 여부 */
  disabled?: boolean
  /** 전화 걸기 버튼 표시 */
  showCallButton?: boolean
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function PhoneField({
  id,
  label,
  binding,
  value,
  onChange,
  placeholder = '010-0000-0000',
  helpText,
  required = false,
  disabled = false,
  showCallButton = true,
  className = '',
}: PhoneFieldProps) {
  // 포맷팅된 값
  const formattedValue = useMemo(() => formatPhoneNumber(value), [value])

  // 입력 처리 (숫자만 추출 후 포맷팅)
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    // 숫자만 추출
    const numbers = input.replace(/[^0-9]/g, '')
    // 최대 11자리
    const trimmed = numbers.slice(0, 11)
    // 포맷팅하여 저장
    onChange(formatPhoneNumber(trimmed))
  }, [onChange])

  // 전화 걸기
  const handleCall = useCallback(() => {
    const numbers = value.replace(/[^0-9]/g, '')
    if (numbers.length >= 10) {
      window.location.href = `tel:${numbers}`
    }
  }, [value])

  // 유효한 전화번호인지 확인
  const isValidPhone = useMemo(() => {
    const numbers = value.replace(/[^0-9]/g, '')
    return numbers.length >= 10
  }, [value])

  return (
    <div className={`field-wrapper ${className}`}>
      {/* 라벨 */}
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[#F5E6D3]/80 mb-1"
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {/* 입력 영역 */}
      <div className="flex gap-2">
        <input
          id={id}
          type="tel"
          value={formattedValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="tel"
          className={`
            flex-1 px-3 py-2 border border-white/10 rounded-lg
            bg-white/5 text-[#F5E6D3] placeholder:text-[#F5E6D3]/40
            focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962]/30 focus:outline-none
            disabled:bg-white/[0.02] disabled:cursor-not-allowed disabled:text-[#F5E6D3]/50
            transition-colors
          `}
        />

        {/* 전화 걸기 버튼 */}
        {showCallButton && (
          <button
            type="button"
            onClick={handleCall}
            disabled={disabled || !isValidPhone}
            className={`
              px-3 py-2 rounded-lg transition-colors
              ${isValidPhone && !disabled
                ? 'bg-[#C9A962]/20 text-[#C9A962] hover:bg-[#C9A962]/30'
                : 'bg-white/5 text-[#F5E6D3]/30 cursor-not-allowed'
              }
            `}
            title="전화 걸기"
          >
            <PhoneIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 도움말 */}
      {helpText && (
        <p className="mt-1 text-xs text-[#F5E6D3]/50">{helpText}</p>
      )}
    </div>
  )
}

// ============================================
// Helper Functions
// ============================================

function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/[^0-9]/g, '')

  if (numbers.length <= 3) {
    return numbers
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
  } else if (numbers.length <= 10) {
    // 02-xxxx-xxxx 형식 (서울)
    if (numbers.startsWith('02')) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`
    }
    // 0xx-xxx-xxxx 형식
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`
  } else {
    // 010-xxxx-xxxx 형식
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }
}

// ============================================
// Icons
// ============================================

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  )
}

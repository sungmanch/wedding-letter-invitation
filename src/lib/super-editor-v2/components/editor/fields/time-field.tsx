'use client'

/**
 * Super Editor v2 - Time Field
 *
 * 시간 선택 필드
 * - 네이티브 time input + 한글 시간 표시
 */

import { useCallback, useMemo, type ChangeEvent } from 'react'
import type { VariablePath } from '../../../schema/types'

// ============================================
// Types
// ============================================

export interface TimeFieldProps {
  /** 필드 ID */
  id: string
  /** 라벨 */
  label: string
  /** 바인딩 경로 */
  binding: VariablePath
  /** 현재 값 (HH:mm) */
  value: string
  /** 변경 콜백 */
  onChange: (value: string) => void
  /** 도움말 텍스트 */
  helpText?: string
  /** 필수 여부 */
  required?: boolean
  /** 비활성화 여부 */
  disabled?: boolean
  /** 한글 시간 표시 여부 */
  showKoreanTime?: boolean
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function TimeField({
  id,
  label,
  binding,
  value,
  onChange,
  helpText,
  required = false,
  disabled = false,
  showKoreanTime = true,
  className = '',
}: TimeFieldProps) {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }, [onChange])

  // 한글 시간 포맷
  const koreanTime = useMemo(() => {
    if (!value) return null
    return formatKoreanTime(value)
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

      {/* 시간 입력 */}
      <input
        id={id}
        type="time"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border border-white/10 rounded-lg
          bg-white/5 text-[#F5E6D3]
          focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962]/30 focus:outline-none
          disabled:bg-white/[0.02] disabled:cursor-not-allowed disabled:text-[#F5E6D3]/50
          transition-colors
          [&::-webkit-calendar-picker-indicator]:invert
          [&::-webkit-calendar-picker-indicator]:opacity-50
          [&::-webkit-calendar-picker-indicator]:hover:opacity-100
        `}
      />

      {/* 한글 시간 표시 */}
      {value && showKoreanTime && koreanTime && (
        <p className="mt-2 px-1 text-sm text-[#C9A962]">{koreanTime}</p>
      )}

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

function formatKoreanTime(timeStr: string): string {
  const [hoursStr, minutesStr] = timeStr.split(':')
  const hours = parseInt(hoursStr, 10)
  const minutes = parseInt(minutesStr, 10)

  if (isNaN(hours)) return timeStr

  const period = hours < 12 ? '오전' : '오후'
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours

  if (minutes === 0) {
    return `${period} ${displayHours}시`
  }
  return `${period} ${displayHours}시 ${minutes}분`
}

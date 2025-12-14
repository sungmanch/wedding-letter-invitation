'use client'

/**
 * Super Editor v2 - Date Field
 *
 * 날짜 선택 필드
 * - 네이티브 date input + 한글 날짜 표시
 * - 요일 자동 계산
 */

import { useCallback, useMemo, type ChangeEvent } from 'react'
import type { VariablePath } from '../../../schema/types'

// ============================================
// Types
// ============================================

export interface DateFieldProps {
  /** 필드 ID */
  id: string
  /** 라벨 */
  label: string
  /** 바인딩 경로 */
  binding: VariablePath
  /** 현재 값 (ISO 8601: YYYY-MM-DD) */
  value: string
  /** 변경 콜백 */
  onChange: (value: string) => void
  /** 도움말 텍스트 */
  helpText?: string
  /** 필수 여부 */
  required?: boolean
  /** 비활성화 여부 */
  disabled?: boolean
  /** 최소 날짜 */
  min?: string
  /** 최대 날짜 */
  max?: string
  /** 한글 날짜 표시 여부 */
  showKoreanDate?: boolean
  /** D-day 표시 여부 */
  showDday?: boolean
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function DateField({
  id,
  label,
  binding,
  value,
  onChange,
  helpText,
  required = false,
  disabled = false,
  min,
  max,
  showKoreanDate = true,
  showDday = true,
  className = '',
}: DateFieldProps) {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }, [onChange])

  // 한글 날짜 포맷
  const koreanDate = useMemo(() => {
    if (!value) return null
    return formatKoreanDate(value)
  }, [value])

  // D-day 계산
  const dday = useMemo(() => {
    if (!value) return null
    return calculateDday(value)
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

      {/* 날짜 입력 */}
      <input
        id={id}
        type="date"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        min={min}
        max={max}
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

      {/* 한글 날짜 & D-day 표시 */}
      {value && (showKoreanDate || showDday) && (
        <div className="flex items-center justify-between mt-2 px-1">
          {showKoreanDate && koreanDate && (
            <p className="text-sm text-[#C9A962]">{koreanDate}</p>
          )}
          {showDday && dday && (
            <p className={`text-sm font-medium ${
              dday.days === 0 ? 'text-[#C9A962]' :
              dday.days > 0 ? 'text-[#F5E6D3]/70' : 'text-[#F5E6D3]/50'
            }`}>
              {dday.text}
            </p>
          )}
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
// Helper Functions
// ============================================

const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토']

function formatKoreanDate(dateStr: string): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dayOfWeek = DAYS_OF_WEEK[date.getDay()]

  return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`
}

function calculateDday(dateStr: string): { days: number; text: string } | null {
  const targetDate = new Date(dateStr)
  const today = new Date()

  // 시간 제거
  targetDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return { days: 0, text: 'D-Day' }
  } else if (diffDays > 0) {
    return { days: diffDays, text: `D-${diffDays}` }
  } else {
    return { days: diffDays, text: `D+${Math.abs(diffDays)}` }
  }
}

'use client'

/**
 * Super Editor v2 - Text Field
 *
 * 텍스트 입력 필드 (단일 줄, 여러 줄)
 */

import { useCallback, useState, type ChangeEvent } from 'react'
import type { VariablePath } from '../../../schema/types'

// ============================================
// Types
// ============================================

export interface TextFieldProps {
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
  /** 여러 줄 입력 */
  multiline?: boolean
  /** 줄 수 (multiline일 때) */
  rows?: number
  /** 최대 길이 */
  maxLength?: number
  /** 최소 길이 */
  minLength?: number
  /** 접두사 */
  prefix?: string
  /** 접미사 */
  suffix?: string
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function TextField({
  id,
  label,
  binding,
  value,
  onChange,
  placeholder,
  helpText,
  required = false,
  disabled = false,
  multiline = false,
  rows = 3,
  maxLength,
  minLength,
  prefix,
  suffix,
  className = '',
}: TextFieldProps) {
  const [focused, setFocused] = useState(false)

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }, [onChange])

  const inputClassName = `
    w-full px-3 py-2 border border-white/10 rounded-lg
    bg-white/5 text-[#F5E6D3] placeholder:text-[#F5E6D3]/40
    focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962]/30 focus:outline-none
    disabled:bg-white/[0.02] disabled:cursor-not-allowed disabled:text-[#F5E6D3]/50
    transition-colors
    ${prefix ? 'pl-8' : ''}
    ${suffix ? 'pr-8' : ''}
  `

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
      <div className="relative">
        {/* 접두사 */}
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F5E6D3]/40 text-sm">
            {prefix}
          </span>
        )}

        {multiline ? (
          <textarea
            id={id}
            value={value}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            minLength={minLength}
            className={`${inputClassName} resize-none`}
          />
        ) : (
          <input
            id={id}
            type="text"
            value={value}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            minLength={minLength}
            className={inputClassName}
          />
        )}

        {/* 접미사 */}
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F5E6D3]/40 text-sm">
            {suffix}
          </span>
        )}
      </div>

      {/* 도움말 / 글자 수 */}
      <div className="flex items-center justify-between mt-1">
        {helpText && (
          <p className="text-xs text-[#F5E6D3]/50">{helpText}</p>
        )}
        {maxLength && (
          <p className={`text-xs ${value.length >= maxLength ? 'text-red-400' : 'text-[#F5E6D3]/40'}`}>
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
}

// ============================================
// Textarea Field (Alias)
// ============================================

export interface TextareaFieldProps extends Omit<TextFieldProps, 'multiline'> {
  rows?: number
}

export function TextareaField(props: TextareaFieldProps) {
  return <TextField {...props} multiline rows={props.rows ?? 3} />
}

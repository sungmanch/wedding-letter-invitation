'use client'

/**
 * Super Editor v2 - Account Field
 *
 * 계좌 정보 입력 필드
 * - 은행 선택 + 계좌번호 + 예금주
 * - 계좌번호 복사 버튼
 */

import { useCallback, useState, type ChangeEvent } from 'react'
import type { VariablePath } from '../../../schema/types'

// ============================================
// Types
// ============================================

export interface AccountInfo {
  bank: string
  number: string
  holder: string
}

export interface AccountFieldProps {
  /** 필드 ID */
  id: string
  /** 라벨 */
  label: string
  /** 바인딩 경로 */
  binding: VariablePath
  /** 현재 값 */
  value: AccountInfo
  /** 변경 콜백 */
  onChange: (value: AccountInfo) => void
  /** 도움말 텍스트 */
  helpText?: string
  /** 필수 여부 */
  required?: boolean
  /** 비활성화 여부 */
  disabled?: boolean
  /** 복사 버튼 표시 */
  showCopyButton?: boolean
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function AccountField({
  id,
  label,
  binding,
  value,
  onChange,
  helpText,
  required = false,
  disabled = false,
  showCopyButton = true,
  className = '',
}: AccountFieldProps) {
  const [copySuccess, setCopySuccess] = useState(false)

  // 개별 필드 변경
  const handleBankChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, bank: e.target.value })
  }, [value, onChange])

  const handleNumberChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    // 숫자와 하이픈만 허용
    const cleaned = e.target.value.replace(/[^0-9-]/g, '')
    onChange({ ...value, number: cleaned })
  }, [value, onChange])

  const handleHolderChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, holder: e.target.value })
  }, [value, onChange])

  // 계좌번호 복사
  const handleCopy = useCallback(async () => {
    const text = `${value.bank} ${value.number} (${value.holder})`
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }, [value])

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

      {/* 계좌 정보 입력 */}
      <div className="space-y-2">
        {/* 은행 선택 */}
        <select
          id={`${id}-bank`}
          value={value.bank}
          onChange={handleBankChange}
          disabled={disabled}
          className={`${inputClassName} appearance-none`}
        >
          <option value="">은행 선택</option>
          {KOREAN_BANKS.map(bank => (
            <option key={bank} value={bank}>{bank}</option>
          ))}
        </select>

        {/* 계좌번호 */}
        <input
          id={`${id}-number`}
          type="text"
          value={value.number}
          onChange={handleNumberChange}
          placeholder="계좌번호"
          disabled={disabled}
          className={inputClassName}
        />

        {/* 예금주 */}
        <input
          id={`${id}-holder`}
          type="text"
          value={value.holder}
          onChange={handleHolderChange}
          placeholder="예금주"
          disabled={disabled}
          className={inputClassName}
        />
      </div>

      {/* 복사 버튼 */}
      {showCopyButton && value.bank && value.number && value.holder && (
        <button
          type="button"
          onClick={handleCopy}
          disabled={disabled}
          className={`
            mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg
            transition-colors
            ${copySuccess
              ? 'bg-green-500/20 text-green-400'
              : 'bg-[#C9A962]/10 text-[#C9A962] hover:bg-[#C9A962]/20'
            }
          `}
        >
          {copySuccess ? (
            <>
              <CheckIcon className="w-4 h-4" />
              복사되었습니다
            </>
          ) : (
            <>
              <CopyIcon className="w-4 h-4" />
              계좌번호 복사
            </>
          )}
        </button>
      )}

      {/* 도움말 */}
      {helpText && (
        <p className="mt-1 text-xs text-[#F5E6D3]/50">{helpText}</p>
      )}
    </div>
  )
}

// ============================================
// Constants
// ============================================

const KOREAN_BANKS = [
  '국민은행',
  '신한은행',
  '우리은행',
  '하나은행',
  'NH농협은행',
  '기업은행',
  'SC제일은행',
  '씨티은행',
  '카카오뱅크',
  '케이뱅크',
  '토스뱅크',
  '새마을금고',
  '신협',
  '우체국',
  '경남은행',
  '광주은행',
  '대구은행',
  '부산은행',
  '전북은행',
  '제주은행',
  '수협은행',
]

// ============================================
// Icons
// ============================================

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

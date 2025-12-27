'use client'

/**
 * Super Editor v2 - Edit Mode Toggle
 *
 * 폼 모드 / 직접 편집 모드 전환 토글
 * - form: 데이터 입력 + AI 프롬프트
 * - direct: 드래그/리사이즈/회전
 */

import { type ReactNode } from 'react'

// ============================================
// Types
// ============================================

export type EditMode = 'form' | 'direct'

export interface EditModeToggleProps {
  /** 현재 모드 */
  mode: EditMode
  /** 모드 변경 콜백 */
  onChange: (mode: EditMode) => void
  /** 비활성화 */
  disabled?: boolean
  /** 크기 */
  size?: 'sm' | 'md' | 'lg'
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function EditModeToggle({
  mode,
  onChange,
  disabled = false,
  size = 'md',
  className = '',
}: EditModeToggleProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  return (
    <div
      className={`
        inline-flex items-center rounded-lg border border-[var(--sand-100)] overflow-hidden
        bg-white
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
        ${className}
      `}
    >
      <ModeButton
        active={mode === 'form'}
        onClick={() => onChange('form')}
        disabled={disabled}
        size={sizeClasses[size]}
        icon={<FormIcon className="w-4 h-4" />}
        label="폼"
        tooltip="폼 모드: 데이터 입력 + AI 프롬프트"
      />
      <ModeButton
        active={mode === 'direct'}
        onClick={() => onChange('direct')}
        disabled={disabled}
        size={sizeClasses[size]}
        icon={<DirectIcon className="w-4 h-4" />}
        label="편집"
        tooltip="편집 모드: 드래그/리사이즈/회전"
      />
    </div>
  )
}

// ============================================
// Mode Button
// ============================================

interface ModeButtonProps {
  active: boolean
  onClick: () => void
  disabled: boolean
  size: string
  icon: ReactNode
  label: string
  tooltip: string
}

function ModeButton({
  active,
  onClick,
  disabled,
  size,
  icon,
  label,
  tooltip,
}: ModeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`
        flex items-center gap-1.5 transition-colors
        ${size}
        ${active
          ? 'bg-[var(--sage-500)] text-white font-medium'
          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--sage-50)]'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

// ============================================
// Compact Toggle (아이콘만)
// ============================================

export interface CompactModeToggleProps {
  mode: EditMode
  onChange: (mode: EditMode) => void
  disabled?: boolean
  className?: string
}

export function CompactModeToggle({
  mode,
  onChange,
  disabled = false,
  className = '',
}: CompactModeToggleProps) {
  return (
    <div
      className={`
        inline-flex items-center gap-1 p-1 rounded-lg
        bg-[var(--sand-100)] border border-[var(--sand-200)]
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
        ${className}
      `}
    >
      <button
        type="button"
        onClick={() => onChange('form')}
        disabled={disabled}
        title="폼 모드"
        className={`
          p-1.5 rounded transition-colors
          ${mode === 'form'
            ? 'bg-[var(--sage-500)] text-white'
            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--sage-100)]'
          }
        `}
      >
        <FormIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange('direct')}
        disabled={disabled}
        title="편집 모드"
        className={`
          p-1.5 rounded transition-colors
          ${mode === 'direct'
            ? 'bg-[var(--sage-500)] text-white'
            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--sage-100)]'
          }
        `}
      >
        <DirectIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

// ============================================
// Icons
// ============================================

function FormIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  )
}

function DirectIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
      />
    </svg>
  )
}

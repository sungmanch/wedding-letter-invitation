'use client'

/**
 * BasicInfoForm - Stage 1: 기본 정보 입력 폼
 * 신랑/신부 이름, 예식 날짜/시간, 예식장 이름
 */

import { useState, useMemo } from 'react'
import { ArrowRight } from 'lucide-react'

export interface BasicInfoData {
  groomName: string
  brideName: string
  weddingDate: string // YYYY-MM-DD
  weddingTime: string // HH:mm
  venueName: string
}

interface BasicInfoFormProps {
  data: BasicInfoData
  onChange: (data: BasicInfoData) => void
  onNext: () => void
}

// 기본값
export const DEFAULT_BASIC_INFO: BasicInfoData = {
  groomName: '',
  brideName: '',
  weddingDate: '',
  weddingTime: '',
  venueName: '',
}

// Validation
function validateForm(data: BasicInfoData): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  if (!data.groomName || data.groomName.length < 2) {
    errors.groomName = '이름을 2자 이상 입력해주세요'
  }

  if (!data.brideName || data.brideName.length < 2) {
    errors.brideName = '이름을 2자 이상 입력해주세요'
  }

  if (!data.weddingDate) {
    errors.weddingDate = '예식 날짜를 선택해주세요'
  }

  if (!data.weddingTime) {
    errors.weddingTime = '예식 시간을 선택해주세요'
  }

  if (!data.venueName || data.venueName.length < 2) {
    errors.venueName = '예식장 이름을 2자 이상 입력해주세요'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function BasicInfoForm({ data, onChange, onNext }: BasicInfoFormProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const { isValid, errors } = useMemo(() => validateForm(data), [data])

  const handleChange = (field: keyof BasicInfoData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({ ...data, [field]: e.target.value })
  }

  const handleBlur = (field: keyof BasicInfoData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      onNext()
    } else {
      // 모든 필드를 touched로 표시
      setTouched({
        groomName: true,
        brideName: true,
        weddingDate: true,
        weddingTime: true,
        venueName: true,
      })
    }
  }

  const showError = (field: keyof BasicInfoData) => touched[field] && errors[field]

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[var(--sand-200)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">기본 정보</h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          청첩장에 들어갈 기본 정보를 입력해주세요
        </p>
      </div>

      {/* Form Fields */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {/* 신랑/신부 이름 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-body)] mb-2">
              신랑 이름 <span className="text-[var(--sage-500)]">*</span>
            </label>
            <input
              type="text"
              value={data.groomName}
              onChange={handleChange('groomName')}
              onBlur={handleBlur('groomName')}
              placeholder="홍길동"
              className={`w-full px-4 py-3 text-sm bg-white text-[var(--text-primary)] placeholder:text-[var(--text-muted)] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--sage-400)] focus:border-transparent transition-colors ${
                showError('groomName') ? 'border-red-400' : 'border-[var(--sand-200)]'
              }`}
            />
            {showError('groomName') && (
              <p className="text-xs text-red-500 mt-1">{errors.groomName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-body)] mb-2">
              신부 이름 <span className="text-[var(--sage-500)]">*</span>
            </label>
            <input
              type="text"
              value={data.brideName}
              onChange={handleChange('brideName')}
              onBlur={handleBlur('brideName')}
              placeholder="김영희"
              className={`w-full px-4 py-3 text-sm bg-white text-[var(--text-primary)] placeholder:text-[var(--text-muted)] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--sage-400)] focus:border-transparent transition-colors ${
                showError('brideName') ? 'border-red-400' : 'border-[var(--sand-200)]'
              }`}
            />
            {showError('brideName') && (
              <p className="text-xs text-red-500 mt-1">{errors.brideName}</p>
            )}
          </div>
        </div>

        {/* 예식 날짜/시간 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-body)] mb-2">
              예식 날짜 <span className="text-[var(--sage-500)]">*</span>
            </label>
            <input
              type="date"
              value={data.weddingDate}
              onChange={handleChange('weddingDate')}
              onBlur={handleBlur('weddingDate')}
              className={`w-full px-4 py-3 text-sm bg-white text-[var(--text-primary)] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--sage-400)] focus:border-transparent transition-colors ${
                showError('weddingDate') ? 'border-red-400' : 'border-[var(--sand-200)]'
              }`}
            />
            {showError('weddingDate') && (
              <p className="text-xs text-red-500 mt-1">{errors.weddingDate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-body)] mb-2">
              예식 시간 <span className="text-[var(--sage-500)]">*</span>
            </label>
            <input
              type="time"
              value={data.weddingTime}
              onChange={handleChange('weddingTime')}
              onBlur={handleBlur('weddingTime')}
              className={`w-full px-4 py-3 text-sm bg-white text-[var(--text-primary)] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--sage-400)] focus:border-transparent transition-colors ${
                showError('weddingTime') ? 'border-red-400' : 'border-[var(--sand-200)]'
              }`}
            />
            {showError('weddingTime') && (
              <p className="text-xs text-red-500 mt-1">{errors.weddingTime}</p>
            )}
          </div>
        </div>

        {/* 예식장 이름 */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-body)] mb-2">
            예식장 이름 <span className="text-[var(--sage-500)]">*</span>
          </label>
          <input
            type="text"
            value={data.venueName}
            onChange={handleChange('venueName')}
            onBlur={handleBlur('venueName')}
            placeholder="더채플앳청담"
            className={`w-full px-4 py-3 text-sm bg-white text-[var(--text-primary)] placeholder:text-[var(--text-muted)] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--sage-400)] focus:border-transparent transition-colors ${
              showError('venueName') ? 'border-red-400' : 'border-[var(--sand-200)]'
            }`}
          />
          {showError('venueName') && (
            <p className="text-xs text-red-500 mt-1">{errors.venueName}</p>
          )}
          <p className="text-xs text-[var(--text-muted)] mt-2">
            상세 주소는 나중에 편집 페이지에서 입력할 수 있어요
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="px-6 py-4 border-t border-[var(--sand-200)]">
        <button
          type="submit"
          disabled={!isValid}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--sage-500)] text-white font-medium rounded-xl hover:bg-[var(--sage-600)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          다음: 스타일 선택
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  )
}

'use client'

/**
 * Super Editor v2 - Image Field
 *
 * 이미지 업로드 필드
 * - 드래그 앤 드롭 / 클릭 업로드
 * - 미리보기 + 삭제
 * - 로딩 상태
 */

import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import type { VariablePath } from '../../../schema/types'

// ============================================
// Types
// ============================================

export interface ImageFieldProps {
  /** 필드 ID */
  id: string
  /** 라벨 */
  label: string
  /** 바인딩 경로 */
  binding: VariablePath
  /** 현재 값 (이미지 URL) */
  value: string
  /** 변경 콜백 */
  onChange: (value: string) => void
  /** 이미지 업로드 핸들러 */
  onUpload: (file: File) => Promise<string>
  /** 이미지 삭제 핸들러 */
  onDelete?: () => Promise<void>
  /** 도움말 텍스트 */
  helpText?: string
  /** 필수 여부 */
  required?: boolean
  /** 비활성화 여부 */
  disabled?: boolean
  /** 미리보기 종횡비 */
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'free'
  /** 최대 파일 크기 (MB) */
  maxSizeMB?: number
  /** 허용 파일 타입 */
  accept?: string
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function ImageField({
  id,
  label,
  binding,
  value,
  onChange,
  onUpload,
  onDelete,
  helpText,
  required = false,
  disabled = false,
  aspectRatio = 'portrait',
  maxSizeMB = 10,
  accept = 'image/jpeg,image/png,image/webp,image/heic,image/heif',
  className = '',
}: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 파일 선택
  const handleClick = useCallback(() => {
    if (!disabled && !isLoading) {
      inputRef.current?.click()
    }
  }, [disabled, isLoading])

  // 파일 유효성 검사
  const validateFile = useCallback((file: File): string | null => {
    const maxSize = maxSizeMB * 1024 * 1024
    if (file.size > maxSize) {
      return `파일 크기는 ${maxSizeMB}MB 이하여야 합니다`
    }

    const allowedTypes = accept.split(',').map(t => t.trim())
    if (!allowedTypes.includes(file.type)) {
      return '지원하지 않는 파일 형식입니다'
    }

    return null
  }, [maxSizeMB, accept])

  // 파일 업로드 처리
  const handleFile = useCallback(async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const url = await onUpload(file)
      onChange(url)
    } catch (err) {
      setError('이미지 업로드에 실패했습니다')
      console.error('Image upload failed:', err)
    } finally {
      setIsLoading(false)
    }
  }, [validateFile, onUpload, onChange])

  // 파일 입력 변경
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
    // Reset input to allow re-selecting same file
    e.target.value = ''
  }, [handleFile])

  // 드래그 앤 드롭
  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    if (!disabled && !isLoading) {
      setIsDragging(true)
    }
  }, [disabled, isLoading])

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled || isLoading) return

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFile(file)
    }
  }, [disabled, isLoading, handleFile])

  // 이미지 삭제
  const handleDelete = useCallback(async () => {
    if (disabled || isLoading) return

    setIsLoading(true)
    try {
      if (onDelete) {
        await onDelete()
      }
      onChange('')
    } catch (err) {
      setError('이미지 삭제에 실패했습니다')
      console.error('Image delete failed:', err)
    } finally {
      setIsLoading(false)
    }
  }, [disabled, isLoading, onDelete, onChange])

  // 종횡비에 따른 클래스
  const aspectClass = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    free: 'min-h-[200px]',
  }[aspectRatio]

  return (
    <div className={`field-wrapper ${className}`}>
      {/* 라벨 */}
      <label className="block text-sm font-medium text-[#F5E6D3]/80 mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {/* 이미지 영역 */}
      <div
        className={`
          relative ${aspectClass} w-full rounded-lg overflow-hidden
          border-2 border-dashed transition-colors cursor-pointer
          ${isDragging
            ? 'border-[#C9A962] bg-[#C9A962]/10'
            : value
              ? 'border-transparent'
              : 'border-white/20 hover:border-[#C9A962]/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* 히든 input */}
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="w-8 h-8 border-2 border-[#C9A962] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* 이미지 미리보기 */}
        {value ? (
          <>
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
            />
            {/* 삭제 버튼 */}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete()
                }}
                className="
                  absolute top-2 right-2 p-2 rounded-full
                  bg-black/50 text-white hover:bg-red-500/80
                  transition-colors
                "
                title="삭제"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          /* 업로드 placeholder */
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#F5E6D3]/50">
            <UploadIcon className="w-12 h-12 mb-2" />
            <p className="text-sm">클릭하거나 드래그하여 업로드</p>
            <p className="text-xs mt-1">최대 {maxSizeMB}MB</p>
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}

      {/* 도움말 */}
      {helpText && !error && (
        <p className="mt-1 text-xs text-[#F5E6D3]/50">{helpText}</p>
      )}
    </div>
  )
}

// ============================================
// Icons
// ============================================

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  )
}

'use client'

/**
 * Super Editor v2 - Gallery Field
 *
 * 다중 이미지 갤러리 필드
 * - 여러 이미지 업로드
 * - 드래그로 순서 변경
 * - 삭제 기능
 */

import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import type { VariablePath } from '../../../schema/types'

// ============================================
// Types
// ============================================

export interface GalleryImage {
  id: string
  url: string
  order: number
}

export interface GalleryFieldProps {
  /** 필드 ID */
  id: string
  /** 라벨 */
  label: string
  /** 바인딩 경로 */
  binding: VariablePath
  /** 현재 값 (이미지 목록) */
  value: GalleryImage[]
  /** 변경 콜백 */
  onChange: (value: GalleryImage[]) => void
  /** 이미지 업로드 핸들러 */
  onUpload: (files: File[]) => Promise<GalleryImage[]>
  /** 이미지 삭제 핸들러 */
  onDelete?: (id: string) => Promise<void>
  /** 도움말 텍스트 */
  helpText?: string
  /** 필수 여부 */
  required?: boolean
  /** 비활성화 여부 */
  disabled?: boolean
  /** 최대 이미지 수 */
  maxImages?: number
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

export function GalleryField({
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
  maxImages = 10,
  maxSizeMB = 10,
  accept = 'image/jpeg,image/png,image/webp,image/heic,image/heif',
  className = '',
}: GalleryFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const canAddMore = value.length < maxImages

  // 파일 선택
  const handleClick = useCallback(() => {
    if (!disabled && !isLoading && canAddMore) {
      inputRef.current?.click()
    }
  }, [disabled, isLoading, canAddMore])

  // 파일 유효성 검사
  const validateFiles = useCallback((files: File[]): { valid: File[], errors: string[] } => {
    const maxSize = maxSizeMB * 1024 * 1024
    const allowedTypes = accept.split(',').map(t => t.trim())
    const valid: File[] = []
    const errors: string[] = []

    const remainingSlots = maxImages - value.length
    const filesToCheck = files.slice(0, remainingSlots)

    for (const file of filesToCheck) {
      if (file.size > maxSize) {
        errors.push(`${file.name}: 파일 크기 초과`)
        continue
      }
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: 지원하지 않는 형식`)
        continue
      }
      valid.push(file)
    }

    if (files.length > remainingSlots) {
      errors.push(`최대 ${maxImages}장까지 업로드 가능합니다`)
    }

    return { valid, errors }
  }, [maxSizeMB, accept, maxImages, value.length])

  // 파일 업로드 처리
  const handleFiles = useCallback(async (files: File[]) => {
    const { valid, errors } = validateFiles(files)

    if (errors.length > 0) {
      setError(errors.join(', '))
    } else {
      setError(null)
    }

    if (valid.length === 0) return

    setIsLoading(true)

    try {
      const newImages = await onUpload(valid)
      onChange([...value, ...newImages])
    } catch (err) {
      setError('이미지 업로드에 실패했습니다')
      console.error('Gallery upload failed:', err)
    } finally {
      setIsLoading(false)
    }
  }, [validateFiles, onUpload, onChange, value])

  // 파일 입력 변경
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFiles(files)
    }
    e.target.value = ''
  }, [handleFiles])

  // 드래그 앤 드롭 (파일)
  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    if (!disabled && !isLoading && canAddMore) {
      setIsDragging(true)
    }
  }, [disabled, isLoading, canAddMore])

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled || isLoading || !canAddMore) return

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [disabled, isLoading, canAddMore, handleFiles])

  // 이미지 삭제
  const handleDelete = useCallback(async (imageId: string) => {
    if (disabled || isLoading) return

    setIsLoading(true)
    try {
      if (onDelete) {
        await onDelete(imageId)
      }
      const updated = value.filter(img => img.id !== imageId)
      // Re-order
      const reordered = updated.map((img, idx) => ({ ...img, order: idx }))
      onChange(reordered)
    } catch (err) {
      setError('이미지 삭제에 실패했습니다')
      console.error('Image delete failed:', err)
    } finally {
      setIsLoading(false)
    }
  }, [disabled, isLoading, onDelete, onChange, value])

  // 순서 변경 - 드래그 시작
  const handleImageDragStart = useCallback((index: number) => {
    setDraggedIndex(index)
  }, [])

  // 순서 변경 - 드래그 오버
  const handleImageDragOver = useCallback((e: DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newValue = [...value]
    const [dragged] = newValue.splice(draggedIndex, 1)
    newValue.splice(index, 0, dragged)

    // Update order
    const reordered = newValue.map((img, idx) => ({ ...img, order: idx }))
    onChange(reordered)
    setDraggedIndex(index)
  }, [draggedIndex, value, onChange])

  // 순서 변경 - 드래그 끝
  const handleImageDragEnd = useCallback(() => {
    setDraggedIndex(null)
  }, [])

  return (
    <div className={`field-wrapper ${className}`}>
      {/* 라벨 */}
      <label className="block text-sm font-medium text-[#F5E6D3]/80 mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
        <span className="ml-2 text-[#F5E6D3]/40 font-normal">
          ({value.length}/{maxImages})
        </span>
      </label>

      {/* 갤러리 그리드 */}
      <div className="grid grid-cols-3 gap-2">
        {/* 기존 이미지들 */}
        {value.map((image, index) => (
          <div
            key={image.id}
            draggable={!disabled}
            onDragStart={() => handleImageDragStart(index)}
            onDragOver={(e) => handleImageDragOver(e, index)}
            onDragEnd={handleImageDragEnd}
            className={`
              relative aspect-square rounded-lg overflow-hidden cursor-move
              ${draggedIndex === index ? 'opacity-50' : ''}
              ${disabled ? 'cursor-not-allowed' : ''}
            `}
          >
            <img
              src={image.url}
              alt={`Gallery ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* 순서 표시 */}
            <div className="absolute top-1 left-1 px-1.5 py-0.5 text-xs bg-black/50 text-white rounded">
              {index + 1}
            </div>
            {/* 삭제 버튼 */}
            {!disabled && (
              <button
                type="button"
                onClick={() => handleDelete(image.id)}
                className="
                  absolute top-1 right-1 p-1 rounded-full
                  bg-black/50 text-white hover:bg-red-500/80
                  transition-colors
                "
                title="삭제"
              >
                <CloseIcon className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        {/* 추가 버튼 */}
        {canAddMore && (
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              aspect-square rounded-lg border-2 border-dashed
              flex flex-col items-center justify-center cursor-pointer
              transition-colors
              ${isDragging
                ? 'border-[#C9A962] bg-[#C9A962]/10'
                : 'border-white/20 hover:border-[#C9A962]/50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {/* 히든 input */}
            <input
              ref={inputRef}
              id={id}
              type="file"
              multiple
              accept={accept}
              onChange={handleInputChange}
              disabled={disabled}
              className="hidden"
            />

            {isLoading ? (
              <div className="w-6 h-6 border-2 border-[#C9A962] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <PlusIcon className="w-6 h-6 text-[#F5E6D3]/40" />
                <span className="text-xs text-[#F5E6D3]/40 mt-1">추가</span>
              </>
            )}
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

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

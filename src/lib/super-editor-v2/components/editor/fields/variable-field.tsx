'use client'

/**
 * Variable Field Components
 *
 * 바인딩된 변수 필드를 편집하는 컴포넌트 모음
 * - VariableField: 타입에 따라 적절한 입력 필드 렌더링
 * - GalleryFieldLocal: 갤러리 이미지 관리
 * - ImageField: 단일 이미지 업로드
 * - StringListField: 문자열 리스트 관리
 * - NoticeItemsField: 공지사항 아이템 관리
 * - BgmSelectorField: 배경음악 선택
 */

import { useState, useCallback, useRef, type ChangeEvent } from 'react'
import type { VariablePath, WeddingData } from '../../../schema/types'
import { isCustomVariablePath, getCustomVariableKey } from '../../../utils/binding-resolver'
import { VARIABLE_FIELD_CONFIG } from '../../../config/variable-field-config'
import { LocationSearchField } from './location-search-field'
import { bgmPresets, getBgmCategories, type BgmCategory } from '../../../audio/bgm-presets'

// ============================================
// Types
// ============================================

export interface VariableFieldProps {
  binding: VariablePath
  value: unknown
  onChange: (value: unknown) => void
  onUploadImage?: (file: File) => Promise<string>
  /** 위치 정보 한 번에 변경 (address, lat, lng) */
  onLocationChange?: (address: string, lat: number, lng: number) => void
  /** WeddingData (location 타입에서 좌표 읽기용) */
  data?: WeddingData
}

// ============================================
// VariableField Component
// ============================================

export function VariableField({
  binding,
  value,
  onChange,
  onUploadImage,
  onLocationChange,
  data,
}: VariableFieldProps) {
  const fieldConfig = VARIABLE_FIELD_CONFIG[binding]

  // 커스텀 변수의 경우 키를 레이블로 사용
  let label: string
  if (isCustomVariablePath(binding)) {
    const key = getCustomVariableKey(binding) || binding
    // camelCase/snake_case를 읽기 좋게 변환 (예: weddingTitle → Wedding Title)
    label = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^\s/, '')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  } else {
    label = fieldConfig?.label ?? binding
  }

  const type = fieldConfig?.type ?? 'text'
  const placeholder = fieldConfig?.placeholder

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-[var(--text-body)]">{label}</label>

      {type === 'text' && (
        <input
          type="text"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 bg-white border border-[var(--sand-100)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--sage-500)]"
        />
      )}

      {type === 'textarea' && (
        <textarea
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 bg-white border border-[var(--sand-100)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--sage-500)] resize-none"
        />
      )}

      {type === 'date' && (
        <input
          type="date"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-[var(--sand-100)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--sage-500)]"
        />
      )}

      {type === 'time' && (
        <input
          type="time"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-[var(--sand-100)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--sage-500)]"
        />
      )}

      {type === 'phone' && (
        <input
          type="tel"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? '010-0000-0000'}
          className="w-full px-3 py-2 bg-white border border-[var(--sand-100)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--sage-500)]"
        />
      )}

      {type === 'image' && (
        <ImageField value={String(value ?? '')} onChange={onChange} onUploadImage={onUploadImage} />
      )}

      {type === 'gallery' && (
        <GalleryFieldLocal
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          onUploadImage={onUploadImage}
        />
      )}

      {type === 'location' && (
        <LocationSearchField
          value={String(value ?? '')}
          lat={data?.venue?.lat}
          lng={data?.venue?.lng}
          onLocationChange={(address, lat, lng) => {
            if (onLocationChange) {
              onLocationChange(address, lat, lng)
            }
          }}
        />
      )}

      {type === 'notice-items' && (
        <NoticeItemsField value={Array.isArray(value) ? value : []} onChange={onChange} />
      )}

      {type === 'string-list' && (
        <StringListField
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}

      {type === 'checkbox' && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 rounded border-[var(--sand-200)] text-[var(--sage-500)] focus:ring-[var(--sage-500)]"
          />
          <span className="text-sm text-[var(--text-muted)]">{placeholder || '활성화'}</span>
        </label>
      )}

      {type === 'bgm-selector' && <BgmSelectorField value={String(value ?? '')} onChange={onChange} />}
    </div>
  )
}

// ============================================
// Gallery Field (Local implementation)
// ============================================

interface GalleryImage {
  id: string
  url: string
  order: number
}

interface GalleryFieldLocalProps {
  value: GalleryImage[]
  onChange: (value: unknown) => void
  onUploadImage?: (file: File) => Promise<string>
  maxImages?: number
}

export function GalleryFieldLocal({
  value,
  onChange,
  onUploadImage,
  maxImages = 60,
}: GalleryFieldLocalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const canAddMore = value.length < maxImages

  const handleClick = useCallback(() => {
    if (!isLoading && canAddMore) {
      inputRef.current?.click()
    }
  }, [isLoading, canAddMore])

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length === 0) return

      setError(null)
      setIsLoading(true)

      try {
        const newImages: GalleryImage[] = []
        const remainingSlots = maxImages - value.length

        for (const file of files.slice(0, remainingSlots)) {
          // 파일 타입 검증
          if (!file.type.startsWith('image/')) {
            continue
          }
          // 파일 크기 검증 (10MB)
          if (file.size > 10 * 1024 * 1024) {
            continue
          }

          let url: string
          if (onUploadImage) {
            url = await onUploadImage(file)
          } else {
            // fallback: base64 로컬 프리뷰
            url = await new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onload = (event) => {
                resolve(event.target?.result as string)
              }
              reader.readAsDataURL(file)
            })
          }

          newImages.push({
            id: `gallery-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            url,
            order: value.length + newImages.length,
          })
        }

        if (newImages.length > 0) {
          onChange([...value, ...newImages])
        }
      } catch (err) {
        setError('이미지 업로드에 실패했습니다')
        console.error('Gallery upload failed:', err)
      } finally {
        setIsLoading(false)
      }

      e.target.value = ''
    },
    [onUploadImage, onChange, value, maxImages]
  )

  // 드래그 앤 드롭 (파일)
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!isLoading && canAddMore) {
        setIsDragging(true)
      }
    },
    [isLoading, canAddMore]
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      if (isLoading || !canAddMore) return

      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
      if (files.length === 0) return

      setIsLoading(true)
      try {
        const newImages: GalleryImage[] = []
        const remainingSlots = maxImages - value.length

        for (const file of files.slice(0, remainingSlots)) {
          if (file.size > 10 * 1024 * 1024) continue

          let url: string
          if (onUploadImage) {
            url = await onUploadImage(file)
          } else {
            url = await new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onload = (event) => {
                resolve(event.target?.result as string)
              }
              reader.readAsDataURL(file)
            })
          }

          newImages.push({
            id: `gallery-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            url,
            order: value.length + newImages.length,
          })
        }

        if (newImages.length > 0) {
          onChange([...value, ...newImages])
        }
      } catch (err) {
        setError('이미지 업로드에 실패했습니다')
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, canAddMore, onUploadImage, onChange, value, maxImages]
  )

  // 이미지 삭제
  const handleDelete = useCallback(
    (imageId: string) => {
      if (isLoading) return
      const updated = value.filter((img) => img.id !== imageId)
      const reordered = updated.map((img, idx) => ({ ...img, order: idx }))
      onChange(reordered)
    },
    [isLoading, value, onChange]
  )

  // 순서 변경 - 드래그 시작
  const handleImageDragStart = useCallback((index: number) => {
    setDraggedIndex(index)
  }, [])

  // 순서 변경 - 드래그 오버
  const handleImageDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault()
      if (draggedIndex === null || draggedIndex === index) return

      const newValue = [...value]
      const [dragged] = newValue.splice(draggedIndex, 1)
      newValue.splice(index, 0, dragged)

      const reordered = newValue.map((img, idx) => ({ ...img, order: idx }))
      onChange(reordered)
      setDraggedIndex(index)
    },
    [draggedIndex, value, onChange]
  )

  // 순서 변경 - 드래그 끝
  const handleImageDragEnd = useCallback(() => {
    setDraggedIndex(null)
  }, [])

  return (
    <div className="space-y-2">
      {/* 갤러리 그리드 */}
      <div className="grid grid-cols-3 gap-2">
        {/* 기존 이미지들 */}
        {value.map((image, index) => (
          <div
            key={image.id}
            draggable
            onDragStart={() => handleImageDragStart(index)}
            onDragOver={(e) => handleImageDragOver(e, index)}
            onDragEnd={handleImageDragEnd}
            className={`
              relative aspect-square rounded-lg overflow-hidden cursor-move bg-[var(--sand-100)]
              ${draggedIndex === index ? 'opacity-50' : ''}
            `}
          >
            <img src={image.url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
            {/* 순서 표시 */}
            <div className="absolute top-1 left-1 px-1.5 py-0.5 text-xs bg-black/50 text-white rounded">
              {index + 1}
            </div>
            {/* 삭제 버튼 */}
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
              <XIcon className="w-3 h-3" />
            </button>
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
              transition-colors bg-white
              ${
                isDragging
                  ? 'border-[var(--sage-500)] bg-[var(--sage-50)]'
                  : 'border-[var(--sand-200)] hover:border-[var(--sage-400)]'
              }
            `}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              onChange={handleFileChange}
              className="hidden"
            />

            {isLoading ? (
              <div className="w-6 h-6 border-2 border-[var(--sage-500)] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <PlusIcon className="w-6 h-6 text-[var(--text-light)]" />
                <span className="text-xs text-[var(--text-light)] mt-1">추가</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* 카운터 */}
      <p className="text-xs text-[var(--text-light)]">
        {value.length}/{maxImages}장
      </p>

      {/* 에러 메시지 */}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

// ============================================
// Image Field
// ============================================

interface ImageFieldProps {
  value: string
  onChange: (value: unknown) => void
  onUploadImage?: (file: File) => Promise<string>
}

export function ImageField({ value, onChange, onUploadImage }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = useCallback(() => {
    if (!isLoading) {
      inputRef.current?.click()
    }
  }, [isLoading])

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드할 수 있습니다')
        return
      }

      // 파일 크기 검증 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('파일 크기는 10MB 이하여야 합니다')
        return
      }

      setError(null)
      setIsLoading(true)

      try {
        if (onUploadImage) {
          const url = await onUploadImage(file)
          onChange(url)
        } else {
          // fallback: base64 로컬 프리뷰
          const reader = new FileReader()
          reader.onload = (event) => {
            onChange(event.target?.result as string)
          }
          reader.readAsDataURL(file)
        }
      } catch (err) {
        setError('이미지 업로드에 실패했습니다')
        console.error('Image upload failed:', err)
      } finally {
        setIsLoading(false)
      }

      // Reset input
      e.target.value = ''
    },
    [onUploadImage, onChange]
  )

  return (
    <div className="space-y-2">
      {/* 히든 input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        onChange={handleFileChange}
        className="hidden"
      />

      {value && (
        <div className="relative aspect-video bg-[var(--sand-100)] rounded-lg overflow-hidden">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="w-full px-3 py-2 bg-white border border-dashed border-[var(--sand-200)] rounded-lg text-[var(--text-muted)] text-sm hover:bg-[var(--sage-50)] hover:border-[var(--sage-400)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-[var(--sage-500)] border-t-transparent rounded-full animate-spin" />
            업로드 중...
          </>
        ) : value ? (
          '이미지 변경'
        ) : (
          '이미지 업로드'
        )}
      </button>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

// ============================================
// String List Field (단순 문자열 리스트)
// ============================================

interface StringListFieldProps {
  value: string[]
  onChange: (value: unknown) => void
  placeholder?: string
}

export function StringListField({ value, onChange, placeholder }: StringListFieldProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // 아이템 추가
  const handleAdd = useCallback(() => {
    onChange([...value, ''])
  }, [value, onChange])

  // 아이템 삭제
  const handleDelete = useCallback(
    (index: number) => {
      const updated = value.filter((_, i) => i !== index)
      onChange(updated)
    },
    [value, onChange]
  )

  // 아이템 수정
  const handleItemChange = useCallback(
    (index: number, newValue: string) => {
      const updated = value.map((item, i) => (i === index ? newValue : item))
      onChange(updated)
    },
    [value, onChange]
  )

  // 드래그 시작
  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index)
  }, [])

  // 드래그 오버 (순서 변경)
  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault()
      if (draggedIndex === null || draggedIndex === index) return

      const newValue = [...value]
      const [dragged] = newValue.splice(draggedIndex, 1)
      newValue.splice(index, 0, dragged)
      onChange(newValue)
      setDraggedIndex(index)
    },
    [draggedIndex, value, onChange]
  )

  // 드래그 종료
  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null)
  }, [])

  return (
    <div className="space-y-2">
      {/* 아이템 목록 */}
      {value.map((item, index) => (
        <div
          key={index}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`
            flex items-center gap-2
            ${draggedIndex === index ? 'opacity-50' : ''}
          `}
        >
          {/* 드래그 핸들 */}
          <div className="cursor-move text-[var(--text-light)] hover:text-[var(--text-muted)]">
            <DragIcon className="w-4 h-4" />
          </div>

          {/* 입력 필드 */}
          <input
            type="text"
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 bg-white border border-[var(--sand-100)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--sage-500)]"
          />

          {/* 삭제 버튼 */}
          <button
            type="button"
            onClick={() => handleDelete(index)}
            className="p-1.5 text-[var(--text-light)] hover:text-red-500 transition-colors"
            title="삭제"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      ))}

      {/* 추가 버튼 */}
      <button
        type="button"
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-[var(--sand-200)] rounded-lg text-sm text-[var(--text-muted)] hover:border-[var(--sage-400)] hover:text-[var(--sage-600)] transition-colors"
      >
        <PlusIcon className="w-4 h-4" />
        항목 추가
      </button>

      {/* 도움말 */}
      {value.length === 0 && (
        <p className="text-xs text-[var(--text-light)] text-center">
          항목이 없습니다. 위 버튼을 눌러 추가하세요.
        </p>
      )}
    </div>
  )
}

// ============================================
// Notice Items Field (리스트 추가/삭제/순서변경)
// ============================================

interface NoticeItemData {
  title: string
  content: string
  iconType?: 'rings' | 'birds' | 'hearts'
  backgroundColor?: string
  borderColor?: string
}

// ============================================
// Notice Icon Field (3개 SVG 중 선택)
// ============================================

const NOTICE_ICON_OPTIONS = [
  { value: 'rings', label: '반지', src: '/assets/notice1.svg' },
  { value: 'birds', label: '새', src: '/assets/notice2.svg' },
  { value: 'hearts', label: '하트', src: '/assets/notice3.svg' },
  { value: 'none', label: '없음', src: null },
] as const

interface NoticeItemsFieldProps {
  value: NoticeItemData[]
  onChange: (value: unknown) => void
}

export function NoticeItemsField({ value, onChange }: NoticeItemsFieldProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // 아이템 추가
  const handleAdd = useCallback(() => {
    const newItem: NoticeItemData = {
      title: '',
      content: '',
    }
    onChange([...value, newItem])
  }, [value, onChange])

  // 아이템 삭제
  const handleDelete = useCallback(
    (index: number) => {
      const updated = value.filter((_, i) => i !== index)
      onChange(updated)
    },
    [value, onChange]
  )

  // 아이템 수정
  const handleItemChange = useCallback(
    (index: number, field: keyof NoticeItemData, fieldValue: string) => {
      const updated = value.map((item, i) => (i === index ? { ...item, [field]: fieldValue } : item))
      onChange(updated)
    },
    [value, onChange]
  )

  // 드래그 시작
  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index)
  }, [])

  // 드래그 오버 (순서 변경)
  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault()
      if (draggedIndex === null || draggedIndex === index) return

      const newValue = [...value]
      const [dragged] = newValue.splice(draggedIndex, 1)
      newValue.splice(index, 0, dragged)
      onChange(newValue)
      setDraggedIndex(index)
    },
    [draggedIndex, value, onChange]
  )

  // 드래그 종료
  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null)
  }, [])

  return (
    <div className="space-y-3">
      {/* 아이템 목록 */}
      {value.map((item, index) => (
        <div
          key={index}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`
            p-3 bg-white border border-[var(--sand-200)] rounded-lg
            ${draggedIndex === index ? 'opacity-50 border-dashed' : ''}
          `}
        >
          {/* 헤더 (드래그 핸들 + 삭제) */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 cursor-move text-[var(--text-light)]">
              <DragIcon className="w-4 h-4" />
              <span className="text-xs font-medium">공지 {index + 1}</span>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(index)}
              className="p-1 text-[var(--text-light)] hover:text-red-500 transition-colors"
              title="삭제"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          {/* 제목 */}
          <input
            type="text"
            value={item.title}
            onChange={(e) => handleItemChange(index, 'title', e.target.value)}
            placeholder="공지 제목 (예: 피로연 안내)"
            className="w-full px-3 py-2 mb-2 bg-[var(--ivory-50)] border border-[var(--sand-100)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--sage-500)]"
          />

          {/* 내용 */}
          <textarea
            value={item.content}
            onChange={(e) => handleItemChange(index, 'content', e.target.value)}
            placeholder="공지 내용을 입력하세요"
            rows={3}
            className="w-full px-3 py-2 mb-2 bg-[var(--ivory-50)] border border-[var(--sand-100)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--sage-500)] resize-none"
          />

          {/* 스타일(아이콘+배경) 선택 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-light)]">스타일:</span>
            <div className="flex gap-1">
              {NOTICE_ICON_OPTIONS.filter((opt) => opt.value !== 'none').map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleItemChange(index, 'iconType', option.value)}
                  className={`
                    p-1 rounded border-2 transition-all
                    ${
                      (item.iconType || 'birds') === option.value
                        ? 'border-[var(--sage-500)] bg-[var(--sage-50)]'
                        : 'border-transparent hover:border-[var(--sand-200)]'
                    }
                  `}
                  title={option.label}
                >
                  <img src={option.src!} alt={option.label} className="w-8 h-4 object-contain" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* 추가 버튼 */}
      <button
        type="button"
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-[var(--sand-200)] rounded-lg text-sm text-[var(--text-muted)] hover:border-[var(--sage-400)] hover:text-[var(--sage-600)] transition-colors"
      >
        <PlusIcon className="w-4 h-4" />
        공지 추가
      </button>

      {/* 도움말 */}
      {value.length === 0 && (
        <p className="text-xs text-[var(--text-light)] text-center">
          공지 항목이 없습니다. 위 버튼을 눌러 추가하세요.
        </p>
      )}
    </div>
  )
}

// ============================================
// BGM Selector Field (프리셋 + 유튜브 URL)
// ============================================

interface BgmSelectorFieldProps {
  value: string
  onChange: (value: unknown) => void
}

export function BgmSelectorField({ value, onChange }: BgmSelectorFieldProps) {
  const [activeTab, setActiveTab] = useState<'preset' | 'youtube'>('preset')
  const [selectedCategory, setSelectedCategory] = useState<BgmCategory>('romantic')
  const [youtubeUrl, setYoutubeUrl] = useState('')

  const categories = getBgmCategories()
  const filteredPresets = bgmPresets.filter((p) => p.category === selectedCategory)

  // 현재 선택된 프리셋 찾기
  const selectedPreset = bgmPresets.find((p) => p.url === value)

  // 유튜브 URL인지 확인
  const isYoutubeUrl = value?.includes('youtube.com') || value?.includes('youtu.be')

  // 유튜브 URL에서 비디오 ID 추출
  const extractYoutubeId = (url: string): string | null => {
    const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  // 유튜브 URL을 오디오 스트림 URL로 변환 (실제로는 백엔드 처리 필요)
  const handleYoutubeSubmit = useCallback(() => {
    if (!youtubeUrl) return
    const videoId = extractYoutubeId(youtubeUrl)
    if (videoId) {
      // 유튜브 URL 그대로 저장 (재생은 별도 처리)
      onChange(youtubeUrl)
    }
  }, [youtubeUrl, onChange])

  return (
    <div className="space-y-3">
      {/* 탭 */}
      <div className="flex gap-1 p-1 bg-[var(--sand-50)] rounded-lg">
        <button
          type="button"
          onClick={() => setActiveTab('preset')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'preset'
              ? 'bg-white text-[var(--text-primary)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-body)]'
          }`}
        >
          프리셋
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('youtube')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'youtube'
              ? 'bg-white text-[var(--text-primary)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-body)]'
          }`}
        >
          유튜브
        </button>
      </div>

      {/* 프리셋 탭 */}
      {activeTab === 'preset' && (
        <div className="space-y-3">
          {/* 카테고리 선택 */}
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-[var(--sage-500)] text-white'
                    : 'bg-[var(--sand-100)] text-[var(--text-muted)] hover:bg-[var(--sand-200)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 프리셋 목록 */}
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {filteredPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onChange(preset.url)}
                className={`flex items-center gap-3 p-2 rounded-lg border-2 transition-all text-left ${
                  value === preset.url
                    ? 'border-[var(--sage-500)] bg-[var(--sage-50)]'
                    : 'border-[var(--sand-100)] hover:border-[var(--sand-200)]'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[var(--sage-100)] flex items-center justify-center flex-shrink-0">
                  <MusicIcon className="w-4 h-4 text-[var(--sage-600)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{preset.name}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{preset.description}</p>
                </div>
                {value === preset.url && <CheckIcon className="w-4 h-4 text-[var(--sage-500)] flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 유튜브 탭 */}
      {activeTab === 'youtube' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 px-3 py-2 bg-white border border-[var(--sand-100)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--sage-500)]"
            />
            <button
              type="button"
              onClick={handleYoutubeSubmit}
              disabled={!youtubeUrl}
              className="px-3 py-2 bg-[var(--sage-500)] text-white text-sm rounded-lg hover:bg-[var(--sage-600)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              적용
            </button>
          </div>
          <p className="text-xs text-[var(--text-light)]">유튜브 음악 URL을 입력하세요</p>

          {/* 현재 유튜브 URL 표시 */}
          {isYoutubeUrl && value && (
            <div className="flex items-center gap-2 p-2 bg-[var(--sage-50)] rounded-lg">
              <YoutubeIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-xs text-[var(--text-body)] truncate flex-1">{value}</p>
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1 text-[var(--text-light)] hover:text-red-500"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 현재 선택 표시 */}
      {selectedPreset && !isYoutubeUrl && (
        <div className="flex items-center gap-2 p-2 bg-[var(--sage-50)] rounded-lg">
          <MusicIcon className="w-4 h-4 text-[var(--sage-600)] flex-shrink-0" />
          <p className="text-xs text-[var(--text-body)] flex-1">
            {selectedPreset.name} - {selectedPreset.description}
          </p>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 text-[var(--text-light)] hover:text-red-500"
          >
            <XIcon className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================
// Icons (exported for reuse)
// ============================================

export function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}

export function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export function DragIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8-12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
    </svg>
  )
}

export function MusicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
      />
    </svg>
  )
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

export function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

export function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

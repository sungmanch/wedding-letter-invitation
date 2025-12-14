'use client'

/**
 * Super Editor v2 - Content Tab
 *
 * Section-First 패턴 구현
 * 블록(섹션) 아코디언 + 변수 필드 편집
 */

import { useState, useCallback, useMemo, useRef, type ReactNode, type ChangeEvent } from 'react'
import type {
  EditorDocument,
  Block,
  BlockType,
  WeddingData,
  Element,
  VariablePath,
} from '../../../schema/types'
import { SectionHeader, BLOCK_TYPE_LABELS } from '../editor-panel'
import { resolveBinding } from '../../../utils/binding-resolver'

// ============================================
// Types
// ============================================

export interface ContentTabProps {
  /** 문서 데이터 */
  document: EditorDocument
  /** 펼쳐진 블록 ID */
  expandedBlockId: string | null
  /** 펼침 상태 변경 콜백 */
  onExpandedBlockChange: (blockId: string | null) => void
  /** 블록 업데이트 콜백 */
  onBlocksChange?: (blocks: Block[]) => void
  /** 데이터 업데이트 콜백 */
  onDataChange?: (data: WeddingData) => void
  /** 블록 추가 콜백 */
  onAddBlock?: (blockType: BlockType) => void
  /** 이미지 업로드 핸들러 */
  onUploadImage?: (file: File) => Promise<string>
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function ContentTab({
  document,
  expandedBlockId,
  onExpandedBlockChange,
  onBlocksChange,
  onDataChange,
  onAddBlock,
  onUploadImage,
  className = '',
}: ContentTabProps) {
  // 블록 토글
  const handleBlockToggle = useCallback((blockId: string) => {
    if (!onBlocksChange) return

    const newBlocks = document.blocks.map(block =>
      block.id === blockId
        ? { ...block, enabled: !block.enabled }
        : block
    )
    onBlocksChange(newBlocks)
  }, [document.blocks, onBlocksChange])

  // 블록 순서 변경
  const handleBlockMove = useCallback((blockId: string, direction: 'up' | 'down') => {
    if (!onBlocksChange) return

    const currentIndex = document.blocks.findIndex(b => b.id === blockId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= document.blocks.length) return

    const newBlocks = [...document.blocks]
    const [moved] = newBlocks.splice(currentIndex, 1)
    newBlocks.splice(newIndex, 0, moved)
    onBlocksChange(newBlocks)
  }, [document.blocks, onBlocksChange])

  // 블록 펼치기/접기
  const handleExpand = useCallback((blockId: string) => {
    if (expandedBlockId === blockId) {
      onExpandedBlockChange(null)
    } else {
      onExpandedBlockChange(blockId)
    }
  }, [expandedBlockId, onExpandedBlockChange])

  // 데이터 필드 변경
  const handleFieldChange = useCallback((path: VariablePath, value: unknown) => {
    if (!onDataChange) return

    const newData = setNestedValue(document.data, path, value)
    onDataChange(newData)
  }, [document.data, onDataChange])

  // 고정 블록 (hero, loading 등 순서 변경 불가)
  const fixedBlockTypes: BlockType[] = ['hero', 'loading']

  // 사용 가능한 블록 타입 (추가 가능)
  const availableBlockTypes = useMemo(() => {
    const usedTypes = new Set(document.blocks.map(b => b.type))
    return Object.keys(BLOCK_TYPE_LABELS).filter(
      type => !usedTypes.has(type as BlockType)
    ) as BlockType[]
  }, [document.blocks])

  return (
    <div className={`flex flex-col ${className}`}>
      {/* 블록 목록 */}
      <div className="flex-1 p-4 space-y-2">
        {document.blocks.map((block, index) => {
          const isFixed = fixedBlockTypes.includes(block.type)
          const isExpanded = expandedBlockId === block.id

          return (
            <BlockAccordion
              key={block.id}
              block={block}
              data={document.data}
              expanded={isExpanded}
              onExpand={() => handleExpand(block.id)}
              onToggle={() => handleBlockToggle(block.id)}
              onMoveUp={() => handleBlockMove(block.id, 'up')}
              onMoveDown={() => handleBlockMove(block.id, 'down')}
              canMoveUp={!isFixed && index > 0}
              canMoveDown={!isFixed && index < document.blocks.length - 1}
              fixed={isFixed}
              onFieldChange={handleFieldChange}
              onUploadImage={onUploadImage}
            />
          )
        })}

        {/* 블록 추가 버튼 */}
        {onAddBlock && availableBlockTypes.length > 0 && (
          <AddBlockButton
            availableTypes={availableBlockTypes}
            onAdd={onAddBlock}
          />
        )}
      </div>
    </div>
  )
}

// ============================================
// Block Accordion
// ============================================

interface BlockAccordionProps {
  block: Block
  data: WeddingData
  expanded: boolean
  onExpand: () => void
  onToggle: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
  fixed: boolean
  onFieldChange: (path: VariablePath, value: unknown) => void
  onUploadImage?: (file: File) => Promise<string>
}

function BlockAccordion({
  block,
  data,
  expanded,
  onExpand,
  onToggle,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  fixed,
  onFieldChange,
  onUploadImage,
}: BlockAccordionProps) {
  // 블록 내 바인딩된 요소에서 편집 가능한 필드 추출
  const editableFields = useMemo(() => {
    return (block.elements ?? [])
      .filter(el => el.binding)
      .map(el => {
        const binding = el.binding!
        // gallery 바인딩은 배열을 그대로 가져와야 함 (resolveBinding은 문자열로 변환함)
        let value: unknown
        if (binding === 'photos.gallery') {
          value = data.photos?.gallery ?? []
        } else {
          value = resolveBinding(data, binding)
        }
        return {
          elementId: el.id,
          binding,
          type: el.type,
          value,
        }
      })
  }, [block.elements, data])

  return (
    <div className="rounded-lg overflow-hidden">
      <SectionHeader
        blockType={block.type}
        label={BLOCK_TYPE_LABELS[block.type] || block.type}
        enabled={block.enabled}
        expanded={expanded}
        onToggle={onToggle}
        onExpand={onExpand}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        fixed={fixed}
      />

      {/* 펼침 콘텐츠 */}
      {expanded && (
        <div className="bg-[#1F1F1F] p-4 space-y-4">
          {editableFields.length > 0 ? (
            editableFields.map(field => (
              <VariableField
                key={field.elementId}
                binding={field.binding}
                value={field.value}
                onChange={(value) => onFieldChange(field.binding, value)}
                onUploadImage={onUploadImage}
              />
            ))
          ) : (
            <p className="text-sm text-[#F5E6D3]/50">
              편집 가능한 필드가 없습니다
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// Variable Field (바인딩된 필드 편집)
// ============================================

interface VariableFieldProps {
  binding: VariablePath
  value: unknown
  onChange: (value: unknown) => void
  onUploadImage?: (file: File) => Promise<string>
}

function VariableField({ binding, value, onChange, onUploadImage }: VariableFieldProps) {
  const fieldConfig = VARIABLE_FIELD_CONFIG[binding]
  const label = fieldConfig?.label ?? binding
  const type = fieldConfig?.type ?? 'text'
  const placeholder = fieldConfig?.placeholder

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-[#F5E6D3]/80">
        {label}
      </label>

      {type === 'text' && (
        <input
          type="text"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 bg-[#2A2A2A] border border-white/10 rounded-lg text-[#F5E6D3] text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A962]"
        />
      )}

      {type === 'textarea' && (
        <textarea
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 bg-[#2A2A2A] border border-white/10 rounded-lg text-[#F5E6D3] text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A962] resize-none"
        />
      )}

      {type === 'date' && (
        <input
          type="date"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-[#2A2A2A] border border-white/10 rounded-lg text-[#F5E6D3] text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A962]"
        />
      )}

      {type === 'time' && (
        <input
          type="time"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-[#2A2A2A] border border-white/10 rounded-lg text-[#F5E6D3] text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A962]"
        />
      )}

      {type === 'phone' && (
        <input
          type="tel"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? '010-0000-0000'}
          className="w-full px-3 py-2 bg-[#2A2A2A] border border-white/10 rounded-lg text-[#F5E6D3] text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A962]"
        />
      )}

      {type === 'image' && (
        <ImageField
          value={String(value ?? '')}
          onChange={onChange}
          onUploadImage={onUploadImage}
        />
      )}

      {type === 'gallery' && (
        <GalleryFieldLocal
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          onUploadImage={onUploadImage}
        />
      )}
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

function GalleryFieldLocal({
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

  const handleFileChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
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
  }, [onUploadImage, onChange, value, maxImages])

  // 드래그 앤 드롭 (파일)
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!isLoading && canAddMore) {
      setIsDragging(true)
    }
  }, [isLoading, canAddMore])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (isLoading || !canAddMore) return

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
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
  }, [isLoading, canAddMore, onUploadImage, onChange, value, maxImages])

  // 이미지 삭제
  const handleDelete = useCallback((imageId: string) => {
    if (isLoading) return
    const updated = value.filter(img => img.id !== imageId)
    const reordered = updated.map((img, idx) => ({ ...img, order: idx }))
    onChange(reordered)
  }, [isLoading, value, onChange])

  // 순서 변경 - 드래그 시작
  const handleImageDragStart = useCallback((index: number) => {
    setDraggedIndex(index)
  }, [])

  // 순서 변경 - 드래그 오버
  const handleImageDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newValue = [...value]
    const [dragged] = newValue.splice(draggedIndex, 1)
    newValue.splice(index, 0, dragged)

    const reordered = newValue.map((img, idx) => ({ ...img, order: idx }))
    onChange(reordered)
    setDraggedIndex(index)
  }, [draggedIndex, value, onChange])

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
              relative aspect-square rounded-lg overflow-hidden cursor-move bg-[#2A2A2A]
              ${draggedIndex === index ? 'opacity-50' : ''}
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
              transition-colors bg-[#2A2A2A]
              ${isDragging
                ? 'border-[#C9A962] bg-[#C9A962]/10'
                : 'border-white/20 hover:border-[#C9A962]/50'
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

      {/* 카운터 */}
      <p className="text-xs text-[#F5E6D3]/50">
        {value.length}/{maxImages}장
      </p>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
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

function ImageField({ value, onChange, onUploadImage }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = useCallback(() => {
    if (!isLoading) {
      inputRef.current?.click()
    }
  }, [isLoading])

  const handleFileChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
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
  }, [onUploadImage, onChange])

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
        <div className="relative aspect-video bg-[#2A2A2A] rounded-lg overflow-hidden">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
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
        className="w-full px-3 py-2 bg-[#2A2A2A] border border-dashed border-white/20 rounded-lg text-[#F5E6D3]/60 text-sm hover:bg-[#333333] hover:border-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-[#C9A962] border-t-transparent rounded-full animate-spin" />
            업로드 중...
          </>
        ) : (
          value ? '이미지 변경' : '이미지 업로드'
        )}
      </button>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  )
}

// ============================================
// Add Block Button
// ============================================

interface AddBlockButtonProps {
  availableTypes: BlockType[]
  onAdd: (type: BlockType) => void
}

function AddBlockButton({ availableTypes, onAdd }: AddBlockButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative pt-4 border-t border-white/10 mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-[#C9A962] bg-[#C9A962]/10 hover:bg-[#C9A962]/20 rounded-lg transition-colors"
      >
        <PlusIcon className="w-4 h-4" />
        섹션 추가
        <ChevronIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-[#2A2A2A] border border-white/10 rounded-lg shadow-lg overflow-hidden z-10 max-h-64 overflow-y-auto">
          {availableTypes.map(type => (
            <button
              key={type}
              onClick={() => {
                onAdd(type)
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
            >
              <span className="text-lg">{BLOCK_TYPE_ICONS[type]}</span>
              <span className="text-sm text-[#F5E6D3]">{BLOCK_TYPE_LABELS[type]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// Variable Field Config
// ============================================

interface FieldConfig {
  label: string
  type: 'text' | 'textarea' | 'date' | 'time' | 'phone' | 'image' | 'gallery'
  placeholder?: string
}

const VARIABLE_FIELD_CONFIG: Partial<Record<VariablePath, FieldConfig>> = {
  // 신랑 정보
  'groom.name': { label: '신랑 이름', type: 'text', placeholder: '홍길동' },
  'groom.nameEn': { label: '신랑 영문 이름', type: 'text', placeholder: 'Gildong' },
  'groom.phone': { label: '신랑 연락처', type: 'phone' },
  'groom.fatherName': { label: '신랑 아버지 성함', type: 'text' },
  'groom.motherName': { label: '신랑 어머니 성함', type: 'text' },
  'groom.fatherPhone': { label: '신랑 아버지 연락처', type: 'phone' },
  'groom.motherPhone': { label: '신랑 어머니 연락처', type: 'phone' },

  // 신부 정보
  'bride.name': { label: '신부 이름', type: 'text', placeholder: '김영희' },
  'bride.nameEn': { label: '신부 영문 이름', type: 'text', placeholder: 'Younghee' },
  'bride.phone': { label: '신부 연락처', type: 'phone' },
  'bride.fatherName': { label: '신부 아버지 성함', type: 'text' },
  'bride.motherName': { label: '신부 어머니 성함', type: 'text' },
  'bride.fatherPhone': { label: '신부 아버지 연락처', type: 'phone' },
  'bride.motherPhone': { label: '신부 어머니 연락처', type: 'phone' },

  // 예식 정보
  'wedding.date': { label: '예식 날짜', type: 'date' },
  'wedding.time': { label: '예식 시간', type: 'time' },

  // 예식장 정보
  'venue.name': { label: '예식장 이름', type: 'text', placeholder: '○○웨딩홀' },
  'venue.hall': { label: '홀 이름', type: 'text', placeholder: '그랜드홀' },
  'venue.floor': { label: '층', type: 'text', placeholder: '5층' },
  'venue.address': { label: '주소', type: 'text', placeholder: '서울특별시 강남구...' },
  'venue.addressDetail': { label: '상세 주소', type: 'text' },
  'venue.phone': { label: '예식장 연락처', type: 'phone' },
  'venue.parkingInfo': { label: '주차 안내', type: 'textarea' },
  'venue.transportInfo': { label: '교통 안내', type: 'textarea' },

  // 사진
  'photos.main': { label: '메인 사진', type: 'image' },
  'photos.gallery': { label: '갤러리 사진', type: 'gallery' },

  // 인사말
  'greeting.title': { label: '인사말 제목', type: 'text' },
  'greeting.content': { label: '인사말 내용', type: 'textarea', placeholder: '저희 두 사람이...' },

  // 음악
  'music.url': { label: '음악 URL', type: 'text' },
  'music.title': { label: '음악 제목', type: 'text' },
  'music.artist': { label: '아티스트', type: 'text' },
}

// Block type icons (editor-panel.tsx와 동일)
const BLOCK_TYPE_ICONS: Record<BlockType, string> = {
  hero: '🖼️',
  greeting: '💌',
  calendar: '📅',
  gallery: '🎨',
  location: '📍',
  parents: '👨‍👩‍👧',
  contact: '📞',
  account: '💳',
  message: '💬',
  rsvp: '✅',
  loading: '⏳',
  quote: '✨',
  profile: '👤',
  'parents-contact': '📱',
  timeline: '📆',
  video: '🎬',
  interview: '🎤',
  transport: '🚗',
  notice: '📢',
  announcement: '📝',
  'flower-gift': '💐',
  'together-time': '⏰',
  dday: '🎯',
  'guest-snap': '📸',
  ending: '🎬',
  music: '🎵',
  custom: '🔧',
}

// ============================================
// Utility Functions
// ============================================

/**
 * 중첩된 객체에 값 설정 (immutable)
 */
function setNestedValue<T extends object>(
  obj: T,
  path: string,
  value: unknown
): T {
  const keys = path.split('.')

  // 재귀적으로 깊은 복사하면서 값 설정
  function setAt(current: Record<string, unknown>, keyIndex: number): Record<string, unknown> {
    const key = keys[keyIndex]

    if (keyIndex === keys.length - 1) {
      // 마지막 키: 값 설정
      return { ...current, [key]: value }
    }

    // 중간 키: 재귀적으로 처리
    const nextValue = current[key]
    const nextObj = (typeof nextValue === 'object' && nextValue !== null)
      ? nextValue as Record<string, unknown>
      : {}

    return {
      ...current,
      [key]: setAt(nextObj, keyIndex + 1),
    }
  }

  return setAt(obj as Record<string, unknown>, 0) as T
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

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

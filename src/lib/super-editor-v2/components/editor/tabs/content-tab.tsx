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
import { resolveBinding, isCustomVariablePath, getCustomVariableKey } from '../../../utils/binding-resolver'
import { LocationSearchField } from '../fields/location-search-field'
import { getBlockPreset } from '../../../presets/blocks'

// ============================================
// Computed Field Mapping
// ============================================

/**
 * Computed field → Source field 매핑
 * 자동 계산 필드를 편집하면 실제로 소스 필드를 수정해야 함
 */
const COMPUTED_TO_SOURCE: Record<string, VariablePath> = {
  'wedding.timeDisplay': 'wedding.time',
  'wedding.dateDisplay': 'wedding.date',
}

/**
 * 바인딩 경로가 computed field면 source field로 변환
 */
function getEditableBinding(binding: VariablePath): VariablePath {
  return (COMPUTED_TO_SOURCE[binding] as VariablePath) || binding
}

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

  // 위치 정보 일괄 변경 (address, lat, lng를 한 번에 업데이트하여 stale closure 방지)
  // 좌표 기반으로 네이버맵/카카오맵/티맵 URL도 자동 생성
  const handleLocationChange = useCallback((address: string, lat: number, lng: number) => {
    if (!onDataChange) return

    // 지도 URL 자동 생성
    const naverUrl = `https://map.naver.com/v5/?c=${lng},${lat},15,0,0,0,dh`
    const kakaoUrl = `https://map.kakao.com/link/map/${lat},${lng}`
    const tmapUrl = `https://apis.openapi.sk.com/tmap/app/routes?goalx=${lng}&goaly=${lat}`

    // 한 번에 모든 venue 필드 업데이트
    const newVenue = {
      ...document.data.venue,
      address,
      lat,
      lng,
      naverUrl,
      kakaoUrl,
      tmapUrl,
    }
    const newData = { ...document.data, venue: newVenue }
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
              onLocationChange={handleLocationChange}
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
  onLocationChange: (address: string, lat: number, lng: number) => void
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
  onLocationChange,
  onUploadImage,
}: BlockAccordionProps) {
  // 블록 내 바인딩된 요소에서 편집 가능한 필드 추출 (바인딩 기준 dedupe)
  const editableFields = useMemo(() => {
    const seenBindings = new Set<string>()
    const fields: Array<{
      elementId: string
      binding: VariablePath
      type: string
      value: unknown
    }> = []

    // 바인딩 추가 헬퍼 함수
    const addBinding = (elementId: string, binding: VariablePath, type: string) => {
      // 자동 계산 필드는 대응 입력 필드로 변환
      let finalBinding: VariablePath = binding
      if (HIDDEN_VARIABLE_PATHS.has(binding)) {
        const inputBinding = DERIVED_TO_INPUT_MAP[binding]
        if (inputBinding) {
          finalBinding = inputBinding
        } else {
          return // 매핑 없으면 숨김
        }
      }

      // Computed field는 source field로 변환 (wedding.timeDisplay → wedding.time)
      finalBinding = getEditableBinding(finalBinding)

      // 같은 바인딩은 한 번만 표시
      if (seenBindings.has(finalBinding)) return
      seenBindings.add(finalBinding)

      // gallery, notice.items, transportation 바인딩은 배열을 그대로 가져와야 함 (resolveBinding은 문자열로 변환함)
      let value: unknown
      if (finalBinding === 'photos.gallery') {
        value = data.photos?.gallery ?? []
      } else if (finalBinding === 'notice.items') {
        value = data.notice?.items ?? []
      } else if (finalBinding === 'venue.transportation.subway') {
        value = data.venue?.transportation?.subway ?? []
      } else if (finalBinding === 'venue.transportation.bus') {
        value = data.venue?.transportation?.bus ?? []
      } else if (finalBinding === 'venue.transportation.shuttle') {
        value = data.venue?.transportation?.shuttle ?? []
      } else if (finalBinding === 'venue.transportation.parking') {
        value = data.venue?.transportation?.parking ?? []
      } else if (finalBinding === 'venue.transportation.etc') {
        value = data.venue?.transportation?.etc ?? []
      } else if (isCustomVariablePath(finalBinding)) {
        const key = getCustomVariableKey(finalBinding)
        value = key ? data.custom?.[key] ?? '' : ''
      } else {
        value = resolveBinding(data, finalBinding)
      }

      fields.push({
        elementId,
        binding: finalBinding,
        type,
        value,
      })
    }

    // 요소 트리 재귀 순회 함수 (Group children 포함)
    const processElementTree = (el: Element) => {
      // 1. 직접 바인딩된 요소
      if (el.binding) {
        addBinding(el.id, el.binding, el.type)
      }

      // 2. format 속성에서 변수 추출 (예: '{parents.groom.father.name}·{parents.groom.mother.name}의 장남 {couple.groom.name}')
      const props = el.props as { format?: string; action?: string }
      if (props.format) {
        const formatVars = extractFormatVariables(props.format)
        for (const varPath of formatVars) {
          addBinding(el.id, varPath as VariablePath, el.type)
        }
      }

      // 3. contact-modal 버튼이 있으면 전화번호 필드들 자동 추가
      if (el.type === 'button' && props.action === 'contact-modal') {
        // 신랑측 전화번호
        addBinding(el.id, 'couple.groom.phone', 'phone')
        addBinding(el.id, 'parents.groom.father.phone', 'phone')
        addBinding(el.id, 'parents.groom.mother.phone', 'phone')
        // 신부측 전화번호
        addBinding(el.id, 'couple.bride.phone', 'phone')
        addBinding(el.id, 'parents.bride.father.phone', 'phone')
        addBinding(el.id, 'parents.bride.mother.phone', 'phone')
      }

      // 4. Group children 재귀 처리
      if (el.children && el.children.length > 0) {
        for (const child of el.children) {
          processElementTree(child)
        }
      }
    }

    // 최상위 요소들 순회
    for (const el of block.elements ?? []) {
      processElementTree(el)
    }

    // 5. block.elements가 비어있고 presetId가 있으면 프리셋의 bindings 사용
    if (fields.length === 0 && block.presetId) {
      const preset = getBlockPreset(block.presetId)
      if (preset?.bindings) {
        for (const binding of preset.bindings) {
          addBinding(`preset-${binding}`, binding as VariablePath, 'text')
        }
      }
    }

    return fields
  }, [block.elements, block.presetId, data])

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
        <div className="bg-[var(--ivory-50)] p-4 space-y-4">
          {/* 혼주 관련 필드는 데이터 탭에서 관리하므로 필터링 */}
          {editableFields
            .filter(field => {
              // 혼주 관련 필드는 데이터 탭에서 처리
              const familyPaths = [
                'couple.groom.name', 'couple.groom.nameEn', 'couple.groom.phone', 'couple.groom.baptismalName',
                'couple.bride.name', 'couple.bride.nameEn', 'couple.bride.phone', 'couple.bride.baptismalName',
                'parents.groom.birthOrder', 'parents.bride.birthOrder',
                'parents.groom.father.name', 'parents.groom.father.phone', 'parents.groom.father.baptismalName', 'parents.groom.father.status',
                'parents.groom.mother.name', 'parents.groom.mother.phone', 'parents.groom.mother.baptismalName', 'parents.groom.mother.status',
                'parents.bride.father.name', 'parents.bride.father.phone', 'parents.bride.father.baptismalName', 'parents.bride.father.status',
                'parents.bride.mother.name', 'parents.bride.mother.phone', 'parents.bride.mother.baptismalName', 'parents.bride.mother.status',
              ]
              // 예식/예식장 정보도 데이터 탭에서 처리
              const dataPaths = [
                'wedding.date', 'wedding.time',
                'venue.name', 'venue.hall', 'venue.address', 'venue.tel',
              ]
              return !familyPaths.includes(field.binding) && !dataPaths.includes(field.binding)
            })
            .map(field => (
              <VariableField
                key={field.binding}
                binding={field.binding}
                value={field.value}
                onChange={(value) => onFieldChange(field.binding, value)}
                onUploadImage={onUploadImage}
                onLocationChange={onLocationChange}
                data={data}
              />
            ))
          }

          {/* 모든 필드가 데이터 탭으로 이동한 경우 안내 */}
          {editableFields.filter(field => {
            const familyPaths = [
              'couple.groom.name', 'couple.groom.nameEn', 'couple.groom.phone', 'couple.groom.baptismalName',
              'couple.bride.name', 'couple.bride.nameEn', 'couple.bride.phone', 'couple.bride.baptismalName',
              'parents.groom.birthOrder', 'parents.bride.birthOrder',
              'parents.groom.father.name', 'parents.groom.father.phone', 'parents.groom.father.baptismalName', 'parents.groom.father.status',
              'parents.groom.mother.name', 'parents.groom.mother.phone', 'parents.groom.mother.baptismalName', 'parents.groom.mother.status',
              'parents.bride.father.name', 'parents.bride.father.phone', 'parents.bride.father.baptismalName', 'parents.bride.father.status',
              'parents.bride.mother.name', 'parents.bride.mother.phone', 'parents.bride.mother.baptismalName', 'parents.bride.mother.status',
            ]
            const dataPaths = [
              'wedding.date', 'wedding.time',
              'venue.name', 'venue.hall', 'venue.address', 'venue.tel',
            ]
            return !familyPaths.includes(field.binding) && !dataPaths.includes(field.binding)
          }).length === 0 && (
            <p className="text-sm text-[var(--text-light)]">
              이 섹션의 데이터는 <span className="font-medium text-[var(--sage-600)]">데이터</span> 탭에서 편집하세요
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
  /** 위치 정보 한 번에 변경 (address, lat, lng) */
  onLocationChange?: (address: string, lat: number, lng: number) => void
  /** WeddingData (location 타입에서 좌표 읽기용) */
  data?: WeddingData
}

function VariableField({ binding, value, onChange, onUploadImage, onLocationChange, data }: VariableFieldProps) {
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
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  } else {
    label = fieldConfig?.label ?? binding
  }

  const type = fieldConfig?.type ?? 'text'
  const placeholder = fieldConfig?.placeholder

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-[var(--text-body)]">
        {label}
      </label>

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

      {type === 'notice-icon' && (
        <NoticeIconField
          value={String(value ?? 'birds-orange')}
          onChange={onChange}
        />
      )}

      {type === 'notice-items' && (
        <NoticeItemsField
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
        />
      )}

      {type === 'string-list' && (
        <StringListField
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          placeholder={placeholder}
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
              relative aspect-square rounded-lg overflow-hidden cursor-move bg-[var(--sand-100)]
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
              transition-colors bg-white
              ${isDragging
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
        <div className="relative aspect-video bg-[var(--sand-100)] rounded-lg overflow-hidden">
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
        className="w-full px-3 py-2 bg-white border border-dashed border-[var(--sand-200)] rounded-lg text-[var(--text-muted)] text-sm hover:bg-[var(--sage-50)] hover:border-[var(--sage-400)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-[var(--sage-500)] border-t-transparent rounded-full animate-spin" />
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
// String List Field (단순 문자열 리스트)
// ============================================

interface StringListFieldProps {
  value: string[]
  onChange: (value: unknown) => void
  placeholder?: string
}

function StringListField({ value, onChange, placeholder }: StringListFieldProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // 아이템 추가
  const handleAdd = useCallback(() => {
    onChange([...value, ''])
  }, [value, onChange])

  // 아이템 삭제
  const handleDelete = useCallback((index: number) => {
    const updated = value.filter((_, i) => i !== index)
    onChange(updated)
  }, [value, onChange])

  // 아이템 수정
  const handleItemChange = useCallback((index: number, newValue: string) => {
    const updated = value.map((item, i) =>
      i === index ? newValue : item
    )
    onChange(updated)
  }, [value, onChange])

  // 드래그 시작
  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index)
  }, [])

  // 드래그 오버 (순서 변경)
  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newValue = [...value]
    const [dragged] = newValue.splice(draggedIndex, 1)
    newValue.splice(index, 0, dragged)
    onChange(newValue)
    setDraggedIndex(index)
  }, [draggedIndex, value, onChange])

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
  { value: 'birds-blue', label: '파란새', src: '/assets/notice1.svg' },
  { value: 'birds-orange', label: '주황새', src: '/assets/notice2.svg' },
  { value: 'birds-green', label: '초록새', src: '/assets/notice3.svg' },
  { value: 'none', label: '없음', src: null },
] as const

interface NoticeIconFieldProps {
  value: string
  onChange: (value: unknown) => void
}

function NoticeIconField({ value, onChange }: NoticeIconFieldProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {NOTICE_ICON_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`
            relative p-2 rounded-lg border-2 transition-all
            ${value === option.value
              ? 'border-[var(--sage-500)] bg-[var(--sage-50)]'
              : 'border-[var(--sand-100)] bg-white hover:border-[var(--sand-200)]'
            }
          `}
        >
          {option.src ? (
            <img
              src={option.src}
              alt={option.label}
              className="w-full h-10 object-contain"
            />
          ) : (
            <div className="w-full h-10 flex items-center justify-center text-xs text-[var(--text-muted)]">
              없음
            </div>
          )}
          <span className="block mt-1 text-xs text-center text-[var(--text-body)]">
            {option.label}
          </span>
        </button>
      ))}
    </div>
  )
}

interface NoticeItemsFieldProps {
  value: NoticeItemData[]
  onChange: (value: unknown) => void
}

function NoticeItemsField({ value, onChange }: NoticeItemsFieldProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // 아이템 추가
  const handleAdd = useCallback(() => {
    const newItem: NoticeItemData = {
      title: '',
      content: '',
      iconType: 'rings',
    }
    onChange([...value, newItem])
  }, [value, onChange])

  // 아이템 삭제
  const handleDelete = useCallback((index: number) => {
    const updated = value.filter((_, i) => i !== index)
    onChange(updated)
  }, [value, onChange])

  // 아이템 수정
  const handleItemChange = useCallback((index: number, field: keyof NoticeItemData, fieldValue: string) => {
    const updated = value.map((item, i) =>
      i === index ? { ...item, [field]: fieldValue } : item
    )
    onChange(updated)
  }, [value, onChange])

  // 드래그 시작
  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index)
  }, [])

  // 드래그 오버 (순서 변경)
  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newValue = [...value]
    const [dragged] = newValue.splice(draggedIndex, 1)
    newValue.splice(index, 0, dragged)
    onChange(newValue)
    setDraggedIndex(index)
  }, [draggedIndex, value, onChange])

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

          {/* 아이콘 선택 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-light)]">아이콘:</span>
            <select
              value={item.iconType || 'rings'}
              onChange={(e) => handleItemChange(index, 'iconType', e.target.value)}
              className="px-2 py-1 text-xs bg-[var(--ivory-50)] border border-[var(--sand-100)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--sage-500)]"
            >
              <option value="rings">💍 반지</option>
              <option value="birds">🕊️ 새</option>
              <option value="hearts">💕 하트</option>
            </select>
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
// Add Block Button
// ============================================

interface AddBlockButtonProps {
  availableTypes: BlockType[]
  onAdd: (type: BlockType) => void
}

function AddBlockButton({ availableTypes, onAdd }: AddBlockButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative pt-4 border-t border-[var(--sand-100)] mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-[var(--sage-600)] bg-[var(--sage-50)] hover:bg-[var(--sage-100)] rounded-lg transition-colors"
      >
        <PlusIcon className="w-4 h-4" />
        섹션 추가
        <ChevronIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-[var(--sand-100)] rounded-lg shadow-lg overflow-hidden z-10 max-h-64 overflow-y-auto">
          {availableTypes.map(type => (
            <button
              key={type}
              onClick={() => {
                onAdd(type)
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--sage-50)] transition-colors"
            >
              <span className="text-lg">{BLOCK_TYPE_ICONS[type]}</span>
              <span className="text-sm text-[var(--text-primary)]">{BLOCK_TYPE_LABELS[type]}</span>
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
  type: 'text' | 'textarea' | 'date' | 'time' | 'phone' | 'image' | 'gallery' | 'location' | 'notice-icon' | 'notice-items' | 'string-list'
  placeholder?: string
}

// 자동 계산되는 필드 (편집기에서 숨김)
const HIDDEN_VARIABLE_PATHS: Set<string> = new Set([
  // 날짜/시간 파생 필드
  'wedding.dateDisplay',
  'wedding.timeDisplay',
  'wedding.dday',
  'wedding.month',
  'wedding.day',
  'wedding.weekday',
  // 카운트다운 (실시간 계산)
  'countdown.days',
  'countdown.hours',
  'countdown.minutes',
  'countdown.seconds',
  // 복합 객체 필드 (JSON 형태로 표시되므로 숨김)
  'venue',
])

// 자동 계산 필드 → 입력 필드 매핑 (표시용 바인딩 대신 입력용 바인딩 표시)
const DERIVED_TO_INPUT_MAP: Record<string, VariablePath> = {
  'wedding.dateDisplay': 'wedding.date',
  'wedding.timeDisplay': 'wedding.time',
  'wedding.dday': 'wedding.date',
  'wedding.month': 'wedding.date',
  'wedding.day': 'wedding.date',
  'wedding.weekday': 'wedding.date',
  'countdown.days': 'wedding.date',
  'countdown.hours': 'wedding.date',
  'countdown.minutes': 'wedding.date',
  'countdown.seconds': 'wedding.date',
}

const VARIABLE_FIELD_CONFIG: Partial<Record<VariablePath, FieldConfig>> = {
  // 커플 정보 (신규)
  'couple.groom.name': { label: '신랑 이름', type: 'text', placeholder: '홍길동' },
  'couple.groom.phone': { label: '신랑 연락처', type: 'phone' },
  'couple.groom.baptismalName': { label: '신랑 세례명', type: 'text', placeholder: '미카엘' },
  'couple.bride.name': { label: '신부 이름', type: 'text', placeholder: '김영희' },
  'couple.bride.phone': { label: '신부 연락처', type: 'phone' },
  'couple.bride.baptismalName': { label: '신부 세례명', type: 'text', placeholder: '마리아' },

  // 혼주 정보 (신규)
  'parents.groom.birthOrder': { label: '신랑 서열', type: 'text', placeholder: '장남' },
  'parents.groom.father.name': { label: '신랑 아버지 성함', type: 'text' },
  'parents.groom.father.phone': { label: '신랑 아버지 연락처', type: 'phone' },
  'parents.groom.father.baptismalName': { label: '신랑 아버지 세례명', type: 'text' },
  'parents.groom.mother.name': { label: '신랑 어머니 성함', type: 'text' },
  'parents.groom.mother.phone': { label: '신랑 어머니 연락처', type: 'phone' },
  'parents.groom.mother.baptismalName': { label: '신랑 어머니 세례명', type: 'text' },
  'parents.bride.birthOrder': { label: '신부 서열', type: 'text', placeholder: '차녀' },
  'parents.bride.father.name': { label: '신부 아버지 성함', type: 'text' },
  'parents.bride.father.phone': { label: '신부 아버지 연락처', type: 'phone' },
  'parents.bride.father.baptismalName': { label: '신부 아버지 세례명', type: 'text' },
  'parents.bride.mother.name': { label: '신부 어머니 성함', type: 'text' },
  'parents.bride.mother.phone': { label: '신부 어머니 연락처', type: 'phone' },
  'parents.bride.mother.baptismalName': { label: '신부 어머니 세례명', type: 'text' },

  // 신랑 정보 (레거시)
  'groom.name': { label: '신랑 이름', type: 'text', placeholder: '홍길동' },
  'groom.nameEn': { label: '신랑 영문 이름', type: 'text', placeholder: 'Gildong' },
  'groom.phone': { label: '신랑 연락처', type: 'phone' },
  'groom.fatherName': { label: '신랑 아버지 성함', type: 'text' },
  'groom.motherName': { label: '신랑 어머니 성함', type: 'text' },
  'groom.fatherPhone': { label: '신랑 아버지 연락처', type: 'phone' },
  'groom.motherPhone': { label: '신랑 어머니 연락처', type: 'phone' },

  // 신부 정보 (레거시)
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
  'wedding.timeDisplay': { label: '예식 시간', type: 'time' },

  // 예식장 정보
  'venue.name': { label: '예식장 이름', type: 'text', placeholder: '○○웨딩홀' },
  'venue.hall': { label: '홀 이름', type: 'text', placeholder: '그랜드홀' },
  'venue.floor': { label: '층', type: 'text', placeholder: '5층' },
  'venue.address': { label: '주소', type: 'location' },
  'venue.addressDetail': { label: '상세 주소', type: 'text' },
  'venue.phone': { label: '예식장 연락처', type: 'phone' },
  'venue.parkingInfo': { label: '주차 안내', type: 'textarea' },
  'venue.transportInfo': { label: '교통 안내', type: 'textarea' },

  // 교통 정보 (리스트)
  'venue.transportation.subway': { label: '지하철', type: 'string-list', placeholder: '2호선 삼성역 5번출구 10분 거리' },
  'venue.transportation.bus': { label: '버스', type: 'string-list', placeholder: '삼성역 5번출구 앞 정류장' },
  'venue.transportation.shuttle': { label: '셔틀버스', type: 'string-list', placeholder: '삼성역 5번출구 앞 (10시부터 20분 간격)' },
  'venue.transportation.parking': { label: '주차', type: 'string-list', placeholder: '지하 1~3층 주차장 이용' },
  'venue.transportation.etc': { label: '전세 버스', type: 'string-list', placeholder: '출발 일시: 3월 22일 오전 9시' },

  // 사진
  'photos.main': { label: '메인 사진', type: 'image' },
  'photos.gallery': { label: '갤러리 사진', type: 'gallery' },

  // 엔딩
  'ending.photo': { label: '엔딩 사진', type: 'image' },

  // 인사말
  'greeting.title': { label: '인사말 제목', type: 'text' },
  'greeting.content': { label: '인사말 내용', type: 'textarea', placeholder: '저희 두 사람이...' },

  // 공지사항
  'notice.icon': { label: '상단 아이콘', type: 'notice-icon' },
  'notice.title': { label: '공지 제목', type: 'text', placeholder: '포토부스 안내' },
  'notice.description': { label: '공지 설명', type: 'textarea', placeholder: '저희 두 사람의 결혼식을\n기억하실 수 있도록...' },
  'notice.items': { label: '공지 항목', type: 'notice-items' },

  // 음악
  'music.url': { label: '음악 URL', type: 'text' },
  'music.title': { label: '음악 제목', type: 'text' },
  'music.artist': { label: '아티스트', type: 'text' },
}

// Block type icons (editor-panel.tsx와 동일)
const BLOCK_TYPE_ICONS: Record<BlockType, string> = {
  hero: '🖼️',
  'greeting-parents': '💌',
  profile: '👤',
  calendar: '📅',
  gallery: '🎨',
  rsvp: '✅',
  location: '📍',
  notice: '📢',
  account: '💳',
  message: '💬',
  wreath: '💐',
  ending: '🎬',
  contact: '📞',
  music: '🎵',
  loading: '⏳',
  custom: '🔧',
}

// ============================================
// Utility Functions
// ============================================

/**
 * format 문자열에서 변수 경로 추출
 * 예: '{parents.groom.father.name}·{parents.groom.mother.name}의 장남 {couple.groom.name}'
 *     → ['parents.groom.father.name', 'parents.groom.mother.name', 'couple.groom.name']
 */
function extractFormatVariables(format: string): string[] {
  const regex = /\{([^}]+)\}/g
  const matches: string[] = []
  let match: RegExpExecArray | null

  while ((match = regex.exec(format)) !== null) {
    matches.push(match[1])
  }

  return matches
}

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

function DragIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8-12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
    </svg>
  )
}

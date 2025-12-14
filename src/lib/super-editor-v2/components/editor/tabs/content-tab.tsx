'use client'

/**
 * Super Editor v2 - Content Tab
 *
 * Section-First 패턴 구현
 * 블록(섹션) 아코디언 + 변수 필드 편집
 */

import { useState, useCallback, useMemo, type ReactNode } from 'react'
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
}: BlockAccordionProps) {
  // 블록 내 바인딩된 요소에서 편집 가능한 필드 추출
  const editableFields = useMemo(() => {
    return block.elements
      .filter(el => el.binding)
      .map(el => ({
        elementId: el.id,
        binding: el.binding!,
        type: el.type,
        value: resolveBinding(data, el.binding!),
      }))
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
}

function VariableField({ binding, value, onChange }: VariableFieldProps) {
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
        />
      )}
    </div>
  )
}

// ============================================
// Image Field
// ============================================

interface ImageFieldProps {
  value: string
  onChange: (value: string) => void
}

function ImageField({ value, onChange }: ImageFieldProps) {
  return (
    <div className="space-y-2">
      {value && (
        <div className="relative aspect-video bg-[#2A2A2A] rounded-lg overflow-hidden">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      <button
        className="w-full px-3 py-2 bg-[#2A2A2A] border border-dashed border-white/20 rounded-lg text-[#F5E6D3]/60 text-sm hover:bg-[#333333] hover:border-white/30 transition-colors"
      >
        {value ? '이미지 변경' : '이미지 업로드'}
      </button>
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
  type: 'text' | 'textarea' | 'date' | 'time' | 'phone' | 'image'
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
 * 중첩된 객체에 값 설정
 */
function setNestedValue<T extends object>(
  obj: T,
  path: string,
  value: unknown
): T {
  const keys = path.split('.')
  const result = { ...obj }

  let current: Record<string, unknown> = result as Record<string, unknown>
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    current[key] = { ...(current[key] as object) }
    current = current[key] as Record<string, unknown>
  }

  current[keys[keys.length - 1]] = value
  return result
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

'use client'

/**
 * Super Editor v2 - Content Tab
 *
 * Section-First 패턴 구현
 * 블록(섹션) 아코디언 + on/off 토글 + 순서 변경
 *
 * 데이터 입력은 DataTab에서 처리
 */

import { useCallback, useMemo, useState } from 'react'
import type {
  EditorDocument,
  Block,
  BlockType,
  WeddingData,
  VariablePath,
} from '../../../schema/types'
import { SectionHeader, BLOCK_TYPE_LABELS } from '../editor-panel'
import { extractEditableFields, hasEditableFields } from '../../../utils/field-extractor'
import { isSharedField, BLOCK_TYPE_ICONS } from '../../../config/variable-field-config'

// ============================================
// Types
// ============================================

export interface ContentTabProps {
  /** 문서 데이터 */
  document: EditorDocument
  /** 펼쳐진 블록 ID */
  expandedBlockId: string | null
  /** 현재 화면에 보이는 블록 ID */
  visibleBlockId?: string | null
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
  /** 탭 전환 콜백 */
  onTabChange?: (tab: 'data') => void
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function ContentTab({
  document,
  expandedBlockId,
  visibleBlockId,
  onExpandedBlockChange,
  onBlocksChange,
  onDataChange,
  onAddBlock,
  onTabChange,
  className = '',
}: ContentTabProps) {
  // 블록 토글
  const handleBlockToggle = useCallback(
    (blockId: string) => {
      if (!onBlocksChange) return

      const newBlocks = document.blocks.map((block) =>
        block.id === blockId ? { ...block, enabled: !block.enabled } : block
      )
      onBlocksChange(newBlocks)
    },
    [document.blocks, onBlocksChange]
  )

  // 블록 순서 변경
  const handleBlockMove = useCallback(
    (blockId: string, direction: 'up' | 'down') => {
      if (!onBlocksChange) return

      const currentIndex = document.blocks.findIndex((b) => b.id === blockId)
      if (currentIndex === -1) return

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (newIndex < 0 || newIndex >= document.blocks.length) return

      const newBlocks = [...document.blocks]
      const [moved] = newBlocks.splice(currentIndex, 1)
      newBlocks.splice(newIndex, 0, moved)
      onBlocksChange(newBlocks)
    },
    [document.blocks, onBlocksChange]
  )

  // 블록 펼치기/접기
  const handleExpand = useCallback(
    (blockId: string) => {
      if (expandedBlockId === blockId) {
        onExpandedBlockChange(null)
      } else {
        onExpandedBlockChange(blockId)
      }
    },
    [expandedBlockId, onExpandedBlockChange]
  )

  // 고정 블록 (hero, loading 등 순서 변경 불가)
  const fixedBlockTypes: BlockType[] = ['hero', 'loading']

  // 사용 가능한 블록 타입 (추가 가능)
  const availableBlockTypes = useMemo(() => {
    const usedTypes = new Set(document.blocks.map((b) => b.type))
    return Object.keys(BLOCK_TYPE_LABELS).filter(
      (type) => !usedTypes.has(type as BlockType)
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
              isVisible={visibleBlockId === block.id}
              onExpand={() => handleExpand(block.id)}
              onToggle={() => handleBlockToggle(block.id)}
              onMoveUp={() => handleBlockMove(block.id, 'up')}
              onMoveDown={() => handleBlockMove(block.id, 'down')}
              canMoveUp={!isFixed && index > 0}
              canMoveDown={!isFixed && index < document.blocks.length - 1}
              fixed={isFixed}
              onGoToData={() => onTabChange?.('data')}
            />
          )
        })}

        {/* 블록 추가 버튼 */}
        {onAddBlock && availableBlockTypes.length > 0 && (
          <AddBlockButton availableTypes={availableBlockTypes} onAdd={onAddBlock} />
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
  isVisible?: boolean
  onExpand: () => void
  onToggle: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
  fixed: boolean
  /** 데이터 탭으로 이동 */
  onGoToData?: () => void
}

function BlockAccordion({
  block,
  data,
  expanded,
  isVisible = false,
  onExpand,
  onToggle,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  fixed,
  onGoToData,
}: BlockAccordionProps) {
  // 편집 가능한 필드 수 계산 (공유 필드 제외)
  const editableFieldCount = useMemo(() => {
    const allFields = extractEditableFields(block, data)
    const nonSharedFields = allFields.filter((field) => !isSharedField(field.binding))
    return nonSharedFields.length
  }, [block, data])

  return (
    <div className="rounded-lg overflow-hidden">
      <SectionHeader
        blockType={block.type}
        label={BLOCK_TYPE_LABELS[block.type] || block.type}
        enabled={block.enabled}
        expanded={expanded}
        isVisible={isVisible}
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
        <div className="bg-[var(--ivory-50)] p-4">
          {editableFieldCount > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-[var(--text-muted)]">
                이 섹션에는 <span className="font-medium text-[var(--sage-600)]">{editableFieldCount}개</span>의
                편집 가능한 항목이 있습니다.
              </p>
              <button
                type="button"
                onClick={onGoToData}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-[var(--sage-500)] text-white text-sm font-medium rounded-lg hover:bg-[var(--sage-600)] transition-colors"
              >
                <EditIcon className="w-4 h-4" />
                데이터 편집하기
              </button>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-light)]">
              이 섹션에는 편집 가능한 항목이 없습니다.
            </p>
          )}
        </div>
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
          {availableTypes.map((type) => (
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

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}

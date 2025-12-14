'use client'

/**
 * Super Editor v2 - Block Selector
 *
 * AI 편집 대상 블록 선택 컴포넌트
 * - 블록 목록 표시
 * - 단일/다중 선택
 * - 전체 선택
 */

import { useCallback, useState, useMemo } from 'react'
import type { Block, BlockType } from '../../../schema/types'

// ============================================
// Types
// ============================================

export interface BlockSelectorProps {
  /** 블록 목록 */
  blocks: Block[]
  /** 선택된 블록 ID */
  selectedIds: string[]
  /** 선택 변경 콜백 */
  onSelectionChange: (ids: string[]) => void
  /** 다중 선택 허용 */
  multiple?: boolean
  /** 비활성화된 블록 숨기기 */
  hideDisabled?: boolean
  /** 추가 className */
  className?: string
}

// ============================================
// Constants
// ============================================

const BLOCK_TYPE_LABELS: Partial<Record<BlockType, string>> = {
  hero: '메인 히어로',
  greeting: '인사말',
  calendar: '캘린더',
  gallery: '갤러리',
  location: '오시는 길',
  parents: '혼주 소개',
  contact: '연락처',
  account: '축의금',
  message: '방명록',
  rsvp: 'RSVP',
  loading: '로딩',
  quote: '글귀',
  profile: '프로필',
  'parents-contact': '혼주 연락처',
  timeline: '타임라인',
  video: '영상',
  interview: '인터뷰',
  transport: '교통안내',
  notice: '안내사항',
  announcement: '안내문',
  'flower-gift': '화환',
  'together-time': '함께한 시간',
  dday: 'D-Day',
  'guest-snap': '게스트스냅',
  ending: '엔딩',
  music: 'BGM',
  custom: '커스텀',
}

const BLOCK_TYPE_ICONS: Partial<Record<BlockType, string>> = {
  hero: '✨',
  greeting: '💌',
  calendar: '📅',
  gallery: '🖼️',
  location: '📍',
  parents: '👨‍👩‍👧',
  contact: '📞',
  account: '💳',
  message: '📝',
  rsvp: '📋',
  loading: '⏳',
  quote: '💭',
  profile: '👤',
  'parents-contact': '📱',
  timeline: '📖',
  video: '🎬',
  interview: '🎤',
  transport: '🚗',
  notice: '📢',
  announcement: '📄',
  'flower-gift': '💐',
  'together-time': '⏰',
  dday: '🗓️',
  'guest-snap': '📸',
  ending: '🎬',
  music: '🎵',
  custom: '⚙️',
}

// ============================================
// Component
// ============================================

export function BlockSelector({
  blocks,
  selectedIds,
  onSelectionChange,
  multiple = false,
  hideDisabled = false,
  className = '',
}: BlockSelectorProps) {
  // 표시할 블록 필터링
  const visibleBlocks = useMemo(() => {
    return hideDisabled ? blocks.filter(b => b.enabled) : blocks
  }, [blocks, hideDisabled])

  // 전체 선택 여부
  const isAllSelected = useMemo(() => {
    return visibleBlocks.length > 0 && selectedIds.length === visibleBlocks.length
  }, [visibleBlocks, selectedIds])

  // 부분 선택 여부
  const isPartialSelected = useMemo(() => {
    return selectedIds.length > 0 && selectedIds.length < visibleBlocks.length
  }, [visibleBlocks, selectedIds])

  // 블록 선택/해제
  const handleBlockToggle = useCallback((blockId: string) => {
    if (multiple) {
      if (selectedIds.includes(blockId)) {
        onSelectionChange(selectedIds.filter(id => id !== blockId))
      } else {
        onSelectionChange([...selectedIds, blockId])
      }
    } else {
      onSelectionChange(selectedIds.includes(blockId) ? [] : [blockId])
    }
  }, [multiple, selectedIds, onSelectionChange])

  // 전체 선택/해제
  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      onSelectionChange([])
    } else {
      onSelectionChange(visibleBlocks.map(b => b.id))
    }
  }, [isAllSelected, visibleBlocks, onSelectionChange])

  return (
    <div className={`space-y-2 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-[#F5E6D3]/50">편집 대상 선택</span>

        {/* 전체 선택 (다중 선택일 때만) */}
        {multiple && (
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs text-[#C9A962] hover:text-[#C9A962]/80 transition-colors"
          >
            {isAllSelected ? '전체 해제' : '전체 선택'}
          </button>
        )}
      </div>

      {/* 블록 목록 */}
      <div className="space-y-1">
        {visibleBlocks.map((block) => {
          const isSelected = selectedIds.includes(block.id)

          return (
            <button
              key={block.id}
              type="button"
              onClick={() => handleBlockToggle(block.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg
                text-left text-sm transition-colors
                ${isSelected
                  ? 'bg-[#C9A962]/20 text-[#C9A962] border border-[#C9A962]/30'
                  : 'bg-white/5 text-[#F5E6D3]/70 border border-transparent hover:bg-white/10'
                }
                ${!block.enabled ? 'opacity-50' : ''}
              `}
            >
              {/* 체크박스 (다중 선택) 또는 라디오 (단일 선택) */}
              <div
                className={`
                  w-4 h-4 rounded flex-shrink-0 flex items-center justify-center
                  ${multiple ? 'rounded' : 'rounded-full'}
                  ${isSelected
                    ? 'bg-[#C9A962] text-[#1a1a1a]'
                    : 'border border-white/30'
                  }
                `}
              >
                {isSelected && (
                  multiple ? (
                    <CheckIcon className="w-3 h-3" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-[#1a1a1a]" />
                  )
                )}
              </div>

              {/* 블록 아이콘 */}
              <span className="text-base">
                {BLOCK_TYPE_ICONS[block.type] || '📦'}
              </span>

              {/* 블록 정보 */}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {BLOCK_TYPE_LABELS[block.type] || block.type}
                </p>
                {block.elements && block.elements.length > 0 && (
                  <p className="text-xs text-[#F5E6D3]/40">
                    {block.elements.length}개 요소
                  </p>
                )}
              </div>

              {/* 비활성화 표시 */}
              {!block.enabled && (
                <span className="text-xs text-[#F5E6D3]/40 px-1.5 py-0.5 bg-white/5 rounded">
                  비활성
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* 선택 요약 */}
      {multiple && selectedIds.length > 0 && (
        <p className="text-xs text-[#C9A962] px-1">
          {selectedIds.length}개 블록 선택됨
        </p>
      )}

      {/* 빈 상태 */}
      {visibleBlocks.length === 0 && (
        <p className="text-sm text-[#F5E6D3]/40 text-center py-4">
          편집 가능한 블록이 없습니다
        </p>
      )}
    </div>
  )
}

// ============================================
// Compact Block Selector (드롭다운용)
// ============================================

export interface CompactBlockSelectorProps {
  /** 블록 목록 */
  blocks: Block[]
  /** 선택된 블록 ID */
  selectedId: string | null
  /** 선택 변경 콜백 */
  onSelect: (id: string | null) => void
  /** 추가 className */
  className?: string
}

export function CompactBlockSelector({
  blocks,
  selectedId,
  onSelect,
  className = '',
}: CompactBlockSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedBlock = useMemo(() => {
    return blocks.find(b => b.id === selectedId)
  }, [blocks, selectedId])

  const handleSelect = useCallback((id: string | null) => {
    onSelect(id)
    setIsOpen(false)
  }, [onSelect])

  return (
    <div className={`relative ${className}`}>
      {/* 선택 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg
          bg-white/5 text-[#F5E6D3] border border-white/10
          hover:bg-white/10 transition-colors text-sm
        "
      >
        <span className="flex items-center gap-2 min-w-0">
          {selectedBlock ? (
            <>
              <span>{BLOCK_TYPE_ICONS[selectedBlock.type] || '📦'}</span>
              <span className="truncate">{BLOCK_TYPE_LABELS[selectedBlock.type] || selectedBlock.type}</span>
            </>
          ) : (
            <span className="text-[#F5E6D3]/50">전체 문서</span>
          )}
        </span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 드롭다운 */}
      {isOpen && (
        <div
          className="
            absolute top-full left-0 right-0 mt-1 py-1 rounded-lg
            bg-[#2a2a2a] border border-white/10 shadow-xl z-10
          "
        >
          {/* 전체 문서 옵션 */}
          <button
            type="button"
            onClick={() => handleSelect(null)}
            className={`
              w-full flex items-center gap-2 px-3 py-2 text-sm text-left
              transition-colors
              ${selectedId === null
                ? 'bg-[#C9A962]/20 text-[#C9A962]'
                : 'text-[#F5E6D3] hover:bg-white/10'
              }
            `}
          >
            <span>📄</span>
            <span>전체 문서</span>
          </button>

          <div className="my-1 border-t border-white/10" />

          {/* 개별 블록 */}
          {blocks.filter(b => b.enabled).map((block) => (
            <button
              key={block.id}
              type="button"
              onClick={() => handleSelect(block.id)}
              className={`
                w-full flex items-center gap-2 px-3 py-2 text-sm text-left
                transition-colors
                ${selectedId === block.id
                  ? 'bg-[#C9A962]/20 text-[#C9A962]'
                  : 'text-[#F5E6D3] hover:bg-white/10'
                }
              `}
            >
              <span>{BLOCK_TYPE_ICONS[block.type] || '📦'}</span>
              <span>{BLOCK_TYPE_LABELS[block.type] || block.type}</span>
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

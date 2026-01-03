/**
 * Floating Preset Sidebar
 *
 * 프리뷰 우측에 표시되는 플로팅 사이드바
 * 선택된 블록의 프리셋을 변경할 수 있음
 */

'use client'

import { useState, useMemo } from 'react'
import type { Block, BlockType } from '@/lib/super-editor-v2/schema/types'
import {
  getBlockPresetsByType,
  type BlockPreset,
} from '@/lib/super-editor-v2/presets/blocks'

// ============================================
// Types
// ============================================

interface FloatingPresetSidebarProps {
  /** 선택된 블록 */
  selectedBlock: Block | null
  /** 프리셋 변경 콜백 */
  onPresetChange: (blockId: string, presetId: string) => void
  /** 사이드바 열림 상태 */
  isOpen: boolean
  /** 열림 상태 변경 콜백 */
  onOpenChange: (open: boolean) => void
}

// 블록 타입별 한글 이름
const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  hero: '히어로',
  'greeting-parents': '인사말/혼주',
  profile: '프로필',
  calendar: '예식일시',
  gallery: '갤러리',
  rsvp: '참석 여부',
  location: '오시는길',
  notice: '공지사항',
  account: '축의금',
  message: '방명록',
  wreath: '화환 안내',
  ending: '엔딩',
  contact: '연락처',
  music: '음악',
  loading: '로딩',
  custom: '커스텀',
  interview: '인터뷰',
}

// ============================================
// Component
// ============================================

export function FloatingPresetSidebar({
  selectedBlock,
  onPresetChange,
  isOpen,
  onOpenChange,
}: FloatingPresetSidebarProps) {
  // 선택된 블록 타입의 프리셋 목록
  const presets = useMemo(() => {
    if (!selectedBlock) return []
    return getBlockPresetsByType(selectedBlock.type)
  }, [selectedBlock])

  const blockTypeLabel = selectedBlock
    ? (BLOCK_TYPE_LABELS[selectedBlock.type] || selectedBlock.type)
    : ''

  return (
    <>
      {/* 토글 버튼 (항상 표시) */}
      {!isOpen && (
        <button
          onClick={() => onOpenChange(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-[#2a2a2a] border border-white/10 rounded-l-lg p-2 hover:bg-[#3a3a3a] transition-colors shadow-lg"
          title="프리셋 변경"
        >
          <LayoutIcon className="w-5 h-5 text-[#C9A962]" />
        </button>
      )}

      {/* 사이드바 패널 */}
      <div
        className={`
          absolute right-0 top-0 bottom-0 z-20
          bg-[#1a1a1a]/95 backdrop-blur-sm border-l border-white/10
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ width: '280px' }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h3 className="text-sm font-medium text-[#F5E6D3]">프리셋 변경</h3>
            <p className="text-xs text-[#F5E6D3]/60 mt-0.5">
              {selectedBlock ? `${blockTypeLabel} 블록` : '블록을 선택하세요'}
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <CloseIcon className="w-4 h-4 text-[#F5E6D3]/60" />
          </button>
        </div>

        {/* 프리셋 목록 */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100% - 60px)' }}>
          {!selectedBlock ? (
            <div className="text-center py-8">
              <LayoutIcon className="w-12 h-12 text-[#F5E6D3]/20 mx-auto mb-3" />
              <p className="text-[#F5E6D3]/40 text-sm">
                왼쪽 패널에서 블록을 선택하면<br />
                프리셋을 변경할 수 있습니다.
              </p>
            </div>
          ) : presets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#F5E6D3]/40 text-sm">
                {blockTypeLabel} 블록에는<br />
                아직 프리셋이 없습니다.
              </p>
              <p className="text-[#F5E6D3]/30 text-xs mt-2">
                calendar, profile 블록에서<br />
                프리셋을 사용할 수 있습니다.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {presets.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  isSelected={selectedBlock.presetId === preset.id}
                  onClick={() => onPresetChange(selectedBlock.id, preset.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ============================================
// Sub Components
// ============================================

interface PresetCardProps {
  preset: BlockPreset
  isSelected: boolean
  onClick: () => void
}

function PresetCard({ preset, isSelected, onClick }: PresetCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-3 rounded-lg border transition-all
        ${isSelected
          ? 'border-[#C9A962] bg-[#C9A962]/10'
          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
        }
      `}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className={`text-sm font-medium ${isSelected ? 'text-[#C9A962]' : 'text-[#F5E6D3]'}`}>
            {preset.nameKo}
          </h4>
          <p className="text-xs text-[#F5E6D3]/50 mt-0.5">{preset.name}</p>
        </div>
        {isSelected && (
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#C9A962] flex items-center justify-center">
            <CheckIcon className="w-3 h-3 text-[#0A0806]" />
          </span>
        )}
      </div>

      {/* 설명 */}
      <p className="text-xs text-[#F5E6D3]/60 mt-2 line-clamp-2">
        {preset.description}
      </p>

      {/* 태그 */}
      <div className="flex flex-wrap gap-1 mt-2">
        {preset.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="px-1.5 py-0.5 text-[10px] rounded bg-white/10 text-[#F5E6D3]/60"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 복잡도 */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[10px] text-[#F5E6D3]/40">복잡도:</span>
        <ComplexityIndicator level={preset.complexity} />
      </div>
    </button>
  )
}

function ComplexityIndicator({ level }: { level: 'low' | 'medium' | 'high' }) {
  const dots = level === 'low' ? 1 : level === 'medium' ? 2 : 3

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i <= dots ? 'bg-[#C9A962]' : 'bg-white/20'
          }`}
        />
      ))}
    </div>
  )
}

// ============================================
// Icons
// ============================================

function LayoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
      />
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}

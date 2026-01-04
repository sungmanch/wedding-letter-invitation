/**
 * Preset Sidebar
 *
 * 프리뷰 우측에 항상 표시되는 프리셋 선택 패널
 * 스크롤 위치에 따라 현재 보이는 블록의 프리셋 목록을 자동 표시
 */

'use client'

import { useMemo } from 'react'
import type { Block, BlockType } from '@/lib/super-editor-v2/schema/types'
import {
  getBlockPresetsByType,
  type BlockPreset,
} from '@/lib/super-editor-v2/presets/blocks'

// ============================================
// Types
// ============================================

interface PresetSidebarProps {
  /** 현재 화면에 보이는 블록 */
  visibleBlock: Block | null
  /** 프리셋 변경 콜백 */
  onPresetChange: (blockId: string, presetId: string) => void
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

export function PresetSidebar({
  visibleBlock,
  onPresetChange,
}: PresetSidebarProps) {
  // 현재 보이는 블록 타입의 프리셋 목록
  const presets = useMemo(() => {
    if (!visibleBlock) return []
    return getBlockPresetsByType(visibleBlock.type)
  }, [visibleBlock])

  const blockTypeLabel = visibleBlock
    ? (BLOCK_TYPE_LABELS[visibleBlock.type] || visibleBlock.type)
    : ''

  return (
    <div className="w-[280px] flex-shrink-0 bg-[#1a1a1a] border-l border-white/10 flex flex-col h-full">
      {/* 헤더 */}
      <div className="flex-shrink-0 p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-[#F5E6D3]">프리셋 선택</h3>
          {visibleBlock && (
            <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-[#C9A962]/20 text-[#C9A962] border border-[#C9A962]/30">
              현재화면
            </span>
          )}
        </div>
        <p className="text-xs text-[#F5E6D3]/60 mt-1">
          {visibleBlock ? `${blockTypeLabel} 블록` : '스크롤하여 블록 선택'}
        </p>
      </div>

      {/* 프리셋 목록 */}
      <div className="flex-1 p-4 overflow-y-auto">
        {!visibleBlock ? (
          <div className="text-center py-8">
            <LayoutIcon className="w-12 h-12 text-[#F5E6D3]/20 mx-auto mb-3" />
            <p className="text-[#F5E6D3]/40 text-sm">
              프리뷰를 스크롤하면<br />
              해당 블록의 프리셋이<br />
              여기에 표시됩니다.
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
                isSelected={visibleBlock.presetId === preset.id}
                onClick={() => onPresetChange(visibleBlock.id, preset.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
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

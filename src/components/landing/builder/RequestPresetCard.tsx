'use client'

/**
 * Request Preset Card
 *
 * 프리셋 그리드 마지막에 표시되는 "원하는 디자인 요청" 카드
 * PresetThumbnail과 동일한 크기로 일관성 유지
 */

import { Plus } from 'lucide-react'
import type { SelectableSectionType } from '../subway/SubwayBuilderContext'

interface RequestPresetCardProps {
  /** 섹션 타입 */
  sectionType: SelectableSectionType
  /** 클릭 핸들러 */
  onClick: () => void
  /** 카드 너비 */
  width?: number
  /** 카드 높이 */
  height?: number
}

export function RequestPresetCard({
  onClick,
  width = 90,
  height = 120,
}: RequestPresetCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className="relative flex-shrink-0 group cursor-pointer"
    >
      {/* 카드 컨테이너 */}
      <div
        className="
          relative overflow-hidden rounded-lg
          border-2 border-dashed border-[var(--sand-300)]
          hover:border-[var(--sage-400)] hover:bg-[var(--sage-50)]
          transition-all duration-300
          flex flex-col items-center justify-center gap-2
        "
        style={{ width, height }}
      >
        {/* 아이콘 */}
        <div
          className="
            w-8 h-8 rounded-full
            bg-[var(--sand-100)] group-hover:bg-[var(--sage-100)]
            flex items-center justify-center
            transition-colors duration-300
          "
        >
          <Plus className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--sage-600)]" />
        </div>

        {/* 텍스트 */}
        <span
          className="
            text-[10px] text-[var(--text-muted)] font-medium
            text-center leading-tight px-2
            group-hover:text-[var(--sage-700)]
            transition-colors duration-300
          "
        >
          원하는 디자인
          <br />
          요청하기
        </span>
      </div>

      {/* 레이블 (PresetThumbnail과 동일한 위치) */}
      <p
        className="
          mt-2 text-[11px] text-center truncate leading-tight
          text-[var(--text-muted)] font-medium
        "
        style={{ width }}
      >
        커스텀 요청
      </p>
    </div>
  )
}

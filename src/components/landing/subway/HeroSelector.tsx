'use client'

/**
 * Hero Selector
 *
 * 6개 Hero 템플릿 선택 UI
 * - 가로 스크롤 (모바일)
 * - 그리드 (데스크탑)
 * - 선택 시 전체 색상 테마 변경
 */

import { useRef, useCallback } from 'react'
import { Check } from 'lucide-react'
import { MiniHeroRenderer } from './MiniBlockRenderer'
import {
  useSubwayBuilder,
  TEMPLATE_IDS,
  TEMPLATE_LABELS,
  TEMPLATE_DESCRIPTIONS,
  type TemplateId,
} from './SubwayBuilderContext'

// ============================================
// Types
// ============================================

interface HeroSelectorProps {
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function HeroSelector({ className = '' }: HeroSelectorProps) {
  const { state, setTemplate } = useSubwayBuilder()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleTemplateClick = useCallback(
    (templateId: TemplateId) => {
      setTemplate(templateId)
    },
    [setTemplate]
  )

  return (
    <section className={`w-full ${className}`}>
      {/* 섹션 헤더 */}
      <div className="mb-4 px-4 sm:px-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-[var(--sage-500)] uppercase tracking-wider">
            Step 1
          </span>
        </div>
        <h2
          className="text-lg sm:text-xl font-medium text-[var(--text-primary)]"
          style={{ fontFamily: 'var(--font-heading, Noto Serif KR), serif' }}
        >
          스타일 선택
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          청첩장의 전체적인 분위기를 결정합니다
        </p>
      </div>

      {/* 템플릿 그리드/스크롤 */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-4 px-4 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-x-visible snap-x snap-mandatory sm:snap-none scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {TEMPLATE_IDS.map((templateId) => (
          <HeroTemplateCard
            key={templateId}
            templateId={templateId}
            isSelected={state.selectedTemplateId === templateId}
            onClick={() => handleTemplateClick(templateId)}
            cssVariables={state.cssVariables}
          />
        ))}
      </div>
    </section>
  )
}

// ============================================
// Sub Components
// ============================================

interface HeroTemplateCardProps {
  templateId: TemplateId
  isSelected: boolean
  onClick: () => void
  cssVariables: Record<string, string>
}

function HeroTemplateCard({
  templateId,
  isSelected,
  onClick,
  cssVariables,
}: HeroTemplateCardProps) {
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
      className={`
        relative flex-shrink-0 snap-center group cursor-pointer
        transition-all duration-300 ease-out
        ${isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
      `}
    >
      {/* 썸네일 컨테이너 - MiniHeroRenderer와 동일 크기 */}
      <div
        className={`
          relative overflow-hidden rounded-xl
          border-2 transition-all duration-300
          ${
            isSelected
              ? 'border-[var(--sage-500)] shadow-lg'
              : 'border-transparent hover:border-[var(--sand-200)]'
          }
        `}
        style={{ width: 140, height: 249 }}
      >
        {/* Hero 미니 렌더러 - 프리뷰 종횡비(375:667) 유지 */}
        <MiniHeroRenderer
          templateId={templateId}
          cssVariables={cssVariables}
          width={140}
          height={249}
        />

        {/* 선택 체크 표시 */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--sage-500)] flex items-center justify-center shadow-md">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
        )}

        {/* 호버 오버레이 */}
        <div
          className={`
            absolute inset-0 bg-black/0 group-hover:bg-black/5
            transition-colors duration-300 pointer-events-none
          `}
        />
      </div>

      {/* 라벨 */}
      <div className="mt-2 text-center">
        <p
          className={`
            text-sm font-medium transition-colors
            ${isSelected ? 'text-[var(--sage-600)]' : 'text-[var(--text-primary)]'}
          `}
        >
          {TEMPLATE_LABELS[templateId]}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">
          {TEMPLATE_DESCRIPTIONS[templateId]}
        </p>
      </div>
    </div>
  )
}

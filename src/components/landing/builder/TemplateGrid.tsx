'use client'

/**
 * Template Grid
 *
 * 6개 템플릿 선택 그리드
 * - 3x2 그리드 (데스크탑)
 * - 2x3 그리드 (모바일)
 * - 반응형 크기 측정으로 프리뷰가 border에 딱 맞게 표시
 */

import { useCallback, useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { MiniHeroRenderer } from '../subway/MiniBlockRenderer'
import {
  useSubwayBuilder,
  TEMPLATE_IDS,
  TEMPLATE_LABELS,
  TEMPLATE_DESCRIPTIONS,
  type TemplateId,
} from '../subway/SubwayBuilderContext'

// ============================================
// Constants
// ============================================

/** 9:16 종횡비 (모바일 청첩장 비율) */
const ASPECT_RATIO = 9 / 16

// ============================================
// Component
// ============================================

export function TemplateGrid() {
  const { state, setTemplate } = useSubwayBuilder()

  const handleTemplateClick = useCallback(
    (templateId: TemplateId) => {
      setTemplate(templateId)
    },
    [setTemplate]
  )

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {TEMPLATE_IDS.map((templateId, index) => (
        <motion.div
          key={templateId}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <TemplateCard
            templateId={templateId}
            isSelected={state.selectedTemplateId === templateId}
            onClick={() => handleTemplateClick(templateId)}
            cssVariables={state.cssVariables}
          />
        </motion.div>
      ))}
    </div>
  )
}

// ============================================
// Sub Components
// ============================================

interface TemplateCardProps {
  templateId: TemplateId
  isSelected: boolean
  onClick: () => void
  cssVariables: Record<string, string>
}

function TemplateCard({
  templateId,
  isSelected,
  onClick,
  cssVariables,
}: TemplateCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 160, height: 284 })

  // ResizeObserver로 컨테이너 크기 측정
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect()
      const width = Math.round(rect.width)
      const height = Math.round(width / ASPECT_RATIO)
      setDimensions({ width, height })
    }

    // 초기 측정
    updateDimensions()

    // ResizeObserver 설정
    const resizeObserver = new ResizeObserver(updateDimensions)
    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full text-left group
        transition-all duration-300 ease-out
        ${isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
      `}
    >
      {/* 썸네일 컨테이너 */}
      <div
        ref={containerRef}
        className={`
          relative overflow-hidden rounded-lg
          border-2 transition-all duration-300
          ${
            isSelected
              ? 'border-[var(--blush-400)] shadow-lg shadow-[var(--blush-400)]/20'
              : 'border-[var(--warm-200)] hover:border-[var(--blush-300)] hover:shadow-md'
          }
        `}
        style={{ aspectRatio: '9/16' }}
      >
        {/* Mini Hero Renderer - 컨테이너 크기에 맞춤 */}
        <MiniHeroRenderer
          templateId={templateId}
          cssVariables={cssVariables}
          width={dimensions.width}
          height={dimensions.height}
        />

        {/* 선택 체크 */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--blush-400)] flex items-center justify-center shadow-md z-10">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
        )}

        {/* 호버 오버레이 */}
        <div
          className={`
            absolute inset-0 transition-colors duration-200 pointer-events-none
            ${isSelected ? '' : 'bg-black/0 group-hover:bg-black/[0.03]'}
          `}
        />
      </div>

      {/* 라벨 */}
      <div className="mt-3 text-center">
        <p
          className={`
            text-sm font-medium transition-colors
            ${isSelected ? 'text-[var(--blush-500)]' : 'text-[var(--text-primary)]'}
          `}
        >
          {TEMPLATE_LABELS[templateId]}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          {TEMPLATE_DESCRIPTIONS[templateId]}
        </p>
      </div>
    </button>
  )
}

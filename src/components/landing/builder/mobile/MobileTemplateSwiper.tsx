'use client'

/**
 * Mobile Template Swiper
 *
 * 풀스크린 카드 스와이프로 템플릿 선택
 * - Tinder 스타일 스와이프 인터랙션
 * - 선택된 템플릿 하이라이트
 * - 좌우 스와이프로 탐색, 탭으로 선택
 */

import { useCallback, useState, useMemo, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  useSubwayBuilder,
  TEMPLATE_IDS,
  TEMPLATE_LABELS,
  TEMPLATE_DESCRIPTIONS,
  type TemplateId,
} from '../../subway/SubwayBuilderContext'
import { MiniHeroRenderer } from '../../subway/MiniBlockRenderer'

// ============================================
// Constants
// ============================================

const CARD_WIDTH = 280
const CARD_HEIGHT = 497 // 9:16 ratio
const CARD_GAP = 16

// ============================================
// Component
// ============================================

interface MobileTemplateSwiperProps {
  onSelect: () => void
}

export function MobileTemplateSwiper({ onSelect }: MobileTemplateSwiperProps) {
  const { state, setTemplate } = useSubwayBuilder()
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(() => {
    const idx = TEMPLATE_IDS.indexOf(state.selectedTemplateId as TemplateId)
    return idx >= 0 ? idx : 0
  })

  // 템플릿 선택 핸들러
  const handleSelect = useCallback(
    (templateId: TemplateId) => {
      setTemplate(templateId)
    },
    [setTemplate]
  )

  // 인덱스 변경 시 템플릿 선택
  useEffect(() => {
    const templateId = TEMPLATE_IDS[activeIndex]
    if (templateId && templateId !== state.selectedTemplateId) {
      setTemplate(templateId)
    }
  }, [activeIndex, setTemplate, state.selectedTemplateId])

  // 이전/다음 네비게이션
  const goPrev = useCallback(() => {
    setActiveIndex((prev) => Math.max(0, prev - 1))
  }, [])

  const goNext = useCallback(() => {
    setActiveIndex((prev) => Math.min(TEMPLATE_IDS.length - 1, prev + 1))
  }, [])

  // 현재 선택된 템플릿이 확정되었는지 (탭해서 선택했는지)
  const isCurrentSelected = state.selectedTemplateId === TEMPLATE_IDS[activeIndex]

  return (
    <div className="h-full flex flex-col">
      {/* 안내 텍스트 */}
      <div className="text-center px-4 pt-4 pb-6">
        <h2
          className="text-xl font-medium text-[var(--text-primary)] mb-2"
          style={{ fontFamily: 'var(--font-display), serif' }}
        >
          원하는 스타일을 선택하세요
        </h2>
        <p className="text-sm text-[var(--text-muted)]">
          좌우로 스와이프하여 둘러보세요
        </p>
      </div>

      {/* 카드 캐러셀 */}
      <div
        ref={containerRef}
        className="flex-1 relative flex items-center justify-center overflow-hidden"
      >
        {/* 네비게이션 버튼 - 왼쪽 */}
        {activeIndex > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-2 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="이전 템플릿"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* 네비게이션 버튼 - 오른쪽 */}
        {activeIndex < TEMPLATE_IDS.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="다음 템플릿"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* 카드들 */}
        <div className="relative" style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
          {TEMPLATE_IDS.map((templateId, index) => (
            <TemplateCard
              key={templateId}
              templateId={templateId}
              index={index}
              activeIndex={activeIndex}
              isSelected={state.selectedTemplateId === templateId}
              cssVariables={state.cssVariables}
              onTap={() => {
                if (index === activeIndex) {
                  // 이미 활성화된 카드 탭 → 선택 확정 후 다음 단계
                  handleSelect(templateId)
                  onSelect()
                } else {
                  // 다른 카드 탭 → 해당 카드로 이동
                  setActiveIndex(index)
                }
              }}
              totalCards={TEMPLATE_IDS.length}
            />
          ))}
        </div>
      </div>

      {/* 현재 템플릿 정보 */}
      <div className="text-center px-4 py-6">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-lg font-medium text-[var(--text-primary)]">
            {TEMPLATE_LABELS[TEMPLATE_IDS[activeIndex]]}
          </h3>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {TEMPLATE_DESCRIPTIONS[TEMPLATE_IDS[activeIndex]]}
          </p>
        </motion.div>

        {/* 선택 버튼 */}
        <motion.button
          onClick={() => {
            handleSelect(TEMPLATE_IDS[activeIndex])
            onSelect()
          }}
          className={`
            mt-4 px-8 py-3 rounded-full text-sm font-medium
            transition-all duration-300
            ${
              isCurrentSelected
                ? 'bg-[var(--blush-400)] text-white shadow-lg shadow-[var(--blush-400)]/30'
                : 'bg-[var(--warm-100)] text-[var(--text-primary)] hover:bg-[var(--warm-200)]'
            }
          `}
          whileTap={{ scale: 0.95 }}
        >
          {isCurrentSelected ? (
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              선택됨 - 다음 단계로
            </span>
          ) : (
            '이 스타일 선택하기'
          )}
        </motion.button>
      </div>

      {/* 인디케이터 dots */}
      <div className="flex justify-center gap-2 pb-4">
        {TEMPLATE_IDS.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${
                index === activeIndex
                  ? 'bg-[var(--blush-400)] w-4'
                  : 'bg-[var(--warm-300)]'
              }
            `}
            aria-label={`템플릿 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================
// Template Card
// ============================================

interface TemplateCardProps {
  templateId: TemplateId
  index: number
  activeIndex: number
  isSelected: boolean
  cssVariables: Record<string, string>
  onTap: () => void
  totalCards: number
}

function TemplateCard({
  templateId,
  index,
  activeIndex,
  isSelected,
  cssVariables,
  onTap,
  totalCards,
}: TemplateCardProps) {
  const offset = index - activeIndex

  // 카드 위치 및 스케일 계산
  const x = offset * (CARD_WIDTH * 0.15 + CARD_GAP)
  const scale = offset === 0 ? 1 : 0.85
  const opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.3
  const zIndex = totalCards - Math.abs(offset)
  const rotateY = offset * -5

  return (
    <motion.button
      onClick={onTap}
      animate={{
        x,
        scale,
        opacity,
        rotateY,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      style={{ zIndex }}
      className={`
        absolute top-0 left-0
        w-full h-full
        origin-center
        ${offset === 0 ? 'cursor-pointer' : 'cursor-default pointer-events-none'}
      `}
      whileTap={offset === 0 ? { scale: 0.98 } : undefined}
    >
      <div
        className={`
          w-full h-full rounded-2xl overflow-hidden
          border-2 transition-all duration-300
          shadow-xl
          ${
            isSelected && offset === 0
              ? 'border-[var(--blush-400)] shadow-[var(--blush-400)]/30'
              : 'border-white/50'
          }
        `}
      >
        {/* Mini Hero Renderer */}
        <MiniHeroRenderer
          templateId={templateId}
          cssVariables={cssVariables}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
        />

        {/* 선택 체크 */}
        {isSelected && offset === 0 && (
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--blush-400)] flex items-center justify-center shadow-lg z-10">
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          </div>
        )}
      </div>
    </motion.button>
  )
}

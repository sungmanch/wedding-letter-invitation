'use client'

/**
 * Mobile Card Stack
 *
 * 선택한 섹션들을 카드 덱처럼 시각화
 * - 현재까지 선택한 섹션들이 쌓여가는 애니메이션
 * - 핵심 가치 "섹션별 조합"을 직관적으로 전달
 */

import { useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSubwayBuilder, SECTION_ORDER, SECTION_LABELS, type SelectableSectionType } from '../../subway/SubwayBuilderContext'
import { MiniHeroRenderer } from '../../subway/MiniBlockRenderer'
import { getBlockPreset, type BlockPreset } from '@/lib/super-editor-v2/presets/blocks'

// ============================================
// Constants
// ============================================

const CARD_WIDTH = 48
const CARD_HEIGHT = 64 // 9:16 비율
const STACK_OFFSET = 8 // 카드 겹침 offset

// 섹션 타입별 아이콘/이모지
const SECTION_ICONS: Record<SelectableSectionType, string> = {
  hero: '📸',
  'greeting-parents': '💌',
  calendar: '📅',
  gallery: '🖼️',
  location: '📍',
}

// ============================================
// Component
// ============================================

interface MobileCardStackProps {
  currentStepIndex: number
}

export function MobileCardStack({ currentStepIndex }: MobileCardStackProps) {
  const { state } = useSubwayBuilder()

  // 완료된 스텝 수 (0: 아무것도, 1: 템플릿만, 2: 템플릿+섹션1, ...)
  const completedSteps = useMemo(() => {
    const steps: { type: 'template' | 'section'; sectionType?: SelectableSectionType; presetId: string }[] = []

    // 템플릿 (항상 선택됨)
    if (state.selectedTemplateId) {
      steps.push({
        type: 'template',
        presetId: state.selectedPresets.hero, // hero preset = template
      })
    }

    // 섹션들 (현재 스텝까지만)
    const sectionsToShow = currentStepIndex > 0 ? currentStepIndex - 1 : 0
    for (let i = 0; i < Math.min(sectionsToShow, SECTION_ORDER.length); i++) {
      const sectionType = SECTION_ORDER[i]
      const presetId = state.selectedPresets[sectionType]
      if (presetId) {
        steps.push({
          type: 'section',
          sectionType,
          presetId,
        })
      }
    }

    return steps
  }, [state.selectedTemplateId, state.selectedPresets, currentStepIndex])

  // 현재 진행 상태 텍스트
  const progressText = useMemo(() => {
    if (completedSteps.length === 0) return '스타일을 선택하세요'
    if (completedSteps.length === 1) return '스타일 선택 완료'
    const sectionCount = completedSteps.length - 1
    return `${sectionCount}개 섹션 선택됨`
  }, [completedSteps])

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[var(--ivory-50)] via-[var(--ivory-50)]/95 to-transparent pt-8 pb-4 px-4">
      <div className="flex items-center justify-between">
        {/* 카드 스택 시각화 */}
        <div className="flex items-center gap-2">
          {/* 스택된 카드들 */}
          <div
            className="relative"
            style={{
              width: CARD_WIDTH + (completedSteps.length - 1) * STACK_OFFSET,
              height: CARD_HEIGHT,
            }}
          >
            <AnimatePresence>
              {completedSteps.map((step, index) => (
                <motion.div
                  key={`${step.type}-${step.presetId}`}
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: index * STACK_OFFSET,
                    zIndex: index,
                  }}
                  exit={{ opacity: 0, scale: 0.8, x: -20 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                  }}
                  className="absolute top-0 left-0 rounded-lg overflow-hidden border border-[var(--warm-200)] shadow-sm"
                  style={{
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                    transform: `rotate(${index * -2}deg)`,
                  }}
                >
                  {step.type === 'template' ? (
                    <MiniHeroRenderer
                      templateId={state.selectedTemplateId}
                      cssVariables={state.cssVariables}
                      width={CARD_WIDTH}
                      height={CARD_HEIGHT}
                    />
                  ) : (
                    <SectionMiniCard
                      sectionType={step.sectionType!}
                      presetId={step.presetId}
                      cssVariables={state.cssVariables}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* 진행 상태 */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-[var(--text-primary)]">
              {progressText}
            </span>
            <div className="flex gap-1 mt-1">
              {/* 스텝 인디케이터 */}
              <StepIndicator
                icon="📸"
                label="스타일"
                isCompleted={completedSteps.length >= 1}
                isCurrent={currentStepIndex === 0}
              />
              {SECTION_ORDER.map((sectionType, idx) => (
                <StepIndicator
                  key={sectionType}
                  icon={SECTION_ICONS[sectionType]}
                  label={SECTION_LABELS[sectionType]}
                  isCompleted={completedSteps.length >= idx + 2}
                  isCurrent={currentStepIndex === idx + 1}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 조합 공식 힌트 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-right"
        >
          <span className="text-xs text-[var(--text-muted)]">
            {completedSteps.length}/{1 + SECTION_ORDER.length} 완료
          </span>
        </motion.div>
      </div>
    </div>
  )
}

// ============================================
// Step Indicator
// ============================================

interface StepIndicatorProps {
  icon: string
  label: string
  isCompleted: boolean
  isCurrent: boolean
}

function StepIndicator({ icon, label, isCompleted, isCurrent }: StepIndicatorProps) {
  return (
    <div
      className={`
        w-6 h-6 rounded-full flex items-center justify-center text-xs
        transition-all duration-300
        ${
          isCompleted
            ? 'bg-[var(--blush-400)] text-white'
            : isCurrent
            ? 'bg-[var(--blush-100)] text-[var(--blush-500)] ring-2 ring-[var(--blush-300)]'
            : 'bg-[var(--warm-100)] text-[var(--text-muted)]'
        }
      `}
      title={label}
    >
      {isCompleted ? '✓' : icon}
    </div>
  )
}

// ============================================
// Section Mini Card
// ============================================

interface SectionMiniCardProps {
  sectionType: SelectableSectionType
  presetId: string
  cssVariables: Record<string, string>
}

function SectionMiniCard({ sectionType, presetId, cssVariables }: SectionMiniCardProps) {
  const preset = getBlockPreset(presetId)

  return (
    <div
      className="w-full h-full flex items-center justify-center text-lg"
      style={{
        background: cssVariables['--bg-secondary'] || 'var(--warm-50)',
      }}
    >
      {/* 섹션 아이콘 */}
      <span className="text-xl">{SECTION_ICONS[sectionType]}</span>
    </div>
  )
}

'use client'

/**
 * Mobile Builder Wizard
 *
 * 모바일 전용 풀스크린 위저드 경험
 * - Step 1: 템플릿 스와이프 선택
 * - Step 2: 섹션별 프리셋 스와이프 선택
 * - Step 3: 완성된 조합 프리뷰
 *
 * 디자인 컨셉: "Card Deck Builder"
 * - 카드를 쌓아가며 나만의 청첩장을 조합하는 경험
 */

import { useState, useCallback, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from 'lucide-react'
import { useSubwayBuilder, SECTION_ORDER, SECTION_LABELS, type SelectableSectionType } from '../../subway/SubwayBuilderContext'
import { MobileTemplateSwiper } from './MobileTemplateSwiper'
import { MobileSectionSwiper } from './MobileSectionSwiper'
import { MobileCardStack } from './MobileCardStack'
import { MobilePreviewContent } from './MobilePreviewContent'

// ============================================
// Types
// ============================================

type WizardStep =
  | { type: 'template' }
  | { type: 'section'; sectionIndex: number }
  | { type: 'complete' }

// ============================================
// Constants
// ============================================

const STEP_LABELS: Record<string, string> = {
  template: '스타일 선택',
  'greeting-parents': '인사말',
  calendar: '예식일시',
  gallery: '갤러리',
  complete: '완성!',
}

// ============================================
// Component
// ============================================

interface MobileBuilderWizardProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileBuilderWizard({ isOpen, onClose }: MobileBuilderWizardProps) {
  const { state, saveAndCreateDocument, isCreating } = useSubwayBuilder()
  const [currentStep, setCurrentStep] = useState<WizardStep>({ type: 'template' })
  const [direction, setDirection] = useState(1) // 1: forward, -1: backward

  // 총 스텝 수 계산
  const totalSteps = useMemo(() => 1 + SECTION_ORDER.length + 1, []) // template + sections + complete

  // 현재 스텝 인덱스 계산
  const currentStepIndex = useMemo(() => {
    if (currentStep.type === 'template') return 0
    if (currentStep.type === 'section') return 1 + currentStep.sectionIndex
    return totalSteps - 1
  }, [currentStep, totalSteps])

  // 현재 스텝 라벨
  const currentStepLabel = useMemo(() => {
    if (currentStep.type === 'template') return STEP_LABELS.template
    if (currentStep.type === 'section') {
      const sectionType = SECTION_ORDER[currentStep.sectionIndex]
      return SECTION_LABELS[sectionType]
    }
    return STEP_LABELS.complete
  }, [currentStep])

  // 다음 스텝으로
  const goNext = useCallback(() => {
    setDirection(1)
    if (currentStep.type === 'template') {
      setCurrentStep({ type: 'section', sectionIndex: 0 })
    } else if (currentStep.type === 'section') {
      if (currentStep.sectionIndex < SECTION_ORDER.length - 1) {
        setCurrentStep({ type: 'section', sectionIndex: currentStep.sectionIndex + 1 })
      } else {
        setCurrentStep({ type: 'complete' })
      }
    }
  }, [currentStep])

  // 이전 스텝으로
  const goPrev = useCallback(() => {
    setDirection(-1)
    if (currentStep.type === 'section') {
      if (currentStep.sectionIndex > 0) {
        setCurrentStep({ type: 'section', sectionIndex: currentStep.sectionIndex - 1 })
      } else {
        setCurrentStep({ type: 'template' })
      }
    } else if (currentStep.type === 'complete') {
      setCurrentStep({ type: 'section', sectionIndex: SECTION_ORDER.length - 1 })
    }
  }, [currentStep])

  // 위저드 닫기 시 초기화
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep({ type: 'template' })
      setDirection(1)
    }
  }, [isOpen])

  // 현재 섹션 타입 (section 스텝일 때)
  const currentSectionType = useMemo((): SelectableSectionType | null => {
    if (currentStep.type === 'section') {
      return SECTION_ORDER[currentStep.sectionIndex]
    }
    return null
  }, [currentStep])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[var(--ivory-50)] lg:hidden"
    >
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-[var(--ivory-50)]/95 backdrop-blur-sm border-b border-[var(--warm-100)]">
        <div className="flex items-center justify-between px-4 h-14">
          {/* 뒤로가기 / 닫기 */}
          {currentStep.type !== 'template' ? (
            <button
              onClick={goPrev}
              className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">이전</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              닫기
            </button>
          )}

          {/* 현재 단계 */}
          <div className="text-center">
            <p className="text-xs text-[var(--text-muted)]">
              {currentStepIndex + 1} / {totalSteps}
            </p>
            <h1 className="text-sm font-medium text-[var(--text-primary)]">
              {currentStepLabel}
            </h1>
          </div>

          {/* 건너뛰기 / 다음 */}
          {currentStep.type !== 'complete' ? (
            <button
              onClick={goNext}
              className="flex items-center gap-1 text-[var(--blush-500)] hover:text-[var(--blush-600)] transition-colors"
            >
              <span className="text-sm">다음</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-12" /> // Placeholder for alignment
          )}
        </div>

        {/* 프로그레스 바 */}
        <div className="h-1 bg-[var(--warm-100)]">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--blush-300)] to-[var(--blush-400)]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </header>

      {/* 콘텐츠 영역 */}
      <main className="pt-[60px] pb-[100px] h-full overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {currentStep.type === 'template' && (
            <StepContent key="template" direction={direction}>
              <MobileTemplateSwiper onSelect={goNext} />
            </StepContent>
          )}

          {currentStep.type === 'section' && currentSectionType && (
            <StepContent key={`section-${currentSectionType}`} direction={direction}>
              <MobileSectionSwiper
                sectionType={currentSectionType}
                onSelect={goNext}
              />
            </StepContent>
          )}

          {currentStep.type === 'complete' && (
            <StepContent key="complete" direction={direction}>
              <CompleteStep />
            </StepContent>
          )}
        </AnimatePresence>
      </main>

      {/* 하단: 선택된 카드 스택 (complete 제외) */}
      {currentStep.type !== 'complete' && (
        <MobileCardStack currentStepIndex={currentStepIndex} />
      )}

      {/* 하단 CTA (complete에서만) */}
      {currentStep.type === 'complete' && (
        <footer className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--ivory-50)]/95 backdrop-blur-sm border-t border-[var(--warm-100)]">
          <button
            onClick={saveAndCreateDocument}
            disabled={isCreating}
            className="
              w-full h-14
              bg-[var(--blush-400)] hover:bg-[var(--blush-500)]
              text-white font-medium text-base
              rounded-2xl shadow-lg shadow-[var(--blush-400)]/30
              flex items-center justify-center gap-2
              transition-all duration-300
              disabled:opacity-70 disabled:cursor-not-allowed
            "
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                편집 시작하기
              </>
            )}
          </button>
          <p className="text-xs text-center text-[var(--text-muted)] mt-2">
            카드 등록 없이 무료 체험
          </p>
        </footer>
      )}
    </motion.div>
  )
}

// ============================================
// Step Content Wrapper
// ============================================

interface StepContentProps {
  children: React.ReactNode
  direction: number
}

function StepContent({ children, direction }: StepContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction * 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -100 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}

// ============================================
// Complete Step
// ============================================

function CompleteStep() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4">
      {/* 완성 메시지 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 rounded-full bg-[var(--blush-400)] flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-white" strokeWidth={3} />
        </div>
        <h2
          className="text-2xl font-medium text-[var(--text-primary)] mb-2"
          style={{ fontFamily: 'var(--font-display), serif' }}
        >
          나만의 청첩장 완성!
        </h2>
        <p className="text-sm text-[var(--text-muted)]">
          선택하신 조합으로 청첩장이 준비되었어요
        </p>
      </motion.div>

      {/* 프리뷰 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 flex items-center justify-center"
      >
        <MobilePreviewContent isHalfHeight={false} />
      </motion.div>
    </div>
  )
}

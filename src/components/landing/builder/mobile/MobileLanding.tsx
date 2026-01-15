'use client'

/**
 * Mobile Landing
 *
 * 모바일 전용 랜딩 페이지 (데스크탑과 완전 분리)
 * - 풀스크린 히어로 with CTA
 * - 위저드 버튼으로 빌더 경험 시작
 * - 섹션별 조합 가치를 스택 애니메이션으로 전달
 */

import { useState, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronRight, Gamepad2, ArrowRight, Layers, Palette, Grid3X3 } from 'lucide-react'
import Link from 'next/link'
import { MobileBuilderWizard } from './MobileBuilderWizard'
import { MiniHeroRenderer } from '../../subway/MiniBlockRenderer'
import { useSubwayBuilder, TEMPLATE_IDS } from '../../subway/SubwayBuilderContext'

// ============================================
// Constants
// ============================================

const VALUE_PROPS = [
  {
    icon: Palette,
    title: '6가지 스타일',
    description: '클래식부터 모던까지',
  },
  {
    icon: Grid3X3,
    title: '섹션별 조합',
    description: '원하는 디자인만 골라서',
  },
  {
    icon: Layers,
    title: '실시간 미리보기',
    description: '바로바로 확인하며 제작',
  },
]

// ============================================
// Component
// ============================================

export function MobileLanding() {
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const { state } = useSubwayBuilder()

  const openWizard = useCallback(() => {
    setIsWizardOpen(true)
  }, [])

  const closeWizard = useCallback(() => {
    setIsWizardOpen(false)
  }, [])

  return (
    <>
      {/* 메인 랜딩 */}
      <div className="min-h-[100svh] flex flex-col bg-[var(--ivory-50)]">
        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
          {/* 배경 */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-pure)] via-[var(--bg-warm)] to-[var(--blush-50)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,var(--blush-100)_0%,transparent_50%)] opacity-40" />
          </div>

          {/* 콘텐츠 */}
          <div className="relative z-10 text-center max-w-sm mx-auto">
            {/* 배지 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--blush-100)] text-[var(--blush-600)] text-xs font-medium mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--blush-400)]" />
              셀프 모바일 청첩장
            </motion.div>

            {/* 헤드라인 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl font-medium text-[var(--text-primary)] leading-tight mb-3"
              style={{ fontFamily: 'var(--font-display), serif' }}
            >
              결혼식만큼,
              <br />
              <span className="text-[var(--blush-500)]">청첩장도 특별해야</span> 하니까.
            </motion.h1>

            {/* 서브 헤드라인 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm text-[var(--text-muted)] mb-8"
            >
              섹션별로 골라서 나만의 청첩장을 조합하세요
            </motion.p>

            {/* 스택드 카드 프리뷰 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative mb-8"
            >
              <StackedCardsPreview />
            </motion.div>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-3"
            >
              <button
                onClick={openWizard}
                className="
                  w-full h-14
                  bg-[var(--blush-400)] hover:bg-[var(--blush-500)]
                  text-white font-medium text-base
                  rounded-2xl shadow-lg shadow-[var(--blush-400)]/30
                  flex items-center justify-center gap-2
                  transition-all duration-300 active:scale-[0.98]
                "
              >
                <Sparkles className="w-5 h-5" />
                내 청첩장 만들기
                <ChevronRight className="w-5 h-5" />
              </button>

              <p className="text-xs text-[var(--text-muted)]">
                카드 등록 없이 무료 체험 · 3분 완성
              </p>
            </motion.div>

            {/* 게임 배너 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6"
            >
              <Link
                href="/game/memory"
                className="
                  flex items-center justify-center gap-2
                  px-4 py-2.5 rounded-xl
                  border border-[var(--blush-200)]
                  bg-gradient-to-r from-[var(--warm-100)] to-[var(--blush-100)]
                  hover:from-[var(--blush-100)] hover:to-[var(--blush-200)]
                  transition-all duration-300
                "
              >
                <Gamepad2 className="w-4 h-4 text-[var(--blush-500)]" />
                <span className="text-sm text-[var(--text-body)]">
                  게임하고 최대 50% 할인받기
                </span>
                <ArrowRight className="w-3 h-3 text-[var(--blush-400)]" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Value Props */}
        <section className="px-4 py-8 bg-white/50">
          <div className="flex justify-center gap-4">
            {VALUE_PROPS.map((prop, index) => (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--blush-100)] flex items-center justify-center mb-2">
                  <prop.icon className="w-5 h-5 text-[var(--blush-500)]" />
                </div>
                <p className="text-xs font-medium text-[var(--text-primary)]">{prop.title}</p>
                <p className="text-[10px] text-[var(--text-muted)]">{prop.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bottom CTA (Fixed) */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent">
          <button
            onClick={openWizard}
            className="
              w-full h-12
              bg-[var(--blush-400)] hover:bg-[var(--blush-500)]
              text-white font-medium text-sm
              rounded-xl shadow-md
              flex items-center justify-center gap-2
              transition-all duration-300 active:scale-[0.98]
            "
          >
            지금 바로 시작하기
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Wizard Modal */}
      <AnimatePresence>
        {isWizardOpen && (
          <MobileBuilderWizard isOpen={isWizardOpen} onClose={closeWizard} />
        )}
      </AnimatePresence>
    </>
  )
}

// ============================================
// Stacked Cards Preview
// ============================================

function StackedCardsPreview() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { state } = useSubwayBuilder()

  // 자동 순환
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TEMPLATE_IDS.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  // 표시할 카드들 (현재 + 앞뒤)
  const visibleCards = useMemo(() => {
    const cards = []
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + TEMPLATE_IDS.length) % TEMPLATE_IDS.length
      cards.push({
        templateId: TEMPLATE_IDS[index],
        offset: i,
      })
    }
    return cards
  }, [currentIndex])

  return (
    <div className="relative w-[200px] h-[320px] mx-auto">
      {visibleCards.map(({ templateId, offset }) => (
        <motion.div
          key={templateId}
          animate={{
            x: offset * 30,
            scale: offset === 0 ? 1 : 0.85,
            opacity: offset === 0 ? 1 : 0.6,
            rotateY: offset * -10,
            zIndex: offset === 0 ? 10 : 5,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
          className="absolute top-0 left-0 w-[160px] h-[284px] rounded-2xl overflow-hidden border-2 border-white shadow-xl"
          style={{
            left: '50%',
            marginLeft: '-80px',
          }}
        >
          <MiniHeroRenderer
            templateId={templateId}
            cssVariables={state.cssVariables}
            width={160}
            height={284}
          />
        </motion.div>
      ))}

      {/* 조합 공식 힌트 */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs text-[var(--text-muted)]">
        <span className="px-2 py-0.5 rounded bg-[var(--blush-100)] text-[var(--blush-600)]">인트로</span>
        <span>+</span>
        <span className="px-2 py-0.5 rounded bg-[var(--warm-100)] text-[var(--text-muted)]">인사말</span>
        <span>+</span>
        <span className="px-2 py-0.5 rounded bg-[var(--warm-100)] text-[var(--text-muted)]">갤러리</span>
        <span>=</span>
        <span className="text-[var(--blush-500)]">💌</span>
      </div>
    </div>
  )
}

'use client'

/**
 * Mobile Landing
 *
 * 모바일 전용 랜딩 페이지 (데스크탑과 완전 분리)
 * - 풀스크린 히어로 with CTA
 * - 위저드 버튼으로 빌더 경험 시작
 * - 섹션별 조합 가치를 슬롯머신 애니메이션으로 전달
 */

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronRight, Gamepad2, ArrowRight, Layers, Palette, Grid3X3 } from 'lucide-react'
import Link from 'next/link'
import { MobileBuilderWizard } from './MobileBuilderWizard'
import { SectionCombinerPreview } from './SectionCombinerPreview'

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
        <section className="flex-1 flex flex-col items-center justify-center px-4 py-6 relative overflow-hidden">
          {/* 배경 */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-pure)] via-[var(--bg-warm)] to-[var(--blush-50)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,var(--blush-100)_0%,transparent_50%)] opacity-40" />
          </div>

          {/* 콘텐츠 */}
          <div className="relative z-10 w-full max-w-sm mx-auto">
            {/* 배지 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-4"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--blush-100)] text-[var(--blush-600)] text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--blush-400)]" />
                셀프 모바일 청첩장
              </span>
            </motion.div>

            {/* 헤드라인 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl font-medium text-[var(--text-primary)] leading-tight mb-2 text-center"
              style={{ fontFamily: 'var(--font-display), serif' }}
            >
              결혼식만큼,
              <br />
              <span className="text-[var(--blush-500)]">청첩장도 특별해야</span> 하니까.
            </motion.h1>

            {/* 서브 헤드라인 - 더 짧게 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm text-[var(--text-muted)] mb-6 text-center"
            >
              섹션별로 골라서 나만의 청첩장을 조합하세요
            </motion.p>

            {/* 섹션 조합 프리뷰 - 슬롯머신 스타일 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mb-6"
            >
              <SectionCombinerPreview />
            </motion.div>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-2.5"
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

              <p className="text-xs text-[var(--text-muted)] text-center">
                카드 등록 없이 무료 체험 · 3분 완성
              </p>
            </motion.div>

            {/* 게임 배너 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-4"
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
                <span className="text-sm text-[var(--text-body)]">게임하고 최대 50% 할인받기</span>
                <ArrowRight className="w-3 h-3 text-[var(--blush-400)]" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Value Props */}
        <section className="px-4 py-6 bg-white/50">
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
        {isWizardOpen && <MobileBuilderWizard isOpen={isWizardOpen} onClose={closeWizard} />}
      </AnimatePresence>
    </>
  )
}

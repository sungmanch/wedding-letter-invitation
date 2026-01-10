'use client'

/**
 * Hero Section - 조합 공식 애니메이션 버전 (2026-01-08)
 *
 * 핵심 전략:
 * - Pain Point 직접 공략: "여기저기 비교하다 지치셨죠?"
 * - 조합 공식으로 핵심 가치 시각화: [갤러리] + [캘린더] + [인사말] = 내 청첩장
 * - 3초 안에 핵심 가치 전달
 */

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Sparkles, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui'

// ============================================
// Constants
// ============================================

const FORMULA_ITEMS = [
  { label: '갤러리', bgColor: 'bg-[var(--blush-100)]', borderColor: 'border-[var(--blush-300)]', textColor: 'text-[var(--blush-600)]' },
  { label: '캘린더', bgColor: 'bg-[var(--sage-100)]', borderColor: 'border-[var(--sage-300)]', textColor: 'text-[var(--sage-600)]' },
  { label: '인사말', bgColor: 'bg-[var(--warm-100)]', borderColor: 'border-[var(--warm-300)]', textColor: 'text-[var(--warm-600)]' },
]

// ============================================
// Animation Variants
// ============================================

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.3, delayChildren: 1.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
}

const resultVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut', delay: 2.4 }
  }
}

// ============================================
// Component
// ============================================

export function HeroSection() {
  // 스크롤 유도 버튼
  const handleScrollDown = useCallback(() => {
    const builderSection = document.getElementById('builder-section')
    if (builderSection) {
      builderSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  // 프리셋 요청 모달 열기
  const handleRequestPreset = useCallback(() => {
    const builderSection = document.getElementById('builder-section')
    if (builderSection) {
      builderSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-pure)] via-[var(--bg-warm)] to-[var(--blush-50)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--blush-100)_0%,transparent_50%)] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,var(--warm-100)_0%,transparent_50%)] opacity-30" />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* 훅 라인 - 메인 헤드라인 (가장 크고 굵게) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-display), serif' }}
          >
            여기저기 비교하다 지치셨죠?
          </motion.h1>

          {/* Pain Point 카피 - 서브텍스트 (작게) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-8 space-y-1"
          >
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              이 업체 <span className="text-[var(--blush-500)]">갤러리</span>는 예쁜데 캘린더가 별로
            </p>
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              저 업체 <span className="text-[var(--sage-600)]">캘린더</span>는 좋은데 디자인이 올드
            </p>
          </motion.div>

          {/* 조합 공식 애니메이션 */}
          <CombinationFormula />

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 3 }}
            className="flex flex-col items-center gap-4 mt-10"
          >
            <Button
              variant="rose"
              size="lg"
              onClick={handleScrollDown}
              className="group"
            >
              무료로 시작하기
              <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>

            {/* 요청 링크 */}
            <button
              onClick={handleRequestPreset}
              className="group flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--blush-500)] transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>원하는 게 없으면 만들어드려요</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <button
          onClick={handleScrollDown}
          className="flex flex-col items-center gap-2 text-[var(--text-light)] hover:text-[var(--blush-500)] transition-colors"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </button>
      </motion.div>
    </section>
  )
}

// ============================================
// Sub Components
// ============================================

/**
 * CombinationFormula: 조합 공식 애니메이션
 *
 * [갤러리] + [캘린더] + [인사말] = 내 청첩장
 * 각 요소가 순차적으로 fade-in
 */
function CombinationFormula() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col lg:flex-row items-center gap-2 lg:gap-3"
    >
      {FORMULA_ITEMS.map((item, index) => (
        <div key={item.label} className="flex items-center gap-2 lg:gap-3">
          {/* 태그 - 작고 깔끔하게 */}
          <motion.div
            variants={itemVariants}
            className={`
              px-3 py-1.5 rounded-md border
              ${item.bgColor} ${item.borderColor}
            `}
          >
            <span className={`text-xs sm:text-sm font-medium ${item.textColor}`}>
              {item.label}
            </span>
          </motion.div>

          {/* + 기호 (마지막 아이템 제외) */}
          {index < FORMULA_ITEMS.length - 1 && (
            <motion.span
              variants={itemVariants}
              className="text-lg font-light text-[var(--text-light)]"
            >
              +
            </motion.span>
          )}
        </div>
      ))}

      {/* = 내 청첩장 - 결과 강조 */}
      <motion.div
        variants={resultVariants}
        className="flex items-center gap-2 lg:gap-3 mt-3 lg:mt-0"
      >
        <span className="text-lg font-light text-[var(--text-light)]">=</span>
        <span
          className="text-lg sm:text-xl font-semibold text-[var(--blush-500)]"
          style={{ fontFamily: 'var(--font-display), serif' }}
        >
          내 청첩장
        </span>
      </motion.div>
    </motion.div>
  )
}

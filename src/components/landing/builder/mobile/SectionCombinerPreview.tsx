'use client'

/**
 * Section Combiner Preview
 *
 * 핵심 가치 "섹션별 조합"을 3초만에 전달
 * 디자인: 세로 탭 방식 - 모바일 세로 스크롤 패턴에 최적화
 *
 * 핵심 시각화:
 * 1. 3개의 탭 헤더 (인트로, 인사말, 갤러리)
 * 2. 선택된 탭의 프리셋이 250px 높이로 충분히 표시
 * 3. 각 탭 내에서 프리셋 자동 순환 + 수동 터치 전환
 * 4. 하단에 조합 공식 표시
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MiniBlockRenderer, MiniHeroRenderer } from '../../subway/MiniBlockRenderer'
import { useSubwayBuilder } from '../../subway/SubwayBuilderContext'

// ============================================
// Types & Constants
// ============================================

type SectionType = 'intro' | 'greeting' | 'gallery'

/** 섹션별 프리셋 옵션 */
const SECTION_OPTIONS: Record<SectionType, { id: string; label: string }[]> = {
  intro: [
    { id: 'unique1', label: '클래식' },
    { id: 'unique2', label: '캐주얼' },
    { id: 'unique3', label: '미니멀' },
    { id: 'unique4', label: '로맨틱' },
  ],
  greeting: [
    { id: 'greeting-parents-minimal', label: '심플' },
    { id: 'greeting-parents-with-divider', label: '구분선' },
    { id: 'greeting-parents-balloon-heart', label: '하트' },
    { id: 'greeting-parents-ribbon', label: '리본' },
  ],
  gallery: [
    { id: 'gallery-square-3col', label: '3열 그리드' },
    { id: 'gallery-square-2col', label: '2열 그리드' },
    { id: 'gallery-rect-3col', label: '세로형' },
    { id: 'gallery-mixed', label: '믹스' },
  ],
}

const SECTION_LABELS: Record<SectionType, string> = {
  intro: '인트로',
  greeting: '인사말',
  gallery: '갤러리',
}

const SECTION_COLORS: Record<SectionType, string> = {
  intro: '#E8A4B8', // blush-400
  greeting: '#9CB9A1', // sage-400
  gallery: '#D4B896', // warm
}

const SECTION_ORDER: SectionType[] = ['intro', 'greeting', 'gallery']

/** 섹션별 프리뷰 높이 (인트로는 길고, 인사말/갤러리는 짧음) */
const SECTION_HEIGHTS: Record<SectionType, number> = {
  intro: 560,
  greeting: 420,
  gallery: 480,
}

// ============================================
// Main Component
// ============================================

export function SectionCombinerPreview() {
  const { state } = useSubwayBuilder()

  // 현재 활성 탭
  const [activeTab, setActiveTab] = useState<SectionType>('intro')
  // 각 섹션의 현재 선택 인덱스
  const [indices, setIndices] = useState({ intro: 0, greeting: 0, gallery: 0 })
  // 자동 순환 일시 정지 (터치 시)
  const [isPaused, setIsPaused] = useState(false)

  // 다음 프리셋으로 이동
  const goNext = useCallback(() => {
    setIndices((prev) => ({
      ...prev,
      [activeTab]: (prev[activeTab] + 1) % SECTION_OPTIONS[activeTab].length,
    }))
  }, [activeTab])

  // 이전 프리셋으로 이동
  const goPrev = useCallback(() => {
    setIndices((prev) => ({
      ...prev,
      [activeTab]:
        (prev[activeTab] - 1 + SECTION_OPTIONS[activeTab].length) %
        SECTION_OPTIONS[activeTab].length,
    }))
  }, [activeTab])

  // 자동 순환 (탭 + 프리셋)
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setIndices((prev) => {
        const currentOptions = SECTION_OPTIONS[activeTab]
        const nextIndex = (prev[activeTab] + 1) % currentOptions.length

        // 프리셋이 한 바퀴 돌면 다음 탭으로
        if (nextIndex === 0) {
          const currentTabIdx = SECTION_ORDER.indexOf(activeTab)
          const nextTab = SECTION_ORDER[(currentTabIdx + 1) % SECTION_ORDER.length]
          setActiveTab(nextTab)
        }

        return { ...prev, [activeTab]: nextIndex }
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [activeTab, isPaused])

  // 터치 시 일시 정지 후 5초 뒤 재시작
  const handleInteraction = useCallback(() => {
    setIsPaused(true)
    const timeout = setTimeout(() => setIsPaused(false), 5000)
    return () => clearTimeout(timeout)
  }, [])

  const currentOptions = SECTION_OPTIONS[activeTab]
  const currentIndex = indices[activeTab]
  const currentOption = currentOptions[currentIndex]
  const currentHeight = SECTION_HEIGHTS[activeTab]

  return (
    <div className="relative w-full max-w-[340px] mx-auto">
      {/* 글로우 배경 */}
      <div
        className="absolute -inset-3 rounded-3xl blur-2xl opacity-15"
        style={{
          background: `linear-gradient(135deg, ${SECTION_COLORS[activeTab]}, ${SECTION_COLORS[activeTab]}50)`,
        }}
      />

      {/* 메인 컨테이너 */}
      <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl border border-[var(--warm-200)] shadow-xl overflow-hidden">
        {/* 탭 헤더 */}
        <div className="flex border-b border-[var(--warm-200)]">
          {SECTION_ORDER.map((section) => {
            const isActive = activeTab === section
            return (
              <button
                key={section}
                onClick={() => {
                  setActiveTab(section)
                  handleInteraction()
                }}
                className={`
                  flex-1 py-3 text-xs font-semibold tracking-wide
                  transition-all duration-300 relative
                  ${isActive ? 'text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-body)]'}
                `}
                style={{
                  backgroundColor: isActive ? SECTION_COLORS[section] : 'transparent',
                }}
              >
                {SECTION_LABELS[section]}
                {/* 선택된 프리셋 표시 */}
                {!isActive && (
                  <span className="block text-[10px] font-normal mt-0.5 opacity-70">
                    {SECTION_OPTIONS[section][indices[section]].label}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* 프리뷰 영역 */}
        <motion.div
          className="relative overflow-hidden"
          animate={{ height: currentHeight }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          onTouchStart={handleInteraction}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${currentOption.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {activeTab === 'intro' ? (
                <MiniHeroRenderer
                  templateId={currentOption.id}
                  cssVariables={state.cssVariables}
                  width={340}
                  height={currentHeight}
                />
              ) : (
                <MiniBlockRenderer
                  presetId={currentOption.id}
                  cssVariables={state.cssVariables}
                  width={340}
                  height={currentHeight}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* 좌우 네비게이션 */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none">
            <button
              onClick={() => {
                goPrev()
                handleInteraction()
              }}
              className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center pointer-events-auto active:scale-95 transition-transform"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => {
                goNext()
                handleInteraction()
              }}
              className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center pointer-events-auto active:scale-95 transition-transform"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* 현재 프리셋 라벨 */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
            <motion.span
              key={currentOption.label}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium"
            >
              {currentOption.label}
            </motion.span>
          </div>

          {/* 프리셋 인디케이터 */}
          <div className="absolute bottom-3 right-3 flex gap-1">
            {currentOptions.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-white w-3' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* 조합 공식 */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {SECTION_ORDER.map((section, idx) => (
          <div key={section} className="flex items-center gap-1.5">
            <motion.div
              animate={{
                scale: activeTab === section ? 1.1 : 1,
              }}
              className="relative"
            >
              <span
                className={`
                  px-2 py-0.5 rounded-md text-[10px] font-medium
                  transition-all duration-300
                  ${activeTab === section ? 'text-white shadow-md' : 'text-[var(--text-body)] bg-[var(--warm-100)]'}
                `}
                style={{
                  backgroundColor: activeTab === section ? SECTION_COLORS[section] : undefined,
                }}
              >
                {SECTION_OPTIONS[section][indices[section]].label}
              </span>
            </motion.div>
            {idx < SECTION_ORDER.length - 1 && (
              <span className="text-[var(--text-muted)] text-xs">+</span>
            )}
          </div>
        ))}
        <span className="text-[var(--text-muted)] text-xs ml-0.5">=</span>
        <span className="text-base ml-0.5">💌</span>
      </div>

      {/* 핵심 메시지 */}
      <p className="mt-3 text-center text-xs text-[var(--text-muted)]">
        <span className="text-[var(--blush-500)] font-medium">탭</span>을 눌러 각 섹션을 탐색해보세요
      </p>
    </div>
  )
}

'use client'

/**
 * Section Combiner Preview
 *
 * 핵심 가치 "섹션별 조합"을 3초만에 전달
 * 디자인: 슬롯머신 스타일 - 각 섹션이 독립적으로 스핀
 *
 * 핵심 시각화:
 * 1. 3개의 수평 슬롯 (인트로, 인사말, 갤러리)
 * 2. 각 슬롯이 순차적으로 스핀하며 다른 옵션 표시
 * 3. "각 섹션을 원하는 대로 조합" 메시지
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    { id: 'gallery-square-3col', label: '3열 정방형' },
    { id: 'gallery-square-2col', label: '2열 정방형' },
    { id: 'gallery-rect-3col', label: '3열 세로형' },
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

// ============================================
// Main Component
// ============================================

export function SectionCombinerPreview() {
  const { state } = useSubwayBuilder()

  // 각 섹션의 현재 선택 인덱스
  const [indices, setIndices] = useState({ intro: 0, greeting: 0, gallery: 0 })
  // 현재 스핀 중인 섹션
  const [spinningSection, setSpinningSection] = useState<SectionType | null>(null)

  // 자동 스핀 애니메이션
  useEffect(() => {
    let sectionIdx = 0
    let intervalId: ReturnType<typeof setInterval>

    const spinCycle = () => {
      const section = SECTION_ORDER[sectionIdx]
      setSpinningSection(section)

      // 스핀 후 다음 옵션으로 변경
      setTimeout(() => {
        setIndices((prev) => ({
          ...prev,
          [section]: (prev[section] + 1) % SECTION_OPTIONS[section].length,
        }))
        setSpinningSection(null)

        // 다음 섹션으로
        sectionIdx = (sectionIdx + 1) % SECTION_ORDER.length
      }, 600)
    }

    // 초기 딜레이 후 시작
    const initialDelay = setTimeout(() => {
      spinCycle()
      intervalId = setInterval(spinCycle, 1800)
    }, 1000)

    return () => {
      clearTimeout(initialDelay)
      if (intervalId) clearInterval(intervalId)
    }
  }, [])

  return (
    <div className="relative w-full max-w-[320px] mx-auto">
      {/* 메인 슬롯 머신 UI */}
      <div className="relative">
        {/* 글로우 배경 */}
        <div
          className="absolute -inset-4 rounded-3xl blur-3xl opacity-20"
          style={{
            background: `conic-gradient(from 0deg, ${SECTION_COLORS.intro}, ${SECTION_COLORS.greeting}, ${SECTION_COLORS.gallery}, ${SECTION_COLORS.intro})`,
          }}
        />

        {/* 슬롯 컨테이너 */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl border border-[var(--warm-200)] shadow-2xl overflow-hidden">
          {/* 3개의 슬롯 행 */}
          <div className="flex flex-col">
            {SECTION_ORDER.map((section, idx) => (
              <SlotRow
                key={section}
                section={section}
                options={SECTION_OPTIONS[section]}
                currentIndex={indices[section]}
                isSpinning={spinningSection === section}
                cssVariables={state.cssVariables}
                isLast={idx === SECTION_ORDER.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 조합 공식 - 인터랙티브 라벨 */}
      <div className="mt-5 flex items-center justify-center gap-1.5">
        {SECTION_ORDER.map((section, idx) => (
          <motion.div key={section} className="flex items-center gap-1.5">
            <motion.div
              animate={{
                scale: spinningSection === section ? 1.15 : 1,
                y: spinningSection === section ? -3 : 0,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="relative"
            >
              <span
                className={`
                  px-2.5 py-1 rounded-lg text-[11px] font-semibold
                  transition-all duration-300
                  ${spinningSection === section ? 'text-white shadow-lg' : 'text-[var(--text-body)]'}
                `}
                style={{
                  backgroundColor:
                    spinningSection === section ? SECTION_COLORS[section] : 'var(--warm-100)',
                }}
              >
                {SECTION_LABELS[section]}
              </span>
              {/* 현재 선택 표시 (작은 라벨) */}
              <AnimatePresence>
                {spinningSection !== section && (
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-[var(--text-muted)] whitespace-nowrap"
                  >
                    {SECTION_OPTIONS[section][indices[section]].label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
            {idx < SECTION_ORDER.length - 1 && (
              <span className="text-[var(--text-muted)] text-sm font-light">+</span>
            )}
          </motion.div>
        ))}
        <span className="text-[var(--text-muted)] text-sm font-light ml-1">=</span>
        <motion.span
          className="text-xl ml-1"
          animate={{
            scale: spinningSection ? [1, 1.1, 1] : 1,
            rotate: spinningSection ? [0, 5, -5, 0] : 0,
          }}
          transition={{ duration: 0.4 }}
        >
          💌
        </motion.span>
      </div>

      {/* 핵심 메시지 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-[var(--text-body)]">
          <span className="font-medium text-[var(--blush-500)]">각 섹션</span>을
          <span className="font-medium text-[var(--blush-500)]"> 원하는 대로</span> 조합하세요
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          인트로는 A업체 스타일, 갤러리는 B업체 스타일로!
        </p>
      </motion.div>
    </div>
  )
}

// ============================================
// Slot Row Component
// ============================================

interface SlotRowProps {
  section: SectionType
  options: { id: string; label: string }[]
  currentIndex: number
  isSpinning: boolean
  cssVariables: Record<string, string>
  isLast: boolean
}

function SlotRow({
  section,
  options,
  currentIndex,
  isSpinning,
  cssVariables,
  isLast,
}: SlotRowProps) {
  const currentOption = options[currentIndex]

  // 섹션별 높이
  const heights: Record<SectionType, number> = {
    intro: 100,
    greeting: 70,
    gallery: 80,
  }

  const height = heights[section]

  return (
    <div className="relative">
      {/* 섹션 라벨 (왼쪽 사이드바) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-14 flex items-center justify-center z-10"
        style={{ backgroundColor: SECTION_COLORS[section] + '15' }}
      >
        <span
          className="text-[10px] font-bold -rotate-90 whitespace-nowrap tracking-wider"
          style={{ color: SECTION_COLORS[section] }}
        >
          {SECTION_LABELS[section]}
        </span>
      </div>

      {/* 슬롯 윈도우 */}
      <div className="relative ml-14 overflow-hidden" style={{ height }}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentOption.id}
            initial={{ y: -height, opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: height, opacity: 0.5 }}
            transition={{
              type: 'spring',
              stiffness: 350,
              damping: 35,
            }}
            className="absolute inset-0"
          >
            {/* 렌더링된 프리뷰 */}
            <div className="w-full h-full relative">
              {section === 'intro' ? (
                <MiniHeroRenderer
                  templateId={currentOption.id}
                  cssVariables={cssVariables}
                  width={260}
                  height={height}
                />
              ) : (
                <MiniBlockRenderer
                  presetId={currentOption.id}
                  cssVariables={cssVariables}
                  width={260}
                  height={height}
                />
              )}

              {/* 옵션 라벨 (오른쪽 하단) */}
              <div className="absolute bottom-1.5 right-2 z-10">
                <span className="px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-white font-medium backdrop-blur-sm">
                  {currentOption.label}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 스핀 중일 때 스캔라인 효과 */}
        <AnimatePresence>
          {isSpinning && (
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: '100%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'linear' }}
              className="absolute inset-0 z-20 pointer-events-none"
              style={{
                background: `linear-gradient(180deg, transparent 0%, ${SECTION_COLORS[section]}30 50%, transparent 100%)`,
              }}
            />
          )}
        </AnimatePresence>

        {/* 활성 표시 (오른쪽 바) */}
        <AnimatePresence>
          {isSpinning && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              className="absolute right-0 top-0 bottom-0 w-1 z-30"
              style={{
                backgroundColor: SECTION_COLORS[section],
                transformOrigin: 'center',
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* 구분선 */}
      {!isLast && <div className="absolute bottom-0 left-14 right-0 h-px bg-[var(--warm-200)]" />}
    </div>
  )
}

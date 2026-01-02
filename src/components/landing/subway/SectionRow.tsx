'use client'

/**
 * Section Row
 *
 * 섹션별 프리셋 가로 스크롤 Row
 * - 각 섹션 타입에 대한 프리셋들을 가로로 배치
 * - 선택된 프리셋 하이라이트
 * - scroll-snap으로 부드러운 스크롤
 *
 * variant="timeline" 모드:
 * - 선택된 프리셋이 가운데 고정
 * - 좌/우에 나머지 프리셋 배치
 * - 세로 타임라인 UI용
 */

import { useMemo, useRef, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PresetThumbnail } from './PresetThumbnail'
import {
  useSubwayBuilder,
  SECTION_LABELS,
  type SelectableSectionType,
} from './SubwayBuilderContext'
import { getBlockPresetsByType } from '@/lib/super-editor-v2/presets/blocks'

// ============================================
// Types
// ============================================

interface SectionRowProps {
  /** 섹션 타입 */
  sectionType: SelectableSectionType
  /** 레이아웃 모드: default(기존) | timeline(세로 타임라인) */
  variant?: 'default' | 'timeline'
  /** 썸네일 크기 */
  thumbnailWidth?: number
  thumbnailHeight?: number
  /** 타임라인 모드에서 가운데 카드 크기 */
  centerWidth?: number
  centerHeight?: number
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function SectionRow({
  sectionType,
  variant = 'default',
  thumbnailWidth = 90,
  thumbnailHeight = 130,
  centerWidth = 120,
  centerHeight = 180,
  className = '',
}: SectionRowProps) {
  const { state, setPreset } = useSubwayBuilder()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // 해당 섹션의 프리셋 목록
  const presets = useMemo(() => {
    return getBlockPresetsByType(sectionType as any)
  }, [sectionType])

  // 선택된 프리셋 ID
  const selectedPresetId = state.selectedPresets[sectionType]

  // 프리셋 선택 핸들러
  const handlePresetClick = useCallback(
    (presetId: string) => {
      setPreset(sectionType, presetId)
    },
    [sectionType, setPreset]
  )

  // 스크롤 버튼 핸들러
  const scrollBy = useCallback((direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = direction === 'left' ? -200 : 200
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }, [])

  // 선택된 프리셋으로 자동 스크롤
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || !selectedPresetId) return

    const selectedIndex = presets.findIndex((p) => p.id === selectedPresetId)
    if (selectedIndex === -1) return

    const itemWidth = thumbnailWidth + 12 // gap 포함
    const targetScroll =
      selectedIndex * itemWidth - container.clientWidth / 2 + itemWidth / 2
    container.scrollTo({ left: targetScroll, behavior: 'smooth' })
  }, [])

  if (presets.length === 0) {
    return null
  }

  // ============================================
  // Timeline 모드 렌더링 - Elevated Selection 패턴
  // 선택된 카드가 중앙에 크게, 나머지는 양옆에 작게
  // ============================================

  // 선택된 프리셋을 가운데에, 나머지는 좌우 균등 분배
  const { leftPresets, selectedPreset, rightPresets } = useMemo(() => {
    const selected = presets.find((p) => p.id === selectedPresetId) ?? presets[0]
    const others = presets.filter((p) => p.id !== selected?.id)
    const half = Math.ceil(others.length / 2)

    return {
      leftPresets: others.slice(0, half),
      selectedPreset: selected,
      rightPresets: others.slice(half),
    }
  }, [presets, selectedPresetId])

  if (variant === 'timeline') {
    return (
      <section className={`w-full ${className}`}>
        {/* 섹션 헤더 - 타임라인 도트와 라벨 */}
        <div className="flex items-center justify-center mb-6 relative">
          {/* 타임라인 도트 */}
          <div
            className="
              w-2.5 h-2.5 rounded-full bg-[var(--sage-500)]
              relative z-10 flex-shrink-0
              ring-[5px] ring-[var(--ivory-100)]
              shadow-[0_0_0_1px_var(--sage-300)]
            "
          />
          {/* 섹션 라벨 */}
          <span
            className="
              ml-3 text-[13px] font-medium text-[var(--sage-700)]
              tracking-[0.02em] uppercase
            "
            style={{ fontFamily: 'var(--font-heading, Noto Serif KR), serif' }}
          >
            {SECTION_LABELS[sectionType]}
          </span>
        </div>

        {/* 데스크탑: 3열 레이아웃 - 좌 | 중앙(선택) | 우 */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-4 lg:items-end lg:px-8">
          {/* 왼쪽 프리셋들 */}
          <div className="flex gap-2 justify-end items-end">
            <AnimatePresence mode="popLayout">
              {leftPresets.map((preset, index) => (
                <motion.div
                  key={preset.id}
                  layout
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 0.85, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.9 }}
                  whileHover={{ opacity: 1, y: -4 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="cursor-pointer"
                >
                  <PresetThumbnail
                    preset={preset}
                    isSelected={false}
                    onClick={() => handlePresetClick(preset.id)}
                    cssVariables={state.cssVariables}
                    width={thumbnailWidth}
                    height={thumbnailHeight}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* 중앙 선택된 프리셋 - 크고 강조됨 */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {selectedPreset && (
                <motion.div
                  key={selectedPreset.id}
                  initial={{ opacity: 0, scale: 0.85, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="relative"
                >
                  {/* 선택 강조 글로우 */}
                  <div
                    className="
                      absolute -inset-3 rounded-2xl opacity-40
                      bg-gradient-to-b from-[var(--sage-200)] via-[var(--sage-100)] to-transparent
                      blur-xl -z-10
                    "
                  />
                  <PresetThumbnail
                    preset={selectedPreset}
                    isSelected={true}
                    onClick={() => {}}
                    cssVariables={state.cssVariables}
                    width={centerWidth}
                    height={centerHeight}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 오른쪽 프리셋들 */}
          <div className="flex gap-2 justify-start items-end">
            <AnimatePresence mode="popLayout">
              {rightPresets.map((preset, index) => (
                <motion.div
                  key={preset.id}
                  layout
                  initial={{ opacity: 0, x: -20, scale: 0.9 }}
                  animate={{ opacity: 0.85, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  whileHover={{ opacity: 1, y: -4 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="cursor-pointer"
                >
                  <PresetThumbnail
                    preset={preset}
                    isSelected={false}
                    onClick={() => handlePresetClick(preset.id)}
                    cssVariables={state.cssVariables}
                    width={thumbnailWidth}
                    height={thumbnailHeight}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* 모바일: 가로 스크롤 - 선택된 카드 강조 */}
        <div className="lg:hidden relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scrollbar-hide items-end"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {presets.map((preset) => {
              const isSelected = selectedPresetId === preset.id
              return (
                <motion.div
                  key={preset.id}
                  animate={{
                    scale: isSelected ? 1 : 0.92,
                    opacity: isSelected ? 1 : 0.75,
                  }}
                  transition={{ duration: 0.25 }}
                  className="snap-center flex-shrink-0"
                >
                  <PresetThumbnail
                    preset={preset}
                    isSelected={isSelected}
                    onClick={() => handlePresetClick(preset.id)}
                    cssVariables={state.cssVariables}
                    width={isSelected ? centerWidth : thumbnailWidth}
                    height={isSelected ? centerHeight : thumbnailHeight}
                  />
                </motion.div>
              )
            })}
          </div>
          {/* 그라데이션 페이드 */}
          <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-[var(--ivory-100)] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[var(--ivory-100)] to-transparent pointer-events-none" />
        </div>
      </section>
    )
  }

  // ============================================
  // Default 모드 렌더링 (기존 로직)
  // ============================================
  return (
    <section className={`w-full ${className}`}>
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between mb-2 px-2">
        <h3 className="text-sm font-medium text-[var(--text-primary)]">
          {SECTION_LABELS[sectionType]}
        </h3>
        <span className="text-xs text-[var(--text-muted)]">
          {presets.length}개 스타일
        </span>
      </div>

      {/* 스크롤 컨테이너 */}
      <div className="relative group">
        {/* 왼쪽 스크롤 버튼 */}
        <button
          onClick={() => scrollBy('left')}
          className="
            absolute left-0 top-1/2 -translate-y-1/2 z-10
            w-7 h-7 rounded-full bg-white/90 shadow-md
            flex items-center justify-center
            opacity-0 group-hover:opacity-100 transition-opacity
            hover:bg-white
            disabled:opacity-0
          "
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 text-[var(--text-primary)]" />
        </button>

        {/* 프리셋 목록 */}
        <div
          ref={scrollContainerRef}
          className="
            flex gap-3 overflow-x-auto pb-2 px-2
            snap-x snap-mandatory
            scrollbar-hide
          "
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {presets.map((preset) => (
            <PresetThumbnail
              key={preset.id}
              preset={preset}
              isSelected={selectedPresetId === preset.id}
              onClick={() => handlePresetClick(preset.id)}
              cssVariables={state.cssVariables}
              width={thumbnailWidth}
              height={thumbnailHeight}
              className="snap-center"
            />
          ))}
        </div>

        {/* 오른쪽 스크롤 버튼 */}
        <button
          onClick={() => scrollBy('right')}
          className="
            absolute right-0 top-1/2 -translate-y-1/2 z-10
            w-7 h-7 rounded-full bg-white/90 shadow-md
            flex items-center justify-center
            opacity-0 group-hover:opacity-100 transition-opacity
            hover:bg-white
          "
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 text-[var(--text-primary)]" />
        </button>

        {/* 그라데이션 페이드 (좌우) */}
        <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-[var(--ivory-100)] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-[var(--ivory-100)] to-transparent pointer-events-none" />
      </div>
    </section>
  )
}

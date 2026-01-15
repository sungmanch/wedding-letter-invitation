'use client'

/**
 * Mobile Section Swiper
 *
 * 섹션별 프리셋 선택을 위한 스와이프 UI
 * - 프리셋 카드를 좌우로 스와이프
 * - 섹션별 설명 및 미리보기
 * - 선택 완료 시 자동 다음 단계
 */

import { useCallback, useState, useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight, Info } from 'lucide-react'
import {
  useSubwayBuilder,
  SECTION_LABELS,
  type SelectableSectionType,
} from '../../subway/SubwayBuilderContext'
import {
  HERO_PRESETS,
  GREETING_PARENTS_PRESETS,
  CALENDAR_PRESETS,
  GALLERY_PRESETS,
  LOCATION_PRESETS,
  type BlockPreset,
} from '@/lib/super-editor-v2/presets/blocks'
import { MiniBlockRenderer } from '../../subway/MiniBlockRenderer'

// ============================================
// Constants
// ============================================

/** 섹션별 프리셋 매핑 */
const SECTION_PRESETS: Record<SelectableSectionType, Record<string, BlockPreset>> = {
  hero: HERO_PRESETS,
  'greeting-parents': GREETING_PARENTS_PRESETS,
  calendar: CALENDAR_PRESETS,
  gallery: GALLERY_PRESETS,
  location: LOCATION_PRESETS,
}

/** 섹션별 설명 */
const SECTION_DESCRIPTIONS: Record<SelectableSectionType, string> = {
  hero: '메인 사진과 신랑신부 이름, 결혼 날짜를 표시해요',
  'greeting-parents': '신랑신부 인사말과 혼주 정보를 담아요',
  calendar: '결혼식 일시와 D-day를 표시해요',
  gallery: '웨딩 사진을 예쁘게 보여줘요',
  location: '예식장 위치와 약도를 안내해요',
}

/** 섹션별 팁 */
const SECTION_TIPS: Record<SelectableSectionType, string> = {
  hero: '대표 사진이 가장 잘 보이는 레이아웃을 선택하세요',
  'greeting-parents': '인사말 길이에 따라 적합한 레이아웃이 달라요',
  calendar: '카운트다운이 필요하다면 박스형을 추천해요',
  gallery: '사진 수에 따라 컬럼 수를 선택하세요',
  location: '지도 크기에 따라 레이아웃을 선택하세요',
}

const CARD_WIDTH = 140
const CARD_HEIGHT = 186 // 9:16 비율

// ============================================
// Component
// ============================================

interface MobileSectionSwiperProps {
  sectionType: SelectableSectionType
  onSelect: () => void
}

export function MobileSectionSwiper({ sectionType, onSelect }: MobileSectionSwiperProps) {
  const { state, setPreset } = useSubwayBuilder()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showTip, setShowTip] = useState(false)

  // 프리셋 목록
  const presets = useMemo(
    () => Object.values(SECTION_PRESETS[sectionType]),
    [sectionType]
  )

  // 현재 선택된 프리셋 인덱스
  const selectedIndex = useMemo(() => {
    const selectedId = state.selectedPresets[sectionType]
    return presets.findIndex((p) => p.id === selectedId)
  }, [presets, state.selectedPresets, sectionType])

  const [activeIndex, setActiveIndex] = useState(selectedIndex >= 0 ? selectedIndex : 0)

  // 프리셋 선택 핸들러
  const handleSelect = useCallback(
    (presetId: string) => {
      setPreset(sectionType, presetId)
    },
    [setPreset, sectionType]
  )

  // 스크롤 위치 업데이트
  useEffect(() => {
    if (scrollRef.current && activeIndex >= 0) {
      const scrollLeft = activeIndex * (CARD_WIDTH + 12) - (window.innerWidth - CARD_WIDTH) / 2 + CARD_WIDTH / 2
      scrollRef.current.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth',
      })
    }
  }, [activeIndex])

  // 현재 활성 프리셋
  const activePreset = presets[activeIndex]
  const selectedPresetId = state.selectedPresets[sectionType]
  const isActiveSelected = activePreset?.id === selectedPresetId

  return (
    <div className="h-full flex flex-col">
      {/* 섹션 설명 */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h2
              className="text-xl font-medium text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-display), serif' }}
            >
              {SECTION_LABELS[sectionType]} 스타일
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {SECTION_DESCRIPTIONS[sectionType]}
            </p>
          </div>

          {/* 팁 버튼 */}
          <button
            onClick={() => setShowTip(!showTip)}
            className={`
              p-2 rounded-full transition-colors
              ${showTip ? 'bg-[var(--blush-100)] text-[var(--blush-500)]' : 'text-[var(--text-muted)] hover:bg-[var(--warm-100)]'}
            `}
            aria-label="팁 보기"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* 팁 토스트 */}
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-3 rounded-xl bg-[var(--blush-50)] border border-[var(--blush-100)]"
          >
            <p className="text-xs text-[var(--blush-600)]">
              💡 {SECTION_TIPS[sectionType]}
            </p>
          </motion.div>
        )}
      </div>

      {/* 프리셋 카드 스크롤 */}
      <div className="flex-1 flex flex-col justify-center">
        <div
          ref={scrollRef}
          className="flex gap-3 px-4 py-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* 왼쪽 패딩 */}
          <div className="flex-shrink-0" style={{ width: `calc(50vw - ${CARD_WIDTH / 2}px - 16px)` }} />

          {presets.map((preset, index) => (
            <motion.div
              key={preset.id}
              className="flex-shrink-0 snap-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <PresetCard
                preset={preset}
                isSelected={preset.id === selectedPresetId}
                isActive={index === activeIndex}
                cssVariables={state.cssVariables}
                onClick={() => {
                  setActiveIndex(index)
                  handleSelect(preset.id)
                }}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
              />
            </motion.div>
          ))}

          {/* 오른쪽 패딩 */}
          <div className="flex-shrink-0" style={{ width: `calc(50vw - ${CARD_WIDTH / 2}px - 16px)` }} />
        </div>

        {/* 인디케이터 */}
        <div className="flex justify-center gap-1.5 mt-2">
          {presets.map((preset, index) => (
            <button
              key={preset.id}
              onClick={() => {
                setActiveIndex(index)
                handleSelect(preset.id)
              }}
              className={`
                h-1.5 rounded-full transition-all duration-300
                ${
                  preset.id === selectedPresetId
                    ? 'bg-[var(--blush-400)] w-4'
                    : index === activeIndex
                    ? 'bg-[var(--blush-300)] w-2'
                    : 'bg-[var(--warm-300)] w-1.5'
                }
              `}
              aria-label={`프리셋 ${index + 1} 선택`}
            />
          ))}
        </div>
      </div>

      {/* 현재 프리셋 정보 */}
      <div className="px-4 py-4 text-center">
        {activePreset && (
          <motion.div
            key={activePreset.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-base font-medium text-[var(--text-primary)]">
              {activePreset.nameKo || activePreset.name}
            </h3>
            {activePreset.description && (
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {activePreset.description}
              </p>
            )}
          </motion.div>
        )}

        {/* 선택 버튼 */}
        <motion.button
          onClick={() => {
            if (activePreset) {
              handleSelect(activePreset.id)
              onSelect()
            }
          }}
          className={`
            mt-4 px-8 py-3 rounded-full text-sm font-medium
            transition-all duration-300
            ${
              isActiveSelected
                ? 'bg-[var(--blush-400)] text-white shadow-lg shadow-[var(--blush-400)]/30'
                : 'bg-[var(--warm-100)] text-[var(--text-primary)] hover:bg-[var(--warm-200)]'
            }
          `}
          whileTap={{ scale: 0.95 }}
        >
          {isActiveSelected ? (
            <span className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4" />
              선택됨 - 다음으로
            </span>
          ) : (
            '이 스타일 선택하기'
          )}
        </motion.button>
      </div>
    </div>
  )
}

// ============================================
// Preset Card
// ============================================

interface PresetCardProps {
  preset: BlockPreset
  isSelected: boolean
  isActive: boolean
  cssVariables: Record<string, string>
  onClick: () => void
  width: number
  height: number
}

function PresetCard({
  preset,
  isSelected,
  isActive,
  cssVariables,
  onClick,
  width,
  height,
}: PresetCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative rounded-xl overflow-hidden
        border-2 transition-all duration-300
        ${
          isSelected
            ? 'border-[var(--blush-400)] shadow-lg shadow-[var(--blush-400)]/20 scale-105'
            : isActive
            ? 'border-[var(--blush-200)] shadow-md'
            : 'border-[var(--warm-200)] hover:border-[var(--blush-200)]'
        }
      `}
      style={{ width, height }}
    >
      {/* Mini Block Renderer */}
      <MiniBlockRenderer
        presetId={preset.id}
        cssVariables={cssVariables}
        width={width}
        height={height}
      />

      {/* 선택 체크 */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--blush-400)] flex items-center justify-center shadow-md z-10">
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </div>
      )}
    </button>
  )
}

'use client'

/**
 * Section Accordion
 *
 * 섹션별 프리셋 선택을 위한 아코디언 UI
 * - Progressive Disclosure: 한 번에 하나의 섹션만 펼쳐짐
 * - 2-3개 대표 프리셋 표시, "더보기"로 전체 노출
 * - 선택 시 즉시 프리뷰에 반영
 */

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { PresetThumbnail } from '../subway/PresetThumbnail'
import {
  useSubwayBuilder,
  SECTION_ORDER,
  SECTION_LABELS,
  type SelectableSectionType,
} from '../subway/SubwayBuilderContext'
import {
  HERO_PRESETS,
  GREETING_PARENTS_PRESETS,
  CALENDAR_PRESETS,
  GALLERY_PRESETS,
  LOCATION_PRESETS,
  type BlockPreset,
} from '@/lib/super-editor-v2/presets/blocks'

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

/** 섹션별 초기 표시 개수 (더보기 전) */
const INITIAL_VISIBLE_COUNT = 4

/** 섹션별 설명 */
const SECTION_DESCRIPTIONS: Record<SelectableSectionType, string> = {
  hero: '메인 사진과 신랑신부 이름, 결혼 날짜를 표시하는 대표 섹션',
  'greeting-parents': '신랑신부 인사말과 혼주 정보를 담는 섹션',
  calendar: '결혼식 일시와 D-day를 표시하는 섹션',
  gallery: '웨딩 사진을 보여주는 갤러리 섹션',
  location: '예식장 위치와 약도를 안내하는 섹션',
}

// ============================================
// Component
// ============================================

export function SectionAccordion() {
  const { state, setPreset } = useSubwayBuilder()
  const [openSection, setOpenSection] = useState<SelectableSectionType | null>(
    'hero'
  )
  const [expandedSections, setExpandedSections] = useState<
    Set<SelectableSectionType>
  >(new Set())

  // 섹션 토글
  const handleToggleSection = useCallback(
    (sectionType: SelectableSectionType) => {
      setOpenSection((prev) => (prev === sectionType ? null : sectionType))
    },
    []
  )

  // 더보기 토글
  const handleToggleExpand = useCallback(
    (sectionType: SelectableSectionType, e: React.MouseEvent) => {
      e.stopPropagation()
      setExpandedSections((prev) => {
        const next = new Set(prev)
        if (next.has(sectionType)) {
          next.delete(sectionType)
        } else {
          next.add(sectionType)
        }
        return next
      })
    },
    []
  )

  // 프리셋 선택
  const handleSelectPreset = useCallback(
    (sectionType: SelectableSectionType, presetId: string) => {
      setPreset(sectionType, presetId)
    },
    [setPreset]
  )

  return (
    <div className="space-y-3">
      {SECTION_ORDER.map((sectionType) => (
        <AccordionItem
          key={sectionType}
          sectionType={sectionType}
          isOpen={openSection === sectionType}
          isExpanded={expandedSections.has(sectionType)}
          selectedPresetId={state.selectedPresets[sectionType]}
          cssVariables={state.cssVariables}
          onToggle={() => handleToggleSection(sectionType)}
          onToggleExpand={(e) => handleToggleExpand(sectionType, e)}
          onSelectPreset={(presetId) =>
            handleSelectPreset(sectionType, presetId)
          }
        />
      ))}
    </div>
  )
}

// ============================================
// Sub Components
// ============================================

interface AccordionItemProps {
  sectionType: SelectableSectionType
  isOpen: boolean
  isExpanded: boolean
  selectedPresetId: string
  cssVariables: Record<string, string>
  onToggle: () => void
  onToggleExpand: (e: React.MouseEvent) => void
  onSelectPreset: (presetId: string) => void
}

function AccordionItem({
  sectionType,
  isOpen,
  isExpanded,
  selectedPresetId,
  cssVariables,
  onToggle,
  onToggleExpand,
  onSelectPreset,
}: AccordionItemProps) {
  // 프리셋 목록
  const presets = useMemo(
    () => Object.values(SECTION_PRESETS[sectionType]),
    [sectionType]
  )
  const presetIds = useMemo(
    () => Object.keys(SECTION_PRESETS[sectionType]),
    [sectionType]
  )

  // 표시할 프리셋 (더보기 상태에 따라)
  const visiblePresets = useMemo(() => {
    if (isExpanded) return presets
    return presets.slice(0, INITIAL_VISIBLE_COUNT)
  }, [presets, isExpanded])

  const hasMore = presets.length > INITIAL_VISIBLE_COUNT

  // 선택된 프리셋 이름
  const selectedPreset = presets.find((p) => p.id === selectedPresetId)

  return (
    <div
      className={`
        rounded-xl border transition-all duration-300
        ${
          isOpen
            ? 'border-[var(--sage-300)] bg-white shadow-sm'
            : 'border-[var(--sand-200)] bg-[var(--ivory-50)] hover:border-[var(--sage-200)]'
        }
      `}
    >
      {/* 헤더 */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          {/* 체크 표시 */}
          <div
            className={`
              w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
              ${
                selectedPresetId
                  ? 'bg-[var(--sage-500)] text-white'
                  : 'bg-[var(--sand-200)]'
              }
            `}
          >
            {selectedPresetId && <Check className="w-3 h-3" />}
          </div>

          {/* 섹션 정보 */}
          <div>
            <h4 className="text-sm font-medium text-[var(--text-primary)]">
              {SECTION_LABELS[sectionType]}
            </h4>
            {!isOpen && selectedPreset && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {selectedPreset.nameKo || selectedPreset.name}
              </p>
            )}
          </div>
        </div>

        {/* 펼침 아이콘 */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
        </motion.div>
      </button>

      {/* 콘텐츠 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {/* 섹션 설명 */}
              <p className="text-xs text-[var(--text-muted)] mb-4">
                {SECTION_DESCRIPTIONS[sectionType]}
              </p>

              {/* 프리셋 그리드 */}
              <div className="grid grid-cols-4 gap-3">
                {visiblePresets.map((preset) => (
                  <PresetThumbnail
                    key={preset.id}
                    preset={preset}
                    isSelected={preset.id === selectedPresetId}
                    onClick={() => onSelectPreset(preset.id)}
                    cssVariables={cssVariables}
                    width={90}
                    height={120}
                  />
                ))}
              </div>

              {/* 더보기 버튼 */}
              {hasMore && (
                <button
                  onClick={onToggleExpand}
                  className="mt-4 w-full py-2 text-xs text-[var(--sage-600)] hover:text-[var(--sage-700)] font-medium transition-colors"
                >
                  {isExpanded
                    ? '접기'
                    : `${presets.length - INITIAL_VISIBLE_COUNT}개 더 보기`}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

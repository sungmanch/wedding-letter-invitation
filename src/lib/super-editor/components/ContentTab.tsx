'use client'

import { useCallback, useMemo, useRef, useEffect } from 'react'
import { useSuperEditor } from '../context'
import { SectionAccordion } from './SectionAccordion'
import { EditorToolbar } from './EditorPanel'
import { extractSectionsFromLayout } from '../utils/variable-extractor'
import { SECTION_META, REORDERABLE_SECTIONS } from '../schema/section-types'
import type { SectionType } from '../schema/section-types'
import type { LayoutSchema } from '../schema/layout'
import type { VariableDeclaration } from '../schema/variables'

interface ContentTabProps {
  /** 섹션 순서 */
  sectionOrder: SectionType[]
  /** 섹션 활성화 상태 */
  sectionEnabled: Record<SectionType, boolean>
  /** 순서 변경 콜백 */
  onOrderChange: (newOrder: SectionType[]) => void
  /** 활성화 상태 변경 콜백 */
  onEnabledChange: (newEnabled: Record<SectionType, boolean>) => void
  /** Layout 스키마 */
  layout?: LayoutSchema
  /** 변수 선언 */
  declarations?: VariableDeclaration[]
  /** 현재 펼쳐진 섹션 */
  expandedSection: SectionType | null
  /** 펼쳐진 섹션 변경 콜백 */
  onExpandedSectionChange: (sectionType: SectionType | null) => void
  className?: string
}

export function ContentTab({
  sectionOrder,
  sectionEnabled,
  onOrderChange,
  onEnabledChange,
  layout,
  declarations,
  expandedSection,
  onExpandedSectionChange,
  className = '',
}: ContentTabProps) {
  // 각 섹션의 ref를 저장
  const sectionRefs = useRef<Record<SectionType, HTMLDivElement | null>>({} as Record<SectionType, HTMLDivElement | null>)

  // Layout에서 실제 존재하는 섹션 추출
  const availableSections = useMemo(() => {
    if (!layout) return new Set<SectionType>()
    return new Set(extractSectionsFromLayout(layout) as SectionType[])
  }, [layout])

  // intro/music 존재 여부
  const hasIntro = availableSections.has('intro')
  const hasMusic = availableSections.has('music')

  // 표시할 순서 변경 가능한 섹션들 (layout에 있는 것만)
  const displayOrder = useMemo(() => {
    return sectionOrder.filter(
      (s) =>
        availableSections.has(s) &&
        REORDERABLE_SECTIONS.includes(s as (typeof REORDERABLE_SECTIONS)[number])
    )
  }, [sectionOrder, availableSections])

  // 섹션 토글
  const toggleSection = useCallback(
    (sectionType: SectionType) => {
      onEnabledChange({
        ...sectionEnabled,
        [sectionType]: !sectionEnabled[sectionType],
      })
    },
    [sectionEnabled, onEnabledChange]
  )

  // 섹션 순서 변경
  const moveSection = useCallback(
    (sectionType: SectionType, direction: 'up' | 'down') => {
      const currentIndex = sectionOrder.indexOf(sectionType)
      if (currentIndex === -1) return

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (newIndex < 0 || newIndex >= sectionOrder.length) return

      const newOrder = [...sectionOrder]
      const [moved] = newOrder.splice(currentIndex, 1)
      newOrder.splice(newIndex, 0, moved)
      onOrderChange(newOrder)
    },
    [sectionOrder, onOrderChange]
  )

  // 섹션 펼치기/접기
  const handleExpand = useCallback(
    (sectionType: SectionType) => {
      if (expandedSection === sectionType) {
        onExpandedSectionChange(null)
      } else {
        onExpandedSectionChange(sectionType)
      }
    },
    [expandedSection, onExpandedSectionChange]
  )

  // ref 설정 함수
  const setRef = useCallback(
    (sectionType: SectionType) => (el: HTMLDivElement | null) => {
      sectionRefs.current[sectionType] = el
    },
    []
  )

  return (
    <div className={`flex flex-col ${className}`}>
      {/* 툴바 */}
      <EditorToolbar />

      {/* 섹션 목록 */}
      <div className="flex-1 overflow-y-auto scrollbar-gold p-4 space-y-2">
        {/* 고정 섹션: intro */}
        {hasIntro && (
          <div ref={setRef('intro')}>
            <SectionAccordion
              sectionType="intro"
              expanded={expandedSection === 'intro'}
              onExpand={() => handleExpand('intro')}
              enabled={sectionEnabled.intro}
              onToggle={() => toggleSection('intro')}
              layout={layout}
              declarations={declarations}
              fixed
            />
          </div>
        )}

        {/* 순서 변경 가능한 섹션들 */}
        {displayOrder.map((sectionType, index) => (
          <div key={sectionType} ref={setRef(sectionType)}>
            <SectionAccordion
              sectionType={sectionType}
              expanded={expandedSection === sectionType}
              onExpand={() => handleExpand(sectionType)}
              enabled={sectionEnabled[sectionType]}
              onToggle={() => toggleSection(sectionType)}
              layout={layout}
              declarations={declarations}
              onMoveUp={() => moveSection(sectionType, 'up')}
              onMoveDown={() => moveSection(sectionType, 'down')}
              canMoveUp={index > 0}
              canMoveDown={index < displayOrder.length - 1}
            />
          </div>
        ))}

        {/* 플로팅 섹션: music */}
        {hasMusic && (
          <>
            <div className="pt-4 border-t border-white/10 mt-4">
              <p className="text-xs text-[#F5E6D3]/50 mb-2 px-1">플로팅 섹션</p>
            </div>
            <div ref={setRef('music')}>
              <SectionAccordion
                sectionType="music"
                expanded={expandedSection === 'music'}
                onExpand={() => handleExpand('music')}
                enabled={sectionEnabled.music}
                onToggle={() => toggleSection('music')}
                layout={layout}
                declarations={declarations}
                floating
              />
            </div>
          </>
        )}

        {/* Layout에 섹션이 없는 경우 안내 */}
        {availableSections.size === 0 && (
          <div className="p-8 text-center text-[#F5E6D3]/50">
            <p className="text-sm">레이아웃에 정의된 섹션이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  )
}

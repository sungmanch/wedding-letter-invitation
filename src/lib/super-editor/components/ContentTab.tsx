'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { SectionAccordion } from './SectionAccordion'
import { EditorToolbar } from './EditorPanel'
import { extractSectionsFromLayout } from '../utils/variable-extractor'
import { REORDERABLE_SECTIONS, SECTION_META, type SectionType } from '../schema/section-types'
import { getAllSectionTypes } from '../skeletons/registry'
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
  /** 섹션 추가 콜백 */
  onAddSection?: (sectionType: SectionType) => void
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
  onAddSection,
  className = '',
}: ContentTabProps) {
  // 각 섹션의 ref를 저장
  const sectionRefs = useRef<Record<SectionType, HTMLDivElement | null>>({} as Record<SectionType, HTMLDivElement | null>)
  // 드롭다운 열림 상태
  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false)

  // Layout에서 실제 존재하는 섹션 추출
  const availableSections = useMemo(() => {
    if (!layout) return new Set<SectionType>()
    return new Set(extractSectionsFromLayout(layout) as SectionType[])
  }, [layout])

  // intro/music/photobooth 존재 여부
  const hasIntro = availableSections.has('intro')
  const hasMusic = availableSections.has('music')
  const hasPhotobooth = availableSections.has('photobooth')

  // 추가 가능한 섹션 목록 (layout에 없는 것들)
  const missingSections = useMemo(() => {
    const allSections = getAllSectionTypes()
    return allSections.filter((s) => !availableSections.has(s))
  }, [availableSections])

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

  // 섹션 추가 핸들러
  const handleAddSection = useCallback(
    (sectionType: SectionType) => {
      if (onAddSection) {
        onAddSection(sectionType)
        setIsAddDropdownOpen(false)
      }
    },
    [onAddSection]
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

        {/* 플로팅 섹션: music, photobooth */}
        {(hasMusic || hasPhotobooth) && (
          <>
            <div className="pt-4 border-t border-white/10 mt-4">
              <p className="text-xs text-[#F5E6D3]/50 mb-2 px-1">추가 섹션</p>
            </div>
            {hasMusic && (
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
            )}
            {hasPhotobooth && (
              <div ref={setRef('photobooth')}>
                <SectionAccordion
                  sectionType="photobooth"
                  expanded={expandedSection === 'photobooth'}
                  onExpand={() => handleExpand('photobooth')}
                  enabled={sectionEnabled.photobooth}
                  onToggle={() => toggleSection('photobooth')}
                  layout={layout}
                  declarations={declarations}
                />
              </div>
            )}
          </>
        )}

        {/* Layout에 섹션이 없는 경우 안내 */}
        {availableSections.size === 0 && (
          <div className="p-8 text-center text-[#F5E6D3]/50">
            <p className="text-sm">레이아웃에 정의된 섹션이 없습니다</p>
          </div>
        )}

        {/* 섹션 추가 드롭다운 */}
        {onAddSection && missingSections.length > 0 && (
          <div className="pt-4 border-t border-white/10 mt-4 relative">
            <button
              onClick={() => setIsAddDropdownOpen(!isAddDropdownOpen)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-[#C9A962] bg-[#C9A962]/10 hover:bg-[#C9A962]/20 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              섹션 추가
              <svg
                className={`w-4 h-4 transition-transform ${isAddDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* 드롭다운 메뉴 */}
            {isAddDropdownOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-[#2A2A2A] border border-white/10 rounded-lg shadow-lg overflow-hidden z-10">
                {missingSections.map((sectionType) => {
                  const meta = SECTION_META[sectionType]
                  return (
                    <button
                      key={sectionType}
                      onClick={() => handleAddSection(sectionType)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="text-[#C9A962]">{meta.icon === 'sparkles' ? '✨' : meta.icon === 'message-square' ? '💬' : meta.icon === 'phone' ? '📞' : meta.icon === 'map-pin' ? '📍' : meta.icon === 'calendar' ? '📅' : meta.icon === 'images' ? '🖼️' : meta.icon === 'users' ? '👥' : meta.icon === 'credit-card' ? '💳' : meta.icon === 'music' ? '🎵' : meta.icon === 'camera' ? '📸' : '📄'}</span>
                      <div className="flex-1">
                        <p className="text-sm text-[#F5E6D3]">{meta.label}</p>
                        <p className="text-xs text-[#F5E6D3]/50">{meta.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

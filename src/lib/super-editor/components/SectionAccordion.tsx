'use client'

import { useMemo } from 'react'
import { useSuperEditor } from '../context'
import { FieldRenderer } from './fields/FieldRenderer'
import { generateEditorSectionsFromLayout } from '../utils/editor-generator'
import { SECTION_META } from '../schema/section-types'
import type { SectionType } from '../schema/section-types'
import type { LayoutSchema } from '../schema/layout'
import type { VariableDeclaration } from '../schema/variables'

interface SectionAccordionProps {
  sectionType: SectionType
  expanded: boolean
  onExpand: () => void
  enabled: boolean
  onToggle: () => void
  /** Layout 스키마 - 변수 기반 동적 에디터 생성 */
  layout?: LayoutSchema
  /** AI/Skeleton이 제공한 변수 선언 */
  declarations?: VariableDeclaration[]
  /** 순서 고정 (intro) */
  fixed?: boolean
  /** 플로팅 UI (music) */
  floating?: boolean
  /** 순서 이동 콜백 */
  onMoveUp?: () => void
  onMoveDown?: () => void
  /** 순서 이동 가능 여부 */
  canMoveUp?: boolean
  canMoveDown?: boolean
  /** 스크롤 대상 ref */
  accordionRef?: React.RefObject<HTMLDivElement>
}

export function SectionAccordion({
  sectionType,
  expanded,
  onExpand,
  enabled,
  onToggle,
  layout,
  declarations,
  fixed = false,
  floating = false,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
  accordionRef,
}: SectionAccordionProps) {
  const { state } = useSuperEditor()
  const meta = SECTION_META[sectionType]

  // 해당 섹션의 필드들만 생성
  const sectionFields = useMemo(() => {
    if (!layout) return []

    const allSections = generateEditorSectionsFromLayout({
      layout,
      declarations,
      fallbackToStandard: true,
      inferUnknown: true,
      groupBySection: true,
    })

    // 해당 sectionType에 해당하는 섹션만 필터
    const matchingSections = allSections.filter((section) => {
      // section.id가 sectionType과 일치하거나
      // section.id가 sectionType으로 시작하는 경우 (예: intro-basic)
      const sectionId = section.id.toLowerCase()
      const targetType = sectionType.toLowerCase()
      return sectionId === targetType || sectionId.startsWith(`${targetType}-`)
    })

    // 모든 매칭 섹션의 필드들을 합침
    return matchingSections.flatMap((section) => section.fields)
  }, [layout, declarations, sectionType])

  const handleToggleExpand = () => {
    if (enabled) {
      onExpand()
    }
  }

  return (
    <div
      ref={accordionRef}
      className={`border rounded-lg overflow-hidden transition-all ${
        enabled
          ? 'bg-white/5 border-white/10'
          : 'bg-white/[0.02] border-white/5 opacity-60'
      } ${expanded && enabled ? 'ring-1 ring-[#C9A962]/30' : ''}`}
    >
      {/* 헤더 */}
      <div
        className={`flex items-center justify-between px-3 py-3 ${
          enabled ? 'cursor-pointer hover:bg-white/5' : ''
        }`}
        onClick={handleToggleExpand}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* 순서 변경 버튼 (고정/플로팅이 아닌 경우) */}
          {!fixed && !floating && (
            <div
              className="flex flex-col gap-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={onMoveUp}
                disabled={!canMoveUp || !enabled}
                className="p-0.5 text-[#F5E6D3]/40 hover:text-[#F5E6D3] disabled:opacity-30 disabled:cursor-not-allowed"
                title="위로 이동"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={onMoveDown}
                disabled={!canMoveDown || !enabled}
                className="p-0.5 text-[#F5E6D3]/40 hover:text-[#F5E6D3] disabled:opacity-30 disabled:cursor-not-allowed"
                title="아래로 이동"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}

          {/* 고정 아이콘 (intro) */}
          {fixed && (
            <div className="w-6 h-6 flex items-center justify-center text-[#F5E6D3]/40">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          )}

          {/* 플로팅 아이콘 (music) */}
          {floating && (
            <div className="w-6 h-6 flex items-center justify-center text-[#F5E6D3]/40">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
          )}

          {/* 섹션 정보 */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[#F5E6D3] truncate">{meta.label}</p>
            {!expanded && (
              <p className="text-xs text-[#F5E6D3]/50 truncate">{meta.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* 고정/플로팅 뱃지 */}
          {fixed && (
            <span className="text-xs text-[#F5E6D3]/40 px-2 py-0.5 bg-white/5 rounded">
              고정
            </span>
          )}
          {floating && (
            <span className="text-xs text-[#F5E6D3]/40 px-2 py-0.5 bg-white/5 rounded">
              플로팅
            </span>
          )}

          {/* 활성화 토글 */}
          <label
            className="relative inline-flex items-center cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={enabled}
              onChange={onToggle}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#C9A962]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/30 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C9A962]" />
          </label>

          {/* 펼침/접힘 화살표 */}
          <button
            type="button"
            disabled={!enabled}
            className={`p-1 text-[#F5E6D3]/60 transition-transform ${
              expanded ? 'rotate-180' : ''
            } ${!enabled ? 'opacity-30' : ''}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 본문 (펼쳐진 경우) */}
      {expanded && enabled && (
        <div className="border-t border-white/10 p-4 space-y-4">
          {sectionFields.length > 0 ? (
            sectionFields
              .sort((a, b) => a.order - b.order)
              .map((field) => <FieldRenderer key={field.id} field={field} />)
          ) : (
            <div className="text-center py-4 text-[#F5E6D3]/50 text-sm">
              편집 가능한 필드가 없습니다
            </div>
          )}
        </div>
      )}
    </div>
  )
}

'use client'

import { useMemo } from 'react'
import { useSuperEditor } from '../context'
import { SectionRenderer } from './fields/FieldRenderer'
import { generateEditorSections, SECTION_TYPE_TO_EDITOR_SECTIONS } from '../utils/dynamic-editor'
import { generateEditorSectionsFromLayout } from '../utils/editor-generator'
import type { SectionType, SectionScreen } from '../skeletons/types'
import type { EditorSection } from '../schema/editor'
import type { LayoutSchema } from '../schema/layout'
import type { VariableDeclaration } from '../schema/variables'

interface EditorPanelProps {
  className?: string
  /** 활성화된 섹션 목록 - 제공되면 동적으로 에디터 필드 생성 (레거시) */
  enabledSections?: SectionType[]
  /** 커스텀 섹션 (동적 생성 대신 직접 제공) */
  customSections?: EditorSection[]
  /** Layout 스키마 - 제공되면 변수 기반 동적 에디터 생성 */
  layout?: LayoutSchema
  /** 섹션 스크린 배열 - layout 대신 사용 가능 */
  screens?: SectionScreen[]
  /** AI/Skeleton이 제공한 변수 선언 */
  declarations?: VariableDeclaration[]
}

export function EditorPanel({
  className = '',
  enabledSections,
  customSections,
  layout,
  screens,
  declarations,
}: EditorPanelProps) {
  const { state } = useSuperEditor()
  const { loading, error } = state

  // 동적으로 에디터 섹션 생성
  // 우선순위: customSections > layout/screens 기반 > enabledSections(레거시)
  // enabledSections가 있으면 해당 섹션만 필터링하여 표시
  const sections = useMemo(() => {
    let generatedSections: EditorSection[] = []

    // 1. 커스텀 섹션 직접 제공
    if (customSections) {
      generatedSections = customSections
    }
    // 2. 새 방식: Layout/Screens에서 변수 추출하여 동적 생성
    else if (layout || screens) {
      generatedSections = generateEditorSectionsFromLayout({
        layout,
        screens,
        declarations,
        fallbackToStandard: true,
        inferUnknown: true,
        groupBySection: true,
      })
    }
    // 3. 레거시 방식: enabledSections 기반 정적 매핑
    else if (enabledSections && enabledSections.length > 0) {
      return generateEditorSections(enabledSections)
    }

    // enabledSections 기반 필터링 및 순서 정렬
    // 섹션 탭에서 활성화된 섹션만 내용 탭에 표시
    if (enabledSections && enabledSections.length > 0 && generatedSections.length > 0) {
      // 활성화된 섹션에 해당하는 에디터 섹션 ID 수집
      const allowedIds = new Set<string>()
      const orderMap = new Map<string, number>()

      enabledSections.forEach((sectionType, index) => {
        const ids = SECTION_TYPE_TO_EDITOR_SECTIONS[sectionType] || []
        ids.forEach((id) => {
          allowedIds.add(id)
          // 첫 번째로 등장한 순서만 기록 (중복 섹션 처리)
          if (!orderMap.has(id)) {
            orderMap.set(id, index)
          }
        })
      })

      // 필터링: 활성화된 섹션만
      generatedSections = generatedSections.filter((s) => allowedIds.has(s.id))

      // 정렬: enabledSections 순서대로
      generatedSections.sort((a, b) => {
        const orderA = orderMap.get(a.id) ?? 999
        const orderB = orderMap.get(b.id) ?? 999
        return orderA - orderB
      })
    }

    return generatedSections
  }, [enabledSections, customSections, layout, screens, declarations])

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin w-8 h-8 border-2 border-[#C9A962] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400">
          <p className="font-medium">오류가 발생했습니다</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  if (sections.length === 0) {
    return (
      <div className={`flex items-center justify-center p-8 text-[#F5E6D3]/50 ${className}`}>
        <p>편집할 필드가 없습니다</p>
      </div>
    )
  }

  return (
    <div className={`overflow-auto ${className}`}>
      <div className="p-4 space-y-4">
        {/* 섹션들 */}
        {sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
      </div>
    </div>
  )
}

// 에디터 툴바
export function EditorToolbar({ className = '' }: { className?: string }) {
  const { state, setMode, undo, redo, canUndo, canRedo } = useSuperEditor()
  const { mode, dirty } = state

  return (
    <div
      className={`flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#1A1A1A] ${className}`}
    >
      {/* 왼쪽: Undo/Redo */}
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-2 rounded-lg text-[#F5E6D3] hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          title="실행 취소"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-2 rounded-lg text-[#F5E6D3] hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          title="다시 실행"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
          </svg>
        </button>

        {dirty && (
          <span className="ml-2 text-xs text-[#C9A962]">저장되지 않음</span>
        )}
      </div>

      {/* 오른쪽: 모드 전환 */}
      <div className="flex items-center gap-2">
        <div className="flex rounded-lg border border-white/10 overflow-hidden">
          <button
            onClick={() => setMode('edit')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'edit'
                ? 'bg-[#C9A962] text-[#0A0806]'
                : 'bg-white/5 text-[#F5E6D3]/60 hover:bg-white/10'
            }`}
          >
            편집
          </button>
          <button
            onClick={() => setMode('preview')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'preview'
                ? 'bg-[#C9A962] text-[#0A0806]'
                : 'bg-white/5 text-[#F5E6D3]/60 hover:bg-white/10'
            }`}
          >
            미리보기
          </button>
        </div>
      </div>
    </div>
  )
}

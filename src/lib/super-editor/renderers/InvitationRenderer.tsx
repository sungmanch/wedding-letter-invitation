'use client'

/**
 * InvitationRenderer - 전체 청첩장 렌더링 오케스트레이터
 * 섹션 순서/활성화 관리, 스크롤 스택 구성
 *
 * Clean Architecture:
 * - TokenStyleProvider를 통해 CSS 변수 주입 (단일 책임)
 * - visibleSections로 렌더링 섹션 제어 (개방-폐쇄)
 */

import React from 'react'
import type { LayoutSchema, Screen } from '../schema/layout'
import type { StyleSchema } from '../schema/style'
import type { UserData } from '../schema/user-data'
import {
  DEFAULT_SECTION_ORDER,
  DEFAULT_SECTION_ENABLED,
  type SectionType,
} from '../schema/section-types'
import { SectionRenderer } from './SectionRenderer'
import { TokenStyleProvider } from '../context/TokenStyleContext'

// ============================================
// Types
// ============================================

interface InvitationRendererProps {
  layout: LayoutSchema
  style: StyleSchema
  userData: UserData
  mode?: 'preview' | 'edit' | 'build'

  // 섹션 순서/활성화 제어 (선택적)
  sectionOrder?: SectionType[]
  sectionEnabled?: Record<SectionType, boolean>

  // 편집 모드 (선택적)
  selectedNodeId?: string
  onSelectNode?: (id: string) => void

  // 섹션 클릭 핸들러 (에디터 연동)
  onSectionClick?: (sectionType: SectionType) => void
  // 하이라이트할 섹션 (에디터에서 펼쳐진 섹션)
  highlightedSection?: SectionType | null

  // 표시할 섹션 타입 제한 (선택적)
  // undefined = sectionEnabled 기반, ['intro'] = 인트로만
  visibleSections?: SectionType[]

  // Variant switcher
  sectionVariants?: Record<SectionType, string>
  onVariantChange?: (sectionType: SectionType, variantId: string) => void

  // 섹션 내부 VariantSwitcher 표시 여부 (false면 외부 패널 사용)
  showVariantSwitcher?: boolean

  className?: string
}

// ============================================
// Helper Functions
// ============================================

/**
 * 섹션 정렬 및 필터링
 */
function getSortedSections(
  screens: Screen[],
  sectionOrder: SectionType[],
  sectionEnabled: Record<SectionType, boolean>,
  visibleSections?: SectionType[],
  sectionVariants?: Record<SectionType, string>
): {
  intro: Screen | undefined
  sections: Screen[]
  music: Screen | undefined
  guestbookFab: Screen | undefined
} {
  // guestbook이 FAB variant인지 확인
  const isGuestbookFab = sectionVariants?.guestbook === 'fab'

  // visibleSections가 있으면 해당 섹션만 표시
  if (visibleSections) {
    const visible = screens.filter((s) => visibleSections.includes(s.sectionType))
    const intro = visible.find((s) => s.sectionType === 'intro')
    const sections = visible.filter(
      (s) =>
        s.sectionType !== 'intro' &&
        s.sectionType !== 'music' &&
        !(s.sectionType === 'guestbook' && isGuestbookFab)
    )
    const music = visible.find((s) => s.sectionType === 'music')
    const guestbookFab = isGuestbookFab ? visible.find((s) => s.sectionType === 'guestbook') : undefined
    return { intro, sections, music, guestbookFab }
  }

  // 기본 동작: sectionEnabled 기반
  // 1. intro 항상 첫번째
  const intro = screens.find((s) => s.sectionType === 'intro')

  // 2. 나머지 섹션 순서대로 + 활성화된 것만 (guestbook FAB은 제외)
  const sections = sectionOrder
    .filter((type) => sectionEnabled[type])
    .filter((type) => !(type === 'guestbook' && isGuestbookFab))
    .map((type) => screens.find((s) => s.sectionType === type))
    .filter((s): s is Screen => s !== undefined)

  // 3. music은 FAB로 별도 렌더링
  const music = screens.find((s) => s.sectionType === 'music')

  // 4. guestbook FAB variant는 별도 렌더링
  const guestbookFab =
    isGuestbookFab && sectionEnabled.guestbook
      ? screens.find((s) => s.sectionType === 'guestbook')
      : undefined

  return { intro, sections, music, guestbookFab }
}

// ============================================
// Inner Content Component
// ============================================

interface InvitationContentProps extends InvitationRendererProps {}

function InvitationContent({
  layout,
  userData,
  sectionOrder = DEFAULT_SECTION_ORDER,
  sectionEnabled = DEFAULT_SECTION_ENABLED,
  mode = 'preview',
  selectedNodeId,
  onSelectNode,
  onSectionClick,
  highlightedSection,
  visibleSections,
  sectionVariants,
  onVariantChange,
  showVariantSwitcher = true,
  className,
}: InvitationContentProps) {
  // 섹션 정렬
  const { intro, sections, music, guestbookFab } = React.useMemo(
    () => getSortedSections(layout.screens, sectionOrder, sectionEnabled, visibleSections, sectionVariants),
    [layout.screens, sectionOrder, sectionEnabled, visibleSections, sectionVariants]
  )

  // intro 표시 여부 (visibleSections가 있으면 그 기준, 없으면 sectionEnabled 기준)
  const showIntro = visibleSections
    ? visibleSections.includes('intro') && intro
    : sectionEnabled.intro && intro

  // music 표시 여부
  const showMusic = visibleSections
    ? visibleSections.includes('music') && music
    : sectionEnabled.music && music

  // 편집 모드일 때만 섹션 간 간격 적용
  const sectionGap = mode === 'edit' ? '48px' : '0px'

  return (
    <div
      className={`invitation-renderer ${className ?? ''}`}
      style={{
        minHeight: '100vh',
        paddingBottom: 96, // FAB 버튼 공간 확보
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--typo-body-md-font-family)',
      }}
    >
      {/* Intro Section (항상 첫번째) */}
      {showIntro && intro && (
        <SectionRenderer
          screen={intro}
          userData={userData}
          mode={mode}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
          onSectionClick={onSectionClick}
          isHighlighted={highlightedSection === 'intro'}
          currentVariantId={sectionVariants?.intro}
          onVariantChange={onVariantChange}
          showVariantSwitcher={showVariantSwitcher}
        />
      )}

      {/* Content Sections (순서대로, 편집 모드에서는 간격 적용) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: sectionGap }}>
        {sections.map((screen) => (
          <SectionRenderer
            key={screen.id}
            screen={screen}
            userData={userData}
            mode={mode}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            onSectionClick={onSectionClick}
            isHighlighted={highlightedSection === screen.sectionType}
            currentVariantId={sectionVariants?.[screen.sectionType]}
            onVariantChange={onVariantChange}
            showVariantSwitcher={showVariantSwitcher}
          />
        ))}
      </div>

    </div>
  )
}

// ============================================
// Main Component (with TokenStyleProvider)
// ============================================

export function InvitationRenderer(props: InvitationRendererProps) {
  return (
    <TokenStyleProvider style={props.style}>
      <InvitationContent {...props} />
    </TokenStyleProvider>
  )
}

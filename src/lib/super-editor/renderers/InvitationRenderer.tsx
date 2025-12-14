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
import { TokenStyleProvider, useTokenStyle } from '../context/TokenStyleContext'
import { getSkeleton } from '../skeletons/registry'
import { resolveNode } from '../builder/skeleton-resolver'
import type { IntroEffectType } from '../animations/intro-effects'
import type { CalligraphyConfig } from './SectionRenderer'

// Re-export for convenience
export type { CalligraphyConfig } from './SectionRenderer'

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

  // 인트로 애니메이션 효과
  introEffect?: IntroEffectType

  // 캘리그라피 설정
  calligraphyConfig?: CalligraphyConfig

  className?: string
}

// ============================================
// Helper Functions
// ============================================

/**
 * 누락된 섹션의 Screen을 skeleton에서 동적으로 생성
 */
function createScreenFromSkeleton(
  sectionType: SectionType,
  variantId?: string,
  tokens?: ReturnType<typeof useTokenStyle>['tokens']
): Screen | undefined {
  const skeleton = getSkeleton(sectionType)
  if (!skeleton) {
    console.log(`[InvitationRenderer] No skeleton found for ${sectionType}`)
    return undefined
  }

  const variant = variantId
    ? skeleton.variants.find((v) => v.id === variantId)
    : skeleton.variants.find((v) => v.id === skeleton.defaultVariant)

  if (!variant) {
    console.log(`[InvitationRenderer] No variant found for ${sectionType}:${variantId}`)
    return undefined
  }

  // skeleton 노드를 PrimitiveNode로 변환 (deep clone 후 resolve)
  const clonedStructure = JSON.parse(JSON.stringify(variant.structure))
  const root = tokens ? resolveNode(clonedStructure, tokens) : clonedStructure

  console.log(`[InvitationRenderer] Created screen from skeleton for ${sectionType}:${variant.id}`, root.type)

  // 디버그: envelope 노드가 있는지 확인
  const findEnvelope = (node: typeof root): boolean => {
    if (node.type === 'envelope') return true
    return node.children?.some(findEnvelope) ?? false
  }
  if (sectionType === 'invitation') {
    console.log(`[InvitationRenderer] invitation has envelope?`, findEnvelope(root))
    console.log(`[InvitationRenderer] invitation root structure:`, JSON.stringify(root, null, 2).slice(0, 500))
  }

  return {
    id: `${sectionType}-screen`,
    name: skeleton.name,
    type: sectionType === 'intro' ? 'intro' : 'content',
    sectionType,
    root,
  }
}

/**
 * 섹션 정렬 및 필터링 (누락된 섹션은 skeleton에서 동적 생성)
 */
function getSortedSections(
  screens: Screen[],
  sectionOrder: SectionType[],
  sectionEnabled: Record<SectionType, boolean>,
  visibleSections?: SectionType[],
  sectionVariants?: Record<SectionType, string>,
  tokens?: ReturnType<typeof useTokenStyle>['tokens']
): {
  intro: Screen | undefined
  sections: Screen[]
  music: Screen | undefined
  guestbookFab: Screen | undefined
} {
  // guestbook이 FAB variant인지 확인
  const isGuestbookFab = sectionVariants?.guestbook === 'fab'

  // Screen을 찾거나 skeleton에서 생성하는 헬퍼
  const findOrCreateScreen = (type: SectionType): Screen | undefined => {
    const requestedVariant = sectionVariants?.[type]
    const existing = screens.find((s) => s.sectionType === type)
    const existingVariant = (existing as Screen & { variantId?: string } | undefined)?.variantId

    // variant가 지정되어 있으면 skeleton에서 생성 (일관성 보장)
    if (requestedVariant) {
      // 기존 screen이 있고 variant가 같으면 기존 것 사용
      if (existing && existingVariant === requestedVariant) {
        console.log(`[getSortedSections] Using existing screen for ${type}:${requestedVariant}`)
        return existing
      }
      // variant가 다르거나 없으면 skeleton에서 새로 생성
      console.log(`[getSortedSections] Generating from skeleton for ${type}:${requestedVariant} (existing: ${existingVariant || 'none'})`)
      return createScreenFromSkeleton(type, requestedVariant, tokens)
    }

    // variant 지정 없으면 기존 screen 사용
    if (existing) {
      console.log(`[getSortedSections] Found existing screen for ${type}:`, existing.root?.type)
      return existing
    }

    // layout에 없으면 skeleton에서 동적 생성 (기본 variant)
    console.log(`[getSortedSections] Creating screen for missing section: ${type}`)
    return createScreenFromSkeleton(type, undefined, tokens)
  }

  // 디버그: sectionEnabled 상태 확인
  console.log('[getSortedSections] sectionEnabled:', sectionEnabled)
  console.log('[getSortedSections] sectionOrder:', sectionOrder)
  console.log('[getSortedSections] invitation enabled?', sectionEnabled.invitation)

  // visibleSections가 있으면 해당 섹션만 표시
  if (visibleSections) {
    const visible = visibleSections
      .map(findOrCreateScreen)
      .filter((s): s is Screen => s !== undefined)

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
  const intro = findOrCreateScreen('intro')

  // 2. 나머지 섹션 순서대로 + 활성화된 것만 (guestbook FAB은 제외)
  const sections = sectionOrder
    .filter((type) => sectionEnabled[type])
    .filter((type) => !(type === 'guestbook' && isGuestbookFab))
    .map(findOrCreateScreen)
    .filter((s): s is Screen => s !== undefined)

  // 3. music은 FAB로 별도 렌더링
  const music = findOrCreateScreen('music')

  // 4. guestbook FAB variant는 별도 렌더링
  const guestbookFab =
    isGuestbookFab && sectionEnabled.guestbook
      ? findOrCreateScreen('guestbook')
      : undefined

  return { intro, sections, music, guestbookFab }
}

// ============================================
// Inner Content Component
// ============================================

type InvitationContentProps = InvitationRendererProps

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
  introEffect,
  calligraphyConfig,
  className,
}: InvitationContentProps) {
  // 토큰 컨텍스트에서 tokens 가져오기
  const { tokens } = useTokenStyle()

  // 섹션 정렬 (누락된 섹션은 skeleton에서 동적 생성)
  const { intro, sections } = React.useMemo(
    () => getSortedSections(layout.screens, sectionOrder, sectionEnabled, visibleSections, sectionVariants, tokens),
    [layout.screens, sectionOrder, sectionEnabled, visibleSections, sectionVariants, tokens]
  )

  // intro 표시 여부 (visibleSections가 있으면 그 기준, 없으면 sectionEnabled 기준)
  const showIntro = visibleSections
    ? visibleSections.includes('intro') && intro
    : sectionEnabled.intro && intro

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
          introEffect={introEffect}
          calligraphyConfig={calligraphyConfig}
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

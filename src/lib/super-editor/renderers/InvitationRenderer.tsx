'use client'

/**
 * InvitationRenderer - 전체 청첩장 렌더링 오케스트레이터
 * 섹션 순서/활성화 관리, 스크롤 스택 구성
 */

import React from 'react'
import type { LayoutSchema, Screen } from '../schema/layout'
import type { StyleSchema } from '../schema/style'
import type { UserData } from '../schema/user-data'
import { DEFAULT_SECTION_ORDER, DEFAULT_SECTION_ENABLED, type SectionType } from '../schema/section-types'
import { SectionRenderer } from './SectionRenderer'
import { MusicPlayer } from './MusicPlayer'

interface InvitationRendererProps {
  layout: LayoutSchema
  style: StyleSchema
  userData: UserData
  sectionOrder?: SectionType[]
  sectionEnabled?: Record<SectionType, boolean>
  mode?: 'preview' | 'edit' | 'build'
  selectedNodeId?: string
  onSelectNode?: (id: string) => void
  className?: string
}

/**
 * 섹션 정렬 및 필터링
 */
function getSortedSections(
  screens: Screen[],
  sectionOrder: SectionType[],
  sectionEnabled: Record<SectionType, boolean>
): { intro: Screen | undefined; sections: Screen[]; music: Screen | undefined } {
  // 1. intro 항상 첫번째
  const intro = screens.find(s => s.sectionType === 'intro')

  // 2. 나머지 섹션 순서대로 + 활성화된 것만
  const sections = sectionOrder
    .filter(type => sectionEnabled[type])
    .map(type => screens.find(s => s.sectionType === type))
    .filter((s): s is Screen => s !== undefined)

  // 3. music은 FAB로 별도 렌더링
  const music = screens.find(s => s.sectionType === 'music')

  return { intro, sections, music }
}

/**
 * StyleSchema에서 CSS 변수 추출
 */
function getStyleVariables(style: StyleSchema): React.CSSProperties {
  const { theme } = style

  return {
    // Colors
    '--color-primary': theme.colors?.primary?.[500] ?? '#e11d48',
    '--color-neutral': theme.colors?.neutral?.[500] ?? '#6b7280',
    '--color-background': theme.colors?.background?.default ?? '#ffffff',
    '--color-text': theme.colors?.text?.primary ?? '#1f2937',

    // Typography
    '--font-heading': theme.typography?.fonts?.heading?.family ?? 'inherit',
    '--font-body': theme.typography?.fonts?.body?.family ?? 'inherit',

    // Spacing
    '--spacing-unit': `${theme.spacing?.unit ?? 4}px`,

    // Border radius
    '--radius-sm': theme.borders?.radius?.sm ?? '4px',
    '--radius-md': theme.borders?.radius?.md ?? '8px',
    '--radius-lg': theme.borders?.radius?.lg ?? '12px',

    // Animation
    '--animation-duration': `${theme.animation?.duration?.normal ?? 300}ms`,
    '--animation-easing': theme.animation?.easing?.default ?? 'ease',
  } as React.CSSProperties
}

export function InvitationRenderer({
  layout,
  style,
  userData,
  sectionOrder = DEFAULT_SECTION_ORDER,
  sectionEnabled = DEFAULT_SECTION_ENABLED,
  mode = 'preview',
  selectedNodeId,
  onSelectNode,
  className,
}: InvitationRendererProps) {
  // 섹션 정렬
  const { intro, sections, music } = React.useMemo(
    () => getSortedSections(layout.screens, sectionOrder, sectionEnabled),
    [layout.screens, sectionOrder, sectionEnabled]
  )

  // 스타일 변수
  const styleVariables = React.useMemo(() => getStyleVariables(style), [style])

  // BGM 활성화 여부
  const isMusicEnabled = sectionEnabled.music && music

  return (
    <div
      className={`invitation-renderer ${className ?? ''}`}
      style={{
        ...styleVariables,
        minHeight: '100vh',
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Intro Section (항상 첫번째) */}
      {intro && sectionEnabled.intro && (
        <SectionRenderer
          screen={intro}
          userData={userData}
          mode={mode}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
        />
      )}

      {/* Content Sections (순서대로) */}
      {sections.map(screen => (
        <SectionRenderer
          key={screen.id}
          screen={screen}
          userData={userData}
          mode={mode}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
        />
      ))}

      {/* Music FAB (플로팅) */}
      {isMusicEnabled && (
        <MusicPlayer
          screen={music}
          userData={userData}
          mode={mode}
        />
      )}
    </div>
  )
}

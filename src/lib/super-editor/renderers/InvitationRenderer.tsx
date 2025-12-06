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
import { resolveTokens } from '../tokens/resolver'
import type { SemanticDesignTokens, TypoToken } from '../tokens/schema'

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
 * camelCase를 kebab-case로 변환
 */
function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * 타이포그래피 토큰을 CSS Variables 객체로 변환
 */
function generateTypoVariables(prefix: string, typo: TypoToken): Record<string, string> {
  const baseVar = `--typo-${toKebabCase(prefix)}`
  const vars: Record<string, string> = {}

  vars[`${baseVar}-font-family`] = typo.fontFamily
  vars[`${baseVar}-font-size`] = typo.fontSize
  vars[`${baseVar}-font-weight`] = String(typo.fontWeight)
  vars[`${baseVar}-line-height`] = String(typo.lineHeight)

  if (typo.letterSpacing) {
    vars[`${baseVar}-letter-spacing`] = typo.letterSpacing
  }

  return vars
}

/**
 * SemanticDesignTokens를 CSS Variables 객체로 변환
 */
function tokensToCssVariables(tokens: SemanticDesignTokens): Record<string, string> {
  const vars: Record<string, string> = {}

  // Colors
  vars['--color-brand'] = tokens.colors.brand
  vars['--color-accent'] = tokens.colors.accent
  vars['--color-background'] = tokens.colors.background
  vars['--color-surface'] = tokens.colors.surface
  vars['--color-text-primary'] = tokens.colors.text.primary
  vars['--color-text-secondary'] = tokens.colors.text.secondary
  vars['--color-text-muted'] = tokens.colors.text.muted
  vars['--color-text-on-brand'] = tokens.colors.text.onBrand
  vars['--color-border'] = tokens.colors.border
  vars['--color-divider'] = tokens.colors.divider

  // Typography
  Object.assign(vars, generateTypoVariables('display-lg', tokens.typography.displayLg))
  Object.assign(vars, generateTypoVariables('display-md', tokens.typography.displayMd))
  Object.assign(vars, generateTypoVariables('heading-lg', tokens.typography.headingLg))
  Object.assign(vars, generateTypoVariables('heading-md', tokens.typography.headingMd))
  Object.assign(vars, generateTypoVariables('heading-sm', tokens.typography.headingSm))
  Object.assign(vars, generateTypoVariables('body-lg', tokens.typography.bodyLg))
  Object.assign(vars, generateTypoVariables('body-md', tokens.typography.bodyMd))
  Object.assign(vars, generateTypoVariables('body-sm', tokens.typography.bodySm))
  Object.assign(vars, generateTypoVariables('caption', tokens.typography.caption))

  // Spacing
  vars['--spacing-xs'] = tokens.spacing.xs
  vars['--spacing-sm'] = tokens.spacing.sm
  vars['--spacing-md'] = tokens.spacing.md
  vars['--spacing-lg'] = tokens.spacing.lg
  vars['--spacing-xl'] = tokens.spacing.xl
  vars['--spacing-xxl'] = tokens.spacing.xxl
  vars['--spacing-section'] = tokens.spacing.section
  vars['--spacing-component'] = tokens.spacing.component

  // Borders
  vars['--radius-sm'] = tokens.borders.radiusSm
  vars['--radius-md'] = tokens.borders.radiusMd
  vars['--radius-lg'] = tokens.borders.radiusLg
  vars['--radius-full'] = tokens.borders.radiusFull

  // Shadows
  vars['--shadow-sm'] = tokens.shadows.sm
  vars['--shadow-md'] = tokens.shadows.md
  vars['--shadow-lg'] = tokens.shadows.lg

  // Animation
  vars['--duration-fast'] = `${tokens.animation.durationFast}ms`
  vars['--duration-normal'] = `${tokens.animation.durationNormal}ms`
  vars['--duration-slow'] = `${tokens.animation.durationSlow}ms`
  vars['--easing-default'] = tokens.animation.easing
  vars['--stagger-delay'] = `${tokens.animation.staggerDelay}ms`

  return vars
}

/**
 * StyleSchema에서 CSS 변수 추출 (토큰 시스템 호환)
 */
function getStyleVariables(style: StyleSchema): React.CSSProperties {
  // StyleSchema를 SemanticDesignTokens로 변환
  const tokens = resolveTokens(style)
  // 토큰을 CSS 변수로 변환
  const cssVars = tokensToCssVariables(tokens)

  return cssVars as unknown as React.CSSProperties
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
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--typo-body-md-font-family)',
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

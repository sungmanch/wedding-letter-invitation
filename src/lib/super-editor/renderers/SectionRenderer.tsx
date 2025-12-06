'use client'

/**
 * SectionRenderer - 단일 섹션(Screen) 렌더링
 * PrimitiveNode 트리를 React 컴포넌트로 변환
 */

import React from 'react'
import type { Screen } from '../schema/layout'
import type { UserData } from '../schema/user-data'
import type { SectionType } from '../skeletons/types'
import { createNodeRenderer, renderPrimitiveNode } from '../primitives'
import type { RenderContext } from '../primitives/types'
import { VariantSwitcher } from '../components/VariantSwitcher'

interface SectionRendererProps {
  screen: Screen
  userData: UserData
  mode?: 'preview' | 'edit' | 'build'
  selectedNodeId?: string
  onSelectNode?: (id: string) => void
  className?: string
  // Variant switcher props (dev mode only)
  currentVariantId?: string
  onVariantChange?: (sectionType: SectionType, variantId: string) => void
}

export function SectionRenderer({
  screen,
  userData,
  mode = 'preview',
  selectedNodeId,
  onSelectNode,
  className,
  currentVariantId,
  onVariantChange,
}: SectionRendererProps) {
  // 렌더 컨텍스트 생성 - userData가 변경될 때마다 새로 생성
  const context: RenderContext = createNodeRenderer({
    data: userData.data as Record<string, unknown>,
    mode,
    selectedNodeId,
    onSelectNode,
  })

  // Screen의 root 노드 렌더링
  const rendered = renderPrimitiveNode(screen.root, context)

  // 개발 모드에서 variant switcher 표시 여부
  const showVariantSwitcher =
    process.env.NODE_ENV === 'development' &&
    mode === 'edit' &&
    currentVariantId &&
    onVariantChange

  return (
    <section
      id={`section-${screen.sectionType}`}
      data-section-type={screen.sectionType}
      data-screen-id={screen.id}
      className={`relative ${className ?? ''}`}
    >
      {showVariantSwitcher && (
        <VariantSwitcher
          sectionType={screen.sectionType}
          currentVariantId={currentVariantId}
          onVariantChange={(variantId) => onVariantChange(screen.sectionType, variantId)}
        />
      )}
      {rendered}
    </section>
  )
}

'use client'

/**
 * SectionRenderer - 단일 섹션(Screen) 렌더링
 * PrimitiveNode 트리를 React 컴포넌트로 변환
 */

import React from 'react'
import type { Screen } from '../schema/layout'
import type { UserData } from '../schema/user-data'
import { createNodeRenderer, renderPrimitiveNode } from '../primitives'
import type { RenderContext } from '../primitives/types'

interface SectionRendererProps {
  screen: Screen
  userData: UserData
  mode?: 'preview' | 'edit' | 'build'
  selectedNodeId?: string
  onSelectNode?: (id: string) => void
  className?: string
}

export function SectionRenderer({
  screen,
  userData,
  mode = 'preview',
  selectedNodeId,
  onSelectNode,
  className,
}: SectionRendererProps) {
  // 렌더 컨텍스트 생성
  const context = React.useMemo<RenderContext>(() => {
    const baseContext = {
      data: userData.data as Record<string, unknown>,
      mode,
      selectedNodeId,
      onSelectNode,
    }
    return createNodeRenderer(baseContext)
  }, [userData.data, mode, selectedNodeId, onSelectNode])

  // Screen의 root 노드 렌더링
  const rendered = React.useMemo(() => {
    return renderPrimitiveNode(screen.root, context)
  }, [screen.root, context])

  return (
    <section
      id={`section-${screen.sectionType}`}
      data-section-type={screen.sectionType}
      data-screen-id={screen.id}
      className={className}
    >
      {rendered}
    </section>
  )
}

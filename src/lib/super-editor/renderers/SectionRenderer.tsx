'use client'

/**
 * SectionRenderer - 단일 섹션(Screen) 렌더링
 * PrimitiveNode 트리를 React 컴포넌트로 변환
 */

import React, { useState, useCallback, useMemo } from 'react'
import type { Screen } from '../schema/layout'
import type { UserData } from '../schema/user-data'
import type { SectionType } from '../skeletons/types'
import { createNodeRenderer, renderPrimitiveNode } from '../primitives'
import type { RenderContext } from '../primitives/types'
import { VariantSwitcher } from '../components/VariantSwitcher'
import { useTokenStyle } from '../context/TokenStyleContext'

interface SectionRendererProps {
  screen: Screen
  userData: UserData
  mode?: 'preview' | 'edit' | 'build'
  selectedNodeId?: string
  onSelectNode?: (id: string) => void
  // 섹션 클릭 핸들러 (에디터 연동)
  onSectionClick?: (sectionType: SectionType) => void
  // 하이라이트 여부 (에디터에서 펼쳐진 섹션)
  isHighlighted?: boolean
  className?: string
  // Variant switcher props
  currentVariantId?: string
  onVariantChange?: (sectionType: SectionType, variantId: string) => void
  // 섹션 내부 VariantSwitcher 표시 여부 (false면 외부 패널 사용)
  showVariantSwitcher?: boolean
}

export function SectionRenderer({
  screen,
  userData,
  mode = 'preview',
  selectedNodeId,
  onSelectNode,
  onSectionClick,
  isHighlighted = false,
  className,
  currentVariantId,
  onVariantChange,
  showVariantSwitcher: showVariantSwitcherProp = true,
}: SectionRendererProps) {
  // 토큰 스타일 컨텍스트에서 resolveTokenRef 가져오기
  const { resolveTokenRef, tokens } = useTokenStyle()

  // 모달 상태 관리
  const [openedModals, setOpenedModals] = useState<Set<string>>(new Set())

  const openModal = useCallback((modalId: string) => {
    setOpenedModals((prev) => new Set(prev).add(modalId))
  }, [])

  const closeModal = useCallback((modalId: string) => {
    setOpenedModals((prev) => {
      const next = new Set(prev)
      next.delete(modalId)
      return next
    })
  }, [])

  // 렌더 컨텍스트 생성 - userData가 변경될 때마다 새로 생성
  const context: RenderContext = useMemo(
    () =>
      createNodeRenderer({
        data: userData.data as Record<string, unknown>,
        mode,
        selectedNodeId,
        onSelectNode,
        resolveTokenRef,
        tokens,
        // 모달 시스템
        openedModals,
        openModal,
        closeModal,
      }),
    [
      userData.data,
      mode,
      selectedNodeId,
      onSelectNode,
      resolveTokenRef,
      tokens,
      openedModals,
      openModal,
      closeModal,
    ]
  )

  // Screen의 root 노드 렌더링
  const rendered = renderPrimitiveNode(screen.root, context)

  // variant switcher 표시 여부
  // - showVariantSwitcherProp이 true이고
  // - 편집 모드이고
  // - currentVariantId와 onVariantChange가 있을 때
  const shouldShowSwitcher =
    showVariantSwitcherProp && mode === 'edit' && currentVariantId && onVariantChange

  // 클릭 핸들러 (편집 모드에서만)
  const handleClick = (e: React.MouseEvent) => {
    if (mode === 'edit' && onSectionClick) {
      e.stopPropagation()
      onSectionClick(screen.sectionType)
    }
  }

  return (
    <section
      id={`section-${screen.sectionType}`}
      data-section-type={screen.sectionType}
      data-screen-id={screen.id}
      className={`relative ${className ?? ''}`}
      onClick={handleClick}
      style={{
        cursor: mode === 'edit' && onSectionClick ? 'pointer' : undefined,
        outline: isHighlighted ? '2px solid #C9A962' : undefined,
        outlineOffset: isHighlighted ? '-2px' : undefined,
      }}
    >
      {shouldShowSwitcher && (
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

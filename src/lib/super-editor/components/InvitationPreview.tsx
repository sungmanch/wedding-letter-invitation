'use client'

/**
 * InvitationPreview - 청첩장 프리뷰 통합 컴포넌트
 *
 * 사용처:
 * - /se/create - withFrame=true
 * - /se/[id]/edit - withFrame=true
 * - /se/[id]/preview - withFrame=false
 * - /se/[id] - withFrame=false
 */

import React, { useMemo, useState, useCallback } from 'react'
import type { LayoutSchema } from '../schema/layout'
import type { StyleSchema } from '../schema/style'
import type { UserData } from '../schema/user-data'
import type { SectionType } from '../schema/section-types'
import { InvitationRenderer } from '../renderers'
import { collectAllIntroStyles } from '../presets/legacy/intro-builders'
import { VariantControlPanel } from './VariantControlPanel'

// ============================================
// Types
// ============================================

interface InvitationPreviewProps {
  layout: LayoutSchema
  style: StyleSchema
  userData: UserData
  mode?: 'preview' | 'edit' | 'build'

  // 섹션 제어
  sectionOrder?: SectionType[]
  sectionEnabled?: Record<SectionType, boolean>
  visibleSections?: SectionType[]

  // 편집 모드
  selectedNodeId?: string
  onSelectNode?: (id: string) => void

  // Variant switcher (dev mode only)
  sectionVariants?: Record<SectionType, string>
  onVariantChange?: (sectionType: SectionType, variantId: string) => void

  // PhoneFrame 옵션
  withFrame?: boolean
  frameWidth?: number
  frameHeight?: number

  className?: string
}

// ============================================
// Phone Frame Component
// ============================================

const DEFAULT_FRAME_WIDTH = 375
const DEFAULT_FRAME_HEIGHT = 667

interface PhoneFrameProps {
  width?: number
  height?: number
  children: React.ReactNode
}

function PhoneFrame({
  width = DEFAULT_FRAME_WIDTH,
  height = DEFAULT_FRAME_HEIGHT,
  children,
}: PhoneFrameProps) {
  const allStyles = useMemo(() => collectAllIntroStyles(), [])

  return (
    <div className="relative">
      {/* 인트로 애니메이션 스타일 */}
      <style dangerouslySetInnerHTML={{ __html: allStyles }} />
      {/* Phone bezel */}
      <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-gray-900 rounded-b-2xl z-10" />
        {/* Screen */}
        <div
          className="bg-white rounded-[2rem] overflow-hidden overflow-y-auto mobile-scrollbar"
          style={
            {
              width,
              height,
              '--preview-screen-height': `${height}px`,
            } as React.CSSProperties
          }
        >
          {children}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Main Component
// ============================================

export function InvitationPreview({
  layout,
  style,
  userData,
  mode = 'preview',
  sectionOrder,
  sectionEnabled,
  visibleSections,
  selectedNodeId,
  onSelectNode,
  sectionVariants,
  onVariantChange,
  withFrame = false,
  frameWidth,
  frameHeight,
  className,
}: InvitationPreviewProps) {
  // 활성 섹션 추적 (스크롤에 따라 변경)
  const [activeSection, setActiveSection] = useState<SectionType | null>(null)

  const handleActiveSectionChange = useCallback((sectionType: SectionType | null) => {
    setActiveSection(sectionType)
  }, [])

  const renderer = (
    <InvitationRenderer
      layout={layout}
      style={style}
      userData={userData}
      mode={mode}
      sectionOrder={sectionOrder}
      sectionEnabled={sectionEnabled}
      visibleSections={visibleSections}
      selectedNodeId={selectedNodeId}
      onSelectNode={onSelectNode}
      sectionVariants={sectionVariants}
      onVariantChange={onVariantChange}
      onActiveSectionChange={handleActiveSectionChange}
      showVariantSwitcher={false}
      className={className}
    />
  )

  if (withFrame) {
    // 편집 모드에서는 PhoneFrame 옆에 VariantControlPanel 표시
    const showVariantPanel = mode === 'edit' && onVariantChange && sectionVariants

    return (
      <div className="relative flex items-start gap-4">
        {/* PhoneFrame */}
        <PhoneFrame width={frameWidth} height={frameHeight}>
          {renderer}
        </PhoneFrame>

        {/* 오른쪽 Variant Control Panel */}
        {showVariantPanel && (
          <VariantControlPanel
            activeSection={activeSection}
            sectionVariants={sectionVariants}
            onVariantChange={onVariantChange}
            layout={layout}
            className="sticky top-8"
          />
        )}
      </div>
    )
  }

  return renderer
}

// Re-export PhoneFrame for standalone use
export { PhoneFrame }

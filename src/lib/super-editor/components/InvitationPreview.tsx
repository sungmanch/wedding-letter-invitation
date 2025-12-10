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

import React, { useMemo, useState, useCallback, useRef } from 'react'
import type { LayoutSchema } from '../schema/layout'
import type { StyleSchema } from '../schema/style'
import type { UserData } from '../schema/user-data'
import type { SectionType } from '../schema/section-types'
import { InvitationRenderer } from '../renderers'
import { GuestbookFab } from '../renderers/GuestbookFab'
import { MusicPlayer } from '../renderers/MusicPlayer'
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

  // 섹션 클릭 핸들러 (에디터 연동)
  onSectionClick?: (sectionType: SectionType) => void
  // 하이라이트할 섹션 (에디터에서 펼쳐진 섹션)
  highlightedSection?: SectionType | null

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
  scrollRef?: React.RefObject<HTMLDivElement | null>
  onScroll?: () => void
  /** 스크롤 컨테이너 위에 오버레이로 표시할 요소 (FAB 등) */
  overlay?: React.ReactNode
}

function PhoneFrame({
  width = DEFAULT_FRAME_WIDTH,
  height = DEFAULT_FRAME_HEIGHT,
  children,
  scrollRef,
  onScroll,
  overlay,
}: PhoneFrameProps) {
  const allStyles = useMemo(() => collectAllIntroStyles(), [])

  return (
    <div className="relative">
      {/* 인트로 애니메이션 스타일 */}
      <style dangerouslySetInnerHTML={{ __html: allStyles }} />
      {/* Phone bezel */}
      <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-gray-900 rounded-b-2xl z-100" />
        {/* Screen container - relative로 오버레이 기준점 */}
        <div className="relative" style={{ width, height }}>
          {/* Scrollable content */}
          <div
            ref={scrollRef}
            onScroll={onScroll}
            data-scroll-container="true"
            className="absolute inset-0 bg-white rounded-[2rem] overflow-x-hidden overflow-y-auto scrollbar-hide"
            style={{ '--preview-screen-height': `${height}px` } as React.CSSProperties}
          >
            {children}
          </div>
          {/* Overlay (FAB 등) - 스크롤 컨테이너 위에 고정 */}
          {overlay}
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
  onSectionClick,
  highlightedSection,
  sectionVariants,
  onVariantChange,
  withFrame = false,
  frameWidth,
  frameHeight,
  className,
}: InvitationPreviewProps) {
  // 활성 섹션 추적 (스크롤에 따라 변경)
  const [activeSection, setActiveSection] = useState<SectionType | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // PhoneFrame 스크롤 시 중앙에 위치한 섹션 감지
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    // 스크롤이 끝에 도달했는지 확인 (5px 여유)
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 5

    // 모든 섹션 요소 가져오기
    const sectionElements = container.querySelectorAll('[data-section-type]')
    if (sectionElements.length === 0) return

    // 스크롤이 끝에 도달하면 마지막 섹션 활성화
    if (isAtBottom) {
      const lastSection = sectionElements[sectionElements.length - 1]
      const sectionType = lastSection.getAttribute('data-section-type') as SectionType
      if (sectionType) {
        setActiveSection(sectionType)
        return
      }
    }

    // 일반적인 경우: 중앙에 가장 가까운 섹션 찾기
    const containerRect = container.getBoundingClientRect()
    const containerCenter = containerRect.top + containerRect.height / 2

    let closestSection: SectionType | null = null
    let closestDistance = Infinity

    sectionElements.forEach((el) => {
      const rect = el.getBoundingClientRect()
      const sectionCenter = rect.top + rect.height / 2
      const distance = Math.abs(sectionCenter - containerCenter)

      if (distance < closestDistance) {
        closestDistance = distance
        closestSection = el.getAttribute('data-section-type') as SectionType
      }
    })

    if (closestSection) {
      setActiveSection(closestSection)
    }
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
      onSectionClick={onSectionClick}
      highlightedSection={highlightedSection}
      sectionVariants={sectionVariants}
      onVariantChange={onVariantChange}
      showVariantSwitcher={false}
      className={className}
    />
  )

  if (withFrame) {
    // 편집 모드에서는 PhoneFrame 옆에 VariantControlPanel 표시
    const showVariantPanel = mode === 'edit' && onVariantChange && sectionVariants
    const frameH = frameHeight ?? DEFAULT_FRAME_HEIGHT

    // Guestbook FAB 표시 여부 (fab variant이고 활성화된 경우)
    const showGuestbookFab =
      sectionVariants?.guestbook === 'fab' && sectionEnabled?.guestbook !== false

    // Music FAB 표시 여부
    const showMusicFab = sectionEnabled?.music !== false

    // Music screen 찾기
    const musicScreen = layout.screens.find((s) => s.sectionType === 'music')

    // PhoneFrame용 오버레이 (FAB 등)
    const frameOverlay = (
      <>
        {/* Music FAB - 우상단 */}
        {showMusicFab && musicScreen && (
          <MusicPlayer screen={musicScreen} userData={userData} mode={mode} />
        )}
        {/* Guestbook FAB - 하단 중앙 */}
        {showGuestbookFab && (
          <GuestbookFab
            onClick={() => {
              // TODO: 방명록 모달 열기
              console.log('Open guestbook modal')
            }}
          />
        )}
      </>
    )

    return (
      <div className="relative flex items-start gap-4">
        {/* PhoneFrame */}
        <PhoneFrame
          width={frameWidth}
          height={frameHeight}
          scrollRef={scrollContainerRef}
          onScroll={handleScroll}
          overlay={frameOverlay}
        >
          {renderer}
        </PhoneFrame>

        {/* 오른쪽 Variant Control Panel - PhoneFrame과 동일한 높이로 고정 */}
        {showVariantPanel && (
          <div className="flex-shrink-0" style={{ height: frameH + 16 /* bezel padding */ }}>
            <VariantControlPanel
              activeSection={activeSection}
              sectionVariants={sectionVariants}
              onVariantChange={onVariantChange}
              layout={layout}
              sectionOrder={sectionOrder}
              sectionEnabled={sectionEnabled}
              className="h-full overflow-y-auto"
            />
          </div>
        )}
      </div>
    )
  }

  return renderer
}

// Re-export PhoneFrame for standalone use
export { PhoneFrame }

'use client'

import { useState, useEffect } from 'react'
import { InvitationPreview, GuestbookModal } from '@/lib/super-editor/components'
import { GuestbookFab } from '@/lib/super-editor/renderers/GuestbookFab'
import type { LayoutSchema } from '@/lib/super-editor/schema/layout'
import type { StyleSchema } from '@/lib/super-editor/schema/style'
import type { UserData } from '@/lib/super-editor/schema/user-data'
import type { SectionType } from '@/lib/super-editor/schema/section-types'

// 스크롤 시작/끝 위치 (px)
const SCROLL_START = 200
const SCROLL_END = 500

interface ViewerClientProps {
  invitationId: string
  layout: LayoutSchema
  style: StyleSchema
  userData: UserData
  sectionOrder: SectionType[]
  sectionEnabled: Record<SectionType, boolean>
}

export function ViewerClient({
  invitationId,
  layout,
  style,
  userData,
  sectionOrder,
  sectionEnabled,
}: ViewerClientProps) {
  const [isGuestbookModalOpen, setIsGuestbookModalOpen] = useState(false)
  const [fabOpacity, setFabOpacity] = useState(0)

  // 스크롤에 따른 FAB opacity 계산
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      if (scrollY <= SCROLL_START) {
        setFabOpacity(0)
      } else if (scrollY >= SCROLL_END) {
        setFabOpacity(1)
      } else {
        setFabOpacity((scrollY - SCROLL_START) / (SCROLL_END - SCROLL_START))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 초기값 설정

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Viewer에서는 guestbook 섹션 비활성화 (별도 FAB 사용)
  const viewerSectionEnabled = {
    ...sectionEnabled,
    guestbook: false,
  }

  return (
    <>
      <InvitationPreview
        layout={layout}
        style={style}
        userData={userData}
        sectionOrder={sectionOrder}
        sectionEnabled={viewerSectionEnabled}
        mode="preview"
      />

      {/* 축하하기 FAB - 모달이 열리면 숨김, 스크롤에 따라 페이드인 */}
      {!isGuestbookModalOpen && (
        <GuestbookFab
          onClick={() => setIsGuestbookModalOpen(true)}
          mode="build"
          opacity={fabOpacity}
        />
      )}

      {/* 축하하기 모달 */}
      <GuestbookModal
        isOpen={isGuestbookModalOpen}
        onClose={() => setIsGuestbookModalOpen(false)}
        invitationId={invitationId}
      />
    </>
  )
}

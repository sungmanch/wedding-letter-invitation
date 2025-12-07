'use client'

import { useState } from 'react'
import { InvitationPreview, GuestbookModal } from '@/lib/super-editor/components'
import { GuestbookFab } from '@/lib/super-editor/renderers/GuestbookFab'
import type { LayoutSchema } from '@/lib/super-editor/schema/layout'
import type { StyleSchema } from '@/lib/super-editor/schema/style'
import type { UserData } from '@/lib/super-editor/schema/user-data'
import type { SectionType } from '@/lib/super-editor/schema/section-types'

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

      {/* 축하하기 FAB */}
      <GuestbookFab onClick={() => setIsGuestbookModalOpen(true)} mode="build" />

      {/* 축하하기 모달 */}
      <GuestbookModal
        isOpen={isGuestbookModalOpen}
        onClose={() => setIsGuestbookModalOpen(false)}
        invitationId={invitationId}
      />
    </>
  )
}

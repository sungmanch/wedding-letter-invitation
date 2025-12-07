'use client'

import { useState } from 'react'
import {
  InvitationPreview,
  ShareFab,
  ShareModal,
  GuestbookFab,
  GuestbookModal,
} from '@/lib/super-editor/components'
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
  shareInfo: {
    title: string
    description: string
    imageUrl?: string
  }
}

export function ViewerClient({
  invitationId,
  layout,
  style,
  userData,
  sectionOrder,
  sectionEnabled,
  shareInfo,
}: ViewerClientProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isGuestbookModalOpen, setIsGuestbookModalOpen] = useState(false)

  return (
    <>
      <InvitationPreview
        layout={layout}
        style={style}
        userData={userData}
        sectionOrder={sectionOrder}
        sectionEnabled={sectionEnabled}
        mode="preview"
      />

      {/* 축하하기 FAB */}
      <GuestbookFab onClick={() => setIsGuestbookModalOpen(true)} />

      {/* 공유 FAB */}
      <ShareFab onClick={() => setIsShareModalOpen(true)} />

      {/* 축하하기 모달 */}
      <GuestbookModal
        isOpen={isGuestbookModalOpen}
        onClose={() => setIsGuestbookModalOpen(false)}
        invitationId={invitationId}
      />

      {/* 공유 모달 */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        invitationId={invitationId}
        title={shareInfo.title}
        description={shareInfo.description}
        imageUrl={shareInfo.imageUrl}
      />
    </>
  )
}

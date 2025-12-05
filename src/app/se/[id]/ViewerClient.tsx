'use client'

import { useState } from 'react'
import { InvitationRenderer } from '@/lib/super-editor/renderers'
import { ShareFab, ShareModal } from '@/lib/super-editor/components'
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

  return (
    <>
      <InvitationRenderer
        layout={layout}
        style={style}
        userData={userData}
        sectionOrder={sectionOrder}
        sectionEnabled={sectionEnabled}
        mode="preview"
      />

      {/* 공유 FAB */}
      <ShareFab onClick={() => setIsShareModalOpen(true)} />

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

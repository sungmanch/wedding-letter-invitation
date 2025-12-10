'use client'

import { useState, useCallback } from 'react'
import { InvitationPreview } from '@/lib/super-editor/components'
import type { LayoutSchema } from '@/lib/super-editor/schema/layout'
import type { StyleSchema } from '@/lib/super-editor/schema/style'
import type { UserData } from '@/lib/super-editor/schema/user-data'
import type { SectionType } from '@/lib/super-editor/schema/section-types'

interface DashboardClientProps {
  layout: LayoutSchema
  style: StyleSchema
  userData: UserData
}

interface ShareLinkCardProps {
  invitationId: string
}

// 인트로만 활성화된 섹션 설정
const INTRO_ONLY_ENABLED: Record<SectionType, boolean> = {
  intro: true,
  greeting: false,
  contact: false,
  venue: false,
  date: false,
  gallery: false,
  parents: false,
  accounts: false,
  guestbook: false,
  music: false,
  photobooth: false,
  invitation: false,
}

export function DashboardClient({ layout, style, userData }: DashboardClientProps) {
  return (
    <div className="flex justify-center">
      {/* 아이폰 프레임 */}
      <div className="relative w-[280px] h-[560px] bg-black rounded-[40px] p-3 shadow-xl">
        {/* 노치 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-black rounded-b-2xl z-10" />

        {/* 스크린 */}
        <div className="w-full h-full bg-white rounded-[32px] overflow-hidden">
          <div className="w-full h-full overflow-y-auto">
            <InvitationPreview
              layout={layout}
              style={style}
              userData={userData}
              sectionOrder={[]}
              sectionEnabled={INTRO_ONLY_ENABLED}
              mode="preview"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ShareLinkCard({ invitationId }: ShareLinkCardProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/se/${invitationId}`
    : `https://maisondeletter.com/se/${invitationId}`

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [shareUrl])

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h3 className="font-semibold text-gray-900 mb-3">공유 링크</h3>
      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={shareUrl}
          className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {copied ? '복사됨!' : '복사'}
        </button>
      </div>
    </div>
  )
}

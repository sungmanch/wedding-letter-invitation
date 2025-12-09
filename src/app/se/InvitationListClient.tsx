'use client'

import Link from 'next/link'
import { InvitationPreview } from '@/lib/super-editor/components'
import type { LayoutSchema } from '@/lib/super-editor/schema/layout'
import type { StyleSchema } from '@/lib/super-editor/schema/style'
import type { UserData } from '@/lib/super-editor/schema/user-data'
import type { SectionType } from '@/lib/super-editor/schema/section-types'

interface InvitationItem {
  id: string
  isPaid: boolean
  status: string
  createdAt: Date
  updatedAt: Date
  userData: UserData
  layout: LayoutSchema | undefined
  style: StyleSchema | undefined
  templateName: string | undefined
}

interface InvitationListClientProps {
  invitations: InvitationItem[]
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
}

export function InvitationListClient({ invitations }: InvitationListClientProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {invitations.map((invitation) => (
        <InvitationCard key={invitation.id} invitation={invitation} />
      ))}
    </div>
  )
}

function InvitationCard({ invitation }: { invitation: InvitationItem }) {
  const { id, isPaid, createdAt, layout, style, userData, templateName } = invitation

  // 결제 완료 시 dashboard, 아니면 edit으로 이동
  const href = isPaid ? `/se/${id}/dashboard` : `/se/${id}/edit`

  // 날짜 포맷
  const formattedDate = createdAt.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-rose-200 hover:shadow-md transition-all">
        {/* 인트로 프리뷰 */}
        <div className="aspect-[9/16] bg-gray-100 overflow-hidden">
          {layout && style ? (
            <div className="w-full h-full transform scale-100 origin-top-left">
              <InvitationPreview
                layout={layout}
                style={style}
                userData={userData}
                sectionOrder={[]}
                sectionEnabled={INTRO_ONLY_ENABLED}
                mode="preview"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* 카드 정보 */}
        <div className="p-3">
          {/* 상태 배지 */}
          <div className="flex items-center gap-2 mb-2">
            {isPaid ? (
              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                공개중
              </span>
            ) : (
              <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                제작중
              </span>
            )}
          </div>

          {/* 템플릿 이름 */}
          <p className="text-sm font-medium text-gray-900 truncate">
            {templateName || '청첩장'}
          </p>

          {/* 생성일 */}
          <p className="text-xs text-gray-500 mt-1">
            {formattedDate}
          </p>
        </div>
      </div>
    </Link>
  )
}

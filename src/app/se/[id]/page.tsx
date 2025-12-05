'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getPublishedInvitation } from '@/lib/super-editor/actions'
import { InvitationRenderer } from '@/lib/super-editor/renderers'
import { DEFAULT_SECTION_ORDER, DEFAULT_SECTION_ENABLED } from '@/lib/super-editor/schema/section-types'
import type { SuperEditorInvitation, SuperEditorTemplate } from '@/lib/db/super-editor-schema'
import type { LayoutSchema } from '@/lib/super-editor/schema/layout'
import type { StyleSchema } from '@/lib/super-editor/schema/style'
import type { UserData } from '@/lib/super-editor/schema/user-data'
import type { SectionType } from '@/lib/super-editor/schema/section-types'

export default function SuperEditorViewerPage() {
  const params = useParams()
  const invitationId = params.id as string

  const [data, setData] = useState<{
    invitation: SuperEditorInvitation
    template: SuperEditorTemplate
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadInvitation() {
      try {
        const result = await getPublishedInvitation(invitationId)
        if (!result) {
          setError('청첩장을 찾을 수 없습니다.')
        } else if (!result.invitation.isPaid) {
          setError('아직 공개되지 않은 청첩장입니다.')
        } else {
          setData(result)
        }
      } catch (err) {
        console.error('Failed to load invitation:', err)
        setError('청첩장을 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadInvitation()
  }, [invitationId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900">{error}</p>
        </div>
      </div>
    )
  }

  const { invitation, template } = data

  // 섹션 순서/활성화 상태 (DB에서 가져오거나 기본값 사용)
  const sectionOrder = (invitation.sectionOrder as SectionType[]) ?? DEFAULT_SECTION_ORDER
  const sectionEnabled = (invitation.sectionEnabled as Record<SectionType, boolean>) ?? DEFAULT_SECTION_ENABLED

  return (
    <InvitationRenderer
      layout={template.layoutSchema as LayoutSchema}
      style={template.styleSchema as StyleSchema}
      userData={invitation.userData as UserData}
      sectionOrder={sectionOrder}
      sectionEnabled={sectionEnabled}
      mode="preview"
    />
  )
}

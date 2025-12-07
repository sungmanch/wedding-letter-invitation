'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { getInvitationForPreview, getInvitationWithTemplate } from '@/lib/super-editor/actions'
import { InvitationPreview } from '@/lib/super-editor/components'
import { verifyPreviewToken } from '@/lib/utils/preview-token'
import { DEFAULT_SECTION_ORDER, DEFAULT_SECTION_ENABLED } from '@/lib/super-editor/schema/section-types'
import type { SuperEditorInvitation, SuperEditorTemplate } from '@/lib/db/super-editor-schema'
import type { LayoutSchema } from '@/lib/super-editor/schema/layout'
import type { StyleSchema } from '@/lib/super-editor/schema/style'
import type { UserData } from '@/lib/super-editor/schema/user-data'
import type { SectionType } from '@/lib/super-editor/schema/section-types'

export default function SuperEditorPreviewPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const invitationId = params.id as string
  const token = searchParams.get('token')

  const [data, setData] = useState<{
    invitation: SuperEditorInvitation
    template: SuperEditorTemplate
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPreview() {
      try {
        // 토큰이 있으면 검증
        if (token) {
          const verification = await verifyPreviewToken(token)
          if (!verification.valid) {
            if (verification.error === 'expired') {
              setError('미리보기 링크가 만료되었습니다. 새 링크를 요청해주세요.')
            } else {
              setError('유효하지 않은 미리보기 링크입니다.')
            }
            return
          }

          if (verification.invitationId !== invitationId) {
            setError('잘못된 미리보기 링크입니다.')
            return
          }

          // 토큰 유효 → 청첩장 데이터 로드 (인증 없이)
          const invitation = await getInvitationForPreview(invitationId, true)
          if (!invitation) {
            setError('청첩장을 찾을 수 없습니다.')
            return
          }

          // 템플릿도 함께 가져오기 위해 getInvitationWithTemplate 대신 별도 처리
          const result = await getInvitationWithTemplate(invitationId).catch(() => null)
          if (result) {
            setData(result)
          } else {
            setError('템플릿을 찾을 수 없습니다.')
          }
          return
        }

        // 토큰 없음 → 인증된 사용자만 (자신의 청첩장)
        const result = await getInvitationWithTemplate(invitationId)
        if (!result) {
          setError('청첩장을 찾을 수 없습니다.')
          return
        }

        setData(result)
      } catch (err) {
        console.error('Failed to load preview:', err)
        setError('미리보기를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadPreview()
  }, [invitationId, token])

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
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900">{error}</p>
          {!token && (
            <button
              onClick={() => router.push(`/se/${invitationId}/edit`)}
              className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            >
              편집 페이지로 이동
            </button>
          )}
        </div>
      </div>
    )
  }

  const { invitation, template } = data

  // 섹션 순서/활성화 상태
  const sectionOrder = (invitation.sectionOrder as SectionType[]) ?? DEFAULT_SECTION_ORDER
  const sectionEnabled = (invitation.sectionEnabled as Record<SectionType, boolean>) ?? DEFAULT_SECTION_ENABLED

  // 미리보기 배너 (공유된 링크인 경우)
  const PreviewBanner = token ? (
    <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white text-center py-2 text-sm z-50">
      미리보기 모드 - 이 링크는 1시간 동안 유효합니다
    </div>
  ) : (
    <div className="fixed top-0 left-0 right-0 bg-rose-600 text-white text-center py-2 text-sm z-50 flex items-center justify-center gap-4">
      <span>미리보기 모드</span>
      <button
        onClick={() => router.push(`/se/${invitationId}/edit`)}
        className="px-3 py-1 bg-white text-rose-600 rounded text-xs font-medium hover:bg-rose-50"
      >
        편집하기
      </button>
    </div>
  )

  return (
    <div className="min-h-screen">
      {PreviewBanner}
      <div className={token ? 'pt-8' : 'pt-10'}>
        <InvitationPreview
          layout={template.layoutSchema as LayoutSchema}
          style={template.styleSchema as StyleSchema}
          userData={invitation.userData as UserData}
          sectionOrder={sectionOrder}
          sectionEnabled={sectionEnabled}
          mode="preview"
        />
      </div>
    </div>
  )
}

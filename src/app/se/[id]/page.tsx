'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getPublishedInvitation } from '@/lib/super-editor/actions'
import type { SuperEditorInvitation } from '@/lib/db/super-editor-schema'

export default function SuperEditorViewerPage() {
  const params = useParams()
  const invitationId = params.id as string

  const [invitation, setInvitation] = useState<SuperEditorInvitation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadInvitation() {
      try {
        const data = await getPublishedInvitation(invitationId)
        if (!data) {
          setError('청첩장을 찾을 수 없습니다.')
        } else if (!data.isPaid) {
          setError('아직 공개되지 않은 청첩장입니다.')
        } else {
          setInvitation(data)
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

  if (error) {
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

  if (!invitation?.buildResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <p className="text-lg font-medium text-gray-900">청첩장이 아직 빌드되지 않았습니다.</p>
        </div>
      </div>
    )
  }

  // 빌드된 HTML 렌더링
  return (
    <div className="min-h-screen">
      <iframe
        srcDoc={invitation.buildResult.html}
        className="w-full h-screen border-0"
        title="청첩장"
      />
    </div>
  )
}

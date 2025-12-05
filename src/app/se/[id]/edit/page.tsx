'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getInvitationWithTemplate, updateInvitationData } from '@/lib/super-editor/actions'
import { SuperEditorProvider, useSuperEditor } from '@/lib/super-editor/context'
import { EditorPanel, EditorToolbar, PreviewFrame } from '@/lib/super-editor/components'
import { generatePreviewToken, getShareablePreviewUrl } from '@/lib/utils/preview-token'
import type { LayoutSchema } from '@/lib/super-editor/schema/layout'
import type { StyleSchema } from '@/lib/super-editor/schema/style'
import type { EditorSchema } from '@/lib/super-editor/schema/editor'
import type { UserData } from '@/lib/super-editor/schema/user-data'

function EditPageContent() {
  const params = useParams()
  const router = useRouter()
  const invitationId = params.id as string

  const { state, setTemplate, setUserData } = useSuperEditor()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getInvitationWithTemplate(invitationId)
        if (!data) {
          setError('청첩장을 찾을 수 없습니다.')
          return
        }

        const { invitation, template } = data
        setTemplate(
          template.layoutSchema as LayoutSchema,
          template.styleSchema as StyleSchema,
          template.editorSchema as EditorSchema
        )
        setUserData(invitation.userData as UserData)
      } catch (err) {
        console.error('Failed to load invitation:', err)
        setError('청첩장을 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [invitationId, setTemplate, setUserData])

  const handleSave = async () => {
    if (!state.userData) return

    setSaving(true)
    try {
      await updateInvitationData(invitationId, state.userData)
    } catch (err) {
      console.error('Failed to save:', err)
      alert('저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleGenerateShareUrl = async () => {
    try {
      const token = await generatePreviewToken(invitationId, 'owner')
      const url = getShareablePreviewUrl(invitationId, token)
      setShareUrl(url)
    } catch (err) {
      console.error('Failed to generate share URL:', err)
      alert('공유 링크 생성에 실패했습니다.')
    }
  }

  const handleCopyShareUrl = async () => {
    if (!shareUrl) return

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handlePreview = () => {
    router.push(`/se/${invitationId}/preview`)
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <p className="text-lg font-medium text-gray-900">{error}</p>
          <button
            onClick={() => router.push('/super-editor')}
            className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
          >
            새로 만들기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">청첩장 편집</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-sm font-medium"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
            <button
              onClick={handleGenerateShareUrl}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
            >
              공유 링크 생성
            </button>
            <button
              onClick={handlePreview}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 text-sm font-medium"
            >
              미리보기
            </button>
          </div>
        </div>

        {/* 공유 링크 표시 */}
        {shareUrl && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg flex items-center gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-1.5 bg-white border border-blue-200 rounded text-sm"
            />
            <button
              onClick={handleCopyShareUrl}
              className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              {copySuccess ? '복사됨!' : '복사'}
            </button>
            <span className="text-xs text-blue-600">1시간 동안 유효</span>
          </div>
        )}
      </header>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 왼쪽: 에디터 패널 */}
        <div className="w-[400px] flex flex-col bg-white border-r border-gray-200 flex-shrink-0">
          {state.editor ? (
            <>
              <EditorToolbar />
              <EditorPanel className="flex-1 overflow-y-auto" />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>편집기를 불러오는 중...</p>
            </div>
          )}
        </div>

        {/* 중앙: 미리보기 */}
        <div className="flex-1 flex flex-col bg-gray-200">
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            {state.layout ? (
              <div className="relative">
                {/* 모바일 프레임 */}
                <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-10" />
                  <div className="bg-white rounded-[2.5rem] overflow-hidden" style={{ width: 375, height: 667 }}>
                    <PreviewFrame className="w-full h-full" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p className="text-lg font-medium">미리보기 로딩 중...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SuperEditorEditPage() {
  return (
    <SuperEditorProvider>
      <EditPageContent />
    </SuperEditorProvider>
  )
}

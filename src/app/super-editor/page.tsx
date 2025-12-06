'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SuperEditorProvider, useSuperEditor } from '@/lib/super-editor/context'
import { EditorPanel, EditorToolbar, PreviewFrame, ChatPanel } from '@/lib/super-editor/components'
import { createTemplate, createInvitation } from '@/lib/super-editor/actions'
import { kakaoTemplate, kakaoSampleData } from '@/lib/super-editor/templates/kakao-chat'
import type { UserData } from '@/lib/super-editor/schema/user-data'

// 카카오톡 템플릿 기반 사용자 데이터
const createUserData = (data: typeof kakaoSampleData): UserData => ({
  version: '1.0',
  meta: {
    id: 'kakao-user-data',
    templateId: 'kakao-chat-v1',
    layoutId: 'kakao-chat-v1',
    styleId: 'kakao-style-v1',
    editorId: 'kakao-editor-v1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  data,
})

function SuperEditorContent() {
  const router = useRouter()
  const { state, setTemplate, setUserData } = useSuperEditor()
  const [isCreating, setIsCreating] = useState(false)
  const [activePanel, setActivePanel] = useState<'editor' | 'chat'>('chat')

  // 카카오톡 템플릿 로드
  const handleLoadKakao = () => {
    setTemplate(kakaoTemplate.layout, kakaoTemplate.style, kakaoTemplate.editor)
    setUserData(createUserData(kakaoSampleData))
  }

  // 청첩장 생성 및 편집 페이지로 이동
  const handleCreateInvitation = async () => {
    if (!state.layout || !state.style || !state.editor || !state.userData) {
      alert('먼저 템플릿을 생성해주세요.')
      return
    }

    setIsCreating(true)
    try {
      // 1. 템플릿 저장
      const template = await createTemplate({
        name: state.layout.meta.name || 'AI 생성 템플릿',
        description: state.layout.meta.description || 'AI와 대화하며 만든 청첩장',
        category: state.layout.meta.category,
        layout: state.layout,
        style: state.style,
        editor: state.editor,
      })

      // 2. 청첩장 생성 (userId는 서버에서 인증을 통해 가져옴)
      const invitation = await createInvitation({
        templateId: template.id,
        userData: state.userData,
      })

      // 3. 편집 페이지로 이동
      router.push(`/se/${invitation.id}/edit`)
    } catch (error) {
      console.error('청첩장 생성 실패:', error)
      alert('청첩장 생성에 실패했습니다.')
      setIsCreating(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">청첩장 만들기</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLoadKakao}
                className="px-3 py-1.5 bg-[#FEE500] text-gray-900 rounded-lg hover:bg-yellow-400 text-sm font-medium flex items-center gap-1"
              >
                💬 카카오톡 스타일
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateInvitation}
              disabled={!state.layout || isCreating}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isCreating ? '생성 중...' : '청첩장 만들기'}
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 왼쪽: 채팅/에디터 패널 */}
        <div className="w-[400px] flex flex-col bg-white border-r border-gray-200 flex-shrink-0">
          {/* 탭 헤더 */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActivePanel('chat')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activePanel === 'chat'
                  ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                AI 디자이너
              </span>
            </button>
            <button
              onClick={() => setActivePanel('editor')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activePanel === 'editor'
                  ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                미리보기 편집
              </span>
            </button>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="flex-1 overflow-hidden">
            {activePanel === 'chat' ? (
              <ChatPanel
                className="h-full"
                welcomeMessage="안녕하세요! 청첩장 디자인을 도와드릴게요. 어떤 스타일의 청첩장을 만들고 싶으신가요? 예를 들어 '로맨틱한 핑크톤', '모던하고 미니멀한', '따뜻한 가을 느낌' 등을 말씀해주세요."
              />
            ) : (
              <div className="flex flex-col h-full overflow-hidden">
                {state.editor ? (
                  <>
                    <EditorToolbar />
                    <EditorPanel className="flex-1 overflow-y-auto" />
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium">템플릿이 없습니다</p>
                      <p className="text-sm mt-1">AI와 대화하여 템플릿을 생성해주세요</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
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
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-lg font-medium">미리보기 영역</p>
                <p className="text-sm mt-1">AI와 대화하여 청첩장을 디자인해보세요</p>
              </div>
            )}
          </div>

          {/* 상태 표시 */}
          {state.layout?.meta && (
            <div className="bg-white border-t border-gray-200 px-4 py-2 text-sm text-gray-600 flex-shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {state.layout.meta.category || '미지정'} · {state.layout.meta.name || '새 템플릿'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SuperEditorPage() {
  return (
    <SuperEditorProvider>
      <SuperEditorContent />
    </SuperEditorProvider>
  )
}

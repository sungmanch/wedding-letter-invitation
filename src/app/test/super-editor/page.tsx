'use client'

import { useState } from 'react'
import { SuperEditorProvider, useSuperEditor } from '@/lib/super-editor/context'
import { EditorPanel, EditorToolbar, PreviewFrame, ChatPanel } from '@/lib/super-editor/components'
import { createTemplate } from '@/lib/super-editor/actions'
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

function TestPageContent() {
  const { state, setTemplate, setUserData } = useSuperEditor()
  const [buildResult, setBuildResult] = useState<string | null>(null)
  const [activePanel, setActivePanel] = useState<'editor' | 'chat'>('chat')

  // 카카오톡 템플릿 자동 로드
  const handleLoadKakao = () => {
    setTemplate(kakaoTemplate.layout, kakaoTemplate.style, kakaoTemplate.editor)
    setUserData(createUserData(kakaoSampleData))
  }

  const handleSaveTemplate = async () => {
    if (!state.layout || !state.style || !state.editor) {
      alert('먼저 템플릿을 생성해주세요.')
      return
    }

    try {
      const template = await createTemplate({
        name: 'AI 생성 템플릿',
        description: 'AI와 대화하며 만든 청첩장',
        category: state.layout.meta.category,
        layout: state.layout,
        style: state.style,
        editor: state.editor,
      })
      alert(`템플릿 저장 완료! ID: ${template.id}`)
    } catch (error) {
      console.error('템플릿 저장 실패:', error)
      alert('템플릿 저장에 실패했습니다.')
    }
  }

  const handleBuildPreview = async () => {
    if (!state.layout || !state.style || !state.userData) {
      alert('먼저 템플릿을 생성하고 데이터를 입력해주세요.')
      return
    }

    try {
      const { buildHtml } = await import('@/lib/super-editor/builder')
      const result = buildHtml(state.layout, state.style, state.userData)
      setBuildResult(result.html)
    } catch (error) {
      console.error('빌드 실패:', error)
      alert('빌드에 실패했습니다.')
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">Super Editor</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLoadKakao}
                className="px-3 py-1.5 bg-[#FEE500] text-gray-900 rounded-lg hover:bg-yellow-400 text-sm font-medium flex items-center gap-1"
              >
                💬 카카오톡 템플릿
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveTemplate}
              disabled={!state.layout}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              저장
            </button>
            <button
              onClick={handleBuildPreview}
              disabled={!state.layout}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              HTML 빌드
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 - 3패널 레이아웃 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 왼쪽: 에디터/채팅 탭 */}
        <div className="w-[400px] flex flex-col bg-white border-r border-gray-200 flex-shrink-0">
          {/* 탭 헤더 */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActivePanel('chat')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activePanel === 'chat'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                AI 채팅
              </span>
            </button>
            <button
              onClick={() => setActivePanel('editor')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activePanel === 'editor'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                데이터 편집
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
              <>
                {state.editor ? (
                  <>
                    <EditorToolbar />
                    <EditorPanel className="flex-1" />
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
                      <p className="text-sm mt-1">AI 채팅에서 템플릿을 생성해주세요</p>
                    </div>
                  </div>
                )}
              </>
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
                  {/* 노치 */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-10" />
                  {/* 화면 */}
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
                <p className="text-sm mt-1">AI와 대화하여 청첩장을 만들어보세요</p>
              </div>
            )}
          </div>

          {/* 상태 표시 */}
          <div className="bg-white border-t border-gray-200 px-4 py-2 text-sm text-gray-600 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span>
                  모드: <strong>{state.mode}</strong>
                </span>
                <span>
                  수정됨: <strong>{state.dirty ? '예' : '아니오'}</strong>
                </span>
                {state.history.length > 0 && (
                  <span>
                    히스토리: <strong>{state.historyIndex + 1} / {state.history.length}</strong>
                  </span>
                )}
              </div>
              {state.layout && (
                <span className="text-xs text-gray-400">
                  {state.layout.meta.category} · {state.layout.meta.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 빌드 결과 모달 */}
      {buildResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold">빌드 결과 (HTML)</h3>
              <button
                onClick={() => setBuildResult(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-sm bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto">
                {buildResult}
              </pre>
            </div>
            <div className="px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(buildResult)
                  alert('클립보드에 복사되었습니다!')
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                복사
              </button>
              <button
                onClick={() => setBuildResult(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SuperEditorTestPage() {
  return (
    <SuperEditorProvider>
      <TestPageContent />
    </SuperEditorProvider>
  )
}

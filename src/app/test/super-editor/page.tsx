'use client'

import { useState, useEffect } from 'react'
import { SuperEditorProvider, useSuperEditor } from '@/lib/super-editor/context'
import { EditorPanel, EditorToolbar, PreviewFrame } from '@/lib/super-editor/components'
import { generateTemplateWithLLM, createTemplate } from '@/lib/super-editor/actions'
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
  const [generating, setGenerating] = useState(false)
  const [prompt, setPrompt] = useState('로맨틱한 핑크톤의 청첩장을 만들어주세요')
  const [buildResult, setBuildResult] = useState<string | null>(null)

  // 카카오톡 템플릿 자동 로드
  const handleLoadKakao = () => {
    setTemplate(kakaoTemplate.layout, kakaoTemplate.style, kakaoTemplate.editor)
    setUserData(createUserData(kakaoSampleData))
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const result = await generateTemplateWithLLM(prompt)
      setTemplate(result.layout, result.style, result.editor)
      setUserData(createUserData(kakaoSampleData))
    } catch (error) {
      console.error('템플릿 생성 실패:', error)
      alert('템플릿 생성에 실패했습니다.')
    } finally {
      setGenerating(false)
    }
  }

  const handleSaveTemplate = async () => {
    if (!state.layout || !state.style || !state.editor) {
      alert('먼저 템플릿을 생성해주세요.')
      return
    }

    try {
      const template = await createTemplate({
        name: 'AI 생성 템플릿',
        description: prompt,
        category: 'chat',
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
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Super Editor 테스트</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveTemplate}
              disabled={!state.layout}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              템플릿 저장
            </button>
            <button
              onClick={handleBuildPreview}
              disabled={!state.layout}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              HTML 빌드
            </button>
          </div>
        </div>
      </header>

      {/* 템플릿 선택 패널 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          {/* 사전 정의 템플릿 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">템플릿:</span>
            <button
              onClick={handleLoadKakao}
              className="px-4 py-2 bg-[#FEE500] text-gray-900 rounded-lg hover:bg-yellow-400 font-medium flex items-center gap-2"
            >
              💬 카카오톡 스타일
            </button>
          </div>

          <div className="w-px h-8 bg-gray-300" />

          {/* AI 생성 */}
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="AI에게 청첩장 스타일을 설명해주세요..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {generating ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                생성 중...
              </>
            ) : (
              'AI 생성'
            )}
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 왼쪽: 에디터 패널 */}
        <div className="w-[400px] flex flex-col bg-white border-r border-gray-200">
          {state.editor ? (
            <>
              <EditorToolbar />
              <EditorPanel className="flex-1" />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg font-medium">템플릿이 없습니다</p>
                <p className="text-sm mt-1">AI 생성 버튼을 클릭하여 시작하세요</p>
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽: 미리보기 */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-100">
            {state.layout ? (
              <PreviewFrame className="shadow-2xl" />
            ) : (
              <div className="text-gray-500 text-center">
                <p className="text-lg font-medium">미리보기 영역</p>
                <p className="text-sm mt-1">템플릿 생성 후 미리보기가 표시됩니다</p>
              </div>
            )}
          </div>

          {/* 상태 표시 */}
          <div className="bg-white border-t border-gray-200 px-4 py-2 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>
                모드: <strong>{state.mode}</strong>
              </span>
              <span>
                수정됨: <strong>{state.dirty ? '예' : '아니오'}</strong>
              </span>
              <span>
                히스토리: <strong>{state.historyIndex + 1} / {state.history.length}</strong>
              </span>
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

'use client'

import { useSuperEditor } from '../context'
import { SectionRenderer } from './fields/FieldRenderer'

interface EditorPanelProps {
  className?: string
}

export function EditorPanel({ className = '' }: EditorPanelProps) {
  const { state } = useSuperEditor()
  const { editor, loading, error } = state

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-medium">오류가 발생했습니다</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  if (!editor) {
    return (
      <div className={`flex items-center justify-center p-8 text-gray-500 ${className}`}>
        <p>에디터를 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className={`overflow-auto ${className}`}>
      <div className="p-4 space-y-4">
        {/* 에디터 헤더 */}
        <div className="pb-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {editor.meta.name}
          </h2>
          {editor.meta.description && (
            <p className="text-sm text-gray-500 mt-1">
              {editor.meta.description}
            </p>
          )}
        </div>

        {/* 섹션들 */}
        {editor.sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
      </div>
    </div>
  )
}

// 에디터 툴바
export function EditorToolbar({ className = '' }: { className?: string }) {
  const { state, setMode, undo, redo, canUndo, canRedo } = useSuperEditor()
  const { mode, dirty } = state

  return (
    <div
      className={`flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white ${className}`}
    >
      {/* 왼쪽: Undo/Redo */}
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="실행 취소"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="다시 실행"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
          </svg>
        </button>

        {dirty && (
          <span className="ml-2 text-xs text-amber-600">저장되지 않음</span>
        )}
      </div>

      {/* 오른쪽: 모드 전환 */}
      <div className="flex items-center gap-2">
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setMode('edit')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'edit'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            편집
          </button>
          <button
            onClick={() => setMode('preview')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'preview'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            미리보기
          </button>
        </div>
      </div>
    </div>
  )
}

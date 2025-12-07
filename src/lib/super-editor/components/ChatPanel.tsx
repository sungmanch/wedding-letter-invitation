'use client'

/**
 * ChatPanel - AI 대화형 편집 UI
 */

import { useState, useRef, useEffect } from 'react'
import { useAIChat, type ChatMessage, type AISuggestion, type EditMode } from '../hooks/useAIChat'

// ============================================
// Props Types
// ============================================

interface ChatPanelProps {
  className?: string
  placeholder?: string
  welcomeMessage?: string
}

// ============================================
// Edit Mode Config
// ============================================

const EDIT_MODES: { mode: EditMode; label: string; icon: string; description: string }[] = [
  { mode: 'style', label: '스타일', icon: '🎨', description: '색상, 폰트, 테마' },
  { mode: 'layout', label: '레이아웃', icon: '📐', description: '섹션 구조, 순서' },
  { mode: 'all', label: '전체', icon: '🔧', description: '모든 항목 수정' },
]

// ============================================
// Sub Components
// ============================================

function MessageBubble({
  message,
  onApply,
  onRevert,
}: {
  message: ChatMessage
  onApply?: () => void
  onRevert?: () => void
}) {
  const isUser = message.role === 'user'
  const hasChanges = message.changes && message.role === 'assistant'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-md'
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }`}
      >
        {/* 메시지 내용 */}
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>

        {/* 변경사항이 있는 경우 적용/되돌리기 버튼 */}
        {hasChanges && (
          <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
            {message.applied ? (
              <>
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  적용됨
                </span>
                <button
                  onClick={onRevert}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  되돌리기
                </button>
              </>
            ) : (
              <button
                onClick={onApply}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                변경사항 적용
              </button>
            )}
          </div>
        )}

        {/* 변경 설명 */}
        {hasChanges && message.changes?.description && (
          <p className="mt-2 text-xs text-gray-500 italic">
            {message.changes.description}
          </p>
        )}
      </div>
    </div>
  )
}

function SuggestionCard({
  suggestion,
  onApply,
}: {
  suggestion: AISuggestion
  onApply: () => void
}) {
  const priorityColors = {
    high: 'border-red-200 bg-red-50',
    medium: 'border-yellow-200 bg-yellow-50',
    low: 'border-gray-200 bg-gray-50',
  }

  const typeIcons = {
    add: '➕',
    modify: '✏️',
    remove: '🗑️',
    style: '🎨',
  }

  return (
    <button
      onClick={onApply}
      className={`w-full text-left p-3 rounded-lg border ${priorityColors[suggestion.priority]} hover:opacity-80 transition-opacity`}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg">{typeIcons[suggestion.type]}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {suggestion.title}
          </p>
          <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
            {suggestion.description}
          </p>
        </div>
      </div>
    </button>
  )
}

function LoadingDots() {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

// ============================================
// Main Component
// ============================================

export function ChatPanel({
  className = '',
  placeholder = '청첩장에 대해 물어보세요...',
  welcomeMessage = '안녕하세요! 청첩장 디자인을 도와드릴게요. 어떤 스타일을 원하시나요?',
}: ChatPanelProps) {
  const {
    messages,
    isLoading,
    suggestions,
    editMode,
    setEditMode,
    sendMessage,
    applyChanges,
    revertChanges,
    clearChat,
    generateSuggestions,
    applySuggestion,
  } = useAIChat()

  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [showModeSelector, setShowModeSelector] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 메시지가 추가되면 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 자동 높이 조절
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const message = input.trim()
    setInput('')
    await sendMessage(message)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // 빠른 액션 버튼들
  const quickActions = [
    { label: '갤러리 추가', message: '사진 갤러리 섹션을 추가해주세요' },
    { label: '지도 추가', message: '예식장 지도를 추가해주세요' },
    { label: '계좌 추가', message: '축의금 계좌 섹션을 추가해주세요' },
    { label: '색상 변경', message: '전체적인 색상을 더 따뜻하게 바꿔주세요' },
  ]

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">AI</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">디자인 어시스턴트</h3>
            <p className="text-xs text-gray-500">청첩장 디자인을 도와드려요</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={generateSuggestions}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="제안 새로고침"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={clearChat}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="대화 초기화"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 웰컴 메시지 */}
        {messages.length === 0 && (
          <div className="space-y-4">
            <MessageBubble
              message={{
                id: 'welcome',
                role: 'assistant',
                content: welcomeMessage,
                timestamp: new Date(),
              }}
            />

            {/* 빠른 액션 */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 px-1">빠른 시작:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(action.message)}
                    className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 대화 메시지 */}
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onApply={() => applyChanges(message.id)}
            onRevert={() => revertChanges(message.id)}
          />
        ))}

        {/* 로딩 */}
        {isLoading && <LoadingDots />}

        <div ref={messagesEndRef} />
      </div>

      {/* AI 제안 섹션 */}
      {suggestions.length > 0 && showSuggestions && (
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-600">💡 AI 추천</p>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {suggestions.slice(0, 3).map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onApply={() => applySuggestion(suggestion.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 입력 영역 */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3">
        {/* 수정 모드 선택 */}
        <div className="mb-2">
          <button
            type="button"
            onClick={() => setShowModeSelector(!showModeSelector)}
            className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span>{EDIT_MODES.find(m => m.mode === editMode)?.icon}</span>
            <span className="font-medium">{EDIT_MODES.find(m => m.mode === editMode)?.label}</span>
            <span className="text-gray-400">모드</span>
            <svg className={`w-3 h-3 transition-transform ${showModeSelector ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showModeSelector && (
            <div className="mt-2 p-2 bg-gray-50 rounded-lg grid grid-cols-2 gap-1.5">
              {EDIT_MODES.map(({ mode, label, icon, description }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setEditMode(mode)
                    setShowModeSelector(false)
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
                    editMode === mode
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="text-base">{icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{label}</p>
                    <p className="text-[10px] text-gray-500 truncate">{description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm disabled:opacity-50"
              style={{ maxHeight: '120px' }}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 px-1">
          Shift + Enter로 줄바꿈 • Enter로 전송
        </p>
      </form>
    </div>
  )
}

export default ChatPanel

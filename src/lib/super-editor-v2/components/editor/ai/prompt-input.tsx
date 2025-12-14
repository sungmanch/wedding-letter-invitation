'use client'

/**
 * Super Editor v2 - AI Prompt Input
 *
 * AI 편집 프롬프트 입력 컴포넌트
 * - 플로팅 입력창
 * - 프롬프트 제안
 * - 로딩/결과 상태
 */

import {
  useCallback,
  useRef,
  useState,
  useEffect,
  type KeyboardEvent,
  type FormEvent,
} from 'react'

// ============================================
// Types
// ============================================

export interface PromptInputProps {
  /** 프롬프트 제출 콜백 */
  onSubmit: (prompt: string) => Promise<void>
  /** 로딩 상태 */
  isLoading?: boolean
  /** 비활성화 */
  disabled?: boolean
  /** 플레이스홀더 */
  placeholder?: string
  /** 선택된 블록 이름 */
  selectedBlockName?: string
  /** 추천 프롬프트 */
  suggestions?: string[]
  /** 추가 className */
  className?: string
}

// ============================================
// Constants
// ============================================

const DEFAULT_SUGGESTIONS = [
  '색상을 부드러운 파스텔 톤으로 바꿔줘',
  '폰트를 더 우아하게 변경해줘',
  '여백을 넓혀서 시원하게 만들어줘',
  '전체적으로 미니멀하게 정리해줘',
  '이 섹션을 더 눈에 띄게 만들어줘',
]

// ============================================
// Component
// ============================================

export function PromptInput({
  onSubmit,
  isLoading = false,
  disabled = false,
  placeholder = 'AI에게 편집 요청하기...',
  selectedBlockName,
  suggestions = DEFAULT_SUGGESTIONS,
  className = '',
}: PromptInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [prompt, setPrompt] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 자동 포커스
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // 자동 높이 조절
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`
    }
  }, [prompt])

  // 제출 처리
  const handleSubmit = useCallback(async (e?: FormEvent) => {
    e?.preventDefault()

    if (!prompt.trim() || isLoading || disabled) return

    setError(null)
    try {
      await onSubmit(prompt.trim())
      setPrompt('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 편집에 실패했습니다')
    }
  }, [prompt, isLoading, disabled, onSubmit])

  // 키보드 이벤트
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter로 제출 (Shift+Enter는 줄바꿈)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }

    // Escape로 닫기
    if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }, [handleSubmit])

  // 추천 프롬프트 선택
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setPrompt(suggestion)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }, [])

  return (
    <div className={`relative ${className}`}>
      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className="relative">
        {/* 선택된 블록 표시 */}
        {selectedBlockName && (
          <div className="mb-2 px-3 py-1.5 text-xs text-[#C9A962] bg-[#C9A962]/10 rounded-lg inline-flex items-center gap-2">
            <TargetIcon className="w-3 h-3" />
            <span>{selectedBlockName} 편집 중</span>
          </div>
        )}

        {/* 입력 영역 */}
        <div
          className={`
            relative flex items-end gap-2 p-3 rounded-xl
            bg-[#2a2a2a] border border-white/10
            ${isLoading ? 'opacity-70' : ''}
            transition-opacity
          `}
        >
          {/* AI 아이콘 */}
          <div className="flex-shrink-0 p-1">
            <SparklesIcon className="w-5 h-5 text-[#C9A962]" />
          </div>

          {/* 텍스트 입력 */}
          <textarea
            ref={inputRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            rows={1}
            className="
              flex-1 bg-transparent text-[#F5E6D3] placeholder:text-[#F5E6D3]/40
              resize-none outline-none text-sm leading-relaxed
              disabled:cursor-not-allowed
            "
          />

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading || disabled}
            className={`
              flex-shrink-0 p-2 rounded-lg transition-colors
              ${prompt.trim() && !isLoading
                ? 'bg-[#C9A962] text-[#1a1a1a] hover:bg-[#C9A962]/90'
                : 'bg-white/10 text-[#F5E6D3]/30 cursor-not-allowed'
              }
            `}
          >
            {isLoading ? (
              <LoadingIcon className="w-5 h-5 animate-spin" />
            ) : (
              <SendIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* 안내 텍스트 */}
        <p className="mt-2 text-xs text-[#F5E6D3]/40 text-center">
          Enter로 전송 · Shift+Enter로 줄바꿈
        </p>
      </form>

      {/* 에러 메시지 */}
      {error && (
        <div className="mt-2 px-3 py-2 text-sm text-red-400 bg-red-500/10 rounded-lg">
          {error}
        </div>
      )}

      {/* 추천 프롬프트 */}
      {showSuggestions && !prompt && suggestions.length > 0 && (
        <div className="mt-3 space-y-1">
          <p className="text-xs text-[#F5E6D3]/50 mb-2">추천 프롬프트</p>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="
                w-full text-left px-3 py-2 text-sm text-[#F5E6D3]/70
                bg-white/5 hover:bg-white/10 rounded-lg
                transition-colors
              "
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// Floating Prompt Input
// ============================================

export interface FloatingPromptInputProps extends PromptInputProps {
  /** 표시 여부 */
  isOpen: boolean
  /** 닫기 콜백 */
  onClose: () => void
  /** 위치 */
  position?: 'bottom' | 'center'
}

export function FloatingPromptInput({
  isOpen,
  onClose,
  position = 'bottom',
  ...props
}: FloatingPromptInputProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 감지
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape as any)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape as any)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-end justify-center
        ${position === 'center' ? 'items-center' : 'items-end pb-8'}
        bg-black/50 backdrop-blur-sm
      `}
    >
      <div
        ref={containerRef}
        className="
          w-full max-w-lg mx-4 p-4 rounded-2xl
          bg-[#1a1a1a] border border-white/10
          shadow-2xl
        "
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-[#F5E6D3]">AI 편집</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#F5E6D3]/50 hover:text-[#F5E6D3] transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <PromptInput {...props} />
      </div>
    </div>
  )
}

// ============================================
// Icons
// ============================================

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  )
}

function LoadingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth={4} />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

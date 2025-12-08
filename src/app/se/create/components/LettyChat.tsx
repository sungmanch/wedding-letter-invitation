'use client'

/**
 * LettyChat - Letty와의 대화 UI 컨테이너
 * 카카오톡 스타일 대화 인터페이스
 */

import { useEffect, useRef, useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { MessageBubble, TypingBubble, type ChatMessage } from './MessageBubble'
import { LettyAvatar } from './LettyAvatar'
import { useLettyConversation, type CollectedData } from '../hooks/useLettyConversation'

interface LettyChatProps {
  onGenerate: (data: CollectedData) => Promise<void>
  isGenerating?: boolean
}

export function LettyChat({ onGenerate, isGenerating = false }: LettyChatProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const {
    messages,
    currentStep,
    isTyping,
    startConversation,
    handleUserInput,
    isInputDisabled,
  } = useLettyConversation({
    onGenerate,
  })

  // 페이지 로드 시 대화 시작
  useEffect(() => {
    startConversation()
  }, [startConversation])

  // 새 메시지 시 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // 텍스트영역 자동 높이 조절
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 100)}px`
    }
  }, [input])

  // 입력 제출
  const handleSubmit = () => {
    if (!input.trim() || isInputDisabled || isGenerating) return
    handleUserInput(input)
    setInput('')
  }

  // 키 입력 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // 연속 메시지 여부 확인 (아바타 표시용)
  const shouldShowAvatar = (index: number, message: ChatMessage) => {
    if (message.role === 'user') return false
    if (index === 0) return true
    const prevMessage = messages[index - 1]
    return prevMessage.role !== 'assistant'
  }

  return (
    <div className="flex flex-col h-full m-4 border border-[#C9A962]/30 rounded-xl overflow-hidden bg-[#1A1A1A]">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#C9A962]/20">
        <LettyAvatar size="lg" />
        <div>
          <h3 className="text-sm font-semibold text-[#F5E6D3]">디자인 어시스턴트</h3>
          <p className="text-xs text-[#F5E6D3]/60">
            <span className="font-semibold text-[#C9A962]">Letty</span> 와 함께 디자인해봐요
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            showAvatar={shouldShowAvatar(index, message)}
          />
        ))}

        {/* 타이핑 인디케이터 */}
        {isTyping && (
          <TypingBubble
            showAvatar={messages.length === 0 || messages[messages.length - 1]?.role === 'user'}
          />
        )}

        {/* 생성 중 로딩 */}
        {currentStep === 'generating' && isGenerating && (
          <div className="flex gap-2 flex-row">
            <div className="w-8 shrink-0" />
            <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-2 text-[#F5E6D3]">
                <Loader2 className="w-4 h-4 animate-spin text-[#C9A962]" />
                <span className="text-sm">청첩장을 디자인하고 있어요...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#C9A962]/20">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                currentStep === 'complete'
                  ? '디자인이 완성되었어요!'
                  : currentStep === 'generating'
                  ? '디자인 생성 중...'
                  : '메시지를 입력하세요...'
              }
              rows={1}
              disabled={isInputDisabled || isGenerating}
              className="w-full px-4 py-3 bg-white/10 text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#C9A962] focus:bg-white/15 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ maxHeight: '100px' }}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isInputDisabled || isGenerating}
            className="p-3 bg-[#C9A962] text-[#0A0806] rounded-full hover:bg-[#B8A052] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-[#F5E6D3]/40 mt-2 text-center">
          {currentStep === 'complete'
            ? '오른쪽 미리보기를 확인하세요'
            : 'Enter로 전송, Shift+Enter로 줄바꿈'}
        </p>
      </div>
    </div>
  )
}

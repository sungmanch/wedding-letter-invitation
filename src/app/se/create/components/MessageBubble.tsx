'use client'

/**
 * MessageBubble - 메시지 버블 컴포넌트
 * 사용자/Letty 메시지를 카카오톡 스타일로 표시
 */

import { LettyAvatar } from './LettyAvatar'
import { TypingIndicator } from './TypingIndicator'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MessageBubbleProps {
  message: ChatMessage
  showAvatar?: boolean // 연속 메시지일 때 아바타 숨김
}

export function MessageBubble({ message, showAvatar = true }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Letty 아바타 */}
      {!isUser && showAvatar && <LettyAvatar size="sm" />}
      {!isUser && !showAvatar && <div className="w-8 shrink-0" />}

      {/* 메시지 버블 */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isUser
            ? 'bg-[#C9A962] text-[#0A0806] rounded-br-sm'
            : 'bg-white/10 text-[#F5E6D3] rounded-bl-sm'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
      </div>
    </div>
  )
}

/**
 * TypingBubble - Letty가 타이핑 중일 때 표시
 */
interface TypingBubbleProps {
  showAvatar?: boolean
}

export function TypingBubble({ showAvatar = true }: TypingBubbleProps) {
  return (
    <div className="flex gap-2 flex-row">
      {showAvatar && <LettyAvatar size="sm" />}
      {!showAvatar && <div className="w-8 shrink-0" />}

      <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
        <TypingIndicator />
      </div>
    </div>
  )
}

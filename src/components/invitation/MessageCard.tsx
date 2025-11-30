'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { InvitationMessage } from '@/lib/db/invitation-schema'

interface MessageCardProps {
  message: InvitationMessage
  onClick?: () => void
  className?: string
}

export function MessageCard({ message, onClick, className }: MessageCardProps) {
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSeconds < 60) return '방금 전'
    if (diffMinutes < 60) return `${diffMinutes}분 전`
    if (diffHours < 24) return `${diffHours}시간 전`
    if (diffDays < 7) return `${diffDays}일 전`

    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-left bg-white rounded-2xl p-4 shadow-sm transition-all',
        'hover:shadow-md active:scale-[0.99]',
        !message.isRead && 'ring-2 ring-[#D4768A]/20',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="h-8 w-8 rounded-full bg-[#FFB6C1]/30 flex items-center justify-center">
            <span className="text-sm">💌</span>
          </div>
          <span className="font-medium text-charcoal">
            {message.guestName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* New Badge */}
          {!message.isRead && (
            <span className="px-2 py-0.5 text-xs font-medium text-[#D4768A] bg-[#D4768A]/10 rounded-full">
              NEW
            </span>
          )}
          {/* Time */}
          <span className="text-xs text-gray-400">
            {formatRelativeTime(new Date(message.createdAt))}
          </span>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap line-clamp-3">
        {message.content}
      </p>
    </button>
  )
}

// Message List Component
interface MessageListProps {
  messages: InvitationMessage[]
  onMessageClick?: (message: InvitationMessage) => void
  className?: string
}

export function MessageList({ messages, onMessageClick, className }: MessageListProps) {
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  if (sortedMessages.length === 0) {
    return (
      <div className={cn('py-16 text-center', className)}>
        <div className="text-4xl mb-4">💌</div>
        <p className="text-gray-500 font-medium mb-2">
          아직 받은 메시지가 없어요
        </p>
        <p className="text-sm text-gray-400">
          청첩장을 공유하면 축하 메시지를 받을 수 있어요
        </p>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {sortedMessages.map((message) => (
        <MessageCard
          key={message.id}
          message={message}
          onClick={() => onMessageClick?.(message)}
        />
      ))}
    </div>
  )
}

// Message Form Component
interface MessageFormProps {
  onSubmit: (guestName: string, content: string) => Promise<void>
  disabled?: boolean
  className?: string
}

export function MessageForm({ onSubmit, disabled, className }: MessageFormProps) {
  const [guestName, setGuestName] = React.useState('')
  const [content, setContent] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const maxLength = 300

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestName.trim() || !content.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSubmit(guestName.trim(), content.trim())
      setGuestName('')
      setContent('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex flex-col gap-4', className)}>
      {/* Guest Name Input */}
      <div>
        <label htmlFor="guestName" className="block text-sm font-medium text-charcoal mb-2">
          이름 <span className="text-[#D4768A]">*</span>
        </label>
        <input
          id="guestName"
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="이름을 입력해주세요"
          disabled={disabled || isSubmitting}
          maxLength={50}
          className={cn(
            'w-full px-4 py-3 rounded-xl border border-gray-200 text-base',
            'focus:outline-none focus:border-[#D4768A] focus:ring-2 focus:ring-[#D4768A]/20',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />
      </div>

      {/* Message Content */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="content" className="text-sm font-medium text-charcoal">
            축하 메시지
          </label>
          <span className={cn(
            'text-xs',
            content.length > maxLength * 0.9 ? 'text-[#D4768A]' : 'text-gray-400'
          )}>
            {content.length} / {maxLength}
          </span>
        </div>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
          placeholder="진심 어린 축하 메시지를 남겨주세요"
          disabled={disabled || isSubmitting}
          rows={5}
          className={cn(
            'w-full px-4 py-3 rounded-xl border border-gray-200 text-base resize-none',
            'focus:outline-none focus:border-[#D4768A] focus:ring-2 focus:ring-[#D4768A]/20',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={disabled || isSubmitting || !guestName.trim() || !content.trim()}
        className={cn(
          'w-full py-4 rounded-xl font-medium text-base transition-colors',
          'bg-[#D4768A] text-white',
          'hover:bg-[#c4657a] active:bg-[#b45569]',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            보내는 중...
          </span>
        ) : (
          '축하 메시지 보내기'
        )}
      </button>
    </form>
  )
}

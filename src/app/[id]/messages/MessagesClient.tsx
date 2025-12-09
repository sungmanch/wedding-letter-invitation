'use client'

import * as React from 'react'
import { MessageList } from '@/components/invitation'
import { markMessageAsRead } from '@/lib/actions/message'
import { X } from 'lucide-react'
import type { InvitationMessage } from '@/lib/db/invitation-schema'

interface MessagesClientProps {
  invitationId: string
  initialMessages: InvitationMessage[]
}

export function MessagesClient({ invitationId, initialMessages }: MessagesClientProps) {
  const [messages, setMessages] = React.useState(initialMessages)
  const [selectedMessage, setSelectedMessage] = React.useState<InvitationMessage | null>(null)

  const handleMessageClick = async (message: InvitationMessage) => {
    setSelectedMessage(message)

    // Mark as read if not already
    if (!message.isRead) {
      const result = await markMessageAsRead(invitationId, message.id)

      if (result.success) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === message.id ? { ...m, isRead: true } : m
          )
        )
      }
    }
  }

  const closeModal = () => {
    setSelectedMessage(null)
  }

  return (
    <>
      <MessageList
        messages={messages}
        onMessageClick={handleMessageClick}
      />

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#FFB6C1]/30 flex items-center justify-center">
                  <span className="text-lg">💌</span>
                </div>
                <div>
                  <p className="font-semibold text-charcoal">
                    {selectedMessage.guestName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(new Date(selectedMessage.createdAt))}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-charcoal leading-relaxed whitespace-pre-wrap">
                {selectedMessage.content}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="w-full py-3 rounded-xl bg-gray-100 text-charcoal font-medium hover:bg-gray-200 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  )
}

function formatDate(date: Date): string {
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
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

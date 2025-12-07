'use client'

import { useState, useCallback } from 'react'
import { useGuestbook } from '../hooks/useGuestbook'
import type { GuestbookMessage } from '@/lib/db/super-editor-schema'

// ============================================
// GuestbookWriteForm - 쓰기 폼
// ============================================

interface GuestbookWriteFormProps {
  invitationId: string
  onSuccess?: (message: GuestbookMessage) => void
  className?: string
}

export function GuestbookWriteForm({
  invitationId,
  onSuccess,
  className = '',
}: GuestbookWriteFormProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const { submitMessage, isSubmitting, error, clearError } = useGuestbook({ invitationId })

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    const result = await submitMessage({ name, message })

    if (result.success) {
      setName('')
      setMessage('')
      onSuccess?.(result.message)
    }
  }, [name, message, submitMessage, clearError, onSuccess])

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {/* 이름 입력 */}
      <div>
        <label htmlFor="guestbook-name" className="block text-sm font-medium text-gray-700 mb-1">
          이름
        </label>
        <input
          id="guestbook-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력해주세요"
          maxLength={50}
          required
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      {/* 메시지 입력 */}
      <div>
        <label htmlFor="guestbook-message" className="block text-sm font-medium text-gray-700 mb-1">
          축하 메시지
        </label>
        <textarea
          id="guestbook-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="축하의 마음을 전해주세요"
          maxLength={500}
          rows={4}
          required
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-gray-400 text-right">{message.length}/500</p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isSubmitting || !name.trim() || !message.trim()}
        className="w-full py-3 bg-rose-500 text-white font-medium rounded-lg hover:bg-rose-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isSubmitting ? '전송 중...' : '축하 메시지 보내기'}
      </button>
    </form>
  )
}

// ============================================
// GuestbookMessageList - 메시지 목록 (호스트용)
// ============================================

interface GuestbookMessageListProps {
  invitationId: string
  className?: string
}

export function GuestbookMessageList({
  invitationId,
  className = '',
}: GuestbookMessageListProps) {
  const { messages, isLoading, error, hasMore, fetchMessages, loadMore } = useGuestbook({ invitationId })
  const [isInitialized, setIsInitialized] = useState(false)

  // 초기 로드
  if (!isInitialized) {
    setIsInitialized(true)
    fetchMessages()
  }

  if (isLoading && messages.length === 0) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="animate-spin w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-red-500">{error}</p>
        <button
          type="button"
          onClick={() => fetchMessages()}
          className="mt-4 px-4 py-2 text-sm text-rose-500 hover:underline"
        >
          다시 시도
        </button>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-400">아직 받은 축하 메시지가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 메시지 카운트 */}
      <p className="text-sm text-gray-500">
        총 <span className="font-semibold text-rose-500">{messages.length}</span>개의 축하 메시지
      </p>

      {/* 메시지 목록 */}
      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
          >
            <p className="text-gray-800 whitespace-pre-wrap">{msg.message}</p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="font-medium text-rose-500">{msg.name}</span>
              <span className="text-gray-400">
                {formatDate(msg.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 더보기 버튼 */}
      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          disabled={isLoading}
          className="w-full py-3 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          {isLoading ? '불러오는 중...' : '더 보기'}
        </button>
      )}
    </div>
  )
}

// ============================================
// GuestbookFab - 축하하기 FAB 버튼
// ============================================

interface GuestbookFabProps {
  onClick: () => void
  className?: string
}

export function GuestbookFab({ onClick, className = '' }: GuestbookFabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`fixed bottom-6 left-6 h-14 px-5 bg-rose-500 text-white rounded-full shadow-lg flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors z-50 ${className}`}
      aria-label="축하하기"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span className="font-medium">축하하기</span>
    </button>
  )
}

// ============================================
// GuestbookModal - 축하하기 모달
// ============================================

interface GuestbookModalProps {
  isOpen: boolean
  onClose: () => void
  invitationId: string
}

export function GuestbookModal({
  isOpen,
  onClose,
  invitationId,
}: GuestbookModalProps) {
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSuccess = useCallback(() => {
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      onClose()
    }, 2000)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-6 animate-slide-up">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">축하 메시지 보내기</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 성공 메시지 */}
        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900">감사합니다!</p>
            <p className="mt-1 text-gray-500">축하 메시지가 전달되었습니다.</p>
          </div>
        ) : (
          <GuestbookWriteForm
            invitationId={invitationId}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  )
}

// ============================================
// Helper Functions
// ============================================

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days < 7) return `${days}일 전`

  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

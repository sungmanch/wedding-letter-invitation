'use client'

import { useState, useCallback } from 'react'
import type { GuestbookMessage } from '@/lib/db/super-editor-schema'

// ============================================
// Types
// ============================================

interface UseGuestbookOptions {
  invitationId: string
}

interface SubmitMessageParams {
  name: string
  message: string
}

interface GuestbookState {
  messages: GuestbookMessage[]
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
  hasMore: boolean
}

// ============================================
// Hook
// ============================================

export function useGuestbook({ invitationId }: UseGuestbookOptions) {
  const [state, setState] = useState<GuestbookState>({
    messages: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
    hasMore: true,
  })

  // 메시지 목록 조회
  const fetchMessages = useCallback(
    async (options?: { limit?: number; offset?: number; append?: boolean }) => {
      const { limit = 50, offset = 0, append = false } = options || {}

      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const params = new URLSearchParams({
          invitationId,
          limit: limit.toString(),
          offset: offset.toString(),
        })

        const response = await fetch(`/api/super-editor/guestbook?${params}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || '메시지 조회 실패')
        }

        setState((prev) => ({
          ...prev,
          messages: append ? [...prev.messages, ...data.messages] : data.messages,
          hasMore: data.pagination.hasMore,
          isLoading: false,
        }))

        return data.messages
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류'
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }))
        return []
      }
    },
    [invitationId]
  )

  // 메시지 작성
  const submitMessage = useCallback(
    async ({ name, message }: SubmitMessageParams) => {
      setState((prev) => ({ ...prev, isSubmitting: true, error: null }))

      try {
        const response = await fetch('/api/super-editor/guestbook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            invitationId,
            name,
            message,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || '메시지 작성 실패')
        }

        // 새 메시지를 목록 맨 앞에 추가
        setState((prev) => ({
          ...prev,
          messages: [data.message, ...prev.messages],
          isSubmitting: false,
        }))

        return { success: true, message: data.message }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류'
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          error: errorMessage,
        }))
        return { success: false, error: errorMessage }
      }
    },
    [invitationId]
  )

  // 더 불러오기
  const loadMore = useCallback(async () => {
    if (state.isLoading || !state.hasMore) return

    await fetchMessages({
      offset: state.messages.length,
      append: true,
    })
  }, [fetchMessages, state.isLoading, state.hasMore, state.messages.length])

  // 에러 초기화
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    fetchMessages,
    submitMessage,
    loadMore,
    clearError,
  }
}

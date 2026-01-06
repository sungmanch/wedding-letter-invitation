'use client'

/**
 * Guestbook Modal - 방명록 작성 팝업
 *
 * 이미지 디자인 기반:
 * - 제목: 방명록 남기기
 * - 부제: 직접 축하의 마음을 전해보세요.
 * - 성함 입력 (필수)
 * - 방명록 작성 (필수, 최대 50자)
 */

import { useState, useCallback } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal'
import type { GuestbookConfig } from '../../schema/types'

// ============================================
// Types
// ============================================

export interface GuestbookModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invitationId: string
  config?: GuestbookConfig
  onSubmit?: (data: GuestbookFormData) => Promise<void>
}

export interface GuestbookFormData {
  name: string
  message: string
}

// ============================================
// Component
// ============================================

export function GuestbookModal({
  open,
  onOpenChange,
  invitationId,
  config,
  onSubmit,
}: GuestbookModalProps) {
  // 폼 상태
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 설정값
  const maxLength = config?.maxLength ?? 50
  const placeholder = config?.placeholder ?? '방명록 (최대 50자)'

  // 폼 유효성 검사
  const isFormValid = name.trim().length > 0 && message.trim().length > 0

  // 폼 초기화
  const resetForm = useCallback(() => {
    setName('')
    setMessage('')
    setError(null)
  }, [])

  // 모달 닫기
  const handleClose = useCallback(() => {
    resetForm()
    onOpenChange(false)
  }, [resetForm, onOpenChange])

  // 폼 제출
  const handleSubmit = useCallback(async () => {
    if (!isFormValid) return

    setIsSubmitting(true)
    setError(null)

    try {
      const formData: GuestbookFormData = {
        name: name.trim(),
        message: message.trim(),
      }

      if (onSubmit) {
        // 커스텀 핸들러가 있으면 사용
        await onSubmit(formData)
      } else {
        // 기본 동작: API 호출
        const response = await fetch('/api/super-editor-v2/guestbook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentId: invitationId,
            name: formData.name,
            message: formData.message,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || '제출에 실패했습니다.')
        }
      }

      // 성공 시 모달 닫기
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '제출에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }, [isFormValid, name, message, invitationId, onSubmit, handleClose])

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <ModalContent className="max-w-md mx-4">
        <ModalHeader className="relative pb-4">
          <ModalTitle className="text-xl font-semibold">
            방명록 남기기
          </ModalTitle>
          <p className="text-sm text-gray-500 mt-1">
            직접 축하의 마음을 전해보세요.
          </p>
        </ModalHeader>

        <div className="p-4 space-y-5">
          {/* 성함 입력 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              성함을 입력해 주세요.<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="성함"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>

          {/* 방명록 작성 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              방명록을 작성해 주세요.<span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => {
                if (e.target.value.length <= maxLength) {
                  setMessage(e.target.value)
                }
              }}
              placeholder={placeholder}
              maxLength={maxLength}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors resize-none"
            />
            <div className="text-xs text-gray-400 text-right">
              {message.length}/{maxLength}자
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          {/* 제출 버튼 */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-4 text-base font-medium rounded-lg transition-colors ${
              isFormValid && !isSubmitting
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? '등록 중...' : '방명록 남기기'}
          </button>
        </div>
      </ModalContent>
    </Modal>
  )
}

// ============================================
// Exports
// ============================================

export { GuestbookModal as default }

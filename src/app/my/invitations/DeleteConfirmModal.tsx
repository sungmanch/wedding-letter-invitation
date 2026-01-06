'use client'

/**
 * Delete Confirm Modal
 *
 * 청첩장 삭제 확인 모달
 * - 작성 중: 기본 삭제 확인
 * - 발행됨: 공유 링크 접근 불가 경고 추가
 */

import { useState } from 'react'
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  Button,
} from '@/components/ui'

// ============================================
// Types
// ============================================

interface DeleteConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documentTitle: string
  isPublished: boolean
  onConfirm: () => Promise<void>
}

// ============================================
// Component
// ============================================

export function DeleteConfirmModal({
  open,
  onOpenChange,
  documentTitle,
  isPublished,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (error) {
      console.error('Delete failed:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-sm">
        <ModalHeader>
          <ModalTitle className="flex items-center gap-2">
            {isPublished ? (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                발행된 청첩장입니다
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5 text-red-500" />
                이 청첩장을 삭제할까요?
              </>
            )}
          </ModalTitle>
        </ModalHeader>

        <div className="space-y-4">
          {isPublished ? (
            <div className="space-y-3">
              <p className="text-sm text-[var(--text-body)]">
                <strong className="text-[var(--text-primary)]">"{documentTitle}"</strong>을(를)
                삭제하면 복구할 수 없습니다.
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  이미 공유한 링크가 있다면, 삭제 후 하객들이 청첩장을 볼 수 없게 됩니다.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-body)]">
              <strong className="text-[var(--text-primary)]">"{documentTitle}"</strong>을(를)
              삭제하면 복구할 수 없어요.
            </p>
          )}

          {/* 버튼 그룹 */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => onOpenChange(false)}
              disabled={isDeleting}
              variant="outline"
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  삭제 중...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제하기
                </>
              )}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}

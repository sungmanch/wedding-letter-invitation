'use client'

/**
 * Draft Exists Modal
 *
 * 사용자가 "편집 시작하기" 클릭 시 기존 draft가 있을 때 표시
 * - 이어서 편집: 기존 draft 에디터로 이동
 * - 새로 시작: 기존 draft 덮어쓰기
 */

import { useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { FileEdit, RefreshCw } from 'lucide-react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  Button,
} from '@/components/ui'
import { DocumentRenderer } from '@/lib/super-editor-v2/renderer/document-renderer'
import type {
  Block,
  StyleSystem,
  WeddingData,
  GlobalAnimation,
  EditorDocument,
} from '@/lib/super-editor-v2/schema/types'

// ============================================
// Types
// ============================================

interface DraftDocument {
  id: string
  title: string
  blocks: Block[]
  style: StyleSystem
  data: WeddingData
  animation: GlobalAnimation | null
  updatedAt: Date
}

interface DraftExistsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  draft: DraftDocument | null
  onContinue: () => void      // 이어서 편집
  onStartNew: () => void      // 새로 시작 (덮어쓰기)
  isLoading?: boolean
}

// ============================================
// Constants
// ============================================

const PREVIEW_WIDTH = 120
const PREVIEW_HEIGHT = 160
const VIEWPORT_WIDTH = 375
const VIEWPORT_HEIGHT = 667

// ============================================
// Component
// ============================================

export function DraftExistsModal({
  open,
  onOpenChange,
  draft,
  onContinue,
  onStartNew,
  isLoading = false,
}: DraftExistsModalProps) {
  // Hero 블록만 추출하여 미니 문서 생성
  const heroDocument = useMemo<EditorDocument | null>(() => {
    if (!draft) return null

    const heroBlock = draft.blocks.find((b) => b.type === 'hero' && b.enabled)
    if (!heroBlock) return null

    return {
      id: `preview-${draft.id}`,
      version: 2,
      blocks: [heroBlock],
      style: draft.style,
      data: draft.data,
      animation: draft.animation ?? { mood: 'minimal', speed: 1, floatingElements: [] },
      meta: {
        title: 'Preview',
        createdAt: draft.updatedAt.toISOString(),
        updatedAt: draft.updatedAt.toISOString(),
      },
    }
  }, [draft])

  const scale = PREVIEW_WIDTH / VIEWPORT_WIDTH

  if (!draft) return null

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-sm">
        <ModalHeader>
          <ModalTitle>미완성 청첩장이 있어요</ModalTitle>
        </ModalHeader>

        <div className="space-y-4">
          {/* Draft 미리보기 */}
          <div className="flex gap-4 p-4 bg-[var(--sand-50)] rounded-lg">
            {/* Hero Preview */}
            <div
              className="relative flex-shrink-0 rounded-lg overflow-hidden border border-[var(--sand-200)] bg-white"
              style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
            >
              {heroDocument ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: VIEWPORT_WIDTH,
                    height: VIEWPORT_HEIGHT,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    pointerEvents: 'none',
                  }}
                >
                  <DocumentRenderer
                    document={heroDocument}
                    mode="preview"
                    viewportOverride={{ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-[var(--text-muted)] text-xs">
                  미리보기 없음
                </div>
              )}
            </div>

            {/* Draft 정보 */}
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="font-medium text-[var(--text-primary)] line-clamp-1">
                {draft.title || '새 청첩장'}
              </h3>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                마지막 수정:{' '}
                {formatDistanceToNow(draft.updatedAt, {
                  addSuffix: true,
                  locale: ko,
                })}
              </p>
            </div>
          </div>

          {/* 버튼 그룹 */}
          <div className="flex gap-2">
            <Button
              onClick={onContinue}
              disabled={isLoading}
              className="flex-1 bg-[var(--sage-500)] hover:bg-[var(--sage-600)] text-white"
            >
              <FileEdit className="w-4 h-4 mr-2" />
              이어서 편집
            </Button>
            <Button
              onClick={onStartNew}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              새로 시작
            </Button>
          </div>

          {/* 안내 문구 */}
          <p className="text-xs text-center text-[var(--text-muted)]">
            새로 시작하면 기존 작업이 덮어씌워집니다
          </p>
        </div>
      </ModalContent>
    </Modal>
  )
}

'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Calendar, Pencil, Share2, X, Copy, Check } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { DocumentRenderer } from '@/lib/super-editor-v2/renderer/document-renderer'
import type {
  Block,
  StyleSystem,
  WeddingData,
  GlobalAnimation,
  EditorDocument,
} from '@/lib/super-editor-v2/schema/types'

interface InvitationCardProps {
  id: string
  title: string
  status: string
  blocks: Block[]
  style: StyleSystem
  data: WeddingData
  animation: GlobalAnimation | null
  updatedAt: Date
}

const VIEWPORT_WIDTH = 375
const VIEWPORT_HEIGHT = 667

export function InvitationCard({
  id,
  title,
  status,
  blocks,
  style,
  data,
  animation,
  updatedAt,
}: InvitationCardProps) {
  const [showSharePopup, setShowSharePopup] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/share/${id}`
    : `/share/${id}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // 히어로 블록만 추출하여 미니 문서 생성
  const heroDocument = useMemo<EditorDocument | null>(() => {
    const heroBlock = blocks.find((b) => b.type === 'hero' && b.enabled)
    if (!heroBlock) return null

    return {
      id: `preview-${id}`,
      version: 2,
      blocks: [heroBlock],
      style,
      data,
      animation: animation ?? { mood: 'minimal', speed: 1, floatingElements: [] },
      meta: {
        title: 'Preview',
        createdAt: updatedAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      },
    }
  }, [id, blocks, style, data, animation, updatedAt])

  // 썸네일 스케일 계산
  const thumbnailWidth = 280
  const thumbnailHeight = 180
  const scale = thumbnailWidth / VIEWPORT_WIDTH

  return (
    <>
      <div className="group bg-white rounded-xl border border-[var(--sand-100)] overflow-hidden hover:border-[var(--sage-300)] hover:shadow-md transition-all">
        {/* Hero Preview - Clickable to edit */}
        <Link
          href={`/se2/${id}/edit`}
          className="block relative bg-[var(--sand-50)] overflow-hidden"
          style={{ height: thumbnailHeight }}
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
            <div className="flex items-center justify-center h-full text-[var(--text-muted)] text-sm">
              미리보기 없음
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </Link>

        {/* Card Content */}
        <div className="p-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                status === 'published'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-[var(--sand-50)] text-[var(--text-muted)]'
              }`}
            >
              {status === 'published' ? '발행됨' : '작성 중'}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-medium text-[var(--text-heading)] line-clamp-1">
            {title || '제목 없음'}
          </h3>

          {/* Date Info */}
          <div className="mt-2 flex items-center gap-1 text-xs text-[var(--text-muted)]">
            <Calendar className="h-3 w-3" />
            <span>
              {formatDistanceToNow(updatedAt, {
                addSuffix: true,
                locale: ko,
              })}
              에 수정됨
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            <Link
              href={`/se2/${id}/edit`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-[var(--sage-700)] bg-[var(--sage-50)] hover:bg-[var(--sage-100)] rounded-lg transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
              편집하기
            </Link>
            <button
              onClick={() => setShowSharePopup(true)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-[var(--text-body)] bg-[var(--sand-50)] hover:bg-[var(--sand-100)] rounded-lg transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              공유하기
            </button>
          </div>
        </div>
      </div>

      {/* Share Popup */}
      {showSharePopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowSharePopup(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-heading)]">
                청첩장 공유하기
              </h3>
              <button
                onClick={() => setShowSharePopup(false)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-body)] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-[var(--text-muted)] mb-3">
              아래 링크를 복사하여 공유하세요
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm bg-[var(--sand-50)] border border-[var(--sand-100)] rounded-lg text-[var(--text-body)]"
              />
              <button
                onClick={handleCopy}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-[var(--sage-600)] text-white hover:bg-[var(--sage-700)]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    복사하기
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

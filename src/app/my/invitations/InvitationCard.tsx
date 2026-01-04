'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Calendar, Eye } from 'lucide-react'
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
    <Link
      href={`/se2/${id}/edit`}
      className="group block bg-white rounded-xl border border-[var(--sand-100)] overflow-hidden hover:border-[var(--sage-300)] hover:shadow-md transition-all"
    >
      {/* Hero Preview */}
      <div
        className="relative bg-[var(--sand-50)] overflow-hidden"
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
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Status Badge + Preview Button */}
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
          {status === 'published' && (
            <Link
              href={`/share/${id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[var(--text-muted)] hover:text-[var(--sage-600)] transition-colors"
              title="미리보기"
            >
              <Eye className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Title */}
        <h3 className="font-medium text-[var(--text-heading)] group-hover:text-[var(--sage-700)] transition-colors line-clamp-1">
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
      </div>
    </Link>
  )
}

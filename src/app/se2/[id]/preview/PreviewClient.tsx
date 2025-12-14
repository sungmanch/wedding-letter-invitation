'use client'

/**
 * Super Editor v2 - Preview Client
 *
 * 로그인된 소유자 전용 미리보기
 * 실제 게스트 뷰와 동일하게 표시
 */

import { useMemo } from 'react'
import Link from 'next/link'
import type { EditorDocumentV2 } from '@/lib/super-editor-v2/schema/db-schema'
import { toEditorDocument } from '@/lib/super-editor-v2/utils/document-adapter'
import { resolveStyle } from '@/lib/super-editor-v2/renderer/style-resolver'
import { DocumentProvider } from '@/lib/super-editor-v2/context/document-context'
import { DocumentRenderer } from '@/lib/super-editor-v2/renderer/document-renderer'

interface PreviewClientProps {
  document: EditorDocumentV2
}

export function PreviewClient({ document: dbDocument }: PreviewClientProps) {
  // DB 데이터를 EditorDocument로 변환
  const editorDoc = useMemo(() => toEditorDocument(dbDocument), [dbDocument])

  // 스타일 해석
  const resolvedStyle = useMemo(
    () => resolveStyle(editorDoc.style),
    [editorDoc.style]
  )

  return (
    <div className="min-h-screen relative">
      {/* 프리뷰 배너 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#C9A962] text-[#1a1a1a] py-2 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EyeIcon className="w-4 h-4" />
            <span className="text-sm font-medium">미리보기 모드</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/se2/${dbDocument.id}/edit`}
              className="text-sm underline underline-offset-2"
            >
              편집하기
            </Link>
            <span className="text-xs px-2 py-0.5 bg-black/20 rounded">
              {dbDocument.status === 'published' ? '공개됨' : '비공개'}
            </span>
          </div>
        </div>
      </div>

      {/* 컨텐츠 (배너 높이만큼 패딩) */}
      <div className="pt-10">
        <DocumentProvider
          document={editorDoc}
          style={resolvedStyle}
        >
          <DocumentRenderer document={editorDoc} mode="preview" />
        </DocumentProvider>
      </div>
    </div>
  )
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

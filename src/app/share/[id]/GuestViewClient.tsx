'use client'

/**
 * Super Editor v2 - Guest View Client
 *
 * 외부 공개용 청첩장 뷰어 (결제 완료 후)
 * 모바일 최적화
 */

import { useMemo } from 'react'
import type { EditorDocumentV2 } from '@/lib/super-editor-v2/schema/db-schema'
import { toEditorDocument } from '@/lib/super-editor-v2/utils/document-adapter'
import { resolveStyle } from '@/lib/super-editor-v2/renderer/style-resolver'
import { DocumentProvider } from '@/lib/super-editor-v2/context/document-context'
import { DocumentRenderer } from '@/lib/super-editor-v2/renderer/document-renderer'
import { useViewerFonts } from '@/lib/super-editor-v2/hooks/useFontLoader'

interface GuestViewClientProps {
  document: EditorDocumentV2
}

export function GuestViewClient({ document: dbDocument }: GuestViewClientProps) {
  // DB 데이터를 EditorDocument로 변환
  const editorDoc = useMemo(() => toEditorDocument(dbDocument), [dbDocument])

  // 스타일 해석
  const resolvedStyle = useMemo(
    () => resolveStyle(editorDoc.style),
    [editorDoc.style]
  )

  // 공유 모드: 현재 스타일의 폰트만 로드
  useViewerFonts(editorDoc.style)

  return (
    <div className="min-h-screen">
      <DocumentProvider
        document={editorDoc}
        style={resolvedStyle}
      >
        <DocumentRenderer document={editorDoc} mode="view" />
      </DocumentProvider>
    </div>
  )
}

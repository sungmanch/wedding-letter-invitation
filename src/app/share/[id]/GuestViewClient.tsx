'use client'

/**
 * Super Editor v2 - Guest View Client
 *
 * 외부 공개용 청첩장 뷰어 (결제 완료 후)
 *
 * 반응형 규칙:
 * - 모바일: 실제 화면 크기 사용
 * - 태블릿/데스크탑: iPhone 13 비율(390×844) 기준 최대 크기 제한
 */

import { useMemo, useState, useEffect } from 'react'
import type { EditorDocumentV2 } from '@/lib/super-editor-v2/schema/db-schema'
import { toEditorDocument } from '@/lib/super-editor-v2/utils/document-adapter'
import { resolveStyle } from '@/lib/super-editor-v2/renderer/style-resolver'
import { DocumentProvider } from '@/lib/super-editor-v2/context/document-context'
import { DocumentRenderer } from '@/lib/super-editor-v2/renderer/document-renderer'
import { useViewerFonts } from '@/lib/super-editor-v2/hooks/useFontLoader'

// iPhone 13 기준 (비율 1:2.164)
const MOBILE_BREAKPOINT = 430 // 모바일 최대 너비
const MAX_WIDTH = 390
const MAX_HEIGHT = 844
const ASPECT_RATIO = MAX_HEIGHT / MAX_WIDTH // 2.164

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

  // 클라이언트 마운트 상태
  const [isMounted, setIsMounted] = useState(false)

  // 뷰포트 크기 계산 (모바일은 실제 크기, 그 외는 제한)
  const [viewport, setViewport] = useState<{ width: number; height: number } | undefined>(undefined)
  const [isDesktopMode, setIsDesktopMode] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    function calculateViewport() {
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight

      // 모바일: 실제 화면 크기 사용
      if (screenWidth <= MOBILE_BREAKPOINT) {
        setViewport(undefined)
        setIsDesktopMode(false)
        return
      }

      // 태블릿/데스크탑: iPhone 13 비율로 제한
      let width = MAX_WIDTH
      let height = MAX_HEIGHT

      // 화면이 매우 낮은 경우 (가로 모니터 등) 높이 기준으로 조정
      if (screenHeight < MAX_HEIGHT) {
        height = screenHeight
        width = height / ASPECT_RATIO
      }

      setViewport({ width, height })
      setIsDesktopMode(true)
    }

    calculateViewport()
    window.addEventListener('resize', calculateViewport)
    return () => window.removeEventListener('resize', calculateViewport)
  }, [])

  // 데스크탑 모드에서 사용할 뷰포트 (마운트 후)
  const effectiveViewport = isMounted && isDesktopMode ? viewport : undefined

  return (
    <div className={isMounted && isDesktopMode ? 'min-h-screen bg-gray-900 flex items-center justify-center py-8' : ''}>
      <div
        className={isMounted && isDesktopMode ? 'relative rounded-3xl bg-white' : ''}
        style={effectiveViewport ? {
          width: `${effectiveViewport.width}px`,
          height: `${effectiveViewport.height}px`,
          boxShadow: '0 0 40px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        } : undefined}
      >
        <DocumentProvider
          document={editorDoc}
          style={resolvedStyle}
          viewportOverride={effectiveViewport}
        >
          <div
            className="overflow-y-auto"
            style={effectiveViewport ? { height: `${effectiveViewport.height}px` } : undefined}
          >
            <DocumentRenderer document={editorDoc} mode="view" skipProvider />
          </div>
        </DocumentProvider>
      </div>
    </div>
  )
}

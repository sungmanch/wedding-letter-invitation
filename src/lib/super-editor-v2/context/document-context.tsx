'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react'
import type {
  EditorDocument,
  WeddingData,
  GlobalAnimation,
  Block,
} from '../schema/types'
import type { ResolvedStyle } from '../renderer/style-resolver'

// ============================================
// Types
// ============================================

export interface ViewportInfo {
  width: number
  height: number
  isDesktop: boolean
  isMobile: boolean
}

export interface DocumentContextValue {
  // 문서 데이터
  document: EditorDocument
  data: WeddingData
  blocks: Block[]

  // 전역 스타일 (해석된 결과)
  style: ResolvedStyle

  // 전역 애니메이션 설정
  animation: GlobalAnimation

  // 공유 상태 (애니메이션 간 통신)
  sharedState: Record<string, unknown>
  setSharedState: (key: string, value: unknown) => void

  // 뷰포트 정보
  viewport: ViewportInfo

  // 활성 블록 (편집 모드에서 선택된 블록)
  activeBlockId: string | null
  setActiveBlockId: (id: string | null) => void

  // 문서 업데이트 콜백 (편집 모드용)
  onUpdateBlocks?: (blocks: Block[]) => void
  onUpdateData?: (data: WeddingData) => void
  onUpdateStyle?: (style: ResolvedStyle) => void
}

// ============================================
// Context
// ============================================

const DocumentContext = createContext<DocumentContextValue | null>(null)

// ============================================
// Hook
// ============================================

export function useDocument(): DocumentContextValue {
  const ctx = useContext(DocumentContext)
  if (!ctx) {
    throw new Error('useDocument must be used within DocumentProvider')
  }
  return ctx
}

/**
 * 특정 데이터만 선택적으로 가져오기 (리렌더 최적화)
 */
export function useDocumentData(): WeddingData {
  const { data } = useDocument()
  return data
}

export function useDocumentBlocks(): Block[] {
  const { blocks } = useDocument()
  return blocks
}

export function useDocumentStyle(): ResolvedStyle {
  const { style } = useDocument()
  return style
}

export function useViewport(): ViewportInfo {
  const { viewport } = useDocument()
  return viewport
}

// ============================================
// Provider
// ============================================

interface DocumentProviderProps {
  children: ReactNode
  document: EditorDocument
  style: ResolvedStyle
  // 가상 뷰포트 크기 (프리뷰용)
  viewportOverride?: { width: number; height: number }
  // 편집 모드 콜백
  onUpdateBlocks?: (blocks: Block[]) => void
  onUpdateData?: (data: WeddingData) => void
  onUpdateStyle?: (style: ResolvedStyle) => void
}

export function DocumentProvider({
  children,
  document,
  style,
  viewportOverride,
  onUpdateBlocks,
  onUpdateData,
  onUpdateStyle,
}: DocumentProviderProps) {
  // 공유 상태
  const [sharedState, setSharedStateMap] = useState<Record<string, unknown>>({})
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // SSR 기본값 (iPhone 13 기준)
  const SSR_DEFAULT: ViewportInfo = {
    width: viewportOverride?.width ?? 390,
    height: viewportOverride?.height ?? 844,
    isDesktop: false,
    isMobile: true,
  }

  // 뷰포트 정보 - 초기값은 항상 SSR 기본값
  const [viewport, setViewport] = useState<ViewportInfo>(SSR_DEFAULT)

  // 클라이언트 마운트 후 실제 뷰포트로 업데이트
  useEffect(() => {
    setIsMounted(true)

    if (viewportOverride) {
      setViewport({
        width: viewportOverride.width,
        height: viewportOverride.height,
        isDesktop: false,
        isMobile: true,
      })
    } else {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        isDesktop: window.innerWidth >= 1024,
        isMobile: window.innerWidth < 768,
      })
    }
  }, [viewportOverride?.width, viewportOverride?.height])

  // 뷰포트 리사이즈 핸들링 (viewportOverride가 없을 때만)
  useEffect(() => {
    if (!isMounted || viewportOverride) return

    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        isDesktop: window.innerWidth >= 1024,
        isMobile: window.innerWidth < 768,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMounted, viewportOverride])

  // 공유 상태 업데이트
  const setSharedState = useCallback((key: string, value: unknown) => {
    setSharedStateMap(prev => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  // 컨텍스트 값 메모이제이션
  const value = useMemo<DocumentContextValue>(() => ({
    document,
    data: document.data,
    blocks: document.blocks,
    style,
    animation: document.animation,
    sharedState,
    setSharedState,
    viewport,
    activeBlockId,
    setActiveBlockId,
    onUpdateBlocks,
    onUpdateData,
    onUpdateStyle,
  }), [
    document,
    style,
    sharedState,
    setSharedState,
    viewport,
    activeBlockId,
    onUpdateBlocks,
    onUpdateData,
    onUpdateStyle,
  ])

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  )
}

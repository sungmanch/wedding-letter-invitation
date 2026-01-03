'use client'

/**
 * Document Renderer - 최상위 렌더러
 *
 * EditorDocument를 받아서 전체 청첩장을 렌더링
 * Context Provider들을 설정하고 블록들을 순서대로 렌더링
 */

import { useMemo } from 'react'
import type { EditorDocument } from '../schema/types'
import { DocumentProvider } from '../context/document-context'
import { AnimationProvider } from '../context/animation-context'
import { resolveStyle, styleToCSSVariables, type ResolvedStyle } from './style-resolver'
import { BlockRenderer } from './block-renderer'
import { FloatingRenderer } from './floating-renderer'

// ============================================
// Types
// ============================================

export interface DocumentRendererProps {
  document: EditorDocument
  // 편집 모드 (선택 및 수정 가능)
  editable?: boolean
  // 렌더링 모드
  mode?: 'view' | 'preview' | 'edit'
  // 블록 클릭 콜백 (편집 모드용)
  onBlockClick?: (blockId: string) => void
  // 요소 클릭 콜백 (편집 모드용)
  onElementClick?: (blockId: string, elementId: string) => void
  // 추가 className
  className?: string
  // 외부 DocumentProvider 사용 시 true (내부 Provider 스킵)
  skipProvider?: boolean
  // 가상 뷰포트 크기 (프리뷰/썸네일용)
  viewportOverride?: { width: number; height: number }
}

// ============================================
// Component
// ============================================

export function DocumentRenderer({
  document,
  editable = false,
  mode = 'view',
  onBlockClick,
  onElementClick,
  className = '',
  skipProvider = false,
  viewportOverride,
}: DocumentRendererProps) {
  // 스타일 해석
  const resolvedStyle = useMemo<ResolvedStyle>(
    () => resolveStyle(document.style),
    [document.style]
  )

  // CSS 변수 생성
  const cssVariables = useMemo(
    () => styleToCSSVariables(resolvedStyle),
    [resolvedStyle]
  )

  // 활성화된 블록만 필터링
  const enabledBlocks = useMemo(
    () => document.blocks.filter(block => block.enabled),
    [document.blocks]
  )

  // 플로팅 요소들
  const floatingElements = document.animation.floatingElements ?? []

  // 내부 콘텐츠
  const content = (
    <AnimationProvider config={document.animation}>
      <div
        className={`se2-document ${className}`}
        style={{
          ...cssVariables,
          backgroundColor: 'var(--bg-page)',
          color: 'var(--fg-default)',
          fontFamily: 'var(--font-body)',
          minHeight: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
        data-mode={mode}
        data-editable={editable}
      >
        {/* 블록 렌더링 */}
        <div className="se2-blocks">
          {enabledBlocks.map((block, index) => (
            <BlockRenderer
              key={block.id}
              block={block}
              blockIndex={index}
              editable={editable}
              onBlockClick={onBlockClick}
              onElementClick={onElementClick}
            />
          ))}
        </div>

        {/* Credit - 항상 맨 아래에 표시 */}
        <div
          className="se2-credit"
          style={{
            padding: '24px 0 40px',
            textAlign: 'center',
            fontFamily: 'var(--font-display)',
            fontSize: '14px',
            fontWeight: 400,
            color: 'var(--fg-muted)',
            letterSpacing: '1px',
          }}
        >
          maison de letter
        </div>

        {/* 플로팅 요소 렌더링 */}
        {floatingElements.length > 0 && (
          <FloatingRenderer elements={floatingElements} />
        )}

        {/* 편집 모드 오버레이 */}
        {editable && mode === 'edit' && (
          <div
            className="se2-edit-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              zIndex: 9999,
            }}
          />
        )}
      </div>
    </AnimationProvider>
  )

  // skipProvider가 true면 Provider 없이 렌더링
  if (skipProvider) {
    return content
  }

  return (
    <DocumentProvider
      document={document}
      style={resolvedStyle}
      viewportOverride={viewportOverride}
    >
      {content}
    </DocumentProvider>
  )
}

// ============================================
// Static HTML Renderer (SSR용)
// ============================================

export interface StaticDocumentRendererProps {
  document: EditorDocument
  className?: string
}

/**
 * 정적 HTML 렌더링용 (SSR, 빌드)
 * Context와 애니메이션 없이 순수 HTML만 출력
 */
export function StaticDocumentRenderer({
  document,
  className = '',
}: StaticDocumentRendererProps) {
  // 스타일 해석
  const resolvedStyle = resolveStyle(document.style)
  const cssVariables = styleToCSSVariables(resolvedStyle)

  // 활성화된 블록만
  const enabledBlocks = document.blocks.filter(block => block.enabled)

  return (
    <div
      className={`se2-document se2-static ${className}`}
      style={{
        ...cssVariables,
        backgroundColor: 'var(--bg-page)',
        color: 'var(--fg-default)',
        fontFamily: 'var(--font-body)',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {enabledBlocks.map((block, index) => (
        <StaticBlockRenderer
          key={block.id}
          block={block}
          blockIndex={index}
          data={document.data}
          style={resolvedStyle}
        />
      ))}

      {/* Credit - 항상 맨 아래에 표시 */}
      <div
        className="se2-credit"
        style={{
          padding: '24px 0 40px',
          textAlign: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: '14px',
          fontWeight: 400,
          color: 'var(--fg-muted)',
          letterSpacing: '1px',
        }}
      >
        maison de letter
      </div>
    </div>
  )
}

// 간단한 정적 블록 렌더러 (별도 파일로 분리 가능)
import type { Block, WeddingData } from '../schema/types'

interface StaticBlockRendererProps {
  block: Block
  blockIndex: number
  data: WeddingData
  style: ResolvedStyle
}

function StaticBlockRenderer({
  block,
  blockIndex,
  data,
  style,
}: StaticBlockRendererProps) {
  // 블록별 토큰 가져오기
  const tokens = style.blockOverrides.get(block.id) ?? style.tokens

  return (
    <section
      className={`se2-block se2-block--${block.type}`}
      data-block-id={block.id}
      data-block-index={blockIndex}
      style={{
        minHeight: `${block.height}vh`,
        position: 'relative',
        backgroundColor: tokens.bgSection,
      }}
    >
      {/* 정적 렌더링에서는 요소를 간단하게 렌더링 */}
      {block.elements.map(element => (
        <div
          key={element.id}
          className={`se2-element se2-element--${element.type}`}
          data-element-id={element.id}
          style={{
            position: 'absolute',
            left: `${element.x}vw`,
            top: `${element.y}vh`,
            width: `${element.width}vw`,
            height: `${element.height}vh`,
            zIndex: element.zIndex,
            transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
          }}
        />
      ))}
    </section>
  )
}

// ============================================
// Exports
// ============================================

export { DocumentRenderer as default }

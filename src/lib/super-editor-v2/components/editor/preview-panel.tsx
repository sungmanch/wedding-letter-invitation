'use client'

/**
 * Super Editor v2 - Preview Panel
 *
 * 모바일 프리뷰 + 폰 프레임 래퍼
 * - form 모드: DocumentRenderer (읽기 전용)
 * - direct 모드: EditableCanvas (드래그/리사이즈/회전)
 */

import { useState, useMemo, useCallback, type CSSProperties, type ReactNode } from 'react'
import type { EditorDocument, Block, Element } from '../../schema/types'
import { DocumentRenderer } from '../../renderer/document-renderer'
import { EditableCanvas, type ContextMenuState } from './direct/editable-canvas'
import { EditModeToggle, CompactModeToggle, type EditMode } from './direct/edit-mode-toggle'

// ============================================
// Types
// ============================================

export interface PreviewPanelProps {
  /** 문서 데이터 */
  document: EditorDocument
  /** 편집 모드 */
  editMode?: EditMode
  /** 편집 모드 변경 콜백 */
  onEditModeChange?: (mode: EditMode) => void
  /** 선택된 블록 ID */
  selectedBlockId?: string | null
  /** 선택된 요소 ID */
  selectedElementId?: string | null
  /** 블록 클릭 콜백 */
  onBlockClick?: (blockId: string) => void
  /** 요소 클릭 콜백 */
  onElementClick?: (blockId: string, elementId: string) => void
  /** 요소 선택 콜백 */
  onElementSelect?: (elementId: string | null, blockId?: string) => void
  /** 요소 업데이트 콜백 */
  onElementUpdate?: (blockId: string, elementId: string, updates: Partial<Element>) => void
  /** 요소 삭제 콜백 */
  onElementDelete?: (blockId: string, elementId: string) => void
  /** 요소 복제 콜백 */
  onElementDuplicate?: (blockId: string, elementId: string) => void
  /** 컨텍스트 메뉴 콜백 */
  onContextMenu?: (context: ContextMenuState) => void
  /** 하이라이트할 블록 ID */
  highlightedBlockId?: string | null
  /** 폰 프레임 사용 여부 */
  withFrame?: boolean
  /** 프레임 너비 (px) */
  frameWidth?: number
  /** 프레임 높이 (px) */
  frameHeight?: number
  /** 모드 토글 표시 */
  showModeToggle?: boolean
  /** 요소 렌더러 (direct 모드용) */
  renderElement?: (element: Element, block: Block) => ReactNode
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function PreviewPanel({
  document,
  editMode: externalEditMode,
  onEditModeChange,
  selectedBlockId,
  selectedElementId,
  onBlockClick,
  onElementClick,
  onElementSelect,
  onElementUpdate,
  onElementDelete,
  onElementDuplicate,
  onContextMenu,
  highlightedBlockId,
  withFrame = true,
  frameWidth = 375,
  frameHeight = 667,
  showModeToggle = true,
  renderElement,
  className = '',
}: PreviewPanelProps) {
  // 내부 모드 상태 (외부 제어가 없을 때 사용)
  const [internalEditMode, setInternalEditMode] = useState<EditMode>('form')
  const editMode = externalEditMode ?? internalEditMode

  const handleModeChange = useCallback((mode: EditMode) => {
    if (onEditModeChange) {
      onEditModeChange(mode)
    } else {
      setInternalEditMode(mode)
    }
  }, [onEditModeChange])

  // 하이라이트 스타일
  const highlightStyle = useMemo((): CSSProperties | undefined => {
    if (!highlightedBlockId) return undefined
    return {
      '--highlight-block-id': highlightedBlockId,
    } as CSSProperties
  }, [highlightedBlockId])

  // Form 모드: 읽기 전용 프리뷰
  const formModeContent = (
    <div
      className={`se2-preview ${highlightedBlockId ? 'se2-preview--highlighting' : ''}`}
      style={highlightStyle}
    >
      <DocumentRenderer
        document={document}
        editable
        mode="edit"
        onBlockClick={onBlockClick}
        onElementClick={onElementClick}
      />

      {/* 하이라이트 오버레이 스타일 */}
      <style jsx global>{`
        .se2-preview--highlighting .se2-block {
          transition: opacity 0.2s ease;
        }

        .se2-preview--highlighting .se2-block:not([data-block-id="${highlightedBlockId}"]) {
          opacity: 0.4;
        }

        .se2-preview--highlighting .se2-block[data-block-id="${highlightedBlockId}"] {
          box-shadow: 0 0 0 2px var(--sage-500);
        }
      `}</style>
    </div>
  )

  // Direct 모드: 편집 가능한 캔버스
  const directModeContent = (
    <EditableCanvas
      document={document}
      selectedBlockId={selectedBlockId ?? null}
      selectedElementId={selectedElementId ?? null}
      onElementSelect={onElementSelect ?? (() => {})}
      onElementUpdate={onElementUpdate ?? (() => {})}
      onElementDelete={onElementDelete}
      onElementDuplicate={onElementDuplicate}
      onContextMenu={onContextMenu}
      canvasWidth={withFrame ? frameWidth - 24 : frameWidth} // 프레임 패딩 고려
      canvasHeight={withFrame ? frameHeight - 24 : frameHeight}
      renderElement={renderElement}
      showIdBadge
    />
  )

  const previewContent = editMode === 'form' ? formModeContent : directModeContent

  if (!withFrame) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        {/* 모드 토글 */}
        {showModeToggle && (
          <div className="absolute top-2 right-2 z-20">
            <CompactModeToggle
              mode={editMode}
              onChange={handleModeChange}
            />
          </div>
        )}
        <div className="w-full h-full overflow-auto">
          {previewContent}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* 모드 토글 (프레임 위) */}
      {showModeToggle && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20">
          <EditModeToggle
            mode={editMode}
            onChange={handleModeChange}
            size="sm"
          />
        </div>
      )}
      <PhoneFrame
        width={frameWidth}
        height={frameHeight}
      >
        {previewContent}
      </PhoneFrame>
    </div>
  )
}

// ============================================
// Phone Frame Component
// ============================================

interface PhoneFrameProps {
  children: React.ReactNode
  width?: number
  height?: number
  className?: string
}

function PhoneFrame({
  children,
  width = 375,
  height = 667,
  className = '',
}: PhoneFrameProps) {
  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {/* 폰 프레임 외곽 */}
      <div
        className="absolute inset-0 rounded-[40px] bg-[var(--sand-200)] shadow-2xl"
        style={{
          padding: '12px',
        }}
      >
        {/* 노치 */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[var(--text-primary)] rounded-full z-10"
        />

        {/* 스크린 영역 */}
        <div
          className="relative w-full h-full rounded-[32px] overflow-hidden bg-white"
          style={{
            // 스크롤 가능한 컨테이너
          }}
        >
          <div className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
            {children}
          </div>
        </div>
      </div>

      {/* 하단 홈 인디케이터 */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 w-32 h-1 bg-[var(--sand-100)] rounded-full"
      />
    </div>
  )
}

// ============================================
// Preview Controls (줌, 디바이스 전환 등)
// ============================================

export interface PreviewControlsProps {
  zoom: number
  onZoomChange: (zoom: number) => void
  device: 'mobile' | 'tablet'
  onDeviceChange: (device: 'mobile' | 'tablet') => void
}

export function PreviewControls({
  zoom,
  onZoomChange,
  device,
  onDeviceChange,
}: PreviewControlsProps) {
  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-white border-b border-[var(--sand-100)]">
      {/* 디바이스 전환 */}
      <div className="flex items-center gap-1 rounded-lg border border-[var(--sand-100)] overflow-hidden">
        <button
          onClick={() => onDeviceChange('mobile')}
          className={`px-3 py-1.5 text-sm transition-colors ${
            device === 'mobile'
              ? 'bg-[var(--sage-500)] text-white'
              : 'text-[var(--text-muted)] hover:bg-[var(--sage-50)]'
          }`}
        >
          <MobileIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDeviceChange('tablet')}
          className={`px-3 py-1.5 text-sm transition-colors ${
            device === 'tablet'
              ? 'bg-[var(--sage-500)] text-white'
              : 'text-[var(--text-muted)] hover:bg-[var(--sage-50)]'
          }`}
        >
          <TabletIcon className="w-4 h-4" />
        </button>
      </div>

      {/* 줌 컨트롤 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
          className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--sage-50)] rounded"
        >
          <MinusIcon className="w-4 h-4" />
        </button>
        <span className="text-sm text-[var(--text-muted)] min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => onZoomChange(Math.min(1.5, zoom + 0.1))}
          className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--sage-50)] rounded"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ============================================
// Icons
// ============================================

function MobileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="5" y="2" width="14" height="20" rx="2" strokeWidth="2" />
      <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function TabletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="2" />
      <line x1="12" y1="17" x2="12" y2="17" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    </svg>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}

// ============================================
// Exports
// ============================================

export { PhoneFrame }
export { EditModeToggle, CompactModeToggle, type EditMode }
export type { ContextMenuState }

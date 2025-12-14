'use client'

/**
 * Super Editor v2 - Preview Panel
 *
 * 모바일 프리뷰 + 폰 프레임 래퍼
 * DocumentRenderer를 감싸서 편집 모드 프리뷰 제공
 */

import { useMemo, type CSSProperties } from 'react'
import type { EditorDocument } from '../../schema/types'
import { DocumentRenderer } from '../../renderer/document-renderer'

// ============================================
// Types
// ============================================

export interface PreviewPanelProps {
  /** 문서 데이터 */
  document: EditorDocument
  /** 블록 클릭 콜백 */
  onBlockClick?: (blockId: string) => void
  /** 요소 클릭 콜백 */
  onElementClick?: (blockId: string, elementId: string) => void
  /** 하이라이트할 블록 ID */
  highlightedBlockId?: string | null
  /** 폰 프레임 사용 여부 */
  withFrame?: boolean
  /** 프레임 너비 (px) */
  frameWidth?: number
  /** 프레임 높이 (px) */
  frameHeight?: number
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function PreviewPanel({
  document,
  onBlockClick,
  onElementClick,
  highlightedBlockId,
  withFrame = true,
  frameWidth = 375,
  frameHeight = 667,
  className = '',
}: PreviewPanelProps) {
  // 하이라이트 스타일
  const highlightStyle = useMemo((): CSSProperties | undefined => {
    if (!highlightedBlockId) return undefined
    return {
      '--highlight-block-id': highlightedBlockId,
    } as CSSProperties
  }, [highlightedBlockId])

  const previewContent = (
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
          box-shadow: 0 0 0 2px #C9A962;
        }
      `}</style>
    </div>
  )

  if (!withFrame) {
    return (
      <div className={`w-full h-full overflow-auto ${className}`}>
        {previewContent}
      </div>
    )
  }

  return (
    <PhoneFrame
      width={frameWidth}
      height={frameHeight}
      className={className}
    >
      {previewContent}
    </PhoneFrame>
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
        className="absolute inset-0 rounded-[40px] bg-[#1A1A1A] shadow-2xl"
        style={{
          padding: '12px',
        }}
      >
        {/* 노치 */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#0A0806] rounded-full z-10"
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
        className="absolute bottom-5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full"
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
    <div className="flex items-center gap-4 px-4 py-2 bg-[#1A1A1A] border-b border-white/10">
      {/* 디바이스 전환 */}
      <div className="flex items-center gap-1 rounded-lg border border-white/10 overflow-hidden">
        <button
          onClick={() => onDeviceChange('mobile')}
          className={`px-3 py-1.5 text-sm transition-colors ${
            device === 'mobile'
              ? 'bg-[#C9A962] text-[#0A0806]'
              : 'text-[#F5E6D3]/60 hover:bg-white/5'
          }`}
        >
          <MobileIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDeviceChange('tablet')}
          className={`px-3 py-1.5 text-sm transition-colors ${
            device === 'tablet'
              ? 'bg-[#C9A962] text-[#0A0806]'
              : 'text-[#F5E6D3]/60 hover:bg-white/5'
          }`}
        >
          <TabletIcon className="w-4 h-4" />
        </button>
      </div>

      {/* 줌 컨트롤 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
          className="p-1.5 text-[#F5E6D3]/60 hover:text-[#F5E6D3] hover:bg-white/5 rounded"
        >
          <MinusIcon className="w-4 h-4" />
        </button>
        <span className="text-sm text-[#F5E6D3]/60 min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => onZoomChange(Math.min(1.5, zoom + 0.1))}
          className="p-1.5 text-[#F5E6D3]/60 hover:text-[#F5E6D3] hover:bg-white/5 rounded"
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

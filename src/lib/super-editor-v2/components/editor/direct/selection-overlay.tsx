'use client'

/**
 * Super Editor v2 - Selection Overlay
 *
 * 선택된 요소를 위한 오버레이
 * - 선택 영역 표시
 * - 리사이즈 핸들 통합
 * - 요소 정보 툴팁
 */

import { useMemo, type ReactNode } from 'react'
import { ResizeHandles, type Size, type Position, type HandlePosition } from './resize-handles'

// ============================================
// Types
// ============================================

export interface SelectionOverlayProps {
  /** 요소 ID */
  elementId: string
  /** 요소 타입 라벨 */
  elementType?: string
  /** 위치 */
  position: Position
  /** 크기 */
  size: Size
  /** 선택 여부 */
  isSelected: boolean
  /** 호버 여부 */
  isHovered?: boolean
  /** 잠금 여부 */
  isLocked?: boolean
  /** 크기 변경 콜백 */
  onSizeChange?: (size: Size, position: Position) => void
  /** 리사이즈 시작 콜백 */
  onResizeStart?: () => void
  /** 리사이즈 종료 콜백 */
  onResizeEnd?: () => void
  /** 리사이즈 핸들 표시 */
  showResizeHandles?: boolean
  /** 종횡비 유지 */
  keepAspectRatio?: boolean
  /** 최소 크기 */
  minSize?: Size
  /** 최대 크기 */
  maxSize?: Size
  /** 표시할 핸들 */
  handles?: HandlePosition[]
  /** 요소 정보 표시 */
  showInfo?: boolean
  /** 추가 정보 */
  additionalInfo?: ReactNode
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function SelectionOverlay({
  elementId,
  elementType,
  position,
  size,
  isSelected,
  isHovered = false,
  isLocked = false,
  onSizeChange,
  onResizeStart,
  onResizeEnd,
  showResizeHandles = true,
  keepAspectRatio = false,
  minSize,
  maxSize,
  handles,
  showInfo = true,
  additionalInfo,
  className = '',
}: SelectionOverlayProps) {
  // 테두리 색상
  const borderColor = useMemo(() => {
    if (isLocked) return 'border-yellow-500/50'
    if (isSelected) return 'border-[#C9A962]'
    if (isHovered) return 'border-[#C9A962]/50'
    return 'border-transparent'
  }, [isSelected, isHovered, isLocked])

  // 배경 색상
  const bgColor = useMemo(() => {
    if (isSelected) return 'bg-[#C9A962]/5'
    if (isHovered) return 'bg-[#C9A962]/[0.02]'
    return 'bg-transparent'
  }, [isSelected, isHovered])

  if (!isSelected && !isHovered) return null

  return (
    <div
      className={`
        absolute pointer-events-none
        ${className}
      `}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
    >
      {/* 선택 테두리 */}
      <div
        className={`
          absolute inset-0 border-2 rounded-sm
          ${borderColor} ${bgColor}
          transition-colors duration-150
        `}
      />

      {/* 리사이즈 핸들 */}
      {isSelected && showResizeHandles && !isLocked && onSizeChange && (
        <div className="pointer-events-auto">
          <ResizeHandles
            size={size}
            position={position}
            onSizeChange={onSizeChange}
            onResizeStart={onResizeStart}
            onResizeEnd={onResizeEnd}
            keepAspectRatio={keepAspectRatio}
            minSize={minSize}
            maxSize={maxSize}
            handles={handles}
          />
        </div>
      )}

      {/* 요소 정보 툴팁 */}
      {isSelected && showInfo && (
        <div
          className="
            absolute -top-7 left-0 px-2 py-0.5 rounded text-xs
            bg-[#C9A962] text-[#1a1a1a] font-medium
            whitespace-nowrap shadow-sm
          "
        >
          {elementType && <span>{elementType}</span>}
          {isLocked && (
            <span className="ml-1.5 inline-flex items-center">
              <LockIcon className="w-3 h-3" />
            </span>
          )}
        </div>
      )}

      {/* 크기 정보 */}
      {isSelected && showInfo && (
        <div
          className="
            absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs
            bg-[#2a2a2a] text-[#F5E6D3]/70 border border-white/10
            whitespace-nowrap
          "
        >
          {Math.round(size.width)} × {Math.round(size.height)}
        </div>
      )}

      {/* 추가 정보 */}
      {isSelected && additionalInfo && (
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          {additionalInfo}
        </div>
      )}
    </div>
  )
}

// ============================================
// Multi-Selection Overlay
// ============================================

export interface MultiSelectionOverlayProps {
  /** 선택된 요소들의 바운딩 박스 */
  bounds: {
    minX: number
    minY: number
    maxX: number
    maxY: number
  }
  /** 선택된 요소 수 */
  count: number
  /** 추가 className */
  className?: string
}

export function MultiSelectionOverlay({
  bounds,
  count,
  className = '',
}: MultiSelectionOverlayProps) {
  const width = bounds.maxX - bounds.minX
  const height = bounds.maxY - bounds.minY

  return (
    <div
      className={`
        absolute pointer-events-none
        ${className}
      `}
      style={{
        left: bounds.minX,
        top: bounds.minY,
        width,
        height,
      }}
    >
      {/* 그룹 테두리 */}
      <div
        className="
          absolute inset-0 border-2 border-dashed border-[#C9A962]/70
          bg-[#C9A962]/5 rounded
        "
      />

      {/* 선택 수 표시 */}
      <div
        className="
          absolute -top-7 left-0 px-2 py-0.5 rounded text-xs
          bg-[#C9A962] text-[#1a1a1a] font-medium
          whitespace-nowrap shadow-sm
        "
      >
        {count}개 선택됨
      </div>
    </div>
  )
}

// ============================================
// Selection Box (마우스 드래그 선택)
// ============================================

export interface SelectionBoxProps {
  /** 시작 위치 */
  start: Position
  /** 현재 위치 */
  current: Position
  /** 추가 className */
  className?: string
}

export function SelectionBox({
  start,
  current,
  className = '',
}: SelectionBoxProps) {
  const left = Math.min(start.x, current.x)
  const top = Math.min(start.y, current.y)
  const width = Math.abs(current.x - start.x)
  const height = Math.abs(current.y - start.y)

  return (
    <div
      className={`
        absolute pointer-events-none
        border border-[#C9A962] bg-[#C9A962]/10
        ${className}
      `}
      style={{
        left,
        top,
        width,
        height,
      }}
    />
  )
}

// ============================================
// Icons
// ============================================

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}

'use client'

/**
 * Super Editor v2 - Draggable Element
 *
 * 드래그 가능한 요소 래퍼
 * - 요소 선택 및 드래그 이동
 * - 위치 업데이트 콜백
 */

import {
  useCallback,
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type MouseEvent,
  type TouchEvent,
} from 'react'

// ============================================
// Types
// ============================================

export interface Position {
  x: number
  y: number
}

export interface DraggableElementProps {
  /** 자식 요소 */
  children: ReactNode
  /** 요소 ID */
  elementId: string
  /** 현재 위치 */
  position: Position
  /** 위치 변경 콜백 */
  onPositionChange: (id: string, position: Position) => void
  /** 선택 콜백 */
  onSelect?: (id: string) => void
  /** 선택 여부 */
  isSelected?: boolean
  /** 드래그 비활성화 */
  disabled?: boolean
  /** 그리드 스냅 (px) */
  gridSnap?: number
  /** 드래그 영역 제한 */
  bounds?: {
    minX?: number
    maxX?: number
    minY?: number
    maxY?: number
  }
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function DraggableElement({
  children,
  elementId,
  position,
  onPositionChange,
  onSelect,
  isSelected = false,
  disabled = false,
  gridSnap,
  bounds,
  className = '',
}: DraggableElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Position | null>(null)
  const [initialPosition, setInitialPosition] = useState<Position | null>(null)

  // 그리드 스냅 적용
  const snapToGrid = useCallback((value: number): number => {
    if (!gridSnap) return value
    return Math.round(value / gridSnap) * gridSnap
  }, [gridSnap])

  // 범위 제한 적용
  const clampPosition = useCallback((pos: Position): Position => {
    if (!bounds) return pos
    return {
      x: Math.max(bounds.minX ?? -Infinity, Math.min(bounds.maxX ?? Infinity, pos.x)),
      y: Math.max(bounds.minY ?? -Infinity, Math.min(bounds.maxY ?? Infinity, pos.y)),
    }
  }, [bounds])

  // 마우스 다운
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (disabled) return

    // 왼쪽 클릭만 허용
    if (e.button !== 0) return

    e.preventDefault()
    e.stopPropagation()

    onSelect?.(elementId)
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setInitialPosition(position)
  }, [disabled, elementId, position, onSelect])

  // 터치 시작
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled) return

    const touch = e.touches[0]
    if (!touch) return

    e.stopPropagation()

    onSelect?.(elementId)
    setIsDragging(true)
    setDragStart({ x: touch.clientX, y: touch.clientY })
    setInitialPosition(position)
  }, [disabled, elementId, position, onSelect])

  // 드래그 이동 처리
  useEffect(() => {
    if (!isDragging || !dragStart || !initialPosition) return

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y

      const newPosition = clampPosition({
        x: snapToGrid(initialPosition.x + deltaX),
        y: snapToGrid(initialPosition.y + deltaY),
      })

      onPositionChange(elementId, newPosition)
    }

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return

      const deltaX = touch.clientX - dragStart.x
      const deltaY = touch.clientY - dragStart.y

      const newPosition = clampPosition({
        x: snapToGrid(initialPosition.x + deltaX),
        y: snapToGrid(initialPosition.y + deltaY),
      })

      onPositionChange(elementId, newPosition)
    }

    const handleEnd = () => {
      setIsDragging(false)
      setDragStart(null)
      setInitialPosition(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleEnd)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, dragStart, initialPosition, elementId, onPositionChange, snapToGrid, clampPosition])

  // 클릭 (선택만)
  const handleClick = useCallback((e: MouseEvent) => {
    e.stopPropagation()
    if (!isDragging) {
      onSelect?.(elementId)
    }
  }, [isDragging, elementId, onSelect])

  return (
    <div
      ref={elementRef}
      className={`
        absolute select-none
        ${isDragging ? 'cursor-grabbing z-50' : 'cursor-grab'}
        ${isSelected ? 'ring-2 ring-[#C9A962] ring-offset-2 ring-offset-transparent' : ''}
        ${disabled ? 'cursor-default pointer-events-none' : ''}
        ${className}
      `}
      style={{
        left: position.x,
        top: position.y,
        touchAction: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}

// ============================================
// Hook: useDraggable
// ============================================

export interface UseDraggableOptions {
  initialPosition?: Position
  gridSnap?: number
  bounds?: DraggableElementProps['bounds']
  onDragStart?: () => void
  onDragEnd?: (position: Position) => void
}

export function useDraggable(options: UseDraggableOptions = {}) {
  const {
    initialPosition = { x: 0, y: 0 },
    gridSnap,
    bounds,
    onDragStart,
    onDragEnd,
  } = options

  const [position, setPosition] = useState<Position>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)

  const handlePositionChange = useCallback((_id: string, newPosition: Position) => {
    setPosition(newPosition)
  }, [])

  const startDrag = useCallback(() => {
    setIsDragging(true)
    onDragStart?.()
  }, [onDragStart])

  const endDrag = useCallback(() => {
    setIsDragging(false)
    onDragEnd?.(position)
  }, [onDragEnd, position])

  return {
    position,
    setPosition,
    isDragging,
    startDrag,
    endDrag,
    handlePositionChange,
    gridSnap,
    bounds,
  }
}

'use client'

/**
 * Super Editor v2 - Resize Handles
 *
 * 요소 크기 조절 핸들
 * - 8방향 리사이즈 핸들
 * - 종횡비 유지 옵션
 * - 최소/최대 크기 제한
 */

import {
  useCallback,
  useState,
  useEffect,
  type MouseEvent,
  type TouchEvent,
} from 'react'

// ============================================
// Types
// ============================================

export interface Size {
  width: number
  height: number
}

export interface Position {
  x: number
  y: number
}

export type HandlePosition =
  | 'n' | 's' | 'e' | 'w'
  | 'ne' | 'nw' | 'se' | 'sw'

export interface ResizeHandlesProps {
  /** 현재 크기 */
  size: Size
  /** 현재 위치 */
  position: Position
  /** 크기 변경 콜백 */
  onSizeChange: (size: Size, position: Position) => void
  /** 리사이즈 시작 콜백 */
  onResizeStart?: () => void
  /** 리사이즈 종료 콜백 */
  onResizeEnd?: () => void
  /** 종횡비 유지 */
  keepAspectRatio?: boolean
  /** 최소 크기 */
  minSize?: Size
  /** 최대 크기 */
  maxSize?: Size
  /** 표시할 핸들 */
  handles?: HandlePosition[]
  /** 비활성화 */
  disabled?: boolean
  /** 핸들 크기 */
  handleSize?: number
  /** 추가 className */
  className?: string
}

// ============================================
// Constants
// ============================================

const DEFAULT_HANDLES: HandlePosition[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']
const DEFAULT_MIN_SIZE: Size = { width: 20, height: 20 }
const DEFAULT_HANDLE_SIZE = 8

const CURSOR_MAP: Record<HandlePosition, string> = {
  n: 'ns-resize',
  s: 'ns-resize',
  e: 'ew-resize',
  w: 'ew-resize',
  ne: 'nesw-resize',
  sw: 'nesw-resize',
  nw: 'nwse-resize',
  se: 'nwse-resize',
}

// ============================================
// Component
// ============================================

export function ResizeHandles({
  size,
  position,
  onSizeChange,
  onResizeStart,
  onResizeEnd,
  keepAspectRatio = false,
  minSize = DEFAULT_MIN_SIZE,
  maxSize,
  handles = DEFAULT_HANDLES,
  disabled = false,
  handleSize = DEFAULT_HANDLE_SIZE,
  className = '',
}: ResizeHandlesProps) {
  const [activeHandle, setActiveHandle] = useState<HandlePosition | null>(null)
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null)
  const [startSize, setStartSize] = useState<Size | null>(null)
  const [startPosition, setStartPosition] = useState<Position | null>(null)

  // 핸들 위치 계산
  const getHandleStyle = useCallback((handle: HandlePosition): React.CSSProperties => {
    const half = handleSize / 2
    const base: React.CSSProperties = {
      position: 'absolute',
      width: handleSize,
      height: handleSize,
      backgroundColor: '#C9A962',
      border: '1px solid #1a1a1a',
      borderRadius: 2,
      cursor: CURSOR_MAP[handle],
      zIndex: 10,
    }

    switch (handle) {
      case 'n':
        return { ...base, top: -half, left: '50%', transform: 'translateX(-50%)' }
      case 's':
        return { ...base, bottom: -half, left: '50%', transform: 'translateX(-50%)' }
      case 'e':
        return { ...base, right: -half, top: '50%', transform: 'translateY(-50%)' }
      case 'w':
        return { ...base, left: -half, top: '50%', transform: 'translateY(-50%)' }
      case 'ne':
        return { ...base, top: -half, right: -half }
      case 'nw':
        return { ...base, top: -half, left: -half }
      case 'se':
        return { ...base, bottom: -half, right: -half }
      case 'sw':
        return { ...base, bottom: -half, left: -half }
      default:
        return base
    }
  }, [handleSize])

  // 리사이즈 시작
  const handleStart = useCallback((handle: HandlePosition, clientX: number, clientY: number) => {
    if (disabled) return

    setActiveHandle(handle)
    setStartPoint({ x: clientX, y: clientY })
    setStartSize(size)
    setStartPosition(position)
    onResizeStart?.()
  }, [disabled, size, position, onResizeStart])

  const handleMouseDown = useCallback((handle: HandlePosition) => (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleStart(handle, e.clientX, e.clientY)
  }, [handleStart])

  const handleTouchStart = useCallback((handle: HandlePosition) => (e: TouchEvent) => {
    e.stopPropagation()
    const touch = e.touches[0]
    if (touch) {
      handleStart(handle, touch.clientX, touch.clientY)
    }
  }, [handleStart])

  // 리사이즈 처리
  useEffect(() => {
    if (!activeHandle || !startPoint || !startSize || !startPosition) return

    const calculateResize = (clientX: number, clientY: number) => {
      const deltaX = clientX - startPoint.x
      const deltaY = clientY - startPoint.y

      let newWidth = startSize.width
      let newHeight = startSize.height
      let newX = startPosition.x
      let newY = startPosition.y

      // 방향에 따른 크기/위치 계산
      if (activeHandle.includes('e')) {
        newWidth = startSize.width + deltaX
      }
      if (activeHandle.includes('w')) {
        newWidth = startSize.width - deltaX
        newX = startPosition.x + deltaX
      }
      if (activeHandle.includes('s')) {
        newHeight = startSize.height + deltaY
      }
      if (activeHandle.includes('n')) {
        newHeight = startSize.height - deltaY
        newY = startPosition.y + deltaY
      }

      // 종횡비 유지
      if (keepAspectRatio && startSize.width > 0 && startSize.height > 0) {
        const aspectRatio = startSize.width / startSize.height

        if (activeHandle === 'e' || activeHandle === 'w') {
          newHeight = newWidth / aspectRatio
        } else if (activeHandle === 'n' || activeHandle === 's') {
          newWidth = newHeight * aspectRatio
        } else {
          // 코너 핸들: 더 큰 변화에 맞춤
          const widthRatio = newWidth / startSize.width
          const heightRatio = newHeight / startSize.height

          if (Math.abs(widthRatio - 1) > Math.abs(heightRatio - 1)) {
            newHeight = newWidth / aspectRatio
          } else {
            newWidth = newHeight * aspectRatio
          }
        }

        // 위치 보정 (n, w 방향)
        if (activeHandle.includes('n')) {
          newY = startPosition.y + (startSize.height - newHeight)
        }
        if (activeHandle.includes('w')) {
          newX = startPosition.x + (startSize.width - newWidth)
        }
      }

      // 최소/최대 크기 제한
      newWidth = Math.max(minSize.width, newWidth)
      newHeight = Math.max(minSize.height, newHeight)

      if (maxSize) {
        newWidth = Math.min(maxSize.width, newWidth)
        newHeight = Math.min(maxSize.height, newHeight)
      }

      // 위치 보정 (크기 제한으로 인한)
      if (activeHandle.includes('w') && newWidth === minSize.width) {
        newX = startPosition.x + startSize.width - minSize.width
      }
      if (activeHandle.includes('n') && newHeight === minSize.height) {
        newY = startPosition.y + startSize.height - minSize.height
      }

      onSizeChange(
        { width: newWidth, height: newHeight },
        { x: newX, y: newY }
      )
    }

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      calculateResize(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      const touch = e.touches[0]
      if (touch) {
        calculateResize(touch.clientX, touch.clientY)
      }
    }

    const handleEnd = () => {
      setActiveHandle(null)
      setStartPoint(null)
      setStartSize(null)
      setStartPosition(null)
      onResizeEnd?.()
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
  }, [activeHandle, startPoint, startSize, startPosition, keepAspectRatio, minSize, maxSize, onSizeChange, onResizeEnd])

  if (disabled) return null

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: size.width, height: size.height }}
    >
      {handles.map((handle) => (
        <div
          key={handle}
          style={getHandleStyle(handle)}
          className="pointer-events-auto"
          onMouseDown={handleMouseDown(handle)}
          onTouchStart={handleTouchStart(handle)}
        />
      ))}
    </div>
  )
}

// ============================================
// Hook: useResizable
// ============================================

export interface UseResizableOptions {
  initialSize?: Size
  initialPosition?: Position
  keepAspectRatio?: boolean
  minSize?: Size
  maxSize?: Size
  onResize?: (size: Size, position: Position) => void
}

export function useResizable(options: UseResizableOptions = {}) {
  const {
    initialSize = { width: 100, height: 100 },
    initialPosition = { x: 0, y: 0 },
    keepAspectRatio = false,
    minSize,
    maxSize,
    onResize,
  } = options

  const [size, setSize] = useState<Size>(initialSize)
  const [position, setPosition] = useState<Position>(initialPosition)
  const [isResizing, setIsResizing] = useState(false)

  const handleSizeChange = useCallback((newSize: Size, newPosition: Position) => {
    setSize(newSize)
    setPosition(newPosition)
    onResize?.(newSize, newPosition)
  }, [onResize])

  return {
    size,
    setSize,
    position,
    setPosition,
    isResizing,
    setIsResizing,
    handleSizeChange,
    keepAspectRatio,
    minSize,
    maxSize,
  }
}

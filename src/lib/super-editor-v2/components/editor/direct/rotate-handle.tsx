'use client'

/**
 * Super Editor v2 - Rotate Handle
 *
 * 요소 회전 핸들
 * - 상단 중앙에 회전 핸들 표시
 * - 드래그로 회전 각도 조절
 * - Shift 키로 15도 단위 스냅
 */

import {
  useCallback,
  useState,
  useEffect,
  useRef,
  type MouseEvent,
  type TouchEvent,
} from 'react'

// ============================================
// Types
// ============================================

export interface RotateHandleProps {
  /** 현재 회전 각도 (degrees) */
  rotation: number
  /** 회전 변경 콜백 */
  onRotationChange: (rotation: number) => void
  /** 회전 시작 콜백 */
  onRotateStart?: () => void
  /** 회전 종료 콜백 */
  onRotateEnd?: () => void
  /** 요소 중심점 (상대 좌표) */
  center: { x: number; y: number }
  /** 스냅 각도 (degrees, 기본 15) */
  snapAngle?: number
  /** 핸들과 요소 사이 거리 */
  handleOffset?: number
  /** 핸들 크기 */
  handleSize?: number
  /** 비활성화 */
  disabled?: boolean
  /** 추가 className */
  className?: string
}

// ============================================
// Constants
// ============================================

const DEFAULT_SNAP_ANGLE = 15
const DEFAULT_HANDLE_OFFSET = 24
const DEFAULT_HANDLE_SIZE = 10

// ============================================
// Component
// ============================================

export function RotateHandle({
  rotation,
  onRotationChange,
  onRotateStart,
  onRotateEnd,
  center,
  snapAngle = DEFAULT_SNAP_ANGLE,
  handleOffset = DEFAULT_HANDLE_OFFSET,
  handleSize = DEFAULT_HANDLE_SIZE,
  disabled = false,
  className = '',
}: RotateHandleProps) {
  const [isRotating, setIsRotating] = useState(false)
  const [startAngle, setStartAngle] = useState(0)
  const [initialRotation, setInitialRotation] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // 각도 계산 (중심점 기준)
  const calculateAngle = useCallback((clientX: number, clientY: number): number => {
    if (!containerRef.current) return 0

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + center.x
    const centerY = rect.top + center.y

    const dx = clientX - centerX
    const dy = clientY - centerY

    // atan2는 -PI ~ PI 반환, degrees로 변환
    let angle = Math.atan2(dy, dx) * (180 / Math.PI)
    // 상단이 0도가 되도록 90도 보정
    angle = angle + 90

    return angle
  }, [center])

  // 스냅 적용
  const snapToAngle = useCallback((angle: number, shiftKey: boolean): number => {
    if (!shiftKey) return angle

    return Math.round(angle / snapAngle) * snapAngle
  }, [snapAngle])

  // 각도 정규화 (0-360)
  const normalizeAngle = useCallback((angle: number): number => {
    let normalized = angle % 360
    if (normalized < 0) normalized += 360
    return normalized
  }, [])

  // 회전 시작
  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (disabled) return

    const angle = calculateAngle(clientX, clientY)
    setStartAngle(angle)
    setInitialRotation(rotation)
    setIsRotating(true)
    onRotateStart?.()
  }, [disabled, calculateAngle, rotation, onRotateStart])

  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleStart(e.clientX, e.clientY)
  }, [handleStart])

  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.stopPropagation()
    const touch = e.touches[0]
    if (touch) {
      handleStart(touch.clientX, touch.clientY)
    }
  }, [handleStart])

  // 회전 처리
  useEffect(() => {
    if (!isRotating) return

    const handleMove = (clientX: number, clientY: number, shiftKey: boolean) => {
      const currentAngle = calculateAngle(clientX, clientY)
      const deltaAngle = currentAngle - startAngle
      let newRotation = initialRotation + deltaAngle

      // 스냅 적용
      newRotation = snapToAngle(newRotation, shiftKey)
      // 정규화
      newRotation = normalizeAngle(newRotation)

      onRotationChange(newRotation)
    }

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      handleMove(e.clientX, e.clientY, e.shiftKey)
    }

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      const touch = e.touches[0]
      if (touch) {
        handleMove(touch.clientX, touch.clientY, false)
      }
    }

    const handleEnd = () => {
      setIsRotating(false)
      onRotateEnd?.()
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
  }, [
    isRotating,
    startAngle,
    initialRotation,
    calculateAngle,
    snapToAngle,
    normalizeAngle,
    onRotationChange,
    onRotateEnd,
  ])

  if (disabled) return null

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    >
      {/* 연결선 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-px bg-[#C9A962]"
        style={{
          top: -handleOffset,
          height: handleOffset,
        }}
      />

      {/* 회전 핸들 */}
      <div
        className={`
          absolute left-1/2 -translate-x-1/2 pointer-events-auto
          rounded-full bg-[#C9A962] border-2 border-[#1a1a1a]
          cursor-grab shadow-sm
          transition-transform duration-100
          hover:scale-110
          ${isRotating ? 'cursor-grabbing scale-110' : ''}
        `}
        style={{
          top: -(handleOffset + handleSize / 2),
          width: handleSize,
          height: handleSize,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* 회전 아이콘 */}
        <RotateIcon className="w-full h-full p-0.5 text-[#1a1a1a]" />
      </div>

      {/* 회전 각도 표시 (회전 중일 때만) */}
      {isRotating && (
        <div
          className="
            absolute left-1/2 -translate-x-1/2 px-2 py-0.5
            bg-[#2a2a2a] border border-white/10 rounded text-xs
            text-[#F5E6D3] whitespace-nowrap shadow-lg
          "
          style={{
            top: -(handleOffset + handleSize + 24),
          }}
        >
          {Math.round(rotation)}°
        </div>
      )}
    </div>
  )
}

// ============================================
// Hook: useRotatable
// ============================================

export interface UseRotatableOptions {
  initialRotation?: number
  snapAngle?: number
  onRotate?: (rotation: number) => void
}

export function useRotatable(options: UseRotatableOptions = {}) {
  const {
    initialRotation = 0,
    snapAngle = DEFAULT_SNAP_ANGLE,
    onRotate,
  } = options

  const [rotation, setRotation] = useState(initialRotation)
  const [isRotating, setIsRotating] = useState(false)

  const handleRotationChange = useCallback((newRotation: number) => {
    setRotation(newRotation)
    onRotate?.(newRotation)
  }, [onRotate])

  const startRotate = useCallback(() => {
    setIsRotating(true)
  }, [])

  const endRotate = useCallback(() => {
    setIsRotating(false)
  }, [])

  return {
    rotation,
    setRotation,
    isRotating,
    handleRotationChange,
    startRotate,
    endRotate,
    snapAngle,
  }
}

// ============================================
// Icons
// ============================================

function RotateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  )
}

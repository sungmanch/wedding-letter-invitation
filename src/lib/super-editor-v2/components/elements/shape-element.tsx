'use client'

/**
 * Shape Element - 도형 요소
 *
 * 사각형, 원, 라인, 하트, 커스텀 SVG 렌더링
 */

import { useMemo, type CSSProperties } from 'react'
import type { ElementStyle } from '../../schema/types'

// ============================================
// Types
// ============================================

export interface ShapeElementProps {
  shape: 'rectangle' | 'circle' | 'line' | 'heart' | 'custom'
  fill?: string
  stroke?: string
  strokeWidth?: number
  svgPath?: string
  style?: ElementStyle
  className?: string
}

// ============================================
// Component
// ============================================

export function ShapeElement({
  shape,
  fill = 'transparent',
  stroke = 'var(--border-default)',
  strokeWidth = 1,
  svgPath,
  style,
  className = '',
}: ShapeElementProps) {
  const containerStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // 스타일 적용: background, opacity, borderRadius, filter
    backgroundColor: style?.background || undefined,
    opacity: style?.opacity,
    borderRadius: style?.border?.radius ? `${style.border.radius}px` : undefined,
    filter: style?.filter,
  }

  return (
    <div
      className={`se2-shape-element se2-shape-element--${shape} ${className}`}
      style={containerStyle}
    >
      <ShapeRenderer
        shape={shape}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        svgPath={svgPath}
      />
    </div>
  )
}

// ============================================
// Shape Renderer
// ============================================

interface ShapeRendererProps {
  shape: ShapeElementProps['shape']
  fill: string
  stroke: string
  strokeWidth: number
  svgPath?: string
}

function ShapeRenderer({
  shape,
  fill,
  stroke,
  strokeWidth,
  svgPath,
}: ShapeRendererProps) {
  const svgStyle: CSSProperties = {
    width: '100%',
    height: '100%',
  }

  switch (shape) {
    case 'rectangle':
      return (
        <svg viewBox="0 0 100 100" style={svgStyle} preserveAspectRatio="none">
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={100 - strokeWidth}
            height={100 - strokeWidth}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </svg>
      )

    case 'circle':
      return (
        <svg viewBox="0 0 100 100" style={svgStyle}>
          <circle
            cx="50"
            cy="50"
            r={50 - strokeWidth / 2}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </svg>
      )

    case 'line':
      return (
        <svg viewBox="0 0 100 10" style={svgStyle} preserveAspectRatio="none">
          <line
            x1="0"
            y1="5"
            x2="100"
            y2="5"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </svg>
      )

    case 'heart':
      return (
        <svg viewBox="0 0 24 24" style={svgStyle}>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </svg>
      )

    case 'custom':
      if (!svgPath) {
        return (
          <div style={{ color: 'var(--fg-muted)', fontSize: '12px' }}>
            SVG path가 필요합니다
          </div>
        )
      }
      return (
        <svg viewBox="0 0 100 100" style={svgStyle}>
          <path
            d={svgPath}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </svg>
      )

    default:
      return null
  }
}

// ============================================
// Exports
// ============================================

export { ShapeElement as default }

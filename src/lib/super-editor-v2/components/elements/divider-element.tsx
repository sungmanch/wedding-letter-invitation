'use client'

/**
 * Divider Element - 구분선 요소
 *
 * 실선, 점선, 장식 구분선 렌더링
 */

import { useMemo, type CSSProperties, type ReactNode } from 'react'
import type { ElementStyle } from '../../schema/types'

// ============================================
// Types
// ============================================

export interface DividerElementProps {
  dividerStyle: 'solid' | 'dashed' | 'dotted' | 'ornament'
  ornamentId?: string
  style?: ElementStyle
  className?: string
}

// ============================================
// Ornament Map
// ============================================

const ORNAMENTS: Record<string, ReactNode> = {
  // 기본 장식
  'line-dots': (
    <svg viewBox="0 0 200 20" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="10" x2="80" y2="10" stroke="currentColor" strokeWidth="1" />
      <circle cx="90" cy="10" r="3" fill="currentColor" />
      <circle cx="100" cy="10" r="4" fill="currentColor" />
      <circle cx="110" cy="10" r="3" fill="currentColor" />
      <line x1="120" y1="10" x2="200" y2="10" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),

  'double-line': (
    <svg viewBox="0 0 200 20" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="8" x2="200" y2="8" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="12" x2="200" y2="12" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),

  'heart-center': (
    <svg viewBox="0 0 200 24" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="12" x2="85" y2="12" stroke="currentColor" strokeWidth="1" />
      <path
        d="M100 18l-1.45-1.32C95.4 14.36 93 12.28 93 9.5 93 7.42 94.42 6 96.5 6c1.05 0 2.05.49 2.7 1.26C99.85 6.49 100.85 6 101.9 6c2.08 0 3.5 1.42 3.5 3.5 0 2.78-2.4 4.86-5.55 7.18L100 18z"
        fill="currentColor"
      />
      <line x1="115" y1="12" x2="200" y2="12" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),

  'diamond-center': (
    <svg viewBox="0 0 200 24" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="12" x2="90" y2="12" stroke="currentColor" strokeWidth="1" />
      <polygon points="100,4 108,12 100,20 92,12" fill="currentColor" />
      <line x1="110" y1="12" x2="200" y2="12" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),

  'star-center': (
    <svg viewBox="0 0 200 24" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="12" x2="88" y2="12" stroke="currentColor" strokeWidth="1" />
      <polygon
        points="100,4 102.5,9.5 108,10 104,14 105,20 100,17 95,20 96,14 92,10 97.5,9.5"
        fill="currentColor"
      />
      <line x1="112" y1="12" x2="200" y2="12" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),

  flourish: (
    <svg viewBox="0 0 200 30" preserveAspectRatio="xMidYMid meet">
      <path
        d="M0,15 Q25,5 50,15 T100,15 T150,15 T200,15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="100" cy="15" r="3" fill="currentColor" />
    </svg>
  ),

  wave: (
    <svg viewBox="0 0 200 20" preserveAspectRatio="xMidYMid meet">
      <path
        d="M0,10 Q10,5 20,10 T40,10 T60,10 T80,10 T100,10 T120,10 T140,10 T160,10 T180,10 T200,10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),

  leaves: (
    <svg viewBox="0 0 200 30" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="15" x2="70" y2="15" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="85" cy="15" rx="8" ry="5" fill="currentColor" transform="rotate(-30 85 15)" />
      <ellipse cx="100" cy="10" rx="6" ry="4" fill="currentColor" />
      <ellipse cx="100" cy="20" rx="6" ry="4" fill="currentColor" />
      <ellipse cx="115" cy="15" rx="8" ry="5" fill="currentColor" transform="rotate(30 115 15)" />
      <line x1="130" y1="15" x2="200" y2="15" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
}

// ============================================
// Component
// ============================================

export function DividerElement({
  dividerStyle,
  ornamentId = 'line-dots',
  style,
  className = '',
}: DividerElementProps) {
  const containerStyle = useMemo<CSSProperties>(() => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: style?.text?.color ?? 'var(--border-default)',
  }), [style?.text?.color])

  // 장식 스타일
  if (dividerStyle === 'ornament') {
    const ornament = ORNAMENTS[ornamentId] ?? ORNAMENTS['line-dots']

    return (
      <div
        className={`se2-divider-element se2-divider-element--ornament ${className}`}
        style={containerStyle}
      >
        <div style={{ width: '80%', height: '100%' }}>
          {ornament}
        </div>
      </div>
    )
  }

  // 일반 라인 스타일
  const lineStyle: CSSProperties = {
    width: '100%',
    height: 0,
    borderTop: `1px ${dividerStyle} currentColor`,
  }

  return (
    <div
      className={`se2-divider-element se2-divider-element--${dividerStyle} ${className}`}
      style={containerStyle}
    >
      <div style={lineStyle} />
    </div>
  )
}

// ============================================
// Exports
// ============================================

export { DividerElement as default, ORNAMENTS }

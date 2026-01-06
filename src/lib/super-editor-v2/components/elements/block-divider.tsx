'use client'

/**
 * Block Divider - 블록 간 구분선
 *
 * 청첩장의 섹션(블록) 사이에 삽입되는 장식 구분선
 * 기존 DividerElement를 래핑하여 블록 간 컨텍스트에 맞게 스타일링
 */

import { type CSSProperties } from 'react'
import { DividerElement } from './divider-element'
import { BLOCK_DIVIDER_SPACING, BLOCK_DIVIDER_DEFAULT_ORNAMENT } from '../../presets/blocks/tokens'

// ============================================
// Types
// ============================================

export type BlockDividerVariant = 'none' | 'line' | 'ornament' | 'spacing'
export type BlockDividerOrnament = 'heart-center' | 'diamond-center' | 'leaves' | 'line-dots' | 'flourish' | 'wave' | 'star-center' | 'double-line'

export interface BlockDividerProps {
  /** Divider 스타일 변형 */
  variant?: BlockDividerVariant
  /** Ornament ID (variant가 'ornament'일 때만 적용) */
  ornamentId?: BlockDividerOrnament
  /** 상하 여백 (px) */
  spacing?: number
  /** 색상 (기본: --border-default) */
  color?: string
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function BlockDivider({
  variant = 'ornament',
  ornamentId = BLOCK_DIVIDER_DEFAULT_ORNAMENT,
  spacing = BLOCK_DIVIDER_SPACING,
  color,
  className = '',
}: BlockDividerProps) {
  // none인 경우 렌더링하지 않음
  if (variant === 'none') {
    return null
  }

  const containerStyle: CSSProperties = {
    padding: `${spacing}px 32px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  // spacing만 있는 경우 (구분선 없이 여백만)
  if (variant === 'spacing') {
    return (
      <div
        className={`se2-block-divider se2-block-divider--spacing ${className}`}
        style={containerStyle}
        aria-hidden="true"
      />
    )
  }

  // line 또는 ornament
  const dividerStyle = variant === 'line' ? 'solid' : 'ornament'

  return (
    <div
      className={`se2-block-divider se2-block-divider--${variant} ${className}`}
      style={containerStyle}
      aria-hidden="true"
    >
      <div style={{ width: '100%', maxWidth: '280px', height: '24px' }}>
        <DividerElement
          dividerStyle={dividerStyle}
          ornamentId={ornamentId}
          style={{
            text: { color: color ?? 'var(--border-default)' },
          }}
        />
      </div>
    </div>
  )
}

// ============================================
// Exports
// ============================================

export { BlockDivider as default }

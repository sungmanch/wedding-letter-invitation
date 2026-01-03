/**
 * Design Tokens for Block Presets
 *
 * 블록 프리셋에서 사용하는 디자인 토큰
 * 히어로를 제외한 일반 블록들의 일관된 스타일링을 위한 값들
 */

// ============================================
// Spacing Tokens
// ============================================

/** 블록 내 요소 간 기본 간격 (4rem = 64px) */
export const BLOCK_GAP = 64

/** 블록 내부 패딩 */
export const BLOCK_PADDING = {
  top: 40,
  right: 32,
  bottom: 40,
  left: 32,
} as const

/** 컴팩트 블록용 작은 간격 (1rem = 16px) */
export const BLOCK_GAP_COMPACT = 16

/** 컴팩트 블록 내부 패딩 */
export const BLOCK_PADDING_COMPACT = {
  top: 24,
  right: 24,
  bottom: 24,
  left: 24,
} as const

/**
 * Design Tokens for Block Presets
 *
 * 블록 프리셋에서 사용하는 디자인 토큰
 * 히어로를 제외한 일반 블록들의 일관된 스타일링을 위한 값들
 */

// ============================================
// Spacing Tokens
// ============================================

/** 블록 내 요소 간 기본 간격 (3rem = 48px) */
export const BLOCK_GAP = 48

/** 넓은 간격이 필요한 블록용 (4rem = 64px) - greeting-parents 등 */
export const BLOCK_GAP_WIDE = 64

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

// ============================================
// Typography Tokens
// ============================================

/** 폰트 크기 토큰 (px 단위) */
export const FONT_SIZE = {
  xs: 10, // 카운트다운 라벨, 세례명
  sm: 12, // 서브타이틀, 라벨
  caption: 13, // 작은 본문, 부가 설명
  base: 14, // 기본 본문
  body: 15, // 본문 (약간 큰)
  md: 16, // 버튼, 강조 본문
  lg: 18, // 이름, 강조 텍스트
  xl: 20, // 섹션 타이틀
  '2xl': 22, // 블록 타이틀 (보조)
  '3xl': 24, // 블록 타이틀 (주요)
  '4xl': 28, // 디스플레이 숫자
} as const

export type FontSizeToken = keyof typeof FONT_SIZE

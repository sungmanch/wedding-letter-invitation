/**
 * Ending Block Presets - Shared Configuration
 *
 * 엔딩/공유 블록 프리셋의 공통 설정
 */

import type { VariablePath } from '../../../schema/types'

// ============================================
// Common Tags
// ============================================

export const ENDING_COMMON_TAGS = [
  'ending',
  'share',
  'outro',
  '엔딩',
  '공유',
  '마무리',
] as const

// ============================================
// Common Bindings
// ============================================

export const ENDING_COMMON_BINDINGS: readonly VariablePath[] = [
  'ending.message',
  'ending.photo',
]

/**
 * Message Block Shared Constants
 *
 * 방명록 블록 공통 상수 및 유틸리티
 */

import type { VariablePath } from '../../../schema/types'

// ============================================
// Common Bindings
// ============================================

export const MESSAGE_COMMON_BINDINGS: readonly VariablePath[] = [
  'guestbook.title',
  'guestbook.placeholder',
] as const

// ============================================
// Common Tags
// ============================================

export const MESSAGE_COMMON_TAGS = ['message', 'guestbook', '방명록', '축하'] as const

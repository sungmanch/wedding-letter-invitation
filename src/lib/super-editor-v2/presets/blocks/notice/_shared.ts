/**
 * Notice Block - Shared Configuration
 *
 * 공통 Auto Layout 설정 및 타입
 */

import type { BlockLayout, SizeMode } from '../../../schema/types'

// Auto Layout 기본 설정
export const AUTO_LAYOUT_VERTICAL: BlockLayout = {
  mode: 'auto',
  direction: 'vertical',
  gap: 16,
  padding: { top: 32, right: 32, bottom: 32, left: 32 },
  alignItems: 'center',
}

export const HUG_HEIGHT: SizeMode = { type: 'hug' }

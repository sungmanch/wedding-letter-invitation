/**
 * Greeting Parents Block - Shared Configuration
 *
 * 공통 Auto Layout 설정 및 타입
 */

import type { BlockLayout, SizeMode } from '../../../schema/types'
import { BLOCK_GAP_WIDE, BLOCK_PADDING } from '../tokens'

// Auto Layout 기본 설정
export const AUTO_LAYOUT_VERTICAL: BlockLayout = {
  mode: 'auto',
  direction: 'vertical',
  gap: BLOCK_GAP_WIDE,
  padding: BLOCK_PADDING,
  alignItems: 'center',
}

export const HUG_HEIGHT: SizeMode = { type: 'hug' }

/**
 * Notice Block Presets Index
 *
 * 공지사항/안내 블록 프리셋 통합 export
 * 화환안내, 포토부스, 식사안내, 주차안내 등
 */

import type { BlockPreset } from '../types'

// Individual Preset Imports
import { NOTICE_CLASSIC_LABEL } from './classic-label'
import { NOTICE_CARD_ICON } from './card-icon'

// ============================================
// Type Exports
// ============================================

export type NoticePresetId = 'notice-classic-label' | 'notice-card-icon'

// ============================================
// Preset Registry
// ============================================

export const NOTICE_PRESETS: Record<NoticePresetId, BlockPreset> = {
  'notice-classic-label': NOTICE_CLASSIC_LABEL,
  'notice-card-icon': NOTICE_CARD_ICON,
}

// ============================================
// Helper Functions
// ============================================

export function getNoticePreset(id: NoticePresetId): BlockPreset {
  return NOTICE_PRESETS[id]
}

export function getNoticePresetIds(): NoticePresetId[] {
  return Object.keys(NOTICE_PRESETS) as NoticePresetId[]
}

export function getNoticePresetsByComplexity(
  complexity: 'low' | 'medium' | 'high'
): BlockPreset[] {
  return Object.values(NOTICE_PRESETS).filter((p) => p.complexity === complexity)
}

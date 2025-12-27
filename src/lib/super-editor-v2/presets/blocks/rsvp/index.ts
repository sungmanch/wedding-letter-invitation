/**
 * RSVP Block Presets Index
 *
 * 참석 여부 확인 블록 프리셋 통합 export
 * 팝업 모달 스타일 포함
 */

import type { BlockPreset } from '../types'

// Individual Preset Imports
import { RSVP_BASIC } from './basic'

// ============================================
// Type Exports
// ============================================

export type RsvpPresetId = 'rsvp-basic'

// ============================================
// Preset Registry
// ============================================

export const RSVP_PRESETS: Record<RsvpPresetId, BlockPreset> = {
  'rsvp-basic': RSVP_BASIC,
}

// ============================================
// Helper Functions
// ============================================

export function getRsvpPreset(id: RsvpPresetId): BlockPreset {
  return RSVP_PRESETS[id]
}

export function getRsvpPresetIds(): RsvpPresetId[] {
  return Object.keys(RSVP_PRESETS) as RsvpPresetId[]
}

export function getRsvpPresetsByComplexity(
  complexity: 'low' | 'medium' | 'high'
): BlockPreset[] {
  return Object.values(RSVP_PRESETS).filter((p) => p.complexity === complexity)
}

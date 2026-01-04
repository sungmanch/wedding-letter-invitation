/**
 * Ending Block Presets Index
 *
 * 엔딩/공유 블록 프리셋 통합 export
 */

import type { BlockPreset } from '../types'
import { ENDING_QUOTE_SHARE } from './quote-share'

// ============================================
// All Ending Presets
// ============================================

export const ENDING_PRESETS: Record<string, BlockPreset> = {
  'ending-quote-share': ENDING_QUOTE_SHARE,
}

// ============================================
// Type-safe Preset IDs
// ============================================

export type EndingPresetId = keyof typeof ENDING_PRESETS

// ============================================
// Helper Functions
// ============================================

/**
 * Get an ending preset by ID
 */
export function getEndingPreset(id: EndingPresetId): BlockPreset {
  return ENDING_PRESETS[id]
}

/**
 * Get all ending preset IDs
 */
export function getEndingPresetIds(): EndingPresetId[] {
  return Object.keys(ENDING_PRESETS) as EndingPresetId[]
}

/**
 * Get ending presets by complexity
 */
export function getEndingPresetsByComplexity(
  complexity: 'low' | 'medium' | 'high'
): BlockPreset[] {
  return Object.values(ENDING_PRESETS).filter(p => p.complexity === complexity)
}

// Re-export individual presets
export { ENDING_QUOTE_SHARE } from './quote-share'

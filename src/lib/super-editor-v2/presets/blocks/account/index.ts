/**
 * Account Block Presets
 *
 * 축의금 계좌 정보 블록 프리셋
 */

import type { BlockPreset } from '../types'
import { ACCOUNT_TAB_CARD } from './tab-card'

// ============================================
// Preset Registry
// ============================================

export const ACCOUNT_PRESETS: Record<AccountPresetId, BlockPreset> = {
  'account-tab-card': ACCOUNT_TAB_CARD,
}

// ============================================
// Types
// ============================================

export type AccountPresetId = 'account-tab-card'

// ============================================
// Helper Functions
// ============================================

/**
 * Get account preset by ID
 */
export function getAccountPreset(id: AccountPresetId): BlockPreset {
  return ACCOUNT_PRESETS[id]
}

/**
 * Get all account preset IDs
 */
export function getAccountPresetIds(): AccountPresetId[] {
  return Object.keys(ACCOUNT_PRESETS) as AccountPresetId[]
}

/**
 * Get account presets by complexity
 */
export function getAccountPresetsByComplexity(
  complexity: 'low' | 'medium' | 'high'
): BlockPreset[] {
  return Object.values(ACCOUNT_PRESETS).filter(p => p.complexity === complexity)
}

// Re-export individual presets
export { ACCOUNT_TAB_CARD } from './tab-card'

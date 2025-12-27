/**
 * Contact Block Presets Index
 *
 * 연락처 오버레이 블록 프리셋 통합 export
 * 버튼 클릭 시 표시되는 연락처 정보 블록
 */

import type { BlockPreset } from '../types'

// Individual Preset Imports
import { CONTACT_MINIMAL } from './minimal'

// ============================================
// Type Exports
// ============================================

export type ContactPresetId = 'contact-minimal'

// ============================================
// Preset Registry
// ============================================

export const CONTACT_PRESETS: Record<ContactPresetId, BlockPreset> = {
  'contact-minimal': CONTACT_MINIMAL,
}

// ============================================
// Helper Functions
// ============================================

export function getContactPreset(id: ContactPresetId): BlockPreset {
  return CONTACT_PRESETS[id]
}

export function getContactPresetIds(): ContactPresetId[] {
  return Object.keys(CONTACT_PRESETS) as ContactPresetId[]
}

export function getContactPresetsByComplexity(
  complexity: 'low' | 'medium' | 'high'
): BlockPreset[] {
  return Object.values(CONTACT_PRESETS).filter((p) => p.complexity === complexity)
}

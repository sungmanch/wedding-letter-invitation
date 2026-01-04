/**
 * Location Block - Presets Index
 *
 * 오시는길 블록 프리셋 통합 export
 */

import type { BlockPreset } from '../types'
import { LOCATION_MINIMAL } from './minimal'
import { LOCATION_WITH_TEL } from './with-tel'
import { LOCATION_WITH_TRANSPORT } from './with-transport'

// ============================================
// Preset Registry
// ============================================

export const LOCATION_PRESETS: Record<LocationPresetId, BlockPreset> = {
  'location-minimal': LOCATION_MINIMAL,
  'location-with-tel': LOCATION_WITH_TEL,
  'location-with-transport': LOCATION_WITH_TRANSPORT,
}

// ============================================
// Types
// ============================================

export type LocationPresetId = 'location-minimal' | 'location-with-tel' | 'location-with-transport'

// ============================================
// Helper Functions
// ============================================

/**
 * Get a location preset by ID
 */
export function getLocationPreset(id: LocationPresetId): BlockPreset {
  return LOCATION_PRESETS[id]
}

/**
 * Get all location preset IDs
 */
export function getLocationPresetIds(): LocationPresetId[] {
  return Object.keys(LOCATION_PRESETS) as LocationPresetId[]
}

/**
 * Get location presets by complexity
 */
export function getLocationPresetsByComplexity(
  complexity: 'low' | 'medium' | 'high'
): BlockPreset[] {
  return Object.values(LOCATION_PRESETS).filter(p => p.complexity === complexity)
}

// Re-export individual presets
export { LOCATION_MINIMAL } from './minimal'
export { LOCATION_WITH_TEL } from './with-tel'
export { LOCATION_WITH_TRANSPORT } from './with-transport'

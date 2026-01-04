/**
 * Message Block Presets Index
 *
 * 방명록/축하 메시지 블록 프리셋 통합 export
 */

import type { BlockPreset } from '../types'

// Individual Preset Imports
import { MESSAGE_MINIMAL } from './minimal'

// ============================================
// Type Exports
// ============================================

export type MessagePresetId = 'message-minimal'

// ============================================
// Preset Registry
// ============================================

export const MESSAGE_PRESETS: Record<MessagePresetId, BlockPreset> = {
  'message-minimal': MESSAGE_MINIMAL,
}

// ============================================
// Helper Functions
// ============================================

export function getMessagePreset(id: MessagePresetId): BlockPreset {
  return MESSAGE_PRESETS[id]
}

export function getMessagePresetIds(): MessagePresetId[] {
  return Object.keys(MESSAGE_PRESETS) as MessagePresetId[]
}

export function getMessagePresetsByComplexity(
  complexity: 'low' | 'medium' | 'high'
): BlockPreset[] {
  return Object.values(MESSAGE_PRESETS).filter((p) => p.complexity === complexity)
}

/**
 * Interview Block Presets Index
 *
 * 인터뷰 Q&A 섹션 프리셋 통합 export
 */

import type { BlockPreset } from '../types'

// Individual Preset Imports
import { INTERVIEW_ACCORDION } from './accordion'

// ============================================
// Type Exports
// ============================================

export type InterviewPresetId = 'interview-accordion'

// ============================================
// Preset Registry
// ============================================

export const INTERVIEW_PRESETS: Record<InterviewPresetId, BlockPreset> = {
  'interview-accordion': INTERVIEW_ACCORDION,
}

// ============================================
// Helper Functions
// ============================================

export function getInterviewPreset(id: InterviewPresetId): BlockPreset {
  return INTERVIEW_PRESETS[id]
}

export function getInterviewPresetIds(): InterviewPresetId[] {
  return Object.keys(INTERVIEW_PRESETS) as InterviewPresetId[]
}

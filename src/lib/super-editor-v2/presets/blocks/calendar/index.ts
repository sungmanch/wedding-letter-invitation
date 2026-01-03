/**
 * Calendar Block Presets Index
 *
 * 캘린더 / 날짜 섹션 프리셋 통합 export
 */

import type { BlockPreset } from '../types'

// Individual Preset Imports
import { CALENDAR_KOREAN_COUNTDOWN_BOX } from './korean-countdown-box'
import { CALENDAR_HEART_STRIP_COUNTDOWN } from './heart-strip-countdown'

// ============================================
// Type Exports
// ============================================

export type CalendarPresetId = 'calendar-korean-countdown-box' | 'calendar-heart-strip-countdown'

// ============================================
// Preset Registry
// ============================================

export const CALENDAR_PRESETS: Record<CalendarPresetId, BlockPreset> = {
  'calendar-korean-countdown-box': CALENDAR_KOREAN_COUNTDOWN_BOX,
  'calendar-heart-strip-countdown': CALENDAR_HEART_STRIP_COUNTDOWN,
}

// ============================================
// Helper Functions
// ============================================

export function getCalendarPreset(id: CalendarPresetId): BlockPreset {
  return CALENDAR_PRESETS[id]
}

export function getCalendarPresetIds(): CalendarPresetId[] {
  return Object.keys(CALENDAR_PRESETS) as CalendarPresetId[]
}

export function getCalendarPresetsByComplexity(
  complexity: 'low' | 'medium' | 'high'
): BlockPreset[] {
  return Object.values(CALENDAR_PRESETS).filter((p) => p.complexity === complexity)
}

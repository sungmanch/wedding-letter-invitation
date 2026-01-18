/**
 * Calendar Block Presets Index
 *
 * 캘린더 / 날짜 섹션 프리셋 통합 export
 */

import type { BlockPreset } from '../types'

// Individual Preset Imports
import { CALENDAR_KOREAN_COUNTDOWN_BOX } from './korean-countdown-box'
import { CALENDAR_HEART_STRIP_COUNTDOWN } from './heart-strip-countdown'
import {
  CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_1,
  CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_2,
  CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_3,
  CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_4,
  CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_5,
  CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_6,
  CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_7,
  CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_8,
  CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_9,
  CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_10,
  CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_11,
  CALENDAR_MONTH_IMAGE_COUNTDOWN_ALL_STYLES,
  createMonthImageCountdownPreset,
} from './month-image-countdown'

// ============================================
// Type Exports
// ============================================

export type CalendarPresetId =
  | 'calendar-korean-countdown-box'
  | 'calendar-heart-strip-countdown'
  | 'calendar-month-image-countdown'
  | `calendar-month-image-countdown-style-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11}`

// ============================================
// Preset Registry
// ============================================

export const CALENDAR_PRESETS: Record<string, BlockPreset> = {
  'calendar-korean-countdown-box': CALENDAR_KOREAN_COUNTDOWN_BOX,
  'calendar-heart-strip-countdown': CALENDAR_HEART_STRIP_COUNTDOWN,
  // 11개 이미지 캘린더 스타일
  'calendar-month-image-countdown-style-1': CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_1,
  'calendar-month-image-countdown-style-2': CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_2,
  'calendar-month-image-countdown-style-3': CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_3,
  'calendar-month-image-countdown-style-4': CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_4,
  'calendar-month-image-countdown-style-5': CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_5,
  'calendar-month-image-countdown-style-6': CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_6,
  'calendar-month-image-countdown-style-7': CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_7,
  'calendar-month-image-countdown-style-8': CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_8,
  'calendar-month-image-countdown-style-9': CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_9,
  'calendar-month-image-countdown-style-10': CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_10,
  'calendar-month-image-countdown-style-11': CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_11,
}

// Re-export for external use
export { CALENDAR_MONTH_IMAGE_COUNTDOWN_ALL_STYLES, createMonthImageCountdownPreset }

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

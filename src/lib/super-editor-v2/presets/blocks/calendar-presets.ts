/**
 * Super Editor v2 - Calendar Block Presets
 *
 * date skeleton → calendar block 마이그레이션
 * 10개 variants
 */

import type { BlockPreset, PresetElement } from './types'

// ============================================
// Calendar Preset IDs
// ============================================

export type CalendarPresetId = 'calendar-korean-countdown-box'

// ============================================
// Default Elements
// ============================================

const KOREAN_COUNTDOWN_BOX_ELEMENTS: PresetElement[] = [
  // Wedding Day Title (script font)
  {
    type: 'text',
    x: 20,
    y: 2,
    width: 60,
    height: 4,
    zIndex: 1,
    value: 'Wedding Day',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 20,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        letterSpacing: 0.1,
      },
    },
  },
  // Full Date Display (Korean)
  {
    type: 'text',
    x: 5,
    y: 7,
    width: 90,
    height: 5,
    zIndex: 1,
    binding: 'wedding.dateDisplay',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 18,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
    },
  },
  // Month Title
  {
    type: 'text',
    x: 40,
    y: 14,
    width: 20,
    height: 5,
    zIndex: 1,
    binding: 'wedding.month',
    props: { type: 'text', format: '{wedding.month}월' },
    style: {
      text: {
        fontSize: 20,
        fontWeight: 600,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
    },
  },
  // Calendar Grid
  {
    type: 'calendar',
    x: 5,
    y: 20,
    width: 90,
    height: 45,
    zIndex: 1,
    binding: 'wedding.date',
    props: {
      type: 'calendar',
      showDday: true,
      highlightColor: 'var(--accent-default)',
    },
  },
  // Countdown Label - DAYS
  {
    type: 'text',
    x: 8,
    y: 66,
    width: 18,
    height: 3,
    zIndex: 2,
    value: 'DAYS',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 10,
        fontWeight: 500,
        color: 'var(--fg-muted)',
        textAlign: 'center',
      },
    },
  },
  // Countdown Box - Days
  {
    type: 'text',
    x: 8,
    y: 68,
    width: 18,
    height: 10,
    zIndex: 1,
    binding: 'countdown.days',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 32,
        fontWeight: 600,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
      background: 'var(--bg-card)',
      border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 8 },
    },
  },
  // Countdown Label - HOUR
  {
    type: 'text',
    x: 30,
    y: 66,
    width: 18,
    height: 3,
    zIndex: 2,
    value: 'HOUR',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 10,
        fontWeight: 500,
        color: 'var(--fg-muted)',
        textAlign: 'center',
      },
    },
  },
  // Countdown Box - Hours
  {
    type: 'text',
    x: 30,
    y: 68,
    width: 18,
    height: 10,
    zIndex: 1,
    binding: 'countdown.hours',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 32,
        fontWeight: 600,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
      background: 'var(--bg-card)',
      border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 8 },
    },
  },
  // Countdown Label - MIN
  {
    type: 'text',
    x: 52,
    y: 66,
    width: 18,
    height: 3,
    zIndex: 2,
    value: 'MIN',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 10,
        fontWeight: 500,
        color: 'var(--fg-muted)',
        textAlign: 'center',
      },
    },
  },
  // Countdown Box - Minutes
  {
    type: 'text',
    x: 52,
    y: 68,
    width: 18,
    height: 10,
    zIndex: 1,
    binding: 'countdown.minutes',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 32,
        fontWeight: 600,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
      background: 'var(--bg-card)',
      border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 8 },
    },
  },
  // Countdown Label - SEC
  {
    type: 'text',
    x: 74,
    y: 66,
    width: 18,
    height: 3,
    zIndex: 2,
    value: 'SEC',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 10,
        fontWeight: 500,
        color: 'var(--fg-muted)',
        textAlign: 'center',
      },
    },
  },
  // Countdown Box - Seconds
  {
    type: 'text',
    x: 74,
    y: 68,
    width: 18,
    height: 10,
    zIndex: 1,
    binding: 'countdown.seconds',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 32,
        fontWeight: 600,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
      background: 'var(--bg-card)',
      border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 8 },
    },
  },
  // Couple Names with Heart and D-day message
  {
    type: 'text',
    x: 5,
    y: 82,
    width: 90,
    height: 5,
    zIndex: 1,
    props: {
      type: 'text',
      format: '{couple.groom.name} ❤️ {couple.bride.name}의 결혼식이 {wedding.dday}일 남았습니다.',
    },
    style: {
      text: {
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
    },
  },
]

// ============================================
// Calendar Block Presets
// ============================================

export const CALENDAR_PRESETS: Record<CalendarPresetId, BlockPreset> = {
  'calendar-korean-countdown-box': {
    id: 'calendar-korean-countdown-box',
    blockType: 'calendar',
    variant: 'korean-countdown-box',
    name: 'Korean Countdown Box',
    nameKo: '한글 카운트다운 박스',
    description:
      '한글 전체 날짜 표기와 4칸 박스형 카운트다운, 커플 이름과 D-day 메시지가 포함된 따뜻한 캘린더',
    tags: ['korean', 'countdown', 'warm', 'romantic', 'box-style'],
    complexity: 'medium',
    bindings: [
      'wedding.date',
      'wedding.dateDisplay',
      'wedding.month',
      'wedding.dday',
      'countdown.days',
      'countdown.hours',
      'countdown.minutes',
      'countdown.seconds',
      'couple.groom.name',
      'couple.bride.name',
    ],
    defaultHeight: 90,
    defaultElements: KOREAN_COUNTDOWN_BOX_ELEMENTS,
    specialComponents: ['calendar', 'countdown'],
    recommendedAnimations: ['fade-in', 'stagger-fade-up', 'number-flip'],
    recommendedThemes: ['classic-ivory', 'romantic-blush', 'cinematic-warm'],
    aiHints: {
      mood: ['warm', 'romantic', 'elegant'],
      style: ['korean-style', 'box-countdown', 'full-date'],
      useCase: ['한글 청첩장', '카운트다운 강조', 'D-day 표시'],
    },
  },
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

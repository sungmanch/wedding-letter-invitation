/**
 * Super Editor v2 - Calendar Block Presets
 *
 * date skeleton → calendar block 마이그레이션
 * Phase 5: Auto Layout + Group 마이그레이션
 */

import type { BlockPreset, PresetElement } from './types'
import type { BlockLayout, SizeMode } from '../../schema/types'

// ============================================
// Auto Layout Configuration
// ============================================

const AUTO_LAYOUT_VERTICAL: BlockLayout = {
  mode: 'auto',
  direction: 'vertical',
  gap: 16,
  padding: { top: 32, right: 20, bottom: 32, left: 20 },
  alignItems: 'center',
}

const HUG_HEIGHT: SizeMode = { type: 'hug' }

// ============================================
// Calendar Preset IDs
// ============================================

export type CalendarPresetId = 'calendar-korean-countdown-box'

// ============================================
// Korean Countdown Box Elements (Auto Layout + Group)
// ============================================

const KOREAN_COUNTDOWN_BOX_ELEMENTS: PresetElement[] = [
  // 1. Wedding Day Title
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    value: 'WEDDING DAY',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        letterSpacing: 0.15,
      },
    },
  },
  // 2. Full Date Display (Korean)
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'wedding.dateDisplay',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 20,
        fontWeight: 500,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
    },
  },
  // 3. Month Divider Group (divider - month - divider)
  {
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'group',
      layout: {
        direction: 'horizontal',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    children: [
      // Left Divider
      {
        id: 'month-divider-left',
        type: 'divider',
        zIndex: 1,
        sizing: { width: { type: 'fixed', value: 80, unit: 'px' }, height: { type: 'fixed', value: 1, unit: 'px' } },
        props: { type: 'divider', dividerStyle: 'solid' },
        style: { background: 'var(--border-default)' },
      },
      // Month Title
      {
        id: 'month-title',
        type: 'text',
        zIndex: 2,
        sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
        binding: 'wedding.month',
        props: { type: 'text', format: '{wedding.month}월' },
        style: {
          text: {
            fontSize: 16,
            fontWeight: 500,
            color: 'var(--fg-default)',
            textAlign: 'center',
          },
        },
      },
      // Right Divider
      {
        id: 'month-divider-right',
        type: 'divider',
        zIndex: 1,
        sizing: { width: { type: 'fixed', value: 80, unit: 'px' }, height: { type: 'fixed', value: 1, unit: 'px' } },
        props: { type: 'divider', dividerStyle: 'solid' },
        style: { background: 'var(--border-default)' },
      },
    ],
  },
  // 4. Calendar Grid with Heart Marker
  {
    type: 'calendar',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'fixed', value: 280, unit: 'px' } },
    binding: 'wedding.date',
    props: {
      type: 'calendar',
      showDday: false,
      highlightColor: '#EF90CB',
      markerType: 'heart',
    },
  },
  // 5. Bottom Divider
  {
    type: 'divider',
    zIndex: 1,
    sizing: { width: { type: 'fixed', value: 80, unit: '%' }, height: { type: 'fixed', value: 1, unit: 'px' } },
    alignSelf: 'center',
    props: { type: 'divider', dividerStyle: 'solid' },
    style: { background: 'var(--border-default)' },
  },
  // 6. D-day Message Group (커플 이름 + 하트 + D-day)
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'text',
      format: '{couple.groom.name} ♥ {couple.bride.name}의 결혼식이 {wedding.dday}일 남았습니다.',
    },
    style: {
      text: {
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  },
  // 7. Countdown Boxes Group (DAYS, HOURS, MINUTES, SECONDS)
  {
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'group',
      layout: {
        direction: 'horizontal',
        gap: 8,
        alignItems: 'start',
        justifyContent: 'center',
      },
    },
    children: [
      // Days Box
      {
        id: 'countdown-days',
        type: 'group',
        zIndex: 1,
        sizing: { width: { type: 'fixed', value: 70, unit: 'px' }, height: { type: 'hug' } },
        props: {
          type: 'group',
          layout: { direction: 'vertical', gap: 4, alignItems: 'center' },
        },
        children: [
          {
            id: 'label-days',
            type: 'text',
            zIndex: 2,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            value: 'DAYS',
            props: { type: 'text' },
            style: {
              text: { fontSize: 10, fontWeight: 500, color: 'var(--fg-muted)', textAlign: 'center' },
            },
          },
          {
            id: 'value-days',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'fixed', value: 60, unit: 'px' } },
            binding: 'countdown.days',
            props: { type: 'text' },
            style: {
              text: { fontSize: 32, fontWeight: 600, color: 'var(--fg-default)', textAlign: 'center' },
              background: 'var(--bg-card)',
              border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 8 },
            },
          },
        ],
      },
      // Hours Box
      {
        id: 'countdown-hours',
        type: 'group',
        zIndex: 1,
        sizing: { width: { type: 'fixed', value: 70, unit: 'px' }, height: { type: 'hug' } },
        props: {
          type: 'group',
          layout: { direction: 'vertical', gap: 4, alignItems: 'center' },
        },
        children: [
          {
            id: 'label-hours',
            type: 'text',
            zIndex: 2,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            value: 'HOURS',
            props: { type: 'text' },
            style: {
              text: { fontSize: 10, fontWeight: 500, color: 'var(--fg-muted)', textAlign: 'center' },
            },
          },
          {
            id: 'value-hours',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'fixed', value: 60, unit: 'px' } },
            binding: 'countdown.hours',
            props: { type: 'text' },
            style: {
              text: { fontSize: 32, fontWeight: 600, color: 'var(--fg-default)', textAlign: 'center' },
              background: 'var(--bg-card)',
              border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 8 },
            },
          },
        ],
      },
      // Minutes Box
      {
        id: 'countdown-minutes',
        type: 'group',
        zIndex: 1,
        sizing: { width: { type: 'fixed', value: 70, unit: 'px' }, height: { type: 'hug' } },
        props: {
          type: 'group',
          layout: { direction: 'vertical', gap: 4, alignItems: 'center' },
        },
        children: [
          {
            id: 'label-minutes',
            type: 'text',
            zIndex: 2,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            value: 'MINUTES',
            props: { type: 'text' },
            style: {
              text: { fontSize: 10, fontWeight: 500, color: 'var(--fg-muted)', textAlign: 'center' },
            },
          },
          {
            id: 'value-minutes',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'fixed', value: 60, unit: 'px' } },
            binding: 'countdown.minutes',
            props: { type: 'text' },
            style: {
              text: { fontSize: 32, fontWeight: 600, color: 'var(--fg-default)', textAlign: 'center' },
              background: 'var(--bg-card)',
              border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 8 },
            },
          },
        ],
      },
      // Seconds Box
      {
        id: 'countdown-seconds',
        type: 'group',
        zIndex: 1,
        sizing: { width: { type: 'fixed', value: 70, unit: 'px' }, height: { type: 'hug' } },
        props: {
          type: 'group',
          layout: { direction: 'vertical', gap: 4, alignItems: 'center' },
        },
        children: [
          {
            id: 'label-seconds',
            type: 'text',
            zIndex: 2,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            value: 'SECONDS',
            props: { type: 'text' },
            style: {
              text: { fontSize: 10, fontWeight: 500, color: 'var(--fg-muted)', textAlign: 'center' },
            },
          },
          {
            id: 'value-seconds',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'fixed', value: 60, unit: 'px' } },
            binding: 'countdown.seconds',
            props: { type: 'text' },
            style: {
              text: { fontSize: 32, fontWeight: 600, color: 'var(--fg-default)', textAlign: 'center' },
              background: 'var(--bg-card)',
              border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 8 },
            },
          },
        ],
      },
    ],
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
      '한글 전체 날짜 표기와 4칸 박스형 카운트다운, 커플 이름과 D-day 메시지가 포함된 따뜻한 캘린더 (Auto Layout)',
    tags: ['korean', 'countdown', 'warm', 'romantic', 'box-style', 'auto-layout'],
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
    defaultHeight: HUG_HEIGHT,
    layout: AUTO_LAYOUT_VERTICAL,
    defaultElements: KOREAN_COUNTDOWN_BOX_ELEMENTS,
    specialComponents: ['calendar', 'countdown', 'group'],
    recommendedAnimations: ['fade-in', 'stagger-fade-up', 'number-flip'],
    recommendedThemes: ['classic-ivory', 'romantic-blush', 'cinematic-warm'],
    aiHints: {
      mood: ['warm', 'romantic', 'elegant'],
      style: ['korean-style', 'box-countdown', 'full-date', 'auto-layout'],
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

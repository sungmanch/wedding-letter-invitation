/**
 * Calendar Block - Month Image Countdown Preset Factory
 *
 * 월 이미지(JANUARY~DECEMBER)와 이미지 기반 날짜, 4칸 박스형 카운트다운,
 * 커플 이름과 D-day 메시지가 포함된 캘린더 (Auto Layout)
 *
 * 11개 스타일 지원 (스타일 1-11)
 */

import type { BlockPreset, PresetElement } from '../types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'
import { FONT_SIZE } from '../tokens'

// ============================================
// Factory Function
// ============================================

function createElements(styleId: number): PresetElement[] {
  return [
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
    // 3. Divider
    {
      type: 'divider',
      zIndex: 1,
      sizing: {
        width: { type: 'fixed', value: 80, unit: '%' },
        height: { type: 'fixed', value: 1, unit: 'px' },
      },
      alignSelf: 'center',
      props: { type: 'divider', dividerStyle: 'solid' },
      style: { background: 'var(--border-default)' },
    },
    // 4. Calendar Grid with Image Style
    {
      type: 'calendar',
      zIndex: 1,
      sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
      binding: 'wedding.date',
      props: {
        type: 'calendar',
        showDday: false,
        showHeader: false,
        showFooter: false,
        highlightColor: '#EF90CB',
        markerType: 'heart',
        highlightTextColor: '#FFFFFF',
        imageStyle: styleId, // 이미지 캘린더 스타일
      },
    },
    // 5. Bottom Divider
    {
      type: 'divider',
      zIndex: 1,
      sizing: {
        width: { type: 'fixed', value: 80, unit: '%' },
        height: { type: 'fixed', value: 1, unit: 'px' },
      },
      alignSelf: 'center',
      props: { type: 'divider', dividerStyle: 'solid' },
      style: { background: 'var(--border-default)' },
    },
    // 6. D-day Message Group (커플 이름 + 하트 + D-day) - 인라인 그룹으로 분리
    {
      type: 'group',
      zIndex: 1,
      sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
      props: {
        type: 'group',
        layout: {
          direction: 'horizontal',
          gap: 0,
          alignItems: 'center',
          justifyContent: 'center',
          wrap: true,
        },
      },
      children: [
        // 신랑 이름
        {
          id: 'dday-groom-name',
          type: 'text',
          zIndex: 1,
          sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
          binding: 'couple.groom.name',
          props: { type: 'text' },
          style: {
            text: {
              fontSize: FONT_SIZE.base,
              fontWeight: 400,
              color: 'var(--fg-default)',
              lineHeight: 1.6,
            },
          },
        },
        // 하트 아이콘 (외곽선 스타일)
        {
          id: 'dday-heart-icon',
          type: 'icon',
          zIndex: 1,
          sizing: {
            width: { type: 'fixed', value: 20, unit: 'px' },
            height: { type: 'fixed', value: 20, unit: 'px' },
          },
          props: {
            type: 'icon',
            icon: 'heart-outline',
            size: 16,
            color: '#EF90CB',
          },
        },
        // 신부 이름 + "의 결혼식이"
        {
          id: 'dday-bride-text',
          type: 'text',
          zIndex: 1,
          sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
          props: { type: 'text', format: '{couple.bride.name}의 결혼식이 ' },
          style: {
            text: {
              fontSize: FONT_SIZE.base,
              fontWeight: 400,
              color: 'var(--fg-default)',
              lineHeight: 1.6,
            },
          },
        },
        // D-day 숫자 (강조 색상)
        {
          id: 'dday-number',
          type: 'text',
          zIndex: 1,
          sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
          binding: 'wedding.dday',
          props: { type: 'text' },
          style: {
            text: { fontSize: FONT_SIZE.base, fontWeight: 600, color: '#EF90CB', lineHeight: 1.6 },
          },
        },
        // "일 남았습니다."
        {
          id: 'dday-suffix',
          type: 'text',
          zIndex: 1,
          sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
          value: '일 남았습니다.',
          props: { type: 'text' },
          style: {
            text: {
              fontSize: FONT_SIZE.base,
              fontWeight: 400,
              color: 'var(--fg-default)',
              lineHeight: 1.6,
            },
          },
        },
      ],
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
        // Days Box - 2겹 박스 구조
        {
          id: 'countdown-days',
          type: 'group',
          zIndex: 1,
          sizing: { width: { type: 'fixed', value: 70, unit: 'px' }, height: { type: 'hug' } },
          props: {
            type: 'group',
            layout: { direction: 'vertical', gap: 0, alignItems: 'center' },
          },
          style: {
            background: 'var(--bg-card)',
            border: { width: 1, color: 'var(--border-muted)', style: 'solid', radius: 8 },
            padding: { top: 8, right: 8, bottom: 8, left: 8 },
          },
          children: [
            // 내부 박스
            {
              id: 'inner-box-days',
              type: 'group',
              zIndex: 1,
              sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
              props: {
                type: 'group',
                layout: { direction: 'vertical', gap: 4, alignItems: 'center' },
              },
              style: {
                background: 'var(--bg-card)',
                border: { width: 1, color: 'var(--border-muted)', style: 'solid', radius: 2 },
                padding: { top: 8, right: 8, bottom: 12, left: 8 },
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
                    text: {
                      fontSize: FONT_SIZE.xs,
                      fontWeight: 500,
                      color: 'var(--fg-muted)',
                      textAlign: 'center',
                    },
                  },
                },
                {
                  id: 'value-days',
                  type: 'text',
                  zIndex: 1,
                  sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
                  binding: 'countdown.days',
                  props: { type: 'text' },
                  style: {
                    text: {
                      fontSize: FONT_SIZE['3xl'],
                      fontWeight: 600,
                      color: '#333333',
                      textAlign: 'center',
                    },
                  },
                },
              ],
            },
          ],
        },
        // Hours Box - 2겹 박스 구조
        {
          id: 'countdown-hours',
          type: 'group',
          zIndex: 1,
          sizing: { width: { type: 'fixed', value: 70, unit: 'px' }, height: { type: 'hug' } },
          props: {
            type: 'group',
            layout: { direction: 'vertical', gap: 0, alignItems: 'center' },
          },
          style: {
            background: 'var(--bg-card)',
            border: { width: 1, color: 'var(--border-muted)', style: 'solid', radius: 8 },
            padding: { top: 8, right: 8, bottom: 8, left: 8 },
          },
          children: [
            // 내부 박스
            {
              id: 'inner-box-hours',
              type: 'group',
              zIndex: 1,
              sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
              props: {
                type: 'group',
                layout: { direction: 'vertical', gap: 4, alignItems: 'center' },
              },
              style: {
                background: 'var(--bg-card)',
                border: { width: 1, color: 'var(--border-muted)', style: 'solid', radius: 2 },
                padding: { top: 8, right: 8, bottom: 12, left: 8 },
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
                    text: {
                      fontSize: FONT_SIZE.xs,
                      fontWeight: 500,
                      color: 'var(--fg-muted)',
                      textAlign: 'center',
                    },
                  },
                },
                {
                  id: 'value-hours',
                  type: 'text',
                  zIndex: 1,
                  sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
                  binding: 'countdown.hours',
                  props: { type: 'text' },
                  style: {
                    text: {
                      fontSize: FONT_SIZE['3xl'],
                      fontWeight: 600,
                      color: '#333333',
                      textAlign: 'center',
                    },
                  },
                },
              ],
            },
          ],
        },
        // Minutes Box - 2겹 박스 구조
        {
          id: 'countdown-minutes',
          type: 'group',
          zIndex: 1,
          sizing: { width: { type: 'fixed', value: 70, unit: 'px' }, height: { type: 'hug' } },
          props: {
            type: 'group',
            layout: { direction: 'vertical', gap: 0, alignItems: 'center' },
          },
          style: {
            background: 'var(--bg-card)',
            border: { width: 1, color: 'var(--border-muted)', style: 'solid', radius: 8 },
            padding: { top: 8, right: 8, bottom: 8, left: 8 },
          },
          children: [
            // 내부 박스
            {
              id: 'inner-box-minutes',
              type: 'group',
              zIndex: 1,
              sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
              props: {
                type: 'group',
                layout: { direction: 'vertical', gap: 4, alignItems: 'center' },
              },
              style: {
                background: 'var(--bg-card)',
                border: { width: 1, color: 'var(--border-muted)', style: 'solid', radius: 2 },
                padding: { top: 8, right: 8, bottom: 12, left: 8 },
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
                    text: {
                      fontSize: FONT_SIZE.xs,
                      fontWeight: 500,
                      color: 'var(--fg-muted)',
                      textAlign: 'center',
                    },
                  },
                },
                {
                  id: 'value-minutes',
                  type: 'text',
                  zIndex: 1,
                  sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
                  binding: 'countdown.minutes',
                  props: { type: 'text' },
                  style: {
                    text: {
                      fontSize: FONT_SIZE['3xl'],
                      fontWeight: 600,
                      color: '#333333',
                      textAlign: 'center',
                    },
                  },
                },
              ],
            },
          ],
        },
        // Seconds Box - 2겹 박스 구조
        {
          id: 'countdown-seconds',
          type: 'group',
          zIndex: 1,
          sizing: { width: { type: 'fixed', value: 70, unit: 'px' }, height: { type: 'hug' } },
          props: {
            type: 'group',
            layout: { direction: 'vertical', gap: 0, alignItems: 'center' },
          },
          style: {
            background: 'var(--bg-card)',
            border: { width: 1, color: 'var(--border-muted)', style: 'solid', radius: 8 },
            padding: { top: 8, right: 8, bottom: 8, left: 8 },
          },
          children: [
            // 내부 박스
            {
              id: 'inner-box-seconds',
              type: 'group',
              zIndex: 1,
              sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
              props: {
                type: 'group',
                layout: { direction: 'vertical', gap: 4, alignItems: 'center' },
              },
              style: {
                background: 'var(--bg-card)',
                border: { width: 1, color: 'var(--border-muted)', style: 'solid', radius: 2 },
                padding: { top: 8, right: 8, bottom: 12, left: 8 },
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
                    text: {
                      fontSize: FONT_SIZE.xs,
                      fontWeight: 500,
                      color: 'var(--fg-muted)',
                      textAlign: 'center',
                    },
                  },
                },
                {
                  id: 'value-seconds',
                  type: 'text',
                  zIndex: 1,
                  sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
                  binding: 'countdown.seconds',
                  props: { type: 'text' },
                  style: {
                    text: {
                      fontSize: FONT_SIZE['3xl'],
                      fontWeight: 600,
                      color: '#333333',
                      textAlign: 'center',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ]
}

/**
 * 이미지 캘린더 프리셋 팩토리 함수
 * @param styleId 스타일 ID (1-11)
 */
export function createMonthImageCountdownPreset(styleId: number): BlockPreset {
  return {
    id: `calendar-month-image-countdown-style-${styleId}`,
    blockType: 'calendar',
    variant: `month-image-countdown-style-${styleId}`,
    name: `Month Image Countdown Style ${styleId}`,
    nameKo: `월 이미지 카운트다운 스타일 ${styleId}`,
    description: `영문 월 이미지와 이미지 기반 날짜(스타일 ${styleId}), 4칸 박스형 카운트다운, 커플 이름과 D-day 메시지가 포함된 캘린더 (Auto Layout)`,
    tags: [
      'month-image',
      'countdown',
      'english',
      'romantic',
      'box-style',
      'auto-layout',
      `style-${styleId}`,
    ],
    complexity: 'medium',
    bindings: [
      'wedding.date',
      'wedding.dateDisplay',
      'wedding.monthImageUrl',
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
    defaultElements: createElements(styleId),
    specialComponents: ['calendar', 'countdown', 'group', 'image'],
    recommendedAnimations: ['fade-in', 'stagger-fade-up', 'number-flip'],
    recommendedThemes: ['hero-classic-elegant', 'hero-dark-romantic', 'hero-casual-playful'],
    aiHints: {
      mood: ['romantic', 'elegant', 'classic'],
      style: ['month-image', 'box-countdown', 'full-date', 'auto-layout', `style-${styleId}`],
      useCase: ['영문 청첩장', '카운트다운 강조', 'D-day 표시', '월 이미지'],
    },
  }
}

// ============================================
// Generated Presets (Style 1-11)
// ============================================

export const CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_1 = createMonthImageCountdownPreset(1)
export const CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_2 = createMonthImageCountdownPreset(2)
export const CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_3 = createMonthImageCountdownPreset(3)
export const CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_4 = createMonthImageCountdownPreset(4)
export const CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_5 = createMonthImageCountdownPreset(5)
export const CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_6 = createMonthImageCountdownPreset(6)
export const CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_7 = createMonthImageCountdownPreset(7)
export const CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_8 = createMonthImageCountdownPreset(8)
export const CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_9 = createMonthImageCountdownPreset(9)
export const CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_10 = createMonthImageCountdownPreset(10)
export const CALENDAR_MONTH_IMAGE_COUNTDOWN_STYLE_11 = createMonthImageCountdownPreset(11)

// 모든 스타일 프리셋 배열
export const CALENDAR_MONTH_IMAGE_COUNTDOWN_ALL_STYLES = [
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
]

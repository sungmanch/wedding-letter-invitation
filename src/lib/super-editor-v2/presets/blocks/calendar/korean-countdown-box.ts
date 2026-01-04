/**
 * Calendar Block - Korean Countdown Box Preset
 *
 * 한글 전체 날짜 표기와 4칸 박스형 카운트다운,
 * 커플 이름과 D-day 메시지가 포함된 따뜻한 캘린더 (Auto Layout)
 */

import type { BlockPreset, PresetElement } from '../types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'
import { FONT_SIZE } from '../tokens'

const ELEMENTS: PresetElement[] = [
  // 1. Wedding Day Title
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    value: 'WEDDING DAY',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: FONT_SIZE.base,
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
  // 3. Divider
  {
    type: 'divider',
    zIndex: 1,
    sizing: { width: { type: 'fixed', value: 80, unit: '%' }, height: { type: 'fixed', value: 1, unit: 'px' } },
    alignSelf: 'center',
    props: { type: 'divider', dividerStyle: 'solid' },
    style: { background: 'var(--border-default)' },
  },
  // 4. Calendar Grid with Heart Marker
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
          text: { fontSize: FONT_SIZE.base, fontWeight: 400, color: 'var(--fg-default)', lineHeight: 1.6 },
        },
      },
      // 하트 아이콘 (외곽선 스타일)
      {
        id: 'dday-heart-icon',
        type: 'icon',
        zIndex: 1,
        sizing: { width: { type: 'fixed', value: 20, unit: 'px' }, height: { type: 'fixed', value: 20, unit: 'px' } },
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
          text: { fontSize: FONT_SIZE.base, fontWeight: 400, color: 'var(--fg-default)', lineHeight: 1.6 },
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
          text: { fontSize: FONT_SIZE.base, fontWeight: 400, color: 'var(--fg-default)', lineHeight: 1.6 },
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
                  text: { fontSize: FONT_SIZE.xs, fontWeight: 500, color: 'var(--fg-muted)', textAlign: 'center' },
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
                  text: { fontSize: FONT_SIZE['3xl'], fontWeight: 600, color: '#333333', textAlign: 'center' },
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
                  text: { fontSize: FONT_SIZE.xs, fontWeight: 500, color: 'var(--fg-muted)', textAlign: 'center' },
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
                  text: { fontSize: FONT_SIZE['3xl'], fontWeight: 600, color: '#333333', textAlign: 'center' },
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
                  text: { fontSize: FONT_SIZE.xs, fontWeight: 500, color: 'var(--fg-muted)', textAlign: 'center' },
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
                  text: { fontSize: FONT_SIZE['3xl'], fontWeight: 600, color: '#333333', textAlign: 'center' },
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
                  text: { fontSize: FONT_SIZE.xs, fontWeight: 500, color: 'var(--fg-muted)', textAlign: 'center' },
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
                  text: { fontSize: FONT_SIZE['3xl'], fontWeight: 600, color: '#333333', textAlign: 'center' },
                },
              },
            ],
          },
        ],
      },
    ],
  },
]

export const CALENDAR_KOREAN_COUNTDOWN_BOX: BlockPreset = {
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
  defaultElements: ELEMENTS,
  specialComponents: ['calendar', 'countdown', 'group'],
  recommendedAnimations: ['fade-in', 'stagger-fade-up', 'number-flip'],
  recommendedThemes: ['classic-ivory', 'romantic-blush', 'cinematic-warm'],
  aiHints: {
    mood: ['warm', 'romantic', 'elegant'],
    style: ['korean-style', 'box-countdown', 'full-date', 'auto-layout'],
    useCase: ['한글 청첩장', '카운트다운 강조', 'D-day 표시'],
  },
}
